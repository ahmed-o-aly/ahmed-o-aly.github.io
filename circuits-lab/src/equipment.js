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

function writeText(ctx, text, x, y, { size, width, align = "left", weight = 700, family = "Arial, sans-serif" }) {
  const value = String(text);
  let fitted = size;
  ctx.font = `${weight} ${fitted}px ${family}`;
  if (width && ctx.measureText(value).width > width) {
    fitted *= width / ctx.measureText(value).width;
    ctx.font = `${weight} ${fitted}px ${family}`;
  }
  ctx.textAlign = align;
  ctx.fillText(value, x, y);
}

function wrapText(ctx, value, width) {
  const lines = [];
  for (const word of String(value).split(/\s+/)) {
    const last = lines.length - 1;
    if (last >= 0 && ctx.measureText(`${lines[last]} ${word}`).width <= width) lines[last] += ` ${word}`;
    else lines.push(word);
  }
  return lines;
}

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
  function screen(width, height, position, { pixels = [768, 320], background = "#dbe6cb", foreground = "#102018" } = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = pixels[0];
    // Match texel and physical aspect ratios; never stretch printed letters.
    canvas.height = Math.round((pixels[0] * height) / width);
    const ctx = canvas.getContext("2d");
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
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
  function text(textValue, width, height, position, { size = 52, color = "#172120", background = "#e8e8e2", align = "center" } = {}) {
    const display = screen(width, height, position, { pixels: [Math.round((128 * width) / height), 128], background, foreground: color });
    display.draw(textValue, (ctx, w, h) => {
      writeText(ctx, textValue, align === "center" ? w / 2 : 8, h / 2, { size: h * 0.88, width: w - 16, align });
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
  function button(label, action, x, y, z, { color = "#6f7974", width = 0.025, height = 0.012 } = {}) {
    const key = box(width, height, 0.007, material(color), group, [x, y, z + 0.004], 0.002);
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
  h.box(0.09, 0.063, 0.004, m.black, group, [0, 0.172, 0.03], 0.003);
  const lcd = h.screen(0.084, 0.057, [0, 0.172, 0.0325], { pixels: [840, 570] });
  h.text("MULTIMETER", 0.084, 0.01, [0, 0.209, 0.029], { background: COLORS.dark, color: "#f5f7ef" });
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
      writeText(ctx, data.module === "opamp" ? "V SAMPLE" : "DC V", 28, ht * 0.14, { size: ht * 0.16, width: w - 56 });
      writeText(ctx, value === null ? "— —" : number(value, 3), w - 26, ht * 0.54, {
        size: ht * 0.55,
        width: w - 52,
        align: "right",
        family: "Arial, sans-serif",
      });
      if (value === null) writeText(ctx, "CONNECT PROBES", w / 2, ht * 0.87, { size: ht * 0.13, width: w - 40, align: "center" });
    });
  }
  h.finish();
  update();
  return { group, targets: h.targets, anchors: h.anchors, update, dispose: h.dispose };
}

function plotBounds(width, height, count) {
  const margin = { l: 100, r: 30, t: 78, b: 138 },
    gap = 52;
  const plotH = (height - margin.t - margin.b - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, panel) => ({
    panel,
    left: margin.l / width,
    top: (margin.t + panel * (plotH + gap)) / height,
    width: (width - margin.l - margin.r) / width,
    height: plotH / height,
  }));
}

function compactReading(reading) {
  const aliases = { "Capacitor voltage": "V", "Inductor voltage": "V", "Storage current": "I", "Stored energy": "E", "Calculated load power": "P" };
  const label = aliases[reading.name] || reading.name || "";
  return `${label} ${number(reading.value, 3)} ${reading.unit || ""}`.trim();
}

