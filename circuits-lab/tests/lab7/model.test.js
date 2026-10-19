import test from "node:test";
import assert from "node:assert/strict";
import { sample, peak, capture, WAVEFORMS } from "../../src/lab7/model/signal.js";
import { transfer, limitFor, respond, CONFIGURATIONS, OUTPUT_HEADROOM } from "../../src/lab7/model/amplifier.js";
import { summarize, measureGain, meterReading, compareWithTheory } from "../../src/lab7/model/measure.js";

const close = (actual, expected, tolerance, what) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${what}: got ${actual}, expected ${expected} ±${tolerance}`);

// ---- signal ---------------------------------------------------------------

test("amplitude is peak-to-peak for AC and a signed level for DC", () => {
  assert.equal(peak({ waveform: "sine", amplitude: 1 }), 0.5);
  assert.equal(peak({ waveform: "square", amplitude: 4 }), 2);
  assert.equal(peak({ waveform: "dc", amplitude: -3 }), -3);
  // A 1 Vpp sine reaches +0.5 V at a quarter cycle, not +1 V.
  close(sample({ waveform: "sine", amplitude: 1, frequency: 1000 }, 0.00025), 0.5, 1e-12, "sine quarter cycle");
});

test("every waveform spans exactly its peak-to-peak amplitude", () => {
  for (const waveform of WAVEFORMS) {
    if (waveform === "dc") continue;
    const stats = summarize(capture({ waveform, amplitude: 2, frequency: 1000 }, { cycles: 1, points: 4096 }));
    close(stats.vpp, 2, 2e-3, `${waveform} Vpp`);
    close(stats.mean, 0, 2e-3, `${waveform} mean`);
  }
});

test("RMS matches the closed form for each waveform at 2 Vpp", () => {
  // Peak is 1 V, so: sine 1/sqrt2, square 1, triangle 1/sqrt3.
  const expected = { sine: Math.SQRT1_2, square: 1, triangle: 1 / Math.sqrt(3) };
  for (const [waveform, want] of Object.entries(expected)) {
    const stats = summarize(capture({ waveform, amplitude: 2, frequency: 1000 }, { cycles: 1, points: 8192 }));
    close(stats.rms, want, 2e-3, `${waveform} RMS`);
  }
});

test("a DC level is reported as its own mean and RMS", () => {
  const stats = summarize(capture({ waveform: "dc", amplitude: -2.5 }, { points: 64 }));
  close(stats.mean, -2.5, 1e-12, "DC mean");
  close(stats.rms, 2.5, 1e-12, "DC RMS");
  close(stats.acRms, 0, 1e-12, "DC has no AC component");
});

// ---- amplifier ------------------------------------------------------------

test("every configuration matches its textbook closed-loop result", () => {
  const R = { rin: 10000, rf: 20000, rin2: 10000, rf2: 20000 };
  const { rin, rf, rin2, rf2 } = R;

  close(transfer({ configuration: "inverting", ...R }).vin1, -rf / rin, 1e-12, "inverting");
  close(transfer({ configuration: "noninverting", ...R }).vin1, 1 + rf / rin, 1e-12, "non-inverting");

  const adder = transfer({ configuration: "adder", ...R });
  close(adder.vin1, -rf / rin, 1e-12, "adder Vin1");
  close(adder.vin2, -rf / rin2, 1e-12, "adder Vin2");

  const difference = transfer({ configuration: "subtractor", ...R });
  close(difference.vin1, -rf / rin, 1e-12, "difference Vin1");
  close(difference.vin2, ((1 + rf / rin) * rf2) / (rin2 + rf2), 1e-12, "difference Vin2");
});

test("the difference amplifier uses the general four-resistor result, not the matched shortcut", () => {
  // Deliberately unmatched: R2/R1 = 2 but R4/R3 = 1.
  const unmatched = transfer({ configuration: "subtractor", rin: 10000, rf: 20000, rin2: 10000, rf2: 10000 });
  assert.equal(unmatched.matched, false);
  close(unmatched.vin1, -2, 1e-12, "Vin1");
  close(unmatched.vin2, (1 + 2) * 0.5, 1e-12, "Vin2");
  // A matched-pair model would wrongly claim equal and opposite coefficients.
  assert.notEqual(Math.abs(unmatched.vin1), Math.abs(unmatched.vin2));
  // Equal inputs therefore do NOT cancel, which is the lesson.
  const common = unmatched.vin1 * 1 + unmatched.vin2 * 1;
  assert.ok(Math.abs(common) > 0.4, "unmatched bridge should not reject a common-mode input");

  const matched = transfer({ configuration: "subtractor", rin: 10000, rf: 20000, rin2: 10000, rf2: 20000 });
  assert.equal(matched.matched, true);
  close(matched.vin1 + matched.vin2, 0, 1e-12, "matched bridge rejects common mode");
});

test("a rail limits the output and the limit is stated, not implied", () => {
  for (const rail of [8, 12, 15]) close(limitFor(rail), rail - OUTPUT_HEADROOM, 1e-12, `±${rail} limit`);
  assert.equal(limitFor(1, 1.5), 0, "headroom never produces a negative limit");
});

test("an over-driven amplifier clips at the limit and says so", () => {
  const times = Array.from({ length: 512 }, (_, i) => i / 512 / 1000);
  const result = respond({
    configuration: "inverting",
    resistors: { rin: 10000, rf: 20000 },
    sources: [{ waveform: "sine", amplitude: 20, frequency: 1000 }],
    rail: 12,
    times,
  });
  assert.equal(result.clipped, true);
  const stats = summarize(result.output);
  close(stats.peak, limitFor(12), 1e-9, "clipped peak sits at the limit");
});

test("an unpowered amplifier produces nothing at all", () => {
  const times = Array.from({ length: 64 }, (_, i) => i / 64 / 1000);
  const result = respond({
    configuration: "inverting",
    resistors: { rin: 10000, rf: 20000 },
    sources: [{ waveform: "sine", amplitude: 1, frequency: 1000 }],
    rail: 12,
    powered: false,
    times,
  });
  assert.ok(Array.from(result.output).every((v) => v === 0));
});

// ---- the bench defaults, end to end ---------------------------------------

test("bench defaults: 1 Vpp into Rf/Rin = 2 gives 2 Vpp out, inverted, 0.707 Vrms", () => {
  const times = Array.from({ length: 4096 }, (_, i) => (i / 4096) * (1 / 1000));
  const result = respond({
    configuration: "inverting",
    resistors: { rin: 10000, rf: 20000 },
    sources: [{ waveform: "sine", amplitude: 1, frequency: 1000 }],
    rail: 12,
    times,
  });
  assert.equal(result.clipped, false);
  const out = summarize(result.output);
  close(out.vpp, 2, 2e-3, "output Vpp");
  close(out.acRms, 1 / Math.SQRT2, 2e-3, "output RMS");

  const measured = measureGain({ reference: result.reference, output: result.output });
  close(measured.gain, -2, 2e-3, "measured gain");
  assert.equal(measured.phase, "inverted");

  const agreement = compareWithTheory({ measured, theoretical: result.coefficients.vin1 });
  assert.equal(agreement.agrees, true);
});

test("measured gain is derived from the traces, not from the configuration", () => {
  // Feed an output that does NOT match the circuit; the measurement must follow
  // the samples. This is what lets a miswired bench read wrongly.
  const reference = Float64Array.from({ length: 512 }, (_, i) => Math.sin((2 * Math.PI * i) / 512));
  const output = reference.map((v) => v * 3);
  const measured = measureGain({ reference, output });
  close(measured.gain, 3, 1e-6, "gain follows the data");
  assert.equal(measured.phase, "in phase");
});

test("a clipped, incomplete or unpowered circuit refuses to report a gain", () => {
  const reference = Float64Array.from({ length: 128 }, (_, i) => Math.sin((2 * Math.PI * i) / 128));
  const output = reference.map((v) => v * -2);
  for (const bad of [{ clipped: true }, { complete: false }, { powered: false }]) {
    const measured = measureGain({ reference, output, ...bad });
    assert.equal(measured.gain, null);
    assert.ok(measured.error && measured.error.length > 0, "a refusal always explains itself");
    assert.equal(compareWithTheory({ measured, theoretical: -2 }).agrees, null);
  }
});

test("the meter states its mode, and refuses rather than inventing a figure", () => {
  const ac = capture({ waveform: "sine", amplitude: 2, frequency: 1000 }, { cycles: 1, points: 4096 });
  close(meterReading({ samples: ac, mode: "ac" }).value, 1 / Math.SQRT2, 2e-3, "true RMS");
  close(meterReading({ samples: ac, mode: "dc" }).value, 0, 2e-3, "DC mean of a symmetric wave");

  assert.equal(meterReading({ samples: ac, connected: false }).value, null);
  assert.equal(meterReading({ samples: ac, connected: false }).error, "PROBES OPEN");
  assert.equal(meterReading({ samples: ac, powered: false }).error, "SUPPLY OFF");
});

test("nonfinite or empty captures are unavailable rather than NaN", () => {
  for (const bad of [[], [Number.NaN], [1, Infinity], null, undefined]) {
    const stats = summarize(bad);
    assert.equal(stats.rms, null);
    assert.equal(stats.vpp, null);
  }
});

test("every configuration declares resistors that the transfer actually uses", () => {
  for (const spec of Object.values(CONFIGURATIONS)) {
    assert.ok(spec.resistors.length >= 2, `${spec.id} needs at least two resistors`);
    const coefficients = transfer({ configuration: spec.id });
    assert.ok(Number.isFinite(coefficients.vin1));
    assert.equal(Number.isFinite(coefficients.vin2), true);
    if (spec.inputs === 1) assert.equal(coefficients.vin2, 0, `${spec.id} has no second input`);
    else assert.notEqual(coefficients.vin2, 0, `${spec.id} must use its second input`);
  }
});
