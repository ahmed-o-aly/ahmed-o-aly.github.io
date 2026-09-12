import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";
import { validateRoadNetwork } from "./lib/udes-v2-network-integrity.mjs";
import { deriveTurnRestrictions } from "./lib/udes-v2-turn-restrictions.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectRoot, "assets", "data", "udes-v2");
const snapshotDate = "2026-08-28"; // Last review date for unchanged reference-only sources.
const snapshotDir = path.join(projectRoot, "scripts", "data", "udes-v2-sources");
const refreshSources = process.argv.includes("--refresh-sources");
const sourceRequests = new Map();
let lastOsrmRequestAt = 0;
const bounds = [54.28, 24.24, 54.78, 24.62];

const sources = {
  adsdiCommunities: {
    title: "AD-SDI Open Data: Community",
    url: "https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/2",
    publisher: "Department of Government Enablement, Abu Dhabi Spatial Data Infrastructure",
    classification: "observed",
    use: "Official community polygons grouped by official district ID into model zones",
    retrieved: snapshotDate,
  },
  adsdiRoadCenterline: {
    title: "AD-SDI Open Data: RoadCenterline",
    url: "https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/101",
    publisher: "Department of Government Enablement, Abu Dhabi Spatial Data Infrastructure",
    classification: "reference",
    use: "Inspected as the preferred road source; not embedded because the layer is a dense, non-routable centerline inventory",
    retrieved: snapshotDate,
  },
  adsdiMainRoads: {
    title: "AD-SDI Basemap: Main Roads",
    url: "https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Hosted/BaseMapEng_LightGray_GCS/MapServer/407",
    publisher: "Department of Government Enablement, Abu Dhabi Spatial Data Infrastructure",
    classification: "observed",
    use: "Official directional section attributes (route ID, side, lanes and speed) spatially and semantically matched to the modeled OSM/OSRM road union",
    retrieved: snapshotDate,
  },
  adsdiBusStops: {
    title: "AD-SDI Open Data: Bus Stops",
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
    title: "Abu Dhabi Census: Population 2024",
    url: "https://census.scad.gov.ae/home/population?lang=en",
    publisher: "Statistics Centre: Abu Dhabi",
    classification: "observed",
    use: "Abu Dhabi Region total and the complete 2024 district table returned by the official census indicator endpoint",
    indicatorEndpoint: "https://census.scad.gov.ae/home/IndicatorData",
    indicatorRequest: { contentsetupid: 6010, topicid: 6, itemindex: 0, year: 2024, lang: "en" },
    referenceYear: 2024,
    retrieved: snapshotDate,
  },
  scadLabour2024: {
    title: "Abu Dhabi Census: Employed population 2024",
    url: "https://census.scad.gov.ae/home/labourforce?fid=0&id=0&lang=en&tab=table_employee_population&year=2024",
    publisher: "Statistics Centre: Abu Dhabi",
    classification: "observed",
    use: "Emirate-wide employed-population share used only as the transparent 67% opening employment anchor; subsequent employment is endogenous",
    employedResidents: 2762715,
    residents: 4135985,
    employedResidentShare: 0.6679702658,
    referenceYear: 2024,
    retrieved: snapshotDate,
  },
  scadHousingReference2024: {
    title: "Abu Dhabi Census 2024: property units by top districts and by use",
    url: "https://census.scad.gov.ae/home/realestate?lang=en",
    indicatorEndpoint: "https://census.scad.gov.ae/home/IndicatorData",
    publisher: "Statistics Centre: Abu Dhabi",
    classification: "reference",
    referenceYear: 2024,
    use: "Official stock reference. District totals include nonresidential units and cover only the top ten districts; the residential split is emirate-wide. These tables do not identify residential person capacity for all selected districts.",
  },
  abuDhabiBusTariff: {
    title: "Public Transport Services: Standard Service fare",
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
    title: "National Urban Policy Transport Guide: Figure 21",
    url: "https://unhabitat.org/sites/default/files/2022/03/nup-transport_guide-web.pdf",
    publisher: "UN-Habitat",
    classification: "reference",
    use: "Historical Abu Dhabi all-trip mode shares retained as contextual evidence only; they do not calibrate or validate modeled work-trip shares",
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

const supplyAssumptions = {
  housingSpareCapacityRatio: 0.15,
  jobSpareCapacityRatio: 0.12,
  jobsPerEnterprisePlace: 900,
  sourceClass: "synthetic",
  housingMeaning:
    "Person-equivalent capacity with a uniform 15% opening buffer, retained as an explicit demonstration assumption until residential dwelling type, occupancy and collective accommodation stock can be mapped to all zones.",
  housingEvidenceGap:
    "SCAD publishes top-district total property units and an emirate-wide use split; these cannot be treated as district residential dwelling capacity.",
};

const zoneSpecs = [
  {
    id: "al-bateen",
    name: "Al Bateen / Al Qurm / Al Muzoun",
    shortName: "Al Bateen group",
    districtIds: [1300, 1292, 1287],
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
      "SCAD's combined Al Qurm-Al Muzoun-Al Bateen census district is matched to the union of the three corresponding AD-SDI district groups (1300, 1292, 1287); no population is reassigned to Al Bateen alone.",
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
  "al-bateen": { center: [54.345, 24.452], radiusKm: 15 },
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
  "al-raha": { center: [54.601, 24.455], radiusKm: 16 },
  "yas-island": { center: [54.603, 24.492], radiusKm: 12 },
  "khalifa-city": { center: [54.578, 24.419], radiusKm: 12 },
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

// Only complete district-to-district routes contribute roads. Standalone display seeds are excluded.
const requiredArterialCoverage = [];

const routeRefNames = {
  E10: "Sheikh Zayed bin Sultan Street",
  E12: "Sheikh Khalifa bin Zayed Street",
  E20: "Sweihan Road",
  E22: "Al Ain Road",
  E30: "Musaffah Road (Ar Rawdah Road)",
};

const numberedStreetNames = {
  5: "Hamdan bin Mohammed Street",
  8: "Al Khaleej Al Arabi Street",
  9: "Al Falah Street",
  10: "Khalifa bin Shakhbout Street",
  11: "Hazza bin Zayed the First Street",
  12: "Mubarak bin Mohammed Street",
  13: "Sheikha Fatima bint Mubarak Street",
  14: "Al Karamah Street",
  18: "Sheikh Rashid bin Saeed Street",
  19: "Shakhbout bin Sultan Street",
  20: "Sultan bin Zayed the First Street",
  24: "Sheikh Zayed bin Sultan Street",
  29: "Rabdan Street",
};

const translatedOsmNames = new Map([
  ["شارع الشيخ زايد بن سلطان", "Sheikh Zayed bin Sultan Street"],
  ["شارع الشيخ خليفة بن زايد", "Sheikh Khalifa bin Zayed Street"],
  ["جسر الشيخ خليفة", "Sheikh Khalifa Bridge"],
  ["نفق ميناء زايد", "Zayed Port Tunnel"],
  ["نفق الشيخ زايد", "Sheikh Zayed Tunnel"],
  ["شارع الخَلِيج العَربِي", "Al Khaleej Al Arabi Street"],
  ["جسر الشيخ زايد", "Sheikh Zayed Bridge"],
  ["جسر المقطع", "Maqta Bridge"],
  ["شارع الشيخ راشد بن سعيد", "Sheikh Rashid bin Saeed Street"],
  ["طريق العين", "Al Ain Road"],
  ["طريق سويحان", "Sweihan Road"],
  ["طريق الرَّوضة", "Ar Rawdah Road"],
  ["شارع الكورنيش", "Corniche Street"],
  ["شارع الملك عبدالله بن عبدالعزيز آل سعود", "King Abdullah bin Abdulaziz Al Saud Street"],
  ["شارع محمد بن خليفة الكندي", "Mohammed Bin Khalifa Al Kindi Street"],
  ["شارع الفلاح", "Al Falah Street"],
  ["شارع شخبوط بن سلطان", "Shakhbout bin Sultan Street"],
  ["شارع سلطان بن زايد الأول", "Sultan bin Zayed the First Street"],
  ["شارع هزاع بن زايد الأول", "Hazza bin Zayed the First Street"],
  ["شارع مبارك بن محمد", "Mubarak bin Mohammed Street"],
  ["شارع الشيخة فاطمة بنت مبارك", "Sheikha Fatima bint Mubarak Street"],
  ["شارع الكرامة", "Al Karamah Street"],
  ["شارع حمدان بن محمد", "Hamdan bin Mohammed Street"],
  ["شارع زايد الأول", "Zayed the First Street"],
  ["شارع السعديات", "Saadiyat Street"],
  ["شارع أم يِفينة", "Umm Yifeenah Street"],
  ["شارع ياس", "Yas Street"],
  ["شارع المسرى", "Al Masar Street"],
  ["شارع الاتحاد", "Al Ittihad Street"],
  ["شارع المارِية", "Al Maryah Street"],
]);

function splitRefs(value) {
  return String(value || "")
    .split(/[;,/]/)
    .map((item) =>
      item
        .trim()
        .toUpperCase()
        .replace(/^E0?(\d+)$/, "E$1")
    )
    .filter(Boolean);
}

function englishRoadLabel(step) {
  const refs = splitRefs(step.ref);
  const name = String(step.name || "").trim();
  if (translatedOsmNames.has(name)) return translatedOsmNames.get(name);
  if (/[A-Za-z]/.test(name)) return name;
  for (const ref of refs) {
    if (routeRefNames[ref]) return routeRefNames[ref];
    if (numberedStreetNames[ref]) return numberedStreetNames[ref];
  }
  return null;
}

function routeRoadSummary(route) {
  const steps = (route.legs || []).flatMap((leg) => leg.steps || []);
  const distanceByName = new Map();
  const roadRefs = new Set();
  for (const step of steps) {
    splitRefs(step.ref).forEach((ref) => roadRefs.add(ref));
    const name = englishRoadLabel(step);
    if (!name) continue;
    distanceByName.set(name, (distanceByName.get(name) || 0) + Math.max(0, Number(step.distance) || 0));
  }
  const roadNames = [...distanceByName.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 5)
    .map(([name]) => name);
  return {
    primaryRoad: roadNames[0] || "Inter-district road route",
    roadNames,
    roadRefs: [...roadRefs].filter((ref) => routeRefNames[ref] || numberedStreetNames[ref] || /^E\d+$/.test(ref)).sort(),
  };
}

async function fetchJson(url, options = {}) {
  const method = options.method || "GET";
  const body = options.body ? String(options.body) : null;
  const address = String(url);
  const key = createHash("sha256")
    .update(JSON.stringify({ method, url: address, body }))
    .digest("hex");
  const file = `${key}.json.gz`;
  await mkdir(snapshotDir, { recursive: true });
  let snapshot;
  if (!refreshSources) {
    try {
      snapshot = JSON.parse(gunzipSync(await readFile(path.join(snapshotDir, file))).toString("utf8"));
    } catch (error) {
      if (error.code !== "ENOENT") throw new Error(`Invalid source snapshot ${file}: ${error.message}`);
    }
  }
  if (!snapshot) {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        if (options.source === "osrm") {
          const pause = Math.max(0, 1000 - (Date.now() - lastOsrmRequestAt));
          if (pause) await new Promise((resolve) => setTimeout(resolve, pause));
          lastOsrmRequestAt = Date.now();
        }
        const response = await fetch(address, {
          method,
          ...(body ? { body } : {}),
          headers: { "user-agent": "ahmed-o-aly.github.io UDES v2 data builder", ...(options.headers || {}) },
          signal: AbortSignal.timeout(45000),
        });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${address}`);
        const responseText = await response.text();
        const payload = JSON.parse(responseText);
        if (payload.error) throw new Error(`Source error: ${JSON.stringify(payload.error)}`);
        if (payload.exceededTransferLimit || payload.properties?.exceededTransferLimit) throw new Error(`Truncated source response: ${address}`);
        snapshot = {
          request: { method, url: address, body },
          retrievedAt: new Date().toISOString(),
          sha256: createHash("sha256").update(responseText).digest("hex"),
          responseText,
        };
        await writeFile(path.join(snapshotDir, file), gzipSync(JSON.stringify(snapshot)));
        break;
      } catch (error) {
        lastError = error;
        if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    if (!snapshot) throw lastError;
  }
  if (createHash("sha256").update(snapshot.responseText).digest("hex") !== snapshot.sha256) throw new Error(`Snapshot hash mismatch: ${file}`);
  sourceRequests.set(key, { file, source: options.source || null, ...snapshot.request, retrievedAt: snapshot.retrievedAt, sha256: snapshot.sha256 });
  const payload = JSON.parse(snapshot.responseText);
  if (payload.error || payload.exceededTransferLimit || payload.properties?.exceededTransferLimit)
    throw new Error(`Incomplete cached source: ${file}`);
  return payload;
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
    }),
    { source: "adsdiCommunities" }
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
    }),
    { source: "adsdiBusStops" }
  );
}

async function fetchMainRoads() {
  const url = new URL("https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Hosted/BaseMapEng_LightGray_GCS/MapServer/407/query");
  url.search = new URLSearchParams({
    where: "1=1",
    geometry: bounds.join(","),
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "OBJECTID,SECTION_ID,ROUTE_ID,SIDE,SPEED,LANES,PV_OUT,PV_IN,ROADTYPE,NAMEENGLISH,NAMEARABIC",
    returnGeometry: "true",
    outSR: "4326",
    geometryPrecision: "6",
    f: "geojson",
  });
  return fetchJson(url, { source: "adsdiMainRoads" });
}

function normalizeRouteSteps(route) {
  return (route.legs || [])
    .flatMap((leg) => leg.steps || [])
    .map((step, index) => ({
      index,
      geometry: {
        type: "LineString",
        coordinates: (step.geometry?.coordinates || []).map((coordinate) => coordinate.map((value) => Number(value.toFixed(6)))),
      },
      name: englishRoadLabel(step),
      osmName: String(step.name || "").trim() || null,
      refs: splitRefs(step.ref),
      distanceKm: Math.max(0, Number(step.distance) || 0) / 1000,
      freeFlowMinutes: Math.max(0, Number(step.duration) || 0) / 60,
      maneuver: step.maneuver?.type || null,
      intersections: (step.intersections || []).map((intersection) => ({
        location: intersection.location,
        bearings: intersection.bearings,
        entry: intersection.entry,
        in: intersection.in,
        out: intersection.out,
      })),
      sourceClass: "derived",
    }))
    .filter((step) => step.geometry.coordinates.length >= 2);
}

async function fetchRoute(from, to, options = {}) {
  const url = new URL(`https://router.project-osrm.org/route/v1/driving/${from.join(",")};${to.join(",")}`);
  url.search = new URLSearchParams({
    overview: "full",
    geometries: "geojson",
    steps: "true",
    continue_straight: "false",
    ...(options.fromHint && options.toHint ? { hints: `${options.fromHint};${options.toHint}` } : {}),
  });
  const payload = await fetchJson(url, { source: "osrm" });
  const sourceRequestKey = createHash("sha256")
    .update(JSON.stringify({ method: "GET", url: String(url), body: null }))
    .digest("hex");
  const sourceRequest = sourceRequests.get(sourceRequestKey);
  const route = payload.routes?.[0];
  if (!route) throw new Error(payload.message || "No OSRM route");
  if (!route.geometry?.coordinates?.length || !route.legs?.length) throw new Error(`Incomplete OSRM route: ${url}`);
  return {
    geometry: route.geometry,
    distanceKm: route.distance / 1000,
    freeFlowMinutes: route.duration / 60,
    ...routeRoadSummary(route),
    steps: normalizeRouteSteps(route),
    snappedFrom: (payload.waypoints?.[0]?.location || route.geometry.coordinates[0] || from).map((value) => Number(value.toFixed(6))),
    snappedTo: (payload.waypoints?.at(-1)?.location || route.geometry.coordinates.at(-1) || to).map((value) => Number(value.toFixed(6))),
    forcedArterial: Boolean(options.forcedArterial),
    forcedName: options.forcedName || null,
    forcedRefs: Array.isArray(options.forcedRefs) ? options.forcedRefs : [],
    sourceClass: "derived",
    geometrySource: "osm-osrm",
    sourceRequestUrl: String(url),
    sourceSnapshotFile: sourceRequest.file,
    sourceRetrievedAt: sourceRequest.retrievedAt,
  };
}

async function refreshCensusMappings() {
  const source = sources.scadPopulation;
  const response = await fetchJson(source.indicatorEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(source.indicatorRequest),
    source: "scadPopulation",
  });
  if (typeof response.Data !== "string") throw new Error("SCAD census response has no district table");
  let region = null;
  const records = new Map();
  for (const row of response.Data.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<td\b([^>]*)>([\s\S]*?)<\/td>/gi)];
    if (!cells.length) continue;
    if (cells[0][1].includes('data-column="Region"')) region = cells.shift()[2];
    if (region !== "Abu Dhabi Region" || cells.length < 2) continue;
    records.set(cells[0][2].replaceAll("&#39;", "'"), Number(cells[1][2].replaceAll(",", "")));
  }
  if (records.size < 50) throw new Error("Incomplete SCAD Abu Dhabi Region district table");
  const mappings = {
    "al-bateen": ["Al Qurm-Al Muzoun-Al Bateen"],
    "al-manhal-karamah": ["Al Manhal"],
    "muroor-al-saadah": ["Al Sa'adah"],
    "al-saadiyat": ["Saadiyat Island"],
    "rabdan-al-maqta": ["Rabdan"],
    "al-raha": ["Al Rahah"],
    "mbz-zayed-city": ["Mohamed Bin Zayed City", "Zayed City"],
  };
  for (const spec of zoneSpecs) {
    const names = mappings[spec.id] || [spec.name];
    spec.populationComponents = names.map((name) => {
      const value = records.get(name);
      if (!Number.isFinite(value) || value <= 0) throw new Error(`Missing SCAD population for ${name}`);
      return { name, value, sourceClass: "observed" };
    });
    spec.population = spec.populationComponents.reduce((sum, record) => sum + record.value, 0);
  }
}

async function fetchHousingReferences() {
  const tables = await Promise.all(
    [6025, 6026].map(async (id) => {
      const request = { contentsetupid: id, topicid: 3, itemindex: 0, year: 2024, lang: "en" };
      const response = await fetchJson(sources.scadHousingReference2024.indicatorEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(request),
        source: "scadHousingReference2024",
      });
      if (typeof response.Data !== "string") throw new Error("Missing SCAD property-unit reference table");
      const rows = [...response.Data.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
        .map((row) =>
          [...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) =>
            cell[1]
              .replace(/<[^>]*>/g, "")
              .replaceAll("&nbsp;", "")
              .replaceAll("&amp;", "&")
              .trim()
          )
        )
        .filter((row) => row.length);
      return { indicator: id, request, rows };
    })
  );
  return { source: "scadHousingReference2024", usedForCapacity: false, reason: supplyAssumptions.housingEvidenceGap, tables };
}

function interiorActivityPoint(requested, geometry) {
  if (pointInGeometry(requested, geometry)) return requested;
  let best = null;
  let bestDistance = Infinity;
  // A narrow coastal district can have its centroid in water. Select an
  // interior point, then verify the actual road snap against the polygon too.
  for (let x = -25; x <= 25; x += 1) {
    for (let y = -25; y <= 25; y += 1) {
      const point = [requested[0] + x * 0.0004, requested[1] + y * 0.0004];
      if (!pointInGeometry(point, geometry)) continue;
      const distance = haversineKm(requested, point);
      if (distance < bestDistance) {
        best = point;
        bestDistance = distance;
      }
    }
  }
  if (!best) throw new Error(`No interior activity point within 1.5 km of ${requested.join(",")}`);
  return best.map((value) => Number(value.toFixed(6)));
}

async function pinDistrictGateways(zones, features) {
  for (const zone of zones) {
    const feature = features.find((item) => item.id === zone.id);
    const requested = interiorActivityPoint(zone.centroid, feature.geometry);
    const url = new URL(`https://router.project-osrm.org/nearest/v1/driving/${requested.join(",")}`);
    url.search = new URLSearchParams({ number: "10" });
    const response = await fetchJson(url, { source: "osrm" });
    const waypoint = response.waypoints?.find((candidate) => candidate.hint && pointInGeometry(candidate.location, feature.geometry));
    if (!waypoint || waypoint.distance > 1500) throw new Error(`No valid road gateway inside ${zone.id}`);
    zone.routingHint = waypoint.hint;
    zone.centroid = waypoint.location.map((value) => Number(value.toFixed(6)));
    zone.networkGateway = {
      requestedActivityPoint: requested,
      snappedCoordinate: zone.centroid,
      roadName: waypoint.name || null,
      snapDistanceMeters: Number(waypoint.distance.toFixed(1)),
      source: "osrm",
      selection:
        "Nearest routable road position inside the official grouped district geometry; frozen OSRM hint reused by every origin and destination route.",
    };
    feature.properties.centroid = zone.centroid;
    feature.properties.networkGateway = zone.networkGateway;
  }
}

const topologyCoordinatePrecision = 5;
const maximumCollapsedEdgeKm = 2;
const modeledRoadNameKeys = new Set(
  [
    ...Object.values(routeRefNames),
    ...Object.values(numberedStreetNames),
    ...translatedOsmNames.values(),
    "Corniche Street",
    "King Abdullah bin Abdulaziz Al Saud Street",
    "Ar Rawdah Road",
  ].map((name) => String(name).toLocaleLowerCase("en"))
);

function quantizeCoordinate(coordinate) {
  return coordinate.map((value) => Number(Number(value).toFixed(topologyCoordinatePrecision)));
}

function coordinateKey(coordinate) {
  const [longitude, latitude] = quantizeCoordinate(coordinate);
  return `${longitude.toFixed(topologyCoordinatePrecision)},${latitude.toFixed(topologyCoordinatePrecision)}`;
}

function canonicalSegmentKey(fromKey, toKey) {
  return fromKey < toKey ? `${fromKey}|${toKey}` : `${toKey}|${fromKey}`;
}

function sortedRoadRefs(values) {
  return [...new Set(values)].sort((left, right) => {
    const leftNumber = Number(String(left).replace(/^E/, ""));
    const rightNumber = Number(String(right).replace(/^E/, ""));
    if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber) && leftNumber !== rightNumber) return leftNumber - rightNumber;
    return String(left).localeCompare(String(right));
  });
}

