// Lab 8 circuit logic: breadboard nets, the RC and RL circuits, the guided build
// steps and an exact first-order solver. No three.js here, so the electrical
// behaviour can be tested in Node.

// ---------- breadboard ----------
// The same portrait teaching board as the Lab 7 bench: 30 numbered rows, columns
// a–e left of the channel and f–j right of it, each half-row one strip. The
// single supply needs only GND and +V rails on each side. Terminal blocks carry
// VIN and its ground on the left, VOUT (node A) and its ground on the right.
export const ROWS = 30;
export const LEFT_COLS = ["a", "b", "c", "d", "e"];
export const RIGHT_COLS = ["f", "g", "h", "i", "j"];
export const RAILS = { lg: "GND", lp: "VP", rg: "GND", rp: "VP" };
export const BLOCKS = {
  vin: { net: "VIN", holes: 4, label: "VIN" },
  vmon: { net: "VIN", holes: 3, label: "VIN" }, // a test terminal on the scope's side, so its probe stays off the board
  gin: { net: "GND", holes: 3, label: "GND" },
  vout: { net: "VOUT", holes: 4, label: "VOUT (A)" },
  gout: { net: "GND", holes: 3, label: "GND" },
};
export const POSTS = { "post+": "VP", postg: "GND", postin: "VIN", postgin: "GND", postout: "VOUT", postgout: "GND" };

/** Every hole on the board, in drawing order. */
export function allHoles() {
  const holes = [];
  for (const c of [...LEFT_COLS, ...RIGHT_COLS]) for (let r = 0; r < ROWS; r += 1) holes.push(`${c}${r}`);
  // rail holes come in groups of five
  for (const rail of Object.keys(RAILS)) for (let r = 0; r < ROWS; r += 1) if (r % 6 !== 5) holes.push(`${rail}${r}`);
  for (const [block, { holes: n }] of Object.entries(BLOCKS)) for (let i = 0; i < n; i += 1) holes.push(`${block}${i}`);
  return holes;
}

/** The strip, rail or terminal a hole or post belongs to. */
export function netOf(id) {
  if (!id) return null;
  if (POSTS[id]) return POSTS[id];
  const rail = /^(lg|lp|rg|rp)(\d+)$/.exec(id);
  if (rail) return RAILS[rail[1]];
  const block = /^(vin|vmon|gin|vout|gout)(\d)$/.exec(id);
  if (block) return BLOCKS[block[1]].net;
  const main = /^([a-j])(\d+)$/.exec(id);
  if (main) return `${LEFT_COLS.includes(main[1]) ? "L" : "R"}${main[2]}`;
  return null;
}

// ---------- S1 and the components ----------
// S1 is a single-pole double-throw switch: its common leg meets either the
// charge leg or the discharge leg, never both.
export const S1 = { charge: "d3", discharge: "g3", common: "d7" };
const scale = (unit, values) => values.map((v) => Number((v * unit).toPrecision(3)));
export const R_VALUES = scale(1, [100, 220, 470, 1000, 2200, 4700, 10000, 22000, 47000, 100000]);
export const C_VALUES = scale(1e-6, [0.01, 0.022, 0.047, 0.1, 0.22, 0.47, 1, 2.2, 4.7, 10, 22, 47, 100]);
export const L_VALUES = scale(1e-3, [10, 22, 47, 100, 220, 470, 1000]);

export const PARTS = {
  r: { label: "R", values: R_VALUES, legs: ["d12", "g12"] },
  c: { label: "C", values: C_VALUES, legs: ["h16", "h24"] },
  l: { label: "L", values: L_VALUES, legs: ["h16", "h24"] },
};
const storageId = (kind) => (kind === "RC" ? "c" : "l");
export function partsFor(kind) {
  return ["r", storageId(kind)].map((id) => ({ id, ...PARTS[id] }));
}
/** Every leg that occupies a hole, S1's included. */
export const legsFor = (kind) => [...partsFor(kind).flatMap((p) => p.legs), ...Object.values(S1)];

