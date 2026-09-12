import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { CATALOG, buildOption, buildFinancialStatusOption } = require("../assets/js/udes-v2-analysis.js");
const snapshot = (city, day = 31) => ({ clock: { day, date: `2024-02-${String(day - 30).padStart(2, "0")}` }, city });
const bin = (label, minInclusive, maxExclusive, representedCount, extra = {}) => ({ label, minInclusive, maxExclusive, representedCount, ...extra });
const distribution = (kind, representedTotal, bins, day = 31) => snapshot({ distributions: { [kind]: { representedTotal, bins } } }, day);
const valuesOf = (series) => series.data.map((point) => (point && typeof point === "object" && !Array.isArray(point) ? point.value : point));

// The histogram uses represented people, matches reference boundaries, and
// cannot silently align a differently ordered reference by array position.
{
  const active = distribution("commute", 40, [bin("Under 20", 0, 20, 20, { agentCount: 1 }), bin("20+", 20, null, 20, { agentCount: 3 })]);
  const reference = distribution("commute", 80, [bin("Twenty or more", 20, null, 20), bin("Below twenty", 0, 20, 60)]);
  const chart = buildOption("commute-distribution", { snapshot: active, referenceSnapshot: reference, compare: true });
  assert.deepEqual(valuesOf(chart.option.series[0]), [50, 50]);
  assert.deepEqual(valuesOf(chart.option.series[1]), [75, 25]);
  assert.equal(chart.option.yAxis.max, 80, "histogram range fits both scenario and reference percentages");
  assert.match(
    chart.option.tooltip.formatter([
      { dataIndex: 0, seriesName: "Scenario" },
      { dataIndex: 0, seriesName: "Reference" },
    ]),
    /Scenario: 50% \(20 \/ 40 represented completed commuters\)/
  );
  assert.match(chart.summary, /Reference 75%/);
  assert.match(chart.note, /unserved demand and noncommuters are excluded/);
  assert.match(chart.subtitle, /40 represented completed commuters/);
  reference.city.distributions.commute.bins.pop();
  const partial = buildOption("commute-distribution", { snapshot: active, referenceSnapshot: reference, compare: true });
  assert.deepEqual(valuesOf(partial.option.series[1]), [null, 25]);
  assert.match(partial.note, /missing, not zero/);
  reference.clock.day += 1;
  reference.clock.date = "2024-02-02";
  const differentDay = buildOption("commute-distribution", { snapshot: active, referenceSnapshot: reference, compare: true });
  assert.equal(differentDay.option.series.length, 1);
  assert.match(differentDay.note, /date does not match/);
  reference.clock = { ...active.clock };
  active.city.networkAssignmentDate = "2024-01-30";
  reference.city.networkAssignmentDate = "2024-01-31";
  const differentAssignment = buildOption("commute-distribution", { snapshot: active, referenceSnapshot: reference, compare: true });
  assert.equal(differentAssignment.option.series.length, 1);
  assert.match(differentAssignment.note, /travel assignment date does not match/);
}

// Missing counts remain missing. A known empty bin is a real zero, and an
// entirely unobserved population does not manufacture a zero-height chart.
{
  const active = distribution("income", 200, [bin("Below zero", null, 0, 0), bin("0 and above", 0, null, null)]);
  const chart = buildOption("resource-distribution", { snapshot: active });
  assert.deepEqual(valuesOf(chart.option.series[0]), [0, null]);
  assert.equal(chart.option.yAxis.max, 10, "a recorded zero-count bin retains a readable percentage scale");
  assert.match(chart.subtitle, /before essentials/);
  assert.match(chart.note, /resident budget, not an employed-worker salary distribution/);
  assert.match(chart.note, /replacement cohorts use opening estimates/);
  assert.equal(buildOption("resource-distribution", { snapshot: distribution("income", 0, []) }).empty, true);
  for (const definition of CATALOG) {
    const empty = buildOption(definition.id, {});
    assert.equal(empty.empty, true, `${definition.id} reports unavailable source data`);
    assert.deepEqual(empty.option.series, []);
  }
}

