import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { UdesV2Engine } = require("../assets/js/udes-v2-worker.js");
const { PUBLIC_PRESETS, parseUtcDate, horizonEndDayFrom } = require("../assets/js/udes-v2-app.js");
const abuDhabiBaseline = require("../assets/data/udes-v2/baseline.json");

const baselineData = {
  schemaVersion: abuDhabiBaseline.schemaVersion,
  zones: abuDhabiBaseline.zones,
  links: abuDhabiBaseline.roadGraph.edges,
  nodes: abuDhabiBaseline.roadGraph.nodes,
  transit: abuDhabiBaseline.transit,
  calibration: abuDhabiBaseline.calibration,
  assumptions: abuDhabiBaseline.assumptions,
};

const referencePolicy = {
  startDate: "2024-01-01",
  calibrationLabel: "Greater Abu Dhabi City scenario regression — not a forecast",
  endogenousEnterpriseDynamics: true,
  initialEmploymentRate: 0.8,
  ...PUBLIC_PRESETS.reference,
};

const representativeScale = {
  citizenCount: 1823,
  citizenWeight: 1000,
  enterpriseCount: 180,
  routingBatchSize: 256,
  maxDailyLaborMatches: 48,
  agentSampleSize: 6,
};

const createRealEngine = (config = {}, seed = 240124) =>
  new UdesV2Engine({
    data: baselineData,
    seed,
    config: { ...referencePolicy, ...representativeScale, ...config },
  });

const sumBy = (items, selector) => items.reduce((total, item) => total + selector(item), 0);

