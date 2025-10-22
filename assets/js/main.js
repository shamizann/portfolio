
// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', String(!open));
    navToggle.setAttribute('aria-expanded', String(!open));
    nav.style.display = open ? 'none' : 'block';
  });
}

// Theme toggle
const themeBtn = document.getElementById('theme-toggle');
function setTheme(mode){ 
  if(mode==='light'){ document.documentElement.classList.add('light'); }
  else { document.documentElement.classList.remove('light'); }
  localStorage.setItem('theme', mode);
}
if(themeBtn){
  themeBtn.addEventListener('click', () => {
    const isLight = document.documentElement.classList.contains('light');
    setTheme(isLight ? 'dark' : 'light');
  });
  const saved = localStorage.getItem('theme');
  if(saved){ setTheme(saved); }
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
