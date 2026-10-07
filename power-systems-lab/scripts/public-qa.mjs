import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const url = process.env.POWER_PUBLIC_URL || "http://127.0.0.1:4196/";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" }),
  errors = [],
  privateRequests = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("request", (r) => {
  if (/__private__|transformador/i.test(r.url())) privateRequests.push(r.url());
});
await page.goto(url);
await page.waitForFunction(() => document.querySelector("#view").dataset.loaded === "true", null, { timeout: 60000 });
assert.equal(await page.locator("#model-picker").isVisible(), true);
assert.equal(await page.evaluate(() => Boolean(window.__POWER_LAB_QA__)), false);
assert.equal(await page.locator("#equipment-list button").count(), 11);
await page.getByRole("button", { name: "Three-pole tank circuit breaker", exact: false }).click();
await page.getByRole("button", { name: "Isolate device", exact: true }).click();
assert.equal(await page.locator("#view").getAttribute("data-selected"), "breaker");
assert.equal(await page.locator("#view").getAttribute("data-isolated"), "true");
await page.selectOption("#appearance", "source");
assert.equal(await page.locator("#view").getAttribute("data-appearance"), "source");
assert.match(await page.locator("#status").textContent(), /diffuse atlas/);
await page.selectOption("#appearance", "presentation");
await page.getByRole("button", { name: "Source", exact: true }).click();
assert.equal(await page.locator('#source-dialog a[href="https://creativecommons.org/licenses/by/4.0/"]').count(), 1);
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Reset view", exact: true }).click();
assert.equal(await page.locator("#view").getAttribute("data-source-triangles"), "665472");
await page.screenshot({ path: "output/public-desktop.png" });
if (process.env.POWER_CAPTURE_PREVIEW === "1")
  await page.locator("#view canvas").screenshot({ path: "../assets/img/power-systems-lab.jpg", type: "jpeg", quality: 88 });
await page.setViewportSize({ width: 390, height: 844 });
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
await page.getByRole("button", { name: "Details", exact: true }).click();
await page.screenshot({ path: "output/public-mobile.png" });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(new URL("?model=transformer", url).href);
await page.waitForFunction(
  () => document.querySelector("#view").dataset.loaded === "true" && document.querySelector("#view").dataset.model === "transformer",
  null,
  { timeout: 60000 }
);
assert.equal(await page.locator("#equipment-list button").count(), 18);
assert.equal(await page.getByRole("combobox", { name: "Choose equipment experience" }).inputValue(), "transformer");
assert.equal(await page.locator("#view").getAttribute("data-source-triangles"), "838253");
await page.getByRole("button", { name: "Source", exact: true }).click();
assert.match(await page.locator("#source-description").textContent(), /Patrick Kayter.*Jonathan Lucas.*creator permission/);
assert.equal(await page.locator('#source-dialog a[href="https://grabcad.com/library/transformador-trifasico"]').count(), 1);
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Open enclosure", exact: true }).click();
assert.equal(await page.locator("#view").getAttribute("data-opened"), "true");
const openTriangles = Number(await page.locator("#view").getAttribute("data-visible-triangles"));
assert.ok(openTriangles < 838253);
await page.getByRole("button", { name: "Core and coils", exact: true }).click();
assert.ok(Number(await page.locator("#view").getAttribute("data-visible-triangles")) < openTriangles);
await page.locator('[data-equipment="hv-coils"]').click();
await page.getByRole("button", { name: "Isolate device", exact: true }).click();
assert.equal(await page.locator("#view").getAttribute("data-selected"), "hv-coils");
assert.equal(await page.locator("#view").getAttribute("data-isolated"), "true");
await page.locator("#separation").fill("65");
assert.equal(await page.locator("#separation-value").textContent(), "65%");
await page.selectOption("#appearance", "source");
assert.equal(await page.locator("#status").textContent(), "Original CAD colors.");
await page.getByRole("button", { name: "Reset view", exact: true }).click();
assert.equal(await page.locator("#view").getAttribute("data-visible-triangles"), "838253");
assert.equal(await page.locator("#view").getAttribute("data-opened"), "false");
assert.equal(await page.locator("#separation-value").textContent(), "0%");
await page.screenshot({ path: "output/public-transformer.png" });
await page.setViewportSize({ width: 390, height: 844 });
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
await page.getByRole("button", { name: "Details", exact: true }).click();
await page.screenshot({ path: "output/public-transformer-mobile.png" });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.getByRole("combobox", { name: "Choose equipment experience" }).selectOption("substation");
await page.waitForFunction(
  () => document.querySelector("#view").dataset.loaded === "true" && document.querySelector("#view").dataset.model === "substation"
);
assert.equal(await page.locator("#equipment-list button").count(), 11);
assert.equal(new URL(page.url()).searchParams.has("model"), false);
await page.reload();
await page.waitForFunction(
  () => document.querySelector("#view").dataset.loaded === "true" && document.querySelector("#view").dataset.model === "substation",
  null,
  { timeout: 60000 }
);
await page.getByRole("combobox", { name: "Choose equipment experience" }).selectOption("transformer");
await page.waitForFunction(
  () => document.querySelector("#view").dataset.loaded === "true" && document.querySelector("#view").dataset.model === "transformer",
  null,
  { timeout: 60000 }
);
assert.equal(new URL(page.url()).searchParams.get("model"), "transformer");
await page.reload();
await page.waitForFunction(
  () => document.querySelector("#view").dataset.loaded === "true" && document.querySelector("#view").dataset.model === "transformer",
  null,
  { timeout: 60000 }
);
assert.deepEqual(privateRequests, []);
assert.deepEqual(errors, []);
await writeFile(
  "output/public-qa.json",
  JSON.stringify(
    {
      url,
      productionBuild: true,
      selectors: 11,
      sourceTriangles: 665472,
      transformerSelectors: 18,
      transformerTriangles: 838253,
      transformerControls: true,
      modelSwitching: true,
      selectedModelSurvivesReload: true,
      modelSpecificSourceStatus: true,
      privateRequests,
      errors,
      physicalQuestTested: false,
    },
    null,
    2
  ) + "\n"
);
console.log(
  "PASS public bundle: both models, attribution, source appearance, transformer inspection, switching, desktop/mobile, no private requests or QA API."
);
await browser.close();
