import "./amplifier-app.css";
import {
  CONFIGURATIONS,
  CONFIGURATION_NAMES,
  resistorRoles,
  transfer,
  selectConfiguration,
  matchSubtractor,
  createExperiment,
  electricalSnapshot,
  circuit,
  pinLabel,
  PROBES,
  setParameter,
  connect,
  connectProbe,
  contactPreview,
  leadDrop,
  arrangeCable,
  selectTerminal,
  removeLead,
  undo,
  reset,
  hint,
  advanceHint,
  toggleHints,
  acquisition,
  toggleAcquisition,
  beginAdjustment,
  endAdjustment,
} from "./amplifier-experiment.js";
import { scopeSvg } from "./amplifier-display.js";
import { mountAmplifierScene } from "./amplifier-scene.js";

const state = createExperiment(),
  root = document.querySelector("#app");
const f = (v, d = 3) => (Number.isFinite(v) ? Number(v.toFixed(d)).toLocaleString("en-US", { maximumFractionDigits: d }) : "—");
const label = (id) => pinLabel(id, state.params.configuration);
const pinOptions = () =>
  '<option value="">Choose terminal…</option>' +
  circuit(state)
    .pins.map((p) => `<option value="${p.id}">${label(p.id)}</option>`)
    .join("");
const number = (key, label, value, min, max, step, unit) =>
  `<label class="number-control">${label}<span><input data-param="${key}" aria-label="${label}" type="number" value="${value}" min="${min}" max="${max}" step="${step}"><b>${unit}</b></span></label>`;
