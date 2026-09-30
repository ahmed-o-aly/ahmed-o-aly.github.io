import { MODULES, OPTIONS, circuitFor, correctTopology, netGroups } from "./modules.js";
import { solveDC, opamp, transient } from "./physics.js";

export const fmt = (n, decimals = 3) =>
  Number.isFinite(n) ? Number(n.toFixed(decimals)).toLocaleString("en-US", { maximumFractionDigits: decimals }) : "—";
export const unit = (n, u) =>
  !Number.isFinite(n) ? "—" : `${fmt(Math.abs(n) < 1 && n !== 0 ? n * 1000 : n)} ${Math.abs(n) < 1 && n !== 0 ? "m" : ""}${u}`;
export const same = (a, b, tolerance = 0.01) => Number.isFinite(a) && Math.abs(a - b) <= Math.max(Math.abs(b) * tolerance, 1e-8);

export function createLab() {
  return {
    module: "thevenin",
    mode: "explore",
    params: Object.fromEntries(Object.entries(MODULES).map(([id, m]) => [id, { ...m.defaults }])),
    wireSets: {},
    probeSets: {},
    scopeSets: {},
    scopeHolds: {},
    history: {},
    predictions: {},
    sumSubmissions: {},
    tool: "wire",
    selectedTerminal: null,
    records: [],
    attempts: Object.fromEntries(Object.keys(MODULES).map((id) => [id, 0])),
    challengeStarted: {},
    feedback: "Drag a lead between contacts; place the meter tips to measure.",
    checks: {},
    showGuide: false,
    sequence: 0,
  };
}
export const parameters = (s) => s.params[s.module];
export function variant(s) {
  const p = parameters(s);
  return p.representation || p.configuration || p.kind || "main";
}
export const key = (s) => `${s.mode}:${s.module}:${variant(s)}`;
export function context(s) {
  const circuit = circuitFor(s.module, parameters(s)),
    k = key(s);
  if (!s.wireSets[k]) s.wireSets[k] = s.mode === "explore" ? circuit.wires.map((w) => [...w]) : [];
  if (!s.probeSets[k]) s.probeSets[k] = s.mode === "explore" ? { red: circuit.positive, black: "gnd" } : { red: null, black: null };
  if (!s.scopeSets[k]) s.scopeSets[k] = defaultScope(s);
  return { circuit, wires: s.wireSets[k], probes: s.probeSets[k], scope: s.scopeSets[k], correct: correctTopology(circuit, s.wireSets[k]) };
}

const clone = (value) => structuredClone(value);
function defaultScope(s) {
  const connected = s.mode === "explore" && s.module === "opamp";
  return {
    ch1: { signal: connected ? "signal+" : null, ground: connected ? "gnd" : null },
    ch2: { signal: connected ? "out" : null, ground: connected ? "gnd" : null },
  };
}
// Gesture bookkeeping is outside serializable lab state; concurrent hands share one undo snapshot.
const manipulationGroups = new WeakMap();
const wiringSnapshot = (c) => ({ wires: clone(c.wires), probes: clone(c.probes), scope: clone(c.scope) });
function pushHistory(s, k, snapshot) {
  (s.history[k] ||= []).push(snapshot);
  if (s.history[k].length > 80) s.history[k].splice(0, s.history[k].length - 80);
}
export function beginManipulation(s, token) {
  if (token === undefined || token === null) return false;
  let groups = manipulationGroups.get(s);
  if (!groups) {
    groups = new Map();
    manipulationGroups.set(s, groups);
  }
  if ([...groups.values()].some((group) => group.tokens.has(token))) return false;
  const c = context(s),
    k = key(s);
  let group = groups.get(k);
  if (!group) {
    group = { tokens: new Set(), snapshot: wiringSnapshot(c) };
    groups.set(k, group);
  }
  group.tokens.add(token);
  return true;
}
export function endManipulation(s, token) {
  const groups = manipulationGroups.get(s);
  if (!groups) return false;
  const entry = [...groups.entries()].find(([, group]) => group.tokens.has(token));
  if (!entry) return false;
  const [k, group] = entry;
  group.tokens.delete(token);
  if (group.tokens.size) return true;
  groups.delete(k);
  if (!groups.size) manipulationGroups.delete(s);
  // Use the original context key even if the caller has already changed the selected view.
  if (!s.wireSets[k] || !s.probeSets[k] || !s.scopeSets[k]) return true;
  const current = { wires: s.wireSets[k], probes: s.probeSets[k], scope: s.scopeSets[k] };
  if (JSON.stringify(group.snapshot) !== JSON.stringify(current)) pushHistory(s, k, group.snapshot);
  return true;
}
function remember(s) {
  const c = context(s),
    k = key(s);
  if (manipulationGroups.get(s)?.has(k)) return;
  pushHistory(s, k, wiringSnapshot(c));
}
const predictionKey = (s, kind = parameters(s).kind) => `${s.mode}:${s.attempts.transient}:${kind}`;
function predictionState(s, kind = parameters(s).kind) {
  return s.predictions[predictionKey(s, kind)] || { choice: "unset", locked: false, late: false, correct: false, run: 0, tested: false };
}
function noteTrial(s) {
  if (s.module !== "transient") return;
  const k = predictionKey(s);
  s.predictions[k] = { ...predictionState(s), tested: true, late: !s.predictions[k]?.locked };
}
function lockPrediction(s) {
  if (s.module !== "transient") return false;
  const p = parameters(s),
    previous = predictionState(s);
  if (previous.locked) {
    s.feedback = "Prediction already locked for this circuit.";
    return false;
  }
  if (previous.late) {
    s.feedback = "The trial has already started. Begin a new attempt to make a prediction first.";
    return false;
  }
  if (!["slower", "faster", "same"].includes(p.predictionChoice)) {
    s.feedback = "Choose slower, faster or unchanged, then lock your prediction.";
    return false;
  }
  s.predictions[predictionKey(s)] = {
    choice: p.predictionChoice,
    locked: true,
    late: false,
    tested: false,
    run: previous.run,
    correct: p.predictionChoice === (p.kind === "RC" ? "slower" : "faster"),
    kind: p.kind,
    resistance: p.resistance,
    sequence: ++s.sequence,
  };
  s.feedback = "Prediction saved. Now change R and test it.";
  return true;
}
const sumKey = (s, v1, v2) => `${s.mode}:${s.attempts.superposition}:${v1}:${v2}`;
function validRecords(s, module = s.module) {
  return s.records.filter(
    (r) => r.module === module && r.mode === s.mode && r.attempt === s.attempts[module] && r.measurement.correct && r.measurement.probesCorrect
  );
}
function contributionRecords(s, v1 = s.params.superposition.v1, v2 = s.params.superposition.v2) {
  const rows = validRecords(s, "superposition").filter(
    (r) => r.params.v1 === v1 && r.params.v2 === v2 && (r.params.sourceMode === "both" || r.params.replacement === "short")
  );
  return Object.fromEntries(["a", "b", "both"].map((mode) => [mode, rows.find((r) => r.params.sourceMode === mode) || null]));
}
function submitSum(s) {
  if (s.module !== "superposition") return false;
  const p = parameters(s),
    rows = contributionRecords(s);
  if (!rows.a || !rows.b || !rows.both) {
    s.feedback = "Record A alone, B alone and both at the same source settings first.";
    return false;
  }
  if (!Number.isFinite(p.sumMilliamp)) {
    s.feedback = "Enter the signed sum in mA.";
    return false;
  }
  const sum = (rows.a.measurement.current + rows.b.measurement.current) * 1000;
  const measured = rows.both.measurement.current * 1000;
  const passed = Math.abs(p.sumMilliamp - sum) <= 0.01 && Math.abs(p.sumMilliamp - measured) <= 0.01;
  s.sumSubmissions[sumKey(s, p.v1, p.v2)] = {
    answerMilliamp: p.sumMilliamp,
    sumMilliamp: sum,
    measuredMilliamp: measured,
    passed,
    v1: p.v1,
    v2: p.v2,
    recordIds: Object.fromEntries(Object.entries(rows).map(([mode, r]) => [mode, r.id])),
    sequence: ++s.sequence,
  };
  s.feedback = passed
    ? "The signed sum matches the measured current with both sources."
    : "Check the signs. Add currents, then compare with the both-source reading.";
  return passed;
}

