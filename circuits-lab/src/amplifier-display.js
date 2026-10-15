/** Shared display scales; these never change electrical state or acquired samples. */
export function scopeAxes(reading) {
  let peak = 0;
  for (const points of Object.values(reading.points)) for (const [, v] of points) peak = Math.max(peak, Math.abs(v));
  const voltsPerDivision = peak === 0 ? 0.2 : [0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10].find((v) => v * 3.5 >= peak) || 10;
  const micro = reading.duration < 0.001;
  return { voltsPerDivision, extent: voltsPerDivision * 4, timeFactor: micro ? 1e6 : 1e3, timeUnit: micro ? "µs" : "ms" };
}
export const displayNumber = (value) => Number(value.toFixed(3)).toString();
export function scopeSvg(reading) {
  const a = scopeAxes(reading),
    x = 72,
    y = 38,
    w = 592,
    h = 260;
  const grid =
    Array.from({ length: 11 }, (_, i) => `<path d="M${x + (i * w) / 10} ${y}v${h}"/>`).join("") +
    Array.from({ length: 9 }, (_, i) => `<path d="M${x} ${y + (i * h) / 8}h${w}"/>`).join("");
  const traces = Object.entries(reading.points)
    .map(
      ([id, points]) =>
        `<polyline fill="none" stroke="${id === "ch1" ? "#eac450" : "#67cbd8"}" stroke-width="2.5" points="${points
          .map(([t, v]) => `${x + (t / reading.duration) * w},${y + h / 2 - ((v / a.extent) * h) / 2}`)
          .join(" ")}"/>`
    )
    .join("");
  const ys = [a.extent, 0, -a.extent]
    .map((v) => `<text x="${x - 12}" y="${y + h / 2 - ((v / a.extent) * h) / 2 + 5}" text-anchor="end">${displayNumber(v)}</text>`)
    .join("");
  const xs = [0, 1, 2]
    .map(
      (i) => `<text x="${x + (i * w) / 2}" y="${y + h + 26}" text-anchor="middle">${displayNumber((reading.duration * a.timeFactor * i) / 2)}</text>`
    )
    .join("");
  return `<svg viewBox="0 0 700 374" role="img" aria-label="Two oscilloscope channels on one time and voltage grid"><rect width="700" height="374" rx="8" fill="#102a38"/><g stroke="#294856" stroke-width="1">${grid}</g><path d="M${x} ${
    y + h / 2
  }h${w}" stroke="#7a939e"/>${traces}<g fill="#c9dce3" font-family="Arial,sans-serif" font-size="15">${ys}${xs}<text x="${x}" y="23">${
    a.voltsPerDivision
  } V/div</text><text x="368" y="353" text-anchor="middle">Time (${a.timeUnit})</text></g></svg>`;
}
