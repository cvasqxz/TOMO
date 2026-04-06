# TOMO - Minimalist Markdown Reader

A minimal Markdown reader built with Tauri, featuring 10 color palettes with dark and light modes.

## Features

- Clean Markdown rendering with GitHub Flavored Markdown support
- 10 pastel color palettes, each with dark and light mode
- Syntax highlighting powered by highlight.js (lazy-loaded on scroll)
- In-document search (Ctrl+F)
- Drag & drop file loading
- Auto-reload on file changes (preserves scroll position)
- Progressive rendering for large files
- Sticky navigation sidebar with active section highlighting
- Animated welcome screen with smooth transitions

## Installation

### Prerequisites

- Bun (or npm)
- Rust toolchain
- Tauri v2 dependencies — see [tauri.app/start/prerequisites](https://tauri.app/start/prerequisites/)

### From Source

```bash
git clone https://github.com/cvasqxz/tomo.git
cd tomo/TOMO
bun install
```

### Development

```bash
bun tauri dev
```

### Build

```bash
bun tauri build
```

## Usage

1. **Open File** — Click "Open File" on the welcome screen, use the floating button, or drag a `.md` file into the window
2. **Switch Theme** — Click the sun icon in the floating controls to open the palette menu (available while reading)
3. **Navigate** — Use the sticky sidebar to jump between sections
4. **Search** — Press `Ctrl+F` to search within the document
5. **CLI** — `tomo file.md` to open a file directly

## Palettes

The welcome screen always uses **Misty Slate (dark)** as the base. Once a file is opened, the user's saved palette and mode are restored.

| Palette | Character |
|---------|-----------|
| Misty Slate *(default)* | Cool blue-grey |
| Rose Dusk | Warm purple-rose |
| Moss & Cream | Forest green |
| Indigo Mist | Soft indigo |
| Sand & Amber | Warm amber |
| Ocean Foam | Teal ocean |
| Lavender Dusk | Soft lavender |
| Cherry Blossom | Pink rose |
| Nordic Fog | Cold nordic blue |
| Citrus Haze | Yellow-green citrus |

## Technologies

- [Tauri v2](https://tauri.app/) — Cross-platform desktop framework
- [Vite](https://vitejs.dev/) — Build tool and dev server
- [Marked](https://marked.js.org/) — Markdown parser
- [Highlight.js](https://highlightjs.org/) — Syntax highlighting
- [Sora](https://fonts.google.com/specimen/Sora) / [Kode Mono](https://fonts.google.com/specimen/Kode+Mono) — Typography

## Project Structure

```
TOMO/
├── src/
│   ├── main.js
│   ├── modules/
│   │   ├── core/
│   │   │   ├── file-loader.js   # Markdown loading, rendering, file watching
│   │   │   ├── markdown.js      # Parser setup and lazy highlighting
│   │   │   └── utils.js         # Validation utilities
│   │   ├── ui/
│   │   │   ├── view-manager.js  # View transitions and animations
│   │   │   ├── theme.js         # Palette and mode management
│   │   │   ├── search.js        # In-document search
│   │   │   └── toast.js         # Toast notifications
│   │   └── events.js            # Event listeners
│   └── styles/
│       ├── index.css            # Style imports
│       ├── variables.css        # CSS custom properties (palettes, fonts)
│       ├── base.css             # Reset and base styles
│       ├── typography.css       # Font assignments
│       ├── layouts.css          # Welcome screen, reader, floating controls
│       ├── components.css       # UI components
│       ├── code.css             # Code block styling
│       ├── themes.css           # Syntax highlighting theme rules
│       ├── tables.css           # Table styling
│       ├── search.css           # Search UI
│       └── toast.css            # Toast notifications
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs               # Tauri plugin setup
│   │   └── main.rs              # Entry point
│   ├── Cargo.toml               # Rust dependencies
│   └── tauri.conf.json          # Tauri configuration
├── index.html
├── package.json
└── vite.config.js
```

## Security

- Content Security Policy (CSP) configured
- Only accepts `.md` and `.markdown` files
- Maximum 10MB per file

## License

MIT

## Contact

Created by [@cvasqxz](https://github.com/cvasqxz)
