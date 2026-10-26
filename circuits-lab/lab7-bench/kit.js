// Lab 7 parts kit: the physical pieces every instrument is built from. Each
// control is a real mesh with travel or rotation; printed text lives on the
// instrument faces and is drawn once, displays redraw only when asked.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export const SANS = "'Helvetica Neue', Arial, sans-serif";
export const MONO = "'SF Mono', Menlo, Consolas, monospace";
export const COLOR = {
  red: "#d0312d", black: "#1d1f22", blue: "#2a62d4", yellow: "#f2c230", purple: "#8e5bd0",
  green: "#2f9e5b", cyan: "#29b6c9", orange: "#e8812a", white: "#e9e6df", amber: "#ffb347", next: "#ffcf3f",
};

let anisotropy = 4;
export function setAnisotropy(n) { anisotropy = n; }

export function rounded(w, h, d, r = Math.min(w, h, d) * 0.12) {
  return new RoundedBoxGeometry(w, h, d, 3, r);
}

export const mat = {
  plastic: (color, roughness = 0.55) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 }),
  metal: (color = "#c9ccd0", roughness = 0.32) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.9 }),
  rubber: (color = "#25272a") => new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
};

export function canvasTexture(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w);
  canvas.height = Math.round(h);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return { canvas, ctx: canvas.getContext("2d"), texture };
}

export function text(ctx, s, x, y, size, { color = "#1d1f22", weight = 700, align = "center", font = SANS, baseline = "middle" } = {}) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(s, x, y);
}

/**
 * A printed face: a plane carrying silkscreen drawn once. `draw` receives the
 * context and a mapper from face metres (origin at centre, y up) to pixels.
 */
export function printedFace(parent, w, h, { pxPerM = 3600, background = "#e7e4dc", roughness = 0.6, z = 0.0005, draw }) {
  const view = canvasTexture(w * pxPerM, h * pxPerM);
  const { ctx, canvas } = view;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const at = (x, y) => [(x + w / 2) * pxPerM, (h / 2 - y) * pxPerM];
  draw?.(ctx, at, pxPerM);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: view.texture, roughness }));
  mesh.position.z = z;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/** A lit display behind glass, redrawn only when its content changes. */
export class Display {
  constructor(parent, x, y, w, h, { pxPerM = 4200, glass = "#0d1114", z = 0.0012 } = {}) {
    this.view = canvasTexture(w * pxPerM, h * pxPerM);
    this.glass = glass;
    const bezel = new THREE.Mesh(rounded(w + 0.008, h + 0.008, 0.004, 0.0015), mat.plastic("#16191c", 0.7));
    bezel.position.set(x, y, z - 0.0012);
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: this.view.texture, toneMapped: false }));
    this.mesh.position.set(x, y, z + 0.0011);
    parent.add(bezel, this.mesh);
    this.w = this.view.canvas.width;
    this.h = this.view.canvas.height;
    this.key = null;
  }
  /** Redraws only when `key` differs from the last draw. */
  draw(key, fn) {
    if (key !== undefined && key === this.key) return;
    this.key = key;
    const { ctx } = this.view;
    ctx.fillStyle = this.glass;
    ctx.fillRect(0, 0, this.w, this.h);
    fn(ctx, this.w, this.h);
    this.view.texture.needsUpdate = true;
  }
}

/**
 * A rotary control with detents. Its shaft is the group's local +z. `values`
 * are the detent values spread over `sweep` degrees, centred on 12 o'clock.
 */
