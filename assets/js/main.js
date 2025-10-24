
// Mobile nav - Fixed
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('mobile-open');
    
    if (isOpen) {
      nav.classList.remove('mobile-open');
      navToggle.setAttribute('aria-expanded', 'false');
    } else {
      nav.classList.add('mobile-open');
      navToggle.setAttribute('aria-expanded', 'true');
    }
  });
  
  // Close nav when clicking a link (smooth UX)
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Theme toggle - Simple Dark/Light Mode
const themeBtn = document.getElementById('theme-toggle');

function setTheme(mode) {
  if (mode === 'light') {
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.remove('light');
  }
  
  // Update button icon and aria-label
  if (themeBtn) {
    const icon = mode === 'light' ? '☀️' : '🌙';
    const label = mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    themeBtn.textContent = icon;
    themeBtn.setAttribute('aria-label', label);
  }
  
  localStorage.setItem('theme', mode);
}

if (themeBtn) {
  // Initialize theme - default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
  
  // Handle theme toggle click - switch between light and dark
  themeBtn.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });
}

document.getElementById('year').textContent = new Date().getFullYear();

// Nav current page highlighting
(function(){
  const links = document.querySelectorAll('.site-nav a');
  links.forEach(a => {
    const path = location.pathname.split('/').pop() || 'index.html';
    const href = a.getAttribute('href');
    if(href === path){ a.setAttribute('aria-current', 'page'); }
  });
})();

// Animate skill bars
window.addEventListener('load', () => {
  document.querySelectorAll('.skill .bar').forEach(bar => {
    const level = bar.getAttribute('data-level') || 0;
    requestAnimationFrame(() => {
      bar.style.setProperty('--w', level + '%');
      bar.animate([{width:'0%'},{width:level+'%'}], {duration:900,fill:'forwards',easing:'ease-out'});
      bar.style.position='relative';
      const fill = document.createElement('span');
      fill.style.position='absolute';
      fill.style.left='0'; fill.style.top='0'; fill.style.bottom='0';
      fill.style.width=level+'%';
      fill.style.background='linear-gradient(135deg,#7c3aed,#22d3ee)';
      bar.appendChild(fill);
    });
  });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const subjectField = document.getElementById('subject');
  const messageField = document.getElementById('message');

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to show error message
  function showError(field, message) {
    // Remove existing error if any
    clearError(field);
    
    // Add error class to field
    field.classList.add('error');
    
    // Create and insert error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
  }

  // Function to clear error message
  function clearError(field) {
    field.classList.remove('error');
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  // Validate individual field
  function validateField(field) {
    const value = field.value.trim();
    
    if (!value) {
      showError(field, 'This field is required.');
      return false;
    }
    
    // Additional email validation
    if (field.type === 'email' && !emailRegex.test(value)) {
      showError(field, 'Please enter a valid email address (e.g., name@example.com).');
      return false;
    }
    
    clearError(field);
    return true;
  }

  // Real-time validation on blur
  [nameField, emailField, subjectField, messageField].forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        validateField(field);
      }
    });
  });

  // Form submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateField(nameField);
    const isEmailValid = validateField(emailField);
    const isSubjectValid = validateField(subjectField);
    const isMessageValid = validateField(messageField);
    
    // If any field is invalid, show a validation modal listing the problems
    const invalids = [];
    function getFieldLabel(field){
      const map = { name: 'Full name', email: 'Email', subject: 'Subject', message: 'Message' };
      return map[field.name] || field.name;
    }
    function getFieldErrorMsg(field){
      const v = field.value.trim();
      if (!v) return `${getFieldLabel(field)} is required.`;
      if (field.type === 'email' && !emailRegex.test(v)) return 'Please enter a valid email address (e.g., name@example.com).';
      return null;
    }

    [nameField, emailField, subjectField, messageField].forEach(f => {
      const msg = getFieldErrorMsg(f);
      if (msg) invalids.push(msg);
    });

    // Modal utilities
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = modal.querySelector('.modal-close');

    function showModal(title, html){
      modalTitle.textContent = title;
      modalBody.innerHTML = html;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      // trap scroll
      document.body.style.overflow = 'hidden';
      // focus close button for accessibility
      modalClose.focus();
    }
    function hideModal(){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    }

    // modal close handlers
    modalClose.addEventListener('click', hideModal);
    modal.addEventListener('click', (ev) => {
      if (ev.target === modal) hideModal();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && modal.classList.contains('open')) hideModal();
    });

    if (invalids.length) {
      // Focus and scroll to first invalid field
      const firstError = contactForm.querySelector('.error') || contactForm.querySelector('input:invalid, textarea:invalid');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Build simple list HTML
      const html = `<p>Please fix the following before submitting:</p><ul class="modal-list">${invalids.map(i => `<li>• ${i}</li>`).join('')}</ul>`;
      showModal('Please correct the form', html);
      return;
    }

    // All valid: show submission in centered modal
    const entries = [
      ['Full name', nameField.value.trim()],
      ['Email', emailField.value.trim()],
      ['Subject', subjectField.value.trim()],
      ['Message', messageField.value.trim()]
    ];
    const listHtml = `<ul class="modal-list">${entries.map(([k,v]) => `<li><div class="mkey">${k}:</div><div class="mval">${v || '-'}</div></li>`).join('')}</ul>`;
    const when = `<div style="color:var(--muted);font-size:0.9rem;margin-bottom:.5rem">${new Date().toLocaleString()}</div>`;
    const jsonPre = `<pre>${JSON.stringify({name:nameField.value.trim(),email:emailField.value.trim(),subject:subjectField.value.trim(),message:messageField.value.trim(),submittedAt:new Date().toISOString()},null,2)}</pre>`;

    showModal('Submission received', when + listHtml + jsonPre);

    // Optionally reset the form after showing modal (leave commented to keep values):
    // contactForm.reset();
  });
}
