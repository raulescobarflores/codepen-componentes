const card = document.getElementById('shipmentCard');
const detailsBtn = document.getElementById('detailsBtn');
const confirmBtn = document.getElementById('confirmBtn');
const resetBtn = document.getElementById('resetBtn');
const actionsRow = document.getElementById('actionsRow');
const drawer = document.getElementById('allocationsDrawer');
const statusPill = document.getElementById('statusPill');
const statusText = document.getElementById('statusText');
const damageNote = document.getElementById('damageNote');
const damagedChip = card.querySelector('.chip.is-damaged');

let isConfirmed = false;

detailsBtn.addEventListener('click', () => {
  const open = drawer.classList.toggle('is-open');
  detailsBtn.textContent = open ? 'Hide Details' : 'View Details';
  detailsBtn.setAttribute('aria-expanded', String(open));
  drawer.setAttribute('aria-hidden', String(!open));
});

damagedChip.addEventListener('click', () => {
  const open = damageNote.classList.toggle('is-open');
  damagedChip.classList.toggle('is-expanded', open);
  damagedChip.setAttribute('aria-expanded', String(open));
  damageNote.setAttribute('aria-hidden', String(!open));
});

confirmBtn.addEventListener('click', () => {
  if (isConfirmed) return;
  isConfirmed = true;
  statusPill.className = 'status-pill is-transit';
  statusText.textContent = 'In Navigation';
  confirmBtn.classList.add('is-confirmed');
  confirmBtn.textContent = 'Shipment Generated ✓';
  actionsRow.classList.add('is-confirmed');
  resetBtn.hidden = false;
});

resetBtn.addEventListener('click', () => {
  isConfirmed = false;
  statusPill.className = 'status-pill is-pending';
  statusText.textContent = 'Pending Confirmation';
  confirmBtn.classList.remove('is-confirmed');
  confirmBtn.textContent = 'Generate Shipment';
  actionsRow.classList.remove('is-confirmed');
  resetBtn.hidden = true;
});

card.addEventListener('click', (e) => {
  const copyBtn = e.target.closest('.copy-trigger');
  if (!copyBtn) return;

  const value = copyBtn.dataset.copy;
  const label = copyBtn.querySelector('span');
  if (!label || !value) return;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(value).catch(() => {});
  }

  copyBtn.classList.add('is-copied');
  label.textContent = 'Copied!';
  clearTimeout(copyBtn._copyTimer);
  copyBtn._copyTimer = setTimeout(() => {
    copyBtn.classList.remove('is-copied');
    label.textContent = value;
  }, 1200);
});
