import test from "node:test";
import assert from "node:assert/strict";
import { solveDC, thevenin, superposition, opamp, transient } from "../src/physics.js";

function near(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);
}

const originalNetwork = (load = 500) => [
  { id: "supply", type: "V", a: "positive", b: "gnd", value: 12 },
  { id: "r1", type: "R", a: "positive", b: "load", value: 1000 },
  { id: "r2", type: "R", a: "load", b: "gnd", value: 1000 },
  { id: "rl", type: "R", a: "load", b: "gnd", value: load },
];

test("MNA solves the original network, obeys KCL, and conserves signed power", () => {
  const components = originalNetwork();
  const result = solveDC({ components });
  assert.equal(result.ok, true, result.error);
  near(result.voltages.positive, 12);
  near(result.voltages.load, 3);
  near(result.currents.supply, -0.009);
  near(result.currents.r1, result.currents.r2 + result.currents.rl);
  near(
    components.reduce((sum, c) => sum + (result.voltages[c.a] - result.voltages[c.b]) * result.currents[c.id], 0),
    0
  );
});

test("wires merge pins regardless of wire order and report every pin voltage", () => {
  const result = solveDC({
    components: [
      { id: "v", type: "V", a: "v+", b: "v-", value: 9 },
      { id: "r", type: "R", a: "r+", b: "r-", value: 3000 },
    ],
    wires: [
      ["r-", "common"],
      ["v-", "common"],
      ["common", "gnd"],
      ["v+", "intermediate"],
      ["intermediate", "r+"],
    ],
  });
  assert.equal(result.ok, true, result.error);
  near(result.voltages["r+"], 9);
  near(result.voltages["v-"], 0);
  near(result.voltages.intermediate, 9);
  near(result.currents.r, 0.003);
});

test("current source polarity and Norton resistance produce the expected terminal voltage", () => {
  const result = solveDC({
    components: [
      { id: "i", type: "I", a: "gnd", b: "a", value: 0.012 },
      { id: "rn", type: "R", a: "a", b: "gnd", value: 500 },
      { id: "rl", type: "R", a: "a", b: "gnd", value: 500 },
    ],
  });
  assert.equal(result.ok, true, result.error);
  near(result.voltages.a, 3);
  near(result.currents.i, 0.012);
  near(result.currents.rn + result.currents.rl, 0.012);
});

test("invalid, floating, inconsistent and redundant networks fail with empty measurements", () => {
  const cases = [
    [[], /component/],
    [[{ id: "r", type: "R", a: "a", b: "b", value: 1000 }], /reference/],
    [
      [
        { id: "r", type: "R", a: "a", b: "b", value: 1000 },
        { id: "grounded", type: "R", a: "gnd", b: "gnd", value: 1 },
      ],
      /Singular/,
    ],
    [[{ id: "v", type: "V", a: "gnd", b: "gnd", value: 12 }], /Inconsistent/],
    [
      [
        { id: "v1", type: "V", a: "a", b: "gnd", value: 12 },
        { id: "v2", type: "V", a: "a", b: "gnd", value: 5 },
      ],
      /Inconsistent/,
    ],
    [
      [
        { id: "v1", type: "V", a: "a", b: "gnd", value: 12 },
        { id: "v2", type: "V", a: "a", b: "gnd", value: 12 },
      ],
      /Singular/,
    ],
    [[{ id: "i", type: "I", a: "gnd", b: "a", value: 0.01 }], /Inconsistent/],
    [[{ id: "r", type: "R", a: "a", b: "gnd", value: 0 }], /greater than zero/],
    [[{ id: "v", type: "V", a: "a", b: "gnd", value: Infinity }], /finite/],
  ];
  for (const [components, message] of cases) {
    const result = solveDC({ components });
    assert.equal(result.ok, false);
    assert.match(result.error, message);
    assert.deepEqual(result.voltages, {});
    assert.deepEqual(result.currents, {});
  }
});