root.innerHTML = `<div class="amp-app">
<header class="amp-header"><a href="../projects/metahub/" class="amp-home" aria-label="Back to MetaHub">←</a><div><small>ELEN 221 / LAB 07</small><h1>Operational amplifiers</h1></div><nav aria-label="Circuits laboratories"><a href="?lab=5">05 Thévenin</a><a href="?lab=6">06 Superposition</a><span aria-current="page">07 Amplifiers</span><a href="?lab=8">08 Transients</a></nav><button data-do="undo" id="undo" title="Undo last circuit or cable change">↶ Undo</button><button data-do="reset">Reset</button><button data-do="help" aria-label="Experiment help">?</button></header>
<nav class="amp-phone-tabs" aria-label="Experiment presentation"><button data-view="controls" aria-pressed="false">Controls</button><button data-view="bench" class="active" aria-pressed="true">Bench</button><button data-view="measure" aria-pressed="false">Measure</button></nav>
<main class="amp-workspace" data-view="bench">
<aside class="amp-controls" aria-label="Experiment controls">
<section class="amp-group"><h2><span>1</span>Power supply</h2><div class="amp-supply-controls"><div class="amp-segments" aria-label="Dual supply magnitude">${[
  8, 12, 15,
]
  .map((v) => `<button data-rail="${v}" class="${v === 12 ? "active" : ""}">±${v} V</button>`)
  .join(
    ""
  )}</div><button data-do="power" id="power" aria-pressed="false">○ Off</button></div><div class="amp-rails"><span>+V <b id="rail-plus">+12 V</b></span><span>GND <b>0 V</b></span><span>−V <b id="rail-minus">−12 V</b></span></div></section>
<section class="amp-group amp-configuration-group"><h2><span>2</span>Operational amplifier</h2><label class="amp-label" for="configuration">Configuration</label><select id="configuration" aria-label="Configuration">${CONFIGURATIONS.map(
  (id) => `<option value="${id}">${CONFIGURATION_NAMES[id]}</option>`
).join(
  ""
)}</select><div class="amp-device-note"><b>U1 · 741</b><span>DIP-8 · top view</span></div><p class="amp-small" id="configuration-note"></p></section>
<section class="amp-group amp-components-group"><h2><span>3</span>Component controls</h2><div id="resistor-fields"></div><div class="amp-equation"><span id="transfer-formula"></span><strong id="theory-summary"></strong><span id="measurement-summary"></span><div id="matching-controls" hidden><span id="ratio-status"></span><button data-do="match-subtractor">Match R4</button></div></div></section>
<section class="amp-group amp-input-group"><h2><span>4</span>Input signal</h2><div id="input-fields"></div><p id="input-convention" class="amp-small"></p></section>
<p class="amp-model">Ideal 741 teaching model. Output limit is 1 V inside each rail. Bandwidth, slew rate and loading are omitted.</p>
</aside>
<section class="amp-bench" aria-label="Manual experiment bench">
<div class="amp-stage"><div id="amp-canvas"></div><div class="amp-stage-label"><b>Inverting amplifier</b><span id="circuit-status">Supply off · 0 leads</span></div><div class="amp-stage-tools"><details class="amp-connection-tools"><summary>Connection tools</summary><div class="amp-connect-bar"><div class="amp-endpoints"><label>From<select id="from">${pinOptions()}</select></label><span aria-hidden="true">→</span><label>To<select id="to">${pinOptions()}</select></label><button data-do="connect" class="primary">Connect</button></div><div class="amp-probe-connect"><label>Instrument<select id="probe"><option value="">Choose probe…</option>${Object.entries(
  PROBES
)
  .map(([id, name]) => `<option value="${id}">${name}</option>`)
  .join(
    ""
  )}</select></label><label>At<select id="probe-target">${pinOptions()}</select></label><button data-do="probe">Place</button><button data-do="disconnect" aria-label="Disconnect selected probe">Unplug</button></div></div></details><button data-do="rotate" id="rotate" aria-pressed="false">Rotate view</button><button data-do="home">Home view</button><button data-do="board-view" class="amp-phone-only">Board close-up</button><button data-do="leads">Select lead</button><button data-do="scope" id="scope-desktop">Hold scope</button></div><div class="amp-stage-help">Drag cable to reshape · Drag plug to reconnect · Esc cancels</div><div class="amp-pending-connection" hidden><span id="pending-endpoints"></span><button data-do="connect" class="primary" id="pending-connect">Connect</button><button data-do="cancel-selection" aria-label="Cancel terminal selection">×</button></div><div class="amp-lead-inspector" hidden><label>Lead<select id="lead-list" aria-label="Select a circuit lead"></select></label><strong id="selected-lead"></strong><button data-do="remove">Remove</button><button data-do="close-leads" aria-label="Close lead inspector">×</button></div></div>
<div class="amp-observer"><label><input type="checkbox" id="hints" checked> Hints</label><p id="hint-text"></p><button data-do="hint">Another hint</button></div><p class="amp-status" role="status" id="message"></p>
</section>
<section class="amp-measure-mobile" aria-label="Measurement readings"><h2>Measured response</h2><div id="phone-scope"></div><div id="measure-values"></div><button data-do="scope" id="scope-toggle">Hold scope</button><p id="measure-explanation"></p></section>
</main><dialog id="amp-help"><form method="dialog"><button class="amp-close" aria-label="Close help">×</button></form><h2>One live experiment</h2><p>Drag directly between labeled terminals, or tap two terminals and press Connect. Connection tools provides the same endpoint and probe choices by name for keyboard use. Every lead is your connection. Drag the middle of any cable to bend its route while its endpoints stay fixed. Release keeps the curve you placed; changing settings or the view does not reroute it. Undo restores the previous cable shape. Drag an existing plug to move its end; release away from a socket to unplug it. Shift-drag from an occupied socket to add another lead. Picked-up contacts are open until release. Escape cancels the drag. Click a lead to inspect its endpoints; Undo restores the last electrical change.</p><p>Set each resistor with its physical knob or exact numeric control. Each resistor is independent; Match R4 explicitly sets only R4 = R3 × R2 / R1 for the difference amplifier. Switch on the dual supply when ready. Connect the meter V and COM tips, and each scope signal tip and ground clip, to measure. Probes can be placed in any order.</p><p>Hints highlight a connection or measurement to consider. Another hint changes only the suggestion. Breadboard holes are visual mounting holes; only labeled terminals are electrically active. The labeled GND sockets share the visible common rail; other contacts are isolated.</p><p>Source terminals can be measured before the amplifier is complete. Other incomplete or incorrect amplifier networks do not produce simulated readings; this teaching model checks the selected arrangement rather than solving arbitrary breadboard circuits.</p><p>The chip uses the actual DIP-8 top-view pin order. Unused pins 1, 5 and 8 are not connection targets. AC amplitude is Vpp; DC uses signed volts. The meter reports true RMS for AC and signed DC volts for DC. Both scope traces share one time grid and voltage scale. In the two-input arrangements, Vin1 and Vin2 have independent amplitudes and share waveform, frequency and phase. The weighted adder uses Vout = −Rf(Vin1/Rin1 + Vin2/Rin2). The general difference amplifier uses Vout = −(R2/R1)Vin1 + (1 + R2/R1)R4/(R3 + R4)Vin2. Equal input voltages cancel only when R2/R1 = R4/R3. A two-input transfer is not presented as a single-input gain.</p><p>Reset clears all leads and probes and switches the supply off. Undo can restore the experiment. Rotate view enables camera movement; Home view returns to the working view.</p></dialog></div>`;
let adjustment = null,
  heldContact = null,
  initialDial = 0,
  rotate = false,
  leadListOpen = false,
  renderedConfiguration = null;
