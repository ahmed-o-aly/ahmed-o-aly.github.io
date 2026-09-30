import test from "node:test";
import assert from "node:assert/strict";
import {
  action,
  advanceTransient,
  beginManipulation,
  change,
  chooseModule,
  context,
  createLab,
  endManipulation,
  key,
  measure,
  parameters,
  plot,
  scope,
  setProbe,
  vrActions,
} from "../src/lab.js";
import { MODULES } from "../src/modules.js";

const caches = ["wireSets", "probeSets", "scopeSets", "scopeHolds", "history"];
const variants = {
  thevenin: ["representation", ["original", "thevenin", "norton"]],
  superposition: ["sourceMode", ["both", "a", "b"]],
  opamp: ["configuration", ["inverting", "noninverting"]],
  transient: ["kind", ["RC", "RL"]],
};
function lab(module) {
  const state = createLab();
  chooseModule(state, module);
  return state;
}
function snapshotContext(state) {
  const { wires, probes, scope: channels } = context(state);
  return structuredClone({ wires, probes, scope: channels });
}
function assertFresh(state, module) {
  assert.equal(state.module, module);
  assert.equal(state.mode, "explore");
  assert.deepEqual(parameters(state), MODULES[module].defaults);
  assert.deepEqual(snapshotContext(state), snapshotContext(lab(module)));
  assert.equal(context(state).correct, true);
  assert.equal(measure(state).ok, true);
  assert.ok(measure(state).probeReady);
  assert.equal(state.tool, "wire");
  assert.equal(state.selectedTerminal, null);
  assert.equal(state.history[key(state)]?.length || 0, 0);
}

for (const module of Object.keys(MODULES)) {
  test(`Reset experiment restores cleared ${module} Explore and cannot Undo back to the broken circuit`, () => {
    const state = lab(module);
    const freshReading = measure(state).probeVoltage;
    const [name, values] = variants[module];
    change(state, name, values.at(-1));
    const dirtySettings = {
      thevenin: { load: 2000, equivalentVoltage: 4, equivalentResistance: 750, nortonCurrent: 8 },
      superposition: { v1: 12, v2: 9, replacement: "open" },
      opamp: { rf: 30000, amplitude: 3, frequency: 50 },
      transient: { resistance: 300, initial: 0.01, time: 0.004, speed: 2 },
    };
    for (const [setting, value] of Object.entries(dirtySettings[module])) change(state, setting, value);
    action(state, "clear");
    state.tool = "remove";
    state.selectedTerminal = context(state).circuit.pins[0].id;
    assert.equal(context(state).correct, false);
    assert.equal(action(state, "reset-experiment"), true);
    assertFresh(state, module);
    assert.equal(measure(state).probeVoltage, freshReading);
    action(state, "undo");
    assertFresh(state, module);
    assert.match(state.feedback, /No wiring or probe change to undo/);
    assert.ok(vrActions(state).some((control) => control.id === "reset-experiment"));
  });
}

test("reset from Build erases stale Explore, Build and legacy variant caches for every module", () => {
  for (const module of Object.keys(MODULES)) {
    const state = lab(module);
    const [name, values] = variants[module];
    for (const mode of ["explore", "build", "challenge"]) {
      action(state, mode);
      for (const value of values) {
        change(state, name, value);
        action(state, "clear");
        state.scopeHolds[key(state)] = { stale: true };
      }
    }
    // A held acquisition or history can outlive its wire cache; reset must still remove it.
    state.scopeHolds[`explore:${module}:orphan`] = { stale: true };
    state.history[`build:${module}:orphan`] = [snapshotContext(state)];
    action(state, "build");
    action(state, "reset-experiment");
    assertFresh(state, module);
    for (const field of caches) {
      const keys = Object.keys(state[field]);
      assert.deepEqual(keys, ["wireSets", "probeSets", "scopeSets"].includes(field) ? [key(state)] : [], `${module}: ${field}`);
    }
    for (const value of values) {
      change(state, name, value);
      assert.equal(context(state).correct, true, `${module}: restored Explore ${value}`);
      assert.ok(context(state).probes.red);
      action(state, "undo");
      assert.equal(context(state).correct, true);
    }
    action(state, "build");
    assert.deepEqual(context(state).wires, [], "Build starts empty after the full reset.");
    assert.equal(state.history[key(state)]?.length || 0, 0);
  }
});

