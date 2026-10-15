import test from "node:test";
import assert from "node:assert/strict";
import {
  createExperiment,
  electricalSnapshot,
  circuit,
  connect,
  connectProbe,
  setParameter,
  selectConfiguration,
  selectTerminal,
  removeLead,
  undo,
  reset,
  hint,
  advanceHint,
  toggleHints,
  evaluate,
  acquisition,
  toggleAcquisition,
  beginAdjustment,
  endAdjustment,
} from "../src/amplifier-experiment.js";
const near = (a, b, t = 1e-5) => assert.ok(Number.isFinite(a) && Math.abs(a - b) < t, `${a} != ${b}`);
const complete = (s = createExperiment()) => {
  for (const [a, b] of circuit(s).wires) connect(s, a, b);
  return s;
};
const measured = () => {
  const s = complete();
  for (const [k, v] of Object.entries({ red: "out", black: "gnd", ch1: "signal+", ch1Ground: "gnd", ch2: "out", ch2Ground: "gnd" }))
    connectProbe(s, k, v);
  setParameter(s, "powered", true);
  return s;
};

test("one manual experiment starts empty and off, with no cached modes", () => {
  const s = createExperiment();
  assert.equal(s.params.powered, false);
  assert.deepEqual(s.wires, []);
  assert.ok(Object.values(s.probes).every((v) => v === null));
  assert.equal("mode" in s, false);
  assert.equal(evaluate(s).response.gain, null);
});
test("all hint operations preserve complete electrical state and undo history", () => {
  for (const s of [createExperiment(), complete(), measured()]) {
    const before = electricalSnapshot(s),
      history = structuredClone(s.history);
    for (let i = 0; i < 30; i++) {
      hint(s);
      advanceHint(s);
      toggleHints(s, i % 2 === 0);
    }
    assert.deepEqual(electricalSnapshot(s), before);
    assert.deepEqual(s.history, history);
  }
});
test("selected endpoints require explicit Connect; arbitrary wrong leads remain wrong", () => {
  const s = createExperiment();
  selectTerminal(s, "signal+");
  selectTerminal(s, "out");
  assert.equal(s.wires.length, 0);
  assert.equal(connect(s, s.selection.from, s.selection.to), true);
  assert.deepEqual(s.wires, [["signal+", "out"]]);
  assert.equal(evaluate(s).diagnostic.kind, "wrong");
  for (let i = 0; i < 10; i++) advanceHint(s);
  assert.deepEqual(s.wires, [["signal+", "out"]]);
  assert.equal(evaluate(s).response.gain, null);
});
test("a complete powered circuit does not silently connect instruments", () => {
  const s = complete();
  setParameter(s, "powered", true);
  const r = evaluate(s);
  assert.equal(r.live, true);
  assert.equal(r.meter.mean, null);
  assert.equal(r.response.gain, null);
  assert.equal(r.points.ch1.length, 0);
  assert.equal(r.points.ch2.length, 0);
  assert.ok(Object.values(s.probes).every((v) => v === null));
});
test("inverting 1 Vpp sine gives -2 gain, 2 Vpp output, 0.7071 Vrms and inverted phase", () => {
  const s = measured(),
    r = evaluate(s);
  near(r.response.gain, -2);
  near(r.response.inputStats.vpp, 1);
  near(r.response.outputStats.vpp, 2);
  near(r.meter.rms, Math.SQRT1_2);
  assert.equal(r.response.phase, "inverted");
  assert.equal(r.points.ch1.length, r.points.ch2.length);
  assert.deepEqual(
    r.points.ch1.map((p) => p[0]),
    r.points.ch2.map((p) => p[0])
  );
});
test("probe placement works before wiring, missing references stay missing, probe reversal gives signed DC", () => {
  const s = createExperiment();
  connectProbe(s, "red", "out");
  connectProbe(s, "black", "gnd");
  complete(s);
  setParameter(s, "powered", true);
  setParameter(s, "waveform", "dc");
  setParameter(s, "amplitude", -0.5);
  near(evaluate(s).meter.mean, 1);
  connectProbe(s, "red", "gnd");
  connectProbe(s, "black", "out");
  near(evaluate(s).meter.mean, -1);
  connectProbe(s, "black", null);
  assert.equal(evaluate(s).meter.mean, null);
  undo(s);
  near(evaluate(s).meter.mean, -1);
});
test("wrong scope ground leaves no trace and no measured gain", () => {
  const s = measured();
  connectProbe(s, "ch2Ground", "signal+");
  const r = evaluate(s);
  assert.equal(r.points.ch2.length, 0);
  assert.equal(r.response.gain, null);
  undo(s);
  near(evaluate(s).response.gain, -2);
});
test("Rf physical gesture is one undoable change sharing the exact numeric parameter", () => {
  const s = measured(),
    before = beginAdjustment(s),
    n = s.history.length;
  setParameter(s, "rf", 30000, false);
  setParameter(s, "rf", 40000, false);
  endAdjustment(s, before);
  assert.equal(s.history.length, n + 1);
  near(evaluate(s).response.gain, -4);
  undo(s);
  assert.deepEqual(electricalSnapshot(s), before);
  near(evaluate(s).response.gain, -2);
});
test("remove and undo preserve connections, probes, values and supply", () => {
  const s = measured(),
    before = electricalSnapshot(s);
  removeLead(s, 0);
  assert.equal(evaluate(s).live, false);
  undo(s);
  assert.deepEqual(electricalSnapshot(s), before);
  near(evaluate(s).response.gain, -2);
});
test("reset is one undoable action and never restores fully wired defaults", () => {
  const s = measured(),
    before = electricalSnapshot(s),
    n = s.history.length;
  reset(s);
  assert.equal(s.history.length, n + 1);
  assert.equal(s.params.powered, false);
  assert.equal(s.wires.length, 0);
  assert.ok(Object.values(s.probes).every((v) => v === null));
  undo(s);
  assert.deepEqual(electricalSnapshot(s), before);
});
test("configuration switch clears the live experiment in one undo and cannot retrieve hidden saved wiring", () => {
  const s = measured(),
    before = electricalSnapshot(s),
    n = s.history.length;
  selectConfiguration(s, "noninverting");
  assert.equal(s.history.length, n + 1);
  assert.equal(s.params.powered, false);
  assert.deepEqual(s.wires, []);
  assert.ok(Object.values(s.probes).every((v) => v === null));
  undo(s);
  assert.deepEqual(electricalSnapshot(s), before);
  selectConfiguration(s, "noninverting");
  selectConfiguration(s, "inverting");
  assert.deepEqual(s.wires, []);
  assert.ok(Object.values(s.probes).every((v) => v === null));
});
test("clipping suppresses linear gain at all rails and recovers without repairing connections", () => {
  const s = measured();
  setParameter(s, "rf", 100000);
  setParameter(s, "rin", 5000);
  setParameter(s, "amplitude", 2);
  for (const rail of [8, 12, 15]) {
    setParameter(s, "rail", rail);
    const r = evaluate(s);
    assert.equal(r.clipped, true);
    assert.equal(r.response.gain, null);
    near(r.response.outputStats.peak, rail - 1);
  }
  setParameter(s, "amplitude", 0.2);
  near(evaluate(s).response.gain, -20);
});
test("Hold retains the capture but marks changed settings stale; Run reacquires", () => {
  const s = measured();
  toggleAcquisition(s);
  setParameter(s, "rf", 30000);
  let r = acquisition(s);
  assert.equal(r.stale, true);
  assert.equal(r.response.gain, null);
  near(r.response.outputStats.vpp, 2);
  toggleAcquisition(s);
  r = acquisition(s);
  near(r.response.gain, -3);
  near(r.response.outputStats.vpp, 3);
});
test("invalid values and zero input do not manufacture valid gain", () => {
  const s = measured(),
    before = electricalSnapshot(s);
  for (const [k, v] of [
    ["rin", 0],
    ["rf", -1],
    ["rail", 9],
    ["frequency", 0],
    ["amplitude", NaN],
    ["waveform", "noise"],
  ])
    assert.equal(setParameter(s, k, v), false);
  assert.deepEqual(electricalSnapshot(s), before);
  setParameter(s, "amplitude", 0);
  assert.equal(evaluate(s).response.gain, null);
  near(evaluate(s).theoreticalGain, -2);
});

