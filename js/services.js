/* ============================================================
   VISION ACE – Services Page JavaScript
   js/services.js
   ============================================================ */

'use strict';

/* ---------- SERVICES TAB NAV → SMOOTH SCROLL ---------- */
(function initServiceTabs() {
  const tabs = document.querySelectorAll('.stab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      const target   = document.getElementById(targetId);

      // Update active state
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (target) {
        const offset = 90; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* Highlight tab on scroll */
  const serviceIds = ['exams','lasik','cataract','glaucoma','pediatric','retina','contacts','cornea'];
  const sections   = serviceIds.map(id => document.getElementById(id)).filter(Boolean);

  function onScroll() {
    let active = null;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 140) active = sec.id;
    });
    if (active) {
      tabs.forEach(t => {
        t.classList.toggle('active', t.dataset.target === active);
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
