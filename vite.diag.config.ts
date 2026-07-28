// Diagnostic build only — not part of `npm run build`.
//
// Forces React's development bundles so hydration mismatches report a full
// element-by-element diff instead of "Minified React error #418". This is how the
// router's getServerSnapshot bug was found: every prerendered sub-page was
// hydrating as the home page and silently discarding its server HTML.
//
//   npx vite build -c vite.diag.config.ts
//
// then serve dist/ with a static server that resolves /experience to
// experience/index.html. Do NOT use `vite preview`: it falls back to
// dist/index.html for every sub-route and manufactures a mismatch that does not
// exist on a real static host.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
const OUT = "/private/tmp/claude-501/-Users-mitej-Desktop-portfolio-site/ca8f6ba8-6207-43af-a9e0-4afe79b77537/scratchpad/distdev";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { conditions: ["development", "browser", "module", "import", "default"] },
  define: { "process.env.NODE_ENV": '"development"' },
  build: { target: "es2022", minify: false, outDir: OUT, emptyOutDir: true },
});
