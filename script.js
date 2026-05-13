/* ============================================================
   PIZZERIA AMERICANO — JavaScript
   Mobile menu, dynamic menu rendering, filtering, scroll effects
   ============================================================ */

// ========== MOBILE MENU TOGGLE ==========
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== DYNAMIC MENU RENDERING ==========
const menuGrid = document.getElementById('menuGrid');
const sizeLegend = document.getElementById('sizeLegend');

function getBadgeClass(badge) {
    if (!badge) return '';
    if (badge.toLowerCase().includes('popular')) return 'popular';
    if (badge.toLowerCase().includes('house')) return 'house';
    if (badge.toLowerCase().includes('premium')) return 'premium';
    if (badge.toLowerCase().includes('sharing')) return 'popular';
    return 'popular';
}

function renderMenu(category) {
    const items = category === 'all' ? MENU_DATA : MENU_DATA.filter(i => i.cat === category);
    
    // Show/hide size legend based on category
    if (category === 'all' || category === 'pizza') {
        sizeLegend.style.display = 'block';
    } else {
        sizeLegend.style.display = 'none';
    }
    
    menuGrid.innerHTML = items.map(item => {
        const isSpecial = item.name.includes('Americano Special');
        const badgeHTML = item.badge 
            ? `<span class="menu-badge ${getBadgeClass(item.badge)}">${item.badge}</span>` 
            : '';
        const nameDisplay = isSpecial ? `${item.name} ⭐` : item.name;
        
        return `
            <div class="menu-item ${isSpecial ? 'special' : ''}" data-category="${item.cat}">
                <div class="menu-item-icon">${item.icon}</div>
                <div class="menu-item-header">
                    <h4>${nameDisplay}</h4>
                    <span class="price">${item.price} <small>MKD</small></span>
                </div>
                <p>${item.desc}</p>
                ${badgeHTML}
            </div>
        `;
    }).join('');
    
    // Animate items in
    menuGrid.querySelectorAll('.menu-item').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(12px)';
        setTimeout(() => {
            el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, i * 30);
    });
}

// ========== CATEGORY TAB FILTERING ==========
const menuTabs = document.getElementById('menuTabs');

menuTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.menu-tab');
    if (!tab) return;
    
    menuTabs.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    renderMenu(tab.dataset.cat);
});

// Initial render
renderMenu('all');

// ========== SCROLL REVEAL ==========
const revealElements = document.querySelectorAll('section');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

revealElements.forEach(el => {
    if (el.id !== 'hero') {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    }
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
