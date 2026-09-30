import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { OPTIONS } from "./modules.js";

// Dimensions are metres. Instruments face +Z and stand on local Y=0.
// Probe tips are at the origin, with the insulated handle extending along +Y.
const COLORS = {
  case: "#d5d6d1",
  face: "#e8e8e2",
  dark: "#262a2c",
  rubber: "#363b3c",
  metal: "#a5aaab",
  red: "#ad2f2c",
  black: "#25292b",
  ch1: "#d5b348",
  ch2: "#64a5b5",
};
const number = (value, digits = 3) =>
  Number.isFinite(Number(value)) && value !== null
    ? Number(value)
        .toFixed(digits)
        .replace(/\.?0+$/, "") || "0"
    : "—";
const resistance = (value) => (Number(value) >= 1000 ? `${number(Number(value) / 1000, 2)} kΩ` : `${number(Number(value), 1)} Ω`);
const point = (value) =>
  value?.isVector3
    ? value.clone()
    : Array.isArray(value)
      ? new THREE.Vector3(...value)
      : new THREE.Vector3(value?.x || 0, value?.y || 0, value?.z || 0);

function hardware(id) {
  const group = new THREE.Group();
  group.name = id;
  const targets = [],
    anchors = {},
    materials = new Set(),
    geometries = new Set(),
    textures = new Set();
  let disposed = false;
  const material = (color, options = {}) => {
    const value = new THREE.MeshStandardMaterial({ color, roughness: 0.66, metalness: 0.03, ...options });
    materials.add(value);
    return value;
  };
  const m = {
    case: material(COLORS.case),
    face: material(COLORS.face),
    dark: material(COLORS.dark),
    rubber: material(COLORS.rubber, { roughness: 0.87 }),
    metal: material(COLORS.metal, { metalness: 0.8, roughness: 0.27 }),
    red: material(COLORS.red),
    black: material(COLORS.black),
  };
  function mesh(geometry, mat, parent = group, position = [0, 0, 0]) {
    geometries.add(geometry);
    const object = new THREE.Mesh(geometry, mat);
    object.position.copy(point(position));
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  const box = (w, h, d, mat, parent, position, bevel = 0.002) =>
    mesh(
      bevel <= 0.0005 ? new THREE.BoxGeometry(w, h, d) : new RoundedBoxGeometry(w, h, d, 2, Math.min(bevel, w / 4, h / 4, d / 4)),
      mat,
      parent,
      position
    );
  function cylinder(radius, depth, mat, parent, position, radial = 24) {
    const geometry = new THREE.CylinderGeometry(radius, radius, depth, radial);
    geometry.rotateX(Math.PI / 2);
    return mesh(geometry, mat, parent, position);
  }
  function anchor(name, position, parent = group) {
    const object = new THREE.Object3D();
    object.name = name;
    object.position.copy(point(position));
    parent.add(object);
    anchors[name] = object;
    return object;
  }
  function target(object, descriptor) {
    const entry = { object, id: `${id}:${targets.length}`, axis: "z", ...descriptor };
    object.userData.equipmentTarget = entry;
    targets.push(entry);
    return entry;
  }
  function screen(width, height, position, { pixels = [768, 320], background = "#a7afa0", foreground = "#1d2a25" } = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = pixels[0];
    canvas.height = pixels[1];
    const ctx = canvas.getContext("2d");
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    const mat = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
    materials.add(mat);
    textures.add(texture);
    const object = mesh(new THREE.PlaneGeometry(width, height), mat, group, position);
    object.castShadow = false;
    let signature = null;
    return {
      object,
      canvas,
      ctx,
      texture,
      draw(data, painter) {
        const next = JSON.stringify(data);
        if (next === signature) return;
        signature = next;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = foreground;
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        painter(ctx, canvas.width, canvas.height);
        texture.needsUpdate = true;
      },
    };
  }
  function text(textValue, width, height, position, { size = 52, color = "#3c4243", background = "#e8e8e2", align = "center" } = {}) {
    const display = screen(width, height, position, { pixels: [768, 128], background, foreground: color });
    display.draw(textValue, (ctx, w, h) => {
      ctx.font = `600 ${size}px Arial, sans-serif`;
      ctx.textAlign = align;
      ctx.fillText(textValue, align === "center" ? w / 2 : 15, h / 2, w - 24);
    });
    return display;
  }
  function screw(x, y, z, parent = group) {
    cylinder(0.0022, 0.001, m.metal, parent, [x, y, z], 12);
    const slot = box(0.003, 0.0005, 0.0003, m.dark, parent, [x, y, z + 0.00065], 0.0001);
    slot.rotation.z = 0.5;
  }
  function enclosure(w, h, d) {
    box(w, h - 0.008, d, m.case, group, [0, h / 2 + 0.004, 0], 0.008);
    box(w - 0.008, h - 0.014, 0.006, m.face, group, [0, h / 2 + 0.005, d / 2], 0.004);
    for (const x of [-w / 2 + 0.014, w / 2 - 0.014]) {
      for (const y of [0.024, h - 0.018]) screw(x, y, d / 2 + 0.0038);
      for (const z of [-d / 2 + 0.02, d / 2 - 0.02]) box(0.025, 0.009, 0.032, m.rubber, group, [x, 0.0045, z], 0.002);
    }
    for (let i = 0; i < 12; i++) box(0.035, 0.0006, 0.002, m.dark, group, [w / 2 - 0.042, h + 0.0004, -d / 2 + 0.022 + i * 0.006], 0.00015);
    return d / 2 + 0.004;
  }
  function socket(name, x, y, z, color, { bnc = false, action, channel } = {}) {
    const tint = material(color);
    cylinder(bnc ? 0.0083 : 0.007, bnc ? 0.008 : 0.003, tint, group, [x, y, z + 0.002]);
    cylinder(bnc ? 0.0065 : 0.0048, bnc ? 0.009 : 0.002, m.metal, group, [x, y, z + 0.006]);
    cylinder(bnc ? 0.0042 : 0.0031, 0.001, m.dark, group, [x, y, z + (bnc ? 0.011 : 0.0075)]);
    if (bnc) {
      for (const side of [-1, 1]) cylinder(0.001, 0.004, m.metal, group, [x + side * 0.006, y, z + 0.009], 10);
    }
    const a = anchor(name, [x, y, z + 0.012]);
    if (action) {
      const pick = cylinder(0.012, 0.007, m.face, group, [x, y, z + 0.004]);
      pick.visible = false;
      target(pick, { kind: "probe", label: name, action, channel });
      // A visible socket mesh is also usable by ordinary recursive raycasters.
      target(group.children[group.children.indexOf(a) - 1], { kind: "probe", label: name, action, channel });
    }
    return a;
  }
  function dial(label, parameter, x, y, z, { radius = 0.011, values = OPTIONS[parameter], min, max, step = 1, color = COLORS.dark } = {}) {
    const mount = new THREE.Group();
    mount.position.set(x, y, z);
    group.add(mount);
    cylinder(radius + 0.003, 0.0016, m.metal, mount, [0, 0, 0]);
    const rotor = new THREE.Group();
    rotor.position.z = 0.003;
    rotor.userData.equipmentMoving = true;
    mount.add(rotor);
    const knobMaterial = material(color, { roughness: 0.79 });
    const knob = cylinder(radius, 0.016, knobMaterial, rotor, [0, 0, 0.008], 32);
    const ridges = [];
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const ridge = new THREE.CylinderGeometry(0.0005, 0.0005, 0.012, 6);
      ridge.rotateX(Math.PI / 2);
      ridge.translate(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.008);
      ridges.push(ridge);
    }
    mesh(mergeGeometries(ridges), knobMaterial, rotor);
    ridges.forEach((geometry) => geometry.dispose());
    box(0.0014, radius * 0.65, 0.0007, m.face, rotor, [0, radius * 0.49, 0.0164], 0.00015);
    for (let i = 0; i < 11; i++) {
      const angle = -Math.PI * 0.75 + (i / 10) * Math.PI * 1.5;
      const tick = box(
        0.0006,
        i % 5 === 0 ? 0.003 : 0.0018,
        0.0003,
        m.dark,
        mount,
        [Math.sin(angle) * (radius + 0.006), Math.cos(angle) * (radius + 0.006), 0.0008],
        0.0001
      );
      tick.rotation.z = -angle;
    }
    const descriptor = target(knob, { kind: "dial", label, parameter, values, min: min ?? values?.[0], max: max ?? values?.at(-1), step });
    knob.userData.equipmentTarget = descriptor;
    // Children are the visible knurled grip and indicator; associate all hits with the same control.
    rotor.traverse((object) => {
      if (object.isMesh) object.userData.equipmentTarget = descriptor;
    });
    function set(value) {
      const index = values?.indexOf(value);
      const fraction =
        values && index >= 0
          ? index / Math.max(1, values.length - 1)
          : Number.isFinite(value) && Number.isFinite(descriptor.min) && Number.isFinite(descriptor.max)
            ? THREE.MathUtils.clamp((value - descriptor.min) / (descriptor.max - descriptor.min || 1), 0, 1)
            : 0.5;
      rotor.rotation.z = (0.75 - fraction * 1.5) * Math.PI;
      descriptor.value = value;
    }
    return { descriptor, set, rotor };
  }
  function button(label, action, x, y, z, { color = "#6f7974", width = 0.025 } = {}) {
    const key = box(width, 0.012, 0.007, material(color), group, [x, y, z + 0.004], 0.002);
    target(key, { kind: "button", label, action });
    return key;
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    for (const resource of [...geometries, ...materials, ...textures]) resource.dispose();
    group.removeFromParent();
  }
  function finish() {
    // Keep controls independent; weld static housings, screws, ticks and vents by material.
    const interactive = new Set(targets.map((entry) => entry.object)),
      buckets = new Map();
    group.updateMatrixWorld(true);
    const inverse = group.matrixWorld.clone().invert();
    group.traverse((object) => {
      if (!object.isMesh || interactive.has(object) || Array.isArray(object.material)) return;
      for (let parent = object.parent; parent && parent !== group; parent = parent.parent) if (parent.userData.equipmentMoving) return;
      const list = buckets.get(object.material) || [];
      list.push(object);
      buckets.set(object.material, list);
    });
    for (const [mat, objects] of buckets) {
      if (objects.length < 2) continue;
      const parts = objects.map((object) => {
        const geometry = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
        geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, object.matrixWorld));
        return geometry;
      });
      const joined = mergeGeometries(parts);
      parts.forEach((geometry) => geometry.dispose());
      if (!joined) continue;
      const merged = mesh(joined, mat);
      const descriptor = objects.find((object) => object.userData.equipmentTarget)?.userData.equipmentTarget;
      if (descriptor) merged.userData.equipmentTarget = descriptor;
      for (const object of objects) {
        object.removeFromParent();
        object.geometry.dispose();
        geometries.delete(object.geometry);
      }
    }
  }
  return {
    group,
    targets,
    anchors,
    m,
    material,
    mesh,
    box,
    cylinder,
    screen,
    text,
    screw,
    enclosure,
    socket,
    dial,
    button,
    anchor,
    target,
    finish,
    dispose,
  };
}

