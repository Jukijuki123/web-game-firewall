/**
 * CyberGuard - Game Engine (Level 1, Level 2, Level 3, Evaluasi & Skor)
 * Permainan Edukasi Interaktif Sistem Keamanan Jaringan SIJA
 */

class FirewallGameEngine {
  constructor() {
    this.currentLevel = 1;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.lives = 3;

    // State Level 1
    this.l1Index = 0;
    this.l1Packets = [];
    this.l1Timer = null;

    // State Level 2
    this.l2ScenarioIndex = 0;
    this.l2CurrentRules = [];
    this.l2WaveResults = [];

    // State Level 3
    this.l3Active = false;
    this.l3Timer = null;
    this.l3SpawnInterval = null;
    this.l3TimeLeft = 45;
    this.l3ServerHealth = 100;
    this.l3DefenseToggles = {
      blockInsecure: false,  // Drop port 23 & 21
      whitelistSsh: false,   // Restrict SSH to 10.10.x
      rateLimitDdos: false   // Rate limit ICMP / SYN flood
    };
    this.l3ActiveThreats = [];

    // Riwayat belajar siswa untuk Sertifikat
    this.stats = {
      level1Score: 0,
      level2Score: 0,
      level3Score: 0,
      accuracy: 100,
      totalCorrect: 0,
      totalMistakes: 0,
      achievedBadge: "Junior Network Defender"
    };
  }

  // ==========================================
  // LEVEL 1: PACKET BOUNCER (SATPAM GERBANG)
  // ==========================================
  startLevel1() {
    this.currentLevel = 1;
    this.score = 0;
    this.streak = 0;
    this.lives = 3;
    this.l1Index = 0;
    // Acak paket dari dataset
    this.l1Packets = [...LEVEL1_PACKETS].sort(() => Math.random() - 0.5);

    this.updateL1StatsUI();
    this.showNextL1Packet();
    sounds.playAlert();
  }

  updateL1StatsUI() {
    const scoreEl = document.getElementById('l1-score');
    const streakEl = document.getElementById('l1-streak');
    const livesEl = document.getElementById('l1-lives');
    const progressEl = document.getElementById('l1-progress');

    if (scoreEl) scoreEl.innerText = this.score;
    if (streakEl) streakEl.innerText = `x${this.streak}`;
    if (progressEl) {
      const pct = Math.round((this.l1Index / this.l1Packets.length) * 100);
      progressEl.style.width = `${pct}%`;
    }

    if (livesEl) {
      let hearts = '';
      for (let i = 0; i < 3; i++) {
        hearts += i < this.lives ? '❤️ ' : '🖤 ';
      }
      livesEl.innerText = hearts;
    }
  }

  showNextL1Packet() {
    if (this.l1Index >= this.l1Packets.length) {
      this.finishLevel1();
      return;
    }

    const packet = this.l1Packets[this.l1Index];
    const card = document.getElementById('l1-packet-card');
    const feedbackBox = document.getElementById('l1-feedback-box');
    if (feedbackBox) feedbackBox.classList.add('hidden');

    if (card) {
      card.className = "p-5 rounded-xl border border-cyan-500/40 bg-slate-900/90 shadow-2xl relative overflow-hidden transition-all duration-300";
      
      const portBadgeClass = packet.isSafe ? 'bg-cyan-950 text-cyan-300 border-cyan-700' : 'bg-rose-950 text-rose-300 border-rose-700';

      card.innerHTML = `
        <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div class="flex items-center space-x-2">
            <span class="w-3 h-3 rounded-full ${packet.isSafe ? 'bg-cyan-400' : 'bg-rose-400'} animate-ping"></span>
            <span class="font-mono text-xs font-bold text-slate-300">PAKET #${this.l1Index + 1} DARI ${this.l1Packets.length}</span>
          </div>
          <span class="text-xs px-2.5 py-1 rounded border font-mono font-bold ${portBadgeClass}">
            PORT: ${packet.port} (${packet.service})
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs mb-3 font-mono">
          <div class="bg-black/40 p-2.5 rounded border border-slate-800">
            <span class="text-slate-400 text-[10px] block">SOURCE IP (PENGIRIM):</span>
            <span class="text-amber-300 font-bold">${packet.srcIp}</span>
          </div>
          <div class="bg-black/40 p-2.5 rounded border border-slate-800">
            <span class="text-slate-400 text-[10px] block">PROTOKOL:</span>
            <span class="text-cyan-300 font-bold">${packet.proto}</span>
          </div>
        </div>

        <div class="bg-black/50 p-3 rounded-lg border border-slate-800/80 mb-3 font-mono text-xs">
          <span class="text-slate-400 text-[10px] block mb-1">INSPEKSI MUATAN (PAYLOAD PREVIEW):</span>
          <span class="text-slate-200">${packet.payload}</span>
        </div>

        <div class="text-[11px] text-slate-400 italic">
          Tentukan aksi yang tepat untuk kebijakan keamanan server sekolah!
        </div>
      `;
    }
  }

