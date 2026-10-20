// Lab 7 circuit logic: breadboard nets, the four op-amp configurations, the
// guided build steps and an ideal-op-amp solver. No three.js here, so the
// electrical behaviour can be tested in Node.

// ---------- breadboard ----------
// A teaching breadboard: 30 columns, rows a–e above the centre gap and f–j
// below it. Each half-column of five holes is one strip. Four rails run along
// the edges: +V (top outer), GND (top inner and bottom inner) and −V (bottom
// outer). Terminal blocks for VIN, VIN2 and VOUT sit at the board's ends, and
// the trainer's binding posts are wired to the rails and blocks underneath.
export const COLS = 30;
export const TOP_ROWS = ["a", "b", "c", "d", "e"];
export const BOTTOM_ROWS = ["f", "g", "h", "i", "j"];
export const RAILS = { rp: "VP", rg: "GND", rh: "GND", rn: "VN" };
export const BLOCKS = { vin: "VIN", vtwo: "VIN2", vout: "VOUT" };
export const BLOCK_HOLES = 4;
export const POSTS = { "post+": "VP", postg: "GND", "post-": "VN", postin: "VIN", postin2: "VIN2", postout: "VOUT" };

/** Every hole id on the board, in drawing order. */
export function allHoles() {
  const holes = [];
  for (const r of [...TOP_ROWS, ...BOTTOM_ROWS]) for (let c = 0; c < COLS; c += 1) holes.push(`${r}${c}`);
  for (const rail of Object.keys(RAILS)) for (let c = 0; c < COLS; c += 1) holes.push(`${rail}${c}`);
  for (const block of Object.keys(BLOCKS)) for (let i = 0; i < BLOCK_HOLES; i += 1) holes.push(`${block}${i}`);
  return holes;
}

/** The strip, rail or terminal a hole or post belongs to. */
export function netOf(id) {
  if (POSTS[id]) return POSTS[id];
  const rail = /^(rp|rg|rh|rn)(\d+)$/.exec(id);
  if (rail) return RAILS[rail[1]];
  const block = /^(vin|vtwo|vout)(\d)$/.exec(id);
  if (block) return BLOCKS[block[1]];
  const main = /^([a-j])(\d+)$/.exec(id);
  if (main) return `${TOP_ROWS.includes(main[1]) ? "T" : "B"}${main[2]}`;
  return null;
}

// ---------- the 741 ----------
// Pins 1–4 along row f (columns 13–16), pins 8–5 along row e, notch on the left.
export const CHIP_COL = 13;
export const PINS = {
  1: "f13", 2: "f14", 3: "f15", 4: "f16",
  8: "e13", 7: "e14", 6: "e15", 5: "e16",
};
export const PIN_NAMES = { 1: "Offset null", 2: "−IN", 3: "+IN", 4: "V−", 5: "Offset null", 6: "OUT", 7: "V+", 8: "NC" };

// ---------- components and configurations ----------
// Rin and Rf are potentiometer modules; R2, R3 and R4 are fixed axial resistors.
export const POT_VALUES = [1, 2.2, 4.7, 5, 10, 15, 20, 22, 33, 47, 68, 100].map((k) => k * 1000);

const PARTS = {
  rin: { kind: "pot", label: "Rin", legs: ["h9", "h14"] },
  rf: { kind: "pot", label: "Rf", legs: ["c8", "c15"] },
  r2: { kind: "resistor", label: "R2", value: 10000, legs: ["b2", "b6"] },
  r3: { kind: "resistor", label: "R3", value: 10000, legs: ["h19", "h24"] },
  r4: { kind: "resistor", label: "R4", value: 20000, legs: ["j19", "rh19"] },
};

// Colour convention: power red/blue, ground black, input yellow, second input
// purple, feedback green, output cyan, internal links white.
const POWER = [
  { id: "vplus", a: "rp14", b: "a14", color: "red", text: "+V rail to pin 7 (V+)" },
  { id: "vminus", a: "rn16", b: "j16", color: "blue", text: "−V rail to pin 4 (V−)" },
];
const FEEDBACK = { id: "feedback", a: "i14", b: "b8", color: "green", text: "Pin 2 (−IN) to Rf: the feedback path" };
const OUTPUT = { id: "out", a: "d15", b: "vout0", color: "cyan", text: "Pin 6 (OUT) to the VOUT terminal" };

