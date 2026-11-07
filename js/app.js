/**
 * CyberGuard - Main Application Controller
 * Mengatur navigasi tab, perenderan sertifikat canvas, dan interaksi UI umum
 */

class AppController {
  constructor() {
    this.currentTab = 'materi';
    this.quizAnswers = {};
  }

  init() {
    this.renderLessons();
    this.renderPortDictionary();
    this.renderQuiz();
    this.setupEventListeners();
    simulator.renderRules();

    // Default audio icon
    this.updateAudioButton();
  }

  setupEventListeners() {
    // Tombol mute audio
    const muteBtn = document.getElementById('btn-toggle-audio');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = sounds.toggleMute();
        this.updateAudioButton();
      });
    }

    // Modal close
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        document.getElementById('level-complete-modal').classList.add('hidden');
      });
    }

    // Live search di Port Dictionary
    const searchPort = document.getElementById('port-search-input');
    if (searchPort) {
      searchPort.addEventListener('input', (e) => {
        this.renderPortDictionary(e.target.value);
      });
    }

    // Form Tambah Rule Simulator
    const simAddBtn = document.getElementById('sim-add-rule-btn');
    if (simAddBtn) {
      simAddBtn.addEventListener('click', () => {
        const action = document.getElementById('sim-new-action').value;
        const proto = document.getElementById('sim-new-proto').value;
        const port = document.getElementById('sim-new-port').value || 'Any';
        const src = document.getElementById('sim-new-src').value || 'Any';
        const comment = document.getElementById('sim-new-comment').value || 'Aturan Baru';

        simulator.addRule(action, proto, port, src, comment);
      });
    }

    // Tombol Kirim Paket Simulator
    const simSendBtn = document.getElementById('sim-send-btn');
    if (simSendBtn) {
      simSendBtn.addEventListener('click', () => {
        const srcIp = document.getElementById('sim-pkt-src').value || '182.253.10.12';
        const proto = document.getElementById('sim-pkt-proto').value;
        const destPort = document.getElementById('sim-pkt-port').value || 443;

        simulator.sendPacket({
          srcIp,
          proto,
          destPort
        });
      });
    }
  }

  updateAudioButton() {
    const muteBtn = document.getElementById('btn-toggle-audio');
    if (!muteBtn) return;
    const isMuted = sounds.isMuted();
    muteBtn.innerHTML = isMuted 
      ? `🔇 <span class="hidden sm:inline">Unmute</span>` 
      : `🔊 <span class="hidden sm:inline">Mute</span>`;
  }

  switchTab(tabId) {
    sounds.playClick();
    this.currentTab = tabId;

    // Sembunyikan semua tab content
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(c => c.classList.add('hidden'));

    // Tampilkan tab yang dipilih
    const target = document.getElementById(`tab-${tabId}`);
    if (target) {
      target.classList.remove('hidden');
    }

    // Update style tombol nav
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      const bTab = btn.getAttribute('data-tab');
      if (bTab === tabId) {
        btn.className = "nav-tab-btn px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 glow-cyan";
      } else {
        btn.className = "nav-tab-btn px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all text-slate-400 hover:text-slate-200 hover:bg-slate-800/60";
      }
    });

    // Inisialisasi otomatis jika masuk ke tab game
    if (tabId === 'game-l1') {
      gameEngine.startLevel1();
    } else if (tabId === 'game-l2') {
      gameEngine.startLevel2();
    } else if (tabId === 'game-l3') {
      gameEngine.startLevel3();
    } else if (tabId === 'certificate') {
      this.generateCertificate();
    }
  }

  renderLessons() {
    const container = document.getElementById('lessons-container');
    if (!container) return;

    container.innerHTML = '';
    FIREWALL_LESSONS.forEach((lesson, index) => {
      const card = document.createElement('div');
      card.className = "bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/40 transition-all";
      card.innerHTML = `
        <div class="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
          <h3 class="font-bold text-base text-cyan-300 flex items-center gap-2">
            <span>🛡️</span> ${lesson.title}
          </h3>
          <span class="text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
            ${lesson.badge}
          </span>
        </div>
        <p class="text-xs text-slate-400 mb-4">${lesson.summary}</p>
        <div class="pt-2 border-t border-slate-800/50">
          ${lesson.content}
        </div>
      `;
      container.appendChild(card);
    });
  }

  renderPortDictionary(keyword = '') {
    const tbody = document.getElementById('port-dict-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const filtered = PORT_DATABASE.filter(item => {
      if (!keyword) return true;
      const q = keyword.toLowerCase();
      return item.port.toString().includes(q) || 
             item.service.toLowerCase().includes(q) ||
             item.desc.toLowerCase().includes(q);
    });

    filtered.forEach(p => {
      const tr = document.createElement('tr');
      tr.className = "border-b border-slate-800 text-xs hover:bg-slate-800/30 transition-colors";

      let statusBadge = '';
      if (p.status === 'secure') {
        statusBadge = '<span class="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded">Aman Terenkripsi</span>';
      } else if (p.status === 'danger') {
        statusBadge = '<span class="text-rose-400 font-bold bg-rose-950/60 border border-rose-700/50 px-2 py-0.5 rounded">Bahaya / Rentan</span>';
      } else if (p.status === 'essential') {
        statusBadge = '<span class="text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-700/50 px-2 py-0.5 rounded">Esensial Jaringan</span>';
      } else {
        statusBadge = '<span class="text-amber-400 font-bold bg-amber-950/60 border border-amber-700/50 px-2 py-0.5 rounded">Waspada / Plaintext</span>';
      }

      tr.innerHTML = `
        <td class="py-2.5 px-3 font-mono text-cyan-400 font-bold">Port ${p.port}</td>
        <td class="py-2.5 px-3 font-mono text-slate-300 font-semibold">${p.proto}</td>
        <td class="py-2.5 px-3 font-bold text-slate-200">${p.service}</td>
        <td class="py-2.5 px-3">${statusBadge}</td>
        <td class="py-2.5 px-3 text-slate-400 text-xs">${p.desc}</td>
        <td class="py-2.5 px-3 font-mono text-xs text-indigo-300 font-bold">${p.recommended}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderQuiz() {
    const container = document.getElementById('quiz-questions-container');
    if (!container) return;

    container.innerHTML = '';
    QUIZ_QUESTIONS.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = "p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3";
      
      let optionsHtml = '';
      q.options.forEach((opt, optIdx) => {
        optionsHtml += `
          <button onclick="app.answerQuiz(${idx}, ${optIdx})" id="quiz-btn-${idx}-${optIdx}" 
            class="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-cyan-500/60 hover:bg-cyan-950/20 text-xs text-slate-300 transition-all font-mono">
            <span class="text-cyan-400 font-bold mr-2">${String.fromCharCode(65 + optIdx)}.</span> ${opt}
          </button>
        `;
      });

      card.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">#${idx + 1}</span>
          <h4 class="text-sm font-semibold text-slate-200">${q.q}</h4>
        </div>
        <div class="space-y-2 mt-2">
          ${optionsHtml}
        </div>
        <div id="quiz-explain-${idx}" class="hidden p-3 rounded-lg text-xs leading-relaxed"></div>
      `;
      container.appendChild(card);
    });
  }

  answerQuiz(qIdx, selectedOptIdx) {
    sounds.playClick();
    const q = QUIZ_QUESTIONS[qIdx];
    const explainBox = document.getElementById(`quiz-explain-${qIdx}`);
    const isCorrect = (selectedOptIdx === q.correct);

    // Tandai pilihan
    q.options.forEach((_, optIdx) => {
      const btn = document.getElementById(`quiz-btn-${qIdx}-${optIdx}`);
      if (!btn) return;
      btn.disabled = true;
      if (optIdx === q.correct) {
        btn.className = "w-full text-left p-3 rounded-lg border border-emerald-500 bg-emerald-950/60 text-emerald-300 text-xs font-mono font-bold";
      } else if (optIdx === selectedOptIdx && !isCorrect) {
        btn.className = "w-full text-left p-3 rounded-lg border border-rose-500 bg-rose-950/60 text-rose-300 text-xs font-mono";
      } else {
        btn.className = "w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-950/20 text-slate-600 text-xs font-mono opacity-40";
      }
    });

    if (explainBox) {
      if (isCorrect) {
        sounds.playAccept();
        explainBox.className = "p-3 rounded-lg text-xs leading-relaxed bg-emerald-950/60 border border-emerald-600/50 text-emerald-300";
        explainBox.innerHTML = `<strong>Jawaban Benar!</strong> ${q.explanation}`;
      } else {
        sounds.playError();
        explainBox.className = "p-3 rounded-lg text-xs leading-relaxed bg-rose-950/60 border border-rose-600/50 text-rose-300";
        explainBox.innerHTML = `<strong>Jawaban Kurang Tepat.</strong> ${q.explanation}`;
      }
      explainBox.classList.remove('hidden');
    }
  }

  // ==========================================
  // GENERASI SERTIFIKAT KELULUSAN SIJA
  // ==========================================
  generateCertificate() {
    const canvas = document.getElementById('cert-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const studentName = document.getElementById('cert-student-name')?.value.trim() || "Nama Siswa SIJA";
    const schoolName = document.getElementById('cert-school-name')?.value.trim() || "SMK Jurusan SIJA";
    const totalScore = gameEngine.stats.level1Score + gameEngine.stats.level2Score + gameEngine.stats.level3Score;

    // Bersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Background Elegan Gelap SOC
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#0b0f19');
    bgGradient.addColorStop(0.5, '#0e1726');
    bgGradient.addColorStop(1, '#05070e');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Garis Batas Bingkai Neon
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Aksen Sudut Cyber
    const drawCyberCorner = (x, y, dx, dy) => {
      ctx.fillStyle = '#00d2ff';
      ctx.fillRect(x, y, dx * 20, 4);
      ctx.fillRect(x, y, 4, dy * 20);
    };
    drawCyberCorner(30, 30, 1, 1);
    drawCyberCorner(canvas.width - 30, 30, -1, 1);
    drawCyberCorner(30, canvas.height - 30, 1, -1);
    drawCyberCorner(canvas.width - 30, canvas.height - 30, -1, -1);

    // 3. Header Sertifikat
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00d2ff';
    ctx.font = 'bold 16px "Fira Code", monospace';
    ctx.fillText('DIREKTORAT SISTEM KEAMANAN JARINGAN & KOMUNIKASI DATA', canvas.width / 2, 85);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SERTIFIKAT KELULUSAN KOMPETENSI', canvas.width / 2, 130);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Diberikan secara resmi kepada siswa atas keberhasilan menyelesaikan modul praktikum:', canvas.width / 2, 160);

    // 4. Nama Siswa
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(studentName.toUpperCase(), canvas.width / 2, 220);

    // Garis Bawah Nama
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 200, 235);
    ctx.lineTo(canvas.width / 2 + 200, 235);
    ctx.stroke();

    // 5. Nama Sekolah & Predikat
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${schoolName}`, canvas.width / 2, 265);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Telah berhasil menguasai kompetensi dasar:', canvas.width / 2, 305);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px "Fira Code", monospace';
    ctx.fillText('JUNIOR FIREWALL & NETWORK SECURITY ANALYST', canvas.width / 2, 335);

    // 6. Ringkasan Skor & Evaluasi
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Fira Code", monospace';
    ctx.fillText(`Capaian Skor Evaluasi: ${totalScore} Poin  |  Prinsip Packet Filtering (Top-Down ACL) & Security Hardening`, canvas.width / 2, 365);

    // 7. Footer & Stempel Digital
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "Fira Code", monospace';
    ctx.fillText(`Tanggal Terbit: ${today}`, 70, 440);
    ctx.fillText(`ID Kredensial: SIJA-FW-${Math.random().toString(36).substring(2, 9).toUpperCase()}`, 70, 460);

    // Stempel / Badge Otentikasi
    ctx.textAlign = 'right';
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px "Fira Code", monospace';
    ctx.fillText('✓ TERVERIFIKASI SISTEM EDUKASI SIJA', canvas.width - 70, 440);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Instruktur Praktikum Sistem Keamanan Jaringan', canvas.width - 70, 460);
  }

  downloadCertificate() {
    sounds.playClick();
    const canvas = document.getElementById('cert-canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `Sertifikat_Firewall_SIJA_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}

// Inisialisasi controller utama aplikasi
const app = new AppController();
window.addEventListener('DOMContentLoaded', () => {
  app.init();
});

