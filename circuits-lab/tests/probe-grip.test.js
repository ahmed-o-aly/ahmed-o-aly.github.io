import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createDirectInteraction, probeGripPose } from "../src/interaction.js";

const v = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const nearVector = (actual, expected) => assert.ok(actual.distanceTo(expected) < 1e-9, `${actual.toArray()} != ${expected.toArray()}`);
const orientation = (x, y, z) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));

test("a newly gripped probe points down regardless of the controller's pickup pose", () => {
  const hand = v(0.4, 1.08, -0.7);
  for (const pickup of [orientation(0, 0, 0), orientation(1.1, -1.6, 0.8), orientation(-0.7, 2.2, -1.3), orientation(Math.PI, 0.4, 0)]) {
    const pose = probeGripPose(hand, pickup, pickup, 0.168);
    nearVector(v(0, -1, 0).applyQuaternion(pose.quaternion), v(0, -1, 0));
    nearVector(pose.position, hand.clone().add(v(0, -0.1, 0)));
    nearVector(v(0, 0.1, 0).applyQuaternion(pose.quaternion).add(pose.position), hand);
  }
});

test("subsequent wrist rotation turns the probe around the held handle instead of resetting it upright", () => {
  const pickup = orientation(0.6, 1.2, -0.4);
  const wristTurn = new THREE.Quaternion().setFromAxisAngle(v(1, 0, 0), Math.PI / 2);
  const controller = wristTurn.clone().multiply(pickup);
  const hand = v(-0.2, 1.03, -0.5);
  const pose = probeGripPose(hand, controller, pickup, 0.168);
  nearVector(v(0, -1, 0).applyQuaternion(pose.quaternion), v(0, 0, -1));
  nearVector(v(0, 0.1, 0).applyQuaternion(pose.quaternion).add(pose.position), hand);
  nearVector(pose.position, hand.clone().add(v(0, 0, -0.1)));
  const regripped = probeGripPose(hand, controller, controller, 0.168);
  nearVector(v(0, -1, 0).applyQuaternion(regripped.quaternion), v(0, -1, 0));
});

test("short ground clips use their own handle length and keep the same grip anchor during compound rotation", () => {
  const hand = v(0.5, 1.2, -0.6),
    pickup = orientation(0.7, -0.9, 1.4);
  const turn = orientation(-0.8, 0.5, 0.2),
    controller = turn.clone().multiply(pickup);
  const pose = probeGripPose(hand, controller, pickup, 0.053);
  nearVector(
    v(0, 0.053 * 0.6, 0)
      .applyQuaternion(pose.quaternion)
      .add(pose.position),
    hand
  );
  nearVector(v(0, -1, 0).applyQuaternion(pose.quaternion), v(0, -1, 0).applyQuaternion(turn));
  nearVector(hand, v(0.5, 1.2, -0.6));
  assert.ok(pickup.angleTo(orientation(0.7, -0.9, 1.4)) < 1e-7, "The stored pickup pose must not be mutated.");
});

test("release connects the calibrated metal tip, never the controller or the handle", () => {
  const pickup = orientation(0.5, -1.3, 0.2),
    tipContact = v(0.25, 0.88, -0.6);
  const hand = tipContact.clone().add(v(0, 0.1, 0));
  const contacts = [
    { id: "tip-contact", position: tipContact },
    { id: "handle-contact", position: hand },
  ];
  const connections = [];
  const engine = createDirectInteraction({ getTerminals: () => contacts, onProbe: (channel, id) => connections.push([channel, id]) });
  engine.begin("right", { kind: "probe", channel: "red", id: "red" });
  const pose = probeGripPose(hand, pickup, pickup, 0.168);
  engine.move("right", pose);
  assert.equal(engine.end("right", pose).terminal, "tip-contact");
  assert.deepEqual(connections, [
    ["red", null],
    ["red", "tip-contact"],
  ]);
});
