# Sistema de Temas - Diseño Simplificado

## Resumen

Sistema minimalista de temas configurable mediante un solo archivo JSON que permite a los usuarios añadir paletas sin modificar código.

## Arquitectura

### 1. Archivo Único de Temas

**`public/themes.json`**

```json
{
  "dracula": {
    "name": "Dracula",
    "author": "Zeno Rocha",
    "bg": "#282a36",
    "fg": "#f8f8f2",
    "comment": "#6272a4",
    "selection": "#44475a",
    "cyan": "#8be9fd",
    "green": "#50fa7b",
    "orange": "#ffb86c",
    "pink": "#ff79c6",
    "purple": "#bd93f9",
    "red": "#ff5555",
    "yellow": "#f1fa8c"
  },
  "alucard": {
    "name": "Alucard",
    "author": "TOMO",
    "bg": "#f8f8f2",
    "fg": "#282a36",
    "comment": "#6272a4",
    "selection": "#eee8d5",
    "cyan": "#0087af",
    "green": "#005f00",
    "orange": "#d75f00",
    "pink": "#d70087",
    "purple": "#5f00d7",
    "red": "#d70000",
    "yellow": "#875f00"
  },
  "gruvbox": {
    "name": "Gruvbox Dark",
    "author": "morhetz",
    "bg": "#282828",
    "fg": "#ebdbb2",
    "comment": "#928374",
    "selection": "#504945",
    "cyan": "#8ec07c",
    "green": "#b8bb26",
    "orange": "#fe8019",
    "pink": "#d3869b",
    "purple": "#d3869b",
    "red": "#fb4934",
    "yellow": "#fabd2f"
  },
  "solarized-dark": {
    "name": "Solarized Dark",
    "author": "Ethan Schoonover",
    "bg": "#002b36",
    "fg": "#839496",
    "comment": "#586e75",
    "selection": "#073642",
    "cyan": "#2aa198",
    "green": "#859900",
    "orange": "#cb4b16",
    "pink": "#d33682",
    "purple": "#6c71c4",
    "red": "#dc322f",
    "yellow": "#b58900"
  },
  "solarized-light": {
    "name": "Solarized Light",
    "author": "Ethan Schoonover",
    "bg": "#fdf6e3",
    "fg": "#657b83",
    "comment": "#93a1a1",
    "selection": "#eee8d5",
    "cyan": "#2aa198",
    "green": "#859900",
    "orange": "#cb4b16",
    "pink": "#d33682",
    "purple": "#6c71c4",
    "red": "#dc322f",
    "yellow": "#b58900"
  }
}
```

### 2. Loader JavaScript

**`src/modules/ui/theme-loader.js`**

```javascript
/**
 * Simple theme loader
 * Loads color palettes from themes.json and applies them as CSS variables
 */

let themes = {};
let currentTheme = 'dracula';

/**
 * Initialize theme system
 */
export async function initThemeSystem() {
  try {
    // Load themes from JSON
    const response = await fetch('/themes.json');
    themes = await response.json();

    // Get stored preference or default
    const stored = localStorage.getItem('theme') || 'dracula';

    // Apply theme
    applyTheme(stored);

    return Object.keys(themes);
  } catch (error) {
    console.error('Failed to load themes:', error);
    return [];
  }
}

/**
 * Apply a theme by name
 */
export function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) {
    console.error(`Theme '${themeName}' not found`);
    return;
  }

  const root = document.documentElement.style;

  // Apply all color variables
  Object.entries(theme).forEach(([key, value]) => {
    if (key !== 'name' && key !== 'author') {
      root.setProperty(`--${key}`, value);
    }
  });

  // Save preference
  localStorage.setItem('theme', themeName);
  currentTheme = themeName;

  // Update data attribute for theme-specific CSS
  document.documentElement.setAttribute('data-theme', themeName);
}

/**
 * Get available themes
 */
export function getThemes() {
  return Object.entries(themes).map(([id, data]) => ({
    id,
    name: data.name,
    author: data.author
  }));
}

/**
 * Get current theme
 */
export function getCurrentTheme() {
  return currentTheme;
}
```

### 3. CSS Variables

**`src/styles/variables.css`**

```css
/* ===== THEME VARIABLES ===== */
:root {
  /* Colors - valores por defecto (Dracula) */
  --bg: #282a36;
  --fg: #f8f8f2;
  --comment: #6272a4;
  --selection: #44475a;
  --cyan: #8be9fd;
  --green: #50fa7b;
  --orange: #ffb86c;
  --pink: #ff79c6;
  --purple: #bd93f9;
  --red: #ff5555;
  --yellow: #f1fa8c;

  /* Typography */
  --font-base: 'Questrial', sans-serif;
  --font-mono: 'Kode Mono', monospace;
  --pico-font-size: 16px;

  /* Transitions */
  --transition: background-color 0.2s ease, color 0.2s ease;
}
```

### 4. CSS Genérico

**`src/styles/themes.css`** (simplificado)

```css
/* ===== THEME APPLICATION ===== */
body {
  background-color: var(--bg);
  color: var(--fg);
}

header {
  border-color: var(--purple);
}

th {
  color: var(--cyan) !important;
  border-bottom: 2px solid var(--purple);
}

pre {
  background: var(--selection) !important;
  border: 1px solid var(--comment);
}

code:not(.hljs) {
  background: var(--selection);
  color: var(--pink);
}

/* Syntax highlighting */
.hljs-keyword { color: var(--pink) !important; }
.hljs-function { color: var(--green) !important; }
.hljs-string { color: var(--yellow) !important; }
.hljs-number { color: var(--orange) !important; }
.hljs-comment { color: var(--comment) !important; }
.hljs-type { color: var(--cyan) !important; }
```

### 5. Integración

**`src/main.js`**

```javascript
import { initThemeSystem } from './modules/ui/theme-loader.js';

async function init() {
  // Initialize themes
  const availableThemes = await initThemeSystem();
  console.log('Loaded themes:', availableThemes);

  // Rest of app initialization...
}

init();
```

## Ventajas

- **Simplicidad**: Un solo archivo JSON, un script pequeño
- **Sin jerarquías**: Estructura plana y directa
- **Extensible**: Añadir temas = añadir objeto al JSON
- **Sin dependencias**: Solo fetch nativo
- **Fallback**: Valores por defecto en CSS

## Añadir un Tema Personalizado

Solo editar `themes.json`:

```json
{
  "dracula": { ... },
  "mi-tema": {
    "name": "Mi Tema Custom",
    "author": "Tu Nombre",
    "bg": "#1a1b26",
    "fg": "#c0caf5",
    "comment": "#565f89",
    "selection": "#283457",
    "cyan": "#7dcfff",
    "green": "#9ece6a",
    "orange": "#ff9e64",
    "pink": "#ff007c",
    "purple": "#bb9af7",
    "red": "#f7768e",
    "yellow": "#e0af68"
  }
}
```

## Referencias de Paletas

- **Dracula**: https://draculatheme.com/spec
- **Solarized**: https://ethanschoonover.com/solarized/
- **Gruvbox**: https://github.com/morhetz/gruvbox

## Pasos de Implementación

1. Crear `public/themes.json` con paletas Dracula, Alucard
2. Crear `src/modules/ui/theme-loader.js`
3. Simplificar `src/styles/variables.css` (usar nombres cortos)
4. Simplificar `src/styles/themes.css` (eliminar duplicación dark/light)
5. Integrar en `src/main.js`
6. (Opcional) Añadir selector de temas en UI
