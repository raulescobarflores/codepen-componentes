const pills = document.querySelectorAll('.pill');
const searchInput = document.getElementById('searchInput');
const rows = document.querySelectorAll('#tableBody tr');
const emptyState = document.getElementById('emptyState');

let activeFilter = 'all';

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  rows.forEach((row) => {
    const matchesStatus = activeFilter === 'all' || row.dataset.status === activeFilter;
    const matchesText = row.textContent.toLowerCase().includes(query);
    const show = matchesStatus && matchesText;

    row.classList.toggle('is-hidden', !show);
    if (show) visibleCount++;
  });

  emptyState.classList.toggle('is-visible', visibleCount === 0);
}

pills.forEach((pill) => {
  pill.addEventListener('click', () => {
    pills.forEach((p) => p.classList.remove('is-active'));
    pill.classList.add('is-active');
    activeFilter = pill.dataset.filter;
    applyFilters();
  });
});

searchInput.addEventListener('input', applyFilters);