  handleL1Action(action) {
    if (this.l1Index >= this.l1Packets.length) return;

    const currentPacket = this.l1Packets[this.l1Index];
    const isCorrect = (action === currentPacket.expectedAction);

    const feedbackBox = document.getElementById('l1-feedback-box');
    const card = document.getElementById('l1-packet-card');

    if (isCorrect) {
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;
      const points = 100 + (this.streak > 1 ? this.streak * 20 : 0);
      this.score += points;
      this.stats.totalCorrect++;

      if (action === 'ACCEPT') {
        sounds.playAccept();
        if (card) card.classList.add('pass-through-right');
      } else {
        sounds.playDrop();
        if (card) card.classList.add('laser-zap-out');
      }

      if (this.streak >= 2) sounds.playCombo(this.streak);

      if (feedbackBox) {
        feedbackBox.className = "mt-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 text-xs flex items-start gap-2";
        feedbackBox.innerHTML = `
          <span class="text-base font-bold">✓</span>
          <div>
            <strong>Keputusan Tepat! (+${points} Poin)</strong>
            <p class="text-slate-300 mt-0.5">${currentPacket.reason}</p>
          </div>
        `;
        feedbackBox.classList.remove('hidden');
      }
    } else {
      this.streak = 0;
      this.lives--;
      this.stats.totalMistakes++;
      sounds.playError();

      if (feedbackBox) {
        feedbackBox.className = "mt-4 p-3 rounded-lg bg-rose-950/80 border border-rose-600/70 text-rose-300 text-xs flex items-start gap-2";
        feedbackBox.innerHTML = `
          <span class="text-base font-bold">✕</span>
          <div>
            <strong>Pilihan Kurang Tepat! Tindakan yang benar: <span class="font-bold underline">${currentPacket.expectedAction}</span></strong>
            <p class="text-slate-300 mt-0.5">${currentPacket.reason}</p>
          </div>
        `;
        feedbackBox.classList.remove('hidden');
      }

      if (this.lives <= 0) {
        setTimeout(() => this.gameOverLevel1(), 1200);
        return;
      }
    }

    this.l1Index++;
    this.updateL1StatsUI();

    // Tunggu sejenak agar siswa sempat membaca penjelasan
    setTimeout(() => {
      this.showNextL1Packet();
    }, 1200);
  }

  finishLevel1() {
    sounds.playWin();
    this.stats.level1Score = this.score;

    const modal = document.getElementById('level-complete-modal');
    if (modal) {
      document.getElementById('modal-title').innerText = "Level 1: Packet Bouncer Selesai!";
      document.getElementById('modal-score').innerText = `${this.score} Poin`;
      document.getElementById('modal-summary').innerHTML = `
        Selamat! Anda telah berhasil menginspeksi seluruh aliran paket data.<br>
        Akurasi satpam Anda sangat baik dalam membedakan traffic aman (HTTPS/DNS/SSH Lokal) dan ancaman (Telnet/MySQL publik/Exploit).
      `;
      document.getElementById('modal-next-btn').onclick = () => {
        app.switchTab('game-l2');
        this.startLevel2();
      };
      modal.classList.remove('hidden');
    }
  }