export function createMultimeter({ id = "multimeter", label = "DIGITAL MULTIMETER" } = {}) {
  const h = hardware(id),
    { group, m } = h;
  h.box(0.11, 0.213, 0.046, h.material("#b49a49", { roughness: 0.88 }), group, [0, 0.112, 0], 0.012);
  h.box(0.096, 0.198, 0.008, m.dark, group, [0, 0.112, 0.024], 0.008);
  h.box(0.086, 0.052, 0.004, m.black, group, [0, 0.174, 0.03], 0.003);
  const lcd = h.screen(0.08, 0.043, [0, 0.174, 0.0325], { pixels: [640, 300] });
  h.text(label, 0.084, 0.01, [0, 0.207, 0.029], { size: 46, background: COLORS.dark, color: "#e0e1d8" });
  const selector = h.dial("Meter", "meterMode", 0, 0.106, 0.031, { radius: 0.02, values: ["off", "vdc"] });
  h.text("OFF", 0.024, 0.01, [-0.027, 0.078, 0.031], { background: COLORS.dark, color: "#d7d9d1" });
  h.text("V⎓", 0.023, 0.011, [0.028, 0.078, 0.031], { background: COLORS.dark, color: "#d7d9d1" });
  h.socket("COM", -0.025, 0.042, 0.031, COLORS.black);
  h.socket("V", 0.025, 0.042, 0.031, COLORS.red);
  h.text("COM          V", 0.085, 0.011, [0, 0.023, 0.031], { background: COLORS.dark, color: "#e0e1d8" });
  // Rear support stand and rubber corner pads keep the meter visibly separate from the trainer.
  const stand = h.box(0.067, 0.1, 0.006, m.dark, group, [0, 0.055, -0.061], 0.003);
  stand.rotation.x = -0.4;
  for (const x of [-0.044, 0.044]) h.box(0.014, 0.044, 0.006, m.rubber, group, [x, 0.022, 0.025], 0.003);
  function update(data = {}) {
    const measurement = data.measurement || {},
      mode = data.meterMode || "vdc";
    selector.set(mode);
    const value = measurement.probeReady ? measurement.probeVoltage : null;
    lcd.draw([mode, value, data.module], (ctx, w, ht) => {
      if (mode === "off") return;
      ctx.font = "500 35px Arial, sans-serif";
      ctx.fillText(data.module === "opamp" ? "V SAMPLE" : "DC V", 26, 43);
      ctx.font = "500 112px monospace";
      ctx.textAlign = "right";
      ctx.fillText(value === null ? "— — —" : number(value, 3), w - 34, ht * 0.57, w - 60);
      ctx.font = "30px Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(value === null ? "CONNECT PROBES" : "", 26, ht - 29);
    });
  }
  h.finish();
  update();
  return { group, targets: h.targets, anchors: h.anchors, update, dispose: h.dispose };
}

