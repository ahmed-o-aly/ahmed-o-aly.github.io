import * as THREE from "three";
import { CAP_MM, FONT, font, SURFACE, fontMM } from "../design/tokens.js";

/**
 * A printed panel face, drawn in MILLIMETRES.
 *
 * The drawing context is scaled so one unit is one millimetre, which means a
 * legend is written as `cap(c, CAP_MM.legend)` and is then literally 6 mm tall on
 * the finished panel. The design system specifies cap heights in millimetres
 * because legibility in a headset is angular; this is what makes that spec real
 * instead of aspirational.
 */

/** Pixels per millimetre. 9 px/mm puts a 4.5 mm cap on ~28 px of canvas. */
const DEFAULT_DPMM = 9;

export class Panel {
  constructor(widthMM, heightMM, draw, { dpmm = DEFAULT_DPMM, anisotropy = 16 } = {}) {
    this.widthMM = widthMM;
    this.heightMM = heightMM;
    this.draw = draw;
    this.canvas = document.createElement("canvas");
    this.canvas.width = Math.round(widthMM * dpmm);
    this.canvas.height = Math.round(heightMM * dpmm);
    this.dpmm = dpmm;
    this.context = this.canvas.getContext("2d");
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = anisotropy;
    this.paint();
  }

  /** Redraw the face. Called whenever a reading or setting changes. */
  paint(state) {
    const c = this.context;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    c.scale(this.dpmm, this.dpmm);
    c.textBaseline = "alphabetic";
    this.draw(c, this.widthMM, this.heightMM, state);
    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }
}

/** Set the context's font to a design-system style at its specified cap height. */
export const useFont = (c, template, capMM) => {
  c.font = font(template, capMM);
};

/** Instrument name, top-left of the panel. */
export function title(c, text, x, y) {
  useFont(c, FONT.legend, CAP_MM.title);
  c.fillStyle = SURFACE.legend;
  c.textAlign = "left";
  c.letterSpacing = `${(fontMM(CAP_MM.title) * 0.07).toFixed(2)}px`;
  c.fillText(text, x, y);
  c.letterSpacing = "0px";
}

/** A control or terminal label. The floor for anything read while standing. */
export function legend(c, text, x, y, { align = "center", color = SURFACE.legend } = {}) {
  useFont(c, FONT.legendRegular, CAP_MM.legend);
  c.fillStyle = color;
  c.textAlign = align;
  c.letterSpacing = `${(fontMM(CAP_MM.legend) * 0.05).toFixed(2)}px`;
  c.fillText(text, x, y);
  c.letterSpacing = "0px";
}

/** Units, ranges and selector positions. Within arm's reach only. */
export function micro(c, text, x, y, { align = "center", color = SURFACE.legendMuted } = {}) {
  useFont(c, FONT.legendRegular, CAP_MM.micro);
  c.fillStyle = color;
  c.textAlign = align;
  c.fillText(text, x, y);
}

/** A live figure on a display. */
export function readout(c, text, x, y, { align = "right", cap = CAP_MM.readoutLG, color = SURFACE.readoutPrimary } = {}) {
  useFont(c, FONT.readout, cap);
  c.fillStyle = color;
  c.textAlign = align;
  c.fillText(text, x, y);
}

/** The dark glass of a display window, with its recessed lip. */
export function window_(c, x, y, w, h) {
  c.fillStyle = SURFACE.readoutField;
  c.fillRect(x, y, w, h);
  c.strokeStyle = "rgba(0,0,0,0.55)";
  c.lineWidth = 0.4;
  c.strokeRect(x, y, w, h);
  c.strokeStyle = "rgba(255,255,255,0.07)";
  c.lineWidth = 0.25;
  c.beginPath();
  c.moveTo(x, y + h);
  c.lineTo(x + w, y + h);
  c.stroke();
}

/** Tick marks and printed positions around a detented selector. */
export function detents(c, cx, cy, radius, positions) {
  c.strokeStyle = SURFACE.legendMuted;
  c.lineWidth = 0.5;
  c.lineCap = "round";
  for (const { angle, label } of positions) {
    const a = (angle * Math.PI) / 180;
    const sx = cx + Math.cos(a) * radius;
    const sy = cy + Math.sin(a) * radius;
    c.beginPath();
    c.moveTo(sx, sy);
    c.lineTo(cx + Math.cos(a) * (radius + 1.8), cy + Math.sin(a) * (radius + 1.8));
    c.stroke();
    micro(c, label, cx + Math.cos(a) * (radius + 6), cy + Math.sin(a) * (radius + 6) + 1.6, { color: SURFACE.legend });
  }
}

/** Format a figure the way an instrument would, never bare. */
export const figure = (value, digits = 2) => (Number.isFinite(value) ? value.toFixed(digits) : "– – –");

/** A signed figure, with the sign always shown so a polarity change is visible. */
export const signed = (value, digits = 2) =>
  Number.isFinite(value) ? `${value < 0 ? "−" : "+"}${Math.abs(value).toFixed(digits)}` : "– – –";
