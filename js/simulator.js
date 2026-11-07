/**
 * CyberGuard - Laboratorium Simulasi Paket Data & Evaluasi Aturan Firewall
 * Memvisualisasikan prinsip Top-Down Rule Matching secara interaktif.
 */

class PacketSimulator {
  constructor() {
    this.rules = [
      { id: 1, action: "ACCEPT", proto: "TCP", port: 443, src: "Any", comment: "Web HTTPS Aman" },
      { id: 2, action: "ACCEPT", proto: "TCP", port: 22, src: "192.168.1.50", comment: "SSH Khusus Admin" },
      { id: 3, action: "DROP", proto: "TCP", port: 23, src: "Any", comment: "Blokir Telnet tak terenkripsi" },
      { id: 4, action: "DROP", proto: "TCP", port: 3306, src: "Any", comment: "Blokir Akses DB dari luar" },
      { id: 5, action: "DROP", proto: "Any", port: "Any", src: "Any", comment: "Default Policy (Drop All)" }
    ];
    this.isSimulating = false;
  }

  renderRules() {
    const tableBody = document.getElementById('sim-rules-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    this.rules.forEach((rule, index) => {
      const tr = document.createElement('tr');
      tr.id = `sim-rule-row-${rule.id}`;
      tr.className = "border-b border-slate-800 text-xs hover:bg-slate-800/40 transition-colors";

      let actionBadge = '';
      if (rule.action === 'ACCEPT') {
        actionBadge = `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">ACCEPT</span>`;
      } else if (rule.action === 'DROP') {
        actionBadge = `<span class="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-mono font-bold">DROP</span>`;
      } else {
        actionBadge = `<span class="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">REJECT</span>`;
      }

      tr.innerHTML = `
        <td class="py-2 px-3 font-mono text-slate-400 font-bold">#${index + 1}</td>
        <td class="py-2 px-3">${actionBadge}</td>
        <td class="py-2 px-3 font-mono text-slate-200">${rule.proto}</td>
        <td class="py-2 px-3 font-mono text-cyan-400 font-semibold">${rule.port}</td>
        <td class="py-2 px-3 font-mono text-slate-300">${rule.src}</td>
        <td class="py-2 px-3 text-slate-400 text-[11px] truncate max-w-[140px]">${rule.comment || '-'}</td>
        <td class="py-2 px-3 text-right space-x-1 whitespace-nowrap">
          <button onclick="simulator.moveRule(${index}, -1)" ${index === 0 ? 'disabled' : ''} class="p-1 hover:text-cyan-400 disabled:opacity-20 text-slate-400" title="Geser ke Atas">▲</button>
          <button onclick="simulator.moveRule(${index}, 1)" ${index === this.rules.length - 1 ? 'disabled' : ''} class="p-1 hover:text-cyan-400 disabled:opacity-20 text-slate-400" title="Geser ke Bawah">▼</button>
          <button onclick="simulator.deleteRule(${rule.id})" class="p-1 hover:text-rose-400 text-slate-500" title="Hapus Rule">✕</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  moveRule(index, direction) {
    if (this.isSimulating) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.rules.length) return;

    const temp = this.rules[index];
    this.rules[index] = this.rules[targetIndex];
    this.rules[targetIndex] = temp;
    sounds.playClick();
    this.renderRules();
  }

  deleteRule(ruleId) {
    if (this.isSimulating) return;
    if (this.rules.length <= 1) {
      alert("Harus ada minimal 1 aturan firewall!");
      return;
    }
    this.rules = this.rules.filter(r => r.id !== ruleId);
    sounds.playClick();
    this.renderRules();
  }

  addRule(action, proto, port, src, comment) {
    if (this.isSimulating) return;
    const newId = Date.now();
    // Sisipkan sebelum default rule paling bawah jika ada
    const lastRule = this.rules[this.rules.length - 1];
    if (lastRule && lastRule.port === 'Any' && lastRule.src === 'Any') {
      this.rules.splice(this.rules.length - 1, 0, {
        id: newId,
        action,
        proto,
        port: port.trim() || 'Any',
        src: src.trim() || 'Any',
        comment: comment.trim() || 'Custom Rule'
      });
    } else {
      this.rules.push({
        id: newId,
        action,
        proto,
        port: port.trim() || 'Any',
        src: src.trim() || 'Any',
        comment: comment.trim() || 'Custom Rule'
      });
    }
    sounds.playClick();
    this.renderRules();
  }

  resetRules() {
    this.rules = [
      { id: 1, action: "ACCEPT", proto: "TCP", port: 443, src: "Any", comment: "Web HTTPS Aman" },
      { id: 2, action: "ACCEPT", proto: "TCP", port: 22, src: "192.168.1.50", comment: "SSH Khusus Admin" },
      { id: 3, action: "DROP", proto: "TCP", port: 23, src: "Any", comment: "Blokir Telnet tak terenkripsi" },
      { id: 4, action: "DROP", proto: "TCP", port: 3306, src: "Any", comment: "Blokir Akses DB dari luar" },
      { id: 5, action: "DROP", proto: "Any", port: "Any", src: "Any", comment: "Default Policy (Drop All)" }
    ];
    sounds.playClick();
    this.renderRules();
  }

  /**
   * Mengirim paket dan menyimulasikan evaluasi aturan
   */
  async sendPacket(packetData) {
    if (this.isSimulating) return;
    this.isSimulating = true;
    sounds.playClick();

    const logBox = document.getElementById('sim-log-box');
    const visualPacket = document.getElementById('sim-visual-packet');
    const fwShield = document.getElementById('sim-firewall-shield');
    const resultVerdict = document.getElementById('sim-verdict-banner');

    if (logBox) logBox.innerHTML = '';
    if (resultVerdict) resultVerdict.classList.add('hidden');

    this.appendLog(logBox, `🚀 [TRANSMIT] Paket dikirim dari ${packetData.srcIp} menuju Port ${packetData.destPort} (${packetData.proto})`);

    // Reset posisi visual packet
    if (visualPacket) {
      visualPacket.className = 'w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all duration-700 bg-cyan-500 text-slate-900 border-2 border-cyan-300';
      visualPacket.style.transform = 'translateX(0px)';
      visualPacket.innerText = packetData.destPort;
      visualPacket.classList.remove('hidden');
    }

    // Langkah 1: Paket bergerak ke Firewall Gateway
    await this.sleep(400);
    if (visualPacket) {
      visualPacket.style.transform = 'translateX(170px)';
    }

    await this.sleep(700);
    this.appendLog(logBox, `🔍 [FIREWALL] Paket tiba di gerbang firewall. Mulai pemeriksaan Top-Down Rule...`);

    // Evaluasi aturan satu per satu
    let matchedRule = null;
    let matchIndex = -1;

    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      const rowElem = document.getElementById(`sim-rule-row-${rule.id}`);
      if (rowElem) rowElem.classList.add('bg-cyan-950/80', 'text-cyan-200');

      await this.sleep(400);

      // Cek kriteria
      const matchProto = rule.proto === 'Any' || rule.proto.toUpperCase() === packetData.proto.toUpperCase();
      const matchPort = rule.port === 'Any' || String(rule.port) === String(packetData.destPort);
      const matchSrc = rule.src === 'Any' || rule.src.trim() === packetData.srcIp.trim();

      if (matchProto && matchPort && matchSrc) {
        matchedRule = rule;
        matchIndex = i + 1;
        this.appendLog(logBox, `⚡ [MATCH] Cocok dengan Rule #${matchIndex}: [${rule.action}] Protocol:${rule.proto} Port:${rule.port} Src:${rule.src} (${rule.comment})`);
        if (rowElem) {
          rowElem.classList.remove('bg-cyan-950/80', 'text-cyan-200');
          rowElem.classList.add(rule.action === 'ACCEPT' ? 'bg-emerald-950/90' : 'bg-rose-950/90');
        }
        break;
      } else {
        this.appendLog(logBox, `⏭️ Rule #${i + 1} tidak cocok. Melanjutkan ke rule berikutnya...`);
        if (rowElem) rowElem.classList.remove('bg-cyan-950/80', 'text-cyan-200');
      }
    }