export class Knob {
  constructor(parent, { x, y, z = 0, radius = 0.014, values, index = 0, sweep = 270, color = "#2b2e33", cap = "#3a3e44", marker = "#f4f1ea", onChange, name }) {
    this.values = values;
    this.index = index;
    this.sweep = (sweep * Math.PI) / 180;
    this.onChange = onChange;
    this.name = name;
    this.group = new THREE.Group();
    this.group.position.set(x, y, z);
    this.dial = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.08, radius * 1.1, 40).rotateX(Math.PI / 2).translate(0, 0, radius * 0.55), mat.plastic(color, 0.45));
    // a knurled grip: shallow ribs around the body
    const ribs = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.02, radius * 1.1, radius * 0.75, 24, 1, true).rotateX(Math.PI / 2).translate(0, 0, radius * 0.45), new THREE.MeshStandardMaterial({ color, roughness: 0.75, wireframe: false, flatShading: true }));
    const top = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.86, radius * 0.94, 0.002, 40).rotateX(Math.PI / 2).translate(0, 0, radius * 1.1 + 0.001), mat.metal(cap, 0.4));
    const line = new THREE.Mesh(new THREE.BoxGeometry(radius * 0.16, radius * 0.75, 0.0012), new THREE.MeshBasicMaterial({ color: marker }));
    line.position.set(0, radius * 0.48, radius * 1.1 + 0.0024);
    body.castShadow = true;
    this.dial.add(body, ribs, top, line);
    this.group.add(this.dial);
    parent.add(this.group);
    for (const m of [body, ribs, top, line]) m.userData.ref = this;
    this.pickable = body;
    this.glow = body.material;
    this.place();
  }
  angleOf(i) {
    if (this.values.length < 2) return 0;
    return this.sweep / 2 - (i / (this.values.length - 1)) * this.sweep;
  }
  get value() { return this.values[this.index]; }
  get detent() { return this.values.length < 2 ? Infinity : this.sweep / (this.values.length - 1); }
  place() { this.dial.rotation.z = this.angleOf(this.index); }
  setIndex(next, quiet = false) {
    const clamped = THREE.MathUtils.clamp(next, 0, this.values.length - 1);
    if (clamped === this.index) return false;
    this.index = clamped;
    this.place();
    if (!quiet) this.onChange?.(this.value, this);
    return true;
  }
  setValue(v) {
    const i = this.values.indexOf(v);
    if (i >= 0) this.setIndex(i, true);
  }
}

/**
 * A push button with real travel along local +z. Pressed by a click, or by a
 * VR fingertip that arrives from in front and pushes 2 mm in.
 */
export class Key {
  constructor(parent, { x, y, w = 0.022, h = 0.014, depth = 0.008, color = "#d9d5cb", label, labelColor = "#1d1f22", draw, led = null, onPress, name, round = false }) {
    this.onPress = onPress;
    this.name = name;
    this.w = w;
    this.h = h;
    this.rest = depth / 2 + 0.0005;
    this.group = new THREE.Group();
    this.group.position.set(x, y, 0);
    const geometry = round ? new THREE.CylinderGeometry(w / 2, w / 2, depth, 32).rotateX(Math.PI / 2) : rounded(w, h, depth, Math.min(w, h) * 0.18);
    this.faceView = canvasTexture(w * 9000, (round ? w : h) * 9000);
    const { ctx, canvas } = this.faceView;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (draw) draw(ctx, canvas.width, canvas.height);
    else if (label) {
      ctx.font = `800 100px ${SANS}`;
      const fit = (canvas.width * 0.8 * 100) / ctx.measureText(label).width;
      text(ctx, label, canvas.width / 2, canvas.height / 2 + 2, Math.min(canvas.height * 0.5, fit), { color: labelColor, weight: 800 });
    }
    this.faceView.texture.needsUpdate = true;
    this.body = new THREE.Mesh(geometry, mat.plastic(color, 0.5));
    this.face = new THREE.Mesh(round ? new THREE.CircleGeometry(w / 2 * 0.98, 32) : new THREE.PlaneGeometry(w * 0.94, h * 0.9), new THREE.MeshStandardMaterial({ map: this.faceView.texture, roughness: 0.5 }));
    this.face.position.z = depth / 2 + 0.0002;
    this.cap = new THREE.Group();
    this.cap.add(this.body, this.face);
    this.cap.position.z = this.rest;
    this.body.castShadow = true;
    this.group.add(this.cap);
    // a dark well the cap sinks into
    const well = new THREE.Mesh(rounded(w + 0.003, (round ? w : h) + 0.003, 0.002, 0.0008), mat.plastic("#121416", 0.8));
    well.position.z = 0.0008;
    this.group.add(well);
    if (led) {
      this.ledOn = new THREE.Color(led);
      this.led = new THREE.Mesh(new THREE.SphereGeometry(0.0022, 16, 10), new THREE.MeshBasicMaterial({ color: "#2a2d30" }));
      this.led.position.set(0, (round ? w : h) / 2 + 0.006, 0.001);
      this.group.add(this.led);
    }
    for (const m of [this.body, this.face]) m.userData.ref = this;
    this.pickable = this.body;
    this.glow = this.body.material;
    this.latched = false;
    parent.add(this.group);
  }
  setLit(on) { if (this.led) this.led.material.color.set(on ? this.ledOn : "#2a2d30"); }
  press() {
    this.cap.position.z = this.rest - 0.0025;
    setTimeout(() => { this.cap.position.z = this.rest; }, 130);
    this.onPress?.(this);
  }
  /** Depth a fingertip pushes the cap in (0–3 mm). Only counts after arriving from in front. */
  pokeDepth(tipWorld, armed) {
    const tip = this.group.worldToLocal(tipWorld.clone());
    const face = this.rest + 0.004;
    const over = Math.abs(tip.x) < this.w / 2 + 0.004 && Math.abs(tip.y) < this.h / 2 + 0.004;
    if (!over || tip.z > face + 0.03 || tip.z < this.rest - 0.03) { armed.delete(this); return 0; }
    if (tip.z > face) { armed.add(this); return 0; }
    return armed.has(this) ? Math.min(face - tip.z, 0.003) : 0;
  }
  setDepth(depth) {
    this.cap.position.z = this.rest - depth;
    let fired = false;
    if (depth >= 0.002 && !this.latched) { this.latched = true; this.onPress?.(this); fired = true; }
    if (depth < 0.001) this.latched = false;
    return fired;
  }
}

