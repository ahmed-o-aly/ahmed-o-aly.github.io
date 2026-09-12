import fs from "node:fs";
import zlib from "node:zlib";
import crypto from "node:crypto";
import assert from "node:assert/strict";

// Read-only geometry/source audit. Run from repository root.
const label = process.argv.find((argument) => argument.startsWith("--label="))?.slice(8);
assert.ok(!label || /^[a-z0-9-]+$/.test(label), "Audit labels must be simple filename suffixes");
const stem = `docs/audits/abu-dhabi-urban-dynamics-2026-09-11/network-geometry-audit${label ? `-${label}` : ""}`;
const baselineBytes = fs.readFileSync("assets/data/udes-v2/baseline.json");
const baseline = JSON.parse(baselineBytes);
const graph = baseline.roadGraph;
const manifest = JSON.parse(fs.readFileSync("scripts/data/udes-v2-sources/manifest.json", "utf8"));
const key = (point) => point.map((value) => Number(value).toFixed(5)).join(",");
const fullKey = (point) => point.map((value) => Number(value).toFixed(6)).join(",");
const radians = (value) => (value * Math.PI) / 180;
const distance = (a, b) => {
  const dx = radians(b[0] - a[0]) * Math.cos(radians((a[1] + b[1]) / 2));
  const dy = radians(b[1] - a[1]);
  return Math.hypot(dx, dy) * 6371;
};
const bearing = (a, b) => ((Math.atan2((b[0] - a[0]) * Math.cos(radians((a[1] + b[1]) / 2)), b[1] - a[1]) * 180) / Math.PI + 360) % 360;
const bearingGap = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
const edgeById = new Map(graph.edges.map((edge) => [edge.id, edge]));
const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
const intersections = new Map();
const frozenRoutes = [];
const rawDirectedSegments = new Set();
const originalZoneByPoint = new Map(baseline.zones.map((zone) => [fullKey(zone.networkGateway.routedSnapCoordinate || zone.centroid), zone.id]));
for (const request of manifest.requests.filter((request) => request.url.includes("/route/"))) {
  const wrapper = JSON.parse(zlib.gunzipSync(fs.readFileSync(`scripts/data/udes-v2-sources/${request.file}`)));
  const payload = JSON.parse(wrapper.responseText);
  const route = payload.routes[0];
  const from = originalZoneByPoint.get(fullKey(payload.waypoints[0].location));
  const to = originalZoneByPoint.get(fullKey(payload.waypoints.at(-1).location));
  assert.ok(from && to, "Every frozen route matches its two original district gateways");
  const coordinates = [];
  for (const step of route.legs.flatMap((leg) => leg.steps)) {
    for (const point of step.geometry.coordinates) if (key(coordinates.at(-1) || [0, 0]) !== key(point)) coordinates.push(point);
    for (const intersection of step.intersections || []) {
      const at = key(intersection.location);
      if (!intersections.has(at)) intersections.set(at, []);
      intersections.get(at).push({ ...intersection, sourceFile: request.file, sourceRoute: `${from}--${to}` });
    }
  }
  for (let i = 1; i < coordinates.length; i++) rawDirectedSegments.add(`${key(coordinates[i - 1])}|${key(coordinates[i])}`);
  frozenRoutes.push({
    id: `${from}--${to}`,
    from,
    to,
    coordinates,
    durationMinutes: route.duration / 60,
    distanceKm: route.distance / 1000,
    sourceFile: request.file,
  });
}

