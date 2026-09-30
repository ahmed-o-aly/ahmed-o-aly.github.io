// Rendering-only cable routes. These points never change circuit nodes or connections.
const point = (p) => ({ x: p.x, y: p.y, z: p.z });
const mix = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t });
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const inside = (p, o, margin = 0) => p.x > o.minX - margin && p.x < o.maxX + margin && p.z > o.minZ - margin && p.z < o.maxZ + margin;

class Queue {
  items = [];
  serial = 0;
  push(value, score) {
    const entry = { value, score, order: this.serial++ };
    let i = this.items.length;
    this.items.push(entry);
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.less(this.items[parent], entry)) break;
      this.items[i] = this.items[parent];
      i = parent;
    }
    this.items[i] = entry;
  }
  less(a, b) {
    return a.score < b.score || (a.score === b.score && a.order < b.order);
  }
  pop() {
    const first = this.items[0],
      last = this.items.pop();
    if (this.items.length) {
      let i = 0;
      while (i * 2 + 1 < this.items.length) {
        let child = i * 2 + 1;
        if (child + 1 < this.items.length && this.less(this.items[child + 1], this.items[child])) child++;
        if (this.less(last, this.items[child])) break;
        this.items[i] = this.items[child];
        i = child;
      }
      this.items[i] = last;
    }
    return first?.value;
  }
}

function simplify(points) {
  const out = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1],
      b = points[i],
      c = points[i + 1];
    if (Math.abs((b.x - a.x) * (c.z - b.z) - (b.z - a.z) * (c.x - b.x)) > 1e-8) out.push(b);
  }
  if (points.length > 1) out.push(points.at(-1));
  return out;
}

function roundCorners(points, radius) {
  if (points.length < 3) return points.map(point);
  const out = [point(points[0])];
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1],
      b = points[i],
      c = points[i + 1];
    const before = distance(a, b),
      after = distance(b, c);
    if (before < 1e-6 || after < 1e-6) {
      out.push(point(b));
      continue;
    }
    const r = Math.min(radius, before * 0.3, after * 0.3),
      p = mix(b, a, r / before),
      q = mix(b, c, r / after);
    out.push(p);
    for (const t of [0.25, 0.5, 0.75]) out.push(mix(mix(p, b, t), mix(b, q, t), t));
    out.push(q);
  }
  out.push(point(points.at(-1)));
  return out;
}

function gridRoute(start, end, { bounds, obstacles = [], step, padding, reserved = new Map(), preferred = null }) {
  const minX = Math.floor(bounds.minX / step) * step,
    minZ = Math.floor(bounds.minZ / step) * step;
  const cols = Math.ceil((bounds.maxX - minX) / step) + 1,
    rows = Math.ceil((bounds.maxZ - minZ) / step) + 1;
  const cell = (p) => ({
    x: Math.max(0, Math.min(cols - 1, Math.round((p.x - minX) / step))),
    z: Math.max(0, Math.min(rows - 1, Math.round((p.z - minZ) / step))),
  });
  const key = (x, z) => z * cols + x,
    position = (id) => ({ x: minX + (id % cols) * step, y: 0, z: minZ + Math.floor(id / cols) * step });
  const a = cell(start),
    b = cell(end),
    first = key(a.x, a.z),
    goal = key(b.x, b.z);
  // A contact can touch its own component boundary. Only its immediate landing gets a clearance exception.
  const blocked = (id) => {
    if (id === first || id === goal) return false;
    const p = position(id);
    return obstacles.some(
      (o) =>
        inside(p, o, padding) &&
        !(inside(start, o, padding) && distance(p, start) < step * 1.8) &&
        !(inside(end, o, padding) && distance(p, end) < step * 1.8)
    );
  };
  const heuristic = (id) => (Math.abs(position(id).x - position(goal).x) + Math.abs(position(id).z - position(goal).z)) / step;
  const queue = new Queue(),
    costs = new Map([[first, 0]]),
    parents = new Map(),
    directions = new Map(),
    done = new Set();
  queue.push(first, heuristic(first));
  while (queue.items.length) {
    const id = queue.pop();
    if (done.has(id)) continue;
    if (id === goal) break;
    done.add(id);
    const x = id % cols,
      z = Math.floor(id / cols);
    for (const [direction, [dx, dz]] of [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ].entries()) {
      const nx = x + dx,
        nz = z + dz;
      if (nx < 0 || nz < 0 || nx >= cols || nz >= rows) continue;
      const next = key(nx, nz);
      if (done.has(next) || blocked(next)) continue;
      const p = position(next),
        reservation = reserved.get(`${nx},${nz}`) || 0;
      const edgeDistance = Math.min(p.x - bounds.minX, bounds.maxX - p.x, p.z - bounds.minZ, bounds.maxZ - p.z);
      const perimeter = preferred === "perimeter" ? Math.max(0, edgeDistance / step) * 0.2 : 0;
      const turn = directions.has(id) && directions.get(id) !== direction ? 0.32 : 0;
      const cost = costs.get(id) + 1 + reservation * 14 + turn + perimeter;
      if (cost >= (costs.get(next) ?? Infinity)) continue;
      costs.set(next, cost);
      parents.set(next, id);
      directions.set(next, direction);
      queue.push(next, cost + heuristic(next));
    }
  }
  if (first !== goal && !parents.has(goal)) return null;
  const cells = [goal];
  while (cells.at(-1) !== first) cells.push(parents.get(cells.at(-1)));
  cells.reverse();
  const points = cells.map(position);
  points[0] = point(start);
  points[points.length - 1] = point(end);
  return { points, cells: cells.map((id) => ({ x: id % cols, z: Math.floor(id / cols) })), cols, rows };
}

