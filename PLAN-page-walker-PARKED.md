# PARKED — the page-walker fallback

**Status: not being built.** Parked deliberately, at Mitej's request, as the
fallback if the tile assets ever prove insufficient.

The tiled town (`PLAN-overworld-m2.md`) is the current direction and the asset
pack turned out to be enough for it. This document exists so the alternative
isn't lost.

---

## The idea

Instead of a separate tiled world, **the character walks around the real
website.** No map, no tilesets, no buildings — the site *is* the level.

Two variants:

1. **Walk.** A sprite stands on your actual layout and moves with the arrow keys.
2. **Cycle.** Same, but on the bike — faster, and it justifies covering a long
   page. The sheet in `pok3` already declares a `cycle` animation, and the base
   body sheet has bike frames in it.

## Why it's a genuinely good fallback

**It needs almost no art.** One character sheet. That's the entire dependency.
Every other requirement — ground, obstacles, landmarks, interiors — is already
satisfied by the DOM, which the browser has laid out for us.

**The terrain is free and it's already meaningful.** This site is one narrow
column of hairline rules. Read the bounding rects and you get, for nothing:

| DOM element | Becomes |
|---|---|
| Section heading rules | Ledges you stand on |
| `border-t` on each project / system row | A staircase down the page |
| Photo `<figure>` boxes | Solid platforms |
| The nav pill | A floating platform |
| Footer rule | The ground floor |

Walking `/experience` means stepping down through the career, one role per ledge.
That reading is only available *because* the layout is what it is — a maximalist
site couldn't do this.

**It scales with content automatically.** Add a project row and a new platform
appears. No map to update, and no possibility of the world drifting out of sync
with the résumé — the failure mode the tiled version needs a build-time check to
prevent.

## How it would work

- **Terrain from `getBoundingClientRect()`**, collected once on mount and
  re-collected on resize. Each rect's top edge is a one-way platform: you land on
  it from above and jump up through it from below.
- **Simple platformer physics** rather than grid-locked movement — gravity,
  horizontal acceleration, a jump. Grid movement makes no sense against
  arbitrary layout geometry.
- **The camera is the scroll position.** Walking past the bottom of the viewport
  scrolls the page. That's the trick that makes it feel like the site rather than
  a game on top of the site: you are moving the document.
- **The sprite is one `position: fixed` element** with `image-rendering: pixelated`
  and a `translate3d` transform, or a small transparent canvas overlay. Either is
  a few KB.
- Interaction: press A near a link to follow it, so the character can navigate
  between routes.

## What it costs

| | |
|---|---|
| Assets | One character sheet (~1.5 KB) |
| Code | Physics + rect collection + input. Comparable to the tile engine, maybe smaller |
| Risk | Layout-dependent — a CSS change can move the terrain. Needs re-collection on resize, font swap, and route change |
| Accessibility | Same handling as the tiled version: real button to enter, Esc to leave, reduced-motion respected, content never game-only |

## Honest problems

1. **It fights the scroll.** Two things want to control the viewport — the walker
   and the reader. Getting that to feel good rather than annoying is the whole
   difficulty, and it isn't a small one.
2. **Fragile terrain.** Restyle a section and the platforms move. The tiled map is
   fixed geometry; this one is emergent, which is charming until it isn't.
3. **Mobile is worse than the tiled version**, not better — a walker fighting
   touch-scroll is a genuinely bad experience.
4. **It's a toy, not a second reading of the CV.** The tiled town can put a role
   behind a door and eight systems on a shelf. The walker can only let you walk
   past text you could already read. That is the real argument against it.

## When to reach for this

- The tile assets turn out to be unusable or licence-blocked
- The tiled town stalls on missing interiors and we want a shipped delight
  moment rather than a half-built map
- Or as a *second* mode alongside the town, since the two share nothing and
  neither blocks the other

## What already exists toward it

`pok3` declares `cycle`, `run`, `surf` and `fish` animations at 40×40 across four
directions, so if the walker ever gets built with an exported sheet from that
generator, the bike variant is close to free.
