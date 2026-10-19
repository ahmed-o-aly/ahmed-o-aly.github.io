import * as THREE from "three";
import { mm } from "../design/tokens.js";

/**
 * Holding, carrying and plugging in a lead.
 *
 * This is the design system's HeldLead spec as code, and it is shared by the
 * mouse and the controllers so a student who learns the bench on a laptop has
 * learned the headset.
 *
 * The rule it exists to enforce: THE PLUG IS WHERE THE HAND IS, EVERY FRAME.
 * Proximity to a socket lights that socket and nothing else — it never moves the
 * plug, because the moment a plug is pulled out of the student's control the
 * hardware stops feeling real. The only automatic motion in the whole interaction
 * is the 90 ms seat on release, and it is deliberately slow enough to read.
 */

/** Feedback starts here. The plug still does not move. */
export const CAPTURE_RADIUS = mm(25);
/** How long the plug takes to travel the last few millimetres, on release. */
export const SEAT_MS = 90;

const easeOut = (t) => 1 - (1 - t) ** 3;

export function createManipulator({ contactOf, candidates, onConnect, onDrop, onHighlight, onHaptic = () => {} }) {
  /** @type {null | {kind, lead, end, terminal, point, from, colour}} */
  let grip = null;
  let seating = null;
  let lastTarget = null;

  /** The nearest connectable socket to a point, or null. Never moves anything. */
  function nearest(point, exclude = []) {
    let best = null;
    let bestDistance = CAPTURE_RADIUS;
    for (const id of candidates()) {
      if (exclude.includes(id)) continue;
      const contact = contactOf(id);
      if (!contact) continue;
      const distance = contact.distanceTo(point);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = { id, contact, distance };
      }
    }
    return best;
  }

  /** Pick up an existing lead's plug. The contact opens immediately. */
  function grabLead({ lead, end, from, to, point, colour }) {
    grip = { kind: "lead", lead, end, point: point.clone(), from, to, colour };
    onHaptic(0.25, 15);
    return grip;
  }

  /** Draw a fresh lead out of a socket. */
  function drawFrom({ terminal, point, colour }) {
    grip = { kind: "draw", terminal, point: point.clone(), colour };
    onHaptic(0.25, 15);
    return grip;
  }

  /**
   * Carry. The plug goes exactly where it is put; the only thing proximity does
   * is light a socket and tick the controller once on entry.
   */
  function moveTo(point) {
    if (!grip) return null;
    grip.point.copy(point);
    const exclude = grip.kind === "draw" ? [grip.terminal] : [grip.end === 0 ? grip.to : grip.from];
    const target = nearest(grip.point, exclude.filter(Boolean));
    if (target?.id !== lastTarget) {
      lastTarget = target?.id ?? null;
      if (target) onHaptic(0.4, 20);
      onHighlight(target?.id ?? null, grip);
    }
    grip.target = target;
    return grip;
  }

  /**
   * Let go. Inside the capture radius the plug travels the last few millimetres
   * into the socket over 90 ms; outside it, the lead is simply dropped where the
   * hand left it.
   */
  function release() {
    if (!grip) return null;
    const held = grip;
    grip = null;
    lastTarget = null;
    onHighlight(null, null);

    if (!held.target) {
      onDrop(held, held.point.clone());
      return null;
    }
    seating = {
      held,
      from: held.point.clone(),
      to: held.target.contact.clone(),
      terminal: held.target.id,
      elapsed: 0,
    };
    return seating;
  }

  /** Advance the seat animation. Returns the plug's current point while seating. */
  function update(deltaMS) {
    if (!seating) return null;
    seating.elapsed += deltaMS;
    const t = Math.min(1, seating.elapsed / SEAT_MS);
    const point = seating.from.clone().lerp(seating.to, easeOut(t));
    if (t >= 1) {
      const finished = seating;
      seating = null;
      onHaptic(0.7, 30);
      onConnect(finished.held, finished.terminal);
      return null;
    }
    return { ...seating.held, point, seating: true };
  }

  function cancel() {
    if (grip) {
      onHighlight(null, null);
      const held = grip;
      grip = null;
      lastTarget = null;
      return held;
    }
    return null;
  }

  return {
    grabLead,
    drawFrom,
    moveTo,
    release,
    update,
    cancel,
    nearest,
    get held() {
      return grip;
    },
    get seating() {
      return seating;
    },
    get active() {
      return !!grip || !!seating;
    },
  };
}
