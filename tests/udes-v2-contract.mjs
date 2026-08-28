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
  /District groups derived from official AD-SDI polygons · OSM-routed corridors/,
  "map provenance distinguishes grouped model districts from their official source polygons"
);
assert.equal((html.match(/data-udes-v2-inspector-tab=/g) || []).length, 4, "four object inspectors are available");
assert.equal((html.match(/data-udes-v2-control-tab=/g) || []).length, 4, "four focused control workspaces are available");
for (const name of ["setup", "policy", "model", "evidence"]) {
  assertContains(
    html,
    new RegExp(`id="udes-v2-control-tab-${name}"[^>]+aria-controls="udes-v2-control-panel-${name}"`),
    `${name} control tab identifies its panel`
  );
  assertContains(
    html,
    new RegExp(`id="udes-v2-control-panel-${name}"[^>]+role="tabpanel"[^>]+aria-labelledby="udes-v2-control-tab-${name}"`),
    `${name} control panel identifies its tab`
  );
}
const chartWorkspaceNames = ["outcomes", "districts", "flows", "mobility", "citizens", "enterprises"];
assert.equal((html.match(/data-udes-v2-chart-tab=/g) || []).length, 6, "six decision-oriented analysis workspaces are available");
assert.equal((html.match(/data-udes-v2-chart-panel=/g) || []).length, 6, "six analysis tab panels are available");
for (const name of chartWorkspaceNames) {
  assertContains(
    html,
    new RegExp(`id="udes-v2-chart-tab-${name}"[^>]+aria-controls="udes-v2-chart-panel-${name}"[^>]+data-udes-v2-chart-tab="${name}"`),
    `${name} chart tab identifies its panel`
  );
  assertContains(
    html,
    new RegExp(
      `id="udes-v2-chart-panel-${name}"[^>]+role="tabpanel"[^>]+aria-labelledby="udes-v2-chart-tab-${name}"[^>]+data-udes-v2-chart-panel="${name}"`
    ),
    `${name} chart panel identifies its tab`
  );
  assertContains(html, new RegExp(`data-udes-v2-chart="${name}"`), `${name} chart panel exposes a stable mount`);
}
const flowControls = html.match(/<div[^>]+data-udes-v2-flow-controls[^>]*>[\s\S]*?<\/div>/)?.[0] || "";
assert.ok(flowControls, "cross-district flow controls are rendered beside the analysis tabs");
for (const kind of ["residential", "job", "enterprise", "commute"]) {
  assertContains(flowControls, new RegExp(`<option value="${kind}"`), `${kind} flow analysis is selectable`);
}
for (const days of [1, 7, 30]) {
  assertContains(flowControls, new RegExp(`<option value="${days}"`), `${days}-day flow window is selectable`);
}
assert.equal((html.match(/data-udes-v2-step-days=/g) || []).length, 3, "one-, seven-, and thirty-day step controls are available");
assertContains(html, /Citizen and enterprise objectives/, "citizen and enterprise objectives are documented in the model panel");
assertContains(html, /Essential consumption: AED 2,500\/month/, "household saving assumptions are disclosed beside the controls");
assertContains(
  html,
  /Commutes, network loading, citizen decisions, job matching and enterprise actions run daily/,
  "daily agent cadence is disclosed"
);
assertContains(html, /Apply next day/, "policy changes are staged at a clear daily boundary");
assertContains(html, /12 direct \+ 6 grouped \/ relabeled mappings/, "the evidence panel distinguishes direct and derived SCAD mappings");
assertContains(html, /validation-report\.json/, "the console links to its reproducible full-scale validation report");
assertContains(html, /data-udes-v2-provenance/, "the inspector exposes field provenance");
assert.doesNotMatch(html, /udes-v2-map-placeholder__(?:land|corridors|minor-roads|water-lines)/, "the loading state does not fabricate map geometry");
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
const studyPopulation = baseline.zones.reduce((total, zone) => total + Number(zone.population2024 || 0), 0);
assert.equal(studyPopulation, 1517535, "the focused study-area population matches the mapped 2024 SCAD district table");
assert.equal(baseline.calibration.studyScopePopulation2024, studyPopulation, "the study-scope population is derived from the 18 model zones");
assert.equal(
  baseline.zones.filter((zone) => zone.sourceClassByField.population2024 === "observed").length,
  12,
  "twelve modeled district populations map directly to observed records"
);
assert.equal(
  baseline.zones.filter((zone) => zone.sourceClassByField.population2024 === "derived-from-observed").length,
  6,
  "six modeled district populations are grouped or relabeled from observed records"
);
assert.equal(zones.metadata.sourceClass, "derived", "grouped and simplified district geometry is classified as derived");
assert.ok(
  Object.values(baseline.sources).every((source) => Object.prototype.hasOwnProperty.call(baseline.classifications, source.classification)),
  "every source uses a defined provenance classification"
);
assert.equal(baseline.temporal.simulationStep, "1 calendar day", "the temporal contract is explicitly daily");
assert.equal(baseline.temporal.observedDailyProfiles, false, "the absence of observed day profiles is explicit");
assert.match(baseline.calibration.note, /synthetic/i, "calibration limitations are explicit");

