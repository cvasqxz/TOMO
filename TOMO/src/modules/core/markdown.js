/**
 * Markdown Parser Configuration
 * Sets up Marked with syntax highlighting
 */

import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

/**
 * Create and configure the markdown parser
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

  // Configure secure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false,
  });

  return marked;
}
