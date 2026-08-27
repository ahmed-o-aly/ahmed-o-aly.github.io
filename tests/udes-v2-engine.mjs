import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { DEFAULT_CONFIG, DEFAULT_ZONES, UdesV2Engine, createWorkerController } = require("../assets/js/udes-v2-worker.js");
const abuDhabiBaseline = require("../assets/data/udes-v2/baseline.json");

const compactConfig = {
  citizenCount: 420,
  enterpriseCount: 40,
  citizenWeight: 25,
  routingBatchSize: 128,
  maxDailyLaborMatches: 40,
};

assert.match(DEFAULT_CONFIG.calibrationLabel, /not a validated forecast/i);
assert.equal(DEFAULT_CONFIG.useCalibratedSameZoneModeChoice, true);
assert.equal(DEFAULT_CONFIG.udesExactExtremeCarDisposal, false);
assert.equal(DEFAULT_CONFIG.ptFareOneWayAed, 2, "the default PT boarding/base fare is AED 2 per direction");
assert.equal(DEFAULT_CONFIG.ptFarePerPassengerKmAed, 0.05, "the default PT distance fare is AED 0.05 per passenger-km");
assert.equal(DEFAULT_CONFIG.ptFareMaximumOneWayAed, 5, "the official maximum is AED 5 per direction");
assert.ok(
  DEFAULT_ZONES.some((zone) => zone.id === "mushrif"),
  "default geography includes Mushrif as its own zone"
);

const first = new UdesV2Engine({ seed: 314159, config: compactConfig });
const second = new UdesV2Engine({ seed: 314159, config: compactConfig });

const fareEngine = new UdesV2Engine({ seed: 271828, config: { ...compactConfig, citizenCount: 80, enterpriseCount: 8 } });
assert.equal(Number(fareEngine.ptOneWayFareAed(3).toFixed(2)), 2.15, "a 3 km one-way PT trip charges base plus distance");
assert.equal(Number(fareEngine.ptRoundTripFareAed(3).toFixed(2)), 4.3, "the PT base and distance fare are each charged in both directions");
assert.equal(Number(fareEngine.ptRoundTripFareAed(20).toFixed(2)), 6, "a longer PT round trip costs more under the distance tariff");
assert.equal(Number(fareEngine.ptRoundTripFareAed(80).toFixed(2)), 10, "the AED 5 per-direction maximum caps very long round trips");
const localFareCitizen = fareEngine.citizens.find((citizen) => citizen.enterpriseId && citizen.homeZoneId === citizen.workZoneId);
assert.ok(localFareCitizen, "the local-fare fixture includes an employed same-zone citizen");
localFareCitizen.hasCar = false;
fareEngine.config.localWalkChoiceProbabilityOtherwise = 0;
fareEngine.config.localWalkCommuteMin = 1000;
localFareCitizen.currentMonthTransportCostAed = 0;
fareEngine.applySameZoneCommute(localFareCitizen);
const expectedLocalFareAed = fareEngine.ptRoundTripFareAed(fareEngine.config.localPtDistanceKm / 2);
assert.equal(localFareCitizen.mode, "pt", "the deterministic same-zone fixture chooses PT");
assert.equal(localFareCitizen.dailyTransportCostAed, expectedLocalFareAed, "same-zone PT applies the distance-sensitive round-trip fare");
const localResidentialCosts = fareEngine.residentialOptionCosts(localFareCitizen, fareEngine.zoneById.get(localFareCitizen.homeZoneId));
assert.equal(
  localResidentialCosts.cashMonthlyCostAed,
  fareEngine.zoneById.get(localFareCitizen.homeZoneId).residentialRentAed + expectedLocalFareAed * fareEngine.config.workdaysPerMonth,
  "the local cheapest-commute calculation includes the distance-sensitive PT fare"
);
assert.equal(
  fareEngine.carAcquisitionAlternatives(localFareCitizen).alternativeCashCostAed,
  expectedLocalFareAed,
  "the local car-acquisition comparison uses the same PT fare"
);
assert.deepEqual(fareEngine.snapshot().transitFare, {
  currency: "AED",
  basis: "per-direction",
  formula: "min(maximum fare, base fare + passenger-km rate × one-way distance)",
  baseFarePerDirectionAed: 2,
  farePerPassengerKmAed: 0.05,
  maximumFarePerDirectionAed: 5,
  localRoundTripDistanceKm: 6,
  localRoundTripFareAed: 4.3,
});

