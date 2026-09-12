import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { controllerModelInputs, hashSources } from "./udes-v2-source-provenance.mjs";

const SELF = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(SELF), "..");
export const VERIFIER_PATH = "scripts/refresh-udes-v2-presentation-provenance.mjs";
export const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const CHECKED_EXPORTS = ["PUBLIC_PRESETS", "parseUtcDate", "addUtcCalendarMonths", "utcDayDifference", "horizonEndDayFrom"];
const withoutPresentationChecks = ({ presentationCompatibilityChecks: _checks, ...executionReport }) => executionReport;
export const executionReportContentHash = (report) => sha256(JSON.stringify(withoutPresentationChecks(report)));
const immutableHashes = (hashes) => Object.fromEntries(Object.entries(hashes).filter(([key]) => key !== "publicControllerSha256"));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const requireCondition = (condition, message) => {
  if (!condition) throw new Error(message);
};

// Evaluate the exact bytes whose hash was checked, without a browser or require.
// Sharing Date preserves instanceof semantics for dates passed by the helper.
export function readControllerExports(bytes, filename) {
  const module = { exports: {} };
  new vm.Script(bytes.toString("utf8"), { filename }).runInNewContext({ module, Date }, { timeout: 3000 });
  requireCondition(module.exports.PUBLIC_PRESETS && typeof module.exports.PUBLIC_PRESETS === "object", "Controller presets are unavailable.");
  for (const name of CHECKED_EXPORTS.slice(1))
    requireCondition(typeof module.exports[name] === "function", `Controller export ${name} is unavailable.`);
  return module.exports;
}

function inputsForReport(report, controller) {
  const original = report.controllerCompatibility;
  requireCondition(original?.status === "identical-simulation-inputs", "The report lacks its original during-run compatibility record.");
  requireCondition(same(original.checkedExports, CHECKED_EXPORTS), "The report's consumed controller exports differ from this verifier's contract.");
  const queries = original.checkedCalendarQueries;
  requireCondition(Array.isArray(queries) && queries.length > 0, "The report has no recorded calendar queries.");
  const startDate = queries[0].startDate;
  requireCondition(
    queries.every(
      (query) =>
        query.startDate === startDate &&
        /^\d{4}-\d{2}-\d{2}$/.test(query.startDate) &&
        Number.isInteger(query.months) &&
        query.months > 0 &&
        Number.isInteger(query.days) &&
        query.days > 0
    ),
    "Invalid or mixed-start-date calendar queries."
  );
  const inputs = controllerModelInputs(
    controller,
    startDate,
    queries.map((query) => query.months)
  );
  requireCondition(same(inputs.calendarQueries, queries), "Consumed calendar query results changed; rerun simulation evidence.");
  requireCondition(
    sha256(JSON.stringify(inputs)) === original.simulationInputSha256,
    "Consumed controller model inputs changed; rerun simulation evidence."
  );
  return inputs;
}

function verifyImmutableSources(report, currentHashes) {
  const names = Object.keys(currentHashes).sort();
  requireCondition(
    same(Object.keys(report.sourceHashes || {}).sort(), names),
    "Report source dependency keys do not match the declared dependencies."
  );
  requireCondition(
    same(Object.keys(report.executionSourceHashesAtStart || {}).sort(), names),
    "Execution-start source dependency keys are incomplete."
  );
  for (const key of names) {
    requireCondition(/^[a-f0-9]{64}$/.test(report.sourceHashes[key]), `Invalid recorded source hash: ${key}.`);
    requireCondition(/^[a-f0-9]{64}$/.test(report.executionSourceHashesAtStart[key]), `Invalid execution-start source hash: ${key}.`);
    if (key === "publicControllerSha256") continue;
    requireCondition(report.sourceHashes[key] === currentHashes[key], `Immutable source changed: ${key}; rerun simulation evidence.`);
    requireCondition(
      report.executionSourceHashesAtStart[key] === report.sourceHashes[key],
      `Immutable source changed during the original execution: ${key}.`
    );
  }
  requireCondition(
    report.controllerCompatibility?.controllerChangedDuringRun ===
      (report.executionSourceHashesAtStart.publicControllerSha256 !== report.sourceHashes.publicControllerSha256),
    "The original during-run controller-change flag does not reconcile."
  );
}

