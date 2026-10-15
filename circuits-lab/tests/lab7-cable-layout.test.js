import test from "node:test";
import assert from "node:assert/strict";
import { seedCable, traceCable, moveCableEnd, grabCable, bendCable, validCablePath } from "../src/amplifier-cables.js";
import { clearInstrumentFaces, jackPosition } from "../src/amplifier-scene.js";
import {
  createExperiment,
  selectConfiguration,
  circuit,
  connect,
  connectProbe,
  arrangeCable,
  leadDrop,
  removeLead,
  undo,
  reset,
  setParameter,
  electricalSnapshot,
  acquisition,
  toggleAcquisition,
} from "../src/amplifier-experiment.js";
const raw = [
  [-3, 2, 0.25],
  [-2, 1, 0.6],
  [0, 1, 0.6],
  [1, 0, 0.25],
];
const path = () => seedCable(raw);

test("a drawn lead approaching Vin2 clears its tilted face without changing its x/y route or contacts", () => {
  const socket = jackPosition("signal2+"),
    route = [[-3.35, -1.45, 0.25], [-4.45, socket[1] - 0.15, 0.6], socket],
    before = structuredClone(route),
    cleared = clearInstrumentFaces(route);
  assert.deepEqual(cleared[0], route[0]);
  assert.deepEqual(cleared.at(-1), socket);
  assert.deepEqual(
    cleared.map((p) => p.slice(0, 2)),
    route.map((p) => p.slice(0, 2))
  );
  assert.ok(cleared[1][2] > 0.95);
  assert.deepEqual(route, before);
});

for (const end of [0, 1])
  for (const points of [raw.slice(0, 2), path()])
    test(`moving end ${end} of ${points.length}-point cable fixes opposite socket`, () => {
      const before = structuredClone(points),
        target = [5, 4, 0.5],
        next = moveCableEnd(points, end, target);
      assert.deepEqual(next[end === 0 ? 0 : next.length - 1], target);
      assert.deepEqual(next[end === 0 ? next.length - 1 : 0], points[end === 0 ? points.length - 1 : 0]);
      assert.deepEqual(points, before);
    });
test("drawing records the actual turn direction and does not reconstruct a preset on release", () => {
  let trail = [[0, 0, 0.25]],
    route;
  for (const tip of [
    [0, 1, 0.6],
    [1, 2, 0.6],
    [3, 2, 0.6],
    [3, 1, 0.25],
  ])
    ({ trail, route } = traceCable(trail, tip));
  assert.deepEqual(route, [
    [0, 0, 0.25],
    [0, 1, 0.6],
    [1, 2, 0.6],
    [3, 2, 0.6],
    [3, 1, 0.25],
  ]);
  assert.deepEqual(traceCable(trail, [3, 1, 0.25]).route, route);
});
test("middle grab preserves both sockets, distant bends and original input while its control follows the pointer", () => {
  const points = path(),
    before = structuredClone(points),
    grab = grabCable(points, points[16]);
  const next = bendCable(grab.route, grab.index, [1, 3, 0.8]);
  assert.deepEqual(next[0], points[0]);
  assert.deepEqual(next.at(-1), points.at(-1));
  assert.deepEqual(next[grab.index], [1, 3, 0.8]);
  assert.deepEqual(next[2], grab.route[2]);
  assert.deepEqual(points, before);
});
for (const configuration of ["inverting", "noninverting", "adder", "subtractor"])
  test(`${configuration}: cable edits preserve all connectivity/readings and survive parameter changes, Undo and configuration Undo`, () => {
    const s = createExperiment();
    selectConfiguration(s, configuration);
    for (const [a, b] of circuit(s).wires) connect(s, a, b, path());
    for (const [id, target] of Object.entries({ red: "out", black: "gnd", ch1: "signal+", ch1Ground: "gnd", ch2: "out", ch2Ground: "gnd" }))
      connectProbe(s, id, target);
    setParameter(s, "powered", true);
    const electrical = electricalSnapshot(s),
      before = structuredClone(s.cableLayout),
      reading = acquisition(s),
      history = s.history.length;
    const grab = grabCable(s.cableLayout.wires[3], s.cableLayout.wires[3][16]);
    const bent = bendCable(grab.route, grab.index, [1, 3, 0.8]);
    arrangeCable(s, "wire", 3, bent);
    assert.equal(s.history.length, history + 1);
    assert.deepEqual(electricalSnapshot(s), electrical);
    assert.equal(acquisition(s).signature, reading.signature);
    assert.deepEqual(acquisition(s).meter, reading.meter);
    assert.deepEqual(s.cableLayout.wires[2], before.wires[2]);
    assert.deepEqual(s.cableLayout.wires[4], before.wires[4]);
    assert.deepEqual(s.cableLayout.wires[3], bent);
    setParameter(s, "frequency", 2000);
    assert.deepEqual(s.cableLayout.wires[3], bent);
    undo(s);
    assert.deepEqual(s.cableLayout.wires[3], bent);
    selectConfiguration(s, configuration === "adder" ? "inverting" : "adder");
    undo(s);
    assert.deepEqual(s.cableLayout.wires[3], bent);
    undo(s);
    assert.deepEqual(s.cableLayout, before);
  });
