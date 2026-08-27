import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectRoot, "assets", "data", "udes-v2");
const snapshotDate = "2026-08-27";
const bounds = [54.28, 24.24, 54.78, 24.62];

const sources = {
  adsdiCommunities: {
    title: "AD-SDI Open Data — Community",
    url: "https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/2",
    publisher: "Department of Government Enablement, Abu Dhabi Spatial Data Infrastructure",
    classification: "observed",
    use: "Official community polygons grouped by official district ID into model zones",
    retrieved: snapshotDate,
  },
  adsdiRoadCenterline: {
    title: "AD-SDI Open Data — RoadCenterline",
    url: "https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/101",
    publisher: "Department of Government Enablement, Abu Dhabi Spatial Data Infrastructure",
    classification: "reference",
    use: "Inspected as the preferred road source; not embedded because the layer is a dense, non-routable centerline inventory",
    retrieved: snapshotDate,
  },
  adsdiBusStops: {
    title: "AD-SDI Open Data — Bus Stops",
    url: "https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/801",
    publisher: "Department of Government Enablement, Abu Dhabi Spatial Data Infrastructure",
    classification: "observed",
    use: "Official stop IDs, names and locations",
    retrieved: snapshotDate,
  },
  adsdiTerms: {
    title: "AD-SDI catalogue terms and conditions",
    url: "https://sdi.gov.abudhabi/sdi/Imagenarycatalogue.html",
    publisher: "Department of Government Enablement",
    classification: "license",
    use: "Open-data attribution and reuse terms",
    retrieved: snapshotDate,
  },
  scadPopulation: {
    title: "Abu Dhabi Census — Population 2024",
    url: "https://census.scad.gov.ae/home/population?lang=en",
    publisher: "Statistics Centre — Abu Dhabi",
    classification: "observed",
    use: "Abu Dhabi Region total and the complete 2024 district table returned by the official census indicator endpoint",
    indicatorEndpoint: "https://census.scad.gov.ae/home/IndicatorData",
    indicatorRequest: { contentsetupid: 6010, topicid: 6, itemindex: 0, year: 2024, lang: "en" },
    referenceYear: 2024,
    retrieved: snapshotDate,
  },
  abuDhabiBusTariff: {
    title: "Public Transport Services — Standard Service fare",
    url: "https://admobility.gov.ae/en/pb-bus-service/hafilat-public-buses-fees",
    publisher: "Abu Dhabi Mobility",
    classification: "observed",
    use: "Standard pay-as-you-go city bus fare formula used by the commute-cost model",
    baseFarePerDirectionAed: 2,
    farePerPassengerKmAed: 0.05,
    maximumFarePerDirectionAed: 5,
    retrieved: snapshotDate,
  },
  unHabitatMobility: {
    title: "National Urban Policy Transport Guide — Figure 21",
    url: "https://unhabitat.org/sites/default/files/2022/03/nup-transport_guide-web.pdf",
    publisher: "UN-Habitat",
    classification: "reference",
    use: "Historical Abu Dhabi all-trip mode shares used as a broad calibration check, not a current commute forecast",
    referenceYear: 2015,
    underlyingSource: "UITP (2019)",
    retrieved: snapshotDate,
  },
  osm: {
    title: "OpenStreetMap",
    url: "https://www.openstreetmap.org/copyright",
    publisher: "OpenStreetMap contributors",
    license: "ODbL",
    classification: "derived",
    use: "Routable road geometry where the official centerline service is impractical",
    retrieved: snapshotDate,
  },
  osrm: {
    title: "OSRM public routing service",
    url: "https://router.project-osrm.org/",
    publisher: "Project OSRM",
    classification: "derived",
    use: "Static shortest-road corridor geometry and free-flow route duration over OpenStreetMap",
    retrieved: snapshotDate,
  },
};