function liveSourceContributions(s) {
  const p = parameters(s),
    { wires, correct } = context(s);
  const live = Object.fromEntries(
    ["a", "b", "both"].map((sourceMode) => {
      const circuit = circuitFor("superposition", { ...p, sourceMode });
      const solved = solveDC({ components: circuit.electrical, wires });
      if (!solved.ok) return [sourceMode, { valid: false, current: null, voltage: null, power: null, error: solved.error }];
      const voltage = solved.voltages[circuit.positive] - solved.voltages.loadb;
      const current = solved.currents.load;
      return [
        sourceMode,
        {
          valid: true,
          current,
          voltage,
          power: voltage * current,
          branchCurrents: { r1: solved.currents.r1, r2: solved.currents.r2, load: current },
          error: null,
        },
      ];
    })
  );
  const valid = Object.values(live).every((entry) => entry.valid);
  const errors = [
    ...new Set(
      Object.values(live)
        .map((entry) => entry.error)
        .filter(Boolean)
    ),
  ];
  if (!correct) errors.push("Current wiring differs from the circuit diagram.");
  if (p.replacement !== "short") errors.push("Open replacements do not give additive contributions. Select Short.");
  return { live, valid, topologyCorrect: correct, superpositionValid: valid && p.replacement === "short", error: errors.join(" ") || null };
}

export function activity(s) {
  const p = parameters(s);
  if (s.module === "superposition") {
    const rows = contributionRecords(s),
      submitted = s.sumSubmissions[sumKey(s, p.v1, p.v2)] || null;
    return {
      kind: "superposition",
      ...liveSourceContributions(s),
      recorded: Object.fromEntries(
        Object.entries(rows).map(([mode, r]) => [
          mode,
          r ? { id: r.id, current: r.measurement.current, voltage: r.measurement.voltage, power: r.measurement.power } : null,
        ])
      ),
      sumMilliamp: p.sumMilliamp,
      explanation: p.explanation,
      sumSubmitted: !!submitted,
      submission: submitted,
    };
  }
  if (s.module === "transient")
    return {
      kind: "transient",
      prediction: {
        ...predictionState(s),
        choice: predictionState(s).locked ? predictionState(s).choice : p.predictionChoice,
        expected: predictionState(s).tested ? (p.kind === "RC" ? "slower" : "faster") : null,
      },
      predictions: { RC: predictionState(s, "RC"), RL: predictionState(s, "RL") },
      playback: { speed: p.speed, baselineTau: p.kind === "RC" ? 0.1 : 0.001, secondsPerBaselineTau: 2 },
    };
  if (s.module === "opamp") return { kind: "opamp", scope: scope(s) };
  return { kind: s.module };
}

export function advanceTransient(s, wallSeconds) {
  const p = s.params.transient;
  if (s.module !== "transient" || !p.playing || !Number.isFinite(wallSeconds) || wallSeconds <= 0 || !context(s).correct) return p.time;
  noteTrial(s);
  const baselineTau = p.kind === "RC" ? 0.1 : 0.001;
  p.time = Math.min(p.time + (wallSeconds * baselineTau * p.speed) / 2, 5 * transient({ ...p, source: 5 }).tau);
  p.acquiredTime = Math.max(p.acquiredTime || 0, p.time);
  if (p.time >= 5 * transient({ ...p, source: 5 }).tau) p.playing = false;
  return p.time;
}

function pinVoltages(circuit, wires, seed) {
  const groups = netGroups(wires, circuit.pins),
    result = {};
  for (const [pin, v] of Object.entries(seed)) for (const [other, g] of Object.entries(groups)) if (g === groups[pin]) result[other] = v;
  return result;
}

export function measure(s, timeOverride) {
  const p = parameters(s),
    { circuit, wires, probes, correct } = context(s);
  let result,
    voltages = {},
    voltage,
    current,
    power,
    gain,
    peak,
    maxInput,
    tau,
    energy,
    storageValue;
  if (s.module === "thevenin" || s.module === "superposition") {
    result = solveDC({ components: circuit.electrical, wires });
    voltages = result.voltages || {};
    if (result.ok) {
      voltage = voltages[circuit.positive] - voltages.loadb;
      current = result.currents.load;
      power = voltage * current;
    }
  } else if (s.module === "opamp") {
    if (!correct) result = { ok: false, error: "Connect the amplifier, feedback and both supplies." };
    else {
      result = { ...opamp({ ...p, headroom: 1, time: timeOverride ?? 1 / (4 * p.frequency) }), ok: true };
      ({ gain, maxInput } = result);
      peak = result.peakOutput;
      const vn =
        p.configuration === "inverting"
          ? (result.input / p.rin + result.output / p.rf) / (1 / p.rin + 1 / p.rf)
          : (result.output * p.rin) / (p.rin + p.rf);
      voltages = pinVoltages(circuit, wires, { gnd: 0, "signal+": result.input, out: result.output, "op-": vn, vp: p.rail, vn: -p.rail });
      voltage = result.output;
    }
  } else {
    if (!correct) result = { ok: false, error: "Connect the source, switch, resistor and storage loop." };
    else {
      result = { ...transient({ ...p, source: 5, time: timeOverride ?? p.time }), ok: true };
      ({ voltage, current, tau, energy, storageValue } = result);
      voltages = pinVoltages(circuit, wires, { gnd: 0, "s+": 5, common: p.charging ? 5 : 0, storagea: voltage });
    }
  }
  const probeReady = result.ok && probes.red && probes.black && Number.isFinite(voltages[probes.red]) && Number.isFinite(voltages[probes.black]);
  const probeVoltage = probeReady ? voltages[probes.red] - voltages[probes.black] : null;
  const groups = netGroups(wires, circuit.pins);
  const probesCorrect = !!probeReady && groups[probes.red] === groups[circuit.positive] && groups[probes.black] === groups[circuit.negative];
  return {
    ...result,
    voltage,
    current,
    power,
    gain,
    peak,
    maxInput,
    tau,
    energy,
    storageValue,
    voltages,
    probeVoltage,
    probeReady,
    probesCorrect,
    correct,
  };
}

const scopeCache = new WeakMap();
function scopeSignature(s) {
  const p = parameters(s),
    c = context(s);
  return JSON.stringify({
    configuration: p.configuration,
    rin: p.rin,
    rf: p.rf,
    amplitude: p.amplitude,
    rail: p.rail,
    frequency: p.frequency,
    timeDiv: p.timeDiv,
    ch1Scale: p.ch1Scale,
    ch2Scale: p.ch2Scale,
    triggerEdge: p.triggerEdge,
    triggerLevel: p.triggerLevel,
    wires: c.wires,
    scope: c.scope,
  });
}

