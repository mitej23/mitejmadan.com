import { renderToString } from "react-dom/server";
import { App, pages } from "./App";
import { setRenderPath } from "./lib/router";
import { profile } from "./content";

/** Used only by scripts/prerender.mjs at build time. Never shipped to the browser. */

export const routes = Object.keys(pages) as (keyof typeof pages)[];

export function titleFor(path: string) {
  return pages[path as keyof typeof pages]?.title ?? `Not found · ${profile.name}`;
}

export function render(path: string) {
  setRenderPath(path);
  return renderToString(<App />);
}