/** A 4 mm banana jack or binding post; `point` is where a plug seats, `normal` its axis out. */
export function jack(parent, x, y, color, { post = false } = {}) {
  const group = new THREE.Group();
  group.position.set(x, y, 0);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(post ? 0.0085 : 0.0075, post ? 0.0095 : 0.008, post ? 0.014 : 0.006, 28).rotateX(Math.PI / 2).translate(0, 0, post ? 0.007 : 0.003), mat.plastic(color, 0.35));
  const metal = new THREE.Mesh(new THREE.CylinderGeometry(0.0034, 0.0034, 0.002, 20).rotateX(Math.PI / 2).translate(0, 0, post ? 0.0141 : 0.0061), mat.metal("#b8a165", 0.3));
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.002, 16), new THREE.MeshBasicMaterial({ color: "#050506" }));
  hole.position.z = (post ? 0.0141 : 0.0061) + 0.0011;
  collar.castShadow = true;
  group.add(collar, metal, hole);
  parent.add(group);
  const tipZ = post ? 0.0152 : 0.0072;
  return { group, tipZ, point: () => group.localToWorld(new THREE.Vector3(0, 0, tipZ)), normal: () => new THREE.Vector3(0, 0, 1).transformDirection(group.matrixWorld) };
}

/**
 * A flexible cable from a fixed anchor to a moving end. It leaves each end
 * along that end's axis, hangs between them and settles onto whatever lies
 * beneath, given by `heightAt(x, z)` in the same frame.
 */
export class Cable {
  constructor(parent, color, radius = 0.0026) {
    this.radius = radius;
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat.plastic(color, 0.5));
    this.mesh.castShadow = true;
    this.mesh.frustumCulled = false;
    parent.add(this.mesh);
    this.key = "";
  }
  update(a, aDir, b, bDir, heightAt) {
    const key = [a, aDir, b, bDir].map((v) => `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`).join("|");
    if (key === this.key) return;
    this.key = key;
    const r = this.radius;
    const p1 = a.clone().addScaledVector(aDir, 0.025);
    const p2 = b.clone().addScaledVector(bDir, 0.018);
    const span = Math.hypot(p2.x - p1.x, p2.z - p1.z);
    const points = [a, p1];
    const n = Math.max(6, Math.round(span / 0.02));
    for (let i = 1; i < n; i += 1) {
      const t = i / n;
      const q = p1.clone().lerp(p2, t);
      const hang = Math.sin(Math.PI * t) * (0.05 + span * 1.2);
      q.y = Math.max(heightAt(q.x, q.z) + r, q.y - hang);
      points.push(q);
    }
    points.push(p2, b);
    const path = new THREE.CatmullRomCurve3(points, false, "chordal");
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.TubeGeometry(path, Math.min(160, points.length * 4), r, 8, false);
  }
}

/** Arrange a printed label across a face, used for small engraved captions. */
export function caption(ctx, at, s, x, y, size, opts) {
  const [px, py] = at(x, y);
  text(ctx, s, px, py, size, opts);
}
