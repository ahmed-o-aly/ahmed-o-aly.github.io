import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const html = readRoute("/projects/abu-dhabi-urban-dynamics-v2/");
const projects = readRoute("/projects/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const app = readFileSync(new URL("../assets/js/udes-v2-app.js", import.meta.url), "utf8");
const worker = readFileSync(new URL("../assets/js/udes-v2-worker.js", import.meta.url), "utf8");
const baseline = JSON.parse(readFileSync(new URL("../assets/data/udes-v2/baseline.json", import.meta.url), "utf8"));
const zones = JSON.parse(readFileSync(new URL("../assets/data/udes-v2/zones.geojson", import.meta.url), "utf8"));
const roads = JSON.parse(readFileSync(new URL("../assets/data/udes-v2/roads.geojson", import.meta.url), "utf8"));
const stops = JSON.parse(readFileSync(new URL("../assets/data/udes-v2/transit-stops.geojson", import.meta.url), "utf8"));

assert.equal((html.match(/<h1\b/g) || []).length, 1, "v2 has one page heading");
assertContains(html, /class="[^"]*garden-body--simulation-v2/, "v2 uses its fixed analyst shell");
assertContains(html, /data-model-url="\/assets\/data\/udes-v2\/baseline\.json"/, "v2 emits the calibrated baseline URL");
assertContains(html, /data-worker-url="\/assets\/js\/udes-v2-worker\.js"/, "v2 emits its agent worker URL");
assertContains(html, /aria-label="Interactive map of Greater Abu Dhabi City/, "map has the correct city boundary description");
assert.equal((html.match(/data-udes-v2-inspector-tab=/g) || []).length, 4, "four object inspectors are available");
assert.equal((html.match(/data-udes-v2-chart-tab=/g) || []).length, 6, "six analysis workspaces are available");
assertContains(html, /Read the decision rules/, "citizen and enterprise objectives are documented in the controls");
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
assert.doesNotMatch(projects, /Abu Dhabi Urban Dynamics Lab · Analyst Preview/, "preview does not duplicate the public project card");

assert.equal(baseline.zones.length, 18, "baseline contains 18 Greater Abu Dhabi districts");
for (const id of ["al-mushrif", "al-danah", "al-zahiyah", "al-khalidiyah", "al-bateen", "al-reem", "yas-island", "musaffah"]) {
  assert.ok(
    baseline.zones.some((zone) => zone.id === id),
    `${id} remains a distinct model district`
  );
}
assert.equal(baseline.roadGraph.edges.length, 31, "road graph contains 31 routed corridors");
assert.equal(zones.features.length, 18, "official district geometry joins every model zone");
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
assert.match(app, /referenceWorker = new WorkerClient/, "controller runs a same-seed reference worker");
assert.match(app, /function renderMobilityCharts\(/, "controller renders the mobility analysis workspace");
assert.doesNotMatch(app, /normalizeShare/, "controller does not guess whether percentage fields are ratios");

console.log("UDES v2 site contract passed");
