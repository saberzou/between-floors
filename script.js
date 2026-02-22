gsap.registerPlugin(ScrollTrigger);

const floorNumber = document.querySelector('.floor-number');
const scrollHint = document.querySelector('.scroll-hint');
const storyLines = document.querySelectorAll('.story-line');
const totalFloors = storyLines.length;

// ============ STATE ============
const floorColors = [
    ['#1e3a55', '#2a5070', '#163048'],
    ['#224568', '#2e5a80', '#1a3850'],
    ['#264a6e', '#326088', '#1e4058'],
    ['#2a5075', '#366890', '#224860'],
    ['#4a4028', '#5e5438', '#3a3018'],
    ['#3e2868', '#523488', '#2c1850'],
    ['#1e4a38', '#2a6050', '#163828'],
    ['#384858', '#4a5a6e', '#2c3848'],
    ['#4a4028', '#5e5438', '#3a3018'],
    ['#382060', '#4c2c80', '#281448'],
];

let grainient = null;

// ============ STATE ============
let currentIndex = 0;
let isAnimating = false;
let scrollHintHidden = false;

// ============ SHOW LINE ============
function showLine(index, goingUp) {
    if (index < 0 || index >= totalFloors) return;

    isAnimating = true;
    currentIndex = index;
    const floor = index;

    storyLines.forEach(line => gsap.killTweensOf(line));
    storyLines.forEach((line, i) => {
        if (i !== index) gsap.set(line, { opacity: 0 });
    });

    gsap.fromTo(storyLines[index],
        { opacity: 0, y: goingUp ? 25 : -25 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
          onComplete() { isAnimating = false; } }
    );

    if (grainient) {
        const c = floorColors[floor] || floorColors[0];
        grainient.setColors(c[0], c[1], c[2]);
    }

    floorNumber.classList.remove('glitch');
    gsap.killTweensOf(floorNumber);

    if (floor === 10) {
        // Quiz is now an overlay — this floor shouldn't exist
        return;
    } else {
        gsap.to(floorNumber, { opacity: 1, duration: 0.3 });
        gsap.to(document.querySelector('.building-name'), { opacity: 0.4, duration: 0.3 });
        gsap.to(floorNumber, {
            textContent: floor,
            duration: 0.3,
            ease: 'power2.inOut',
            snap: { textContent: 1 },
            onUpdate() {
                floorNumber.textContent = Math.round(parseFloat(floorNumber.textContent));
            }
        });
    }

    const p = floor / (totalFloors - 1);
    const r = Math.round(100 * p);
    const g2 = Math.round(217 - 17 * p);
    floorNumber.style.color = `rgb(${r}, ${g2}, 255)`;

    if (floor > 0 && !scrollHintHidden) {
        scrollHintHidden = true;
        gsap.to(scrollHint, { opacity: 0, y: 10, duration: 0.8 });
    }
}

// ============ NAVIGATION ============
function goUp() {
    if (isAnimating) return;
    if (currentIndex === 9) { openQuizOverlay(); return; }
    const next = currentIndex + 1;
    if (next < totalFloors) showLine(next, true);
}

function goDown() {
    if (isAnimating) return;
    if (currentIndex === 0) return;
    const next = currentIndex - 1;
    if (next >= 0) showLine(next, false);
}

// ============ TOUCH ============
let touchStartY = 0;
const SWIPE_THRESHOLD = 30;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    // Allow scrolling inside overlays (quiz, vocab, info)
    if (e.target.closest('.quiz-overlay-scroll, .info-scroll')) return;
    // Prevent default scrolling on the main page
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', (e) => {
    if (isOverlayOpen()) return;
    // Don't intercept taps on interactive elements
    if (e.target.closest('.quiz-option, .quiz-btn, .vocab-word, .vocab-pill, .info-pill, .info-close')) return;
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
    if (deltaY > 0) goUp(); else goDown();
});

// ============ WHEEL / TRACKPAD ============
let wheelAccum = 0;
let wheelTimer = null;
const WHEEL_THRESHOLD = 50;

document.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isAnimating) return;
    if (isOverlayOpen()) return;

    wheelAccum += e.deltaY;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelAccum = 0; }, 200);

    if (Math.abs(wheelAccum) >= WHEEL_THRESHOLD) {
        if (wheelAccum > 0) goUp(); else goDown();
        wheelAccum = 0;
    }
}, { passive: false });

// ============ KEYBOARD ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); goUp(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); goDown(); }
    if (e.key === 'Escape') {
        closeInfoOverlay();
        closeVocabOverlay();
        closeQuizOverlay();
        hideTooltip();
    }
});

// ============ RETURNING READER ============
const VISIT_KEY = 'bf-visits';

