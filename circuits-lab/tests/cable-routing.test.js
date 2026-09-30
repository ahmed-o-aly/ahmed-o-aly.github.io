import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { routePatchLeads, routeInstrumentLead } from "../src/cable-routing.js";

const p = (x, z, y = 1.002) => ({ x, y, z });
const samples = (points) =>
  new THREE.CatmullRomCurve3(
    points.map((v) => new THREE.Vector3(v.x, v.y, v.z)),
    false,
    "centripetal"
  ).getPoints(600);
const finite = (points) => points.every((v) => [v.x, v.y, v.z].every(Number.isFinite));

test("patch routes keep exact contacts and are deterministic when wire order changes", () => {
  const connections = [
    { id: "a|b", start: p(-1.1, -0.5), end: p(0.8, 0.5) },
    { id: "c|d", start: p(-1.1, 0.5), end: p(0.8, -0.5) },
    { id: "e|f", start: p(-0.6, -0.7), end: p(0.9, -0.7) },
  ];
  const a = routePatchLeads(connections),
    b = routePatchLeads([...connections].reverse());
  for (const connection of connections) {
    const route = a.get(connection.id);
    assert.deepEqual(route[0], connection.start);
    assert.deepEqual(route.at(-1), connection.end);
    assert.deepEqual(route, b.get(connection.id));
    assert(finite(route));
  }
});

test("interpolated patch cables clear a component footprint and stay above the PCB", () => {
  const obstacle = { minX: -0.32, maxX: 0.32, minZ: -0.24, maxZ: 0.24, top: 1.3 };
  const route = routePatchLeads([{ id: "left|right", start: p(-1.1, 0), end: p(1.1, 0) }], { obstacles: [obstacle] }).get("left|right");
  for (const sample of samples(route)) {
    assert(sample.y - 0.009 > 0.929, "Tube surface stays above PCB, including spline undershoot");
    assert(!(sample.x > obstacle.minX && sample.x < obstacle.maxX && sample.z > obstacle.minZ && sample.z < obstacle.maxZ));
  }
  assert.notDeepEqual({ x: route[0].x, z: route[0].z }, { x: route[1].x, z: route[1].z }, "Plug landing does not double back vertically");
});

test("parallel connections occupy separate lanes instead of lying on one another", () => {
  const a = { id: "a|b", start: p(-1.1, -0.12), end: p(1.1, -0.12) };
  const b = { id: "c|d", start: p(-1.1, 0.12), end: p(1.1, 0.12) };
  const routes = routePatchLeads([a, b]);
  const ca = samples(routes.get(a.id)),
    cb = samples(routes.get(b.id));
  let distance = Infinity;
  for (const pa of ca) for (const pb of cb) distance = Math.min(distance, pa.distanceTo(pb));
  assert(distance > 0.018, "Separate insulated cable surfaces");
});

test("unroutable contacts use visible elevated fallback with vertical departure", () => {
  const start = p(0, 0),
    end = p(0.8, 0.2);
  const obstacle = { minX: -0.5, maxX: 0.5, minZ: -0.5, maxZ: 0.5, top: 1.4 };
  const route = routePatchLeads([{ id: "a|b", start, end }], { obstacles: [obstacle] }).get("a|b");
  assert.deepEqual(route[0], start);
  assert.equal(route[1].x, start.x);
  assert.equal(route[1].z, start.z);
  assert(route[1].y > obstacle.top);
  assert.deepEqual(route.at(-1), end);
  assert(finite(route));
});

test("instrument cables retain anchors and use distinct outer lanes", () => {
  const start = p(-0.85, -0.1, 0.99),
    end = p(0.3, -0.7, 1.04);
  const a = routeInstrumentLead(start, end, { lane: 0, exit: { x: 1, y: 0, z: 0 } });
  const b = routeInstrumentLead(start, end, { lane: 3, exit: { x: 1, y: 0, z: 0 } });
  assert.deepEqual(a[0], start);
  assert.deepEqual(a.at(-1), end);
  assert.deepEqual(b[0], start);
  assert.deepEqual(b.at(-1), end);
  assert(a.some((v) => Math.abs(v.z - (-0.38 + 0.045)) < 1e-6));
  assert(b.some((v) => Math.abs(v.z - (-0.38 + 0.045 + 3 * 0.014)) < 1e-6));
  assert(finite(a) && finite(b));
});

test("ground pigtails connect the real probe handle and clip without a full perimeter loop", () => {
  const start = p(0.2, -0.7, 0.94),
    end = p(0.1, -0.55, 0.91);
  const route = routeInstrumentLead(start, end, { branch: true });
  assert.deepEqual(route[0], start);
  assert.deepEqual(route.at(-1), end);
  assert(route.every((v) => v.x > 0.04 && v.x < 0.26 && v.z >= -0.7 && v.z <= -0.55));
  assert(finite(route));
});

test("default amplifier CH1 ground pigtail clears the Rin case along its interpolated tube", () => {
  const start = { x: -0.512, y: 0.932, z: -0.909 },
    end = { x: 0.129, y: 0.93, z: -0.498 };
  const rin = { minX: -0.349, maxX: -0.169, minZ: -0.741, maxZ: -0.606, top: 1.011 };
  const route = routeInstrumentLead(start, end, { branch: true, obstacles: [rin] });
  assert.deepEqual(route[0], start);
  assert.deepEqual(route.at(-1), end);
  for (const sample of samples(route)) {
    const insideCase =
      sample.x > rin.minX - 0.0019 &&
      sample.x < rin.maxX + 0.0019 &&
      sample.z > rin.minZ - 0.0019 &&
      sample.z < rin.maxZ + 0.0019 &&
      sample.y - 0.0019 < rin.top;
    assert(!insideCase, "Insulated ground cable must not pass through Rin");
    assert(sample.y - 0.0019 > 0.874, "Ground lead stays above the trainer");
  }
  assert(finite(route));
});

test("relocated tilted meter COM lead leaves forward and goes around its own case", () => {
  const start = { x: -0.455, y: 0.881426, z: -0.285878 },
    end = { x: -0.298428, y: 1.03755, z: -0.588779 };
  const transform = new THREE.Matrix4().compose(
    new THREE.Vector3(-0.43, 0.823, -0.3),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.56, 0, 0)),
    new THREE.Vector3(1, 1, 1)
  );
  const box = new THREE.Box3(new THREE.Vector3(-0.055, 0.0055, -0.023), new THREE.Vector3(0.055, 0.2185, 0.023)).applyMatrix4(transform);
  const obstacles = [{ minX: box.min.x, maxX: box.max.x, minZ: box.min.z, maxZ: box.max.z, top: box.max.y }];
  const route = routeInstrumentLead(start, end, { lane: 1, exit: { x: 0, y: 0.531186, z: 0.847255 }, obstacles });
  const inverse = transform.clone().invert();
  assert.deepEqual(route[0], start);
  assert.deepEqual(route.at(-1), end);
  const curve = new THREE.CatmullRomCurve3(
    route.map((v) => new THREE.Vector3(v.x, v.y, v.z)),
    false,
    "centripetal"
  );
  for (const sample of curve.getPoints(1200)) {
    const local = sample.clone().applyMatrix4(inverse);
    const insideCase =
      Math.abs(local.x) < 0.055 + 0.0019 && local.y > 0.0055 - 0.0019 && local.y < 0.2185 + 0.0019 && Math.abs(local.z) < 0.023 + 0.0019;
    assert(!insideCase, "COM cable must clear the tilted meter housing, including insulation radius");
  }
  assert(finite(route));
});