test("amplifier reset restores default supplies, waveform, scope contacts, scales, trigger and acquisition", () => {
  const state = lab("opamp");
  const firstAcquisition = scope(state);
  for (const [name, value] of Object.entries({
    rf: 40000,
    rail: 5,
    amplitude: 6,
    frequency: 500,
    timeDiv: 0.4,
    ch1Scale: 2,
    ch2Scale: 2,
    triggerEdge: "falling",
    triggerLevel: 1,
  }))
    change(state, name, value);
  action(state, "scope-toggle");
  assert.equal(parameters(state).scopeRunning, false);
  assert.ok(state.scopeHolds[key(state)]);
  setProbe(state, "ch1", "out");
  setProbe(state, "ch2Ground", "signal+");
  setProbe(state, "red", null);
  action(state, "reset-experiment");
  assertFresh(state, "opamp");
  const restored = scope(state);
  assert.equal(restored.running, true);
  assert.equal(restored.stale, false);
  assert.equal(restored.correct, true);
  assert.equal(restored.clipped, false);
  assert.deepEqual(restored.channels.ch1.points, firstAcquisition.channels.ch1.points);
  assert.deepEqual(restored.channels.ch2.points, firstAcquisition.channels.ch2.points);
  assert.equal(restored.acquisition.sequence, state.sequence, "The default signature must not reuse a pre-reset acquisition.");
  assert.deepEqual(state.scopeHolds, {});
});

test("transient reset discards stored energy, acquired time, replay position and running clock", () => {
  const state = lab("transient");
  action(state, "play");
  advanceTransient(state, 2);
  assert.ok(parameters(state).acquiredTime > 0);
  assert.ok(measure(state).energy > 0);
  action(state, "switch");
  advanceTransient(state, 0.2);
  action(state, "scrub:2");
  action(state, "reset-experiment");
  assertFresh(state, "transient");
  assert.equal(measure(state).voltage, 0);
  assert.equal(measure(state).energy, 0);
  const resetPlot = plot(state);
  for (const panel of resetPlot.panels) {
    assert.equal(panel.acquiredMax, 0);
    assert.equal(panel.marker.x, 0);
    assert.equal(panel.series[0].points.length, 1);
  }
  assert.equal(advanceTransient(state, 5), 0, "The old running clock cannot resume after reset.");
  action(state, "scrub:250");
  assert.equal(parameters(state).time, 0);
  action(state, "play");
  advanceTransient(state, 2);
  assert.ok(parameters(state).time > 0, "A fresh run remains usable.");
});

test("reset cancels overlapping manipulation snapshots so late releases cannot restore pre-reset history", () => {
  const state = lab("opamp");
  beginManipulation(state, "left");
  beginManipulation(state, "right");
  setProbe(state, "red", null);
  setProbe(state, "ch1", null);
  action(state, "clear");
  action(state, "reset-experiment");
  assert.equal(endManipulation(state, "left"), false);
  assert.equal(endManipulation(state, "right"), false);
  action(state, "undo");
  assertFresh(state, "opamp");
  assert.equal(beginManipulation(state, "left"), true, "A controller can begin a new gesture after reset.");
  setProbe(state, "red", "gnd");
  endManipulation(state, "left");
  assert.equal(state.history[key(state)].length, 1);
  action(state, "undo");
  assertFresh(state, "opamp");
});

test("reset preserves other experiments' settings, wiring, instruments, history and saved acquisition", () => {
  const state = lab("opamp");
  change(state, "rf", 30000);
  action(state, "scope-toggle");
  setProbe(state, "red", "signal+");
  const ampKey = key(state);
  const ampParams = structuredClone(parameters(state));
  const ampCaches = Object.fromEntries(caches.map((field) => [field, structuredClone(state[field][ampKey])]));
  chooseModule(state, "transient");
  action(state, "play");
  advanceTransient(state, 2);
  action(state, "reset-experiment");
  assert.deepEqual(state.params.opamp, ampParams);
  for (const field of caches) assert.deepEqual(state[field][ampKey], ampCaches[field], field);
  chooseModule(state, "opamp");
  assert.equal(parameters(state).rf, 30000);
  assert.equal(context(state).probes.red, "signal+");
  assert.equal(scope(state).running, false);
  assert.equal(scope(state).channels.ch2.peak, 3);
});
