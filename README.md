# TOMO - Minimalist Markdown Reader

## Features

- Beautiful Markdown rendering with syntax highlighting
- [Dracula/Alucard](https://draculatheme.com/) themes (dark and light modes)
- Drag & Drop support
- Fast and lightweight (built with Tauri + Rust)
- Theme persistence across sessions
- Content Security Policy for security
- CLI support: open files from terminal
- Animated welcome screen with smooth transitions
- Floating controls for theme toggle, open file, and close
- Sticky navigation sidebar with active section highlighting
- In-document search (Ctrl+F)

## Installation

### Prerequisites
- Bun (or npm)
- Rust toolchain
- Tauri v2 dependencies (see [tauri.app](https://tauri.app/start/prerequisites/))

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

1. **Open File**: Click "open file" on the welcome screen, use the floating button, or drag a .md file into the window
2. **Switch Theme**: Click "toggle theme" on welcome screen or the sun icon while reading
3. **Navigate**: Use the sticky sidebar to jump between sections
4. **Search**: Press Ctrl+F to search within the document
5. **CLI**: `tomo file.md` to open a file directly

## Themes

- **Dracula (Dark)**: Classic Dracula color palette
- **Alucard (Light)**: Complementary light palette

## Technologies

- [Tauri v2](https://tauri.app/) - Cross-platform framework
- [Marked](https://marked.js.org/) - Markdown parser
- [Highlight.js](https://highlightjs.org/) - Syntax highlighting
- [Pico CSS](https://picocss.com/) - Minimalist CSS framework
- [Vite](https://vitejs.dev/) - Build tool

## Project Structure

```
TOMO/
├── src/
│   ├── main.js                 # App entry point
│   ├── modules/
│   │   ├── core/
│   │   │   ├── file-loader.js  # Markdown loading and rendering
│   │   │   └── utils.js        # Validation utilities
│   │   ├── ui/
│   │   │   ├── view-manager.js # View transitions and animations
│   │   │   ├── theme.js        # Theme toggle logic
│   │   │   ├── search.js       # In-document search
│   │   │   └── toast.js        # Toast notifications
│   │   └── events.js           # Event listeners
│   └── styles/
│       ├── index.css            # Style imports
│       ├── variables.css        # CSS variables (colors, fonts)
│       ├── base.css             # Reset and base styles
│       ├── typography.css       # Font assignments
│       ├── layouts.css          # Welcome, reader, floating controls
│       ├── code.css             # Code block styling
│       ├── themes.css           # Dracula/Alucard theme rules
│       └── ...
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs              # Tauri plugin setup
│   │   └── main.rs             # Entry point
│   ├── Cargo.toml              # Rust dependencies
│   └── tauri.conf.json         # Tauri configuration
├── .cargo/
│   └── config.toml             # Wayland environment variables
├── index.html                  # Main HTML
├── package.json                # JS dependencies
└── vite.config.js              # Vite configuration
```

## Security

- Content Security Policy (CSP) configured
- Only accepts .md and .markdown files
- Maximum 10MB per file
- Escaped HTML in error messages

## License

MIT

## Contact

Created by [@cvasqxz](https://github.com/cvasqxz)