function expand(traversals) {
  const points = [];
  for (const traversal of traversals) {
    const edge = edgeById.get(traversal.edgeId);
    const coordinates = traversal.direction === 1 ? edge.geometry.coordinates : [...edge.geometry.coordinates].reverse();
    for (const coordinate of coordinates) if (key(points.at(-1) || [0, 0]) !== key(coordinate)) points.push(coordinate);
  }
  return points;
}
const cachedCandidateComparisons = graph.candidateRoutes.map((candidate) => {
  const original = frozenRoutes.find((route) => route.id === candidate.id);
  const fromPoint = nodeById.get(candidate.fromNodeId).coord;
  const toPoint = nodeById.get(candidate.toNodeId).coord;
  const start = original.coordinates.findIndex((point) => key(point) === key(fromPoint));
  const end = original.coordinates.findLastIndex((point) => key(point) === key(toPoint));
  assert.ok(start >= 0 && end > start, "Retained gateways exist in source route geometry");
  const trimmed = original.coordinates.slice(start, end + 1);
  const expanded = expand(candidate.traversals);
  const match = trimmed.map(key).join(";") === expanded.map(key).join(";");
  const geometryDistance = trimmed.slice(1).reduce((total, point, index) => total + distance(trimmed[index], point), 0);
  return {
    id: candidate.id,
    sourceFile: original.sourceFile,
    exactQuantizedGeometryMatchAfterGatewayTrim: match,
    frozenOriginalDistanceKm: original.distanceKm,
    frozenOriginalDurationMinutes: original.durationMinutes,
    candidateDistanceKm: candidate.distanceKm,
    candidateDurationMinutes: candidate.freeFlowMinutes,
    quantizedGeometryDistanceKm: geometryDistance,
    durationDifferenceMinutes: candidate.freeFlowMinutes - original.durationMinutes,
    removedSourcePoints: start + original.coordinates.length - end - 1,
    repeatedNodes: candidate.traversals.reduce(
      (state, traversal) => {
        const edge = edgeById.get(traversal.edgeId),
          next = traversal.direction === 1 ? edge.to : edge.from;
        if (state.seen.includes(next)) state.repeated.push(next);
        state.seen.push(next);
        return state;
      },
      { seen: [candidate.fromNodeId], repeated: [] }
    ).repeated,
  };
});