  gameOverLevel1() {
    sounds.playError();
    const modal = document.getElementById('level-complete-modal');
    if (modal) {
      document.getElementById('modal-title').innerText = "Pelanggaran Keamanan Jaringan!";
      document.getElementById('modal-score').innerText = `${this.score} Poin`;
      document.getElementById('modal-summary').innerHTML = `
        Nyawa Anda habis karena beberapa paket berbahaya lolos ke server atau paket siswa terblokir.<br>
        Pelajari kembali materi port & protokol sebelum mencoba lagi!
      `;
      document.getElementById('modal-next-btn').innerText = "Coba Lagi Level 1";
      document.getElementById('modal-next-btn').onclick = () => {
        modal.classList.add('hidden');
        this.startLevel1();
      };
      modal.classList.remove('hidden');
    }
  }

  // ==========================================
  // LEVEL 2: RULE ARCHITECT (KONFIGURASI TABEL)
  // ==========================================
  startLevel2(scenarioIndex = 0) {
    this.currentLevel = 2;
    this.l2ScenarioIndex = scenarioIndex;
    const scenario = LEVEL2_SCENARIOS[scenarioIndex];
    if (!scenario) return;

    // Duplikat rules awal dari skenario
    this.l2CurrentRules = JSON.parse(JSON.stringify(scenario.initialRules));

    // Render Skenario UI
    const titleEl = document.getElementById('l2-scenario-title');
    const descEl = document.getElementById('l2-scenario-desc');
    const targetEl = document.getElementById('l2-target-server');

    if (titleEl) titleEl.innerText = scenario.title;
    if (descEl) descEl.innerText = scenario.description;
    if (targetEl) targetEl.innerText = scenario.targetServer;

    this.renderL2Rules();
    const reportBox = document.getElementById('l2-wave-report');
    if (reportBox) reportBox.classList.add('hidden');
  }

