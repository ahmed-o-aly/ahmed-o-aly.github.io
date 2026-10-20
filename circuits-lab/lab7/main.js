// Lab 7 · operational amplifiers: the instrument wall, a room-scale op-amp lab.
// Everything is a physical object: cords hang and drape, plugs seat and stack,
// knobs turn with detents, keys latch, configuration cards slot in. Units are
// metres. The rope simulation runs in the circuit panel's local frame (x right,
// y up, z out of the face); the side bays are expressed in that frame through
// their transforms.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "../../assets/css/metahub-app-shell.css";
import "../../assets/css/metahub-lab-theme.css";
import { mountLabShell } from "../../assets/js/metahub-app-shell.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";

const MM = 0.00085; // one circuit-panel layout unit in metres
const DEG = Math.PI / 180;
const PANEL_W = 1000 * MM;
const PANEL_H = 686 * MM;
const PANEL_TOP = 84; // layout units: the panel spans y 84..770
const PANEL_MID = 427;
const BAY_W = 0.72;
const BAY_H = 0.64;
const RAIL_Y = -PANEL_H / 2 - 0.07;
const RAIL_Z = 0.05;
const DRAG_Z = 0.05;
const SEAT_RADIUS = 0.028;
const STACK_STEP = 0.04;
const MONO = "Consolas, 'Courier New', monospace";
const SANS = "'Segoe UI', Arial, sans-serif";
const COLORS = {
  face: "#ece8de", plate: "#d8d3c6", ink: "#15181b", muted: "#4a5258", amber: "#ffd54a", glass: "#0b0e10",
  pos: "#d93a2b", neg: "#2f6fd6", com: "#1a1d20", vin: "#f5c518", vin2: "#a066d6", fb: "#2fa86a", out: "#4dd0e1",
  case: "#2b333b", next: "#f5c518", valid: "#2fa86a", card: "#dff0f2",
};

// ---------- renderer, scene, room ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const stage = document.getElementById("stage");
const stageSize = () => ({ w: Math.max(stage.clientWidth, 1), h: Math.max(stage.clientHeight, 1) });
renderer.setSize(stageSize().w, stageSize().h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.xr.enabled = true;
renderer.xr.setFramebufferScaleFactor(1.2); // a little supersampling keeps printed labels crisp in the headset
renderer.xr.setFoveation(0.3); // light foveation: the panel is read in the middle of the view
stage.appendChild(renderer.domElement);

mountLabShell({
  host: document.getElementById("lab7-bar"),
  title: "Circuits Lab",
  notes: "/projects/circuits-lab/",
  context: Object.assign(document.createElement("span"), { textContent: "Lab 07 / Operational amplifiers · instrument wall" }),
  actions: [Object.assign(document.createElement("a"), { href: "../lab7-bench/", textContent: "Breadboard-bench version" })],
  workspace: document.querySelector(".lab7-layout"),
});

// Enter VR lives in the side panel; the session request stays inside the click
const vrButton = document.getElementById("lab7-vr");
const vrStatus = document.getElementById("lab7-vr-status");
const setVr = (label, message, enabled) => { vrButton.textContent = label; vrButton.disabled = !enabled; vrStatus.textContent = message; };
let vrSession = null;
async function checkVr() {
  if (!isSecureContext) return setVr("VR needs HTTPS", "Open the HTTPS address of this lab in your headset browser.", false);
  if (!navigator.xr) return setVr("Use a headset", "This browser has no WebXR. Open the page in your headset browser.", false);
  try {
    if (await navigator.xr.isSessionSupported("immersive-vr")) setVr("Enter VR", "Headset ready. Select Enter VR and accept the request.", true);
    else setVr("No headset detected", "No immersive VR device was found.", false);
  } catch { setVr("VR unavailable", "WebXR could not be checked in this browser.", false); }
}
vrButton.addEventListener("click", async () => {
  if (vrSession) { vrSession.end(); return; }
  setVr("Opening VR…", "Opening the headset session…", false);
  try {
    const session = await navigator.xr.requestSession("immersive-vr", { optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"] });
    vrSession = session;
    session.addEventListener("end", () => { vrSession = null; setVr("Enter VR", "Back on the desktop. Your circuit is unchanged.", true); });
    await renderer.xr.setSession(session);
    setVr("Exit VR", "In VR.", true);
  } catch { vrSession = null; setVr("Try VR again", "The headset refused the session. Check the headset and try again.", true); }
});
checkVr();

const scene = new THREE.Scene();
scene.background = new THREE.Color("#14171a");
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;

const camera = new THREE.PerspectiveCamera(62, stageSize().w / stageSize().h, 0.01, 50);
camera.position.set(0, 1.58, 0.5); // a step behind the student's spot, so all three bays are in view

scene.add(new THREE.HemisphereLight(0xf2f4f5, 0x30363b, 0.75));
const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(0.3, 2.8, 1.0);
sun.target.position.set(0, 1.2, -0.45);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -1.2, right: 1.2, top: 1.2, bottom: -1.2, near: 0.5, far: 5 });
sun.shadow.camera.updateProjectionMatrix();
sun.shadow.bias = -0.0004;
scene.add(sun, sun.target);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshStandardMaterial({ color: "#2a2f33", roughness: 0.9 }));
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);
const wall = new THREE.Mesh(new THREE.PlaneGeometry(8, 3.2), new THREE.MeshStandardMaterial({ color: "#3a4146", roughness: 0.95 }));
wall.position.set(0, 1.6, -1.6);
scene.add(wall);

// ---------- the three bays ----------
// The whole wall hangs from one rig, so it can be raised or lowered to suit the
// person in the headset without moving the floor under them.
const lab = new THREE.Group();
scene.add(lab);
let labLift = 0;
function makeBay(x, z, yaw) {
  const group = new THREE.Group();
  group.position.set(x, 1.28, z);
  group.rotation.order = "YXZ";
  group.rotation.y = yaw;
  group.rotation.x = -15 * DEG;
  lab.add(group);
  return group;
}
const panel = makeBay(0, -0.58, 0);
// The side bays hinge on the circuit bay's own tilted side edges, like a folding
// screen: each is the circuit bay turned 67° about that edge. Their edges then
// meet along their whole height instead of crossing at the corners.
const FOLD = 67 * DEG;
const FRAME = 0.025; // the frame border around each bay face
function foldedBay(side) {
  panel.updateMatrixWorld(true);
  const across = new THREE.Vector3(1, 0, 0).applyQuaternion(panel.quaternion);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(panel.quaternion);
  const hinge = panel.position.clone().addScaledVector(across, side * (PANEL_W / 2 + FRAME + 0.003));
  const fold = new THREE.Quaternion().setFromAxisAngle(up, -side * FOLD);
  const group = new THREE.Group();
  group.quaternion.copy(fold).multiply(panel.quaternion);
  group.position.copy(hinge).addScaledVector(across.clone().multiplyScalar(side).applyQuaternion(fold), BAY_W / 2 + FRAME + 0.003);
  lab.add(group);
  return group;
}
const sourceBay = foldedBay(-1);
const measureBay = foldedBay(1);
scene.updateMatrixWorld(true);

const panelInverse = panel.matrixWorld.clone().invert(); // refreshed whenever the rig moves
const panelQuat = panel.quaternion.clone();
const panelQuatInverse = panelQuat.clone().invert();
const upLocal = new THREE.Vector3(0, 1, 0).applyQuaternion(panelQuatInverse);
const gravityLocal = upLocal.clone().multiplyScalar(-9.8);
const UPRIGHT = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), upLocal);

// a surface is a bay face, described in the panel's local frame
const surfaces = [];
function addSurface(group, halfW, halfH) {
  const fromLocal = panelInverse.clone().multiply(group.matrixWorld); // surface-local -> panel-local
  const surface = {
    group, halfW, halfH, fromLocal, toLocal: fromLocal.clone().invert(),
    quat: panelQuatInverse.clone().multiply(group.getWorldQuaternion(new THREE.Quaternion())),
  };
  surfaces.push(surface);
  return surface;
}
addSurface(panel, PANEL_W / 2, PANEL_H / 2);
addSurface(sourceBay, BAY_W / 2, BAY_H / 2);
addSurface(measureBay, BAY_W / 2, BAY_H / 2);

// any group mounted on a bay (the bay itself, or an instrument fixed to it) maps into the panel frame
function toPanel(group, x, y, z = 0) {
  group.updateMatrixWorld(true);
  return new THREE.Vector3(x, y, z).applyMatrix4(group.matrixWorld).applyMatrix4(panelInverse);
}
const quatOf = (group) => panelQuatInverse.clone().multiply(group.getWorldQuaternion(new THREE.Quaternion()));

function canvasTexture(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return { canvas, ctx: canvas.getContext("2d"), texture };
}
function write(ctx, s, x, y, size, color = COLORS.ink, weight = 700, align = "left", font = SANS) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(s, x, y);
}

const frameMat = new THREE.MeshStandardMaterial({ color: "#3a4047", roughness: 0.4, metalness: 0.6 });
const trayMat = new THREE.MeshStandardMaterial({ color: "#2b3036", roughness: 0.6, metalness: 0.4 });

function backing(group, w, h) {
  const box = new THREE.Mesh(new THREE.BoxGeometry(w + 0.05, h + 0.05, 0.03), frameMat);
  box.position.z = -0.0152;
  box.castShadow = box.receiveShadow = true;
  group.add(box);
}
backing(panel, PANEL_W, PANEL_H);
backing(sourceBay, BAY_W, BAY_H);
backing(measureBay, BAY_W, BAY_H);

// a printed plate: an instrument front or the circuit panel face
function printedPlate(group, x, y, w, h, pxPerM, draw) {
  const view = canvasTexture(Math.round(w * pxPerM), Math.round(h * pxPerM));
  draw(view.ctx, view.canvas.width, view.canvas.height, pxPerM);
  view.texture.needsUpdate = true;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: view.texture, roughness: 0.62 }));
  mesh.position.set(x, y, 0.0004);
  mesh.receiveShadow = true;
  group.add(mesh);
  return { view, mesh };
}

// a lit display behind glass
class Display {
  constructor(group, x, y, w, h, pxPerM = 4400) {
    this.view = canvasTexture(Math.round(w * pxPerM), Math.round(h * pxPerM));
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: this.view.texture, toneMapped: false }));
    mesh.position.set(x, y, 0.0016);
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(w + 0.008, h + 0.008, 0.003), new THREE.MeshStandardMaterial({ color: "#20262b", roughness: 0.6 }));
    bezel.position.set(x, y, -0.0008); // its front face sits behind the glass
    group.add(bezel, mesh);
  }
  draw(fn) {
    const { ctx, canvas, texture } = this.view;
    ctx.fillStyle = COLORS.glass;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    fn(ctx, canvas.width, canvas.height);
    texture.needsUpdate = true;
  }
  text(s, color = COLORS.amber) {
    this.draw((ctx, w, h) => write(ctx, s, w / 2, h / 2 + 2, h * 0.56, color, 600, "center", MONO));
  }
}

// ---------- sockets ----------
const sockets = [];
const socketById = {};
const shroudColor = { sig: "#c9c3b4", pin: "#9aa4ad", com: COLORS.com, pos: COLORS.pos, neg: COLORS.neg, vin: COLORS.vin, vin2: COLORS.vin2 };
const shroudGeo = new THREE.CylinderGeometry(0.0075, 0.0082, 0.009, 28).rotateX(Math.PI / 2).translate(0, 0, 0.0045);
const holeGeo = new THREE.CircleGeometry(0.0026, 20).translate(0, 0, 0.0092);
const ringGeo = new THREE.TorusGeometry(0.0118, 0.0016, 8, 40).translate(0, 0, 0.0008);
const holeMat = new THREE.MeshStandardMaterial({ color: "#a88a3c", metalness: 1, roughness: 0.3 });
function addSocket(id, group, x, y, role, net = null) {
  const quat = quatOf(group);
  const socket = { id, role, net, plugs: [], local: toPanel(group, x, y), quat, normal: new THREE.Vector3(0, 0, 1).applyQuaternion(quat), covered: false };
  const holder = new THREE.Group();
  holder.position.set(x, y, 0);
  const shroud = new THREE.Mesh(shroudGeo, new THREE.MeshStandardMaterial({ color: shroudColor[role], roughness: 0.45 }));
  shroud.castShadow = true;
  socket.ringMat = new THREE.MeshBasicMaterial({ color: "#6b7278", toneMapped: false });
  holder.add(shroud, new THREE.Mesh(holeGeo, holeMat), new THREE.Mesh(ringGeo, socket.ringMat));
  group.add(holder);
  sockets.push(socket);
  socketById[id] = socket;
  return socket;
}

// ---------- knobs and keys ----------
let changed = true;
class Knob {
  constructor({ group, x, y, radius = 0.02, values, index, ring = "#c9c3b4", sweep = 270, onChange }) {
    this.values = values;
    this.index = index;
    this.sweep = sweep;
    this.detent = (sweep / Math.max(values.length - 1, 1)) * DEG;
    this.onChange = onChange;
    this.group = new THREE.Group();
    this.group.position.set(x, y, 0);
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.22, radius * 1.26, 0.005, 48).rotateX(Math.PI / 2).translate(0, 0, 0.0025), new THREE.MeshStandardMaterial({ color: "#2b3036", roughness: 0.5, metalness: 0.3 }));
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.95, radius, radius, 36).rotateX(Math.PI / 2).translate(0, 0, 0.005 + radius / 2), new THREE.MeshStandardMaterial({ color: "#15181b", roughness: 0.55, flatShading: true }));
    const pointer = new THREE.Mesh(new THREE.BoxGeometry(0.003, radius * 0.65, 0.0015).translate(0, radius * 0.55, 0.0055 + radius), new THREE.MeshBasicMaterial({ color: "#ece8de" }));
    const collar = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.33, 0.0022, 10, 48), new THREE.MeshStandardMaterial({ color: ring, roughness: 0.4 }));
    skirt.castShadow = cap.castShadow = true;
    this.dial = new THREE.Group();
    this.dial.add(cap, pointer);
    this.group.add(skirt, collar, this.dial);
    for (const part of [skirt, cap, pointer, collar]) part.userData.knob = this;
    group.add(this.group);
    this.apply();
  }
  get value() { return this.values[this.index]; }
  setIndex(next) {
    const clamped = THREE.MathUtils.clamp(next, 0, this.values.length - 1);
    if (clamped === this.index) return false;
    this.index = clamped;
    this.apply();
    tick(2600, 0.012, 0.06);
    return true;
  }
  apply() {
    const angle = -this.sweep / 2 + this.index * (this.detent / DEG);
    this.dial.rotation.z = -angle * DEG;
    this.onChange?.(this.value);
    changed = true;
  }
}
const knobs = [];