/** Actual selected-node voltages; a grounded instrument reference is required per channel. */
export function scope(s) {
  if (s.module !== "opamp")
    return { ok: false, correct: false, error: "The scope is available in the amplifier lab.", channels: {}, running: false, stale: false };
  const p = parameters(s),
    c = context(s),
    signature = scopeSignature(s),
    held = s.scopeHolds[key(s)];
  if (!p.scopeRunning && held) {
    const stale = held.signature !== signature;
    return {
      ...clone(held),
      running: false,
      stale,
      correct: held.correct && !stale,
      error: stale ? "Held trace is from different settings. Run the scope to acquire the current circuit." : held.error,
    };
  }
  const cached = scopeCache.get(s);
  if (cached?.signature === signature) return { ...cached, running: p.scopeRunning };
  const initial = measure(s, 0),
    groups = netGroups(c.wires, c.circuit.pins);
  const channels = Object.fromEntries(
    ["ch1", "ch2"].map((id) => {
      const connection = c.scope[id],
        signal = connection.signal,
        ground = connection.ground;
      const valid = !!(
        initial.ok &&
        signal &&
        ground &&
        Number.isFinite(initial.voltages[signal]) &&
        Number.isFinite(initial.voltages[ground]) &&
        groups[ground] === groups.gnd
      );
      const expected = id === "ch1" ? "signal+" : "out";
      const correct = valid && groups[signal] === groups[expected];
      const error = !initial.ok
        ? initial.error
        : !signal || !ground
          ? `${id.toUpperCase()}: connect signal and ground.`
          : groups[ground] !== groups.gnd
            ? `${id.toUpperCase()} ground must connect to GND.`
            : !Number.isFinite(initial.voltages[signal])
              ? `${id.toUpperCase()}: signal is floating or unavailable.`
              : null;
      return [id, { signal, ground, valid, correct, error, scale: p[`${id}Scale`], points: [] }];
    })
  );
  const channelValue = (measurement, id) => measurement.voltages[channels[id].signal] - measurement.voltages[channels[id].ground];
  const period = 1 / p.frequency,
    trigger = { edge: p.triggerEdge, level: p.triggerLevel, found: false, time: 0 };
  if (channels.ch1.valid) {
    let previous = channelValue(initial, "ch1");
    for (let i = 1; i <= 200; i++) {
      const time = (i * period) / 200,
        value = channelValue(measure(s, time), "ch1");
      const rising = previous <= p.triggerLevel && value > p.triggerLevel;
      const falling = previous >= p.triggerLevel && value < p.triggerLevel;
      if ((p.triggerEdge === "rising" && rising) || (p.triggerEdge === "falling" && falling)) {
        const fraction = (p.triggerLevel - previous) / (value - previous);
        trigger.found = true;
        trigger.time = ((i - 1 + fraction) * period) / 200;
        break;
      }
      previous = value;
    }
  }
  const duration = (p.timeDiv * 10) / 1000;
  const timebaseTooWide = duration > period * 20 * 1.000001;
  const sampleCount = Math.max(200, Math.ceil((duration / period) * 64));
  for (let i = 0; !timebaseTooWide && i <= sampleCount; i++) {
    if (!channels.ch1.valid && !channels.ch2.valid) break;
    const time = (i * duration) / sampleCount,
      measurement = measure(s, time + trigger.time);
    for (const id of ["ch1", "ch2"]) if (channels[id].valid) channels[id].points.push([time * 1000, channelValue(measurement, id)]);
  }
  for (const id of ["ch1", "ch2"]) {
    const channel = channels[id];
    channel.peak = channel.points.length ? Math.max(...channel.points.map(([, value]) => Math.abs(value))) : null;
    channel.cropped = channel.valid && channel.peak > channel.scale * 4 * 1.001;
  }
  const correct =
    !timebaseTooWide &&
    channels.ch1.correct &&
    channels.ch2.correct &&
    !channels.ch1.cropped &&
    !channels.ch2.cropped &&
    trigger.found &&
    duration >= period * 0.999;
  const errors = [
    ...new Set(
      Object.values(channels)
        .map((ch) => ch.error)
        .filter(Boolean)
    ),
  ];
  const error =
    errors.join(" ") ||
    (timebaseTooWide
      ? "Timebase exceeds 20 periods. Reduce ms/div or use Autoscale to avoid undersampling."
      : !trigger.found
        ? "Waiting for the selected CH1 trigger crossing."
        : channels.ch1.cropped || channels.ch2.cropped
          ? "A trace exceeds the display. Increase V/div or use Autoscale."
          : duration < period
            ? "Increase time/div to show a complete period."
            : null);
  const result = {
    ok: !timebaseTooWide && (channels.ch1.valid || channels.ch2.valid),
    correct,
    error,
    channels,
    timeDiv: p.timeDiv,
    trigger,
    running: p.scopeRunning,
    stale: false,
    signature,
    timebaseTooWide,
    acquisition: { params: clone(p), wires: clone(c.wires), scope: clone(c.scope), sequence: s.sequence },
    duration,
    clipped: initial.clipped,
    limits: [-p.rail + 1, p.rail - 1],
  };
  scopeCache.set(s, result);
  return result;
}

export function setProbe(s, color, id) {
  const c = context(s);
  if (id !== null && !c.circuit.pins.some((pin) => pin.id === id)) return false;
  if (!["red", "black", "ch1", "ch2", "ch1Ground", "ch2Ground"].includes(color)) return false;
  if (!["red", "black"].includes(color) && s.module !== "opamp") return false;
  remember(s);
  if (color === "red" || color === "black") c.probes[color] = id;
  else {
    const channel = color.startsWith("ch1") ? "ch1" : "ch2";
    c.scope[channel][color.endsWith("Ground") ? "ground" : "signal"] = id;
  }
  const name = c.circuit.pins.find((pin) => pin.id === id)?.name || "disconnected";
  s.feedback = `${color === "red" ? "Meter V tip" : color === "black" ? "Meter COM tip" : color}: ${name}.`;
  s.selectedTerminal = null;
  s.checks[s.module] = null;
  s.sequence++;
  return true;
}

/** Reconnect one existing lead end with one undo entry; dropping off-terminal removes the lead. */
export function moveWire(s, index, endpoint, terminalId) {
  const c = context(s);
  if (!Number.isInteger(index) || index < 0 || index >= c.wires.length || ![0, 1].includes(endpoint)) return false;
  if (terminalId !== null && !c.circuit.pins.some((pin) => pin.id === terminalId)) return false;
  const previous = c.wires[index];
  const replacement = [...previous];
  replacement[endpoint] = terminalId;
  if (
    terminalId !== null &&
    (terminalId === previous[endpoint] ||
      replacement[0] === replacement[1] ||
      c.wires.some(([a, b], i) => i !== index && ((a === replacement[0] && b === replacement[1]) || (a === replacement[1] && b === replacement[0]))))
  )
    return false;
  remember(s);
  if (terminalId === null) c.wires.splice(index, 1);
  else c.wires[index] = replacement;
  s.selectedTerminal = null;
  s.checks[s.module] = null;
  if (s.module === "transient") s.params.transient.playing = false;
  s.sequence++;
  const name = (id) => c.circuit.pins.find((pin) => pin.id === id)?.name || id;
  s.feedback =
    terminalId === null
      ? `Removed lead from ${name(previous[0])} to ${name(previous[1])}.`
      : `Lead connected from ${name(replacement[0])} to ${name(replacement[1])}.`;
  return true;
}

export function removeWire(s, index) {
  if (s.tool !== "remove") {
    s.feedback = "Choose Remove before selecting a lead.";
    return false;
  }
  const c = context(s);
  if (!Number.isInteger(index) || index < 0 || index >= c.wires.length) return false;
  remember(s);
  const [a, b] = c.wires.splice(index, 1)[0];
  const name = (id) => c.circuit.pins.find((pin) => pin.id === id)?.name || id;
  s.feedback = `Removed ${name(a)} → ${name(b)}.`;
  s.selectedTerminal = null;
  s.checks[s.module] = null;
  s.sequence++;
  return true;
}

