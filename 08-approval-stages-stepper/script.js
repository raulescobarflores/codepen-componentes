const wrapper = document.getElementById('stageWrapper');
const btn = document.getElementById('stageBtn');

function togglePopover(force) {
  const isOpen = typeof force === 'boolean'
    ? force
    : !wrapper.classList.contains('is-open');

  wrapper.classList.toggle('is-open', isOpen);
  btn.setAttribute('aria-expanded', String(isOpen));
}

btn.addEventListener('click', (e) => {
  e.stopPropagation();
  togglePopover();
});

document.addEventListener('click', (e) => {
  if (!wrapper.contains(e.target)) {
    togglePopover(false);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    togglePopover(false);
  }
});

togglePopover(true);
