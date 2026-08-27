import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { UdesV2Engine } = require("../assets/js/udes-v2-worker.js");
const { PUBLIC_PRESETS, horizonEndDayFrom } = require("../assets/js/udes-v2-app.js");
const baseline = require("../assets/data/udes-v2/baseline.json");

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const OUTPUT_PATH = path.join(ROOT, "assets", "data", "udes-v2", "validation-report.json");
const SOURCE_PATHS = {
  engineSha256: path.join(ROOT, "assets", "js", "udes-v2-worker.js"),
  baselineSha256: path.join(ROOT, "assets", "data", "udes-v2", "baseline.json"),
  publicControllerSha256: path.join(ROOT, "assets", "js", "udes-v2-app.js"),
  validationHarnessSha256: fileURLToPath(import.meta.url),
};
const SEED = 240124;

const baselineData = {
  schemaVersion: baseline.schemaVersion,
  zones: baseline.zones,
  links: baseline.roadGraph.edges,
  nodes: baseline.roadGraph.nodes,
  transit: baseline.transit,
  calibration: baseline.calibration,
  assumptions: baseline.assumptions,
};

const commonConfig = {
  startDate: "2024-01-01",
  calibrationLabel: "Illustrative Greater Abu Dhabi City scenario baseline — not a forecast",
  endogenousEnterpriseDynamics: true,
};

const { reference: referencePreset, transit: transitPreset, housing: housingPreset, balanced: balancedPreset } = PUBLIC_PRESETS;
const START_DATE = new Date(`${commonConfig.startDate}T00:00:00Z`);
const ONE_CALENDAR_YEAR_DAYS = horizonEndDayFrom(START_DATE, 12);
const TEN_CALENDAR_YEAR_DAYS = horizonEndDayFrom(START_DATE, 120);

const runDefinitions = [
  { id: "reference-1y", label: "Reference · exact 12 calendar months", days: ONE_CALENDAR_YEAR_DAYS, preset: referencePreset },
  { id: "transit-1y", label: "Transit first · exact 12 calendar months", days: ONE_CALENDAR_YEAR_DAYS, preset: transitPreset },
  { id: "reference-10y", label: "Reference · exact 10 calendar years", days: TEN_CALENDAR_YEAR_DAYS, preset: referencePreset },
  { id: "transit-10y", label: "Transit first · exact 10 calendar years", days: TEN_CALENDAR_YEAR_DAYS, preset: transitPreset },
  { id: "housing-10y", label: "Connected housing · exact 10 calendar years", days: TEN_CALENDAR_YEAR_DAYS, preset: housingPreset },
  { id: "balanced-10y", label: "Balanced growth · exact 10 calendar years", days: TEN_CALENDAR_YEAR_DAYS, preset: balancedPreset },
];

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function percentile(values, proportion) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(proportion * sorted.length) - 1));
  return sorted[index];
}

