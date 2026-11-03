import test from "node:test";
import assert from "node:assert/strict";
import { C_VALUES, L_VALUES, LEADS, R_VALUES, S1, SOURCES, buildModel, contactName, energy, initialState, jumpersFor, legsFor, measureTau, netOf, partDefaults, steps, strayJumpers, suggestColor, theory } from "../lab8/circuit.js";
import { LANES_X, LANES_Z, contactXZ, contacts, endObstacle, partObstacles } from "../lab8/layout.js";
import { routeWire } from "../lab7-bench/routing.js";

// wire a circuit exactly as the guide asks, then power it
function built(kind = "RC", source = "s1", changes = {}) {
  const state = { ...initialState(), kind, source, ...changes };
  state.jumpers = jumpersFor(source).map((j) => ({ id: j.id, a: j.a, b: j.b }));
  for (const id of SOURCES[source].leads) state.leads[id] = LEADS[id].target;
  state.supply = { level: 5, on: true };
  state.probes = { ch1: "vmon1", ch2: "vout2", probegnd: "gout1" };
  return state;
}
const close = (actual, expected, tolerance = 1e-3) => assert.ok(Math.abs(actual - expected) <= Math.abs(expected) * tolerance + 1e-12, `${actual} is not ${expected}`);
const charging = (state) => ({ ...state, s1: "charge" });

test("hole ids map to strips, rails and terminals", () => {
  assert.equal(netOf("a3"), "L3");
  assert.equal(netOf("f3"), "R3");
  assert.equal(netOf("lg4"), "GND");
  assert.equal(netOf("rp4"), "VP");
  assert.equal(netOf("gin1"), "GND");
  assert.equal(netOf("vout2"), "VOUT");
  assert.match(contactName("a7"), /S1 common/);
  assert.match(contactName("vout0"), /VOUT/);
});

test("the manual's RC case: 5 V, 1 kΩ, 100 µF", () => {
  const state = charging(built("RC", "s1", { r: 1000, c: 1e-4 }));
  const model = buildModel(state);
  close(model.tau(0), 0.1);
  const x = model.advance(0, 0, 0.1);
  close(x, 3.1606);
  const now = model.solve(x, 0.1);
  close(now.current, 1.8394e-3);
  close(now.v.get(model.root("postout")), 3.1606);
  close(energy(state, x), 0.49947e-3);
  close(energy(state, model.settle(0)), 1.25e-3);
});

test("doubling R doubles the RC time constant", () => {
  close(buildModel(charging(built("RC", "s1", { r: 2000, c: 1e-4 }))).tau(0), 0.2);
});

test("the manual's RL case: 5 V, 100 Ω, 100 mH", () => {
  const state = charging(built("RL", "s1", { r: 100, l: 0.1 }));
  const model = buildModel(state);
  close(model.tau(0), 1e-3);
  const x = model.advance(0, 0, 1e-3);
  close(x, 31.606e-3);
  close(model.solve(x, 1e-3).v.get(model.root("postout")), 1.8394);
  close(energy(state, x), 0.049947e-3);
  close(energy(state, model.settle(0)), 0.125e-3);
  // doubling R halves τ and halves the final current
  const doubled = buildModel(charging(built("RL", "s1", { r: 200, l: 0.1 })));
  close(doubled.tau(0), 0.5e-3);
  close(doubled.settle(0), 25e-3);
});

test("capacitor voltage and inductor current stay continuous through S1; the other quantity reverses", () => {
  const rc = built("RC", "s1", { r: 1000, c: 1e-4 });
  const vc = buildModel(charging(rc)).advance(0, 0, 0.1);
  const back = buildModel(rc).solve(vc, 0);
  close(back.v.get(buildModel(rc).root("postout")), vc);
  close(back.current, -vc / 1000);
  close(buildModel(rc).advance(vc, 0, 0.1), vc * Math.exp(-1));
  const rl = built("RL", "s1", { r: 100, l: 0.1 });
  const il = buildModel(charging(rl)).advance(0, 0, 1e-3);
  const decay = buildModel(rl).solve(il, 0);
  close(decay.current, il);
  close(decay.v.get(buildModel(rl).root("postout")), -il * 100);
  close(buildModel(rl).advance(il, 0, 1e-3), il * Math.exp(-1));
});

