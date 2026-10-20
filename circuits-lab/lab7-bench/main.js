// Lab 7 · operational amplifiers, breadboard-bench alternative to the instrument
// wall in ../lab7/, published beside it for instructors to compare. A standing lab bench: a breadboard trainer in
// the middle, the instruments around it within reach, and every control a
// physical part. The student picks a configuration on the trainer, wires it with
// jumpers and leads as the guide highlights each connection, powers it, and
// measures it with the scope and multimeter. Units are metres; +z faces the student.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import "../../assets/css/metahub-app-shell.css";
import "../../assets/css/metahub-lab-theme.css";
import { mountLabShell } from "../../assets/js/metahub-app-shell.js";
import {
  AMPLITUDES, BLOCK_HOLES, CHIP_COL, COLS, CONFIGS, CONFIG_ORDER, DC2_LEVELS, FREQUENCIES, LEADS, PINS, POT_VALUES,
  SUPPLY_LEVELS, TDIV, VDIV, WAVES, buildModel, initialState, measure, netOf, partsFor, period, steps, strayJumpers, theory,
} from "./circuit.js";
import { COLOR, Cable, Display, Key, Knob, MONO, SANS, canvasTexture, jack, mat, printedFace, rounded, setAnisotropy, text } from "./kit.js";

const TOP = 0.9; // bench height for a standing student
const BOARD_Z = -0.52;
const TRAINER_H = 0.03;
const BOARD_H = 0.012;
const BOARD_TOP = TOP + TRAINER_H + BOARD_H;
const PITCH = 0.01;

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
sun.target.position.set(0, TOP, -0.55);
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

// ---------- bench ----------
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
  lab.add(top, frame, esd);
}

// ---------- registry of things to touch ----------
const pickables = [];
const obstacles = []; // boxes cables drape over: the chip and the pot modules
const keys = [];
const knobs = [];
const glowTargets = new Set();
function pickable(mesh) { pickables.push(mesh); return mesh; }
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

