/**
 * Event Listeners
 * Centralizes all user interaction handlers
 */

import { open } from "@tauri-apps/plugin-dialog";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { loadMarkdown } from "./core/file-loader.js";
import { initSearchListeners } from "./ui/search.js";
import { toggleTheme } from "./ui/theme.js";
import { showToast } from "./ui/toast.js";
import { isMarkdownFile } from "./core/utils.js";

/**
 * Initialize all application event listeners
 * @param {Marked} markdownParser - The markdown parser instance
 */
export function initializeEventListeners(markdownParser) {
  const appWindow = getCurrentWindow();
  const openFileBtn = document.getElementById("open-file");
  const themeToggle = document.getElementById("theme-toggle");

  // Initialize search listeners
  initSearchListeners();

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    toggleTheme();
  });

  // Open file dialog
  openFileBtn.addEventListener("click", async () => {
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
  });

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
