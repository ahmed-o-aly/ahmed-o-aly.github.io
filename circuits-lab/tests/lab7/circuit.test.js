import test from "node:test";
import assert from "node:assert/strict";
import { TOPOLOGY, TERMINALS, verify, nets, nodeAt, terminalsFor } from "../../src/lab7/sim/circuit.js";

const CONFIGS = Object.keys(TOPOLOGY);

/** Wire a configuration the obvious way: chain each node's terminals together. */
const wireCorrectly = (configuration) =>
  TOPOLOGY[configuration].flatMap((node) => node.terminals.slice(1).map((to) => ({ from: node.terminals[0], to })));

test("every terminal named by every topology exists in the catalogue", () => {
  for (const configuration of CONFIGS) {
    for (const terminal of terminalsFor(configuration)) {
      assert.ok(TERMINALS[terminal], `${configuration} names an unknown terminal: ${terminal}`);
    }
  }
});

test("a correctly wired circuit is complete for every configuration", () => {
  for (const configuration of CONFIGS) {
    const result = verify(configuration, wireCorrectly(configuration));
    assert.equal(result.complete, true, `${configuration}: ${JSON.stringify(result.missing)}`);
    assert.deepEqual(result.missing, []);
    assert.deepEqual(result.shorts, []);
  }
});

test("an empty bench is incomplete but not shorted, and names what is missing", () => {
  const result = verify("inverting", []);
  assert.equal(result.complete, false);
  assert.deepEqual(result.shorts, []);
  assert.ok(result.missing.length > 0);
  for (const node of result.missing) assert.ok(node.unreached.length > 0, "a missing node names the terminals still to reach");
});

test("the order a student wires a node in does not matter", () => {
  // Rin.b -> pin 2 and pin 2 -> Rin.b are the same connection.
  const forward = wireCorrectly("inverting");
  const reversed = forward.map(({ from, to }) => ({ from: to, to: from }));
  assert.equal(verify("inverting", reversed).complete, true);
});

test("reaching a node by a different route is still correct", () => {
  // Ground the generator through the board rail instead of straight to the supply.
  const leads = [
    { from: "supply.pos", to: "u1.7" },
    { from: "supply.neg", to: "u1.4" },
    { from: "supply.gnd", to: "board.gnd" },
    { from: "gen.gnd", to: "board.gnd" },
    { from: "u1.3", to: "board.gnd" },
    { from: "gen.out1", to: "rin.a" },
    { from: "rin.b", to: "u1.2" },
    { from: "rf.a", to: "u1.2" },
    { from: "rf.b", to: "u1.6" },
  ];
  const result = verify("inverting", leads);
  assert.equal(result.complete, true, JSON.stringify(result.missing));
});

test("joining two different nodes is reported as a short, not as progress", () => {
  const leads = [...wireCorrectly("inverting"), { from: "u1.6", to: "board.gnd" }];
  const result = verify("inverting", leads);
  assert.equal(result.complete, false);
  assert.equal(result.missing.length, 0, "nothing is missing; the fault is a short");
  assert.ok(result.shorts.some((s) => s.between.includes("out") && s.between.includes("gnd")), "output shorted to common");
});

test("shorting the supply rails together is caught", () => {
  const leads = [...wireCorrectly("inverting"), { from: "supply.pos", to: "supply.neg" }];
  const result = verify("inverting", leads);
  assert.equal(result.complete, false);
  assert.ok(result.shorts.some((s) => s.between.includes("vplus") && s.between.includes("vminus")));
});

test("a lead held in the hand is an open contact", () => {
  const leads = wireCorrectly("inverting");
  assert.equal(verify("inverting", leads).complete, true);
  // Hold a lead the circuit depends on, not the optional edge hop at index 0.
  const essential = leads.findIndex((lead) => lead.to === "u1.7");
  const held = leads.map((lead, i) => (i === essential ? { ...lead, held: true } : lead));
  const result = verify("inverting", held);
  assert.equal(result.complete, false, "picking a lead up opens its node immediately");
  assert.ok(result.missing.length > 0);
});

test("the difference amplifier needs its +IN divider, and says so when it is absent", () => {
  const leads = wireCorrectly("subtractor").filter((lead) => lead.from !== "rin2.b" && lead.to !== "rin2.b");
  const result = verify("subtractor", leads);
  assert.equal(result.complete, false);
  assert.ok(result.missing.some((node) => node.node === "plus"), "the +IN divider is the missing node");
});

test("a probe reports the node it is sitting on", () => {
  const leads = [...wireCorrectly("inverting"), { from: "meter.v", to: "u1.6" }];
  assert.equal(nodeAt("inverting", leads, "meter.v").id, "out");
  assert.equal(nodeAt("inverting", leads, "u1.2").id, "sum");
  assert.equal(nodeAt("inverting", leads, "board.gnd").id, "gnd");
});

test("union-find collapses a chain of leads into one node", () => {
  const { find } = nets([
    { from: "a", to: "b" },
    { from: "b", to: "c" },
    { from: "c", to: "d" },
  ]);
  assert.equal(find("a"), find("d"));
  assert.notEqual(find("a"), find("z"));
});

test("no configuration lists the same terminal in two different nodes", () => {
  for (const configuration of CONFIGS) {
    const seen = new Map();
    for (const node of TOPOLOGY[configuration]) {
      for (const terminal of node.terminals) {
        assert.equal(seen.has(terminal), false, `${configuration}: ${terminal} appears in ${seen.get(terminal)} and ${node.id}`);
        seen.set(terminal, node.id);
      }
    }
  }
});
