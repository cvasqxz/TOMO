# TOMO (とも) - Minimalist Markdown Reader

> An elegant and minimalist Markdown reader built with Tauri

## ✨ Features

- 📖 **Beautiful Rendering** - Elegant Markdown visualization with syntax highlighting
- 🎨 **Dracula/Alucard Themes** - Dark and light modes inspired by classic themes
- 🖱️ **Drag & Drop** - Drag files directly into the window
- ⚡ **Fast and Lightweight** - Built with Tauri for maximum performance
- 💾 **Theme Persistence** - Your preferred theme is saved automatically
- 🔒 **Secure** - Content Security Policy implemented

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- Bun or npm

### From Source Code

1. Clone the repository:
```bash
git clone https://github.com/your-user/tomo.git
cd tomo
```

2. Install dependencies:
```bash
bun install
# or if you use npm:
npm install
```

3. Run in development mode:
```bash
bun run tauri dev
# or with npm:
npm run tauri dev
```

4. Build for production:
```bash
bun run tauri build
# or with npm:
npm run tauri build
```

## 🎯 Usage

1. **Open File**: Click "Open .md File" or drag an .md file into the window
2. **Switch Theme**: Click the button in the top right corner
3. **Close/Open another file**: Simply select or drag a new file

## 🎨 Themes

- **Dracula (Dark)**: Classic Dracula color palette - perfect for night use
- **Alucard (Light)**: Complementary palette for light mode - designed for daytime

## 🛠️ Technologies

- [Tauri](https://tauri.app/) - Cross-platform framework
- [Marked](https://marked.js.org/) - Markdown parser
- [Highlight.js](https://highlightjs.org/) - Syntax highlighting
- [Pico CSS](https://picocss.com/) - Minimalist CSS framework
- [Vite](https://vitejs.dev/) - Ultra-fast build tool

## 📁 Project Structure

```
TOMO/
├── src/                    # Frontend
│   ├── main.js            # Main app logic
│   └── assets/            # Resources (icons, logos)
├── src-tauri/             # Backend (Rust)
│   ├── src/
│   │   ├── lib.rs         # Tauri configuration
│   │   └── main.rs        # Entry point
│   └── tauri.conf.json    # Tauri configuration
├── index.html             # Main HTML
├── package.json           # Project dependencies
└── vite.config.js         # Vite configuration
```

## 🔒 Security

- **Content Security Policy (CSP)** configured to prevent XSS attacks
- **File Validation**: Only accepts .md and .markdown files
- **Size Limit**: Maximum 10MB per file
- **Escaped HTML**: Secure error messages against injection

## 📝 License

MIT License - See LICENSE file for more details

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss major changes.

## 📧 Contact

Created by [@cvasqxz](https://github.com/cvasqxz)
