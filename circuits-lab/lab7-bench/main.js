// Lab 7 · operational amplifiers, breadboard-bench alternative to the instrument
// wall in ../lab7/, published beside it for instructors to compare. A standing lab bench: a breadboard trainer in
// the middle, leaning toward the student like a lectern, with the instruments around
// it within reach and every control a physical part. The student picks a configuration
// on the trainer, wires it by clicking two contacts (the wire routes itself), powers it,
// and measures it with the scope and multimeter. Units are metres; +z faces the student.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import "../../assets/css/metahub-app-shell.css";
import "../../assets/css/metahub-lab-theme.css";
import { mountLabShell } from "../../assets/js/metahub-app-shell.js";
import {
  AMPLITUDES, BLOCKS, CHIP_ROW, CONFIGS, CONFIG_ORDER, DC2_LEVELS, FREQUENCIES, LEADS, LEFT_COLS, PINS, POT_VALUES, RIGHT_COLS,
  ROWS, SUPPLY_LEVELS, TDIV, VDIV, WAVES, WIRE_COLORS, allHoles, buildModel, contactName, initialState, measure, partsFor, period, steps,
  strayJumpers, suggestColor, theory,
} from "./circuit.js";
import { BLOCK_AT, BOARD, CHIP, COL_X, LANES_X, LANES_Z, POST_AT, RAIL_X, contactXZ, contacts, endObstacle, partObstacles, partPose, rowZ } from "./layout.js";
import { routeWire } from "./routing.js";
import { COLOR, Cable, Display, Key, Knob, MONO, SANS, canvasTexture, jack, mat, printedFace, rounded, setAnisotropy, text } from "./kit.js";

const TOP = 0.9; // bench height for a standing student
const TILT = THREE.MathUtils.degToRad(20); // the trainer leans toward the student
const HINGE_Z = -0.37; // where the trainer's front edge meets the bench
const TRAINER_W = 0.44;
const TRAINER_D = 0.46;
const TRAINER_H = 0.03;
const BOARD_CZ = -0.245; // the board's centre along the trainer
const BOARD_H = 0.012;
const POST_TIP = 0.0152; // a binding post's top above the trainer face
const SHELF_Y = TOP + 0.25; // the instrument shelf behind the trainer

// ---------- renderer and page ----------
const stage = document.getElementById("stage");
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(stage.clientWidth || 1, stage.clientHeight || 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false; // shadows re-render only when something moved
renderer.xr.enabled = true;
renderer.xr.setFramebufferScaleFactor(1.2);
stage.appendChild(renderer.domElement);
setAnisotropy(renderer.capabilities.getMaxAnisotropy());

const vrButton = document.createElement("button");
vrButton.type = "button";
vrButton.textContent = "Checking VR…";
vrButton.disabled = true;
mountLabShell({
  host: document.getElementById("lab7-bar"),
  title: "Circuits Lab",
  notes: "/projects/circuits-lab/",
  context: Object.assign(document.createElement("span"), { textContent: "Lab 07 / Operational amplifiers · breadboard bench" }),
  actions: [Object.assign(document.createElement("a"), { href: "../lab7/", textContent: "Instrument-wall version" }), vrButton],
});

// a label that follows the pointer: what a contact is, and what a click will do
const tipLabel = document.createElement("div");
Object.assign(tipLabel.style, {
  position: "absolute", left: "0", top: "0", display: "none", pointerEvents: "none", zIndex: "2",
  padding: "5px 9px", borderRadius: "4px", background: "rgba(22, 24, 28, 0.9)", color: "#f4f1ea",
  font: "600 12px/1.35 'IBM Plex Mono', Menlo, monospace", whiteSpace: "nowrap", transform: "translate(14px, 14px)",
});
stage.appendChild(tipLabel);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#c9ccc8");
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.45;

const camera = new THREE.PerspectiveCamera(55, 1, 0.01, 30);
camera.position.set(0, 1.45, 0.1);
const lab = new THREE.Group(); // everything the student uses; lifted to fit their height in VR
scene.add(lab);

let shadowsDirty = true;
const dirty = () => { shadowsDirty = true; };

// ---------- room ----------
const standMat = new THREE.Mesh(new THREE.CircleGeometry(0.3, 48), mat.plastic("#5b5f63", 0.95));
scene.add(new THREE.HemisphereLight("#f4f6f8", "#6d6a64", 0.9));
const sun = new THREE.DirectionalLight("#fff6ea", 1.6);
sun.position.set(0.6, 2.6, 0.9);
sun.target.position.set(0, TOP, -0.6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -1.1, right: 1.1, top: 0.9, bottom: -0.9, near: 0.5, far: 5 });
sun.shadow.bias = -0.0003;
sun.shadow.normalBias = 0.002;
lab.add(sun, sun.target);
{
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), mat.plastic("#a7a49d", 0.9));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 3.2), mat.plastic("#e3e1dc", 0.95));
  wall.position.set(0, 1.6, -1.7);
  const skirting = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 0.02), mat.plastic("#6f6c66"));
  skirting.position.set(0, 0.05, -1.69);
  scene.add(floor, wall, skirting);
  // a place to stand, shown in the headset only
  standMat.rotation.x = -Math.PI / 2;
  standMat.position.y = 0.002;
  standMat.receiveShadow = true;
  standMat.visible = false;
  scene.add(standMat);
}

// ---------- bench and instrument shelf ----------
{
  const top = new THREE.Mesh(rounded(1.8, 0.035, 0.82, 0.006), mat.plastic("#d8d4cb", 0.7));
  top.position.set(0, TOP - 0.0175, -0.63);
  top.receiveShadow = true;
  top.castShadow = true;
  const steel = mat.metal("#8b9096", 0.45);
  const frame = new THREE.Group();
  for (const x of [-0.84, 0.84]) for (const z of [-0.98, -0.28]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.04, TOP - 0.035, 0.04), steel);
    leg.position.set(x, (TOP - 0.035) / 2, z);
    leg.castShadow = true;
    frame.add(leg);
  }
  const rail = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.05, 0.03), steel);
  rail.position.set(0, TOP - 0.06, -0.98);
  const footrail = rail.clone();
  footrail.position.set(0, 0.15, -0.98);
  frame.add(rail, footrail);
  // an anti-static mat under the trainer and its instruments
  const esd = new THREE.Mesh(rounded(1.3, 0.003, 0.62, 0.0012), mat.plastic("#5d7586", 0.85));
  esd.position.set(0, TOP + 0.0015, -0.6);
  esd.receiveShadow = true;
  // the power supply sits on a shelf above the trainer's far edge, its leads dropping to the posts
  const shelf = new THREE.Mesh(rounded(0.8, 0.018, 0.27, 0.004), mat.plastic("#cfcac0", 0.7));
  shelf.position.set(0, SHELF_Y - 0.009, -0.935);
  shelf.castShadow = shelf.receiveShadow = true;
  for (const x of [-0.39, 0.39]) {
    const upright = new THREE.Mesh(new THREE.BoxGeometry(0.02, SHELF_Y - TOP - 0.018, 0.24), steel);
    upright.position.set(x, TOP + (SHELF_Y - TOP - 0.018) / 2, -0.94);
    upright.castShadow = true;
    frame.add(upright);
  }
  lab.add(top, frame, esd, shelf);
}

// ---------- registry of things to touch ----------
const pickables = [];
const keys = [];
const knobs = [];
const glowTargets = new Set();
function pickable(mesh) { pickables.push(mesh); return mesh; }
function unpick(mesh) { const i = pickables.indexOf(mesh); if (i >= 0) pickables.splice(i, 1); }
// an unseen, larger grab area for parts too slim to hit reliably with a mouse
const HIT = new THREE.MeshBasicMaterial({ visible: false });
function hitArea(parent, geometry, ref, at) {
  const mesh = new THREE.Mesh(geometry, HIT);
  if (at) mesh.position.copy(at);
  mesh.userData.ref = ref;
  parent.add(mesh);
  return pickable(mesh);
}
function refOf(object) {
  while (object && !object.userData.ref) object = object.parent;
  return object?.userData.ref ?? null;
}
const addKnob = (parent, opts) => { const k = new Knob(parent, opts); knobs.push(k); pickable(k.pickable); glowTargets.add(k); return k; };
const addKey = (parent, opts) => { const k = new Key(parent, opts); keys.push(k); pickable(k.pickable); pickable(k.face); glowTargets.add(k); return k; };

/** An instrument: body on the bench (or shelf), turned to face the student, with a front-face group (origin at its centre, +z out). */
function instrument({ w, h, d, x, z, y = TOP, color = "#e4e2dc", face = "#2a2e33", yaw }) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = yaw ?? Math.atan2(-x, -z);
  const body = new THREE.Mesh(rounded(w, h, d, 0.01), mat.plastic(color, 0.6));
  body.position.y = h / 2 + 0.008;
  body.castShadow = body.receiveShadow = true;
  group.add(body);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.009, 0.008, 16), mat.rubber());
    foot.position.set(sx * (w / 2 - 0.025), 0.004, sz * (d / 2 - 0.025));
    group.add(foot);
  }
  const front = new THREE.Group();
  front.position.set(0, h / 2 + 0.008, d / 2 + 0.0005);
  group.add(front);
  const plate = new THREE.Mesh(rounded(w - 0.012, h - 0.012, 0.003, 0.004), mat.plastic(face, 0.55));
  plate.position.z = -0.001;
  front.add(plate);
  lab.add(group);
  return { group, front, w: w - 0.012, h: h - 0.012 };
}
const silk = (ctx, at, s, x, y, size, opts = {}) => { const [px, py] = at(x, y); text(ctx, s, px, py, size, { color: "#e9e6df", ...opts }); };

// ---------- the state, the model and change handling ----------
let state = initialState();
let model = buildModel(state);
let stepList = steps(state, model);
let guided = true;
let showSolution = false;
const history = [];
const listeners = [];
function changed() {
  model = buildModel(state);
  stepList = steps(state, model);
  for (const fn of listeners) fn();
  dirty();
}
const onChange = (fn) => listeners.push(fn);

// ---------- breadboard trainer ----------
// The trainer is hinged at its front edge and leans back by TILT. Everything on
// it lives in the board frame: origin at the board's centre on the trainer
// face, x to the right, z along the rows toward the student, y out of the face.
const trainer = new THREE.Group();
trainer.position.set(0, TOP, HINGE_Z);
trainer.rotation.x = TILT;
lab.add(trainer);
const board = new THREE.Group();
board.position.set(0, TRAINER_H, BOARD_CZ);
trainer.add(board);
lab.updateMatrixWorld(true);
const toLab = (v) => lab.worldToLocal(board.localToWorld(v.clone()));
const toBoard = (v) => board.worldToLocal(lab.localToWorld(v.clone()));
const FACE_Z0 = -TRAINER_D - BOARD_CZ; // the trainer face's extent along the board's z
const FACE_Z1 = -BOARD_CZ;

const isPost = (id) => Boolean(POST_AT[id]);
const isPin = (id) => Boolean(id?.startsWith("pin"));
const CONTACTS = contacts();
function contactPoint(id) {
  const p = contactXZ(id);
  if (!p) return null;
  return new THREE.Vector3(p.x, isPost(id) ? POST_TIP : isPin(id) ? BOARD_H + 0.0045 : BOARD_H, p.z);
}
const CONTACT_POINT = new Map(CONTACTS.map((id) => [id, contactPoint(id)]));
const POST_COLOR = { "post+": COLOR.red, postg: COLOR.black, "post-": COLOR.blue, postin2: COLOR.purple, postin: COLOR.yellow, postgin: COLOR.black, postout: COLOR.cyan, postgout: COLOR.black };
const POST_LABEL = { "post+": "+V", postg: "GND", "post-": "−V", postin2: "VIN2", postin: "VIN", postgin: "GND", postout: "VOUT", postgout: "GND" };
const ROLE = { red: "+V", blue: "−V", black: "ground", yellow: "input", purple: "input 2", green: "feedback", cyan: "output", orange: "link" };
const postDisplays = {};

