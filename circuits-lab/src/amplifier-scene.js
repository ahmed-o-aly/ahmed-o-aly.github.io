import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { circuit, resistorRoles, transfer, pinLabel, PROBES } from "./amplifier-experiment.js";

import { cableCurve, seedCable, traceCable, moveCableEnd, grabCable, bendCable } from "./amplifier-cables.js";
import { scopeAxes, displayNumber } from "./amplifier-display.js";

const INSTRUMENTS = {
  supply: { x: -2.55, y: 2.97, w: 3.55, h: 1.1 },
  generator: { x: -5.05, y: 0.44, w: 1.85, h: 2.1 },
  meter: { x: 4.65, y: 2.13, w: 3.7, h: 1.8 },
  scope: { x: 4.65, y: -1.125, w: 3.7, h: 3.45 },
};
const JACKS = {
  "plus+": ["supply", -1.1, 0.13],
  "plus-": ["supply", 0, 0.13],
  "minus-": ["supply", 1.1, 0.13],
  "signal+": ["generator", 0.55, 0.1],
  "signal-": ["generator", -0.55, 0.1],
  "signal2+": ["generator", 0.55, 1.05],
  black: ["meter", -1.47, 0.2],
  red: ["meter", 1.1, 0.2],
  ch1: ["scope", -1.48, 0.13],
  ch1Ground: ["scope", -0.63, 0.13],
  ch2: ["scope", 0.55, 0.13],
  ch2Ground: ["scope", 1.38, 0.13],
};
export function jackPosition(id) {
  const [name, x, y] = JACKS[id],
    i = INSTRUMENTS[name];
  return new THREE.Vector3(x, y, 0.38)
    .applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.48)
    .add(new THREE.Vector3(i.x, i.y - i.h / 2, 0.23))
    .toArray();
}
export function clearInstrumentFaces(points) {
  // Keep the drawn x/y path, lifting only interior points that enter a tilted face.
  // End contacts remain exact. This runs while drawing, never after release.
  const angle = 0.48,
    front = 0.45;
  return points.map((point, index) => {
    const p = [...point];
    if (index === 0 || index === points.length - 1) return p;
    for (const { x, y, w, h } of Object.values(INSTRUMENTS)) {
      const localY = (p[1] - (y - h / 2) + front * Math.sin(angle)) / Math.cos(angle);
      if (Math.abs(p[0] - x) <= w / 2 + 0.04 && localY >= 0 && localY <= h)
        p[2] = Math.max(p[2], 0.23 + localY * Math.sin(angle) + front * Math.cos(angle));
    }
    return p;
  });
}
export const POSITIONS = Object.freeze({
  ...Object.fromEntries(["plus+", "plus-", "minus-", "signal+", "signal-", "signal2+"].map((id) => [id, jackPosition(id).slice(0, 2)])),
  rina: [-3.35, -0.25],
  rinb: [-2.05, -0.25],
  rin2a: [-3.35, -1.45],
  rin2b: [-2.05, -1.45],
  rf2a: [1.15, 0.9],
  rf2b: [2.45, 0.9],
  rfa: [-1.5, 1.15],
  rfb: [0.05, 1.15],
  "op-": [-1.25, -0.25],
  "op+": [-1.25, -0.85],
  vn: [-1.25, -1.45],
  vp: [1.05, -0.25],
  out: [1.05, -0.85],
  gnd: [2.2, -2.2],
});
const COLORS = {
  input: "#d1a72a",
  feedback: "#2f8961",
  positive: "#bf4b43",
  negative: "#397fac",
  ground: "#424a50",
  output: "#c66b44",
  other: "#8759a6",
};
export function wireColor(a, b, configuration = "inverting") {
  if (configuration === "subtractor" && [a, b].includes("op+")) return "#856aa2";
  if ([a, b].some((v) => ["plus+", "vp"].includes(v))) return COLORS.positive;
  if ([a, b].some((v) => ["minus-", "vn"].includes(v))) return COLORS.negative;
  if ([a, b].some((v) => ["gnd", "plus-", "signal-"].includes(v)) || (["inverting", "adder"].includes(configuration) && [a, b].includes("op+")))
    return COLORS.ground;
  if ([a, b].some((v) => ["rfa", "rfb"].includes(v))) return COLORS.feedback;
  return COLORS.input;
}
export function wireRoute(a, b, lane = 0, configuration = "inverting") {
  const groundFor = (id) =>
    ({ "plus-": [-3.9, -2.2], "signal-": [-3.5, -2.2], "op+": [-1.25, -2.2], rina: [-3.9, -2.2], rf2b: [2.2, -2.2] })[id] || POSITIONS.gnd;
  const start = a === "gnd" ? groundFor(b) : POSITIONS[a],
    end = b === "gnd" ? groundFor(a) : POSITIONS[b];
  if (!start || !end) return [];
  const routes = {
    "plus+|vp": [
      [-3.65, 2.12],
      [2.35, 2.12],
      [2.35, -0.25],
    ],
    "gnd|plus-": [
      [-4.13, -2.2],
      [-4.13, 2.02],
      [-2.55, 2.02],
    ],
    "minus-|vn": [
      [2.52, 2.38],
      [2.52, -1.75],
      [-1.25, -1.75],
    ],
    "gnd|signal-": [[-5.6, -2.2]],
    "out|rfb": [
      [1.43, -0.85],
      [1.43, 1.15],
    ],
    "op-|rfa": [
      [-1.65, -0.25],
      [-1.65, 1.15],
    ],
    "gnd|op+": [
      [-1.58, -2.2],
      [-1.58, -0.85],
    ],
    "op-|rinb": [],
    "rina|signal+": [],
    "gnd|rina": [[-3.9, -0.25]],
    "op+|signal+": [
      [-1.72, -0.85],
      [-4.05, -0.85],
    ],
    "rin2a|signal2+": [
      [-4.35, -1.45],
      [-4.35, 0.15],
    ],
    "op-|rin2b": [
      [-1.85, -0.25],
      [-1.85, -1.45],
    ],
    "op+|rin2b": [
      [-1.9, -0.85],
      [-1.9, -1.45],
    ],
    "op+|rf2a": [
      [-1.78, -0.85],
      [-1.78, 0.55],
      [1.15, 0.55],
    ],
    "gnd|rf2b": [
      [2.7, -2.2],
      [2.7, 0.9],
    ],
  };
  if (configuration === "subtractor")
    routes["minus-|vn"] = [
      [2.92, 2.38],
      [2.92, -1.77],
      [-1.25, -1.77],
    ];
  const key = [a, b].sort().join("|"),
    reverse = a > b,
    mids = routes[key];
  if (key === "op+|rf2a") {
    // A raised, visibly arched divider jumper crosses two unrelated nets.
    // Its tips stay on the chosen sockets; the overpasses are mechanical only.
    const path = [
      [-1.25, -0.85, 0.25],
      [-1.78, -0.85, 0.35],
      [-1.78, -0.6, 0.35],
      [-1.78, -0.43, 0.95],
      [-1.78, -0.15, 0.95],
      [-1.78, 0.04, 0.35],
      [-1.78, 0.55, 0.35],
      [-1.73, 0.55, 0.35],
      [-1.65, 0.55, 0.86],
      [-1.49, 0.55, 0.35],
      [-1.2, 0.55, 0.35],
      [-0.5, 0.55, 0.35],
      [0.5, 0.55, 0.35],
      [1.15, 0.55, 0.35],
      [1.15, 0.9, 0.25],
    ];
    return reverse ? path.reverse() : path;
  }
  if (key === "rin2a|signal2+") {
    const source = jackPosition("signal2+");
    const path = [[...POSITIONS.rin2a, 0.25], [-4.08, -1.45, 0.35], [-4.08, source[1], source[2]], source];
    return reverse ? path.reverse() : path;
  }
  const startZ = JACKS[a] ? jackPosition(a)[2] : 0.25,
    endZ = JACKS[b] ? jackPosition(b)[2] : 0.25;
  if (mids)
    return [start, ...(reverse ? [...mids].reverse() : mids), end].map(([x, y], i) => [
      x,
      y,
      i === 0 ? startZ : i === mids.length + 1 ? endZ : key === "op+|rf2a" ? 0.57 : 0.35,
    ]);
  return [start, [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + 0.16 + lane * 0.04], end].map(([x, y], i) => [
    x,
    y,
    i === 0 ? startZ : i === 2 ? endZ : 0.68,
  ]);
}
export function mountAmplifierScene(host, callbacks) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#e7edf0");
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  const homeDirection = new THREE.Vector3(0.025, -0.48, 0.877).normalize();
  camera.position.copy(homeDirection).multiplyScalar(13);
  camera.lookAt(0, 0, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.append(renderer.domElement);
  renderer.domElement.setAttribute(
    "aria-label",
    "Interactive 3D amplifier bench. Drag between labeled terminals; drag Rin or Rf to adjust. Keyboard controls above operate the same experiment."
  );
  renderer.domElement.setAttribute("role", "img");
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = false;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.target.set(0, 0, 0);
  controls.update();
  scene.add(new THREE.HemisphereLight("#ffffff", "#b7c8d1", 3.0));
  const light = new THREE.DirectionalLight("#fff9ec", 1.9);
  light.position.set(-3, 6, 15);
  light.castShadow = true;
  light.shadow.mapSize.set(2048, 2048);
  Object.assign(light.shadow.camera, { left: -8, right: 8, top: 6, bottom: -6 });
  light.shadow.bias = -0.0006;
  light.shadow.radius = 4;
  light.shadow.blurSamples = 8;
  scene.add(light);
  const root = new THREE.Group();
  scene.add(root);
  const pickables = [],
    sockets = new Map(),
    dials = new Map(),
    surfaces = new Map(),
    instruments = new Map(),
    accessibleControls = [],
    conditionalObjects = new Map();
  let state = null,
    reading = null;
  const material = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0.05, ...extra });
  function box(x, y, z, w, h, d, color, r = 0.05, parent = root) {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), material(color));
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function disc(x, y, z, r, color, parent = root, depth = 0.06) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, depth, 32), material(color, { metalness: 0.25 }));
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function surface(id, x, y, z, w, h, draw, pixels = 1000) {
    const canvas = document.createElement("canvas");
    canvas.width = pixels;
    canvas.height = Math.round((pixels * h) / w);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texture, transparent: true }));
    mesh.position.set(x, y, z);
    root.add(mesh);
    const entry = { canvas, context: canvas.getContext("2d"), texture, mesh, draw };
    surfaces.set(id, entry);
    return entry;
  }
  function paint(id) {
    const entry = surfaces.get(id);
    if (!entry) return;
    const { canvas, context: c } = entry;
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.scale(canvas.width / 1000, canvas.width / 1000);
    entry.draw(c, 1000, (canvas.height * 1000) / canvas.width);
    c.restore();
    entry.texture.needsUpdate = true;
  }
  function label(id, text, x, y, z, w = 0.7, h = 0.22, color = "#314751", size = 38) {
    surface(
      id,
      x,
      y,
      z,
      w,
      h,
      (c, W, H) => {
        const caption = typeof text === "function" ? text() : text;
        c.fillStyle = color;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = `600 ${Math.min(H * 0.8, 1000 / (caption.length * 0.57))}px Arial`;
        c.fillText(caption, W / 2, H / 2);
      },
      512
    );
    paint(id);
  }
  // A restrained common work surface supports the equipment; the breadboard remains the focus.
  box(0, 0.1, -0.65, 13.1, 6.85, 0.22, "#9aaeb6", 0.15).userData.frame = false;
  box(0, 0.1, -0.492, 12.95, 6.7, 0.035, "#bcc9ce", 0.1).userData.frame = false;
  // A close physical teaching board: perforations are mounting holes, every contact is isolated.
  box(-0.95, -0.35, -0.28, 7.35, 5.05, 0.22, "#c8d2d8", 0.13);
  box(-0.95, -0.3, -0.12, 7.2, 4.9, 0.19, "#f8f9f6", 0.12);
  const holes = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.023, 0.023, 0.014, 8), material("#a0a9a9"), 1400);
  const dummy = new THREE.Object3D();
  let hi = 0;
  for (let row = 0; row < 28; row++)
    for (let col = 0; col < 48; col++) {
      if (row === 13 || row === 14) continue;
      dummy.position.set(-4.36 + col * 0.146, -2.52 + row * 0.161, -0.012);
      dummy.rotation.x = Math.PI / 2;
      dummy.updateMatrix();
      holes.setMatrixAt(hi++, dummy.matrix);
    }
  holes.count = hi;
  root.add(holes);
  box(-0.95, -0.3, -0.005, 6.85, 0.07, 0.012, "#e0e4df", 0.01);
  label("board-title", "741 TEACHING BREADBOARD", -0.85, 2.02, 0.015, 3.6, 0.18, "#52646c", 16);
  label("board-rule", "Holes isolated · labeled GND sockets share the common rail", -0.85, -2.51, 0.015, 6.5, 0.18, "#52646c", 11);
  for (const x of [-4.38, 2.48]) for (const y of [-2.55, 1.95]) disc(x, y, 0.035, 0.046, "#a5afb5", root, 0.012);
  // Actual DIP-8 pin order, viewed from above. Teaching contacts extend the five used leads.
  box(-0.1, -0.55, 0.13, 1.45, 2.06, 0.23, "#242e35", 0.07);
  for (let i = 0; i < 4; i++) {
    const y = 0.35 - i * 0.6;
    box(-0.98, y, 0.08, 0.48, 0.13, 0.08, "#afb8bf", 0.02);
    box(0.78, y, 0.08, 0.48, 0.13, 0.08, "#afb8bf", 0.02);
  }
  disc(-0.1, 0.47, 0.26, 0.15, "#121d24", root, 0.012);
  disc(-0.54, 0.25, 0.26, 0.038, "#a5b8c3", root, 0.012);
  surface(
    "chip",
    -0.1,
    -0.66,
    0.26,
    1.35,
    1.46,
    (c, W, H) => {
      c.fillStyle = "#f3f7f9";
      c.font = "bold 128px Arial";
      c.textAlign = "center";
      c.fillText("U1 · 741", W / 2, 160);
      c.strokeStyle = "#eef6f7";
      c.lineWidth = 18;
      c.beginPath();
      c.moveTo(340, 310);
      c.lineTo(340, 720);
      c.lineTo(690, 515);
      c.closePath();
      c.stroke();
      c.font = "bold 130px Arial";
      c.fillText("−", 285, 440);
      c.fillText("+", 285, 650);
      c.font = "60px Arial";
      c.fillStyle = "#a9bcc7";
      c.fillText("DIP-8 · top view", 500, 940);
    },
    700
  );
  paint("chip");
  for (const [text, x, y] of [
    ["1 NULL", -0.55, 0.35],
    ["2 −IN", -0.55, -0.25],
    ["3 +IN", -0.55, -0.85],
    ["4 −V", -0.55, -1.45],
    ["8 NC", 0.35, 0.35],
    ["7 +V", 0.35, -0.25],
    ["6 OUT", 0.35, -0.85],
    ["5 NULL", 0.35, -1.45],
  ])
    label(`pin-${text}`, text, x, y, 0.28, 0.63, 0.2, "#ffffff", 26);
  // Each physical resistor has its own value; names follow the selected circuit role.
  function pot(id, x, y, color) {
    const before = root.children.length;
    box(x, y + 0.1, 0.11, 1.1, 1.18, 0.2, "#e3e9ec");
    disc(x, y - 0.12, 0.29, 0.3, "#263b46", root, 0.2);
    const knob = disc(x, y - 0.12, 0.405, 0.26, color, root, 0.03);
    const tick = box(x, y + 0.07, 0.43, 0.035, 0.17, 0.025, "#e8f4f5", 0.009);
    dials.set(id, { knob, tick, x, y: y - 0.12 });
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.43), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(x, y - 0.12, 0.4);
    hit.userData = { kind: "dial", id };
    root.add(hit);
    pickables.push(hit);
    surface(
      id,
      x,
      y + 0.48,
      0.26,
      1.1,
      0.3,
      (c, W, H) => {
        c.fillStyle = "#173542";
        c.fillRect(0, 0, W, H);
        c.fillStyle = "#e4f5f7";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = "500 152px monospace";
        c.fillText(
          `${resistorRoles(state?.params.configuration).find((r) => r.key === id)?.name || id} ${(state?.params[id] || 0) / 1000} kΩ`,
          W / 2,
          H / 2,
          960
        );
      },
      800
    );
    conditionalObjects.set(id, root.children.slice(before));
  }
  pot("rin", -2.7, -0.25, "#397caf");
  pot("rf", -0.72, 1.15, "#41886a");
  pot("rin2", -2.7, -1.45, "#ae852e");
  pot("rf2", 1.8, 0.9, "#65739f");
  // Instrument cases are actual modeled volumes; faces use one high-resolution live texture.
  function instrument(id, draw) {
    const { x, y, w, h } = INSTRUMENTS[id];
    const group = new THREE.Group();
    group.position.set(x, y - h / 2, 0.23);
    group.rotation.x = 0.48;
    root.add(group);
    instruments.set(id, { group, w, h });
    box(0, h / 2, -0.42, w + 0.12, h + 0.12, 0.92, "#7b929e", 0.11, group);
    box(0, h / 2, 0.06, w, h, 0.14, "#e8edef", 0.07, group);
    for (const fx of [-w * 0.37, w * 0.37]) box(fx, 0.04, -0.35, 0.25, 0.16, 0.85, "#293c45", 0.035, group);
    const face = surface(id, 0, h / 2, 0.138, w - 0.17, h - 0.16, draw, 1400);
    group.add(face.mesh);
    for (const sx of [-w / 2 + 0.09, w / 2 - 0.09]) for (const sy of [0.1, h - 0.1]) disc(sx, sy, 0.15, 0.025, "#5b707b", group, 0.012);
  }
  function physicalButton(instrumentId, id, label, x, y, color = "#38596c") {
    const { group } = instruments.get(instrumentId);
    const key = box(x, y, 0.2, 0.3, 0.19, 0.11, color, 0.035, group);
    key.userData = { kind: "button", id };
    pickables.push(key);
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.18), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(x, y, 0.25);
    hit.userData = { kind: "button", id };
    group.add(hit);
    pickables.push(hit);
    const el = document.createElement("button");
    el.className = "amp-physical-control";
    el.textContent = label;
    el.setAttribute("aria-label", label);
    el.addEventListener("click", () => callbacks[id]?.());
    host.append(el);
    accessibleControls.push({ el, object: key });
  }
  function generatorDial(id, x, y) {
    const radius = id === "amplitude2" ? 0.82 : 1;
    const { group } = instruments.get("generator");
    const before = group.children.length;
    disc(x, y, 0.22, 0.22 * radius, "#213d4d", group, 0.18);
    const knob = disc(x, y, 0.32, 0.19 * radius, "#5b7380", group, 0.04);
    const tick = box(x, y + 0.13, 0.35, 0.022, 0.11, 0.018, "#f5f7ed", 0.005, group);
    dials.set(id, { knob, tick, x, y });
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.29), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(x, y, 0.29);
    hit.userData = { kind: "dial", id };
    group.add(hit);
    pickables.push(hit);
    if (id === "amplitude2") conditionalObjects.set(id, group.children.slice(before));
  }
  function jack(id, color) {
    const [instrumentId, x, y] = JACKS[id],
      { group } = instruments.get(instrumentId);
    const before = group.children.length;
    disc(x, y, 0.24, 0.09, "#869da7", group, 0.16);
    disc(x, y, 0.335, 0.065, color, group, 0.04);
    disc(x, y, 0.36, 0.03, "#142731", group, 0.015);
    if (id === "signal2+") conditionalObjects.set(id, group.children.slice(before));
  }

  instrument("supply", (c, W, H) => {
    c.fillStyle = "#344954";
    c.font = "bold 54px Arial";
    c.fillText("DUAL DC SUPPLY", 24, 65);
    c.font = "42px Arial";
    c.textAlign = "right";
    c.fillStyle = state?.params.powered ? "#1d7654" : "#65737d";
    c.fillText(state?.params.powered ? "● ON" : "○ OFF", 975, 65);
    c.textAlign = "center";
    for (const [i, v, color] of [
      [0, `+${state?.params.rail || 12}.0`, "#c74e45"],
      [1, "0.0", "#c9d7df"],
      [2, `−${state?.params.rail || 12}.0`, "#317aa6"],
    ]) {
      const x = 180 + i * 320;
      c.fillStyle = "#182b35";
      c.fillRect(x - 140, 95, 280, 100);
      c.fillStyle = state?.params.powered ? color : "#94a4ae";
      c.font = "bold 64px monospace";
      c.fillText(state?.params.powered ? `${v} V` : "OFF", x, 170, 260);
      c.fillStyle = i === 1 ? "#465a65" : color;
      c.font = "44px Arial";
      c.fillText(["+V", "GND", "−V"][i], x, 255);
    }
  });
  instrument("generator", (c, W, H) => {
    c.fillStyle = "#344954";
    c.font = "bold 74px Arial";
    c.textAlign = "center";
    const multi = state && transfer(state).multi;
    if (multi) {
      c.font = "bold 57px Arial";
      c.fillText("FUNCTION GENERATOR", 500, 100);
      c.font = "58px monospace";
      c.fillText(state.params.waveform === "dc" ? "DC" : `${state.params.frequency} Hz · ${state.params.waveform.toUpperCase()}`, 500, 185);
    } else {
      c.fillText("FUNCTION", 500, 100);
      c.fillText("GENERATOR", 500, 185);
    }
    c.fillStyle = "#182d37";
    c.fillRect(30, 235, 940, multi ? 190 : 400);
    c.fillStyle = "#efcc62";
    c.font = multi ? "bold 76px monospace" : "bold 120px monospace";
    if (multi) {
      const unit = state.params.waveform === "dc" ? "V" : "Vpp";
      c.fillText(`1: ${state.params.amplitude} ${unit}`, 500, 315);
      c.fillText(`2: ${state.params.amplitude2} ${unit}`, 500, 395);
    } else c.fillText(state?.params.waveform === "dc" ? `${state.params.amplitude} V` : `${state?.params.amplitude ?? 1} Vpp`, 500, 395);
    c.font = "80px monospace";
    if (!multi) c.fillText(state?.params.waveform === "dc" ? "DC" : `${state?.params.frequency || 1000} Hz`, 500, 535);
    c.fillStyle = "#536b78";
    c.font = "68px Arial";
    if (!multi) c.fillText((state?.params.waveform || "sine").toUpperCase(), 500, 680);
    if (multi) {
      c.font = "40px Arial";
      c.fillText("AMP 2", 250, 480);
      c.font = "32px Arial";
      c.fillText("WAVE", 500, 820);
    }
    c.font = "40px Arial";
    c.fillText(multi ? "AMP 1" : "AMPLITUDE", 250, 750);
    c.fillText(state?.params.waveform === "dc" ? "INACTIVE" : multi ? "FREQ" : "FREQUENCY", 750, 750);
  });
  instrument("meter", (c, W, H) => {
    c.fillStyle = "#344954";
    c.font = "bold 47px Arial";
    c.fillText("MULTIMETER", 25, 60);
    c.fillStyle = "#182d37";
    c.fillRect(20, 92, 960, 220);
    c.fillStyle = reading?.meter.mean !== null ? "#d0e5c3" : "#9daeb4";
    c.font = "bold 105px monospace";
    c.textAlign = "center";
    const v = state?.params.waveform === "dc" ? reading?.meter.mean : reading?.meter.rms;
    c.fillText(state?.params.meterOn === false ? "OFF" : Number.isFinite(v) ? `${v.toFixed(3)} V` : "— V", 500, 230);
    c.font = "40px Arial";
    c.fillStyle = "#b7c8cc";
    c.fillText(state?.params.waveform === "dc" ? "DC · V minus COM" : "AC + DC · true RMS", 500, 288);
    c.textAlign = "left";
    c.fillStyle = "#536b78";
    c.font = "38px Arial";
    c.fillText("COM", 40, 400);
    c.fillText("V", 875, 400);
  });
  instrument("scope", (c, W, H) => {
    c.fillStyle = "#344954";
    c.font = "bold 44px Arial";
    c.fillText("OSCILLOSCOPE", 25, 57);
    c.font = "37px Arial";
    c.textAlign = "right";
    c.fillText(state?.running ? "● RUN" : "HOLD", 975, 57);
    c.textAlign = "left";
    const x = 115,
      y = 155,
      w = 785,
      h = 410;
    c.fillStyle = "#102a38";
    c.fillRect(18, 90, 964, 640);
    c.strokeStyle = "#294856";
    c.lineWidth = 1.8;
    for (let i = 0; i <= 10; i++) {
      c.beginPath();
      c.moveTo(x + (i * w) / 10, y);
      c.lineTo(x + (i * w) / 10, y + h);
      c.stroke();
    }
    for (let i = 0; i <= 8; i++) {
      c.beginPath();
      c.moveTo(x, y + (i * h) / 8);
      c.lineTo(x + w, y + (i * h) / 8);
      c.stroke();
    }
    const { voltsPerDivision: scale, extent, timeFactor, timeUnit } = scopeAxes(reading);
    c.strokeStyle = "#8097a3";
    c.beginPath();
    c.moveTo(x, y + h / 2);
    c.lineTo(x + w, y + h / 2);
    c.stroke();
    c.fillStyle = "#c1d1d8";
    c.font = "38px monospace";
    c.textAlign = "right";
    for (const v of [extent, 0, -extent]) c.fillText(`${v}`, x - 12, y + h / 2 - ((v / extent) * h) / 2 + 10);
    c.textAlign = "center";
    for (let i = 0; i <= 2; i++) c.fillText(displayNumber(((reading?.duration || 0.002) * timeFactor * i) / 2), x + (i * w) / 2, y + h + 45);
    c.fillText(`Time (${timeUnit})`, x + w / 2, y + h + 103);
    c.textAlign = "left";
    c.fillText(`${scale} V/div`, x, 130);
    for (const [channel, color] of [
      ["ch1", "#eed06b"],
      ["ch2", "#6fd2de"],
    ]) {
      const points = reading?.points[channel] || [];
      c.strokeStyle = color;
      c.lineWidth = 5;
      c.beginPath();
      for (let i = 0; i < points.length; i++) {
        const [t, v] = points[i];
        const px = x + (t / (reading.duration || 0.002)) * w,
          py = y + h / 2 - ((v / extent) * h) / 2;
        i ? c.lineTo(px, py) : c.moveTo(px, py);
      }
      c.stroke();
    }
    for (const [id, color, x] of [
      ["ch1", "#a7892b", 35],
      ["ch2", "#25869a", 515],
    ]) {
      c.fillStyle = color;
      c.font = "34px Arial";
      c.fillText(`${id.toUpperCase()} · ${reading?.channelLabels[id] || "Unconnected"}`, x, 778, 440);
      c.font = "bold 40px monospace";
      c.fillText(
        `${
          Number.isFinite(reading?.channelStats[id][state?.params.waveform === "dc" ? "mean" : "vpp"])
            ? reading.channelStats[id][state?.params.waveform === "dc" ? "mean" : "vpp"].toFixed(2)
            : "—"
        } ${state?.params.waveform === "dc" ? "V DC" : "Vpp"}`,
        x,
        826,
        440
      );
    }
    if (reading?.stale) {
      c.fillStyle = "#a46527";
      c.font = "31px Arial";
      c.fillText("Held capture · settings changed", 35, 745, 930);
    }
  });
  for (const [id, text, x, w] of [
    ["generator-ground", "GND", -0.24, 0.4],
    ["generator-output", () => (state && transfer(state).multi ? "Vin1" : "Vin"), 0.23, 0.32],
  ]) {
    label(id, text, x, 0.1, 0.164, w, 0.15, "#21394a", 30);
    instruments.get("generator").group.add(surfaces.get(id).mesh);
  }
  generatorDial("amplitude2", -0.43, 0.98);
  label("generator-output2", "Vin2", 0.22, 1.05, 0.164, 0.34, 0.15, "#21394a");
  instruments.get("generator").group.add(surfaces.get("generator-output2").mesh);
  conditionalObjects.set("label-signal2+", [surfaces.get("generator-output2").mesh]);
  generatorDial("amplitude", -0.43, 0.48);
  generatorDial("frequency", 0.43, 0.48);
  physicalButton("generator", "waveform", "Change generator waveform", 0, 0.83, "#577b87");
  physicalButton("supply", "power", "Switch dual supply", 1.47, 0.93, "#426958");
  physicalButton("meter", "meterPower", "Switch multimeter", 1.37, 0.22, "#3d5a6a");
  physicalButton("scope", "scope", "Run or hold oscilloscope", 1.08, 3.24, "#396b7c");
  physicalButton("scope", "scopeAuto", "Restore scope bench view", 1.48, 3.24, "#66808c");
  for (const [id, color] of Object.entries({
    black: "#344a54",
    red: "#bb5547",
    ch1: "#c7a43d",
    ch1Ground: "#646a53",
    ch2: "#4b9eaf",
    ch2Ground: "#527983",
    "plus+": "#bf4b43",
    "plus-": "#414d54",
    "minus-": "#397fac",
    "signal+": "#c9a638",
    "signal-": "#414d54",
    "signal2+": "#ae852e",
  }))
    jack(id, color);
  // The explicitly labeled common rail is one electrical node, exposed at useful local contacts.
  box(-0.85, -2.2, 0.055, 6.5, 0.18, 0.045, "#c2ccd1", 0.02);
  label("ground-rail-title", "GND COMMON RAIL", -0.3, -1.98, 0.1, 2.1, 0.16, "#48616e", 20);
  for (const x of [-3.9, -3.5, -1.25, 0.8, 1.3, 1.8]) {
    disc(x, -2.2, 0.16, 0.105, "#87969c");
    disc(x, -2.2, 0.205, 0.075, "#414d54");
    disc(x, -2.2, 0.24, 0.037, "#111f28", root, 0.016);
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.15), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.set(x, -2.2, 0.25);
    hit.userData = { kind: "terminal", id: "gnd" };
    root.add(hit);
    pickables.push(hit);
  }
  // Visible isolated terminal sockets; ring targeting is larger than the metal opening.
  for (const [id, [x, y]] of Object.entries(POSITIONS)) {
    const color =
      id === "gnd" || id === "plus-" || id === "signal-"
        ? "#414d54"
        : id === "vp" || id === "plus+"
          ? "#bf4b43"
          : id === "vn" || id === "minus-"
            ? "#397fac"
            : id === "out"
              ? "#c66b44"
              : id.startsWith("rf")
                ? "#2f8961"
                : "#c9a638";
    const endpoint = JACKS[id] ? jackPosition(id) : [x, y, 0.25];
    const before = root.children.length;
    if (!JACKS[id]) {
      disc(x, y, 0.16, 0.115, "#87969c");
      disc(x, y, 0.205, 0.083, color);
      disc(x, y, 0.24, 0.039, "#111f28", root, 0.016);
    }
    if (["rin2a", "rin2b", "rf2a", "rf2b"].includes(id)) conditionalObjects.set(id, root.children.slice(before));
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.135, 0.175, 32),
      new THREE.MeshBasicMaterial({ color: "#1c77bf", side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    ring.position.fromArray(endpoint).add(new THREE.Vector3(0, 0, 0.02));
    if (JACKS[id]) ring.rotation.x = 0.48;
    root.add(ring);
    ring.visible = false;
    sockets.set(id, ring);
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.18), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.fromArray(endpoint);
    hit.userData = { kind: "terminal", id };
    root.add(hit);
    pickables.push(hit);
  }
  for (const [id, text, x, y] of [
    ["rina", "A", -3.35, -0.57],
    ["rinb", "B", -2.05, -0.57],
    ["rin2a", "A", -3.35, -1.77],
    ["rin2b", "B", -2.05, -1.77],
    ["rf2a", "A", 1.15, 0.58],
    ["rf2b", "B", 2.45, 0.58],
    ["rfa", "A", -1.5, 0.83],
    ["rfb", "B", 0.05, 0.83],
    ["gnd", "GND", 2.2, -1.94],
    ["out", "Vout", 1.72, -0.52],
  ]) {
    label(`terminal-${id}`, text, x, y, 0.09, 0.65, 0.2, "#344e5d", 27);
    if (["rin2a", "rin2b", "rf2a", "rf2b"].includes(id)) conditionalObjects.set(`label-${id}`, [surfaces.get(`terminal-${id}`).mesh]);
  }
  const probeHomes = Object.fromEntries(Object.keys(PROBES).map((id) => [id, jackPosition(id)]));
  const probeColors = { red: "#d06750", black: "#43525b", ch1: "#cfac3f", ch1Ground: "#77745c", ch2: "#46a8b9", ch2Ground: "#577c82" };
  const probeGroup = new THREE.Group();
  root.add(probeGroup);
  const wires = new THREE.Group();
  root.add(wires);
  const dragGroup = new THREE.Group();
  dragGroup.userData.frame = false;
  root.add(dragGroup);
  const targetRing = new THREE.Mesh(
    new THREE.RingGeometry(0.19, 0.225, 48),
    new THREE.MeshBasicMaterial({ color: "#23866b", side: THREE.DoubleSide, depthTest: false })
  );
  targetRing.renderOrder = 30;
  targetRing.visible = false;
  targetRing.userData.frame = false;
  root.add(targetRing);
  const pointerNote = document.createElement("div");
  pointerNote.className = "amp-pointer-note";
  pointerNote.hidden = true;
  host.append(pointerNote);
  const dragStatus = document.createElement("div");
  dragStatus.className = "amp-drag-status";
  dragStatus.setAttribute("role", "status");
  dragStatus.hidden = true;
  host.append(dragStatus);
  let gesture = null;
  const wirePaths = new Map(),
    probePlacements = new Map();
  let renderedSignature = "";
  function tube(points, color, r = 0.029, parent = wires) {
    if (points.length < 2) return;
    const curve = cableCurve(points);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, r, 8, false), material(color, { roughness: 0.36 }));
    mesh.castShadow = false;
    parent.add(mesh);
    return mesh;
  }
  function cableHit(route, data, parent) {
    const hit = new THREE.Mesh(new THREE.TubeGeometry(cableCurve(route), 80, 0.085, 6, false), new THREE.MeshBasicMaterial({ visible: false }));
    hit.userData = { kind: "cable", ...data, route };
    parent.add(hit);
    pickables.push(hit);
  }
  function activeCable(kind, id) {
    return (
      gesture?.moved &&
      ((gesture.kind === kind && gesture.id === id) || (gesture.kind === "cable" && gesture.cableKind === kind && gesture.id === id))
    );
  }
  function disposeGroup(group) {
    while (group.children.length) {
      const o = group.children.pop();
      o.traverse((child) => {
        child.geometry?.dispose();
        child.material?.dispose();
      });
      o.parent = null;
    }
  }
  function renderLeads() {
    const signature = JSON.stringify([
      state.params.configuration,
      state.wires,
      state.probes,
      state.selection.wire,
      state.cableLayout,
      gesture?.moved ? [gesture.kind, gesture.id] : null,
    ]);
    if (signature === renderedSignature) return;
    renderedSignature = signature;
    disposeGroup(wires);
    disposeGroup(probeGroup);
    for (let i = pickables.length - 1; i >= 0; i--) if (["wire", "probe", "cable"].includes(pickables[i].userData.kind)) pickables.splice(i, 1);
    state.wires.forEach(([a, b], index) => {
      const route = state.cableLayout.wires[index] || seedCable(wireRoute(a, b, index, state.params.configuration));
      wirePaths.set(index, route);
      if (!activeCable("wire", index)) {
        tube(
          route,
          state.selection.wire === index ? "#f0a234" : wireColor(a, b, state.params.configuration),
          state.selection.wire === index ? 0.05 : 0.035
        );
        cableHit(route, { cableKind: "wire", id: index }, wires);
      }
      for (const [end, point] of [
        [0, route[0]],
        [1, route.at(-1)],
      ]) {
        if (gesture?.moved && gesture.kind === "wire" && gesture.id === index && gesture.end === end) continue;
        const plug = disc(point[0], point[1], point[2] + 0.055, 0.069, wireColor(a, b, state.params.configuration), wires, 0.1);
        disc(point[0], point[1], point[2] + 0.112, 0.034, "#d3dce0", wires, 0.012);
        plug.userData = { kind: "wire", id: index, end };
        pickables.push(plug);
      }
    });
    for (const [id, home] of Object.entries(probeHomes)) {
      const target = state.probes[id],
        saved = state.cableLayout.probes[id];
      const groundX = { black: 0.8, ch1Ground: 1.3, ch2Ground: 1.8 }[id] ?? 2.2;
      const placed = saved?.target === target && saved.contact && saved.direction;
      const contact = new THREE.Vector3(
        ...(placed
          ? saved.contact
          : target === "gnd"
            ? [groundX, -2.2, 0.25]
            : target && JACKS[target]
              ? jackPosition(target)
              : target
                ? [...POSITIONS[target], 0.25]
                : [home[0] - 0.22, home[1] - 0.42, 0.3])
      );
      const direction = new THREE.Vector3(
        ...(placed
          ? saved.direction
          : !target
            ? [0.96, 0, 0.26]
            : target === "out"
              ? id === "red"
                ? [0.85, -0.28, 0.35]
                : [0.43, -0.85, 0.35]
              : target === "signal2+"
                ? [1, 0, 0.35]
                : JACKS[target]
                  ? [0.2, -0.9, 0.35]
                  : target === "gnd"
                    ? [0.05, -0.94, 0.3]
                    : target.startsWith("op") || target === "vn"
                      ? [-0.9, -0.1, 0.35]
                      : [0.35, -0.85, 0.35])
      ).normalize();
      const orientation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      const handleCenter = contact.clone().addScaledVector(direction, 0.44),
        cableEnd = contact.clone().addScaledVector(direction, 0.65),
        c = probeColors[id];
      const [x, y, z] = cableEnd.toArray();
      let route;
      if (saved?.route) route = moveCableEnd(saved.route, 1, cableEnd.toArray());
      else {
        if (!target) route = [home, [home[0] + 0.4, home[1] - 0.2, home[2]], [x, y, z]];
        else if (id === "red") route = [home, [6.6, home[1], home[2]], [6.6, 1.1, 0.3], [2.68, 1.1, 0.3], [2.68, y + 0.25, 0.4], [x, y, z]];
        else if (id === "black") route = [home, [2.83, home[1], home[2]], [2.83, -1.78, 0.4], [x, -1.78, 0.4], [x, y, z]];
        else if (id === "ch1") route = [home, [home[0], -3.18, 0.3], [-4.78, -3.18, 0.3], [-4.78, y + 0.25, 0.4], [x, y, z]];
        else
          route = [
            home,
            [home[0], -3.06 - (id === "ch2Ground" ? 0.12 : 0), 0.3],
            [2.57 + (id === "ch2" ? 0.12 : 0), -3.06 - (id === "ch2Ground" ? 0.12 : 0), 0.3],
            [x, -3.06 - (id === "ch2Ground" ? 0.12 : 0), 0.3],
            [x, y, z],
          ];
        route = seedCable(route);
      }
      probePlacements.set(id, { route, contact: contact.toArray(), direction: direction.toArray(), target });
      if (!activeCable("probe", id)) {
        tube(route, c, 0.026, probeGroup);
        cableHit(route, { cableKind: "probe", id }, probeGroup);
      }
      if (gesture?.moved && gesture.kind === "probe" && gesture.id === id) continue;
      const handle = box(handleCenter.x, handleCenter.y, handleCenter.z, 0.11, 0.38, 0.11, c, 0.025, probeGroup);
      handle.quaternion.copy(orientation);
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.004, 0.25, 12), material("#c6d4d9", { metalness: 0.7 }));
      tip.position.copy(contact).addScaledVector(direction, 0.125);
      tip.quaternion.copy(orientation);
      probeGroup.add(tip);
      const hit = new THREE.Mesh(new THREE.SphereGeometry(0.17), new THREE.MeshBasicMaterial({ visible: false }));
      hit.position.copy(handleCenter);
      hit.userData = { kind: "probe", id };
      probeGroup.add(hit);
      pickables.push(hit);
    }
  }
  for (const [id, text, x] of [
    ["probe-label-1", "CH1  ⏚", -0.99],
    ["probe-label-2", "CH2  ⏚", 0.96],
  ]) {
    label(id, text, x, 0.29, 0.16, 1.25, 0.16, id.endsWith("1") ? "#6c673b" : "#3f7e88", 22);
    instruments.get("scope").group.add(surfaces.get(id).mesh);
  }
  const raycaster = new THREE.Raycaster(),
    pointer = new THREE.Vector2();
  function pointerRay(e) {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, (-(e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
  }
  function hit(e, kind) {
    pointerRay(e);
    const hits = raycaster.intersectObjects(pickables, false);
    if (!kind)
      hits.sort(
        (a, b) =>
          Number(b.object.userData.kind === "wire" && b.object.userData.end !== undefined) -
          Number(a.object.userData.kind === "wire" && a.object.userData.end !== undefined)
      );
    const found = hits.find(
      (h) =>
        (!kind || h.object.userData.kind === kind) &&
        (h.object.userData.kind !== "terminal" || circuit(state).pins.some((p) => p.id === h.object.userData.id)) &&
        (h.object.userData.kind !== "dial" ||
          [
            ...resistorRoles(state.params.configuration).map((r) => r.key),
            "amplitude",
            "frequency",
            ...(transfer(state).multi ? ["amplitude2"] : []),
          ].includes(h.object.userData.id)) &&
        !(h.object.userData.kind === "dial" && h.object.userData.id === "frequency" && state.params.waveform === "dc")
    );
    if (!found) return null;
    const data = found.object.userData;
    let point = data.kind === "terminal" ? found.object.getWorldPosition(new THREE.Vector3()) : found.point;
    if (data.kind === "cable")
      point = cableCurve(data.route)
        .getPoints(120)
        .reduce((closest, p) => (p.distanceToSquared(found.point) < closest.distanceToSquared(found.point) ? p : closest));
    return { ...data, point };
  }
  function planePoint(e, z) {
    pointerRay(e);
    return raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), -z), new THREE.Vector3());
  }
  function endpointName(id) {
    return pinLabel(id, state.params.configuration);
  }
  function note(e, text, tone = "neutral") {
    pointerNote.textContent = text;
    pointerNote.dataset.tone = tone;
    pointerNote.hidden = !text;
    const r = host.getBoundingClientRect();
    pointerNote.style.left = `${Math.max(8, Math.min(e.clientX - r.left + 18, r.width - pointerNote.offsetWidth - 8))}px`;
    pointerNote.style.top = `${Math.max(8, Math.min(e.clientY - r.top - 42, r.height - pointerNote.offsetHeight - 8))}px`;
  }
  function highlight(target, valid = true) {
    targetRing.visible = !!target;
    if (!target) return;
    targetRing.position.copy(target.point).add(new THREE.Vector3(0, 0, 0.06));
    targetRing.rotation.x = JACKS[target.id] ? 0.48 : 0;
    targetRing.material.color.set(valid ? "#18816a" : "#b76b32");
  }
  function destination(point) {
    // Aim the actual held tip, including its grip offset, rather than the mouse cursor.
    const projected = point.clone().project(camera),
      r = renderer.domElement.getBoundingClientRect();
    let target = null,
      nearest = 15;
    const pins = circuit(state).pins.map((p) => p.id);
    for (const object of pickables) {
      if (object.userData.kind !== "terminal" || !pins.includes(object.userData.id)) continue;
      const p = object.getWorldPosition(new THREE.Vector3()),
        screen = p.clone().project(camera);
      const distance = Math.hypot(((screen.x - projected.x) * r.width) / 2, ((screen.y - projected.y) * r.height) / 2);
      if (distance < nearest) {
        nearest = distance;
        target = { id: object.userData.id, point: p };
      }
    }
    if (!target) return { target: null, valid: false };
    const g = gesture;
    if (g.kind === "probe") return { target, valid: true };
    const from = g.kind === "wire" ? g.fixedId : g.id;
    const duplicate = state.wires.some(
      ([a, b], i) => !(g.kind === "wire" && i === g.id) && ((a === from && b === target.id) || (b === from && a === target.id))
    );
    return { target, valid: target.id !== from && !duplicate };
  }
  function showHeld(e) {
    const g = gesture,
      free = planePoint(e, g.dragZ);
    if (!free) return;
    free.add(g.pointerOffset);
    disposeGroup(dragGroup);
    if (g.kind === "cable") {
      g.route = bendCable(g.baseRoute, g.knot, free.toArray());
      tube(g.route, g.color, g.cableKind === "probe" ? 0.026 : 0.035, dragGroup);
      const grip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 10), material(g.color, { emissive: g.color, emissiveIntensity: 0.3 }));
      grip.position.copy(free);
      dragGroup.add(grip);
      targetRing.visible = false;
      note(e, "Shape cable · both endpoints stay fixed");
      dragStatus.textContent = "Rearranging cable · release keeps this shape · Esc to cancel";
    } else {
      const drop = destination(free),
        contact = drop.valid ? drop.target.point.clone() : free;
      g.drop = drop;
      if (g.kind === "terminal") {
        const traced = traceCable(g.trail, free.toArray());
        g.trail = traced.trail;
        g.route = clearInstrumentFaces(moveCableEnd(traced.route, 1, contact.toArray()));
      } else if (g.kind === "wire") g.route = moveCableEnd(g.baseRoute, g.end, contact.toArray());
      else {
        const direction = new THREE.Vector3(...g.placement.direction);
        const orientation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        const center = contact.clone().addScaledVector(direction, 0.44);
        const handle = box(center.x, center.y, center.z, 0.11, 0.38, 0.11, g.color, 0.025, dragGroup);
        handle.quaternion.copy(orientation);
        const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.004, 0.25, 12), material("#c6d4d9", { metalness: 0.7 }));
        tip.position.copy(contact).addScaledVector(direction, 0.125);
        tip.quaternion.copy(orientation);
        dragGroup.add(tip);
        g.route = moveCableEnd(g.baseRoute, 1, contact.clone().addScaledVector(direction, 0.65).toArray());
        g.placement = { ...g.placement, contact: contact.toArray(), route: g.route };
      }
      tube(g.route, g.color, g.kind === "probe" ? 0.026 : 0.035, dragGroup);
      if (g.kind !== "probe") {
        disc(contact.x, contact.y, contact.z + 0.055, 0.069, g.color, dragGroup, 0.1);
        disc(contact.x, contact.y, contact.z + 0.112, 0.034, "#d3dce0", dragGroup, 0.012);
      }
      highlight(drop.target, drop.valid);
      note(
        e,
        drop.target
          ? drop.valid
            ? `${g.kind === "probe" ? "Place" : "Connect"} · ${endpointName(drop.target.id)}`
            : "Already connected · choose another socket"
          : g.kind === "wire"
            ? "Release here to unplug"
            : g.kind === "probe"
              ? "Release here to set the probe down"
              : "Draw your route to a labeled socket",
        drop.target ? (drop.valid ? "ready" : "blocked") : "neutral"
      );
      dragStatus.textContent = `${
        g.kind === "probe" ? PROBES[g.id] : endpointName(g.kind === "wire" ? g.fixedId : g.id)
      } · held · release keeps this route · Esc to cancel`;
    }
    dragStatus.hidden = false;
    renderer.domElement.style.cursor = "grabbing";
  }
  function clearFeedback() {
    disposeGroup(dragGroup);
    targetRing.visible = false;
    pointerNote.hidden = true;
    dragStatus.hidden = true;
    renderer.domElement.style.cursor = "default";
  }
  function down(e) {
    if (e.button !== 0 || gesture || !state) return;
    const target = e.shiftKey ? hit(e, "terminal") : hit(e);
    if (!target) return;
    controls.enabled = false;
    renderer.domElement.setPointerCapture(e.pointerId);
    gesture = { ...target, pointerId: e.pointerId, startY: e.clientY, startX: e.clientX, moved: false };
    const g = gesture;
    if (g.kind === "dial") callbacks.beginDial(g.id);
    else if (["terminal", "wire", "probe", "cable"].includes(g.kind)) {
      if (g.kind === "cable") {
        const grabbed = grabCable(g.route, g.point.toArray());
        g.baseRoute = grabbed.route;
        g.knot = grabbed.index;
        g.color = g.cableKind === "wire" ? wireColor(...state.wires[g.id], state.params.configuration) : probeColors[g.id];
        if (g.cableKind === "probe") g.placement = probePlacements.get(g.id);
        g.dragZ = g.point.z;
      } else if (g.kind === "wire") {
        g.baseRoute = wirePaths.get(g.id).map((p) => [...p]);
        g.fixedId = state.wires[g.id][1 - g.end];
        g.color = wireColor(...state.wires[g.id], state.params.configuration);
        g.point = new THREE.Vector3(...g.baseRoute[g.end === 0 ? 0 : g.baseRoute.length - 1]);
        g.dragZ = g.point.z;
      } else if (g.kind === "probe") {
        g.placement = structuredClone(probePlacements.get(g.id));
        g.baseRoute = g.placement.route;
        g.point = new THREE.Vector3(...g.placement.contact);
        g.color = probeColors[g.id];
        g.dragZ = g.point.z;
      } else {
        g.trail = [g.point.toArray()];
        g.color = wireColor(g.id, "", state.params.configuration);
        // Raised instrument sockets must exit above their face, not drop through it.
        // The pointer still draws every turn; this only sets the working height.
        g.dragZ = Math.max(0.6, g.point.z + 0.12);
      }
      const origin = planePoint(e, g.dragZ);
      g.pointerOffset = g.kind === "terminal" ? new THREE.Vector3() : g.point.clone().sub(origin || g.point);
      renderer.domElement.style.cursor = "grabbing";
      dragStatus.textContent =
        g.kind === "cable" ? "Cable selected · drag to reshape · endpoints stay fixed" : "Contact selected · drag to move · Esc to cancel";
      dragStatus.hidden = false;
    }
    e.preventDefault();
  }
  function move(e) {
    if (!state || (gesture && e.pointerId !== gesture.pointerId)) return;
    if (!gesture) {
      const hover = hit(e);
      renderer.domElement.style.cursor = hover ? (hover.kind === "dial" ? "ns-resize" : hover.kind === "button" ? "pointer" : "grab") : "default";
      highlight(hover?.kind === "terminal" ? hover : null);
      note(
        e,
        !hover
          ? ""
          : hover.kind === "terminal"
            ? `${endpointName(hover.id)} · drag to connect`
            : hover.kind === "probe"
              ? `${PROBES[hover.id]} · drag probe`
              : hover.kind === "wire"
                ? "Drag plug to reconnect · Shift-drag to add a lead"
                : hover.kind === "cable"
                  ? "Drag cable to reshape · endpoints stay fixed"
                  : hover.kind === "dial"
                    ? "Drag up / down to adjust"
                    : ""
      );
      return;
    }
    const wasMoved = gesture.moved;
    gesture.moved ||= Math.hypot(e.clientX - gesture.startX, e.clientY - gesture.startY) > 4;
    if (gesture.kind === "dial") callbacks.turnDial(gesture.id, gesture.startY - e.clientY);
    else if (gesture.moved && ["terminal", "wire", "probe", "cable"].includes(gesture.kind)) {
      if (!wasMoved) {
        callbacks.holdContact(gesture);
        renderLeads();
      }
      showHeld(e);
    }
  }
  function finish() {
    const g = gesture;
    gesture = null;
    controls.enabled = true;
    if (renderer.domElement.hasPointerCapture(g.pointerId)) renderer.domElement.releasePointerCapture(g.pointerId);
    clearFeedback();
    callbacks.holdContact(null);
    renderLeads();
    return g;
  }
  function up(e) {
    if (!gesture || e.pointerId !== gesture.pointerId) return;
    if (gesture.moved && ["terminal", "wire", "probe", "cable"].includes(gesture.kind)) showHeld(e);
    const g = finish(),
      drop = g.drop;
    if (g.kind === "dial") callbacks.endDial();
    else if (g.kind === "cable") {
      if (g.moved) callbacks.arrangeCable(g.cableKind, g.id, g.route, g.placement);
      else if (g.cableKind === "wire") callbacks.wire(g.id);
      else callbacks.selectProbe(g.id);
    } else if (g.kind === "terminal") {
      if (g.moved && drop?.valid) callbacks.connect(g.id, drop.target.id, g.route);
      else if (!g.moved) callbacks.terminal(g.id);
    } else if (g.kind === "probe") {
      if (g.moved) callbacks.probe(g.id, drop?.target?.id || null, g.placement);
      else callbacks.selectProbe(g.id);
    } else if (g.kind === "wire") {
      if (!g.moved) callbacks.wire(g.id);
      else if (drop && (!drop.target || drop.valid)) callbacks.dropLead(g.id, g.end, drop.target?.id || null, g.route);
    } else if (g.kind === "button" && !g.moved) callbacks[g.id]?.();
  }
  function cancel(e) {
    if (!gesture || (e?.pointerId !== undefined && e.pointerId !== gesture.pointerId)) return;
    const g = finish();
    if (g.kind === "dial") callbacks.endDial();
  }
  function keydown(e) {
    if (e.key === "Escape") cancel();
  }
  function leave() {
    if (!gesture) clearFeedback();
  }
  renderer.domElement.addEventListener("pointerdown", down);
  renderer.domElement.addEventListener("pointermove", move);
  renderer.domElement.addEventListener("pointerup", up);
  renderer.domElement.addEventListener("pointercancel", cancel);
  renderer.domElement.addEventListener("lostpointercapture", cancel);
  renderer.domElement.addEventListener("pointerleave", leave);
  window.addEventListener("keydown", keydown);
  window.addEventListener("blur", cancel);
  let frameMode = "bench",
    lastConfiguration = null;
  let homePosition = camera.position.clone(),
    homeQuaternion = camera.quaternion.clone(),
    homeTarget = new THREE.Vector3();
  function resize() {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h) return;
    const aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    root.updateWorldMatrix(true, true);
    // Project each piece in its own local frame. A world AABB combines impossible
    // corners of tilted cases and the decorative mat, shrinking the useful bench.
    const corners = [];
    root.traverse((object) => {
      if (!object.isMesh || object.isInstancedMesh || !object.visible || object.material?.visible === false || object.userData.frame === false)
        return;
      if (object.parent === wires || object.parent === probeGroup || object.parent === dragGroup) return;
      let ancestor = object.parent;
      while (ancestor && ancestor !== root) {
        if (!ancestor.visible) return;
        ancestor = ancestor.parent;
      }
      if (frameMode === "board" && object.parent !== root) return;
      object.geometry.computeBoundingBox();
      const b = object.geometry.boundingBox;
      for (const x of [b.min.x, b.max.x])
        for (const y of [b.min.y, b.max.y])
          for (const z of [b.min.z, b.max.z]) corners.push(new THREE.Vector3(x, y, z).applyMatrix4(object.matrixWorld));
    });
    // Space for real cable exits and the front channel leads, independent of state.
    if (frameMode === "board") {
      corners.length = 0;
      for (const x of [-4.5, 2.7]) for (const y of [-2.7, 2.1]) for (const z of [0, 0.5]) corners.push(new THREE.Vector3(x, y, z));
    } else corners.push(new THREE.Vector3(6.7, 1.1, 0.35), new THREE.Vector3(-5.7, -3.24, 0.3), new THREE.Vector3(6.2, -3.24, 0.3));
    let distance = 13.8;
    const target = new THREE.Box3().setFromPoints(corners).getCenter(new THREE.Vector3());
    for (let i = 0; i < 9; i++) {
      camera.position.copy(target).addScaledVector(homeDirection, distance);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      const pp = corners.map((p) => p.clone().project(camera)),
        minX = Math.min(...pp.map((p) => p.x)),
        maxX = Math.max(...pp.map((p) => p.x)),
        minY = Math.min(...pp.map((p) => p.y)),
        maxY = Math.max(...pp.map((p) => p.y));
      const halfHeight = distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)),
        right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0),
        up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      target.addScaledVector(right, (minX + maxX) * 0.5 * halfHeight * aspect);
      target.addScaledVector(up, ((minY + maxY) * 0.5 - 0.07) * halfHeight);
      distance *= Math.max(0.8, Math.min(1.4, Math.max((maxX - minX) / 1.94, (maxY - minY) / 1.7)));
    }
    camera.position.copy(target).addScaledVector(homeDirection, distance);
    camera.lookAt(target);
    controls.target.copy(target);
    controls.update();
    homeTarget = target.clone();
    homePosition = camera.position.clone();
    homeQuaternion = camera.quaternion.clone();
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  function animate() {
    renderer.render(scene, camera);
    for (const { el, object } of accessibleControls) {
      const p = object.getWorldPosition(new THREE.Vector3()).project(camera);
      el.hidden = p.z < -1 || p.z > 1 || Math.abs(p.x) > 0.97 || Math.abs(p.y) > 0.97;
      el.style.left = `${((p.x + 1) / 2) * host.clientWidth}px`;
      el.style.top = `${((1 - p.y) / 2) * host.clientHeight}px`;
    }
  }
  renderer.setAnimationLoop(animate);
  return {
    cancelInteraction: cancel,
    update(next, result, guide) {
      state = next;
      reading = result;
      const roles = resistorRoles(state.params.configuration).map((r) => r.key),
        pins = circuit(state).pins.map((p) => p.id),
        multi = transfer(state).multi;
      for (const [id, objects] of conditionalObjects) {
        const key = id.replace("label-", "");
        const visible = key === "amplitude2" ? multi : roles.includes(key) || pins.includes(key);
        objects.forEach((o) => (o.visible = visible));
      }
      for (const id of ["rin", "rf", "rin2", "rf2", "generator-output", "supply", "generator", "meter", "scope"]) paint(id);
      if (lastConfiguration !== state.params.configuration) {
        lastConfiguration = state.params.configuration;
        resize();
      }
      for (const [id, ring] of sockets) {
        ring.visible =
          pins.includes(id) &&
          (guide.terminals.includes(id) ||
            state.selection.from === id ||
            state.selection.to === id ||
            (state.selection.wire !== null && state.wires[state.selection.wire]?.includes(id)));
        ring.material.color.set(state.selection.wire !== null ? "#df8b23" : guide.terminals.includes(id) ? "#c89423" : "#1b7caf");
      }
      for (const [id, dial] of dials) {
        const angle =
          id === "amplitude" || id === "amplitude2"
            ? -2.3 + (Math.abs(state.params[id]) / 20) * 4.6
            : id === "frequency"
              ? -2.3 + ((Math.log10(state.params.frequency) - 1) / 4) * 4.6
              : -2.3 + ((Math.log10(state.params[id]) - 3) / 2) * 4.6;
        const r = id === "amplitude" || id === "amplitude2" || id === "frequency" ? 0.13 : 0.18;
        dial.tick.position.set(
          dial.x + Math.sin(angle) * r,
          dial.y + Math.cos(angle) * r,
          id === "amplitude" || id === "amplitude2" || id === "frequency" ? 0.35 : 0.43
        );
        dial.tick.rotation.z = -angle;
      }
      const frequencyDial = dials.get("frequency");
      frequencyDial.knob.material.color.set(state.params.waveform === "dc" ? "#a4b0b7" : "#5b7380");
      frequencyDial.tick.material.color.set(state.params.waveform === "dc" ? "#c4cdd1" : "#f5f7ed");
      renderLeads();
    },
    framing(mode) {
      frameMode = mode;
      resize();
    },
    rotate(enabled) {
      controls.enableRotate = enabled;
      controls.enablePan = enabled;
      controls.enableZoom = enabled;
    },
    home() {
      camera.position.copy(homePosition);
      camera.quaternion.copy(homeQuaternion);
      camera.zoom = 1;
      controls.target.copy(homeTarget);
      controls.update();
      camera.updateProjectionMatrix();
    },
    dispose() {
      cancel();
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("blur", cancel);
      clearFeedback();
      pointerNote.remove();
      dragStatus.remove();
      observer.disconnect();
      renderer.setAnimationLoop(null);
      renderer.dispose();
      controls.dispose();
    },
  };
}
