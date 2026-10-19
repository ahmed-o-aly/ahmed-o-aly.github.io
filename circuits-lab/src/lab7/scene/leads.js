import * as THREE from "three";
import { mm, SIGNAL } from "../design/tokens.js";
import { TERMINALS, PROBES } from "../sim/circuit.js";

/**
 * Leads, and the geometry that makes holding one feel real.
 *
 * The curve is SOLVED from its two endpoints every frame it moves. Slack becomes
 * sag; reach past the lead's natural length and it goes taut, the curve
 * straightens and the plug stops at full extension. Nothing here stores a preset
 * path, and nothing re-routes a lead after the student has released it — both are
 * explicitly forbidden by the design system's HeldLead rules.
 */

/** A lead is a real length of wire, not an elastic band. */
export const LEAD_LENGTH = 0.62;
const MAX_SAG = 0.14;
const SEGMENTS = 28;
const RADIUS = mm(2.2);

/** A lead's colour is decided by what it CARRIES, not by where it starts. */
export function colourFor(from, to) {
  const roles = [TERMINALS[from]?.role ?? PROBES[from]?.role, TERMINALS[to]?.role ?? PROBES[to]?.role];
  for (const role of ["supplyPos", "supplyNeg", "feedback", "output", "inputB", "input"]) {
    if (roles.includes(role)) return SIGNAL[role];
  }
  return SIGNAL.ground;
}

/**
 * The hanging curve between two points.
 *
 * `taut` is true when the span has used up the wire, which the renderer shows by
 * straightening the curve and shifting the jacket — a student discovers the lead
 * is too short the way they would at a real bench.
 */
export function solve(a, b, length = LEAD_LENGTH) {
  const span = a.distanceTo(b);
  const slack = Math.max(0, length - span);
  const sag = Math.min(MAX_SAG, slack * 0.42);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.y -= sag;
  // Two interior controls give a rope-like belly rather than a single arc.
  const first = a.clone().lerp(mid, 0.55);
  const second = b.clone().lerp(mid, 0.55);
  first.y -= sag * 0.25;
  second.y -= sag * 0.25;
  return {
    curve: new THREE.CatmullRomCurve3([a.clone(), first, mid, second, b.clone()], false, "centripetal", 0.4),
    taut: span > length - 0.02,
    span,
  };
}

export function createLeads({ scene, parts, materials }) {
  const group = new THREE.Group();
  group.name = "leads";
  scene.add(group);
  const meshes = [];

  const plugGeometry = parts.cylinder(mm(3.4), mm(4), mm(16), 14);
  const shankGeometry = parts.cylinder(mm(1.9), mm(1.9), mm(11), 10);

  function plug(colour) {
    const node = new THREE.Group();
    const body = new THREE.Mesh(plugGeometry, materials.insulator(colour));
    body.castShadow = true;
    node.add(body);
    const shank = new THREE.Mesh(shankGeometry, materials.plated());
    shank.position.y = mm(-13);
    node.add(shank);
    return node;
  }

  /** Aim a plug along the curve so it enters its socket nose-first. */
  function aim(node, curve, atStart) {
    const t = atStart ? 0 : 1;
    const point = curve.getPoint(t);
    const tangent = curve.getTangent(t).multiplyScalar(atStart ? 1 : -1);
    node.position.copy(point).addScaledVector(tangent, mm(13));
    node.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent.clone().normalize());
  }

  function makeLead(colour) {
    const node = new THREE.Group();
    const tube = new THREE.Mesh(new THREE.BufferGeometry(), materials.rubber(colour));
    tube.castShadow = true;
    node.add(tube);
    const a = plug(colour);
    const b = plug(colour);
    node.add(a, b);
    group.add(node);
    return { node, tube, a, b, colour };
  }

  function shape(entry, from, to) {
    const { curve, taut } = solve(from, to);
    entry.tube.geometry.dispose();
    entry.tube.geometry = new THREE.TubeGeometry(curve, SEGMENTS, RADIUS, 7, false);
    // A strained lead visibly changes tint rather than silently stretching.
    entry.tube.material = materials.rubber(taut ? "#6b4a1f" : entry.colour);
    aim(entry.a, curve, true);
    aim(entry.b, curve, false);
    entry.curve = curve;
    entry.taut = taut;
  }

  /**
   * Rebuild from state. A lead the student is holding is drawn to wherever their
   * hand is, not to its socket.
   */
  function sync(leads, contactOf, held) {
    while (meshes.length > leads.length) {
      const extra = meshes.pop();
      extra.tube.geometry.dispose();
      extra.node.removeFromParent();
    }
    leads.forEach((lead, index) => {
      const colour = colourFor(lead.from, lead.to);
      if (!meshes[index]) meshes[index] = makeLead(colour);
      const entry = meshes[index];
      if (entry.colour !== colour) {
        entry.colour = colour;
        entry.a.children[0].material = materials.insulator(colour);
        entry.b.children[0].material = materials.insulator(colour);
      }
      const grip = held && held.lead === index ? held : null;
      const from = grip?.end === 0 ? grip.point : contactOf(lead.from);
      const to = grip?.end === 1 ? grip.point : contactOf(lead.to);
      if (!from || !to) {
        entry.node.visible = false;
        return;
      }
      entry.node.visible = true;
      shape(entry, from, to);
    });
  }

  /** A lead being drawn from a socket that has not reached anywhere yet. */
  let drawing = null;
  function draw(fromPoint, toPoint, colour) {
    if (!drawing) drawing = makeLead(colour);
    drawing.node.visible = true;
    if (drawing.colour !== colour) {
      drawing.colour = colour;
      drawing.a.children[0].material = materials.insulator(colour);
      drawing.b.children[0].material = materials.insulator(colour);
    }
    shape(drawing, fromPoint, toPoint);
  }
  function clearDrawing() {
    if (drawing) drawing.node.visible = false;
  }

  return {
    group,
    sync,
    draw,
    clearDrawing,
    dispose() {
      for (const entry of meshes) entry.tube.geometry.dispose();
      if (drawing) drawing.tube.geometry.dispose();
      group.removeFromParent();
    },
  };
}
