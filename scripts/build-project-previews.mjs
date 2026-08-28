import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const projectRoot = resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const { UdesV2Engine } = require(resolve(projectRoot, "assets/js/udes-v2-worker.js"));
const { PUBLIC_PRESETS, horizonEndDayFrom } = require(resolve(projectRoot, "assets/js/udes-v2-app.js"));
const baseline = JSON.parse(readFileSync(resolve(projectRoot, "assets/data/udes-v2/baseline.json"), "utf8"));
const zones = JSON.parse(readFileSync(resolve(projectRoot, "assets/data/udes-v2/zones.geojson"), "utf8"));
const roads = JSON.parse(readFileSync(resolve(projectRoot, "assets/data/udes-v2/roads.geojson"), "utf8"));
const stops = JSON.parse(readFileSync(resolve(projectRoot, "assets/data/udes-v2/transit-stops.geojson"), "utf8"));
const cncEvidence = JSON.parse(readFileSync(resolve(projectRoot, "assets/data/cnc-machine-inspector/portfolio-evidence.json"), "utf8"));
const dmuComponentCount = Number(cncEvidence.machines?.dmu50?.components?.total);
if (!Number.isInteger(dmuComponentCount) || dmuComponentCount < 1) {
  throw new Error("The checked DMU 50 component count is missing from the CNC portfolio evidence.");
}

