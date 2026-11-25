const switcher = document.getElementById('companySwitcher');
const btn = document.getElementById('switcherBtn');
const selectedLabel = document.getElementById('selectedCompany');
const options = document.querySelectorAll('.company-option');

function toggleMenu(forceState) {
  const isOpen = typeof forceState === 'boolean'
    ? forceState
    : !switcher.classList.contains('is-open');

  switcher.classList.toggle('is-open', isOpen);
  btn.setAttribute('aria-expanded', String(isOpen));
}

btn.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});

options.forEach((option) => {
  option.addEventListener('click', () => {
    options.forEach((opt) => {
      opt.classList.remove('is-selected');
      opt.setAttribute('aria-selected', 'false');
    });

    option.classList.add('is-selected');
    option.setAttribute('aria-selected', 'true');
    selectedLabel.textContent = option.dataset.value;
    toggleMenu(false);
  });
});

document.addEventListener('click', (e) => {
  if (!switcher.contains(e.target)) {
    toggleMenu(false);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    toggleMenu(false);
  }
});
