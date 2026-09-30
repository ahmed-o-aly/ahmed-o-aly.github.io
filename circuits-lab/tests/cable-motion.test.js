import test from "node:test";
import assert from "node:assert/strict";
import { resampleCablePath, deformCablePath, settleCablePath } from "../src/cable-motion.js";

const p = (x, y = 0, z = 0) => ({ x, y, z });
const gap = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
const near = (a, b, epsilon = 1e-11) => assert(gap(a, b) < epsilon, `${JSON.stringify(a)} != ${JSON.stringify(b)}`);
const route = () => resampleCablePath([p(0), p(0.2, 0, 0.25), p(0.8, 0, 0.25), p(1)], 49);

test("resampling uses polyline arc length, keeps exact endpoints, and handles duplicate vertices", () => {
  const points = [p(0), p(0), p(1), p(1, 1), p(1, 1)];
  const sampled = resampleCablePath(points, 5);
  assert.deepEqual(sampled, [p(0), p(0.5), p(1), p(1, 0.5), p(1, 1)]);
  assert.notEqual(sampled[0], points[0]);
  assert.deepEqual(resampleCablePath([p(2), p(2)], 3), [p(2), p(2), p(2)]);
  assert.deepEqual(resampleCablePath([], 3), []);
});

test("a small hand motion bends the nearby cable smoothly without amplifying displacement or moving its fixed plug", () => {
  const reference = route(),
    start = reference[0],
    oldEnd = reference.at(-1),
    end = p(oldEnd.x, 0.012, oldEnd.z + 0.008);
  const displaced = deformCablePath(reference, start, end),
    handMove = gap(oldEnd, end);
  assert.deepEqual(displaced[0], start);
  assert.deepEqual(displaced.at(-1), end);
  for (let i = 0; i < reference.length; i++) assert(gap(reference[i], displaced[i]) <= handMove + 1e-12);
  assert(gap(reference[12], displaced[12]) < gap(reference[36], displaced[36]));
  assert(gap(reference[24], displaced[24]) < handMove * 0.13, "Main route stays nearly in place");
  const slightlyFurther = deformCablePath(reference, start, p(end.x, end.y + 0.0001, end.z));
  for (let i = 0; i < reference.length; i++) assert(gap(displaced[i], slightlyFurther[i]) <= 0.0001 + 1e-12);
});

test("both endpoint motions stay exact and cannot amplify the largest endpoint displacement", () => {
  const reference = route(),
    start = p(-0.04, 0.02),
    end = p(1.08, -0.01);
  const deformed = deformCablePath(reference, start, end);
  assert.deepEqual(deformed[0], start);
  assert.deepEqual(deformed.at(-1), end);
  const maximum = Math.max(gap(start, reference[0]), gap(end, reference.at(-1)));
  for (let i = 0; i < reference.length; i++) assert(gap(reference[i], deformed[i]) <= maximum + 1e-12);
});

test("repeated deformation from the original path does not accumulate drift and never mutates it", () => {
  const reference = route().map(Object.freeze);
  Object.freeze(reference);
  const snapshot = structuredClone(reference),
    end = p(1, 0.2, -0.1);
  const expected = deformCablePath(reference, reference[0], end);
  for (let i = 0; i < 100; i++) assert.deepEqual(deformCablePath(reference, reference[0], end), expected);
  assert.deepEqual(reference, snapshot);
  assert.deepEqual(deformCablePath(reference, reference[0], reference.at(-1)), reference);
});

test("a large settled-route change moves the cable body gradually with bounded speed and a long-frame clamp", () => {
  const current = route(),
    target = current.map((point) => p(point.x, point.y + 2, point.z - 1));
  const options = { response: 12, maxSpeed: 0.6, maxDelta: 0.05 };
  const next = settleCablePath(current, target, 1 / 60, options);
  assert.deepEqual(next[0], target[0]);
  assert.deepEqual(next.at(-1), target.at(-1));
  for (let i = 1; i < current.length - 1; i++) {
    assert(gap(current[i], next[i]) <= options.maxSpeed / 60 + 1e-12);
    assert(gap(next[i], target[i]) > 2, "Body must not snap to the new route");
  }
  const stalled = settleCablePath(current, target, 5, options);
  for (let i = 1; i < current.length - 1; i++) assert(gap(current[i], stalled[i]) <= options.maxSpeed * options.maxDelta + 1e-12);
});

test("settling agrees at 30, 60 and 90 Hz, including the transition from speed-limited to exponential motion", () => {
  const reference = route(),
    target = reference.map((point, i) => p(point.x, i % 3 === 0 ? 1 : 0.025, point.z));
  const simulate = (hz) => {
    let path = reference;
    for (let frame = 0; frame < hz; frame++) path = settleCablePath(path, target, 1 / hz, { response: 8, maxSpeed: 1.5 });
    return path;
  };
  const thirty = simulate(30),
    sixty = simulate(60),
    ninety = simulate(90);
  for (let i = 0; i < reference.length; i++) {
    near(thirty[i], sixty[i]);
    near(sixty[i], ninety[i]);
  }
});

test("identical settled paths do not drift and a zero-time frame still keeps both contacts exact", () => {
  const reference = route();
  let path = reference;
  for (let i = 0; i < 100; i++) path = settleCablePath(path, reference, 1 / 90);
  assert.deepEqual(path, reference);
  const moved = reference.map((point) => p(point.x, 0.1, point.z));
  const stationaryBody = settleCablePath(reference, moved, 0);
  assert.deepEqual(stationaryBody.slice(1, -1), reference.slice(1, -1));
  assert.deepEqual(stationaryBody[0], moved[0]);
  assert.deepEqual(stationaryBody.at(-1), moved.at(-1));
});

test("settling accepts different route point counts without changing the current sample correspondence", () => {
  const current = route(),
    target = [p(0), p(0.5, 0.2, -0.3), p(1)];
  const next = settleCablePath(current, target, 1 / 60);
  assert.equal(next.length, current.length);
  assert.deepEqual(next[0], target[0]);
  assert.deepEqual(next.at(-1), target.at(-1));
  assert(next.every((point) => [point.x, point.y, point.z].every(Number.isFinite)));
});