test("a square wave charges in the high half and discharges in the low half", () => {
  const state = built("RC", "gen", { r: 1000, c: 1e-5, gen: { amp: 5, freq: 10 } }); // τ = 10 ms, half period 50 ms
  const model = buildModel(state);
  const high = model.advance(0, 0, 0.05);
  close(high, 5 * (1 - Math.exp(-5)));
  const low = model.advance(high, 0.05, 0.05);
  close(low, high * Math.exp(-5));
  // one big step across several edges lands in the same place as many small ones
  let small = 0;
  for (let i = 0; i < 500; i += 1) small = model.advance(small, i * 1e-3, 1e-3);
  close(model.advance(0, 0, 0.5), small, 1e-6);
});

test("the time constant measured at 63.2% matches theory", () => {
  for (const [kind, changes] of [["RC", { r: 4700, c: 2.2e-6 }], ["RL", { r: 220, l: 0.47 }]]) {
    const state = charging(built(kind, "s1", changes));
    const model = buildModel(state);
    const expected = theory(state).tau;
    const samples = [];
    let x = 0;
    for (let i = 0; i <= 400; i += 1) { samples.push({ t: i * expected * 0.01, x }); x = model.advance(x, i * expected * 0.01, expected * 0.01); }
    const measured = measureTau(samples, model.settle(0));
    close(measured.tau, expected, 2e-3);
  }
  // not there yet, nothing to report
  assert.equal(measureTau([{ t: 0, x: 0 }, { t: 1, x: 1 }], 5), null);
});

test("every dial value gives a positive time constant and sits on its detents", () => {
  const s = initialState();
  assert.ok(R_VALUES.includes(s.r) && C_VALUES.includes(s.c) && L_VALUES.includes(s.l));
  for (const r of R_VALUES) { assert.ok(theory({ ...s, r }).tau > 0); }
});

test("missing connections behave as the hardware would", () => {
  // no ground return: the capacitor cannot charge
  const open = charging(built("RC"));
  open.jumpers = open.jumpers.filter((j) => j.id !== "gnd");
  assert.ok(Math.abs(buildModel(open).advance(0, 0, 1)) < 1e-3);
  // supply off: nothing moves
  const off = charging(built("RC"));
  off.supply = { level: 5, on: false };
  assert.ok(Math.abs(buildModel(off).advance(0, 0, 1)) < 1e-3);
  // generator without its COM lead floats
  const floating = built("RC", "gen", { c: 1e-5 });
  floating.leads.genc = null;
  assert.ok(Math.abs(buildModel(floating).advance(0, 0, 0.25)) < 1e-3);
  assert.ok(!steps(floating).find((s) => s.id === "genc").done);
});

test("wiring +V to ground trips the supply", () => {
  const state = charging(built("RC"));
  state.jumpers.push({ id: "oops", a: "c3", b: "rg1" });
  const model = buildModel(state);
  assert.match(model.short, /ground|\+V/);
  assert.equal(model.supplyOn, false);
  assert.deepEqual(strayJumpers(state).map((j) => j.id), ["oops"]);
});

test("the supply lead can reach S1 by a post and a wire instead", () => {
  const state = charging(built("RC", "s1", { c: 1e-5 }));
  state.leads["sup+"] = "post+";
  assert.ok(!steps(state).find((s) => s.id === "sup+").done);
  state.jumpers.push({ id: "p", a: "lp3", b: "a3" });
  assert.ok(steps(state).find((s) => s.id === "sup+").done);
  assert.ok(buildModel(state).advance(0, 0, 1) > 4.9);
});

test("steps complete as the circuit is built, for each circuit and source", () => {
  assert.equal(steps(initialState()).findIndex((s) => !s.done), 0);
  for (const kind of ["RC", "RL"]) for (const source of ["s1", "gen"]) {
    const state = built(kind, source);
    state.started = true;
    state.charged = true;
    assert.deepEqual(steps(state).filter((s) => !s.done).map((s) => s.id), [], `${kind} ${source}`);
  }
  assert.ok(steps(built("RC", "gen")).every((s) => s.id !== "s1" && s.id !== "power"));
});

