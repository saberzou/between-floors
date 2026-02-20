gsap.registerPlugin(ScrollTrigger);

const floorNumber = document.querySelector('.floor-number');
const scrollHint = document.querySelector('.scroll-hint');
const storyLines = document.querySelectorAll('.story-line');
const totalFloors = storyLines.length; // 10 lines (floors 0-9)

let currentIndex = 0;

// Snap-based scroll: divide the full scroll into sections
// ScrollTrigger snap will lock to each section boundary
ScrollTrigger.create({
    trigger: '.container',
    start: 'top top',
    end: 'bottom bottom',
    snap: {
        snapTo: 1 / (totalFloors - 1),   // snap points at 0, 1/9, 2/9 ... 1
        duration: { min: 0.3, max: 0.6 },
        delay: 0.05,
        ease: 'power2.inOut'
    },
    onUpdate(self) {
        // Map scroll progress to floor index
        const rawIndex = self.progress * (totalFloors - 1);
        const index = Math.round(rawIndex);

        if (index !== currentIndex) {
            showLine(index);
        }
    }
});

function showLine(index) {
    const prevIndex = currentIndex;
    currentIndex = index;

    // The data-floor values go 0-9 in HTML order
    // But we want scroll-down = ascending, so reverse:
    // index 0 (top of page) = floor 0, index 9 (bottom) = floor 9
    // Actually — to reverse: index 0 = floor 9, index 9 = floor 0
    // Wait, the story starts at floor 0 and goes to floor 9.
    // "Scroll down to go up" means first section = floor 0, last = floor 9.
    // That's already the natural mapping. The story order in HTML is 0→9.
    // So scrolling down reveals floors 0, 1, 2... 9. That IS going up.

    const floor = parseInt(storyLines[index].getAttribute('data-floor'));

    // Direction for animation
    const goingUp = index > prevIndex;

    // Fade out previous
    if (prevIndex !== index && storyLines[prevIndex]) {
        gsap.to(storyLines[prevIndex], {
            opacity: 0,
            y: goingUp ? -30 : 30,
            duration: 0.35,
            ease: 'power2.in'
        });
    }

    // Fade in current
    gsap.fromTo(storyLines[index],
        { opacity: 0, y: goingUp ? 30 : -30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
    );

    // Update floor number
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

// Hide scroll hint after first scroll
ScrollTrigger.create({
    trigger: '.container',
    start: '3% top',
    onEnter: () => gsap.to(scrollHint, { opacity: 0, y: 10, duration: 0.8 }),
    onLeaveBack: () => gsap.to(scrollHint, { opacity: 0.3, y: 0, duration: 0.8 })
});

// Floor indicator color shift: cold cyan → warmer tone
ScrollTrigger.create({
    trigger: '.container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 2,
    onUpdate(self) {
        const p = self.progress;
        const r = Math.round(0 + 100 * p);
        const g = Math.round(217 - 17 * p);
        const b = 255;
        floorNumber.style.color = `rgb(${r}, ${g}, ${b})`;
    }
});

// Disable normalizeScroll — let snap handle the pacing
// ScrollTrigger.normalizeScroll(true);

// Show first line on load
gsap.set(storyLines[0], { opacity: 1 });
