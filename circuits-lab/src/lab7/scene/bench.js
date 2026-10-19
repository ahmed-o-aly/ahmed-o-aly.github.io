import * as THREE from "three";
import { mm, PITCH, SIGNAL, SURFACE } from "../design/tokens.js";
import { Panel, legend, micro, figure } from "../hardware/panel.js";
import { BENCH } from "./room.js";
import { terminalsFor } from "../sim/circuit.js";

/**
 * Everything standing on the benchtop, placed from the design system's BenchLayout.
 *
 * Source on the left, measurement on the right, the board the student works on
 * front-centre. Signal then flows left to right across the bench, the same
 * direction it flows in the schematic, and leads stop crossing each other — which
 * is the brief's "direct, non-crossing wire paths" solved by arrangement rather
 * than by routing tricks.
 */

const TOP = BENCH.height;

/** Positions in metres from bench centre; z is positive toward the student. */
/**
 * Where everything sits, as an offset on one segment of the U. Source on the left
 * wing, measurement on the right, and the board the student actually builds on
 * directly in front of them — all of it inside arm's reach from one spot.
 */
export const LAYOUT = Object.freeze({
  supply: { segment: "left", x: -0.16, z: -0.06 },
  generator: { segment: "left", x: 0.16, z: -0.06 },
  scope: { segment: "right", x: -0.16, z: -0.06 },
  meter: { segment: "right", x: 0.16, z: -0.06 },
  board: { segment: "centre", x: 0, z: 0.14 },
  rin: { segment: "centre", x: -0.3, z: 0.12 },
  rf: { segment: "centre", x: -0.3, z: -0.06 },
  rin2: { segment: "centre", x: 0.3, z: 0.12 },
  rf2: { segment: "centre", x: 0.3, z: -0.06 },
});

/**
 * Where each of the 741's pins can actually be wired: the breadboard hole one row
 * out from the pin, which is how a DIP is wired on a real board. The package
 * stays 9.8 x 6.4 mm and the labels live in the floating callout.
 */
const PIN_HOLES = Object.freeze({
  "u1.2": [-1.27, -6.35],
  "u1.3": [1.27, -6.35],
  "u1.4": [3.81, -6.35],
  "u1.6": [1.27, 6.35],
  "u1.7": [-1.27, 6.35],
});

