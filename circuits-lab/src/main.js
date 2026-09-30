import "./style.css";
import { MODULES, OPTIONS, circuitFor } from "./modules.js";
import {
  createLab,
  parameters,
  context,
  measure,
  metrics,
  plot,
  vrActions,
  change,
  action,
  terminal,
  key,
  fmt,
  activity,
  scope,
  advanceTransient,
  removeWire,
  setProbe,
} from "./lab.js";
import { transient } from "./physics.js";
import { createBench } from "./bench.js";
import { renderSchematic } from "./schematic.js";

const app = document.querySelector("#app");
const state = createLab();
let xrStatus = { kind: "checking", supported: false, active: false, message: "Checking headset…" },
  bench,
  showReference = false,
  selectedPart = null,
  panelPreview = false;
const escape = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const icon = (name) =>
  ({
    circuit: '<path d="M3 8h5l3-5 5 10 3-5h5M7 18h15M7 15v6M22 15v6"/>',
    vr: '<path d="M4 6h20l2 13h-7l-5-4-5 4H2Z"/><circle cx="9" cy="11" r="2"/><circle cx="19" cy="11" r="2"/>',
    book: '<path d="M4 4h8a4 4 0 0 1 4 3v17a4 4 0 0 0-4-3H4Zm12 3a4 4 0 0 1 4-3h5v17h-5a4 4 0 0 0-4 3"/>',
    reset: '<path d="M6 8a9 9 0 1 1-1 10M6 3v6h6"/>',
    arrow: '<path d="M7 21 21 7M7 7h14v14"/>',
    play: '<path d="m10 5 13 9-13 9Z"/>',
    check: '<path d="m6 14 5 5L23 7"/>',
  })[name] || "";
const svgIcon = (name) =>
  `<svg viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icon(
    name
  )}</svg>`;
