/* ============================================================
   VISION ACE EYE ASSOCIATES – Main JavaScript
   js/main.js
   ============================================================ */

'use strict';

/* ---------- NAVBAR SCROLL EFFECT ---------- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
})();


/* ---------- MOBILE MENU ---------- */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();


/* ---------- REVEAL ON SCROLL (Intersection Observer) ---------- */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for siblings
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Add staggered delays to grid children
  document.querySelectorAll(
    '.services-grid, .values-grid, .support-grid, .doctors-grid, .contact-info-grid, .accred-grid'
  ).forEach(grid => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.dataset.delay = i * 80;
    });
  });

  revealEls.forEach(el => observer.observe(el));
})();


/* ---------- FAQ ACCORDION ---------- */
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;

    q.addEventListener('click', () => {
      const isOpen = a.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.querySelector('.faq-q')?.classList.remove('open');
        i.querySelector('.faq-a')?.classList.remove('open');
      });

      // Open clicked if was closed
      if (!isOpen) {
        q.classList.add('open');
        a.classList.add('open');
      }
    });
  });
})();


/* ---------- SMOOTH HASH SCROLL ---------- */
(function initHashScroll() {
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // Only handle same-page hashes
      const url = new URL(href, window.location.href);
      if (url.pathname !== window.location.pathname) return;

      const id = url.hash.slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ---------- ACTIVE NAV LINK (highlight current page) ---------- */
(function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
})();


/* ---------- CONTACT FORM VALIDATION ---------- */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    let valid = true;

    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      const error = field.parentElement.querySelector('.field-error');
      if (!field.value.trim()) {
        field.classList.add('invalid');
        if (error) error.textContent = 'This field is required.';
        valid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        field.classList.add('invalid');
        if (error) error.textContent = 'Please enter a valid email.';
        valid = false;
      } else {
        field.classList.remove('invalid');
        if (error) error.textContent = '';
      }
    });

    if (!valid) e.preventDefault();
  });

  // Clear invalid on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('invalid');
      const error = field.parentElement.querySelector('.field-error');
      if (error) error.textContent = '';
    });
  });
})();
