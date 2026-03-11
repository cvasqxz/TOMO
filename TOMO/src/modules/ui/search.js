/**
 * Search and Highlight System
 * Provides find-in-page functionality with navigation
 */

import Mark from "mark.js";
import { showToast } from "./toast.js";

// DOM Selectors
const searchContainer = document.getElementById("search-container");
const searchInput = document.getElementById("search-input");
const searchCount = document.getElementById("search-count");
const searchPrev = document.getElementById("search-prev");
const searchNext = document.getElementById("search-next");
const searchClose = document.getElementById("search-close");
const contentArea = document.getElementById("content-area");

// Search state
let markInstance = null;
let currentMatchIndex = 0;
let totalMatches = 0;

/**
 * Toggle the search bar visibility
 * @param {boolean} show - Whether to show the search bar
 */
export function toggleSearchBar(show = true) {
  if (show) {
    searchContainer.classList.add("show");
    searchInput.focus();
  } else {
    searchContainer.classList.remove("show");
    clearSearch();
    searchInput.value = "";
  }
}

/**
 * Clear all search highlights
 */
function clearSearch() {
  if (markInstance) {
    markInstance.unmark();
  }
  searchCount.textContent = "0/0";
  currentMatchIndex = 0;
  totalMatches = 0;
}

/**
 * Perform search and highlight matches
 */
function performSearch() {
  const query = searchInput.value;
  clearSearch();

  if (!query) return;

  if (!markInstance) {
    markInstance = new Mark(contentArea);
  }

  markInstance.mark(query, {
    separateWordSearch: false,
    done: (count) => {
      totalMatches = count;
      currentMatchIndex = count > 0 ? 1 : 0;
      updateSearchUI();
      if (count > 0) {
        jumpToMatch();
      }
    }
  });
}

/**
 * Update the search UI counter
 */
function updateSearchUI() {
  searchCount.textContent = `${currentMatchIndex}/${totalMatches}`;
}

/**
 * Jump to the current match in the document
 */
function jumpToMatch() {
  const matches = contentArea.querySelectorAll("mark");
  matches.forEach((m, i) => {
    m.classList.toggle("current", i === currentMatchIndex - 1);
  });

  const current = matches[currentMatchIndex - 1];
  if (current) {
    current.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/**
 * Navigate to the next match
 */
function nextMatch() {
  if (totalMatches === 0) return;
  currentMatchIndex = currentMatchIndex >= totalMatches ? 1 : currentMatchIndex + 1;
  updateSearchUI();
  jumpToMatch();
}

/**
 * Navigate to the previous match
 */
function prevMatch() {
  if (totalMatches === 0) return;
  currentMatchIndex = currentMatchIndex <= 1 ? totalMatches : currentMatchIndex - 1;
  updateSearchUI();
  jumpToMatch();
}

/**
 * Initialize search event listeners
 */
export function initSearchListeners() {
  // Keyboard shortcuts
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      toggleSearchBar(!searchContainer.classList.contains("show"));
    }
    if (e.key === "Escape" && searchContainer.classList.contains("show")) {
      toggleSearchBar(false);
    }
  });

  // Search input
  searchInput.addEventListener("input", performSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.shiftKey ? prevMatch() : nextMatch();
    }
  });

  // Navigation buttons
  searchNext.addEventListener("click", nextMatch);
  searchPrev.addEventListener("click", prevMatch);
  searchClose.addEventListener("click", () => toggleSearchBar(false));
}