function digest(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function fileDigest(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function enterprisePortfolio(engine) {
  const active = engine.enterprises.filter((enterprise) => enterprise.employeeIds.size > 0 && enterprise.monthlyRevenueAed > 0);
  const margins = active.map((enterprise) => enterprise.operatingMargin * 100);
  const lossMaking = active.filter((enterprise) => enterprise.operatingMargin < 0);
  const restartMarginThresholdPercent = engine.config.enterpriseRestartMarginThreshold * 100;
  const severelyDistressed = active.filter((enterprise) => enterprise.operatingMargin <= engine.config.enterpriseRestartMarginThreshold);
  const revenue = sum(active.map((enterprise) => enterprise.monthlyRevenueAed));
  const cost = sum(active.map((enterprise) => enterprise.operatingCostAed));
  return {
    firmAgents: engine.enterprises.length,
    activeFirms: active.length,
    inactiveFirms: engine.enterprises.length - active.length,
    lossMakingFirms: lossMaking.length,
    lossMakingSharePercent: round((lossMaking.length / Math.max(active.length, 1)) * 100),
    restartMarginThresholdPercent: round(restartMarginThresholdPercent),
    severelyDistressedFirms: severelyDistressed.length,
    severelyDistressedSharePercent: round((severelyDistressed.length / Math.max(active.length, 1)) * 100),
    meanOperatingMarginPercent: round(sum(margins) / Math.max(margins.length, 1)),
    medianOperatingMarginPercent: round(percentile(margins, 0.5)),
    p10OperatingMarginPercent: round(percentile(margins, 0.1)),
    p90OperatingMarginPercent: round(percentile(margins, 0.9)),
    revenueWeightedOperatingMarginPercent: round(((revenue - cost) / Math.max(revenue, 1)) * 100),
    monthlyRevenueAed: round(revenue, 0),
    monthlyOperatingCostAed: round(cost, 0),
    representedEmployees: sum(active.map((enterprise) => enterprise.employeeIds.size * engine.config.citizenWeight)),
    states: Object.fromEntries(
      [...new Set(engine.enterprises.map((enterprise) => enterprise.state))]
        .sort()
        .map((state) => [state, engine.enterprises.filter((enterprise) => enterprise.state === state).length])
    ),
  };
}

function networkMetrics(snapshot) {
  const roadRatios = snapshot.links.flatMap((link) => [link.volumeCapacityAB, link.volumeCapacityBA]);
  const transitRatios = snapshot.links.flatMap((link) => [link.ptLoadFactorAB, link.ptLoadFactorBA]);
  return {
    corridorCount: snapshot.links.length,
    meanRoadVolumeCapacityRatio: round(sum(roadRatios) / Math.max(roadRatios.length, 1), 4),
    maximumRoadVolumeCapacityRatio: round(Math.max(...roadRatios), 4),
    meanTransitLoadFactor: round(sum(transitRatios) / Math.max(transitRatios.length, 1), 4),
    maximumTransitLoadFactor: round(Math.max(...transitRatios), 4),
  };
}

function scenarioMetrics(engine, snapshot) {
  const { city } = snapshot;
  return {
    representedPopulation: city.representedPopulation,
    representedEmployed: city.representedEmployed,
    employmentRatePercent: city.employmentRate,
    unemploymentRatePercent: city.unemploymentRate,
    modeCountsRepresented: city.modeCounts,
    modeSharesPercent: city.modeShares,
    carOwnershipRatePercent: city.carOwnershipRate,
    citizenStateSharesPercent: city.stateShares,
    averageRoundTripMinutes: city.averageRoundTripMinutes,
    averageNetIncomeAedPerMonth: city.averageNetIncomeAed,
    averageBankBalanceAed: city.averageBankBalanceAed,
    averageMonthlySavingOrDrawdownAed: city.averageMonthlyBankBalanceDeltaAed,
    savingsPolicy: city.savingsPolicy,
    meanHousingRentAedPerMonth: city.meanHousingRentAed,
    averageRoadCapacityUsagePercent: city.averageRoadCapacityUsage,
    sameZoneWorkSharePercent: city.sameZoneWorkShare,
    housingOccupancyRatePercent: city.housingOccupancyRate,
    housingOvercapacityRepresented: city.housingOvercapacityRepresented,
    dailyCarVehicleKm: city.dailyCarKm,
    forcedInterzoneWalkers: city.forcedInterzoneWalkers,
    unservedCommuters: city.unservedCommuters,
    capacityOverflowTrips: city.capacityOverflowTrips,
    networkAssignmentDate: city.networkAssignmentDate,
    completedMonthRepresentedEvents: {
      hires: city.monthlyHiresRepresented,
      fires: city.monthlyFiresRepresented,
      residentialMoves: city.monthlyMovesRepresented,
    },
    cumulativeEvents: city.eventsTotal,
    cumulativeRepresentedCitizenEvents: city.representedCitizenEventsTotal,
    distributions: city.distributions,
    network: networkMetrics(snapshot),
    enterprisePortfolio: enterprisePortfolio(engine),
  };
}

function scenarioChecks(engine, snapshot, metrics) {
  const finiteValues = [
    metrics.employmentRatePercent,
    ...Object.values(metrics.modeSharesPercent),
    ...Object.values(metrics.citizenStateSharesPercent),
    metrics.averageRoundTripMinutes,
    metrics.averageNetIncomeAedPerMonth,
    metrics.averageBankBalanceAed,
    metrics.averageMonthlySavingOrDrawdownAed,
    metrics.carOwnershipRatePercent,
    metrics.meanHousingRentAedPerMonth,
    metrics.enterprisePortfolio.revenueWeightedOperatingMarginPercent,
  ];
  const modeTotal = sum(Object.values(metrics.modeSharesPercent));
  const stateTotal = sum(Object.values(metrics.citizenStateSharesPercent));
  const expectedPopulation = engine.citizens.length * engine.config.citizenWeight;
  const completedCommuters = sum(["car", "pt", "walk"].map((mode) => Number(metrics.modeCountsRepresented?.[mode]) || 0));
  return [
    {
      id: "no-invariant-violations",
      passed: engine.validateInvariants().length === 0,
      detail: `${engine.validateInvariants().length} invariant issue(s)`,
    },
    {
      id: "finite-summary-metrics",
      passed: finiteValues.every(Number.isFinite),
      detail: `${finiteValues.filter((value) => !Number.isFinite(value)).length} non-finite summary metric(s)`,
    },
    {
      id: "population-conserved",
      passed: metrics.representedPopulation === expectedPopulation,
      detail: `${metrics.representedPopulation} represented residents; expected ${expectedPopulation}`,
    },
    {
      id: "income-distribution-conserves-population",
      passed: metrics.distributions.income.representedTotal === metrics.representedPopulation,
      detail: `${metrics.distributions.income.representedTotal} represented residents across income bins`,
    },
    {
      id: "household-savings-policy-is-explicit",
      passed:
        metrics.savingsPolicy?.monthlyEssentialConsumptionAed === engine.config.monthlyEssentialConsumptionAed &&
        metrics.savingsPolicy?.positiveResidualSavingsRate === engine.config.positiveResidualSavingsRate &&
        metrics.savingsPolicy?.negativeResidualDrawdownRate === 1,
      detail: `AED ${metrics.savingsPolicy?.monthlyEssentialConsumptionAed} essentials; ${round(
        (metrics.savingsPolicy?.positiveResidualSavingsRate || 0) * 100,
        2
      )}% positive-residual saving; full deficit drawdown`,
    },
    {
      id: "household-finance-remains-numerically-bounded",
      passed: Math.abs(metrics.averageBankBalanceAed) <= 1_000_000 && Math.abs(metrics.averageMonthlySavingOrDrawdownAed) <= 20_000,
      detail: `AED ${metrics.averageBankBalanceAed} mean stock; AED ${metrics.averageMonthlySavingOrDrawdownAed}/month mean change`,
    },
    {
      id: "commute-distribution-conserves-completed-commuters",
      passed: metrics.distributions.commute.representedTotal === completedCommuters,
      detail: `${metrics.distributions.commute.representedTotal}/${completedCommuters} represented completed commuters across commute bins/modes`,
    },
    {
      id: "enterprise-distribution-covers-all-firms",
      passed: metrics.distributions.firmSize.enterpriseTotal === engine.enterprises.length,
      detail: `${metrics.distributions.firmSize.enterpriseTotal}/${engine.enterprises.length} enterprise agents across size bins`,
    },
    {
      id: "mode-shares-close",
      passed: Math.abs(modeTotal - 100) <= 0.05,
      detail: `${round(modeTotal, 4)}% total`,
    },
    {
      id: "citizen-state-shares-close",
      passed: Math.abs(stateTotal - 100) <= 0.05,
      detail: `${round(stateTotal, 4)}% total`,
    },
    {
      id: "employment-stock-near-calibrated-target",
      passed: Math.abs(metrics.employmentRatePercent - engine.config.targetEmploymentRate * 100) <= 1,
      detail: `${metrics.employmentRatePercent}% versus ${engine.config.targetEmploymentRate * 100}% target`,
    },
    {
      id: "no-forced-interzone-walking",
      passed: metrics.forcedInterzoneWalkers === 0,
      detail: `${metrics.forcedInterzoneWalkers} represented forced walkers`,
    },
    {
      id: "no-unserved-commuters",
      passed: metrics.unservedCommuters === 0,
      detail: `${metrics.unservedCommuters} represented unserved commuters`,
    },
    {
      id: "capacity-overflow-below-five-percent",
      passed: metrics.capacityOverflowTrips / Math.max(metrics.representedEmployed, 1) <= 0.05,
      detail: `${round((metrics.capacityOverflowTrips / Math.max(metrics.representedEmployed, 1)) * 100, 3)}% of represented employed agents`,
    },
    {
      id: "commute-time-in-plausibility-band",
      passed: metrics.averageRoundTripMinutes >= 5 && metrics.averageRoundTripMinutes <= 120,
      detail: `${metrics.averageRoundTripMinutes} minutes average round trip`,
    },
    {
      id: "extreme-state-below-forty-percent",
      passed: metrics.citizenStateSharesPercent.Extreme < 40,
      detail: `${metrics.citizenStateSharesPercent.Extreme}% of represented citizens`,
    },
    {
      id: "active-enterprise-portfolio",
      passed: metrics.enterprisePortfolio.activeFirms >= engine.enterprises.length * 0.9,
      detail: `${metrics.enterprisePortfolio.activeFirms}/${engine.enterprises.length} firm agents active`,
    },
    {
      id: "finite-enterprise-portfolio",
      passed:
        Number.isFinite(metrics.enterprisePortfolio.revenueWeightedOperatingMarginPercent) &&
        Number.isFinite(metrics.enterprisePortfolio.lossMakingSharePercent) &&
        Number.isFinite(metrics.enterprisePortfolio.medianOperatingMarginPercent) &&
        Number.isFinite(metrics.enterprisePortfolio.severelyDistressedSharePercent),
      detail: `${metrics.enterprisePortfolio.revenueWeightedOperatingMarginPercent}% revenue-weighted margin`,
    },
    {
      id: "enterprise-margin-in-plausibility-band",
      passed:
        metrics.enterprisePortfolio.revenueWeightedOperatingMarginPercent >= -10 &&
        metrics.enterprisePortfolio.revenueWeightedOperatingMarginPercent <= 40,
      detail: `${metrics.enterprisePortfolio.revenueWeightedOperatingMarginPercent}% revenue-weighted operating margin`,
    },
    {
      id: "loss-making-firms-broad-distribution-guard",
      passed: metrics.enterprisePortfolio.lossMakingSharePercent < 60,
      detail: `${metrics.enterprisePortfolio.lossMakingSharePercent}% of active firm agents below break-even; broad guard <60%`,
    },
    {
      id: "enterprise-median-margin-broad-plausibility-guard",
      passed: metrics.enterprisePortfolio.medianOperatingMarginPercent > -5,
      detail: `${metrics.enterprisePortfolio.medianOperatingMarginPercent}% median operating margin; broad guard >-5%`,
    },
    {
      id: "enterprise-severe-distress-below-ten-percent",
      passed: metrics.enterprisePortfolio.severelyDistressedSharePercent < 10,
      detail: `${metrics.enterprisePortfolio.severelyDistressedSharePercent}% of active firm agents at or below the configured ${metrics.enterprisePortfolio.restartMarginThresholdPercent}% restart threshold`,
    },
  ];
}

function runScenario(definition) {
  process.stdout.write(`Running ${definition.label} (${definition.days} days)...\n`);
  const suppliedConfig = { ...commonConfig, ...definition.preset };
  const engine = new UdesV2Engine({ data: baselineData, config: suppliedConfig, seed: SEED });
  const chunkDays = 30;
  for (let completed = 0; completed < definition.days; completed += chunkDays) {
    engine.step(Math.min(chunkDays, definition.days - completed));
  }
  const snapshot = engine.snapshot({ historyLimit: 0 });
  const metrics = scenarioMetrics(engine, snapshot);
  const invariantIssues = engine.validateInvariants();
  const checks = scenarioChecks(engine, snapshot, metrics);
  const deterministicResult = {
    clock: snapshot.clock,
    metrics,
    invariantIssues,
  };
  return {
    id: definition.id,
    label: definition.label,
    seed: SEED,
    requestedDays: definition.days,
    clock: snapshot.clock,
    config: suppliedConfig,
    resolvedScope: {
      citizenAgents: engine.citizens.length,
      enterpriseAgents: engine.enterprises.length,
      citizenWeightPersons: engine.config.citizenWeight,
      representedPopulation: snapshot.city.representedPopulation,
      zones: engine.zones.length,
      roadGraphEdges: engine.links.length,
    },
    resolvedValidationParameters: {
      enterpriseRestartMarginThresholdPercent: round(engine.config.enterpriseRestartMarginThreshold * 100),
      enterpriseRestartLossMonths: engine.config.enterpriseRestartLossMonths,
      targetEmploymentRatePercent: round(engine.config.targetEmploymentRate * 100),
    },
    metrics,
    invariants: {
      status: invariantIssues.length ? "failed" : "passed",
      issueCount: invariantIssues.length,
      issues: invariantIssues,
    },
    checks,
    status: checks.every((check) => check.passed) ? "passed" : "failed",
    resultDigestSha256: digest(deterministicResult),
  };
}

const scenarios = runDefinitions.map(runScenario);
const oneYearReference = scenarios.find((scenario) => scenario.id === "reference-1y");
const oneYearTransit = scenarios.find((scenario) => scenario.id === "transit-1y");
const tenYearReference = scenarios.find((scenario) => scenario.id === "reference-10y");
const tenYearTransit = scenarios.find((scenario) => scenario.id === "transit-10y");
const tenYearHousing = scenarios.find((scenario) => scenario.id === "housing-10y");
const tenYearBalanced = scenarios.find((scenario) => scenario.id === "balanced-10y");

const crossScenarioChecks = [
  {
    id: "one-year-reference-reaches-exact-calendar-date",
    passed: oneYearReference.clock.date === "2025-01-01",
    detail: `${oneYearReference.clock.date} after ${ONE_CALENDAR_YEAR_DAYS} simulated days`,
  },
  {
    id: "one-year-transit-reaches-exact-calendar-date",
    passed: oneYearTransit.clock.date === "2025-01-01",
    detail: `${oneYearTransit.clock.date} after ${ONE_CALENDAR_YEAR_DAYS} simulated days`,
  },
  {
    id: "transit-preset-reduces-car-share",
    passed: oneYearTransit.metrics.modeSharesPercent.car < oneYearReference.metrics.modeSharesPercent.car,
    detail: `${oneYearReference.metrics.modeSharesPercent.car}% reference → ${oneYearTransit.metrics.modeSharesPercent.car}% transit`,
  },
  {
    id: "transit-preset-increases-public-transport-share",
    passed: oneYearTransit.metrics.modeSharesPercent.pt > oneYearReference.metrics.modeSharesPercent.pt,
    detail: `${oneYearReference.metrics.modeSharesPercent.pt}% reference → ${oneYearTransit.metrics.modeSharesPercent.pt}% transit`,
  },
  {
    id: "transit-preset-reduces-average-commute-time",
    passed: oneYearTransit.metrics.averageRoundTripMinutes < oneYearReference.metrics.averageRoundTripMinutes,
    detail: `${oneYearReference.metrics.averageRoundTripMinutes} minutes reference → ${oneYearTransit.metrics.averageRoundTripMinutes} minutes transit`,
  },
  {
    id: "transit-preset-reduces-average-road-capacity-use",
    passed: oneYearTransit.metrics.averageRoadCapacityUsagePercent < oneYearReference.metrics.averageRoadCapacityUsagePercent,
    detail: `${oneYearReference.metrics.averageRoadCapacityUsagePercent}% reference → ${oneYearTransit.metrics.averageRoadCapacityUsagePercent}% transit`,
  },
  {
    id: "ten-year-reference-preserves-population",
    passed: tenYearReference.metrics.representedPopulation === oneYearReference.metrics.representedPopulation,
    detail: `${oneYearReference.metrics.representedPopulation} after one year; ${tenYearReference.metrics.representedPopulation} after ten years`,
  },
  {
    id: "ten-year-reference-enterprise-margin-remains-finite",
    passed: Number.isFinite(tenYearReference.metrics.enterprisePortfolio.revenueWeightedOperatingMarginPercent),
    detail: `${tenYearReference.metrics.enterprisePortfolio.revenueWeightedOperatingMarginPercent}% revenue-weighted operating margin`,
  },
  {
    id: "ten-year-reference-reaches-exact-calendar-date",
    passed: tenYearReference.clock.date === "2034-01-01",
    detail: `${tenYearReference.clock.date} after 3,653 simulated days`,
  },
  ...[tenYearTransit, tenYearHousing, tenYearBalanced].map((scenario) => ({
    id: `${scenario.id}-reaches-exact-calendar-date`,
    passed: scenario.clock.date === "2034-01-01",
    detail: `${scenario.clock.date} after ${TEN_CALENDAR_YEAR_DAYS.toLocaleString("en")} simulated days`,
  })),
  {
    id: "ten-year-transit-reduces-car-share",
    passed: tenYearTransit.metrics.modeSharesPercent.car < tenYearReference.metrics.modeSharesPercent.car,
    detail: `${tenYearReference.metrics.modeSharesPercent.car}% reference → ${tenYearTransit.metrics.modeSharesPercent.car}% transit`,
  },
  {
    id: "ten-year-transit-increases-public-transport-share",
    passed: tenYearTransit.metrics.modeSharesPercent.pt > tenYearReference.metrics.modeSharesPercent.pt,
    detail: `${tenYearReference.metrics.modeSharesPercent.pt}% reference → ${tenYearTransit.metrics.modeSharesPercent.pt}% transit`,
  },
  {
    id: "ten-year-transit-reduces-car-ownership",
    passed: tenYearTransit.metrics.carOwnershipRatePercent < tenYearReference.metrics.carOwnershipRatePercent,
    detail: `${tenYearReference.metrics.carOwnershipRatePercent}% reference → ${tenYearTransit.metrics.carOwnershipRatePercent}% transit`,
  },
  {
    id: "ten-year-transit-reduces-average-commute",
    passed: tenYearTransit.metrics.averageRoundTripMinutes < tenYearReference.metrics.averageRoundTripMinutes,
    detail: `${tenYearReference.metrics.averageRoundTripMinutes} minutes reference → ${tenYearTransit.metrics.averageRoundTripMinutes} minutes transit`,
  },
  {
    id: "ten-year-transit-reduces-car-acquisitions",
    passed: tenYearTransit.metrics.cumulativeEvents.carAcquisitions < tenYearReference.metrics.cumulativeEvents.carAcquisitions,
    detail: `${tenYearReference.metrics.cumulativeEvents.carAcquisitions} reference → ${tenYearTransit.metrics.cumulativeEvents.carAcquisitions} transit agent acquisitions`,
  },
  {
    id: "ten-year-housing-reduces-occupancy-pressure",
    passed: tenYearHousing.metrics.housingOccupancyRatePercent < tenYearReference.metrics.housingOccupancyRatePercent,
    detail: `${tenYearReference.metrics.housingOccupancyRatePercent}% reference → ${tenYearHousing.metrics.housingOccupancyRatePercent}% housing`,
  },
  {
    id: "ten-year-housing-does-not-increase-overcapacity",
    passed: tenYearHousing.metrics.housingOvercapacityRepresented <= tenYearReference.metrics.housingOvercapacityRepresented,
    detail: `${tenYearReference.metrics.housingOvercapacityRepresented} reference → ${tenYearHousing.metrics.housingOvercapacityRepresented} housing represented residents`,
  },
  {
    id: "ten-year-housing-does-not-materially-reduce-satisfaction",
    passed: tenYearHousing.metrics.citizenStateSharesPercent.Happy >= tenYearReference.metrics.citizenStateSharesPercent.Happy - 3,
    detail: `${tenYearReference.metrics.citizenStateSharesPercent.Happy}% reference → ${tenYearHousing.metrics.citizenStateSharesPercent.Happy}% housing happy`,
  },
  {
    id: "ten-year-housing-does-not-materially-worsen-commute",
    passed: tenYearHousing.metrics.averageRoundTripMinutes <= tenYearReference.metrics.averageRoundTripMinutes + 5,
    detail: `${tenYearReference.metrics.averageRoundTripMinutes} minutes reference → ${tenYearHousing.metrics.averageRoundTripMinutes} minutes housing`,
  },
  {
    id: "ten-year-balanced-reduces-car-share",
    passed: tenYearBalanced.metrics.modeSharesPercent.car < tenYearReference.metrics.modeSharesPercent.car,
    detail: `${tenYearReference.metrics.modeSharesPercent.car}% reference → ${tenYearBalanced.metrics.modeSharesPercent.car}% balanced`,
  },
  {
    id: "ten-year-balanced-increases-public-transport-share",
    passed: tenYearBalanced.metrics.modeSharesPercent.pt > tenYearReference.metrics.modeSharesPercent.pt,
    detail: `${tenYearReference.metrics.modeSharesPercent.pt}% reference → ${tenYearBalanced.metrics.modeSharesPercent.pt}% balanced`,
  },
  {
    id: "ten-year-balanced-reduces-average-commute",
    passed: tenYearBalanced.metrics.averageRoundTripMinutes <= tenYearReference.metrics.averageRoundTripMinutes,
    detail: `${tenYearReference.metrics.averageRoundTripMinutes} minutes reference → ${tenYearBalanced.metrics.averageRoundTripMinutes} minutes balanced`,
  },
  {
    id: "ten-year-balanced-reduces-housing-pressure",
    passed: tenYearBalanced.metrics.housingOccupancyRatePercent < tenYearReference.metrics.housingOccupancyRatePercent,
    detail: `${tenYearReference.metrics.housingOccupancyRatePercent}% reference → ${tenYearBalanced.metrics.housingOccupancyRatePercent}% balanced`,
  },
  {
    id: "ten-year-balanced-preserves-satisfaction",
    passed: tenYearBalanced.metrics.citizenStateSharesPercent.Happy >= tenYearReference.metrics.citizenStateSharesPercent.Happy - 3,
    detail: `${tenYearReference.metrics.citizenStateSharesPercent.Happy}% reference → ${tenYearBalanced.metrics.citizenStateSharesPercent.Happy}% balanced happy`,
  },
];

const allChecks = [...scenarios.flatMap((scenario) => scenario.checks), ...crossScenarioChecks];
const passed = allChecks.every((check) => check.passed);
const report = {
  schemaVersion: "1.3.1",
  generatedAt: new Date().toISOString(),
  model: "Abu Dhabi Urban Dynamics Lab / UDES v2",
  datasetSchemaVersion: baseline.schemaVersion,
  engineSchemaVersion: scenarios[0] ? require("../assets/js/udes-v2-worker.js").SCHEMA_VERSION : null,
  sourceHashes: Object.fromEntries(Object.entries(SOURCE_PATHS).map(([label, filePath]) => [label, fileDigest(filePath)])),
  seed: SEED,
  status: passed ? "passed-software-and-plausibility-checks" : "failed-one-or-more-software-or-plausibility-checks",
  validationScope: "Fixed-seed software integrity, conservation, numerical stability, and directional scenario plausibility.",
  caveat:
    "This is software and plausibility validation, not empirical forecast validation. District behavior, jobs, capacities, enterprise economics, and mode-choice parameters include synthetic assumptions. Policy use requires observed household travel, labor-market, housing, and firm microdata plus out-of-sample calibration.",
  methodology: {
    runs: [
      "Reference preset for exactly 12 calendar months (2024-01-01 through 2025-01-01)",
      "Transit-first preset for exactly 12 calendar months",
      "Reference preset for exactly 3,653 simulated days (2024-01-01 through 2034-01-01)",
      "Transit-first preset for exactly 3,653 simulated days",
      "Connected-housing preset for exactly 3,653 simulated days",
      "Balanced-growth preset for exactly 3,653 simulated days",
    ],
    determinism:
      "All full-scale runs use seed 240124. Result digests identify each result for future regression comparison; deterministic replay is exercised separately in the CI regression suite.",
    directionalRobustness:
      "The committed full-scale evidence is fixed-seed. The faster CI scenario suite separately checks long-run transit direction across multiple seeds as a variance guard; neither test is empirical forecast validation.",
    enterpriseEconomics:
      "Enterprise checks are broad snapshot plausibility guards, not empirical profitability calibration. They test active-firm coverage, aggregate and median margins, the loss-making distribution, and severe distress against the model's configured restart threshold.",
    enterpriseSnapshotGuards: {
      activeFirmShareMinimumPercent: 90,
      revenueWeightedMarginPercent: { minimum: -10, maximum: 40 },
      lossMakingShareMaximumExclusivePercent: 60,
      medianMarginMinimumExclusivePercent: -5,
      severeDistressShareMaximumExclusivePercent: 10,
      severeDistressDefinition: "Operating margin at or below the model's configured enterprise restart threshold.",
    },
    fullScale: "The engine derives 7,291 citizen agents at 250 represented persons each from the real baseline and uses 600 enterprise agents.",
  },
  sourceScope: {
    studyArea: baseline.scope.name,
    officialStudyScopePopulation2024: baseline.calibration.studyScopePopulation2024,
    modeledRepresentedPopulation: scenarios[0]?.resolvedScope.representedPopulation,
    citizenAgents: scenarios[0]?.resolvedScope.citizenAgents,
    citizenWeightPersons: scenarios[0]?.resolvedScope.citizenWeightPersons,
    enterpriseAgents: scenarios[0]?.resolvedScope.enterpriseAgents,
    zones: scenarios[0]?.resolvedScope.zones,
    roadGraphEdges: scenarios[0]?.resolvedScope.roadGraphEdges,
  },
  scenarios,
  crossScenarioChecks,
  checkSummary: {
    passed: allChecks.filter((check) => check.passed).length,
    failed: allChecks.filter((check) => !check.passed).length,
    total: allChecks.length,
  },
};

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
process.stdout.write(`Wrote ${path.relative(ROOT, OUTPUT_PATH)}\n`);
process.stdout.write(`Validation status: ${report.status} (${report.checkSummary.passed}/${report.checkSummary.total} checks passed)\n`);

if (!passed) process.exitCode = 1;
