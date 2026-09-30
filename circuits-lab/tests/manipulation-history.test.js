import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  createLab,
  context,
  key,
  setProbe,
  action,
  terminal,
  moveWire,
  measure,
  chooseModule,
  beginManipulation,
  endManipulation,
} from "../src/lab.js";
import { createDirectInteraction } from "../src/interaction.js";
const v = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
function setup() {
  const state = createLab();
  context(state);
  const contacts = [
    { id: "gnd", position: v(0, 1, 0) },
    { id: "loada", position: v(0.1, 1, 0) },
    { id: "r1a", position: v(0.2, 1, 0) },
  ];
  const engine = createDirectInteraction({
    getTerminals: () => contacts,
    onHold(phase, hold) {
      if (phase === "start") beginManipulation(state, hold.input);
      if (phase === "end") endManipulation(state, hold.input);
    },
    onProbe: (channel, pin) => setProbe(state, channel, pin),
    onDisconnect: (index) => moveWire(state, index, 0, null),
    onConnect(from, to) {
      state.tool = "wire";
      state.selectedTerminal = null;
      terminal(state, from);
      terminal(state, to);
    },
  });
  return { state, engine, contacts };
}

test("probe pickup disconnects immediately, release connects, and one Undo restores the pre-pickup reading", () => {
  const { state, engine } = setup();
  const before = structuredClone(context(state).probes);
  engine.begin("right", { kind: "probe", channel: "red", id: "red" }, { position: v(0.1, 1, 0) });
  assert.equal(context(state).probes.red, null);
  assert.equal(!!measure(state).probeReady, false);
  assert.equal(state.history[key(state)]?.length || 0, 0);
  engine.end("right", { position: v(0, 1, 0) });
  assert.equal(context(state).probes.red, "gnd");
  assert.equal(state.history[key(state)].length, 1);
  action(state, "undo");
  assert.deepEqual(context(state).probes, before);
  assert.equal(measure(state).probeVoltage, 3);
});

test("lifting then reconnecting an existing cable makes a single undo entry despite the open intermediate circuit", () => {
  const { state, engine } = setup(),
    before = structuredClone(context(state).wires);
  engine.begin("right", { kind: "plug", id: "wire0", from: "s+", wireIndex: 0 }, { position: v(0.2, 1, 0) });
  assert.equal(context(state).wires.length, before.length - 1);
  assert.equal(context(state).correct, false);
  engine.end("right", { position: v(0.1, 1, 0) });
  assert.deepEqual(context(state).wires.at(-1), ["s+", "loada"]);
  assert.equal(state.history[key(state)].length, 1);
  action(state, "undo");
  assert.deepEqual(context(state).wires, before);
});

test("overlapping two-hand changes commit after both releases and preserve both hands' final state", () => {
  const { state, engine } = setup(),
    before = structuredClone(context(state).probes);
  engine.begin("left", { kind: "probe", channel: "red", id: "red" }, { position: v(0.1, 1, 0) });
  engine.begin("right", { kind: "probe", channel: "black", id: "black" }, { position: v(0, 1, 0) });
  assert.deepEqual(context(state).probes, { red: null, black: null });
  engine.end("left", { position: v(0, 1, 0) });
  assert.equal(state.history[key(state)]?.length || 0, 0);
  assert.deepEqual(context(state).probes, { red: "gnd", black: null });
  engine.end("right", { position: v(0.1, 1, 0) });
  assert.deepEqual(context(state).probes, { red: "gnd", black: "loada" });
  assert.equal(measure(state).probeVoltage, -3);
  assert.equal(state.history[key(state)].length, 1);
  action(state, "undo");
  assert.deepEqual(context(state).probes, before);
});

test("a probe returned to the same contact creates no redundant undo step", () => {
  const { state, engine } = setup();
  engine.begin("right", { kind: "probe", channel: "red", id: "red" }, { position: v(0.1, 1, 0) });
  engine.end("right", { position: v(0.1, 1, 0) });
  assert.equal(state.history[key(state)]?.length || 0, 0);
  assert.equal(beginManipulation(state, "empty"), true);
  assert.equal(beginManipulation(state, "empty"), false);
  assert.equal(endManipulation(state, "unknown"), false);
  endManipulation(state, "empty");
  assert.equal(state.history[key(state)]?.length || 0, 0);
});

test("grouped edits preserve prior undo history, include scope contacts and cap snapshots at eighty", () => {
  const state = createLab();
  chooseModule(state, "opamp");
  setProbe(state, "red", "signal+");
  const previous = structuredClone(state.history[key(state)][0]);
  beginManipulation(state, "left");
  setProbe(state, "ch1", null);
  setProbe(state, "ch1Ground", null);
  setProbe(state, "ch1", "out");
  setProbe(state, "ch1Ground", "gnd");
  endManipulation(state, "left");
  assert.equal(state.history[key(state)].length, 2);
  assert.deepEqual(state.history[key(state)][0], previous);
  action(state, "undo");
  assert.equal(context(state).scope.ch1.signal, "signal+");
  assert.equal(context(state).probes.red, "signal+");
  for (let i = 0; i < 100; i++) {
    beginManipulation(state, "hand");
    setProbe(state, "red", null);
    setProbe(state, "red", i % 2 ? "out" : "gnd");
    endManipulation(state, "hand");
  }
  assert.equal(state.history[key(state)].length, 80);
});

test("late gesture cleanup writes only to its original circuit context", () => {
  const state = createLab();
  context(state);
  const originalKey = key(state);
  beginManipulation(state, "hand");
  setProbe(state, "red", null);
  chooseModule(state, "opamp");
  endManipulation(state, "hand");
  assert.equal(state.history[originalKey].length, 1);
  assert.equal(state.history[key(state)]?.length || 0, 0);
  assert.equal(context(state).probes.red, "out");
});
