/**
 * TOMO - Markdown Reader
 * Main application entry point with modular architecture
 */

// ===== STYLES =====
import "./styles/index.css";

// ===== CORE MODULES =====
import { createMarkdownParser } from "./modules/core/markdown.js";
import { initializeEventListeners } from "./modules/events.js";

/**
 * Initialize the application
 */
async function initializeApp() {
  try {
    // Create markdown parser instance
    const markdownParser = createMarkdownParser();

    // Initialize all event listeners and interactions
    initializeEventListeners(markdownParser);

    console.log("TOMO initialized successfully");
  } catch (error) {
    console.error("Failed to initialize TOMO:", error);
  }
}

// Start the application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
