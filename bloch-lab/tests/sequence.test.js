import { test } from "node:test";
import assert from "node:assert/strict";
import { GateSequence, MAX_GATES } from "../sequence.js";
import { presets, gates, rotate } from "../state.js";
const near = (a, b) => a.forEach((x, i) => assert.ok(Math.abs(x - b[i]) < 1e-9));
test("sequence applies in visible left-to-right order and stores every endpoint", () => {
  const s = new GateSequence();
  ["H", "Z", "H"].forEach((g) => s.append(g, presets["0"]));
  let v = [...s.base];
  let g = s.begin();
  while (g) {
    v = rotate(v, gates[g].axis, gates[g].angle);
    s.finish(v);
    g = s.status === "complete" ? null : s.begin();
  }
  near(v, presets["1"]);
  assert.equal(s.snapshots.length, 3);
  near(s.snapshots[0], presets["+"]);
  near(s.snapshots[1], presets["−"]);
  near(s.expected(), v);
});
test("noncommuting gate order matters", () => {
  const a = new GateSequence(),
    b = new GateSequence();
  ["H", "Z"].forEach((g) => a.append(g, presets["0"]));
  ["Z", "H"].forEach((g) => b.append(g, presets["0"]));
  near(a.expected(), presets["−"]);
  near(b.expected(), presets["+"]);
});
test("edits retain saved preparation, clear checkpoints, and reject active/paused edits", () => {
  const s = new GateSequence();
  s.append("H", presets["+i"]);
  s.begin(true);
  assert.equal(s.append("Z", presets["0"]), false);
  assert.equal(s.remove(0), false);
  s.pause();
  assert.equal(s.remove(0), false);
  s.finish(s.expected());
  assert.equal(s.status, "complete");
  s.append("S", presets["1"]);
  near(s.base, presets["+i"]);
  assert.equal(s.cursor, 0);
  assert.deepEqual(s.snapshots, []);
  s.remove(0);
  assert.deepEqual(s.queue, ["S"]);
});
test("replay and repeated start restore original preparation rather than compounding gates", () => {
  const s = new GateSequence();
  s.append("X", presets["0"]);
  s.begin();
  s.finish(s.expected());
  near(s.expected(), presets["1"]);
  near(s.restart(), presets["0"]);
  assert.equal(s.begin(), "X");
  near(s.expected(), presets["1"]);
  near(s.clear(), presets["0"]);
  assert.deepEqual(s.queue, []);
});
test("new preparation keeps program and limits it to eight gates", () => {
  const s = new GateSequence();
  for (let i = 0; i < MAX_GATES; i++) assert.equal(s.append("H", presets["0"]), true);
  assert.equal(s.append("H", presets["0"]), false);
  s.capture(presets["−i"]);
  near(s.expected(), presets["−i"]);
  assert.equal(s.queue.length, MAX_GATES);
  assert.equal(s.append("invalid", presets["0"]), false);
});