/** An instrument: body on the bench, turned to face the student, with a front-face group (origin at its centre, +z out). */
function instrument({ w, h, d, x, z, color = "#e4e2dc", face = "#2a2e33", yaw }) {
  const group = new THREE.Group();
  group.position.set(x, TOP, z);
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
const trainer = new THREE.Group();
trainer.position.set(0, TOP, BOARD_Z);
lab.add(trainer);
const ROW_Z = { a: -0.055, b: -0.045, c: -0.035, d: -0.025, e: -0.015, f: 0.015, g: 0.025, h: 0.035, i: 0.045, j: 0.055, rp: -0.092, rg: -0.081, rh: 0.081, rn: 0.092 };
const colX = (c) => (c - (COLS - 1) / 2) * PITCH;
const BLOCK_AT = { vtwo: [-0.185, -0.06], vin: [-0.185, 0.02], vout: [0.185, -0.015] };
const POST_AT = { "post+": [-0.05, -0.138], postg: [0, -0.138], "post-": [0.05, -0.138], postin2: [-0.248, -0.045], postin: [-0.248, 0.035], postout: [0.248, 0] };
const POST_COLOR = { "post+": COLOR.red, postg: COLOR.black, "post-": COLOR.blue, postin2: COLOR.purple, postin: COLOR.yellow, postout: COLOR.cyan };
const POST_LABEL = { "post+": "+V", postg: "GND", "post-": "−V", postin2: "VIN2", postin: "VIN", postout: "VOUT" };

/** Lab-local position of a hole's mouth, or a post's top. */
function contactPoint(id) {
  if (POST_AT[id]) { const [x, z] = POST_AT[id]; return new THREE.Vector3(x, TOP + TRAINER_H + 0.0152, BOARD_Z + z); }
  let x, z;
  const block = /^(vin|vtwo|vout)(\d)$/.exec(id);
  const rail = /^(rp|rg|rh|rn)(\d+)$/.exec(id);
  const main = /^([a-j])(\d+)$/.exec(id);
  if (block) { [x, z] = BLOCK_AT[block[1]]; z += Number(block[2]) * PITCH; }
  else if (rail) { x = colX(Number(rail[2])); z = ROW_Z[rail[1]]; }
  else if (main) { x = colX(Number(main[2])); z = ROW_Z[main[1]]; }
  else return null;
  return new THREE.Vector3(x, BOARD_TOP, BOARD_Z + z);
}
const HOLES = [];
for (const r of "abcdefghij") for (let c = 0; c < COLS; c += 1) HOLES.push(`${r}${c}`);
for (const r of ["rp", "rg", "rh", "rn"]) for (let c = 0; c < COLS; c += 1) if (c % 6 !== 5) HOLES.push(`${r}${c}`); // rails come in groups of five
for (const b of ["vin", "vtwo", "vout"]) for (let i = 0; i < BLOCK_HOLES; i += 1) HOLES.push(`${b}${i}`);
const HOLE_POINT = new Map(HOLES.map((id) => [id, contactPoint(id)]));
const POST_POINT = new Map(Object.keys(POST_AT).map((id) => [id, contactPoint(id)]));

{
  // trainer base, dark with silkscreened post labels
  const base = new THREE.Mesh(rounded(0.56, TRAINER_H, 0.33, 0.006), mat.plastic("#34383d", 0.6));
  base.position.set(0, TRAINER_H / 2, -0.015);
  base.castShadow = base.receiveShadow = true;
  trainer.add(base);
  const top = new THREE.Group();
  top.rotation.x = -Math.PI / 2;
  top.position.set(0, TRAINER_H + 0.0002, -0.015);
  trainer.add(top);
  printedFace(top, 0.55, 0.32, {
    pxPerM: 3000, background: "#34383d", z: 0,
    draw: (ctx, at) => {
      for (const [id, [x, z]] of Object.entries(POST_AT)) {
        const ly = -(z + 0.015);
        const side = x < -0.2 ? [x, ly + 0.021] : x > 0.2 ? [x, ly + 0.021] : [x, ly - 0.021];
        silk(ctx, at, POST_LABEL[id], side[0], side[1], 27, { color: "#f1eee6" });
        const [cx, cy] = at(x, ly);
        ctx.strokeStyle = POST_COLOR[id] === COLOR.black ? "#9aa0a6" : POST_COLOR[id];
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(cx, cy, 0.0135 * 3000, 0, Math.PI * 2); ctx.stroke();
      }
      silk(ctx, at, "OP-AMP TRAINER  ·  ELEN 221", 0.14, -0.136, 22, { color: "#b9bdc2", weight: 600 });
      silk(ctx, at, "Posts are wired to the rails and terminals underneath", -0.14, -0.136, 17, { color: "#8d9298", weight: 500 });
    },
  });
  for (const [id] of Object.entries(POST_AT)) {
    const p = contactPoint(id);
    const j = jack(lab, 0, 0, POST_COLOR[id], { post: true });
    j.group.position.set(p.x, TOP + TRAINER_H, p.z);
    j.group.rotation.x = -Math.PI / 2;
  }

  // the breadboard itself
  const board = new THREE.Mesh(rounded(0.41, BOARD_H, 0.215, 0.003), mat.plastic("#f3f1ea", 0.55));
  board.position.set(0, TRAINER_H + BOARD_H / 2, 0);
  board.castShadow = board.receiveShadow = true;
  trainer.add(board);
  const face = new THREE.Group();
  face.rotation.x = -Math.PI / 2;
  face.position.set(0, TRAINER_H + BOARD_H + 0.0003, 0);
  trainer.add(face);
  const W = 0.405, H = 0.21, PX = 4000;
  printedFace(face, W, H, {
    pxPerM: PX, background: "#f3f1ea", z: 0, roughness: 0.55,
    draw: (ctx, at) => {
      const hole = (x, z) => {
        const [px, py] = at(x, -z);
        ctx.fillStyle = "#3b3d40";
        ctx.fillRect(px - 5.5, py - 5.5, 11, 11);
        ctx.fillStyle = "#121314";
        ctx.fillRect(px - 3.5, py - 3.5, 7, 7);
      };
      for (const id of HOLES) { const p = contactPoint(id); hole(p.x, p.z - BOARD_Z); }
      // rail stripes
      const stripe = (z, color) => { const [x0, y] = at(colX(0) - 0.006, -z); const [x1] = at(colX(COLS - 1) + 0.006, -z); ctx.fillStyle = color; ctx.fillRect(x0, y - 3, x1 - x0, 6); };
      stripe(-0.1, COLOR.red); stripe(-0.073, "#25272a"); stripe(0.073, "#25272a"); stripe(0.1, COLOR.blue);
      silk(ctx, at, "+V", colX(0) - 0.012, 0.092, 26, { color: COLOR.red, weight: 800 });
      silk(ctx, at, "GND", colX(0) - 0.013, 0.081, 20, { color: "#25272a", weight: 800 });
      silk(ctx, at, "GND", colX(0) - 0.013, -0.081, 20, { color: "#25272a", weight: 800 });
      silk(ctx, at, "−V", colX(0) - 0.012, -0.092, 26, { color: COLOR.blue, weight: 800 });
      // the centre channel
      const [gx0, gy0] = at(colX(0) - 0.004, 0.005);
      const [gx1, gy1] = at(colX(COLS - 1) + 0.004, -0.005);
      ctx.fillStyle = "#dedbd2";
      ctx.fillRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
      // row letters and column numbers
      for (const r of "abcdefghij") silk(ctx, at, r, colX(0) - 0.01, -ROW_Z[r], 20, { color: "#77736b", weight: 600 });
      for (let c = 0; c < COLS; c += 1) if ((c + 1) % 5 === 0 || c === 0) {
        silk(ctx, at, String(c + 1), colX(c), 0.0665, 18, { color: "#77736b", weight: 600 });
        silk(ctx, at, String(c + 1), colX(c), -0.0665, 18, { color: "#77736b", weight: 600 });
      }
      // terminal blocks
      const block = (name, label, color, labelAt) => {
        const [bx, bz] = BLOCK_AT[name];
        const [x0, y0] = at(bx - 0.008, -(bz - 0.008));
        const [x1, y1] = at(bx + 0.008, -(bz + (BLOCK_HOLES - 1) * PITCH + 0.008));
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
        silk(ctx, at, label, bx, -labelAt, 22, { color: color === COLOR.yellow ? "#9a7a10" : color, weight: 800 });
      };
      block("vtwo", "VIN2", COLOR.purple, -0.073);
      block("vin", "VIN", COLOR.yellow, 0.061);
      block("vout", "VOUT", "#1f8a99", 0.03);
    },
  });
}

// the 741, straddling the centre channel with its notch to the left
{
  const chip = new THREE.Group();
  const cx = (colX(CHIP_COL) + colX(CHIP_COL + 3)) / 2;
  chip.position.set(cx, BOARD_TOP, BOARD_Z);
  lab.add(chip);
  const body = new THREE.Mesh(rounded(0.042, 0.009, 0.022, 0.0012), mat.plastic("#1b1c1e", 0.45));
  body.position.y = 0.0075;
  body.castShadow = true;
  chip.add(body);
  const legMat = mat.metal("#c4c7cb", 0.3);
  for (const [pin, id] of Object.entries(PINS)) {
    const p = contactPoint(id);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.0022, 0.009, 0.0009), legMat);
    leg.position.set(p.x - cx, 0.004, (p.z - BOARD_Z) * 0.92);
    const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.0012, 0.004), legMat);
    shoulder.position.set(p.x - cx, 0.0085, Math.sign(p.z - BOARD_Z) * 0.0118);
    chip.add(leg, shoulder);
    leg.userData.pin = pin;
  }
  const label = new THREE.Group();
  label.rotation.x = -Math.PI / 2;
  label.position.y = 0.0121;
  chip.add(label);
  printedFace(label, 0.04, 0.02, {
    pxPerM: 16000, background: "#1b1c1e", z: 0, roughness: 0.4,
    draw: (ctx, at) => {
      const [nx, ny] = at(-0.02, 0);
      ctx.fillStyle = "#0c0c0d";
      ctx.beginPath(); ctx.arc(nx, ny, 0.0028 * 16000, -Math.PI / 2, Math.PI / 2); ctx.fill();
      const [dx, dy] = at(-0.0155, -0.0062);
      ctx.fillStyle = "#4a4c50";
      ctx.beginPath(); ctx.arc(dx, dy, 0.0011 * 16000, 0, Math.PI * 2); ctx.fill();
      silk(ctx, at, "U1  µA741", 0.001, 0.0005, 62, { color: "#d8d6d0", weight: 700 });
      const names = { 1: "1", 2: "2 −IN", 3: "3 +IN", 4: "4 V−", 5: "5", 6: "6 OUT", 7: "7 V+", 8: "8" };
      [1, 2, 3, 4].forEach((p, i) => silk(ctx, at, names[p], (i - 1.5) * PITCH, -0.0078, 30, { color: "#b9b6ae", weight: 600 }));
      [8, 7, 6, 5].forEach((p, i) => silk(ctx, at, names[p], (i - 1.5) * PITCH, 0.0078, 30, { color: "#b9b6ae", weight: 600 }));
    },
  });
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
lab.add(parts);
const potModules = {};
let occupiedByParts = new Set();
function placeParts() {
  for (const child of [...parts.children]) parts.remove(child);
  for (const m of Object.values(potModules)) { knobs.splice(knobs.indexOf(m.knob), 1); pickables.splice(pickables.indexOf(m.knob.pickable), 1); glowTargets.delete(m.knob); }
  for (const id of Object.keys(potModules)) delete potModules[id];
  occupiedByParts = new Set(Object.values(PINS));
  obstacles.length = 0;
  obstacles.push({ x0: -0.024, x1: 0.024, z0: BOARD_Z - 0.014, z1: BOARD_Z + 0.014, y: BOARD_TOP + 0.013 });
  const legMat = mat.metal("#c4c7cb", 0.3);
  for (const part of partsFor(state.config)) {
    const [a, b] = part.legs.map(contactPoint);
    part.legs.forEach((id) => occupiedByParts.add(id));
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const along = b.clone().sub(a);
    const group = new THREE.Group();
    group.position.copy(mid);
    group.rotation.y = -Math.atan2(along.z, along.x);
    parts.add(group);
    const span = along.length();
    const leg = (x, h) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.0007, 0.0007, h, 8), legMat); m.position.set(x, h / 2 - 0.002, 0); group.add(m); };
    if (part.kind === "pot") {
      // a trimmer on a carrier: legs bent out to the holes, body in between
      const body = new THREE.Mesh(rounded(0.03, 0.026, 0.022, 0.003), mat.plastic("#2f6db5", 0.45));
      body.position.y = 0.016;
      body.castShadow = true;
      group.add(body);
      for (const s of [-1, 1]) {
        leg(s * span / 2, 0.006);
        const foot = new THREE.Mesh(new THREE.BoxGeometry(span / 2 - 0.014, 0.0012, 0.0012), legMat);
        foot.position.set(s * (span / 4 + 0.007), 0.004, 0);
        group.add(foot);
      }
      const front = new THREE.Group();
      front.position.set(0, 0.016, 0.0111);
      group.add(front);
      printedFace(front, 0.028, 0.024, {
        pxPerM: 9000, background: "#2f6db5", z: 0.0002,
        draw: (ctx, at) => silk(ctx, at, part.label, 0, 0.0075, 64, { color: "#ffffff", weight: 800 }),
      });
      const display = new Display(front, 0, -0.004, 0.024, 0.01, { pxPerM: 12000, z: 0.0004 });
      const knobHolder = new THREE.Group();
      knobHolder.rotation.x = -Math.PI / 2;
      knobHolder.position.y = 0.029;
      group.add(knobHolder);
      const knob = addKnob(knobHolder, {
        x: 0, y: 0, radius: 0.0095, values: POT_VALUES, index: POT_VALUES.indexOf(state[part.id]), color: "#e8e5dc", cap: "#cfcbc0", marker: "#1d1f22", name: part.id,
        onChange: (v) => { state[part.id] = v; changed(); },
      });
      potModules[part.id] = { display, knob };
      obstacles.push({ x0: mid.x - 0.018, x1: mid.x + 0.018, z0: mid.z - 0.014, z1: mid.z + 0.014, y: BOARD_TOP + 0.042 });
    } else {
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.0042, Math.min(0.022, span - 0.012), 6, 18).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ map: resistorTexture(part.value), roughness: 0.5 }));
      body.position.y = 0.007;
      body.castShadow = true;
      group.add(body);
      const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.0006, 0.0006, span, 8).rotateZ(Math.PI / 2), legMat);
      lead.position.y = 0.007;
      group.add(lead);
      for (const s of [-1, 1]) leg(s * span / 2, 0.009);
      // its value, printed on a small flag beside it
      const flag = new THREE.Group();
      flag.position.set(0, 0.0125, 0);
      flag.rotation.x = -Math.PI / 2;
      group.add(flag);
      printedFace(flag, 0.03, 0.009, { pxPerM: 9000, background: "#f3f1ea", z: 0, draw: (ctx, at) => silk(ctx, at, `${part.label} ${kOhm(part.value)}`, 0, 0, 52, { color: "#33302a", weight: 800 }) });
      flag.position.z = 0;
    }
  }
  drawModules();
  dirty();
}
function drawModules() {
  for (const [id, m] of Object.entries(potModules)) m.display.draw(state[id], (ctx, w, h) => text(ctx, kOhm(state[id]), w / 2, h / 2 + 2, h * 0.66, { color: "#7df0c4", font: MONO, weight: 600 }));
}

