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
assert.equal(await page.locator("#model-picker").isVisible(), false);
assert.equal(await page.evaluate(() => Boolean(window.__POWER_LAB_QA__)), false);
assert.equal(await page.locator("#equipment-list button").count(), 11);
await page.getByRole("button", { name: "Three-pole tank circuit breaker", exact: false }).click();
await page.getByRole("button", { name: "Isolate device", exact: true }).click();
assert.equal(await page.locator("#view").getAttribute("data-selected"), "breaker");
assert.equal(await page.locator("#view").getAttribute("data-isolated"), "true");
await page.selectOption("#appearance", "source");
assert.equal(await page.locator("#view").getAttribute("data-appearance"), "source");
await page.selectOption("#appearance", "presentation");
await page.getByRole("button", { name: "Source", exact: true }).click();
assert.equal(await page.locator('#source-dialog a[href="https://creativecommons.org/licenses/by/4.0/"]').count(), 1);
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Reset view", exact: true }).click();
assert.equal(await page.locator("#view").getAttribute("data-source-triangles"), "665472");
await page.screenshot({ path: "output/public-desktop.png" });
await page.locator("#view canvas").screenshot({ path: "../assets/img/power-systems-lab.jpg", type: "jpeg", quality: 88 });
await page.setViewportSize({ width: 390, height: 844 });
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
await page.getByRole("button", { name: "Details", exact: true }).click();
await page.screenshot({ path: "output/public-mobile.png" });
assert.deepEqual(privateRequests, []);
assert.deepEqual(errors, []);
await writeFile(
  "output/public-qa.json",
  JSON.stringify(
    { url, productionBuild: true, selectors: 11, sourceTriangles: 665472, privateRequests, errors, physicalQuestTested: false },
    null,
    2
  ) + "\n"
);
console.log("PASS public bundle: source attribution, selection/isolation, original appearance, desktop/mobile, no private requests or QA API.");
await browser.close();
