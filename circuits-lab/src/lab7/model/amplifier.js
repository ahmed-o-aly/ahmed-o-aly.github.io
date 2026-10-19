/**
 * The 741 as this laboratory teaches it: an ideal op-amp with negative feedback,
 * finite supply rails and a real output swing limit.
 *
 * Each configuration is described by the coefficients of its inputs, derived from
 * the textbook node equations rather than hard-coded per case. Bandwidth, slew
 * rate, input offset, bias currents and load effects are out of scope and the
 * interface says so rather than implying a precision this does not have.
 */

import { peak, sample } from "./signal.js";

/**
 * How close the output can get to a rail. A real 741 driving a light load swings to
 * roughly 1.5 V inside each rail — at ±15 V the datasheet's typical output swing is
 * ±13 V. This is a single named constant precisely so it can be set to a stricter
 * datasheet figure without hunting through the model.
 */
export const OUTPUT_HEADROOM = 1.5;

/** The supply voltages the bench offers, as magnitudes of a symmetric pair. */
export const RAILS = Object.freeze([8, 12, 15]);

/**
 * Resistor roles per configuration. `id` is the model's key, `name` is what the
 * panel prints, and `path` is where the part physically sits in the circuit.
 */
export const CONFIGURATIONS = Object.freeze({
  inverting: {
    id: "inverting",
    name: "Inverting amplifier",
    inputs: 1,
    formula: "Vout = −(Rf / Rin) · Vin",
    resistors: [
      { id: "rin", name: "Rin", path: "Vin → −IN" },
      { id: "rf", name: "Rf", path: "Vout → −IN" },
    ],
  },
  noninverting: {
    id: "noninverting",
    name: "Non-inverting amplifier",
    inputs: 1,
    formula: "Vout = (1 + Rf / Rg) · Vin",
    resistors: [
      { id: "rin", name: "Rg", path: "−IN → GND" },
      { id: "rf", name: "Rf", path: "Vout → −IN" },
    ],
  },
  adder: {
    id: "adder",
    name: "Summing amplifier",
    inputs: 2,
    formula: "Vout = −Rf · (Vin1 / Rin1 + Vin2 / Rin2)",
    resistors: [
      { id: "rin", name: "Rin1", path: "Vin1 → −IN" },
      { id: "rin2", name: "Rin2", path: "Vin2 → −IN" },
      { id: "rf", name: "Rf", path: "Vout → −IN" },
    ],
  },
  subtractor: {
    id: "subtractor",
    name: "Difference amplifier",
    inputs: 2,
    formula: "Vout = −(R2/R1)·Vin1 + (1 + R2/R1)·R4/(R3+R4)·Vin2",
    resistors: [
      { id: "rin", name: "R1", path: "Vin1 → −IN" },
      { id: "rf", name: "R2", path: "Vout → −IN" },
      { id: "rin2", name: "R3", path: "Vin2 → +IN" },
      { id: "rf2", name: "R4", path: "+IN → GND" },
    ],
  },
});

const positive = (value, name) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be greater than zero.`);
  return value;
};

/**
 * The closed-loop coefficients of a configuration: how much of each input reaches
 * the output. Returned rather than applied, so the interface can print the
 * theoretical gain beside the measured one.
 *
 * The difference amplifier uses the GENERAL four-resistor result, not the matched-
 * pair shortcut. A student who sets R4 ≠ R3·R2/R1 gets the asymmetric answer their
 * circuit actually produces, and can discover why common-mode rejection needs
 * matching.
 */
export function transfer({ configuration = "inverting", rin = 10000, rf = 20000, rin2 = 10000, rf2 = 20000 } = {}) {
  const spec = CONFIGURATIONS[configuration];
  if (!spec) throw new RangeError(`Unknown configuration: ${configuration}.`);
  positive(rin, "Rin");
  positive(rf, "Rf");
  const ratio = rf / rin;
  let vin1 = 0;
  let vin2 = 0;
  if (configuration === "inverting") {
    vin1 = -ratio;
  } else if (configuration === "noninverting") {
    vin1 = 1 + ratio;
  } else if (configuration === "adder") {
    positive(rin2, "Rin2");
    vin1 = -ratio;
    vin2 = -rf / rin2;
  } else {
    positive(rin2, "R3");
    positive(rf2, "R4");
    vin1 = -ratio;
    vin2 = ((1 + ratio) * rf2) / (rin2 + rf2);
  }
  // Equal inputs cancel only when R2/R1 = R4/R3; the panel uses this to offer the
  // matching hint rather than silently correcting the student's values.
  const matched = configuration === "subtractor" ? Math.abs(ratio - rf2 / rin2) < 1e-9 : null;
  return { ...spec, vin1, vin2, matched, ratio };
}

/** The magnitude the output cannot exceed on a given supply. */
export function limitFor(rail, headroom = OUTPUT_HEADROOM) {
  return Math.max(0, Math.abs(rail) - headroom);
}

/**
 * Instantaneous output, saturating at the rails.
 * `inputs` are volts already sampled from the sources.
 */
export function outputAt({ coefficients, inputs: [v1 = 0, v2 = 0] = [], limit = Infinity, powered = true } = {}) {
  if (!powered) return 0;
  const ideal = coefficients.vin1 * v1 + coefficients.vin2 * v2;
  const value = Math.max(-limit, Math.min(limit, ideal));
  return Object.is(value, -0) ? 0 : value;
}

/**
 * The amplifier's response to its sources over one capture.
 *
 * Returns the reference input a gain would be measured against — Vin for a single
 * input, the weighted sum for the adder, the difference for the subtractor — so
 * that a two-input circuit never reports a single meaningless "gain".
 */
export function respond({ configuration, resistors, sources, rail, powered = true, headroom = OUTPUT_HEADROOM, times } = {}) {
  const coefficients = transfer({ configuration, ...resistors });
  const limit = limitFor(rail, headroom);
  const [s1, s2] = sources;
  const input = new Float64Array(times.length);
  const output = new Float64Array(times.length);
  const reference = new Float64Array(times.length);
  let clipped = false;
  for (let i = 0; i < times.length; i += 1) {
    const v1 = sample(s1, times[i]);
    const v2 = coefficients.inputs === 2 && s2 ? sample(s2, times[i]) : 0;
    const ideal = coefficients.vin1 * v1 + coefficients.vin2 * v2;
    const value = powered ? Math.max(-limit, Math.min(limit, ideal)) : 0;
    if (powered && Math.abs(ideal) > limit + 1e-12) clipped = true;
    input[i] = v1;
    output[i] = value;
    // The quantity the output is proportional to, whatever the configuration.
    reference[i] = coefficients.inputs === 2 ? (configuration === "adder" ? v1 + v2 : v2 - v1) : v1;
  }
  return { coefficients, limit, clipped, input, output, reference, powered };
}

/** Largest input this circuit can take before the output saturates. */
export function headroomFor({ coefficients, limit }) {
  const gain = Math.abs(coefficients.vin1);
  return gain === 0 ? Infinity : limit / gain;
}

/** Peak-to-peak volts the circuit would produce, before any sampling. */
export function expectedOutputVpp({ coefficients, sources, limit }) {
  const [s1, s2] = sources;
  const magnitude =
    coefficients.inputs === 2
      ? Math.abs(coefficients.vin1) * peak(s1) * 2 + Math.abs(coefficients.vin2) * peak(s2 ?? { amplitude: 0 }) * 2
      : Math.abs(coefficients.vin1) * peak(s1) * 2;
  return Math.min(magnitude, limit * 2);
}
