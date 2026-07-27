# mitej — personal site

Single-page personal site. Prerendered at build time, hydrated after, so the page
paints without waiting on JavaScript.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/ (client build + SSR build + prerender)
npm run preview    # serve dist/ exactly as a host would
npm run typecheck
```

## Before this goes live

All copy lives in **`src/content.ts`** — nothing else needs editing to change text.
It was drafted from your public GitHub and TheAgentic; LinkedIn blocks scraping
(HTTP 999), so anything that could only have come from a résumé is marked. Find
them with:

```bash
grep -n "TODO" src/content.ts
```

In rough priority order:

| # | What | Why it matters |
|---|------|----------------|
| 1 | **`experience`** — real companies, titles, dates | Currently reads `TODO — earlier role` and `TODO — Present`. This is the most visible placeholder on the site. |
| 2 | **`offClock`** | Pure invention on my part. A generic hobbies line is worse than no section. |
| 3 | **`profile.intro`** | Verify the claims and framing. |
| 4 | **CortexON entry** in `projects` | Confirm your actual role, or delete the entry. |
| 5 | **`Boardly` blurb** | The repo has no description, so I guessed "collaborative whiteboard". |
| 6 | **`profile.resume`** | Drop a PDF at `public/resume.pdf`, or set to `null` to hide the nav link. |
| 7 | **`stack`** | Prune anything you wouldn't want to be interviewed on. |
| 8 | **`profile.avatar`** | Optional. `null` renders a monogram; set to e.g. `"/avatar.webp"` for a photo. |

Then update the domain: `SITE` in `scripts/prerender.mjs`, and the `canonical` /
`og:*` / JSON-LD URLs in `index.html`.

## How it's built

Vite + React 19 + Tailwind v4. No router, no animation library, no icon package —
each was replaced with something small enough to read in one sitting:

| Instead of | We have | Where |
|---|---|---|
| React Router (~20KB) | ~50-line history wrapper | `src/lib/router.tsx` |
| Framer Motion (~35KB) | CSS keyframes + one shared IntersectionObserver | `src/index.css`, `src/lib/reveal.ts` |
| An icon package | 6 inline SVG paths | `src/components/Socials.tsx` |
| Google Fonts CDN | self-hosted variable woff2, preloaded | `public/fonts/` |

Ships as one CSS file and one JS file: **~6.8KB CSS + ~68KB JS gzipped**, plus a
30KB font. The JS is not on the critical path — the prerendered HTML and CSS paint
the finished page on their own.

### Prerendering

`npm run build` runs three steps: the client build, an SSR build of
`src/entry-server.tsx`, then `scripts/prerender.mjs`, which renders each route to
a complete HTML file:

```
dist/index.html            dist/projects/index.html
dist/experience/index.html dist/404.html
```

Any static host serves those directly — no rewrite rules or SPA fallback needed.
`src/main.tsx` calls `hydrateRoot` when it finds existing markup and `createRoot`
otherwise, so `npm run dev` still works normally.

Two consequences worth knowing about:

- **Nothing may bake a timestamp into the markup.** `LocalTime` renders `--:--`
  until mount for exactly this reason — a clock in prerendered HTML would ship
  frozen at build time.
- **`.reveal` is scoped under `.js`** (set by the inline script in `index.html`).
  Without that, a visitor whose JS failed would get a hero and then a blank page,
  because `.reveal` is the one animation that needs a script to complete.

### Theme

`data-theme` on `<html>`, set by an inline script in `<head>` before first paint,
so there's no flash. It's the single source of truth — even the toggle's own icon
is driven by CSS off that attribute rather than React state, which keeps the
prerendered markup and the hydrated tree identical. Defaults to the OS preference
and follows it until the visitor picks explicitly.

### Motion

Two mechanisms, both CSS:

- `.enter` — above-the-fold choreography, plays on mount.
- `.reveal` — everything else, flipped to `.is-in` by the shared observer in
  `src/lib/reveal.ts`. One-shot: elements are unobserved once they arrive.

Both read `--i` for stagger (55ms per step) and animate only `opacity` and
`transform`. Exponential ease-out throughout — nothing bounces. Route changes
reuse the same choreography: `App.tsx` keys `<main>` on the path, so navigating
remounts the tree and replays the entrance.

## Verified

Checked against the production build in headless Chromium:

- **Contrast** — 63 text nodes, 0 below WCAG AA in either theme (lowest 4.72:1
  light, 6.31:1 dark). `--color-ink-4` is below AA by design and is decorative
  only; every text token is at or above `--color-ink-3`.
- **`prefers-reduced-motion: reduce`** — no element left below full opacity.
- **JavaScript disabled** — all 21 `.reveal` elements visible, full text content
  present.
- **Keyboard** — skip link first, logical tab order, 2px visible focus ring on
  every interactive element.
- **320px viewport** — nav pill is 304px, clears the narrowest common viewport
  without clipping (it's centred by transform, so overflow would cut both ends).
- No console errors or hydration warnings.

## Assets

`public/og.png` and `public/apple-touch-icon.png` were generated by screenshotting
a small HTML card in headless Chromium. There's no build dependency on that —
they're committed as plain files. To redo them, render a 1200×630 (or 180×180)
page and screenshot it.

## Deploying

Any static host. Build command `npm run build`, output directory `dist`.
No configuration needed — the real routes exist as files, and `404.html` covers
the rest.
