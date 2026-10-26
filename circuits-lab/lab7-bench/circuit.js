// Lab 7 circuit logic: breadboard nets, the four op-amp configurations, the
// guided build steps and an ideal-op-amp solver. No three.js here, so the
// electrical behaviour can be tested in Node.

// ---------- breadboard ----------
// A teaching breadboard turned portrait: 30 numbered rows run from the far end
// (row 1) toward the student. Columns a–e sit left of the centre channel and
// f–j right of it, so each half-row of five holes is one strip (L0…L29 and
// R0…R29). Each long side carries three rails, from the board outward: GND,
// +V and −V. Screw-terminal blocks beside the board carry VIN2, VIN and its
// ground on the left, VOUT and its ground on the right. The trainer's binding
// posts are wired to the rails and blocks underneath.
export const ROWS = 30;
export const LEFT_COLS = ["a", "b", "c", "d", "e"];
export const RIGHT_COLS = ["f", "g", "h", "i", "j"];
export const RAILS = { lg: "GND", lp: "VP", ln: "VN", rg: "GND", rp: "VP", rn: "VN" };
export const BLOCKS = {
  vtwo: { net: "VIN2", holes: 4, label: "VIN2" },
  vin: { net: "VIN", holes: 4, label: "VIN" },
  gin: { net: "GND", holes: 3, label: "GND" },
  vout: { net: "VOUT", holes: 4, label: "VOUT" },
  gout: { net: "GND", holes: 3, label: "GND" },
};
export const POSTS = {
  "post+": "VP", postg: "GND", "post-": "VN",
  postin2: "VIN2", postin: "VIN", postgin: "GND",
  postout: "VOUT", postgout: "GND",
};

/** Every hole on the board, in drawing order (chip pins are contacts of their own). */
export function allHoles() {
  const holes = [];
  for (const c of [...LEFT_COLS, ...RIGHT_COLS]) for (let r = 0; r < ROWS; r += 1) holes.push(`${c}${r}`);
  // rail holes come in groups of five
  for (const rail of Object.keys(RAILS)) for (let r = 0; r < ROWS; r += 1) if (r % 6 !== 5) holes.push(`${rail}${r}`);
  for (const [block, { holes: n }] of Object.entries(BLOCKS)) for (let i = 0; i < n; i += 1) holes.push(`${block}${i}`);
  return holes;
}

/** The strip, rail or terminal a hole, pin or post belongs to. */
export function netOf(id) {
  if (!id) return null;
  if (POSTS[id]) return POSTS[id];
  const pin = /^pin([1-8])$/.exec(id);
  if (pin) return netOf(PINS[pin[1]]);
  const rail = /^(lg|lp|ln|rg|rp|rn)(\d+)$/.exec(id);
  if (rail) return RAILS[rail[1]];
  const block = /^(vtwo|vin|gin|vout|gout)(\d)$/.exec(id);
  if (block) return BLOCKS[block[1]].net;
  const main = /^([a-j])(\d+)$/.exec(id);
  if (main) return `${LEFT_COLS.includes(main[1]) ? "L" : "R"}${main[2]}`;
  return null;
}

// ---------- the 741 ----------
// Straddling the channel with its notch toward the far end: pins 1–4 run down
// column e, pins 8–5 down column f.
export const CHIP_ROW = 12;
export const PINS = {
  1: "e12", 2: "e13", 3: "e14", 4: "e15",
  8: "f12", 7: "f13", 6: "f14", 5: "f15",
};
export const PIN_NAMES = { 1: "Offset null", 2: "−IN", 3: "+IN", 4: "V−", 5: "Offset null", 6: "OUT", 7: "V+", 8: "NC" };
const PIN_HOLE = Object.fromEntries(Object.entries(PINS).map(([n, hole]) => [hole, Number(n)]));

const NET_NAMES = { VP: "+V", VN: "−V", GND: "ground", VIN: "VIN", VIN2: "VIN2", VOUT: "VOUT" };
const POST_NAMES = {
  "post+": "+V terminal", postg: "GND terminal", "post-": "−V terminal",
  postin2: "VIN2 terminal", postin: "VIN terminal", postgin: "GND terminal (input side)",
  postout: "VOUT terminal", postgout: "GND terminal (output side)",
};

