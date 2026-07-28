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

const TILE = 16; // source tile size, px
const SHEET_COLS = 12; // grass.png is 192px / 16 = 12 tiles wide
/**
 * Tile indices into grass.png (12 wide). Verified by cropping the sheet, not
 * guessed: row 4 is flat colour fills, rows 1-3 cols 2-3 are the dithered
 * textures, and col 1 of each row is a checkerboard blend pattern.
 */
const GRASS = 26; // row 2, col 2 — mid dithered grass
const GRASS_ALT = 27; // row 2, col 3 — a second texture, scattered for variation
const GRASS_DARK = 14; // row 1, col 2 — darker, used for the map edge
const STEP_FRAMES = 8; // frames to cross one tile
const CHAR = 32; // trainer frame size
const TARGET_TILES_WIDE = 17; // how much world to show; drives integer scale

/** Trainer sheet rows. Left is the side row mirrored. */
const ROW_DOWN = 0;
const ROW_SIDE = 1;
const ROW_UP = 2;
/** Set false if the side row turns out to face right in the source art. */
const SIDE_FACES_LEFT = true;

type Dir = "up" | "down" | "left" | "right";

export type GameHandle = { destroy: () => void };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`overworld: failed to load ${src}`));
    img.src = src;
  });
}

/** A plain field with a fence border — enough to prove movement and camera. */
function buildMap(w: number, h: number) {
  const solid = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) solid[y * w + x] = 1;
    }
  }
  return { w, h, solid };
}

export async function mountGame(host: HTMLElement): Promise<GameHandle> {
  const [grass, trainer] = await Promise.all([
    loadImage("/game/grass.png"),
    loadImage("/game/trainer.png"),
  ]);

  const canvas = document.createElement("canvas");
  canvas.className = "block h-full w-full";
  // The canvas is decorative duplication of content that already exists in the
  // DOM, so it is not exposed as an image to assistive tech.
  canvas.setAttribute("role", "presentation");
  host.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: false })!;

  const map = buildMap(40, 30);
  let scale = 3;

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const cssW = host.clientWidth;
    const cssH = host.clientHeight;
    // Integer scale only — a fractional scale is what makes pixel art mushy.
    scale = Math.max(2, Math.floor(cssW / (TARGET_TILES_WIDE * TILE)));
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
  let tx = 5;
  let ty = 5;
  let dir: Dir = "down";
  /** 0 while idle, counts up to STEP_FRAMES while crossing a tile. */
  let step = 0;
  let fromX = tx;
  let fromY = ty;
  let animTick = 0;

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
    camX = Math.max(0, Math.min(camX, map.w * TILE - viewW));
    camY = Math.max(0, Math.min(camY, map.h * TILE - viewH));
    // Snap the camera to whole device pixels or the tile seams shimmer.
    camX = Math.round(camX * scale) / scale;
    camY = Math.round(camY * scale) / scale;

    ctx.fillStyle = "#0b0b0a";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(-camX, -camY);

    // Ground: only the tiles actually on screen.
    const x0 = Math.max(0, Math.floor(camX / TILE));
    const y0 = Math.max(0, Math.floor(camY / TILE));
    const x1 = Math.min(map.w, Math.ceil((camX + viewW) / TILE));
    const y1 = Math.min(map.h, Math.ceil((camY + viewH) / TILE));

    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        // Deterministic scatter — a cheap hash, so the field has texture variation
        // without ever shimmering between frames.
        const solid = map.solid[y * map.w + x] === 1;
        const alt = ((x * 73856093) ^ (y * 19349663)) % 7 === 0;
        const tile = solid ? GRASS_DARK : alt ? GRASS_ALT : GRASS;
        ctx.drawImage(
          grass,
          (tile % SHEET_COLS) * TILE,
          Math.floor(tile / SHEET_COLS) * TILE,
          TILE,
          TILE,
          x * TILE,
          y * TILE,
          TILE,
          TILE,
        );
      }
    }

    // Player. Frames cycle only while walking; frame 0 is the standing pose.
    const walking = step > 0;
    const frame = walking ? 1 + (Math.floor(animTick / 1) % 2) * 2 : 0;
    const row = dir === "up" ? ROW_UP : dir === "down" ? ROW_DOWN : ROW_SIDE;
    const mirror =
      (dir === "left" && !SIDE_FACES_LEFT) || (dir === "right" && SIDE_FACES_LEFT);

    // The sprite is 32px on a 16px grid, so centre it and sit its feet on the tile.
    const dx = px - (CHAR - TILE) / 2;
    const dy = py - (CHAR - TILE);

    ctx.save();
    if (mirror) {
      ctx.translate(dx + CHAR, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(trainer, frame * CHAR, row * CHAR, CHAR, CHAR, 0, 0, CHAR, CHAR);
    } else {
      ctx.drawImage(trainer, frame * CHAR, row * CHAR, CHAR, CHAR, dx, dy, CHAR, CHAR);
    }
    ctx.restore();

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
