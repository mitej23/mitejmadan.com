# M2 — making the overworld worth entering

M1 proved the plumbing. As an *experience* it is nothing: an empty 40×30 field of
noisy grass with a tiny sprite and no reason to press a key. This is the plan to
fix that, and an honest answer on whether the asset pack can carry it.

---

## 1. Is the asset pack enough?

**For one good-looking outdoor town: yes. For interiors or multiple regions: no.**

Complete inventory — 16 files, 62 KB:

| Have | Detail | Verdict |
|---|---|---|
| Character | 32×32, 4 frames × 3 rows | ✅ Enough (no NPCs though) |
| **3 buildings** | one 224×224 sheet: large storefront, red-roof, green-roof | ✅ Exactly the three roles need |
| Grass | 12×6 — textures + **two autotile edge crosses** | ✅ Proper blending possible |
| **4 cobblestone paths** | 12×4 each, full autotile sets with corners | ✅ Real paths, not stripes |
| Fences | 4×4 — posts, rails, corners | ✅ Enough to enclose |
| Bush | one 1.5-tile sprite | ⚠️ One. Reusable as tall grass |
| Flowers | 3 small clusters + 1 large patch | ✅ Good for decoration |
| Creatures | 3 monsters, 3 frames each | ✅ Enough for the projects gag |

**What is missing, and it matters:**

| Missing | Consequence |
|---|---|
| **Interior tiles** (floors, walls, furniture) | Tiled rooms are *impossible*. Walking into a building cannot lead to a room. |
| Water, trees, cliffs, ledges | No terrain variety. One flat grass plane is all we can build. |
| NPC sprites | Nobody to talk to. Only the player exists. |
| Signposts | No object to hang text on — has to be improvised from fence posts |

### The design decision that falls out of this

**Doors open a dialogue overlay, not a room.** Walk to a door, press A, and a
Gen-3 dialogue box rises over the map with that role's content, paged through.

This is not a compromise I'm apologising for — it's better here:
- Sidesteps the missing interior tiles entirely
- Far less work than building and decorating three rooms
- **Much more readable for résumé content** than making someone walk to a
  bookshelf to read a paragraph
- Authentic: Gen-3 signs, PCs and NPCs all deliver text exactly this way

If you later want real interiors, that needs an interior tileset — one purchase,
or a day of pixel art. Not blocking.

---

## 2. Why the current build looks bad — specifically

Six nameable faults, not "needs polish":

1. **Nothing to walk toward.** 1,200 tiles of identical grass.
2. **Ground noise.** I scatter a second grass texture on every 7th tile by hash.
   Across a full screen that reads as static. Real Gen-3 uses **one** uniform
   base tile and puts variety in *objects*, not the ground.
3. **Zoomed too far out.** `TARGET_TILES_WIDE = 17` makes the character tiny and
   the emptiness maximally visible. Gen 3 shows **~10 tiles wide**.
4. **Map far too large for its content.** 40×30 empty. Dense beats big.
5. **No interaction verb.** Nothing responds to any key but the arrows.
6. **No onboarding.** You arrive, see grass, and leave.

---

## 3. The map

**36 × 28 tiles.** Small enough to fill properly, big enough that the camera
moves and there's somewhere to go. Spawn at the **south gate facing north**, so
the first frame already shows the town and the buildings pull you forward.

