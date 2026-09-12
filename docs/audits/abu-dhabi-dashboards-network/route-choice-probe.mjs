import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const projectRoot = fileURLToPath(new URL("../../../", import.meta.url));
const rootPath = (relativePath) => path.resolve(projectRoot, relativePath);
const paths = [
  "assets/js/udes-v2-worker.js",
  "assets/data/udes-v2/baseline.json",
  "assets/js/udes-v2-app.js",
  "docs/audits/abu-dhabi-dashboards-network/route-choice-probe.mjs",
];
const hashes = () =>
  Object.fromEntries(
    paths.map((p) => [
      p,
      crypto
        .createHash("sha256")
        .update(fs.readFileSync(rootPath(p)))
        .digest("hex"),
    ])
  );
const sourceHashes = hashes();
const executionStartedAt = new Date().toISOString();
const require = createRequire(import.meta.url);
const { UdesV2Engine } = require("../../../assets/js/udes-v2-worker.js");
const { PUBLIC_PRESETS } = require("../../../assets/js/udes-v2-app.js");
const baseline = require("../../../assets/data/udes-v2/baseline.json");
assert.deepEqual(hashes(), sourceHashes, "Source files changed while loading the observation inputs");
assert.ok(
  process.argv.slice(2).every((argument) => argument === "--describe-inputs"),
  "Only --describe-inputs is supported; default execution runs the full observation"
);
if (process.argv.includes("--describe-inputs")) {
  console.log(
    JSON.stringify({ status: "input-check-only; no simulation or artifact write", sourceHashes, referencePreset: PUBLIC_PRESETS.reference }, null, 2)
  );
  process.exit(0);
}
const edges = baseline.roadGraph.edges,
  nodes = baseline.roadGraph.nodes,
  zones = baseline.zones,
  candidates = baseline.roadGraph.candidateRoutes;
const ei = new Map(edges.map((e, i) => [e.id, i])),
  ni = new Map(nodes.map((n, i) => [n.id, i]));
const zoneById = new Map(zones.map((z) => [z.id, z]));
const sum = (a) => a.reduce((s, v) => s + v, 0);
const code = (s) => s.direction * (s.linkIndex + 1);
const candidateCodes = candidates.map((c) => ({ ...c, codes: c.traversals.map((t) => t.direction * (ei.get(t.edgeId) + 1)) }));
const observedTurns = new Set(candidateCodes.flatMap((c) => c.codes.slice(1).map((v, i) => `${c.codes[i]},${v}`)));
const serviceForCode = new Map();
const transitIds = new Set(baseline.transit.links.map((service) => service.candidateRouteId));
for (const c of candidateCodes.filter((c) => transitIds.has(c.id)))
  for (const v of c.codes) {
    if (!serviceForCode.has(v)) serviceForCode.set(v, new Set());
    serviceForCode.get(v).add(c.id);
  }
const candidateTurns = new Map(candidateCodes.map((c) => [c.id, new Set(c.codes.slice(1).map((v, i) => `${c.codes[i]},${v}`))]));
const toNode = (v) => {
  const e = edges[Math.abs(v) - 1];
  return v > 0 ? e.to : e.from;
};
const fromNode = (v) => {
  const e = edges[Math.abs(v) - 1];
  return v > 0 ? e.from : e.to;
};
const gatewayByNode = new Map(zones.map((z) => [z.networkNodeId, z.id]));
const metrics = (codes) => ({
  distanceKm: sum(codes.map((v) => edges[Math.abs(v) - 1].distanceKm)),
  freeFlowMinutes: sum(codes.map((v) => edges[Math.abs(v) - 1].freeFlowMinutes)),
});
const data = {
  schemaVersion: baseline.schemaVersion,
  zones,
  links: edges,
  nodes,
  candidateRoutes: candidates,
  turnRestrictions: baseline.roadGraph.turnRestrictions,
  transit: baseline.transit,
  calibration: baseline.calibration,
  assumptions: baseline.assumptions,
};
const emptyEngine = new UdesV2Engine({
  seed: 240124,
  data,
  config: { ...PUBLIC_PRESETS.reference, citizenCount: 2, enterpriseCount: 1, initialEmploymentRate: 0, startDate: "2024-01-01" },
});
const emptyMatrix = emptyEngine.buildPathMatrix("car");
const freePaths = {};
for (const [i, o] of zones.entries())
  for (const [j, d] of zones.entries()) {
    if (i === j) continue;
    const p = emptyMatrix[i][j];
    assert.ok(p, `Missing turn-legal car path ${o.id}->${d.id}`);
    const codes = p.steps.map(code);
    freePaths[`${o.id}->${d.id}`] = { from: o.id, to: d.id, codes, ...metrics(codes), engineFreeFlowMinutes: p.oneWayMinutes };
  }
