// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Floor indicator element
const floorNumber = document.querySelector('.floor-number');
const scrollHint = document.querySelector('.scroll-hint');

// Story lines
const storyLines = document.querySelectorAll('.story-line');

// Animate story lines on scroll
storyLines.forEach((line, index) => {
    const targetFloor = parseInt(line.getAttribute('data-floor'));
    
    // Calculate scroll position for each floor
    const scrollProgress = targetFloor / 9; // 9 floors total
    
    gsap.to(line, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
            trigger: 'body',
            start: `${scrollProgress * 100}% top`,
            end: `${(scrollProgress + 0.1) * 100}% top`,
            scrub: 1,
            onEnter: () => updateFloor(targetFloor),
            onEnterBack: () => updateFloor(targetFloor)
        }
    });
});

// Update floor indicator
function updateFloor(floor) {
    floorNumber.textContent = floor;
}

// Hide scroll hint after initial scroll
ScrollTrigger.create({
    trigger: 'body',
    start: '5% top',
    onEnter: () => {
        gsap.to(scrollHint, {
            opacity: 0,
            duration: 0.5
        });
    },
    onLeaveBack: () => {
        gsap.to(scrollHint, {
            opacity: 0.4,
            duration: 0.5
        });
    }
});

// Smooth floor number transitions
gsap.set(floorNumber, { 
    textContent: 0 
});

// Add subtle elevator hum effect (optional)
// Could add ambient audio here if desired
