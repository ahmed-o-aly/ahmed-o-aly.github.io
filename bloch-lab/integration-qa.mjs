import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5191/projects/bloch-lab/");
await page.getByRole("link", { name: "Open Bloch Lab full screen" }).click();
await page.waitForFunction(() => window.__BLOCH_API__);
assert.equal(new URL(page.url()).pathname, "/bloch-lab/");
await page.getByRole("button", { name: "Explore freely", exact: true }).click();
await page.getByRole("button", { name: "H", exact: true }).click();
await page.getByRole("button", { name: "Run", exact: true }).click();
await page.waitForFunction(() => !window.__BLOCH_API__.getState().animating);
const state = await page.evaluate(() => window.__BLOCH_API__.getState());
assert.ok(Math.abs(state.vector[0] - 1) < 1e-7);
assert.deepEqual(errors, []);
await browser.close();
console.log(
  "PASS: generated project launch → same-origin published app → gate interaction",
);
