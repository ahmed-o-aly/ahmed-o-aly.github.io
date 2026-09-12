import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Read-only audit of application files. Writes only data-checks.json beside this file.
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const read = async (file) => JSON.parse(await readFile(path.join(root, file), "utf8"));
const baseline = await read("assets/data/udes-v2/baseline.json");
const geometry = await read("assets/data/udes-v2/zones.geojson");

function inRing(point, ring) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a[1] > point[1]) !== (b[1] > point[1]) && point[0] < ((b[0] - a[0]) * (point[1] - a[1])) / (b[1] - a[1]) + a[0]) hit = !hit;
  }
  return hit;
}
function inGeometry(point, shape) {
  const polygons = shape.type === "Polygon" ? [shape.coordinates] : shape.coordinates;
  return polygons.some((rings) => inRing(point, rings[0]) && !rings.slice(1).some((ring) => inRing(point, ring)));
}
function distanceKm(a, b) {
  const rad = Math.PI / 180;
  const v = Math.sin(((a[1] - b[1]) * rad) / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(((a[0] - b[0]) * rad) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(v), Math.sqrt(1 - v));
}

const censusRequest = baseline.sources.scadPopulation.indicatorRequest;
const response = await fetch(baseline.sources.scadPopulation.indicatorEndpoint, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams(censusRequest),
  signal: AbortSignal.timeout(15000),
});
if (!response.ok) throw new Error(`SCAD returned ${response.status}`);
const payload = await response.json();
const rows = [...payload.Data.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
let region = null;
const census = [];
for (const row of rows) {
  const cells = [...row[1].matchAll(/<td\b([^>]*)>([\s\S]*?)<\/td>/gi)];
  if (!cells.length) continue;
  if (cells[0][1].includes('data-column="Region"')) region = cells.shift()[2];
  if (region !== "Abu Dhabi Region" || cells.length < 2) continue;
  census.push({ name: cells[0][2].replaceAll("&#39;", "'"), population: Number(cells[1][2].replaceAll(",", "")) });
}
const mapping = {
  "al-bateen": ["Al Qurm-Al Muzoun-Al Bateen"],
  "al-manhal-karamah": ["Al Manhal"],
  "muroor-al-saadah": ["Al Sa'adah"],
  "al-saadiyat": ["Saadiyat Island"],
  "rabdan-al-maqta": ["Rabdan"],
  "al-raha": ["Al Rahah"],
  "mbz-zayed-city": ["Mohamed Bin Zayed City", "Zayed City"],
};
const zones = baseline.zones.map((zone) => {
  const feature = geometry.features.find((item) => item.id === zone.id);
  const names = mapping[zone.id] || [zone.name];
  const records = names.map((name) => census.find((record) => record.name === name));
  if (records.some((record) => !record)) throw new Error(`Missing SCAD mapping for ${zone.id}`);
  const sourcePopulation = records.reduce((sum, record) => sum + record.population, 0);
  return {
    id: zone.id, name: zone.name, population: zone.population2024, sourceRecords: records,
    sourcePopulation, numericMappingMatches: sourcePopulation === zone.population2024,
    note: "Numeric agreement does not establish that census and AD-SDI spatial extents match.",
    anchor: zone.centroid, geometryCentroid: zone.geometryCentroid,
    anchorInsideGeometry: inGeometry(zone.centroid, feature.geometry),
    anchorToGeometryCentroidKm: Number(distanceKm(zone.centroid, zone.geometryCentroid).toFixed(3)),
    excludedCommunityRecords: feature.properties.excludedDisplacedCommunityRecords,
    initialOccupancyPercentBeforeAgentRounding: Number((100 * zone.population2024 / zone.housingCapacityPersons).toFixed(3)),
  };
});
const sourceHashes = {};
for (const file of ["assets/js/udes-v2-worker.js", "assets/data/udes-v2/baseline.json", "assets/js/udes-v2-app.js", "scripts/validate-udes-v2-full.mjs"]) {
  sourceHashes[file] = createHash("sha256").update(await readFile(path.join(root, file))).digest("hex");
}
const result = {
  checkedAt: new Date().toISOString(), sourceHashes,
  census: { endpoint: baseline.sources.scadPopulation.indicatorEndpoint, method: "POST", request: censusRequest, districtRows: census.length },
  selectedPopulation: baseline.calibration.studyScopePopulation2024,
  allNumericMappingsMatch: zones.every((zone) => zone.numericMappingMatches),
  note: "Checks do not claim empirical validation or independently validate official geography.", zones,
};
await writeFile(path.join(here, "data-checks.json"), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({ allNumericMappingsMatch: result.allNumericMappingsMatch, districtsChecked: zones.length, anchorsOutside: zones.filter((zone) => !zone.anchorInsideGeometry).map((zone) => ({ id: zone.id, displacementKm: zone.anchorToGeometryCentroidKm })) }, null, 2));