const keys = [];
class Key {
  constructor({ group, x, y, w = 0.05, h = 0.032, label, lit = false, glow = "#f5c518", onPress }) {
    this.view = canvasTexture(Math.round(w * 8000), Math.round(h * 8000));
    this.label = label;
    this.glow = glow;
    this.lit = lit;
    this.onPress = onPress;
    this.w = w;
    this.h = h;
    this.latched = false; // a poked key acts once, then waits for the finger to lift
    const side = new THREE.MeshStandardMaterial({ color: "#c9c3b4", roughness: 0.5 });
    this.faceMat = new THREE.MeshBasicMaterial({ map: this.view.texture, toneMapped: false });
    this.cap = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.012), [side, side, side, side, this.faceMat, side]);
    this.rest = 0.008;
    this.cap.position.set(x, y, this.rest);
    this.cap.castShadow = true;
    this.cap.userData.key = this;
    group.add(this.cap);
    keys.push(this);
    this.draw();
  }
  draw(blink = 0) {
    const { ctx, canvas, texture } = this.view;
    const base = new THREE.Color(this.lit ? this.glow : COLORS.face);
    if (blink) base.lerp(new THREE.Color(COLORS.next), blink);
    ctx.fillStyle = `#${base.getHexString()}`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (typeof this.label === "function") this.label(ctx, canvas.width, canvas.height);
    else {
      // as large as the cap allows, shrunk to fit its width with a margin
      ctx.font = `800 100px ${SANS}`;
      const fit = (canvas.width * 0.84 * 100) / ctx.measureText(this.label).width;
      write(ctx, this.label, canvas.width / 2, canvas.height / 2 + 2, Math.min(canvas.height * 0.46, fit), COLORS.ink, 800, "center");
    }
    texture.needsUpdate = true;
  }
  press() {
    this.cap.position.z = this.rest - 0.003;
    setTimeout(() => { this.cap.position.z = this.rest; }, 120);
    this.fire();
  }
  fire() {
    tick(1400, 0.03, 0.12);
    this.onPress?.(this);
    changed = true;
  }
  // How far a fingertip pushes the cap in, up to its 3 mm travel. A poke only counts
  // when the finger arrived from in front of the key, not by sliding in from the side.
  pokeDepth(tipWorld, holder) {
    const tip = this.cap.parent.worldToLocal(tipWorld.clone());
    const face = this.rest + 0.006;
    const over = Math.abs(tip.x - this.cap.position.x) < this.w / 2 + 0.004 && Math.abs(tip.y - this.cap.position.y) < this.h / 2 + 0.004;
    if (!over || tip.z > face + 0.03 || tip.z < this.rest - 0.03) { holder.armed.delete(this); return 0; }
    if (tip.z > face) { holder.armed.add(this); return 0; }
    return holder.armed.has(this) ? Math.min(face - tip.z, 0.003) : 0;
  }
  // it acts at 2 mm and resets once the finger lifts back above 1 mm
  setDepth(depth, holder) {
    this.cap.position.z = this.rest - depth;
    if (depth >= 0.002 && !this.latched) { this.latched = true; this.fire(); pulse(holder, 0.5, 25); }
    if (depth < 0.001) this.latched = false;
  }
}

// ---------- circuit bay ----------
// Layout, in panel units. The panel follows the schematic: inputs on the left,
// the 741 in the middle, the output on the right, feedback over the top, the
// second input path above-left, R3 under pin 3 and the power rails along the bottom.
const face = printedPlate(panel, 0, 0, PANEL_W, PANEL_H, 3400 / PANEL_W, () => {});
const at = (px, py) => [(px - 500) * MM, (PANEL_MID - py) * MM];
const xy = ([x, y]) => ({ x, y });
const PANEL_SOCKETS = [
  ["vin2", 100, 262, "vin2"],
  ["rin2A", 230, 262, "sig"], ["rin2B", 350, 262, "sig"],
  ["rfA", 445, 280, "sig"], ["rfB", 675, 280, "sig"],
  ["vin", 120, 430, "vin", "INPUT"], ["vinCom", 120, 495, "com", "COM"], ["vinB", 120, 545, "vin", "INPUT"],
  ["rinA", 240, 430, "sig"], ["rinB", 340, 430, "sig"],
  ["p2", 445, 430, "pin"], ["p3", 445, 510, "pin"], ["p6", 675, 460, "pin"], ["p7", 540, 548, "pin"], ["p4", 640, 548, "pin"],
  ["vout", 835, 460, "sig"], ["voutCom", 835, 520, "com", "COM"],
  ["r3A", 420, 598, "sig"], ["r3B", 420, 645, "sig"],
  ["railPos", 70, 696, "pos", "+V"], ["railCom", 70, 719, "com", "COM"], ["railNeg", 70, 742, "neg", "−V"],
  ["tapPos", 540, 696, "pos", "+V"], ["tapNeg", 640, 742, "neg", "−V"],
  ["tapCom1", 470, 719, "com", "COM"], ["tapCom2", 420, 719, "com", "COM"], ["tapCom3", 760, 719, "com", "COM"], ["tapCom4", 300, 719, "com", "COM"],
];
const PANEL_PX = Object.fromEntries(PANEL_SOCKETS.map(([id, px, py]) => [id, [px, py]]));
for (const [id, px, py, role, net] of PANEL_SOCKETS) addSocket(id, panel, ...at(px, py), role, net);

// 1 % resistors: what the scope measures differs slightly from the formula
const E24 = [1, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.7, 3, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1];
const RVALUES = [...E24.map((v) => v * 1e3), ...E24.map((v) => v * 1e4), 1e5];
const TOLERANCE = { rin: 1.006, rf: 0.996, rin2: 0.997, r3: 1.004 };
const ohms = (v) => (v >= 1e5 ? `${v / 1e3} kΩ` : v >= 1e4 ? `${(v / 1e3).toFixed(1)} kΩ` : `${(v / 1e3).toFixed(2)} kΩ`);
const shortOhms = (v) => (v >= 1e4 ? `${(v / 1e3).toFixed(0)}k` : `${(v / 1e3).toFixed(1)}k`);
function resistorModule({ knobAt, windowAt, windowSize, radius, ring, start, format = ohms }) {
  const window = new Display(panel, ...at(...windowAt), windowSize[0] * MM, windowSize[1] * MM);
  const knob = new Knob({ group: panel, ...xy(at(...knobAt)), radius, values: RVALUES, index: RVALUES.indexOf(start), ring, onChange: (v) => window.text(format(v)) });
  knobs.push(knob);
  return knob;
}
const rinKnob = resistorModule({ knobAt: [290, 427], windowAt: [290, 498], windowSize: [120, 40], radius: 0.02, ring: COLORS.vin, start: 1e4 });
const rfKnob = resistorModule({ knobAt: [627, 255], windowAt: [530, 255], windowSize: [120, 42], radius: 0.02, ring: COLORS.fb, start: 2e4 });
const rin2Knob = resistorModule({ knobAt: [290, 236], windowAt: [290, 293], windowSize: [104, 28], radius: 0.015, ring: COLORS.vin2, start: 1e4 });
const r3Knob = resistorModule({ knobAt: [392, 640], windowAt: [372, 598], windowSize: [58, 22], radius: 0.011, ring: "#9aa4ad", start: 2e4, format: shortOhms });

// a true-size DIP-8 in the middle of the 741 module
{
  const chip = new THREE.Group();
  chip.position.set(...at(570, 460), 0);
  chip.add(new THREE.Mesh(new THREE.BoxGeometry(0.0098, 0.0064, 0.0035).translate(0, 0, 0.0035), new THREE.MeshStandardMaterial({ color: "#1e2226", roughness: 0.7 })));
  const pinMat = new THREE.MeshStandardMaterial({ color: "#c8ccd0", metalness: 1, roughness: 0.3 });
  for (let i = 0; i < 4; i += 1) for (const side of [-1, 1]) {
    const pin = new THREE.Mesh(new THREE.BoxGeometry(0.0006, 0.0012, 0.003), pinMat);
    pin.position.set(-0.0038 + i * 0.00254, side * 0.0036, 0.0018);
    chip.add(pin);
  }
  chip.add(new THREE.Mesh(new THREE.BoxGeometry(0.013, 0.011, 0.002).translate(0, 0, 0.001), new THREE.MeshStandardMaterial({ color: "#2b3036" })));
  panel.add(chip);
}

// theory lightbox above the circuit bay, and the frame keys beside it
const lightbox = canvasTexture(3600, 440);
{
  const housing = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.095, 0.03), frameMat);
  housing.position.set(-0.05, PANEL_H / 2 + 0.075, 0);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.073), new THREE.MeshBasicMaterial({ map: lightbox.texture, toneMapped: false }));
  screen.position.set(-0.05, PANEL_H / 2 + 0.075, 0.0152);
  const strut = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.02), frameMat);
  strut.position.set(-0.05, PANEL_H / 2 + 0.03, -0.01);
  panel.add(housing, screen, strut);
}
let guided = true;
new Key({ group: panel, x: 0.31, y: PANEL_H / 2 + 0.075, w: 0.056, h: 0.035, label: "GUIDE", lit: true, onPress: (k) => { guided = !guided; k.lit = guided; k.draw(); } });
new Key({ group: panel, x: 0.375, y: PANEL_H / 2 + 0.075, w: 0.056, h: 0.035, label: "RESET", onPress: () => resetLab() });

// cord rail under the circuit bay
{
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, PANEL_W + 0.04, 24).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ color: "#5a636b", metalness: 0.8, roughness: 0.35 }));
  rail.position.set(0, RAIL_Y, RAIL_Z);
  rail.castShadow = true;
  panel.add(rail);
  for (const x of [-PANEL_W / 2, PANEL_W / 2]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, RAIL_Z + 0.02), frameMat);
    arm.position.set(x, RAIL_Y, RAIL_Z / 2 - 0.01);
    panel.add(arm);
  }
}
const hooks = [];
for (let i = 0; i < 42; i += 1) hooks.push({ local: new THREE.Vector3(-0.4 + i * 0.0195, RAIL_Y + 0.009, RAIL_Z), quat: UPRIGHT, plug: null });

// ---------- source bay: function generator above the DC supply ----------
// Stacked so each set of leads runs to its own height on the circuit bay: the
// generator's to the inputs, the supply's down to the rails. They never cross.
const generatorUnit = new THREE.Group();
generatorUnit.position.y = 0.32;
const supplyUnit = new THREE.Group();
supplyUnit.position.y = -0.33;
sourceBay.add(generatorUnit, supplyUnit);

const supply = { volts: 12, on: false };
const RAILS = [8, 12, 15];
printedPlate(supplyUnit, 0, 0.165, 0.68, 0.27, 4400, (ctx, w, h, k) => {
  ctx.fillStyle = COLORS.face; ctx.fillRect(0, 0, w, h);
  write(ctx, "DC SUPPLY · DUAL TRACKING", 0.025 * k, 0.03 * k, 0.019 * k);
  write(ctx, "±8", (-0.22 - 0.034 + 0.34) * k, 0.105 * k, 0.012 * k, COLORS.muted, 600, "center", MONO);
  write(ctx, "±12", (-0.22 + 0.34) * k, 0.077 * k, 0.012 * k, COLORS.muted, 600, "center", MONO);
  write(ctx, "±15", (-0.22 + 0.034 + 0.34) * k, 0.105 * k, 0.012 * k, COLORS.muted, 600, "center", MONO);
  write(ctx, "RAIL SELECT", (-0.22 + 0.34) * k, 0.185 * k, 0.012 * k, COLORS.ink, 800, "center");
  for (const [x, label, color] of [[0.06, "+V", COLORS.pos], [0.17, "COM", COLORS.ink], [0.28, "−V", COLORS.neg]]) {
    write(ctx, label, (x + 0.34) * k, 0.23 * k, 0.016 * k, color, 800, "center");
  }
});
const railWindows = [0.06, 0.17, 0.28].map((x) => new Display(supplyUnit, x, 0.21, 0.095, 0.045));
knobs.push(new Knob({ group: supplyUnit, x: -0.22, y: 0.165, radius: 0.022, values: RAILS, index: 1, sweep: 90, onChange: (v) => { supply.volts = v; drawRails(); } }));
const outputKey = new Key({ group: supplyUnit, x: -0.085, y: 0.165, w: 0.08, h: 0.045, label: "OUTPUT", glow: COLORS.fb, onPress: (k) => { supply.on = !supply.on; k.lit = supply.on; k.draw(); drawRails(); } });
addSocket("supPos", supplyUnit, 0.06, 0.12, "pos");
addSocket("supCom", supplyUnit, 0.17, 0.12, "com");
addSocket("supNeg", supplyUnit, 0.28, 0.12, "neg");
function drawRails() {
  const v = supply.volts;
  const color = supply.on ? COLORS.amber : "#4a4232";
  railWindows[0].text(`+${v.toFixed(1)}`, color);
  railWindows[1].text("0.0", color);
  railWindows[2].text(`−${v.toFixed(1)}`, color);
}
drawRails();

