import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createDirectInteraction, nearestTerminal, signedTwistAngle, constrainMovement, snapTurnRig, createLocomotion } from "../src/interaction.js";
import { createLab, context, setProbe, measure } from "../src/lab.js";
const v = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const near = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
const nearVector = (a, b) => assert.ok(a.distanceTo(b) < 1e-8, `${a.toArray()} != ${b.toArray()}`);

test("probe contact uses the physical tip position, opens on pickup and changes the real voltage polarity", () => {
  const state = createLab();
  context(state);
  const contacts = [
    { id: "gnd", position: v(0, 1, 0) },
    { id: "loada", position: v(0.12, 1, 0) },
  ];
  let engine;
  const holdDuringCallback = [];
  engine = createDirectInteraction({
    getTerminals: () => contacts,
    onProbe(channel, id) {
      holdDuringCallback.push(!!engine.hold("hand"));
      setProbe(state, channel, id);
    },
  });
  near(measure(state).probeVoltage, 3);
  engine.begin("hand", { kind: "probe", channel: "red", id: "red" }, { position: v(0.12, 1, 0) });
  assert.equal(holdDuringCallback[0], true, "Held state must exist before a synchronous pickup render.");
  assert.equal(measure(state).probeReady, null);
  engine.move("hand", { position: v(0.01, 1.01, 0) });
  assert.equal(engine.end("hand").terminal, "gnd");
  near(measure(state).probeVoltage, 0);
  engine.begin("hand", { kind: "probe", channel: "black", id: "black" }, { position: v(0, 1, 0) });
  engine.end("hand", { position: v(0.115, 1, 0) });
  near(measure(state).probeVoltage, -3);
  // A nearby ray hit would not qualify: the actual tip is 20 cm above both contacts.
  engine.begin("hand", { kind: "probe", channel: "red", id: "red" }, { position: v(0, 1, 0) });
  const loose = engine.end("hand", { position: v(0.12, 1.2, 0) });
  assert.equal(loose.kind, "loose");
  assert.equal(context(state).probes.red, null);
});

test("nearest contact uses world-space Euclidean distance and refuses contacts beyond the snap radius", () => {
  const contacts = [
    { id: "a", position: v(0, 0, 0) },
    { id: "b", position: v(0.03, 0, 0) },
  ];
  assert.equal(nearestTerminal(v(0.023, 0.004, 0), contacts).id, "b");
  assert.equal(nearestTerminal(v(0, 0.056, 0), contacts), null);
  assert.equal(nearestTerminal(v(0, 0.054, 0), contacts).id, "a");
  assert.equal(nearestTerminal(null, contacts), null);
});

test("two controllers cannot own the same probe or dial at once", () => {
  const engine = createDirectInteraction();
  const probe = { kind: "probe", channel: "red", id: "probe-red" };
  assert.equal(engine.begin("left", probe), true);
  assert.equal(engine.begin("right", probe), false);
  assert.equal(engine.begin("left", { ...probe, channel: "black" }), false);
  assert.equal(engine.begin("right", { ...probe, channel: "black" }), true);
  engine.end("left");
  assert.equal(engine.isHeld("probe:red"), false);
  engine.end("right");
  assert.equal(engine.begin("right", probe), true);
});

test("accepted terminal and plug drops capture their visual state immediately before synchronous connection updates", () => {
  for (const kind of ["terminal", "plug"]) {
    const events = [],
      contacts = [
        { id: "a", socket: 0, position: v(0) },
        { id: "b", socket: 3, position: v(0.2) },
      ];
    let displayedLead = { path: [v(0), v(0.1, 0.02), v(0.2)], socket: 3 },
      captured = null,
      expectedHold;
    const engine = createDirectInteraction({
      getTerminals: () => contacts,
      onBeforeConnect(from, terminal, hold) {
        events.push("before");
        assert.equal(hold, expectedHold);
        assert.equal(from, "a");
        assert.equal(terminal, contacts[1], "Pass the exact selected physical terminal, including its socket and position");
        assert.equal(terminal.id, "b");
        assert.equal(terminal.socket, 3);
        assert.equal(terminal.position, contacts[1].position);
        nearVector(hold.position, contacts[1].position);
        captured = displayedLead;
      },
      onConnect(...args) {
        events.push("connect");
        assert.deepEqual(args, ["a", "b"], "Existing connection callback keeps exactly two arguments");
        assert.equal(captured, displayedLead, "Visual capture precedes any synchronous render replacing the cable");
        displayedLead = null;
      },
      onHold(phase, hold) {
        if (phase === "end") {
          events.push("end");
          assert.equal(hold, expectedHold);
        }
      },
    });
    const target = kind === "terminal" ? { kind, id: "a", terminal: "a" } : { kind, id: "plug-a", from: "a", wireIndex: 0 };
    engine.begin("hand", target, { position: v(0) });
    expectedHold = engine.hold("hand");
    assert.deepEqual(engine.end("hand", { position: v(0.2) }), { kind: "connected", terminal: "b" });
    assert.deepEqual(events, ["before", "connect", "end"]);
    assert.equal(captured.socket, 3);
    assert.equal(displayedLead, null);
  }
});

