# Overworld mode — plan

A Gen-3-style walkable overworld as a second way to read this résumé. Not a
gimmick bolted on the side: the map *is* the CV, laid out west→east in
chronological order, so walking forward is walking through the career.

---

## 1. What the assets actually are

I checked both folders before planning, because the plan depends on it.

**`~/Desktop/pok3` — a character *generator*, not a sprite sheet.**
`manifest.tds` declares `id = "pokemon-gen-3"`, `dims = [40, 40]`, directions
`["S","W","E","N"]`, and animations `walk / idle / run / fish / cycle / surf /
use_pokeball`. But `bases/body/default-male.png` (760×160 = 19 frames × 4 rows)
is a **base layer only** — the green is `BASE_SKIN = #b8f8b8`, a palette key. No
head, face, or clothes. The real character is assembled from 19 layer categories
(`head`, `hair`, `hair-front`, `hair-back`, `eyes`, `hat`, `hat-mask`, `dm-top`,
`dm-bottom`, `dm-shoes`, …) through the `.tds` script, in a desktop tool I don't
have.

→ **Consequence:** to use *your* character, you export one composited sheet from
that tool. Until then we use the demo trainer. The sprite sheet path is a single
config value, so swapping it later is a one-line change and nothing else moves.

**`~/Desktop/Pocket Creature Tamer DEMO` — finished, usable, and tiny.**

| Asset | Size | What it gives us |
|---|---|---|
| `Characters/character01-Sheet.png` | 128×96, **1.4 KB** | 32×32 frames, 4 cols × 3 rows: front / side / back. Left is the side row mirrored — the standard Pokémon layout. |
| `Tilesets/Grass.png` | 192×96 | Ground, edges, corners |
| `Tilesets/path_0{1,2,4,5}*.png` | 192×64 ea. | Four path variants |
| `Tilesets/Fences.png` | 64×64 | Boundaries |
| `Enviroment/Buildings/premade_builds.png` | 224×224 | **Three finished buildings** — a large storefront, a red-roof house, a green-roof house |
| `Enviroment/Vegetation/` | bush 48×48, flowers 80×64 | Detail, and tall grass |
| `Creatures/` | 6 sprites | See §5 — these get a job |

Every dimension divides by 16, so it's a **16 px tile grid**. Total needed:
**~60 KB of PNG.**

---

## 2. The one rule that makes this safe

This site's whole argument is that it loads before you can doubt it — currently
**86 KB of JS gzipped, prerendered, no router and no animation library.** A tile
engine plus assets would undo that for every visitor who never plays.

**So the game is a lazily-loaded chunk behind a dynamic `import()`.**

- Base site: **byte-for-byte unchanged.** Same prerendered HTML, same 86 KB.
- Engine + assets download **only** when someone enters the pipe.
- Budget for the game chunk: **< 25 KB gz JS + 60 KB assets.** If it exceeds
  that, something is wrong with the approach, not the budget.
- All eight prerendered routes stay crawlable. Game state is never the source of
  truth for any content.

This is non-negotiable and it shapes everything below.

---

## 3. Three phases

### Phase A — the page-walker

A 32×32 sprite appears on the real page and walks around it with **arrow keys /
WASD**. The unique part: **its ground plane is your actual layout.** I read the
bounding rects of the hairline rules under each section heading and use them as
ledges. On `/experience` that means walking along your career, literally — each
role a platform you can stand on.

This is only possible *because* the site is one narrow column of horizontal
rules. The layout that made the site calm is what makes it walkable.

### Phase B — the pipe, and breaking the page

A Mario pipe sits fixed in the **top-right**. Walk in and press **Down**:

1. **Pixelate.** An SVG filter (`feFlood` + `feTile` + `feComposite`, plus
   `feMorphology dilate`) applied to `#root`, radius animated 0 → 8 over ~500 ms.
   This genuinely pixelates live DOM — no screenshot library.
2. **Break.** A FireRed-style **tile wipe**: a CSS grid of squares scaling in on
   staggered delays, which is exactly how the real games change scene.
3. Overworld fades up. Filter is removed immediately — see §7 for why that
   matters.

### Phase C — the overworld

Canvas 2D, integer-scaled ×3 (16 px → 48 px), `imageSmoothingEnabled = false`.
**Grid-locked movement**, 8 frames per tile with buffered input — not free
physics. That tile-by-tile feel is what makes it read as Gen 3 rather than as a
platformer.

---

## 4. The map is the résumé

Laid out **west → east in chronological order**. You spawn at the west end in
2022 and walk forward through time.

```
  W ────────────────────────────────────────────────────────────► E
  [green house]      [red-roof house]        [ large storefront ]
   Idigitize          Education               TheAgentic
   Dec 22–Jul 23      MCA 2024 / BSc 2023     Dec 2024 – present
        │                    │                        │
        └──── path ──── tall grass ──── path ─────────┘
                        (projects)
```

- **Building size tracks the role**, as you asked: TheAgentic gets the large
  storefront, Idigitize the small green house.
- **Inside TheAgentic:** a PC terminal. Interact and the 8 systems page through
  one at a time in a Pokémon dialogue box — `title`, then `body`, then "what made
  it hard", with the `Scope —` line as flavour text. The disclosure pattern from
  the real page maps onto dialogue pagination almost exactly.
- **Signposts** carry the stack list.
- **A gallery room** with framed pictures on the wall — your photographs,
  examinable one at a time.

