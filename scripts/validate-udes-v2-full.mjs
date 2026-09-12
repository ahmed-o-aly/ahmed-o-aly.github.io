import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { summarizeEvidence } from "./udes-v2-evidence-summary.mjs";
import { controllerModelInputs, finalizeSourceProvenance } from "./udes-v2-source-provenance.mjs";

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
  evidenceSummarySha256: path.join(ROOT, "scripts", "udes-v2-evidence-summary.mjs"),
  sourceProvenanceSha256: path.join(ROOT, "scripts", "udes-v2-source-provenance.mjs"),
};
const SEED = 240124;
// These thresholds are model review prompts, not observed targets or proofs of
// validity. Keep their failures visible without making a desired policy result
// a condition for the software to pass.
const DIAGNOSTIC_CHECK_IDS = new Set([
  "extreme-state-not-dominated-by-nonparticipants",
  "household-finance-remains-numerically-bounded",
  "capacity-overflow-within-horizon-stress-guard",
  "maximum-directional-road-volume-capacity-within-horizon-stress-guard",
  "commute-time-in-plausibility-band",
  "residential-relocation-rate-below-provisional-churn-ceiling",
  "firm-relocation-rate-below-provisional-churn-ceiling",
  "voluntary-job-switch-rate-below-provisional-churn-ceiling",
  "employer-carried-workplace-change-rate-below-provisional-churn-ceiling",
  "extreme-state-below-fifty-percent",
  "active-enterprise-portfolio",
  "enterprise-margin-in-plausibility-band",
  "loss-making-firms-broad-distribution-guard",
  "enterprise-median-margin-broad-plausibility-guard",
  "enterprise-severe-distress-below-ten-percent",
]);

const baselineData = {
  schemaVersion: baseline.schemaVersion,
  zones: baseline.zones,
  links: baseline.roadGraph.segments || baseline.roadGraph.edges,
  nodes: baseline.roadGraph.nodes,
  candidateRoutes: baseline.roadGraph.candidateRoutes,
  turnRestrictions: baseline.roadGraph.turnRestrictions,
  transit: baseline.transit,
  calibration: baseline.calibration,
  assumptions: baseline.assumptions,
};
const prohibitedRoadTurns = new Set(
  (baseline.roadGraph.turnRestrictions || []).map(
    (turn) => `${turn.incomingEdgeId}:${turn.incomingDirection}>${turn.outgoingEdgeId}:${turn.outgoingDirection}`
  )
);
const commonConfig = {
  startDate: baseline.calibration.baseDate || "2024-01-01",
  calibrationLabel: "Illustrative Greater Abu Dhabi City scenario baseline, not a forecast",
  endogenousEnterpriseDynamics: true,
  initialEmploymentRate: 0.67,
};

const { reference: referencePreset, transit: transitPreset, housing: housingPreset, balanced: balancedPreset } = PUBLIC_PRESETS;
const START_DATE = new Date(`${commonConfig.startDate}T00:00:00Z`);
const ONE_CALENDAR_YEAR_DAYS = horizonEndDayFrom(START_DATE, 12);
const TEN_CALENDAR_YEAR_DAYS = horizonEndDayFrom(START_DATE, 120);

const runDefinitions = [
  { id: "reference-1y", label: "Reference · exact 12 calendar months", days: ONE_CALENDAR_YEAR_DAYS, preset: referencePreset },
  { id: "transit-1y", label: "Bus priority · exact 12 calendar months", days: ONE_CALENDAR_YEAR_DAYS, preset: transitPreset },
  { id: "reference-10y", label: "Reference · exact 10 calendar years", days: TEN_CALENDAR_YEAR_DAYS, preset: referencePreset },
  { id: "transit-10y", label: "Bus priority · exact 10 calendar years", days: TEN_CALENDAR_YEAR_DAYS, preset: transitPreset },
  { id: "housing-10y", label: "Housing delivery · exact 10 calendar years", days: TEN_CALENDAR_YEAR_DAYS, preset: housingPreset },
  { id: "balanced-10y", label: "Housing + jobs · exact 10 calendar years", days: TEN_CALENDAR_YEAR_DAYS, preset: balancedPreset },
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
  const assignmentLinks = snapshot.links.filter((link) => link.loadBearing !== false && link.contextOnly !== true);
  const roadRatios = assignmentLinks.flatMap((link) => [
    ...(link.capacityVehiclesAB > 0 ? [link.volumeCapacityAB] : []),
    ...(link.capacityVehiclesBA > 0 ? [link.volumeCapacityBA] : []),
  ]);
  const transitRatios = assignmentLinks.flatMap((link) => [
    ...(link.ptCapacityPassengersAB > 0 ? [link.ptLoadFactorAB] : []),
    ...(link.ptCapacityPassengersBA > 0 ? [link.ptLoadFactorBA] : []),
  ]);
  return {
    physicalEdgeCount: snapshot.links.length,
    assignmentEdgeCount: assignmentLinks.length,
    meanRoadVolumeCapacityRatio: round(sum(roadRatios) / Math.max(roadRatios.length, 1), 4),
    p90RoadVolumeCapacityRatio: round(percentile(roadRatios, 0.9), 4),
    maximumRoadVolumeCapacityRatio: round(Math.max(0, ...roadRatios), 4),
    overloadedDirectionCount: roadRatios.filter((ratio) => ratio > 1).length,
    meanTransitLoadFactor: round(sum(transitRatios) / Math.max(transitRatios.length, 1), 4),
    p90TransitLoadFactor: round(percentile(transitRatios, 0.9), 4),
    maximumTransitLoadFactor: round(Math.max(0, ...transitRatios), 4),
  };
}

const ROAD_LOAD_FIELDS = ["loadABVehicles", "loadBAVehicles", "loadABPassengers", "loadBAPassengers"];