function getVisitCount() {
    return parseInt(localStorage.getItem(VISIT_KEY) || '0', 10);
}
function incrementVisits() {
    const n = getVisitCount() + 1;
    localStorage.setItem(VISIT_KEY, String(n));
    return n;
}

function applyReturningReader() {
    if (getVisitCount() > 1) {
        const returnMsg = document.querySelector('.returning-reader-msg');
        if (returnMsg) returnMsg.hidden = false;
    }
}

// ============ OVERLAYS ============
function isOverlayOpen() {
    return document.getElementById('infoOverlay').classList.contains('open') ||
           document.getElementById('vocabOverlay').classList.contains('open') ||
           document.getElementById('quizOverlay').classList.contains('open');
}

function openInfoOverlay() {
    document.getElementById('infoOverlay').classList.add('open');
}

function closeInfoOverlay() {
    document.getElementById('infoOverlay').classList.remove('open');
}

// ============ VOCAB OVERLAY ============
function openVocabOverlay() {
    const overlay = document.getElementById('vocabOverlay');
    const content = document.getElementById('vocabContent');
    
    // Populate content
    const data = VOCAB.story1;
    content.innerHTML = `
        <h1>Vocabulary</h1>
        <p class="info-tagline">Story 1: ${data.title} — ${data.words.length} words</p>
        <div class="info-divider"></div>
        ${data.words.map((w, i) => `
            <div class="vocab-entry">
                <div class="vocab-entry-word">${w.word}</div>
                <div class="vocab-entry-meta">${w.type} &nbsp; ${w.pronunciation} &nbsp; ${w.level}</div>
                <div class="vocab-entry-def">${w.definition}</div>
                <div class="vocab-entry-context">"${w.inStory}"</div>
                <ul class="vocab-entry-examples">
                    ${w.examples.map(ex => `<li>${ex}</li>`).join('')}
                </ul>
                <div class="vocab-entry-synonyms">Synonyms: <span>${w.synonyms.join(', ')}</span></div>
            </div>
        `).join('')}
    `;
    
    overlay.classList.add('open');
}

function closeVocabOverlay() {
    document.getElementById('vocabOverlay').classList.remove('open');
}

// ============ QUIZ OVERLAY ============
function openQuizOverlay() {
    document.getElementById('quizOverlay').classList.add('open');
    initQuiz();
}

function closeQuizOverlay() {
    document.getElementById('quizOverlay').classList.remove('open');
    // Reset animation state so navigation works after closing
    isAnimating = false;
}

// ============ VOCAB TOOLTIPS ============
const tooltip = document.getElementById('vocabTooltip');

document.addEventListener('click', (e) => {
    const vocabEl = e.target.closest('.vocab-word');
    if (vocabEl) {
        e.stopPropagation();
        showTooltip(vocabEl);
        return;
    }
    // Click elsewhere dismisses tooltip
    if (!e.target.closest('.vocab-tooltip')) {
        hideTooltip();
    }
});

function showTooltip(el) {
    const word = el.dataset.word;
    const data = VOCAB.story1.words.find(w => w.word === word);
    if (!data) return;

    document.getElementById('tooltipWord').textContent = data.word;
    document.getElementById('tooltipPron').textContent = `${data.type}  ${data.pronunciation}`;
    document.getElementById('tooltipDef').textContent = data.definition;

    // Position near the element
    const rect = el.getBoundingClientRect();
    const tooltipEl = document.getElementById('vocabTooltip');
    tooltipEl.hidden = false;

    // Position below the word
    let top = rect.bottom + 12;
    let left = rect.left;

    // Keep on screen
    if (left + 320 > window.innerWidth) left = window.innerWidth - 340;
    if (left < 20) left = 20;
    if (top + 120 > window.innerHeight) top = rect.top - 120;

    tooltipEl.style.top = top + 'px';
    tooltipEl.style.left = left + 'px';

    // Animate in
    requestAnimationFrame(() => {
        tooltipEl.classList.add('visible');
    });
}

function hideTooltip() {
    const tooltipEl = document.getElementById('vocabTooltip');
    tooltipEl.classList.remove('visible');
    setTimeout(() => { tooltipEl.hidden = true; }, 250);
}

// ============ QUIZ ENGINE ============
const QUIZ_KEY = 'bf-quiz';
let quizIndex = 0;
let quizAnswers = [];
let quizActive = false;

function getQuizState() {
    try { return JSON.parse(localStorage.getItem(QUIZ_KEY)) || {}; } catch { return {}; }
}