test("wire-short of an ideal voltage source is diagnosed, not solved as zero volts", () => {
  const result = solveDC({ components: originalNetwork(), wires: [["positive", "gnd"]] });
  assert.equal(result.ok, false);
  assert.match(result.error, /Inconsistent/);
});

test("three load measurements match original, Thévenin and Norton networks", () => {
  const expected = [
    [250, 2, 0.008, 0.016],
    [500, 3, 0.006, 0.018],
    [1000, 4, 0.004, 0.016],
  ];
  for (const [load, voltage, current, power] of expected) {
    const direct = solveDC({ components: originalNetwork(load) });
    assert.equal(direct.ok, true, direct.error);
    for (const representation of ["original", "thevenin", "norton"]) {
      const result = thevenin({ load, representation });
      near(result.voltage, voltage);
      near(result.current, current);
      near(result.power, power);
      near(result.voltage, direct.voltages.load);
      near(result.current, direct.currents.rl);
    }
  }
});

test("load match maximizes power, including open and short circuit boundary behavior", () => {
  const optimum = thevenin();
  near(optimum.vth, 6);
  near(optimum.rth, 500);
  near(optimum.inorton, 0.012);
  near(optimum.power, optimum.pmax);
  for (const load of [1, 100, 250, 400, 499, 501, 600, 1000, 10000]) {
    assert.ok(thevenin({ load }).power < optimum.pmax);
  }
  near(thevenin({ load: Infinity }).voltage, 6);
  near(thevenin({ load: Infinity }).current, 0);
  near(thevenin({ load: 0 }).voltage, 0);
  near(thevenin({ load: 0 }).current, 0.012);
  assert.notEqual(thevenin({ representation: "thevenin", equivalentVoltage: 5 }).voltage, optimum.voltage);
});

test("superposition matches MNA for a nonzero two-source circuit", () => {
  const parameters = { v1: 12, v2: 4, r1: 2000, r2: 1000, r3: 2000 };
  const both = superposition(parameters);
  near(both.voltage, 1);
  near(both.current, 0.0005);
  near(both.contribution1, 0.0015);
  near(both.contribution2, -0.001);
  near(both.current, both.contribution1 + both.contribution2);
  const actual = solveDC({
    components: [
      { id: "v1", type: "V", a: "p", b: "gnd", value: parameters.v1 },
      { id: "v2", type: "V", a: "gnd", b: "n", value: parameters.v2 },
      { id: "r1", type: "R", a: "p", b: "a", value: parameters.r1 },
      { id: "r2", type: "R", a: "n", b: "a", value: parameters.r2 },
      { id: "r3", type: "R", a: "a", b: "gnd", value: parameters.r3 },
    ],
  });
  assert.equal(actual.ok, true, actual.error);
  near(actual.voltages.a, both.voltage);
  near(actual.currents.r3, both.current);
  const one = superposition({ ...parameters, sourceMode: "source1" });
  const two = superposition({ ...parameters, sourceMode: "source2" });
  near(one.voltage, 3);
  near(two.voltage, -2);
  near(one.power, 0.0045);
  near(two.power, 0.002);
  near(both.power, 0.0005);
  assert.notEqual(both.power, one.power + two.power);
});

test("superposition cancels and reverses branch current without turning both sources off", () => {
  const parameters = { v1: 12, r1: 2000, r2: 1000, r3: 2000 };
  near(superposition({ ...parameters, v2: 6 }).current, 0);
  assert.ok(superposition({ ...parameters, v2: 8 }).current < 0);
  near(superposition({ ...parameters, sourceMode: "none" }).voltage, 0);
});