assert.equal(first.citizens.length, 420);
assert.equal(first.enterprises.length, 40);
assert.equal(first.snapshot().city.representedPopulation, 10500);
assert.deepEqual(first.validateInvariants(), [], "initial employment and location references are reciprocal");

first.step(120);
second.step(120);
assert.deepEqual(first.snapshot({ historyLimit: 8 }), second.snapshot({ historyLimit: 8 }), "same seed is deterministic");
assert.deepEqual(first.validateInvariants(), [], "moves, hires, fires, and firm moves preserve reciprocal references");
assert.equal(first.monthCounter, 4, "calendar scheduler closes four months by 1 May");
assert.ok(first.cityHistory.length >= 5, "monthly aggregate history is recorded");
assert.ok(
  first.citizens.some((citizen) => citizen.history.length > 1),
  "citizens retain compact financial/state history"
);
assert.ok(
  first.enterprises.some((enterprise) => enterprise.events.length),
  "enterprises retain state/action event history"
);

const dailySeriesEngine = new UdesV2Engine({
  seed: 55109,
  config: { ...compactConfig, startDate: "2024-01-04" },
});
const dailySeriesTwin = new UdesV2Engine({
  seed: 55109,
  config: { ...compactConfig, startDate: "2024-01-04" },
});
const dailySeriesSnapshot = dailySeriesEngine.step(4, { captureDaily: true });
const dailySeriesTwinSnapshot = dailySeriesTwin.step(4, { captureDaily: true });
assert.equal(dailySeriesSnapshot.dailySeries.length, 4, "daily capture returns one observation per simulated day");
assert.deepEqual(
  dailySeriesSnapshot.dailySeries.map((observation) => observation.date),
  ["2024-01-05", "2024-01-06", "2024-01-07", "2024-01-08"],
  "daily observations use consecutive UTC calendar dates"
);
assert.deepEqual(dailySeriesSnapshot.dailySeries, dailySeriesTwinSnapshot.dailySeries, "daily observations are deterministic for a fixed seed");
for (const observation of dailySeriesSnapshot.dailySeries) {
  assert.equal(observation.clock.date, observation.date, "daily observation clock and date agree");
  assert.equal(observation.clock.day, observation.day, "daily observation clock and day agree");
  for (const counters of [observation.events, observation.monthToDateEvents]) {
    for (const value of Object.values(counters)) {
      assert.ok(Number.isFinite(value) && value >= 0, "daily and month-to-date event counters are finite and nonnegative");
    }
    assert.equal(counters.hiresRepresented, counters.hires * compactConfig.citizenWeight);
    assert.equal(counters.firesRepresented, counters.fires * compactConfig.citizenWeight);
    assert.equal(counters.residentialMovesRepresented, counters.residentialMoves * compactConfig.citizenWeight);
  }
  assert.equal(observation.zonePolicies.length, DEFAULT_ZONES.length, "daily observations preserve every district policy state");
  assert.equal(observation.zoneSeries.length, DEFAULT_ZONES.length, "daily observations preserve compact district outcome series");
  assert.ok(Number.isFinite(observation.city.activeEnterpriseSharePercent), "daily active-enterprise share is finite");
  assert.ok(Number.isFinite(observation.city.enterprisePortfolioOperatingMarginPercent), "daily enterprise portfolio margin is finite");
}
assert.deepEqual(
  dailySeriesSnapshot.dailySeries.map((observation) => observation.isWorkday),
  [true, false, false, true]
);
assert.deepEqual(
  dailySeriesSnapshot.dailySeries.map((observation) => observation.networkAssignmentDate),
  ["2024-01-05", "2024-01-05", "2024-01-05", "2024-01-08"],
  "weekend observations retain the last completed workday assignment date"
);
assert.deepEqual(
  dailySeriesSnapshot.dailySeries.map((observation) => observation.networkAssignmentStatus),
  ["current", "retained-last-workday", "retained-last-workday", "current"],
  "daily observations distinguish current from retained network assignments"
);
assert.deepEqual(dailySeriesSnapshot.dailySeries.at(-1).city, dailySeriesSnapshot.city, "the final daily city metrics match the final snapshot");
assert.equal(dailySeriesSnapshot.dailySeries.at(-1).date, dailySeriesSnapshot.clock.date, "the final daily date matches the final snapshot");