const zoneSpecs = [
  {
    id: "al-bateen",
    name: "Al Bateen",
    districtIds: [1300],
    population: 57100,
    populationClass: "derived-from-observed",
    jobs: 70000,
    quality: 0.9,
    housingRentIndex: 1.35,
    businessRentIndex: 1.25,
    carOwnershipRate: 0.78,
    averageMonthlySalaryAed: 14500,
    dominantEmployment: ["government", "professional services", "hospitality"],
    populationComponents: [{ name: "Al Qurm-Al Muzoun-Al Bateen", value: 57100, sourceClass: "observed" }],
    mappingNote:
      "SCAD publishes one combined Al Qurm-Al Muzoun-Al Bateen census district; the model geometry is the official Al Bateen district group.",
  },
  {
    id: "al-danah",
    name: "Al Danah",
    districtIds: [1301],
    population: 259925,
    populationClass: "observed",
    jobs: 240000,
    quality: 0.72,
    housingRentIndex: 0.95,
    businessRentIndex: 1.15,
    carOwnershipRate: 0.62,
    averageMonthlySalaryAed: 10500,
    dominantEmployment: ["retail", "government", "professional services"],
  },
  {
    id: "al-khalidiyah",
    name: "Al Khalidiyah",
    districtIds: [1290],
    population: 29700,
    populationClass: "observed",
    jobs: 75000,
    quality: 0.82,
    housingRentIndex: 1.15,
    businessRentIndex: 1.1,
    carOwnershipRate: 0.69,
    averageMonthlySalaryAed: 12000,
    dominantEmployment: ["retail", "professional services", "hospitality"],
  },
  {
    id: "al-manhal-karamah",
    name: "Al Manhal / Al Karamah",
    districtIds: [1294],
    population: 42760,
    populationClass: "derived-from-observed",
    jobs: 70000,
    quality: 0.78,
    housingRentIndex: 1.05,
    businessRentIndex: 1.05,
    carOwnershipRate: 0.72,
    averageMonthlySalaryAed: 12000,
    dominantEmployment: ["government", "education", "retail"],
    populationComponents: [{ name: "Al Manhal", value: 42760, sourceClass: "observed" }],
    mappingNote: "SCAD's observed Al Manhal population is mapped to the familiar Al Manhal / Al Karamah label and official Al Manhal polygon.",
  },
  {
    id: "al-mushrif",
    name: "Al Mushrif",
    districtIds: [1291],
    population: 33770,
    populationClass: "observed",
    jobs: 70000,
    quality: 0.82,
    housingRentIndex: 1.1,
    businessRentIndex: 1.0,
    carOwnershipRate: 0.78,
    averageMonthlySalaryAed: 12500,
    dominantEmployment: ["education", "health", "government"],
  },
  {
    id: "al-nahyan",
    name: "Al Nahyan",
    districtIds: [1295],
    population: 99695,
    populationClass: "observed",
    jobs: 85000,
    quality: 0.74,
    housingRentIndex: 0.9,
    businessRentIndex: 1.0,
    carOwnershipRate: 0.65,
    averageMonthlySalaryAed: 11000,
    dominantEmployment: ["education", "retail", "professional services"],
  },
  {
    id: "muroor-al-saadah",
    name: "Muroor / Al Sa'adah",
    districtIds: [1298],
    population: 25970,
    populationClass: "derived-from-observed",
    jobs: 110000,
    quality: 0.7,
    housingRentIndex: 0.85,
    businessRentIndex: 0.95,
    carOwnershipRate: 0.71,
    averageMonthlySalaryAed: 10000,
    dominantEmployment: ["retail", "education", "professional services"],
    mappingNote:
      "Muroor is a familiar corridor-area rather than a census district; the observed SCAD Al Sa'adah population and official Al Sa'adah polygon are used reproducibly.",
  },
  {
    id: "al-rawdah",
    name: "Al Rawdah",
    districtIds: [1297],
    population: 26935,
    populationClass: "observed",
    jobs: 95000,
    quality: 0.86,
    housingRentIndex: 1.2,
    businessRentIndex: 1.2,
    carOwnershipRate: 0.82,
    averageMonthlySalaryAed: 14500,
    dominantEmployment: ["government", "events", "professional services"],
  },
  {
    id: "al-zahiyah",
    name: "Al Zahiyah",
    districtIds: [1303],
    population: 122515,
    populationClass: "observed",
    jobs: 100000,
    quality: 0.72,
    housingRentIndex: 0.88,
    businessRentIndex: 1.1,
    carOwnershipRate: 0.6,
    averageMonthlySalaryAed: 10000,
    dominantEmployment: ["hospitality", "retail", "professional services"],
  },
  {
    id: "al-reem",
    name: "Al Reem Island",
    districtIds: [57, 1319],
    population: 59725,
    populationClass: "derived-from-observed",
    jobs: 80000,
    quality: 0.88,
    housingRentIndex: 1.3,
    businessRentIndex: 1.3,
    carOwnershipRate: 0.76,
    averageMonthlySalaryAed: 15000,
    dominantEmployment: ["professional services", "retail", "education"],
    mappingNote: "Official Al Reem Island and Al Reem East Island polygons combined.",
  },
  {
    id: "al-maryah",
    name: "Al Maryah Island",
    districtIds: [74],
    population: 3375,
    populationClass: "observed",
    jobs: 100000,
    quality: 0.96,
    housingRentIndex: 1.7,
    businessRentIndex: 1.8,
    carOwnershipRate: 0.7,
    averageMonthlySalaryAed: 22000,
    dominantEmployment: ["finance", "health", "hospitality"],
  },
  {
    id: "al-saadiyat",
    name: "Al Saadiyat Island",
    districtIds: [1347],
    population: 30555,
    populationClass: "observed",
    jobs: 55000,
    quality: 0.95,
    housingRentIndex: 1.65,
    businessRentIndex: 1.45,
    carOwnershipRate: 0.86,
    averageMonthlySalaryAed: 16000,
    dominantEmployment: ["culture", "education", "hospitality"],
  },
  {
    id: "rabdan-al-maqta",
    name: "Rabdan / Al Maqta",
    districtIds: [1244],
    population: 32960,
    populationClass: "derived-from-observed",
    jobs: 45000,
    quality: 0.8,
    housingRentIndex: 1.0,
    businessRentIndex: 1.0,
    carOwnershipRate: 0.86,
    averageMonthlySalaryAed: 12500,
    dominantEmployment: ["government", "hospitality", "retail"],
    mappingNote: "SCAD's observed Rabdan population and official Rabdan polygon are used for the Rabdan / Al Maqta gateway label.",
  },
  {
    id: "al-raha",
    name: "Al Raha",
    districtIds: [1345],
    population: 30200,
    populationClass: "observed",
    jobs: 45000,
    quality: 0.88,
    housingRentIndex: 1.25,
    businessRentIndex: 1.2,
    carOwnershipRate: 0.88,
    averageMonthlySalaryAed: 15000,
    dominantEmployment: ["professional services", "hospitality", "retail"],
  },
  {
    id: "yas-island",
    name: "Yas Island",
    districtIds: [1330],
    population: 36730,
    populationClass: "observed",
    jobs: 75000,
    quality: 0.92,
    housingRentIndex: 1.45,
    businessRentIndex: 1.35,
    carOwnershipRate: 0.9,
    averageMonthlySalaryAed: 13000,
    dominantEmployment: ["tourism", "leisure", "retail"],
  },
  {
    id: "khalifa-city",
    name: "Khalifa City",
    districtIds: [26],
    population: 104930,
    populationClass: "observed",
    jobs: 60000,
    quality: 0.84,
    housingRentIndex: 1.15,
    businessRentIndex: 1.0,
    carOwnershipRate: 0.92,
    averageMonthlySalaryAed: 14500,
    dominantEmployment: ["education", "aviation services", "retail"],
  },
  {
    id: "mbz-zayed-city",
    name: "Mohamed Bin Zayed / Zayed City",
    districtIds: [48, 400],
    population: 224345,
    populationClass: "derived-from-observed",
    populationComponents: [
      { name: "Mohamed Bin Zayed City", value: 209360, sourceClass: "observed" },
      { name: "Zayed City", value: 14985, sourceClass: "observed" },
    ],
    jobs: 120000,
    quality: 0.72,
    housingRentIndex: 0.85,
    businessRentIndex: 0.85,
    carOwnershipRate: 0.91,
    averageMonthlySalaryAed: 10500,
    dominantEmployment: ["construction", "retail", "government"],
    mappingNote: "Two official district polygons and their two observed SCAD 2024 census populations are combined.",
  },
  {
    id: "musaffah",
    name: "Musaffah",
    districtIds: [38],
    population: 296345,
    populationClass: "observed",
    jobs: 310000,
    quality: 0.48,
    housingRentIndex: 0.65,
    businessRentIndex: 0.7,
    carOwnershipRate: 0.75,
    averageMonthlySalaryAed: 6500,
    dominantEmployment: ["industry", "construction", "logistics"],
  },
];

