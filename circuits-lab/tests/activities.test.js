import test from "node:test";
import assert from "node:assert/strict";
import {
  createLab,
  chooseModule,
  setMode,
  parameters,
  context,
  action,
  terminal,
  capture,
  measure,
  assess,
  plot,
  activity,
  scope,
  advanceTransient,
  removeWire,
  vrActions,
} from "../src/lab.js";

const near = (actual, expected, tolerance = 1e-8) => {
  assert.ok(Number.isFinite(actual), `Expected a finite value, received ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);
};

function lab(module, mode = "challenge") {
  const state = createLab();
  chooseModule(state, module);
  setMode(state, mode);
  return state;
}

function wire(state) {
  action(state, "clear");
  action(state, "tool:wire");
  const circuit = context(state).circuit;
  for (const [a, b] of circuit.wires) {
    terminal(state, a);
    terminal(state, b);
  }
  action(state, "probe:red:" + circuit.positive);
  action(state, "probe:black:" + circuit.negative);
  assert.equal(measure(state).correct, true);
}

function connectScope(state) {
  for (const [color, pin] of [
    ["ch1", "signal+"],
    ["ch1Ground", "gnd"],
    ["ch2", "out"],
    ["ch2Ground", "gnd"],
  ]) {
    action(state, `probe:${color}:${pin}`);
  }
}

function record(state) {
  assert.equal(capture(state), true, state.feedback);
  return state.records[0];
}

function sourceCases(state) {
  for (const mode of ["a", "b", "both"]) {
    action(state, `set:sourceMode:${mode}`);
    record(state);
  }
}

test("legacy signed-current answer starts at zero and is absent from experiment controls", () => {
  for (const [id, expected, reverse] of [
    ["cycle:sumMilliamp", 0.1, "cycle:sumMilliamp:-1"],
    ["cycle:sumMilliamp:-1", -0.1, "cycle:sumMilliamp"],
  ]) {
    const state = lab("superposition");
    assert.equal(parameters(state).sumMilliamp, null);
    assert.ok(!vrActions(state).some((control) => control.id === id));
    action(state, id);
    assert.equal(typeof parameters(state).sumMilliamp, "number");
    near(parameters(state).sumMilliamp, expected);
    action(state, reverse);
    near(parameters(state).sumMilliamp, 0);
    assert.equal(activity(state).sumSubmitted, false, "Adjusting an answer is separate from submitting measured evidence.");
  }
});

test("legacy answer APIs remain compatible but are not offered as experiment controls", () => {
  const state = lab("superposition");
  wire(state);
  sourceCases(state);
  for (const id of ["adjust:sumMilliamp:1", "adjust:sumMilliamp:-1"]) {
    assert.ok(
      !vrActions(state).some((control) => control.id === id),
      `${id} must not be offered on the VR panel.`
    );
  }
  action(state, "adjust:sumMilliamp:1");
  near(parameters(state).sumMilliamp, 1);
  action(state, "submit-sum");
  assert.equal(activity(state).submission.passed, true);
  action(state, "adjust:sumMilliamp:-1");
  near(parameters(state).sumMilliamp, 0);
  action(state, "adjust:sumMilliamp:-1");
  near(parameters(state).sumMilliamp, -1);
  chooseModule(state, "opamp");
  for (const id of ["adjust:prediction:1", "adjust:prediction:-1"]) {
    assert.ok(
      !vrActions(state).some((control) => control.id === id),
      `${id} must not be offered on the VR panel.`
    );
  }
  for (let i = 0; i < 4; i++) action(state, "adjust:prediction:1");
  for (let i = 0; i < 3; i++) action(state, "cycle:prediction:-1");
  near(parameters(state).prediction, 3.7);
  assert.equal(assess(state).find((check) => /Predicted the maximum input/.test(check.label)).pass, true);
});

test("VR numeric controls clamp at bounds and step between typed values without wrapping", () => {
  for (const [module, name, low, high] of [
    ["superposition", "sumMilliamp", -8, 8],
    ["opamp", "prediction", 0, 10],
    ["opamp", "amplitude", 0.25, 6],
    ["opamp", "rail", 5, 15],
    ["opamp", "timeDiv", 0.02, 50],
  ]) {
    const state = lab(module);
    action(state, `set:${name}:${low}`);
    action(state, `cycle:${name}:-1`);
    near(parameters(state)[name], low);
    action(state, `set:${name}:${high}`);
    action(state, `cycle:${name}`);
    near(parameters(state)[name], high);
    if (["sumMilliamp", "prediction"].includes(name)) {
      action(state, `adjust:${name}:1`);
      near(parameters(state)[name], high);
      action(state, `set:${name}:${low}`);
      action(state, `adjust:${name}:-1`);
      near(parameters(state)[name], low);
    }
  }
  const state = lab("opamp");
  for (const [name, typed, next, previous] of [
    ["amplitude", 3.65, 3.7, 3.6],
    ["rail", 7, 9, 5],
  ]) {
    action(state, `set:${name}:${typed}`);
    action(state, `cycle:${name}`);
    near(parameters(state)[name], next);
    action(state, `set:${name}:${typed}`);
    action(state, `cycle:${name}:-1`);
    near(parameters(state)[name], previous);
  }
});

test("coarse answer adjustments reject invalid fields and nonnumeric deltas without changing parameters", () => {
  for (const module of ["superposition", "opamp", "transient"]) {
    const state = lab(module);
    const before = structuredClone(parameters(state));
    const wrongField = module === "superposition" ? "prediction" : "sumMilliamp";
    for (const id of [`adjust:${wrongField}:1`, "adjust:rail:1", "adjust:sumMilliamp:NaN", "adjust:prediction:Infinity"]) {
      action(state, id);
      assert.deepEqual(parameters(state), before, id);
    }
  }
});

test("superposition submission uses three matching measured cases and signed milliamps", () => {
  const state = lab("superposition");
  wire(state);
  sourceCases(state);
  const measured = activity(state).recorded;
  near(measured.a.current, 0.002);
  near(measured.b.current, -0.001);
  near(measured.both.current, 0.001);
  action(state, "set:sumMilliamp:3");
  action(state, "submit-sum");
  assert.equal(activity(state).submission.passed, false, "Adding magnitudes must not pass a signed sum.");
  action(state, "set:sumMilliamp:1");
  action(state, "submit-sum");
  assert.equal(activity(state).sumSubmitted, true);
  assert.equal(activity(state).submission.passed, true);
});

test("superposition cannot mix measurements from different source settings or attempts", () => {
  const state = lab("superposition");
  wire(state);
  sourceCases(state);
  action(state, "set:v2:6");
  action(state, "set:sumMilliamp:0");
  action(state, "submit-sum");
  assert.equal(activity(state).sumSubmitted, false);
  assert.deepEqual(Object.values(activity(state).recorded), [null, null, null]);
  sourceCases(state);
  action(state, "submit-sum");
  assert.equal(activity(state).sumSubmitted, true);
  action(state, "reset-attempt");
  assert.deepEqual(Object.values(activity(state).recorded), [null, null, null]);
  assert.equal(activity(state).sumSubmitted, false);
});

test("incorrectly opened voltage sources never qualify as superposition contribution evidence", () => {
  const state = lab("superposition");
  wire(state);
  action(state, "set:sourceMode:a");
  action(state, "set:replacement:open");
  near(measure(state).current, 0.003);
  record(state);
  assert.equal(activity(state).recorded.a, null);
});

test("the inactive-source selector has no effect on a both-active superposition measurement", () => {
  const state = lab("superposition");
  wire(state);
  for (const mode of ["a", "b"]) {
    action(state, `set:sourceMode:${mode}`);
    record(state);
  }
  action(state, "set:sourceMode:both");
  action(state, "set:replacement:open");
  near(measure(state).current, 0.001);
  record(state);
  assert.ok(activity(state).recorded.both);
  action(state, "set:sumMilliamp:1");
  action(state, "submit-sum");
  assert.equal(activity(state).submission.passed, true);
});

test("explaining cancellation requires matching opposing measurements, not merely a zero branch reading", () => {
  const state = lab("superposition");
  wire(state);
  sourceCases(state);
  action(state, "set:sumMilliamp:1");
  action(state, "submit-sum");
  action(state, "set:v2:6");
  action(state, "set:sourceMode:both");
  record(state);
  action(state, "set:explanation:opposing");
  assert.equal(
    assess(state).every((check) => check.pass),
    false,
    "A bare zero reading does not prove its cause."
  );
  sourceCases(state);
  for (const wrong of ["sources-off", "whole-circuit-zero"]) {
    action(state, `set:explanation:${wrong}`);
    assert.equal(
      assess(state).every((check) => check.pass),
      false
    );
  }
  action(state, "set:explanation:opposing");
  assert.equal(
    assess(state).every((check) => check.pass),
    true
  );
});

test("RC and RL predictions are locked before trials and use opposite trends for increasing resistance", () => {
  for (const [kind, choice] of [
    ["RC", "slower"],
    ["RL", "faster"],
  ]) {
    const state = lab("transient");
    action(state, `set:kind:${kind}`);
    wire(state);
    action(state, `set:predictionChoice:${choice}`);
    action(state, "lock-prediction");
    assert.equal(activity(state).prediction.locked, true);
    assert.equal(activity(state).prediction.late, false);
    assert.equal(activity(state).prediction.correct, true);
    action(state, "set:predictionChoice:same");
    assert.equal(activity(state).prediction.choice, choice, "A locked prediction cannot be edited after seeing results.");
    action(state, "one-tau");
    record(state);
    assert.equal(activity(state).prediction.late, false);
  }
});

test("late transient predictions cannot retroactively validate a completed or changed trial", () => {
  for (const trial of ["one-tau", "five-tau", "play", "replay", "switch", "set:time:0.01", "set:resistance:500"]) {
    const state = lab("transient");
    wire(state);
    action(state, trial);
    action(state, "set:predictionChoice:slower");
    action(state, "lock-prediction");
    assert.equal(activity(state).prediction.late, true, trial);
    assert.equal(activity(state).prediction.correct, false, `${trial}: late correct words are not an advance prediction.`);
  }
});

test("new-run energy reset is allowed before predicting, and exploration cannot invalidate a fresh challenge", () => {
  const state = lab("transient", "explore");
  action(state, "one-tau");
  setMode(state, "challenge");
  wire(state);
  action(state, "reset-energy");
  action(state, "set:predictionChoice:slower");
  action(state, "lock-prediction");
  assert.equal(activity(state).prediction.late, false);
  assert.equal(activity(state).prediction.correct, true);
});

test("restarting a prediction creates fresh eligibility for that circuit without erasing notebook evidence", () => {
  const state = lab("transient");
  wire(state);
  action(state, "one-tau");
  record(state);
  const earlier = structuredClone(state.records);
  action(state, "restart-prediction");
  assert.deepEqual(state.records, earlier);
  action(state, "set:predictionChoice:slower");
  action(state, "lock-prediction");
  assert.equal(activity(state).prediction.late, false);
  assert.equal(activity(state).prediction.correct, true);
  assert.equal(
    assess(state).every((check) => check.pass),
    false,
    "Prior-run measurements cannot satisfy the new prediction trial."
  );
});

test("correct measurements cannot hide a wrong prediction, and retrying RC preserves completed RL work", () => {
  const state = lab("transient");
  const run = (kind, choice) => {
    action(state, `set:kind:${kind}`);
    wire(state);
    action(state, `set:predictionChoice:${choice}`);
    action(state, "lock-prediction");
    action(state, "one-tau");
    record(state);
    action(state, `set:resistance:${kind === "RC" ? 500 : 200}`);
    action(state, "reset-energy");
    action(state, "one-tau");
    record(state);
  };
  run("RC", "faster");
  run("RL", "faster");
  assert.equal(
    assess(state).every((check) => check.pass),
    false
  );
  const rlRecords = structuredClone(state.records.filter((row) => row.params.kind === "RL"));
  action(state, "set:kind:RC");
  action(state, "restart-prediction");
  assert.equal(
    assess(state).every((check) => check.pass),
    false,
    "Previous RC measurements belong to its old prediction trial."
  );
  run("RC", "slower");
  assert.deepEqual(
    state.records.filter((row) => row.params.kind === "RL"),
    rlRecords
  );
  assert.equal(
    assess(state).every((check) => check.pass),
    true
  );
});

test("playback speed changes elapsed circuit time without changing electrical parameters", () => {
  for (const [kind, resistance, baselineTau] of [
    ["RC", 500, 0.1],
    ["RL", 200, 0.001],
  ]) {
    const state = lab("transient", "explore");
    action(state, `set:kind:${kind}`);
    action(state, `set:resistance:${resistance}`);
    action(state, "reset-energy");
    action(state, "set:speed:0.5");
    action(state, "play");
    const tau = measure(state).tau;
    advanceTransient(state, 0.4);
    near(parameters(state).time, (baselineTau * 0.4 * 0.5) / 2);
    near(measure(state).tau, tau);
    action(state, "set:speed:2");
    const before = parameters(state).time;
    advanceTransient(state, 0.1);
    near(parameters(state).time - before, (baselineTau * 0.1 * 2) / 2);
    near(measure(state).tau, tau);
    action(state, "play");
    const paused = parameters(state).time;
    advanceTransient(state, 1);
    near(parameters(state).time, paused);
  }
});

test("transient voltage and current panels share circuit time and satisfy KVL throughout charge and decay", () => {
  for (const kind of ["RC", "RL"]) {
    const state = lab("transient", "explore");
    action(state, `set:kind:${kind}`);
    action(state, "one-tau");
    for (const decaying of [false, true]) {
      if (decaying) action(state, "switch");
      action(state, "one-tau");
      const graph = plot(state);
      const voltage = graph.panels.find((panel) => panel.id === "voltage");
      const current = graph.panels.find((panel) => panel.id === "current");
      assert.ok(voltage && current, "Both quantities must be visible.");
      const volts = voltage.series[0].points;
      const milliamps = current.series[0].points;
      assert.equal(volts.length, milliamps.length);
      for (let index = 0; index < volts.length; index += 1) {
        near(volts[index][0], milliamps[index][0]);
        near(volts[index][1] + (parameters(state).resistance * milliamps[index][1]) / 1000, decaying ? 0 : 5);
      }
      near(voltage.marker.x, current.marker.x);
      near(voltage.marker.x, parameters(state).time * 1000);
      near(voltage.marker.y, measure(state).voltage);
      near(current.marker.y, measure(state).current * 1000);
      if (decaying) assert.ok(kind === "RC" ? milliamps[0][1] < 0 : volts[0][1] < 0);
    }
  }
});

test("scope channels measure connected nodes and separate oscilloscope grounding from ideal voltmeter probes", () => {
  const state = lab("opamp");
  wire(state);
  assert.equal(scope(state).correct, false);
  connectScope(state);
  let acquisition = scope(state);
  assert.equal(acquisition.ok, true, acquisition.error);
  assert.equal(acquisition.correct, true);
  near(Math.max(...acquisition.channels.ch1.points.map(([, value]) => value)), 1);
  near(Math.max(...acquisition.channels.ch2.points.map(([, value]) => value)), 2);
  action(state, "probe:ch1:vp");
  acquisition = scope(state);
  assert.equal(acquisition.channels.ch1.valid, true);
  assert.equal(acquisition.channels.ch1.correct, false);
  assert.ok(acquisition.channels.ch1.points.every(([, value]) => Math.abs(value - 12) < 1e-8));
  action(state, "probe:ch1Ground:out");
  acquisition = scope(state);
  assert.equal(acquisition.channels.ch1.valid, false);
  assert.equal(acquisition.correct, false);
});

test("scope trigger rejects unreachable crossings and autoscale does not fabricate a trigger", () => {
  const state = lab("opamp");
  wire(state);
  connectScope(state);
  action(state, "set:triggerLevel:3");
  assert.equal(scope(state).trigger.found, false);
  action(state, "scope-autoscale");
  assert.equal(scope(state).trigger.found, false);
  action(state, "set:triggerLevel:0");
  const acquisition = scope(state);
  assert.equal(acquisition.trigger.found, true);
  for (const name of ["ch1", "ch2"]) {
    const channel = acquisition.channels[name];
    const peak = Math.max(...channel.points.map(([, value]) => Math.abs(value)));
    assert.ok(peak <= 4 * channel.scale, `${name} trace should fit the vertical range after autoscale.`);
  }
});

test("scope rising and falling trigger choices align the trace with the selected input crossing", () => {
  const state = lab("opamp");
  wire(state);
  connectScope(state);
  action(state, "set:triggerLevel:0.5");
  for (const [edge, fraction] of [
    ["rising", 1 / 12],
    ["falling", 5 / 12],
  ]) {
    action(state, `set:triggerEdge:${edge}`);
    const acquisition = scope(state);
    assert.equal(acquisition.trigger.found, true);
    near(acquisition.trigger.time, fraction / 100, 1e-6);
    const points = acquisition.channels.ch1.points;
    near(points[0][1], 0.5, 2e-4);
    assert.ok(edge === "rising" ? points[1][1] > points[0][1] : points[1][1] < points[0][1]);
  }
});

test("scope scale and time-base mistakes do not change physical samples or count as readable trace evidence", () => {
  const state = lab("opamp");
  wire(state);
  connectScope(state);
  action(state, "scope-autoscale");
  const correct = structuredClone(scope(state));
  assert.equal(correct.correct, true);
  action(state, "set:ch1Scale:0.1");
  const cropped = scope(state);
  assert.deepEqual(cropped.channels.ch1.points, correct.channels.ch1.points);
  assert.equal(cropped.channels.ch1.valid, true);
  assert.equal(cropped.correct, false, "A vertically cropped trace is not readable measurement evidence.");
  action(state, "scope-autoscale");
  action(state, "set:timeDiv:0.02");
  assert.equal(scope(state).correct, false, "The task needs enough time span to measure at least one period.");
});

test("scope avoids aliased flat traces at wide time bases and recovers with Autoscale", () => {
  const state = lab("opamp");
  wire(state);
  connectScope(state);
  action(state, "set:frequency:1000");
  action(state, "set:timeDiv:2");
  const twentyPeriods = scope(state);
  assert.equal(twentyPeriods.ok, true);
  assert.equal(twentyPeriods.correct, true);
  assert.ok(twentyPeriods.channels.ch1.points.length > 200, "Longer windows need enough samples to preserve signal peaks.");
  near(Math.max(...twentyPeriods.channels.ch1.points.map(([, value]) => value)), 1, 1e-6);
  action(state, "set:timeDiv:50");
  const tooWide = scope(state);
  assert.equal(tooWide.timebaseTooWide, true);
  assert.equal(tooWide.ok, false);
  assert.equal(tooWide.correct, false);
  assert.ok(Object.values(tooWide.channels).every((channel) => channel.points.length === 0));
  assert.equal(capture(state), false);
  action(state, "scope-autoscale");
  assert.equal(scope(state).correct, true);
  assert.equal(capture(state), true);
});

test("scope hold keeps acquired samples and becomes stale when the circuit settings change", () => {
  const state = lab("opamp");
  wire(state);
  connectScope(state);
  const live = scope(state);
  action(state, "scope-toggle");
  const held = structuredClone(scope(state));
  assert.equal(held.running, false);
  assert.deepEqual(held.channels.ch2.points, live.channels.ch2.points);
  action(state, "set:amplitude:4");
  const after = scope(state);
  assert.deepEqual(after.channels.ch2.points, held.channels.ch2.points);
  assert.equal(after.stale, true);
  assert.equal(after.correct, false);
  action(state, "scope-toggle");
  assert.equal(scope(state).stale, false);
  assert.equal(scope(state).correct, true);
});

test("amplifier challenge requires real channel connections and acquisition evidence", () => {
  const state = lab("opamp");
  wire(state);
  action(state, "set:rf:30000");
  action(state, "set:prediction:3.7");
  assert.equal(capture(state), false, "No connected scope channel means no recorded waveform.");
  assert.equal(state.records.length, 0);
  action(state, "probe:ch1:signal+");
  action(state, "probe:ch1Ground:gnd");
  record(state);
  action(state, "set:amplitude:4");
  record(state);
  assert.equal(
    assess(state).every((check) => check.pass),
    false,
    "One channel alone must not complete the scope task."
  );
  connectScope(state);
  action(state, "scope-autoscale");
  action(state, "set:amplitude:1");
  const clean = record(state);
  assert.equal(clean.scope.correct, true);
  action(state, "set:amplitude:4");
  action(state, "scope-autoscale");
  const clipped = record(state);
  assert.equal(clipped.scope.correct, true);
  assert.equal(
    assess(state).every((check) => check.pass),
    true
  );
  action(state, "set:amplitude:0.5");
  assert.equal(clipped.params.amplitude, 4, "Saved acquisition settings must not follow later controls.");
  assert.ok(clipped.scope.channels.ch2.points.some(([, value]) => Math.abs(value) >= 10.999));
});

test("cancel and remove tools prevent accidental lead changes; undo restores removed leads", () => {
  const state = lab("thevenin", "explore");
  const original = structuredClone(context(state).wires);
  action(state, "tool:wire");
  terminal(state, "s+");
  action(state, "cancel");
  assert.equal(state.selectedTerminal, null);
  assert.deepEqual(context(state).wires, original);
  removeWire(state, 0);
  assert.deepEqual(context(state).wires, original, "Lead removal requires selecting the remove tool.");
  action(state, "tool:remove");
  removeWire(state, 0);
  assert.equal(context(state).wires.length, original.length - 1);
  action(state, "undo");
  assert.deepEqual(context(state).wires, original);
  near(measure(state).voltage, 3);
});