function isModeledArterial(name, refs, forcedArterial = false) {
  if (forcedArterial) return true;
  if (refs.some((ref) => routeRefNames[ref] || numberedStreetNames[ref] || /^E\d+$/.test(ref))) return true;
  if (!name) return false;
  const normalized = String(name).toLocaleLowerCase("en");
  return (
    modeledRoadNameKeys.has(normalized) ||
    /\b(bridge|tunnel|corniche|khaleej|sweihan|al ain road|musaffah road|rawdah road|umm? yifeenah)\b/i.test(name)
  );
}

function roadCapacityAssumption(corridorType) {
  const assumptions = {
    "local-access": { lanesPerDirection: 1, capacityPerLaneVehPerHour: 900 },
    "urban-arterial": { lanesPerDirection: 3, capacityPerLaneVehPerHour: 1600 },
    "bridge-arterial": { lanesPerDirection: 3, capacityPerLaneVehPerHour: 1800 },
    motorway: { lanesPerDirection: 4, capacityPerLaneVehPerHour: 2000 },
  };
  const selected = assumptions[corridorType] || assumptions["urban-arterial"];
  return {
    ...selected,
    capacityVehPerHour: selected.lanesPerDirection * selected.capacityPerLaneVehPerHour,
    capacityDirection: "per direction",
    sourceClass: "synthetic",
  };
}

