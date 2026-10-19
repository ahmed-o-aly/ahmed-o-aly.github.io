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
  function jack(color, { radius = mm(5.6) } = {}) {
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
      dummy.position.set(Math.cos(a) * (radius + mm(0.5)), Math.sin(a) * (radius + mm(0.5)), mm(3) + height / 2);
      dummy.rotation.set(0, 0, a);
      dummy.updateMatrix();
      knurl.setMatrixAt(i, dummy.matrix);
    }
    knurl.instanceMatrix.needsUpdate = true;
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

  /**
   * The waveform printed on a key. A blank key tells a student nothing, and this
   * laboratory's whole argument is that a control should say what it does.
   */
  const glyphTexture = (kind) =>
    geo(`glyph:${kind}`, () => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const c = canvas.getContext("2d");
      c.strokeStyle = "#11161a";
      c.lineWidth = 9;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.beginPath();
      const midY = 64;
      const amp = 26;
      if (kind === "dc") {
        c.moveTo(18, midY);
        c.lineTo(110, midY);
      } else if (kind === "square") {
        c.moveTo(18, midY + amp);
        c.lineTo(18, midY - amp);
        c.lineTo(64, midY - amp);
        c.lineTo(64, midY + amp);
        c.lineTo(110, midY + amp);
        c.lineTo(110, midY - amp);
      } else if (kind === "triangle") {
        c.moveTo(18, midY + amp);
        c.lineTo(41, midY - amp);
        c.lineTo(64, midY + amp);
        c.lineTo(87, midY - amp);
        c.lineTo(110, midY + amp);
      } else {
        for (let i = 0; i <= 64; i += 1) {
          const x = 18 + (i / 64) * 92;
          const y = midY - Math.sin((i / 64) * Math.PI * 4) * amp;
          if (i === 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
      }
      c.stroke();
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      return texture;
    });

  /** A moulded keycap standing proud of its bezel, carrying its own legend. */
  function key({ width = mm(16), height = mm(12), color = SURFACE.trim, glyph = null } = {}) {
    const group = new THREE.Group();
    const bezel = new THREE.Mesh(box(width + mm(3), height + mm(3), mm(2), mm(0.6)), materials.abs("#2f363b"));
    bezel.position.z = mm(1);
    group.add(bezel);
    const cap = new THREE.Mesh(box(width, height, mm(3), mm(0.8)), materials.panel(color));
    cap.position.z = mm(3);
    cap.castShadow = true;
    group.add(cap);
    if (glyph) {
      const print = new THREE.Mesh(plane(width * 0.8, height * 0.8), new THREE.MeshBasicMaterial({ map: glyphTexture(glyph), transparent: true }));
      print.position.z = mm(4.6);
      group.add(print);
    }
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
   * A benchtop instrument case.
   *
   * Built from a BOTTOM-FRONT-CENTRE origin and tipped back on its bail, which is
   * how a bench instrument actually stands. The first version raked the panel
   * about its own centre, which swung the top third of the panel back INSIDE the
   * shell and hid the instrument's name entirely.
   *
   * The case carries the detail that separates equipment from a box: a recessed
   * bezel the panel sits inside, a chamfered top, a louvred vent, a carry lip and
   * a moulded brand step.
   */
  function instrumentCase(widthMM, heightMM, { depthMM = 230, tilt = 0.1 } = {}) {
    const width = mm(widthMM);
    const height = mm(heightMM);
    const depth = mm(depthMM);
    const group = new THREE.Group();

    // Everything tips back together about the front edge resting on the bench.
    const body = new THREE.Group();
    body.rotation.x = tilt;
    group.add(body);

    const wall = mm(5);
    const shellW = width + wall * 2;
    const shellH = height + wall * 2;

    // Lower carcass: the darker chassis the top cover clamps onto.
    const chassis = new THREE.Mesh(box(shellW, mm(16), depth, mm(1.5)), materials.abs("#9aa3a9"));
    chassis.position.set(0, mm(8), -depth / 2);
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    body.add(chassis);

    // Top cover, inset so the chassis reads as a separate part.
    const cover = new THREE.Mesh(box(shellW - mm(1), shellH - mm(16), depth - mm(4), mm(4)), materials.abs("#c2c9ce"));
    cover.position.set(0, mm(16) + (shellH - mm(16)) / 2, -depth / 2 - mm(1));
    cover.castShadow = true;
    cover.receiveShadow = true;
    body.add(cover);

    // Recessed bezel: the frame the front panel sits down inside.
    const bezel = new THREE.Mesh(box(shellW - mm(2), shellH - mm(2), mm(5), mm(3)), materials.abs("#b9c0c5"));
    bezel.position.set(0, shellH / 2, mm(1));
    bezel.castShadow = true;
    body.add(bezel);

    // The panel itself, flush in the bezel and FACING THE VIEWER, not buried.
    const face = new THREE.Group();
    face.position.set(0, shellH / 2, mm(3.4));
    body.add(face);

    const plate = new THREE.Mesh(box(width, height, mm(3), mm(0.8)), materials.panel());
    plate.castShadow = true;
    plate.receiveShadow = true;
    face.add(plate);

    // Louvred vent across the top cover: the single detail that most stops a case
    // reading as a blank cube.
    const louvre = box(shellW - mm(46), mm(1.4), mm(3.5));
    for (let i = 0; i < 9; i += 1) {
      const slot = new THREE.Mesh(louvre, materials.abs("#5c656b"));
      slot.position.set(0, shellH - mm(1.0), -mm(26) - i * mm(9));
      body.add(slot);
    }
    // The moulding seam where the cover meets the chassis.
    const seam = new THREE.Mesh(box(shellW + mm(0.4), mm(1), depth - mm(6), 0), materials.abs("#8a939a"));
    seam.position.set(0, mm(16), -depth / 2 - mm(1));
    body.add(seam);

    // A moulded step along the top front edge: a carry lip, and it catches light.
    const lip = new THREE.Mesh(box(shellW - mm(6), mm(4), mm(10), mm(1)), materials.abs("#c6ced3"));
    lip.position.set(0, shellH - mm(3), -mm(4));
    body.add(lip);

    // Side vents stay, but sunk into the cover rather than floating beside it.
    const sideVent = box(mm(1.6), (shellH - mm(16)) * 0.5, mm(12));
    for (const side of [-1, 1]) {
      for (let i = 0; i < 5; i += 1) {
        const slot = new THREE.Mesh(sideVent, materials.abs("#5f686e"));
        slot.position.set(side * (shellW / 2 - mm(1.2)), shellH * 0.55, -depth * 0.3 - i * mm(14));
        body.add(slot);
      }
    }

    // Four panel screws, in the bezel rather than through the artwork.
    for (const sx of [-width / 2 - mm(2.4), width / 2 + mm(2.4)]) {
      for (const sy of [-height / 2 - mm(2.4), height / 2 + mm(2.4)]) {
        const screw = facing(cylinder(mm(1.7), mm(1.7), mm(1), 10), materials.plated());
        screw.position.set(sx, sy, mm(0.6));
        face.add(screw);
      }
    }

    // Feet, and a taller bail at the back that the tilt actually rests on.
    for (const fx of [-width * 0.38, width * 0.38]) {
      const front = facing(cylinder(mm(5), mm(6), mm(3), 12), materials.rubber());
      front.position.set(fx, mm(1.5), -mm(12));
      body.add(front);
      const bail = new THREE.Mesh(box(mm(12), mm(3), mm(10), mm(1)), materials.rubber());
      bail.position.set(fx, mm(1.5), -depth + mm(14));
      body.add(bail);
    }

    group.userData = { face, width, height, depth, panelZ: mm(2) };
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

  /**
   * An axial resistor: beige body, tapered ends, tinned leads and printed colour
   * bands. Students read resistors by their bands, so the bands are generated
   * from the actual value rather than being decoration.
   */
  const BAND = ["#1a1a1a", "#6b3f1d", "#c0392b", "#d97b26", "#d8c33a", "#2e8b57", "#2d6ca8", "#7b5ea7", "#9aa0a4", "#f2f2f2"];
  function resistor(ohms = 10000) {
    const group = new THREE.Group();
    const bodyL = mm(9);
    const bodyR = mm(2.1);

    const body = new THREE.Mesh(cylinder(bodyR, bodyR, bodyL, 18), materials.abs("#d8c9a3"));
    body.rotation.z = Math.PI / 2;
    body.castShadow = true;
    group.add(body);
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Mesh(cylinder(bodyR * 0.55, bodyR, mm(1.4), 16), materials.abs("#d8c9a3"));
      shoulder.rotation.z = side * Math.PI / 2;
      shoulder.position.x = side * (bodyL / 2 + mm(0.7));
      group.add(shoulder);
      const wire = new THREE.Mesh(cylinder(mm(0.33), mm(0.33), mm(9), 8), materials.plated("#c9ced2"));
      wire.rotation.z = Math.PI / 2;
      wire.position.x = side * (bodyL / 2 + mm(5.4));
      group.add(wire);
    }

    // Four bands: two digits, a multiplier and a gold tolerance ring.
    const digits = Math.round(ohms).toString();
    const first = Number(digits[0] ?? 1);
    const second = Number(digits[1] ?? 0);
    const multiplier = Math.max(0, digits.length - 2);
    const colours = [BAND[first], BAND[second], BAND[Math.min(9, multiplier)], "#c9a227"];
    colours.forEach((colour, i) => {
      const band = new THREE.Mesh(cylinder(bodyR * 1.03, bodyR * 1.03, mm(0.9), 18), materials.abs(colour));
      band.rotation.z = Math.PI / 2;
      band.position.x = -bodyL / 2 + mm(1.6) + i * mm(1.8) + (i === 3 ? mm(2.2) : 0);
      group.add(band);
    });
    group.userData.bands = colours;
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
    resistor,
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
