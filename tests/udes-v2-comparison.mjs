import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { comparisonToCsv, COMPARISON_METRICS } = require("../assets/js/udes-v2-app.js");
const parse = (csv) => csv.split("\n").map((line) => [...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map((match) => match[1].replaceAll('""', '"')));
const active = [
  { day: 0, date: "2024-01-01", scenario: "reference", meanCommute: 40, ptShare: 0.25, jobs: 12 },
  { day: 1, date: "2024-01-02", scenario: "transit", meanCommute: 31, ptShare: 0.45, intervention: 'Bus, "priority"', jobs: 14 },
  { day: 2, date: "2024-01-03", meanCommute: 29, ptShare: 0.5 },
];
// Different order and missing days must never produce a false paired comparison.
const reference = [
  { day: 1, meanCommute: 42, ptShare: 0.3, jobs: 13 },
  { day: 0, meanCommute: 40, ptShare: 0.25, jobs: 12 },
];
const [headers, ...rows] = parse(comparisonToCsv(active, reference, { seed: 123 }));
const read = (row, column) => row[headers.indexOf(column)];
assert.equal(rows.length, active.length);
assert.equal(headers.length, 5 + Object.keys(COMPARISON_METRICS).length * 3);
assert.equal(read(rows[0], "delta_round_trip_commute_minutes"), "0");
assert.equal(read(rows[1], "delta_round_trip_commute_minutes"), "-11");
assert.equal(read(rows[1], "delta_represented_filled_jobs"), "1");
assert.equal(read(rows[1], "intervention"), 'Bus, "priority"');
assert.equal(read(rows[1], "active_transit_share_fraction"), "0.45");
assert.equal(read(rows[2], "reference_round_trip_commute_minutes"), "");
assert.equal(read(rows[2], "delta_round_trip_commute_minutes"), "");
assert.equal(read(rows[2], "active_represented_filled_jobs"), "");
assert.equal(read(rows[2], "seed"), "123");
console.log("Comparison export checks passed: paired days, explicit units, missing data, and CSV escaping.");