function verifyExistingChecks(report) {
  const checks = report.presentationCompatibilityChecks || [];
  requireCondition(Array.isArray(checks), "Presentation compatibility history is not an array.");
  const contentHash = executionReportContentHash(report);
  let lastTime = Date.parse(report.generatedAt);
  requireCondition(Number.isFinite(lastTime), "The original report generation date is invalid.");
  for (const check of checks) {
    requireCondition(
      check.status === "identical-consumed-model-inputs" && check.checkKind === "after-run-presentation-update" && check.simulationRerun === false,
      "Invalid prior presentation compatibility claim."
    );
    requireCondition(
      check.executionControllerSha256 === report.sourceHashes.publicControllerSha256,
      "A prior presentation check references another execution controller."
    );
    requireCondition(check.executionReportContentSha256 === contentHash, "Execution report content changed after a presentation check.");
    requireCondition(
      check.simulationInputSha256 === report.controllerCompatibility.simulationInputSha256,
      "A prior presentation check changed the recorded model-input signature."
    );
    requireCondition(
      same(check.checkedExports, report.controllerCompatibility.checkedExports) &&
        same(check.checkedCalendarQueries, report.controllerCompatibility.checkedCalendarQueries),
      "A prior presentation check changed the consumed-input scope."
    );
    requireCondition(
      same(check.immutableSourceHashes, immutableHashes(report.sourceHashes)),
      "A prior presentation check changed immutable dependencies."
    );
    requireCondition(
      /^[a-f0-9]{64}$/.test(check.presentationControllerSha256) &&
        /^[a-f0-9]{64}$/.test(check.priorReportSha256) &&
        /^[a-f0-9]{64}$/.test(check.verifier?.sha256) &&
        check.verifier.path === VERIFIER_PATH,
      "Invalid prior presentation provenance hashes."
    );
    const time = Date.parse(check.checkedAt);
    requireCondition(Number.isFinite(time) && time >= lastTime, "Presentation checks must follow the original run and prior checks.");
    lastTime = time;
  }
  return checks;
}

// Used by the repository contract: current presentation may differ, but all
// execution sources and results keep their original identity.
export function assertCurrentPresentationProvenance(report, currentHashes, controller, verifierSha256) {
  verifyImmutableSources(report, currentHashes);
  inputsForReport(report, controller);
  const checks = verifyExistingChecks(report);
  if (currentHashes.publicControllerSha256 === report.sourceHashes.publicControllerSha256) return true;
  const latest = checks.at(-1);
  requireCondition(
    latest?.presentationControllerSha256 === currentHashes.publicControllerSha256,
    "Current controller lacks an after-run presentation compatibility check."
  );
  requireCondition(latest.verifier.sha256 === verifierSha256, "The latest presentation verifier source no longer matches its recorded hash.");
  return true;
}

export function preparePresentationUpdate({
  reportBytes,
  currentHashes,
  executionControllerBytes,
  currentControllerBytes,
  checkedAt,
  verifierSha256,
}) {
  const report = JSON.parse(reportBytes.toString("utf8"));
  verifyImmutableSources(report, currentHashes);
  const previous = verifyExistingChecks(report);
  requireCondition(
    sha256(executionControllerBytes) === report.sourceHashes.publicControllerSha256,
    "Saved execution controller does not match the report's original controller hash."
  );
  requireCondition(
    sha256(currentControllerBytes) === currentHashes.publicControllerSha256,
    "Current controller bytes do not match the captured source hash."
  );
  const before = inputsForReport(report, readControllerExports(executionControllerBytes, "execution-controller.cjs"));
  const after = inputsForReport(report, readControllerExports(currentControllerBytes, "current-controller.cjs"));
  requireCondition(same(before, after), "Consumed controller model inputs changed; rerun simulation evidence.");
  const noChange =
    currentHashes.publicControllerSha256 === report.sourceHashes.publicControllerSha256 ||
    (previous.at(-1)?.presentationControllerSha256 === currentHashes.publicControllerSha256 && previous.at(-1)?.verifier.sha256 === verifierSha256);
  if (noChange) return { changed: false, report, bytes: reportBytes };
  requireCondition(
    Number.isFinite(Date.parse(checkedAt)) && Date.parse(checkedAt) >= Date.parse(previous.at(-1)?.checkedAt || report.generatedAt),
    "The presentation check date predates the evidence it checks."
  );
  const check = {
    schemaVersion: "1.0.0",
    status: "identical-consumed-model-inputs",
    checkKind: "after-run-presentation-update",
    checkedAt,
    simulationRerun: false,
    executionControllerSha256: report.sourceHashes.publicControllerSha256,
    presentationControllerSha256: currentHashes.publicControllerSha256,
    simulationInputSha256: sha256(JSON.stringify(after)),
    checkedExports: [...CHECKED_EXPORTS],
    checkedCalendarQueries: after.calendarQueries,
    immutableSourceHashes: immutableHashes(report.sourceHashes),
    executionReportContentSha256: executionReportContentHash(report),
    priorReportSha256: sha256(reportBytes),
    verifier: { path: VERIFIER_PATH, sha256: verifierSha256 },
    interpretation:
      "This check occurred after the recorded simulation run. The current presentation exports exactly the same presets and calendar definitions and reproduces every consumed calendar query. Engine, baseline and experiment dependencies are unchanged. Original run dates, source hashes, outcomes and digests are retained; no simulation was rerun. This is input compatibility, not a test of visual correctness.",
  };
  const updated = { ...report, presentationCompatibilityChecks: [...previous, check] };
  assertCurrentPresentationProvenance(
    updated,
    currentHashes,
    readControllerExports(currentControllerBytes, "current-controller.cjs"),
    verifierSha256
  );
  return { changed: true, report: updated, bytes: Buffer.from(`${JSON.stringify(updated, null, 2)}\n`) };
}

