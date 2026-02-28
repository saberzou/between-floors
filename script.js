gsap.registerPlugin(ScrollTrigger);

const floorTrack = document.querySelector('.floor-numbers-track');
const floorContainer = document.querySelector('.floor-numbers');
const scrollHint = document.querySelector('.scroll-hint');

// ============ STORY SYSTEM ============
const STORIES = {
    story1: {
        title: "Welcome Home",
        floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        scrollHint: "\u2191 Scroll up to ascend"
    },
    story2: {
        title: "The 6 AM Shift",
        floors: [18, 16, 14, 12, 10, 8, 6, 4, 2, 0],
        scrollHint: "\u2191 Scroll up to descend"
    }
};

let activeStory = 'story1';

function getStoryLines() {
    if (activeStory === 'story1') {
        return Array.from(document.querySelectorAll('.story-line:not(.story2-content)'));
    }
    return Array.from(document.querySelectorAll('.story-line.story2-content'));
}

function getFloorDots() {
    return Array.from(document.querySelectorAll('.floor-dot'));
}

function centerFloorDot(index) {
    const dots = getFloorDots();
    const dot = dots[index];
    if (!dot || !floorTrack || !floorContainer) return;
    const containerWidth = floorContainer.offsetWidth;
    const dotOffset = dot.offsetLeft + dot.offsetWidth / 2;
    const center = containerWidth / 2;
    floorTrack.style.transform = `translateX(${center - dotOffset}px)`;
}

// ============ STATE ============
let currentIndex = 0;
let isAnimating = false;

// ============ SHOW LINE ============
function showLine(index, goingUp) {
    const lines = getStoryLines();
    const dots = getFloorDots();
    const total = lines.length;

    if (index < 0 || index >= total) return;

    isAnimating = true;
    currentIndex = index;

    lines.forEach(line => gsap.killTweensOf(line));
    lines.forEach((line, i) => {
        if (i !== index) gsap.set(line, { opacity: 0 });
    });

    gsap.fromTo(lines[index],
        { opacity: 0, y: goingUp ? 25 : -25 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
          onComplete() { isAnimating = false; } }
    );

    // Update floor dots
    const storyFloors = STORIES[activeStory].floors;
    const currentFloorNum = storyFloors[index];
    dots.forEach(dot => {
        dot.classList.toggle('active', parseInt(dot.dataset.floor) === currentFloorNum);
    });
    centerFloorDot(index);

    // Show scroll hint only on first floor
    if (index === 0) {
        scrollHint.style.animation = 'pulse 3s ease-in-out infinite';
        gsap.to(scrollHint, { opacity: 0.3, y: 0, duration: 0.5 });
    } else {
        scrollHint.style.animation = 'none';
        gsap.to(scrollHint, { opacity: 0, y: 10, duration: 0.3 });
    }

    // Show quiz CTA on last floor
    var quizCta = document.getElementById('quizCta');
    if (quizCta) {
        if (index === total - 1) {
            gsap.to(quizCta, { opacity: 1, y: 0, duration: 0.5, delay: 0.3 });
            quizCta.style.pointerEvents = 'auto';
        } else {
            gsap.to(quizCta, { opacity: 0, y: 10, duration: 0.3 });
            quizCta.style.pointerEvents = 'none';
        }
    }
}

// ============ NAVIGATION ============
function goUp() {
    if (isAnimating) return;
    var total = getStoryLines().length;
    var next = currentIndex + 1;
    if (next < total) showLine(next, true);
}

function goDown() {
    if (isAnimating) return;
    if (currentIndex === 0) return;
    showLine(currentIndex - 1, false);
}

// ============ TOUCH ============
var touchStartY = 0;
var SWIPE_THRESHOLD = 30;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    if (e.target.closest('.quiz-overlay-scroll, .info-scroll, .story-menu')) return;
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', function(e) {
    if (isOverlayOpen()) return;
    if (e.target.closest('.quiz-option, .quiz-btn, .vocab-word, .vocab-pill, .info-pill, .info-close, .story-menu-btn, .story-menu')) return;
    var deltaY = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
    if (deltaY > 0) goUp(); else goDown();
});