/** What a contact is, for the hover label. */
export function contactName(id) {
  if (POSTS[id]) return POST_NAMES[id];
  const pin = /^pin([1-8])$/.exec(id);
  if (pin) return `Pin ${pin[1]} · ${PIN_NAMES[pin[1]]}`;
  const rail = /^(lg|lp|ln|rg|rp|rn)(\d+)$/.exec(id);
  if (rail) return `${NET_NAMES[RAILS[rail[1]]] === "ground" ? "GND" : NET_NAMES[RAILS[rail[1]]]} rail (${rail[1][0] === "l" ? "left" : "right"})`;
  const block = /^(vtwo|vin|gin|vout|gout)(\d)$/.exec(id);
  if (block) return `${BLOCKS[block[1]].label} terminal block`;
  const main = /^([a-j])(\d+)$/.exec(id);
  if (main) {
    const row = Number(main[2]);
    const col = LEFT_COLS.includes(main[1]) ? "e" : "f";
    const pinHere = PIN_HOLE[`${col}${row}`];
    return `Hole ${main[1]}${row + 1}${pinHere ? ` · same strip as pin ${pinHere} (${PIN_NAMES[pinHere]})` : ""}`;
  }
  return id;
}

// ---------- components and configurations ----------
// Rin and Rf are potentiometer modules; R2, R3 and R4 are fixed axial resistors.
// The pots sit well clear of the chip and are joined to it with jumpers.
export const POT_VALUES = [1, 2.2, 4.7, 5, 10, 15, 20, 22, 33, 47, 68, 100].map((k) => k * 1000);

export const PARTS = {
  rin: { kind: "pot", label: "Rin", legs: ["b21", "b27"] },
  rf: { kind: "pot", label: "Rf", legs: ["d5", "g5"] },
  r2: { kind: "resistor", label: "R2", value: 10000, legs: ["b8", "b13"] },
  r3: { kind: "resistor", label: "R3", value: 10000, legs: ["b6", "b10"] },
  r4: { kind: "resistor", label: "R4", value: 20000, legs: ["a10", "lg10"] },
};

// Colour convention: +V red, −V blue, ground black, input yellow, second input
// purple, feedback green, output cyan, links inside the circuit orange.
export const WIRE_COLORS = ["red", "blue", "black", "yellow", "purple", "green", "cyan", "orange"];
const RIN_LINK = { id: "rin-link", a: "a21", b: "c13", color: "orange", text: "Rin to pin 2 (−IN)" };
const FEEDBACK = [
  { id: "feedback", a: "d13", b: "c5", color: "green", text: "Pin 2 (−IN) to Rf: the feedback path" },
  { id: "feedback-out", a: "i5", b: "i14", color: "green", text: "Rf to pin 6 (OUT): closes the feedback loop" },
];
const OUTPUT = { id: "out", a: "j14", b: "vout2", color: "cyan", text: "Pin 6 (OUT) to the VOUT terminal" };
const PLUS_GND = { id: "plus", a: "a14", b: "lg14", color: "black", text: "Pin 3 (+IN) to the GND rail" };