// Capture immediately after the final workday assignment. Subsequent resident
// and employer decisions can change current routes, and weekends retain the
// preceding workday's network. Reconstructing from final current routes would
// therefore compare different observations. This independent ledger includes
// every physical traversal, irrespective of the engine's loadBearing flag.
function captureAssignedRoadLoads(engine) {
  const expected = engine.links.map(() => Object.fromEntries(ROAD_LOAD_FIELDS.map((field) => [field, 0])));
  let assignedCohorts = 0;
  let traversalCount = 0;
  let invalidTraversalCount = 0;
  let invalidWeightCount = 0;
  let prohibitedTurnCount = 0;
  for (const citizen of engine.citizens) {
    if (!citizen.enterpriseId || !["car", "pt"].includes(citizen.mode) || !citizen.routeTraversalCodes?.length) continue;
    assignedCohorts += 1;
    const addition = citizen.mode === "car" ? citizen.weight / engine.config.carOccupancy : citizen.weight;
    if (!Number.isFinite(addition) || addition <= 0) {
      invalidWeightCount += 1;
      continue;
    }
    let previousCode = null;
    let reachedWorkGateway = false;
    const workNodeId = engine.zoneById.get(citizen.workZoneId)?.networkNodeId;
    for (const code of citizen.routeTraversalCodes) {
      const index = Math.abs(code) - 1;
      if (!Number.isInteger(code) || code === 0 || !expected[index]) {
        invalidTraversalCount += 1;
        continue;
      }
      const field = citizen.mode === "car" ? (code > 0 ? "loadABVehicles" : "loadBAVehicles") : code > 0 ? "loadABPassengers" : "loadBAPassengers";
      expected[index][field] += addition;
      traversalCount += 1;
      const link = engine.links[index];
      if (previousCode !== null) {
        const previous = engine.links[Math.abs(previousCode) - 1];
        const previousEnd = previousCode > 0 ? previous.to : previous.from;
        // Outbound arrival at work ends a trip; the return leg begins with a
        // new departure. It is not a through-turn at that gateway.
        const workStop = !reachedWorkGateway && previousEnd === workNodeId;
        if (workStop) reachedWorkGateway = true;
        else if (prohibitedRoadTurns.has(`${previous.id}:${Math.sign(previousCode)}>${link.id}:${Math.sign(code)}`)) prohibitedTurnCount += 1;
      }
      previousCode = code;
    }
  }
  return { date: engine.clock.date, expected, assignedCohorts, traversalCount, invalidTraversalCount, invalidWeightCount, prohibitedTurnCount };
}

function physicalRoadAccounting(engine, snapshot, assignment) {
  const snapshotById = new Map(snapshot.links.map((link) => [String(link.id), link]));
  let excludedPhysicalEdges = 0;
  let missingSnapshotEdges = 0;
  let mismatchedDirectionalLoads = 0;
  let unsupportedAssignedDirections = 0;
  let invalidPhysicalRoadCapacities = 0;
  let maximumRawLoadDifference = 0;
  let maximumReportedLoadDifference = 0;
  let assignedPhysicalEdges = 0;
  for (const [index, link] of engine.links.entries()) {
    const reported = snapshotById.get(String(link.id));
    if (link.loadBearing !== true || link.contextOnly === true || reported?.loadBearing !== true || reported?.contextOnly === true)
      excludedPhysicalEdges += 1;
    if (!reported) missingSnapshotEdges += 1;
    const roadCapacities = [engine.linkCapacity(link, "car", 1), engine.linkCapacity(link, "car", -1)];
    if (roadCapacities.some((capacity) => !Number.isFinite(capacity) || capacity < 0) || !roadCapacities.some((capacity) => capacity > 0)) {
      invalidPhysicalRoadCapacities += 1;
    }
    const expected = assignment?.expected[index];
    if (expected && ROAD_LOAD_FIELDS.some((field) => expected[field] > 0)) assignedPhysicalEdges += 1;
    for (const field of ROAD_LOAD_FIELDS) {
      const rawDifference = Number.isFinite(expected?.[field]) && Number.isFinite(link[field]) ? Math.abs(link[field] - expected[field]) : Infinity;
      const reportedDifference =
        Number.isFinite(expected?.[field]) && Number.isFinite(reported?.[field]) ? Math.abs(reported[field] - expected[field]) : Infinity;
      maximumRawLoadDifference = Math.max(maximumRawLoadDifference, rawDifference);
      maximumReportedLoadDifference = Math.max(maximumReportedLoadDifference, reportedDifference);
      if (rawDifference > 1e-6 || reportedDifference > 0.011) mismatchedDirectionalLoads += 1;
      const direction = field.includes("AB") ? 1 : -1;
      const mode = field.endsWith("Vehicles") ? "car" : "pt";
      const capacity = engine.linkCapacity(link, mode, direction);
      if (expected?.[field] > 0 && (!Number.isFinite(capacity) || capacity <= 0)) unsupportedAssignedDirections += 1;
    }
  }
  const assignmentDateMatches = Boolean(assignment?.date && assignment.date === snapshot.city.networkAssignmentDate);
  const passed =
    Boolean(assignment) &&
    assignmentDateMatches &&
    assignment.assignedCohorts > 0 &&
    assignment.traversalCount > 0 &&
    assignment.invalidTraversalCount === 0 &&
    assignment.invalidWeightCount === 0 &&
    excludedPhysicalEdges === 0 &&
    missingSnapshotEdges === 0 &&
    snapshot.links.length === engine.links.length &&
    snapshotById.size === engine.links.length &&
    mismatchedDirectionalLoads === 0 &&
    unsupportedAssignedDirections === 0 &&
    invalidPhysicalRoadCapacities === 0;
  return {
    passed,
    assignmentDate: assignment?.date || null,
    assignmentDateMatches,
    physicalEdges: engine.links.length,
    assignedPhysicalEdges,
    excludedPhysicalEdges,
    missingSnapshotEdges,
    assignedCohorts: assignment?.assignedCohorts ?? null,
    traversalCount: assignment?.traversalCount ?? null,
    invalidTraversalCount: assignment?.invalidTraversalCount ?? null,
    invalidWeightCount: assignment?.invalidWeightCount ?? null,
    prohibitedTurnCount: assignment?.prohibitedTurnCount ?? null,
    declaredTurnRestrictionCount: prohibitedRoadTurns.size,
    resolvedTurnRestrictionCount: engine.turnRestrictions.length,
    mismatchedDirectionalLoads,
    unsupportedAssignedDirections,
    invalidPhysicalRoadCapacities,
    maximumRawLoadDifference: Number.isFinite(maximumRawLoadDifference) ? round(maximumRawLoadDifference, 8) : null,
    maximumReportedLoadDifference: Number.isFinite(maximumReportedLoadDifference) ? round(maximumReportedLoadDifference, 8) : null,
    interpretation:
      "Every physical directed traversal in the final workday assignment contributes resident weight / car occupancy vehicles or resident weight passengers. Independent route reconstruction is checked against raw loads (tolerance 0.000001) and rounded snapshot loads (0.011); all roads must carry capacity and every assigned direction must have positive mode capacity. Later actor decisions do not rewrite this assignment ledger.",
  };
}

