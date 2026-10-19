/**
 * What is wired to what.
 *
 * A circuit is described as the set of NODES it should have — groups of terminals
 * that belong to the same electrical point — rather than as a list of wire pairs.
 * That is how a circuit actually works, and it means a student may run Rin's lead
 * to pin 2 or pin 2's lead to Rin, use the board's ground rail or go straight to
 * the supply, and all of it is correct, because all of it lands on the same node.
 *
 * Checking is therefore two questions, and they have different answers:
 *   - is every node fully joined up?        -> what is still MISSING
 *   - have two different nodes been joined? -> what is SHORTED
 * A missing lead is an unfinished circuit. A short is a wrong one, and the bench
 * must say which, because they need different fixes.
 */

export const TERMINALS = Object.freeze({
  "supply.pos": { instrument: "supply", label: "+V", role: "supplyPos" },
  "supply.gnd": { instrument: "supply", label: "GND", role: "ground" },
  "supply.neg": { instrument: "supply", label: "−V", role: "supplyNeg" },

  "gen.out1": { instrument: "generator", label: "Vin", role: "input" },
  "gen.out2": { instrument: "generator", label: "Vin2", role: "inputB" },
  "gen.gnd": { instrument: "generator", label: "GND", role: "ground" },

  "u1.2": { instrument: "u1", label: "2 · −IN", pin: 2, role: "input" },
  "u1.3": { instrument: "u1", label: "3 · +IN", pin: 3, role: "input" },
  "u1.4": { instrument: "u1", label: "4 · −V", pin: 4, role: "supplyNeg" },
  "u1.6": { instrument: "u1", label: "6 · OUT", pin: 6, role: "output" },
  "u1.7": { instrument: "u1", label: "7 · +V", pin: 7, role: "supplyPos" },

  "rin.a": { instrument: "rin", label: "A", role: "input" },
  "rin.b": { instrument: "rin", label: "B", role: "input" },
  "rf.a": { instrument: "rf", label: "A", role: "feedback" },
  "rf.b": { instrument: "rf", label: "B", role: "feedback" },
  "rin2.a": { instrument: "rin2", label: "A", role: "inputB" },
  "rin2.b": { instrument: "rin2", label: "B", role: "inputB" },
  "rf2.a": { instrument: "rf2", label: "A", role: "feedback" },
  "rf2.b": { instrument: "rf2", label: "B", role: "feedback" },

  "board.gnd": { instrument: "board", label: "GND rail", role: "ground" },
});

/** The probe tips, which observe nodes but never create them. */
export const PROBES = Object.freeze({
  "meter.v": { instrument: "meter", label: "V", role: "output" },
  "meter.com": { instrument: "meter", label: "COM", role: "ground" },
  "scope.ch1": { instrument: "scope", label: "CH1", role: "input" },
  "scope.ch1gnd": { instrument: "scope", label: "CH1 ⏚", role: "ground" },
  "scope.ch2": { instrument: "scope", label: "CH2", role: "output" },
  "scope.ch2gnd": { instrument: "scope", label: "CH2 ⏚", role: "ground" },
});

const POWER = [
  { id: "vplus", name: "+V rail", terminals: ["supply.pos", "u1.7"] },
  { id: "vminus", name: "−V rail", terminals: ["supply.neg", "u1.4"] },
];

/**
 * The node list per configuration. Each entry is one electrical point and every
 * terminal named in it must end up joined to the others.
 */
