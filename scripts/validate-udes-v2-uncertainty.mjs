import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { pairedDifference, summarizePairedDifferences } from "./udes-v2-experiment-statistics.mjs";
import { summarizeEvidence } from "./udes-v2-evidence-summary.mjs";
import { controllerModelInputs, finalizeSourceProvenance } from "./udes-v2-source-provenance.mjs";

const require = createRequire(import.meta.url);
const { UdesV2Engine } = require("../assets/js/udes-v2-worker.js");
const { PUBLIC_PRESETS, horizonEndDayFrom } = require("../assets/js/udes-v2-app.js");
const baseline = require("../assets/data/udes-v2/baseline.json");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Map(
  process.argv.slice(2).map((argument) => {
    const [key, ...value] = argument.replace(/^--/, "").split("=");
    return [key, value.length ? value.join("=") : true];
  })
);
const allowedArgs = new Set(["months", "seeds", "output", "skip-sensitivity"]);
for (const key of args.keys()) if (!allowedArgs.has(key)) throw new Error(`Unknown argument: --${key}`);
const months = Number(args.get("months") || 12);
if (!Number.isInteger(months) || months < 1 || months > 120) throw new Error("--months must be an integer from 1 through 120.");
const seeds = String(args.get("seeds") || "240124,70117,90421")
  .split(",")
  .map(Number);
if (seeds.length < 2 || new Set(seeds).size !== seeds.length || seeds.some((seed) => !Number.isSafeInteger(seed) || seed < 1)) {
  throw new Error("--seeds requires at least two distinct positive integer seeds.");
}
const outputPath = path.resolve(ROOT, String(args.get("output") || "assets/data/udes-v2/uncertainty-report.json"));
const sourcePaths = {
  engineSha256: path.join(ROOT, "assets/js/udes-v2-worker.js"),
  baselineSha256: path.join(ROOT, "assets/data/udes-v2/baseline.json"),
  publicControllerSha256: path.join(ROOT, "assets/js/udes-v2-app.js"),
  experimentHarnessSha256: fileURLToPath(import.meta.url),
  statisticsSha256: path.join(ROOT, "scripts/udes-v2-experiment-statistics.mjs"),
  evidenceSummarySha256: path.join(ROOT, "scripts/udes-v2-evidence-summary.mjs"),
  sourceProvenanceSha256: path.join(ROOT, "scripts/udes-v2-source-provenance.mjs"),
};
const digest = (value) => crypto.createHash("sha256").update(value).digest("hex");
const currentSourceHashes = () => Object.fromEntries(Object.entries(sourcePaths).map(([name, file]) => [name, digest(fs.readFileSync(file))]));
const sourceHashes = currentSourceHashes();
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
const startDate = baseline.calibration.baseDate || "2024-01-01";
const days = horizonEndDayFrom(new Date(`${startDate}T00:00:00Z`), months);
const initialControllerInputs = controllerModelInputs(require("../assets/js/udes-v2-app.js"), startDate, [months]);
const observationDays = Math.min(90, days);
const commonConfig = { startDate, endogenousEnterpriseDynamics: true, initialEmploymentRate: 0.67 };
const metricUnits = {
  carSharePercent: "percent; pooled completed workday commute observations",
  transitSharePercent: "percent; pooled completed workday commute observations",
  meanRoundTripMinutes: "minutes; pooled completed workday commute observations",
  meanWorkdayVehicleKm: "vehicle-km per modeled workday",
  unservedSharePercent: "percent; attempted modeled workday commutes",
  employmentRatePercent: "percent of represented residents, final snapshot",
  unemploymentRatePercent: "percent of participating residents, final snapshot",
  averageMonthlyNetResourcesAed:
    "AED per resident cohort member after housing and transport, before essentials; latest account, including replacement opening estimates",
  averageMonthlySavingAed: "AED per resident cohort member; last settled saving/drawdown, reset to zero for replacement openings",
  essentialBudgetGapSharePercent: "percent of represented residents with negative residual after essentials, latest account",
  severeStressSharePercent: "percent of represented residents in modeled Extreme state, final snapshot",
  carAccessSharePercent: "percent of represented residents with modeled vehicle access, final snapshot",
  housingOccupancyPercent: "percent; represented residents / modeled resident capacity, final snapshot",
  meanHousingRentAed: "AED per modeled resident budget per month, final snapshot",
};
const metricKeys = Object.keys(metricUnits);
const pairedDifferenceUnits = Object.fromEntries(
  Object.entries(metricUnits).map(([key, unit]) => [key, unit.replace(/^percent(?=;| of)/, "percentage points")])
);
let resolvedDefaults = null;

