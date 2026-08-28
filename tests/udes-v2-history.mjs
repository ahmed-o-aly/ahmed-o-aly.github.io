import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  PUBLIC_PRESETS,
  HISTORY_CSV_HEADERS,
  createHistoryPoint,
  historyEntryCsvRow,
  historyToCsv,
  resolveHistoryPolicy,
  addUtcCalendarMonths,
  completedCalendarMonthsFrom,
  nextCalendarBoundaryDayFrom,
  horizonEndDayFrom,
  formatChartMonthUtc,
  formatChartDayUtc,
  clampDailyStep,
  canSelectHorizon,
  filterHistoryWindow,
  aggregateFlowRoutes,
  flowSeriesForZone,
  topInterDistrictCommutes,
  commuteLiveWorkByDistrict,
  commuteOdMatrix,
  selectedDistrictCommuteExchange,
  commuteRangeMessage,
  summarizeChart,
} = require("../assets/js/udes-v2-app.js");
const app = readFileSync(new URL("../assets/js/udes-v2-app.js", import.meta.url), "utf8");

const referencePatch = {
  scenario: "reference",
  policyScopeZoneId: "city",
  ...PUBLIC_PRESETS.reference,
};
assert.deepEqual(Object.keys(PUBLIC_PRESETS).sort(), ["balanced", "housing", "reference", "transit"], "all four public presets are exportable");
assert.ok(Object.values(PUBLIC_PRESETS).every(Object.isFrozen), "public preset inputs are immutable shared validation contracts");

assert.deepEqual(
  topInterDistrictCommutes(
    [
      { homeZoneId: "mushrif", workZoneId: "reem", representedWorkers: 500 },
      { homeZoneId: "mushrif", workZoneId: "reem", representedWorkers: 250 },
      { homeZoneId: "reem", workZoneId: "mushrif", representedWorkers: 600 },
      { homeZoneId: "reem", workZoneId: "reem", representedWorkers: 900 },
      { homeZoneId: "reem", workZoneId: null, representedResidents: 400 },
    ],
    2
  ),
  [
    { fromZoneId: "mushrif", toZoneId: "reem", value: 750 },
    { fromZoneId: "reem", toZoneId: "mushrif", value: 600 },
  ],
  "agent-map commute lines aggregate directed cross-district worker stocks and exclude same-district or unemployed rows"
);

const commuteStockFixture = [
  { homeZoneId: "mushrif", workZoneId: "reem", representedWorkers: 600 },
  { homeZoneId: "mushrif", workZoneId: "danah", representedWorkers: 200 },
  { homeZoneId: "reem", workZoneId: "mushrif", representedWorkers: 350 },
  { homeZoneId: "danah", workZoneId: "mushrif", representedWorkers: 150 },
  { homeZoneId: "mushrif", workZoneId: "mushrif", representedWorkers: 100 },
  { homeZoneId: "reem", workZoneId: null, representedResidents: 400, representedWorkers: 0 },
];
assert.deepEqual(
  commuteLiveWorkByDistrict(commuteStockFixture, ["mushrif", "reem", "danah"]),
  [
    { districtId: "mushrif", employedResidents: 900, locatedJobs: 600, netJobBalance: -300 },
    { districtId: "reem", employedResidents: 350, locatedJobs: 600, netJobBalance: 250 },
    { districtId: "danah", employedResidents: 150, locatedJobs: 200, netJobBalance: 50 },
  ],
  "live/work district stocks count employed residents at home and the same workers at their job locations"
);
const commuteMatrixFixture = commuteOdMatrix(commuteStockFixture, ["mushrif", "reem", "danah"]);
assert.deepEqual(commuteMatrixFixture.districtIds, ["mushrif", "reem", "danah"], "the OD matrix preserves the displayed district order");
assert.equal(commuteMatrixFixture.cells.length, 9, "the OD matrix includes zero cells so all home/work combinations remain legible");
assert.deepEqual(
  commuteMatrixFixture.cells.find(([work, home]) => work === 1 && home === 0),
  [1, 0, 600]
);
assert.deepEqual(
  commuteMatrixFixture.cells.find(([work, home]) => work === 0 && home === 1),
  [0, 1, 350]
);
assert.equal(commuteMatrixFixture.maximum, 600, "the OD matrix reports its observed maximum for a truthful color scale");
assert.deepEqual(
  selectedDistrictCommuteExchange(commuteStockFixture, "mushrif"),
  {
    districtId: "mushrif",
    sameDistrict: 100,
    destinations: [
      { counterpartDistrictId: "reem", value: 600 },
      { counterpartDistrictId: "danah", value: 200 },
    ],
    origins: [
      { counterpartDistrictId: "reem", value: 350 },
      { counterpartDistrictId: "danah", value: 150 },
    ],
    outboundWorkers: 800,
    inboundWorkers: 500,
  },
  "selected-district commute exchange separates outward job destinations, inward home origins, and within-district work"
);

