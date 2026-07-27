/**
 * Bakes each route into a complete HTML file after the client build.
 *
 * Why: the content is fully static, so making a visitor download and execute
 * ~68KB of React before seeing anything is pure latency. With this step the
 * markup and CSS alone paint the finished page, and the JS arrives afterwards to
 * hydrate the nav, theme toggle, and clock.
 *
 * Output: dist/index.html, dist/projects/index.html, dist/experience/index.html,
 * plus dist/404.html. Any static host serves those directly — no rewrite rules,
 * no SPA fallback needed for the real routes.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const SITE = "https://mitejmadan.com";

const { render, routes, titleFor } = await import(
  join(dist + "-ssr", "entry-server.js")
);

const template = await readFile(join(dist, "index.html"), "utf8");

function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function build(path, { title, body, canonical }) {
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`);
  html = html.replace(
    /(<meta property="og:title" content=")[^"]*(")/,
    `$1${escapeAttr(title)}$2`,
  );
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`);

  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  if (!html.includes('id="root">')) {
    throw new Error(`prerender: root mount point not found while building ${path}`);
  }
  return html;
}

const written = [];

for (const path of routes) {
  const out = path === "/" ? join(dist, "index.html") : join(dist, path, "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(
    out,
    build(path, {
      title: titleFor(path),
      body: render(path),
      canonical: path === "/" ? `${SITE}/` : `${SITE}${path}`,
    }),
  );
  written.push([path, out]);
}

// Static hosts serve this for anything that didn't match above.
const notFound = join(dist, "404.html");
await writeFile(
  notFound,
  build("/404", {
    title: titleFor("/404"),
    body: render("/404"),
    canonical: `${SITE}/`,
  }),
);
written.push(["404", notFound]);

for (const [path, out] of written) {
  const { size } = await readFile(out).then((b) => ({ size: b.byteLength }));
  console.log(`  prerendered ${String(path).padEnd(12)} ${(size / 1024).toFixed(1)} kB`);
}
