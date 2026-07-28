/**
 * The town.
 *
 * Small and dense rather than large and empty — M1's 40×30 field of nothing was
 * the whole problem. 36×28 is enough that the camera moves and there is somewhere
 * to go, and little enough that every screen has something in it.
 *
 * You spawn at the south gate facing north, so the first frame already shows the
 * buildings and the path leads your eye in. Composition does the onboarding.
 *
 * All sprite rects below were measured out of the sheets by flood-filling opaque
 * regions, not eyeballed — see the commit for the script.
 */

export const MAP_W = 36;
export const MAP_H = 28;
export const SPAWN = { x: 18, y: 25 };

/** grass.png, 12 tiles wide. Row 2 col 2 is the mid dithered grass. */
export const GRASS_TILE = 26;
export const GRASS_EDGE_TILE = 14;
/**
 * path.png (path_02) is a full autotile block, so almost every tile is opaque and
 * "fully opaque" alone doesn't identify the fill. 30 is row 2 col 6 — comfortably
 * interior, verified by cropping: the left column of each group carries a grass
 * edge baked in, which would show as a seam mid-path.
 */
export const PATH_TILE = 30;
/** fences.png, 4 wide. Nothing in it is fully opaque; these overlay the grass. */
export const FENCE_H = 14;
export const FENCE_V = 4;

export type Building = {
  id: "theagentic" | "idigitize" | "education";
  /** Source rect in buildings.png: x, y, w, h. */
  src: [number, number, number, number];
  /** Top-left tile of the footprint. */
  tx: number;
  ty: number;
  /** Footprint in tiles. Sprites are bottom-aligned to it. */
  tw: number;
  th: number;
  /** Door column, as an offset from tx. Standing here and pressing A opens it. */
  door: number;
};

/**
 * Size tracks the role, as asked: TheAgentic gets the largest sprite (6 tiles
 * wide), the previous employer the smallest (5).
 */
export const BUILDINGS: Building[] = [
  { id: "theagentic", src: [120, 31, 96, 81], tx: 15, ty: 3, tw: 6, th: 5, door: 3 },
  { id: "idigitize", src: [24, 43, 80, 69], tx: 5, ty: 12, tw: 5, th: 5, door: 2 },
  { id: "education", src: [22, 132, 83, 77], tx: 25, ty: 11, tw: 6, th: 5, door: 2 },
];

/** bush.png is one 48×48 sprite with the bush centred; this is its content rect. */
export const BUSH_SRC: [number, number, number, number] = [14, 14, 22, 20];
/** flowers.png clusters, measured from the sheet. */
export const FLOWER_SRC: [number, number, number, number][] = [
  [17, 17, 30, 30],
  [34, 17, 26, 30],
  [50, 17, 28, 24],
];

/** Doubles as the projects patch later — for now it is cover and texture. */
export const TALL_GRASS: [number, number][] = [];
for (let y = 20; y <= 22; y++) for (let x = 11; x <= 17; x++) TALL_GRASS.push([x, y]);

export const BUSHES: [number, number][] = [
  [3, 5], [7, 6], [31, 6], [33, 8], [2, 20], [4, 23],
  [32, 20], [30, 24], [9, 3], [26, 4], [13, 25], [23, 25],
];

export const FLOWERS: [number, number, number][] = [
  [4, 9, 0], [11, 9, 1], [22, 8, 2], [30, 15, 0],
  [8, 21, 1], [27, 21, 2], [16, 15, 0], [20, 15, 1],
];

/** Cobblestone: a spine north from the gate, a plaza, and a spur to each door. */
function buildPath(): Set<number> {
  const p = new Set<number>();
  const add = (x: number, y: number) => p.add(y * MAP_W + x);

  for (let y = 18; y <= MAP_H - 2; y++) add(SPAWN.x, y); // gate → plaza
  for (let x = 7; x <= 28; x++) add(x, 18); // the plaza itself
  for (let y = 8; y <= 18; y++) add(18, y); // main street to TheAgentic
  for (let y = 17; y <= 18; y++) add(7, y); // spur: previous employer
  for (let y = 16; y <= 18; y++) add(27, y); // spur: education
  return p;
}

export const PATH = buildPath();

export type Doors = Map<number, Building["id"]>;

/** Collision plus the door lookup, derived from the building footprints. */
export function buildCollision() {
  const solid = new Uint8Array(MAP_W * MAP_H);
  const doors: Doors = new Map();
  const at = (x: number, y: number) => y * MAP_W + x;

  // Fence ring around the whole town, with a gap at the gate so the spawn reads
  // as an entrance rather than a corner of a box.
  for (let x = 0; x < MAP_W; x++) {
    solid[at(x, 0)] = 1;
    if (x !== SPAWN.x) solid[at(x, MAP_H - 1)] = 1;
  }
  for (let y = 0; y < MAP_H; y++) {
    solid[at(0, y)] = 1;
    solid[at(MAP_W - 1, y)] = 1;
  }

  for (const b of BUILDINGS) {
    for (let y = b.ty; y < b.ty + b.th; y++) {
      for (let x = b.tx; x < b.tx + b.tw; x++) {
        if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) continue;
        solid[at(x, y)] = 1;
      }
    }
    // The door is the one tile you can stand on, on the building's bottom row.
    const dx = b.tx + b.door;
    const dy = b.ty + b.th - 1;
    solid[at(dx, dy)] = 0;
    doors.set(at(dx, dy), b.id);
  }

  for (const [x, y] of BUSHES) solid[at(x, y)] = 1;

  return { solid, doors };
}
