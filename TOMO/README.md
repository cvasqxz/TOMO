# TOMO - Minimal Markdown Reader

A beautiful, minimal Markdown reader built with Tauri, featuring Dracula and Alucard themes with syntax highlighting.

![TOMO](https://img.shields.io/badge/version-0.1.0-blue)
![Platform](https://img.shields.io/badge/platform-linux%20%7C%20macOS%20%7C%20windows-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 📖 **Clean Markdown Rendering** - GitHub Flavored Markdown support
- 🎨 **Dual Themes** - Dracula (dark) and Alucard (light) color schemes
- 💻 **Syntax Highlighting** - Powered by highlight.js for code blocks
- 🔍 **Search Functionality** - Find text within your documents
- 📱 **Responsive Layout** - Adaptive UI with navigation map
- ⚡ **Performance Optimized** - Lazy loading and efficient rendering
- 🎯 **Keyboard Shortcuts** - Quick access to all features
- 📂 **Drag & Drop** - Easy file loading
- 🔄 **Auto Refresh** - File watching for live updates
- 🎭 **Progressive Rendering** - Fast initial load with deferred highlighting

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Rust** 1.70+
- Platform-specific requirements:
  - **Linux**: webkit2gtk, development libraries
  - **macOS**: Xcode Command Line Tools
  - **Windows**: WebView2

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tomo.git
cd tomo

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
npm run tauri build
```

## 📦 Bundle Size Optimization

TOMO has been optimized for minimal bundle size:

### Before Optimization
- CSS Bundle: **102.61 KB** (15.50 KB gzip)
- JS Bundle: **1,027 KB** (338 KB gzip)
- **Total**: ~1.1 MB uncompressed

### After CSS Optimization (Current)
- CSS Bundle: **19.21 KB** (4.18 KB gzip) - **81% reduction** ✨
- JS Bundle: **1,027 KB** (338 KB gzip)
- **Total CSS reduction**: ~83 KB removed

### Optimizations Applied
- ✅ **Removed Pico CSS** - Replaced with custom minimal styles
- ✅ **Custom CSS only** - All styles hand-crafted for TOMO
- ✅ **Tree-shaking enabled** - Vite removes unused code
- ⏳ **Next**: Optimize highlight.js (planned 70% JS reduction)

## 🎨 Tech Stack

### Frontend
- **Vite** - Build tool and dev server
- **Marked** - Markdown parser (GFM support)
- **Highlight.js** - Syntax highlighting
- **Mark.js** - Search highlighting
- **Custom CSS** - Minimal, theme-aware styling

### Backend
- **Tauri 2.0** - Desktop application framework
- **Rust** - High-performance backend
- **Tauri Plugins**:
  - `tauri-plugin-fs` - File system with watch support
  - `tauri-plugin-dialog` - Native file dialogs
  - `tauri-plugin-cli` - CLI argument parsing

## 🎯 Usage

### Opening Files

1. **Welcome Screen**: Click "Open File" button
2. **CLI**: `tomo path/to/file.md`
3. **Drag & Drop**: Drag `.md` files into the window

### Keyboard Shortcuts

- `Ctrl/Cmd + O` - Open file
- `Ctrl/Cmd + F` - Search
- `Ctrl/Cmd + T` - Toggle theme
- `Esc` - Close file / Close search

### Themes

- **Dracula** (Default Dark)
  - Background: `#282a36`
  - Foreground: `#f8f8f2`
  - Accents: Pink, Purple, Cyan, Green, Yellow

- **Alucard** (Light)
  - Background: `#fffbeb`
  - Foreground: `#1f1f1f`
  - Accents: Coordinated warm tones

## 📁 Project Structure

```
tomo/
├── src/
│   ├── modules/
│   │   ├── core/           # Core functionality
│   │   │   ├── markdown.js # Markdown parsing
│   │   │   ├── file-loader.js
│   │   │   └── utils.js
│   │   └── ui/             # UI components
│   │       ├── search.js
│   │       ├── theme.js
│   │       ├── toast.js
│   │       └── view-manager.js
│   ├── styles/             # CSS modules
│   │   ├── variables.css   # Theme variables
│   │   ├── base.css        # Base styles
│   │   ├── themes.css      # Theme implementations
│   │   ├── typography.css  # Text styling
│   │   ├── code.css        # Code block styles
│   │   ├── components.css  # UI components
│   │   ├── layouts.css     # Layout utilities
│   │   ├── tables.css      # Table styling
│   │   ├── search.css      # Search UI
│   │   ├── toast.css       # Toast notifications
│   │   └── index.css       # Main stylesheet
│   ├── main.js             # Application entry
│   └── index.html          # HTML template
├── src-tauri/
│   ├── src/
│   │   ├── main.rs         # Rust entry point
│   │   └── lib.rs          # Tauri app logic
│   └── Cargo.toml          # Rust dependencies
├── design-variations/      # 30 design prototypes
├── package.json
└── vite.config.js
```

## 🎨 Design Variations

TOMO includes 30 design variations in the `design-variations/` folder, showcasing different UI approaches:

- Minimalist layouts
- Split-screen designs
- Terminal aesthetics
- Glassmorphic effects
- And many more...

Each variation demonstrates the centered → expanded pattern with Dracula/Alucard themes.

## 🔧 Development

### Running in Dev Mode

```bash
npm run dev
```

This starts:
- Vite dev server (http://localhost:1420)
- Tauri development window with hot reload

### Building for Production

```bash
# Build frontend assets
npm run build

# Build Tauri app (creates platform-specific installer)
npm run tauri build
```

### Code Quality

```bash
# Check Rust code
cd src-tauri && cargo check

# Build frontend
npm run build

# Preview production build
npm run preview
```

## 📊 Performance Features

### Progressive Rendering
- **Fast Parser**: Initial render without syntax highlighting
- **Lazy Highlighting**: Code blocks highlighted on scroll
- **IntersectionObserver**: Efficient viewport detection

### File Watching
- Auto-reload on file changes
- Preserves scroll position
- Minimal re-renders

### Bundle Optimization
- Tree-shaking enabled
- CSS minification
- Code splitting (planned)
- Dynamic imports (planned)

## 🎯 Future Optimizations

### Planned Bundle Reductions
- [ ] Selective highlight.js imports (~70% JS reduction)
- [ ] Dynamic import of highlighter (~80% initial load reduction)
- [ ] Lazy load mark.js (~100 KB saved)
- [ ] Manual chunk splitting in Vite config

### Target Bundle Size
- **CSS**: 19 KB ✅ (achieved)
- **JS**: ~300 KB (from current 1,027 KB)
- **Total**: ~320 KB (~100 KB gzip)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Dracula Theme** - Official color scheme
- **Tauri** - Amazing desktop framework
- **Marked** - Markdown parsing
- **Highlight.js** - Syntax highlighting
- **Sora Font** - Primary typeface
- **Kode Mono** - Monospace font for code

## 📬 Contact

For questions, issues, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ using Tauri, Vite, and Rust**
