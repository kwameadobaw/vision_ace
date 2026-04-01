/* ============================================================
   VISION ACE – Home Page JavaScript
   js/home.js
   ============================================================ */

'use strict';

/* ---------- TESTIMONIAL CAROUSEL ---------- */
(function initTestimonials() {
  const track  = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');
  const dotsContainer = document.getElementById('tnavDots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;

  // Determine how many cards are visible
  function getVisible() {
    if (window.innerWidth < 680) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  // Create dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    const pages = Math.ceil(total / getVisible());
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'tnav-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to page ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots(page) {
    dotsContainer.querySelectorAll('.tnav-dot').forEach((d, i) => {
      d.classList.toggle('active', i === page);
    });
  }

  function goTo(page) {
    const vis = getVisible();
    const maxPage = Math.ceil(total / vis) - 1;
    page = Math.max(0, Math.min(page, maxPage));
    current = page;

    const cardWidth = cards[0].offsetWidth + 24; // gap = 1.5rem = 24px
    track.style.transform = `translateX(-${page * vis * cardWidth}px)`;
    track.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
    updateDots(page);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto advance
  let autoPlay = setInterval(() => goTo(current + 1), 5000);
  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(autoPlay);
      autoPlay = setInterval(() => goTo(current + 1), 5000);
    });
  });

  // Reset on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      current = 0;
      track.style.transform = 'translateX(0)';
      buildDots();
    }, 200);
  });

  buildDots();
})();


/* ---------- HERO STATS COUNT-UP ---------- */
(function initCountUp() {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  function extractNumber(str) {
    return parseFloat(str.replace(/[^0-9.]/g, ''));
  }

  function animateCount(el, target, suffix, duration = 1800) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease out
      const value = target * ease;
      el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const suffix = text.replace(/[\d.]/g, '');
        const num = extractNumber(text);
        if (!isNaN(num)) animateCount(el, num, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();
