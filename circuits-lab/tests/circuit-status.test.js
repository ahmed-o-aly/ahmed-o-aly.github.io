import test from "node:test";
import assert from "node:assert/strict";
import { circuitStatus } from "../src/circuit-status.js";
import { action, advanceTransient, change, chooseModule, context, createLab, key, measure, scope, setMode, setProbe } from "../src/lab.js";

function lab(module = "thevenin", mode = "explore") {
  const state = createLab();
  chooseModule(state, module);
  if (mode !== "explore") setMode(state, mode);
  return state;
}
function remove(state, a, b) {
  context(state);
  state.wireSets[key(state)] = state.wireSets[key(state)].filter((wire) => !(wire.includes(a) && wire.includes(b)));
}
function add(state, a, b) {
  context(state).wires.push([a, b]);
}
function deepFreeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

test("status is pure, including when reading an uninitialized context", () => {
  for (const module of ["thevenin", "superposition", "opamp", "transient"]) {
    const state = createLab();
    state.module = module;
    const before = structuredClone(state);
    deepFreeze(state);
    const result = circuitStatus(state);
    assert.notEqual(result.level, "error");
    assert.deepEqual(state, before);
    assert.equal(Object.keys(state.wireSets).length, 0);
  }
});

test("empty Build benches explain the missing circuit before instrument tips", () => {
  for (const module of ["thevenin", "superposition", "opamp", "transient"]) {
    const result = circuitStatus(lab(module, "build"));
    assert.equal(result.title, "Wire the circuit");
    assert.equal(result.level, "info");
  }
});

test("actual source shorts are identified before generic solver failures", () => {
  for (const [module, a, b] of [
    ["thevenin", "s+", "s-"],
    ["opamp", "plus+", "plus-"],
    ["transient", "s+", "s-"],
  ]) {
    const state = lab(module);
    add(state, a, b);
    assert.equal(measure(state).ok, false);
    assert.equal(circuitStatus(state).title, "Source shorted");
    assert.equal(circuitStatus(state).level, "error");
  }
});

test("a zeroed inactive voltage source is a valid short, not a source fault", () => {
  const state = lab("superposition");
  change(state, "sourceMode", "a");
  add(state, "b+", "b-");
  // A redundant ideal 0 V source is a solver issue, not a shorted active source.
  assert.notEqual(circuitStatus(state).title, "Source shorted");
});

test("missing common and floating parts receive distinct next actions", () => {
  const state = lab();
  context(state);
  state.wireSets[key(state)] = context(state).wires.filter((wire) => !wire.includes("gnd"));
  assert.equal(circuitStatus(state).title, "Common disconnected");
  const floating = lab();
  remove(floating, "r2a", "loada");
  remove(floating, "loadb", "gnd");
  assert.equal(circuitStatus(floating).title, "Floating connection");
  assert.match(circuitStatus(floating).detail, /LOAD/);
});

test("a solvable alternate DC circuit and a zero branch current are not rejected", () => {
  const alternate = lab("superposition");
  remove(alternate, "a+", "r1a");
  assert.equal(measure(alternate).ok, true);
  assert.equal(measure(alternate).correct, false);
  assert.equal(circuitStatus(alternate).level, "ok");
  const cancel = lab("superposition");
  change(cancel, "v2", 6);
  assert.equal(measure(cancel).current, 0);
  assert.equal(circuitStatus(cancel).title, "Circuit connected");
  const reversed = lab();
  setProbe(reversed, "red", "gnd");
  setProbe(reversed, "black", "loada");
  assert.ok(measure(reversed).probeVoltage < 0);
  assert.equal(circuitStatus(reversed).level, "ok");
});

test("valid open-source measurements warn about nonadditive contributions", () => {
  const state = lab("superposition");
  change(state, "sourceMode", "a");
  change(state, "replacement", "open");
  assert.equal(measure(state).ok, true);
  const result = circuitStatus(state);
  assert.equal(result.level, "warning");
  assert.match(result.message, /may not add/);
  change(state, "sourceMode", "both");
  assert.equal(circuitStatus(state).title, "Comparison uses Open");
  change(state, "replacement", "short");
  assert.equal(circuitStatus(state).level, "ok");
});

test("amplifier diagnoses distinguish either supply, feedback and common", () => {
  for (const [a, b, title] of [
    ["plus+", "vp", "+ supply disconnected"],
    ["minus-", "vn", "− supply disconnected"],
    ["rfa", "op-", "Feedback disconnected"],
    ["signal-", "gnd", "Signal common disconnected"],
  ]) {
    const state = lab("opamp");
    remove(state, a, b);
    assert.equal(measure(state).ok, false);
    assert.equal(circuitStatus(state).title, title);
  }
  const extra = lab("opamp");
  add(extra, "out", "gnd");
  assert.equal(circuitStatus(extra).title, "Unexpected connection");
});

