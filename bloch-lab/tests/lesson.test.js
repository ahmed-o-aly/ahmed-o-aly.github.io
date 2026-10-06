import { test } from "node:test";
import assert from "node:assert/strict";
import { GuidedLesson, lessonSteps } from "../lesson.js";
test("guided lesson has a complete ordered path, blocks upright tilt and re-entry", () => {
  const l = new GuidedLesson();
  const visited = [];
  while (!visited.includes(l.stage)) {
    visited.push(l.stage);
    if (l.stage === "tilt") assert.equal(l.begin([0, 0, 1]), null);
    assert.equal(
      l.begin([Math.sqrt(0.75), 0, 0.5]),
      lessonSteps[l.stage].operation,
    );
    assert.equal(l.begin([1, 0, 0]), null);
    assert.equal(l.finish(), true);
  }
  assert.equal(l.stage, "start");
  assert.equal(visited.length, Object.keys(lessonSteps).length);
  l.begin([0, 0, 1]);
  l.reset();
  assert.equal(l.waiting, null);
  assert.equal(l.finish(), false);
});
test("observations accumulate only for identical fresh preparation and measurement basis", () => {
  const l = new GuidedLesson();
  l.record([1, 0, 0], "Z", [52, 48]);
  l.record([1, 0, 0], "Z", [49, 51]);
  assert.deepEqual(l.totals, [101, 99]);
  assert.match(l.observation(), /101\/200/);
  l.record([1, 0, 0], "X", [100, 0]);
  assert.deepEqual(l.totals, [100, 0]);
  assert.equal(l.expected, 1);
  l.record([-1, 0, 0], "X", [0, 100]);
  assert.equal(l.expected, 0);
  assert.deepEqual(l.totals, [0, 100]);
});
