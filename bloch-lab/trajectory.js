import { rotate } from "./state.js";
// Sample each rotation independently: no straight connectors between gate paths.
export function rotationPath(from, axis, angle, fraction = 1, segments = 70) {
  const amount = Math.max(0, Math.min(1, fraction));
  const count = Math.max(2, Math.ceil(amount * segments) + 1);
  return Array.from({ length: count }, (_, i) => rotate(from, axis, (angle * amount * i) / (count - 1)));
}
