import test from "node:test";
import assert from "node:assert/strict";
import { MODULES, OPTIONS, circuitFor, correctTopology } from "../src/modules.js";
import {
  createLab,
  chooseModule,
  parameters,
  context,
  setMode,
  measure,
  change,
  terminal,
  action,
  capture,
  assess,
  plot,
  scope as readScope,
  vrActions,
} from "../src/lab.js";

const near = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Number.isFinite(actual), `Expected a finite measurement, received ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);
};

function lab(module, mode = "explore") {
  const state = createLab();
  chooseModule(state, module);
  if (mode !== "explore") setMode(state, mode);
  return state;
}

// Exercise the same terminal/tool operations available on the desktop and in VR.
function wireReference(state, transform = (wires) => wires) {
  action(state, "clear");
  action(state, "tool:wire");
  const circuit = context(state).circuit;
  for (const [a, b] of transform(circuit.wires.map((wire) => [...wire]))) {
    terminal(state, a);
    terminal(state, b);
  }
  action(state, "tool:red");
  terminal(state, circuit.positive);
  action(state, "tool:black");
  terminal(state, circuit.negative);
  if (state.module === "opamp") {
    for (const [color, pin] of [["ch1", "signal+"], ["ch1Ground", "gnd"], ["ch2", "out"], ["ch2Ground", "gnd"]]) {
      action(state, `probe:${color}:${pin}`);
    }
  }
  return measure(state);
}

function record(state) {
  assert.equal(capture(state), true, state.feedback);
  assert.equal(state.records[0].measurement.probesCorrect, true);
}

function complete(state) {
  const checks = assess(state);
  assert.ok(checks.length > 0);
  assert.ok(
    checks.every((check) => check.pass),
    JSON.stringify(checks, null, 2)
  );
}

test("all four connected reference benches produce the physically expected initial readings", () => {
  const equivalent = measure(lab("thevenin"));
  assert.equal(equivalent.correct, true);
  near(equivalent.voltage, 3);
  near(equivalent.current, 0.006);
  near(equivalent.power, 0.018);
  const sources = measure(lab("superposition"));
  near(sources.voltage, 1);
  near(sources.current, 0.001);
  const amplifier = measure(lab("opamp"));
  near(amplifier.gain, -2);
  near(amplifier.voltage, -2);
  near(amplifier.probeVoltage, -2);
  assert.equal(amplifier.clipped, false);
  const storage = measure(lab("transient"));
  near(storage.voltage, 0);
  near(storage.current, 0.005);
  near(storage.energy, 0);
  near(storage.tau, 0.1);
  for (const id of Object.keys(MODULES)) {
    const measurement = measure(lab(id));
    assert.equal(measurement.ok, true, `${id}: ${measurement.error}`);
    assert.equal(measurement.probesCorrect, true, id);
  }
});

test("all three equivalent representations give identical measurements at three loads", () => {
  const state = lab("thevenin");
  for (const representation of ["original", "thevenin", "norton"]) {
    change(state, "representation", representation);
    for (const [load, voltage, current, power] of [
      [250, 2, 0.008, 0.016],
      [500, 3, 0.006, 0.018],
      [1000, 4, 0.004, 0.016],
    ]) {
      change(state, "load", load);
      const m = measure(state);
      assert.equal(m.ok, true, m.error);
      near(m.voltage, voltage);
      near(m.current, current);
      near(m.power, power);
    }
  }
});

test("incorrect equivalent values alter actual measurements rather than snapping to the answer", () => {
  const state = lab("thevenin");
  change(state, "representation", "thevenin");
  change(state, "equivalentVoltage", 4);
  near(measure(state).voltage, 2);
  change(state, "representation", "norton");
  change(state, "nortonCurrent", 8);
  near(measure(state).voltage, 2);
  change(state, "equivalentResistance", 1000);
  near(measure(state).voltage, 8 / 3);
});

test("open-source and shorted-source wiring have distinct, honest consequences", () => {
  const state = lab("thevenin");
  let m = wireReference(state, (wires) => wires.filter(([a, b]) => !(a === "s+" && b === "r1a")));
  assert.equal(m.ok, true, m.error);
  assert.equal(m.correct, false);
  near(m.voltage, 0);
  near(m.current, 0);
  m = wireReference(state, (wires) => [...wires, ["s+", "s-"]]);
  assert.equal(m.ok, false);
  assert.match(m.error, /Inconsistent/);
  assert.equal(m.probeReady, false);
  assert.equal(capture(state), false);
  assert.equal(state.records.length, 0);
});

test("reversing Norton source connections reverses voltage/current while resistor power remains positive", () => {
  const state = lab("thevenin");
  change(state, "representation", "norton");
  const reverse = (pin) => (pin === "s+" ? "s-" : pin === "s-" ? "s+" : pin);
  const m = wireReference(state, (wires) => wires.map((wire) => wire.map(reverse)));
  assert.equal(m.ok, true, m.error);
  assert.equal(m.correct, false);
  near(m.voltage, -3);
  near(m.current, -0.006);
  near(m.power, 0.018);
});

test("the voltmeter reads red minus black, including wrong locations and reversed probes", () => {
  const state = lab("thevenin");
  action(state, "tool:red");
  terminal(state, "s+");
  near(measure(state).probeVoltage, 12);
  assert.equal(measure(state).probesCorrect, false);
  assert.equal(capture(state), true);
  assert.match(state.feedback, /not across the requested output/);
  action(state, "tool:red");
  terminal(state, "gnd");
  action(state, "tool:black");
  terminal(state, "loada");
  near(measure(state).probeVoltage, -3);
  near(measure(state).voltage, 3);
  assert.equal(measure(state).probesCorrect, false);
  action(state, "tool:red");
  terminal(state, "loada");
  action(state, "tool:black");
  terminal(state, "loadb");
  assert.equal(measure(state).probesCorrect, true);
});

test("topology validation accepts electrically identical lead arrangements and rejects unintended joins", () => {
  const state = lab("thevenin");
  const circuit = context(state).circuit;
  const equivalent = circuit.wires.map(([a, b]) => (a === "r2a" && b === "loada" ? ["r1b", "loada"] : [b, a]));
  assert.equal(correctTopology(circuit, equivalent), true);
  assert.equal(correctTopology(circuit, [...equivalent, ["r1a", "r1b"]]), false);
});

test("superposition deactivation uses shorts, retains signs, and does not add powers", () => {
  const state = lab("superposition");
  const both = measure(state);
  change(state, "sourceMode", "a");
  const a = measure(state);
  change(state, "sourceMode", "b");
  const b = measure(state);
  near(a.current, 0.002);
  near(b.current, -0.001);
  near(both.current, a.current + b.current);
  near(both.power, 0.001);
  near(a.power + b.power, 0.005);
  change(state, "sourceMode", "a");
  change(state, "replacement", "open");
  const incorrectlyOpened = measure(state);
  assert.equal(incorrectlyOpened.ok, true, incorrectlyOpened.error);
  near(incorrectlyOpened.current, 0.003);
  assert.notEqual(incorrectlyOpened.current, a.current);
});

test("cancellation leaves current flowing elsewhere in the source network", () => {
  const state = lab("superposition");
  change(state, "v2", 6);
  const m = measure(state);
  near(m.current, 0);
  near(Math.abs(m.currents.r1), 0.006);
  near(Math.abs(m.currents.r2), 0.006);
  change(state, "v2", 9);
  assert.ok(measure(state).current < 0);
});

test("missing op-amp feedback/supply wiring yields no invented waveform measurements", () => {
  const state = lab("opamp", "challenge");
  let m = wireReference(state, (wires) => wires.filter(([a, b]) => !(a === "rfb" && b === "out")));
  assert.equal(m.ok, false);
  assert.equal(m.probeReady, false);
  assert.match(m.error, /feedback.*suppl/);
  assert.equal(capture(state), false);
  m = wireReference(state, (wires) => wires.filter(([a]) => a !== "plus+"));
  assert.equal(m.ok, false);
  m = wireReference(state);
  assert.equal(m.ok, true, m.error);
  change(state, "configuration", "noninverting");
  m = wireReference(state);
  near(m.gain, 3);
  near(m.voltage, 3);
});

test("adjusting amplifier supply rails changes clipping limits without changing nominal gain", () => {
  const state = lab("opamp");
  change(state, "rf", 30000);
  change(state, "amplitude", 3);
  for (const [rail, output, clipped] of [
    [12, -9, false],
    [9, -8, true],
    [5, -4, true],
    [15, -9, false],
  ]) {
    action(state, `set:rail:${rail}`);
    const m = measure(state);
    near(m.gain, -3);
    near(m.voltage, output);
    near(m.peak, Math.abs(output));
    near(m.maxInput, (rail - 1) / 3);
    assert.equal(m.clipped, clipped);
    assert.deepEqual(readScope(state).limits, [1 - rail, rail - 1]);
  }
});

test("frequency changes preserve ideal amplifier gain and correctly timed acquired samples", () => {
  const state = lab("opamp");
  for (const frequency of [10, 50, 100, 500, 1000]) {
    action(state, `set:frequency:${frequency}`);
    const period = 1 / frequency;
    const m = measure(state);
    near(m.input, 1);
    near(m.voltage, -2);
    near(measure(state, 0).voltage, 0);
    near(measure(state, period / 4).voltage, -2);
    near(measure(state, period / 2).voltage, 0);
    near(measure(state, (3 * period) / 4).voltage, 2);
    near(measure(state, period).voltage, 0);
    action(state, "scope-autoscale");
    assert.ok(OPTIONS.timeDiv.includes(parameters(state).timeDiv), "Autoscale must select a time/div value the UI can display.");
    const acquisition = readScope(state);
    assert.equal(acquisition.correct, true);
    assert.ok(acquisition.duration >= period);
    const input = acquisition.channels.ch1.points;
    const output = acquisition.channels.ch2.points;
    near(input.at(-1)[0], acquisition.duration * 1000);
    for (let index = 0; index < input.length; index += 1) {
      near(input[index][0], output[index][0]);
      near(input[index][1], Math.sin(2 * Math.PI * frequency * (input[index][0] / 1000 + acquisition.trigger.time)));
      near(output[index][1], -2 * input[index][1]);
    }
  }
});

test("supply terminals and voltage probes reflect adjusted positive and negative rails", () => {
  const state = lab("opamp");
  for (const rail of [5, 9, 12, 15]) {
    action(state, `set:rail:${rail}`);
    let m = measure(state);
    for (const terminalName of ["vp", "plus+"]) near(m.voltages[terminalName], rail);
    for (const terminalName of ["vn", "minus-"]) near(m.voltages[terminalName], -rail);
    for (const terminalName of ["plus-", "minus+"]) near(m.voltages[terminalName], 0);
    action(state, "tool:red");
    terminal(state, "vp");
    action(state, "tool:black");
    terminal(state, "vn");
    near(measure(state).probeVoltage, 2 * rail);
    assert.equal(measure(state).probesCorrect, false);
    action(state, "tool:red");
    terminal(state, "vn");
    action(state, "tool:black");
    terminal(state, "gnd");
    near(measure(state).probeVoltage, -rail);
  }
});

test("resistance changes preserve capacitor voltage and inductor current at the switching instant", () => {
  for (const [kind, initialR, nextR] of [
    ["RC", 1000, 500],
    ["RL", 100, 200],
  ]) {
    const state = lab("transient");
    change(state, "kind", kind);
    change(state, "resistance", initialR);
    action(state, "one-tau");
    const before = measure(state);
    change(state, "resistance", nextR);
    const after = measure(state);
    near(parameters(state).time, 0);
    near(after.storageValue, before.storageValue);
    near(after.energy, before.energy);
    near(after.tau, before.tau / 2);
    if (kind === "RC") {
      near(after.voltage, before.voltage);
      near(after.current, before.current * 2);
    } else {
      near(after.current, before.current);
      near(after.voltage, 5 - nextR * after.current);
    }
  }
});

test("charge/return switching preserves stored state and has a closed decay path", () => {
  for (const kind of ["RC", "RL"]) {
    const state = lab("transient");
    change(state, "kind", kind);
    action(state, "one-tau");
    const charged = measure(state);
    action(state, "switch");
    const start = measure(state);
    assert.equal(parameters(state).charging, false);
    near(start.storageValue, charged.storageValue);
    near(start.energy, charged.energy);
    assert.ok(kind === "RC" ? start.current < 0 : start.voltage < 0);
    action(state, "one-tau");
    const decayed = measure(state);
    near(decayed.storageValue, charged.storageValue / Math.E);
    assert.ok(decayed.energy < charged.energy);
    action(state, "switch");
    near(measure(state).storageValue, decayed.storageValue);
  }
});

test("Thévenin challenge can be completed using terminal, probe, setting and record operations", () => {
  const state = lab("thevenin", "challenge");
  // Students must supply the calculated equivalent parameters; challenge defaults are deliberately wrong.
  action(state, "set:equivalentVoltage:6");
  action(state, "set:equivalentResistance:500");
  action(state, "set:nortonCurrent:12");
  for (const representation of ["original", "thevenin", "norton"]) {
    action(state, `set:representation:${representation}`);
    assert.equal(wireReference(state).correct, true);
    for (const load of [250, 500, 1000]) {
      action(state, `set:load:${load}`);
      record(state);
    }
  }
  action(state, "set:load:500");
  complete(state);
  assert.equal(state.records.length, 9);
});

test("superposition challenge can be completed with baseline states and nonzero-source cancellation", () => {
  const state = lab("superposition", "challenge");
  wireReference(state);
  for (const sourceMode of ["both", "a", "b"]) {
    action(state, `set:sourceMode:${sourceMode}`);
    record(state);
  }
  action(state, "set:sumMilliamp:1");
  action(state, "submit-sum");
  action(state, "set:sourceMode:both");
  action(state, "set:v2:6");
  for (const sourceMode of ["a", "b", "both"]) {
    action(state, `set:sourceMode:${sourceMode}`);
    record(state);
  }
  action(state, "set:explanation:opposing");
  complete(state);
});

test("op-amp challenge can be completed at gain -3 with clean/clipped records and a reachable prediction", () => {
  const state = lab("opamp", "challenge");
  wireReference(state);
  action(state, "cycle:rf"); // 20 kΩ → 30 kΩ; gain becomes −3.
  near(measure(state).gain, -3);
  record(state);
  action(state, "set:amplitude:4");
  assert.equal(measure(state).clipped, true);
  record(state);
  action(state, "set:prediction:3.7");
  complete(state);
});

test("amplifier challenge rejects clean/clipped records taken at a different rail or frequency", () => {
  for (const [name, value] of [
    ["rail", 9],
    ["frequency", 500],
  ]) {
    const state = lab("opamp", "challenge");
    wireReference(state);
    action(state, "set:rf:30000");
    action(state, "set:prediction:3.7");
    action(state, `set:${name}:${value}`);
    action(state, "set:amplitude:1");
    assert.equal(measure(state).clipped, false);
    record(state);
    action(state, "set:amplitude:4");
    assert.equal(measure(state).clipped, true);
    record(state);
    action(state, "set:rail:12");
    action(state, "set:frequency:100");
    const checks = assess(state);
    assert.equal(checks[0].pass, true, "Current wiring and target settings should be valid.");
    assert.equal(checks[1].pass, false, `${name}: wrong-setting clean record must not count.`);
    assert.equal(checks[2].pass, false, `${name}: wrong-setting clipped record must not count.`);
    assert.equal(checks[3].pass, true);
    action(state, "set:amplitude:1");
    record(state);
    action(state, "set:amplitude:4");
    record(state);
    complete(state);
  }
});

test("transient challenge can be completed for both R trends, with fresh initial energy for each comparison", () => {
  const state = lab("transient", "challenge");
  for (const [kind, fasterR] of [
    ["RC", 500],
    ["RL", 200],
  ]) {
    action(state, `set:kind:${kind}`);
    wireReference(state);
    action(state, `set:predictionChoice:${kind === "RC" ? "slower" : "faster"}`);
    action(state, "lock-prediction");
    action(state, "one-tau");
    record(state);
    action(state, `set:resistance:${fasterR}`);
    action(state, "reset-energy");
    action(state, "one-tau");
    record(state);
  }
  complete(state);
});

test("challenge records require student wiring/probes and earlier attempts do not satisfy a new attempt", () => {
  const state = lab("superposition", "challenge");
  assert.equal(measure(state).ok, false);
  assert.equal(capture(state), false);
  action(state, "restore");
  assert.equal(context(state).wires.length, 0);
  wireReference(state);
  record(state);
  assert.equal(assess(state)[0].pass, true);
  action(state, "reset-attempt");
  assert.equal(state.records.length, 1);
  assert.equal(context(state).wires.length, 0);
  assert.equal(
    assess(state).some((check) => check.pass),
    false
  );
});

const challengeDefaults = (module) => ({
  ...MODULES[module].defaults,
  ...(module === "thevenin" ? { equivalentVoltage: 4, equivalentResistance: 750, nortonCurrent: 8 } : {}),
});

const changedSettings = {
  thevenin: { representation: "norton", load: 2000, equivalentVoltage: 12, equivalentResistance: 1000, nortonCurrent: 20 },
  superposition: { v1: 12, v2: 9, sourceMode: "a", replacement: "open" },
  opamp: { configuration: "noninverting", rf: 100000, amplitude: 6, rail: 15, frequency: 500, prediction: 9 },
  transient: { kind: "RL", resistance: 10000, initial: 0.05, time: 0.01, charging: false, playing: true },
};

test("first challenge entry resets exploration settings and starts with an unbuilt circuit", () => {
  for (const module of Object.keys(MODULES)) {
    const state = lab(module);
    for (const [name, value] of Object.entries(changedSettings[module])) change(state, name, value);
    assert.notDeepEqual(parameters(state), challengeDefaults(module));
    setMode(state, "challenge");
    assert.deepEqual(parameters(state), challengeDefaults(module), module);
    assert.equal(state.challengeStarted[module], true);
    assert.equal(context(state).wires.length, 0);
    assert.deepEqual(context(state).probes, { red: null, black: null });
    assert.equal(measure(state).ok, false);
  }
});

test("re-entering modes and revisiting an existing challenge preserve its settings, construction and notebook", () => {
  const state = lab("thevenin", "challenge");
  action(state, "set:equivalentVoltage:6");
  action(state, "set:equivalentResistance:500");
  action(state, "set:nortonCurrent:12");
  action(state, "set:representation:thevenin");
  action(state, "set:load:250");
  wireReference(state);
  record(state);
  const saved = {
    params: structuredClone(parameters(state)),
    wires: structuredClone(context(state).wires),
    probes: structuredClone(context(state).probes),
    records: structuredClone(state.records),
  };
  setMode(state, "challenge");
  setMode(state, "explore");
  chooseModule(state, "opamp");
  setMode(state, "challenge");
  chooseModule(state, "thevenin");
  setMode(state, "explore");
  setMode(state, "challenge");
  assert.deepEqual(parameters(state), saved.params);
  assert.deepEqual(context(state).wires, saved.wires);
  assert.deepEqual(context(state).probes, saved.probes);
  assert.deepEqual(state.records, saved.records);
  assert.equal(context(state).correct, true);
  near(measure(state).voltage, 2);
  assert.equal(state.attempts.thevenin, 0);
});

test("resetting a challenge attempt resets its parameters and construction while retaining immutable earlier records", () => {
  for (const module of Object.keys(MODULES)) {
    const state = lab(module, "challenge");
    wireReference(state);
    record(state);
    const previousRecords = structuredClone(state.records);
    for (const [name, value] of Object.entries(changedSettings[module])) change(state, name, value);
    action(state, "reset-attempt");
    assert.deepEqual(parameters(state), challengeDefaults(module), module);
    assert.equal(state.attempts[module], 1);
    assert.equal(state.challengeStarted[module], true);
    assert.equal(context(state).wires.length, 0);
    assert.deepEqual(context(state).probes, { red: null, black: null });
    assert.deepEqual(state.records, previousRecords);
    assert.equal(state.records[0].attempt, 0);
    assert.equal(
      assess(state).some((check) => check.pass),
      false
    );
  }
});

test("graphs remain finite and valid for every displayed circuit and source-selection state", () => {
  const cases = [
    ["thevenin", "representation", ["original", "thevenin", "norton"]],
    ["superposition", "sourceMode", ["both", "a", "b"]],
    ["opamp", "configuration", ["inverting", "noninverting"]],
    ["transient", "kind", ["RC", "RL"]],
  ];
  for (const [module, name, variants] of cases) {
    const state = lab(module);
    for (const value of variants) {
      change(state, name, value);
      const chart = plot(state);
      assert.ok(chart.title);
      for (const series of chart.series ?? []) {
        assert.ok(series.points.length > 1);
        assert.ok(
          series.points.every((point) => point.every(Number.isFinite)),
          `${module}/${value}`
        );
      }
      for (const bar of chart.bars ?? []) {
        if (bar.missing) assert.equal(bar.value, null);
        else assert.ok(Number.isFinite(bar.value));
      }
      if (chart.marker) assert.ok(Object.values(chart.marker).every(Number.isFinite));
    }
  }
});

test("superposition chart shows live signed contributions without recording readings", () => {
  const state = lab("superposition");
  for (const mode of ["both", "a", "b"]) {
    change(state, "sourceMode", mode);
    assert.deepEqual(plot(state).bars.map((bar) => bar.value), [2, -1, 1]);
  }
  change(state, "v2", 6);
  assert.deepEqual(plot(state).bars.map((bar) => bar.value), [2, -2, 0]);
  assert.equal(state.records.length, 0);
});

test("graph and VR action derivation do not change an initialized lab state", () => {
  for (const id of Object.keys(MODULES)) {
    const state = lab(id);
    context(state);
    const before = structuredClone(state);
    plot(state);
    const controls = vrActions(state);
    assert.deepEqual(state, before, id);
    assert.equal(new Set(controls.map((control) => control.id)).size, controls.length);
    for (const required of ["build", "reset-circuit", "check-wiring", "tool:wire", "tool:red", "tool:black"]) {
      assert.ok(
        controls.some((control) => control.id === required),
        `${id}: ${required}`
      );
    }
  }
});

test("every generated VR action dispatches without breaking subsequent measurements or graphs", () => {
  for (const module of Object.keys(MODULES)) {
    const seed = lab(module);
    for (const control of vrActions(seed)) {
      const state = lab(module);
      action(state, control.id);
      assert.doesNotThrow(() => measure(state), `${module}: ${control.id}`);
      assert.doesNotThrow(() => plot(state), `${module}: ${control.id}`);
    }
  }
});

test("reference graphs agree with measured power, sine peaks and one-time-constant response", () => {
  const equivalent = lab("thevenin");
  const power = plot(equivalent);
  const atMatch = power.series[0].points.find(([load]) => load === 500);
  near(atMatch[1], 18);
  near(power.marker.y, measure(equivalent).power * 1000);
  const amplifier = lab("opamp");
  const acquisition = readScope(amplifier);
  near(Math.max(...acquisition.channels.ch1.points.map(([, v]) => v)), 1);
  near(Math.max(...acquisition.channels.ch2.points.map(([, v]) => v)), 2);
  const storage = lab("transient");
  action(storage, "one-tau");
  const response = plot(storage);
  const voltagePanel = response.panels.find((panel) => panel.id === "voltage");
  near(voltagePanel.marker.x, 100);
  near(voltagePanel.marker.y, 5 * (1 - Math.exp(-1)));
  near(response.xMax, 500);
});