export const CONFIGS = {
  inverting: {
    title: "Inverting amplifier",
    short: "INV",
    parts: ["rin", "rf"],
    jumpers: [
      { id: "in", a: "vin3", b: "a27", color: "yellow", text: "VIN terminal to Rin" },
      RIN_LINK,
      ...FEEDBACK,
      PLUS_GND,
      OUTPUT,
    ],
    usesVin2: false,
    formula: "Av = −Rf / Rin",
  },
  noninverting: {
    title: "Non-inverting amplifier",
    short: "NON-INV",
    parts: ["rin", "rf"],
    jumpers: [
      { id: "rin-gnd", a: "a27", b: "lg27", color: "black", text: "Rin to the GND rail" },
      RIN_LINK,
      ...FEEDBACK,
      { id: "in", a: "vin0", b: "a14", color: "yellow", text: "VIN terminal to pin 3 (+IN)" },
      OUTPUT,
    ],
    usesVin2: false,
    formula: "Av = 1 + Rf / Rin",
  },
  adder: {
    title: "Summing amplifier",
    short: "ADDER",
    parts: ["rin", "rf", "r2"],
    jumpers: [
      { id: "in", a: "vin3", b: "a27", color: "yellow", text: "VIN terminal to Rin" },
      RIN_LINK,
      { id: "in2", a: "vtwo1", b: "a8", color: "purple", text: "VIN2 terminal to R2, which feeds pin 2" },
      ...FEEDBACK,
      PLUS_GND,
      OUTPUT,
    ],
    usesVin2: true,
    formula: "Vout = −Rf (Vin/Rin + Vin2/R2)",
  },
  subtractor: {
    title: "Difference amplifier",
    short: "SUBTR",
    parts: ["rin", "rf", "r3", "r4"],
    jumpers: [
      { id: "in", a: "vin3", b: "a27", color: "yellow", text: "VIN terminal to Rin" },
      { ...RIN_LINK, b: "b13" },
      ...FEEDBACK,
      { id: "in2", a: "vtwo0", b: "a6", color: "purple", text: "VIN2 terminal to R3" },
      { id: "plus-link", a: "c10", b: "c14", color: "orange", text: "R3–R4 divider to pin 3 (+IN)" },
      OUTPUT,
    ],
    usesVin2: true,
    formula: "Vout = (Rf/Rin)(Vin2 − Vin) when R4/R3 = Rf/Rin",
  },
};
export const CONFIG_ORDER = ["inverting", "noninverting", "adder", "subtractor"];

export function partsFor(config) {
  return CONFIGS[config].parts.map((id) => ({ id, ...PARTS[id] }));
}

/** A sensible colour for a new wire between two contacts: the guide's, else by what it carries. */
export function suggestColor(config, a, b) {
  const pair = [netOf(a), netOf(b)].sort().join("|");
  const planned = CONFIGS[config].jumpers.find((j) => [netOf(j.a), netOf(j.b)].sort().join("|") === pair);
  if (planned) return planned.color;
  const nets = [netOf(a), netOf(b)];
  const byNet = { VP: "red", VN: "blue", GND: "black", VIN: "yellow", VIN2: "purple", VOUT: "cyan" };
  for (const net of ["VP", "VN", "GND", "VIN", "VIN2", "VOUT"]) if (nets.includes(net)) return byNet[net];
  if (nets.includes(netOf(PINS[6]))) return "cyan";
  return "orange";
}

// Leads run from instrument jacks to the trainer: into a binding post, or
// straight into a breadboard hole. The supply's leads go directly into the rows
// of pin 7 and pin 4, with its COM on the common ground. The generator's output
// is referenced to its COM, so its black lead goes to the GND post beside VIN.
// A lead's step is done once it reaches its target, by whatever route.
export const LEADS = {
  "sup+": { from: "S+", target: "j13", color: "red", text: "Supply +V lead straight into pin 7's row (V+)" },
  supg: { from: "EARTH", target: "postg", color: "black", text: "Supply COM lead to the GND post (common ground)" },
  "sup-": { from: "S-", target: "a15", color: "blue", text: "Supply −V lead straight into pin 4's row (V−)" },
  gen: { from: "GEN", target: "postin", color: "yellow", text: "Generator OUTPUT to the VIN post" },
  genc: { from: "GENC", target: "postgin", color: "black", text: "Generator COM to the GND post beside VIN" },
  gen2: { from: "GEN2", target: "postin2", color: "purple", text: "Generator DC OUT 2 to the VIN2 post" },
};

// ---------- the instruments' settings ----------
export const SUPPLY_LEVELS = [8, 12, 15];
export const WAVES = ["dc", "sine", "square", "triangle"];
export const AMPLITUDES = [0.1, 0.2, 0.5, 1, 2, 5, 10];
export const FREQUENCIES = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
export const DC2_LEVELS = Array.from({ length: 21 }, (_, i) => -5 + i * 0.5);
export const VDIV = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10];
export const TDIV = [10e-6, 20e-6, 50e-6, 100e-6, 200e-6, 500e-6, 1e-3, 2e-3, 5e-3, 10e-3, 20e-3];

