gsap.registerPlugin(ScrollTrigger);

const floorNumber = document.querySelector('.floor-number');
const scrollHint = document.querySelector('.scroll-hint');
const storyLines = document.querySelectorAll('.story-line');
const totalFloors = storyLines.length;

// ============ DISCOVERY SYSTEM ============
const DISCOVERY_KEY = 'bf-discovered';
const VISIT_KEY = 'bf-visits';

function getDiscoveries() {
    try { return JSON.parse(localStorage.getItem(DISCOVERY_KEY)) || []; } catch { return []; }
}
function saveDiscovery(id) {
    const d = getDiscoveries();
    if (!d.includes(id)) {
        d.push(id);
        localStorage.setItem(DISCOVERY_KEY, JSON.stringify(d));
        showDiscoveryFlash();
    }
}

function getVisitCount() {
    return parseInt(localStorage.getItem(VISIT_KEY) || '0', 10);
}
function incrementVisits() {
    const n = getVisitCount() + 1;
    localStorage.setItem(VISIT_KEY, String(n));
    return n;
}

function showDiscoveryFlash() {
    floorNumber.classList.add('discovered-flash');
    setTimeout(() => floorNumber.classList.remove('discovered-flash'), 1500);
    updateDiscoveryCounter();
}

function updateDiscoveryCounter() {
    const counter = document.querySelector('.discovery-counter');
    if (!counter) return;
    const total = 3;
    const found = getDiscoveries().length;
    counter.textContent = `${found}/${total}`;
    counter.style.opacity = found > 0 ? '0.5' : '0';
}

// ============ GRAINIENT COLORS ============
const floorColors = [
    ['#152535', '#1a3548', '#0c1820'],
    ['#183040', '#1e3e55', '#101e2c'],
    ['#1a3245', '#224060', '#122430'],
    ['#1c3548', '#254868', '#142838'],
    ['#302818', '#3e3420', '#1a1808'],
    ['#2a1848', '#3c2268', '#180e2c'],
    ['#142e20', '#1c4030', '#0c1c14'],
    ['#283038', '#363e4a', '#1c2028'],
    ['#302818', '#3e3420', '#1e1a0c'],
    ['#221440', '#301c58', '#140c24'],
    ['#0c1018', '#141c28', '#080c12'],
];

const hiddenFloorColors = {
    'B':   ['#0c0808', '#1a1010', '#060404'],
    '3.5': ['#182028', '#203040', '#101820'],
    '5L':  ['#1a1030', '#281848', '#100820'],
};

let grainient = null;

// ============ STATE ============
let currentIndex = 0;
let isAnimating = false;
let onHiddenFloor = null;
let scrollHintHidden = false;

// ============ HIDDEN FLOOR DISPLAY ============
function showHiddenFloor(id) {
    if (isAnimating) return;
    isAnimating = true;
    onHiddenFloor = id;
    saveDiscovery(id);

    storyLines.forEach(line => gsap.to(line, { opacity: 0, duration: 0.3 }));

    const hiddenEl = document.querySelector(`.hidden-floor[data-hidden="${id}"]`);
    if (!hiddenEl) { isAnimating = false; return; }

    gsap.fromTo(hiddenEl,
        { opacity: 0, y: 0, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out',
          onComplete() { isAnimating = false; } }
    );

    const labels = { 'B': 'B', '3.5': '3½', '5L': '5' };
    floorNumber.textContent = labels[id] || id;
    floorNumber.style.color = '#ff3333';

    if (grainient && hiddenFloorColors[id]) {
        const c = hiddenFloorColors[id];
        grainient.setColors(c[0], c[1], c[2]);
    }

    floorNumber.classList.add('glitch');
    setTimeout(() => floorNumber.classList.remove('glitch'), 800);
}

function hideHiddenFloor() {
    if (!onHiddenFloor) return;
    const hiddenEl = document.querySelector(`.hidden-floor[data-hidden="${onHiddenFloor}"]`);
    if (hiddenEl) gsap.to(hiddenEl, { opacity: 0, duration: 0.3 });
    onHiddenFloor = null;
    showLine(currentIndex, true);
}

// ============ SHOW LINE ============
function showLine(index, goingUp) {
    if (index < 0 || index >= totalFloors) return;

    isAnimating = true;
    onHiddenFloor = null;
    currentIndex = index;
    const floor = index;

    document.querySelectorAll('.hidden-floor').forEach(el => gsap.set(el, { opacity: 0 }));
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
        // Quiz screen — hide floor number and building name
        gsap.to(floorNumber, { opacity: 0, duration: 0.3 });
        gsap.to(document.querySelector('.building-name'), { opacity: 0, duration: 0.3 });
        initQuiz();
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
    if (onHiddenFloor) { hideHiddenFloor(); return; }
    const next = currentIndex + 1;
    if (next < totalFloors) showLine(next, true);
}

function goDown() {
    if (isAnimating) return;
    if (onHiddenFloor) { hideHiddenFloor(); return; }
    if (currentIndex === 0) { showHiddenFloor('B'); return; }
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
    if (isOverlayOpen()) return;
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', (e) => {
    if (isOverlayOpen()) return;
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
        hideTooltip();
    }
});

// ============ TAP ON FLOOR NUMBER → FLOOR 3.5 ============
floorNumber.style.cursor = 'pointer';
floorNumber.addEventListener('click', () => {
    if (isAnimating || onHiddenFloor) return;
    if (currentIndex === 3) showHiddenFloor('3.5');
});

// ============ LONG PRESS → ARIA LOGS (FLOOR 5) ============
let longPressTimer = null;
document.addEventListener('pointerdown', (e) => {
    if (isAnimating || onHiddenFloor) return;
    if (currentIndex !== 5) return;
    const dialogue = e.target.closest('.dialogue');
    if (!dialogue) return;
    longPressTimer = setTimeout(() => {
        showHiddenFloor('5L');
        if (navigator.vibrate) navigator.vibrate(50);
    }, 600);
});
document.addEventListener('pointerup', () => clearTimeout(longPressTimer));
document.addEventListener('pointermove', () => clearTimeout(longPressTimer));

// ============ RETURNING READER ============
function applyReturningReader() {
    if (getVisitCount() > 1) {
        const returnMsg = document.querySelector('.returning-reader-msg');
        if (returnMsg) returnMsg.hidden = false;
    }
}

// ============ OVERLAYS ============
function isOverlayOpen() {
    return document.getElementById('infoOverlay').classList.contains('open') ||
           document.getElementById('vocabOverlay').classList.contains('open');
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
        <button class="quiz-option" onclick="answerQuiz(${i})">
            <span class="quiz-option-letter">${letters[i]}</span>
            <span>${opt}</span>
        </button>
    `).join('');

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
    document.querySelectorAll('.hidden-floor').forEach(el => gsap.set(el, { opacity: 0 }));

    currentIndex = 0;
    gsap.set(storyLines[0], { opacity: 1 });
    floorNumber.textContent = '0';
    isAnimating = false;

    incrementVisits();
    applyReturningReader();
    updateDiscoveryCounter();
});