    // Jika tidak ada rule yang match, gunakan fallback DROP
    if (!matchedRule) {
      matchedRule = { action: 'DROP', comment: 'Implisit Default Drop' };
      this.appendLog(logBox, `⚠️ Tidak ada aturan yang cocok! Implisit Default: DROP`);
    }

    await this.sleep(400);

    // Langkah 2: Eksekusi Keputusan
    if (matchedRule.action === 'ACCEPT') {
      sounds.playAccept();
      if (visualPacket) {
        visualPacket.className = 'w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all duration-700 bg-emerald-500 text-slate-900 border-2 border-emerald-300 pass-through-right';
        visualPacket.style.transform = 'translateX(340px)';
      }
      this.showVerdict(resultVerdict, 'ACCEPTED', 'emerald', `Paket Diizinkan Masuk ke Server Internal melalui Rule #${matchIndex}!`);
      this.appendLog(logBox, `✅ [SUCCESS] Paket berhasil diterima oleh Server Tujuan.`);
    } else if (matchedRule.action === 'DROP') {
      sounds.playDrop();
      if (fwShield) {
        fwShield.classList.add('border-rose-500', 'glow-red');
        setTimeout(() => fwShield.classList.remove('border-rose-500', 'glow-red'), 600);
      }
      if (visualPacket) {
        visualPacket.className = 'w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all duration-300 bg-rose-600 text-white border-2 border-rose-300 laser-zap-out';
      }
      this.showVerdict(resultVerdict, 'DROPPED', 'rose', `Paket Dibuang Diam-diam (Stealth DROP) oleh Rule #${matchIndex}! Penyerang mengalami Timeout.`);
      this.appendLog(logBox, `🛡️ [DROPPED] Paket dimusnahkan di gerbang firewall.`);
    } else {
      // REJECT
      sounds.playReject();
      if (visualPacket) {
        visualPacket.className = 'w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all duration-500 bg-amber-500 text-slate-900 border-2 border-amber-300';
        visualPacket.style.transform = 'translateX(0px)';
      }
      this.showVerdict(resultVerdict, 'REJECTED', 'amber', `Paket Ditolak dengan Balasan RST/ICMP Unreachable oleh Rule #${matchIndex}!`);
      this.appendLog(logBox, `🚫 [REJECTED] Sinyal penolakan dikembalikan ke pengirim.`);
    }

    // Bersihkan highlight baris rule
    setTimeout(() => {
      this.renderRules();
      this.isSimulating = false;
    }, 1500);
  }

  showVerdict(element, title, color, desc) {
    if (!element) return;
    element.className = `p-3.5 rounded-lg border flex items-center gap-3 bg-${color}-950/60 border-${color}-600/60 text-slate-200`;
    element.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-${color}-500/20 text-${color}-400 flex items-center justify-center font-bold text-sm shrink-0">
        ${title === 'ACCEPTED' ? '✓' : '✕'}
      </div>
      <div>
        <h5 class="font-bold text-${color}-400 text-sm font-mono">${title}</h5>
        <p class="text-xs text-slate-300">${desc}</p>
      </div>
    `;
    element.classList.remove('hidden');
  }

  appendLog(container, text) {
    if (!container) return;
    const div = document.createElement('div');
    div.className = "text-[11px] font-mono text-slate-300 border-l-2 border-cyan-500/40 pl-2 py-0.5";
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const simulator = new PacketSimulator();

