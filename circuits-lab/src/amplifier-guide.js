import { netGroups } from "./modules.js";

export const configurationName = (id) =>
  ({
    inverting: "Inverting",
    noninverting: "Non-inverting",
    adder: "Adder",
    subtractor: "Subtractor",
  })[id] || id;
export function amplifierTheory(p) {
  const k = p.rf / p.rin;
  const multi = ["adder", "subtractor"].includes(p.configuration);
  const gain = p.configuration === "noninverting" ? 1 + k : p.configuration === "subtractor" ? k : -k;
  const equation =
    p.configuration === "inverting"
      ? "Vout = −(Rf/Rin) Vin"
      : p.configuration === "noninverting"
        ? "Vout = (1 + Rf/Rg) Vin"
        : p.configuration === "adder"
          ? "Vout = −(Rf/Rin) (Vin1 + Vin2)"
          : "Vout = (Rf/Rin) (Vin2 − Vin1)";
  const roles =
    p.configuration === "noninverting"
      ? "Rin is Rg, the feedback leg to GND."
      : p.configuration === "adder"
        ? "R1 = R2 = Rin. Both input resistors change together."
        : p.configuration === "subtractor"
          ? "R1 = R3 = Rin; R2 = R4 = Rf. Matched pairs change together."
          : "Rin feeds pin 2; Rf connects Vout back to pin 2.";
  return {
    k,
    gain,
    multi,
    equation,
    roles,
    reference: p.configuration === "adder" ? "Vin1 + Vin2" : p.configuration === "subtractor" ? "Vin2 − Vin1" : "Vin",
  };
}

/** Guidance follows real electrical nets and instrument contacts, never a click count. */
export function amplifierGuide(c, p) {
  const groups = netGroups(c.wires, c.circuit.pins);
  const expected = netGroups(c.circuit.wires, c.circuit.pins);
  const joined = (a, b) => a && b && groups[a] !== undefined && groups[a] === groups[b];
  const pinName = (id) => c.circuit.pins.find((pin) => pin.id === id)?.name || id;
  const extra = c.wires.find(([a, b]) => expected[a] !== expected[b]);
  if (extra)
    return {
      phase: "Build",
      text: `Remove the unexpected lead ${pinName(extra[0])} → ${pinName(extra[1])}.`,
      terminals: extra,
      action: null,
    };
  const missing = c.circuit.wires.find(([a, b]) => !joined(a, b));
  if (missing)
    return {
      phase: "Build",
      text: `Connect ${pinName(missing[0])} → ${pinName(missing[1])}.`,
      terminals: missing,
      action: { type: "wire", from: missing[0], to: missing[1] },
    };
  if (!c.settingsConfirmed)
    return {
      phase: "Adjust",
      text: "Review Rin, Rf, supply and input settings, then confirm them before placing the measurement probes.",
      terminals: [],
      action: { type: "adjust" },
    };
  for (const [channel, target, label] of [
    ["red", "out", "meter V tip"],
    ["black", "gnd", "meter COM tip"],
    ["ch1", "signal+", "CH1 signal tip"],
    ["ch1Ground", "gnd", "CH1 ground clip"],
    ["ch2", "out", "CH2 signal tip"],
    ["ch2Ground", "gnd", "CH2 ground clip"],
  ]) {
    const actual =
      channel === "red" || channel === "black"
        ? c.probes[channel]
        : c.scope[channel.startsWith("ch1") ? "ch1" : "ch2"][channel.endsWith("Ground") ? "ground" : "signal"];
    if (!joined(actual, target))
      return {
        phase: "Measure",
        text: `Place the ${label} at ${pinName(target)}.`,
        terminals: [target],
        action: { type: "probe", channel, target },
      };
  }
  return {
    phase: "Understand",
    text: "Compare measured response with theory. Increase input until clipping, then reduce it to recover.",
    terminals: [],
    action: null,
  };
}

export const WIRE_ROLES = {
  positive: ["+V supply", "#ad3730"],
  negative: ["−V supply", "#397eaa"],
  ground: ["GND / return", "#303635"],
  input: ["Input", "#b7992f"],
  feedback: ["Feedback", "#438264"],
  output: ["Output", "#ba6841"],
};
export function amplifierWireRole(a, b, circuit) {
  const expected = netGroups(circuit.wires, circuit.pins);
  if ([a, b].some((id) => ["vp", "plus+"].includes(id))) return "positive";
  if ([a, b].some((id) => ["vn", "minus-"].includes(id))) return "negative";
  if (expected[a] === expected.gnd && expected[b] === expected.gnd) return "ground";
  if ([a, b].some((id) => ["signal+", "signal2+", "rina", "rin2a"].includes(id))) return "input";
  if ([a, b].includes("rfb") || [a, b].includes("rfa")) return "feedback";
  if ([a, b].includes("out")) return "output";
  return "input";
}
