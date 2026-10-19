/**
 * What the instruments read, derived from samples only.
 *
 * Nothing here consults the circuit's theoretical gain. A meter reports what is on
 * its probes and a gain is the ratio of two captured traces, so a miswired circuit
 * produces a wrong reading — which is the whole point of letting a student wire it
 * wrongly.
 *
 * The governing rule, from the Readout spec: when a figure cannot be justified the
 * instrument says so. It never prints a plausible number it cannot stand behind.
 */

const MIN_SIGNAL = 1e-9;

const usable = (values) =>
  (Array.isArray(values) || ArrayBuffer.isView(values)) && values.length > 0 && Array.from(values).every(Number.isFinite);

const clean = (value) => (Object.is(value, -0) ? 0 : value);

const unavailable = () => ({ mean: null, rms: null, acRms: null, peak: null, vpp: null, min: null, max: null });

/**
 * DC mean, total RMS, the RMS of the AC component alone, absolute peak and Vpp.
 *
 * Samples are normalised by their peak before squaring. A capture of large voltages
 * would otherwise square into a range where precision is lost, and the RMS of a
 * perfectly valid trace would come back wrong.
 */
export function summarize(values) {
  if (!usable(values)) return unavailable();
  const all = Array.from(values);
  let min = Infinity;
  let max = -Infinity;
  let magnitude = 0;
  for (const value of all) {
    if (value < min) min = value;
    if (value > max) max = value;
    const size = Math.abs(value);
    if (size > magnitude) magnitude = size;
  }
  if (magnitude === 0) return { mean: 0, rms: 0, acRms: 0, peak: 0, vpp: 0, min: 0, max: 0 };
  const unitMean = all.reduce((sum, value) => sum + value / magnitude, 0) / all.length;
  const unitPower = all.reduce((sum, value) => sum + (value / magnitude) ** 2, 0) / all.length;
  const unitAcPower = all.reduce((sum, value) => sum + (value / magnitude - unitMean) ** 2, 0) / all.length;
  const stats = {
    mean: clean(magnitude * unitMean),
    rms: magnitude * Math.sqrt(unitPower),
    acRms: magnitude * Math.sqrt(unitAcPower),
    peak: magnitude,
    vpp: max - min,
    min,
    max,
  };
  return Object.values(stats).every(Number.isFinite) ? stats : unavailable();
}

/**
 * What the multimeter shows.
 *
 * DC mode reports the signed mean; AC mode reports true RMS of the AC component,
 * which is what the panel claims and therefore what it must compute.
 */
export function meterReading({ samples, mode = "dc", connected = true, powered = true } = {}) {
  if (!connected) return { value: null, unit: "V", mode, error: "PROBES OPEN" };
  if (!powered) return { value: null, unit: "V", mode, error: "SUPPLY OFF" };
  const stats = summarize(samples);
  if (stats.mean === null) return { value: null, unit: "V", mode, error: "NO SIGNAL" };
  return mode === "ac"
    ? { value: stats.acRms, unit: "V RMS", mode, error: null, stats }
    : { value: stats.mean, unit: "V", mode, error: null, stats };
}

/**
 * Measured closed-loop gain, from the two captured traces.
 *
 * Magnitude comes from the ratio of peak-to-peak values; sign comes from the
 * covariance of the two traces, so an inverted output is detected from the data
 * rather than assumed from the configuration. A clipped output has no linear gain
 * and is refused outright — the ratio of a flattened wave to its input is a real
 * number, and reporting it would teach something false.
 */
export function measureGain({ reference, output, dc = false, clipped = false, complete = true, powered = true } = {}) {
  const input = summarize(reference);
  const result = summarize(output);
  const refuse = (error) => ({ gain: null, phase: null, error, input, output: result });

  if (!powered) return refuse("Switch the supply on before measuring gain.");
  if (!complete) return refuse("Complete the circuit and connect both probes before measuring gain.");
  if (clipped) return refuse("Output is saturated — there is no linear gain to measure.");
  if (!usable(reference) || !usable(output) || reference.length !== output.length) return refuse("Not enough paired samples.");
  if (input.mean === null || result.mean === null) return refuse("Not enough paired samples.");

  if (dc) {
    if (Math.abs(input.mean) <= MIN_SIGNAL) return refuse("Input is too small to measure a gain.");
    const gain = result.mean / input.mean;
    return Number.isFinite(gain) ? { gain: clean(gain), phase: "DC", error: null, input, output: result } : refuse("Gain is out of range.");
  }

  if (input.vpp <= MIN_SIGNAL) return refuse("Input is too small to measure a gain.");
  if (result.vpp === 0) return { gain: 0, phase: "flat", error: null, input, output: result };

  let covariance = 0;
  for (let i = 0; i < reference.length; i += 1) {
    covariance += (reference[i] - input.mean) * (output[i] - result.mean);
  }
  if (!Number.isFinite(covariance) || covariance === 0) return refuse("These traces do not establish an in-phase or inverted response.");

  const gain = Math.sign(covariance) * (result.vpp / input.vpp);
  return Number.isFinite(gain)
    ? { gain: clean(gain), phase: covariance < 0 ? "inverted" : "in phase", error: null, input, output: result }
    : refuse("Gain is out of range.");
}

/**
 * Measured against theoretical, which is the comparison the laboratory exists to
 * make. A disagreement is reported plainly and both figures stay visible: it
 * usually means a miswired circuit, and that is what the student needs to find.
 */
export function compareWithTheory({ measured, theoretical, tolerance = 0.02 } = {}) {
  if (measured?.gain == null || !Number.isFinite(theoretical)) {
    return { agrees: null, error: measured?.error ?? "No measured gain yet.", theoretical, measured: measured?.gain ?? null };
  }
  const scale = Math.max(Math.abs(theoretical), 1e-6);
  const deviation = Math.abs(measured.gain - theoretical) / scale;
  return {
    agrees: deviation <= tolerance,
    deviation,
    theoretical,
    measured: measured.gain,
    error: null,
  };
}