// A small number of legacy records in the open Community layer are visibly
// displaced while carrying otherwise valid district IDs. These anchors select
// the contiguous Greater Abu Dhabi City community cluster reproducibly.
const geometryHints = {
  "al-bateen": { center: [54.345, 24.452], radiusKm: 10 },
  "al-danah": { center: [54.369, 24.486], radiusKm: 8 },
  "al-khalidiyah": { center: [54.351, 24.467], radiusKm: 6 },
  "al-manhal-karamah": { center: [54.366, 24.462], radiusKm: 7 },
  "al-mushrif": { center: [54.389, 24.44], radiusKm: 8 },
  "al-nahyan": { center: [54.388, 24.464], radiusKm: 7 },
  "muroor-al-saadah": { center: [54.429, 24.436], radiusKm: 7 },
  "al-rawdah": { center: [54.453, 24.418], radiusKm: 10 },
  "al-zahiyah": { center: [54.38, 24.499], radiusKm: 8 },
  "al-reem": { center: [54.417, 24.505], radiusKm: 9 },
  "al-maryah": { center: [54.39, 24.502], radiusKm: 5 },
  "al-saadiyat": { center: [54.44, 24.54], radiusKm: 18 },
  "rabdan-al-maqta": { center: [54.5, 24.397], radiusKm: 12 },
  "al-raha": { center: [54.59, 24.453], radiusKm: 16 },
  "yas-island": { center: [54.603, 24.492], radiusKm: 12 },
  "khalifa-city": { center: [54.697, 24.425], radiusKm: 18 },
  "mbz-zayed-city": { center: [54.574, 24.355], radiusKm: 24 },
  musaffah: { center: [54.5, 24.35], radiusKm: 22 },
};

