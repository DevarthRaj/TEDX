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
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Mouse interaction - gentle nudge when hovered
            if (this.mouse.x != null && this.mouse.y != null) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.x += dx * force * 0.03;
                    particle.y += dy * force * 0.03;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(230, 43, 30, ${particle.opacity})`;
            this.ctx.fill();

            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
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
        const promise = new Promise((resolve) => this.resolve = resolve);
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

        for (let i = 0, n = this.queue.length; i < n; i++) {
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

// Initialize text scramble
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

    // Start after a short delay
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
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

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

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.el.style.setProperty('--rotateX', `${-rotateX}deg`);
            this.el.style.setProperty('--rotateY', `${rotateY}deg`);

            // Update glow position
            const glowEl = this.el.querySelector('.speaker-glow');
            if (glowEl) {
                const percentX = (x / this.boundingRect.width) * 100;
                const percentY = (y / this.boundingRect.height) * 100;
                glowEl.style.setProperty('--mouse-x', `${percentX}%`);
                glowEl.style.setProperty('--mouse-y', `${percentY}%`);
            }
        });

        this.el.addEventListener('mouseleave', () => {
            this.el.style.setProperty('--rotateX', '0deg');
            this.el.style.setProperty('--rotateY', '0deg');
            this.el.style.transform = '';
        });
    }
}

// ============================================
// 7. ANIMATED COUNTER
// ============================================
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);

        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// ============================================
// 8. SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-header, .about-text, .stat-card, .speaker-card, .cta-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// 9. NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// ============================================
// 10. PARALLAX ORB EFFECT
// ============================================
function initParallaxOrbs() {
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const orbs = document.querySelectorAll('.gradient-orb');

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.05;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

// ============================================
// 11. SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// INITIALIZE ALL EFFECTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle background
    new ParticleCanvas();

    // Initialize text scramble
    initTextScramble();

    // Initialize magnetic buttons
    document.querySelectorAll('.nav-register-btn, .register-btn').forEach(btn => {
        new MagneticButton(btn);
    });

    // Initialize ripple effect
    initRippleEffect();

    // Initialize 3D tilt cards
    document.querySelectorAll('.tilt-card').forEach(card => {
        new TiltCard(card);
    });

    // Initialize animated counters
    initAnimatedCounters();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize navbar scroll
    initNavbarScroll();

    // Initialize parallax orbs
    initParallaxOrbs();

    initSmoothScroll();

});


// ============================================
// 12. SPEAKER MODAL SYSTEM (ADD-ON ONLY)
// ============================================

const speakerData = {
    razia: {
        name: "Raiza Salam",
        title: "Filmmaker & Storyteller",
        image: "images/RaziaSalam.jpeg",
        imagePosition: "center 20%",
        bio: `
Raiza Salam is an independent filmmaker and storyteller who finds meaning in moments often left unnoticed. She began creating films at a very young age, and they often feel like miniature movies- intimate and evocative.

She has directed two official music videos, Baaton Baaton Mein and Marap. Her video Moving to Finland won First Place at the Fujifilm Vlog Challenge, organized by India Film Project.

A cancer survivor at the age of 23, Raiza brings narratives to the screen that are profoundly personal and unmistakably unique. Her work reflects resilience, healing, and an intentional appreciation of life’s smallest moments- an ethos that is beautifully woven into her visual storytelling. 

A graduate in design research from Aalto University, specialising in social sustainability and human justice-driven problem solving, she carries these values into her work and writing, using them to inform the stories she chooses to tell.

At TEDxMACE’26, Raiza Salam presents The Missing Narrative, shaped by her own journey of artistic expression- where lived moments slowly find their voice through storytelling.
        `
    },

    amrutha: {
        name: "Amrutha Francis",
        title: "Life Coach & Educator",
        image: "images/AmruthaFrancis.jpeg",
        bio: `
Amrutha Francis is a life coach and educator whose work centres on human connection, self-awareness, and inner clarity. Her journey began in engineering and academia, but listening to people and holding space for their unspoken questions came naturally long before any title.
Motherhood became a turning point, drawing her into the worlds of child development, emotions, relationships, intimacy, and sexuality.

What started as curiosity grew into deep study and a clear shift toward coaching, which she stepped into full-time in 2019.
Today, Amrutha works across life coaching, parenting support, relationship and intimacy guidance, sexuality health education, and behavioural coaching rooted in positive psychology, CBT and somatic awareness. 
Guided by the belief that people already carry their answers within them, she helps individuals and families listen inward and move through change with intention.


        `
    },

    kunjila: {
        name: "Kunjila Mascillamani",
        title: "Filmmaker & Writer",
        image: "images/Kunjilla.jpeg",
        bio: `
Kunjila Mascillamani is an independent filmmaker and writer whose work challenges conventions and foregrounds voices often left unheard. With a strong commitment to authenticity and lived experience, her storytelling reflects a deeply personal yet socially conscious perspective.

Through her films, Kunjila explores themes of identity, resistance, and everyday realities with honesty and courage, carving a distinct space for herself in contemporary Malayalam cinema. Her journey stands as a testament to choosing one’s own voice, embracing discomfort, and telling stories that matter, even when they exist outside the mainstream.