// ---------- wiring ----------
// Each wire is written in the direction positive current flows, so the bench can
// animate it. +V red, ground black, input yellow, node A cyan, links orange.
export const WIRE_COLORS = ["red", "black", "yellow", "cyan", "orange", "green", "blue", "purple"];
const COMMON = [
  { id: "in", a: "vin3", b: "b12", color: "yellow", flow: true, text: "VIN terminal to R" },
  { id: "node", a: "i12", b: "i16", color: "orange", flow: true, text: "R to node A, the top of the storage part" },
  { id: "gnd", a: "i24", b: "rg24", color: "black", flow: true, text: "Bottom of the storage part to the GND rail" },
  { id: "out", a: "j16", b: "vout1", color: "cyan", text: "Node A to the VOUT terminal" },
];
export const SOURCES = {
  s1: {
    title: "S1 and DC supply",
    jumpers: [
      { id: "com", a: "b7", b: "vin0", color: "yellow", flow: true, text: "S1 common to the VIN terminal" },
      { id: "dis", a: "rg3", b: "i3", color: "black", flow: "discharge", text: "S1 discharge leg to the GND rail" },
    ],
    leads: ["sup+", "supg"],
  },
  gen: { title: "Square wave from the generator", jumpers: [], leads: ["gen", "genc"] },
};
export const jumpersFor = (source) => [...SOURCES[source].jumpers, ...COMMON];

// Leads run from instrument jacks into a post or straight into a breadboard hole.
export const LEADS = {
  "sup+": { from: "S+", target: "b3", color: "red", text: "Supply +V lead straight into S1's charge row" },
  supg: { from: "EARTH", target: "postg", color: "black", text: "Supply COM lead to the GND post" },
  gen: { from: "GEN", target: "postin", color: "yellow", text: "Generator OUTPUT to the VIN post" },
  genc: { from: "GENC", target: "postgin", color: "black", text: "Generator COM to the GND post beside VIN" },
};

/** A sensible colour for a new wire: the guide's, else by what it carries. */
export function suggestColor(source, a, b) {
  const pair = [netOf(a), netOf(b)].sort().join("|");
  const planned = jumpersFor(source).find((j) => [netOf(j.a), netOf(j.b)].sort().join("|") === pair);
  if (planned) return planned.color;
  const nets = [netOf(a), netOf(b)];
  const byNet = { VP: "red", GND: "black", VIN: "yellow", VOUT: "cyan" };
  for (const net of Object.keys(byNet)) if (nets.includes(net)) return byNet[net];
  return "orange";
}

const NET_NAMES = { VP: "+V", GND: "GND" };
const POST_NAMES = { "post+": "+V terminal", postg: "GND terminal", postin: "VIN terminal", postgin: "GND terminal (input side)", postout: "VOUT terminal (node A)", postgout: "GND terminal (output side)" };
/** What a contact is, for the hover label. */
export function contactName(id) {
  if (netOf(id) === "GND") return `${describeContact(id)} · all GND points are connected`;
  return describeContact(id);
}
function describeContact(id) {
  if (POSTS[id]) return POST_NAMES[id];
  const rail = /^(lg|lp|rg|rp)(\d+)$/.exec(id);
  if (rail) return `${NET_NAMES[RAILS[rail[1]]]} rail (${rail[1][0] === "l" ? "left" : "right"})`;
  const block = /^(vin|vmon|gin|vout|gout)(\d)$/.exec(id);
  if (block) return `${BLOCKS[block[1]].label} terminal block`;
  const main = /^([a-j])(\d+)$/.exec(id);
  if (main) {
    const strip = netOf(id);
    const legs = { [netOf(S1.charge)]: "S1 charge", [netOf(S1.discharge)]: "S1 discharge", [netOf(S1.common)]: "S1 common", [netOf("d12")]: "R", [netOf("g12")]: "R", [netOf("h16")]: "the top of C / L", [netOf("h24")]: "the bottom of C / L" };
    return `Hole ${main[1]}${Number(main[2]) + 1}${legs[strip] ? ` · same strip as ${legs[strip]}` : ""}`;
  }
  return id;
}

