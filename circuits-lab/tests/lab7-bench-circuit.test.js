import test from "node:test";
import assert from "node:assert/strict";
import { CONFIGS, LEADS, buildModel, initialState, measure, netOf, steps, strayJumpers, theory } from "../lab7-bench/circuit.js";

// wire a configuration exactly as the guide asks, then power it
function built(config, changes = {}) {
  const state = { ...initialState(), config, ...changes };
  state.jumpers = CONFIGS[config].jumpers.map((j) => ({ id: j.id, a: j.a, b: j.b }));
  for (const id of Object.keys(state.leads)) if (id !== "gen2" || CONFIGS[config].usesVin2) state.leads[id] = LEADS[id].post;
  state.supply = { ...state.supply, on: true, ...(changes.supply ?? {}) };
  state.probes = { ch1: "vin1", ch2: "vout1", red: "vout2", black: "rg20" };
  return state;
}
const gainOf = (state) => {
  const model = buildModel(state);
  const vin = measure(model, "postin", state);
  const vout = measure(model, "postout", state);
  const sign = Math.sign(vin.values.reduce((s, v, i) => s + (v - vin.mean) * (vout.values[i] - vout.mean), 0));
  return (sign * vout.pp) / vin.pp;
};

test("hole ids map to strips, rails and terminals", () => {
  assert.equal(netOf("a3"), "T3");
  assert.equal(netOf("e3"), "T3");
  assert.equal(netOf("f3"), "B3");
  assert.equal(netOf("rg4"), "GND");
  assert.equal(netOf("rh29"), "GND");
  assert.equal(netOf("postin"), "VIN");
  assert.equal(netOf("vout2"), "VOUT");
});

test("the inverting amplifier measures −Rf/Rin", () => {
  assert.ok(Math.abs(gainOf(built("inverting")) - -2) < 0.01);
  assert.ok(Math.abs(gainOf(built("inverting", { rin: 4700, rf: 47000 })) - -10) < 0.01);
});

test("the non-inverting amplifier measures 1 + Rf/Rin", () => {
  assert.ok(Math.abs(gainOf(built("noninverting")) - 3) < 0.01);
});

test("the summing amplifier adds both inputs through Rf", () => {
  const state = built("adder", { gen: { wave: "dc", amp: 1, freq: 1000, dc2: 2 } });
  const vout = buildModel(state).at("postout", 0);
  // −20k (1/10k + 2/10k) = −6 V
  assert.ok(Math.abs(vout - -6) < 0.01);
  assert.ok(Math.abs(theory(state).expect(1) - -6) < 1e-9);
});

test("the difference amplifier outputs (Rf/Rin)(Vin2 − Vin) when matched", () => {
  const state = built("subtractor", { gen: { wave: "dc", amp: 1, freq: 1000, dc2: 3 } });
  const vout = buildModel(state).at("postout", 0);
  assert.ok(Math.abs(vout - 4) < 0.01); // 2 × (3 − 1)
});

test("the output clips about 1.5 V inside the selected rails", () => {
  const state = built("inverting", { rin: 1000, rf: 100000, supply: { level: 8 } });
  const out = measure(buildModel(state), "postout", state);
  assert.ok(Math.abs(Math.max(...out.values) - 6.5) < 0.01);
  assert.ok(Math.abs(Math.min(...out.values) - -6.5) < 0.01);
});

test("an unpowered op-amp does not amplify; Vin only leaks through Rin and Rf", () => {
  const state = built("inverting", { supply: { on: false } });
  const model = buildModel(state);
  const vin = measure(model, "postin", state);
  const out = measure(model, "postout", state);
  assert.ok(Math.abs(out.pp - vin.pp) < 0.01);
});

test("a missing jumper breaks the circuit the way the hardware would", () => {
  const state = built("inverting");
  state.jumpers = state.jumpers.filter((j) => j.id !== "feedback");
  const out = measure(buildModel(state), "postout", state);
  // open loop: the output slams into the rails
  assert.ok(out.pp > 20);
});

test("a jumper from +V to ground trips the supply instead of solving nonsense", () => {
  const state = built("inverting");
  state.jumpers.push({ id: "oops", a: "rp3", b: "rg3" });
  const model = buildModel(state);
  assert.match(model.short, /\+V is shorted to ground/);
  assert.equal(model.supplyOn, false);
  assert.deepEqual(strayJumpers(state).map((j) => j.id), ["oops"]);
});

test("steps complete in order as the circuit is built", () => {
  const empty = { ...initialState() };
  assert.equal(steps(empty).findIndex((s) => !s.done), 0);
  const done = built("noninverting");
  assert.ok(steps(done).every((s) => s.done));
  // any hole in the same strip satisfies a jumper step
  const moved = built("inverting");
  moved.jumpers = moved.jumpers.map((j) => (j.id === "in" ? { ...j, b: "j9" } : j));
  assert.ok(steps(moved).find((s) => s.id === "in").done);
});

test("the adder and subtractor ask for the second input lead", () => {
  assert.ok(steps(initialState()).every((s) => s.id !== "gen2"));
  assert.ok(steps({ ...initialState(), config: "adder" }).some((s) => s.id === "gen2"));
});

test("the default Rin and Rf sit on detents of the potentiometers", async () => {
  const { POT_VALUES } = await import("../lab7-bench/circuit.js");
  const s = initialState();
  assert.ok(POT_VALUES.includes(s.rin));
  assert.ok(POT_VALUES.includes(s.rf));
});
