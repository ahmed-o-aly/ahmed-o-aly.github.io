import test from "node:test";
import assert from "node:assert/strict";
import { CONFIGS, CONFIG_ORDER, LEADS, PINS, buildModel, contactName, initialState, measure, netOf, partsFor, steps, strayJumpers, suggestColor, theory } from "../lab7-bench/circuit.js";
import { LANES_X, LANES_Z, contactXZ, contacts, endObstacle, partObstacles } from "../lab7-bench/layout.js";
import { routeWire } from "../lab7-bench/routing.js";

// wire a configuration exactly as the guide asks, then power it
function built(config, changes = {}) {
  const state = { ...initialState(), config, ...changes };
  state.jumpers = CONFIGS[config].jumpers.map((j) => ({ id: j.id, a: j.a, b: j.b }));
  for (const id of Object.keys(state.leads)) if (id !== "gen2" || CONFIGS[config].usesVin2) state.leads[id] = LEADS[id].target;
  state.supply = { ...state.supply, on: true, ...(changes.supply ?? {}) };
  state.probes = { ch1: "vin1", ch2: "vout1", red: "vout3", black: "gout1" };
  return state;
}
const gainOf = (state) => {
  const model = buildModel(state);
  const vin = measure(model, "postin", state);
  const vout = measure(model, "postout", state);
  const sign = Math.sign(vin.values.reduce((s, v, i) => s + (v - vin.mean) * (vout.values[i] - vout.mean), 0));
  return (sign * vout.pp) / vin.pp;
};

test("hole ids map to strips, rails, pins and terminals on the portrait board", () => {
  assert.equal(netOf("a3"), "L3");
  assert.equal(netOf("e3"), "L3");
  assert.equal(netOf("f3"), "R3");
  assert.equal(netOf("pin2"), netOf("d13"));
  assert.equal(netOf("pin7"), netOf("j13"));
  assert.equal(netOf("lg4"), "GND");
  assert.equal(netOf("rp4"), "VP");
  assert.equal(netOf("ln29"), "VN");
  assert.equal(netOf("postin"), "VIN");
  assert.equal(netOf("gin1"), "GND");
  assert.equal(netOf("gout0"), "GND");
  assert.equal(netOf("vout2"), "VOUT");
});

test("every side of the board carries +V, GND and −V rails", () => {
  const ids = contacts();
  for (const side of ["l", "r"]) for (const [rail, net] of [["p", "VP"], ["g", "GND"], ["n", "VN"]]) {
    assert.ok(ids.includes(`${side}${rail}0`));
    assert.equal(netOf(`${side}${rail}0`), net);
  }
});