{
  // a wedge holds the trainer at its angle
  const far = TRAINER_D * Math.cos(TILT), rise = TRAINER_D * Math.sin(TILT);
  const shape = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(-far, 0), new THREE.Vector2(-far, rise)]);
  const wedge = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: TRAINER_W - 0.02, bevelEnabled: false }).rotateY(-Math.PI / 2).translate((TRAINER_W - 0.02) / 2, 0, 0), mat.plastic("#2b2e32", 0.7));
  wedge.position.set(0, TOP, HINGE_Z);
  wedge.castShadow = wedge.receiveShadow = true;
  lab.add(wedge);

  // trainer base, dark with silkscreened posts, colour key and pinout
  const base = new THREE.Mesh(rounded(TRAINER_W, TRAINER_H, TRAINER_D, 0.006), mat.plastic("#34383d", 0.6));
  base.position.set(0, TRAINER_H / 2, -TRAINER_D / 2);
  base.castShadow = base.receiveShadow = true;
  trainer.add(base);
  const cz = (FACE_Z0 + FACE_Z1) / 2;
  const top = new THREE.Group();
  top.rotation.x = -Math.PI / 2;
  top.position.set(0, 0.0002, cz);
  board.add(top);
  printedFace(top, TRAINER_W - 0.008, TRAINER_D - 0.008, {
    pxPerM: 3200, background: "#34383d", z: 0,
    draw: (ctx, at) => {
      const P = (x, z) => at(x, -(z - cz));
      const say = (s, x, z, size, opts = {}) => { const [px, py] = P(x, z); text(ctx, s, px, py, size, { color: "#f1eee6", ...opts }); };
      for (const [id, [x, z]] of Object.entries(POST_AT)) {
        const [cx, cy] = P(x, z);
        ctx.strokeStyle = POST_COLOR[id] === COLOR.black ? "#9aa0a6" : POST_COLOR[id];
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(cx, cy, 0.0135 * 3200, 0, Math.PI * 2); ctx.stroke();
        say(POST_LABEL[id], x, z - 0.0205, 28, { weight: 800 });
      }
      // a key to the wire colours and the 741's pins, along the front edge
      const keyZ = BOARD.l / 2 + 0.024;
      say("WIRE COLOURS", -0.2, keyZ - 0.009, 19, { color: "#b9bdc2", align: "left", weight: 800 });
      WIRE_COLORS.forEach((c, i) => {
        const x = -0.2 + (i % 4) * 0.052, z = keyZ + 0.006 + Math.floor(i / 4) * 0.016;
        const [px, py] = P(x, z);
        ctx.fillStyle = COLOR[c];
        ctx.fillRect(px, py - 9, 34, 18);
        if (c === "black") { ctx.strokeStyle = "#9aa0a6"; ctx.lineWidth = 2; ctx.strokeRect(px, py - 9, 34, 18); }
        say(ROLE[c], x + 0.0135, z, 19, { align: "left", weight: 600, color: "#e1ded6" });
      });
      say("741 PINOUT (notch at top)", 0.005, keyZ - 0.009, 19, { color: "#b9bdc2", align: "left", weight: 800 });
      const pinout = [["1 offset", "8 NC"], ["2 −IN", "7 V+"], ["3 +IN", "6 OUT"], ["4 V−", "5 offset"]];
      pinout.forEach(([l, r], i) => {
        const z = keyZ + 0.003 + i * 0.0085;
        say(l, 0.005, z, 18, { align: "left", weight: 600, color: "#e1ded6" });
        say(r, 0.055, z, 18, { align: "left", weight: 600, color: "#e1ded6" });
      });
      say("WIRING", 0.118, keyZ - 0.009, 19, { color: "#b9bdc2", align: "left", weight: 800 });
      ["Click two holes", "to lay a wire.", "Click a wire: colour", "or delete. Drag its", "bead to re-route."].forEach((s, i) => say(s, 0.118, keyZ + 0.002 + i * 0.0072, 15, { align: "left", weight: 600, color: "#a9aeb4" }));
      say("ELEN 221 OP-AMP TRAINER", -0.21, FACE_Z0 + 0.008, 16, { color: "#8d9298", align: "left", weight: 600 });
    },
  });
  for (const [id, [x, z]] of Object.entries(POST_AT)) {
    const j = jack(board, x, 0, POST_COLOR[id], { post: true });
    j.group.position.set(x, 0, z);
    j.group.rotation.x = -Math.PI / 2;
  }
  // the supply's voltages, read out beside its posts
  const readouts = new THREE.Group();
  readouts.rotation.x = -Math.PI / 2;
  readouts.position.y = 0.001;
  board.add(readouts);
  postDisplays.plus = new Display(readouts, POST_AT["post+"][0] - 0.06, -POST_AT["post+"][1], 0.05, 0.016, { pxPerM: 6000 });
  postDisplays.minus = new Display(readouts, POST_AT["post-"][0] + 0.06, -POST_AT["post-"][1], 0.05, 0.016, { pxPerM: 6000 });

  // the breadboard itself
  const body = new THREE.Mesh(rounded(BOARD.w + 0.006, BOARD_H, BOARD.l + 0.006, 0.003), mat.plastic("#f3f1ea", 0.55));
  body.position.y = BOARD_H / 2;
  body.castShadow = body.receiveShadow = true;
  board.add(body);
  const face = new THREE.Group();
  face.rotation.x = -Math.PI / 2;
  face.position.y = BOARD_H + 0.0003;
  board.add(face);
  const PX = 4000;
  printedFace(face, BOARD.w, BOARD.l, {
    pxPerM: PX, background: "#f3f1ea", z: 0, roughness: 0.55,
    draw: (ctx, at) => {
      const P = (x, z) => at(x, -z);
      const say = (s, x, z, size, opts = {}) => { const [px, py] = P(x, z); text(ctx, s, px, py, size, { color: "#77736b", weight: 600, ...opts }); };
      // rails: a tinted lane under each, lettered at both ends
      const RAIL_TINT = { g: "#d8d8d4", p: "#f2c9c4", n: "#c9d6f2" };
      const RAIL_INK = { g: "#25272a", p: COLOR.red, n: COLOR.blue };
      const RAIL_MARK = { g: "G", p: "+", n: "−" };
      for (const [rail, x] of Object.entries(RAIL_X)) {
        const [x0, y0] = P(x - 0.0042, rowZ(-0.6));
        const [x1, y1] = P(x + 0.0042, rowZ(ROWS - 0.4));
        ctx.fillStyle = RAIL_TINT[rail[1]];
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        for (const z of [rowZ(-1.25), rowZ(ROWS + 0.25)]) say(RAIL_MARK[rail[1]], x, z, 34, { color: RAIL_INK[rail[1]], weight: 800 });
      }
      // the centre channel
      const [gx0, gy0] = P(-0.008, rowZ(-0.6));
      const [gx1, gy1] = P(0.008, rowZ(ROWS - 0.4));
      ctx.fillStyle = "#dedbd2";
      ctx.fillRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
      for (const id of allHoles()) {
        const p = contactXZ(id);
        const [px, py] = P(p.x, p.z);
        ctx.fillStyle = "#3b3d40";
        ctx.fillRect(px - 5.5, py - 5.5, 11, 11);
        ctx.fillStyle = "#121314";
        ctx.fillRect(px - 3.5, py - 3.5, 7, 7);
      }
      // column letters and row numbers
      for (const c of [...LEFT_COLS, ...RIGHT_COLS]) for (const z of [rowZ(-1.1), rowZ(ROWS + 0.1)]) say(c, COL_X[c], z, 22);
      for (let r = 0; r < ROWS; r += 1) if (r === 0 || (r + 1) % 5 === 0 || (r >= CHIP_ROW && r < CHIP_ROW + 4)) {
        say(String(r + 1), -0.0665, rowZ(r), 20);
        say(String(r + 1), 0.0665, rowZ(r), 20);
      }
      // terminal blocks
      for (const [name, [x, row]] of Object.entries(BLOCK_AT)) {
        const block = BLOCKS[name];
        const color = { VIN: "#b08a12", VIN2: COLOR.purple, VOUT: "#1f8a99", GND: "#25272a" }[block.net];
        const [x0, y0] = P(x - 0.0075, rowZ(row) - 0.0075);
        const [x1, y1] = P(x + 0.0075, rowZ(row + block.holes - 1) + 0.0075);
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
        say(block.label, x, rowZ(row) - 0.014, 24, { color, weight: 800 });
      }
    },
  });
}

// the 741, straddling the channel with its notch toward the far end
{
  const chip = new THREE.Group();
  const cz = (rowZ(CHIP_ROW) + rowZ(CHIP_ROW + 3)) / 2;
  chip.position.set(0, BOARD_H + 0.002, cz);
  board.add(chip);
  const w = CHIP.w, l = CHIP.l, notch = 0.0034;
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, -l / 2);
  shape.lineTo(w / 2, -l / 2);
  shape.lineTo(w / 2, l / 2);
  shape.lineTo(notch, l / 2);
  shape.absarc(0, l / 2, notch, 0, Math.PI, true);
  shape.lineTo(-w / 2, l / 2);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.009, bevelEnabled: true, bevelThickness: 0.0006, bevelSize: 0.0006, bevelSegments: 2, curveSegments: 20 });
  geometry.rotateX(-Math.PI / 2);
  // the top: pin numbers along both edges, names beside them, a dimple at pin 1
  const PX = 16000;
  const view = canvasTexture(w * PX, l * PX);
  const { ctx, canvas } = view;
  ctx.fillStyle = "#1b1c1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const at = (x, z) => [(x + w / 2) * PX, (z + l / 2) * PX];
  const [dx, dy] = at(-w / 2 + 0.0042, -l / 2 + 0.0042);
  ctx.fillStyle = "#3d3f43";
  ctx.beginPath(); ctx.arc(dx, dy, 0.0017 * PX, 0, Math.PI * 2); ctx.fill();
  const names = { 1: "OFS", 2: "−IN", 3: "+IN", 4: "V−", 5: "OFS", 6: "OUT", 7: "V+", 8: "NC" };
  for (const [n, hole] of Object.entries(PINS)) {
    const z = contactXZ(hole).z - cz;
    const left = Number(n) <= 4;
    const [nx, ny] = at(left ? -w / 2 + 0.0026 : w / 2 - 0.0026, z);
    text(ctx, n, nx, ny, 58, { color: "#ffffff", weight: 800 });
    const [tx, ty] = at(left ? -w / 2 + 0.0052 : w / 2 - 0.0052, z);
    text(ctx, names[n], tx, ty, 30, { color: "#c9c6bf", weight: 700, align: left ? "left" : "right" });
  }
  const [lx, ly] = at(0, l / 2 - 0.0034);
  text(ctx, "µA741", lx, ly, 30, { color: "#8f8c86", weight: 700 });
  view.texture.repeat.set(1 / w, 1 / l);
  view.texture.offset.set(0.5, 0.5);
  const body = new THREE.Mesh(geometry, [new THREE.MeshStandardMaterial({ map: view.texture, roughness: 0.4 }), mat.plastic("#1b1c1e", 0.45)]);
  body.castShadow = true;
  chip.add(body);
  const legMat = mat.metal("#c4c7cb", 0.3);
  for (const hole of Object.values(PINS)) {
    const p = contactXZ(hole);
    const side = Math.sign(p.x);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.0009, 0.0085, 0.0024), legMat);
    leg.position.set(p.x, -0.0018, p.z - cz);
    const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.0036, 0.0011, 0.0024), legMat);
    shoulder.position.set(side * 0.0136, 0.0022, p.z - cz);
    chip.add(leg, shoulder);
  }
}

// ---------- components: Rin and Rf modules, fixed resistors ----------
const BAND = ["#1a1a1a", "#7a4a1f", "#c42a1d", "#e36b12", "#e9c50f", "#2c8c3c", "#2050b8", "#7d3fb5", "#8a8a8a", "#f2f2f2"];
function resistorTexture(value) {
  const view = canvasTexture(256, 64);
  const { ctx } = view;
  ctx.fillStyle = "#d9c49a";
  ctx.fillRect(0, 0, 256, 64);
  const digits = String(value).slice(0, 2).split("").map(Number);
  const mult = String(value).length - 2;
  [digits[0], digits[1], mult].forEach((d, i) => { ctx.fillStyle = BAND[d]; ctx.fillRect(48 + i * 34, 0, 18, 64); });
  ctx.fillStyle = "#b8902f";
  ctx.fillRect(190, 0, 18, 64);
  view.texture.needsUpdate = true;
  return view.texture;
}
const kOhm = (v) => (v >= 1000 ? `${(v / 1000).toFixed(v < 10000 ? 1 : 0)} kΩ` : `${v} Ω`);
const parts = new THREE.Group();
board.add(parts);
const potModules = {};
function placeParts() {
  for (const child of [...parts.children]) parts.remove(child);
  for (const m of Object.values(potModules)) { knobs.splice(knobs.indexOf(m.knob), 1); unpick(m.knob.pickable); glowTargets.delete(m.knob); }
  for (const id of Object.keys(potModules)) delete potModules[id];
  const legMat = mat.metal("#c4c7cb", 0.3);
  const pin = (x, z) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.0007, 0.0007, 0.009, 8), legMat); m.position.set(x, BOARD_H - 0.0005, z); parts.add(m); };
  for (const part of partsFor(state.config)) {
    const pose = partPose(part);
    for (const end of [pose.a, pose.b]) pin(end.x, end.z);
    if (part.kind === "pot") {
      // a trimmer module standing square to the board, its feet bent out to the holes, its readout toward the student
      const group = new THREE.Group();
      group.position.set(pose.mid.x, BOARD_H, pose.mid.z);
      parts.add(group);
      const body = new THREE.Mesh(rounded(0.03, 0.026, 0.022, 0.003), mat.plastic("#2f6db5", 0.45));
      body.position.y = 0.017;
      body.castShadow = true;
      group.add(body);
      for (const end of [pose.a, pose.b]) {
        const dx = end.x - pose.mid.x, dz = end.z - pose.mid.z;
        const across = Math.abs(dx) > Math.abs(dz);
        const reach = across ? Math.abs(dx) - 0.015 : Math.abs(dz) - 0.011;
        const foot = new THREE.Mesh(new THREE.BoxGeometry(across ? reach : 0.0012, 0.0012, across ? 0.0012 : reach), legMat);
        foot.position.set(across ? Math.sign(dx) * (0.015 + reach / 2) : dx, 0.004, across ? dz : Math.sign(dz) * (0.011 + reach / 2));
        group.add(foot);
      }
      const front = new THREE.Group();
      front.position.set(0, 0.017, 0.0111);
      group.add(front);
      printedFace(front, 0.028, 0.024, {
        pxPerM: 9000, background: "#2f6db5", z: 0.0002,
        draw: (ctx, at) => silk(ctx, at, part.label, 0, 0.0075, 64, { color: "#ffffff", weight: 800 }),
      });
      const display = new Display(front, 0, -0.004, 0.024, 0.01, { pxPerM: 12000, z: 0.0004 });
      const knobHolder = new THREE.Group();
      knobHolder.rotation.x = -Math.PI / 2;
      knobHolder.position.y = 0.0302;
      group.add(knobHolder);
      const knob = addKnob(knobHolder, {
        x: 0, y: 0, radius: 0.0095, values: POT_VALUES, index: POT_VALUES.indexOf(state[part.id]), color: "#e8e5dc", cap: "#cfcbc0", marker: "#1d1f22", name: part.id,
        onChange: (v) => { state[part.id] = v; changed(); },
      });
      potModules[part.id] = { display, knob };
    } else {
      const group = new THREE.Group();
      group.position.set(pose.mid.x, BOARD_H, pose.mid.z);
      group.rotation.y = -Math.atan2(pose.b.z - pose.a.z, pose.b.x - pose.a.x);
      parts.add(group);
      const span = Math.hypot(pose.b.x - pose.a.x, pose.b.z - pose.a.z);
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.0042, pose.len, 6, 18).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ map: resistorTexture(part.value), roughness: 0.5 }));
      body.position.y = 0.007;
      body.castShadow = true;
      group.add(body);
      const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.0006, 0.0006, span, 8).rotateZ(Math.PI / 2), legMat);
      lead.position.y = 0.007;
      group.add(lead);
      for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.0006, 0.0006, 0.007, 8), legMat); m.position.set((s * span) / 2, 0.0035, 0); group.add(m); }
      // its value, on a small tag that always reads square to the board
      const flag = new THREE.Group();
      flag.position.set(pose.mid.x, BOARD_H + 0.0125, pose.mid.z);
      flag.rotation.x = -Math.PI / 2;
      parts.add(flag);
      printedFace(flag, 0.024, 0.0075, { pxPerM: 9000, background: "#f3f1ea", z: 0, draw: (ctx, at) => silk(ctx, at, `${part.label} ${kOhm(part.value)}`, 0, 0, 46, { color: "#33302a", weight: 800 }) });
    }
  }
  drawModules();
  dirty();
}
function drawModules() {
  for (const [id, m] of Object.entries(potModules)) m.display.draw(state[id], (ctx, w, h) => text(ctx, kOhm(state[id]), w / 2, h / 2 + 2, h * 0.66, { color: "#7df0c4", font: MONO, weight: 600 }));
}

