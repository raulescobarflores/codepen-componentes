const SHIPMENTS = [
  {
    code: 'EMB-2026-041',
    vessel: 'M/V MSC ANNA',
    origin: 'Shanghai',
    dest: 'San Antonio',
    line: 'MSC Mediterranean',
    pos: ['#OC-884', '#OC-885'],
    usd: 48920,
    etd: '01/11/2026',
    eta: '28/11/2026',
    status: 'transit',
    progress: 72,
    daysLeft: 6,
    delayDays: 0,
    bl: 'BL-SHG-99210',
    containers: ['MSCU4829104', 'MSCU7712031'],
    cargo: '4,850 u. · 12 SKUs',
    terminal: 'San Antonio STI',
  },
  {
    code: 'EMB-2026-040',
    vessel: 'M/V COSCO ANDES',
    origin: 'Shenzhen',
    dest: 'San Antonio',
    line: 'COSCO Shipping',
    pos: ['#OC-881'],
    usd: 54120,
    etd: '04/11/2026',
    eta: '02/12/2026',
    status: 'transit',
    progress: 58,
    daysLeft: 10,
    delayDays: 0,
    bl: 'BL-SZX-88401',
    containers: ['CSNU6041229'],
    cargo: '2,940 u. · 7 SKUs',
    terminal: 'San Antonio DPW',
  },
  {
    code: 'EMB-2026-039',
    vessel: 'M/V HAPAG EXPRESS',
    origin: 'Ningbo',
    dest: 'Valparaiso',
    line: 'Hapag-Lloyd',
    pos: ['#OC-879'],
    usd: 31450,
    etd: '25/10/2026',
    eta: '26/11/2026',
    status: 'delayed',
    progress: 84,
    daysLeft: 4,
    delayDays: 5,
    bl: 'BL-NGB-74109',
    containers: ['HLXU9031278'],
    cargo: '3,120 u. · 8 SKUs',
    terminal: 'Valparaiso TPS',
  },
  {
    code: 'EMB-2026-036',
    vessel: 'M/V MAERSK LIMA',
    origin: 'Busan',
    dest: 'San Antonio',
    line: 'Maersk',
    pos: ['#OC-871', '#OC-872'],
    usd: 64200,
    etd: '18/10/2026',
    eta: '22/11/2026',
    status: 'arrived',
    progress: 100,
    daysLeft: 0,
    delayDays: 0,
    bl: 'BL-PUS-61920',
    containers: ['MSKU3184902', 'MSKU3184955'],
    cargo: '6,100 u. · 15 SKUs',
    terminal: 'San Antonio STI',
  },
  {
    code: 'EMB-2026-035',
    vessel: 'M/V ONE PACIFIC',
    origin: 'Kaohsiung',
    dest: 'Coronel',
    line: 'ONE Line',
    pos: ['#OC-868'],
    usd: 32600,
    etd: '15/10/2026',
    eta: '21/11/2026',
    status: 'arrived',
    progress: 100,
    daysLeft: 0,
    delayDays: 0,
    bl: 'BL-KHH-55302',
    containers: ['ONEU7810344'],
    cargo: '1,980 u. · 5 SKUs',
    terminal: 'Puerto Coronel',
  },
  {
    code: 'EMB-2026-033',
    vessel: 'M/V CMA CGM ANDES',
    origin: 'Qingdao',
    dest: 'San Antonio',
    line: 'CMA CGM',
    pos: ['#OC-865'],
    usd: 22890,
    etd: '10/10/2026',
    eta: '14/11/2026',
    status: 'received',
    progress: 100,
    daysLeft: 0,
    delayDays: 0,
    bl: 'BL-TAO-49201',
    containers: ['CMAU5520198'],
    cargo: '1,420 u. · 4 SKUs',
    terminal: 'San Antonio STI',
  },
];

const tbody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const filterPills = document.getElementById('filterPills');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const summaryCount = document.getElementById('summaryCount');
const summaryTotal = document.getElementById('summaryTotal');

let activeStatus = 'all';
let sortKey = 'code';
let sortAsc = false;
let expandedCode = null;

function parseDateDMY(dateStr) {
  const [day, month, year] = dateStr.split('/').map(Number);
  return year * 10000 + month * 100 + day;
}

function updateFilterCounts() {
  const counts = { all: SHIPMENTS.length, transit: 0, delayed: 0, arrived: 0, received: 0 };
  SHIPMENTS.forEach((s) => {
    if (counts[s.status] !== undefined) counts[s.status] += 1;
  });

  Object.entries(counts).forEach(([key, val]) => {
    const el = filterPills.querySelector(`[data-count="${key}"]`);
    if (el) el.textContent = String(val);
  });
}

function updateSortHeaders() {
  document.querySelectorAll('th[data-sort]').forEach((th) => {
    const isActive = th.dataset.sort === sortKey;
    th.classList.toggle('is-sorted', isActive);
    const ind = th.querySelector('.sort-ind');
    if (ind) {
      ind.textContent = isActive ? (sortAsc ? '↑' : '↓') : '↕';
    }
  });
}

