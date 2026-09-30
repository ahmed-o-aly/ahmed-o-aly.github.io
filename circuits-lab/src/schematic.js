import { MODULES } from "./modules.js";

const ink = "#182630";
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]
  );
const number = (value) =>
  Number.isFinite(Number(value)) ? Number(Number(value).toPrecision(6)).toLocaleString("en-US", { maximumFractionDigits: 6 }) : "—";
const resistance = (value) => (Math.abs(value) >= 1000 ? `${number(value / 1000)} kΩ` : `${number(value)} Ω`);
const capacitance = (value) =>
  value >= 1e-3 ? `${number(value * 1e3)} mF` : value >= 1e-6 ? `${number(value * 1e6)} μF` : `${number(value * 1e9)} nF`;
const inductance = (value) => (value >= 1 ? `${number(value)} H` : `${number(value * 1e3)} mH`);

function drawing() {
  const elements = [];
  const path = (points, attributes = "") =>
    elements.push(`<path d="${points.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ")}" ${attributes}/>`);
  const line = (x1, y1, x2, y2) =>
    path([
      [x1, y1],
      [x2, y2],
    ]);
  const text = (x, y, content, anchor = "middle", size = 18) =>
    elements.push(`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}">${escape(content)}</text>`);
  const dot = (x, y) => elements.push(`<circle cx="${x}" cy="${y}" r="4" fill="${ink}" stroke="none"/>`);
  const contact = (x, y) => elements.push(`<circle cx="${x}" cy="${y}" r="4" fill="white"/>`);
  // Transparent hit areas expose the original bench terminal IDs without visual clutter.
  const pin = (id, x, y) =>
    elements.push(
      `<circle data-pin="${escape(id)}" cx="${x}" cy="${y}" r="7" fill="transparent" stroke="none"><title>${escape(id)}</title></circle>`
    );
  const pins = (coordinates) => Object.entries(coordinates).forEach(([id, [x, y]]) => pin(id, x, y));
  const ground = (x, y) => {
    elements.push('<g data-symbol="ground">');
    line(x, y, x, y + 12);
    line(x - 15, y + 12, x + 15, y + 12);
    line(x - 10, y + 18, x + 10, y + 18);
    line(x - 4, y + 24, x + 4, y + 24);
    elements.push("</g>");
  };
  const resistor = (id, x1, y1, x2, y2, name, value) => {
    elements.push(`<g data-component="${escape(id)}" data-symbol="resistor">`);
    const vertical = x1 === x2;
    const middle = vertical ? (y1 + y2) / 2 : (x1 + x2) / 2;
    const points = vertical
      ? [
          [x1, y1],
          [x1, middle - 35],
        ]
      : [
          [x1, y1],
          [middle - 35, y1],
        ];
    for (let i = 0; i < 7; i += 1) {
      const along = middle - 30 + i * 10;
      const across = i % 2 ? -8 : 8;
      points.push(vertical ? [x1 + across, along] : [along, y1 + across]);
    }
    points.push(vertical ? [x1, middle + 35] : [middle + 35, y1]);
    points.push([x2, y2]);
    path(points);
    if (vertical) {
      text(x1 + 24, middle - 8, name, "start");
      text(x1 + 24, middle + 18, resistance(value), "start", 16);
    } else {
      text(middle, y1 - 24, name);
      text(middle, y1 + 30, resistance(value), "middle", 16);
    }
    elements.push("</g>");
  };
  const source = ({ id, x, y, top, bottom, name, value, polarity = 1, kind = "voltage", state = "active", labelSide = -1, frequency }) => {
    elements.push(
      `<g data-component="${escape(id)}" data-symbol="${escape(kind)}-source" data-source-state="${escape(state)}" data-polarity="${polarity}">`
    );
    const labelX = x + labelSide * 56;
    if (state === "short") {
      line(x, top, x, bottom);
      text(labelX, y - 7, name);
      text(labelX, y + 18, "0 V", "middle", 16);
    } else if (state === "open") {
      line(x, top, x, y - 15);
      line(x, y + 15, x, bottom);
      contact(x, y - 15);
      contact(x, y + 15);
      text(labelX, y - 7, name);
      text(labelX, y + 18, "open", "middle", 16);
    } else {
      line(x, top, x, y - 28);
      line(x, y + 28, x, bottom);
      elements.push(`<circle cx="${x}" cy="${y}" r="28" fill="white"/>`);
      if (kind === "current") {
        line(x, y + 15, x, y - 14);
        elements.push(`<path d="M ${x} ${y - 16} L ${x - 5} ${y - 7} L ${x + 5} ${y - 7} Z" fill="${ink}" stroke="none"/>`);
      } else if (kind === "sine") {
        elements.push(
          `<path d="M ${x - 16} ${y} C ${x - 11} ${y - 16}, ${x - 5} ${y - 16}, ${x} ${y} C ${x + 5} ${y + 16}, ${x + 11} ${y + 16}, ${
            x + 16
          } ${y}"/>`
        );
      } else {
        line(x - 6, y - 10, x + 6, y - 10);
        line(x - 6, y + 10, x + 6, y + 10);
        line(x, y + (polarity > 0 ? -16 : 4), x, y + (polarity > 0 ? -4 : 16));
      }
      text(labelX, y - 8, name);
      text(labelX, y + 18, value, "middle", 16);
      if (frequency !== undefined) text(labelX, y + 42, `${number(frequency)} Hz`, "middle", 14);
    }
    elements.push("</g>");
  };
  return { elements, path, line, text, dot, contact, pins, pin, ground, resistor, source };
}

