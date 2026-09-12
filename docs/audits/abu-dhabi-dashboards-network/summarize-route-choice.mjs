import fs from "node:fs";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
const projectRoot = fileURLToPath(new URL("../../../", import.meta.url));
const rootPath = (relativePath) => path.resolve(projectRoot, relativePath);
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (p) => JSON.parse(fs.readFileSync(rootPath(p), "utf8"));
assert.ok(
  process.argv.slice(2).every((argument) => argument === "--check"),
  "Only --check is supported; default execution writes the summary artifact"
);
const rawPath = "tmp/udes-route-choice-after.json";
const tablePath = "docs/audits/abu-dhabi-urban-dynamics-2026-09-11/network-plausibility-osrm-table.json";
const r = read(rawPath);
const beforeArtifact = read("docs/audits/abu-dhabi-dashboards-network/route-choice-before.json");
const before = beforeArtifact.benchmark || beforeArtifact;
const o = read(tablePath);
assert.equal(before.benchSource, o.source, "Before/after comparisons must use the same frozen OSRM request");
assert.equal(o.response.code, "Ok", "The frozen OSRM table must be successful");
assert.equal(new Set(o.zoneOrder).size, o.zoneOrder.length, "OSRM table zone IDs must be unique");
const pointKey = (point) => {
  assert.ok(Array.isArray(point) && point.length === 2 && point.every(Number.isFinite), "A gateway must contain two finite coordinates");
  return point.map((value) => value.toFixed(5)).join(",");
};
const requestCoordinates = new URL(o.source).pathname
  .split("/driving/")[1]
  ?.split(";")
  .map((point) => point.split(",").map(Number));
assert.equal(requestCoordinates?.length, o.zoneOrder.length, "The table URL must contain one ordered coordinate per district");
let gateways = r.gatewayCoordinates;
let gatewayBasis = "Coordinates recorded by the observation probe";
if (!gateways) {
  const baselineBytes = fs.readFileSync(rootPath("assets/data/udes-v2/baseline.json"));
  assert.equal(
    sha256(baselineBytes),
    r.sourceHashes["assets/data/udes-v2/baseline.json"],
    "A legacy trace without gateway coordinates requires its exact hash-matched baseline"
  );
  const baseline = JSON.parse(baselineBytes);
  gateways = baseline.zones.map((zone) => ({
    zoneId: zone.id,
    requestedCoordinate: zone.centroid,
    graphCoordinate: baseline.roadGraph.nodes.find((node) => node.id === zone.networkNodeId).coord,
  }));
  gatewayBasis = "Recovered from the exact hash-matched baseline because this original trace predates recorded gateway coordinates";
}
assert.equal(gateways.length, o.zoneOrder.length);
assert.equal(new Set(gateways.map((gateway) => gateway.zoneId)).size, gateways.length);
for (const [index, zoneId] of o.zoneOrder.entries()) {
  const gateway = gateways.find((gateway) => gateway.zoneId === zoneId);
  assert.ok(gateway, `Missing captured gateway for ${zoneId}`);
  assert.equal(
    pointKey(gateway.requestedCoordinate),
    pointKey(requestCoordinates[index]),
    `${zoneId} OSRM request differs from the captured route gateway`
  );
  assert.equal(
    pointKey(gateway.graphCoordinate),
    pointKey(requestCoordinates[index]),
    `${zoneId} graph gateway differs at the graph's coordinate precision`
  );
}
for (const matrixName of ["durations", "distances"]) {
  const matrix = o.response[matrixName];
  assert.equal(matrix.length, o.zoneOrder.length);
  for (const [rowIndex, row] of matrix.entries()) {
    assert.equal(row.length, o.zoneOrder.length);
    assert.ok(
      row.every((value, columnIndex) => Number.isFinite(value) && (rowIndex === columnIndex ? value >= 0 : value > 0)),
      `OSRM ${matrixName} must contain finite positive interdistrict values`
    );
  }
}
const requiredPairs = new Set(o.zoneOrder.flatMap((from) => o.zoneOrder.filter((to) => to !== from).map((to) => `${from}->${to}`)));
assert.equal(r.freeFlowDetours.length, requiredPairs.size, "The probe must include every distinct ordered district pair exactly once");
assert.deepEqual(new Set(r.freeFlowDetours.map((route) => `${route.from}->${route.to}`)), requiredPairs);
const ix = new Map(o.zoneOrder.map((z, i) => [z, i]));
const bench = (a, b) => ({ osrmKm: o.response.distances[ix.get(a)][ix.get(b)] / 1000, osrmMin: o.response.durations[ix.get(a)][ix.get(b)] / 60 });
const rows = r.freeFlowDetours
  .map((p) => {
    const q = bench(p.from, p.to);
    return {
      from: p.from,
      to: p.to,
      modelKm: p.distanceKm,
      modelMin: p.freeFlowMinutes,
      engineFreeFlowMin: p.engineFreeFlowMinutes,
      ...q,
      distanceRatio: p.distanceKm / q.osrmKm,
      timeRatio: p.freeFlowMinutes / q.osrmMin,
      via: p.intermediateGateways,
    };
  })
  .sort((a, b) => b.timeRatio - a.timeRatio);
