import * as THREE from "three";
import { visibleFrame, labCanvasColor } from "../../assets/js/metahub-app-shell.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { createDirectInteraction, createLocomotion, signedTwistAngle, nearestTerminal, probeGripPose } from "./interaction.js";
import {
  createMultimeter,
  createOscilloscope,
  createRecorder,
  createPowerSupply,
  createGenerator,
  createResistanceBox,
  createProbe as makeProbe,
  createCable,
  createExperimentControls,
} from "./equipment.js";
import { createVRSession, recenterRig, snapshotDesktopView, restoreDesktopView } from "./vr-session.js";
import { routePatchLeads, routeInstrumentLead } from "./cable-routing.js";
import { deformCablePath, settleCablePath } from "./cable-motion.js";
import { commonSocketPosition, createTerminalSocketAllocator, wireSocketKey } from "./terminal-sockets.js";

/** A shared patch bench. Both mouse picks and XR rays call the same experiment actions. */
export function createBench({
  container,
  onTerminal = () => {},
  onWire = () => {},
  onAction = () => {},
  onPart = () => {},
  onHover = () => {},
  onPanelPreviewChange = () => {},
  onXRStatus = () => {},
  onFrame = () => {},
  onChange = () => {},
  onProbe = () => {},
  onConnect = () => {},
  onDisconnect = () => {},
  onWireMove = () => {},
  onGraphCursor = () => {},
  onManipulation = () => {},
}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(labCanvasColor("#c6c9c9"));
  scene.fog = new THREE.Fog(labCanvasColor("#c6c9c9"), 14, 30);
  const camera = new THREE.PerspectiveCamera(39, 1, 0.05, 35);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(labCanvasColor("#c6c9c9"));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.xr.enabled = true;
  // Keep native XR resolution and avoid peripheral blur on the side readout panels.
  renderer.xr.setFoveation(0);
  renderer.domElement.setAttribute(
    "aria-label",
    "Circuit lab. Drag probe tips onto terminals. Drag a terminal to another terminal to connect a lead; pull a plug out to disconnect it. Drag equipment knobs to turn them. Click switches and drag across the scope screen. Drag empty space to look around and scroll to zoom."
  );
  renderer.domElement.style.touchAction = "none";
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.minDistance = 0.55;
  controls.maxDistance = 12;
  controls.minPolarAngle = 0.08;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.enablePan = true;
  const rig = new THREE.Group();
  scene.add(rig);
  rig.add(camera);
  const controlPosition = new THREE.Vector3(0.8, 0.883, -0.1);
  const controlOrientation = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.62, -Math.atan2(0.8, 0.1), 0, "YXZ"));
  const scopePosition = new THREE.Vector3(-0.8, 0.895, -0.1);
  const scopeOrientation = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.62, Math.atan2(0.8, 0.1), 0, "YXZ"));
  const scopeScale = 1.35;
  const homeDirection = new THREE.Vector3(-0.25, 3.0, 3.25).normalize();
  const homeTarget = new THREE.Vector3(0, 0.97, -0.77);
  let framedAspect = 0;
  function resetView() {
    if (renderer.xr.isPresenting) return;
    rig.position.set(0, 0, 0);
    camera.aspect = Math.max(1, container.clientWidth) / Math.max(1, container.clientHeight);
    camera.updateProjectionMatrix();
    controls.target.copy(homeTarget);
    let distance = 4.5;
    const corners = [];
    for (const x of [-0.97, 0.97]) for (const y of [0.81, 1.16]) for (const z of [-1.3, -0.31]) corners.push(new THREE.Vector3(x, y, z));
    // Fit the actual side instrument and its ledge, rather than an oversized room-wide box.
    for (const x of [-0.3, 0.3])
      for (const y of [0, 0.35])
        for (const z of [-0.1, 0.1]) corners.push(new THREE.Vector3(x, y, z).applyQuaternion(controlOrientation).add(controlPosition));
    for (const x of [-0.32, 0.32])
      for (const y of [0, 0.36])
        for (const z of [-0.13, 0.13]) corners.push(new THREE.Vector3(x, y, z).applyQuaternion(scopeOrientation).add(scopePosition));
    for (const x of [-1.22, -0.55, 0.55, 1.22]) for (const z of [-0.46, 0.25]) corners.push(new THREE.Vector3(x, 0.82, z));
    for (let iteration = 0; iteration < 7; iteration++) {
      camera.position.copy(controls.target).addScaledVector(homeDirection, distance);
      camera.lookAt(controls.target);
      camera.updateMatrixWorld();
      const projected = corners.map((corner) => corner.clone().project(camera));
      const minX = Math.min(...projected.map((point) => point.x)),
        maxX = Math.max(...projected.map((point) => point.x));
      const minY = Math.min(...projected.map((point) => point.y)),
        maxY = Math.max(...projected.map((point) => point.y));
      const scale = Math.max((maxX - minX) / 1.72, (maxY - minY) / 1.72);
      const halfHeight = distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      controls.target.addScaledVector(right, (minX + maxX) * 0.5 * halfHeight * camera.aspect);
      controls.target.addScaledVector(up, (minY + maxY) * 0.5 * halfHeight);
      distance *= Math.max(0.78, Math.min(1.3, scale));
    }
    camera.position.copy(controls.target).addScaledVector(homeDirection, distance);
    camera.lookAt(controls.target);
    framedAspect = camera.aspect;
    controls.update();
  }
  resetView();

  scene.add(new THREE.HemisphereLight("#ffffff", "#777b79", 1.35));
  const sun = new THREE.DirectionalLight("#fffdf8", 2.7);
  sun.position.set(-3, 7, 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.1, far: 16 });
  sun.shadow.normalBias = 0.004;
  scene.add(sun);
  const fill = new THREE.DirectionalLight("#eef2f4", 0.65);
  fill.position.set(4, 3, -4);
  scene.add(fill);

  const palette = { navy: "#2b2c2d", teal: "#414646", brass: "#b59a60", metal: "#b9baba", board: "#246648", copper: "#ad653c" };
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.56, metalness: 0.08, ...extra });
  const shared = {
    navy: mat(palette.navy),
    teal: mat(palette.teal),
    metal: mat(palette.metal, { metalness: 0.7, roughness: 0.3 }),
    brass: mat(palette.brass, { metalness: 0.65, roughness: 0.3 }),
    copper: mat(palette.copper, { metalness: 0.65, roughness: 0.3 }),
    board: mat(palette.board, { roughness: 0.58 }),
    pale: mat("#b9bcb8"),
    black: mat("#171819", { roughness: 0.72 }),
    resistor: mat("#c8b082", { roughness: 0.74 }),
    trace: mat("#3f7952", { roughness: 0.68 }),
    solder: mat("#bfc3c0", { metalness: 0.82, roughness: 0.34 }),
    red: mat("#922724", { roughness: 0.67 }),
    mat: mat("#353b3d", { roughness: 0.95 }),
    pcbEdge: mat("#73764e", { roughness: 0.92 }),
  };
  const sharedMaterials = new Set(Object.values(shared));
  const board = new THREE.Group();
  board.position.set(0, 0.52, -0.77);
  board.scale.setScalar(0.36);
  scene.add(board);
  const mesh = (geometry, material, parent, x = 0, y = 0, z = 0) => {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  };
  const rounded = (w, h, d, r = 0.035) => new RoundedBoxGeometry(w, h, d, 3, r);
  // FR4 trainer PCB on a grounded ESD work mat. No decorative traces imply connections.
  mesh(rounded(3.65, 0.025, 2.32, 0.018), shared.mat, board, 0, 0.843);
  mesh(rounded(3.32, 0.022, 2.02, 0.018), shared.pcbEdge, board, 0, 0.907);
  mesh(rounded(3.319, 0.007, 2.019, 0.018), shared.board, board, 0, 0.921);
  for (const x of [-1.54, 1.54]) {
    for (const z of [-0.89, 0.89]) {
      mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.055, 6), shared.brass, board, x, 0.88, z);
      mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.004, 24), shared.metal, board, x, 0.929, z);
      mesh(new THREE.CylinderGeometry(0.023, 0.023, 0.009, 24), shared.solder, board, x, 0.934, z);
      mesh(new THREE.BoxGeometry(0.029, 0.0015, 0.005), shared.black, board, x, 0.94, z);
      mesh(new THREE.BoxGeometry(0.005, 0.0015, 0.029), shared.black, board, x, 0.94, z);
    }
  }
  const floor = mesh(new THREE.PlaneGeometry(80, 80), mat("#b9bcba", { roughness: 0.94 }), scene, 0, 0.815, 0);
  floor.rotation.x = -Math.PI / 2;
  floor.visible = false;
  floor.castShadow = false;
  const vrEnvironment = new THREE.Group();
  vrEnvironment.visible = true;
  scene.add(vrEnvironment);
  const roomFloor = mesh(new THREE.PlaneGeometry(14, 14), mat("#a5a8a5", { roughness: 0.96 }), vrEnvironment, 0, -0.003, -1.4);
  roomFloor.rotation.x = -Math.PI / 2;
  roomFloor.castShadow = false;
  const backWall = mesh(new THREE.PlaneGeometry(10, 3.4), mat("#d2d3cd", { roughness: 0.94 }), vrEnvironment, 0, 1.7, -5.1);
  backWall.castShadow = false;
  const skirting = mesh(new THREE.BoxGeometry(10, 0.1, 0.025), mat("#9c9f9b", { roughness: 0.84 }), vrEnvironment, 0, 0.05, -5.08);
  const tableTop = mesh(rounded(2.12, 0.04, 1.42, 0.009), mat("#a7aaa5", { roughness: 0.83 }), vrEnvironment, 0, 0.8, -0.985);
  for (const x of [-0.91, 0.91])
    for (const z of [-1.57, -0.4]) {
      mesh(new THREE.BoxGeometry(0.055, 0.765, 0.055), mat("#858b8c", { metalness: 0.62, roughness: 0.43 }), vrEnvironment, x, 0.3975, z);
      mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.027, 20), shared.black, vrEnvironment, x, 0.0135, z);
    }
  for (const z of [-1.57, -0.4]) mesh(new THREE.BoxGeometry(1.85, 0.065, 0.035), shared.metal, vrEnvironment, 0, 0.729, z);
  for (const x of [-0.91, 0.91]) mesh(new THREE.BoxGeometry(0.035, 0.065, 1.2), shared.metal, vrEnvironment, x, 0.729, -0.985);

  // Attached front-right ledge and metal cradle support the tilted control instrument.
  mesh(rounded(0.67, 0.04, 0.525, 0.004), tableTop.material, vrEnvironment, 0.885, 0.8, -0.0125);
  mesh(rounded(0.16, 0.04, 0.185, 0.004), tableTop.material, vrEnvironment, 1.14, 0.8, -0.3675);
  for (const z of [-0.37, 0.16]) {
    mesh(new THREE.BoxGeometry(0.045, 0.765, 0.045), shared.metal, vrEnvironment, 1.16, 0.3975, z);
    mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.027, 20), shared.black, vrEnvironment, 1.16, 0.0135, z);
  }
  mesh(new THREE.BoxGeometry(0.58, 0.065, 0.035), shared.metal, vrEnvironment, 0.87, 0.729, 0.16);
  const controlCradle = new THREE.Group();
  controlCradle.position.copy(controlPosition);
  controlCradle.quaternion.copy(controlOrientation);
  vrEnvironment.add(controlCradle);
  mesh(rounded(0.6, 0.012, 0.195, 0.006), shared.metal, controlCradle, 0, -0.01, 0);
  for (const x of [-0.23, 0.23])
    for (const z of [-0.066, 0.066]) {
      const top = new THREE.Vector3(x, -0.018, z).applyQuaternion(controlOrientation).add(controlPosition);
      const height = Math.max(0.01, top.y - 0.821);
      mesh(new THREE.CylinderGeometry(0.008, 0.008, height, 16), shared.metal, vrEnvironment, top.x, 0.821 + height / 2, top.z);
      mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.003, 20), shared.black, vrEnvironment, top.x, 0.822, top.z);
    }

  // The scope sits within reach on the left, with its face tilted up toward the student.
  mesh(rounded(0.67, 0.04, 0.71, 0.004), tableTop.material, vrEnvironment, -0.885, 0.8, -0.105);
  for (const z of [-0.37, 0.16]) {
    mesh(new THREE.BoxGeometry(0.045, 0.765, 0.045), shared.metal, vrEnvironment, -1.16, 0.3975, z);
    mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.027, 20), shared.black, vrEnvironment, -1.16, 0.0135, z);
  }
  mesh(new THREE.BoxGeometry(0.58, 0.065, 0.035), shared.metal, vrEnvironment, -0.87, 0.729, 0.16);
  const scopeCradle = new THREE.Group();
  scopeCradle.position.copy(scopePosition);
  scopeCradle.quaternion.copy(scopeOrientation);
  vrEnvironment.add(scopeCradle);
  mesh(rounded(0.64, 0.012, 0.27, 0.006), shared.metal, scopeCradle, 0, -0.01, 0);
  for (const x of [-0.24, 0.24])
    for (const z of [-0.1, 0.1]) {
      const top = new THREE.Vector3(x, -0.018, z).applyQuaternion(scopeOrientation).add(scopePosition);
      const height = Math.max(0.01, top.y - 0.821);
      mesh(new THREE.CylinderGeometry(0.008, 0.008, height, 16), shared.metal, vrEnvironment, top.x, 0.821 + height / 2, top.z);
      mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.003, 20), shared.black, vrEnvironment, top.x, 0.822, top.z);
    }

  function canvasSurface(width, height, worldW, worldH) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 16);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });
    const object = new THREE.Mesh(new THREE.PlaneGeometry(worldW, worldH), material);
    return { canvas, context, texture, object };
  }
  function textLine(context, text, x, y, maxWidth) {
    const value = String(text ?? "");
    if (context.measureText(value).width <= maxWidth) {
      context.fillText(value, x, y);
      return;
    }
    let shortened = value;
    while (shortened.length && context.measureText(`${shortened}…`).width > maxWidth) shortened = shortened.slice(0, -1);
    context.fillText(`${shortened}…`, x, y);
  }
  function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines = 3) {
    const words = String(text ?? "").split(/\s+/);
    let line = "",
      count = 0;
    for (let i = 0; i < words.length; i++) {
      const next = line ? `${line} ${words[i]}` : words[i];
      if (context.measureText(next).width > maxWidth && line) {
        context.fillText(line, x, y + count * lineHeight);
        line = words[i];
        count++;
        if (count === maxLines - 1) {
          textLine(context, words.slice(i).join(" "), x, y + count * lineHeight, maxWidth);
          return count + 1;
        }
      } else line = next;
    }
    if (line) context.fillText(line, x, y + count * lineHeight);
    return count + 1;
  }
  function label(title, subtitle = "", width = 0.44, height = 0.14) {
    const surface = canvasSurface(512, 160, width, height);
    const draw = (nextTitle, nextSubtitle) => {
      const ctx = surface.context;
      ctx.clearRect(0, 0, 512, 160);
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = nextSubtitle ? "600 72px monospace" : "600 104px monospace";
      textLine(ctx, nextTitle, 256, nextSubtitle ? 67 : 113, 496);
      ctx.fillStyle = "#f0f4ed";
      ctx.font = "600 59px monospace";
      textLine(ctx, nextSubtitle, 256, 142, 496);
      surface.texture.needsUpdate = true;
    };
    draw(title, subtitle);
    surface.object.rotation.x = -Math.PI / 2;
    return { ...surface, draw };
  }
  const benchTitle = label("TRAINER PCB", "DC / ANALOG", 0.68, 0.15);
  benchTitle.object.position.set(-1.11, 0.932, -0.84);
  board.add(benchTitle.object);
  const benchMark = label("ELEN 221", "PATCH TERMINALS", 0.45, 0.13);
  benchMark.object.position.set(1.17, 0.932, -0.86);
  board.add(benchMark.object);

  const componentGroup = new THREE.Group();
  const wireGroup = new THREE.Group();
  const probeGroup = new THREE.Group();
  board.add(componentGroup, wireGroup);
  scene.add(probeGroup);
  const pins = new Map();
  const socketAllocator = createTerminalSocketAllocator();
  const values = new Map();
  let targets = [];
  let partTargets = [];
  let wireTargets = [];
  let plugTargets = [];
  const componentEquipment = [];
  const stationaryEquipment = [];
  const movableProbes = new Map();
  const looseLeads = new Set();
  const equipmentGroup = new THREE.Group();
  scene.add(equipmentGroup);
  let equipmentSignature = "";
  let meterMode = "vdc";
  let current = { components: [], wires: [], actions: [], live: { title: "Circuit bench", lines: [] } };
  let componentSignature = "",
    wireSignature = "",
    liveSignature = "",
    actionSignature = "";
  let hovered = null;
  let hoverSignature = "";
  let panelPreview = false;
  let previewCamera = null;
  let statusView = "status";
  let schematicURL = "";
  let schematicImage = null;
  let schematicVersion = 0;
  let disposed = false;

  function clearGroup(group) {
    group.traverse((object) => {
      object.geometry?.dispose();
      const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
      for (const material of materials) {
        if (sharedMaterials.has(material)) continue;
        material.map?.dispose();
        material.dispose();
      }
    });
    group.clear();
  }
  function tube(points, radius, material, parent, segments = 32) {
    return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, 7, false), material, parent);
  }
  function solderPad(parent, x, z) {
    mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.003, 24), shared.copper, parent, x, 0.929, z);
    mesh(new THREE.CylinderGeometry(0.018, 0.023, 0.008, 24), shared.solder, parent, x, 0.934, z);
    mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.001, 12), shared.black, parent, x, 0.939, z);
  }
  function topPrint(parent, title, subtitle, width, height, y, z = 0, color = "#dddcd4") {
    const surface = canvasSurface(512, 256, width, height);
    const ctx = surface.context;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.font = "600 76px monospace";
    textLine(ctx, title, 256, 112, 490);
    ctx.font = "48px monospace";
    textLine(ctx, subtitle, 256, 190, 490);
    surface.texture.needsUpdate = true;
    surface.object.rotation.x = -Math.PI / 2;
    surface.object.position.set(0, y, z);
    parent.add(surface.object);
    return surface;
  }
  const bandColors = ["#171718", "#65432b", "#922a25", "#bb6726", "#d7c24c", "#3d6542", "#31516d", "#725475", "#797b79", "#dddcd0"];
  function resistorBands(value) {
    const match = String(value).match(/([\d.]+)\s*(k|M)?/);
    const resistance = match ? Number(match[1]) * (match[2] === "k" ? 1000 : match[2] === "M" ? 1000000 : 1) : 1000;
    const exponent = Math.floor(Math.log10(Math.max(resistance, 0.01))) - 1;
    const digits = Math.round(resistance / 10 ** exponent);
    const multiplier = exponent === -1 ? "#ac9456" : exponent === -2 ? "#aeb1ae" : bandColors[Math.max(0, Math.min(9, exponent))];
    return [bandColors[Math.floor(digits / 10)], bandColors[digits % 10], multiplier, "#b09a60"];
  }
  function partName(part) {
    if (part.type === "ground") return "GND";
    if (part.type === "C") return "C1";
    if (part.type === "L") return "L1";
    if (part.type === "opamp") return "U1";
    if (part.type === "switch") return "S1";
    if (part.type === "R") {
      const name = { load: "RL", rin: "Rin", rf: "Rf", r: "R", r1: "R1", r2: "R2" }[part.id];
      if (name) return name;
      if (part.id === "req") return current.parameters?.representation === "norton" ? "Rn" : "Rth";
    }
    return String(part.label).replace("DC SOURCE", "DC SUPPLY").replace("REFERENCE", "GND");
  }
  function editableParameter(part) {
    if (current.module === "thevenin") return { load: "load", req: "equivalentResistance" }[part.id];
    if (current.module === "opamp") return { rin: "rin", rf: "rf" }[part.id];
    if (current.module === "transient" && part.id === "r") return "resistance";
    return null;
  }
  function registerEquipment(unit, list = stationaryEquipment) {
    for (const target of unit.targets) {
      target.object.userData.direct = target;
      // Invisible hit sleeves improve small physical knob accessibility without changing their scale.
      if (target.kind === "dial") {
        const sleeve = new THREE.Mesh(
          new THREE.SphereGeometry(0.022, 12, 8),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        );
        sleeve.userData.direct = target;
        target.object.add(sleeve);
        target.pickSleeve = sleeve;
      }
    }
    const originalDispose = unit.dispose;
    unit.dispose = () => {
      for (const target of unit.targets)
        if (target.pickSleeve) {
          target.pickSleeve.geometry.dispose();
          target.pickSleeve.material.dispose();
          target.pickSleeve.removeFromParent();
          target.pickSleeve = null;
        }
      originalDispose();
    };
    list.push(unit);
    return unit;
  }
  function mountOnPart(unit, body, attachment, tilt = -0.53) {
    registerEquipment(unit, componentEquipment);
    unit.group.scale.setScalar(1 / 0.36);
    unit.group.rotation.x = tilt;
    body.add(unit.group);
    body.updateWorldMatrix(true, true);
    const contacts = unit.anchors["+"]
      ? [unit.anchors["+"], unit.anchors["−"]]
      : unit.anchors.A
        ? [unit.anchors.A, unit.anchors.B]
        : Object.values(unit.anchors).slice(0, 2);
    contacts.forEach((anchor) => attachment.push(body.worldToLocal(anchor.getWorldPosition(new THREE.Vector3()))));
    if (unit.anchors.OUT && attachment.length === 1) attachment.push(attachment[0].clone().add(new THREE.Vector3(0.007 / 0.36, 0, 0)));
    unit.update({ ...current, meterMode });
    return unit;
  }
  function buildComponents(components) {
    for (const unit of componentEquipment) unit.dispose();
    componentEquipment.length = 0;
    clearGroup(componentGroup);
    pins.clear();
    values.clear();
    targets = [];
    partTargets = [];
    for (const part of components) {
      const body = new THREE.Group();
      body.position.set(part.x, 0.955, part.z);
      if (["V", "I"].includes(part.type))
        body.position.set(part.benchPosition?.[0] ?? Math.sign(part.x || -1) * 2.15, 0.842, part.benchPosition?.[1] ?? part.z);
      componentGroup.add(body);
      const partPins = part.pins || [];
      if (partPins.length === 2 && ["R", "L", "C"].includes(part.type)) {
        body.rotation.y = -Math.atan2(partPins[1].z - partPins[0].z, partPins[1].x - partPins[0].x);
      }
      const attachment = [];
      let updateHardware = () => {};
      switch (part.type) {
        case "R": {
          const parameter = editableParameter(part);
          if (parameter) {
            body.rotation.y = 0;
            const unit = mountOnPart(createResistanceBox({ id: part.id, label: partName(part), parameter }), body, attachment, -0.18);
            updateHardware = () => unit.update(current);
            break;
          }

          const profile = [
            [0.014, -0.13],
            [0.026, -0.115],
            [0.035, -0.098],
            [0.034, -0.073],
            [0.032, -0.045],
            [0.032, 0.045],
            [0.034, 0.073],
            [0.035, 0.098],
            [0.026, 0.115],
            [0.014, 0.13],
          ];
          const resistor = mesh(
            new THREE.LatheGeometry(
              profile.map(([r, h]) => new THREE.Vector2(r, h)),
              32
            ),
            shared.resistor,
            body,
            0,
            0.046
          );
          resistor.rotation.z = Math.PI / 2;
          const bandMeshes = [];
          for (const [index, x] of [-0.079, -0.035, 0.011, 0.085].entries()) {
            const radius = index === 0 || index === 3 ? 0.0354 : 0.0328;
            const band = mesh(
              new THREE.CylinderGeometry(radius, radius, 0.014, 32),
              mat(resistorBands(part.value)[index], { roughness: 0.74 }),
              body,
              x,
              0.046
            );
            band.rotation.z = Math.PI / 2;
            bandMeshes.push(band);
          }
          updateHardware = (value) => resistorBands(value).forEach((color, index) => bandMeshes[index].material.color.set(color));
          attachment.push(new THREE.Vector3(-0.13, 0.046, 0), new THREE.Vector3(0.13, 0.046, 0));
          break;
        }
        case "C": {
          const sleeve = document.createElement("canvas");
          sleeve.width = 768;
          sleeve.height = 512;
          const ctx = sleeve.getContext("2d");
          ctx.fillStyle = "#202427";
          ctx.fillRect(0, 0, 768, 512);
          ctx.fillStyle = "#c6c9be";
          ctx.fillRect(145, 0, 110, 512);
          ctx.fillStyle = "#333835";
          ctx.font = "bold 82px monospace";
          ctx.textAlign = "center";
          for (const y of [105, 245, 385]) ctx.fillText("−", 200, y);
          ctx.fillStyle = "#d2d4c8";
          ctx.font = "bold 78px monospace";
          ctx.fillText("100µF", 520, 165);
          ctx.fillText("25V", 520, 285);
          ctx.font = "48px monospace";
          ctx.fillText("105°C", 520, 391);
          const texture = new THREE.CanvasTexture(sleeve);
          texture.colorSpace = THREE.SRGBColorSpace;
          mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.166, 48), mat("#ffffff", { map: texture, roughness: 0.67 }), body, 0, 0.094);
          mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.008, 48), shared.metal, body, 0, 0.181);
          mesh(new THREE.TorusGeometry(0.065, 0.005, 8, 48), shared.metal, body, 0, 0.184).rotation.x = -Math.PI / 2;
          for (const angle of [Math.PI / 4, -Math.PI / 4]) {
            const vent = mesh(new THREE.BoxGeometry(0.1, 0.0015, 0.003), shared.navy, body, 0, 0.186);
            vent.rotation.y = angle;
          }
          mesh(new THREE.CylinderGeometry(0.061, 0.061, 0.013, 32), shared.black, body, 0, 0.007);
          attachment.push(new THREE.Vector3(-0.03, 0.003, 0), new THREE.Vector3(0.03, 0.003, 0));
          break;
        }
        case "L": {
          mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.29, 24), shared.black, body, 0, 0.06).rotation.z = Math.PI / 2;
          for (const x of [-0.145, 0.145])
            mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.015, 32), shared.black, body, x, 0.06).rotation.z = Math.PI / 2;
          const turns = [];
          for (let i = 0; i <= 560; i++) {
            const phase = (i / 560) * Math.PI * 28;
            turns.push(new THREE.Vector3(-0.131 + (i / 560) * 0.262, 0.06 + Math.sin(phase) * 0.041, Math.cos(phase) * 0.041));
          }
          tube(turns, 0.0077, shared.copper, body, 560);
          attachment.push(new THREE.Vector3(-0.151, 0.052, 0), new THREE.Vector3(0.151, 0.052, 0));
          break;
        }
        case "opamp": {
          // DIP-8 physical pin arrangement; unused offset/NC pins remain unconnected.
          const shape = new THREE.Shape();
          shape.moveTo(-0.083, -0.135);
          shape.lineTo(-0.027, -0.135);
          shape.absarc(0, -0.135, 0.027, Math.PI, 0, true);
          shape.lineTo(0.083, -0.135);
          shape.lineTo(0.083, 0.135);
          shape.lineTo(-0.083, 0.135);
          shape.closePath();
          const chip = mesh(
            new THREE.ExtrudeGeometry(shape, {
              depth: 0.052,
              bevelEnabled: true,
              bevelSegments: 2,
              steps: 1,
              bevelSize: 0.003,
              bevelThickness: 0.003,
            }),
            shared.black,
            body,
            0,
            0.079
          );
          chip.rotation.x = Math.PI / 2;
          for (const x of [-0.105, 0.105])
            for (const z of [-0.099, -0.033, 0.033, 0.099]) {
              mesh(new THREE.BoxGeometry(0.056, 0.009, 0.019), shared.metal, body, x, 0.036, z);
              mesh(new THREE.BoxGeometry(0.009, 0.052, 0.019), shared.metal, body, Math.sign(x) * 0.133, 0.01, z);
              const foot = new THREE.Vector3(Math.sign(x) * 0.133, -0.02, z).add(body.position);
              solderPad(componentGroup, foot.x, foot.z);
            }
          const dot = mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.001, 16), mat("#85877f"), body, -0.052, 0.084, -0.103);
          topPrint(body, "OP AMP", "DIP-8", 0.115, 0.143, 0.084, 0.024);
          const byId = {
            "op+": [-0.133, -0.016, 0.033],
            "op-": [-0.133, -0.016, -0.033],
            out: [0.133, -0.016, 0.033],
            vp: [0.133, -0.016, -0.033],
            vn: [-0.133, -0.016, 0.099],
          };
          partPins.forEach((pin) => attachment.push(new THREE.Vector3(...(byId[pin.id] || [0, 0, 0]))));
          break;
        }
        case "switch": {
          mesh(rounded(0.155, 0.056, 0.13, 0.004), shared.black, body, 0, 0.015);
          mesh(new THREE.BoxGeometry(0.167, 0.01, 0.143), shared.metal, body, 0, 0.049);
          mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.044, 32), shared.metal, body, 0, 0.075);
          mesh(new THREE.CylinderGeometry(0.049, 0.049, 0.017, 6), shared.metal, body, 0, 0.074);
          mesh(new THREE.TorusGeometry(0.037, 0.003, 6, 32), shared.navy, body, 0, 0.092).rotation.x = -Math.PI / 2;
          const lever = new THREE.Group();
          lever.position.y = 0.09;
          body.add(lever);
          mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.125, 20), shared.metal, lever, 0, 0.06);
          mesh(new THREE.SphereGeometry(0.014, 20, 12), shared.metal, lever, 0, 0.123);
          updateHardware = (value) => {
            lever.rotation.x = String(value).toUpperCase().includes("RETURN") ? 0.39 : -0.39;
          };
          updateHardware(part.value);
          // The three solder lugs belong to one SPDT, without joining the throws.
          attachment.push(new THREE.Vector3(-0.046, -0.012, -0.047), new THREE.Vector3(0.056, -0.012, 0), new THREE.Vector3(-0.046, -0.012, 0.047));
          for (const point of attachment) mesh(new THREE.BoxGeometry(0.022, 0.025, 0.011), shared.brass, body, point.x, point.y, point.z);
          break;
        }
        case "ground": {
          // Ground is a binding-post reference terminal, not an electrical component.
          attachment.push(new THREE.Vector3(0, -0.021, 0));
          break;
        }
        default: {
          let parameter = "equivalentVoltage",
            fixedValue = null,
            polarity = 1;
          if (current.module === "thevenin") {
            if (current.parameters?.representation === "original") fixedValue = 12;
            else if (part.type === "I") parameter = "nortonCurrent";
          } else if (current.module === "superposition") {
            parameter = part.id === "a" ? "v1" : "v2";
            polarity = part.id === "b" ? -1 : 1;
          } else if (current.module === "opamp") parameter = "rail";
          else fixedValue = 5;
          const unit =
            part.id === "signal"
              ? createGenerator({ id: part.id })
              : createPowerSupply({ id: part.id, label: partName(part), parameter, fixedValue, polarity });
          mountOnPart(unit, body, attachment);
          updateHardware = () => unit.update(current);
          break;
        }
      }

      const groundBus = current.module === "opamp" && part.type === "ground";
      const valueLabel = label(partName(part), groundBus ? "" : part.value, groundBus ? 0.4 : 0.5, 0.16);
      const verticalPins = partPins.length === 2 && Math.abs(partPins[1].z - partPins[0].z) > Math.abs(partPins[1].x - partPins[0].x);
      const labelZ = verticalPins ? Math.max(...partPins.map((pin) => pin.z)) + 0.22 : part.z + (part.type === "switch" ? 0.4 : 0.22);
      valueLabel.object.position.set(groundBus ? 1.32 : part.x, 0.933, groundBus ? 0.79 : labelZ);
      componentGroup.add(valueLabel.object);
      values.set(part.id, {
        value: part.value,
        label: part.label,
        draw: (_, value) => valueLabel.draw(partName(part), groundBus ? "" : value),
        body,
        type: part.type,
        updateHardware,
      });
      if (part.type !== "ground") {
        const dimensions = ["V", "I"].includes(part.type)
          ? [0.46, 0.19, 0.34]
          : part.type === "C"
            ? [0.18, 0.23, 0.18]
            : part.type === "L"
              ? [0.35, 0.15, 0.17]
              : part.type === "opamp"
                ? [0.3, 0.12, 0.32]
                : part.type === "switch"
                  ? [0.2, 0.23, 0.21]
                  : [0.3, 0.11, 0.12];
        const geometry = new THREE.BoxGeometry(...dimensions);
        const hit = mesh(
          geometry,
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
          body,
          0,
          dimensions[1] / 2 - 0.025,
          0
        );
        hit.castShadow = false;
        hit.receiveShadow = false;
        hit.userData = { kind: "part", id: part.id, label: `${partName(part)} · ${part.value}`, type: part.type };
        if (part.type === "switch") hit.userData.direct = { object: hit, kind: "switch", id: part.id, label: "Source / Return", action: "switch" };
        const outline = new THREE.LineSegments(
          new THREE.EdgesGeometry(geometry),
          new THREE.LineBasicMaterial({ color: "#cfb862", transparent: true, opacity: 0.85 })
        );
        outline.position.copy(hit.position);
        outline.visible = false;
        body.add(outline);
        values.get(part.id).outline = outline;
        values.get(part.id).hit = hit;
        partTargets.push(hit);
      }
      for (const [index, pin] of partPins.entries()) {
        const local = attachment[index] || new THREE.Vector3(0, 0, 0);
        const start = local
          .clone()
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), body.rotation.y)
          .add(body.position);
        const direction = new THREE.Vector3(pin.x - start.x, 0, pin.z - start.z).normalize();
        const landing = start.clone().addScaledVector(direction, ["R", "L"].includes(part.type) ? 0.052 : 0.014);
        landing.y = 0.938;
        if (["V", "I"].includes(part.type)) {
          const endpoint = new THREE.Vector3(pin.x, 0.995, pin.z);
          const middle = start.clone().lerp(endpoint, 0.5);
          middle.y = Math.max(0.95, middle.y);
          tube([start, start.clone().lerp(middle, 0.3), middle, endpoint], 0.008, index === 0 ? shared.red : shared.black, componentGroup, 24);
        } else if (part.type !== "ground") {
          if (start.distanceTo(landing) > 0.006)
            tube(
              [
                start,
                start
                  .clone()
                  .lerp(landing, 0.55)
                  .add(new THREE.Vector3(0, 0.006, 0)),
                landing,
              ],
              0.006,
              shared.metal,
              componentGroup,
              14
            );
          solderPad(componentGroup, landing.x, landing.z);
          const endpoint = new THREE.Vector3(pin.x, 0.929, pin.z);
          const elbow = landing.clone().lerp(endpoint, 0.5);
          elbow.y = 0.929;
          tube([new THREE.Vector3(landing.x, 0.929, landing.z), elbow, endpoint], 0.007, shared.trace, componentGroup, 12);
        }
        const red = (["V", "I", "C"].includes(part.type) && index === 0) || pin.label === "5 V" || pin.label === "V+";
        const common = current.module === "opamp" && ["gnd", "out"].includes(pin.id);
        const record = { x: pin.x, z: pin.z, red, label: `${partName(part)} ${pin.label || pin.id}`, common, sockets: [] };
        record.addSocket = ({ x, z }) => {
          const socket = record.sockets.length;
          if (common && socket > 0) {
            const previous = record.sockets[socket - 1];
            // These posts are one existing electrical node, joined by an exposed commoning bar.
            tube([new THREE.Vector3(previous.x, 0.942, previous.z), new THREE.Vector3(x, 0.942, z)], 0.013, shared.brass, componentGroup, 8);
          }
          mesh(new THREE.CylinderGeometry(0.044, 0.044, 0.006, 6), shared.metal, componentGroup, x, 0.934, z);
          mesh(new THREE.CylinderGeometry(0.037, 0.041, 0.017, 32), red ? shared.red : shared.black, componentGroup, x, 0.946, z);
          mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.028, 32), red ? shared.red : shared.black, componentGroup, x, 0.968, z);
          for (const y of [0.956, 0.964, 0.972])
            mesh(new THREE.TorusGeometry(0.032, 0.0018, 5, 32), red ? shared.red : shared.navy, componentGroup, x, y, z).rotation.x = -Math.PI / 2;
          mesh(new THREE.TorusGeometry(0.018, 0.004, 8, 32), shared.metal, componentGroup, x, 0.984, z).rotation.x = -Math.PI / 2;
          mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.005, 24), shared.black, componentGroup, x, 0.982, z);
          const ring = mesh(new THREE.TorusGeometry(0.054, 0.0035, 6, 32), mat("#ece6bd", { roughness: 0.6 }), componentGroup, x, 0.928, z);
          ring.rotation.x = -Math.PI / 2;
          ring.visible = false;
          const hit = mesh(
            new THREE.SphereGeometry(0.068, 12, 8),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
            componentGroup,
            x,
            0.984,
            z
          );
          hit.castShadow = false;
          hit.receiveShadow = false;
          hit.userData = { kind: "terminal", id: pin.id, socket, label: record.label };
          hit.userData.direct = { object: hit, kind: "terminal", id: pin.id, terminal: pin.id, socket, label: record.label };
          targets.push(hit);
          record.sockets.push({ x, z, socket, ring, hit });
          if (!socket) Object.assign(record, { ring, hit });
        };
        const count = common ? (pin.id === "gnd" ? 8 : 3) : 1;
        for (let socket = 0; socket < count; socket++) record.addSocket(common ? commonSocketPosition(pin.id, socket) : pin);
        pins.set(pin.id, record);
        if (!groundBus) {
          const pinLabel = label(pin.label || pin.id, "", common ? 0.25 : 0.15, common ? 0.08 : 0.063);
          pinLabel.object.position.set(common ? 0.8 : pin.x, 0.932, common ? -0.36 : pin.z + 0.086);
          componentGroup.add(pinLabel.object);
        }
      }
    }
  }
  let cableObstacleCache = null,
    cableLayoutRevision = 0,
    patchLayoutRevision = 0;
  const flexibleRouteCache = new WeakMap();
  let patchRoutes = new Map(),
    patchVisuals = new Map();
  const pendingPatchShapes = new Map();
  const cableVectors = (points) => points.map((p) => new THREE.Vector3(p.x, p.y, p.z));
  const sampleCable = (points) => new THREE.CatmullRomCurve3(cableVectors(points)).getSpacedPoints(47);
  const pathGap = (a, b) => Math.max(...a.map((p, i) => Math.hypot(p.x - b[i].x, p.y - b[i].y, p.z - b[i].z)));
  function updatePatchGeometry(visual) {
    const local = cableVectors(visual.points).map((p) => board.worldToLocal(p));
    const curve = new THREE.CatmullRomCurve3(local);
    for (const [object, radius] of [
      [visual.wire, 0.009],
      [visual.hit, 0.019],
    ]) {
      object.geometry.dispose();
      object.geometry = new THREE.TubeGeometry(curve, 96, radius, 7, false);
    }
  }
  function updatePatchLeads(now) {
    for (const visual of patchVisuals.values()) {
      if (!visual.settling) continue;
      const dt = (now - visual.time) / 1000;
      visual.time = now;
      visual.points = settleCablePath(visual.points, visual.target, dt, { maxSpeed: 0.3 });
      if (pathGap(visual.points, visual.target) < 0.0001) {
        visual.points = visual.target;
        visual.settling = false;
      }
      updatePatchGeometry(visual);
      renderer.shadowMap.needsUpdate = true;
    }
  }
  function cableObstacles(world = false) {
    if (!cableObstacleCache) {
      board.updateWorldMatrix(true, true);
      const boxes = [...values.values()]
        .filter((value) => value.type !== "ground")
        .flatMap((value) => {
          const box = new THREE.Box3().setFromObject(value.body);
          return box.isEmpty() ? [] : [box];
        });
      const footprint = (min, max) => ({ minX: min.x, maxX: max.x, minZ: min.z, maxZ: max.z, top: max.y });
      const instrumentBoxes = [meter, scope]
        .map((unit) => {
          unit.group.updateWorldMatrix(true, true);
          return new THREE.Box3().setFromObject(unit.group);
        })
        .filter((box) => !box.isEmpty());
      cableObstacleCache = {
        world: [...boxes, ...instrumentBoxes].map((box) => footprint(box.min, box.max)),
        local: boxes.map((box) => footprint(board.worldToLocal(box.min.clone()), board.worldToLocal(box.max.clone()))),
      };
    }
    return cableObstacleCache[world ? "world" : "local"];
  }
  function buildWires(wires) {
    const previousVisuals = patchVisuals;
    patchVisuals = new Map();
    clearGroup(wireGroup);
    wireTargets = [];
    plugTargets = [];
    board.updateWorldMatrix(true, false);
    const connections = wires.flatMap(([a, b], index) => {
      const startPin = pins.get(a),
        endPin = pins.get(b);
      if (!startPin || !endPin) return [];
      const id = [a, b].sort().join("|");
      const startWorld = terminalPosition(a, `wire:${id}:${a}`),
        endWorld = terminalPosition(b, `wire:${id}:${b}`);
      if (!startWorld || !endWorld) return [];
      return [{ id, a, b, index, startPin, endPin, start: board.worldToLocal(startWorld), end: board.worldToLocal(endWorld) }];
    });
    const routes = routePatchLeads(connections, {
      obstacles: cableObstacles(),
      previousRoutes: patchRoutes,
      layoutKey: patchLayoutRevision,
    });
    patchRoutes = routes;
    connections.forEach(({ id, a, b, index, startPin, endPin, start, end }) => {
      const grounded = a === "gnd" || b === "gnd" || a.endsWith("-") || b.endsWith("-") || a === "return" || b === "return";
      const material = mat(grounded ? "#202121" : "#8b2925", { roughness: 0.79 });
      const route = routes.get(id);
      const previous = previousVisuals.get(id);
      const target = previous?.route === route ? previous.target : sampleCable(route).map((p) => board.localToWorld(p));
      const seed = pendingPatchShapes.get(id);
      pendingPatchShapes.delete(id);
      const seededPoints = seed ? (seed.from === a ? seed.points : [...seed.points].reverse()) : null;
      const displayed = seededPoints || (previous?.route === route ? previous.points : target);
      const points = cableVectors(displayed).map((p) => board.worldToLocal(p));
      const wire = tube(points, 0.009, material, wireGroup, 96);
      wire.userData = { kind: "wire", index };
      const hit = tube(points, 0.019, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), wireGroup, 96);
      patchVisuals.set(id, { a, b, route, points: displayed, target, wire, hit, time: performance.now(), settling: displayed !== target });
      hit.castShadow = false;
      hit.receiveShadow = false;
      hit.userData = { kind: "wire", index, id: String(index), label: `${startPin.label} → ${endPin.label}`, wire, color: material.color.getHex() };
      wireTargets.push(hit);
      for (const [endpoint, point] of [start, end].entries()) {
        const plug = mesh(new THREE.CylinderGeometry(0.023, 0.026, 0.055, 24), material, wireGroup, point.x, 1.012, point.z);
        const pick = mesh(
          new THREE.SphereGeometry(0.037, 12, 8),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
          wireGroup,
          point.x,
          1.03,
          point.z
        );
        const descriptor = {
          object: pick,
          kind: "plug",
          id: `wire:${index}:${endpoint}`,
          resource: `wire:${[a, b].sort().join("|")}`,
          wireIndex: index,
          wirePair: [a, b],
          endpoint,
          terminal: endpoint ? b : a,
          from: endpoint ? a : b,
          label: `Pull ${endpoint ? endPin.label : startPin.label} plug`,
          color: material.color.getHex(),
        };
        plug.userData.direct = descriptor;
        pick.userData.direct = descriptor;
        plugTargets.push(pick, plug);
        for (const y of [0.988, 0.996, 1.004])
          mesh(new THREE.TorusGeometry(0.023, 0.0018, 6, 24), material, wireGroup, point.x, y, point.z).rotation.x = -Math.PI / 2;
      }
    });
  }

  function socketResources(id) {
    const resources = current.wires.filter((wire) => wire.includes(id)).map(([a, b]) => wireSocketKey(a, b, id));
    for (const channel of ["red", "black", "ch1", "ch2", "ch1Ground", "ch2Ground"])
      if (connectedTerminal(channel) === id) resources.push(`probe:${channel}`);
    for (const lead of looseLeads) if (lead.from === id) resources.push(lead.resource);
    return resources;
  }
  function terminalPositions() {
    board.updateWorldMatrix(true, false);
    return [...pins].flatMap(([id, pin]) =>
      pin.sockets.map((socket) => ({
        id,
        socket: socket.socket,
        hit: socket.hit,
        position: board.localToWorld(new THREE.Vector3(socket.x, 1.002, socket.z)),
      }))
    );
  }
  function terminalPosition(id, resourceKey) {
    const pin = pins.get(id);
    if (!pin) return null;
    const index = pin.common ? socketAllocator.resolve(id, resourceKey, socketResources(id)) : 0;
    while (pin.sockets.length <= index) pin.addSocket(commonSocketPosition(id, pin.sockets.length));
    const socket = pin.sockets[index];
    board.updateWorldMatrix(true, false);
    return board.localToWorld(new THREE.Vector3(socket.x, 1.002, socket.z));
  }
  function connectedTerminal(channel) {
    if (channel === "red" || channel === "black") return current.probes?.[channel] || null;
    const which = channel.slice(0, 3);
    return current.scope?.[which]?.[channel.endsWith("Ground") ? "ground" : "signal"] || null;
  }
  const meter = registerEquipment(createMultimeter());
  meter.group.position.set(-0.43, 0.823, -0.3);
  meter.group.rotation.x = -0.56;
  equipmentGroup.add(meter.group);
  let scope = registerEquipment(createRecorder({ module: "thevenin" }));
  scope.group.position.copy(scopePosition);
  scope.group.quaternion.copy(scopeOrientation);
  scope.group.scale.setScalar(scopeScale);
  equipmentGroup.add(scope.group);
  let experimentControls = null;
  const probeSpecs = [
    ["red", "#b52e2b", "Meter V", -0.52],
    ["black", "#252829", "Meter COM", -0.35],
    ["ch1", "#d5b348", "CH1", 0.1],
    ["ch2", "#64a5b5", "CH2", 0.26],
    ["ch1Ground", "#a68e42", "CH1 ground", 0.41],
    ["ch2Ground", "#477d8c", "CH2 ground", 0.53],
  ];
  for (const [channel, color, title, x] of probeSpecs) {
    const unit = makeProbe({ id: `probe:${channel}`, channel, color, label: title });
    const home = new THREE.Vector3(x, 0.831, -0.345);
    unit.group.position.copy(home);
    unit.group.rotation.x = -Math.PI / 2;
    const pick = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.014, /Ground/.test(channel) ? 0.024 : 0.12, 4, 8),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    pick.position.y = /Ground/.test(channel) ? 0.027 : 0.087;
    pick.userData.direct = unit.targets[0];
    unit.group.add(pick);
    unit.targets[0].object = pick;
    unit.targets[0].resource = `probe:${channel}`;
    const cable = createCable({ color, radius: 0.0019 });
    scene.add(unit.group, cable.group);
    movableProbes.set(channel, { unit, pick, cable, home, connected: undefined, channel, color, loose: false });
  }
  function syncEquipment(rebuilt = false) {
    for (const lead of [...looseLeads]) {
      const held = [...direct.holds.values()].some((hold) => hold.lead === lead);
      if (!held && lead.originalPair && current.wires.some((wire) => wire.includes(lead.originalPair[0]) && wire.includes(lead.originalPair[1])))
        removeLooseLead(lead);
    }
    const signature = current.module || "thevenin";
    if (signature !== equipmentSignature) {
      if (signature.split(":")[0] !== equipmentSignature.split(":")[0]) {
        const index = stationaryEquipment.indexOf(scope);
        if (index >= 0) stationaryEquipment.splice(index, 1);
        scope.dispose();
        scope = registerEquipment(current.module === "opamp" ? createOscilloscope() : createRecorder({ module: current.module || "thevenin" }));
        scope.group.position.copy(scopePosition);
        scope.group.quaternion.copy(scopeOrientation);
        scope.group.scale.setScalar(scopeScale);
        equipmentGroup.add(scope.group);
        cableObstacleCache = null;
        cableLayoutRevision++;
      }
      equipmentSignature = signature;
      experimentControls?.dispose();
      experimentControls = createExperimentControls({ module: current.module || "thevenin" });
      registerEquipment(experimentControls, []);
      experimentControls.group.position.copy(controlPosition);
      experimentControls.group.quaternion.copy(controlOrientation);
      equipmentGroup.add(experimentControls.group);
    }
    for (const unit of [...stationaryEquipment, ...componentEquipment, experimentControls].filter(Boolean)) unit.update({ ...current, meterMode });
    for (const probe of movableProbes.values()) {
      const visible = !probe.channel.startsWith("ch") || current.module === "opamp";
      probe.unit.group.visible = probe.cable.group.visible = visible;
      if (direct.isHeld(`probe:${probe.channel}`)) continue;
      const id = connectedTerminal(probe.channel);
      if (id !== probe.connected || rebuilt) {
        delete probe.restPose;
        probe.connected = id;
        const contact = terminalPosition(id, `probe:${probe.channel}`);
        if (contact) {
          probe.unit.group.position.copy(contact);
          probe.unit.group.rotation.set(-0.24, 0, probe.channel.includes("2") ? -0.28 : 0.28);
          probe.loose = false;
        } else if (!probe.loose) {
          probe.unit.group.position.copy(probe.home);
          probe.unit.group.rotation.set(-Math.PI / 2, 0, 0);
        }
      }
    }
    updateFlexibleLeads();
  }
  function cableCurve(start, end, options, cable, held = false) {
    const now = performance.now();
    const signature = [...start.toArray(), ...end.toArray()].map((v) => v.toFixed(5)).join(":");
    let cached = flexibleRouteCache.get(cable);
    if (!cached || cached.revision !== cableLayoutRevision) {
      const points = sampleCable(routeInstrumentLead(start, end, options));
      cached = { points, target: points, reference: points, signature, held, time: now, revision: cableLayoutRevision };
      flexibleRouteCache.set(cable, cached);
    }
    // Capture the displayed shape at pickup, even if it is still settling.
    // Hand motion never runs the grid planner or switches to another lane.
    if (held) {
      if (!cached.held) cached.reference = cached.points;
      if (!cached.held || cached.signature !== signature) cached.points = deformCablePath(cached.reference, start, end);
    } else {
      // Plan once at release. The body settles at a bounded speed while the
      // tip makes contact immediately; later frames only advance this blend.
      if (cached.held || cached.signature !== signature) cached.target = sampleCable(routeInstrumentLead(start, end, options));
      if (cached.points !== cached.target) {
        cached.points = settleCablePath(cached.points, cached.target, (now - cached.time) / 1000, { maxSpeed: 0.3 });
        if (pathGap(cached.points, cached.target) < 0.0001) cached.points = cached.target;
        renderer.shadowMap.needsUpdate = true;
      }
    }
    cached.signature = signature;
    cached.held = held;
    cached.time = now;
    return cached.points;
  }
  function updateFlexibleLeads() {
    const now = performance.now();
    updatePatchLeads(now);
    const obstacles = cableObstacles(true);
    for (const probe of movableProbes.values()) {
      if (!probe.unit.group.visible) continue;
      if (probe.restPose) {
        const dt = Math.min((now - probe.restPose.time) / 1000, 0.05);
        probe.restPose.time = now;
        const gap = probe.unit.group.position.distanceTo(probe.restPose.position);
        probe.unit.group.position.lerp(probe.restPose.position, gap ? Math.min(1, (0.4 * dt) / gap) : 1);
        probe.unit.group.quaternion.slerp(probe.restPose.quaternion, 1 - Math.exp(-10 * dt));
        if (gap < 0.0001 && probe.unit.group.quaternion.angleTo(probe.restPose.quaternion) < 0.001) delete probe.restPose;
        renderer.shadowMap.needsUpdate = true;
      }
      const channel = probe.channel,
        ground = channel.endsWith("Ground");
      const anchor =
        channel === "red" ? meter.anchors.V : channel === "black" ? meter.anchors.COM : scope.anchors[channel.startsWith("ch1") ? "CH1" : "CH2"];
      const pairedProbe = ground ? movableProbes.get(channel.slice(0, 3)) : null;
      const start = pairedProbe ? pairedProbe.unit.group.localToWorld(new THREE.Vector3(0, 0.055, 0)) : anchor?.getWorldPosition(new THREE.Vector3());
      const end = probe.unit.anchors.cable.getWorldPosition(new THREE.Vector3());
      const lane = { red: 0, black: 1, ch1: 2, ch2: 3, ch1Ground: 0, ch2Ground: 1 }[channel] || 0;
      const exit = anchor
        ? new THREE.Vector3(0, 0, 1).applyQuaternion(anchor.getWorldQuaternion(new THREE.Quaternion()))
        : new THREE.Vector3(0, 0, 1);
      const held =
        direct.isHeld(`probe:${channel}`) ||
        !!probe.restPose ||
        !!(pairedProbe && (direct.isHeld(`probe:${pairedProbe.channel}`) || pairedProbe.restPose));
      if (start) probe.cable.update(cableCurve(start, end, { lane, exit, obstacles, branch: ground }, probe.cable, held));
    }
    for (const lead of looseLeads) {
      if (lead.restPosition) {
        const dt = Math.min((now - lead.restTime) / 1000, 0.05);
        lead.restTime = now;
        const gap = lead.plug.position.distanceTo(lead.restPosition);
        lead.plug.position.lerp(lead.restPosition, gap ? Math.min(1, (0.4 * dt) / gap) : 1);
        if (gap < 0.0001) delete lead.restPosition;
        renderer.shadowMap.needsUpdate = true;
      }
      const start = terminalPosition(lead.from, lead.resource);
      if (!start) {
        lead.cable.group.visible = lead.plug.visible = false;
        continue;
      }
      // A patch lead keeps its board path, including while its plug rests loose.
      lead.points = deformCablePath(lead.reference, start, lead.plug.position);
      lead.cable.update(lead.points);
    }
  }
  const leadPreviewGeometry = new THREE.BufferGeometry();
  leadPreviewGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(48), 3));
  const leadPreview = new THREE.Line(
    leadPreviewGeometry,
    new THREE.LineDashedMaterial({ color: "#e9df9a", dashSize: 0.035, gapSize: 0.025, depthTest: false })
  );
  leadPreview.visible = false;
  leadPreview.renderOrder = 8;
  board.add(leadPreview);
  let hoverPoint = null;
  const boardPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(0.52 + 0.36 * 1.002));
  function refreshInteractionVisuals() {
    for (const [id, pin] of pins) {
      const selected = id === current.selectedTerminal;
      for (const socket of pin.sockets) {
        const over = hovered?.kind === "terminal" && hovered.id === id && (hovered.socket ?? 0) === socket.socket;
        socket.ring.visible = selected || over;
        socket.ring.material.color.set(selected ? "#f4d973" : "#e6eef5");
        socket.ring.scale.setScalar(selected ? 1.27 : 1.12);
      }
    }
    for (const [id, part] of values)
      if (part.outline) part.outline.visible = current.selectedPart === id || (hovered?.kind === "part" && hovered.id === id);
    for (const target of wireTargets) {
      const data = target.userData;
      data.wire.material.color.set(
        hovered?.kind === "wire" && hovered.id === String(data.index) && current.tool === "remove" ? "#d57937" : data.color
      );
    }
    const start = pins.get(current.selectedTerminal);
    leadPreview.visible = !!start && (current.tool || "wire") === "wire";
    if (start) {
      const endPin = hovered?.kind === "terminal" ? pins.get(hovered.id) : null;
      const end = endPin
        ? new THREE.Vector3(endPin.x, 1.013, endPin.z)
        : hoverPoint
          ? board.worldToLocal(hoverPoint.clone())
          : new THREE.Vector3(start.x + 0.16, 1.013, start.z + 0.16);
      end.y = Math.max(0.988, Math.min(1.1, end.y));
      const origin = new THREE.Vector3(start.x, 1.013, start.z),
        middle = origin.clone().lerp(end, 0.5);
      middle.y += 0.075;
      const curve = new THREE.QuadraticBezierCurve3(origin, middle, end),
        positions = leadPreviewGeometry.attributes.position;
      for (let i = 0; i < 16; i++) {
        const point = curve.getPoint(i / 15);
        positions.setXYZ(i, point.x, point.y, point.z);
      }
      positions.needsUpdate = true;
      leadPreviewGeometry.computeBoundingSphere();
      leadPreview.computeLineDistances();
    }
  }

  // Stationary world-space displays remain readable while students use both controllers.
  const xrPanels = new THREE.Group();
  xrPanels.visible = false;
  scene.add(xrPanels);
  function panel(surface, x, y, z, rotation = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotation;
    xrPanels.add(group);
    const backboard = mesh(
      rounded(surface.object.geometry.parameters.width + 0.045, surface.object.geometry.parameters.height + 0.045, 0.042, 0.02),
      shared.navy,
      group,
      0,
      0,
      -0.026
    );
    backboard.castShadow = false;
    backboard.receiveShadow = false;
    surface.object.castShadow = false;
    surface.object.receiveShadow = false;
    group.add(surface.object);
    return group;
  }
  const actionPanel = canvasSurface(1152, 768, 0.96, 0.64);
  const livePanel = canvasSurface(840, 1280, 0.68, 1.036);
  const actionMount = panel(actionPanel, 0, 1.72, -1.8);
  const liveMount = panel(livePanel, 1.24, 1.62, -1.02, -0.88);
  const actionBoxes = [];
  function drawActions() {
    const { context: ctx, canvas } = actionPanel;
    const status = current.diagnostic || { level: "info", title: "Circuit ready", message: "Use the equipment to take readings." };
    const ink = status.level === "error" ? "#893e25" : status.level === "warning" ? "#7b551e" : "#25483d";
    ctx.fillStyle = "#f7f8f3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#344b43";
    ctx.font = "600 40px Arial";
    ctx.fillText(statusView === "schematic" ? "Circuit diagram" : "Circuit check", 42, 68);
    actionBoxes.length = 0;
    const button = (x, y, w, h, title, callback, active = false) => {
      ctx.fillStyle = active ? "#29463b" : "#e1e8e0";
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = active ? "#fff" : "#273b32";
      ctx.font = "600 36px Arial";
      ctx.textAlign = "center";
      textLine(ctx, title, x + w / 2, y + h / 2 + 12, w - 24);
      ctx.textAlign = "left";
      actionBoxes.push({ x, y, w, h, action: callback });
    };
    for (const [i, [view, label]] of [
      ["status", "Status"],
      ["schematic", "Diagram"],
    ].entries())
      button(
        740 + i * 185,
        26,
        170,
        62,
        label,
        () => {
          statusView = view;
          drawActions();
        },
        statusView === view
      );
    if (statusView === "schematic") {
      if (schematicImage) {
        const area = { x: 22, y: 115, w: 1108, h: 518 };
        const scale = Math.min(area.w / schematicImage.width, area.h / schematicImage.height);
        const w = schematicImage.width * scale,
          h = schematicImage.height * scale;
        ctx.drawImage(schematicImage, area.x + (area.w - w) / 2, area.y + (area.h - h) / 2, w, h);
      } else {
        ctx.fillStyle = "#344b43";
        ctx.font = "42px Arial";
        ctx.fillText("Loading the circuit diagram…", 48, 260);
      }
    } else {
      ctx.fillStyle = ink;
      ctx.fillRect(42, 132, 8, 454);
      ctx.font = "700 64px Arial";
      wrapText(ctx, status.title, 78, 193, 1026, 75, 2);
      ctx.fillStyle = "#22382e";
      ctx.font = "48px Arial";
      wrapText(ctx, status.message, 78, 367, 1026, 60, 3);
      ctx.fillStyle = "#526258";
      ctx.font = "38px Arial";
      wrapText(ctx, status.detail || "", 78, 565, 1026, 48, 2);
    }
    button(42, 667, 335, 66, "Recenter", () => recenterVR());
    button(775, 667, 335, 66, renderer.xr.isPresenting ? "Exit VR" : "Close preview", () =>
      renderer.xr.isPresenting ? void vrSession.exit() : setPanelPreview(false)
    );
    actionPanel.texture.needsUpdate = true;
  }
  actionPanel.object.userData = {
    kind: "panel",
    activate: (intersection) => {
      const x = intersection.uv.x * actionPanel.canvas.width,
        y = (1 - intersection.uv.y) * actionPanel.canvas.height;
      actionBoxes.find((box) => x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h)?.action();
    },
  };
  function formatReadout(value) {
    if (!Number.isFinite(Number(value)) || value === null || value === "") return String(value ?? "—");
    const number = Number(value);
    if (number !== 0 && (Math.abs(number) >= 1e5 || Math.abs(number) < 0.0001)) return number.toExponential(2);
    return Number(number.toPrecision(4)).toString();
  }
  function drawLive() {
    const ctx = livePanel.context,
      width = livePanel.canvas.width;
    ctx.fillStyle = "#f9faf6";
    ctx.fillRect(0, 0, width, 1280);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#14211f";
    ctx.font = "700 62px Arial";
    ctx.fillText("Live readings", 48, 88);
    ctx.fillStyle = "#45524e";
    ctx.font = "38px Arial";
    const names = {
      thevenin: "Load circuit",
      superposition: "Selected sources",
      opamp: "Amplifier",
      transient: `${current.parameters?.kind || "RC"} circuit`,
    };
    ctx.fillText(names[current.module] || "Circuit bench", 48, 139);
    const readings = (current.metrics || []).slice(0, 3);
    const labelNames = { Voltmeter: "Meter voltage", "Voltage sample": "Voltage at input peak", "Linear gain": "Gain" };
    readings.forEach((reading, index) => {
      const top = 180 + index * 271;
      ctx.strokeStyle = "#bdc8c2";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(48, top - 16);
      ctx.lineTo(width - 48, top - 16);
      ctx.stroke();
      ctx.fillStyle = "#34433e";
      ctx.font = "600 47px Arial";
      textLine(ctx, labelNames[reading.label] || reading.label, 48, top + 42, width - 96);
      const text = formatReadout(reading.value),
        unit = reading.unit || "";
      ctx.fillStyle = "#101c18";
      ctx.font = "700 142px Arial";
      const maxNumberWidth = width - 206;
      let size = 142;
      while (ctx.measureText(text).width > maxNumberWidth && size > 86) {
        size -= 4;
        ctx.font = `700 ${size}px Arial`;
      }
      ctx.fillText(text, 48, top + 185);
      const numberWidth = ctx.measureText(text).width;
      ctx.font = "600 54px Arial";
      ctx.fillText(unit, Math.min(width - 151, 48 + numberWidth + 22), top + 182);
      ctx.fillStyle = "#4b5852";
      ctx.font = "34px Arial";
      const detail =
        reading.label === "Voltmeter" || reading.label === "Voltage sample"
          ? reading.value === "—"
            ? reading.detail || "Place both probes"
            : "V tip − COM tip"
          : reading.label === "Branch current" || reading.label === "Storage current"
            ? "Current: top → ground"
            : reading.label === "Load power"
              ? "From load voltage × current"
              : reading.label === "Linear gain"
                ? "Output / input, before clipping"
                : "";
      textLine(ctx, detail, 48, top + 238, width - 96);
    });
    const measurement = current.measurement || {};
    if (measurement.ok === false) {
      ctx.fillStyle = "#f4e6d6";
      ctx.fillRect(28, 1012, width - 56, 236);
      ctx.fillStyle = "#6b341b";
      ctx.font = "700 43px Arial";
      ctx.fillText("Check connections", 48, 1066);
      ctx.font = "37px Arial";
      wrapText(ctx, measurement.error || "Complete the circuit to take a reading.", 48, 1121, width - 96, 47, 3);
    } else if (current.module === "transient") {
      ctx.fillStyle = "#243b32";
      ctx.font = "600 44px Arial";
      ctx.fillText(current.parameters?.playing ? "Running" : "Paused", 48, 1076);
      ctx.font = "700 75px Arial";
      ctx.fillText(`${formatReadout((current.parameters?.time || 0) * 1000)} ms`, 48, 1172, width - 96);
      ctx.font = "34px Arial";
      ctx.fillText("Elapsed circuit time", 48, 1226);
    } else if (current.module === "opamp" && measurement.clipped) {
      ctx.fillStyle = "#f4e6d6";
      ctx.fillRect(28, 1035, width - 56, 128);
      ctx.fillStyle = "#6b341b";
      ctx.font = "700 48px Arial";
      ctx.fillText("Output is clipping", 48, 1117);
    } else {
      ctx.fillStyle = "#46564c";
      ctx.font = "37px Arial";
      ctx.fillText("Readings follow the circuit.", 48, 1096);
    }
    livePanel.texture.needsUpdate = true;
  }
  livePanel.object.userData = { kind: "panel", activate: () => true };

  function makeLooseLead(target, position) {
    const cable = createCable({ color: target.color || "#862926", radius: 0.00324 });
    const plug = new THREE.Group();
    mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.038, 20), mat(target.color || "#862926"), plug, 0, 0.015, 0);
    mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.013, 16), shared.metal, plug, 0, -0.009, 0);
    const sleeve = mesh(
      new THREE.SphereGeometry(0.023, 12, 8),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      plug,
      0,
      0.013,
      0
    );
    plug.position.copy(position);
    const lead = { from: target.from || target.terminal, cable, plug, originalPair: target.wirePair?.slice() || null };
    const looseId = `loose:${Math.random().toString(36).slice(2)}`;
    lead.resource = lead.originalPair ? wireSocketKey(...lead.originalPair, lead.from) : looseId;
    looseLeads.add(lead);
    if (!lead.originalPair && pins.get(lead.from)?.common)
      socketAllocator.prefer(lead.from, lead.resource, target.socket, socketResources(lead.from));
    const saved = target.wirePair && patchVisuals.get([...target.wirePair].sort().join("|"));
    const start = terminalPosition(lead.from, lead.resource);
    lead.reference = saved
      ? cableVectors(saved.a === lead.from ? saved.points : [...saved.points].reverse())
      : sampleCable([start || position, position]);
    lead.points = deformCablePath(lead.reference, start || position, position);
    cable.update(lead.points);
    const descriptor = {
      object: sleeve,
      kind: "plug",
      id: looseId,
      from: lead.from,
      label: "Grab loose plug",
      lead,
      color: target.color,
    };
    sleeve.userData.direct = descriptor;
    lead.target = descriptor;
    scene.add(plug, cable.group);
    return lead;
  }
  function removeLooseLead(lead) {
    if (!lead) return;
    looseLeads.delete(lead);
    lead.cable.dispose();
    clearGroup(lead.plug);
    lead.plug.removeFromParent();
  }
  const direct = createDirectInteraction({
    getModel: () => ({ ...current, parameters: { ...current.parameters, meterMode, timeCursor: current.parameters?.time } }),
    getTerminals: terminalPositions,
    onProbe,
    onBeforeConnect: (from, terminal, hold) => {
      const lead = hold.lead;
      if (!lead) return;
      // Stage the exact held shape and physical sockets before onConnect renders.
      lead.plug.position.copy(hold.position);
      updateFlexibleLeads();
      const pair = [from, terminal.id],
        id = [...pair].sort().join("|");
      // Dropping onto an existing connection must not move that other lead.
      if (current.wires.some((wire) => wire.includes(from) && wire.includes(terminal.id))) return;
      if (pins.get(from)?.common) socketAllocator.transfer(from, lead.resource, wireSocketKey(...pair, from), socketResources(from));
      lead.originalPair = pair;
      lead.resource = wireSocketKey(...pair, from);
      if (pins.get(terminal.id)?.common)
        socketAllocator.prefer(terminal.id, wireSocketKey(...pair, terminal.id), terminal.socket, socketResources(terminal.id));
      pendingPatchShapes.set(id, { from, points: cableVectors(lead.points) });
      hold.pendingPair = id;
    },
    onConnect,
    onDisconnect,
    onGraphCursor,
    onChange: (name, value) => {
      if (name === "meterMode") {
        meterMode = value;
        meter.update({ ...current, meterMode });
        onChange(name, value);
      } else if (name === "timeCursor") onAction(`scrub:${Math.min(value, current.parameters?.acquiredTime || 0) * 1000}`);
      else onChange(name, value);
    },
    onAction: (id) => {
      if (String(id).startsWith("recorder-panel:")) {
        const index = Number(String(id).split(":")[1]);
        if (Number.isInteger(index) && index >= 0) {
          scope.selectPanel?.(index);
        }
      } else onAction(id);
    },
    onHold: (phase, hold, result) => {
      const target = hold.target;
      if (phase === "start") {
        if (["probe", "plug", "terminal"].includes(target.kind)) onManipulation("begin", hold);
        if (target.kind === "probe") {
          const probe = movableProbes.get(target.channel);
          if (probe) {
            delete probe.restPose;
            probe.loose = true;
            hold.probe = probe;
            hold.position = probe.unit.group.position.clone();
          }
        } else if (target.kind === "terminal" || target.kind === "plug") {
          hold.lead = target.lead || makeLooseLead(target, hold.position || terminalPosition(target.terminal));
          delete hold.lead.restPosition;
          hold.lead.reference = cableVectors(hold.lead.points);
        }
      }
      if (phase === "move") {
        if (hold.probe && hold.position) {
          hold.probe.unit.group.position.copy(hold.position);
          if (hold.quaternion) hold.probe.unit.group.quaternion.copy(hold.quaternion);
          else hold.probe.unit.group.rotation.set(-0.25, 0, 0.18);
        }
        if (hold.lead && hold.position) hold.lead.plug.position.copy(hold.position);
        renderer.shadowMap.needsUpdate = true;
      }
      if (phase === "end") {
        if (hold.probe) {
          const probe = hold.probe;
          probe.connected = result.terminal;
          const resource = `probe:${probe.channel}`;
          if (pins.get(result.terminal)?.common && hold.position) {
            const dropped = nearestTerminal(
              hold.position,
              terminalPositions().filter((pin) => pin.id === result.terminal),
              0.055
            );
            if (dropped) socketAllocator.prefer(result.terminal, resource, dropped.socket, socketResources(result.terminal));
          }
          const contact = terminalPosition(result.terminal, resource);
          if (contact) {
            probe.unit.group.position.copy(contact);
            probe.unit.group.rotation.set(-0.24, 0, 0.25);
            probe.loose = false;
          } else {
            // A released probe rests on the mat, with a tethered cable; it remains available to grab again.
            probe.restPose = {
              position: new THREE.Vector3(
                THREE.MathUtils.clamp(hold.position?.x ?? probe.home.x, -0.88, 0.88),
                0.87,
                THREE.MathUtils.clamp(hold.position?.z ?? probe.home.z, -1.2, -0.34)
              ),
              quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)),
              time: performance.now(),
            };
            probe.loose = true;
          }
        }
        if (hold.pendingPair) pendingPatchShapes.delete(hold.pendingPair);
        if (hold.lead) {
          if (result.kind === "connected" || result.kind === "cancelled" || target.kind === "terminal") removeLooseLead(hold.lead);
          else {
            hold.lead.restPosition = new THREE.Vector3(
              THREE.MathUtils.clamp(hold.lead.plug.position.x, -0.58, 0.58),
              0.87,
              THREE.MathUtils.clamp(hold.lead.plug.position.z, -1.1, -0.41)
            );
            hold.lead.restTime = performance.now();
          }
        }
        if (["probe", "plug", "terminal"].includes(target.kind)) onManipulation("end", hold);
        renderer.shadowMap.needsUpdate = true;
      }
    },
  });

  function update(model) {
    if (model.module && model.module !== current.module) statusView = "status";
    current = { ...current, ...model };
    const nextComponents = JSON.stringify(current.components.map(({ value, ...rest }) => rest));
    let rebuilt = false;
    if (nextComponents !== componentSignature) {
      componentSignature = nextComponents;
      direct.cancelAll();
      for (const lead of [...looseLeads]) removeLooseLead(lead);
      cableObstacleCache = null;
      cableLayoutRevision++;
      patchLayoutRevision++;
      patchRoutes = new Map();
      patchVisuals = new Map();
      pendingPatchShapes.clear();
      for (const probe of movableProbes.values()) delete probe.restPose;
      buildComponents(current.components);
      rebuilt = true;
      renderer.shadowMap.needsUpdate = true;
    }
    for (const part of current.components) {
      const cached = values.get(part.id);
      if (cached && cached.value !== part.value) {
        cached.draw(part.label, part.value);
        cached.value = part.value;
        cached.updateHardware?.(part.value);
        if (cached.hit) cached.hit.userData.label = `${partName(part)} · ${part.value}`;
        renderer.shadowMap.needsUpdate = true;
      }
    }
    const nextWires = JSON.stringify(current.wires);
    if (rebuilt || nextWires !== wireSignature) {
      wireSignature = nextWires;
      buildWires(current.wires);
      renderer.shadowMap.needsUpdate = true;
    }
    refreshInteractionVisuals();
    syncEquipment(rebuilt);
    const nextLive = JSON.stringify([
      current.module,
      current.metrics,
      current.measurement?.ok,
      current.measurement?.error,
      current.measurement?.clipped,
      current.parameters?.time,
      current.parameters?.playing,
    ]);
    if (nextLive !== liveSignature) {
      liveSignature = nextLive;
      drawLive();
    }
    const nextActions = JSON.stringify(current.diagnostic);
    if (nextActions !== actionSignature) {
      actionSignature = nextActions;
      drawActions();
    }
    if (current.schematicDataURL !== undefined && current.schematicDataURL !== schematicURL) {
      schematicURL = current.schematicDataURL;
      schematicImage = null;
      const version = ++schematicVersion;
      if (/^data:image\/(svg\+xml|png|jpeg|webp)[;,]/.test(schematicURL || "")) {
        const img = new Image();
        img.onload = () => {
          if (!disposed && version === schematicVersion) {
            schematicImage = img;
            drawActions();
          }
        };
        img.onerror = () => {
          if (!disposed && version === schematicVersion) drawActions();
        };
        img.src = schematicURL;
      }
      drawActions();
    }
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let down = null;
  function visible(object) {
    for (let node = object; node; node = node.parent) if (!node.visible) return false;
    return true;
  }
  function descriptorFor(object) {
    for (let node = object; node; node = node.parent) {
      const target = node.userData.direct || node.userData.equipmentTarget;
      if (target) return target;
    }
    return null;
  }
  function activeTargets() {
    const equipment = [...stationaryEquipment, ...componentEquipment, experimentControls].filter(Boolean).map((unit) => unit.group);
    const probes = [...movableProbes.values()].map((probe) => probe.unit.group);
    const loose = [...looseLeads].map((lead) => lead.plug);
    return [
      ...targets,
      ...partTargets,
      ...wireTargets,
      ...plugTargets,
      ...equipment,
      ...probes,
      ...loose,
      ...(xrPanels.visible ? [actionPanel.object, livePanel.object] : []),
    ];
  }
  function pick() {
    const hits = raycaster
      .intersectObjects(activeTargets(), true)
      .filter((hit) => visible(hit.object) && (descriptorFor(hit.object) || hit.object.userData.kind));
    for (const hit of hits) hit.direct = descriptorFor(hit.object);
    // Probe/plug handles and actual equipment controls precede enlarged contact picking sleeves.
    const first = hits[0];
    const manip = hits.find(
      (hit) =>
        ["probe", "plug", "dial", "button", "screen", "switch"].includes(hit.direct?.kind) && hit.distance < (first?.distance ?? Infinity) + 0.065
    );
    return manip || first;
  }
  function setHover(hit, point = null) {
    const data = hit?.direct || hit?.object.userData;
    const info =
      data && ["terminal", "part", "wire", "probe", "plug", "dial", "button", "switch", "screen"].includes(data.kind)
        ? { kind: data.kind, id: data.id ?? String(data.index), label: data.label || data.id, socket: data.socket }
        : null;
    const signature = JSON.stringify([info, current.tool, current.selectedTerminal]);
    hovered = info;
    hoverPoint = hit?.point?.clone() || point?.clone() || null;
    if (signature !== hoverSignature) {
      hoverSignature = signature;
      onHover(renderer.xr.isPresenting ? null : info);
    }
    refreshInteractionVisuals();
  }
  function activate(hit) {
    if (!hit) return;
    const action = hit.object.userData;
    if (action.kind === "terminal") onTerminal(action.id);
    else if (action.kind === "wire") {
      if (current.tool === "remove") onWire(action.index);
    } else if (action.kind === "part") {
      onPart(action.id);
      if (action.type === "switch") onAction("switch");
      drawActions();
    } else if (action.kind === "panel") action.activate(hit);
  }
  function setPointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, (-(event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
  }
  function graphSample(hit, target) {
    if (!hit?.uv) return {};
    const x = hit.uv.x,
      y = 1 - hit.uv.y;
    const bounds = target.bounds || [];
    let area = bounds.find((box) => y >= box.top && y <= box.top + box.height);
    if (!area) area = bounds[0] || { left: 0, width: 1, panel: 0 };
    return { fraction: THREE.MathUtils.clamp((x - area.left) / area.width, 0, 1), panelIndex: area.panel || 0 };
  }
  function dragPoint() {
    return raycaster.ray.intersectPlane(boardPlane, new THREE.Vector3());
  }
  function beginAt(input, hit, sample = {}) {
    if (!hit) return false;
    if (hit.object.userData.kind === "panel") {
      if (hit.object.userData.activate(hit) !== false) return false;
    }
    const target = hit.direct || descriptorFor(hit.object);
    if (!target) return false;
    if (target.kind === "probe" && !movableProbes.get(target.channel)?.unit.group.visible) return false;
    if (target.kind === "dial") target.resource = `parameter:${target.parameter}`;
    if (target.kind === "plug" && target.wirePair)
      target.wireIndex = current.wires.findIndex((wire) => wire.includes(target.wirePair[0]) && wire.includes(target.wirePair[1]));
    if (target.parameter === "timeCursor") {
      target.max = current.parameters?.acquiredTime || 0;
      target.min = 0;
      target.step = Math.max(target.max / 100, 0.000001);
    }
    const position =
      target.kind === "probe"
        ? movableProbes.get(target.channel)?.unit.group.position
        : target.kind === "terminal"
          ? terminalPositions().find((pin) => pin.id === target.terminal && pin.socket === (target.socket ?? 0))?.position
          : hit.point;
    return direct.begin(input, target, { position, ...graphSample(hit, target), ...sample });
  }
  function pointerDown(event) {
    if (event.button !== 0 || renderer.xr.isPresenting) return;
    direct.release("mouse");
    setPointer(event);
    const hit = pick();
    down = { x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, time: performance.now(), hit };
    if (hit?.direct || hit?.object.userData.kind === "panel") {
      controls.enabled = false;
      renderer.domElement.setPointerCapture(event.pointerId);
      beginAt("mouse", hit);
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }
  function pointerMove(event) {
    if (renderer.xr.isPresenting) return;
    setPointer(event);
    const hold = direct.hold("mouse"),
      hit = pick();
    if (hold) {
      const sample = { position: dragPoint() };
      if (hold.target.kind === "dial") sample.turn = (event.clientX - down.lastX - (event.clientY - down.lastY)) * 0.024;
      if (hold.target.kind === "screen") {
        const screenHit = raycaster.intersectObject(hold.target.object, true)[0];
        Object.assign(sample, graphSample(screenHit, hold.target));
      }
      direct.move("mouse", sample);
      if (down) {
        down.lastX = event.clientX;
        down.lastY = event.clientY;
      }
      const contact = ["probe", "terminal", "plug"].includes(hold.target.kind) ? nearestTerminal(hold.position, terminalPositions(), 0.055) : null;
      const snapHit = contact ? { object: contact.hit, direct: contact.hit.userData.direct, point: contact.position } : hit;
      setHover(snapHit, sample.position);
      updateFlexibleLeads();
    } else if (!down) {
      renderer.domElement.style.cursor =
        hit?.direct?.kind === "dial" ? "ns-resize" : hit?.direct?.kind === "screen" ? "crosshair" : hit ? "grab" : "grab";
      setHover(hit, dragPoint());
    }
  }
  function pointerUp(event) {
    if (!down) {
      direct.release("mouse");
      return;
    }
    setPointer(event);
    if (direct.hold("mouse")) direct.end("mouse", { position: dragPoint() });
    else if (Math.hypot(event.clientX - down.x, event.clientY - down.y) < 5 && down.hit?.object.userData.kind === "part")
      onPart(down.hit.object.userData.id);
    down = null;
    direct.release("mouse");
    controls.enabled = true;
    if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
    updateFlexibleLeads();
  }
  function pointerCancel() {
    if (direct.hold("mouse")) direct.block("mouse");
    down = null;
    controls.enabled = !renderer.xr.isPresenting;
    setHover(null);
  }
  const pointerLeave = () => {
    if (!down) setHover(null);
  };
  renderer.domElement.addEventListener("pointerdown", pointerDown, true);
  renderer.domElement.addEventListener("pointermove", pointerMove);
  renderer.domElement.addEventListener("pointerup", pointerUp);
  renderer.domElement.addEventListener("pointercancel", pointerCancel);
  renderer.domElement.addEventListener("pointerleave", pointerLeave);

  function framePanelPreview() {
    xrPanels.updateWorldMatrix(true, true);
    const bounds = new THREE.Box3().setFromObject(xrPanels),
      target = bounds.getCenter(new THREE.Vector3());
    const corners = [];
    for (const x of [bounds.min.x, bounds.max.x])
      for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) corners.push(new THREE.Vector3(x, y, z));
    const direction = new THREE.Vector3(0, 0.12, 1).normalize();
    let distance = 4;
    for (let iteration = 0; iteration < 9; iteration++) {
      camera.position.copy(target).addScaledVector(direction, distance);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      const projected = corners.map((point) => point.clone().project(camera));
      const minX = Math.min(...projected.map((point) => point.x)),
        maxX = Math.max(...projected.map((point) => point.x)),
        minY = Math.min(...projected.map((point) => point.y)),
        maxY = Math.max(...projected.map((point) => point.y));
      const halfHeight = distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      target.addScaledVector(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0), (minX + maxX) * 0.5 * halfHeight * camera.aspect);
      target.addScaledVector(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1), (minY + maxY) * 0.5 * halfHeight);
      distance = Math.max(controls.minDistance, distance * Math.max(0.75, Math.min(1.35, Math.max((maxX - minX) / 1.78, (maxY - minY) / 1.78))));
    }
    controls.target.copy(target);
    camera.position.copy(target).addScaledVector(direction, distance);
    camera.lookAt(target);
    controls.update();
  }
  function setPanelPreview(enabled) {
    if (renderer.xr.isPresenting || disposed) return;
    enabled = !!enabled;
    const changed = enabled !== panelPreview;
    if (enabled && !panelPreview)
      previewCamera = { position: camera.position.clone(), quaternion: camera.quaternion.clone(), target: controls.target.clone() };
    panelPreview = enabled;
    xrPanels.visible = enabled;
    renderer.shadowMap.needsUpdate = true;
    if (enabled) {
      positionPanels(1.6);
      framePanelPreview();
    } else if (previewCamera) {
      camera.position.copy(previewCamera.position);
      camera.quaternion.copy(previewCamera.quaternion);
      controls.target.copy(previewCamera.target);
      controls.update();
      previewCamera = null;
    }
    setHover(null);
    drawActions();
    if (changed) onPanelPreviewChange(enabled);
  }

  const controllers = [];
  const rotationMatrix = new THREE.Matrix4();
  const locomotion = createLocomotion({
    obstacles: [
      { minX: -1.07, maxX: 1.07, minZ: -1.7, maxZ: -0.27 },
      { minX: 0.55, maxX: 1.22, minZ: -0.46, maxZ: 0.25 },
      { minX: -1.22, maxX: -0.55, minZ: -0.46, maxZ: 0.25 },
    ],
    bounds: { minX: -3.1, maxX: 3.1, minZ: -4.6, maxZ: 2.4 },
  });
  let suspended = false,
    lastFrameTime = 0,
    activeSession = null;
  function suspendInput() {
    direct.cancelAll();
    locomotion.reset();
    down = null;
    for (const input of controllers) {
      input.armed = false;
      input.lastQuaternion = null;
      input.stickPressed = false;
    }
    controls.enabled = !renderer.xr.isPresenting;
  }
  function sessionVisibility() {
    suspended = document.visibilityState === "hidden" || (!!activeSession?.visibilityState && activeSession.visibilityState !== "visible");
    suspendInput();
  }
  const windowBlur = () => {
    if (!renderer.xr.isPresenting) {
      suspended = true;
      suspendInput();
    }
  };
  const windowFocus = () => {
    if (!renderer.xr.isPresenting) {
      suspended = false;
      suspendInput();
    }
  };
  window.addEventListener("blur", windowBlur);
  window.addEventListener("focus", windowFocus);
  document.addEventListener("visibilitychange", sessionVisibility);
  function controllerRay(input) {
    input.controller.updateWorldMatrix(true, false);
    rotationMatrix.extractRotation(input.controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(input.controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(rotationMatrix);
  }
  function controllerSample(input, hold) {
    const quaternion = input.grip.getWorldQuaternion(new THREE.Quaternion());
    const hand = input.grip.getWorldPosition(new THREE.Vector3());
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion);
    const tipQuaternion = quaternion.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2));
    const sample = hold?.probe
      ? probeGripPose(hand, quaternion, hold.probePickupQuaternion, hold.probe.unit.length)
      : { position: hand.addScaledVector(direction, 0.08), quaternion: tipQuaternion };
    if (hold?.target.kind === "dial") {
      const axis = new THREE.Vector3(...(hold.target.axis === "y" ? [0, 1, 0] : hold.target.axis === "x" ? [1, 0, 0] : [0, 0, 1])).applyQuaternion(
        hold.target.object.getWorldQuaternion(new THREE.Quaternion())
      );
      sample.turn = input.lastQuaternion ? -signedTwistAngle(quaternion.clone().multiply(input.lastQuaternion.clone().invert()), axis) : 0;
    }
    if (hold?.target.kind === "screen") {
      controllerRay(input);
      Object.assign(sample, graphSample(raycaster.intersectObject(hold.target.object, true)[0], hold.target));
    }
    input.lastQuaternion = quaternion;
    return sample;
  }
  function startController(input, button) {
    if (!input.armed || suspended || !renderer.xr.isPresenting || direct.hold(input.id)) return;
    controllerRay(input);
    let hit = pick();
    if (button === "grip") {
      const hand = input.grip.getWorldPosition(new THREE.Vector3());
      const nearby = activeTargets()
        .flatMap((object) => {
          const list = [];
          object.traverse((node) => {
            const target = descriptorFor(node);
            if (target && ["probe", "plug", "dial", "terminal", "button", "switch"].includes(target.kind) && visible(node))
              list.push({ node, target, point: node.getWorldPosition(new THREE.Vector3()) });
          });
          return list;
        })
        .sort((a, b) => a.point.distanceTo(hand) - b.point.distanceTo(hand));
      if (!nearby.length || nearby[0].point.distanceTo(hand) > 0.12) return;
      hit = { object: nearby[0].node, direct: nearby[0].target, point: nearby[0].point };
    }
    input.button = button;
    input.lastQuaternion = input.grip.getWorldQuaternion(new THREE.Quaternion());
    if (beginAt(input.id, hit)) {
      const hold = direct.hold(input.id);
      if (hold?.probe) hold.probePickupQuaternion = input.lastQuaternion.clone();
      if (hold && ["probe", "plug", "terminal"].includes(hold.target.kind)) direct.move(input.id, controllerSample(input, hold));
    }
  }
  function endController(input, button) {
    if (input.button === button) {
      const hold = direct.hold(input.id);
      if (hold) direct.end(input.id, controllerSample(input, hold));
      input.button = null;
      input.lastQuaternion = null;
    }
    direct.release(input.id);
  }
  for (let index = 0; index < 2; index++) {
    const controller = renderer.xr.getController(index),
      grip = renderer.xr.getControllerGrip(index);
    const ray = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -1)]),
      new THREE.LineBasicMaterial({ color: "#bbc8c8", transparent: true, opacity: 0.55 })
    );
    controller.add(ray);
    ray.scale.z = 2;
    const cursor = new THREE.Mesh(new THREE.SphereGeometry(0.007, 12, 8), new THREE.MeshBasicMaterial({ color: "#d7c98b", depthTest: false }));
    cursor.visible = false;
    scene.add(cursor);
    const input = {
      id: `controller:${index}`,
      controller,
      grip,
      ray,
      cursor,
      source: null,
      armed: false,
      button: null,
      stickPressed: false,
      lastQuaternion: null,
    };
    controller.addEventListener("connected", (event) => {
      input.source = event.data;
      input.armed = false;
      controller.visible = true;
    });
    controller.addEventListener("disconnected", () => {
      direct.block(input.id);
      input.source = null;
      input.armed = false;
      controller.visible = false;
      cursor.visible = false;
    });
    controller.addEventListener("selectstart", () => startController(input, "trigger"));
    controller.addEventListener("selectend", () => endController(input, "trigger"));
    controller.addEventListener("squeezestart", () => startController(input, "grip"));
    controller.addEventListener("squeezeend", () => endController(input, "grip"));
    const handle = mesh(rounded(0.037, 0.075, 0.045, 0.013), shared.navy, grip, 0, -0.017, 0.015);
    handle.rotation.x = -0.35;
    mesh(new THREE.SphereGeometry(0.022, 12, 8), shared.teal, grip, 0, 0.019, -0.012);
    rig.add(controller, grip);
    controllers.push(input);
  }

  let desktopSnapshot = null;
  let needsRecenter = false;
  let floorReference = true;
  function positionPanels(eyeHeight) {
    // The displays face the recentered viewer and stay fixed while students move.
    const eye = new THREE.Vector3(0, eyeHeight, 0);
    liveMount.position.set(1.24, Math.max(1.61, eyeHeight - 0.01), -1.02);
    actionMount.position.set(0, Math.max(1.58, eyeHeight + 0.04), -1.45);
    liveMount.lookAt(eye);
    actionMount.lookAt(eye);
  }
  function recenterVR() {
    if (!renderer.xr.isPresenting) return false;
    suspendInput();
    needsRecenter = true;
    return true;
  }
  const vrSession = createVRSession({
    xrManager: renderer.xr,
    navigatorXR: () => navigator.xr,
    isSecureContext: () => window.isSecureContext,
    visibilityTarget: document,
    onStatus: onXRStatus,
    onBeforeSession: ({ floorReference: hasFloor }) => {
      suspendInput();
      desktopSnapshot = snapshotDesktopView(camera, controls);
      floorReference = hasFloor;
      controls.enabled = false;
      rig.position.set(0, hasFloor ? 0 : 1.6, 0);
      rig.quaternion.identity();
      camera.position.set(0, 0, 0);
      camera.quaternion.identity();
    },
    onSessionStarted: ({ session }) => {
      activeSession = session;
      suspended = false;
      activeSession?.addEventListener("visibilitychange", sessionVisibility);
      suspendInput();
      floor.visible = false;
      vrEnvironment.visible = true;
      xrPanels.visible = true;
      onHover(null);
      needsRecenter = true;
      renderer.shadowMap.needsUpdate = true;
      drawActions();
    },
    onSessionEnded: () => {
      suspendInput();
      activeSession?.removeEventListener("visibilitychange", sessionVisibility);
      activeSession = null;
      suspended = false;
      needsRecenter = false;
      floor.visible = false;
      vrEnvironment.visible = true;
      xrPanels.visible = panelPreview;
      restoreDesktopView(camera, controls, rig, desktopSnapshot);
      desktopSnapshot = null;
      for (const input of controllers) {
        input.cursor.visible = false;
        input.stickPressed = false;
      }
      setHover(null);
      positionPanels(1.6);
      renderer.shadowMap.needsUpdate = true;
      resize();
      drawActions();
    },
  });
  function enterVR() {
    if (disposed) return Promise.resolve(false);
    if (panelPreview) setPanelPreview(false);
    return vrSession.toggle();
  }
  function refreshVRSupport() {
    return vrSession.refreshSupport();
  }

  function resize() {
    if (renderer.xr.isPresenting || disposed) return;
    const width = Math.max(1, container.clientWidth),
      height = Math.max(1, container.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (panelPreview) framePanelPreview();
    else if (!framedAspect || Math.abs(camera.aspect / framedAspect - 1) > 0.12) resetView();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  update(current);
  renderer.setAnimationLoop(
    visibleFrame(renderer, (now) => {
      if (disposed) return;
      onFrame(now);
      if (disposed) return;
      if (renderer.xr.isPresenting) {
        if (needsRecenter) {
          const frame = renderer.xr.getFrame(),
            space = renderer.xr.getReferenceSpace();
          const pose = frame && space ? frame.getViewerPose(space) : null;
          if (pose) {
            if (recenterRig(rig, pose, { floorReference, eyeHeight: 1.6 })) {
              positionPanels(floorReference ? pose.transform.position.y : 1.6);
              needsRecenter = false;
            }
          }
        }
        const xrCamera = renderer.xr.getCamera();
        const headPosition = xrCamera.getWorldPosition(new THREE.Vector3()),
          headQuaternion = xrCamera.getWorldQuaternion(new THREE.Quaternion());
        const left = controllers.find((input) => input.source?.handedness === "left")?.source?.gamepad;
        const right = controllers.find((input) => input.source?.handedness === "right")?.source?.gamepad;
        const axes = (gamepad) =>
          gamepad?.axes?.length >= 4 ? [gamepad.axes[2], gamepad.axes[3]] : [gamepad?.axes?.[0] || 0, gamepad?.axes?.[1] || 0];
        locomotion.update({
          rig,
          headPosition,
          headQuaternion,
          left: axes(left),
          right: axes(right)[0],
          dt: lastFrameTime ? (now - lastFrameTime) / 1000 : 0,
          enabled: !suspended,
        });
        let activeHit = null,
          activePoint = null;
        for (const input of controllers) {
          const gamepad = input.source?.gamepad;
          if (!suspended && !input.armed && gamepad && !gamepad.buttons[0]?.pressed && !gamepad.buttons[1]?.pressed) {
            input.armed = true;
            direct.release(input.id);
          }
          const stickPressed = input.armed && !!gamepad?.buttons[3]?.pressed;
          if (stickPressed && !input.stickPressed) recenterVR();
          input.stickPressed = stickPressed;
          controllerRay(input);
          const hit = !suspended && input.controller.visible ? pick() : null;
          input.ray.visible = !suspended;
          input.ray.scale.z = hit ? hit.distance : 2;
          const hold = direct.hold(input.id);
          if (hold && !suspended) direct.move(input.id, controllerSample(input, hold));
          const target =
            hold && ["probe", "terminal", "plug"].includes(hold.target.kind) ? nearestTerminal(hold.position, terminalPositions(), 0.055) : null;
          input.cursor.visible = !!hit || !!target;
          if (target) {
            input.cursor.position.copy(target.position);
            input.cursor.material.color.set("#88c39e");
          } else if (hit) {
            input.cursor.position.copy(hit.point);
            input.cursor.material.color.set("#d7c98b");
          }
          if (target) {
            activeHit = { object: target.hit, direct: target.hit.userData.direct, point: target.position };
            activePoint = target.position;
          } else if (hit && !activeHit) {
            activeHit = hit;
            activePoint = hit.point;
          }
        }
        setHover(activeHit, activePoint);
      } else controls.update();
      lastFrameTime = now;
      updateFlexibleLeads();
      renderer.render(scene, camera);
    })
  );

  function dispose() {
    suspendInput();
    disposed = true;
    activeSession?.removeEventListener("visibilitychange", sessionVisibility);
    window.removeEventListener("blur", windowBlur);
    window.removeEventListener("focus", windowFocus);
    document.removeEventListener("visibilitychange", sessionVisibility);
    void vrSession.dispose();
    renderer.setAnimationLoop(null);
    observer.disconnect();
    controls.dispose();
    renderer.domElement.removeEventListener("pointerdown", pointerDown, true);
    renderer.domElement.removeEventListener("pointermove", pointerMove);
    renderer.domElement.removeEventListener("pointerup", pointerUp);
    renderer.domElement.removeEventListener("pointercancel", pointerCancel);
    renderer.domElement.removeEventListener("pointerleave", pointerLeave);
    for (const probe of movableProbes.values()) {
      probe.pick.geometry.dispose();
      probe.pick.material.dispose();
      probe.unit.dispose();
      probe.cable.dispose();
    }
    for (const lead of looseLeads) removeLooseLead(lead);
    for (const unit of [...stationaryEquipment, ...componentEquipment, experimentControls].filter(Boolean)) unit.dispose();
    clearGroup(scene);
    for (const material of sharedMaterials) material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }
  function resetExperiment() {
    cancelInteractions();
    meterMode = "vdc";
    socketAllocator.clear();
    componentSignature = "";
    wireSignature = "";
    actionSignature = "";
    statusView = "status";
    scope.selectPanel?.(0);
    for (const probe of movableProbes.values()) {
      probe.loose = false;
      probe.connected = null;
      delete probe.restPose;
    }
  }
  function cancelInteractions() {
    suspendInput();
    for (const lead of [...looseLeads]) removeLooseLead(lead);
  }
  return { cancelInteractions, resetExperiment, update, enterVR, refreshVRSupport, recenterVR, resetView, setPanelPreview, dispose, renderer };
}
