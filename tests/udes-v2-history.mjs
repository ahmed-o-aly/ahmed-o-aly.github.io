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
  commuteRangeMessage,
  summarizeChart,
} = require("../assets/js/udes-v2-app.js");
const app = readFileSync(new URL("../assets/js/udes-v2-app.js", import.meta.url), "utf8");

const referencePatch = {
  scenario: "reference",
  ...PUBLIC_PRESETS.reference,
};
assert.deepEqual(Object.keys(PUBLIC_PRESETS).sort(), ["balanced", "housing", "reference", "transit"], "all four public presets are exportable");
assert.ok(Object.values(PUBLIC_PRESETS).every(Object.isFrozen), "public preset inputs are immutable shared validation contracts");

const januaryMonthEnd = new Date("2024-01-31T00:00:00Z");
assert.equal(addUtcCalendarMonths(januaryMonthEnd, 1).toISOString(), "2024-02-29T00:00:00.000Z", "calendar stepping clamps to leap day");
assert.equal(
  addUtcCalendarMonths(new Date("2024-02-29T00:00:00Z"), 12).toISOString(),
  "2025-02-28T00:00:00.000Z",
  "calendar stepping clamps leap day in a non-leap year"
);
assert.equal(completedCalendarMonthsFrom(januaryMonthEnd, new Date("2024-02-28T00:00:00Z")), 0, "a clamped month-end is not complete one day early");
assert.equal(completedCalendarMonthsFrom(januaryMonthEnd, new Date("2024-02-29T00:00:00Z")), 1, "a clamped month-end completes on leap day");
const simulationStart = new Date("2024-01-01T00:00:00Z");
assert.equal(
  nextCalendarBoundaryDayFrom(simulationStart, new Date("2024-02-15T00:00:00Z"), 1),
  60,
  "the next monthly boundary is March 1 in a leap year"
);
assert.deepEqual(
  [12, 24, 60, 120].map((months) => horizonEndDayFrom(simulationStart, months)),
  [366, 731, 1827, 3653],
  "public horizons end on exact UTC calendar anniversaries"
);
assert.equal(formatChartMonthUtc(new Date("2024-01-01T00:00:00Z")), "Jan 24", "chart month labels are anchored to UTC");
assert.match(commuteRangeMessage(52, 45), /above the applied 45-minute/, "zone insight respects a non-default applied commute threshold");
assert.match(commuteRangeMessage(42, 45), /within the applied 45-minute/, "zone insight reports when commute is inside the applied threshold");
assert.match(
  summarizeChart("Net income distribution", {
    xAxis: { type: "category", data: ["Below AED 0", "AED 0–1,999"] },
    series: [{ name: "Represented residents", type: "bar", data: [12500, 48750] }],
  }),
  /Below AED 0: 12500\.0, AED 0–1,999: 48750\.0/,
  "categorical histogram summaries expose every tested bin label and represented count"
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
const referencePolicy = resolveHistoryPolicy(referencePatch);
const historyMetrics = {
  population: 1822750,
  satisfaction: 0.56,
  meanCommute: 46.6,
  carShare: 0.59,
  carOwnership: 0.68,
  ptShare: 0.3,
  walkShare: 0.11,
  roadLoad: 0.14,
  netIncome: 6300,
  bankBalance: 70000,
};
const referencePoint = createHistoryPoint({ day: 0, date: new Date("2024-01-01T00:00:00Z"), ...historyMetrics }, referencePolicy);

const laterControlValues = {
  ...referencePolicy,
  scenario: "custom",
  transitFareAed: 0.75,
  transitSpeedKmh: 38,
};
const customPoint = createHistoryPoint({ day: 31, date: new Date("2024-02-01T00:00:00Z"), ...historyMetrics }, laterControlValues, referencePolicy);
laterControlValues.scenario = "balanced";
laterControlValues.transitFareAed = 4.5;

const scenarioColumn = HISTORY_CSV_HEADERS.indexOf("scenario");
const transitFareColumn = HISTORY_CSV_HEADERS.indexOf("transit_fare_aed");
const transitSpeedColumn = HISTORY_CSV_HEADERS.indexOf("transit_speed_kmh");
const rows = [referencePoint, customPoint].map(historyEntryCsvRow);

assert.equal(rows[0][scenarioColumn], "reference", "an earlier CSV row retains its captured scenario");
assert.equal(rows[0][transitFareColumn], 2, "an earlier CSV row retains its captured fare");
assert.equal(rows[1][scenarioColumn], "custom", "a later CSV row records the custom scenario at capture time");
assert.equal(rows[1][transitFareColumn], 0.75, "later control mutations cannot rewrite a captured fare");
assert.equal(rows[1][transitSpeedColumn], 38, "a later CSV row records its changed speed");
assert.match(historyToCsv([referencePoint, customPoint]), /"reference","1822750"/, "CSV serialization uses captured reference fields");
assert.match(historyToCsv([referencePoint, customPoint]), /"custom","1822750"/, "CSV serialization preserves captured custom fields");

const exportFunction = app.match(/function exportCsv\(\) \{([\s\S]*?)\n  \}\n\n  function setupResponsiveBehavior/);
assert.ok(exportFunction, "CSV export function is present");
assert.match(exportFunction[1], /historyToCsv\(state\.history\)/, "CSV export serializes captured history rows");
assert.doesNotMatch(exportFunction[1], /currentPatch\(|state\.scenario,/, "CSV export does not relabel rows from current controls");
assert.doesNotMatch(app, /focusZoneId/, "inspection scope is never sent to the citywide model as policy");
const zoneSelectorHandler = app.match(/ui\.zoneSelect\?\.addEventListener\("change", \(\) => \{([\s\S]*?)\n    \}\);/);
assert.ok(zoneSelectorHandler, "zone inspection selector handler is present");
assert.doesNotMatch(zoneSelectorHandler[1], /configureModel/, "changing the inspected zone does not reconfigure the model or replace history");

console.log("UDES v2 history export regression passed");
