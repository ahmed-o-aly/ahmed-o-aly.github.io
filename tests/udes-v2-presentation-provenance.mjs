import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { controllerModelInputs } from "../scripts/udes-v2-source-provenance.mjs";
import {
  assertCurrentPresentationProvenance,
  commitPreparedUpdates,
  executionReportContentHash,
  preparePresentationUpdate,
  readControllerExports,
  sha256,
} from "../scripts/refresh-udes-v2-presentation-provenance.mjs";

const source = Buffer.from(`
const DAY_MS = 86400000;
function parseUtcDate(value) { return value instanceof Date ? new Date(value.getTime()) : new Date(value + "T00:00:00Z"); }
function addUtcCalendarMonths(value, months) { const date = parseUtcDate(value); date.setUTCMonth(date.getUTCMonth() + months); return date; }
function utcDayDifference(first, last) { return Math.round((parseUtcDate(last) - parseUtcDate(first)) / DAY_MS); }
function horizonEndDayFrom(value, months) { return utcDayDifference(value, addUtcCalendarMonths(value, months)); }
module.exports = { PUBLIC_PRESETS: { reference: { dailyJobSearchProbability: 0.04 }, transit: { transitWaitMin: 4 } }, parseUtcDate, addUtcCalendarMonths, utcDayDifference, horizonEndDayFrom };
`);
const presentation = Buffer.concat([source, Buffer.from("\n// Different charts; identical simulation exports.\n")]);
const verifierHash = sha256("verified presentation-check implementation");
const controller = readControllerExports(source, "fixture.cjs");
const queries = controllerModelInputs(controller, "2024-01-01", [12, 120]);
assert.deepEqual(
  queries.calendarQueries.map((query) => query.days),
  [366, 3653],
  "Date inputs must retain their identity across the VM boundary"
);

const hashes = {
  engineSha256: sha256("engine"),
  baselineSha256: sha256("baseline"),
  publicControllerSha256: sha256(source),
  validationHarnessSha256: sha256("harness"),
  evidenceSummarySha256: sha256("evidence"),
  sourceProvenanceSha256: sha256("provenance"),
};
const report = {
  generatedAt: "2026-09-11T16:31:32.006Z",
  status: "passed-structural-checks",
  empiricalValidation: { status: "not-performed" },
  sourceHashes: hashes,
  executionSourceHashesAtStart: { ...hashes },
  controllerCompatibility: {
    status: "identical-simulation-inputs",
    simulationInputSha256: sha256(JSON.stringify(queries)),
    controllerChangedDuringRun: false,
    checkedExports: ["PUBLIC_PRESETS", "parseUtcDate", "addUtcCalendarMonths", "utcDayDifference", "horizonEndDayFrom"],
    checkedCalendarQueries: queries.calendarQueries,
    interpretation: "Original during-run observation.",
  },
  scenarios: [{ id: "original-scenario", seed: 240124, resultDigestSha256: sha256("actual result"), metrics: { employment: 61.0 } }],
};
const encode = (value) => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const originalBytes = encode(report);
const currentHashes = { ...hashes, publicControllerSha256: sha256(presentation) };
const options = {
  reportBytes: originalBytes,
  currentHashes,
  executionControllerBytes: source,
  currentControllerBytes: presentation,
  checkedAt: "2026-09-12T01:00:00.000Z",
  verifierSha256: verifierHash,
};
const prepared = preparePresentationUpdate(options);
assert.equal(prepared.changed, true);
assert.deepEqual(prepared.report.sourceHashes, report.sourceHashes);
assert.deepEqual(prepared.report.executionSourceHashesAtStart, report.executionSourceHashesAtStart);
assert.deepEqual(prepared.report.controllerCompatibility, report.controllerCompatibility);
assert.deepEqual(prepared.report.scenarios, report.scenarios);
assert.equal(prepared.report.generatedAt, report.generatedAt);
assert.equal(prepared.report.empiricalValidation.status, "not-performed");
assert.equal(executionReportContentHash(prepared.report), executionReportContentHash(report));
assert.equal(prepared.report.presentationCompatibilityChecks[0].simulationRerun, false);
assert.equal(prepared.report.presentationCompatibilityChecks[0].checkKind, "after-run-presentation-update");
assert.equal(prepared.report.presentationCompatibilityChecks[0].priorReportSha256, sha256(originalBytes));
assert.deepEqual(encode(report), originalBytes, "Preparing metadata must not mutate the input report");
assertCurrentPresentationProvenance(prepared.report, currentHashes, readControllerExports(presentation, "current.cjs"), verifierHash);
assert.throws(() => assertCurrentPresentationProvenance(report, currentHashes, controller, verifierHash), /lacks an after-run/);
assert.throws(() => assertCurrentPresentationProvenance(prepared.report, currentHashes, controller, sha256("modified verifier")), /verifier source/);