// ---------- instruments ----------
// Dual DC supply, behind the trainer
const supply = instrument({ w: 0.3, h: 0.13, d: 0.22, x: 0, z: -0.87, color: "#e6e3dc" });
const supplyJacks = {};
const supplyDisplays = {};
let powerKey, rangeKnob;
{
  const f = supply.front;
  printedFace(f, supply.w, supply.h, {
    pxPerM: 3600, background: "#2a2e33", z: 0.0006,
    draw: (ctx, at) => {
      silk(ctx, at, "DUAL DC POWER SUPPLY", -0.138, 0.05, 30, { align: "left", weight: 800 });
      silk(ctx, at, "+V", -0.09, -0.017, 28, { color: "#ff8a80", weight: 800 });
      silk(ctx, at, "COM", -0.045, -0.017, 24, { weight: 800 });
      silk(ctx, at, "−V", 0, -0.017, 28, { color: "#8fb3ff", weight: 800 });
      silk(ctx, at, "RANGE", 0.1, -0.008, 22, { weight: 700, color: "#c9c6bf" });
      silk(ctx, at, "POWER", 0.1, -0.058, 22, { weight: 700, color: "#c9c6bf" });
      [["±8", 45], ["±12", 0], ["±15", -45]].forEach(([s, deg]) => {
        const a = ((90 + deg) * Math.PI) / 180;
        silk(ctx, at, s, 0.1 + Math.cos(a) * 0.025, 0.02 + Math.sin(a) * 0.025, 22, { weight: 700 });
      });
    },
  });
  supplyDisplays.plus = new Display(f, -0.075, 0.018, 0.068, 0.026);
  supplyDisplays.minus = new Display(f, 0.0, 0.018, 0.068, 0.026);
  supplyJacks["sup+"] = jack(f, -0.09, -0.035, COLOR.red);
  supplyJacks.supg = jack(f, -0.045, -0.035, COLOR.black);
  supplyJacks["sup-"] = jack(f, 0, -0.035, COLOR.blue);
  rangeKnob = addKnob(f, { x: 0.1, y: 0.02, radius: 0.015, values: SUPPLY_LEVELS, index: 1, sweep: 90, name: "range", onChange: (v) => { state.supply.level = v; changed(); } });
  powerKey = addKey(f, { x: 0.1, y: -0.038, w: 0.018, round: true, color: "#c9473d", label: "I/O", labelColor: "#ffffff", led: "#53e07a", name: "power", onPress: () => { state.supply.on = !state.supply.on; changed(); } });
}
function drawSupply() {
  const short = model.short && state.supply.on;
  const on = state.supply.on && !short;
  const level = state.supply.level;
  const show = (d, s, color) => d.draw(`${s}|${color}`, (ctx, w, h) => text(ctx, s, w * 0.92, h / 2 + 2, h * 0.7, { color, font: MONO, weight: 700, align: "right" }));
  show(supplyDisplays.plus, short ? "LIMIT" : on ? `+${level.toFixed(1)}` : "", short ? "#ffb347" : "#ff6b5e");
  show(supplyDisplays.minus, short ? "LIMIT" : on ? `−${level.toFixed(1)}` : "", short ? "#ffb347" : "#6f9dff");
  powerKey.setLit(state.supply.on);
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
      silk(ctx, at, "OUTPUT", -0.005, -0.053, 20, { color: COLOR.yellow, weight: 800 });
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
  genJacks.gen = jack(f, -0.005, -0.036, COLOR.yellow);
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

// ---------- the trainer console: circuit selector, guide, undo and reset ----------
const consoleFace = new THREE.Group();
consoleFace.position.set(0, TOP + 0.03, BOARD_Z + 0.21);
consoleFace.rotation.x = -1.1;
lab.add(consoleFace);
let guideDisplay, configKnob;
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
    onChange: (v) => { pushHistory(); state.config = v; clearJumpers(); state.supply.on = false; placeParts(); changed(); },
  });
  guideDisplay = new Display(consoleFace, 0.005, 0, 0.32, 0.096, { pxPerM: 4400, glass: "#0e1418" });
  addKey(consoleFace, { x: 0.222, y: 0.026, w: 0.05, h: 0.022, label: "UNDO", color: "#d9d5cb", name: "undo", onPress: () => undo() });
  addKey(consoleFace, { x: 0.222, y: -0.008, w: 0.05, h: 0.022, label: "RESET", color: "#d9d5cb", name: "reset", onPress: () => resetLab() });
  addKey(consoleFace, { x: 0.222, y: -0.04, w: 0.05, h: 0.018, label: "GUIDE", color: "#d9d5cb", led: "#ffcf3f", name: "guide", onPress: (k) => { guided = !guided; k.setLit(guided); changed(); } }).setLit(true);
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
  const terminal = (x, y, label, color) => { ctx.beginPath(); ctx.arc(X(x), Y(y), 2.6 * s, 0, Math.PI * 2); ctx.stroke(); text(ctx, label, X(x), Y(y - 8), 9 * s, { color, weight: 800 }); };
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
    line([80, 45], [62, 45]); vresistor(62, 45, 80, "Rin"); ground(62, 80);
    line([95, 65], [22, 65]); terminal(19.4, 65, "VIN", COLOR.yellow);
  }
  if (config === "subtractor") {
    resistor(22, 65, 70, "R3"); terminal(19.4, 65, "VIN2", "#c3a1ff"); line([70, 65], [95, 65]);
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
  const warning = model.short ? `Short circuit: ${model.short}` : stray.length ? `A jumper is not part of this circuit (${stray.length})` : clipped ? `Vout is clipping at ±${(state.supply.level - 1.5).toFixed(1)} V` : "";
  const lines = {
    title: `${config.title}`,
    progress: next ? `Step ${doneCount + 1} of ${stepList.length}` : "Circuit complete",
    step: next ? next.text : "Adjust Rin, Rf and the input; compare measured with theory",
    theory: `theory  ${t.text}`,
    measured, warning, guided,
  };
  guideDisplay.draw(JSON.stringify(lines), (ctx, w, h) => {
    schematic(ctx, 6, h * 0.06, h * 1.5, h * 0.9, state.config);
    const x = h * 1.5 + 22;
    text(ctx, lines.title, x, h * 0.12, h * 0.088, { color: "#f2efe7", align: "left", weight: 800 });
    text(ctx, lines.progress, w - 16, h * 0.12, h * 0.062, { color: "#9fb3ab", align: "right", font: MONO, weight: 600 });
    wrap(ctx, lines.step, x, h * 0.33, w - x - 16, h * 0.105, { color: next && guided ? COLOR.next : "#f2efe7", align: "left", weight: 700 });
    text(ctx, lines.theory, x, h * 0.66, h * 0.075, { color: "#cfe0d8", align: "left", font: MONO, weight: 600 });
    if (lines.measured) text(ctx, lines.measured, x, h * 0.78, h * 0.075, { color: COLOR.cyan, align: "left", font: MONO, weight: 600 });
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

// ---------- movable things: leads, probes and jumpers ----------
const movers = [];
const tmp = new THREE.Vector3();
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
    this.seat = null;
    this.held = false;
    lab.add(this.group);
    movers.push(this);
    glowTargets.add(this);
    this.park();
  }
  get contact() { return this.kind === "lead" ? state.leads[this.id] : state.probes[this.id]; }
  set contact(v) { if (this.kind === "lead") state.leads[this.id] = v; else state.probes[this.id] = v; }
  accepts(id) { return this.kind === "lead" ? Boolean(POST_AT[id]) : true; }
  park() { this.group.position.copy(this.parkPos); this.group.quaternion.copy(this.parkQuat); this.updateCable(); }
  tip() { return this.group.position.clone(); }
  /** Place from the current state: seated on its contact or resting. */
  sync() {
    const c = this.contact;
    if (this.held) return;
    if (c) {
      const p = (POST_POINT.get(c) ?? HOLE_POINT.get(c)).clone();
      // several plugs on one post stack up its shank
      if (POST_AT[c]) {
        // a lead's pin sinks into the post; later plugs stack on the one below
        const below = movers.filter((m) => m !== this && m.contact === c && movers.indexOf(m) < movers.indexOf(this)).length;
        p.y += (this.kind === "lead" ? -0.012 : 0) + below * 0.036;
      }
      this.group.position.copy(p);
      this.group.quaternion.identity();
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
    const end = this.group.localToWorld(new THREE.Vector3(0, this.length, 0));
    lab.worldToLocal(end);
    // the cable leaves the back of the plug and bends toward its instrument
    const dir = UP.clone().applyQuaternion(this.group.quaternion);
    const toward = p.clone().sub(end).setY(0);
    if (toward.lengthSq() > 1e-6) dir.multiplyScalar(0.4).addScaledVector(toward.normalize(), 1).normalize();
    this.cable.update(p, n, end, dir, heightAt);
  }
  begin() { this.held = true; return this; }
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
const leadPark = (inst, x) => inst.group.localToWorld(new THREE.Vector3(x, 0.0055, inst.front.position.z + 0.05)).sub(lab.position);
const leadYaw = (inst) => inst.group.rotation.y;
const plugs = {};
for (const [id, jx] of [["sup+", -0.09], ["supg", -0.045], ["sup-", 0]]) {
  supply.group.updateMatrixWorld(true);
  plugs[id] = new Plug({ kind: "lead", id, color: LEADS[id].color === "black" ? COLOR.black : COLOR[LEADS[id].color], from: supplyJacks[id], park: leadPark(supply, jx), parkYaw: leadYaw(supply) });
}
gen.group.updateMatrixWorld(true);
plugs.gen = new Plug({ kind: "lead", id: "gen", color: COLOR.yellow, from: genJacks.gen, park: leadPark(gen, -0.005), parkYaw: leadYaw(gen) });
plugs.gen2 = new Plug({ kind: "lead", id: "gen2", color: COLOR.purple, from: genJacks.gen2, park: leadPark(gen, 0.105), parkYaw: leadYaw(gen) });
scope.group.updateMatrixWorld(true);
plugs.ch1 = new Plug({ kind: "probe", id: "ch1", color: COLOR.yellow, from: scopeJacks.ch1, park: leadPark(scope, -0.13), parkYaw: leadYaw(scope) });
plugs.ch2 = new Plug({ kind: "probe", id: "ch2", color: COLOR.cyan, from: scopeJacks.ch2, park: leadPark(scope, -0.07), parkYaw: leadYaw(scope) });
meter.updateMatrixWorld(true);
plugs.red = new Plug({ kind: "probe", id: "red", color: COLOR.red, from: meterJacks.red, park: new THREE.Vector3(0.42, TOP + 0.0055, -0.25), parkYaw: meter.rotation.y });
plugs.black = new Plug({ kind: "probe", id: "black", color: COLOR.black, from: meterJacks.black, park: new THREE.Vector3(0.3, TOP + 0.0055, -0.25), parkYaw: meter.rotation.y });

/** A jumper wire: two legs and an insulated arch between them. */
class Jumper {
  constructor(color) {
    this.color = color;
    this.mat = mat.plastic(COLOR[color] ?? color, 0.45);
    this.wire = new THREE.Mesh(new THREE.BufferGeometry(), this.mat);
    this.wire.castShadow = true;
    this.wire.frustumCulled = false;
    this.wire.userData.ref = null;
    lab.add(this.wire);
    this.ends = [0, 1].map((i) => new JumperEnd(this, i));
    this.key = "";
  }
  update() {
    const tops = this.ends.map((e) => e.pos.clone().add(new THREE.Vector3(0, 0.007, 0)));
    for (const e of this.ends) e.place();
    const key = tops.map((p) => p.toArray().map((v) => v.toFixed(4)).join()).join("|");
    if (key === this.key) return;
    this.key = key;
    const [a, b] = tops;
    const d = a.distanceTo(b);
    const lift = Math.min(0.006 + d * 0.08, 0.02);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y = Math.max(a.y, b.y) + lift;
    const curve = new THREE.CatmullRomCurve3([a, a.clone().add(new THREE.Vector3(0, lift * 0.7, 0)).lerp(mid, 0.25), mid, b.clone().add(new THREE.Vector3(0, lift * 0.7, 0)).lerp(mid, 0.25), b]);
    this.wire.geometry.dispose();
    this.wire.geometry = new THREE.TubeGeometry(curve, 32, 0.0017, 8, false);
  }
  remove() {
    lab.remove(this.wire);
    for (const e of this.ends) {
      lab.remove(e.group);
      for (const m of [e.handle, e.hit]) pickables.splice(pickables.indexOf(m), 1);
      movers.splice(movers.indexOf(e), 1);
      glowTargets.delete(e);
    }
    jumpers.splice(jumpers.indexOf(this), 1);
  }
}
class JumperEnd {
  constructor(jumper, index) {
    this.jumper = jumper;
    this.index = index;
    this.hole = null;
    this.pos = new THREE.Vector3();
    this.held = false;
    this.group = new THREE.Group();
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.0007, 0.0007, 0.01, 8).translate(0, 0.002, 0), mat.metal("#c4c7cb", 0.3));
    // a slightly larger insulated collar makes the end easy to see and grab
    this.handle = new THREE.Mesh(new THREE.CylinderGeometry(0.0024, 0.0024, 0.006, 12).translate(0, 0.0075, 0), jumper.mat);
    this.handle.userData.ref = this;
    this.group.add(leg, this.handle);
    lab.add(this.group);
    pickable(this.handle);
    this.hit = hitArea(this.group, new THREE.CylinderGeometry(0.006, 0.006, 0.016, 10).translate(0, 0.006, 0), this);
    movers.push(this);
    glowTargets.add(this);
    this.glow = jumper.mat;
  }
  get other() { return this.jumper.ends[1 - this.index]; }
  place() { this.group.position.copy(this.pos); }
  tip() { return this.pos.clone(); }
  accepts(id) { return HOLE_POINT.has(id); }
  begin() { this.held = true; return this; }
  moveTo(p) {
    this.pos.copy(p);
    // a jumper picked up by one loose end hangs its other loose end beside it
    if (!this.other.hole && !this.other.held) this.other.pos.copy(p).add(new THREE.Vector3(0.028, -0.004, 0.006));
    this.jumper.update();
  }
  drop(p) {
    this.held = false;
    const hole = nearestContact(p, this);
    pushHistory();
    if (hole) { this.hole = hole; this.pos.copy(HOLE_POINT.get(hole)); }
    // a jumper needs one end on the board; dropped anywhere else, or back in the tray, it is put away
    else if (overTray(p) || !this.other.hole) { this.jumper.remove(); syncJumpers(); changed(); return; }
    else { this.hole = null; this.pos.set(p.x, surfaceBelow(p) + 0.003, p.z); }
    if (!this.other.hole && !this.other.held) this.other.pos.copy(this.pos).add(new THREE.Vector3(0.03, 0, 0.012));
    this.jumper.update();
    syncJumpers();
    changed();
  }
}
const jumpers = [];
function syncJumpers() {
  state.jumpers = jumpers.map((j, i) => ({ id: `j${i}`, color: j.color, a: j.ends[0].hole, b: j.ends[1].hole }));
}
function clearJumpers() {
  for (const j of [...jumpers]) j.remove();
  state.jumpers = [];
}
function restoreJumpers(list) {
  clearJumpers();
  for (const saved of list) {
    const j = new Jumper(saved.color);
    j.ends.forEach((e, i) => { e.hole = saved.holes[i]; e.pos.copy(saved.holes[i] ? HOLE_POINT.get(saved.holes[i]) : new THREE.Vector3(...saved.pos[i])); });
    jumpers.push(j);
    j.update();
  }
  syncJumpers();
}

// the jumper kit: a tray of colour-sorted, pre-cut jumpers
const TRAY_COLORS = ["red", "blue", "black", "yellow", "purple", "green", "cyan", "white"];
const tray = new THREE.Group();
tray.position.set(-0.4, TOP, -0.33);
tray.rotation.y = 0.35;
lab.add(tray);
const traySlots = {};
class TraySlot {
  constructor(color, x) {
    this.color = color;
    this.glow = mat.plastic(COLOR[color], 0.45);
    const bundle = new THREE.Group();
    bundle.position.set(x, 0.0192, -0.006);
    for (let i = 0; i < 3; i += 1) {
      const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0018, 0.05 - i * 0.008, 8).rotateX(Math.PI / 2), this.glow);
      wire.position.set((i - 1) * 0.0045, 0.0018 * (i % 2), 0);
      wire.userData.ref = this;
      wire.castShadow = true;
      bundle.add(wire);
      pickable(wire);
    }
    tray.add(bundle);
    this.bundle = bundle;
    hitArea(bundle, new THREE.BoxGeometry(0.028, 0.014, 0.058), this);
    glowTargets.add(this);
  }
  tip() { return lab.worldToLocal(this.bundle.getWorldPosition(new THREE.Vector3())); }
  begin() {
    const j = new Jumper(this.color);
    jumpers.push(j);
    const start = this.tip();
    j.ends[0].pos.copy(start);
    j.ends[1].pos.copy(start).add(new THREE.Vector3(0.028, 0, 0));
    j.update();
    return j.ends[0].begin();
  }
}
{
  const box = new THREE.Mesh(rounded(0.26, 0.016, 0.085, 0.004), mat.plastic("#3b4046", 0.6));
  box.position.y = 0.008;
  box.castShadow = box.receiveShadow = true;
  tray.add(box);
  const lid = new THREE.Group();
  lid.rotation.x = -Math.PI / 2;
  lid.position.set(0, 0.0162, 0.034);
  tray.add(lid);
  printedFace(lid, 0.25, 0.012, { pxPerM: 4000, background: "#3b4046", z: 0, draw: (ctx, at) => silk(ctx, at, "JUMPER WIRES  ·  pick one, drop it back here to discard", 0, 0, 22, { weight: 700, color: "#d6d3cc" }) });
  TRAY_COLORS.forEach((c, i) => {
    const well = new THREE.Mesh(new THREE.BoxGeometry(0.027, 0.002, 0.058), mat.plastic("#22262a", 0.8));
    well.position.set(-0.1085 + i * 0.031, 0.0162, -0.006);
    tray.add(well);
    traySlots[c] = new TraySlot(c, -0.1085 + i * 0.031);
  });
}
function overTray(p) {
  const local = tray.worldToLocal(lab.localToWorld(p.clone()));
  return Math.abs(local.x) < 0.14 && Math.abs(local.z) < 0.05 && local.y < 0.08;
}
function surfaceBelow(p) {
  const local = p.clone().sub(new THREE.Vector3(0, 0, BOARD_Z));
  return Math.abs(local.x) < 0.205 && Math.abs(local.z) < 0.107 ? BOARD_TOP : Math.abs(local.x) < 0.28 && local.z > -0.18 && local.z < 0.15 ? TOP + TRAINER_H : TOP;
}

