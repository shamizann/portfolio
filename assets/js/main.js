
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
  const phoneField = document.getElementById('phone');
  const companyField = document.getElementById('company');
  const industryField = document.getElementById('industry');
  const purposeField = document.getElementById('purpose');
  const messageField = document.getElementById('message');
  const fileUploadField = document.getElementById('fileUpload');
  const subscribeField = document.getElementById('subscribe');

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Phone validation regex (optional, allows various formats)
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;

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
    
    // Skip validation for non-required fields if empty
    if (!field.required && !value) {
      clearError(field);
      return true;
    }
    
    if (field.required && !value) {
      showError(field, 'This field is required.');
      return false;
    }
    
    // Additional email validation
    if (field.type === 'email' && !emailRegex.test(value)) {
      showError(field, 'Please enter a valid email address (e.g., name@example.com).');
      return false;
    }
    
    // Phone validation (only if a value is entered)
    if (field.type === 'tel' && value && !phoneRegex.test(value)) {
      showError(field, 'Please enter a valid phone number.');
      return false;
    }
    
    clearError(field);
    return true;
  }

  // Real-time validation on blur
  [nameField, emailField, phoneField, companyField, industryField, purposeField, messageField].forEach(field => {
    if (field) {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          validateField(field);
        }
      });
    }
  });

  // Form submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const isNameValid = validateField(nameField);
    const isEmailValid = validateField(emailField);
    const isPurposeValid = validateField(purposeField);
    const isMessageValid = validateField(messageField);
    
    // Validate optional phone if present
    let isPhoneValid = true;
    if (phoneField && phoneField.value.trim()) {
      isPhoneValid = validateField(phoneField);
    }
    
    // Helper to get field label
    function getFieldLabel(field){
      const map = { 
        name: 'Full Name', 
        email: 'Email Address', 
        phone: 'Phone Number',
        company: 'Organization / Company',
        industry: 'Industry Field',
        purpose: 'Purpose of Contact',
        message: 'Message'
      };
      return map[field.name] || field.name;
    }
    
    // Helper to get field error message
    function getFieldErrorMsg(field){
      const v = field.value.trim();
      if (field.required && !v) return `${getFieldLabel(field)} is required.`;
      if (field.type === 'email' && !emailRegex.test(v)) return 'Please enter a valid email address (e.g., name@example.com).';
      if (field.type === 'tel' && v && !phoneRegex.test(v)) return 'Please enter a valid phone number.';
      return null;
    }

    // Collect all validation errors
    const invalids = [];
    [nameField, emailField, phoneField, purposeField, messageField].forEach(f => {
      if (f) {
        const msg = getFieldErrorMsg(f);
        if (msg) invalids.push(msg);
      }
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
      document.body.style.overflow = 'hidden';
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
      const firstError = contactForm.querySelector('.error') || contactForm.querySelector('input:invalid, textarea:invalid, select:invalid');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      const html = `<p>Please fix the following before submitting:</p><ul class="modal-list">${invalids.map(i => `<li>• ${i}</li>`).join('')}</ul>`;
      showModal('Please correct the form', html);
      return;
    }

    // Gather all form data for submission display
    const formData = {
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      phone: phoneField ? phoneField.value.trim() : '',
      company: companyField ? companyField.value.trim() : '',
      industry: industryField ? industryField.value : '',
      interests: Array.from(contactForm.querySelectorAll('input[name="interest"]:checked')).map(cb => cb.value),
      contactMethod: contactForm.querySelector('input[name="contactMethod"]:checked')?.value || '',
      purpose: purposeField.value,
      message: messageField.value.trim(),
      fileName: fileUploadField && fileUploadField.files.length ? fileUploadField.files[0].name : '',
      subscribe: subscribeField ? subscribeField.checked : false,
      submittedAt: new Date().toISOString()
    };

    // Build display list for modal
    const entries = [
      ['Full Name', formData.name],
      ['Email', formData.email],
      ['Phone', formData.phone || '-'],
      ['Company', formData.company || '-'],
      ['Industry', formData.industry || '-'],
      ['Interests', formData.interests.length ? formData.interests.join(', ') : '-'],
      ['Contact Method', formData.contactMethod],
      ['Purpose', formData.purpose],
      ['Message', formData.message],
      ['Attached File', formData.fileName || '-'],
      ['Subscribe to Updates', formData.subscribe ? 'Yes' : 'No']
    ];
    
    const listHtml = `<ul class="modal-list">${entries.map(([k,v]) => `<li><div class="mkey">${k}:</div><div class="mval">${v}</div></li>`).join('')}</ul>`;
    const when = `<div style="color:var(--muted);font-size:0.9rem;margin-bottom:.5rem">${new Date().toLocaleString()}</div>`;
    const jsonPre = `<pre>${JSON.stringify(formData,null,2)}</pre>`;

    showModal('Submission received', when + listHtml + jsonPre);

    // Optionally reset the form after showing modal (leave commented to keep values):
    // contactForm.reset();
  });
}