const repeat = preparePresentationUpdate({ ...options, reportBytes: prepared.bytes, checkedAt: "2026-09-12T02:00:00.000Z" });
assert.equal(repeat.changed, false, "An identical presentation check should not append duplicate timestamps");
assert.deepEqual(repeat.bytes, prepared.bytes);
const noChange = preparePresentationUpdate({ ...options, currentHashes: hashes, currentControllerBytes: source });
assert.equal(noChange.changed, false);
assert.deepEqual(noChange.bytes, originalBytes);

for (const key of Object.keys(hashes).filter((name) => name !== "publicControllerSha256")) {
  assert.throws(() => preparePresentationUpdate({ ...options, currentHashes: { ...currentHashes, [key]: sha256("changed") } }), new RegExp(key));
}
const absentDependency = { ...currentHashes };
delete absentDependency.evidenceSummarySha256;
assert.throws(() => preparePresentationUpdate({ ...options, currentHashes: absentDependency }), /dependency keys/);
assert.throws(() => preparePresentationUpdate({ ...options, executionControllerBytes: presentation }), /Saved execution controller/);
assert.throws(() => preparePresentationUpdate({ ...options, currentControllerBytes: source }), /captured source hash/);
assert.throws(() => preparePresentationUpdate({ ...options, checkedAt: "2025-01-01T00:00:00Z" }), /predates/);

for (const changedSource of [
  Buffer.from(source.toString().replace("0.04", "0.08")),
  Buffer.from(source.toString().replace("Math.round(", "Math.floor(")),
  Buffer.from(source.toString().replace("getUTCMonth() + months", "getUTCMonth() + months + 1")),
]) {
  assert.throws(
    () =>
      preparePresentationUpdate({
        ...options,
        currentControllerBytes: changedSource,
        currentHashes: { ...currentHashes, publicControllerSha256: sha256(changedSource) },
      }),
    /Consumed/
  );
}
const changedOutcome = structuredClone(prepared.report);
changedOutcome.scenarios[0].metrics.employment = 70;
assert.throws(() => preparePresentationUpdate({ ...options, reportBytes: encode(changedOutcome) }), /Execution report content changed/);
const changedDuringRun = structuredClone(report);
changedDuringRun.executionSourceHashesAtStart.engineSha256 = sha256("another execution");
assert.throws(() => preparePresentationUpdate({ ...options, reportBytes: encode(changedDuringRun) }), /during the original execution/);
const incorrectOldSignature = structuredClone(report);
incorrectOldSignature.controllerCompatibility.simulationInputSha256 = sha256("not the original inputs");
assert.throws(() => preparePresentationUpdate({ ...options, reportBytes: encode(incorrectOldSignature) }), /Consumed controller model inputs/);

// The uncertainty report has another harness, an additional immutable
// statistics dependency, and only its one-year calendar query.
const uncertainty = structuredClone(report);
const uncertaintyHashes = { ...hashes, experimentHarnessSha256: sha256("uncertainty harness"), statisticsSha256: sha256("statistics") };
delete uncertaintyHashes.validationHarnessSha256;
uncertainty.sourceHashes = uncertaintyHashes;
uncertainty.executionSourceHashesAtStart = { ...uncertaintyHashes };
const uncertaintyInputs = controllerModelInputs(controller, "2024-01-01", [12]);
uncertainty.controllerCompatibility.checkedCalendarQueries = uncertaintyInputs.calendarQueries;
uncertainty.controllerCompatibility.simulationInputSha256 = sha256(JSON.stringify(uncertaintyInputs));
const uncertaintyCurrent = { ...uncertaintyHashes, publicControllerSha256: sha256(presentation) };
const uncertaintyPrepared = preparePresentationUpdate({ ...options, reportBytes: encode(uncertainty), currentHashes: uncertaintyCurrent });
assert.equal(
  uncertaintyPrepared.report.presentationCompatibilityChecks[0].immutableSourceHashes.statisticsSha256,
  uncertaintyHashes.statisticsSha256
);
assert.equal(uncertaintyPrepared.report.presentationCompatibilityChecks[0].checkedCalendarQueries.length, 1);
assert.throws(
  () =>
    preparePresentationUpdate({
      ...options,
      reportBytes: encode(uncertainty),
      currentHashes: { ...uncertaintyCurrent, statisticsSha256: sha256("changed statistics") },
    }),
  /statisticsSha256/
);

