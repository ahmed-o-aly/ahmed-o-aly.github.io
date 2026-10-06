import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
await mkdir("verification", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.BLOCH_QA_URL || "http://127.0.0.1:5192/");
await page.waitForFunction(() => window.__BLOCH_API__);
const state = () => page.evaluate(() => window.__BLOCH_API__.getState());
const done = () =>
  page.waitForFunction(
    () =>
      !window.__BLOCH_API__.getState().animating &&
      !window.__BLOCH_API__.getState().measuring,
  );
const near = (a, b) =>
  a.forEach((x, i) => assert.ok(Math.abs(x - b[i]) < 1e-7, `${a} != ${b}`));
const next = async (stage) => {
  await page.locator("#lesson-next").click();
  await done();
  assert.equal((await state()).lesson.stage, stage);
};
assert.equal((await state()).lesson.stage, "start");
assert.equal(await page.locator("#exploration").getAttribute("open"), null);
assert.equal(
  await page.getByRole("button", { name: /Load [AB]|Same|Different/ }).count(),
  0,
);
await page.screenshot({ path: "verification/guided-start.png" });
await next("up-observed");
assert.deepEqual((await state()).counts, [100, 0]);
await next("tilt");
assert.equal(await page.locator("#lesson-next").isDisabled(), true);
await page.evaluate(() => window.__BLOCH_API__.previewVRLayout());
await page.evaluate(() =>
  window.__BLOCH_API__.simulateControllerPrepare([0, -Math.sqrt(0.75), 0.5]),
);
assert.ok(Math.abs((await state()).vector[2] - 0.5) < 0.003);
await next("chance");
const tilted = (await state()).vector;
await next("sampled");
near((await state()).vector, tilted);
assert.equal(
  (await state()).lesson.totals.reduce((a, b) => a + b),
  100,
);
await page.locator("#lesson-helper").click();
await done();
assert.equal(
  (await state()).lesson.totals.reduce((a, b) => a + b),
  200,
);
await page.screenshot({ path: "verification/guided-observation-vr.png" });
await next("turn-phase");
await next("phase-shown");
assert.ok(Math.abs((await state()).vector[2] - tilted[2]) < 1e-7);
await next("undo-first");
await next("undo-second");
near((await state()).vector, [1, 0, 0]);
await next("undo-result");
near((await state()).vector, [0, 0, 1]);
await next("phase-middle");
await next("phase-last");
near((await state()).vector, [-1, 0, 0]);
assert.ok((await state()).baseline);
await next("phase-result");
near((await state()).vector, [0, 0, -1]);
await page.screenshot({ path: "verification/guided-interference.png" });
await next("phase-measured");
assert.deepEqual((await state()).counts, [0, 100]);
await next("order-start");
await next("order-reverse");
near((await state()).vector, [-1, 0, 0]);
await next("order-check");
near((await state()).vector, [1, 0, 0]);
assert.equal((await state()).basis, "X");
await next("order-plus");
assert.deepEqual((await state()).counts, [100, 0]);
await next("order-result");
assert.deepEqual((await state()).counts, [0, 100]);
await page.screenshot({ path: "verification/guided-order.png" });
await next("start");
near((await state()).vector, [0, 0, 1]);
await page.setViewportSize({ width: 390, height: 844 });
await page.reload();
await page.waitForFunction(() => window.__BLOCH_API__);
assert.ok(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
);
await page.screenshot({
  path: "verification/guided-phone.png",
  fullPage: true,
});
await page.emulateMedia({ reducedMotion: "no-preference" });
await next("up-observed");
await next("tilt");
await page.locator("#lesson-helper").click();
await page.getByRole("button", { name: "Start over", exact: true }).click();
await page.waitForTimeout(1200);
near((await state()).vector, [0, 0, 1]);
assert.equal((await state()).lesson.stage, "start");
assert.equal((await state()).lesson.waiting, null);
await page.evaluate(() => window.__BLOCH_API__.previewVRLayout());
await page.evaluate(() =>
  window.__BLOCH_API__.simulateControllerSelect("lesson-next"),
);
await done();
assert.equal((await state()).lesson.stage, "up-observed");
assert.deepEqual(errors, []);
await browser.close();
console.log(
  "PASS complete guided path, fresh observations, phase/interference/order mathematics, controller preparation/actions, reset interruption and phone layout; physical headset untested",
);