// what a cable lying across the bench rests on: bench, trainer, console, board and the parts on it
function heightAt(x, z) {
  const lz = z - BOARD_Z;
  let h = TOP;
  if (Math.abs(x) < 0.28 && lz > -0.18 && lz < 0.15) h = TOP + TRAINER_H;
  if (Math.abs(x) < 0.28 && lz >= 0.15 && lz < 0.27) h = TOP + 0.06;
  if (Math.abs(x) < 0.205 && Math.abs(lz) < 0.108) h = BOARD_TOP;
  for (const o of obstacles) if (x > o.x0 && x < o.x1 && z > o.z0 && z < o.z1) h = Math.max(h, o.y);
  return h;
}

/** The nearest contact this mover can use, within snapping reach, or null. */
function nearestContact(p, mover) {
  let best = null;
  let bestD = Infinity;
  const taken = new Set(occupiedByParts);
  for (const j of jumpers) for (const e of j.ends) if (e.hole && e !== mover) taken.add(e.hole);
  const consider = (id, point, reach) => {
    if (!mover.accepts(id)) return;
    if (mover instanceof JumperEnd && taken.has(id)) return;
    const dx = point.x - p.x, dz = point.z - p.z, dy = Math.max(0, p.y - point.y - 0.03);
    const d = Math.hypot(dx, dz) + dy;
    if (d < reach && d < bestD) { best = id; bestD = d; }
  };
  for (const [id, point] of HOLE_POINT) consider(id, point, 0.0075);
  for (const [id, point] of POST_POINT) consider(id, point, 0.03);
  return best;
}

