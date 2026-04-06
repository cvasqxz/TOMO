/**
 * Theme Management System
 * Handles palette selection and dark/light mode
 */

const WELCOME_PALETTE = 'misty-slate';
const WELCOME_MODE    = 'dark';

let currentMode    = WELCOME_MODE;
let currentPalette = WELCOME_PALETTE;

/**
 * Apply current mode and palette to the DOM
 */
function applyTheme() {
  document.documentElement.setAttribute('data-mode',    currentMode);
  document.documentElement.setAttribute('data-palette', currentPalette);
  document.body.setAttribute('data-mode',    currentMode);
  document.body.setAttribute('data-palette', currentPalette);
}

/**
 * Set the color mode
 * @param {string} mode - 'dark' or 'light'
 */
export function setMode(mode) {
  currentMode = mode;
  localStorage.setItem('mode', mode);
  applyTheme();
}

/**
 * Set the palette
 * @param {string} palette - palette key
 */
export function setPalette(palette) {
  currentPalette = palette;
  localStorage.setItem('palette', palette);
  applyTheme();
}

/**
 * Restore saved theme from localStorage (called when a file is opened)
 */
export function restoreSavedTheme() {
  currentMode    = localStorage.getItem('mode')    || WELCOME_MODE;
  currentPalette = localStorage.getItem('palette') || WELCOME_PALETTE;
  applyTheme();
}

/**
 * Reset to welcome defaults without touching localStorage
 */
export function resetToWelcomeTheme() {
  currentMode    = WELCOME_MODE;
  currentPalette = WELCOME_PALETTE;
  applyTheme();
}

/**
 * Get the current mode
 * @returns {string}
 */
export function getCurrentMode() {
  return currentMode;
}

/**
 * Get the current palette
 * @returns {string}
 */
export function getCurrentPalette() {
  return currentPalette;
}

/**
 * Toggle between dark and light mode
 */
export function toggleTheme() {
  setMode(currentMode === 'light' ? 'dark' : 'light');
}

// Initialize with welcome defaults
applyTheme();