function plotBounds(width, height, count) {
  const margin = { l: 64, r: 24, t: 44, b: 54 },
    gap = 28;
  const plotH = (height - margin.t - margin.b - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, panel) => ({
    panel,
    left: margin.l / width,
    top: (margin.t + panel * (plotH + gap)) / height,
    width: (width - margin.l - margin.r) / width,
    height: plotH / height,
  }));
}

function plotScreen(ctx, width, height, graph, params) {
  ctx.fillStyle = "#151d20";
  ctx.fillRect(0, 0, width, height);
  const panels = graph?.panels?.length ? graph.panels : [graph];
  const validPanels = panels.filter(Boolean).slice(0, 3);
  const bounds = plotBounds(width, height, validPanels.length || 1);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "20px monospace";
  const state = params.recorder
    ? params.recorder === "transient"
      ? params.playing
        ? "ACQUIRING"
        : "PAUSED"
      : "CALCULATED · CURRENT WIRING"
    : params?.scopeRunning === false
      ? params.scopeStale
        ? "HOLD · OLD SETTINGS"
        : "HOLD"
      : "RUN";
  ctx.fillStyle = "#cad6d5";
  ctx.fillText(state, 18, 20);
  ctx.fillText(Number.isFinite(params?.timeDiv) ? `${number(params.timeDiv, 3)} ms/div` : graph?.xLabel || "TIME", width * 0.56, 20);
  if (!validPanels.length) {
    ctx.font = "24px Arial, sans-serif";
    ctx.fillText("Connect the channels", 40, height / 2);
    return;
  }
  for (let index = 0; index < validPanels.length; index++) {
    const panel = validPanels[index];
    const rect = bounds[index],
      x = rect.left * width,
      y = rect.top * height,
      plotW = rect.width * width,
      plotH = rect.height * height;
    ctx.strokeStyle = "#364146";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(x + (plotW * i) / 10, y);
      ctx.lineTo(x + (plotW * i) / 10, y + plotH);
      ctx.stroke();
    }
    for (let i = 0; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + (plotH * i) / 8);
      ctx.lineTo(x + plotW, y + (plotH * i) / 8);
      ctx.stroke();
    }
    ctx.font = "16px monospace";
    ctx.fillStyle = "#aebcbe";
    ctx.textAlign = "right";
    for (const tick of panel.yTicks || []) ctx.fillText(tick.label, x - 7, y + (1 - tick.position) * plotH, x - 9);
    ctx.textAlign = "center";
    for (const tick of panel.xTicks || []) ctx.fillText(tick.label, x + tick.position * plotW, y + plotH + 12, 135);
    ctx.textAlign = "left";
    ctx.fillText([panel.title, panel.yLabel].filter(Boolean).join(" · "), x + 8, y + 13, plotW - 16);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, plotW, plotH);
    ctx.clip();
    for (const [traceIndex, trace] of (panel.series || []).entries()) {
      ctx.strokeStyle = trace.color || (traceIndex ? COLORS.ch2 : COLORS.ch1);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let started = false;
      for (const pair of trace.points || []) {
        if (!Number.isFinite(pair[0]) || !Number.isFinite(pair[1])) {
          started = false;
          continue;
        }
        const px = x + pair[0] * plotW,
          py = y + (1 - pair[1]) * plotH;
        if (started) ctx.lineTo(px, py);
        else {
          ctx.moveTo(px, py);
          started = true;
        }
      }
      ctx.stroke();
    }
    if (!(panel.series || []).some((trace) => trace.points?.length)) {
      ctx.font = "20px Arial, sans-serif";
      ctx.fillStyle = "#bfc8c6";
      ctx.fillText(params.scopeError || panel.subtitle || "No acquired signal", x + 16, y + plotH / 2, plotW - 32);
    }
    const cursor = panel.cursor || panel.marker;
    if (cursor && Number.isFinite(cursor.x)) {
      const cursorX = x + THREE.MathUtils.clamp(cursor.x, 0, 1) * plotW;
      ctx.strokeStyle = "#d6dfdb";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cursorX, y);
      ctx.lineTo(cursorX, y + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  }
  const cursorLabel = graph?.cursor?.label || validPanels.find((panel) => panel.cursor?.label)?.cursor?.label;
  if (params.recorder || cursorLabel) {
    ctx.font = "18px Arial, sans-serif";
    ctx.fillStyle = "#c0ceca";
    ctx.fillText(cursorLabel || graph?.subtitle || "", 20, height - 15, width - 40);
    return;
  }
  ctx.font = "19px monospace";
  ctx.fillStyle = COLORS.ch1;
  ctx.fillText(Number.isFinite(params?.ch1Scale) ? `CH1 ${number(params.ch1Scale, 2)} V/div` : validPanels[0]?.yLabel || "", 20, height - 15);
  ctx.fillStyle = COLORS.ch2;
  ctx.fillText(
    Number.isFinite(params?.ch2Scale) ? `CH2 ${number(params.ch2Scale, 2)} V/div` : validPanels[1]?.yLabel || "",
    width * 0.53,
    height - 15
  );
}