const generator = { wave: "sine", amp: 1, freq: 1000, vin2: 2, vin2Open: false };
const AMPS = [0.1, 0.2, 0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5, 7, 10];
const FREQS = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
const VIN2 = Array.from({ length: 21 }, (_, i) => -5 + i * 0.5);
const hz = (f) => (f >= 1000 ? `${f / 1000} kHz` : `${f} Hz`);
const volts = (v) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)} V`;
printedPlate(generatorUnit, 0, -0.16, 0.68, 0.28, 4400, (ctx, w, h, k) => {
  ctx.fillStyle = COLORS.face; ctx.fillRect(0, 0, w, h);
  const Y = (y) => (0.14 - (y + 0.16)) * k;
  const X = (x) => (x + 0.34) * k;
  write(ctx, "FUNCTION GENERATOR", 0.025 * k, 0.019 * k, 0.015 * k);
  write(ctx, "WAVEFORM", X(-0.185), Y(-0.255), 0.012 * k, COLORS.ink, 800, "center");
  write(ctx, "AMPL", X(0.06), Y(-0.19), 0.012 * k, COLORS.ink, 800, "center");
  write(ctx, "FREQ", X(0.17), Y(-0.19), 0.012 * k, COLORS.ink, 800, "center");
  write(ctx, "Vin2 DC", X(0.17), Y(-0.278), 0.011 * k, COLORS.vin2, 800, "center");
  write(ctx, "Vin2", X(0.225), Y(-0.065), 0.013 * k, COLORS.vin2, 800, "right");
  write(ctx, "Vin", X(0.225), Y(-0.15), 0.014 * k, COLORS.ink, 800, "right");
  write(ctx, "COM", X(0.225), Y(-0.235), 0.013 * k, COLORS.ink, 800, "right");
});
const genDisplay = new Display(generatorUnit, -0.17, -0.1, 0.27, 0.085);
const WAVES = ["dc", "sine", "square", "triangle"];
function waveIcon(type) {
  return (ctx, w, h) => {
    if (type === "dc") { write(ctx, "DC", w / 2, h / 2 + 2, h * 0.42, COLORS.ink, 800, "center"); return; }
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = h * 0.08;
    ctx.beginPath();
    for (let i = 0; i <= 40; i += 1) {
      const t = i / 40;
      const x = w * 0.15 + t * w * 0.7;
      const y = h / 2 - waveShape(type, t * 1.5) * h * 0.25;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };
}
const waveKeys = WAVES.map((type, i) => new Key({
  group: generatorUnit, x: -0.29 + i * 0.07, y: -0.215, w: 0.055, h: 0.034, label: waveIcon(type), lit: type === generator.wave,
  onPress: () => { generator.wave = type; waveKeys.forEach((k, j) => { k.lit = WAVES[j] === type; k.draw(); }); drawGenerator(); },
}));
const ampKnob = new Knob({ group: generatorUnit, x: 0.06, y: -0.13, radius: 0.018, values: AMPS, index: AMPS.indexOf(1), onChange: (v) => { generator.amp = v; drawGenerator(); } });
const freqKnob = new Knob({ group: generatorUnit, x: 0.17, y: -0.13, radius: 0.018, values: FREQS, index: FREQS.indexOf(1000), onChange: (v) => { generator.freq = v; drawGenerator(); } });
const vin2Knob = new Knob({ group: generatorUnit, x: 0.17, y: -0.238, radius: 0.014, values: VIN2, index: VIN2.indexOf(2), ring: COLORS.vin2, onChange: (v) => { generator.vin2 = v; drawGenerator(); } });
knobs.push(ampKnob, freqKnob, vin2Knob);
// top to bottom: Vin2, Vin, COM, the same order as their destinations on the circuit bay
addSocket("genOut2", generatorUnit, 0.28, -0.065, "vin2");
addSocket("genOut", generatorUnit, 0.28, -0.15, "vin");
addSocket("genCom", generatorUnit, 0.28, -0.235, "com");
socketById.genOut2.covered = true;

// the hinged cover over Vin2: it lifts when a two-input card is in the slot
const cover = new THREE.Group();
cover.position.set(0.28, -0.065 + 0.02, 0);
{
  const flap = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.04, 0.004).translate(0, -0.02, 0.014), new THREE.MeshStandardMaterial({ color: "#8e79ad", roughness: 0.35, transparent: true, opacity: 0.85 }));
  flap.castShadow = true;
  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.034, 10).rotateZ(Math.PI / 2).translate(0, 0, 0.013), metalMaterial());
  cover.add(flap, hinge);
}
generatorUnit.add(cover);
function metalMaterial() { return new THREE.MeshStandardMaterial({ color: "#d4d7da", metalness: 1, roughness: 0.25 }); }

function drawGenerator() {
  genDisplay.draw((ctx, w, h) => {
    ctx.strokeStyle = COLORS.vin;
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i <= 120; i += 1) {
      const t = i / 120;
      const v = generator.wave === "dc" ? 0.6 : waveShape(generator.wave, t * 3);
      const x = 20 + t * (w * 0.5);
      const y = h * 0.42 - v * h * 0.25;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    const amp = generator.wave === "dc" ? `${generator.amp.toFixed(2)} V` : `${generator.amp.toFixed(2)} Vpp`;
    write(ctx, amp, w * 0.97, h * 0.25, h * 0.21, COLORS.amber, 600, "right", MONO);
    write(ctx, generator.wave === "dc" ? "DC" : hz(generator.freq), w * 0.97, h * 0.52, h * 0.21, COLORS.amber, 600, "right", MONO);
    if (generator.vin2Open) write(ctx, `Vin2 ${volts(generator.vin2)}`, w * 0.97, h * 0.82, h * 0.18, "#c7a6f0", 600, "right", MONO);
  });
}

// ---------- measure bay: oscilloscope and multimeter ----------
const VDIV = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10];
const TDIV = [10e-6, 20e-6, 50e-6, 100e-6, 200e-6, 500e-6, 1e-3, 2e-3, 5e-3, 10e-3, 20e-3, 50e-3];
const vdivLabel = (v) => (v < 1 ? `${v * 1000} mV` : `${v} V`);
const tdivLabel = (t) => (t < 1e-3 ? `${Math.round(t * 1e6)} µs` : `${t * 1e3} ms`);
printedPlate(measureBay, 0, 0.165, 0.68, 0.27, 4400, (ctx, w, h, k) => {
  ctx.fillStyle = COLORS.face; ctx.fillRect(0, 0, w, h);
  const Y = (y) => (0.135 - (y - 0.165)) * k;
  const X = (x) => (x + 0.34) * k;
  write(ctx, "OSCILLOSCOPE", X(0.02), Y(0.283), 0.015 * k, COLORS.ink, 800, "center");
  write(ctx, "CH1", X(-0.3), Y(0.282), 0.013 * k, COLORS.ink, 800, "center");
  write(ctx, "CH2", X(-0.3), Y(0.192), 0.013 * k, COLORS.ink, 800, "center");
  write(ctx, "CH1 V/DIV", X(0.29), Y(0.282), 0.01 * k, COLORS.ink, 800, "center");
  write(ctx, "CH2 V/DIV", X(0.29), Y(0.202), 0.01 * k, COLORS.ink, 800, "center");
  write(ctx, "TIME/DIV", X(0.29), Y(0.122), 0.01 * k, COLORS.ink, 800, "center");
  ctx.fillStyle = COLORS.vin; ctx.beginPath(); ctx.arc(X(-0.3), Y(0.25), 0.0135 * k, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = COLORS.out; ctx.beginPath(); ctx.arc(X(-0.3), Y(0.16), 0.0135 * k, 0, Math.PI * 2); ctx.fill();
});
const scopeScreen = new Display(measureBay, 0.02, 0.155, 0.38, 0.22, 3000);
const ch1Knob = new Knob({ group: measureBay, x: 0.29, y: 0.25, radius: 0.016, values: VDIV, index: VDIV.indexOf(0.5), ring: COLORS.vin });
const ch2Knob = new Knob({ group: measureBay, x: 0.29, y: 0.17, radius: 0.016, values: VDIV, index: VDIV.indexOf(1), ring: COLORS.out });
const timeKnob = new Knob({ group: measureBay, x: 0.29, y: 0.09, radius: 0.016, values: TDIV, index: TDIV.indexOf(500e-6) });
knobs.push(ch1Knob, ch2Knob, timeKnob);
new Key({ group: measureBay, x: -0.29, y: 0.065, w: 0.08, h: 0.04, label: "AUTOSET", onPress: () => autoset() });
// probe BNC inputs, with their cables already plugged and run into the frame tray
for (const y of [0.25, 0.16]) {
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.026, 24).rotateX(Math.PI / 2).translate(0, 0, 0.013), metalMaterial());
  body.position.set(-0.3, y, 0);
  measureBay.add(body);
}

// Probe and meter cables run inside a tray along the circuit bay's frame and come
// out of ports directly above or beside the test points they reach. A cable then
// drops a few centimetres to its clip instead of crossing the panel.
function tubeBetween(a, b, radius) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 14), trayMat);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  mesh.castShadow = true;
  lab.add(mesh);
}
const worldOf = (group, x, y, z) => { group.updateMatrixWorld(true); return new THREE.Vector3(x, y, z).applyMatrix4(group.matrixWorld); };
const EDGE = PANEL_W / 2 + 0.014;
tubeBetween(worldOf(panel, -0.36, PANEL_H / 2 + 0.014, -0.006), worldOf(panel, EDGE, PANEL_H / 2 + 0.014, -0.006), 0.008);
tubeBetween(worldOf(panel, EDGE, PANEL_H / 2 + 0.014, -0.006), worldOf(panel, EDGE, -0.12, -0.006), 0.008);
tubeBetween(worldOf(panel, EDGE, PANEL_H / 2 + 0.014, -0.006), worldOf(measureBay, -0.37, 0.2, -0.006), 0.008);
tubeBetween(worldOf(panel, EDGE, -0.12, -0.006), worldOf(measureBay, -0.37, -0.23, -0.006), 0.008);
function port(x, y) {
  const grommet = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.01, 0.014, 20).rotateX(Math.PI / 2).translate(0, 0, 0.007), trayMat);
  grommet.position.set(x, y, 0);
  panel.add(grommet);
  return toPanel(panel, x, y, 0.016);
}
const ch1Anchor = port(at(165, 0)[0], PANEL_H / 2 + 0.014);
const ch2Anchor = port(at(835, 0)[0], PANEL_H / 2 + 0.014);

const meter = { mode: "dcv" };
const MODES = ["off", "dcv", "acv"];
printedPlate(measureBay, 0, -0.165, 0.68, 0.27, 4400, (ctx, w, h, k) => {
  ctx.fillStyle = COLORS.face; ctx.fillRect(0, 0, w, h);
  const Y = (y) => (0.135 - (y + 0.165)) * k;
  const X = (x) => (x + 0.34) * k;
  write(ctx, "MULTIMETER", X(0.02), Y(-0.045), 0.019 * k, COLORS.ink, 800, "center");
  write(ctx, "OFF", X(0.16), Y(-0.105), 0.012 * k, COLORS.muted, 700, "center", MONO);
  write(ctx, "V⎓", X(0.2), Y(-0.115), 0.014 * k, COLORS.ink, 800, "center", MONO);
  write(ctx, "V~", X(0.24), Y(-0.105), 0.014 * k, COLORS.ink, 800, "center", MONO);
  write(ctx, "COM", X(-0.29), Y(-0.265), 0.012 * k, COLORS.ink, 800, "center");
  write(ctx, "V", X(-0.21), Y(-0.265), 0.012 * k, COLORS.ink, 800, "center");
});
const meterDisplay = new Display(measureBay, -0.02, -0.17, 0.24, 0.07);
knobs.push(new Knob({ group: measureBay, x: 0.2, y: -0.17, radius: 0.022, values: MODES, index: 1, sweep: 80, onChange: (v) => { meter.mode = v; } }));
for (const [x, color] of [[-0.29, COLORS.com], [-0.21, COLORS.pos]]) {
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.02, 24).rotateX(Math.PI / 2).translate(0, 0, 0.01), new THREE.MeshStandardMaterial({ color, roughness: 0.45 }));
  body.position.set(x, -0.23, 0);
  measureBay.add(body);
}
// meter leads leave the frame on the right, level with OUTPUT
const meterVAnchor = port(EDGE, at(0, 455)[1]);
const meterComAnchor = port(EDGE, at(0, 525)[1]);

// When a probe is not in use, its reel pulls it home: it docks lying flat along the
// frame beside its port, clear of the panel, the lightbox and the keys.
function dock(anchor, axis) {
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), axis);
  const tip = anchor.clone().addScaledVector(axis, -0.082);
  tip.z = 0.012;
  return { local: tip, quat, plug: null, probe: true };
}
hooks.push(
  dock(ch1Anchor, new THREE.Vector3(1, 0, 0)), // CH1 lies to the left of its port
  dock(ch2Anchor, new THREE.Vector3(-1, 0, 0)), // CH2 to the right
  dock(meterVAnchor, new THREE.Vector3(0, -1, 0)), // the red meter lead points up the frame edge
  dock(meterComAnchor, new THREE.Vector3(0, 1, 0)), // the black one down
);

// ---------- configuration cards ----------
const CONFIGS = {
  inverting: { title: "INVERTING", formula: "−(Rf/Rin)·Vin", vin2: false, color: COLORS.vin },
  noninverting: { title: "NON-INVERTING", formula: "(1 + Rf/Rin)·Vin", vin2: false, color: COLORS.fb },
  adder: { title: "ADDER", formula: "−Rf(Vin/Rin + Vin2/Rin2)", vin2: true, color: COLORS.vin2 },
  difference: { title: "DIFFERENCE", formula: "(Rf/Rin2)(Vin − Vin2)", vin2: true, color: COLORS.out },
};
const STRIP_Y = at(0, 139)[1];
const SLOT = new THREE.Vector3(at(115, 0)[0], STRIP_Y, 0.004);
const POCKETS = [300, 480, 660, 840].map((px) => ({ local: new THREE.Vector3(at(px, 0)[0], STRIP_Y, 0.004), card: null }));
const CARD_W = 160 * MM;
const CARD_H = 50 * MM;
let slotCard = null;
const cardsList = [];
class Card {
  constructor(key, pocket) {
    this.key = key;
    this.config = CONFIGS[key];
    this.state = "rack";
    this.pocket = POCKETS[pocket];
    this.pocket.card = this;
    this.pos = new THREE.Vector3();
    this.quat = new THREE.Quaternion();
    this.target = new THREE.Vector3();
    this.heldQuat = new THREE.Quaternion();
    this.vel = new THREE.Vector3();
    const view = canvasTexture(1280, 400);
    const { ctx } = view;
    ctx.scale(2, 2); // laid out at 640 × 200
    ctx.fillStyle = COLORS.card; ctx.fillRect(0, 0, 640, 200);
    ctx.fillStyle = this.config.color; ctx.fillRect(0, 0, 22, 200);
    // card text is sized for the headset: the formula's cap height is over 6 mm
    const fitTo = (s, size, font, weight) => { ctx.font = `${weight} ${size}px ${font}`; return Math.min(size, (size * 580) / ctx.measureText(s).width); };
    write(ctx, this.config.title, 44, 62, fitTo(this.config.title, 62, SANS, 800), COLORS.ink, 800);
    write(ctx, this.config.formula, 44, 148, fitTo(this.config.formula, 44, MONO, 700), COLORS.ink, 700, "left", MONO);
    view.texture.needsUpdate = true;
    const edge = new THREE.MeshStandardMaterial({ color: "#b9d3d6", roughness: 0.25, metalness: 0.05 });
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(CARD_W, CARD_H, 0.004).translate(0, 0, 0.002), [edge, edge, edge, edge, new THREE.MeshStandardMaterial({ map: view.texture, roughness: 0.75 }), edge]);
    this.mesh.castShadow = true;
    this.mesh.userData.card = this;
    this.halo = new THREE.Mesh(new THREE.PlaneGeometry(CARD_W + 0.01, CARD_H + 0.01), new THREE.MeshBasicMaterial({ color: COLORS.next, transparent: true, opacity: 0, toneMapped: false }));
    this.halo.position.z = -0.0005;
    this.mesh.add(this.halo);
    panel.add(this.mesh);
    cardsList.push(this);
  }
  pose(dt) {
    if (this.state === "rack") { this.pos.copy(this.pocket.local); this.quat.identity(); }
    else if (this.state === "slot") { this.pos.copy(SLOT); this.quat.identity(); }
    else if (this.state === "held") { this.pos.copy(this.target); this.quat.copy(this.heldQuat); }
    else if (this.state === "free") {
      // a dropped card falls to the floor and lies there until it is picked up
      this.vel.addScaledVector(gravityLocal, dt);
      this.pos.addScaledVector(this.vel, dt);
      const world = this.pos.clone().applyQuaternion(panelQuat).add(panel.position);
      world.y += labLift;
      if (world.y < 0.003) { this.pos.addScaledVector(upLocal, 0.003 - world.y); this.vel.set(0, 0, 0); this.quat.copy(UPRIGHT); }
    }
    this.mesh.position.copy(this.pos);
    this.mesh.quaternion.copy(this.quat);
  }
}
Object.keys(CONFIGS).forEach((key, i) => new Card(key, i));

// ---------- cords, plugs and probes ----------
const plugGripGeo = new THREE.CylinderGeometry(0.0065, 0.0072, 0.038, 24).rotateX(Math.PI / 2).translate(0, 0, 0.019);
const plugTipGeo = new THREE.CylinderGeometry(0.002, 0.002, 0.014, 12).rotateX(Math.PI / 2).translate(0, 0, -0.007);
const plugCapGeo = new THREE.CylinderGeometry(0.0055, 0.0055, 0.003, 20).rotateX(Math.PI / 2).translate(0, 0, 0.0395);
const plugBootGeo = new THREE.CylinderGeometry(0.0038, 0.0045, 0.012, 14).translate(0, -0.006, 0.03);
const probeBodyGeo = new THREE.CylinderGeometry(0.0055, 0.0065, 0.07, 20).rotateX(Math.PI / 2).translate(0, 0, 0.035);
const probeBandGeo = new THREE.CylinderGeometry(0.0068, 0.0068, 0.008, 20).rotateX(Math.PI / 2).translate(0, 0, 0.058);
const probeHookGeo = new THREE.TorusGeometry(0.004, 0.0009, 6, 16, Math.PI * 1.4).translate(0, 0, -0.004);
const metalMat = metalMaterial();
const PLUG_EXIT = new THREE.Vector3(0, -0.011, 0.03);
const PROBE_EXIT = new THREE.Vector3(0, 0, 0.072);

class Plug {
  constructor(cord, end, kind) {
    this.cord = cord;
    this.end = end;
    this.kind = kind; // "plug" | "probe" | "fixed"
    this.state = kind === "fixed" ? "fixed" : "parked";
    this.socket = null;
    this.hook = null;
    this.stack = 0;
    this.pos = new THREE.Vector3();
    this.quat = new THREE.Quaternion();
    this.heldQuat = new THREE.Quaternion();
    this.anchor = new THREE.Vector3();
    this.target = new THREE.Vector3();
    this.exit = kind === "probe" ? PROBE_EXIT : PLUG_EXIT;
    if (kind === "fixed") return;
    this.mesh = new THREE.Group();
    const color = cord.band ?? cord.color;
    const gripMat = new THREE.MeshStandardMaterial({ color: kind === "probe" ? "#3a4047" : color, roughness: 0.42 });
    this.glowMat = gripMat;
    const parts = kind === "probe"
      ? [new THREE.Mesh(probeBodyGeo, gripMat), new THREE.Mesh(probeBandGeo, new THREE.MeshStandardMaterial({ color, roughness: 0.4 })), new THREE.Mesh(probeHookGeo, metalMat)]
      : [new THREE.Mesh(plugGripGeo, gripMat), new THREE.Mesh(plugBootGeo, gripMat), new THREE.Mesh(plugTipGeo, metalMat), new THREE.Mesh(plugCapGeo, metalMat)];
    for (const part of parts) { part.castShadow = true; part.userData.plug = this; this.mesh.add(part); }
    panel.add(this.mesh);
  }
  other() { return this.cord.plugs[this.end === 0 ? 1 : 0]; }
  pose() {
    if (this.state === "fixed") return;
    if (this.state === "parked") { this.pos.copy(this.hook.local); this.quat.copy(this.hook.quat); }
    else if (this.state === "seated") { this.pos.copy(this.socket.local).addScaledVector(this.socket.normal, 0.0095 + this.stack * STACK_STEP); this.quat.copy(this.socket.quat); }
    else if (this.state === "held") { this.pos.copy(this.target); this.quat.copy(this.heldQuat); }
    if (this.state !== "free") this.anchor.copy(this.exit).applyQuaternion(this.quat).add(this.pos);
  }
  fromRope() {
    const p = this.cord.p;
    const nb = p[this.end === 0 ? 1 : p.length - 2];
    this.anchor.copy(p[this.end]);
    this.quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nb.clone().sub(this.anchor).normalize());
    this.pos.copy(this.anchor).sub(this.exit.clone().applyQuaternion(this.quat));
  }
  sync() { if (this.mesh) { this.mesh.position.copy(this.pos); this.mesh.quaternion.copy(this.quat); } }
}

class Cord {
  constructor({ name, color, band, length, kinds = ["plug", "plug"], homes, fixedAt = null, radius = 0.0028 }) {
    this.name = name;
    this.color = color;
    this.band = band;
    this.length = length;
    this.current = length;
    this.radius = radius;
    this.n = Math.max(12, Math.round(length / 0.017));
    this.seg = length / (this.n - 1);
    this.p = Array.from({ length: this.n }, () => new THREE.Vector3());
    this.q = Array.from({ length: this.n }, () => new THREE.Vector3());
    this.pin = new Array(this.n).fill(null);
    this.contact = new Array(this.n).fill(false);
    this.grabbed = null;
    this.homes = homes;
    this.plugs = [new Plug(this, 0, kinds[0]), new Plug(this, this.n - 1, kinds[1])];
    if (fixedAt) this.plugs[1].anchor.copy(fixedAt);
    this.radial = 9;
    const verts = this.n * this.radial;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts * 3), 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(verts * 3), 3));
    const index = [];
    for (let i = 0; i < this.n - 1; i += 1) for (let k = 0; k < this.radial; k += 1) {
      const a = i * this.radial + k;
      const b = i * this.radial + ((k + 1) % this.radial);
      index.push(a, b, a + this.radial, b, b + this.radial, a + this.radial);
    }
    geometry.setIndex(index);
    this.mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: 0.5 }));
    this.mesh.castShadow = true;
    this.mesh.frustumCulled = false;
    this.mesh.userData.cord = this;
    panel.add(this.mesh);
  }
  park() {
    this.grabbed = null;
    this.plugs.forEach((plug, i) => {
      if (plug.kind === "fixed") return;
      detach(plug);
      plug.state = "parked";
      plug.hook = hooks[this.homes[i]];
      plug.hook.plug = plug;
      plug.pose();
    });
    const [a, b] = this.plugs.map((plug) => plug.anchor);
    const length = this.retract ? reelLength(this, a.distanceTo(b)) : this.length;
    this.asleep = false;
    this.still = 0;
    this.current = length;
    if (this.retract) this.seg = length / (this.n - 1);
    const sag = Math.sqrt(Math.max(length ** 2 - a.distanceToSquared(b), 0)) / 2;
    for (let i = 0; i < this.n; i += 1) {
      const t = i / (this.n - 1);
      this.p[i].lerpVectors(a, b, t).addScaledVector(upLocal, -sag * Math.sin(Math.PI * t));
      this.q[i].copy(this.p[i]);
    }
  }
}

// lengths are cut to the job: short hops on the panel, longer leads between bays
const cords = [
  ["sup+", COLORS.pos, 0.5], ["supCom", COLORS.com, 0.5], ["sup-", COLORS.neg, 0.5],
  ["gen2", COLORS.vin2, 0.45], ["gen", COLORS.vin, 0.42], ["genCom", COLORS.com, 0.42],
  ["p7", COLORS.pos, 0.2], ["p4", COLORS.neg, 0.24], ["p3", COLORS.com, 0.26],
  ["vin", COLORS.vin, 0.15], ["rin", COLORS.vin, 0.15], ["ni", COLORS.vin, 0.34], ["rcom", COLORS.com, 0.18],
  ["v2", COLORS.vin2, 0.14], ["r2", COLORS.vin2, 0.22], ["dvin", COLORS.vin, 0.17], ["r3a", COLORS.com, 0.13], ["r3b", COLORS.com, 0.11],
  ["rf1", COLORS.fb, 0.18], ["rf2", COLORS.fb, 0.2], ["out", COLORS.out, 0.18],
].map(([name, color, length], i) => new Cord({ name, color, length, homes: [i * 2, i * 2 + 1] }));
const leads = [
  { name: "ch1", color: "#3a4047", band: COLORS.vin, length: 0.45, fixedAt: ch1Anchor, home: 42 },
  { name: "ch2", color: "#3a4047", band: COLORS.out, length: 0.48, fixedAt: ch2Anchor, home: 43 },
  { name: "mV", color: COLORS.pos, length: 0.32, fixedAt: meterVAnchor, home: 44 },
  { name: "mCom", color: COLORS.com, length: 0.32, fixedAt: meterComAnchor, home: 45 },
].map((def) => Object.assign(new Cord({ ...def, kinds: ["probe", "fixed"], homes: [def.home], radius: 0.0032 }), { retract: true }));
const allCords = [...cords, ...leads];
const cordByName = Object.fromEntries(allCords.map((c) => [c.name, c]));
const plugs = allCords.flatMap((cord) => cord.plugs).filter((p) => p.kind !== "fixed");

function detach(plug) {
  if (plug.socket) {
    plug.socket.plugs = plug.socket.plugs.filter((other) => other !== plug);
    plug.socket.plugs.forEach((other, i) => { other.stack = i; });
    plug.socket = null;
    changed = true;
  }
  if (plug.hook) { plug.hook.plug = null; plug.hook = null; }
}

function resetLab() {
  for (const cord of allCords) cord.park();
  for (const holder of holders()) { holder.grab = null; holder.hover = null; }
  slotCard = null;
  for (const card of cardsList) {
    card.state = "rack";
    card.pocket = POCKETS[Object.keys(CONFIGS).indexOf(card.key)];
    card.pocket.card = card;
  }
  settle(300);
  changed = true;
}

// ---------- rope physics ----------
const tmp = new THREE.Vector3();
const local = new THREE.Vector3();
const CONTACT = 0.0035;
function collide(cord, i) {
  const point = cord.p[i];
  let hit = false;
  for (const s of surfaces) {
    local.copy(point).applyMatrix4(s.toLocal);
    if (Math.abs(local.x) < s.halfW + 0.025 && Math.abs(local.y) < s.halfH + 0.025 && local.z < CONTACT && local.z > -0.05) {
      local.z = CONTACT;
      point.copy(local.applyMatrix4(s.fromLocal));
      hit = true;
    }
  }
  const dy = point.y - RAIL_Y;
  const dz = point.z - RAIL_Z;
  const d = Math.hypot(dy, dz);
  if (d < 0.0115 && Math.abs(point.x) < PANEL_W / 2 + 0.02) {
    const s = 0.0115 / Math.max(d, 1e-6);
    point.y = RAIL_Y + dy * s;
    point.z = RAIL_Z + dz * s;
    hit = true;
  }
  tmp.copy(point).applyQuaternion(panelQuat).add(panel.position);
  tmp.y += labLift; // the floor stays put when the rig is raised or lowered
  if (tmp.y < 0.003) { point.addScaledVector(upLocal, 0.003 - tmp.y); hit = true; }
  if (hit) cord.contact[i] = true;
}

// cords push each other apart, so a bundle stays a bundle instead of passing through itself
const CELL = 0.012;
const grid = new Map();
function separateCords() {
  // cords hanging on the rail rest side by side; only cords in use push others aside
  for (const cord of allCords) cord.racked = cord.plugs.every((plug) => plug.state === "parked" || plug.state === "fixed");
  grid.clear();
  for (const cord of allCords) for (let i = 0; i < cord.n; i += 1) {
    const p = cord.p[i];
    const key = `${Math.floor(p.x / CELL)},${Math.floor(p.y / CELL)},${Math.floor(p.z / CELL)}`;
    let cell = grid.get(key);
    if (!cell) grid.set(key, (cell = []));
    cell.push(cord, i);
  }
  for (const cord of allCords) for (let i = 0; i < cord.n; i += 1) {
    if (cord.pin[i] || cord.asleep) continue;
    const p = cord.p[i];
    const cx = Math.floor(p.x / CELL);
    const cy = Math.floor(p.y / CELL);
    const cz = Math.floor(p.z / CELL);
    for (let ox = -1; ox <= 1; ox += 1) for (let oy = -1; oy <= 1; oy += 1) for (let oz = -1; oz <= 1; oz += 1) {
      const cell = grid.get(`${cx + ox},${cy + oy},${cz + oz}`);
      if (!cell) continue;
      for (let k = 0; k < cell.length; k += 2) {
        const other = cell[k];
        const j = cell[k + 1];
        const min = cord.radius + other.radius + 0.0008;
        // neighbours along the same cord are meant to touch; only distant parts of it collide
        if (other === cord ? Math.abs(i - j) * cord.seg < min * 1.5 : cord.racked && other.racked) continue;
        const q = other.p[j];
        tmp.subVectors(p, q);
        const d2 = tmp.lengthSq();
        if (d2 >= min * min || d2 < 1e-12) continue;
        const d = Math.sqrt(d2);
        const fixed = other.pin[j] || other.asleep;
        const push = (min - d) / d / (fixed ? 1 : 2);
        // move the previous position too: separation corrects position without adding speed
        p.addScaledVector(tmp, push);
        cord.q[i].addScaledVector(tmp, push);
        if (!fixed) { q.addScaledVector(tmp, -push); other.q[j].addScaledVector(tmp, -push); }
        else if (other.asleep && min - d > 0.002) other.asleep = false; // pressed hard into a resting cord: wake it
      }
    }
  }
}

// a spring reel in the frame takes up slack: just enough cable for where the probe is
function reelLength(cord, span) { return THREE.MathUtils.clamp(span * 1.08 + 0.006, 0.012, cord.length); }

// A cord that has come to rest goes to sleep and is not simulated, so nothing
// shimmers. It wakes the moment one of its ends moves, it is grabbed, or
// something presses into it.
function shouldWake(cord) {
  if (cord.grabbed) return true;
  return cord.plugs.some((plug, i) => plug.state === "held" || (plug.state !== "free" && plug.anchor.distanceToSquared(cord.snapshot[i]) > 1e-10));
}

function step(dt) {
  const g = gravityLocal.clone().multiplyScalar(dt * dt);
  for (const cord of allCords) {
    if (cord.asleep) {
      if (!shouldWake(cord)) continue;
      cord.asleep = false;
      cord.still = 0;
    }
    if (cord.retract) {
      const [probe, reel] = cord.plugs;
      const from = probe.state === "free" ? cord.p[0] : probe.anchor;
      cord.current += (reelLength(cord, from.distanceTo(reel.anchor)) - cord.current) * 0.25;
      cord.seg = cord.current / (cord.n - 1);
    }
    const { p, q, pin, n, seg } = cord;
    pin.fill(null);
    for (const plug of cord.plugs) if (plug.state !== "free") pin[plug.end] = plug.anchor;
    if (cord.grabbed) pin[cord.grabbed.index] = cord.grabbed.target;
    for (let i = 0; i < n; i += 1) {
      if (pin[i]) { p[i].copy(pin[i]); q[i].copy(pin[i]); continue; }
      // air drag; much more for a cord resting on the rack, so it settles instead of swinging
      tmp.subVectors(p[i], q[i]).multiplyScalar(cord.contact[i] ? 0.35 : cord.racked || !cord.grabbed ? 0.9 : 0.96);
      q[i].copy(p[i]);
      p[i].add(tmp).add(g);
    }
    cord.contact.fill(false);
    for (let iter = 0; iter < 16; iter += 1) {
      for (let i = 0; i < n - 1; i += 1) {
        const wa = pin[i] ? 0 : 1;
        const wb = pin[i + 1] ? 0 : 1;
        if (!wa && !wb) continue;
        tmp.subVectors(p[i + 1], p[i]);
        const len = tmp.length();
        if (len < 1e-9) continue;
        tmp.multiplyScalar((len - seg) / len / (wa + wb));
        p[i].addScaledVector(tmp, wa);
        p[i + 1].addScaledVector(tmp, -wb);
      }
      // bending stiffness: resist folding tighter than a patch lead would
      for (let i = 0; i < n - 2; i += 1) {
        const wa = pin[i] ? 0 : 1;
        const wb = pin[i + 2] ? 0 : 1;
        if (!wa && !wb) continue;
        tmp.subVectors(p[i + 2], p[i]);
        const len = tmp.length();
        const min = seg * 1.75;
        if (len >= min || len < 1e-9) continue;
        tmp.multiplyScalar(((len - min) / len / (wa + wb)) * 0.5);
        p[i].addScaledVector(tmp, wa);
        p[i + 2].addScaledVector(tmp, -wb);
      }
      if (iter % 4 === 3) for (let i = 0; i < n; i += 1) if (!pin[i]) collide(cord, i);
    }
  }
  separateCords();
  for (const cord of allCords) {
    if (cord.asleep) continue;
    let moved = 0;
    for (let i = 0; i < cord.n; i += 1) {
      if (!cord.pin[i]) collide(cord, i);
      moved = Math.max(moved, cord.p[i].distanceToSquared(cord.q[i]));
    }
    cord.still = moved < 3e-5 ** 2 ? (cord.still ?? 0) + 1 : 0;
    if (cord.still > 90) {
      cord.asleep = true;
      cord.snapshot = cord.plugs.map((plug) => plug.anchor.clone());
      for (let i = 0; i < cord.n; i += 1) cord.q[i].copy(cord.p[i]);
    }
  }
}

function settle(steps) {
  for (let s = 0; s < steps; s += 1) {
    for (const plug of plugs) plug.pose();
    step(1 / 120);
  }
}

function updateTube(cord) {
  const { p, n, radial, radius } = cord;
  const pos = cord.mesh.geometry.attributes.position.array;
  const nor = cord.mesh.geometry.attributes.normal.array;
  const t = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  const bin = new THREE.Vector3();
  for (let i = 0; i < n; i += 1) {
    t.subVectors(p[Math.min(i + 1, n - 1)], p[Math.max(i - 1, 0)]).normalize();
    if (i === 0 || nrm.lengthSq() < 1e-6) {
      nrm.set(0, 1, 0);
      if (Math.abs(t.y) > 0.9) nrm.set(1, 0, 0);
      nrm.cross(t).normalize();
    } else nrm.addScaledVector(t, -nrm.dot(t)).normalize();
    bin.crossVectors(t, nrm);
    for (let k = 0; k < radial; k += 1) {
      const a = (k / radial) * Math.PI * 2;
      const o = (i * radial + k) * 3;
      const dx = nrm.x * Math.cos(a) + bin.x * Math.sin(a);
      const dy = nrm.y * Math.cos(a) + bin.y * Math.sin(a);
      const dz = nrm.z * Math.cos(a) + bin.z * Math.sin(a);
      pos[o] = p[i].x + dx * radius; pos[o + 1] = p[i].y + dy * radius; pos[o + 2] = p[i].z + dz * radius;
      nor[o] = dx; nor[o + 1] = dy; nor[o + 2] = dz;
    }
  }
  cord.mesh.geometry.attributes.position.needsUpdate = true;
  cord.mesh.geometry.attributes.normal.needsUpdate = true;
  cord.mesh.geometry.computeBoundingSphere();
}

// ---------- circuit model ----------
function waveShape(type, cycles) {
  const ph = cycles - Math.floor(cycles);
  if (type === "square") return ph < 0.5 ? 1 : -1;
  if (type === "triangle") return ph < 0.5 ? 4 * ph - 1 : 3 - 4 * ph;
  if (type === "dc") return 1;
  return Math.sin(2 * Math.PI * cycles);
}
const vinAt = (t) => (generator.wave === "dc" ? generator.amp : (generator.amp / 2) * waveShape(generator.wave, generator.freq * t));

// Ideal op-amp nodal analysis. Every net voltage is a linear mix of three
// sources, [Vin(t), Vin2, 1 V], so one solve covers the whole waveform.
// Known nets are sources; every other net obeys Kirchhoff's current law, except
// the op-amp output, whose equation is replaced by V(+) = V(−).
function solve({ known, resistors: all, opamp, keep = [] }) {
  // a resistor with an end connected to nothing carries no current: drop it
  const pinned = (n) => known.has(n) || keep.includes(n) || (opamp && (n === opamp.out || n === opamp.inP || n === opamp.inN));
  let resistors = all.filter((r) => r.a !== r.b);
  for (let pruned = true; pruned;) {
    const degree = new Map();
    for (const r of resistors) for (const n of [r.a, r.b]) degree.set(n, (degree.get(n) ?? 0) + 1);
    const before = resistors.length;
    resistors = resistors.filter((r) => [r.a, r.b].every((n) => pinned(n) || degree.get(n) > 1));
    pruned = resistors.length !== before;
  }
  const unknownSet = new Set();
  for (const r of resistors) for (const n of [r.a, r.b]) if (!known.has(n)) unknownSet.add(n);
  for (const n of opamp ? [opamp.out, opamp.inP, opamp.inN, ...keep] : keep) if (!known.has(n)) unknownSet.add(n);
  const unknowns = [...unknownSet];
  const index = new Map(unknowns.map((n, i) => [n, i]));
  const N = unknowns.length;
  const A = Array.from({ length: N }, () => new Array(N).fill(0));
  const B = Array.from({ length: N }, () => [0, 0, 0]);
  const addTerm = (row, net, weight) => {
    if (index.has(net)) A[row][index.get(net)] += weight;
    else known.get(net).forEach((v, k) => { B[row][k] -= weight * v; });
  };
  unknowns.forEach((u, row) => {
    if (opamp && u === opamp.out) { addTerm(row, opamp.inP, 1); addTerm(row, opamp.inN, -1); return; }
    for (const r of resistors) {
      if (r.a === r.b || (r.a !== u && r.b !== u)) continue;
      const other = r.a === u ? r.b : r.a;
      addTerm(row, u, 1 / r.r);
      addTerm(row, other, -1 / r.r);
    }
  });
  for (let c = 0; c < N; c += 1) {
    let pivot = c;
    for (let r = c + 1; r < N; r += 1) if (Math.abs(A[r][c]) > Math.abs(A[pivot][c])) pivot = r;
    if (Math.abs(A[pivot][c]) < 1e-12) return null;
    [A[c], A[pivot]] = [A[pivot], A[c]];
    [B[c], B[pivot]] = [B[pivot], B[c]];
    for (let r = 0; r < N; r += 1) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      if (!f) continue;
      for (let k = c; k < N; k += 1) A[r][k] -= f * A[c][k];
      for (let k = 0; k < 3; k += 1) B[r][k] -= f * B[c][k];
    }
  }
  const result = new Map(known);
  unknowns.forEach((u, i) => result.set(u, B[i].map((v) => v / A[i][i])));
  return result;
}

const RESISTORS = { rin: ["rinA", "rinB"], rf: ["rfA", "rfB"], rin2: ["rin2A", "rin2B"], r3: ["r3A", "r3B"] };
const RKNOB = { rin: rinKnob, rf: rfKnob, rin2: rin2Knob, r3: r3Knob };
let model = { done: 0, steps: [], next: null, message: "" };

function evaluate() {
  const config = slotCard?.config ?? null;
  generator.vin2Open = Boolean(config?.vin2) || socketById.genOut2.plugs.length > 0;
  socketById.genOut2.covered = !generator.vin2Open;
  drawGenerator();

  const parent = {};
  const find = (x) => { while (parent[x] && parent[x] !== x) x = parent[x]; return x; };
  const join = (a, b) => { const ra = find(a); const rb = find(b); if (ra !== rb) parent[ra] = rb; };
  for (const s of sockets) if (s.net) join(s.id, s.net);
  for (const cord of cords) {
    const [a, b] = cord.plugs;
    if (a.state === "seated" && b.state === "seated") join(a.socket.id, b.socket.id);
  }
  const same = (a, b) => find(a) === find(b);
  const endIn = (res, socket) => RESISTORS[res].find((end) => same(end, socket)) ?? null;
  const otherEnd = (res, end) => RESISTORS[res].find((e) => e !== end);
  const probeNet = (name) => { const plug = cordByName[name].plugs[0]; return plug.state === "seated" ? find(plug.socket.id) : null; };

  // the procedure for the card in the slot, step by step
  const S = (a, b, text, color, ok = same(a, b)) => ({ a, b, text, color, ok });
  const R = (res, from, to, endA, endB, textA, textB, color) => {
    const e = endIn(res, from);
    const o = e ? otherEnd(res, e) : endB;
    return [
      { a: from, b: endA, text: textA, color, ok: Boolean(e) },
      { a: o, b: to, text: textB, color, ok: Boolean(e) && same(o, to) },
    ];
  };
  const steps = [{ card: true, text: "slot a configuration card from the rack", ok: Boolean(config) }];
  if (config) {
    steps.push(
      S("supPos", "railPos", "connect supply +V to the +V rail", COLORS.pos),
      S("supCom", "railCom", "connect supply COM to the COM rail", COLORS.com),
      S("supNeg", "railNeg", "connect supply −V to the −V rail", COLORS.neg),
      S("p7", "tapPos", "connect pin 7 to +V", COLORS.pos),
      S("p4", "tapNeg", "connect pin 4 to −V", COLORS.neg),
      S("genOut", "vin", "connect the generator Vin to INPUT Vin", COLORS.vin),
      S("genCom", "vinCom", "connect the generator COM to INPUT COM", COLORS.com),
    );
    if (config.vin2) steps.push(S("genOut2", "vin2", "connect the generator Vin2 to INPUT 2", COLORS.vin2));
    const rf = R("rf", "p2", "p6", "rfA", "rfB", "connect pin 2 to Rf", "connect Rf to pin 6", COLORS.fb);
    const ground3 = S("p3", "tapCom1", "connect pin 3 to COM", COLORS.com);
    if (slotCard.key === "inverting") steps.push(ground3, ...R("rin", "vin", "p2", "rinA", "rinB", "connect Vin to Rin", "connect Rin to pin 2", COLORS.vin), ...rf);
    if (slotCard.key === "noninverting") steps.push(S("vinB", "p3", "connect Vin to pin 3", COLORS.vin, same("vin", "p3")), ...R("rin", "p2", "vinCom", "rinB", "rinA", "connect pin 2 to Rin", "connect Rin to COM", COLORS.com), ...rf);
    if (slotCard.key === "adder") steps.push(ground3, ...R("rin", "vin", "p2", "rinA", "rinB", "connect Vin to Rin", "connect Rin to pin 2", COLORS.vin), ...R("rin2", "vin2", "p2", "rin2A", "rin2B", "connect Vin2 to Rin2", "connect Rin2 to pin 2", COLORS.vin2), ...rf);
    if (slotCard.key === "difference") steps.push(...R("rin2", "vin2", "p2", "rin2A", "rin2B", "connect Vin2 to Rin2", "connect Rin2 to pin 2", COLORS.vin2), ...R("rin", "vin", "p3", "rinA", "rinB", "connect Vin to Rin", "connect Rin to pin 3", COLORS.vin), ...R("r3", "p3", "tapCom2", "r3A", "r3B", "connect pin 3 to R3", "connect R3 to COM", COLORS.com), ...rf);
    steps.push(
      S("p6", "vout", "connect pin 6 to Vout", COLORS.out),
      { key: true, text: "switch the supply OUTPUT on", ok: supply.on },
      { probe: "ch1", b: "vin", text: "clip the yellow CH1 probe to Vin", ok: probeNet("ch1") === find("vin") },
      { probe: "ch2", b: "vout", text: "clip the cyan CH2 probe to Vout", ok: probeNet("ch2") === find("vout") },
      { probe: "mV", b: "vout", text: "touch the red meter lead to Vout", ok: probeNet("mV") === find("vout") },
      { probe: "mCom", b: "voutCom", text: "touch the black meter lead to COM", ok: probeNet("mCom") === find("supCom") },
    );
  }
  const doneIndex = steps.findIndex((s) => !s.ok);
  const done = doneIndex === -1 ? steps.length : doneIndex;

  // shorts between things that must never meet
  const special = [["supPos", "+V"], ["supNeg", "−V"], ["supCom", "COM"], ["genOut", "the generator Vin"], ["p6", "pin 6"]];
  if (generator.vin2Open) special.push(["genOut2", "the generator Vin2"]);
  let short = null;
  for (let i = 0; i < special.length && !short; i += 1) for (let j = i + 1; j < special.length; j += 1) {
    if (same(special[i][0], special[j][0])) { short = `${special[i][1]} is joined to ${special[j][1]}`; break; }
  }
  if (same("p7", "supNeg") || same("p4", "supPos")) short = "the supply is reversed on pins 7 and 4";

  // solve the circuit as wired
  const ground = find("supCom");
  const genRef = same("genCom", "supCom");
  const known = new Map([[ground, [0, 0, 0]]]);
  known.set(find("supPos"), [0, 0, supply.on ? supply.volts : 0]);
  known.set(find("supNeg"), [0, 0, supply.on ? -supply.volts : 0]);
  if (genRef) known.set(find("genOut"), [1, 0, 0]);
  if (genRef && generator.vin2Open) known.set(find("genOut2"), [0, 1, 0]);
  const resistors = Object.entries(RESISTORS).map(([key, [a, b]]) => ({ a: find(a), b: find(b), r: RKNOB[key].value * TOLERANCE[key] }));
  const powered = supply.on && same("p7", "supPos") && same("p4", "supNeg");
  const limit = supply.volts - 1.5;
  let nets = null;
  let outFn = null;
  if (!short) {
    const opamp = powered ? { out: find("p6"), inP: find("p3"), inN: find("p2") } : null;
    if (opamp && !known.has(opamp.out)) {
      nets = solve({ known, resistors, opamp });
      if (nets) {
        const k = nets.get(opamp.out);
        outFn = (t) => THREE.MathUtils.clamp(k[0] * vinAt(t) + k[1] * generator.vin2 + k[2], -limit, limit);
      } else {
        // no feedback: the op-amp runs open-loop and slams into a rail
        const passive = solve({ known, resistors: resistors.filter((r) => r.a !== opamp.out && r.b !== opamp.out), opamp: null, keep: [opamp.inP, opamp.inN] });
        const kp = passive?.get(opamp.inP);
        const kn = passive?.get(opamp.inN);
        if (kp && kn) {
          nets = passive;
          outFn = (t) => Math.sign((kp[0] - kn[0]) * vinAt(t) + (kp[1] - kn[1]) * generator.vin2 + (kp[2] - kn[2])) * limit;
        }
      }
    } else nets = solve({ known, resistors, opamp: null });
  }
  const outRoot = find("p6");
  const signalOf = (root) => {
    if (!root) return null;
    if (root === outRoot && outFn) return outFn;
    const k = nets?.get(root) ?? (known.has(root) ? known.get(root) : null);
    if (!k) return null;
    return (t) => k[0] * vinAt(t) + k[1] * generator.vin2 + k[2];
  };

  // theory, from the nominal values and the card's formula
  const nominal = Object.fromEntries(Object.keys(RKNOB).map((key) => [key, RKNOB[key].value]));
  let theory = null;
  if (config) {
    const { rin, rf, rin2, r3 } = nominal;
    theory = {
      inverting: { ka: -rf / rin, kb: 0, label: "−Rf/Rin" },
      noninverting: { ka: 1 + rf / rin, kb: 0, label: "1 + Rf/Rin" },
      adder: { ka: -rf / rin, kb: -rf / rin2 },
      difference: { ka: (r3 / (rin + r3)) * (1 + rf / rin2), kb: -rf / rin2 },
    }[slotCard.key];
  }

  let next = null;
  if (doneIndex !== -1) {
    const s = steps[doneIndex];
    if (s.card) next = { card: cardsList.find((c) => c.state === "rack") };
    else if (s.key) next = { key: outputKey };
    else if (s.probe) {
      const plug = cordByName[s.probe].plugs[0];
      next = plug.state === "seated" || plug.state === "held" ? { socket: socketById[s.b] } : { plug };
    } else next = { socket: socketById[s.a].plugs.length ? socketById[s.b] : socketById[s.a] };
  }
  model = {
    config, key: slotCard?.key, steps, done, next, short, theory, limit, powered,
    complete: doneIndex === -1 && Boolean(config),
    ch1: signalOf(probeNet("ch1")), ch2: signalOf(probeNet("ch2")),
    meterV: signalOf(probeNet("mV")), meterCom: signalOf(probeNet("mCom")),
    vout: signalOf(outRoot), vin: signalOf(find("genOut")),
    message: short ? `Short circuit: ${short}` : doneIndex === -1 ? "" : `Next: ${steps[doneIndex].text}`,
  };
  drawFace();
  drawLightbox();
}

// ---------- displays that follow the model ----------
function drawFace() {
  const { ctx, canvas } = face.view;
  // drawn in a 2-pixels-per-unit design space, scaled up to the texture's resolution
  const scale = canvas.width / 2000;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const X = (px) => px * 2;
  const Y = (py) => (py - PANEL_TOP) * 2;
  const rect = (x, y, w, h, fill, r = 12) => { ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(X(x), Y(y), w * 2, h * 2, r); ctx.fill(); };
  // 26 design pixels is a 7.7 mm cap height: over 20 arcminutes at the 0.6–0.7 m the
  // panel sits from the eyes, comfortably above the floor for reading in a Quest 3
  const text = (s, x, y, size, color = COLORS.ink, weight = 700, align = "left", font = SANS) => write(ctx, s, X(x), Y(y), Math.max(size, 26), color, weight, align, font);
  ctx.fillStyle = COLORS.face;
  ctx.fillRect(0, 0, 2000, canvas.height / scale);

  // card strip: the slot on the left, the rack's four pockets beside it
  text("CARD SLOT", 34, 99, 18, COLORS.muted, 800, "left", MONO);
  text("CARD RACK", 219, 99, 18, COLORS.muted, 800, "left", MONO);
  ctx.fillStyle = "rgba(77,208,225,0.10)";
  ctx.beginPath(); ctx.roundRect(X(205), Y(110), X(970) - X(205), 116, 10); ctx.fill();
  ctx.save();
  ctx.strokeStyle = slotCard ? "#9fb6bb" : COLORS.next;
  ctx.lineWidth = 6;
  ctx.setLineDash(slotCard ? [] : [16, 10]);
  ctx.beginPath(); ctx.roundRect(X(30), Y(110), X(200) - X(30), 116, 10); ctx.stroke();
  ctx.restore();
  for (const px of [300, 480, 660, 840]) {
    ctx.strokeStyle = "#b8c7ca";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(X(px - 85), Y(112), 340, 112, 8); ctx.stroke();
  }

  rect(50, 196, 140, 120, COLORS.plate);
  rect(205, 196, 170, 120, COLORS.plate);
  rect(400, 196, 320, 120, COLORS.plate);
  rect(50, 350, 140, 210, COLORS.plate);
  rect(205, 350, 170, 210, COLORS.plate);
  rect(400, 350, 320, 220, COLORS.ink);
  rect(760, 350, 150, 210, COLORS.plate);
  rect(340, 575, 100, 86, COLORS.plate);
  rect(30, 670, 940, 90, COLORS.plate);

  text("INPUT 2", 62, 214, 26, COLORS.ink, 800);
  text("Vin2", 118, 262, 26, COLORS.vin2, 800);
  text("second input", 62, 300, 17, COLORS.muted, 600, "left", MONO);
  text("Rin2", 215, 214, 28, COLORS.ink, 800);
  text("Rf · feedback", 418, 216, 32, COLORS.ink, 800);
  text("1 k – 100 kΩ", 470, 300, 18, COLORS.muted, 600, "left", MONO);
  text("INPUT", 66, 370, 32, COLORS.ink, 800);
  text("Vin", 138, 430, 32, COLORS.ink, 800);
  text("COM", 138, 495, 30, COLORS.ink, 700);
  text("Vin", 138, 545, 32, COLORS.ink, 800);
  text("Rin", 222, 370, 32, COLORS.ink, 800);
  text("1 k – 100 kΩ", 222, 545, 18, COLORS.muted, 600, "left", MONO);
  text("U1 · 741", 700, 370, 28, COLORS.face, 800, "right");
  text("OUTPUT", 776, 370, 32, COLORS.ink, 800);
  text("Vout", 853, 460, 32, COLORS.ink, 800);
  text("COM", 853, 520, 30, COLORS.ink, 700);
  text("R3", 346, 640, 26, COLORS.ink, 800);
  text("RAIL IN", 48, 664, 16, COLORS.muted, 800, "left", MONO);
  for (const [y, color, label] of [[696, COLORS.pos, "+V"], [719, COLORS.com, "COM"], [742, COLORS.neg, "−V"]]) {
    ctx.fillStyle = color;
    ctx.fillRect(X(85), Y(y) - 3, X(880) - X(85), 6);
    text(label, 892, y, 22, color, 800, "left", MONO);
  }

  // the 741 symbol, at socket scale
  ctx.strokeStyle = COLORS.face;
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(X(510), Y(390)); ctx.lineTo(X(510), Y(530)); ctx.lineTo(X(630), Y(460)); ctx.closePath(); ctx.stroke();
  ctx.lineWidth = 4;
  const line = (a, b, c, d) => { ctx.beginPath(); ctx.moveTo(X(a), Y(b)); ctx.lineTo(X(c), Y(d)); ctx.stroke(); };
  line(457, 430, 510, 430); line(457, 510, 510, 510); line(630, 460, 663, 460); line(540, 513, 540, 536); line(600, 478, 630, 538);
  text("−", 518, 430, 40, COLORS.face, 700);
  text("+", 518, 510, 40, COLORS.face, 700);
  text("2", 470, 412, 28, COLORS.face, 700, "left", MONO);
  text("3", 470, 492, 28, COLORS.face, 700, "left", MONO);
  text("6", 640, 444, 28, COLORS.face, 700, "left", MONO);
  text("7 +V", 486, 548, 22, COLORS.face, 700, "left", MONO);
  text("4 −V", 656, 548, 22, COLORS.face, 700, "left", MONO);

  // the card's guide lines between panel sockets: dashed until the connection exists
  for (const s of model.steps) {
    if (!s.a || !PANEL_PX[s.a] || !PANEL_PX[s.b]) continue;
    ctx.save();
    ctx.strokeStyle = s.ok ? s.color : "#8fa4aa";
    ctx.globalAlpha = s.ok ? 0.35 : 0.9;
    ctx.lineWidth = s.ok ? 14 : 4;
    ctx.setLineDash(s.ok ? [] : [14, 12]);
    ctx.beginPath(); ctx.moveTo(X(PANEL_PX[s.a][0]), Y(PANEL_PX[s.a][1])); ctx.lineTo(X(PANEL_PX[s.b][0]), Y(PANEL_PX[s.b][1])); ctx.stroke();
    ctx.restore();
  }
  face.view.texture.needsUpdate = true;
}

function sample(fn, period) {
  let min = Infinity; let max = -Infinity; let sum = 0; let sq = 0;
  const n = 200;
  for (let i = 0; i < n; i += 1) {
    const v = fn((i / n) * period);
    min = Math.min(min, v); max = Math.max(max, v); sum += v; sq += v * v;
  }
  const mean = sum / n;
  return { pp: max - min, mean, rmsAc: Math.sqrt(Math.max(sq / n - mean * mean, 0)) };
}
const period = () => (generator.wave === "dc" ? 1e-3 : 1 / generator.freq);
const signed = (v) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(2)}`;