  renderL2Rules() {
    const tableBody = document.getElementById('l2-rules-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    this.l2CurrentRules.forEach((rule, index) => {
      const tr = document.createElement('tr');
      tr.className = "border-b border-slate-800 text-xs hover:bg-slate-800/40 transition-colors";

      let actionBadge = '';
      if (rule.action === 'ACCEPT') {
        actionBadge = `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">ACCEPT</span>`;
      } else if (rule.action === 'DROP') {
        actionBadge = `<span class="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-mono font-bold">DROP</span>`;
      } else {
        actionBadge = `<span class="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">REJECT</span>`;
      }

      tr.innerHTML = `
        <td class="py-2 px-3 font-mono text-cyan-400 font-bold">#${index + 1}</td>
        <td class="py-2 px-3">${actionBadge}</td>
        <td class="py-2 px-3 font-mono text-slate-200">${rule.proto}</td>
        <td class="py-2 px-3 font-mono text-cyan-300 font-semibold">${rule.port}</td>
        <td class="py-2 px-3 font-mono text-slate-300">${rule.src}</td>
        <td class="py-2 px-3 text-slate-400 text-[11px]">${rule.comment || '-'}</td>
        <td class="py-2 px-3 text-right space-x-1 whitespace-nowrap">
          <button onclick="gameEngine.moveL2Rule(${index}, -1)" ${index === 0 ? 'disabled' : ''} class="p-1 hover:text-cyan-400 disabled:opacity-20 text-slate-400" title="Geser ke Atas">▲</button>
          <button onclick="gameEngine.moveL2Rule(${index}, 1)" ${index === this.l2CurrentRules.length - 1 ? 'disabled' : ''} class="p-1 hover:text-cyan-400 disabled:opacity-20 text-slate-400" title="Geser ke Bawah">▼</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  moveL2Rule(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.l2CurrentRules.length) return;

    const temp = this.l2CurrentRules[index];
    this.l2CurrentRules[index] = this.l2CurrentRules[targetIndex];
    this.l2CurrentRules[targetIndex] = temp;
    sounds.playClick();
    this.renderL2Rules();
  }

  /**
   * Menjalankan pengujian gelombang paket terhadap susunan aturan siswa
   */
  async runL2WaveTest() {
    sounds.playAlert();
    const scenario = LEVEL2_SCENARIOS[this.l2ScenarioIndex];
    if (!scenario) return;

    const testBtn = document.getElementById('l2-test-btn');
    if (testBtn) {
      testBtn.disabled = true;
      testBtn.innerText = "⏳ Sedang Menguji Gelombang Serangan...";
    }

    const reportBox = document.getElementById('l2-wave-report');
    const reportList = document.getElementById('l2-report-list');
    if (reportBox) reportBox.classList.remove('hidden');
    if (reportList) reportList.innerHTML = '';

    let successCount = 0;
    const totalPackets = scenario.incomingPackets.length;

    for (let pIdx = 0; pIdx < totalPackets; pIdx++) {
      const pkt = scenario.incomingPackets[pIdx];

      // Evaluasi Top-Down
      let evaluatedAction = 'DROP'; // Default
      let matchedRule = null;
      let matchedIndex = -1;

      for (let rIdx = 0; rIdx < this.l2CurrentRules.length; rIdx++) {
        const rule = this.l2CurrentRules[rIdx];
        const matchProto = rule.proto === 'Any' || rule.proto.toUpperCase() === pkt.proto.toUpperCase();
        const matchPort = rule.port === 'Any' || String(rule.port) === String(pkt.port);
        const matchSrc = rule.src === 'Any' || rule.src.trim() === pkt.src.trim();

        if (matchProto && matchPort && matchSrc) {
          evaluatedAction = rule.action;
          matchedRule = rule;
          matchedIndex = rIdx + 1;
          break;
        }
      }

      const passed = (evaluatedAction === 'ACCEPT');
      const isCorrectOutcome = (passed === pkt.shouldPass);

      if (isCorrectOutcome) successCount++;

      // Tampilkan baris laporan
      const li = document.createElement('li');
      li.className = `p-2 rounded border text-xs font-mono flex items-center justify-between ${
        isCorrectOutcome ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300' : 'bg-rose-950/40 border-rose-600/50 text-rose-300'
      }`;

      li.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>${isCorrectOutcome ? '✓ [LOLOS UJI]' : '✕ [GAGAL]'}</span>
          <span>${pkt.desc} (Port ${pkt.port} ${pkt.proto} dari ${pkt.src})</span>
        </div>
        <div class="text-[11px] text-slate-300">
          Aksi: <strong>${evaluatedAction}</strong> via Rule #${matchedIndex || 'Default'} (Harusnya: ${pkt.shouldPass ? 'ACCEPT' : 'DROP'})
        </div>
      `;
      reportList.appendChild(li);
      await this.sleep(300);
    }

    if (testBtn) {
      testBtn.disabled = false;
      testBtn.innerText = "🚀 Deploy & Uji Gelombang Serangan";
    }

    const accuracy = Math.round((successCount / totalPackets) * 100);
    this.stats.level2Score += successCount * 150;

    if (accuracy === 100) {
      sounds.playWin();
      setTimeout(() => {
        if (this.l2ScenarioIndex < LEVEL2_SCENARIOS.length - 1) {
          alert(`Luar biasa! Seluruh aturan pada Skenario ${this.l2ScenarioIndex + 1} bekerja 100% sempurna! Melanjutkan ke skenario berikutnya.`);
          this.startLevel2(this.l2ScenarioIndex + 1);
        } else {
          this.finishLevel2();
        }
      }, 800);
    } else {
      sounds.playError();
      alert(`Efektivitas Firewall: ${accuracy}%. Beberapa paket sah terblokir atau serangan berhasil lolos. Perhatikan urutan aturan (Top-Down Priority) lalu uji kembali!`);
    }
  }

  finishLevel2() {
    sounds.playWin();
    const modal = document.getElementById('level-complete-modal');
    if (modal) {
      document.getElementById('modal-title').innerText = "Level 2: Rule Architect Selesai!";
      document.getElementById('modal-score').innerText = `${this.stats.level2Score} Poin`;
      document.getElementById('modal-summary').innerHTML = `
        Hebat! Anda membuktikan pemahaman mendalam tentang prinsip Top-Down Execution dan ACL filtering.<br>
        Server sekolah aman dari serangan exploit port dan akses remote ilegal!
      `;
      document.getElementById('modal-next-btn').innerText = "Masuk ke Level 3: Cyber Defense Rush";
      document.getElementById('modal-next-btn').onclick = () => {
        app.switchTab('game-l3');
        this.startLevel3();
      };
      modal.classList.remove('hidden');
    }
  }