const monthBoundaryDailyEngine = new UdesV2Engine({
  seed: 81357,
  config: {
    ...compactConfig,
    startDate: "2024-01-31",
    targetEmploymentRate: 0,
    workdays: [],
    waitingNetIncomeAed: -1e9,
    extremeNetIncomeAed: -1e9,
    extremeBankBalanceAed: -1e9,
    acceptableCommuteRoundTripMin: 1e9,
    extremeCommuteRoundTripMin: 1e9,
  },
});
const boundaryCitizen = monthBoundaryDailyEngine.citizens.find((citizen) => citizen.enterpriseId);
const boundaryTargetZone = monthBoundaryDailyEngine.zones.find((zone) => zone.id !== boundaryCitizen.homeZoneId);
assert.ok(monthBoundaryDailyEngine.moveCitizen(boundaryCitizen, boundaryTargetZone.id, "daily-boundary-fixture"));
assert.ok(monthBoundaryDailyEngine.detachEmployment(boundaryCitizen, "daily-boundary-fixture", true));
let completedMonthAccountingClock = null;
const updateBoundaryEnterpriseEconomics = monthBoundaryDailyEngine.updateEnterpriseEconomics.bind(monthBoundaryDailyEngine);
monthBoundaryDailyEngine.updateEnterpriseEconomics = (rescheduleWorkingHazards, recordCompletedMonth, accountingClock) => {
  if (recordCompletedMonth) completedMonthAccountingClock = { ...accountingClock };
  return updateBoundaryEnterpriseEconomics(rescheduleWorkingHazards, recordCompletedMonth, accountingClock);
};
const monthBoundaryDailySnapshot = monthBoundaryDailyEngine.step(1, { captureDaily: true });
const boundaryDailyObservation = monthBoundaryDailySnapshot.dailySeries[0];
assert.equal(completedMonthAccountingClock.date, "2024-01-31", "closed-month enterprise seasonality uses the completed month");
assert.equal(monthBoundaryDailySnapshot.city.monthlyFires, 1, "the snapshot retains the completed-month fire");
assert.equal(monthBoundaryDailySnapshot.city.monthlyMoves, 1, "the snapshot retains the completed-month move");
assert.equal(boundaryDailyObservation.events.fires, 0, "the new day's fire delta does not repeat the completed month");
assert.equal(boundaryDailyObservation.events.residentialMoves, 0, "the new day's move delta does not repeat the completed month");
assert.equal(boundaryDailyObservation.monthToDateEvents.fires, 0, "new-month-to-date fires start after the completed month");
assert.equal(boundaryDailyObservation.monthToDateEvents.residentialMoves, 0, "new-month-to-date moves start after the completed month");