// Firm-size shares count employer cohorts, not represented employees.
{
  const chart = buildOption("enterprise-size", {
    snapshot: snapshot({
      citizenWeight: 250,
      distributions: {
        firmSize: {
          enterpriseTotal: 4,
          representedEmployeeTotal: 3000,
          bins: [bin("0 workers", 0, 1, undefined, { enterpriseCount: 1 }), bin("1–4 workers", 1, 5, undefined, { enterpriseCount: 3 })],
        },
      },
    }),
  });
  assert.deepEqual(valuesOf(chart.option.series[0]), [25, 75]);
  assert.deepEqual(chart.option.xAxis.data, ["0 worker cohorts", "1–4 worker cohorts"]);
  assert.match(chart.note, /250 people/);
}

// A waterfall must exactly reconcile each visible step and distinguish the
// two loss mechanisms. Impossible or incomplete accounts are not plotted.
{
  const account = { initialAgentCount: 100, acquisitions: 20, disposals: 30, replacementExits: 5, currentAgentCount: 85 };
  const chart = buildOption("vehicle-access", { snapshot: snapshot({ carAccessAccounting: account }) });
  assert.deepEqual(chart.option.series[0].data, [0, 100, 90, 85, 0]);
  assert.deepEqual(
    chart.option.series[1].data.map((point) => point.signedValue),
    [100, 20, -30, -5, 85]
  );
  assert.deepEqual(
    chart.option.series[1].data.map((point) => point.value),
    [100, 20, 30, 5, 85]
  );
  assert.match(chart.summary, /100 initially \+ 20 acquisitions − 30 financial disposals − 5 replacement exits = 85/);
  assert.equal(buildOption("vehicle-access", { snapshot: snapshot({ carAccessAccounting: { ...account, currentAgentCount: 86 } }) }).empty, true);
  assert.equal(buildOption("vehicle-access", { snapshot: snapshot({ carAccessAccounting: { ...account, acquisitions: null } }) }).empty, true);
}

// The existing budget-category chart matches stable category ids, uses the
// represented-resident denominator, and preserves missing values and dates.
{
  const status = (id, representedCount) => ({ id, label: id, representedCount, agentCount: 1 });
  const active = distribution("financialStatus", 1000, [
    status("fixed-cost-deficit", 200),
    status("essentials-gap", null),
    status("savings-capacity", 0),
  ]);
  const reference = distribution("financialStatus", 2000, [status("savings-capacity", 1000), status("fixed-cost-deficit", 600)]);
  const chart = buildFinancialStatusOption({ snapshot: active, referenceSnapshot: reference, compare: true });
  assert.deepEqual(valuesOf(chart.option.series[0]), [20, null, 0]);
  assert.deepEqual(valuesOf(chart.option.series[1]), [30, null, 50]);
  assert.equal(chart.option.xAxis.data[0], "Housing + mobility gap");
  assert.match(chart.note, /vehicle-access costs/);
  assert.match(chart.note, /categories take priority/);
  assert.match(chart.note, /replacement cohorts use opening estimates/);
  assert.match(chart.note, /missing, not zero/);
  assert.match(chart.option.tooltip.formatter([{ dataIndex: 0, seriesName: "Scenario" }]), /20% \(200 \/ 1,000 represented residents\)/);
  reference.clock.date = "2024-02-02";
  const differentDate = buildFinancialStatusOption({ snapshot: active, referenceSnapshot: reference, compare: true });
  assert.equal(differentDate.option.series.length, 1);
  assert.match(differentDate.note, /date does not match/);
  assert.equal(buildFinancialStatusOption({ snapshot: active, compare: true }).option.series.length, 1);
  assert.equal(buildFinancialStatusOption({}).empty, true);
  assert.equal(
    CATALOG.some((entry) => entry.id === "financial-status"),
    false,
    "the existing view is not duplicated in the catalog"
  );
}

