const sidebar = document.getElementById('sidebar');
const collapseBtn = document.getElementById('collapseBtn');
const submenuToggles = document.querySelectorAll('[data-submenu-toggle]');
const navLinks = document.querySelectorAll('[data-nav]');

collapseBtn.addEventListener('click', () => {
  sidebar.classList.toggle('is-collapsed');
});

submenuToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    if (sidebar.classList.contains('is-collapsed')) {
      sidebar.classList.remove('is-collapsed');
    }
    const group = toggle.closest('.nav-group');
    const isOpen = group.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
});

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach((l) => l.classList.remove('is-active'));
    link.classList.add('is-active');
  });
});
