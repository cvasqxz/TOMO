/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - The text to escape
 * @returns {string} Escaped HTML
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validate if a file is a markdown file
 * @param {string} path - The file path to validate
 * @returns {boolean} True if file is markdown (.md or .markdown)
 */
export function isMarkdownFile(path) {
  return /\.(md|markdown)$/i.test(path);
}

/**
 * Validate file size
 * @param {string} content - The file content
 * @returns {boolean} True if file is within size limit
 */
export function isValidFileSize(content) {
  return content.length <= MAX_FILE_SIZE;
}

/**
 * Check if content is not empty
 * @param {string} content - The content to check
 * @returns {boolean} True if content has text
 */
export function isNotEmpty(content) {
  return content && content.trim().length > 0;
}

/**
 * Extract filename from full path
 * @param {string} path - The full file path
 * @returns {string} The filename without path
 */
export function getFilename(path) {
  return path.includes('/') ? path.split('/').pop() : path.split('\\').pop();
}

/**
 * Get the maximum file size in MB
 * @returns {number} Max file size in MB
 */
export function getMaxFileSizeMB() {
  return MAX_FILE_SIZE / (1024 * 1024);
}