// The scatter uses the complete district aggregate, excludes districts with
// no completed commuters, and exposes stable district ids for click handling.
{
  const zone = (id, rent, minutes, population, car = 10) => ({
    id,
    name: `District ${id}`,
    residentialRentAed: rent,
    averageRoundTripMinutes: minutes,
    representedPopulation: population,
    modeCounts: { car, pt: 0, walk: 0 },
  });
  const chart = buildOption("district-tradeoff", {
    snapshot: { zones: [zone("a", 1000, 20, 100), zone("b", 2000, 40, 400), zone("empty", 1200, 0, 200, 0), zone("missing", null, 30, 200)] },
    selectedZoneId: "b",
  });
  assert.deepEqual(
    chart.option.series[0].data.map((point) => point.zoneId),
    ["a", "b"]
  );
  assert.deepEqual(chart.option.series[0].data[1].value, [2000, 40, 400]);
  assert.equal(chart.option.series[0].data[1].label.show, true);
  assert.equal(chart.option.series[0].symbolSize([1000, 20, 100]), 21);
  assert.equal(chart.option.series[0].symbolSize([2000, 40, 400]), 42);
  assert.match(chart.note, /2 districts lack usable observations/);
  const retained = buildOption("district-tradeoff", {
    snapshot: { ...snapshot({ networkAssignmentDate: "2024-01-31" }), zones: [zone("a", 1000, 20, 100)] },
  });
  assert.match(retained.note, /Travel assignment: 2024-01-31/);
  assert.match(retained.note, /nonworkday snapshot can retain/);
}

// Only actual retained event rows may enter the heatmap. The 30-day detail
// limit applies even when the interface asks for the whole run, and daily
// duplicates are replacement observations rather than additional events.
{
  const row = (zoneId, fromState, toState, representedResidents) => ({ zoneId, fromState, toState, representedResidents });
  const point = (day, rows) => ({ day, transitions: { citizens: rows } });
  const history = [
    point(9, [row("a", "Happy", "Extreme", 999)]),
    point(10, [row("a", "Happy", "Waiting", 999)]),
    point(11, [row("a", "Happy", "Waiting", 100)]),
    point(11, [row("a", "Happy", "Waiting", 250)]),
    point(40, [row("a", "Waiting", "Happy", 500), row("b", "Happy", "Extreme", 750)]),
    point(41, [row("a", "Happy", "Extreme", 999)]),
  ];
  const chart = buildOption("resident-transitions", { snapshot: snapshot({}, 40), history, windowDays: 365, selectedZoneId: "a" });
  const cells = chart.option.series[0].data;
  assert.equal(cells.find(([to, from]) => from === 0 && to === 1)[2], 250);
  assert.equal(cells.find(([to, from]) => from === 1 && to === 0)[2], 500);
  assert.equal(
    cells.reduce((sum, cell) => sum + cell[2], 0),
    750
  );
  assert.match(chart.subtitle, /Days 11–40/);
  assert.match(chart.note, /not unique residents, probabilities or state occupancy/);
  assert.match(chart.note, /Some days have no retained observations/);
  const actualZero = buildOption("resident-transitions", { snapshot: snapshot({}, 40), history: [point(40, [])], windowDays: 1 });
  assert.equal(actualZero.empty, false);
  assert.equal(
    actualZero.option.series[0].data.every((cell) => cell[2] === 0),
    true
  );
  assert.equal(buildOption("resident-transitions", { snapshot: snapshot({}, 40), history: [{ day: 40 }], windowDays: 1 }).empty, true);
  assert.equal(
    buildOption("resident-transitions", { snapshot: snapshot({}, 40), history: [point(40, [row("a", "Happy", "Waiting", null)])], windowDays: 1 })
      .empty,
    true
  );
}

// Labor composition uses all residents. Its job-seeker segment is not the
// unemployment-rate KPI, which uses a different denominator.
{
  const city = { representedPopulation: 1000, representedEmployed: 600, representedUnemployed: 100, representedNonparticipants: 300 };
  const chart = buildOption("labor-composition", { snapshot: snapshot(city) });
  assert.deepEqual(
    chart.option.series.map((series) => valuesOf(series)[0]),
    [60, 10, 30]
  );
  assert.match(chart.note, /unemployment-rate KPI uses labor-force participants/);
  assert.match(chart.option.tooltip.formatter([{ dataIndex: 0, seriesName: "Active job seekers" }]), /10% \(100 \/ 1,000 residents\)/);
  assert.equal(buildOption("labor-composition", { snapshot: snapshot({ ...city, representedNonparticipants: undefined }) }).empty, true);
  assert.equal(buildOption("labor-composition", { snapshot: snapshot({ ...city, representedPopulation: 999 }) }).empty, true);
}

