/* ======================================
   FTESË DASME — Enhanced Script
   Envelope open, Sparkle burst, Petals,
   Staggered reveal, WhatsApp share
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // FLOATING PETALS
    // ==========================================
    const canvas = document.getElementById('fx-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Also resize burst canvas
        burstCanvas.width = window.innerWidth;
        burstCanvas.height = window.innerHeight;
    }

    class Petal {
        constructor() { this.reset(true); }

        reset(initial) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : -20 - Math.random() * 60;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 0.4 + 0.15;
            this.speedX = (Math.random() - 0.5) * 0.25;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.015;
            this.opacity = Math.random() * 0.3 + 0.08;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.012 + 0.004;
            this.wobbleAmp = Math.random() * 0.6 + 0.2;

            const colors = [
                { r: 240, g: 195, b: 195 },
                { r: 245, g: 210, b: 190 },
                { r: 253, g: 230, b: 215 },
                { r: 232, g: 200, b: 160 },
                { r: 220, g: 170, b: 170 },
                { r: 245, g: 220, b: 200 },
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * this.wobbleAmp;
            this.y += this.speedY;
            this.rotation += this.rotSpeed;
            if (this.y > canvas.height + 30) this.reset(false);
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 0.3, this.size * 0.65, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        const count = Math.min(35, Math.floor((canvas.width * canvas.height) / 30000));
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Petal());
    }

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        animId = requestAnimationFrame(animatePetals);
    }

    // ==========================================
    // SPARKLE BURST (on card open)
    // ==========================================
    const burstCanvas = document.getElementById('burst-canvas');
    const bCtx = burstCanvas.getContext('2d');
    let burstParticles = [];
    let burstAnimId;
    let burstActive = false;

    class BurstParticle {
        constructor(cx, cy) {
            this.x = cx;
            this.y = cy;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 2;
            this.gravity = 0.06;
            this.size = Math.random() * 5 + 2;
            this.opacity = 1;
            this.decay = Math.random() * 0.015 + 0.008;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.1;

            // Type
            this.type = Math.random();

            const colors = [
                '#F0D48A', '#C9A84C', '#E8C88A',
                '#D4919A', '#F0C8C8', '#F5E6A3',
                '#FFD700', '#FFDAB9', '#FFB6C1',
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.vx *= 0.99;
            this.opacity -= this.decay;
            this.rotation += this.rotSpeed;
            this.size *= 0.998;
        }

        draw() {
            if (this.opacity <= 0) return;
            bCtx.save();
            bCtx.translate(this.x, this.y);
            bCtx.rotate(this.rotation);
            bCtx.globalAlpha = this.opacity;

            if (this.type < 0.35) {
                // Heart
                const s = this.size * 0.5;
                bCtx.beginPath();
                bCtx.moveTo(0, s * 0.4);
                bCtx.bezierCurveTo(-s, -s * 0.4, -s, s * 0.6, 0, s * 1.2);
                bCtx.bezierCurveTo(s, s * 0.6, s, -s * 0.4, 0, s * 0.4);
                bCtx.fillStyle = this.color;
                bCtx.fill();
            } else if (this.type < 0.65) {
                // Star/sparkle
                bCtx.fillStyle = this.color;
                bCtx.font = `${this.size * 2.5}px serif`;
                bCtx.fillText('✦', 0, 0);
            } else {
                // Circle
                bCtx.beginPath();
                bCtx.arc(0, 0, this.size, 0, Math.PI * 2);
                bCtx.fillStyle = this.color;
                bCtx.fill();
            }

            bCtx.restore();
        }
    }

    function triggerBurst() {
        const cx = burstCanvas.width / 2;
        const cy = burstCanvas.height / 2;
        burstParticles = [];

        for (let i = 0; i < 120; i++) {
            burstParticles.push(new BurstParticle(cx, cy));
        }

        burstActive = true;
        animateBurst();
    }

    function animateBurst() {
        bCtx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);

        let alive = false;
        burstParticles.forEach(p => {
            p.update();
            p.draw();
            if (p.opacity > 0) alive = true;
        });

        if (alive) {
            burstAnimId = requestAnimationFrame(animateBurst);
        } else {
            burstActive = false;
            bCtx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
        }
    }

    // ==========================================
    // INIT
    // ==========================================
    resize();
    window.addEventListener('resize', resize);
    initParticles();
    animatePetals();

    // ==========================================
    // INTRO → CARD TRANSITION
    // ==========================================
    const introScreen = document.getElementById('intro-screen');
    const openBtn = document.getElementById('open-btn');
    const cardWrapper = document.getElementById('card-wrapper');
    const envelopeAnim = document.getElementById('envelope-anim');
    let opened = false;

    function openCard() {
        if (opened) return;
        opened = true;

        // Step 1: Open envelope
        envelopeAnim.classList.add('open');

        // Step 2: Trigger sparkle burst
        setTimeout(() => {
            triggerBurst();
        }, 600);

        // Step 3: Fade out intro with zoom effect
        setTimeout(() => {
            introScreen.classList.add('opening');
        }, 900);

        // Step 4: Show the card
        setTimeout(() => {
            cardWrapper.classList.add('visible');

            // Step 5: Staggered reveal
            setTimeout(revealElements, 400);
        }, 1400);
    }

    openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openCard();
    });

    introScreen.addEventListener('click', () => {
        openCard();
    });

    // ==========================================
    // STAGGERED REVEAL
    // ==========================================
    function revealElements() {
        const items = document.querySelectorAll('.anim');
        items.forEach(item => {
            const delay = parseInt(item.getAttribute('data-delay')) || 0;
            setTimeout(() => {
                item.classList.add('visible');
            }, delay);
        });
    }

    // ==========================================
    // WHATSAPP SHARE
    // ==========================================
    const whatsappBtn = document.getElementById('whatsapp-share');

    whatsappBtn.addEventListener('click', () => {
        // Build WhatsApp message
        const message = encodeURIComponent(
            `💍 *Ftesë Dasme* 💍\n\n` +
            `Të dashur familjarë dhe miq,\n\n` +
            `Me shumë dashuri dhe gëzim ju ftojmë të ndani me ne një nga momentet më të bukura të jetës sonë – ditën e dasmës sonë.\n\n` +
            `✨ *Urim & Malisa* ✨\n\n` +
            `📅 Data: 02 Gusht 2026\n` +
            `🕐 Ora: 19:00\n` +
            `📍 Vendi: Restorant "Dardania", Kërçovë\n\n` +
            `Prania juaj do ta bëjë këtë ditë edhe më të veçantë për ne.\n\n` +
            `Me dashuri,\nUrim & Malisa 💕`
        );

        // Get current page URL (will work when hosted)
        const pageUrl = window.location.href;
        const isLocal = pageUrl.startsWith('file://');

        if (isLocal) {
            // If running locally, share text only
            const waUrl = `https://wa.me/?text=${message}`;
            window.open(waUrl, '_blank');
        } else {
            // If hosted, include link
            const fullMessage = encodeURIComponent(
                `💍 *Ftesë Dasme* 💍\n\n` +
                `Të dashur familjarë dhe miq,\n\n` +
                `Me shumë dashuri dhe gëzim ju ftojmë të ndani me ne një nga momentet më të bukura të jetës sonë – ditën e dasmës sonë.\n\n` +
                `✨ *Urim & Malisa* ✨\n\n` +
                `📅 Data: 02 Gusht 2026\n` +
                `🕐 Ora: 19:00\n` +
                `📍 Vendi: Restorant "Dardania", Kërçovë\n\n` +
                `Prania juaj do ta bëjë këtë ditë edhe më të veçantë për ne.\n\n` +
                `👉 Hap ftesën: ${pageUrl}\n\n` +
                `Me dashuri,\nUrim & Malisa 💕`
            );
            const waUrl = `https://wa.me/?text=${fullMessage}`;
            window.open(waUrl, '_blank');
        }
    });

    // ==========================================
    // CLEANUP
    // ==========================================
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animId);
        if (burstActive) cancelAnimationFrame(burstAnimId);
    });

});
