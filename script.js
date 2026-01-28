// ============================================
// TEDx Event Website - ReactBits-Style Effects
// ============================================

// ============================================
// 1. PARTICLE CANVAS BACKGROUND (Star Field)
// ============================================
class ParticleCanvas {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.mouse = { x: null, y: null };

        this.init();
        this.animate();
        this.setupEvents();
    }

    init() {
        this.resize();
        this.particles = [];

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEvents() {
        window.addEventListener('resize', () => this.resize());

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            if (this.mouse.x !== null) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.x += dx * force * 0.03;
                    particle.y += dy * force * 0.03;
                }
            }

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(230, 43, 30, ${particle.opacity})`;
            this.ctx.fill();

            this.particles.slice(index + 1).forEach(other => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(230, 43, 30, ${0.1 * (1 - distance / 120)})`;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// 3. TEXT SCRAMBLE EFFECT
// ============================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => (this.resolve = resolve));
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

function initTextScramble() {
    const el = document.querySelector('.scramble-text');
    if (!el) return;

    const phrases = [
        'Innovate. Inspire. Transform.',
        'Think Different. Act Bold.',
        'Ideas That Change Worlds.',
        'Dare To Dream Big.'
    ];

    const fx = new TextScramble(el);
    let counter = 0;

    const next = () => {
        fx.setText(phrases[counter]).then(() => {
            setTimeout(next, 3000);
        });
        counter = (counter + 1) % phrases.length;
    };

    setTimeout(next, 500);
}

// ============================================
// 4. MAGNETIC BUTTON EFFECT
// ============================================
class MagneticButton {
    constructor(el) {
        this.el = el;
        this.boundingRect = null;
        this.setupEvents();
    }

    setupEvents() {
        this.el.addEventListener('mouseenter', () => {
            this.boundingRect = this.el.getBoundingClientRect();
        });

        this.el.addEventListener('mousemove', (e) => {
            if (!this.boundingRect) return;

            const x = e.clientX - this.boundingRect.left - this.boundingRect.width / 2;
            const y = e.clientY - this.boundingRect.top - this.boundingRect.height / 2;

            this.el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        this.el.addEventListener('mouseleave', () => {
            this.el.style.transform = 'translate(0, 0)';
        });
    }
}

// ============================================
// 5. RIPPLE BUTTON EFFECT
// ============================================
function initRippleEffect() {
    document.querySelectorAll('.register-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ============================================
// 6. 3D TILT CARD EFFECT
// ============================================
class TiltCard {
    constructor(el) {
        this.el = el;
        this.boundingRect = null;
        this.setupEvents();
    }

    setupEvents() {
        this.el.addEventListener('mouseenter', () => {
            this.boundingRect = this.el.getBoundingClientRect();
        });

        this.el.addEventListener('mousemove', (e) => {
            if (!this.boundingRect) return;

            const x = e.clientX - this.boundingRect.left;
            const y = e.clientY - this.boundingRect.top;

            const centerX = this.boundingRect.width / 2;
            const centerY = this.boundingRect.height / 2;

            this.el.style.setProperty('--rotateX', `${-(y - centerY) / 10}deg`);
            this.el.style.setProperty('--rotateY', `${(centerX - x) / 10}deg`);
        });

        this.el.addEventListener('mouseleave', () => {
            this.el.style.setProperty('--rotateX', '0deg');
            this.el.style.setProperty('--rotateY', '0deg');
        });
    }
}

// ============================================
// 7. ANIMATED COUNTERS
// ============================================
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.dataset.count));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased);

        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }

    requestAnimationFrame(update);
}

// ============================================
// 8. SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(
        '.section-header, .about-text, .stat-card, .speaker-card, .cta-content'
    ).forEach(el => observer.observe(el));
}

// ============================================
// 9. NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        navbar.style.background =
            window.scrollY > 100 ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.8)';
    });
}

// ============================================
// 10. PARALLAX ORBS
// ============================================
function initParallaxOrbs() {
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.gradient-orb').forEach((orb, i) => {
            orb.style.transform = `translateY(${window.scrollY * (i + 1) * 0.05}px)`;
        });
    });
}

// ============================================
// 11. SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href'))?.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// ============================================
// 12. SPEAKER MODAL SYSTEM
// ============================================
/* speakerData + initSpeakerModal
   (UNCHANGED from your version — keep it exactly as you had it)
*/

// ============================================
// INITIALIZE EVERYTHING (ONE PLACE ONLY)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new ParticleCanvas();
    initTextScramble();

    document.querySelectorAll('.nav-register-btn, .register-btn')
        .forEach(btn => new MagneticButton(btn));

    initRippleEffect();

    document.querySelectorAll('.tilt-card')
        .forEach(card => new TiltCard(card));

    initAnimatedCounters();
    initScrollAnimations();
    initNavbarScroll();
    initParallaxOrbs();
    initSmoothScroll();
    initSpeakerModal();

    console.log('%c TEDx Event', 'color:#e62b1e;font-size:24px;font-weight:bold;');
});