const corridorSpecs = [
  ["al-zahiyah", "al-danah", "urban-arterial"],
  ["al-danah", "al-nahyan", "urban-arterial"],
  ["al-danah", "al-khalidiyah", "urban-arterial"],
  ["al-danah", "al-manhal-karamah", "urban-arterial"],
  ["al-zahiyah", "al-maryah", "bridge-arterial"],
  ["al-zahiyah", "al-reem", "bridge-arterial"],
  ["al-nahyan", "al-mushrif", "urban-arterial"],
  ["al-nahyan", "al-manhal-karamah", "urban-arterial"],
  ["al-manhal-karamah", "al-khalidiyah", "urban-arterial"],
  ["al-manhal-karamah", "al-mushrif", "urban-arterial"],
  ["al-manhal-karamah", "muroor-al-saadah", "urban-arterial"],
  ["al-khalidiyah", "al-bateen", "urban-arterial"],
  ["al-mushrif", "al-bateen", "urban-arterial"],
  ["al-mushrif", "muroor-al-saadah", "urban-arterial"],
  ["muroor-al-saadah", "al-rawdah", "urban-arterial"],
  ["al-rawdah", "rabdan-al-maqta", "urban-arterial"],
  ["al-rawdah", "al-bateen", "urban-arterial"],
  ["al-reem", "al-maryah", "bridge-arterial"],
  ["al-reem", "al-saadiyat", "bridge-arterial"],
  ["al-maryah", "al-saadiyat", "bridge-arterial"],
  ["al-saadiyat", "yas-island", "motorway"],
  ["al-saadiyat", "rabdan-al-maqta", "motorway"],
  ["rabdan-al-maqta", "al-raha", "motorway"],
  ["al-raha", "khalifa-city", "urban-arterial"],
  ["al-raha", "yas-island", "motorway"],
  ["yas-island", "khalifa-city", "motorway"],
  ["khalifa-city", "mbz-zayed-city", "motorway"],
  ["khalifa-city", "musaffah", "motorway"],
  ["mbz-zayed-city", "musaffah", "urban-arterial"],
  ["rabdan-al-maqta", "musaffah", "motorway"],
  ["rabdan-al-maqta", "khalifa-city", "motorway"],
];

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "ahmed-o-aly.github.io UDES v2 data builder" },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

function arcgisUrl(layer, params) {
  const url = new URL(`https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/${layer}/query`);
  url.search = new URLSearchParams(params);
  return url;
}

function geometryPolygons(geometry) {
  if (geometry.type === "Polygon") return [geometry.coordinates];
  if (geometry.type === "MultiPolygon") return geometry.coordinates;
  throw new Error(`Unsupported zone geometry: ${geometry.type}`);
}

function combineGeometries(features) {
  const polygons = features.flatMap((feature) => geometryPolygons(feature.geometry));
  return polygons.length === 1 ? { type: "Polygon", coordinates: polygons[0] } : { type: "MultiPolygon", coordinates: polygons };
}

function ringMetrics(ring) {
  const meanLat = ring.reduce((sum, point) => sum + point[1], 0) / ring.length;
  const xScale = 111.32 * Math.cos((meanLat * Math.PI) / 180);
  const yScale = 110.574;
  let twiceArea = 0;
  let centroidX = 0;
  let centroidY = 0;
  for (let index = 0; index < ring.length - 1; index += 1) {
    const x1 = ring[index][0] * xScale;
    const y1 = ring[index][1] * yScale;
    const x2 = ring[index + 1][0] * xScale;
    const y2 = ring[index + 1][1] * yScale;
    const cross = x1 * y2 - x2 * y1;
    twiceArea += cross;
    centroidX += (x1 + x2) * cross;
    centroidY += (y1 + y2) * cross;
  }
  const signedArea = twiceArea / 2;
  if (Math.abs(signedArea) < 1e-9) {
    return { area: 0, centroid: ring[0] };
  }
  return {
    area: Math.abs(signedArea),
    centroid: [centroidX / (6 * signedArea) / xScale, centroidY / (6 * signedArea) / yScale],
  };
}

function geometryMetrics(geometry) {
  const polygons = geometryPolygons(geometry);
  const outerMetrics = polygons.map((polygon) => ringMetrics(polygon[0]));
  const totalOuterArea = outerMetrics.reduce((sum, metrics) => sum + metrics.area, 0);
  const centroid = outerMetrics.reduce(
    (point, metrics) => [point[0] + metrics.centroid[0] * metrics.area, point[1] + metrics.centroid[1] * metrics.area],
    [0, 0]
  );
  const holeArea = polygons.reduce((sum, polygon) => sum + polygon.slice(1).reduce((inner, ring) => inner + ringMetrics(ring).area, 0), 0);
  return {
    areaKm2: Math.max(0, totalOuterArea - holeArea),
    centroid: centroid.map((coordinate) => coordinate / totalOuterArea),
  };
}