  // ==========================================
  // LEVEL 3: CYBER DEFENSE RUSH (SURVIVAL MODE)
  // ==========================================
  startLevel3() {
    this.currentLevel = 3;
    this.l3Active = true;
    this.l3TimeLeft = 40;
    this.l3ServerHealth = 100;
    this.l3DefenseToggles = {
      blockInsecure: false,
      whitelistSsh: false,
      rateLimitDdos: false
    };

    sounds.playAlert();
    this.updateL3UI();

    // Reset tombol toggle
    this.syncToggleButtons();

    // Jalankan timer hitung mundur
    if (this.l3Timer) clearInterval(this.l3Timer);
    this.l3Timer = setInterval(() => {
      if (!this.l3Active) return;
      this.l3TimeLeft--;
      this.stats.level3Score += 10;
      this.updateL3UI();

      if (this.l3TimeLeft <= 0) {
        this.finishLevel3(true);
      }
    }, 1000);

    // Jalankan generator ancaman bertubi-tubi
    if (this.l3SpawnInterval) clearInterval(this.l3SpawnInterval);
    this.l3SpawnInterval = setInterval(() => {
      if (!this.l3Active) return;
      this.spawnL3Incident();
    }, 2000);
  }

  toggleL3Defense(type) {
    if (!this.l3Active) return;
    this.l3DefenseToggles[type] = !this.l3DefenseToggles[type];
    sounds.playClick();
    this.syncToggleButtons();

    const banner = document.getElementById('l3-live-log');
    if (banner) {
      const state = this.l3DefenseToggles[type] ? "AKTIF [ENABLED]" : "NONAKTIF [DISABLED]";
      banner.innerHTML = `<span class="text-cyan-400 font-bold">⚡ [DEFENSE POLICY]</span> ${type.toUpperCase()}: ${state}`;
    }
  }

  syncToggleButtons() {
    const btnInsecure = document.getElementById('l3-btn-insecure');
    const btnSsh = document.getElementById('l3-btn-ssh');
    const btnDdos = document.getElementById('l3-btn-ddos');

    if (btnInsecure) {
      btnInsecure.className = this.l3DefenseToggles.blockInsecure 
        ? "p-3 rounded-lg border text-left text-xs bg-emerald-950/80 border-emerald-500 text-emerald-300 font-mono transition-all"
        : "p-3 rounded-lg border text-left text-xs bg-slate-900 border-slate-700 text-slate-400 font-mono transition-all hover:border-cyan-500";
    }
    if (btnSsh) {
      btnSsh.className = this.l3DefenseToggles.whitelistSsh 
        ? "p-3 rounded-lg border text-left text-xs bg-emerald-950/80 border-emerald-500 text-emerald-300 font-mono transition-all"
        : "p-3 rounded-lg border text-left text-xs bg-slate-900 border-slate-700 text-slate-400 font-mono transition-all hover:border-cyan-500";
    }
    if (btnDdos) {
      btnDdos.className = this.l3DefenseToggles.rateLimitDdos 
        ? "p-3 rounded-lg border text-left text-xs bg-emerald-950/80 border-emerald-500 text-emerald-300 font-mono transition-all"
        : "p-3 rounded-lg border text-left text-xs bg-slate-900 border-slate-700 text-slate-400 font-mono transition-all hover:border-cyan-500";
    }
  }

