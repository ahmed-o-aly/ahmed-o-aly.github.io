// Lab 7 wire routing: a tidy path for a jumper between two contacts on the
// trainer. Works in board coordinates (x across the board, z along its rows,
// metres) and knows nothing about three.js, so it can be tested in Node.
//
// Wires run square to the board, the way a careful student lays them: one
// bend, or two through a free lane between holes. A path may not cross the
// chip, a part body or another wire's end; among the clear paths the shortest
// wins, with small costs for bends and for crossing or running along other
// wires. A lane the student drags the wire into replaces the search.

const EPS = 1e-6;

/** Does segment p→q pass through rectangle r grown by `pad`? (Liang–Barsky) */
export function hitsRect(p, q, r, pad = 0) {
  const x0 = r.x0 - pad, x1 = r.x1 + pad, z0 = r.z0 - pad, z1 = r.z1 + pad;
  const dx = q.x - p.x, dz = q.z - p.z;
  let t0 = 0, t1 = 1;
  for (const [num, den] of [[p.x - x0, -dx], [x1 - p.x, dx], [p.z - z0, -dz], [z1 - p.z, dz]]) {
    if (Math.abs(den) < EPS) { if (num < 0) return false; continue; }
    const t = num / den;
    if (den < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
    if (t0 > t1) return false;
  }
  return true;
}

function crosses(p1, p2, q1, q2) {
  const side = (a, b, c) => Math.sign((b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x));
  return side(p1, p2, q1) * side(p1, p2, q2) < 0 && side(q1, q2, p1) * side(q1, q2, p2) < 0;
}

// two square segments lying along each other, close enough to tangle
function runsAlong(p1, p2, q1, q2) {
  const flat = (a, b) => Math.abs(a.z - b.z) < EPS;
  const upright = (a, b) => Math.abs(a.x - b.x) < EPS;
  const overlap = (a0, a1, b0, b1) => Math.min(Math.max(a0, a1), Math.max(b0, b1)) - Math.max(Math.min(a0, a1), Math.min(b0, b1));
  if (flat(p1, p2) && flat(q1, q2) && Math.abs(p1.z - q1.z) < 0.003) return overlap(p1.x, p2.x, q1.x, q2.x) > 0.004;
  if (upright(p1, p2) && upright(q1, q2) && Math.abs(p1.x - q1.x) < 0.003) return overlap(p1.z, p2.z, q1.z, q2.z) > 0.004;
  return false;
}

/** Drop repeated and collinear points. */
export function tidy(points) {
  const out = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (last && Math.hypot(p.x - last.x, p.z - last.z) < EPS) continue;
    if (out.length >= 2) {
      const a = out[out.length - 2], b = last;
      const cross = (b.x - a.x) * (p.z - b.z) - (b.z - a.z) * (p.x - b.x);
      if (Math.abs(cross) < EPS) out.pop();
    }
    out.push({ x: p.x, z: p.z });
  }
  return out;
}

const segments = (points) => points.slice(1).map((q, i) => [points[i], q]);
const lengthOf = (points) => segments(points).reduce((s, [p, q]) => s + Math.hypot(q.x - p.x, q.z - p.z), 0);

/**
 * Route a wire from a to b ({x, z}). Options:
 *  obstacles  rectangles {x0, x1, z0, z1} the wire must go around
 *  wires      polylines of wires already placed, to avoid crossing or doubling up
 *  lanesX/Z   free lanes for two-bend paths
 *  via        a lane the student dragged the wire into: {x, lane: "x"} runs the
 *             wire's middle up the board at that x, {z, lane: "z"} across it at that z
 * Returns { points, over }: over is true when nothing clear was found and the
 * wire has to arch over what is in its way.
 */
export function routeWire(a, b, { obstacles = [], wires = [], lanesX = [], lanesZ = [], via = null, pad = 0.002 } = {}) {
  const blocked = (points) => segments(points).some(([p, q]) => obstacles.some((r) => hitsRect(p, q, r, pad)));
  if (via) {
    const points = tidy(via.lane === "x" ? [a, { x: via.x, z: a.z }, { x: via.x, z: b.z }, b] : [a, { x: a.x, z: via.z }, { x: b.x, z: via.z }, b]);
    return { points, over: blocked(points) };
  }
  const candidates = [
    [a, { x: b.x, z: a.z }, b],
    [a, { x: a.x, z: b.z }, b],
    ...lanesX.map((m) => [a, { x: m, z: a.z }, { x: m, z: b.z }, b]),
    ...lanesZ.map((m) => [a, { x: a.x, z: m }, { x: b.x, z: m }, b]),
  ].map(tidy);
  const others = wires.flatMap(segments);
  const cost = (points) => {
    let c = lengthOf(points) + 0.012 * (points.length - 2);
    for (const [p, q] of segments(points)) for (const [r, s] of others) {
      if (crosses(p, q, r, s)) c += 0.03;
      else if (runsAlong(p, q, r, s)) c += 0.15;
    }
    return c;
  };
  let best = null, bestCost = Infinity;
  for (const points of candidates) {
    if (blocked(points)) continue;
    const c = cost(points);
    if (c < bestCost - EPS) { best = points; bestCost = c; }
  }
  if (best) return { points: best, over: false };
  // nothing clear: take the shortest square path and lift it over the obstacles
  const fallback = candidates.slice(0, 2).sort((p, q) => lengthOf(p) - lengthOf(q))[0];
  return { points: fallback, over: true };
}
