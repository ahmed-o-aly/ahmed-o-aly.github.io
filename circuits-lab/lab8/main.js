// Lab 8 · RC and RL transient response. A standing lab bench built like the Lab 7
// breadboard bench: a portrait breadboard on a trainer leaning toward the student,
// the supply on a shelf, the generator and scope within reach, and every
// control a physical part. The student wires the circuit by clicking two holes (the
// wire routes itself), then charges and discharges it with S1 or drives it with a
// square wave, and measures the time constant on the scope. Units are metres; +z faces the student.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import "../../assets/css/metahub-app-shell.css";
import "../../assets/css/metahub-lab-theme.css";
import { mountLabShell } from "../../assets/js/metahub-app-shell.js";
import {
  AMPLITUDES, BLOCKS, FREQUENCIES, IDIV, LEADS, RS, LEFT_COLS, RIGHT_COLS, ROWS, S1, SOURCES, SPEEDS, SUPPLY_LEVELS, TDIV, VDIV, WIRE_COLORS,
  allHoles, buildModel, contactName, energy, initialState, jumpersFor, partDefaults, legsFor, measureTau, netOf, partsFor, steps, strayJumpers, suggestColor, theory, waveAt,
} from "./circuit.js";
import { BLOCK_AT, BOARD, COL_X, LANES_X, LANES_Z, POST_AT, RAIL_X, S1_BODY, contactXZ, contacts, endObstacle, partObstacles, partPose, rowZ } from "./layout.js";
import { routeWire } from "../lab7-bench/routing.js";
import { COLOR, Cable, Display, Key, Knob, MONO, SANS, canvasTexture, jack, mat, printedFace, rounded, setAnisotropy, text } from "../lab7-bench/kit.js";
import { classDialog } from "../class/join-ui.js";
import { linkBench } from "../class/bench-link.js";
import { ClassPanel } from "../class/panel.js";
import { Ghosts } from "../class/ghosts.js";

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

const classUi = classDialog({ lab: "lab8" }); // start or join a class session
const vrButton = document.createElement("button");
vrButton.type = "button";
vrButton.textContent = "Checking VR…";
vrButton.disabled = true;
mountLabShell({
  host: document.getElementById("lab8-bar"),
  title: "Circuits Lab",
  notes: "/projects/circuits-lab/",
  context: Object.assign(document.createElement("span"), { textContent: "Lab 08 / RC and RL transient response" }),
  actions: [Object.assign(document.createElement("a"), { href: "../", textContent: "All labs" }), classUi.button, vrButton],
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
const CONTACTS = contacts();
function contactPoint(id) {
  const p = contactXZ(id);
  if (!p) return null;
  return new THREE.Vector3(p.x, isPost(id) ? POST_TIP : BOARD_H, p.z);
}
const CONTACT_POINT = new Map(CONTACTS.map((id) => [id, contactPoint(id)]));
const POST_COLOR = { "post+": COLOR.red, postg: COLOR.black, postin: COLOR.yellow, postgin: COLOR.black, postout: COLOR.cyan, postgout: COLOR.black };
const POST_LABEL = { "post+": "+V", postg: "GND", postin: "VIN", postgin: "GND", postout: "VOUT", postgout: "GND" };
const ROLE = { red: "+V", black: "ground", yellow: "input", cyan: "output", orange: "link", green: "spare", blue: "spare", purple: "spare" };
const postDisplays = {};
let solutionKey;

{
  // a wedge holds the trainer at its angle
  const far = TRAINER_D * Math.cos(TILT), rise = TRAINER_D * Math.sin(TILT);
  const shape = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(-far, 0), new THREE.Vector2(-far, rise)]);
  const wedge = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: TRAINER_W - 0.02, bevelEnabled: false }).rotateY(-Math.PI / 2).translate((TRAINER_W - 0.02) / 2, 0, 0), mat.plastic("#2b2e32", 0.7));
  wedge.position.set(0, TOP, HINGE_Z);
  wedge.castShadow = wedge.receiveShadow = true;
  lab.add(wedge);

  // trainer base, dark with silkscreened posts and a key along the front edge
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
      const keyZ = BOARD.l / 2 + 0.024;
      say("WIRE COLOURS", -0.2, keyZ - 0.009, 19, { color: "#b9bdc2", align: "left", weight: 800 });
      WIRE_COLORS.slice(0, 5).forEach((c, i) => {
        const x = -0.2 + (i % 3) * 0.058, z = keyZ + 0.006 + Math.floor(i / 3) * 0.016;
        const [px, py] = P(x, z);
        ctx.fillStyle = COLOR[c];
        ctx.fillRect(px, py - 9, 34, 18);
        if (c === "black") { ctx.strokeStyle = "#9aa0a6"; ctx.lineWidth = 2; ctx.strokeRect(px, py - 9, 34, 18); }
        say(ROLE[c], x + 0.0135, z, 19, { align: "left", weight: 600, color: "#e1ded6" });
      });
      say("All GND points (rails, terminals and posts) are connected internally.", -0.2, keyZ + 0.037, 16, { align: "left", weight: 700, color: "#f1eee6" });
      say("TIME CONSTANT", 0.005, keyZ - 0.009, 19, { color: "#b9bdc2", align: "left", weight: 800 });
      ["RC:  τ = R × C", "RL:  τ = L / (R + Rs)", "At t = τ the response has", "covered 63.2% of its change"].forEach((s, i) => say(s, 0.005, keyZ + 0.003 + i * 0.0085, 17, { align: "left", weight: 600, color: "#e1ded6" }));
      say("WIRING", 0.118, keyZ - 0.009, 19, { color: "#b9bdc2", align: "left", weight: 800 });
      ["Click two holes", "to lay a wire.", "Click a wire: colour", "or delete. Drag its", "bead to re-route."].forEach((s, i) => say(s, 0.118, keyZ + 0.002 + i * 0.0072, 15, { align: "left", weight: 600, color: "#a9aeb4" }));
      say("ELEN 221 TRANSIENT TRAINER", -0.21, FACE_Z0 + 0.008, 16, { color: "#8d9298", align: "left", weight: 600 });
    },
  });
  for (const [id, [x, z]] of Object.entries(POST_AT)) {
    const j = jack(board, x, 0, POST_COLOR[id], { post: true });
    j.group.position.set(x, 0, z);
    j.group.rotation.x = -Math.PI / 2;
  }
  // the supply's voltage, read out beside its post
  const readouts = new THREE.Group();
  readouts.rotation.x = -Math.PI / 2;
  readouts.position.y = 0.001;
  board.add(readouts);
  postDisplays.plus = new Display(readouts, POST_AT["post+"][0] - 0.06, -POST_AT["post+"][1], 0.05, 0.016, { pxPerM: 6000 });
  // the instructor's solution: an unmarked white button set into the trainer's right-hand edge,
  // level with the output terminals, out of sight from where the student stands
  const edge = new THREE.Group();
  edge.position.set(TRAINER_W / 2 + 0.0004, TRAINER_H / 2, BOARD_CZ + POST_AT.postgout[1]);
  edge.rotation.y = Math.PI / 2;
  trainer.add(edge);
  solutionKey = addKey(edge, { x: 0, y: 0, w: 0.012, round: true, color: "#ecebe6", name: "solution", onPress: () => buildSolution() });

  // the breadboard itself
  const body = new THREE.Mesh(rounded(BOARD.w + 0.006, BOARD_H, BOARD.l + 0.006, 0.003), mat.plastic("#f3f1ea", 0.55));
  body.position.y = BOARD_H / 2;
  body.castShadow = body.receiveShadow = true;
  board.add(body);
  const face = new THREE.Group();
  face.rotation.x = -Math.PI / 2;
  face.position.y = BOARD_H + 0.0003;
  board.add(face);
  printedFace(face, BOARD.w, BOARD.l, {
    pxPerM: 4000, background: "#f3f1ea", z: 0, roughness: 0.55,
    draw: (ctx, at) => {
      const P = (x, z) => at(x, -z);
      const say = (s, x, z, size, opts = {}) => { const [px, py] = P(x, z); text(ctx, s, px, py, size, { color: "#77736b", weight: 600, ...opts }); };
      // rails: a tinted lane under each, lettered at both ends
      const RAIL_TINT = { g: "#d8d8d4", p: "#f2c9c4" };
      const RAIL_INK = { g: "#25272a", p: COLOR.red };
      const RAIL_MARK = { g: "G", p: "+" };
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
      for (let r = 0; r < ROWS; r += 1) if (r === 0 || (r + 1) % 5 === 0) {
        say(String(r + 1), -0.0665, rowZ(r), 20);
        say(String(r + 1), 0.0665, rowZ(r), 20);
      }
      // terminal blocks
      for (const [name, [x, row]] of Object.entries(BLOCK_AT)) {
        const block = BLOCKS[name];
        const color = { VIN: "#b08a12", VOUT: "#1f8a99", GND: "#25272a" }[block.net];
        const [x0, y0] = P(x - 0.0075, rowZ(row) - 0.0075);
        const [x1, y1] = P(x + 0.0075, rowZ(row + block.holes - 1) + 0.0075);
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
        say(block.net === "VOUT" ? "VOUT" : block.label, x, rowZ(row) - 0.014, 24, { color, weight: 800 });
      }
    },
  });
}

// ---------- S1: the charge/discharge switch ----------
/** A lever switch standing on the board: click or tap it to throw it the other way. */
class Toggle {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, BOARD_H, S1_BODY.z);
    board.add(this.group);
    const height = 0.016;
    this.glow = mat.plastic("#2b2e33", 0.5);
    const body = new THREE.Mesh(rounded(S1_BODY.w, height, S1_BODY.l, 0.003), this.glow);
    body.position.y = height / 2 + 0.002;
    body.castShadow = true;
    body.userData.ref = this;
    pickable(body);
    this.group.add(body);
    const legMat = mat.metal("#c4c7cb", 0.3);
    for (const hole of Object.values(S1)) {
      const p = contactXZ(hole);
      const x = p.x, z = p.z - S1_BODY.z;
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.0007, 0.0007, 0.009, 8), legMat);
      pin.position.set(x, -0.0005, z);
      // each leg reaches back to the body along whichever axis it left by
      const toSide = Math.abs(z) < S1_BODY.l / 2;
      const reach = toSide ? Math.abs(x) - S1_BODY.w / 2 : Math.abs(z) - S1_BODY.l / 2;
      const foot = new THREE.Mesh(new THREE.BoxGeometry(toSide ? reach : 0.0012, 0.0012, toSide ? 0.0012 : reach), legMat);
      foot.position.set(toSide ? Math.sign(x) * (S1_BODY.w / 2 + reach / 2) : x, 0.003, toSide ? z : Math.sign(z) * (S1_BODY.l / 2 + reach / 2));
      this.group.add(pin, foot);
    }
    const top = new THREE.Group();
    top.rotation.x = -Math.PI / 2;
    top.position.y = height + 0.0022;
    this.group.add(top);
    printedFace(top, S1_BODY.w - 0.002, S1_BODY.l - 0.002, {
      pxPerM: 12000, background: "#2b2e33", z: 0,
      draw: (ctx, at) => {
        silk(ctx, at, "S1", 0, 0.0105, 52, { weight: 800 });
        silk(ctx, at, "CHARGE", -0.0075, -0.0095, 26, { weight: 800, color: "#7df0c4" });
        silk(ctx, at, "DISCHARGE", 0.0065, -0.0095, 21, { weight: 800, color: "#ffc27a" });
      },
    });
    // the lever, leaning toward the throw it is set to
    this.lever = new THREE.Group();
    this.lever.position.set(0, height + 0.002, 0.001);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0016, 0.0024, 0.018, 12).translate(0, 0.009, 0), mat.metal("#c9ccd0", 0.3));
    const tip = new THREE.Mesh(new THREE.CapsuleGeometry(0.0042, 0.009, 6, 14).translate(0, 0.021, 0), mat.plastic(COLOR.red, 0.4));
    shaft.castShadow = tip.castShadow = true;
    tip.userData.ref = this;
    pickable(tip);
    this.lever.add(shaft, tip);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.0048, 0.0048, 0.002, 18), mat.metal("#8b9096", 0.4));
    collar.position.set(0, height + 0.003, 0.001);
    this.group.add(this.lever, collar);
    hitArea(this.group, new THREE.BoxGeometry(S1_BODY.w, 0.05, S1_BODY.l), this, new THREE.Vector3(0, 0.03, 0));
    // what it is set to, lit on its front edge
    const front = new THREE.Group();
    front.position.set(0, height / 2 + 0.002, S1_BODY.l / 2 + 0.0002);
    this.group.add(front);
    this.display = new Display(front, 0, 0, 0.026, 0.009, { pxPerM: 12000, z: 0.0008 });
    this.place();
  }
  place() { this.lever.rotation.z = state.s1 === "charge" ? 0.5 : -0.5; }
  draw() {
    const on = state.s1 === "charge";
    this.display.draw(state.s1, (ctx, w, h) => text(ctx, on ? "CHARGE" : "DISCHARGE", w / 2, h / 2 + 2, h * 0.55, { color: on ? "#7df0c4" : "#ffc27a", font: MONO, weight: 700 }));
  }
  press() {
    pushHistory();
    state.s1 = state.s1 === "charge" ? "discharge" : "charge";
    if (state.s1 === "charge") state.charged = true;
    this.place();
    changed();
  }
  point() { return lab.worldToLocal(this.lever.localToWorld(new THREE.Vector3(0, 0.02, 0))); }
}
const s1Switch = new Toggle();
glowTargets.add(s1Switch);

