const radius = 68;
const circumference = 2 * Math.PI * radius;

const items = document.querySelectorAll('.status-item');
const segments = document.querySelectorAll('.donut-segment');
const centerLabel = document.getElementById('centerLabel');
const centerValue = document.getElementById('centerValue');

const data = Array.from(items).map((el) => ({
  status: el.dataset.status,
  count: Number(el.dataset.count),
  label: el.dataset.label.toUpperCase(),
}));

const total = data.reduce((sum, d) => sum + d.count, 0);
centerValue.textContent = total;

let offset = 0;
data.forEach((d) => {
  const seg = document.querySelector(`.donut-segment[data-status="${d.status}"]`);
  const length = (d.count / total) * circumference;
  seg.style.strokeDasharray = `${length} ${circumference - length}`;
  seg.style.strokeDashoffset = -offset;
  offset += length;
});

function highlight(status) {
  if (!status) {
    centerLabel.textContent = 'TOTAL';
    centerValue.textContent = total;
    segments.forEach((s) => s.classList.remove('is-active', 'is-dimmed'));
    items.forEach((i) => i.classList.remove('is-active'));
    return;
  }

  const found = data.find((d) => d.status === status);
  if (found) {
    centerLabel.textContent = found.label;
    centerValue.textContent = found.count;
  }

  segments.forEach((s) => {
    const match = s.dataset.status === status;
    s.classList.toggle('is-active', match);
    s.classList.toggle('is-dimmed', !match);
  });

  items.forEach((i) => {
    i.classList.toggle('is-active', i.dataset.status === status);
  });
}

items.forEach((item) => {
  item.addEventListener('mouseenter', () => highlight(item.dataset.status));
  item.addEventListener('mouseleave', () => highlight(null));
});

segments.forEach((seg) => {
  seg.addEventListener('mouseenter', () => highlight(seg.dataset.status));
  seg.addEventListener('mouseleave', () => highlight(null));
});