app.innerHTML = `
  <aside class="sidebar">
    <a class="brand" href="#" aria-label="MetaHub Circuits lab">${svgIcon(
      "circuit"
    )}<span>MetaHub<span class="brand-sub">Circuits lab</span></span></a>
    <div class="sidebar-caption">Electrical Circuits I</div>
    <nav aria-label="Laboratory modules">${Object.entries(MODULES)
      .map(
        ([id, m]) =>
          `<button class="module-link" data-action="module:${id}" data-module="${id}"><span class="lab-number">${m.number}</span><span><strong>${m.name}</strong><small>${m.short}</small></span><span class="module-status" aria-hidden="true"></span></button>`
      )
      .join("")}</nav>
    <div class="sidebar-bottom"><div class="course-mark">ELEN <strong>221</strong></div><button class="text-button" id="guide-button">Help ${svgIcon(
      "arrow"
    )}</button><span class="prototype-tag">Prototype · v0.4</span></div>
  </aside>
  <main class="workspace">
    <header class="topbar"><div class="breadcrumb">Lab <span id="lab-number">05</span><span class="slash">/</span><span id="topic-label"></span></div><div class="header-actions"><button class="button vr-button" id="vr-button">${svgIcon(
      "vr"
    )} Checking VR…</button></div></header>
    <div class="vr-status-row"><span id="vr-status" role="status">Checking headset…</span><button id="headset-help" class="text-button">Open on a headset</button></div>
    <section class="intro"><div><h1 id="module-title"></h1><p id="module-description"></p></div><div class="mode-switch" aria-label="Learning mode"><button data-action="explore" class="active">Explore</button><button data-action="build">Build circuit</button></div></section>
    <div class="lab-layout">
      <section class="bench-panel" aria-label="Interactive circuit experiment">
        <div class="panel-header"><div class="bench-tabs"><button id="bench-tab" class="active">3D bench</button><button id="reference-tab">Schematic</button><button id="vr-preview-tab" hidden title="Desktop check of panel layout only">Panel preview</button></div><div class="bench-toolbar"><span id="circuit-status" class="status-tag">Circuit connected</span><button class="icon-button" id="reset-view" aria-label="Reset 3D view">${svgIcon(
          "reset"
        )}</button></div></div>
        <div class="stage-wrap"><div id="bench"></div><div id="schematic" hidden></div><div class="stage-top"><span id="bench-caption">Original circuit</span><span id="hover-label" hidden></span></div><div class="stage-bottom"><span>Drag to orbit · Scroll to zoom</span><span>Click a part to edit · Click the switch to flip it</span></div></div>
        <div class="patch-toolbar" aria-label="Bench tools"><button data-action="tool:select" data-tool="select" title="Select a part (1)">Select</button><button data-action="tool:wire" data-tool="wire" class="active" title="Connect two terminals (2)">Connect</button><button data-action="tool:red" data-tool="red" title="Place red voltmeter probe (3)"><i class="probe-dot red"></i> Red probe</button><button data-action="tool:black" data-tool="black" title="Place black voltmeter probe (4)"><i class="probe-dot black"></i> Black probe</button><button data-action="tool:remove" data-tool="remove" title="Remove a lead (5)">Remove</button><button data-action="undo" title="Undo last wire or probe change">Undo</button><button data-action="cancel" id="cancel-wire" title="Cancel selection (Esc)">Cancel</button></div>
        <div class="bench-help"><span id="bench-help"></span></div>
        <div id="readings" class="readings"></div>
      </section>
      <aside class="controls-panel"><div class="control-heading"><div><h2>Settings</h2></div><span class="small-circuit">${svgIcon(
        "circuit"
      )}</span></div><div id="part-controls" hidden></div><div id="controls"></div><div id="model-note" class="model-note"></div></aside>
    </div>
    <div class="lower-layout">
      <section class="chart-panel"><div class="chart-heading"><div><h2 id="chart-title"></h2></div><div id="chart-legend"></div></div><p id="chart-subtitle"></p><div id="source-comparison" hidden></div><div id="scope-controls" hidden></div><div id="chart"></div></section>
      <section class="challenge-panel"><h2>Experiment</h2><div id="activity-controls"></div><div class="challenge-actions"><button class="button subtle" data-action="check-wiring">Check connections</button><button class="button subtle" id="new-attempt" data-action="reset-circuit" hidden>Clear circuit</button></div><p class="feedback" id="feedback" role="status" aria-live="polite"></p></section>
    </div>
    <section class="connection-panel"><details><summary>Connections</summary><div class="connection-content"><div><h3>Connect a patch lead</h3><div class="wiring-form"><label>From<select id="wire-from"></select></label><label>To<select id="wire-to"></select></label><button class="button primary" id="add-wire">Connect</button></div><div class="wiring-form"><label>Red voltage probe<select id="red-probe"></select></label><label>Black voltage probe<select id="black-probe"></select></label></div><div class="connection-buttons"><button class="button subtle" data-action="check-wiring">Check connections</button><button class="button subtle" data-action="clear">Clear leads</button><button class="button subtle" data-action="restore" id="restore-button">Use shown circuit</button></div></div><div><h3>Connected leads</h3><div id="wire-list"></div></div></div></details></section>
    <footer class="workspace-footer"><span><i class="footer-dot"></i> Desktop 3D / VR</span><span>Ideal circuit models</span><button id="model-guide">Model limits ${svgIcon(
      "arrow"
    )}</button></footer>
  </main>
  <dialog id="headset-dialog" aria-labelledby="headset-title"><div class="dialog-header"><h2 id="headset-title">Open the lab in VR</h2><button class="icon-button" data-close aria-label="Close VR setup">×</button></div><p>Open this lab in your headset’s browser, then select <strong>Enter VR</strong>. The circuit bench and all four experiments open around you.</p><div id="headset-address" class="headset-address"></div><ol class="headset-steps"><li>Choose a lab and Explore or Build circuit.</li><li>Enter VR and accept the headset’s request.</li><li>Point and press the trigger to connect leads, place probes and use the controls. Choose <strong>Recenter</strong> if the bench is out of reach.</li></ol><p id="headset-status" class="headset-status" role="status"></p><p>Your circuit and readings stay when you leave VR.</p><div class="dialog-actions"><button class="button primary" id="headset-enter" hidden>Enter VR</button><button class="button subtle" id="headset-check">Check headset</button><a id="headset-fullscreen" class="button subtle" target="_blank" rel="noopener" hidden>Open lab full screen</a></div></dialog>
  <dialog id="guide-dialog"><div class="dialog-header"><div><span class="eyebrow">ELEN 221</span><h2>Lab guide</h2></div><button class="icon-button" data-close aria-label="Close guide">×</button></div><div class="guide-body"><p>Explore opens a connected reference circuit. Build circuit gives you an empty patch bench: connect the component terminals, place the voltage probes and take measurements.</p><ol><li>Select <strong>Connect</strong>, then two terminals. Hover to read their names. Use <strong>Remove</strong> to delete a lead, <strong>Undo</strong> to reverse a wire or probe change, or <strong>Esc</strong> to cancel. Click a part to change its value. The terminal lists also work by keyboard.</li><li>Select the <strong>red</strong> or <strong>black probe</strong>, then a contact. The voltmeter reads red minus black. The current sensor is fixed in the indicated branch.</li><li>Change the settings and read the meters and graphs. Write your readings, calculations and answers on paper.</li></ol><h3>Electrical models</h3><p>DC resistor networks are solved from your actual connections. Invalid or floating circuits produce diagnostics. Op-amp and transient activities support the displayed configurations and require matching connections before reporting measurements.</p><p>The op-amp uses ideal gain with adjustable supply rails and sine frequency. Output remains 1 V inside each rail (±11 V for ±12 V supplies). The voltage sample is at the positive input peak, one quarter-period into the cycle. It does not model a specific device, input common-mode limits, bandwidth, slew rate or output-current limits. Meters have ideal input impedance. Components have no tolerance or parasitic effects.</p><p>RC and RL responses preserve capacitor voltage and inductor current when the switch or resistance changes. Playback has a speed control and keeps the same time scale when resistance changes. Both graphs show circuit time. “New run” explicitly resets stored energy.</p><p>These are proposed teaching circuits. The instructor should match them to the lab handouts before classroom use.</p><h3>Use in a VR headset</h3><p id="vr-help-status"></p><p>Open the lab’s HTTPS link in your headset’s browser and select Enter VR. Use Open on a headset at the top of the page to get the link and check your headset.</p><p>Use a controller trigger to select terminal pairs, remove leads, place probes, or press a control. The panel has Bench, Settings, Guide and Labs tabs. Point at a part to see its settings. Use Guide for the experiment steps and Settings for the scope and playback controls. Use Recenter to bring the bench in front of you. Exit with the panel button or the headset system menu.</p><p class="notice">Headset interaction is implemented but has not been verified on physical hardware in this environment. The desktop view is not a substitute for that check.</p><p><a href="./docs/module-designs.md" target="_blank" rel="noopener">Instructor guide ↗</a></p></div></dialog>
`;

const select = (name, label, values, display = (v) => v) =>
  `<label class="control-label" for="param-${name}">${label}</label><select id="param-${name}" data-param="${name}">${values
    .map((v) => `<option value="${escape(v)}" ${parameters(state)[name] === v ? "selected" : ""}>${escape(display(v))}</option>`)
    .join("")}</select>`;
const segmented = (name, label, values) =>
  `<div class="control-label">${label}</div><div class="segmented">${values
    .map(
      ([value, text]) => `<button data-action="set:${name}:${value}" class="${parameters(state)[name] === value ? "active" : ""}">${text}</button>`
    )
    .join("")}</div>`;
const controlBlock = (html) => `<div class="control-block">${html}</div>`;