function plotScreen(ctx, width, height, graph, params) {
  ctx.fillStyle = "#071015";
  ctx.fillRect(0, 0, width, height);
  const panels = graph?.panels?.length ? graph.panels : [graph];
  const validPanels = panels.filter(Boolean).slice(0, 3);
  const bounds = plotBounds(width, height, validPanels.length || 1);
  const state = params.recorder
    ? params.recorder === "transient"
      ? params.playing
        ? "ACQUIRING"
        : "PAUSED"
      : "CALCULATED · WIRING"
    : params.scopeRunning === false
      ? params.scopeStale
        ? "HOLD · OLD SETTINGS"
        : "HOLD"
      : "RUN";
  ctx.fillStyle = "#f1faf5";
  writeText(ctx, state, 20, 29, { size: 30, width: width * 0.56 });
  const axis = Number.isFinite(params.timeDiv)
    ? `${number(params.timeDiv, 3)} ms/div`
    : (graph?.xLabel || "TIME").replace("Elapsed circuit time", "Time").replace("Load resistance", "Load");
  writeText(ctx, axis, width - 22, 29, { size: 30, width: width * 0.41, align: "right" });
  if (!validPanels.length) {
    writeText(ctx, "CONNECT THE CHANNELS", width / 2, height / 2, { size: 36, width: width - 60, align: "center" });
    return;
  }
  const palette = ["#ffe27b", "#79e4f6", "#dfbfff"];
  for (let index = 0; index < validPanels.length; index++) {
    const panel = validPanels[index],
      rect = bounds[index];
    const x = rect.left * width,
      y = rect.top * height,
      plotW = rect.width * width,
      plotH = rect.height * height;
    ctx.strokeStyle = "#344750";
    ctx.lineWidth = 1.5;
    const xDivisions = panel.xDivisions || 4,
      yDivisions = panel.yDivisions || 4;
    for (let i = 0; i <= xDivisions; i++) {
      ctx.beginPath();
      ctx.moveTo(x + (plotW * i) / xDivisions, y);
      ctx.lineTo(x + (plotW * i) / xDivisions, y + plotH);
      ctx.stroke();
    }
    for (let i = 0; i <= yDivisions; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + (plotH * i) / yDivisions);
      ctx.lineTo(x + plotW, y + (plotH * i) / yDivisions);
      ctx.stroke();
    }
    ctx.fillStyle = "#f1faf5";
    const yTicks = panel.yTicks || [];
    for (const [i, tick] of yTicks.entries()) {
      if (validPanels.length > 1 && i !== 0 && i !== Math.floor(yTicks.length / 2) && i !== yTicks.length - 1) continue;
      writeText(ctx, tick.label, x - 12, y + (1 - tick.position) * plotH, { size: 32, width: x - 20, align: "right" });
    }
    for (const [tickIndex, tick] of (panel.xTicks || []).entries()) {
      ctx.fillStyle = graph.interaction === "source" ? palette[tickIndex % palette.length] : "#f1faf5";
      writeText(ctx, tick.label, x + tick.position * plotW, y + plotH + 24, { size: 31, width: Math.max(150, plotW / 5), align: "center" });
    }
    const panelLabel = params.recorder ? panel.yLabel : panel.title;
    ctx.fillStyle = palette[index % palette.length];
    writeText(ctx, panelLabel || panel.yLabel || "", x + 12, y - 22, { size: 31, width: plotW - 24 });
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, plotW, plotH);
    ctx.clip();
    for (const [traceIndex, trace] of (panel.series || []).entries()) {
      ctx.strokeStyle = palette[validPanels.length > 1 ? index : traceIndex % palette.length];
      ctx.lineWidth = graph.interaction === "source" ? 12 : 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
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
      ctx.fillStyle = "#f5faf4";
      ctx.font = "700 32px Arial, sans-serif";
      const lines = wrapText(ctx, params.scopeError || panel.subtitle || "No acquired signal", plotW - 44).slice(0, 2);
      for (const [line, text] of lines.entries())
        writeText(ctx, text, x + plotW / 2, y + plotH / 2 + (line - (lines.length - 1) / 2) * 38, { size: 32, align: "center" });
    }
    const cursor = panel.cursor || panel.marker;
    if (cursor && Number.isFinite(cursor.x)) {
      const cursorX = x + THREE.MathUtils.clamp(cursor.x, 0, 1) * plotW;
      ctx.strokeStyle = "#f4fff7";
      ctx.lineWidth = 3;
      ctx.setLineDash([9, 7]);
      ctx.beginPath();
      ctx.moveTo(cursorX, y);
      ctx.lineTo(cursorX, y + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      if (Number.isFinite(cursor.y)) {
        ctx.fillStyle = "#f4fff7";
        ctx.beginPath();
        ctx.arc(cursorX, y + (1 - cursor.y) * plotH, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
  const cursor = graph?.cursor || validPanels.find((panel) => panel.cursor)?.cursor;
  const readings = cursor?.readings?.length ? cursor.readings.map(compactReading) : params.readings || [];
  const stripTop = height - 94;
  ctx.fillStyle = "#172b31";
  ctx.fillRect(0, stripTop, width, 94);
  ctx.fillStyle = "#f6fff7";
  const cursorTime = cursor?.xLabel;
  const lines = cursorTime
    ? [cursorTime, readings.join("   ·   ")]
    : readings.length > 2
      ? [readings.slice(0, 2).join("   ·   "), readings.slice(2).join("   ·   ")]
      : [...readings];
  const visibleLines = lines.slice(0, 2);
  if (!visibleLines.length)
    visibleLines.push(params.scopeError ? "CHECK CONNECTIONS" : params.recorder ? "Select a point to read it" : "CONNECT THE CHANNELS");
  visibleLines.forEach((line, index) =>
    writeText(ctx, line, 22, stripTop + (visibleLines.length === 1 ? 47 : 25 + index * 43), { size: 35, width: width - 44 })
  );
}

export function createOscilloscope({ id = "oscilloscope", label = "OSCILLOSCOPE" } = {}) {
  const h = hardware(id),
    z = h.enclosure(0.43, 0.245, 0.18);
  h.text(label, 0.27, 0.014, [-0.044, 0.224, z + 0.0007], { align: "left", size: 45 });
  h.box(0.278, 0.18, 0.007, h.m.dark, h.group, [-0.066, 0.127, z + 0.0015], 0.004);
  const display = h.screen(0.266, 0.17, [-0.066, 0.128, z + 0.0055], { pixels: [1064, 680], background: "#071015" });
  const screenTarget = h.target(display.object, { kind: "screen", label: "Scope", action: "scope-screen", bounds: [] });
  const time = h.dial("Time/div", "timeDiv", 0.108, 0.182, z, { radius: 0.014 });
  h.text("TIME / DIV", 0.074, 0.011, [0.109, 0.213, z + 0.0005]);
  const ch1 = h.dial("CH1 volts/div", "ch1Scale", 0.099, 0.104, z, { color: "#807341" });
  const ch2 = h.dial("CH2 volts/div", "ch2Scale", 0.163, 0.104, z, { color: "#3f6e7b" });
  h.text("CH1", 0.038, 0.012, [0.099, 0.137, z + 0.0006]);
  h.text("CH2", 0.038, 0.012, [0.163, 0.137, z + 0.0006]);
  h.text("VOLTS / DIV", 0.1, 0.011, [0.13, 0.077, z + 0.0006]);
  const trigger = h.dial("Trigger level", "triggerLevel", 0.171, 0.182, z, { radius: 0.008 });
  h.text("TRIGGER", 0.052, 0.011, [0.17, 0.212, z + 0.0006]);
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
    edgeText.draw(p.triggerEdge, (ctx, w, ht) =>
      writeText(ctx, p.triggerEdge === "falling" ? "FALL" : "RISE", w / 2, ht / 2, { size: ht * 0.85, width: w - 16, align: "center" })
    );
    screenTarget.bounds = plotBounds(display.canvas.width, display.canvas.height, Math.min(3, data.graph?.panels?.length || 1));
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
          readings: [
            `CH1 ${number(acquisition.channels.ch1.peak, 2)} V pk  ·  CH2 ${number(acquisition.channels.ch2.peak, 2)} V pk`,
            `TRIGGER ${acquisition.trigger?.edge === "falling" ? "↓" : "↑"} ${number(acquisition.trigger?.level, 2)} V`,
          ],
        }
      : p;
    display.draw(
      [
        data.graph,
        displayed.timeDiv,
        displayed.ch1Scale,
        displayed.ch2Scale,
        displayed.scopeRunning,
        displayed.scopeStale,
        displayed.scopeError,
        displayed.readings,
      ],
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
  h.text("LAB RECORDER", 0.3, 0.014, [-0.038, 0.224, z + 0.0007], { align: "left" });
  h.box(0.402, 0.187, 0.007, h.m.dark, h.group, [0, 0.119, z + 0.0015], 0.004);
  const display = h.screen(0.391, 0.177, [0, 0.119, z + 0.0055], { pixels: [1280, 580], background: "#071015" });
  const screenTarget = h.target(display.object, { kind: "screen", label: "Lab recorder", action: "scope-screen", bounds: [] });
  let selectedPanel = 0,
    lastData = {},
    status = [];
  if (module === "transient")
    for (const [index, label] of ["VOLTAGE", "CURRENT", "ENERGY"].entries()) {
      const x = -0.135 + index * 0.135;
      const key = h.button(label, `recorder-panel:${index}`, x, 0.013, z, { width: 0.11, color: "#47565b" });
      const text = h.screen(0.102, 0.009, [x, 0.013, z + 0.0077], { pixels: [1020, 90], background: "#47565b", foreground: "#ffffff" });
      text.object.userData.equipmentTarget = key.userData.equipmentTarget;
      status.push({ text, label, index });
    }
  function update(data = {}) {
    lastData = data;
    const p = data.parameters || {},
      m = data.measurement || {};
    let graph = data.graph;
    if (module === "transient" && graph?.panels?.length) {
      selectedPanel = Math.min(selectedPanel, graph.panels.length - 1);
      graph = { ...graph.panels[selectedPanel], panels: undefined };
    }
    screenTarget.bounds = plotBounds(display.canvas.width, display.canvas.height, 1).map((rect) => ({
      ...rect,
      panel: module === "transient" ? selectedPanel : 0,
    }));
    const signed = (value) => `${value >= 0 ? "+" : ""}${number(value, 2)}`;
    let readings = [];
    if (module === "thevenin")
      readings = m.ok
        ? [`${resistance(p.load)}  ·  ${number(m.voltage, 3)} V`, `${number(m.current * 1000, 3)} mA  ·  ${number(m.power * 1000, 3)} mW`]
        : ["CONNECT CIRCUIT"];
    if (module === "superposition") {
      const bars = data.rawGraph?.bars || [];
      readings = [
        bars
          .slice(0, 2)
          .map((bar, index) => `${index ? "B" : "A"} ${Number.isFinite(bar.value) ? signed(bar.value) : "—"} mA`)
          .join("  ·  "),
        `BOTH ${Number.isFinite(bars[2]?.value) ? signed(bars[2].value) : "—"} mA`,
      ];
    }
    if (module === "transient") {
      const quantities = [m.voltage, m.current * 1000, m.energy * 1000],
        units = ["V", "mA", "mJ"];
      readings = m.ok
        ? [
            `${number(p.time * 1000, 3)} ms  ·  ${number(quantities[selectedPanel], 3)} ${units[selectedPanel]}`,
            `${p.charging ? "SOURCE" : "RETURN"}  ·  ${number((p.acquiredTime || 0) * 1000, 3)} ms acquired`,
          ]
        : ["CONNECT CIRCUIT"];
    }
    for (const entry of status)
      entry.text.draw(selectedPanel === entry.index, (ctx, w, height) => {
        ctx.fillStyle = selectedPanel === entry.index ? "#ecf7ec" : "#47565b";
        ctx.fillRect(0, 0, w, height);
        ctx.fillStyle = selectedPanel === entry.index ? "#14251d" : "#ffffff";
        writeText(ctx, entry.label, w / 2, height / 2, { size: height * 0.88, width: w - 20, align: "center" });
      });
    const displayParameters = { recorder: module, playing: p.playing, readings };
    display.draw([graph, displayParameters], (ctx, width, height) => plotScreen(ctx, width, height, graph, displayParameters));
  }
  function selectPanel(index) {
    if (module !== "transient" || !Number.isInteger(index) || index < 0 || index > 2) return false;
    selectedPanel = index;
    update(lastData);
    return true;
  }
  h.finish();
  update();
  return { group: h.group, targets: h.targets, anchors: h.anchors, screen: display, module, selectPanel, update, dispose: h.dispose };
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
  h.box(0.194, 0.071, 0.004, h.m.dark, h.group, [0, 0.124, z], 0.003);
  const display = h.screen(0.186, 0.063, [0, 0.124, z + 0.0025], { background: "#071612", foreground: "#d8ffe0", pixels: [1116, 378] });
  const currentSource = parameter === "nortonCurrent";
  const control = fixedValue === null ? h.dial(currentSource ? "Current" : "Voltage", parameter, 0.059, 0.059, z, { radius: 0.014 }) : null;
  h.text(fixedValue === null ? (currentSource ? "CURRENT" : "VOLTAGE") : "FIXED", 0.07, 0.009, [0.057, 0.083, z + 0.0004]);
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
      writeText(ctx, open ? "OPEN" : `${number(output, 2)} ${currentSource ? "mA" : "V"}`, w / 2, ht * 0.43, {
        size: ht * 0.72,
        width: w - 48,
        align: "center",
      });
      const status = open ? "DISCONNECTED" : inactive ? "SHORT" : parameter === "rail" ? "LINKED RAILS" : "OUTPUT";
      writeText(ctx, status, w / 2, ht * 0.86, { size: ht * 0.17, width: w - 40, align: "center" });
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
  h.box(0.167, 0.086, 0.004, h.m.dark, h.group, [-0.049, 0.064, z], 0.003);
  const display = h.screen(0.159, 0.078, [-0.049, 0.064, z + 0.0025], { pixels: [954, 468], background: "#071612", foreground: "#e5ffe5" });
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
      writeText(ctx, `${number(p.frequency, 1)} Hz`, w / 2, ht * 0.27, { size: ht * 0.35, width: w - 44, align: "center" });
      writeText(ctx, `${number(p.amplitude, 2)} V pk`, w / 2, ht * 0.65, { size: ht * 0.33, width: w - 44, align: "center" });
      writeText(ctx, "SINE · 0 V OFFSET", w / 2, ht * 0.92, { size: ht * 0.1, width: w - 40, align: "center" });
    });
  }
  h.finish();
  update();
  return { group: h.group, targets: h.targets, anchors: h.anchors, update, dispose: h.dispose };
}