const targetedPolicyEngine = new UdesV2Engine({ seed: 94711, config: compactConfig });
const targetedBefore = new Map(targetedPolicyEngine.snapshot().zones.map((zone) => [zone.id, zone]));
targetedPolicyEngine.configure({
  policyScopeZoneId: "mushrif",
  housingCapacityMultiplier: 1.35,
  businessCapacityMultiplier: 1.4,
  placeQuality: 0.9,
});
let targetedZones = new Map(targetedPolicyEngine.snapshot().zones.map((zone) => [zone.id, zone]));
assert.equal(targetedZones.get("mushrif").appliedHousingCapacityMultiplier, 1.35);
assert.equal(targetedZones.get("mushrif").appliedBusinessCapacityMultiplier, 1.4);
assert.ok(Math.abs(targetedZones.get("mushrif").appliedPlaceQuality - (targetedBefore.get("mushrif").quality + 0.08)) < 1e-9);
assert.equal(
  targetedZones.get("danah").appliedHousingCapacityMultiplier,
  targetedBefore.get("danah").appliedHousingCapacityMultiplier,
  "a targeted housing intervention leaves other zones unchanged"
);
assert.equal(
  targetedZones.get("danah").appliedBusinessCapacityMultiplier,
  targetedBefore.get("danah").appliedBusinessCapacityMultiplier,
  "a targeted business intervention leaves other zones unchanged"
);
assert.equal(targetedZones.get("danah").appliedPlaceQuality, targetedBefore.get("danah").quality);
targetedPolicyEngine.configure({
  policyScopeZoneId: "danah",
  housingCapacityMultiplier: 0.9,
  businessCapacityMultiplier: 1.1,
  placeQuality: 0.78,
});
targetedZones = new Map(targetedPolicyEngine.snapshot().zones.map((zone) => [zone.id, zone]));
assert.equal(targetedZones.get("mushrif").appliedHousingCapacityMultiplier, 1.35, "later targeting retains Mushrif housing policy");
assert.equal(targetedZones.get("mushrif").appliedBusinessCapacityMultiplier, 1.4, "later targeting retains Mushrif business policy");
assert.equal(targetedZones.get("mushrif").placeQualityPolicy, 0.9, "later targeting retains Mushrif quality policy");
targetedPolicyEngine.configure({ policyScopeZoneId: null, housingCapacityMultiplier: 1.05 });
targetedZones = new Map(targetedPolicyEngine.snapshot().zones.map((zone) => [zone.id, zone]));
assert.ok(
  [...targetedZones.values()].every((zone) => zone.appliedHousingCapacityMultiplier === 1.05),
  "a citywide housing intervention applies to every zone"
);
assert.equal(targetedZones.get("mushrif").appliedBusinessCapacityMultiplier, 1.4, "citywide housing does not overwrite targeted business policy");
assert.equal(targetedZones.get("danah").placeQualityPolicy, 0.78, "citywide housing does not overwrite targeted quality policy");
const heterogeneousPolicies = targetedPolicyEngine.snapshot().zones.map((zone) => ({
  id: zone.id,
  housingCapacityMultiplier: zone.appliedHousingCapacityMultiplier,
  businessCapacityMultiplier: zone.appliedBusinessCapacityMultiplier,
  placeQuality: zone.placeQualityPolicy,
}));
targetedPolicyEngine.configure(
  {
    policyScopeZoneId: null,
    housingCapacityMultiplier: 1,
    businessCapacityMultiplier: 1,
    placeQuality: 0.82,
    zonePolicies: heterogeneousPolicies,
  },
  true
);
targetedZones = new Map(targetedPolicyEngine.snapshot().zones.map((zone) => [zone.id, zone]));
assert.equal(targetedZones.get("mushrif").appliedBusinessCapacityMultiplier, 1.4, "explicit district policy replay restores Mushrif");
assert.equal(targetedZones.get("danah").placeQualityPolicy, 0.78, "explicit district policy replay restores Danah");
assert.ok(
  [...targetedZones.values()].every((zone) => zone.appliedHousingCapacityMultiplier === 1.05),
  "explicit district policy replay restores the citywide housing layer"
);
targetedPolicyEngine.reset();
targetedZones = new Map(targetedPolicyEngine.snapshot().zones.map((zone) => [zone.id, zone]));
assert.equal(targetedZones.get("mushrif").appliedBusinessCapacityMultiplier, 1.4, "engine reset preserves Mushrif district policy");
assert.equal(targetedZones.get("danah").placeQualityPolicy, 0.78, "engine reset preserves Danah district policy");
assert.throws(
  () => targetedPolicyEngine.configure({ zonePolicies: [heterogeneousPolicies[0], heterogeneousPolicies[0]] }),
  /Invalid or duplicate zone policy/,
  "duplicate explicit district policies are rejected"
);
assert.throws(
  () => targetedPolicyEngine.configure({ policyScopeZoneId: "not-a-zone", housingCapacityMultiplier: 2 }),
  /Unknown policy scope zone/,
  "an invalid policy scope is rejected"
);

