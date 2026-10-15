import { circuitFor, correctTopology, netGroups } from "./modules.js";
import { validCablePath } from "./amplifier-cables.js";
import { signalSample } from "./physics.js";
import { measuredResponse, summarizeSamples } from "./amplifier-samples.js";

export const CONFIGURATIONS = ["inverting", "noninverting", "adder", "subtractor"];
export const PROBES = { red: "Meter V", black: "Meter COM", ch1: "CH1 tip", ch1Ground: "CH1 ground", ch2: "CH2 tip", ch2Ground: "CH2 ground" };
export const DEFAULTS = Object.freeze({
  configuration: "inverting",
  rail: 12,
  powered: false,
  meterOn: true,
  rin: 10000,
  rf: 20000,
  rin2: 10000,
  rf2: 20000,
  waveform: "sine",
  amplitude: 1,
  amplitude2: 0.6,
  frequency: 1000,
});
const copy = (v) => structuredClone(v);
const emptyProbes = () => Object.fromEntries(Object.keys(PROBES).map((k) => [k, null]));
export const electricalSnapshot = (s) => copy({ params: s.params, wires: s.wires, probes: s.probes });
export function createExperiment() {
  return {
    params: { ...DEFAULTS },
    wires: [],
    probes: emptyProbes(),
    history: [],
    cableLayout: { wires: [], probes: {} },
    selection: { from: "", to: "", wire: null, probe: null },
    hints: true,
    hintIndex: 0,
    view: "bench",
    running: true,
    held: null,
    message: "Supply is off. Choose two terminals to connect a lead.",
  };
}
export const CONFIGURATION_NAMES = {
  inverting: "Inverting amplifier",
  noninverting: "Non-inverting amplifier",
  adder: "Weighted adder",
  subtractor: "Difference amplifier",
};
export function resistorRoles(configuration) {
  if (configuration === "subtractor")
    return [
      { key: "rin", name: "R1", role: "Vin1 → −IN" },
      { key: "rf", name: "R2", role: "Vout → −IN" },
      { key: "rin2", name: "R3", role: "Vin2 → +IN" },
      { key: "rf2", name: "R4", role: "+IN → GND" },
    ];
  if (configuration === "adder")
    return [
      { key: "rin", name: "Rin1", role: "Vin1 → −IN" },
      { key: "rf", name: "Rf", role: "Vout → −IN" },
      { key: "rin2", name: "Rin2", role: "Vin2 → −IN" },
    ];
  return [
    { key: "rin", name: configuration === "noninverting" ? "Rg" : "Rin", role: configuration === "noninverting" ? "−IN → GND" : "Vin → −IN" },
    { key: "rf", name: "Rf", role: "Vout → −IN" },
  ];
}
export function transfer(s) {
  const p = s.params,
    r = p.rf / p.rin,
    multi = ["adder", "subtractor"].includes(p.configuration);
  const vin1 = p.configuration === "noninverting" ? 1 + r : -r;
  const vin2 = p.configuration === "adder" ? -p.rf / p.rin2 : p.configuration === "subtractor" ? ((1 + r) * p.rf2) / (p.rin2 + p.rf2) : 0;
  const formula = {
    inverting: "Vout = −(Rf / Rin) Vin",
    noninverting: "Vout = (1 + Rf / Rg) Vin",
    adder: "Vout = −Rf (Vin1 / Rin1 + Vin2 / Rin2)",
    subtractor: "Vout = −(R2/R1) Vin1 + (1 + R2/R1) R4/(R3 + R4) Vin2",
  }[p.configuration];
  return { multi, vin1, vin2, formula, matched: p.configuration === "subtractor" && Math.abs(r - p.rf2 / p.rin2) < 1e-10 };
}
export function circuit(s) {
  const c = circuitFor("opamp", { ...s.params, amplitude: s.params.waveform === "dc" ? s.params.amplitude : s.params.amplitude / 2 });
  for (const role of resistorRoles(s.params.configuration)) {
    const part = c.components.find((p) => p.id === role.key);
    part.label = role.name;
    part.value = `${s.params[role.key] / 1000} kΩ`;
  }
  c.pins = c.pins.map((p) => ({ ...p, name: pinLabel(p.id, s.params.configuration) }));
  return c;
}
export function pinLabel(id, configuration = "inverting") {
  const roles = Object.fromEntries(resistorRoles(configuration).map((r) => [r.key, r.name]));
  for (const [key, name] of Object.entries(roles)) if (id === `${key}a` || id === `${key}b`) return `${name} ${id.endsWith("a") ? "A" : "B"}`;
  return (
    {
      "plus+": "Supply +V",
      "plus-": "Supply GND",
      "minus-": "Supply −V",
      "signal+": ["adder", "subtractor"].includes(configuration) ? "Vin1" : "Vin",
      "signal2+": "Vin2",
      "signal-": "Generator GND",
      "op-": "741 pin 2 · −IN",
      "op+": "741 pin 3 · +IN",
      vp: "741 pin 7 · +V",
      vn: "741 pin 4 · −V",
      out: "741 pin 6 · Vout",
      gnd: "Board GND",
    }[id] || id
  );
}
const label = (s, id) => pinLabel(id, s.params.configuration);
function remember(s) {
  s.history.push({ ...electricalSnapshot(s), cableLayout: copy(s.cableLayout) });
  if (s.history.length > 80) s.history.shift();
}
function clearSelection(s) {
  s.selection = { from: "", to: "", wire: null, probe: null };
}
export function beginAdjustment(s) {
  return electricalSnapshot(s);
}
export function endAdjustment(s, before) {
  if (JSON.stringify(before) !== JSON.stringify(electricalSnapshot(s))) {
    s.history.push({ ...before, cableLayout: copy(s.cableLayout) });
    if (s.history.length > 80) s.history.shift();
  }
}
export function setParameter(s, name, value, record = true) {
  if (!(name in DEFAULTS) || name === "configuration") return false;
  if (typeof DEFAULTS[name] === "number" && !Number.isFinite(value)) return false;
  if (["rin", "rf", "rin2", "rf2"].includes(name) && (value < 1000 || value > 100000)) return false;
  if (name === "rail" && ![8, 12, 15].includes(value)) return false;
  if (name === "frequency" && (s.params.waveform === "dc" || value < 10 || value > 100000)) return false;
  if (name === "waveform" && !["dc", "sine", "square", "triangle"].includes(value)) return false;
  if (["amplitude", "amplitude2"].includes(name) && (Math.abs(value) > 20 || (s.params.waveform !== "dc" && value < 0))) return false;
  if (s.params[name] === value) return false;
  if (record) remember(s);
  s.params[name] = value;
  if (name === "waveform" && value !== "dc") {
    s.params.amplitude = Math.abs(s.params.amplitude);
    s.params.amplitude2 = Math.abs(s.params.amplitude2);
  }
  s.message =
    name === "powered"
      ? `Dual supply ${value ? "on" : "off"}.`
      : `${resistorRoles(s.params.configuration).find((r) => r.key === name)?.name || name} updated.`;
  return true;
}
export function matchSubtractor(s) {
  if (s.params.configuration !== "subtractor") return false;
  const value = (s.params.rin2 * s.params.rf) / s.params.rin;
  if (value < 1000 || value > 100000) {
    s.message = "Matching R4 would exceed 1–100 kΩ. Adjust R1, R2 or R3 first.";
    return false;
  }
  if (Math.abs(s.params.rf2 - value) < 1e-8) {
    s.message = "The resistor ratios already match.";
    return false;
  }
  remember(s);
  s.params.rf2 = value;
  s.message = "R4 set to R3 × R2 / R1. Other resistors and all connections are unchanged.";
  return true;
}
export function selectConfiguration(s, configuration) {
  if (!CONFIGURATIONS.includes(configuration) || configuration === s.params.configuration) return false;
  remember(s);
  s.params.configuration = configuration;
  s.params.powered = false;
  s.wires = [];
  s.probes = emptyProbes();
  s.cableLayout = { wires: [], probes: {} };
  clearSelection(s);
  s.hintIndex = 0;
  s.held = null;
  s.running = true;
  s.message = "Arrangement changed. Supply off; leads and probes cleared. Undo restores the previous experiment.";
  return true;
}
export function connect(s, from, to, route = null) {
  const ids = circuit(s).pins.map((p) => p.id);
  if (!ids.includes(from) || !ids.includes(to) || from === to) {
    s.message = "Choose two different terminals.";
    return false;
  }
  if (s.wires.some(([a, b]) => (a === from && b === to) || (a === to && b === from))) {
    s.message = "These terminals already have a lead.";
    return false;
  }
  remember(s);
  s.wires.push([from, to]);
  s.cableLayout.wires[s.wires.length - 1] = validCablePath(route) ? copy(route) : null;
  clearSelection(s);
  s.message = `${label(s, from)} → ${label(s, to)} connected.`;
  return true;
}
export function connectProbe(s, probe, terminal, placement = null) {
  if (!(probe in PROBES) || (terminal !== null && !circuit(s).pins.some((p) => p.id === terminal))) return false;
  const validPlacement = placement && validCablePath(placement.route),
    previous = s.cableLayout.probes[probe];
  // Normalizing a direction or recomputing the same tip can introduce roundoff.
  const sameGeometry = (a, b) =>
    Array.isArray(a) && Array.isArray(b)
      ? a.length === b.length && a.every((v, i) => sameGeometry(v, b[i]))
      : typeof a === "number" && typeof b === "number" && Math.abs(a - b) < 1e-9;
  if (
    s.probes[probe] === terminal &&
    (!validPlacement || (previous && ["route", "contact", "direction"].every((key) => sameGeometry(previous[key], placement[key]))))
  )
    return false;
  remember(s);
  s.probes[probe] = terminal;
  if (validPlacement) s.cableLayout.probes[probe] = copy({ ...placement, target: terminal });
  clearSelection(s);
  s.message = `${PROBES[probe]} ${terminal ? `at ${label(s, terminal)}` : "disconnected"}.`;
  return true;
}
// A held contact is electrically open, without adding intermediate Undo entries.
// Release commits once; cancellation simply discards this temporary view.
export function contactPreview(s, contact) {
  if (contact?.kind === "probe") return { ...s, probes: { ...s.probes, [contact.id]: null } };
  if (contact?.kind === "wire") return { ...s, wires: s.wires.filter((_, i) => i !== contact.id) };
  return s;
}
export function leadDrop(s, index, end, terminal, route = null) {
  const wire = s.wires[index];
  if (!wire || ![0, 1].includes(end)) return false;
  if (terminal === null) return removeLead(s, index);
  const fixed = wire[1 - end];
  if (wire[end] === terminal) return route ? arrangeCable(s, "wire", index, route) : false;
  if (!circuit(s).pins.some((p) => p.id === terminal) || terminal === fixed) return false;
  if (s.wires.some(([a, b], i) => i !== index && ((a === fixed && b === terminal) || (b === fixed && a === terminal)))) return false;
  remember(s);
  wire[end] = terminal;
  s.cableLayout.wires[index] = validCablePath(route) ? copy(route) : null;
  clearSelection(s);
  s.message = `${label(s, fixed)} → ${label(s, terminal)} connected.`;
  return true;
}
export function arrangeCable(s, kind, id, route, placement = null) {
  if (!["wire", "probe"].includes(kind) || !validCablePath(route) || (kind === "wire" ? !s.wires[id] : !(id in PROBES))) return false;
  const previous = kind === "wire" ? s.cableLayout.wires[id] : s.cableLayout.probes[id]?.route;
  if (JSON.stringify(previous) === JSON.stringify(route)) return false;
  remember(s);
  if (kind === "wire") s.cableLayout.wires[id] = copy(route);
  else s.cableLayout.probes[id] = copy({ ...s.cableLayout.probes[id], ...placement, route, target: s.probes[id] });
  s.message = "Cable shape saved. Endpoint connections are unchanged.";
  return true;
}
export function removeLead(s, index = s.selection.wire) {
  if (!Number.isInteger(index) || !s.wires[index]) return false;
  remember(s);
  const [a, b] = s.wires.splice(index, 1)[0];
  s.cableLayout.wires.splice(index, 1);
  clearSelection(s);
  s.message = `${label(s, a)} → ${label(s, b)} removed.`;
  return true;
}
export function undo(s) {
  const previous = s.history.pop();
  if (!previous) return false;
  const changedElectrical =
    JSON.stringify(electricalSnapshot(s)) !== JSON.stringify({ params: previous.params, wires: previous.wires, probes: previous.probes });
  Object.assign(s, previous);
  clearSelection(s);
  if (changedElectrical) {
    s.held = null;
    s.running = true;
  }
  s.message = changedElectrical ? "Previous electrical state restored." : "Previous cable placement restored.";
  return true;
}
export function reset(s) {
  remember(s);
  s.params = { ...DEFAULTS, configuration: s.params.configuration };
  s.wires = [];
  s.probes = emptyProbes();
  s.cableLayout = { wires: [], probes: {} };
  clearSelection(s);
  s.held = null;
  s.running = true;
  s.hintIndex = 0;
  s.message = "Experiment reset. Supply off; all leads and probes disconnected. Undo restores your work.";
}
export function selectTerminal(s, id) {
  if (s.selection.probe) return connectProbe(s, s.selection.probe, id);
  if (!s.selection.from || s.selection.to) {
    s.selection.from = id;
    s.selection.to = "";
  } else s.selection.to = id;
  s.selection.wire = null;
  s.message = s.selection.to ? "Endpoints selected. Press Connect." : `${label(s, id)} selected. Choose the other terminal.`;
}
// Passive resistors have no polarity. Compare against every end-for-end orientation,
// choosing the closest arrangement for observational hints without rewriting leads.
function topology(s) {
  const c = circuit(s),
    actual = netGroups(s.wires, c.pins);
  const resistors = c.components.filter((part) => part.pins.length === 2 && ["rin", "rf", "rin2", "rf2"].includes(part.id));
  let best;
  for (let mask = 0; mask < 2 ** resistors.length; mask++) {
    const swap = {};
    resistors.forEach((part, i) => {
      if (mask & (1 << i)) {
        const [a, b] = part.pins.map((p) => p.id);
        swap[a] = b;
        swap[b] = a;
      }
    });
    const wires = c.wires.map((pair) => pair.map((id) => swap[id] || id)),
      expected = netGroups(wires, c.pins);
    const wrong = s.wires.filter(([a, b]) => expected[a] !== expected[b]);
    const missing = wires.filter(([a, b]) => actual[a] !== actual[b]);
    const score = wrong.length * (c.wires.length + 1) + missing.length;
    if (!best || score < best.score) best = { c, actual, expected, wires, wrong, missing, score, correct: correctTopology({ ...c, wires }, s.wires) };
  }
  return best;
}
export function diagnostic(s) {
  const {
    actual,
    wrong: [wrong],
    missing,
  } = topology(s);
  if (wrong)
    return {
      kind: "wrong",
      terminals: wrong,
      text: `${label(s, wrong[0])} ↔ ${label(s, wrong[1])} joins different circuit nodes. Select the lead to inspect or remove it.`,
    };
  if (missing.length)
    return {
      kind: "incomplete",
      terminals: missing[0],
      text: `${missing.length} circuit connection${missing.length === 1 ? "" : "s"} remaining. Supply ${s.params.powered ? "on" : "off"}.`,
    };
  if (!s.params.powered) return { kind: "off", terminals: [], text: "Circuit complete. Turn on the dual supply when ready." };
  for (const id of ["ch1", "ch2"]) {
    const ground = s.probes[`${id}Ground`];
    if (ground && actual[ground] !== actual.gnd)
      return { kind: "instrument", terminals: [ground], text: `${id.toUpperCase()} ground must connect to the GND common rail.` };
  }
  return { kind: "ready", terminals: [], text: "Circuit powered. Instruments read only their connected probes." };
}
export function hint(s) {
  if (!s.hints) return { text: "Hints off. Connect terminals and instruments in any order.", terminals: [] };
  const {
    actual,
    wrong: [wrong],
    missing,
  } = topology(s);
  if (wrong) return { text: `Check this lead: ${label(s, wrong[0])} ↔ ${label(s, wrong[1])}.`, terminals: wrong };
  const tasks = missing.map(([a, b]) => ({ text: `Connect ${label(s, a)} to ${label(s, b)}.`, terminals: [a, b] }));
  for (const [probe, target] of [
    ["red", "out"],
    ["black", "gnd"],
    ["ch1", "signal+"],
    ["ch1Ground", "gnd"],
    ["ch2", "out"],
    ["ch2Ground", "gnd"],
  ]) {
    if (!s.probes[probe] || actual[s.probes[probe]] !== actual[target])
      tasks.push({ text: `Measure: place ${PROBES[probe]} at ${label(s, target)}.`, terminals: [target] });
  }
  if (!tasks.length)
    return {
      text: s.params.powered
        ? transfer(s).multi
          ? "Compare each input and Vout with the weighted transfer. Move CH1 to Vin2 to inspect the second input."
          : "Compare Vin and Vout. Change Rf and explain the amplitude and phase."
        : "All connections ready. Turn on the dual supply.",
      terminals: [],
    };
  return tasks[s.hintIndex % tasks.length];
}
export function advanceHint(s) {
  s.hintIndex++;
}
export function toggleHints(s, value) {
  s.hints = !!value;
}
function modelParameters(s) {
  return {
    ...s.params,
    amplitude: s.params.waveform === "dc" ? s.params.amplitude : s.params.amplitude / 2,
    amplitude2: s.params.waveform === "dc" ? s.params.amplitude2 : s.params.amplitude2 / 2,
    headroom: 1,
  };
}
function sampleAmplifier(s, time) {
  const p = modelParameters(s),
    t = transfer(s);
  const input = signalSample({ waveform: p.waveform, amplitude: p.amplitude, frequency: p.frequency, time });
  const input2 = signalSample({ waveform: p.waveform, amplitude: p.amplitude2, frequency: p.frequency, time });
  const desired = t.vin1 * input + t.vin2 * input2,
    limit = p.rail - 1;
  const output = p.powered ? Math.max(-limit, Math.min(limit, desired)) : 0;
  const clipped = p.powered && Math.abs(t.vin1 * p.amplitude + t.vin2 * p.amplitude2) > limit;
  const positive = p.configuration === "noninverting" ? input : p.configuration === "subtractor" ? (input2 * p.rf2) / (p.rin2 + p.rf2) : 0;
  const negative =
    p.configuration === "noninverting"
      ? (output * p.rin) / (p.rin + p.rf)
      : p.configuration === "adder"
        ? (input / p.rin + input2 / p.rin2 + output / p.rf) / (1 / p.rin + 1 / p.rin2 + 1 / p.rf)
        : (input / p.rin + output / p.rf) / (1 / p.rin + 1 / p.rf);
  return { input, input2, output, clipped, positive, negative, gain: t.multi ? null : t.vin1 };
}
export function evaluate(s) {
  const { actual: groups, correct } = topology(s),
    live = correct && s.params.powered;
  const p = modelParameters(s),
    sample = (time) => sampleAmplifier(s, time);
  const voltage = (terminal, time) => {
    if (!live || !terminal) return null;
    const m = sample(time);
    const seed = {
      gnd: 0,
      "signal+": m.input,
      "signal2+": m.input2,
      out: m.output,
      vp: p.rail,
      vn: -p.rail,
      "op+": m.positive,
      "op-": m.negative,
    };
    for (const [id, v] of Object.entries(seed)) if (groups[terminal] === groups[id]) return v;
    return null;
  };
  // Solve only ideal-source constraints. Potentials are [DC, shared-wave]
  // coefficients, so a short cannot appear valid at a waveform zero crossing.
  const edges = new Map(),
    potentials = new Map(),
    components = new Map(),
    conflicts = new Set();
  const addSource = (a, b, value) => {
    if (!(a in groups) || !(b in groups)) return;
    a = groups[a];
    b = groups[b];
    if (!edges.has(a)) edges.set(a, []);
    if (!edges.has(b)) edges.set(b, []);
    edges.get(b).push([a, value]);
    edges.get(a).push([b, value.map((v) => -v)]);
  };
  const waveVoltage = (value) => (p.waveform === "dc" ? [value, 0] : [0, value]);
  addSource("signal+", "signal-", waveVoltage(p.amplitude));
  addSource("signal2+", "signal-", waveVoltage(p.amplitude2));
  if (p.powered) {
    addSource("plus+", "plus-", [p.rail, 0]);
    addSource("minus-", "plus-", [-p.rail, 0]);
  }
  for (const start of edges.keys()) {
    if (potentials.has(start)) continue;
    potentials.set(start, [0, 0]);
    components.set(start, start);
    const queue = [start];
    for (let i = 0; i < queue.length; i++) {
      const node = queue[i],
        v = potentials.get(node);
      for (const [next, delta] of edges.get(node)) {
        const expected = [v[0] + delta[0], v[1] + delta[1]];
        if (potentials.has(next)) {
          const actual = potentials.get(next);
          if (actual.some((x, j) => Math.abs(x - expected[j]) > 1e-9)) conflicts.add(start);
        } else {
          potentials.set(next, expected);
          components.set(next, start);
          queue.push(next);
        }
      }
    }
  }
  const sourcePair = (a, b, time) => {
    if (!a || !b) return null;
    const na = groups[a],
      nb = groups[b],
      component = components.get(na);
    if (component === undefined || component !== components.get(nb) || conflicts.has(component)) return null;
    const va = potentials.get(na),
      vb = potentials.get(nb),
      wave = signalSample({ waveform: p.waveform, amplitude: 1, frequency: p.frequency, time });
    return va[0] - vb[0] + (va[1] - vb[1]) * wave;
  };
  const pair = (a, b, t) => {
    if (!live) return sourcePair(a, b, t);
    const v = voltage(a, t),
      g = voltage(b, t);
    return v === null || g === null ? null : v - g;
  };
  const grounded = (probe) => !!s.probes[probe] && groups[s.probes[probe]] === groups.gnd;
  const duration = p.waveform === "dc" ? 0.002 : 2 / p.frequency;
  const points = { ch1: [], ch2: [] },
    channelSamples = { ch1: [], ch2: [] },
    meter = [],
    inputs = [],
    outputs = [];
  const channelErrors = Object.fromEntries(
    ["ch1", "ch2"].map((id) => [
      id,
      !s.probes[id] || !s.probes[`${id}Ground`]
        ? `${id.toUpperCase()}: connect signal tip and ground clip.`
        : !grounded(`${id}Ground`)
          ? `${id.toUpperCase()} ground must connect to the GND common rail.`
          : pair(s.probes[id], s.probes[`${id}Ground`], 0) === null
            ? "Signal unavailable · complete and power the amplifier."
            : null,
    ])
  );
  for (let i = 0; i <= 512; i++) {
    const time = (duration * i) / 512;
    for (const channel of ["ch1", "ch2"]) {
      const value = grounded(`${channel}Ground`) ? pair(s.probes[channel], s.probes[`${channel}Ground`], time) : null;
      if (value !== null) points[channel].push([time, value]);
    }
  }
  for (let i = 0; i < 2048; i++) {
    const time = (i + 0.5) / 2048 / p.frequency;
    const a = channelErrors.ch1 ? null : pair(s.probes.ch1, s.probes.ch1Ground, time),
      b = channelErrors.ch2 ? null : pair(s.probes.ch2, s.probes.ch2Ground, time),
      v = s.params.meterOn ? pair(s.probes.red, s.probes.black, time) : null;
    if (a !== null) channelSamples.ch1.push(a);
    if (b !== null) channelSamples.ch2.push(b);
    if (a !== null && b !== null) {
      inputs.push(a);
      outputs.push(b);
    }
    if (v !== null) meter.push(v);
  }
  const scopeCorrect =
    grounded("ch1Ground") && grounded("ch2Ground") && groups[s.probes.ch1] === groups["signal+"] && groups[s.probes.ch2] === groups.out;
  const initial = sample(0),
    response = measuredResponse({ inputs, outputs, dc: p.waveform === "dc", clipped: initial.clipped, valid: live && scopeCorrect });
  const relation = transfer(s);
  if (relation.multi) {
    response.gain = null;
    response.phase = "unavailable";
    if (live && scopeCorrect && !initial.clipped) response.error = "Two inputs: compare the measured output with the weighted transfer.";
  }
  return {
    correct,
    live,
    diagnostic: conflicts.size
      ? {
          kind: "wrong",
          terminals: [],
          text: "Conflicting ideal-source voltages are connected together. Inspect and remove the short or source-to-source lead.",
        }
      : diagnostic(s),
    points,
    channelLabels: Object.fromEntries(["ch1", "ch2"].map((id) => [id, s.probes[id] ? label(s, s.probes[id]) : "Unconnected"])),
    channelStats: Object.fromEntries(Object.entries(channelSamples).map(([id, values]) => [id, summarizeSamples(values)])),
    channelErrors,
    duration,
    response,
    meter: summarizeSamples(meter),
    clipped: live && initial.clipped,
    theoreticalGain: initial.gain,
    transfer: relation,
    signature: JSON.stringify({
      params: { ...s.params, meterOn: undefined },
      wires: s.wires,
      scope: Object.fromEntries(Object.entries(s.probes).filter(([key]) => key !== "red" && key !== "black")),
    }),
  };
}
export function acquisition(s) {
  const live = evaluate(s);
  if (s.running || !s.held) return live;
  const stale = s.held.signature !== live.signature;
  return {
    ...s.held,
    meter: live.meter,
    diagnostic: live.diagnostic,
    correct: live.correct,
    live: live.live,
    theoreticalGain: live.theoreticalGain,
    transfer: live.transfer,
    stale,
    response: stale ? { ...s.held.response, gain: null, error: "Held capture is from previous settings. Run to acquire again." } : s.held.response,
  };
}
export function toggleAcquisition(s) {
  if (s.running) s.held = evaluate(s);
  else s.held = null;
  s.running = !s.running;
}
