const BASE_DAYS = 27;
const DELAY_DAYS = 4;

const card = document.getElementById('voyageCard');
const daySlider = document.getElementById('daySlider');
const dayLabel = document.getElementById('dayLabel');
const transitLabel = document.getElementById('transitLabel');
const etaDate = document.getElementById('etaDate');
const waypointChip = document.getElementById('waypointChip');
const hubDot = document.getElementById('hubDot');
const trackFill = document.getElementById('trackFill');
const shipMarker = document.getElementById('shipMarker');
const shipTooltip = document.getElementById('shipTooltip');
const statusPill = document.getElementById('statusPill');
const statusText = document.getElementById('statusText');
const metaState = document.getElementById('metaState');
const metaDays = document.getElementById('metaDays');
const modePills = document.getElementById('modePills');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const playLabel = document.getElementById('playLabel');

let mode = 'transit';
let animTimer = null;

function getTotalDays() {
  return mode === 'delayed' ? BASE_DAYS + DELAY_DAYS : BASE_DAYS;
}

function renderVoyage() {
  const totalDays = getTotalDays();
  daySlider.max = String(totalDays);

  const currentDay = Math.min(totalDays, Number(daySlider.value));
  daySlider.value = String(currentDay);

  const remaining = Math.max(0, totalDays - currentDay);
  const rawPct = Math.round((currentDay / totalDays) * 100);
  const isArrived = currentDay >= totalDays;
  const visualPct = isArrived ? 100 : rawPct;
  const passedHub = visualPct >= 50;

  dayLabel.textContent = `Day ${currentDay} / ${totalDays}`;
  transitLabel.textContent = `${totalDays}d`;
  etaDate.textContent = mode === 'delayed' ? 'ETA Dec 02 (+4d)' : 'ETA Nov 28';

  trackFill.style.width = `${visualPct}%`;
  shipMarker.style.left = `${visualPct}%`;
  shipTooltip.textContent = `${visualPct}%`;

  hubDot.classList.toggle('is-passed', passedHub);
  waypointChip.classList.toggle('is-passed', passedHub);

  daySlider.style.setProperty('--range-pct', `${visualPct}%`);

  card.classList.remove('is-delayed', 'is-arrived');
  statusPill.classList.remove('is-transit', 'is-delayed', 'is-arrived');

  if (isArrived) {
    card.classList.add('is-arrived');
    statusPill.classList.add('is-arrived');
    statusText.textContent = 'Arrived at Port';
    metaState.textContent = 'Berthed at San Antonio Terminal';
    metaDays.textContent = mode === 'delayed' ? 'Arrived (+4d drift)' : 'Arrived on schedule';
    daySlider.style.setProperty('--range-color', '#059669');
  } else if (mode === 'delayed') {
    card.classList.add('is-delayed');
    statusPill.classList.add('is-delayed');
    statusText.textContent = `Delayed (+${DELAY_DAYS}d)`;
    metaState.textContent = passedHub ? 'Past Balboa · Weather Drift' : 'Delayed (+4d ETA Drift)';
    metaDays.textContent = remaining === 1 ? '1 day remaining' : `${remaining} days remaining`;
    daySlider.style.setProperty('--range-color', '#dc2626');
  } else {
    statusPill.classList.add('is-transit');
    statusText.textContent = 'In Transit';
    metaState.textContent = passedHub ? 'Past Balboa · Southbound' : 'Pacific Crossing';
    metaDays.textContent = remaining === 1 ? '1 day remaining' : `${remaining} days remaining`;
    daySlider.style.setProperty('--range-color', '#0284c7');
  }
}

function setPlayButtonState(playing) {
  playBtn.classList.toggle('is-playing', playing);
  playLabel.textContent = playing ? 'Pause' : 'Animate';
  playIcon.innerHTML = playing
    ? '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>'
    : '<polygon points="6 3 20 12 6 21 6 3"></polygon>';
}

function stopAnimation() {
  if (animTimer) {
    clearInterval(animTimer);
    animTimer = null;
  }
  setPlayButtonState(false);
}

daySlider.addEventListener('input', () => {
  stopAnimation();
  renderVoyage();
});

modePills.addEventListener('click', (e) => {
  const btn = e.target.closest('.mode-btn');
  if (!btn) return;
  mode = btn.dataset.mode;
  modePills.querySelectorAll('.mode-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
  renderVoyage();
});

playBtn.addEventListener('click', () => {
  if (animTimer) {
    stopAnimation();
    return;
  }

  const totalDays = getTotalDays();
  if (Number(daySlider.value) >= totalDays) {
    daySlider.value = '0';
    renderVoyage();
  }

  setPlayButtonState(true);
  animTimer = setInterval(() => {
    const max = getTotalDays();
    const next = Number(daySlider.value) + 1;
    daySlider.value = String(next);
    renderVoyage();
    if (next >= max) {
      stopAnimation();
    }
  }, 130);
});

renderVoyage();
