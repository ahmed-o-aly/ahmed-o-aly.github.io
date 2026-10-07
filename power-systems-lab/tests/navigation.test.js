import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { ViewGesture, ComfortNavigation } from "../src/navigation.js";
const near = (a, b) => a.forEach((x, i) => assert.ok(Math.abs(x - b[i]) < 1e-8, `${a} != ${b}`));
const pose = (p, q = new THREE.Quaternion()) => new THREE.Matrix4().compose(new THREE.Vector3(...p), q, new THREE.Vector3(1, 1, 1));
test("one grip preserves offset and moves/rotates view without a jump; release stops motion", () => {
  const root = new THREE.Group();
  root.position.set(0, 1, -2);
  const g = new ViewGesture(root);
  g.begin(0, pose([0, 1, 0]));
  g.update([[0, pose([0, 1, 0])]]);
  near(root.position.toArray(), [0, 1, -2]);
  g.update([[0, pose([1, 2, 0])]]);
  near(root.position.toArray(), [1, 2, -2]);
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
  g.update([[0, pose([1, 2, 0], q)]]);
  near(root.position.toArray(), [-1, 2, 0]);
  g.end(0);
  g.update([[0, pose([10, 10, 10])]]);
  near(root.position.toArray(), [-1, 2, 0]);
});
test("two grips resize with bounds, rebase without jumps, and ignore overlapping hands", () => {
  const root = new THREE.Group();
  root.position.set(0, 1, -2);
  const g = new ViewGesture(root);
  g.begin(0, pose([-1, 1, 0]));
  g.begin(1, pose([1, 1, 0]));
  g.update([
    [0, pose([-2, 1, 0])],
    [1, pose([2, 1, 0])],
  ]);
  assert.equal(root.scale.x, 1.8);
  const previous = root.position.clone();
  g.end(1);
  g.update([[0, pose([-2, 1, 0])]]);
  near(root.position.toArray(), previous.toArray());
  g.clear();
  g.begin(0, pose([0, 1, 0]));
  g.begin(1, pose([0.001, 1, 0]));
  g.update([
    [0, pose([0, 1, 0])],
    [1, pose([0.001, 1, 0])],
  ]);
  near(root.position.toArray(), previous.toArray());
});
test("held sticks continuously translate and turn together, scaled by time and pivoted at head", () => {
  const rig = new THREE.Group(),
    head = new THREE.PerspectiveCamera();
  head.position.set(0.2, 1.5, 0);
  rig.add(head);
  rig.updateMatrixWorld(true);
  const n = new ComfortNavigation();
  n.update(rig, head, [0, -1], 1, 0.02);
  near(rig.position.toArray(), [0, 0, 0]);
  n.update(rig, head, [0, 0], 0, 0.02);
  for (let i = 0; i < 50; i++) n.update(rig, head, [0, -1], 0, 0.02);
  near(rig.position.toArray(), [0, 0, -0.65]);
  const pivot = head.getWorldPosition(new THREE.Vector3());
  for (let i = 0; i < 50; i++) n.update(rig, head, [0, 0], 1, 0.02);
  near(head.getWorldPosition(new THREE.Vector3()).toArray(), pivot.toArray());
  assert.ok(Math.abs(new THREE.Euler().setFromQuaternion(rig.quaternion).y + Math.PI / 3) < 1e-8);
  const before = rig.position.clone(),
    q = rig.quaternion.clone();
  n.update(rig, head, [1, -1], 1, 0.02);
  assert.ok(!before.equals(rig.position));
  assert.ok(!q.equals(rig.quaternion));
  n.update(rig, head, [0, 0], 0, 0.02, false);
  const stopped = rig.position.clone();
  n.update(rig, head, [0, -1], 1, 0.02);
  near(rig.position.toArray(), stopped.toArray());
});
test("navigation speed is frame-rate independent, diagonal bounded, deadzone quiet", () => {
  function travel(frames, input) {
    const rig = new THREE.Group(),
      head = new THREE.PerspectiveCamera();
    rig.add(head);
    const n = new ComfortNavigation();
    n.update(rig, head, [0, 0], 0);
    for (let i = 0; i < frames; i++) n.update(rig, head, input, 0, 1 / frames);
    return rig.position.toArray();
  }
  near(travel(60, [0, -1]), travel(120, [0, -1]));
  const diagonal = travel(60, [1, -1]);
  assert.ok(Math.abs(Math.hypot(...diagonal) - 0.65) < 1e-8);
  near(travel(60, [0.1, 0.1]), [0, 0, 0]);
});