// ---------- instruments ----------
// Dual DC supply, on the shelf behind the trainer
const supply = instrument({ w: 0.3, h: 0.13, d: 0.22, x: 0, z: -0.95, y: SHELF_Y, yaw: 0 });
const supplyJacks = {};
const supplyDisplays = {};
const rangeKeys = {};
let powerKey;
{
  const f = supply.front;
  printedFace(f, supply.w, supply.h, {
    pxPerM: 3600, background: "#2a2e33", z: 0.0006,
    draw: (ctx, at) => {
      silk(ctx, at, "DUAL DC POWER SUPPLY", -0.138, 0.053, 28, { align: "left", weight: 800 });
      silk(ctx, at, "+V OUTPUT", -0.08, 0.04, 22, { color: "#ff8a80", weight: 800 });
      silk(ctx, at, "−V OUTPUT", 0.005, 0.04, 22, { color: "#8fb3ff", weight: 800 });
      silk(ctx, at, "+V", -0.105, -0.052, 24, { color: "#ff8a80", weight: 800 });
      silk(ctx, at, "COM", -0.0375, -0.052, 22, { weight: 800 });
      silk(ctx, at, "−V", 0.03, -0.052, 24, { color: "#8fb3ff", weight: 800 });
      silk(ctx, at, "OUTPUT ±V", 0.1, 0.053, 20, { weight: 700, color: "#c9c6bf" });
      silk(ctx, at, "POWER", 0.1, -0.054, 20, { weight: 700, color: "#c9c6bf" });
    },
  });
  supplyDisplays.plus = new Display(f, -0.08, 0.016, 0.08, 0.03);
  supplyDisplays.minus = new Display(f, 0.005, 0.016, 0.08, 0.03);
  supplyJacks["sup+"] = jack(f, -0.105, -0.035, COLOR.red);
  supplyJacks.supg = jack(f, -0.0375, -0.035, COLOR.black);
  supplyJacks["sup-"] = jack(f, 0.03, -0.035, COLOR.blue);
  SUPPLY_LEVELS.forEach((v, i) => {
    rangeKeys[v] = addKey(f, { x: 0.072 + i * 0.028, y: 0.022, w: 0.025, h: 0.014, label: `±${v}`, color: "#d9d5cb", led: "#53e07a", name: `range:${v}`, onPress: () => { state.supply.level = v; changed(); } });
  });
  powerKey = addKey(f, { x: 0.1, y: -0.03, w: 0.018, round: true, color: "#c9473d", label: "I/O", labelColor: "#ffffff", led: "#53e07a", name: "power", onPress: () => { state.supply.on = !state.supply.on; changed(); } });
}
function drawSupply() {
  const short = model.short && state.supply.on;
  const on = state.supply.on && !short;
  const level = state.supply.level;
  // the set voltage always shows: bright when the outputs are live, dim when off
  const show = (d, s, color, note) => d.draw(`${s}|${color}|${note}`, (ctx, w, h) => {
    text(ctx, s, w * 0.95, h * 0.5 + 2, h * (note ? 0.42 : 0.62), { color, font: MONO, weight: 700, align: "right" });
    if (note) text(ctx, note, w * 0.05, h * 0.5, h * 0.28, { color: "#8a8f94", font: MONO, weight: 700, align: "left" });
  });
  show(supplyDisplays.plus, short ? "LIMIT" : `+${level.toFixed(1)} V`, short ? "#ffb347" : on ? "#ff6b5e" : "#5a3431", on || short ? "" : "OFF");
  show(supplyDisplays.minus, short ? "LIMIT" : `−${level.toFixed(1)} V`, short ? "#ffb347" : on ? "#6f9dff" : "#2f3d5c", on || short ? "" : "OFF");
  show(postDisplays.plus, `+${level} V`, on ? "#ff6b5e" : "#5a3431", "");
  show(postDisplays.minus, `−${level} V`, on ? "#6f9dff" : "#2f3d5c", "");
  powerKey.setLit(state.supply.on);
  for (const [v, key] of Object.entries(rangeKeys)) key.setLit(Number(v) === level);
}

