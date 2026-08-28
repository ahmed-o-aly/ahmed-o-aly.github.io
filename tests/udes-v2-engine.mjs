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
assert.equal(DEFAULT_CONFIG.initialEmploymentRate, 0.67, "citizen agents open at the evidence-anchored employed-resident share");
assert.equal(DEFAULT_CONFIG.targetEmploymentRate, 0.67, "labor matching maintains the same employed-resident reference share");
assert.equal(DEFAULT_CONFIG.laborForceParticipationRate, 0.7, "labor-force participation is explicit and separate from employment");
assert.equal(DEFAULT_CONFIG.activeJobSeekerResidentRate, 0.03, "the opening labor-force reserve contains three percent active job seekers");
assert.equal(DEFAULT_CONFIG.nonParticipantMonthlySupportBufferAed, 1500, "nonparticipant support retains a transparent residual buffer");
assert.equal(DEFAULT_CONFIG.assignmentPeakHours, 13, "the legacy key represents the documented 13-hour daily assignment window");
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
const openingSnapshot = first.snapshot();
assert.equal(openingSnapshot.city.representedPopulation, 10500);
assert.equal(
  openingSnapshot.city.eventsTotal.initialEmploymentAssignments,
  openingSnapshot.city.representedEmployed / compactConfig.citizenWeight,
  "opening employment is classified as initialization rather than simulated hiring"
);
assert.equal(openingSnapshot.city.eventsTotal.hires, 0, "opening employment assignments do not inflate simulated hires");
const openingEmployedAgents = first.citizens.filter((citizen) => citizen.enterpriseId).length;
assert.equal(
  openingEmployedAgents,
  Math.round(first.citizens.length * 0.67),
  "opening employment counts all resident agents at the 67% reference share"
);
assert.equal(
  first.jobSeekerIds.size + first.nonParticipantIds.size,
  first.unemployedIds.size,
  "active unemployed and nonparticipants partition the complete non-employed stock"
);
assert.equal(
  openingEmployedAgents + first.jobSeekerIds.size + first.nonParticipantIds.size,
  first.citizens.length,
  "employed, active unemployed, and nonparticipant states conserve every citizen agent"
);
assert.equal(
  openingSnapshot.city.representedLaborForce,
  openingSnapshot.city.representedEmployed + openingSnapshot.city.representedUnemployed,
  "the labor-force stock equals employed residents plus active unemployed residents"
);
assert.equal(
  openingSnapshot.city.representedPopulation,
  openingSnapshot.city.representedLaborForce + openingSnapshot.city.representedNonparticipants,
  "labor-force participants and nonparticipants conserve the represented resident population"
);
assert.equal(
  openingSnapshot.city.unemploymentRate,
  Number(((openingSnapshot.city.representedUnemployed / openingSnapshot.city.representedLaborForce) * 100).toFixed(2)),
  "unemployment uses the represented labor force rather than all residents as its denominator"
);
const openingNonparticipant = first.citizenById.get([...first.nonParticipantIds][0]);
const nonparticipantAccount = first.citizenFinancialAccount(openingNonparticipant);
assert.equal(first.citizenLaborForceStatus(openingNonparticipant), "nonparticipant");
assert.ok(nonparticipantAccount.nonLaborSupportAed > 0, "nonparticipants receive the explicit modeled non-labor resource assumption");
assert.equal(nonparticipantAccount.accountingReconciliationDifferenceAed, 0, "nonparticipant resources reconcile with housing and essentials");
assert.equal(
  nonparticipantAccount.status,
  "outside-labor-force",
  "nonparticipants have their own explicit financial-status category instead of being mislabeled as unemployed or savings-capable workers"
);
assert.equal(
  nonparticipantAccount.nonLaborSupportAed,
  openingNonparticipant.residentialRentAed + DEFAULT_CONFIG.monthlyEssentialConsumptionAed + DEFAULT_CONFIG.nonParticipantMonthlySupportBufferAed,
  "modeled nonparticipant resources explicitly cover housing, ordinary essentials, and the configured buffer"
);
assert.equal(openingNonparticipant.state, "Happy", "a supported nonparticipant does not automatically enter Extreme for having no wage");
assert.equal(first.searchBetterJob(openingNonparticipant), false, "a nonparticipant stays outside active job search");
assert.equal(
  first.citizens.filter((citizen) => citizen.laborForceParticipant === false && citizen.state === "Extreme").length,
  0,
  "nonparticipants do not dominate Extreme: none enter it automatically at initialization"
);
assert.match(
  first.citizenDecisionExplanation(openingNonparticipant).primaryGoal,
  /outside active job search/i,
  "the inspector explains a nonparticipant's distinct goal and decision context"
);
const openingJobSeeker = first.citizenById.get([...first.jobSeekerIds][0]);
assert.equal(first.citizenLaborForceStatus(openingJobSeeker), "unemployed");
assert.equal(first.citizenFinancialAccount(openingJobSeeker).status, "unemployed", "active job seekers retain an honest unemployment status");
assert.ok(
  [...first.jobSeekerIds].every((id) => {
    const citizen = first.citizenById.get(id);
    return citizen.state === "Waiting" || citizen.state === "Extreme";
  }),
  "unsupported true unemployed participants remain eligible for Waiting or Extreme"
);
const laborStatusSnapshot = first.snapshot({ citizenIds: [openingNonparticipant.id, openingJobSeeker.id] });
const serializedNonparticipant = laborStatusSnapshot.citizens.find((citizen) => citizen.id === openingNonparticipant.id);
const serializedJobSeeker = laborStatusSnapshot.citizens.find((citizen) => citizen.id === openingJobSeeker.id);
assert.deepEqual(
  [serializedNonparticipant.laborForceParticipant, serializedNonparticipant.laborForceStatus, serializedNonparticipant.jobSeeking],
  [false, "nonparticipant", false],
  "citizen snapshots expose nonparticipation and job-search status"
);
assert.deepEqual(
  [serializedJobSeeker.laborForceParticipant, serializedJobSeeker.laborForceStatus, serializedJobSeeker.jobSeeking],
  [true, "unemployed", true],
  "citizen snapshots expose true active unemployment"
);
assert.ok(
  new Set(openingSnapshot.commuteOd.filter((row) => !row.workZoneId).map((row) => row.employmentStatus)).has("nonparticipant") &&
    new Set(openingSnapshot.commuteOd.filter((row) => !row.workZoneId).map((row) => row.employmentStatus)).has("unemployed"),
  "home-to-work stock separates nonparticipants from active unemployed residents"
);
assert.equal(openingSnapshot.mapFrame, null, "full map-agent state is opt-in for compact reference and analysis snapshots");
const compactMapFrame = first.snapshot({ mapFrame: "all" }).mapFrame;
assert.equal(compactMapFrame.citizenCount, first.citizens.length, "an active map frame includes every citizen agent");
assert.equal(compactMapFrame.enterpriseCount, first.enterprises.length, "an active map frame includes every enterprise agent");
assert.equal(compactMapFrame.citizens.homeZones.length, first.citizens.length, "citizen home-zone codes conserve the full agent stock");
assert.equal(compactMapFrame.citizens.workZones.length, first.citizens.length, "citizen work-zone codes conserve the full agent stock");
assert.equal(compactMapFrame.citizens.states.length, first.citizens.length, "citizen state codes conserve the full agent stock");
assert.equal(compactMapFrame.citizens.modes.length, first.citizens.length, "citizen mode codes conserve the full agent stock");
assert.equal(compactMapFrame.citizens.laborForceStatuses.length, first.citizens.length, "labor-force status codes conserve the full citizen stock");
assert.deepEqual(compactMapFrame.codes.citizenLaborForceStatuses, ["nonparticipant", "unemployed", "employed"]);
assert.equal(compactMapFrame.enterprises.zones.length, first.enterprises.length, "enterprise zone codes conserve the full agent stock");
assert.equal(compactMapFrame.enterprises.states.length, first.enterprises.length, "enterprise state codes conserve the full agent stock");
assert.equal(first.snapshot({ mapFrame: "none" }).mapFrame, null, "a reference snapshot can explicitly omit the map frame");
assert.equal(openingSnapshot.commuteOdMetadata.observationType, "current-stock");
assert.equal(openingSnapshot.commuteOdMetadata.representedResidents, openingSnapshot.city.representedPopulation);
assert.ok(
  Object.values(openingSnapshot.city.mobilityEventRates)
    .filter((value) => typeof value === "number")
    .every(Number.isFinite),
  "opening movement-rate diagnostics are finite"
);
assert.deepEqual(first.validateInvariants(), [], "initial employment and location references are reciprocal");

