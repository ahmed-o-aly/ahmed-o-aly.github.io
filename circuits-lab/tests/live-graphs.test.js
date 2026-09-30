import test from "node:test";
import assert from "node:assert/strict";
import { MODULES } from "../src/modules.js";
import {
  createLab,
  chooseModule,
  context,
  parameters,
  action,
  change,
  measure,
  activity,
  plot,
  graphCursor,
  advanceTransient,
  moveWire,
  key,
} from "../src/lab.js";
const near = (actual, expected, tolerance = 1e-9) =>
  assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);
function lab(module) {
  const state = createLab();
  chooseModule(state, module);
  return state;
}
function pointAt(graph, x) {
  return graph.series[0].points.find(([value]) => value === x)?.[1];
}

test("all four modules expose a purpose and an experiment sequence matching the email", () => {
  for (const module of Object.values(MODULES)) {
    assert.ok(module.purpose.length > 30);
    assert.equal(module.steps.length, 4);
  }
  assert.match(MODULES.thevenin.steps.join(" "), /250.*500.*1000/);
  assert.match(MODULES.superposition.steps.join(" "), /inactive ideal voltage source with a short/);
  assert.match(MODULES.opamp.steps.join(" "), /circuit assigned in your lab sheet/);
  assert.match(MODULES.transient.steps.join(" "), /same fraction of the final value/);
});

test("the load sweep is calculated from each chosen equivalent and agrees with live load readings", () => {
  const state = lab("thevenin");
  for (const representation of ["original", "thevenin", "norton"]) {
    change(state, "representation", representation);
    const graph = plot(state);
    assert.equal(graph.interaction, "load");
    assert.equal(graph.calculated, true);
    assert.match(graph.subtitle, /Calculated sweep/);
    near(graph.peak.x, 500);
    near(graph.peak.y, 18);
    for (const load of [250, 500, 1000]) {
      change(state, "load", load);
      near(pointAt(plot(state), load), measure(state).power * 1000);
      near(plot(state).marker.y, measure(state).power * 1000);
    }
  }
  change(state, "representation", "thevenin");
  change(state, "equivalentVoltage", 4);
  change(state, "equivalentResistance", 750);
  near(pointAt(plot(state), 750), (1000 * 16) / 3000);
});

test("a solvable wiring change alters the whole load sweep instead of retaining the reference curve", () => {
  const state = lab("thevenin");
  near(plot(state).peak.y, 18);
  // Removing the shunt resistor return leaves a 12 V source and 1 kΩ series resistor.
  action(state, "tool:remove");
  action(state, "remove-wire:3");
  const graph = plot(state);
  assert.equal(context(state).correct, false);
  assert.match(graph.subtitle, /wiring differs/);
  near(graph.peak.x, 1000);
  near(graph.peak.y, 36);
  near(pointAt(graph, 500), 32);
  near(graph.marker.y, measure(state).power * 1000);
  action(state, "reset-circuit");
  assert.deepEqual(plot(state).series, []);
  assert.equal(plot(state).marker, null);
  assert.equal(plot(state).peak, null);
});

test("source views expose signed contributions from the same actual wiring and retain nonzero side currents at cancellation", () => {
  const state = lab("superposition");
  change(state, "v2", 6);
  const result = activity(state);
  near(result.live.a.current, 0.002);
  near(result.live.b.current, -0.002);
  near(result.live.both.current, 0);
  near(result.live.both.branchCurrents.r1, 0.006);
  near(result.live.both.branchCurrents.r2, 0.006);
  assert.equal(graphCursor(state, 0.5).sourceMode, "b");
  near(graphCursor(state, 0.5).readings[0].value, -2);
});

test("RC and RL graphs start at t=0 and acquire only elapsed physical time with synchronized energy", () => {
  for (const kind of ["RC", "RL"]) {
    const state = lab("transient");
    change(state, "kind", kind);
    const initial = plot(state);
    assert.equal(initial.acquiredMax, 0);
    assert.ok(initial.panels.every((panel) => panel.series[0].points.length === 1));
    assert.ok(initial.panels.every((panel) => panel.series[0].points[0][0] === 0));
    assert.equal(graphCursor(state, 0.5).readings.length, 0);
    advanceTransient(state, 2);
    assert.equal(parameters(state).acquiredTime, 0, "Paused time does not advance.");
    action(state, "play");
    advanceTransient(state, 1);
    const graph = plot(state),
      p = parameters(state);
    near(graph.acquiredMax, p.time * 1000);
    assert.deepEqual(
      graph.panels.map((panel) => panel.id),
      ["voltage", "current", "energy"]
    );
    const [v, i, e] = graph.panels.map((panel) => panel.series[0].points);
    for (let index = 0; index < v.length; index++) {
      near(v[index][0], i[index][0]);
      near(v[index][0], e[index][0]);
      assert.ok(v[index][0] <= graph.acquiredMax);
      near(v[index][1] + (p.resistance * i[index][1]) / 1000, 5);
      near(e[index][1], kind === "RC" ? 500 * p.capacitance * v[index][1] ** 2 : 0.0005 * p.inductance * i[index][1] ** 2);
    }
    near(graph.panels[2].marker.y, measure(state).energy * 1000);
  }
});

