/**
 * The experiment: what the student has set, what they have wired, and what the
 * instruments consequently read.
 *
 * Readings are taken from the node a probe is actually sitting on. Put the scope
 * on the summing junction and it shows the virtual ground; put it on the wrong
 * node and it shows that node. Nothing is routed to an instrument because the
 * instrument is "supposed" to display it.
 */

import { CONFIGURATIONS, transfer, limitFor, respond } from "../model/amplifier.js";
import { sample } from "../model/signal.js";
import { summarize, measureGain, meterReading, compareWithTheory } from "../model/measure.js";
import { TOPOLOGY, PROBES, verify, nets } from "./circuit.js";
import { guidance } from "./guide.js";

export const DEFAULTS = Object.freeze({
  configuration: "inverting",
  rail: 12,
  powered: false,
  resistors: { rin: 10000, rf: 20000, rin2: 10000, rf2: 20000 },
  sources: [
    { waveform: "sine", amplitude: 1, frequency: 1000 },
    { waveform: "sine", amplitude: 0.6, frequency: 1000 },
  ],
  meterMode: "dc",
});

export const RESISTOR_RANGE = Object.freeze({ min: 1000, max: 100000 });
export const AMPLITUDE_RANGE = Object.freeze({ min: 0, max: 10 });
export const FREQUENCY_RANGE = Object.freeze({ min: 10, max: 100000 });

const clamp = (value, { min, max }) => Math.min(max, Math.max(min, value));

export function createExperiment() {
  return {
    ...structuredClone(DEFAULTS),
    leads: [],
    probes: Object.fromEntries(Object.keys(PROBES).map((id) => [id, null])),
    history: [],
  };
}

const snapshot = (state) => structuredClone({ ...state, history: undefined });

function remember(state) {
  state.history.push(snapshot(state));
  if (state.history.length > 60) state.history.shift();
}

export function undo(state) {
  const previous = state.history.pop();
  if (!previous) return false;
  Object.assign(state, previous, { history: state.history });
  return true;
}

// ---- settings -------------------------------------------------------------

export function setConfiguration(state, configuration) {
  if (!CONFIGURATIONS[configuration] || configuration === state.configuration) return false;
  remember(state);
  state.configuration = configuration;
  // A different circuit is a different set of nodes; its leads do not carry over.
  state.leads = [];
  for (const id of Object.keys(state.probes)) state.probes[id] = null;
  return true;
}

export function setResistor(state, id, ohms) {
  if (!(id in state.resistors) || !Number.isFinite(ohms)) return false;
  const value = clamp(ohms, RESISTOR_RANGE);
  if (value === state.resistors[id]) return false;
  remember(state);
  state.resistors[id] = value;
  return true;
}

export function setRail(state, rail) {
  if (![8, 12, 15].includes(rail) || rail === state.rail) return false;
  remember(state);
  state.rail = rail;
  return true;
}

export function setPower(state, on) {
  if (state.powered === !!on) return false;
  remember(state);
  state.powered = !!on;
  return true;
}

export function setSource(state, index, patch) {
  const source = state.sources[index];
  if (!source) return false;
  const next = { ...source, ...patch };
  if (Number.isFinite(next.amplitude)) {
    next.amplitude = next.waveform === "dc" ? clamp(next.amplitude, { min: -10, max: 10 }) : clamp(Math.abs(next.amplitude), AMPLITUDE_RANGE);
  }
  if (Number.isFinite(next.frequency)) next.frequency = clamp(next.frequency, FREQUENCY_RANGE);
  if (JSON.stringify(next) === JSON.stringify(source)) return false;
  remember(state);
  state.sources[index] = next;
  return true;
}

export function setMeterMode(state, mode) {
  if (!["dc", "ac"].includes(mode) || mode === state.meterMode) return false;
  remember(state);
  state.meterMode = mode;
  return true;
}

// ---- wiring ---------------------------------------------------------------

export function connect(state, from, to, route = null) {
  if (!from || !to || from === to) return false;
  const duplicate = state.leads.some((lead) => (lead.from === from && lead.to === to) || (lead.from === to && lead.to === from));
  if (duplicate) return false;
  remember(state);
  state.leads.push({ from, to, route, held: false });
  return true;
}

/**
 * Let go of a plug away from any socket. The lead stays on the bench with a free
 * end rather than vanishing or springing back — the design system forbids both.
 */
export function dropLeadEnd(state, index, end, point) {
  const lead = state.leads[index];
  if (!lead || ![0, 1].includes(end)) return false;
  remember(state);
  if (end === 0) lead.from = null;
  else lead.to = null;
  lead.freeEnd = point ? [...point] : null;
  lead.held = false;
  // A lead with neither end connected is just wire on the bench; clear it.
  if (!lead.from && !lead.to) state.leads.splice(index, 1);
  return true;
}

export function removeLead(state, index) {
  if (!state.leads[index]) return false;
  remember(state);
  state.leads.splice(index, 1);
  return true;
}

/** Reshaping a lead changes its geometry only; the circuit is untouched. */
export function reshapeLead(state, index, route) {
  const lead = state.leads[index];
  if (!lead || !Array.isArray(route) || route.length < 2) return false;
  remember(state);
  lead.route = route;
  return true;
}

