/**
 * Game Level 1: Packet Bouncer
 * Inspeksi paket data satu per satu dengan aksi ACCEPT / DROP / REJECT
 */

class GameLevel1 {
  constructor() {
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.lives = 3;
    this.l1Index = 0;
    this.correctCount = 0;
    this.mistakeCount = 0;
    this.l1Packets = [];
    this.l1Timer = null;
  }

  init() {
    this.startLevel1();
  }

  startLevel1() {
    this.score = 0;
    this.streak = 0;
    this.lives = 3;
    this.l1Index = 0;
    this.correctCount = 0;
    this.mistakeCount = 0;
    this.l1Packets = Utils.shuffleArray(LEVEL1_PACKETS);

    this.updateStatsUI();
    this.showNextPacket();
    sounds.playAlert();
  }

  updateStatsUI() {
    const scoreEl = document.getElementById('l1-score');
    const streakEl = document.getElementById('l1-streak');
    const livesEl = document.getElementById('l1-lives');
    const progressEl = document.getElementById('l1-progress');

    if (scoreEl) scoreEl.textContent = this.score;
    if (streakEl) streakEl.textContent = `x${this.streak}`;
    if (progressEl) {
      const pct = Math.round((this.l1Index / this.l1Packets.length) * 100);
      progressEl.style.width = `${pct}%`;
    }

    if (livesEl) {
      let hearts = '';
      for (let i = 0; i < 3; i++) {
        hearts += i < this.lives ? '❤️ ' : '🖤 ';
      }
      livesEl.textContent = hearts;
    }
  }

  showNextPacket() {
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

  handleAction(action) {
    if (this.l1Index >= this.l1Packets.length) return;

    const currentPacket = this.l1Packets[this.l1Index];
    const isCorrect = (action === currentPacket.expectedAction);

    const feedbackBox = document.getElementById('l1-feedback-box');
    const card = document.getElementById('l1-packet-card');

    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;
      const points = 100 + (this.streak > 1 ? this.streak * 20 : 0);
      this.score += points;

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
      this.mistakeCount++;
      this.streak = 0;
      this.lives--;
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
        setTimeout(() => this.gameOver(), 1200);
        return;
      }
    }

    this.l1Index++;
    this.updateStatsUI();

    setTimeout(() => {
      this.showNextPacket();
    }, 1200);
  }

  finishLevel1() {
    sounds.playWin();

    // Simpan progres ke AppState
    const progress = AppState.getProgress();
    progress.level1 = {
      score: this.score,
      completed: true,
      maxStreak: this.maxStreak
    };
    progress.totalCorrect = (progress.totalCorrect || 0) + this.correctCount;
    progress.totalMistakes = (progress.totalMistakes || 0) + this.mistakeCount;
    const totalAnswers = progress.totalCorrect + progress.totalMistakes;
    if (totalAnswers > 0) {
      progress.accuracy = Math.round((progress.totalCorrect / totalAnswers) * 100);
    }
    if (!progress.badge || progress.badge === 'Junior Network Defender') {
      progress.badge = 'Network Gatekeeper';
    }
    progress.totalScore = (progress.level1?.score || 0) + (progress.level2?.score || 0) + (progress.level3?.score || 0);
    AppState.setProgress(progress);

    // Tampilkan modal level complete via alert sederhana (akan diganti dengan modal shared nanti)
    alert(`Level 1: Packet Bouncer Selesai!\nSkor: ${this.score}\nMax Combo: x${this.maxStreak}\n\nLanjut ke Level 2: Rule Architect`);
    Router.navigate('game-l2.html');
  }

  gameOver() {
    sounds.playError();

    const progress = AppState.getProgress();
    progress.level1 = {
      score: this.score,
      completed: false,
      maxStreak: this.maxStreak
    };
    AppState.setProgress(progress);

    alert(`Game Over!\nSkor Akhir: ${this.score}\nNyawa habis. Coba lagi!`);
    this.startLevel1();
  }
}

const gameL1 = new GameLevel1();
window.gameL1 = gameL1;