function scenarioMetrics(engine, snapshot, assignment) {
  const { city } = snapshot;
  return {
    representedPopulation: city.representedPopulation,
    representedEmployed: city.representedEmployed,
    representedLaborForce: city.representedLaborForce,
    representedUnemployed: city.representedUnemployed,
    representedNonparticipants: city.representedNonparticipants,
    employmentRatePercent: city.employmentRate,
    unemploymentRatePercent: city.unemploymentRate,
    laborForceParticipationRatePercent: city.laborForceParticipationRate,
    nonParticipationRatePercent: city.nonParticipationRate,
    modeCountsRepresented: city.modeCounts,
    modeSharesPercent: city.modeShares,
    carOwnershipRatePercent: city.carOwnershipRate,
    carAccessAccounting: city.carAccessAccounting,
    citizenStateSharesPercent: city.stateShares,
    averageRoundTripMinutes: city.averageRoundTripMinutes,
    averageNetIncomeAedPerMonth: city.averageNetIncomeAed,
    averageBankBalanceAed: city.averageBankBalanceAed,
    averageMonthlySavingOrDrawdownAed: city.averageMonthlyBankBalanceDeltaAed,
    savingsPolicy: city.savingsPolicy,
    financialStatusSharesPercent: city.financialStatusShares,
    extremeNonparticipantSharePercent: round(
      (engine.citizens.filter((citizen) => citizen.state === "Extreme" && citizen.laborForceParticipant === false).length /
        Math.max(engine.citizens.filter((citizen) => citizen.state === "Extreme").length, 1)) *
        100
    ),
    meanHousingRentAedPerMonth: city.meanHousingRentAed,
    averageRoadCapacityUsagePercent: city.averageRoadCapacityUsage,
    sameZoneWorkSharePercent: city.sameZoneWorkShare,
    housingOccupancyRatePercent: city.housingOccupancyRate,
    housingCapacityRepresented: city.housingCapacityRepresented,
    housingOvercapacityRepresented: city.housingOvercapacityRepresented,
    enterprisePlaceCapacity: sum(snapshot.zones.map((zone) => Number(zone.enterprisePlaceCapacity) || 0)),
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
    mobilityEventRates: city.mobilityEventRates,
    distributions: city.distributions,
    network: { ...networkMetrics(snapshot), physicalRoadAccounting: physicalRoadAccounting(engine, snapshot, assignment) },
    enterprisePortfolio: enterprisePortfolio(engine),
  };
}

