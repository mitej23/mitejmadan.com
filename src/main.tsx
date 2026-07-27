import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

const root = document.getElementById("root")!;

const tree = (
  <StrictMode>
    <App />
  </StrictMode>
);

// `npm run build` prerenders each route, so in production there is already markup
// to adopt. In `npm run dev` the container is empty and we mount from scratch.
if (root.firstElementChild) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