Believing in the power of personal narratives to spark meaningful conversations, she continues to push creative boundaries and redefine how stories are told and received.
        `
    },

    arunima: {
        name: "Arunima Jayan",
        title: "Vanitha Miss Kerala 2025",
        image: "images/Arunima Jayan.jpg",
        bio: `
For Arunima Jayan, the path from writing code to claiming the crown of Miss Kerala 2025 
was not a change of direction, but a masterclass in versatility. A software engineer and a 
professional model, she is a trailblazer in the pageantry world who has consistently defied 
the “either–or” logic. Arunima proves that technical precision and creative grace belong in 
the same room. 

Her victory was more than a personal milestone. It was the culmination of a rigorous journey 
where she emerged as a standout among hundreds. Beyond the titles of Miss Kerala and 
Miss Elegant, Arunima has utilized her platform to bridge the gap between different worlds. 
She shows that leadership is about more than just presence; it is about perspective. 
As the Youth Speaker for TEDxMACE 26, Arunima steps into the circle to represent the 
modern multi-hyphenate. She brings a unique clarity to the stage. She speaks for a 
generation that refuses to be defined by a single label or a traditional career path. 
Arunima’s influence lies in her ability to find the human pulse within structured systems.
 
She stands as a symbol of new-age ambition that is bold, analytical, and deeply aware of the 
stories that often get sidelined in the pursuit of perfection. 
Stepping onto the TEDxMACE’26 stage, Arunima Jayan uncovers 'The Missing Narrative' by 
exploring the silent blueprints of our identity that dictate who we are long before we find the 
language to explain it.
        `
    }
};

function initSpeakerModal() {
    const modal = document.getElementById('speaker-modal');
    if (!modal) return;

    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');

    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-name');
    const modalTitle = document.getElementById('modal-title');
    const modalBio = document.getElementById('modal-bio');

    function openModal(id) {
        const speaker = speakerData[id];
        if (!speaker) return;

        modalImage.src = speaker.image;
        modalImage.alt = speaker.name;
        modalImage.style.objectPosition = speaker.imagePosition || 'center';

        modalName.textContent = speaker.name;
        modalTitle.textContent = speaker.title;

        modalBio.innerHTML = speaker.bio
            .trim()
            .split('\n\n')
            .map(p => `<p>${p}</p>`)
            .join('');

        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('modal-active');
        document.body.style.overflow = '';
    }

    // Speaker card click
    document.querySelectorAll('.speaker-card[data-speaker]').forEach(card => {
        card.addEventListener('click', () => {
            openModal(card.dataset.speaker);
        });
    });

    // Read More button click (prevent card click bubbling)
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.speaker-card');
            openModal(card.dataset.speaker);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}


function initSpeakerModal() {
    const modal = document.getElementById('speaker-modal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-name');
    const modalTitle = document.getElementById('modal-title');
    const modalBio = document.getElementById('modal-bio');

    // Open modal function
    function openModal(speakerId) {
        const speaker = speakerData[speakerId];
        if (!speaker) return;

        modalImage.src = speaker.image;
        modalImage.alt = speaker.name;
        modalImage.style.objectPosition = speaker.imagePosition || 'center';
        modalName.textContent = speaker.name;
        modalTitle.textContent = speaker.title;
        modalBio.innerHTML = speaker.bio.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('');

        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal function
    function closeModal() {
        modal.classList.remove('modal-active');
        document.body.style.overflow = '';
    }

    // Event listeners for speaker cards
    document.querySelectorAll('.speaker-card[data-speaker]').forEach(card => {
        card.style.cursor = 'pointer';

        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the read more button specifically
            if (e.target.classList.contains('read-more-btn')) return;

            const speakerId = card.getAttribute('data-speaker');
            openModal(speakerId);
        });
    });

    // Event listeners for read more buttons
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.speaker-card[data-speaker]');
            const speakerId = card.getAttribute('data-speaker');
            openModal(speakerId);
        });
    });

    // Close modal event listeners
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-active')) {
            closeModal();
        }
    });
}

// ============================================
// INITIALIZE ALL EFFECTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle background
    new ParticleCanvas();

    // Initialize text scramble
    initTextScramble();

    initSpeakerModal();


    // Initialize magnetic buttons
    document.querySelectorAll('.nav-register-btn, .register-btn').forEach(btn => {
        new MagneticButton(btn);
    });

    // Initialize ripple effect
    initRippleEffect();

    // Initialize 3D tilt cards
    document.querySelectorAll('.tilt-card').forEach(card => {
        new TiltCard(card);
    });

    // Initialize animated counters
    initAnimatedCounters();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize navbar scroll
    initNavbarScroll();

    // Initialize parallax orbs
    initParallaxOrbs();

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize speaker modal
    initSpeakerModal();

    // Console Easter egg
    console.log('%c TEDx Event', 'color: #e62b1e; font-size: 24px; font-weight: bold;');
    console.log('%c Ideas Worth Spreading ✨', 'color: #666; font-size: 14px;');
    console.log('%c Built with ReactBits-style effects', 'color: #ff6b5b; font-size: 12px;');
});
