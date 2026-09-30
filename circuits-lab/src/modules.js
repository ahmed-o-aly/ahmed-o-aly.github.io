export const MODULES = {
  thevenin: {
    number: "05",
    short: "Equivalent circuits",
    title: "Thévenin and Norton",
    name: "Thévenin & Norton",
    topic: "Thévenin, Norton & maximum power transfer",
    description: "Compare load voltage, current and power.",
    purpose: "Build equivalent circuits, verify the same load behaviour, and find maximum load power.",
    steps: [
      "Wire the original network. Measure load voltage, current and power at 250, 500 and 1000 Ω.",
      "Switch to Thévenin and Norton. Set their source and resistance values, then wire each equivalent.",
      "Repeat the same loads. Compare all three circuits using your paper measurements.",
      "Vary the load and inspect the calculated power sweep. Find the load that receives maximum power.",
    ],
    challenge:
      "Wire the original circuit and its Thévenin and Norton equivalents. Compare readings at 250, 500 and 1000 Ω, then vary the load to find maximum power. Write your results on paper.",
    principle: "Equivalent circuits preserve voltage and current at the load terminals. Their internal behaviour can differ.",
    defaults: { representation: "original", load: 500, equivalentVoltage: 6, equivalentResistance: 500, nortonCurrent: 12 },
  },
  superposition: {
    number: "06",
    short: "Source contributions",
    title: "Superposition",
    name: "Superposition",
    topic: "Superposition in linear DC circuits",
    description: "Measure each source’s contribution.",
    purpose: "Add signed source contributions and explain how two active sources can cancel one branch current.",
    steps: [
      "Wire the network with A at +6 V and B at −3 V. Read the branch current with both sources active.",
      "Select A alone, then B alone. Replace each inactive ideal voltage source with a short.",
      "Compare the signed contributions with the complete circuit. Add currents on paper, not powers.",
      "Keep both sources active and adjust B until branch current is zero. Check which other branches still carry current.",
    ],
    challenge:
      "Compare A alone, B alone and both at +6 V / −3 V. Short each inactive voltage source. Adjust source B until the branch current is zero, then compare the signed contributions. Write your explanation on paper.",
    principle: "Add signed voltage or current contributions. Power must be calculated from the combined result.",
    defaults: { v1: 6, v2: 3, sourceMode: "both", replacement: "short", sumMilliamp: null, explanation: "unset" },
  },
  opamp: {
    number: "07",
    short: "Gain & clipping",
    title: "Operational amplifiers",
    name: "Operational amplifiers",
    topic: "Closed-loop gain & output clipping",
    description: "Set the gain and check for clipping.",
    purpose: "Design a gain with resistors, then find the largest input before output clipping.",
    steps: [
      "Choose the amplifier circuit assigned in your lab sheet. For this example, start with the inverting circuit.",
      "For a first design, use the inverting circuit at gain −3. Set Rin and Rf, wire feedback, and connect both supplies.",
      "Connect CH1 to input and CH2 to output, with both grounds at GND. Set a readable timebase and voltage scales.",
      "Increase input amplitude until clipping begins. Change the supplies or signal frequency and compare the traces.",
    ],
    challenge:
      "At ±12 V and 100 Hz, build an inverting amplifier with gain −3. Connect CH1 to Vin and CH2 to Vout, with both grounds at GND. Increase the input until clipping appears. Put measurements and calculations on paper.",
    principle: "Negative feedback sets the gain only while the amplifier operates within its limits.",
    defaults: {
      configuration: "inverting",
      rin: 10000,
      rf: 20000,
      amplitude: 1,
      rail: 12,
      frequency: 100,
      prediction: 0,
      timeDiv: 2,
      ch1Scale: 1,
      ch2Scale: 5,
      triggerEdge: "rising",
      triggerLevel: 0,
      scopeRunning: true,
      scopeGroundChannel: "ch1",
    },
  },
  transient: {
    number: "08",
    short: "Energy & time",
    title: "RC and RL response",
    name: "RC & RL transients",
    topic: "First-order RC & RL transient response",
    description: "Measure charging and decay.",
    purpose: "Predict how resistance changes response speed, then test both RC and RL circuits.",
    steps: [
      "Wire RC. On paper, predict whether increasing R makes the response faster or slower.",
      "Run from zero energy. Watch voltage, current and stored energy; pause, slow, replay or drag through the acquired trace.",
      "Increase R and repeat from zero energy. Use the same playback speed and compare the time to reach the same fraction of the final value.",
      "Repeat with RL, then switch each circuit to Return to observe decay. Compare both trends with your predictions.",
    ],
    challenge:
      "Wire the RC and RL circuits. Run charging and decay, compare voltage and current, and change R to see its effect on response time. Use pause, replay and the time cursor. Put predictions and measurements on paper.",
    principle: "Capacitor voltage and inductor current remain continuous through switching in these ideal circuits.",
    defaults: {
      kind: "RC",
      resistance: 1000,
      capacitance: 0.0001,
      inductance: 0.1,
      charging: true,
      initial: 0,
      time: 0,
      acquiredTime: 0,
      playing: false,
      speed: 1,
      predictionChoice: "unset",
    },
  },
};