// Outcome panels keep percentages, minutes and money on independent axes.
// Missing denominators and dates do not manufacture comparable differences.
{
  const active = snapshot({
    representedPopulation: 1000,
    representedLaborForce: 700,
    housingCapacityRepresented: 800,
    averageRoundTripMinutes: 40,
    modeCounts: { car: 600, pt: 400, walk: 0 },
    modeShares: { pt: 40 },
    unemploymentRate: 20,
    carOwnershipRate: 60,
    averageResidualAfterEssentialsAed: -500,
    housingOccupancyRate: 125,
    networkAssignmentDate: "2024-02-01",
  });
  const reference = snapshot({
    ...active.city,
    housingCapacityRepresented: 1000,
    averageRoundTripMinutes: 50,
    modeShares: { pt: 30 },
    unemploymentRate: 10,
    carOwnershipRate: 65,
    averageResidualAfterEssentialsAed: 1000,
    housingOccupancyRate: 100,
  });
  const chart = buildOption("outcome-comparison", { snapshot: active, referenceSnapshot: reference, compare: true });
  assert.deepEqual(
    chart.metrics.map((metric) => metric.delta),
    [-10, 10, 10, -5, -1500, 25]
  );
  assert.equal(chart.option.grid.length, 6);
  assert.equal(chart.option.xAxis.length, 6);
  assert.equal(
    chart.option.series.every((series) => series.xAxisIndex === series.yAxisIndex),
    true
  );
  assert.equal(
    new Set(chart.option.series.map((series) => series.id)).size,
    chart.option.series.length,
    "multiple panels have unique ECharts series ids"
  );
  assert.ok(chart.option.xAxis[4].min <= -500 && chart.option.xAxis[4].max >= 1000, "resource axis retains negative budgets");
  assert.ok(chart.option.xAxis[5].max >= 125, "housing occupancy can exceed100%");
  assert.match(chart.option.title[1].subtext, /\+10 pp/);
  assert.match(chart.option.title[4].subtext, /-1,500 AED/);
  assert.match(chart.note, /lengths across panels are not comparable/);
  active.city.representedLaborForce = 0;
  const missingDenominator = buildOption("outcome-comparison", { snapshot: active, referenceSnapshot: reference, compare: true });
  assert.equal(missingDenominator.metrics[2].scenario, null);
  assert.equal(missingDenominator.metrics[2].delta, null);
  reference.city.networkAssignmentDate = "2024-01-31";
  const staleTravel = buildOption("outcome-comparison", { snapshot: active, referenceSnapshot: reference, compare: true });
  assert.equal(staleTravel.metrics[0].reference, null);
  assert.equal(staleTravel.metrics[1].reference, null);
  assert.equal(staleTravel.metrics[3].reference, 65, "unaffected current stocks remain comparable");
  reference.clock.date = "2024-02-02";
  const mismatched = buildOption("outcome-comparison", { snapshot: active, referenceSnapshot: reference, compare: true });
  assert.equal(
    mismatched.metrics.every((metric) => metric.reference === null),
    true
  );
}

// Ranked commute points compare the same district, not array position or a
// within-district distribution inferred from means. Unserved zones are absent.
{
  const zone = (id, minutes, completed = 10) => ({
    id,
    name: `District ${id}`,
    averageRoundTripMinutes: minutes,
    modeCounts: { car: completed, pt: 0, walk: 0 },
  });
  const active = { ...snapshot({ networkAssignmentDate: "2024-02-01" }), zones: [zone("a", 35), zone("b", 70), zone("none", 0, 0)] };
  const reference = { ...snapshot({ networkAssignmentDate: "2024-02-01" }), zones: [zone("b", 60), zone("a", 45)] };
  const chart = buildOption("district-commutes", { snapshot: active, referenceSnapshot: reference, compare: true });
  assert.deepEqual(chart.option.yAxis.data, ["District b", "District a"]);
  assert.deepEqual(
    chart.option.series.find((series) => series.name === "Scenario").data.map((point) => point.value),
    [
      [70, 0],
      [35, 1],
    ]
  );
  assert.deepEqual(
    chart.option.series.find((series) => series.name === "Reference").data.map((point) => point.value),
    [
      [60, 0],
      [45, 1],
    ]
  );
  assert.equal(chart.option.series.find((series) => series.name === "Scenario").data[0].zoneId, "b");
  assert.match(chart.note, /not a distribution of individual travel times/);
  reference.zones[0].averageRoundTripMinutes = null;
  const missing = buildOption("district-commutes", { snapshot: active, referenceSnapshot: reference, compare: true });
  assert.deepEqual(
    missing.option.series.find((series) => series.name === "Reference").data.map((point) => point.value),
    [[45, 1]]
  );
  assert.equal(buildOption("district-commutes", { snapshot: { zones: [zone("none", 0, 0)] } }).empty, true);
}

