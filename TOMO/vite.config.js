import { defineConfig } from "vite";

export default defineConfig({
  // Prevenir que Vite limpie la consola
  clearScreen: false,
  // Puerto de Tauri
  server: {
    port: 1420,
    strictPort: true,
    host: true,
  },
  // Opciones de construcción para Tauri
  build: {
    target: "esnext",
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-highlight": ["highlight.js"],
          "vendor-markdown": ["marked", "marked-highlight"],
          "vendor": ["dompurify", "mark.js"],
        },
      },
    },
  },
});