```
                    ┌────────── 36 tiles ──────────┐
   N   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   fence
       ▓                                        ▓
       ▓        ┌────────────────┐              ▓
       ▓        │  THE AGENTIC   │  ← storefront, largest
       ▓        │   (8 systems)  │              ▓
       ▓        └───────[door]───┘              ▓
       ▓   ┌────────┐    ║    ┌────────┐       ▓
       ▓   │IDIGITIZE│   ║    │EDUCATION│      ▓   28
       ▓   │ (role)  │   ║    │ (2 degs)│      ▓  tiles
       ▓   └──[door]─┘   ║    └─[door]──┘       ▓
       ▓       ╚═════════╬═════════╝            ▓
       ▓                 ║   ← cobblestone plaza▓
       ▓   ✿ ✿      ┌────╫────┐        ✿        ▓
       ▓          ░░░░░░░░░░░░░░░░              ▓
       ▓          ░░ TALL GRASS ░░  ← projects  ▓
       ▓          ░░░░░░░░░░░░░░░░              ▓
       ▓                 ║                      ▓
   S   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓[spawn]▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

- **Building size tracks the role**, as you asked. The storefront is TheAgentic.
- **Paths do the guiding.** Cobblestone from the spawn to the plaza, branching to
  each door. You never have to guess where to go — the path tells you.
- **Buildings are solid except their door tile.** Standing on the door tile and
  pressing A opens that role.
- **Flowers and bushes break up the grass**, so variety lives in objects rather
  than in ground texture.

### Numbers

| Setting | Now | M2 | Why |
|---|---|---|---|
| Tiles visible across | 17 | **10** | Gen-3 framing; character reads as a character |
| Map | 40×30 (empty) | **36×28 (dense)** | Fillable |
| Ground | 2 tiles hashed | **1 uniform** | Kills the static |
| Objects | 0 | ~60 | Where variety belongs |

---

## 4. The interaction model

One verb: **A** (`Space`, `Enter`, or `E`).

Stand facing something and press it. That's the whole vocabulary, and it's what
Gen 3 teaches in its first thirty seconds.

**Dialogue box** — bottom third, authentic proportions: dark rounded panel, light
border, text typing out at ~35 chars/sec, blinking ▼ when there's more. `A`
advances, `Esc` closes. Content comes **straight from `content.ts`**:

| Object | Pages |
|---|---|
| TheAgentic door | Role and dates → then each of the 8 systems: title, what it is, what made it hard |
| Idigitize door | Role, dates, the four bullets |
| Education door | Both degrees |
| Signpost by the plaza | The stack list, grouped |
| Tall grass | *"A wild BOARDLY appeared!"* → project blurb + stack |

Text wrapping is measured against the canvas, not guessed, so nothing overflows
the box.

---

## 5. Onboarding — the fix for "I don't know what to do"

Three cheap things, in order of impact:

1. **Spawn facing the town** with the path leading in. Composition does most of
   the teaching.
2. **A one-line prompt on arrival** that fades after ~4 s:
   *"Arrows to walk. Press A at a door."*
3. **Floating ▲ over the nearest interactable** once you're within two tiles, so
   "press A" has an obvious target.

Plus a **"where am I" title card** on entry — *"MITEJ TOWN — Pop. 1"* — sliding
in like a Gen-3 route sign. Sets the joke immediately and tells you it's a place.

---

## 6. Visual fidelity fixes

- **Drop shadow** — a 2px dark ellipse under the sprite. Single biggest cheap win
  for making a sprite sit *in* the world rather than on it.
- **Depth sorting.** Draw order by Y so you walk *behind* the top of a building
  and *in front of* its base. Without this the illusion collapses immediately.
- **Autotile the path and grass edges** using the edge crosses in the sheet, so
  path meets grass with a proper border instead of a hard square edge.
- **Bush overlap.** Draw bushes after the player when the player is above them —
  the classic "waist-deep in grass" look.
- **4-frame walk cycle** timed to the step, instead of the current 2-frame
  alternation.

---

## 7. Milestones

| # | Work | Ship value |
|---|---|---|
| **M2a** | Scale to 10 tiles, one uniform ground tile, drop shadow, depth sort | The current build stops looking broken. Half a day. |
| **M2b** | The 36×28 map: paths, fences, 3 buildings, flowers, bushes, collision | It becomes a place |
| **M2c** | `A` + dialogue box reading from `content.ts` | It becomes a résumé |
| **M2d** | Title card, arrival prompt, ▲ indicators | It becomes understandable |
| **M2e** | Tall grass → project encounters with creature sprites | It becomes fun |

**M2a is worth doing immediately and separately** — it's small and it fixes the
"very ugly" complaint on its own, before any map work lands.

---

## 8. What I'd want from you

1. **Interiors: overlay or rooms?** My recommendation is overlay (§1) — better
   for reading, and no new assets. Rooms need an interior tileset.
2. **Mobile D-pad?** Still unbuilt; the pipe is hidden below `sm`. The overworld
   is the most memorable thing on the site and phone visitors currently can't see
   it at all.
3. **Your own character** from `pok3`, or keep the demo trainer? One config line
   either way, but interiors and dialogue portraits would be built around it.
