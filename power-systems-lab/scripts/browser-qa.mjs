import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("output", { recursive: true });
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" }),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.goto(process.env.POWER_QA_URL || "http://127.0.0.1:5196/?qa=1");
await page.waitForFunction(() => document.querySelector("#view").dataset.loaded === "true", null, { timeout: 60000 });
const call = (method, ...args) => page.evaluate(({ method, args }) => window.__POWER_LAB_QA__[method](...args), { method, args });
const state = () => call("state");
assert.equal((await state()).triangles, 665472);
assert.equal((await state()).drawCalls, 2);
assert.equal(await page.locator("#equipment-list button").count(), 11);
await page.screenshot({ path: "output/substation-desktop.png" });
await page.getByRole("button", { name: "Three-pole tank circuit breaker", exact: false }).click();
assert.equal((await state()).selected.id, "breaker");
await page.getByRole("button", { name: "Isolate device", exact: true }).click();
assert.equal((await state()).isolated, true);
assert.ok((await state()).triangles < 30000);
assert.ok((await state()).triangles > 5000);
await page.screenshot({ path: "output/breaker-isolated.png" });
const point = await call("projectCenter");
await page.mouse.click(point.x, point.y);
assert.equal((await state()).selected.id, "breaker", "real canvas picking resolves the complete breaker");
await page.selectOption("#appearance", "source");
assert.equal((await state()).appearance, "source");
await page.selectOption("#appearance", "presentation");
await page.getByRole("button", { name: "Show context", exact: true }).click();
assert.equal((await state()).triangles, 665472);
await page.getByRole("button", { name: "Guided tour", exact: true }).click();
const ids = ["line", "bus", "disconnect", "breaker", "transformer", "arrester"];
for (let i = 0; i < 6; i++) {
  await page.locator(`[data-tour="${i}"]`).click();
  assert.equal((await state()).selected.id, ids[i]);
  assert.equal(await page.locator("#tour-prompt").isVisible(), true);
  assert.match(await page.locator("#video-link").getAttribute("href"), /&t=\d+s$/);
}
await page.getByRole("button", { name: "Reset view", exact: true }).click();
await page.getByRole("button", { name: "Source", exact: true }).click();
assert.match(await page.locator("#source-dialog").innerText(), /CC BY|Creative Commons Attribution 4.0/);
assert.match(await page.locator("#source-dialog").innerText(), /665,472/);
await page.getByRole("button", { name: "Close source details" }).click();
await page.getByRole("button", { name: "Help", exact: true }).click();
assert.match(await page.locator("#help-dialog").innerText(), /Navigation continues while gripping/);
await page.keyboard.press("Escape");
assert.equal(await page.locator("#help-dialog").isVisible(), false);
const xrUnavailable = await page.evaluate(() => !navigator.xr);
if (xrUnavailable) {
  await page.getByRole("button", { name: "Enter VR", exact: true }).click();
  assert.match(await page.locator("#status").innerText(), /Meta Quest Browser/);
}
const panel = await page.evaluate(async () => {
  const THREE = await import("/node_modules/.vite/deps/three.js");
  const api = window.__POWER_LAB_QA__,
    head = new THREE.Object3D();
  head.position.set(0, 1.65, 0);
  api.xr.panel.show(head);
  const before = api.xr.panel.group.position.toArray();
  head.position.x = 4;
  api.xr.panel.update();
  const after = api.xr.panel.group.position.toArray();
  const mesh = api.xr.panel.group.children[0];
  const hit = { uv: { x: 0.5, y: 0.1 } };
  const consumed = api.xr.panel.pointerDown("first", hit),
    second = api.xr.panel.pointerDown("second", hit);
  api.xr.panel.pointerUp("first");
  api.xr.panel.hide();
  return { before, after, consumed, second, visible: api.xr.panel.visible, material: mesh.material.depthTest };
});
assert.deepEqual(panel.before, panel.after, "panel stays world-anchored after viewer moves");
assert.equal(panel.consumed, true);
assert.equal(panel.second, true);
assert.equal(panel.visible, false);
await page.setViewportSize({ width: 390, height: 844 });
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "no mobile horizontal overflow");
await page.getByRole("button", { name: "Explore", exact: true }).click();
assert.equal(await page.locator("#equipment").isVisible(), true);
await page.getByRole("button", { name: "Equipment", exact: true }).click();
await page.locator('[data-equipment="transformer"]').click();
assert.equal(await page.locator("#equipment").isVisible(), false);
await page.getByRole("button", { name: "Details", exact: true }).click();
assert.equal(await page.locator("#details").isVisible(), true);
await page.screenshot({ path: "output/substation-mobile-details.png" });
await page.keyboard.press("Escape");
assert.equal(await page.locator("#details").isVisible(), false);
await page.screenshot({ path: "output/substation-mobile.png" });
const report = {
  publicModel: "One80 Solar CC BY 4.0",
  sourceTriangles: 665472,
  selectors: 11,
  guidedChapters: 6,
  desktop: true,
  mobile: true,
  actualCanvasPicking: true,
  sourceAppearance: true,
  panelWorldAnchored: true,
  errors,
  physicalQuestTested: false,
};
assert.deepEqual(errors, []);
await writeFile("output/browser-qa.json", JSON.stringify(report, null, 2) + "\n");
await browser.close();
console.log(JSON.stringify(report));