const changedPresetFields = (name) =>
  Object.keys(PUBLIC_PRESETS.reference).filter((field) => PUBLIC_PRESETS[name][field] !== PUBLIC_PRESETS.reference[field]);
assert.deepEqual(
  changedPresetFields("transit"),
  ["transitFareAed", "transitSpeedKmh", "transitWaitMin", "ptCapacityMultiplier"],
  "the bus template changes only fare, speed, wait and capacity"
);
assert.deepEqual(changedPresetFields("housing"), ["housingCapacityMultiplier"], "the housing template changes only housing delivery");
assert.deepEqual(
  changedPresetFields("balanced"),
  ["housingCapacityMultiplier", "businessCapacityMultiplier", "placeQuality"],
  "the co-located growth template changes only housing, employment space and place quality"
);

// Calendar-month helpers remain exported for the full validation harness, but
// the browser controller now advances and displays exact daily horizons.
const januaryMonthEnd = new Date("2024-01-31T00:00:00Z");
assert.equal(addUtcCalendarMonths(januaryMonthEnd, 1).toISOString(), "2024-02-29T00:00:00.000Z", "calendar stepping clamps to leap day");
assert.equal(completedCalendarMonthsFrom(januaryMonthEnd, new Date("2024-02-29T00:00:00Z")), 1);
const simulationStart = new Date("2024-01-01T00:00:00Z");
assert.equal(nextCalendarBoundaryDayFrom(simulationStart, new Date("2024-02-15T00:00:00Z"), 1), 60);
assert.equal(horizonEndDayFrom(simulationStart, 12), 366, "the validation helper retains exact calendar-year semantics");
assert.equal(formatChartMonthUtc(simulationStart), "Jan 24");
assert.equal(formatChartDayUtc(new Date("2024-02-29T00:00:00Z")), "29 Feb 24", "daily chart labels include the UTC day");
assert.equal(clampDailyStep(360, 366, 30), 6, "a daily step clamps exactly to the selected leap-year horizon");
assert.equal(clampDailyStep(366, 366, 7), 0, "no update runs beyond the daily horizon");
assert.equal(clampDailyStep(12, 90, 7), 7, "ordinary daily chunks are preserved");
assert.equal(canSelectHorizon(120, 90), false, "a horizon shorter than elapsed time is rejected");
assert.equal(canSelectHorizon(120, 366), true, "an equal-or-longer daily horizon remains selectable");
const windowFixture = Array.from({ length: 120 }, (_value, day) => ({ day, date: new Date(simulationStart.valueOf() + day * 86400000) }));
assert.equal(filterHistoryWindow(windowFixture, 30).length, 30, "the 30-day chart window retains 30 consecutive points");
assert.equal(filterHistoryWindow(windowFixture, 0).length, 120, "the full chart window retains the full run");

