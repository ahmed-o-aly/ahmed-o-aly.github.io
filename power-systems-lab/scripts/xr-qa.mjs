import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1440, height: 1000 } }),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5196/?qa=1");
await page.waitForFunction(() => window.__POWER_LAB_QA__?.state().ready, null, { timeout: 60000 });
const call = (method, ...args) => page.evaluate(({ method, args }) => window.__POWER_LAB_QA__.xr.qa[method](...args), { method, args });
let s = await call("start");
assert.equal(s.active, true);
assert.equal(s.panel, false);
assert.deepEqual(s.armed, [true, true]);
await call("aim");
s = await call("step", { buttons: { "0:1": true } });

assert.equal(s.held, 1);
const held = s;
for (let i = 0; i < 12; i++) s = await call("step", { left: [0.5, -1], right: 0.5, buttons: { "0:1": true } });
assert.equal(s.held, 1);
assert.notDeepEqual(s.rig, held.rig);
assert.notDeepEqual(s.yaw, held.yaw);
assert.notDeepEqual(s.position, held.position);
await call("aim");
s = await call("step", { left: [0.5, -1], right: 0.5, buttons: { "0:1": true, "1:1": true } });
assert.equal(s.held, 2);
const before = s;
s = await call("step", {
  left: [0.5, -1],
  right: 0.5,
  buttons: { "0:1": true, "1:1": true },
  poses: { 0: { position: [-0.4, 1.25, 0] }, 1: { position: [0.4, 1.25, 0] } },
});
assert.ok(s.scale > before.scale * 1.8);
assert.notDeepEqual(s.rig, before.rig);
assert.equal(s.held, 2);
s = await call("step", { left: [0.5, -1], right: 0.5, buttons: { "0:1": true, "1:1": true, "0:4": true } });
assert.equal(s.panel, true);
assert.equal(s.held, 2);
const panelOpen = s;
s = await call("step", { left: [0.5, -1], right: 0.5, buttons: { "0:1": true, "1:1": true, "0:4": true } });
assert.equal(s.panel, true, "held face button does not repeat");
assert.notDeepEqual(s.rig, panelOpen.rig);
s = await call("step", { buttons: { "0:1": true } });
assert.equal(s.held, 1);
const release = s;
s = await call("step", { buttons: { "0:1": true }, poses: { 0: { position: [-0.35, 1.3, 0] } } });
assert.equal(s.held, 1);
assert.ok(s.position.every(Number.isFinite));
s = await call("step", { buttons: {}, tracked: [false, true] });
assert.equal(s.held, 0, "tracking loss cancels the active grip");
s = await call("step", { left: [0, -1], buttons: { "0:1": true }, tracked: [true, true] });
assert.equal(s.armed[0], false, "held controls cannot rearm on tracking recovery");
s = await call("step", { buttons: {} });
assert.equal(s.armed[0], true);
await call("visibility", "hidden");
s = await call("step", { left: [0, -1], right: 1 });
assert.equal(s.held, 0);
assert.equal(s.panel, false);
const pausedRig = s.rig;
s = await call("step", { left: [0, -1], right: 1 });
assert.deepEqual(s.rig, pausedRig);
await call("visibility", "visible");
s = await call("step", {});
assert.deepEqual(s.armed, [true, true]);
await call("stop");
assert.equal(await page.evaluate(() => document.body.classList.contains("xr")), false);
assert.equal(await page.locator("#view").getAttribute("data-model"), "substation");
await page.evaluate(() =>
  Object.defineProperty(navigator, "xr", {
    configurable: true,
    value: {
      requestSession: async () => {
        throw new Error("Session unavailable for QA");
      },
    },
  })
);
await page.getByRole("button", { name: "Enter VR", exact: true }).click();
await page.waitForFunction(() => document.querySelector("#status").textContent.includes("Session unavailable for QA"));
assert.equal(await page.evaluate(() => document.body.classList.contains("xr")), false);
const report = {
  simulatedActualControllerRouting: true,
  oneGrip: true,
  twoGripScaling: true,
  simultaneousMovementAndTurningWhileGripping: true,
  panelToggleWhileGripping: true,
  faceButtonEdge: true,
  trackingLossCancellation: true,
  neutralRearm: true,
  sessionVisibilityCancellation: true,
  desktopRestored: true,
  sessionRequestFailureHandled: true,
  errors,
  physicalQuestTested: false,
};
assert.deepEqual(errors, []);
await writeFile("output/xr-qa.json", JSON.stringify(report, null, 2) + "\n");
await browser.close();
console.log(JSON.stringify(report));
