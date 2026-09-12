import crypto from "node:crypto";
import fs from "node:fs";

const digest = (text) => crypto.createHash("sha256").update(text).digest("hex");
export const hashSources = (paths) => Object.fromEntries(Object.entries(paths).map(([name, file]) => [name, digest(fs.readFileSync(file))]));

// These are the controller exports and computed calendar lengths consumed by
// the headless experiments. Display/chart/export edits can be compatible with
// an existing simulation while the exact worker and baseline remain immutable.
export function controllerModelInputs(controller, startDate, horizonMonths) {
  const functions = ["parseUtcDate", "addUtcCalendarMonths", "utcDayDifference", "horizonEndDayFrom"];
  return {
    presets: controller.PUBLIC_PRESETS,
    calendarFunctions: Object.fromEntries(functions.map((name) => [name, String(controller[name])])),
    calendarQueries: horizonMonths.map((months) => ({
      startDate,
      months,
      days: controller.horizonEndDayFrom(new Date(`${startDate}T00:00:00Z`), months),
    })),
  };
}

export function finalizeSourceProvenance(paths, initialHashes, initialControllerInputs, finalControllerInputs) {
  const finalHashes = hashSources(paths);
  const changed = Object.keys(initialHashes).filter((name) => name !== "publicControllerSha256" && initialHashes[name] !== finalHashes[name]);
  const before = digest(JSON.stringify(initialControllerInputs));
  const after = digest(JSON.stringify(finalControllerInputs));
  if (changed.length || before !== after) {
    throw new Error(`Simulation inputs changed during validation (${changed.join(", ") || "controller model exports"}); report not written.`);
  }
  return {
    sourceHashes: finalHashes,
    executionSourceHashesAtStart: initialHashes,
    controllerCompatibility: {
      status: "identical-simulation-inputs",
      simulationInputSha256: before,
      controllerChangedDuringRun: initialHashes.publicControllerSha256 !== finalHashes.publicControllerSha256,
      checkedExports: ["PUBLIC_PRESETS", "parseUtcDate", "addUtcCalendarMonths", "utcDayDifference", "horizonEndDayFrom"],
      checkedCalendarQueries: initialControllerInputs.calendarQueries,
      interpretation:
        "Worker, baseline and harness files are unchanged. Controller-only edits are accepted only when all consumed presets, calendar-function definitions and evaluated horizon lengths are identical. Both controller file hashes are retained.",
    },
  };
}
