import test from "node:test";
import assert from "node:assert/strict";
import { createLab, action, change, parameters, context, measure, scope, setProbe, amplifierReadings, metrics } from "../src/lab.js";
import { amplifierGuide, amplifierTheory } from "../src/amplifier-guide.js";
import { renderSchematic } from "../src/schematic.js";
const near = (a, b, t = 1e-5) => assert.ok(Math.abs(a - b) < t, `${a} != ${b}`);
const start = () => {
  const s = createLab();
  action(s, "module:opamp");
  return s;
};

test("every Lab7 Build path is completed from real connections with separate variants, labels and instruments", () => {
  const s = start();
  action(s, "build");
  for (const configuration of ["inverting", "noninverting", "adder", "subtractor"]) {
    change(s, "configuration", configuration);
    assert.equal(context(s).wires.length, 0);
    const c = context(s);
    assert.equal(c.circuit.components.filter((p) => p.type === "dual-supply").length, 1);
    assert.deepEqual(
      c.circuit.components.find((p) => p.type === "dual-supply").pins.map((p) => p.label),
      ["+V", "GND", "−V"]
    );
    assert.equal(c.circuit.components.filter((p) => p.type === "R").length, configuration === "subtractor" ? 4 : configuration === "adder" ? 3 : 2);
    assert.equal(
      c.circuit.pins.some((p) => p.label === "Vin2"),
      ["adder", "subtractor"].includes(configuration)
    );
    for (const label of ["2 −IN", "3 +IN", "4 −V", "6 Vout", "7 +V"]) assert.ok(c.circuit.pins.some((p) => p.label === label));
    let count = 0;
    while (amplifierGuide(context(s), parameters(s)).action && count++ < 30) action(s, "guided-next");
    assert.ok(count < 30);
    assert.equal(context(s).correct, true);
    assert.equal(scope(s).channels.ch1.correct, true);
    assert.equal(scope(s).channels.ch2.correct, true);
    assert.equal(measure(s).probesCorrect, true);
    assert.equal(amplifierGuide(context(s), parameters(s)).phase, "Understand");
    const svg = renderSchematic("opamp", parameters(s));
    assert.ok(svg.includes("U1–741"));
    assert.doesNotMatch(svg, /undefined|NaN|Infinity/);
  }
  change(s, "configuration", "inverting");
  assert.equal(context(s).correct, true, "Returning to a variant preserves its completed wiring");
});

test("sample-derived gain and voltage semantics agree with A-C and ignore scope scales", () => {
  const s = start();
  change(s, "frequency", 1000);
  action(s, "scope-autoscale");
  change(s, "amplitude", 0.5);
  let r = amplifierReadings(s);
  near(r.gain, -2);
  near(r.output.vpp, 2, 1e-5);
  near(r.output.rms, Math.SQRT1_2);
  near(r.output.mean, 0);
  assert.equal(r.phase, "inverted");
  change(s, "ch2Scale", 0.1);
  near(amplifierReadings(s).gain, -2);
  change(s, "configuration", "noninverting");
  r = amplifierReadings(s);
  near(r.gain, 3);
  near(r.output.vpp, 3);
  near(r.output.rms, 1.5 / Math.sqrt(2));
  change(s, "configuration", "inverting");
  change(s, "waveform", "dc");
  change(s, "amplitude", 1);
  r = amplifierReadings(s);
  near(r.gain, -2);
  near(r.output.mean, -2);
  near(r.output.acRms, 0);
  assert.equal(scope(s).trigger.found, true);
  setProbe(s, "red", "gnd");
  setProbe(s, "black", "out");
  near(amplifierReadings(s).meter.mean, 2);
  change(s, "amplitude", -0.5);
  near(amplifierReadings(s).output.mean, 1);
  change(s, "waveform", "sine");
  near(parameters(s).amplitude, 0.5);
});

test("adder and matched subtractor compute actual node voltages and differential response", () => {
  const s = start();
  change(s, "waveform", "dc");
  change(s, "configuration", "adder");
  change(s, "amplitude", 0.2);
  change(s, "amplitude2", 0.3);
  near(measure(s).voltage, -1);
  near(amplifierReadings(s).gain, -2);
  near(measure(s).voltages["op-"], 0);
  change(s, "amplitude2", 0);
  near(measure(s).voltage, -0.4);
  change(s, "configuration", "subtractor");
  change(s, "amplitude2", 0.7);
  near(measure(s).voltage, 1);
  near(amplifierReadings(s).gain, 2);
  near(measure(s).voltages["op+"], (0.7 * 2) / 3);
  near(measure(s).voltages["op-"], (0.7 * 2) / 3);
  change(s, "amplitude", 0.7);
  change(s, "amplitude2", 0.2);
  near(measure(s).voltage, -1);
  change(s, "amplitude2", 0.7);
  near(measure(s).voltage, 0);
  assert.equal(amplifierReadings(s).gain, null);
});

test("gain edits are undoable and invalid entries retain the last accepted circuit", () => {
  const s = start();
  change(s, "rf", 30000);
  near(amplifierReadings(s).gain, -3);
  action(s, "undo");
  near(parameters(s).rf, 20000);
  near(amplifierReadings(s).gain, -2);
  for (const [name, value] of [
    ["rin", 0],
    ["rf", -1],
    ["rail", 9],
    ["waveform", "noise"],
    ["configuration", "unknown"],
    ["amplitude2", NaN],
  ])
    assert.equal(change(s, name, value), false);
  near(amplifierReadings(s).gain, -2);
});

test("clipping, missing rails/feedback, meter COM, zero reference and Hold never give a valid linear gain", () => {
  const s = start();
  change(s, "rin", 5000);
  change(s, "rf", 100000);
  change(s, "amplitude", 1);
  for (const rail of [8, 12, 15]) {
    change(s, "rail", rail);
    const m = measure(s);
    assert.equal(m.clipped, true);
    near(m.peak, rail - 1);
    assert.equal(amplifierReadings(s).gain, null);
  }
  change(s, "amplitude", 0.1);
  near(amplifierReadings(s).gain, -20);
  action(s, "scope-toggle");
  change(s, "rf", 50000);
  assert.equal(amplifierReadings(s).gain, null);
  action(s, "scope-toggle");
  near(amplifierReadings(s).gain, -10);
  change(s, "amplitude", 0);
  assert.equal(amplifierReadings(s).gain, null);
  assert.ok(metrics(s).some((r) => r.label === "Theoretical gain" && r.value === "-10"));
  change(s, "amplitude", 0.1);
  setProbe(s, "black", null);
  assert.equal(amplifierReadings(s).meter.mean, null);
  for (const pair of [
    ["plus+", "vp"],
    ["minus-", "vn"],
    ["rfa", "op-"],
  ]) {
    const c = context(s),
      i = c.wires.findIndex(([a, b]) => [a, b].includes(pair[0]) && [a, b].includes(pair[1]));
    action(s, "tool:remove");
    action(s, `remove-wire:${i}`);
    assert.equal(measure(s).ok, false);
    assert.equal(amplifierReadings(s).gain, null);
    action(s, "undo");
    assert.equal(measure(s).ok, true);
  }
  action(s, "reset-experiment");
  near(parameters(s).rf, 20000);
  assert.equal(parameters(s).waveform, "sine");
  near(amplifierReadings(s).gain, -2);
});