// ---------- components: the R, C and L dial modules ----------
const engineering = (v, unit) => {
  const steps = [[1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"]];
  const big = v >= 1000 && unit === "Ω" ? [v / 1000, "k"] : null;
  if (big) return `${Number(big[0].toPrecision(3))} k${unit}`;
  for (const [f, p] of steps) if (Math.abs(v) >= f * 0.9999) return `${Number((v / f).toPrecision(3))} ${p}${unit}`;
  return `${Number(v.toPrecision(3))} ${unit}`;
};
const PART_UNIT = { r: "Ω", c: "F", l: "H", rs: "Ω" };
const PART_COLOR = { r: "#2f6db5", c: "#1f8a7a", l: "#b5702f", rs: "#6b4fa0" };
const partValue = (id) => (id === "rs" ? RS : state[id]);
const partText = (id, v = partValue(id)) => engineering(v, PART_UNIT[id]);
const parts = new THREE.Group();
board.add(parts);
const potModules = {};
let gauge = null; // the stored-energy indicator beside C or L
function placeParts() {
  for (const child of [...parts.children]) parts.remove(child);
  for (const m of Object.values(potModules)) { if (!m.knob) continue; knobs.splice(knobs.indexOf(m.knob), 1); unpick(m.knob.pickable); glowTargets.delete(m.knob); }
  for (const id of Object.keys(potModules)) delete potModules[id];
  const legMat = mat.metal("#c4c7cb", 0.3);
  const pin = (x, z) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.0007, 0.0007, 0.009, 8), legMat); m.position.set(x, BOARD_H - 0.0005, z); parts.add(m); };
  for (const part of partsFor(state.kind)) {
    const pose = partPose(part);
    for (const end of [pose.a, pose.b]) pin(end.x, end.z);
    // a module standing square to the board, its feet bent out to the holes, its readout toward the student
    const group = new THREE.Group();
    group.position.set(pose.mid.x, BOARD_H, pose.mid.z);
    parts.add(group);
    const body = new THREE.Mesh(rounded(0.03, 0.026, 0.022, 0.003), mat.plastic(PART_COLOR[part.id], 0.45));
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
      pxPerM: 9000, background: PART_COLOR[part.id], z: 0.0002,
      draw: (ctx, at) => silk(ctx, at, part.label, 0, 0.0075, 64, { color: "#ffffff", weight: 800 }),
    });
    const display = new Display(front, 0, -0.004, 0.024, 0.01, { pxPerM: 12000, z: 0.0004 });
    if (part.fixed) { potModules[part.id] = { display }; continue; } // the 1 Ω sense resistor has no dial
    const knobHolder = new THREE.Group();
    knobHolder.rotation.x = -Math.PI / 2;
    knobHolder.position.y = 0.0302;
    group.add(knobHolder);
    const knob = addKnob(knobHolder, {
      x: 0, y: 0, radius: 0.0095, values: part.values, index: part.values.indexOf(state[part.id]), color: "#e8e5dc", cap: "#cfcbc0", marker: "#1d1f22", name: part.id,
      onChange: (v) => { state[part.id] = v; changed(); },
    });
    potModules[part.id] = { display, knob };
    if (part.id === "c" || part.id === "l") gauge = makeGauge(part.id, pose.mid);
  }
  drawModules();
  dirty();
}
/** What the storage part holds, made visible: a capacitor's level rises, an inductor's field grows. */
function makeGauge(id, mid) {
  const group = new THREE.Group();
  group.position.set(mid.x + 0.024, BOARD_H, mid.z);
  parts.add(group);
  if (id === "c") {
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.0052, 0.0052, 0.034, 20, 1, true).translate(0, 0.017, 0), new THREE.MeshStandardMaterial({ color: "#dfe9ee", transparent: true, opacity: 0.3, roughness: 0.15, side: THREE.DoubleSide, depthWrite: false }));
    const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.0044, 0.0044, 0.034, 18).translate(0, 0.017, 0), new THREE.MeshStandardMaterial({ color: "#2ec4d6", emissive: "#0f6a78", roughness: 0.4 }));
    fill.scale.y = 0.001;
    group.add(glass, fill);
    return { kind: "c", fill };
  }
  const coil = new THREE.Group();
  const rings = [0.006, 0.0095, 0.013].map((radius, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.0009, 8, 36).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: "#ffb347", transparent: true, opacity: 0, depthWrite: false }));
    ring.position.y = 0.01 + i * 0.008;
    coil.add(ring);
    return ring;
  });
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.03, 14).translate(0, 0.015, 0), mat.metal("#8b9096", 0.4));
  group.add(core, coil);
  return { kind: "l", rings };
}
function drawModules() {
  for (const [id, m] of Object.entries(potModules)) m.display.draw(partValue(id), (ctx, w, h) => text(ctx, partText(id), w / 2, h / 2 + 2, h * 0.66, { color: "#7df0c4", font: MONO, weight: 600 }));
  s1Switch.draw();
}

// ---------- instruments ----------
// DC supply, on the shelf behind the trainer
const supply = instrument({ w: 0.3, h: 0.13, d: 0.22, x: 0, z: -0.95, y: SHELF_Y, yaw: 0 });
const supplyJacks = {};
let supplyDisplay;
const rangeKeys = {};
let powerKey;
{
  const f = supply.front;
  printedFace(f, supply.w, supply.h, {
    pxPerM: 3600, background: "#2a2e33", z: 0.0006,
    draw: (ctx, at) => {
      silk(ctx, at, "DC POWER SUPPLY", -0.138, 0.053, 28, { align: "left", weight: 800 });
      silk(ctx, at, "OUTPUT", -0.05, 0.04, 22, { color: "#ff8a80", weight: 800 });
      silk(ctx, at, "+V", -0.09, -0.052, 24, { color: "#ff8a80", weight: 800 });
      silk(ctx, at, "COM", -0.01, -0.052, 22, { weight: 800 });
      silk(ctx, at, "OUTPUT V", 0.1, 0.053, 20, { weight: 700, color: "#c9c6bf" });
      silk(ctx, at, "POWER", 0.1, -0.054, 20, { weight: 700, color: "#c9c6bf" });
    },
  });
  supplyDisplay = new Display(f, -0.05, 0.016, 0.1, 0.03);
  supplyJacks["sup+"] = jack(f, -0.09, -0.035, COLOR.red);
  supplyJacks.supg = jack(f, -0.01, -0.035, COLOR.black);
  SUPPLY_LEVELS.forEach((v, i) => {
    rangeKeys[v] = addKey(f, { x: 0.072 + i * 0.028, y: 0.022, w: 0.025, h: 0.014, label: `${v}`, color: "#d9d5cb", led: "#53e07a", name: `range:${v}`, onPress: () => { state.supply.level = v; changed(); } });
  });
  powerKey = addKey(f, { x: 0.1, y: -0.03, w: 0.018, round: true, color: "#c9473d", label: "I/O", labelColor: "#ffffff", led: "#53e07a", name: "power", onPress: () => { state.supply.on = !state.supply.on; changed(); } });
}
function drawSupply() {
  const short = model.short && state.supply.on;
  const on = state.supply.on && !short;
  const level = state.supply.level;
  // the set voltage always shows: bright when the output is live, dim when off
  const show = (d, s, color, note) => d.draw(`${s}|${color}|${note}`, (ctx, w, h) => {
    text(ctx, s, w * 0.95, h * 0.5 + 2, h * (note ? 0.5 : 0.62), { color, font: MONO, weight: 700, align: "right" });
    if (note) text(ctx, note, w * 0.05, h * 0.5, h * 0.28, { color: "#8a8f94", font: MONO, weight: 700, align: "left" });
  });
  show(supplyDisplay, short ? "LIMIT" : `+${level.toFixed(1)} V`, short ? "#ffb347" : on ? "#ff6b5e" : "#5a3431", on || short ? "" : "OFF");
  show(postDisplays.plus, `+${level} V`, on ? "#ff6b5e" : "#5a3431", "");
  powerKey.setLit(state.supply.on);
  for (const [v, key] of Object.entries(rangeKeys)) key.setLit(Number(v) === level);
}

// Function generator, to the left: a square wave for continuous excitation
const gen = instrument({ w: 0.28, h: 0.12, d: 0.22, x: -0.56, z: -0.6, color: "#dfe3e6" });
const genJacks = {};
let genDisplay, ampKnob, freqKnob;
{
  const f = gen.front;
  printedFace(f, gen.w, gen.h, {
    pxPerM: 3600, background: "#2a2e33", z: 0.0006,
    draw: (ctx, at) => {
      silk(ctx, at, "FUNCTION GENERATOR", -0.128, 0.047, 28, { align: "left", weight: 800 });
      silk(ctx, at, "AMPL V", 0.05, -0.004, 20, { color: "#c9c6bf", weight: 700 });
      silk(ctx, at, "FREQ", 0.1, -0.004, 20, { color: "#c9c6bf", weight: 700 });
      silk(ctx, at, "OUTPUT", -0.08, -0.053, 20, { color: COLOR.yellow, weight: 800 });
      silk(ctx, at, "COM", -0.03, -0.053, 18, { weight: 800 });
    },
  });
  genDisplay = new Display(f, -0.06, 0.012, 0.13, 0.044);
  ampKnob = addKnob(f, { x: 0.05, y: 0.018, radius: 0.013, values: AMPLITUDES, index: AMPLITUDES.indexOf(state.gen.amp), name: "amp", onChange: (v) => { state.gen.amp = v; changed(); } });
  freqKnob = addKnob(f, { x: 0.1, y: 0.018, radius: 0.013, values: FREQUENCIES, index: FREQUENCIES.indexOf(state.gen.freq), name: "freq", onChange: (v) => { state.gen.freq = v; changed(); } });
  genJacks.gen = jack(f, -0.08, -0.036, COLOR.yellow);
  genJacks.genc = jack(f, -0.03, -0.036, COLOR.black);
}
const hz = (f) => (f >= 1000 ? `${(f / 1000).toFixed(f % 1000 ? 1 : 0)} kHz` : `${f} Hz`);
function drawGenerator() {
  const g = state.gen;
  genDisplay.draw(JSON.stringify(g), (ctx, w, h) => {
    ctx.strokeStyle = "#ffd65a";
    ctx.lineWidth = h * 0.05;
    ctx.beginPath();
    const X = (k) => w * (0.04 + k * 0.28), low = h * 0.72, high = h * 0.28;
    ctx.moveTo(X(0), low); ctx.lineTo(X(0), high); ctx.lineTo(X(0.25), high); ctx.lineTo(X(0.25), low); ctx.lineTo(X(0.5), low); ctx.lineTo(X(0.5), high); ctx.lineTo(X(0.75), high); ctx.lineTo(X(0.75), low); ctx.lineTo(X(1), low);
    ctx.stroke();
    text(ctx, "SQUARE", w * 0.18, h * 0.9, h * 0.13, { color: "#ffd65a", font: MONO, weight: 600 });
    text(ctx, `0 to ${g.amp} V`, w * 0.96, h * 0.32, h * 0.24, { color: "#f6f3ea", font: MONO, align: "right" });
    text(ctx, hz(g.freq), w * 0.96, h * 0.68, h * 0.24, { color: "#f6f3ea", font: MONO, align: "right" });
  });
}

