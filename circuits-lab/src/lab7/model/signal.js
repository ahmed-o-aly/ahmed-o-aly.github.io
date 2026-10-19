/**
 * The signal source, in the units the bench actually prints.
 *
 * The front panel reads "AMPLITUDE Vpp", so `amplitude` IS peak-to-peak volts for
 * every AC waveform. The conversion to peak happens here, once, and nowhere else —
 * a Vpp figure multiplied as though it were a peak is the easiest way to be wrong
 * by a factor of two and still look plausible.
 *
 * For the DC waveform there is no peak-to-peak, so `amplitude` is the signed level
 * in volts. The panel changes its unit to match.
 */

export const WAVEFORMS = Object.freeze(["dc", "sine", "square", "triangle"]);

const finite = (value, name) => {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new RangeError(`${name} must be a finite number.`);
  return value;
};

/** Unit shape in [-1, 1] at a phase in [0, 1). */
function shape(waveform, phase) {
  const turn = 2 * Math.PI * phase;
  switch (waveform) {
    case "sine":
      return Math.sin(turn);
    case "square":
      // The ideal square is +1 for the first half cycle. Taking the sign of a sine
      // would make the sample exactly at the zero crossing arbitrary.
      return phase < 0.5 ? 1 : -1;
    case "triangle":
      return phase < 0.25 ? 4 * phase : phase < 0.75 ? 2 - 4 * phase : 4 * phase - 4;
    default:
      throw new RangeError(`Unsupported waveform: ${waveform}.`);
  }
}

/** Peak volts of a signal: half of Vpp for AC, the level itself for DC. */
export function peak({ waveform = "sine", amplitude = 1 } = {}) {
  finite(amplitude, "Amplitude");
  return waveform === "dc" ? amplitude : Math.abs(amplitude) / 2;
}

/** One sample in volts at time t seconds. */
export function sample({ waveform = "sine", amplitude = 1, frequency = 1000 } = {}, t = 0) {
  finite(amplitude, "Amplitude");
  finite(t, "Time");
  if (waveform === "dc") return amplitude;
  if (!WAVEFORMS.includes(waveform)) throw new RangeError(`Unsupported waveform: ${waveform}.`);
  if (!(frequency > 0) || !Number.isFinite(frequency)) throw new RangeError("Frequency must be greater than zero.");
  // Wrap before scaling so long capture times do not lose phase resolution.
  const phase = (((frequency * t) % 1) + 1) % 1;
  const value = (Math.abs(amplitude) / 2) * shape(waveform, phase);
  return Object.is(value, -0) ? 0 : value;
}

/**
 * A whole number of cycles, which is what makes an RMS figure exact rather than
 * dependent on where the capture happened to stop.
 */
export function capture(signal, { cycles = 4, points = 1024 } = {}) {
  const span = signal.waveform === "dc" ? 1 : cycles / signal.frequency;
  const out = new Float64Array(points);
  for (let i = 0; i < points; i += 1) out[i] = sample(signal, (i / points) * span);
  return out;
}