function runScenario(id, preset, seed, assumptionPatch = {}) {
  process.stdout.write(`Uncertainty run ${id}, seed ${seed}, ${days} days\n`);
  const engine = new UdesV2Engine({ data: baselineData, config: { ...commonConfig, ...preset, ...assumptionPatch }, seed });
  resolvedDefaults ||= { ...engine.config };
  const openingPopulation = engine.citizens.length * engine.config.citizenWeight;
  const observations = { workdays: 0, completed: 0, unserved: 0, car: 0, transit: 0, roundTripMinutes: 0, vehicleKm: 0 };
  const preObservationDays = days - observationDays;
  for (let completed = 0; completed < preObservationDays; completed += 30) {
    engine.step(Math.min(30, preObservationDays - completed), { historyLimit: 0 });
  }
  for (let observed = 0; observed < observationDays; observed += 1) {
    engine.step(1, { historyLimit: 0 });
    if (!engine.config.workdays.includes(engine.clock.weekday)) continue;
    observations.workdays += 1;
    observations.completed += engine.daily.representedTrips;
    observations.unserved += engine.daily.unservedTrips;
    observations.car += engine.daily.carTrips;
    observations.transit += engine.daily.ptTrips;
    observations.roundTripMinutes += engine.daily.weightedRoundTripMinutes;
    observations.vehicleKm += engine.daily.carVehicleKm;
  }
  const snapshot = engine.snapshot({ historyLimit: 0 });
  const { city } = snapshot;
  const openingEstimateCohorts = engine.citizens.filter((citizen) => !(citizen.lastAccountedDays > 0));
  const openingEstimateRepresentedResidents = openingEstimateCohorts.reduce((total, citizen) => total + citizen.weight, 0);
  const financialObservationBasis = {
    closedAccountCohorts: engine.citizens.length - openingEstimateCohorts.length,
    openingEstimateCohorts: openingEstimateCohorts.length,
    closedAccountRepresentedResidents: city.representedPopulation - openingEstimateRepresentedResidents,
    openingEstimateRepresentedResidents,
    classificationRule: "lastAccountedDays > 0 denotes a settled account; zero or missing days denotes an opening estimate.",
    interpretation:
      "Cross-section of current cohorts: continuing cohorts retain their latest settled account; demographic replacements supply opening estimates, not realized December spending. Replacement saving/drawdown is reset to zero.",
  };
  const metrics = {
    carSharePercent: (observations.car / Math.max(observations.completed, 1)) * 100,
    transitSharePercent: (observations.transit / Math.max(observations.completed, 1)) * 100,
    meanRoundTripMinutes: observations.roundTripMinutes / Math.max(observations.completed, 1),
    meanWorkdayVehicleKm: observations.vehicleKm / Math.max(observations.workdays, 1),
    unservedSharePercent: (observations.unserved / Math.max(observations.completed + observations.unserved, 1)) * 100,
    employmentRatePercent: city.employmentRate,
    unemploymentRatePercent: city.unemploymentRate,
    averageMonthlyNetResourcesAed: city.averageNetIncomeAed,
    averageMonthlySavingAed: city.averageMonthlyBankBalanceDeltaAed,
    essentialBudgetGapSharePercent:
      (engine.citizens.reduce(
        (total, citizen) => total + (engine.citizenFinancialAccount(citizen).residualAfterEssentialsAed < 0 ? citizen.weight : 0),
        0
      ) /
        Math.max(city.representedPopulation, 1)) *
      100,
    severeStressSharePercent: city.stateShares.Extreme,
    carAccessSharePercent: city.carOwnershipRate,
    housingOccupancyPercent: city.housingOccupancyRate,
    meanHousingRentAed: city.meanHousingRentAed,
  };
  const invariantIssues = engine.validateInvariants();
  const checks = {
    invariants: invariantIssues.length === 0,
    finiteMetrics: Object.values(metrics).every(Number.isFinite),
    populationConserved: city.representedPopulation === openingPopulation,
    laborStocksReconcile: city.representedLaborForce === city.representedEmployed + city.representedUnemployed,
    employmentFeasible: city.representedEmployed >= 0 && city.representedEmployed <= city.representedLaborForce,
    vehicleAccessStockReconciles:
      city.carAccessAccounting?.initialAgentCount +
        city.carAccessAccounting?.acquisitions -
        city.carAccessAccounting?.disposals -
        city.carAccessAccounting?.replacementExits ===
      engine.citizens.filter((citizen) => citizen.hasCar).length,
    observedWorkdays: observations.workdays > 0 && observations.completed > 0,
  };
  return {
    id,
    seed,
    assumptionPatch,
    metrics,
    checks,
    invariantIssues,
    status: Object.values(checks).every(Boolean) ? "passed-structural-checks" : "failed-structural-checks",
    finalDate: snapshot.clock.date,
    observations,
    financialObservationBasis,
    scope: {
      residentCohorts: engine.citizens.length,
      residentWeight: engine.config.citizenWeight,
      employerCohorts: engine.enterprises.length,
      representedPopulation: city.representedPopulation,
      employmentClosure: engine.config.employmentClosure || "legacy-fixed-target",
      employmentInitialShare: engine.config.initialEmploymentRate,
      dailyJobSearchProbability: engine.config.dailyJobSearchProbability,
      dailyJobSeparationProbability: engine.config.dailyJobSeparationProbability,
      matchingThroughputCohortsPerDay: engine.config.maxDailyLaborMatches,
    },
    resultDigestSha256: digest(JSON.stringify({ metrics, observations, invariantIssues })),
  };
}

