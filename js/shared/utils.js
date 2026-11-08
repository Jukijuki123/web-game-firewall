/**
 * Utils - Fungsi bantu umum untuk seluruh halaman
 */

const Utils = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  formatNumber(num, decimals = 0) {
    return Number(num).toLocaleString('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  formatPercent(num, decimals = 0) {
    return `${Number(num).toFixed(decimals)}%`;
  },

  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(str).replace(/[&<>"']/g, m => map[m]);
  },

  createElement(tag, className = '', innerHTML = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
      success: 'bg-emerald-500 text-white',
      error: 'bg-rose-500 text-white',
      info: 'bg-cyan-500 text-white',
      warning: 'bg-amber-500 text-white'
    };
    toast.className = `fixed top-4 right-4 ${colors[type] || colors.info} px-4 py-2 rounded-lg shadow-lg text-sm font-bold z-50 transform translate-y-0 transition-transform duration-300`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transform = 'translateY(-100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

window.Utils = Utils;
