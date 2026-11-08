/**
 * Game Level 3: Cyber Defense Rush (Survival Mode)
 * Pertahanan server dari serangan siber bertubi-tubi secara real-time
 */

class GameLevel3 {
  constructor() {
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
    this.l3StartTime = null;
    this.l3AnimationFrame = null;
  }

  init() {
    this.startLevel3();
  }

  startLevel3() {
    this.l3Active = true;
    this.l3TimeLeft = 45;
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

    // Jalankan timer hitung mundur menggunakan requestAnimationFrame
    if (this.l3Timer) cancelAnimationFrame(this.l3Timer);
    this.l3StartTime = performance.now();
    this.l3Timer = requestAnimationFrame(() => this.l3Loop());

    // Jalankan generator ancaman bertubi-tubi
    if (this.l3SpawnInterval) clearInterval(this.l3SpawnInterval);
    this.l3SpawnInterval = setInterval(() => {
      if (!this.l3Active) return;
      this.spawnIncident();
    }, 2000);
  }

  l3Loop() {
    if (!this.l3Active) return;

    const elapsed = Math.floor((performance.now() - this.l3StartTime) / 1000);
    this.l3TimeLeft = Math.max(0, 45 - elapsed);

    // Tambah skor setiap detik bertahan
    if (elapsed > 0 && elapsed % 1 === 0) {
      // Hanya tambah sekali per detik
      if (!this._lastSecond || this._lastSecond !== elapsed) {
        this._lastSecond = elapsed;
        const progress = AppState.getProgress();
        let l3Score = (progress.level3 && progress.level3.score) || 0;
        l3Score += 10;
        progress.level3 = { ...(progress.level3 || {}), score: l3Score };
        AppState.setProgress(progress);
      }
    }

    this.updateL3UI();

    if (this.l3TimeLeft <= 0) {
      this.finishLevel3(true);
    } else {
      this.l3Timer = requestAnimationFrame(() => this.l3Loop());
    }
  }

  toggleDefense(type) {
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
        ? "min-h-[48px] p-3 rounded-lg border text-left text-xs bg-emerald-950/80 border-emerald-500 text-emerald-300 font-mono transition-all touch-target"
        : "min-h-[48px] p-3 rounded-lg border text-left text-xs bg-slate-900 border-slate-700 text-slate-400 font-mono transition-all hover:border-cyan-500 touch-target";
    }
    if (btnSsh) {
      btnSsh.className = this.l3DefenseToggles.whitelistSsh
        ? "min-h-[48px] p-3 rounded-lg border text-left text-xs bg-emerald-950/80 border-emerald-500 text-emerald-300 font-mono transition-all touch-target"
        : "min-h-[48px] p-3 rounded-lg border text-left text-xs bg-slate-900 border-slate-700 text-slate-400 font-mono transition-all hover:border-cyan-500 touch-target";
    }
    if (btnDdos) {
      btnDdos.className = this.l3DefenseToggles.rateLimitDdos
        ? "min-h-[48px] p-3 rounded-lg border text-left text-xs bg-emerald-950/80 border-emerald-500 text-emerald-300 font-mono transition-all touch-target"
        : "min-h-[48px] p-3 rounded-lg border text-left text-xs bg-slate-900 border-slate-700 text-slate-400 font-mono transition-all hover:border-cyan-500 touch-target";
    }
  }

  spawnIncident() {
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

      // Tambah skor
      const progress = AppState.getProgress();
      let l3Score = (progress.level3 && progress.level3.score) || 0;
      l3Score += 50;
      progress.level3 = { ...(progress.level3 || {}), score: l3Score };
      AppState.setProgress(progress);
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

    if (timeEl) timeEl.textContent = `${this.l3TimeLeft}s`;
    if (healthEl) healthEl.textContent = `${this.l3ServerHealth}%`;
    if (scoreEl) {
      const progress = AppState.getProgress();
      scoreEl.textContent = (progress.level3 && progress.level3.score) || 0;
    }

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
    if (this.l3Timer) cancelAnimationFrame(this.l3Timer);
    if (this.l3SpawnInterval) clearInterval(this.l3SpawnInterval);

    // Simpan progres akhir
    const progress = AppState.getProgress();
    const l3Score = (progress.level3 && progress.level3.score) || 0;
    progress.level3 = {
      ...(progress.level3 || {}),
      score: l3Score,
      completed: isWin
    };
    if (isWin) {
      progress.badge = 'Senior Cyber Defender';
    }
    progress.totalScore = (progress.level1?.score || 0) + (progress.level2?.score || 0) + l3Score;
    AppState.setProgress(progress);

    const totalScore = progress.totalScore;

    if (isWin) {
      sounds.playWin();
      alert(`🏆 SELAMAT! ANDA LULUS SELURUH MISI!\n\nTotal Skor: ${totalScore} Poin\n\nServer sekolah berhasil bertahan dari badai serangan siber hingga waktu habis.\n\nLanjut ke Sertifikat Digital.`);
      Router.navigate('sertifikat.html');
    } else {
      sounds.playError();
      alert(`💀 SERVER KAMPUS DOWN (DEFENSE FAILED)\n\nSkor: ${l3Score} Poin\n\nKesehatan server mencapai 0% karena serangan tidak ditangkis dengan kebijakan firewall yang tepat.\n\nCoba lagi!`);
      this.startLevel3();
    }
  }
}

const gameL3 = new GameLevel3();
window.gameL3 = gameL3;
