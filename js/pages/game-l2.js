/**
 * Game Level 2: Rule Architect
 * Susun aturan firewall dan uji dengan gelombang paket (Top-Down Execution)
 */

class GameLevel2 {
  constructor() {
    this.l2ScenarioIndex = 0;
    this.l2CurrentRules = [];
    this.l2WaveResults = [];
  }

  init(scenarioIndex = 0) {
    this.startLevel2(scenarioIndex);
  }

  startLevel2(scenarioIndex = 0) {
    this.l2ScenarioIndex = scenarioIndex;
    const scenario = LEVEL2_SCENARIOS[scenarioIndex];
    if (!scenario) return;

    // Duplikat rules awal dari skenario
    this.l2CurrentRules = JSON.parse(JSON.stringify(scenario.initialRules));

    // Render Skenario UI
    const titleEl = document.getElementById('l2-scenario-title');
    const descEl = document.getElementById('l2-scenario-desc');
    const targetEl = document.getElementById('l2-target-server');

    if (titleEl) titleEl.textContent = scenario.title;
    if (descEl) descEl.textContent = scenario.description;
    if (targetEl) targetEl.textContent = scenario.targetServer;

    this.renderL2Rules();

    const reportBox = document.getElementById('l2-wave-report');
    if (reportBox) reportBox.classList.add('hidden');
  }

  renderL2Rules() {
    const tableBody = document.getElementById('l2-rules-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    this.l2CurrentRules.forEach((rule, index) => {
      const tr = document.createElement('tr');
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
        <td class="py-2 px-3 font-mono text-cyan-400 font-bold">#${index + 1}</td>
        <td class="py-2 px-3">${actionBadge}</td>
        <td class="py-2 px-3 font-mono text-slate-200">${rule.proto}</td>
        <td class="py-2 px-3 font-mono text-cyan-300 font-semibold">${rule.port}</td>
        <td class="py-2 px-3 font-mono text-slate-300">${rule.src}</td>
        <td class="py-2 px-3 text-slate-400 text-[11px]">${rule.comment || '-'}</td>
        <td class="py-2 px-3 text-right space-x-1 whitespace-nowrap">
          <button onclick="gameL2.moveRule(${index}, -1)" ${index === 0 ? 'disabled' : ''} class="p-1 hover:text-cyan-400 disabled:opacity-20 text-slate-400 touch-target" title="Geser ke Atas">▲</button>
          <button onclick="gameL2.moveRule(${index}, 1)" ${index === this.l2CurrentRules.length - 1 ? 'disabled' : ''} class="p-1 hover:text-cyan-400 disabled:opacity-20 text-slate-400 touch-target" title="Geser ke Bawah">▼</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  moveRule(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.l2CurrentRules.length) return;

    const temp = this.l2CurrentRules[index];
    this.l2CurrentRules[index] = this.l2CurrentRules[targetIndex];
    this.l2CurrentRules[targetIndex] = temp;
    sounds.playClick();
    this.renderL2Rules();
  }

  /**
   * Menjalankan pengujian gelombang paket terhadap susunan aturan siswa
   */
  async runWaveTest() {
    sounds.playAlert();
    const scenario = LEVEL2_SCENARIOS[this.l2ScenarioIndex];
    if (!scenario) return;

    const testBtn = document.getElementById('l2-test-btn');
    if (testBtn) {
      testBtn.disabled = true;
      testBtn.textContent = "⏳ Sedang Menguji Gelombang Serangan...";
    }

    const reportBox = document.getElementById('l2-wave-report');
    const reportList = document.getElementById('l2-report-list');
    if (reportBox) reportBox.classList.remove('hidden');
    if (reportList) reportList.innerHTML = '';

    let successCount = 0;
    const totalPackets = scenario.incomingPackets.length;

    for (let pIdx = 0; pIdx < totalPackets; pIdx++) {
      const pkt = scenario.incomingPackets[pIdx];

      // Evaluasi Top-Down
      let evaluatedAction = 'DROP'; // Default
      let matchedRule = null;
      let matchedIndex = -1;

      for (let rIdx = 0; rIdx < this.l2CurrentRules.length; rIdx++) {
        const rule = this.l2CurrentRules[rIdx];
        const matchProto = rule.proto === 'Any' || rule.proto.toUpperCase() === pkt.proto.toUpperCase();
        const matchPort = rule.port === 'Any' || String(rule.port) === String(pkt.port);
        const matchSrc = rule.src === 'Any' || rule.src.trim() === pkt.src.trim();

        if (matchProto && matchPort && matchSrc) {
          evaluatedAction = rule.action;
          matchedRule = rule;
          matchedIndex = rIdx + 1;
          break;
        }
      }

      const passed = (evaluatedAction === 'ACCEPT');
      const isCorrectOutcome = (passed === pkt.shouldPass);

      if (isCorrectOutcome) successCount++;

      // Tampilkan baris laporan
      const li = document.createElement('li');
      li.className = `p-2 rounded border text-xs font-mono flex items-center justify-between ${
        isCorrectOutcome ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300' : 'bg-rose-950/40 border-rose-600/50 text-rose-300'
      }`;

      li.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>${isCorrectOutcome ? '✓ [LOLOS UJI]' : '✕ [GAGAL]'}</span>
          <span>${pkt.desc} (Port ${pkt.port} ${pkt.proto} dari ${pkt.src})</span>
        </div>
        <div class="text-[11px] text-slate-300">
          Aksi: <strong>${evaluatedAction}</strong> via Rule #${matchedIndex || 'Default'} (Harusnya: ${pkt.shouldPass ? 'ACCEPT' : 'DROP'})
        </div>
      `;
      reportList.appendChild(li);
      await Utils.sleep(300);
    }

    if (testBtn) {
      testBtn.disabled = false;
      testBtn.textContent = "🚀 Deploy & Uji Gelombang Serangan";
    }

    const accuracy = Math.round((successCount / totalPackets) * 100);

    // Simpan progres ke AppState
    const progress = AppState.getProgress();
    let level2Score = (progress.level2 && progress.level2.score) || 0;
    level2Score += successCount * 150;
    progress.level2 = {
      score: level2Score,
      completed: accuracy === 100
    };
    if (accuracy === 100) {
      progress.badge = 'Firewall Architect';
    }
    progress.totalScore = (progress.level1?.score || 0) + level2Score + (progress.level3?.score || 0);
    AppState.setProgress(progress);

    if (accuracy === 100) {
      sounds.playWin();
      setTimeout(() => {
        if (this.l2ScenarioIndex < LEVEL2_SCENARIOS.length - 1) {
          alert(`Luar biasa! Seluruh aturan pada Skenario ${this.l2ScenarioIndex + 1} bekerja 100% sempurna! Melanjutkan ke skenario berikutnya.`);
          this.startLevel2(this.l2ScenarioIndex + 1);
        } else {
          alert(`Level 2: Rule Architect Selesai!\nSkor Level 2: ${level2Score} Poin\n\nLanjut ke Level 3: Cyber Defense Rush`);
          Router.navigate('game-l3.html');
        }
      }, 800);
    } else {
      sounds.playError();
      alert(`Efektivitas Firewall: ${accuracy}%. Beberapa paket sah terblokir atau serangan berhasil lolos. Perhatikan urutan aturan (Top-Down Priority) lalu uji kembali!`);
    }
  }
}

const gameL2 = new GameLevel2();
window.gameL2 = gameL2;
