/**
 * The overworld engine.
 *
 * Deliberately plain TypeScript with no React and no dependencies: this whole
 * module is behind a dynamic import(), so the smaller and more self-contained it
 * is, the less the base site pays for a feature most visitors never open. It
 * owns one canvas and cleans up everything it touches on unmount.
 *
 * Movement is grid-locked — you commit to a whole tile and interpolate across it
 * over STEP_FRAMES — rather than free positioning. That constraint is what makes
 * it read as Gen 3 rather than as a platformer.
 */

import {
  BUILDINGS, BUSHES, BUSH_SRC, FENCE_H, FENCE_V, FLOWERS, FLOWER_SRC,
  GRASS_EDGE_TILE, GRASS_TILE, MAP_H, MAP_W, PATH, PATH_TILE, SPAWN,
  TALL_GRASS, buildCollision, type Building,
} from "./map";
import { DOORWAY, INT_COLS, ROOMS, RUG_SRC, SHELF_SRC, roomCollision, tileAt } from "./interiors";

const TILE = 16; // source tile size, px
const SHEET_COLS = 12; // grass.png is 192px / 16 = 12 tiles wide
const FENCE_COLS = 4;
/**
 * Tile indices into grass.png (12 wide). Verified by cropping the sheet, not
 * guessed: row 4 is flat colour fills, rows 1-3 cols 2-3 are the dithered
 * textures, and col 1 of each row is a checkerboard blend pattern.
 */
const STEP_FRAMES = 8; // frames to cross one tile
const CHAR = 32; // trainer frame size
/**
 * How much world is visible across the canvas.
 *
 * Ten tiles is true Gen 3 framing, but a game fills a handheld screen whereas
 * this is a panel inside a website — at that zoom the sprite dwarfed the type it
 * sits next to. Twenty-eight keeps the character close to the scale of the
 * surrounding text and shows most of the 36-wide town at once, so it reads as a
 * place rather than a corridor.
 */
const TARGET_TILES_WIDE = 28;

/** Trainer sheet rows. Left is the side row mirrored. */
const ROW_DOWN = 0;
const ROW_SIDE = 1;
const ROW_UP = 2;
/**
 * The side row in this sheet faces RIGHT, so only "left" gets mirrored.
 * Confirmed the hard way: with this set the other way, walking right rendered the
 * left-facing sprite and vice versa.
 */
const SIDE_FACES_LEFT = false;

type Dir = "up" | "down" | "left" | "right";

export type GameHandle = { destroy: () => void };

/** Interiors are small, so they get a tighter camera than the overworld. */
const TILES_WIDE_INSIDE = 15;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`overworld: failed to load ${src}`));
    img.src = src;
  });
}