const flowHistory = Array.from({ length: 31 }, (_value, index) => ({
  day: index + 1,
  date: new Date(Date.UTC(2024, 0, index + 1)).toISOString().slice(0, 10),
  flows: { residentialMoves: [], jobMoves: [], enterpriseMoves: [] },
}));
const flowsOn = (day) => flowHistory[day - 1].flows;
flowsOn(1).residentialMoves.push({
  fromZoneId: "mushrif",
  toZoneId: "danah",
  reason: "early-flow-outside-30-days",
  representedResidents: 100,
});
flowsOn(1).jobMoves.push({ fromZoneId: "mushrif", toZoneId: "danah", reason: "early-job", representedWorkers: 1000 });
flowsOn(1).enterpriseMoves.push({ fromZoneId: "mushrif", toZoneId: "danah", reason: "early-firm", enterpriseCount: 10 });
flowsOn(2).residentialMoves.push({ fromZoneId: "danah", toZoneId: "mushrif", reason: "cheaper-rent", representedResidents: 20 });
flowsOn(2).jobMoves.push({ fromZoneId: "danah", toZoneId: "mushrif", reason: "better-job", representedWorkers: 12 });
flowsOn(2).enterpriseMoves.push({ fromZoneId: "danah", toZoneId: "mushrif", reason: "growth-quality", enterpriseCount: 2 });
flowsOn(24).residentialMoves.push({ fromZoneId: "mushrif", toZoneId: "reem", reason: "lower-commute-cost", representedResidents: 5 });
flowsOn(24).jobMoves.push({ fromZoneId: "reem", toZoneId: "mushrif", reason: "better-job", representedWorkers: 9 });
flowsOn(24).enterpriseMoves.push({ fromZoneId: "mushrif", toZoneId: "danah", reason: "contraction-rent", enterpriseCount: 4 });
flowsOn(25).residentialMoves.push({ fromZoneId: "reem", toZoneId: "mushrif", reason: "workplace-zone", representedResidents: 7 });
flowsOn(25).jobMoves.push({ fromZoneId: "mushrif", toZoneId: "reem", reason: "better-job", representedWorkers: 8 });
flowsOn(25).enterpriseMoves.push({ fromZoneId: "danah", toZoneId: "mushrif", reason: "growth-quality", enterpriseCount: 1 });
flowsOn(30).residentialMoves.push({ fromZoneId: "mushrif", toZoneId: "danah", reason: "cheaper-rent", representedResidents: 3 });
flowsOn(30).jobMoves.push({ fromZoneId: "danah", toZoneId: "mushrif", reason: "better-job", representedWorkers: 2 });
flowsOn(30).enterpriseMoves.push({ fromZoneId: "mushrif", toZoneId: "reem", reason: "contraction-rent", enterpriseCount: 2 });
flowsOn(31).residentialMoves.push({ fromZoneId: "danah", toZoneId: "mushrif", reason: "workplace-zone", representedResidents: 4 });
flowsOn(31).jobMoves.push({ fromZoneId: "mushrif", toZoneId: "reem", reason: "better-job", representedWorkers: 6 });
flowsOn(31).enterpriseMoves.push({ fromZoneId: "reem", toZoneId: "mushrif", reason: "growth-quality", enterpriseCount: 3 });

assert.deepEqual(
  aggregateFlowRoutes(flowHistory, "residential", 1, 31),
  [{ fromZoneId: "danah", toZoneId: "mushrif", value: 4, reasons: { "workplace-zone": 4 } }],
  "one-day OD aggregation contains only the latest daily residential route"
);
const sevenDayResidential = aggregateFlowRoutes(flowHistory, "residential", 7, 31);
assert.equal(
  sevenDayResidential.reduce((total, route) => total + route.value, 0),
  14,
  "seven-day OD aggregation includes days 25 through 31"
);
assert.equal(sevenDayResidential.length, 3, "seven-day OD aggregation preserves each residential direction");
const thirtyDayResidential = aggregateFlowRoutes(flowHistory, "residential", 30, 31);
assert.equal(
  thirtyDayResidential.find((route) => route.fromZoneId === "mushrif" && route.toZoneId === "danah")?.value,
  3,
  "thirty-day OD aggregation excludes the route on day 1"
);
assert.deepEqual(
  thirtyDayResidential.find((route) => route.fromZoneId === "danah" && route.toZoneId === "mushrif")?.reasons,
  { "cheaper-rent": 20, "workplace-zone": 4 },
  "OD aggregation retains decision reasons across days"
);
assert.equal(
  aggregateFlowRoutes(flowHistory, "job", 7, 31).find((route) => route.fromZoneId === "mushrif" && route.toZoneId === "reem")?.value,
  14,
  "job-route aggregation uses represented workers rather than residential counts"
);
assert.equal(
  aggregateFlowRoutes(flowHistory, "enterprise", 30, 31).find((route) => route.fromZoneId === "mushrif" && route.toZoneId === "danah")?.value,
  4,
  "enterprise-route aggregation uses enterprise counts and the selected 30-day boundary"
);

