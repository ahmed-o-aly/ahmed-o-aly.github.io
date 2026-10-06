import { test } from "node:test";
import assert from "node:assert/strict";
import { bases, probability, sample, formatProbability } from "../learning.js";
import { angles, presets, rotate, gates } from "../state.js";
import { formatState, stateAmplitudes } from "../quantum-state.js";
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9);
test("probability formatting does not invent impossible outcomes near poles", () => {
  assert.equal(formatProbability(0), "0%");
  assert.equal(formatProbability(1), "100%");
  assert.equal(formatProbability(0.5), "50%");
  assert.equal(formatProbability(0.75), "75%");
  assert.equal(formatProbability(Math.sin((4 * Math.PI) / 180) ** 2), "≈0.49%");
  assert.equal(formatProbability(1 - Math.sin((4 * Math.PI) / 180) ** 2), "≈99.51%");
  assert.equal(formatProbability(1e-7), "<0.01%");
  assert.equal(formatProbability(1 - 1e-7), ">99.99%");
});
test("pole ket and phase are canonical; relative phase away from poles remains", () => {
  for (const g of ["X", "Y"]) {
    const a = angles(rotate(presets["0"], gates[g].axis, gates[g].angle));
    assert.equal(a.phi, 0);
    assert.equal(formatState(a.theta, a.phi), "|1⟩");
  }
  assert.equal(formatState(Math.PI, 4.712), "|1⟩");
  const plusI = stateAmplitudes(Math.PI / 2, Math.PI / 2);
  near(plusI.betaReal, 0);
  near(plusI.betaImag, Math.SQRT1_2);
  assert.match(formatState(Math.PI / 2, Math.PI / 2), /≈.*1.571/);
});
test("all measurement bases obey projection Born probabilities and sample rates", () => {
  for (const [b, n] of Object.entries(bases)) {
    near(probability(n, b), 1);
    near(
      probability(
        n.map((x) => -x),
        b
      ),
      0
    );
    for (const v of Object.values(presets)) {
      const p = probability(v, b);
      let count = 0;
      for (let i = 0; i < 1000; i++) count += sample(v, b, () => (i + 0.5) / 1000) === 0;
      near(count / 1000, p);
    }
  }
  near(probability([Math.sqrt(0.75), 0, 0.5], "Z"), 0.75);
});
test("basis projection agrees with independent complex-amplitude overlaps", () => {
  for (let i = 1; i <= 200; i++) {
    const theta = (Math.PI * i) / 201,
      phi = i * 2.399963229728653;
    const a = Math.cos(theta / 2),
      br = Math.sin(theta / 2) * Math.cos(phi),
      bi = Math.sin(theta / 2) * Math.sin(phi);
    const v = [2 * a * br, 2 * a * bi, a * a - br * br - bi * bi];
    near(probability(v, "Z"), a * a);
    near(probability(v, "X"), ((a + br) ** 2 + bi * bi) / 2);
    near(probability(v, "Y"), ((a + bi) ** 2 + br * br) / 2);
  }
});
