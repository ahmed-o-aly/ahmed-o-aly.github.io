import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createExperiment, circuit, CONFIGURATIONS, selectConfiguration } from "../src/amplifier-experiment.js";
import { POSITIONS, wireRoute } from "../src/amplifier-scene.js";

test("inverting sockets cover every electrical terminal and preserve actual DIP pin relationships", () => {
  const s = createExperiment();
  for (const config of CONFIGURATIONS) {
    selectConfiguration(s, config);
    for (const p of circuit(s).pins) assert.ok(POSITIONS[p.id], `${config}: ${p.id}`);
  }
  assert.ok(POSITIONS["op-"][1] > POSITIONS["op+"][1]);
  assert.ok(POSITIONS["op+"][1] > POSITIONS.vn[1]);
  assert.ok(POSITIONS.vp[1] > POSITIONS.out[1]);
  assert.ok(POSITIONS.vp[0] > POSITIONS["op-"][0]);
});
test("reference jumpers preserve endpoints and leave the chip face clear", () => {
  for (const configuration of CONFIGURATIONS) {
    const s = createExperiment();
    selectConfiguration(s, configuration);
    for (const [a, b] of circuit(s).wires) {
      const route = wireRoute(a, b, 0, configuration);
      if (a !== "gnd") assert.deepEqual(route[0].slice(0, 2), POSITIONS[a]);
      else assert.equal(route[0][1], -2.2);
      if (b !== "gnd") assert.deepEqual(route.at(-1).slice(0, 2), POSITIONS[b]);
      else assert.equal(route.at(-1)[1], -2.2);
      const curve = new THREE.CatmullRomCurve3(
        route.map((p) => new THREE.Vector3(...p)),
        false,
        "centripetal",
        0.15
      );
      for (const p of curve.getPoints(160)) assert.ok(!(p.x > -0.825 && p.x < 0.625 && p.y > -1.58 && p.y < 0.48), `${a} → ${b} crosses chip face`);
    }
  }
});
test("wrong lead routes retain the students actual endpoints and do not rewrite them", () => {
  const route = wireRoute("signal+", "out");
  assert.deepEqual(route[0].slice(0, 2), POSITIONS["signal+"]);
  assert.deepEqual(route.at(-1).slice(0, 2), POSITIONS.out);
});
