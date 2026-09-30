/**
 * Bounded, ideal teaching models for Circuits I.
 * SI units throughout: V, A, ohm, F, H, s, W and J.
 * These models omit parasitics, component tolerances and instrument loading.
 */

const finite = (value, name) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number.`);
  }
  return value;
};

const positive = (value, name) => {
  finite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be greater than zero.`);
  return value;
};

const nonnegative = (value, name) => {
  finite(value, name);
  if (value < 0) throw new RangeError(`${name} cannot be negative.`);
  return value;
};

const cleanZero = (value) => (Object.is(value, -0) ? 0 : value);

/** Row-scaled Gaussian elimination, with rank/consistency diagnostics. */
function solveLinear(matrix, rhs) {
  const n = rhs.length;
  if (!n) return [];
  const rows = matrix.map((row, i) => {
    const scale = Math.max(...row.map(Math.abs));
    return scale ? [...row.map((value) => value / scale), rhs[i] / scale] : [...row, rhs[i]];
  });
  const tolerance = 1e-12;
  let rank = 0;
  const pivots = [];
  for (let column = 0; column < n && rank < n; column += 1) {
    let pivot = rank;
    for (let row = rank + 1; row < n; row += 1) {
      if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column])) pivot = row;
    }
    if (Math.abs(rows[pivot][column]) <= tolerance) continue;
    [rows[rank], rows[pivot]] = [rows[pivot], rows[rank]];
    const divisor = rows[rank][column];
    for (let j = column; j <= n; j += 1) rows[rank][j] /= divisor;
    for (let row = rank + 1; row < n; row += 1) {
      const multiplier = rows[row][column];
      for (let j = column; j <= n; j += 1) rows[row][j] -= multiplier * rows[rank][j];
      rows[row][column] = 0;
    }
    pivots.push(column);
    rank += 1;
  }
  for (let row = rank; row < n; row += 1) {
    if (rows[row].slice(0, n).every((value) => Math.abs(value) <= tolerance) && Math.abs(rows[row][n]) > 1e-9) {
      throw new Error(
        "Inconsistent circuit: check for a shorted voltage source, conflicting ideal voltage sources, or a current source without a return path."
      );
    }
  }
  if (rank < n) {
    throw new Error(
      "Singular circuit: connect floating nodes to a reference and remove redundant ideal voltage sources. Voltages or source currents are not uniquely determined."
    );
  }
  const result = Array(n).fill(0);
  for (let row = n - 1; row >= 0; row -= 1) {
    const column = pivots[row];
    result[column] = rows[row][n];
    for (let j = column + 1; j < n; j += 1) result[column] -= rows[row][j] * result[j];
  }
  if (result.some((value) => !Number.isFinite(value))) {
    throw new Error("Numerical failure: check component values and circuit connections.");
  }
  // Reject unstable results instead of returning plausible-looking measurements.
  for (let row = 0; row < n; row += 1) {
    const calculated = matrix[row].reduce((sum, value, j) => sum + value * result[j], 0);
    const scale = Math.abs(rhs[row]) + matrix[row].reduce((sum, value, j) => sum + Math.abs(value * result[j]), 0);
    if (Math.abs(calculated - rhs[row]) > 1e-8 * Math.max(scale, 1e-12)) {
      throw new Error("Numerically unstable circuit: use a well-conditioned network with a valid reference.");
    }
  }
  return result;
}

/**
 * DC modified nodal analysis. Wires merge arbitrary pin names; 'gnd' is 0 V.
 * Voltage source: V(a)-V(b)=value. Current source and all reported currents: a→b.
 * A zero-ohm connection belongs in wires; resistor values must be positive.
 * Invalid/indeterminate circuits return ok:false and no fabricated measurements.
 */
