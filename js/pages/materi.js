/**
 * Materi Page - Renderisasi modul pelajaran dan kamus port
 */

const materiPage = {
  init() {
    this.renderLessons();
    this.renderPortDictionary();
    this.setupPortSearch();
  },

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
  },

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
  },

  setupPortSearch() {
    const searchPort = document.getElementById('port-search-input');
    if (searchPort) {
      searchPort.addEventListener('input', Utils.debounce((e) => {
        this.renderPortDictionary(e.target.value);
      }, 300));
    }
  }
};

window.materiPage = materiPage;
