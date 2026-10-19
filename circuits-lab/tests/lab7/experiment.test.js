import test from "node:test";
import assert from "node:assert/strict";
import { TOPOLOGY } from "../../src/lab7/sim/circuit.js";
import { PHASES, nextAction, guidance } from "../../src/lab7/sim/guide.js";
import {
  createExperiment,
  readings,
  connect,
  placeProbe,
  setPower,
  setConfiguration,
  setResistor,
  setSource,
  removeLead,
  undo,
} from "../../src/lab7/sim/experiment.js";

const close = (actual, expected, tolerance, what) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${what}: got ${actual}, expected ${expected} ±${tolerance}`);

/** Wire the selected configuration correctly, then probe it properly. */
function buildAndProbe(state) {
  for (const node of TOPOLOGY[state.configuration]) {
    for (const terminal of node.terminals.slice(1)) connect(state, node.terminals[0], terminal);
  }
  placeProbe(state, "scope.ch1", state.configuration === "noninverting" ? "gen.out1" : "rin.a");
  placeProbe(state, "scope.ch2", "u1.6");
  placeProbe(state, "scope.ch1gnd", "board.gnd");
  placeProbe(state, "scope.ch2gnd", "board.gnd");
  placeProbe(state, "meter.v", "u1.6");
  placeProbe(state, "meter.com", "board.gnd");
  setPower(state, true);
  return state;
}

test("a finished inverting bench measures the gain its resistors predict", () => {
  const state = buildAndProbe(createExperiment());
  const r = readings(state);
  assert.equal(r.check.complete, true, JSON.stringify(r.check.missing));
  assert.equal(r.clipped, false);
  close(r.measured.gain, -2, 5e-3, "measured gain");
  assert.equal(r.measured.phase, "inverted");
  close(r.theory.value, -2, 1e-12, "theoretical gain");
  assert.equal(r.theory.agreement.agrees, true);
  close(r.scope.ch2.vpp, 2, 5e-3, "Vout peak-to-peak");
});

test("the meter reads what is between its two tips, in the mode it states", () => {
  const state = buildAndProbe(createExperiment());
  setSource(state, 0, { waveform: "sine", amplitude: 1 });
  const ac = readings({ ...state, meterMode: "ac" });
  close(ac.meter.value, 1 / Math.SQRT2, 5e-3, "true RMS of a 2 Vpp output");
  assert.equal(ac.meter.unit, "V RMS");

  // Move the meter onto the common node: it must now read zero, not Vout.
  placeProbe(state, "meter.v", "board.gnd");
  close(readings(state).meter.value, 0, 1e-9, "a meter on common reads zero");
});

test("probing the summing junction shows the virtual ground", () => {
  const state = buildAndProbe(createExperiment());
  placeProbe(state, "scope.ch2", "u1.2");
  const r = readings(state);
  close(r.scope.ch2.vpp, 0, 1e-9, "the inverting input sits at virtual ground");
});

test("the non-inverting circuit holds its summing junction at Vin", () => {
  const state = createExperiment();
  setConfiguration(state, "noninverting");
  buildAndProbe(state);
  placeProbe(state, "scope.ch2", "u1.2");
  const r = readings(state);
  close(r.scope.ch2.vpp, 1, 5e-3, "−IN follows +IN, which is Vin");
});

test("every configuration reaches a complete circuit and a sensible gain", () => {
  for (const configuration of Object.keys(TOPOLOGY)) {
    const state = createExperiment();
    setConfiguration(state, configuration);
    buildAndProbe(state);
    const r = readings(state);
    assert.equal(r.check.complete, true, `${configuration}: ${JSON.stringify(r.check.missing)}`);
    assert.equal(r.clipped, false, `${configuration} should not clip at defaults`);
    // Two-input circuits have no single gain, and must not pretend otherwise.
    if (r.coefficients.inputs === 2) assert.equal(r.theory.value, null, `${configuration} must not report one gain`);
    else assert.ok(Number.isFinite(r.theory.value));
  }
});

test("an over-driven output refuses to report a gain and says why", () => {
  const state = buildAndProbe(createExperiment());
  // Gain of 5 on a 8 Vpp input wants ±20 V, well past the ±10.5 V the rails allow.
  setResistor(state, "rf", 50000);
  setSource(state, 0, { amplitude: 8 });
  const r = readings(state);
  assert.equal(r.clipped, true);
  assert.equal(r.measured.gain, null);
  assert.match(r.measured.error, /saturated/i);
  assert.equal(r.theory.agreement.agrees, null);
});

test("turning Rf changes the measured gain, and theory follows it", () => {
  const state = buildAndProbe(createExperiment());
  setResistor(state, "rf", 50000);
  const r = readings(state);
  close(r.theory.value, -5, 1e-12, "theory tracks the new Rf");
  close(r.measured.gain, -5, 5e-3, "measurement tracks the new Rf");
  assert.equal(r.theory.agreement.agrees, true);
});

test("an unfinished circuit has no measured gain but still names the next step", () => {
  const state = createExperiment();
  const r = readings(state);
  assert.equal(r.check.complete, false);
  assert.equal(r.measured.gain, null);
  assert.equal(r.guidance.next.kind, "connect");
  assert.ok(r.guidance.next.text.length > 0);
});

// ---- guided mode ----------------------------------------------------------

test("guided mode offers exactly one action, and one pair of highlights", () => {
  const state = createExperiment();
  for (let i = 0; i < 40; i += 1) {
    const action = nextAction(state);
    assert.ok(action.text.length > 0, "every step explains itself");
    assert.ok(action.highlight.length <= 2, "never more than one connection highlighted");
    if (action.kind === "connect") connect(state, action.highlight[0], action.highlight[1]);
    else if (action.kind === "power") setPower(state, true);
    else if (action.kind === "probe") break;
    else break;
  }
  assert.equal(readings(state).check.complete, true, "following the guide alone builds a correct circuit");
});

test("following guided mode end to end reaches Understand", () => {
  const state = createExperiment();
  const probeNode = { "scope.ch1": "rin.a", "scope.ch1gnd": "board.gnd", "scope.ch2": "u1.6", "scope.ch2gnd": "board.gnd", "meter.v": "u1.6", "meter.com": "board.gnd" };
  for (let i = 0; i < 60; i += 1) {
    const action = nextAction(state);
    if (action.kind === "connect") connect(state, action.highlight[0], action.highlight[1]);
    else if (action.kind === "power") setPower(state, true);
    else if (action.kind === "probe") placeProbe(state, action.probe, probeNode[action.probe]);
    else break;
  }
  const g = guidance(state);
  assert.equal(g.next.kind, "compare");
  assert.equal(g.phase.id, "understand");
  assert.equal(g.phase.step, PHASES.length);
  close(readings(state).measured.gain, -2, 5e-3, "the guided build measures correctly");
});

test("a short outranks everything else in the guidance", () => {
  const state = buildAndProbe(createExperiment());
  connect(state, "u1.6", "board.gnd");
  const action = nextAction(state);
  assert.equal(action.fault, true);
  assert.equal(action.kind, "fix");
  assert.match(action.text, /Remove the lead/);
  assert.deepEqual(action.highlight, [], "a fault highlights nothing to connect");
});

test("the four numbered groups are always present, in the brief's order", () => {
  const g = guidance(createExperiment());
  assert.deepEqual(
    g.groups.map((x) => x.n),
    [1, 2, 3, 4]
  );
  assert.deepEqual(
    g.groups.map((x) => x.title),
    ["Power supply", "Operational amplifier", "Component controls", "Input signal"]
  );
});

// ---- state ----------------------------------------------------------------

test("undo restores the previous state, including wiring", () => {
  const state = createExperiment();
  connect(state, "supply.pos", "u1.7");
  const before = state.leads.length;
  connect(state, "supply.neg", "u1.4");
  assert.equal(state.leads.length, before + 1);
  undo(state);
  assert.equal(state.leads.length, before);
});

test("changing configuration clears leads, because it is a different circuit", () => {
  const state = buildAndProbe(createExperiment());
  assert.ok(state.leads.length > 0);
  setConfiguration(state, "adder");
  assert.equal(state.leads.length, 0);
  assert.equal(Object.values(state.probes).every((p) => p === null), true);
  undo(state);
  assert.equal(state.configuration, "inverting");
  assert.ok(state.leads.length > 0, "undo brings the wiring back");
});

test("settings are clamped to what the hardware offers", () => {
  const state = createExperiment();
  setResistor(state, "rf", 10_000_000);
  assert.equal(state.resistors.rf, 100000);
  setResistor(state, "rf", 1);
  assert.equal(state.resistors.rf, 1000);
  setSource(state, 0, { frequency: 10_000_000 });
  assert.equal(state.sources[0].frequency, 100000);
  setSource(state, 0, { amplitude: -5 });
  assert.equal(state.sources[0].amplitude, 5, "an AC amplitude is a magnitude");
});

test("removing a lead opens the circuit again", () => {
  const state = buildAndProbe(createExperiment());
  assert.equal(readings(state).check.complete, true);
  // Remove a lead the circuit depends on; the edge hop at index 0 is optional.
  removeLead(state, state.leads.findIndex((lead) => lead.to === "u1.7"));
  assert.equal(readings(state).check.complete, false);
});