const participationPromotionEngine = new UdesV2Engine({
  seed: 314160,
  config: { ...compactConfig, citizenCount: 100, enterpriseCount: 20, maxDailyLaborMatches: 100 },
});
assert.equal(participationPromotionEngine.citizens.length - participationPromotionEngine.nonParticipantIds.size, 70);
participationPromotionEngine.configure({ targetEmploymentRate: 0.85 });
participationPromotionEngine.matchUnemployedCitizens();
assert.equal(
  participationPromotionEngine.citizens.length - participationPromotionEngine.nonParticipantIds.size,
  88,
  "raising the live employment target promotes enough nonparticipants to preserve the three-point active-seeker reserve"
);
assert.ok(
  [...participationPromotionEngine.jobSeekerIds].every((id) => participationPromotionEngine.unemployedIds.has(id)),
  "promoted active seekers remain a subset of complete non-employment accounting"
);
const fullEmploymentEngine = new UdesV2Engine({
  seed: 314161,
  config: { ...compactConfig, citizenCount: 80, enterpriseCount: 40, initialEmploymentRate: 1, targetEmploymentRate: 1 },
});
assert.equal(
  fullEmploymentEngine.citizens.filter((citizen) => citizen.enterpriseId).length,
  80,
  "a 100% employment fixture can still hire every agent"
);
assert.equal(fullEmploymentEngine.nonParticipantIds.size, 0, "100% employment implies 100% participation");
assert.equal(fullEmploymentEngine.jobSeekerIds.size, 0, "100% employment leaves no active unemployed reserve");

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
  assert.ok(Array.isArray(observation.flows.residentialMoves), "daily observations expose residential origin-destination rows");
  assert.ok(Array.isArray(observation.flows.jobMoves), "daily observations expose workplace origin-destination rows");
  assert.ok(Array.isArray(observation.flows.enterpriseMoves), "daily observations expose enterprise origin-destination rows");
  assert.ok(Array.isArray(observation.transitions.citizens), "daily observations expose citizen state transitions with reasons");
  assert.ok(Array.isArray(observation.transitions.enterprises), "daily observations expose enterprise state transitions with reasons");
  for (const zone of observation.zoneSeries) {
    for (const field of [
      "averageGrossSalaryAed",
      "averageHousingCostAed",
      "averageMonthlyTransportCostAed",
      "averageCashAfterHousingAndCommuteAed",
      "averageResidualAfterEssentialsAed",
      "residentialMoveInflows",
      "residentialMoveOutflows",
      "residentialMoveNet",
      "jobMoveInflows",
      "jobMoveOutflows",
      "jobMoveNet",
      "enterpriseMoveInflows",
      "enterpriseMoveOutflows",
      "enterpriseMoveNet",
    ]) {
      assert.ok(Number.isFinite(zone[field]), `${field} is a finite district-day diagnostic`);
    }
    assert.ok(zone.financialStatusShares && zone.enterpriseStateShares, "district days retain household and enterprise state diagnostics");
  }
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
boundaryCitizen.lastMoveDay = monthBoundaryDailyEngine.day - monthBoundaryDailyEngine.config.residentialMoveCooldownDays;
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
assert.equal(
  citizenInspection.financialAccount.accountingReconciliationDifferenceAed,
  0,
  "citizen accounting reconciles the formerly ambiguous net-income measure to its named components"
);
assert.match(citizenInspection.decisionExplanation.decisionModel, /statechart/i, "citizen inspection explains its decision mechanism");
assert.ok(citizenInspection.decisionExplanation.currentAssessment.financialStatus, "citizen inspection exposes the active financial guard");