test("pre-connect captures the originating hold when two hands release different leads", () => {
  const contacts = [
      { id: "b", socket: 2, position: v(0.2) },
      { id: "d", socket: 5, position: v(0.6) },
    ],
    captures = [];
  const engine = createDirectInteraction({
    getTerminals: () => contacts,
    onBeforeConnect: (from, terminal, hold) => captures.push({ from, terminal, hold }),
  });
  engine.begin("left", { kind: "terminal", id: "a", terminal: "a" }, { position: v(0) });
  engine.begin("right", { kind: "plug", id: "plug-c", from: "c", wireIndex: 1 }, { position: v(0.4) });
  const left = engine.hold("left"),
    right = engine.hold("right");
  right.visualPath = [v(0.4), v(0.5, 0.1), v(0.6)];
  engine.end("right", { position: v(0.6) });
  assert.equal(engine.hold("left"), left, "The other hand remains active during capture");
  engine.end("left", { position: v(0.2) });
  assert.deepEqual(
    captures.map(({ from, terminal, hold }) => [from, terminal.id, terminal.socket, hold.input]),
    [
      ["c", "d", 5, "right"],
      ["a", "b", 2, "left"],
    ]
  );
  assert.equal(captures[0].terminal, contacts[1]);
  assert.equal(captures[1].terminal, contacts[0]);
  assert.equal(captures[0].hold, right);
  assert.equal(captures[0].hold.visualPath, right.visualPath);
  assert.equal(captures[1].hold, left);
});

test("pre-connect is skipped for cancelled, same-terminal, distant and non-wire drops", () => {
  for (const kind of ["terminal", "plug"]) {
    const events = [],
      contacts = [
        { id: "a", position: v(0) },
        { id: "b", position: v(0.2) },
      ];
    const engine = createDirectInteraction({
      getTerminals: () => contacts,
      onBeforeConnect: () => events.push("before"),
      onConnect: () => events.push("connect"),
    });
    const target = { kind, id: `${kind}-a`, terminal: "a", from: "a" };
    engine.begin("hand", target, { position: v(0) });
    engine.move("hand", { position: v(0.2) });
    engine.cancelAll();
    engine.release("hand");
    engine.begin("hand", target, { position: v(0) });
    engine.end("hand", { position: v(0) });
    engine.begin("hand", target, { position: v(0) });
    engine.end("hand", { position: v(0.2, 0.2) });
    engine.begin("hand", { kind: "probe", id: "red", channel: "red" }, { position: v(0) });
    engine.end("hand", { position: v(0.2) });
    assert.deepEqual(events, []);
  }
});

test("dial detents accumulate wrist turns once and clamp values rather than wrapping", () => {
  const model = { parameters: { rail: 9 }, options: { rail: [5, 9, 12, 15] } },
    events = [];
  const engine = createDirectInteraction({
    getModel: () => model,
    onChange(name, value) {
      model.parameters[name] = value;
      events.push(value);
    },
  });
  engine.begin("hand", { kind: "dial", id: "supply", parameter: "rail", detentRadians: 0.2 });
  engine.move("hand", { turn: 0.08 });
  assert.equal(model.parameters.rail, 9);
  engine.move("hand", { turn: 0.13 });
  assert.equal(model.parameters.rail, 12);
  engine.move("hand", { turn: 0 });
  assert.deepEqual(events, [12]);
  engine.move("hand", { turn: 3 });
  assert.equal(model.parameters.rail, 15);
  engine.move("hand", { turn: 3 });
  assert.deepEqual(events, [12, 15]);
  engine.move("hand", { turn: -20 });
  assert.equal(model.parameters.rail, 5);
});

test("wrist twist extracts rotation about the spindle and ignores a perpendicular swing", () => {
  const spindle = v(0, 0, 1),
    swingAxis = v(1, 0, 0);
  const twist = new THREE.Quaternion().setFromAxisAngle(spindle, 0.4);
  const swing = new THREE.Quaternion().setFromAxisAngle(swingAxis, 0.9);
  near(signedTwistAngle(twist, spindle), 0.4);
  near(signedTwistAngle(swing, spindle), 0);
  near(signedTwistAngle(swing.clone().multiply(twist), spindle), 0.4);
  const orientation = new THREE.Quaternion().setFromAxisAngle(v(0, 1, 0), 0.7);
  const worldAxis = spindle.clone().applyQuaternion(orientation);
  const worldDelta = orientation.clone().multiply(twist).multiply(orientation.clone().invert());
  near(signedTwistAngle(worldDelta, worldAxis), 0.4);
});