const scene = mountAmplifierScene(document.querySelector("#amp-canvas"), {
  holdContact: (contact) => {
    heldContact = contact;
    render();
  },
  dropLead: (index, end, target, route) => {
    leadDrop(state, index, end, target, route);
    render();
  },
  arrangeCable: (kind, id, route, placement) => {
    arrangeCable(state, kind, id, route, placement);
    render();
  },
  terminal: (id) => {
    leadListOpen = false;
    selectTerminal(state, id);
    render();
  },
  connect: (a, b, route) => {
    connect(state, a, b, route);
    render();
  },
  probe: (id, target, placement) => {
    connectProbe(state, id, target, placement);
    render();
  },
  selectProbe: (id) => {
    leadListOpen = false;
    state.selection.probe = id;
    state.selection.from = "";
    state.selection.to = "";
    document.querySelector("#probe").value = id;
    state.message = `${PROBES[id]} selected. Tap a terminal or drag its handle.`;
    render();
  },
  wire: (index) => {
    leadListOpen = true;
    state.selection.wire = index;
    state.selection.from = "";
    state.selection.to = "";
    render();
  },
  beginDial: (id) => {
    adjustment = beginAdjustment(state);
    initialDial = state.params[id];
  },
  turnDial: (id, delta) => {
    let value;
    if (id === "amplitude" || id === "amplitude2")
      value = Math.max(state.params.waveform === "dc" ? -20 : 0, Math.min(20, Math.round((initialDial + delta * 0.02) * 100) / 100));
    else if (id === "frequency") value = Math.max(10, Math.min(100000, Math.round((initialDial * Math.pow(10, delta / 150)) / 10) * 10));
    else value = Math.max(1000, Math.min(100000, Math.round((initialDial + delta * 500) / 1000) * 1000));
    setParameter(state, id, value, false);
    render();
  },
  endDial: () => {
    if (adjustment) endAdjustment(state, adjustment);
    adjustment = null;
    render();
  },
  waveform: () => {
    const waves = ["sine", "square", "triangle", "dc"];
    setParameter(state, "waveform", waves[(waves.indexOf(state.params.waveform) + 1) % waves.length]);
    render();
  },
  power: () => {
    setParameter(state, "powered", !state.params.powered);
    render();
  },
  scope: () => {
    toggleAcquisition(state);
    render();
  },
  scopeAuto: () => {
    scene.framing("bench");
    scene.home();
    render();
  },
  meterPower: () => {
    setParameter(state, "meterOn", !state.params.meterOn);
    render();
  },
});
function renderConfiguration() {
  const p = state.params;
  if (renderedConfiguration === p.configuration) return;
  renderedConfiguration = p.configuration;
  const multi = transfer(state).multi,
    roles = resistorRoles(p.configuration);
  root.querySelector(".amp-app").dataset.configuration = p.configuration;
  document.querySelector("#configuration").value = p.configuration;
  document.querySelector(".amp-stage-label b").textContent = CONFIGURATION_NAMES[p.configuration];
  document.querySelector("#configuration-note").textContent = {
    inverting: "Signal enters pin 2 (−IN). Pin 3 (+IN) is the ground reference.",
    noninverting: "Vin enters pin 3 (+IN). Rg returns pin 2 to GND.",
    adder: "Independent input resistors sum Vin1 and Vin2 at pin 2.",
    subtractor: "Four independent resistor roles; matched ratios cancel equal inputs.",
  }[p.configuration];
  document.querySelector("#resistor-fields").innerHTML =
    `<div class="amp-pot-grid">${roles
      .map((r) => `<div>${number(r.key, r.name, p[r.key], 1000, 100000, 1000, "Ω")}<small class="amp-resistor-role">${r.role}</small></div>`)
      .join("")}</div>` +
    (!multi
      ? `<div class="amp-pot-grid amp-resistor-sliders">${roles
          .map(
            (r) =>
              `<input type="range" data-param="${r.key}" min="1000" max="100000" step="1000" value="${p[r.key]}" aria-label="${
                r.name
              } potentiometer">`
          )
          .join("")}</div>`
      : "");
  const wave = `<label class="amp-wave-control"><span class="amp-label">${
    multi ? "Shared waveform" : "Waveform"
  }</span><select id="waveform" data-param="waveform" aria-label="Waveform"><option value="sine">Sine</option><option value="square">Square</option><option value="triangle">Triangle</option><option value="dc">DC</option></select></label>`;
  const frequency = number("frequency", multi ? "Shared frequency" : "Frequency", p.frequency, 10, 100000, 10, "Hz");
  document.querySelector("#input-fields").innerHTML = multi
    ? `<div class="amp-pot-grid amp-wave-grid">${wave}${frequency}</div><div class="amp-pot-grid amp-inputs">${number(
        "amplitude",
        "Vin1 amplitude",
        p.amplitude,
        0,
        20,
        0.1,
        "Vpp"
      )}${number("amplitude2", "Vin2 amplitude", p.amplitude2, 0, 20, 0.1, "Vpp")}</div>`
    : `${wave}<div class="amp-pot-grid amp-inputs">${number("amplitude", "Vin amplitude", p.amplitude, 0, 20, 0.1, "Vpp")}${frequency}</div>`;
  for (const id of ["from", "to", "probe-target"]) document.querySelector(`#${id}`).innerHTML = pinOptions();
  document.querySelector("#probe").value = "";
  document.querySelector("#matching-controls").hidden = p.configuration !== "subtractor";
}
function render() {
  renderConfiguration();
  const result = acquisition(contactPreview(state, heldContact)),
    guide = hint(state),
    d = result.diagnostic,
    p = state.params;
  for (const el of root.querySelectorAll("[data-param]")) {
    const key = el.dataset.param;
    el.value = p[key];
    if (key === "frequency") el.disabled = p.waveform === "dc";
    if (key === "amplitude" || key === "amplitude2") {
      el.min = p.waveform === "dc" ? -20 : 0;
      el.nextElementSibling.textContent = p.waveform === "dc" ? "V DC" : "Vpp";
    }
  }
  for (const el of root.querySelectorAll("[data-rail]")) {
    el.classList.toggle("active", +el.dataset.rail === p.rail);
    el.setAttribute("aria-pressed", +el.dataset.rail === p.rail);
  }
  document.querySelector("#power").textContent = p.powered ? "● On" : "○ Off";
  document.querySelector("#power").classList.toggle("on", p.powered);
  document.querySelector("#power").setAttribute("aria-pressed", p.powered);
  document.querySelector("#rail-plus").textContent = `+${p.rail} V`;
  document.querySelector("#rail-minus").textContent = `−${p.rail} V`;
  document.querySelector("#from").value = state.selection.from;
  document.querySelector("#to").value = state.selection.to;
  document.querySelector("#undo").disabled = !state.history.length;
  const relation = result.transfer,
    multi = relation.multi;
  document.querySelector("#transfer-formula").textContent = multi
    ? `Vout = ${f(relation.vin1)} Vin1 ${relation.vin2 < 0 ? "−" : "+"} ${f(Math.abs(relation.vin2))} Vin2`
    : relation.formula;
  document.querySelector("#transfer-formula").title = relation.formula;
  document.querySelector("#theory-summary").textContent = multi ? "Two independent input coefficients" : `Theory ${f(result.theoreticalGain)} V/V`;
  const outputObserved = state.probes.ch2 === "out" && result.channelStats.ch2.mean !== null;
  document.querySelector("#measurement-summary").textContent = multi
    ? `CH2 output ${outputObserved ? f(p.waveform === "dc" ? result.channelStats.ch2.mean : result.channelStats.ch2.vpp) : "—"} ${
        p.waveform === "dc" ? "V DC" : "Vpp"
      }`
    : `Measured ${f(result.response.gain)} V/V ${
        result.response.gain === null ? "" : result.response.phase === "inverted" ? "· 180°" : result.response.phase === "in phase" ? "· 0°" : "· DC"
      }`;
  document.querySelector("#ratio-status").textContent = `R2/R1 ${f(p.rf / p.rin)} · R4/R3 ${f(p.rf2 / p.rin2)} · ${
    relation.matched ? "matched" : "unmatched"
  }`;
  document.querySelector("#hint-text").textContent = guide.text;
  document.querySelector("#message").textContent = ["wrong", "instrument"].includes(d.kind) ? d.text : state.message;
  document.querySelector("#circuit-status").textContent = `Supply ${p.powered ? "on" : "off"} · ${state.wires.length} leads · ${
    result.correct ? "circuit complete" : "connections open"
  }`;
  document.querySelector("#input-convention").textContent =
    (p.waveform === "dc" ? "Signed DC levels · frequency inactive." : "Zero offset · amplitude is peak-to-peak.") +
    (multi ? " Inputs share waveform, frequency and phase." : "");
  const pending = document.querySelector(".amp-pending-connection"),
    probe = state.selection.probe;
  pending.hidden = !(state.selection.from || probe);
  document.querySelector("#pending-endpoints").textContent = probe
    ? `${PROBES[probe]} selected · tap its measurement terminal`
    : state.selection.to
      ? `${label(state.selection.from)} → ${label(state.selection.to)}`
      : `${label(state.selection.from)} · choose the other terminal`;
  document.querySelector("#pending-connect").hidden = !!probe;
  document.querySelector("#pending-connect").disabled = !state.selection.from || !state.selection.to;
  const inspector = document.querySelector(".amp-lead-inspector");
  inspector.hidden = !leadListOpen;
  const list = document.querySelector("#lead-list");
  list.innerHTML =
    '<option value="">Choose lead…</option>' + state.wires.map(([a, b], i) => `<option value="${i}">${label(a)} ↔ ${label(b)}</option>`).join("");
  list.value = state.selection.wire ?? "";
  const lead = state.wires[state.selection.wire];
  document.querySelector("#selected-lead").textContent = lead ? lead.map(label).join(" ↔ ") : "Select a lead to highlight its endpoints.";
  document.querySelector("#measure-values").innerHTML = `<p>Meter <b>${f(p.waveform === "dc" ? result.meter.mean : result.meter.rms)} V ${
    p.waveform === "dc" ? "DC" : "RMS"
  }</b></p><p>CH1 · ${result.channelLabels.ch1} <b>${f(p.waveform === "dc" ? result.channelStats.ch1.mean : result.channelStats.ch1.vpp)} ${
    p.waveform === "dc" ? "V DC" : "Vpp"
  }</b></p><p>CH2 · ${result.channelLabels.ch2} <b>${f(p.waveform === "dc" ? result.channelStats.ch2.mean : result.channelStats.ch2.vpp)} ${
    p.waveform === "dc" ? "V DC" : "Vpp"
  }</b></p>${
    multi
      ? `<p class="amp-transfer-reading">${document.querySelector("#transfer-formula").textContent}</p>`
      : `<p>Gain <b>${f(result.response.gain)} V/V</b></p>`
  }`;
  document.querySelector("#phone-scope").innerHTML = scopeSvg(result);
  document.querySelector("#measure-explanation").textContent = result.stale
    ? "Held capture is from previous settings. Run the scope again."
    : result.clipped
      ? "Output is clipped. Reduce the input amplitude to measure linear gain."
      : result.response.error ||
        (result.response.phase === "inverted"
          ? "The output is inverted: positive input peaks align with negative output peaks."
          : result.response.phase === "DC"
            ? "The signed DC reading follows the selected transfer."
            : "Input and output peaks are in phase.");
  for (const el of root.querySelectorAll("[data-do=scope]")) el.textContent = state.running ? "Hold scope" : "Run scope";
  scene.update(state, result, guide);
}
root.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  scene.cancelInteraction();
  if (btn.dataset.rail) {
    setParameter(state, "rail", +btn.dataset.rail);
    render();
    return;
  }
  if (btn.dataset.view) {
    state.view = btn.dataset.view;
    document.querySelector(".amp-workspace").dataset.view = state.view;
    for (const el of root.querySelectorAll("button[data-view]")) {
      el.classList.toggle("active", el.dataset.view === state.view);
      el.setAttribute("aria-pressed", el.dataset.view === state.view);
    }
    render();
    return;
  }
  switch (btn.dataset.do) {
    case "match-subtractor":
      matchSubtractor(state);
      break;
    case "board-view":
      scene.framing("board");
      break;
    case "power":
      setParameter(state, "powered", !state.params.powered);
      break;
    case "connect":
      connect(state, state.selection.from, state.selection.to);
      break;
    case "cancel-selection":
      state.selection = { from: "", to: "", wire: null, probe: null };
      break;
    case "probe":
      connectProbe(state, document.querySelector("#probe").value, document.querySelector("#probe-target").value || null);
      break;
    case "disconnect":
      connectProbe(state, document.querySelector("#probe").value, null);
      break;
    case "leads":
      leadListOpen = !leadListOpen;
      break;
    case "close-leads":
      leadListOpen = false;
      break;
    case "remove":
      removeLead(state);
      break;
    case "undo":
      undo(state);
      break;
    case "reset":
      reset(state);
      break;
    case "hint":
      advanceHint(state);
      break;
    case "scope":
      toggleAcquisition(state);
      break;
    case "rotate":
      rotate = !rotate;
      scene.rotate(rotate);
      btn.setAttribute("aria-pressed", rotate);
      btn.textContent = rotate ? "Lock view" : "Rotate view";
      break;
    case "home":
      scene.framing("bench");
      scene.home();
      break;
    case "help":
      document.querySelector("#amp-help").showModal();
      break;
  }
  render();
});
root.addEventListener("change", (e) => {
  const el = e.target;
  scene.cancelInteraction();
  if (el.id === "configuration") {
    selectConfiguration(state, el.value);
    leadListOpen = false;
    render();
    return;
  }
  if (el.dataset.param) {
    setParameter(state, el.dataset.param, el.type === "number" || el.type === "range" ? +el.value : el.value);
    el.value = state.params[el.dataset.param];
    if (el.dataset.param === "waveform") for (const input of root.querySelectorAll("[data-param=amplitude]")) input.value = state.params.amplitude;
    if (el.type === "range" && adjustment) {
      endAdjustment(state, adjustment);
      adjustment = null;
    }
  }
  if (el.id === "lead-list") {
    state.selection.wire = el.value === "" ? null : Number(el.value);
    state.selection.from = "";
    state.selection.to = "";
  }
  if (el.id === "from" || el.id === "to") {
    leadListOpen = false;
    state.selection[el.id] = el.value;
    state.selection.wire = null;
  }
  if (el.id === "hints") toggleHints(state, el.checked);
  if (el.id === "probe") {
    state.selection.probe = el.value || null;
    document.querySelector("#probe-target").value = state.probes[el.value] || "";
  }
  render();
});
root.addEventListener("input", (e) => {
  if (e.target.type === "range") {
    if (!adjustment) adjustment = electricalSnapshot(state);
    setParameter(state, e.target.dataset.param, +e.target.value, false);
    render();
  }
});
root.addEventListener("pointerup", (event) => {
  if (adjustment && event.target.matches('input[type="range"]')) {
    endAdjustment(state, adjustment);
    adjustment = null;
    render();
  }
});
root.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    state.selection = { from: "", to: "", wire: null, probe: null };
    render();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "z" && !["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
    e.preventDefault();
    undo(state);
    render();
  }
});
render();