// ---------- highlights: the next step, the snap target, the thing under the hand ----------
const ringGeo = new THREE.TorusGeometry(1, 0.14, 8, 32).rotateX(Math.PI / 2);
const makeRing = (color) => { const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, depthWrite: false })); m.visible = false; m.renderOrder = 5; lab.add(m); return m; };
const guideRings = [makeRing(COLOR.next), makeRing(COLOR.next)];
const snapRing = makeRing("#4ade80");
function ringAt(ring, id) {
  const p = POST_POINT.get(id) ?? HOLE_POINT.get(id);
  if (!p) { ring.visible = false; return; }
  ring.position.copy(p).add(new THREE.Vector3(0, 0.0015, 0));
  ring.userData.size = POST_AT[id] ? 0.012 : 0.0048;
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
    const holding = jumpers.some((j) => j.color === next.color && j.ends.some((e) => !e.hole));
    if (!holding) guideTargets.add(traySlots[next.color]);
    for (const j of jumpers) if (j.color === next.color) for (const e of j.ends) if (!e.hole) guideTargets.add(e);
  } else if (next.kind === "lead") {
    ringAt(guideRings[0], next.post);
    guideTargets.add(plugs[next.id]);
  } else if (next.kind === "power") {
    guideTargets.add(powerKey);
  } else if (next.kind === "probe") {
    ringAt(guideRings[0], next.target);
    guideTargets.add(plugs[next.id]);
  }
}
const hovered = new Set();
function updateGlow(time) {
  const blink = 0.5 + 0.5 * Math.sin(time * 0.007);
  for (const target of glowTargets) {
    const m = target.glow;
    if (!m?.emissive) continue;
    if (hovered.has(target)) m.emissive.setRGB(0.22, 0.22, 0.22);
    else if (guideTargets.has(target)) m.emissive.setRGB(0.45 * blink, 0.33 * blink, 0.02);
    else if (target instanceof Key && target.name?.startsWith("wave:") && target.name === `wave:${state.gen.wave}`) m.emissive.set("#5a4300");
    else m.emissive.setRGB(0, 0, 0);
  }
  for (const ring of guideRings) if (ring.visible) ring.scale.setScalar(ring.userData.size * (1 + 0.25 * blink));
}

