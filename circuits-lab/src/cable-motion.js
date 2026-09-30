// Rendering-only cable motion. These helpers never change electrical connections.
const copy = (p) => ({ x: p.x, y: p.y, z: p.z });
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
const mix = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t });

function lengths(points) {
  const cumulative = [0];
  for (let i = 1; i < points.length; i++) cumulative.push(cumulative[i - 1] + distance(points[i - 1], points[i]));
  return cumulative;
}

/** Equal arc-length samples establish correspondence between different resting routes.
 * Call once when accepting a new route, rather than resampling the animated path every frame.
 */
export function resampleCablePath(points, count = 48) {
  if (!Number.isInteger(count) || count < 2) throw new RangeError("Cable sample count must be an integer of at least two.");
  if (!points.length) return [];
  const cumulative = lengths(points),
    total = cumulative.at(-1);
  if (total === 0) return Array.from({ length: count }, () => copy(points[0]));
  const result = [copy(points[0])];
  let segment = 1;
  for (let i = 1; i < count - 1; i++) {
    const along = (total * i) / (count - 1);
    while (segment < points.length - 1 && cumulative[segment] < along) segment++;
    const span = cumulative[segment] - cumulative[segment - 1];
    result.push(mix(points[segment - 1], points[segment], span > 0 ? (along - cumulative[segment - 1]) / span : 0));
  }
  result.push(copy(points.at(-1)));
  return result;
}

/** Bend a cached path from its original endpoints. Reuse that reference throughout a hold.
 * A small endpoint move has no larger effect on any body point, and its influence falls
 * smoothly toward the opposite end. Fixed endpoints stay exact; routing does not run here.
 */
export function deformCablePath(reference, start, end, { falloff = 3 } = {}) {
  if (!reference.length) return [];
  if (reference.length === 1) return [copy(start), copy(end)];
  const cumulative = lengths(reference),
    total = cumulative.at(-1);
  const first = reference[0],
    last = reference.at(-1),
    power = Math.max(1, falloff);
  const result = reference.map((point, i) => {
    const t = total > 0 ? cumulative[i] / total : i / (reference.length - 1);
    const fromStart = (1 - t) ** power,
      fromEnd = t ** power;
    return {
      x: point.x + (start.x - first.x) * fromStart + (end.x - last.x) * fromEnd,
      y: point.y + (start.y - first.y) * fromStart + (end.y - last.y) * fromEnd,
      z: point.z + (start.z - first.z) * fromStart + (end.z - last.z) * fromEnd,
    };
  });
  result[0] = copy(start);
  result[result.length - 1] = copy(end);
  return result;
}

// Exact integration of d' = -min(response * d, speed). Unlike clamping an
// exponential lerp after the fact, crossing the speed threshold is frame-rate independent.
function remainingDistance(distance, dt, response, speed) {
  const threshold = speed / response;
  if (distance <= threshold) return distance * Math.exp(-response * dt);
  const linearTime = (distance - threshold) / speed;
  return dt <= linearTime ? distance - speed * dt : threshold * Math.exp(-response * (dt - linearTime));
}

/** Ease an existing visual path toward a newly planned route. Units: seconds and metres.
 * Interior speed is bounded; endpoint contacts deliberately follow target endpoints exactly.
 * Normal frame intervals integrate identically. A stalled frame advances at most maxDelta.
 * Prefer matching sample counts; a differing target is resampled once per call as a fallback.
 */
export function settleCablePath(current, target, dt, { response = 10, maxSpeed = 1.2, maxDelta = 0.05 } = {}) {
  if (!target.length) return current.map(copy);
  if (!current.length) return target.map(copy);
  const count = Math.max(2, current.length);
  const source = current.length === count ? current : resampleCablePath(current, count);
  const goal = target.length === count ? target : resampleCablePath(target, count);
  const step = Number.isFinite(dt) ? Math.min(Math.max(dt, 0), Math.max(maxDelta, 0)) : 0;
  const result = source.map((point, index) => {
    if (index === 0 || index === count - 1) return copy(goal[index]);
    const gap = distance(point, goal[index]);
    if (gap === 0 || step === 0 || response <= 0 || maxSpeed <= 0) return copy(point);
    const remaining = remainingDistance(gap, step, response, maxSpeed);
    return mix(point, goal[index], Math.max(0, Math.min(1, (gap - remaining) / gap)));
  });
  return result;
}