function assertFiniteTree(value, path = "snapshot") {
  if (typeof value === "number") {
    assert.ok(Number.isFinite(value), `${path} must be finite; received ${value}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertFiniteTree(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) assertFiniteTree(item, `${path}.${key}`);
}

function assertHousingPolicyConsistent(engine, label, { checkInitialAllocation = false } = {}) {
  for (const zone of engine.zones) {
    assert.ok(Number.isFinite(zone.housingCapacityAgents) && zone.housingCapacityAgents > 0, `${label}: ${zone.name} has finite housing stock`);
    if (!engine.config.housingCapacityIsSoft) {
      assert.ok(zone.residentIds.size <= zone.housingCapacityAgents, `${label}: hard capacity in ${zone.name} covers its resident agents`);
    }
    if (checkInitialAllocation) {
      const observedShare = zone.residentIds.size / engine.citizens.length;
      assert.ok(
        Math.abs(observedShare - zone.populationShare) <= 0.05,
        `${label}: ${zone.name} population remains near its allocation share instead of receiving overflow dumping`
      );
    }
  }
  const metrics = engine.snapshot().zones;
  for (const zone of metrics) {
    assert.ok(Number.isFinite(zone.housingOccupancyRate), `${label}: ${zone.name} exposes finite housing occupancy`);
    assert.ok(Number.isFinite(zone.housingOvercapacityRepresented), `${label}: ${zone.name} exposes finite housing overcapacity`);
  }
}

function assertEmploymentBand(snapshot, label) {
  assert.ok(
    snapshot.city.employmentRate >= 76 && snapshot.city.employmentRate <= 84,
    `${label}: employment remains near the configured 80% target; received ${snapshot.city.employmentRate}%`
  );
}

function assertEmploymentCommuteConsistency(engine, snapshot, label) {
  for (const citizen of engine.citizens) {
    if (citizen.enterpriseId) continue;
    assert.equal(citizen.mode, "none", `${label}: unemployed ${citizen.id} has no commute mode`);
    assert.deepEqual(citizen.routeLinkIds, [], `${label}: unemployed ${citizen.id} has no route`);
    assert.equal(citizen.roundTripMinutes, 0, `${label}: unemployed ${citizen.id} has no commute time`);
    assert.equal(citizen.roundTripDistanceKm, 0, `${label}: unemployed ${citizen.id} has no commute distance`);
  }
  const modes = snapshot.city.modeCounts;
  const employedModeTotal = ["car", "pt", "walk", "none", "unserved"].reduce((total, mode) => total + (modes[mode] || 0), 0);
  const completedOrUnserved = ["car", "pt", "walk", "unserved"].reduce((total, mode) => total + (modes[mode] || 0), 0);
  assert.equal(employedModeTotal, snapshot.city.representedEmployed, `${label}: employed mode accounting includes every current worker exactly once`);
  assert.ok(completedOrUnserved <= snapshot.city.representedEmployed, `${label}: completed and unserved trips never exceed current employment`);
}

function assertCarOwnershipMetrics(engine, snapshot, label) {
  const representedOwners = sumBy(engine.citizens, (citizen) => (citizen.hasCar ? citizen.weight : 0));
  const representedPopulation = sumBy(engine.citizens, (citizen) => citizen.weight);
  const expectedCityRate = Number(((representedOwners / representedPopulation) * 100).toFixed(2));
  assert.equal(snapshot.city.carOwnershipRate, expectedCityRate, `${label}: city ownership rate uses all represented citizens`);
  for (const zoneMetric of snapshot.zones) {
    const zone = engine.zoneById.get(zoneMetric.id);
    const residents = [...zone.residentIds].map((id) => engine.citizenById.get(id));
    const population = sumBy(residents, (citizen) => citizen.weight);
    const owners = sumBy(residents, (citizen) => (citizen.hasCar ? citizen.weight : 0));
    const expectedRate = Number(((owners / Math.max(population, 1)) * 100).toFixed(2));
    assert.equal(zoneMetric.carOwnershipRate, expectedRate, `${label}: ${zoneMetric.name} ownership rate uses its full weighted population`);
  }
}

function assertDistributionConservation(snapshot, label) {
  const { income, commute, firmSize } = snapshot.city.distributions;
  assert.equal(
    sumBy(income.bins, (bin) => bin.representedCount),
    snapshot.city.representedPopulation,
    `${label}: income bins conserve population`
  );
  const completed = ["car", "pt", "walk"].reduce((total, mode) => total + (snapshot.city.modeCounts[mode] || 0), 0);
  assert.equal(
    sumBy(commute.bins, (bin) => bin.representedCount),
    completed,
    `${label}: commute bins conserve completed commuters`
  );
  assert.equal(
    sumBy(firmSize.bins, (bin) => bin.enterpriseCount),
    snapshot.city.enterprises,
    `${label}: firm-size bins conserve enterprises`
  );
  assert.equal(
    sumBy(firmSize.bins, (bin) => bin.representedEmployees),
    snapshot.city.representedEmployed,
    `${label}: firm-size bins conserve represented employees`
  );
}

function calendarDayDifference(startDate, endDate) {
  return Math.round((Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86400000);
}

const startedAt = Date.now();

// A real-geography, reduced-agent run keeps this regression quick while retaining
// the study population, 18 districts, road graph, transit supply, and weights.
const deterministicA = createRealEngine({ citizenCount: 608, citizenWeight: 3000, enterpriseCount: 72 }, 90421);
const deterministicB = createRealEngine({ citizenCount: 608, citizenWeight: 3000, enterpriseCount: 72 }, 90421);
deterministicA.step(90);
deterministicB.step(90);
assert.deepEqual(
  deterministicA.snapshot({ historyLimit: 4, includeHistories: true }),
  deterministicB.snapshot({ historyLimit: 4, includeHistories: true }),
  "same seed and scenario produce the same agents, aggregates, histories, and routes"
);
assert.deepEqual(deterministicA.validateInvariants(), [], "deterministic run preserves all reciprocal references and capacities");
assertFiniteTree(deterministicA.snapshot({ historyLimit: 4, includeHistories: true }));
assertCarOwnershipMetrics(deterministicA, deterministicA.snapshot(), "deterministic baseline");
assertDistributionConservation(deterministicA.snapshot(), "deterministic baseline");

const differentSeed = createRealEngine({ citizenCount: 608, citizenWeight: 3000, enterpriseCount: 72 }, 90422);
differentSeed.step(90);
assert.notDeepEqual(
  deterministicA.snapshot().city,
  differentSeed.snapshot().city,
  "a different seed produces a meaningfully different city trajectory"
);

// A constrained housing policy must be feasible and must not depend on whether
// it was supplied during initialization or applied to the same seeded baseline.
const housingAtInit = createRealEngine({ housingCapacityMultiplier: 0.7 }, 7611);
const housingConfigured = createRealEngine({}, 7611);
housingConfigured.configure({ housingCapacityMultiplier: 0.7 });
const hardHousing = createRealEngine({ housingCapacityMultiplier: 1.1, housingCapacityIsSoft: false }, 7611);
assertHousingPolicyConsistent(housingAtInit, "housing multiplier at initialization", { checkInitialAllocation: true });
assertHousingPolicyConsistent(housingConfigured, "housing multiplier configured live", { checkInitialAllocation: true });
assertHousingPolicyConsistent(hardHousing, "hard housing capacity");
const softHousingSnapshot = housingAtInit.snapshot();
assert.equal(softHousingSnapshot.housingConstraintMode, "soft-overcrowding", "snapshot identifies the soft housing-stock model");
assert.equal(softHousingSnapshot.city.housingConstraintMode, "soft-overcrowding", "city metrics identify the soft housing-stock model");
assert.ok(
  softHousingSnapshot.zones.some((zone) => zone.housingOvercapacityRepresented > 0),
  "a 70% housing-stock scenario reports its modeled overcrowding"
);
assert.equal(hardHousing.snapshot().housingConstraintMode, "hard-capacity", "hard-capacity scenarios are labeled explicitly");
assert.deepEqual(
  housingAtInit.zones.map((zone) => [zone.id, zone.housingCapacityAgents]),
  housingConfigured.zones.map((zone) => [zone.id, zone.housingCapacityAgents]),
  "housing capacity is order-independent for the same seed and requested policy"
);
assert.deepEqual(housingAtInit.validateInvariants(), [], "capacity-constrained initialization satisfies engine invariants");

// Reversible live levers are recomputed from immutable zone baselines. A
// temporary up/down adjustment must therefore land exactly on a fresh engine,
// without clamp or rounding drift from the prior live value.
const reversiblePolicy = createRealEngine({}, 68031);
const freshReferencePolicy = createRealEngine({}, 68031);
reversiblePolicy.configure({ placeQuality: 0.98, businessCapacityMultiplier: 1.4 });
reversiblePolicy.configure({ placeQuality: PUBLIC_PRESETS.reference.placeQuality, businessCapacityMultiplier: 1 });
assert.deepEqual(
  reversiblePolicy.zones.map((zone) => [zone.id, zone.quality]),
  freshReferencePolicy.zones.map((zone) => [zone.id, zone.quality]),
  "place-quality up/down round trip equals a fresh reference policy"
);
assert.deepEqual(
  reversiblePolicy.zones.map((zone) => [zone.id, zone.baseEnterprisePlaceCapacity, zone.enterprisePlaceCapacity]),
  freshReferencePolicy.zones.map((zone) => [zone.id, zone.baseEnterprisePlaceCapacity, zone.enterprisePlaceCapacity]),
  "business-capacity up/down round trip equals a fresh reference policy"
);

// Dissatisfaction is an episode counter. Returning to Happy starts a fresh
// episode, so an old commute shock cannot immediately trigger Extreme later.
const recoveredCitizen = deterministicA.citizens.find((citizen) => citizen.state !== "Happy") || deterministicA.citizens[0];
recoveredCitizen.state = "Waiting";
recoveredCitizen.daysDissatisfied = 91;
deterministicA.enterCitizenState(recoveredCitizen, "Happy", "scenario-regression-recovery");
assert.equal(recoveredCitizen.daysDissatisfied, 0, "entering Happy resets the dissatisfaction episode counter");

const aspirationEngine = createRealEngine({ citizenCount: 160, citizenWeight: 11394, enterpriseCount: 20 }, 68032);
const aspiringCitizen = aspirationEngine.citizens.find((citizen) => citizen.enterpriseId);
const aspirationOrigin = aspirationEngine.zoneById.get(aspiringCitizen.homeZoneId);
aspiringCitizen.hasCar = true;
aspiringCitizen.nextCarConsiderationDay = aspirationEngine.day + 1000;
aspirationOrigin.quality = 1;
for (const zone of aspirationEngine.zones) {
  if (zone !== aspirationOrigin) zone.quality = 0.5;
}
const aspirationHomeBefore = aspiringCitizen.homeZoneId;
const aspirationEventsBefore = aspiringCitizen.events.length;
aspiringCitizen.nextQualityMoveDay = aspirationEngine.day;
aspirationEngine.processHappyAspirations(aspiringCitizen);
assert.equal(aspiringCitizen.homeZoneId, aspirationHomeBefore, "quality aspiration never moves a citizen to a lower-quality zone");
assert.ok(
  aspiringCitizen.events.slice(aspirationEventsBefore).every((event) => event.reason !== "quality-aspiration"),
  "a rejected lower-quality aspiration emits no misleading move reason"
);
const unaffordableTarget = aspirationEngine.zones.find((zone) => zone !== aspirationOrigin);
aspirationOrigin.quality = 0.6;
for (const zone of aspirationEngine.zones) {
  if (zone !== aspirationOrigin) zone.quality = 0.5;
}
unaffordableTarget.quality = 0.9;
unaffordableTarget.residentialRentAed = 1000000000;
aspiringCitizen.nextQualityMoveDay = aspirationEngine.day;
const unaffordableEventsBefore = aspiringCitizen.events.length;
aspirationEngine.processHappyAspirations(aspiringCitizen);
assert.equal(aspiringCitizen.homeZoneId, aspirationHomeBefore, "quality aspiration rejects an unaffordable forced candidate");
assert.ok(
  aspiringCitizen.events.slice(unaffordableEventsBefore).every((event) => event.reason !== "quality-aspiration"),
  "an unaffordable rejected candidate emits no quality-aspiration move event"
);

// Weekend reporting may retain the last representative workday or explicitly
// clear it. It may not mix stale citizen modes with zero daily/network totals.
const weekendEngine = createRealEngine(
  {
    citizenCount: 420,
    citizenWeight: 4300,
    enterpriseCount: 55,
    startDate: "2024-01-05",
  },
  55109
);
assert.equal(weekendEngine.snapshot().clock.weekday, 5, "weekend fixture opens on Friday");
weekendEngine.step(1);
const weekend = weekendEngine.snapshot();
assert.equal(weekend.clock.weekday, 6, "weekend fixture advances to Saturday");
assert.equal(weekend.city.networkAssignmentDate, "2024-01-05", "weekend metrics identify the retained Friday network assignment");
const dailyModeTrips = weekend.city.daily.carTrips + weekend.city.daily.ptTrips + weekend.city.daily.walkTrips;
const citizenModeTrips = weekend.city.modeCounts.car + weekend.city.modeCounts.pt + weekend.city.modeCounts.walk;
assert.equal(weekend.city.daily.representedTrips, dailyModeTrips, "daily trip total equals its modal components");
if (weekend.city.daily.representedTrips === 0) {
  assert.equal(citizenModeTrips, 0, "a cleared weekend has no stale citizen commute modes");
  assert.equal(weekend.city.averageRoundTripMinutes, 0, "a cleared weekend has no stale commute time");
  assert.ok(
    weekend.links.every(
      (link) => link.loadABVehicles === 0 && link.loadBAVehicles === 0 && link.loadABPassengers === 0 && link.loadBAPassengers === 0
    ),
    "a cleared weekend has no network loads"
  );
} else {
  assert.equal(citizenModeTrips, weekend.city.daily.representedTrips, "a retained representative workday keeps agent and daily trips aligned");
  assert.ok(weekend.city.averageRoundTripMinutes > 0, "a retained representative workday keeps commute time");
}

const weekendCommuteBeforeHire = weekend.city.averageRoundTripMinutes;
const weekendHire = weekendEngine.citizenById.get([...weekendEngine.unemployedIds][0]);
weekendEngine.config.targetEmploymentRate = 1;
const weekendEmployer = weekendEngine.findHiringEnterprise(weekendHire.homeZoneId);
assert.ok(
  weekendEmployer && weekendEngine.employ(weekendHire, weekendEmployer, 9000, "weekend-new-hire"),
  "weekend fixture can add one unassigned hire"
);
const weekendAfterHire = weekendEngine.snapshot();
assert.equal(weekendHire.mode, "none", "a new weekend hire remains explicitly unassigned until the next workday");
assert.equal(
  weekendAfterHire.city.averageRoundTripMinutes,
  weekendCommuteBeforeHire,
  "an unassigned hire does not dilute completed-commuter mean time with a zero"
);
assertEmploymentCommuteConsistency(weekendEngine, weekendAfterHire, "weekend new-hire accounting");
assertDistributionConservation(weekendAfterHire, "weekend new-hire accounting");
const completedWeekendCommuterWeight = sumBy(weekendEngine.citizens, (citizen) =>
  citizen.enterpriseId && ["car", "pt", "walk"].includes(citizen.mode) ? citizen.weight : 0
);
const completedSameZoneWeight = sumBy(weekendEngine.citizens, (citizen) =>
  citizen.enterpriseId && ["car", "pt", "walk"].includes(citizen.mode) && citizen.homeZoneId === citizen.workZoneId ? citizen.weight : 0
);
assert.equal(
  weekendAfterHire.city.sameZoneWorkShare,
  Number(((completedSameZoneWeight / completedWeekendCommuterWeight) * 100).toFixed(2)),
  "city same-zone share divides by completed commuters and is not diluted by an unassigned hire"
);

// Every traveler on this one-link network is assigned before the final load is
// known. The realized time must nevertheless use the final directional load
// for every agent, rather than giving early agents a free-flow trip.
function createGuaranteedBottleneck(mode, seed = 88021, corridorWaitMinutes = 7) {
  const engine = new UdesV2Engine({
    seed,
    data: {
      zones: [
        {
          id: "bottleneck-home",
          name: "Bottleneck Home",
          lat: 24.45,
          lon: 54.35,
          populationShare: 1,
          firmShare: 0.000001,
          housingCapacityAgents: 40,
          enterprisePlaceCapacity: 2,
          carOwnershipRate: 1,
        },
        {
          id: "bottleneck-work",
          name: "Bottleneck Work",
          lat: 24.5,
          lon: 54.45,
          populationShare: 0.000001,
          firmShare: 1,
          housingCapacityAgents: 40,
          enterprisePlaceCapacity: 2,
          carOwnershipRate: 1,
        },
      ],
      links: [
        {
          id: "single-bottleneck",
          from: "bottleneck-home",
          to: "bottleneck-work",
          distanceKm: 10,
          durationMin: 10,
          capacityVehicles: 1,
          ptCapacityPassengers: 1,
        },
      ],
      transit: {
        links: [
          {
            from: "bottleneck-home",
            to: "bottleneck-work",
            inVehicleMinutes: 10,
            averageWaitMinutes: corridorWaitMinutes,
          },
        ],
      },
    },
    config: {
      startDate: "2024-01-01",
      citizenCount: 20,
      citizenWeight: 1,
      enterpriseCount: 1,
      initialEmploymentRate: 1,
      targetEmploymentRate: 1,
      initialCarOwnership: 1,
      initialHomeZoneJobProbability: 0,
      firmInitialMinJobSlots: 20,
      firmInitialMaxJobSlots: 20,
      carAlternativeConstant: mode === "car" ? 100 : -100,
      modeCostCoefficient: 0,
      carTimeCoefficient: 0,
      ptTimeCoefficient: 0,
      ptWaitCoefficient: 0,
      ptAverageWaitMin: 2,
      carOccupancy: 1,
      routingBatchSize: 1000,
      roadCapacityMultiplier: 1,
      allowCapacityOverflow: true,
      workdays: [1, 2, 3, 4, 5],
    },
  });

  const home = engine.zoneById.get("bottleneck-home");
  const work = engine.zoneById.get("bottleneck-work");
  const enterprise = engine.enterprises[0];
  for (const zone of engine.zones) {
    zone.residentIds.clear();
    zone.enterpriseIds.clear();
  }
  work.enterpriseIds.add(enterprise.id);
  enterprise.zoneId = work.id;
  for (const citizen of engine.citizens) {
    home.residentIds.add(citizen.id);
    citizen.homeZoneId = home.id;
    citizen.workZoneId = work.id;
    citizen.hasCar = mode === "car";
    citizen.currentMonthTransportCostAed = 0;
  }
  assert.equal(enterprise.employeeIds.size, engine.citizens.length, "bottleneck fixture employs every citizen at the work zone");
  engine.commuteCitizens();
  assert.deepEqual(engine.validateInvariants(), [], "bottleneck fixture preserves reciprocal references");
  return engine;
}

function assertGuaranteedBottleneck(mode, seed) {
  const first = createGuaranteedBottleneck(mode, seed);
  const second = createGuaranteedBottleneck(mode, seed);
  const snapshot = first.snapshot();
  assert.deepEqual(snapshot, second.snapshot(), `${mode} bottleneck remains deterministic`);
  const link = first.links[0];
  const path = mode === "pt" ? first.lastPtPathMatrix[0][1] : first.lastCarPathMatrix[0][1];
  const waitMinutes = mode === "pt" ? first.ptPathRoundTripWaitMinutes(path) : 0;
  const realizedRoundTrip = Number((first.linkTravelTime(link, 1, mode) * 2 + waitMinutes).toFixed(2));
  assert.ok(realizedRoundTrip > 80, `${mode} fixture creates a material final-load congestion/crowding penalty`);
  assert.ok(
    first.citizens.every((citizen) => citizen.mode === mode && citizen.roundTripMinutes === realizedRoundTrip),
    `every ${mode} commuter receives the final loaded-network travel time`
  );
  assert.equal(snapshot.city.averageRoundTripMinutes, realizedRoundTrip, `${mode} city commute time matches final-load citizen times`);
  assert.equal(snapshot.city.daily.averageRoundTripMinutes, realizedRoundTrip, `${mode} daily aggregate matches final-load citizen times`);
  assert.equal(
    snapshot.city.daily.weightedRoundTripMinutes,
    realizedRoundTrip * snapshot.city.daily.representedTrips,
    `${mode} weighted commute minutes are rebuilt from final-load citizen times`
  );
}

assertGuaranteedBottleneck("car", 88021);
assertGuaranteedBottleneck("pt", 88022);

// The corridor wait is one boarding wait in each direction, not the global
// fallback and not a sum across every link. It affects experienced time and
// the non-car generalized cost used in ownership decisions.
const lowWaitCorridor = createGuaranteedBottleneck("pt", 88023, 3);
const highWaitCorridor = createGuaranteedBottleneck("pt", 88023, 17);
assert.equal(lowWaitCorridor.links[0].ptAverageWaitMin, 3, "PT link retains its supplied wait rather than the global fallback");
assert.equal(highWaitCorridor.links[0].ptAverageWaitMin, 17, "unequal PT link wait remains corridor-specific");
assert.equal(
  highWaitCorridor.citizens[0].roundTripMinutes - lowWaitCorridor.citizens[0].roundTripMinutes,
  28,
  "experienced round-trip time adds exactly one corridor wait per leg"
);
const lowWaitAlternatives = lowWaitCorridor.carAcquisitionAlternatives(lowWaitCorridor.citizens[0]);
const highWaitAlternatives = highWaitCorridor.carAcquisitionAlternatives(highWaitCorridor.citizens[0]);
assert.equal(
  Number((highWaitAlternatives.alternativeGeneralizedCostAed - lowWaitAlternatives.alternativeGeneralizedCostAed).toFixed(2)),
  Number(((28 / 60) * lowWaitCorridor.config.carAcquisitionValueOfTimeAedPerHour).toFixed(2)),
  "ownership comparison prices the same corridor-specific wait experienced by commuters"
);
const localTransitCitizen = lowWaitCorridor.citizens[0];
localTransitCitizen.workZoneId = localTransitCitizen.homeZoneId;
lowWaitCorridor.config.localWalkCommuteMin = 200;
lowWaitCorridor.config.ptAverageSpeedKmh = 28;
const localReferenceMinutes = lowWaitCorridor.localPtRoundTripMinutes();
const localReferenceAlternative = lowWaitCorridor.carAcquisitionAlternatives(localTransitCitizen).alternativeGeneralizedCostAed;
lowWaitCorridor.config.ptAverageSpeedKmh = 36;
const localImprovedMinutes = lowWaitCorridor.localPtRoundTripMinutes();
const localImprovedAlternative = lowWaitCorridor.carAcquisitionAlternatives(localTransitCitizen).alternativeGeneralizedCostAed;
assert.ok(localImprovedMinutes < localReferenceMinutes, "same-zone PT experienced time responds to the transit-speed policy");
assert.ok(localImprovedAlternative < localReferenceAlternative, "same-zone ownership comparison uses the policy-adjusted PT time");

// The purchase gate must price the proposed car directly from salary, current
// rent, car cash cost, essentials, and the income buffer. A stochastic current
// walk/PT assignment can differ from the generalized-best non-car alternative,
// so last month's net income and an incremental-to-alternative shortcut are not
// valid affordability inputs.
const directCarGateEngine = new UdesV2Engine({
  seed: 41519,
  config: {
    citizenCount: 80,
    citizenWeight: 10,
    enterpriseCount: 8,
    initialEmploymentRate: 0.8,
    targetEmploymentRate: 0.8,
    workdaysPerMonth: 20,
    monthlyEssentialConsumptionAed: 2500,
    waitingNetIncomeAed: 1500,
    carAcquisitionFixedMonthlyCostAed: 0,
    carAcquisitionMinimumSavingsAed: 0,
    carAcquisitionSavingsRampAed: 1,
    carAcquisitionAffordabilityScaleAed: 100,
    carAcquisitionMinimumGeneralizedAdvantageAed: 0,
    carAcquisitionGeneralizedCostScaleAed: 1,
    carAcquisitionMaximumProbability: 1,
  },
});
const directGateCitizen = directCarGateEngine.citizens.find((citizen) => citizen.enterpriseId);
assert.ok(directGateCitizen, "direct car-gate fixture has an employed citizen");
const directGateRent = directCarGateEngine.zoneById.get(directGateCitizen.homeZoneId).residentialRentAed;
directGateCitizen.hasCar = false;
directGateCitizen.mode = "walk";
directGateCitizen.bankBalanceAed = 100000;
directGateCitizen.salaryAed = directGateRent + 2500 + 1500 + 1000 - 50;
directGateCitizen.netIncomeAed = directGateCitizen.salaryAed - directGateRent;
directCarGateEngine.carAcquisitionAlternatives = () => ({
  carCashCostAed: 50,
  alternativeCashCostAed: 4,
  carGeneralizedCostAed: 10,
  alternativeGeneralizedCostAed: 30,
});
const unaffordableDirectCar = directCarGateEngine.evaluateCarAcquisition(directGateCitizen);
assert.equal(unaffordableDirectCar.postAcquisitionBufferAed, -50, "direct purchase cash flow exposes the expected AED -50 buffer");
assert.equal(unaffordableDirectCar.probability, 0, "a generalized-best alternative cannot make a directly unaffordable car appear affordable");
directGateCitizen.salaryAed += 100;
const affordableDirectCar = directCarGateEngine.evaluateCarAcquisition(directGateCitizen);
assert.equal(affordableDirectCar.postAcquisitionBufferAed, 50, "the direct gate responds to a real AED 100 salary increase");
assert.ok(affordableDirectCar.probability > 0, "a directly affordable car can proceed to savings and service scoring");

// A minimum-scale firm with a sustained restart-level loss represents an exit
// and replacement, not an immortal one-slot shell. The replacement must honor
// its explicit setup delay before it can hire as Working again.
const adverseFirmEngine = new UdesV2Engine({
  seed: 77291,
  config: {
    citizenCount: 120,
    citizenWeight: 10,
    enterpriseCount: 4,
    routingBatchSize: 128,
    initialEmploymentRate: 0.8,
    targetEmploymentRate: 0.8,
    firmInitialMinJobSlots: 30,
    firmInitialMaxJobSlots: 30,
    firmMinimumJobSlots: 3,
    enterpriseRestartMarginThreshold: -0.2,
    enterpriseRestartLossMonths: 3,
    firmStartupDays: 5,
    firmMoveProbabilityOnStateEntry: 0,
    maxDailyLaborMatches: 0,
  },
});
const adverseFirm = adverseFirmEngine.enterprises.find((enterprise) => enterprise.employeeIds.size > 0);
assert.ok(adverseFirm, "adverse-firm fixture starts with an operating employer");
adverseFirm.maxJobSlots = Math.min(adverseFirmEngine.config.firmMaximumJobSlots, Math.max(adverseFirm.maxJobSlots, adverseFirm.employeeIds.size + 5));
adverseFirmEngine.enterEnterpriseLesser(adverseFirm);
const lesserFirm = adverseFirmEngine.serializeEnterprise(adverseFirm);
assert.equal(lesserFirm.hiring, false, "Lesser firm is closed to matching");
assert.ok(lesserFirm.representedJobCapacity > lesserFirm.representedEmployees, "Lesser firm retains its active labor capacity");
assert.equal(lesserFirm.vacancyCount, 0, "non-hiring Lesser firm does not advertise its empty capacity as vacancies");
assert.equal(lesserFirm.representedVacancies, 0, "Lesser-firm inspection exposes zero represented vacancies");
assert.equal(
  adverseFirmEngine.snapshot().city.vacancies,
  sumBy(adverseFirmEngine.enterprises, (enterprise) => adverseFirmEngine.openVacancySlots(enterprise) * adverseFirmEngine.config.citizenWeight),
  "city vacancies count only slots actually open to labor matching"
);
adverseFirmEngine.enterEnterpriseWorking(adverseFirm, "vacancy-regression-complete");
const displacedEmployeeIds = [...adverseFirm.employeeIds];
const restartCountBefore = adverseFirmEngine.eventsTotal.firmRestarts;
for (const enterprise of adverseFirmEngine.enterprises) {
  if (enterprise !== adverseFirm) enterprise.maxJobSlots = adverseFirmEngine.config.firmMaximumJobSlots;
}
adverseFirm.maxJobSlots = adverseFirmEngine.config.firmMinimumJobSlots;
adverseFirm.operatingMargin = adverseFirmEngine.config.enterpriseRestartMarginThreshold - 0.01;
adverseFirm.consecutiveRestartLossMonths = adverseFirmEngine.config.enterpriseRestartLossMonths;
adverseFirmEngine.enterEnterpriseLesser(adverseFirm);
assert.equal(adverseFirm.state, "Lesser", "adverse firm enters the contraction state before its restart action");
adverseFirm.nextActionDay = adverseFirmEngine.day;
adverseFirm.stateExitDay = adverseFirmEngine.day + 100;
adverseFirmEngine.updateEnterprisesDaily();

assert.equal(adverseFirm.state, "Starting", "minimum-scale Lesser enters Starting after sustained restart-level losses");
assert.equal(adverseFirm.employeeIds.size, 0, "restart clears the exiting firm's employees");
assert.equal(adverseFirm.hiring, false, "replacement firm cannot hire during startup");
assert.equal(adverseFirm.maxJobSlots, adverseFirmEngine.config.firmMinimumJobSlots, "replacement reopens at minimum scale");
assert.equal(adverseFirm.consecutiveRestartLossMonths, 0, "restart clears the predecessor's loss streak");
assert.equal(adverseFirmEngine.eventsTotal.firmRestarts, restartCountBefore + 1, "restart increments the aggregate event count once");
const startingFirm = adverseFirmEngine.serializeEnterprise(adverseFirm);
assert.equal(startingFirm.activeJobSlots, 0, "Starting firm exposes no active labor capacity");
assert.equal(startingFirm.representedJobCapacity, 0, "Starting firm exposes zero represented active capacity");
assert.equal(startingFirm.vacancyCount, 0, "Starting firm does not advertise vacancies while it cannot hire");
assert.equal(startingFirm.representedVacancies, 0, "Starting-firm inspection exposes zero represented vacancies");
assert.equal(
  startingFirm.plannedRepresentedJobCapacity,
  adverseFirm.maxJobSlots * adverseFirmEngine.config.citizenWeight,
  "Starting firm's planned post-startup capacity remains explicit"
);
const minimumActiveCapacity = Math.ceil(
  adverseFirmEngine.citizens.length * adverseFirmEngine.config.targetEmploymentRate * (1 + adverseFirmEngine.config.laborMarketVacancyBuffer)
);
assert.ok(
  sumBy(adverseFirmEngine.enterprises, (enterprise) => adverseFirmEngine.activeJobSlots(enterprise)) >= minimumActiveCapacity,
  "an allowed restart leaves enough active citywide labor capacity for the target and vacancy buffer"
);
assert.equal(
  adverseFirmEngine.snapshot().city.vacancies,
  sumBy(adverseFirmEngine.enterprises, (enterprise) => adverseFirmEngine.openVacancySlots(enterprise) * adverseFirmEngine.config.citizenWeight),
  "city vacancy metrics exclude every non-hiring firm's empty slots"
);
assert.ok(
  displacedEmployeeIds.every((citizenId) => adverseFirmEngine.citizenById.get(citizenId).enterpriseId === null),
  "restart returns every displaced employee to the labor pool"
);
assert.deepEqual(adverseFirmEngine.validateInvariants(), [], "restart preserves employment and location invariants");

adverseFirmEngine.step(adverseFirmEngine.config.firmStartupDays - 1);
assert.equal(adverseFirm.state, "Starting", "replacement remains Starting before the full setup delay elapses");
adverseFirmEngine.step(1);
assert.equal(adverseFirm.state, "Working", "replacement returns to Working exactly after firmStartupDays");
assert.equal(adverseFirm.hiring, true, "replacement may hire only after startup completes");
assert.deepEqual(adverseFirmEngine.validateInvariants(), [], "startup completion preserves engine invariants");

const guardedFirmEngine = new UdesV2Engine({
  seed: 77292,
  config: {
    citizenCount: 120,
    citizenWeight: 10,
    enterpriseCount: 4,
    initialEmploymentRate: 0.8,
    targetEmploymentRate: 0.8,
    firmInitialMinJobSlots: 30,
    firmInitialMaxJobSlots: 30,
    firmMinimumJobSlots: 3,
    enterpriseRestartMarginThreshold: -0.2,
    enterpriseRestartLossMonths: 3,
    firmMoveProbabilityOnStateEntry: 0,
    maxDailyLaborMatches: 0,
  },
});
const guardedFirm = guardedFirmEngine.enterprises[0];
while (guardedFirm.employeeIds.size > guardedFirmEngine.config.firmMinimumJobSlots) {
  guardedFirmEngine.detachEmployment(
    guardedFirmEngine.citizenById.get(guardedFirm.employeeIds.values().next().value),
    "capacity-guard-fixture",
    false
  );
}
guardedFirm.maxJobSlots = guardedFirmEngine.config.firmMinimumJobSlots;
guardedFirm.operatingMargin = guardedFirmEngine.config.enterpriseRestartMarginThreshold - 0.01;
guardedFirm.consecutiveRestartLossMonths = guardedFirmEngine.config.enterpriseRestartLossMonths;
guardedFirmEngine.enterEnterpriseLesser(guardedFirm);
guardedFirm.nextActionDay = guardedFirmEngine.day;
guardedFirm.stateExitDay = guardedFirmEngine.day + 100;
const guardedRestartCount = guardedFirmEngine.eventsTotal.firmRestarts;
guardedFirmEngine.updateEnterprisesDaily();
assert.equal(guardedFirm.state, "Working", "restart is paused when removing minimum-scale slots would breach the labor-capacity guard");
assert.equal(guardedFirmEngine.eventsTotal.firmRestarts, guardedRestartCount, "capacity-guarded firm is not counted as restarted");
assert.deepEqual(guardedFirmEngine.validateInvariants(), [], "blocked restart preserves capacity and employment invariants");

// Snapshot `monthly*` fields report the last completed calendar month. They
// must match the event delta stored at that same history boundary rather than
// silently switching to the new month's partial count.
const monthBoundaryEngine = new UdesV2Engine({
  seed: 77103,
  config: {
    startDate: "2024-01-31",
    citizenCount: 80,
    enterpriseCount: 8,
    initialEmploymentRate: 0.8,
    targetEmploymentRate: 0.8,
    maxDailyLaborMatches: 0,
  },
});
const boundaryCitizen = monthBoundaryEngine.citizens.find((citizen) => citizen.enterpriseId);
const boundaryTargetZone = monthBoundaryEngine.zones.find((zone) => zone.id !== boundaryCitizen.homeZoneId);
assert.ok(monthBoundaryEngine.moveCitizen(boundaryCitizen, boundaryTargetZone.id, "month-boundary-fixture"));
assert.ok(monthBoundaryEngine.detachEmployment(boundaryCitizen, "month-boundary-fixture", true));
monthBoundaryEngine.step(1);
const boundarySnapshot = monthBoundaryEngine.snapshot();
const boundaryHistory = monthBoundaryEngine.cityHistory.at(-1);
assert.equal(boundarySnapshot.clock.date, "2024-02-01", "month-boundary fixture reaches the next calendar month");
assert.equal(boundaryHistory.date, "2024-02-01", "completed-month history is recorded at the boundary");
assert.equal(boundarySnapshot.city.monthlyHires, boundaryHistory.events.hires, "snapshot hires match the recorded completed month");
assert.equal(boundarySnapshot.city.monthlyFires, boundaryHistory.events.fires, "snapshot fires match the recorded completed month");
assert.equal(boundarySnapshot.city.monthlyMoves, boundaryHistory.events.residentialMoves, "snapshot moves match the recorded completed month");
assert.equal(boundarySnapshot.city.monthlyFires, 1, "completed-month fixture retains its known fire");
assert.equal(boundarySnapshot.city.monthlyMoves, 1, "completed-month fixture retains its known move");
assert.equal(boundarySnapshot.city.citizenWeight, monthBoundaryEngine.config.citizenWeight, "snapshot makes the citizen agent weight explicit");
assert.equal(
  boundarySnapshot.city.monthlyHiresRepresented,
  boundarySnapshot.city.monthlyHires * boundarySnapshot.city.citizenWeight,
  "completed-month hires expose represented people separately from agent transitions"
);
assert.equal(
  boundarySnapshot.city.monthlyFiresRepresented,
  boundarySnapshot.city.monthlyFires * boundarySnapshot.city.citizenWeight,
  "completed-month fires expose represented people separately from agent transitions"
);
assert.equal(
  boundarySnapshot.city.monthlyMovesRepresented,
  boundarySnapshot.city.monthlyMoves * boundarySnapshot.city.citizenWeight,
  "completed-month moves expose represented people separately from agent transitions"
);

const savingsEngine = new UdesV2Engine({
  seed: 77105,
  config: {
    startDate: "2024-01-31",
    citizenCount: 40,
    enterpriseCount: 5,
    initialEmploymentRate: 0.8,
    targetEmploymentRate: 0.8,
    maxDailyLaborMatches: 0,
    monthlyEssentialConsumptionAed: 2000,
    positiveResidualSavingsRate: 0.25,
  },
});
const [positiveSaver, deficitDrawer] = savingsEngine.citizens.filter((citizen) => citizen.enterpriseId).slice(0, 2);
for (const citizen of [positiveSaver, deficitDrawer]) {
  citizen.currentMonthTransportCostAed = 500;
  citizen.bankBalanceAed = 10000;
}
positiveSaver.salaryAed = savingsEngine.zoneById.get(positiveSaver.homeZoneId).residentialRentAed + 500 + 2000 + 4000;
deficitDrawer.salaryAed = savingsEngine.zoneById.get(deficitDrawer.homeZoneId).residentialRentAed + 500 + 2000 - 1000;
savingsEngine.step(1);
const savingsSnapshot = savingsEngine.snapshot();
assert.equal(positiveSaver.lastMonthlyBankBalanceDeltaAed, 1000, "positive residual saves exactly the configured 25% propensity");
assert.equal(positiveSaver.bankBalanceAed, 11000, "positive monthly savings increase the balance by the modeled amount");
assert.equal(deficitDrawer.lastMonthlyBankBalanceDeltaAed, -1000, "negative residual draws down the balance in full");
assert.equal(deficitDrawer.bankBalanceAed, 9000, "monthly deficit reduces the savings stock one-for-one");
assert.deepEqual(
  savingsSnapshot.city.savingsPolicy,
  {
    monthlyEssentialConsumptionAed: 2000,
    positiveResidualSavingsRate: 0.25,
    negativeResidualDrawdownRate: 1,
  },
  "snapshot documents the balance-accumulation assumptions"
);

// Enterprise relocation changes the cost location immediately; there is no
// one-month period where a moved firm still pays its origin-zone rent.
const relocationEngine = new UdesV2Engine({
  seed: 77104,
  config: { citizenCount: 100, enterpriseCount: 10, initialEmploymentRate: 0.8, targetEmploymentRate: 0.8 },
});
const relocatedFirm = relocationEngine.enterprises.find((enterprise) => enterprise.employeeIds.size > 0);
const originBusinessZone = relocationEngine.zoneById.get(relocatedFirm.zoneId);
const destinationBusinessZone = relocationEngine.zones.find((zone) => zone.id !== originBusinessZone.id);
originBusinessZone.businessRentAed = 90;
destinationBusinessZone.businessRentAed = 12;
destinationBusinessZone.enterprisePlaceCapacity = Math.max(
  destinationBusinessZone.enterprisePlaceCapacity,
  destinationBusinessZone.enterpriseIds.size + 1
);
relocatedFirm.rentPerRepresentedWorkerAed = originBusinessZone.businessRentAed;
assert.ok(
  relocationEngine.moveEnterprise(relocatedFirm, destinationBusinessZone.id, "rent-regression"),
  "firm relocates to the forced low-rent zone"
);
assert.equal(relocationEngine.serializeEnterprise(relocatedFirm).rentPerRepresentedWorkerAed, 12, "serialized rent changes at relocation time");
relocationEngine.updateEnterpriseSalaryBills();
relocationEngine.updateEnterpriseEconomics();
const relocatedFirmSnapshot = relocationEngine.serializeEnterprise(relocatedFirm);
const expectedDestinationRent = 12 * relocatedFirmSnapshot.representedEmployees;
assert.equal(relocatedFirmSnapshot.totalBusinessRentAed, expectedDestinationRent, "next economics update uses destination-zone rent");
assert.equal(
  relocatedFirmSnapshot.operatingCostAed,
  relocatedFirmSnapshot.salaryBillAed + relocatedFirmSnapshot.nonLaborOperatingCostAed + expectedDestinationRent,
  "operating cost and margin inputs include the destination rent immediately"
);

// Compare policies on the same real Abu Dhabi network and represented study
// population. Transit-first must shift trips without manufacturing walkers.
const reference = createRealEngine({}, 240124);
const transit = createRealEngine(PUBLIC_PRESETS.transit, 240124);
const oneCalendarYear = horizonEndDayFrom(parseUtcDate("2024-01-01"), 12);
assert.equal(oneCalendarYear, 366, "the leap-year UI horizon reaches the exact 2025 anniversary");
reference.step(oneCalendarYear);
transit.step(oneCalendarYear);
const referenceSnapshot = reference.snapshot();
const transitSnapshot = transit.snapshot();
assert.equal(referenceSnapshot.clock.date, "2025-01-01", "one-year reference ends on the exact calendar anniversary");
assert.equal(transitSnapshot.clock.date, "2025-01-01", "one-year transit scenario ends on the exact calendar anniversary");

for (const [label, engine, snapshot] of [
  ["reference", reference, referenceSnapshot],
  ["transit-first", transit, transitSnapshot],
]) {
  assert.equal(snapshot.city.representedPopulation, 1823000, `${label}: represented population is conserved`);
  assert.deepEqual(engine.validateInvariants(), [], `${label}: real-baseline invariants hold after one year`);
  assertHousingPolicyConsistent(engine, `${label} after one year`);
  assertEmploymentBand(snapshot, label);
  assert.equal(snapshot.city.forcedInterzoneWalkers, 0, `${label}: network capacity never forces an interzone walking commute`);
  assert.equal(snapshot.city.daily.unservedTrips, 0, `${label}: the normal policy scenario serves every modeled work trip`);
  assertFiniteTree(snapshot);
}

assert.ok(
  transitSnapshot.city.modeShares.car <= referenceSnapshot.city.modeShares.car - 2,
  `transit-first lowers car share by at least 2 points (${referenceSnapshot.city.modeShares.car}% to ${transitSnapshot.city.modeShares.car}%)`
);
assert.ok(
  transitSnapshot.city.modeShares.pt >= referenceSnapshot.city.modeShares.pt + 2,
  `transit-first raises public-transport share by at least 2 points (${referenceSnapshot.city.modeShares.pt}% to ${transitSnapshot.city.modeShares.pt}%)`
);
assert.ok(
  transitSnapshot.city.averageRoundTripMinutes <= referenceSnapshot.city.averageRoundTripMinutes + 5,
  `transit-first does not materially worsen mean commute time (${referenceSnapshot.city.averageRoundTripMinutes} to ${transitSnapshot.city.averageRoundTripMinutes} minutes)`
);

// Ten calendar years are 3,653 days from the 2024 baseline (three leap years),
// not 120 synthetic 30-day months. Fewer, heavier agents preserve the 1.8m
// represented population and real network while keeping four UI presets fast.
const tenCalendarYears = calendarDayDifference("2024-01-01", "2034-01-01");
assert.equal(tenCalendarYears, 3653);
const tenYearScale = {
  citizenCount: 720,
  citizenWeight: 2500,
  enterpriseCount: 60,
  maxDailyLaborMatches: 24,
};
const tenYearResults = {};
for (const [scenario, policy] of Object.entries(PUBLIC_PRESETS)) {
  const engine = createRealEngine({ ...tenYearScale, ...policy }, 70117);
  engine.step(tenCalendarYears);
  const snapshot = engine.snapshot();
  const label = `ten-year ${scenario}`;
  assert.equal(snapshot.clock.date, "2034-01-01", `${label}: ends on the exact calendar anniversary`);
  assert.deepEqual(engine.validateInvariants(), [], `${label}: reciprocal references and capacities remain valid`);
  assertEmploymentBand(snapshot, label);
  assertEmploymentCommuteConsistency(engine, snapshot, label);
  assertCarOwnershipMetrics(engine, snapshot, label);
  assertDistributionConservation(snapshot, label);
  assert.equal(
    snapshot.city.representedCitizenEventsTotal.carAcquisitions,
    snapshot.city.eventsTotal.carAcquisitions * snapshot.city.citizenWeight,
    `${label}: acquisition events distinguish represented people from agent transitions`
  );
  assert.equal(snapshot.city.forcedInterzoneWalkers, 0, `${label}: creates no forced interzone walkers`);
  assert.equal(snapshot.city.daily.unservedTrips, 0, `${label}: serves every modeled work trip`);
  assertFiniteTree(snapshot);
  assert.ok(
    snapshot.city.averageBankBalanceAed > -100000 && snapshot.city.averageBankBalanceAed < 750000,
    `${label}: mean savings remains within a finite, plausible long-run stock range; received AED ${snapshot.city.averageBankBalanceAed}`
  );
  assert.ok(
    engine.citizens.every((citizen) => Number.isFinite(citizen.bankBalanceAed) && Math.abs(citizen.bankBalanceAed) < 5000000),
    `${label}: individual savings stocks remain finite and below AED 5m in magnitude`
  );
  tenYearResults[scenario] = {
    engine,
    snapshot,
    carOwnershipRate: snapshot.city.carOwnershipRate,
  };
}

const tenYearEngine = tenYearResults.reference.engine;
const tenYearSnapshot = tenYearResults.reference.snapshot;
const activeEnterprises = tenYearEngine.enterprises.filter((enterprise) => enterprise.monthlyRevenueAed > 0);
assert.ok(
  activeEnterprises.length >= tenYearEngine.enterprises.length * 0.25,
  "the ten-year margin check retains a meaningful active-enterprise sample"
);
const portfolioRevenue = sumBy(activeEnterprises, (enterprise) => enterprise.monthlyRevenueAed);
const portfolioCost = sumBy(activeEnterprises, (enterprise) => enterprise.operatingCostAed);
const portfolioMargin = (portfolioRevenue - portfolioCost) / Math.max(portfolioRevenue, 1);
const lossMakingShare = activeEnterprises.filter((enterprise) => enterprise.operatingMargin < 0).length / activeEnterprises.length;
assert.ok(
  portfolioMargin >= -0.05 && portfolioMargin <= 0.35,
  `ten-year enterprise portfolio margin remains credible; received ${(portfolioMargin * 100).toFixed(2)}%`
);
assert.ok(lossMakingShare <= 0.5, `no more than half of active firms are loss-making; received ${(lossMakingShare * 100).toFixed(2)}%`);

const longReference = tenYearResults.reference;
const longTransit = tenYearResults.transit;
const longHousing = tenYearResults.housing;
const longBalanced = tenYearResults.balanced;
assert.ok(longTransit.snapshot.city.modeShares.car < longReference.snapshot.city.modeShares.car, "ten-year transit preset lowers car mode share");
assert.ok(longTransit.snapshot.city.modeShares.pt > longReference.snapshot.city.modeShares.pt, "ten-year transit preset raises PT mode share");
assert.ok(
  longTransit.snapshot.city.averageRoundTripMinutes <= longReference.snapshot.city.averageRoundTripMinutes,
  `ten-year transit preset does not worsen mean commute time (${longReference.snapshot.city.averageRoundTripMinutes} to ${longTransit.snapshot.city.averageRoundTripMinutes} minutes)`
);
assert.ok(longTransit.carOwnershipRate < longReference.carOwnershipRate, "better long-run PT service suppresses car ownership acquisition");
assert.ok(
  longTransit.snapshot.city.eventsTotal.carAcquisitions < longReference.snapshot.city.eventsTotal.carAcquisitions,
  "transit preset produces fewer cumulative car acquisitions"
);

assert.ok(
  longHousing.snapshot.city.housingOccupancyRate < longReference.snapshot.city.housingOccupancyRate,
  "housing preset reduces citywide housing occupancy pressure"
);
assert.ok(
  longHousing.snapshot.city.housingOvercapacityRepresented <= longReference.snapshot.city.housingOvercapacityRepresented,
  "housing preset does not increase represented overcrowding"
);
assert.ok(
  longHousing.snapshot.city.stateShares.Happy >= longReference.snapshot.city.stateShares.Happy - 5,
  `housing preset does not materially worsen citizen satisfaction (${longReference.snapshot.city.stateShares.Happy}% to ${longHousing.snapshot.city.stateShares.Happy}%)`
);
assert.ok(
  longHousing.snapshot.city.averageNetIncomeAed >= longReference.snapshot.city.averageNetIncomeAed - 1000,
  "housing preset does not materially worsen mean net income"
);
assert.ok(
  longHousing.snapshot.city.averageRoundTripMinutes <= longReference.snapshot.city.averageRoundTripMinutes + 5,
  "housing preset does not materially worsen commute welfare"
);

assert.ok(longBalanced.snapshot.city.modeShares.car < longReference.snapshot.city.modeShares.car, "balanced preset lowers car mode share");
assert.ok(longBalanced.snapshot.city.modeShares.pt > longReference.snapshot.city.modeShares.pt, "balanced preset raises PT mode share");
assert.ok(
  longBalanced.snapshot.city.averageRoundTripMinutes <= longReference.snapshot.city.averageRoundTripMinutes + 1,
  `balanced preset does not materially worsen mean commute time (${longReference.snapshot.city.averageRoundTripMinutes} to ${longBalanced.snapshot.city.averageRoundTripMinutes} minutes)`
);
assert.ok(
  longBalanced.snapshot.city.housingOccupancyRate < longReference.snapshot.city.housingOccupancyRate,
  "balanced preset reduces housing occupancy pressure"
);
assert.ok(
  longBalanced.snapshot.city.stateShares.Happy >= longReference.snapshot.city.stateShares.Happy - 5,
  `balanced preset preserves citizen satisfaction (${longReference.snapshot.city.stateShares.Happy}% to ${longBalanced.snapshot.city.stateShares.Happy}%)`
);

// Directional conclusions must survive seed variance rather than depend on
// the main validation trajectory. This reduced real-network scale preserves
// approximately 1.825m represented people and runs each exact ten-year pair
// quickly enough for CI.
const varianceSeeds = [240124, 70117, 90421];
const varianceScale = {
  citizenCount: 365,
  citizenWeight: 5000,
  enterpriseCount: 48,
  maxDailyLaborMatches: 24,
};
const varianceResults = [];
for (const seed of varianceSeeds) {
  const varianceReference = createRealEngine({ ...varianceScale, ...PUBLIC_PRESETS.reference }, seed);
  const varianceTransit = createRealEngine({ ...varianceScale, ...PUBLIC_PRESETS.transit }, seed);
  varianceReference.step(tenCalendarYears);
  varianceTransit.step(tenCalendarYears);
  const referenceResult = varianceReference.snapshot();
  const transitResult = varianceTransit.snapshot();
  assert.deepEqual(varianceReference.validateInvariants(), [], `variance seed ${seed}: reference invariants hold`);
  assert.deepEqual(varianceTransit.validateInvariants(), [], `variance seed ${seed}: transit invariants hold`);
  assert.ok(
    transitResult.city.carOwnershipRate < referenceResult.city.carOwnershipRate,
    `variance seed ${seed}: transit lowers long-run car ownership`
  );
  assert.ok(transitResult.city.modeShares.car < referenceResult.city.modeShares.car, `variance seed ${seed}: transit lowers long-run car mode share`);
  assert.ok(transitResult.city.modeShares.pt > referenceResult.city.modeShares.pt, `variance seed ${seed}: transit raises long-run PT mode share`);
  varianceResults.push({
    seed,
    referenceOwnership: referenceResult.city.carOwnershipRate,
    transitOwnership: transitResult.city.carOwnershipRate,
    referenceCar: referenceResult.city.modeShares.car,
    transitCar: transitResult.city.modeShares.car,
    referencePt: referenceResult.city.modeShares.pt,
    transitPt: transitResult.city.modeShares.pt,
  });
}

console.table([
  {
    scenario: "Reference · year 1",
    employment: referenceSnapshot.city.employmentRate,
    car: referenceSnapshot.city.modeShares.car,
    pt: referenceSnapshot.city.modeShares.pt,
    commute: referenceSnapshot.city.averageRoundTripMinutes,
    forcedWalkers: referenceSnapshot.city.forcedInterzoneWalkers,
  },
  {
    scenario: "Transit-first · year 1",
    employment: transitSnapshot.city.employmentRate,
    car: transitSnapshot.city.modeShares.car,
    pt: transitSnapshot.city.modeShares.pt,
    commute: transitSnapshot.city.averageRoundTripMinutes,
    forcedWalkers: transitSnapshot.city.forcedInterzoneWalkers,
  },
  {
    scenario: "Reference · year 10",
    employment: tenYearSnapshot.city.employmentRate,
    car: tenYearSnapshot.city.modeShares.car,
    pt: tenYearSnapshot.city.modeShares.pt,
    commute: tenYearSnapshot.city.averageRoundTripMinutes,
    forcedWalkers: tenYearSnapshot.city.forcedInterzoneWalkers,
  },
  ...["transit", "housing", "balanced"].map((scenario) => ({
    scenario: `${scenario[0].toUpperCase()}${scenario.slice(1)} · year 10`,
    employment: tenYearResults[scenario].snapshot.city.employmentRate,
    car: tenYearResults[scenario].snapshot.city.modeShares.car,
    pt: tenYearResults[scenario].snapshot.city.modeShares.pt,
    commute: tenYearResults[scenario].snapshot.city.averageRoundTripMinutes,
    forcedWalkers: tenYearResults[scenario].snapshot.city.forcedInterzoneWalkers,
  })),
]);
console.table(
  Object.entries(tenYearResults).map(([scenario, result]) => ({
    scenario: `${scenario[0].toUpperCase()}${scenario.slice(1)} · ownership/welfare`,
    carOwnership: Number(result.carOwnershipRate.toFixed(2)),
    carAcquisitions: result.snapshot.city.eventsTotal.carAcquisitions,
    happy: result.snapshot.city.stateShares.Happy,
    housingOccupancy: result.snapshot.city.housingOccupancyRate,
    overcapacity: result.snapshot.city.housingOvercapacityRepresented,
    netIncome: result.snapshot.city.averageNetIncomeAed,
    bankBalance: result.snapshot.city.averageBankBalanceAed,
    monthlySavings: result.snapshot.city.averageMonthlyBankBalanceDeltaAed,
  }))
);
console.table(varianceResults);
console.log(
  `UDES v2 scenario regressions passed in ${((Date.now() - startedAt) / 1000).toFixed(1)}s; ten-year portfolio margin ${(
    portfolioMargin * 100
  ).toFixed(2)}%.`
);