// Oscilloscope, to the right: CH1 and CH2 take probes, measured against the ground
// lead, and CH3 is the math channel (CH1 − CH2) / R, the current through R. Each
// channel turns on and off and moves up or down on its POS knob, and two cursors
// measure time or voltage on the traces.
const scope = instrument({ w: 0.34, h: 0.19, d: 0.24, x: 0.57, z: -0.6, color: "#e2e4e6" });
const scopeJacks = {};
const CURSOR_STEPS = 101; // positions across the screen, a tenth of a division apart in time
const view = { on: { ch1: true, ch2: true, ch3: false }, pos: { ch1: 0, ch2: 0, ch3: 0 }, cursor: "off", sel: 0, at: { t: [10, 30], v: [75, 25] } };
const POSITIONS = Array.from({ length: 41 }, (_, i) => Math.round((i * 0.2 - 4) * 10) / 10); // divisions, −4 to +4
const cursorTime = (i) => (i / (CURSOR_STEPS - 1)) * 10; // divisions from the left edge
const cursorLevel = (i) => (i / (CURSOR_STEPS - 1)) * 8 - 4; // divisions above the centre line
let scopeScreen, ch1Knob, ch2Knob, ch3Knob, timeKnob, cursorKnob;
const posKnobs = {};
const channelKeys = {};
let cursorKey, selectKey;
{
  const f = scope.front;
  printedFace(f, scope.w, scope.h, {
    pxPerM: 3600, background: "#2a2e33", z: 0.0006,
    draw: (ctx, at) => {
      silk(ctx, at, "OSCILLOSCOPE", -0.155, 0.083, 28, { align: "left", weight: 800 });
      silk(ctx, at, "CH1 V", 0.071, 0.077, 18, { color: COLOR.yellow, weight: 800 });
      silk(ctx, at, "CH2 V", 0.11, 0.077, 18, { color: COLOR.cyan, weight: 800 });
      silk(ctx, at, "CH3 MATH", 0.149, 0.077, 18, { color: "#7be08f", weight: 800 });
      silk(ctx, at, "MOVE", 0.153, 0.008, 16, { color: "#c9c6bf", weight: 700 });
      silk(ctx, at, "POS 1", 0.071, -0.033, 15, { color: COLOR.yellow, weight: 800 });
      silk(ctx, at, "POS 2", 0.11, -0.033, 15, { color: COLOR.cyan, weight: 800 });
      silk(ctx, at, "POS 3", 0.149, -0.033, 15, { color: "#7be08f", weight: 800 });
      silk(ctx, at, "TIME/div", 0.11, 0.018, 20, { color: "#c9c6bf", weight: 700 });
      silk(ctx, at, "CH1", -0.13, -0.083, 22, { color: COLOR.yellow, weight: 800 });
      silk(ctx, at, "CH2", -0.085, -0.083, 22, { color: COLOR.cyan, weight: 800 });
      silk(ctx, at, "GND", -0.04, -0.083, 22, { weight: 800 });
    },
  });
  scopeScreen = new Display(f, -0.055, 0.012, 0.2, 0.125, { pxPerM: 5000, glass: "#0a1210" });
  ch1Knob = addKnob(f, { x: 0.071, y: 0.052, radius: 0.0115, values: VDIV, index: VDIV.indexOf(2), name: "ch1", marker: COLOR.yellow, onChange: () => changed() });
  ch2Knob = addKnob(f, { x: 0.11, y: 0.052, radius: 0.0115, values: VDIV, index: VDIV.indexOf(2), name: "ch2", marker: COLOR.cyan, onChange: () => changed() });
  ch3Knob = addKnob(f, { x: 0.149, y: 0.052, radius: 0.0115, values: IDIV, index: IDIV.indexOf(0.002), name: "ch3", marker: "#7be08f", onChange: () => changed() });
  timeKnob = addKnob(f, { x: 0.11, y: -0.008, radius: 0.016, values: TDIV, index: TDIV.indexOf(0.05), name: "time", onChange: () => changed() });
  for (const [id, x, led] of [["ch1", 0.071, COLOR.yellow], ["ch2", 0.11, COLOR.cyan], ["ch3", 0.149, "#7be08f"]]) {
    channelKeys[id] = addKey(f, { x, y: 0.029, w: 0.026, h: 0.011, label: "ON", color: "#d9d5cb", name: `${id}-on`, led, onPress: (k) => { view.on[id] = !view.on[id]; k.setLit(view.on[id]); changed(); } });
    channelKeys[id].setLit(view.on[id]);
  }
  cursorKey = addKey(f, { x: 0.066, y: -0.002, w: 0.03, h: 0.012, label: "CURSOR", color: "#d9d5cb", name: "cursor", led: "#ff9b54", onPress: () => setCursorMode() });
  selectKey = addKey(f, { x: 0.066, y: -0.02, w: 0.03, h: 0.012, label: "A / B", color: "#d9d5cb", name: "cursor-select", onPress: () => { view.sel = 1 - view.sel; syncCursorKnob(); changed(); } });
  cursorKnob = addKnob(f, { x: 0.153, y: -0.012, radius: 0.011, values: [...Array(CURSOR_STEPS).keys()], index: view.at.t[0], name: "cursor-position", marker: "#ff9b54", onChange: (v) => { if (view.cursor !== "off") view.at[view.cursor][view.sel] = v; changed(); } });
  cursorKnob.px = 3; // a short drag crosses the screen
  for (const [id, x, marker] of [["ch1", 0.071, COLOR.yellow], ["ch2", 0.11, COLOR.cyan], ["ch3", 0.149, "#7be08f"]]) {
    posKnobs[id] = addKnob(f, { x, y: -0.049, radius: 0.0085, values: POSITIONS, index: POSITIONS.indexOf(0), name: `${id}-pos`, marker, onChange: (v) => { view.pos[id] = v; changed(); } });
    posKnobs[id].px = 8;
  }
  addKey(f, { x: 0.11, y: -0.076, w: 0.034, h: 0.014, label: "AUTO", color: "#d9d5cb", name: "auto", onPress: () => { autoset(); changed(); } });
  scopeJacks.ch1 = jack(f, -0.13, -0.066, COLOR.yellow);
  scopeJacks.ch2 = jack(f, -0.085, -0.066, COLOR.cyan);
  scopeJacks.gnd = jack(f, -0.04, -0.066, COLOR.black);
}
/** CURSOR steps off → time cursors → voltage cursors → off. */
function setCursorMode(mode = { off: "t", t: "v", v: "off" }[view.cursor]) {
  view.cursor = mode;
  cursorKey.setLit(mode !== "off");
  syncCursorKnob();
  changed();
}
function syncCursorKnob() {
  if (view.cursor === "off") return;
  cursorKnob.setIndex(view.at[view.cursor][view.sel], true);
}
/** The scope reads only once its ground lead is on the circuit's ground. */
const scopeGrounded = () => Boolean(state.probes.probegnd) && model.connected(state.probes.probegnd, "postg");
const vdivLabel = (v) => engineering(v, "V");
const idivLabel = (v) => engineering(v, "A");
const tdivLabel = (t) => engineering(t, "s");
const firstFit = (values, enough) => { const i = values.findIndex(enough); return i === -1 ? values.length - 1 : i; };
/** Fit the time constant and both channels to the screen. */
function autoset() {
  const t = theory(state);
  const want = state.source === "gen" ? 1 / state.gen.freq : 5 * t.tau; // a full period of the square wave, or five τ
  timeKnob.setIndex(firstFit(TDIV, (d) => d * 9 >= want), true);
  // signals that stay at or above 0 V start near the bottom and use most of the screen; RC's current swings both ways.
  // RL's CH2 is the voltage across the 1 Ω Rs, the inductor current, which stays positive
  const rc = state.kind === "RC";
  const place = (id, knob, values, peak, oneSided) => {
    knob.setIndex(firstFit(values, (d) => d * (oneSided ? 6.5 : 3.6) >= peak * 1.02), true);
    view.pos[id] = oneSided ? -3 : 0;
    posKnobs[id].setIndex(POSITIONS.indexOf(view.pos[id]), true);
  };
  place("ch1", ch1Knob, VDIV, t.drive, true);
  place("ch2", ch2Knob, VDIV, rc ? t.drive : t.peakCurrent * RS, true);
  place("ch3", ch3Knob, IDIV, t.peakCurrent, !rc);
}
function drawScope() {
  const sweep = run.sweep;
  const grounded = scopeGrounded();
  const key = JSON.stringify([run.drawTick, ch1Knob.index, ch2Knob.index, ch3Knob.index, timeKnob.index, run.active, state.kind, sweep?.samples.length ?? -1, state.probes, view, grounded]);
  scopeScreen.draw(key, (ctx, w, h) => {
    // the labels live in strips above and below the graticule, so nothing covers a trace
    const size = h * 0.05;
    const top = size * 1.6, bottom = h - size * 2.7, gh = bottom - top;
    ctx.strokeStyle = "#1d3a32";
    ctx.lineWidth = 2;
    for (let i = 1; i < 10; i += 1) { ctx.beginPath(); ctx.moveTo((i * w) / 10, top); ctx.lineTo((i * w) / 10, bottom); ctx.stroke(); }
    for (let i = 0; i <= 8; i += 1) { ctx.beginPath(); ctx.moveTo(0, top + (i * gh) / 8); ctx.lineTo(w, top + (i * gh) / 8); ctx.stroke(); }
    ctx.strokeStyle = "#2f5a4d";
    ctx.beginPath(); ctx.moveTo(w / 2, top); ctx.lineTo(w / 2, bottom); ctx.moveTo(0, top + gh / 2); ctx.lineTo(w, top + gh / 2); ctx.stroke();
    const rc = state.kind === "RC";
    const div = timeKnob.value;
    const scale = { ch1: ch1Knob.value, ch2: ch2Knob.value, i: ch3Knob.value };
    const pos = { ch1: view.pos.ch1, ch2: view.pos.ch2, i: view.pos.ch3 };
    const color = { ch1: COLOR.yellow, ch2: COLOR.cyan, i: "#7be08f" };
    const levelY = (divs) => top + gh / 2 - (divs * gh) / 8; // divisions above the centre line
    const Y = (v, field) => THREE.MathUtils.clamp(levelY(v / scale[field] + pos[field]), top + 2, bottom - 2);
    const X = (t) => w / 10 + (((t - sweep.t0) / div) * w) / 10;
    const shown = { ch1: grounded && view.on.ch1, ch2: grounded && view.on.ch2, i: grounded && view.on.ch3 };
    // a trace's value at a time after the trigger, from the sweep's samples
    const valueAt = (field, t) => {
      if (!sweep) return null;
      if (t <= sweep.t0) return sweep.pre[field] ?? null;
      const k = sweep.samples.findIndex((s) => s.t >= t);
      if (k === -1) return null;
      const q = sweep.samples[k], p = sweep.samples[k - 1] ?? { ...sweep.pre, t: sweep.t0 };
      if (q[field] === null || p[field] === null) return null;
      return q.t === p.t ? q[field] : p[field] + ((q[field] - p[field]) * (t - p.t)) / (q.t - p.t);
    };
    // each channel's ground level, marked at the left edge as a scope does
    for (const [field, n] of [["ch1", "1"], ["i", "3"], ["ch2", "2"]]) {
      if (!shown[field]) continue;
      const y = Y(0, field);
      ctx.fillStyle = color[field];
      ctx.beginPath(); ctx.moveTo(0, y - size * 0.45); ctx.lineTo(size * 0.7, y); ctx.lineTo(0, y + size * 0.45); ctx.fill();
      text(ctx, n, size * 0.95, y, size * 0.75, { color: color[field], font: MONO, weight: 800, align: "left" });
    }
    ctx.save();
    ctx.beginPath(); ctx.rect(0, top, w, gh); ctx.clip();
    if (sweep) {
      const trace = (field) => {
        if (!shown[field] || sweep.pre[field] === null || sweep.pre[field] === undefined) return;
        ctx.strokeStyle = color[field];
        ctx.lineWidth = 4;
        ctx.shadowColor = color[field];
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(0, Y(sweep.pre[field], field));
        ctx.lineTo(w / 10, Y(sweep.pre[field], field));
        for (const s of sweep.samples) ctx.lineTo(X(s.t), Y(s[field], field));
        ctx.stroke();
        ctx.shadowBlur = 0;
      };
      trace("ch1");
      trace("i");
      trace("ch2");
      // the 63.2% marks, at τ on the CH2 trace, while the hand cursors are off
      const m = sweep.measured;
      if (m && grounded && view.cursor === "off") {
        ctx.setLineDash([12, 10]);
        ctx.strokeStyle = "#ff9b54";
        ctx.lineWidth = 3;
        const cx = X(sweep.t0 + m.tau);
        ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(cx, bottom); ctx.stroke();
        const level = shown.ch2 ? valueAt("ch2", sweep.t0 + m.tau) : null;
        if (level !== null) {
          const cy = Y(level, "ch2");
          ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
          text(ctx, "63.2%", w - 10, cy - size * 0.75, size * 0.85, { color: "#ff9b54", font: MONO, weight: 700, align: "right" });
        }
        ctx.setLineDash([]);
        text(ctx, "τ", cx + 8, top + size, size * 1.1, { color: "#ff9b54", font: MONO, weight: 700, align: "left" });
      }
    }
    // hand cursors: A solid, B dashed, the one the knob moves drawn brighter
    let readout = ["", ""];
    if (view.cursor !== "off") {
      const vertical = view.cursor === "t";
      const [a, b] = view.at[view.cursor];
      for (const k of [0, 1]) {
        const at = view.at[view.cursor][k];
        const x = (cursorTime(at) * w) / 10, y = levelY(cursorLevel(at));
        ctx.strokeStyle = k === view.sel ? "#ffb27a" : "rgba(255, 155, 84, 0.55)";
        ctx.lineWidth = k === view.sel ? 3.5 : 2.5;
        ctx.setLineDash(k ? [14, 9] : []);
        ctx.beginPath();
        if (vertical) { ctx.moveTo(x, top); ctx.lineTo(x, bottom); } else { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
        ctx.setLineDash([]);
        const name = k ? "B" : "A";
        if (vertical) text(ctx, name, x + 8, top + size, size, { color: "#ffb27a", font: MONO, weight: 800, align: "left" });
        else text(ctx, name, w * 0.55, y - size * 0.6, size, { color: "#ffb27a", font: MONO, weight: 800, align: "left" });
      }
      if (vertical) {
        // times after the trigger, which sits one division in; CH2 read at each
        const ta = (cursorTime(a) - 1) * div, tb = (cursorTime(b) - 1) * div;
        const v = (t) => { const x = shown.ch2 && sweep ? valueAt("ch2", sweep.t0 + t) : null; return x === null ? "—" : vdivLabel(x); };
        readout = [`A ${tdivLabel(ta)} ${v(ta)}   B ${tdivLabel(tb)} ${v(tb)}`, `ΔT ${tdivLabel(Math.abs(tb - ta))}  (CH2)`];
      } else {
        // levels measured from CH2's ground marker, on CH2's scale
        const va = (cursorLevel(a) - pos.ch2) * scale.ch2, vb = (cursorLevel(b) - pos.ch2) * scale.ch2;
        readout = [`A ${vdivLabel(va)}   B ${vdivLabel(vb)}`, `ΔV ${vdivLabel(Math.abs(vb - va))}  (CH2)`];
      }
    }
    ctx.restore();
    // top strip: the channels and the time base
    // a channel that is off keeps its label, greyed
    const ink = (id, c) => (view.on[id] ? c : "#55625d");
    const row = top * 0.5, label = size * 0.9;
    text(ctx, `1 Vin ${vdivLabel(scale.ch1)}`, 10, row, label, { color: ink("ch1", COLOR.yellow), font: MONO, weight: 600, align: "left" });
    text(ctx, `2 ${rc ? "Vc" : "VRs"} ${vdivLabel(scale.ch2)}`, w * 0.235, row, label, { color: ink("ch2", COLOR.cyan), font: MONO, weight: 600, align: "left" });
    text(ctx, `3 ${rc ? "(1−2)/R" : "2/Rs"} ${idivLabel(scale.i)}`, w * 0.47, row, label, { color: ink("ch3", "#7be08f"), font: MONO, weight: 600, align: "left" });
    text(ctx, `${tdivLabel(div)} ${run.active ? "RUN" : "STOP"}`, w - 10, row, label, { color: run.active ? "#7be08f" : "#ffb347", font: MONO, weight: 700, align: "right" });
    // bottom strip: the time constant, and the cursors' readout
    const r1 = bottom + size * 0.75, r2 = bottom + size * 1.95;
    text(ctx, `τ theory ${tdivLabel(theory(state).tau)}`, 10, r1, size * 0.95, { color: "#dfe7e3", font: MONO, weight: 600, align: "left" });
    text(ctx, `τ 63.2%  ${grounded && sweep?.measured ? tdivLabel(sweep.measured.tau) : "—"}`, 10, r2, size * 0.95, { color: "#ff9b54", font: MONO, weight: 600, align: "left" });
    text(ctx, readout[0], w - 10, r1, size * 0.95, { color: "#ffb27a", font: MONO, weight: 600, align: "right" });
    text(ctx, readout[1], w - 10, r2, size * 0.95, { color: "#ffb27a", font: MONO, weight: 600, align: "right" });
    if (!grounded) {
      ctx.fillStyle = "rgba(10, 18, 16, 0.85)";
      ctx.fillRect(w * 0.16, h * 0.42, w * 0.68, h * 0.16);
      text(ctx, "Clip the probe ground lead onto GND", w / 2, h / 2, size * 1.05, { color: "#ffb347", font: MONO, weight: 700 });
    }
  });
}

// ---------- the run: a clock, a stored quantity and the sweep being drawn ----------
// The simulation time on screen is scaled, so a 1 µs response and a 10 s response
// both take the same few seconds to watch: SPEED sets screens per real second.
// S1, or a rising edge of the square wave, triggers a sweep one division in from
// the left, with the moment before it drawn flat so the step itself shows.
const SWEEP_SAMPLES = 720;
const run = { x: 0, t: 0, active: false, sweep: null, next: 0, last: null, sig: "", drawTick: 0, frame: 0, flow: 0 };
function readings() {
  const s = model.solve(run.x, run.t);
  const at = (id) => { if (!id) return null; const r = model.root(id); return r === null ? null : s.v.get(r) ?? 0; };
  const ch1 = at(state.probes.ch1), ch2 = at(state.probes.ch2);
  // CH3 is math on the probes, so it reads only when they are on the circuit: RC's
  // current through R is (CH1 − CH2)/R; RL's CH2 sits across the 1 Ω Rs, so CH2/Rs
  if (state.kind === "RL") return { t: run.t, x: run.x, ch1, ch2, i: ch2 === null ? null : ch2 / RS };
  return { t: run.t, x: run.x, ch1, ch2, i: ch1 === null || ch2 === null ? null : (ch1 - ch2) / state.r };
}
function startSweep() {
  const start = run.t + 1e-12;
  run.sweep = { t0: run.t, pre: run.last ?? readings(), samples: [], done: false, target: model.settle(start), measured: null, stop: state.source === "gen" ? run.t + 0.5 / state.gen.freq : Infinity };
  run.next = run.t;
}
function record() {
  const s = run.sweep;
  s.samples.push(readings());
  if (!s.measured && run.t <= s.stop) s.measured = measureTau(s.samples, s.target);
  run.next += (timeKnob.value * 9) / SWEEP_SAMPLES;
  if (s.samples.length > SWEEP_SAMPLES) s.done = true;
}
function tickRun(dt) {
  run.frame += 1;
  if (run.active) {
    const end = run.t + Math.min(dt, 0.05) * speedKnob.value * timeKnob.value * 10;
    while (run.t < end) {
      const sweeping = run.sweep && !run.sweep.done;
      let stop = sweeping ? Math.min(end, run.next) : end;
      // a finished sweep waits for the square wave's next rising edge
      const edge = !sweeping && state.source === "gen" ? Math.ceil(run.t * state.gen.freq + 1e-9) / state.gen.freq : Infinity;
      if (edge < stop) stop = edge;
      if (stop > run.t) { run.x = model.advance(run.x, run.t, stop - run.t); run.t = stop; }
      if (sweeping && run.t >= run.next - 1e-15) record();
      else if (!sweeping && Math.abs(run.t - edge) < 1e-12) { run.last = readings(); startSweep(); }
    }
    run.last = readings();
    run.flow += dt;
  }
  updateFlow(dt);
  if (run.frame % 3 === 0) {
    if (run.active) run.drawTick += 1;
    drawScope();
    drawGuide();
  }
}
function newRun() {
  run.x = 0;
  run.t = 0;
  run.active = false;
  run.sweep = null;
  run.last = null;
  state.started = false;
  state.charged = false;
  run.sig = "";
}
const signature = () => JSON.stringify([state.kind, state.source, state.s1, state.r, state.c, state.l, state.supply, state.gen, state.jumpers.map((j) => [netOf(j.a), netOf(j.b)]), state.leads, state.probes, timeKnob.index]);

// current made visible: beads travel the loop's wires, in the direction it flows
const FLOW_MAX = 150;
const flowBeads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0019, 10, 8), new THREE.MeshBasicMaterial({ color: "#fff3b0" }), FLOW_MAX);
flowBeads.frustumCulled = false;
flowBeads.count = 0;
board.add(flowBeads);
const flowMatrix = new THREE.Matrix4();
let flowPhase = 0;
function updateFlow(dt) {
  const t = theory(state);
  const i = run.last?.i ?? 0;
  const strength = t.peakCurrent ? Math.min(1, Math.abs(i) / t.peakCurrent) : 0;
  const x = run.last?.x ?? 0;
  if (gauge?.kind === "c") {
    const fill = Math.max(0.001, Math.min(1, Math.abs(x) / Math.max(t.drive, 1e-9)));
    gauge.fill.scale.y = fill;
  } else if (gauge?.kind === "l") {
    const level = t.peakCurrent ? Math.min(1, Math.abs(x) / t.peakCurrent) : 0;
    gauge.rings.forEach((ring, k) => { ring.material.opacity = level * (0.95 - k * 0.2); ring.scale.setScalar(0.6 + 0.4 * level); });
  }
  if (run.active) flowPhase += dt * Math.sign(i) * (0.012 + strength * 0.05);
  let n = 0;
  if (strength > 0.005 && model.supplyOn !== undefined) {
    for (const wire of wires) {
      const plan = jumpersFor(state.source, state.kind).find((j) => j.flow && ((netOf(j.a) === netOf(wire.a) && netOf(j.b) === netOf(wire.b)) || (netOf(j.a) === netOf(wire.b) && netOf(j.b) === netOf(wire.a))));
      if (!plan || (plan.flow === "discharge" && state.s1 !== "discharge")) continue;
      const sign = netOf(plan.a) === netOf(wire.a) ? 1 : -1;
      const pts = wire.path;
      const lengths = pts.slice(1).map((p, k) => p.distanceTo(pts[k]));
      const total = lengths.reduce((s, l) => s + l, 0);
      const gap = 0.014;
      for (let d = (((flowPhase * sign) % gap) + gap) % gap; d < total && n < FLOW_MAX; d += gap) {
        let left = d, k = 0;
        while (k < lengths.length - 1 && left > lengths[k]) { left -= lengths[k]; k += 1; }
        const p = pts[k].clone().lerp(pts[k + 1], lengths[k] ? left / lengths[k] : 0);
        flowMatrix.setPosition(p.x, p.y + 0.0016, p.z);
        flowBeads.setMatrixAt(n, flowMatrix);
        n += 1;
      }
    }
  }
  flowBeads.count = n;
  flowBeads.instanceMatrix.needsUpdate = true;
}

