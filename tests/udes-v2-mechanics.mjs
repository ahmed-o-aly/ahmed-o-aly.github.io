import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { UdesV2Engine } = require("../assets/js/udes-v2-worker.js");
const { PUBLIC_PRESETS } = require("../assets/js/udes-v2-app.js");
const make = (patch = {}) =>
  new UdesV2Engine({
    seed: 261109,
    config: {
      ...PUBLIC_PRESETS.reference,
      startDate: "2024-01-01",
      citizenCount: 40,
      enterpriseCount: 5,
      citizenWeight: 10,
      initialEmploymentRate: 1,
      laborForceParticipationRate: 1,
      workdays: [],
      dailyJobSeparationProbability: 0,
      dailyJobSearchProbability: 0,
      maxDailyLaborMatches: 0,
      firmWorkingToGrowMeanDays: 1e6,
      firmWorkingToLesserMeanDays: 1e6,
      waitingDecisionMinDays: 1e6,
      waitingDecisionMaxDays: 1e6,
      extremeDecisionMinDays: 1e6,
      extremeDecisionMaxDays: 1e6,
      qualityMoveMinDays: 1e6,
      qualityMoveMaxDays: 1e6,
      carConsiderationMinDays: 1e6,
      carConsiderationMaxDays: 1e6,
      ...patch,
    },
  });

// Salary, housing and vehicle access follow their actual calendar-day spells.
{
  const e = make({ monthlyEssentialConsumptionAed: 310, carAcquisitionFixedMonthlyCostAed: 620 });
  const c = e.citizens.find((citizen) => citizen.enterpriseId);
  const home = e.zoneById.get(c.homeZoneId);
  c.salaryAed = 3100;
  home.residentialRentAed = 310;
  c.hasCar = false;
  c.bankBalanceAed = 0;
  e.step(15); // January 1–15 completed; displayed date is January 16.
  assert.equal(e.clock.date, "2024-01-16");
  c.salaryAed = 6200;
  home.residentialRentAed = 620;
  c.hasCar = true;
  e.step(16);
  const account = e.citizenFinancialAccount(c);
  assert.equal(e.clock.date, "2024-02-01");
  assert.equal(account.grossSalaryAed, 4700, "15 days at 100/day plus 16 at 200/day");
  assert.equal(account.housingCostAed, 470, "housing costs are prorated at each rate");
  assert.equal(account.ownershipCostAed, 320, "16 days of vehicle access at 20/day");
  assert.equal(account.essentialConsumptionAed, 310);
  assert.equal(account.accountedCalendarDays, 31);
  assert.equal(account.employedCalendarDays, 31);
  assert.equal(account.residualAfterEssentialsAed, 3600);
  assert.equal(c.lastMonthlyBankBalanceDeltaAed, 900);
  assert.equal(c.bankBalanceAed, 900);
  assert.equal(account.accountingReconciliationDifferenceAed, 0);
  assert.deepEqual(e.validateInvariants(), []);
}

// Separating on the last day does not erase thirty earned days of wages.
{
  const e = make();
  const c = e.citizens.find((citizen) => citizen.enterpriseId);
  c.salaryAed = 3100;
  e.step(30);
  e.detachEmployment(c, "fixture-last-day-separation", false);
  e.step(1);
  assert.equal(c.lastAccountedGrossSalaryAed, 3000);
  assert.equal(c.lastAccountedEmployedDays, 30);
}

// A new hire on January 31 receives one day, not a whole month.
{
  const e = make({ initialEmploymentRate: 0, laborForceParticipationRate: 1 });
  const c = e.citizens[0];
  const firm = e.enterprises[0];
  e.step(30);
  firm.desiredJobSlots = 1;
  assert.ok(e.employ(c, firm, 3100, "fixture-last-day-hire"));
  e.step(1);
  assert.equal(c.lastAccountedGrossSalaryAed, 100);
  assert.equal(c.lastAccountedEmployedDays, 1);
  assert.equal(firm.lastCompletedSalaryBillAed, 100 * c.weight);
}

// February uses its actual number of days, and a midmonth start settles only
// simulated intervals instead of inventing income before the model existed.
{
  const e = make({ startDate: "2024-02-15" });
  const c = e.citizens.find((citizen) => citizen.enterpriseId);
  c.salaryAed = 2900;
  e.step(15);
  assert.equal(e.clock.date, "2024-03-01");
  assert.equal(c.lastAccountedGrossSalaryAed, 1500);
  assert.equal(c.lastAccountedDays, 15);
}