function drawLightbox() {
  const { ctx, texture } = lightbox;
  ctx.setTransform(2, 0, 0, 2, 0, 0); // laid out at 1800 × 220, drawn at twice that
  ctx.fillStyle = COLORS.face;
  ctx.fillRect(0, 0, 1800, 220);
  if (model.message) {
    write(ctx, model.message, 40, 80, 54, model.short ? "#b5401c" : COLORS.ink, 800);
    const progress = model.config ? `${model.config.title.toLowerCase()} · ${model.done} of ${model.steps.length} steps` : "Select: the cards sit in the rack along the top of the panel";
    write(ctx, model.short ? "Pull out the last cord to clear it" : progress, 40, 160, 34, COLORS.muted, 600, "left", MONO);
    texture.needsUpdate = true;
    return;
  }
  const { theory } = model;
  const vin = sample(model.vin, period());
  const out = model.ch2 ? sample(model.ch2, period()) : null;
  const clipped = out && model.vout && Math.abs(out.mean) + out.pp / 2 > model.limit - 0.05;
  if (!model.config.vin2) {
    write(ctx, `theory  ${theory.label} = ${theory.ka.toFixed(2)}`, 40, 80, 48, COLORS.ink, 700, "left", MONO);
    if (out && generator.wave !== "dc" && vin.pp > 1e-6) {
      const sign = Math.sign(model.ch2(period() / 4) * model.vin(period() / 4)) || 1;
      const measured = (sign * out.pp) / vin.pp;
      const error = Math.abs((measured - theory.ka) / theory.ka) * 100;
      write(ctx, `measured CH2/CH1 = ${measured.toFixed(2)}`, 940, 80, 48, COLORS.ink, 700, "left", MONO);
      write(ctx, clipped ? `Vout is clipping at ±${model.limit.toFixed(1)} V: lower AMPL or raise the rails` : `error ${error.toFixed(1)} %  ·  1 % resistors`, 40, 160, 34, clipped ? "#b5401c" : COLORS.muted, 600, "left", MONO);
    } else write(ctx, "Use a sine, square or triangle input to measure the gain", 40, 160, 34, COLORS.muted, 600, "left", MONO);
  } else {
    write(ctx, `theory  Vout = ${theory.ka.toFixed(2)}·Vin ${theory.kb < 0 ? "−" : "+"} ${Math.abs(theory.kb).toFixed(2)}·Vin2`, 40, 80, 46, COLORS.ink, 700, "left", MONO);
    const expectMean = theory.ka * vin.mean + theory.kb * generator.vin2;
    const expectPP = Math.abs(theory.ka) * vin.pp;
    if (out) {
      write(ctx, `expected ${expectPP.toFixed(2)} Vpp about ${signed(expectMean)} V`, 40, 150, 32, COLORS.muted, 600, "left", MONO);
      write(ctx, clipped ? `measured: clipping at ±${model.limit.toFixed(1)} V` : `measured ${out.pp.toFixed(2)} Vpp about ${signed(out.mean)} V`, 40, 192, 32, clipped ? "#b5401c" : COLORS.ink, 700, "left", MONO);
    }
  }
  texture.needsUpdate = true;
}

