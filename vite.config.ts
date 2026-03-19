import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/** Inject noindex meta tag for staging builds (GitHub Pages) */
function noindexPlugin(): Plugin {
  return {
    name: "inject-noindex",
    transformIndexHtml(html) {
      if (!process.env.GITHUB_PAGES) return html;
      return html.replace(
        '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />',
        '<meta name="robots" content="noindex, nofollow" />'
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.GITHUB_PAGES ? "/femradd-voice/" : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), noindexPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-ui": ["lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: mode !== "production",
  },
}));
