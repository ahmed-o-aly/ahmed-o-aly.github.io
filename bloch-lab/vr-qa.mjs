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
assert.equal((await state()).immersive.controlsHelp, true);
await page
  .locator("#scene")
  .screenshot({ path: "verification/quest3-controls-intro.png" });
await call("act", "controls-dismiss");
assert.equal((await state()).immersive.controlsHelp, false);
await call("act", "controls-help");
assert.equal((await state()).immersive.controlsHelp, true);
await call("act", "controls-dismiss");
assert.ok(
  !(await call("vrControlLayout")).some((b) => b.id === "view:movement")
);
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
  [0, Math.SQRT1_2, 0, Math.SQRT1_2]
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
  "end"
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
near((await state()).view.rig, [0, 0, -0.65 * 0.016]);
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
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.reload();
await page.waitForFunction(() => window.__BLOCH_API__);
await call("act", "lesson-explore");
await call("previewVRLayout");
await call("act", "controls-dismiss");
await call("act", "gate:H");
await call("act", "gate:Z");
await call("simulateVRInputs", [0, 0], 0);
// Left hand holds sphere, right hand owns arrow; sticks and face buttons remain live.
await call("simulateViewGrip", 0, [0, 1.65, 0], [0, 0, 0, 1], "start");
await call("simulateArrowGrip", [0, 1.65, -4], [0, 1, 0, 0], "start", 1);
assert.equal((await state()).preparing, true);
await call("simulateViewGrip", 0, [0.2, 1.65, 0]);
await call("simulateArrowGrip", [0.8, 1.65, -4], [0, 1, 0, 0], "move", 1);
assert.ok((await state()).vector[0] > 0.4);
assert.equal((await state()).view.grabbing, true);
const moving = await state();
for (let i = 0; i < 10; i++) await call("simulateVRInputs", [0.5, -1], 0.5);
assert.notDeepEqual((await state()).view.rig, moving.view.rig);
assert.equal((await state()).preparing, true);
assert.equal((await state()).view.grabbing, true);
// Run from held arrow while locomoting: committed vector is sequence input.
const prepared = (await state()).vector;
await call("simulateVRInputs", [0.5, -1], 0.5, 0.016, { "1:4": true });
assert.equal((await state()).preparing, false);
assert.equal((await state()).animating, true);
near((await state()).sequence.base, prepared);
const running = (await state()).view.rig;
await call("simulateVRInputs", [0.5, -1], 0.5);
assert.notDeepEqual((await state()).view.rig, running);
await call("simulateViewGrip", 0, [0.2, 1.65, 0], [0, 0, 0, 1], "end");
// Grab during a running gate: no endpoint jump, queue retained and rebased.
await call("act", "recenter");
const visible = await call("simulateGrabCurrentArrow", 1);
assert.equal((await state()).animating, false);
assert.equal((await state()).sequence.status, "idle");
assert.deepEqual((await state()).sequence.queue, ["H", "Z"]);
near((await state()).vector, visible);
near((await state()).sequence.base, visible);
// Replay from new preparation, no drag writer survives it.
await call("act", "sequence-run");
assert.equal((await state()).preparing, false);
await page.waitForFunction(
  () => window.__BLOCH_API__.getState().sequence.status === "complete"
);
const expected = [-visible[2], visible[1], visible[0]]; // H then Z
near((await state()).vector, expected);
assert.ok(Math.abs(Math.hypot(...(await state()).vector) - 1) < 1e-8);
// Paused gate editing also rebases cleanly, without a stale resume writer.
await call("act", "sequence-replay");
await call("act", "sequence-run");
assert.equal((await state()).sequence.status, "paused");
const paused = await call("simulateGrabCurrentArrow", 1);
near((await state()).vector, paused);
assert.equal((await state()).sequence.status, "idle");
await call("simulateGrabCurrentArrow", 0);
assert.equal((await state()).preparing, true); // second arrow claim cannot overwrite first
await call("act", "measure");
assert.equal((await state()).preparing, false);
assert.equal((await state()).measuring, true);
await call("act", "controls-help");
assert.equal((await state()).immersive.controlsHelp, true);
await call("act", "controls-dismiss");
await page.waitForFunction(() => !window.__BLOCH_API__.getState().measuring);
// Samples can begin while moving, and reset cancels every writer/hold.
await call("simulateVRInputs", [0, 0], 0);
await call("simulateVRInputs", [0, -1], 0, 0.016, { "1:5": true });
assert.equal((await state()).measuring, true);
await call("act", "reset");
assert.equal((await state()).preparing, false);
assert.equal((await state()).measuring, false);
assert.equal((await state()).view.grabbing, false);
const resetRig = (await state()).view.rig;
await call("simulateVRInputs", [0, -1], 1);
near((await state()).view.rig, resetRig); // held input must rearm after reset
near((await state()).vector, [0, 0, 1]);
assert.deepEqual(errors, []);
await browser.close();
console.log(
  "PASS simulated grip/reposition/rotation/two-hand scale/release/reset, independent state/sequence/counts, world-fixed labels while viewer moves, rear arrow hold, simultaneous held-stick movement/turning + view/arrow grips, Run/measurement while moving, interruption/rebase and help; physical Quest 3 untested"
);