// Function generator, to the left
const gen = instrument({ w: 0.28, h: 0.12, d: 0.22, x: -0.56, z: -0.6, color: "#dfe3e6" });
const genJacks = {};
let genDisplay, ampKnob, freqKnob, dc2Knob;
const waveKeys = {};
function waveIcon(type, ctx, w, h, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = h * 0.09;
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (let i = 0; i <= 60; i += 1) {
    const t = i / 60;
    const phase = t * 2;
    const p = phase % 1;
    const y = type === "dc" ? 0.5 : type === "sine" ? Math.sin(phase * Math.PI * 2) : type === "square" ? (p < 0.5 ? 1 : -1) : p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : 4 * p - 4;
    const px = w * 0.15 + t * w * 0.7, py = h / 2 - y * h * 0.26;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();
}
{
  const f = gen.front;
  printedFace(f, gen.w, gen.h, {
    pxPerM: 3600, background: "#2a2e33", z: 0.0006,
    draw: (ctx, at) => {
      silk(ctx, at, "FUNCTION GENERATOR", -0.128, 0.047, 28, { align: "left", weight: 800 });
      silk(ctx, at, "WAVEFORM", -0.077, -0.012, 20, { color: "#c9c6bf", weight: 700 });
      silk(ctx, at, "AMPL Vpp", 0.05, -0.004, 20, { color: "#c9c6bf", weight: 700 });
      silk(ctx, at, "FREQ", 0.1, -0.004, 20, { color: "#c9c6bf", weight: 700 });
      silk(ctx, at, "OUTPUT", -0.011, -0.053, 20, { color: COLOR.yellow, weight: 800 });
      silk(ctx, at, "COM", 0.016, -0.053, 18, { weight: 800 });
      silk(ctx, at, "OUT 2 LEVEL", 0.05, -0.056, 18, { color: "#c9c6bf", weight: 700 });
      silk(ctx, at, "DC OUT 2", 0.105, -0.053, 18, { color: "#c3a1ff", weight: 800 });
    },
  });
  genDisplay = new Display(f, -0.06, 0.015, 0.13, 0.04);
  WAVES.forEach((type, i) => {
    waveKeys[type] = addKey(f, {
      x: -0.115 + i * 0.025, y: -0.03, w: 0.021, h: 0.014, color: "#d9d5cb", name: `wave:${type}`,
      draw: (ctx, w, h) => waveIcon(type, ctx, w, h, "#1d1f22"),
      onPress: () => { state.gen.wave = type; changed(); },
    });
  });
  ampKnob = addKnob(f, { x: 0.05, y: 0.018, radius: 0.013, values: AMPLITUDES, index: AMPLITUDES.indexOf(state.gen.amp), name: "amp", onChange: (v) => { state.gen.amp = v; changed(); } });
  freqKnob = addKnob(f, { x: 0.1, y: 0.018, radius: 0.013, values: FREQUENCIES, index: FREQUENCIES.indexOf(state.gen.freq), name: "freq", onChange: (v) => { state.gen.freq = v; changed(); } });
  dc2Knob = addKnob(f, { x: 0.05, y: -0.036, radius: 0.011, values: DC2_LEVELS, index: DC2_LEVELS.indexOf(state.gen.dc2), name: "dc2", onChange: (v) => { state.gen.dc2 = v; changed(); } });
  genJacks.gen = jack(f, -0.011, -0.036, COLOR.yellow);
  genJacks.genc = jack(f, 0.016, -0.036, COLOR.black);
  genJacks.gen2 = jack(f, 0.105, -0.036, COLOR.purple);
}
const hz = (f) => (f >= 1000 ? `${(f / 1000).toFixed(f % 1000 ? 1 : 0)} kHz` : `${f} Hz`);
function drawGenerator() {
  const g = state.gen;
  genDisplay.draw(JSON.stringify(g), (ctx, w, h) => {
    waveIcon(g.wave, ctx, w * 0.26, h * 0.8, "#ffd65a");
    const wave = { dc: "DC", sine: "SINE", square: "SQUARE", triangle: "TRIANGLE" }[g.wave];
    text(ctx, wave, w * 0.13, h * 0.86, h * 0.13, { color: "#ffd65a", font: MONO, weight: 600 });
    text(ctx, g.wave === "dc" ? `${g.amp.toFixed(2)} V` : `${g.amp.toFixed(2)} Vpp`, w * 0.96, h * 0.25, h * 0.24, { color: "#f6f3ea", font: MONO, align: "right" });
    text(ctx, g.wave === "dc" ? "—" : hz(g.freq), w * 0.96, h * 0.55, h * 0.24, { color: "#f6f3ea", font: MONO, align: "right" });
    text(ctx, `OUT 2  ${g.dc2 >= 0 ? "+" : "−"}${Math.abs(g.dc2).toFixed(1)} V`, w * 0.96, h * 0.84, h * 0.17, { color: "#c3a1ff", font: MONO, align: "right" });
  });
  for (const [type, key] of Object.entries(waveKeys)) key.glow.emissive.set(type === g.wave ? "#5a4300" : "#000000");
}

// Oscilloscope, to the right
const scope = instrument({ w: 0.34, h: 0.19, d: 0.24, x: 0.57, z: -0.6, color: "#e2e4e6" });
const scopeJacks = {};
let scopeScreen, ch1Knob, ch2Knob, timeKnob;
{
  const f = scope.front;
  printedFace(f, scope.w, scope.h, {
    pxPerM: 3600, background: "#2a2e33", z: 0.0006,
    draw: (ctx, at) => {
      silk(ctx, at, "OSCILLOSCOPE", -0.155, 0.083, 28, { align: "left", weight: 800 });
      silk(ctx, at, "CH1 V/div", 0.085, 0.077, 20, { color: COLOR.yellow, weight: 800 });
      silk(ctx, at, "CH2 V/div", 0.142, 0.077, 20, { color: COLOR.cyan, weight: 800 });
      silk(ctx, at, "TIME/div", 0.113, 0.018, 20, { color: "#c9c6bf", weight: 700 });
      silk(ctx, at, "CH1", -0.13, -0.083, 22, { color: COLOR.yellow, weight: 800 });
      silk(ctx, at, "CH2", -0.085, -0.083, 22, { color: COLOR.cyan, weight: 800 });
    },
  });
  scopeScreen = new Display(f, -0.055, 0.012, 0.2, 0.125, { pxPerM: 5000, glass: "#0a1210" });
  ch1Knob = addKnob(f, { x: 0.085, y: 0.052, radius: 0.012, values: VDIV, index: VDIV.indexOf(0.5), name: "ch1", marker: COLOR.yellow, onChange: () => changed() });
  ch2Knob = addKnob(f, { x: 0.142, y: 0.052, radius: 0.012, values: VDIV, index: VDIV.indexOf(1), name: "ch2", marker: COLOR.cyan, onChange: () => changed() });
  timeKnob = addKnob(f, { x: 0.113, y: -0.008, radius: 0.016, values: TDIV, index: TDIV.indexOf(200e-6), name: "time", onChange: () => changed() });
  addKey(f, { x: 0.113, y: -0.052, w: 0.034, h: 0.016, label: "AUTO", color: "#d9d5cb", name: "auto", onPress: () => autoset() });
  scopeJacks.ch1 = jack(f, -0.13, -0.066, COLOR.yellow);
  scopeJacks.ch2 = jack(f, -0.085, -0.066, COLOR.cyan);
}
const vdivLabel = (v) => (v < 1 ? `${Math.round(v * 1000)} mV` : `${v} V`);
const tdivLabel = (t) => (t < 1e-3 ? `${Math.round(t * 1e6)} µs` : `${t * 1000} ms`);
function autoset() {
  for (const [probe, knob] of [["ch1", ch1Knob], ["ch2", ch2Knob]]) {
    const m = measure(model, state.probes[probe], state);
    if (!m) continue;
    const span = Math.max(m.pp, Math.abs(m.mean) * 2, 0.05);
    const i = VDIV.findIndex((v) => v * 6 >= span);
    knob.setIndex(i === -1 ? VDIV.length - 1 : i, true);
  }
  if (state.gen.wave !== "dc") {
    const i = TDIV.findIndex((t) => t * 10 >= 2.5 / state.gen.freq);
    timeKnob.setIndex(i === -1 ? TDIV.length - 1 : i, true);
  }
  changed();
}
function drawScope() {
  const probes = [state.probes.ch1, state.probes.ch2];
  const key = JSON.stringify([probes, ch1Knob.index, ch2Knob.index, timeKnob.index, state, model.short]);
  scopeScreen.draw(key, (ctx, w, h) => {
    ctx.strokeStyle = "#1d3a32";
    ctx.lineWidth = 2;
    for (let i = 1; i < 10; i += 1) { ctx.beginPath(); ctx.moveTo((i * w) / 10, 0); ctx.lineTo((i * w) / 10, h); ctx.stroke(); }
    for (let i = 1; i < 8; i += 1) { ctx.beginPath(); ctx.moveTo(0, (i * h) / 8); ctx.lineTo(w, (i * h) / 8); ctx.stroke(); }
    ctx.strokeStyle = "#2f5a4d";
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    const span = timeKnob.value * 10;
    const N = 320;
    const roots = probes.map((p) => (p ? model.root(p) : null));
    const series = [[], []];
    for (let i = 0; i <= N; i += 1) {
      const s = model.sample((i / N) * span);
      roots.forEach((r, k) => series[k].push(r === null ? null : s.v.get(r) ?? 0));
    }
    const trace = (values, vdiv, color) => {
      if (values[0] === null) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      values.forEach((v, i) => {
        const x = (i / N) * w, y = THREE.MathUtils.clamp(h / 2 - (v / vdiv) * (h / 8), 2, h - 2);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    };
    trace(series[0], ch1Knob.value, COLOR.yellow);
    trace(series[1], ch2Knob.value, COLOR.cyan);
    const size = h * 0.058;
    text(ctx, `CH1 ${vdivLabel(ch1Knob.value)}`, 14, size, size, { color: COLOR.yellow, font: MONO, weight: 600, align: "left" });
    text(ctx, `CH2 ${vdivLabel(ch2Knob.value)}`, 14, size * 2.3, size, { color: COLOR.cyan, font: MONO, weight: 600, align: "left" });
    text(ctx, `${tdivLabel(timeKnob.value)}/div`, w - 14, size, size, { color: "#b9c7c0", font: MONO, weight: 600, align: "right" });
    const a = measure(model, probes[0], state), b = measure(model, probes[1], state);
    if (a) text(ctx, `CH1 ${a.pp.toFixed(2)} Vpp  ${a.mean >= 0 ? "+" : "−"}${Math.abs(a.mean).toFixed(2)} V`, 14, h - size * 2.3, size * 0.9, { color: COLOR.yellow, font: MONO, weight: 600, align: "left" });
    if (b) text(ctx, `CH2 ${b.pp.toFixed(2)} Vpp  ${b.mean >= 0 ? "+" : "−"}${Math.abs(b.mean).toFixed(2)} V`, 14, h - size, size * 0.9, { color: COLOR.cyan, font: MONO, weight: 600, align: "left" });
    if (!a && !b) text(ctx, "Clip a probe onto the circuit", w / 2, h / 2 - size * 1.6, size, { color: "#6f8a80", font: MONO, weight: 600 });
  });
}

// Handheld multimeter on a stand, front right
const meter = new THREE.Group();
meter.position.set(0.36, TOP, -0.33);
meter.rotation.y = Math.atan2(-0.36, 0.33) * 0.6;
lab.add(meter);
const meterJacks = {};
let meterDisplay, meterKnob;
{
  const tilt = new THREE.Group();
  tilt.position.set(0, 0.075, 0);
  tilt.rotation.x = -0.55;
  meter.add(tilt);
  const holster = new THREE.Mesh(rounded(0.094, 0.18, 0.042, 0.012), mat.rubber("#e0a526"));
  holster.castShadow = true;
  tilt.add(holster);
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.004), mat.metal("#9aa0a6"));
  stand.position.set(0, -0.025, -0.045);
  stand.rotation.x = 0.55;
  meter.add(stand);
  stand.position.y = 0.06;
  const f = new THREE.Group();
  f.position.z = 0.0215;
  tilt.add(f);
  const plate = new THREE.Mesh(rounded(0.08, 0.164, 0.002, 0.006), mat.plastic("#2a2e33"));
  f.add(plate);
  printedFace(f, 0.078, 0.16, {
    pxPerM: 5000, background: "#2a2e33", z: 0.0012,
    draw: (ctx, at) => {
      silk(ctx, at, "MULTIMETER", 0, 0.072, 26, { weight: 800 });
      [["OFF", 45], ["V⎓", 0], ["V~", -45]].forEach(([s, deg]) => {
        const a = ((90 + deg) * Math.PI) / 180;
        silk(ctx, at, s, Math.cos(a) * 0.027, -0.012 + Math.sin(a) * 0.027, 28, { weight: 800 });
      });
      silk(ctx, at, "COM", -0.022, -0.074, 24, { weight: 800 });
      silk(ctx, at, "V", 0.022, -0.074, 26, { color: "#ff8a80", weight: 800 });
    },
  });
  meterDisplay = new Display(f, 0, 0.042, 0.066, 0.034, { pxPerM: 6000, glass: "#b8c4a8", z: 0.0016 });
  meterKnob = addKnob(f, { x: 0, y: -0.012, z: 0.0012, radius: 0.016, values: ["off", "dcv", "acv"], index: 1, sweep: 90, name: "meter", color: "#1d1f22", onChange: (v) => { state.meter = v; changed(); } });
  meterJacks.black = jack(f, -0.022, -0.06, COLOR.black);
  meterJacks.red = jack(f, 0.022, -0.06, COLOR.red);
  for (const j of Object.values(meterJacks)) j.group.position.z = 0.0012;
}
function drawMeter() {
  let reading = "";
  if (state.meter !== "off") {
    const red = state.probes.red, black = state.probes.black;
    if (!red || !black) reading = state.meter === "acv" ? "--.-- ~" : "--.--";
    else {
      const T = period(state), n = 96;
      let sum = 0;
      const values = [];
      for (let i = 0; i < n; i += 1) { const s = model.sample((i / n) * T); const v = (s.v.get(model.root(red)) ?? 0) - (s.v.get(model.root(black)) ?? 0); values.push(v); sum += v; }
      const mean = sum / n;
      const v = state.meter === "acv" ? Math.sqrt(values.reduce((s, x) => s + (x - mean) ** 2, 0) / n) : mean;
      reading = `${v < 0 ? "−" : " "}${Math.abs(v).toFixed(2)}`;
    }
  }
  meterDisplay.draw(`${reading}|${state.meter}`, (ctx, w, h) => {
    if (!reading) return;
    text(ctx, reading, w * 0.79, h * 0.56, h * 0.48, { color: "#1b1f18", font: MONO, weight: 700, align: "right" });
    text(ctx, state.meter === "acv" ? "V~" : "V⎓", w * 0.93, h * 0.62, h * 0.24, { color: "#1b1f18", font: MONO, weight: 700, align: "right" });
  });
}

// ---------- the trainer console: circuit selector, guide, undo, reset and solution ----------
const consoleFace = new THREE.Group();
consoleFace.position.set(0, TOP + 0.03, HINGE_Z + 0.072);
consoleFace.rotation.x = -1.1;
lab.add(consoleFace);
let guideDisplay, configKnob, solutionKey;
{
  const body = new THREE.Mesh(rounded(0.56, 0.12, 0.03, 0.006), mat.plastic("#34383d", 0.6));
  body.position.z = -0.0155;
  body.castShadow = body.receiveShadow = true;
  consoleFace.add(body);
  printedFace(consoleFace, 0.55, 0.112, {
    pxPerM: 3600, background: "#2c3035", z: 0.0002,
    draw: (ctx, at) => {
      silk(ctx, at, "CIRCUIT", -0.215, 0.046, 22, { color: "#c9c6bf", weight: 800 });
      const labels = ["INV", "NON-INV", "ADDER", "SUBTR"];
      labels.forEach((s, i) => {
        const deg = 67.5 - i * 45;
        const a = ((90 + deg) * Math.PI) / 180;
        silk(ctx, at, s, -0.215 + Math.cos(a) * 0.034, -0.004 + Math.sin(a) * 0.034, 20, { weight: 800 });
      });
    },
  });
  configKnob = addKnob(consoleFace, {
    x: -0.215, y: -0.004, radius: 0.016, values: CONFIG_ORDER, index: 0, sweep: 135, name: "config",
    onChange: (v) => { pushHistory(); state.config = v; clearWires(); state.supply.on = false; placeParts(); changed(); },
  });
  guideDisplay = new Display(consoleFace, 0.005, 0, 0.32, 0.096, { pxPerM: 4400, glass: "#0e1418" });
  addKey(consoleFace, { x: 0.198, y: 0.026, w: 0.046, h: 0.02, label: "UNDO", color: "#d9d5cb", name: "undo", onPress: () => undo() });
  addKey(consoleFace, { x: 0.25, y: 0.026, w: 0.046, h: 0.02, label: "RESET", color: "#d9d5cb", name: "reset", onPress: () => resetLab() });
  addKey(consoleFace, { x: 0.198, y: -0.03, w: 0.046, h: 0.02, label: "GUIDE", color: "#d9d5cb", led: "#ffcf3f", name: "guide", onPress: (k) => { guided = !guided; k.setLit(guided); changed(); } }).setLit(true);
  solutionKey = addKey(consoleFace, { x: 0.25, y: -0.03, w: 0.046, h: 0.02, label: "SOLUTION", color: "#d9d5cb", led: "#4ade80", name: "solution", onPress: (k) => { showSolution = !showSolution; k.setLit(showSolution); changed(); } });
}

function schematic(ctx, x0, y0, w, h, config) {
  const s = h / 100;
  const X = (x) => x0 + x * s, Y = (y) => y0 + y * s;
  ctx.strokeStyle = "#dfe7e3";
  ctx.fillStyle = "#dfe7e3";
  ctx.lineWidth = 2.2 * s;
  const line = (...pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke(); };
  const resistor = (x1, y, x2, label, color = "#dfe7e3") => {
    const m = (x1 + x2) / 2;
    line([x1, y], [m - 9, y]); line([m + 9, y], [x2, y]);
    ctx.strokeStyle = color; ctx.strokeRect(X(m - 9), Y(y - 4), 18 * s, 8 * s); ctx.strokeStyle = "#dfe7e3";
    text(ctx, label, X(m), Y(y - 10), 9 * s, { color, weight: 700 });
  };
  const vresistor = (x, y1, y2, label) => { const m = (y1 + y2) / 2; line([x, y1], [x, m - 8]); line([x, m + 8], [x, y2]); ctx.strokeRect(X(x - 4), Y(m - 8), 8 * s, 16 * s); text(ctx, label, X(x + 13), Y(m), 9 * s, { color: "#dfe7e3", weight: 700 }); };
  const ground = (x, y) => { line([x, y], [x, y + 5]); line([x - 7, y + 5], [x + 7, y + 5]); line([x - 4.5, y + 8], [x + 4.5, y + 8]); line([x - 2, y + 11], [x + 2, y + 11]); };
  const terminal = (x, y, label, color, below = false) => { ctx.beginPath(); ctx.arc(X(x), Y(y), 2.6 * s, 0, Math.PI * 2); ctx.stroke(); text(ctx, label, X(x), Y(below ? y + 9 : y - 8), 9 * s, { color, weight: 800 }); };
  // op-amp at (95..125, 40..70)
  ctx.beginPath(); ctx.moveTo(X(95), Y(36)); ctx.lineTo(X(95), Y(74)); ctx.lineTo(X(128), Y(55)); ctx.closePath(); ctx.stroke();
  text(ctx, "−", X(100), Y(45), 11 * s, { color: "#dfe7e3" }); text(ctx, "+", X(100), Y(65), 11 * s, { color: "#dfe7e3" });
  text(ctx, "2", X(90), Y(41), 7.5 * s, { color: "#9fb3ab" }); text(ctx, "3", X(90), Y(61), 7.5 * s, { color: "#9fb3ab" }); text(ctx, "6", X(132), Y(50), 7.5 * s, { color: "#9fb3ab" });
  line([110, 44], [110, 32]); text(ctx, "7 +V", X(110), Y(27), 7.5 * s, { color: "#ff8a80" });
  line([110, 66], [110, 78]); text(ctx, "4 −V", X(110), Y(84), 7.5 * s, { color: "#8fb3ff" });
  line([128, 55], [150, 55]);
  terminal(152.6, 55, "VOUT", COLOR.cyan);
  // feedback
  line([80, 45], [80, 14]); resistor(80, 14, 140, "Rf", "#7fd6a0"); line([140, 14], [140, 55]);
  line([80, 45], [95, 45]);
  if (config === "inverting" || config === "adder" || config === "subtractor") {
    resistor(22, 45, 80, "Rin");
    terminal(19.4, 45, "VIN", COLOR.yellow);
  }
  if (config === "inverting" || config === "adder") { line([95, 65], [86, 65]); ground(86, 65); }
  if (config === "adder") { line([66, 45], [66, 22]); resistor(22, 22, 66, "R2"); terminal(19.4, 22, "VIN2", "#c3a1ff"); }
  if (config === "noninverting") {
    // Rin runs from the summing point back to ground on the left, clear of the input below it
    resistor(42, 45, 80, "Rin"); ground(42, 45);
    line([95, 65], [22, 65]); terminal(19.4, 65, "VIN", COLOR.yellow, true);
  }
  if (config === "subtractor") {
    resistor(22, 65, 70, "R3"); terminal(19.4, 65, "VIN2", "#c3a1ff", true); line([70, 65], [95, 65]);
    vresistor(78, 65, 88, "R4"); ground(78, 88);
  }
}

function drawGuide() {
  const config = CONFIGS[state.config];
  const next = stepList.find((s) => !s.done);
  const doneCount = stepList.filter((s) => s.done).length;
  const t = theory(state);
  const vin = measure(model, state.probes.ch1, state), vout = measure(model, state.probes.ch2, state);
  let measured = "";
  if (vin && vout && model.connected(state.probes.ch1, "postin") && model.connected(state.probes.ch2, "postout")) {
    if (!config.usesVin2 && state.gen.wave !== "dc" && vin.pp > 1e-6) {
      const sign = Math.sign(vin.values.reduce((s, v, i) => s + (v - vin.mean) * (vout.values[i] - vout.mean), 0)) || 1;
      measured = `measured  CH2/CH1 = ${((sign * vout.pp) / vin.pp).toFixed(2)}`;
    } else if (!config.usesVin2) measured = `measured  Vout = ${vout.mean.toFixed(2)} V`;
    else measured = `measured  Vout ${vout.pp.toFixed(2)} Vpp about ${vout.mean >= 0 ? "+" : "−"}${Math.abs(vout.mean).toFixed(2)} V`;
  }
  const clipped = vout && model.supplyOn && (Math.max(...vout.values) > state.supply.level - 1.6 || Math.min(...vout.values) < -state.supply.level + 1.6);
  const stray = strayJumpers(state);
  const warning = model.short ? `Short circuit: ${model.short}` : stray.length ? `A wire is not part of this circuit (${stray.length})` : clipped ? `Vout is clipping at ±${(state.supply.level - 1.5).toFixed(1)} V` : "";
  const lines = {
    title: `${config.title}`,
    progress: `${next ? `Step ${doneCount + 1} of ${stepList.length}` : "Circuit complete"}  ·  ±${state.supply.level} V`,
    step: next ? next.text : "Adjust Rin, Rf and the input; compare measured with theory",
    theory: `theory  ${t.text}`,
    measured, warning, guided,
    solution: showSolution && next ? "Solution shown: faint wires and rings mark what is left" : "",
  };
  guideDisplay.draw(JSON.stringify(lines), (ctx, w, h) => {
    schematic(ctx, 6, h * 0.06, h * 1.5, h * 0.9, state.config);
    const x = h * 1.5 + 22;
    text(ctx, lines.title, x, h * 0.12, h * 0.088, { color: "#f2efe7", align: "left", weight: 800 });
    text(ctx, lines.progress, x, h * 0.215, h * 0.058, { color: "#9fb3ab", align: "left", font: MONO, weight: 600 });
    wrap(ctx, lines.step, x, h * 0.335, w - x - 16, h * 0.095, { color: next && guided ? COLOR.next : "#f2efe7", align: "left", weight: 700 });
    if (lines.solution) text(ctx, lines.solution, x, h * 0.565, h * 0.058, { color: "#4ade80", align: "left", weight: 600 });
    text(ctx, lines.theory, x, h * 0.67, h * 0.075, { color: "#cfe0d8", align: "left", font: MONO, weight: 600 });
    if (lines.measured) text(ctx, lines.measured, x, h * 0.79, h * 0.075, { color: COLOR.cyan, align: "left", font: MONO, weight: 600 });
    if (lines.warning) text(ctx, lines.warning, x, h * 0.91, h * 0.075, { color: "#ffb347", align: "left", weight: 700 });
  });
}
function wrap(ctx, s, x, y, maxW, size, opts) {
  ctx.font = `${opts.weight} ${size}px ${SANS}`;
  const words = s.split(" ");
  let line = "";
  let row = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) { text(ctx, line, x, y + row * size * 1.2, size, opts); line = word; row += 1; }
    else line = test;
  }
  text(ctx, line, x, y + row * size * 1.2, size, opts);
}

