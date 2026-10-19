import * as THREE from "three";
import { mm, PITCH, SIGNAL, SURFACE, CAP_MM, FONT, font } from "../design/tokens.js";
import { Panel, legend, micro, figure, readout, window_ } from "../hardware/panel.js";
import { terminalsFor } from "../sim/circuit.js";

/**
 * The trainer board: the thing this laboratory is about.
 *
 * This is what the engineer drew in Figure 2 and what every teaching lab uses — a
 * large panel with the 741 in the middle, its pins broken out to proper terminals,
 * Rin and Rf mounted ON the board with their own knobs, Vin and Vout labelled at
 * the edges, and everything printed where it is used. The student wires THIS. The
 * instruments stand around it as context.
 *
 * It is deliberately the largest object on the bench. A 165 mm breadboard between
 * four 250 mm instruments is physically accurate and pedagogically useless: the
 * subject of the experiment was 6 % of the furniture. This board is 420 x 260 mm,
 * raked toward the student, and its components are drawn at twice life size so a
 * DIP-8 and a resistor's colour bands are readable from standing height.
 */

export const BOARD = Object.freeze({
  widthMM: 420,
  heightMM: 260,
  /** Raked toward the student, as a trainer stands on its feet. */
  rake: 0.2,
  /** Components on the board are drawn at this multiple of life size. */
  scale: 2,
  /** The 741 larger still, so the symbol printed on it reads from standing height. */
  chipScale: 3,
});

/**
 * Where everything sits on the board, in millimetres from its centre; x right,
 * y up the raked face. The DIP-8 breakout follows the package: pins 2, 3, 4 along
 * the bottom row left to right, 7 and 6 along the top, exactly as on the chip.
 */
const PLACE = Object.freeze({
  chip: [0, 0],
  "u1.2": [-38, -46],
  "u1.3": [0, -46],
  "u1.4": [38, -46],
  "u1.7": [-20, 46],
  "u1.6": [20, 46],
  // Rin and Rf flank the chip, which is how the schematic reads; the second pair
  // sits below them for the two-input circuits.
  rin: { body: [-112, 8], a: [-142, 8], b: [-82, 8], knob: [-112, 40] },
  rf: { body: [112, 8], a: [82, 8], b: [142, 8], knob: [112, 40] },
  rin2: { body: [-112, -72], a: [-142, -72], b: [-82, -72], knob: [-112, -104] },
  rf2: { body: [112, -72], a: [82, -72], b: [142, -72], knob: [112, -104] },
  // Edge terminals: instrument leads land here and stop.
  "board.vplus": [-150, 110],
  "board.gnd": [-108, 110],
  "board.vminus": [-66, 110],
  "board.vin": [-182, 30],
  "board.vin2": [-182, -42],
  "board.vout": [182, 30],
});

const pinLabel = { "u1.2": "2 · −IN", "u1.3": "3 · +IN", "u1.4": "4 · −V", "u1.7": "7 · +V", "u1.6": "6 · OUT" };
const pinColour = { "u1.2": SIGNAL.input, "u1.3": SURFACE.legend, "u1.4": SIGNAL.supplyNeg, "u1.7": SIGNAL.supplyPos, "u1.6": SIGNAL.output };

/** Board millimetres to metres on the raked face. */
const at = ([x, y], z = 0) => new THREE.Vector3(mm(x), mm(y), z);