test("route Undo preserves a held scope capture and acquisition mode", () => {
  const s = createExperiment();
  connect(s, "signal+", "rina", path());
  toggleAcquisition(s);
  const held = structuredClone(s.held),
    g = grabCable(path(), path()[16]);
  arrangeCable(s, "wire", 0, bendCable(g.route, g.index, [2, 3, 0.5]));
  assert.equal(s.running, false);
  assert.deepEqual(s.held, held);
  undo(s);
  assert.equal(s.running, false);
  assert.deepEqual(s.held, held);
});
test("replug persists the shown route, preserves another cable, and is one Undo step", () => {
  const s = createExperiment();
  connect(s, "signal+", "rina", path());
  connect(s, "rfa", "op-", path());
  const before = structuredClone(s.cableLayout),
    history = s.history.length,
    newPath = moveCableEnd(path(), 1, [4, 2, 0.25]);
  leadDrop(s, 0, 1, "rinb", newPath);
  assert.deepEqual(s.cableLayout.wires[0], newPath);
  assert.deepEqual(s.cableLayout.wires[1], before.wires[1]);
  assert.equal(s.history.length, history + 1);
  undo(s);
  assert.deepEqual(s.cableLayout, before);
});
test("unplug removes only its route; Undo and reset restore geometry with the circuit", () => {
  const s = createExperiment();
  connect(s, "signal+", "rina", path());
  connect(s, "rfa", "op-", raw);
  const before = structuredClone(s.cableLayout);
  removeLead(s, 0);
  assert.deepEqual(s.cableLayout.wires, [raw]);
  undo(s);
  assert.deepEqual(s.cableLayout, before);
  reset(s);
  assert.deepEqual(s.cableLayout, { wires: [], probes: {} });
  undo(s);
  assert.deepEqual(s.cableLayout, before);
});
test("probe body geometry is independent of contact and retains the chosen pose even when set down disconnected", () => {
  const s = createExperiment(),
    placement = { route: path(), contact: [1, 0, 0.25], direction: [0, 1, 0] };
  connectProbe(s, "red", "out", placement);
  const before = electricalSnapshot(s),
    g = grabCable(path(), path()[16]),
    bent = bendCable(g.route, g.index, [0, 3, 0.6]);
  arrangeCable(s, "probe", "red", bent, placement);
  assert.deepEqual(electricalSnapshot(s), before);
  assert.deepEqual(s.cableLayout.probes.red.route, bent);
  const loose = { ...placement, route: moveCableEnd(bent, 1, [2, 0, 0.5]), contact: [2, -0.65, 0.5] };
  connectProbe(s, "red", null, loose);
  assert.equal(s.probes.red, null);
  assert.deepEqual(s.cableLayout.probes.red.contact, loose.contact);
  undo(s);
  assert.equal(s.probes.red, "out");
  assert.deepEqual(s.cableLayout.probes.red.route, bent);
});
test("nonfinite, incomplete and overlong geometry is rejected without state/history changes", () => {
  const s = createExperiment();
  connect(s, "signal+", "rina", path());
  const before = structuredClone(s);
  for (const bad of [
    [],
    [[0, 0, 0]],
    [
      [0, 0, 0],
      [NaN, 1, 1],
    ],
    Array.from({ length: 2049 }, () => [0, 0, 0]),
  ]) {
    assert.equal(validCablePath(bad), false);
    assert.equal(arrangeCable(s, "wire", 0, bad), false);
  }
  assert.deepEqual(s, before);
});
test("same-contact probe round trip ignores numerical drift but saves an actual pose or curve change", () => {
  const s = createExperiment(),
    placement = { route: path(), contact: [1, 0, 0.25], direction: [0, 1, 0] };
  connectProbe(s, "red", "out", placement);
  const before = structuredClone(s);
  assert.equal(connectProbe(s, "red", "out", structuredClone(placement)), false);
  const drift = structuredClone(placement);
  drift.route.at(-1)[0] += 1e-12;
  drift.direction[1] += Number.EPSILON;
  assert.equal(connectProbe(s, "red", "out", drift), false);
  assert.deepEqual(s, before);
  const moved = structuredClone(placement);
  moved.route[8][1] += 0.2;
  assert.equal(connectProbe(s, "red", "out", moved), true);
  assert.equal(s.history.length, before.history.length + 1);
  assert.equal(s.probes.red, "out");
  undo(s);
  assert.deepEqual(s.cableLayout, before.cableLayout);
});