export function createBench({ scene, parts, materials, register, segments }) {
  const group = new THREE.Group();
  group.name = "benchtop";
  scene.add(group);
  /** Attach to a bench segment so a wing's angle applies automatically. */
  const on = (spot) => segments.get(spot.segment) ?? group;
  const terminals = new Map();
  const modules = new Map();

  const addTerminal = (object, id) => {
    object.userData = { ...object.userData, kind: "terminal", id };
    register(object, object.userData);
    terminals.set(id, object);
  };

  // ---- breadboard, the 741, and the common rail --------------------------
  const board = parts.breadboard();
  board.position.set(LAYOUT.board.x, TOP, LAYOUT.board.z);
  on(LAYOUT.board).add(board);
  const surfaceY = board.userData.surfaceY;

  const chip = parts.dip8();
  chip.rotation.x = -Math.PI / 2;
  chip.position.set(LAYOUT.board.x, TOP + surfaceY, LAYOUT.board.z);
  on(LAYOUT.board).add(chip);

  /** A breadboard tie point used as a connection target. */
  const holeTarget = (id, xMM, zMM, color) => {
    const socket = parts.jack(color, { radius: mm(2.6) });
    socket.rotation.x = -Math.PI / 2;
    socket.position.set(LAYOUT.board.x + mm(xMM), TOP + surfaceY, LAYOUT.board.z - mm(zMM));
    on(LAYOUT.board).add(socket);
    addTerminal(socket, id);
    return socket;
  };

  for (const [id, [x, y]] of Object.entries(PIN_HOLES)) {
    const role = id === "u1.7" ? SIGNAL.supplyPos : id === "u1.4" ? SIGNAL.supplyNeg : id === "u1.6" ? SIGNAL.output : SIGNAL.input;
    holeTarget(id, x, -y, role);
  }
  holeTarget("board.gnd", -52, 22, SIGNAL.ground);

  // ---- adjustable resistors ----------------------------------------------
  // Potentiometer modules with live values, which is the brief's item 3.
  function resistorModule(id, name, position) {
    const module = new THREE.Group();
    module.position.set(position.x, TOP, position.z);
    on(position).add(module);

    const widthMM = 70;
    const depthMM = 58;
    const body = new THREE.Mesh(parts.box(mm(widthMM), mm(26), mm(depthMM), mm(2)), materials.abs());
    body.position.y = mm(13);
    body.castShadow = true;
    body.receiveShadow = true;
    module.add(body);

    // The value is printed on the module, upright, so it stays readable as the
    // knob turns — the design system's rule for live component values.
    const panel = new Panel(widthMM, 20, (c, w, h, state = {}) => {
      c.fillStyle = SURFACE.panel;
      c.fillRect(0, 0, w, h);
      legend(c, state.name ?? name, 6, 13, { align: "left" });
      legend(c, `${figure((state.ohms ?? 10000) / 1000, 1)} kΩ`, w - 6, 13, { align: "right", color: SURFACE.readoutPrimary });
    });
    const label = new THREE.Mesh(parts.plane(mm(widthMM), mm(20)), materials.printed(panel.texture));
    label.position.set(0, mm(26.1), mm(-15));
    label.rotation.x = -Math.PI / 2;
    module.add(label);

    // The component itself, so a student can SEE what they are adjusting.
    const part = parts.resistor(10000);
    part.position.set(0, mm(34), mm(2));
    module.add(part);
    for (const side of [-1, 1]) {
      const post = new THREE.Mesh(parts.cylinder(mm(1), mm(1.4), mm(9), 10), materials.plated());
      post.position.set(side * mm(18), mm(30), mm(2));
      module.add(post);
    }

    const knob = parts.knob({ radius: mm(11) });
    knob.rotation.x = -Math.PI / 2;
    knob.position.set(0, mm(26), mm(-15));
    module.add(knob);
    knob.userData = { ...knob.userData, kind: "knob", id, control: { id, kind: "resistor" } };
    register(knob, knob.userData);

    const a = parts.jack(SIGNAL.feedback, { radius: mm(4.2) });
    a.rotation.x = -Math.PI / 2;
    a.position.set(mm(-21), mm(26), mm(19));
    module.add(a);
    addTerminal(a, `${id}.a`);

    const b = parts.jack(SIGNAL.feedback, { radius: mm(4.2) });
    b.rotation.x = -Math.PI / 2;
    b.position.set(mm(21), mm(26), mm(19));
    module.add(b);
    addTerminal(b, `${id}.b`);

    modules.set(id, { group: module, panel, knob, name, part });
    return module;
  }

  resistorModule("rin", "Rin", LAYOUT.rin);
  resistorModule("rf", "Rf", LAYOUT.rf);
  resistorModule("rin2", "Rin2", LAYOUT.rin2);
  resistorModule("rf2", "Rf2", LAYOUT.rf2);

  /** Instruments are placed by the same table, after they are built. */
  function placeInstrument(entry, spot) {
    entry.group.position.set(spot.x, TOP, spot.z);
    on(spot).add(entry.group);
  }

  /**
   * A terminal a configuration does not use is absent, not greyed out: the design
   * system forbids showing a socket that cannot be connected.
   */
  function applyConfiguration(configuration) {
    const used = new Set(terminalsFor(configuration));
    for (const [id, object] of terminals) {
      const visible = used.has(id) || id.startsWith("meter.") || id.startsWith("scope.");
      object.visible = visible;
    }
    for (const [id, module] of modules) {
      module.group.visible = used.has(`${id}.a`);
    }
  }

  return {
    group,
    terminals,
    modules,
    board,
    chip,
    placeInstrument,
    applyConfiguration,
    /** World position of a terminal's contact point, for routing a lead to it. */
    contactOf(id) {
      const object = terminals.get(id);
      if (!object) return null;
      const point = new THREE.Vector3(0, 0, object.userData.contactOffset ?? mm(3));
      return object.localToWorld(point);
    },
    update(state) {
      for (const [id, module] of modules) {
        module.panel.paint({ ohms: state.resistors[id], name: module.name });
        // The bands are read off the value, so they have to follow it.
        if (module.ohms !== state.resistors[id]) {
          module.ohms = state.resistors[id];
          const replacement = parts.resistor(state.resistors[id]);
          replacement.position.copy(module.part.position);
          module.group.remove(module.part);
          module.group.add(replacement);
          module.part = replacement;
        }
      }
    },
    dispose() {
      for (const module of modules.values()) module.panel.dispose();
      group.removeFromParent();
    },
  };
}