const enterpriseInspection = first.inspect("enterprise", first.enterprises[0].id, 8);
assert.ok(Array.isArray(enterpriseInspection.employeeIds));
assert.ok(enterpriseInspection.sector, "firms carry a persistent sector");
assert.ok(Number.isFinite(enterpriseInspection.monthlyRevenueAed), "monthly enterprise revenue is exposed");
assert.ok(Number.isFinite(enterpriseInspection.operatingMargin), "enterprise operating margin is exposed");
assert.ok(enterpriseInspection.laborAccessScore >= 0 && enterpriseInspection.laborAccessScore <= 1);
assert.match(enterpriseInspection.decisionExplanation.primaryGoal, /operating margin/i, "enterprise inspection states its implemented goal");
assert.ok(
  Number.isFinite(enterpriseInspection.decisionExplanation.currentAssessment.marginGapPercentagePoints),
  "enterprise inspection exposes the economic signal governing its state hazards"
);
for (const citizenId of enterpriseInspection.employeeIds) {
  assert.equal(first.citizenById.get(citizenId).enterpriseId, enterpriseInspection.id);
}

const accountingSnapshot = first.snapshot();
assert.equal(
  accountingSnapshot.commuteOd.reduce((total, row) => total + row.representedResidents, 0),
  accountingSnapshot.city.representedPopulation,
  "the current home-to-work OD stock accounts for employed and unemployed residents"
);
assert.equal(
  accountingSnapshot.commuteOd.reduce((total, row) => total + row.representedWorkers, 0),
  accountingSnapshot.city.representedEmployed,
  "the current home-to-work OD stock reconciles to city employment"
);
const financialBins = accountingSnapshot.city.distributions.financialStatus.bins;
assert.equal(
  financialBins.reduce((total, bin) => total + bin.representedCount, 0),
  accountingSnapshot.city.representedPopulation,
  "mutually exclusive financial-status groups account for the entire represented population"
);
assert.equal(
  accountingSnapshot.city.distributions.income.exactZeroAgentCount,
  first.citizens.filter((citizen) => citizen.netIncomeAed === 0).length,
  "the income contract reports exact zeros separately instead of implying that a broad AED bin is zero"
);
assert.match(
  accountingSnapshot.city.distributions.income.unit,
  /after housing and commuting, before essential consumption/i,
  "the distribution names the accounting boundary that users are looking at"
);

const flowEngine = new UdesV2Engine({ seed: 16661, config: { ...compactConfig, citizenCount: 160, enterpriseCount: 24 } });
flowEngine.resetDailyFlows();
const previousFlowEvents = { ...flowEngine.eventsTotal };
const residentialMover = flowEngine.citizens[0];
const residentialOriginId = residentialMover.homeZoneId;
const residentialTarget = flowEngine.zones.find((zone) => zone.id !== residentialOriginId);
residentialMover.lastMoveDay = flowEngine.day - flowEngine.config.residentialMoveCooldownDays;
assert.ok(flowEngine.moveCitizen(residentialMover, residentialTarget.id, "test-residential-od"));

const jobMover = flowEngine.citizens.find((citizen) => citizen.enterpriseId);
const formerWorkZoneId = jobMover.workZoneId;
const targetEmployer = flowEngine.enterprises.find(
  (enterprise) => enterprise.zoneId !== formerWorkZoneId && enterprise.hiring && enterprise.employeeIds.size < enterprise.maxJobSlots
);
assert.ok(targetEmployer, "the OD fixture has a cross-district hiring enterprise");
assert.ok(flowEngine.employ(jobMover, targetEmployer, jobMover.salaryAed * 1.1, "better-job"));