export function change(s, name, value) {
  const p = parameters(s);
  const positiveSettings = [
    "load",
    "equivalentResistance",
    "rin",
    "rf",
    "rail",
    "frequency",
    "resistance",
    "capacitance",
    "inductance",
    "timeDiv",
    "ch1Scale",
    "ch2Scale",
    "speed",
  ];
  const nonnegativeSettings = ["amplitude", "v1", "v2", "time", "prediction"];
  const numericSettings = [
    ...positiveSettings,
    ...nonnegativeSettings,
    "equivalentVoltage",
    "nortonCurrent",
    "triggerLevel",
    "sumMilliamp",
    "initial",
  ];
  if (
    numericSettings.includes(name) &&
    !(name === "sumMilliamp" && value === null) &&
    (!Number.isFinite(value) || (positiveSettings.includes(name) && value <= 0) || (nonnegativeSettings.includes(name) && value < 0))
  ) {
    s.feedback = `Enter a valid ${name} value.`;
    return false;
  }
  if (name === "predictionChoice" && s.module === "transient" && predictionState(s).locked) {
    s.feedback = "Prediction is locked. Use Retry prediction to start a fresh comparison.";
    return false;
  }
  if (s.module === "transient" && name === "resistance" && value !== p.resistance) {
    if (value !== p.resistance) noteTrial(s);
    const before = transient({ ...p, source: 5 });
    p.initial = before.storageValue;
    p.time = 0;
    p.acquiredTime = 0;
  }
  p[name] = value;
  if (s.module === "transient" && name === "time") {
    if (value > 0) noteTrial(s);
    if (context(s).correct) p.acquiredTime = Math.max(p.acquiredTime || 0, value);
  }
  if (name === "kind") {
    p.resistance = value === "RC" ? 1000 : 100;
    p.initial = 0;
    p.time = 0;
    p.acquiredTime = 0;
    p.playing = false;
    p.charging = true;
    p.predictionChoice = predictionState(s, value).choice;
  }
  if (["representation", "configuration", "kind"].includes(name)) {
    s.selectedTerminal = null;
    context(s);
  }
  s.checks[s.module] = null;
  s.sequence++;
  return true;
}

export function chooseModule(s, id) {
  if (!MODULES[id]) return;
  s.params.transient.playing = false;
  s.module = id;
  s.selectedTerminal = null;
  s.tool = "wire";
  if (s.mode === "challenge") initializeChallenge(s);
  context(s);
  s.feedback = MODULES[id].principle;
  s.sequence++;
}

export function setMode(s, mode) {
  s.mode = mode;
  s.selectedTerminal = null;
  s.tool = "wire";
  s.params.transient.playing = false;
  if (mode === "challenge") initializeChallenge(s);
  context(s);
  s.feedback =
    mode !== "explore"
      ? "Connect the circuit with patch leads, then place the probes. Use the circuit diagram as a guide."
      : "Explore the connected circuit. Change a setting and observe the result.";
  s.sequence++;
}

function initializeChallenge(s) {
  if (s.challengeStarted[s.module]) return;
  s.challengeStarted[s.module] = true;
  s.params[s.module] = { ...MODULES[s.module].defaults };
  if (s.module === "thevenin") Object.assign(s.params.thevenin, { equivalentVoltage: 4, equivalentResistance: 750, nortonCurrent: 8 });
}

function resetExperiment(s) {
  const module = s.module;
  const belongsToModule = (contextKey) => contextKey.split(":")[1] === module;
  // Remove every variant and mode, including caches that have no current wire entry.
  for (const field of ["wireSets", "probeSets", "scopeSets", "scopeHolds", "history"])
    for (const contextKey of Object.keys(s[field])) if (belongsToModule(contextKey)) delete s[field][contextKey];
  const groups = manipulationGroups.get(s);
  if (groups) {
    for (const contextKey of groups.keys()) if (belongsToModule(contextKey)) groups.delete(contextKey);
    if (!groups.size) manipulationGroups.delete(s);
  }
  if (module === "opamp") scopeCache.delete(s);
  if (module === "transient") s.predictions = {};
  if (module === "superposition") s.sumSubmissions = {};
  s.records = s.records.filter((record) => record.module !== module);
  s.attempts[module] = 0;
  delete s.challengeStarted[module];
  delete s.checks[module];
  s.params[module] = clone(MODULES[module].defaults);
  s.mode = "explore";
  s.tool = "wire";
  s.selectedTerminal = null;
  s.sequence++;
  context(s);
  s.feedback = "Experiment reset. Explore starts with the complete circuit and default settings.";
  return true;
}

export function terminal(s, id) {
  const { circuit, wires, probes } = context(s);
  if (!circuit.pins.some((p) => p.id === id)) return;
  if (["red", "black", "ch1", "ch2"].includes(s.tool)) {
    setProbe(s, s.tool, id);
    return;
  }
  if (s.tool === "scopeGround") {
    setProbe(s, `${parameters(s).scopeGroundChannel || "ch1"}Ground`, id);
    return;
  }
  if (s.tool === "remove") {
    s.feedback = "Select a lead to remove it.";
    return;
  }
  if (s.tool === "select") {
    s.selectedTerminal = id;
    s.feedback = circuit.pins.find((p) => p.id === id).name;
    return;
  }
  if (!s.selectedTerminal) {
    s.selectedTerminal = id;
    s.feedback = `${circuit.pins.find((p) => p.id === id).name} selected. Choose the other terminal.`;
  } else {
    const first = s.selectedTerminal;
    if (s.selectedTerminal !== id && !wires.some(([a, b]) => (a === id && b === s.selectedTerminal) || (a === s.selectedTerminal && b === id))) {
      remember(s);
      wires.push([s.selectedTerminal, id]);
    }
    s.selectedTerminal = null;
    s.feedback =
      first === id ? "Connection cancelled." : `${circuit.pins.find((p) => p.id === first)?.name} → ${circuit.pins.find((p) => p.id === id).name}.`;
  }
  s.checks[s.module] = null;
  s.sequence++;
}

export function capture(s) {
  if (s.module === "transient") noteTrial(s);
  const m = measure(s),
    p = parameters(s);
  if (!m.ok) {
    s.feedback = m.error || "Complete a valid circuit before recording.";
    return false;
  }
  const acquisition = s.module === "opamp" ? scope(s) : null;
  if (s.module === "opamp" && !acquisition.ok) {
    s.feedback = acquisition.error || "Connect the scope signals and grounds first.";
    return false;
  }
  if (s.module !== "opamp" && !m.probeReady) {
    s.feedback = "Connect both voltage probes before recording a measurement.";
    return false;
  }
  s.records.unshift({
    id: ++s.sequence,
    module: s.module,
    mode: s.mode,
    attempt: s.attempts[s.module],
    when: new Date().toISOString(),
    params: JSON.parse(JSON.stringify(p)),
    measurement: JSON.parse(JSON.stringify(m)),
    wires: context(s).wires.map((w) => [...w]),
    probes: { ...context(s).probes },
    scope: acquisition ? clone(acquisition) : null,
    prediction: s.module === "transient" ? clone(predictionState(s)) : null,
    activity: s.module === "superposition" || s.module === "transient" ? clone(activity(s)) : null,
  });
  s.feedback = `Reading ${s.records.length} saved to your notebook${
    acquisition
      ? acquisition.correct
        ? ""
        : `. ${acquisition.error || "Check CH1 at Vin and CH2 at Vout, with both grounds at GND"}`
      : m.probesCorrect
        ? ""
        : ". Check the probe locations: these are not across the requested output"
  }.`;
  return true;
}