// ---------- the trainer console: circuit, source, speed, guide and the run's controls ----------
const consoleFace = new THREE.Group();
consoleFace.position.set(0, TOP + 0.03, HINGE_Z + 0.072);
consoleFace.rotation.x = -1.1;
lab.add(consoleFace);
let guideDisplay, kindKnob, sourceKnob, speedKnob, startKey, pauseKey;
{
  const body = new THREE.Mesh(rounded(0.56, 0.12, 0.03, 0.006), mat.plastic("#34383d", 0.6));
  body.position.z = -0.0155;
  body.castShadow = body.receiveShadow = true;
  consoleFace.add(body);
  printedFace(consoleFace, 0.55, 0.112, {
    pxPerM: 3600, background: "#2c3035", z: 0.0002,
    draw: (ctx, at) => {
      const dial = (x, y, title, left, right) => {
        silk(ctx, at, title, x, y + 0.03, 18, { color: "#c9c6bf", weight: 800 });
        silk(ctx, at, left, x - 0.02, y + 0.018, 17, { weight: 800 });
        silk(ctx, at, right, x + 0.02, y + 0.018, 17, { weight: 800 });
      };
      dial(-0.235, 0.012, "CIRCUIT", "RC", "RL");
      dial(-0.165, 0.012, "SOURCE", "S1", "GEN");
      silk(ctx, at, "SPEED", -0.2, -0.018, 18, { color: "#c9c6bf", weight: 800 });
      silk(ctx, at, "slow", -0.226, -0.035, 15, { weight: 700 });
      silk(ctx, at, "fast", -0.174, -0.035, 15, { weight: 700 });
    },
  });
  kindKnob = addKnob(consoleFace, {
    x: -0.235, y: 0.008, radius: 0.0125, values: ["RC", "RL"], index: 0, sweep: 90, name: "kind",
    // each circuit opens on its source's values (partDefaults): the manual's with S1, kHz ones with the generator
    onChange: (v) => { pushHistory(); state.kind = v; Object.assign(state, partDefaults(v, state.source)); newRun(); placeParts(); fitGenerator(); autoset(); changed(); },
  });
  sourceKnob = addKnob(consoleFace, {
    x: -0.165, y: 0.008, radius: 0.0125, values: ["s1", "gen"], index: 0, sweep: 90, name: "source",
    onChange: (v) => setSource(v),
  });
  speedKnob = addKnob(consoleFace, { x: -0.2, y: -0.036, radius: 0.0105, values: SPEEDS, index: SPEEDS.indexOf(0.5), name: "speed", onChange: () => changed() });
  guideDisplay = new Display(consoleFace, 0.025, 0, 0.27, 0.096, { pxPerM: 5000, glass: "#0e1418" });
  const K = (x, y, label, name, onPress, extra = {}) => addKey(consoleFace, { x, y, w: 0.046, h: 0.019, label, color: "#d9d5cb", name, onPress, ...extra });
  startKey = K(0.189, 0.03, "START", "start", () => { run.active = true; state.started = true; if (!run.sweep) { run.last = readings(); startSweep(); } changed(); }, { color: "#bfe6c4", led: "#53e07a" });
  pauseKey = K(0.24, 0.03, "PAUSE", "pause", () => { run.active = false; changed(); });
  K(0.189, -0.004, "NEW RUN", "newrun", () => { newRun(); changed(); });
  K(0.24, -0.004, "UNDO", "undo", () => undo());
  K(0.189, -0.038, "GUIDE", "guide", (k) => { guided = !guided; k.setLit(guided); changed(); }, { led: "#ffcf3f" }).setLit(true);
  K(0.24, -0.038, "RESET", "reset", () => resetLab());
}
/** Slow the square wave enough for the response to settle: a period of at least 10 τ. */
function fitGenerator() {
  const best = [...FREQUENCIES].reverse().find((f) => 1 / f >= 10 * theory(state).tau) ?? FREQUENCIES[0];
  state.gen.freq = best;
  freqKnob.setValue(best);
}
/** Change the source: the other source's wires and leads come off the board. */
function setSource(next) {
  pushHistory();
  const other = next === "gen" ? "s1" : "gen";
  const key = (a, b) => [netOf(a), netOf(b)].sort().join("|");
  const theirs = SOURCES[other].jumpers.map((j) => key(j.a, j.b));
  for (const w of [...wires]) if (theirs.includes(key(w.a, w.b))) w.remove();
  syncWires();
  for (const id of SOURCES[other].leads) state.leads[id] = null;
  state.source = next;
  state.s1 = "discharge";
  Object.assign(state, partDefaults(state.kind, next));
  newRun();
  placeParts();
  s1Switch.place();
  if (next === "gen") fitGenerator();
  autoset();
  changed();
  for (const m of movers) if (m instanceof Plug) m.sync();
}

