import test from "node:test";
import assert from "node:assert/strict";
import {
  createExperiment,
  circuit,
  connect,
  connectProbe,
  selectConfiguration,
  setParameter,
  contactPreview,
  leadDrop,
  electricalSnapshot,
  acquisition,
  undo,
  toggleAcquisition,
} from "../src/amplifier-experiment.js";

function measured(configuration = "inverting") {
  const s = createExperiment();
  selectConfiguration(s, configuration);
  for (const [a, b] of circuit(s).wires) connect(s, a, b);
  for (const [id, target] of Object.entries({ red: "out", black: "gnd", ch1: "signal+", ch1Ground: "gnd", ch2: "out", ch2Ground: "gnd" }))
    connectProbe(s, id, target);
  setParameter(s, "powered", true);
  return s;
}
for (const configuration of ["inverting", "noninverting", "adder", "subtractor"]) {
  test(`${configuration}: held feedback lead opens circuit without changing stored wiring or history`, () => {
    const s = measured(configuration),
      snapshot = structuredClone(s);
    const i = s.wires.findIndex((w) => w.includes("rfa"));
    const held = contactPreview(s, { kind: "wire", id: i });
    assert.equal(acquisition(held).correct, false);
    assert.equal(acquisition(held).response.gain, null);
    assert.equal(held.wires.length, s.wires.length - 1);
    assert.deepEqual(s, snapshot);
    assert.equal(acquisition(contactPreview(s, null)).correct, true);
  });
}
test("holding a meter probe removes its reading; cancelling restores exactly without history", () => {
  const s = measured(),
    before = structuredClone(s),
    reading = acquisition(s).meter.rms;
  assert.ok(reading > 0);
  assert.equal(acquisition(contactPreview(s, { kind: "probe", id: "red" })).meter.rms, null);
  assert.equal(acquisition(contactPreview(s, null)).meter.rms, reading);
  assert.deepEqual(s, before);
});
test("holding a scope ground opens only that channel, while meter and other channel stay live", () => {
  const s = measured(),
    r = acquisition(contactPreview(s, { kind: "probe", id: "ch1Ground" }));
  assert.equal(r.channelStats.ch1.vpp, null);
  assert.ok(Math.abs(r.channelStats.ch2.vpp - 2) < 0.00001);
  assert.ok(r.meter.rms > 0);
});
test("held scope retains its capture and marks it stale when a probe is lifted", () => {
  const s = measured();
  toggleAcquisition(s);
  const r = acquisition(contactPreview(s, { kind: "probe", id: "ch2" }));
  assert.equal(r.stale, true);
  assert.deepEqual(r.points, s.held.points);
  assert.equal(r.response.gain, null);
});
test("rewiring either end preserves unrelated leads and produces exactly one Undo step", () => {
  for (const end of [0, 1]) {
    const s = measured(),
      before = electricalSnapshot(s),
      count = s.history.length;
    const fixed = s.wires[0][1 - end];
    assert.equal(leadDrop(s, 0, end, "out"), true);
    assert.equal(s.wires[0][1 - end], fixed);
    assert.equal(s.wires[0][end], "out");
    assert.deepEqual(s.wires.slice(1), before.wires.slice(1));
    assert.equal(s.history.length, count + 1);
    undo(s);
    assert.deepEqual(electricalSnapshot(s), before);
  }
});
test("release away from a socket unplugs only the dragged lead; Undo restores it", () => {
  const s = measured(),
    before = electricalSnapshot(s),
    count = s.history.length;
  assert.equal(leadDrop(s, 2, 1, null), true);
  assert.deepEqual(
    s.wires,
    before.wires.filter((_, i) => i !== 2)
  );
  assert.equal(s.history.length, count + 1);
  undo(s);
  assert.deepEqual(electricalSnapshot(s), before);
});
test("same socket, duplicate, self-loop and inactive targets leave wiring and history unchanged", () => {
  const s = createExperiment();
  connect(s, "signal+", "rina");
  connect(s, "signal+", "rfb");
  const before = structuredClone(s);
  for (const target of ["rina", "signal+", "rfb", "signal2+", "not-a-terminal"]) assert.equal(leadDrop(s, 0, 1, target), false);
  assert.deepEqual(s, before);
});