// A vehicle is an explicit recurring access contract; no cash purchase asset
// or resale value is fabricated. Even a vehicle making no trips costs money.
{
  const ownerEngine = make();
  const nonownerEngine = make();
  const owner = ownerEngine.citizens.find((citizen) => citizen.enterpriseId);
  const nonowner = nonownerEngine.citizenById.get(owner.id);
  for (const c of [owner, nonowner]) {
    c.salaryAed = 20000;
    c.bankBalanceAed = 10000;
  }
  owner.hasCar = true;
  nonowner.hasCar = false;
  ownerEngine.step(31);
  nonownerEngine.step(31);
  assert.equal(owner.lastAccountedOwnershipCostAed, 700);
  assert.equal(nonowner.lastAccountedOwnershipCostAed, 0);
  assert.equal(nonowner.bankBalanceAed - owner.bankBalanceAed, 175);
  assert.equal(ownerEngine.serializeCitizen(owner).carAccessModel, "monthly-access");
}

// Support is an opening endowment. Higher rent does not create new resources.
{
  const e = make({ initialEmploymentRate: 0.5, laborForceParticipationRate: 0.7 });
  const c = e.citizenById.get([...e.nonParticipantIds][0]);
  const home = e.zoneById.get(c.homeZoneId);
  const support = e.citizenNonLaborSupportAed(c);
  const disposable = e.citizenCurrentDisposableIncomeAed(c);
  home.residentialRentAed += 1000;
  assert.equal(e.citizenNonLaborSupportAed(c), support);
  assert.equal(e.citizenCurrentDisposableIncomeAed(c), disposable - 1000);
  const fixed = make({ initialEmploymentRate: 0.5, laborForceParticipationRate: 0.7, nonParticipantMonthlySupportAed: 7000 });
  const supplied = fixed.citizenById.get([...fixed.nonParticipantIds][0]);
  assert.equal(fixed.citizenNonLaborSupportAed(supplied), 7000);
}

// The behavioral guard uses the same after-essentials resource boundary.
{
  const e = make();
  const c = e.citizens.find((citizen) => citizen.enterpriseId);
  c.salaryAed = e.zoneById.get(c.homeZoneId).residentialRentAed + 2000;
  c.hasCar = false;
  c.bankBalanceAed = 100000;
  c.expectedDailyTransportCostAed = 0;
  c.roundTripMinutes = 0;
  assert.equal(e.citizenCurrentDisposableIncomeAed(c), -500);
  assert.equal(e.citizenIsNormal(c), false);
  e.step(31);
  assert.equal(e.citizenFinancialAccount(c).residualAfterEssentialsAed, -500);
}

// Expected and sampled same-zone travel share one probability distribution.
{
  const e = make({ carFuelAndRunningCostAedPerKm: 0.35 });
  const c = e.citizens.find((citizen) => citizen.enterpriseId && citizen.homeZoneId === citizen.workZoneId);
  assert.ok(c);
  c.hasCar = true;
  const options = e.sameZoneCommuteOptions(c);
  const expectedMinutes = options.reduce((sum, option) => sum + option.minutes * option.probability, 0);
  const expectedCash = options.reduce((sum, option) => sum + option.cashAed * option.probability, 0);
  const costs = e.residentialOptionCosts(c, e.zoneById.get(c.homeZoneId));
  assert.equal(costs.roundTripMinutes, expectedMinutes);
  assert.equal(costs.cashMonthlyCostAed, e.zoneById.get(c.homeZoneId).residentialRentAed + 700 + 22 * expectedCash);
  let sampledMinutes = 0;
  let sampledCash = 0;
  for (let i = 0; i < 20000; i++) {
    e.applySameZoneCommute(c);
    sampledMinutes += c.roundTripMinutes;
    sampledCash += c.dailyTransportCostAed;
  }
  assert.ok(Math.abs(sampledMinutes / 20000 - expectedMinutes) < 0.15);
  assert.ok(Math.abs(sampledCash / 20000 - expectedCash) < 0.15);
  e.configure({ ptAverageSpeedKmh: 45, ptAverageWaitMin: 2, ptFareOneWayAed: 1 });
  const improved = e.sameZoneCommuteOptions(c);
  assert.ok(improved.find((option) => option.mode === "pt").probability > options.find((option) => option.mode === "pt").probability);
  assert.ok(e.residentialOptionCosts(c, e.zoneById.get(c.homeZoneId)).roundTripMinutes < expectedMinutes);
}

