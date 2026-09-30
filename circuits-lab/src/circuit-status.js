import { context, measure, parameters, scope } from "./lab.js";
import { netGroups } from "./modules.js";

const status = (level, title, message, detail) => ({ level, title, message, ...(detail ? { detail } : {}) });

// The lab lazily creates context entries. Keep that initialization off the caller's state.
function readState(state) {
  return {
    ...state,
    wireSets: { ...state.wireSets },
    probeSets: { ...state.probeSets },
    scopeSets: { ...state.scopeSets },
  };
}

function sourceFault(state, circuit, joined) {
  const p = parameters(state);
  const sources =
    state.module === "opamp"
      ? [
          ["plus+", "plus-", p.rail, "+ supply"],
          ["minus+", "minus-", p.rail, "− supply"],
          ["signal+", "signal-", p.amplitude, "Signal source"],
        ]
      : state.module === "transient"
        ? [["s+", "s-", 5, "DC source"]]
        : circuit.electrical
            .filter((part) => part.type === "V")
            .map((part) => [part.a, part.b, part.value, part.id === "a" ? "Source A" : part.id === "b" ? "Source B" : "DC source"]);
  const shorted = sources.find(([a, b, value]) => value !== 0 && joined(a, b));
  if (shorted) return status("error", "Source shorted", `${shorted[3]} terminals are joined. Remove the short between + and −.`);
  return null;
}

function boundedCircuitFault(state, circuit, wires, joined) {
  const groups = netGroups(wires, circuit.pins);
  const check = (pairs, name, title, message) => {
    const missing = pairs.filter(([a, b]) => !joined(a, b));
    if (!missing.length) return null;
    // Connected-but-different arrangements can be physically valid (for example,
    // swapping the ends of Rf), even though these bounded models do not solve them.
    const isolated = missing.flat().some((pin) => Object.values(groups).filter((group) => group === groups[pin]).length === 1);
    return isolated
      ? status("error", title, message)
      : status("error", `${name} wiring differs`, "This model requires the selected circuit diagram. Check these leads.");
  };
  let fault;
  if (state.module === "opamp") {
    if (
      (fault = check(
        [
          ["plus+", "vp"],
          ["plus-", "gnd"],
        ],
        "+ supply",
        "+ supply disconnected",
        "Connect the + supply to V+ and common."
      ))
    )
      return fault;
    if (
      (fault = check(
        [
          ["minus-", "vn"],
          ["minus+", "gnd"],
        ],
        "− supply",
        "− supply disconnected",
        "Connect the − supply to V− and common."
      ))
    )
      return fault;
    if (
      (fault = check(
        [
          ["rfa", "op-"],
          ["rfb", "out"],
        ],
        "Feedback",
        "Feedback disconnected",
        "Complete the path through Rf from OUT to the − input."
      ))
    )
      return fault;
    if ((fault = check([["signal-", "gnd"]], "Signal common", "Signal common disconnected", "Connect the signal source return to common.")))
      return fault;
  } else {
    if (
      (fault = check(
        [
          ["s+", "supply"],
          ["s-", "gnd"],
        ],
        "Source",
        "Source disconnected",
        "Connect the DC source to the switch and common."
      ))
    )
      return fault;
    if ((fault = check([["return", "gnd"]], "Return", "Return path open", "Connect the switch Return contact to common."))) return fault;
    if ((fault = check([["common", "ra"]], "Switch", "Switch disconnected", "Connect the switch common to the resistor."))) return fault;
    if (
      (fault = check(
        [
          ["rb", "storagea"],
          ["storageb", "gnd"],
        ],
        "Storage",
        "Storage loop open",
        "Complete the path through the resistor and storage component."
      ))
    )
      return fault;
  }
  const expected = netGroups(circuit.wires, circuit.pins);
  const extra = wires.find(([a, b]) => expected[a] !== expected[b]);
  if (extra)
    return status(
      "error",
      "Unexpected connection",
      "A lead joins separate nodes in the selected schematic.",
      "Check that lead before running this circuit."
    );
  return status("error", "Circuit incomplete", "Check the remaining leads against the selected schematic.");
}

function dcFault(measurement, circuit, wires) {
  const error = measurement.error || "";
  if (/reference/i.test(error) && !wires.some((wire) => wire.includes("gnd")))
    return status("error", "Common disconnected", "Connect the circuit common to GND.");
  if (/inconsistent/i.test(error)) return status("error", "Source conflict", "Check source polarity, direct source joins and the return path.");
  if (/singular|floating/i.test(error)) {
    const loose = circuit.components.find((part) => part.type !== "ground" && part.pins.some((pin) => !wires.some((wire) => wire.includes(pin.id))));
    return status(
      "error",
      "Floating connection",
      "A part of the circuit has no defined voltage reference.",
      loose ? `Check the leads at ${loose.label} and the common return.` : "Check common returns and redundant source connections."
    );
  }
  return status("error", "Circuit cannot be solved", "Check the leads, source connections and component values.");
}

