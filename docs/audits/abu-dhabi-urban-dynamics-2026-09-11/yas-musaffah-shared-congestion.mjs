import fs from "node:fs";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import assert from "node:assert/strict";

// Run from the repository root. Observes the real assignment without changing it.
const require = createRequire(import.meta.url);
const { UdesV2Engine } = require("../../../assets/js/udes-v2-worker.js");
const { PUBLIC_PRESETS } = require("../../../assets/js/udes-v2-app.js");
const baseline = require("../../../assets/data/udes-v2/baseline.json");
const runLabel = process.argv[2] || "before";
if (!/^[a-z0-9-]+$/.test(runLabel)) throw new Error("Use a short alphanumeric run label, e.g. after");
const output = `docs/audits/abu-dhabi-urban-dynamics-2026-09-11/yas-musaffah-shared-congestion${runLabel === "before" ? "" : `-${runLabel}`}.json`;
const sourcePaths = ["assets/js/udes-v2-worker.js", "assets/js/udes-v2-app.js", "assets/data/udes-v2/baseline.json", "scripts/build-udes-v2-data.mjs"];
const sourceHashes = Object.fromEntries(sourcePaths.map((path) => [path, crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex")]));
const originalApply = UdesV2Engine.prototype.applyCommute;
const originalCommute = UdesV2Engine.prototype.commuteCitizens;
const selectedDays = new Set([0, 30]);
const observations = new Map();
const targetOd = "yas-island->musaffah";
let observing;
UdesV2Engine.prototype.applyCommute = function(citizen, mode, path, ...args) {
  if (observing && mode === "car") {
    const od = `${citizen.homeZoneId}->${citizen.workZoneId}`;
    const vehicles = citizen.weight / this.config.carOccupancy;
    for (const step of path?.steps || []) {
      const key = `${step.linkIndex}:${step.direction}`;
      const contributors = observing.contributors[key] ||= {};
      contributors[od] = (contributors[od] || 0) + vehicles;
    }
    if (od === targetOd) {
      const signature = path.steps.map((step) => `${step.linkIndex}:${step.direction}`).join(",");
      const route = observing.routes[signature] ||= { cohorts: 0, representedResidents: 0, outboundSteps: path.outboundSteps, returnSteps: path.returnSteps };
      route.cohorts++;
      route.representedResidents += citizen.weight;
    }
  }
  return originalApply.call(this, citizen, mode, path, ...args);
};
UdesV2Engine.prototype.commuteCitizens = function(...args) {
  if (selectedDays.has(this.day)) observing = { date: this.clock.date, contributors: {}, routes: {} };
  const result = originalCommute.apply(this, args);
  if (observing) {
    observations.set(this.day, observing);
    observing = null;
  }
  return result;
};
const data = { schemaVersion: baseline.schemaVersion, zones: baseline.zones, links: baseline.roadGraph.edges, nodes: baseline.roadGraph.nodes, candidateRoutes: baseline.roadGraph.candidateRoutes, transit: baseline.transit, calibration: baseline.calibration, assumptions: baseline.assumptions };
const config = { startDate: "2024-01-01", endogenousEnterpriseDynamics: true, ...PUBLIC_PRESETS.reference };
const engine = new UdesV2Engine({ data, config, seed: 240124 });
const sum = (values) => values.reduce((a, b) => a + b, 0);

function capture() {
  const observed = observations.get(engine.day);
  const row = (step) => {
    const edge = baseline.roadGraph.edges[step.linkIndex];
    const live = engine.links[step.linkIndex];
    const contributors = Object.entries(observed.contributors[`${step.linkIndex}:${step.direction}`] || {}).map(([od, vehicles]) => ({ od, vehicles })).sort((a, b) => b.vehicles - a.vehicles);
    const from = step.direction === 1 ? edge.from : edge.to;
    const to = step.direction === 1 ? edge.to : edge.from;
    return {
      id: edge.id, direction: step.direction === 1 ? "AB" : "BA", from, to,
      fromZoneGateway: baseline.roadGraph.nodes.find((node) => node.id === from)?.zoneIds,
      toZoneGateway: baseline.roadGraph.nodes.find((node) => node.id === to)?.zoneIds,
      primaryRoad: edge.primaryRoad, distanceKm: edge.distanceKm, freeFlowMinutes: edge.freeFlowMinutes,
      loadBearing: edge.loadBearing, capacityExclusionReason: edge.capacityExclusionReason,
      aggregatedZonePortalFor: edge.aggregatedZonePortalFor,
      officialMainRoadMatch: edge.officialMainRoadMatch,
      candidateRouteIds: edge.candidateRouteIds,
      assignedCarVehicles: sum(contributors.map(({ vehicles }) => vehicles)),
      recordedCarVehicles: step.direction === 1 ? live.loadABVehicles : live.loadBAVehicles,
      finiteCongestionCapacityVehicles: edge.loadBearing ? engine.linkCapacity(live, "car", step.direction) : null,
      capacityResult: edge.loadBearing ? "finite" : "Infinity",
      actualTravelMinutes: engine.linkTravelTime(live, step.direction, "car"),
      targetOdVehicles: contributors.find(({ od }) => od === targetOd)?.vehicles || 0,
      contributors,
      contributesThroughUnrelatedPortal: edge.aggregatedZonePortalFor && contributors.some(({ od }) => !od.split("->").includes(edge.aggregatedZonePortalFor)),
    };
  };
  const routes = Object.values(observed.routes).map((route) => ({
    cohorts: route.cohorts, representedResidents: route.representedResidents,
    outbound: route.outboundSteps.map(row), inbound: route.returnSteps.map(row),
  }));
  for (const route of routes) {
    for (const [leg, origin, destination] of [["outbound", "yas-island", "musaffah"], ["inbound", "musaffah", "yas-island"]]) {
      const rows = route[leg];
      assert.ok(rows.length > 0, "Interdistrict car route has actual physical steps");
      assert.ok(rows[0].fromZoneGateway.includes(origin), "Route starts at the correct district gateway");
      assert.ok(rows.at(-1).toZoneGateway.includes(destination), "Route ends at the correct district gateway");
      for (let i = 1; i < rows.length; i++) assert.equal(rows[i - 1].to, rows[i].from, "Every physical route segment meets the next at a shared node");
    }
  }
  const allExcludedDirections = Object.keys(observed.contributors).map((key) => {
    const [index, direction] = key.split(":").map(Number);
    return row({ linkIndex: index, direction });
  }).filter((edge) => !edge.loadBearing);
  const reconciliation = [];
  let checkedDirections = 0;
  let maximumAbsoluteDifference = 0;
  for (const link of engine.links) {
    for (const direction of [1, -1]) {
      if (!(direction === 1 ? link.allowAB : link.allowBA)) continue;
      const recorded = direction === 1 ? link.loadABVehicles : link.loadBAVehicles;
      const contributions = observed.contributors[`${link.index}:${direction}`] || {};
      const assigned = sum(Object.values(contributions));
      const difference = Math.abs(recorded - assigned);
      checkedDirections++;
      maximumAbsoluteDifference = Math.max(maximumAbsoluteDifference, difference);
      if (difference > 0.000001) reconciliation.push({ id: link.id, direction, loadBearing: link.loadBearing, recorded, assigned, difference });
    }
  }
  return { day: engine.day, date: observed.date, routes, selectedRouteContinuity: "passed",
    directionalCarLoadReconciliation: { rule: "Recorded directional vehicle load equals the sum of actual assigned car route traversals from every home/work OD, tolerance 1e-6 vehicles", checkedDirections, maximumAbsoluteDifference, failures: reconciliation },
    excludedDirectionsUsedByOdsWithoutPortalDistrict: allExcludedDirections.filter((edge) => edge.contributesThroughUnrelatedPortal),
    excludedDirectionsWithOfficialArterialMatch: allExcludedDirections.filter((edge) => edge.officialMainRoadMatch),
    invariantFailures: engine.validateInvariants(),
  };
}

const opening = capture();
engine.step(30, { mapFrame: "none", historyLimit: 0 });
const day30 = capture();
UdesV2Engine.prototype.applyCommute = originalApply;
UdesV2Engine.prototype.commuteCitizens = originalCommute;
const plain = new UdesV2Engine({ data, config, seed: 240124 });
const plainFinal = plain.step(30, { mapFrame: "none", historyLimit: 0 });
const instrumentationPreservesSnapshot = JSON.stringify(plainFinal) === JSON.stringify(engine.snapshot({ mapFrame: "none", historyLimit: 0 }));
if (!instrumentationPreservesSnapshot) throw new Error("Observation changed the model snapshot");
const graphCapacity = {
  physicalEdges: engine.links.length,
  capacityBearingEdges: engine.links.filter((link) => link.loadBearing).length,
  allPermittedDirectionsHaveFinitePositiveCapacity: engine.links.every((link) => [1, -1].every((direction) => !(direction === 1 ? link.allowAB : link.allowBA) || Number.isFinite(engine.linkCapacity(link, "car", direction)) && engine.linkCapacity(link, "car", direction) > 0)),
};
if (runLabel === "after") {
  assert.equal(graphCapacity.capacityBearingEdges, graphCapacity.physicalEdges, "Every retained physical road contributes to congestion");
  assert.ok(graphCapacity.allPermittedDirectionsHaveFinitePositiveCapacity, "Actual directed roads have finite positive capacities");
  for (const day of [opening, day30]) assert.equal(day.directionalCarLoadReconciliation.failures.length, 0, "Every direction records the summed OD assignment");
}
const report = { generatedAt: new Date().toISOString(), runLabel, sourceHashes, seed: 240124, config, residentCohorts: engine.citizens.length, employerCohorts: engine.enterprises.length, graphCapacity, targetOd, instrumentationPreservesSnapshot, days: [opening, day30] };
// Retain exact total accounting and the largest contributors without repeating
// all 100+ OD identities on dozens of adjacent geometry fragments.
const compactRow = ({ contributors, ...edge }) => ({ ...edge, contributorCount: contributors.length, contributors: contributors.slice(0, 6), remainingContributorsVehicles: sum(contributors.slice(6).map((item) => item.vehicles)) });
const compactReport = { ...report, days: report.days.map((day) => ({ ...day, routes: day.routes.map((route) => ({ ...route, outbound: route.outbound.map(compactRow), inbound: route.inbound.map(compactRow) })), excludedDirectionsUsedByOdsWithoutPortalDistrict: day.excludedDirectionsUsedByOdsWithoutPortalDistrict.map(compactRow), excludedDirectionsWithOfficialArterialMatch: day.excludedDirectionsWithOfficialArterialMatch.map(compactRow) })) };
fs.writeFileSync(output, JSON.stringify(compactReport, null, 2) + "\n");
console.log(JSON.stringify({ output, instrumentationPreservesSnapshot, days: report.days.map((day) => ({ day: day.day, routes: day.routes.map((route) => ({ cohorts: route.cohorts, representedResidents: route.representedResidents, outbound: route.outbound.map(({ id, primaryRoad, distanceKm, loadBearing, capacityExclusionReason, assignedCarVehicles, recordedCarVehicles, targetOdVehicles, contributors, aggregatedZonePortalFor }) => ({ id, primaryRoad, distanceKm, loadBearing, capacityExclusionReason, assignedCarVehicles, recordedCarVehicles, targetOdVehicles, otherOdPairs: contributors.length - 1, aggregatedZonePortalFor })), inboundSteps: route.inbound.length })), throughUnrelatedPortalDirections: day.excludedDirectionsUsedByOdsWithoutPortalDistrict.length, excludedOfficialDirections: day.excludedDirectionsWithOfficialArterialMatch.length })) }, null, 2));
