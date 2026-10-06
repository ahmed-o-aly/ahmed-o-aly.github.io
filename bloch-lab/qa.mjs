import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
await mkdir("verification", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const url = process.env.BLOCH_QA_URL || "http://127.0.0.1:5189/";
await page.goto(url);
await page.waitForFunction(() => window.__BLOCH_API__);
await page.getByRole("button", { name: "Explore freely", exact: true }).click();
await page.waitForTimeout(500);
const state = () => page.evaluate(() => window.__BLOCH_API__.getState()),
  finished = () => page.waitForFunction(() => !window.__BLOCH_API__.getState().animating && !window.__BLOCH_API__.getState().measuring),
  click = (name) => page.getByRole("button", { name, exact: true }).click();
const vector = (a, b) => a.forEach((x, i) => assert.ok(Math.abs(x - b[i]) < 1e-7));
vector((await state()).vector, [0, 0, 1]);
await page.screenshot({ path: "verification/desktop-ready.png" });
await click("Queue gates: on");
await click("H");
await page.waitForTimeout(500);
const middle = await state();
assert.ok(middle.animating);
assert.ok(middle.vector[2] < 0.99 && middle.vector[2] > -0.01);
await page.screenshot({ path: "verification/desktop-gate-path.png" });
await finished();
vector((await state()).vector, [1, 0, 0]);
assert.equal(await page.locator("#p0").innerText(), "50%");
await click("Z");
await finished();
vector((await state()).vector, [-1, 0, 0]);
await click("H");
await finished();
vector((await state()).vector, [0, 0, -1]);
await click("Measure 100 fresh qubits");
await finished();
assert.deepEqual((await state()).counts, [0, 100]);
await page.screenshot({ path: "verification/desktop-measured.png" });
await click("Reset to |0⟩");
await page.getByRole("button", { name: "Explore freely", exact: true }).click();
assert.deepEqual((await state()).counts, [0, 0]);
await click("H");
await click("Reset to |0⟩");
await page.getByRole("button", { name: "Explore freely", exact: true }).click();
await page.waitForTimeout(1250);
vector((await state()).vector, [0, 0, 1]);
assert.equal((await state()).animating, false);
await click("Touch sphere: off");
const box = await page.locator("#scene").boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 + 30, box.y + box.height / 2 + 15, {
  steps: 5,
});
await page.mouse.up();
const dragged = (await state()).vector;
assert.ok(Math.abs(dragged[2] - 1) > 0.01);
assert.ok(Math.abs(Math.hypot(...dragged) - 1) < 1e-7);
await click("Reset to |0⟩");
await page.getByRole("button", { name: "Explore freely", exact: true }).click();
assert.equal((await state()).touch, false);
const actions = await page.evaluate(() => window.__BLOCH_API__.vrActions);
for (const id of [
  "preset:0",
  "preset:1",
  "preset:+",
  "preset:−",
  "preset:+i",
  "preset:−i",
  "gate:H",
  "gate:X",
  "gate:Y",
  "gate:Z",
  "gate:S",
  "gate:T",
  "measure",
  "reset",
  "guide",
  "recenter",
])
  assert.ok(actions.includes(id));
await click("Queue gates: on");
await page.evaluate(() => window.__BLOCH_API__.previewVRLayout());
await page.evaluate(() => window.__BLOCH_API__.simulateControllerSelect("gate:H"));
await finished();
vector((await state()).vector, [1, 0, 0]);
await page.evaluate(() => window.__BLOCH_API__.simulateControllerSelect("reset"));
await page.evaluate(() => window.__BLOCH_API__.act("lesson-explore"));
vector((await state()).vector, [0, 0, 1]);
await page.waitForTimeout(200);
await page.screenshot({ path: "verification/controller-panel-layout.png" });
await page.evaluate(() => window.__BLOCH_API__.act("queue-mode"));
const seatedCenter = await page.evaluate(() => window.__BLOCH_API__.anchorFromPose([2, 1.1, 3], [1, 0, 0]));
vector(seatedCenter, [4, 1.1, 3]);
await page.evaluate(() => window.__BLOCH_API__.simulateControllerSelect("gate:H", [2, 1.1, 3]));
await finished();
vector((await state()).vector, [1, 0, 0]);
await page.evaluate(() => window.__BLOCH_API__.simulateControllerSelect("reset", [2, 1.1, 3]));
vector((await state()).vector, [0, 0, 1]);
await page.setViewportSize({ width: 390, height: 844 });
await page.reload();
await page.waitForFunction(() => window.__BLOCH_API__);
await page.getByRole("button", { name: "Explore freely", exact: true }).click();
await page.waitForTimeout(200);
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
await click("|+i⟩");
await finished();
vector((await state()).vector, [0, 1, 0]);
await page.screenshot({ path: "verification/phone.png", fullPage: true });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.reload();
await page.waitForFunction(() => window.__BLOCH_API__);
await page.getByRole("button", { name: "Explore freely", exact: true }).click();
await click("Queue gates: on");
await click("H");
await finished();
vector((await state()).vector, [1, 0, 0]);
await click("Measure 100 fresh qubits");
await finished();
assert.equal(
  (await state()).counts.reduce((a, b) => a + b),
  100
);
await click("Reset to |0⟩");
await page.getByRole("button", { name: "Explore freely", exact: true }).click();
await page.getByRole("button", { name: "|1⟩", exact: true }).focus();
await page.keyboard.press("Enter");
await finished();
vector((await state()).vector, [0, 0, -1]);
await page.getByText("Angles & state", { exact: true }).click();
await page.locator("#theta").focus();
await page.keyboard.press("Home");
await page.keyboard.press("ArrowRight");
assert.ok((await state()).vector[2] < 1);
const failPage = await browser.newPage();
await failPage.addInitScript(() => {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...args) {
    return type.includes("webgl") ? null : original.call(this, type, ...args);
  };
});
await failPage.goto(url);
await failPage.locator("#error").waitFor({ state: "visible" });
assert.ok((await failPage.locator("#error").innerText()).includes("hardware acceleration"));
assert.equal(await failPage.locator("#vr").innerText(), "3D unavailable");
await failPage.close();
assert.deepEqual(errors, []);
await browser.close();
console.log(
  "PASS: gate animation/endpoints, guided-path handoff, independent trials, interrupted reset, direct picking, VR action coverage/layout, phone overflow, reduced motion, no browser errors"
);
