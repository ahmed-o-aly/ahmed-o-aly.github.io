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
assert.ok(
  DEFAULT_ZONES.some((zone) => zone.id === "mushrif"),
  "default geography includes Mushrif as its own zone"
);

const first = new UdesV2Engine({ seed: 314159, config: compactConfig });
const second = new UdesV2Engine({ seed: 314159, config: compactConfig });

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
assert.equal(baselineCity.representedPopulation, 1822750, "real baseline creates the configured weighted study population");
assert.deepEqual(baselineEngine.validateInvariants(), [], "real baseline preserves reciprocal agent, firm, and zone references");
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
    modeShares: { car: 60.68, pt: 29.31, walk: 10.02 },
    stateShares: { Happy: 42.48, Waiting: 30.64, Extreme: 26.22, Recovery: 0.66 },
    forcedInterzoneWalkers: 0,
    carDisposals: 399,
    averageRoundTripMinutes: 49.65,
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

await controller.handle({ type: "step", requestId: "step-1", payload: { days: 2 } });
assert.equal(workerMessages.at(-1).type, "snapshot");
assert.equal(workerMessages.at(-1).payload.clock.day, 2);

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

await controller.handle({ type: "reset", requestId: "reset-1", payload: { seed: 99 } });
assert.equal(workerMessages.at(-1).type, "ready");
assert.equal(workerMessages.at(-1).payload.snapshot.clock.day, 0);

console.log("UDES v2 agent engine tests passed");