const pin = (id, label, x, z) => ({ id, label, x, z });
const part = (id, label, type, value, x, z, pins) => ({ id, label, type, value, x, z, pins });
const ground = () => part("ground", "GND", "ground", "0 V", -0.7, 0.69, [pin("gnd", "GND", -0.7, 0.61)]);
const source = (id, label, value, x, z) => part(id, label, "V", value, x, z, [pin(`${id}+`, "+", x, z - 0.22), pin(`${id}-`, "−", x, z + 0.22)]);
const horizontalR = (id, label, value, x, z) => part(id, label, "R", value, x, z, [pin(`${id}a`, "A", x - 0.29, z), pin(`${id}b`, "B", x + 0.29, z)]);
const verticalR = (id, label, value, x, z) => part(id, label, "R", value, x, z, [pin(`${id}a`, "+", x, z - 0.26), pin(`${id}b`, "−", x, z + 0.26)]);
const R = (id, value) => ({ id, type: "R", a: `${id}a`, b: `${id}b`, value });
const V = (id, value) => ({ id, type: "V", a: `${id}+`, b: `${id}-`, value });

export function circuitFor(id, p) {
  let components,
    wires,
    electrical = [],
    positive,
    sensor;
  if (id === "thevenin") {
    if (p.representation === "original") {
      components = [
        source("s", "DC SOURCE", "12 V", -1.14, -0.03),
        horizontalR("r1", "R₁", "1 kΩ", -0.36, -0.46),
        verticalR("r2", "R₂", "1 kΩ", 0.23, 0.08),
        verticalR("load", "LOAD", `${p.load} Ω`, 1.1, 0.08),
        ground(),
      ];
      wires = [
        ["s+", "r1a"],
        ["r1b", "r2a"],
        ["r2a", "loada"],
        ["r2b", "gnd"],
        ["loadb", "gnd"],
        ["s-", "gnd"],
      ];
      electrical = [V("s", 12), R("r1", 1000), R("r2", 1000), R("load", p.load)];
    } else if (p.representation === "thevenin") {
      components = [
        source("s", "Vth", `${p.equivalentVoltage} V`, -1, -0.02),
        horizontalR("req", "Rth", `${p.equivalentResistance} Ω`, 0, -0.46),
        verticalR("load", "LOAD", `${p.load} Ω`, 1, 0.02),
        ground(),
      ];
      wires = [
        ["s+", "reqa"],
        ["reqb", "loada"],
        ["loadb", "gnd"],
        ["s-", "gnd"],
      ];
      electrical = [V("s", p.equivalentVoltage), R("req", p.equivalentResistance), R("load", p.load)];
    } else {
      components = [
        part("s", "In ↑", "I", `${p.nortonCurrent} mA`, -1, -0.02, [pin("s+", "OUT", -1, -0.28), pin("s-", "IN", -1, 0.24)]),
        verticalR("req", "Rn", `${p.equivalentResistance} Ω`, 0, 0.02),
        verticalR("load", "LOAD", `${p.load} Ω`, 1, 0.02),
        ground(),
      ];
      wires = [
        ["s+", "reqa"],
        ["reqa", "loada"],
        ["reqb", "gnd"],
        ["loadb", "gnd"],
        ["s-", "gnd"],
      ];
      electrical = [{ id: "s", type: "I", a: "s-", b: "s+", value: p.nortonCurrent / 1000 }, R("req", p.equivalentResistance), R("load", p.load)];
    }
    positive = "loada";
    sensor = "load";
  }
  if (id === "superposition") {
    const aOn = p.sourceMode !== "b",
      bOn = p.sourceMode !== "a";
    components = [
      source("a", "SOURCE A", aOn ? `+${p.v1} V` : p.replacement === "short" ? "0 V · SHORT" : "OPEN", -1.18, -0.08),
      source("b", "SOURCE B", bOn ? `−${p.v2} V` : p.replacement === "short" ? "0 V · SHORT" : "OPEN", 1.18, -0.08),
      horizontalR("r1", "R₁", "1 kΩ", -0.51, -0.55),
      horizontalR("r2", "R₂", "1 kΩ", 0.51, -0.55),
      verticalR("load", "BRANCH", "1 kΩ", 0, 0.17),
      ground(),
    ];
    wires = [
      ["a+", "r1a"],
      ["r1b", "loada"],
      ["r2a", "loada"],
      ["r2b", "b+"],
      ["a-", "gnd"],
      ["b-", "gnd"],
      ["loadb", "gnd"],
    ];
    electrical = [R("r1", 1000), R("r2", 1000), R("load", 1000)];
    if (aOn || p.replacement === "short") electrical.push(V("a", aOn ? p.v1 : 0));
    if (bOn || p.replacement === "short") electrical.push(V("b", bOn ? -p.v2 : 0));
    positive = "loada";
    sensor = "load";
  }
  if (id === "opamp") {
    components = [
      source("signal", "INPUT", `${p.amplitude} Vpk`, -1.18, -0.19),
      horizontalR("rin", "Rin", `${p.rin / 1000} kΩ`, -0.54, -0.5),
      part("op", "OP AMP", "opamp", `±${p.rail} V`, 0.15, -0.07, [
        pin("op+", "+", -0.12, 0.06),
        pin("op-", "−", -0.12, -0.22),
        pin("out", "OUT", 0.55, -0.07),
        pin("vp", "V+", 0.2, -0.42),
        pin("vn", "V−", 0.2, 0.26),
      ]),
      horizontalR("rf", "Rf", `${p.rf / 1000} kΩ`, 0.43, 0.54),
      source("plus", "+ SUPPLY", `${p.rail} V`, 1.12, -0.41),
      source("minus", "− SUPPLY", `${p.rail} V`, 1.12, 0.37),
      ground(),
    ];
    wires = [
      ["signal-", "gnd"],
      ["rfb", "out"],
      ["rfa", "op-"],
      ["rinb", "op-"],
      ["plus+", "vp"],
      ["plus-", "gnd"],
      ["minus+", "gnd"],
      ["minus-", "vn"],
    ];
    wires.push(
      ...(p.configuration === "inverting"
        ? [
            ["signal+", "rina"],
            ["op+", "gnd"],
          ]
        : [
            ["signal+", "op+"],
            ["rina", "gnd"],
          ])
    );
    positive = "out";
  }
  if (id === "transient") {
    components = [
      source("s", "DC SOURCE", "5 V", -1.19, 0.06),
      part("sw", "SPDT SWITCH", "switch", p.charging ? "SOURCE" : "RETURN", -0.62, -0.39, [
        pin("supply", "5 V", -0.83, -0.58),
        pin("common", "COM", -0.36, -0.39),
        pin("return", "0 V", -0.75, -0.18),
      ]),
      horizontalR("r", "RESISTOR", `${p.resistance} Ω`, 0.2, -0.46),
      part("storage", p.kind === "RC" ? "CAPACITOR" : "INDUCTOR", p.kind === "RC" ? "C" : "L", p.kind === "RC" ? "100 μF" : "100 mH", 1.03, 0.1, [
        pin("storagea", "+", 1.03, -0.17),
        pin("storageb", "−", 1.03, 0.37),
      ]),
      ground(),
    ];
    wires = [
      ["s+", "supply"],
      ["s-", "gnd"],
      ["return", "gnd"],
      ["common", "ra"],
      ["rb", "storagea"],
      ["storageb", "gnd"],
    ];
    positive = "storagea";
  }
  return {
    components,
    wires,
    electrical,
    positive,
    negative: "gnd",
    sensor,
    pins: components.flatMap((c) => c.pins.map((n) => ({ ...n, name: `${c.label} ${n.label}` }))),
  };
}

