/**
 * Guided mode: the single next thing to do.
 *
 * The engineer's brief asks for this twice — "a guided mode that highlights the
 * next connection or measurement required by the laboratory procedure" — and the
 * design system fixes its hardest rule: at most ONE highlight exists at any moment.
 * The moment two things pulse, the student has to choose, and guidance has failed.
 *
 * So this returns exactly one `next`, never a list. Everything else it reports is
 * status, not instruction.
 */

import { TERMINALS, PROBES, verify } from "./circuit.js";
import { CONFIGURATIONS } from "../model/amplifier.js";

/** Nishar's sequence. The panel shows where the student is in it. */
export const PHASES = Object.freeze([
  { id: "select", name: "Select", blurb: "Identify the device and choose a configuration." },
  { id: "build", name: "Build", blurb: "Connect the circuit." },
  { id: "adjust", name: "Adjust", blurb: "Set the component values and the input." },
  { id: "measure", name: "Measure", blurb: "Place the probes and switch on." },
  { id: "understand", name: "Understand", blurb: "Compare the measurement with theory." },
]);

/** The probes the experiment needs, and the node each belongs on. */
const PROBE_PLAN = [
  { probe: "scope.ch1", node: "in", alt: "in1", why: "to see Vin" },
  { probe: "scope.ch1gnd", node: "gnd", why: "to reference CH1" },
  { probe: "scope.ch2", node: "out", why: "to see Vout beside Vin" },
  { probe: "scope.ch2gnd", node: "gnd", why: "to reference CH2" },
  { probe: "meter.v", node: "out", why: "to measure Vout" },
  { probe: "meter.com", node: "gnd", why: "to reference the meter" },
];

const name = (id) => TERMINALS[id]?.label ?? PROBES[id]?.label ?? id;
const where = (id) => {
  const instrument = TERMINALS[id]?.instrument ?? PROBES[id]?.instrument;
  return { supply: "the supply", generator: "the generator", u1: "the 741", board: "the board" }[instrument] ?? instrument;
};

/** A human sentence for one connection, naming both ends the way the panel does. */
const connectText = (from, to) => `Connect ${name(from)} on ${where(from)} to ${name(to)} on ${where(to)}.`;

/**
 * The four numbered control groups, exactly as the brief orders them, each with
 * the settings it currently holds.
 */
export function groups(state) {
  const spec = CONFIGURATIONS[state.configuration];
  const resistors = spec.resistors.map((r) => `${r.name} ${(state.resistors[r.id] / 1000).toFixed(1)} kΩ`).join(" · ");
  const signal =
    state.sources[0].waveform === "dc"
      ? `${state.sources[0].amplitude.toFixed(2)} V DC`
      : `${state.sources[0].amplitude.toFixed(2)} Vpp · ${(state.sources[0].frequency / 1000).toFixed(2)} kHz · ${state.sources[0].waveform}`;
  return [
    { n: 1, id: "power", title: "Power supply", summary: `±${state.rail} V · ${state.powered ? "on" : "off"}`, done: state.powered },
    { n: 2, id: "opamp", title: "Operational amplifier", summary: `741 · ${spec.name.toLowerCase()}`, done: true },
    { n: 3, id: "components", title: "Component controls", summary: resistors, done: true },
    { n: 4, id: "input", title: "Input signal", summary: signal, done: true },
  ];
}

/**
 * The one next action.
 *
 * Priority is deliberate. A short is a fault and outranks everything, because
 * carrying on wiring a shorted circuit teaches nothing. Then the circuit is
 * finished, then powered, then measured, then understood.
 */
export function nextAction(state) {
  const check = verify(state.configuration, state.leads);

  if (check.shorts.length) {
    const [short] = check.shorts;
    return {
      phase: "build",
      kind: "fix",
      text: `${short.names[0]} and ${short.names[1]} are joined. Remove the lead between them.`,
      highlight: [],
      fault: true,
    };
  }

  if (check.missing.length) {
    const node = check.missing[0];
    // Wire out from the board's own terminal once it is joined, otherwise from
    // whatever was joined most recently, so the instruction reads as the next
    // short hop rather than a long reach back to the instrument.
    const joined = node.terminals.filter((t) => !node.unreachedAll.includes(t));
    const from = joined.find((t) => t.startsWith("board.")) ?? joined.at(-1) ?? node.terminals[0];
    const target = node.nextHop;
    return {
      phase: "build",
      kind: "connect",
      text: connectText(from, target),
      highlight: [from, target],
      node: node.id,
    };
  }

  if (!state.powered) {
    return { phase: "measure", kind: "power", text: `Switch the supply on at ±${state.rail} V.`, highlight: ["supply.power"] };
  }

  for (const step of PROBE_PLAN) {
    if (state.probes[step.probe]) continue;
    const node = check.find ? step.node : step.node;
    return {
      phase: "measure",
      kind: "probe",
      text: `Place ${name(step.probe)} on the ${node === "gnd" ? "common" : node} node ${step.why}.`,
      highlight: [step.probe],
      probe: step.probe,
    };
  }

  return {
    phase: "understand",
    kind: "compare",
    text: "Compare the measured gain with the theoretical value, and explain any difference.",
    highlight: [],
  };
}

/** Where the student is in the five-step sequence. */
export function phaseOf(state) {
  const action = nextAction(state);
  const index = PHASES.findIndex((p) => p.id === action.phase);
  return { ...PHASES[index], index, step: index + 1, of: PHASES.length };
}

/** Everything the guidance panel renders, in one call. */
export function guidance(state) {
  const check = verify(state.configuration, state.leads);
  const action = nextAction(state);
  const phase = phaseOf(state);
  return {
    phase,
    groups: groups(state).map((group) => ({
      ...group,
      state: group.id === "power" && !state.powered && phase.id !== "measure" ? "todo" : group.done ? "done" : "todo",
    })),
    next: action,
    complete: check.complete,
    missing: check.missing,
    shorts: check.shorts,
  };
}
