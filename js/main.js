/* =====================================================
   MD. Mursalin Kabir — Portfolio
   main.js  |  Interactions & Animations
   ===================================================== */

/* ======================================================
   1. AOS INITIALIZATION
====================================================== */
AOS.init({
    duration: 800,
    once: true,
    offset: 70,
    easing: 'ease-out-cubic'
});

/* ======================================================
   2. NAVBAR — scroll behaviour & active link
====================================================== */
const mainNav = document.getElementById('mainNav');

function onScroll() {
    /* Shrink navbar */
    mainNav.classList.toggle('scrolled', window.scrollY > 60);

    /* Back-to-top visibility */
    document.getElementById('backTop')
        .classList.toggle('show', window.scrollY > 400);

    /* Active nav link */
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${current}`);
    });
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ======================================================
   3. SMOOTH ANCHOR SCROLL
====================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        /* Close mobile nav if open */
        const navCollapse = document.getElementById('navbarNav');
        if (navCollapse.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
    });
});

/* ======================================================
   4. BACK TO TOP BUTTON
====================================================== */
document.getElementById('backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ======================================================
   5. TYPEWRITER EFFECT
====================================================== */
const typeEl = document.getElementById('typewriter');
const words  = [
    'Agricultural Economist',
    'Research Scholar',
    'Agribusiness Graduate',
    'Content Writer',
    'Aspiring MBA Candidate',
    'Environmental Economist',
    'Community Leader'
];

let wordIdx  = 0;
let charIdx  = 0;
let deleting = false;

function typeWriter() {
    const word  = words[wordIdx];
    const shown = word.substring(0, charIdx);
    typeEl.textContent = shown;

    let delay = deleting ? 48 : 95;

    if (!deleting && charIdx === word.length) {
        delay    = 2200;
        deleting = true;
    } else if (deleting && charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        delay    = 350;
    }

    charIdx += deleting ? -1 : 1;
    setTimeout(typeWriter, delay);
}

typeWriter();

/* ======================================================
   6. LEAF + WHEAT PARTICLE CANVAS
====================================================== */
const canvas = document.getElementById('leafCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

class Particle {
    constructor(startY) {
        this.init(startY);
    }

    init(startY) {
        this.x            = Math.random() * canvas.width;
        this.y            = startY !== undefined ? startY : -20;
        this.size         = Math.random() * 13 + 6;
        this.speed        = Math.random() * 0.9 + 0.4;
        this.angle        = Math.random() * Math.PI * 2;
        this.rotSpeed     = (Math.random() - 0.5) * 0.035;
        this.swayAmp      = Math.random() * 0.025 + 0.008;
        this.swayOffset   = Math.random() * Math.PI * 2;
        this.opacity      = Math.random() * 0.28 + 0.08;
        /* Gold wheat or green leaf */
        this.isWheat      = Math.random() > 0.55;
        this.color        = this.isWheat
            ? `rgba(212,168,75,${this.opacity})`
            : `rgba(45,134,83,${this.opacity})`;
    }

    update() {
        this.y    += this.speed;
        this.x    += Math.sin(this.y * this.swayAmp + this.swayOffset) * 0.9;
        this.angle += this.rotSpeed;

        if (this.y > canvas.height + 30) this.init();
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;

        if (this.isWheat) {
            /* Wheat grain oval */
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 0.35, this.size * 0.65, 0, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            /* Awn (bristle) */
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 0.65);
            ctx.lineTo(0, -this.size * 1.2);
            ctx.strokeStyle = `rgba(212,168,75,${this.opacity * 0.7})`;
            ctx.lineWidth   = 0.7;
            ctx.stroke();
        } else {
            /* Leaf oval */
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 0.5);
            ctx.bezierCurveTo(
                 this.size * 0.35, -this.size * 0.25,
                 this.size * 0.35,  this.size * 0.25,
                 0,                  this.size * 0.5
            );
            ctx.bezierCurveTo(
                -this.size * 0.35,  this.size * 0.25,
                -this.size * 0.35, -this.size * 0.25,
                 0,                 -this.size * 0.5
            );
            ctx.fillStyle = this.color;
            ctx.fill();
            /* Midrib */
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 0.48);
            ctx.lineTo(0,  this.size * 0.48);
            ctx.strokeStyle = `rgba(255,255,255,0.3)`;
            ctx.lineWidth   = 0.6;
            ctx.stroke();
        }

        ctx.restore();
    }
}

/* Initialise 35 particles, spread across full height */
const particles = Array.from(
    { length: 35 },
    (_, i) => new Particle(Math.random() * canvas.height)
);

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}

animateParticles();

/* ======================================================
   7. SKILL BAR ANIMATION (Intersection Observer)
====================================================== */
const skillSection = document.getElementById('skills');

function animateBars() {
    document.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
    });
}

if (skillSection) {
    const skillObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateBars();
            skillObs.unobserve(skillSection);
        }
    }, { threshold: 0.25 });
    skillObs.observe(skillSection);
}

/* ======================================================
   8. COUNTER ANIMATION (Intersection Observer)
====================================================== */
function animateCounter(el, target, decimals) {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const tick = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(tick);
        }
        el.textContent = decimals > 0
            ? current.toFixed(decimals)
            : Math.floor(current);
    }, 16);
}

const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el       = entry.target;
        const target   = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || 0);
        animateCounter(el, target, decimals);
        counterObs.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ======================================================
   9. CONTACT FORM — simple feedback
====================================================== */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* Visual feedback */
        submitBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #0D5C2E, #1B8F50)';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i>Send Message';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            form.reset();
        }, 3200);
    });
}

/* ======================================================
   10. STAT CARDS — subtle hover shimmer
====================================================== */
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.background = 'linear-gradient(135deg, #fff 60%, rgba(27,94,59,0.04))';
    });
    card.addEventListener('mouseleave', () => {
        card.style.background = '';
    });
});

/* ======================================================
   11. MOBILE NAV — close on link click
====================================================== */
document.querySelectorAll('#navbarNav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const collapse = document.getElementById('navbarNav');
        if (collapse.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
    });
});