function schematic(ctx, x0, y0, h, kind, source) {
  const s = h / 100;
  const X = (x) => x0 + x * s, Y = (y) => y0 + y * s;
  const ink = "#dfe7e3";
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = 2.2 * s;
  const line = (...pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke(); };
  const dot = (x, y, r = 1.8) => { ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(X(x), Y(y), r * s, 0, Math.PI * 2); ctx.fill(); };
  const ground = (x, y) => { line([x, y], [x, y + 4]); line([x - 7, y + 4], [x + 7, y + 4]); line([x - 4.5, y + 7], [x + 4.5, y + 7]); line([x - 2, y + 10], [x + 2, y + 10]); };
  const top = 26, bottom = 74;
  // the source
  if (source === "s1") {
    text(ctx, "+V", X(10), Y(12), 8.5 * s, { color: "#ff8a80", weight: 800 });
    line([10, 18], [10, 26], [18, 26]);
    dot(18, 26);
    ground(10, 48);
    line([10, 42], [10, 48]);
    line([10, 42], [18, 42]);
    dot(18, 42);
    dot(40, 34);
    line(state.s1 === "charge" ? [20, 26.5] : [20, 41.5], [38.5, 34]);
    text(ctx, "S1", X(29), Y(21), 8.5 * s, { color: "#ffc27a", weight: 800 });
    line([40, 34], [40, top], [52, top]);
  } else {
    ctx.beginPath(); ctx.arc(X(24), Y(50), 11 * s, 0, Math.PI * 2); ctx.stroke();
    line([18, 54], [18, 46], [24, 46], [24, 54], [30, 54], [30, 46]);
    line([24, 39], [24, top], [52, top]);
    line([24, 61], [24, bottom]);
  }
  text(ctx, "Vin", X(46), Y(top - 9), 8.5 * s, { color: COLOR.yellow, weight: 800 });
  dot(52, top);
  // R
  ctx.strokeRect(X(60), Y(top - 4), 22 * s, 8 * s);
  line([52, top], [60, top]);
  line([82, top], [100, top]);
  text(ctx, "R", X(71), Y(top - 11), 9 * s, { weight: 800, color: ink });
  dot(100, top);
  text(ctx, "A", X(100), Y(top - 11), 9 * s, { color: COLOR.cyan, weight: 800 });
  if (kind === "RC") {
    line([100, top], [116, top]);
    dot(116, top, 2.4);
    text(ctx, "Vc", X(127), Y(top), 8.5 * s, { color: COLOR.cyan, weight: 800 });
  }
  // C or L
  if (kind === "RC") {
    line([100, top], [100, 47]);
    line([91, 47], [109, 47]);
    line([91, 53], [109, 53]);
    line([100, 53], [100, bottom]);
    text(ctx, "C", X(116), Y(50), 9 * s, { weight: 800, color: ink });
  } else {
    // L from node A to node B, then the 1 Ω Rs to ground; VOUT is taken across Rs
    line([100, top], [100, 31]);
    for (let i = 0; i < 4; i += 1) { ctx.beginPath(); ctx.arc(X(100), Y(34 + i * 5), 2.5 * s, -Math.PI / 2, Math.PI / 2); ctx.stroke(); }
    line([100, 51], [100, 53]);
    text(ctx, "L", X(112), Y(41), 9 * s, { weight: 800, color: ink });
    dot(100, 53);
    text(ctx, "B", X(91), Y(53), 8 * s, { color: COLOR.cyan, weight: 800 });
    line([100, 53], [116, 53]);
    dot(116, 53, 2.4);
    text(ctx, "VRs", X(129), Y(53), 8.5 * s, { color: COLOR.cyan, weight: 800 });
    line([100, 53], [100, 57]);
    ctx.strokeRect(X(96.5), Y(57), 7 * s, 12 * s);
    line([100, 69], [100, bottom]);
    text(ctx, "Rs 1Ω", X(116), Y(64), 7.5 * s, { weight: 800, color: ink });
  }
  const left = source === "s1" ? 60 : 24;
  line([left, bottom], [100, bottom]);
  ground(68, bottom);
}