function renderControls() {
  const p = parameters(state),
    id = state.module;
  let html = "",
    note = "";
  if (id === "thevenin") {
    html += controlBlock(
      segmented("representation", "Circuit", [
        ["original", "Original"],
        ["thevenin", "Thévenin"],
        ["norton", "Norton"],
      ])
    );
    html += controlBlock(
      select("load", "Load", OPTIONS.load, (v) => `${v} Ω`) +
        `<div class="range-labels"><span>Smaller load</span><span>Larger load</span></div><input aria-label="Load resistance slider" type="range" min="0" max="6" step="1" value="${OPTIONS.load.indexOf(
          p.load
        )}" id="load-slider">`
    );
    if (p.representation === "thevenin") html += controlBlock(select("equivalentVoltage", "Vth", OPTIONS.equivalentVoltage, (v) => `${v} V`));
    if (p.representation === "norton") html += controlBlock(select("nortonCurrent", "In", OPTIONS.nortonCurrent, (v) => `${v} mA`));
    if (p.representation !== "original")
      html += controlBlock(select("equivalentResistance", "Equivalent resistance", OPTIONS.equivalentResistance, (v) => `${v} Ω`));
    else html += `<div class="fixed-values"><span>Source<strong>12 V</strong></span><span>R₁ / R₂<strong>1 kΩ / 1 kΩ</strong></span></div>`;
    note = "Use the same loads in each circuit. Peak power and peak efficiency occur at different loads.";
  }
  if (id === "superposition") {
    html += controlBlock(
      segmented("sourceMode", "Active sources", [
        ["both", "Both"],
        ["a", "A alone"],
        ["b", "B alone"],
      ])
    );
    html += controlBlock(select("v1", "Source A", OPTIONS.v1, (v) => `+${v} V`));
    html += controlBlock(select("v2", "Source B", OPTIONS.v2, (v) => `−${v} V`));
    html += controlBlock(
      segmented("replacement", "Inactive source", [
        ["short", "Short circuit"],
        ["open", "Open circuit"],
      ])
    );
    note = "An inactive ideal voltage source is a short circuit. Compare it with an open circuit. All resistors are 1 kΩ.";
  }
  if (id === "opamp") {
    html += controlBlock(
      segmented("configuration", "Circuit", [
        ["inverting", "Inverting"],
        ["noninverting", "Non-inverting"],
      ])
    );
    html += `<div class="paired-controls">${controlBlock(
      select("rin", p.configuration === "inverting" ? "Input resistor" : "Ground resistor", OPTIONS.rin, (v) => `${v / 1000} kΩ`)
    )}${controlBlock(select("rf", "Feedback resistor", OPTIONS.rf, (v) => `${v / 1000} kΩ`))}</div>`;
    html += controlBlock(select("amplitude", "Input amplitude", OPTIONS.amplitude, (v) => `${v} V peak`));
    html += `<div class="paired-controls">${controlBlock(select("rail", "Supply rails", OPTIONS.rail, (v) => `±${v} V`))}${controlBlock(
      select("frequency", "Signal frequency", OPTIONS.frequency, (v) => `${v} Hz`)
    )}</div>`;
    note = `Sine input · 1 V output headroom · ±${p.rail - 1} V output limit. Ideal gain. Bandwidth and slew rate are not modelled.`;
  }
  if (id === "transient") {
    html += controlBlock(
      segmented("kind", "Circuit", [
        ["RC", "RC · capacitor"],
        ["RL", "RL · inductor"],
      ])
    );
    html += controlBlock(select("resistance", "Series resistance", OPTIONS.resistance, (v) => `${v} Ω`));
    html += `<div class="fixed-values"><span>Source<strong>5 V</strong></span><span>${p.kind === "RC" ? "Capacitance" : "Inductance"}<strong>${
      p.kind === "RC" ? "100 μF" : "100 mH"
    }</strong></span></div>`;
    html += controlBlock(
      `<div class="control-label">Switch position</div><button class="switch-button ${
        p.charging ? "charging" : ""
      }" data-action="switch"><span class="switch-track"><i></i></span>${p.charging ? "Source connected" : "Closed return loop"}</button>`
    );
    html += `<div class="transient-buttons"><button class="button primary" data-action="play" id="play-button">${svgIcon("play")}${
      p.playing ? "Pause" : "Run"
    }</button><button class="button subtle" data-action="reset-energy">New run</button></div><div class="time-control"><div><span>Time</span><strong id="simulation-time">${fmt(
      p.time * 1000
    )} ms</strong></div><input id="time-slider" aria-label="Simulation time in time constants" type="range" min="0" max="5" step="0.01" value="${
      p.time / transient({ ...p, source: 5 }).tau
    }"><div class="time-shortcuts"><button data-action="one-tau">Go to 1 τ</button><button data-action="five-tau">Go to 5 τ</button><button data-action="replay">Replay</button></div></div>`;
    html += controlBlock(select("speed", "Playback speed", OPTIONS.speed, (v) => `${v}×`));
    note = "Both graphs use circuit time. Playback keeps the same time scale when R changes. New run resets stored energy.";
  }
  document.querySelector("#controls").innerHTML = html;
  renderPartControls();
  renderActivity();
  renderScopeControls();
  document.querySelector("#model-note").textContent = note;
}