function median(values) {
  if (!values.length) return 0;
  const ordered = [...values].sort((left, right) => left - right);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
}

function lineStrings(geometry) {
  if (!geometry) return [];
  if (geometry.type === "LineString") return [geometry.coordinates];
  if (geometry.type === "MultiLineString") return geometry.coordinates;
  return [];
}

function normalizedOfficialRouteId(value) {
  const normalized = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/^L_/, "")
    .replace(/^E0+(\d+)$/, "E$1");
  return /^E\d+$/.test(normalized) ? normalized : normalized;
}

function normalizedRoadName(value) {
  return String(value || "")
    .toLocaleLowerCase("en")
    .replace(/\bshk\.?\b/g, "sheikh")
    .replace(/\brd\.?\b/g, "road")
    .replace(/\bst\.?\b/g, "street")
    .replace(/\bal nahyan\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function roadNameSimilarity(left, right) {
  const a = normalizedRoadName(left);
  const b = normalizedRoadName(right);
  if (!a || !b) return 0;
  if (a === b || a.includes(b) || b.includes(a)) return 1;
  const ignored = new Set(["street", "road", "bin", "al", "the"]);
  const aTokens = new Set(a.split(/\s+/).filter((token) => token && !ignored.has(token)));
  const bTokens = new Set(b.split(/\s+/).filter((token) => token && !ignored.has(token)));
  if (!aTokens.size || !bTokens.size) return 0;
  const overlap = [...aTokens].filter((token) => bTokens.has(token)).length;
  return (2 * overlap) / (aTokens.size + bTokens.size);
}

function localVector(from, to, latitude) {
  return [(to[0] - from[0]) * 111.32 * Math.cos((latitude * Math.PI) / 180), (to[1] - from[1]) * 110.574];
}

function pointToSegmentMetrics(point, from, to) {
  const latitude = (point[1] + from[1] + to[1]) / 3;
  const segment = localVector(from, to, latitude);
  const pointVector = localVector(from, point, latitude);
  const lengthSquared = segment[0] ** 2 + segment[1] ** 2;
  const position = lengthSquared ? Math.max(0, Math.min(1, (pointVector[0] * segment[0] + pointVector[1] * segment[1]) / lengthSquared)) : 0;
  const nearest = [segment[0] * position, segment[1] * position];
  return {
    distanceKm: Math.hypot(pointVector[0] - nearest[0], pointVector[1] - nearest[1]),
    segment,
  };
}

function featureBounds(lines) {
  const coordinates = lines.flat();
  return [
    Math.min(...coordinates.map((coordinate) => coordinate[0])),
    Math.min(...coordinates.map((coordinate) => coordinate[1])),
    Math.max(...coordinates.map((coordinate) => coordinate[0])),
    Math.max(...coordinates.map((coordinate) => coordinate[1])),
  ];
}

function expandedBoundsOverlap(left, right, paddingDegrees = 0.0015) {
  return !(
    left[2] + paddingDegrees < right[0] ||
    left[0] - paddingDegrees > right[2] ||
    left[3] + paddingDegrees < right[1] ||
    left[1] - paddingDegrees > right[3]
  );
}

function prepareOfficialMainRoads(collection) {
  return collection.features
    .map((feature) => {
      const lines = lineStrings(feature.geometry).filter((line) => line.length >= 2);
      if (!lines.length) return null;
      const properties = feature.properties || {};
      return {
        id: `adsdi-main-road-${properties.OBJECTID}`,
        objectId: properties.OBJECTID,
        lines,
        bounds: featureBounds(lines),
        sectionId: properties.SECTION_ID || null,
        routeId: normalizedOfficialRouteId(properties.ROUTE_ID),
        rawRouteId: properties.ROUTE_ID || null,
        side:
          String(properties.SIDE || "")
            .trim()
            .toUpperCase() || null,
        speedKph: Number(properties.SPEED) || null,
        lanes: Number(properties.LANES) || null,
        roadType: properties.ROADTYPE || null,
        nameEnglish: String(properties.NAMEENGLISH || "").trim() || null,
        nameArabic: String(properties.NAMEARABIC || "").trim() || null,
      };
    })
    .filter(Boolean);
}

function edgeOfficialGeometryMetrics(edge, official) {
  const coordinates = edge.geometry.coordinates;
  const sampleCount = Math.min(17, coordinates.length);
  const indices = [
    ...new Set(Array.from({ length: sampleCount }, (_, index) => Math.round((index * (coordinates.length - 1)) / Math.max(1, sampleCount - 1)))),
  ];
  const distances = [];
  const alignments = [];
  for (const coordinateIndex of indices) {
    const point = coordinates[coordinateIndex];
    const previous = coordinates[Math.max(0, coordinateIndex - 1)];
    const next = coordinates[Math.min(coordinates.length - 1, coordinateIndex + 1)];
    const edgeVector = localVector(previous, next, point[1]);
    const edgeLength = Math.hypot(...edgeVector);
    let nearest = { distanceKm: Infinity, segment: [0, 0] };
    for (const line of official.lines) {
      for (let index = 1; index < line.length; index += 1) {
        const metrics = pointToSegmentMetrics(point, line[index - 1], line[index]);
        if (metrics.distanceKm < nearest.distanceKm) nearest = metrics;
      }
    }
    distances.push(nearest.distanceKm);
    const officialLength = Math.hypot(...nearest.segment);
    alignments.push(
      edgeLength && officialLength
        ? Math.abs((edgeVector[0] * nearest.segment[0] + edgeVector[1] * nearest.segment[1]) / (edgeLength * officialLength))
        : 0
    );
  }
  const orderedDistances = [...distances].sort((left, right) => left - right);
  return {
    medianDistanceMeters: median(distances) * 1000,
    p90DistanceMeters: orderedDistances[Math.min(orderedDistances.length - 1, Math.ceil(orderedDistances.length * 0.9) - 1)] * 1000,
    coverageWithin75m: distances.filter((distance) => distance <= 0.075).length / Math.max(1, distances.length),
    medianAlignment: median(alignments),
  };
}

function matchOfficialMainRoad(edge, officialRoads) {
  if (!edge.loadBearing && !edge.modelVisible) return null;
  const edgeBounds = featureBounds([edge.geometry.coordinates]);
  const edgeRefs = new Set(edge.roadRefs.map(normalizedOfficialRouteId));
  const edgeEmirateRefs = new Set([...edgeRefs].filter((ref) => /^E\d+$/.test(ref)));
  let best = null;
  for (const official of officialRoads) {
    if (!expandedBoundsOverlap(edgeBounds, official.bounds)) continue;
    // An English-name resemblance is not enough to override conflicting
    // emirate route references (for example an E12 tunnel crossing E10).
    if (official.routeId && /^E\d+$/.test(official.routeId) && edgeEmirateRefs.size && !edgeEmirateRefs.has(official.routeId)) continue;
    const refMatch = Boolean(official.routeId && edgeRefs.has(official.routeId));
    const nameSimilarity = Math.max(0, ...[edge.primaryRoad, ...edge.roadNames].map((name) => roadNameSimilarity(name, official.nameEnglish)));
    const arabicNameMatch = Boolean(official.nameArabic && edge.osmNames.some((name) => name === official.nameArabic));
    const geometry = edgeOfficialGeometryMetrics(edge, official);
    const semanticMatch = refMatch || nameSimilarity >= 0.55 || arabicNameMatch;
    const spatialOnlyMatch =
      edge.modelRole === "mid-route-connector" &&
      geometry.medianDistanceMeters <= 25 &&
      geometry.coverageWithin75m >= 0.8 &&
      geometry.medianAlignment >= 0.85;
    if (
      !(
        (semanticMatch && geometry.medianDistanceMeters <= 120 && geometry.coverageWithin75m >= 0.5 && geometry.medianAlignment >= 0.65) ||
        spatialOnlyMatch
      )
    )
      continue;
    const score =
      (refMatch ? 6 : 0) +
      nameSimilarity * 4 +
      (arabicNameMatch ? 4 : 0) +
      geometry.coverageWithin75m * 2 +
      geometry.medianAlignment * 2 -
      geometry.medianDistanceMeters / 120;
    if (!best || score > best.score) {
      best = {
        official,
        geometry,
        refMatch,
        nameSimilarity,
        arabicNameMatch,
        method: refMatch
          ? "route-ref+spatial"
          : arabicNameMatch
            ? "arabic-name+spatial"
            : nameSimilarity >= 0.55
              ? "english-name+spatial"
              : "high-confidence-spatial",
        score,
      };
    }
  }
  return best;
}

function applyOfficialMainRoadAttributes(graphEdges, officialRoadCollection) {
  const officialRoads = prepareOfficialMainRoads(officialRoadCollection);
  let matchedCount = 0;
  let matchedLoadBearingCount = 0;
  let matchedRenderedCount = 0;
  let laneMatchedCount = 0;
  let laneMatchedRenderedCount = 0;
  for (const edge of graphEdges) {
    const observedAB = Number(edge.directionEvidence?.observedABTraversalCount) || 0;
    const observedBA = Number(edge.directionEvidence?.observedBATraversalCount) || 0;
    const evidenceOneWay = (observedAB === 0) !== (observedBA === 0);
    edge.allowAB = !edge.contextOnly && (!evidenceOneWay || observedAB > 0);
    edge.allowBA = !edge.contextOnly && (!evidenceOneWay || observedBA > 0);
    edge.bidirectional = edge.allowAB && edge.allowBA;
    edge.oneway = edge.contextOnly ? "closed-context" : evidenceOneWay ? (edge.allowAB ? "forward" : "reverse") : null;
    edge.capacityVehPerHourAB = edge.allowAB ? edge.capacityVehPerHour : 0;
    edge.capacityVehPerHourBA = edge.allowBA ? edge.capacityVehPerHour : 0;
    edge.lanesAB = edge.allowAB ? edge.lanesPerDirection : 0;
    edge.lanesBA = edge.allowBA ? edge.lanesPerDirection : 0;
    edge.speedLimitKphAB = null;
    edge.speedLimitKphBA = null;
    edge.officialMainRoadMatch = null;
    edge.sourceClassByField.directionality = "derived";
    const match = matchOfficialMainRoad(edge, officialRoads);
    if (!match) continue;
    matchedCount += 1;
    if (edge.loadBearing) matchedLoadBearingCount += 1;
    if (edge.modelVisible) matchedRenderedCount += 1;
    const { official, geometry } = match;
    const observedLanes = Number.isFinite(official.lanes) && official.lanes > 0 && official.lanes <= 10 ? official.lanes : null;
    const calibrationEligible =
      edge.loadBearing && geometry.coverageWithin75m >= 0.8 && geometry.p90DistanceMeters <= 150 && geometry.medianAlignment >= 0.8;
    if (observedLanes && calibrationEligible) {
      laneMatchedCount += 1;
      if (edge.modelVisible) laneMatchedRenderedCount += 1;
      edge.lanesPerDirection = observedLanes;
      edge.lanesAB = edge.allowAB ? observedLanes : 0;
      edge.lanesBA = edge.allowBA ? observedLanes : 0;
      edge.capacityVehPerHour = observedLanes * edge.capacityPerLaneVehPerHour;
      edge.capacityVehPerHourAB = edge.allowAB ? edge.capacityVehPerHour : 0;
      edge.capacityVehPerHourBA = edge.allowBA ? edge.capacityVehPerHour : 0;
      edge.sourceClassByField.lanesPerDirection = "observed";
      edge.sourceClassByField.capacityVehPerHour = "mixed-derived-synthetic";
    }
    if (official.speedKph && calibrationEligible) {
      edge.speedLimitKphAB = edge.allowAB ? official.speedKph : null;
      edge.speedLimitKphBA = edge.allowBA ? official.speedKph : null;
    }
    edge.officialMainRoadMatch = {
      source: "adsdiMainRoads",
      featureId: official.id,
      objectId: official.objectId,
      sectionId: official.sectionId,
      routeId: official.routeId,
      rawRouteId: official.rawRouteId,
      side: official.side,
      lanes: official.lanes,
      speedKph: official.speedKph,
      roadType: official.roadType,
      nameEnglish: official.nameEnglish,
      nameArabic: official.nameArabic,
      method: match.method,
      medianDistanceMeters: Number(geometry.medianDistanceMeters.toFixed(1)),
      p90DistanceMeters: Number(geometry.p90DistanceMeters.toFixed(1)),
      coverageWithin75m: Number(geometry.coverageWithin75m.toFixed(3)),
      alignment: Number(geometry.medianAlignment.toFixed(3)),
      calibrationEligible,
      capacityApplied: Boolean(observedLanes && calibrationEligible),
      sourceClass: "observed",
    };
    edge.sourceClassByField.officialMainRoadMatch = "observed";
    if (official.routeId) edge.sourceClassByField.officialRouteId = "observed";
    if (official.side) edge.sourceClassByField.officialCarriagewaySide = "observed";
    edge.sourceClassByField.speedLimitKph = official.speedKph && calibrationEligible ? "observed" : "synthetic";
  }
  const eligibleLoadBearingEdgeCount = graphEdges.filter((edge) => edge.loadBearing).length;
  const eligibleRenderedEdgeCount = graphEdges.filter((edge) => edge.modelVisible).length;
  return {
    sourceFeatureCount: officialRoads.length,
    eligibleLoadBearingEdgeCount,
    eligibleRenderedEdgeCount,
    matchedEdgeCount: matchedCount,
    matchedLoadBearingEdgeCount: matchedLoadBearingCount,
    matchedRenderedEdgeCount: matchedRenderedCount,
    laneMatchedEdgeCount: laneMatchedCount,
    laneMatchedRenderedEdgeCount: laneMatchedRenderedCount,
    referenceOnlyMatchedEdgeCount: matchedCount - laneMatchedCount,
    loadBearingMatchRate: Number((matchedLoadBearingCount / Math.max(1, eligibleLoadBearingEdgeCount)).toFixed(3)),
    renderedMatchRate: Number((matchedRenderedCount / Math.max(1, eligibleRenderedEdgeCount)).toFixed(3)),
    capacityCalibrationRate: Number((laneMatchedCount / Math.max(1, eligibleLoadBearingEdgeCount)).toFixed(3)),
    rule: {
      searchRadiusMeters: 120,
      coverageRadiusMeters: 75,
      semanticAcceptance:
        "Matching normalized route reference, Arabic name, or English token similarity >= 0.55, plus >= 50% sampled coverage and alignment >= 0.65.",
      unnamedConnectorAcceptance:
        "Mid-route connectors may use spatial-only matching at <= 25 m median distance, >= 80% sampled coverage and alignment >= 0.85.",
      capacityAcceptance:
        "LANES and SPEED affect model fields only for load-bearing edges with >= 80% sampled coverage within 75 m, p90 distance <= 150 m and alignment >= 0.80; looser accepted matches are retained as reference metadata only.",
      directionality:
        "Every modeled district corridor is routed separately in both directions between fixed road gateways. A physical edge traversed in only one direction across that paired OSRM union is directional; official SIDE is retained as independent carriageway evidence.",
      capacity: "Observed LANES replaces the class lane assumption; per-lane flow remains a transparent synthetic class assumption.",
    },
  };
}

function chooseZoneAnchor(zone, endpointCounts, coordinateByKey) {
  const candidates = [...(endpointCounts.get(zone.id) || new Map()).entries()];
  if (!candidates.length) throw new Error(`No routed network endpoint was found for ${zone.id}`);
  candidates.sort((left, right) => {
    if (right[1] !== left[1]) return right[1] - left[1];
    return haversineKm(coordinateByKey.get(left[0]), zone.centroid) - haversineKm(coordinateByKey.get(right[0]), zone.centroid);
  });
  return candidates[0][0];
}

function buildPhysicalRoadGraph(zones, candidateRouteRecords, arterialSeedRecords, officialMainRoadCollection) {
  const rawSegments = new Map();
  const coordinateByKey = new Map();
  const adjacency = new Map();
  const endpointCounts = new Map(zones.map((zone) => [zone.id, new Map()]));
  const candidateNodeKeys = new Set();

  const rememberCoordinate = (coordinate) => {
    const normalized = quantizeCoordinate(coordinate);
    const key = coordinateKey(normalized);
    if (!coordinateByKey.has(key)) coordinateByKey.set(key, normalized);
    if (!adjacency.has(key)) adjacency.set(key, new Set());
    return key;
  };

  const addRawSegment = (fromCoordinate, toCoordinate, usage) => {
    const fromKey = rememberCoordinate(fromCoordinate);
    const toKey = rememberCoordinate(toCoordinate);
    if (fromKey === toKey) return null;
    const key = canonicalSegmentKey(fromKey, toKey);
    let segment = rawSegments.get(key);
    if (!segment) {
      const [aKey, bKey] = fromKey < toKey ? [fromKey, toKey] : [toKey, fromKey];
      segment = {
        key,
        aKey,
        bKey,
        routeIds: new Set(),
        candidateRouteIds: new Set(),
        seedIds: new Set(),
        corridorTypes: new Set(),
        nameWeights: new Map(),
        osmNameWeights: new Map(),
        refs: new Set(),
        durationSamples: [],
        sourceClasses: new Set(),
        majorVotes: 0,
        aToBTraversalCount: 0,
        bToATraversalCount: 0,
        usageCount: 0,
      };
      rawSegments.set(key, segment);
      adjacency.get(aKey).add(key);
      adjacency.get(bKey).add(key);
    }
    segment.usageCount += 1;
    if (fromKey === segment.aKey) segment.aToBTraversalCount += 1;
    else segment.bToATraversalCount += 1;
    segment.routeIds.add(usage.routeId);
    if (usage.isCandidate) segment.candidateRouteIds.add(usage.routeId);
    if (usage.isSeed) segment.seedIds.add(usage.routeId);
    if (usage.corridorType) segment.corridorTypes.add(usage.corridorType);
    if (usage.name) segment.nameWeights.set(usage.name, (segment.nameWeights.get(usage.name) || 0) + usage.distanceKm);
    if (usage.osmName) segment.osmNameWeights.set(usage.osmName, (segment.osmNameWeights.get(usage.osmName) || 0) + usage.distanceKm);
    for (const ref of usage.refs || []) segment.refs.add(ref);
    if (Number.isFinite(usage.freeFlowMinutes)) segment.durationSamples.push(Math.max(0, usage.freeFlowMinutes));
    segment.sourceClasses.add(usage.sourceClass || "derived");
    if (usage.major) segment.majorVotes += 1;
    return { key, fromKey, toKey };
  };

  const ingestRoute = (record, { isCandidate = false, isSeed = false } = {}) => {
    const stepAttributes = record.steps.map((step) => {
      const stepRefs = step.refs || [];
      const forcedRefs = record.forcedRefs || [];
      const forcedMatch = Boolean(
        record.forcedArterial &&
          (step.maneuver === "fallback" ||
            (record.forcedName && step.name && roadNameSimilarity(step.name, record.forcedName) >= 0.55) ||
            forcedRefs.some((ref) => stepRefs.includes(ref)))
      );
      return {
        name: step.name || (forcedMatch ? record.forcedName : null),
        refs: [...new Set([...stepRefs, ...(forcedMatch ? forcedRefs : [])])],
        forcedMatch,
      };
    });
    const stepMajor = stepAttributes.map((attributes) => isModeledArterial(attributes.name, attributes.refs, attributes.forcedMatch));
    const traversals = [];
    const routeNodeKeys = new Set();
    for (let stepIndex = 0; stepIndex < record.steps.length; stepIndex += 1) {
      const step = record.steps[stepIndex];
      const attributes = stepAttributes[stepIndex];
      const coordinates = step.geometry.coordinates;
      const pairDistances = [];
      let geometryDistanceKm = 0;
      for (let index = 1; index < coordinates.length; index += 1) {
        const distanceKm = haversineKm(coordinates[index - 1], coordinates[index]);
        pairDistances.push(distanceKm);
        geometryDistanceKm += distanceKm;
      }
      for (let index = 1; index < coordinates.length; index += 1) {
        const distanceKm = pairDistances[index - 1];
        if (distanceKm <= 0) continue;
        const share = geometryDistanceKm > 0 ? distanceKm / geometryDistanceKm : 0;
        const traversal = addRawSegment(coordinates[index - 1], coordinates[index], {
          routeId: record.id,
          isCandidate,
          isSeed,
          corridorType: record.corridorType,
          name: attributes.name,
          osmName: step.osmName,
          refs: attributes.refs,
          distanceKm,
          freeFlowMinutes: step.freeFlowMinutes * share,
          sourceClass: step.sourceClass || record.sourceClass,
          major: stepMajor[stepIndex],
        });
        if (!traversal) continue;
        traversals.push(traversal);
        routeNodeKeys.add(traversal.fromKey);
        routeNodeKeys.add(traversal.toKey);
        if (isCandidate) {
          candidateNodeKeys.add(traversal.fromKey);
          candidateNodeKeys.add(traversal.toKey);
        }
      }
    }
    if (!traversals.length) throw new Error(`Route ${record.id} did not produce physical segments`);
    record.rawTraversals = traversals;
    record.rawNodeKeys = routeNodeKeys;
    record.fromEndpointKey = traversals[0].fromKey;
    record.toEndpointKey = traversals.at(-1).toKey;
    if (isCandidate) {
      const fromCounts = endpointCounts.get(record.fromZoneId);
      const toCounts = endpointCounts.get(record.toZoneId);
      fromCounts.set(record.fromEndpointKey, (fromCounts.get(record.fromEndpointKey) || 0) + 1);
      toCounts.set(record.toEndpointKey, (toCounts.get(record.toEndpointKey) || 0) + 1);
    }
  };

  for (const record of candidateRouteRecords) ingestRoute(record, { isCandidate: true });
  for (const record of arterialSeedRecords) ingestRoute(record, { isSeed: true });

  const zoneAnchorKeyById = new Map();
  for (const zone of zones) zoneAnchorKeyById.set(zone.id, chooseZoneAnchor(zone, endpointCounts, coordinateByKey));
  // A frozen OSRM hint pins each endpoint to its actual road segment. Never
  // invent a line between independently snapped carriageways or seed geometry.
  for (const route of candidateRouteRecords) {
    if (route.fromEndpointKey !== zoneAnchorKeyById.get(route.fromZoneId) || route.toEndpointKey !== zoneAnchorKeyById.get(route.toZoneId)) {
      throw new Error("Inconsistent snapped gateway on route " + route.id + "; fix the OSRM endpoint instead of attaching synthetic roads");
    }
  }

  // A district's representative point may snap partway down a cul-de-sac.
  // Move only such shared terminal stems to their first actual road junction,
  // then trim the real approach geometry from every affected route. The
  // analytical network therefore ends at connected district gateways rather
  // than displaying dead-end access stubs or inventing cross-street links.
  const trimmedGatewayApproaches = [];
  for (const zone of zones) {
    const originalKey = zoneAnchorKeyById.get(zone.id);
    if (adjacency.get(originalKey)?.size !== 1) continue;
    let currentKey = originalKey;
    let previousSegmentKey = null;
    let distanceKm = 0;
    while ((adjacency.get(currentKey)?.size || 0) < 3) {
      const key = [...(adjacency.get(currentKey) || [])].find((candidate) => candidate !== previousSegmentKey);
      if (!key) throw new Error(`District ${zone.id} has no connected road junction`);
      const segment = rawSegments.get(key);
      const nextKey = segment.aKey === currentKey ? segment.bKey : segment.aKey;
      distanceKm += haversineKm(coordinateByKey.get(currentKey), coordinateByKey.get(nextKey));
      if (distanceKm > 2.5) throw new Error(`District ${zone.id} gateway is over 2.5 km from a road junction`);
      previousSegmentKey = key;
      currentKey = nextKey;
    }
    for (const route of candidateRouteRecords) {
      if (route.fromZoneId === zone.id) {
        const start = route.rawTraversals.findIndex((item) => item.fromKey === currentKey);
        if (start < 0) throw new Error(`Cannot trim ${route.id} to its district gateway`);
        route.rawTraversals = route.rawTraversals.slice(start);
      }
      if (route.toZoneId === zone.id) {
        const end = route.rawTraversals.findLastIndex((item) => item.toKey === currentKey);
        if (end < 0) throw new Error(`Cannot trim ${route.id} to its district gateway`);
        route.rawTraversals = route.rawTraversals.slice(0, end + 1);
      }
    }
    const junctionCoordinate = coordinateByKey.get(currentKey);
    zoneAnchorKeyById.set(zone.id, currentKey);
    zone.networkGateway.routedSnapCoordinate = zone.networkGateway.snappedCoordinate;
    zone.networkGateway.snappedCoordinate = junctionCoordinate;
    zone.networkGateway.trimmedApproachMeters = Number((distanceKm * 1000).toFixed(1));
    zone.networkGateway.selection += " A shared cul-de-sac approach is trimmed to its first real road junction.";
    zone.centroid = junctionCoordinate;
    trimmedGatewayApproaches.push({ zoneId: zone.id, distanceMeters: zone.networkGateway.trimmedApproachMeters });
  }
  const retainedSegments = new Set(candidateRouteRecords.flatMap((route) => route.rawTraversals.map((item) => item.key)));
  for (const [key, segment] of rawSegments) {
    if (retainedSegments.has(key)) continue;
    rawSegments.delete(key);
    adjacency.get(segment.aKey).delete(key);
    adjacency.get(segment.bKey).delete(key);
  }

  const rawMetadata = new Map();
  for (const segment of rawSegments.values()) {
    const roadRefs = sortedRoadRefs(segment.refs);
    const roadNames = [...segment.nameWeights.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([name]) => name);
    const osmNames = [...segment.osmNameWeights.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([name]) => name);
    const hidden = false; // Keep the complete real road geometry visible.
    const midRouteConnector = !hidden && segment.majorVotes === 0;
    const primaryRoad =
      roadNames[0] ||
      roadRefs.map((ref) => routeRefNames[ref] || numberedStreetNames[ref]).find(Boolean) ||
      (hidden ? "Zone access connector" : midRouteConnector ? "Unnamed OSM road connector" : "Modeled arterial");
    const gateway = roadRefs.some((ref) => /^E\d+$/.test(ref)) || /\b(bridge|tunnel|yifeenah)\b/i.test(primaryRoad);
    const inheritedCorridorType = segment.corridorTypes.has("urban-arterial")
      ? "urban-arterial"
      : segment.corridorTypes.has("bridge-arterial")
        ? "bridge-arterial"
        : segment.corridorTypes.has("motorway")
          ? "motorway"
          : "urban-arterial";
    const corridorType = hidden
      ? "local-access"
      : roadRefs.some((ref) => /^E\d+$/.test(ref))
        ? "motorway"
        : gateway
          ? "bridge-arterial"
          : midRouteConnector
            ? inheritedCorridorType
            : "urban-arterial";
    const capacity = roadCapacityAssumption(corridorType);
    const distanceKm = haversineKm(coordinateByKey.get(segment.aKey), coordinateByKey.get(segment.bKey));
    const freeFlowMinutes = median(segment.durationSamples) || (distanceKm / (hidden ? 30 : corridorType === "motorway" ? 90 : 55)) * 60;
    const metadata = {
      hidden,
      modelVisible: true,
      primaryRoad,
      roadNames,
      osmNames,
      roadRefs,
      corridorType,
      gateway,
      modelRole: hidden ? "zone-access" : midRouteConnector ? "mid-route-connector" : gateway ? "gateway" : "named-arterial",
      hiddenReason: null,
      distanceKm,
      freeFlowMinutes,
      ...capacity,
    };
    metadata.signature = [
      hidden ? "hidden" : "visible",
      corridorType,
      primaryRoad.toLocaleLowerCase("en"),
      osmNames[0] || "",
      roadRefs.join(","),
      capacity.lanesPerDirection,
    ].join("|");
    rawMetadata.set(segment.key, metadata);
  }

  const forcedNodeKeys = new Set(zoneAnchorKeyById.values());
  for (const [nodeKey, segmentKeys] of adjacency) {
    if (segmentKeys.size !== 2) {
      forcedNodeKeys.add(nodeKey);
      continue;
    }
    const signatures = new Set([...segmentKeys].map((segmentKey) => rawMetadata.get(segmentKey).signature));
    if (signatures.size !== 1) forcedNodeKeys.add(nodeKey);
  }

  const visitedSegments = new Set();
  const collapsedEdges = [];
  const rawSegmentToEdge = new Map();
  const sortedRawSegmentKeys = [...rawSegments.keys()].sort();
  for (const initialSegmentKey of sortedRawSegmentKeys) {
    if (visitedSegments.has(initialSegmentKey)) continue;
    const initialSegment = rawSegments.get(initialSegmentKey);
    const signature = rawMetadata.get(initialSegmentKey).signature;
    const startKey = forcedNodeKeys.has(initialSegment.aKey)
      ? initialSegment.aKey
      : forcedNodeKeys.has(initialSegment.bKey)
        ? initialSegment.bKey
        : initialSegment.aKey;
    const geometry = [coordinateByKey.get(startKey)];
    const chainSegments = [];
    let currentNodeKey = startKey;
    let currentSegmentKey = initialSegmentKey;
    let chainDistanceKm = 0;
    while (currentSegmentKey) {
      const currentSegment = rawSegments.get(currentSegmentKey);
      const nextNodeKey = currentSegment.aKey === currentNodeKey ? currentSegment.bKey : currentSegment.aKey;
      const currentMetadata = rawMetadata.get(currentSegmentKey);
      visitedSegments.add(currentSegmentKey);
      chainSegments.push({ key: currentSegmentKey, fromKey: currentNodeKey, toKey: nextNodeKey });
      chainDistanceKm += currentMetadata.distanceKm;
      geometry.push(coordinateByKey.get(nextNodeKey));
      currentNodeKey = nextNodeKey;
      if (currentNodeKey === startKey || forcedNodeKeys.has(currentNodeKey) || chainDistanceKm >= maximumCollapsedEdgeKm) break;
      const candidates = [...(adjacency.get(currentNodeKey) || [])].filter(
        (segmentKey) => !visitedSegments.has(segmentKey) && rawMetadata.get(segmentKey).signature === signature
      );
      if (candidates.length !== 1) break;
      currentSegmentKey = candidates[0];
    }
    const baseMetadata = rawMetadata.get(chainSegments[0].key);
    const routeIds = new Set();
    const candidateRouteIds = new Set();
    const seedIds = new Set();
    const sourceClasses = new Set();
    let distanceKm = 0;
    let freeFlowMinutes = 0;
    let observedABTraversalCount = Infinity;
    let observedBATraversalCount = Infinity;
    for (const item of chainSegments) {
      const rawSegment = rawSegments.get(item.key);
      const metadata = rawMetadata.get(item.key);
      rawSegment.routeIds.forEach((id) => routeIds.add(id));
      rawSegment.candidateRouteIds.forEach((id) => candidateRouteIds.add(id));
      rawSegment.seedIds.forEach((id) => seedIds.add(id));
      rawSegment.sourceClasses.forEach((sourceClass) => sourceClasses.add(sourceClass));
      const chainFollowsCanonical = item.fromKey === rawSegment.aKey;
      observedABTraversalCount = Math.min(
        observedABTraversalCount,
        chainFollowsCanonical ? rawSegment.aToBTraversalCount : rawSegment.bToATraversalCount
      );
      observedBATraversalCount = Math.min(
        observedBATraversalCount,
        chainFollowsCanonical ? rawSegment.bToATraversalCount : rawSegment.aToBTraversalCount
      );
      distanceKm += metadata.distanceKm;
      freeFlowMinutes += metadata.freeFlowMinutes;
    }
    const edge = {
      fromKey: startKey,
      toKey: currentNodeKey,
      geometry,
      chainSegments,
      hidden: baseMetadata.hidden,
      modelVisible: baseMetadata.modelVisible,
      primaryRoad: baseMetadata.primaryRoad,
      roadNames: baseMetadata.roadNames,
      osmNames: baseMetadata.osmNames,
      roadRefs: baseMetadata.roadRefs,
      corridorType: baseMetadata.corridorType,
      gateway: baseMetadata.gateway,
      modelRole: baseMetadata.modelRole,
      hiddenReason: baseMetadata.hiddenReason,
      lanesPerDirection: baseMetadata.lanesPerDirection,
      capacityPerLaneVehPerHour: baseMetadata.capacityPerLaneVehPerHour,
      capacityVehPerHour: baseMetadata.capacityVehPerHour,
      capacityDirection: baseMetadata.capacityDirection,
      distanceKm,
      freeFlowMinutes,
      routeIds: [...routeIds].sort(),
      candidateRouteIds: [...candidateRouteIds].sort(),
      seedIds: [...seedIds].sort(),
      observedABTraversalCount,
      observedBATraversalCount,
      sourceClass: sourceClasses.has("synthetic") ? "mixed-derived-synthetic" : "derived",
    };
    collapsedEdges.push(edge);
  }

  collapsedEdges.sort(
    (left, right) =>
      left.fromKey.localeCompare(right.fromKey) || left.toKey.localeCompare(right.toKey) || left.primaryRoad.localeCompare(right.primaryRoad)
  );
  collapsedEdges.forEach((edge, index) => {
    edge.id = `road-edge-${String(index + 1).padStart(4, "0")}`;
    for (const item of edge.chainSegments) rawSegmentToEdge.set(item.key, { edge, fromKey: item.fromKey, toKey: item.toKey });
  });

  const endpointKeys = new Set(collapsedEdges.flatMap((edge) => [edge.fromKey, edge.toKey]));
  const zoneIdsByAnchorKey = new Map();
  for (const [zoneId, anchorKey] of zoneAnchorKeyById) {
    if (!zoneIdsByAnchorKey.has(anchorKey)) zoneIdsByAnchorKey.set(anchorKey, []);
    zoneIdsByAnchorKey.get(anchorKey).push(zoneId);
  }
  const nodeIdByKey = new Map();
  const nodes = [...endpointKeys].sort().map((key, index) => {
    const id = `road-node-${String(index + 1).padStart(4, "0")}`;
    nodeIdByKey.set(key, id);
    const zoneIds = (zoneIdsByAnchorKey.get(key) || []).sort();
    const rawDegree = adjacency.get(key)?.size || 0;
    return {
      id,
      coord: coordinateByKey.get(key),
      kind: zoneIds.length ? "zone-anchor" : rawDegree > 2 ? "junction" : "shape-break",
      zoneIds,
      rawDegree,
      sourceClass: "derived",
    };
  });

  const graphEdges = collapsedEdges.map((edge) => {
    const hidden = false;
    const modelVisible = true;
    return {
      id: edge.id,
      from: nodeIdByKey.get(edge.fromKey),
      to: nodeIdByKey.get(edge.toKey),
      bidirectional: true,
      hidden,
      // Every edge is real routed road geometry. A route's first/last-mile
      // position does not exempt shared physical streets from congestion.
      loadBearing: true,
      capacityExclusionReason: null,
      modelVisible,
      displayClass:
        edge.modelVisible && edge.candidateRouteIds.length === 0 && edge.seedIds.length > 0
          ? "context"
          : edge.hidden
            ? "access"
            : edge.modelRole === "mid-route-connector"
              ? "connector"
              : edge.gateway
                ? "gateway"
                : "arterial",
      modelRole: edge.modelVisible && edge.candidateRouteIds.length === 0 && edge.seedIds.length > 0 ? "reference-context" : edge.modelRole,
      hiddenReason: null,
      contextOnly: modelVisible && edge.candidateRouteIds.length === 0 && edge.seedIds.length > 0,
      corridorType: edge.corridorType,
      primaryRoad: edge.primaryRoad,
      roadNames: edge.roadNames,
      osmNames: edge.osmNames,
      roadRefs: edge.roadRefs,
      distanceKm: Number(edge.distanceKm.toFixed(3)),
      freeFlowMinutes: Number(edge.freeFlowMinutes.toFixed(2)),
      lanesPerDirection: edge.lanesPerDirection,
      capacityPerLaneVehPerHour: edge.capacityPerLaneVehPerHour,
      capacityVehPerHour: edge.capacityVehPerHour,
      capacityDirection: edge.capacityDirection,
      geometryFeatureId: edge.id,
      candidateRouteIds: edge.candidateRouteIds,
      seedIds: edge.seedIds,
      directionEvidence: {
        observedABTraversalCount: edge.observedABTraversalCount,
        observedBATraversalCount: edge.observedBATraversalCount,
        source: "osm-osrm-directional-route-union",
        sourceClass: "derived",
      },
      sourceClass: edge.sourceClass,
      sourceClassByField: {
        topology: "derived",
        geometry: "derived",
        primaryRoad: "derived",
        roadNames: "derived",
        osmNames: "derived",
        roadRefs: "derived",
        hidden: "synthetic",
        hiddenReason: "synthetic",
        modelRole: "synthetic",
        loadBearing: "synthetic",
        capacityExclusionReason: "synthetic",
        modelVisible: "synthetic",
        contextOnly: "derived",
        directionEvidence: "derived",
        lanesPerDirection: "synthetic",
        capacityVehPerHour: "synthetic",
      },
      geometry: { type: "LineString", coordinates: edge.geometry },
    };
  });
  const officialAttributeJoin = applyOfficialMainRoadAttributes(graphEdges, officialMainRoadCollection);
  const graphEdgeById = new Map(graphEdges.map((edge) => [edge.id, edge]));

  for (const zone of zones) {
    const nodeId = nodeIdByKey.get(zoneAnchorKeyById.get(zone.id));
    if (!nodeId) throw new Error(`Collapsed graph omitted zone anchor for ${zone.id}`);
    zone.networkNodeId = nodeId;
    zone.sourceClassByField.networkNodeId = "derived";
  }

  const candidateRoutes = candidateRouteRecords.map((route) => {
    const traversals = [];
    for (const rawTraversal of route.rawTraversals) {
      const mapping = rawSegmentToEdge.get(rawTraversal.key);
      if (!mapping) throw new Error(`Candidate route ${route.id} lost raw segment ${rawTraversal.key}`);
      const direction = mapping.fromKey === rawTraversal.fromKey && mapping.toKey === rawTraversal.toKey ? 1 : -1;
      const previous = traversals.at(-1);
      if (previous?.edgeId === mapping.edge.id && previous.direction === direction) continue;
      traversals.push({ edgeId: mapping.edge.id, direction });
    }
    for (const traversal of traversals) {
      const edge = graphEdgeById.get(traversal.edgeId);
      if ((traversal.direction === 1 && !edge.allowAB) || (traversal.direction === -1 && !edge.allowBA)) {
        throw new Error(`Directional candidate ${route.id} violates ${edge.id} ${traversal.direction === 1 ? "AB" : "BA"}`);
      }
    }
    return {
      id: route.id,
      role: "zone-pair routing candidate",
      routeLabel: route.routeLabel,
      from: route.fromZoneId,
      to: route.toZoneId,
      fromNodeId: zones.find((zone) => zone.id === route.fromZoneId).networkNodeId,
      toNodeId: zones.find((zone) => zone.id === route.toZoneId).networkNodeId,
      bidirectional: route.bidirectional !== false,
      directionalPairId: route.directionalPairId || null,
      pairedCandidateRouteId: route.pairedCandidateRouteId || null,
      corridorType: route.corridorType,
      primaryRoad: route.primaryRoad,
      roadNames: route.roadNames,
      roadRefs: route.roadRefs,
      distanceKm: Number(traversals.reduce((sum, item) => sum + graphEdgeById.get(item.edgeId).distanceKm, 0).toFixed(3)),
      freeFlowMinutes: Number(traversals.reduce((sum, item) => sum + graphEdgeById.get(item.edgeId).freeFlowMinutes, 0).toFixed(2)),
      traversals,
      edgeIds: traversals.map((traversal) => traversal.edgeId),
      visibleEdgeIds: traversals.map((traversal) => traversal.edgeId).filter((edgeId) => graphEdgeById.get(edgeId).modelVisible),
      sourceClass: route.sourceClass,
      geometrySource: route.geometrySource,
      sourceClassByField: {
        topology: route.sourceClass,
        distanceKm: route.sourceClass,
        freeFlowMinutes: route.sourceClass,
        primaryRoad: "derived",
        roadNames: "derived",
        roadRefs: "derived",
        corridorType: "synthetic",
        bidirectional: "derived",
        directionalPairId: "derived",
      },
      fallbackReason: route.fallbackReason || null,
      sourceRequest: { url: route.sourceRequestUrl, snapshotFile: route.sourceSnapshotFile, retrievedAt: route.sourceRetrievedAt },
    };
  });

  const roadFeatures = graphEdges
    .filter((edge) => edge.modelVisible)
    .map((edge) => ({
      type: "Feature",
      id: edge.id,
      geometry: edge.geometry,
      properties: {
        id: edge.id,
        name: edge.primaryRoad,
        primaryRoad: edge.primaryRoad,
        roadNames: edge.roadNames,
        osmNames: edge.osmNames,
        roadRefs: edge.roadRefs,
        fromNodeId: edge.from,
        toNodeId: edge.to,
        corridorType: edge.corridorType,
        displayClass: edge.displayClass,
        modelRole: edge.modelRole,
        loadBearing: edge.loadBearing,
        capacityExclusionReason: edge.capacityExclusionReason,
        modelVisible: edge.modelVisible,
        contextOnly: edge.contextOnly,
        bidirectional: edge.bidirectional,
        oneway: edge.oneway,
        distanceKm: edge.distanceKm,
        freeFlowMinutes: edge.freeFlowMinutes,
        lanesPerDirection: edge.lanesPerDirection,
        capacityPerLaneVehPerHour: edge.capacityPerLaneVehPerHour,
        capacityVehPerHour: edge.capacityVehPerHour,
        capacityDirection: edge.capacityDirection,
        allowAB: edge.allowAB,
        allowBA: edge.allowBA,
        lanesAB: edge.lanesAB,
        lanesBA: edge.lanesBA,
        capacityVehPerHourAB: edge.capacityVehPerHourAB,
        capacityVehPerHourBA: edge.capacityVehPerHourBA,
        speedLimitKphAB: edge.speedLimitKphAB,
        speedLimitKphBA: edge.speedLimitKphBA,
        officialMainRoadMatch: edge.officialMainRoadMatch,
        directionEvidence: edge.directionEvidence,
        candidateRouteIds: edge.candidateRouteIds,
        seedIds: edge.seedIds,
        sourceClass: edge.sourceClass,
        geometrySource: "osm-osrm-shared-segment-union",
        sourceClassByField: edge.sourceClassByField,
      },
    }));

  const missingCoverage = requiredArterialCoverage.filter(
    (required) =>
      !graphEdges.some(
        (edge) =>
          edge.modelVisible &&
          (!required.name || edge.roadNames.includes(required.name) || edge.primaryRoad === required.name) &&
          (!required.ref || edge.roadRefs.includes(required.ref))
      )
  );
  if (missingCoverage.length) throw new Error(`Missing required arterial coverage: ${missingCoverage.map((item) => item.label).join(", ")}`);
  const turnModel = deriveTurnRestrictions(nodes, graphEdges, candidateRouteRecords, candidateRoutes);
  const integrity = validateRoadNetwork(zones, nodes, graphEdges, candidateRoutes, roadFeatures, turnModel.restrictions);

  return {
    nodes,
    edges: graphEdges,
    candidateRoutes,
    turnRestrictions: turnModel.restrictions,
    turnRestrictionEvidence: turnModel.evidence,
    roadFeatures,
    rawSegmentCount: rawSegments.size,
    visibleEdgeCount: graphEdges.filter((edge) => edge.modelVisible).length,
    loadBearingEdgeCount: graphEdges.filter((edge) => edge.loadBearing).length,
    hiddenAccessEdgeCount: graphEdges.filter((edge) => edge.hidden).length,
    nonRenderedMidRouteConnectorEdgeCount: graphEdges.filter((edge) => edge.loadBearing && !edge.modelVisible).length,
    visibleNamedNetworkEdgeCount: graphEdges.filter((edge) => edge.modelVisible && edge.roadNames.length > 0).length,
    forcedAttachmentEdgeCount: graphEdges.filter((edge) => edge.hiddenReason === "forced-network-attachment").length,
    contextOnlyEdgeCount: graphEdges.filter((edge) => edge.contextOnly).length,
    directionalEdgeCount: graphEdges.filter((edge) => edge.allowAB !== edge.allowBA).length,
    bidirectionalEdgeCount: graphEdges.filter((edge) => edge.allowAB && edge.allowBA).length,
    closedContextEdgeCount: graphEdges.filter((edge) => !edge.allowAB && !edge.allowBA && edge.contextOnly).length,
    officialAttributeJoin,
    arterialCoverage: [
      ...new Set(graphEdges.filter((edge) => edge.displayClass === "arterial" || edge.displayClass === "gateway").map((edge) => edge.primaryRoad)),
    ].sort(),
    integrity,
    trimmedGatewayApproaches,
  };
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const [communityCollection, rawStops, officialMainRoadCollection, housingStockReference] = await Promise.all([
    fetchCommunities(),
    fetchBusStops(),
    fetchMainRoads(),
    fetchHousingReferences(),
    refreshCensusMappings(),
  ]);

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
      shortName: spec.shortName || spec.name,
      officialDistrictIds: spec.districtIds,
      officialDistrictNames: feature.properties.officialDistrictNames,
      officialCommunityCount: feature.properties.officialCommunityIds.length,
      centroid: feature.properties.centroid,
      geometryCentroid: feature.properties.geometryCentroid,
      areaKm2: feature.properties.areaKm2,
      population2024: spec.population,
      populationComponents: spec.populationComponents || null,
      jobs2024: spec.jobs,
      housingCapacityPersons: Math.ceil((spec.population * (1 + supplyAssumptions.housingSpareCapacityRatio)) / 100) * 100,
      jobCapacityPersons: Math.ceil((spec.jobs * (1 + supplyAssumptions.jobSpareCapacityRatio)) / 100) * 100,
      enterprisePlaceCapacity: Math.ceil(spec.jobs / supplyAssumptions.jobsPerEnterprisePlace),
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
  await pinDistrictGateways(zones, zoneFeatures);
  const zoneById = new Map(zones.map((zone) => [zone.id, zone]));

  const candidateRouteRecords = [];
  const corridorTypeByPair = new Map(corridorSpecs.map(([from, to, type]) => [[from, to].sort().join("<->"), type]));
  const completeRoadPairs = zones.flatMap((from, index) =>
    zones.slice(index + 1).map((to) => [from.id, to.id, corridorTypeByPair.get([from.id, to.id].sort().join("<->")) || "urban-arterial"])
  );
  for (const [fromId, toId, corridorType] of completeRoadPairs) {
    const fromZone = zoneById.get(fromId);
    const toZone = zoneById.get(toId);
    const forwardId = `${fromId}--${toId}`;
    const reverseId = `${toId}--${fromId}`;
    const directionalPairId = [fromId, toId].sort().join("<->");
    const forwardRoute = await fetchRoute(fromZone.centroid, toZone.centroid, { fromHint: fromZone.routingHint, toHint: toZone.routingHint });
    candidateRouteRecords.push({
      id: forwardId,
      fromZoneId: fromId,
      toZoneId: toId,
      routeLabel: `${fromZone.name} to ${toZone.name}`,
      corridorType,
      directionalPairId,
      pairedCandidateRouteId: reverseId,
      bidirectional: false,
      ...forwardRoute,
    });
    const reverseRoute = await fetchRoute(toZone.centroid, fromZone.centroid, { fromHint: toZone.routingHint, toHint: fromZone.routingHint });
    candidateRouteRecords.push({
      id: reverseId,
      fromZoneId: toId,
      toZoneId: fromId,
      routeLabel: `${toZone.name} to ${fromZone.name}`,
      corridorType,
      directionalPairId,
      pairedCandidateRouteId: forwardId,
      bidirectional: false,
      ...reverseRoute,
    });
    if (candidateRouteRecords.length % 18 === 0)
      process.stdout.write(`Prepared ${candidateRouteRecords.length}/${zones.length * (zones.length - 1)} directed district road routes\n`);
  }

  const arterialSeedRecords = [];

  const physicalRoadGraph = buildPhysicalRoadGraph(zones, candidateRouteRecords, arterialSeedRecords, officialMainRoadCollection);
  const roadFeatures = physicalRoadGraph.roadFeatures;
  const roadEdges = physicalRoadGraph.edges;
  const candidateRoutes = physicalRoadGraph.candidateRoutes;
  for (const zone of zones) delete zone.routingHint;

  for (const feature of zoneFeatures) {
    const zone = zoneById.get(feature.id);
    if (!pointInGeometry(zone.centroid, feature.geometry)) throw new Error(`Network gateway lies outside ${zone.id}`);
    feature.properties.centroid = zone.centroid;
    feature.properties.networkGateway = zone.networkGateway;
    feature.properties.networkNodeId = zone.networkNodeId;
    feature.properties.sourceClassByField = {
      ...(feature.properties.sourceClassByField || {}),
      networkNodeId: "derived",
    };
  }

  const transitServiceAssumptions = JSON.parse(await readFile(path.join(projectRoot, "scripts/data/udes-v2-transit-services.json"), "utf8"));
  const routeById = new Map(candidateRoutes.map((route) => [route.id, route]));
  const transitLinks = transitServiceAssumptions.services.map((service) => {
    const route = routeById.get(service.candidateRouteId);
    if (!route) throw new Error(`Missing physical path for retained transit service ${service.id}`);
    return {
      id: `bus-${route.id}`,
      from: route.from,
      to: route.to,
      fromNodeId: route.fromNodeId,
      toNodeId: route.toNodeId,
      bidirectional: route.bidirectional,
      directionalPairId: route.directionalPairId,
      pairedCandidateRouteId: route.pairedCandidateRouteId,
      distanceKm: route.distanceKm,
      inVehicleMinutes: service.inVehicleMinutes,
      headwayMinutes: service.headwayMinutes,
      averageWaitMinutes: service.averageWaitMinutes,
      capacityPaxPerHour: service.capacityPaxPerHour,
      candidateRouteId: route.id,
      traversals: route.traversals,
      edgeIds: route.edgeIds,
      visibleEdgeIds: route.visibleEdgeIds,
      geometryFeatureId: route.visibleEdgeIds[0] || null,
      topologySourceClass: "derived",
      serviceSourceClass: "synthetic",
      note: "Connectivity follows a candidate path through the shared physical road graph and official stop presence; this is not an observed bus route or timetable.",
    };
  });

  const studyPopulation = zones.reduce((sum, zone) => sum + zone.population2024, 0);
  const studyJobs = zones.reduce((sum, zone) => sum + zone.jobs2024, 0);
  const fallbackRouteCount = candidateRouteRecords.filter((route) => route.sourceClass === "synthetic").length;
  const fallbackArterialSeedCount = arterialSeedRecords.filter((route) => route.sourceClass === "synthetic").length;
  const requests = [...sourceRequests.values()].sort((left, right) => left.file.localeCompare(right.file));
  const generatedAt = requests
    .map((request) => request.retrievedAt)
    .sort()
    .at(-1);
  for (const [key, source] of Object.entries(sources)) {
    const timestamps = requests
      .filter((request) => request.source === key)
      .map((request) => request.retrievedAt)
      .sort();
    if (!timestamps.length) continue;
    source.retrieved = timestamps.at(-1).slice(0, 10);
    source.firstRetrievedAt = timestamps[0];
    source.lastRetrievedAt = timestamps.at(-1);
    source.snapshotResponseCount = timestamps.length;
  }
  sources.osm.retrieved = sources.osrm.retrieved;
  const sourceSnapshot = {
    id: createHash("sha256")
      .update(requests.map((request) => `${request.file}:${request.sha256}`).join("\n"))
      .digest("hex"),
    directory: "scripts/data/udes-v2-sources",
    generatedAt,
    requests,
    rebuild: "node scripts/build-udes-v2-data.mjs",
    refresh: "node scripts/build-udes-v2-data.mjs --refresh-sources",
    note: "Default builds reuse and verify frozen gzip-compressed source responses. Missing requests are fetched and recorded; explicit refresh replaces responses. Outputs use the latest source retrieval timestamp, so identical snapshots produce identical generated datasets.",
  };
  const baseline = {
    schemaVersion: "2.2.0",
    generatedAt,
    sourceSnapshot,
    baseYear: 2024,
    temporalAlignment:
      "Population and employment reference year: 2024. Road and GIS conditions: the frozen source retrieval dates. This mixed-year scenario baseline is not a reconstructed 2024 traffic network.",
    scope: {
      name: "Greater Abu Dhabi City: focused UDES v2 study area",
      bounds,
      includedZoneCount: zones.length,
      excluded: ["Al Ain Region", "Al Dhafra Region", "Outer Abu Dhabi Region districts outside the selected metropolitan study area"],
      note: "This is a selected urban system, not the full Abu Dhabi Region. Main-island neighborhoods remain distinct.",
    },
    classifications: {
      observed: "Published directly by the cited government source.",
      derived: "Calculated from observed geometry, stops or an OSM route snapshot.",
      synthetic: "Transparent modeling assumption requiring calibration before policy use.",
      "mixed-derived-synthetic": "Derived geometry/topology containing an explicitly identified synthetic connector or assumption.",
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
      supplyAssumptions,
      housingStockReference,
      officialAbuDhabiRegionPopulation2024: 2823340,
      officialAbuDhabiRegionPopulationSource: "scadPopulation",
      studyScopePopulation2024: studyPopulation,
      studyScopeShareOfRegion: Number((studyPopulation / 2823340).toFixed(3)),
      studyScopeJobs2024: studyJobs,
      officialMappedDistrictPopulationSubtotal: studyPopulation,
      citizenAgentPersonsRecommended: 250,
      enterpriseAgentJobsRecommended: 1500,
      employmentAnchor: {
        source: "scadLabour2024",
        employedResidents2024: 2762715,
        residents2024: 4135985,
        observedEmployedResidentPercent: 66.8,
        modeledOpeningEmploymentPercent: 67,
        caveat:
          "The observed ratio is emirate-wide and is used as a transparent approximation for the selected Greater Abu Dhabi City study scope, not as a district-level labor-force calibration.",
      },
      laborForceComposition: {
        participationPercentOfResidents: 70,
        employedPercentOfResidents: 67,
        activeJobSeekersPercentOfResidents: 3,
        nonparticipantsPercentOfResidents: 30,
        sourceClass: "synthetic",
        calibrationStatus: "uncalibrated",
        note: "The 70/3/30 participation split is an explicit model assumption, separate from the observed emirate-wide employed-resident anchor. Nonparticipants do not enter job matching and receive the worker's transparent modeled household/non-labor resource amount; this is not a named benefit or forecast.",
      },
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
          "Historical all-trip shares are a contextual comparator only. They do not define acceptance or rejection bands for this work-trip model; current household travel observations are required for empirical validation.",
      },
      note: "All 18 model-zone population totals are mapped from SCAD's complete 2024 district table: 12 direct mappings and 6 grouped or relabeled mappings derived from observed records. District jobs and behavioral attributes remain synthetic baselines.",
    },
    temporal: {
      simulationStep: "1 calendar day",
      startDate: "2024-01-01",
      displayTimeZone: "Asia/Dubai",
      deterministicClockTimeZone: "UTC",
      modeledWorkdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      dailyNetworkAssignmentWindowHours: 13,
      dailyNetworkAssignmentWindowSourceClass: "synthetic-model-rule",
      dailyNetworkAssignmentWindowNote:
        "Directional hourly road and transit capacity is integrated over one 13-hour daily assignment window; this is a transparent modeling assumption, not an observed peak-period profile.",
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
      nodes: physicalRoadGraph.nodes,
      edges: roadEdges,
      candidateRoutes,
      turnRestrictions: physicalRoadGraph.turnRestrictions,
      turnRestrictionEvidence: physicalRoadGraph.turnRestrictionEvidence,
      topology: {
        coordinatePrecisionDecimals: topologyCoordinatePrecision,
        maximumCollapsedEdgeKm,
        rawUniqueCoordinateSegmentCount: physicalRoadGraph.rawSegmentCount,
        physicalNodeCount: physicalRoadGraph.nodes.length,
        physicalEdgeCount: roadEdges.length,
        loadBearingEdgeCount: physicalRoadGraph.loadBearingEdgeCount,
        visiblePhysicalEdgeCount: physicalRoadGraph.visibleEdgeCount,
        visibleArterialEdgeCount: roadEdges.filter((edge) => edge.displayClass === "arterial" || edge.displayClass === "gateway").length,
        visibleNamedNetworkEdgeCount: physicalRoadGraph.visibleNamedNetworkEdgeCount,
        nonRenderedMidRouteConnectorEdgeCount: physicalRoadGraph.nonRenderedMidRouteConnectorEdgeCount,
        hiddenAccessEdgeCount: physicalRoadGraph.hiddenAccessEdgeCount,
        forcedAttachmentEdgeCount: physicalRoadGraph.forcedAttachmentEdgeCount,
        contextOnlyEdgeCount: physicalRoadGraph.contextOnlyEdgeCount,
        directionalEdgeCount: physicalRoadGraph.directionalEdgeCount,
        bidirectionalEdgeCount: physicalRoadGraph.bidirectionalEdgeCount,
        closedContextEdgeCount: physicalRoadGraph.closedContextEdgeCount,
        integrity: physicalRoadGraph.integrity,
        trimmedGatewayApproaches: physicalRoadGraph.trimmedGatewayApproaches,
        odCorridorPairCount: completeRoadPairs.length,
        directedDistrictPairCoverage:
          "Every distinct ordered pair of the 18 district gateways has its own frozen genuine OSRM route in the physical union.",
        candidateRouteCount: candidateRoutes.length,
        bidirectionalSimplification: false,
        directionalityMethod:
          "Each OD corridor is routed in both directions. An edge direction is allowed only when every constituent road segment is traversed in that direction by the frozen OSRM routes. This is a conservative routable subset, not a complete legal one-way inventory; arbitrary geometric crossings do not create junctions.",
        sourceClass: "derived",
      },
      capacityModel: {
        direction: "per direction",
        assignmentWindowHours: 13,
        dailyDirectionalCapacityFormula: "capacityVehPerHourAB/BA × 13-hour assignment window",
        assumptions: {
          "local-access": roadCapacityAssumption("local-access"),
          "urban-arterial": roadCapacityAssumption("urban-arterial"),
          "bridge-arterial": roadCapacityAssumption("bridge-arterial"),
          motorway: roadCapacityAssumption("motorway"),
        },
        sourceClass: "synthetic",
        caveat:
          "Matched main-road lane counts come from AD-SDI layer 407; unmatched lanes and every per-lane capacity remain explicit assumptions. These are not observed traffic counts or junction capacities.",
      },
      officialAttributeJoin: physicalRoadGraph.officialAttributeJoin,
      arterialSeeds: arterialSeedRecords.map((seed) => ({
        id: seed.id,
        name: seed.name,
        refs: seed.refs,
        directionalPairId: seed.directionalPairId,
        pairedSeedId: seed.pairedSeedId,
        purpose: "Named-spine coverage only; does not create an OD demand relation.",
        geometrySource: seed.geometrySource,
        sourceClass: seed.sourceClass,
        sourceClassByField: {
          geometry: seed.sourceClass,
          name: "reference",
          refs: "reference",
          purpose: "synthetic",
        },
        fallbackReason: seed.fallbackReason || null,
      })),
      arterialCoverage: physicalRoadGraph.arterialCoverage,
      officialCenterlineAssessment: {
        source: "adsdiRoadCenterline",
        eligibleMajorSegmentsInScope: 13131,
        embedded: false,
        reason:
          "The official layer is a dense inventory without turn restrictions or a ready navigable topology; embedding it would be disproportionate for a browser model. A shared physical graph is instead derived from the union of OSM/OSRM route-step geometry.",
      },
      modeledCorridorVocabulary: {
        referenceCatalogue: "adsdiMainRoads",
        nameSource: "OSM/OSRM route steps with manual English normalization",
        keyGateways: [
          "Al Khaleej Al Arabi Street (E20 / Street 8)",
          "Sheikh Zayed bin Sultan Street (E10 / Street 24)",
          "Sheikh Rashid bin Saeed Street / Al Ain Road (E22 / Street 18)",
          "Sheikh Khalifa bin Zayed Street and Bridge (E12)",
          "Musaffah Road (E30)",
        ],
        note: "Road names and references originate with OSM/OSRM route steps and manual English normalization. AD-SDI main-road route, side, speed and lane attributes are added only where the documented spatial/semantic join passes; per-lane capacity remains synthetic.",
      },
      fallbackRouteCount,
      fallbackArterialSeedCount,
    },
    transit: {
      officialStopsInBoundingBox: rawStops.features.length,
      officialStopsAssignedToStudyZones: stopFeatures.length,
      unassignedStopsInBoundingBox: rawStops.features.length - stopFeatures.length,
      serviceAssumptions: {
        path: "scripts/data/udes-v2-transit-services.json",
        sourceClass: transitServiceAssumptions.sourceClass,
        originalBaselineSha256: transitServiceAssumptions.sourceBaselineSha256,
        note: "These 62 pre-existing synthetic service parameters are independent of the expanded car-road candidate set.",
      },
      links: transitLinks,
      caveat:
        "Stops are observed. Published route and timetable data has not yet been integrated; links, frequency, capacity and travel time remain modeled.",
    },
    assumptions: [
      "All selected-zone population values are mapped from SCAD's complete 2024 Abu Dhabi Region district table: 12 direct mappings and 6 grouped or relabeled mappings derived from observed records.",
      "Jobs, capacities, quality, rent indices, car ownership, salaries and employment themes are synthetic starting values, not forecasts or administrative statistics.",
      "Labor-force participation is explicitly but synthetically split into 67% employed residents, 3 percentage points of active job seekers and 30% nonparticipants (70% participation total). The 70/3/30 split is uncalibrated; nonparticipants remain outside job matching and use the worker's transparent modeled household/non-labor resource rule, which is not a named government benefit or forecast.",
      "Mode-choice parameters are synthetic. The historical 2015 all-trip reference reported by UN-Habitat/UITP covers a different travel population and is a contextual comparator only, not a work-trip calibration or acceptance band.",
      "The reference standard pay-as-you-go bus fare uses Abu Dhabi Mobility's AED 2 base fare plus AED 0.05 per passenger-kilometre in each direction, capped at AED 5 per journey; pass products, transfers and exemptions are not modeled.",
      "Same-zone reference mode probabilities are reweighted by service utility; those probabilities, the 45-day commute escalation grace period and financial vehicle-access cancellation guards are synthetic behavioral assumptions.",
      "Muroor uses the official Al Sa'adah polygon; Al Manhal represents the combined Al Manhal / Al Karamah label; Rabdan represents Rabdan / Al Maqta.",
      "The road graph is the shared physical-segment union of every ordered pair of the 18 district gateways (306 frozen OSM/OSRM candidates). Every edge belongs to a complete route between fixed district gateways. Shared terminal approaches are trimmed to their first real junction; no standalone context seeds, synthetic connectors or straight-line fallbacks are included. Exact route vertices are deduplicated and same-signature degree-2 chains are split at geometry vertices near 2 km. The 62 pre-existing synthetic transit services retain their own frozen service parameters; road coverage does not create new bus services.",
      "Turn prohibitions are derived conservatively from frozen OSRM intersection entry flags for matching incoming and outgoing directions. Every source candidate remains traversable; unobserved approaches and intersection delays remain limitations.",
      "Every physical route segment is visible and accumulates directional car and transit demand, including unnamed roads and district gateway approaches. Shared roads aggregate all assigned OD traversals against the same directional capacity. Each district still uses one aggregate gateway, so local demand concentration is a spatial-resolution limitation rather than a reason to omit physical-road congestion.",
      "OSM/OSRM supplies road geometry, legal directed route traversals and free-flow route duration. Where the strict documented spatial/semantic join passes, AD-SDI layer 407 supplies observed route ID, carriageway side, lane count and posted speed; unmatched lane counts and every per-lane capacity remain explicit assumptions. Cached source-supported turn prohibitions are enforced; a complete turn inventory, signal timing, observed traffic counts and incident conditions are not modeled.",
      "Each zone centroid is an actual routed road gateway selected near a representative activity point inside its official grouped polygons. Frozen OSRM hints stabilize route endpoints; shared cul-de-sac approaches are trimmed to their first real road junction. geometryCentroid remains the grouped polygon centroid.",
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
      attribution: "Department of Government Enablement, Abu Dhabi Spatial Data Infrastructure",
    },
    features: zoneFeatures,
  };
  const roadsGeoJson = {
    type: "FeatureCollection",
    name: "udes-v2-abu-dhabi-road-network",
    bbox: bounds,
    metadata: {
      source: "osm / osrm",
      sourceClass: "derived",
      attribution: "© OpenStreetMap contributors",
      note: "Complete shared real-road geometry for the modeled district-to-district route union. Every physical graph edge has one identical visible feature, including unnamed connectors. Standalone named-road seeds and cul-de-sac approach stubs are omitted; no synthetic road geometry is permitted.",
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
      attribution: "Department of Government Enablement, Abu Dhabi Spatial Data Infrastructure",
      note: "Only official stops contained by the selected model-zone polygons are retained.",
    },
    features: stopFeatures,
  };

  const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(path.join(snapshotDir, "manifest.json"), serialize(sourceSnapshot));
  await Promise.all([
    writeFile(path.join(outputDir, "baseline.json"), serialize(baseline)),
    writeFile(path.join(outputDir, "zones.geojson"), serialize(zonesGeoJson)),
    writeFile(path.join(outputDir, "roads.geojson"), serialize(roadsGeoJson)),
    writeFile(path.join(outputDir, "transit-stops.geojson"), serialize(stopsGeoJson)),
  ]);
  console.log(
    `Built ${zones.length} zones, ${roadEdges.length} physical road edges (${physicalRoadGraph.visibleEdgeCount} visible / ${physicalRoadGraph.hiddenAccessEdgeCount} hidden), ${candidateRoutes.length} candidate routes and ${stopFeatures.length} official stops in ${outputDir}`
  );
}

await main();