const relocatingEnterprise = flowEngine.enterprises.find((enterprise) => enterprise.employeeIds.size > 0);
const enterpriseOriginId = relocatingEnterprise.zoneId;
const enterpriseTarget = flowEngine.zones.find((zone) => zone.id !== enterpriseOriginId && zone.enterpriseIds.size < zone.enterprisePlaceCapacity);
assert.ok(enterpriseTarget, "the OD fixture has a district with enterprise capacity");
relocatingEnterprise.lastMoveDay = flowEngine.day - flowEngine.config.firmMoveCooldownDays;
assert.ok(flowEngine.moveEnterprise(relocatingEnterprise, enterpriseTarget.id, "test-enterprise-od"));

const flowObservation = flowEngine.dailyObservation(previousFlowEvents);
assert.equal(flowObservation.flows.totals.residentialMoveAgents, 1, "a residential move is conserved in daily OD totals");
assert.equal(
  flowObservation.flows.totals.representedResidentialMoves,
  flowObservation.events.residentialMovesRepresented,
  "residential OD totals reconcile to the daily represented move counter"
);
assert.ok(flowObservation.flows.totals.crossDistrictJobMoveAgents >= 1, "cross-district job changes are retained in daily OD totals");
assert.equal(flowObservation.events.jobChanges, 1, "the voluntary-switch event counter includes the completed employer change");
assert.equal(
  flowObservation.events.crossDistrictJobChanges,
  flowObservation.flows.totals.crossDistrictJobMoveAgents,
  "the cross-district switch counter reconciles to the OD routes shown in the flow panel"
);
assert.equal(flowObservation.flows.totals.enterpriseMoves, 1, "an enterprise move is conserved in daily OD totals");
assert.equal(
  flowObservation.zoneSeries.reduce((total, zone) => total + zone.residentialMoveNet, 0),
  0,
  "district residential inflows and outflows balance citywide"
);
assert.equal(
  flowObservation.zoneSeries.reduce((total, zone) => total + zone.jobMoveNet, 0),
  0,
  "district workplace inflows and outflows balance citywide"
);
assert.equal(
  flowObservation.zoneSeries.reduce((total, zone) => total + zone.enterpriseMoveNet, 0),
  0,
  "district enterprise inflows and outflows balance citywide"
);
assert.equal(
  flowObservation.flows.totals.crossDistrictJobMoveAgents,
  1,
  "job-move flow counts the citizen's voluntary employer change but not workers carried by a firm's relocation"
);
assert.equal(
  flowObservation.events.workersAffectedByFirmMoves,
  relocatingEnterprise.employeeIds.size,
  "firm relocation reports affected workers in its own event taxonomy"
);

const frictionEngine = new UdesV2Engine({
  seed: 16662,
  config: { ...compactConfig, citizenCount: 120, enterpriseCount: 20, residentialMoveCooldownDays: 365, firmMoveCooldownDays: 730 },
});
const frictionCitizen = frictionEngine.citizens[0];
const frictionHome = frictionCitizen.homeZoneId;
const frictionTarget = frictionEngine.zones.find((zone) => zone.id !== frictionHome && frictionEngine.zoneAcceptsResident(zone));
frictionCitizen.lastMoveDay = 0;
frictionEngine.day = 364;
assert.equal(frictionEngine.moveCitizen(frictionCitizen, frictionTarget.id, "cooldown-test"), false, "household cannot move one day before cooldown");
frictionEngine.day = 365;
assert.equal(frictionEngine.moveCitizen(frictionCitizen, frictionTarget.id, "cooldown-test"), true, "household can move on exact cooldown boundary");
const frictionFirm = frictionEngine.enterprises[0];
const frictionFirmTarget = frictionEngine.zones.find(
  (zone) => zone.id !== frictionFirm.zoneId && zone.enterpriseIds.size < zone.enterprisePlaceCapacity
);
frictionFirm.lastMoveDay = 0;
frictionEngine.day = 729;
assert.equal(frictionEngine.moveEnterprise(frictionFirm, frictionFirmTarget.id, "cooldown-test"), false, "firm cannot move one day before cooldown");
frictionEngine.day = 730;
assert.equal(frictionEngine.moveEnterprise(frictionFirm, frictionFirmTarget.id, "cooldown-test"), true, "firm can move on exact cooldown boundary");