// ---------- instrument settings ----------
export const SUPPLY_LEVELS = [5, 10, 15];
export const AMPLITUDES = [1, 2, 5, 10];
export const FREQUENCIES = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];
export const VDIV = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10];
export const IDIV = scale(1e-6, [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000]);
export const TDIV = scale(1e-6, [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000]);
export const SPEEDS = [0.1, 0.2, 0.5, 1, 2]; // scope screens per second of real time

/**
 * The values a circuit opens on. S1 follows the lab manual (1 kΩ with 100 µF,
 * τ = 100 ms; 100 Ω with 100 mH, τ = 1 ms); the generator's
 * square wave works in the kHz range, so its circuits open on τ = 100 µs.
 */
export function partDefaults(kind, source) {
  if (source === "gen") return kind === "RC" ? { r: 1000, c: 1e-7 } : { r: 100, l: 0.01 };
  return kind === "RC" ? { r: 1000, c: 1e-4 } : { r: 100, l: 0.1 };
}

export function initialState() {
  return {
    kind: "RC",
    source: "s1",
    s1: "discharge",
    r: 1000,
    c: 1e-4,
    l: 0.1,
    supply: { level: 5, on: false },
    gen: { amp: 5, freq: 1000 },
    jumpers: [], // { id, a, b, color, bend }
    leads: { "sup+": null, supg: null, gen: null, genc: null }, // post or hole id, or null
    probes: { ch1: null, ch2: null, probegnd: null }, // the scope's two probes and its ground lead
    started: false,
    charged: false,
  };
}