assert.match(worker, /class UdesV2Engine/, "worker contains the persistent agent engine");
assert.match(worker, /Happy|Waiting|Extreme|Recovery/, "citizen statechart is implemented");
assert.match(worker, /Working|Grow|Lesser/, "enterprise statechart is implemented");
assert.match(worker, /validateInvariants\(\)/, "engine exposes reciprocal-link validation");
assert.match(worker, /housingCapacityIsSoft: true/, "housing overcrowding is an explicit soft-capacity assumption");
assert.match(worker, /allowCapacityOverflow: true/, "network overflow is modeled as congestion instead of forced walking");
assert.match(worker, /captureDaily/, "the engine can return one compact observation for each simulated day");
assert.match(worker, /networkAssignmentStatus/, "daily output distinguishes current and retained workday network assignments");
assert.match(worker, /policyScopeZoneId/, "land-use policy can target a named modeled district");
assert.match(worker, /applyExplicitZonePolicies\(/, "heterogeneous district policies survive model resets");
assert.match(worker, /activeEnterpriseSharePercent/, "daily snapshots expose an aggregate enterprise outcome");
assert.match(worker, /monthlyEssentialConsumptionAed: 2500/, "household essential-consumption assumption is explicit");
assert.match(worker, /positiveResidualSavingsRate: 0\.25/, "positive residual saving rate is explicit");
assert.match(
  worker,
  /representedVacancies: vacancyCount \* this\.config\.citizenWeight/,
  "enterprise inspection serializes only hiring-aware represented vacancies"
);
assert.match(app, /referenceWorker = new WorkerClient/, "controller runs a same-seed reference worker");
assert.match(app, /function renderOutcomeCharts\(/, "controller renders focused scenario outcomes");
assert.match(app, /function renderDistrictCharts\(/, "controller renders current and daily district outcomes");
assert.match(app, /function renderFlowCharts\(/, "controller renders cross-district movement outcomes");
assert.match(app, /function renderMobilityCharts\(/, "controller renders the mobility analysis workspace");
assert.match(app, /function renderCitizenCharts\(/, "controller renders citizen finance and state outcomes");
assert.match(app, /function renderEnterpriseCharts\(/, "controller renders enterprise state and viability outcomes");
for (const [kind, keys] of Object.entries({
  districts: ["stocks", "selected"],
  flows: ["routes", "district"],
  citizens: ["finance", "states"],
  enterprises: ["states", "viability"],
})) {
  assert.match(app, new RegExp(`prepareChartPanel\\("${kind}"`), `${kind} charts use their dedicated stable panel`);
  for (const key of keys) assert.match(app, new RegExp(`"${kind}:${key}"`), `${kind}:${key} remains a stable chart key`);
}
assert.match(app, /function districtHistory\(/, "selected districts have a dedicated daily trajectory source");
assert.match(app, /daily district trajectory/, "district analysis labels its daily population, jobs, and rent trajectory");
assert.match(
  app,
  /aggregateFlowRoutes\(state\.history, kind, state\.flowWindowDays, latestDay\)/,
  "flow charts aggregate exact OD rows over the chosen window"
);
assert.match(
  app,
  /flowSeriesForZone\(state\.history, kind, selectedId, state\.flowWindowDays, latestDay\)/,
  "selected districts receive daily in, out, and net movement series"
);
assert.match(app, /origin → destination/, "route charts state their origin-to-destination direction");
assert.match(app, /state\.snapshot\?\.commuteOd/, "flow analysis can inspect the current home-to-work stock separately from relocation events");
assert.match(app, /distributions\?\.financialStatus/, "citizen charts use mutually exclusive financial-status output");
assert.match(app, /no [‘']net zero[’'] bucket/, "financial-status chart explicitly rejects a misleading net-zero bucket");
assert.doesNotMatch(app, /Net-income distribution|agents:income/, "the ambiguous net-income histogram contract has been removed");
assert.match(app, /stack: "citizen-state"/, "citizen Happy, Waiting, Extreme, and Recovery states are charted as a complete stock");
assert.match(app, /stack: "enterprise-state"/, "enterprise Starting, Working, Grow, and Lesser states are charted as a complete stock");
assert.match(app, /captureDaily: true/, "controller requests consecutive daily observations from both workers");
assert.match(app, /const HISTORY_POINT_LIMIT = 3654/, "controller retains Day 0 plus a full ten-year daily run");
assert.match(app, /const FLOW_HISTORY_DETAIL_DAYS = 30/, "high-volume OD rows are retained only for the longest selectable flow window");
assert.match(app, /detailCutoff/, "expired OD and transition detail is compacted while daily aggregate history remains available");
assert.match(app, /normalized\.zoneSeries = \[\]/, "unused reference-run district rows are discarded to keep ten-year daily playback bounded");
assert.match(app, /function filterHistoryWindow\(/, "daily charts support bounded display windows without changing the run");
assert.match(app, /function stagedEnginePatch\(/, "only explicitly changed intervention fields are applied to the live model");
assert.match(app, /inspectionRequestToken/, "late inspection responses cannot overwrite the current agent selection");
assert.match(app, /data-udes-v2-agent-search/, "inspectors support direct typed IDs beyond the sample navigator");
assert.match(app, /\["representedVacancies"\]/, "enterprise inspector reads the hiring-aware vacancy field");
assert.match(app, /statechart\(\s*\["Happy", "Waiting", "Extreme", "Recovery"\]/, "citizen inspector exposes all satisfaction states");
for (const helper of ["decisionSummary", "citizenAccounting", "agentEvents", "eventDescription"]) {
  assert.match(app, new RegExp(`function ${helper}\\(`), `${helper} keeps agent decisions and retained actions inspectable`);
}
assert.match(app, /decisionExplanation/, "agent inspectors consume the worker's explicit goal and current assessment");
assert.match(app, /Cash after housing \+ commute/, "citizen accounting separates salary, housing, commuting, essentials, and savings");
assert.match(app, /Recent actions/, "citizen and enterprise inspectors expose their retained event ledger");
assert.match(app, /event\.fromWorkZoneId/, "citizen job-change events retain their origin work district in the inspector");
assert.match(app, /event\.toWorkZoneId/, "citizen job-change events retain their destination work district in the inspector");
assert.match(app, /const signed = values\.some/, "signed household finance histories cannot render deficits as positive bars");
assert.match(css, /\.udes-v2-agent-history > div\.is-signed/, "signed household histories use a zero-centered visual treatment");
assert.match(app, /function panelIsInteracting\(/, "inspector refreshes detect active hover and keyboard interaction");
assert.match(app, /state\.pendingPanelRenders\.set\(panel, render\)/, "inspector updates queue while the user is interacting");
assert.match(
  app,
  /pointerleave[\s\S]*flushPendingPanelRender\(panel\)[\s\S]*focusout/,
  "queued inspector updates flush after pointer or focus interaction ends"
);
assert.match(app, /state\.pendingChartOptions\.set\(key, option\)/, "chart updates queue while a tooltip interaction is active");
assert.match(
  app,
  /firstRender[\s\S]*?\? \{ notMerge: true, lazyUpdate: true \}[\s\S]*?: \{ notMerge: false, lazyUpdate: true, silent: true, replaceMerge: \["series"\] \}/,
  "normal chart ticks merge into existing instances and replace only series data"
);
assert.match(app, /if \(!series\.id\)\s+series\.id = `\$\{key\}:/, "chart series receive stable IDs before incremental updates");
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
assert.doesNotMatch(
  app,
  /monthlyHiresRepresented|monthlyFiresRepresented|monthlyMovesRepresented/,
  "daily charts do not repeat completed-month event totals"
);
assert.match(
  validationHarnessBuffer.toString("utf8"),
  /\["car", "pt", "walk"\]\.map\(\(mode\) => Number\(metrics\.modeCountsRepresented\?\.\[mode\]\) \|\| 0\)/,
  "validation conserves commute distributions against completed modes, including weekend snapshots"
);

assert.equal(validation.status, "passed-software-and-plausibility-checks", "full-scale validation report passes");
assert.equal(validation.checkSummary.failed, 0, "full-scale validation report has no failed checks");
assert.equal(
  validation.sourceScope.citizenAgents,
  Math.round(studyPopulation / baseline.calibration.citizenAgentPersonsRecommended),
  "validation uses the full weighted citizen model"
);
assert.equal(
  validation.sourceScope.scadMappedDistrictPopulationSubtotal2024,
  studyPopulation,
  "validation reports the current SCAD-mapped district subtotal"
);
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
  "ten-year-balanced-increases-housing-capacity",
  "ten-year-balanced-increases-employment-space-capacity",
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
