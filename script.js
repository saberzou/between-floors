gsap.registerPlugin(ScrollTrigger);

const floorNumber = document.querySelector('.floor-number');
const scrollHint = document.querySelector('.scroll-hint');
const storyLines = document.querySelectorAll('.story-line');
const totalFloors = storyLines.length;

// ============ LANGUAGE ============
let currentLang = localStorage.getItem('bf-lang') || 'en';

function applyLang() {
    const label = document.querySelector('.lang-label');
    label.textContent = currentLang === 'en' ? 'CN' : 'EN';

    document.querySelectorAll('.story-line, .hidden-floor, .choice-prompt, .choice-result').forEach(line => {
        line.querySelectorAll('p:not(.cn), .log-line:not(.cn)').forEach(el => el.hidden = currentLang === 'cn');
        line.querySelectorAll('p.cn, .log-line.cn').forEach(el => el.hidden = currentLang === 'en');
    });

    // Choice cards — use span elements
    document.querySelectorAll('.choice-card').forEach(card => {
        card.querySelectorAll('span:not(.cn)').forEach(el => {
            if (el.classList.contains('choice-label')) return; // always show A/B
            el.hidden = currentLang === 'cn';
        });
        card.querySelectorAll('span.cn').forEach(el => el.hidden = currentLang === 'en');
    });

    scrollHint.querySelector('p').textContent = currentLang === 'en'
        ? '↑ Scroll up to ascend'
        : '↑ 向上滑动，电梯上升';
}

function toggleLang() {
    currentLang = currentLang === 'en' ? 'cn' : 'en';
    localStorage.setItem('bf-lang', currentLang);
    applyLang();
}

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
function hasDiscovered(id) { return getDiscoveries().includes(id); }

function getVisitCount() {
    return parseInt(localStorage.getItem(VISIT_KEY) || '0', 10);
}
function incrementVisits() {
    const n = getVisitCount() + 1;
    localStorage.setItem(VISIT_KEY, String(n));
    return n;
}

// Discovery flash — brief glow on floor number
function showDiscoveryFlash() {
    floorNumber.classList.add('discovered-flash');
    setTimeout(() => floorNumber.classList.remove('discovered-flash'), 1500);
    // Update counter
    updateDiscoveryCounter();
}

function updateDiscoveryCounter() {
    const counter = document.querySelector('.discovery-counter');
    if (!counter) return;
    const total = 3; // basement, floor 3.5, aria logs
    const found = getDiscoveries().length;
    counter.textContent = `${found}/${total}`;
    counter.style.opacity = found > 0 ? '0.5' : '0';
}

// ============ GRAINIENT COLORS ============
const floorColors = [
    ['#152535', '#1a3548', '#0c1820'],  // 0
    ['#183040', '#1e3e55', '#101e2c'],  // 1
    ['#1a3245', '#224060', '#122430'],  // 2
    ['#1c3548', '#254868', '#142838'],  // 3
    ['#302818', '#3e3420', '#1a1808'],  // 4
    ['#2a1848', '#3c2268', '#180e2c'],  // 5
    ['#142e20', '#1c4030', '#0c1c14'],  // 6
    ['#283038', '#363e4a', '#1c2028'],  // 7
    ['#302818', '#3e3420', '#1e1a0c'],  // 8
    ['#221440', '#301c58', '#140c24'],  // 9
    ['#0c1018', '#141c28', '#080c12'],  // 10 — choice screen, near-black
];

// Hidden floor colors
const hiddenFloorColors = {
    'B':   ['#0c0808', '#1a1010', '#060404'],  // basement — near black, red tint
    '3.5': ['#182028', '#203040', '#101820'],  // between floors — cold blue-grey
    '5L':  ['#1a1030', '#281848', '#100820'],  // aria logs — deep system purple
};

let grainient = null;

// ============ STATE ============
let currentIndex = 0;
let isAnimating = false;
let onHiddenFloor = null; // null or 'B', '3.5', '5L'

