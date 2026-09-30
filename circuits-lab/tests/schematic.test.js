import test from "node:test";
import assert from "node:assert/strict";
import { renderSchematic } from "../src/schematic.js";

test("every supported schematic variant returns accessible SVG with finite coordinates", () => {
  const variants = [
    ["thevenin", { representation: "original" }],
    ["thevenin", { representation: "thevenin" }],
    ["thevenin", { representation: "norton" }],
    ["superposition", { sourceMode: "both" }],
    ["superposition", { sourceMode: "a", replacement: "short" }],
    ["superposition", { sourceMode: "b", replacement: "open" }],
    ["opamp", { configuration: "inverting" }],
    ["opamp", { configuration: "noninverting" }],
    ["transient", { kind: "RC", charging: true }],
    ["transient", { kind: "RL", charging: false }],
  ];
  for (const [module, params] of variants) {
    const svg = renderSchematic(module, params);
    assert.match(svg, /^<svg /);
    assert.match(svg, /role="img" aria-label="[^"]+"/);
    assert.match(svg, /viewBox="0 0 780 430"/);
    assert.match(svg, /data-symbol="ground"/);
    assert.doesNotMatch(svg, /NaN|undefined|Infinity/);
    assert.ok(svg.endsWith("</svg>"));
  }
});

test("equivalent-circuit drawings show the selected source, resistance and load values", () => {
  const th = renderSchematic("thevenin", { representation: "thevenin", equivalentVoltage: 4, equivalentResistance: 750, load: 1500 });
  assert.match(th, />4 V<\/text>/);
  assert.match(th, />750 Ω<\/text>/);
  assert.match(th, />1\.5 kΩ<\/text>/);
  assert.match(th, /data-pin="reqa"/);
  const norton = renderSchematic("thevenin", { representation: "norton", nortonCurrent: 8 });
  assert.match(norton, /data-symbol="current-source"/);
  assert.match(norton, />8 mA<\/text>/);
  assert.doesNotMatch(norton, /data-symbol="voltage-source"/);
});

test("source deactivation visibly changes the correct source to a short or an open", () => {
  const both = renderSchematic("superposition", { sourceMode: "both" });
  assert.match(both, /data-component="b" data-symbol="voltage-source" data-source-state="active" data-polarity="-1"/);
  const short = renderSchematic("superposition", { sourceMode: "a", replacement: "short" });
  assert.match(short, /data-component="a" data-symbol="voltage-source" data-source-state="active"/);
  assert.match(short, /data-component="b" data-symbol="voltage-source" data-source-state="short"/);
  assert.match(short, />0 V<\/text>/);
  const open = renderSchematic("superposition", { sourceMode: "b", replacement: "open" });
  assert.match(open, /data-component="a" data-symbol="voltage-source" data-source-state="open"/);
  assert.match(open, />open<\/text>/);
});

test("amplifier schematics expose separate supply terminals and track generator/resistor values", () => {
  const svg = renderSchematic("opamp", { rail: 15, frequency: 500, amplitude: 3.5, rin: 5000, rf: 30000 });
  for (const label of ["+15 V", "−15 V", "500 Hz", "3.5 Vpk", "5 kΩ", "30 kΩ"]) assert.ok(svg.includes(`>${label}</text>`), label);
  for (const pin of ["op+", "op-", "out", "vp", "vn", "rfa", "rfb"]) assert.ok(svg.includes(`data-pin="${pin}"`), pin);
  assert.match(svg, /data-symbol="op-amp"/);
  assert.match(svg, /data-symbol="sine-source"/);
});

test("transient diagrams distinguish capacitor/inductor symbols and maintain the return-switch state", () => {
  const rc = renderSchematic("transient", { kind: "RC", charging: true, resistance: 500, capacitance: 0.0002 });
  assert.match(rc, /data-symbol="capacitor"/);
  assert.doesNotMatch(rc, /data-symbol="inductor"/);
  assert.match(rc, /data-switch-position="source"/);
  assert.match(rc, />200 μF<\/text>/);
  const rl = renderSchematic("transient", { kind: "RL", charging: false, inductance: 0.2 });
  assert.match(rl, /data-symbol="inductor"/);
  assert.match(rl, /data-switch-position="return"/);
  assert.match(rl, />200 mH<\/text>/);
  assert.match(rl, /data-pin="return"/);
});

test("untrusted parameter values cannot inject markup into schematic labels", () => {
  const svg = renderSchematic("opamp", { amplitude: "<script>alert(1)</script>", frequency: '"><img src=x>' });
  assert.doesNotMatch(svg, /<script|<img|alert\(1\)/);
  assert.throws(() => renderSchematic("missing"), /Unknown schematic module/);
});
