const container = document.getElementById('toastContainer');
const buttons = document.querySelectorAll('.trigger-btn');

const messages = {
  success: { title: 'Order #1042 Approved', msg: 'Purchase order has been dispatched.' },
  warning: { title: 'Order #1043 Pending', msg: 'Waiting for manager authorization.' },
  error: { title: 'Order #1044 Rejected', msg: 'Budget limit exceeded for this cost center.' },
};

function showToast(type) {
  const { title, msg } = messages[type];
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.dataset.type = type;

  toast.innerHTML = `
    <span class="toast-dot"></span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
    </div>
    <button class="toast-close" aria-label="Close">&times;</button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('is-visible'));

  const remove = () => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('.toast-close').addEventListener('click', remove);
  setTimeout(remove, 3500);
}

buttons.forEach((btn) => {
  btn.addEventListener('click', () => showToast(btn.dataset.type));
});

showToast('success');
