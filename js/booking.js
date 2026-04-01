/* ============================================================
   VISION ACE – Booking Page JavaScript
   js/booking.js
   ============================================================ */

'use strict';

(function initBookingForm() {
  const form     = document.getElementById('bookingForm');
  if (!form) return;

  const steps    = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
  ];
  const stepIndicators = document.querySelectorAll('.step[data-step]');
  const reviewBox      = document.getElementById('reviewBox');

  // Navigation buttons
  const toStep2   = document.getElementById('toStep2');
  const toStep1   = document.getElementById('toStep1');
  const toStep3   = document.getElementById('toStep3');
  const backToS2  = document.getElementById('backToStep2');

  let currentStep = 0;

  /* ---- SHOW STEP ---- */
  function showStep(index) {
    steps.forEach((s, i) => {
      s.classList.toggle('hidden', i !== index);
    });
    stepIndicators.forEach((ind) => {
      const n = parseInt(ind.dataset.step) - 1;
      ind.classList.toggle('active', n === index);
      ind.classList.toggle('completed', n < index);
    });
    currentStep = index;
    // Scroll to top of form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---- VALIDATE STEP ---- */
  function validateStep(stepEl) {
    let valid = true;
    const requiredFields = stepEl.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      const error = field.parentElement.querySelector('.field-error');
      let msg = '';

      if (!field.value.trim()) {
        msg = 'This field is required.';
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        msg = 'Please enter a valid email address.';
      } else if (field.type === 'tel' && field.value.replace(/[\s\-+()]/g, '').length < 7) {
        msg = 'Please enter a valid phone number.';
      } else if (field.type === 'date') {
        const selected = new Date(field.value);
        const today    = new Date();
        today.setHours(0,0,0,0);
        if (isNaN(selected)) {
          msg = 'Please select a valid date.';
        } else if (selected < today) {
          msg = 'Please select a future date.';
        }
      }

      if (msg) {
        valid = false;
        field.classList.add('invalid');
        if (error) error.textContent = msg;
      } else {
        field.classList.remove('invalid');
        if (error) error.textContent = '';
      }
    });

    return valid;
  }

  /* ---- CLEAR ERRORS ON INPUT ---- */
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('invalid');
      const error = field.parentElement.querySelector('.field-error');
      if (error) error.textContent = '';
    });
    field.addEventListener('change', () => {
      field.classList.remove('invalid');
      const error = field.parentElement.querySelector('.field-error');
      if (error) error.textContent = '';
    });
  });

  /* ---- BUILD REVIEW BOX ---- */
  function buildReview() {
    const data = {};
    new FormData(form).forEach((val, key) => {
      if (!['_subject','_captcha','_template','_next','_honey','Consent'].includes(key)) {
        data[key] = val;
      }
    });

    const section1Keys = ['First Name','Last Name','Email','Phone Number','Date of Birth','Gender','Patient Status'];
    const section2Keys = ['Service Required','Preferred Doctor','Preferred Date','Preferred Time','Preferred Location','Insurance Provider','Reason for Visit'];

    function buildSection(title, keys) {
      let html = `<h4>${title}</h4>`;
      keys.forEach(k => {
        if (data[k]) {
          html += `<div class="review-row">
            <span>${k}</span>
            <span>${data[k]}</span>
          </div>`;
        }
      });
      return html;
    }

    reviewBox.innerHTML =
      buildSection('Personal Information', section1Keys) +
      buildSection('Appointment Details', section2Keys);
  }

  /* ---- STEP NAVIGATION ---- */
  if (toStep2) {
    toStep2.addEventListener('click', () => {
      if (validateStep(steps[0])) showStep(1);
    });
  }
  if (toStep1) {
    toStep1.addEventListener('click', () => showStep(0));
  }
  if (toStep3) {
    toStep3.addEventListener('click', () => {
      if (validateStep(steps[1])) {
        buildReview();
        showStep(2);
      }
    });
  }
  if (backToS2) {
    backToS2.addEventListener('click', () => showStep(1));
  }

  /* ---- SUBMIT HANDLER ---- */
  form.addEventListener('submit', function (e) {
    const consent = document.getElementById('consentCheck');
    const consentError = document.getElementById('consentError');

    if (!consent.checked) {
      e.preventDefault();
      if (consentError) consentError.textContent = 'You must agree to the terms to proceed.';
      return;
    }
    if (consentError) consentError.textContent = '';

    // Visual loading state
    const submitBtn  = document.getElementById('submitBtn');
    const btnText    = submitBtn?.querySelector('.btn-text');
    const btnLoader  = submitBtn?.querySelector('.btn-loader');
    if (btnText && btnLoader) {
      btnText.classList.add('hidden');
      btnLoader.classList.remove('hidden');
      submitBtn.disabled = true;
    }
    // Form submits naturally to FormSubmit
  });

  /* ---- SET MIN DATE TO TODAY ---- */
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  /* ---- PRE-SELECT DOCTOR FROM URL PARAM ---- */
  const urlParams = new URLSearchParams(window.location.search);
  const doctorParam = urlParams.get('doctor');
  if (doctorParam) {
    const doctorMap = {
      mensah:  'Dr. Esi Mensah',
      osei:    'Dr. Kweku Osei',
      asante:  'Dr. Abena Asante',
      boateng: 'Dr. Kofi Boateng',
      agyeman: 'Dr. Efua Agyeman',
      appiah:  'Dr. James Appiah',
    };
    const doctorSelect = document.getElementById('doctor');
    if (doctorSelect && doctorMap[doctorParam]) {
      const options = doctorSelect.querySelectorAll('option');
      options.forEach(opt => {
        if (opt.value === doctorMap[doctorParam]) opt.selected = true;
      });
    }
  }

  /* ---- INIT ---- */
  showStep(0);
})();
