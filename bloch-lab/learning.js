export const bases = { X: [1, 0, 0], Y: [0, 1, 0], Z: [0, 0, 1] };
export function probability(vector, basis = "Z") {
  return Math.max(
    0,
    Math.min(
      1,
      (1 + vector.reduce((s, x, i) => s + x * bases[basis][i], 0)) / 2,
    ),
  );
}
export function sample(vector, basis = "Z", random = Math.random) {
  return random() < probability(vector, basis) ? 0 : 1;
}
export function formatProbability(p) {
  if (p <= 1e-12) return "0%";
  if (p >= 1 - 1e-12) return "100%";
  if (p < 0.00005) return "<0.01%";
  if (p > 0.99995) return ">99.99%";
  const n = Math.round(p * 10000) / 100;
  return (Math.abs(n - p * 100) > 1e-9 ? "≈" : "") + n + "%";
}
