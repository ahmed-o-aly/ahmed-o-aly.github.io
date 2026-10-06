import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  ViewGesture,
  spherePick,
  ComfortNavigation,
} from "../vr-interaction.js";
const near = (a, b) =>
  a.forEach((x, i) => assert.ok(Math.abs(x - b[i]) < 1e-8, `${a} != ${b}`));
const pose = (p, q = new THREE.Quaternion()) =>
  new THREE.Matrix4().compose(
    new THREE.Vector3(...p),
    q,
    new THREE.Vector3(1, 1, 1),
  );
test("one grip preserves offset and moves/rotates view without a jump; release stops motion", () => {
  const root = new THREE.Group();
  root.position.set(0, 1, -2);
  const g = new ViewGesture(root);
  g.begin(0, pose([0, 1, 0]));
  g.update([[0, pose([0, 1, 0])]]);
  near(root.position.toArray(), [0, 1, -2]);
  g.update([[0, pose([1, 2, 0])]]);
  near(root.position.toArray(), [1, 2, -2]);
  const q = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    Math.PI / 2,
  );
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
test("analytic picking reaches front, back and inside a transformed sphere", () => {
  const root = new THREE.Group();
  root.position.set(1, 2, 3);
  root.scale.setScalar(1.5);
  for (const [origin, direction, expected] of [
    [
      [1, 2, 6],
      [0, 0, -1],
      [1, 2, 4.5],
    ],
    [
      [1, 2, 0],
      [0, 0, 1],
      [1, 2, 1.5],
    ],
    [
      [1, 2, 3],
      [1, 0, 0],
      [2.5, 2, 3],
    ],
  ]) {
    near(
      spherePick(
        new THREE.Ray(
          new THREE.Vector3(...origin),
          new THREE.Vector3(...direction),
        ),
        root,
        1,
      ).toArray(),
      expected,
    );
  }
});
test("navigation requires neutral, steps once per deflection and snap turns about the head", () => {
  const rig = new THREE.Group(),
    head = new THREE.PerspectiveCamera();
  head.position.set(0.2, 1.5, 0);
  rig.add(head);
  rig.updateMatrixWorld(true);
  const n = new ComfortNavigation();
  n.update(rig, head, [0, -1], 0);
  near(rig.position.toArray(), [0, 0, 0]);
  n.update(rig, head, [0, 0], 0);
  n.update(rig, head, [0, -1], 0);
  near(rig.position.toArray(), [0, 0, -0.4]);
  n.update(rig, head, [0, -1], 0);
  near(rig.position.toArray(), [0, 0, -0.4]);
  n.update(rig, head, [0, 0], 0);
  const p = head.getWorldPosition(new THREE.Vector3());
  n.update(rig, head, [0, 0], 1);
  near(head.getWorldPosition(new THREE.Vector3()).toArray(), p.toArray());
  const q = rig.quaternion.clone();
  n.update(rig, head, [0, 0], 1);
  assert.ok(q.equals(rig.quaternion));
  n.update(rig, head, [0, 0], 0, 0, false);
  n.update(rig, head, [0, -1], 0);
  assert.ok(q.equals(rig.quaternion));
});