function runPair(id, seed, patch = {}) {
  const reference = runScenario(`${id}-reference`, PUBLIC_PRESETS.reference, seed, patch);
  const intervention = runScenario(`${id}-transit`, PUBLIC_PRESETS.transit, seed, patch);
  return { id, seed, assumptionPatch: patch, reference, intervention, delta: pairedDifference(reference.metrics, intervention.metrics, metricKeys) };
}

const seedPairs = seeds.map((seed) => runPair("baseline-assumptions", seed));
const sensitivityDefinitions = args.has("skip-sensitivity")
  ? []
  : [
      { id: "cost-sensitivity-low", parameter: "modeCostCoefficient", multiplier: 0.75 },
      { id: "cost-sensitivity-high", parameter: "modeCostCoefficient", multiplier: 1.25 },
      { id: "assignment-window-short", parameter: "assignmentPeakHours", multiplier: 0.75 },
      { id: "assignment-window-long", parameter: "assignmentPeakHours", multiplier: 1.25 },
    ];
const sensitivityPairs = sensitivityDefinitions.map((definition) => {
  const baseValue = resolvedDefaults[definition.parameter];
  if (!Number.isFinite(baseValue)) throw new Error(`Sensitivity parameter unavailable: ${definition.parameter}`);
  const alternativeValue = baseValue * definition.multiplier;
  const pair = runPair(definition.id, seeds[0], { [definition.parameter]: alternativeValue });
  return {
    ...pair,
    parameter: definition.parameter,
    baseValue,
    alternativeValue,
    deltaChangeFromSameSeedBaseline: pairedDifference(seedPairs[0].delta, pair.delta, metricKeys),
    directionReversals: metricKeys.filter(
      (key) =>
        Math.abs(seedPairs[0].delta[key]) > 1e-9 &&
        Math.abs(pair.delta[key]) > 1e-9 &&
        Math.sign(seedPairs[0].delta[key]) !== Math.sign(pair.delta[key])
    ),
  };
});
const allRuns = [...seedPairs, ...sensitivityPairs].flatMap((pair) => [pair.reference, pair.intervention]);
delete require.cache[require.resolve("../assets/js/udes-v2-app.js")];
const finalControllerInputs = controllerModelInputs(require("../assets/js/udes-v2-app.js"), startDate, [months]);
const sourceProvenance = finalizeSourceProvenance(sourcePaths, sourceHashes, initialControllerInputs, finalControllerInputs);
const report = {
  schemaVersion: "1.0.0",
  generatedAt: new Date().toISOString(),
  sourceHashes,
  ...sourceProvenance,
  status: allRuns.every((run) => run.status === "passed-structural-checks") ? "passed-structural-checks" : "failed-structural-checks",
  purpose:
    "Describe simulation seed variability and selected assumption sensitivity; no empirical uncertainty calibration or preferred outcome assertion.",
  empiricalValidation: { status: "not-performed", predictiveIntervalsAvailable: false, fittedBehavioralParameters: false },
  evidenceStatus: summarizeEvidence(baseline),
  design: {
    seeds,
    startDate,
    horizonMonths: months,
    simulatedDays: days,
    observationDays,
    scale: "Full committed resident weight and employer count; no reduced-scale substitute.",
    pairedContrast:
      "Bus-priority minus reference under the same seed and assumptions. Branching can consume different random draws; equal seeds alone do not guarantee eventwise common random numbers.",
    travelObservation:
      "Pool completed workday commuter observations over the final observation window. Exclude retained weekend assignments. Unserved demand has a separate denominator.",
    financialObservation:
      "Final cross-section of each current cohort's latest financial account. Continuing cohorts retain the last closed month; annual demographic replacements contribute new opening budget estimates and zero prior-period saving/drawdown. Counts and represented weights of both account bases are recorded per run. This mixed snapshot is distinct from a wholly realized monthly ledger and from the pooled travel window.",
    seedSummary:
      "Mean, observed minimum/maximum, sample standard deviation and sign counts across independent seeds. Small-sample spread is not a confidence or prediction interval.",
    sensitivity:
      "One parameter at a time at -25% and +25% of its base value, paired at the first seed. These are chosen stress ranges, not evidence-based parameter bounds. Cross-parameter interactions are not covered.",
    initialization: "No warm-up discarded and no equilibrium claim. Results include adjustment from the synthetic opening allocation.",
    omittedUncertainty: [
      "joint parameter uncertainty",
      "structural alternatives",
      "household representation",
      "aggregation resolution",
      "unobserved background traffic",
      "future external growth",
      "measurement error",
    ],
  },
  metricUnits,
  pairedDifferenceUnits,
  seedSummary: summarizePairedDifferences(seedPairs, metricKeys),
  seedPairs,
  sensitivityPairs,
  checkSummary: {
    passed: allRuns.filter((run) => run.status === "passed-structural-checks").length,
    failed: allRuns.filter((run) => run.status !== "passed-structural-checks").length,
    total: allRuns.length,
  },
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
process.stdout.write(
  `Wrote ${path.relative(ROOT, outputPath)} (${report.checkSummary.passed}/${report.checkSummary.total} structurally valid runs)\n`
);
if (report.checkSummary.failed) process.exitCode = 1;
