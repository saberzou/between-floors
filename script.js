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

    storyLines.forEach(line => {
        line.querySelectorAll('p:not(.cn)').forEach(el => el.hidden = currentLang === 'cn');
        line.querySelectorAll('p.cn').forEach(el => el.hidden = currentLang === 'en');
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

// ============ GRAINIENT COLORS PER FLOOR ============
// Each floor: [color1, color2, color3] — dark, moody palettes
const floorColors = [
    // floor 0 — lobby, cold concrete
    ['#152535', '#1a3548', '#0c1820'],
    // floor 1 — Aria speaks, faint warmth
    ['#183040', '#1e3e55', '#101e2c'],
    // floor 2 — relief, exhale
    ['#1a3245', '#224060', '#122430'],
    // floor 3 — conversation, subtle connection
    ['#1c3548', '#254868', '#142838'],
    // floor 4 — Jason calls, tension creeps (muted gold/amber)
    ['#302818', '#3e3420', '#1a1808'],
    // floor 5 — restraining order, deep purple authority
    ['#2a1848', '#3c2268', '#180e2c'],
    // floor 6 — confrontation, dark green unease
    ['#142e20', '#1c4030', '#0c1c14'],
    // floor 7 — "your safety", cold silver
    ['#283038', '#363e4a', '#1c2028'],
    // floor 8 — doors open, warm gold threshold
    ['#302818', '#3e3420', '#1e1a0c'],
    // floor 9 — "welcome home", deep purple fading to dark
    ['#221440', '#301c58', '#140c24'],
];

let grainient = null;

// ============ STATE ============
let currentIndex = 0;
let isAnimating = false;

// ============ SHOW LINE ============
function showLine(index, goingUp) {
    if (index < 0 || index >= totalFloors) return;
    if (index === currentIndex && document.querySelector('.story-line[style*="opacity: 1"],.story-line[style*="opacity:1"]')) return;

    isAnimating = true;
    currentIndex = index;
    const floor = index;

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
    gsap.killTweensOf(floorNumber);
    gsap.to(floorNumber, {
        textContent: floor,
        duration: 0.3,
        ease: 'power2.inOut',
        snap: { textContent: 1 },
        onUpdate() {
            floorNumber.textContent = Math.round(parseFloat(floorNumber.textContent));
        }
    });

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
    const next = currentIndex + 1;
    if (next < totalFloors) showLine(next, true);
}

function goDown() {
    if (isAnimating) return;
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
    applyLang();
});