// Housing uses one district ordering but separate occupancy and rent axes.
// Missing rent is absent; recorded zero occupancy remains a real observation.
{
  const zone = (id, occupancy, rent) => ({
    id,
    name: `District ${id}`,
    housingCapacityRepresented: 1000,
    housingOccupancyRate: occupancy,
    residentialRentAed: rent,
  });
  const active = { ...snapshot({}), zones: [zone("low", 80, 4000), zone("high", 125, 2500), zone("vacant", 0, null)] };
  const reference = { ...snapshot({}), zones: [zone("high", 100, 2000), zone("low", 85, 4500)] };
  const chart = buildOption("district-housing", { snapshot: active, referenceSnapshot: reference, compare: true });
  assert.deepEqual(chart.option.yAxis[0].data, ["District high", "District low", "District vacant"]);
  assert.deepEqual(chart.option.yAxis[1].data, chart.option.yAxis[0].data);
  const occupancy = chart.option.series.find((series) => series.id === "district-housing:occupancy:scenario");
  const rent = chart.option.series.find((series) => series.id === "district-housing:rent:scenario");
  assert.deepEqual(
    occupancy.data.map((point) => point.value),
    [
      [125, 0],
      [80, 1],
      [0, 2],
    ]
  );
  assert.deepEqual(
    rent.data.map((point) => point.value),
    [
      [2500, 0],
      [4000, 1],
    ]
  );
  assert.equal(occupancy.xAxisIndex, 0);
  assert.equal(rent.xAxisIndex, 1);
  assert.ok(chart.option.xAxis[0].max >= 125);
  assert.ok(chart.option.xAxis[1].max >= 4500);
  assert.match(chart.note, /not an observed household market-rent sample/);
  reference.clock.date = "2024-02-02";
  const mismatched = buildOption("district-housing", { snapshot: active, referenceSnapshot: reference, compare: true });
  assert.equal(
    mismatched.option.series.filter((series) => series.name === "Reference").every((series) => series.data.length === 0),
    true
  );
}

// The same module is available without CommonJS in the browser.
// Coverage counts unique physical links and never equates suppressed access
// loads or missing fields with zero assigned demand. Combined car/PT counts once.
{
  const link = (id, car = 0, pt = 0, patch = {}) => ({
    id,
    loadBearing: true,
    loadABVehicles: car,
    loadBAVehicles: 0,
    loadABPassengers: pt,
    loadBAPassengers: 0,
    ...patch,
  });
  const chart = buildOption("network-coverage", {
    snapshot: {
      ...snapshot({ networkAssignmentDate: "2024-02-01" }),
      links: [
        link("car", 10, 20),
        link("transit", 0, 15),
        link("empty"),
        link("access", 0, 0, { loadBearing: false }),
        link("context", 0, 0, { contextOnly: true }),
        link("unknown", 10, 0, { loadABPassengers: null }),
        link("access", 0, 0, { loadBearing: false }),
      ],
    },
  });
  assert.deepEqual(chart.counts, { "assigned-car": 1, "transit-only": 1, unassigned: 1, "capacity-excluded": 1, context: 1, unavailable: 1 });
  assert.equal(chart.totalLinks, 6, "duplicate geometry records do not increase the physical-link count");
  assert.equal(
    Object.values(chart.counts).reduce((sum, value) => sum + value, 0),
    6
  );
  assert.match(chart.note, /Capacity-excluded links are separate from links with no assigned demand/);
  assert.match(chart.note, /Missing directional loads are unavailable, not zero/);
  assert.match(chart.subtitle, /assignment 2024-02-01/);
  const missingLoads = buildOption("network-coverage", { snapshot: { links: [{ id: "unknown" }] } });
  assert.equal(missingLoads.counts.unavailable, 1);
  assert.equal(missingLoads.counts.unassigned, 0);
  const completeRoads = buildOption("network-coverage", { snapshot: { links: [link("loaded", 10), link("empty")] } });
  assert.equal(completeRoads.option.yAxis.data.length, 3, "absent legacy exclusions/context do not clutter the current road view");
  assert.equal(completeRoads.counts["capacity-excluded"], 0);
  assert.match(completeRoads.note, /Every physical road/);
  assert.equal(buildOption("network-coverage", { snapshot: { links: [] } }).empty, true);
}