// ---------- movable things: leads and probes ----------
const movers = [];
const UP = new THREE.Vector3(0, 1, 0);

/** Lab-local point and outward direction of a jack mounted on an instrument face. */
function jackPose(j) {
  const p = lab.worldToLocal(j.point());
  return { p, n: j.normal() };
}

/**
 * A banana-plug lead or a probe pen, tied by a cable to its instrument. Its
 * origin is the tip; the body rises along +y. It seats on a post (leads) or on
 * any contact (probes); let go elsewhere, it returns to where it rests.
 */
class Plug {
  constructor({ kind, id, color, from, park, parkYaw = 0 }) {
    this.kind = kind;
    this.id = id;
    this.color = color;
    this.from = from;
    this.group = new THREE.Group();
    this.parkPos = park;
    this.parkQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, parkYaw, 0, "YXZ"));
    const grip = mat.plastic(color === COLOR.black ? "#2a2c2f" : color, 0.45);
    this.glow = grip;
    const metal = mat.metal("#cfd2d6", 0.25);
    if (kind === "lead") {
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.016, 12).translate(0, 0.008, 0), metal);
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0065, 0.034, 20).translate(0, 0.016 + 0.017, 0), grip);
      this.length = 0.05;
      this.group.add(pin, sleeve);
      sleeve.castShadow = true;
      sleeve.userData.ref = this;
      pickable(sleeve);
    } else {
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.0016, 0.012, 12).rotateX(Math.PI).translate(0, 0.006, 0), metal);
      const guard = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.0065, 0.004, 20).translate(0, 0.016, 0), grip);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.005, 0.09, 20).translate(0, 0.063, 0), grip);
      this.length = 0.108;
      this.group.add(tip, guard, body);
      body.castShadow = true;
      for (const m of [guard, body]) { m.userData.ref = this; pickable(m); }
    }
    hitArea(this.group, new THREE.CylinderGeometry(0.011, 0.011, this.length, 10).translate(0, this.length / 2 + 0.004, 0), this);
    this.cable = new Cable(lab, color === COLOR.black ? "#2a2c2f" : color, kind === "lead" ? 0.0028 : 0.0022);
    this.held = false;
    lab.add(this.group);
    movers.push(this);
    glowTargets.add(this);
    this.park();
  }
  get contact() { return this.kind === "lead" ? state.leads[this.id] : state.probes[this.id]; }
  set contact(v) { if (this.kind === "lead") state.leads[this.id] = v; else state.probes[this.id] = v; }
  // a lead goes into a post or a free hole; a probe clips onto anything
  accepts(id) { return this.kind === "lead" ? isPost(id) || (!isPin(id) && !takenHoles(this).has(id)) : true; }
  park() { this.group.position.copy(this.parkPos); this.group.quaternion.copy(this.parkQuat); this.updateCable(); }
  tip() { return this.group.position.clone(); }
  grabPoint() { return this.group.localToWorld(new THREE.Vector3(0, this.length * 0.6, 0)).sub(lab.position); }
  /** Place from the current state: seated on its contact, square to the trainer, or resting. */
  sync() {
    const c = this.contact;
    if (this.held) return;
    if (c) {
      const p = CONTACT_POINT.get(c).clone();
      if (isPost(c)) {
        // a lead's pin sinks into the post; later plugs stack on the one below
        const below = movers.filter((m) => m instanceof Plug && m !== this && m.contact === c && movers.indexOf(m) < movers.indexOf(this)).length;
        p.y += (this.kind === "lead" ? -0.012 : 0) + below * 0.036;
      } else if (this.kind === "lead") p.y -= 0.009; // its pin sinks into the hole
      this.group.position.copy(toLab(p));
      this.group.quaternion.copy(trainer.quaternion);
    } else this.park();
    this.updateCable();
  }
  moveTo(p) {
    this.group.position.copy(p);
    this.group.quaternion.identity();
    this.updateCable();
  }
  updateCable() {
    const { p, n } = jackPose(this.from);
    const end = lab.worldToLocal(this.group.localToWorld(new THREE.Vector3(0, this.length, 0)));
    // the cable leaves the back of the plug and bends toward its instrument
    const dir = UP.clone().applyQuaternion(this.group.quaternion);
    const toward = p.clone().sub(end).setY(0);
    if (toward.lengthSq() > 1e-6) dir.multiplyScalar(0.4).addScaledVector(toward.normalize(), 1).normalize();
    this.cable.update(p, n, end, dir, heightAt);
  }
  begin() { this.held = true; closeMenu(); return this; }
  drop(p) {
    this.held = false;
    const target = nearestContact(p, this);
    pushHistory();
    this.contact = target;
    changed();
    this.sync();
  }
}

// leads and probes, resting in front of their instruments
const leadPark = (inst, x, ahead = 0.05) => inst.group.localToWorld(new THREE.Vector3(x, 0.0055, inst.front.position.z + ahead)).sub(lab.position);
const leadYaw = (inst) => inst.group.rotation.y;
const plugs = {};
supply.group.updateMatrixWorld(true);
for (const [id, jx] of [["sup+", -0.105], ["supg", -0.0375], ["sup-", 0.03]]) {
  plugs[id] = new Plug({ kind: "lead", id, color: COLOR[LEADS[id].color], from: supplyJacks[id], park: leadPark(supply, jx, 0.052), parkYaw: leadYaw(supply) });
}
gen.group.updateMatrixWorld(true);
plugs.gen = new Plug({ kind: "lead", id: "gen", color: COLOR.yellow, from: genJacks.gen, park: leadPark(gen, -0.011), parkYaw: leadYaw(gen) });
plugs.genc = new Plug({ kind: "lead", id: "genc", color: COLOR.black, from: genJacks.genc, park: leadPark(gen, 0.016), parkYaw: leadYaw(gen) });
plugs.gen2 = new Plug({ kind: "lead", id: "gen2", color: COLOR.purple, from: genJacks.gen2, park: leadPark(gen, 0.105), parkYaw: leadYaw(gen) });
scope.group.updateMatrixWorld(true);
plugs.ch1 = new Plug({ kind: "probe", id: "ch1", color: COLOR.yellow, from: scopeJacks.ch1, park: leadPark(scope, -0.13), parkYaw: leadYaw(scope) });
plugs.ch2 = new Plug({ kind: "probe", id: "ch2", color: COLOR.cyan, from: scopeJacks.ch2, park: leadPark(scope, -0.07), parkYaw: leadYaw(scope) });
meter.updateMatrixWorld(true);
plugs.red = new Plug({ kind: "probe", id: "red", color: COLOR.red, from: meterJacks.red, park: new THREE.Vector3(0.42, TOP + 0.0055, -0.25), parkYaw: meter.rotation.y });
plugs.black = new Plug({ kind: "probe", id: "black", color: COLOR.black, from: meterJacks.black, park: new THREE.Vector3(0.3, TOP + 0.0055, -0.25), parkYaw: meter.rotation.y });

// ---------- wires ----------
// A wire joins two contacts and routes itself square across the board. Its ends
// can be dragged to other contacts, its bead dragged to bend it a different way,
// and a click opens a wheel to recolour or delete it.
const wires = [];
const wireLayer = new THREE.Group();
board.add(wireLayer);
const WIRE_R = 0.0016;
const BEAD = new THREE.SphereGeometry(0.0028, 14, 10);

/** Height above the trainer face at which a wire meets a contact. */
const endHeight = (id) => (isPost(id) ? 0.007 : isPin(id) ? BOARD_H + 0.0045 : BOARD_H - 0.003);

/** A smooth tube along a polyline, its corners rounded. */
function tubeAlong(points, radius, radial = 8) {
  const pts = points.filter((p, i) => i === 0 || p.distanceTo(points[i - 1]) > 1e-5);
  const path = new THREE.CurvePath();
  let prev = pts[0];
  for (let i = 1; i < pts.length - 1; i += 1) {
    const c = pts[i], n = pts[i + 1];
    const k = Math.min(0.0035, c.distanceTo(prev) / 2, c.distanceTo(n) / 2);
    const p1 = c.clone().addScaledVector(prev.clone().sub(c).normalize(), k);
    const p2 = c.clone().addScaledVector(n.clone().sub(c).normalize(), k);
    if (p1.distanceTo(prev) > 1e-6) path.add(new THREE.LineCurve3(prev, p1));
    path.add(new THREE.QuadraticBezierCurve3(p1, c, p2));
    prev = p2;
  }
  path.add(new THREE.LineCurve3(prev, pts[pts.length - 1]));
  const segments = THREE.MathUtils.clamp(Math.round(path.getLength() / 0.0015), 16, 320);
  return new THREE.TubeGeometry(path, segments, radius, radial, false);
}

/** The 3D path of a wire: down into each contact, across at its layer's height. */
function wirePoints(route, a, b, ya, yb, height) {
  const out = [new THREE.Vector3(a.x, ya, a.z)];
  for (const p of route.points) out.push(new THREE.Vector3(p.x, height, p.z));
  out.push(new THREE.Vector3(b.x, yb, b.z));
  return out;
}

/** What a wire between these contacts has to go around: the parts and other wires' ends. */
function obstaclesFor(mine, except) {
  return [
    ...partObstacles(state.config).filter((o) => !mine.includes(o.what)),
    ...[...wires.filter((w) => w !== except).flatMap((w) => [w.a, w.b]), ...Object.values(state.leads)].filter((id) => id && !mine.includes(id) && !isPost(id) && !isPin(id)).map(endObstacle),
  ];
}
function routeBetween(a, b, ids, { via = null, except = null } = {}) {
  return routeWire(a, b, {
    obstacles: obstaclesFor(ids, except),
    wires: wires.filter((w) => w !== except && w.route).map((w) => w.route.points),
    lanesX: LANES_X, lanesZ: LANES_Z, via,
  });
}