// A due vehicle-access review is independent of the commute-stress state.
// Use slow local non-car service to make the proposed access genuinely useful;
// retain the production access fee, savings reserve and affordability gates.
for (const state of ["Waiting", "Extreme", "Recovery"]) {
  const e = make({ localWalkCommuteMin: 160, localPtCommuteMin: 180 });
  const c = e.citizens.find((citizen) => citizen.enterpriseId && citizen.homeZoneId === citizen.workZoneId);
  assert.ok(c);
  c.hasCar = false;
  c.salaryAed = 50000;
  c.bankBalanceAed = 100000;
  c.state = state;
  c.stateDecisionDay = e.day + 100;
  c.daysDissatisfied = e.config.commuteExtremeGraceDays;
  e.applySameZoneCommute(c);
  assert.equal(e.citizenIsNormal(c), false, "the resident has a stressful commute before considering access");
  assert.ok(e.evaluateCarAcquisition(c).probability > 0.99, "the actual proposed access is affordable and beneficial");
  e.carOwnershipRng.next = () => 0;
  c.nextCarConsiderationDay = e.day + 1;
  assert.equal(e.citizenDecisionExplanation(c).nextScheduledReview.purpose, "vehicle access review");
  e.updateCitizenStates();
  assert.equal(c.hasCar, false, "a useful option still waits for its scheduled review");
  c.nextCarConsiderationDay = e.day;
  const previousAcquisitions = e.eventsTotal.carAcquisitions;
  e.updateCitizenStates();
  assert.equal(c.hasCar, true, `${state} does not suppress a due beneficial access decision`);
  assert.equal(e.eventsTotal.carAcquisitions, previousAcquisitions + 1);
  assert.ok(c.nextCarConsiderationDay >= e.day + e.config.carConsiderationMinDays);
}

// Removing the state restriction does not remove any economic gate.
for (const blockedBy of ["income", "savings", "service"]) {
  const e = make({ localWalkCommuteMin: 160, localPtCommuteMin: 180, ...(blockedBy === "service" ? { localCarCommuteMin: 400 } : {}) });
  const c = e.citizens.find((citizen) => citizen.enterpriseId && citizen.homeZoneId === citizen.workZoneId);
  c.hasCar = false;
  c.salaryAed = blockedBy === "income" ? e.zoneById.get(c.homeZoneId).residentialRentAed + 4000 : 50000;
  c.bankBalanceAed = blockedBy === "savings" ? e.config.carAcquisitionMinimumSavingsAed - 1 : 100000;
  c.state = "Extreme";
  c.stateDecisionDay = e.day + 100;
  c.daysDissatisfied = e.config.commuteExtremeGraceDays;
  c.nextCarConsiderationDay = e.day;
  e.applySameZoneCommute(c);
  assert.equal(e.evaluateCarAcquisition(c).probability, 0, `${blockedBy} prevents acquisition`);
  e.carOwnershipRng.next = () => 0;
  e.updateCitizenStates();
  assert.equal(c.hasCar, false, `even the most favorable draw cannot bypass the ${blockedBy} gate`);
  assert.ok(c.nextCarConsiderationDay > e.day, "a failed review preserves the review interval");
}

// A financial disposal postpones reacquisition, including on a due-review day.
{
  const e = make({ localWalkCommuteMin: 160, localPtCommuteMin: 180 });
  const c = e.citizens.find((citizen) => citizen.enterpriseId);
  c.hasCar = true;
  c.salaryAed = 0;
  c.bankBalanceAed = -1;
  c.state = "Happy";
  c.nextCarConsiderationDay = e.day;
  e.updateCitizenStates();
  assert.equal(c.hasCar, false);
  assert.ok(c.nextCarConsiderationDay >= e.day + e.config.carConsiderationMinDays, "disposal sets a new review delay before the independent review");
  c.salaryAed = 50000;
  c.bankBalanceAed = 100000;
  e.carOwnershipRng.next = () => 0;
  e.updateCitizenStates();
  assert.equal(c.hasCar, false, "recovered finances cannot reverse disposal before the next review");
}