function saveQuizState(score, answers) {
    const state = getQuizState();
    state.story1 = {
        bestScore: Math.max(score, (state.story1?.bestScore || 0)),
        lastScore: score,
        attempts: (state.story1?.attempts || 0) + 1,
        answers: answers,
        timestamp: Date.now()
    };
    localStorage.setItem(QUIZ_KEY, JSON.stringify(state));
}

function initQuiz() {
    const state = getQuizState();
    if (state.story1?.lastScore === 5) {
        // Already aced it — show results directly
        showQuizResults(5, state.story1.answers || [1,1,0,0,0]);
        return;
    }
    quizIndex = 0;
    quizAnswers = [];
    quizActive = true;
    document.getElementById('quizContainer').hidden = false;
    document.getElementById('quizResults').hidden = true;
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const quiz = VOCAB.story1.quiz;
    if (quizIndex >= quiz.length) {
        finishQuiz();
        return;
    }

    const q = quiz[quizIndex];
    const letters = ['A', 'B', 'C', 'D'];
    
    document.getElementById('quizCurrent').textContent = quizIndex + 1;
    document.getElementById('quizContext').innerHTML = q.context;
    document.getElementById('quizQuestion').textContent = q.question;

    const optionsEl = document.getElementById('quizOptions');
    optionsEl.innerHTML = q.options.map((opt, i) => `
        <button class="quiz-option" data-answer="${i}">
            <span class="quiz-option-letter">${letters[i]}</span>
            <span>${opt}</span>
        </button>
    `).join('');

    // Bind events directly (more reliable on iOS than inline onclick)
    optionsEl.querySelectorAll('.quiz-option').forEach(btn => {
        let handled = false;
        const doAnswer = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (handled) return;
            handled = true;
            answerQuiz(parseInt(btn.dataset.answer, 10));
        };
        btn.addEventListener('pointerup', doAnswer);
        btn.addEventListener('click', doAnswer);
    });

    // Fade in
    gsap.fromTo('#quizContainer', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
}

function answerQuiz(selected) {
    if (!quizActive) return;
    
    const q = VOCAB.story1.quiz[quizIndex];
    const isCorrect = selected === q.correct;
    quizAnswers.push(isCorrect);

    // Highlight correct/wrong
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === q.correct) opt.classList.add('correct');
        if (i === selected && !isCorrect) opt.classList.add('wrong');
    });

    // Advance after a brief pause
    setTimeout(() => {
        quizIndex++;
        if (quizIndex < VOCAB.story1.quiz.length) {
            gsap.to('#quizContainer', { opacity: 0, duration: 0.2, onComplete: renderQuizQuestion });
        } else {
            finishQuiz();
        }
    }, 1200);
}

function finishQuiz() {
    quizActive = false;
    const score = quizAnswers.filter(Boolean).length;
    saveQuizState(score, quizAnswers);
    showQuizResults(score, quizAnswers);
}

function showQuizResults(score, answers) {
    document.getElementById('quizContainer').hidden = true;
    const resultsEl = document.getElementById('quizResults');
    resultsEl.hidden = false;

    document.getElementById('quizScoreNum').textContent = score;

    const msgs = {
        5: "Perfect. Every word earned.",
        4: "Almost there. One to review.",
        3: "Solid effort. Keep going.",
        2: "Worth another try.",
        1: "The story will teach you. Read it again.",
        0: "Start with the vocabulary list."
    };
    document.getElementById('quizScoreMsg').textContent = msgs[score] || '';

    const words = VOCAB.story1.words;
    const wordResultsEl = document.getElementById('quizWordResults');
    wordResultsEl.innerHTML = words.map((w, i) => {
        const correct = answers[i];
        return `<div class="quiz-word-result">
            <span class="mark ${correct ? 'correct' : 'wrong'}">${correct ? '✓' : '✗'}</span>
            <span class="word-name">${w.word}</span>
            ${!correct ? '<span class="review-hint">review</span>' : ''}
        </div>`;
    }).join('');

    gsap.fromTo(resultsEl, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 });
}

function retakeQuiz() {
    quizIndex = 0;
    quizAnswers = [];
    quizActive = true;
    document.getElementById('quizResults').hidden = true;
    document.getElementById('quizContainer').hidden = false;
    renderQuizQuestion();
}

// ============ INIT ============
window.addEventListener('load', () => {
    const bgContainer = document.querySelector('.floor-gradient');
    const c = floorColors[0];
    grainient = initGrainient(bgContainer, c);

    storyLines.forEach(line => gsap.set(line, { opacity: 0 }));

    currentIndex = 0;
    gsap.set(storyLines[0], { opacity: 1 });
    floorNumber.textContent = '0';
    isAnimating = false;

    incrementVisits();
    applyReturningReader();
});