export function createOscilloscope({ id = "oscilloscope", label = "OSCILLOSCOPE" } = {}) {
  const h = hardware(id),
    z = h.enclosure(0.43, 0.245, 0.18);
  h.text(label, 0.27, 0.014, [-0.044, 0.224, z + 0.0007], { align: "left", size: 45 });
  h.box(0.263, 0.176, 0.007, h.m.dark, h.group, [-0.066, 0.127, z + 0.0015], 0.004);
  const display = h.screen(0.25, 0.159, [-0.066, 0.128, z + 0.0055], { pixels: [960, 600], background: "#151d20" });
  const screenTarget = h.target(display.object, { kind: "screen", label: "Scope", action: "scope-screen", bounds: [] });
  const time = h.dial("Time/div", "timeDiv", 0.108, 0.182, z, { radius: 0.014 });
  h.text("TIME / DIV", 0.074, 0.009, [0.109, 0.212, z + 0.0005], { size: 52 });
  const ch1 = h.dial("CH1 volts/div", "ch1Scale", 0.099, 0.104, z, { color: "#807341" });
  const ch2 = h.dial("CH2 volts/div", "ch2Scale", 0.163, 0.104, z, { color: "#3f6e7b" });
  h.text("CH1      CH2", 0.104, 0.01, [0.129, 0.138, z + 0.0006], { size: 46 });
  h.text("VOLTS / DIV", 0.1, 0.009, [0.13, 0.077, z + 0.0006], { size: 45 });
  const trigger = h.dial("Trigger level", "triggerLevel", 0.171, 0.182, z, { radius: 0.008 });
  h.text("TRIGGER", 0.052, 0.008, [0.17, 0.208, z + 0.0006], { size: 45 });
  const edge = h.button("Trigger edge", "set:triggerEdge:falling", 0.171, 0.148, z, { width: 0.028 });
  const edgeText = h.screen(0.043, 0.01, [0.171, 0.16, z + 0.0007], { pixels: [400, 100], background: COLORS.face });
  h.button("Run / Hold", "scope-toggle", -0.054, 0.02, z, { width: 0.03, color: "#5f7567" });
  h.text("RUN / HOLD", 0.066, 0.008, [-0.055, 0.04, z + 0.0005], { size: 42 });
  h.button("Autoscale", "scope-autoscale", 0.014, 0.02, z, { width: 0.026 });
  h.text("AUTO", 0.042, 0.008, [0.014, 0.04, z + 0.0005], { size: 48 });
  h.socket("CH1", 0.1, 0.037, z, COLORS.ch1, { bnc: true, action: "tool:ch1", channel: "ch1" });
  h.socket("CH2", 0.164, 0.037, z, COLORS.ch2, { bnc: true, action: "tool:ch2", channel: "ch2" });
  function update(data = {}) {
    const p = data.parameters || {};
    time.set(p.timeDiv);
    ch1.set(p.ch1Scale);
    ch2.set(p.ch2Scale);
    trigger.set(p.triggerLevel);
    edge.userData.equipmentTarget.action = `set:triggerEdge:${p.triggerEdge === "falling" ? "rising" : "falling"}`;
    edgeText.draw(p.triggerEdge, (ctx, w, ht) => {
      ctx.font = "45px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.triggerEdge === "falling" ? "FALL" : "RISE", w / 2, ht / 2);
    });
    screenTarget.bounds = plotBounds(960, 600, Math.min(3, data.graph?.panels?.length || 1));
    const acquisition = data.rawGraph?.scope;
    const displayed = acquisition
      ? {
          ...p,
          timeDiv: acquisition.timeDiv,
          ch1Scale: acquisition.channels.ch1.scale,
          ch2Scale: acquisition.channels.ch2.scale,
          scopeRunning: acquisition.running,
          scopeStale: acquisition.stale,
          scopeError: acquisition.error,
        }
      : p;
    display.draw(
      [data.graph, displayed.timeDiv, displayed.ch1Scale, displayed.ch2Scale, displayed.scopeRunning, displayed.scopeStale, displayed.scopeError],
      (ctx, w, ht) => plotScreen(ctx, w, ht, data.graph, displayed)
    );
  }
  h.finish();
  update();
  return { group: h.group, targets: h.targets, anchors: h.anchors, screen: display, update, dispose: h.dispose };
}

