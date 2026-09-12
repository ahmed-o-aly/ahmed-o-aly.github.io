import assert from "node:assert/strict";
import crypto from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { readRoute } from "./helpers/site.mjs";
import { validateRoadNetwork } from "../scripts/lib/udes-v2-network-integrity.mjs";
import { assertCurrentPresentationProvenance, VERIFIER_PATH } from "../scripts/refresh-udes-v2-presentation-provenance.mjs";

const require = createRequire(import.meta.url);
const controller = require("../assets/js/udes-v2-app.js");
const { DEFAULT_CONFIG, UdesV2Engine } = require("../assets/js/udes-v2-worker.js");
const read = (path) => readFileSync(new URL("../" + path, import.meta.url));
const json = (path) => JSON.parse(read(path));
const html = readRoute("/projects/abu-dhabi-urban-dynamics-v2/");
const app = read("assets/js/udes-v2-app.js").toString();
const scss = read("_sass/garden/_simulation-v2.scss").toString();
const css = read("_site/assets/css/garden.css").toString();
const baseline = json("assets/data/udes-v2/baseline.json");
const roads = json("assets/data/udes-v2/roads.geojson");
const zones = json("assets/data/udes-v2/zones.geojson");
const stops = json("assets/data/udes-v2/transit-stops.geojson");
const validation = json("assets/data/udes-v2/validation-report.json");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const failures = [];
function section(name, check) {
  try {
    check();
    console.log("PASS " + name);
  } catch (error) {
    failures.push(name + ": " + error.message);
    console.error("FAIL " + name + ": " + error.message);
  }
}
// Parse only opening tags and quoted attributes used by this server-rendered page.
const elements = [...html.matchAll(/<([a-z][\w-]*)\b([^<>]*?)>/gi)].map((match) => {
  const attrs = Object.fromEntries([...match[2].matchAll(/([\w:-]+)(?:\s*=\s*"([^"]*)")?/g)].map((attribute) => [attribute[1], attribute[2] ?? ""]));
  return { tag: match[1].toLowerCase(), attrs };
});
const all = (attribute, value) =>
  elements.filter(({ attrs }) => Object.hasOwn(attrs, attribute) && (value === undefined || attrs[attribute] === value));
function one(attribute, value) {
  const matches = all(attribute, value);
  assert.equal(matches.length, 1, attribute + (value === undefined ? "" : "=" + value) + " has exactly one binding");
  return matches[0];
}
function selectValues(attribute) {
  one(attribute);
  const block = html.match(new RegExp("<select\\b[^>]*" + attribute + "[^>]*>([\\s\\S]*?)</select>"))?.[1];
  assert.ok(block, attribute + " is a native select");
  return [...block.matchAll(/<option\b[^>]*value="([^"]+)"/g)].map((match) => match[1]);
}
function tabs(kind, names) {
  assert.deepEqual(
    all("data-udes-v2-" + kind + "-tab").map(({ attrs }) => attrs["data-udes-v2-" + kind + "-tab"]),
    names
  );
  for (const name of names) {
    const tab = one("data-udes-v2-" + kind + "-tab", name).attrs;
    const panel = one("data-udes-v2-" + kind + "-panel", name).attrs;
    assert.equal(tab.role, "tab");
    assert.equal(panel.role, "tabpanel");
    assert.equal(tab["aria-controls"], panel.id);
    assert.equal(panel["aria-labelledby"], tab.id);
    assert.equal(tab["aria-selected"], String(name === names[0]));
    assert.equal(Object.hasOwn(panel, "hidden"), name !== names[0]);
  }
}

section("published worker and baseline preserve the tested source bytes", () => {
  const root = one("data-udes-v2-root").attrs;
  for (const attribute of ["data-worker-url", "data-model-url"]) {
    const url = root[attribute];
    assert.ok(url?.startsWith("/assets/"), `${attribute} identifies a local model asset`);
    assert.equal(
      sha256(read("_site" + url)),
      sha256(read(url.slice(1))),
      `${url} must be served byte-for-byte as tested; build-time minification would invalidate its recorded fingerprint`
    );
  }
});

section("published page and accessible results navigation", () => {
  assert.equal(elements.filter(({ tag }) => tag === "h1").length, 1);
  const ids = all("id").map(({ attrs }) => attrs.id);
  assert.equal(new Set(ids).size, ids.length, "rendered element IDs are unique");
  const root = one("data-udes-v2-root").attrs;
  assert.equal(root["data-udes-v2-view"], "overview");
  assert.equal(root["data-udes-v2-inspection"], "closed");
  assert.equal(root["data-model-url"], "/assets/data/udes-v2/baseline.json");
  assert.equal(root["data-worker-url"], "/assets/js/udes-v2-worker.js");
  for (const url of [root["data-model-url"], root["data-worker-url"]]) assert.ok(existsSync(new URL("../_site" + url, import.meta.url)));
  assert.doesNotMatch(html, /class="[^"]*udes-v2-map-pulse(?:\s|")/, "map has no duplicate metric overlay");
  const selectedLayers = all("data-udes-v2-map-layer").filter(({ attrs }) => attrs["aria-pressed"] === "true");
  assert.deepEqual(
    selectedLayers.map(({ attrs }) => attrs["data-udes-v2-map-layer"]),
    ["network"]
  );
  assert.match(app, /mapMode:\s*"network"/);
  one("data-udes-v2-action", "close-inspector");
  one("data-udes-v2-view-toggle");
  tabs("control", ["setup", "policy", "model", "evidence"]);
  const resultViews = ["outcomes", "districts", "flows", "mobility", "citizens", "enterprises", "analysis"];
  for (const name of resultViews) one("data-udes-v2-chart", name);
  assert.equal(root["data-udes-v2-analysis"], "closed");
  assert.ok(Object.hasOwn(one("data-udes-v2-tray").attrs, "hidden"), "charts are opt-in, including before JavaScript initializes");
  const openCharts = one("data-udes-v2-action", "open-analysis").attrs;
  assert.equal(openCharts["aria-expanded"], "false");
  assert.equal(openCharts["aria-controls"], one("data-udes-v2-tray").attrs.id);
  one("data-udes-v2-action", "close-analysis");
  assert.equal(one("data-udes-v2-analysis-picker").tag, "select");
  assert.equal(one("data-udes-v2-analysis-picker").attrs["aria-label"], "Choose analysis view");
  assert.equal(all("data-udes-v2-open-chart").length, 7, "six city indicators and the road legend open related analysis views");
  for (const button of all("data-udes-v2-open-chart")) assert.equal(button.tag, "button");
  assert.deepEqual(selectValues("data-udes-v2-window"), ["30", "90", "365", "0"]);
  assert.deepEqual(selectValues("data-udes-v2-transition-window"), ["1", "7", "30"]);
  one("data-udes-v2-analysis-district");
  assert.match(html, /assets\/js\/udes-v2-analysis\.js/, "complete-output chart module is loaded");
  assert.match(app, /state\.analysisCharts\.includes\(`outcomes:\$\{key\}`\)/, "outcome rendering follows the requested dashboard metrics");
  assert.match(app, /state\.analysisCharts\.includes\(`\$\{kind\}:\$\{key\}`\)/, "only the charts requested by the selected view are mounted");
  assert.match(app, /matchMedia\("\(max-width: 719px\)"\)/, "ordinary desktop panes retain simulation controls");
  assert.deepEqual(selectValues("data-udes-v2-flow-kind"), ["residential", "job", "workplace", "enterprise", "replacement", "commute"]);
  assert.deepEqual(
    all("data-udes-v2-step-days").map(({ attrs }) => Number(attrs["data-udes-v2-step-days"])),
    [1, 7, 30]
  );
  assert.ok(
    css.includes(".udes-v2-analysis-controls") && css.includes(".udes-v2-monitor"),
    "compiled CSS contains the chart explorer and metric shortcuts"
  );
  assert.match(scss, /data-udes-v2-inspection="open"[^{}]*\.udes-v2-inspector/);
  assert.match(scss, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(readRoute("/projects/"), /href="\/projects\/abu-dhabi-urban-dynamics\/"/);
});

section("methods, evidence and paired comparison controls", () => {
  const dialog = one("data-udes-v2-methods");
  assert.equal(dialog.tag, "dialog");
  one("id", dialog.attrs["aria-labelledby"]);
  one("data-udes-v2-methods-body");
  assert.ok(all("data-udes-v2-action", "methods").length > 0);
  for (const action of ["close-methods", "export", "export-experiment"]) one("data-udes-v2-action", action);
  assert.match(app, /dialog\.showModal\(\)/);
  assert.match(app, /comparisonToCsv\(state\.history,\s*state\.referenceHistory/);
  assert.match(app, /referenceWorker = new WorkerClient/);
  assert.match(app, /referenceWorker\.request\("init",\s*\{[^\n]*seed:\s*state\.seed[^\n]*mapFrame:\s*"none"/);
  assert.match(app, /state\.worker\.request\("init",\s*\{[^\n]*seed:\s*state\.seed[^\n]*mapFrame:\s*"all"/);
  assert.match(html, /validation-report\.json/);
  assert.equal(typeof controller.comparisonToCsv, "function");
  assert.equal(controller.COMPARISON_METRICS.meanCommute, "round_trip_commute_minutes");
  assert.equal(controller.COMPARISON_METRICS.residualAfterEssentials, "disposable_resources_aed_per_month");
  const csv = controller.comparisonToCsv([{ day: 1, date: "2024-01-02", meanCommute: 30 }], [{ day: 1, date: "2024-01-02", meanCommute: 40 }], {
    seed: 17,
    scenario: "trial, quoted",
  });
  assert.ok(csv.includes("round_trip_commute_minutes") && csv.includes('"trial, quoted"'));
  assert.ok(csv.includes('"30","40","-10"'), "comparison uses aligned active minus reference values");
});

section("observed population mappings and explicit synthetic inputs", () => {
  assert.equal(baseline.zones.length, 18);
  assert.equal(zones.features.length, baseline.zones.length);
  const total = baseline.zones.reduce((sum, zone) => sum + zone.population2024, 0);
  assert.equal(total, 1517535, "committed 2024 SCAD study-boundary total");
  assert.equal(total, baseline.calibration.studyScopePopulation2024);
  assert.equal(total, baseline.calibration.officialMappedDistrictPopulationSubtotal);
  const mapped = { observed: 0, "derived-from-observed": 0 };
  for (const zone of baseline.zones) {
    assert.equal(
      zone.populationComponents.reduce((sum, item) => sum + item.value, 0),
      zone.population2024,
      zone.id + " population has an auditable census crosswalk"
    );
    mapped[zone.sourceClassByField.population2024] += 1;
    for (const field of [
      "jobs2024",
      "housingCapacityPersons",
      "jobCapacityPersons",
      "enterprisePlaceCapacity",
      "quality",
      "housingRentIndex",
      "businessRentIndex",
      "carOwnershipRate",
      "averageMonthlySalaryAed",
    ]) {
      assert.equal(zone.sourceClassByField[field], "synthetic", zone.id + " " + field + " must not appear observed");
    }
    assert.ok(zones.features.some((feature) => feature.id === zone.geometryFeatureId));
  }
  assert.deepEqual(mapped, { observed: 12, "derived-from-observed": 6 });
  assert.deepEqual(
    baseline.zones
      .find((zone) => zone.id === "al-bateen")
      .officialDistrictIds.slice()
      .sort(),
    [1287, 1292, 1300]
  );
  assert.equal(baseline.temporal.observedDailyProfiles, false);
  assert.equal(baseline.temporal.simulationStep, "1 calendar day");
  assert.match(baseline.temporalAlignment, /mixed-year/);
  for (const source of Object.values(baseline.sources)) assert.ok(Object.hasOwn(baseline.classifications, source.classification));
  assert.equal(baseline.calibration.supplyAssumptions.sourceClass, "synthetic");
  assert.equal(baseline.calibration.housingStockReference.usedForCapacity, false, "all-use property-unit counts are not residential capacity");
  assert.ok(baseline.calibration.housingStockReference.tables.length >= 2);
  assert.equal(baseline.calibration.employmentAnchor.modeledOpeningEmploymentPercent, 67);
  assert.equal(baseline.calibration.employmentAnchor.modeledOpeningAndTargetEmploymentPercent, undefined);
  assert.match(baseline.calibration.historicalAllTripModeShareReference.caveat, /contextual comparator only/);
  assert.equal(stops.features.length, baseline.transit.officialStopsAssignedToStudyZones);
  assert.equal(stops.metadata.sourceClass, "observed");
  assert.ok(baseline.transit.links.every((link) => link.serviceSourceClass === "synthetic" && link.topologySourceClass === "derived"));
  assert.match(baseline.transit.caveat, /route and timetable data has not yet been integrated/i);
});

section("frozen source evidence is intact and reproducible", () => {
  const manifest = json("scripts/data/udes-v2-sources/manifest.json");
  assert.equal(manifest.id, baseline.sourceSnapshot.id);
  assert.deepEqual(manifest.requests, baseline.sourceSnapshot.requests);
  assert.ok(manifest.requests.length > 60, "districts, routed directions and evidence tables are frozen");
  for (const entry of manifest.requests) {
    assert.match(entry.file, /^[a-f0-9]{64}\.json\.gz$/);
    const cached = JSON.parse(gunzipSync(read("scripts/data/udes-v2-sources/" + entry.file)));
    assert.equal(sha256(cached.responseText), entry.sha256, entry.file + " response hash");
    assert.equal(cached.sha256, entry.sha256);
    assert.equal(cached.retrievedAt, entry.retrievedAt);
    assert.ok(Number.isFinite(Date.parse(entry.retrievedAt)));
    assert.equal(cached.request.url, entry.url);
    assert.equal(cached.request.method, entry.method);
  }
  assert.ok(
    manifest.requests.some((entry) => entry.method === "POST" && entry.url.includes("census.scad.gov.ae")),
    "published census values have a captured source response"
  );
});

section("shared directed road graph and complete physical rendering", () => {
  const graph = baseline.roadGraph;
  const evidence = validateRoadNetwork(baseline.zones, graph.nodes, graph.edges, graph.candidateRoutes, roads.features);
  assert.equal(evidence.directedDistrictPairs, baseline.zones.length * (baseline.zones.length - 1));
  assert.equal(evidence.stronglyConnectedComponents, 1);
  assert.equal(evidence.danglingNonGatewayNodes, 0);
  assert.deepEqual(evidence.gatewayTerminalNodes, []);
  assert.equal(graph.fallbackRouteCount, 0);
  assert.equal(graph.fallbackArterialSeedCount, 0);
  assert.equal(graph.edges.length, graph.topology.physicalEdgeCount);
  assert.equal(roads.features.length, graph.edges.length);
  assert.equal(graph.topology.visiblePhysicalEdgeCount, graph.edges.length);
  const assigned = graph.edges.filter((edge) => edge.loadBearing);
  const excluded = graph.edges.filter((edge) => !edge.loadBearing);
  assert.equal(assigned.length, graph.topology.loadBearingEdgeCount);
  assert.equal(excluded.length, 0, "every real physical road receives shared directional demand");
  assert.equal(assigned.length, graph.edges.length);
  assert.ok(graph.edges.every((edge) => edge.modelVisible && !edge.contextOnly && !edge.hidden && !edge.hiddenReason));
  assert.equal(
    graph.officialAttributeJoin.laneMatchedEdgeCount,
    graph.edges.filter((edge) => edge.sourceClassByField.lanesPerDirection === "observed").length
  );
  assert.equal(graph.capacityModel.sourceClass, "synthetic");
  assert.equal(graph.capacityModel.assignmentWindowHours, DEFAULT_CONFIG.assignmentPeakHours);
  assert.ok(graph.edges.some((edge) => edge.allowAB && !edge.allowBA));
  assert.ok(graph.edges.some((edge) => edge.allowBA && !edge.allowAB));
  const routeById = new Map(graph.candidateRoutes.map((route) => [route.id, route]));
  for (const route of graph.candidateRoutes) {
    const reciprocal = routeById.get(route.pairedCandidateRouteId);
    assert.equal(reciprocal.from, route.to);
    assert.equal(reciprocal.to, route.from);
    assert.equal(reciprocal.pairedCandidateRouteId, route.id);
  }
  assert.equal(graph.edges.filter(controller.isRenderedAnalysisLink).length, assigned.length, "capacity charts include every real physical road");
  assert.match(app, /filter:\s*\(feature\)\s*=>\s*feature\.properties\?\.modelVisible !== false && feature\.properties\?\.contextOnly !== true/);
  assert.match(app, /UdesRoadFlow\.createLayer\(window\.L\)/);
  assert.equal(one("data-udes-v2-road-flow-toggle").attrs["aria-pressed"], "true");
  const scripts = all("src").map(({ attrs }) => attrs.src);
  const flowIndex = scripts.findIndex((src) => src.includes("udes-v2-road-flow.js"));
  assert.ok(flowIndex >= 0 && flowIndex < scripts.findIndex((src) => src.includes("udes-v2-app.js")), "flow canvas is loaded before its controller");
});

section("public controls and worker outputs share explicit actor and accounting units", () => {
  assert.deepEqual(Object.keys(controller.PUBLIC_PRESETS), ["reference", "transit", "housing", "balanced"]);
  for (const preset of Object.values(controller.PUBLIC_PRESETS)) {
    assert.equal(preset.dailyJobSearchProbability, 0.04);
    assert.equal(preset.targetEmploymentRate, undefined, "scenario choices do not force an employment target");
    assert.ok(Object.values(preset).every(Number.isFinite));
  }
  assert.equal(one("data-udes-v2-lever", "jobSearchProbability").attrs.value, "4");
  assert.equal(all("data-udes-v2-lever", "targetEmploymentRate").length, 0);
  assert.equal(DEFAULT_CONFIG.initialEmploymentRate, 0.67);
  assert.equal(DEFAULT_CONFIG.employmentClosure, "endogenous");
  assert.equal(DEFAULT_CONFIG.dailyJobSearchProbability, 0.04);
  const engine = new UdesV2Engine({
    seed: 240124,
    data: {
      zones: baseline.zones,
      nodes: baseline.roadGraph.nodes,
      links: baseline.roadGraph.edges,
      candidateRoutes: baseline.roadGraph.candidateRoutes,
      turnRestrictions: baseline.roadGraph.turnRestrictions,
      transit: baseline.transit,
      calibration: baseline.calibration,
    },
    config: { ...controller.PUBLIC_PRESETS.reference, startDate: "2024-01-01", citizenCount: 360, enterpriseCount: 36, citizenWeight: 250 },
  });
  engine.step(1);
  assert.deepEqual(engine.validateInvariants(), []);
  const snapshot = engine.snapshot({ mapFrame: "all", historyLimit: 0 });
  assert.equal(snapshot.links.length, baseline.roadGraph.edges.length);
  assert.equal(snapshot.zones.length, baseline.zones.length);
  assert.equal(snapshot.city.representedPopulation, engine.citizens.length * engine.config.citizenWeight);
  assert.equal(snapshot.city.representedEmployed + snapshot.city.representedUnemployed, snapshot.city.representedLaborForce);
  assert.equal(snapshot.city.representedLaborForce + snapshot.city.representedNonparticipants, snapshot.city.representedPopulation);
  assert.equal(snapshot.mapFrame.citizenCount, engine.citizens.length);
  assert.equal(snapshot.mapFrame.enterpriseCount, engine.enterprises.length);
  assert.equal(snapshot.mapFrame.citizens.laborForceStatuses.length, engine.citizens.length);
  assert.deepEqual(snapshot.mapFrame.codes.citizenLaborForceStatuses, ["nonparticipant", "unemployed", "employed"]);
  assert.equal(engine.snapshot({ mapFrame: "none" }).mapFrame, null);
  assert.match(app, /state\.agentCanvas\.setFrame\(state\.snapshot\.mapFrame\)/);
  const citizen = engine.inspect("citizen", engine.citizens[0].id, 3);
  const account = citizen.financialAccount;
  assert.ok(account && citizen.decisionExplanation);
  assert.equal(account.accountingCadence, "daily-accrual-monthly-settlement");
  assert.equal(account.accountingReconciliationDifferenceAed, 0);
  assert.ok(Math.abs(account.totalMobilityCostAed - account.commutingCostAed - account.ownershipCostAed) <= 0.02);
  assert.match(app, /ownershipCostAed/);
  assert.match(app, /Vehicle access/);
  assert.ok(
    snapshot.links.every((link) =>
      [link.loadABVehicles, link.loadBAVehicles, link.capacityVehiclesAB, link.capacityVehiclesBA].every(Number.isFinite)
    ),
    "animation receives directional vehicle demand and capacity"
  );
});

// Exercise browser-bound orchestration with small dependency substitutes. The
// controller functions themselves come from the shipped source, not a copy.
function browserFunction(name, dependencies) {
  const match = new RegExp("\\n  (?:async )?function " + name + "\\(").exec(app);
  assert.ok(match, name + " is defined in the controller");
  const start = match.index + 1;
  const tail = app.slice(start + 1);
  const next = tail.search(/\n  (?:async )?function /);
  const definition = app.slice(start, next < 0 ? undefined : start + 1 + next);
  return Function(...Object.keys(dependencies), '"use strict";\n' + definition + "\nreturn " + name)(...Object.values(dependencies));
}
async function asyncSection(name, check) {
  try {
    await check();
    console.log("PASS " + name);
  } catch (error) {
    failures.push(name + ": " + error.message);
    console.error("FAIL " + name + ": " + error.message);
  }
}

section("dashboard outcomes keep distinct scales and requested mounts", () => {
  const plotted = [];
  const state = { analysisCharts: ["outcomes:occupancy", "outcomes:residual"], compare: true };
  const render = browserFunction("renderOutcomeCharts", {
    state,
    palette: { green: "green", muted: "gray" },
    prepareChartPanel: (_kind, definitions) => definitions.map(([id]) => id),
    chartSource: () => ({
      history: [{ housingOccupancy: 0.85, residualAfterEssentials: -120 }],
      reference: [{ housingOccupancy: 0.8, residualAfterEssentials: 250 }],
      labels: ["1 Jan 24"],
    }),
    baseChartOptions: () => ({ xAxis: {}, yAxis: { axisLabel: {} } }),
    addInterventionMarkers: () => {},
    mountChart: (node, key, option) => plotted.push({ node, key, option }),
  });
  render();
  assert.deepEqual(
    plotted.map((chart) => chart.key),
    ["outcomes:occupancy", "outcomes:residual"]
  );
  assert.deepEqual(
    plotted[0].option.series.map((series) => series.data),
    [[85], [80]]
  );
  assert.deepEqual(
    plotted[1].option.series.map((series) => series.data),
    [[-120], [250]],
    "currency retains signed values rather than percent scaling"
  );
});

section("scope dashboards retain individual charts and render only their requested families", () => {
  const catalog = browserFunction("analysisCatalog", { window: { UdesV2Analysis: require("../assets/js/udes-v2-analysis.js") } })();
  const identities = new Set(catalog.map((entry) => entry.id));
  assert.equal(identities.size, catalog.length);
  const pairs = catalog.filter((entry) => entry.charts);
  assert.equal(pairs.length, 8);
  for (const pair of pairs) {
    assert.ok(pair.charts.length >= 6 && pair.charts.length <= 9);
    assert.equal(new Set(pair.charts).size, pair.charts.length);
    assert.ok(
      pair.charts.every((id) => identities.has(id)),
      `${pair.id} points to available individual charts`
    );
  }
  const calls = [];
  const state = { snapshot: {}, analysisOpen: true, analysisCharts: ["analysis:enterprise-size", "enterprises:states"], analysisNotes: new Map() };
  const noteNode = {};
  const families = ["Outcome", "District", "Flow", "Mobility", "Citizen", "Enterprise"];
  const dependencies = Object.fromEntries(families.map((family) => [`render${family}Charts`, () => calls.push(family)]));
  const render = browserFunction("renderChartPanel", {
    ...dependencies,
    state,
    $: () => noteNode,
    renderDetailedAnalysis: () => calls.push("Detailed"),
  });
  render("workspace");
  assert.deepEqual(calls, ["Detailed", "Enterprise"]);
  calls.length = 0;
  state.analysisOpen = false;
  render("workspace");
  assert.deepEqual(calls, [], "closed views perform no chart rendering");
  const signature = browserFunction("chartDataSignature", {});
  const analysis = require("../assets/js/udes-v2-analysis.js");
  const context = { snapshot: { clock: { day: 1, date: "2024-01-02" }, city: { representedPopulation: 100, carOwnershipRate: 45 } } };
  const withoutReference = analysis.buildOption("outcome-comparison", { ...context, compare: false });
  const missingReference = analysis.buildOption("outcome-comparison", { ...context, compare: true });
  assert.notEqual(
    signature(withoutReference.option),
    signature(missingReference.option),
    "reference availability annotations update even when plotted values are unchanged"
  );
});

await asyncSection("export fingerprint belongs to both running workers and retains exact intervention patches", async () => {
  const workerSource = "// Frozen worker bytes, including UTF-8: أبو ظبي\n";
  const state = { dataset: baseline, seed: 123, horizonDays: 366, busy: false };
  const workers = [],
    requests = [],
    blobs = new Map();
  let fetches = 0;
  let requestedPolicy = { ...controller.PUBLIC_PRESETS.reference, scenario: "reference", policyScopeZoneId: "city" };
  let activePatch = {},
    referencePatch = {};
  let saved;
  const noop = () => {};
  const env = {
    state,
    root: { dataset: { workerUrl: "/engine.js" } },
    window: { location: { href: "https://example.test/" } },
    Blob,
    TextEncoder,
    crypto: crypto.webcrypto,
    URL: {
      createObjectURL(blob) {
        const url = "blob:engine-" + blobs.size;
        blobs.set(url, blob);
        return url;
      },
      revokeObjectURL: noop,
    },
    resolveAsset: (url) => url,
    async fetch() {
      fetches += 1;
      return { ok: true, text: async () => workerSource };
    },
    WorkerClient: class {
      constructor(url) {
        this.url = url;
        workers.push(this);
      }
      terminate() {}
      async request(type, payload) {
        requests.push({ worker: this, type, payload: structuredClone(payload) });
        return { snapshot: { clock: { day: 0 }, city: { actorUnits: { citizen: "weighted resident" } } } };
      }
    },
    renderProgress: noop,
    workerDataset: (data) => data,
    policyFromControls: () => requestedPolicy,
    referencePolicyFromControls: () => ({ ...controller.PUBLIC_PRESETS.reference, scenario: "reference", policyScopeZoneId: "city" }),
    structuralConfig: () => ({ startDate: "2024-01-01" }),
    enginePolicyPatch: (policy) => policy,
    snapshotFrom: (reply) => reply.snapshot,
    modelDay: (snapshot) => snapshot.clock.day,
    seedAppliedZonePolicies: noop,
    recordHistory: (snapshot, target, policy) =>
      target.push({ day: snapshot.clock.day, ...policy, zonePolicyState: [{ id: "al-bateen", housingCapacityMultiplier: 1 }] }),
    clearDraftDirty() {
      state.draftDirty = false;
    },
    renderAll: noop,
    setRuntime: noop,
    announce: noop,
    setMutationControlsDisabled: noop,
    stagedEnginePatch: (_policy, reference) => structuredClone(reference ? referencePatch : activePatch),
    mergeAppliedPolicy: (current, requested) => ({ ...current, ...requested }),
    updateAppliedZonePolicies: noop,
    simulationStartDate: () => new Date("2024-01-01T00:00:00Z"),
    DAY_MS: 86400000,
    interventionDescriptor: (_policy, fields) => ({ scope: requestedPolicy.policyScopeZoneId, fields, label: "Changed " + fields.join(", ") }),
    historyDate: (date) => date.toISOString().slice(0, 10),
    formatLongDate: (date) => date.toISOString(),
    TARGETED_LAND_USE_FIELDS: ["housingCapacityMultiplier", "businessCapacityMultiplier", "placeQuality"],
    stopPlayback: noop,
    clearPendingWork: noop,
    handleError(error) {
      throw error;
    },
    restoreMutationControlAvailability: noop,
    drainPendingWork: noop,
    resolveHistoryPolicy: controller.resolveHistoryPolicy,
    presets: controller.PUBLIC_PRESETS,
    appliedZonePolicyList: () => state.history[0].zonePolicyState,
    COMPARISON_METRICS: controller.COMPARISON_METRICS,
    FLOW_HISTORY_DETAIL_DAYS: 30,
    downloadArtifact(content, extension) {
      assert.equal(extension, "json");
      saved = JSON.parse(content);
    },
  };
  await browserFunction("startWorkers", env)();
  assert.equal(fetches, 1, "load the engine once before creating the pair");
  assert.equal(workers.length, 2);
  assert.equal(workers[0].url, workers[1].url, "both workers execute one frozen Blob URL");
  const frozenSource = await blobs.get(workers[0].url).text();
  assert.equal(frozenSource, workerSource);
  assert.equal(state.engineSha256, sha256(frozenSource), "fingerprint hashes the actual executed bytes");
  assert.deepEqual(
    requests.filter((request) => request.type === "init").map((request) => request.payload.seed),
    [123, 123]
  );
  const initialPolicy = structuredClone(state.history[0]);
  const initialReference = structuredClone(state.referenceHistory[0]);
  state.elapsedDays = 10;
  const apply = browserFunction("applyDraftPolicy", env);
  for (const [zoneId, multiplier] of [
    ["al-bateen", 1.4],
    ["al-danah", 1.8],
  ]) {
    requestedPolicy = {
      ...requestedPolicy,
      scenario: "custom",
      policyScopeZoneId: zoneId,
      housingCapacityMultiplier: multiplier,
      dailyJobSearchProbability: 0.07,
    };
    activePatch = { housingCapacityMultiplier: multiplier, policyScopeZoneId: zoneId, dailyJobSearchProbability: 0.07 };
    referencePatch = { dailyJobSearchProbability: 0.07 };
    state.draftFields = new Set(Object.keys(activePatch).filter((key) => key !== "policyScopeZoneId"));
    state.draftDirty = true;
    await apply();
  }
  assert.equal(state.interventions.length, 1, "same-day display markers may merge");
  assert.equal(state.interventionPatches.length, 2, "distinct same-day configuration operations must not merge");
  assert.deepEqual(
    state.interventionPatches.map((patch) => [patch.sequence, patch.effectiveDay]),
    [
      [1, 11],
      [2, 11],
    ]
  );
  const configured = requests.filter((request) => request.type === "configure");
  for (const [index, patch] of state.interventionPatches.entries()) {
    assert.deepEqual(patch.activePatch, configured[index * 2].payload.patch);
    assert.deepEqual(patch.referencePatch, configured[index * 2 + 1].payload.patch);
  }
  // A deployment after initialization must not replace the identity of this run.
  env.fetch = async () => {
    throw new Error("Export must not download a different engine");
  };
  const exportExperiment = browserFunction("exportExperiment", env);
  await exportExperiment();
  assert.equal(saved.model.engineSha256, sha256(workerSource));
  assert.equal(saved.model.baselineSha256, sha256(JSON.stringify(baseline)));
  assert.deepEqual(saved.initialPolicy, controller.resolveHistoryPolicy(initialPolicy, controller.PUBLIC_PRESETS.reference));
  assert.deepEqual(saved.initialReferencePolicy, controller.resolveHistoryPolicy(initialReference, controller.PUBLIC_PRESETS.reference));
  assert.deepEqual(saved.initialZonePolicies, initialPolicy.zonePolicyState);
  assert.ok(saved.interventionPatches.every((patch) => patch.status === "pending"));
  state.elapsedDays = 11;
  await exportExperiment();
  assert.ok(saved.interventionPatches.every((patch) => patch.status === "effective"));
  assert.equal(fetches, 1);
});

section("negative margins and financial units survive presentation", () => {
  const charts = new Map();
  const noop = () => {};
  const history = [
    {
      enterprisePortfolioMargin: -0.173,
      activeEnterpriseShare: 0.9,
      lossMakingEnterpriseShare: 0.55,
      enterpriseStates: {},
      transitions: {},
      firmMoves: 0,
      firmRestarts: 0,
    },
  ];
  browserFunction("renderEnterpriseCharts", {
    prepareChartPanel: () => ["states", "viability"],
    chartSource: () => ({ history, labels: ["1 Jan"] }),
    baseChartOptions: () => ({ grid: {}, xAxis: {}, yAxis: { axisLabel: {} } }),
    palette: {},
    formatCompact: String,
    addInterventionMarkers: noop,
    mountChart: (_node, key, option) => charts.set(key, option),
  })();
  const viability = charts.get("enterprises:viability");
  assert.ok(viability.yAxis[0].min <= -17.3, "a negative operating margin stays within the visible axis");
  assert.ok(Math.abs(viability.series.find((series) => series.name === "Portfolio margin").data[0] + 17.3) < 1e-9);
  const column = controller.HISTORY_CSV_HEADERS.indexOf("daily_job_search_probability");
  assert.ok(column >= 0);
  assert.equal(controller.historyEntryCsvRow({ dailyJobSearchProbability: 0.07 })[column], 0.07);
  assert.ok(!controller.HISTORY_CSV_HEADERS.includes("target_employment_rate"));
  assert.match(app, /Per represented resident · account at/, "weighted actor counts do not turn personal AED budgets into cohort totals");
});

section("validation separates software invariants from model diagnostics", () => {
  assert.equal(validation.status, "passed-structural-checks", "regenerate the structural validation report after the model/controller freeze");
  assert.equal(validation.empiricalValidation.status, "not-performed");
  assert.equal(validation.empiricalValidation.fittedBehavioralParameters, false);
  assert.equal(validation.empiricalValidation.heldOutPredictionTest, false);
  const required = [
    "no-invariant-violations",
    "resident-account-components-reconcile",
    "population-conserved",
    "labor-force-stocks-reconcile",
    "mode-shares-close",
    "physical-roads-carry-assigned-load",
  ];
  assert.deepEqual(
    validation.scenarios.map((scenario) => scenario.id),
    ["reference-1y", "transit-1y", "reference-10y", "transit-10y", "housing-10y", "balanced-10y"]
  );
  for (const scenario of validation.scenarios) {
    assert.equal(scenario.status, "passed");
    assert.equal(scenario.invariants.issueCount, 0);
    assert.equal(scenario.resolvedScope.roadGraphEdges, baseline.roadGraph.edges.length);
    assert.equal(scenario.resolvedScope.zones, baseline.zones.length);
    assert.equal(scenario.resolvedValidationParameters.employmentClosure, "endogenous");
    assert.equal(scenario.resolvedValidationParameters.initialEmploymentRatePercent, 67);
    assert.ok(scenario.requestedDays === (scenario.id.endsWith("1y") ? 366 : 3653));
    const checkIds = new Set(scenario.checks.map((check) => check.id));
    assert.equal(checkIds.size, scenario.checks.length);
    for (const id of required) assert.ok(checkIds.has(id), scenario.id + " missing " + id);
    assert.ok(scenario.diagnostics.length > 0);
    for (const diagnostic of scenario.diagnostics) {
      assert.ok(!checkIds.has(diagnostic.id), "diagnostic is not an acceptance check");
      assert.equal(diagnostic.passed, undefined);
      assert.equal(typeof diagnostic.withinReviewBand, "boolean");
      assert.equal(diagnostic.status, diagnostic.withinReviewBand ? "within-review-band" : "review-needed");
    }
  }
  assert.ok(validation.crossScenarioDiagnostics.length > 0);
  for (const diagnostic of validation.crossScenarioDiagnostics) {
    assert.equal(diagnostic.passed, undefined);
    assert.equal(typeof diagnostic.expectedDirection, "boolean");
  }
  const checks = [...validation.scenarios.flatMap((scenario) => scenario.checks), ...validation.crossScenarioChecks];
  const diagnostics = [...validation.scenarios.flatMap((scenario) => scenario.diagnostics), ...validation.crossScenarioDiagnostics];
  assert.ok(checks.every((check) => check.passed === true));
  assert.deepEqual(validation.checkSummary, { passed: checks.length, failed: 0, total: checks.length });
  assert.equal(validation.diagnosticSummary.total, diagnostics.length);
  assert.equal(validation.diagnosticSummary.reviewNeeded, diagnostics.filter((diagnostic) => diagnostic.status === "review-needed").length);
  assert.equal(validation.sourceScope.scadMappedDistrictPopulationSubtotal2024, baseline.calibration.studyScopePopulation2024);
});

// Read the harness's declared dependencies without importing its executable
// simulation. New hash dependencies cannot silently fall outside this check.
function declaredSourceHashes(harnessPath) {
  const source = read(harnessPath).toString();
  const declaration = source.match(/const (?:SOURCE_PATHS|sourcePaths) = \{([\s\S]*?)\n\};/);
  assert.ok(declaration, harnessPath + " declares its evidence dependencies");
  return Object.fromEntries(
    declaration[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const entry = line.match(/^(\w+):\s*(.+),$/);
        assert.ok(entry, "Unsupported source dependency declaration: " + line);
        const [, key, expression] = entry;
        let file;
        if (expression === "fileURLToPath(import.meta.url)") file = fileURLToPath(new URL("../" + harnessPath, import.meta.url));
        else {
          const joined = expression.match(/^path\.join\(ROOT,\s*(.+)\)$/);
          assert.ok(joined, "Unsupported dependency path: " + expression);
          const components = JSON.parse("[" + joined[1] + "]");
          assert.ok(components.every((part) => typeof part === "string"));
          file = path.join(fileURLToPath(new URL("../", import.meta.url)), ...components);
        }
        return [key, sha256(readFileSync(file))];
      })
  );
}

section("uncertainty artifact reconciles paired runs, observations and descriptive statistics", () => {
  const report = json("assets/data/udes-v2/uncertainty-report.json");
  const near = (actual, expected, label) => {
    assert.ok(Number.isFinite(actual) && Number.isFinite(expected), label + " must be finite");
    assert.ok(Math.abs(actual - expected) <= 1e-10 * Math.max(1, Math.abs(expected)), label + " does not reconcile");
  };
  assertCurrentPresentationProvenance(
    report,
    declaredSourceHashes("scripts/validate-udes-v2-uncertainty.mjs"),
    controller,
    sha256(read(VERIFIER_PATH))
  );
  for (const [key, value] of Object.entries(report.sourceHashes)) {
    assert.match(report.executionSourceHashesAtStart[key], /^[a-f0-9]{64}$/);
    if (key !== "publicControllerSha256") assert.equal(report.executionSourceHashesAtStart[key], value, key + " remained unchanged during execution");
  }
  assert.equal(report.controllerCompatibility.status, "identical-simulation-inputs");
  assert.equal(
    report.controllerCompatibility.controllerChangedDuringRun,
    report.executionSourceHashesAtStart.publicControllerSha256 !== report.sourceHashes.publicControllerSha256
  );
  assert.equal(report.status, "passed-structural-checks");
  assert.equal(report.empiricalValidation.status, "not-performed");
  assert.equal(report.empiricalValidation.predictiveIntervalsAvailable, false);
  assert.equal(report.empiricalValidation.fittedBehavioralParameters, false);
  const { seeds, startDate, horizonMonths, simulatedDays, observationDays } = report.design;
  assert.ok(seeds.length >= 2 && seeds.every((seed) => Number.isSafeInteger(seed) && seed > 0));
  assert.equal(new Set(seeds).size, seeds.length, "independent replications use distinct seeds");
  assert.deepEqual(
    report.seedPairs.map((pair) => pair.seed),
    seeds
  );
  assert.ok(Number.isInteger(horizonMonths) && horizonMonths >= 1 && horizonMonths <= 120);
  assert.equal(startDate, baseline.calibration.baseDate || "2024-01-01");
  const start = new Date(startDate + "T00:00:00Z");
  assert.equal(simulatedDays, controller.horizonEndDayFrom(start, horizonMonths));
  assert.deepEqual(report.controllerCompatibility.checkedCalendarQueries, [{ startDate, months: horizonMonths, days: simulatedDays }]);
  const finalDate = controller.addUtcCalendarMonths(start, horizonMonths).toISOString().slice(0, 10);
  assert.ok(Number.isInteger(observationDays) && observationDays > 0 && observationDays <= simulatedDays);
  let expectedWorkdays = 0;
  for (let day = simulatedDays - observationDays + 1; day <= simulatedDays; day += 1) {
    if (DEFAULT_CONFIG.workdays.includes(new Date(start.valueOf() + day * 86400000).getUTCDay())) expectedWorkdays += 1;
  }
  const metricKeys = Object.keys(report.metricUnits);
  assert.ok(metricKeys.length > 0);
  assert.deepEqual(Object.keys(report.seedSummary), metricKeys);
  assert.deepEqual(Object.keys(report.pairedDifferenceUnits), metricKeys);
  for (const key of metricKeys) {
    assert.equal(typeof report.metricUnits[key], "string");
    assert.equal(typeof report.pairedDifferenceUnits[key], "string");
    if (report.metricUnits[key].startsWith("percent")) assert.ok(report.pairedDifferenceUnits[key].startsWith("percentage points"));
  }
  const pairs = [...report.seedPairs, ...report.sensitivityPairs];
  assert.equal(new Set(pairs.map((pair) => pair.id + ":" + pair.seed)).size, pairs.length, "no duplicated experiment/seed pairs");
  const runs = pairs.flatMap((pair) => [pair.reference, pair.intervention]);
  assert.deepEqual(report.checkSummary, { passed: runs.length, failed: 0, total: runs.length });
  for (const pair of pairs) {
    assert.equal(pair.reference.seed, pair.seed);
    assert.equal(pair.intervention.seed, pair.seed);
    assert.deepEqual(pair.reference.assumptionPatch, pair.assumptionPatch);
    assert.deepEqual(pair.intervention.assumptionPatch, pair.assumptionPatch);
    assert.deepEqual(Object.keys(pair.delta), metricKeys);
    for (const key of metricKeys) near(pair.delta[key], pair.intervention.metrics[key] - pair.reference.metrics[key], pair.id + " paired " + key);
  }
  for (const run of runs) {
    assert.equal(run.status, "passed-structural-checks");
    assert.deepEqual(run.invariantIssues, []);
    for (const key of [
      "invariants",
      "finiteMetrics",
      "populationConserved",
      "laborStocksReconcile",
      "employmentFeasible",
      "vehicleAccessStockReconciles",
      "observedWorkdays",
    ]) {
      assert.equal(run.checks[key], true, run.id + " structural " + key);
    }
    assert.ok(Object.values(run.checks).every((value) => value === true));
    assert.equal(run.finalDate, finalDate, run.id + " reaches the declared calendar horizon");
    assert.deepEqual(Object.keys(run.metrics), metricKeys);
    assert.ok(Object.values(run.metrics).every(Number.isFinite));
    assert.equal(run.scope.employmentClosure, "endogenous");
    assert.equal(
      run.scope.residentCohorts,
      validation.sourceScope.citizenAgents,
      "uncertainty uses the same full resident scale as structural validation"
    );
    assert.equal(run.scope.residentWeight, validation.sourceScope.citizenWeightPersons);
    assert.equal(run.scope.employerCohorts, validation.sourceScope.enterpriseAgents);
    assert.equal(run.scope.representedPopulation, run.scope.residentCohorts * run.scope.residentWeight);
    const observed = run.observations;
    assert.ok(Object.values(observed).every((value) => Number.isFinite(value) && value >= 0));
    assert.equal(observed.workdays, expectedWorkdays);
    assert.ok(observed.completed > 0);
    assert.ok(observed.car + observed.transit <= observed.completed);
    near(run.metrics.carSharePercent, (100 * observed.car) / observed.completed, "pooled car share");
    near(run.metrics.transitSharePercent, (100 * observed.transit) / observed.completed, "pooled transit share");
    near(run.metrics.unservedSharePercent, (100 * observed.unserved) / (observed.completed + observed.unserved), "attempted-trip denominator");
    near(run.metrics.meanRoundTripMinutes, observed.roundTripMinutes / observed.completed, "pooled commute time");
    near(run.metrics.meanWorkdayVehicleKm, observed.vehicleKm / observed.workdays, "workday vehicle-km");
    assert.equal(
      run.resultDigestSha256,
      sha256(JSON.stringify({ metrics: run.metrics, observations: run.observations, invariantIssues: run.invariantIssues }))
    );
    const basis = run.financialObservationBasis;
    assert.ok(basis, "each current-cohort snapshot discloses settled and opening account counts");
    for (const key of [
      "closedAccountCohorts",
      "openingEstimateCohorts",
      "closedAccountRepresentedResidents",
      "openingEstimateRepresentedResidents",
    ]) {
      assert.ok(Number.isInteger(basis[key]) && basis[key] >= 0, key + " is a nonnegative count");
    }
    assert.equal(basis.closedAccountCohorts + basis.openingEstimateCohorts, run.scope.residentCohorts);
    assert.equal(basis.closedAccountRepresentedResidents + basis.openingEstimateRepresentedResidents, run.scope.representedPopulation);
    assert.equal(basis.closedAccountRepresentedResidents, basis.closedAccountCohorts * run.scope.residentWeight);
    assert.equal(basis.openingEstimateRepresentedResidents, basis.openingEstimateCohorts * run.scope.residentWeight);
    assert.ok(basis.classificationRule.includes("lastAccountedDays") && basis.interpretation.includes("opening"));
  }
  assert.match(report.design.financialObservation, /opening budget estimates/);
  assert.match(report.metricUnits.averageMonthlyNetResourcesAed, /opening estimates/);
  for (const key of metricKeys) {
    const summary = report.seedSummary[key];
    const values = report.seedPairs.map((pair) => pair.delta[key]);
    const mean = values.reduce((total, value) => total + value, 0) / values.length;
    const standardDeviation = Math.sqrt(values.reduce((total, value) => total + (value - mean) ** 2, 0) / (values.length - 1));
    assert.equal(summary.count, seeds.length);
    near(summary.mean, mean, key + " mean");
    near(summary.minimum, Math.min(...values), key + " minimum");
    near(summary.maximum, Math.max(...values), key + " maximum");
    near(summary.sampleStandardDeviation, standardDeviation, key + " sample SD");
    assert.equal(summary.positiveCount, values.filter((value) => value > 1e-9).length);
    assert.equal(summary.negativeCount, values.filter((value) => value < -1e-9).length);
    assert.equal(summary.zeroCount, values.filter((value) => Math.abs(value) <= 1e-9).length);
    assert.equal(summary.positiveCount + summary.negativeCount + summary.zeroCount, summary.count);
  }
  for (const pair of report.sensitivityPairs) {
    const referencePair = report.seedPairs.find((candidate) => candidate.seed === pair.seed);
    assert.ok(referencePair, "sensitivity contrasts have a same-seed baseline");
    assert.ok(Number.isFinite(pair.baseValue) && Number.isFinite(pair.alternativeValue));
    assert.deepEqual(pair.assumptionPatch, { [pair.parameter]: pair.alternativeValue });
    for (const key of metricKeys)
      near(pair.deltaChangeFromSameSeedBaseline[key], pair.delta[key] - referencePair.delta[key], key + " sensitivity contrast");
    const reversals = metricKeys.filter(
      (key) =>
        Math.abs(referencePair.delta[key]) > 1e-9 &&
        Math.abs(pair.delta[key]) > 1e-9 &&
        Math.sign(referencePair.delta[key]) !== Math.sign(pair.delta[key])
    );
    assert.deepEqual(pair.directionReversals, reversals, "reported reversals are descriptive, never a preferred policy-direction requirement");
  }
});

section("validation artifacts preserve execution identity and verify current presentation", () => {
  assertCurrentPresentationProvenance(validation, declaredSourceHashes("scripts/validate-udes-v2-full.mjs"), controller, sha256(read(VERIFIER_PATH)));
});

if (failures.length) {
  process.exitCode = 1;
  console.error("UDES v2 contract: " + failures.length + " section(s) failed.\n" + failures.join("\n"));
} else {
  console.log("UDES v2 contract: interface bindings, provenance, physical topology, runtime accounting and validation evidence passed.");
}