const targetedAtInitialization = new UdesV2Engine({
  seed: 94711,
  config: { ...compactConfig, policyScopeZoneId: "mushrif", housingCapacityMultiplier: 1.25 },
});
const initializedTargetZones = new Map(targetedAtInitialization.snapshot().zones.map((zone) => [zone.id, zone]));
assert.equal(initializedTargetZones.get("mushrif").appliedHousingCapacityMultiplier, 1.25);
assert.equal(initializedTargetZones.get("danah").appliedHousingCapacityMultiplier, 1, "initial targeted policy leaves other zones neutral");

const citizenInspection = first.inspect("citizen", first.citizens[0].id, 8);
assert.equal(citizenInspection.id, first.citizens[0].id);
assert.ok(Array.isArray(citizenInspection.history));
assert.ok(Array.isArray(citizenInspection.events));

const enterpriseInspection = first.inspect("enterprise", first.enterprises[0].id, 8);
assert.ok(Array.isArray(enterpriseInspection.employeeIds));
assert.ok(enterpriseInspection.sector, "firms carry a persistent sector");
assert.ok(Number.isFinite(enterpriseInspection.monthlyRevenueAed), "monthly enterprise revenue is exposed");
assert.ok(Number.isFinite(enterpriseInspection.operatingMargin), "enterprise operating margin is exposed");
assert.ok(enterpriseInspection.laborAccessScore >= 0 && enterpriseInspection.laborAccessScore <= 1);
for (const citizenId of enterpriseInspection.employeeIds) {
  assert.equal(first.citizenById.get(citizenId).enterpriseId, enterpriseInspection.id);
}

const waitingEngine = new UdesV2Engine({
  seed: 7,
  config: {
    ...compactConfig,
    waitingNetIncomeAed: 1e9,
    extremeNetIncomeAed: -1e9,
    extremeBankBalanceAed: -1e9,
    extremeCommuteRoundTripMin: 1e9,
    workdays: [],
  },
});
waitingEngine.step(1);
assert.ok(
  waitingEngine.citizens.every((citizen) => citizen.state === "Waiting"),
  "ordinary guard enters Waiting"
);

const extremeEngine = new UdesV2Engine({
  seed: 8,
  config: {
    ...compactConfig,
    extremeNetIncomeAed: 1e9,
    extremeBankBalanceAed: -1e9,
    extremeCommuteRoundTripMin: 1e9,
    carDisposalNetIncomeAed: 1e9,
    carDisposalBankBalanceAed: -1e9,
    workdays: [],
  },
});
extremeEngine.step(1);
assert.ok(
  extremeEngine.citizens.every((citizen) => citizen.state === "Extreme"),
  "severe guard has priority"
);
assert.ok(
  extremeEngine.citizens.every((citizen) => !citizen.hasCar),
  "a severe financial guard can dispose of cars on Extreme entry"
);