/** The printed layer: a breadboard field, pin traces and every label. */
function draw(c, w, h, state = {}) {
  const cx = w / 2;
  const cy = h / 2;
  const X = (x) => cx + x;
  const Y = (y) => cy - y;

  c.fillStyle = SURFACE.panel;
  c.fillRect(0, 0, w, h);

  // Breadboard field across the middle band, at double pitch so it reads.
  const field = { x: 20, y: cy - 70, w: w - 40, h: 140 };
  c.fillStyle = SURFACE.boardBody;
  c.beginPath();
  c.roundRect(field.x, field.y, field.w, field.h, 3);
  c.fill();
  const pitch = 2.54 * BOARD.scale;
  const hole = (x, y) => {
    const r = pitch * 0.26;
    c.fillStyle = "rgba(130,136,138,0.5)";
    c.fillRect(x - r - 0.3, y - r - 0.3, r * 2 + 0.6, r * 2 + 0.6);
    c.fillStyle = SURFACE.boardRecess;
    c.fillRect(x - r, y - r, r * 2, r * 2);
    c.fillStyle = "#14181a";
    c.fillRect(x - r * 0.5, y - r * 0.5, r, r);
  };
  const cols = Math.floor((field.w - 16) / pitch);
  const left = field.x + (field.w - (cols - 1) * pitch) / 2;
  for (let row = 0; row < 10; row += 1) {
    const offset = row < 5 ? -(5 - row) : row - 4;
    const y = cy + offset * pitch - Math.sign(offset) * pitch * 0.5;
    for (let col = 0; col < cols; col += 1) hole(left + col * pitch, y);
  }
  c.fillStyle = "#cfd2cd";
  c.fillRect(field.x, cy - pitch * 0.6, field.w, pitch * 1.2);

  // Traces from each breakout terminal to its pin, so the breakout is legible.
  c.lineWidth = 1.2;
  c.lineCap = "round";
  for (const id of ["u1.2", "u1.3", "u1.4", "u1.7", "u1.6"]) {
    const [tx, ty] = PLACE[id];
    const pin = { "u1.2": [-3.8, -11.4], "u1.3": [3.8, -11.4], "u1.4": [11.4, -11.4], "u1.7": [-3.8, 11.4], "u1.6": [3.8, 11.4] }[id];
    c.strokeStyle = pinColour[id];
    c.beginPath();
    c.moveTo(X(tx), Y(ty));
    c.lineTo(X(tx), Y(pin[1] + Math.sign(pin[1]) * 14));
    c.lineTo(X(pin[0]), Y(pin[1] + Math.sign(pin[1]) * 14));
    c.lineTo(X(pin[0]), Y(pin[1]));
    c.stroke();
  }

  // Labels, printed where they are used.
  c.textBaseline = "alphabetic";
  for (const id of ["u1.2", "u1.3", "u1.4"]) micro(c, pinLabel[id], X(PLACE[id][0]), Y(PLACE[id][1]) + 15, { color: pinColour[id] });
  for (const id of ["u1.7", "u1.6"]) micro(c, pinLabel[id], X(PLACE[id][0]), Y(PLACE[id][1]) - 10, { color: pinColour[id] });
  for (const [id, x, y] of [["u1.2", -3.8, -11.4], ["u1.3", 3.8, -11.4], ["u1.4", 11.4, -11.4], ["u1.7", -3.8, 11.4], ["u1.6", 3.8, 11.4]]) {
    micro(c, id.slice(3), X(x) + (y < 0 ? 0 : 0), Y(y) + (y < 0 ? 8 : -5), { color: pinColour[id] });
  }

  const resistors = state.resistors ?? {};
  const names = state.names ?? { rin: "Rin", rf: "Rf", rin2: "Rin2", rf2: "Rf2" };
  const used = new Set(state.used ?? ["rin", "rf"]);
  for (const id of ["rin", "rf", "rin2", "rf2"]) {
    if (!used.has(id)) continue;
    const p = PLACE[id];
    legend(c, names[id], X(p.body[0]), Y(p.body[1]) + 16);
    const ry = p.knob[1] > p.body[1] ? (p.knob[1] + p.body[1]) / 2 + 2 : (p.knob[1] + p.body[1]) / 2 - 2;
    window_(c, X(p.knob[0]) - 17, Y(ry) - 5.5, 34, 11);
    readout(c, `${figure((resistors[id] ?? 10000) / 1000, 1)} kΩ`, X(p.knob[0]), Y(ry) + 3, { align: "center", cap: 5.5 });
    micro(c, "A", X(p.a[0]), Y(p.a[1]) + 14);
    micro(c, "B", X(p.b[0]), Y(p.b[1]) + 14);
  }
  for (const [id, text, colour] of [
    ["board.vplus", "+V", SIGNAL.supplyPos],
    ["board.gnd", "GND", SURFACE.legend],
    ["board.vminus", "−V", SIGNAL.supplyNeg],
  ])
    legend(c, text, X(PLACE[id][0]), Y(PLACE[id][1]) - 13, { color: colour });
  legend(c, "Vin", X(PLACE["board.vin"][0]), Y(PLACE["board.vin"][1]) + 20, { color: SIGNAL.input });
  if (used.has("rin2")) legend(c, "Vin2", X(PLACE["board.vin2"][0]), Y(PLACE["board.vin2"][1]) + 20, { color: SIGNAL.inputB });
  legend(c, "Vout", X(PLACE["board.vout"][0]), Y(PLACE["board.vout"][1]) + 20, { color: SIGNAL.output });

  c.font = font(FONT.legend, CAP_MM.title);
  c.fillStyle = SURFACE.legend;
  c.textAlign = "left";
  c.fillText("OP-AMP TRAINER", 14, h - 10);
  micro(c, "ELEN 221 · LAB 7", w - 14, h - 11, { align: "right" });
}