const seconds = (t) => engineering(t, "s");
function drawGuide() {
  const next = stepList.find((s) => !s.done);
  const doneCount = stepList.filter((s) => s.done).length;
  const t = theory(state);
  const rc = state.kind === "RC";
  const stray = strayJumpers(state);
  const span = timeKnob.value * 9;
  const warning = model.short ? `Short circuit: ${model.short}`
    : stray.length ? `A wire is not part of this circuit (${stray.length})`
    : state.source === "gen" && 1 / state.gen.freq < 5 * t.tau ? "The wave is too fast to settle: lower FREQ, or watch it average out"
    : t.tau > span || t.tau < span / 200 ? "τ does not fit the screen: press AUTO on the scope" : "";
  const measured = run.sweep?.measured;
  const live = run.last ?? { x: 0, i: 0 };
  const lines = {
    title: `${rc ? "RC" : "RL"} circuit · ${state.source === "gen" ? "square wave" : state.s1 === "charge" ? (rc ? "charging" : "current rising") : (rc ? "discharging" : "current decaying")}`,
    progress: `${next ? `Step ${doneCount + 1} of ${stepList.length}` : "Circuit complete"}  ·  ${state.source === "gen" ? `${t.drive} V ${hz(state.gen.freq)}` : `${t.drive} V`}`,
    step: next ? next.text : state.source === "s1" ? "Flip S1, change R, press AUTO, and compare measured τ with theory" : "Change R or FREQ, press AUTO, and compare measured τ with theory",
    response: t.response,
    tau: `${t.formula} = ${seconds(t.tau)}  measured ${measured ? seconds(measured.tau) : "—"}`,
    finals: `final ${rc ? `Vc ${t.finalValue.toFixed(2)} V` : `I ${engineering(t.finalValue, "A")}`}   peak I ${engineering(t.peakCurrent, "A")}`,
    now: `now ${rc ? `Vc ${live.x.toFixed(2)} V` : `I ${engineering(Math.abs(live.x), "A")}`}   E ${engineering(energy(state, live.x), "J")}`,
    warning, guided, kind: state.kind, source: state.source, s1: state.s1,
  };
  guideDisplay.draw(JSON.stringify(lines), (ctx, w, h) => {
    schematic(ctx, 6, h * 0.05, h * 0.9, state.kind, state.source);
    const x = h * 1.28 + 14;
    text(ctx, lines.title, x, h * 0.1, h * 0.082, { color: "#f2efe7", align: "left", weight: 800 });
    text(ctx, lines.progress, x, h * 0.195, h * 0.056, { color: "#9fb3ab", align: "left", font: MONO, weight: 600 });
    wrap(ctx, lines.step, x, h * 0.3, w - x - 12, h * 0.082, { color: next && guided ? COLOR.next : "#f2efe7", align: "left", weight: 700 });
    text(ctx, lines.response, x, h * 0.5, h * 0.062, { color: "#f2efe7", align: "left", font: MONO, weight: 600 });
    text(ctx, lines.tau, x, h * 0.59, h * 0.06, { color: "#ff9b54", align: "left", font: MONO, weight: 600 });
    text(ctx, lines.finals, x, h * 0.68, h * 0.06, { color: "#cfe0d8", align: "left", font: MONO, weight: 600 });
    text(ctx, lines.now, x, h * 0.77, h * 0.06, { color: COLOR.cyan, align: "left", font: MONO, weight: 600 });
    if (lines.warning) wrap(ctx, lines.warning, x, h * 0.87, w - x - 12, h * 0.052, { color: "#ffb347", align: "left", weight: 700 });
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
  accepts(id) { return this.kind === "lead" ? isPost(id) || !takenHoles(this).has(id) : true; }
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
for (const [id, jx] of [["sup+", -0.09], ["supg", -0.01]]) {
  plugs[id] = new Plug({ kind: "lead", id, color: COLOR[LEADS[id].color], from: supplyJacks[id], park: leadPark(supply, jx, 0.052), parkYaw: leadYaw(supply) });
}
gen.group.updateMatrixWorld(true);
plugs.gen = new Plug({ kind: "lead", id: "gen", color: COLOR.yellow, from: genJacks.gen, park: leadPark(gen, -0.08), parkYaw: leadYaw(gen) });
plugs.genc = new Plug({ kind: "lead", id: "genc", color: COLOR.black, from: genJacks.genc, park: leadPark(gen, -0.03), parkYaw: leadYaw(gen) });
scope.group.updateMatrixWorld(true);
plugs.ch1 = new Plug({ kind: "probe", id: "ch1", color: COLOR.yellow, from: scopeJacks.ch1, park: leadPark(scope, -0.13), parkYaw: leadYaw(scope) });
plugs.ch2 = new Plug({ kind: "probe", id: "ch2", color: COLOR.cyan, from: scopeJacks.ch2, park: leadPark(scope, -0.07), parkYaw: leadYaw(scope) });
plugs.probegnd = new Plug({ kind: "probe", id: "probegnd", color: COLOR.black, from: scopeJacks.gnd, park: leadPark(scope, -0.01), parkYaw: leadYaw(scope) });

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
const endHeight = (id) => (isPost(id) ? 0.007 : BOARD_H - 0.003);

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
    ...partObstacles(state.kind).filter((o) => !mine.includes(o.what)),
    ...[...wires.filter((w) => w !== except).flatMap((w) => [w.a, w.b]), ...Object.values(state.leads)].filter((id) => id && !mine.includes(id) && !isPost(id)).map(endObstacle),
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
    this.path = points;
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
  accepts(id) { return !isPost(id) && id !== this.wire.id(1 - this.index); }
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
  const taken = new Set(legsFor(state.kind));
  for (const w of wires) for (const e of w.ends) if (e !== except && !isPost(e.contact)) taken.add(e.contact);
  for (const [id, c] of Object.entries(state.leads)) if (c && !isPost(c) && plugs[id] !== except) taken.add(c);
  return taken;
}

/** Lay a wire between two contacts, coloured for the job it does. */
function addWire(a, b) {
  pushHistory();
  const wire = new Wire({ a, b, color: suggestColor(state.source, a, b, state.kind) });
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
  preview.material.color.set(COLOR[to.id ? suggestColor(state.source, wireStart, to.id, state.kind) : "white"]);
  preview.visible = true;
}
/** Whether a click on this contact can start or finish a wire. */
// wires go into breadboard holes only: posts are for instrument leads
function canWire(id) { return !isPost(id) && !takenHoles().has(id); }
/** Where a wire end already sits in this hole, so a click there opens that wire instead. */
const wireAt = (id) => (isPost(id) ? null : wires.find((w) => w.a === id || w.b === id) ?? null);
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
function closeMenu() { menuWire = null; menu.visible = false; palette.visible = false; palette.hand = null; palette.hover = null; }
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
  menu.scale.setScalar(renderer.xr.isPresenting ? 1.5 : 1); // easier to poke in the headset
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

// ---------- highlights: the next step and the snap target ----------
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
  } else if (next.kind === "lead" || next.kind === "probe") {
    ringAt(guideRings[0], next.target);
    guideTargets.add(plugs[next.id]);
  } else if (next.kind === "power") guideTargets.add(powerKey);
  else if (next.kind === "start") guideTargets.add(startKey);
  else if (next.kind === "switch") guideTargets.add(s1Switch);
}

// the solution: the selected circuit built complete and running, with real wires,
// leads and probes the student can then change, measure and undo like their own work
function buildSolution() {
  pushHistory();
  closeMenu();
  cancelWire();
  clearWires();
  newRun();
  for (const j of jumpersFor(state.source, state.kind)) new Wire({ a: j.a, b: j.b, color: j.color });
  syncWires();
  for (const id of Object.keys(state.leads)) state.leads[id] = SOURCES[state.source].leads.includes(id) ? LEADS[id].target : null;
  // the scope measures it: both probes and its ground lead
  for (const id of Object.keys(state.probes)) state.probes[id] = null;
  for (const step of steps(state)) if (step.kind === "probe") state.probes[step.id] = step.target;
  state.supply.on = state.source === "s1";
  state.s1 = "discharge";
  if (state.source === "gen") fitGenerator();
  autoset();
  changed();
  run.active = true;
  state.started = true;
  if (state.source === "s1") { state.s1 = "charge"; state.charged = true; s1Switch.place(); }
  run.last = readings();
  changed();
  for (const m of movers) if (m instanceof Plug) m.sync();
}