export function assess(s) {
  const m = measure(s),
    p = parameters(s);
  const rows = s.records.filter(
    (r) =>
      r.module === s.module &&
      r.mode === "challenge" &&
      r.attempt === s.attempts[s.module] &&
      r.measurement.correct &&
      (s.module === "opamp" ? r.scope?.correct && !r.scope.stale : r.measurement.probesCorrect)
  );
  let checks = [];
  if (s.module === "thevenin") {
    for (const rep of ["original", "thevenin", "norton"])
      checks.push({
        label: `${rep === "original" ? "Original" : rep === "thevenin" ? "Thévenin" : "Norton"} verified at 250, 500 and 1000 Ω`,
        pass: [250, 500, 1000].every((load) =>
          rows.some((r) => r.params.representation === rep && r.params.load === load && same(r.measurement.voltage, (6 * load) / (500 + load)))
        ),
      });
    checks.push({
      label: "Maximum power verified at 500 Ω (18 mW)",
      pass: rows.some((r) => r.params.load === 500 && same(r.measurement.power, 0.018)) && p.load === 500 && m.correct && same(m.power, 0.018),
    });
  } else if (s.module === "superposition") {
    for (const mode of ["both", "a", "b"])
      checks.push({
        label: `Baseline recorded: ${mode === "both" ? "both sources" : mode === "a" ? "A alone, B shorted" : "B alone, A shorted"}`,
        pass: rows.some(
          (r) =>
            r.params.v1 === 6 &&
            r.params.v2 === 3 &&
            r.params.sourceMode === mode &&
            (mode === "both" || r.params.replacement === "short") &&
            same(r.measurement.current, mode === "both" ? 0.001 : mode === "a" ? 0.002 : -0.001)
        ),
      });
    checks.push({
      label: "Both nonzero sources active with zero branch current",
      pass: rows.some((r) => r.params.sourceMode === "both" && r.params.v1 > 0 && r.params.v2 > 0 && Math.abs(r.measurement.current) < 1e-7),
    });
    const baselineSum = s.sumSubmissions[`challenge:${s.attempts.superposition}:6:3`];
    checks.push({ label: "Submitted the signed sum of measured A and B currents at +6 V / −3 V", pass: !!baselineSum?.passed });
    const cancellation = rows.find(
      (r) =>
        r.params.sourceMode === "both" &&
        r.params.v1 > 0 &&
        r.params.v2 > 0 &&
        Math.abs(r.measurement.current) < 1e-7 &&
        ["a", "b"].every((mode) =>
          rows.some(
            (other) =>
              other.params.sourceMode === mode &&
              other.params.replacement === "short" &&
              other.params.v1 === r.params.v1 &&
              other.params.v2 === r.params.v2
          )
        )
    );
    checks.push({ label: "Cancellation verified with each source's signed contribution", pass: !!cancellation });
    checks.push({
      label: "Explained cancellation: equal and opposite branch contributions; current can flow elsewhere",
      pass: !!cancellation && p.explanation === "opposing",
    });
  } else if (s.module === "opamp") {
    const design = rows.filter(
      (r) => r.params.configuration === "inverting" && r.params.rail === 12 && r.params.frequency === 100 && same(r.measurement.gain, -3)
    );
    checks = [
      {
        label: "Gain −3 at ±12 V and 100 Hz with correct wiring",
        pass: m.correct && p.configuration === "inverting" && p.rail === 12 && p.frequency === 100 && same(m.gain, -3),
      },
      { label: "Recorded an unclipped waveform at the target settings", pass: design.some((r) => !r.measurement.clipped) },
      { label: "Recorded a clipped waveform at the target settings", pass: design.some((r) => r.measurement.clipped) },
      { label: "Predicted the maximum input within 0.1 V of 11/3 Vpk", pass: Math.abs(p.prediction - 11 / 3) <= 0.1 },
      { label: "Scope channels measure Vin and Vout with grounded references", pass: scope(s).channels.ch1.correct && scope(s).channels.ch2.correct },
    ];
  } else {
    for (const kind of ["RC", "RL"])
      for (const [label, r] of [
        ["baseline", kind === "RC" ? 1000 : 100],
        ["half time constant", kind === "RC" ? 500 : 200],
      ])
        checks.push({
          label: `${kind}: ${label}, measured at one τ`,
          pass: rows.some(
            (row) =>
              row.params.kind === kind &&
              row.params.resistance === r &&
              row.params.charging &&
              Math.abs(row.params.initial) < 1e-9 &&
              row.prediction?.locked &&
              !row.prediction.late &&
              row.prediction.run === predictionState(s, kind).run &&
              row.prediction.sequence < row.id &&
              same(row.params.time, row.measurement.tau, 0.02)
          ),
        });
    for (const kind of ["RC", "RL"])
      checks.push({
        label: `${kind}: predicted the effect of increasing R before testing`,
        pass: predictionState(s, kind).locked && !predictionState(s, kind).late && predictionState(s, kind).correct,
      });
  }
  s.checks[s.module] = checks;
  const count = checks.filter((c) => c.pass).length;
  s.feedback =
    count === checks.length
      ? "All checks passed. Add your explanation to the exported notebook for instructor review."
      : `${count} of ${checks.length} checks passed. Review the remaining items below.`;
  return checks;
}

