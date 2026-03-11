/**
 * File Loading and Markdown Rendering
 * Handles loading markdown files and rendering them to the page
 */

import { readTextFile } from "@tauri-apps/plugin-fs";
import { showToast } from "../ui/toast.js";
import { isMarkdownFile, isValidFileSize, isNotEmpty, getFilename, getMaxFileSizeMB } from "./utils.js";

const contentArea = document.getElementById("content-area");

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
      showToast(`Could not read file: ${err.message}`, 'error');
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

    // 6. Update title and scroll
    const fileName = getFilename(path);
    document.title = `TOMO - ${fileName}`;
    window.scrollTo(0, 0);

    showToast('File loaded successfully', 'success');
  } catch (err) {
    console.error("TOMO Error:", err);
    showToast(`Error loading file: ${err.message}`, 'error');
  }
}
