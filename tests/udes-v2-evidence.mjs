import assert from "node:assert/strict";
import crypto from "node:crypto";
import { mkdtempSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pairedDifference, summarizePairedDifferences, summarizeReplications } from "../scripts/udes-v2-experiment-statistics.mjs";
import { controllerModelInputs, finalizeSourceProvenance, hashSources } from "../scripts/udes-v2-source-provenance.mjs";

const close = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-12, message);

// [-2, 0, 2] has mean 0 and sum of squared deviations 8. Its sample
// variance is 8/(3-1) = 4, rather than the population variance 8/3.
assert.deepEqual(summarizeReplications([-2, 0, 2]), {
  count: 3,
  mean: 0,
  minimum: -2,
  maximum: 2,
  sampleStandardDeviation: 2,
  positiveCount: 1,
  zeroCount: 1,
  negativeCount: 1,
});
const singleton = summarizeReplications([-7]);
assert.equal(singleton.mean, -7);
assert.equal(singleton.sampleStandardDeviation, null, "one run cannot estimate between-run variation");
assert.equal(summarizeReplications([4, 4, 4]).sampleStandardDeviation, 0);
close(summarizeReplications([1, 2, 3, 4, 5]).sampleStandardDeviation, Math.sqrt(2.5), "sample SD uses n-1");
const nearZero = summarizeReplications([-2e-9, -1e-9, 0, 1e-9, 2e-9]);
assert.deepEqual(
  [nearZero.negativeCount, nearZero.zeroCount, nearZero.positiveCount],
  [1, 3, 1],
  "tiny numeric noise has an explicit zero tolerance"
);
for (const invalid of [undefined, null, {}, [], [NaN], [Infinity], [-Infinity], [1, undefined], [1, null], [1, "2"]]) {
  assert.throws(
    () => summarizeReplications(invalid),
    /finite observation|invalid runs/,
    "failed or missing replications must not be silently omitted"
  );
}

const before = Object.freeze({ commute: 40, jobs: 100, unrelated: 9 });
const after = Object.freeze({ commute: 30, jobs: 125, unrelated: 2 });
assert.deepEqual(
  pairedDifference(before, after, ["commute", "jobs"]),
  { commute: -10, jobs: 25 },
  "differences are intervention minus same-seed reference"
);
for (const invalid of [undefined, null, NaN, Infinity, -Infinity, "30"]) {
  assert.throws(() => pairedDifference({ commute: 40 }, { commute: invalid }, ["commute"]), /Invalid paired metric: commute/);
  assert.throws(() => pairedDifference({ commute: invalid }, { commute: 30 }, ["commute"]), /Invalid paired metric: commute/);
}
assert.throws(() => pairedDifference({ jobs: 100 }, { jobs: 125 }, ["commute"]), /Invalid paired metric: commute/);

const pairs = [
  { seed: 23, delta: pairedDifference({ commute: 10, jobs: 20 }, { commute: 8, jobs: 30 }, ["commute", "jobs"]) },
  { seed: 7, delta: pairedDifference({ commute: 30, jobs: 40 }, { commute: 30, jobs: 50 }, ["commute", "jobs"]) },
  { seed: 91, delta: pairedDifference({ commute: 50, jobs: 60 }, { commute: 52, jobs: 70 }, ["commute", "jobs"]) },
];
const paired = summarizePairedDifferences(pairs, ["commute", "jobs"]);
assert.deepEqual(paired.commute, summarizeReplications([-2, 0, 2]), "pairing preserves reversals even when average effect is zero");
assert.equal(paired.jobs.mean, 10);
assert.equal(paired.jobs.sampleStandardDeviation, 0);
assert.equal(paired.jobs.positiveCount, 3);
assert.deepEqual(summarizePairedDifferences([...pairs].reverse(), ["commute", "jobs"]), paired, "replication ordering has no statistical meaning");
assert.throws(() => summarizePairedDifferences([pairs[0], pairs[0]], ["commute"]), /seeds must be unique/);
assert.throws(() => summarizePairedDifferences([], ["commute"]), /finite observation/);
assert.throws(() => summarizePairedDifferences([...pairs, { seed: 123, delta: {} }], ["commute"]), /invalid runs/);
assert.throws(() => summarizePairedDifferences([...pairs, { seed: 123, delta: { commute: NaN } }], ["commute"]), /invalid runs/);

