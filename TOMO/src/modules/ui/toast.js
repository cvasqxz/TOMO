/**
 * Toast Notification System
 * Displays temporary notification messages to the user
 */

const TOAST_DURATION = 3000; // 3 seconds

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The toast type: 'info', 'success', 'warning', 'error'
 */
export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">${escapeHtml(message)}</span>
    </div>
  `;

  document.body.appendChild(toast);

  // Entrada animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto-hide after TOAST_DURATION
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, TOAST_DURATION);
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - The text to escape
 * @returns {string} Escaped HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