assert.deepEqual(
  flowSeriesForZone(flowHistory, "residential", "mushrif", 1, 31),
  [{ day: 31, date: "2024-01-31", inflow: 4, outflow: 0, net: 4 }],
  "one-day district flow series exposes exact inflow, outflow, and net"
);
const sevenDayMushrif = flowSeriesForZone(flowHistory, "residential", "mushrif", 7, 31);
assert.equal(sevenDayMushrif.length, 7, "seven-day district series retains zero-flow days instead of collapsing time");
assert.deepEqual(
  sevenDayMushrif.find((point) => point.day === 25),
  { day: 25, date: "2024-01-25", inflow: 7, outflow: 0, net: 7 },
  "district residential inflows are assigned to the destination"
);
assert.deepEqual(
  sevenDayMushrif.find((point) => point.day === 30),
  { day: 30, date: "2024-01-30", inflow: 0, outflow: 3, net: -3 },
  "district residential outflows are negative in the net balance"
);
assert.deepEqual(
  sevenDayMushrif.reduce(
    (totals, point) => ({ inflow: totals.inflow + point.inflow, outflow: totals.outflow + point.outflow, net: totals.net + point.net }),
    { inflow: 0, outflow: 0, net: 0 }
  ),
  { inflow: 11, outflow: 3, net: 8 },
  "seven-day district totals reconcile inflow minus outflow to net"
);
const thirtyDayMushrif = flowSeriesForZone(flowHistory, "residential", "mushrif", 30, 31);
assert.equal(thirtyDayMushrif.length, 30, "thirty-day district series starts at day 2 for a day-31 endpoint");
assert.equal(thirtyDayMushrif[0].day, 2, "thirty-day district series applies an inclusive rolling boundary");
assert.deepEqual(
  thirtyDayMushrif.reduce(
    (totals, point) => ({ inflow: totals.inflow + point.inflow, outflow: totals.outflow + point.outflow, net: totals.net + point.net }),
    { inflow: 0, outflow: 0, net: 0 }
  ),
  { inflow: 31, outflow: 8, net: 23 },
  "thirty-day district residential stock-flow totals reconcile"
);
const sevenDayJobMushrif = flowSeriesForZone(flowHistory, "job", "mushrif", 7, 31);
assert.deepEqual(
  sevenDayJobMushrif.reduce(
    (totals, point) => ({ inflow: totals.inflow + point.inflow, outflow: totals.outflow + point.outflow, net: totals.net + point.net }),
    { inflow: 0, outflow: 0, net: 0 }
  ),
  { inflow: 2, outflow: 14, net: -12 },
  "job changes use their own represented-worker district balance"
);
const thirtyDayEnterpriseMushrif = flowSeriesForZone(flowHistory, "enterprise", "mushrif", 30, 31);
assert.deepEqual(
  thirtyDayEnterpriseMushrif.reduce(
    (totals, point) => ({ inflow: totals.inflow + point.inflow, outflow: totals.outflow + point.outflow, net: totals.net + point.net }),
    { inflow: 0, outflow: 0, net: 0 }
  ),
  { inflow: 6, outflow: 6, net: 0 },
  "enterprise relocations use enterprise counts and reconcile the district net"
);
const replacementHistory = [
  {
    day: 1,
    date: "2024-01-01",
    flows: {
      residentialMoves: [],
      jobMoves: [],
      enterpriseMoves: [],
      replacementRelocations: [
        {
          fromZoneId: "mushrif",
          toZoneId: "danah",
          reason: "replacement-lowest-rent",
          representedResidents: 250,
        },
      ],
    },
  },
];
assert.deepEqual(
  aggregateFlowRoutes(replacementHistory, "replacement", 1, 1),
  [
    {
      fromZoneId: "mushrif",
      toZoneId: "danah",
      value: 250,
      reasons: { "replacement-lowest-rent": 250 },
    },
  ],
  "replacement placements remain available as their own event taxonomy"
);
assert.deepEqual(
  flowSeriesForZone(replacementHistory, "replacement", "mushrif", 1, 1),
  [{ day: 1, date: "2024-01-01", inflow: 0, outflow: 250, net: -250 }],
  "district replacement-placement balances remain separate from household moves"
);
assert.deepEqual(aggregateFlowRoutes(replacementHistory, "residential", 1, 1), [], "household relocation charts exclude demographic replacements");
const actorMeasureHistory = [
  {
    day: 1,
    date: "2024-01-01",
    flows: {
      residentialMoves: [{ fromZoneId: "mushrif", toZoneId: "danah", reason: "cheaper-rent", citizenAgentCount: 2, representedResidents: 500 }],
      jobMoves: [],
      enterpriseMoves: [
        {
          fromZoneId: "danah",
          toZoneId: "reem",
          reason: "growth-quality",
          enterpriseCount: 1,
          affectedCitizenAgentCount: 3,
          representedWorkersAffected: 750,
        },
      ],
      replacementRelocations: [],
    },
  },
];
assert.equal(aggregateFlowRoutes(actorMeasureHistory, "residential", 1, 1, "agents")[0].value, 2);
assert.equal(aggregateFlowRoutes(actorMeasureHistory, "residential", 1, 1, "represented")[0].value, 500);
assert.equal(
  aggregateFlowRoutes(actorMeasureHistory, "workplace", 1, 1, "agents")[0].value,
  3,
  "workers carried by a firm move are counted separately from voluntary job switches"
);

