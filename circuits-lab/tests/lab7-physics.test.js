import test from "node:test";
import assert from "node:assert/strict";
import { opamp, signalSample } from "../src/physics.js";
import { measuredResponse, summarizeSamples } from "../src/amplifier-samples.js";

function near(actual, expected, tolerance = 1e-9) {
  assert.ok(Number.isFinite(actual), `Expected a finite value, got ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);
}

function capture(parameters = {}, count = 4096) {
  const frequency = parameters.frequency ?? 1000;
  const models = Array.from({ length: count }, (_, index) => opamp({ ...parameters, frequency, time: index / count / frequency }));
  return {
    inputs: models.map((model) => model.referenceInput),
    outputs: models.map((model) => model.output),
    clipped: models.some((model) => model.clipped),
    dc: parameters.waveform === "dc",
  };
}

// Reference cases from Nishar's report review use an ideal teaching model, Vpk
// source coefficients, matched subtractor ratios, and the retained 1 V headroom.
test("A: 1 Vpp inverting sine yields -2 gain, 2 Vpp and 0.7071 Vrms output", () => {
  const parameters = {
    rin: 10000,
    rf: 20000,
    amplitude: 0.5,
    frequency: 1000,
    rail: 12,
  };
  const model = opamp({ ...parameters, time: 0.00025 });
  near(model.gain, -2);
  near(model.input, 0.5);
  near(model.output, -1);
  near(model.peakOutput, 1);
  assert.equal(model.modelState, "linear");
  const measured = measuredResponse(capture(parameters));
  near(measured.gain, -2);
  near(measured.outputStats.vpp, 2);
  near(measured.outputStats.rms, Math.SQRT1_2);
  near(measured.outputStats.acRms, Math.SQRT1_2);
  near(measured.outputStats.mean, 0);
  assert.equal(measured.phase, "inverted");
  assert.equal(measured.error, null);
});

test("B: signed DC inputs and reversed probe polarity give correct DC and AC readings", () => {
  for (const [amplitude, expected] of [
    [1, -2],
    [-0.5, 1],
  ]) {
    const parameters = { waveform: "dc", amplitude };
    near(opamp(parameters).output, expected);
    near(opamp({ ...parameters, time: 2, frequency: 3000 }).output, expected);
    const samples = capture(parameters, 8);
    const measured = measuredResponse(samples);
    near(measured.gain, -2);
    near(measured.outputStats.mean, expected);
    near(measured.outputStats.rms, Math.abs(expected));
    near(measured.outputStats.acRms, 0);
    near(measured.outputStats.vpp, 0);
    assert.equal(measured.phase, "DC");
    const reversed = summarizeSamples(samples.outputs.map((value) => -value));
    near(reversed.mean, -expected);
    near(reversed.acRms, 0);
  }
});

test("C: non-inverting 1 Vpp sine gives +3 gain and 1.06066 Vrms output", () => {
  for (const configuration of ["noninverting", "non-inverting"]) {
    const parameters = { configuration, amplitude: 0.5, rin: 10000, rf: 20000 };
    near(opamp({ ...parameters, time: 0.0025 }).output, 1.5);
    const measured = measuredResponse(capture(parameters));
    near(measured.gain, 3);
    near(measured.outputStats.vpp, 3);
    near(measured.outputStats.rms, 1.0606601717798212);
    assert.equal(measured.phase, "in phase");
  }
});

test("D: equal-input-resistor adder uses both DC sources and their measured sum", () => {
  const parameters = {
    configuration: "adder",
    waveform: "dc",
    amplitude: 0.2,
    amplitude2: 0.3,
    rin: 10000,
    rf: 20000,
  };
  const model = opamp(parameters);
  near(model.input, 0.2);
  near(model.input2, 0.3);
  near(model.referenceInput, 0.5);
  near(model.gain, -2);
  near(model.output, -1);
  near(measuredResponse(capture(parameters, 4)).gain, -2);
  near(opamp({ ...parameters, amplitude2: 0 }).output, -0.4);
  near(opamp({ ...parameters, amplitude2: -0.3 }).output, 0.2);
});

test("E: matched-pair subtractor reverses with source swap and cancels equal inputs", () => {
  const parameters = {
    configuration: "subtractor",
    waveform: "dc",
    amplitude: 0.2,
    amplitude2: 0.7,
    rin: 10000,
    rf: 20000,
  };
  near(opamp(parameters).referenceInput, 0.5);
  near(opamp(parameters).gain, 2);
  near(opamp(parameters).output, 1);
  near(measuredResponse(capture(parameters, 4)).gain, 2);
  near(opamp({ ...parameters, amplitude: 0.7, amplitude2: 0.2 }).output, -1);
  const equal = { ...parameters, amplitude2: 0.2 };
  near(opamp(equal).output, 0);
  near(opamp(equal).peakOutput, 0);
  assert.equal(measuredResponse(capture(equal, 4)).gain, null);
  assert.match(measuredResponse(capture(equal, 4)).error, /zero or too small/);
});

test("two AC sources share the waveform, with signed second-source polarity", () => {
  const parameters = {
    configuration: "adder",
    waveform: "sine",
    amplitude: 0.5,
    amplitude2: -0.25,
    frequency: 1000,
  };
  const adder = opamp({ ...parameters, time: 0.00025 });
  near(adder.input2, -0.25);
  near(adder.referenceInput, 0.25);
  near(adder.output, -0.5);
  near(adder.peakOutput, 0.5);
  near(measuredResponse(capture(parameters)).gain, -2);
  const subtractor = opamp({
    ...parameters,
    configuration: "subtractor",
    time: 0.00025,
  });
  near(subtractor.referenceInput, -0.75);
  near(subtractor.output, -1.5);
  near(subtractor.peakOutput, 1.5);
  near(measuredResponse(capture({ ...parameters, configuration: "subtractor" })).gain, 2);
  const canceled = { ...parameters, amplitude2: -0.5 };
  assert.equal(opamp(canceled).clipped, false);
  near(opamp(canceled).peakOutput, 0);
  assert.equal(measuredResponse(capture(canceled)).gain, null);
});

test("G: changing Rf from 20 kΩ to 30 kΩ updates predicted and sampled response", () => {
  const initial = { amplitude: 0.5, rf: 20000 };
  const changed = { ...initial, rf: 30000 };
  near(opamp(changed).gain, -3);
  near(opamp(changed).peakOutput, 1.5);
  const measured = measuredResponse(capture(changed));
  near(measured.gain, -3);
  near(measured.outputStats.vpp, 3);
  near(measuredResponse(capture(initial)).gain, -2);
});

test("H: large signals clip at every requested rail and recover after reducing input", () => {
  for (const rail of [8, 12, 15]) {
    const parameters = { rin: 5000, rf: 100000, amplitude: 1, rail };
    const model = opamp({ ...parameters, time: 0.0025 });
    near(model.gain, -20);
    near(model.limit, rail - 1);
    near(model.output, -(rail - 1));
    near(model.maxInput, (rail - 1) / 20);
    near(model.peakOutput, rail - 1);
    assert.equal(model.clipped, true);
    assert.equal(model.modelState, "saturated");
    const clipped = measuredResponse(capture(parameters));
    assert.equal(clipped.gain, null);
    assert.match(clipped.error, /clipped/);
    near(clipped.outputStats.vpp, 2 * (rail - 1));
    const recovered = { ...parameters, amplitude: 0.1 };
    assert.equal(opamp(recovered).clipped, false);
    near(measuredResponse(capture(recovered)).gain, -20);
  }
});

test("I: 2 Vpp sine, square and triangle have the expected sample-derived RMS", () => {
  for (const [waveform, expectedRms] of [
    ["sine", Math.SQRT1_2],
    ["square", 1],
    ["triangle", 1 / Math.sqrt(3)],
  ]) {
    const values = Array.from({ length: 65536 }, (_, index) =>
      signalSample({
        waveform,
        amplitude: 1,
        frequency: 1000,
        time: index / 65536 / 1000,
      })
    );
    const stats = summarizeSamples(values);
    near(stats.mean, 0, 4e-5); // A square's exact zero crossing may take the positive value.
    near(stats.rms, expectedRms, 1e-8);
    near(stats.acRms, expectedRms, 1e-8);
    near(stats.peak, 1);
    near(stats.vpp, 2);
    near(signalSample({ waveform, amplitude: 1, frequency: 1000, time: 0.00025 }), 1);
    near(signalSample({ waveform, amplitude: 1, frequency: 1000, time: 0.00075 }), -1);
  }
});

test("RMS separates DC offset from the AC component and uses actual clipped samples", () => {
  const sine = capture({ configuration: "follower", amplitude: 1 }).outputs;
  const offset = summarizeSamples(sine.map((value) => value + 0.25));
  near(offset.mean, 0.25);
  near(offset.acRms, Math.SQRT1_2);
  near(offset.rms, Math.sqrt(0.5 + 0.25 ** 2));
  near(offset.peak, 1.25);
  near(offset.vpp, 2);
  const clipped = summarizeSamples(capture({ amplitude: 6 }).outputs);
  assert.ok(clipped.rms > 11 / Math.sqrt(2), "Clipped sine RMS must come from samples, not clipped peak divided by √2");
  assert.ok(clipped.rms < 11);
  near(clipped.mean, 0);
});

test("measured AC gain is independent of a nonzero capture mean and display scale", () => {
  const inputs = [0.2, 0.4, 0.5, 0.4, 0.2];
  const outputs = [-0.1, -0.5, -0.7, -0.5, -0.1];
  const measured = measuredResponse({ inputs, outputs });
  near(measured.gain, -2);
  assert.equal(measured.phase, "inverted");
  assert.notEqual(measured.outputStats.mean / measured.inputStats.mean, -2);
});

test("J: zero input retains theoretical gain while invalid acquisitions suppress measured gain", () => {
  near(opamp({ amplitude: 0 }).gain, -2);
  for (const parameters of [{ amplitude: 0 }, { amplitude: 1e-12 }, { waveform: "dc", amplitude: 0 }]) {
    const measured = measuredResponse(capture(parameters, 8));
    assert.equal(measured.gain, null);
    assert.match(measured.error, /zero or too small/);
  }
  const good = { inputs: [0, 1, 0, -1], outputs: [0, -2, 0, 2] };
  for (const flags of [{ stale: true }, { valid: false }, { clipped: true }]) {
    const measured = measuredResponse({ ...good, ...flags });
    assert.equal(measured.gain, null);
    assert.equal(measured.phase, "unavailable");
    assert.ok(measured.error);
  }
  for (const samples of [
    { inputs: [], outputs: [] },
    { inputs: [1, 2], outputs: [2, 4] },
    { inputs: [1, 2, 3], outputs: [2, 4] },
    { inputs: [1, NaN, 3], outputs: [2, 4, 6] },
    { inputs: [1, 2, 3], outputs: [2, Infinity, 6] },
  ]) {
    const measured = measuredResponse(samples);
    assert.equal(measured.gain, null);
    assert.match(measured.error, /Insufficient/);
  }
  near(opamp({ powered: false }).output, 0);
  assert.equal(opamp({ powered: false }).modelState, "powered-off");
  const openLoop = opamp({ feedback: false, time: 0.0025 });
  assert.equal(openLoop.modelState, "open-loop");
  assert.equal(openLoop.clipped, true);
  near(openLoop.output, -11);
});

test("sample helpers never return NaN/Infinity, including unavailable captures", () => {
  const missing = { mean: null, rms: null, acRms: null, peak: null, vpp: null };
  for (const values of [undefined, [], [NaN], [Infinity], [1, undefined], [1e308, -1e308]]) {
    assert.deepEqual(summarizeSamples(values), missing);
  }
  assert.deepEqual(summarizeSamples(new Float64Array([0, 0, 0])), {
    mean: 0,
    rms: 0,
    acRms: 0,
    peak: 0,
    vpp: 0,
  });
  near(summarizeSamples([1e308, 1e308]).rms, 1e308);
  assert.equal(measuredResponse().gain, null);
  near(measuredResponse({ inputs: [1], outputs: [-2], dc: true }).gain, -2);
  near(measuredResponse({ inputs: [-1, 0, 1], outputs: [0, 0, 0] }).gain, 0);
  assert.equal(measuredResponse({ inputs: [0, 1, 0, -1], outputs: [1, 0, -1, 0] }).gain, null);
});

test("waveform/model parameters reject invalid values and keep the original API defaults", () => {
  const original = opamp({ time: 0.0025 });
  near(original.input, 1);
  near(original.output, -2);
  near(original.limit, 11);
  near(original.maxInput, 5.5);
  near(opamp({ configuration: "follower", time: 0.0025 }).output, 1);
  for (const parameters of [
    { rin: 0 },
    { rin: -1 },
    { rf: -1 },
    { amplitude: -1 },
    { amplitude2: NaN },
    { waveform: "sawtooth" },
    { frequency: 0 },
    { time: -1 },
    { rail: -1 },
    { headroom: -1 },
    { configuration: "unknown" },
  ]) {
    assert.throws(() => opamp(parameters), RangeError);
  }
  near(opamp({ waveform: "dc", amplitude: -1 }).output, 2);
  near(opamp({ waveform: "dc", amplitude: -1, feedback: false }).output, 11);
});