// ============ HIDDEN FLOOR DISPLAY ============
function showHiddenFloor(id) {
    if (isAnimating) return;
    isAnimating = true;
    onHiddenFloor = id;

    // Save discovery
    saveDiscovery(id);

    // Hide current story line
    storyLines.forEach(line => gsap.to(line, { opacity: 0, duration: 0.3 }));

    // Show hidden floor
    const hiddenEl = document.querySelector(`.hidden-floor[data-hidden="${id}"]`);
    if (!hiddenEl) { isAnimating = false; return; }

    // Apply language
    hiddenEl.querySelectorAll('p:not(.cn), .log-line:not(.cn)').forEach(el => el.hidden = currentLang === 'cn');
    hiddenEl.querySelectorAll('p.cn, .log-line.cn').forEach(el => el.hidden = currentLang === 'en');

    gsap.fromTo(hiddenEl,
        { opacity: 0, y: 0, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out',
          onComplete() { isAnimating = false; } }
    );

    // Floor number display
    const labels = { 'B': 'B', '3.5': '3½', '5L': '5' };
    floorNumber.textContent = labels[id] || id;
    floorNumber.style.color = '#ff3333';

    // Grainient color
    if (grainient && hiddenFloorColors[id]) {
        const c = hiddenFloorColors[id];
        grainient.setColors(c[0], c[1], c[2]);
    }

    // Glitch effect on floor number
    floorNumber.classList.add('glitch');
    setTimeout(() => floorNumber.classList.remove('glitch'), 800);
}

function hideHiddenFloor() {
    if (!onHiddenFloor) return;
    const hiddenEl = document.querySelector(`.hidden-floor[data-hidden="${onHiddenFloor}"]`);
    if (hiddenEl) gsap.to(hiddenEl, { opacity: 0, duration: 0.3 });
    onHiddenFloor = null;

    // Restore current floor
    showLine(currentIndex, true);
}

