import * as THREE from "three";
import { mm, SIGNAL, SURFACE, CAP_MM, FONT, font } from "../design/tokens.js";

/**
 * The 741's schematic symbol, floating above the chip.
 *
 * The engineer asks for this three times — "show 741 symbol and pin numbers",
 * "the op-amp schematic symbol and relevant pin numbers/functions directly on the
 * virtual component", "741 pinout and schematic symbol visible at the point of
 * connection" — and it is the thing that joins the schematic a student has been
 * taught to the hardware in front of them.
 *
 * It floats rather than being printed on the package because a real DIP-8 is
 * 9.8 x 6.4 mm and could never carry a legible label. The hardware stays true to
 * size and the teaching layer sits above it; inflating the chip to fit its own
 * caption is what made the previous bench read as a toy.
 *
 * Pin numbers take the colour of what that pin CARRIES, so the symbol and the
 * leads the student is plugging in agree with each other.
 */

const WIDTH_MM = 112;
const HEIGHT_MM = 72;
const DPMM = 11;

/** Which pins are live in each configuration, and what each one carries. */
const PINS = [
  { pin: 2, label: "−IN", role: "input", side: "left", at: -1 },
  { pin: 3, label: "+IN", role: "ground", side: "left", at: 1 },
  { pin: 6, label: "OUT", role: "output", side: "right", at: 0 },
  { pin: 7, label: "+V", role: "supplyPos", side: "top", at: 0 },
  { pin: 4, label: "−V", role: "supplyNeg", side: "bottom", at: 0 },
];

const colourFor = (role) => (role === "ground" ? SURFACE.legend : SIGNAL[role] ?? SURFACE.legend);

function draw(c, w, h, { configuration = "inverting" } = {}) {
  // Card
  c.fillStyle = "rgba(27,33,38,0.94)";
  c.beginPath();
  c.roundRect(0, 0, w, h, 3);
  c.fill();
  c.strokeStyle = "rgba(141,150,156,0.65)";
  c.lineWidth = 0.4;
  c.stroke();

  c.font = font(FONT.legend, CAP_MM.legend);
  c.fillStyle = SURFACE.legend;
  c.textAlign = "left";
  c.textBaseline = "alphabetic";
  c.fillText("U1 · µA741", 7, 12);

  c.font = font(FONT.legendRegular, CAP_MM.micro);
  c.fillStyle = SURFACE.legendMuted;
  c.textAlign = "right";
  c.fillText("DIP-8 · TOP VIEW", w - 7, 12);

  c.strokeStyle = "rgba(141,150,156,0.4)";
  c.lineWidth = 0.3;
  c.beginPath();
  c.moveTo(7, 17);
  c.lineTo(w - 7, 17);
  c.stroke();

  // The triangle every student has been taught to read.
  const cx = 44;
  const cy = 46;
  const half = 17;
  const reach = 26;
  c.strokeStyle = SURFACE.legend;
  c.lineWidth = 1.1;
  c.lineJoin = "round";
  c.beginPath();
  c.moveTo(cx - 14, cy - half);
  c.lineTo(cx - 14, cy + half);
  c.lineTo(cx + reach, cy);
  c.closePath();
  c.stroke();

  c.font = font(FONT.legend, 5.5);
  c.fillStyle = SURFACE.legend;
  c.textAlign = "center";
  c.fillText("−", cx - 8, cy - 5);
  c.fillText("+", cx - 8, cy + 11);

  // Leads out of the symbol, each in the colour of what it carries.
  const lead = (role, x1, y1, x2, y2) => {
    c.strokeStyle = colourFor(role);
    c.lineWidth = 1.1;
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  };
  lead("input", cx - 30, cy - 9, cx - 14, cy - 9);
  lead("ground", cx - 30, cy + 9, cx - 14, cy + 9);
  lead("output", cx + reach, cy, cx + reach + 16, cy);
  lead("supplyPos", cx + 2, cy - 9, cx + 2, cy - 26);
  lead("supplyNeg", cx + 2, cy + 9, cx + 2, cy + 26);

  // Pin numbers, on the leads themselves.
  c.font = font(FONT.legend, CAP_MM.micro);
  const tag = (role, text, x, y, align = "center") => {
    c.fillStyle = colourFor(role);
    c.textAlign = align;
    c.fillText(text, x, y);
  };
  tag("input", "2", cx - 33, cy - 11, "right");
  tag("ground", "3", cx - 33, cy + 7, "right");
  tag("output", "6", cx + reach + 19, cy + 2, "left");
  tag("supplyPos", "7", cx + 6, cy - 28, "left");
  tag("supplyNeg", "4", cx + 6, cy + 33, "left");

  // Function list, so a pin number means something.
  c.textAlign = "left";
  let y = 28;
  for (const entry of PINS) {
    const dim = configuration === "noninverting" && entry.pin === 3 ? false : false;
    c.fillStyle = colourFor(entry.role);
    c.font = font(FONT.legend, CAP_MM.micro);
    c.fillText(`${entry.pin}`, w - 34, y);
    c.font = font(FONT.legendRegular, CAP_MM.micro);
    c.fillStyle = dim ? SURFACE.legendMuted : colourFor(entry.role);
    c.fillText(entry.label, w - 27, y);
    y += 7.5;
  }
  c.fillStyle = "#6d767c";
  c.font = font(FONT.legendRegular, 3.6);
  c.fillText("1 · 5 · 8  n/c", w - 34, y + 1);
}

export function createCallout(parts, materials) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(WIDTH_MM * DPMM);
  canvas.height = Math.round(HEIGHT_MM * DPMM);
  const context = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;

  const paint = (state) => {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.scale(DPMM, DPMM);
    draw(context, WIDTH_MM, HEIGHT_MM, state);
    texture.needsUpdate = true;
  };
  paint({});

  const group = new THREE.Group();
  group.name = "pin-callout";
  const card = new THREE.Mesh(
    parts.plane(mm(WIDTH_MM), mm(HEIGHT_MM)),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false })
  );
  card.renderOrder = 20;
  group.add(card);

  // A leader down to the package it describes, so the card is clearly ABOUT the
  // chip rather than floating decoration.
  const leader = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -mm(HEIGHT_MM) / 2, 0), new THREE.Vector3(0, -mm(HEIGHT_MM) / 2 - 0.05, 0)]),
    new THREE.LineBasicMaterial({ color: 0x8d969c, transparent: true, opacity: 0.8, depthTest: false })
  );
  leader.renderOrder = 20;
  group.add(leader);

  return {
    group,
    paint,
    /**
     * Sit above the chip and face the viewer. Billboarding keeps it readable from
     * anywhere a student stands, which on a U-shaped bench is a wide arc.
     */
    update(anchor, camera) {
      group.position.copy(anchor).add(new THREE.Vector3(0, 0.13, 0));
      group.quaternion.copy(camera.quaternion);
    },
    dispose() {
      texture.dispose();
      card.material.dispose();
      leader.geometry.dispose();
      leader.material.dispose();
    },
  };
}
