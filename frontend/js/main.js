/**
 * Main JavaScript for Landing Page
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize starfield animation
    initStarfield();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize smooth scroll for navigation links
    initSmoothScroll();
});

/**
 * Starfield Canvas Animation
 */
function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    const numStars = 700;
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    function createStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2,
                speedY: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.5 + 0.3,
                twinkle: Math.random() * 0.02
            });
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        stars.forEach(star => {
            // Update position
            star.y += star.speedY;
            star.opacity += star.twinkle;
            
            // Reset if off screen
            if (star.y > height) {
                star.y = 0;
                star.x = Math.random() * width;
            }
            
            // Keep opacity in bounds
            if (star.opacity > 1 || star.opacity < 0.3) {
                star.twinkle = -star.twinkle;
            }
            
            // Draw star
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Initialize
    resize();
    createStars();
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        resize();
        createStars();
    });
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Smooth Scroll for Navigation Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile nav if open
                const mobileNav = document.getElementById('mobileNav');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                }
            }
        });
    });
}

/**
 * Navbar scroll effect
 */
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});