const exposureEngine = new UdesV2Engine({
  seed: 16663,
  config: { ...compactConfig, citizenCount: 120, enterpriseCount: 20, maxDailyLaborMatches: 0, workdays: [] },
});
exposureEngine.step(1);
assert.equal(
  exposureEngine.employedAgentDays,
  exposureEngine.citizens.length - exposureEngine.unemployedIds.size,
  "employment exposure accumulates the exact end-of-day employed-agent stock"
);
const exposureCitizen = exposureEngine.citizens.find((citizen) => citizen.enterpriseId);
assert.ok(exposureCitizen, "employment-exposure fixture has an employed citizen");
exposureEngine.detachEmployment(exposureCitizen, "exposure-test", false);
const secondDayEmployment = exposureEngine.citizens.length - exposureEngine.unemployedIds.size;
const exposureBeforeSecondDay = exposureEngine.employedAgentDays;
exposureEngine.step(1);
assert.equal(
  exposureEngine.employedAgentDays - exposureBeforeSecondDay,
  secondDayEmployment,
  "employment-based annualized rates integrate changing employment rather than using an endpoint stock"
);
exposureEngine.eventsTotal.jobChanges = 1;
exposureEngine.eventsTotal.crossDistrictJobChanges = 1;
exposureEngine.eventsTotal.workersAffectedByFirmMoves = 1;
exposureEngine.employedAgentDays = 365.2425;
exposureEngine.lastSnapshotCache = null;
const exposureRates = exposureEngine.snapshot().city.mobilityEventRates;
assert.equal(exposureRates.voluntaryJobSwitchesPer100EmployedAgentYears, 100);
assert.equal(exposureRates.crossDistrictVoluntaryJobSwitchesPer100EmployedAgentYears, 100);
assert.equal(exposureRates.employerCarriedWorkplaceChangesPer100EmployedAgentYears, 100);

const reentryEngine = new UdesV2Engine({ seed: 16664, config: { ...compactConfig, citizenCount: 120, enterpriseCount: 20 } });
const reentryFirm = reentryEngine.enterprises[0];
const reentryTarget = reentryEngine.zones.find((zone) => zone.id !== reentryFirm.zoneId && zone.enterpriseIds.size < zone.enterprisePlaceCapacity);
assert.ok(reentryTarget, "enterprise re-entry fixture has a different district with capacity");
const incumbentMovesBeforeReentry = reentryEngine.eventsTotal.firmMoves;
const reentryPlacementsBefore = reentryEngine.eventsTotal.enterpriseReentryPlacements;
assert.equal(reentryEngine.moveEnterprise(reentryFirm, reentryTarget.id, "restart-lowest-rent", true, "reentry"), true);
assert.equal(reentryEngine.eventsTotal.firmMoves, incumbentMovesBeforeReentry, "a restart placement is not an incumbent firm relocation");
assert.equal(
  reentryEngine.eventsTotal.enterpriseReentryPlacements,
  reentryPlacementsBefore + 1,
  "a cross-district restart placement has its own event counter"
);
assert.equal(reentryEngine.aggregateDailyFlows().totals.enterpriseMoves, 0, "restart placements do not enter the incumbent relocation OD chart");

const transitionEngine = new UdesV2Engine({
  seed: 17171,
  config: {
    ...compactConfig,
    citizenCount: 120,
    enterpriseCount: 16,
    workdays: [],
    waitingNetIncomeAed: -1e9,
    extremeNetIncomeAed: -1e9,
    extremeBankBalanceAed: -1e9,
    acceptableCommuteRoundTripMin: 1e9,
    extremeCommuteRoundTripMin: 1e9,
  },
});
assert.ok(
  transitionEngine.citizens.every((citizen) => citizen.state === "Happy"),
  "the transition fixture begins in Happy"
);
transitionEngine.configure({ waitingNetIncomeAed: 1e9 });
const transitionObservation = transitionEngine.step(1, { captureDaily: true }).dailySeries[0];
assert.equal(
  transitionObservation.transitions.totals.representedCitizenTransitions,
  transitionEngine.citizens.length * transitionEngine.config.citizenWeight,
  "daily state-transition rows account for every represented citizen that changes state"
);
assert.ok(
  transitionObservation.transitions.citizens.every(
    (transition) => transition.fromState === "Happy" && transition.toState === "Waiting" && transition.reason === "dissatisfaction-guard"
  ),
  "state-transition rows preserve the implemented source, destination, and guard reason"
);
transitionEngine.resetDailyTransitions();
const replacedCitizen = transitionEngine.citizens[0];
replacedCitizen.state = "Extreme";
transitionEngine.replaceCitizen(replacedCitizen);
const replacementTransition = transitionEngine
  .aggregateDailyTransitions()
  .citizens.find((transition) => transition.reason === "demographic-replacement");
assert.ok(replacementTransition, "demographic replacement records the state-stock transition to the new citizen generation");
assert.equal(replacementTransition.fromState, "Extreme");
assert.equal(replacementTransition.toState, "Happy");
assert.equal(replacementTransition.representedResidents, transitionEngine.config.citizenWeight);

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

