/* ============================================================
   VISION ACE – Contact Page JavaScript
   js/contact.js
   ============================================================ */

'use strict';

/* ---------- CONTACT FORM ENHANCED VALIDATION ---------- */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Live validation
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => clearError(field));
  });

  function validateField(field) {
    const error = field.parentElement.querySelector('.field-error');
    let msg = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
      msg = 'This field is required.';
    } else if (field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      msg = 'Please enter a valid email address.';
    }

    if (msg) {
      field.classList.add('invalid');
      if (error) error.textContent = msg;
      return false;
    }
    field.classList.remove('invalid');
    if (error) error.textContent = '';
    return true;
  }

  function clearError(field) {
    field.classList.remove('invalid');
    const error = field.parentElement.querySelector('.field-error');
    if (error) error.textContent = '';
  }

  form.addEventListener('submit', function (e) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!validateField(field)) valid = false;
    });
    if (!valid) {
      e.preventDefault();
      // Scroll to first error
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Sending…';
        btn.disabled = true;
      }
    }
  });
})();
