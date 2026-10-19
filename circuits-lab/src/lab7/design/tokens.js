/**
 * The design system, as the bench consumes it.
 *
 * tokens.json beside this file is a verbatim copy of the Op-Amp Lab design
 * system's tokens, so there is one source for a colour and the bench cannot drift
 * from the system it was designed against. Everything here reads from it; nothing
 * re-states a value.
 *
 * The whole laboratory is built in METRES with Y up, which is what a room-scale
 * headset requires, and every dimension is a whole multiple of the 0.1 inch
 * breadboard pitch.
 */

// The import attribute is required by Node and understood by Vite, so the
// design system's own JSON is the single source in both the app and the tests.
import tokens from "./tokens.json" with { type: "json" };

/** 0.1 inch. The spacing of a tie point and the pin pitch of every DIP package. */
export const PITCH = 0.00254;
/** Millimetres to metres, for reading dimensions straight off the elevations. */
export const mm = (value) => value / 1000;
/** Pitches to metres. */
export const pitches = (count) => count * PITCH;

const byName = new Map(tokens.color.tokens.map((token) => [token.name, token]));
const theme = tokens.color.themes[0].id;

/** A design-system colour as a CSS string. */
export function css(name) {
  const token = byName.get(name);
  if (!token) throw new RangeError(`Unknown colour token: ${name}`);
  return typeof token.value === "string" ? token.value : token.value[theme];
}

/** The signal-role palette: the only saturated colours allowed on a lead or jack. */
export const SIGNAL = Object.freeze({
  supplyPos: css("signal-supply-pos"),
  supplyNeg: css("signal-supply-neg"),
  ground: css("signal-ground"),
  input: css("signal-input"),
  inputB: css("signal-input-b"),
  feedback: css("signal-feedback"),
  output: css("signal-output"),
});

/** Interaction states. At most one `next` exists in the room at any moment. */
export const STATE = Object.freeze({
  next: css("state-next"),
  valid: css("state-valid"),
  blocked: css("state-blocked"),
  selected: css("state-selected"),
});

export const SURFACE = Object.freeze({
  shell: css("case-shell"),
  panel: css("case-panel"),
  trim: css("case-trim"),
  legend: css("panel-legend"),
  legendMuted: css("panel-legend-muted"),
  readoutField: css("readout-field"),
  readoutPrimary: css("readout-primary"),
  traceA: css("readout-trace-a"),
  traceB: css("readout-trace-b"),
  graticule: css("readout-graticule"),
  boardBody: css("board-body"),
  boardRecess: css("board-recess"),
  benchTop: css("bench-top"),
  floor: css("room-floor"),
  wall: css("room-wall"),
});

/**
 * Cap heights in millimetres, from the system's Legibility section. 6.0 mm is the
 * floor for anything read from the standing position; 4.5 mm is permitted only
 * within arm's reach.
 */
export const CAP_MM = Object.freeze({ title: 8.0, legend: 6.0, micro: 4.5, readoutXL: 15.0, readoutLG: 8.0, readoutSM: 5.5 });

/** A cap height is about 0.7 of the font size for these faces. */
export const fontMM = (cap) => cap / 0.7;

export const FONT = Object.freeze({
  legend: '600 {size}px "Barlow Semi Condensed", "Roboto Condensed", system-ui, sans-serif',
  legendRegular: '500 {size}px "Barlow Semi Condensed", "Roboto Condensed", system-ui, sans-serif',
  readout: '500 {size}px "Roboto Mono", ui-monospace, Menlo, monospace',
});

/** `font(FONT.legend, CAP_MM.legend)` in a context scaled to millimetres. */
export const font = (template, capMM) => template.replace("{size}", fontMM(capMM).toFixed(2));

export { tokens };