const physicalFixtureZones = DEFAULT_ZONES.slice(0, 2).map((zone, index) => ({
  ...zone,
  networkNodeId: index === 0 ? "physical-a" : "physical-b",
}));
const [physicalZoneA, physicalZoneB] = physicalFixtureZones;
const physicalFixtureNodes = [
  { id: "physical-a", coord: [physicalZoneA.lon, physicalZoneA.lat], kind: "zone-access", zoneIds: [physicalZoneA.id] },
  { id: "physical-b", coord: [physicalZoneB.lon, physicalZoneB.lat], kind: "zone-access", zoneIds: [physicalZoneB.id] },
  {
    id: "physical-c",
    coord: [(physicalZoneA.lon + physicalZoneB.lon) / 2, Math.min(physicalZoneA.lat, physicalZoneB.lat) - 0.02],
    kind: "junction",
    zoneIds: [],
  },
];
const physicalFixtureEdges = [
  {
    id: "one-way-a-b",
    from: "physical-a",
    to: "physical-b",
    bidirectional: false,
    distanceKm: 1,
    freeFlowMinutes: 1,
    capacityVehPerHourAB: 100,
    capacityVehPerHourBA: 0,
    capacityDirection: "per direction",
    geometry: { type: "LineString", coordinates: [physicalFixtureNodes[0].coord, physicalFixtureNodes[1].coord] },
  },
  {
    id: "asymmetric-b-c",
    from: "physical-b",
    to: "physical-c",
    bidirectional: true,
    distanceKm: 1,
    freeFlowMinutes: 1,
    capacityVehPerHourAB: 100,
    capacityVehPerHourBA: 40,
    capacityDirection: "per direction",
    geometry: { type: "LineString", coordinates: [physicalFixtureNodes[1].coord, physicalFixtureNodes[2].coord] },
  },
  {
    id: "return-c-a",
    from: "physical-c",
    to: "physical-a",
    bidirectional: false,
    distanceKm: 1,
    freeFlowMinutes: 1,
    capacityVehPerHourAB: 100,
    capacityVehPerHourBA: 0,
    capacityDirection: "per direction",
    geometry: { type: "LineString", coordinates: [physicalFixtureNodes[2].coord, physicalFixtureNodes[0].coord] },
  },
];
const physicalFixture = new UdesV2Engine({
  seed: 88031,
  data: { zones: physicalFixtureZones, nodes: physicalFixtureNodes, links: physicalFixtureEdges },
  config: {
    ...compactConfig,
    citizenCount: 40,
    enterpriseCount: 6,
    workdays: [],
    assignmentPeakHours: 4,
    roadCapacityMultiplier: 1.25,
    roadCorridorBundleFactor: 99,
  },
});
assert.equal(physicalFixture.usesPhysicalRoadGraph, true, "road-node endpoints activate physical-network routing");
const oneWayLink = physicalFixture.linkById.get("one-way-a-b");
const asymmetricLink = physicalFixture.linkById.get("asymmetric-b-c");
assert.equal(oneWayLink.allowAB, true, "a forward one-way physical edge permits its declared direction");
assert.equal(oneWayLink.allowBA, false, "a forward one-way physical edge rejects reverse traversal");
assert.equal(
  physicalFixture.linkCapacity(asymmetricLink, "car", 1),
  100 * 4 * 1.25,
  "AB assignment capacity is directional hourly capacity times assignment-window hours and the scenario multiplier only"
);
assert.equal(
  physicalFixture.linkCapacity(asymmetricLink, "car", -1),
  40 * 4 * 1.25,
  "BA assignment capacity uses its own directional hourly capacity without the legacy corridor-bundle factor"
);
const fixturePaths = physicalFixture.buildPathMatrix("car");
const fixtureAIndex = physicalFixture.zoneById.get(physicalZoneA.id).index;
const fixtureBIndex = physicalFixture.zoneById.get(physicalZoneB.id).index;
assert.deepEqual(
  fixturePaths[fixtureAIndex][fixtureBIndex].steps.map((step) => [physicalFixture.links[step.linkIndex].id, step.direction]),
  [["one-way-a-b", 1]],
  "the shortest forward path can use a one-way physical edge"
);
assert.deepEqual(
  fixturePaths[fixtureBIndex][fixtureAIndex].steps.map((step) => [physicalFixture.links[step.linkIndex].id, step.direction]),
  [
    ["asymmetric-b-c", 1],
    ["return-c-a", 1],
  ],
  "reverse routing respects the one-way restriction and uses the directed return path"
);
asymmetricLink.loadABVehicles = 250;
asymmetricLink.loadBAVehicles = 100;
const asymmetricMetric = physicalFixture.snapshot().links.find((link) => link.id === asymmetricLink.id);
assert.equal(asymmetricMetric.volumeCapacityAB, 0.5, "AB V/C divides by AB directional period capacity");
assert.equal(asymmetricMetric.volumeCapacityBA, 0.5, "BA V/C divides by BA directional period capacity");