/** The generator's square wave: 0 V for the low half, its amplitude for the high half. */
export function waveAt(gen, t) {
  const phase = (((gen.freq * t) % 1) + 1) % 1;
  return phase < 0.5 ? gen.amp : 0;
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
    if (Math.abs(A[p][c]) < 1e-18) return null;
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

const name = { "S+": "+V", EARTH: "ground", GENC: "the generator COM", GEN: "the generator output" };
const GMIN = 1e-9; // a floating node settles at 0 V instead of breaking the solve

/**
 * Build the circuit from the current wiring. Its one stored quantity x is the
 * capacitor voltage or the inductor current. With the sources held still the
 * network is linear, so dx/dt = a·x + b and each stretch has an exact solution:
 * accurate at any time step, and it works for whatever the student has wired.
 */
export function buildModel(state) {
  const u = new Union();
  for (const [post, net] of Object.entries(POSTS)) u.join(post, net);
  for (const j of state.jumpers) if (j.a && j.b) u.join(netOf(j.a), netOf(j.b));
  for (const [id, contact] of Object.entries(state.leads)) if (contact) u.join(LEADS[id].from, netOf(contact));
  // S1 closes its common leg onto whichever throw it is set to
  u.join(netOf(S1.common), netOf(S1[state.s1]));

  const sources = [["EARTH", () => 0], ["GENC", () => 0]];
  // the generator drives its output against its COM; with that lead unplugged it floats
  if (u.find("GENC") !== "GENC") sources.push(["GEN", (t) => waveAt(state.gen, t)]);
  if (state.supply.on) sources.push(["S+", () => state.supply.level]);

  // a node held by two different sources is a short; the supply's current limit trips
  let short = null;
  const fixed = new Map();
  for (const [source, fn] of sources) {
    const root = u.find(source);
    if (fixed.has(root)) {
      const other = fixed.get(root).source;
      if (["EARTH", "GENC"].includes(source) && ["EARTH", "GENC"].includes(other)) continue; // both grounds
      short = short ?? `${name[source]} is shorted to ${name[other]}`;
      continue;
    }
    fixed.set(root, { source, fn });
  }
  if (short && state.supply.on) return { ...buildModel({ ...state, supply: { ...state.supply, on: false } }), short, supplyOn: false };

  const storageIdNow = storageId(state.kind);
  const rLegs = PARTS.r.legs.map((leg) => u.find(netOf(leg)));
  const sLegs = PARTS[storageIdNow].legs.map((leg) => u.find(netOf(leg)));
  const R = state.r;
  const S = state[storageIdNow];

  /** Solve the resistive network with the storage part held at x, the sources at time t. */
  const solve = (x, t) => {
    const known = new Map();
    for (const [root, s] of fixed) known.set(root, s.fn(t));
    const unknown = new Map();
    const index = (r) => {
      if (known.has(r)) return -1;
      if (!unknown.has(r)) unknown.set(r, unknown.size);
      return unknown.get(r);
    };
    for (const r of [...rLegs, ...sLegs]) index(r);
    const shorted = sLegs[0] === sLegs[1];
    const isC = state.kind === "RC";
    const branch = isC && !shorted;
    const n = unknown.size + (branch ? 1 : 0);
    const A = Array.from({ length: n }, () => new Array(n).fill(0));
    const b = new Array(n).fill(0);
    if (rLegs[0] !== rLegs[1]) {
      const g = 1 / R;
      const [ia, ib] = rLegs.map(index);
      if (ia >= 0) { A[ia][ia] += g; if (ib >= 0) A[ia][ib] -= g; else b[ia] += g * known.get(rLegs[1]); }
      if (ib >= 0) { A[ib][ib] += g; if (ia >= 0) A[ib][ia] -= g; else b[ib] += g * known.get(rLegs[0]); }
    }
    for (const [, i] of unknown) A[i][i] += GMIN;
    const [sa, sb] = sLegs.map(index);
    if (branch) {
      // the capacitor is a voltage x; its current is the extra unknown, leaving node a
      const k = unknown.size;
      if (sa >= 0) { A[sa][k] += 1; A[k][sa] += 1; } else b[k] -= known.get(sLegs[0]);
      if (sb >= 0) { A[sb][k] -= 1; A[k][sb] -= 1; } else b[k] += known.get(sLegs[1]);
      b[k] += x;
    } else if (!isC && !shorted) {
      // the inductor is a current x from node a to node b
      if (sa >= 0) b[sa] -= x;
      if (sb >= 0) b[sb] += x;
    }
    const sol = n ? solveLinear(A, b) : [];
    const v = new Map(known);
    for (const [r, i] of unknown) v.set(r, sol ? sol[i] : 0);
    const storageCurrent = isC ? (branch && sol ? sol[unknown.size] : 0) : x;
    const across = (v.get(sLegs[0]) ?? 0) - (v.get(sLegs[1]) ?? 0);
    const dxdt = isC ? (shorted ? -x / 1e-9 : storageCurrent / S) : (shorted ? 0 : across / S);
    const current = rLegs[0] === rLegs[1] ? 0 : ((v.get(rLegs[0]) ?? 0) - (v.get(rLegs[1]) ?? 0)) / R;
    return { v, dxdt, current, across };
  };

  /** dx/dt = a·x + b at time t. */
  const rates = (t) => {
    const b = solve(0, t).dxdt;
    return { a: solve(1, t).dxdt - b, b };
  };
  const edgesEvery = fixed.size && [...fixed.values()].some((s) => s.source === "GEN") ? 1 / (2 * state.gen.freq) : Infinity;

  const resolve = (id) => {
    if (!id) return null;
    if (["EARTH", "GENC", "GEN", "S+"].includes(id)) return u.find(id);
    const net = netOf(id);
    return net ? u.find(net) : null;
  };

  return {
    short,
    supplyOn: state.supply.on,
    root: resolve,
    connected: (a, b) => resolve(a) === resolve(b),
    solve,
    rates,
    /** The value x is heading for now, or null if it has nowhere to settle. */
    settle(t) {
      const { a, b } = rates(t);
      return Math.abs(a) < 1e-6 ? null : -b / a;
    },
    /** The time constant the wired network actually has now, or null. */
    tau(t) {
      const { a } = rates(t);
      return a < -1e-6 ? -1 / a : null;
    },
    /** Advance x exactly from t to t + h, stopping at each edge of a square wave. */
    advance(x, t, h) {
      let left = h, now = t, value = x;
      while (left > 0) {
        const nextEdge = edgesEvery === Infinity ? Infinity : (Math.floor(now / edgesEvery + 1e-9) + 1) * edgesEvery;
        const step = Math.min(left, Math.max(nextEdge - now, 1e-12));
        const { a, b } = rates(now + step / 2);
        if (Math.abs(a * step) < 1e-9) value += (a * value + b) * step;
        else { const end = -b / a; value = end + (value - end) * Math.exp(a * step); }
        now += step;
        left -= step;
      }
      return value;
    },
  };
}

/** Energy held by the storage part. */
export function energy(state, x) {
  return 0.5 * (state.kind === "RC" ? state.c : state.l) * x * x;
}

/** Theory for the current settings. */
export function theory(state) {
  const rc = state.kind === "RC";
  const tau = rc ? state.r * state.c : state.l / state.r;
  const drive = state.source === "gen" ? state.gen.amp : state.supply.level;
  return {
    tau,
    drive,
    formula: rc ? "τ = R C" : "τ = L / R",
    response: rc
      ? (state.source === "s1" && state.s1 === "discharge" ? "Vc(t) = V0 e^(−t/τ)" : "Vc(t) = Vin (1 − e^(−t/τ))")
      : (state.source === "s1" && state.s1 === "discharge" ? "I(t) = I0 e^(−t/τ)" : "I(t) = (Vin / R) (1 − e^(−t/τ))"),
    peakCurrent: drive / state.r,
    finalValue: rc ? drive : drive / state.r,
  };
}

/**
 * The measured time constant: how long the stored quantity takes to cover 63.2%
 * of the way from its starting value to where it is heading. Samples are
 * { t, x } from the moment the response began. Null until that point is reached.
 */
export function measureTau(samples, target) {
  if (samples.length < 2 || target === null) return null;
  const start = samples[0].x;
  const span = target - start;
  if (Math.abs(span) < 1e-9) return null;
  const level = start + 0.632 * span;
  for (let i = 1; i < samples.length; i += 1) {
    const [p, q] = [samples[i - 1], samples[i]];
    if ((p.x - level) * (q.x - level) <= 0 && p.x !== q.x) {
      const f = (level - p.x) / (q.x - p.x);
      return { tau: p.t + f * (q.t - p.t) - samples[0].t, level };
    }
  }
  return null;
}

// ---------- guided steps ----------
/** The build in order. A step is done when the wiring makes the connection, whichever hole of the strip was used. */
export function steps(state, model = buildModel(state)) {
  const list = [];
  const joined = (a, b) => state.jumpers.some((j) => j.a && j.b && ((netOf(j.a) === netOf(a) && netOf(j.b) === netOf(b)) || (netOf(j.a) === netOf(b) && netOf(j.b) === netOf(a))));
  for (const j of jumpersFor(state.source)) list.push({ kind: "jumper", ...j, done: joined(j.a, j.b) });
  for (const id of SOURCES[state.source].leads) list.push({ kind: "lead", id, ...LEADS[id], done: Boolean(state.leads[id]) && model.connected(LEADS[id].from, LEADS[id].target) });
  const onNet = (probe, net) => Boolean(state.probes[probe]) && model.root(state.probes[probe]) === model.root(net);
  list.push({ kind: "probe", id: "ch1", text: "Clip scope CH1 onto VIN", target: "vmon1", done: onNet("ch1", "postin") });
  list.push({ kind: "probe", id: "ch2", text: "Clip scope CH2 onto VOUT, node A", target: "vout2", done: onNet("ch2", "postout") });
  list.push({ kind: "probe", id: "probegnd", text: "Clip the scope's ground lead onto the GND beside VOUT", target: "gout1", done: onNet("probegnd", "postg") });
  if (state.source === "s1") list.push({ kind: "power", id: "power", text: "Switch the power supply on", done: model.supplyOn });
  list.push({ kind: "start", id: "start", text: "Press START to run the clock", done: state.started });
  if (state.source === "s1") list.push({ kind: "switch", id: "s1", text: "Flip S1 to CHARGE and watch the response", done: state.charged });
  return list;
}

/** Wires on the board that are not part of the selected circuit. */
export function strayJumpers(state) {
  const planned = jumpersFor(state.source).map((j) => [netOf(j.a), netOf(j.b)].sort().join("|"));
  return state.jumpers.filter((j) => j.a && j.b && !planned.includes([netOf(j.a), netOf(j.b)].sort().join("|")));
}