// ============ SHOW LINE ============
function showLine(index, goingUp) {
    if (index < 0 || index >= totalFloors) return;

    isAnimating = true;
    onHiddenFloor = null;
    currentIndex = index;
    const floor = index;

    // Hide hidden floors
    document.querySelectorAll('.hidden-floor').forEach(el => gsap.set(el, { opacity: 0 }));

    // Kill all tweens
    storyLines.forEach(line => gsap.killTweensOf(line));

    // Hide all except current
    storyLines.forEach((line, i) => {
        if (i !== index) gsap.set(line, { opacity: 0 });
    });

    // Animate in
    gsap.fromTo(storyLines[index],
        { opacity: 0, y: goingUp ? 25 : -25 },
        {
            opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
            onComplete() { isAnimating = false; }
        }
    );

    // Update grainient colors
    if (grainient) {
        const c = floorColors[floor] || floorColors[0];
        grainient.setColors(c[0], c[1], c[2]);
    }

    // Update floor number
    floorNumber.classList.remove('glitch');
    gsap.killTweensOf(floorNumber);

    if (floor === 10) {
        // Choice screen — hide floor number
        gsap.to(floorNumber, { opacity: 0, duration: 0.3 });
        // Restore vote if already cast
        const existingVote = getVote();
        if (existingVote) {
            setTimeout(() => applyVoteUI(existingVote), 400);
        }
    } else {
        gsap.to(floorNumber, { opacity: 1, duration: 0.3 });
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

    // Floor indicator color
    const p = floor / (totalFloors - 1);
    const r = Math.round(100 * p);
    const g2 = Math.round(217 - 17 * p);
    floorNumber.style.color = `rgb(${r}, ${g2}, 255)`;

    // Hide scroll hint after first move
    if (floor > 0) {
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

    // Secret: swipe down at floor 0 → basement
    if (currentIndex === 0) {
        showHiddenFloor('B');
        return;
    }

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
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', (e) => {
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
});

// ============ TAP ON FLOOR NUMBER → FLOOR 3.5 ============
floorNumber.style.cursor = 'pointer';
floorNumber.addEventListener('click', () => {
    if (isAnimating) return;
    if (onHiddenFloor) return;
    if (currentIndex === 3) {
        showHiddenFloor('3.5');
    }
});

// ============ LONG PRESS ON ARIA DIALOGUE → ARIA LOGS (FLOOR 5) ============
let longPressTimer = null;
document.addEventListener('pointerdown', (e) => {
    if (isAnimating || onHiddenFloor) return;
    if (currentIndex !== 5) return;

    const dialogue = e.target.closest('.dialogue');
    if (!dialogue) return;

    longPressTimer = setTimeout(() => {
        showHiddenFloor('5L');
        // Haptic feedback if available
        if (navigator.vibrate) navigator.vibrate(50);
    }, 600);
});
document.addEventListener('pointerup', () => clearTimeout(longPressTimer));
document.addEventListener('pointermove', () => clearTimeout(longPressTimer));

// ============ RETURNING READER ============
function applyReturningReader() {
    const visits = getVisitCount();
    const floor0 = storyLines[0];
    if (!floor0) return;

    if (visits > 1) {
        // Modify floor 0 text for returning readers
        const returnMsg = document.querySelector('.returning-reader-msg');
        if (returnMsg) returnMsg.hidden = false;
    }
}

// ============ INFO OVERLAY ============
function openInfoOverlay() {
    const overlay = document.getElementById('infoOverlay');
    // Apply current language
    overlay.querySelectorAll('[class~="cn"]').forEach(el => el.hidden = currentLang === 'en');
    // Hide EN elements when CN is active — target elements that have a .cn sibling
    overlay.querySelectorAll('h1:not(.cn), .info-tagline:not(.cn), .info-label:not(.cn), .info-section > p:not(.cn), .info-specs:not(.cn), .info-story-list:not(.cn), .info-quote:not(.cn), .info-credits:not(.cn)').forEach(el => {
        el.hidden = currentLang === 'cn';
    });
    overlay.classList.add('open');
}

function closeInfoOverlay() {
    document.getElementById('infoOverlay').classList.remove('open');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeInfoOverlay();
});

// ============ VOTING ============
const VOTE_KEY = 'bf-vote';

function getVote() {
    return localStorage.getItem(VOTE_KEY);
}

function castVote(choice) {
    if (getVote()) return; // already voted
    localStorage.setItem(VOTE_KEY, choice);
    applyVoteUI(choice);
}

function applyVoteUI(choice) {
    const cards = document.querySelectorAll('.choice-card');
    cards.forEach(card => {
        if (card.dataset.choice === choice) {
            card.classList.add('selected');
        } else {
            card.classList.add('not-selected');
        }
    });
    const result = document.querySelector('.choice-result');
    if (result) {
        result.hidden = false;
        // Apply language
        result.querySelectorAll('p:not(.cn)').forEach(el => el.hidden = currentLang === 'cn');
        result.querySelectorAll('p.cn').forEach(el => el.hidden = currentLang === 'en');
        gsap.fromTo(result, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3 });
    }
}

// ============ INIT ============
window.addEventListener('load', () => {
    const bgContainer = document.querySelector('.floor-gradient');
    const c = floorColors[0];
    grainient = initGrainient(bgContainer, c);

    // Hide all
    storyLines.forEach(line => gsap.set(line, { opacity: 0 }));
    document.querySelectorAll('.hidden-floor').forEach(el => gsap.set(el, { opacity: 0 }));

    currentIndex = 0;
    gsap.set(storyLines[0], { opacity: 1 });
    floorNumber.textContent = '0';
    isAnimating = false;

    incrementVisits();
    applyReturningReader();
    applyLang();
    updateDiscoveryCounter();
});