export function action(s, id) {
  if (id === "reset-experiment") return resetExperiment(s);
  if (id.startsWith("scrub:") && s.module === "transient") {
    const milliseconds = Number(id.slice(6));
    if (!Number.isFinite(milliseconds) || !context(s).correct) return false;
    const p = parameters(s);
    p.time = Math.max(0, Math.min(milliseconds / 1000, p.acquiredTime || 0));
    p.playing = false;
    s.sequence++;
    s.feedback = `Trace cursor at ${fmt(p.time * 1000)} ms. Run to continue the response.`;
    return true;
  }
  if (id.startsWith("probe:")) {
    const [, color, pin] = id.split(":");
    return setProbe(s, color, pin || null);
  }
  if (id.startsWith("remove-wire:")) return removeWire(s, Number(id.split(":")[1]));
  if (id.startsWith("scope-ground:")) {
    const channel = id.split(":")[1];
    if (s.module === "opamp" && ["ch1", "ch2"].includes(channel)) {
      parameters(s).scopeGroundChannel = channel;
      s.tool = "scopeGround";
      s.selectedTerminal = null;
      s.feedback = `Place ${channel.toUpperCase()} ground at GND.`;
    }
    return;
  }
  if (id === "cancel") {
    s.selectedTerminal = null;
    s.feedback = "Selection cancelled.";
    return;
  }
  if (id === "undo") {
    const previous = s.history[key(s)]?.pop();
    if (!previous) {
      s.feedback = "No wiring or probe change to undo.";
      return;
    }
    s.wireSets[key(s)] = previous.wires;
    s.probeSets[key(s)] = previous.probes;
    s.scopeSets[key(s)] = previous.scope;
    s.selectedTerminal = null;
    s.checks[s.module] = null;
    s.sequence++;
    s.feedback = "Last wiring or probe change undone.";
    return;
  }
  if (id === "submit-sum") return submitSum(s);
  if (id === "lock-prediction") return lockPrediction(s);
  if (id === "restart-prediction" && s.module === "transient") {
    const p = parameters(s),
      run = predictionState(s).run + 1;
    s.predictions[predictionKey(s)] = { choice: "unset", locked: false, late: false, tested: false, correct: false, run };
    Object.assign(p, {
      resistance: p.kind === "RC" ? 1000 : 100,
      time: 0,
      initial: 0,
      acquiredTime: 0,
      charging: true,
      playing: false,
      predictionChoice: "unset",
    });
    s.checks.transient = null;
    s.sequence++;
    s.feedback = "New prediction for this circuit. Earlier readings stay in the notebook but do not count for this comparison.";
    return;
  }
  if (id === "scope-toggle" && s.module === "opamp") {
    const p = parameters(s);
    if (p.scopeRunning) s.scopeHolds[key(s)] = clone(scope(s));
    p.scopeRunning = !p.scopeRunning;
    s.sequence++;
    s.feedback = p.scopeRunning ? "Scope running." : "Scope held. Measurements retain their acquisition settings.";
    return;
  }
  if (id === "scope-autoscale" && s.module === "opamp") {
    const p = parameters(s);
    p.scopeRunning = true;
    p.timeDiv = 200 / p.frequency;
    const acquisition = scope(s);
    for (const channel of ["ch1", "ch2"]) {
      const needed = ((acquisition.channels[channel].peak || 0) * 1.15) / 4;
      p[`${channel}Scale`] = OPTIONS[`${channel}Scale`].find((value) => value >= needed) || Math.max(10, needed);
    }
    s.sequence++;
    s.feedback = acquisition.ok ? "Two periods fitted to the scope. Adjust the trigger if needed." : acquisition.error;
    return;
  }
  if (id.startsWith("module:")) {
    chooseModule(s, id.slice(7));
    return;
  }
  if (id.startsWith("set:")) {
    const [, name, value] = id.split(":");
    change(s, name, value === "true" ? true : value === "false" ? false : Number.isNaN(Number(value)) ? value : Number(value));
    return;
  }
  if (id.startsWith("adjust:")) {
    const [, name, rawDelta] = id.split(":"),
      delta = Number(rawDelta),
      p = parameters(s);
    const allowed = (s.module === "superposition" && name === "sumMilliamp") || (s.module === "opamp" && name === "prediction");
    const current = p[name] === null ? 0 : p[name];
    if (!allowed || rawDelta === "" || !Number.isFinite(delta) || !Number.isFinite(current)) {
      s.feedback = "Choose a valid numeric answer adjustment.";
      return false;
    }
    const values = OPTIONS[name],
      lower = Math.min(...values),
      upper = Math.max(...values);
    return change(s, name, Number(Math.min(upper, Math.max(lower, current + delta)).toFixed(6)));
  }
  if (id.startsWith("cycle:")) {
    const [, name, dir = "1"] = id.split(":"),
      p = parameters(s),
      values = OPTIONS[name];
    if (values && name in p && Number.isFinite(Number(dir)) && Number(dir) !== 0) {
      const direction = Math.sign(Number(dir));
      if (values.every((value) => typeof value === "number")) {
        const current = p[name] === null ? 0 : p[name];
        if (!Number.isFinite(current)) return false;
        const next =
          direction > 0
            ? values.find((value) => value > current + 1e-10) ?? values.at(-1)
            : [...values].reverse().find((value) => value < current - 1e-10) ?? values[0];
        change(s, name, next);
      } else {
        const index = Math.max(0, values.indexOf(p[name]));
        change(s, name, values[(index + direction + values.length) % values.length]);
      }
    }
    return;
  }
  if (id.startsWith("tool:")) {
    s.tool = id.slice(5);
    s.selectedTerminal = null;
    s.feedback =
      s.tool === "remove"
        ? "Select a lead to remove it."
        : s.tool === "select"
          ? "Select a component or terminal."
          : `${
              s.tool === "wire" ? "Patch lead" : s.tool === "red" ? "Meter V tip" : s.tool === "black" ? "Meter COM tip" : s.tool + " probe"
            } selected. Choose a terminal on the bench.`;
    return;
  }
  if (id === "explore" || id === "build" || id === "challenge") {
    setMode(s, id);
    return;
  }
  if (id === "record") {
    capture(s);
    return;
  }
  if (id === "check") {
    assess(s);
    return;
  }
  if (id === "check-wiring") {
    s.feedback = context(s).correct
      ? "The terminal connections match the reference circuit. Now connect the probes and take a reading."
      : "The wiring does not yet match the reference circuit. Use Schematic to compare connections; open and shorted paths change the result.";
    return;
  }
  if (id === "clear" || id === "reset-circuit") {
    remember(s);
    s.wireSets[key(s)] = [];
    s.probeSets[key(s)] = { red: null, black: null };
    s.scopeSets[key(s)] = defaultScope({ ...s, mode: "challenge" });
    s.selectedTerminal = null;
    s.params.transient.playing = false;
    s.feedback = "Leads and probes cleared. Select two terminals to add each connection.";
    return;
  }
  if (id === "restore") {
    if (s.mode !== "explore") {
      s.feedback = "Connect the circuit with patch leads, or switch to Explore to use the connected circuit.";
      return;
    }
    const c = circuitFor(s.module, parameters(s));
    remember(s);
    s.wireSets[key(s)] = c.wires.map((w) => [...w]);
    s.probeSets[key(s)] = { red: c.positive, black: "gnd" };
    s.scopeSets[key(s)] = defaultScope(s);
    s.feedback = "Reference circuit connected.";
    return;
  }
  if (id === "reset-attempt") {
    s.attempts[s.module]++;
    for (const k of Object.keys(s.wireSets))
      if (k.startsWith(`challenge:${s.module}:`)) {
        delete s.wireSets[k];
        delete s.probeSets[k];
        delete s.scopeSets[k];
        delete s.scopeHolds[k];
        delete s.history[k];
      }
    s.challengeStarted[s.module] = false;
    s.selectedTerminal = null;
    if (s.mode === "challenge") initializeChallenge(s);
    s.checks[s.module] = null;
    s.feedback = "A new challenge attempt has started. Earlier readings remain in the notebook.";
    context(s);
    return;
  }
  if (s.module === "transient") {
    const p = parameters(s);
    if (id === "play") {
      if (!context(s).correct) {
        s.feedback = "Complete the circuit before running the transient.";
        return;
      }
      p.playing = !p.playing;
      if (p.playing) noteTrial(s);
    }
    if (id === "switch") {
      noteTrial(s);
      p.initial = transient({ ...p, source: 5 }).storageValue;
      p.time = 0;
      p.acquiredTime = 0;
      p.charging = !p.charging;
      s.feedback = p.charging
        ? "Switch connected to the 5 V source. Stored state is preserved."
        : "Switch connected to the closed return loop. Stored state is preserved.";
    }
    if (id === "replay") {
      if (context(s).correct) noteTrial(s);
      p.time = 0;
      p.acquiredTime = 0;
      p.playing = context(s).correct;
      s.feedback = "Replaying this switching segment from its stored initial condition.";
    }
    if (id === "reset-energy") {
      p.initial = 0;
      p.time = 0;
      p.acquiredTime = 0;
      p.charging = true;
      p.playing = false;
      s.feedback = "New experiment: initial stored energy set to zero.";
    }
    if (id === "one-tau") {
      noteTrial(s);
      p.time = transient({ ...p, source: 5 }).tau;
      if (context(s).correct) p.acquiredTime = Math.max(p.acquiredTime || 0, p.time);
      p.playing = false;
    }
    if (id === "five-tau") {
      noteTrial(s);
      p.time = transient({ ...p, source: 5 }).tau * 5;
      if (context(s).correct) p.acquiredTime = Math.max(p.acquiredTime || 0, p.time);
      p.playing = false;
    }
  }
  s.sequence++;
}

