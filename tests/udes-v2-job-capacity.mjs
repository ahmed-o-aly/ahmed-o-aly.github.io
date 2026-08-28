import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { UdesV2Engine } = require("../assets/js/udes-v2-worker.js");
const { PUBLIC_PRESETS } = require("../assets/js/udes-v2-app.js");
const baseline = require("../assets/data/udes-v2/baseline.json");

const data = {
  zones: baseline.zones,
  links: baseline.roadGraph.edges,
  nodes: baseline.roadGraph.nodes,
  candidateRoutes: baseline.roadGraph.candidateRoutes,
  transit: baseline.transit,
};

function createEngine(config = {}, seed = 53117) {
  return new UdesV2Engine({
    data,
    seed,
    config: {
      startDate: "2024-01-01",
      citizenCount: 607,
      citizenWeight: 2500,
      enterpriseCount: 60,
      initialEmploymentRate: 0.67,
      maxDailyLaborMatches: 24,
      ...PUBLIC_PRESETS.reference,
      ...config,
    },
  });
}

function plannedSlots(engine, zone) {
  return [...zone.enterpriseIds].reduce((total, enterpriseId) => total + engine.enterpriseById.get(enterpriseId).maxJobSlots, 0);
}

const initialized = createEngine();
for (const zone of initialized.zones) {
  assert.ok(
    plannedSlots(initialized, zone) <= zone.requestedJobCapacityAgents,
    `${zone.id}: initialization keeps planned firm slots inside the requested zoned job capacity`
  );
}
assert.deepEqual(initialized.validateInvariants(), [], "zoned initialization preserves all engine invariants");

// A full zone cannot add another firm slot or accept a relocating firm. This
// directly exercises the same guards used by growth and relocation dynamics.
const constrained = createEngine({ endogenousEnterpriseDynamics: false }, 53118);
const origin = constrained.zones.find((zone) => zone.enterpriseIds.size > 0);
const enterprise = constrained.enterpriseById.get(origin.enterpriseIds.values().next().value);
origin.requestedJobCapacityAgents = plannedSlots(constrained, origin);
origin.jobCapacityAgents = constrained.effectiveZoneJobCapacityAgents(origin);
const slotsBeforeBlockedGrowth = enterprise.maxJobSlots;
enterprise.state = "Grow";
constrained.applyEnterpriseGrowth(enterprise);
assert.equal(enterprise.maxJobSlots, slotsBeforeBlockedGrowth, "growth pauses at the zoned job-slot ceiling");
assert.equal(enterprise.state, "Working", "a capacity-paused firm returns to Working rather than remaining stuck in Grow");

const fullTarget = constrained.zones.find((zone) => zone !== origin && zone.enterpriseIds.size > 0);
fullTarget.requestedJobCapacityAgents = plannedSlots(constrained, fullTarget);
fullTarget.jobCapacityAgents = constrained.effectiveZoneJobCapacityAgents(fullTarget);
assert.equal(
  constrained.moveEnterprise(enterprise, fullTarget.id, "job-capacity-regression", true),
  false,
  "a full target zone rejects a relocating firm's planned slots"
);

// Live downscaling is explicit: requested capacity is binding for new supply,
// while current planned slots are grandfathered as the effective capacity so
// the policy does not silently evict workers or firms.
const downscaled = createEngine({}, 53119);
const downscaleZone = downscaled.zones
  .filter((zone) => zone.enterpriseIds.size > 0)
  .sort((a, b) => plannedSlots(downscaled, b) - plannedSlots(downscaled, a))[0];
downscaled.configure({ policyScopeZoneId: downscaleZone.id, businessCapacityMultiplier: 0.25 });
const downscaleMetric = downscaled.snapshot().zones.find((zone) => zone.id === downscaleZone.id);
assert.ok(
  downscaleMetric.requestedZonedJobCapacityRepresented < downscaleMetric.zonedJobCapacityRepresented,
  "live downscaling reports requested capacity separately from grandfathered effective capacity"
);
assert.equal(
  downscaleMetric.zonedJobCapacityGrandfatheredRepresented,
  downscaleMetric.zonedJobCapacityRepresented - downscaleMetric.requestedZonedJobCapacityRepresented,
  "the reported grandfathered stock reconciles requested and effective zoned capacity"
);

// Restart relocation must evaluate the proposed minimum-scale replacement,
// not the predecessor's former planned size.
const restartEngine = createEngine({}, 53120);
const restarting = restartEngine.enterprises.find((candidate) => candidate.employeeIds.size > 0);
restarting.maxJobSlots = Math.max(restarting.employeeIds.size, restartEngine.config.firmMinimumJobSlots + 5);
let capturedRestartSlots = null;
const originalMoveEnterprise = restartEngine.moveEnterprise.bind(restartEngine);
restartEngine.moveEnterprise = (...args) => {
  capturedRestartSlots = args[5];
  return originalMoveEnterprise(...args);
};
restartEngine.restartEnterprise(restarting);
assert.equal(
  capturedRestartSlots,
  restartEngine.config.firmMinimumJobSlots,
  "restart relocation passes the replacement firm's explicit minimum slot requirement"
);
assert.equal(restarting.maxJobSlots, restartEngine.config.firmMinimumJobSlots, "the restarted firm reopens at that explicit scale");

// After a warm-started workday, stored route traversals and physical link loads
// must still describe exactly the same assignment—prior routes are a path-choice
// starting point, never extra background traffic in reported loads.
const warm = createEngine({}, 53121);
warm.step(1);
const expected = warm.links.map(() => ({ abCar: 0, baCar: 0, abPt: 0, baPt: 0 }));
for (const citizen of warm.citizens) {
  if (!citizen.enterpriseId || !["car", "pt"].includes(citizen.mode)) continue;
  const addition = citizen.mode === "car" ? citizen.weight / warm.config.carOccupancy : citizen.weight;
  for (const code of citizen.routeTraversalCodes) {
    const index = Math.abs(code) - 1;
    if (!warm.links[index].loadBearing) continue;
    const direction = code > 0 ? "ab" : "ba";
    const suffix = citizen.mode === "car" ? "Car" : "Pt";
    expected[index][`${direction}${suffix}`] += addition;
  }
}
for (const link of warm.links) {
  assert.ok(Math.abs(link.loadABVehicles - expected[link.index].abCar) < 1e-6, `${link.id}: warm AB car load is conserved`);
  assert.ok(Math.abs(link.loadBAVehicles - expected[link.index].baCar) < 1e-6, `${link.id}: warm BA car load is conserved`);
  assert.ok(Math.abs(link.loadABPassengers - expected[link.index].abPt) < 1e-6, `${link.id}: warm AB PT load is conserved`);
  assert.ok(Math.abs(link.loadBAPassengers - expected[link.index].baPt) < 1e-6, `${link.id}: warm BA PT load is conserved`);
}
assert.deepEqual(warm.validateInvariants(), [], "warm-started route reassignment preserves all invariants");

console.log("UDES v2 zoned job-capacity and warm-route regression passed.");