export function initialState() {
  return {
    config: "inverting",
    rin: 10000,
    rf: 20000,
    supply: { level: 12, on: false },
    gen: { wave: "sine", amp: 1, freq: 1000, dc2: 1 },
    jumpers: [], // { id, a, b, color, bend } with a/b contact ids (holes, pins or posts)
    leads: { "sup+": null, supg: null, "sup-": null, gen: null, genc: null, gen2: null }, // post or hole id, or null
    probes: { ch1: null, ch2: null, red: null, black: null }, // hole/post id or null
    meter: "dcv",
  };
}

export function waveAt(gen, t) {
  if (gen.wave === "dc") return gen.amp;
  const phase = (((gen.freq * t) % 1) + 1) % 1;
  const half = gen.amp / 2;
  if (gen.wave === "sine") return half * Math.sin(2 * Math.PI * phase);
  if (gen.wave === "square") return phase < 0.5 ? half : -half;
  return half * (phase < 0.25 ? 4 * phase : phase < 0.75 ? 2 - 4 * phase : 4 * phase - 4);
}

// ---------- solver ----------
class Union {
  constructor() { this.parent = new Map(); }
  find(a) {
    if (!this.parent.has(a)) this.parent.set(a, a);
    let r = a;
    while (this.parent.get(r) !== r) r = this.parent.get(r);
    this.parent.set(a, r);
    return r;
  }
  join(a, b) { this.parent.set(this.find(a), this.find(b)); }
}