function autoset() {
  [[model.ch1, ch1Knob], [model.ch2, ch2Knob]].forEach(([fn, knob]) => {
    if (!fn) return;
    const { pp, mean } = sample(fn, period());
    const span = Math.max(pp, Math.abs(mean) * 2 + pp, 0.05);
    const idx = VDIV.findIndex((v) => v * 7 >= span);
    knob.setIndex(idx === -1 ? VDIV.length - 1 : idx);
  });
  if (generator.wave !== "dc") {
    const idx = TDIV.findIndex((t) => t >= 2.5 / generator.freq / 10);
    timeKnob.setIndex(idx === -1 ? TDIV.length - 1 : idx);
  }
}

function drawScope() {
  scopeScreen.draw((ctx, w, h) => {
    const px = w / 600; // line weights are set for a 600-pixel-wide screen
    ctx.strokeStyle = "#1f2a30";
    ctx.lineWidth = 2 * px;
    for (let i = 1; i < 10; i += 1) { ctx.beginPath(); ctx.moveTo((i * w) / 10, 0); ctx.lineTo((i * w) / 10, h); ctx.stroke(); }
    for (let i = 1; i < 8; i += 1) { ctx.beginPath(); ctx.moveTo(0, (i * h) / 8); ctx.lineTo(w, (i * h) / 8); ctx.stroke(); }
    ctx.strokeStyle = "#35444c";
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    const span = timeKnob.value * 10;
    const trace = (fn, vdiv, color) => {
      if (!fn) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3 * px;
      ctx.beginPath();
      for (let i = 0; i <= w; i += 2) {
        const y = THREE.MathUtils.clamp(h / 2 - (fn((i / w) * span) / vdiv) * (h / 8), 2, h - 2);
        if (i === 0) ctx.moveTo(i, y); else ctx.lineTo(i, y);
      }
      ctx.stroke();
    };
    trace(model.ch1, ch1Knob.value, COLORS.vin);
    trace(model.ch2, ch2Knob.value, COLORS.out);
    const size = h * 0.055;
    write(ctx, `CH1 ${vdivLabel(ch1Knob.value)}/div`, 10, size, size, COLORS.vin, 600, "left", MONO);
    write(ctx, `CH2 ${vdivLabel(ch2Knob.value)}/div`, 10, size * 2.2, size, COLORS.out, 600, "left", MONO);
    write(ctx, `${tdivLabel(timeKnob.value)}/div`, w - 10, size, size, "#9aa4ad", 600, "right", MONO);
    if (model.ch1 && model.ch2 && generator.wave !== "dc") {
      const a = sample(model.ch1, period());
      const b = sample(model.ch2, period());
      if (a.pp > 1e-6) write(ctx, `CH2/CH1 ${(b.pp / a.pp).toFixed(2)}`, w - 10, h - size, size, COLORS.amber, 600, "right", MONO);
      write(ctx, `CH2 mean ${signed(b.mean)} V`, 10, h - size, size, COLORS.out, 600, "left", MONO);
    }
    if (!model.ch1 && !model.ch2) write(ctx, "no signal: clip a probe on", w / 2, h / 2 - size * 1.5, size, "#6b7278", 600, "center", MONO);
  });
}