assert.match(commuteRangeMessage(52, 45), /above the applied 45-minute/, "zone insight respects a non-default applied commute threshold");
assert.match(commuteRangeMessage(42, 45), /within the applied 45-minute/, "zone insight reports when commute is inside the applied threshold");
assert.match(
  summarizeChart("Financial status", {
    xAxis: { type: "category", data: ["Unemployed", "Pay < housing + commute", "Savings capacity"] },
    series: [{ name: "Represented residents (%)", type: "bar", data: [20, 3.5, 54.25] }],
  }),
  /Unemployed: 20\.0, Pay < housing \+ commute: 3\.5, Savings capacity: 54\.3/,
  "financial-status summaries explain mutually exclusive household groups instead of a net-income zero bin"
);
const districtLabels = Array.from({ length: 18 }, (_value, index) => `District ${index + 1}`);
assert.match(
  summarizeChart("District population", {
    xAxis: { type: "category", data: districtLabels },
    series: [{ name: "Residents", type: "bar", data: districtLabels.map((_label, index) => (index + 1) * 1000) }],
  }),
  /District 18: 18000\.0/,
  "categorical chart summaries include all 18 districts"
);
const longBarSummary = summarizeChart("Daily transitions", {
  xAxis: { type: "category", data: Array.from({ length: 90 }, (_value, index) => `Day ${index + 1}`) },
  series: [{ name: "Hires", type: "bar", data: Array.from({ length: 90 }, (_value, index) => index) }],
});
assert.match(longBarSummary, /latest 89\.0, range 0\.0 to 89\.0/, "long temporal bars receive a compact accessible summary");
assert.doesNotMatch(longBarSummary, /Day 45:/, "long temporal bars do not produce enormous screen-reader labels");
assert.match(
  summarizeChart("Home to work matrix", {
    xAxis: { type: "category", data: ["Mushrif", "Reem"] },
    yAxis: { type: "category", data: ["Mushrif", "Reem"] },
    series: [
      {
        name: "Employed residents",
        type: "heatmap",
        data: [
          [0, 0, 100],
          [1, 0, 600],
          [0, 1, 350],
          [1, 1, 0],
        ],
      },
    ],
  }),
  /range 0\.0 to 600\.0/,
  "heatmap arrays contribute their worker values to the chart's accessible summary"
);
assert.match(
  summarizeChart("Policy trend", {
    xAxis: { type: "category", data: ["1 Jan 24", "2 Jan 24"] },
    series: [{ name: "Active", type: "line", data: [40, 42], markLine: { data: [{ name: "Bus priority · 2 Jan 24" }] } }],
  }),
  /Interventions: Bus priority · 2 Jan 24/,
  "chart summaries announce visible intervention markers"
);

