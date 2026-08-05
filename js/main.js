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

// Active ledger item highlight based on current path
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.ledger-item[data-page]').forEach((item) => {
    if (item.getAttribute('data-page') === path) item.classList.add('is-active');
  });
})();
