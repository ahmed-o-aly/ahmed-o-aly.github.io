import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.BLOCH_QA_URL || "http://127.0.0.1:5192/");
await page.waitForFunction(() => window.__BLOCH_API__);
const call = (method, ...args) =>
  page.evaluate(({ method, args }) => window.__BLOCH_API__[method](...args), {
    method,
    args,
  });
const state = () => call("getState");
const near = (a, b) =>
  a.forEach((x, i) => assert.ok(Math.abs(x - b[i]) < 1e-7, `${a} != ${b}`));
await call("previewVRLayout");
const quantum = await state();
assert.equal((await state()).immersive.visiblePanels, 0);
assert.equal((await state()).immersive.paletteOpen, false);
await call("act", "palette-toggle");
assert.equal((await state()).immersive.paletteOpen, true);
const fixedBefore = await call("labelTransforms");
await call("simulateViewGrip", 0, [-0.8, 1.57, 0], [0, 0, 0, 1], "start");
assert.equal((await state()).view.grabbing, true);
await call("simulateViewGrip", 0, [-0.5, 1.57, 0]);
near((await state()).view.position, [0, 1.65, -2]);
assert.notDeepEqual(await call("labelTransforms"), fixedBefore);
await call("simulateViewGrip", 0, [-0.5, 1.57, 0], [0, 0, 0, 1], "end");
await call("act", "palette-toggle");
await call("anchorFromPose", [0, 1.65, 0], [0, 0, -1]);
await call("simulateViewGrip", 0, [0, 1.65, 0], [0, 0, 0, 1], "start");
assert.equal((await state()).view.grabbing, true);
await call(
  "simulateViewGrip",
  0,
  [0.4, 1.85, 0],
  [0, Math.SQRT1_2, 0, Math.SQRT1_2],
);
near((await state()).view.position, [-1.6, 1.85, 0]);
near((await state()).vector, quantum.vector);
assert.deepEqual((await state()).sequence, quantum.sequence);
assert.deepEqual((await state()).counts, quantum.counts);
await call(
  "simulateViewGrip",
  0,
  [0.4, 1.85, 0],
  [0, Math.SQRT1_2, 0, Math.SQRT1_2],
  "end",
);
assert.equal((await state()).view.grabbing, false);
await call("anchorFromPose", [0, 1.65, 0], [0, 0, -1]);
await call("simulateViewGrip", 0, [-0.2, 1.65, 0], [0, 0, 0, 1], "start");
await call("simulateViewGrip", 1, [0.2, 1.65, 0], [0, 0, 0, 1], "start");
await call("simulateViewGrip", 0, [-0.4, 1.65, 0]);
await call("simulateViewGrip", 1, [0.4, 1.65, 0]);
assert.equal((await state()).view.scale, 1.8);
near((await state()).vector, quantum.vector);
await call("act", "reset");
assert.equal((await state()).view.grabbing, false);
await call("anchorFromPose", [0, 1.65, 0], [0, 0, -1]);
const labels = await call("labelTransforms");
assert.ok(labels.length > 15);
assert.ok(labels.every((l) => l.type === "Group"));
await call("simulateNavigation", [0, 0], 0);
await call("simulateNavigation", [0, -1], 0);
near((await state()).view.rig, [0, 0, -0.4]);
assert.deepEqual(await call("labelTransforms"), labels);
near((await state()).vector, quantum.vector);
await page.reload();
await page.waitForFunction(() => window.__BLOCH_API__);
await call("act", "lesson-explore");
await call("act", "preset:+i");
await page.waitForFunction(() => !window.__BLOCH_API__.getState().animating);
await call("simulateArrowGrip", [0, 1.65, -4], [0, 1, 0, 0], "start");
await call("simulateArrowGrip", [0.5, 1.65, -4], [0, 1, 0, 0], "move");
assert.ok((await state()).vector[0] > 0.5);
assert.ok((await state()).vector[1] > 0.5);
await call("simulateArrowGrip", [0.5, 1.65, -4], [0, 1, 0, 0], "end");
await call("act", "preset:0");
await page.waitForFunction(() => !window.__BLOCH_API__.getState().animating);
await call("previewVRLayout");
await page
  .locator("#scene")
  .screenshot({ path: "verification/quest3-sphere-first.png" });
await call("act", "palette-toggle");
await page
  .locator("#scene")
  .screenshot({ path: "verification/quest3-palette.png" });
await call("act", "palette-toggle");
await call("act", "view:larger");
assert.ok((await state()).view.scale > 1);
near((await state()).vector, [0, 0, 1]);
await call("act", "queue-mode");
await call("act", "gate:H");
await call("act", "view:smaller");
await page.waitForFunction(() => !window.__BLOCH_API__.getState().animating);
near((await state()).vector, [1, 0, 0]);
assert.deepEqual(errors, []);
await browser.close();
console.log(
  "PASS simulated grip/reposition/rotation/two-hand scale/release/reset, independent state/sequence/counts, world-fixed labels while viewer moves, rear arrow hold, view controls during gate; physical Quest 3 untested",
);