function equivalentCircuit(d, p) {
  const { line, path, source, resistor, ground, dot, text, pins } = d;
  const top = 120,
    bottom = 330;
  if (p.representation === "original") {
    source({ id: "s", x: 110, y: 225, top, bottom, name: "Vs", value: "12 V" });
    line(110, top, 210, top);
    resistor("r1", 210, top, 370, top, "R₁", 1000);
    line(370, top, 650, top);
    resistor("r2", 440, top, 440, bottom, "R₂", 1000);
    resistor("load", 650, top, 650, bottom, "RL", p.load);
    line(110, bottom, 650, bottom);
    dot(440, top);
    dot(440, bottom);
    dot(300, bottom);
    ground(300, bottom);
    text(448, 96, "A", "start");
    pins({
      "s+": [110, top],
      "s-": [110, bottom],
      r1a: [210, top],
      r1b: [370, top],
      r2a: [440, top],
      r2b: [440, bottom],
      loada: [650, top],
      loadb: [650, bottom],
      gnd: [300, bottom],
    });
  } else if (p.representation === "thevenin") {
    source({ id: "s", x: 170, y: 225, top, bottom, name: "VTh", value: `${number(p.equivalentVoltage)} V` });
    line(170, top, 280, top);
    resistor("req", 280, top, 480, top, "RTh", p.equivalentResistance);
    line(480, top, 620, top);
    resistor("load", 620, top, 620, bottom, "RL", p.load);
    line(170, bottom, 620, bottom);
    ground(395, bottom);
    dot(395, bottom);
    text(630, 100, "A", "start");
    pins({ "s+": [170, top], "s-": [170, bottom], reqa: [280, top], reqb: [480, top], loada: [620, top], loadb: [620, bottom], gnd: [395, bottom] });
  } else if (p.representation === "norton") {
    source({ id: "s", x: 140, y: 225, top, bottom, name: "IN", value: `${number(p.nortonCurrent)} mA`, kind: "current" });
    line(140, top, 650, top);
    resistor("req", 395, top, 395, bottom, "RN", p.equivalentResistance);
    resistor("load", 650, top, 650, bottom, "RL", p.load);
    line(140, bottom, 650, bottom);
    dot(395, top);
    dot(395, bottom);
    dot(270, bottom);
    ground(270, bottom);
    text(405, 96, "A", "start");
    pins({
      "s+": [140, top],
      "s-": [140, bottom],
      reqa: [395, top],
      reqb: [395, bottom],
      loada: [650, top],
      loadb: [650, bottom],
      gnd: [270, bottom],
    });
  } else {
    throw new RangeError("Unknown equivalent circuit representation.");
  }
}

