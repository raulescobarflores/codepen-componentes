const items = document.querySelectorAll('.ranking-item');

requestAnimationFrame(() => {
  items.forEach((item, index) => {
    setTimeout(() => item.classList.add('is-ready'), index * 90);
  });
});