// Small controller fixtures expose the same input surface as the headless
// experiment. A closure can alter calendar results without changing toString().
function makeController(offsetDays = 0) {
  return {
    PUBLIC_PRESETS: { reference: { dailyJobSearchProbability: 0.04 }, transit: { transitWaitMin: 4 } },
    parseUtcDate(value) {
      return new Date(value + "T00:00:00Z");
    },
    addUtcCalendarMonths(date, months) {
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()));
    },
    utcDayDifference(start, end) {
      return Math.round((end - start) / 86400000);
    },
    horizonEndDayFrom(start, months) {
      return this.utcDayDifference(start, this.addUtcCalendarMonths(start, months)) + offsetDays;
    },
  };
}
const initialInputs = controllerModelInputs(makeController(), "2024-01-01", [1, 12, 120]);
assert.deepEqual(initialInputs.calendarQueries, [
  { startDate: "2024-01-01", months: 1, days: 31 },
  { startDate: "2024-01-01", months: 12, days: 366 },
  { startDate: "2024-01-01", months: 120, days: 3653 },
]);
assert.deepEqual(Object.keys(initialInputs.calendarFunctions), ["parseUtcDate", "addUtcCalendarMonths", "utcDayDifference", "horizonEndDayFrom"]);
const changedQueryInputs = controllerModelInputs(makeController(1), "2024-01-01", [1, 12, 120]);
assert.deepEqual(changedQueryInputs.calendarFunctions, initialInputs.calendarFunctions);
assert.equal(changedQueryInputs.calendarQueries[1].days, 367);

const directory = mkdtempSync(join(tmpdir(), "udes-v2-evidence-"));
const paths = Object.fromEntries(
  ["engineSha256", "baselineSha256", "publicControllerSha256", "validationHarnessSha256", "sourceProvenanceSha256"].map((key) => [
    key,
    join(directory, key + ".txt"),
  ])
);
try {
  for (const [name, path] of Object.entries(paths)) writeFileSync(path, name + " original bytes · أبو ظبي\n");
  const initialHashes = hashSources(paths);
  assert.equal(Object.keys(initialHashes).length, Object.keys(paths).length);
  for (const [name, path] of Object.entries(paths)) {
    assert.equal(initialHashes[name], crypto.createHash("sha256").update(readFileSync(path)).digest("hex"));
  }
  const unchanged = finalizeSourceProvenance(paths, initialHashes, initialInputs, structuredClone(initialInputs));
  assert.equal(unchanged.controllerCompatibility.status, "identical-simulation-inputs");
  assert.equal(unchanged.controllerCompatibility.controllerChangedDuringRun, false);
  assert.deepEqual(unchanged.sourceHashes, initialHashes);
  assert.deepEqual(unchanged.controllerCompatibility.checkedCalendarQueries, initialInputs.calendarQueries);

  // A chart-only edit changes the delivered controller identity, but preserves
  // the simulation inputs. Both file versions must remain identifiable.
  writeFileSync(paths.publicControllerSha256, "changed chart labels; same simulation exports\n");
  const presentation = finalizeSourceProvenance(paths, initialHashes, initialInputs, structuredClone(initialInputs));
  assert.equal(presentation.controllerCompatibility.controllerChangedDuringRun, true);
  assert.equal(presentation.executionSourceHashesAtStart.publicControllerSha256, initialHashes.publicControllerSha256);
  assert.notEqual(presentation.sourceHashes.publicControllerSha256, initialHashes.publicControllerSha256);
  assert.equal(presentation.sourceHashes.publicControllerSha256, hashSources(paths).publicControllerSha256);
  assert.equal(presentation.controllerCompatibility.simulationInputSha256, unchanged.controllerCompatibility.simulationInputSha256);

  const changedPreset = makeController();
  changedPreset.PUBLIC_PRESETS.reference.dailyJobSearchProbability = 0.08;
  assert.throws(
    () => finalizeSourceProvenance(paths, initialHashes, initialInputs, controllerModelInputs(changedPreset, "2024-01-01", [1, 12, 120])),
    /controller model exports/
  );
  assert.throws(
    () => finalizeSourceProvenance(paths, initialHashes, initialInputs, changedQueryInputs),
    /controller model exports/,
    "evaluated horizons catch behavior changes hidden behind identical function text"
  );
  const changedFunction = makeController();
  changedFunction.parseUtcDate = function parseUtcDate(value) {
    return new Date(value + "T00:00:00.000Z");
  };
  const changedFunctionInputs = controllerModelInputs(changedFunction, "2024-01-01", [1, 12, 120]);
  assert.deepEqual(changedFunctionInputs.calendarQueries, initialInputs.calendarQueries);
  assert.throws(
    () => finalizeSourceProvenance(paths, initialHashes, initialInputs, changedFunctionInputs),
    /controller model exports/,
    "consumed calendar definitions are immutable even if these example horizons happen to agree"
  );

  for (const name of Object.keys(paths).filter((key) => key !== "publicControllerSha256")) {
    const original = readFileSync(paths[name]);
    writeFileSync(paths[name], "changed model or validation source\n");
    assert.throws(
      () => finalizeSourceProvenance(paths, initialHashes, initialInputs, structuredClone(initialInputs)),
      new RegExp(name),
      name + " changes must reject the report"
    );
    writeFileSync(paths[name], original);
  }
  assert.equal(
    finalizeSourceProvenance(paths, initialHashes, initialInputs, structuredClone(initialInputs)).controllerCompatibility.status,
    "identical-simulation-inputs"
  );
} finally {
  // Only the exact files created above are removed; no recursive path deletion.
  for (const path of Object.values(paths)) unlinkSync(path);
  rmdirSync(directory);
}

console.log(
  "Evidence helper checks passed: signed paired differences, sample SD, invalid-run rejection, immutable model inputs, and auditable presentation-only compatibility."
);