function scopeConnections(c, measurement, joined) {
  for (const id of ["ch1", "ch2"]) {
    const { signal, ground } = c.scope[id],
      label = id.toUpperCase();
    if (!signal && !ground) return status("warning", `${label} not connected`, `Place the ${label} signal tip and connect its ground to GND.`);
    if (!signal) return status("warning", `${label} tip disconnected`, `Place the ${label} signal tip on a circuit contact.`);
    if (!ground) return status("warning", `${label} ground disconnected`, `Connect the ${label} ground clip to GND.`);
    if (!joined(ground, "gnd")) return status("warning", `${label} ground misplaced`, `Move the ${label} ground clip to GND.`);
    if (!Number.isFinite(measurement.voltages[signal]))
      return status("warning", `${label} signal unavailable`, `Place the ${label} tip on a connected circuit contact.`);
  }
  return null;
}

function acquisitionStatus(acquisition) {
  if (acquisition.stale) return status("warning", "Held trace is old", "Press Run on the scope to measure the current circuit.");
  if (acquisition.timebaseTooWide) return status("warning", "Timebase too wide", "Reduce ms/div or use Auto to show the signal.");
  if (acquisition.trigger && !acquisition.trigger.found)
    return status("warning", "No trigger crossing", "Set the trigger level within the CH1 signal and check its edge.");
  const cropped = Object.entries(acquisition.channels || {})
    .filter(([, channel]) => channel.cropped)
    .map(([id]) => id.toUpperCase());
  if (cropped.length)
    return status(
      "warning",
      "Trace outside screen",
      `Increase ${cropped.join(" and ")} V/div or use Auto.`,
      "The display scale is too small; this alone does not mean clipping."
    );
  if (/complete period/i.test(acquisition.error || "")) return status("info", "Short time window", "Increase ms/div to see a full cycle.");
  if (acquisition.error) return status("warning", "Check scope settings", acquisition.error);
  if (acquisition.running === false) return status("info", "Scope on Hold", "The trace is frozen. Press Run to resume acquisition.");
  return null;
}

/** Read-only status for the current circuit. Pass render-time measurements to reuse existing solves. */
export function circuitStatus(state, { measurement, acquisition, meterMode = "vdc" } = {}) {
  const s = readState(state),
    c = context(s),
    p = parameters(s);
  const groups = netGroups(c.wires, c.circuit.pins);
  const joined = (a, b) => groups[a] !== undefined && groups[b] !== undefined && groups[a] === groups[b];
  if (!c.wires.length) return status("info", "Wire the circuit", "Connect the components with patch leads.", "Check the circuit diagram.");
  const shorted = sourceFault(s, c.circuit, joined);
  if (shorted) return shorted;
  const m = measurement || measure(s);
  if (!m.ok) return ["opamp", "transient"].includes(s.module) ? boundedCircuitFault(s, c.circuit, c.wires, joined) : dcFault(m, c.circuit, c.wires);

  if (s.module === "opamp") {
    const connection = scopeConnections(c, m, joined);
    if (connection) return connection;
    const sc = acquisition || scope(s),
      scopeStatus = acquisitionStatus(sc);
    if (scopeStatus) return scopeStatus;
    if (m.clipped)
      return status(
        "warning",
        "Output clipping",
        "The output has reached its supply limit.",
        "Reduce input amplitude to return to a clean waveform."
      );
  }
  if (s.module === "superposition" && p.replacement === "open")
    return status(
      "warning",
      p.sourceMode === "both" ? "Comparison uses Open" : "Inactive source set to Open",
      "Open changes the network. The separate contributions may not add.",
      "Use Short to deactivate an ideal voltage source."
    );
  if (meterMode === "off") return status("info", "Meter is off", "Turn the meter dial to V to read the voltage.");
  if (!m.probeReady) {
    const { red, black } = c.probes;
    if (!red && !black) return status("info", "Meter not connected", "Place both meter tips on circuit contacts to measure voltage.");
    if (!red || !black)
      return status("info", `${!red ? "Red" : "Black"} meter tip disconnected`, `Place the ${!red ? "red" : "black"} tip on a circuit contact.`);
    return status("warning", "Meter contact unavailable", "Move the meter tips onto connected circuit contacts.");
  }
  if (s.module === "transient") {
    if (p.playing) return status("ok", "Transient running", "Voltage, current and energy are being acquired.");
    if (!(p.acquiredTime > 0)) return status("info", "Ready to run", "Press Run to acquire the switching response.");
    if (p.time < p.acquiredTime) return status("info", "Reviewing recorded time", "The cursor is inside the acquired trace. Press Run to continue.");
    if (p.time >= 5 * m.tau) return status("ok", "Run complete", "Five time constants acquired. Replay or switch to observe the next response.");
    return status("info", "Transient paused", "Press Run to continue, or move the time cursor through the acquired trace.");
  }
  return status(
    "ok",
    "Circuit connected",
    s.module === "opamp" ? "The scope is acquiring the connected signals." : "Readings follow the current leads and component settings."
  );
}