## 5. Tall grass = projects

Walk through tall grass and instead of a battle:

> **A wild BOARDLY appeared!**

A card slides up with the project name, blurb, and stack — and the six
`Creatures/` sprites finally have a purpose, one per project. It is a joke that
happens to be a genuinely good index of your work, which is the best kind.

---

## 6. Content parity, enforced

The overworld reads **from `src/content.ts`** — the same source the real pages
use. No duplicated copy, ever.

Better: a **build-time check** that every `systems[]`, `experience[]`, and
`projects[]` entry has a home on the map, failing the build if not. Add a ninth
system and the build tells you the map is stale. That's what stops this from
rotting into a stale toy six months from now.

---

## 7. Non-negotiables

| Concern | Handling |
|---|---|
| **Escape hatch** | `Esc` always exits to the normal site, restoring scroll position. The game is never a trap. Flavour text: *"You blacked out and woke up at the last Pokémon Center."* |
| **Reduced motion** | `prefers-reduced-motion` skips pixelate and wipe entirely — hard cut. The overworld still works; only the spectacle goes. |
| **Mobile** | No keyboard. Either an on-screen D-pad, or don't offer the pipe below `sm`. **My recommendation: offer it, with a D-pad** — hiding it means most visitors never see the thing that makes the site memorable. |
| **Accessibility** | The pipe is a real focusable `<button>` with a label, not a hidden easter egg. Entering announces the mode change via a live region. All content stays in the real DOM and prerendered HTML — the game is an *alternative* view, never the only one. |
| **Licensing** | ⚠️ See §9. |

---

## 8. Build order

Deliberately **not** the order you described it in — riskiest and most
architectural first, so we find out early if anything won't work.

| # | Milestone | Why here |
|---|---|---|
| ~~**M1**~~ | ~~Lazy route + pipe button + pixelate/wipe + an empty walkable grass field~~ **DONE** | Architecture holds: engine is a 1.6 KB gz chunk, not referenced in the HTML, fetched only on use. Base site unchanged. |
| **M2** | Real map, buildings, collision, camera | The world |
| **M3** | Interiors + dialogue reading from `content.ts` | The content, and the parity check |
| **M4** | Tall grass → project cards, creature sprites | The delight |
| **M5** | Phase A page-walker | Last: fiddliest, and the only part that isn't needed for the rest to be great |

Each milestone is reviewable on its own. Stop whenever it's good enough.

**The one thing to prototype first:** SVG filters force a repaint of the whole
filtered subtree, and `feMorphology` performance varies (Safari especially). M1
exists to find that out cheaply. If it's slow, fallback is a straight tile wipe
with no pixelate — still looks great, loses one beat.

---

## 9. Licensing — settled

Mitej purchased the pack license, so the real assets are committed. Original
notes kept below for the record.

### Original concern (resolved)

Neither folder contains a licence or readme. `Pocket Creature Tamer DEMO` is
clearly a **demo asset pack**, and demo packs commonly forbid redistribution.

**This repo is now public.** Committing those PNGs to it *is* redistribution —
a different act from using them in a local project. You cared about legal
exposure with the client work, so the same care applies here.

Options:

1. **Find the licence** for the pack (itch.io page or the original download) and
   confirm what it permits. Best outcome.
2. **Buy the full version** if the demo is a trial for a paid pack — usually
   cheap, and usually grants exactly this use.
3. **Draw replacements.** The map only needs grass, path, fence, three
   buildings, tall grass. That's a day of pixel art, and then it's unambiguously
   yours.
4. **Export your own character** from `pok3` regardless — that one *is* yours to
   configure, though the generator's own licence still applies to output.

~~I'd build M1 with placeholder coloured rectangles~~ — no longer needed. Note
this covers the *Pocket Creature Tamer* pack only; `pok3` is a separate tool
whose license was never discussed.

---

## 10. Open questions

1. **Licensing** (§9) — the only true blocker.
2. **Custom character?** Export from `pok3`, or ship the demo trainer for now?
3. **Mobile D-pad** — worth the extra work, or desktop-only?
4. **How discoverable?** A visible labelled pipe, or hidden until you find it?
   Hidden is more fun; visible is the reason anyone sees it at all.


---

## 11. M1 notes — what actually happened

**The pixelate filter cost a debugging pass.** `filter: url(#…)` on `<html>`
reports correctly in `getComputedStyle` and never paints in Chromium. The CSS
looked right, the filter existed, the computed value was set, and the page stayed
sharp. Proving the filter itself worked — by applying it to a throwaway gradient
div — was what isolated it. Everything now filters `#site`, a wrapper added in
`App.tsx`, which also avoids making the root a containing block for the fixed
overlays.

**Two bugs found by measuring rather than looking:**

- The pipe overlapped the centred nav pill at 320px and 375px — the two most
  common phone widths. It is now hidden below `sm`, which is also honest given
  there are no touch controls yet.
- Grass was initially tile 51, which is a flat colour fill, so the field rendered
  as a plain green background. The dithered textures are rows 1–3, cols 2–3;
  it now uses 26 with 27 scattered on a hash so the variation never shimmers
  between frames.

**Measured:** engine chunk **1.6 KB gz**, assets **28 KB**, main bundle
**88.4 KB gz** (+2.5 KB for the pipe and transition, which is the part that
cannot be lazy). No `modulepreload` for the chunk — verified absent from the
built HTML, so it genuinely does not load until used.