const hovered = new Set();
function updateGlow(time) {
  const blink = 0.5 + 0.5 * Math.sin(time * 0.007);
  for (const target of glowTargets) {
    const m = target.glow;
    if (!m?.emissive) continue;
    if (target === menuWire) m.emissive.setRGB(0.25 + 0.3 * blink, 0.25 + 0.3 * blink, 0.25 + 0.3 * blink); // selected
    else if (hovered.has(target)) m.emissive.setRGB(0.22, 0.22, 0.22);
    else if (guideTargets.has(target)) m.emissive.setRGB(0.45 * blink, 0.33 * blink, 0.02);
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
    kind: state.kind,
    source: state.source,
    s1: state.s1,
    r: state.r,
    c: state.c,
    l: state.l,
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
  const kindChanged = s.kind !== state.kind;
  state.kind = s.kind;
  state.source = s.source;
  state.s1 = s.s1;
  state.r = s.r;
  state.c = s.c;
  state.l = s.l;
  state.supply.on = s.supplyOn;
  state.leads = { ...s.leads };
  state.probes = { ...s.probes };
  kindKnob.setValue(s.kind);
  sourceKnob.setValue(s.source);
  s1Switch.place();
  if (kindChanged) newRun();
  placeParts();
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
  const keep = { kind: state.kind, source: state.source };
  state = { ...initialState(), ...keep, ...partDefaults(keep.kind, keep.source) };
  newRun();
  ampKnob.setValue(state.gen.amp);
  freqKnob.setValue(state.gen.freq);
  s1Switch.place();
  closeMenu();
  cancelWire();
  clearWires();
  placeParts();
  autoset();
  changed();
  for (const m of movers) if (m instanceof Plug) m.sync();
}

onChange(() => {
  tipLabel.style.display = "none"; // what it named may have just changed
  // any change to the circuit starts a new segment of the trace from the stored state
  const sig = signature();
  if (sig !== run.sig) {
    run.sig = sig;
    if (run.sweep || run.active) startSweep();
    run.last = readings();
  }
  drawSupply();
  drawGenerator();
  drawModules();
  drawScope();
  drawGuide();
  updateGuide();
  startKey.setLit(run.active);
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
  // viewing someone else's bench: only the class panel answers; a drag still orbits
  if (locked && !h?.ref?.classKey) { press = null; return; }
  press = { x: e.clientX, y: e.clientY, ref: h?.ref ?? null, point: h ? board.worldToLocal(h.point.clone()) : null, contact: null, id: e.pointerId };
  if (h?.ref instanceof MenuItem) { applyMenu(h.ref); press = null; return; }
  if (h?.ref instanceof Key || h?.ref instanceof Toggle) { h.ref.press(); press = null; return; }
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
  if (classLink.session) pointerBead = pointerOnBench(rayFrom(e));
  if (locked) { hovered.clear(); snapRing.visible = false; showPreview(null); showTip(e, "Viewing another bench: read-only"); renderer.domElement.style.cursor = ""; return; }
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
      renderer.domElement.style.cursor = h.ref instanceof Key || h.ref instanceof MenuItem || h.ref instanceof Toggle ? "pointer" : "grab";
      showTip(e, h.ref instanceof Toggle ? `S1 · ${state.s1} · click to switch` : h.ref instanceof MenuItem ? h.ref.label : w ? `Wire ${contactName(w.a)} → ${contactName(w.b)} · click to recolour, drag to move` : null);
      if (!w) showPreview(null);
      return;
    }
    const q = boardPoint(ray);
    const c = q ? contactAt(q) : null;
    if (c) {
      ringAt(snapRing, c);
      const busy = !canWire(c) && !wireAt(c);
      const action = isPost(c) ? "for instrument leads" : wireAt(c) && !wireStart ? "click to open its wire" : busy ? "taken" : wireStart ? (c === wireStart ? "click to cancel" : "click to finish the wire") : "click to start a wire";
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
    const n = Math.round(((e.clientX - drag.x) - (e.clientY - drag.y)) / (drag.knob.px ?? 24));
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
renderer.domElement.addEventListener("pointerleave", () => { pointerBead = null; if (!drag) { hovered.clear(); showTip(null, null); } });
window.addEventListener("keydown", (e) => {
  if (locked) return;
  if (e.key === "Escape") { cancelWire(); closeMenu(); }
  if ((e.key === "Delete" || e.key === "Backspace") && menuWire) { e.preventDefault(); applyMenu(menuItems.find((i) => i.action === "delete")); }
});

// ---------- VR ----------
// Controllers are drawn as the headset's own models. A short pointer with a bead
// at its end presses keys by pushing into them. The buttons never overlap:
//  trigger  a quick tap selects: the wire the bead is on or near (or whose end
//           is in that hole), and a tap on nothing deselects. Laying a wire is a
//           deliberate drag: press in one hole, move to another, let go. A tap on
//           a hole therefore never starts a wire by accident.
//  grip     takes hold with the palm: a knob within reach first, then a plug or
//           probe, and a wire end or bend only when the palm is right on it.
//  B / Y    deselects, or drops a wire being laid.
// A selected wire glows, and its palette appears above the other controller:
// touch a colour with the pointing bead, or tilt that hand's thumbstick toward
// one and pull its trigger. The item under choice grows and is named in the
// middle; the wire's current colour is ringed.
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
  const holder = { ctrl, grip, line, bead, pointerGroup, source: null, grab: null, press: null, ready: false, backWas: false, offset: new THREE.Vector3(), armed: new Set(), lastRoll: 0 };
  ctrl.addEventListener("connected", (e) => { holder.source = e.data; pointerGroup.visible = e.data.targetRayMode === "tracked-pointer"; });
  ctrl.addEventListener("disconnected", () => { if (holder.grab) release(holder); holder.source = null; holder.press = null; pointerGroup.visible = false; if (palette.hand === holder) closeMenu(); });
  ctrl.addEventListener("squeezestart", () => grab(holder));
  ctrl.addEventListener("squeezeend", () => release(holder));
  ctrl.addEventListener("selectstart", () => select(holder));
  ctrl.addEventListener("selectend", () => selectEnd(holder));
  scene.add(ctrl, grip);
  return holder;
});
const palmOf = (holder) => lab.worldToLocal(holder.grip.localToWorld(PALM.clone()));
const beadOf = (holder) => lab.worldToLocal(holder.bead.getWorldPosition(new THREE.Vector3()));
const pulse = (holder, strength, ms) => holder?.source?.gamepad?.hapticActuators?.[0]?.pulse?.(strength, ms);

/** The hole the bead is in: only when the bead is down at the board's face. */
function contactAtBead(holder) {
  const q = toBoard(beadOf(holder));
  if (q.y < -0.01 || q.y > BOARD_H + 0.012) return null;
  return contactAt(q, 0.0065, 0.016);
}
/** The wire the bead is on or near, and the point on it nearest the bead. */
function wireAtBead(holder, reach = 0.009) {
  const q = toBoard(beadOf(holder));
  const seg = new THREE.Line3();
  const at = new THREE.Vector3();
  let best = null;
  let bestD = reach;
  for (const w of wires) for (let i = 1; i < w.path.length; i += 1) {
    seg.set(w.path[i - 1], w.path[i]);
    seg.closestPointToPoint(q, true, at);
    const d = at.distanceTo(q);
    if (d < bestD) { bestD = d; best = { wire: w, at: at.clone() }; }
  }
  return best;
}
/** The board wheel's segment at the bead (used only when there is no second controller for the palette). */
function menuItemAtBead(holder) {
  const bead = holder.bead.getWorldPosition(new THREE.Vector3());
  let best = null;
  let bestD = 0.012 * menu.scale.x;
  for (const item of menuItems) {
    const d = item.mesh.getWorldPosition(new THREE.Vector3()).distanceTo(bead);
    if (d < bestD) { bestD = d; best = item; }
  }
  return best;
}
/**
 * What the grip would take. It reaches from the pointer bead, which stays in
 * view in front of the controller, and only falls back to the palm when nothing
 * is near the bead. Reaches suit each thing: knobs and plugs are easy to catch,
 * wire ends and bends need the bead right on them.
 */
const GRAB_REACH = { knob: [0.03, 0.05], plug: [0.04, 0.06], wire: [0.014, 0.016] };
function grabPoint(ref) {
  if (ref instanceof Knob) return lab.worldToLocal(ref.group.localToWorld(new THREE.Vector3(0, 0, ref.radius * 1.1)));
  return ref.grabPoint();
}
function nearest(holder) {
  const from = (origin, which) => {
    let best = null;
    let bestScore = 1;
    const consider = (ref, kind) => {
      const score = grabPoint(ref).distanceTo(origin) / GRAB_REACH[kind][which];
      if (score < bestScore) { best = ref; bestScore = score; }
    };
    for (const k of knobs) consider(k, "knob");
    for (const m of movers) if (!m.held) consider(m, m instanceof Plug ? "plug" : "wire");
    return best;
  };
  if (holder.pointerGroup.visible) { const atBead = from(beadOf(holder), 0); if (atBead) return atBead; }
  return from(palmOf(holder), 1);
}
// a halo on whatever each hand's grip would take
const grabMarkers = [0, 1].map(() => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), new THREE.MeshBasicMaterial({ color: "#4ade80", transparent: true, opacity: 0.28, depthTest: false, depthWrite: false }));
  m.renderOrder = 25;
  m.visible = false;
  lab.add(m);
  return m;
});
const GRAB_SIZE = (ref) => (ref instanceof Knob ? ref.radius * 1.35 : ref instanceof Plug ? 0.011 : 0.006);
// over the trainer the controllers turn see-through, so what is under the hand stays visible
function fadeController(holder, faded) {
  if (holder.faded === faded) return;
  let found = false;
  holder.grip.traverse((o) => {
    if (!o.isMesh) return;
    found = true;
    for (const m of [o.material].flat()) {
      m.userData.wasTransparent ??= m.transparent;
      m.transparent = faded || m.userData.wasTransparent;
      m.opacity = faded ? 0.3 : 1;
      m.depthWrite = !faded;
    }
  });
  if (found) holder.faded = faded; // the model loads after the controller connects
}
function overTrainer(holder) {
  const q = toBoard(palmOf(holder));
  return Math.abs(q.x) < TRAINER_W / 2 + 0.06 && q.z > FACE_Z0 - 0.06 && q.z < FACE_Z1 + 0.06 && q.y < 0.22;
}
function controllerRoll(holder, knob) {
  const q = holder.grip.getWorldQuaternion(new THREE.Quaternion());
  const frame = knob.group.getWorldQuaternion(new THREE.Quaternion()).invert();
  const x = new THREE.Vector3(1, 0, 0).applyQuaternion(q).applyQuaternion(frame);
  return Math.atan2(x.y, x.x);
}

// the palette, held above the hand that is not pointing
const palette = new THREE.Group();
palette.visible = false;
palette.hand = null;
palette.hover = null;
palette.stick = null;
scene.add(palette);
const PALETTE_ACTIONS = [...WIRE_COLORS, "auto", "delete"];
const PALETTE_R = 0.042;
const paletteItems = [];
const paletteLabel = canvasTexture(512, 160);
{
  const onTop = (m, order) => { m.renderOrder = order; m.material.depthTest = false; m.material.transparent = true; return m; };
  palette.add(onTop(new THREE.Mesh(new THREE.CircleGeometry(0.062, 64), new THREE.MeshBasicMaterial({ color: "#14171a", opacity: 0.9 })), 30));
  const label = onTop(new THREE.Mesh(new THREE.PlaneGeometry(0.052, 0.01625), new THREE.MeshBasicMaterial({ map: paletteLabel.texture, toneMapped: false })), 31);
  label.position.z = 0.0005;
  palette.add(label);
  PALETTE_ACTIONS.forEach((action, i) => {
    const angle = (i / PALETTE_ACTIONS.length) * Math.PI * 2; // clockwise from the top
    const x = Math.sin(angle) * PALETTE_R, y = Math.cos(angle) * PALETTE_R;
    const view = canvasTexture(128, 128);
    const { ctx } = view;
    const disc = (fill) => { ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(64, 64, 62, 0, Math.PI * 2); ctx.fill(); };
    if (action === "delete") {
      disc("#b8322b");
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 12; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(42, 42); ctx.lineTo(86, 86); ctx.moveTo(86, 42); ctx.lineTo(42, 86); ctx.stroke();
    } else if (action === "auto") {
      disc("#3a4048");
      text(ctx, "AUTO", 64, 66, 30, { color: "#f4f1ea", weight: 800 });
    } else {
      disc(COLOR[action]);
      if (action === "black") { ctx.strokeStyle = "#8a9096"; ctx.lineWidth = 6; ctx.stroke(); }
    }
    view.texture.needsUpdate = true;
    const mesh = onTop(new THREE.Mesh(new THREE.CircleGeometry(0.0105, 40), new THREE.MeshBasicMaterial({ map: view.texture, toneMapped: false })), 32);
    const ring = onTop(new THREE.Mesh(new THREE.RingGeometry(0.0128, 0.0148, 40), new THREE.MeshBasicMaterial({ color: "#ffffff" })), 32);
    const current = onTop(new THREE.Mesh(new THREE.RingGeometry(0.0118, 0.0128, 40), new THREE.MeshBasicMaterial({ color: "#4ade80" })), 32);
    for (const m of [mesh, ring, current]) m.position.set(x, y, 0.001);
    ring.visible = current.visible = false;
    palette.add(mesh, ring, current);
    paletteItems.push({ action, angle, mesh, ring, current, get label() { return action === "delete" ? "Delete wire" : action === "auto" ? "Re-route" : `${action[0].toUpperCase()}${action.slice(1)}`; }, get role() { return action === "delete" ? "removes it" : action === "auto" ? "automatically" : ROLE[action]; } });
  });
}
let paletteKey = "";
function drawPaletteLabel() {
  const item = palette.hover;
  const key = item ? item.action : menuWire ? `wire:${menuWire.color}` : "";
  if (key === paletteKey) return;
  paletteKey = key;
  const { ctx, canvas, texture } = paletteLabel;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (item) {
    text(ctx, item.label, 256, 58, 64, { color: "#ffffff", weight: 800 });
    text(ctx, item.role, 256, 122, 40, { color: "#b9c4cc", weight: 600 });
  } else if (menuWire) {
    text(ctx, "Point or tilt the stick", 256, 58, 38, { color: "#e4e1d9", weight: 700 });
    text(ctx, "B / Y closes", 256, 118, 34, { color: "#9aa3ab", weight: 600 });
  }
  texture.needsUpdate = true;
}

/** Select a wire: it glows, and its palette opens over the other hand (or on the board if there is none). */
function selectWire(wire, by, at) {
  const other = holders.find((h) => h !== by && h.source);
  if (!other) { openMenu(wire, at); return; }
  cancelWire();
  menuWire = wire;
  menu.visible = false;
  palette.hand = other;
  palette.hover = null;
  palette.stick = null;
  palette.visible = true;
  pulse(other, 0.3, 30);
}
function applyPalette(item, by) {
  pulse(by, 0.5, 30);
  applyMenu(item);
}
const paletteAnchor = new THREE.Vector3();
/** Hold the palette above its hand, facing the student, and work out what is under choice. */
function updatePalette(head) {
  if (!palette.visible || !palette.hand?.source) return;
  palette.hand.grip.getWorldPosition(paletteAnchor);
  palette.position.copy(paletteAnchor).add(new THREE.Vector3(0, 0.1, 0));
  head.getWorldQuaternion(palette.quaternion);
  // the pointing bead wins; otherwise the palette hand's thumbstick chooses
  let pointed = null;
  for (const holder of holders) {
    if (holder === palette.hand || !holder.source) continue;
    const bead = holder.bead.getWorldPosition(new THREE.Vector3());
    for (const item of paletteItems) if (item.mesh.getWorldPosition(new THREE.Vector3()).distanceTo(bead) < 0.016) pointed = { item, by: holder };
  }
  const axes = palette.hand.source.gamepad?.axes ?? [];
  const sx = axes[2] ?? 0, sy = -(axes[3] ?? 0);
  if (Math.hypot(sx, sy) > 0.55) {
    const turn = (Math.atan2(sx, sy) + Math.PI * 2) % (Math.PI * 2);
    palette.stick = paletteItems[Math.round((turn / (Math.PI * 2)) * paletteItems.length) % paletteItems.length];
  }
  const next = pointed?.item ?? palette.stick;
  if (next !== palette.hover) pulse(pointed?.by ?? palette.hand, 0.15, 12);
  palette.hover = next;
  palette.pointedBy = pointed?.by ?? null;
  for (const item of paletteItems) {
    const on = item === palette.hover;
    item.mesh.scale.setScalar(on ? 1.3 : 1);
    item.ring.scale.setScalar(on ? 1.3 : 1);
    item.ring.visible = on;
    item.current.visible = item.action === menuWire?.color;
  }
  drawPaletteLabel();
}