export function createRecorder({ id = "lab-recorder", module = "thevenin" } = {}) {
  const h = hardware(id),
    z = h.enclosure(0.43, 0.245, 0.18);
  h.text("LAB RECORDER", 0.3, 0.014, [-0.038, 0.224, z + 0.0007], { align: "left", size: 47 });
  h.box(0.398, 0.191, 0.007, h.m.dark, h.group, [0, 0.119, z + 0.0015], 0.004);
  const display = h.screen(0.385, 0.18, [0, 0.119, z + 0.0055], { pixels: [1280, 640], background: "#151d20" });
  const screenTarget = h.target(display.object, { kind: "screen", label: "Lab recorder", action: "scope-screen", bounds: [] });
  function update(data = {}) {
    const p = data.parameters || {};
    screenTarget.bounds = plotBounds(1280, 640, Math.min(3, data.graph?.panels?.length || 1));
    const displayParameters = { recorder: module, playing: p.playing };
    display.draw([data.graph, displayParameters], (ctx, width, height) => plotScreen(ctx, width, height, data.graph, displayParameters));
  }
  h.finish();
  update();
  return { group: h.group, targets: h.targets, anchors: h.anchors, screen: display, module, update, dispose: h.dispose };
}

export function createPowerSupply({
  id = "power-supply",
  label = "DC POWER SUPPLY",
  parameter = "equivalentVoltage",
  fixedValue = null,
  polarity = 1,
  positiveTerminal = "+",
  negativeTerminal = "−",
} = {}) {
  const h = hardware(id),
    z = h.enclosure(0.22, 0.186, 0.2);
  h.text(label, 0.183, 0.014, [0, 0.168, z + 0.0005], { size: 46 });
  h.box(0.178, 0.056, 0.004, h.m.dark, h.group, [0, 0.122, z], 0.003);
  const display = h.screen(0.169, 0.048, [0, 0.122, z + 0.0025], { background: "#142a27", foreground: "#9ec9ad", pixels: [768, 240] });
  const currentSource = parameter === "nortonCurrent";
  const control = fixedValue === null ? h.dial(currentSource ? "Current" : "Voltage", parameter, 0.059, 0.059, z, { radius: 0.014 }) : null;
  h.text(fixedValue === null ? (currentSource ? "CURRENT" : "VOLTAGE") : "FIXED OUTPUT", 0.07, 0.008, [0.057, 0.088, z + 0.0004], { size: 46 });
  h.socket(negativeTerminal, -0.067, 0.046, z, COLORS.black);
  h.socket(positiveTerminal, -0.02, 0.046, z, COLORS.red);
  h.text("−        +", 0.09, 0.011, [-0.044, 0.026, z + 0.0005], { size: 64 });
  function update(data = {}) {
    const value = fixedValue ?? data.parameters?.[parameter] ?? data.value;
    control?.set(value);
    const p = data.parameters || {},
      source = parameter === "v1" ? "a" : parameter === "v2" ? "b" : null;
    const inactive = data.module === "superposition" && source && p.sourceMode && p.sourceMode !== "both" && p.sourceMode !== source;
    const open = inactive && p.replacement === "open";
    const output = inactive ? 0 : Number.isFinite(value) ? value * polarity : value;
    display.draw([output, parameter, inactive, open], (ctx, w, ht) => {
      ctx.font = "60px monospace";
      ctx.fillText(open ? "OPEN" : `${number(output, 2)} ${currentSource ? "mA" : "V"}`, 30, ht * 0.48, w - 60);
      ctx.font = "26px Arial, sans-serif";
      ctx.fillText(open ? "DISCONNECTED" : inactive ? "0 V · SHORT" : parameter === "rail" ? "LINKED RAIL SET" : "SET OUTPUT", 30, ht * 0.82);
    });
  }
  h.finish();
  update();
  return { group: h.group, targets: h.targets, anchors: h.anchors, update, dispose: h.dispose };
}