function drawMeter() {
  if (meter.mode === "off") { meterDisplay.draw(() => {}); return; }
  if (!model.meterV || !model.meterCom) { meterDisplay.text(meter.mode === "acv" ? "--.-- V~" : "--.-- V"); return; }
  const s = sample((t) => model.meterV(t) - model.meterCom(t), period());
  const v = meter.mode === "acv" ? s.rmsAc : s.mean;
  meterDisplay.text(`${v >= 0 ? " " : "−"}${Math.abs(v).toFixed(2)} V${meter.mode === "acv" ? "~" : ""}`);
}

// ---------- audio and haptics ----------
let audio = null;
function wakeAudio() { if (!audio) audio = new AudioContext(); if (audio.state === "suspended") audio.resume(); }
function tick(freq, dur, vol) {
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "square";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
  osc.connect(gain).connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + dur);
}
const pulse = (holder, intensity, ms) => holder?.source?.gamepad?.hapticActuators?.[0]?.pulse?.(intensity, ms);

// ---------- grabbing: shared by mouse and controllers ----------
const toLocal = (world) => world.clone().applyMatrix4(panelInverse);

function nearestSocket(tip) {
  let best = null;
  let bestD = SEAT_RADIUS;
  for (const s of sockets) {
    if (s.covered) continue;
    tmp.subVectors(tip, s.local);
    const along = tmp.dot(s.normal);
    if (along < -0.01 || along > 0.12) continue;
    const lateral = tmp.addScaledVector(s.normal, -along).length();
    if (lateral < bestD) { best = s; bestD = lateral; }
  }
  return best;
}
function nearestHook(tip, plug) {
  let best = null;
  let bestD = 0.035;
  for (const hook of hooks) {
    if (hook.plug || Boolean(hook.probe) !== (plug.kind === "probe")) continue;
    const d = tip.distanceTo(hook.local);
    if (d < bestD) { best = hook; bestD = d; }
  }
  return best;
}
function surfaceAt(point) {
  for (const s of surfaces) {
    local.copy(point).applyMatrix4(s.toLocal);
    if (Math.abs(local.x) < s.halfW + 0.05 && local.y < s.halfH + 0.05 && local.y > -s.halfH - 0.2 && local.z > -0.02 && local.z < 0.25) return s;
  }
  return null;
}