// Selected-district dashboards retain actual history, never reconstruct a
// missing resident employment count from rounded rates, and compare exact dates.
{
  const zone = (id, patch = {}) => ({
    id,
    name: `District ${id}`,
    representedPopulation: 1000,
    housingCapacityRepresented: 1200,
    residentialRentAed: 2000,
    representedEmployed: 600,
    jobs: 800,
    enterprises: 4,
    stateCounts: { Happy: 400, Waiting: 300, Extreme: 200, Recovery: 100 },
    enterpriseStateCounts: { Working: 1, Grow: 2, Lesser: 1, Starting: 0 },
    modeCounts: { car: 100, pt: 200, walk: 200, unserved: 50, none: 50 },
    ...patch,
  });
  const point = (day, date, fields) => ({
    day,
    date,
    zoneSeries: [
      { id: "a", ...fields },
      { id: "b", population: 9999, residentialRentAed: 9999 },
    ],
  });
  const active = { clock: { day: 40, date: "2024-02-10" }, city: { networkAssignmentDate: "2024-02-09" }, zones: [zone("a"), zone("b")] };
  const reference = { ...active, zones: [zone("b"), zone("a", { representedPopulation: 1100, representedEmployed: 650 })] };
  const context = {
    snapshot: active,
    referenceSnapshot: reference,
    selectedZoneId: "a",
    compare: true,
    historyWindowDays: 30,
    history: [
      point(10, "2024-01-11", { population: 700, housingCapacity: 900 }),
      point(11, "2024-01-12", { population: 800, housingCapacity: 1000, residentialRentAed: 1800, jobs: 500, employmentRate: 0.621 }),
      point(12, "2024-01-13", { population: 820, housingCapacity: 1000, residentialRentAed: 1800, jobs: 520, representedEmployed: 510 }),
      point(12, "2024-01-13", { population: 850, housingCapacity: 1000, residentialRentAed: 1800, jobs: 550, representedEmployed: 530 }),
      point(13, "2024-01-14", { population: null, housingCapacity: 1000, residentialRentAed: null, jobs: 600 }),
      point(41, "2024-02-11", { population: 9999, housingCapacity: 9999 }),
    ],
    referenceHistory: [
      point(11, "2024-01-12", { population: 810, housingCapacity: 1100, representedEmployed: 505, jobs: 530 }),
      point(12, "2024-01-14", { population: 999, housingCapacity: 1100 }),
      point(14, "2024-01-15", { population: 888, housingCapacity: 1100 }),
    ],
  };
  const before = JSON.stringify(context);
  const population = buildOption("district-population-history", context);
  assert.equal(population.timeline, true);
  assert.equal(population.scope, "district");
  assert.deepEqual(
    population.option.series[0].data.map((row) => row[1]),
    [800, 850, null, 1000]
  );
  assert.deepEqual(
    population.option.series[1].data.map((row) => row[1]),
    [810, null, null, 1100],
    "reference joins both day and date, never array position"
  );
  assert.match(population.subtitle, /2024-01-12–2024-02-10/);
  assert.match(population.summary, /4 recorded dates, 2024-01-12 to 2024-02-10/);
  assert.equal(population.option.xAxis.type, "time", "uneven recorded dates retain their real temporal spacing");
  const employment = buildOption("district-employment-history", context);
  assert.deepEqual(
    employment.option.series.find((series) => series.name === "Employed residents").data.map((row) => row[1]),
    [null, 530, null, 600]
  );
  assert.deepEqual(
    employment.option.series.find((series) => series.name === "Jobs in district").data.map((row) => row[1]),
    [500, 550, 600, 800]
  );
  assert.match(employment.note, /not reconstructed from rounded rates/);
  const rent = buildOption("district-rent-history", context);
  assert.equal(rent.option.series[0].step, "end");
  assert.deepEqual(
    rent.option.series[0].data.map((row) => row[1]),
    [1800, 1800, null, 2000]
  );
  assert.equal(buildOption("district-population-history", { ...context, compare: false }).option.series.length, 2);
  const wholeRun = buildOption("district-population-history", { ...context, historyWindowDays: 0 });
  assert.equal(wholeRun.option.series[0].data.length, 5);
  assert.equal(buildOption("district-population-history", { ...context, selectedZoneId: "absent" }).empty, true);
  assert.equal(buildOption("district-population-history", { ...context, selectedZoneId: "city" }).empty, true);
  const initialOnly = buildOption("district-employment-history", { snapshot: active, selectedZoneId: "a", compare: true });
  assert.equal(initialOnly.option.series[0].data.length, 1, "opening snapshot is one observation, not a synthetic history");
  assert.match(initialOnly.note, /No matching district reference history/);
  assert.equal(JSON.stringify(context), before, "builders do not mutate snapshots or retained histories");

  const states = buildOption("district-resident-states", { ...context, compare: false });
  assert.deepEqual(
    states.option.series.map((series) => valuesOf(series)[0]),
    [40, 30, 20, 10]
  );
  const firms = buildOption("district-enterprise-states", { ...context, compare: false });
  assert.deepEqual(
    firms.option.series.map((series) => valuesOf(series)[0]),
    [25, 50, 25, 0]
  );
  assert.match(firms.note, /not observed establishments or represented workers/);
  const modes = buildOption("district-travel-modes", { ...context, compare: false });
  assert.ok(Math.abs(valuesOf(modes.option.series[0])[0] - (100 / 600) * 100) < 1e-10);
  assert.ok(Math.abs(modes.option.series.reduce((sum, series) => sum + valuesOf(series)[0], 0) - 100) < 1e-10);
  assert.match(modes.subtitle, /600 represented employed residents/);
  assert.match(modes.note, /job seekers and nonparticipants are excluded/);
  assert.match(modes.option.tooltip.formatter([{ dataIndex: 0, seriesName: "Car" }]), /100 \/ 600 represented employed residents/);
  assert.equal(
    buildOption("district-resident-states", { ...context, snapshot: { ...active, zones: [zone("a", { representedPopulation: 999 })] } }).empty,
    true
  );
  assert.equal(
    buildOption("district-enterprise-states", { ...context, snapshot: { ...active, zones: [zone("a", { enterpriseStateCounts: { Working: 4 } })] } })
      .empty,
    true
  );
  assert.equal(
    buildOption("district-travel-modes", { ...context, snapshot: { ...active, zones: [zone("a", { representedEmployed: 999 })] } }).empty,
    true
  );

  const od = (workZoneId, workers, minutes, modeCounts = { car: workers, pt: 0, walk: 0 }) => ({
    homeZoneId: "a",
    workZoneId,
    representedWorkers: workers,
    averageRoundTripMinutes: minutes,
    modeCounts,
  });
  active.commuteOd = [od("a", 200, 10), od("b", 400, 60), od(null, 0, 0), { ...od("a", 9000, 99), homeZoneId: "b" }];
  reference.zones.push(zone("c"));
  reference.commuteOd = [od("c", 50, 90), od("a", 600, 20)];
  const destinations = buildOption("district-work-destinations", context);
  assert.deepEqual(destinations.option.yAxis.data, ["District b", "District a (same district)", "District c"]);
  assert.deepEqual(
    destinations.option.series[0].data.map((entry) => entry.value),
    [400, 200, 0]
  );
  assert.deepEqual(
    destinations.option.series[1].data.map((entry) => entry.value),
    [0, 600, 50]
  );
  assert.match(destinations.note, /not daily trips, moves or migration/);
  const commutes = buildOption("district-commute-destinations", context);
  assert.deepEqual(
    commutes.option.series[0].data.map((entry) => entry.value),
    [60, 10, null]
  );
  assert.deepEqual(
    commutes.option.series[1].data.map((entry) => entry.value),
    [null, 20, 90]
  );
  assert.match(commutes.note, /not a distribution of individual commute times/);
  for (const id of ["district-work-destinations", "district-commute-destinations"]) {
    const hiddenReference = buildOption(id, { ...context, compare: false });
    assert.doesNotMatch(hiddenReference.summary, /reference/i, "hidden comparison is omitted from district accessibility summaries");
    assert.match(hiddenReference.summary, /scenario/);
    const missingReference = buildOption(id, { ...context, referenceSnapshot: null, compare: true });
    assert.match(missingReference.summary, /reference unavailable/, "requested but missing comparison remains explicit");
    const availableReference = buildOption(id, context);
    assert.match(availableReference.summary, /reference [0-9]/, "available comparison values remain accessible");
  }
  active.commuteOd[1].modeCounts = { car: 0, pt: 0, walk: 0, unserved: 400 };
  assert.equal(
    buildOption("district-commute-destinations", { ...context, compare: false }).option.yAxis.data.length,
    1,
    "unserved rows cannot become zero-minute commuters"
  );
  assert.equal(
    buildOption("district-work-destinations", { ...context, snapshot: { ...active, commuteOd: [od("a", 200, 10)] } }).empty,
    true,
    "partial OD records cannot establish destination zeros"
  );
  reference.clock = { day: 41, date: "2024-02-11" };
  assert.equal(buildOption("district-work-destinations", context).option.series.length, 1, "current stock reference must be at the same date");
  reference.clock = { ...active.clock };
  reference.city = { networkAssignmentDate: "2024-02-08" };
  assert.equal(buildOption("district-commute-destinations", context).option.series.length, 1);
  assert.match(buildOption("district-travel-modes", context).note, /assignment dates differ/);
}