export function placeProbe(state, probe, terminal, route = null) {
  if (!(probe in state.probes)) return false;
  if (state.probes[probe] === terminal) return false;
  remember(state);
  state.probes[probe] = terminal;
  state.leads = state.leads.filter((lead) => lead.probe !== probe);
  if (terminal) state.leads.push({ from: probe, to: terminal, route, held: false, probe });
  return true;
}

export function reset(state) {
  remember(state);
  Object.assign(state, structuredClone(DEFAULTS), {
    leads: [],
    probes: Object.fromEntries(Object.keys(PROBES).map((id) => [id, null])),
    history: state.history,
  });
  return true;
}

// ---- what the instruments read -------------------------------------------

/**
 * The voltage on each node at one instant.
 *
 * An ideal op-amp with negative feedback holds its inputs equal, so the summing
 * junction sits at whatever +IN sits at — zero for the inverting and summing
 * circuits, Vin for the non-inverting one. A student who probes there sees the
 * virtual ground rather than a number this model made up.
 */
function nodeVoltagesAt(state, coefficients, t) {
  const v1 = sample(state.sources[0], t);
  const v2 = coefficients.inputs === 2 ? sample(state.sources[1], t) : 0;
  const limit = limitFor(state.rail);
  const ideal = coefficients.vin1 * v1 + coefficients.vin2 * v2;
  const out = state.powered ? Math.max(-limit, Math.min(limit, ideal)) : 0;
  const { rin2, rf2 } = state.resistors;
  const divider = (v2 * rf2) / (rin2 + rf2);
  const plus = state.configuration === "noninverting" ? v1 : state.configuration === "subtractor" ? divider : 0;
  return {
    vplus: state.powered ? state.rail : 0,
    vminus: state.powered ? -state.rail : 0,
    gnd: 0,
    in: v1,
    in1: v1,
    in2: v2,
    sum: state.powered ? plus : 0,
    plus: state.powered ? plus : 0,
    out,
  };
}

/** Which node a probe is on, or null if it is not connected to the circuit. */
function probeNodes(state) {
  const { find } = nets(state.leads);
  const nodes = TOPOLOGY[state.configuration];
  const out = {};
  for (const [probe, terminal] of Object.entries(state.probes)) {
    if (!terminal) {
      out[probe] = null;
      continue;
    }
    const root = find(terminal);
    out[probe] = nodes.find((node) => node.terminals.some((t) => find(t) === root))?.id ?? null;
  }
  return out;
}

/**
 * One acquisition: a whole number of input cycles, so every RMS figure is exact
 * rather than dependent on where the capture happened to stop.
 */
export function readings(state, { cycles = 4, points = 1024 } = {}) {
  const coefficients = transfer({ configuration: state.configuration, ...state.resistors });
  const check = verify(state.configuration, state.leads);
  const nodes = probeNodes(state);
  const source = state.sources[0];
  const span = source.waveform === "dc" ? 1 : cycles / source.frequency;
  const times = Array.from({ length: points }, (_, i) => (i / points) * span);

  const response = respond({
    configuration: state.configuration,
    resistors: state.resistors,
    sources: state.sources,
    rail: state.rail,
    powered: state.powered,
    times,
  });

  // Each probe records the node it is on, not the signal it is "meant" to show.
  const traces = {};
  for (const [probe, node] of Object.entries(nodes)) {
    if (!node) {
      traces[probe] = null;
      continue;
    }
    const buffer = new Float64Array(points);
    for (let i = 0; i < points; i += 1) buffer[i] = nodeVoltagesAt(state, coefficients, times[i])[node] ?? 0;
    traces[probe] = buffer;
  }

  // The meter reads the difference between its two tips.
  const meterConnected = !!state.probes["meter.v"] && !!state.probes["meter.com"];
  let meterSamples = null;
  if (meterConnected && traces["meter.v"] && traces["meter.com"]) {
    meterSamples = new Float64Array(points);
    for (let i = 0; i < points; i += 1) meterSamples[i] = traces["meter.v"][i] - traces["meter.com"][i];
  }
  const meter = meterReading({ samples: meterSamples, mode: state.meterMode, connected: meterConnected, powered: state.powered });

  const scopeReady = !!traces["scope.ch1"] && !!traces["scope.ch2"];
  const measured = measureGain({
    reference: scopeReady ? traces["scope.ch1"] : null,
    output: scopeReady ? traces["scope.ch2"] : null,
    dc: source.waveform === "dc",
    clipped: response.clipped,
    complete: check.complete && scopeReady,
    powered: state.powered,
  });

  const theoretical = coefficients.inputs === 2 ? null : coefficients.vin1;
  return {
    coefficients,
    limit: response.limit,
    clipped: response.clipped,
    times,
    traces,
    nodes,
    meter,
    measured,
    theory: {
      value: theoretical,
      formula: coefficients.formula,
      agreement: theoretical === null ? null : compareWithTheory({ measured, theoretical }),
    },
    scope: {
      ch1: traces["scope.ch1"] ? summarize(traces["scope.ch1"]) : null,
      ch2: traces["scope.ch2"] ? summarize(traces["scope.ch2"]) : null,
    },
    check,
    guidance: guidance(state),
  };
}