/** The op-amp symbol for the package top: triangle, inputs, output, device name. */
function chipFace() {
  const canvas = document.createElement("canvas");
  canvas.width = 490;
  canvas.height = 320;
  const c = canvas.getContext("2d");
  c.fillStyle = "#1c2024";
  c.fillRect(0, 0, 490, 320);
  c.strokeStyle = "#f4f8fa";
  c.lineWidth = 9;
  c.lineJoin = "round";
  c.beginPath();
  c.moveTo(150, 60);
  c.lineTo(150, 260);
  c.lineTo(345, 160);
  c.closePath();
  c.stroke();
  c.fillStyle = "#f4f8fa";
  c.font = "bold 46px 'Barlow Semi Condensed', sans-serif";
  c.textAlign = "center";
  c.fillText("−", 182, 128);
  c.fillText("+", 182, 220);
  c.lineWidth = 7;
  const lead = (colour, x1, y1, x2, y2) => {
    c.strokeStyle = colour;
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  };
  lead(SIGNAL.input, 70, 110, 150, 110);
  lead("#f4f8fa", 70, 210, 150, 210);
  lead(SIGNAL.output, 345, 160, 430, 160);
  lead(SIGNAL.supplyPos, 215, 126, 215, 50);
  lead(SIGNAL.supplyNeg, 215, 194, 215, 270);
  c.font = "600 30px 'Barlow Semi Condensed', sans-serif";
  c.fillStyle = "#aab4ba";
  c.textAlign = "left";
  c.fillText("U1 · 741", 24, 300);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function createBoard({ parts, materials, register }) {
  const group = new THREE.Group();
  group.name = "trainer-board";
  const terminals = new Map();
  const modules = new Map();
  const W = mm(BOARD.widthMM);
  const H = mm(BOARD.heightMM);

  // The panel and the feet it stands on. The face group is the raked surface
  // everything else mounts to; its +z is out of the face.
  const face = new THREE.Group();
  face.rotation.x = -(Math.PI / 2 - BOARD.rake);
  face.position.y = mm(6);
  group.add(face);

  const plate = new THREE.Mesh(parts.box(W + mm(8), H + mm(8), mm(3), mm(1)), materials.abs("#2f363b"));
  plate.position.z = -mm(1.5);
  plate.castShadow = true;
  plate.receiveShadow = true;
  face.add(plate);

  const panel = new Panel(BOARD.widthMM, BOARD.heightMM, draw, { dpmm: 7 });
  const printed = new THREE.Mesh(parts.plane(W, H), materials.printed(panel.texture));
  printed.position.z = mm(0.3);
  printed.receiveShadow = true;
  face.add(printed);

  // A wedge under the back edge so the rake is a real stand, not a float.
  const wedge = new THREE.Mesh(parts.box(W, H * Math.sin(BOARD.rake) + mm(8), mm(24)), materials.abs("#2f363b"));
  wedge.position.set(0, (H * Math.sin(BOARD.rake)) / 2 + mm(4), -(H / 2) * Math.cos(BOARD.rake) + mm(12));
  group.add(wedge);

  const addTerminal = (id, colour, position, radius = mm(8)) => {
    const socket = parts.jack(colour, { radius });
    socket.position.copy(position);
    socket.position.z = mm(0.6);
    face.add(socket);
    socket.userData = { ...socket.userData, kind: "terminal", id };
    register(socket, socket.userData);
    terminals.set(id, socket);
    return socket;
  };

  // The 741 at twice life size, with its breakout terminals around it.
  const chip = parts.dip8({ face: chipFace() });
  chip.scale.setScalar(BOARD.chipScale);
  chip.position.copy(at(PLACE.chip, mm(0.4)));
  face.add(chip);
  for (const id of ["u1.2", "u1.3", "u1.4", "u1.7", "u1.6"]) addTerminal(id, pinColour[id], at(PLACE[id]));

  // Rin, Rf and the second pair: a real resistor mounted between two terminals,
  // with its adjusting knob on the board beside it. In the circuit, visibly.
  for (const id of ["rin", "rf", "rin2", "rf2"]) {
    const p = PLACE[id];
    const part = parts.resistor(10000);
    part.scale.setScalar(BOARD.scale);
    part.position.copy(at(p.body, mm(5)));
    face.add(part);
    for (const side of ["a", "b"]) {
      const post = new THREE.Mesh(parts.cylinder(mm(1.2), mm(1.6), mm(8), 10), materials.plated());
      post.rotation.x = Math.PI / 2;
      post.position.copy(at(p[side], mm(4))).add(new THREE.Vector3(side === "a" ? mm(10) : -mm(10), 0, 0));
      face.add(post);
    }
    const knob = parts.knob({ radius: mm(10), height: mm(9) });
    knob.position.copy(at(p.knob, mm(0.4)));
    face.add(knob);
    knob.userData = { ...knob.userData, kind: "knob", id, control: { id, kind: "resistor" } };
    register(knob, knob.userData);
    const a = addTerminal(`${id}.a`, SIGNAL.feedback, at(p.a), mm(7));
    const b = addTerminal(`${id}.b`, SIGNAL.feedback, at(p.b), mm(7));
    modules.set(id, { part, knob, a, b, ohms: 10000 });
  }

  addTerminal("board.gnd", SIGNAL.ground, at(PLACE["board.gnd"]));
  addTerminal("board.vplus", SIGNAL.supplyPos, at(PLACE["board.vplus"]));
  addTerminal("board.vminus", SIGNAL.supplyNeg, at(PLACE["board.vminus"]));
  addTerminal("board.vin", SIGNAL.input, at(PLACE["board.vin"]));
  addTerminal("board.vin2", SIGNAL.inputB, at(PLACE["board.vin2"]));
  addTerminal("board.vout", SIGNAL.output, at(PLACE["board.vout"]));

  const chipAnchor = new THREE.Object3D();
  chipAnchor.position.copy(at(PLACE.chip, mm(12)));
  face.add(chipAnchor);

  return {
    group,
    face,
    terminals,
    modules,
    chip,
    chipAnchor,
    /** The contact a lead seats into, in world space. */
    contactOf(id) {
      const socket = terminals.get(id);
      return socket ? socket.localToWorld(new THREE.Vector3(0, 0, mm(3))) : null;
    },
    applyConfiguration(configuration) {
      const used = new Set(terminalsFor(configuration));
      for (const [id, socket] of terminals) socket.visible = used.has(id);
      for (const [id, module] of modules) {
        const on = used.has(`${id}.a`);
        module.part.visible = on;
        module.knob.visible = on;
      }
    },
    update(state) {
      const spec = { inverting: { rin: "Rin", rf: "Rf" }, noninverting: { rin: "Rg", rf: "Rf" }, adder: { rin: "Rin1", rf: "Rf", rin2: "Rin2" }, subtractor: { rin: "R1", rf: "R2", rin2: "R3", rf2: "R4" } }[state.configuration];
      panel.paint({ resistors: state.resistors, names: { rin: "Rin", rf: "Rf", rin2: "Rin2", rf2: "Rf2", ...spec }, used: Object.keys(spec) });
      for (const [id, module] of modules) {
        if (module.ohms === state.resistors[id]) continue;
        module.ohms = state.resistors[id];
        const replacement = parts.resistor(state.resistors[id]);
        replacement.scale.copy(module.part.scale);
        replacement.position.copy(module.part.position);
        replacement.visible = module.part.visible;
        face.remove(module.part);
        face.add(replacement);
        module.part = replacement;
      }
    },
    dispose() {
      panel.dispose();
      group.removeFromParent();
    },
  };
}