function scenarioChecks(engine, snapshot, metrics, definition) {
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
  const longHorizonStressTest = definition.days > ONE_CALENDAR_YEAR_DAYS;
  const capacityOverflowMaximumShare = longHorizonStressTest ? 0.3 : 0.1;
  const maximumDirectionalRoadVolumeCapacity = longHorizonStressTest ? 3.25 : 2;
  const zonedJobCapacityBreaches = snapshot.zones.filter((zoneMetric) => {
    const zone = engine.zoneById.get(zoneMetric.id);
    const plannedJobsRepresented = engine.zonePlannedJobSlots(zone) * engine.config.citizenWeight;
    return (
      zoneMetric.zonedJobCapacityGrandfatheredRepresented !== 0 ||
      plannedJobsRepresented > zoneMetric.requestedZonedJobCapacityRepresented ||
      zoneMetric.jobs > zoneMetric.requestedZonedJobCapacityRepresented
    );
  });
  const accountReconciliationIssues = engine.citizens.filter((citizen) => {
    const account = engine.citizenFinancialAccount(citizen);
    return !Number.isFinite(account.accountingReconciliationDifferenceAed) || Math.abs(account.accountingReconciliationDifferenceAed) > 0.02;
  });
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
      id: "resident-account-components-reconcile",
      passed: accountReconciliationIssues.length === 0,
      detail: `${accountReconciliationIssues.length} cohort account(s) where salary + support - housing - commute - fixed vehicle access differs from reported cash by more than AED 0.02`,
    },
    {
      id: "vehicle-access-stock-and-flows-reconcile",
      passed:
        Number.isFinite(metrics.carAccessAccounting?.initialAgentCount) &&
        metrics.carAccessAccounting.currentAgentCount === engine.citizens.filter((citizen) => citizen.hasCar).length &&
        metrics.carAccessAccounting.initialAgentCount +
          metrics.carAccessAccounting.acquisitions -
          metrics.carAccessAccounting.disposals -
          metrics.carAccessAccounting.replacementExits ===
          metrics.carAccessAccounting.currentAgentCount,
      detail: `Initial ${metrics.carAccessAccounting?.initialAgentCount} + acquisitions ${metrics.carAccessAccounting?.acquisitions} - disposals ${metrics.carAccessAccounting?.disposals} - replacement exits ${metrics.carAccessAccounting?.replacementExits} = current ${metrics.carAccessAccounting?.currentAgentCount} resident cohorts`,
    },
    {
      id: "population-conserved",
      passed: metrics.representedPopulation === expectedPopulation,
      detail: `${metrics.representedPopulation} represented residents; expected ${expectedPopulation}`,
    },
    {
      id: "full-agent-scale-resolved",
      passed:
        engine.citizens.length === Math.round(baseline.calibration.studyScopePopulation2024 / engine.config.citizenWeight) &&
        engine.enterprises.length === engine.config.enterpriseCount,
      detail: `${engine.citizens.length} citizen agents and ${engine.enterprises.length} enterprise agents`,
    },
    {
      id: "fresh-scenario-zoned-job-capacity-respected",
      passed: zonedJobCapacityBreaches.length === 0,
      detail: `${zonedJobCapacityBreaches.length} district(s) with grandfathered capacity, planned slots, or located jobs above requested zoned capacity`,
    },
    {
      id: "labor-force-stocks-reconcile",
      passed:
        metrics.representedLaborForce === metrics.representedEmployed + metrics.representedUnemployed &&
        metrics.representedPopulation === metrics.representedLaborForce + metrics.representedNonparticipants,
      detail: `${metrics.representedEmployed} employed + ${metrics.representedUnemployed} active unemployed + ${metrics.representedNonparticipants} nonparticipants = ${metrics.representedPopulation}`,
    },
    {
      id: "labor-force-rates-use-disclosed-denominators",
      passed:
        Math.abs(
          metrics.laborForceParticipationRatePercent - round((metrics.representedLaborForce / Math.max(metrics.representedPopulation, 1)) * 100)
        ) <= 0.01 &&
        Math.abs(
          metrics.nonParticipationRatePercent - round((metrics.representedNonparticipants / Math.max(metrics.representedPopulation, 1)) * 100)
        ) <= 0.01 &&
        Math.abs(metrics.unemploymentRatePercent - round((metrics.representedUnemployed / Math.max(metrics.representedLaborForce, 1)) * 100)) <= 0.01,
      detail: `${metrics.laborForceParticipationRatePercent}% participating; ${metrics.unemploymentRatePercent}% unemployed within the labor force; ${metrics.nonParticipationRatePercent}% outside it`,
    },
    {
      id: "outside-labor-force-financial-bin-reconciles",
      passed: Math.abs(Number(metrics.financialStatusSharesPercent?.["outside-labor-force"] || 0) - metrics.nonParticipationRatePercent) <= 0.01,
      detail: `${metrics.financialStatusSharesPercent?.["outside-labor-force"]}% financial bin versus ${metrics.nonParticipationRatePercent}% nonparticipant stock`,
    },
    {
      id: "extreme-state-not-dominated-by-nonparticipants",
      passed: metrics.extremeNonparticipantSharePercent < 50,
      detail: `${metrics.extremeNonparticipantSharePercent}% of Extreme citizens are outside the modeled labor force`,
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
      id: "employment-within-participating-population",
      passed:
        metrics.representedEmployed >= 0 &&
        metrics.representedEmployed <= metrics.representedLaborForce &&
        Math.abs(metrics.employmentRatePercent - round((metrics.representedEmployed / Math.max(metrics.representedPopulation, 1)) * 100)) <= 0.01,
      detail: `${metrics.representedEmployed} employed within ${metrics.representedLaborForce} participants; ${metrics.employmentRatePercent}% of represented residents. No outcome is required to equal the initial employment assumption.`,
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
      id: "capacity-overflow-within-horizon-stress-guard",
      passed: metrics.capacityOverflowTrips / Math.max(metrics.representedEmployed, 1) <= capacityOverflowMaximumShare,
      detail: `${round(
        (metrics.capacityOverflowTrips / Math.max(metrics.representedEmployed, 1)) * 100,
        3
      )}% of represented employed agents; provisional ${round(capacityOverflowMaximumShare * 100)}% ${
        longHorizonStressTest ? "ten-year stress" : "one-year"
      } guard`,
    },
    {
      id: "maximum-directional-road-volume-capacity-within-horizon-stress-guard",
      passed: metrics.network.maximumRoadVolumeCapacityRatio < maximumDirectionalRoadVolumeCapacity,
      detail: `${
        metrics.network.maximumRoadVolumeCapacityRatio
      } maximum directional work-trip load ratio; provisional <${maximumDirectionalRoadVolumeCapacity} ${
        longHorizonStressTest ? "ten-year stress" : "one-year"
      } guard`,
    },
    {
      id: "physical-roads-carry-assigned-load",
      passed: metrics.network.physicalRoadAccounting.passed,
      detail: `${metrics.network.physicalRoadAccounting.physicalEdges} physical edges; ${metrics.network.physicalRoadAccounting.excludedPhysicalEdges} excluded; ${metrics.network.physicalRoadAccounting.mismatchedDirectionalLoads} mismatched car/passenger directional loads; ${metrics.network.physicalRoadAccounting.unsupportedAssignedDirections} assigned directions without capacity; assignment ${metrics.network.physicalRoadAccounting.assignmentDate}`,
    },
    {
      id: "assigned-routes-respect-prohibited-turns",
      passed:
        metrics.network.physicalRoadAccounting.prohibitedTurnCount === 0 &&
        metrics.network.physicalRoadAccounting.declaredTurnRestrictionCount === metrics.network.physicalRoadAccounting.resolvedTurnRestrictionCount,
      detail: `${metrics.network.physicalRoadAccounting.prohibitedTurnCount} prohibited through-turns in final workday assignment; ${metrics.network.physicalRoadAccounting.resolvedTurnRestrictionCount}/${metrics.network.physicalRoadAccounting.declaredTurnRestrictionCount} source restrictions resolved; work-destination stops begin a new return leg`,
    },
    {
      id: "commute-time-in-plausibility-band",
      passed: metrics.averageRoundTripMinutes >= 5 && metrics.averageRoundTripMinutes <= 120,
      detail: `${metrics.averageRoundTripMinutes} minutes average round trip`,
    },
    {
      id: "residential-relocation-rate-below-provisional-churn-ceiling",
      passed:
        Number.isFinite(metrics.mobilityEventRates?.residentialMovesPer100CitizenAgentYears) &&
        metrics.mobilityEventRates.residentialMovesPer100CitizenAgentYears <= 30,
      detail: `${metrics.mobilityEventRates?.residentialMovesPer100CitizenAgentYears} events per 100 citizen-agent-years; provisional software sanity ceiling 30`,
    },
    {
      id: "firm-relocation-rate-below-provisional-churn-ceiling",
      passed:
        Number.isFinite(metrics.mobilityEventRates?.firmRelocationsPer100FirmAgentYears) &&
        metrics.mobilityEventRates.firmRelocationsPer100FirmAgentYears <= 20,
      detail: `${metrics.mobilityEventRates?.firmRelocationsPer100FirmAgentYears} events per 100 firm-agent-years; provisional software sanity ceiling 20`,
    },
    {
      id: "voluntary-job-switch-rate-below-provisional-churn-ceiling",
      passed:
        Number.isFinite(metrics.mobilityEventRates?.voluntaryJobSwitchesPer100EmployedAgentYears) &&
        metrics.mobilityEventRates.voluntaryJobSwitchesPer100EmployedAgentYears <= 50,
      detail: `${metrics.mobilityEventRates?.voluntaryJobSwitchesPer100EmployedAgentYears} events per 100 employed-agent-years; provisional software sanity ceiling 50`,
    },
    {
      id: "cross-district-job-switch-rate-reconciles-to-all-switches",
      passed:
        Number.isFinite(metrics.mobilityEventRates?.crossDistrictVoluntaryJobSwitchesPer100EmployedAgentYears) &&
        metrics.mobilityEventRates.crossDistrictVoluntaryJobSwitchesPer100EmployedAgentYears <=
          metrics.mobilityEventRates.voluntaryJobSwitchesPer100EmployedAgentYears + 0.01,
      detail: `${metrics.mobilityEventRates?.crossDistrictVoluntaryJobSwitchesPer100EmployedAgentYears} cross-district versus ${metrics.mobilityEventRates?.voluntaryJobSwitchesPer100EmployedAgentYears} all voluntary events per 100 employed-agent-years`,
    },
    {
      id: "employer-carried-workplace-change-rate-below-provisional-churn-ceiling",
      passed:
        Number.isFinite(metrics.mobilityEventRates?.employerCarriedWorkplaceChangesPer100EmployedAgentYears) &&
        metrics.mobilityEventRates.employerCarriedWorkplaceChangesPer100EmployedAgentYears <= 30,
      detail: `${metrics.mobilityEventRates?.employerCarriedWorkplaceChangesPer100EmployedAgentYears} affected worker events per 100 employed-agent-years; provisional software sanity ceiling 30`,
    },
    {
      id: "extreme-state-below-fifty-percent",
      passed: metrics.citizenStateSharesPercent.Extreme < 50,
      detail: `${metrics.citizenStateSharesPercent.Extreme}% of represented citizens`,
    },
    {
      id: "active-enterprise-portfolio",
      passed: metrics.enterprisePortfolio.activeFirms >= engine.enterprises.length * 0.85,
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
  let finalAssignmentDay = definition.days;
  while (finalAssignmentDay > 0 && !engine.config.workdays.includes(engine.clockAt(finalAssignmentDay).weekday)) finalAssignmentDay -= 1;
  let assignment = null;
  const originalCommuteCitizens = engine.commuteCitizens;
  engine.commuteCitizens = function () {
    const result = originalCommuteCitizens.call(this);
    if (this.day === finalAssignmentDay && this.config.workdays.includes(this.clock.weekday)) assignment = captureAssignedRoadLoads(this);
    return result;
  };
  const chunkDays = 30;
  for (let completed = 0; completed < definition.days; completed += chunkDays) {
    engine.step(Math.min(chunkDays, definition.days - completed));
  }
  const snapshot = engine.snapshot({ historyLimit: 0 });
  const metrics = scenarioMetrics(engine, snapshot, assignment);
  const invariantIssues = engine.validateInvariants();
  const assessments = scenarioChecks(engine, snapshot, metrics, definition);
  const checks = assessments.filter((check) => !DIAGNOSTIC_CHECK_IDS.has(check.id));
  const diagnostics = assessments
    .filter((check) => DIAGNOSTIC_CHECK_IDS.has(check.id))
    .map(({ passed: withinReviewBand, ...diagnostic }) => ({
      ...diagnostic,
      withinReviewBand,
      status: withinReviewBand ? "within-review-band" : "review-needed",
    }));
  const deterministicResult = {
    clock: snapshot.clock,
    metrics,
    invariantIssues,
  };
  process.stdout.write(
    `Completed ${definition.id}: employment ${metrics.employmentRatePercent}%, vehicle access ${metrics.carOwnershipRatePercent}%, ${
      checks.filter((check) => !check.passed).length
    } structural failures.\n`
  );
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
      employmentClosure: engine.config.employmentClosure || "legacy-fixed-target",
      legacyTargetEmploymentRatePercent: round(engine.config.targetEmploymentRate * 100),
      initialEmploymentRatePercent: round(engine.config.initialEmploymentRate * 100),
      dailyJobSearchProbability: engine.config.dailyJobSearchProbability,
      dailyJobSeparationProbability: engine.config.dailyJobSeparationProbability,
      matchingThroughputCohortsPerDay: engine.config.maxDailyLaborMatches,
      dailyWorkTripAssignmentHours: engine.config.assignmentPeakHours,
      residentialMoveCooldownDays: engine.config.residentialMoveCooldownDays,
      residentialMoveFollowThroughPercent: round(engine.config.residentialMoveDecisionProbability * 100),
      voluntaryJobSwitchCooldownDays: engine.config.voluntaryJobSwitchCooldownDays,
      firmMoveCooldownDays: engine.config.firmMoveCooldownDays,
      firmMoveConsiderationPercent: round(engine.config.firmMoveProbabilityOnStateEntry * 100),
    },
    metrics,
    invariants: {
      status: invariantIssues.length ? "failed" : "passed",
      issueCount: invariantIssues.length,
      issues: invariantIssues,
    },
    checks,
    diagnostics,
    status: checks.every((check) => check.passed) ? "passed" : "failed",
    resultDigestSha256: digest(deterministicResult),
  };
}

