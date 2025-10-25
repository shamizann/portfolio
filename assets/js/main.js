
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
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const nameField = document.getElementById('fullName');
  const emailField = document.getElementById('email');
  const phoneField = document.getElementById('phone');
  const companyField = document.getElementById('company');
  const industryField = document.getElementById('industry');
  const purposeField = document.getElementById('purpose');
  const subjectField = document.getElementById('subject');
  const messageField = document.getElementById('message');
  const fileUploadField = document.getElementById('fileUpload');
  const subscribeField = document.getElementById('subscribe');

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Phone validation regex (optional, allows various formats)
  const phoneRegex = /^[0-9+\-\s()]{7,}$/;

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
  [nameField, emailField, phoneField, companyField, industryField, purposeField, subjectField, messageField].forEach(field => {
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
    
    // Get all form values
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const phone = phoneField ? phoneField.value.trim() : '';
    const company = companyField ? companyField.value.trim() : '';
    const industry = industryField ? industryField.value : '';
    const purpose = purposeField.value;
    const subject = subjectField.value.trim();
    const message = messageField.value.trim();
    const interests = Array.from(contactForm.querySelectorAll('input[name="interest"]:checked')).map(cb => cb.value);
    const contactMethod = contactForm.querySelector('input[name="contactMethod"]:checked')?.value || '';
    const fileName = fileUploadField && fileUploadField.files.length ? fileUploadField.files[0].name : '';
    const subscribe = subscribeField ? subscribeField.checked : false;
    
    // Comprehensive validation
    const errors = [];
    
    if (!name) errors.push("Full Name is required.");
    if (!email || !emailRegex.test(email)) errors.push("A valid Email Address is required.");
    if (!subject) errors.push("Subject is required.");
    if (!message) errors.push("Message is required.");
    if (interests.length === 0) errors.push("Please choose at least one Area of Interest.");
    if (!purpose) errors.push("Please select a Purpose of Contact.");
    if (!contactMethod) errors.push("Please choose a Preferred Contact Method.");
    if (phone && !phoneRegex.test(phone)) errors.push("Phone format looks invalid.");
    
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

    if (errors.length) {
      // Show validation errors in modal
      const html = `<p>Please fix the following before submitting:</p><ul class="modal-list">${errors.map(err => `<li>• ${err}</li>`).join('')}</ul>`;
      showModal('Please correct the form', html);
      
      // Scroll to first error field
      const firstError = contactForm.querySelector('.error') || contactForm.querySelector('input:invalid, textarea:invalid, select:invalid');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // All valid: Display results on page
    const out = document.getElementById('submittedData');
    out.style.display = 'block';
    out.innerHTML = `
      <h3>Submitted Details</h3>
      <ul>
        <li><strong>Full Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
        ${company ? `<li><strong>Company:</strong> ${company}</li>` : ''}
        ${industry ? `<li><strong>Industry:</strong> ${industry}</li>` : ''}
        <li><strong>Areas of Interest:</strong> ${interests.join(', ')}</li>
        <li><strong>Preferred Contact:</strong> ${contactMethod}</li>
        <li><strong>Purpose:</strong> ${purpose}</li>
        <li><strong>Subject:</strong> ${subject}</li>
        <li><strong>Message:</strong> ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>
        ${fileName ? `<li><strong>Attached File:</strong> ${fileName}</li>` : ''}
        <li><strong>Subscribed:</strong> ${subscribe ? 'Yes' : 'No'}</li>
      </ul>
    `;
    out.scrollIntoView({ behavior: 'smooth' });
  });
}
