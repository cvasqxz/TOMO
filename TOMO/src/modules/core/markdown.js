/**
 * Markdown Parser Configuration
 * Sets up Marked with syntax highlighting (deferred for performance)
 */

import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { openUrl } from "@tauri-apps/plugin-opener";

const markedOptions = {
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false,
};

/**
 * Create the full markdown parser (with syntax highlighting)
 * Used for small files or reload
 * @returns {Marked} Configured Marked instance
 */
export function createMarkdownParser() {
  const marked = new Marked(
    markedHighlight({
      emptyString: "",
      langPrefix: "hljs language-",
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  marked.setOptions(markedOptions);
  return marked;
}

/**
 * Create a fast markdown parser (no syntax highlighting)
 * Code blocks get a data-lang attribute for deferred highlighting
 * @returns {Marked} Configured Marked instance without highlight
 */
export function createFastParser() {
  const marked = new Marked();
  marked.setOptions(markedOptions);

  const renderer = new Marked().defaults.renderer;
  marked.use({
    renderer: {
      code({ text, lang }) {
        const escaped = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
        const langAttr = lang ? ` class="hljs language-${lang}" data-lang="${lang}"` : ' class="hljs"';
        return `<pre><code${langAttr}>${escaped}</code></pre>\n`;
      },
    },
  });

  return marked;
}

const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:'];

/**
 * Intercept all link clicks inside a container and open them in the system browser.
 * Only http, https, and mailto links are allowed — javascript: and other
 * potentially dangerous protocols are silently ignored.
 * @param {HTMLElement} container
 */
export function interceptLinks(container) {
  container.addEventListener("click", (e) => {
    const anchor = e.target.closest("a[href]");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    e.preventDefault();
    try {
      const url = new URL(href);
      if (!ALLOWED_PROTOCOLS.includes(url.protocol)) return;
      openUrl(href);
    } catch {
      // Relative or malformed URLs — ignore
    }
  });
}

/**
 * Highlight all unhighlighted code blocks inside a container
 * @param {HTMLElement} container
 */
export function highlightCodeBlocks(container) {
  const blocks = container.querySelectorAll("code[data-lang]");
  blocks.forEach((block) => {
    if (block.dataset.highlighted) return;
    const lang = block.dataset.lang;
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    block.innerHTML = hljs.highlight(block.textContent, { language }).value;
    block.dataset.highlighted = "true";
  });
}

/**
 * Setup an IntersectionObserver that highlights code blocks lazily
 * @param {HTMLElement} container
 * @returns {IntersectionObserver}
 */
export function setupLazyHighlighting(container) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const code = entry.target.querySelector("code[data-lang]");
        if (code && !code.dataset.highlighted) {
          const lang = code.dataset.lang;
          const language = hljs.getLanguage(lang) ? lang : "plaintext";
          code.innerHTML = hljs.highlight(code.textContent, { language }).value;
          code.dataset.highlighted = "true";
        }
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "200px 0px" }
  );

  container.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector("code[data-lang]:not([data-highlighted])")) {
      observer.observe(pre);
    }
  });

  return observer;
}
