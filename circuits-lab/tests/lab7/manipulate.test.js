import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createManipulator, CAPTURE_RADIUS, SEAT_MS } from "../../src/lab7/xr/manipulate.js";
import { solve, LEAD_LENGTH, colourFor } from "../../src/lab7/scene/leads.js";
import { SIGNAL } from "../../src/lab7/design/tokens.js";

const at = (x, y, z) => new THREE.Vector3(x, y, z);

/** A bench with two sockets a comfortable distance apart. */
function rig() {
  const sockets = { "a.1": at(0, 1, 0), "b.1": at(0.3, 1, 0) };
  const events = { connected: [], dropped: [], highlights: [], haptics: 0 };
  const manipulator = createManipulator({
    contactOf: (id) => sockets[id]?.clone() ?? null,
    candidates: () => Object.keys(sockets),
    onConnect: (held, terminal) => events.connected.push({ held, terminal }),
    onDrop: (held, point) => events.dropped.push({ held, point: point.clone() }),
    onHighlight: (id) => events.highlights.push(id),
    onHaptic: () => (events.haptics += 1),
  });
  return { manipulator, sockets, events };
}

test("a carried plug sits exactly where the hand is, never nudged toward a socket", () => {
  const { manipulator } = rig();
  manipulator.drawFrom({ terminal: "a.1", point: at(0, 1, 0), colour: SIGNAL.input });
  for (const target of [at(0.1, 1.2, 0.1), at(0.2, 1.05, 0), at(0.29, 1.001, 0)]) {
    const grip = manipulator.moveTo(target);
    assert.equal(grip.point.distanceTo(target), 0, "the plug is at the hand, to the millimetre");
  }
});

test("entering the capture radius lights a socket and moves nothing", () => {
  const { manipulator, events } = rig();
  manipulator.drawFrom({ terminal: "a.1", point: at(0, 1, 0), colour: SIGNAL.input });

  const outside = at(0.3 - CAPTURE_RADIUS * 2, 1, 0);
  manipulator.moveTo(outside);
  assert.equal(manipulator.held.target, null, "nothing highlighted outside the radius");

  const inside = at(0.3 - CAPTURE_RADIUS * 0.5, 1, 0);
  const grip = manipulator.moveTo(inside);
  assert.equal(grip.target.id, "b.1", "the socket lights up");
  assert.equal(grip.point.distanceTo(inside), 0, "and the plug has still not moved");
  assert.ok(events.highlights.includes("b.1"));
});

test("releasing inside the radius seats over 90 ms rather than teleporting", () => {
  const { manipulator, sockets, events } = rig();
  manipulator.drawFrom({ terminal: "a.1", point: at(0, 1, 0), colour: SIGNAL.input });
  const letGo = at(0.3 - CAPTURE_RADIUS * 0.6, 1.004, 0);
  manipulator.moveTo(letGo);
  manipulator.release();

  assert.equal(events.connected.length, 0, "nothing is connected at the moment of release");

  // Part way through, the plug is strictly between where it was let go and the socket.
  const mid = manipulator.update(SEAT_MS / 2);
  assert.ok(mid, "the plug is visibly travelling");
  assert.ok(mid.point.distanceTo(letGo) > 0, "it has left the hand's position");
  assert.ok(mid.point.distanceTo(sockets["b.1"]) > 1e-6, "but has not arrived yet");

  // It commits only when the travel is done.
  assert.equal(manipulator.update(SEAT_MS / 2 + 1), null);
  assert.equal(events.connected.length, 1);
  assert.equal(events.connected[0].terminal, "b.1");
});

test("releasing away from every socket drops the lead exactly where it was let go", () => {
  const { manipulator, events } = rig();
  manipulator.drawFrom({ terminal: "a.1", point: at(0, 1, 0), colour: SIGNAL.input });
  const letGo = at(0.15, 0.98, 0.2);
  manipulator.moveTo(letGo);
  manipulator.release();

  assert.equal(events.connected.length, 0, "a drop never connects anything");
  assert.equal(events.dropped.length, 1);
  assert.equal(events.dropped[0].point.distanceTo(letGo), 0, "it stays put: no spring back, no vanishing");
  assert.equal(manipulator.active, false);
});

test("a plug never returns to the socket it came from", () => {
  const { manipulator } = rig();
  manipulator.drawFrom({ terminal: "a.1", point: at(0, 1, 0), colour: SIGNAL.input });
  const grip = manipulator.moveTo(at(0.001, 1, 0));
  assert.equal(grip.target, null, "its own origin is excluded from capture");
});

test("cancelling discards the gesture and clears the highlight", () => {
  const { manipulator, events } = rig();
  manipulator.drawFrom({ terminal: "a.1", point: at(0, 1, 0), colour: SIGNAL.input });
  manipulator.moveTo(at(0.29, 1, 0));
  const held = manipulator.cancel();
  assert.ok(held);
  assert.equal(manipulator.active, false);
  assert.equal(events.connected.length, 0);
  assert.equal(events.dropped.length, 0);
  assert.equal(events.highlights.at(-1), null);
});

// ---- the cable itself -----------------------------------------------------

test("slack becomes sag, and the curve always reaches both ends", () => {
  const a = at(0, 1, 0);
  const b = at(0.1, 1, 0);
  const { curve, taut } = solve(a, b);
  assert.equal(taut, false);
  assert.ok(curve.getPoint(0).distanceTo(a) < 1e-9, "starts at its socket");
  assert.ok(curve.getPoint(1).distanceTo(b) < 1e-9, "ends at its socket");
  const belly = curve.getPoint(0.5);
  assert.ok(belly.y < a.y - 0.01, "a slack lead hangs");
});

test("a lead reaching past its length goes taut instead of stretching", () => {
  const near = solve(at(0, 1, 0), at(0.2, 1, 0));
  const far = solve(at(0, 1, 0), at(LEAD_LENGTH - 0.005, 1, 0));
  assert.equal(near.taut, false);
  assert.equal(far.taut, true);
  const nearSag = at(0, 1, 0).y - near.curve.getPoint(0.5).y;
  const farSag = at(0, 1, 0).y - far.curve.getPoint(0.5).y;
  assert.ok(farSag < nearSag, "the belly disappears as the wire is used up");
});

test("a lead's colour comes from what it carries, not from where it starts", () => {
  assert.equal(colourFor("supply.pos", "u1.7"), SIGNAL.supplyPos);
  assert.equal(colourFor("u1.4", "supply.neg"), SIGNAL.supplyNeg, "either direction gives the same colour");
  assert.equal(colourFor("rf.a", "u1.2"), SIGNAL.feedback);
  assert.equal(colourFor("u1.6", "rf.b"), SIGNAL.feedback, "feedback outranks the output pin it starts from");
  assert.equal(colourFor("supply.gnd", "board.gnd"), SIGNAL.ground);
});