function perimeterFallback(start, end, bounds, lane, height) {
  const z = bounds.maxZ + lane;
  return [
    point(start),
    { x: start.x, y: height, z: start.z },
    { x: start.x, y: height, z },
    { x: end.x, y: height, z },
    { x: end.x, y: height, z: end.z },
    point(end),
  ];
}

/** Plan all patch leads together, reserving distinct lanes independent of input array order. */
export function routePatchLeads(
  connections,
  { obstacles = [], bounds = { minX: -1.64, maxX: 1.64, minZ: -0.94, maxZ: 0.94 }, step = 0.045, floor = 0.95 } = {}
) {
  const reserved = new Map(),
    occupied = new Map(),
    result = new Map();
  const ordered = [...connections].sort((a, b) => distance(a.start, a.end) - distance(b.start, b.end) || a.id.localeCompare(b.id));
  for (const connection of ordered) {
    const { start, end } = connection;
    const route = gridRoute(start, end, { bounds, obstacles, step, padding: step * 1.15, reserved });
    if (!route) {
      // Never hide an unroutable wire: visibly carry it above the blocking component to the outer edge.
      const height = Math.max(start.y, end.y, ...obstacles.map((o) => o.top || floor)) + 0.06;
      result.set(connection.id, roundCorners(perimeterFallback(start, end, bounds, step, height), step));
      continue;
    }
    const unavailable = new Set();
    for (const c of route.cells.slice(2, -2)) for (const layer of occupied.get(`${c.x},${c.z}`) || []) unavailable.add(layer);
    let layer = 0;
    while (unavailable.has(layer)) layer++;
    const y = floor + layer * 0.027;
    for (const [index, c] of route.cells.entries()) {
      if (index > 1 && index < route.cells.length - 2) {
        const id = `${c.x},${c.z}`;
        occupied.set(id, [...(occupied.get(id) || []), layer]);
        for (let dx = -1; dx <= 1; dx++)
          for (let dz = -1; dz <= 1; dz++) {
            const key = `${c.x + dx},${c.z + dz}`;
            reserved.set(key, (reserved.get(key) || 0) + (dx || dz ? 0.45 : 1));
          }
      }
    }
    const planar = simplify(route.points.map((p) => ({ ...p, y })));
    const rounded = roundCorners(planar, step * 0.75);
    // Land once onto the board without an up/down loop at a plug. The first and last
    // floor points follow the route direction, leaving a natural short strain-relief bend.
    const first = rounded[1] || rounded[0],
      last = rounded.at(-2) || rounded.at(-1);
    const startLanding = mix({ ...start, y }, first, Math.min(0.1 / Math.max(distance(start, first), 1e-6), 0.3));
    const endLanding = mix({ ...end, y }, last, Math.min(0.1 / Math.max(distance(end, last), 1e-6), 0.3));
    result.set(connection.id, [point(start), startLanding, ...rounded.slice(1, -1), endLanding, point(end)]);
  }
  return result;
}