const named = [
  "yas-island->al-saadiyat",
  "al-saadiyat->yas-island",
  "rabdan-al-maqta->al-rawdah",
  "al-rawdah->rabdan-al-maqta",
  "al-reem->mbz-zayed-city",
  "al-zahiyah->mbz-zayed-city",
  "al-maryah->mbz-zayed-city",
];
const namedComparisons = named.map((id) => {
  const [a, b] = id.split("->");
  return { id, before: beforeArtifact.allFreeFlow.find((p) => p.from === a && p.to === b), after: rows.find((p) => p.from === a && p.to === b) };
});
const days = r.days.map((d) => ({
  day: d.day,
  modes: Object.fromEntries(
    ["car", "pt"].map((mode) => {
      const legs = d.legs.filter((l) => l.mode === mode).map((l) => ({ ...l, ...bench(l.from, l.to) }));
      return [
        mode,
        {
          legs: legs.length,
          over1_25: legs.filter((l) => l.distanceKm / l.osrmKm > 1.25).length,
          over1_5: legs.filter((l) => l.distanceKm / l.osrmKm > 1.5).length,
          over2: legs.filter((l) => l.distanceKm / l.osrmKm > 2).length,
          meanDistanceRatio: legs.reduce((s, l) => s + l.distanceKm / l.osrmKm, 0) / legs.length,
        },
      ];
    })
  ),
  byMode: d.byMode,
}));
const s = {
  freeFlowTimeRange: { minimum: Math.min(...rows.map((row) => row.timeRatio)), maximum: Math.max(...rows.map((row) => row.timeRatio)) },
  sourceHashes: r.sourceHashes,
  executionProvenance: r.executionProvenance || null,
  summaryProvenance: {
    rawTraceSha256: sha256(fs.readFileSync(rootPath(rawPath))),
    benchmarkArtifactSha256: sha256(fs.readFileSync(rootPath(tablePath))),
    benchmarkRetrievedAt: o.retrievedAt,
    benchmarkReportedResponseSha256: o.responseSha256,
    gatewayBasis,
    gatewayComparison: "Ordered request coordinates agree with captured gateways at the graph's five-decimal precision",
    controllerCapture: r.sourceHashes["assets/js/udes-v2-app.js"]
      ? "Recorded at probe execution"
      : "Not recorded in this original trace; no current controller hash has been substituted",
    summarizerSha256: sha256(fs.readFileSync(fileURLToPath(import.meta.url))),
  },
  scope: r.scope,
  instrumentationDoesNotChangeResult: r.instrumentationDoesNotChangeResult,
  prohibitedTurnsInObservedLegs: r.prohibitedTurnsInObservedLegs,
  benchSource: o.source,
  freeFlowSummary: {
    pairs: rows.length,
    over1_25Time: rows.filter((r) => r.timeRatio > 1.25).length,
    over1_5Time: rows.filter((r) => r.timeRatio > 1.5).length,
    over2Time: rows.filter((r) => r.timeRatio > 2).length,
  },
  worstFreeFlow: rows.slice(0, 10),
  namedComparisons,
  days,
  allFreeFlow: rows,
};
if (!process.argv.includes("--check"))
  fs.writeFileSync(rootPath("docs/audits/abu-dhabi-dashboards-network/route-choice-after.json"), JSON.stringify(s, null, 2) + "\n");
console.log(
  JSON.stringify(
    {
      sourceHashes: s.sourceHashes,
      summaryProvenance: s.summaryProvenance,
      scope: s.scope,
      freeFlowSummary: s.freeFlowSummary,
      maximumTimeRatio: rows[0].timeRatio,
      example: namedComparisons.find((p) => p.id === "al-reem->mbz-zayed-city"),
      days: s.days.map((d) => ({ day: d.day, modes: d.modes })),
    },
    null,
    2
  )
);