const baselineData = {
  schemaVersion: abuDhabiBaseline.schemaVersion,
  zones: abuDhabiBaseline.zones,
  links: abuDhabiBaseline.roadGraph.segments || abuDhabiBaseline.roadGraph.edges,
  nodes: abuDhabiBaseline.roadGraph.nodes,
  candidateRoutes: abuDhabiBaseline.roadGraph.candidateRoutes,
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

function assertFreshScenarioRespectsZonedJobCapacity(engine, snapshot, label) {
  for (const zoneMetric of snapshot.zones) {
    const zone = engine.zoneById.get(zoneMetric.id);
    const plannedJobsRepresented = engine.zonePlannedJobSlots(zone) * engine.config.citizenWeight;
    assert.equal(zoneMetric.zonedJobCapacityGrandfatheredRepresented, 0, `${label}: ${zoneMetric.name} needs no grandfathered job capacity`);
    assert.ok(
      plannedJobsRepresented <= zoneMetric.requestedZonedJobCapacityRepresented,
      `${label}: ${zoneMetric.name} planned job slots stay within requested zoned capacity`
    );
    assert.ok(
      zoneMetric.jobs <= zoneMetric.requestedZonedJobCapacityRepresented,
      `${label}: ${zoneMetric.name} located jobs stay within requested zoned capacity`
    );
  }
}

const baselineEngine = new UdesV2Engine({ data: baselineData, config: appReferenceConfig, seed: 240124 });
const fullScaleOpeningSnapshot = baselineEngine.snapshot({ mapFrame: "all" });
const fullScaleMapFrame = fullScaleOpeningSnapshot.mapFrame;
assert.equal(baselineEngine.citizens.length, 6070, "the committed full-scale baseline creates 6,070 citizen agents");
assert.equal(baselineEngine.enterprises.length, 600, "the committed full-scale baseline creates 600 enterprise agents");
assert.equal(
  baselineEngine.citizens.filter((citizen) => citizen.enterpriseId).length,
  4067,
  "the full-scale opening stock contains exactly 67% employed residents after integer allocation"
);
assert.equal(baselineEngine.jobSeekerIds.size, 182, "the full-scale opening stock contains the explicit three-percent active job-seeker reserve");
assert.equal(baselineEngine.nonParticipantIds.size, 1821, "the full-scale opening stock contains exactly thirty percent nonparticipants");
assert.deepEqual(
  {
    employment: fullScaleOpeningSnapshot.city.employmentRate,
    participation: fullScaleOpeningSnapshot.city.laborForceParticipationRate,
    unemployment: fullScaleOpeningSnapshot.city.unemploymentRate,
    nonParticipation: fullScaleOpeningSnapshot.city.nonParticipationRate,
  },
  { employment: 67, participation: 70, unemployment: 4.28, nonParticipation: 30 },
  "opening labor rates use the disclosed resident and labor-force denominators"
);
assert.equal(
  fullScaleOpeningSnapshot.city.financialStatusShares["outside-labor-force"],
  30,
  "the financial-status chart assigns the full nonparticipant stock to its explicit thirty-percent bin"
);
assert.equal(
  baselineEngine.citizens.filter((citizen) => citizen.state === "Extreme" && citizen.laborForceParticipant === false).length,
  0,
  "nonparticipants do not dominate Extreme in the full-scale opening state"
);
assert.equal(fullScaleMapFrame.citizenCount, 6070, "the active full-scale map frame exposes all 6,070 citizen agents");
assert.equal(fullScaleMapFrame.enterpriseCount, 600, "the active full-scale map frame exposes all 600 enterprise agents");
assert.equal(fullScaleMapFrame.citizens.homeZones.length, 6070, "the full-scale citizen map-frame arrays have no sampling loss");
assert.equal(fullScaleMapFrame.citizens.workZones.length, 6070, "the full-scale work-zone frame has one code per citizen agent");
assert.equal(fullScaleMapFrame.citizens.states.length, 6070, "the full-scale state frame has one code per citizen agent");
assert.equal(fullScaleMapFrame.citizens.modes.length, 6070, "the full-scale mode frame has one code per citizen agent");
assert.equal(fullScaleMapFrame.citizens.laborForceStatuses.length, 6070, "the full-scale labor-force frame has one code per citizen agent");
assert.equal(fullScaleMapFrame.citizens.generations.length, 6070, "the full-scale generation frame has one code per citizen agent");
assert.equal(fullScaleMapFrame.enterprises.zones.length, 600, "the full-scale enterprise map-frame arrays have no sampling loss");
assert.equal(fullScaleMapFrame.enterprises.states.length, 600, "the full-scale enterprise state frame has one code per enterprise agent");
assert.equal(fullScaleMapFrame.enterprises.employeeCounts.length, 600, "the full-scale enterprise workforce frame has one count per agent");
assert.equal(baselineEngine.snapshot({ mapFrame: "none" }).mapFrame, null, "the same full-scale engine omits map data when requested");
assertFreshScenarioRespectsZonedJobCapacity(baselineEngine, fullScaleOpeningSnapshot, "opening baseline");
assert.ok(
  abuDhabiBaseline.roadGraph.edges.every((source) => {
    const link = baselineEngine.linkById.get(source.id);
    return link && link.allowAB === source.allowAB && link.allowBA === source.allowBA;
  }),
  "the runtime graph preserves every physical edge's declared AB/BA traversal permissions"
);
assert.ok(
  abuDhabiBaseline.roadGraph.edges.some((edge) => edge.loadBearing && edge.allowAB !== edge.allowBA),
  "the committed runtime fixture includes load-bearing one-way evidence"
);
const baselineMidRouteConnectors = abuDhabiBaseline.roadGraph.edges.filter((edge) => edge.loadBearing && !edge.modelVisible);
assert.ok(baselineMidRouteConnectors.length > 0, "the committed road graph distinguishes non-rendered mid-route assignment connectors");
assert.ok(
  baselineMidRouteConnectors.every((source) => {
    const link = baselineEngine.linkById.get(source.id);
    return (
      source.candidateRouteIds.length > 0 &&
      link?.loadBearing &&
      !link.hidden &&
      !link.modelVisible &&
      link.candidateRouteIds.length === source.candidateRouteIds.length
    );
  }),
  "used and unused mid-route OSM alternatives retain candidate membership and remain load-bearing outside the public map"
);
assert.ok(
  baselineMidRouteConnectors.some((source) => {
    const link = baselineEngine.linkById.get(source.id);
    return link.loadABVehicles + link.loadBAVehicles + link.loadABPassengers + link.loadBAPassengers > 0;
  }),
  "actual route assignment loads non-rendered mid-route physical connectors"
);
const baselineAccessEdges = abuDhabiBaseline.roadGraph.edges.filter((edge) => edge.hidden);
assert.ok(
  baselineAccessEdges.every((source) => {
    const link = baselineEngine.linkById.get(source.id);
    return link && !link.loadBearing && link.loadABVehicles + link.loadBAVehicles + link.loadABPassengers + link.loadBAPassengers === 0;
  }),
  "terminal and forced access edges remain non-load-bearing and never dilute road V/C metrics"
);
const baselineContextEdges = abuDhabiBaseline.roadGraph.edges.filter((edge) => edge.contextOnly);
assert.ok(
  baselineContextEdges.length > 0 &&
    baselineContextEdges.every((source) => {
      const link = baselineEngine.linkById.get(source.id);
      return (
        link?.contextOnly &&
        link.modelVisible &&
        !link.loadBearing &&
        !link.allowAB &&
        !link.allowBA &&
        link.loadABVehicles + link.loadBAVehicles + link.loadABPassengers + link.loadBAPassengers === 0
      );
    }),
  "context-only named roads stay visible but closed to routing, assignment demand, and V/C accounting"
);
const assignedSharedLink = baselineEngine.links.find((link) => {
  if (!link.loadBearing || link.candidateRouteIds.length < 2 || link.loadABVehicles + link.loadBAVehicles <= 0) return false;
  const odPairs = new Set(
    baselineEngine.citizens
      .filter((citizen) => citizen.mode === "car" && citizen.routeLinkIds.includes(link.id))
      .map((citizen) => `${citizen.homeZoneId}->${citizen.workZoneId}`)
  );
  return odPairs.size > 1;
});
assert.ok(assignedSharedLink, "at least one shared physical edge aggregates assigned car demand from multiple home-to-work OD pairs");
const expectedSharedVehicleLoad = baselineEngine.citizens.reduce((total, citizen) => {
  if (citizen.mode !== "car") return total;
  const traversals = citizen.routeLinkIds.filter((linkId) => linkId === assignedSharedLink.id).length;
  return total + (traversals * citizen.weight) / baselineEngine.config.carOccupancy;
}, 0);
assert.ok(
  Math.abs(assignedSharedLink.loadABVehicles + assignedSharedLink.loadBAVehicles - expectedSharedVehicleLoad) <= 1e-6,
  "a shared edge load equals the sum of every assigned car traversal instead of one cosmetic corridor total"
);
const initialBaselineCity = fullScaleOpeningSnapshot.city;
assert.ok(initialBaselineCity.modeShares.car > 0, "the opening snapshot includes modeled car trips");
assert.ok(initialBaselineCity.modeShares.pt > 0, "the opening snapshot includes modeled public-transport trips");
assert.ok(initialBaselineCity.modeShares.walk > 0, "the opening snapshot includes modeled walking trips");
assert.ok(initialBaselineCity.averageRoundTripMinutes > 0, "the opening snapshot includes commute time");
assert.ok(initialBaselineCity.averageRoadCapacityUsage > 0, "the opening snapshot includes road load");
assert.ok(initialBaselineCity.stateShares.Happy < 100, "the opening snapshot applies citizen decision rules");
assert.equal(initialBaselineCity.forcedInterzoneWalkers, 0, "the opening physical assignment forces no interzone commuters to walk");
assert.equal(initialBaselineCity.unservedCommuters, 0, "the opening physical assignment serves every employed commuter");
assert.ok(
  initialBaselineCity.capacityOverflowTrips / initialBaselineCity.representedEmployed < 0.1,
  "opening capacity overflow remains below ten percent of represented employed residents"
);
assert.ok(
  Math.max(
    ...fullScaleOpeningSnapshot.links
      .filter((link) => link.loadBearing !== false && link.contextOnly !== true)
      .flatMap((link) => [link.volumeCapacityAB, link.volumeCapacityBA])
  ) < 2,
  "opening directional road V/C remains below the broad two-times-capacity credibility ceiling"
);
baselineEngine.step(30);
const baselineSnapshot = baselineEngine.snapshot();
const baselineCity = baselineSnapshot.city;
const expectedBaselineRepresentedPopulation =
  Math.round(abuDhabiBaseline.calibration.studyScopePopulation2024 / abuDhabiBaseline.calibration.citizenAgentPersonsRecommended) *
  abuDhabiBaseline.calibration.citizenAgentPersonsRecommended;
assert.equal(
  baselineCity.representedPopulation,
  expectedBaselineRepresentedPopulation,
  "committed baseline creates the configured weighted study population"
);
assert.deepEqual(baselineEngine.validateInvariants(), [], "committed baseline preserves reciprocal agent, firm, and zone references");
assertFreshScenarioRespectsZonedJobCapacity(baselineEngine, baselineSnapshot, "30-day baseline");
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
    modeShares: { car: 62.28, pt: 24.68, walk: 13.04 },
    stateShares: { Happy: 69.28, Waiting: 22.17, Extreme: 8.34, Recovery: 0.21 },
    forcedInterzoneWalkers: 0,
    carDisposals: 54,
    averageRoundTripMinutes: 38.96,
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
