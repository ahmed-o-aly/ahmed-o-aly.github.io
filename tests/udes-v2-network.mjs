import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { validateRoadNetwork } from "../scripts/lib/udes-v2-network-integrity.mjs";
import { deriveTurnRestrictions } from "../scripts/lib/udes-v2-turn-restrictions.mjs";

const baseline = JSON.parse(await readFile(new URL("../assets/data/udes-v2/baseline.json", import.meta.url), "utf8"));
const roads = JSON.parse(await readFile(new URL("../assets/data/udes-v2/roads.geojson", import.meta.url), "utf8"));
const geography = JSON.parse(await readFile(new URL("../assets/data/udes-v2/zones.geojson", import.meta.url), "utf8"));
const graph = baseline.roadGraph;
const evidence = validateRoadNetwork(baseline.zones, graph.nodes, graph.edges, graph.candidateRoutes, roads.features, graph.turnRestrictions);
assert.equal(evidence.directedDistrictPairs, 306);
assert.equal(evidence.danglingNonGatewayNodes, 0);
assert.equal(graph.fallbackRouteCount, 0);
assert.equal(graph.fallbackArterialSeedCount, 0);
const requestedPairs = new Set(
  baseline.zones.flatMap((from) => baseline.zones.filter((to) => to.id !== from.id).map((to) => `${from.id}--${to.id}`))
);
assert.deepEqual(
  new Set(graph.candidateRoutes.map((route) => route.id)),
  requestedPairs,
  "every directed district pair has its own real routed candidate"
);
assert.equal(graph.candidateRoutes.length, requestedPairs.size, "all-pair road candidates are unique");
assert.ok(graph.edges.length > 543, "the all-pair union includes genuine road alternatives missing from the previous sparse graph");
assert.ok(graph.turnRestrictions.length > 0, "cached intersection restrictions constrain physical-road turns");
assert.equal(evidence.turnRestrictionCount, graph.turnRestrictions.length);
const sourceFiles = new Set(baseline.sourceSnapshot.requests.map((request) => request.file));
assert.ok(
  graph.candidateRoutes.every((route) => sourceFiles.has(route.sourceRequest?.snapshotFile)),
  "each complete route points to a frozen source response"
);
const pointKey = (point) => point.map((value) => Number(value).toFixed(5)).join(",");
const deduplicate = (points) => points.filter((point, index) => index === 0 || point !== points[index - 1]);
const edgeById = new Map(graph.edges.map((edge) => [edge.id, edge]));
const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
for (const route of graph.candidateRoutes) {
  const source = baseline.sourceSnapshot.requests.find((request) => request.file === route.sourceRequest.snapshotFile);
  const compressed = await readFile(new URL(`../scripts/data/udes-v2-sources/${source.file}`, import.meta.url));
  const wrapper = JSON.parse(gunzipSync(compressed));
  assert.equal(createHash("sha256").update(wrapper.responseText).digest("hex"), source.sha256, `${route.id} frozen source hash`);
  const payload = JSON.parse(wrapper.responseText);
  assert.equal(payload.code, "Ok");
  const sourcePoints = deduplicate(payload.routes[0].legs.flatMap((leg) => leg.steps.flatMap((step) => step.geometry.coordinates.map(pointKey))));
  const start = sourcePoints.indexOf(pointKey(nodeById.get(route.fromNodeId).coord));
  const end = sourcePoints.lastIndexOf(pointKey(nodeById.get(route.toNodeId).coord));
  assert.ok(start >= 0 && end > start, `${route.id} both retained gateways occur in its source geometry`);
  const graphPoints = deduplicate(
    route.traversals.flatMap((traversal) => {
      const points = edgeById.get(traversal.edgeId).geometry.coordinates.map(pointKey);
      return traversal.direction === 1 ? points : points.reverse();
    })
  );
  assert.deepEqual(
    graphPoints,
    sourcePoints.slice(start, end + 1),
    `${route.id} graph path preserves the complete source geometry after gateway trimming`
  );
}
const transitAssumptions = JSON.parse(await readFile(new URL("../scripts/data/udes-v2-transit-services.json", import.meta.url), "utf8"));
assert.equal(baseline.transit.links.length, 62, "complete car-road coverage does not invent additional bus services");
assert.deepEqual(
  baseline.transit.links.map((service) => Object.fromEntries(Object.keys(transitAssumptions.services[0]).map((key) => [key, service[key]]))),
  transitAssumptions.services,
  "the prior synthetic bus service identities, frequencies, capacities, and in-vehicle times remain explicit and unchanged"
);
assert.equal(graph.topology.loadBearingEdgeCount, graph.edges.length);
assert.ok(
  graph.edges.every((edge) => edge.loadBearing === true && edge.capacityExclusionReason === null),
  "every real road, including former terminal/portal roads, participates in shared capacity loading"
);
assert.ok(
  roads.features.every((feature) => feature.properties.loadBearing === true),
  "map geometry and the numerical graph agree on physical-road loading"
);
for (const edge of graph.edges) {
  for (const direction of ["AB", "BA"]) {
    const capacity = edge[`capacityVehPerHour${direction}`];
    assert.ok(Number.isFinite(capacity) && capacity >= 0, `${edge.id}/${direction} has a finite declared hourly capacity`);
    assert.equal(capacity > 0, edge[`allow${direction}`], `${edge.id}/${direction} capacity follows legal directionality`);
  }
}
assert.equal(baseline.zones.find((zone) => zone.id === "al-bateen").officialDistrictIds.length, 3);
assert.ok(baseline.zones.every((zone) => zone.networkGateway?.snapDistanceMeters <= 1500));
assert.ok(baseline.sourceSnapshot.requests.length > 60);
const contains = (point, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x, y] = ring[i],
      [previousX, previousY] = ring[j];
    if (y > point[1] !== previousY > point[1] && point[0] < ((previousX - x) * (point[1] - y)) / (previousY - y) + x) inside = !inside;
  }
  return inside;
};
for (const zone of baseline.zones) {
  const shape = geography.features.find((feature) => feature.id === zone.id).geometry;
  const polygons = shape.type === "Polygon" ? [shape.coordinates] : shape.coordinates;
  assert.ok(
    polygons.some((rings) => contains(zone.centroid, rings[0]) && !rings.slice(1).some((ring) => contains(zone.centroid, ring))),
    `${zone.id} road gateway must be inside its district geography`
  );
}
assert.equal(evidence.gatewayTerminalNodes.length, 0, "cul-de-sac approaches must be trimmed to actual connected junctions");

