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
    const container = document.getElementById('lessons-grid');
    if (!container) return;

    container.innerHTML = '';

    // Warna aksen dan tema per kartu (Indeks 0 & 1 di atas, 2 & 3 di bawah)
    const themeStyles = [
      {
        card: 'border-cyan-800/40 bg-gradient-to-b from-cyan-950/20 via-slate-900/90 to-slate-950/90 hover:border-cyan-500/60',
        badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
        number: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-900',
      },
      {
        card: 'border-emerald-800/40 bg-gradient-to-b from-emerald-950/20 via-slate-900/90 to-slate-950/90 hover:border-emerald-500/60',
        badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
        number: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-900',
      },
      {
        card: 'border-indigo-800/40 bg-gradient-to-b from-indigo-950/20 via-slate-900/90 to-slate-950/90 hover:border-indigo-500/60',
        badge: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80',
        number: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-slate-900',
      },
      {
        card: 'border-amber-800/40 bg-gradient-to-b from-amber-950/20 via-slate-900/90 to-slate-950/90 hover:border-amber-500/60',
        badge: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
        number: 'bg-amber-500/20 border-amber-500/40 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-900',
      },
    ];

    // Mapping nama ikon ke emoji
    const iconEmojiMap = {
      shield: '🛡️',
      cpu: '🖥️',
      'toggle-right': '🔘',
      list: '📋',
    };

    FIREWALL_LESSONS.forEach((lesson, index) => {
      const card = document.createElement('div');
      const theme = themeStyles[index] || themeStyles[0];
      const lessonEmoji = iconEmojiMap[lesson.icon] || '📚';

      card.className = `
        bg-slate-900/90 border rounded-2xl p-6 flex flex-col justify-between
        transition-all duration-300 shadow-xl relative overflow-hidden group
        ${theme.card}
      `;

      card.innerHTML = `
        <!-- Header Kartu: Ikon, Badge, dan Nomor -->
        <div class="flex items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-4">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">${lessonEmoji}</span>
            <span class="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${theme.badge}">
              ${lesson.badge}
            </span>
          </div>
          <div class="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono font-bold transition-colors ${theme.number}">
            #${index + 1}
          </div>
        </div>

        <!-- Judul & Ringkasan Materi -->
        <div class="space-y-2 mb-4">
          <h3 class="font-bold text-lg md:text-xl text-white leading-snug group-hover:text-cyan-200 transition-colors">
            ${lesson.title}
          </h3>
          <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
            ${lesson.summary}
          </p>
        </div>

        <!-- Konten Detail Interaktif (Aliran Dokumen Alami, Tidak Ada Teks Tumpang Tindih) -->
        <div class="pt-4 border-t border-slate-800/60 flex-1">
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