function partParameters() {
  const p = parameters(state);
  const mapping =
    state.module === "thevenin"
      ? {
          load: ["load"],
          req: ["equivalentResistance"],
          s: p.representation === "norton" ? ["nortonCurrent"] : p.representation === "thevenin" ? ["equivalentVoltage"] : [],
        }
      : state.module === "superposition"
        ? { a: ["v1"], b: ["v2"] }
        : state.module === "opamp"
          ? { signal: ["amplitude", "frequency"], rin: ["rin"], rf: ["rf"], plus: ["rail"], minus: ["rail"], op: ["configuration"] }
          : { r: ["resistance"], sw: ["charging"], storage: ["kind"] };
  return mapping[selectedPart] || [];
}
function selectedPartActionIds() {
  const fields = partParameters();
  return vrActions(state)
    .filter((a) => fields.some((f) => a.id.startsWith(`cycle:${f}`) || a.id.startsWith(`set:${f}:`) || (f === "charging" && a.id === "switch")))
    .map((a) => a.id);
}
function renderPartControls() {
  const panel = document.querySelector("#part-controls");
  const part = context(state).circuit.components.find((c) => c.id === selectedPart);
  panel.hidden = !part;
  if (!part) return;
  const fields = partParameters();
  panel.innerHTML =
    `<div class="part-title"><strong>${escape(part.label)} · ${escape(
      part.value
    )}</strong><button id="close-part" aria-label="Close part settings">×</button></div>` +
    (fields.length
      ? fields
          .map((field) => {
            const control = document.querySelector(`[data-param="${field}"]`);
            if (control) control.closest(".control-block")?.classList.add("selected-control");
            const fieldLabel =
              {
                load: "Load",
                equivalentResistance: "Resistance",
                equivalentVoltage: "Vth",
                nortonCurrent: "In",
                v1: "Source A",
                v2: "Source B",
                resistance: "Resistance",
                rail: "Supply",
                frequency: "Frequency",
                amplitude: "Input",
                rin: "Rin",
                rf: "Rf",
              }[field] || field;
            const unitLabel =
              {
                load: "Ω",
                equivalentResistance: "Ω",
                equivalentVoltage: "V",
                nortonCurrent: "mA",
                v1: "V",
                v2: "V",
                resistance: "Ω",
                rail: "V",
                frequency: "Hz",
                amplitude: "V peak",
                rin: "Ω",
                rf: "Ω",
              }[field] || "";
            if (OPTIONS[field])
              return `<div class="part-adjust"><button data-action="cycle:${field}:-1" aria-label="Decrease ${escape(
                field
              )}">−</button><span>${escape(fieldLabel)}: ${escape(
                parameters(state)[field]
              )} ${unitLabel}</span><button data-action="cycle:${field}" aria-label="Increase ${escape(field)}">+</button></div>`;
            if (field === "charging") return `<button class="button" data-action="switch">Flip switch</button>`;
            if (field === "configuration")
              return `<button class="button" data-action="set:configuration:${
                parameters(state).configuration === "inverting" ? "noninverting" : "inverting"
              }">Change amplifier</button>`;
            if (field === "kind")
              return `<button class="button" data-action="set:kind:${parameters(state).kind === "RC" ? "RL" : "RC"}">Use ${
                parameters(state).kind === "RC" ? "RL" : "RC"
              }</button>`;
            return "";
          })
          .join("")
      : `<p>Fixed part. Connect its terminals with the Connect tool.</p>`);
}
function renderActivity() {
  const steps = {
    thevenin: [
      "Connect the original circuit and measure the load voltage, current and power.",
      "Switch to each equivalent circuit. Set its source and resistance, then compare the same loads.",
      "Change the load to find the highest power.",
    ],
    superposition: [
      "Select A alone, B alone and Both sources to compare the signed currents.",
      "Use a short circuit for the inactive voltage source. Try an open circuit to see the difference.",
      "Keep both sources on and adjust source B until the load current is zero.",
    ],
    opamp: [
      "Set the input and feedback resistors for the gain you need.",
      "Put CH1 on the input and CH2 on the output, with both ground clips at GND.",
      "Increase the input until the output clips. Change the supply rails and compare. Use Auto scale to fit the traces.",
    ],
    transient: [
      "Choose RC or RL, then select New run and Run.",
      "Pause, slow or replay the response. Compare voltage, current and stored energy.",
      "Change resistance and start a new run. Repeat with the other circuit.",
    ],
  };
  document.querySelector("#activity-controls").innerHTML = `<ol class="experiment-steps">${steps[state.module]
    .map((step) => `<li>${step}</li>`)
    .join("")}</ol>`;
}
function renderSourceComparison() {
  const a = activity(state),
    p = parameters(state);
  document.querySelector("#source-comparison").innerHTML = `<p>Live circuit values at +${p.v1} V / −${
    p.v2
  } V. Click a case to put it on the bench.</p><div class="source-cases">${[
    ["a", "A alone"],
    ["b", "B alone"],
    ["both", "Both sources"],
  ]
    .map(([mode, label]) => {
      const row = a.live?.[mode];
      return `<button data-action="set:sourceMode:${mode}" class="source-case ${
        p.sourceMode === mode ? "active" : ""
      }"><span>${label}</span><strong>${row?.valid ? `${fmt(row.current * 1000)} mA` : "—"}</strong><small>${
        row?.valid ? `${fmt(row.voltage)} V` : "Connect the circuit"
      }</small></button>`;
    })
    .join("")}</div>`;
}
function activityLines() {
  if (state.module === "superposition") {
    const live = activity(state).live;
    return ["a", "b", "both"].map(
      (mode) =>
        `${{ a: "A alone", b: "B alone", both: "Both sources" }[mode]}: ${
          live?.[mode]?.valid ? fmt(live[mode].current * 1000) + " mA" : "Connect the circuit"
        }`
    );
  }
  if (state.module === "opamp") {
    const sc = scope(state);
    return [sc.ok ? `Scope: ${sc.running ? "Run" : "Hold"}${sc.stale ? " · earlier settings" : ""}` : `Scope: ${sc.error}`];
  }
  return [];
}
function renderScopeControls() {
  const node = document.querySelector("#scope-controls");
  node.hidden = state.module !== "opamp";
  if (state.module !== "opamp") return;
  const p = parameters(state),
    c = context(state),
    sc = scope(state);
  const connection = (ch, field, label) =>
    `<label>${label}<select data-scope-channel="${ch}" data-scope-field="${field}" aria-label="${label}"><option value="">Disconnected</option>${c.circuit.pins
      .map((pin) => `<option value="${escape(pin.id)}" ${c.scope[ch][field] === pin.id ? "selected" : ""}>${escape(pin.name)}</option>`)
      .join("")}</select></label>`;
  node.innerHTML = `<div class="scope-top"><strong>Scope</strong><div><button class="button" data-action="scope-toggle">${
    p.scopeRunning ? "Hold" : "Run scope"
  }</button><button class="button" data-action="scope-autoscale">Auto scale</button></div></div><p class="scope-status ${
    sc.error ? "warning" : ""
  }">${escape(
    sc.error ||
      (sc.ok
        ? `${sc.running ? "Running" : "Held capture"}${sc.stale ? " · settings have changed" : ""} · ${
            sc.trigger.found ? "Triggered" : "No trigger crossing"
          }`
        : "Connect the scope probes.")
  )}</p>
    <div class="scope-channels">${["ch1", "ch2"]
      .map(
        (ch, i) =>
          `<fieldset><legend>${ch.toUpperCase()} · ${
            i ? "output" : "input"
          }</legend><div class="scope-probe-tools"><button class="button" data-tool="${ch}" data-action="tool:${ch}">Place tip</button><button class="button" data-action="scope-ground:${ch}">Place ground</button></div>${connection(
            ch,
            "signal",
            `${ch.toUpperCase()} tip`
          )}${connection(ch, "ground", `${ch.toUpperCase()} ground`)}${select(
            `${ch}Scale`,
            "V / div",
            OPTIONS[`${ch}Scale`],
            (v) => `${v} V`
          )}</fieldset>`
      )
      .join("")}</div>
    <div class="scope-time">${controlBlock(select("timeDiv", "Time / div", OPTIONS.timeDiv, (v) => `${v} ms`))}${controlBlock(
      select("triggerEdge", "Trigger edge", ["rising", "falling"], (v) => (v === "rising" ? "Rising" : "Falling"))
    )}<label class="control-block"><span class="control-label">Trigger level · CH1</span><div class="number-unit"><input data-param="triggerLevel" aria-label="Trigger level" type="number" step="0.1" min="-15" max="15" value="${
      p.triggerLevel
    }"><span>V</span></div></label></div><p class="hint">Both ground clips share circuit GND. Scales change the view, not the circuit.</p>`;
}
function graphForVR(g) {
  if (g.bars) {
    const max = Math.max(...g.bars.map((b) => Math.abs(b.value ?? 0)), 1) * 1.25;
    return {
      title: g.title,
      subtitle: g.subtitle,
      xLabel: "Source case",
      yLabel: "Current (mA)",
      xTicks: g.bars.map((b, i) => ({ position: 0.18 + i * 0.3, label: b.name })),
      yTicks: [-max, 0, max].map((v) => ({ position: 0.5 + v / (2 * max), label: fmt(v, 2) })),
      series: g.bars
        .filter((b) => Number.isFinite(b.value))
        .map((b) => {
          const i = g.bars.indexOf(b);
          return {
            color: b.color,
            points: [
              [0.18 + i * 0.3, 0.5],
              [0.18 + i * 0.3, 0.5 + b.value / (2 * max)],
            ],
          };
        }),
    };
  }
  return {
    title: g.title,
    subtitle: g.subtitle,
    xLabel: g.xLabel,
    yLabel: g.yLabel,
    xDivisions: state.module === "opamp" ? 10 : 4,
    yDivisions: state.module === "opamp" ? 8 : 4,
    xTicks: Array.from({ length: state.module === "opamp" ? 6 : 5 }, (_, i) => {
      const count = state.module === "opamp" ? 5 : 4;
      return { position: i / count, label: fmt((g.xMax * i) / count, 2) };
    }),
    yTicks: Array.from({ length: 5 }, (_, i) => ({ position: i / 4, label: fmt(g.yMin + ((g.yMax - g.yMin) * i) / 4, 2) })),
    marker: g.marker ? { x: g.marker.x / g.xMax, y: (g.marker.y - g.yMin) / (g.yMax - g.yMin) } : null,
    reference: g.tau ? { x: g.tau / g.xMax, label: "1 τ" } : null,
    series: g.series.map((line) => ({ color: line.color, points: line.points.map(([x, y]) => [x / g.xMax, (y - g.yMin) / (g.yMax - g.yMin)]) })),
  };
}