function straightKm(a, b) {
  const rad = Math.PI / 180,
    lat = ((a[1] + b[1]) / 2) * rad;
  return Math.hypot((a[0] - b[0]) * 111.32 * Math.cos(lat), (a[1] - b[1]) * 110.574);
}
function serviceChanges(codes) {
  let dp = new Map();
  for (const [i, v] of codes.entries()) {
    const next = new Map();
    for (const route of serviceForCode.get(v) || []) {
      let best = Infinity;
      if (!i) best = 1;
      else
        for (const [previous, cost] of dp) {
          const through = previous === route && candidateTurns.get(route).has(`${codes[i - 1]},${v}`);
          best = Math.min(best, cost + (through ? 0 : 1));
        }
      next.set(route, best);
    }
    dp = next;
  }
  return Math.min(...dp.values()) - 1;
}
const observations = new Map();
let active = null;
const origCommute = UdesV2Engine.prototype.commuteCitizens,
  origApply = UdesV2Engine.prototype.applyCommute;
UdesV2Engine.prototype.commuteCitizens = function (...args) {
  if ([0, 30].includes(this.day)) active = { day: this.day, date: this.clock.date, legs: [] };
  const result = origCommute.apply(this, args);
  if (active) {
    active.daily = { ...this.daily };
    observations.set(this.day, active);
    active = null;
  }
  return result;
};
UdesV2Engine.prototype.applyCommute = function (citizen, mode, p, ...args) {
  if (active && p && ["car", "pt"].includes(mode)) {
    for (const [part, from, to] of [
      ["outboundSteps", citizen.homeZoneId, citizen.workZoneId],
      ["returnSteps", citizen.workZoneId, citizen.homeZoneId],
    ]) {
      const codes = p[part].map(code);
      active.legs.push({ citizenId: citizen.id, mode, from, to, weight: citizen.weight, codes, ...metrics(codes) });
    }
  }
  return origApply.call(this, citizen, mode, p, ...args);
};
const options = { seed: 240124, config: { startDate: "2024-01-01", endogenousEnterpriseDynamics: true, ...PUBLIC_PRESETS.reference }, data };
const inputConfig = structuredClone(options.config);
const engine = new UdesV2Engine(options);
const resolvedOpeningConfig = structuredClone(engine.config);
engine.step(30, { historyLimit: 0 });
UdesV2Engine.prototype.commuteCitizens = origCommute;
UdesV2Engine.prototype.applyCommute = origApply;
const control = new UdesV2Engine(options);
control.step(30, { historyLimit: 0 });
assert.deepEqual(engine.snapshot({ historyLimit: 0 }), control.snapshot({ historyLimit: 0 }), "Instrumentation must not change the simulated result");
const forbidden = new Set(
  (data.turnRestrictions || []).map(
    (t) => `${t.incomingDirection * (ei.get(t.incomingEdgeId) + 1)},${t.outgoingDirection * (ei.get(t.outgoingEdgeId) + 1)}`
  )
);
for (const d of observations.values())
  for (const l of d.legs)
    for (let i = 1; i < l.codes.length; i++)
      assert.ok(!forbidden.has(`${l.codes[i - 1]},${l.codes[i]}`), `Illegal ${l.mode} through-turn on day ${d.day}`);
const candidateComparisons = candidateCodes
  .map((c) => {
    const p = freePaths[`${c.from}->${c.to}`],
      own = metrics(c.codes);
    return {
      id: c.id,
      from: c.from,
      to: c.to,
      referenceKm: c.distanceKm,
      referenceMin: c.freeFlowMinutes,
      candidateEdgeKm: own.distanceKm,
      candidateEdgeMin: own.freeFlowMinutes,
      shortestKm: p.distanceKm,
      shortestMin: p.freeFlowMinutes,
      shortestCodes: p.codes,
      distanceRatio: p.distanceKm / c.distanceKm,
      timeRatio: p.freeFlowMinutes / c.freeFlowMinutes,
      unobservedTurns: p.codes
        .slice(1)
        .map((v, i) => `${p.codes[i]},${v}`)
        .filter((t) => !observedTurns.has(t)),
    };
  })
  .sort((a, b) => a.timeRatio - b.timeRatio);
const detours = Object.values(freePaths)
  .map((p) => ({
    ...p,
    straightKm: straightKm(zoneById.get(p.from).centroid, zoneById.get(p.to).centroid),
    intermediateGateways: [
      ...new Set(
        p.codes
          .map(toNode)
          .map((n) => gatewayByNode.get(n))
          .filter((z) => z && z !== p.from && z !== p.to)
      ),
    ],
  }))
  .map((p) => ({ ...p, circuity: p.distanceKm / p.straightKm }))
  .sort((a, b) => b.circuity - a.circuity);
