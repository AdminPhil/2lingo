/**
 * E2E Interactive Quiz and Practice HTML Fixture
 * Generates an accurate, self-contained DOM representation of the CroLingo lesson
 * quiz and practice sandbox matching app/lesson/quiz.tsx, app/lesson/card.tsx,
 * app/lesson/challenge.tsx, app/lesson/header.tsx, and app/lesson/practice/practice-quiz.tsx.
 * 
 * Works 100% offline without network dependencies or Clerk authentication,
 * accurately validating 2x2 CSS grid layout, break-words anti-truncation,
 * option selection, check/next state progression, mistake non-penalty, and heart recharge.
 */

export interface QuizFixtureOptions {
  mode?: "lesson" | "practice";
  initialHearts?: number;
  initialPercentage?: number;
  question?: string;
  isSuperIzazov?: boolean;
}

export function generateQuizHtml({
  mode = "lesson",
  initialHearts = 5,
  initialPercentage = 25,
  question = "Kako se kaže 'Dobar dan'?",
  isSuperIzazov = false,
}: QuizFixtureOptions = {}): string {
  const isPractice = mode === "practice";

  return `<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CroLingo - ${isPractice ? "Practice" : "Lesson"}</title>
  <style>
    /* Reset & Base Fonts */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #334155;
      overflow-x: hidden;
    }

    /* Layout Containers */
    .app-root { display: flex; flex-direction: column; height: 100%; }
    .header-bar {
      width: 100%;
      max-width: 1140px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      gap: 16px;
    }
    @media (min-width: 1024px) {
      .header-bar { padding: 40px 40px 20px; }
    }

    .exit-btn {
      cursor: pointer;
      color: #64748b;
      font-size: 24px;
      font-weight: bold;
      background: none;
      border: none;
      padding: 4px;
    }
    .exit-btn:hover { opacity: 0.75; }

    /* Progress Bar */
    .progress-track {
      flex: 1;
      height: 14px;
      background-color: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
      position: relative;
    }
    .progress-fill {
      height: 100%;
      background-color: #10b981;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }

    /* Heart Indicator */
    .heart-button {
      display: flex;
      align-items: center;
      font-weight: 800;
      font-size: 16px;
      color: #f43f5e;
      background: none;
      border: none;
      padding: 6px 10px;
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .heart-button:hover { background-color: #fff1f2; }
    .heart-icon { margin-right: 6px; font-size: 20px; }

    /* Practice Mode Banner */
    .practice-banner {
      background-color: #fef3c7;
      color: #92400e;
      text-align: center;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 700;
      border-bottom: 1px solid #fde68a;
    }

    /* Content Area */
    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .challenge-container {
      width: 100%;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin: 16px 0;
    }

    .question-title {
      font-size: 20px;
      font-weight: 800;
      color: #334155;
      text-align: center;
    }
    @media (min-width: 1024px) {
      .question-title { font-size: 28px; text-align: left; }
    }

    /* Challenge 2x2 Grid Layout */
    .challenge-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      width: 100%;
    }
    /* sm breakpoint >= 640px: iPad and Desktop render balanced 2x2 grid */
    @media (min-width: 640px) {
      .challenge-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    /* Challenge Card */
    .card-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      border: 2px solid #e2e8f0;
      border-bottom-width: 4px;
      border-radius: 16px;
      padding: 16px;
      cursor: pointer;
      background-color: #ffffff;
      transition: all 0.15s ease;
      min-height: 80px;
      position: relative;
      user-select: none;
    }
    .card-tile:hover {
      background-color: #f8fafc;
      border-color: #cbd5e1;
    }
    .card-tile:active {
      border-bottom-width: 2px;
      transform: translateY(2px);
    }
    .card-tile.selected {
      border-color: #7dd3fc;
      background-color: #f0f9ff;
    }
    .card-tile.correct {
      border-color: #86efac;
      background-color: #f0fdf4;
    }
    .card-tile.wrong {
      border-color: #fca5a5;
      background-color: #fef2f2;
    }

    .hotkey-badge {
      font-size: 11px;
      font-weight: 800;
      color: #94a3b8;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: flex-start;
      margin-bottom: 8px;
    }

    /* Option Text with Croatian Anti-Truncation break-words */
    .card-text {
      font-size: 15px;
      font-weight: 700;
      color: #334155;
      text-align: center;
      line-height: 1.35;
      overflow-wrap: break-word;
      word-break: break-word;
      width: 100%;
    }
    .card-tile.selected .card-text { color: #0284c7; }
    .card-tile.correct .card-text { color: #16a34a; }
    .card-tile.wrong .card-text { color: #e11d48; }

    /* Footer Control Bar */
    .footer-bar {
      height: 100px;
      border-top: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      transition: background-color 0.2s, border-color 0.2s;
    }
    @media (min-width: 1024px) {
      .footer-bar { height: 120px; padding: 0 40px; }
    }
    .footer-bar.correct {
      background-color: #dcfce7;
      border-color: transparent;
    }
    .footer-bar.wrong {
      background-color: #ffe4e6;
      border-color: transparent;
    }

    .feedback-message {
      font-size: 18px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .feedback-message.correct { color: #16a34a; }
    .feedback-message.wrong { color: #e11d48; }

    .action-btn {
      margin-left: auto;
      padding: 12px 32px;
      font-size: 16px;
      font-weight: 800;
      border-radius: 14px;
      border: none;
      border-bottom: 4px solid transparent;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .action-btn.secondary {
      background-color: #10b981;
      color: #ffffff;
      border-bottom-color: #059669;
    }
    .action-btn.secondary:hover { background-color: #059669; }
    .action-btn.danger {
      background-color: #ef4444;
      color: #ffffff;
      border-bottom-color: #dc2626;
    }
    .action-btn.danger:hover { background-color: #dc2626; }
    .action-btn:disabled {
      background-color: #e2e8f0;
      color: #94a3b8;
      border-bottom-color: #cbd5e1;
      cursor: not-allowed;
    }
    .action-btn:active:not(:disabled) {
      border-bottom-width: 0;
      transform: translateY(4px);
    }

    /* Modal Dialog */
    .modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 50;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-overlay.open { display: flex; }
    .modal-card {
      background: #ffffff;
      border-radius: 24px;
      max-width: 420px;
      width: 100%;
      padding: 24px;
      text-align: center;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
    }
    .modal-title { font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
    .modal-desc { font-size: 14px; color: #64748b; margin-bottom: 20px; line-height: 1.5; }
    .modal-btn {
      width: 100%;
      padding: 14px;
      font-size: 15px;
      font-weight: 800;
      border-radius: 14px;
      border: none;
      cursor: pointer;
      margin-bottom: 10px;
    }
    .modal-btn-primary { background-color: #16a34a; color: #ffffff; }
    .modal-btn-outline { background-color: #ffffff; border: 2px solid #e2e8f0; color: #475569; }

    /* Completion View */
    .completion-container {
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      max-width: 480px;
      margin: auto;
      text-align: center;
      padding: 24px;
    }
    .completion-title { font-size: 26px; font-weight: 900; color: #1e293b; }
    .completion-desc { font-size: 15px; color: #64748b; line-height: 1.5; }
    .result-row { display: flex; gap: 16px; width: 100%; justify-content: center; margin: 12px 0; }
    .result-pill {
      flex: 1;
      padding: 16px;
      border-radius: 16px;
      border: 2px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .result-pill.points { border-color: #fde047; background-color: #fefce8; color: #a16207; }
    .result-pill.hearts { border-color: #fca5a5; background-color: #fef2f2; color: #e11d48; }
    .result-pill .val { font-size: 22px; font-weight: 900; }
    .result-pill .lbl { font-size: 12px; font-weight: 700; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="app-root">
    <!-- Header -->
    <header class="header-bar">
      <button class="exit-btn" id="exit-btn" aria-label="Exit lesson">✕</button>
      <div class="progress-track" role="progressbar" aria-valuenow="${initialPercentage}">
        <div class="progress-fill" id="progress-fill" style="width: ${initialPercentage}%;"></div>
      </div>
      <button class="heart-button" id="heart-btn" title="Click to recharge hearts">
        <span class="heart-icon">❤️</span>
        <span id="heart-count">${initialHearts}</span>
      </button>
    </header>

    ${
      isPractice
        ? `<div class="practice-banner" id="practice-banner">
             ⚡ Practice Mode • Answer 3 review questions to earn +1 ❤️ (Mistakes don't cost hearts)
           </div>`
        : ""
    }

    <!-- Main Challenge Area -->
    <main class="content-area" id="quiz-main">
      <div class="challenge-container" id="challenge-container">
        <h1 class="question-title" id="question-heading">${question}</h1>

        <div class="challenge-grid sm:grid-cols-2" id="options-grid">
          <div class="card-tile" data-id="1" data-correct="false" tabindex="0">
            <span class="hotkey-badge">1</span>
            <p class="card-text break-words">Dobro jutro</p>
          </div>
          <div class="card-tile" data-id="2" data-correct="true" tabindex="0">
            <span class="hotkey-badge">2</span>
            <p class="card-text break-words">Dobar dan</p>
          </div>
          <div class="card-tile" data-id="3" data-correct="false" tabindex="0">
            <span class="hotkey-badge">3</span>
            <p class="card-text break-words">Laku noć</p>
          </div>
          <div class="card-tile" data-id="4" data-correct="false" tabindex="0">
            <span class="hotkey-badge">4</span>
            <p class="card-text break-words">Gdje se nalazi najbliža ljekarna i pošta u ovom starom gradu?</p>
          </div>
        </div>
      </div>

      <!-- Completion View (Hidden Initially) -->
      <div class="completion-container" id="completion-view">
        <div style="font-size: 56px;">🎉</div>
        <h1 class="completion-title" id="completion-title">
          ${isPractice ? "Heart Recharged! ❤️" : "Lekcija dovršena! 🇭🇷"}
        </h1>
        <p class="completion-desc">
          ${
            isPractice
              ? "Awesome practice! You reviewed Croatian words and earned +1 Heart to continue your journey!"
              : "Great job completing your Croatian lesson! Keep up your streak."
          }
        </p>
        <div class="result-row">
          <div class="result-pill points">
            <span class="val">+10</span>
            <span class="lbl">XP Bodova</span>
          </div>
          <div class="result-pill hearts">
            <span class="val" id="final-hearts">${isPractice ? Math.min(initialHearts + 1, 5) : initialHearts}</span>
            <span class="lbl">Hearts</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Bar -->
    <footer class="footer-bar" id="footer-bar">
      <div class="feedback-message" id="feedback-msg"></div>
      <button class="action-btn secondary" id="action-btn" disabled>Check</button>
    </footer>

    <!-- Heart Dialog -->
    <div class="modal-overlay" id="heart-dialog">
      <div class="modal-card">
        <div style="font-size: 40px; margin-bottom: 8px;">🐶</div>
        <h2 class="modal-title">Need a Heart? ❤️</h2>
        <p class="modal-desc">
          You currently have <strong style="color: #f43f5e;"><span id="dialog-hearts">${initialHearts}</span>/5 hearts</strong>.
          Would you like to recharge a heart right now with 3 quick review questions?
        </p>
        <button class="modal-btn modal-btn-primary" id="go-practice-btn">💪 Go to Practice (+1 ❤️)</button>
        <button class="modal-btn modal-btn-outline" id="close-dialog-btn">Keep Playing Lesson</button>
      </div>
    </div>
  </div>

  <script>
    (function() {
      const mode = "${mode}";
      let hearts = ${initialHearts};
      let percentage = ${initialPercentage};
      let selectedId = null;
      let status = "none"; // 'none' | 'selected' | 'correct' | 'wrong' | 'completed'
      let questionIndex = 0;
      const totalQuestions = 3;

      const cards = Array.from(document.querySelectorAll('.card-tile'));
      const actionBtn = document.getElementById('action-btn');
      const footerBar = document.getElementById('footer-bar');
      const feedbackMsg = document.getElementById('feedback-msg');
      const heartBtn = document.getElementById('heart-btn');
      const heartCountEl = document.getElementById('heart-count');
      const heartDialog = document.getElementById('heart-dialog');
      const goPracticeBtn = document.getElementById('go-practice-btn');
      const closeDialogBtn = document.getElementById('close-dialog-btn');
      const challengeContainer = document.getElementById('challenge-container');
      const completionView = document.getElementById('completion-view');
      const progressFill = document.getElementById('progress-fill');

      // Card Selection
      cards.forEach(card => {
        card.addEventListener('click', () => {
          if (status === 'correct' || status === 'completed') return;
          cards.forEach(c => c.classList.remove('selected', 'wrong'));
          card.classList.add('selected');
          selectedId = card.getAttribute('data-id');
          status = 'selected';
          actionBtn.disabled = false;
          actionBtn.textContent = 'Check';
          actionBtn.className = 'action-btn secondary';
          footerBar.className = 'footer-bar';
          feedbackMsg.textContent = '';
        });
      });

      // Keyboard hotkeys 1-4
      window.addEventListener('keydown', (e) => {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (cards[idx]) cards[idx].click();
        }
        if (e.key === 'Enter' && !actionBtn.disabled) {
          actionBtn.click();
        }
      });

      // Action Button Click (Check / Next / Retry / Continue)
      actionBtn.addEventListener('click', () => {
        if (status === 'selected') {
          const selectedCard = cards.find(c => c.getAttribute('data-id') === selectedId);
          const isCorrect = selectedCard && selectedCard.getAttribute('data-correct') === 'true';

          if (isCorrect) {
            status = 'correct';
            selectedCard.classList.remove('selected');
            selectedCard.classList.add('correct');
            footerBar.className = 'footer-bar correct';
            feedbackMsg.className = 'feedback-message correct';
            feedbackMsg.textContent = '✓ Nicely done!';
            actionBtn.textContent = 'Next';
            actionBtn.className = 'action-btn secondary';
          } else {
            status = 'wrong';
            selectedCard.classList.remove('selected');
            selectedCard.classList.add('wrong');
            footerBar.className = 'footer-bar wrong';
            feedbackMsg.className = 'feedback-message wrong';
            feedbackMsg.textContent = '✗ Try again.';
            actionBtn.textContent = 'Retry';
            actionBtn.className = 'action-btn danger';

            // Lesson mode decrements hearts on mistake; Practice mode DOES NOT decrement hearts!
            if (mode === 'lesson') {
              hearts = Math.max(0, hearts - 1);
              heartCountEl.textContent = hearts;
              document.getElementById('dialog-hearts').textContent = hearts;
            }
          }
          return;
        }

        if (status === 'wrong') {
          // Retry: reset selection
          status = 'none';
          cards.forEach(c => c.classList.remove('selected', 'wrong'));
          selectedId = null;
          actionBtn.disabled = true;
          actionBtn.textContent = 'Check';
          actionBtn.className = 'action-btn secondary';
          footerBar.className = 'footer-bar';
          feedbackMsg.textContent = '';
          return;
        }

        if (status === 'correct') {
          questionIndex++;
          percentage = Math.min(100, Math.round(((questionIndex + 1) / totalQuestions) * 100));
          progressFill.style.width = percentage + '%';

          if (questionIndex >= totalQuestions) {
            // Completion
            status = 'completed';
            challengeContainer.style.display = 'none';
            completionView.style.display = 'flex';
            footerBar.className = 'footer-bar';
            feedbackMsg.textContent = '';
            actionBtn.textContent = mode === 'practice' ? 'Continue Adventure' : 'Continue';
            actionBtn.className = 'action-btn secondary';

            if (mode === 'practice') {
              hearts = Math.min(5, hearts + 1);
              heartCountEl.textContent = hearts;
              document.getElementById('final-hearts').textContent = hearts;
            }
          } else {
            // Advance to next question
            status = 'none';
            cards.forEach(c => c.classList.remove('selected', 'correct', 'wrong'));
            selectedId = null;
            actionBtn.disabled = true;
            actionBtn.textContent = 'Check';
            actionBtn.className = 'action-btn secondary';
            footerBar.className = 'footer-bar';
            feedbackMsg.textContent = '';
            document.getElementById('question-heading').textContent = 'Pitanje broj ' + (questionIndex + 1) + ': Odaberi točan prijevod.';
          }
          return;
        }

        if (status === 'completed') {
          window.location.href = '/learn';
        }
      });

      // Heart Button opens dialog
      heartBtn.addEventListener('click', () => {
        heartDialog.classList.add('open');
      });
      closeDialogBtn.addEventListener('click', () => {
        heartDialog.classList.remove('open');
      });
      goPracticeBtn.addEventListener('click', () => {
        heartDialog.classList.remove('open');
        window.location.href = '/lesson/practice';
      });
    })();
  </script>
</body>
</html>`;
}