const commuteOnlyEngine = new UdesV2Engine({
  seed: 81,
  config: {
    ...compactConfig,
    extremeNetIncomeAed: -1e9,
    extremeBankBalanceAed: -1e9,
    carDisposalNetIncomeAed: -1e9,
    carDisposalBankBalanceAed: -1e9,
    workdays: [],
  },
});
const commuteOnlyCitizen = commuteOnlyEngine.citizens[0];
commuteOnlyCitizen.hasCar = true;
commuteOnlyCitizen.roundTripMinutes = commuteOnlyEngine.config.extremeCommuteRoundTripMin + 1;
assert.equal(commuteOnlyEngine.citizenIsSevere(commuteOnlyCitizen), false, "commute-only hardship starts in Waiting during the grace period");
commuteOnlyCitizen.daysDissatisfied = commuteOnlyEngine.config.commuteExtremeGraceDays;
assert.equal(commuteOnlyEngine.citizenIsSevere(commuteOnlyCitizen), true, "persistent commute hardship can still trigger Extreme");
commuteOnlyEngine.enterCitizenState(commuteOnlyCitizen, "Extreme", "commute-only-regression");
assert.equal(commuteOnlyCitizen.hasCar, true, "commute-only Extreme entry retains the citizen's car");

const exactDisposalEngine = new UdesV2Engine({
  seed: 82,
  config: {
    ...compactConfig,
    useCalibratedSameZoneModeChoice: false,
    udesExactCommuteStateGuards: true,
    udesExactExtremeCarDisposal: true,
    extremeNetIncomeAed: -1e9,
    extremeBankBalanceAed: -1e9,
    workdays: [],
  },
});
const exactDisposalCitizen = exactDisposalEngine.citizens[0];
exactDisposalCitizen.hasCar = true;
exactDisposalEngine.applySameZoneCommute(exactDisposalCitizen);
assert.equal(exactDisposalCitizen.mode, "walk", "the point-zone escape hatch restores walk-only same-zone commuting");
exactDisposalCitizen.roundTripMinutes = exactDisposalEngine.config.extremeCommuteRoundTripMin + 1;
assert.equal(exactDisposalEngine.citizenIsSevere(exactDisposalCitizen), true, "the exact guard switch restores immediate commute severity");
exactDisposalEngine.enterCitizenState(exactDisposalCitizen, "Extreme", "exact-rules-regression");
assert.equal(exactDisposalCitizen.hasCar, false, "the explicit exact-rule switch restores disposal on every Extreme entry");

const annualEngine = new UdesV2Engine({
  seed: 2718,
  config: {
    ...compactConfig,
    citizenCount: 240,
    enterpriseCount: 28,
    firmWorkingToGrowMeanDays: 5,
    firmWorkingToLesserMeanDays: 5,
    firmGrowthActionMeanDays: 3,
    firmLesserActionMeanDays: 3,
    firmGrowReturnMeanDays: 8,
    firmLesserReturnMeanDays: 8,
  },
});
annualEngine.step(370);
assert.equal(annualEngine.yearCounter, 1, "annual scheduler runs at the UTC calendar boundary");
assert.ok(
  annualEngine.enterprises.some((enterprise) => enterprise.events.some((event) => event.state === "Grow" || event.state === "Lesser")),
  "firm Working/Grow/Lesser statechart produces state events"
);
assert.deepEqual(annualEngine.validateInvariants(), [], "annual mortality/replacement preserves population links");