test("op-amp gain, inversion and symmetric clipping follow chosen supply headroom", () => {
  const peakTime = 1 / 400;
  const linear = opamp({ time: peakTime });
  near(linear.gain, -2);
  near(linear.input, 1);
  near(linear.output, -2);
  near(linear.maxInput, 5.5);
  assert.equal(linear.clipped, false);
  const clipped = opamp({ amplitude: 6, time: peakTime });
  near(clipped.output, -11);
  near(clipped.peakOutput, 11);
  assert.equal(clipped.clipped, true);
  near(opamp({ amplitude: 6, time: 3 / 400 }).output, 11);
  const noninverting = opamp({ configuration: "noninverting", time: peakTime });
  near(noninverting.gain, 3);
  near(noninverting.output, 3);
  near(opamp({ configuration: "follower", time: peakTime }).output, 1);
});

test("unpowered or missing-feedback op amp does not masquerade as a working amplifier", () => {
  const unpowered = opamp({ powered: false, time: 1 / 400 });
  near(unpowered.output, 0);
  near(unpowered.peakOutput, 0);
  assert.equal(unpowered.modelState, "powered-off");
  const openLoop = opamp({ feedback: false, time: 1 / 400 });
  near(openLoop.output, -11);
  assert.equal(openLoop.modelState, "open-loop");
  near(openLoop.maxInput, 0);
});

test("RC response preserves capacitor voltage and reaches 63.2% after one time constant", () => {
  const parameters = { kind: "RC", resistance: 1000, capacitance: 0.0001, source: 5 };
  const initial = transient(parameters);
  near(initial.tau, 0.1);
  near(initial.voltage, 0);
  near(initial.current, 0.005);
  const oneTau = transient({ ...parameters, time: initial.tau });
  near(oneTau.voltage / 5, 1 - Math.exp(-1));
  near(oneTau.voltage + parameters.resistance * oneTau.current, 5);
  near(oneTau.energy, 0.5 * parameters.capacitance * oneTau.voltage ** 2);
  const afterSwitch = transient({ ...parameters, initial: oneTau.storageValue, charging: false });
  near(afterSwitch.storageValue, oneTau.storageValue);
  assert.ok(afterSwitch.current < 0);
  assert.ok(
    transient({ ...parameters, initial: 5, charging: false, time: 0.1 }).energy < transient({ ...parameters, initial: 5, charging: false }).energy
  );
});

test("RL response preserves inductor current; discharge voltage reverses through its return path", () => {
  const parameters = { kind: "RL", resistance: 1000, inductance: 0.1, source: 5 };
  const initial = transient(parameters);
  near(initial.tau, 0.0001);
  near(initial.current, 0);
  near(initial.voltage, 5);
  const oneTau = transient({ ...parameters, time: initial.tau });
  near(oneTau.current / 0.005, 1 - Math.exp(-1));
  near(oneTau.voltage + parameters.resistance * oneTau.current, 5);
  near(oneTau.energy, 0.5 * parameters.inductance * oneTau.current ** 2);
  const afterSwitch = transient({ ...parameters, initial: oneTau.storageValue, charging: false });
  near(afterSwitch.current, oneTau.current);
  assert.ok(afterSwitch.voltage < 0);
});

test("higher series resistance slows RC but speeds RL, and long-term energy is correct", () => {
  assert.ok(transient({ resistance: 2000 }).tau > transient({ resistance: 1000 }).tau);
  assert.ok(transient({ kind: "RL", resistance: 2000 }).tau < transient({ kind: "RL", resistance: 1000 }).tau);
  near(transient({ time: 10 }).energy, 0.5 * 0.0001 * 25);
  near(transient({ kind: "RL", time: 1 }).energy, 0.5 * 0.1 * 0.005 ** 2);
});

test("teaching models reject invalid parameters instead of creating plausible outputs", () => {
  assert.throws(() => thevenin({ load: -1 }), /negative/);
  assert.throws(() => superposition({ r1: 0 }), /greater than zero/);
  assert.throws(() => superposition({ sourceMode: "opened" }), /Source mode/);
  assert.throws(() => opamp({ amplitude: -1 }), /negative/);
  assert.throws(() => transient({ capacitance: 0 }), /greater than zero/);
  assert.throws(() => transient({ time: -1 }), /negative/);
});
