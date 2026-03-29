/* ============================================================
   N² RESTAURANT — GLOBAL JS (main.js)
============================================================ */

/* 1. PAGE LOADER */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hide');
    document.getElementById('hero')?.classList.add('loaded');
  }, 1800);
});

/* 2. CUSTOM CURSOR */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

(function animateCursor() {
  if (cursorDot)  { cursorDot.style.left  = mouseX + 'px'; cursorDot.style.top  = mouseY + 'px'; }
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) { cursorRing.style.left = ringX + 'px';  cursorRing.style.top = ringY + 'px';  }
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a,button,.dish-card,.swatch,input,textarea,select,[data-hover]')
  .forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing?.classList.add('hov'));
    el.addEventListener('mouseleave', () => cursorRing?.classList.remove('hov'));
  });
document.addEventListener('mousedown', () => cursorRing?.classList.add('clicking'));
document.addEventListener('mouseup',   () => cursorRing?.classList.remove('clicking'));
if ('ontouchstart' in window) {
  if (cursorDot)  cursorDot.style.display  = 'none';
  if (cursorRing) cursorRing.style.display = 'none';
  document.body.style.cursor = 'auto';
}

/* 3. RIPPLE */
document.addEventListener('click', e => {
  const r = document.createElement('div');
  r.className = 'ripple-burst';
  r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
});

function addButtonRipple(btn) {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const r = document.createElement('span');
    r.className = 'ripple-btn';
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left}px;top:${e.clientY-rect.top}px`;
    this.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
}
document.querySelectorAll('.btn,.btn-primary,.btn-outline,.btn-cta,.nav-cta').forEach(addButtonRipple);
window.addButtonRipple = addButtonRipple;

/* 4. SCROLL PROGRESS */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  if (!progressBar) return;
  progressBar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
});

/* 5. NAVBAR */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 60));

/* 6. MOBILE MENU */
const hamburger = document.getElementById('hamburger');
const mobNav    = document.getElementById('mob-nav');
if (hamburger && mobNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobNav.classList.toggle('open');
    document.body.style.overflow = mobNav.classList.contains('open') ? 'hidden' : '';
  });
  mobNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    hamburger.classList.remove('open'); mobNav.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* 7. SCROLL REVEAL */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); revObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.rev,.rev-left,.rev-right,.rev-scale,.rev-blur').forEach(el => revObs.observe(el));

/* 8. PAGE TRANSITION */
const pageTrans = document.getElementById('page-trans');
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http') || href.startsWith('//')) return;
  link.addEventListener('click', function(e) {
    e.preventDefault();
    pageTrans?.classList.add('in');
    setTimeout(() => window.location.href = href, 480);
  });
});
window.addEventListener('pageshow', () => {
  if (!pageTrans) return;
  pageTrans.classList.remove('in'); pageTrans.classList.add('out');
  setTimeout(() => pageTrans.classList.remove('out'), 500);
});

/* 9. THEME SWITCHER */
const themeBtn   = document.getElementById('theme-btn');
const themePanel = document.getElementById('theme-panel');
const swatches   = document.querySelectorAll('.swatch');
const htmlEl     = document.documentElement;

themeBtn?.addEventListener('click', e => { e.stopPropagation(); themePanel?.classList.toggle('open'); });

swatches.forEach(swatch => {
  swatch.addEventListener('click', function() {
    const theme = this.dataset.theme;
    htmlEl.setAttribute('data-theme', theme);
    swatches.forEach(s => s.classList.remove('active'));
    this.classList.add('active');
    localStorage.setItem('n2-theme', theme);
    this.style.transform = 'scale(0.93)';
    setTimeout(() => this.style.transform = '', 180);
    showToast('Theme: ' + theme, 'info');
  });
});

const savedTheme = localStorage.getItem('n2-theme');
if (savedTheme) {
  htmlEl.setAttribute('data-theme', savedTheme);
  swatches.forEach(s => s.classList.toggle('active', s.dataset.theme === savedTheme));
}
document.addEventListener('click', e => {
  if (themePanel && !themePanel.contains(e.target) && e.target !== themeBtn) themePanel.classList.remove('open');
});

/* 10. SCROLL TO TOP */
const scrollTopBtn = document.getElementById('scroll-top-btn');
window.addEventListener('scroll', () => scrollTopBtn?.classList.toggle('show', window.scrollY > 500));
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* 11. TOAST */
function showToast(message, type = 'info', duration = 3000) {
  let c = document.querySelector('.toast-container');
  if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = 'toast ' + type; t.textContent = message;
  c.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, duration);
}
window.showToast = showToast;

/* 12. ACTIVE NAV LINK */
(function() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a,.mob-nav a').forEach(link => {
    const page = link.getAttribute('href')?.split('/').pop() || 'index.html';
    link.classList.toggle('active', page === current);
  });
})();

/* PARALLAX */
window.addEventListener('scroll', () => {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg || window.scrollY >= window.innerHeight) return;
  heroImg.style.transform = `scale(1) translateY(${window.scrollY * 0.18}px)`;
});

/* COUNT-UP */
function countUp(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const suffix = el.dataset.suffix || '';
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + suffix; clearInterval(timer); }
    else { el.textContent = Math.floor(start) + suffix; }
  }, 16);
}
const countUpObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.target);
      if (!isNaN(target)) countUp(e.target, target);
      countUpObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count-up').forEach(el => countUpObs.observe(el));