test("the hover label names each pin and the strip it shares", () => {
  assert.equal(contactName("pin2"), "Pin 2 · −IN");
  assert.equal(contactName("pin7"), "Pin 7 · V+");
  assert.match(contactName("d13"), /pin 2 \(−IN\)/);
  assert.equal(contactName("post+"), "+V terminal");
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

test("the output clips about 1.5 V inside each selectable supply", () => {
  for (const level of [8, 12, 15]) {
    const state = built("inverting", { rin: 1000, rf: 100000, supply: { level } });
    const out = measure(buildModel(state), "postout", state);
    assert.ok(Math.abs(Math.max(...out.values) - (level - 1.5)) < 0.01);
    assert.ok(Math.abs(Math.min(...out.values) + (level - 1.5)) < 0.01);
  }
});

test("an unpowered op-amp does not amplify; Vin only leaks through Rin and Rf", () => {
  const state = built("inverting", { supply: { on: false } });
  const model = buildModel(state);
  const vin = measure(model, "postin", state);
  const out = measure(model, "postout", state);
  assert.ok(Math.abs(out.pp - vin.pp) < 0.01);
});

test("without its COM lead the generator does not drive VIN", () => {
  const state = built("inverting");
  state.leads.genc = null;
  const model = buildModel(state);
  assert.ok(measure(model, "postin", state).pp < 1e-6);
  assert.ok(steps(state, model).find((s) => s.id === "genc").done === false);
  // the GND post beside VIN is common ground
  assert.ok(buildModel(built("inverting")).connected("postgin", "postg"));
  assert.ok(buildModel(built("inverting")).connected("postgout", "lg3"));
});

test("the supply leads plug straight into the pins' rows, or reach them by way of posts and rails", () => {
  const direct = built("inverting");
  assert.equal(direct.leads["sup+"], "j13");
  assert.equal(netOf(direct.leads["sup+"]), netOf("pin7"));
  assert.equal(netOf(direct.leads["sup-"]), netOf("pin4"));
  assert.ok(steps(direct).find((s) => s.id === "sup+").done);
  assert.ok(Math.abs(gainOf(direct) - -2) < 0.01);
  const viaPosts = built("inverting");
  viaPosts.leads["sup+"] = "post+";
  viaPosts.leads["sup-"] = "post-";
  assert.ok(!steps(viaPosts).find((s) => s.id === "sup+").done);
  viaPosts.jumpers.push({ id: "p", a: "rp13", b: "g13" }, { id: "n", a: "ln15", b: "b15" });
  assert.ok(steps(viaPosts).find((s) => s.id === "sup+").done);
  assert.ok(steps(viaPosts).find((s) => s.id === "sup-").done);
  assert.ok(Math.abs(gainOf(viaPosts) - -2) < 0.01);
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
  state.jumpers.push({ id: "oops", a: "g13", b: "rg13" }); // pin 7's row, live from the +V lead, to ground
  const model = buildModel(state);
  assert.match(model.short, /\+V is shorted to ground/);
  assert.equal(model.supplyOn, false);
  assert.deepEqual(strayJumpers(state).map((j) => j.id), ["oops"]);
});

test("steps complete in order as the circuit is built", () => {
  const empty = { ...initialState() };
  assert.equal(steps(empty).findIndex((s) => !s.done), 0);
  for (const config of CONFIG_ORDER) assert.ok(steps(built(config)).every((s) => s.done), config);
  // any hole in the same strip satisfies a jumper step
  const moved = built("inverting");
  moved.jumpers = moved.jumpers.map((j) => (j.id === "in" ? { ...j, b: "c27" } : j));
  assert.ok(steps(moved).find((s) => s.id === "in").done);
});

test("the adder and subtractor ask for the second input lead; every circuit asks for the generator COM", () => {
  assert.ok(steps(initialState()).every((s) => s.id !== "gen2"));
  assert.ok(steps(initialState()).some((s) => s.id === "genc"));
  assert.ok(steps({ ...initialState(), config: "adder" }).some((s) => s.id === "gen2"));
});

test("the default Rin and Rf sit on detents of the potentiometers", async () => {
  const { POT_VALUES } = await import("../lab7-bench/circuit.js");
  const s = initialState();
  assert.ok(POT_VALUES.includes(s.rin));
  assert.ok(POT_VALUES.includes(s.rf));
});

test("new wires take the guide's colour, else the colour of what they carry", () => {
  assert.equal(suggestColor("inverting", "pin7", "post+"), "red"); // no guided wire: coloured by the +V it carries
  assert.equal(suggestColor("inverting", "d13", "d5"), "green");
  assert.equal(suggestColor("inverting", "ln3", "a20"), "blue");
  assert.equal(suggestColor("inverting", "a2", "a20"), "orange");
});

test("every guided hole is free, exists and is used once", () => {
  const ids = new Set(contacts());
  for (const config of CONFIG_ORDER) {
    const legs = new Set(partsFor(config).flatMap((p) => p.legs));
    const used = new Set();
    for (const j of CONFIGS[config].jumpers) for (const end of [j.a, j.b]) {
      assert.ok(!end.startsWith("post") && !end.startsWith("pin"), `${config}: wires go into holes, not ${end}`);
      assert.ok(ids.has(end), `${config}: ${end} is not a contact`);
      assert.ok(!legs.has(end), `${config}: ${end} holds a part leg`);
      assert.ok(!Object.values(PINS).includes(end), `${config}: ${end} holds the chip`);
      if (end.startsWith("post") || end.startsWith("pin")) continue;
      assert.ok(!used.has(end), `${config}: ${end} is used twice`);
      used.add(end);
    }
    for (const lead of Object.values(LEADS)) {
      assert.ok(ids.has(lead.target), `${config}: lead target ${lead.target} is not a contact`);
      assert.ok(!legs.has(lead.target) && !used.has(lead.target), `${config}: lead target ${lead.target} is taken`);
    }
    for (const p of partsFor(config)) for (const leg of p.legs) assert.ok(ids.has(leg), `${config}: ${leg} is not a hole`);
  }
});

test("the guided wires route square and clear of the chip, parts and each other's ends", () => {
  for (const config of CONFIG_ORDER) {
    const placed = [];
    for (const j of CONFIGS[config].jumpers) {
      const mine = new Set([j.a, j.b]);
      const obstacles = [
        ...partObstacles(config).filter((o) => !mine.has(o.what)),
        ...placed.flatMap((w) => [w.a, w.b]).filter((id) => !mine.has(id) && !id.startsWith("post")).map(endObstacle),
      ];
      const route = routeWire(contactXZ(j.a), contactXZ(j.b), { obstacles, wires: placed.map((w) => w.points), lanesX: LANES_X, lanesZ: LANES_Z });
      assert.equal(route.over, false, `${config}: ${j.id} has no clear path`);
      for (let i = 1; i < route.points.length; i += 1) {
        const [p, q] = [route.points[i - 1], route.points[i]];
        assert.ok(Math.abs(p.x - q.x) < 1e-9 || Math.abs(p.z - q.z) < 1e-9, `${config}: ${j.id} runs diagonally`);
      }
      placed.push({ ...j, points: route.points });
    }
  }
});

test("a lane the student drags a wire into replaces the automatic route and stays square", () => {
  const up = routeWire({ x: 0, z: 0 }, { x: 0.05, z: 0.05 }, { via: { x: -0.02, z: 0.01, lane: "x" } });
  assert.deepEqual(up.points, [{ x: 0, z: 0 }, { x: -0.02, z: 0 }, { x: -0.02, z: 0.05 }, { x: 0.05, z: 0.05 }]);
  const across = routeWire({ x: 0, z: 0 }, { x: 0.05, z: 0.05 }, { via: { x: 0.01, z: 0.07, lane: "z" } });
  assert.deepEqual(across.points, [{ x: 0, z: 0 }, { x: 0, z: 0.07 }, { x: 0.05, z: 0.07 }, { x: 0.05, z: 0.05 }]);
  // dragged over the chip, the wire is flagged to lift over it
  assert.equal(routeWire({ x: -0.05, z: 0 }, { x: 0.05, z: 0.02 }, { via: { x: 0, z: 0.01, lane: "x" }, obstacles: [{ x0: -0.01, x1: 0.01, z0: -0.01, z1: 0.03 }] }).over, true);
});
