/**
 * RouterHelper - Navigasi antar halaman & highlight menu aktif
 */

const Router = {
  pages: [
    { path: 'index.html', label: 'Dashboard', icon: '🏠' },
    { path: 'materi.html', label: 'Materi & Teori', icon: '📖' },
    { path: 'kuis.html', label: 'Kuis Pemanasan', icon: '❓' },
    { path: 'simulator.html', label: 'Lab Simulator', icon: '🔬' },
    { path: 'game-l1.html', label: 'Level 1: Bouncer', icon: '🎮' },
    { path: 'game-l2.html', label: 'Level 2: Rules', icon: '🛠️' },
    { path: 'game-l3.html', label: 'Level 3: Survival', icon: '⚡' },
    { path: 'sertifikat.html', label: 'Sertifikat Digital', icon: '📜' }
  ],

  navigate(path) {
    if (!path) return;
    window.location.href = path;
  },

  getCurrentPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';
    return file;
  },

  isActive(path) {
    const current = this.getCurrentPage();
    return current === path || (path === 'index.html' && (current === '' || current === 'index.html'));
  },

  highlightNav() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && this.isActive(href)) {
        link.classList.add('text-cyan-400', 'font-bold', 'bg-cyan-950/20', 'border-cyan-500/50');
        link.classList.remove('text-slate-400');
      } else {
        link.classList.remove('text-cyan-400', 'font-bold', 'bg-cyan-950/20', 'border-cyan-500/50');
        link.classList.add('text-slate-400');
      }
    });
  },

  init() {
    this.highlightNav();
  }
};

window.Router = Router;
