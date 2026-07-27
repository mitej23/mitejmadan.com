import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
    cssMinify: "lightningcss",
    // One JS file and one CSS file. At this size, splitting only costs round trips.
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
