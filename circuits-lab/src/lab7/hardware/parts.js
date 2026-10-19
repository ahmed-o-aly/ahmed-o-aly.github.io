import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mm, PITCH, SURFACE } from "../design/tokens.js";

/**
 * The parts the bench is assembled from, built to the design system's component
 * specs. Metres, Y up. Panels face +Z unless a case rakes them.
 *
 * Geometry is cached by shape, so a bench with twenty jacks uploads one jack.
 */
export function createParts(materials) {
  const cache = new Map();
  const disposables = [];
  const geo = (key, build) => {
    if (!cache.has(key)) {
      const value = build();
      disposables.push(value);
      cache.set(key, value);
    }
    return cache.get(key);
  };

  const cylinder = (rt, rb, h, seg = 24) => geo(`cy${rt}${rb}${h}${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg));
  const box = (w, h, d, r = 0) => geo(`bx${w}${h}${d}${r}`, () => (r > 0 ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d)));
  const torus = (r, tube, seg = 20) => geo(`to${r}${tube}${seg}`, () => new THREE.TorusGeometry(r, tube, 8, seg));
  const plane = (w, h) => geo(`pl${w}${h}`, () => new THREE.PlaneGeometry(w, h));

  /** A disc whose axis points along +Z, which is how panel hardware sits. */
  const facing = (geometry, material) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  };

  /**
   * A 4 mm shrouded banana terminal.
   *
   * Three details do the work and none are optional: the bezel is RECESSED into
   * the panel, the bore is genuinely dark so it reads as something a plug enters,
   * and the collar catches a highlight. A flat coloured disc reads as a sticker.
   */
  function jack(color, { radius = mm(4.1) } = {}) {
    const group = new THREE.Group();
    const bezel = facing(cylinder(radius * 1.3, radius * 1.36, mm(1.4), 20), materials.plated());
    bezel.position.z = mm(0.6);
    group.add(bezel);
    const insulator = facing(cylinder(radius, radius * 1.04, mm(2), 20), materials.insulator(color));
    insulator.position.z = mm(1.4);
    group.add(insulator);
    const collar = new THREE.Mesh(torus(radius * 0.7, mm(0.35), 18), materials.plated());
    collar.position.z = mm(2.3);
    group.add(collar);
    const bore = facing(cylinder(radius * 0.5, radius * 0.5, mm(1.2), 16), materials.epoxy());
    bore.position.z = mm(2.5);
    group.add(bore);
    // Ground is near-black and vanishes on a graphite panel without this ring.
    if (color === SURFACE.panel || color === "#23282b") {
      const ring = new THREE.Mesh(torus(radius * 1.02, mm(0.22), 20), materials.plated("#8d969c"));
      ring.position.z = mm(2.4);
      group.add(ring);
    }
    for (const child of group.children) child.castShadow = true;
    group.userData.contactOffset = mm(3);
    return group;
  }

  /**
   * A rotary control: knurled skirt, brushed cap, one white pointer.
   *
   * The knurl is modelled geometry rather than a texture — at headset viewing
   * distance the silhouette is what says "this can be gripped".
   */
  function knob({ radius = mm(17.5), height = mm(14), color = SURFACE.trim, teeth = 30 } = {}) {
    const group = new THREE.Group();
    const base = facing(cylinder(radius * 1.2, radius * 1.26, mm(3), 24), materials.gunmetal());
    base.position.z = mm(1.5);
    group.add(base);

    const skirt = facing(cylinder(radius, radius * 1.03, height, 28), materials.abs("#2d3338"));
    skirt.position.z = mm(3) + height / 2;
    group.add(skirt);

    // Knurl teeth: thin boxes around the rim, instanced into one draw call.
    const tooth = box(mm(1.1), mm(1.1), height);
    const knurl = new THREE.InstancedMesh(tooth, materials.abs("#262b30"), teeth);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < teeth; i += 1) {
      const a = (i / teeth) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * radius, Math.sin(a) * radius, mm(3) + height / 2);
      dummy.rotation.set(0, 0, a);
      dummy.updateMatrix();
      knurl.setMatrixAt(i, dummy.matrix);
    }
    knurl.castShadow = true;
    group.add(knurl);

    const cap = facing(cylinder(radius * 0.94, radius * 0.97, mm(2.5), 28), materials.panel(color));
    cap.position.z = mm(3) + height + mm(1);
    group.add(cap);

    // The pointer is the point: one high-contrast marker reaching the cap's edge.
    const pointer = new THREE.Mesh(box(mm(2.2), radius * 0.8, mm(1.2), mm(0.4)), materials.abs("#f4f8fa"));
    pointer.position.set(0, radius * 0.42, mm(3) + height + mm(2.4));
    group.add(pointer);

    for (const child of group.children) child.castShadow = true;
    group.userData.pointer = pointer;
    return group;
  }

  /** A moulded keycap standing proud of its bezel. */
  function key({ width = mm(16), height = mm(12), color = SURFACE.trim } = {}) {
    const group = new THREE.Group();
    const bezel = new THREE.Mesh(box(width + mm(3), height + mm(3), mm(2), mm(0.6)), materials.abs("#2f363b"));
    bezel.position.z = mm(1);
    group.add(bezel);
    const cap = new THREE.Mesh(box(width, height, mm(3), mm(0.8)), materials.panel(color));
    cap.position.z = mm(3);
    cap.castShadow = true;
    group.add(cap);
    group.userData.cap = cap;
    return group;
  }

  /** A through-hole indicator. Lit means the rails are live. */
  function led(color, lit = false) {
    const lens = facing(cylinder(mm(2.2), mm(2.5), mm(2), 14), materials.led(color, lit));
    lens.position.z = mm(1);
    return lens;
  }

  /**
   * A benchtop instrument case: moulded shell, recessed panel, side vents, rubber
   * feet and panel screws. The panel is raked toward the standing position so a
   * figure is read square-on rather than at a glancing angle.
   */
  function instrumentCase(widthMM, heightMM, { depthMM = 230, rake = 0.18 } = {}) {
    const width = mm(widthMM);
    const height = mm(heightMM);
    const depth = mm(depthMM);
    const group = new THREE.Group();

    const shell = new THREE.Mesh(box(width + mm(6), height + mm(6), depth, mm(3)), materials.abs());
    shell.position.set(0, height / 2, -depth / 2);
    shell.castShadow = true;
    shell.receiveShadow = true;
    group.add(shell);

    // The raked front panel, and everything mounted on it, lives in this group.
    const face = new THREE.Group();
    face.position.set(0, height / 2, mm(1));
    face.rotation.x = -rake;
    group.add(face);

    const plate = new THREE.Mesh(box(width, height, mm(4), mm(1)), materials.panel());
    plate.castShadow = true;
    plate.receiveShadow = true;
    face.add(plate);

    // Vents: real instruments breathe, and the slots give the case its scale.
    const vent = box(mm(2), height * 0.42, mm(16));
    for (const side of [-1, 1]) {
      for (let i = 0; i < 5; i += 1) {
        const slot = new THREE.Mesh(vent, materials.abs("#2b3237"));
        slot.position.set(side * (width / 2 + mm(3)), height / 2, -depth * 0.35 + i * mm(9));
        group.add(slot);
      }
    }

    for (const fx of [-width * 0.36, width * 0.36]) {
      for (const fz of [-depth * 0.72, -depth * 0.1]) {
        const foot = facing(cylinder(mm(5), mm(6), mm(4), 12), materials.rubber());
        foot.position.set(fx, mm(2), fz);
        group.add(foot);
      }
    }

    for (const sx of [-width / 2 + mm(5), width / 2 - mm(5)]) {
      for (const sy of [-height / 2 + mm(5), height / 2 - mm(5)]) {
        const screw = facing(cylinder(mm(1.6), mm(1.6), mm(0.8), 10), materials.plated());
        screw.position.set(sx, sy, mm(2.2));
        face.add(screw);
      }
    }

    group.userData = { face, width, height, depth, panelZ: mm(2.1) };
    return group;
  }

  /**
   * The printed face of a panel, sitting just proud of its plate, with cover glass
   * over it so the readout has depth and catches the room.
   */
  function printedFace(panel, widthMM, heightMM) {
    const group = new THREE.Group();
    const face = new THREE.Mesh(plane(mm(widthMM), mm(heightMM)), materials.printed(panel.texture));
    face.position.z = mm(2.3);
    group.add(face);
    const glass = new THREE.Mesh(plane(mm(widthMM), mm(heightMM)), materials.glass());
    glass.position.z = mm(2.6);
    glass.renderOrder = 2;
    group.add(glass);
    return group;
  }

  /**
   * A 741 in DIP-8, at its real 9.8 x 6.4 mm with a pin-1 notch and real legs.
   *
   * The design system is explicit that this stays true size and the pin labels
   * move to the floating callout. Inflating it to fit its own caption is the
   * single change that made the previous bench read as a toy.
   */
  function dip8() {
    const group = new THREE.Group();
    const bodyW = mm(9.8);
    const bodyH = mm(6.4);
    const body = new THREE.Mesh(box(bodyW, bodyH, mm(3.4), mm(0.3)), materials.epoxy());
    body.position.z = mm(1.7) + mm(1.5);
    body.castShadow = true;
    group.add(body);

    const notch = facing(cylinder(mm(1), mm(1), mm(1), 14), materials.abs("#15181b"));
    notch.position.set(-bodyW / 2 + mm(0.4), 0, mm(4.9));
    group.add(notch);

    const leg = box(mm(0.9), mm(0.5), mm(3));
    for (let i = 0; i < 4; i += 1) {
      const x = -1.5 * PITCH + i * PITCH;
      for (const side of [-1, 1]) {
        const pin = new THREE.Mesh(leg, materials.plated());
        pin.position.set(x, side * (PITCH * 1.5), mm(1.5));
        pin.castShadow = true;
        group.add(pin);
      }
    }
    return group;
  }

  /**
   * A full-size solderless breadboard, 165 x 55 mm, 830 tie points.
   *
   * The moulded recesses, centre channel and bus rails are one printed map rather
   * than a field of hole meshes: sharper at close range and far cheaper to draw.
   */
  function breadboard({ widthMM = 165, heightMM = 55, columns = 63, dpmm = 22 } = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(widthMM * dpmm);
    canvas.height = Math.round(heightMM * dpmm);
    const c = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const px = (value) => value * dpmm;

    c.fillStyle = SURFACE.boardBody;
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 20000; i += 1) {
      const v = 216 + Math.random() * 28;
      c.fillStyle = `rgba(${v},${v},${v - 3},0.3)`;
      c.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }

    const pitchPx = px(2.54);
    const hole = (x, y) => {
      const r = pitchPx * 0.3;
      c.fillStyle = "rgba(140,146,148,0.5)";
      c.fillRect(x - r - 1.5, y - r - 1.5, r * 2 + 3, r * 2 + 3);
      c.fillStyle = SURFACE.boardRecess;
      c.fillRect(x - r, y - r, r * 2, r * 2);
      c.fillStyle = "rgba(255,255,255,0.45)";
      c.fillRect(x - r - 1.5, y - r - 1.5, r * 2 + 3, 1.5);
      c.fillStyle = "#14181a";
      c.fillRect(x - r * 0.55, y - r * 0.55, r * 1.1, r * 1.1);
    };

    const left = (W - (columns - 1) * pitchPx) / 2;
    const midY = H / 2;
    // Main field: rows A-E and F-J either side of the centre channel.
    for (let row = 0; row < 10; row += 1) {
      const offset = row < 5 ? -(5 - row) : row - 4;
      const y = midY + offset * pitchPx - Math.sign(offset) * pitchPx * 0.5;
      for (let col = 0; col < columns; col += 1) hole(left + col * pitchPx, y);
    }
    // The channel a DIP straddles.
    const channel = pitchPx * 1.1;
    const grad = c.createLinearGradient(0, midY - channel / 2, 0, midY + channel / 2);
    grad.addColorStop(0, "#b4b8b6");
    grad.addColorStop(0.4, "#d8dad5");
    grad.addColorStop(1, "#c4c7c3");
    c.fillStyle = grad;
    c.fillRect(0, midY - channel / 2, W, channel);

    // Bus rails, broken every six columns as a real board is.
    for (const [edge, color, sign] of [
      [1, SURFACE.supplyPos ?? "#c8352b", "+"],
      [-1, "#2d6ca8", "−"],
    ]) {
      const centre = midY - edge * (H / 2 - px(6));
      c.strokeStyle = color;
      c.lineWidth = Math.max(2, px(0.5));
      for (const dy of [-pitchPx * 0.85, pitchPx * 0.85]) {
        c.beginPath();
        c.moveTo(px(6), centre + dy);
        c.lineTo(W - px(6), centre + dy);
        c.stroke();
      }
      c.fillStyle = color;
      c.font = `bold ${px(3.4)}px "Barlow Semi Condensed", sans-serif`;
      c.textAlign = "center";
      c.fillText(sign, px(3.5), centre - pitchPx * 0.5);
      c.fillText(sign, W - px(3.5), centre + pitchPx * 1.4);
      for (let col = 0; col < columns - 3; col += 1) {
        if (col % 6 === 5) continue;
        const x = left + col * pitchPx + pitchPx * 0.5;
        hole(x, centre - pitchPx * 0.45);
        hole(x, centre + pitchPx * 0.45);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    disposables.push(texture);

    const group = new THREE.Group();
    const body = new THREE.Mesh(box(mm(widthMM), mm(9), mm(heightMM), mm(1.2)), materials.abs(SURFACE.boardBody));
    body.position.y = mm(4.5);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    const face = new THREE.Mesh(plane(mm(widthMM), mm(heightMM)), materials.printed(texture));
    face.rotation.x = -Math.PI / 2;
    face.position.y = mm(9.05);
    face.receiveShadow = true;
    group.add(face);
    group.userData.surfaceY = mm(9.05);
    return group;
  }

  /** A marker ring around a socket: the single guided highlight, or drag feedback. */
  function ring(color, radius = mm(7)) {
    const mesh = new THREE.Mesh(torus(radius, mm(0.9), 24), materials.marker(color));
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  }

  return {
    jack,
    knob,
    key,
    led,
    instrumentCase,
    printedFace,
    dip8,
    breadboard,
    ring,
    box,
    cylinder,
    plane,
    facing,
    dispose() {
      for (const value of disposables) value.dispose?.();
      cache.clear();
    },
  };
}