// Scenarios have separate engine instances and seeded RNGs. Parallel execution
// changes scheduling only; definitions, dates and result ordering are retained.
async function runScenariosConcurrently(definitions, concurrency = 4) {
  const results = new Array(definitions.length);
  const activeWorkers = new Set();
  let nextIndex = 0;
  let failed = false;
  async function runSlot() {
    while (!failed && nextIndex < definitions.length) {
      const index = nextIndex++;
      results[index] = await new Promise((resolve, reject) => {
        const worker = new Worker(fileURLToPath(import.meta.url), {
          workerData: { definition: definitions[index] },
          resourceLimits: { maxOldGenerationSizeMb: 512 },
        });
        activeWorkers.add(worker);
        let result;
        worker.once("message", (message) => {
          result = message;
        });
        worker.once("error", reject);
        worker.once("exit", (code) => {
          activeWorkers.delete(worker);
          if (code !== 0 || !result) reject(new Error(`Scenario ${definitions[index]?.id ?? index} worker exited ${code} without a valid result.`));
          else resolve(result);
        });
      });
    }
  }
  try {
    await Promise.all(Array.from({ length: Math.min(concurrency, definitions.length) }, runSlot));
  } catch (error) {
    failed = true;
    await Promise.all([...activeWorkers].map((worker) => worker.terminate()));
    throw error;
  }
  return results;
}

