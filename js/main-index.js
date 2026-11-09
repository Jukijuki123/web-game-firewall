/**
 * Main entry point for index.html (Dashboard)
 * Imports CSS (processed by PostCSS/Tailwind) and all shared modules
 */
import '../css/style.css';

// Shared modules
import './shared/app-state.js';
import './shared/sound.js';
import './shared/router.js';
import './shared/utils.js';

// Inisialisasi setelah DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi router highlight
  Router.init();

  // Update dashboard statistik dari AppState
  const progress = AppState.getProgress();
  document.getElementById('dash-total-score').textContent = progress.totalScore || 0;

  const completedLevels = ['level1', 'level2', 'level3'].filter(
    lvl => progress[lvl]?.completed
  ).length;
  document.getElementById('dash-levels-completed').textContent = `${completedLevels}/3`;

  document.getElementById('dash-accuracy').textContent = Utils.formatPercent(progress.accuracy || 100);
  document.getElementById('dash-badge').textContent = progress.badge || 'Junior Network Defender';

  // Render kartu menu
  const container = document.getElementById('menu-container');
  const menuItems = [
    { path: 'materi.html', icon: '📖', title: 'Materi & Teori', desc: '4 modul pembelajaran firewall' },
    { path: 'kuis.html', icon: '❓', title: 'Kuis Pemanasan', desc: '4 soal pilihan ganda dengan penjelasan' },
    { path: 'simulator.html', icon: '🔬', title: 'Lab Simulator Paket', desc: 'Visualisasi top-down rule matching' },
    { path: 'game-l1.html', icon: '🎮', title: 'Level 1: Bouncer', desc: 'Inspeksi paket data satu per satu' },
    { path: 'game-l2.html', icon: '🛠️', title: 'Level 2: Rules', desc: 'Susun aturan firewall & uji gelombang' },
    { path: 'game-l3.html', icon: '⚡', title: 'Level 3: Survival', desc: 'Pertahan server dari serangan real-time' },
    { path: 'sertifikat.html', icon: '📜', title: 'Sertifikat Digital', desc: 'Unduh sertifikat kelulusan SIJA' }
  ];

  menuItems.forEach(item => {
    const card = document.createElement('a');
    card.href = item.path;
    card.className = 'group bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/40 hover:bg-cyan-950/10 transition-all flex flex-col items-center text-center cursor-pointer';
    card.innerHTML = `
      <div class="w-14 h-14 rounded-xl bg-cyan-900/20 border border-cyan-800/40 flex items-center justify-center text-3xl mb-3 group-hover:bg-cyan-500/20 transition-colors">
        ${item.icon}
      </div>
      <h3 class="font-bold text-slate-100 text-sm mb-1">${item.title}</h3>
      <p class="text-[11px] text-slate-500">${item.desc}</p>
    `;
    container.appendChild(card);
  });

  // Audio toggle
  const muteBtn = document.getElementById('btn-toggle-audio');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const isMuted = sounds.toggleMute();
      muteBtn.innerHTML = isMuted
        ? `🔇 <span class="hidden sm:inline">Unmute</span>`
        : `🔊 <span class="hidden sm:inline">Mute</span>`;
    });
  }
});