let layerCount = 0;
class Wire {
  constructor({ a, b, color, bend = null }) {
    this.a = a;
    this.b = b;
    this.color = color;
    this.bend = bend;
    this.free = [null, null]; // where a dragged end is, until it lands
    this.layer = layerCount++ % 4;
    this.mat = mat.plastic(COLOR[color], 0.45);
    this.glow = this.mat;
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), this.mat);
    this.mesh.castShadow = true;
    this.mesh.frustumCulled = false;
    this.mesh.userData.ref = this;
    this.hit = new THREE.Mesh(new THREE.BufferGeometry(), HIT);
    this.hit.userData.ref = this;
    wireLayer.add(this.mesh, this.hit);
    pickable(this.hit);
    this.ends = [0, 1].map((i) => new WireEnd(this, i));
    this.bead = new WireBend(this);
    glowTargets.add(this);
    wires.push(this);
    this.update();
  }
  id(i) { return i ? this.b : this.a; }
  endXZ(i) { return this.free[i] ?? contactXZ(this.id(i)); }
  endY(i) { return this.free[i] ? BOARD_H + 0.006 : endHeight(this.id(i)); }
  update() {
    const a = this.endXZ(0), b = this.endXZ(1);
    this.route = routeBetween(a, b, [this.a, this.b], { via: this.bend, except: this });
    const height = BOARD_H + 0.0035 + this.layer * 0.0013 + (this.route.over ? 0.012 : 0);
    const points = wirePoints(this.route, a, b, this.endY(0), this.endY(1), height);
    this.mesh.geometry.dispose();
    this.mesh.geometry = tubeAlong(points, WIRE_R);
    this.hit.geometry.dispose();
    this.hit.geometry = tubeAlong(points, 0.0042, 6);
    for (const e of this.ends) e.place();
    // the bead sits on the lane a student chose, else halfway along the run
    const mid = this.bend ? laneBead(this.bend, a, b) : midpoint(this.route.points);
    this.bead.place(new THREE.Vector3(mid.x, height, mid.z));
    dirty();
  }
  setColor(color) {
    this.color = color;
    this.mat.color.set(COLOR[color]);
  }
  remove() {
    wireLayer.remove(this.mesh, this.hit);
    this.mesh.geometry.dispose();
    this.hit.geometry.dispose();
    unpick(this.hit);
    for (const part of [...this.ends, this.bead]) part.dispose();
    glowTargets.delete(this);
    wires.splice(wires.indexOf(this), 1);
    if (menuWire === this) closeMenu();
  }
}
function laneBead(bend, a, b) {
  const clamp = (v, p, q) => THREE.MathUtils.clamp(v, Math.min(p, q), Math.max(p, q));
  return bend.lane === "x" ? { x: bend.x, z: clamp(bend.z, a.z, b.z) } : { x: clamp(bend.x, a.x, b.x), z: bend.z };
}
function midpoint(points) {
  const lengths = points.slice(1).map((q, i) => Math.hypot(q.x - points[i].x, q.z - points[i].z));
  let half = lengths.reduce((s, l) => s + l, 0) / 2;
  for (let i = 0; i < lengths.length; i += 1) {
    if (half <= lengths[i]) { const t = lengths[i] ? half / lengths[i] : 0; return { x: points[i].x + (points[i + 1].x - points[i].x) * t, z: points[i].z + (points[i + 1].z - points[i].z) * t }; }
    half -= lengths[i];
  }
  return points[0];
}

/** One end of a wire: a stripped tip in the contact and an insulated sleeve to take hold of. */
class WireEnd {
  constructor(wire, index) {
    this.wire = wire;
    this.index = index;
    this.held = false;
    this.group = new THREE.Group();
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.0007, 0.0007, 0.008, 8).translate(0, -0.001, 0), mat.metal("#c4c7cb", 0.3));
    this.sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 0.005, 12).translate(0, 0.0055, 0), wire.mat);
    this.sleeve.userData.ref = this;
    this.group.add(tip, this.sleeve);
    wireLayer.add(this.group);
    pickable(this.sleeve);
    this.hitMesh = hitArea(this.group, new THREE.CylinderGeometry(0.005, 0.005, 0.014, 10).translate(0, 0.005, 0), this);
    this.glow = wire.mat;
    movers.push(this);
  }
  get contact() { return this.wire.id(this.index); }
  place() {
    const p = this.wire.endXZ(this.index);
    this.group.position.set(p.x, this.wire.endY(this.index), p.z);
  }
  tip() { return toLab(this.group.position); }
  grabPoint() { return toLab(this.group.position.clone().add(new THREE.Vector3(0, 0.006, 0))); }
  accepts(id) { return !isPost(id) && !isPin(id) && id !== this.wire.id(1 - this.index); }
  begin() { this.held = true; this.before = snapshot(); closeMenu(); return this; }
  moveTo(p) {
    const q = toBoard(p);
    this.wire.free[this.index] = { x: q.x, z: q.z };
    this.wire.update();
  }
  drop(p) {
    this.held = false;
    const target = nearestContact(p, this);
    this.wire.free[this.index] = null;
    if (target && target !== this.contact) {
      history.push(this.before);
      if (this.index) this.wire.b = target; else this.wire.a = target;
      this.wire.bend = null;
    }
    this.wire.update();
    syncWires();
    changed();
  }
  dispose() {
    wireLayer.remove(this.group);
    unpick(this.sleeve);
    unpick(this.hitMesh);
    movers.splice(movers.indexOf(this), 1);
  }
}

/**
 * The bead on a wire's run. Dragged sideways it moves the wire's run up the
 * board to another lane; dragged along the rows it moves its run across.
 */
class WireBend {
  constructor(wire) {
    this.wire = wire;
    this.held = false;
    this.mesh = new THREE.Mesh(BEAD, new THREE.MeshStandardMaterial({ color: "#f4f1ea", roughness: 0.4 }));
    this.mesh.visible = false;
    this.mesh.userData.ref = this;
    wireLayer.add(this.mesh);
    this.hitMesh = hitArea(this.mesh, new THREE.SphereGeometry(0.0065, 10, 8), this);
    this.glow = wire.mat;
    movers.push(this);
  }
  place(p) { this.mesh.position.copy(p); }
  tip() { return toLab(this.mesh.position); }
  grabPoint() { return this.tip(); }
  begin() { this.held = true; this.moved = false; this.before = snapshot(); this.from = this.mesh.position.clone(); closeMenu(); return this; }
  moveTo(p) {
    const q = toBoard(p);
    const snap = (v) => Math.round(v / 0.005) * 0.005; // half-pitch steps keep runs between holes
    const lane = Math.abs(q.x - this.from.x) >= Math.abs(q.z - this.from.z) ? "x" : "z";
    this.wire.bend = { x: snap(q.x), z: snap(q.z), lane };
    this.moved = true;
    this.wire.update();
  }
  drop() {
    this.held = false;
    if (this.moved) { history.push(this.before); syncWires(); changed(); }
  }
  dispose() {
    wireLayer.remove(this.mesh);
    unpick(this.hitMesh);
    movers.splice(movers.indexOf(this), 1);
  }
}

function syncWires() {
  state.jumpers = wires.map((w, i) => ({ id: `w${i}`, a: w.a, b: w.b, color: w.color, bend: w.bend }));
}
function clearWires() {
  for (const w of [...wires]) w.remove();
  layerCount = 0;
  state.jumpers = [];
}
function restoreWires(list) {
  clearWires();
  for (const saved of list) new Wire(saved);
  syncWires();
}

/** Holes already holding a part's leg, a wire end or a lead (pins and posts take any number). */
function takenHoles(except) {
  const taken = new Set([...Object.values(PINS), ...partsFor(state.config).flatMap((p) => p.legs)]);
  for (const w of wires) for (const e of w.ends) if (e !== except && !isPost(e.contact) && !isPin(e.contact)) taken.add(e.contact);
  for (const [id, c] of Object.entries(state.leads)) if (c && !isPost(c) && plugs[id] !== except) taken.add(c);
  return taken;
}

/** Lay a wire between two contacts, coloured for the job it does. */
function addWire(a, b) {
  pushHistory();
  const wire = new Wire({ a, b, color: suggestColor(state.config, a, b) });
  syncWires();
  changed();
  return wire;
}

// ---------- laying a wire: click one contact, then another ----------
let wireStart = null;
const preview = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.55, depthWrite: false }));
preview.visible = false;
preview.frustumCulled = false;
wireLayer.add(preview);
let previewKey = "";
function showPreview(to) {
  if (!wireStart || !to) { preview.visible = false; previewKey = ""; return; }
  const key = `${wireStart}|${to.id ?? `${to.x.toFixed(3)},${to.z.toFixed(3)}`}`;
  if (key === previewKey) return;
  previewKey = key;
  const a = contactXZ(wireStart), b = to.id ? contactXZ(to.id) : to;
  const route = routeBetween(a, b, [wireStart, to.id]);
  const points = wirePoints(route, a, b, endHeight(wireStart), to.id ? endHeight(to.id) : BOARD_H + 0.006, BOARD_H + 0.0035 + (route.over ? 0.012 : 0));
  preview.geometry.dispose();
  preview.geometry = tubeAlong(points, WIRE_R * 1.1);
  preview.material.color.set(COLOR[to.id ? suggestColor(state.config, wireStart, to.id) : "white"]);
  preview.visible = true;
}
/** Whether a click on this contact can start or finish a wire. */
// wires go into breadboard holes only: posts are for instrument leads, and a pin is reached through its row
function canWire(id) { return !isPost(id) && !isPin(id) && !takenHoles().has(id); }
/** Where a wire end already sits in this hole, so a click there opens that wire instead. */
const wireAt = (id) => (isPost(id) || isPin(id) ? null : wires.find((w) => w.a === id || w.b === id) ?? null);
function contactClicked(id) {
  closeMenu();
  if (!wireStart) {
    const there = wireAt(id);
    if (there) { openMenu(there); return "menu"; }
    if (!canWire(id)) return "taken";
    wireStart = id;
    ringAt(startRing, id);
    return "start";
  }
  if (id === wireStart) { cancelWire(); return "cancel"; }
  if (!canWire(id)) return "taken";
  addWire(wireStart, id);
  cancelWire();
  return "wire";
}
function cancelWire() {
  wireStart = null;
  startRing.visible = false;
  showPreview(null);
}