test("focus cancellation releases held contacts and requires a fresh released input before grabbing", () => {
  const events = [];
  const engine = createDirectInteraction({ onProbe: (channel, terminal) => events.push([channel, terminal]) });
  const probe = { kind: "probe", channel: "red", id: "red" };
  engine.begin("hand", probe, { position: v(1, 2, 3) });
  engine.cancelAll();
  assert.equal(engine.holds.size, 0);
  assert.equal(engine.begin("hand", probe), false);
  engine.release("hand");
  assert.equal(engine.begin("hand", probe), true);
  assert.ok(events.every(([, pin]) => pin === null));
});

test("movement prevents tunnelling through the table and slides along the table edge", () => {
  const collision = { obstacles: [{ minX: -1, maxX: 1, minZ: -1, maxZ: 1 }], radius: 0.2 };
  const stopped = constrainMovement(v(0, 1.6, 2), v(0, 0, -4), collision);
  assert.ok(stopped.z >= 1.2 - 1e-8);
  near(stopped.y, 1.6);
  const slide = constrainMovement(v(0, 1.6, 1.3), v(0.7, 0, -0.7), collision);
  assert.ok(slide.x > 0.6);
  assert.ok(slide.z >= 1.2 - 1e-8);
  const bounded = constrainMovement(v(0, 1.6, 2), v(10, 0, 10), collision);
  assert.ok(bounded.x <= 3 && bounded.z <= 2.2);
});

test("snap turning rotates around the tracked head instead of swinging its position around the rig origin", () => {
  const rig = new THREE.Group();
  rig.position.set(1, 0, -2);
  rig.rotation.y = 0.4;
  const head = new THREE.Object3D();
  head.position.set(0.35, 1.7, -0.2);
  rig.add(head);
  rig.updateMatrixWorld(true);
  const before = head.getWorldPosition(v());
  snapTurnRig(rig, before, Math.PI / 2);
  nearVector(head.getWorldPosition(v()), before);
  const forward = v(0, 0, -1).applyQuaternion(head.getWorldQuaternion(new THREE.Quaternion()));
  nearVector(forward, v(0, 0, -1).applyAxisAngle(v(0, 1, 0), 0.4 + Math.PI / 2));
});

test("locomotion follows headset yaw, limits frame jumps and rearms only after neutral input on focus return", () => {
  const rig = new THREE.Group(),
    locomotion = createLocomotion({ speed: 1 });
  const pose = { rig, headPosition: v(0, 1.6, 0), headQuaternion: new THREE.Quaternion().setFromAxisAngle(v(0, 1, 0), Math.PI / 2), dt: 1 };
  assert.equal(locomotion.update({ ...pose, left: [0, -1] }), false);
  locomotion.update({ ...pose, left: [0, 0] });
  assert.equal(locomotion.update({ ...pose, left: [0, -1] }), true);
  near(rig.position.x, -0.05);
  near(rig.position.z, 0);
  near(rig.position.y, 0);
  const before = rig.position.clone();
  locomotion.update({ ...pose, enabled: false, left: [0, -1] });
  assert.equal(locomotion.update({ ...pose, enabled: true, left: [0, -1] }), false);
  nearVector(rig.position, before);
  locomotion.update({ ...pose, left: [0, 0] });
  locomotion.update({ ...pose, left: [0, -1] });
  near(rig.position.x, -0.1);
});

test("right-stick turning is latched until the stick returns to neutral", () => {
  const rig = new THREE.Group(),
    locomotion = createLocomotion();
  const pose = { rig, headPosition: v(0, 1.6, 0), headQuaternion: new THREE.Quaternion(), dt: 0.016 };
  locomotion.update(pose);
  locomotion.update({ ...pose, right: 1 });
  const first = rig.quaternion.clone();
  for (let i = 0; i < 5; i++) locomotion.update({ ...pose, right: 1 });
  near(Math.abs(first.dot(rig.quaternion)), 1);
  locomotion.update({ ...pose, right: 0 });
  locomotion.update({ ...pose, right: 1 });
  assert.ok(Math.abs(first.dot(rig.quaternion)) < 0.99);
});

test("a tracked head already inside the table collision can move out but cannot move deeper", () => {
  const collision = { obstacles: [{ minX: -1, maxX: 1, minZ: -1, maxZ: 1 }], radius: 0.2 };
  const start = v(0, 1.6, 1.1);
  const escaped = constrainMovement(start, v(0, 0, 0.4), collision);
  near(escaped.z, 1.5);
  near(escaped.y, start.y);
  const deeper = constrainMovement(start, v(0, 0, -0.4), collision);
  nearVector(deeper, start);
});