test("the scope measures this lab: two probes and its ground lead, no multimeter", () => {
  const ids = steps(built("RC")).map((s) => s.id);
  assert.deepEqual(ids.filter((id) => ["ch1", "ch2", "probegnd", "red", "black"].includes(id)), ["ch1", "ch2", "probegnd"]);
  assert.deepEqual(Object.keys(initialState().probes), ["ch1", "ch2", "probegnd"]);
  const floating = built("RC");
  floating.probes.probegnd = "vout3"; // clipped somewhere other than ground
  assert.equal(steps(floating).find((s) => s.id === "probegnd").done, false);
});

test("the generator's circuits open in the kHz range; S1 keeps the manual's values", () => {
  for (const kind of ["RC", "RL"]) {
    const gen = theory({ ...built(kind, "gen"), ...partDefaults(kind, "gen") });
    close(gen.tau, 1e-4);
    assert.ok(1 / (10 * gen.tau) >= 1000, kind); // a 1 kHz square wave settles each half period
    close(theory({ ...built(kind), ...partDefaults(kind, "s1") }).tau, kind === "RC" ? 0.1 : 1e-3); // the manual's values
  }
  assert.equal(initialState().gen.freq, 1000);
  const v = partDefaults("RC", "gen");
  assert.ok(R_VALUES.includes(v.r) && C_VALUES.includes(v.c) && L_VALUES.includes(partDefaults("RL", "gen").l));
});

test("the response reads with the output first, and every ground point says it is common", () => {
  assert.equal(theory(charging(built("RC"))).response, "Vc(t) = Vin (1 − e^(−t/τ))");
  assert.equal(theory(built("RC")).response, "Vc(t) = V0 e^(−t/τ)");
  assert.equal(theory(charging(built("RL"))).response, "I(t) = (Vin / R) (1 − e^(−t/τ))");
  for (const id of ["postg", "postgin", "postgout", "gin0", "gout1", "lg3", "rg3"]) assert.match(contactName(id), /all GND points are connected/);
});

test("new wires take the guide's colour, else the colour of what they carry", () => {
  assert.equal(suggestColor("s1", "i24", "rg24"), "black");
  assert.equal(suggestColor("s1", "j16", "vout1"), "cyan");
  assert.equal(suggestColor("s1", "lp3", "a2"), "red");
  assert.equal(suggestColor("s1", "a2", "a20"), "orange");
});

test("every guided hole is free, exists and is used once", () => {
  const ids = new Set(contacts());
  for (const kind of ["RC", "RL"]) for (const source of ["s1", "gen"]) {
    const legs = new Set(legsFor(kind));
    const used = new Set();
    for (const j of jumpersFor(source)) for (const end of [j.a, j.b]) {
      assert.ok(ids.has(end), `${end} is not a contact`);
      assert.ok(!legs.has(end), `${end} holds a leg`);
      assert.ok(!end.startsWith("post"), `wires go into holes, not ${end}`);
      assert.ok(!used.has(end), `${end} is used twice`);
      used.add(end);
    }
    for (const id of SOURCES[source].leads) assert.ok(ids.has(LEADS[id].target) && !legs.has(LEADS[id].target) && !used.has(LEADS[id].target), LEADS[id].target);
  }
  for (const leg of Object.values(S1)) assert.ok(ids.has(leg));
});

test("the guided wires route square and clear of the parts and each other's ends", () => {
  for (const kind of ["RC", "RL"]) for (const source of ["s1", "gen"]) {
    const placed = [];
    for (const j of jumpersFor(source)) {
      const mine = new Set([j.a, j.b]);
      const obstacles = [
        ...partObstacles(kind).filter((o) => !mine.has(o.what)),
        ...placed.flatMap((w) => [w.a, w.b]).filter((id) => !mine.has(id)).map(endObstacle),
      ];
      const route = routeWire(contactXZ(j.a), contactXZ(j.b), { obstacles, wires: placed.map((w) => w.points), lanesX: LANES_X, lanesZ: LANES_Z });
      assert.equal(route.over, false, `${kind} ${source}: ${j.id} has no clear path`);
      placed.push({ ...j, points: route.points });
    }
  }
});