const referencePolicy = resolveHistoryPolicy(referencePatch);
const historyMetrics = {
  population: 1517500,
  satisfaction: 0.56,
  meanCommute: 46.6,
  carShare: 0.59,
  carOwnership: 0.68,
  ptShare: 0.3,
  walkShare: 0.11,
  roadLoad: 0.14,
  netIncome: 6300,
  bankBalance: 70000,
  activeEnterpriseShare: 0.94,
  lossMakingEnterpriseShare: 0.18,
  enterprisePortfolioMargin: 0.12,
};
const referencePoint = createHistoryPoint(
  {
    day: 0,
    date: new Date("2024-01-01T00:00:00Z"),
    networkAssignmentDate: "2024-01-01",
    networkAssignmentStatus: "current",
    intervention: "",
    hires: 0,
    fires: 0,
    moves: 0,
    ...historyMetrics,
  },
  referencePolicy
);
const laterControlValues = {
  ...referencePolicy,
  scenario: "custom",
  policyScopeZoneId: "mushrif",
  transitFareAed: 0.75,
  transitSpeedKmh: 38,
};
const customPoint = createHistoryPoint(
  {
    day: 5,
    date: new Date("2024-01-06T00:00:00Z"),
    networkAssignmentDate: "2024-01-05",
    networkAssignmentStatus: "retained-last-workday",
    intervention: "Custom scenario · Al Mushrif",
    interventionScope: "Al Mushrif land use + network-wide mobility",
    interventionFields: "housingCapacityMultiplier|transitSpeedKmh",
    zonePolicyState: [{ id: "mushrif", housingCapacityMultiplier: 1.3, businessCapacityMultiplier: 1, placeQuality: 0.82 }],
    hires: 1250,
    fires: 250,
    moves: 500,
    ...historyMetrics,
  },
  laterControlValues,
  referencePolicy
);
laterControlValues.scenario = "balanced";
laterControlValues.policyScopeZoneId = "city";
laterControlValues.transitFareAed = 4.5;