const baselineData = {
  schemaVersion: abuDhabiBaseline.schemaVersion,
  zones: abuDhabiBaseline.zones,
  links: abuDhabiBaseline.roadGraph.edges,
  nodes: abuDhabiBaseline.roadGraph.nodes,
  transit: abuDhabiBaseline.transit,
  calibration: abuDhabiBaseline.calibration,
  assumptions: abuDhabiBaseline.assumptions,
};
const appReferenceConfig = {
  startDate: "2024-01-01",
  calibrationLabel: "Illustrative Greater Abu Dhabi City scenario baseline — not a forecast",
  endogenousEnterpriseDynamics: true,
  transitFareAed: 2,
  transitSpeedKmh: 28,
  roadCapacityMultiplier: 1,
  carCostPerKmAed: 0.35,
  housingCapacityMultiplier: 1,
  businessCapacityMultiplier: 1,
  rentPressureMultiplier: 1,
  placeQuality: 0.82,
  waitingNetIncomeAed: 1500,
  acceptableCommuteRoundTripMin: 60,
  extremeCommuteRoundTripMin: 90,
  enterpriseTargetMargin: 0.12,
};
const baselineEngine = new UdesV2Engine({ data: baselineData, config: appReferenceConfig, seed: 240124 });
const initialBaselineCity = baselineEngine.snapshot().city;
assert.ok(initialBaselineCity.modeShares.car > 0, "the opening snapshot includes modeled car trips");
assert.ok(initialBaselineCity.modeShares.pt > 0, "the opening snapshot includes modeled public-transport trips");
assert.ok(initialBaselineCity.modeShares.walk > 0, "the opening snapshot includes modeled walking trips");
assert.ok(initialBaselineCity.averageRoundTripMinutes > 0, "the opening snapshot includes commute time");
assert.ok(initialBaselineCity.averageRoadCapacityUsage > 0, "the opening snapshot includes road load");
assert.ok(initialBaselineCity.stateShares.Happy < 100, "the opening snapshot applies citizen decision rules");
baselineEngine.step(30);
const baselineCity = baselineEngine.snapshot().city;
const expectedBaselineRepresentedPopulation =
  Math.round(abuDhabiBaseline.calibration.studyScopePopulation2024 / abuDhabiBaseline.calibration.citizenAgentPersonsRecommended) *
  abuDhabiBaseline.calibration.citizenAgentPersonsRecommended;
assert.equal(
  baselineCity.representedPopulation,
  expectedBaselineRepresentedPopulation,
  "committed baseline creates the configured weighted study population"
);
assert.deepEqual(baselineEngine.validateInvariants(), [], "committed baseline preserves reciprocal agent, firm, and zone references");
assert.ok(baselineCity.modeShares.car >= 55 && baselineCity.modeShares.car <= 80, "30-day car share stays in the planning band");
assert.ok(baselineCity.modeShares.pt >= 8 && baselineCity.modeShares.pt <= 35, "30-day public-transport share stays in the planning band");
assert.ok(baselineCity.modeShares.walk >= 5 && baselineCity.modeShares.walk <= 25, "30-day walk share stays in the planning band");
assert.ok((baselineCity.forcedInterzoneWalkers / baselineCity.representedEmployed) * 100 <= 5, "forced interzone walking stays below five percent");
assert.ok(baselineCity.stateShares.Extreme < 30, "fewer than thirty percent of citizens are Extreme after 30 days");
const sameZoneModes = new Set(
  baselineEngine.citizens.filter((citizen) => citizen.enterpriseId && citizen.homeZoneId === citizen.workZoneId).map((citizen) => citizen.mode)
);
assert.ok(sameZoneModes.has("car") && sameZoneModes.has("pt") && sameZoneModes.has("walk"), "same-zone commutes use all three modes");
assert.deepEqual(
  {
    modeShares: baselineCity.modeShares,
    stateShares: baselineCity.stateShares,
    forcedInterzoneWalkers: baselineCity.forcedInterzoneWalkers,
    carDisposals: baselineCity.eventsTotal.carDisposals,
    averageRoundTripMinutes: baselineCity.averageRoundTripMinutes,
  },
  {
    modeShares: { car: 61.29, pt: 28.72, walk: 9.99 },
    stateShares: { Happy: 42.73, Waiting: 30.56, Extreme: 26.24, Recovery: 0.46 },
    forcedInterzoneWalkers: 0,
    carDisposals: 293,
    averageRoundTripMinutes: 49,
  },
  "the seeded real-baseline 30-day scenario remains deterministic"
);