function renderConnections() {
  const { circuit, wires, probes } = context(state);
  const options = circuit.pins.map((p) => `<option value="${escape(p.id)}">${escape(p.name)} [${escape(p.id)}]</option>`).join("");
  for (const id of ["wire-from", "wire-to"]) {
    const el = document.getElementById(id),
      before = el.value;
    el.innerHTML = options;
    if (circuit.pins.some((p) => p.id === before)) el.value = before;
  }
  for (const color of ["red", "black"]) {
    const el = document.getElementById(`${color}-probe`);
    el.innerHTML = '<option value="">Disconnected</option>' + options;
    el.value = probes[color] || "";
  }
  document.querySelector("#wire-list").innerHTML = wires.length
    ? wires
        .map(
          ([a, b], i) =>
            `<div class="wire-row"><span><code>${escape(a)}</code> <span>↔</span> <code>${escape(
              b
            )}</code></span><button data-remove-wire="${i}" aria-label="Remove connection ${escape(a)} to ${escape(b)}">Remove</button></div>`
        )
        .join("")
    : '<p class="empty-wires">No leads connected. Start with the common ground connections.</p>';
  document.querySelector("#restore-button").hidden = state.mode !== "explore";
}

function chartSVG(g, index = 0) {
  const W = 640,
    H = 218,
    L = 52,
    R = 20,
    T = 18,
    B = 38,
    pw = W - L - R,
    ph = H - T - B;
  if (g.bars) {
    const max = Math.max(...g.bars.map((b) => Math.abs(b.value ?? 0)), 1) * 1.25,
      zero = T + ph / 2,
      scale = ph / (2 * max);
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${escape(g.title)}">${[-max, 0, max]
      .map(
        (v) =>
          `<line x1="${L}" y1="${zero - v * scale}" x2="${W - R}" y2="${zero - v * scale}" class="grid-line"/><text x="${L - 9}" y="${
            zero - v * scale + 4
          }" text-anchor="end">${fmt(v, 1)}</text>`
      )
      .join("")}${g.bars
      .map((b, i) => {
        const x = L + 75 + i * 175,
          y = zero - (b.value ?? 0) * scale;
        if (!Number.isFinite(b.value))
          return `<text x="${x + 36}" y="${zero - 8}" text-anchor="middle">—</text><text x="${x + 36}" y="${H - 15}" text-anchor="middle">${escape(
            b.name
          )}</text>`;
        return `<rect x="${x}" y="${Math.min(zero, y)}" width="72" height="${Math.max(1, Math.abs(b.value * scale))}" rx="3" fill="${
          b.color
        }"/><text x="${x + 36}" y="${b.value >= 0 ? y - 9 : y + 17}" text-anchor="middle" class="bar-value">${fmt(b.value)} mA</text><text x="${
          x + 36
        }" y="${H - 15}" text-anchor="middle">${b.name}</text>`;
      })
      .join("")}</svg>`;
  }
  const x = (n) => L + (n / g.xMax) * pw,
    y = (n) => T + ph - ((n - g.yMin) / (g.yMax - g.yMin)) * ph;
  let result = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${escape(
    g.title
  )}"><defs><clipPath id="plot-clip-${index}"><rect x="${L}" y="${T}" width="${pw}" height="${ph}"/></clipPath></defs>`;
  const xDivisions = state.module === "opamp" ? 10 : 4;
  const yDivisions = state.module === "opamp" ? 8 : 4;
  for (let i = 0; i <= xDivisions; i++) {
    const value = (g.xMax * i) / xDivisions;
    result += `<line x1="${x(value)}" y1="${T}" x2="${x(value)}" y2="${T + ph}" class="grid-line"/>`;
    if (xDivisions === 4 || i % 2 === 0) result += `<text x="${x(value)}" y="${H - 22}" text-anchor="middle">${fmt(value, 2)}</text>`;
  }
  for (let i = 0; i <= yDivisions; i++) {
    const value = g.yMin + ((g.yMax - g.yMin) * i) / yDivisions;
    result += `<line x1="${L}" y1="${y(value)}" x2="${W - R}" y2="${y(value)}" class="grid-line"/>`;
    if (yDivisions === 4 || i % 2 === 0) result += `<text x="${L - 10}" y="${y(value) + 4}" text-anchor="end">${fmt(value, 2)}</text>`;
  }
  result += `<g clip-path="url(#plot-clip-${index})">`;
  if (g.limits)
    for (const v of g.limits) result += `<line x1="${L}" y1="${y(v)}" x2="${W - R}" y2="${y(v)}" stroke="#c6a885" stroke-dasharray="4 5"/>`;
  if (g.tau)
    result += `<line x1="${x(g.tau)}" y1="${T}" x2="${x(g.tau)}" y2="${T + ph}" stroke="#bb7549" stroke-dasharray="4 5"/><text x="${
      x(g.tau) + 5
    }" y="${T + 12}">1 τ</text>`;
  for (const line of g.series)
    result += `<path d="${line.points.map(([a, b], i) => `${i ? "L" : "M"}${x(a).toFixed(2)},${y(b).toFixed(2)}`).join(" ")}" fill="none" stroke="${
      line.color
    }" stroke-width="2.6"/>`;
  if (g.marker && Number.isFinite(g.marker.y))
    result += `<circle cx="${x(g.marker.x)}" cy="${y(g.marker.y)}" r="5" fill="#fff" stroke="#b77636" stroke-width="2.5"/>`;
  result += `</g><text x="${L + pw / 2}" y="${H - 3}" text-anchor="middle" class="axis-label">${escape(
    g.xLabel
  )}</text><text x="${L}" y="11" class="axis-label">${escape(g.yLabel)}</text></svg>`;
  return result;
}