function solveLinear(A, b) {
  const n = b.length;
  for (let c = 0; c < n; c += 1) {
    let p = c;
    for (let r = c + 1; r < n; r += 1) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    if (Math.abs(A[p][c]) < 1e-15) return null;
    [A[c], A[p]] = [A[p], A[c]];
    [b[c], b[p]] = [b[p], b[c]];
    for (let r = c + 1; r < n; r += 1) {
      const f = A[r][c] / A[c][c];
      if (!f) continue;
      for (let k = c; k < n; k += 1) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r -= 1) {
    let s = b[r];
    for (let k = r + 1; k < n; k += 1) s -= A[r][k] * x[k];
    x[r] = s / A[r][r];
  }
  return x;
}

const OPEN_LOOP = 2e5;
const HEADROOM = 1.5; // a 741's output swings to about 1.5 V inside each rail

/**
 * Build the circuit from the current wiring. Returns a model whose `at(node, t)`
 * gives the voltage of any hole, post or source node at time t.
 */
export function buildModel(state) {
  const u = new Union();
  // binding posts are wired to their rails and blocks under the board
  for (const [post, net] of Object.entries(POSTS)) u.join(post, net);
  for (const j of state.jumpers) if (j.a && j.b) u.join(netOf(j.a), netOf(j.b));
  for (const [id, contact] of Object.entries(state.leads)) if (contact) u.join(LEADS[id].from, netOf(contact));

  const level = state.supply.level;
  const sources = [["EARTH", () => 0], ["GENC", () => 0]];
  // the generator drives its outputs against its COM; with that lead unplugged they float
  if (u.find("GENC") !== "GENC") sources.push(["GEN", (t) => waveAt(state.gen, t)], ["GEN2", () => state.gen.dc2]);
  if (state.supply.on) sources.push(["S+", () => level], ["S-", () => -level]);

  // a node held by two different sources is a short; the supply's current limit trips
  let short = null;
  const fixed = new Map();
  for (const [name, fn] of sources) {
    const root = u.find(name);
    if (fixed.has(root)) {
      if (["EARTH", "GENC"].includes(name) && ["EARTH", "GENC"].includes(fixed.get(root).name)) continue; // both grounds
      short = short ?? describeShort([fixed.get(root).name, name]);
      continue;
    }
    fixed.set(root, { name, fn });
  }
  if (short && state.supply.on) {
    // current limit: the supply drops out, the rest still solves
    return buildModel({ ...state, supply: { ...state.supply, on: false }, _short: short });
  }

  const resistors = [];
  for (const part of partsFor(state.config)) {
    const value = part.kind === "pot" ? state[part.id] : part.value;
    resistors.push([netOf(part.legs[0]), netOf(part.legs[1]), value]);
  }
  const pin = (n) => u.find(netOf(PINS[n]));
  const root = (n) => u.find(n);

  const sample = (t) => {
    const values = new Map();
    for (const [r, s] of fixed) values.set(r, s.fn(t));
    const vPlus = values.get(pin(7));
    const vMinus = values.get(pin(4));
    const powered = vPlus !== undefined && vMinus !== undefined && vPlus - vMinus >= 6;
    const outRoot = pin(6);
    const outHeld = values.has(outRoot);
    const solveWith = (outFixed) => {
      const unknown = new Map();
      const index = (r) => {
        if (values.has(r) || (outFixed !== null && r === outRoot)) return -1;
        if (!unknown.has(r)) unknown.set(r, unknown.size);
        return unknown.get(r);
      };
      for (const [a, b] of resistors) { index(root(a)); index(root(b)); }
      if (powered) { index(pin(2)); index(pin(3)); index(outRoot); }
      const vcvs = powered && outFixed === null && !outHeld;
      const n = unknown.size + (vcvs ? 1 : 0);
      const A = Array.from({ length: n }, () => new Array(n).fill(0));
      const b = new Array(n).fill(0);
      const known = (r) => (r === outRoot && outFixed !== null ? outFixed : values.get(r));
      const stamp = (ra, rb, g) => {
        const ia = index(ra), ib = index(rb);
        if (ia >= 0) { A[ia][ia] += g; if (ib >= 0) A[ia][ib] -= g; else b[ia] += g * known(rb); }
        if (ib >= 0) { A[ib][ib] += g; if (ia >= 0) A[ib][ia] -= g; else b[ib] += g * known(ra); }
      };
      for (const [a, b2, value] of resistors) stamp(root(a), root(b2), 1 / value);
      for (const [, i] of unknown) A[i][i] += 1e-9; // a floating node settles at 0 V instead of breaking the solve
      if (vcvs) {
        const k = unknown.size;
        const io = index(outRoot), ip = index(pin(3)), im = index(pin(2));
        A[io][k] += 1; // the output's branch current leaves through the op-amp
        A[k][io] += 1;
        if (ip >= 0) A[k][ip] -= OPEN_LOOP; else b[k] += OPEN_LOOP * known(pin(3));
        if (im >= 0) A[k][im] += OPEN_LOOP; else b[k] -= OPEN_LOOP * known(pin(2));
      }
      const x = n ? solveLinear(A, b) : [];
      const out = new Map(values);
      if (outFixed !== null) out.set(outRoot, outFixed);
      for (const [r, i] of unknown) out.set(r, x ? x[i] : 0);
      return out;
    };
    let v = solveWith(null);
    let clipped = false;
    if (powered && !outHeld) {
      const hi = vPlus - HEADROOM, lo = vMinus + HEADROOM;
      const vo = v.get(outRoot);
      if (vo > hi || vo < lo) { v = solveWith(vo > hi ? hi : lo); clipped = true; }
    }
    return { v, clipped, powered };
  };

  const resolveNode = (id) => {
    if (!id) return null;
    if (["EARTH", "GENC", "GEN", "GEN2", "S+", "S-"].includes(id)) return u.find(id);
    const net = netOf(id);
    return net ? u.find(net) : null;
  };

  const groundRoot = u.find("GND");
  return {
    short: state._short ?? short,
    supplyOn: state.supply.on && !state._short,
    root: resolveNode,
    connected: (a, b) => resolveNode(a) === resolveNode(b),
    grounded: (id) => resolveNode(id) === groundRoot,
    sample,
    /** voltage of a hole/post/source at time t (0 V when floating) */
    at(id, t) {
      const r = resolveNode(id);
      if (r === null) return null;
      return sample(t).v.get(r) ?? 0;
    },
  };
}

function describeShort(pair) {
  pair.sort((x, y) => Number(y.startsWith("S")) - Number(x.startsWith("S"))); // name the supply rail first
  const name = { "S+": "+V", "S-": "−V", EARTH: "ground", GENC: "the generator COM", GEN: "the generator output", GEN2: "DC OUT 2" };
  return `${name[pair[0]]} is shorted to ${name[pair[1]]}`;
}

// ---------- measurement ----------
export function period(state) {
  return state.gen.wave === "dc" ? 1e-3 : 1 / state.gen.freq;
}

/** Sample a node over one period: mean, peak-to-peak, AC rms and the samples themselves. */
export function measure(model, id, state, n = 96) {
  if (!id || model.root(id) === null) return null;
  const T = period(state);
  const values = [];
  for (let i = 0; i < n; i += 1) values.push(model.at(id, (i / n) * T));
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const max = Math.max(...values), min = Math.min(...values);
  const rmsAc = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / n);
  return { mean, pp: max - min, rmsAc, values };
}

