/**
 * Kuis Page - Renderisasi soal kuis dan penanganan jawaban
 */

const kuisPage = {
  init() {
    this.renderQuiz();
  },

  renderQuiz() {
    const container = document.getElementById('quiz-questions-container');
    if (!container) return;

    container.innerHTML = '';
    QUIZ_QUESTIONS.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = "p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3";
      
      let optionsHtml = '';
      q.options.forEach((opt, optIdx) => {
        optionsHtml += `
          <button onclick="kuisPage.answerQuiz(${idx}, ${optIdx})" id="quiz-btn-${idx}-${optIdx}" 
            class="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-cyan-500/60 hover:bg-cyan-950/20 text-xs text-slate-300 transition-all font-mono">
            <span class="text-cyan-400 font-bold mr-2">${String.fromCharCode(65 + optIdx)}.</span> ${opt}
          </button>
        `;
      });

      card.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">#${idx + 1}</span>
          <h4 class="text-sm font-semibold text-slate-200">${q.q}</h4>
        </div>
        <div class="space-y-2 mt-2">
          ${optionsHtml}
        </div>
        <div id="quiz-explain-${idx}" class="hidden p-3 rounded-lg text-xs leading-relaxed"></div>
      `;
      container.appendChild(card);
    });
  },

  answerQuiz(qIdx, selectedOptIdx) {
    sounds.playClick();
    const q = QUIZ_QUESTIONS[qIdx];
    const explainBox = document.getElementById(`quiz-explain-${qIdx}`);
    const isCorrect = (selectedOptIdx === q.correct);

    // Tandai pilihan
    q.options.forEach((_, optIdx) => {
      const btn = document.getElementById(`quiz-btn-${qIdx}-${optIdx}`);
      if (!btn) return;
      btn.disabled = true;
      if (optIdx === q.correct) {
        btn.className = "w-full text-left p-3 rounded-lg border border-emerald-500 bg-emerald-950/60 text-emerald-300 text-xs font-mono font-bold";
      } else if (optIdx === selectedOptIdx && !isCorrect) {
        btn.className = "w-full text-left p-3 rounded-lg border border-rose-500 bg-rose-950/60 text-rose-300 text-xs font-mono";
      } else {
        btn.className = "w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-950/20 text-slate-600 text-xs font-mono opacity-40";
      }
    });

    if (explainBox) {
      if (isCorrect) {
        sounds.playAccept();
        explainBox.className = "p-3 rounded-lg text-xs leading-relaxed bg-emerald-950/60 border border-emerald-600/50 text-emerald-300";
        explainBox.innerHTML = `<strong>Jawaban Benar!</strong> ${q.explanation}`;
      } else {
        sounds.playError();
        explainBox.className = "p-3 rounded-lg text-xs leading-relaxed bg-rose-950/60 border border-rose-600/50 text-rose-300";
        explainBox.innerHTML = `<strong>Jawaban Kurang Tepat.</strong> ${q.explanation}`;
      }
      explainBox.classList.remove('hidden');
    }

    // Simpan jawaban ke sessionStorage
    const answers = sessionStorage.getItem('cyberguard_quiz_answers');
    const ansObj = answers ? JSON.parse(answers) : {};
    ansObj[qIdx] = { selected: selectedOptIdx, correct: q.correct, isCorrect };
    sessionStorage.setItem('cyberguard_quiz_answers', JSON.stringify(ansObj));

    // Update progres di AppState
    const progress = AppState.getProgress();
    let totalCorrect = progress.totalCorrect || 0;
    let totalMistakes = progress.totalMistakes || 0;
    if (isCorrect) totalCorrect++;
    else totalMistakes++;
    const total = totalCorrect + totalMistakes;
    progress.totalCorrect = totalCorrect;
    progress.totalMistakes = totalMistakes;
    progress.accuracy = total > 0 ? Math.round((totalCorrect / total) * 100) : 100;
    AppState.setProgress(progress);
  }
};

window.kuisPage = kuisPage;
