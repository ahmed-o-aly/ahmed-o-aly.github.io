import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const html = readRoute("/projects/abu-dhabi-urban-dynamics-v2/");
const projects = readRoute("/projects/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const appBuffer = readFileSync(new URL("../assets/js/udes-v2-app.js", import.meta.url));
const workerBuffer = readFileSync(new URL("../assets/js/udes-v2-worker.js", import.meta.url));
const baselineBuffer = readFileSync(new URL("../assets/data/udes-v2/baseline.json", import.meta.url));
const validationHarnessBuffer = readFileSync(new URL("../scripts/validate-udes-v2-full.mjs", import.meta.url));
const app = appBuffer.toString("utf8");
const worker = workerBuffer.toString("utf8");
const baseline = JSON.parse(baselineBuffer.toString("utf8"));
const zones = JSON.parse(readFileSync(new URL("../assets/data/udes-v2/zones.geojson", import.meta.url), "utf8"));
const roads = JSON.parse(readFileSync(new URL("../assets/data/udes-v2/roads.geojson", import.meta.url), "utf8"));
const stops = JSON.parse(readFileSync(new URL("../assets/data/udes-v2/transit-stops.geojson", import.meta.url), "utf8"));
const validation = JSON.parse(readFileSync(new URL("../assets/data/udes-v2/validation-report.json", import.meta.url), "utf8"));
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

assert.equal((html.match(/<h1\b/g) || []).length, 1, "v2 has one page heading");
assertContains(html, /class="[^"]*garden-body--simulation-v2/, "v2 uses its fixed analyst shell");
assertContains(html, /data-model-url="\/assets\/data\/udes-v2\/baseline\.json"/, "v2 emits the scenario baseline URL");
assertContains(html, /data-worker-url="\/assets\/js\/udes-v2-worker\.js"/, "v2 emits its agent worker URL");
assertContains(html, /aria-label="Interactive map of Greater Abu Dhabi City/, "map has the correct city boundary description");
assertContains(
  html,
  /Model districts from official AD-SDI polygons · OSM-routed corridors/,
  "map provenance distinguishes grouped model districts from their official source polygons"
);
assert.equal((html.match(/data-udes-v2-inspector-tab=/g) || []).length, 4, "four object inspectors are available");
assert.equal((html.match(/data-udes-v2-chart-tab=/g) || []).length, 6, "six analysis workspaces are available");
assertContains(html, /Read the decision rules/, "citizen and enterprise objectives are documented in the controls");
assertContains(html, /Essential consumption: AED 2,500\/month/, "household saving assumptions are disclosed beside the controls");
assertContains(html, /validation-report\.json/, "the console links to its reproducible full-scale validation report");
assertContains(html, /data-udes-v2-provenance/, "the inspector exposes field provenance");
assert.doesNotMatch(html, /<option[^>]*>(?:Al Ain|Al Dhafra|Ruwais)/i, "out-of-scope regions are not selectable");
assertContains(html, /assets\/js\/udes-v2-app\.js/, "v2 controller is loaded");
assertContains(html, /echarts(?:\.min)?\.js/, "v2 loads the chart engine");
assertContains(
  css,
  /\.udes-v2-console\{display:grid;grid-template-columns:280px minmax\(0,\s*1fr\) 340px/,
  "compiled CSS keeps the no-scroll analyst grid"
);
assertContains(css, /\.garden-body--simulation-v2\{overflow:hidden/, "desktop page scrolling is disabled");
assertContains(projects, /href="\/projects\/abu-dhabi-urban-dynamics-v2\/"/, "the urban model is published in the project index");
assert.doesNotMatch(
  projects,
  /href="\/projects\/abu-dhabi-urban-dynamics\/"/,
  "the legacy urban-model card is retired without removing its direct route"
);

assert.equal(baseline.zones.length, 18, "baseline contains 18 Greater Abu Dhabi districts");
for (const id of ["al-mushrif", "al-danah", "al-zahiyah", "al-khalidiyah", "al-bateen", "al-reem", "yas-island", "musaffah"]) {
  assert.ok(
    baseline.zones.some((zone) => zone.id === id),
    `${id} remains a distinct model district`
  );
}
assert.equal(baseline.roadGraph.edges.length, 31, "road graph contains 31 routed corridors");
assert.equal(zones.features.length, 18, "grouped official polygon geometry joins every model district");
assert.equal(roads.features.length, 31, "each model road has actual routed geometry");
assert.equal(stops.features.length, 924, "official transit-stop snapshot is complete");
assert.ok(
  roads.features.every((feature) => feature.geometry.coordinates.length >= 2),
  "all road corridors contain routed coordinates"
);
assert.ok(
  baseline.zones.every((zone) => zone.sourceClassByField),
  "zone inputs expose field-level provenance"
);
assert.match(baseline.calibration.note, /synthetic/i, "calibration limitations are explicit");

assert.match(worker, /class UdesV2Engine/, "worker contains the persistent agent engine");
assert.match(worker, /Happy|Waiting|Extreme|Recovery/, "citizen statechart is implemented");
assert.match(worker, /Working|Grow|Lesser/, "enterprise statechart is implemented");
assert.match(worker, /validateInvariants\(\)/, "engine exposes reciprocal-link validation");
assert.match(worker, /housingCapacityIsSoft: true/, "housing overcrowding is an explicit soft-capacity assumption");
assert.match(worker, /allowCapacityOverflow: true/, "network overflow is modeled as congestion instead of forced walking");
assert.match(worker, /monthlyEssentialConsumptionAed: 2500/, "household essential-consumption assumption is explicit");
assert.match(worker, /positiveResidualSavingsRate: 0\.25/, "positive residual saving rate is explicit");
assert.match(
  worker,
  /representedVacancies: vacancyCount \* this\.config\.citizenWeight/,
  "enterprise inspection serializes only hiring-aware represented vacancies"
);
assert.match(app, /referenceWorker = new WorkerClient/, "controller runs a same-seed reference worker");
assert.match(app, /function renderMobilityCharts\(/, "controller renders the mobility analysis workspace");
assert.match(app, /function horizonEndDay\(/, "controller uses calendar-exact scenario horizons");
assert.match(
  app,
  /occupancyZones = \[\.\.\.normalizedZones\]\.sort\(\(a, b\) => b\.occupancy - a\.occupancy\)\.slice\(0, 12\)/,
  "capacity-pressure chart ranks districts by occupancy instead of rent"
);
assert.match(app, /mountAggregateHistogram\(incomeNode/, "income distributions use every weighted citizen-agent bin");
assert.match(app, /mountAggregateHistogram\(commuteNode/, "commute distributions use every completed commuter-agent bin");
assert.match(app, /inspectionRequestToken/, "late inspection responses cannot overwrite the current agent selection");
assert.match(app, /data-udes-v2-agent-search/, "inspectors support direct typed IDs beyond the sample navigator");
assert.match(app, /\["representedVacancies"\]/, "enterprise inspector reads the hiring-aware vacancy field");
assert.match(app, /statechart\(\["Happy", "Waiting", "Extreme", "Recovery"\]/, "citizen inspector exposes all satisfaction states");
assert.match(app, /name: "Car ownership"/, "mobility analysis distinguishes car ownership from commute mode");
assert.match(app, /function summarizeChart\(/, "rendered charts receive data-derived accessible summaries");
assert.match(app, /root\.dataset\.udesV2Mobile = compact\.matches \? "readonly" : "interactive"/, "compact simulation view is explicitly read-only");
assert.match(app, /setMutationControlsDisabled\(true\)/, "scenario mutation controls are disabled during model initialization");
assert.match(
  app,
  /if \(!state\.worker \|\| !state\.referenceWorker \|\| state\.busy\)/,
  "playback cannot start before initialization or during another model operation"
);
assert.match(app, /let operationFailed = false/, "worker failures are retained as model errors instead of being relabeled ready");
assert.doesNotMatch(app, /normalizeShare/, "controller does not guess whether percentage fields are ratios");
assert.doesNotMatch(app, /emissions/i, "the interface does not claim an unmodeled emissions output");
assert.match(
  validationHarnessBuffer.toString("utf8"),
  /\["car", "pt", "walk"\]\.map\(\(mode\) => Number\(metrics\.modeCountsRepresented\?\.\[mode\]\) \|\| 0\)/,
  "validation conserves commute distributions against completed modes, including weekend snapshots"
);

assert.equal(validation.status, "passed-software-and-plausibility-checks", "full-scale validation report passes");
assert.equal(validation.checkSummary.failed, 0, "full-scale validation report has no failed checks");
assert.equal(validation.sourceScope.citizenAgents, 7291, "validation uses the full weighted citizen model");
assert.equal(validation.sourceScope.enterpriseAgents, 600, "validation uses all enterprise agents");
const expectedValidationScenarioIds = ["reference-1y", "transit-1y", "reference-10y", "transit-10y", "housing-10y", "balanced-10y"];
assert.deepEqual(
  validation.scenarios.map((scenario) => scenario.id),
  expectedValidationScenarioIds,
  "full-scale evidence contains both one-year comparisons and all four ten-year policy packages"
);
for (const scenario of validation.scenarios) {
  assert.equal(scenario.clock.date, scenario.id.endsWith("-1y") ? "2025-01-01" : "2034-01-01", `${scenario.id} reaches its exact calendar horizon`);
  const scenarioCheckIds = new Set(scenario.checks.map((check) => check.id));
  for (const requiredId of [
    "loss-making-firms-broad-distribution-guard",
    "enterprise-median-margin-broad-plausibility-guard",
    "enterprise-severe-distress-below-ten-percent",
  ]) {
    assert.ok(scenarioCheckIds.has(requiredId), `${scenario.id} retains ${requiredId}`);
  }
  assert.equal(
    scenario.metrics.enterprisePortfolio.restartMarginThresholdPercent,
    scenario.resolvedValidationParameters.enterpriseRestartMarginThresholdPercent,
    `${scenario.id} severe-distress evidence uses its configured restart threshold`
  );
}
const validationCrossCheckIds = new Set(validation.crossScenarioChecks.map((check) => check.id));
for (const requiredId of [
  "ten-year-transit-reduces-car-share",
  "ten-year-transit-increases-public-transport-share",
  "ten-year-transit-reduces-car-ownership",
  "ten-year-housing-reduces-occupancy-pressure",
  "ten-year-balanced-reduces-average-commute",
]) {
  assert.ok(validationCrossCheckIds.has(requiredId), `validation retains ${requiredId}`);
}
assert.deepEqual(
  validation.sourceHashes,
  {
    engineSha256: sha256(workerBuffer),
    baselineSha256: sha256(baselineBuffer),
    publicControllerSha256: sha256(appBuffer),
    validationHarnessSha256: sha256(validationHarnessBuffer),
  },
  "committed validation evidence matches the current engine, baseline, public policy controller, and harness"
);
assert.ok(
  validation.scenarios.every((scenario) => scenario.metrics.forcedInterzoneWalkers === 0 && scenario.metrics.unservedCommuters === 0),
  "validated scenarios contain no forced or unserved inter-district trips"
);
assert.ok(
  validation.scenarios.every(
    (scenario) =>
      scenario.metrics.savingsPolicy.monthlyEssentialConsumptionAed === 2500 &&
      scenario.metrics.savingsPolicy.positiveResidualSavingsRate === 0.25 &&
      scenario.metrics.savingsPolicy.negativeResidualDrawdownRate === 1 &&
      Number.isFinite(scenario.metrics.averageMonthlySavingOrDrawdownAed)
  ),
  "validated household finance uses the disclosed savings-stock policy and remains finite"
);

console.log("UDES v2 site contract passed");