export function solveDC({ components = [], wires = [] } = {}) {
  try {
    if (!Array.isArray(components) || !components.length) throw new Error("Add at least one component to the circuit.");
    if (!Array.isArray(wires)) throw new Error("Wires must be an array of pin pairs.");
    const parents = new Map([["gnd", "gnd"]]);
    const pin = (value) => {
      if (typeof value !== "string" || !value.length) throw new Error("Every terminal must have a nonempty string pin name.");
      if (!parents.has(value)) parents.set(value, value);
      return value;
    };
    const find = (value) => {
      let root = value;
      while (parents.get(root) !== root) root = parents.get(root);
      while (parents.get(value) !== value) {
        const next = parents.get(value);
        parents.set(value, root);
        value = next;
      }
      return root;
    };
    const ids = new Set();
    let hasReference = false;
    for (const component of components) {
      if (!component || typeof component.id !== "string" || !component.id.length || ids.has(component.id)) {
        throw new Error("Each component requires a unique, nonempty id.");
      }
      ids.add(component.id);
      if (!["R", "V", "I"].includes(component.type)) throw new Error(`Unsupported component type: ${component.type}.`);
      pin(component.a);
      pin(component.b);
      hasReference ||= component.a === "gnd" || component.b === "gnd";
      finite(component.value, `${component.id} value`);
      if (component.type === "R") positive(component.value, `${component.id} resistance`);
    }
    for (const wire of wires) {
      if (!Array.isArray(wire) || wire.length !== 2) throw new Error("Each wire must contain exactly two pin names.");
      const a = pin(wire[0]);
      const b = pin(wire[1]);
      hasReference ||= a === "gnd" || b === "gnd";
      parents.set(find(a), find(b));
    }
    if (!hasReference) throw new Error("Missing reference: connect the circuit common node to 'gnd'.");
    const ground = find("gnd");
    const roots = [...new Set([...parents.keys()].map(find))].filter((root) => root !== ground);
    const nodeIndex = new Map(roots.map((root, index) => [root, index]));
    const node = (name) => nodeIndex.get(find(name));
    const sources = components.filter((component) => component.type === "V");
    const sourceIndex = new Map(sources.map((source, i) => [source.id, roots.length + i]));
    const size = roots.length + sources.length;
    const matrix = Array.from({ length: size }, () => Array(size).fill(0));
    const rhs = Array(size).fill(0);
    const add = (row, column, value) => {
      if (row !== undefined && column !== undefined) matrix[row][column] += value;
    };
    for (const component of components) {
      const a = node(component.a);
      const b = node(component.b);
      if (component.type === "R") {
        const conductance = 1 / component.value;
        if (!Number.isFinite(conductance)) throw new Error("Resistance is outside the supported numerical range.");
        add(a, a, conductance);
        add(b, b, conductance);
        add(a, b, -conductance);
        add(b, a, -conductance);
      } else if (component.type === "I") {
        if (a !== undefined) rhs[a] -= component.value;
        if (b !== undefined) rhs[b] += component.value;
      } else {
        const index = sourceIndex.get(component.id);
        add(a, index, 1);
        add(b, index, -1);
        add(index, a, 1);
        add(index, b, -1);
        rhs[index] = component.value;
      }
    }
    const solution = solveLinear(matrix, rhs);
    const voltageAt = (name) => (find(name) === ground ? 0 : cleanZero(solution[node(name)]));
    const voltages = Object.fromEntries([...parents.keys()].map((name) => [name, voltageAt(name)]));
    const currents = Object.fromEntries(
      components.map((component) => [
        component.id,
        cleanZero(
          component.type === "R"
            ? (voltageAt(component.a) - voltageAt(component.b)) / component.value
            : component.type === "I"
              ? component.value
              : solution[sourceIndex.get(component.id)]
        ),
      ])
    );
    return { ok: true, voltages, currents, error: null };
  } catch (error) {
    return { ok: false, voltages: {}, currents: {}, error: error.message };
  }
}

/** 12 V → R1 → load node; R2 and load each connect that node to ground. */
export function thevenin({
  source = 12,
  r1 = 1000,
  r2 = 1000,
  load = 500,
  representation = "original",
  equivalentVoltage = 6,
  equivalentResistance = 500,
  nortonCurrent = 0.012,
} = {}) {
  finite(source, "Source voltage");
  positive(r1, "R1");
  positive(r2, "R2");
  if (load !== Infinity) nonnegative(load, "Load resistance");
  finite(equivalentVoltage, "Equivalent voltage");
  positive(equivalentResistance, "Equivalent resistance");
  finite(nortonCurrent, "Norton current");
  const vth = (source * r2) / (r1 + r2);
  const rth = (r1 * r2) / (r1 + r2);
  const inorton = vth / rth;
  let voltageSource;
  let resistance;
  if (representation === "original") {
    voltageSource = vth;
    resistance = rth;
  } else if (representation === "thevenin") {
    voltageSource = equivalentVoltage;
    resistance = equivalentResistance;
  } else if (representation === "norton") {
    voltageSource = nortonCurrent * equivalentResistance;
    resistance = equivalentResistance;
  } else {
    throw new RangeError("Representation must be original, thevenin, or norton.");
  }
  const voltage = load === Infinity ? voltageSource : (voltageSource * load) / (resistance + load);
  const current = load === Infinity ? 0 : voltageSource / (resistance + load);
  return { voltage, current, power: voltage * current, vth, rth, inorton, pmax: (vth * vth) / (4 * rth) };
}

/**
 * +v1 → R1 → node; -v2 → R2 → node; R3 from node to ground.
 * Positive branch current flows from the node through R3 to ground.
 * Deactivating an ideal voltage source replaces it with a short circuit.
 * contribution1/2 are signed current contributions (A), never powers.
 */