export function netGroups(wires, pins) {
  const parent = Object.fromEntries(pins.map((p) => [typeof p === "string" ? p : p.id, typeof p === "string" ? p : p.id]));
  const find = (x) => (parent[x] === x ? x : parent[x] === undefined ? x : (parent[x] = find(parent[x])));
  for (const [a, b] of wires) if (a in parent && b in parent) parent[find(a)] = find(b);
  return Object.fromEntries(Object.keys(parent).map((p) => [p, find(p)]));
}
export function correctTopology(circuit, wires) {
  const expected = netGroups(circuit.wires, circuit.pins),
    actual = netGroups(wires, circuit.pins);
  return circuit.pins.every((a) => circuit.pins.every((b) => (expected[a.id] === expected[b.id]) === (actual[a.id] === actual[b.id])));
}

export const OPTIONS = {
  load: [100, 250, 500, 750, 1000, 1500, 2000],
  equivalentVoltage: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
  equivalentResistance: [100, 250, 500, 750, 1000, 1500, 2000],
  nortonCurrent: [4, 6, 8, 10, 12, 14, 16, 18, 20],
  v1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  v2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  rin: [5000, 10000, 20000],
  rf: [10000, 20000, 30000, 40000, 50000, 100000],
  rail: [5, 9, 12, 15],
  frequency: [10, 50, 100, 500, 1000],
  amplitude: [0.25, 0.5, 1, 2, 3, 3.5, 3.6, 3.7, 4, 5, 6],
  prediction: Array.from({ length: 101 }, (_, i) => i / 10),
  resistance: [100, 200, 250, 500, 1000, 2000, 5000, 10000],
  speed: [0.25, 0.5, 1, 2],
  sumMilliamp: Array.from({ length: 161 }, (_, i) => (i - 80) / 10),
  explanation: ["unset", "opposing", "sources-off", "whole-circuit-zero"],
  predictionChoice: ["unset", "slower", "faster", "same"],
  timeDiv: [0.02, 0.05, 0.1, 0.2, 0.4, 0.5, 1, 2, 4, 5, 10, 20, 50],
  ch1Scale: [0.1, 0.2, 0.5, 1, 2, 5, 10],
  ch2Scale: [0.1, 0.2, 0.5, 1, 2, 5, 10],
  triggerLevel: [-10, -5, -2, -1, -0.5, 0, 0.5, 1, 2, 5, 10],
  triggerEdge: ["rising", "falling"],
};