test("scrubbing reads the acquired segment without erasing it or inventing future samples", () => {
  const state = lab("transient");
  action(state, "play");
  advanceTransient(state, 2);
  const original = plot(state);
  assert.equal(action(state, "scrub:50"), true);
  near(parameters(state).time, 0.05);
  assert.equal(parameters(state).playing, false);
  near(parameters(state).acquiredTime, 0.1);
  assert.deepEqual(
    plot(state).panels.map((p) => p.series),
    original.panels.map((p) => p.series)
  );
  const cursor = graphCursor(state, 0.1);
  near(cursor.x, 50);
  near(cursor.readings[0].value, measure(state).voltage);
  assert.equal(cursor.readings.length, 3);
  assert.match(graphCursor(state, 0.8).text, /not acquired/);
  assert.equal(graphCursor(state, 0.8).readings.length, 0);
  action(state, "scrub:400");
  near(parameters(state).time, 0.1);
});

test("resistance and switch changes preserve physical storage but start fresh acquired segments", () => {
  for (const kind of ["RC", "RL"]) {
    const state = lab("transient");
    change(state, "kind", kind);
    action(state, "play");
    advanceTransient(state, 2);
    const before = measure(state),
      resistance = parameters(state).resistance;
    change(state, "resistance", resistance);
    assert.ok(plot(state).acquiredMax > 0, "Unchanged resistance does not discard the run.");
    change(state, "resistance", 2 * resistance);
    near(measure(state).storageValue, before.storageValue);
    near(measure(state).tau / before.tau, kind === "RC" ? 2 : 0.5);
    assert.equal(plot(state).acquiredMax, 0);
    const afterR = measure(state);
    action(state, "switch");
    near(measure(state).storageValue, afterR.storageValue);
    assert.equal(plot(state).acquiredMax, 0);
    action(state, "play");
    if (!parameters(state).playing) action(state, "play");
    advanceTransient(state, 1);
    assert.ok(plot(state).acquiredMax > 0);
    action(state, "replay");
    assert.equal(plot(state).acquiredMax, 0);
    near(measure(state).storageValue, afterR.storageValue);
    action(state, "reset-energy");
    near(measure(state).energy, 0);
  }
});

test("resistance comparisons share time coordinates and invalid transient wiring never displays a reference trace", () => {
  for (const kind of ["RC", "RL"]) {
    const state = lab("transient");
    change(state, "kind", kind);
    const axis = plot(state).xMax;
    change(state, "resistance", parameters(state).resistance * 2);
    near(plot(state).xMax, axis);
    action(state, "play");
    advanceTransient(state, 1);
    action(state, "reset-circuit");
    const graph = plot(state);
    assert.ok(graph.panels.every((panel) => panel.series.length === 0 && panel.marker === null));
    assert.equal(graphCursor(state, 0).readings.length, 0);
    assert.equal(action(state, "scrub:20"), false);
  }
});

test("scope cursor reads acquired selected-node traces and retains the same samples during Hold", () => {
  const state = lab("opamp");
  const before = structuredClone(state);
  const cursor = graphCursor(state, 0.125, 1);
  near(cursor.x, 2.5);
  near(cursor.readings[0].value, 1);
  near(cursor.readings[1].value, -2);
  assert.deepEqual(state, before, "Graph inspection is read-only.");
  action(state, "scope-toggle");
  change(state, "amplitude", 4);
  near(graphCursor(state, 0.125).readings[1].value, -2);
  action(state, "scope-toggle");
  near(graphCursor(state, 0.125).readings[1].value, -8);
});

test("moving or dropping a cable end is atomic and Undo restores the prior lead", () => {
  const state = lab("thevenin"),
    original = structuredClone(context(state).wires);
  state.selectedTerminal = "gnd";
  const history = state.history[key(state)]?.length || 0;
  assert.equal(moveWire(state, 0, 1, "loada"), true);
  assert.deepEqual(context(state).wires[0], ["s+", "loada"]);
  assert.equal(state.selectedTerminal, null);
  assert.equal(state.history[key(state)].length, history + 1);
  action(state, "undo");
  assert.deepEqual(context(state).wires, original);
  assert.equal(moveWire(state, 0, 0, null), true);
  assert.equal(context(state).wires.length, original.length - 1);
  action(state, "undo");
  assert.deepEqual(context(state).wires, original);
});

test("invalid cable moves leave wiring and undo history untouched and moving transient wiring pauses playback", () => {
  const state = lab("thevenin"),
    original = structuredClone(state);
  for (const args of [
    [-1, 0, "gnd"],
    [0, 2, "gnd"],
    [0, 0, "unknown"],
    [0, 0, "s+"],
    [0, 0, "r1a"],
    [3, 0, "loadb"],
  ]) {
    assert.equal(moveWire(state, ...args), false);
    assert.deepEqual(state, original);
  }
  const storage = lab("transient");
  action(storage, "play");
  assert.equal(parameters(storage).playing, true);
  assert.equal(moveWire(storage, 0, 1, null), true);
  assert.equal(parameters(storage).playing, false);
});
