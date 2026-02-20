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
    ['#0a1520', '#0d1f30', '#060a10'],
    // floor 1 — Aria speaks, faint warmth
    ['#0c1825', '#122a3d', '#080e18'],
    // floor 2 — relief, exhale
    ['#0e1a28', '#15304a', '#0a1018'],
    // floor 3 — conversation, subtle connection
    ['#101c2a', '#183552', '#0c1420'],
    // floor 4 — Jason calls, tension creeps (muted gold/amber)
    ['#1a1508', '#2e2210', '#0c0a04'],
    // floor 5 — restraining order, deep purple authority
    ['#1a0830', '#2e1050', '#0c0418'],
    // floor 6 — confrontation, dark green unease
    ['#081a10', '#0e2e1a', '#040c08'],
    // floor 7 — "your safety", cold silver
    ['#181c20', '#2a3038', '#0c0e12'],
    // floor 8 — doors open, warm gold threshold
    ['#1c1608', '#302510', '#0e0c04'],
    // floor 9 — "welcome home", deep purple fading to dark
    ['#140828', '#220e40', '#080414'],
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
