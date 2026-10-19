import * as THREE from "three";
import { SURFACE } from "../design/tokens.js";

/**
 * The four material families the design system allows, and nothing else.
 *
 * | family        | roughness | metalness |
 * | moulded ABS   | 0.52      | 0.04      |
 * | painted panel | 0.42      | 0.14      |
 * | plated metal  | 0.17      | 1.00      |
 * | rubber        | 0.94      | 0.00      |
 *
 * Painted panel is deliberately NOT metallic. A fully metallic surface takes all
 * its colour from reflections and reads black under this room's light, which is
 * exactly how the previous bench ended up with near-black instrument faces.
 *
 * Everything is cached and shared: the same scene has to hold frame rate in a
 * headset, and a per-part material would multiply draw calls for no gain.
 */
export function createMaterials(renderer) {
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

  const srgb = (hex) => new THREE.Color(hex).convertSRGBToLinear();

  /** Canvas maps give micro-surface detail without shipping texture files. */
  const noise = (key, size, draw, repeat = 3) =>
    once(`map:${key}`, () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      draw(canvas.getContext("2d"), size);
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeat, repeat);
      texture.anisotropy = renderer?.capabilities?.getMaxAnisotropy?.() ?? 8;
      return texture;
    });

  /** Fine moulding grain; stops large plastic faces shading flat. */
  const absGrain = () =>
    noise("abs", 256, (c, s) => {
      c.fillStyle = "#b2b2b2";
      c.fillRect(0, 0, s, s);
      for (let i = 0; i < 24000; i += 1) {
        const v = 148 + Math.random() * 74;
        c.fillStyle = `rgba(${v},${v},${v},0.5)`;
        c.fillRect(Math.random() * s, Math.random() * s, 1, 1);
      }
    });

  /** Directional brush for panels and trim. */
  const brush = () =>
    noise(
      "brush",
      256,
      (c, s) => {
        c.fillStyle = "#6f6f6f";
        c.fillRect(0, 0, s, s);
        for (let i = 0; i < 2400; i += 1) {
          const y = Math.random() * s;
          c.strokeStyle = `rgba(255,255,255,${Math.random() * 0.24})`;
          c.lineWidth = Math.random() * 1.3;
          c.beginPath();
          c.moveTo(0, y);
          c.lineTo(s, y + (Math.random() - 0.5) * 3);
          c.stroke();
        }
      },
      2
    );

  const standard = (key, options) => once(key, () => new THREE.MeshStandardMaterial(options));

  const api = {
    /** Moulded instrument shell, breadboard body, keycaps. */
    abs: (color = SURFACE.shell) => standard(`abs:${color}`, { color: srgb(color), roughness: 0.52, metalness: 0.04, roughnessMap: absGrain() }),
    /** Front panel plates and sub-plates. */
    panel: (color = SURFACE.panel) =>
      standard(`panel:${color}`, { color: srgb(color), roughness: 0.42, metalness: 0.14, roughnessMap: brush() }),
    /** Jack bezels, knob collars, screws, plug shanks. */
    plated: (color = SURFACE.trim) => standard(`plated:${color}`, { color: srgb(color), roughness: 0.17, metalness: 1 }),
    /** Dark machined metal: knob skirts' base rings, shafts. */
    gunmetal: () => standard("gunmetal", { color: srgb("#5a6268"), roughness: 0.3, metalness: 0.9 }),
    /** Feet, gaskets, cable jackets, probe grips. */
    rubber: (color = "#1d2124") => standard(`rubber:${color}`, { color: srgb(color), roughness: 0.94, metalness: 0 }),
    /** A coloured insulator on a 4 mm jack or plug. */
    insulator: (color) => standard(`ins:${color}`, { color: srgb(color), roughness: 0.42, metalness: 0.03 }),
    /** Cable jacket: PVC with a gloss, so a lead's colour reads vividly across the bench. */
    jacket: (color) => standard(`jacket:${color}`, { color: srgb(color), roughness: 0.36, metalness: 0.02 }),
    /** Epoxy IC body. */
    epoxy: () => standard("epoxy", { color: srgb("#24282c"), roughness: 0.48, metalness: 0.05 }),

    /** Cover glass over a display: clear-coated, so the readout catches the room. */
    glass: () =>
      once("glass", () =>
        new THREE.MeshPhysicalMaterial({
          color: srgb("#aebac2"),
          roughness: 0.08,
          metalness: 0,
          transparent: true,
          opacity: 0.14,
          clearcoat: 1,
          clearcoatRoughness: 0.04,
          depthWrite: false,
        })
      ),

    /** An indicator LED, lit or dark. Lit means the rails are live. */
    led: (color, lit) =>
      standard(`led:${color}:${lit}`, {
        color: srgb(lit ? color : "#454b50"),
        emissive: srgb(lit ? color : "#000000"),
        emissiveIntensity: lit ? 2.6 : 0,
        roughness: 0.25,
        metalness: 0,
      }),

    /** A panel's printed face, from a canvas drawn in millimetres. */
    printed: (texture) => new THREE.MeshStandardMaterial({ map: texture, roughness: 0.46, metalness: 0.1 }),

    /** A highlight ring: unlit so it reads the same from any angle. */
    marker: (color) => standard(`marker:${color}`, { color: srgb(color), emissive: srgb(color), emissiveIntensity: 1.2, roughness: 1 }),

    srgb,
    dispose() {
      for (const value of disposables) value.dispose?.();
      cache.clear();
    },
  };
  return api;
}
