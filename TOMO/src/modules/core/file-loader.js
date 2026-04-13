/**
 * File Loading, Markdown Rendering, and File Watching
 * Handles loading markdown files with progressive rendering for large files
 */

import { readTextFile, watch } from "@tauri-apps/plugin-fs";
import DOMPurify from "dompurify";
import { showNotification } from "../ui/notification.js";
import { isMarkdownFile, isValidFileSize, isNotEmpty, isTextContent, getFilename, getMaxFileSizeMB } from "./utils.js";

const sanitize = (html) => DOMPurify.sanitize(html, {
  ALLOW_DATA_ATTR: true,
  FORBID_TAGS: ['style', 'iframe', 'form', 'input', 'textarea', 'select', 'button', 'script'],
  FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick', 'onmouseover'],
});
import { getViewManager } from "../events.js";
import { createFastParser, setupLazyHighlighting, interceptLinks } from "./markdown.js";
import { restoreSavedTheme } from "../ui/theme.js";

const contentArea = document.getElementById("content-area");

// Open all links in the system browser
interceptLinks(contentArea);

// File watcher state
let currentUnwatch = null;
let currentPath = null;
let currentParser = null;

// Progressive render state
let renderAbortController = null;
let currentHighlightObserver = null;

// Threshold: files larger than this get progressive rendering (50KB)
const PROGRESSIVE_THRESHOLD = 50 * 1024;

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
 * Cancel any in-progress progressive render
 */
function abortProgressiveRender() {
  if (renderAbortController) {
    renderAbortController.abort();
    renderAbortController = null;
  }
  if (currentHighlightObserver) {
    currentHighlightObserver.disconnect();
    currentHighlightObserver = null;
  }
}

/**
 * Split markdown text into chunks by top-level headings
 * @param {string} text - Raw markdown text
 * @returns {string[]} Array of markdown chunks
 */
function splitIntoChunks(text) {
  // Split on lines that start with # or ## (top-level sections)
  const lines = text.split("\n");
  const chunks = [];
  let current = [];

  for (const line of lines) {
    if (/^#{1,2}\s/.test(line) && current.length > 0) {
      chunks.push(current.join("\n"));
      current = [line];
    } else {
      current.push(line);
    }
  }

  if (current.length > 0) {
    chunks.push(current.join("\n"));
  }

  return chunks;
}

/**
 * Render markdown progressively in chunks
 * First chunk is rendered immediately, rest via requestAnimationFrame
 * @param {string} markdownText - Full markdown content
 * @param {Marked} markdownParser - Parser instance (full, with highlighting)
 * @param {object} options
 * @param {boolean} options.preserveScroll - Whether to preserve scroll position
 * @returns {Promise<void>}
 */
async function renderProgressive(markdownText, markdownParser, { preserveScroll = false } = {}) {
  abortProgressiveRender();

  const scrollY = preserveScroll ? window.scrollY : 0;
  const fastParser = createFastParser();
  const chunks = splitIntoChunks(markdownText);

  const controller = new AbortController();
  renderAbortController = controller;

  contentArea.innerHTML = "";

  // Render first chunk immediately with fast parser (no highlight)
  if (chunks.length > 0) {
    const firstHtml = await fastParser.parse(chunks[0]);
    if (controller.signal.aborted) return;

    const fragment = document.createElement("div");
    fragment.innerHTML = sanitize(firstHtml);
    while (fragment.firstChild) {
      contentArea.appendChild(fragment.firstChild);
    }

    // Highlight visible code blocks in first chunk right away
    currentHighlightObserver = setupLazyHighlighting(contentArea);
  }

  if (preserveScroll) {
    window.scrollTo(0, scrollY);
  }

  // Render remaining chunks progressively
  for (let i = 1; i < chunks.length; i++) {
    if (controller.signal.aborted) return;

    await new Promise((resolve) => {
      requestAnimationFrame(async () => {
        if (controller.signal.aborted) { resolve(); return; }

        const html = await fastParser.parse(chunks[i]);
        if (controller.signal.aborted) { resolve(); return; }

        const fragment = document.createElement("div");
        fragment.innerHTML = sanitize(html);

        // Move children to a DocumentFragment to minimize reflows
        const docFrag = document.createDocumentFragment();
        while (fragment.firstChild) {
          docFrag.appendChild(fragment.firstChild);
        }
        contentArea.appendChild(docFrag);

        // Observe new pre blocks for lazy highlighting
        const newPres = contentArea.querySelectorAll("pre:not([data-observed])");
        newPres.forEach((pre) => {
          if (pre.querySelector("code[data-lang]:not([data-highlighted])")) {
            currentHighlightObserver?.observe(pre);
          }
          pre.dataset.observed = "true";
        });

        resolve();
      });
    });
  }

  if (preserveScroll) {
    window.scrollTo(0, scrollY);
  }

  renderAbortController = null;
}

/**
 * Render markdown in one shot (for small files)
 * @param {string} markdownText
 * @param {Marked} markdownParser - Full parser with syntax highlighting
 */
async function renderImmediate(markdownText, markdownParser) {
  abortProgressiveRender();
  const htmlContent = await markdownParser.parse(markdownText);
  contentArea.innerHTML = sanitize(htmlContent);
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

    const isLarge = new Blob([markdownText]).size > PROGRESSIVE_THRESHOLD;

    if (isLarge) {
      await renderProgressive(markdownText, currentParser, { preserveScroll: true });
    } else {
      const scrollY = window.scrollY;
      await renderImmediate(markdownText, currentParser);
      window.scrollTo(0, scrollY);
    }

    // Regenerate navigation map
    const viewManager = getViewManager();
    if (viewManager) {
      viewManager.generateNavigationMap();
    }

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
      await showNotification('El archivo debe ser .md o .markdown', 'error');
      return;
    }

    // 2. Read file
    let markdownText;
    try {
      markdownText = await readTextFile(path);
    } catch (err) {
      console.error("File read error:", err);
      return;
    }

    // 3. Validate it's plain text, not a binary file
    if (!isTextContent(markdownText)) {
      await showNotification('El archivo no es un documento de texto válido', 'error');
      return;
    }

    // 4. Validate it's not empty
    if (!isNotEmpty(markdownText)) {
      return;
    }

    // 5. Validate size (max 10MB)
    if (!isValidFileSize(markdownText)) {
      return;
    }

    // 6. Render markdown — progressive for large files, immediate for small
    const isLarge = new Blob([markdownText]).size > PROGRESSIVE_THRESHOLD;

    if (isLarge) {
      await renderProgressive(markdownText, markdownParser);
    } else {
      await renderImmediate(markdownText, markdownParser);
    }

    // 7. Restore saved theme and show reader view
    restoreSavedTheme();

    const fileName = getFilename(path);

    const viewManager = getViewManager();
    if (viewManager) {
      viewManager.showReaderView(fileName);
    }

    // 8. Start watching for changes
    await startWatching(path, markdownParser);

    window.scrollTo(0, 0);
  } catch (err) {
    console.error("TOMO Error:", err);
  }
}

/**
 * Stop watching the current file (called when closing)
 */
export { stopWatching };