function pointInRing(point, ring) {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index, index += 1) {
    const [x1, y1] = ring[index];
    const [x2, y2] = ring[previous];
    if (y1 > point[1] !== y2 > point[1] && point[0] < ((x2 - x1) * (point[1] - y1)) / (y2 - y1) + x1) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInGeometry(point, geometry) {
  return geometryPolygons(geometry).some((polygon) => pointInRing(point, polygon[0]) && !polygon.slice(1).some((hole) => pointInRing(point, hole)));
}

function haversineKm(first, second) {
  const radius = 6371;
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const deltaLat = radians(second[1] - first[1]);
  const deltaLon = radians(second[0] - first[0]);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(first[1])) * Math.cos(radians(second[1])) * Math.sin(deltaLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchCommunities() {
  const districtIds = [...new Set(zoneSpecs.flatMap((zone) => zone.districtIds))];
  return fetchJson(
    arcgisUrl(2, {
      where: `DISTRICTID IN (${districtIds.map((id) => `'${id}'`).join(",")})`,
      outFields: "OBJECTID,DISTRICTID,DISTRICTNAMEENG,COMMUNITYID,COMMUNITYNAMEENG,COMMPOPNAMEENG",
      returnGeometry: "true",
      outSR: "4326",
      geometryPrecision: "6",
      maxAllowableOffset: "0.00005",
      f: "geojson",
    })
  );
}

async function fetchBusStops() {
  return fetchJson(
    arcgisUrl(801, {
      where: "1=1",
      geometry: bounds.join(","),
      geometryType: "esriGeometryEnvelope",
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
      outFields: "OBJECTID,GTFS_ID,CODE,NAME,NAME_AR,LONGITUDE,LATITUDE,POINT_TYPE,STOP_NUMBER",
      returnGeometry: "true",
      outSR: "4326",
      geometryPrecision: "6",
      f: "geojson",
    })
  );
}

async function fetchRoute(from, to) {
  const url = new URL(`https://router.project-osrm.org/route/v1/driving/${from.join(",")};${to.join(",")}`);
  url.search = new URLSearchParams({ overview: "full", geometries: "geojson", steps: "false" });
  try {
    const payload = await fetchJson(url);
    const route = payload.routes?.[0];
    if (!route) throw new Error(payload.message || "No OSRM route");
    return {
      geometry: route.geometry,
      distanceKm: route.distance / 1000,
      freeFlowMinutes: route.duration / 60,
      sourceClass: "derived",
      geometrySource: "osm-osrm",
    };
  } catch (error) {
    const distanceKm = haversineKm(from, to) * 1.25;
    return {
      geometry: { type: "LineString", coordinates: [from, to] },
      distanceKm,
      freeFlowMinutes: (distanceKm / 45) * 60,
      sourceClass: "synthetic",
      geometrySource: "straight-line-fallback",
      fallbackReason: error.message,
    };
  }
}

function capacityFor(type) {
  return {
    "urban-arterial": 3600,
    "bridge-arterial": 4800,
    motorway: 6500,
  }[type];
}

function transitHeadway(fromZone, toZone) {
  const central = new Set([
    "al-bateen",
    "al-danah",
    "al-khalidiyah",
    "al-manhal-karamah",
    "al-mushrif",
    "al-nahyan",
    "muroor-al-saadah",
    "al-rawdah",
    "al-zahiyah",
  ]);
  if (central.has(fromZone.id) && central.has(toZone.id)) return 8;
  if (Math.min(fromZone.busStopCount, toZone.busStopCount) >= 20) return 12;
  return 18;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const [communityCollection, rawStops] = await Promise.all([fetchCommunities(), fetchBusStops()]);

  const zoneFeatures = zoneSpecs.map((spec) => {
    const hint = geometryHints[spec.id];
    const candidateFeatures = communityCollection.features.filter((feature) => spec.districtIds.includes(Number(feature.properties.DISTRICTID)));
    const officialFeatures = candidateFeatures.filter((feature) => {
      const centroid = geometryMetrics(feature.geometry).centroid;
      return haversineKm(centroid, hint.center) <= hint.radiusKm;
    });
    if (officialFeatures.length === 0) {
      throw new Error(`Missing official geometry for ${spec.id}`);
    }
    const geometry = combineGeometries(officialFeatures);
    const metrics = geometryMetrics(geometry);
    return {
      type: "Feature",
      id: spec.id,
      geometry,
      properties: {
        id: spec.id,
        name: spec.name,
        officialDistrictIds: spec.districtIds,
        officialDistrictNames: [...new Set(officialFeatures.map((feature) => feature.properties.DISTRICTNAMEENG))],
        officialCommunityIds: officialFeatures.map((feature) => feature.properties.COMMUNITYID),
        officialCommunityNames: officialFeatures.map((feature) => feature.properties.COMMUNITYNAMEENG),
        // `centroid` is the representative activity/network anchor consumed by
        // the simulation. `geometryCentroid` remains the reproducible centroid
        // of the grouped official polygons (important for sprawling districts).
        centroid: hint.center,
        geometryCentroid: metrics.centroid.map((coordinate) => Number(coordinate.toFixed(6))),
        areaKm2: Number(metrics.areaKm2.toFixed(2)),
        geometrySourceClass: "derived",
        source: "adsdiCommunities",
        excludedDisplacedCommunityRecords: candidateFeatures.length - officialFeatures.length,
        mappingNote: spec.mappingNote || null,
      },
    };
  });

  const stopFeatures = [];
  const stopCountByZone = Object.fromEntries(zoneSpecs.map((zone) => [zone.id, 0]));
  for (const feature of rawStops.features) {
    const coordinate = feature.geometry?.coordinates || [feature.properties.LONGITUDE, feature.properties.LATITUDE];
    const zone = zoneFeatures.find((candidate) => pointInGeometry(coordinate, candidate.geometry));
    if (!zone) continue;
    stopCountByZone[zone.id] += 1;
    stopFeatures.push({
      type: "Feature",
      id: `adsdi-bus-${feature.properties.OBJECTID}`,
      geometry: { type: "Point", coordinates: coordinate.map((value) => Number(value.toFixed(6))) },
      properties: {
        id: `adsdi-bus-${feature.properties.OBJECTID}`,
        objectId: feature.properties.OBJECTID,
        gtfsId: feature.properties.GTFS_ID,
        code: feature.properties.CODE,
        name: feature.properties.NAME,
        nameAr: feature.properties.NAME_AR,
        stopNumber: feature.properties.STOP_NUMBER,
        zoneId: zone.id,
        sourceClass: "observed",
        source: "adsdiBusStops",
      },
    });
  }

  const maxStopDensity = Math.max(...zoneFeatures.map((zone) => stopCountByZone[zone.id] / Math.max(1, zone.properties.areaKm2)));
  const zones = zoneSpecs.map((spec) => {
    const feature = zoneFeatures.find((candidate) => candidate.id === spec.id);
    const stopDensity = stopCountByZone[spec.id] / Math.max(1, feature.properties.areaKm2);
    const transitAccessIndex = Math.min(1, 0.15 + 0.85 * Math.sqrt(stopDensity / maxStopDensity));
    return {
      id: spec.id,
      name: spec.name,
      officialDistrictIds: spec.districtIds,
      officialDistrictNames: feature.properties.officialDistrictNames,
      officialCommunityCount: feature.properties.officialCommunityIds.length,
      centroid: feature.properties.centroid,
      geometryCentroid: feature.properties.geometryCentroid,
      areaKm2: feature.properties.areaKm2,
      population2024: spec.population,
      populationComponents: spec.populationComponents || null,
      jobs2024: spec.jobs,
      housingCapacityPersons: Math.ceil((spec.population * 1.15) / 100) * 100,
      jobCapacityPersons: Math.ceil((spec.jobs * 1.12) / 100) * 100,
      enterprisePlaceCapacity: Math.ceil(spec.jobs / 900),
      quality: spec.quality,
      housingRentIndex: spec.housingRentIndex,
      businessRentIndex: spec.businessRentIndex,
      carOwnershipRate: spec.carOwnershipRate,
      averageMonthlySalaryAed: spec.averageMonthlySalaryAed,
      dominantEmployment: spec.dominantEmployment,
      busStopCount: stopCountByZone[spec.id],
      busStopsPerKm2: Number(stopDensity.toFixed(2)),
      transitAccessIndex: Number(transitAccessIndex.toFixed(3)),
      geometryFeatureId: spec.id,
      sourceClassByField: {
        officialDistrictIds: "observed",
        centroid: "synthetic",
        geometryCentroid: "derived",
        areaKm2: "derived",
        population2024: spec.populationClass,
        jobs2024: "synthetic",
        housingCapacityPersons: "synthetic",
        jobCapacityPersons: "synthetic",
        enterprisePlaceCapacity: "synthetic",
        quality: "synthetic",
        housingRentIndex: "synthetic",
        businessRentIndex: "synthetic",
        carOwnershipRate: "synthetic",
        averageMonthlySalaryAed: "synthetic",
        dominantEmployment: "synthetic",
        busStopCount: "derived-from-observed",
        transitAccessIndex: "derived-from-observed",
      },
      mappingNote: spec.mappingNote || null,
    };
  });
  const zoneById = new Map(zones.map((zone) => [zone.id, zone]));

  const roadFeatures = [];
  for (const [fromId, toId, corridorType] of corridorSpecs) {
    const fromZone = zoneById.get(fromId);
    const toZone = zoneById.get(toId);
    const route = await fetchRoute(fromZone.centroid, toZone.centroid);
    const id = `${fromId}--${toId}`;
    roadFeatures.push({
      type: "Feature",
      id,
      geometry: route.geometry,
      properties: {
        id,
        name: `${fromZone.name} — ${toZone.name}`,
        from: fromId,
        to: toId,
        corridorType,
        bidirectional: true,
        distanceKm: Number(route.distanceKm.toFixed(2)),
        freeFlowMinutes: Number(route.freeFlowMinutes.toFixed(1)),
        capacityVehPerHour: capacityFor(corridorType),
        sourceClass: route.sourceClass,
        geometrySource: route.geometrySource,
        sourceClassByField: {
          geometry: route.sourceClass,
          distanceKm: route.sourceClass,
          freeFlowMinutes: route.sourceClass,
          corridorType: "synthetic",
          capacityVehPerHour: "synthetic",
        },
        fallbackReason: route.fallbackReason || null,
      },
    });
  }

  const roadEdges = roadFeatures.map((feature) => ({
    id: feature.id,
    from: feature.properties.from,
    to: feature.properties.to,
    bidirectional: true,
    corridorType: feature.properties.corridorType,
    distanceKm: feature.properties.distanceKm,
    freeFlowMinutes: feature.properties.freeFlowMinutes,
    capacityVehPerHour: feature.properties.capacityVehPerHour,
    geometryFeatureId: feature.id,
    sourceClass: feature.properties.sourceClass,
    sourceClassByField: feature.properties.sourceClassByField,
  }));

  const transitLinks = roadEdges.map((edge) => {
    const fromZone = zoneById.get(edge.from);
    const toZone = zoneById.get(edge.to);
    const headwayMinutes = transitHeadway(fromZone, toZone);
    return {
      id: `bus-${edge.id}`,
      from: edge.from,
      to: edge.to,
      bidirectional: true,
      distanceKm: edge.distanceKm,
      inVehicleMinutes: Number((edge.freeFlowMinutes * 1.35 + 2).toFixed(1)),
      headwayMinutes,
      averageWaitMinutes: headwayMinutes / 2,
      capacityPaxPerHour: Math.round((80 * 60) / headwayMinutes),
      geometryFeatureId: edge.geometryFeatureId,
      topologySourceClass: "derived",
      serviceSourceClass: "synthetic",
      note: "Connectivity follows the static road corridor and official stop presence; this is not an observed bus route or timetable.",
    };
  });

  const studyPopulation = zones.reduce((sum, zone) => sum + zone.population2024, 0);
  const studyJobs = zones.reduce((sum, zone) => sum + zone.jobs2024, 0);
  const fallbackRouteCount = roadFeatures.filter((feature) => feature.properties.sourceClass === "synthetic").length;
  const baseline = {
    schemaVersion: "2.0.0",
    generatedAt: new Date().toISOString(),
    baseYear: 2024,
    scope: {
      name: "Greater Abu Dhabi City — focused UDES v2 study area",
      bounds,
      includedZoneCount: zones.length,
      excluded: ["Al Ain Region", "Al Dhafra Region", "Outer Abu Dhabi Region districts outside the selected metropolitan study area"],
      note: "This is a selected urban system, not the full Abu Dhabi Region. Main-island neighborhoods remain distinct.",
    },
    classifications: {
      observed: "Published directly by the cited government source.",
      derived: "Calculated from observed geometry, stops or an OSM route snapshot.",
      synthetic: "Transparent modeling assumption requiring calibration before policy use.",
      "derived-from-observed": "Calculated solely from cited observed records.",
      reference: "Published evidence consulted as a reasonableness check or rejected implementation source.",
      license: "Reuse and attribution terms for a cited source.",
    },
    files: {
      zones: "zones.geojson",
      roads: "roads.geojson",
      transitStops: "transit-stops.geojson",
    },
    sources,
    calibration: {
      officialAbuDhabiRegionPopulation2024: 2823340,
      officialAbuDhabiRegionPopulationSource: "scadPopulation",
      studyScopePopulation2024: studyPopulation,
      studyScopeShareOfRegion: Number((studyPopulation / 2823340).toFixed(3)),
      studyScopeJobs2024: studyJobs,
      officialMappedDistrictPopulationSubtotal: studyPopulation,
      citizenAgentPersonsRecommended: 250,
      enterpriseAgentJobsRecommended: 1500,
      busTariffReference: {
        source: "abuDhabiBusTariff",
        baseFarePerDirectionAed: 2,
        farePerPassengerKmAed: 0.05,
        maximumFarePerDirectionAed: 5,
        caveat:
          "Pass products, transfers and exemptions are not modeled; scenarios may vary only the base fare while retaining the observed distance rate.",
      },
      historicalAllTripModeShareReference: {
        source: "unHabitatMobility",
        referenceYear: 2015,
        privateCarPercent: 59.6,
        taxiPercent: 4.5,
        privateBusPercent: 13.9,
        publicTransportPercent: 2.3,
        walkingPercent: 19.7,
        caveat:
          "Historical all-trip shares are used only to reject implausible synthetic model outputs; the model represents work trips and requires a current household travel survey for validation.",
      },
      note: "All 18 model-zone population totals are mapped from SCAD's complete 2024 district table: 12 direct mappings and 6 grouped or relabeled mappings derived from observed records. District jobs and behavioral attributes remain synthetic baselines.",
    },
    temporal: {
      simulationStep: "1 calendar day",
      startDate: "2024-01-01",
      displayTimeZone: "Asia/Dubai",
      deterministicClockTimeZone: "UTC",
      modeledWorkdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      dailyProcesses: ["commute assignment", "network loading", "citizen decisions", "labor matching", "enterprise actions"],
      monthlyProcesses: ["household finance close", "enterprise accounts", "operating-margin and hazard update"],
      annualProcesses: ["rent response", "wage growth", "ageing and mortality replacement"],
      sourceClass: "synthetic-model-rule",
      observedDailyProfiles: false,
      caveat:
        "The daily clock is a model cadence, not an observed Abu Dhabi day profile. Holidays, Ramadan schedules, seasonal heat, incidents, and observed hourly road or transit demand are not represented.",
    },
    zones,
    roadGraph: {
      nodes: zones.map((zone) => ({
        id: zone.id,
        zoneId: zone.id,
        coord: zone.centroid,
        sourceClass: "synthetic",
      })),
      edges: roadEdges,
      officialCenterlineAssessment: {
        source: "adsdiRoadCenterline",
        eligibleMajorSegmentsInScope: 13131,
        embedded: false,
        reason:
          "The official layer is a dense inventory without turn restrictions or a ready navigable topology; embedding it would be disproportionate for a browser model. Static OSM/OSRM corridors are used instead.",
      },
      fallbackRouteCount,
    },
    transit: {
      officialStopsInBoundingBox: rawStops.features.length,
      officialStopsAssignedToStudyZones: stopFeatures.length,
      unassignedStopsInBoundingBox: rawStops.features.length - stopFeatures.length,
      links: transitLinks,
      caveat:
        "Stops are observed. Published route and timetable data has not yet been integrated; links, frequency, capacity and travel time remain modeled.",
    },
    assumptions: [
      "All selected-zone population values are mapped from SCAD's complete 2024 Abu Dhabi Region district table: 12 direct mappings and 6 grouped or relabeled mappings derived from observed records.",
      "Jobs, capacities, quality, rent indices, car ownership, salaries and employment themes are synthetic starting values, not forecasts or administrative statistics.",
      "Mode-choice parameters are synthetic and checked only against a historical 2015 all-trip reference reported by UN-Habitat/UITP; they are not a current household-travel-survey calibration.",
      "The reference standard pay-as-you-go bus fare uses Abu Dhabi Mobility's AED 2 base fare plus AED 0.05 per passenger-kilometre in each direction, capped at AED 5 per journey; pass products, transfers and exemptions are not modeled.",
      "Same-zone mode shares, the 45-day commute escalation grace period and financial car-disposal guards are transparent synthetic work-trip calibration choices.",
      "Muroor uses the official Al Sa'adah polygon; Al Manhal represents the combined Al Manhal / Al Karamah label; Rabdan represents Rabdan / Al Maqta.",
      "Road and transit links are aggregate zone connectors, not a segment-level assignment network.",
      "Each zone centroid is a hand-selected representative activity/network anchor; geometryCentroid is calculated from its official grouped community polygons.",
      "All OSM-derived geometry requires visible OpenStreetMap attribution in the UI.",
    ],
  };

  const zonesGeoJson = {
    type: "FeatureCollection",
    name: "udes-v2-abu-dhabi-zones",
    bbox: bounds,
    metadata: {
      source: "adsdiCommunities",
      sourceClass: "derived",
      modified:
        "Official community polygons were simplified, filtered to the contiguous city cluster and grouped by district into the model zones described in baseline.json.",
      attribution: "Department of Government Enablement — Abu Dhabi Spatial Data Infrastructure",
    },
    features: zoneFeatures,
  };
  const roadsGeoJson = {
    type: "FeatureCollection",
    name: "udes-v2-abu-dhabi-road-corridors",
    bbox: bounds,
    metadata: {
      source: "osm / osrm",
      sourceClass: "derived",
      attribution: "© OpenStreetMap contributors",
      note: "Static routed corridors between model-zone centroids; not the full street network.",
    },
    features: roadFeatures,
  };
  const stopsGeoJson = {
    type: "FeatureCollection",
    name: "udes-v2-abu-dhabi-transit-stops",
    bbox: bounds,
    metadata: {
      source: "adsdiBusStops",
      sourceClass: "observed",
      attribution: "Department of Government Enablement — Abu Dhabi Spatial Data Infrastructure",
      note: "Only official stops contained by the selected model-zone polygons are retained.",
    },
    features: stopFeatures,
  };

  const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
  await Promise.all([
    writeFile(path.join(outputDir, "baseline.json"), serialize(baseline)),
    writeFile(path.join(outputDir, "zones.geojson"), serialize(zonesGeoJson)),
    writeFile(path.join(outputDir, "roads.geojson"), serialize(roadsGeoJson)),
    writeFile(path.join(outputDir, "transit-stops.geojson"), serialize(stopsGeoJson)),
  ]);
  console.log(`Built ${zones.length} zones, ${roadEdges.length} road corridors and ${stopFeatures.length} official stops in ${outputDir}`);
}

await main();