export function createResistanceBox({ id = "resistance-box", label = "RESISTANCE", parameter = "load", values = OPTIONS[parameter] } = {}) {
  const h = hardware(id),
    z = h.enclosure(0.18, 0.14, 0.11);
  const labelKey = String(label)
    .toLowerCase()
    .replace(/[ₜₕₙ]/g, (character) => ({ ₜ: "t", ₕ: "h", ₙ: "n" })[character]);
  const title =
    parameter === "rf"
      ? "Rf"
      : parameter === "rin"
        ? "Rin"
        : parameter === "load"
          ? "RL"
          : parameter === "equivalentResistance"
            ? /norton|rn|r_n|rₙ/.test(labelKey)
              ? "Rn"
              : "Rth"
            : parameter === "resistance"
              ? "R"
              : label;
  h.text(title, 0.144, 0.032, [0, 0.116, z + 0.0007]);
  const control = h.dial(title, parameter, 0.052, 0.059, z, { radius: 0.023, values });
  h.box(0.096, 0.041, 0.003, h.m.dark, h.group, [-0.03, 0.067, z], 0.002);
  const valueDisplay = h.screen(0.09, 0.035, [-0.03, 0.067, z + 0.0017], { pixels: [900, 350], background: "#e1ead5" });
  h.socket("A", -0.06, 0.025, z, COLORS.red);
  h.socket("B", -0.014, 0.025, z, COLORS.black);
  function update(data = {}) {
    const value = data.parameters?.[parameter] ?? data.value;
    control.set(value);
    valueDisplay.draw(value, (ctx, w, ht) => writeText(ctx, resistance(value), w / 2, ht / 2, { size: ht * 0.86, width: w - 24, align: "center" }));
  }
  h.finish();
  update();
  return { group: h.group, targets: h.targets, anchors: h.anchors, width: 0.18, height: 0.14, update, dispose: h.dispose };
}

