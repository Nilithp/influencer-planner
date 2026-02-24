/**
 * nav.js — Mobile menu toggle + active page highlight
 */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile hamburger toggle
  const hamburger = document.querySelector('.nav-hamburger');
  const links = document.querySelector('.nav-links');
  if (hamburger && links) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      links.classList.toggle('open');
    });
    // Close menu when link clicked
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  // Active page highlight
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Accordion behavior
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      item.classList.toggle('open');
    });
  });

  // Tab behavior
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabGroup = btn.closest('.tabs').getAttribute('data-tabs');
      const target = btn.getAttribute('data-tab');
      // Deactivate siblings
      document.querySelectorAll(`.tabs[data-tabs="${tabGroup}"] .tab-btn`).forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`.tab-panel[data-tabs="${tabGroup}"]`).forEach(p => p.classList.remove('active'));
      // Activate
      btn.classList.add('active');
      document.querySelector(`.tab-panel[data-tabs="${tabGroup}"][data-tab="${target}"]`)?.classList.add('active');
    });
  });
});