function superpositionCircuit(d, p) {
  const { line, source, resistor, ground, dot, text, pins } = d;
  const state = (on) => (on ? "active" : p.replacement === "open" ? "open" : "short");
  source({ id: "a", x: 120, y: 225, top: 120, bottom: 330, name: "V₁", value: `${number(p.v1)} V`, state: state(p.sourceMode !== "b") });
  // The second source's positive pole is grounded: its upper terminal is −v2.
  source({
    id: "b",
    x: 660,
    y: 225,
    top: 120,
    bottom: 330,
    name: "V₂",
    value: `${number(p.v2)} V`,
    polarity: -1,
    labelSide: 1,
    state: state(p.sourceMode !== "a"),
  });
  line(120, 120, 200, 120);
  resistor("r1", 200, 120, 320, 120, "R₁", 1000);
  line(320, 120, 460, 120);
  resistor("r2", 460, 120, 580, 120, "R₂", 1000);
  line(580, 120, 660, 120);
  resistor("load", 390, 120, 390, 330, "R₃", 1000);
  line(120, 330, 660, 330);
  dot(390, 120);
  dot(390, 330);
  dot(250, 330);
  ground(250, 330);
  text(400, 96, "A", "start");
  pins({
    "a+": [120, 120],
    "a-": [120, 330],
    "b+": [660, 120],
    "b-": [660, 330],
    r1a: [200, 120],
    r1b: [320, 120],
    r2a: [460, 120],
    r2b: [580, 120],
    loada: [390, 120],
    loadb: [390, 330],
    gnd: [250, 330],
  });
}

function amplifierCircuit(d, p) {
  const { elements, line, path, source, resistor, ground, dot, contact, text, pins } = d;
  const inverting = p.configuration === "inverting";
  const sourceTop = inverting ? 180 : 230;
  source({
    id: "signal",
    x: 90,
    y: 285,
    top: sourceTop,
    bottom: 345,
    name: "Vin",
    value: `${number(p.amplitude)} Vpk`,
    kind: "sine",
    frequency: p.frequency,
  });
  if (inverting) {
    line(90, 180, 150, 180);
    resistor("rin", 150, 180, 300, 180, "Rin", p.rin);
    line(300, 180, 400, 180);
    path([
      [400, 230],
      [370, 230],
      [370, 345],
      [90, 345],
    ]);
    ground(230, 345);
    dot(230, 345);
  } else {
    line(90, 230, 400, 230);
    resistor("rin", 170, 180, 300, 180, "Rin", p.rin);
    line(300, 180, 400, 180);
    ground(170, 180);
    ground(90, 345);
  }
  path([
    [340, 180],
    [340, 80],
    [400, 80],
  ]);
  resistor("rf", 400, 80, 550, 80, "Rf", p.rf);
  path([
    [550, 80],
    [620, 80],
    [620, 205],
  ]);
  line(550, 205, 660, 205);
  dot(340, 180);
  dot(620, 205);
  elements.push('<g data-component="op" data-symbol="op-amp">');
  elements.push('<path d="M 400 140 L 400 270 L 550 205 Z" fill="white"/>');
  line(410, 180, 420, 180);
  line(410, 230, 420, 230);
  line(415, 225, 415, 235);
  text(447, 212, "U₁", "middle", 16);
  // Dedicated supply pins meet the triangle; they do not join the feedback wire.
  line(480, 147, 480, 175);
  line(480, 235, 480, 285);
  text(480, 130, `+${number(p.rail)} V`, "middle", 16);
  text(480, 309, `−${number(p.rail)} V`, "middle", 16);
  elements.push("</g>");
  contact(660, 205);
  text(671, 210, "Vout", "start");
  const commonGround = inverting ? [230, 345] : [90, 345];
  pins({
    "signal+": [90, sourceTop],
    "signal-": [90, 345],
    rina: [inverting ? 150 : 170, 180],
    rinb: [300, 180],
    rfa: [400, 80],
    rfb: [550, 80],
    "op-": [400, 180],
    "op+": [400, 230],
    out: [550, 205],
    vp: [480, 147],
    vn: [480, 285],
    "plus+": [480, 147],
    "minus-": [480, 285],
    "plus-": commonGround,
    "minus+": commonGround,
    gnd: commonGround,
  });
}

