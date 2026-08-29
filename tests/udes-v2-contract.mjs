import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const html = readRoute("/projects/abu-dhabi-urban-dynamics-v2/");
const projects = readRoute("/projects/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const scss = readFileSync(new URL("../_sass/garden/_simulation-v2.scss", import.meta.url), "utf8");
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
assertContains(
  html,
  /class="udes-v2-back" href="\/projects\/abu-dhabi-urban-dynamics\/" aria-label="Back to the project write-up"/,
  "v2 links back to its readable project note"
);
assertContains(html, /data-model-url="\/assets\/data\/udes-v2\/baseline\.json"/, "v2 emits the scenario baseline URL");
assertContains(html, /data-worker-url="\/assets\/js\/udes-v2-worker\.js"/, "v2 emits its agent worker URL");
assertContains(html, /aria-label="Interactive map of Greater Abu Dhabi City/, "map has the correct city boundary description");
assertContains(
  html,
  /Official AD-SDI district groups · OSM basemap and routed named arterials/,
  "map provenance distinguishes official district groups and the routed named-arterial model layer"
);
assertContains(
  html,
  /data-udes-v2-map-layer="agents"[^>]*aria-pressed="true"[^>]*>Agents \+ flows</,
  "the default map exposes actual agents and commute flows"
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
for (const kind of ["residential", "job", "workplace", "enterprise", "replacement", "commute"]) {
  assertContains(flowControls, new RegExp(`<option value="${kind}"`), `${kind} flow analysis is selectable`);
}
assert.equal((flowControls.match(/<option value="commute"/g) || []).length, 1, "home-to-work stock appears once in the flow selector");
assertContains(flowControls, /data-udes-v2-flow-measure/, "flow charts can switch between modeled agents and represented equivalents");
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
for (const lever of ["transitWait", "parkingCost", "householdMoveChance", "householdMinimumStay", "firmMoveChance", "firmMinimumStay"]) {
  assertContains(html, new RegExp(`data-udes-v2-lever="${lever}"`), `${lever} is exposed as a transparent scenario or model control`);
}
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
assertContains(projects, /href="\/projects\/abu-dhabi-urban-dynamics\/"/, "the Urban Dynamics write-up is published in the project index");
assert.doesNotMatch(
  projects,
  /href="\/projects\/abu-dhabi-urban-dynamics-v2\/"/,
  "the project index does not drop readers directly into the console"
);

assert.equal(baseline.zones.length, 18, "baseline contains 18 Greater Abu Dhabi districts");
for (const id of ["al-mushrif", "al-danah", "al-zahiyah", "al-khalidiyah", "al-bateen", "al-reem", "yas-island", "musaffah"]) {
  assert.ok(
    baseline.zones.some((zone) => zone.id === id),
    `${id} remains a distinct model district`
  );
}
const roadNodes = baseline.roadGraph.nodes;
const roadEdges = baseline.roadGraph.edges;
const assignmentRoadEdges = roadEdges.filter((edge) => edge.loadBearing);
const modelVisibleRoadEdges = roadEdges.filter((edge) => edge.modelVisible);
const midRouteConnectors = roadEdges.filter((edge) => edge.loadBearing && !edge.modelVisible);
const contextRoadEdges = roadEdges.filter((edge) => edge.contextOnly);
const hiddenAccessEdges = roadEdges.filter((edge) => edge.hidden);
const aggregatedZonePortals = roadEdges.filter((edge) => edge.hiddenReason === "aggregated-zone-portal");
const roadNodeIds = new Set(roadNodes.map((node) => node.id));
const roadEdgeIds = new Set(roadEdges.map((edge) => edge.id));
const roadFeatureIds = new Set(roads.features.map((feature) => String(feature.id || feature.properties?.id)));
assert.equal(roadNodeIds.size, roadNodes.length, "physical road-node IDs are unique");
assert.equal(roadEdgeIds.size, roadEdges.length, "physical road-edge IDs are unique");
assert.ok(roadNodes.length > baseline.zones.length, "the road graph contains physical junction nodes rather than one node per district");
assert.ok(roadEdges.length > 31, "the road graph replaces 31 cosmetic routes with shared physical edges");
assert.ok(assignmentRoadEdges.length > 100, "physical assignment retains a useful load-bearing segment network");
assert.ok(modelVisibleRoadEdges.length > 100, "the public overlay retains a useful named arterial and gateway network");
assert.ok(midRouteConnectors.length > 0, "unnamed mid-route OSM connectors remain load-bearing even when omitted from the public overlay");
assert.ok(contextRoadEdges.length > 0, "named roads outside OD paths remain available as explicit map context");
assert.ok(hiddenAccessEdges.length > 0, "zone access is explicit in the graph without being presented as a physical arterial");
assert.ok(aggregatedZonePortals.length > 0, "shared centroid terminal chains are identified as aggregate-zone portals");
assert.equal(zones.features.length, 18, "grouped official polygon geometry joins every model district");
assert.equal(roads.features.length, modelVisibleRoadEdges.length, "each model-visible physical road edge has one GeoJSON feature");
assert.deepEqual(
  [...roadFeatureIds].sort(),
  modelVisibleRoadEdges.map((edge) => String(edge.geometryFeatureId)).sort(),
  "model-visible physical edge IDs match the published GeoJSON IDs exactly"
);
assert.ok(
  midRouteConnectors.every(
    (edge) => !edge.hidden && edge.displayClass === "connector" && edge.modelRole === "mid-route-connector" && edge.geometryFeatureId === null
  ),
  "non-rendered mid-route connectors remain explicit physical assignment edges"
);
assert.ok(
  hiddenAccessEdges.every(
    (edge) => !edge.loadBearing && !edge.modelVisible && !edge.contextOnly && edge.geometryFeatureId === null && edge.displayClass === "access"
  ),
  "non-load-bearing access edges are explicitly distinguished from published and assigned road geometry"
);
for (const [zoneId, minimumPortalEdges] of [
  ["rabdan-al-maqta", 7],
  ["musaffah", 3],
]) {
  const zonePortals = aggregatedZonePortals.filter((edge) => edge.aggregatedZonePortalFor === zoneId);
  assert.ok(
    zonePortals.length >= minimumPortalEdges,
    `${zoneId} centroid-terminal artifacts are classified by semantic zone identity instead of unstable edge IDs`
  );
  assert.ok(
    zonePortals.every(
      (edge) =>
        edge.hidden &&
        !edge.loadBearing &&
        !edge.modelVisible &&
        !edge.contextOnly &&
        edge.modelRole === "zone-access" &&
        edge.displayClass === "access" &&
        edge.geometryFeatureId === null &&
        edge.aggregatedZonePortalEvidence?.zoneId === zoneId &&
        edge.aggregatedZonePortalEvidence?.candidateRouteCount > 1 &&
        edge.aggregatedZonePortalEvidence?.sourceClass === "derived"
    ),
    `${zoneId} aggregate-zone portals are excluded from assignment and publication with auditable evidence`
  );
}
assert.ok(
  contextRoadEdges.every((edge) => edge.modelVisible && !edge.hidden && !edge.loadBearing && edge.geometryFeatureId === edge.id),
  "context-only named roads are rendered but cannot receive OD demand or enter V/C metrics"
);
assert.equal(stops.features.length, 924, "official transit-stop snapshot is complete");
assert.ok(
  roads.features.every((feature) => feature.geometry.coordinates.length >= 2),
  "all physical road segments contain routed coordinates"
);
assert.ok(
  roadEdges.every((edge) => edge.from !== edge.to && roadNodeIds.has(String(edge.from)) && roadNodeIds.has(String(edge.to))),
  "every physical edge has two distinct endpoints that exist in the road-node table"
);
const roadNodeById = new Map(roadNodes.map((node) => [String(node.id), node]));
assert.ok(
  roadEdges.every((edge) => {
    const coordinates = edge.geometry?.coordinates || [];
    const fromCoord = roadNodeById.get(String(edge.from))?.coord;
    const toCoord = roadNodeById.get(String(edge.to))?.coord;
    return (
      coordinates.length >= 2 &&
      coordinates[0].every((value, index) => Math.abs(value - fromCoord[index]) <= 1e-6) &&
      coordinates.at(-1).every((value, index) => Math.abs(value - toCoord[index]) <= 1e-6)
    );
  }),
  "every edge geometry begins and ends at its declared physical graph nodes"
);
const physicalEdgesByNodePair = new Map();
for (const edge of roadEdges) {
  const key = [String(edge.from), String(edge.to)].sort().join("|");
  const parallelEdges = physicalEdgesByNodePair.get(key) || [];
  assert.ok(
    parallelEdges.every((parallel) => !parallel.loadBearing && !edge.loadBearing && parallel.hidden && edge.hidden),
    `${edge.id} does not create parallel assignment capacity between ${edge.from} and ${edge.to}`
  );
  parallelEdges.push(edge);
  physicalEdgesByNodePair.set(key, parallelEdges);
}
const atomicGeometryOwners = new Map();
for (const edge of roadEdges) {
  const coordinates = edge.geometry.coordinates;
  for (let index = 1; index < coordinates.length; index += 1) {
    const first = coordinates[index - 1].map((value) => Number(value).toFixed(6)).join(",");
    const second = coordinates[index].map((value) => Number(value).toFixed(6)).join(",");
    if (first === second) continue;
    const key = [first, second].sort().join("|");
    const previousOwner = atomicGeometryOwners.get(key);
    assert.ok(!previousOwner || previousOwner === edge.id, `${edge.id} does not duplicate a physical coordinate segment owned by ${previousOwner}`);
    atomicGeometryOwners.set(key, edge.id);
  }
}
assert.ok(
  roads.features.every(
    (feature) =>
      roadNodeIds.has(String(feature.properties.fromNodeId)) &&
      roadNodeIds.has(String(feature.properties.toNodeId)) &&
      feature.properties.modelVisible === true &&
      feature.properties.loadBearing === !feature.properties.contextOnly &&
      feature.properties.capacityDirection === "per direction"
  ),
  "published roads distinguish assignment edges from context-only roads and label capacity as directional"
);
assert.ok(
  roadEdges.every(
    (edge) =>
      edge.directionEvidence &&
      edge.capacityDirection === "per direction" &&
      (edge.allowAB ? edge.capacityVehPerHourAB > 0 : edge.capacityVehPerHourAB === 0) &&
      (edge.allowBA ? edge.capacityVehPerHourBA > 0 : edge.capacityVehPerHourBA === 0)
  ),
  "each physical edge has auditable direction evidence and capacity only in permitted directions"
);
assert.ok(
  modelVisibleRoadEdges.some((edge) => edge.officialMainRoadMatch),
  "the visible road network retains strict AD-SDI main-road reference matches where available"
);
assert.ok(
  roadEdges.some((edge) => Array.isArray(edge.candidateRouteIds) && edge.candidateRouteIds.length > 1),
  "the graph records physical edges shared by multiple candidate district routes"
);
function edgeAllowsDirection(edge, direction) {
  const oneWay = String(edge.oneway ?? edge.oneWay ?? "").toLowerCase();
  let allowAB = edge.allowAB !== false;
  let allowBA = edge.allowBA !== false && edge.bidirectional !== false;
  if (["-1", "reverse", "backward"].includes(oneWay)) {
    allowAB = false;
    allowBA = true;
  } else if (["1", "yes", "true", "forward"].includes(oneWay)) {
    allowAB = true;
    allowBA = false;
  }
  return Number(direction) === 1 ? allowAB : allowBA;
}
assert.ok(
  assignmentRoadEdges.some((edge) => edgeAllowsDirection(edge, 1) !== edgeAllowsDirection(edge, -1)),
  "the physical baseline retains observed one-way traversal instead of forcing every road bidirectional"
);
const roadEdgeById = new Map(roadEdges.map((edge) => [String(edge.id), edge]));
assert.ok(
  baseline.roadGraph.candidateRoutes.every(
    (route) =>
      route.fromNodeId &&
      route.toNodeId &&
      route.traversals.length > 0 &&
      route.traversals.every((step) => {
        const edge = roadEdgeById.get(String(step.edgeId));
        return edge && [1, -1].includes(Number(step.direction)) && edgeAllowsDirection(edge, step.direction);
      })
  ),
  "every candidate route is an auditable, directionally legal traversal of physical edge IDs"
);
const candidateById = new Map(baseline.roadGraph.candidateRoutes.map((route) => [String(route.id), route]));
assert.ok(
  baseline.roadGraph.candidateRoutes.every((route) => {
    const paired = candidateById.get(String(route.pairedCandidateRouteId));
    return (
      route.bidirectional === false &&
      paired &&
      paired.from === route.to &&
      paired.to === route.from &&
      paired.directionalPairId === route.directionalPairId &&
      paired.pairedCandidateRouteId === route.id
    );
  }),
  "every one-way district candidate identifies a separately routed reciprocal candidate"
);
for (const route of baseline.roadGraph.candidateRoutes) {
  let cursor = String(route.fromNodeId);
  for (const traversal of route.traversals) {
    const edge = roadEdgeById.get(String(traversal.edgeId));
    assert.ok(edge.candidateRouteIds.includes(String(route.id)), `${traversal.edgeId} retains ${route.id} in its route-membership audit field`);
    const traversalFrom = Number(traversal.direction) === 1 ? String(edge.from) : String(edge.to);
    const traversalTo = Number(traversal.direction) === 1 ? String(edge.to) : String(edge.from);
    assert.equal(traversalFrom, cursor, `${route.id} traversal is continuous at ${traversal.edgeId}`);
    cursor = traversalTo;
  }
  assert.equal(cursor, String(route.toNodeId), `${route.id} traversal terminates at its destination access node`);
}
const accessNodeIds = baseline.zones.map((zone) => String(zone.networkNodeId || ""));
assert.ok(
  accessNodeIds.every((nodeId) => roadNodeIds.has(nodeId)),
  "every district has an access node in the physical road graph"
);
const roadAdjacency = new Map(roadNodes.map((node) => [String(node.id), new Set()]));
for (const edge of roadEdges) {
  if (edgeAllowsDirection(edge, 1)) roadAdjacency.get(String(edge.from)).add(String(edge.to));
  if (edgeAllowsDirection(edge, -1)) roadAdjacency.get(String(edge.to)).add(String(edge.from));
}
for (const origin of accessNodeIds) {
  const reached = new Set([origin]);
  const queue = [origin];
  while (queue.length) {
    for (const destination of roadAdjacency.get(queue.shift()) || []) {
      if (reached.has(destination)) continue;
      reached.add(destination);
      queue.push(destination);
    }
  }
  assert.ok(
    accessNodeIds.every((nodeId) => reached.has(nodeId)),
    `${origin} can reach every district access node`
  );
}
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
assert.match(worker, /initialEmploymentRate: 0\.67/, "opening employment uses the evidence-anchored employed-resident share");
assert.match(worker, /targetEmploymentRate: 0\.67/, "labor matching targets the same evidence-anchored employed-resident share");
assert.match(worker, /assignmentPeakHours: 13/, "the documented daily assignment window is thirteen hours");
assert.match(worker, /captureDaily/, "the engine can return one compact observation for each simulated day");
assert.match(worker, /networkAssignmentStatus/, "daily output distinguishes current and retained workday network assignments");
assert.match(worker, /policyScopeZoneId/, "land-use policy can target a named modeled district");
assert.match(worker, /serializeMapFrame\(\)/, "worker can serialize the complete citizen and enterprise map state");
assert.match(worker, /const mapFrame = options\.mapFrame === "all"/, "the complete map frame is emitted only when requested");
assert.match(worker, /residentialMoveCooldownDays: 365/, "household relocation uses a one-year default minimum stay");
assert.match(worker, /firmMoveCooldownDays: 730/, "firm relocation uses a two-year default minimum stay");
assert.match(worker, /betterJobMinimumRaise: 1\.08/, "voluntary job changes require a material gross raise");
assert.match(worker, /this\.employedAgentDays \+=/, "employment-based movement rates integrate daily exposure");
assert.match(
  worker,
  /crossDistrictVoluntaryJobSwitchesPer100EmployedAgentYears/,
  "cross-district job-switch charts have a matching annualized event rate"
);
assert.match(worker, /eventClass === "reentry"/, "enterprise restart placements are separated from incumbent relocations");
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
  /aggregateFlowRoutes\(state\.history, kind, state\.flowWindowDays, latestDay, state\.flowMeasure\)/,
  "flow charts aggregate exact OD rows over the chosen window"
);
assert.match(
  app,
  /flowSeriesForZone\(state\.history, kind, selectedId, state\.flowWindowDays, latestDay, state\.flowMeasure\)/,
  "selected districts receive daily in, out, and net movement series"
);
assert.match(app, /origin → destination/, "route charts state their origin-to-destination direction");
assert.match(app, /state\.snapshot\?\.commuteOd/, "flow analysis can inspect the current home-to-work stock separately from relocation events");
for (const helper of ["commuteLiveWorkByDistrict", "commuteOdMatrix", "selectedDistrictCommuteExchange"]) {
  assert.match(app, new RegExp(`function ${helper}\\(`), `${helper} derives a focused commute-stock diagnostic`);
}
assert.match(app, /Employed residents vs jobs located/, "district analysis distinguishes where employed residents live from where jobs are located");
assert.match(app, /rows = home, columns = work · not relocation events/, "the OD matrix states its direction and stock semantics");
assert.match(app, /Residents working out/, "selected districts expose residents' external work destinations");
assert.match(app, /Workers commuting in/, "selected districts expose workers' external home origins");
assert.match(app, /tile\.openstreetmap\.org/, "the analyst map uses a labeled OpenStreetMap basemap beneath modeled overlays");
assert.match(app, /state\.hoveredMapFeatureKey !== entry\.key/, "hovered agent and commute-flow features are not mutated during a daily update");
assert.match(app, /topInterDistrictCommutes\(state\.snapshot\?\.commuteOd, 18\)/, "the agent map shows a bounded set of directed home-to-work flows");
assert.match(app, /function createAgentCanvasLayer\(/, "the complete modeled population uses one persistent canvas layer");
assert.match(
  app,
  /state\.worker\.request\("init", \{ data, config: activeConfig, seed: state\.seed, snapshot: \{ mapFrame: "all" \} \}\)/,
  "the active worker requests the complete map frame"
);
assert.match(
  app,
  /state\.referenceWorker\.request\("init", \{ data, config: referenceConfig, seed: state\.seed, snapshot: \{ mapFrame: "none" \} \}\)/,
  "the reference worker explicitly omits the full map frame"
);
assert.match(
  app,
  /state\.agentCanvas\.setFrame\(state\.snapshot\.mapFrame\)/,
  "daily active snapshots update the persistent agent canvas from the full frame"
);
assert.match(app, /frame\.codes\?\.citizenLaborForceStatuses/, "the map frame decodes the worker's citizen labor-force status vocabulary");
assert.match(app, /frame\.citizens\.laborForceStatuses/, "every mapped citizen receives its compact labor-force status code");
assert.match(app, /point\.laborForceStatus === "nonparticipant"/, "map agent labels distinguish citizens outside the modeled labor force");
assert.match(app, /Active job seeker/, "map and inspector copy identifies unemployed participants as active job seekers");
assert.match(app, /requestAnimationFrame\(\(\) =>/, "agent-canvas redraws are coalesced through animation frames");
assert.match(app, /this\.canvas\.tabIndex = 0/, "the all-agent canvas is one keyboard-reachable explorer rather than thousands of tab stops");
assert.match(app, /window\.L\.svg\(\{ pane: "udesV2CommuteFlows"/, "commute routes use a dedicated SVG renderer for keyboard access");
assert.match(app, /element\.setAttribute\("tabindex", "0"\)/, "interactive map features participate in sequential keyboard navigation");
assert.match(app, /line\.udesV2PendingRemoval = true/, "an interacting commute route is retained when it leaves the top-route set");
assert.match(
  app,
  /if \(line\.udesV2PendingRemoval\) removeCommuteFlowLayer\(line\)/,
  "a stale hovered route is removed only after its interaction ends"
);
assert.match(app, /distributions\?\.financialStatus/, "citizen charts use mutually exclusive financial-status output");
assert.match(app, /"outside-labor-force": "Outside labor force"/, "financial charts map nonparticipants to an explicit outside-labor-force bin");
assert.match(app, /no [‘']net zero[’'] bucket/, "financial-status chart explicitly rejects a misleading net-zero bucket");
assert.doesNotMatch(app, /Net-income distribution|agents:income/, "the ambiguous net-income histogram contract has been removed");
assert.match(app, /stack: "citizen-state"/, "citizen Happy, Waiting, Extreme, and Recovery states are charted as a complete stock");
assert.match(app, /stack: "enterprise-state"/, "enterprise Starting, Working, Grow, and Lesser states are charted as a complete stock");
assert.match(app, /const corridors = new Map\(\)/, "named-corridor pressure groups physical road segments by road name");
assert.match(
  app,
  /current\.roadPressure = Math\.max\(current\.roadPressure, roadPressure\)/,
  "named-corridor pressure reports maximum directional V/C rather than duplicate segment bars"
);
assert.match(app, /captureDaily: true/, "controller requests consecutive daily observations from both workers");
assert.match(app, /const HISTORY_POINT_LIMIT = 3654/, "controller retains Day 0 plus a full ten-year daily run");
assert.match(app, /const FLOW_HISTORY_DETAIL_DAYS = 30/, "high-volume OD rows are retained only for the longest selectable flow window");
assert.match(app, /detailCutoff/, "expired OD and transition detail is compacted while daily aggregate history remains available");
assert.match(app, /normalized\.zoneSeries = \[\]/, "unused reference-run district rows are discarded to keep ten-year daily playback bounded");
assert.match(app, /function filterHistoryWindow\(/, "daily charts support bounded display windows without changing the run");
assert.match(app, /function stagedEnginePatch\(/, "only explicitly changed intervention fields are applied to the live model");
assert.match(app, /inspectionRequestToken/, "late inspection responses cannot overwrite the current agent selection");
assert.match(app, /data-udes-v2-agent-search/, "inspectors support direct typed IDs alongside the all-agent canvas explorer");
assert.match(app, /\["representedVacancies"\]/, "enterprise inspector reads the hiring-aware vacancy field");
assert.match(app, /sourceClassByField\.lanesPerDirection/, "road inspection reads field-level lane-count provenance");
assert.match(
  app,
  /"AD-SDI observed" : "road-class assumption"/,
  "road inspection distinguishes observed AD-SDI lanes from modeled road-class assumptions"
);
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
assert.match(css, /\.udes-v2-agent-history\s*>\s*div\.is-signed/, "signed household histories use a zero-centered visual treatment");
assert.match(app, /function panelIsInteracting\(/, "inspector refreshes detect active hover and keyboard interaction");
assert.match(app, /state\.pendingPanelRenders\.set\(panel, render\)/, "inspector updates queue while the user is interacting");
assert.match(
  app,
  /pointerleave[\s\S]*flushPendingPanelRender\(panel\)[\s\S]*focusout/,
  "queued inspector updates flush after pointer or focus interaction ends"
);
assert.match(app, /state\.pendingChartOptions\.set\(key, \{ option, structureKey \}\)/, "chart updates queue while a tooltip interaction is active");
assert.match(
  app,
  /firstRender \|\| structureChanged[\s\S]*?\? \{ notMerge: true, lazyUpdate: true \}[\s\S]*?: \{ notMerge: false, lazyUpdate: true, silent: true, replaceMerge: \["series"\] \}/,
  "normal chart ticks merge into existing instances and replace only series data"
);
assert.match(
  app,
  /mountChart\(routesNode, "flows:routes", routeChart, commuteStock \? "commute-od-heatmap" : "event-route-bars"\)/,
  "switching between the OD heatmap and event bars declares an explicit chart structure boundary"
);
assert.match(app, /state\.chartStructureKeys\.get\(key\) !== structureKey/, "chart structure changes fully replace incompatible ECharts state");
assert.match(
  app,
  /state\.chartInteractionLocks\.has\(key\) && !structureChanged/,
  "an intentional chart-mode switch is applied immediately while ordinary daily updates remain interaction-locked"
);
assert.equal((app.match(/window\.echarts\.init\(/g) || []).length, 1, "chart mode changes reuse the existing ECharts instance");
assert.match(app, /if \(!series\.id\)\s+series\.id = `\$\{key\}:/, "chart series receive stable IDs before incremental updates");
assert.match(app, /function summarizeChart\(/, "rendered charts receive data-derived accessible summaries");
assert.match(app, /function updateAccessibleOdTable\(/, "the OD heatmap has a nonvisual semantic table companion");
assert.match(app, /document\.createElement\("table"\)/, "the OD companion uses native table semantics");
assert.match(app, /header\.scope = "row"/, "OD matrix home districts are exposed as row headers");
assert.match(app, /node\.setAttribute\("aria-describedby", detail\.id\)/, "the visible OD chart references its semantic table");
assert.match(app, /This table is not relocation-event data/, "the accessible OD description distinguishes stock from relocation events");
assert.match(app, /residential: "citizen-agent-years"/, "residential movement rates identify their citizen-agent exposure denominator");
assert.match(app, /job: "employed-agent-years"/, "job movement rates identify its employed-agent exposure denominator");
assert.match(app, /workplace: "employed-agent-years"/, "workplace movement rates identify its employed-agent exposure denominator");
assert.match(app, /enterprise: "firm-agent-years"/, "enterprise movement rates identify their firm-agent exposure denominator");
assert.doesNotMatch(app, /events \/ 100 actor-years/, "flow rates do not use an ambiguous generic denominator");
assert.match(
  scss,
  /@media \(max-width: 1399px\) and \(min-width: 1100px\)[\s\S]*?grid-template-columns: 240px minmax\(0, 1fr\) 290px;[\s\S]*?data-udes-v2-flow-chart-mode="commute"[\s\S]*?minmax\(320px, 1\.35fr\)/,
  "narrow desktop layouts reserve usable width and height for the OD matrix"
);
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

assert.equal(validation.status, "passed-regression-and-provisional-sanity-checks", "full-scale validation report passes");
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
    "residential-relocation-rate-below-provisional-churn-ceiling",
    "firm-relocation-rate-below-provisional-churn-ceiling",
    "voluntary-job-switch-rate-below-provisional-churn-ceiling",
    "cross-district-job-switch-rate-reconciles-to-all-switches",
    "employer-carried-workplace-change-rate-below-provisional-churn-ceiling",
    "full-agent-scale-resolved",
    "labor-force-stocks-reconcile",
    "labor-force-rates-use-disclosed-denominators",
    "outside-labor-force-financial-bin-reconciles",
    "extreme-state-not-dominated-by-nonparticipants",
    "fresh-scenario-zoned-job-capacity-respected",
    "capacity-overflow-within-horizon-stress-guard",
    "maximum-directional-road-volume-capacity-within-horizon-stress-guard",
    "aggregate-zone-portals-carry-no-assignment-load",
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
  "ten-year-transit-ownership-stock-reconciles-with-agent-flows",
  "ten-year-housing-reduces-occupancy-pressure",
  "ten-year-housing-lowers-mean-housing-rent",
  "ten-year-housing-financial-tradeoff-remains-bounded",
  "ten-year-housing-network-tradeoff-remains-served",
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
