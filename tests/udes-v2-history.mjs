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

const changedPresetFields = (name) =>
  Object.keys(PUBLIC_PRESETS.reference).filter((field) => PUBLIC_PRESETS[name][field] !== PUBLIC_PRESETS.reference[field]);
assert.deepEqual(
  changedPresetFields("transit"),
  ["transitFareAed", "transitSpeedKmh", "ptCapacityMultiplier"],
  "the bus template changes only fare, speed and capacity"
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
const longBarSummary = summarizeChart("Daily transitions", {
  xAxis: { type: "category", data: Array.from({ length: 90 }, (_value, index) => `Day ${index + 1}`) },
  series: [{ name: "Hires", type: "bar", data: Array.from({ length: 90 }, (_value, index) => index) }],
});
assert.match(longBarSummary, /latest 89\.0, range 0\.0 to 89\.0/, "long temporal bars receive a compact accessible summary");
assert.doesNotMatch(longBarSummary, /Day 45:/, "long temporal bars do not produce enormous screen-reader labels");
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
  /transit: Object\.freeze\(\["transitFare", "transitSpeed", "transitCapacity"\]\)/,
  "the bus template stages only its three service levers"
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