// ---------- history ----------
function snapshot() {
  return {
    config: state.config,
    supplyOn: state.supply.on,
    jumpers: jumpers.filter((j) => j.ends.some((e) => e.hole)).map((j) => ({ color: j.color, holes: j.ends.map((e) => e.hole), pos: j.ends.map((e) => e.pos.toArray()) })),
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
  restoreJumpers(s.jumpers);
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
  rangeKnob.setValue(state.supply.level);
  ampKnob.setValue(state.gen.amp);
  freqKnob.setValue(state.gen.freq);
  dc2Knob.setValue(state.gen.dc2);
  meterKnob.setValue(state.meter);
  ch1Knob.setValue(0.5); ch2Knob.setValue(1); timeKnob.setValue(200e-6);
  clearJumpers();
  placeParts();
  changed();
  for (const m of movers) if (m instanceof Plug) m.sync();
}

onChange(() => {
  drawSupply();
  drawGenerator();
  drawModules();
  drawScope();
  drawMeter();
  drawGuide();
  updateGuide();
});

// ---------- desktop interaction ----------
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, TOP + 0.03, -0.6);
controls.enableDamping = true;
controls.minDistance = 0.18;
controls.maxDistance = 2.2;
controls.maxPolarAngle = Math.PI * 0.49;
controls.update();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let drag = null;
function rayFrom(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  return raycaster.ray;
}
function hit(ray) {
  raycaster.ray.copy(ray);
  const found = raycaster.intersectObjects(pickables, false)[0];
  return found ? { ref: refOf(found.object), point: found.point } : null;
}
// where a dragged tip goes: on a plane just above the surface under the pointer
function dragPoint(ray) {
  const local = ray.clone();
  local.origin.copy(lab.worldToLocal(ray.origin.clone()));
  for (const height of [BOARD_TOP, TOP + TRAINER_H, TOP]) {
    const plane = new THREE.Plane(UP, -(height + 0.004));
    const p = local.intersectPlane(plane, new THREE.Vector3());
    if (p && surfaceBelow(p) >= height - 1e-6) return p;
  }
  return null;
}
renderer.domElement.addEventListener("pointerdown", (e) => {
  if (renderer.xr.isPresenting) return;
  const h = hit(rayFrom(e));
  if (!h) return;
  if (h.ref instanceof Key) { h.ref.press(); return; }
  controls.enabled = false;
  renderer.domElement.setPointerCapture(e.pointerId);
  if (h.ref instanceof Knob) drag = { kind: "knob", knob: h.ref, x: e.clientX, y: e.clientY, start: h.ref.index };
  else drag = { kind: "mover", mover: h.ref.begin() };
  hovered.clear();
  if (drag.kind === "mover") hovered.add(drag.mover);
});
renderer.domElement.addEventListener("pointermove", (e) => {
  if (renderer.xr.isPresenting) return;
  if (!drag) {
    const h = hit(rayFrom(e));
    hovered.clear();
    if (h) hovered.add(h.ref);
    renderer.domElement.style.cursor = h ? (h.ref instanceof Key ? "pointer" : "grab") : "";
    return;
  }
  if (drag.kind === "knob") {
    const steps = Math.round(((e.clientX - drag.x) - (e.clientY - drag.y)) / 24);
    drag.knob.setIndex(drag.start + steps);
    return;
  }
  const p = dragPoint(rayFrom(e));
  if (!p) return;
  p.y += 0.006;
  drag.mover.moveTo(p);
  const target = nearestContact(p, drag.mover);
  if (target) ringAt(snapRing, target); else snapRing.visible = false;
  dirty();
});
function endDrag(e) {
  if (!drag) return;
  if (drag.kind === "mover") {
    const p = drag.mover.tip();
    drag.mover.drop(p);
  }
  snapRing.visible = false;
  drag = null;
  controls.enabled = true;
  hovered.clear();
  if (e?.pointerId !== undefined && renderer.domElement.hasPointerCapture(e.pointerId)) renderer.domElement.releasePointerCapture(e.pointerId);
}
renderer.domElement.addEventListener("pointerup", endDrag);
renderer.domElement.addEventListener("pointercancel", endDrag);
renderer.domElement.addEventListener("pointerleave", () => { if (!drag) hovered.clear(); });