/** Long instrument cables use an outer lane; the final approach follows the actual probe boot. */
export function routeInstrumentLead(
  start,
  end,
  {
    lane = 0,
    bounds = { minX: -0.6, maxX: 0.6, minZ: -1.15, maxZ: -0.38 },
    obstacles = [],
    floor = 0.833,
    boardTop = 0.874,
    exit = { x: 0, y: 0, z: 1 },
    branch = false,
  } = {}
) {
  const lift = (p) => ({ ...p, y: p.x > bounds.minX && p.x < bounds.maxX && p.z > bounds.minZ && p.z < bounds.maxZ ? boardTop : floor });
  if (branch) {
    const middle = mix(start, end, 0.5);
    middle.y = Math.max(boardTop + 0.025, Math.min(start.y, end.y) - 0.025);
    middle.x += (lane % 2 ? -1 : 1) * 0.025;
    const low = Math.min(start.y, end.y, middle.y);
    const blocked = obstacles.some(
      (o) =>
        (o.top || boardTop) > low - 0.005 &&
        Math.max(start.x, middle.x, end.x) + 0.035 > o.minX &&
        Math.min(start.x, middle.x, end.x) - 0.035 < o.maxX &&
        Math.max(start.z, end.z) + 0.035 > o.minZ &&
        Math.min(start.z, end.z) - 0.035 < o.maxZ
    );
    if (!blocked && distance(start, end) < 0.25) return [point(start), mix(start, middle, 0.35), middle, mix(middle, end, 0.65), point(end)];
    const branchBounds = {
      minX: Math.min(bounds.minX - 0.04, start.x - 0.04, end.x - 0.04),
      maxX: Math.max(bounds.maxX + 0.04, start.x + 0.04, end.x + 0.04),
      minZ: Math.min(bounds.minZ - 0.04, start.z - 0.04, end.z - 0.04),
      maxZ: Math.max(bounds.maxZ + 0.04, start.z + 0.04, end.z + 0.04),
    };
    const route = gridRoute(start, end, { bounds: branchBounds, obstacles, step: 0.016, padding: 0.025 });
    if (route) {
      const points = roundCorners(simplify(route.points.map((p) => ({ ...p, y: boardTop + 0.025 }))), 0.018);
      if (points.length === 2) points.splice(1, 0, mix(points[0], points[1], 0.5));
      points[0] = point(start);
      points[points.length - 1] = point(end);
      return points;
    }
    const high = Math.max(start.y, end.y, ...obstacles.map((o) => o.top || boardTop)) + 0.06;
    return [
      point(start),
      { ...start, y: high },
      { ...mix(start, end, 0.33), y: high },
      { ...mix(start, end, 0.67), y: high },
      { ...end, y: high },
      point(end),
    ];
  }
  const gap = 0.045 + lane * 0.014,
    front = bounds.maxZ + gap;
  const side = start.x < (bounds.minX + bounds.maxX) / 2 ? bounds.minX - gap : bounds.maxX + gap;
  const relief = { x: start.x + exit.x * 0.045, y: start.y + exit.y * 0.045, z: start.z + exit.z * 0.045 };
  // A front-facing meter must first drop in front of its tilted face, then go
  // around its side. Going straight back to the PCB lane cuts through the case.
  const forwardFacing = Math.abs(exit.z) >= Math.abs(exit.x);
  const forwardClearance = (Math.max(0, start.y - floor) * Math.max(0, exit.y) + 0.035) / Math.max(Math.abs(exit.z), 0.25);
  const dropZ = forwardFacing ? (exit.z >= 0 ? Math.max(front, start.z + forwardClearance) : Math.min(front, start.z - forwardClearance)) : front;
  const perimeterStart = { x: side, y: floor, z: dropZ };
  const routeBounds = {
    minX: Math.min(bounds.minX - gap, end.x - 0.035),
    maxX: Math.max(bounds.maxX + gap, end.x + 0.035),
    minZ: Math.min(bounds.minZ - gap, end.z - 0.035),
    maxZ: Math.max(front + 0.035, dropZ + 0.035, end.z + 0.035),
  };
  const landing = lift(end);
  const route = gridRoute(perimeterStart, landing, { bounds: routeBounds, obstacles, step: 0.018, padding: 0.011, preferred: "perimeter" });
  const safeHeight = Math.max(end.y, ...obstacles.map((o) => o.top || floor)) + 0.04;
  const approach = route
    ? simplify(route.points.map(lift))
    : [
        { ...perimeterStart, y: safeHeight },
        { ...landing, y: safeHeight },
      ];
  const points = [
    point(start),
    relief,
    { x: relief.x, y: floor, z: dropZ },
    perimeterStart,
    ...approach,
    { ...point(end), y: Math.max(boardTop + 0.025, end.y - 0.03) },
    point(end),
  ];
  return roundCorners(
    points.filter((p, i) => i === 0 || Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y, p.z - points[i - 1].z) > 1e-5),
    0.028
  );
}