/** Theory for the current configuration and settings. */
export function theory(state) {
  const { rin, rf } = state;
  const v1 = state.gen;
  const k = { inverting: -rf / rin, noninverting: 1 + rf / rin }[state.config];
  if (k !== undefined) return { gain: k, text: `${CONFIGS[state.config].formula} = ${k.toFixed(2)}`, expect: (vin) => k * vin };
  if (state.config === "adder") {
    const a = -rf / rin, b = -rf / PARTS.r2.value;
    return { a, b, text: `Vout = ${a.toFixed(2)}·Vin ${b < 0 ? "−" : "+"} ${Math.abs(b).toFixed(2)}·Vin2`, expect: (vin) => a * vin + b * v1.dc2 };
  }
  const a = -rf / rin;
  const b = (1 + rf / rin) * (PARTS.r4.value / (PARTS.r3.value + PARTS.r4.value));
  return { a, b, text: `Vout = ${a.toFixed(2)}·Vin + ${b.toFixed(2)}·Vin2`, expect: (vin) => a * vin + b * v1.dc2 };
}

// ---------- guided steps ----------
/**
 * The build in order: jumpers, leads, power, then measurements. A step is done
 * when the wiring makes the connection, whichever hole of the strip was used.
 */
export function steps(state, model = buildModel(state)) {
  const config = CONFIGS[state.config];
  const list = [];
  const joined = (a, b) => state.jumpers.some((j) => j.a && j.b && ((netOf(j.a) === netOf(a) && netOf(j.b) === netOf(b)) || (netOf(j.a) === netOf(b) && netOf(j.b) === netOf(a))));
  for (const j of config.jumpers) list.push({ kind: "jumper", ...j, done: joined(j.a, j.b) });
  const leadIds = ["sup+", "supg", "sup-", "gen", "genc", ...(config.usesVin2 ? ["gen2"] : [])];
  for (const id of leadIds) list.push({ kind: "lead", id, ...LEADS[id], done: Boolean(state.leads[id]) && model.connected(LEADS[id].from, LEADS[id].target) });
  list.push({ kind: "power", id: "power", text: "Switch the power supply on", done: model.supplyOn });
  const onNet = (probe, net) => Boolean(state.probes[probe]) && netOf(state.probes[probe]) !== null && model.root(state.probes[probe]) === model.root(net);
  list.push({ kind: "probe", id: "ch1", text: "Clip scope CH1 onto VIN", target: "vin1", done: onNet("ch1", "postin") });
  list.push({ kind: "probe", id: "ch2", text: "Clip scope CH2 onto VOUT", target: "vout1", done: onNet("ch2", "postout") });
  list.push({ kind: "probe", id: "red", text: "Multimeter red probe on VOUT", target: "vout3", done: onNet("red", "postout") });
  list.push({ kind: "probe", id: "black", text: "Multimeter black probe on the GND beside VOUT", target: "gout1", done: onNet("black", "postgout") });
  return list;
}

/** Jumpers on the board that are not part of the selected circuit. */
export function strayJumpers(state) {
  const planned = CONFIGS[state.config].jumpers.map((j) => [netOf(j.a), netOf(j.b)].sort().join("|"));
  return state.jumpers.filter((j) => j.a && j.b && !planned.includes([netOf(j.a), netOf(j.b)].sort().join("|")));
}