function beginGrab(holder, hit) {
  let o = hit.object;
  while (o && !o.userData.plug && !o.userData.knob && !o.userData.cord && !o.userData.key && !o.userData.card) o = o.parent;
  if (!o) return false;
  if (o.userData.key) { o.userData.key.press(); pulse(holder, 0.4, 30); return false; }
  if (o.userData.card) {
    const card = o.userData.card;
    if (card.state === "held") return false;
    if (card.state === "slot") slotCard = null;
    if (card.state === "rack") card.pocket.card = null;
    card.target.copy(card.pos);
    card.heldQuat.copy(card.quat);
    card.state = "held";
    holder.grab = { kind: "card", card };
    tick(1100, 0.02, 0.08);
    pulse(holder, 0.3, 20);
    changed = true;
    return true;
  }
  if (o.userData.plug) {
    const plug = o.userData.plug;
    if (plug.state === "held") return false;
    if (plug.state === "seated") {
      const top = plug.socket.plugs[plug.socket.plugs.length - 1];
      if (top !== plug) return beginGrab(holder, { object: top.mesh.children[0], point: hit.point });
      // in the headset a seated plug or probe holds until it is pulled 2 cm straight out
      if (holder.vr) {
        holder.grab = { kind: "seated", plug, from: toLocal(holder.grip.getWorldPosition(new THREE.Vector3())) };
        pulse(holder, 0.2, 15);
        return true;
      }
    }
    detach(plug);
    plug.target.copy(plug.pos);
    plug.heldQuat.copy(plug.quat);
    plug.state = "held";
    holder.grab = { kind: "plug", plug };
    tick(900, 0.025, 0.08);
    pulse(holder, 0.3, 20);
    changed = true;
    return true;
  }
  if (o.userData.knob) {
    holder.grab = { kind: "knob", knob: o.userData.knob, start: o.userData.knob.index, acc: 0, last: null };
    return true;
  }
  if (o.userData.cord) {
    const cord = o.userData.cord;
    const point = toLocal(hit.point);
    let index = 1;
    let best = Infinity;
    for (let i = 1; i < cord.n - 1; i += 1) { const d = cord.p[i].distanceTo(point); if (d < best) { best = d; index = i; } }
    cord.grabbed = { index, target: cord.p[index].clone() };
    holder.grab = { kind: "cord", cord };
    return true;
  }
  return false;
}
const grabPoint = (grab) => (grab.kind === "plug" ? grab.plug.target : grab.kind === "card" ? grab.card.target : grab.cord.grabbed.target);

function moveGrab(holder, point) {
  const grab = holder.grab;
  if (!grab) return;
  const s = surfaceAt(point);
  if (grab.kind === "plug") {
    grab.plug.target.copy(point);
    if (s) grab.plug.heldQuat.copy(s.quat);
    holder.hover = nearestSocket(point);
  } else if (grab.kind === "card") {
    grab.card.target.copy(point);
    if (s) grab.card.heldQuat.copy(s.quat);
  } else if (grab.kind === "cord") grab.cord.grabbed.target.copy(point);
}

function endGrab(holder) {
  const grab = holder.grab;
  holder.grab = null;
  holder.hover = null;
  if (!grab) return;
  if (grab.kind === "plug") {
    const plug = grab.plug;
    const socket = nearestSocket(plug.target);
    const hook = socket ? null : nearestHook(plug.target, plug);
    if (socket) {
      plug.state = "seated";
      plug.socket = socket;
      socket.plugs.push(plug);
      plug.stack = socket.plugs.length - 1;
      tick(520, 0.05, 0.25);
      tick(2400, 0.01, 0.1);
      pulse(holder, 0.8, 40);
    } else if (hook) {
      plug.state = "parked";
      plug.hook = hook;
      hook.plug = plug;
      tick(700, 0.03, 0.1);
    } else if (plug.kind === "probe") {
      // a probe let go anywhere else is drawn back to its dock by its reel
      plug.state = "reeling";
      plug.hook = hooks[plug.cord.homes[0]].plug ? hooks.find((h) => h.probe && !h.plug) : hooks[plug.cord.homes[0]];
      plug.hook.plug = plug;
      tick(300, 0.12, 0.05);
    } else {
      plug.state = "free"; // it drops and hangs from its cord, where it was let go
      plug.cord.p[plug.end].copy(plug.anchor);
      plug.cord.q[plug.end].copy(plug.anchor);
    }
  } else if (grab.kind === "card") {
    const card = grab.card;
    const t = card.target;
    const nearSlot = !slotCard && Math.hypot(t.x - SLOT.x, t.y - SLOT.y) < 0.06 && t.z < 0.12;
    const pocket = POCKETS.filter((p) => !p.card).sort((a, b) => a.local.distanceTo(t) - b.local.distanceTo(t))[0];
    if (nearSlot) {
      card.state = "slot";
      slotCard = card;
      tick(420, 0.06, 0.25);
      tick(1800, 0.015, 0.12);
      pulse(holder, 0.8, 50);
    } else if (pocket && pocket.local.distanceTo(t) < 0.08) {
      card.state = "rack";
      card.pocket = pocket;
      pocket.card = card;
      tick(700, 0.03, 0.1);
    } else {
      card.state = "free";
      card.vel.set(0, 0, 0);
    }
  } else if (grab.kind === "cord") grab.cord.grabbed = null;
  changed = true;
}

// a cord can't stretch: a held plug stays within reach of the other end
function constrainHeld() {
  for (const plug of plugs) {
    if (plug.state !== "held") continue;
    const other = plug.other();
    const reach = plug.cord.length * 0.96;
    const exit = plug.exit.clone().applyQuaternion(plug.heldQuat);
    const anchor = plug.target.clone().add(exit);
    if (anchor.distanceTo(other.anchor) <= reach) continue;
    if (other.state === "parked") { detach(other); other.state = "free"; continue; }
    if (other.state === "free") continue;
    anchor.sub(other.anchor).setLength(reach).add(other.anchor);
    plug.target.copy(anchor).sub(exit);
  }
}

// ---------- mouse ----------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const mouse = { grab: null, hover: null, source: null, screen: new THREE.Vector2() };
const pickables = () => [...plugs.map((p) => p.mesh), ...knobs.map((k) => k.group), ...allCords.map((c) => c.mesh), ...keys.map((k) => k.cap), ...cardsList.map((c) => c.mesh)];

// cords are thin, so they are picked within a centimetre of the cable, not only on its surface
function pick(ray) {
  raycaster.ray.copy(ray);
  const hit = raycaster.intersectObjects(pickables(), true).find((h) => h.object !== h.object.parent?.userData?.card?.halo) ?? null;
  let cordHit = null;
  const world = new THREE.Vector3();
  for (const cord of allCords) for (let i = 1; i < cord.n - 1; i += 1) {
    panel.localToWorld(world.copy(cord.p[i]));
    if (ray.distanceSqToPoint(world) > 0.012 ** 2) continue;
    const distance = ray.origin.distanceTo(world);
    if (!cordHit || distance < cordHit.distance) cordHit = { object: cord.mesh, point: world.clone(), distance };
  }
  if (cordHit && (!hit || (cordHit.distance < hit.distance - 0.004 && !hit.object.userData.plug))) return cordHit;
  return hit;
}

function setPointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
  mouse.screen.set(event.clientX, event.clientY);
  raycaster.setFromCamera(pointer, camera);
}

// drag on the nearest bay face, 5 cm proud of it; off every bay, on a plane facing the camera
function dragPoint(ray, current) {
  let best = null;
  for (const s of surfaces) {
    const m = panel.matrixWorld.clone().multiply(s.fromLocal);
    const r = ray.clone().applyMatrix4(m.clone().invert());
    const p = r.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), -DRAG_Z), new THREE.Vector3());
    if (!p || Math.abs(p.x) > s.halfW + 0.08 || p.y > s.halfH + 0.08 || p.y < -s.halfH - 0.2) continue;
    const world = p.applyMatrix4(m);
    const d = world.distanceTo(ray.origin);
    if (!best || d < best.d) best = { d, world };
  }
  if (best) return toLocal(best.world);
  const currentWorld = panel.localToWorld(current.clone());
  const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()).negate(), currentWorld);
  const world = ray.intersectPlane(plane, new THREE.Vector3());
  return world ? toLocal(world) : null;
}
function knobScreenAngle(knob) {
  const centre = knob.group.getWorldPosition(new THREE.Vector3()).project(camera);
  const rect = renderer.domElement.getBoundingClientRect();
  const cx = rect.left + ((centre.x + 1) / 2) * rect.width;
  const cy = rect.top + ((1 - centre.y) / 2) * rect.height;
  return Math.atan2(mouse.screen.y - cy, mouse.screen.x - cx);
}
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

renderer.domElement.addEventListener("pointerdown", (event) => {
  wakeAudio();
  if (event.button !== 0) return;
  setPointer(event);
  const hit = pick(raycaster.ray.clone());
  if (!hit) return;
  event.stopImmediatePropagation();
  if (!beginGrab(mouse, hit)) return;
  controls.enabled = false;
  renderer.domElement.setPointerCapture(event.pointerId);
  if (mouse.grab.kind === "knob") mouse.grab.last = knobScreenAngle(mouse.grab.knob);
}, { capture: true });

renderer.domElement.addEventListener("pointermove", (event) => {
  setPointer(event);
  if (!mouse.grab) {
    renderer.domElement.style.cursor = pick(raycaster.ray.clone()) ? "grab" : "default";
    return;
  }
  renderer.domElement.style.cursor = "grabbing";
  const grab = mouse.grab;
  if (grab.kind === "knob") {
    const a = knobScreenAngle(grab.knob);
    grab.acc += wrap(a - grab.last);
    grab.last = a;
    grab.knob.setIndex(grab.start + Math.round(grab.acc / grab.knob.detent));
    return;
  }
  const point = dragPoint(raycaster.ray.clone(), grabPoint(grab));
  if (point) moveGrab(mouse, point);
});

renderer.domElement.addEventListener("wheel", (event) => {
  setPointer(event);
  const hit = raycaster.intersectObjects(knobs.map((k) => k.group), true)[0];
  if (!hit) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const knob = hit.object.userData.knob;
  knob.setIndex(knob.index + (event.deltaY > 0 ? -1 : 1));
}, { capture: true, passive: false });

const release = () => { if (mouse.grab) endGrab(mouse); controls.enabled = true; renderer.domElement.style.cursor = "default"; };
renderer.domElement.addEventListener("pointerup", release);
renderer.domElement.addEventListener("pointercancel", release);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.27, -0.4);
controls.minDistance = 0.12;
controls.maxDistance = 2.5;
controls.enableDamping = true;
controls.update();

