/**
 * Theme Management System
 * Handles switching between dark (Dracula) and light (Alucard) themes
 */

let currentTheme = localStorage.getItem('theme') || 'dark';

/**
 * Set the current theme
 * @param {string} theme - 'dark' or 'light'
 */
export function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

/**
 * Get the current theme
 * @returns {string} Current theme ('dark' or 'light')
 */
export function getCurrentTheme() {
  return currentTheme;
}

/**
 * Toggle between themes
 */
export function toggleTheme() {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Initialize theme on module load
setTheme(currentTheme);