export function metrics(s) {
  const m = measure(s),
    ready = m.ok;
  const common = {
    label: "Voltmeter",
    value: m.probeReady ? fmt(m.probeVoltage) : "—",
    unit: "V",
    detail: m.probeReady ? "V tip − COM tip" : "Place both probes",
  };
  if (s.module === "opamp")
    return [
      { ...common, label: "Voltage sample", detail: `At input +peak · ${fmt(250 / parameters(s).frequency)} ms · V tip − COM tip` },
      {
        label: "Linear gain",
        value: ready ? fmt(m.gain) : "—",
        unit: "V/V",
        detail: ready ? (m.clipped ? "Output is clipping" : "Within output limits") : "Connect feedback & supplies",
      },
      { label: "Output peak", value: ready ? fmt(m.peak) : "—", unit: "Vpk", detail: `Teaching model: ±${parameters(s).rail - 1} V limit` },
    ];
  if (s.module === "transient")
    return [
      common,
      { label: "Storage current", value: ready ? fmt(m.current * 1000) : "—", unit: "mA", detail: "Fixed sensor · top → ground" },
      {
        label: "Stored energy",
        value: ready ? fmt(m.energy * 1000, 4) : "—",
        unit: "mJ",
        detail: ready ? `τ = ${fmt(m.tau * 1000)} ms` : "Complete the storage loop",
      },
    ];
  return [
    common,
    { label: "Branch current", value: ready ? fmt(m.current * 1000) : "—", unit: "mA", detail: "Fixed sensor · top → ground" },
    { label: "Load power", value: ready ? fmt(m.power * 1000) : "—", unit: "mW", detail: "Computed from V × I" },
  ];
}

const sweepCache = new WeakMap();

export function plot(s) {
  const p = parameters(s),
    m = measure(s),
    series = [];
  if (s.module === "thevenin") {
    const { circuit, wires, correct } = context(s);
    const xMax = Math.max(2000, p.load);
    const loads = [
      ...new Set([...Array.from({ length: 100 }, (_, i) => ((i + 1) * xMax) / 100), ...OPTIONS.load.filter((load) => load <= xMax), p.load]),
    ].sort((a, b) => a - b);
    // Sweep the student's exact network. No fixture or correct-equivalent shortcut.
    const signature = JSON.stringify([circuit.electrical, wires, p.load]);
    const cached = sweepCache.get(s);
    const points = cached?.signature === signature ? cached.points : [];
    if (cached?.signature !== signature && m.ok)
      for (const load of loads) {
        const solved = solveDC({
          components: circuit.electrical.map((component) => (component.id === "load" ? { ...component, value: load } : component)),
          wires,
        });
        if (solved.ok) points.push([load, (solved.voltages.loada - solved.voltages.loadb) * solved.currents.load * 1000]);
      }
    if (cached?.signature !== signature) sweepCache.set(s, { signature, points });
    const peak = points.reduce((best, [x, y]) => (!best || y > best.y ? { x, y } : best), null);
    return {
      title: "Load power sweep",
      subtitle: !m.ok ? m.error : `Calculated sweep · current wiring${correct ? "" : " differs from the diagram"} · select a load to test it`,
      series: points.length ? [{ name: "Calculated load power", color: "#17788d", unit: "mW", points }] : [],
      interaction: "load",
      calculated: true,
      valid: m.ok,
      error: m.ok ? null : m.error,
      xMax,
      yMin: 0,
      yMax: Math.max(peak?.y || 0, 0.001) * 1.12,
      xLabel: "Load resistance (Ω)",
      yLabel: "Power (mW)",
      xUnit: "Ω",
      yUnit: "mW",
      peak,
      marker: m.ok ? { x: p.load, y: m.power * 1000 } : null,
    };
  }
  if (s.module === "superposition") {
    const comparison = liveSourceContributions(s),
      live = comparison.live;
    return {
      title: comparison.superpositionValid ? "Signed source contributions" : "Source states",
      interaction: "source",
      calculated: true,
      subtitle: comparison.error || "Calculated from current wiring · positive current flows top → ground",
      bars: [
        { name: "A alone", sourceMode: "a", value: live.a.valid ? live.a.current * 1000 : null, missing: !live.a.valid, color: "#17788d" },
        { name: "B alone", sourceMode: "b", value: live.b.valid ? live.b.current * 1000 : null, missing: !live.b.valid, color: "#b77739" },
        { name: "Both", sourceMode: "both", value: live.both.valid ? live.both.current * 1000 : null, missing: !live.both.valid, color: "#294a61" },
      ],
      yLabel: "Current (mA)",
      yUnit: "mA",
      series: [],
    };
  }
  if (s.module === "opamp") {
    const acquisition = scope(s);
    const panels = ["ch1", "ch2"].map((id, index) => {
      const ch = acquisition.channels[id],
        color = index ? "#17788d" : "#b77739";
      return {
        id,
        interaction: "scope",
        title: `${id.toUpperCase()} · ${ch.scale} V/div`,
        subtitle:
          ch.error ||
          acquisition.error ||
          `${ch.signal} − ${ch.ground} · ${acquisition.running ? "Run" : "Hold"}${acquisition.stale ? " · old settings" : ""}`,
        series: ch.valid && ch.points.length ? [{ name: id.toUpperCase(), color, points: ch.points }] : [],
        xMax: acquisition.timeDiv * 10,
        yMin: -ch.scale * 4,
        yMax: ch.scale * 4,
        xLabel: "Time (ms)",
        yLabel: "Voltage (V)",
        xUnit: "ms",
        yUnit: "V",
        limits: id === "ch2" && ch.correct ? acquisition.limits : [],
      };
    });
    return {
      title: "Oscilloscope",
      interaction: "scope",
      subtitle:
        acquisition.error ||
        `${p.frequency} Hz · ${acquisition.trigger.edge} trigger at ${acquisition.trigger.level} V · ${acquisition.running ? "Run" : "Hold"}`,
      series: panels.flatMap((panel) => panel.series),
      panels,
      xMax: acquisition.timeDiv * 10,
      yMin: -Math.max(acquisition.channels.ch1.scale, acquisition.channels.ch2.scale) * 4,
      yMax: Math.max(acquisition.channels.ch1.scale, acquisition.channels.ch2.scale) * 4,
      xLabel: "Time (ms)",
      yLabel: "Voltage (V)",
      limits: acquisition.limits,
      scope: acquisition,
    };
  }
  const tau = transient({ ...p, source: 5 }).tau;
  const acquired = m.ok ? Math.max(0, p.acquiredTime || 0) : 0;
  const xMax = Math.max((p.kind === "RC" ? 0.1 : 0.001) * 5000, acquired * 1000);
  const samples = m.ok
    ? Array.from({ length: acquired > 0 ? 121 : 1 }, (_, i) => {
        const t = acquired > 0 ? (i / 120) * acquired : 0;
        const result = transient({ ...p, source: 5, time: t });
        return { time: t * 1000, voltage: result.voltage, current: result.current * 1000, energy: result.energy * 1000 };
      })
    : [];
  const panels = ["voltage", "current", "energy"].map((field, index) => {
    const points = samples.map((sample) => [sample.time, sample[field]]);
    const vals = points.map((point) => point[1]);
    const name =
      field === "voltage" ? `${p.kind === "RC" ? "Capacitor" : "Inductor"} voltage` : field === "current" ? "Storage current" : "Stored energy";
    const initial = transient({ ...p, source: 5, time: 0 });
    const bound =
      field === "voltage"
        ? Math.max(5, Math.abs(initial.voltage))
        : field === "current"
          ? Math.max(5000 / p.resistance, Math.abs(initial.current * 1000))
          : Math.max(initial.energy * 1000, p.kind === "RC" ? 12500 * p.capacitance : (12500 * p.inductance) / p.resistance ** 2);
    return {
      id: field,
      title: name,
      subtitle: !m.ok
        ? m.error
        : `${p.charging ? "Source connected" : "Closed return"} · ${p.playing ? "Acquiring" : acquired ? "Paused" : "Press Run"} · ${fmt(
            acquired * 1000
          )} ms acquired`,
      series: points.length ? [{ name, color: ["#17788d", "#b77739", "#735782"][index], unit: ["V", "mA", "mJ"][index], points }] : [],
      interaction: "time",
      valid: m.ok,
      acquiredMax: acquired * 1000,
      xMax,
      yMin: Math.min(0, ...vals) * 1.12,
      yMax: Math.max(bound, ...vals, 0.001) * 1.12,
      xLabel: "Elapsed circuit time (ms)",
      yLabel: ["Voltage (V)", "Current (mA)", "Energy (mJ)"][index],
      xUnit: "ms",
      yUnit: ["V", "mA", "mJ"][index],
      marker: m.ok ? { x: p.time * 1000, y: field === "voltage" ? m.voltage : field === "current" ? m.current * 1000 : m.energy * 1000 } : null,
      tau: tau * 1000,
    };
  });
  return { ...panels[p.kind === "RC" ? 0 : 1], panels };
}