// ---------- controllers ----------
// Each hand shows the headset's own controller model, which moves its buttons as they
// are pressed, and a short pointer from its nose. The bead at the pointer's end is the
// fingertip: push it into a key to press it. Grabs stay near-only, at the palm.
const controllerModels = new XRControllerModelFactory();
const PALM = new THREE.Vector3(0, -0.006, -0.035); // grip space: the middle of the closed hand
const POKE_REACH = 0.07; // the bead sits 7 cm ahead of the controller
const BEAD_IDLE = new THREE.Color("#f5c518");
const BEAD_READY = new THREE.Color(COLORS.valid);
function makePointer() {
  const group = new THREE.Group();
  const line = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0006, 0.0009, POKE_REACH, 6).rotateX(Math.PI / 2).translate(0, 0, -POKE_REACH / 2),
    new THREE.MeshBasicMaterial({ color: "#f2f4f5", transparent: true, opacity: 0.45, depthWrite: false }),
  );
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.004, 14, 10), new THREE.MeshBasicMaterial({ color: BEAD_IDLE }));
  bead.position.z = -POKE_REACH;
  group.add(line, bead);
  return { group, line, bead };
}

const vrHolders = [0, 1].map((i) => {
  const ctrl = renderer.xr.getController(i);
  const grip = renderer.xr.getControllerGrip(i);
  const pointer = makePointer();
  pointer.group.visible = false;
  ctrl.add(pointer.group);
  grip.add(controllerModels.createControllerModel(grip));
  const holder = { vr: true, ctrl, grip, pointer, source: null, grab: null, hover: null, candidate: null, offset: new THREE.Vector3(), lastRoll: 0, armed: new Set(), stickLatched: false, atStop: false };
  ctrl.addEventListener("connected", (e) => {
    holder.source = e.data;
    pointer.group.visible = e.data.targetRayMode === "tracked-pointer";
  });
  ctrl.addEventListener("disconnected", () => {
    if (holder.grab) endGrab(holder);
    holder.source = null;
    pointer.group.visible = false;
  });
  const start = () => { wakeAudio(); vrGrab(holder); };
  const end = () => { if (holder.grab) endGrab(holder); };
  ctrl.addEventListener("squeezestart", start);
  ctrl.addEventListener("squeezeend", end);
  ctrl.addEventListener("selectstart", start);
  ctrl.addEventListener("selectend", end);
  scene.add(ctrl, grip);
  return holder;
});
const holders = () => [mouse, ...vrHolders];

function controllerRoll(holder, knob) {
  const q = holder.grip.getWorldQuaternion(new THREE.Quaternion());
  const frame = knob.group.getWorldQuaternion(new THREE.Quaternion()).invert();
  const x = new THREE.Vector3(1, 0, 0).applyQuaternion(q).applyQuaternion(frame);
  return Math.atan2(x.y, x.x);
}

// the one grabbable thing nearest the palm, within 6 cm (3.5 cm for a cord's middle)
function nearCandidate(holder) {
  const palmWorld = holder.grip.localToWorld(PALM.clone());
  const palm = toLocal(palmWorld);
  let best = null;
  let bestD = 0.06;
  const consider = (d, candidate) => { if (d < bestD) { bestD = d; best = candidate; } };
  for (const plug of plugs) {
    if (plug.state === "reeling") continue;
    const middle = plug.exit.clone().multiplyScalar(0.5).applyQuaternion(plug.quat).add(plug.pos);
    consider(middle.distanceTo(palm), { object: plug.mesh.children[0], point: palmWorld, ref: plug });
  }
  for (const card of cardsList) consider(card.pos.distanceTo(palm) - 0.02, { object: card.mesh, point: palmWorld, ref: card });
  for (const knob of knobs) consider(toLocal(knob.group.getWorldPosition(new THREE.Vector3())).distanceTo(palm), { object: knob.dial.children[0], point: palmWorld, ref: knob });
  for (const cord of allCords) for (let i = 2; i < cord.n - 2; i += 1) {
    const d = cord.p[i].distanceTo(palm);
    if (d < Math.min(bestD, 0.035)) { bestD = d; best = { object: cord.mesh, point: panel.localToWorld(cord.p[i].clone()), ref: cord }; }
  }
  return best;
}

function vrGrab(holder) {
  if (holder.grab) return;
  const candidate = nearCandidate(holder);
  if (!candidate || !beginGrab(holder, candidate)) return;
  const grab = holder.grab;
  if (grab.kind === "knob") { holder.lastRoll = controllerRoll(holder, grab.knob); holder.atStop = false; return; }
  if (grab.kind === "seated") return;
  holder.offset.copy(holder.grip.worldToLocal(panel.localToWorld(grabPoint(grab).clone())));
}

function updateVrHolders(dt) {
  for (const holder of vrHolders) {
    if (!holder.source) continue;
    const pad = holder.source.gamepad;
    const stick = pad?.axes?.[2] ?? 0;
    const grab = holder.grab;
    // the pointer steps back while the hand holds something
    holder.pointer.line.material.opacity = grab ? 0.12 : 0.45;
    holder.pointer.bead.visible = !grab;
    holder.candidate = grab ? null : nearCandidate(holder);
    if (!grab) {
      // the thumbstick nudges a knob the hand is over, one detent per flick
      const knob = holder.candidate?.ref instanceof Knob ? holder.candidate.ref : null;
      if (knob && Math.abs(stick) > 0.6 && !holder.stickLatched) {
        holder.stickLatched = true;
        if (knob.setIndex(knob.index + Math.sign(stick))) pulse(holder, 0.25, 12);
        else pulse(holder, 0.8, 35);
      }
      if (Math.abs(stick) < 0.3) holder.stickLatched = false;
      continue;
    }
    if (grab.kind === "knob") {
      const roll = controllerRoll(holder, grab.knob);
      grab.acc -= wrap(roll - holder.lastRoll);
      holder.lastRoll = roll;
      const want = grab.start + Math.round(grab.acc / grab.knob.detent);
      const atStop = want < 0 || want > grab.knob.values.length - 1;
      if (grab.knob.setIndex(want)) pulse(holder, 0.25, 12);
      if (atStop && !holder.atStop) pulse(holder, 0.8, 35); // a firmer bump at an end stop
      holder.atStop = atStop;
      continue;
    }
    if (grab.kind === "seated") {
      // pulled 2 cm straight out of its socket, the plug breaks free into the hand
      const plug = grab.plug;
      const hand = toLocal(holder.grip.getWorldPosition(new THREE.Vector3()));
      if (hand.sub(grab.from).dot(plug.socket.normal) > 0.02) {
        detach(plug);
        plug.target.copy(plug.pos);
        plug.heldQuat.copy(plug.quat);
        plug.state = "held";
        holder.grab = { kind: "plug", plug };
        holder.offset.copy(holder.grip.worldToLocal(panel.localToWorld(plug.pos.clone())));
        tick(900, 0.025, 0.1);
        pulse(holder, 0.5, 20);
        changed = true;
      }
      continue;
    }
    moveGrab(holder, toLocal(holder.grip.localToWorld(holder.offset.clone())));
  }
}

// pointer-bead pokes: each key takes the deepest press from either free hand
const beadWorld = new THREE.Vector3();
function updatePokes() {
  for (const key of keys) {
    let depth = 0;
    let by = null;
    for (const holder of vrHolders) {
      if (!holder.source || holder.grab) continue;
      const d = key.pokeDepth(holder.pointer.bead.getWorldPosition(beadWorld), holder);
      if (d > depth) { depth = d; by = holder; }
    }
    if (by || key.cap.position.z !== key.rest) key.setDepth(depth, by);
  }
  // the bead turns green while it hovers in front of a key, ready to push
  for (const holder of vrHolders) holder.pointer.bead.material.color.copy(holder.armed.size ? BEAD_READY : BEAD_IDLE);
}

// a probe that was let go travels back along its cable to its dock
function updateReels(dt) {
  for (const plug of plugs) {
    if (plug.state !== "reeling") continue;
    const to = plug.hook.local;
    const way = to.clone().sub(plug.pos);
    const stride = 0.9 * dt;
    plug.quat.slerp(plug.hook.quat, Math.min(1, dt * 8));
    if (way.length() <= stride + 0.002) {
      plug.pos.copy(to);
      plug.quat.copy(plug.hook.quat);
      plug.state = "parked";
      tick(900, 0.02, 0.06);
      changed = true;
    } else plug.pos.addScaledVector(way.normalize(), stride);
  }
}

// ---------- fitting the wall to the person ----------
// On entering VR the rig rises or falls so the panel's centre sits 0.3 m below the
// eyes, which puts every socket, knob and key within reach, standing or seated.
const PANEL_CENTRE = 1.28;
let fitPending = 0;
function setLift(y) {
  labLift = y;
  lab.position.y = y;
  lab.updateMatrixWorld(true);
  panelInverse.copy(panel.matrixWorld).invert();
}
function fitHeight() {
  const eye = renderer.xr.getCamera().getWorldPosition(new THREE.Vector3());
  setLift(THREE.MathUtils.clamp(eye.y - 0.3 - PANEL_CENTRE, -0.55, 0.4));
}
renderer.xr.addEventListener("sessionstart", () => { fitPending = 45; }); // let the headset pose settle first
renderer.xr.addEventListener("sessionend", () => setLift(0));

// a floor mat marks where to stand
{
  const mat = new THREE.Mesh(new THREE.CircleGeometry(0.32, 48), new THREE.MeshStandardMaterial({ color: "#20252a", roughness: 0.95 }));
  mat.rotation.x = -Math.PI / 2;
  mat.position.y = 0.002;
  mat.receiveShadow = true;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.32, 48), new THREE.MeshBasicMaterial({ color: COLORS.next }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.003;
  scene.add(mat, ring);
}

// ---------- frame loop ----------
const WHITE = new THREE.Color("#ffffff");
function updateHighlights(time) {
  const hovered = new Set(holders().map((h) => h.hover).filter(Boolean));
  const near = new Set(vrHolders.map((h) => h.candidate?.ref).filter(Boolean));
  const blink = 0.5 + 0.5 * Math.sin(time * 0.008);
  const next = guided ? model.next : null;
  const amber = new THREE.Color(COLORS.next);
  const idle = new THREE.Color("#6b7278");
  for (const s of sockets) {
    if (hovered.has(s)) s.ringMat.color.set(COLORS.valid);
    else if (next?.socket === s) s.ringMat.color.copy(idle).lerp(amber, blink);
    else s.ringMat.color.copy(idle);
  }
  // the thing a hand would take glows softly; the guided next step blinks amber
  for (const plug of plugs) plug.glowMat.emissive.copy(near.has(plug) ? WHITE.clone().multiplyScalar(0.25) : next?.plug === plug ? amber.clone().multiplyScalar(blink * 0.8) : new THREE.Color(0));
  for (const knob of knobs) knob.dial.children[0].material.emissive.setScalar(near.has(knob) ? 0.18 : 0);
  for (const cord of allCords) cord.mesh.material.emissive.setScalar(near.has(cord) ? 0.15 : 0);
  for (const card of cardsList) {
    const hover = near.has(card);
    card.halo.material.color.set(hover ? "#ffffff" : COLORS.next);
    card.halo.material.opacity = hover ? 0.4 : next?.card === card ? 0.25 + 0.6 * blink : 0;
  }
  // tinted rather than redrawn, so the blink costs no texture upload
  if (next?.key) outputKey.faceMat.color.copy(WHITE).lerp(amber, blink * 0.7);
  else outputKey.faceMat.color.copy(WHITE);
}

let last = performance.now();
let frame = 0;
const PHYSICS_STEP = 1 / 120;
let accumulator = 0;
renderer.setAnimationLoop((time) => {
  const dt = Math.min((time - last) / 1000, 1 / 30);
  last = time;
  frame += 1;
  if (!renderer.xr.isPresenting) controls.update();
  if (fitPending && renderer.xr.isPresenting && --fitPending === 0) fitHeight();
  updateVrHolders(dt);
  if (renderer.xr.isPresenting) updatePokes();
  updateReels(dt);
  for (const plug of plugs) plug.pose();
  constrainHeld();
  for (const plug of plugs) plug.pose();
  // fixed physics steps: Verlet integration assumes a constant step, and a varying
  // frame time would kick the cords on every hitch
  accumulator = Math.min(accumulator + dt, 4 * PHYSICS_STEP);
  while (accumulator >= PHYSICS_STEP) { step(PHYSICS_STEP); accumulator -= PHYSICS_STEP; }
  for (const plug of plugs) { if (plug.state === "free") plug.fromRope(); plug.sync(); }
  for (const cord of allCords) updateTube(cord);
  for (const card of cardsList) card.pose(dt);
  cover.rotation.x += ((generator.vin2Open ? -2.6 : 0) - cover.rotation.x) * 0.15;
  // Displays redraw only when something changed. Re-uploading unchanged screens every
  // few frames cost the headset frames, and dropped frames make printed text judder.
  if (changed) { changed = false; evaluate(); drawMeter(); drawScope(); }
  updateHighlights(time);
  renderer.render(scene, camera);
});

function fitStage() {
  const { w, h } = stageSize();
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
new ResizeObserver(fitStage).observe(stage);

drawGenerator();
resetLab();
evaluate();

// exposed for automated checks only
window.__wall = {
  cords: allCords, cards: cardsList, pick, camera, panel, sockets: socketById, keys: { output: outputKey },
  knobs: { rin: rinKnob, rf: rfKnob, rin2: rin2Knob, r3: r3Knob, amp: ampKnob, vin2: vin2Knob },
  get model() { return model; },
  vr: { holders: vrHolders, grab: vrGrab, release: endGrab, update: updateVrHolders, pokes: updatePokes, setLift, fitHeight, keyList: keys, knobList: knobs, plugs, toLocal },
  seat(name, end, socketId) {
    const plug = cordByName[name].plugs[end];
    detach(plug);
    plug.state = "held";
    const s = socketById[socketId];
    plug.target.copy(s.local).addScaledVector(s.normal, DRAG_Z);
    endGrab({ grab: { kind: "plug", plug } });
  },
  slot(key) {
    const card = cardsList.find((c) => c.key === key);
    if (slotCard && slotCard !== card) { const pocket = POCKETS.find((p) => !p.card); slotCard.state = "rack"; slotCard.pocket = pocket; pocket.card = slotCard; slotCard = null; }
    if (card.state === "rack") card.pocket.card = null;
    card.state = "held";
    card.target.copy(SLOT);
    endGrab({ grab: { kind: "card", card } });
  },
  park(name) { cordByName[name].park(); changed = true; },
  reset() { resetLab(); if (supply.on) outputKey.press(); evaluate(); },
  refresh() { evaluate(); return model; },
};
