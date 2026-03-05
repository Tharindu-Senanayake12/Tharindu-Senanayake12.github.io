document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS Animations
    AOS.init({ duration: 1000, once: true, offset: 50 });

    // 2. Dynamic Year in Footer
    document.getElementById("year").innerText = new Date().getFullYear();

    // 3. Custom Mouse Cursor (Desktop Only)
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 80);
        });

        const interactives = document.querySelectorAll('a, button, .card, input, .close');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('active'));
            el.addEventListener('mouseleave', () => follower.classList.remove('active'));
        });
    }

    // 4. Mobile Hamburger Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
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

    // 5. 3D Carousel Logic
    const carousel = document.getElementById('carousel');
    const items = document.querySelectorAll('.carousel-item');
    const slider = document.getElementById('gallery-slider');

    if (carousel && items.length > 0) {
        const radius = Math.round((250 / 2) / Math.tan(Math.PI / items.length)) + 50; 
        const theta = 360 / items.length;

        items.forEach((item, index) => {
            const angle = index * theta;
            item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });

        let currentAngle = 0;
        let isAutoPlaying = true;
        let animationFrameId;

        function autoRotate() {
            if (!isAutoPlaying) return;
            currentAngle -= 0.15; 
            if (currentAngle <= -360) currentAngle += 360;
            
            slider.value = currentAngle;
            carousel.style.transform = `translateZ(${-radius}px) rotateY(${currentAngle}deg)`;
            animationFrameId = requestAnimationFrame(autoRotate);
        }

        autoRotate();

        slider.addEventListener('input', (e) => {
            isAutoPlaying = false;
            cancelAnimationFrame(animationFrameId);
            currentAngle = parseFloat(e.target.value);
            carousel.style.transform = `translateZ(${-radius}px) rotateY(${currentAngle}deg)`;
        });
    }

    // 6. Project Modal Logic
    const cards = document.querySelectorAll(".card");
    const modal = document.getElementById("modal");
    const title = document.getElementById("modal-title");
    const desc = document.getElementById("modal-desc");
    const tag = document.getElementById("modal-tag");
    const closeBtn = document.querySelector(".close");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            tag.innerText = card.querySelector(".category-tag").innerText;
            title.innerText = card.querySelector("h3").innerText;
            desc.innerText = card.querySelector("p").innerText;
            modal.style.display = "flex";
            document.body.style.overflow = "hidden"; 
        });
    });

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        };
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
});

function filterProjects(category) {
    const buttons = document.querySelectorAll('.filter-buttons button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    let projects = document.querySelectorAll(".card");
    projects.forEach(card => {
        if (category === "all") { 
            card.style.display = "block"; 
        } else { 
            card.classList.contains(category) ? card.style.display = "block" : card.style.display = "none"; 
        }
    });
}