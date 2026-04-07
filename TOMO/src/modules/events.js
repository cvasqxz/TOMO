/**
 * Event Listeners
 * Centralizes all user interaction handlers
 */

import { open } from "@tauri-apps/plugin-dialog";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { loadMarkdown } from "./core/file-loader.js";
import { initSearchListeners, toggleSearchBar } from "./ui/search.js";
import { setMode, setPalette, getCurrentMode, getCurrentPalette } from "./ui/theme.js";
import { showNotification } from "./ui/notification.js";
import { isMarkdownFile } from "./core/utils.js";
import { ViewManager } from "./ui/view-manager.js";

// Global view manager instance
let viewManager = null;

/**
 * Get the view manager instance
 * @returns {ViewManager}
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

  // Floating controls
  const floatingThemeToggle = document.getElementById("floating-theme-toggle");
  const floatingOpenFile = document.getElementById("floating-open-file");
  const floatingCloseFile = document.getElementById("floating-close-file");
  const floatingSearch = document.getElementById("floating-search");

  // Palette menu
  const paletteMenu = document.getElementById("palette-menu");

  // Initialize view manager
  viewManager = getViewManager();

  // Initialize search listeners
  initSearchListeners();

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
    }
  };

  // Open file dialog (welcome screen)
  if (openFileBtn) {
    openFileBtn.addEventListener("click", openFileDialog);
  }

  // Floating theme button — toggle palette menu
  if (floatingThemeToggle && paletteMenu) {
    floatingThemeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      paletteMenu.classList.toggle("open");
      if (paletteMenu.classList.contains("open")) {
        updatePaletteMenuState();
      }
    });

    // Mode buttons
    paletteMenu.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setMode(btn.dataset.mode);
        updatePaletteMenuState();
      });
    });

    // Palette options
    paletteMenu.querySelectorAll(".palette-option").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setPalette(btn.dataset.palette);
        updatePaletteMenuState();
      });
    });

    // Close menu on outside click
    document.addEventListener("click", () => {
      paletteMenu.classList.remove("open");
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
        await showNotification('El archivo debe ser .md o .markdown', 'error');
      }
    }
  });
}

/**
 * Update palette menu active states to reflect current selection
 */
function updatePaletteMenuState() {
  const mode = getCurrentMode();
  const palette = getCurrentPalette();
  const paletteMenu = document.getElementById("palette-menu");
  if (!paletteMenu) return;

  paletteMenu.querySelectorAll(".mode-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  paletteMenu.querySelectorAll(".palette-option").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.palette === palette);
  });
}