function transientCircuit(d, p) {
  const { elements, line, path, source, resistor, ground, dot, contact, text, pins } = d;
  source({ id: "s", x: 100, y: 235, top: 120, bottom: 340, name: "Vs", value: "5 V" });
  line(100, 120, 235, 120);
  path([
    [235, 200],
    [190, 200],
    [190, 340],
  ]);
  line(300, 160, 365, 160);
  resistor("r", 365, 160, 535, 160, "R", p.resistance);
  line(535, 160, 650, 160);
  line(100, 340, 650, 340);
  ground(390, 340);
  dot(390, 340);
  dot(190, 340);
  elements.push(`<g data-component="sw" data-symbol="spdt" data-switch-position="${p.charging ? "source" : "return"}">`);
  line(300, 160, 235, p.charging ? 120 : 200);
  contact(235, 120);
  contact(235, 200);
  contact(300, 160);
  text(280, 90, "S₁");
  text(222, 103, "5 V", "end", 15);
  text(222, 224, "0 V", "end", 15);
  elements.push("</g>");
  if (p.kind === "RC") {
    elements.push('<g data-component="storage" data-symbol="capacitor">');
    line(650, 160, 650, 242);
    line(626, 242, 674, 242);
    line(626, 258, 674, 258);
    line(650, 258, 650, 340);
    text(692, 242, "C", "start");
    text(692, 269, capacitance(p.capacitance), "start", 16);
    elements.push("</g>");
  } else {
    elements.push('<g data-component="storage" data-symbol="inductor">');
    line(650, 160, 650, 218);
    elements.push('<path d="M 650 218 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16"/>');
    line(650, 282, 650, 340);
    text(682, 242, "L", "start");
    text(682, 269, inductance(p.inductance), "start", 16);
    elements.push("</g>");
  }
  text(660, 143, "A", "start");
  pins({
    "s+": [100, 120],
    "s-": [100, 340],
    supply: [235, 120],
    return: [235, 200],
    common: [300, 160],
    ra: [365, 160],
    rb: [535, 160],
    storagea: [650, 160],
    storageb: [650, 340],
    gnd: [390, 340],
  });
}

/**
 * Standard electrical reference drawing, matching the module's actual topology.
 * Returns standalone SVG markup. The optional voltages argument is reserved for
 * measurement overlays; measured values are intentionally kept on the bench UI.
 * Terminal IDs are available as data-pin attributes and hover titles.
 */
export function renderSchematic(moduleId, params = {}, { voltages } = {}) {
  if (!MODULES[moduleId]) throw new RangeError(`Unknown schematic module: ${moduleId}`);
  const p = { ...MODULES[moduleId].defaults, ...params };
  const d = drawing();
  if (moduleId === "thevenin") equivalentCircuit(d, p);
  else if (moduleId === "superposition") superpositionCircuit(d, p);
  else if (moduleId === "opamp") amplifierCircuit(d, p);
  else transientCircuit(d, p);
  const titles = {
    thevenin: `${
      p.representation === "original" ? "Original voltage-divider" : p.representation === "thevenin" ? "Thévenin equivalent" : "Norton equivalent"
    } circuit`,
    superposition: "Two-source superposition circuit; source two has its positive terminal grounded",
    opamp: `${p.configuration === "inverting" ? "Inverting" : "Non-inverting"} amplifier circuit with separate positive and negative supply pins`,
    transient: `Series ${p.kind} circuit with an SPDT source and closed return path`,
  };
  const title = escape(titles[moduleId]);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ee-schematic" viewBox="0 0 780 430" width="100%" style="display:block;height:auto;aspect-ratio:780 / 430" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${title}"><title>${title}</title><rect width="780" height="430" fill="white"/><g fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" font-family="Arial, Helvetica, sans-serif"><style>.ee-schematic text{fill:${ink};stroke:none;font-weight:400}</style>${d.elements.join(
    ""
  )}</g></svg>`;
}
