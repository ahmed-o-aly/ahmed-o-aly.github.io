export const presets = {
  0: [0, 0, 1],
  1: [0, 0, -1],
  "+": [1, 0, 0],
  "−": [-1, 0, 0],
  "+i": [0, 1, 0],
  "−i": [0, -1, 0],
};
const q = Math.SQRT1_2;
export const gates = {
  H: { axis: [q, 0, q], angle: Math.PI },
  X: { axis: [1, 0, 0], angle: Math.PI },
  Y: { axis: [0, 1, 0], angle: Math.PI },
  Z: { axis: [0, 0, 1], angle: Math.PI },
  S: { axis: [0, 0, 1], angle: Math.PI / 2 },
  T: { axis: [0, 0, 1], angle: Math.PI / 4 },
};
export function rotate(v, a, t) {
  const c = Math.cos(t),
    s = Math.sin(t),
    d = v.reduce((n, x, i) => n + x * a[i], 0);
  const cross = [a[1] * v[2] - a[2] * v[1], a[2] * v[0] - a[0] * v[2], a[0] * v[1] - a[1] * v[0]];
  return v.map((x, i) => x * c + cross[i] * s + a[i] * d * (1 - c));
}
export function angles(v) {
  return {
    theta: Math.acos(Math.max(-1, Math.min(1, v[2]))),
    phi: Math.hypot(v[0], v[1]) < 1e-10 ? 0 : ((Math.atan2(v[1], v[0]) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI),
  };
}
export function preparation(from, to) {
  let axis = [from[1] * to[2] - from[2] * to[1], from[2] * to[0] - from[0] * to[2], from[0] * to[1] - from[1] * to[0]],
    length = Math.hypot(...axis);
  if (length < 1e-8) {
    const basis = Math.abs(from[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    axis = [from[1] * basis[2] - from[2] * basis[1], from[2] * basis[0] - from[0] * basis[2], from[0] * basis[1] - from[1] * basis[0]];
    length = Math.hypot(...axis);
  }
  return {
    axis: axis.map((x) => x / length),
    angle: Math.acos(
      Math.max(
        -1,
        Math.min(
          1,
          from.reduce((n, x, i) => n + x * to[i], 0)
        )
      )
    ),
  };
}
export function measure(v, random = Math.random) {
  return random() < (1 + v[2]) / 2 ? 0 : 1;
}

export function progress(now, start, duration) {
  return duration <= 0 ? 1 : Math.max(0, Math.min(1, (now - start) / duration));
}
