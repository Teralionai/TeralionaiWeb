document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Hamburger toggle
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll with accordion auto-open
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (!target) return;

            if (target.classList.contains('accordion-item')) {
                const header = target.querySelector('.accordion-header');
                if (header && !target.classList.contains('active')) {
                    header.click();
                }
            }

            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Accordion
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function () {
            const item = this.closest('.accordion-item');
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.accordion-item').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            });

            // Open clicked (if wasn't active)
            if (!isActive) {
                item.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Auto-open accordion from URL hash
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target && target.classList.contains('accordion-item')) {
            const header = target.querySelector('.accordion-header');
            if (header) header.click();
        }
    }

    // Scroll reveal
    const reveals = document.querySelectorAll(
        '.stat-item, .about-body, .accordion-item, .contact-left, .contact-form, .owl-narrative, .owl-showcase, .owl-adv-card, .owl-flow-section, .owl-cta'
    );

    reveals.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => observer.observe(el));

    // Stagger animations
    document.querySelectorAll('.accordion-item.reveal').forEach((el, i) => {
        el.style.transitionDelay = `${i * 80}ms`;
    });
    document.querySelectorAll('.owl-adv-card.reveal').forEach((el, i) => {
        el.style.transitionDelay = `${i * 100}ms`;
    });

    // Nav background on scroll
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 60) {
            navbar.style.background = '#091e28';
        } else {
            navbar.style.background = '#0d2a38';
        }
    });

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const inputs = this.querySelectorAll('input, textarea');
            let valid = true;

            inputs.forEach(input => {
                if (input.required && !input.value.trim()) valid = false;
            });

            const email = this.querySelector('input[type="email"]');
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) valid = false;

            if (!valid) {
                showToast('請填寫所有必填欄位', 'error');
                return;
            }

            showToast('訊息已發送！我們會盡快回覆您。', 'success');
            this.reset();
        });
    }
});

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '14px 22px',
        borderRadius: '8px',
        color: '#0b1219',
        fontSize: '0.9rem',
        fontWeight: '500',
        fontFamily: "'DM Sans', sans-serif",
        zIndex: '10000',
        transform: 'translateY(-10px)',
        opacity: '0',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: type === 'error' ? '#e85d5d' : '#4ca8be',
        maxWidth: '340px',
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.transform = 'translateY(-10px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