test("scope Hold never freezes the independent meter or makes a removed probe read live", () => {
  const s = measured();
  toggleAcquisition(s);
  connectProbe(s, "red", null);
  let r = acquisition(s);
  assert.equal(r.meter.rms, null);
  assert.equal(r.stale, false);
  near(r.response.gain, -2);
  connectProbe(s, "red", "out");
  near(acquisition(s).meter.rms, Math.SQRT1_2);
  setParameter(s, "powered", false);
  r = acquisition(s);
  assert.equal(r.meter.rms, null);
  assert.equal(r.live, false);
  assert.equal(r.stale, true);
});

test("each valid scope channel has independent statistics; paired capture is required only for gain", () => {
  const s = complete();
  setParameter(s, "powered", true);
  connectProbe(s, "ch1", "signal+");
  connectProbe(s, "ch1Ground", "gnd");
  let r = evaluate(s);
  assert.ok(r.points.ch1.length);
  near(r.channelStats.ch1.vpp, 1);
  assert.equal(r.channelStats.ch2.vpp, null);
  assert.equal(r.response.gain, null);
  connectProbe(s, "ch2", "out");
  connectProbe(s, "ch2Ground", "gnd");
  near(evaluate(s).channelStats.ch2.vpp, 2);
  connectProbe(s, "ch1Ground", "vp");
  r = evaluate(s);
  assert.equal(r.points.ch1.length, 0);
  assert.equal(r.channelStats.ch1.vpp, null);
  near(r.channelStats.ch2.vpp, 2);
  assert.match(r.channelErrors.ch1, /ground/);
  assert.match(r.diagnostic.text, /CH1 ground/);
});
test("multimeter power affects its own acquisition without staling a held scope", () => {
  const s = measured();
  toggleAcquisition(s);
  setParameter(s, "meterOn", false);
  const r = acquisition(s);
  assert.equal(r.meter.rms, null);
  assert.equal(r.stale, false);
  near(r.response.gain, -2);
  undo(s);
  near(acquisition(s).meter.rms, Math.SQRT1_2);
});