// ---------- VR ----------
// Controllers are drawn as the headset's own models. A short pointer with a bead
// at its end presses keys by pushing into them; the grip (or trigger) takes the
// nearest knob, plug, probe or jumper within reach of the palm.
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
  const start = () => grab(holder);
  const end = () => release(holder);
  ctrl.addEventListener("squeezestart", start);
  ctrl.addEventListener("squeezeend", end);
  ctrl.addEventListener("selectstart", start);
  ctrl.addEventListener("selectend", end);
  scene.add(ctrl, grip);
  return holder;
});
const palmOf = (holder) => lab.worldToLocal(holder.grip.localToWorld(PALM.clone()));
function nearest(holder) {
  const palm = palmOf(holder);
  let best = null;
  let bestD = 0.06;
  const consider = (ref, point, reach = 0.06) => { const d = point.distanceTo(palm); if (d < Math.min(bestD, reach)) { best = ref; bestD = d; } };
  for (const m of movers) if (!m.held) consider(m, m instanceof Plug ? m.group.localToWorld(new THREE.Vector3(0, m.length * 0.6, 0)).sub(lab.position) : m.pos.clone().add(new THREE.Vector3(0, 0.008, 0)), m instanceof JumperEnd ? 0.03 : 0.06);
  for (const s of Object.values(traySlots)) consider(s, s.tip(), 0.03);
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
  for (const holder of holders) {
    if (!holder.source) continue;
    holder.line.material.opacity = holder.grab ? 0.12 : 0.45;
    holder.bead.visible = !holder.grab;
    const g = holder.grab;
    if (!g) { const n = nearest(holder); if (n) hovered.add(n); continue; }
    if (g.kind === "knob") {
      const roll = controllerRoll(holder, g.knob);
      g.acc -= wrapAngle(roll - holder.lastRoll);
      holder.lastRoll = roll;
      if (g.knob.setIndex(g.start + Math.round(g.acc / g.knob.detent))) pulse(holder, 0.2, 10);
      hovered.add(g.knob);
      continue;
    }
    const p = lab.worldToLocal(holder.grip.localToWorld(holder.offset.clone()));
    p.y = Math.max(p.y, surfaceBelow(p) + 0.002);
    g.mover.moveTo(p);
    const target = nearestContact(p, g.mover);
    if (target) ringAt(snapRing, target); else snapRing.visible = false;
    hovered.add(g.mover);
    dirty();
  }
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
  for (const holder of holders) holder.bead.material.color.copy(holder.armed.size ? BEAD_READY : BEAD_IDLE);
}

