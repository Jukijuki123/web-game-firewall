/**
 * Main entry point for sertifikat.html
 * Imports CSS (processed by PostCSS/Tailwind) and all modules
 */
import '../css/style.css';

// Shared modules
import './shared/app-state.js';
import './shared/sound.js';
import './shared/router.js';
import './shared/utils.js';

// Page JS
import './pages/sertifikat.js';

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
  window.sertifikatPage.init();
});