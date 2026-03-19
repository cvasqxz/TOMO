/**
 * File Loading, Markdown Rendering, and File Watching
 * Handles loading markdown files, rendering them, and auto-reloading on changes
 */

import { readTextFile, watch } from "@tauri-apps/plugin-fs";
import { showToast } from "../ui/toast.js";
import { isMarkdownFile, isValidFileSize, isNotEmpty, getFilename, getMaxFileSizeMB } from "./utils.js";
import { getViewManager } from "../events.js";

const contentArea = document.getElementById("content-area");

// File watcher state
let currentUnwatch = null;
let currentPath = null;
let currentParser = null;

/**
 * Stop watching the current file
 */
async function stopWatching() {
  if (currentUnwatch) {
    currentUnwatch();
    currentUnwatch = null;
  }
  currentPath = null;
}

/**
 * Start watching a file for changes
 * @param {string} path - The file path to watch
 * @param {Marked} markdownParser - The markdown parser instance
 */
async function startWatching(path, markdownParser) {
  await stopWatching();

  currentPath = path;
  currentParser = markdownParser;

  try {
    currentUnwatch = await watch(
      [path],
      (event) => {
        const kind = event.type;
        // Reload on any modification event
        if (kind === 'any' || (typeof kind === 'object' && 'modify' in kind)) {
          reloadFile();
        }
      },
      { delayMs: 500 }
    );
    console.log("Watching file:", path);
  } catch (err) {
    console.warn("File watch not available:", err);
  }
}

/**
 * Reload the currently watched file, preserving scroll position
 */
async function reloadFile() {
  if (!currentPath || !currentParser) return;

  try {
    const markdownText = await readTextFile(currentPath);

    if (!isNotEmpty(markdownText)) return;
    if (!isValidFileSize(markdownText)) return;

    // Preserve scroll position
    const scrollY = window.scrollY;

    const htmlContent = await currentParser.parse(markdownText);
    contentArea.innerHTML = htmlContent;

    // Regenerate navigation map
    const viewManager = getViewManager();
    if (viewManager) {
      viewManager.generateNavigationMap();
    }

    // Restore scroll position
    window.scrollTo(0, scrollY);

    showToast('File reloaded', 'success');
  } catch (err) {
    console.error("Reload error:", err);
  }
}

/**
 * Load and render a markdown file
 * @param {string} path - The file path to load
 * @param {Marked} markdownParser - The markdown parser instance
 * @returns {Promise<void>}
 */
export async function loadMarkdown(path, markdownParser) {
  try {
    // 1. Validate extension
    if (!isMarkdownFile(path)) {
      showToast('El archivo debe ser .md o .markdown', 'error');
      return;
    }

    // 2. Read file
    let markdownText;
    try {
      markdownText = await readTextFile(path);
    } catch (err) {
      showToast(`Could not read file: ${err.message || err}`, 'error');
      console.error("File read error:", err);
      return;
    }

    // 3. Validate it's not empty
    if (!isNotEmpty(markdownText)) {
      showToast('File is empty', 'warning');
      return;
    }

    // 4. Validate size (max 10MB)
    if (!isValidFileSize(markdownText)) {
      showToast(`File too large (max ${getMaxFileSizeMB()}MB)`, 'error');
      return;
    }

    // 5. Render markdown
    const htmlContent = await markdownParser.parse(markdownText);
    contentArea.innerHTML = htmlContent;

    // 6. Update title and show reader view
    const fileName = getFilename(path);
    document.title = `TOMO - ${fileName}`;

    // Switch to reader view
    const viewManager = getViewManager();
    if (viewManager) {
      viewManager.showReaderView(fileName);
    }

    // 7. Start watching for changes
    await startWatching(path, markdownParser);

    window.scrollTo(0, 0);
    showToast('File loaded successfully', 'success');
  } catch (err) {
    console.error("TOMO Error:", err);
    showToast(`Error loading file: ${err.message}`, 'error');
  }
}

/**
 * Stop watching the current file (called when closing)
 */
export { stopWatching };
