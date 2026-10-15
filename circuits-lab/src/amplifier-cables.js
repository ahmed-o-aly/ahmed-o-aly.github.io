// Geometry only: these functions never inspect or change electrical connectivity.
import * as THREE from "three";

export const validCablePath = (points) =>
  Array.isArray(points) &&
  points.length >= 2 &&
  points.length <= 2048 &&
  points.every((p) => Array.isArray(p) && p.length === 3 && p.every(Number.isFinite));
const vectors = (points) => points.map((p) => new THREE.Vector3(...p));
export const cableCurve = (points) => new THREE.CatmullRomCurve3(vectors(points), false, "centripetal");

// Seed legacy/named connections once; subsequent edits use the stored curve.
export function seedCable(points) {
  const raw = vectors(points),
    rounded = [raw[0]];
  for (let i = 1; i < raw.length - 1; i++) {
    const a = raw[i].clone().sub(raw[i - 1]),
      b = raw[i + 1].clone().sub(raw[i]);
    const radius = Math.min(0.22, a.length() / 3, b.length() / 3);
    rounded.push(raw[i].clone().addScaledVector(a.normalize(), -radius), raw[i], raw[i].clone().addScaledVector(b.normalize(), radius));
  }
  rounded.push(raw.at(-1));
  return new THREE.CatmullRomCurve3(rounded, false, "centripetal").getSpacedPoints(32).map((p) => p.toArray());
}

export function traceCable(trail, tip, spacing = 0.12) {
  const last = trail.at(-1),
    d = Math.hypot(...tip.map((v, i) => v - last[i]));
  let next = trail.map((p) => [...p]);
  if (d >= spacing) next.push([...tip]);
  if (next.length > 96) next = next.filter((_, i) => i === 0 || i === next.length - 1 || i % 2 === 0);
  const route = next.map((p) => [...p]);
  if (Math.hypot(...tip.map((v, i) => v - route.at(-1)[i])) > 0.001) route.push([...tip]);
  if (route.length < 2) route.push([...tip]);
  return { trail: next, route };
}

export function moveCableEnd(points, end, target) {
  const index = end === 0 ? 0 : points.length - 1,
    origin = points[index],
    delta = target.map((v, i) => v - origin[i]);
  const reach = Math.max(3, Math.ceil(points.length * 0.35));
  return points.map((p, i) => {
    const distance = Math.abs(i - index),
      fixed = end === 0 ? points.length - 1 : 0,
      weight = i === fixed || distance >= reach ? 0 : (1 - distance / reach) ** 2;
    return p.map((v, k) => v + delta[k] * weight);
  });
}

export function grabCable(points, at) {
  // Add a control at the actual picked point so a middle grab never jumps to a knot.
  const target = new THREE.Vector3(...at),
    vs = vectors(points);
  let best = { distance: Infinity, index: 1 };
  for (let i = 0; i < vs.length - 1; i++) {
    const line = new THREE.Line3(vs[i], vs[i + 1]),
      p = line.closestPointToPoint(target, true, new THREE.Vector3());
    const distance = p.distanceToSquared(target);
    if (distance < best.distance) best = { distance, index: i + 1 };
  }
  const route = points.map((p) => [...p]);
  route.splice(best.index, 0, [...at]);
  return { route, index: best.index };
}

export function bendCable(points, index, target) {
  const delta = target.map((v, k) => v - points[index][k]);
  // A local smooth falloff keeps both physical sockets fixed and leaves distant bends alone.
  const reach = Math.max(3, Math.ceil(points.length * 0.18));
  return points.map((p, i) => {
    const d = Math.abs(i - index),
      w = i === 0 || i === points.length - 1 || d >= reach ? 0 : (1 + Math.cos((Math.PI * d) / reach)) / 2;
    return p.map((v, k) => v + delta[k] * w);
  });
}
