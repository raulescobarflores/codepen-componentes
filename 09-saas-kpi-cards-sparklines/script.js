document.querySelectorAll('.kpi-card').forEach((card) => {
  const line = card.querySelector('.spark-line');
  const length = line.getTotalLength();

  line.style.strokeDasharray = length;
  line.style.strokeDashoffset = length;
  line.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1)';

  requestAnimationFrame(() => {
    line.style.strokeDashoffset = '0';
    card.classList.add('is-ready');
  });
});
