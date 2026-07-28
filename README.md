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
It's drawn from `Mitej_Madan_Resume (1).pdf` and `github.com/mitej23`. The résumé
ends July 2023 and predates TheAgentic, so everything after that point is still
unverified and marked. Find them with:

```bash
grep -n "TODO" src/content.ts
```

In priority order:

| # | What | Why it matters |
|---|------|----------------|
| 1 | **`offClock`** | Invented. The résumé had nothing personal in it. A generic hobbies line is worse than deleting the section. |
| 2 | **Food Ordering System link** | The résumé's URL (`mitej23/restaurant-app`) 404s — renamed, deleted, or private. The entry currently renders with no link at all. |
| 3 | **`profile.resume`** | Deliberately `null`, which hides the nav link. You called the PDF outdated, and publishing it under "Résumé" would misrepresent you. Drop a current one at `public/resume.pdf` and set the path to restore the link. |
| 4 | **Three project blurbs** | `db-alembic-schema-viewer`, `llm-math-visualiser`, and `canvas-editor` have no repo descriptions, so those blurbs are my reading of the code. |
| 5 | **`stack`** | Evidence-based only. I removed my earlier guesses (FastAPI, Redis, Docker, AWS) rather than assert them — add what you actually use at TheAgentic. |
| 6 | **`links.email`** | Set to the work address. Switch if you'd rather personal mail (the résumé lists `mitejmadan@gmail.com`). |
| 7 | **`photo.caption`** | Just says "Thailand". The cliffs look like Krabi, but I'm not guessing the beach or year on your behalf. |

Verified from the résumé and needing no attention: the Idigitize Infotech role,
education, and the Boardly / Campaigns / College Data Collection blurbs.

Two things from the résumé I left off on purpose: the certifications (Coursera
Neural Networks, Blue Array SEO) and the HSC entry — neither earns its space
next to the rest. Add them back if you disagree.

Then update the domain: `SITE` in `scripts/prerender.mjs`, and the `canonical` /
`og:*` / JSON-LD URLs in `index.html`.

## The anonymised systems

`systems` in `src/content.ts` describes eight systems built at TheAgentic and
renders them on `/experience`. The dense half of each — what made it hard, and
whose work it was — sits behind a native `<details>`, so eight of them stacked
reads as a list rather than a wall. It opens with JS off. **No product, company, or client name appears in
any of them**, and nothing identifies a specific customer. What's kept is the
sector, the architecture, and the engineering — standard practice for work under
NDA, and the part a reader is actually evaluating.

Every claim was read out of the source by a reviewer rather than lifted from a
README, and `role` is set on any entry where the work was one part of a larger
team effort — including one entry that was an architecture assessment with no
production code of his in it at all. Two things were deliberately *not* claimed:
test coverage or production-hardening for the court-sync subsystem (it has no
committed tests, by that team's explicit policy), and any production metric —
user counts, request volumes, uptime — because none is verifiable from the code.

Terminology follows what frontier-lab engineering writing actually uses:
*orchestrator-worker*, *lead agent*, *subagent*, *agent harness*,
*human-in-the-loop*. Notably **not** "supervisor agent", which reads as standard
but appears in none of the current primary sources.

There's a leak check worth re-running after any edit to that section:

```bash
grep -rEioh -f .leakcheck dist/ src/
```

It should return nothing. (`src/lib/reveal.ts` matches "nishe" inside the word
"finishes" — that's the one known false positive.)

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

- **Contrast** — 70 text nodes, 0 below WCAG AA in either theme (lowest 4.72:1
  light, 6.31:1 dark). `--color-ink-4` is below AA by design and is decorative
  only; every text token is at or above `--color-ink-3`.
- **`prefers-reduced-motion: reduce`** — no element left below full opacity.
- **JavaScript disabled** — all 23 `.reveal` elements visible, full text content
  present.
- **Keyboard** — skip link first, logical tab order, 2px visible focus ring on
  every interactive element.
- **320px viewport** — nav pill is 240px, clears the narrowest common viewport
  without clipping (it's centred by transform, so overflow would cut both ends).
- No console errors or hydration warnings.

## Keyword emphasis

Prose in `content.ts` can mark a term with `*asterisks*`. `Rich` (src/components/Rich.tsx)
splits on that and wraps it in `.kw`, which draws an ember rule under the term as
the line arrives. No markdown parser ships — it's one regex split.

Two things to know before using it:

- **Only fields rendered through `Rich` may contain markers.** `profile.status`,
  titles, captions, and alt text render raw, and a marker there prints literal
  asterisks on the page. That happened once already.
- The rule is a **background gradient with `box-decoration-break: clone`**, not a
  `::after`. A pseudo-element only tracks one line fragment, so any phrase that
  wrapped silently lost its underline.

## The hero wash

`/` has a slow WebGL mesh gradient across the top (`@paper-design/shaders-react`,
Apache-2.0). It costs **~8KB gzipped** — the package is 410KB unpacked but one
shader tree-shakes down hard.

It is bounded by contrast, not taste. `--color-ink-3` clears WCAG AA on the page
background by only 4.72:1, so the wash may not darken what sits behind it by
much. At 0.3 opacity with the current tones the composited hero measures 4.68:1.
**Darkening the palette or raising the opacity will push it under 4.5** — the
CSS-level contrast check cannot catch this, because it reads computed colours
rather than rendered pixels. Measure the actual composite if you change it.

Mounts a frame after hydration, fades in, and freezes (`speed 0`) under
`prefers-reduced-motion`.

## Images

There is exactly one photograph on the site, and it does three jobs. All of it
derives from a single 3024×4032 original (`B0BFF346….JPG`), cut with `cwebp`,
which crops, resizes, and encodes in one pass:

| Output | Crop | Used for |
|---|---|---|
| `public/avatar-256.webp` (9.5KB) | tight on the face, 640² at (1075, 2204) | 52px hero avatar |
| `public/photos/thailand-{400,600,900}.webp` (11–37KB) | square, `y=1000` | "Off the clock" |
| `public/og.jpg` (85KB) | portrait, 2286×3000 at (252, 1000) | social card |

The top half of the original was empty sky. Dropping it is what puts the
limestone cliffs, the water gradient, and the sand into one composition — worth
knowing if you ever re-crop.

The `<img>` carries `srcset` + `sizes`, so a 272px slot at DPR 2 pulls the 600w
file and a full-width phone pulls the 900w. Behind it sits a **203-byte 20×20
WebP inlined as a data URI** (`photo.lqip` in `src/content.ts`), scaled up as a
background: the frame shows the photo's real colours from the first paint,
including before any JS runs, and the real file fades over it on decode. The
avatar is eager and `fetchpriority="high"`; the photo is `loading="lazy"`.

Net cost above the fold: ~9.7KB.

`public/og.jpg` and `public/apple-touch-icon.png` were produced by screenshotting
a small HTML card in headless Chromium. No build dependency on that — they're
committed as plain files. To redo them, render a 1200×630 (or 180×180) page and
screenshot it.

### The one grid break

`/` is a single 39rem column everywhere except "Off the clock", which goes
two-column at `sm` (photo in a 17rem track, text beside it) and stacks below it.
That asymmetry is deliberate and it is the only one — it's what makes the photo
read as a pause rather than decoration. If you add a second break, this one
stops working.

## Deploying

Any static host. Build command `npm run build`, output directory `dist`.
No configuration needed — the real routes exist as files, and `404.html` covers
the rest.