// Stage both reports before replacing either. An ordinary write/rename failure
// restores already-replaced files; this does not claim cross-file crash atomicity.
export function commitPreparedUpdates(updates, assertUnchanged, io = fs) {
  const staged = [];
  const applied = [];
  const keepForRecovery = new Set();
  try {
    assertUnchanged();
    for (const update of updates.filter((item) => item.changed)) {
      const token = crypto.randomUUID();
      const next = `${update.path}.presentation-${token}.tmp`;
      const rollback = `${update.path}.presentation-${token}.restore`;
      const item = { ...update, next, rollback };
      staged.push(item);
      io.writeFileSync(next, update.bytes, { flag: "wx" });
      io.writeFileSync(rollback, update.before, { flag: "wx" });
    }
    assertUnchanged();
    for (const item of staged) {
      io.renameSync(item.next, item.path);
      applied.push(item);
    }
  } catch (error) {
    const failures = [error];
    for (const item of applied.reverse()) {
      try {
        io.renameSync(item.rollback, item.path);
      } catch (restoreError) {
        keepForRecovery.add(item.rollback);
        failures.push(new Error(`Restore failed; original bytes remain in ${item.rollback}`, { cause: restoreError }));
      }
    }
    if (failures.length > 1) throw new AggregateError(failures, "Presentation update failed and needs report recovery.");
    throw error;
  } finally {
    for (const item of staged)
      for (const temporary of [item.next, item.rollback]) {
        if (!keepForRecovery.has(temporary) && io.existsSync(temporary)) io.unlinkSync(temporary);
      }
  }
}

function sourcePaths(harnessKey, harnessFile, statistics = false) {
  return Object.fromEntries(
    Object.entries({
      engineSha256: "assets/js/udes-v2-worker.js",
      baselineSha256: "assets/data/udes-v2/baseline.json",
      publicControllerSha256: "assets/js/udes-v2-app.js",
      [harnessKey]: harnessFile,
      ...(statistics ? { statisticsSha256: "scripts/udes-v2-experiment-statistics.mjs" } : {}),
      evidenceSummarySha256: "scripts/udes-v2-evidence-summary.mjs",
      sourceProvenanceSha256: "scripts/udes-v2-source-provenance.mjs",
    }).map(([key, file]) => [key, path.join(ROOT, file)])
  );
}

function main() {
  const args = new Map(
    process.argv.slice(2).map((argument) => {
      const [key, ...value] = argument.replace(/^--/, "").split("=");
      return [key, value.length ? value.join("=") : true];
    })
  );
  for (const key of args.keys()) requireCondition(["execution-controller", "write"].includes(key), `Unknown argument: --${key}`);
  requireCondition(
    typeof args.get("execution-controller") === "string",
    "Supply --execution-controller=path/to/the/original-controller.cjs. Add --write only to append the verified metadata."
  );
  requireCondition(!args.has("write") || args.get("write") === true, "--write is a flag without a value.");
  const executionPath = path.resolve(ROOT, args.get("execution-controller"));
  const currentPath = path.join(ROOT, "assets/js/udes-v2-app.js");
  const executionBytes = fs.readFileSync(executionPath);
  const currentBytes = fs.readFileSync(currentPath);
  const definitions = [
    { file: "validation-report.json", paths: sourcePaths("validationHarnessSha256", "scripts/validate-udes-v2-full.mjs") },
    { file: "uncertainty-report.json", paths: sourcePaths("experimentHarnessSha256", "scripts/validate-udes-v2-uncertainty.mjs", true) },
  ];
  const captured = new Map([
    [executionPath, sha256(executionBytes)],
    [SELF, sha256(fs.readFileSync(SELF))],
  ]);
  const checkedAt = new Date().toISOString();
  const updates = definitions.map((definition) => {
    const reportPath = path.join(ROOT, "assets/data/udes-v2", definition.file);
    const before = fs.readFileSync(reportPath);
    captured.set(reportPath, sha256(before));
    const hashes = hashSources(definition.paths);
    for (const [key, file] of Object.entries(definition.paths)) captured.set(file, hashes[key]);
    const prepared = preparePresentationUpdate({
      reportBytes: before,
      currentHashes: hashes,
      executionControllerBytes: executionBytes,
      currentControllerBytes: currentBytes,
      checkedAt,
      verifierSha256: captured.get(SELF),
    });
    return { ...prepared, path: reportPath, before };
  });
  const assertUnchanged = () => {
    for (const [file, hash] of captured)
      requireCondition(
        sha256(fs.readFileSync(file)) === hash,
        `Input changed while checking presentation compatibility: ${path.relative(ROOT, file)}.`
      );
  };
  assertUnchanged();
  if (args.has("write")) commitPreparedUpdates(updates, assertUnchanged);
  process.stdout.write(
    `${args.has("write") ? "Applied" : "Checked without writing"}: ${
      updates.filter((item) => item.changed).length
    } presentation-only report update(s); both reports retain their original execution provenance.\n`
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === SELF) main();
