import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const html = readRoute("/projects/abu-dhabi-urban-dynamics/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const source = readFileSync(new URL("../assets/js/udes-simulation.js", import.meta.url), "utf8");
const network = JSON.parse(readFileSync(new URL("../assets/data/udes/abu-dhabi-corridors.json", import.meta.url), "utf8"));
const config = readFileSync(new URL("../_config.yml", import.meta.url), "utf8");

assertContains(html, /class="[^"]*garden-body/, "simulation uses the shared garden shell");
assertContains(html, /href="\/projects\/"[^>]*aria-current="page"/, "simulation keeps Projects current in navigation");
assert.equal((html.match(/<h1\b/g) || []).length, 1, "simulation has one h1");
assertContains(html, /id="udes-map"[^>]*role="region"[^>]*aria-label="Interactive OpenStreetMap/, "map has an accessible description");
assertContains(html, /data-network-url="\/assets\/data\/udes\/abu-dhabi-corridors\.json"/, "page emits its prepared road data URL");
assertContains(html, /data-action="play"[^>]*aria-pressed="false"/, "play control exposes state");
assertContains(html, /data-action="reset"/, "reset control is a real button");
assertContains(html, /id="udes-live-status"[^>]*role="status"[^>]*aria-live="polite"/, "simulation provides a live status region");
assertContains(html, /data-zone-table/, "simulation includes a textual zone-results fallback");
assert.equal(
  (html.match(/<option value="(?:downtown|reem|saadiyat|yas|khalifa|mbz|alain|ruwais)">/g) || []).length >= 8,
  true,
  "page exposes eight study zones"
);
assertContains(html, /educational scenario, not a forecast/i, "page makes the educational limitation prominent");
assertContains(html, /assets\/js\/udes-simulation\.js/, "page loads its scoped simulation engine");
assertContains(css, /\.udes-workbench\{/, "compiled CSS includes the workbench layout");
assertContains(source, /tile\.openstreetmap\.org/, "map uses the real OpenStreetMap basemap");
assertContains(source, /OpenStreetMap contributors/, "map code preserves visible OSM attribution");
assertContains(source, /carUtility = 3 - 0\.3 \* carCost - 0\.05 \* carMinutes/, "mode choice retains the UDES car utility structure");
assert.equal(network.routes.length, 11, "prepared data contains all representative corridors");
assert.ok(
  network.routes.every((route) => route.coordinates.length >= 10),
  "corridors contain routed road geometry rather than straight endpoints"
);
assert.match(network.license, /OpenStreetMap contributors/, "road snapshot records OSM attribution");
assert.match(config, /leaflet@\{\{version\}\}\/dist\/leaflet\.css/, "Leaflet stylesheet uses the official distribution path");
assert.match(config, /sha256-p4NxAoJBhIIN\+hmNHrzRCf9tD\/miZyoHS5obTRR9BMY=/, "Leaflet stylesheet integrity matches the official release");

console.log("UDES simulation contract passed");