// ============ WHEEL / TRACKPAD ============
var wheelAccum = 0;
var wheelTimer = null;
var WHEEL_THRESHOLD = 50;

document.addEventListener('wheel', function(e) {
    e.preventDefault();
    if (isAnimating) return;
    if (isOverlayOpen()) return;

    wheelAccum += e.deltaY;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function() { wheelAccum = 0; }, 200);

    if (Math.abs(wheelAccum) >= WHEEL_THRESHOLD) {
        if (wheelAccum > 0) goUp(); else goDown();
        wheelAccum = 0;
    }
}, { passive: false });

// ============ KEYBOARD ============
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') { e.preventDefault(); goUp(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); goDown(); }
    if (e.key === 'Escape') {
        closeInfoOverlay();
        closeVocabOverlay();
        closeQuizOverlay();
        hideTooltip();
        var menu = document.getElementById('storyMenu');
        if (menu) menu.hidden = true;
    }
});

// ============ RETURNING READER ============
var VISIT_KEY = 'bf-visits';

function getVisitCount() {
    return parseInt(localStorage.getItem(VISIT_KEY) || '0', 10);
}
function incrementVisits() {
    var n = getVisitCount() + 1;
    localStorage.setItem(VISIT_KEY, String(n));
    return n;
}

function applyReturningReader() {
    if (getVisitCount() > 1) {
        var returnMsg = document.querySelector('.returning-reader-msg');
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
    var overlay = document.getElementById('vocabOverlay');
    var content = document.getElementById('vocabContent');

    var data = VOCAB[activeStory];
    var storyNum = activeStory === 'story1' ? '1' : '2';
    content.innerHTML =
        '<h1>Vocabulary</h1>' +
        '<p class="info-tagline">Story ' + storyNum + ': ' + data.title + ' \u2014 ' + data.words.length + ' words</p>' +
        '<div class="info-divider"></div>' +
        data.words.map(function(w) {
            return '<div class="vocab-entry">' +
                '<div class="vocab-entry-word">' + w.word + '</div>' +
                '<div class="vocab-entry-meta">' + w.type + ' &nbsp; ' + w.pronunciation + ' &nbsp; ' + w.level + '</div>' +
                '<div class="vocab-entry-def">' + w.definition + '</div>' +
                '<div class="vocab-entry-context">"' + w.inStory + '"</div>' +
                '<ul class="vocab-entry-examples">' +
                    w.examples.map(function(ex) { return '<li>' + ex + '</li>'; }).join('') +
                '</ul>' +
                '<div class="vocab-entry-synonyms">Synonyms: <span>' + w.synonyms.join(', ') + '</span></div>' +
            '</div>';
        }).join('');

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
    isAnimating = false;
}

// ============ VOCAB TOOLTIPS ============
document.addEventListener('click', function(e) {
    var vocabEl = e.target.closest('.vocab-word');
    if (vocabEl) {
        e.stopPropagation();
        showTooltip(vocabEl);
        return;
    }
    if (!e.target.closest('.vocab-tooltip')) {
        hideTooltip();
    }
});

function showTooltip(el) {
    var word = el.dataset.word;
    var data = null;
    // Search active story first, then all
    if (VOCAB[activeStory]) {
        data = VOCAB[activeStory].words.find(function(w) { return w.word === word; });
    }
    if (!data) {
        var keys = Object.keys(VOCAB);
        for (var k = 0; k < keys.length; k++) {
            data = VOCAB[keys[k]].words.find(function(w) { return w.word === word; });
            if (data) break;
        }
    }
    if (!data) return;

    document.getElementById('tooltipWord').textContent = data.word;
    document.getElementById('tooltipPron').textContent = data.type + '  ' + data.pronunciation;
    document.getElementById('tooltipDef').textContent = data.definition;

    var rect = el.getBoundingClientRect();
    var tooltipEl = document.getElementById('vocabTooltip');
    tooltipEl.hidden = false;

    var top = rect.bottom + 12;
    var left = rect.left;

    if (left + 320 > window.innerWidth) left = window.innerWidth - 340;
    if (left < 20) left = 20;
    if (top + 120 > window.innerHeight) top = rect.top - 120;

    tooltipEl.style.top = top + 'px';
    tooltipEl.style.left = left + 'px';

    requestAnimationFrame(function() {
        tooltipEl.classList.add('visible');
    });
}

function hideTooltip() {
    var tooltipEl = document.getElementById('vocabTooltip');
    tooltipEl.classList.remove('visible');
    setTimeout(function() { tooltipEl.hidden = true; }, 250);
}

// ============ QUIZ ENGINE ============
var QUIZ_KEY = 'bf-quiz';
var quizIndex = 0;
var quizAnswers = [];
var quizActive = false;

function getQuizState() {
    try { return JSON.parse(localStorage.getItem(QUIZ_KEY)) || {}; } catch(e) { return {}; }
}

function saveQuizState(score, answers) {
    var state = getQuizState();
    var prev = state[activeStory] || {};
    state[activeStory] = {
        bestScore: Math.max(score, prev.bestScore || 0),
        lastScore: score,
        attempts: (prev.attempts || 0) + 1,
        answers: answers,
        timestamp: Date.now()
    };
    localStorage.setItem(QUIZ_KEY, JSON.stringify(state));
}

function initQuiz() {
    var state = getQuizState();
    var storyState = state[activeStory];
    if (storyState && storyState.lastScore === 5) {
        showQuizResults(5, storyState.answers || [1,1,0,0,0]);
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
    var quiz = VOCAB[activeStory].quiz;
    if (quizIndex >= quiz.length) {
        finishQuiz();
        return;
    }

    var q = quiz[quizIndex];
    var letters = ['A', 'B', 'C', 'D'];

    document.getElementById('quizCurrent').textContent = quizIndex + 1;
    document.getElementById('quizContext').innerHTML = q.context;
    document.getElementById('quizQuestion').textContent = q.question;

    var optionsEl = document.getElementById('quizOptions');
    optionsEl.innerHTML = q.options.map(function(opt, i) {
        return '<button class="quiz-option" data-answer="' + i + '">' +
            '<span class="quiz-option-letter">' + letters[i] + '</span>' +
            '<span>' + opt + '</span>' +
        '</button>';
    }).join('');

    optionsEl.querySelectorAll('.quiz-option').forEach(function(btn) {
        var handled = false;
        var doAnswer = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (handled) return;
            handled = true;
            answerQuiz(parseInt(btn.dataset.answer, 10));
        };
        btn.addEventListener('pointerup', doAnswer);
        btn.addEventListener('click', doAnswer);
    });

    gsap.fromTo('#quizContainer', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
}

function answerQuiz(selected) {
    if (!quizActive) return;

    var q = VOCAB[activeStory].quiz[quizIndex];
    var isCorrect = selected === q.correct;
    quizAnswers.push(isCorrect);

    var options = document.querySelectorAll('.quiz-option');
    options.forEach(function(opt, i) {
        opt.classList.add('disabled');
        if (i === q.correct) opt.classList.add('correct');
        if (i === selected && !isCorrect) opt.classList.add('wrong');
    });

    setTimeout(function() {
        quizIndex++;
        if (quizIndex < VOCAB[activeStory].quiz.length) {
            gsap.to('#quizContainer', { opacity: 0, duration: 0.2, onComplete: renderQuizQuestion });
        } else {
            finishQuiz();
        }
    }, 1200);
}

function finishQuiz() {
    quizActive = false;
    var score = quizAnswers.filter(Boolean).length;
    saveQuizState(score, quizAnswers);
    showQuizResults(score, quizAnswers);
}

function showQuizResults(score, answers) {
    document.getElementById('quizContainer').hidden = true;
    var resultsEl = document.getElementById('quizResults');
    resultsEl.hidden = false;

    document.getElementById('quizScoreNum').textContent = score;

    var msgs = {
        5: "Perfect. Every word earned.",
        4: "Almost there. One to review.",
        3: "Solid effort. Keep going.",
        2: "Worth another try.",
        1: "The story will teach you. Read it again.",
        0: "Start with the vocabulary list."
    };
    document.getElementById('quizScoreMsg').textContent = msgs[score] || '';

    var words = VOCAB[activeStory].words;
    var wordResultsEl = document.getElementById('quizWordResults');
    wordResultsEl.innerHTML = words.map(function(w, i) {
        var correct = answers[i];
        return '<div class="quiz-word-result">' +
            '<span class="mark ' + (correct ? 'correct' : 'wrong') + '">' + (correct ? '\u2713' : '\u2717') + '</span>' +
            '<span class="word-name">' + w.word + '</span>' +
            (!correct ? '<span class="review-hint">review</span>' : '') +
        '</div>';
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

// ============ STORY SELECTOR ============
function switchStory(storyId) {
    if (storyId === activeStory) {
        toggleStoryMenu();
        return;
    }
    activeStory = storyId;

    // Hide all story lines
    document.querySelectorAll('.story-line').forEach(function(el) {
        gsap.set(el, { opacity: 0 });
    });

    // Show/hide correct content
    document.querySelectorAll('.story-line:not(.story2-content)').forEach(function(el) {
        el.hidden = (storyId !== 'story1');
    });
    document.querySelectorAll('.story-line.story2-content').forEach(function(el) {
        el.hidden = (storyId !== 'story2');
    });

    // Rebuild floor dots
    var story = STORIES[storyId];
    floorTrack.innerHTML = story.floors.map(function(f, i) {
        return '<span class="floor-dot' + (i === 0 ? ' active' : '') + '" data-floor="' + f + '">' + f + '</span>';
    }).join('');

    // Update scroll hint
    var hint = document.querySelector('.scroll-hint p');
    if (hint) hint.textContent = story.scrollHint;

    // Update menu active state
    document.querySelectorAll('.story-menu-item').forEach(function(el) {
        el.classList.toggle('active', el.dataset.story === storyId);
    });

    // Reset state
    currentIndex = 0;
    isAnimating = false;

    // Show first line
    var lines = getStoryLines();
    gsap.set(lines[0], { opacity: 1 });
    centerFloorDot(0);

    // Reset quiz CTA
    var quizCta = document.getElementById('quizCta');
    if (quizCta) { gsap.set(quizCta, { opacity: 0 }); quizCta.style.pointerEvents = 'none'; }

    toggleStoryMenu();
}

function toggleStoryMenu() {
    var menu = document.getElementById('storyMenu');
    menu.hidden = !menu.hidden;
}

// Close menu on outside click
document.addEventListener('click', function(e) {
    if (!e.target.closest('.story-menu-btn') && !e.target.closest('.story-menu')) {
        var menu = document.getElementById('storyMenu');
        if (menu && !menu.hidden) menu.hidden = true;
    }
});

// ============ INIT ============
window.addEventListener('load', function() {
    // Hide story 2 content initially
    document.querySelectorAll('.story2-content').forEach(function(el) { el.hidden = true; });

    var lines = getStoryLines();
    lines.forEach(function(line) { gsap.set(line, { opacity: 0 }); });

    currentIndex = 0;
    gsap.set(lines[0], { opacity: 1 });

    var dots = getFloorDots();
    if (dots[0]) dots[0].classList.add('active');
    centerFloorDot(0);
    isAnimating = false;

    incrementVisits();
    applyReturningReader();
});
