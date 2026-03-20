/**
 * Event Listeners
 * Centralizes all user interaction handlers
 */

import { open } from "@tauri-apps/plugin-dialog";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { loadMarkdown } from "./core/file-loader.js";
import { initSearchListeners, toggleSearchBar } from "./ui/search.js";
import { toggleTheme } from "./ui/theme.js";
import { showToast } from "./ui/toast.js";
import { isMarkdownFile } from "./core/utils.js";
import { ViewManager } from "./ui/view-manager.js";

// Global view manager instance
let viewManager = null;

/**
 * Get the view manager instance
 * @returns {ViewManager} - The view manager instance
 */
export function getViewManager() {
  if (!viewManager) {
    viewManager = new ViewManager();
  }
  return viewManager;
}

/**
 * Initialize all application event listeners
 * @param {Marked} markdownParser - The markdown parser instance
 */
export function initializeEventListeners(markdownParser) {
  const appWindow = getCurrentWindow();
  const openFileBtn = document.getElementById("open-file");
  const themeToggle = document.getElementById("theme-toggle");

  // Floating controls
  const floatingThemeToggle = document.getElementById("floating-theme-toggle");
  const floatingOpenFile = document.getElementById("floating-open-file");
  const floatingCloseFile = document.getElementById("floating-close-file");
  const floatingSearch = document.getElementById("floating-search");

  // Initialize view manager
  viewManager = getViewManager();

  // Initialize search listeners
  initSearchListeners();

  // Theme toggle (welcome screen)
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      toggleTheme();
    });
  }

  // Function to open file dialog
  const openFileDialog = async () => {
    try {
      const selectedPath = await open({
        multiple: false,
        filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
      });
      if (selectedPath) {
        await loadMarkdown(selectedPath, markdownParser);
      }
    } catch (err) {
      console.error("Dialog Error:", err);
      showToast('Error opening file dialog', 'error');
    }
  };

  // Open file dialog (welcome screen)
  if (openFileBtn) {
    openFileBtn.addEventListener("click", openFileDialog);
  }

  // Floating theme toggle
  if (floatingThemeToggle) {
    floatingThemeToggle.addEventListener("click", () => {
      toggleTheme();
    });
  }

  // Floating open file
  if (floatingOpenFile) {
    floatingOpenFile.addEventListener("click", openFileDialog);
  }

  // Floating search
  if (floatingSearch) {
    floatingSearch.addEventListener("click", () => {
      const searchContainer = document.getElementById("search-container");
      toggleSearchBar(!searchContainer.classList.contains("show"));
    });
  }

  // Floating close file
  if (floatingCloseFile) {
    floatingCloseFile.addEventListener("click", () => {
      viewManager.showWelcomeScreen();
    });
  }

  // Drag and drop
  appWindow.onDragDropEvent(async (event) => {
    if (event.payload.type === 'drop') {
      const file = event.payload.paths[0];
      if (file && isMarkdownFile(file)) {
        await loadMarkdown(file, markdownParser);
      } else if (file) {
        showToast('Please drag a valid .md or .markdown file', 'warning');
      }
    }
  });
}
