/**
 * View Manager - Handles switching between welcome and reader views
 */

import { stopWatching } from "../core/file-loader.js";

export class ViewManager {
  constructor() {
    this.welcomeScreen = document.getElementById('welcome-screen');
    this.readerView = document.getElementById('reader-view');
    this.contentArea = document.getElementById('content-area');
    this.navMapList = document.getElementById('nav-map-list');
    this.fileNameDisplay = document.getElementById('file-name');
    this.currentFileName = '';

    // Animation elements
    this.welcomeTitle = document.getElementById('welcome-title');
    this.welcomeDivider = document.getElementById('welcome-divider');
    this.welcomeButtons = document.getElementById('welcome-buttons');
    this.floatingControls = document.getElementById('floating-controls');
  }

  /**
   * Show the welcome screen with reverse animation
   */
  showWelcomeScreen() {
    // Stop watching the current file
    stopWatching();

    // Step 1: Hide floating controls and fade out reader
    this.floatingControls?.classList.add('floating-controls-hidden');
    this.readerView.classList.add('reader-closing');

    // Step 2: After 400ms, show welcome screen and move title back
    setTimeout(() => {
      this.readerView.classList.add('reader-hidden');
      this.readerView.classList.remove('reader-closing');
      this.contentArea.innerHTML = '';
      this.navMapList.innerHTML = '';

      this.welcomeScreen.style.display = 'flex';
      this.welcomeScreen.classList.add('transitioning');

      // Title moves back to center
      this.welcomeTitle?.classList.remove('moving');
    }, 400);

    // Step 3: After 800ms, show divider and buttons
    setTimeout(() => {
      this.welcomeDivider?.classList.remove('hiding');
      this.welcomeButtons?.classList.remove('hiding');
    }, 800);

    // Step 4: After 1200ms, remove transitioning state
    setTimeout(() => {
      this.welcomeScreen?.classList.remove('transitioning');
    }, 1200);

    this.currentFileName = '';
  }

  /**
   * Show the reader view with content
   * @param {string} fileName - Name of the opened file
   */
  showReaderView(fileName) {
    // Start animation sequence
    this.welcomeScreen.classList.add('transitioning');

    // Step 1: Hide divider and buttons (400ms)
    this.welcomeDivider?.classList.add('hiding');
    this.welcomeButtons?.classList.add('hiding');

    // Step 2: After 400ms, move title to corner
    setTimeout(() => {
      this.welcomeTitle?.classList.add('moving');
    }, 400);

    // Step 3: After 800ms total, show floating controls and reader
    setTimeout(() => {
      this.floatingControls?.classList.remove('floating-controls-hidden');
      this.readerView.classList.remove('reader-hidden');
    }, 800);

    // Step 4: After 1200ms total, hide welcome screen completely
    setTimeout(() => {
      this.welcomeScreen.style.display = 'none';
    }, 1200);

    this.currentFileName = fileName;
    this.fileNameDisplay.textContent = fileName;

    // Generate navigation map after animation completes
    setTimeout(() => this.generateNavigationMap(), 1300);
  }

  /**
   * Generate navigation map from document headings
   */
  generateNavigationMap() {
    const headings = this.contentArea.querySelectorAll('h2, h3');
    this.navMapList.innerHTML = '';

    headings.forEach((heading) => {
      const level = heading.tagName.toLowerCase();
      const text = heading.textContent;
      const id = this.generateId(text);

      // Add ID to heading if it doesn't have one
      if (!heading.id) {
        heading.id = id;
      }

      // Create navigation item
      const li = document.createElement('li');
      li.className = `nav-map-item ${level}`;

      const a = document.createElement('a');
      a.href = `#${heading.id}`;
      a.textContent = text;
      a.addEventListener('click', (e) => this.handleNavClick(e, heading));

      li.appendChild(a);
      this.navMapList.appendChild(li);
    });

    // Setup intersection observer for active highlighting
    this.setupIntersectionObserver();
  }

  /**
   * Generate ID from heading text
   * @param {string} text - Heading text
   * @returns {string} - Generated ID
   */
  generateId(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  /**
   * Handle navigation click
   * @param {Event} e - Click event
   * @param {HTMLElement} targetElement - Target heading element
   */
  handleNavClick(e, targetElement) {
    e.preventDefault();

    // Calculate offset for sticky header
    const header = document.querySelector('.reader-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const offset = 16; // Additional padding in pixels

    // Get target position and scroll with offset
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Update active link
    document.querySelectorAll('.nav-map-item a').forEach(link => {
      link.classList.remove('active');
    });
    e.target.classList.add('active');
  }

  /**
   * Setup intersection observer for active section highlighting
   */
  setupIntersectionObserver() {
    const observerOptions = {
      rootMargin: '-100px 0px -66%',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          document.querySelectorAll('.nav-map-item a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    // Observe all headings with IDs
    this.contentArea.querySelectorAll('h2[id], h3[id]').forEach(heading => {
      observer.observe(heading);
    });
  }

  /**
   * Get current file name
   * @returns {string} - Current file name
   */
  getCurrentFileName() {
    return this.currentFileName;
  }

  /**
   * Check if reader view is active
   * @returns {boolean} - True if reader view is active
   */
  isReaderViewActive() {
    return !this.readerView.classList.contains('reader-hidden');
  }
}