export async function mountGame(
  host: HTMLElement,
  opts: { onLeave?: () => void; onEnter?: (name: string) => void } = {},
): Promise<GameHandle> {
  const [grass, trainer, buildings, path, fences, bush, flowers, interior] = await Promise.all([
    loadImage("/game/grass.png"),
    loadImage("/game/trainer.png"),
    loadImage("/game/buildings.png"),
    loadImage("/game/path.png"),
    loadImage("/game/fences.png"),
    loadImage("/game/bush.png"),
    loadImage("/game/flowers.png"),
    loadImage("/game/interior.png"),
  ]);

  const canvas = document.createElement("canvas");
  canvas.className = "block h-full w-full";
  // The canvas is decorative duplication of content that already exists in the
  // DOM, so it is not exposed as an image to assistive tech.
  canvas.setAttribute("role", "presentation");
  host.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: false })!;

  const { solid: outsideSolid, doors } = buildCollision();

  /**
   * Two scenes share one loop. `inside` being null means we're in the town; the
   * player's town position is stashed on entry so leaving a room puts them back
   * on the doorstep rather than at spawn.
   */
  let inside: Building["id"] | null = null;
  let outsideReturn = { x: SPAWN.x, y: SPAWN.y };

  let map = { w: MAP_W, h: MAP_H, solid: outsideSolid };
  let scale = 3;

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const cssW = host.clientWidth;
    const cssH = host.clientHeight;
    // Integer scale only — a fractional scale is what makes pixel art mushy.
    const wide = inside ? TILES_WIDE_INSIDE : TARGET_TILES_WIDE;
    scale = Math.max(2, Math.floor(cssW / (wide * TILE)));
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  // ── player ────────────────────────────────────────────────────────────────
  let tx = SPAWN.x;
  let ty = SPAWN.y;
  // Facing north on arrival, so the first frame looks up the street at the town.
  let dir: Dir = "up";
  /** 0 while idle, counts up to STEP_FRAMES while crossing a tile. */
  let step = 0;
  let fromX = tx;
  let fromY = ty;
  let animTick = 0;
  /** Advances per completed step, so the left/right step poses alternate. */
  let walkPhase = 0;

  const held = new Set<Dir>();
  const KEYS: Record<string, Dir> = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    s: "down",
    a: "left",
    d: "right",
    W: "up",
    S: "down",
    A: "left",
    D: "right",
  };

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "Enter" || e.key === "e" || e.key === "E") {
      e.preventDefault();
      interact();
      return;
    }
    const d = KEYS[e.key];
    if (!d) return;
    // Arrows scroll the page behind us otherwise.
    e.preventDefault();
    held.add(d);
  }
  function onKeyUp(e: KeyboardEvent) {
    const d = KEYS[e.key];
    if (d) held.delete(d);
  }
  // Losing focus mid-step would otherwise leave a key stuck down forever.
  function onBlur() {
    held.clear();
  }

  addEventListener("keydown", onKeyDown, { passive: false });
  addEventListener("keyup", onKeyUp);
  addEventListener("blur", onBlur);

  function enterRoom(id: Building["id"]) {
    const room = ROOMS[id];
    outsideReturn = { x: tx, y: ty };
    inside = id;
    map = { w: room.w, h: room.h, solid: roomCollision(room) };
    tx = room.exit[0];
    ty = room.exit[1] - 1;
    fromX = tx;
    fromY = ty;
    step = 0;
    dir = "up";
    resize();
    opts.onEnter?.(room.name);
  }

  function leaveRoom() {
    inside = null;
    map = { w: MAP_W, h: MAP_H, solid: outsideSolid };
    tx = outsideReturn.x;
    ty = outsideReturn.y;
    fromX = tx;
    fromY = ty;
    step = 0;
    dir = "down";
    resize();
    opts.onEnter?.("");
  }

  /** A / Space / Enter: act on whatever the player is standing on or facing. */
  function interact() {
    if (inside) {
      const room = ROOMS[inside];
      if (tx === room.exit[0] && ty === room.exit[1]) leaveRoom();
      return;
    }
    const here = doors.get(ty * MAP_W + tx);
    if (here) enterRoom(here);
  }

  const DELTA: Record<Dir, [number, number]> = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  };

  function blocked(x: number, y: number) {
    if (x < 0 || y < 0 || x >= map.w || y >= map.h) return true;
    return map.solid[y * map.w + x] === 1;
  }

  function update() {
    if (step > 0) {
      step++;
      if (step > STEP_FRAMES) {
        step = 0;
        fromX = tx;
        fromY = ty;
        walkPhase = (walkPhase + 2) % 4;

        // Doorways act on arrival, the way they do in the real games — you walk
        // in rather than stopping to press a key.
        if (inside) {
          const room = ROOMS[inside];
          if (tx === room.exit[0] && ty === room.exit[1]) leaveRoom();
        } else {
          const d = doors.get(ty * MAP_W + tx);
          if (d) enterRoom(d);
          // Walking south out of the gate returns to the résumé. The gap in the
          // fence is the only way out, so it reads as the exit rather than a bug.
          else if (ty >= MAP_H - 1 && tx === SPAWN.x) opts.onLeave?.();
        }
      }
      return;
    }

    // Last key pressed wins, which is what makes direction changes feel responsive.
    const next = [...held].pop();
    if (!next) {
      animTick = 0;
      return;
    }

    dir = next;
    const [dx, dy] = DELTA[next];
    const nx = tx + dx;
    const ny = ty + dy;

    // Turning in place still costs nothing, but walking into a wall shouldn't
    // start a step — otherwise you slide against fences.
    if (blocked(nx, ny)) {
      animTick++;
      return;
    }

    fromX = tx;
    fromY = ty;
    tx = nx;
    ty = ny;
    step = 1;
    animTick++;
  }

  function draw() {
    const t = step > 0 ? step / (STEP_FRAMES + 1) : 0;
    // Sub-tile position in world pixels, interpolated across the step.
    const px = (fromX + (tx - fromX) * t) * TILE;
    const py = (fromY + (ty - fromY) * t) * TILE;

    const viewW = canvas.clientWidth / scale;
    const viewH = canvas.clientHeight / scale;

    // Camera centres the player, then clamps so we never show past the edges.
    let camX = px + TILE / 2 - viewW / 2;
    let camY = py + TILE / 2 - viewH / 2;
    // A room can be smaller than the viewport, in which case clamping to bounds
    // would shove it into the corner — centre it instead.
    const worldW = map.w * TILE;
    const worldH = map.h * TILE;
    camX = worldW <= viewW ? (worldW - viewW) / 2 : Math.max(0, Math.min(camX, worldW - viewW));
    camY = worldH <= viewH ? (worldH - viewH) / 2 : Math.max(0, Math.min(camY, worldH - viewH));
    // Snap the camera to whole device pixels or the tile seams shimmer.
    camX = Math.round(camX * scale) / scale;
    camY = Math.round(camY * scale) / scale;

    ctx.fillStyle = "#0b0b0a";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(-camX, -camY);

    const blit = (
      img: HTMLImageElement,
      tile: number,
      cols: number,
      dx: number,
      dy: number,
    ) => {
      ctx.drawImage(
        img,
        (tile % cols) * TILE,
        Math.floor(tile / cols) * TILE,
        TILE,
        TILE,
        dx,
        dy,
        TILE,
        TILE,
      );
    };

    const x0 = Math.max(0, Math.floor(camX / TILE));
    const y0 = Math.max(0, Math.floor(camY / TILE));
    const x1 = Math.min(map.w, Math.ceil((camX + viewW) / TILE));
    const y1 = Math.min(map.h, Math.ceil((camY + viewH) / TILE));

    type Drawable = { baseY: number; paint: () => void };
    const layer: Drawable[] = [];

    if (inside) {
      // ── interior ────────────────────────────────────────────────────────
      const room = ROOMS[inside];
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          blit(interior, tileAt(room, x, y), INT_COLS, x * TILE, y * TILE);
        }
      }

      if (room.rug) {
        const [rx, ry] = room.rug;
        const [sx, sy, sw, sh] = RUG_SRC;
        ctx.drawImage(interior, sx, sy, sw, sh, rx * TILE, ry * TILE, sw, sh);
      }

      // The doorway is drawn over the wall so it reads as an opening, and over
      // the floor at the exit so the way out is obvious without a label.
      const [ex, ey] = room.exit;
      blit(interior, DOORWAY, INT_COLS, ex * TILE, ey * TILE);

      for (const [sx2, sy2] of room.shelves) {
        const [sx, sy, sw, sh] = SHELF_SRC;
        layer.push({
          baseY: (sy2 + 1) * TILE,
          paint: () =>
            ctx.drawImage(interior, sx, sy, sw, sh, sx2 * TILE, (sy2 + 1) * TILE - sh, sw, sh),
        });
      }
    } else {
      // ── town ────────────────────────────────────────────────────────────
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const edge = x === 0 || y === 0 || x === map.w - 1 || y === map.h - 1;
        blit(grass, edge ? GRASS_EDGE_TILE : GRASS_TILE, SHEET_COLS, x * TILE, y * TILE);
        if (PATH.has(y * map.w + x)) {
          blit(path, PATH_TILE, SHEET_COLS, x * TILE, y * TILE);
        }
      }
    }

    // Flat decoration sits on the ground, under everything that has height.
    for (const [fx, fy, kind] of FLOWERS) {
      const [sx, sy, sw, sh] = FLOWER_SRC[kind];
      ctx.drawImage(flowers, sx, sy, sw, sh, fx * TILE, fy * TILE, sw, sh);
    }

    // ── fence ring ────────────────────────────────────────────────────────
    for (let x = x0; x < x1; x++) {
      if (x !== SPAWN.x) blit(fences, FENCE_H, FENCE_COLS, x * TILE, (map.h - 1) * TILE);
      blit(fences, FENCE_H, FENCE_COLS, x * TILE, 0);
    }
    for (let y = y0; y < y1; y++) {
      blit(fences, FENCE_V, FENCE_COLS, 0, y * TILE);
      blit(fences, FENCE_V, FENCE_COLS, (map.w - 1) * TILE, y * TILE);
    }

    // ── depth-sorted layer ────────────────────────────────────────────────
    // Everything with height goes into one list ordered by the Y its base sits
    // on, so you walk behind a building's roof and in front of its doorstep.
    // Without this the illusion collapses the first time you round a corner.
    for (const b of BUILDINGS) {
      const [sx, sy, sw, sh] = b.src;
      const bottom = (b.ty + b.th) * TILE;
      layer.push({
        baseY: bottom,
        paint: () => ctx.drawImage(buildings, sx, sy, sw, sh, b.tx * TILE, bottom - sh, sw, sh),
      });
    }

    for (const [bx, by] of [...BUSHES, ...TALL_GRASS]) {
      const [sx, sy, sw, sh] = BUSH_SRC;
      layer.push({
        baseY: (by + 1) * TILE,
        paint: () =>
          ctx.drawImage(
            bush, sx, sy, sw, sh,
            bx * TILE + (TILE - sw) / 2,
            (by + 1) * TILE - sh,
            sw, sh,
          ),
      });
    }

    }

    // The player. Content occupies rows 10-25 of the 32px frame — measured, not
    // guessed — so the sprite is offset to stand its feet on the tile floor
    // rather than on the frame's empty bottom padding.
    const FOOT = 25;
    const dx = px - (CHAR - TILE) / 2;
    const dy = py + (TILE - 1) - FOOT;
    const walking = step > 0;
    const CYCLE = [0, 1, 0, 2];
    const frame = walking ? CYCLE[(walkPhase + Math.floor(t * 2)) % CYCLE.length] : 0;
    const row = dir === "up" ? ROW_UP : dir === "down" ? ROW_DOWN : ROW_SIDE;
    const mirror =
      (dir === "left" && !SIDE_FACES_LEFT) || (dir === "right" && SIDE_FACES_LEFT);

    layer.push({
      baseY: py + TILE,
      paint: () => {
        // Soft ground shadow: the cheapest thing that makes a sprite sit in the
        // world instead of floating on it.
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "#1a2416";
        ctx.beginPath();
        ctx.ellipse(px + TILE / 2, py + TILE - 2, 4.5, 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (mirror) {
          ctx.save();
          ctx.translate(dx + CHAR, dy);
          ctx.scale(-1, 1);
          ctx.drawImage(trainer, frame * CHAR, row * CHAR, CHAR, CHAR, 0, 0, CHAR, CHAR);
          ctx.restore();
        } else {
          ctx.drawImage(trainer, frame * CHAR, row * CHAR, CHAR, CHAR, dx, dy, CHAR, CHAR);
        }
      },
    });

    layer.sort((a, b) => a.baseY - b.baseY);
    for (const d of layer) d.paint();

    ctx.restore();
  }

  // Fixed-step logic, decoupled from render, so movement speed does not depend
  // on the display's refresh rate.
  const TICK = 1000 / 60;
  let raf = 0;
  let last = performance.now();
  let acc = 0;
  let running = true;

  function loop(now: number) {
    if (!running) return;
    acc += now - last;
    last = now;
    // Cap catch-up so a backgrounded tab doesn't teleport the player on return.
    if (acc > 250) acc = 250;
    while (acc >= TICK) {
      update();
      acc -= TICK;
    }
    draw();
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeEventListener("keydown", onKeyDown);
      removeEventListener("keyup", onKeyUp);
      removeEventListener("blur", onBlur);
      canvas.remove();
    },
  };
}