const engineData = {
  zones: baseline.zones,
  links: baseline.roadGraph.edges,
  nodes: baseline.roadGraph.nodes,
  candidateRoutes: baseline.roadGraph.candidateRoutes,
  transit: baseline.transit,
  calibration: baseline.calibration,
};
const previewStartDate = new Date("2024-01-01T00:00:00Z");
const previewEndDay = horizonEndDayFrom(previewStartDate, 12);
const runPreviewScenario = (preset) => {
  const engine = new UdesV2Engine({
    seed: 240124,
    data: engineData,
    config: {
      ...preset,
      startDate: "2024-01-01",
      initialEmploymentRate: 0.8,
      endogenousEnterpriseDynamics: true,
    },
  });
  const history = [engine.snapshot().city];
  while (engine.day < previewEndDay) {
    engine.step(Math.min(30, previewEndDay - engine.day));
    history.push(engine.snapshot().city);
  }
  return { engine, history, snapshot: engine.snapshot() };
};
const referenceRun = runPreviewScenario(PUBLIC_PRESETS.reference);
const transitRun = runPreviewScenario(PUBLIC_PRESETS.transit);
const engine = referenceRun.engine;
const reference = referenceRun.snapshot;
const city = reference.city;
const transitCity = transitRun.snapshot.city;
const percentageWidth = (value, total = 312) => Math.max(0, (Number(value) / 100) * total).toFixed(1);
const carWidth = percentageWidth(city.modeShares.car);
const ptWidth = percentageWidth(city.modeShares.pt);
const walkWidth = percentageWidth(city.modeShares.walk);
const ptStart = (1228 + Number(carWidth)).toFixed(1);
const walkStart = (1228 + Number(carWidth) + Number(ptWidth)).toFixed(1);
const modeBarCar = percentageWidth(city.modeShares.car, 280);
const modeBarPt = percentageWidth(city.modeShares.pt, 280);
const modeBarWalk = percentageWidth(city.modeShares.walk, 280);
const transitModeBarCar = percentageWidth(transitCity.modeShares.car, 280);
const transitModeBarPt = percentageWidth(transitCity.modeShares.pt, 280);
const transitModeBarWalk = percentageWidth(transitCity.modeShares.walk, 280);
const satisfactionWidth = percentageWidth(city.satisfaction, 300);
const referenceDate = new Intl.DateTimeFormat("en-AE", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
  new Date(`${reference.clock.date}T00:00:00Z`)
);
const oneDecimal = (value) => Number(value).toFixed(1);
const formatNumber = (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value));
const satisfactionPath = (history) =>
  history
    .map((entry, index) => {
      const x = 370 + (index / Math.max(history.length - 1, 1)) * 346;
      const y = 820 - (Number(entry.satisfaction) / 100) * 110;
      return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
const referenceSatisfactionPath = satisfactionPath(referenceRun.history);
const transitSatisfactionPath = satisfactionPath(transitRun.history);
const forcedOrUnserved = city.forcedInterzoneWalkers + city.unservedCommuters + transitCity.forcedInterzoneWalkers + transitCity.unservedCommuters;
if (forcedOrUnserved !== 0) throw new Error(`Preview evidence failed: ${forcedOrUnserved} forced or unserved commutes across compared runs`);

const mapBox = { x: 342, y: 118, width: 842, height: 472, padding: 28 };
const polygonRings = (geometry) => {
  if (geometry.type === "Polygon") return geometry.coordinates;
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flat();
  return [];
};
const zoneCoordinates = zones.features.flatMap((feature) => polygonRings(feature.geometry).flat());
const longitudes = zoneCoordinates.map(([longitude]) => longitude);
const latitudes = zoneCoordinates.map(([, latitude]) => latitude);
const bounds = {
  minLongitude: Math.min(...longitudes),
  maxLongitude: Math.max(...longitudes),
  minLatitude: Math.min(...latitudes),
  maxLatitude: Math.max(...latitudes),
};

const longitudeSpan = Math.max(bounds.maxLongitude - bounds.minLongitude, 0.001);
const latitudeSpan = Math.max(bounds.maxLatitude - bounds.minLatitude, 0.001);
const availableWidth = mapBox.width - mapBox.padding * 2;
const availableHeight = mapBox.height - mapBox.padding * 2;
const scale = Math.min(availableWidth / longitudeSpan, availableHeight / latitudeSpan);
const projectedWidth = longitudeSpan * scale;
const projectedHeight = latitudeSpan * scale;
const offsetX = mapBox.x + (mapBox.width - projectedWidth) / 2;
const offsetY = mapBox.y + (mapBox.height - projectedHeight) / 2;
const project = ([longitude, latitude]) => [offsetX + (longitude - bounds.minLongitude) * scale, offsetY + (bounds.maxLatitude - latitude) * scale];
const point = (coordinate) =>
  project(coordinate)
    .map((value) => value.toFixed(1))
    .join(" ");
const ringPath = (ring) => ring.map((coordinate, index) => `${index ? "L" : "M"}${point(coordinate)}`).join(" ") + " Z";
const linePath = (coordinates) => {
  const stride = Math.max(1, Math.ceil(coordinates.length / 90));
  const sampled = coordinates.filter((_, index) => index % stride === 0 || index === coordinates.length - 1);
  return sampled.map((coordinate, index) => `${index ? "L" : "M"}${point(coordinate)}`).join(" ");
};

const fills = ["#c8ded6", "#b3d1c6", "#dae8e2", "#a6c7bd", "#d7e3db"];
const zonePaths = zones.features
  .map((feature, index) => {
    const path = polygonRings(feature.geometry).map(ringPath).join(" ");
    return `<path d="${path}" fill="${fills[index % fills.length]}" fill-rule="evenodd" stroke="#f7f8f5" stroke-width="1.8"/>`;
  })
  .join("");
const roadPaths = roads.features
  .map(
    (feature) =>
      `<path d="${linePath(feature.geometry.coordinates)}" fill="none" stroke="#667f85" stroke-width="2.2" stroke-linecap="round" opacity=".72"/>`
  )
  .join("");
const stopDots = stops.features
  .filter((_, index) => index % 24 === 0)
  .map((feature) => {
    const [x, y] = project(feature.geometry.coordinates);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.4" fill="#2f7f85" stroke="#f7f8f5" stroke-width="1"/>`;
  })
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title description">
  <title id="title">Abu Dhabi Urban Dynamics analyst console</title>
  <desc id="description">A light professional planning interface with scenario controls, a real Abu Dhabi district map, agent indicators, and outcome charts.</desc>
  <defs>
    <clipPath id="map-clip"><rect x="342" y="118" width="842" height="472" rx="8"/></clipPath>
    <linearGradient id="header" x1="0" x2="1"><stop stop-color="#f7f8f5"/><stop offset="1" stop-color="#eef3f0"/></linearGradient>
  </defs>
  <rect width="1600" height="900" fill="#e8ece8"/>
  <rect x="20" y="20" width="1560" height="860" rx="18" fill="#f7f8f5" stroke="#cbd4cf" stroke-width="2"/>
  <rect x="20" y="20" width="1560" height="72" rx="18" fill="url(#header)"/>
  <path d="M20 74H1580" stroke="#d6ddda"/>
  <g font-family="Inter,Segoe UI,Arial,sans-serif" fill="#23302e">
    <circle cx="57" cy="56" r="15" fill="#236b5b"/><path d="M51 56h12M57 50v12" stroke="#fff" stroke-width="2"/>
    <text x="84" y="49" font-size="13" letter-spacing="1.8" fill="#687572">URBAN DYNAMICS CONSOLE</text>
    <text x="84" y="70" font-size="20" font-weight="650">Greater Abu Dhabi City</text>
    <rect x="686" y="38" width="102" height="36" rx="8" fill="#236b5b"/><text x="737" y="61" text-anchor="middle" font-size="14" font-weight="650" fill="#fff">Run</text>
    <rect x="802" y="38" width="132" height="36" rx="8" fill="#fff" stroke="#cbd4cf"/><text x="868" y="61" text-anchor="middle" font-size="13">${referenceDate}</text>
    <text x="1248" y="48" font-size="11" fill="#75817e">SIMULATION STATUS</text><circle cx="1253" cy="66" r="5" fill="#2e8b70"/><text x="1267" y="71" font-size="14" font-weight="650">Ready · 18 districts</text>

    <rect x="38" y="108" width="282" height="754" rx="10" fill="#f1f3f0" stroke="#d7dedb"/>
    <text x="58" y="137" font-size="11" letter-spacing="1.5" fill="#75817e">SCENARIO STUDIO</text><text x="58" y="163" font-size="20" font-weight="650">Interventions</text>
    <text x="58" y="203" font-size="12" font-weight="650">INTERVENTION TEMPLATE</text>
    <rect x="54" y="220" width="250" height="48" rx="8" fill="#e2eee9" stroke="#76a697"/><circle cx="76" cy="244" r="6" fill="#236b5b"/><text x="92" y="249" font-size="14" font-weight="650">Reference</text>
    <rect x="54" y="276" width="250" height="42" rx="8" fill="#fff" stroke="#d7dedb"/><text x="72" y="302" font-size="13">Bus priority</text>
    <rect x="54" y="326" width="250" height="42" rx="8" fill="#fff" stroke="#d7dedb"/><text x="72" y="352" font-size="13">Housing delivery</text>
    <rect x="54" y="376" width="250" height="42" rx="8" fill="#fff" stroke="#d7dedb"/><text x="72" y="402" font-size="13">Housing + jobs</text>
    <text x="58" y="454" font-size="12" font-weight="650">BUS &amp; ROAD OPERATIONS</text>
    <text x="58" y="485" font-size="12" fill="#66736f">Base bus fare</text><text x="284" y="485" text-anchor="end" font-size="12">AED 2.00</text><path d="M58 501H284" stroke="#cbd4cf" stroke-width="5" stroke-linecap="round"/><path d="M58 501H171" stroke="#2f7f85" stroke-width="5" stroke-linecap="round"/><circle cx="171" cy="501" r="7" fill="#fff" stroke="#2f7f85" stroke-width="3"/>
    <text x="58" y="535" font-size="12" fill="#66736f">Effective bus speed</text><text x="284" y="535" text-anchor="end" font-size="12">28 km/h</text><path d="M58 551H284" stroke="#cbd4cf" stroke-width="5" stroke-linecap="round"/><path d="M58 551H201" stroke="#2f7f85" stroke-width="5" stroke-linecap="round"/><circle cx="201" cy="551" r="7" fill="#fff" stroke="#2f7f85" stroke-width="3"/>
    <text x="58" y="596" font-size="12" font-weight="650">AGENT RULES</text>
    <rect x="54" y="614" width="250" height="92" rx="8" fill="#fff" stroke="#d7dedb"/><text x="70" y="638" font-size="12" font-weight="650">Citizen objective</text><text x="70" y="660" font-size="11" fill="#6d7976">Income · commute · place quality</text><text x="70" y="686" font-size="11" fill="#6d7976">Happy → Waiting → Extreme</text>
    <rect x="54" y="716" width="250" height="92" rx="8" fill="#fff" stroke="#d7dedb"/><text x="70" y="740" font-size="12" font-weight="650">Enterprise objective</text><text x="70" y="762" font-size="11" fill="#6d7976">Margin · labor access · vacancies</text><text x="70" y="788" font-size="11" fill="#6d7976">Working → Grow / Lesser / Re-entry</text>
    <text x="58" y="840" font-size="11" fill="#75817e">${formatNumber(engine.citizens.length)} citizen agents · ${formatNumber(
      engine.enterprises.length
    )} firms</text>

    <rect x="336" y="108" width="854" height="492" rx="10" fill="#eef2ee" stroke="#d7dedb"/>
    <g clip-path="url(#map-clip)">${zonePaths}${roadPaths}${stopDots}</g>
    <rect x="356" y="132" width="142" height="34" rx="7" fill="#fff" fill-opacity=".92" stroke="#d7dedb"/><text x="427" y="154" text-anchor="middle" font-size="12" font-weight="650">Network load</text>
    <rect x="1000" y="544" width="166" height="36" rx="7" fill="#fff" fill-opacity=".94" stroke="#d7dedb"/><circle cx="1020" cy="562" r="4" fill="#236b5b"/><text x="1032" y="566" font-size="11">Real routed corridors</text>

    <rect x="1206" y="108" width="356" height="492" rx="10" fill="#fff" stroke="#d7dedb"/>
    <text x="1228" y="137" font-size="11" letter-spacing="1.4" fill="#75817e">CITY INSPECTOR</text><text x="1228" y="165" font-size="20" font-weight="650">Greater Abu Dhabi City</text>
    <rect x="1228" y="190" width="312" height="82" rx="8" fill="#f1f5f2"/><text x="1246" y="216" font-size="11" fill="#75817e">REPRESENTED POPULATION</text><text x="1246" y="252" font-size="28" font-weight="700">${formatNumber(
      city.representedPopulation
    )}</text>
    <text x="1228" y="307" font-size="12" fill="#66736f">Resident satisfaction</text><text x="1528" y="307" text-anchor="end" font-size="14" font-weight="650">${oneDecimal(
      city.satisfaction
    )}%</text><path d="M1228 320H1528" stroke="#d7dedb"/><path d="M1228 320h${satisfactionWidth}" stroke="#236b5b" stroke-width="5"/>
    <text x="1228" y="359" font-size="12" fill="#66736f">Employment rate</text><text x="1528" y="359" text-anchor="end" font-size="14" font-weight="650">${oneDecimal(
      city.employmentRate
    )}%</text>
    <text x="1228" y="397" font-size="12" fill="#66736f">Mean round trip</text><text x="1528" y="397" text-anchor="end" font-size="14" font-weight="650">${oneDecimal(
      city.averageRoundTripMinutes
    )} min</text>
    <text x="1228" y="435" font-size="12" fill="#66736f">Average road load</text><text x="1528" y="435" text-anchor="end" font-size="14" font-weight="650">${oneDecimal(
      city.averageRoadCapacityUsage
    )}%</text>
    <text x="1228" y="481" font-size="11" font-weight="650">MODE SHARE</text>
    <rect x="1228" y="496" width="${carWidth}" height="18" rx="4" fill="#557fa3"/><rect x="${ptStart}" y="496" width="${ptWidth}" height="18" fill="#2f7f85"/><rect x="${walkStart}" y="496" width="${walkWidth}" height="18" rx="4" fill="#b27936"/>
    <text x="1228" y="539" font-size="11">Car ${oneDecimal(city.modeShares.car)}%</text><text x="1336" y="539" font-size="11">PT ${oneDecimal(
      city.modeShares.pt
    )}%</text><text x="1446" y="539" font-size="11">Walk ${oneDecimal(city.modeShares.walk)}%</text>
    <rect x="1228" y="560" width="132" height="25" rx="12" fill="#e3eee9"/><text x="1294" y="577" text-anchor="middle" font-size="10" font-weight="650" fill="#236b5b">YEAR 1 REFERENCE</text>

    <rect x="336" y="616" width="1226" height="246" rx="10" fill="#fff" stroke="#d7dedb"/>
    <text x="360" y="646" font-size="11" letter-spacing="1.4" fill="#75817e">OUTCOMES · REFERENCE VS POLICY</text>
    <text x="360" y="680" font-size="13" font-weight="650">Satisfied citizen share</text><path d="M360 820H726M360 706V820" stroke="#d7dedb"/>
    <path d="${referenceSatisfactionPath}" fill="none" stroke="#236b5b" stroke-width="4"/><path d="${transitSatisfactionPath}" fill="none" stroke="#8fb6aa" stroke-width="3" stroke-dasharray="7 7"/><path d="M370 838h18" stroke="#236b5b" stroke-width="3"/><text x="394" y="842" font-size="10" fill="#66736f">Reference</text><path d="M470 838h18" stroke="#8fb6aa" stroke-width="3" stroke-dasharray="5 4"/><text x="494" y="842" font-size="10" fill="#66736f">Bus priority</text>
    <text x="760" y="680" font-size="13" font-weight="650">Mobility mix <tspan font-size="9" fill="#75817e">REF / TRANSIT</tspan></text><text x="760" y="716" font-size="11" fill="#66736f">Car</text><rect x="820" y="702" width="280" height="20" rx="4" fill="#e7ece9"/><rect x="820" y="702" width="${modeBarCar}" height="9" rx="3" fill="#557fa3"/><rect x="820" y="713" width="${transitModeBarCar}" height="7" rx="3" fill="#8fb6aa"/><text x="1115" y="718" font-size="10">${oneDecimal(
      city.modeShares.car
    )}% / ${oneDecimal(transitCity.modeShares.car)}%</text>
    <text x="760" y="758" font-size="11" fill="#66736f">Public transport</text><rect x="820" y="744" width="280" height="20" rx="4" fill="#e7ece9"/><rect x="820" y="744" width="${modeBarPt}" height="9" rx="3" fill="#2f7f85"/><rect x="820" y="755" width="${transitModeBarPt}" height="7" rx="3" fill="#8fb6aa"/><text x="1115" y="760" font-size="10">${oneDecimal(
      city.modeShares.pt
    )}% / ${oneDecimal(transitCity.modeShares.pt)}%</text>
    <text x="760" y="800" font-size="11" fill="#66736f">Walking</text><rect x="820" y="786" width="280" height="20" rx="4" fill="#e7ece9"/><rect x="820" y="786" width="${modeBarWalk}" height="9" rx="3" fill="#b27936"/><rect x="820" y="797" width="${transitModeBarWalk}" height="7" rx="3" fill="#8fb6aa"/><text x="1115" y="802" font-size="10">${oneDecimal(
      city.modeShares.walk
    )}% / ${oneDecimal(transitCity.modeShares.walk)}%</text>
    <text x="1192" y="680" font-size="13" font-weight="650">Model evidence</text><rect x="1192" y="700" width="338" height="112" rx="8" fill="#f3f6f3"/><text x="1210" y="727" font-size="11" fill="#66736f">${formatNumber(
      zones.features.length
    )} district groups derived from AD-SDI</text><text x="1210" y="752" font-size="11" fill="#66736f">${formatNumber(
      roads.features.length
    )} routed road corridors</text><text x="1210" y="777" font-size="11" fill="#66736f">${formatNumber(
      stops.features.length
    )} official public-transport stops</text><text x="1210" y="802" font-size="11" font-weight="650" fill="#236b5b">${formatNumber(
      forcedOrUnserved
    )} forced or unserved commutes</text>
  </g>
</svg>`;

const svgOutputPath = resolve(projectRoot, "assets/img/projects/urban-dynamics-console.svg");
const pngOutputPath = resolve(projectRoot, "assets/img/projects/urban-dynamics-console.png");
const svgBuffer = Buffer.from(`${svg}\n`);
mkdirSync(dirname(svgOutputPath), { recursive: true });
writeFileSync(svgOutputPath, svgBuffer);
await sharp(svgBuffer).resize(1600, 900).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(pngOutputPath);
console.log(`Wrote ${svgOutputPath}`);
console.log(`Wrote ${pngOutputPath}`);

const cncSourcePath = resolve(projectRoot, "assets/img/projects/cnc-machine-inspector/dmu50.jpg");
const cncMachineData = readFileSync(cncSourcePath).toString("base64");
const cncSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="cnc-title cnc-description">
  <title id="cnc-title">Machine Lab assembly inspector interface</title>
  <desc id="cnc-description">A product-interface preview assembled from the published Machine Lab controls, DMU 50 render, component hierarchy, and learning-card content.</desc>
  <defs>
    <clipPath id="cnc-canvas"><rect x="372" y="86" width="888" height="814"/></clipPath>
    <filter id="cnc-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#18201f" flood-opacity=".10"/></filter>
  </defs>
  <rect width="1600" height="900" fill="#f5f6f3"/>
  <g font-family="Inter,Segoe UI,Arial,sans-serif" fill="#18201f">
    <rect width="1600" height="52" fill="#fff"/><path d="M0 52H1600" stroke="#d9deda"/>
    <rect x="14" y="10" width="32" height="32" rx="7" fill="#18201f"/><path d="M23 20h14v14H23zM27 16v22M19 27h22" fill="none" stroke="#fff" stroke-width="1.5"/>
    <text x="58" y="24" font-size="10" letter-spacing="1.5" fill="#68716f">MACHINE LAB</text><text x="58" y="41" font-size="15" font-weight="700">Interactive assembly explorer</text>
    <rect x="574" y="10" width="248" height="32" rx="5" fill="#fff" stroke="#cfd5d1"/><text x="591" y="31" font-size="12" font-weight="650">DMU 50 · Five-axis machining center</text><path d="m798 23 6 6 6-6" fill="none" stroke="#697370" stroke-width="1.5"/>
    <rect x="1040" y="10" width="110" height="32" rx="5" fill="#fff" stroke="#cfd5d1"/><text x="1095" y="31" text-anchor="middle" font-size="11">Isometric</text>
    <rect x="1160" y="10" width="70" height="32" rx="5" fill="#fff" stroke="#cfd5d1"/><text x="1195" y="31" text-anchor="middle" font-size="11" font-weight="650">Fit</text>
    <rect x="1240" y="10" width="112" height="32" rx="5" fill="#2457d6"/><text x="1296" y="31" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">Enter VR</text>
    <text x="1578" y="31" text-anchor="end" font-size="11" fill="#68716f">Back to library</text>

    <rect y="52" width="1600" height="34" fill="#fff8ee"/><path d="M0 86H1600" stroke="#ead5b8"/><circle cx="20" cy="69" r="4" fill="#b66a16"/><text x="32" y="73" font-size="10" fill="#765229">Published learning package · ${dmuComponentCount} named components · geometry and annotation checks passed</text><text x="1578" y="73" text-anchor="end" font-size="10" fill="#765229">Source and validation details</text>

    <rect y="86" width="72" height="814" fill="#fff"/><path d="M72 86V900" stroke="#d9deda"/>
    <rect x="5" y="94" width="62" height="64" rx="6" fill="#edf2ff"/><rect x="5" y="105" width="3" height="42" fill="#2457d6"/><path d="M26 112h20M26 121h20M26 130h14" stroke="#2457d6" stroke-width="2"/><text x="36" y="148" text-anchor="middle" font-size="9" font-weight="700" fill="#2457d6">Parts</text>
    <g fill="#596361" font-size="9" text-anchor="middle"><text x="36" y="195">Notes</text><text x="36" y="263">Explode</text><text x="36" y="331">Section</text><text x="36" y="399">Measure</text><text x="36" y="467">Visibility</text></g>
    <g fill="none" stroke="#596361" stroke-width="1.7"><circle cx="36" cy="177" r="10"/><path d="M31 177h10M36 172v10"/><path d="m27 231 9-8 9 8-9 8zM36 223v16"/><rect x="27" y="290" width="18" height="14"/><path d="m27 297 18-7"/><path d="M27 357h18M31 349v16M41 349v16"/><path d="m29 422 14 14M43 422l-14 14"/></g>

    <rect x="72" y="86" width="300" height="814" fill="#fff" filter="url(#cnc-shadow)"/><path d="M372 86V900" stroke="#d9deda"/>
    <text x="92" y="116" font-size="9" font-weight="700" letter-spacing="1.3" fill="#6c7573">ASSEMBLY</text><text x="92" y="142" font-size="19" font-weight="720">DMU 50 structure</text>
    <rect x="90" y="158" width="264" height="38" rx="5" fill="#fff" stroke="#cfd5d1"/><circle cx="108" cy="177" r="7" fill="none" stroke="#79817f"/><path d="m113 182 6 6" stroke="#79817f"/><text x="129" y="182" font-size="11" fill="#79817f">Search ${dmuComponentCount} components</text>
    <text x="92" y="225" font-size="9" font-weight="700" letter-spacing="1" fill="#79817f">MAJOR SYSTEMS</text>
    <g font-size="11"><text x="104" y="255">⌄  Base and Column System</text><text x="126" y="282" fill="#5d6764">Machine Column</text><text x="126" y="307" fill="#5d6764">X-Axis Carriage</text><text x="126" y="332" fill="#5d6764">Y-Axis Carriage</text><text x="104" y="367">›  Machine Bed</text><text x="104" y="402">›  Swivel Rotary Table</text></g>
    <rect x="86" y="420" width="272" height="88" rx="5" fill="#edf2ff"/><path d="M86 420h4v88h-4z" fill="#2457d6"/><text x="104" y="447" font-size="11" font-weight="700" fill="#173c9b">⌄  SK40 Spindle Assembly</text><text x="126" y="477" font-size="11" fill="#364863">Milling Spindle Body</text><text x="126" y="497" font-size="9" fill="#68716f">C19 · spindle system</text>
    <g font-size="11"><text x="104" y="542">›  Tool Magazine Mechanism</text><text x="104" y="577">›  Guideway Protection</text><text x="104" y="612">›  Machine Enclosure</text><text x="104" y="647">›  Coolant Support Assembly</text></g>
    <path d="M90 682H354" stroke="#e5e8e5"/><text x="92" y="711" font-size="9" font-weight="700" letter-spacing="1" fill="#79817f">SELECTION ACTIONS</text>
    <rect x="90" y="728" width="80" height="34" rx="4" fill="#2457d6"/><text x="130" y="750" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">Frame</text><rect x="179" y="728" width="80" height="34" rx="4" fill="#fff" stroke="#cfd5d1"/><text x="219" y="750" text-anchor="middle" font-size="10">Isolate</text><rect x="268" y="728" width="80" height="34" rx="4" fill="#fff" stroke="#cfd5d1"/><text x="308" y="750" text-anchor="middle" font-size="10">Hide</text>

    <g clip-path="url(#cnc-canvas)"><image href="data:image/jpeg;base64,${cncMachineData}" x="390" y="105" width="850" height="730" preserveAspectRatio="xMidYMid meet"/></g>
    <circle cx="823" cy="340" r="15" fill="#2457d6" fill-opacity=".16" stroke="#2457d6" stroke-width="2"/><path d="M837 330 940 259" stroke="#2457d6" stroke-width="2"/><rect x="938" y="235" width="162" height="43" rx="5" fill="#fff" stroke="#2457d6"/><text x="954" y="253" font-size="9" font-weight="700" fill="#2457d6">SELECTED · C04</text><text x="954" y="270" font-size="11" font-weight="700">SK40 spindle</text>
    <rect x="404" y="837" width="355" height="36" rx="5" fill="#fff" fill-opacity=".94" stroke="#d9deda"/><text x="420" y="859" font-size="10" fill="#67716e">Drag to orbit · Scroll to zoom · Select a part to learn</text>

    <rect x="1260" y="86" width="340" height="814" fill="#fff" filter="url(#cnc-shadow)"/><path d="M1260 86V900" stroke="#d9deda"/>
    <text x="1280" y="116" font-size="9" font-weight="700" letter-spacing="1.2" fill="#6c7573">SELECTED COMPONENT</text><text x="1280" y="143" font-size="18" font-weight="720">SK40 Spindle Assembly</text><rect x="1280" y="158" width="104" height="24" rx="12" fill="#edf2ff"/><text x="1332" y="174" text-anchor="middle" font-size="9" font-weight="700" fill="#2457d6">SPINDLE SYSTEM</text><text x="1578" y="174" text-anchor="end" font-family="Consolas,monospace" font-size="10" fill="#727c79">C04</text>
    <path d="M1280 201H1580" stroke="#e2e6e3"/><text x="1280" y="229" font-size="9" font-weight="700" letter-spacing="1" fill="#79817f">OVERVIEW</text><text x="1280" y="253" font-size="11"><tspan x="1280" dy="0">The tool-rotating group used for milling</tspan><tspan x="1280" dy="17">operations inside the machining area.</tspan></text>
    <text x="1280" y="316" font-size="9" font-weight="700" letter-spacing="1" fill="#79817f">FUNCTION</text><text x="1280" y="340" font-size="11"><tspan x="1280">Holds and drives the cutting-tool interface</tspan><tspan x="1280" dy="17">while the machine axes position it.</tspan></text>
    <text x="1280" y="403" font-size="9" font-weight="700" letter-spacing="1" fill="#79817f">CONNECTIONS</text><text x="1280" y="427" font-size="11"><tspan x="1280">Milling spindle body · mounting flange</tspan><tspan x="1280" dy="17">· column-side motion structure</tspan></text>
    <text x="1280" y="490" font-size="9" font-weight="700" letter-spacing="1" fill="#79817f">WHAT TO INSPECT</text><text x="1280" y="514" font-size="11"><tspan x="1280">Spindle nose, mounting flange, housing</tspan><tspan x="1280" dy="17">condition, and nearby clearances.</tspan></text>
    <rect x="1278" y="570" width="302" height="111" rx="6" fill="#fff8ee" stroke="#ead5b8"/><text x="1294" y="597" font-size="9" font-weight="700" letter-spacing="1" fill="#9b5b12">SAFETY</text><text x="1294" y="621" font-size="11" fill="#604b32"><tspan x="1294">Treat the spindle as a rotating-energy</tspan><tspan x="1294" dy="17">hazard. Control motion and energy before</tspan><tspan x="1294" dy="17">close inspection or service.</tspan></text>
    <text x="1280" y="731" font-size="9" font-weight="700" letter-spacing="1" fill="#79817f">RELATED TOOLS</text><rect x="1280" y="750" width="90" height="34" rx="4" fill="#fff" stroke="#cfd5d1"/><text x="1325" y="772" text-anchor="middle" font-size="10">Explode</text><rect x="1380" y="750" width="90" height="34" rx="4" fill="#fff" stroke="#cfd5d1"/><text x="1425" y="772" text-anchor="middle" font-size="10">Section</text><rect x="1480" y="750" width="90" height="34" rx="4" fill="#fff" stroke="#cfd5d1"/><text x="1525" y="772" text-anchor="middle" font-size="10">Measure</text>
    <path d="M1280 820H1580" stroke="#e2e6e3"/><circle cx="1288" cy="851" r="4" fill="#2d806a"/><text x="1300" y="855" font-size="10" fill="#68716f">Geometry, mapping, and annotation checks passed</text>
  </g>
</svg>`;

const cncSvgOutputPath = resolve(projectRoot, "assets/img/projects/cnc-machine-inspector/machine-lab-interface.svg");
const cncPngOutputPath = resolve(projectRoot, "assets/img/projects/cnc-machine-inspector/machine-lab-interface.png");
const cncSvgBuffer = Buffer.from(`${cncSvg}\n`);
writeFileSync(cncSvgOutputPath, cncSvgBuffer);
await sharp(cncSvgBuffer).resize(1600, 900).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(cncPngOutputPath);
console.log(`Wrote ${cncSvgOutputPath}`);
console.log(`Wrote ${cncPngOutputPath}`);