// the bench rises or falls to meet the student once the headset has settled
let fitPending = 0;
function fitHeight() {
  const eye = renderer.xr.getCamera().getWorldPosition(new THREE.Vector3());
  lab.position.y = THREE.MathUtils.clamp(eye.y - 0.62 - TOP, -0.3, 0.3);
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
const VIEW_DIR = new THREE.Vector3(0, 0.62, 0.78).normalize();
const VIEW_DIR_TALL = new THREE.Vector3(0, 0.86, 0.5).normalize(); // portrait screens look down on the bench
function fitStage() {
  const w = Math.max(stage.clientWidth, 1), h = Math.max(stage.clientHeight, 1);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  if (viewTouched) return;
  const halfV = THREE.MathUtils.degToRad(camera.fov / 2);
  const halfH = Math.atan(Math.tan(halfV) * camera.aspect);
  const tall = camera.aspect < 1;
  const distance = Math.max((tall ? 0.6 : 0.7) / Math.tan(halfH), 0.42 / Math.tan(halfV), 0.75);
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
  updateGlow(time);
  if (shadowsDirty) { renderer.shadowMap.needsUpdate = true; shadowsDirty = false; }
  renderer.render(scene, camera);
});

// exposed for automated checks only
window.__lab7 = {
  get state() { return state; }, get model() { return model; }, get steps() { return stepList; },
  plugs, traySlots, jumpers, knobs, keys, camera, contactPoint, nearestContact, lab,
  configKnob, powerKey, controls, holders, vr: { grab, release, updateHands, fitHeight },
};