  spawnL3Incident() {
    const incidentTypes = [
      {
        name: "Serangan Port Scanning & Telnet Botnet",
        port: 23,
        counterToggle: "blockInsecure",
        damage: 15,
        msg: "Botnet mencoba login Telnet port 23 tanpa enkripsi!"
      },
      {
        name: "SSH Dictionary Brute Force",
        port: 22,
        counterToggle: "whitelistSsh",
        damage: 20,
        msg: "Ribuan percobaan password SSH dari IP Rusia!"
      },
      {
        name: "ICMP Ping Flood (DDoS)",
        port: "ICMP",
        counterToggle: "rateLimitDdos",
        damage: 25,
        msg: "Bandwidth server drop akibat flood paket ICMP!"
      }
    ];

    const incident = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
    const counterActive = this.l3DefenseToggles[incident.counterToggle];

    const feedList = document.getElementById('l3-incident-feed');
    const li = document.createElement('li');

    if (counterActive) {
      // Serangan berhasil ditahan oleh aturan pertahanan yang sedang aktif
      sounds.playDrop();
      li.className = "p-2 rounded bg-emerald-950/50 border border-emerald-600/40 text-emerald-300 text-xs font-mono";
      li.innerHTML = `🛡️ [DEFENDED] ${incident.msg} -> DITAHAN OLEH ATURAN FIREWALL!`;
      this.stats.level3Score += 50;
    } else {
      // Serangan tembus dan merusak server!
      sounds.playAlert();
      this.l3ServerHealth = Math.max(0, this.l3ServerHealth - incident.damage);
      li.className = "p-2 rounded bg-rose-950/60 border border-rose-600/50 text-rose-300 text-xs font-mono animate-pulse";
      li.innerHTML = `⚠️ [BREACH] ${incident.msg} -> TEMBUS! Health Server Berkurang -${incident.damage}%`;

      if (this.l3ServerHealth <= 0) {
        this.finishLevel3(false);
      }
    }

    if (feedList) {
      feedList.insertBefore(li, feedList.firstChild);
      if (feedList.children.length > 5) feedList.removeChild(feedList.lastChild);
    }

    this.updateL3UI();
  }

  updateL3UI() {
    const timeEl = document.getElementById('l3-time');
    const healthEl = document.getElementById('l3-health');
    const healthBar = document.getElementById('l3-health-bar');
    const scoreEl = document.getElementById('l3-score');

    if (timeEl) timeEl.innerText = `${this.l3TimeLeft}s`;
    if (healthEl) healthEl.innerText = `${this.l3ServerHealth}%`;
    if (scoreEl) scoreEl.innerText = this.stats.level3Score;

    if (healthBar) {
      healthBar.style.width = `${this.l3ServerHealth}%`;
      if (this.l3ServerHealth > 60) {
        healthBar.className = "h-3 rounded-full bg-emerald-500 transition-all duration-300";
      } else if (this.l3ServerHealth > 30) {
        healthBar.className = "h-3 rounded-full bg-amber-500 transition-all duration-300";
      } else {
        healthBar.className = "h-3 rounded-full bg-rose-500 transition-all duration-300";
      }
    }
  }

  finishLevel3(isWin) {
    this.l3Active = false;
    if (this.l3Timer) clearInterval(this.l3Timer);
    if (this.l3SpawnInterval) clearInterval(this.l3SpawnInterval);

    const modal = document.getElementById('level-complete-modal');
    if (!modal) return;

    if (isWin) {
      sounds.playWin();
      document.getElementById('modal-title').innerText = "🏆 SELAMAT! ANDA LULUS SELURUH MISI!";
      document.getElementById('modal-score').innerText = `Total Skor: ${this.stats.level1Score + this.stats.level2Score + this.stats.level3Score} Poin`;
      document.getElementById('modal-summary').innerHTML = `
        Luar biasa! Server sekolah berhasil bertahan dari badai serangan siber hingga waktu habis.<br>
        Anda telah menguasai kompetensi dasar Sistem Keamanan Jaringan (Firewall & Packet Filtering) jurusan SIJA!
      `;
      document.getElementById('modal-next-btn').innerText = "Cetak Sertifikat Kelulusan SIJA";
      document.getElementById('modal-next-btn').onclick = () => {
        modal.classList.add('hidden');
        app.switchTab('certificate');
      };
    } else {
      sounds.playGameOver();
      document.getElementById('modal-title').innerText = "💀 SERVER KAMPUS DOWN (DEFENSE FAILED)";
      document.getElementById('modal-score').innerText = `${this.stats.level3Score} Poin`;
      document.getElementById('modal-summary').innerHTML = `
        Kesehatan server mencapai 0% karena serangan tidak ditangkis dengan kebijakan firewall yang tepat.<br>
        Ingat untuk segera mengaktifkan penolakan port tidak aman (23 Telnet) dan pembatasan SSH!
      `;
      document.getElementById('modal-next-btn').innerText = "Coba Lagi Level 3";
      document.getElementById('modal-next-btn').onclick = () => {
        modal.classList.add('hidden');
        this.startLevel3();
      };
    }

    modal.classList.remove('hidden');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const gameEngine = new FirewallGameEngine();