// Exercise the real controller cache: equal percentages with changed counts
// must replace the tooltip closure for city and district observations alike.
{
  const appSource = fs.readFileSync(new URL("../assets/js/udes-v2-app.js", import.meta.url), "utf8");
  const signatureStart = appSource.indexOf("  function chartDataSignature(");
  const cacheEnd = appSource.indexOf("  function bindChartInteraction(", signatureStart);
  assert.ok(signatureStart >= 0 && cacheEnd > signatureStart);
  const factories = [
    (scale) =>
      buildOption("commute-distribution", {
        snapshot: distribution("commute", scale * 40, [bin("Under 20", 0, 20, scale * 20), bin("20+", 20, null, scale * 20)]),
      }),
    (scale) =>
      buildOption("labor-composition", {
        snapshot: snapshot({
          representedPopulation: scale * 100,
          representedEmployed: scale * 60,
          representedUnemployed: scale * 10,
          representedNonparticipants: scale * 30,
        }),
      }),
    (scale) =>
      buildOption("district-resident-states", {
        selectedZoneId: "a",
        snapshot: {
          ...snapshot({}),
          zones: [
            {
              id: "a",
              representedPopulation: scale * 100,
              stateCounts: { Happy: scale * 40, Waiting: scale * 30, Extreme: scale * 20, Recovery: scale * 10 },
            },
          ],
        },
      }),
  ];
  for (const factory of factories) {
    const cache = { state: { chartDataSignatures: new Map(), chartStructureKeys: new Map() } };
    vm.runInNewContext(`${appSource.slice(signatureStart, cacheEnd)}; globalThis.apply = applyChartOption;`, cache);
    const received = [];
    const chart = { isDisposed: () => false, setOption: (option) => received.push(option) };
    const first = factory(1);
    const second = factory(2);
    assert.deepEqual(second.option.series.map(valuesOf), first.option.series.map(valuesOf), "the plotted shares genuinely remain identical");
    cache.apply(chart, first.id, first.option);
    cache.apply(chart, second.id, second.option);
    assert.equal(received.length, 2, `${first.id} refreshes cached absolute counts despite unchanged shares`);
    const series = received[1].series[0];
    assert.equal(series.data[0].populationTotal, first.option.series[0].data[0].populationTotal * 2);
    const tooltip = received[1].tooltip.formatter([{ dataIndex: 0, seriesName: series.name }]);
    assert.ok(tooltip.includes(formatExpected(series.data[0].observedCount)), "the refreshed tooltip reports the current absolute count");
  }
  function formatExpected(value) {
    return new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(value);
  }
}

// The same module is available without CommonJS in the browser.
const browser = {};
vm.runInNewContext(fs.readFileSync(new URL("../assets/js/udes-v2-analysis.js", import.meta.url), "utf8"), browser);
assert.equal(browser.UdesV2Analysis.CATALOG.length, 19);
assert.equal(CATALOG.filter((entry) => entry.scope === "district").length, 8);
assert.equal(typeof browser.UdesV2Analysis.buildOption, "function");
assert.equal(CATALOG.find((entry) => entry.id === "commute-distribution").group, "Transport");
assert.equal(CATALOG.find((entry) => entry.id === "enterprise-size").group, "Firms");
assert.throws(() => buildOption("not-a-chart"), /Unknown analysis chart/);
console.log("UDES v2 analysis distributions, stock accounting, district comparisons and retained transition metrics passed.");
