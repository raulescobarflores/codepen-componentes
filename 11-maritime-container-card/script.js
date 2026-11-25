const STATE_CONFIG = {
  arrived: {
    pillClass: 'is-arrived',
    pillText: 'Arrived at Port',
    bannerClass: 'is-arrived',
    title: 'Arrived — Ready for Reception',
    sub: 'Available for warehouse intake',
    stages: ['is-active', '', ''],
    footerHtml: `
      <button type="button" class="btn btn-outline" data-action="inspect">Start Inspection</button>
      <button type="button" class="btn btn-primary" data-action="receive">Receive</button>
    `,
    single: false,
  },
  inspection: {
    pillClass: 'is-inspection',
    pillText: 'Under Inspection',
    bannerClass: 'is-inspection',
    title: 'Under Physical Inspection',
    sub: 'Verifying SKUs and seal integrity',
    stages: ['is-done', 'is-warning', ''],
    footerHtml: `
      <button type="button" class="btn btn-amber" data-action="discrepancy">Flag Discrepancy</button>
      <button type="button" class="btn btn-primary" data-action="receive">Confirm Intake</button>
    `,
    single: false,
  },
  received: {
    pillClass: 'is-received',
    pillText: 'Received in Warehouse',
    bannerClass: 'is-received',
    title: 'Received Without Issues',
    sub: 'Entered into warehouse stock',
    stages: ['is-done', 'is-done', 'is-done'],
    footerHtml: `<button type="button" class="btn btn-outline" data-action="reset">Reset Demo</button>`,
    single: true,
  },
  discrepancy: {
    pillClass: 'is-discrepancy',
    pillText: 'Discrepancy',
    bannerClass: 'is-discrepancy',
    title: 'Received with Discrepancy',
    sub: 'Partial warehouse entry (-45 units missing)',
    stages: ['is-done', 'is-done', 'is-error'],
    footerHtml: `<button type="button" class="btn btn-rose" data-action="reset">Reset to Arrived</button>`,
    single: true,
  },
};

function applyState(card, nextState) {
  const cfg = STATE_CONFIG[nextState];
  if (!cfg) return;

  card.dataset.state = nextState;

  const pill = card.querySelector('[data-pill]');
  pill.className = `status-pill ${cfg.pillClass}`;
  pill.querySelector('.pill-text').textContent = cfg.pillText;

  const segments = card.querySelectorAll('[data-stage-bar] .stage-seg');
  segments.forEach((seg, idx) => {
    seg.className = `stage-seg ${cfg.stages[idx] || ''}`.trim();
  });

  const banner = card.querySelector('[data-banner]');
  banner.className = `status-banner ${cfg.bannerClass}`;
  banner.querySelector('.banner-title').textContent = cfg.title;
  banner.querySelector('.banner-sub').textContent = cfg.sub;

  const footer = card.querySelector('[data-footer]');
  footer.classList.toggle('single', cfg.single);
  footer.innerHTML = cfg.footerHtml;
}

document.getElementById('cardsGrid').addEventListener('click', (e) => {
  const copyBtn = e.target.closest('.copy-trigger');
  if (copyBtn) {
    const value = copyBtn.dataset.copy;
    const label = copyBtn.querySelector('span');
    if (navigator.clipboard && value) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    copyBtn.classList.add('is-copied');
    label.textContent = 'Copied!';
    clearTimeout(copyBtn._copyTimer);
    copyBtn._copyTimer = setTimeout(() => {
      copyBtn.classList.remove('is-copied');
      label.textContent = value;
    }, 1200);
    return;
  }

  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const card = btn.closest('.container-card');
  const action = btn.dataset.action;

  if (action === 'inspect') applyState(card, 'inspection');
  if (action === 'receive') applyState(card, 'received');
  if (action === 'discrepancy') applyState(card, 'discrepancy');
  if (action === 'reset') applyState(card, 'arrived');
});
