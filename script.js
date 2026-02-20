gsap.registerPlugin(ScrollTrigger);

const floorNumber = document.querySelector('.floor-number');
const scrollHint = document.querySelector('.scroll-hint');
const storyLines = document.querySelectorAll('.story-line');
const gradFrom = document.querySelector('.floor-gradient-from');
const gradTo = document.querySelector('.floor-gradient-to');
const totalFloors = storyLines.length;

let currentIndex = -1;
let isInitialized = false;

// Two-color gradient mesh per floor — each floor has its own atmosphere
const floorGradients = [
    // floor 0 — lobby, cold concrete
    { c1: '#0a0e14', c2: '#1a2332', angle: 160 },
    // floor 1 — Aria speaks, faint warmth
    { c1: '#0c1220', c2: '#162a3a', angle: 150 },
    // floor 2 — unease, she didn't press a button
    { c1: '#0e1018', c2: '#1c1f2e', angle: 170 },
    // floor 3 — Aria knows too much, deeper blue
    { c1: '#0a1628', c2: '#1a3048', angle: 140 },
    // floor 4 — Maya's shock, slight purple
    { c1: '#14101e', c2: '#2a1a3a', angle: 165 },
    // floor 5 — anxiety spike, tension builds
    { c1: '#120a1a', c2: '#2e1530', angle: 155 },
    // floor 6 — ascending, throat tightens
    { c1: '#0e0c1a', c2: '#221828', angle: 145 },
    // floor 7 — ex blocked, surveillance teal
    { c1: '#0a1418', c2: '#142830', angle: 160 },
    // floor 8 — doors open, threshold
    { c1: '#101218', c2: '#1e2838', angle: 150 },
    // floor 9 — arrival, cameras watching, coldest
    { c1: '#080c12', c2: '#182430', angle: 170 },
];

function applyGradient(el, g) {
    el.style.background = `linear-gradient(${g.angle}deg, ${g.c1} 0%, ${g.c2} 100%)`;
}

// Reverse mapping: scroll top = floor 9, scroll bottom = floor 0
function scrollIndexToLineIndex(scrollIndex) {
    return (totalFloors - 1) - scrollIndex;
}

// Hide all lines initially
storyLines.forEach(line => gsap.set(line, { opacity: 0 }));

// Main scroll controller with snap
ScrollTrigger.create({
    trigger: '.container',
    start: 'top top',
    end: 'bottom bottom',
    snap: {
        snapTo: 1 / (totalFloors - 1),
        duration: { min: 0.4, max: 0.8 },
        delay: 0.1,
        ease: 'power3.inOut',
        inertia: false
    },
    onUpdate(self) {
        if (!isInitialized) return;
        const scrollIndex = Math.round(self.progress * (totalFloors - 1));
        const lineIndex = scrollIndexToLineIndex(scrollIndex);

        if (lineIndex !== currentIndex) {
            showLine(lineIndex);
        }
    }
});

function showLine(index) {
    const prevIndex = currentIndex;
    currentIndex = index;
    const floor = parseInt(storyLines[index].getAttribute('data-floor'));
    const goingUp = index > prevIndex;

    // Kill tweens to prevent stacking
    storyLines.forEach(line => gsap.killTweensOf(line));

    // Hide all lines except current
    storyLines.forEach((line, i) => {
        if (i !== index) gsap.set(line, { opacity: 0 });
    });

    // Animate in current line
    gsap.fromTo(storyLines[index],
        { opacity: 0, y: goingUp ? 25 : -25 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );

    // Crossfade gradient: current → new
    const g = floorGradients[floor] || floorGradients[0];
    // Set "to" layer to new gradient, fade it in, then swap
    applyGradient(gradTo, g);
    gsap.to(gradTo, {
        opacity: 1,
        duration: 1,
        ease: 'power1.inOut',
        onComplete() {
            // Swap: copy "to" into "from", reset "to" opacity
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
}

// On load: jump to bottom (floor 0)
window.addEventListener('load', () => {
    // Set initial gradient
    applyGradient(gradFrom, floorGradients[0]);

    ScrollTrigger.disable();
    window.scrollTo(0, document.body.scrollHeight);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            ScrollTrigger.enable();
            ScrollTrigger.refresh();
            isInitialized = true;
            showLine(totalFloors - 1);
            currentIndex = totalFloors - 1;
        });
    });
});

// Hide scroll hint after first scroll
ScrollTrigger.create({
    trigger: '.container',
    start: '97% bottom',
    end: 'top top',
    onLeave: () => gsap.to(scrollHint, { opacity: 0.3, y: 0, duration: 0.8 }),
    onEnterBack: () => gsap.to(scrollHint, { opacity: 0, y: 10, duration: 0.8 })
});

// Floor indicator color: cold cyan at lobby → warmer as ascending
ScrollTrigger.create({
    trigger: '.container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 2,
    onUpdate(self) {
        const p = 1 - self.progress;
        const r = Math.round(100 * p);
        const g = Math.round(217 - 17 * p);
        const b = 255;
        floorNumber.style.color = `rgb(${r}, ${g}, ${b})`;
    }
});