function renderStatusCell(row) {
  if (row.status === 'transit' || row.status === 'delayed') {
    const delayed = row.status === 'delayed';
    return `
      <div class="mini-voyage">
        <div class="mini-ports">
          <span>${row.origin}</span>
          <span class="pod">${row.dest}</span>
        </div>
        <div class="mini-track">
          <div class="mini-bg"></div>
          <div class="mini-fill ${delayed ? 'is-delayed' : ''}" style="width: ${row.progress}%"></div>
          <div class="mini-ship ${delayed ? 'is-delayed' : ''}" style="left: ${row.progress}%">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
              <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"></path>
            </svg>
          </div>
        </div>
        <div class="mini-meta">
          <span class="${delayed ? 'state-delay' : 'state-ok'}">${delayed ? `Delayed (+${row.delayDays}d)` : 'In Navigation'}</span>
          <span class="days">${row.daysLeft}d left</span>
        </div>
      </div>
    `;
  }

  if (row.status === 'arrived') {
    return `<span class="badge is-arrived">Arrived at Port</span>`;
  }
  return `<span class="badge is-received">Received in Warehouse</span>`;
}

function renderTable() {
  const query = searchInput.value.trim().toLowerCase();
  clearSearchBtn.hidden = query.length === 0;

  const filtered = SHIPMENTS.filter((item) => {
    const matchesStatus = activeStatus === 'all' || item.status === activeStatus;
    const haystack = [
      item.code,
      item.vessel,
      item.origin,
      item.dest,
      item.line,
      item.bl,
      ...item.pos,
      ...item.containers,
    ]
      .join(' ')
      .toLowerCase();
    return matchesStatus && haystack.includes(query);
  });

  filtered.sort((a, b) => {
    let valA;
    let valB;
    if (sortKey === 'usd') {
      valA = a.usd;
      valB = b.usd;
    } else if (sortKey === 'eta') {
      valA = parseDateDMY(a.eta);
      valB = parseDateDMY(b.eta);
    } else if (sortKey === 'route') {
      valA = a.origin;
      valB = b.origin;
    } else if (sortKey === 'po') {
      valA = a.pos[0];
      valB = b.pos[0];
    } else {
      valA = a[sortKey];
      valB = b[sortKey];
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalUsd = filtered.reduce((sum, item) => sum + item.usd, 0);
  summaryCount.textContent = filtered.length === 1 ? '1 shipment' : `${filtered.length} shipments`;
  summaryTotal.textContent = `$${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  tbody.innerHTML = filtered
    .map((r) => {
      const isExpanded = expandedCode === r.code;
      return `
      <tr class="main-row ${isExpanded ? 'is-expanded' : ''}" data-code="${r.code}">
        <td>
          <div class="ship-cell">
            <svg class="row-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
            <div>
              <span class="ship-code mono">${r.code}</span>
              <span class="vessel-sub">${r.vessel}</span>
            </div>
          </div>
        </td>
        <td>
          <span class="route-main">${r.origin} → ${r.dest}</span>
          <span class="line-sub">${r.line}</span>
        </td>
        <td>${r.pos.map((p) => `<span class="po-tag">${p}</span>`).join('')}</td>
        <td class="amount">$${r.usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        <td class="dates-col">
          <div>ETD: ${r.etd}</div>
          <div class="eta">ETA: ${r.eta}</div>
        </td>
        <td>${renderStatusCell(r)}</td>
      </tr>
      ${
        isExpanded
          ? `
      <tr class="detail-row">
        <td colspan="6">
          <div class="detail-panel">
            <div>
              <span class="detail-item-label">Bill of Lading</span>
              <span class="detail-item-value mono">${r.bl}</span>
            </div>
            <div>
              <span class="detail-item-label">Containers (${r.containers.length})</span>
              <span class="detail-item-value mono">${r.containers.join(', ')}</span>
            </div>
            <div>
              <span class="detail-item-label">Declared Cargo</span>
              <span class="detail-item-value">${r.cargo}</span>
            </div>
            <div>
              <span class="detail-item-label">Port Terminal</span>
              <span class="detail-item-value">${r.terminal}</span>
            </div>
          </div>
        </td>
      </tr>`
          : ''
      }
    `;
    })
    .join('');

  emptyState.classList.toggle('is-visible', filtered.length === 0);
  updateSortHeaders();
}

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr.main-row');
  if (!row) return;
  const code = row.dataset.code;
  expandedCode = expandedCode === code ? null : code;
  renderTable();
});

filterPills.addEventListener('click', (e) => {
  const btn = e.target.closest('.pill');
  if (!btn) return;
  activeStatus = btn.dataset.status;
  filterPills.querySelectorAll('.pill').forEach((p) => p.classList.toggle('is-active', p === btn));
  renderTable();
});

searchInput.addEventListener('input', renderTable);

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchInput.focus();
  renderTable();
});

resetFiltersBtn.addEventListener('click', () => {
  activeStatus = 'all';
  searchInput.value = '';
  filterPills.querySelectorAll('.pill').forEach((p) => p.classList.toggle('is-active', p.dataset.status === 'all'));
  renderTable();
});

document.querySelectorAll('th[data-sort]').forEach((th) => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (sortKey === key) {
      sortAsc = !sortAsc;
    } else {
      sortKey = key;
      sortAsc = true;
    }
    renderTable();
  });
});

updateFilterCounts();
renderTable();
