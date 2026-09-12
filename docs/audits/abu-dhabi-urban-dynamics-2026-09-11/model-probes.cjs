// Read-only audit probes. They create disposable in-memory engines and do not
// change the application or its committed baseline/validation report.
const live = process.argv.includes('--live');
const { UdesV2Engine } = require(live ? './live-assets/udes-v2-worker.js' : '../../../assets/js/udes-v2-worker.js');
const { PUBLIC_PRESETS } = require(live ? './live-assets/udes-v2-app.js' : '../../../assets/js/udes-v2-app.js');
const baseline = require(live ? './live-assets/baseline.json' : '../../../assets/data/udes-v2/baseline.json');

const make = () => new UdesV2Engine({
  seed: 240124,
  config: { ...PUBLIC_PRESETS.reference, citizenCount: 420, enterpriseCount: 40, citizenWeight: 25 },
});
const output = { testedCode: live ? 'downloaded-deployed-worker-and-public-presets' : 'local-worker-and-public-presets' };

// A job seeker cannot take an existing vacancy once the calibrated target is met.
{
  const e = make();
  const seeker = e.citizenById.get([...e.jobSeekerIds][0]);
  const firm = e.findHiringEnterprise(seeker.homeZoneId);
  output.employmentTarget = {
    employed: e.employedCitizenAgentCount(),
    target: Math.round(e.citizens.length * e.config.targetEmploymentRate),
    activeJobSeekers: e.jobSeekerIds.size,
    openVacancySlots: e.enterprises.reduce((sum, x) => sum + e.openVacancySlots(x), 0),
    hireIntoVacancyAccepted: e.employ(seeker, firm, 8000),
  };
}

// Support compensates any housing cost automatically.
{
  const e = make();
  const citizen = e.citizenById.get([...e.nonParticipantIds][0]);
  output.support = [2000, 20000].map(rent => {
    const support = e.citizenNonLaborSupportAed(citizen, rent);
    return { rent, support, residualAfterEssentials: support - rent - e.config.monthlyEssentialConsumptionAed };
  });
}

// Ownership-only cost is used for a decision but never charged at month close.
{
  const e = make();
  const owners = e.citizens.filter(x => x.enterpriseId).slice(0, 2);
  const zone = e.zoneById.get(owners[0].homeZoneId);
  for (const citizen of owners) {
    citizen.homeZoneId = zone.id;
    citizen.salaryAed = 10000;
    citizen.currentMonthTransportCostAed = 0;
    citizen.bankBalanceAed = 10000;
  }
  owners[0].hasCar = true;
  owners[1].hasCar = false;
  e.closeMonth();
  output.ownershipCost = {
    configuredFixedMonthlyCost: e.config.carAcquisitionFixedMonthlyCostAed,
    ownerBankDelta: owners[0].lastMonthlyBankBalanceDeltaAed,
    nonownerBankDelta: owners[1].lastMonthlyBankBalanceDeltaAed,
  };
}

// Month-close salary is the final salary, regardless of days worked.
{
  const e = make();
  const citizen = e.citizens.find(x => x.enterpriseId);
  citizen.salaryAed = 31000;
  citizen.currentMonthTransportCostAed = 0;
  e.clock = { ...e.clock, date: '2026-01-31', month: 1 };
  e.detachEmployment(citizen, 'audit-end-of-month-separation', false);
  e.closeMonth();
  output.monthClose = { lastDaySeparatedSalaryAccounted: citizen.lastAccountedGrossSalaryAed };
}

// Financial reporting identifies a deficit while behavioral guards call it normal.
{
  const e = make();
  const citizen = e.citizens.find(x => x.enterpriseId);
  citizen.netIncomeAed = 2000;
  citizen.bankBalanceAed = 10000;
  citizen.roundTripMinutes = 20;
  citizen.mode = 'car';
  output.financialGuard = {
    cashAfterHousingAndCommute: citizen.netIncomeAed,
    residualAfterEssentials: e.citizenFinancialAccount(citizen).residualAfterEssentialsAed,
    financialStatus: e.citizenFinancialAccount(citizen).status,
    behaviorCallsNormal: e.citizenIsNormal(citizen),
  };
}

// Same-zone residence comparisons assume a 16-minute walk even for agents whose
// actual same-zone travel follows a random car/walk/PT distribution.
{
  const e = make();
  const citizen = e.citizens.find(x => x.enterpriseId && x.homeZoneId === x.workZoneId);
  citizen.hasCar = true;
  const predicted = e.residentialOptionCosts(citizen, e.zoneById.get(citizen.homeZoneId));
  const modes = { car: 0, pt: 0, walk: 0 };
  let totalMinutes = 0;
  for (let i = 0; i < 10000; i++) {
    e.applySameZoneCommute(citizen);
    modes[citizen.mode]++;
    totalMinutes += citizen.roundTripMinutes;
  }
  output.sameZone = { predictedRoundTripMinutes: predicted.roundTripMinutes, realizedMeanMinutes: totalMinutes / 10000, modes };
}

// Read the existing published validation evidence without changing it.
const validation = require('../../../assets/data/udes-v2/validation-report.json');
output.committedValidation = {
  status: validation.status,
  generatedAt: validation.generatedAt,
  checks: validation.checkSummary,
  scenarios: validation.scenarios.map(s => ({
    id: s.id,
    employedShare: s.metrics.employmentRatePercent,
    unemploymentRate: s.metrics.unemploymentRatePercent,
  })),
};
output.baseline = { population: baseline.calibration.studyScopePopulation2024, recommendedWeight: baseline.calibration.citizenAgentPersonsRecommended };
console.log(JSON.stringify(output, null, 2));