// ---------- the colour wheel ----------
const menu = new THREE.Group();
menu.visible = false;
board.add(menu);
let menuWire = null;
const menuItems = [];
class MenuItem {
  constructor(action, angle, radius, draw) {
    this.action = action;
    const r = action === "delete" ? 0.0074 : 0.0066;
    const view = canvasTexture(128, 128);
    draw(view.ctx, 128);
    view.texture.needsUpdate = true;
    this.mesh = new THREE.Mesh(new THREE.CircleGeometry(r, 32), new THREE.MeshBasicMaterial({ map: view.texture, transparent: true, depthTest: false, toneMapped: false }));
    this.mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.0004);
    this.mesh.renderOrder = 21;
    this.mesh.userData.ref = this;
    this.outline = new THREE.Mesh(new THREE.RingGeometry(r + 0.0006, r + 0.0016, 32), new THREE.MeshBasicMaterial({ color: "#ffffff", depthTest: false, transparent: true }));
    this.outline.position.copy(this.mesh.position);
    this.outline.renderOrder = 21;
    this.outline.visible = false;
    menu.add(this.mesh, this.outline);
    pickable(this.mesh);
    menuItems.push(this);
  }
  get label() {
    if (this.action === "delete") return "Delete this wire";
    if (this.action === "auto") return "Re-route automatically";
    return `${this.action[0].toUpperCase()}${this.action.slice(1)} · ${ROLE[this.action]}`;
  }
}
{
  const back = new THREE.Mesh(new THREE.CircleGeometry(0.032, 48), new THREE.MeshBasicMaterial({ color: "#16191c", transparent: true, opacity: 0.82, depthTest: false }));
  back.renderOrder = 20;
  menu.add(back);
  const swatch = (color) => (ctx, s) => {
    ctx.fillStyle = COLOR[color];
    ctx.beginPath(); ctx.arc(s / 2, s / 2, s / 2 - 2, 0, Math.PI * 2); ctx.fill();
    if (color === "black") { ctx.strokeStyle = "#8a9096"; ctx.lineWidth = 6; ctx.stroke(); }
  };
  const actions = [...WIRE_COLORS, "auto"];
  actions.forEach((action, i) => {
    const angle = Math.PI / 2 - (i / actions.length) * Math.PI * 2;
    new MenuItem(action, angle, 0.0225, action === "auto" ? (ctx, s) => {
      ctx.fillStyle = "#3a4048";
      ctx.beginPath(); ctx.arc(s / 2, s / 2, s / 2 - 2, 0, Math.PI * 2); ctx.fill();
      text(ctx, "AUTO", s / 2, s / 2 + 2, 30, { color: "#f4f1ea", weight: 800 });
    } : swatch(action));
  });
  new MenuItem("delete", 0, 0, (ctx, s) => {
    ctx.fillStyle = "#b8322b";
    ctx.beginPath(); ctx.arc(s / 2, s / 2, s / 2 - 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 12; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(s * 0.33, s * 0.33); ctx.lineTo(s * 0.67, s * 0.67); ctx.moveTo(s * 0.67, s * 0.33); ctx.lineTo(s * 0.33, s * 0.67); ctx.stroke();
  });
}
/** Open a wire's wheel just above where it was clicked (its bead, by default). */
function openMenu(wire, at = wire.bead.mesh.position) {
  cancelWire();
  menuWire = wire;
  menu.position.set(at.x, BOARD_H + 0.03, at.z);
  for (const item of menuItems) item.outline.visible = item.action === wire.color;
  menu.visible = true;
}
function closeMenu() { menuWire = null; menu.visible = false; }
function applyMenu(item) {
  const wire = menuWire;
  if (!wire) return;
  pushHistory();
  if (item.action === "delete") wire.remove();
  else if (item.action === "auto") { wire.bend = null; wire.update(); }
  else wire.setColor(item.action);
  closeMenu();
  syncWires();
  changed();
}
// the wheel turns to face whoever is looking at it
const menuQuat = new THREE.Quaternion();
function faceMenu(cam) {
  if (!menu.visible) return;
  board.getWorldQuaternion(menuQuat).invert();
  menu.quaternion.copy(menuQuat.multiply(cam.getWorldQuaternion(new THREE.Quaternion())));
}

// ---------- surfaces ----------
/** Lab height of the trainer frame's plane at height s above its face's base, or null off the trainer. */
function trainerSurface(x, z, s) {
  const zl = (z - HINGE_Z - s * Math.sin(TILT)) / Math.cos(TILT);
  if (Math.abs(x) > TRAINER_W / 2 || zl < -TRAINER_D || zl > 0) return null;
  return { y: TOP + s * Math.cos(TILT) - zl * Math.sin(TILT), zb: zl - BOARD_CZ };
}
// what a cable lying across the bench rests on: bench, shelf, console, trainer and board
function heightAt(x, z) {
  let h = TOP;
  const t = trainerSurface(x, z, TRAINER_H);
  if (t) {
    h = t.y;
    if (Math.abs(x) < BOARD.w / 2 && Math.abs(t.zb) < BOARD.l / 2) h = trainerSurface(x, z, TRAINER_H + BOARD_H)?.y ?? h;
  }
  if (Math.abs(x) < 0.28 && z > HINGE_Z && z < HINGE_Z + 0.13) h = Math.max(h, TOP + 0.06);
  if (Math.abs(x) < 0.4 && z > -1.07 && z < -0.8) h = Math.max(h, SHELF_Y);
  return h;
}

/** The nearest contact this mover can use, within snapping reach, or null. */
function nearestContact(p, mover) {
  const q = toBoard(p);
  const taken = mover instanceof WireEnd ? takenHoles(mover) : null;
  let best = null;
  let bestD = Infinity;
  for (const [id, point] of CONTACT_POINT) {
    if (!mover.accepts(id)) continue;
    if (taken?.has(id)) continue;
    const reach = isPost(id) ? (mover.kind === "lead" ? 0.03 : 0.018) : 0.0075;
    const d = Math.hypot(point.x - q.x, point.z - q.z) + Math.max(0, q.y - point.y - 0.03);
    if (d < reach && d < bestD) { best = id; bestD = d; }
  }
  return best;
}
/** The contact nearest a board-frame point, for pointing and clicking. */
function contactAt(q, reachHole = 0.0065, reachPost = 0.014) {
  let best = null;
  let bestD = Infinity;
  for (const [id, point] of CONTACT_POINT) {
    const d = Math.hypot(point.x - q.x, point.z - q.z);
    if (d < (isPost(id) ? reachPost : reachHole) && d < bestD) { best = id; bestD = d; }
  }
  return best;
}

// ---------- highlights: the next step, the snap target, the solution ----------
const ringGeo = new THREE.TorusGeometry(1, 0.14, 8, 32).rotateX(Math.PI / 2);
const makeRing = (color) => { const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, depthWrite: false })); m.visible = false; m.renderOrder = 5; board.add(m); return m; };
const guideRings = [makeRing(COLOR.next), makeRing(COLOR.next)];
const snapRing = makeRing("#4ade80");
const startRing = makeRing("#ffffff");
function ringAt(ring, id) {
  const p = CONTACT_POINT.get(id);
  if (!p) { ring.visible = false; return; }
  ring.position.copy(p).add(new THREE.Vector3(0, 0.0015, 0));
  ring.userData.size = isPost(id) ? 0.012 : 0.0048;
  ring.scale.setScalar(ring.userData.size);
  ring.visible = true;
}
let guideTargets = new Set();
function updateGuide() {
  const next = guided ? stepList.find((s) => !s.done) : null;
  guideRings.forEach((r) => (r.visible = false));
  guideTargets = new Set();
  if (!next) return;
  if (next.kind === "jumper") {
    ringAt(guideRings[0], next.a);
    ringAt(guideRings[1], next.b);
  } else if (next.kind === "lead") {
    ringAt(guideRings[0], next.target);
    guideTargets.add(plugs[next.id]);
  } else if (next.kind === "power") {
    guideTargets.add(powerKey);
  } else if (next.kind === "probe") {
    ringAt(guideRings[0], next.target);
    guideTargets.add(plugs[next.id]);
  }
}

// the solution: every connection still missing, drawn faintly in place
const solution = new THREE.Group();
board.add(solution);
const solutionRings = [];
function updateSolution() {
  for (const child of [...solution.children]) { solution.remove(child); if (child.geometry !== ringGeo) child.geometry.dispose(); }
  if (!showSolution) return;
  const placed = [];
  let ring = 0;
  for (const step of stepList) {
    if (step.done) continue;
    if (step.kind === "jumper") {
      const a = contactXZ(step.a), b = contactXZ(step.b);
      const route = routeWire(a, b, {
        obstacles: [...obstaclesFor([step.a, step.b], null), ...placed.flatMap((p) => [p.a, p.b]).filter((id) => id !== step.a && id !== step.b && !isPost(id) && !isPin(id)).map(endObstacle)],
        wires: [...wires.map((w) => w.route.points), ...placed.map((p) => p.points)], lanesX: LANES_X, lanesZ: LANES_Z,
      });
      placed.push({ a: step.a, b: step.b, points: route.points });
      const ghost = new THREE.Mesh(tubeAlong(wirePoints(route, a, b, endHeight(step.a), endHeight(step.b), BOARD_H + 0.0035 + (route.over ? 0.012 : 0)), WIRE_R * 1.15), new THREE.MeshBasicMaterial({ color: COLOR[step.color], transparent: true, opacity: 0.38, depthWrite: false }));
      ghost.renderOrder = 4;
      solution.add(ghost);
    } else if (step.kind === "lead" || step.kind === "probe") {
      if (!solutionRings[ring]) solutionRings[ring] = makeRing("#4ade80");
      const r = solutionRings[ring++];
      board.remove(r);
      solution.add(r);
      ringAt(r, step.target);
    }
  }
}

const hovered = new Set();
function updateGlow(time) {
  const blink = 0.5 + 0.5 * Math.sin(time * 0.007);
  for (const target of glowTargets) {
    const m = target.glow;
    if (!m?.emissive) continue;
    if (hovered.has(target) || target === menuWire) m.emissive.setRGB(0.22, 0.22, 0.22);
    else if (guideTargets.has(target)) m.emissive.setRGB(0.45 * blink, 0.33 * blink, 0.02);
    else if (target instanceof Key && target.name?.startsWith("wave:") && target.name === `wave:${state.gen.wave}`) m.emissive.set("#5a4300");
    else m.emissive.setRGB(0, 0, 0);
  }
  // a wire shows its bend bead while it is pointed at, held or open
  for (const w of wires) w.bead.mesh.visible = hovered.has(w) || hovered.has(w.bead) || w.bead.held || w === menuWire;
  for (const ring of guideRings) if (ring.visible) ring.scale.setScalar(ring.userData.size * (1 + 0.25 * blink));
  if (startRing.visible) startRing.scale.setScalar(startRing.userData.size * (1.1 + 0.3 * blink));
}

// ---------- history ----------
function snapshot() {
  return {
    config: state.config,
    supplyOn: state.supply.on,
    wires: wires.map((w) => ({ a: w.a, b: w.b, color: w.color, bend: w.bend })),
    leads: { ...state.leads },
    probes: { ...state.probes },
  };
}
function pushHistory() {
  history.push(snapshot());
  if (history.length > 60) history.shift();
}
function applySnapshot(s) {
  const configChanged = s.config !== state.config;
  state.config = s.config;
  state.supply.on = s.supplyOn;
  state.leads = { ...s.leads };
  state.probes = { ...s.probes };
  if (configChanged) { configKnob.setValue(s.config); placeParts(); }
  closeMenu();
  cancelWire();
  restoreWires(s.wires);
  changed();
  for (const m of movers) if (m instanceof Plug) m.sync();
}
function undo() {
  const s = history.pop();
  if (s) applySnapshot(s);
}
function resetLab() {
  pushHistory();
  const keep = state.config;
  state = { ...initialState(), config: keep };
  ampKnob.setValue(state.gen.amp);
  freqKnob.setValue(state.gen.freq);
  dc2Knob.setValue(state.gen.dc2);
  meterKnob.setValue(state.meter);
  ch1Knob.setValue(0.5); ch2Knob.setValue(1); timeKnob.setValue(200e-6);
  closeMenu();
  cancelWire();
  clearWires();
  placeParts();
  changed();
  for (const m of movers) if (m instanceof Plug) m.sync();
}

onChange(() => {
  tipLabel.style.display = "none"; // what it named may have just changed
  drawSupply();
  drawGenerator();
  drawModules();
  drawScope();
  drawMeter();
  drawGuide();
  updateGuide();
  updateSolution();
});

// ---------- desktop interaction ----------
// A click on a contact lays wires; a click on a wire opens its colour wheel; a
// drag moves plugs, probes, wire ends and bends, or turns a knob. Dragging the
// empty bench orbits the view.
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, TOP + 0.085, -0.56);
controls.enableDamping = true;
controls.minDistance = 0.15;
controls.maxDistance = 2.2;
controls.maxPolarAngle = Math.PI * 0.49;
controls.update();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let drag = null;
let press = null; // a press that becomes a click, or a drag once the pointer moves
const boardMatrix = new THREE.Matrix4();
function rayFrom(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  return raycaster.ray.clone();
}
function hit(ray) {
  raycaster.ray.copy(ray);
  const found = raycaster.intersectObjects(pickables, false).filter((f) => menu.visible || !(refOf(f.object) instanceof MenuItem));
  // the wheel draws over everything, so it wins when it is under the pointer
  const onMenu = found.find((f) => refOf(f.object) instanceof MenuItem);
  const first = onMenu ?? found[0];
  return first ? { ref: refOf(first.object), point: first.point } : null;
}
/** Where a ray meets the board face, in the board frame. */
function boardPoint(ray, lift = 0) {
  boardMatrix.copy(board.matrixWorld).invert();
  const local = ray.clone().applyMatrix4(boardMatrix);
  return local.intersectPlane(new THREE.Plane(UP, -(BOARD_H + lift)), new THREE.Vector3());
}
// where a dragged tip goes: just above the trainer face, else just above the bench
function dragPoint(ray) {
  const q = boardPoint(ray, 0.004);
  if (q && Math.abs(q.x) < TRAINER_W / 2 && q.z > FACE_Z0 && q.z < FACE_Z1) return toLab(q);
  const local = ray.clone();
  local.origin.copy(lab.worldToLocal(ray.origin.clone()));
  return local.intersectPlane(new THREE.Plane(UP, -(TOP + 0.004)), new THREE.Vector3());
}
function showTip(e, s) {
  if (!s) { tipLabel.style.display = "none"; return; }
  const rect = stage.getBoundingClientRect();
  tipLabel.textContent = s;
  tipLabel.style.left = `${e.clientX - rect.left}px`;
  tipLabel.style.top = `${e.clientY - rect.top}px`;
  tipLabel.style.display = "block";
}
const wireOf = (ref) => (ref instanceof Wire ? ref : ref instanceof WireEnd || ref instanceof WireBend ? ref.wire : null);
renderer.domElement.addEventListener("pointerdown", (e) => {
  if (renderer.xr.isPresenting || e.button !== 0) return;
  const ray = rayFrom(e);
  const h = hit(ray);
  press = { x: e.clientX, y: e.clientY, ref: h?.ref ?? null, point: h ? board.worldToLocal(h.point.clone()) : null, contact: null, id: e.pointerId };
  if (h?.ref instanceof MenuItem) { applyMenu(h.ref); press = null; return; }
  if (h?.ref instanceof Key) { h.ref.press(); press = null; return; }
  if (h?.ref instanceof Knob) {
    controls.enabled = false;
    renderer.domElement.setPointerCapture(e.pointerId);
    drag = { kind: "knob", knob: h.ref, x: e.clientX, y: e.clientY, start: h.ref.index };
    press = null;
    return;
  }
  if (h?.ref instanceof Plug) {
    controls.enabled = false;
    renderer.domElement.setPointerCapture(e.pointerId);
    drag = { kind: "mover", mover: h.ref.begin() };
    hovered.clear();
    hovered.add(h.ref);
    press = null;
    return;
  }
  if (wireOf(h?.ref)) { controls.enabled = false; renderer.domElement.setPointerCapture(e.pointerId); return; }
  // nothing to take hold of: a click on a contact lays wires, a drag orbits the view
  const q = boardPoint(ray);
  press.contact = q ? contactAt(q) : null;
});
renderer.domElement.addEventListener("pointermove", (e) => {
  if (renderer.xr.isPresenting) return;
  if (press && !drag && wireOf(press.ref) && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 4) {
    // a wire pressed and pulled: its end moves, or its run bends
    const mover = press.ref instanceof WireEnd ? press.ref : wireOf(press.ref).bead;
    drag = { kind: "mover", mover: mover.begin() };
    hovered.clear();
    hovered.add(mover.wire);
  }
  if (!drag) {
    const ray = rayFrom(e);
    const h = hit(ray);
    hovered.clear();
    snapRing.visible = false;
    if (h) {
      hovered.add(h.ref);
      const w = wireOf(h.ref);
      if (w) hovered.add(w);
      renderer.domElement.style.cursor = h.ref instanceof Key || h.ref instanceof MenuItem ? "pointer" : "grab";
      showTip(e, h.ref instanceof MenuItem ? h.ref.label : w ? `Wire ${contactName(w.a)} → ${contactName(w.b)} · click to recolour, drag to move` : null);
      if (!w) showPreview(null);
      return;
    }
    const q = boardPoint(ray);
    const c = q ? contactAt(q) : null;
    if (c) {
      ringAt(snapRing, c);
      const busy = !canWire(c) && !wireAt(c);
      const action = isPin(c) ? "wire into a hole in its row" : isPost(c) ? "for instrument leads" : wireAt(c) && !wireStart ? "click to open its wire" : busy ? "taken" : wireStart ? (c === wireStart ? "click to cancel" : "click to finish the wire") : "click to start a wire";
      showTip(e, `${contactName(c)} · ${action}`);
      renderer.domElement.style.cursor = busy ? "not-allowed" : "crosshair";
      showPreview(c !== wireStart && canWire(c) ? { id: c } : null);
    } else {
      showTip(e, wireStart ? "Click a second contact · Esc cancels" : null);
      renderer.domElement.style.cursor = "";
      showPreview(q ? { x: q.x, z: q.z } : null);
    }
    return;
  }
  showTip(e, null);
  if (drag.kind === "knob") {
    const n = Math.round(((e.clientX - drag.x) - (e.clientY - drag.y)) / 24);
    drag.knob.setIndex(drag.start + n);
    return;
  }
  const p = dragPoint(rayFrom(e));
  if (!p) return;
  if (drag.mover instanceof Plug) p.add(new THREE.Vector3(0, 0.006, 0));
  drag.mover.moveTo(p);
  const target = drag.mover instanceof WireBend ? null : nearestContact(p, drag.mover);
  if (target) ringAt(snapRing, target); else snapRing.visible = false;
  dirty();
});
function endPress(e) {
  if (drag) {
    if (drag.kind === "mover") drag.mover.drop(drag.mover.tip());
  } else if (press && e?.type === "pointerup" && Math.hypot(e.clientX - press.x, e.clientY - press.y) <= 4) {
    // a click
    const w = wireOf(press.ref);
    if (w) openMenu(w, press.point);
    else if (press.contact) contactClicked(press.contact);
    else { cancelWire(); closeMenu(); }
  }
  snapRing.visible = false;
  drag = null;
  press = null;
  controls.enabled = true;
  hovered.clear();
  if (e?.pointerId !== undefined && renderer.domElement.hasPointerCapture(e.pointerId)) renderer.domElement.releasePointerCapture(e.pointerId);
}
renderer.domElement.addEventListener("pointerup", endPress);
renderer.domElement.addEventListener("pointercancel", endPress);
renderer.domElement.addEventListener("pointerleave", () => { if (!drag) { hovered.clear(); showTip(null, null); } });
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { cancelWire(); closeMenu(); }
  if ((e.key === "Delete" || e.key === "Backspace") && menuWire) { e.preventDefault(); applyMenu(menuItems.find((i) => i.action === "delete")); }
});

