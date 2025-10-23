
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
    
    // If all fields are valid
    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
      // Success message
      alert('Thank you! Your message has been sent successfully.\n\n(Note: This is a demo. In production, this would send to a server.)');
      
      // Optional: Clear the form
      contactForm.reset();
    } else {
      // Scroll to first error
      const firstError = contactForm.querySelector('.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}
