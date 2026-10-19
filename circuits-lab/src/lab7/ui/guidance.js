import "./guidance.css";
import { PHASES } from "../sim/guide.js";
import { CONFIGURATIONS } from "../model/amplifier.js";

/**
 * The teaching layer, as the desktop rail. The same content, in the same order,
 * that the world-anchored panel carries in the headset.
 *
 * Four numbered groups in the brief's order, one NEXT action, and measured gain
 * beside theoretical. Only the current group is expanded; a student never reads
 * four open panels at once.
 */

const escape = (value) => String(value).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

const gainText = (value) => (Number.isFinite(value) ? `${value < 0 ? "−" : "+"}${Math.abs(value).toFixed(2)}` : "—");

export function createGuidance(host, { onSelectConfiguration, onEnterVR } = {}) {
  const root = document.createElement("aside");
  root.className = "l7-rail";
  root.innerHTML = `
    <header class="l7-head">
      <div>
        <small>ELEN 221 · LAB 07</small>
        <h1 id="l7-config-name">Inverting amplifier</h1>
        <p id="l7-phase">Step 1 of 5 · Select</p>
      </div>
      <button type="button" class="l7-vr" id="l7-vr" hidden>Enter VR</button>
    </header>
    <label class="l7-select">
      <span>Configuration</span>
      <select id="l7-config">
        ${Object.values(CONFIGURATIONS)
          .map((spec) => `<option value="${spec.id}">${escape(spec.name)}</option>`)
          .join("")}
      </select>
    </label>
    <ol class="l7-groups" id="l7-groups"></ol>
    <section class="l7-next" id="l7-next">
      <span class="l7-key">NEXT</span>
      <p id="l7-next-text"></p>
    </section>
    <section class="l7-gain">
      <div>
        <span class="l7-key">MEASURED</span>
        <strong id="l7-measured">—</strong>
        <small id="l7-agreement"></small>
      </div>
      <div>
        <span class="l7-key">THEORETICAL</span>
        <strong id="l7-theory">—</strong>
        <small id="l7-formula"></small>
      </div>
    </section>
    <p class="l7-model">Ideal 741 teaching model. The output swings to 1.5 V inside each rail; bandwidth, slew rate and loading are not modelled.</p>
  `;
  host.append(root);

  const el = (id) => root.querySelector(`#${id}`);
  const configSelect = el("l7-config");
  const vrButton = el("l7-vr");

  configSelect.addEventListener("change", () => onSelectConfiguration?.(configSelect.value));
  vrButton.addEventListener("click", () => onEnterVR?.());

  function setVR(status) {
    vrButton.hidden = status?.kind !== "ready" && status?.kind !== "active";
    vrButton.textContent = status?.message ?? "Enter VR";
    vrButton.disabled = status?.kind === "active";
  }

  function render(state, result) {
    const { guidance, theory, measured } = result;
    el("l7-config-name").textContent = CONFIGURATIONS[state.configuration].name;
    if (configSelect.value !== state.configuration) configSelect.value = state.configuration;
    const phase = guidance.phase;
    el("l7-phase").textContent = `Step ${phase.step} of ${PHASES.length} · ${phase.name}`;

    el("l7-groups").innerHTML = guidance.groups
      .map((group) => {
        const current = !group.done;
        const mark = group.done ? "✓" : group.n;
        return `<li class="${group.done ? "done" : "now"}">
          <span class="l7-chip">${mark}</span>
          <span class="l7-title">${escape(group.title)}<small>${escape(group.summary)}</small></span>
        </li>`;
      })
      .join("");

    const next = guidance.next;
    el("l7-next").dataset.fault = next.fault ? "true" : "false";
    el("l7-next-text").textContent = next.text;

    el("l7-measured").textContent = gainText(measured.gain);
    el("l7-theory").textContent = gainText(theory.value);
    el("l7-formula").textContent = theory.value === null ? "two inputs — no single gain" : result.coefficients.formula;

    const agreement = theory.agreement;
    const note = el("l7-agreement");
    if (measured.error) {
      note.textContent = measured.error;
      note.dataset.tone = "muted";
    } else if (agreement?.agrees) {
      note.textContent = "matches theory";
      note.dataset.tone = "ok";
    } else if (agreement && agreement.agrees === false) {
      note.textContent = `differs from theory by ${(agreement.deviation * 100).toFixed(0)}%`;
      note.dataset.tone = "warn";
    } else {
      note.textContent = "";
      note.dataset.tone = "muted";
    }
  }

  return { root, render, setVR, dispose: () => root.remove() };
}