export function createExperimentControls({ id = "experiment-controls", module = "thevenin" } = {}) {
  const h = hardware(id),
    z = h.enclosure(0.56, 0.34, 0.16),
    controls = [],
    captions = [];
  const labIds = ["thevenin", "superposition", "opamp", "transient"];
  const labNumber = 5 + Math.max(0, labIds.indexOf(module));
  const heading = h.screen(0.49, 0.03, [0, 0.315, z + 0.0007], { pixels: [1470, 90], background: COLORS.face });
  function selector(label, parameter, values, x, width) {
    h.text(label, width, 0.03, [x, 0.281, z + 0.0007]);
    const control = h.dial(label, parameter, x, 0.235, z, {
      radius: 0.023,
      values,
      min: parameter === "timeCursor" ? 0 : undefined,
      max: parameter === "timeCursor" ? 1 : undefined,
      step: parameter === "timeCursor" ? 0.001 : 1,
    });
    h.box(width, 0.04, 0.003, h.m.dark, h.group, [x, 0.184, z], 0.002);
    const display = h.screen(width - 0.008, 0.034, [x, 0.184, z + 0.0017], {
      pixels: [Math.round((width - 0.008) * 5000), 170],
      background: "#e1ead5",
    });
    controls.push({ ...control, parameter, display, label });
  }
  function push(label, action, x, y, width, height = 0.04, color = "#354b45") {
    const object = h.button(label, action, x, y, z, { width, height, color });
    const descriptor = object.userData.equipmentTarget;
    const display = h.screen(width - 0.008, height - 0.008, [x, y, z + 0.0078], {
      pixels: [Math.round((width - 0.008) * 5000), 160],
      background: color,
      foreground: "#f7fff8",
    });
    display.object.userData.equipmentTarget = descriptor;
    const entry = { object, descriptor, display, color, label };
    captions.push(entry);
    return entry;
  }
  if (module === "thevenin") selector("Circuit", "representation", ["original", "thevenin", "norton"], 0, 0.34);
  if (module === "superposition") {
    selector("Sources", "sourceMode", ["a", "both", "b"], -0.14, 0.23);
    selector("Inactive source", "replacement", ["short", "open"], 0.14, 0.23);
  }
  if (module === "opamp") selector("Amplifier", "configuration", ["inverting", "noninverting"], 0, 0.34);
  let run, drive;
  if (module === "transient") {
    selector("Circuit", "kind", ["RC", "RL"], -0.18, 0.156);
    selector("Speed", "speed", OPTIONS.speed, 0, 0.156);
    selector("Time", "timeCursor", undefined, 0.18, 0.156);
    run = push("Run", "play", -0.208, 0.13, 0.124, 0.036);
    push("Replay", "replay", -0.069, 0.13, 0.124, 0.036);
    drive = push("Return", "switch", 0.069, 0.13, 0.124, 0.036);
    push("Reset", "reset-energy", 0.208, 0.13, 0.124, 0.036);
  }
  const mode = push("Build", "build", -0.18, 0.077, 0.156);
  push("Clear", "reset-circuit", 0, 0.077, 0.156);
  push("Undo", "undo", 0.18, 0.077, 0.156);
  for (const [index, lab] of labIds.entries())
    push(`Lab ${5 + index}`, `module:${lab}`, -0.2025 + index * 0.135, 0.022, 0.124, 0.036, lab === module ? "#e3eee0" : "#485658");
  const names = {
    original: "Original",
    thevenin: "Thévenin",
    norton: "Norton",
    both: "Both",
    a: "A only",
    b: "B only",
    short: "Short",
    open: "Open",
    inverting: "Inverting",
    noninverting: "Non-inverting",
  };
  function update(data = {}) {
    const p = data.parameters || {},
      build = data.mode === "build";
    mode.descriptor.action = build ? "explore" : "build";
    mode.descriptor.label = build ? "Explore reference" : "Build circuit";
    mode.label = build ? "Explore" : "Build";
    heading.draw(build, (ctx, w, height) =>
      writeText(ctx, `Lab ${labNumber} · ${build ? "Build circuit" : "Explore"}`, w / 2, height / 2, {
        size: height * 0.88,
        width: w - 24,
        align: "center",
      })
    );
    for (const control of controls) {
      const value = control.parameter === "timeCursor" ? p.time : p[control.parameter];
      if (control.parameter === "timeCursor") {
        control.descriptor.max = Math.max(0, p.acquiredTime || 0);
        control.descriptor.step = Math.max(0.000001, control.descriptor.max / 100);
      }
      control.set(value);
      const label =
        control.parameter === "timeCursor"
          ? `${number((value || 0) * 1000, 3)} ms`
          : control.parameter === "speed"
            ? `${number(value, 2)}×`
            : names[value] || String(value || control.label);
      control.display.draw(label, (ctx, w, height) =>
        writeText(ctx, label, w / 2, height / 2, { size: height * 0.9, width: w - 20, align: "center" })
      );
    }
    if (run) {
      run.label = p.playing ? "Pause" : "Run";
      run.descriptor.label = run.label;
    }
    if (drive) {
      drive.label = p.charging ? "Return" : "Source";
      drive.descriptor.label = p.charging ? "Switch to return loop" : "Switch to source";
    }
    for (const entry of captions)
      entry.display.draw(entry.label, (ctx, w, height) => {
        ctx.fillStyle = entry.color === "#e3eee0" ? "#10251b" : "#f7fff8";
        writeText(ctx, entry.label, w / 2, height / 2, { size: height * 0.9, width: w - 16, align: "center" });
      });
  }
  h.finish();
  update();
  return { group: h.group, targets: h.targets, anchors: h.anchors, module, width: 0.56, height: 0.34, update, dispose: h.dispose };
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
