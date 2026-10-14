/** Sample-derived instrument readings in volts; no theoretical circuit gain is used. */

const unavailableStats = () => ({
  mean: null,
  rms: null,
  acRms: null,
  peak: null,
  vpp: null,
});
const cleanZero = (value) => (Object.is(value, -0) ? 0 : value);
const finiteSamples = (values) =>
  (Array.isArray(values) || ArrayBuffer.isView(values)) && values.length > 0 && Array.from(values).every(Number.isFinite);

/**
 * DC mean, AC+DC RMS, AC-component RMS, absolute peak and peak-to-peak.
 * Empty or nonfinite captures have unavailable readings rather than NaN/Infinity.
 */
export function summarizeSamples(values) {
  if (!finiteSamples(values)) return unavailableStats();
  let low = Infinity;
  let high = -Infinity;
  let peak = 0;
  for (const value of values) {
    low = Math.min(low, value);
    high = Math.max(high, value);
    peak = Math.max(peak, Math.abs(value));
  }
  if (peak === 0) return { mean: 0, rms: 0, acRms: 0, peak: 0, vpp: 0 };
  // Normalize before squaring so finite sample values do not overflow their RMS.
  const normalizedMean = Array.from(values).reduce((sum, value) => sum + value / peak, 0) / values.length;
  const mean = peak * normalizedMean;
  const normalizedPower = Array.from(values).reduce((sum, value) => sum + (value / peak) ** 2, 0) / values.length;
  const normalizedAcPower = Array.from(values).reduce((sum, value) => sum + (value / peak - normalizedMean) ** 2, 0) / values.length;
  const stats = {
    mean: cleanZero(mean),
    rms: peak * Math.sqrt(normalizedPower),
    acRms: peak * Math.sqrt(normalizedAcPower),
    peak,
    vpp: high - low,
  };
  return Object.values(stats).every(Number.isFinite) ? stats : unavailableStats();
}

/**
 * inputs are the measured reference signal: Vin, Vin1 + Vin2, or Vin2 - Vin1.
 * DC gain uses the ratio of means. AC magnitude uses Vpp; covariance determines
 * polarity independently of trace scaling. A zero output is a valid zero gain.
 * Clipped, stale, incomplete and near-zero captures cannot establish linear gain.
 */
export function measuredResponse({ inputs, outputs, dc = false, clipped = false, valid = true, stale = false } = {}) {
  const inputStats = summarizeSamples(inputs);
  const outputStats = summarizeSamples(outputs);
  const unavailable = (error) => ({
    gain: null,
    phase: "unavailable",
    error,
    inputStats,
    outputStats,
  });
  if (!valid) return unavailable("Connect the circuit and measurement probes before measuring gain.");
  if (stale) return unavailable("Held samples are stale; acquire the current circuit again.");
  if (clipped) return unavailable("Output is clipped; linear gain is unavailable.");
  if (
    !finiteSamples(inputs) ||
    !finiteSamples(outputs) ||
    inputs.length !== outputs.length ||
    inputs.length < (dc ? 1 : 3) ||
    inputStats.mean === null ||
    outputStats.mean === null
  ) {
    return unavailable("Insufficient valid paired samples.");
  }
  const minimumInput = 1e-9;
  if (dc) {
    if (Math.abs(inputStats.mean) <= minimumInput) return unavailable("Reference input is zero or too small to measure gain.");
    const gain = outputStats.mean / inputStats.mean;
    return Number.isFinite(gain)
      ? {
          gain: cleanZero(gain),
          phase: "DC",
          error: null,
          inputStats,
          outputStats,
        }
      : unavailable("Measured gain is outside the supported numerical range.");
  }
  if (inputStats.vpp <= minimumInput || inputStats.acRms <= minimumInput) {
    return unavailable("Reference input is zero or too small to measure gain.");
  }
  if (outputStats.vpp === 0) return { gain: 0, phase: "flat", error: null, inputStats, outputStats };
  // Normalized covariance gives phase without multiplying large voltages together.
  let covariance = 0;
  let inputVariance = 0;
  let outputVariance = 0;
  for (let index = 0; index < inputs.length; index += 1) {
    const x = inputs[index] / inputStats.peak - inputStats.mean / inputStats.peak;
    const y = outputs[index] / outputStats.peak - outputStats.mean / outputStats.peak;
    covariance += x * y;
    inputVariance += x * x;
    outputVariance += y * y;
  }
  const correlation = covariance / Math.sqrt(inputVariance * outputVariance);
  if (!Number.isFinite(correlation) || Math.abs(correlation) <= 1e-6) {
    return unavailable("The captured signals do not establish an in-phase or inverted response.");
  }
  const gain = Math.sign(covariance) * (outputStats.vpp / inputStats.vpp);
  return Number.isFinite(gain)
    ? {
        gain: cleanZero(gain),
        phase: covariance < 0 ? "inverted" : "in phase",
        error: null,
        inputStats,
        outputStats,
      }
    : unavailable("Measured gain is outside the supported numerical range.");
}