// Opening employment is not a ceiling. More space alone is not funded demand.
{
  const e = make({ initialEmploymentRate: 0.5, laborForceParticipationRate: 0.8 });
  const opening = e.employedCitizenAgentCount();
  const c = e.citizenById.get([...e.jobSeekerIds][0]);
  const firm = e.enterprises.find((candidate) => candidate.employeeIds.size < candidate.maxJobSlots);
  assert.equal(e.openVacancySlots(firm), 0);
  assert.equal(e.employ(c, firm, 8000), false, "unfunded physical capacity is not a vacancy");
  firm.desiredJobSlots = Math.min(firm.maxJobSlots, firm.employeeIds.size + 1);
  assert.ok(e.employ(c, firm, 8000));
  assert.equal(e.employedCitizenAgentCount(), opening + 1);
  e.configure({ targetEmploymentRate: 0.95 });
  e.ensureLaborForceParticipationForTargets();
  assert.equal(e.citizens.length - e.nonParticipantIds.size, 32, "changing obsolete employment target does not create labor supply");
  e.configure({ enterpriseDemandMultiplier: 0 });
  e.updateEnterpriseEconomics();
  assert.equal(
    e.enterprises.reduce((sum, candidate) => sum + e.openVacancySlots(candidate), 0),
    0
  );
  e.configure({ dailyJobSeparationProbability: 1 });
  e.updateEnterprisesDaily();
  assert.equal(e.employedCitizenAgentCount(), 0, "there is no protected minimum employment rate");
  assert.ok(e.eventsTotal.laborSeparations > 0);
  assert.deepEqual(e.validateInvariants(), []);
}

// The explicit matching throughput applies to successful hires, not search draws.
{
  const e = make({ initialEmploymentRate: 0, dailyJobSearchProbability: 0.5, maxDailyLaborMatches: 1 });
  for (const firm of e.enterprises) firm.desiredJobSlots = firm.maxJobSlots;
  let draws = 0;
  e.laborMatchingRng.next = () => (++draws === 1 ? 0.9 : 0.1);
  e.matchUnemployedCitizens();
  assert.equal(e.employedCitizenAgentCount(), 1, "a seeker who does not search does not consume the successful-matches cap");
  assert.equal(draws, 2, "the daily search probability applies to subsequent seekers until one match succeeds");
}

// An unprofitable minimum-size employer can exit even when city capacity is low.
{
  const e = make();
  const firm = e.enterprises[0];
  while (firm.employeeIds.size > e.config.firmMinimumJobSlots) e.detachEmployment(e.citizenById.get([...firm.employeeIds][0]), "fixture", false);
  firm.maxJobSlots = e.config.firmMinimumJobSlots;
  firm.operatingMargin = -1;
  firm.consecutiveRestartLossMonths = e.config.enterpriseRestartLossMonths;
  e.enterEnterpriseLesser(firm);
  e.applyEnterpriseLesser(firm);
  assert.equal(firm.state, "Starting");
  assert.equal(firm.employeeIds.size, 0);
  assert.equal(e.openVacancySlots(firm), 0);
  assert.deepEqual(e.validateInvariants(), []);
}

// Stock reconciliation includes access lost when a resident cohort is replaced.
{
  const e = make();
  const c = e.citizens.find((citizen) => citizen.hasCar);
  assert.ok(c);
  e.replaceCitizen(c);
  const account = e.snapshot().city.carAccessAccounting;
  assert.equal(account.replacementExits, 1);
  assert.equal(account.reconciliationDifference, 0, "demographic access loss is distinct from financial disposal and reconciles the stock");
}

// Accessibility changes with network travel time, despite unchanged geography.
{
  const e = make({ ptAverageSpeedKmh: 1 });
  const [origin, destination] = e.zones;
  const before = e.zonePairLaborAccessMinutes(origin, destination, true);
  e.configure({ roadSpeedMultiplier: 0.5 });
  const after = e.zonePairLaborAccessMinutes(origin, destination, true);
  assert.ok(Number.isFinite(before) && after > before);
  e.computeZoneLaborAccessScores();
  assert.ok(e.zones.every((zone) => zone.laborAccessScore >= 0 && zone.laborAccessScore <= 1));
}

console.log("UDES v2 daily ledger, resources, mode consistency, labor closure and network-access mechanics passed.");
