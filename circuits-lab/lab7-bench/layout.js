// Lab 7 trainer layout: where every contact, part and lane sits on the
// breadboard, in board coordinates (metres; x across the board, z along the
// rows toward the student, origin at the board's centre). Shared by the scene
// and the tests, so a wire the guide asks for is known to route cleanly.
import { LEFT_COLS, PINS, POSTS, RIGHT_COLS, ROWS, allHoles, partsFor } from "./circuit.js";

export const PITCH = 0.01;
export const rowZ = (r) => (r - (ROWS - 1) / 2) * PITCH;
export const COL_X = Object.fromEntries([
  ...LEFT_COLS.map((c, i) => [c, -0.055 + i * PITCH]),
  ...RIGHT_COLS.map((c, i) => [c, 0.015 + i * PITCH]),
]);
export const RAIL_X = { lg: -0.078, lp: -0.088, ln: -0.098, rg: 0.078, rp: 0.088, rn: 0.098 };
export const BLOCK_AT = { vtwo: [-0.124, 4], vin: [-0.124, 17], gin: [-0.124, 23], vout: [0.124, 12], gout: [0.124, 18] }; // x, first row
export const POST_AT = {
  "post+": [-0.05, -0.183], postg: [0, -0.183], "post-": [0.05, -0.183],
  postin2: [-0.168, rowZ(5.5)], postin: [-0.168, rowZ(18.5)], postgin: [-0.168, rowZ(24)],
  postout: [0.168, rowZ(13.5)], postgout: [0.168, rowZ(19)],
};
export const BOARD = { w: 0.28, l: 0.33 }; // the board's printed face
export const CHIP = { w: 0.025, l: 0.048 };
const PIN_X = 0.0165; // a wire clipped to a pin hooks on just outside its leg

/** 2D position {x, z} of a hole, pin or post. */
export function contactXZ(id) {
  if (POST_AT[id]) { const [x, z] = POST_AT[id]; return { x, z }; }
  const pin = /^pin([1-8])$/.exec(id);
  if (pin) { const p = contactXZ(PINS[pin[1]]); return { x: Math.sign(p.x) * PIN_X, z: p.z }; }
  const block = /^(vtwo|vin|gin|vout|gout)(\d)$/.exec(id);
  if (block) { const [x, row] = BLOCK_AT[block[1]]; return { x, z: rowZ(row + Number(block[2])) }; }
  const rail = /^(lg|lp|ln|rg|rp|rn)(\d+)$/.exec(id);
  if (rail) return { x: RAIL_X[rail[1]], z: rowZ(Number(rail[2])) };
  const main = /^([a-j])(\d+)$/.exec(id);
  if (main) return { x: COL_X[main[1]], z: rowZ(Number(main[2])) };
  return null;
}

/** Every contact a wire can start or end on: free holes, chip pins and posts. */
export function contacts() {
  const pinHoles = new Set(Object.values(PINS));
  return [...allHoles().filter((id) => !pinHoles.has(id)), ...Object.keys(PINS).map((n) => `pin${n}`), ...Object.keys(POSTS)];
}

const square = ({ x, z }, h) => ({ x0: x - h, x1: x + h, z0: z - h, z1: z + h });

/** How a part sits: pot modules stay square to the board with feet out to their legs. */
export function partPose(part) {
  const [a, b] = part.legs.map(contactXZ);
  const mid = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
  if (part.kind === "pot") return { kind: "pot", mid, a, b, body: { x0: mid.x - 0.015, x1: mid.x + 0.015, z0: mid.z - 0.011, z1: mid.z + 0.011 } };
  const span = Math.hypot(b.x - a.x, b.z - a.z);
  const len = Math.min(0.022, span - 0.012);
  const ux = (b.x - a.x) / span, uz = (b.z - a.z) / span;
  const r = 0.0042;
  const ends = [-1, 1].map((s) => ({ x: mid.x + (s * ux * len) / 2, z: mid.z + (s * uz * len) / 2 }));
  return { kind: "resistor", mid, a, b, len, body: { x0: Math.min(ends[0].x, ends[1].x) - r, x1: Math.max(ends[0].x, ends[1].x) + r, z0: Math.min(ends[0].z, ends[1].z) - r, z1: Math.max(ends[0].z, ends[1].z) + r } };
}

/** Rectangles a wire must not cross for this configuration: chip, part bodies, their feet and legs. */
export function partObstacles(config) {
  const out = [{ x0: -CHIP.w / 2, x1: CHIP.w / 2, z0: rowZ(12) - 0.009, z1: rowZ(15) + 0.009, what: "chip" }];
  for (const n of Object.keys(PINS)) out.push({ ...square(contactXZ(`pin${n}`), 0.0015), what: `pin${n}` });
  for (const part of partsFor(config)) {
    const pose = partPose(part);
    out.push({ ...pose.body, what: part.id });
    for (const leg of part.legs) out.push({ ...square(contactXZ(leg), 0.0015), what: leg });
    if (pose.kind === "pot") {
      // the bent feet from the module out to its holes
      for (const end of [pose.a, pose.b]) {
        const horizontal = Math.abs(end.x - pose.mid.x) > Math.abs(end.z - pose.mid.z);
        out.push(horizontal
          ? { x0: Math.min(end.x, pose.mid.x), x1: Math.max(end.x, pose.mid.x), z0: end.z - 0.001, z1: end.z + 0.001, what: part.id }
          : { x0: end.x - 0.001, x1: end.x + 0.001, z0: Math.min(end.z, pose.mid.z), z1: Math.max(end.z, pose.mid.z), what: part.id });
      }
    }
  }
  return out;
}

/** A wire end seated in a hole, as an obstacle for other wires. */
export const endObstacle = (id) => ({ ...square(contactXZ(id), 0.0015), what: id });

// free lanes between columns, rails and rows for two-bend paths
const xs = [...new Set([...Object.values(COL_X), ...Object.values(RAIL_X), ...Object.values(BLOCK_AT).map(([x]) => x)])].sort((p, q) => p - q);
export const LANES_X = xs.slice(1).map((x, i) => Number(((x + xs[i]) / 2).toFixed(4)));
export const LANES_Z = Array.from({ length: ROWS + 1 }, (_, r) => rowZ(r - 0.5));
