// Lab 8 trainer layout: where every contact, part and lane sits on the
// breadboard, in board coordinates (metres; x across the board, z along the
// rows toward the student, origin at the board's centre). Shared by the scene
// and the tests, so a wire the guide asks for is known to route cleanly.
import { LEFT_COLS, POSTS, RIGHT_COLS, ROWS, S1, allHoles, partsFor } from "./circuit.js";

export const PITCH = 0.01;
export const rowZ = (r) => (r - (ROWS - 1) / 2) * PITCH;
export const COL_X = Object.fromEntries([
  ...LEFT_COLS.map((c, i) => [c, -0.055 + i * PITCH]),
  ...RIGHT_COLS.map((c, i) => [c, 0.015 + i * PITCH]),
]);
export const RAIL_X = { lg: -0.078, lp: -0.088, rg: 0.078, rp: 0.088 };
export const BLOCK_AT = { vin: [-0.112, 8], gin: [-0.112, 14], vmon: [0.112, 9], vout: [0.112, 15], gout: [0.112, 21] }; // x, first row
export const POST_AT = {
  "post+": [-0.035, -0.183], postg: [0.035, -0.183],
  postin: [-0.158, rowZ(9.5)], postgin: [-0.158, rowZ(15)],
  postout: [0.158, rowZ(16.5)], postgout: [0.158, rowZ(22)],
};
export const BOARD = { w: 0.26, l: 0.33 }; // the board's printed face
export const S1_BODY = { w: 0.03, l: 0.03, z: rowZ(5) };

/** 2D position {x, z} of a hole or post. */
export function contactXZ(id) {
  if (POST_AT[id]) { const [x, z] = POST_AT[id]; return { x, z }; }
  const block = /^(vin|vmon|gin|vout|gout)(\d)$/.exec(id);
  if (block) { const [x, row] = BLOCK_AT[block[1]]; return { x, z: rowZ(row + Number(block[2])) }; }
  const rail = /^(lg|lp|rg|rp)(\d+)$/.exec(id);
  if (rail) return { x: RAIL_X[rail[1]], z: rowZ(Number(rail[2])) };
  const main = /^([a-j])(\d+)$/.exec(id);
  if (main) return { x: COL_X[main[1]], z: rowZ(Number(main[2])) };
  return null;
}

/** Every contact on the trainer: holes and posts. */
export const contacts = () => [...allHoles(), ...Object.keys(POSTS)];

const square = ({ x, z }, h) => ({ x0: x - h, x1: x + h, z0: z - h, z1: z + h });

/** How a dial module sits: square to the board, with feet out to its legs. */
export function partPose(part) {
  const [a, b] = part.legs.map(contactXZ);
  const mid = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
  return { mid, a, b, body: { x0: mid.x - 0.015, x1: mid.x + 0.015, z0: mid.z - 0.011, z1: mid.z + 0.011 } };
}

const foot = (end, mid, what) => (Math.abs(end.x - mid.x) > Math.abs(end.z - mid.z)
  ? { x0: Math.min(end.x, mid.x), x1: Math.max(end.x, mid.x), z0: end.z - 0.001, z1: end.z + 0.001, what }
  : { x0: end.x - 0.001, x1: end.x + 0.001, z0: Math.min(end.z, mid.z), z1: Math.max(end.z, mid.z), what });

/** Rectangles a wire must not cross: S1, the dial modules, their feet and legs. */
export function partObstacles(kind) {
  const out = [{ x0: -S1_BODY.w / 2, x1: S1_BODY.w / 2, z0: S1_BODY.z - S1_BODY.l / 2, z1: S1_BODY.z + S1_BODY.l / 2, what: "s1" }];
  for (const leg of Object.values(S1)) out.push({ ...square(contactXZ(leg), 0.0015), what: leg });
  for (const part of partsFor(kind)) {
    const pose = partPose(part);
    out.push({ ...pose.body, what: part.id });
    for (const leg of part.legs) out.push({ ...square(contactXZ(leg), 0.0015), what: leg });
    for (const end of [pose.a, pose.b]) out.push(foot(end, pose.mid, part.id));
  }
  return out;
}

/** A wire end seated in a hole, as an obstacle for other wires. */
export const endObstacle = (id) => ({ ...square(contactXZ(id), 0.0015), what: id });

// free lanes between columns, rails and rows for two-bend paths
const xs = [...new Set([...Object.values(COL_X), ...Object.values(RAIL_X), ...Object.values(BLOCK_AT).map(([x]) => x)])].sort((p, q) => p - q);
export const LANES_X = xs.slice(1).map((x, i) => Number(((x + xs[i]) / 2).toFixed(4)));
export const LANES_Z = Array.from({ length: ROWS + 1 }, (_, r) => rowZ(r - 0.5));
