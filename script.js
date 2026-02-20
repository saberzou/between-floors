gsap.registerPlugin(ScrollTrigger);

const floorNumber = document.querySelector('.floor-number');
const scrollHint = document.querySelector('.scroll-hint');
const storyLines = document.querySelectorAll('.story-line');
const totalFloors = storyLines.length; // 10 lines (floors 0-9)

let currentIndex = -1;
let isInitialized = false;

// Reverse mapping: scroll position 0 (top) = floor 9, scroll position 1 (bottom) = floor 0
// User starts at bottom (floor 0), scrolls UP to ascend
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
        inertia: false              // kill momentum — one swipe, one floor
    },
    onUpdate(self) {
        if (!isInitialized) return;
        // scrollIndex 0 = top of page, 9 = bottom
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

    // Kill ALL running tweens on story lines to prevent stacking
    storyLines.forEach(line => gsap.killTweensOf(line));

    // Hide ALL lines except current
    storyLines.forEach((line, i) => {
        if (i !== index) {
            gsap.set(line, { opacity: 0 });
        }
    });

    // Animate in current line
    gsap.fromTo(storyLines[index],
        { opacity: 0, y: goingUp ? 25 : -25 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );

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

// On load: jump to bottom (floor 0), then enable interaction
window.addEventListener('load', () => {
    // Instant scroll to bottom — no animation, no triggers
    ScrollTrigger.disable();
    window.scrollTo(0, document.body.scrollHeight);

    // Brief delay to let browser settle, then enable
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            ScrollTrigger.enable();
            ScrollTrigger.refresh();
            isInitialized = true;

            // Show floor 0 (last line in reversed mapping)
            showLine(totalFloors - 1);
            currentIndex = totalFloors - 1;
        });
    });
});

// Hide scroll hint after first scroll
ScrollTrigger.create({
    trigger: '.container',
    start: '97% bottom',   // near bottom, scrolling up
    end: 'top top',
    onLeave: () => gsap.to(scrollHint, { opacity: 0.3, y: 0, duration: 0.8 }),
    onEnterBack: () => gsap.to(scrollHint, { opacity: 0, y: 10, duration: 0.8 })
});

// Floor indicator color shift
ScrollTrigger.create({
    trigger: '.container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 2,
    onUpdate(self) {
        // Invert: bottom (start) = cold, top (floor 9) = warm
        const p = 1 - self.progress;
        const r = Math.round(100 * p);
        const g = Math.round(217 - 17 * p);
        const b = 255;
        floorNumber.style.color = `rgb(${r}, ${g}, ${b})`;
    }
});
