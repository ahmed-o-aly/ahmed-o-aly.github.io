import { test } from "node:test";
import assert from "node:assert/strict";
import { rotationPath } from "../trajectory.js";
import { gates, presets, rotate } from "../state.js";
import { GateSequence } from "../sequence.js";
const near = (a, b) => a.forEach((x, i) => assert.ok(Math.abs(x - b[i]) < 1e-9));
test("all gate paths retain exact start/end and pure-state surface at every sample", () => {
  for (const from of Object.values(presets))
    for (const gate of Object.values(gates)) {
      const points = rotationPath(from, gate.axis, gate.angle);
      assert.equal(points.length, 71);
      near(points[0], from);
      near(points.at(-1), rotate(from, gate.axis, gate.angle));
      points.forEach((p) => assert.ok(Math.abs(Math.hypot(...p) - 1) < 1e-9));
      near(rotationPath(from, gate.axis, gate.angle, 0.4).at(-1), rotate(from, gate.axis, gate.angle * 0.4));
    }
});
test("eight chronological gate segments connect only at correct rotation endpoints", () => {
  const program = ["H", "S", "T", "X", "Y", "Z", "H", "T"];
  let v = [...presets["0"]];
  const paths = program.map((g) => {
    const path = rotationPath(v, gates[g].axis, gates[g].angle);
    v = path.at(-1);
    return path;
  });
  for (let i = 1; i < paths.length; i++) near(paths[i - 1].at(-1), paths[i][0]);
  const s = new GateSequence();
  program.forEach((g) => s.append(g, presets["0"]));
  near(v, s.expected());
  assert.equal(new GateSequence().append("MZ", v), false);
});
