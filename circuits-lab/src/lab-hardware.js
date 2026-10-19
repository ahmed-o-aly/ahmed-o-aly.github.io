import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/**
 * The bench's industrial-design vocabulary: materials and parts that real test
 * equipment is made of, so instruments read as moulded ABS, anodised aluminium,
 * glass and rubber rather than as coloured boxes.
 *
 * Bench units, Z up. One unit is roughly 14.5 cm, so a 3.7-unit instrument is a
 * ~54 cm benchtop case. Every geometry and material here is cached and shared:
 * the same scene has to hold 72–90 fps in a headset.
 */

/** One shared cache per scene, so parts never duplicate a material or geometry. */
export function createHardware() {
  const cache = new Map();
  const disposables = [];
  const once = (key, build) => {
    if (!cache.has(key)) {
      const value = build();
      disposables.push(value);
      cache.set(key, value);
    }
    return cache.get(key);
  };

  // ---- Procedural surface detail ----------------------------------------
  // Canvas maps keep micro-detail without shipping textures, and cost one upload.
  function map(key, size, draw, { repeat = [1, 1], linear = false } = {}) {
    return once(key, () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      draw(canvas.getContext("2d"), size);
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(...repeat);
      texture.anisotropy = 8;
      if (!linear) texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    });
  }

  /** Fine moulding texture; breaks up the flat shading on large plastic faces. */
  const absRoughness = () =>
    map(
      "rough:abs",
      256,
      (c, s) => {
        c.fillStyle = "#b4b4b4";
        c.fillRect(0, 0, s, s);
        for (let i = 0; i < 26000; i += 1) {
          const v = 150 + Math.random() * 70;
          c.fillStyle = `rgba(${v},${v},${v},0.5)`;
          c.fillRect(Math.random() * s, Math.random() * s, 1, 1);
        }
      },
      { repeat: [3, 3], linear: true }
    );

  /** Circular brushing for knob caps and instrument trim. */
  const brushedRoughness = () =>
    map(
      "rough:brushed",
      256,
      (c, s) => {
        c.fillStyle = "#6e6e6e";
        c.fillRect(0, 0, s, s);
        for (let i = 0; i < 2200; i += 1) {
          const y = Math.random() * s;
          c.strokeStyle = `rgba(255,255,255,${Math.random() * 0.22})`;
          c.lineWidth = Math.random() * 1.4;
          c.beginPath();
          c.moveTo(0, y);
          c.lineTo(s, y + (Math.random() - 0.5) * 3);
          c.stroke();
        }
      },
      { repeat: [2, 2], linear: true }
    );

  /** Vertical knurling for knob skirts. */
  const knurlRoughness = () =>
    map(
      "rough:knurl",
      256,
      (c, s) => {
        c.fillStyle = "#4a4a4a";
        c.fillRect(0, 0, s, s);
        const teeth = 56;
        for (let i = 0; i < teeth; i += 1) {
          const x = (i / teeth) * s;
          const gradient = c.createLinearGradient(x, 0, x + s / teeth, 0);
          gradient.addColorStop(0, "rgba(255,255,255,0.55)");
          gradient.addColorStop(0.5, "rgba(0,0,0,0.35)");
          gradient.addColorStop(1, "rgba(255,255,255,0.55)");
          c.fillStyle = gradient;
          c.fillRect(x, 0, s / teeth, s);
        }
      },
      { repeat: [1, 1], linear: true }
    );

  // ---- Material palette --------------------------------------------------
  const srgb = (hex) => new THREE.Color(hex).convertSRGBToLinear();
  const standard = (key, options) => once(key, () => new THREE.MeshStandardMaterial(options));
  const physical = (key, options) => once(key, () => new THREE.MeshPhysicalMaterial(options));

  const materials = {
    /** Moulded instrument shell. */
    shell: (color = "#dfe3e6") =>
      standard(`shell:${color}`, {
        color: srgb(color),
        roughness: 0.52,
        metalness: 0.04,
        roughnessMap: absRoughness(),
      }),
    /** Darker chassis and rear casework. */
    chassis: (color = "#3f474d") =>
      standard(`chassis:${color}`, { color: srgb(color), roughness: 0.58, metalness: 0.18, roughnessMap: absRoughness() }),
    /**
     * Painted/anodised instrument panel. Deliberately low metalness: a fully
     * metallic surface takes all its colour from reflections and reads black
     * under this room's modest environment light.
     */
    anodised: (color = "#b9c1c6") =>
      standard(`anod:${color}`, { color: srgb(color), roughness: 0.42, metalness: 0.14, roughnessMap: brushedRoughness() }),
    /** Bare brushed metal, for trim that should actually look metallic. */
    brushed: (color = "#aeb6bb") =>
      standard(`brush:${color}`, { color: srgb(color), roughness: 0.3, metalness: 0.85, roughnessMap: brushedRoughness() }),
    /** Bright plated metal: jack rings, screws, shafts. */
    chrome: () => standard("chrome", { color: srgb("#cdd4d8"), roughness: 0.17, metalness: 1 }),
    /** Dark machined metal. */
    gunmetal: () => standard("gunmetal", { color: srgb("#5a6268"), roughness: 0.3, metalness: 0.9 }),
    /** Knob skirt: matte filled plastic with knurling. */
    knurled: (color = "#2d3338") =>
      standard(`knurl:${color}`, { color: srgb(color), roughness: 0.62, metalness: 0.12, roughnessMap: knurlRoughness() }),
    /** Rubber feet and gaskets. */
    rubber: () => standard("rubber", { color: srgb("#1d2124"), roughness: 0.94, metalness: 0 }),
    /** Display cover glass over an emissive face. */
    glass: () =>
      physical("glass", {
        color: srgb("#aebac2"),
        roughness: 0.08,
        metalness: 0,
        transmission: 0,
        transparent: true,
        opacity: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
      }),
    /** Coloured insulator on a 4 mm jack or plug. */
    insulator: (color) => standard(`ins:${color}`, { color: srgb(color), roughness: 0.42, metalness: 0.03 }),
    /** Cable jacket. */
    jacket: (color) => standard(`jacket:${color}`, { color: srgb(color), roughness: 0.46, metalness: 0.02 }),
    /** Epoxy IC body. */
    epoxy: () => standard("epoxy", { color: srgb("#24282c"), roughness: 0.48, metalness: 0.05 }),
    /** Indicator LED, lit or dark. */
    led: (color, lit) =>
      standard(`led:${color}:${lit}`, {
        color: srgb(lit ? color : "#4a5055"),
        emissive: srgb(lit ? color : "#000000"),
        emissiveIntensity: lit ? 2.4 : 0,
        roughness: 0.25,
        metalness: 0,
      }),
  };

  // ---- Shared geometry ---------------------------------------------------
  const geo = {
    rounded: (w, h, d, r) => once(`rb:${w}:${h}:${d}:${r}`, () => new RoundedBoxGeometry(w, h, d, 3, r)),
    cylinder: (rt, rb, h, seg = 24) => once(`cy:${rt}:${rb}:${h}:${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg)),
    sphere: (r, seg = 12) => once(`sp:${r}:${seg}`, () => new THREE.SphereGeometry(r, seg, seg)),
    plane: (w, h) => once(`pl:${w}:${h}`, () => new THREE.PlaneGeometry(w, h)),
    torus: (r, tube, seg = 20) => once(`to:${r}:${tube}:${seg}`, () => new THREE.TorusGeometry(r, tube, 8, seg)),
    box: (w, h, d) => once(`bx:${w}:${h}:${d}`, () => new THREE.BoxGeometry(w, h, d)),
  };

  /** A disc lying in the bench plane (its axis along +Z). */
  function disc(radiusTop, radiusBottom, depth, material, segments = 24) {
    const mesh = new THREE.Mesh(geo.cylinder(radiusTop, radiusBottom, depth, segments), material);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  }

  // ---- Parts -------------------------------------------------------------

  /**
   * A 4 mm shrouded banana jack: recessed metal bezel, coloured insulator and a
   * dark bore, which is what makes a socket read as something a plug goes into.
   */
  function bananaJack(color, { radius = 0.085 } = {}) {
    const group = new THREE.Group();
    const bezel = disc(radius * 1.28, radius * 1.34, 0.055, materials.chrome(), 20);
    bezel.position.z = 0.025;
    group.add(bezel);
    const body = disc(radius, radius * 1.05, 0.075, materials.insulator(color), 20);
    body.position.z = 0.055;
    group.add(body);
    const collar = new THREE.Mesh(geo.torus(radius * 0.72, 0.012, 18), materials.chrome());
    collar.position.z = 0.09;
    group.add(collar);
    const bore = disc(radius * 0.52, radius * 0.52, 0.03, materials.epoxy(), 16);
    bore.position.z = 0.097;
    group.add(bore);
    for (const child of group.children) child.castShadow = true;
    return group;
  }

  /**
   * A control knob: knurled skirt, brushed cap, chamfer and a pointer that reads
   * from across the bench. `tick` is returned so the scene can rotate it.
   */
  function knob(color, { radius = 0.26, height = 0.17 } = {}) {
    const group = new THREE.Group();
    const base = disc(radius * 1.18, radius * 1.24, 0.045, materials.gunmetal(), 24);
    base.position.z = 0.02;
    group.add(base);
    const skirt = disc(radius, radius * 1.04, height, materials.knurled(), 28);
    skirt.position.z = 0.04 + height / 2;
    group.add(skirt);
    const cap = disc(radius * 0.93, radius * 0.97, 0.03, materials.anodised(color), 28);
    cap.position.z = 0.04 + height + 0.012;
    group.add(cap);
    const tick = new THREE.Mesh(geo.box(0.028, radius * 0.78, 0.014), materials.shell("#f4f8fa"));
    tick.position.set(0, radius * 0.42, 0.04 + height + 0.03);
    group.add(tick);
    for (const child of group.children) child.castShadow = true;
    return { group, tick };
  }

  /**
   * A benchtop instrument case: moulded shell, recessed anodised front panel,
   * side vents, rubber feet and a glass-covered display aperture. The caller
   * supplies the live face texture; this builds everything around it.
   */
  function instrumentCase(width, height, { depth = 0.95, shell = "#dfe3e6", panel = "#b9c1c6" } = {}) {
    const group = new THREE.Group();

    // Rear shell, slightly tapered so the case is not a plain extrusion.
    const body = new THREE.Mesh(geo.rounded(width + 0.1, height + 0.1, depth, 0.06), materials.shell(shell));
    body.position.set(0, height / 2, -depth / 2 + 0.1);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Recessed anodised front panel: the bezel the display and controls sit in.
    const panelPlate = new THREE.Mesh(geo.rounded(width, height, 0.1, 0.035), materials.anodised(panel));
    panelPlate.position.set(0, height / 2, 0.07);
    panelPlate.castShadow = true;
    panelPlate.receiveShadow = true;
    group.add(panelPlate);

    // Side vent slots. Real instruments breathe, and the slots give the case scale.
    const ventMaterial = materials.chassis("#2b3237");
    for (const side of [-1, 1]) {
      for (let i = 0; i < 5; i += 1) {
        const slot = new THREE.Mesh(geo.box(0.035, height * 0.42, 0.5), ventMaterial);
        slot.position.set(side * (width / 2 + 0.048), height / 2, -depth * 0.32 + i * 0.1);
        group.add(slot);
      }
    }

    // Rubber feet, and a tilt bail at the front so the case sits at a working angle.
    for (const fx of [-width * 0.36, width * 0.36]) {
      for (const fz of [-depth * 0.62, 0.0]) {
        const foot = new THREE.Mesh(geo.cylinder(0.055, 0.065, 0.1, 12), materials.rubber());
        foot.rotation.x = Math.PI / 2;
        foot.position.set(fx, 0.07, fz);
        foot.castShadow = true;
        group.add(foot);
      }
    }

    // Panel fixing screws.
    for (const sx of [-width / 2 + 0.085, width / 2 - 0.085]) {
      for (const sy of [0.1, height - 0.1]) {
        const screw = disc(0.028, 0.028, 0.016, materials.chrome(), 10);
        screw.position.set(sx, sy, 0.123);
        group.add(screw);
        const slot = new THREE.Mesh(geo.box(0.036, 0.007, 0.006), materials.gunmetal());
        slot.position.set(sx, sy, 0.132);
        slot.rotation.z = 0.5;
        group.add(slot);
      }
    }
    return { group, panelZ: 0.122 };
  }

  /**
   * A sunken display window: dark surround, the live face, then cover glass with a
   * specular edge. Returns where the face texture should sit.
   */
  function displayWindow(width, height, { z = 0.124 } = {}) {
    const group = new THREE.Group();
    const surround = new THREE.Mesh(geo.rounded(width + 0.1, height + 0.1, 0.05, 0.03), materials.chassis("#1b2024"));
    surround.position.z = z - 0.01;
    group.add(surround);
    const glass = new THREE.Mesh(geo.plane(width + 0.04, height + 0.04), materials.glass());
    glass.position.z = z + 0.035;
    glass.renderOrder = 2;
    group.add(glass);
    return { group, faceZ: z + 0.022 };
  }

  /** A DIP-8 integrated circuit with a pin-1 notch and real legs. */
  function dipChip(width, height, { pins = 8 } = {}) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(geo.rounded(width, height, 0.17, 0.012), materials.epoxy());
    body.position.z = 0.085;
    body.castShadow = true;
    group.add(body);
    // Pin-1 notch, the feature students orient the chip by.
    const notch = disc(width * 0.1, width * 0.1, 0.06, materials.chassis("#15181b"), 14);
    notch.position.set(0, height / 2 - 0.02, 0.15);
    group.add(notch);
    const legMaterial = materials.chrome();
    const perSide = pins / 2;
    for (let i = 0; i < perSide; i += 1) {
      const y = height / 2 - (i + 0.5) * (height / perSide);
      for (const side of [-1, 1]) {
        const leg = new THREE.Mesh(geo.box(0.09, 0.05, 0.03), legMaterial);
        leg.position.set(side * (width / 2 + 0.04), y, 0.02);
        leg.castShadow = true;
        group.add(leg);
      }
    }
    return group;
  }

  /**
   * A solderless breadboard face: moulded recesses, a centre channel and the
   * red/blue bus rails. Drawn as one high-resolution map rather than thousands of
   * hole meshes, which is both sharper and far cheaper in a headset.
   */
  function breadboardFace(width, height, { columns = 48, rows = 26, channelRows = 2 } = {}) {
    const key = `bb:${width}:${height}:${columns}:${rows}`;
    return once(key, () => {
      const pixelsPerUnit = 300;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * pixelsPerUnit);
      canvas.height = Math.round(height * pixelsPerUnit);
      const c = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;

      c.fillStyle = "#e9eae5";
      c.fillRect(0, 0, W, H);
      // Moulding grain, so the plastic is not a flat fill.
      for (let i = 0; i < 24000; i += 1) {
        const v = 215 + Math.random() * 30;
        c.fillStyle = `rgba(${v},${v},${v - 3},0.35)`;
        c.fillRect(Math.random() * W, Math.random() * H, 2, 2);
      }

      const railHeight = H * 0.1;
      const field = { top: railHeight, bottom: H - railHeight };
      const fieldHeight = field.bottom - field.top;
      const totalRows = rows + channelRows;
      const rowStep = fieldHeight / totalRows;
      const colStep = W / (columns + 2);
      const channelTop = field.top + (rows / 2) * rowStep;

      /** One moulded square recess with a lit top edge and a shadowed floor. */
      const hole = (x, y) => {
        const r = Math.min(colStep, rowStep) * 0.3;
        c.fillStyle = "rgba(142,148,150,0.55)";
        c.fillRect(x - r - 1.5, y - r - 1.5, r * 2 + 3, r * 2 + 3);
        c.fillStyle = "#3a4044";
        c.fillRect(x - r, y - r, r * 2, r * 2);
        c.fillStyle = "rgba(255,255,255,0.5)";
        c.fillRect(x - r - 1.5, y - r - 1.5, r * 2 + 3, 1.5);
        c.fillStyle = "#15191c";
        c.fillRect(x - r * 0.55, y - r * 0.55, r * 1.1, r * 1.1);
      };

      for (let row = 0; row < totalRows; row += 1) {
        if (row >= rows / 2 && row < rows / 2 + channelRows) continue;
        const y = field.top + (row + 0.5) * rowStep;
        for (let col = 0; col < columns; col += 1) hole((col + 1.5) * colStep, y);
      }

      // Centre channel: a recessed trough, where a DIP package straddles the gap.
      const channelHeight = rowStep * channelRows;
      const trough = c.createLinearGradient(0, channelTop, 0, channelTop + channelHeight);
      trough.addColorStop(0, "#b3b7b5");
      trough.addColorStop(0.35, "#d6d8d3");
      trough.addColorStop(1, "#c3c6c2");
      c.fillStyle = trough;
      c.fillRect(0, channelTop, W, channelHeight);
      c.fillStyle = "rgba(90,96,98,0.45)";
      c.fillRect(0, channelTop, W, 3);
      c.fillRect(0, channelTop + channelHeight - 3, W, 3);

      // Bus rails, the convention every bench follows: red is positive, blue common.
      for (const [edge, color, sign] of [
        [0, "#c0392b", "+"],
        [1, "#2a6fb0", "\u2212"],
      ]) {
        const centre = edge === 0 ? railHeight * 0.5 : H - railHeight * 0.5;
        c.strokeStyle = color;
        c.lineWidth = Math.max(3, H * 0.006);
        c.beginPath();
        c.moveTo(colStep * 0.7, centre - rowStep * 0.75);
        c.lineTo(W - colStep * 0.7, centre - rowStep * 0.75);
        c.moveTo(colStep * 0.7, centre + rowStep * 0.75);
        c.lineTo(W - colStep * 0.7, centre + rowStep * 0.75);
        c.stroke();
        c.fillStyle = color;
        c.font = `bold ${Math.round(rowStep * 1.15)}px Arial`;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(sign, colStep * 0.42, centre - rowStep * 0.75);
        c.fillText(sign, W - colStep * 0.42, centre + rowStep * 0.75);
        for (let col = 0; col < columns; col += 1) {
          if (col % 6 === 5) continue;
          const x = (col + 1.5) * colStep;
          hole(x, centre - rowStep * 0.35);
          hole(x, centre + rowStep * 0.35);
        }
      }

      // Column numbers and row letters, as printed on a real board.
      c.fillStyle = "#6d7478";
      c.font = `${Math.round(rowStep * 0.62)}px Arial`;
      for (let col = 4; col < columns; col += 5) {
        const x = (col + 1.5) * colStep;
        c.fillText(String(col + 1), x, field.top - rowStep * 0.42);
        c.fillText(String(col + 1), x, field.bottom + rowStep * 0.42);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 16;
      return texture;
    });
  }

  /** A through-hole indicator LED. */
  function indicator(color, lit) {
    const lens = disc(0.045, 0.05, 0.055, materials.led(color, lit), 14);
    lens.position.z = 0.03;
    return lens;
  }

  function dispose() {
    for (const value of disposables) value.dispose?.();
    cache.clear();
  }

  return { materials, geo, disc, bananaJack, knob, instrumentCase, displayWindow, dipChip, indicator, breadboardFace, dispose, srgb };
}
