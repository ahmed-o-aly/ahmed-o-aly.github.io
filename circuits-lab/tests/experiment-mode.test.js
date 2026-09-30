import test from "node:test";
import assert from "node:assert/strict";
import { MODULES } from "../src/modules.js";
import {
  createLab, chooseModule, parameters, context, action, terminal,
  setProbe, activity, measure, plot, vrActions,
} from "../src/lab.js";

function lab(module, mode = "explore") {
  const state = createLab();
  chooseModule(state, module);
  if (mode !== "explore") action(state, mode);
  return state;
}
const near = (actual, expected) => assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);
const forbiddenAction = /^(?:record|check|challenge|reset-attempt|submit-sum|lock-prediction|restart-prediction)$|(?:sumMilliamp|prediction|explanation)/;
const variants = [
  ["thevenin", "representation", ["original", "thevenin", "norton"]],
  ["superposition", "sourceMode", ["both", "a", "b"]],
  ["opamp", "configuration", ["inverting", "noninverting"]],
  ["transient", "kind", ["RC", "RL"]],
];

test("every exposed experiment menu contains physical controls and no answer, record or grade actions", () => {
  for (const [module, name, values] of variants) {
    for (const mode of ["explore", "build"]) {
      for (const value of values) {
        const state = lab(module, mode);
        action(state, `set:${name}:${value}`);
        const controls = vrActions(state);
        assert.ok(controls.length > 10);
        assert.ok(controls.every((control) => ["Guide", "Bench", "Settings", "Labs"].includes(control.group)));
        assert.ok(controls.every((control) => !forbiddenAction.test(control.id)), `${module}/${mode}/${value}`);
        for (const id of ["reset-circuit", "check-wiring", "undo", "tool:wire", "tool:red", "tool:black", mode === "explore" ? "build" : "explore"]) {
          assert.ok(controls.some((control) => control.id === id), id);
        }
        assert.equal(controls.some((control) => control.id === "restore"), mode === "explore");
        for (const control of controls) {
          const copy = structuredClone(state);
          action(copy, control.id);
          assert.doesNotMatch(copy.feedback, /\b(record|submit|notebook|challenge|grade|prediction)\b/i, `${module}: ${control.id}`);
        }
      }
    }
  }
  for (const module of Object.values(MODULES)) assert.match(module.challenge, /paper/);
});

test("Build circuit preserves chosen settings and starts a separate empty bench for each circuit", () => {
  for (const [module, name, values] of variants) {
    const state = lab(module);
    action(state, `set:${name}:${values.at(-1)}`);
    const before = structuredClone(parameters(state));
    const exploration = structuredClone(context(state));
    action(state, "build");
    assert.equal(state.mode, "build");
    assert.deepEqual(parameters(state), before, module);
    assert.equal(state.challengeStarted[module], undefined);
    assert.deepEqual(context(state).wires, []);
    assert.deepEqual(context(state).probes, { red: null, black: null });
    assert.deepEqual(context(state).scope, {
      ch1: { signal: null, ground: null }, ch2: { signal: null, ground: null },
    });
    const [a, b] = context(state).circuit.wires[0];
    terminal(state, a);
    terminal(state, b);
    action(state, "explore");
    assert.deepEqual(context(state).wires, exploration.wires);
    action(state, "build");
    assert.deepEqual(context(state).wires, [[a, b]], "Returning to Build keeps the student's leads.");
    chooseModule(state, module === "opamp" ? "thevenin" : "opamp");
    chooseModule(state, module);
    assert.deepEqual(context(state).wires, [[a, b]]);
  }
});

test("Clear circuit preserves component values and Undo restores patch leads and every probe", () => {
  const state = lab("opamp");
  action(state, "set:rf:30000");
  action(state, "set:rail:9");
  const before = structuredClone(context(state));
  const settings = structuredClone(parameters(state));
  action(state, "reset-circuit");
  assert.deepEqual(context(state).wires, []);
  assert.deepEqual(context(state).probes, { red: null, black: null });
  assert.equal(context(state).scope.ch1.signal, null);
  assert.equal(context(state).scope.ch2.ground, null);
  assert.deepEqual(parameters(state), settings);
  action(state, "undo");
  assert.deepEqual(context(state).wires, before.wires);
  assert.deepEqual(context(state).probes, before.probes);
  assert.deepEqual(context(state).scope, before.scope);
  assert.equal(measure(state).correct, true);
});

test("live source comparisons use current settings without probes or recorded answers", () => {
  const state = lab("superposition");
  setProbe(state, "red", null);
  setProbe(state, "black", null);
  for (const mode of ["a", "b", "both"]) {
    action(state, `set:sourceMode:${mode}`);
    const result = activity(state);
    assert.equal(result.valid, true);
    assert.equal(result.topologyCorrect, true);
    assert.equal(result.superpositionValid, true);
    near(result.live.a.current, 0.002);
    near(result.live.b.current, -0.001);
    near(result.live.both.current, 0.001);
    near(measure(state).current, result.live[mode].current);
    near(result.live.both.power, 0.001);
    assert.notEqual(result.live.a.power + result.live.b.power, result.live.both.power, "Power contributions do not add.");
  }
  action(state, "set:v2:6");
  const result = activity(state);
  near(result.live.a.current, 0.002);
  near(result.live.b.current, -0.002);
  near(result.live.both.current, 0);
  assert.equal(state.records.length, 0);
});

test("live source views report unsolved wiring honestly instead of supplying reference readings", () => {
  const state = lab("superposition", "build");
  const empty = activity(state);
  assert.equal(empty.valid, false);
  assert.equal(empty.topologyCorrect, false);
  for (const entry of Object.values(empty.live)) {
    assert.equal(entry.valid, false);
    assert.equal(entry.current, null);
    assert.ok(entry.error);
  }
  assert.ok(plot(state).bars.every((bar) => bar.missing && bar.value === null));
  action(state, "explore");
  // Shorting source A imposes incompatible source voltages.
  terminal(state, "a+");
  terminal(state, "gnd");
  const shorted = activity(state);
  assert.equal(shorted.valid, false);
  assert.equal(shorted.live.a.current, null);
  assert.equal(shorted.live.both.current, null);
});

test("solvable changed wiring produces its actual source contributions with a topology warning", () => {
  const state = lab("superposition");
  action(state, "tool:remove");
  action(state, "remove-wire:0");
  const result = activity(state);
  assert.equal(result.valid, true);
  assert.equal(result.topologyCorrect, false);
  assert.match(result.error, /wiring differs/i);
  near(result.live.a.current, 0);
  near(result.live.b.current, -0.0015);
  near(result.live.both.current, -0.0015);
});

test("open inactive sources show actual open-circuit results with a non-additivity warning", () => {
  const state = lab("superposition");
  action(state, "set:replacement:open");
  const result = activity(state);
  assert.equal(result.valid, true);
  assert.equal(result.superpositionValid, false);
  assert.match(result.error, /Open replacements/);
  near(result.live.a.current, 0.003);
  near(result.live.b.current, -0.0015);
  near(result.live.both.current, 0.001);
  assert.notEqual(result.live.a.current + result.live.b.current, result.live.both.current);
  assert.equal(plot(state).title, "Source states");
});