const days = [...observations.values()].map((o) => {
  const turnCounts = new Map();
  for (const leg of o.legs) {
    leg.unobservedTurns = leg.codes
      .slice(1)
      .map((v, i) => `${leg.codes[i]},${v}`)
      .filter((t) => !observedTurns.has(t));
    leg.minimumServiceChanges = leg.mode === "pt" ? serviceChanges(leg.codes) : null;
    leg.intermediateGateways = [
      ...new Set(
        leg.codes
          .map(toNode)
          .map((n) => gatewayByNode.get(n))
          .filter((z) => z && z !== leg.from && z !== leg.to)
      ),
    ];
    leg.freeFlowDistanceRatio = leg.distanceKm / freePaths[`${leg.from}->${leg.to}`].distanceKm;
    for (const turn of leg.unobservedTurns) {
      const item = turnCounts.get(turn) || { turn, carLegs: 0, ptLegs: 0 };
      item[`${leg.mode}Legs`]++;
      turnCounts.set(turn, item);
    }
  }
  const byMode = Object.fromEntries(
    ["car", "pt"].map((mode) => {
      const legs = o.legs.filter((l) => l.mode === mode);
      return [
        mode,
        {
          legCount: legs.length,
          withUnobservedTurn: legs.filter((l) => l.unobservedTurns.length).length,
          withIntermediateGateway: legs.filter((l) => l.intermediateGateways.length).length,
          meanFreeFlowDistanceRatio: sum(legs.map((l) => l.freeFlowDistanceRatio)) / legs.length,
          maxFreeFlowDistanceRatio: Math.max(...legs.map((l) => l.freeFlowDistanceRatio)),
          serviceChanges:
            mode === "pt"
              ? Object.fromEntries(
                  [...new Set(legs.map((l) => l.minimumServiceChanges))]
                    .sort()
                    .map((n) => [n, legs.filter((l) => l.minimumServiceChanges === n).length])
                )
              : null,
        },
      ];
    })
  );
  const uniqueLegs = [...new Map(o.legs.map((l) => [`${l.mode}:${l.codes.join(",")}`, l])).values()];
  return {
    day: o.day,
    date: o.date,
    daily: o.daily,
    byMode,
    unobservedTurns: [...turnCounts.values()].sort((a, b) => b.carLegs + b.ptLegs - (a.carLegs + a.ptLegs)),
    largestDetours: uniqueLegs.sort((a, b) => b.freeFlowDistanceRatio - a.freeFlowDistanceRatio).slice(0, 30),
    legs: o.legs,
  };
});
assert.deepEqual(hashes(), sourceHashes, "Source files changed during observation");
const result = {
  sourceHashes,
  executionProvenance: {
    executionStartedAt,
    seed: options.seed,
    observedDays: [0, 30],
    steppedDays: 30,
    referencePreset: structuredClone(PUBLIC_PRESETS.reference),
    inputConfig,
    resolvedOpeningConfig,
    note: "Hashes include the controller supplying PUBLIC_PRESETS and this observation script; all source hashes are verified again after the run.",
  },
  gatewayCoordinates: zones.map((zone) => ({
    zoneId: zone.id,
    networkNodeId: zone.networkNodeId,
    requestedCoordinate: zone.centroid,
    graphCoordinate: nodes.find((node) => node.id === zone.networkNodeId).coord,
  })),
  scope: {
    residentCohorts: engine.citizens.length,
    citizenWeight: engine.config.citizenWeight,
    employerCohorts: engine.enterprises.length,
    physicalEdges: edges.length,
    turnRestrictions: forbidden.size,
    transitServices: transitIds.size,
  },
  instrumentationDoesNotChangeResult: true,
  prohibitedTurnsInObservedLegs: 0,
  candidateComparisons,
  freeFlowDetours: detours,
  days,
};
fs.mkdirSync(rootPath("tmp"), { recursive: true });
fs.writeFileSync(rootPath("tmp/udes-route-choice-after.json"), JSON.stringify(result, null, 2));
console.log(
  JSON.stringify(
    {
      sourceHashes,
      scope: result.scope,
      candidateCount: candidates.length,
      candidateShortcuts: candidateComparisons.slice(0, 8),
      worstCircuity: detours.slice(0, 12),
      days: days.map((d) => ({
        day: d.day,
        byMode: d.byMode,
        topTurns: d.unobservedTurns.slice(0, 10),
        largestDetours: d.largestDetours.slice(0, 5),
      })),
    },
    null,
    2
  )
);