/** Inspect drawn data only. It never fills an unacquired interval with an ideal future response. */
export function graphCursor(s, fraction, panelIndex = 0) {
  const graph = plot(s);
  const panel = graph.panels?.[panelIndex] || graph;
  const f = Number.isFinite(fraction) ? Math.max(0, Math.min(1, fraction)) : 0;
  if (graph.bars) {
    const bar = graph.bars[Math.min(graph.bars.length - 1, Math.floor(f * graph.bars.length))];
    return {
      x: null,
      xLabel: bar.name,
      readings: bar.missing ? [] : [{ name: bar.name, value: bar.value, unit: graph.yUnit, color: bar.color }],
      text: bar.missing ? `${bar.name}: circuit unavailable` : `${bar.name}: ${fmt(bar.value)} ${graph.yUnit}`,
      sourceMode: bar.sourceMode,
    };
  }
  const x = f * panel.xMax;
  const units = panel.yUnit || "V";
  const inspectedPanels = graph.panels || [panel];
  const readings = [];
  if (!(panel.acquiredMax !== undefined && x > panel.acquiredMax + 1e-8)) {
    for (const item of inspectedPanels)
      for (const trace of item.series || []) {
        const points = trace.points;
        if (!points.length || x < points[0][0] - 1e-8 || x > points.at(-1)[0] + 1e-8) continue;
        let next = points.findIndex(([time]) => time >= x);
        if (next < 0) next = points.length - 1;
        const [ax, ay] = points[Math.max(0, next - 1)],
          [bx, by] = points[next];
        const value = ax === bx ? by : ay + ((x - ax) / (bx - ax)) * (by - ay);
        readings.push({ name: trace.name, value, unit: trace.unit || item.yUnit || units, color: trace.color });
      }
  }
  const xLabel = `${fmt(x)} ${panel.xUnit || "ms"}`;
  return {
    x,
    xLabel,
    readings,
    text: readings.length
      ? `${xLabel} · ${readings.map((r) => `${r.name} ${fmt(r.value)} ${r.unit}`).join(" · ")}`
      : `${xLabel} · ${panel.acquiredMax !== undefined && x > panel.acquiredMax ? "not acquired; run the circuit" : "no trace at this point"}`,
  };
}

export function vrActions(s) {
  const p = parameters(s),
    actions = [];
  const add = (group, id, label, value = "") => actions.push({ group, id, label, value });
  const cycle = (name, label, value, group = "Settings") => {
    add(group, `cycle:${name}`, `${label} +`, value);
    add(group, `cycle:${name}:-1`, `${label} −`, value);
  };
  add("Guide", s.mode === "explore" ? "build" : "explore", s.mode === "explore" ? "Build circuit" : "Explore");
  add("Guide", "reset-circuit", "Clear circuit");
  add("Guide", "reset-experiment", "Reset experiment");
  for (const [tool, label] of [
    ["select", "Select"],
    ["wire", "Wire"],
    ["remove", "Remove"],
    ["red", "Meter V tip"],
    ["black", "Meter COM tip"],
  ])
    add("Bench", `tool:${tool}`, label, s.tool === tool ? "Selected" : "");
  add("Bench", "undo", "Undo");
  add("Bench", "cancel", "Cancel selection");
  add("Bench", "check-wiring", "Check wiring");
  if (s.module === "thevenin") {
    for (const value of ["original", "thevenin", "norton"])
      add(
        "Settings",
        `set:representation:${value}`,
        value === "thevenin" ? "Thévenin" : value === "norton" ? "Norton" : "Original",
        p.representation === value ? "Selected" : ""
      );
    cycle("load", "Load", `${p.load} Ω`);
    if (p.representation === "thevenin") cycle("equivalentVoltage", "Vth", `${p.equivalentVoltage} V`);
    if (p.representation === "norton") cycle("nortonCurrent", "In", `${p.nortonCurrent} mA`);
    if (p.representation !== "original") cycle("equivalentResistance", "Equivalent R", `${p.equivalentResistance} Ω`);
  }
  if (s.module === "superposition") {
    for (const [value, label] of [
      ["both", "Both sources"],
      ["a", "A alone"],
      ["b", "B alone"],
    ])
      add("Settings", `set:sourceMode:${value}`, label, p.sourceMode === value ? "Selected" : "");
    cycle("v1", "Source A", `+${p.v1} V`);
    cycle("v2", "Source B", `−${p.v2} V`);
    add("Settings", `set:replacement:${p.replacement === "short" ? "open" : "short"}`, "Inactive source", p.replacement);
  }
  if (s.module === "opamp") {
    add("Settings", `set:configuration:${p.configuration === "inverting" ? "noninverting" : "inverting"}`, "Configuration", p.configuration);
    cycle("rin", "Rin", `${p.rin / 1000} kΩ`);
    cycle("rf", "Rf", `${p.rf / 1000} kΩ`);
    cycle("amplitude", "Input", `${p.amplitude} Vpk`);
    cycle("rail", "Supply", `±${p.rail} V`);
    cycle("frequency", "Frequency", `${p.frequency} Hz`);
    for (const channel of ["ch1", "ch2"]) {
      add("Bench", `tool:${channel}`, `${channel.toUpperCase()} signal`, s.tool === channel ? "Selected" : "");
      add(
        "Bench",
        `scope-ground:${channel}`,
        `${channel.toUpperCase()} ground`,
        s.tool === "scopeGround" && p.scopeGroundChannel === channel ? "Selected" : ""
      );
      cycle(`${channel}Scale`, `${channel.toUpperCase()} scale`, `${p[`${channel}Scale`]} V/div`);
    }
    cycle("timeDiv", "Timebase", `${p.timeDiv} ms/div`);
    cycle("triggerLevel", "Trigger level", `${p.triggerLevel} V`);
    add("Settings", `set:triggerEdge:${p.triggerEdge === "rising" ? "falling" : "rising"}`, "Trigger edge", p.triggerEdge);
    add("Bench", "scope-toggle", p.scopeRunning ? "Hold scope" : "Run scope");
    add("Bench", "scope-autoscale", "Autoscale");
  }
  if (s.module === "transient") {
    add("Settings", `set:kind:${p.kind === "RC" ? "RL" : "RC"}`, "Circuit", p.kind);
    cycle("resistance", "Resistance", `${p.resistance} Ω`);
    cycle("speed", "Playback", `${p.speed}×`);
    add("Bench", "switch", "Switch", p.charging ? "Source" : "Return");
    add("Bench", "play", p.playing ? "Pause" : "Run");
    add("Bench", "one-tau", "Cursor at 1 τ");
    add("Bench", "five-tau", "Cursor at 5 τ");
    add("Bench", "reset-energy", "Zero energy");
    add("Bench", "replay", "Replay");
  }
  if (s.mode === "explore") add("Bench", "restore", "Connect reference");
  for (const [id, module] of Object.entries(MODULES))
    add("Labs", `module:${id}`, `Lab ${module.number}: ${module.name}`, s.module === id ? "Current" : "");
  return actions;
}