// An original run may itself have accepted a presentation edit during
// execution. That history must not be reinterpreted as this later check.
const duringRunEdit = structuredClone(report);
duringRunEdit.executionSourceHashesAtStart.publicControllerSha256 = sha256("original run-start controller");
duringRunEdit.controllerCompatibility.controllerChangedDuringRun = true;
const afterDuringRunEdit = preparePresentationUpdate({ ...options, reportBytes: encode(duringRunEdit) });
assert.deepEqual(afterDuringRunEdit.report.executionSourceHashesAtStart, duringRunEdit.executionSourceHashesAtStart);
assert.deepEqual(afterDuringRunEdit.report.controllerCompatibility, duringRunEdit.controllerCompatibility);

// A later presentation appends evidence without replacing the original run or
// the earlier check, and can still be compared with the original controller.
const presentation2 = Buffer.concat([presentation, Buffer.from("// Another chart label.\n")]);
const appended = preparePresentationUpdate({
  ...options,
  reportBytes: prepared.bytes,
  currentControllerBytes: presentation2,
  currentHashes: { ...currentHashes, publicControllerSha256: sha256(presentation2) },
  checkedAt: "2026-09-12T02:00:00.000Z",
});
assert.equal(appended.report.presentationCompatibilityChecks.length, 2);
assert.deepEqual(appended.report.presentationCompatibilityChecks[0], prepared.report.presentationCompatibilityChecks[0]);
assert.equal(appended.report.generatedAt, report.generatedAt);

const directory = fs.mkdtempSync(path.join(os.tmpdir(), "udes-presentation-provenance-"));
const first = path.join(directory, "first.json");
const second = path.join(directory, "second.json");
const updates = [first, second].map((target) => ({ path: target, before: originalBytes, bytes: prepared.bytes, changed: true }));
try {
  for (const file of [first, second]) fs.writeFileSync(file, originalBytes);
  assert.throws(
    () =>
      commitPreparedUpdates(updates, () => {
        throw new Error("source changed before write");
      }),
    /source changed/
  );
  assert.deepEqual(fs.readFileSync(first), originalBytes);
  assert.deepEqual(fs.readFileSync(second), originalBytes);
  const failingIo = {
    ...fs,
    renameSync(from, to) {
      if (to === second && from.endsWith(".tmp")) throw new Error("injected second report write failure");
      return fs.renameSync(from, to);
    },
  };
  assert.throws(() => commitPreparedUpdates(updates, () => {}, failingIo), /injected second report/);
  assert.deepEqual(fs.readFileSync(first), originalBytes, "First report must be restored when replacing the second fails");
  assert.deepEqual(fs.readFileSync(second), originalBytes);
  assert.deepEqual(fs.readdirSync(directory).sort(), ["first.json", "second.json"]);
  commitPreparedUpdates(updates, () => {});
  for (const file of [first, second]) assert.deepEqual(fs.readFileSync(file), prepared.bytes);
  assert.deepEqual(fs.readdirSync(directory).sort(), ["first.json", "second.json"]);
} finally {
  // Delete only the two exact fixture files; no recursive directory operation.
  for (const file of [first, second]) if (fs.existsSync(file)) fs.unlinkSync(file);
  fs.rmdirSync(directory);
}

console.log(
  "Presentation provenance checks passed: preserved execution identity, immutable-source and model-input rejection, append-only checks, idempotence, and two-report rollback."
);