test("bounded model restrictions do not falsely describe reversed resistor leads as an open path", () => {
  const state = lab("opamp");
  context(state);
  state.wireSets[key(state)] = context(state).wires.map((wire) => wire.map((pin) => (pin === "rfa" ? "rfb" : pin === "rfb" ? "rfa" : pin)));
  assert.equal(measure(state).ok, false);
  const result = circuitStatus(state);
  assert.equal(result.title, "Feedback wiring differs");
  assert.match(result.message, /model requires/);
  assert.doesNotMatch(result.message, /open|disconnected/);
});

test("transient faults identify the return path and storage loop before Run", () => {
  for (const [a, b, title] of [
    ["s+", "supply", "Source disconnected"],
    ["return", "gnd", "Return path open"],
    ["common", "ra", "Switch disconnected"],
    ["rb", "storagea", "Storage loop open"],
  ]) {
    const state = lab("transient");
    remove(state, a, b);
    assert.equal(circuitStatus(state).title, title);
  }
});

test("meter status separates a disconnected tip from a valid zero or reversed reading", () => {
  const state = lab();
  setProbe(state, "red", null);
  assert.equal(circuitStatus(state).title, "Red meter tip disconnected");
  setProbe(state, "black", null);
  assert.equal(circuitStatus(state).title, "Meter not connected");
  setProbe(state, "red", "gnd");
  setProbe(state, "black", "gnd");
  assert.equal(measure(state).probeVoltage, 0);
  assert.equal(circuitStatus(state).level, "ok");
  assert.equal(circuitStatus(state, { meterMode: "off" }).title, "Meter is off");
});

test("scope status distinguishes missing signals, grounds and a misplaced ground", () => {
  const state = lab("opamp");
  setProbe(state, "ch1", null);
  assert.equal(circuitStatus(state).title, "CH1 tip disconnected");
  setProbe(state, "ch1", "signal+");
  setProbe(state, "ch2Ground", null);
  assert.equal(circuitStatus(state).title, "CH2 ground disconnected");
  setProbe(state, "ch2Ground", "signal+");
  assert.equal(circuitStatus(state).title, "CH2 ground misplaced");
  // Any contact electrically joined to GND is a valid ground clip location.
  setProbe(state, "ch2Ground", "minus+");
  assert.equal(circuitStatus(state).level, "ok");
});

test("scope may measure other connected nodes without claiming the circuit is wrong", () => {
  const state = lab("opamp");
  setProbe(state, "ch2", "signal+");
  assert.equal(scope(state).channels.ch2.correct, false);
  assert.equal(scope(state).channels.ch2.valid, true);
  assert.equal(circuitStatus(state).level, "ok");
});

test("held traces are distinguished from stale traces after changing settings", () => {
  const state = lab("opamp");
  action(state, "scope-toggle");
  assert.equal(circuitStatus(state).title, "Scope on Hold");
  change(state, "amplitude", 2);
  assert.equal(circuitStatus(state).title, "Held trace is old");
  action(state, "scope-toggle");
  assert.equal(circuitStatus(state).level, "ok");
});

test("trigger, display crop and wide timebase have specific scope remedies", () => {
  const state = lab("opamp");
  change(state, "triggerLevel", 5);
  assert.equal(circuitStatus(state).title, "No trigger crossing");
  change(state, "triggerLevel", 0);
  change(state, "ch2Scale", 0.1);
  assert.equal(circuitStatus(state).title, "Trace outside screen");
  assert.equal(measure(state).clipped, false);
  action(state, "scope-autoscale");
  change(state, "timeDiv", 50);
  assert.equal(circuitStatus(state).title, "Timebase too wide");
  action(state, "scope-autoscale");
  assert.equal(circuitStatus(state).level, "ok");
});

test("actual amplifier clipping is reported with a readable, uncropped acquisition", () => {
  const state = lab("opamp");
  change(state, "rf", 30000);
  change(state, "amplitude", 4);
  action(state, "scope-autoscale");
  assert.equal(measure(state).clipped, true);
  assert.equal(scope(state).channels.ch2.cropped, false);
  assert.equal(circuitStatus(state).title, "Output clipping");
});

test("transient readiness, acquisition, pause, scrub and completion are valid states", () => {
  const state = lab("transient");
  assert.equal(circuitStatus(state).title, "Ready to run");
  action(state, "play");
  assert.equal(circuitStatus(state).title, "Transient running");
  advanceTransient(state, 0.5);
  action(state, "play");
  assert.equal(circuitStatus(state).title, "Transient paused");
  action(state, "scrub:10");
  assert.equal(circuitStatus(state).title, "Reviewing recorded time");
  action(state, "play");
  advanceTransient(state, 100);
  assert.equal(circuitStatus(state).title, "Run complete");
});

test("render-time measurement and acquisition produce the same read-only result", () => {
  const state = lab("opamp");
  change(state, "triggerLevel", 5);
  const measurement = measure(state),
    acquisition = scope(state);
  const before = structuredClone(state);
  assert.deepEqual(circuitStatus(state, { measurement, acquisition }), circuitStatus(state));
  assert.deepEqual(state, before);
  assert.equal(circuitStatus(state, { measurement, acquisition }).title, "No trigger crossing");
});
