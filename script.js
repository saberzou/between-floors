gsap.registerPlugin(ScrollTrigger);

const floorNumber = document.querySelector('.floor-number');
const scrollHint = document.querySelector('.scroll-hint');
const storyLines = document.querySelectorAll('.story-line');

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

// ============ GRADIENT ============
const gradFrom = document.querySelector('.floor-gradient-from');
const gradTo = document.querySelector('.floor-gradient-to');
const totalFloors = storyLines.length; // 10 (index 0–9, floor 0–9)

const floorGradients = [
    { c1: '#0a0e14', c2: '#1a2332', angle: 160 },  // floor 0
    { c1: '#0c1220', c2: '#162a3a', angle: 150 },
    { c1: '#0e1018', c2: '#1c1f2e', angle: 170 },
    { c1: '#0a1628', c2: '#1a3048', angle: 140 },
    { c1: '#14101e', c2: '#2a1a3a', angle: 165 },
    { c1: '#120a1a', c2: '#2e1530', angle: 155 },
    { c1: '#0e0c1a', c2: '#221828', angle: 145 },
    { c1: '#0a1418', c2: '#142830', angle: 160 },
    { c1: '#101218', c2: '#1e2838', angle: 150 },
    { c1: '#080c12', c2: '#182430', angle: 170 },  // floor 9
];

function applyGradient(el, g) {
    el.style.background = `linear-gradient(${g.angle}deg, ${g.c1} 0%, ${g.c2} 100%)`;
}

// ============ STATE ============
// currentIndex maps directly to storyLines index AND data-floor value (both 0–9)
// Floor 0 = index 0, Floor 9 = index 9
// "Scroll/swipe up" = go UP in the elevator = higher floor = index + 1
let currentIndex = 0;
let isAnimating = false;

// ============ SHOW LINE ============
function showLine(index, goingUp) {
    if (index < 0 || index >= totalFloors) return;
    if (index === currentIndex && document.querySelector('.story-line[style*="opacity: 1"],.story-line[style*="opacity:1"]')) return;

    isAnimating = true;
    currentIndex = index;
    const floor = index; // direct mapping

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

    // Crossfade gradient
    const g = floorGradients[floor] || floorGradients[0];
    applyGradient(gradTo, g);
    gsap.killTweensOf(gradTo);
    gsap.to(gradTo, {
        opacity: 1, duration: 1, ease: 'power1.inOut',
        onComplete() {
            applyGradient(gradFrom, g);
            gsap.set(gradTo, { opacity: 0 });
        }
    });

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
    // Start at floor 0 (index 0)
    currentIndex = -1; // force showLine to run
    applyGradient(gradFrom, floorGradients[0]);
    storyLines.forEach(line => gsap.set(line, { opacity: 0 }));

    // Show floor 0 immediately (no animation)
    currentIndex = 0;
    gsap.set(storyLines[0], { opacity: 1 });
    floorNumber.textContent = '0';
    isAnimating = false;
    applyLang();
});