export function superposition({ v1 = 6, v2 = 6, r1 = 1000, r2 = 1000, r3 = 1000, sourceMode = "both" } = {}) {
  finite(v1, "Source 1");
  finite(v2, "Source 2");
  positive(r1, "R1");
  positive(r2, "R2");
  positive(r3, "R3");
  if (!["both", "source1", "source2", "none"].includes(sourceMode)) {
    throw new RangeError("Source mode must be both, source1, source2, or none.");
  }
  const conductance = 1 / r1 + 1 / r2 + 1 / r3;
  const contributionVoltage1 = v1 / r1 / conductance;
  const contributionVoltage2 = -v2 / r2 / conductance;
  const voltage =
    (sourceMode === "both" || sourceMode === "source1" ? contributionVoltage1 : 0) +
    (sourceMode === "both" || sourceMode === "source2" ? contributionVoltage2 : 0);
  return {
    voltage: cleanZero(voltage),
    current: cleanZero(voltage / r3),
    contribution1: contributionVoltage1 / r3,
    contribution2: contributionVoltage2 / r3,
    contributionVoltage1,
    contributionVoltage2,
    power: (voltage * voltage) / r3,
  };
}

/**
 * Ideal sine-driven amplifier with symmetric supply/output limits.
 * Omits bandwidth, slew rate, input common-mode limits, offsets and load limits.
 * gain is the nominal closed-loop gain, even when feedback is disconnected.
 * Missing feedback uses an ideal zero-offset comparator approximation.
 */
export function opamp({
  configuration = "inverting",
  rin = 10000,
  rf = 20000,
  amplitude = 1,
  rail = 12,
  headroom = 1,
  frequency = 100,
  time = 0,
  powered = true,
  feedback = true,
} = {}) {
  positive(rin, "Input resistance");
  nonnegative(rf, "Feedback resistance");
  nonnegative(amplitude, "Input amplitude");
  nonnegative(rail, "Supply rail magnitude");
  nonnegative(headroom, "Output headroom");
  positive(frequency, "Frequency");
  nonnegative(time, "Time");
  let gain;
  if (configuration === "inverting") gain = -rf / rin;
  else if (configuration === "noninverting" || configuration === "non-inverting") gain = 1 + rf / rin;
  else if (configuration === "follower") gain = 1;
  else throw new RangeError("Configuration must be inverting, noninverting, or follower.");
  const input = amplitude * Math.sin(2 * Math.PI * frequency * time);
  const limit = Math.max(0, rail - headroom);
  const desiredPeak = Math.abs(gain) * amplitude;
  const direction = configuration === "inverting" ? -1 : 1;
  let output = 0;
  let peakOutput = 0;
  let clipped = false;
  let modelState = "powered-off";
  if (powered && limit > 0) {
    if (feedback) {
      output = Math.max(-limit, Math.min(limit, gain * input));
      peakOutput = Math.min(limit, desiredPeak);
      clipped = desiredPeak > limit;
      modelState = clipped ? "saturated" : "linear";
    } else {
      output = Math.sign(direction * input) * limit;
      peakOutput = amplitude > 0 ? limit : 0;
      clipped = amplitude > 0;
      modelState = "open-loop";
    }
  }
  return {
    gain,
    input,
    output: cleanZero(output),
    limit,
    maxInput: feedback ? (gain === 0 ? Infinity : limit / Math.abs(gain)) : 0,
    clipped,
    peakOutput,
    modelState,
  };
}

/**
 * First-order series RC/RL response, with a closed resistive discharge path.
 * voltage/current use the storage element's passive sign convention.
 * initial/storageValue/final: capacitor volts for RC, inductor amps for RL.
 * Resistance is the effective resistance seen by the storage element.
 */
export function transient({
  kind = "RC",
  resistance = 1000,
  capacitance = 0.0001,
  inductance = 0.1,
  source = 5,
  time = 0,
  initial = 0,
  charging = true,
} = {}) {
  positive(resistance, "Resistance");
  finite(source, "Source voltage");
  finite(initial, "Initial storage value");
  nonnegative(time, "Time");
  if (!["RC", "RL"].includes(kind)) throw new RangeError("Transient kind must be RC or RL.");
  const drivenVoltage = charging ? source : 0;
  const storage = kind === "RC" ? positive(capacitance, "Capacitance") : positive(inductance, "Inductance");
  const tau = kind === "RC" ? resistance * storage : storage / resistance;
  positive(tau, "Time constant");
  const final = kind === "RC" ? drivenVoltage : drivenVoltage / resistance;
  const storageValue = final + (initial - final) * Math.exp(-time / tau);
  const voltage = kind === "RC" ? storageValue : drivenVoltage - resistance * storageValue;
  const current = kind === "RC" ? (drivenVoltage - storageValue) / resistance : storageValue;
  return { tau, voltage: cleanZero(voltage), current: cleanZero(current), energy: 0.5 * storage * storageValue * storageValue, final, storageValue };
}
