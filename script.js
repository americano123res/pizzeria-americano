/* ============================================================
   PIZZERIA AMERICANO — JavaScript
   Mobile menu, menu filtering, scroll effects
   ============================================================ */

// ========== MOBILE MENU TOGGLE ==========
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Swap hamburger / close icon
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close menu when a link is clicked (mobile)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});
// ========== NAVBAR SCROLL EFFECT ==========
// Adds a "scrolled" class to the navbar when scrolling down
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Fade-in animation for filtered items
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// ========== SCROLL REVEAL (simple) ==========
// Fade in sections as they come into view
const revealElements = document.querySelectorAll('section');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight - 80) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for sections (except hero)
revealElements.forEach(el => {
    if (el.id !== 'hero') {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    }
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); // trigger on load in case already in view
