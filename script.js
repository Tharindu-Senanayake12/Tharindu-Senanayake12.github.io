document.addEventListener('DOMContentLoaded', () => {
    // 1. Remove Preloader
    const preloader = document.getElementById('preloader');
    if(preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 600);
        }, 800); // Short delay to let the page settle
    }

    // 2. Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const scrollProgress = document.getElementById('scroll-progress');
        if(scrollProgress) {
            const scrollPx = document.documentElement.scrollTop;
            const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
            scrollProgress.style.width = scrolled;
        }
    });

    // 3. Initialize Animations & Particles
    AOS.init({ duration: 1000, once: true, offset: 50 });
    
    if(typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } }, 
                color: { value: "#ffffff" }, shape: { type: "circle" },
                opacity: { value: 0.8, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } }, 
                size: { value: 2.5, random: true, anim: { enable: false } },
                line_linked: { enable: false }, // Twinkling stars instead of web
                move: { enable: true, speed: 0.2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: { detect_on: "canvas", events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
            retina_detect: true
        });
    }

    // 4. Dynamic Year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.innerText = new Date().getFullYear();

    // 5. Custom Cursor & 3D Hover Tilt Logic (Desktop Only)
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        // Cursor
        if(cursor && follower) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                setTimeout(() => {
                    follower.style.left = e.clientX + 'px';
                    follower.style.top = e.clientY + 'px';
                }, 80);
            });
            document.querySelectorAll('a, button, .card, input, .close, .skill-pill, .timeline-content').forEach(el => {
                el.addEventListener('mouseenter', () => follower.classList.add('active'));
                el.addEventListener('mouseleave', () => follower.classList.remove('active'));
            });
        }

        // Vanilla JS 3D Tilt Effect for Cards
        const tiltCards = document.querySelectorAll('.tilt-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation (max 10 degrees)
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

    // 6. Mobile Nav
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

    // 7. High-Performance 3D Wheels
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

    setup3DWheel('carousel', '.carousel-item', 'gallery-slider', 250, 50); 
    setup3DWheel('video-wheel', '.wheel-item', 'video-slider', 400, 60); 

    // 8. Modal Logic
    const modal = document.getElementById("modal");
    if(modal) {
        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("click", () => {
                document.getElementById("modal-tag").innerText = card.querySelector(".category-tag").innerText;
                document.getElementById("modal-title").innerText = card.querySelector("h3").innerText;
                document.getElementById("modal-desc").innerText = card.querySelector("p").innerText;
                modal.style.display = "flex";
                document.body.style.overflow = "hidden"; 
            });
        });
        document.querySelector(".close").onclick = () => { modal.style.display = "none"; document.body.style.overflow = "auto"; };
        window.onclick = (e) => { if (e.target == modal) { modal.style.display = "none"; document.body.style.overflow = "auto"; } };
    }

    updatePortfolioDisplay();
});

// 9. Portfolio Filter Logic
let currentCategory = 'all', currentSubCategory = 'all', itemsShowing = 6;

function updatePortfolioDisplay() {
    const allCards = Array.from(document.querySelectorAll('.projects .card'));
    const designSubFilters = document.getElementById('design-sub-filters');
    const showMoreContainer = document.getElementById('show-more-container');
    let visibleCardsCount = 0, matchedCardsCount = 0;

    if (currentCategory === 'design') { if(designSubFilters) designSubFilters.style.display = 'flex'; } 
    else { if(designSubFilters) designSubFilters.style.display = 'none'; currentSubCategory = 'all'; }

    allCards.forEach(card => {
        let isMatch = (currentCategory === 'all' || card.classList.contains(currentCategory)) && 
                      (currentSubCategory === 'all' || card.classList.contains(currentSubCategory));

        if (isMatch) {
            matchedCardsCount++;
            if (visibleCardsCount < itemsShowing) {
                card.classList.remove('hidden'); card.style.display = 'block'; visibleCardsCount++;
            } else { card.classList.add('hidden'); card.style.display = 'none'; }
        } else { card.classList.add('hidden'); card.style.display = 'none'; }
    });

    if (showMoreContainer) showMoreContainer.style.display = (matchedCardsCount > itemsShowing) ? 'block' : 'none';
}

function filterProjects(category) {
    document.querySelectorAll('.filter-buttons button').forEach(btn => btn.classList.remove('active'));
    if(window.event && window.event.target) window.event.target.classList.add('active');
    document.querySelectorAll('.sub-btn').forEach(btn => btn.classList.remove('active'));
    if(document.querySelector('.sub-btn')) document.querySelector('.sub-btn').classList.add('active');

    currentCategory = category; currentSubCategory = 'all'; itemsShowing = 4;
    updatePortfolioDisplay();
}

function filterSubProjects(mainCategory, subCategory) {
    document.querySelectorAll('.sub-btn').forEach(btn => btn.classList.remove('active'));
    if(window.event && window.event.target) window.event.target.classList.add('active');

    currentCategory = mainCategory; currentSubCategory = subCategory; itemsShowing = 4;
    updatePortfolioDisplay();
}

function showMoreProjects() { itemsShowing += 4; updatePortfolioDisplay(); }