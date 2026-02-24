/* ap/script.js */

// Global state for presentation
let currentSlide = 0;
const totalSlides = 12; // Hero(0) + History(1-5) + Portfolio(6) + Ecosystem(7) + QuemSomos(8) + Produtos(9) + Porque(10) + Feedback(11)

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Parallax Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('.parallax-bg').forEach(bg => {
            const speed = 0.3;
            bg.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Smooth scroll for nav links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Presentation Mode Logic (Exposed to global scope for HTML onclick)
function startPresentation() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }

    currentSlide = 0;
    scrollToSlide(0);
}

function scrollToSlide(index) {
    const slide = document.getElementById(`slide-${index}`);
    if (slide) {
        slide.scrollIntoView({ behavior: 'smooth' });
        currentSlide = index;
    }
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Only navigate with specific keys
    const nextKeys = ['ArrowRight', 'ArrowDown', 'PageDown', ' '];
    const prevKeys = ['ArrowLeft', 'ArrowUp', 'PageUp'];

    if (nextKeys.includes(e.key)) {
        if (currentSlide < totalSlides - 1) {
            e.preventDefault();
            scrollToSlide(currentSlide + 1);
        }
    } else if (prevKeys.includes(e.key)) {
        if (currentSlide > 0) {
            e.preventDefault();
            scrollToSlide(currentSlide - 1);
        }
    }
});

// History Slider Logic
let currentHistorySlide = 0;
const totalHistorySlides = 9;

function updateHistorySlider() {
    const container = document.getElementById('history-slides-container');
    const dots = document.querySelectorAll('.history-dot');

    if (container) {
        container.style.transform = `translateX(-${currentHistorySlide * 100}%)`;
    }

    dots.forEach((dot, index) => {
        if (index === currentHistorySlide) {
            dot.classList.add('active');
            dot.style.background = 'var(--accent)';
        } else {
            dot.classList.remove('active');
            dot.style.background = 'rgba(255, 255, 255, 0.2)';
        }
    });
}

function nextHistorySlide() {
    currentHistorySlide = (currentHistorySlide + 1) % totalHistorySlides;
    updateHistorySlider();
}

function prevHistorySlide() {
    currentHistorySlide = (currentHistorySlide - 1 + totalHistorySlides) % totalHistorySlides;
    updateHistorySlider();
}

// Auto-advance history slider (optional, but nice)
setInterval(() => {
    // Only auto-advance if the section is likely in view (not strictly checked here for simplicity)
    // nextHistorySlide();
}, 5000);
