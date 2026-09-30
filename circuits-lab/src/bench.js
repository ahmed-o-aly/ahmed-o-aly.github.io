import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { createDirectInteraction, createLocomotion, signedTwistAngle, nearestTerminal } from "./interaction.js";
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
  scene.background = new THREE.Color("#c6c9c9");
  scene.fog = new THREE.Fog("#c6c9c9", 14, 30);
  const camera = new THREE.PerspectiveCamera(39, 1, 0.05, 35);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor("#c6c9c9");
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.xr.enabled = true;
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
  const homeDirection = new THREE.Vector3(0.3, 2.6, 2.9).normalize();
  const homeTarget = new THREE.Vector3(0, 0.97, -1.0);
  let framedAspect = 0;
  function resetView() {
    if (renderer.xr.isPresenting) return;
    rig.position.set(0, 0, 0);
    camera.aspect = Math.max(1, container.clientWidth) / Math.max(1, container.clientHeight);
    camera.updateProjectionMatrix();
    controls.target.copy(homeTarget);
    let distance = 4.5;
    const corners = [];
    for (const x of [-0.97, 0.97]) for (const y of [0.81, 1.16]) for (const z of [-1.62, -0.31]) corners.push(new THREE.Vector3(x, y, z));
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

  function canvasSurface(width, height, worldW, worldH) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
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
      ctx.fillStyle = "#e4e9dc";
      ctx.font = nextSubtitle ? "600 72px monospace" : "600 104px monospace";
      textLine(ctx, nextTitle, 256, nextSubtitle ? 67 : 113, 496);
      ctx.fillStyle = "#cfdbcb";
      ctx.font = "54px monospace";
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
    actionSignature = "",
    graphSignature = "";
  let probeSignature = "";
  let actionPage = 0;
  let actionTab = "bench";
  let hovered = null;
  let hoverSignature = "";
  let panelPreview = false;
  let previewCamera = null;
  let graphView = "graph";
  let schematicURL = "";
  let schematicImage = null;
  let schematicVersion = 0;
  let livePage = 0;
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
    if (part.type === "R" && (part.label === "LOAD" || part.label === "BRANCH")) return "RL";
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
  function mountOnPart(unit, body, attachment) {
    registerEquipment(unit, componentEquipment);
    unit.group.scale.setScalar(1 / 0.36);
    unit.group.rotation.x = -0.53;
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
      if (["V", "I"].includes(part.type)) body.position.set(Math.sign(part.x || -1) * 2.15, 0.842, part.z);
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
            const unit = mountOnPart(createResistanceBox({ id: part.id, label: partName(part), parameter }), body, attachment);
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

      const valueLabel = label(partName(part), part.value, 0.5, 0.16);
      const verticalPins = partPins.length === 2 && Math.abs(partPins[1].z - partPins[0].z) > Math.abs(partPins[1].x - partPins[0].x);
      const labelZ = verticalPins ? Math.max(...partPins.map((pin) => pin.z)) + 0.22 : part.z + (part.type === "switch" ? 0.4 : 0.22);
      valueLabel.object.position.set(part.x, 0.933, labelZ);
      componentGroup.add(valueLabel.object);
      values.set(part.id, {
        value: part.value,
        label: part.label,
        draw: (_, value) => valueLabel.draw(partName(part), value),
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
        mesh(new THREE.CylinderGeometry(0.044, 0.044, 0.006, 6), shared.metal, componentGroup, pin.x, 0.934, pin.z);
        mesh(new THREE.CylinderGeometry(0.037, 0.041, 0.017, 32), red ? shared.red : shared.black, componentGroup, pin.x, 0.946, pin.z);
        mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.028, 32), red ? shared.red : shared.black, componentGroup, pin.x, 0.968, pin.z);
        for (const y of [0.956, 0.964, 0.972])
          mesh(new THREE.TorusGeometry(0.032, 0.0018, 5, 32), red ? shared.red : shared.navy, componentGroup, pin.x, y, pin.z).rotation.x =
            -Math.PI / 2;
        mesh(new THREE.TorusGeometry(0.018, 0.004, 8, 32), shared.metal, componentGroup, pin.x, 0.984, pin.z).rotation.x = -Math.PI / 2;
        mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.005, 24), shared.black, componentGroup, pin.x, 0.982, pin.z);
        const ring = mesh(new THREE.TorusGeometry(0.054, 0.0035, 6, 32), mat("#ece6bd", { roughness: 0.6 }), componentGroup, pin.x, 0.928, pin.z);
        ring.rotation.x = -Math.PI / 2;
        ring.visible = false;
        const hit = mesh(
          new THREE.SphereGeometry(0.068, 12, 8),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
          componentGroup,
          pin.x,
          0.984,
          pin.z
        );
        hit.castShadow = false;
        hit.receiveShadow = false;
        hit.userData = { kind: "terminal", id: pin.id, label: `${partName(part)} ${pin.label || pin.id}` };
        hit.userData.direct = { object: hit, kind: "terminal", id: pin.id, terminal: pin.id, label: hit.userData.label };
        targets.push(hit);
        pins.set(pin.id, { x: pin.x, z: pin.z, ring, hit, red, label: hit.userData.label });
        const pinLabel = label(pin.label || pin.id, "", 0.15, 0.063);
        pinLabel.object.position.set(pin.x, 0.932, pin.z + 0.086);
        componentGroup.add(pinLabel.object);
      }
    }
  }
  function routedLead(start, end) {
    const step = 0.04,
      minX = -1.58,
      minZ = -0.92,
      cols = 80,
      rows = 47;
    const gridPoint = (point) => ({
      x: Math.max(0, Math.min(cols - 1, Math.round((point.x - minX) / step))),
      z: Math.max(0, Math.min(rows - 1, Math.round((point.z - minZ) / step))),
    });
    const startCell = gridPoint(start),
      endCell = gridPoint(end);
    const key = (x, z) => z * cols + x;
    const startKey = key(startCell.x, startCell.z),
      endKey = key(endCell.x, endCell.z);
    const obstacles = current.components
      .filter((part) => part.type !== "ground")
      .map((part) => {
        let x = 0.1,
          z = 0.1;
        if (["V", "I"].includes(part.type)) {
          x = 0.265;
          z = 0.195;
        } else if (part.type === "R" || part.type === "L") {
          const vertical = part.pins?.length === 2 && Math.abs(part.pins[1].z - part.pins[0].z) > Math.abs(part.pins[1].x - part.pins[0].x);
          x = vertical ? 0.085 : 0.19;
          z = vertical ? 0.19 : 0.085;
        } else if (part.type === "opamp") {
          x = 0.16;
          z = 0.18;
        } else if (part.type === "switch") {
          x = 0.12;
          z = 0.1;
        }
        return { cx: part.x, cz: part.z, x, z };
      });
    const blocked = (x, z) => {
      const id = key(x, z);
      if (id === startKey || id === endKey) return false;
      const px = minX + x * step,
        pz = minZ + z * step;
      return obstacles.some((o) => Math.abs(px - o.cx) < o.x && Math.abs(pz - o.cz) < o.z);
    };
    const open = [startKey],
      cost = new Map([[startKey, 0]]),
      parent = new Map(),
      closed = new Set();
    const estimate = (id) => Math.hypot((id % cols) - endCell.x, Math.floor(id / cols) - endCell.z);
    for (let iteration = 0; open.length && iteration < cols * rows; iteration++) {
      let best = 0;
      for (let i = 1; i < open.length; i++) if (cost.get(open[i]) + estimate(open[i]) < cost.get(open[best]) + estimate(open[best])) best = i;
      const id = open.splice(best, 1)[0];
      if (id === endKey) break;
      closed.add(id);
      const x = id % cols,
        z = Math.floor(id / cols);
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]) {
        const nx = x + dx,
          nz = z + dz;
        if (nx < 0 || nx >= cols || nz < 0 || nz >= rows || blocked(nx, nz)) continue;
        if (dx && dz && (blocked(x + dx, z) || blocked(x, z + dz))) continue;
        const next = key(nx, nz),
          candidate = cost.get(id) + (dx && dz ? Math.SQRT2 : 1);
        if (closed.has(next) || (cost.has(next) && cost.get(next) <= candidate)) continue;
        cost.set(next, candidate);
        parent.set(next, id);
        if (!open.includes(next)) open.push(next);
      }
    }
    if (!parent.has(endKey)) return [start.clone(), start.clone().lerp(end, 0.5), end.clone()];
    const path = [];
    let cursor = endKey;
    while (cursor !== startKey) {
      path.push(new THREE.Vector3(minX + (cursor % cols) * step, 0.953, minZ + Math.floor(cursor / cols) * step));
      cursor = parent.get(cursor);
    }
    path.push(new THREE.Vector3(start.x, 0.953, start.z));
    path.reverse();
    const simple = [path[0]];
    for (let i = 1; i < path.length - 1; i++) {
      const a = path[i]
          .clone()
          .sub(path[i - 1])
          .normalize(),
        b = path[i + 1].clone().sub(path[i]).normalize();
      if (a.distanceTo(b) > 0.1) simple.push(path[i]);
    }
    simple.push(path.at(-1));
    simple[0] = start.clone();
    simple[simple.length - 1] = end.clone();
    if (simple.length === 2) {
      const middle = start.clone().lerp(end, 0.5);
      middle.y = 0.953;
      simple.splice(1, 0, middle);
    }
    return simple;
  }
  function buildWires(wires) {
    clearGroup(wireGroup);
    wireTargets = [];
    plugTargets = [];
    wires.forEach(([a, b], index) => {
      const startPin = pins.get(a),
        endPin = pins.get(b);
      if (!startPin || !endPin) return;
      const grounded = a === "gnd" || b === "gnd" || a.endsWith("-") || b.endsWith("-") || a === "return" || b === "return";
      const material = mat(grounded ? "#202121" : "#8b2925", { roughness: 0.79 });
      const start = new THREE.Vector3(startPin.x, 1.002, startPin.z),
        end = new THREE.Vector3(endPin.x, 1.002, endPin.z);
      const points = routedLead(start, end);
      for (let i = 1; i < points.length - 1; i++) points[i].y = 0.948 + (index % 3) * 0.004;
      const wire = tube(points, 0.009, material, wireGroup, Math.max(32, points.length * 6));
      wire.userData = { kind: "wire", index };
      const hit = tube(
        points,
        0.019,
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
        wireGroup,
        Math.max(32, points.length * 6)
      );
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

  function terminalPositions() {
    board.updateWorldMatrix(true, false);
    return [...pins].map(([id, pin]) => ({ id, position: board.localToWorld(new THREE.Vector3(pin.x, 1.002, pin.z)) }));
  }
  function terminalPosition(id) {
    return terminalPositions().find((pin) => pin.id === id)?.position || null;
  }
  function connectedTerminal(channel) {
    if (channel === "red" || channel === "black") return current.probes?.[channel] || null;
    const which = channel.slice(0, 3);
    return current.scope?.[which]?.[channel.endsWith("Ground") ? "ground" : "signal"] || null;
  }
  const meter = registerEquipment(createMultimeter());
  meter.group.position.set(-0.68, 0.823, -1.4);
  meter.group.rotation.x = -0.56;
  equipmentGroup.add(meter.group);
  let scope = registerEquipment(createRecorder({ module: "thevenin" }));
  scope.group.position.set(0.45, 0.823, -1.42);
  scope.group.rotation.x = -0.32;
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
        scope.group.position.set(0.45, 0.823, -1.42);
        scope.group.rotation.x = -0.32;
        equipmentGroup.add(scope.group);
      }
      equipmentSignature = signature;
      experimentControls?.dispose();
      experimentControls = createExperimentControls({ module: current.module || "thevenin" });
      registerEquipment(experimentControls, []);
      experimentControls.group.position.set(-0.2, 0.823, -1.4);
      experimentControls.group.rotation.x = -0.42;
      equipmentGroup.add(experimentControls.group);
    }
    for (const unit of [...stationaryEquipment, ...componentEquipment, experimentControls].filter(Boolean)) unit.update({ ...current, meterMode });
    for (const probe of movableProbes.values()) {
      const visible = !probe.channel.startsWith("ch") || current.module === "opamp";
      probe.unit.group.visible = probe.cable.group.visible = visible;
      if (direct.isHeld(`probe:${probe.channel}`)) continue;
      const id = connectedTerminal(probe.channel);
      if (id !== probe.connected || rebuilt) {
        probe.connected = id;
        const contact = terminalPosition(id);
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
  function cableCurve(start, end, offset = 0) {
    // Intermediate cable points sit above the PCB/mat, never inside the solid board.
    const points = [start.clone()];
    for (const fraction of [0.16, 0.34, 0.56, 0.78, 0.91]) {
      const point = start.clone().lerp(end, fraction);
      const abovePCB = Math.abs(point.x) < 0.603 && point.z > -1.14 && point.z < -0.39;
      point.y = Math.max(abovePCB ? 0.87 : 0.828, point.y - Math.sin(Math.PI * fraction) * 0.11);
      point.x += Math.sin(Math.PI * fraction) * offset;
      points.push(point);
    }
    points.push(end.clone());
    return points;
  }
  function updateFlexibleLeads() {
    for (const probe of movableProbes.values()) {
      if (!probe.unit.group.visible) continue;
      const channel = probe.channel;
      const anchor =
        channel === "red" ? meter.anchors.V : channel === "black" ? meter.anchors.COM : scope.anchors[channel.startsWith("ch1") ? "CH1" : "CH2"];
      const start = anchor?.getWorldPosition(new THREE.Vector3());
      const end = probe.unit.anchors.cable.getWorldPosition(new THREE.Vector3());
      if (start) probe.cable.update(cableCurve(start, end, channel === "black" ? -0.08 : 0.04));
    }
    for (const lead of looseLeads) {
      const start = terminalPosition(lead.from);
      if (!start) {
        lead.cable.group.visible = lead.plug.visible = false;
        continue;
      }
      lead.cable.update(cableCurve(start, lead.plug.position));
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
  const hoverLabel = canvasSurface(768, 144, 0.57, 0.107);
  hoverLabel.object.visible = false;
  hoverLabel.object.renderOrder = 9;
  scene.add(hoverLabel.object);
  let hoverPoint = null;
  const boardPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(0.52 + 0.36 * 1.002));
  function refreshInteractionVisuals() {
    for (const [id, pin] of pins) {
      const selected = id === current.selectedTerminal,
        over = hovered?.kind === "terminal" && hovered.id === id;
      pin.ring.visible = selected || over;
      pin.ring.material.color.set(selected ? "#f4d973" : "#e6eef5");
      pin.ring.scale.setScalar(selected ? 1.27 : 1.12);
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
    hoverLabel.object.visible = !!hovered && !!hoverPoint && (renderer.xr.isPresenting || panelPreview);
    if (hoverLabel.object.visible) {
      hoverLabel.object.position.copy(hoverPoint).add(new THREE.Vector3(0, 0.17, 0));
      camera.getWorldQuaternion(hoverLabel.object.quaternion);
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
    mesh(
      rounded(surface.object.geometry.parameters.width + 0.045, surface.object.geometry.parameters.height + 0.045, 0.042, 0.02),
      shared.navy,
      group,
      0,
      0,
      -0.026
    );
    group.add(surface.object);
    return group;
  }
  const actionPanel = canvasSurface(1024, 1200, 1.08, 1.265);
  const livePanel = canvasSurface(1400, 670, 1.64, 0.785);
  const graphPanel = canvasSurface(1400, 540, 1.64, 0.633);
  const actionMount = panel(actionPanel, -1.8, 1.42, -1.75, 0.48);
  const liveMount = panel(livePanel, 1.83, 1.42, -1.92, -0.48);
  const graphMount = panel(graphPanel, 0.0, 1.54, -2.85);
  const actionBoxes = [];
  const liveBoxes = [];
  function panelBase(surface, eyebrow, title) {
    const { context: ctx, canvas } = surface;
    ctx.fillStyle = "#eff0ed";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#495a66";
    ctx.font = "600 25px Arial, sans-serif";
    ctx.fillText(eyebrow, 48, 57);
    ctx.fillStyle = "#193743";
    ctx.font = "600 43px Arial, sans-serif";
    textLine(ctx, title, 48, 119, canvas.width - 96);
    return ctx;
  }
  let focusPartSettings = true;
  function drawActions() {
    const ctx = panelBase(actionPanel, "LAB GUIDE", "Experiments");
    actionBoxes.length = 0;
    const button = (x, y, w, h, title, callback) => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#a0aaa8";
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = "#273b42";
      ctx.font = "600 31px Arial";
      ctx.textAlign = "center";
      textLine(ctx, title, x + w / 2, y + h / 2 + 10, w - 20);
      ctx.textAlign = "left";
      actionBoxes.push({ x, y, w, h, action: callback });
    };
    const labs = (current.actions || []).filter((a) => String(a.group).toLowerCase() === "labs");
    labs.forEach((action, i) => button(42, 148 + i * 78, 940, 65, action.label, () => onAction(action.id)));
    const guide = (current.actions || []).filter((a) => String(a.group).toLowerCase() === "guide" || ["undo", "check-wiring"].includes(a.id));
    guide
      .slice(0, 4)
      .forEach((action, i) => button(42 + (i % 2) * 478, 480 + Math.floor(i / 2) * 77, 462, 64, action.label, () => onAction(action.id)));
    ctx.fillStyle = "#273b42";
    ctx.font = "31px Arial";
    const instructions = renderer.xr.isPresenting
      ? [
          "Grip: pick up probes and plugs.",
          "Release at a terminal to connect.",
          "Trigger: turn knobs or use switches.",
          "Left stick: move. Right stick: turn.",
          "Stick click: recenter at the bench.",
        ]
      : [
          "Drag probes onto terminals.",
          "Drag between terminals to wire.",
          "Pull a plug out to disconnect it.",
          "Drag knobs. Click switches.",
          "Drag empty space to look around.",
        ];
    instructions.forEach((line, i) => ctx.fillText(line, 48, 692 + i * 55));
    button(42, 1010, 458, 64, "Recenter", () => recenterVR());
    button(520, 1010, 462, 64, renderer.xr.isPresenting ? "Exit VR" : "Close guide", () =>
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
  function drawLive() {
    const ctx = panelBase(livePanel, "MEASUREMENTS AND INSTRUCTIONS", current.live?.title || "Circuit bench");
    ctx.font = "32px Arial, sans-serif";
    // Wrap every supplied instruction, then paginate; never silently crop experiment instructions.
    const rows = [];
    for (const paragraph of current.live?.lines || []) {
      let line = "";
      for (const word of String(paragraph).split(/\s+/)) {
        const next = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(next).width > 1304) {
          rows.push(line);
          line = word;
        } else line = next;
      }
      if (line) rows.push(line);
      rows.push("");
    }
    while (rows.at(-1) === "") rows.pop();
    const pages = Math.max(1, Math.ceil(rows.length / 10));
    livePage = Math.max(0, Math.min(livePage, pages - 1));
    ctx.fillStyle = "#294752";
    rows.slice(livePage * 10, livePage * 10 + 10).forEach((line, index) => ctx.fillText(line, 48, 181 + index * 39));
    liveBoxes.length = 0;
    const navigation = [
      {
        x: 48,
        label: "‹ Previous readings",
        enabled: livePage > 0,
        action: () => {
          livePage--;
          drawLive();
        },
      },
      {
        x: 957,
        label: "More readings ›",
        enabled: livePage < pages - 1,
        action: () => {
          livePage++;
          drawLive();
        },
      },
    ];
    for (const item of navigation) {
      ctx.fillStyle = item.enabled ? "#dce2e5" : "#e7eeee";
      ctx.fillRect(item.x, 595, 395, 50);
      ctx.fillStyle = item.enabled ? "#334e62" : "#9aadae";
      ctx.font = "600 28px Arial, sans-serif";
      ctx.fillText(item.label, item.x + 24, 630);
      if (item.enabled) liveBoxes.push({ ...item, y: 595, w: 395, h: 50 });
    }
    ctx.fillStyle = "#617b84";
    ctx.font = "27px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${livePage + 1} / ${pages}`, 700, 630);
    ctx.textAlign = "left";
    livePanel.texture.needsUpdate = true;
  }
  livePanel.object.userData = {
    kind: "panel",
    activate: (intersection) => {
      const x = intersection.uv.x * livePanel.canvas.width,
        y = (1 - intersection.uv.y) * livePanel.canvas.height;
      liveBoxes.find((box) => x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h)?.action();
    },
  };
  function drawGraph() {
    const ctx = panelBase(
      graphPanel,
      "MEASUREMENT DISPLAY",
      graphView === "schematic" ? "Circuit schematic" : current.graph?.title || "Measured response"
    );
    const width = graphPanel.canvas.width,
      height = graphPanel.canvas.height;
    for (const [view, x, w, title] of [
      ["graph", 1010, 155, "Graph"],
      ["schematic", 1178, 184, "Schematic"],
    ]) {
      ctx.fillStyle = graphView === view ? "#314c5d" : "#fff";
      ctx.fillRect(x, 22, w, 52);
      ctx.fillStyle = graphView === view ? "#fff" : "#314c5d";
      ctx.font = "600 25px Arial";
      ctx.textAlign = "center";
      ctx.fillText(title, x + w / 2, 57);
      ctx.textAlign = "left";
    }
    if (graphView === "schematic") {
      if (schematicImage) {
        const maxW = 1350,
          maxH = 370,
          scale = Math.min(maxW / schematicImage.width, maxH / schematicImage.height),
          w = schematicImage.width * scale,
          h = schematicImage.height * scale;
        ctx.fillStyle = "#fff";
        ctx.fillRect(25, 150, maxW, maxH);
        ctx.drawImage(schematicImage, 25 + (maxW - w) / 2, 150 + (maxH - h) / 2, w, h);
      } else {
        ctx.fillStyle = "#61737c";
        ctx.font = "30px Arial";
        ctx.fillText("Circuit reference is loading.", 48, 228);
      }
      graphPanel.texture.needsUpdate = true;
      return;
    }
    const graph = current.graph || {};
    if (graph.subtitle) {
      ctx.fillStyle = "#617b84";
      ctx.font = "26px Arial";
      textLine(ctx, graph.subtitle, 48, 161, width - 96);
    }
    const panels = graph.panels?.length ? graph.panels : [graph];
    const count = Math.min(3, panels.length);
    for (let index = 0; index < count; index++) {
      const chart = panels[index],
        offset = (index * width) / count,
        paneWidth = width / count;
      const left = offset + (count === 1 ? 151 : 119),
        right = offset + paneWidth - (count === 1 ? 62 : 28),
        top = count === 1 ? 194 : 222,
        bottom = height - 112;
      const plotX = (value) => left + value * (right - left),
        plotY = (value) => bottom - value * (bottom - top);
      if (count > 1) {
        ctx.fillStyle = "#29444f";
        ctx.font = "600 27px Arial";
        textLine(ctx, chart.title || chart.yLabel || `Channel ${index + 1}`, offset + 28, 198, paneWidth - 56);
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#c9d6d8";
      const xDivisions = chart.xDivisions || graph.xDivisions || 8,
        yDivisions = chart.yDivisions || graph.yDivisions || 4;
      for (let i = 0; i <= xDivisions; i++) {
        const x = left + (i / xDivisions) * (right - left);
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
        ctx.stroke();
      }
      for (let i = 0; i <= yDivisions; i++) {
        const y = top + (i / yDivisions) * (bottom - top);
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
      }
      ctx.save();
      ctx.beginPath();
      ctx.rect(left - 3, top - 3, right - left + 6, bottom - top + 6);
      ctx.clip();
      for (const series of chart.series || []) {
        ctx.strokeStyle = series.color || "#23617d";
        ctx.lineWidth = 4;
        ctx.beginPath();
        let started = false;
        for (const [x, y] of series.points || []) {
          if (!Number.isFinite(x) || !Number.isFinite(y)) {
            started = false;
            continue;
          }
          if (!started) ctx.moveTo(plotX(x), plotY(y));
          else ctx.lineTo(plotX(x), plotY(y));
          started = true;
        }
        ctx.stroke();
      }
      if (chart.reference && Number.isFinite(chart.reference.x)) {
        const x = plotX(chart.reference.x);
        ctx.strokeStyle = "#996c34";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#805827";
        ctx.font = "600 23px Arial";
        const labelWidth = ctx.measureText(chart.reference.label || "").width;
        ctx.fillText(chart.reference.label || "", Math.max(left + 7, Math.min(x + 10, right - labelWidth - 7)), top + 25);
      }
      if (chart.marker && Number.isFinite(chart.marker.x) && Number.isFinite(chart.marker.y)) {
        ctx.beginPath();
        ctx.arc(plotX(chart.marker.x), plotY(chart.marker.y), 7, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#aa562e";
        ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle = "#536e7a";
      ctx.font = `${count === 1 ? 25 : 23}px Arial`;
      ctx.strokeStyle = "#829da8";
      ctx.lineWidth = 2;
      ctx.textAlign = "center";
      for (const tick of chart.xTicks || []) {
        if (!Number.isFinite(tick.position)) continue;
        const x = plotX(tick.position);
        ctx.beginPath();
        ctx.moveTo(x, bottom);
        ctx.lineTo(x, bottom + 7);
        ctx.stroke();
        textLine(ctx, String(tick.label), x, bottom + 35, count === 1 ? 230 : 130);
      }
      ctx.textAlign = "right";
      for (const tick of chart.yTicks || []) {
        if (!Number.isFinite(tick.position)) continue;
        const y = plotY(tick.position);
        ctx.beginPath();
        ctx.moveTo(left - 7, y);
        ctx.lineTo(left, y);
        ctx.stroke();
        textLine(ctx, String(tick.label), left - 13, y + 8, count === 1 ? 104 : 87);
      }
      ctx.font = "25px Arial";
      ctx.textAlign = "center";
      textLine(ctx, chart.xLabel || graph.xLabel || "Time", (left + right) / 2, height - 22, right - left);
      ctx.save();
      ctx.translate(offset + 26, (top + bottom) / 2);
      ctx.rotate(-Math.PI / 2);
      textLine(ctx, chart.yLabel || "Response", 0, 0, bottom - top + 50);
      ctx.restore();
      ctx.textAlign = "left";
    }
    graphPanel.texture.needsUpdate = true;
  }
  graphPanel.object.userData = {
    kind: "panel",
    activate: (intersection) => {
      const x = intersection.uv.x * graphPanel.canvas.width,
        y = (1 - intersection.uv.y) * graphPanel.canvas.height;
      if (y >= 22 && y <= 78 && x >= 1010) {
        graphView = x < 1170 ? "graph" : "schematic";
        drawGraph();
      }
    },
  };

  function makeLooseLead(target, position) {
    const cable = createCable({ color: target.color || "#862926", radius: 0.0038 });
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
    const descriptor = {
      object: sleeve,
      kind: "plug",
      id: `loose:${Math.random().toString(36).slice(2)}`,
      from: lead.from,
      label: "Grab loose plug",
      lead,
      color: target.color,
    };
    sleeve.userData.direct = descriptor;
    lead.target = descriptor;
    scene.add(plug, cable.group);
    looseLeads.add(lead);
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
    onAction,
    onHold: (phase, hold, result) => {
      const target = hold.target;
      if (phase === "start") {
        if (["probe", "plug", "terminal"].includes(target.kind)) onManipulation("begin", hold);
        if (target.kind === "probe") {
          const probe = movableProbes.get(target.channel);
          if (probe) {
            probe.loose = true;
            hold.probe = probe;
            hold.position = probe.unit.group.position.clone();
          }
        } else if (target.kind === "terminal" || target.kind === "plug") {
          hold.lead = target.lead || makeLooseLead(target, hold.position || terminalPosition(target.terminal));
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
          const contact = terminalPosition(result.terminal);
          if (contact) {
            probe.unit.group.position.copy(contact);
            probe.unit.group.rotation.set(-0.24, 0, 0.25);
            probe.loose = false;
          } else {
            // A released probe rests on the mat, with a tethered cable; it remains available to grab again.
            probe.unit.group.position.set(
              THREE.MathUtils.clamp(hold.position?.x ?? probe.home.x, -0.88, 0.88),
              0.87,
              THREE.MathUtils.clamp(hold.position?.z ?? probe.home.z, -1.2, -0.34)
            );
            probe.unit.group.rotation.set(-Math.PI / 2, 0, 0);
            probe.loose = true;
          }
        }
        if (hold.lead) {
          if (result.kind === "connected" || result.kind === "cancelled" || target.kind === "terminal") removeLooseLead(hold.lead);
          else {
            hold.lead.plug.position.y = 0.87;
            hold.lead.plug.position.x = THREE.MathUtils.clamp(hold.lead.plug.position.x, -0.58, 0.58);
            hold.lead.plug.position.z = THREE.MathUtils.clamp(hold.lead.plug.position.z, -1.1, -0.41);
          }
        }
        if (["probe", "plug", "terminal"].includes(target.kind)) onManipulation("end", hold);
        renderer.shadowMap.needsUpdate = true;
      }
    },
  });

  function update(model) {
    if (model.live?.title && model.live.title !== current.live?.title) livePage = 0;
    if (model.selectedPart && model.selectedPart !== current.selectedPart) {
      actionTab = "settings";
      actionPage = 0;
      focusPartSettings = true;
    }
    current = { ...current, ...model };
    const nextComponents = JSON.stringify(current.components.map(({ value, ...rest }) => rest));
    let rebuilt = false;
    if (nextComponents !== componentSignature) {
      componentSignature = nextComponents;
      direct.cancelAll();
      for (const lead of [...looseLeads]) removeLooseLead(lead);
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
    const nextLive = JSON.stringify(current.live);
    if (nextLive !== liveSignature) {
      liveSignature = nextLive;
      drawLive();
    }
    const nextActions = JSON.stringify([current.actions, current.tool, current.selectedTerminal, current.selectedPart, current.partActions]);
    if (nextActions !== actionSignature) {
      actionSignature = nextActions;
      drawActions();
    }
    const nextGraph = JSON.stringify(current.graph);
    if (nextGraph !== graphSignature) {
      graphSignature = nextGraph;
      drawGraph();
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
            drawGraph();
          }
        };
        img.onerror = () => {
          if (!disposed && version === schematicVersion) drawGraph();
        };
        img.src = schematicURL;
      }
      drawGraph();
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
      ...(xrPanels.visible ? [actionPanel.object, livePanel.object, graphPanel.object] : []),
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
        ? { kind: data.kind, id: data.id ?? String(data.index), label: data.label || data.id }
        : null;
    const signature = JSON.stringify([info, current.tool, current.selectedTerminal]);
    hovered = info;
    hoverPoint = hit?.point?.clone() || point?.clone() || null;
    if (signature !== hoverSignature) {
      hoverSignature = signature;
      onHover(info);
      if (info) {
        const ctx = hoverLabel.context;
        ctx.fillStyle = "#f2f1e9";
        ctx.fillRect(0, 0, 768, 144);
        ctx.strokeStyle = "#52616a";
        ctx.lineWidth = 5;
        ctx.strokeRect(2, 2, 764, 140);
        ctx.fillStyle = "#253d49";
        ctx.font = "600 43px Arial";
        ctx.textAlign = "center";
        textLine(ctx, info.label, 384, 63, 730);
        ctx.font = "31px Arial";
        textLine(
          ctx,
          {
            probe: "Grip or drag the probe",
            plug: "Pull out and place at a terminal",
            dial: "Hold and turn · drag up / down",
            screen: "Drag across the trace",
            button: "Press",
            switch: "Toggle",
            terminal: "Drag a lead to another terminal",
            wire: "Grab an end plug to disconnect",
            part: "Circuit component",
          }[info.kind] || "",
          384,
          113,
          730
        );
        hoverLabel.texture.needsUpdate = true;
      }
      drawActions();
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
      actionTab = "settings";
      actionPage = 0;
      focusPartSettings = true;
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
      hit.object.userData.activate(hit);
      return false;
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
          ? terminalPosition(target.terminal)
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
      const snapHit = contact ? { object: pins.get(contact.id).hit, direct: pins.get(contact.id).hit.userData.direct, point: contact.position } : hit;
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
    if (enabled) framePanelPreview();
    else if (previewCamera) {
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
    obstacles: [{ minX: -1.07, maxX: 1.07, minZ: -1.7, maxZ: -0.27 }],
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
    const position = hand.addScaledVector(direction, hold?.probe?.unit.length || 0.08);
    const tipQuaternion = quaternion.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2));
    const sample = { position, quaternion: tipQuaternion };
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
    // Optional instructions sit to the sides; the instruments stay on the table.
    actionMount.position.y = Math.max(1.25, eyeHeight - 0.04);
    graphMount.position.y = Math.max(1.28, eyeHeight - 0.04);
    liveMount.position.y = Math.max(1.38, eyeHeight - 0.04);
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
  renderer.setAnimationLoop((now) => {
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
          activeHit = { object: pins.get(target.id).hit, direct: pins.get(target.id).hit.userData.direct, point: target.position };
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
    if (hoverLabel.object.visible) camera.getWorldQuaternion(hoverLabel.object.quaternion);
    renderer.render(scene, camera);
  });

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
  function cancelInteractions() {
    suspendInput();
    for (const lead of [...looseLeads]) removeLooseLead(lead);
  }
  return { cancelInteractions, update, enterVR, refreshVRSupport, recenterVR, resetView, setPanelPreview, dispose, renderer };
}
