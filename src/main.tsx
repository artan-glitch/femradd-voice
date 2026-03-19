import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;

if (root.children.length > 0) {
  // Pre-rendered HTML exists — hydrate to preserve it for SEO
  hydrateRoot(root, <App />);
} else {
  // Dev mode or fresh load — full client render
  createRoot(root).render(<App />);
}