// Regressions must fail rather than creating invisible connections or accepting
// a route that jumps between unrelated intersections.
const disconnected = structuredClone(graph.edges);
disconnected[0].geometry.coordinates[0][0] += 0.01;
assert.throws(() => validateRoadNetwork(baseline.zones, graph.nodes, disconnected, graph.candidateRoutes, roads.features), /geometry does not meet/);
const brokenRoutes = structuredClone(graph.candidateRoutes);
brokenRoutes[0].traversals.shift();
assert.throws(() => validateRoadNetwork(baseline.zones, graph.nodes, graph.edges, brokenRoutes, roads.features), /discontinuous route|does not end/);
const pretendRoads = structuredClone(graph.edges);
pretendRoads[0].sourceClass = "mixed-derived-synthetic";
assert.throws(() => validateRoadNetwork(baseline.zones, graph.nodes, pretendRoads, graph.candidateRoutes, roads.features), /non-physical/);

// A hand-checkable junction: west approach may continue east but cannot turn north.
const junctionNodes = [
  { id: "west", coord: [-0.001, 0] },
  { id: "junction", coord: [0, 0] },
  { id: "east", coord: [0.001, 0] },
  { id: "north", coord: [0, 0.001] },
];
const junctionEdges = [
  {
    id: "in",
    from: "west",
    to: "junction",
    allowAB: true,
    allowBA: false,
    geometry: {
      coordinates: [
        [-0.001, 0],
        [0, 0],
      ],
    },
  },
  {
    id: "east",
    from: "junction",
    to: "east",
    allowAB: true,
    allowBA: false,
    geometry: {
      coordinates: [
        [0, 0],
        [0.001, 0],
      ],
    },
  },
  {
    id: "north",
    from: "junction",
    to: "north",
    allowAB: true,
    allowBA: false,
    geometry: {
      coordinates: [
        [0, 0],
        [0, 0.001],
      ],
    },
  },
];
const sourceTurn = { location: [0, 0], bearings: [0, 90, 270], entry: [false, true, false], in: 2, out: 1 };
const sourceRoute = { id: "west--east", sourceSnapshotFile: "fixture.json.gz", steps: [{ intersections: [sourceTurn] }] };
const knownRoute = {
  traversals: [
    { edgeId: "in", direction: 1 },
    { edgeId: "east", direction: 1 },
  ],
};
const inferred = deriveTurnRestrictions(junctionNodes, junctionEdges, [sourceRoute], [knownRoute]);
assert.equal(inferred.restrictions.length, 1);
assert.equal(inferred.restrictions[0].incomingEdgeId, "in");
assert.equal(inferred.restrictions[0].outgoingEdgeId, "north");
assert.equal(inferred.restrictions[0].viaNodeId, "junction");
const reversibleApproach = structuredClone(junctionEdges);
reversibleApproach[0].allowBA = true;
const withForbiddenReversal = deriveTurnRestrictions(junctionNodes, reversibleApproach, [sourceRoute], [knownRoute]);
assert.equal(withForbiddenReversal.restrictions.length, 2, "an explicitly prohibited U-turn is retained alongside the prohibited north turn");
assert.ok(
  withForbiddenReversal.restrictions.some(
    (turn) => turn.incomingEdgeId === "in" && turn.incomingDirection === 1 && turn.outgoingEdgeId === "in" && turn.outgoingDirection === -1
  ),
  "positive costs do not justify omitting a prohibited reversal when it could change the incoming turn state"
);
const conflictingRecord = { id: "second-source", steps: [{ intersections: [{ ...sourceTurn, entry: [true, true, false] }] }] };
assert.equal(
  deriveTurnRestrictions(junctionNodes, junctionEdges, [sourceRoute, conflictingRecord], [knownRoute]).restrictions.length,
  0,
  "contradictory incoming observations do not create a fabricated restriction"
);
const contradictingCandidate = {
  traversals: [
    { edgeId: "in", direction: 1 },
    { edgeId: "north", direction: 1 },
  ],
};
const candidateConflict = deriveTurnRestrictions(junctionNodes, junctionEdges, [sourceRoute], [knownRoute, contradictingCandidate]);
assert.equal(candidateConflict.restrictions.length, 0, "a known valid full source route cannot be invalidated by an approximate bearing match");
assert.equal(candidateConflict.evidence.sourceCandidateConflicts.length, 1, "the rejected inference remains visible for review");
console.log(
  `UDES v2 road network: ${graph.nodes.length} nodes, ${graph.edges.length} visible real edges, ${evidence.directedDistrictPairs} directed district pairs; invalid-geometry and route-gap regressions rejected.`
);