function select(holder) {
  if (holder.grab || locked) return;
  // S1 sits apart from the holes, so a tap on its lever means the switch
  if (!palette.visible && beadOf(holder).distanceTo(s1Switch.point()) < 0.024) { s1Switch.press(); pulse(holder, 0.5, 30); return; }
  // the palette hand's trigger confirms what its stick (or the other bead) has chosen
  if (palette.visible && holder === palette.hand) { if (palette.hover) applyPalette(palette.hover, holder); return; }
  if (palette.visible && palette.pointedBy === holder && palette.hover) { applyPalette(palette.hover, holder); return; }
  if (menu.visible) { const item = menuItemAtBead(holder); if (item) { applyMenu(item); pulse(holder, 0.4, 20); return; } }
  const c = contactAtBead(holder);
  holder.press = {
    from: beadOf(holder),
    hole: c && canWire(c) ? c : null, // where a wire could be drawn from
    owner: c ? wireAt(c) : null, // a wire whose end sits in that hole
    near: wireAtBead(holder),
    drawing: false,
  };
}
function selectEnd(holder) {
  const press = holder.press;
  holder.press = null;
  if (!press) return;
  if (press.drawing) {
    const c = contactAtBead(holder);
    if (c && c !== press.hole && canWire(c)) { addWire(press.hole, c); pulse(holder, 0.5, 30); }
    cancelWire();
    return;
  }
  // a tap: select what is under the bead, or deselect
  if (press.near) { selectWire(press.near.wire, holder, press.near.at); pulse(holder, 0.35, 20); }
  else if (press.owner) { selectWire(press.owner, holder); pulse(holder, 0.35, 20); }
  else { closeMenu(); cancelWire(); }
}
function grab(holder) {
  if (holder.grab || locked) return;
  if (holder !== palette.hand) closeMenu();
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
    if (!holder.source) { grabMarkers[holders.indexOf(holder)].visible = false; continue; }
    holder.line.material.opacity = holder.grab ? 0.12 : 0.45;
    fadeController(holder, overTrainer(holder));
    if (holder.grab) grabMarkers[holders.indexOf(holder)].visible = false;
    holder.bead.visible = !holder.grab;
    // B or Y deselects, or drops a wire being laid
    const back = Boolean(holder.source.gamepad?.buttons?.[5]?.pressed);
    if (back && !holder.backWas) { closeMenu(); cancelWire(); if (holder.press) holder.press = null; pulse(holder, 0.2, 15); }
    holder.backWas = back;
    holder.ready = false;
    const g = holder.grab;
    if (!g) {
      const n = nearest(holder);
      if (n) { hovered.add(n); if (n.wire) hovered.add(n.wire); }
      if (n !== holder.grabTarget) { holder.grabTarget = n; if (n) pulse(holder, 0.12, 10); }
      const marker = grabMarkers[holders.indexOf(holder)];
      marker.visible = Boolean(n);
      if (n) { marker.position.copy(grabPoint(n)); marker.scale.setScalar(GRAB_SIZE(n)); }
      if (holder === palette.hand) continue;
      const press = holder.press;
      if (press?.hole && !press.drawing && beadOf(holder).distanceTo(press.from) > 0.008) {
        // the bead has left the hole it was pressed in: this is a wire being drawn
        press.drawing = true;
        closeMenu();
        wireStart = press.hole;
        ringAt(startRing, press.hole);
        pulse(holder, 0.3, 15);
      }
      if (press?.drawing) {
        const c = contactAtBead(holder);
        if (c && c !== press.hole && canWire(c)) { pointed = c; holder.ready = true; }
        continue;
      }
      if (beadOf(holder).distanceTo(s1Switch.point()) < 0.024) { hovered.add(s1Switch); holder.ready = true; continue; }
      const w = wireAtBead(holder);
      const c = contactAtBead(holder);
      if (w) { hovered.add(w.wire); holder.ready = true; }
      else if (c && (canWire(c) || wireAt(c))) { pointed = c; holder.ready = true; }
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
  if (pointed) { ringAt(snapRing, pointed); showPreview(wireStart && pointed !== wireStart ? { id: pointed } : null); }
  else if (!holders.some((h) => h.grab?.kind === "mover")) { snapRing.visible = false; showPreview(null); }
  updatePalette(renderer.xr.getCamera());
  // bead pokes: each key takes the deepest press from either free hand
  for (const key of keys) {
    if (locked && !key.classKey) continue; // another's bench: only the class panel
    let depth = 0, by = null;
    for (const holder of holders) {
      if (!holder.source || holder.grab || holder.press) continue;
      const d = key.pokeDepth(holder.bead.getWorldPosition(beadWorld), holder.armed);
      if (d > depth) { depth = d; by = holder; }
    }
    if (by || key.cap.position.z !== key.rest) if (key.setDepth(depth) && by) pulse(by, 0.5, 25);
  }
  for (const holder of holders) holder.bead.material.color.copy(holder.armed.size || holder.ready ? BEAD_READY : BEAD_IDLE);
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
let classFraming = false; // in a class the view widens to take in the class panel
function fitStage() {
  const w = Math.max(stage.clientWidth, 1), h = Math.max(stage.clientHeight, 1);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  if (viewTouched) return;
  const halfV = THREE.MathUtils.degToRad(camera.fov / 2);
  const halfH = Math.atan(Math.tan(halfV) * camera.aspect);
  const tall = camera.aspect < 1;
  const distance = Math.max((tall ? 0.3 : classFraming ? 0.74 : 0.62) / Math.tan(halfH), 0.36 / Math.tan(halfV), 0.6);
  controls.target.x = classFraming && !tall ? -0.07 : 0;
  camera.position.copy(controls.target).addScaledVector(tall ? VIEW_DIR_TALL : VIEW_DIR, distance);
  controls.update();
}
new ResizeObserver(fitStage).observe(stage);
fitStage();

placeParts();
for (const m of movers) if (m instanceof Plug) m.sync();
autoset();
changed();

// ---------- class session ----------
// An instructor and students each run this bench; class/bench-link.js keeps each
// headset showing the right one. The whole bench travels as benchState(), the
// same setup Undo keeps plus the instruments' settings, and people's hands as
// poses in the lab's frame. While viewing another's bench it is read-only.
let locked = false;
let pointerBead = null; // desktop: the point under the mouse, in the lab frame
function setLocked(on) {
  locked = on;
  if (!on) return;
  closeMenu();
  cancelWire();
  for (const holder of holders) { if (holder.grab) release(holder); holder.press = null; }
  if (drag?.kind === "mover") drag.mover.drop(drag.mover.tip());
  drag = null;
  press = null;
  controls.enabled = true;
}
const r4 = (v) => Math.round(v * 1e4) / 1e4;
function benchState() {
  return {
    v: 1,
    snap: snapshot(),
    gen: { ...state.gen },
    level: state.supply.level,
    started: state.started,
    charged: state.charged,
    active: run.active,
    knobs: { ch1: ch1Knob.index, ch2: ch2Knob.index, ch3: ch3Knob.index, time: timeKnob.index, speed: speedKnob.index, pos1: posKnobs.ch1.index, pos2: posKnobs.ch2.index, pos3: posKnobs.ch3.index },
    view: structuredClone(view),
  };
}
function applyBench(b) {
  if (!b?.snap) return;
  state.gen = { ...b.gen };
  ampKnob.setValue(b.gen.amp);
  freqKnob.setValue(b.gen.freq);
  state.supply.level = b.level;
  const k = b.knobs;
  for (const [knob, i] of [[ch1Knob, k.ch1], [ch2Knob, k.ch2], [ch3Knob, k.ch3], [timeKnob, k.time], [speedKnob, k.speed], [posKnobs.ch1, k.pos1], [posKnobs.ch2, k.pos2], [posKnobs.ch3, k.pos3]]) knob.setIndex(i, true);
  Object.assign(view, structuredClone(b.view));
  for (const id of ["ch1", "ch2", "ch3"]) channelKeys[id].setLit(view.on[id]);
  cursorKey.setLit(view.cursor !== "off");
  syncCursorKnob();
  applySnapshot(b.snap);
  state.started = b.started;
  state.charged = b.charged;
  run.active = b.active;
  if (run.active && !run.sweep) { run.last = readings(); startSweep(); }
  changed();
}
const poseV = new THREE.Vector3(), poseQ = new THREE.Quaternion();
function labPose(object) {
  object.getWorldPosition(poseV);
  object.getWorldQuaternion(poseQ);
  return { p: lab.worldToLocal(poseV.clone()).toArray().map(r4), q: poseQ.toArray().map(r4) };
}
function pointerOnBench(ray) {
  const h = hit(ray);
  if (h) return lab.worldToLocal(h.point.clone()).toArray().map(r4);
  const q = boardPoint(ray);
  return q && Math.abs(q.x) < TRAINER_W / 2 && q.z > FACE_Z0 && q.z < FACE_Z1 ? toLab(q).toArray().map(r4) : null;
}
function benchPose() {
  const xr = renderer.xr.isPresenting;
  const head = labPose(xr ? renderer.xr.getCamera() : camera);
  const hands = xr
    ? holders.map((h) => (h.source ? { ...labPose(h.grip), bead: beadOf(h).toArray().map(r4), grab: Boolean(h.grab) } : null))
    : [pointerBead ? { p: null, q: null, bead: pointerBead, grab: Boolean(drag) } : null, null];
  return { head, hands };
}
// the class panel stands left of the console, turned toward the student
const classStand = new THREE.Group();
classStand.position.set(-0.43, TOP + 0.045, HINGE_Z + 0.05);
classStand.rotation.set(-1.0, 0.32, 0, "YXZ");
lab.add(classStand);
const dropKey = (k) => {
  const i = keys.indexOf(k);
  if (i >= 0) keys.splice(i, 1);
  unpick(k.pickable);
  unpick(k.face);
  glowTargets.delete(k);
  k.group.removeFromParent();
};
const classPanel = new ClassPanel({ parent: classStand, addKey, dropKey, Display, text, MONO, rounded, mat });
const ghosts = new Ghosts(lab);
const classLink = linkBench({
  lab: "lab8",
  ui: classUi,
  panel: classPanel,
  ghosts,
  bench: { state: benchState, apply: applyBench, pose: benchPose, setLocked, steps: () => stepList, warning: () => (model.short ? "short" : null), framing: (on) => { if (on !== classFraming) { classFraming = on; fitStage(); } } },
});
onChange(() => classLink.changed());
const viewerAt = new THREE.Vector3();

let lastFrame = 0;
renderer.setAnimationLoop((time) => {
  const dt = Math.min((time - lastFrame) / 1000, 0.1);
  tickRun(dt);
  lastFrame = time;
  (renderer.xr.isPresenting ? renderer.xr.getCamera() : camera).getWorldPosition(viewerAt);
  classLink.tick(dt, time, lab.worldToLocal(viewerAt));
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
window.__lab8 = {
  get state() { return state; }, get model() { return model; }, get steps() { return stepList; }, get wireStart() { return wireStart; }, get menuWire() { return menuWire; },
  classLink, classPanel, ghosts, benchState, applyBench, get locked() { return locked; },
  run, plugs, wires, knobs, keys, rangeKeys, camera, contactPoint, toLab, toBoard, nearestContact, contactClicked, openMenu, applyMenu, menuItems, palette, paletteItems, lab, board, s1Switch,
  kindKnob, sourceKnob, speedKnob, timeKnob, powerKey, startKey, solutionKey, controls, holders, vr: { grab, release, select, selectEnd, updateHands, updatePalette, fitHeight },
};