export const TOPOLOGY = Object.freeze({
  inverting: [
    ...POWER,
    { id: "gnd", name: "Common", terminals: ["supply.gnd", "gen.gnd", "board.gnd", "u1.3"] },
    { id: "in", name: "Input", terminals: ["gen.out1", "rin.a"] },
    { id: "sum", name: "Summing junction", terminals: ["rin.b", "rf.a", "u1.2"] },
    { id: "out", name: "Output", terminals: ["rf.b", "u1.6"] },
  ],
  noninverting: [
    ...POWER,
    { id: "gnd", name: "Common", terminals: ["supply.gnd", "gen.gnd", "board.gnd", "rin.b"] },
    { id: "in", name: "Input", terminals: ["gen.out1", "u1.3"] },
    { id: "sum", name: "Summing junction", terminals: ["rin.a", "rf.a", "u1.2"] },
    { id: "out", name: "Output", terminals: ["rf.b", "u1.6"] },
  ],
  adder: [
    ...POWER,
    { id: "gnd", name: "Common", terminals: ["supply.gnd", "gen.gnd", "board.gnd", "u1.3"] },
    { id: "in1", name: "Input 1", terminals: ["gen.out1", "rin.a"] },
    { id: "in2", name: "Input 2", terminals: ["gen.out2", "rin2.a"] },
    { id: "sum", name: "Summing junction", terminals: ["rin.b", "rin2.b", "rf.a", "u1.2"] },
    { id: "out", name: "Output", terminals: ["rf.b", "u1.6"] },
  ],
  subtractor: [
    ...POWER,
    { id: "gnd", name: "Common", terminals: ["supply.gnd", "gen.gnd", "board.gnd", "rf2.b"] },
    { id: "in1", name: "Input 1", terminals: ["gen.out1", "rin.a"] },
    { id: "in2", name: "Input 2", terminals: ["gen.out2", "rin2.a"] },
    { id: "sum", name: "Summing junction", terminals: ["rin.b", "rf.a", "u1.2"] },
    { id: "plus", name: "+IN divider", terminals: ["rin2.b", "rf2.a", "u1.3"] },
    { id: "out", name: "Output", terminals: ["rf.b", "u1.6"] },
  ],
});

/** Every terminal a configuration uses; the rest are not connection targets. */
export function terminalsFor(configuration) {
  const nodes = TOPOLOGY[configuration];
  if (!nodes) throw new RangeError(`Unknown configuration: ${configuration}.`);
  return nodes.flatMap((node) => node.terminals);
}

/** Union-find over whatever the student has actually joined. */
export function nets(leads = []) {
  const parent = new Map();
  const find = (id) => {
    if (!parent.has(id)) parent.set(id, id);
    let root = id;
    while (parent.get(root) !== root) root = parent.get(root);
    while (parent.get(id) !== id) {
      const next = parent.get(id);
      parent.set(id, root);
      id = next;
    }
    return root;
  };
  const union = (a, b) => parent.set(find(a), find(b));
  for (const lead of leads) {
    if (!lead || lead.held) continue; // a lead in the hand is an open contact
    union(lead.from, lead.to);
  }
  return { find, union, parent };
}

/**
 * Compare what is wired against what the configuration needs.
 *
 * `missing` lists node fragments still to be joined — the next thing to do.
 * `shorts` lists pairs of distinct nodes that have been joined — a wiring fault.
 * The two are reported separately because they are different mistakes.
 */
export function verify(configuration, leads = []) {
  const nodes = TOPOLOGY[configuration];
  if (!nodes) throw new RangeError(`Unknown configuration: ${configuration}.`);
  const { find } = nets(leads);

  const missing = [];
  for (const node of nodes) {
    const [head, ...rest] = node.terminals;
    const unreached = rest.filter((terminal) => find(terminal) !== find(head));
    if (unreached.length) missing.push({ node: node.id, name: node.name, terminals: node.terminals, unreached });
  }

  const shorts = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const joined = a.terminals.some((x) => b.terminals.some((y) => find(x) === find(y)));
      if (joined) shorts.push({ between: [a.id, b.id], names: [a.name, b.name] });
    }
  }

  return { complete: missing.length === 0 && shorts.length === 0, missing, shorts, find };
}

/** Which node a probe tip is sitting on, if any. */
export function nodeAt(configuration, leads, terminal) {
  const nodes = TOPOLOGY[configuration];
  const { find } = nets(leads);
  const root = find(terminal);
  return nodes.find((node) => node.terminals.some((t) => find(t) === root)) ?? null;
}
