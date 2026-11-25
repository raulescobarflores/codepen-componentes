const cols = document.querySelectorAll('.bar-col');
const tooltip = document.getElementById('tooltip');

requestAnimationFrame(() => {
  cols.forEach((col, index) => {
    setTimeout(() => col.classList.add('is-ready'), index * 100);
  });
});

cols.forEach((col) => {
  col.addEventListener('mousemove', (e) => {
    tooltip.textContent = `${col.dataset.label}: ${col.dataset.value} orders`;
    tooltip.style.left = `${e.clientX}px`;
    tooltip.style.top = `${e.clientY - 10}px`;
    tooltip.classList.add('is-visible');
  });

  col.addEventListener('mouseleave', () => {
    tooltip.classList.remove('is-visible');
  });
});