async function verifyConcurrency() {
  const definitions = runDefinitions.slice(0, 2).map((definition) => ({ ...definition, days: 3 }));
  const serial = definitions.map(runScenario);
  const parallel = await runScenariosConcurrently(definitions, 2);
  if (digest(serial) !== digest(parallel)) throw new Error("Serial and parallel scenario results differ.");
  for (const scenario of serial) {
    if (!scenario.metrics.network.physicalRoadAccounting.passed) throw new Error(`${scenario.id}: physical-road accounting failed.`);
  }
  const accountingEngine = new UdesV2Engine({ data: baselineData, config: { ...commonConfig, ...referencePreset }, seed: SEED });
  accountingEngine.commuteCitizens();
  const assignment = captureAssignedRoadLoads(accountingEngine);
  const accountingSnapshot = accountingEngine.snapshot({ historyLimit: 0 });
  if (!physicalRoadAccounting(accountingEngine, accountingSnapshot, assignment).passed) throw new Error("Fresh road accounting failed.");
  const positiveLink = accountingSnapshot.links.find((link) => ROAD_LOAD_FIELDS.some((field) => link[field] > 0));
  const positiveField = ROAD_LOAD_FIELDS.find((field) => positiveLink?.[field] > 0);
  positiveLink[positiveField] -= 1;
  if (physicalRoadAccounting(accountingEngine, accountingSnapshot, assignment).passed)
    throw new Error("Road accounting accepted missing directional load.");
  positiveLink[positiveField] += 1;
  positiveLink.loadBearing = false;
  if (physicalRoadAccounting(accountingEngine, accountingSnapshot, assignment).passed)
    throw new Error("Road accounting accepted an excluded physical road.");
  const firstRestriction = baseline.roadGraph.turnRestrictions?.[0];
  if (firstRestriction) {
    const turnProbe = Object.create(accountingEngine);
    turnProbe.citizens = [
      {
        enterpriseId: "turn-probe-employer",
        mode: "car",
        weight: 250,
        workZoneId: "turn-probe-work",
        routeTraversalCodes: [
          firstRestriction.incomingDirection * (accountingEngine.linkById.get(firstRestriction.incomingEdgeId).index + 1),
          firstRestriction.outgoingDirection * (accountingEngine.linkById.get(firstRestriction.outgoingEdgeId).index + 1),
        ],
      },
    ];
    if (captureAssignedRoadLoads(turnProbe).prohibitedTurnCount !== 1) throw new Error("Assignment audit missed a prohibited through-turn.");
    turnProbe.zoneById = new Map(accountingEngine.zoneById);
    turnProbe.zoneById.set("turn-probe-work", { networkNodeId: firstRestriction.viaNodeId });
    if (captureAssignedRoadLoads(turnProbe).prohibitedTurnCount !== 0) throw new Error("Assignment audit confused a work stop with a through-turn.");
  }
  let rejectedInvalidWorker = false;
  try {
    await runScenariosConcurrently([null, definitions[0]], 2);
  } catch {
    rejectedInvalidWorker = true;
  }
  if (!rejectedInvalidWorker) throw new Error("The runner accepted a failed worker.");
  process.stdout.write(
    "Serial/parallel scenario results match exactly; road accounting rejects missing loads/excluded physical roads; prohibited through-turns are distinguished from work stops; worker failures reject the run. This short runner check writes no evidence artifact.\n"
  );
}