test("passive Rin and Rf accept either terminal orientation and retain sensed socket voltages", () => {
  for (let mask = 0; mask < 4; mask++) {
    const s = createExperiment(),
      swap = {};
    for (const [i, [a, b]] of [
      ["rina", "rinb"],
      ["rfa", "rfb"],
    ].entries())
      if (mask & (1 << i)) {
        swap[a] = b;
        swap[b] = a;
      }
    for (const [a, b] of circuit(s).wires) connect(s, swap[a] || a, swap[b] || b);
    setParameter(s, "powered", true);
    setParameter(s, "waveform", "dc");
    setParameter(s, "amplitude", 0.5);
    const before = electricalSnapshot(s);
    assert.equal(evaluate(s).live, true);
    assert.equal(evaluate(s).diagnostic.kind, "ready");
    hint(s);
    assert.deepEqual(electricalSnapshot(s), before);
    connectProbe(s, "black", "gnd");
    for (const [id, v] of [
      ["out", -1],
      [swap.rina || "rina", 0.5],
      [swap.rinb || "rinb", 0],
      [swap.rfa || "rfa", 0],
      [swap.rfb || "rfb", -1],
    ]) {
      connectProbe(s, "red", id);
      near(evaluate(s).meter.mean, v);
    }
    connect(s, "signal+", "out");
    assert.equal(evaluate(s).live, false);
    assert.equal(evaluate(s).diagnostic.kind, "wrong");
  }
});
test("independent source probes work before amplifier completion without inventing floating node voltages", () => {
  const s = createExperiment();
  setParameter(s, "powered", true);
  connectProbe(s, "red", "plus+");
  connectProbe(s, "black", "plus-");
  near(evaluate(s).meter.mean, 12);
  assert.equal(evaluate(s).live, false);
  connectProbe(s, "red", "minus-");
  near(evaluate(s).meter.mean, -12);
  connectProbe(s, "black", "gnd");
  assert.equal(evaluate(s).meter.mean, null);
  connect(s, "plus-", "gnd");
  near(evaluate(s).meter.mean, -12);
  connectProbe(s, "red", "signal+");
  connectProbe(s, "black", "signal-");
  near(evaluate(s).meter.rms, Math.SQRT1_2 / 2);
  connect(s, "signal-", "gnd");
  connectProbe(s, "ch1", "signal+");
  connectProbe(s, "ch1Ground", "gnd");
  near(evaluate(s).channelStats.ch1.vpp, 1);
  assert.equal(evaluate(s).response.gain, null);
  connectProbe(s, "red", "out");
  assert.equal(evaluate(s).meter.mean, null);
  connect(s, "plus+", "plus-");
  connectProbe(s, "red", "plus+");
  connectProbe(s, "black", "plus-");
  assert.equal(evaluate(s).meter.mean, null);
});

test("DC frequency is inert across all model entries and switching back to AC restores the stored frequency", () => {
  const s = createExperiment();
  setParameter(s, "frequency", 2400);
  setParameter(s, "waveform", "dc");
  const before = electricalSnapshot(s),
    n = s.history.length;
  assert.equal(setParameter(s, "frequency", 6000), false);
  assert.equal(setParameter(s, "frequency", 12000, false), false);
  assert.deepEqual(electricalSnapshot(s), before);
  assert.equal(s.history.length, n);
  setParameter(s, "waveform", "sine");
  assert.equal(s.params.frequency, 2400);
  undo(s);
  assert.deepEqual(electricalSnapshot(s), before);
});
