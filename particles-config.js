particlesJS("particles-js", {
    particles: {
        number: { value: 1 }, // Reduced from 80 for cleaner look
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.01 }, // Made much more subtle
        size: { value: 2 },
        move: { enable: true, speed: 0.8 } // Slowed down slightly
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "grab" },
            resize: true
        },
        modes: {
            grab: { distance: 140, line_linked: { opacity: 0.1 } }
        }
    },
    retina_detect: true
});