async function main() {
  const sourceHashesAtStart = Object.fromEntries(Object.entries(SOURCE_PATHS).map(([label, filePath]) => [label, fileDigest(filePath)]));
  const initialControllerInputs = controllerModelInputs(require("../assets/js/udes-v2-app.js"), commonConfig.startDate, [12, 120]);
  const scenarios = await runScenariosConcurrently(runDefinitions);
  const oneYearReference = scenarios.find((scenario) => scenario.id === "reference-1y");
  const oneYearTransit = scenarios.find((scenario) => scenario.id === "transit-1y");
  const tenYearReference = scenarios.find((scenario) => scenario.id === "reference-10y");
  const tenYearTransit = scenarios.find((scenario) => scenario.id === "transit-10y");
  const tenYearHousing = scenarios.find((scenario) => scenario.id === "housing-10y");
  const tenYearBalanced = scenarios.find((scenario) => scenario.id === "balanced-10y");
  const tenYearReferenceNetOwnershipFlow =
    tenYearReference.metrics.cumulativeEvents.carAcquisitions -
    tenYearReference.metrics.cumulativeEvents.carDisposals -
    tenYearReference.metrics.cumulativeEvents.carAccessReplacementExits;
  const tenYearTransitNetOwnershipFlow =
    tenYearTransit.metrics.cumulativeEvents.carAcquisitions -
    tenYearTransit.metrics.cumulativeEvents.carDisposals -
    tenYearTransit.metrics.cumulativeEvents.carAccessReplacementExits;
  const tenYearOwnershipDifference = tenYearTransit.metrics.carOwnershipRatePercent - tenYearReference.metrics.carOwnershipRatePercent;
  const predictedOwnershipDifference =
    ((tenYearTransit.metrics.carAccessAccounting.initialAgentCount + tenYearTransitNetOwnershipFlow) / tenYearTransit.resolvedScope.citizenAgents -
      (tenYearReference.metrics.carAccessAccounting.initialAgentCount + tenYearReferenceNetOwnershipFlow) /
        tenYearReference.resolvedScope.citizenAgents) *
    100;

  const crossScenarioAssessments = [
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
      id: "ten-year-transit-ownership-stock-reconciles-with-agent-flows",
      passed: Math.abs(tenYearOwnershipDifference - predictedOwnershipDifference) <= 0.02,
      detail: `${tenYearOwnershipDifference} percentage-point stock difference versus ${round(
        predictedOwnershipDifference,
        4
      )} from opening stocks, acquisitions, disposals and replacement exits`,
    },
    {
      id: "ten-year-transit-reduces-average-commute",
      passed: tenYearTransit.metrics.averageRoundTripMinutes < tenYearReference.metrics.averageRoundTripMinutes,
      detail: `${tenYearReference.metrics.averageRoundTripMinutes} minutes reference → ${tenYearTransit.metrics.averageRoundTripMinutes} minutes transit`,
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
      id: "ten-year-housing-satisfaction-change-remains-bounded",
      passed: tenYearHousing.metrics.citizenStateSharesPercent.Happy >= tenYearReference.metrics.citizenStateSharesPercent.Happy - 5,
      detail: `${tenYearReference.metrics.citizenStateSharesPercent.Happy}% reference → ${tenYearHousing.metrics.citizenStateSharesPercent.Happy}% housing happy`,
    },
    {
      id: "ten-year-housing-lowers-mean-housing-rent",
      passed: tenYearHousing.metrics.meanHousingRentAedPerMonth < tenYearReference.metrics.meanHousingRentAedPerMonth,
      detail: `AED ${tenYearReference.metrics.meanHousingRentAedPerMonth} reference → AED ${tenYearHousing.metrics.meanHousingRentAedPerMonth} housing`,
    },
    {
      id: "ten-year-housing-financial-tradeoff-remains-bounded",
      passed: Number.isFinite(tenYearHousing.metrics.averageNetIncomeAedPerMonth) && tenYearHousing.metrics.averageNetIncomeAedPerMonth > 0,
      detail: `AED ${tenYearReference.metrics.averageNetIncomeAedPerMonth} reference → AED ${tenYearHousing.metrics.averageNetIncomeAedPerMonth} housing after housing and commute`,
    },
    {
      id: "ten-year-housing-network-tradeoff-remains-served",
      passed:
        tenYearHousing.metrics.unservedCommuters === 0 &&
        Number.isFinite(tenYearHousing.metrics.capacityOverflowTrips) &&
        tenYearHousing.metrics.capacityOverflowTrips / Math.max(tenYearHousing.metrics.representedEmployed, 1) <= 0.3,
      detail: `${tenYearReference.metrics.capacityOverflowTrips} reference → ${tenYearHousing.metrics.capacityOverflowTrips} housing represented overflow trips; ${tenYearHousing.metrics.unservedCommuters} unserved`,
    },
    {
      id: "ten-year-balanced-increases-housing-capacity",
      passed: tenYearBalanced.metrics.housingCapacityRepresented > tenYearReference.metrics.housingCapacityRepresented,
      detail: `${tenYearReference.metrics.housingCapacityRepresented} reference → ${tenYearBalanced.metrics.housingCapacityRepresented} balanced represented capacity`,
    },
    {
      id: "ten-year-balanced-increases-employment-space-capacity",
      passed: tenYearBalanced.metrics.enterprisePlaceCapacity > tenYearReference.metrics.enterprisePlaceCapacity,
      detail: `${tenYearReference.metrics.enterprisePlaceCapacity} reference → ${tenYearBalanced.metrics.enterprisePlaceCapacity} balanced enterprise places`,
    },
    {
      id: "ten-year-balanced-reduces-housing-pressure",
      passed: tenYearBalanced.metrics.housingOccupancyRatePercent < tenYearReference.metrics.housingOccupancyRatePercent,
      detail: `${tenYearReference.metrics.housingOccupancyRatePercent}% reference → ${tenYearBalanced.metrics.housingOccupancyRatePercent}% balanced`,
    },
    {
      id: "ten-year-balanced-satisfaction-change-remains-bounded",
      passed: tenYearBalanced.metrics.citizenStateSharesPercent.Happy >= tenYearReference.metrics.citizenStateSharesPercent.Happy - 6,
      detail: `${tenYearReference.metrics.citizenStateSharesPercent.Happy}% reference → ${tenYearBalanced.metrics.citizenStateSharesPercent.Happy}% balanced happy`,
    },
  ];

  const structuralComparisonIds = new Set([
    "ten-year-reference-preserves-population",
    "ten-year-reference-enterprise-margin-remains-finite",
    "ten-year-transit-ownership-stock-reconciles-with-agent-flows",
    "ten-year-balanced-increases-housing-capacity",
    "ten-year-balanced-increases-employment-space-capacity",
  ]);
  const isStructuralComparison = (check) => check.id.endsWith("reaches-exact-calendar-date") || structuralComparisonIds.has(check.id);
  const crossScenarioChecks = crossScenarioAssessments.filter(isStructuralComparison);
  const crossScenarioDiagnostics = crossScenarioAssessments
    .filter((check) => !isStructuralComparison(check))
    .map(({ passed: expectedDirection, ...diagnostic }) => ({
      ...diagnostic,
      expectedDirection,
      status: expectedDirection ? "expected-direction" : "review-needed",
      interpretation: "Single-seed model outcome; this direction is not an empirical validation target.",
    }));
  const allDiagnostics = [...scenarios.flatMap((scenario) => scenario.diagnostics), ...crossScenarioDiagnostics];
  const allChecks = [...scenarios.flatMap((scenario) => scenario.checks), ...crossScenarioChecks];
  const passed = allChecks.every((check) => check.passed);
  const report = {
    schemaVersion: "2.0.0",
    generatedAt: new Date().toISOString(),
    model: "Abu Dhabi Urban Dynamics Lab / UDES v2",
    datasetSchemaVersion: baseline.schemaVersion,
    engineSchemaVersion: scenarios[0] ? require("../assets/js/udes-v2-worker.js").SCHEMA_VERSION : null,
    sourceHashes: sourceHashesAtStart,
    seed: SEED,
    status: passed ? "passed-structural-checks" : "failed-structural-checks",
    validationScope:
      "Fixed-seed software integrity, conservation and accounting checks, with separately reported model diagnostics and scenario directions.",
    caveat:
      "Passing structural checks does not validate a forecast. Diagnostic thresholds and expected scenario directions are explicitly synthetic review prompts. Current travel, labor, housing and establishment observations, fitted parameters and held-out validation are still required for predictive use.",
    empiricalValidation: {
      status: "not-performed",
      fittedBehavioralParameters: false,
      heldOutPredictionTest: false,
      uncertaintyReport: "uncertainty-report.json",
      populationEvidence: "Official district totals mapped to the chosen study boundary; spatial totals do not validate behavior.",
      trafficEvidence: "Routed geometry with partly observed road attributes; no observed link-count or journey-time calibration.",
      behavioralEvidence: "Transparent assumptions; historical all-trip mode shares are not directly comparable to modeled commute shares.",
    },
    evidenceStatus: summarizeEvidence(baseline),
    methodology: {
      execution:
        "At most four independent scenario workers; separate engines and RNGs, unchanged horizons and ordered results. The runner has a serial/parallel equality probe (--verify-concurrency) that writes no evidence artifact.",
      runs: [
        "Reference preset for exactly 12 calendar months (2024-01-01 through 2025-01-01)",
        "Bus-priority preset for exactly 12 calendar months",
        "Reference preset for exactly 3,653 simulated days (2024-01-01 through 2034-01-01)",
        "Bus-priority preset for exactly 3,653 simulated days",
        "Housing-delivery preset for exactly 3,653 simulated days",
        "Housing-plus-jobs preset for exactly 3,653 simulated days",
      ],
      determinism:
        "All full-scale runs use seed 240124. Result digests identify each result for future regression comparison; deterministic replay is exercised separately in the CI regression suite.",
      directionalRobustness:
        "This report is fixed-seed. Run scripts/validate-udes-v2-uncertainty.mjs for full-scale paired-seed outcomes and one-at-a-time sensitivity; that report records variability and reversals rather than requiring a preferred policy outcome.",
      enterpriseEconomics:
        "Enterprise diagnostics are broad snapshot review bands, not pass/fail requirements or empirical profitability calibration. They flag active-firm coverage, aggregate and median margins, the loss-making distribution, and severe distress against the model's configured restart threshold.",
      enterpriseSnapshotReviewBands: {
        activeFirmShareMinimumPercent: 85,
        revenueWeightedMarginPercent: { minimum: -10, maximum: 40 },
        lossMakingShareMaximumExclusivePercent: 60,
        medianMarginMinimumExclusivePercent: -5,
        severeDistressShareMaximumExclusivePercent: 10,
        severeDistressDefinition: "Operating margin at or below the model's configured enterprise restart threshold.",
      },
      mobilityReviewBands: {
        status: "Provisional diagnostic review bands, not pass/fail requirements or empirical Abu Dhabi calibration.",
        denominator:
          "Completed agent events per 100 modeled actor-years; employment-based rates use accumulated employed-agent-days, and repeated events by one actor count separately.",
        residentialMovesMaximumPer100CitizenAgentYears: 30,
        firmRelocationsMaximumPer100FirmAgentYears: 20,
        voluntaryJobSwitchesMaximumPer100EmployedAgentYears: 50,
        employerCarriedWorkplaceChangesMaximumPer100EmployedAgentYears: 30,
      },
      systemWideReviewBands: {
        status: "Broad diagnostic review bands, not pass/fail requirements or observed Abu Dhabi targets.",
        oneYearCapacityOverflowMaximumShareOfEmployedPercent: 10,
        tenYearStressCapacityOverflowMaximumShareOfEmployedPercent: 30,
        oneYearMaximumDirectionalWorkTripVolumeCapacityRatio: 2,
        tenYearStressMaximumDirectionalWorkTripVolumeCapacityRatio: 3.25,
        extremeCitizenStateMaximumSharePercent: 50,
        note: "Soft network overflow remains modeled as congestion/crowding. The broader ten-year review bands flag extreme outcomes for investigation; exceeding a band is retained in the report and does not fail structural verification. Housing capacity is evaluated through capacity, occupancy, rent, net resources, overflow, and service conservation; commute and network changes are reported as trade-offs rather than forced to a monotone policy direction.",
      },
      fullScale: `The engine derives ${scenarios[0]?.resolvedScope.citizenAgents?.toLocaleString(
        "en-US"
      )} citizen agents at ${scenarios[0]?.resolvedScope.citizenWeightPersons?.toLocaleString(
        "en-US"
      )} represented persons each from the committed baseline and uses ${scenarios[0]?.resolvedScope.enterpriseAgents?.toLocaleString(
        "en-US"
      )} enterprise agents.`,
    },
    sourceScope: {
      studyArea: baseline.scope.name,
      scadMappedDistrictPopulationSubtotal2024: baseline.calibration.studyScopePopulation2024,
      modeledRepresentedPopulation: scenarios[0]?.resolvedScope.representedPopulation,
      citizenAgents: scenarios[0]?.resolvedScope.citizenAgents,
      citizenWeightPersons: scenarios[0]?.resolvedScope.citizenWeightPersons,
      enterpriseAgents: scenarios[0]?.resolvedScope.enterpriseAgents,
      zones: scenarios[0]?.resolvedScope.zones,
      roadGraphEdges: scenarios[0]?.resolvedScope.roadGraphEdges,
    },
    scenarios,
    crossScenarioChecks,
    crossScenarioDiagnostics,
    diagnosticSummary: {
      reviewNeeded: allDiagnostics.filter((diagnostic) => diagnostic.status === "review-needed").length,
      total: allDiagnostics.length,
      interpretation: "Review prompts remain visible even when all structural checks pass. They are not calibrated acceptance limits.",
    },
    checkSummary: {
      passed: allChecks.filter((check) => check.passed).length,
      failed: allChecks.filter((check) => !check.passed).length,
      total: allChecks.length,
    },
  };

  delete require.cache[require.resolve("../assets/js/udes-v2-app.js")];
  const finalControllerInputs = controllerModelInputs(require("../assets/js/udes-v2-app.js"), commonConfig.startDate, [12, 120]);
  Object.assign(report, finalizeSourceProvenance(SOURCE_PATHS, sourceHashesAtStart, initialControllerInputs, finalControllerInputs));
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  process.stdout.write(`Wrote ${path.relative(ROOT, OUTPUT_PATH)}\n`);
  process.stdout.write(`Validation status: ${report.status} (${report.checkSummary.passed}/${report.checkSummary.total} checks passed)\n`);
  process.stdout.write(`Model diagnostics requiring review: ${report.diagnosticSummary.reviewNeeded}/${report.diagnosticSummary.total}\n`);

  if (!passed) process.exitCode = 1;
}

if (!isMainThread) parentPort.postMessage(runScenario(workerData.definition));
else if (process.argv.includes("--verify-concurrency")) await verifyConcurrency();
else await main();