const directionalGeometryViolations = [];
const incoming = new Map(graph.nodes.map((node) => [node.id, []]));
const outgoing = new Map(graph.nodes.map((node) => [node.id, []]));
for (const edge of graph.edges) {
  for (const direction of [1, -1]) {
    if (!(direction === 1 ? edge.allowAB : edge.allowBA)) continue;
    const points = direction === 1 ? edge.geometry.coordinates : [...edge.geometry.coordinates].reverse();
    for (let i = 1; i < points.length; i++)
      if (!rawDirectedSegments.has(`${key(points[i - 1])}|${key(points[i])}`))
        directionalGeometryViolations.push({ edgeId: edge.id, direction, from: points[i - 1], to: points[i] });
    const item = { edgeId: edge.id, direction, points };
    incoming.get(direction === 1 ? edge.to : edge.from).push(item);
    outgoing.get(direction === 1 ? edge.from : edge.to).push(item);
  }
}
const outwardBearing = (points) => {
  const origin = points[0];
  const target = points.slice(1).find((point) => distance(origin, point) >= 0.01) || points.at(-1);
  return { bearing: bearing(origin, target), spanMeters: distance(origin, target) * 1000 };
};
const prohibitedTurns = [];
const ambiguousTurns = [];
for (const node of graph.nodes) {
  const records = intersections.get(key(node.coord)) || [];
  for (const entry of incoming.get(node.id))
    for (const exit of outgoing.get(node.id)) {
      const inHeading = outwardBearing([...entry.points].reverse());
      const outHeading = outwardBearing(exit.points);
      if (inHeading.spanMeters < 5 || outHeading.spanMeters < 5) continue;
      const matched = records
        .filter((record) => Number.isInteger(record.in) && bearingGap(record.bearings[record.in], inHeading.bearing) <= 15)
        .map((record) => {
          const candidates = record.bearings
            .map((value, index) => ({ index, gap: bearingGap(value, outHeading.bearing) }))
            .sort((a, b) => a.gap - b.gap);
          return { record, nearest: candidates[0], next: candidates[1] };
        })
        .filter(({ nearest, next }) => nearest.gap <= 15 && (!next || next.gap - nearest.gap >= 10));
      if (!matched.length) continue;
      const forbidden = matched.filter(({ record, nearest }) => record.entry[nearest.index] === false);
      if (!forbidden.length) continue;
      const detail = {
        nodeId: node.id,
        coordinate: node.coord,
        incomingEdge: entry.edgeId,
        incomingDirection: entry.direction,
        outgoingEdge: exit.edgeId,
        outgoingDirection: exit.direction,
        geometryIncomingBearingFromIntersection: inHeading.bearing,
        geometryOutgoingBearing: outHeading.bearing,
        matchingIncomingObservations: matched.length,
        forbiddenObservations: forbidden.length,
        evidence: forbidden.slice(0, 3).map(({ record, nearest }) => ({
          sourceRoute: record.sourceRoute,
          sourceFile: record.sourceFile,
          location: record.location,
          bearings: record.bearings,
          entry: record.entry,
          in: record.in,
          selectedOutIndex: nearest.index,
          sourceOutIndex: record.out,
        })),
      };
      (forbidden.length === matched.length ? prohibitedTurns : ambiguousTurns).push(detail);
    }
}
const gatewayAudit = baseline.zones.map((zone) => {
  const node = nodeById.get(zone.networkNodeId);
  const entry = incoming.get(node.id),
    exit = outgoing.get(node.id);
  return {
    zoneId: zone.id,
    coordinate: node.coord,
    population2024: zone.population2024,
    distanceToGeometricCentroidKm: distance(node.coord, zone.geometryCentroid),
    requestedActivityPoint: zone.networkGateway.requestedActivityPoint,
    incomingEdges: entry.map((item) => item.edgeId),
    outgoingEdges: exit.map((item) => item.edgeId),
    incidentRoads: [...new Set([...entry, ...exit].map((item) => edgeById.get(item.edgeId).primaryRoad))],
  };
});
const report = {
  generatedAt: new Date().toISOString(),
  baselineSha256: crypto.createHash("sha256").update(baselineBytes).digest("hex"),
  method: `Compare all ${frozenRoutes.length} frozen routes after original gateway trimming and 5-decimal quantization; check every retained directed geometry step against raw OSRM routes. Compare graph turns against cached intersection restrictions using incoming and outgoing bearings within 15 degrees, unique outgoing match margin >=10 degrees, and >=5m geometry direction spans. Forbidden classifications require all matched same-incoming observations to agree; unmatched turns remain unknown.`,
  osrmIntersectionDocumentation: "https://project-osrm.org/docs/v5.24.0/api/#intersection-object",
  counts: {
    zones: baseline.zones.length,
    nodes: graph.nodes.length,
    edges: graph.edges.length,
    frozenRoutes: frozenRoutes.length,
    geometryMismatches: cachedCandidateComparisons.filter((item) => !item.exactQuantizedGeometryMatchAfterGatewayTrim).length,
    directionalGeometryViolations: directionalGeometryViolations.length,
    unambiguousProhibitedTurns: prohibitedTurns.length,
    ambiguousTurns: ambiguousTurns.length,
  },
  cachedCandidateComparisons,
  directionalGeometryViolations,
  prohibitedTurns,
  ambiguousTurns,
  gatewayAudit,
};
fs.writeFileSync(stem + ".json", JSON.stringify(report, null, 2) + "\n");
console.log(
  JSON.stringify(
    {
      counts: report.counts,
      prohibitedTurns,
      geometryMismatches: cachedCandidateComparisons.filter((item) => !item.exactQuantizedGeometryMatchAfterGatewayTrim),
      largestDurationChanges: [...cachedCandidateComparisons]
        .sort((a, b) => Math.abs(b.durationDifferenceMinutes) - Math.abs(a.durationDifferenceMinutes))
        .slice(0, 8),
      gateways: gatewayAudit,
    },
    null,
    2
  )
);
