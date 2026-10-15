import test from "node:test";
import assert from "node:assert/strict";
import {
  CONFIGURATIONS,
  createExperiment,
  circuit,
  selectConfiguration,
  setParameter,
  connect,
  connectProbe,
  evaluate,
  electricalSnapshot,
  undo,
  matchSubtractor,
  toggleHints,
  advanceHint,
} from "../src/amplifier-experiment.js";
import { scopeAxes, displayNumber } from "../src/amplifier-display.js";
const near = (a, b, t = 1e-5) => assert.ok(Number.isFinite(a) && Math.abs(a - b) < t, `${a} != ${b}`);
function build(configuration, params = {}) {
  const s = createExperiment();
  selectConfiguration(s, configuration);
  for (const [k, v] of Object.entries(params)) setParameter(s, k, v);
  for (const [a, b] of circuit(s).wires) connect(s, a, b);
  setParameter(s, "powered", true);
  connectProbe(s, "black", "gnd");
  connectProbe(s, "red", "out");
  return s;
}
function node(s, id) {
  connectProbe(s, "red", id);
  return evaluate(s).meter.mean;
}
test("all configurations remain manually wired, and hints never alter their electrical history", () => {
  for (const configuration of CONFIGURATIONS) {
    const s = build(configuration);
    assert.ok(
      Object.entries(s.probes)
        .filter(([k]) => k.startsWith("ch"))
        .every(([, v]) => v === null)
    );
    connect(s, "out", "signal+");
    const before = electricalSnapshot(s),
      history = structuredClone(s.history);
    for (let i = 0; i < 24; i++) {
      toggleHints(s, i % 2 === 0);
      advanceHint(s);
    }
    assert.deepEqual(electricalSnapshot(s), before);
    assert.deepEqual(s.history, history);
    assert.equal(evaluate(s).live, false);
  }
});
test("non-inverting clipped pin voltages retain resistor-divider behavior", () => {
  const s = build("noninverting", { waveform: "dc", amplitude: 0.5 });
  near(node(s, "out"), 1.5);
  near(node(s, "op-"), 0.5);
  near(node(s, "op+"), 0.5);
  setParameter(s, "amplitude", 4);
  near(node(s, "out"), 11);
  near(node(s, "op-"), 11 / 3);
  near(node(s, "op+"), 4);
  assert.equal(evaluate(s).clipped, true);
});
test("weighted adder changes one resistor without linking the other input", () => {
  const s = build("adder", { waveform: "dc", rin: 10000, rf: 20000, rin2: 40000, amplitude: 0.2, amplitude2: 0.4 });
  near(node(s, "out"), -0.6);
  const before = electricalSnapshot(s);
  setParameter(s, "rin", 20000);
  near(node(s, "out"), -0.4);
  assert.equal(s.params.rin2, 40000);
  assert.equal(s.params.amplitude2, 0.4);
  undo(s);
  assert.deepEqual(electricalSnapshot(s), before);
  assert.equal(evaluate(s).response.gain, null);
});
test("equal shared waveform inputs can cancel without reporting intrinsic zero gain", () => {
  const s = build("subtractor", { rin: 10000, rf: 20000, rin2: 30000, rf2: 60000, amplitude: 1.5, amplitude2: 1.5 });
  near(evaluate(s).meter.rms, 0);
  assert.equal(evaluate(s).response.gain, null);
  assert.equal(evaluate(s).transfer.vin1, -2);
  assert.equal(evaluate(s).transfer.vin2, 2);
});
test("general unmatched difference amplifier follows all four independent resistors", () => {
  const s = build("subtractor", { waveform: "dc", rin: 10000, rf: 20000, rin2: 30000, rf2: 10000, amplitude: 0.2, amplitude2: 0.8 });
  near(node(s, "out"), 0.2);
  near(node(s, "op+"), 0.2);
  near(node(s, "op-"), 0.2);
  setParameter(s, "amplitude", 1);
  setParameter(s, "amplitude2", 1);
  near(node(s, "out"), -1.25);
});
test("explicit matching changes only R4 and is one undoable operation", () => {
  const s = build("subtractor", { rin: 10000, rf: 20000, rin2: 30000, rf2: 10000 });
  const before = electricalSnapshot(s),
    n = s.history.length;
  assert.equal(matchSubtractor(s), true);
  assert.equal(s.params.rf2, 60000);
  assert.deepEqual(s.params, { ...before.params, rf2: 60000 });
  assert.deepEqual(s.wires, before.wires);
  assert.deepEqual(s.probes, before.probes);
  assert.equal(s.history.length, n + 1);
  undo(s);
  assert.deepEqual(electricalSnapshot(s), before);
  setParameter(s, "rf", 100000);
  assert.equal(matchSubtractor(s), false);
  assert.equal(s.params.rf2, 10000);
});
test("configuration replacement and Undo restore every directed transition without cached wiring", () => {
  for (const from of CONFIGURATIONS)
    for (const to of CONFIGURATIONS) {
      if (from === to) continue;
      const s = build(from, { amplitude: 1.7 }),
        before = electricalSnapshot(s),
        n = s.history.length;
      selectConfiguration(s, to);
      assert.equal(s.params.powered, false);
      assert.equal(s.wires.length, 0);
      assert.ok(Object.values(s.probes).every((v) => v === null));
      assert.equal(s.history.length, n + 1);
      undo(s);
      assert.deepEqual(electricalSnapshot(s), before);
    }
});
test("conflicting ideal sources invalidate all samples, including sine zero crossings", () => {
  const s = createExperiment();
  selectConfiguration(s, "adder");
  connect(s, "signal-", "gnd");
  connect(s, "signal+", "signal2+");
  connectProbe(s, "ch1", "signal+");
  connectProbe(s, "ch1Ground", "gnd");
  connectProbe(s, "red", "signal+");
  connectProbe(s, "black", "signal-");
  const r = evaluate(s);
  assert.equal(r.points.ch1.length, 0);
  assert.equal(r.meter.rms, null);
  assert.match(r.diagnostic.text, /Conflicting ideal-source/);
  setParameter(s, "amplitude2", s.params.amplitude);
  near(evaluate(s).meter.rms, Math.SQRT1_2 / 2);
});
test("powered supply and generator share a source component only when their full voltage constraints agree", () => {
  const s = createExperiment();
  setParameter(s, "powered", true);
  connect(s, "signal-", "plus-");
  connect(s, "signal+", "plus+");
  connectProbe(s, "red", "plus+");
  connectProbe(s, "black", "plus-");
  assert.equal(evaluate(s).meter.mean, null);
  setParameter(s, "waveform", "dc");
  setParameter(s, "amplitude", 12);
  near(evaluate(s).meter.mean, 12);
  setParameter(s, "amplitude", 11);
  assert.equal(evaluate(s).meter.mean, null);
});
test("scope display scales retain readable distinct time ticks through the frequency range", () => {
  for (const duration of [0.2, 0.002, 0.00002]) {
    const a = scopeAxes({
      duration,
      points: {
        ch1: [
          [0, -0.5],
          [duration, 0.5],
        ],
        ch2: [],
      },
    });
    assert.equal(a.voltsPerDivision, 0.2);
    assert.equal(new Set([0, 1, 2].map((i) => displayNumber((duration * a.timeFactor * i) / 2))).size, 3);
  }
  assert.equal(scopeAxes({ duration: 0.00002, points: {} }).timeUnit, "µs");
});
