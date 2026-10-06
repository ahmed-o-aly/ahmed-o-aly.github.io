import { test } from "node:test";
import assert from "node:assert/strict";
import {
  presets,
  gates,
  rotate,
  preparation,
  measure,
  angles,
} from "../state.js";
import {
  blochCoordinates,
  stateAmplitudes,
  measurementProbabilities,
} from "../quantum-state.js";
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`),
  vector = (a, b) => a.forEach((x, i) => near(x, b[i]));
const c = (r, i = 0) => [r, i],
  mul = (a, b) => c(a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]),
  add = (a, b) => c(a[0] + b[0], a[1] + b[1]);
const q = Math.SQRT1_2;
const matrices = {
  H: [
    [c(q), c(q)],
    [c(q), c(-q)],
  ],
  X: [
    [c(0), c(1)],
    [c(1), c(0)],
  ],
  Y: [
    [c(0), c(0, -1)],
    [c(0, 1), c(0)],
  ],
  Z: [
    [c(1), c(0)],
    [c(0), c(-1)],
  ],
  S: [
    [c(1), c(0)],
    [c(0), c(0, 1)],
  ],
  T: [
    [c(1), c(0)],
    [c(0), c(q, q)],
  ],
};
for (const g of Object.keys(gates))
  test(`${g} rotations match independent complex-state unitary`, () => {
    for (let i = 0; i < 31; i++) {
      const theta = (i / 30) * Math.PI,
        phi = i * 0.713;
      const xyz = blochCoordinates(theta, phi),
        v = [xyz.x, xyz.y, xyz.z],
        s = stateAmplitudes(theta, phi);
      const state = [c(s.alpha), c(s.betaReal, s.betaImag)],
        out = matrices[g].map((row) =>
          add(mul(row[0], state[0]), mul(row[1], state[1])),
        );
      const [a, b] = out;
      const coherence = mul(c(a[0], -a[1]), b),
        expected = [
          2 * coherence[0],
          2 * coherence[1],
          a[0] ** 2 + a[1] ** 2 - b[0] ** 2 - b[1] ** 2,
        ];
      vector(rotate(v, gates[g].axis, gates[g].angle), expected);
      for (let t = 0; t <= 1; t += 0.1)
        near(Math.hypot(...rotate(v, gates[g].axis, gates[g].angle * t)), 1);
    }
  });
test("all preset transitions including antipodes preserve surface and reach endpoint", () => {
  for (const a of Object.values(presets))
    for (const b of Object.values(presets)) {
      const p = preparation(a, b);
      vector(rotate(a, p.axis, p.angle), b);
      near(Math.hypot(...rotate(a, p.axis, p.angle * 0.5)), 1);
    }
});
test("H → Z → H maps north to south with unchanged probability during Z", () => {
  let v = presets["0"];
  v = rotate(v, gates.H.axis, gates.H.angle);
  near(v[2], 0);
  v = rotate(v, gates.Z.axis, gates.Z.angle);
  near(v[2], 0);
  v = rotate(v, gates.H.axis, gates.H.angle);
  vector(v, presets["1"]);
});
test("Born probabilities and roundtrip angles", () => {
  for (const v of Object.values(presets)) {
    const a = angles(v),
      xyz = blochCoordinates(a.theta, a.phi);
    vector(v, [xyz.x, xyz.y, xyz.z]);
    near(measurementProbabilities(a.theta).p0, (1 + v[2]) / 2);
  }
});
test("measurement uses independent samples and exact poles", () => {
  assert.equal(
    measure(presets["0"], () => 0.999),
    0,
  );
  assert.equal(
    measure(presets["1"], () => 0),
    1,
  );
  assert.equal(
    measure(presets["+"], () => 0.49),
    0,
  );
  assert.equal(
    measure(presets["+"], () => 0.51),
    1,
  );
  let n = 0,
    zeros = 0;
  for (let i = 0; i < 1000; i++)
    zeros += measure(presets["+"], () => n++ / 1000) === 0;
  assert.equal(zeros, 500);
});

import { progress } from "../state.js";
test("animation timestamps before input are clamped, with deterministic endpoint", () => {
  near(progress(99, 100, 3000), 0);
  near(progress(1600, 100, 3000), 0.5);
  near(progress(3200, 100, 3000), 1);
  near(progress(99, 100, 0), 1);
});