const rows = [referencePoint, customPoint].map(historyEntryCsvRow);
const column = (name) => HISTORY_CSV_HEADERS.indexOf(name);
assert.equal(rows[0][column("scenario")], "reference", "an earlier CSV row retains its captured scenario");
assert.equal(rows[1][column("scenario")], "custom", "a later CSV row records the custom scenario at capture time");
assert.equal(rows[1][column("policy_scope_zone_id")], "mushrif", "daily CSV captures the applied district scope");
assert.equal(rows[1][column("network_assignment_date")], "2024-01-05");
assert.equal(rows[1][column("network_assignment_status")], "retained-last-workday", "weekend assignment semantics survive CSV export");
assert.equal(rows[1][column("daily_hires_represented")], 1250, "daily represented hires are exported exactly");
assert.equal(rows[1][column("daily_fires_represented")], 250, "daily represented fires are exported exactly");
assert.equal(rows[1][column("daily_moves_represented")], 500, "daily represented moves are exported exactly");
assert.equal(rows[1][column("intervention_scope")], "Al Mushrif land use + network-wide mobility");
assert.equal(rows[1][column("intervention_fields")], "housingCapacityMultiplier|transitSpeedKmh");
assert.match(rows[1][column("district_land_use_state_json")], /"mushrif"/, "district policy state is serialized per day");
assert.equal(rows[1][column("active_enterprise_share")], 0.94, "daily enterprise outcomes are exportable");
assert.equal(rows[1][column("transit_fare_aed")], 0.75, "later control mutations cannot rewrite a captured fare");
assert.equal(rows[1].length, HISTORY_CSV_HEADERS.length, "daily CSV rows align with the header contract");
const mixedPoint = {
  ...customPoint,
  day: 6,
  policyScopeZoneId: "mixed",
  housingCapacityMultiplier: 1.3,
  businessCapacityMultiplier: 1.15,
  placeQuality: 0.9,
  zonePolicyState: [
    { id: "mushrif", housingCapacityMultiplier: 1.3, businessCapacityMultiplier: 1.15, placeQuality: 0.9 },
    { id: "danah", housingCapacityMultiplier: 1, businessCapacityMultiplier: 1, placeQuality: 0.82 },
  ],
};
const mixedRow = historyEntryCsvRow(mixedPoint);
for (const header of [
  "uniform_or_target_housing_capacity_multiplier",
  "uniform_or_target_business_capacity_multiplier",
  "uniform_or_target_place_quality",
]) {
  assert.equal(mixedRow[column(header)], "", `${header} is blank when district land-use inputs are heterogeneous`);
}
assert.match(mixedRow[column("district_land_use_state_json")], /"mushrif"/, "mixed exports retain the complete district policy state");
const csv = historyToCsv([referencePoint, customPoint]);
assert.match(csv, /"0","2024-01-01","2024-01-01","current","reference"/, "CSV serialization includes daily reference fields");
assert.match(csv, /"5","2024-01-06","2024-01-05","retained-last-workday","custom","mushrif"/, "CSV preserves the captured weekend row");