export function createGenerator({ id = "generator", label = "FUNCTION GENERATOR" } = {}) {
  const h = hardware(id),
    z = h.enclosure(0.28, 0.135, 0.16);
  h.text(label, 0.238, 0.012, [0, 0.118, z + 0.0005], { size: 48 });
  h.box(0.158, 0.065, 0.004, h.m.dark, h.group, [-0.05, 0.073, z], 0.003);
  const display = h.screen(0.15, 0.057, [-0.05, 0.073, z + 0.0025], { pixels: [760, 300], background: "#20312f", foreground: "#c5d5c0" });
  const frequency = h.dial("Frequency", "frequency", 0.064, 0.078, z, { radius: 0.012 });
  const amplitude = h.dial("Amplitude", "amplitude", 0.112, 0.078, z, { radius: 0.01 });
  h.text("Hz", 0.027, 0.009, [0.063, 0.104, z + 0.0007]);
  h.text("V pk", 0.032, 0.009, [0.111, 0.104, z + 0.0007]);
  h.socket("OUT", 0.082, 0.028, z, COLORS.metal, { bnc: true });
  h.text("SINE OUT", 0.055, 0.008, [0.082, 0.011, z + 0.0006], { size: 45 });
  function update(data = {}) {
    const p = data.parameters || {};
    frequency.set(p.frequency);
    amplitude.set(p.amplitude);
    display.draw([p.frequency, p.amplitude], (ctx, w, ht) => {
      ctx.font = "64px monospace";
      ctx.fillText(`${number(p.frequency, 1)} Hz`, 24, 88, w - 48);
      ctx.font = "43px monospace";
      ctx.fillText(`${number(p.amplitude, 2)} V pk`, 24, 178, w - 48);
      ctx.font = "27px Arial, sans-serif";
      ctx.fillText("SINE   OFFSET 0 V", 24, 253);
    });
  }
  h.finish();
  update();
  return { group: h.group, targets: h.targets, anchors: h.anchors, update, dispose: h.dispose };
}

export function createResistanceBox({ id = "resistance-box", label = "RESISTANCE", parameter = "load", values = OPTIONS[parameter] } = {}) {
  const h = hardware(id),
    z = h.enclosure(0.133, 0.097, 0.093);
  h.text(label, 0.11, 0.01, [0, 0.083, z + 0.0005], { size: 48 });
  const control = h.dial(label, parameter, 0.028, 0.039, z, { radius: 0.015, values });
  const valueDisplay = h.screen(0.058, 0.023, [-0.029, 0.058, z + 0.0006], { pixels: [600, 200], background: "#c7cec1" });
  h.socket("A", -0.045, 0.024, z, COLORS.red);
  h.socket("B", -0.016, 0.024, z, COLORS.black);
  function update(data = {}) {
    const value = data.parameters?.[parameter] ?? data.value;
    control.set(value);
    valueDisplay.draw(value, (ctx, w, ht) => {
      ctx.textAlign = "center";
      ctx.font = "70px monospace";
      ctx.fillText(resistance(value), w / 2, ht / 2, w - 20);
    });
  }
  h.finish();
  update();
  return { group: h.group, targets: h.targets, anchors: h.anchors, update, dispose: h.dispose };
}

