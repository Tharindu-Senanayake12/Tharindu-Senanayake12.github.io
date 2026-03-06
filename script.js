document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. IMPROVED CINEMATIC PRELOADER EXIT & TEXT FIX
    // =========================================
    const preloader = document.getElementById('preloader');
    const signatureText = document.querySelector('.signature-text');

    if(preloader) {
        // --- Goal 1: Fix Text Cropping and Set Full String ---
        // The image showed a crop of "Tharindu Senanayak".
        // This explicitly sets the full name to correct any typography errors
        // and prepare for the associated CSS height fixes to handle tall characters.
        if (signatureText) {
            signatureText.innerText = "Tharindu Senanayake";
        }

        // --- Goal 2: More Interesting Exit Animation ---
        // Staged Exit: Scale Down slowly, *then* Decrease Opacity.
        // Requires two new CSS classes in your style.css:
        // '.preloader-phase-1' for scale and '.preloader-phase-2' for opacity.

        // Allow writing + sparkle (from CSS) + small buffer to complete (3500ms total)
        setTimeout(() => {
            // Phase 1: slow cinematic scale down
            // Transition for transform should be long (e.g., 1.2s cubic)
            preloader.classList.add('preloader-phase-1');

            // Wait a bit *after* phase 1 starts, before starting phase 2
            // Allows the scale-down to be noticed. (e.g., 600ms delay)
            setTimeout(() => {
                // Phase 2: opacity decrease
                // Transition for opacity should be moderate (e.g., 0.8s ease)
                preloader.classList.add('preloader-phase-2');

                // Wait for the final fade to complete before hiding
                // Matches the CSS duration (800ms) + small buffer
                setTimeout(() => {
                    preloader.style.display = 'none';
                    // Re-enable background scrolling if disabled
                    document.body.style.overflow = "auto"; 
                }, 850); 

            }, 600); // Allows scale to be noticed

        }, 3500); 
    }

    // =========================================
    // 2. PRESERVE ALL Interactive Features
    // =========================================

    // Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const scrollProgress = document.getElementById('scroll-progress');
        if(scrollProgress) {
            const scrollPx = document.documentElement.scrollTop;
            const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
            scrollProgress.style.width = scrolled;
        }
    });

    // Initialize Animations & Particles (preserves Starry Night config)
    AOS.init({ duration: 1000, once: true, offset: 50 });
    
    if(typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } }, 
                color: { value: "#ffffff" }, shape: { type: "circle" },
                opacity: { value: 0.8, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } }, 
                size: { value: 2.5, random: true, anim: { enable: false } },
                line_linked: { enable: false }, // Twinkling stars, no web
                move: { enable: true, speed: 0.2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: { detect_on: "canvas", events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
            retina_detect: true
        });
    }

    // Dynamic Year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.innerText = new Date().getFullYear();

    // Mobile Nav
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // High-Performance 3D Wheels
    function setup3DWheel(wheelId, itemClass, sliderId, itemWidth, extraRadius) {
        const wheel = document.getElementById(wheelId);
        const items = document.querySelectorAll(itemClass);
        const slider = document.getElementById(sliderId);

        if (!wheel || items.length === 0 || !slider) return;

        const radius = Math.round((itemWidth / 2) / Math.tan(Math.PI / items.length)) + extraRadius; 
        const theta = 360 / items.length;

        items.forEach((item, index) => {
            item.style.transform = `rotateY(${index * theta}deg) translateZ(${radius}px)`;
        });

        let currentAngle = 0;
        let isAutoPlaying = true;
        let animationFrameId;
        let isVisible = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible && isAutoPlaying) autoRotate();
                if (!isVisible) cancelAnimationFrame(animationFrameId);
            });
        });
        observer.observe(wheel.parentElement);

        function autoRotate() {
            if (!isAutoPlaying || !isVisible) return;
            currentAngle -= (wheelId === 'carousel' ? 0.15 : 0.1); 
            if (currentAngle <= -360) currentAngle += 360;
            slider.value = currentAngle;
            wheel.style.transform = `translateZ(${-radius}px) rotateY(${currentAngle}deg)`;
            animationFrameId = requestAnimationFrame(autoRotate);
        }

        slider.addEventListener('input', (e) => {
            isAutoPlaying = false;
            cancelAnimationFrame(animationFrameId);
            currentAngle = parseFloat(e.target.value);
            wheel.style.transform = `translateZ(${-radius}px) rotateY(${currentAngle}deg)`;
        });
    }

    setup3DWheel('carousel', '.carousel-item', 'gallery-slider', 250, 50); // Hero
    setup3DWheel('video-wheel', '.wheel-item', 'video-slider', 400, 60); // NFT Videos

    // RENDER DYNAMIC PROJECTS FROM projects.js
    if (typeof projectsData !== 'undefined') {
        const grid = document.getElementById('portfolio-grid');
        if (grid) {
            projectsData.forEach((proj, index) => {
                const card = document.createElement('div');
                card.className = `card tilt-card ${proj.filterClasses}`;
                card.setAttribute('data-id', index); // Crucial for tracking which project to open
                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <img src="${proj.image}" alt="${proj.title}">
                    </div>
                    <div class="card-content">
                        <span class="category-tag">${proj.tag}</span>
                        <h3>${proj.title}</h3>
                        <p>${proj.description.substring(0, 95)}...</p>
                    </div>
                `;
                
                // Add click listener to open the lightbox
                card.addEventListener('click', () => openModal(index));
                grid.appendChild(card);
            });
        }
    }

    // Custom Cursor & 3D Hover Tilt Logic (Attached AFTER cards are rendered)
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        // Cursor Position Logic
        if(cursor && follower) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                setTimeout(() => {
                    follower.style.left = e.clientX + 'px';
                    follower.style.top = e.clientY + 'px';
                }, 80);
            });
            document.querySelectorAll('a, button, .card, input, .close, .skill-pill, .timeline-content, .lightbox-nav').forEach(el => {
                el.addEventListener('mouseenter', () => follower.classList.add('active'));
                el.addEventListener('mouseleave', () => follower.classList.remove('active'));
            });
        }

        // Vanilla JS 3D Tilt Effect for Cards
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'transform 0.5s ease';
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none'; // Remove transition during mouse movement for crisp response
            });
        });
    }

    // Modal Close Logic (preserves standard closing)
    const modal = document.getElementById("modal");
    if(modal) {
        document.querySelector(".close").onclick = () => { modal.style.display = "none"; document.body.style.overflow = "auto"; };
        window.onclick = (e) => { if (e.target == modal) { modal.style.display = "none"; document.body.style.overflow = "auto"; } };
    }

    updatePortfolioDisplay();
});

// =========================================
// 3. (Preserved) LIGHTBOX & PROJECT FILTER LOGIC
// =========================================
let currentCategory = 'all', currentSubCategory = 'all', itemsShowing = 6;
let filteredProjectIndices = []; // Stores the indices of currently visible projects
let currentModalIndex = 0; // Tracks position within the filtered array

function updatePortfolioDisplay() {
    const allCards = Array.from(document.querySelectorAll('.projects .card'));
    const designSubFilters = document.getElementById('design-sub-filters');
    const showMoreContainer = document.getElementById('show-more-container');
    
    let visibleCardsCount = 0;
    filteredProjectIndices = []; // Reset the tracking array

    if (currentCategory === 'design') { if(designSubFilters) designSubFilters.style.display = 'flex'; } 
    else { if(designSubFilters) designSubFilters.style.display = 'none'; currentSubCategory = 'all'; }

    allCards.forEach((card) => {
        let isMatch = (currentCategory === 'all' || card.classList.contains(currentCategory)) && 
                      (currentSubCategory === 'all' || card.classList.contains(currentSubCategory));

        if (isMatch) {
            // Track the original index of this project for the lightbox Next/Prev logic
            filteredProjectIndices.push(parseInt(card.getAttribute('data-id')));
            
            if (visibleCardsCount < itemsShowing) {
                card.classList.remove('hidden'); card.style.display = 'flex'; visibleCardsCount++;
            } else { card.classList.add('hidden'); card.style.display = 'none'; }
        } else { card.classList.add('hidden'); card.style.display = 'none'; }
    });

    if (showMoreContainer) showMoreContainer.style.display = (filteredProjectIndices.length > itemsShowing) ? 'block' : 'none';
}

window.filterProjects = function(category) {
    document.querySelectorAll('.filter-buttons button').forEach(btn => btn.classList.remove('active'));
    if(window.event && window.event.target) window.event.target.classList.add('active');
    document.querySelectorAll('.sub-btn').forEach(btn => btn.classList.remove('active'));
    if(document.querySelector('.sub-btn')) document.querySelector('.sub-btn').classList.add('active');

    currentCategory = category; currentSubCategory = 'all'; itemsShowing = 6;
    updatePortfolioDisplay();
}

window.filterSubProjects = function(mainCategory, subCategory) {
    document.querySelectorAll('.sub-btn').forEach(btn => btn.classList.remove('active'));
    if(window.event && window.event.target) window.event.target.classList.add('active');

    currentCategory = mainCategory; currentSubCategory = subCategory; itemsShowing = 6;
    updatePortfolioDisplay();
}

window.showMoreProjects = function() { itemsShowing += 6; updatePortfolioDisplay(); }

// =========================================
// 4. (Preserved) MODAL NAVIGATION FUNCTIONS
// =========================================
window.openModal = function(originalIndex) {
    // Find where the clicked project sits in the current filtered list
    currentModalIndex = filteredProjectIndices.indexOf(originalIndex);
    if(currentModalIndex === -1) currentModalIndex = 0; // Safe fallback
    
    updateModalContent();
    document.getElementById('modal').style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
}

window.navigateModal = function(step) {
    currentModalIndex += step;
    // Wrap around logic
    if (currentModalIndex >= filteredProjectIndices.length) currentModalIndex = 0;
    if (currentModalIndex < 0) currentModalIndex = filteredProjectIndices.length - 1;
    
    updateModalContent();
}

function updateModalContent() {
    const projIndex = filteredProjectIndices[currentModalIndex];
    const proj = projectsData[projIndex]; // Fetch from projects.js database
    
    document.getElementById("modal-img").src = proj.image;
    document.getElementById("modal-img").alt = proj.title;
    document.getElementById("modal-tag").innerText = proj.tag;
    document.getElementById("modal-title").innerText = proj.title;
    document.getElementById("modal-desc").innerText = proj.description; // Shows full description
}