const exportFunction = app.match(/function exportCsv\(\) \{([\s\S]*?)\n  \}\n\n  function setupResponsiveBehavior/);
assert.ok(exportFunction, "CSV export function is present");
assert.match(exportFunction[1], /historyToCsv\(state\.history\)/, "CSV export serializes captured history rows");
assert.doesNotMatch(exportFunction[1], /currentPatch\(|state\.scenario,/, "CSV export does not relabel rows from current controls");
assert.match(app, /captureDaily: true/, "the controller asks both workers for consecutive daily observations");
assert.match(app, /chartSource\(\{ workdaysOnly: true \}\)/, "commute charts exclude retained weekend assignments");
assert.match(app, /zoneSeries: \(Array\.isArray\(snapshot\?\.zoneSeries\)/, "daily district histories survive compact worker snapshots");
assert.match(app, /const HISTORY_POINT_LIMIT = 3654/, "the full ten-year daily run plus Day 0 is retained");
assert.match(
  app,
  /transit: Object\.freeze\(\["transitFare", "transitSpeed", "transitWait", "transitCapacity"\]\)/,
  "the bus template stages only its four service levers"
);
assert.match(app, /housing: Object\.freeze\(\["housing"\]\)/, "the housing template stages only housing delivery");
assert.match(app, /balanced: Object\.freeze\(\["housing", "business", "placeQuality"\]\)/, "the co-located template stages only land-use levers");
const applyPresetFunction = app.match(/function applyPreset\(name\) \{([\s\S]*?)\n  \}\n\n  function markCustomScenario/);
assert.ok(applyPresetFunction, "selective preset handler is present");
assert.match(
  applyPresetFunction[1],
  /name === "reference"[\s\S]*ui\.policyScope\.value = "city"[\s\S]*state\.draftScopeDirty = true/,
  "Reference explicitly stages a citywide reset after district interventions"
);
assert.match(
  app,
  /state\.worker\.request\("configure"[\s\S]*state\.referenceWorker\.request\("configure"/,
  "Apply configures active and reference workers together"
);
const stagedPatchFunction = app.match(/function stagedEnginePatch\(policy, reference = false\) \{([\s\S]*?)\n  \}\n\n  function structuralConfig/);
assert.ok(stagedPatchFunction, "selective staged-patch builder is present");
assert.match(
  stagedPatchFunction[1],
  /!reference \|\| ASSUMPTION_FIELDS\.includes\(field\)/,
  "the reference receives shared assumptions but not scenario policy fields"
);
const applyFunction = app.match(/async function applyDraftPolicy\(\) \{([\s\S]*?)\n  \}\n\n  function clearPendingWork/);
assert.ok(applyFunction, "staged Apply handler is present");
assert.doesNotMatch(applyFunction[1], /recordHistory|recordDailySeries/, "Apply does not replace the current day's captured history");
assert.match(applyFunction[1], /effectiveDay = state\.elapsedDays \+ 1/, "the intervention marker is dated for the next model day");
assert.match(applyFunction[1], /setMutationControlsDisabled\(true\)/, "Apply freezes draft controls while worker configuration is in flight");
assert.match(applyFunction[1], /drainPendingWork\(\)/, "Apply drains a reset queued during worker configuration");
assert.match(app, /policyScopeZoneId: ui\.policyScope\?\.value \|\| "city"/, "policy scope comes from the intervention target selector");
assert.match(app, /loadAppliedLandUseControls\(ui\.policyScope\.value\)/, "target changes reload that district's applied land-use inputs");
const resetDraftFunction = app.match(/function resetDraft\(\) \{([\s\S]*?)\n  \}\n\n  function updateLeverOutput/);
assert.ok(resetDraftFunction, "draft reset handler is present");
assert.match(resetDraftFunction[1], /selectedScope = ui\.policyScope\?\.value/, "draft reset preserves the selected district target");
assert.match(resetDraftFunction[1], /loadAppliedLandUseControls\(selectedScope\)/, "draft reset reloads the selected district's applied values");
assert.match(app, /input\.removeAttribute\("aria-valuetext"\)/, "numeric land-use inputs clear any mixed-value accessibility label");
assert.match(app, /function addInterventionMarkers\(/, "trend charts expose mid-run policy dates");
const zoneSelectorHandler = app.match(/ui\.zoneSelect\?\.addEventListener\("change", \(\) => \{([\s\S]*?)\n    \}\);/);
assert.ok(zoneSelectorHandler, "zone inspection selector handler is present");
assert.doesNotMatch(zoneSelectorHandler[1], /applyDraftPolicy|policyScope/, "changing the inspected zone does not alter policy scope or history");
assert.doesNotMatch(
  app,
  /monthlyHiresRepresented|monthlyFiresRepresented|monthlyMovesRepresented/,
  "daily charts and CSV do not reuse completed-month events"
);
const resetFunction = app.match(/async function resetModel\(\) \{([\s\S]*?)\n  \}\n\n  function bindControls/);
assert.ok(resetFunction, "reset handler is present");
assert.match(
  resetFunction[1],
  /state\.appliedPolicy \|\| policyFromControls\(\)/,
  "reset uses applied policy rather than silently applying draft inputs"
);
assert.match(
  resetFunction[1],
  /patch: \{ \.\.\.enginePolicyPatch\(activeResetBase\), seed: state\.seed, zonePolicies \}/,
  "reset initializes agents with the heterogeneous district policies already applied"
);
assert.doesNotMatch(
  resetFunction[1],
  /configure", \{ patch: \{ zonePolicies \}, reset: false/,
  "reset does not replay district policies after initializing agents"
);
assert.match(resetFunction[1], /the unapplied draft was preserved/, "reset communicates preserved draft state");
assert.match(applyFunction[1], /state\.elapsedDays >= state\.horizonDays/, "Apply is blocked when there is no future model day");
assert.match(app, /\[data-udes-v2-horizon\]/, "the horizon selector participates in the model transaction lock");
assert.match(
  app,
  /ui\.horizon\?\.addEventListener\("change", \(\) => \{[\s\S]*?if \(state\.busy\)/,
  "an in-flight daily step cannot shrink the horizon below its pending result"
);
assert.match(
  app,
  /Model data is unavailable\. Reload the page to retry\./,
  "initialization failure replaces the loading placeholder with recovery guidance"
);
assert.match(
  app,
  /root\.dataset\.udesV2State === "error"[\s\S]*?state\.busy[\s\S]*?!state\.worker/,
  "responsive control restoration preserves busy and failed runtime locks"
);

console.log("UDES v2 daily history export regression passed");