// ---------- VR ----------
// Controllers are drawn as the headset's own models. A short pointer with a bead
// at its end presses keys by pushing into them. The trigger, with the bead at a
// contact, lays wires the way a click does, and opens a wire's colour wheel; the
// grip (or a trigger away from any contact) takes the nearest knob, plug, probe,
// wire end or wire bend within reach of the palm.
const controllerModels = new XRControllerModelFactory();
const PALM = new THREE.Vector3(0, -0.006, -0.035);
const POKE_REACH = 0.07;
const BEAD_IDLE = new THREE.Color(COLOR.next);
const BEAD_READY = new THREE.Color("#4ade80");
const holders = [0, 1].map((i) => {
  const ctrl = renderer.xr.getController(i);
  const grip = renderer.xr.getControllerGrip(i);
  grip.add(controllerModels.createControllerModel(grip));
  const pointerGroup = new THREE.Group();
  const line = new THREE.Mesh(new THREE.CylinderGeometry(0.0006, 0.0009, POKE_REACH, 6).rotateX(Math.PI / 2).translate(0, 0, -POKE_REACH / 2), new THREE.MeshBasicMaterial({ color: "#f2f4f5", transparent: true, opacity: 0.45, depthWrite: false }));
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.004, 14, 10), new THREE.MeshBasicMaterial({ color: BEAD_IDLE }));
  bead.position.z = -POKE_REACH;
  pointerGroup.add(line, bead);
  pointerGroup.visible = false;
  ctrl.add(pointerGroup);
  const holder = { ctrl, grip, line, bead, pointerGroup, source: null, grab: null, near: null, armed: new Set(), offset: new THREE.Vector3(), lastRoll: 0 };
  ctrl.addEventListener("connected", (e) => { holder.source = e.data; pointerGroup.visible = e.data.targetRayMode === "tracked-pointer"; });
  ctrl.addEventListener("disconnected", () => { if (holder.grab) release(holder); holder.source = null; pointerGroup.visible = false; });
  ctrl.addEventListener("squeezestart", () => grab(holder));
  ctrl.addEventListener("squeezeend", () => release(holder));
  ctrl.addEventListener("selectstart", () => select(holder));
  ctrl.addEventListener("selectend", () => release(holder));
  scene.add(ctrl, grip);
  return holder;
});
const palmOf = (holder) => lab.worldToLocal(holder.grip.localToWorld(PALM.clone()));
const beadOf = (holder) => lab.worldToLocal(holder.bead.getWorldPosition(new THREE.Vector3()));
/** The contact at the bead's end, when the bead is down at the board. */
function contactAtBead(holder) {
  const q = toBoard(beadOf(holder));
  if (q.y < -0.01 || q.y > BOARD_H + 0.025) return null;
  return contactAt(q, 0.0075, 0.016);
}
function nearest(holder) {
  const palm = palmOf(holder);
  let best = null;
  let bestD = 0.06;
  const consider = (ref, point, reach = 0.06) => { const d = point.distanceTo(palm); if (d < Math.min(bestD, reach)) { best = ref; bestD = d; } };
  for (const m of movers) if (!m.held) consider(m, m.grabPoint(), m instanceof Plug ? 0.06 : 0.025);
  for (const k of knobs) consider(k, lab.worldToLocal(k.group.getWorldPosition(new THREE.Vector3())), 0.045);
  return best;
}
function controllerRoll(holder, knob) {
  const q = holder.grip.getWorldQuaternion(new THREE.Quaternion());
  const frame = knob.group.getWorldQuaternion(new THREE.Quaternion()).invert();
  const x = new THREE.Vector3(1, 0, 0).applyQuaternion(q).applyQuaternion(frame);
  return Math.atan2(x.y, x.x);
}
const pulse = (holder, strength, ms) => holder.source?.gamepad?.hapticActuators?.[0]?.pulse?.(strength, ms);
function select(holder) {
  if (holder.grab) return;
  const bead = holder.bead.getWorldPosition(new THREE.Vector3());
  if (menu.visible) {
    const item = menuItems.find((i) => i.mesh.getWorldPosition(new THREE.Vector3()).distanceTo(bead) < 0.01);
    if (item) { applyMenu(item); pulse(holder, 0.4, 20); return; }
  }
  const c = contactAtBead(holder);
  if (c) { contactClicked(c); pulse(holder, 0.35, 20); return; }
  const local = beadOf(holder);
  const w = wires.find((wire) => wire.bead.grabPoint().distanceTo(local) < 0.012);
  if (w) { openMenu(w); pulse(holder, 0.3, 20); return; }
  grab(holder);
}
function grab(holder) {
  if (holder.grab) return;
  const ref = nearest(holder);
  if (!ref) return;
  if (ref instanceof Knob) {
    holder.grab = { kind: "knob", knob: ref, start: ref.index, acc: 0 };
    holder.lastRoll = controllerRoll(holder, ref);
  } else {
    const mover = ref.begin();
    const tipWorld = lab.localToWorld(mover.tip());
    holder.offset.copy(holder.grip.worldToLocal(tipWorld));
    holder.grab = { kind: "mover", mover };
  }
  pulse(holder, 0.3, 20);
}
function release(holder) {
  const g = holder.grab;
  holder.grab = null;
  if (g?.kind === "mover") { g.mover.drop(g.mover.tip()); snapRing.visible = false; pulse(holder, 0.4, 25); }
}
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const beadWorld = new THREE.Vector3();
function updateHands() {
  hovered.clear();
  let pointed = null;
  for (const holder of holders) {
    if (!holder.source) continue;
    holder.line.material.opacity = holder.grab ? 0.12 : 0.45;
    holder.bead.visible = !holder.grab;
    const g = holder.grab;
    if (!g) {
      const n = nearest(holder);
      if (n) { hovered.add(n); if (n.wire) hovered.add(n.wire); }
      pointed = contactAtBead(holder) ?? pointed;
      continue;
    }
    if (g.kind === "knob") {
      const roll = controllerRoll(holder, g.knob);
      g.acc -= wrapAngle(roll - holder.lastRoll);
      holder.lastRoll = roll;
      if (g.knob.setIndex(g.start + Math.round(g.acc / g.knob.detent))) pulse(holder, 0.2, 10);
      hovered.add(g.knob);
      continue;
    }
    const p = lab.worldToLocal(holder.grip.localToWorld(holder.offset.clone()));
    p.y = Math.max(p.y, heightAt(p.x, p.z) + 0.002);
    g.mover.moveTo(p);
    const target = g.mover instanceof WireBend ? null : nearestContact(p, g.mover);
    if (target) ringAt(snapRing, target); else if (!pointed) snapRing.visible = false;
    hovered.add(g.mover);
    dirty();
  }
  if (pointed) { ringAt(snapRing, pointed); showPreview(pointed !== wireStart ? { id: pointed } : null); }
  else if (!holders.some((h) => h.grab?.kind === "mover")) { snapRing.visible = false; showPreview(null); }
  // bead pokes: each key takes the deepest press from either free hand
  for (const key of keys) {
    let depth = 0, by = null;
    for (const holder of holders) {
      if (!holder.source || holder.grab) continue;
      const d = key.pokeDepth(holder.bead.getWorldPosition(beadWorld), holder.armed);
      if (d > depth) { depth = d; by = holder; }
    }
    if (by || key.cap.position.z !== key.rest) if (key.setDepth(depth) && by) pulse(by, 0.5, 25);
  }
  for (const holder of holders) holder.bead.material.color.copy(holder.armed.size || contactAtBead(holder) ? BEAD_READY : BEAD_IDLE);
}

// the bench rises or falls to meet the student once the headset has settled
let fitPending = 0;
function fitHeight() {
  const eye = renderer.xr.getCamera().getWorldPosition(new THREE.Vector3());
  lab.position.y = THREE.MathUtils.clamp(eye.y - 0.62 - TOP, -0.3, 0.3);
  lab.updateMatrixWorld(true);
  for (const m of movers) if (m instanceof Plug) m.updateCable();
  dirty();
}
renderer.xr.addEventListener("sessionstart", () => { fitPending = 45; standMat.visible = true; });
renderer.xr.addEventListener("sessionend", () => { lab.position.y = 0; standMat.visible = false; dirty(); vrButton.textContent = "Enter VR"; });

let vrSession = null;
async function checkVr() {
  const set = (label, enabled, title = "") => { vrButton.textContent = label; vrButton.disabled = !enabled; vrButton.title = title; };
  if (!isSecureContext) return set("VR needs HTTPS", false, "Open the HTTPS address in your headset browser.");
  if (!navigator.xr) return set("Open in a headset", false, "This browser has no WebXR.");
  try {
    if (await navigator.xr.isSessionSupported("immersive-vr")) set("Enter VR", true);
    else set("No headset detected", false);
  } catch { set("VR unavailable", false); }
}
vrButton.addEventListener("click", async () => {
  if (vrSession) { vrSession.end(); return; }
  vrButton.textContent = "Opening VR…";
  try {
    const session = await navigator.xr.requestSession("immersive-vr", { optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"] });
    vrSession = session;
    session.addEventListener("end", () => { vrSession = null; });
    await renderer.xr.setSession(session);
    vrButton.textContent = "Exit VR";
  } catch { vrSession = null; vrButton.textContent = "Try VR again"; }
});
checkVr();

// ---------- frame loop ----------
// until the student moves the view, the camera backs off far enough to show the whole bench
let viewTouched = false;
controls.addEventListener("start", () => { viewTouched = true; });
const VIEW_DIR = new THREE.Vector3(0, 0.74, 0.67).normalize();
const VIEW_DIR_TALL = new THREE.Vector3(0, 0.88, 0.47).normalize(); // portrait screens look down on the bench
function fitStage() {
  const w = Math.max(stage.clientWidth, 1), h = Math.max(stage.clientHeight, 1);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  if (viewTouched) return;
  const halfV = THREE.MathUtils.degToRad(camera.fov / 2);
  const halfH = Math.atan(Math.tan(halfV) * camera.aspect);
  const tall = camera.aspect < 1;
  const distance = Math.max((tall ? 0.3 : 0.62) / Math.tan(halfH), 0.36 / Math.tan(halfV), 0.6);
  camera.position.copy(controls.target).addScaledVector(tall ? VIEW_DIR_TALL : VIEW_DIR, distance);
  controls.update();
}
new ResizeObserver(fitStage).observe(stage);
fitStage();

placeParts();
for (const m of movers) if (m instanceof Plug) m.sync();
changed();

renderer.setAnimationLoop((time) => {
  if (!renderer.xr.isPresenting) controls.update();
  else {
    if (fitPending && --fitPending === 0) fitHeight();
    updateHands();
  }
  faceMenu(renderer.xr.isPresenting ? renderer.xr.getCamera() : camera);
  updateGlow(time);
  if (shadowsDirty) { renderer.shadowMap.needsUpdate = true; shadowsDirty = false; }
  renderer.render(scene, camera);
});

// exposed for automated checks only
window.__lab7 = {
  get state() { return state; }, get model() { return model; }, get steps() { return stepList; }, get wireStart() { return wireStart; }, get menuWire() { return menuWire; },
  plugs, wires, knobs, keys, rangeKeys, camera, contactPoint, toLab, toBoard, nearestContact, contactClicked, openMenu, applyMenu, menuItems, lab, board,
  configKnob, powerKey, solutionKey, controls, holders, vr: { grab, release, select, updateHands, fitHeight },
};