export function createExperimentControls({ id = "experiment-controls", module = "thevenin" } = {}) {
  const h = hardware(id),
    z = h.enclosure(0.34, 0.172, 0.13),
    controls = [];
  const titles = { thevenin: "EQUIVALENT CIRCUITS", superposition: "SOURCE CONTROL", opamp: "AMPLIFIER CONTROL", transient: "TRANSIENT CONTROL" };
  h.text(titles[module] || "CIRCUIT CONTROL", 0.29, 0.013, [0, 0.151, z + 0.0005], { size: 47 });
  function selector(label, parameter, values, x, y = 0.1, { min, max, step, radius = 0.012 } = {}) {
    const control = h.dial(label, parameter, x, y, z, { radius, values, min, max, step });
    const display = h.screen(0.074, 0.012, [x, y + 0.03, z + 0.0006], { pixels: [620, 120], background: COLORS.face });
    controls.push({ ...control, parameter, display, label });
    return control;
  }
  function push(label, action, x, y, width = 0.032) {
    const object = h.button(label, action, x, y, z, { width });
    h.text(label, width + 0.006, 0.0075, [x, y - 0.014, z + 0.0005], { size: 48 });
    return object;
  }
  const mode = push("MODE", "build", -0.132, 0.028);
  push("CLEAR", "reset-circuit", -0.089, 0.028);
  push("UNDO", "undo", -0.046, 0.028);
  for (const [index, lab] of ["thevenin", "superposition", "opamp", "transient"].entries())
    push(String(5 + index).padStart(2, "0"), `module:${lab}`, 0.016 + index * 0.037, 0.028, 0.024);
  const stateDisplay = h.screen(0.108, 0.014, [0.103, 0.05, z + 0.0007], { pixels: [620, 120], background: COLORS.face });
  let run, drive;
  if (module === "thevenin") selector("Circuit", "representation", ["original", "thevenin", "norton"], -0.064);
  if (module === "superposition") {
    selector("Sources", "sourceMode", ["a", "both", "b"], -0.08);
    selector("Inactive source", "replacement", ["short", "open"], 0.063);
  }
  if (module === "opamp") selector("Amplifier", "configuration", ["inverting", "noninverting"], -0.064);
  if (module === "transient") {
    selector("Circuit", "kind", ["RC", "RL"], -0.117, 0.106);
    selector("Speed", "speed", OPTIONS.speed, -0.04, 0.106);
    selector("Cursor", "timeCursor", undefined, 0.039, 0.106, { min: 0, max: 1, step: 0.001 });
    run = push("RUN / PAUSE", "play", 0.121, 0.112, 0.045);
    push("REPLAY", "replay", 0.121, 0.073, 0.039);
    drive = push("SOURCE / RETURN", "switch", -0.112, 0.062, 0.05);
    push("ZERO ENERGY", "reset-energy", -0.031, 0.062, 0.045);
  }
  const names = {
    original: "ORIGINAL",
    thevenin: "THÉVENIN",
    norton: "NORTON",
    both: "BOTH",
    a: "A ONLY",
    b: "B ONLY",
    short: "SHORT",
    open: "OPEN",
    inverting: "INVERTING",
    noninverting: "NON-INVERTING",
  };
  function update(data = {}) {
    const p = data.parameters || {};
    mode.userData.equipmentTarget.action = data.mode === "build" ? "explore" : "build";
    mode.userData.equipmentTarget.label = data.mode === "build" ? "Explore reference" : "Build circuit";
    stateDisplay.draw([data.mode, p.charging, p.playing], (ctx, w, ht) => {
      ctx.font = "39px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        module === "transient"
          ? `${p.playing ? "RUN" : "PAUSED"} · ${p.charging ? "SOURCE" : "RETURN"}`
          : data.mode === "build"
            ? "BUILD CIRCUIT"
            : "REFERENCE",
        w / 2,
        ht / 2,
        w - 8
      );
    });
    for (const control of controls) {
      const value = control.parameter === "timeCursor" ? p.time : p[control.parameter];
      if (control.parameter === "timeCursor") {
        control.descriptor.max = Math.max(0, p.acquiredTime || 0);
        control.descriptor.step = Math.max(0.000001, control.descriptor.max / 100);
      }
      control.set(value);
      control.display.draw(value, (ctx, w, ht) => {
        ctx.font = "42px Arial, sans-serif";
        ctx.textAlign = "center";
        const text =
          control.parameter === "timeCursor"
            ? `${number((value || 0) * 1000, 3)} ms`
            : control.parameter === "speed"
              ? `${number(value, 2)}×`
              : names[value] || String(value || control.label);
        ctx.fillText(text, w / 2, ht / 2, w - 12);
      });
    }
    if (run) run.userData.equipmentTarget.label = p.playing ? "Pause" : "Run";
    if (drive) drive.userData.equipmentTarget.label = p.charging ? "Switch to return loop" : "Switch to source";
  }
  h.finish();
  update();
  return { group: h.group, targets: h.targets, anchors: h.anchors, module, width: 0.34, height: 0.172, update, dispose: h.dispose };
}

