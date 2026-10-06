import { chromium } from "playwright";
import assert from "node:assert/strict";
import { gates, rotate } from "./state.js";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.BLOCH_QA_URL || "http://127.0.0.1:5189/");
await page.waitForFunction(() => window.__BLOCH_API__);
await page.getByRole("button", { name: "Explore freely", exact: true }).click();
const state = () => page.evaluate(() => window.__BLOCH_API__.getState());
const click = (n) => page.getByRole("button", { name: n, exact: true }).click();
const done = () => page.waitForFunction(() => !window.__BLOCH_API__.getState().animating);
const near = (a, b) => a.forEach((x, i) => assert.ok(Math.abs(x - b[i]) < 1e-7));
const verify = (s, program) => {
  assert.deepEqual(
    s.trails.map((t) => t.gate),
    program
  );
  let v = [0, 0, 1];
  for (const t of s.trails) {
    assert.equal(t.points.length, 71);
    near(t.points[0], v);
    v = rotate(v, gates[t.gate].axis, gates[t.gate].angle);
    near(t.points.at(-1), v);
  }
  near(s.vector, v);
};
assert.equal(await page.getByText(/Measure Z/).count(), 0);
assert.ok(!(await page.evaluate(() => window.__BLOCH_API__.vrActions)).includes("queue-measure"));
const program = ["H", "S", "T", "X", "Y", "Z", "H", "T"];
for (const g of program) await click(g);
await click("Step");
await done();
verify(await state(), ["H"]);
await click("Step");
await page.waitForTimeout(300);
await click("Pause");
const paused = await state();
assert.equal(paused.trails.length, 1);
assert.equal(paused.activeTrail, true);
await page.waitForTimeout(250);
near((await state()).vector, paused.vector);
await click("Step");
await done();
verify(await state(), ["H", "S"]);
await click("Resume");
await page.waitForTimeout(350);
assert.equal((await state()).trails.length, 2);
await page.screenshot({ path: "verification/trail-running.png" });
await done();
verify(await state(), program);
assert.equal((await state()).activeTrail, false);
await page.screenshot({ path: "verification/trail-complete.png" });
await click("Measure 100 fresh qubits");
await page.waitForFunction(() => !window.__BLOCH_API__.getState().measuring);
verify(await state(), program);
await click("Replay");
assert.equal((await state()).trails.length, 0);
await done();
verify(await state(), program);
await click("Run");
await page.waitForTimeout(1400);
await click("Clear");
assert.equal((await state()).trails.length, 0);
assert.equal((await state()).activeTrail, false);
near((await state()).vector, [0, 0, 1]);
for (const g of ["H", "Z", "H"]) await click(g);
await click("Run");
await done();
await click("Remove gate 2 Z");
assert.equal((await state()).trails.length, 0);
await click("Run");
await done();
verify(await state(), ["H", "H"]);
await click("Reset to |0⟩");
await page.getByRole("button", { name: "Explore freely", exact: true }).click();
assert.equal((await state()).trails.length, 0);
await click("Queue gates: on");
for (const g of ["H", "Z", "H"]) {
  await click(g);
  await done();
}
verify(await state(), ["H", "Z", "H"]);
await click("|+⟩");
await done();
assert.equal((await state()).trails.length, 0);
await click("Reset to |0⟩");
await page.getByRole("button", { name: "Explore freely", exact: true }).click();
await page.evaluate(() => window.__BLOCH_API__.previewVRLayout());
for (const g of ["H", "Z", "H"]) await page.evaluate((g) => window.__BLOCH_API__.simulateControllerSelect("gate:" + g), g);
await page.evaluate(() => window.__BLOCH_API__.simulateControllerSelect("sequence-run"));
await done();
verify(await state(), ["H", "Z", "H"]);
await page.screenshot({ path: "verification/trail-vr.png" });
await page.setViewportSize({ width: 390, height: 844 });
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
await page.screenshot({ path: "verification/trail-phone.png", fullPage: true });
assert.deepEqual(errors, []);
await browser.close();
console.log(
  "PASS cumulative gate paths/order/endpoints, pause/step/run/replay, end measurement, clear/reset/edits/preparation, direct gates, VR rays, phone and removed measurement action"
);
