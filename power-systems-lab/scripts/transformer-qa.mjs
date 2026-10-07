import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile, mkdir } from "node:fs/promises";
await mkdir("private/verification", { recursive: true });
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" }),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5196/?qa=1&model=transformer");
await page.waitForFunction(() => document.querySelector("#view").dataset.loaded === "true", null, { timeout: 60000 });
const state = () => page.evaluate(() => window.__POWER_LAB_QA__.state());
assert.equal((await state()).transformer, true);
assert.equal((await state()).triangles, 838253);
assert.equal((await state()).groups.length, 18);
await page.screenshot({ path: "private/verification/transformer-local.png" });
await page.getByRole("button", { name: "Open enclosure", exact: true }).click();
assert.equal((await state()).opened, true);
const openTriangles = (await state()).triangles;
assert.ok(openTriangles < 838253);
await page.getByRole("button", { name: "Core and coils", exact: true }).click();
assert.ok((await state()).triangles < openTriangles);
await page.screenshot({ path: "private/verification/core-and-coils-local.png" });
await page.locator('[data-equipment="hv-coils"]').click();
assert.equal((await state()).selected.id, "hv-coils");
assert.equal((await state()).opened, true);
await page.getByRole("button", { name: "Isolate device", exact: true }).click();
assert.equal((await state()).isolated, true);
await page.locator("#separation").fill("65");
assert.equal((await state()).explosion, 0.65);
await page.screenshot({ path: "private/verification/coils-separated-local.png" });
await page.getByRole("button", { name: "Reset view", exact: true }).click();
assert.equal((await state()).triangles, 838253);
assert.equal((await state()).opened, false);
assert.equal((await state()).explosion, 0);
assert.deepEqual(errors, []);
await writeFile(
  "private/verification/local-qa.json",
  JSON.stringify(
    {
      actualSourceLoaded: true,
      sourceOccurrences: 248,
      placedTriangles: 838253,
      openEnclosure: true,
      coreAndCoils: true,
      selectAndIsolate: true,
      illustrativeSeparation: true,
      reset: true,
      errors,
      published: false,
      physicalQuestTested: false,
    },
    null,
    2
  ) + "\n"
);
console.log("PASS: private transformer source, enclosure, active assembly, isolation, separation and reset. Screenshots remain local and ignored.");
await browser.close();