export function createProbe({
  id = "probe",
  color = COLORS.red,
  channel = "red",
  label = "Probe",
  action = /ground/i.test(channel) ? `scope-ground:${channel.slice(0, 3)}` : `tool:${channel}`,
  ground = /ground/i.test(channel),
} = {}) {
  if (ground) return createGroundClip({ id, color, channel, label, action });
  const h = hardware(id),
    { group, m } = h,
    insulation = h.material(color, { roughness: 0.76 });
  const body = h.mesh(new THREE.CylinderGeometry(0.005, 0.0043, 0.113, 24), insulation, group, [0, 0.091, 0]);
  h.mesh(new THREE.CylinderGeometry(0.0021, 0.0038, 0.019, 20), insulation, group, [0, 0.0255, 0]);
  h.mesh(new THREE.CylinderGeometry(0.00075, 0.00075, 0.016, 14), m.metal, group, [0, 0.01, 0]);
  h.mesh(new THREE.ConeGeometry(0.00075, 0.0025, 14), m.metal, group, [0, 0.00125, 0]).rotation.z = Math.PI;
  h.mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.0027, 32), insulation, group, [0, 0.036, 0]);
  for (let i = 0; i < 13; i++) h.mesh(new THREE.CylinderGeometry(0.0054, 0.0054, 0.0015, 24), insulation, group, [0, 0.048 + i * 0.0064, 0]);
  // Flexible boot protects the cable entry without turning the probe into a thick wand.
  h.mesh(new THREE.CylinderGeometry(0.0022, 0.0045, 0.024, 20), m.rubber, group, [0, 0.156, 0]);
  for (let i = 0; i < 5; i++)
    h.mesh(new THREE.CylinderGeometry(0.0035 - i * 0.00025, 0.0035 - i * 0.00025, 0.001, 18), m.rubber, group, [0, 0.149 + i * 0.0035, 0]);
  h.anchor("tip", [0, 0, 0]);
  h.anchor("cable", [0, 0.168, 0]);
  const descriptor = h.target(body, { kind: "probe", id, label, channel, action });
  group.traverse((object) => {
    if (object.isMesh) object.userData.equipmentTarget = descriptor;
  });
  function update(data = {}) {
    descriptor.connected = !!data.connected;
    group.visible = data.visible !== false;
  }
  h.finish();
  return { group, targets: h.targets, anchors: h.anchors, channel, length: 0.168, update, dispose: h.dispose };
}

export function createGroundClip({
  id = "ground-clip",
  color = COLORS.black,
  channel = "ch1Ground",
  label = "Ground clip",
  action = "scope-ground:ch1",
} = {}) {
  const h = hardware(id),
    { group, m } = h,
    insulation = h.material(color, { roughness: 0.86 });
  // Small crocodile clip: exposed opposing metal jaws, hinge and insulated squeeze sleeve.
  const lower = h.box(0.007, 0.021, 0.0016, m.metal, group, [0, 0.01, -0.0022], 0.0004);
  const upper = h.box(0.007, 0.022, 0.0016, m.metal, group, [0, 0.012, 0.0022], 0.0004);
  upper.rotation.x = -0.1;
  for (let i = 0; i < 5; i++) {
    h.box(0.006, 0.001, 0.0014, m.metal, group, [0, 0.003 + i * 0.003, -0.001], 0.0001);
    h.box(0.006, 0.001, 0.0014, m.metal, group, [0, 0.003 + i * 0.003, 0.001], 0.0001);
  }
  const hinge = h.cylinder(0.0034, 0.009, m.metal, group, [0, 0.021, 0], 16);
  hinge.rotation.y = Math.PI / 2;
  const sleeve = h.box(0.011, 0.025, 0.01, insulation, group, [0, 0.032, 0], 0.003);
  h.mesh(new THREE.CylinderGeometry(0.0017, 0.0032, 0.009, 16), m.rubber, group, [0, 0.048, 0]);
  h.anchor("tip", [0, 0, 0]);
  h.anchor("cable", [0, 0.053, 0]);
  const descriptor = h.target(sleeve, { kind: "probe", id, label, channel, action });
  group.traverse((object) => {
    if (object.isMesh) object.userData.equipmentTarget = descriptor;
  });
  h.finish();
  return {
    group,
    targets: h.targets,
    anchors: h.anchors,
    channel,
    length: 0.053,
    update(data = {}) {
      descriptor.connected = !!data.connected;
      group.visible = data.visible !== false;
    },
    dispose: h.dispose,
  };
}

export function createCable({
  points = [
    [0, 0, 0],
    [0, 0.01, -0.03],
    [0.02, 0.01, -0.06],
  ],
  color = COLORS.black,
  radius = 0.0018,
} = {}) {
  const group = new THREE.Group();
  group.name = "insulated-lead";
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0 });
  let object = null,
    signature = "",
    disposed = false;
  function update(input) {
    const values = Array.isArray(input) ? input : input?.points || points;
    const positions = values.map(point);
    if (positions.length < 2) return;
    const next = positions
      .map((p) =>
        p
          .toArray()
          .map((v) => v.toFixed(5))
          .join(",")
      )
      .join(";");
    if (signature === next) return;
    signature = next;
    const curve = new THREE.CatmullRomCurve3(positions, false, "centripetal");
    const geometry = new THREE.TubeGeometry(curve, 48, radius, 7, false);
    if (object) {
      object.geometry.dispose();
      object.geometry = geometry;
    } else {
      object = new THREE.Mesh(geometry, material);
      object.castShadow = true;
      object.receiveShadow = true;
      group.add(object);
    }
  }
  update(points);
  return {
    group,
    targets: [],
    anchors: {},
    update,
    dispose() {
      if (disposed) return;
      disposed = true;
      object?.geometry.dispose();
      material.dispose();
      group.removeFromParent();
    },
  };
}
