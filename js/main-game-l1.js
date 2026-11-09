/**
 * Main entry point for game-l1.html
 * Imports CSS (processed by PostCSS/Tailwind) and all modules
 */
import '../css/style.css';

// Shared modules
import './shared/app-state.js';
import './shared/sound.js';
import './shared/router.js';
import './shared/utils.js';

// Data
import './data/game-data.js';

// Page JS
import './pages/game-l1.js';

document.addEventListener('DOMContentLoaded', () => {
  Router.init();
  const muteBtn = document.getElementById('btn-toggle-audio');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const isMuted = sounds.toggleMute();
      muteBtn.innerHTML = isMuted
        ? `🔇 <span class="hidden sm:inline">Unmute</span>`
        : `🔊 <span class="hidden sm:inline">Mute</span>`;
    });
  }
  window.gameL1.init();
});