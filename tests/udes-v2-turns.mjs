import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { UdesV2Engine } = require("../assets/js/udes-v2-worker.js");
const nodes = [
  { id: "a", coord: [54.4, 24.4] },
  { id: "b", coord: [54.41, 24.4] },
  { id: "c", coord: [54.42, 24.4] },
  { id: "d", coord: [54.41, 24.41] },
];
const zones = nodes.slice(0, 3).map((node) => ({
  id: node.id,
  name: node.id,
  networkNodeId: node.id,
  centroid: node.coord,
  population2024: 1000,
  housingCapacityPersons: 2000,
}));
const links = [
  ["ab", "a", "b", 1],
  ["bc", "b", "c", 1],
  ["ad", "a", "d", 2],
  ["db", "d", "b", 1],
  ["bd", "b", "d", 5],
  ["dc", "d", "c", 10],
  ["ca", "c", "a", 3],
].map(([id, from, to, minutes]) => ({
  id,
  from,
  to,
  freeFlowMinutes: minutes,
  distanceKm: minutes,
  allowAB: true,
  allowBA: false,
  bidirectional: false,
  loadBearing: true,
  capacityVehiclesAB: 100000,
  capacityVehiclesBA: 0,
}));
const restriction = { viaNodeId: "b", incomingEdgeId: "ab", incomingDirection: 1, outgoingEdgeId: "bc", outgoingDirection: 1 };
function makeEngine(turnRestrictions, selectedLinks = links, nested = false) {
  const roadData = { nodes, edges: selectedLinks, turnRestrictions };
  return new UdesV2Engine({
    seed: 20260912,
    config: { citizenCount: 12, enterpriseCount: 3, citizenWeight: 1, initialEmploymentRate: 0 },
    data: {
      zones,
      ...(nested ? { roadGraph: roadData } : { nodes, links: selectedLinks, turnRestrictions }),
      transit: {
        links: selectedLinks.map((edge) => ({
          id: `bus-${edge.id}`,
          bidirectional: false,
          traversals: [{ edgeId: edge.id, direction: 1 }],
          inVehicleMinutes: edge.freeFlowMinutes,
          capacityPassengers: 100000,
        })),
      },
    },
  });
}
function path(engine, mode, from = 0, to = 2) {
  return engine.buildPathMatrix(mode)[from][to];
}
function ids(engine, route) {
  return route?.steps.map((step) => engine.links[step.linkIndex].id) ?? null;
}

const unrestricted = makeEngine();
const explicitlyEmpty = makeEngine([]);
assert.deepEqual(unrestricted.snapshot(), explicitlyEmpty.snapshot(), "missing restrictions preserve the existing empty-restriction behavior");
assert.deepEqual(ids(unrestricted, path(unrestricted, "car")), ["ab", "bc"]);
assert.equal(path(unrestricted, "car").oneWayMinutes, 2);

const restricted = makeEngine([restriction]);
for (const mode of ["car", "pt"]) {
  assert.deepEqual(ids(restricted, path(restricted, mode)), ["ad", "db", "bc"], "keep the later valid arrival at B even though AB reaches B sooner");
  assert.equal(path(restricted, mode).oneWayMinutes, 4);
  assert.deepEqual(ids(restricted, path(restricted, mode, 1, 2)), ["bc"], "departure from a gateway has no inherited incoming turn");
  assert.deepEqual(ids(restricted, path(restricted, mode, 2, 1)), ["ca", "ab"], "an incoming restricted approach may still end at that gateway");
}
assert.equal(restricted.routingStateNodeIndices.length, nodes.length + 2, "only the two approaches at restricted B need extra states");
const nested = makeEngine([restriction], links, true);
assert.deepEqual(ids(nested, path(nested, "car")), ["ad", "db", "bc"], "nested roadGraph input also forwards turn restrictions");
const duplicate = makeEngine([restriction, restriction]);
assert.equal(duplicate.turnRestrictions.length, 1);
assert.deepEqual(ids(duplicate, path(duplicate, "car")), ["ad", "db", "bc"]);
restricted.config.roadSpeedMultiplier = 2;
assert.equal(path(restricted, "car").oneWayMinutes, 2, "dynamic policy costs are still used in the turn-aware search");
restricted.reset();
assert.deepEqual(ids(restricted, path(restricted, "car")), ["ad", "db", "bc"], "reset retains supplied restrictions");

const corridor = makeEngine(
  [restriction],
  links.filter((edge) => ["ab", "bc", "ca"].includes(edge.id))
);
assert.equal(path(corridor, "car"), null, "a forbidden turn cannot be used just to manufacture reachability");
assert.equal(path(corridor, "pt"), null);
assert.throws(() => makeEngine([{ ...restriction, viaNodeId: "d" }]), /Disconnected or unsupported/);
assert.throws(() => makeEngine([{ ...restriction, incomingDirection: -1 }]), /Disconnected or unsupported/);
assert.throws(() => makeEngine([{ ...restriction, incomingEdgeId: "missing" }]), /Invalid road turn restriction/);
assert.throws(() => makeEngine({}), /must be an array/);
assert.throws(() => makeEngine([null]), /Invalid road turn restriction record/);
console.log(
  "Turn routing checks passed: approach-dependent shortest paths, both modes, gateway departure/arrival, unreachable turns, reset, costs, and malformed inputs."
);