export const CONFIGS = {
  inverting: {
    title: "Inverting amplifier",
    short: "INV",
    parts: ["rin", "rf"],
    jumpers: [
      ...POWER,
      { id: "in", a: "vin0", b: "g9", color: "yellow", text: "VIN terminal to Rin" },
      FEEDBACK,
      { id: "plus", a: "j15", b: "rh15", color: "black", text: "Pin 3 (+IN) to ground" },
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
      ...POWER,
      { id: "rin-gnd", a: "g9", b: "rh9", color: "black", text: "Rin to ground" },
      FEEDBACK,
      { id: "in", a: "vin0", b: "g15", color: "yellow", text: "VIN terminal to pin 3 (+IN)" },
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
      ...POWER,
      { id: "in", a: "vin0", b: "g9", color: "yellow", text: "VIN terminal to Rin" },
      { id: "in2", a: "vtwo0", b: "a2", color: "purple", text: "VIN2 terminal to R2" },
      { id: "r2-sum", a: "a6", b: "g14", color: "purple", text: "R2 to pin 2, the summing point" },
      FEEDBACK,
      { id: "plus", a: "j15", b: "rh15", color: "black", text: "Pin 3 (+IN) to ground" },
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
      ...POWER,
      { id: "in", a: "vin0", b: "g9", color: "yellow", text: "VIN terminal to Rin" },
      FEEDBACK,
      { id: "plus-link", a: "g15", b: "g19", color: "white", text: "Pin 3 (+IN) to the R3–R4 divider" },
      { id: "in2", a: "vtwo0", b: "g24", color: "purple", text: "VIN2 terminal to R3" },
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

// Leads run from instrument jacks to the trainer's binding posts.
export const LEADS = {
  "sup+": { from: "S+", post: "post+", color: "red", text: "Supply +V to the +V post" },
  supg: { from: "EARTH", post: "postg", color: "black", text: "Supply COM to the GND post" },
  "sup-": { from: "S-", post: "post-", color: "blue", text: "Supply −V to the −V post" },
  gen: { from: "GEN", post: "postin", color: "yellow", text: "Generator OUTPUT to the VIN post" },
  gen2: { from: "GEN2", post: "postin2", color: "purple", text: "Generator DC OUT 2 to the VIN2 post" },
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
    jumpers: [], // { id, a, b } with a/b hole ids, or null while that end is loose
    leads: { "sup+": null, supg: null, "sup-": null, gen: null, gen2: null }, // post id or null
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
  for (const [id, post] of Object.entries(state.leads)) if (post) u.join(LEADS[id].from, POSTS[post]);

  const level = state.supply.level;
  const sources = [
    ["EARTH", () => 0],
    ["GEN", (t) => waveAt(state.gen, t)],
    ["GEN2", () => state.gen.dc2],
  ];
  if (state.supply.on) sources.push(["S+", () => level], ["S-", () => -level]);

  // a node held by two different sources is a short; the supply's current limit trips
  let short = null;
  const fixed = new Map();
  for (const [name, fn] of sources) {
    const root = u.find(name);
    if (fixed.has(root)) {
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
    if (["EARTH", "GEN", "GEN2", "S+", "S-"].includes(id)) return u.find(id);
    const net = netOf(id);
    return net ? u.find(net) : null;
  };

  const groundRoot = u.find("EARTH");
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
  const name = { "S+": "+V", "S-": "−V", EARTH: "ground", GEN: "the generator output", GEN2: "DC OUT 2" };
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
  const leadIds = ["sup+", "supg", "sup-", "gen", ...(config.usesVin2 ? ["gen2"] : [])];
  for (const id of leadIds) list.push({ kind: "lead", id, ...LEADS[id], done: state.leads[id] === LEADS[id].post });
  list.push({ kind: "power", id: "power", text: "Switch the power supply on", done: model.supplyOn });
  const onNet = (probe, net) => Boolean(state.probes[probe]) && netOf(state.probes[probe]) !== null && model.root(state.probes[probe]) === model.root(net);
  list.push({ kind: "probe", id: "ch1", text: "Clip scope CH1 onto VIN", target: "vin1", done: onNet("ch1", "postin") });
  list.push({ kind: "probe", id: "ch2", text: "Clip scope CH2 onto VOUT", target: "vout1", done: onNet("ch2", "postout") });
  list.push({ kind: "probe", id: "red", text: "Multimeter red probe on VOUT", target: "vout2", done: onNet("red", "postout") });
  list.push({ kind: "probe", id: "black", text: "Multimeter black probe on GND", target: "rh27", done: onNet("black", "postg") });
  return list;
}

/** Jumpers on the board that are not part of the selected circuit. */
export function strayJumpers(state) {
  const planned = CONFIGS[state.config].jumpers.map((j) => [netOf(j.a), netOf(j.b)].sort().join("|"));
  return state.jumpers.filter((j) => j.a && j.b && !planned.includes([netOf(j.a), netOf(j.b)].sort().join("|")));
}
