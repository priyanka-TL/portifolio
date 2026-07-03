/* ═══════════════════════════════════════════════════════════════
   PRIYANKA PRADEEP — Portfolio Script
   Features: Typewriter, Scroll Reveal, Counter Animation,
             Custom Cursor, Sticky Nav, Contact Form, Hamburger
═══════════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ── Theme Toggle ───────────────────────────────────────────
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ── Typewriter Effect ──────────────────────────────────────
    const roles = [
        'Websites & Web Apps',
        'AI-Powered Solutions',
        'Backend Systems',
        'Custom Applications',
        'Cloud Infrastructure',
    ];

    const typewriterEl = document.getElementById('typewriter');
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeTimeout;

    function type() {
        const currentRole = roles[roleIdx];
        const displayText = isDeleting
            ? currentRole.substring(0, charIdx - 1)
            : currentRole.substring(0, charIdx + 1);

        typewriterEl.textContent = displayText;

        if (isDeleting) {
            charIdx--;
        } else {
            charIdx++;
        }

        let delay = isDeleting ? 55 : 90;

        if (!isDeleting && charIdx === currentRole.length) {
            // Pause at end of word
            delay = 1800;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            delay = 400;
        }

        typeTimeout = setTimeout(type, delay);
    }

    if (typewriterEl) {
        setTimeout(type, 700);
    }


    // ── Sticky Header ──────────────────────────────────────────
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveNav();
    }, { passive: true });

    // ── Active Nav Links ───────────────────────────────────────
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            const id     = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ── Hamburger Menu ─────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navEl     = document.querySelector('nav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navEl.classList.toggle('open');
        document.body.style.overflow = navEl.classList.contains('open') ? 'hidden' : '';
    });

    // Close on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navEl.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ── Scroll Reveal ──────────────────────────────────────────
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger for multiple items revealed together
                    setTimeout(() => {
                        entry.target.classList.add('in-view');
                    }, i * 80);
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach(el => revealObserver.observe(el));

    // ── Stat Counter Animation ─────────────────────────────────
    // Covers both About stats AND GitHub stat cards
    const statNums = document.querySelectorAll('.stat-num[data-target], .gh-stat-num[data-target]');

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNums.forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target   = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1600;
        const start    = performance.now();

        function step(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }

        requestAnimationFrame(step);
    }

    // ── GitHub Heatmap Generator ───────────────────────────────
    const heatmapEl = document.getElementById('gh-heatmap');

    if (heatmapEl) {
        // Build a pseudo-random but realistic-looking heatmap
        // Seeded so it's always the same layout
        function seededRand(seed) {
            let s = seed;
            return function() {
                s = (s * 16807 + 0) % 2147483647;
                return (s - 1) / 2147483646;
            };
        }

        const rand = seededRand(42);

        // 53 weeks * 7 days = 371 cells
        const WEEKS = 53;
        const DAYS  = 7;
        const totalCells = WEEKS * DAYS;

        // Activity pattern: more active in recent weeks, quiet in Sep-Nov
        function getActivityLevel(weekIdx) {
            const r = rand();
            // Recent weeks (last 20) heavier activity
            if (weekIdx > 33) {
                if (r < 0.15) return 0;
                if (r < 0.28) return 1;
                if (r < 0.50) return 2;
                if (r < 0.73) return 3;
                if (r < 0.88) return 4;
                return 5;
            }
            // Mid period (lighter)
            if (weekIdx > 15 && weekIdx <= 33) {
                if (r < 0.45) return 0;
                if (r < 0.62) return 1;
                if (r < 0.77) return 2;
                if (r < 0.88) return 3;
                if (r < 0.95) return 4;
                return 5;
            }
            // Early period
            if (r < 0.30) return 0;
            if (r < 0.50) return 1;
            if (r < 0.68) return 2;
            if (r < 0.82) return 3;
            if (r < 0.92) return 4;
            return 5;
        }

        const fragment = document.createDocumentFragment();

        for (let week = 0; week < WEEKS; week++) {
            for (let day = 0; day < DAYS; day++) {
                const cell  = document.createElement('div');
                const level = getActivityLevel(week);
                cell.className = 'gh-cell';
                if (level > 0) {
                    cell.setAttribute('data-level', level);
                }
                fragment.appendChild(cell);
            }
        }

        heatmapEl.appendChild(fragment);
    }

    // ── Contact Form ───────────────────────────────────────────
    const form     = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name    = document.getElementById('form-name').value.trim();
            const email   = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject')?.value.trim() || '';
            const message = document.getElementById('form-message').value.trim();

            // Validation
            feedback.className = 'form-feedback';
            feedback.textContent = '';

            if (!name || name.length < 2) {
                showFeedback('error', '⚠️ Please enter your name (at least 2 characters).');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showFeedback('error', '⚠️ Please enter a valid email address.');
                return;
            }

            if (!message || message.length < 10) {
                showFeedback('error', '⚠️ Message is too short. Please write at least 10 characters.');
                return;
            }

            // Build mailto
            const mailtoSubject = subject || `Portfolio Enquiry from ${name}`;
            const mailtoBody    = `Name: ${name}\nEmail: ${email}\n\n${message}`;
            const mailtoLink    = `mailto:priyankapratheepan@gmail.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Opening email client... ✉️';

            try {
                window.location.href = mailtoLink;
                setTimeout(() => {
                    showFeedback('success', '✅ Your email client has been opened. Please send the email to complete the message!');
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
                }, 1000);
            } catch {
                showFeedback('error', '❌ Could not open email client. Please email priyankapratheepan@gmail.com directly.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
            }
        });
    }

    function showFeedback(type, message) {
        feedback.textContent   = message;
        feedback.className     = 'form-feedback ' + type;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ── Smooth Anchor Scroll ───────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Glass card spotlight mouse effect ─────────────────────
    document.querySelectorAll('.glass-panel').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width)  * 100;
            const y = ((e.clientY - rect.top)  / rect.height) * 100;
            card.style.setProperty('--glow-x', x + '%');
            card.style.setProperty('--glow-y', y + '%');
        });
    });

});