const workerMessages = [];
const controller = createWorkerController((message) => workerMessages.push(message));
await controller.handle({
  type: "init",
  requestId: "init-1",
  payload: { seed: 99, config: { ...compactConfig, citizenCount: 120, enterpriseCount: 15 } },
});
assert.equal(workerMessages.at(-1).type, "ready");
assert.equal(workerMessages.at(-1).requestId, "init-1");

await controller.handle({ type: "step", requestId: "step-1", payload: { days: 2, captureDaily: true } });
assert.equal(workerMessages.at(-1).type, "snapshot");
assert.equal(workerMessages.at(-1).payload.clock.day, 2);
assert.equal(workerMessages.at(-1).payload.dailySeries.length, 2, "worker step forwards compact daily observations in its single snapshot reply");

await controller.handle({ type: "run", requestId: "run-1", payload: { days: 5, chunkDays: 2 } });
assert.ok(workerMessages.some((message) => message.type === "progress" && message.requestId === "run-1"));
assert.equal(workerMessages.at(-1).type, "snapshot");
assert.equal(workerMessages.at(-1).payload.clock.day, 7);
const interruptedRun = controller.handle({ type: "run", requestId: "run-cancelled", payload: { days: 60, chunkDays: 1 } });
await new Promise((resolve) => setTimeout(resolve, 0));
await controller.handle({ type: "step", requestId: "step-supersedes-run", payload: { days: 1 } });
await interruptedRun;
const cancelledRunReply = workerMessages.find((message) => message.type === "error" && message.requestId === "run-cancelled");
assert.equal(cancelledRunReply?.payload?.code, "RUN_CANCELLED", "a superseded run receives a terminal cancellation reply");
assert.equal(
  workerMessages.filter((message) => message.requestId === "run-cancelled" && ["snapshot", "ready", "inspection", "error"].includes(message.type))
    .length,
  1,
  "an interrupted run emits exactly one terminal reply"
);

const inspectedCitizenId = controller.getEngine().citizens[0].id;
await controller.handle({
  type: "inspect",
  requestId: "inspect-1",
  payload: { kind: "citizen", id: inspectedCitizenId, historyLimit: 4 },
});
assert.equal(workerMessages.at(-1).type, "inspection");
assert.equal(workerMessages.at(-1).payload.value.id, inspectedCitizenId);

await controller.handle({ type: "configure", requestId: "config-1", payload: { patch: { ptFareOneWayAed: 1 } } });
assert.equal(workerMessages.at(-1).type, "snapshot");
assert.equal(controller.getEngine().config.ptFareOneWayAed, 1);

await controller.handle({
  type: "configure",
  requestId: "alias-config-1",
  payload: { patch: { transitFareAed: 1.5, carCostPerKmAed: 0.4 } },
});
assert.equal(controller.getEngine().config.ptFareOneWayAed, 1.5);
assert.equal(controller.getEngine().config.carFuelAndRunningCostAedPerKm, 0.4);
assert.equal(workerMessages.at(-1).payload.transitFare.baseFarePerDirectionAed, 1.5, "configure snapshots expose the aliased base fare");
assert.equal(workerMessages.at(-1).payload.transitFare.farePerPassengerKmAed, 0.05, "configure snapshots expose the canonical distance fare");
assert.equal(workerMessages.at(-1).payload.transitFare.maximumFarePerDirectionAed, 5, "configure snapshots expose the official fare cap");

await controller.handle({ type: "reset", requestId: "reset-1", payload: { seed: 99 } });
assert.equal(workerMessages.at(-1).type, "ready");
assert.equal(workerMessages.at(-1).payload.snapshot.clock.day, 0);

console.log("UDES v2 agent engine tests passed");
