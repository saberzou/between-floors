gsap.registerPlugin(ScrollTrigger);

const floorNumber = document.querySelector('.floor-number');
const scrollHint = document.querySelector('.scroll-hint');
const storyLines = document.querySelectorAll('.story-line');
const totalFloors = storyLines.length; // 10 lines (floors 0-9)

// Each story line gets its own scroll section
// Container is 500vh, so each floor gets ~50vh of scroll
const sectionSize = 1 / totalFloors;

let currentFloor = -1;

storyLines.forEach((line, index) => {
    const floor = parseInt(line.getAttribute('data-floor'));
    const start = index * sectionSize;
    const end = start + sectionSize;

    ScrollTrigger.create({
        trigger: '.container',
        start: `${start * 100}% top`,
        end: `${end * 100}% top`,
        onEnter: () => showLine(index, floor),
        onEnterBack: () => showLine(index, floor),
        onLeave: () => {
            // Fade out when scrolling past
            if (index < totalFloors - 1) {
                gsap.to(line, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' });
            }
        },
        onLeaveBack: () => {
            // Fade out when scrolling back past
            if (index > 0) {
                gsap.to(line, { opacity: 0, y: 20, duration: 0.4, ease: 'power2.in' });
            }
        }
    });
});

function showLine(index, floor) {
    // Hide all other lines
    storyLines.forEach((l, i) => {
        if (i !== index) {
            gsap.to(l, { opacity: 0, duration: 0.3, ease: 'power2.in' });
        }
    });

    // Show current line
    gsap.to(storyLines[index], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    });

    // Update floor number
    if (currentFloor !== floor) {
        currentFloor = floor;
        gsap.to(floorNumber, {
            textContent: floor,
            duration: 0.4,
            ease: 'power2.inOut',
            snap: { textContent: 1 },
            onUpdate() {
                floorNumber.textContent = Math.round(parseFloat(floorNumber.textContent));
            }
        });
    }
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

// Normalize scroll for smoother feel
ScrollTrigger.normalizeScroll(true);

// Show first line on load
gsap.set(storyLines[0], { opacity: 1 });