function renderReference() {
  document.querySelector("#schematic").innerHTML =
    `<div class="schematic-heading"><strong>Reference circuit</strong><span>Values follow the settings.</span></div>` +
    renderSchematic(state.module, parameters(state)) +
    `<p>This is the target wiring. Your leads and voltage probes are on the 3D bench.</p>`;
}

function renderLive() {
  const m = measure(state),
    p = parameters(state),
    c = context(state),
    g = plot(state),
    ms = metrics(state);
  document.querySelector("#readings").innerHTML = ms
    .map((r) => `<div class="reading"><span>${r.label}</span><div>${escape(r.value)}<small>${r.unit}</small></div><p>${escape(r.detail)}</p></div>`)
    .join("");
  const status = document.querySelector("#circuit-status");
  status.textContent = m.ok ? (c.correct ? "Circuit connected" : "Check wiring") : "Connect the circuit";
  status.classList.toggle("warning", !m.ok || !c.correct);
  document.querySelector("#chart-title").textContent = g.title;
  document.querySelector("#chart-subtitle").textContent = g.subtitle;
  document.querySelector("#chart-legend").innerHTML = g.series
    .map((s) => `<span><i style="background:${s.color}"></i>${escape(s.name)}</span>`)
    .join("");
  document.querySelector("#chart").innerHTML = g.panels?.length
    ? g.panels
        .map(
          (panel, i) =>
            `<div class="trace-panel"><h3>${escape(panel.title)}</h3>${chartSVG(panel, i)}${
              panel.subtitle ? `<p>${escape(panel.subtitle)}</p>` : ""
            }</div>`
        )
        .join("")
    : chartSVG(g);
  document.querySelector("#feedback").textContent = !m.ok && state.mode === "explore" ? m.error : state.feedback;
  if (state.module === "transient") {
    document.querySelector("#simulation-time").textContent = `${fmt(p.time * 1000)} ms`;
    const slider = document.querySelector("#time-slider");
    if (document.activeElement !== slider) slider.value = p.time / transient({ ...p, source: 5 }).tau;
    document.querySelector("#play-button").innerHTML = svgIcon("play") + (p.playing ? "Pause" : "Run");
  }
  for (const el of document.querySelectorAll("[data-tool]")) el.classList.toggle("active", el.dataset.tool === state.tool);
  const graph = graphForVR(g);
  if (g.panels?.length) graph.panels = g.panels.map(graphForVR);
  const instructions = {
    select: "Click a part to change its value. Drag empty space to turn the board.",
    wire: state.selectedTerminal
      ? `From ${
          c.circuit.pins.find((pin) => pin.id === state.selectedTerminal)?.name || state.selectedTerminal
        } → select the next terminal. Esc cancels.`
      : "Click the first terminal, then the second. Hover over a terminal to read its name.",
    red: "Click a terminal for the red voltage probe.",
    black: "Click a terminal for the black voltage probe.",
    remove: "Click a lead to remove it. Undo restores the last change.",
    ch1: "Click a terminal for the CH1 scope tip.",
    ch2: "Click a terminal for the CH2 scope tip.",
    scopeGround: "Click circuit ground for the selected scope ground lead.",
  };
  document.querySelector("#bench-help").textContent = instructions[state.tool] || state.feedback;
  document.querySelector("#cancel-wire").hidden = !state.selectedTerminal;
  document.querySelector("#source-comparison").hidden = state.module !== "superposition";
  if (state.module === "superposition") renderSourceComparison();
  const lines = [
    ...ms.map((r) => `${r.label}: ${r.value} ${r.unit}`),
    `Tool: ${
      {
        wire: "Connect",
        select: "Select",
        red: "Red probe",
        black: "Black probe",
        remove: "Remove",
        ch1: "CH1 tip",
        ch2: "CH2 tip",
        scopeGround: "Scope ground",
      }[state.tool] || state.tool
    } | Red: ${c.probes.red || "—"} | Black: ${c.probes.black || "—"}`,
    state.module === "transient" ? `Time: ${fmt(p.time * 1000)} ms | playback ${p.speed}×` : "",
    !m.ok ? m.error : "",
    `Experiment: ${MODULES[state.module].challenge}`,
    `Feedback: ${state.feedback}`,
    ...activityLines(),
  ].filter(Boolean);
  bench?.update({
    components: c.circuit.components,
    wires: c.wires,
    probes: c.probes,
    selectedTerminal: state.selectedTerminal,
    tool: state.tool,
    scope: c.scope,
    selectedPart,
    partActions: selectedPartActionIds(),
    schematicDataURL: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderSchematic(state.module, p))}`,
    live: { title: `Lab ${MODULES[state.module].number} · ${MODULES[state.module].name}`, lines },
    actions: vrActions(state),
    graph,
  });
}

function render() {
  const meta = MODULES[state.module],
    p = parameters(state);
  document.querySelector(".lower-layout").classList.toggle("scope-layout", state.module === "opamp");
  document.querySelector("#lab-number").textContent = meta.number;
  document.querySelector("#topic-label").textContent = meta.topic;
  document.querySelector("#module-title").textContent = meta.title;
  document.querySelector("#module-description").textContent = meta.description;
  document.querySelector("#new-attempt").hidden = state.mode !== "build";
  document.querySelector("#bench-caption").textContent = p.representation
    ? `${p.representation} circuit`
    : p.configuration
      ? `${p.configuration} amplifier`
      : p.kind
        ? `${p.kind} circuit`
        : "Two-source circuit";
  for (const b of document.querySelectorAll(".module-link")) {
    const active = b.dataset.module === state.module;
    b.classList.toggle("active", active);
    b.setAttribute("aria-current", active ? "page" : "false");
  }
  for (const b of document.querySelectorAll(".mode-switch button")) {
    b.classList.toggle("active", b.dataset.action === state.mode);
    b.setAttribute("aria-pressed", b.dataset.action === state.mode ? "true" : "false");
  }
  renderControls();
  renderConnections();
  renderReference();
  renderLive();
}

function doAction(id) {
  if (id.startsWith("module:") || /set:(representation|kind|configuration):/.test(id)) selectedPart = null;
  action(state, id);
  render();
  if (/^(tool:ch[12]|scope-ground:)/.test(id) && !xrStatus.active && !panelPreview) {
    setReference(false);
    document.querySelector("#bench").scrollIntoView({ block: "center", behavior: "instant" });
  }
}
app.addEventListener("click", (e) => {
  if (e.target.closest("#close-part")) {
    selectedPart = null;
    render();
    return;
  }
  const target = e.target.closest("[data-action]");
  if (target) {
    doAction(target.dataset.action);
    return;
  }
  const remove = e.target.closest("[data-remove-wire]");
  if (remove) {
    const previousTool = state.tool;
    state.tool = "remove";
    removeWire(state, Number(remove.dataset.removeWire));
    state.tool = previousTool;
    render();
    return;
  }
  if (e.target.closest("[data-close]")) e.target.closest("dialog").close();
});
app.addEventListener("change", (e) => {
  const el = e.target;
  if (el.dataset.param) {
    change(state, el.dataset.param, Number.isNaN(Number(el.value)) ? el.value : Number(el.value));
    render();
  }
  if (el.dataset.scopeChannel) {
    const field = el.dataset.scopeField;
    setProbe(state, `${el.dataset.scopeChannel}${field === "ground" ? "Ground" : ""}`, el.value || null);
    render();
  }
  if (el.id === "red-probe" || el.id === "black-probe") {
    setProbe(state, el.id.split("-")[0], el.value || null);
    renderLive();
  }
});
app.addEventListener("input", (e) => {
  const input = e.target;
  if (input.dataset.param && input.type === "number" && input.value !== "") {
    change(state, input.dataset.param, Number(input.value));
    renderLive();
  }
  if (e.target.id === "load-slider") {
    change(state, "load", OPTIONS.load[Number(e.target.value)]);
    document.querySelector("#param-load").value = parameters(state).load;
    renderLive();
    renderReference();
  }
  if (e.target.id === "time-slider") {
    const p = parameters(state);
    p.playing = false;
    change(state, "time", Number(e.target.value) * transient({ ...p, source: 5 }).tau);
    renderLive();
  }
});
document.querySelector("#add-wire").addEventListener("click", () => {
  const from = document.querySelector("#wire-from").value,
    to = document.querySelector("#wire-to").value;
  state.tool = "wire";
  state.selectedTerminal = null;
  terminal(state, from);
  terminal(state, to);
  render();
});
document.querySelector(".brand").addEventListener("click", (e) => {
  e.preventDefault();
  doAction("module:thevenin");
});
document.addEventListener("keydown", (e) => {
  if (e.target.closest("input,textarea,select,button") || document.querySelector("dialog[open]")) return;
  const shortcuts = { 1: "tool:select", 2: "tool:wire", 3: "tool:red", 4: "tool:black", 5: "tool:remove", Escape: "cancel" };
  if (shortcuts[e.key]) {
    e.preventDefault();
    doAction(shortcuts[e.key]);
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "z") {
    e.preventDefault();
    doAction("undo");
  }
});
document.querySelector("#vr-preview-tab").addEventListener("click", () => {
  const next = !panelPreview;
  setReference(false);
  panelPreview = next;
  document.querySelector(".lab-layout").classList.toggle("vr-preview", panelPreview);
  bench?.setPanelPreview(panelPreview);
  document.querySelector("#vr-preview-tab").classList.toggle("active", panelPreview);
  document.querySelector("#bench-tab").classList.toggle("active", !panelPreview && !showReference);
});
document.querySelector("#reset-view").addEventListener("click", () => bench?.resetView());
function setReference(value) {
  if (panelPreview) {
    panelPreview = false;
    bench?.setPanelPreview(false);
    document.querySelector("#vr-preview-tab").classList.remove("active");
  }
  document.querySelector(".lab-layout").classList.remove("vr-preview");
  showReference = value;
  document.querySelector("#schematic").hidden = !value;
  document.querySelector("#bench-tab").classList.toggle("active", !value);
  document.querySelector("#reference-tab").classList.toggle("active", value);
  document.querySelector("#bench").style.visibility = value ? "hidden" : "visible";
  document.querySelector(".stage-bottom").hidden = value;
  document.querySelector(".stage-top").hidden = value;
}
document.querySelector("#bench-tab").addEventListener("click", () => setReference(false));
document.querySelector("#reference-tab").addEventListener("click", () => setReference(true));
function openGuide() {
  document.querySelector("#vr-help-status").textContent = xrStatus.message;
  document.querySelector("#guide-dialog").showModal();
}
for (const id of ["guide-button", "model-guide"]) document.getElementById(id).addEventListener("click", openGuide);
function headsetAddress() {
  const configured = import.meta.env.VITE_HEADSET_URL;
  try {
    const url = new URL(window.location.protocol === "https:" ? window.location.href : configured || window.location.href);
    url.hash = "";
    url.searchParams.delete("inspect-vr");
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
function renderVRStatus(status) {
  xrStatus = status;
  const labels = { checking: "Checking VR…", entering: "Opening VR…", active: "Exit VR", ready: "Enter VR", error: "Try VR again" };
  const label = status.active ? "Exit VR" : labels[status.kind] || (status.supported ? "Enter VR" : "Use a headset");
  const button = document.querySelector("#vr-button");
  button.innerHTML = svgIcon("vr") + " " + label;
  button.title = status.message;
  button.disabled = status.kind === "checking" || status.kind === "entering";
  button.classList.toggle("vr-ready", status.supported);
  for (const id of ["vr-status", "headset-status", "vr-help-status"]) document.getElementById(id).textContent = status.message;
  const enter = document.querySelector("#headset-enter");
  enter.hidden = !status.supported || status.active;
  enter.disabled = status.kind === "entering" || status.kind === "checking";
  document.querySelector("#headset-check").disabled = status.kind === "checking" || status.kind === "entering" || status.active;
  document.body.classList.toggle("in-vr", status.active);
  if (status.active) for (const dialog of document.querySelectorAll("dialog[open]")) dialog.close();
}
function openHeadsetHelp() {
  const url = headsetAddress();
  const address = document.querySelector("#headset-address");
  address.innerHTML = url
    ? `<span>Headset link</span><a href="${escape(url)}" target="_blank" rel="noopener">${escape(
        url
      )}</a><button class="button subtle" id="copy-headset-link">Copy link</button><small id="copy-headset-status" role="status"></small>`
    : "<p>This local address works on this computer. A standalone headset needs the lab’s HTTPS link.</p>";
  document.querySelector("#copy-headset-link")?.addEventListener("click", async () => {
    const feedback = document.querySelector("#copy-headset-status");
    try {
      await navigator.clipboard.writeText(url);
      feedback.textContent = "Link copied";
    } catch {
      feedback.textContent = "Select and copy the link above.";
    }
  });
  const fullScreen = document.querySelector("#headset-fullscreen");
  fullScreen.hidden = window.self === window.top;
  fullScreen.href = window.location.href;
  document.querySelector("#headset-status").textContent = xrStatus.message;
  document.querySelector("#headset-dialog").showModal();
}
function enterHeadset() {
  if (!bench || xrStatus.kind === "entering") return;
  if (xrStatus.supported || xrStatus.active) {
    setReference(false);
    // Keep the session request in this click, without awaiting a support check first.
    bench.enterVR();
  } else openHeadsetHelp();
}
document.querySelector("#vr-button").addEventListener("click", enterHeadset);
document.querySelector("#headset-enter").addEventListener("click", enterHeadset);
document.querySelector("#headset-help").addEventListener("click", openHeadsetHelp);
document.querySelector("#headset-check").addEventListener("click", () => bench?.refreshVRSupport());
document.querySelector("#vr-preview-tab").hidden = !new URLSearchParams(window.location.search).has("inspect-vr");
for (const dialog of document.querySelectorAll("dialog"))
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    }
  });

try {
  bench = createBench({
    container: document.querySelector("#bench"),
    onFrame: tick,
    onPanelPreviewChange: (enabled) => {
      panelPreview = enabled;
      document.querySelector(".lab-layout").classList.toggle("vr-preview", enabled);
      document.querySelector("#vr-preview-tab").classList.toggle("active", enabled);
      document.querySelector("#bench-tab").classList.toggle("active", !enabled && !showReference);
    },
    onTerminal: (id) => {
      terminal(state, id);
      render();
    },
    onWire: (index) => {
      removeWire(state, index);
      render();
    },
    onPart: (id) => {
      selectedPart = id;
      render();
    },
    onHover: (hit) => {
      const label = document.querySelector("#hover-label");
      label.hidden = !hit;
      label.textContent = hit ? `${hit.label}${hit.kind === "part" ? " · click to edit" : ""}` : "";
    },
    onAction: doAction,
    onXRStatus: renderVRStatus,
  });
} catch (error) {
  renderVRStatus({
    kind: "unavailable",
    supported: false,
    active: false,
    message: "3D could not start in this browser. Open the lab in a headset browser.",
  });
  document.querySelector("#bench").innerHTML = `<div class="webgl-error"><h2>3D rendering is unavailable</h2><p>${escape(
    error.message
  )}</p><p>You can still use the circuit reference and terminal controls below.</p></div>`;
}
render();
let last = performance.now(),
  lastRender = 0;
function tick(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  const p = state.params.transient;
  if (p.playing && state.module === "transient" && context(state).correct) {
    advanceTransient(state, dt);
    const finished = !p.playing;
    if (finished || now - lastRender > 100) {
      lastRender = now;
      renderLive();
    }
  }
  if (!bench) requestAnimationFrame(tick);
}
if (!bench) requestAnimationFrame(tick);
