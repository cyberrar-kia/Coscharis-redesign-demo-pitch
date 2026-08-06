// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.textContent = navLinks.classList.contains('open') ? '\u2715' : '\u2630';
  });
}

// Mobile dropdown accordion (tap to expand on small screens)
document.querySelectorAll('.nav-item').forEach((item) => {
  const link = item.querySelector(':scope > a');
  const dd = item.querySelector('.dropdown');
  if (dd && link) {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  }
});

// Contact form -> mailto handoff (static site, no backend)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const phone = data.get('phone') || '';
    const subsidiary = data.get('subsidiary') || 'Coscharis Group';
    const message = data.get('message') || '';
    const subject = encodeURIComponent(`Website enquiry — ${subsidiary}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubsidiary: ${subsidiary}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:info@coscharisgroup.net?subject=${subject}&body=${body}`;
  });
}

// Hero / subhero image carousel — crossfades between multiple real photos,
// matching the rotating slider on the client's live site.
document.querySelectorAll('.hero, .subhero').forEach((heroEl) => {
  const slides = heroEl.querySelectorAll('.hero-slide');
  const dots = heroEl.querySelectorAll('.hero-dot');
  if (slides.length < 2) return;
  let idx = 0;
  const advance = (to) => {
    slides[idx].classList.remove('active');
    if (dots[idx]) dots[idx].classList.remove('active');
    idx = to !== undefined ? to : (idx + 1) % slides.length;
    slides[idx].classList.add('active');
    if (dots[idx]) dots[idx].classList.add('active');
  };
  let timer = setInterval(() => advance(), 5500);
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      advance(i);
      timer = setInterval(() => advance(), 5500);
    });
  });
});

// Button ripple + press feedback — makes buttons feel responsive/alive
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

// Count-up animation for stat figures and press dates — triggers once when
// the element scrolls into view. Skips non-numeric labels (e.g. "Ikeja")
// and leaves any suffix (e.g. "nd", " m²") untouched.
function animateCount(el) {
  let targetNode = null;
  if (el.childNodes.length === 1 && el.firstChild.nodeType === 1) {
    targetNode = el.firstChild;
  } else if (el.firstChild && el.firstChild.nodeType === 3) {
    targetNode = el.firstChild;
  }
  if (!targetNode) return;
  const raw = targetNode.textContent.trim();
  const match = raw.match(/^([\d,]+)/);
  if (!match) return;
  const digits = match[1];
  const rest = raw.slice(digits.length);
  const target = parseInt(digits.replace(/,/g, ''), 10);
  const hasComma = digits.includes(',');
  const duration = 1300;
  const startTime = performance.now();
  function tick(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const current = Math.round(target * eased);
    targetNode.textContent = (hasComma ? current.toLocaleString('en-US') : String(current)) + rest;
    if (p < 1) requestAnimationFrame(tick);
    else targetNode.textContent = digits + rest;
  }
  requestAnimationFrame(tick);
}
const countIo = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      animateCount(entry.target);
      countIo.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-cell .num, .press-row .p-date').forEach((el) => countIo.observe(el));

// Active ledger item highlight based on current path
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.ledger-item[data-page]').forEach((item) => {
    if (item.getAttribute('data-page') === path) item.classList.add('is-active');
  });
})();
