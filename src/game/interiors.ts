/**
 * Room interiors.
 *
 * Tiles come from AxulArt's Basic Top-down Interior (CC BY 4.0 — see CREDITS.md;
 * the attribution is a licence condition, not a courtesy).
 *
 * Every index below was read off a per-tile opacity map of the sheet and then
 * confirmed by cropping, because the sheet mixes wallpapers and floors in
 * adjacent rows and they are indistinguishable by opacity alone.
 */

import type { Building } from "./map";

/** interior.png is 12 tiles wide. */
export const INT_COLS = 12;

/** Row 9 — the fully opaque floors. */
const FLOOR_LATTICE = 108;
const FLOOR_PARQUET = 110;
const FLOOR_PLANKS = 111;
/** Row 8 — wall bands. Adjacent columns are striped wallpapers. */
const WALL_TAN = 97;
const WALL_WOOD = 98;
const WALL_STRIPE_BLUE = 100;
/** Row 7 — trim, openings, and the rug's top edge. */
const WALL_TOP = 91;
const DOORWAY = 86;
const WINDOW = 88;

/** The rug is a 3×3 block at cols 9–11, rows 7–9. */
export const RUG_SRC: [number, number, number, number] = [144, 112, 48, 48];
/** Both bookshelf halves as one 2×5 unit. */
export const SHELF_SRC: [number, number, number, number] = [0, 8, 32, 80];

export type Room = {
  id: Building["id"];
  /** Title shown when you walk in. */
  name: string;
  w: number;
  h: number;
  floor: number;
  wall: number;
  /** Columns along the back wall that get a window instead of blank wall. */
  windows: number[];
  /** Bookshelf positions, as the tile the shelf's base stands on. */
  shelves: [number, number][];
  /** Top-left tile of the rug, or null. */
  rug: [number, number] | null;
  /** The tile you step onto to leave. Always on the bottom row. */
  exit: [number, number];
};

/**
 * Rooms are 11×8 — big enough to walk around in and to fill the interior camera,
 * which is tighter than the overworld's. Layout is always: trim row, wall row,
 * then floor, with the exit on the bottom row so you leave by walking south, the
 * way you came in.
 */
export const ROOMS: Record<Building["id"], Room> = {
  theagentic: {
    id: "theagentic",
    name: "TheAgentic",
    w: 13,
    h: 9,
    floor: FLOOR_PARQUET,
    wall: WALL_STRIPE_BLUE,
    windows: [3, 9],
    // Base row, not top row. The sprite is 5 tiles tall, so anything above y=6
    // pokes out through the wall into the void behind the room.
    shelves: [
      [1, 6],
      [10, 6],
    ],
    rug: [5, 4],
    exit: [6, 8],
  },
  idigitize: {
    id: "idigitize",
    name: "Idigitize Infotech",
    w: 11,
    h: 8,
    floor: FLOOR_PLANKS,
    wall: WALL_WOOD,
    windows: [7],
    shelves: [[1, 6]],
    rug: null,
    exit: [5, 7],
  },
  education: {
    id: "education",
    name: "NMIMS · Narsee Monjee",
    w: 11,
    h: 8,
    floor: FLOOR_LATTICE,
    wall: WALL_TAN,
    windows: [3, 7],
    shelves: [
      [1, 6],
      [8, 6],
    ],
    rug: null,
    exit: [5, 7],
  },
};

/** Which tile index to draw at a given cell. Rows 0-1 are the back wall. */
export function tileAt(room: Room, x: number, y: number): number {
  if (y === 0) return WALL_TOP;
  if (y === 1) return room.windows.includes(x) ? WINDOW : room.wall;
  return room.floor;
}

/** Walls are solid; so is everything a shelf occupies. */
export function roomCollision(room: Room) {
  const solid = new Uint8Array(room.w * room.h);
  const at = (x: number, y: number) => y * room.w + x;

  for (let x = 0; x < room.w; x++) {
    solid[at(x, 0)] = 1;
    solid[at(x, 1)] = 1;
  }
  for (let y = 0; y < room.h; y++) {
    solid[at(0, y)] = 1;
    solid[at(room.w - 1, y)] = 1;
  }
  // The bottom edge is closed except the doorway, so the exit is unambiguous.
  for (let x = 0; x < room.w; x++) {
    if (x !== room.exit[0]) solid[at(x, room.h - 1)] = 1;
  }
  for (const [sx, sy] of room.shelves) {
    for (let dy = -4; dy <= 0; dy++) {
      for (let dx = 0; dx <= 1; dx++) {
        const x = sx + dx;
        const y = sy + dy;
        if (x >= 0 && y >= 0 && x < room.w && y < room.h) solid[at(x, y)] = 1;
      }
    }
  }
  return solid;
}

export { DOORWAY };
