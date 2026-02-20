// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Floor indicator element
const floorNumber = document.querySelector('.floor-number');
const scrollHint = document.querySelector('.scroll-hint');
const body = document.body;

// Story lines
const storyLines = document.querySelectorAll('.story-line');

// Total floors for the journey
const totalFloors = 9;

// Animate story lines on scroll with smoother easing
storyLines.forEach((line, index) => {
    const targetFloor = parseInt(line.getAttribute('data-floor'));
    
    // Calculate scroll position for each floor
    const scrollProgress = targetFloor / totalFloors;
    
    gsap.to(line, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: 'body',
            start: `${scrollProgress * 100}% top`,
            end: `${(scrollProgress + 0.15) * 100}% top`,
            scrub: 1.5,
            onEnter: () => updateFloor(targetFloor),
            onEnterBack: () => updateFloor(targetFloor)
        }
    });
});

// Update floor indicator with smooth transition
let currentFloor = 0;
function updateFloor(floor) {
    if (currentFloor !== floor) {
        currentFloor = floor;
        gsap.to(floorNumber, {
            textContent: floor,
            duration: 0.5,
            ease: "power2.inOut",
            snap: { textContent: 1 },
            onUpdate: function() {
                floorNumber.textContent = Math.round(floorNumber.textContent);
            }
        });
    }
}

// Hide scroll hint after initial scroll
ScrollTrigger.create({
    trigger: 'body',
    start: '5% top',
    onEnter: () => {
        gsap.to(scrollHint, {
            opacity: 0,
            y: 10,
            duration: 0.8,
            ease: "power2.out"
        });
    },
    onLeaveBack: () => {
        gsap.to(scrollHint, {
            opacity: 0.3,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    }
});

// Animate floor indicator color as elevator ascends (cold to warm)
ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 2,
    onUpdate: (self) => {
        const progress = self.progress;
        
        // Transition floor indicator from cold cyan to warmer blue
        const startColor = { r: 0, g: 217, b: 255 };     // #00D9FF (cold cyan)
        const endColor = { r: 100, g: 200, b: 255 };     // Warmer blue
        
        const r = Math.round(startColor.r + (endColor.r - startColor.r) * progress);
        const g = Math.round(startColor.g + (endColor.g - startColor.g) * progress);
        const b = Math.round(startColor.b + (endColor.b - startColor.b) * progress);
        
        floorNumber.style.color = `rgb(${r}, ${g}, ${b})`;
    }
});

// Subtle parallax effect on story content
gsap.to('.story-content', {
    y: -100,
    ease: "none",
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 3
    }
});

// Initialize - set floor to 0
gsap.set(floorNumber, { 
    textContent: 0 
});

// Add smooth momentum scrolling feel
ScrollTrigger.normalizeScroll(true);
