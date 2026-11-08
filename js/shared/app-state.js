/**
 * AppState - Manajemen State Global via localStorage
 * Digunakan untuk menyimpan progres, skor, dan preferensi antar halaman
 */

const AppState = {
  keys: {
    progress: 'cyberguard_progress',
    mute: 'firewall_game_muted',
    certificate: 'cyberguard_certificate',
    quiz: 'cyberguard_quiz_answers',
    simulator: 'cyberguard_simulator_rules'
  },

  get(key, def = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? def : JSON.parse(raw);
    } catch (e) {
      return def;
    }
  },

  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      console.warn('Gagal menyimpan ke localStorage:', e);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  // Progres game
  getProgress() {
    return this.get(this.keys.progress, {
      level1: { score: 0, completed: false },
      level2: { score: 0, completed: false },
      level3: { score: 0, completed: false },
      totalScore: 0,
      maxStreak: 0,
      accuracy: 100,
      totalCorrect: 0,
      totalMistakes: 0,
      badge: 'Junior Network Defender'
    });
  },

  setProgress(progress) {
    return this.set(this.keys.progress, progress);
  },

  updateLevelProgress(level, data) {
    const prog = this.getProgress();
    prog[level] = { ...prog[level], ...data };
    prog.totalScore = (prog.level1?.score || 0) + (prog.level2?.score || 0) + (prog.level3?.score || 0);
    return this.set(this.keys.progress, prog);
  },

  isMuted() {
    return this.get(this.keys.mute, false);
  },

  setMuted(muted) {
    return this.set(this.keys.mute, muted);
  },

  getCertificate() {
    return this.get(this.keys.certificate, {
      studentName: '',
      schoolName: ''
    });
  },

  setCertificate(data) {
    return this.set(this.keys.certificate, data);
  }
};

window.AppState = AppState;
