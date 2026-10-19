import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createRoom, BENCH } from "./scene/room.js";
import { createMaterials } from "./hardware/materials.js";
import { createParts } from "./hardware/parts.js";
import { createInstruments } from "./scene/instruments.js";
import { createBench, LAYOUT } from "./scene/bench.js";
import { createLeads, colourFor } from "./scene/leads.js";
import { createManipulator } from "./xr/manipulate.js";
import { createXR } from "./xr/session.js";
import { createGuidance } from "./ui/guidance.js";
import { STATE, SIGNAL, mm } from "./design/tokens.js";
import { terminalsFor, TERMINALS } from "./sim/circuit.js";
import {
  createExperiment,
  readings,
  connect,
  placeProbe,
  dropLeadEnd,
  setConfiguration,
  setPower,
  setRail,
  setResistor,
  setSource,
  setMeterMode,
  RESISTOR_RANGE,
} from "./sim/experiment.js";

/**
 * Lab 7, assembled.
 *
 * The desktop pointer and the headset controllers both feed the same manipulator,
 * so there is one set of rules about holding a lead and one place to keep them
 * correct.
 */

export function mountLab7(host) {
  host.classList.add("l7-app");
  const stage = document.createElement("div");
  stage.className = "l7-stage";

  const state = createExperiment();
  const ui = createGuidance(host, {
    onSelectConfiguration: (id) => {
      if (setConfiguration(state, id)) {
        bench.applyConfiguration(state.configuration);
        refresh();
      }
    },
    onEnterVR: () => xr.enter(),
  });
  host.append(stage);

  // ---- renderer ----------------------------------------------------------
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(54, 1, 0.02, 60);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  stage.append(renderer.domElement);
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.setAttribute("aria-label", "Operational amplifier bench. Drag between labelled terminals to connect; drag a knob to adjust it.");

  const controls = new OrbitControls(camera, renderer.domElement);
  // Framed to hold the whole 1.8 m bench: far enough back to see it, low enough
  // that the instrument panels are read square-on rather than from above.
  // A working view, not a showroom view: close enough that the breadboard — the
  // thing the student actually builds on — is the largest object in frame, with
  // the instrument row readable behind it. Scroll out to see the whole bench.
  controls.target.set(0, BENCH.height + 0.02, 0.09);
  controls.minDistance = 0.3;
  controls.maxDistance = 3.2;
  controls.maxPolarAngle = Math.PI / 2 - 0.03;
  camera.position.set(0, BENCH.height + 0.52, 0.86);
  controls.update();

  // ---- the laboratory ----------------------------------------------------
  const materials = createMaterials(renderer);
  const parts = createParts(materials);
  const room = createRoom(scene, renderer, materials);

  const pickables = [];
  /**
   * Make an object pickable. Merges rather than replaces: parts.js stores a knob's
   * pointer and a jack's contact offset in userData, and overwriting them silently
   * broke both.
   */
  const register = (object, data) => {
    object.traverse?.((child) => {
      if (child.isMesh) {
        child.userData = { ...child.userData, ...data, owner: object };
        pickables.push(child);
      }
    });
    object.userData = { ...object.userData, ...data, owner: object };
  };

  const bench = createBench({ scene, parts, materials, register });
  const instruments = createInstruments({ parts, materials, register });
  bench.placeInstrument(instruments.supply, LAYOUT.supply);
  bench.placeInstrument(instruments.generator, LAYOUT.generator);
  bench.placeInstrument(instruments.scope, LAYOUT.scope);
  bench.placeInstrument(instruments.meter, LAYOUT.meter);
  bench.applyConfiguration(state.configuration);

  const leads = createLeads({ scene, parts, materials });

  // The single guided highlight. Exactly one exists at any moment.
  const guideRing = parts.ring(STATE.next, mm(8));
  guideRing.visible = false;
  scene.add(guideRing);
  const dropRing = parts.ring(STATE.valid, mm(9));
  dropRing.visible = false;
  scene.add(dropRing);

  const hint = document.createElement("p");
  hint.className = "l7-hint";
  stage.append(hint);

  // ---- holding a lead ----------------------------------------------------
  const contactOf = (id) => bench.contactOf(id) ?? instrumentContact(id);
  function instrumentContact(id) {
    for (const entry of instruments.all.values()) {
      const socket = entry.jacks.get(id);
      if (socket) return socket.localToWorld(new THREE.Vector3(0, 0, socket.userData.contactOffset ?? mm(3)));
    }
    return null;
  }

  const manipulator = createManipulator({
    contactOf,
    candidates: () => [...terminalsFor(state.configuration), ...Object.keys(state.probes)],
    onHighlight: (id) => {
      dropRing.visible = !!id;
      if (id) {
        const point = contactOf(id);
        if (point) dropRing.position.copy(point);
      }
    },
    onConnect: (held, terminal) => {
      if (held.kind === "draw") {
        const probe = held.terminal.startsWith("meter.") || held.terminal.startsWith("scope.") ? held.terminal : null;
        if (probe) placeProbe(state, probe, terminal);
        else if (terminal.startsWith("meter.") || terminal.startsWith("scope.")) placeProbe(state, terminal, held.terminal);
        else connect(state, held.terminal, terminal);
      } else {
        const lead = state.leads[held.lead];
        if (lead) {
          const other = held.end === 0 ? lead.to : lead.from;
          state.leads.splice(held.lead, 1);
          connect(state, other, terminal);
        }
      }
      refresh();
    },
    onDrop: (held, point) => {
      if (held.kind === "lead") dropLeadEnd(state, held.lead, held.end, point.toArray());
      refresh();
    },
    onHaptic: (intensity, ms) => activeHand?.pulse?.(intensity, ms),
  });

  // ---- pointer -----------------------------------------------------------
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let gesture = null;
  let activeHand = null;

  function pick(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, (-(clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(pickables, false)[0] ?? null;
  }

  const UP = new THREE.Vector3(0, 1, 0);
  const benchPlane = new THREE.Plane(UP.clone(), -(BENCH.height + 0.012));

  /**
   * Where a carried plug is, under the mouse.
   *
   * It rides the surface beneath the cursor — the benchtop, a panel, the board —
   * which is what dragging a lead across a real bench does, and it is what brings
   * the plug naturally within a socket's capture radius. Holding it at a fixed
   * distance from the camera instead would float it past every socket at a
   * different depth.
   */
  function pointerPoint(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, (-(clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    // Ride the bench, the board and the instrument cases — but never another
    // cable. A plug that climbs over the leads already on the bench can never
    // reach the socket underneath them.
    const hit = raycaster.intersectObjects(pickables, false).find((candidate) => !["cable", "plug"].includes(candidate.object.userData.kind));
    if (hit) return hit.point.clone().addScaledVector(UP, 0.004);
    const onBench = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(benchPlane, onBench)) return onBench;
    return raycaster.ray.origin.clone().addScaledVector(raycaster.ray.direction, 1.2);
  }

  function beginAt(hit, point) {
    const data = hit.object.userData;
    if (data.kind === "terminal") {
      // A socket always starts a NEW lead. Several leads may share one terminal,
      // which is what a common rail is for.
      manipulator.drawFrom({ terminal: data.id, point, colour: colourFor(data.id, data.id) });
      gesture = { kind: "lead" };
      return true;
    }
    if (data.kind === "plug") {
      const lead = state.leads[data.index];
      if (!lead) return false;
      lead.held = true;
      manipulator.grabLead({ lead: data.index, end: data.end, from: lead.from, to: lead.to, point, colour: colourFor(lead.from, lead.to) });
      gesture = { kind: "lead" };
      return true;
    }
    if (data.kind === "knob") {
      gesture = { kind: "knob", id: data.id, startY: null, start: controlValue(data.id) };
      return true;
    }
    if (data.kind === "key") {
      pressKey(data.id);
      return true;
    }
    if (data.kind === "cable") {
      // Take hold of the cable itself. Both ends stay plugged in; what moves is
      // the belly of the lead, so a student can route a wire out of the way.
      gesture = { kind: "bend", index: data.index };
      return true;
    }
    return false;
  }

  /**
   * Where a control is pointing, 0..1 across its sweep. A knob that does not move
   * when it is turned is the clearest possible sign the bench is fake, so every
   * control's pointer is driven from the value it actually holds.
   */
  function knobFraction(id) {
    const span = (value, min, max) => Math.min(1, Math.max(0, (value - min) / (max - min)));
    const logSpan = (value, min, max) => span(Math.log(value), Math.log(min), Math.log(max));
    if (id in state.resistors) return logSpan(state.resistors[id], RESISTOR_RANGE.min, RESISTOR_RANGE.max);
    if (id === "amplitude") return span(state.sources[0].amplitude, 0, 10);
    if (id === "frequency") return logSpan(state.sources[0].frequency, 10, 100000);
    if (id === "rail") return [8, 12, 15].indexOf(state.rail) / 2;
    if (id === "meterMode") return state.meterMode === "ac" ? 1 : 0;
    if (id === "voltsPerDiv") return 0.5;
    if (id === "timePerDiv") return 0.5;
    return 0.5;
  }

  /** 260 degrees of sweep, as the design system's Knob specifies. */
  const SWEEP = (260 * Math.PI) / 180;
  function applyControls() {
    for (const entry of instruments.all.values()) {
      for (const [id, object] of entry.controls) {
        if (object.userData.kind === "knob") object.rotation.z = SWEEP / 2 - knobFraction(id) * SWEEP;
      }
    }
    for (const [id, module] of bench.modules) {
      module.knob.rotation.z = SWEEP / 2 - knobFraction(id) * SWEEP;
    }
    // Keys show what is selected, and the power key stays pressed in.
    const generator = instruments.generator;
    for (const waveform of ["dc", "sine", "square", "triangle"]) {
      const object = generator.controls.get(`wave.${waveform}`);
      const cap = object?.userData.cap;
      if (!cap) continue;
      const on = state.sources[0].waveform === waveform;
      cap.material = materials.panel(on ? SIGNAL.input : "#8d969c");
      cap.position.z = on ? mm(2.2) : mm(3);
    }
    const power = instruments.supply.controls.get("power")?.userData.cap;
    if (power) {
      power.material = materials.panel(state.powered ? "#c3cace" : "#9aa3a9");
      power.position.z = state.powered ? mm(1.6) : mm(3);
    }
  }

  const controlValue = (id) =>
    id in state.resistors
      ? state.resistors[id]
      : id === "amplitude"
        ? state.sources[0].amplitude
        : id === "frequency"
          ? state.sources[0].frequency
          : id === "rail"
            ? state.rail
            : 0;

  function turn(id, delta) {
    if (id in state.resistors) {
      const next = Math.exp(Math.log(state.resistors[id]) + delta * 0.01);
      setResistor(state, id, Math.round(Math.min(RESISTOR_RANGE.max, Math.max(RESISTOR_RANGE.min, next)) / 100) * 100);
    } else if (id === "amplitude") {
      setSource(state, 0, { amplitude: Math.round((state.sources[0].amplitude + delta * 0.01) * 100) / 100 });
    } else if (id === "frequency") {
      setSource(state, 0, { frequency: Math.round(Math.exp(Math.log(state.sources[0].frequency) + delta * 0.01)) });
    } else if (id === "rail") {
      const rails = [8, 12, 15];
      const index = rails.indexOf(state.rail);
      setRail(state, rails[Math.min(rails.length - 1, Math.max(0, index + Math.sign(delta)))]);
    } else if (id === "meterMode") {
      setMeterMode(state, delta > 0 ? "ac" : "dc");
    }
    refresh();
  }

  function pressKey(id) {
    if (id === "power") setPower(state, !state.powered);
    else if (id.startsWith("wave.")) setSource(state, 0, { waveform: id.slice(5) });
    refresh();
  }

  renderer.domElement.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const hit = pick(event.clientX, event.clientY);
    if (!hit) return;
    if (beginAt(hit, hit.point.clone())) {
      // beginAt decides what kind of gesture this is; do not overwrite it here.
      if (gesture?.kind === "knob") gesture.startY = event.clientY;
      controls.enabled = false;
      renderer.domElement.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    }
  });

  renderer.domElement.addEventListener("pointermove", (event) => {
    if (gesture?.kind === "knob") {
      turn(gesture.id, gesture.startY - event.clientY);
      gesture.startY = event.clientY;
      return;
    }
    if (gesture?.kind === "bend") {
      const lead = state.leads[gesture.index];
      if (lead) {
        lead.bend = pointerPoint(event.clientX, event.clientY).toArray();
        syncLeads();
      }
      return;
    }
    if (manipulator.held) {
      manipulator.moveTo(pointerPoint(event.clientX, event.clientY));
      return;
    }
    const hit = pick(event.clientX, event.clientY);
    const data = hit?.object.userData;
    renderer.domElement.style.cursor = data ? (data.kind === "knob" ? "ns-resize" : "grab") : "default";
    hint.textContent =
      data?.kind === "terminal"
        ? `${TERMINALS[data.id]?.label ?? data.id} · drag to connect`
        : data?.kind === "cable"
          ? "Drag the cable to route it · both ends stay connected"
          : data?.kind === "knob"
            ? "Drag up or down to adjust"
            : "";
  });

  const endGesture = () => {
    if (manipulator.held) manipulator.release();
    gesture = null;
    controls.enabled = !xr.presenting;
    renderer.domElement.style.cursor = "default";
  };
  renderer.domElement.addEventListener("pointerup", endGesture);
  renderer.domElement.addEventListener("pointercancel", endGesture);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && manipulator.held) {
      const held = manipulator.cancel();
      if (held?.kind === "lead" && state.leads[held.lead]) state.leads[held.lead].held = false;
      refresh();
    }
  });

  // ---- VR ----------------------------------------------------------------
  const xr = createXR({
    renderer,
    scene,
    camera,
    controls,
    host: stage,
    onStatus: (status) => ui.setVR(status),
    onGrip: (hand) => {
      activeHand = hand;
      const point = hand.holdPoint();
      const ray = hand.ray();
      raycaster.set(ray.origin, ray.direction);
      const hit = raycaster.intersectObjects(pickables, false)[0];
      if (hit) beginAt(hit, point);
    },
    onMove: (hand) => {
      activeHand = hand;
      manipulator.moveTo(hand.holdPoint());
    },
    onRelease: () => {
      if (manipulator.held) manipulator.release();
    },
    onTrigger: (hand, down) => {
      if (!down) return;
      const ray = hand.ray();
      raycaster.set(ray.origin, ray.direction);
      const hit = raycaster.intersectObjects(pickables, false)[0];
      if (hit?.object.userData.kind === "key") pressKey(hit.object.userData.id);
    },
  });

  // ---- render ------------------------------------------------------------
  let result = readings(state);

  function refresh() {
    result = readings(state);
    // Instruments repaint only when something changed, not every frame.
    instruments.supply.panel.paint(state);
    instruments.generator.panel.paint(state);
    instruments.meter.panel.paint({ ...state, meter: result.meter });
    instruments.scope.panel.paint({
      ch1: result.traces["scope.ch1"],
      ch2: result.traces["scope.ch2"],
      scale: { ch1: 1, ch2: 2, time: Math.round(1e6 / state.sources[0].frequency / 10) },
    });
    bench.update(state);
    applyControls();
    for (const [, lamp] of instruments.supply.indicators) lamp.material = materials.led("#43e08a", state.powered);
    syncLeads();
    placeGuideRing();
    ui.render(state, result);
  }

  const cablePickables = new Set();
  function syncLeads(override) {
    const held = override ?? manipulator.held ?? null;
    leads.sync(state.leads, (id) => (id ? contactOf(id) : null), held ? { lead: held.lead, end: held.end, point: held.point } : null, {
      surface: BENCH.height,
      onCable: (tube) => {
        if (cablePickables.has(tube)) return;
        cablePickables.add(tube);
        pickables.push(tube);
      },
      onPlug: (node) => {
        node.traverse((child) => {
          if (child.isMesh && !cablePickables.has(child)) {
            cablePickables.add(child);
            pickables.push(child);
          }
        });
      },
    });
    if (held?.kind === "draw") {
      const from = contactOf(held.terminal);
      if (from) leads.draw(from, held.point, held.colour, BENCH.height);
    } else leads.clearDrawing();
  }

  function placeGuideRing() {
    const target = result.guidance.next.highlight?.find((id) => contactOf(id));
    if (!target) {
      guideRing.visible = false;
      return;
    }
    guideRing.position.copy(contactOf(target));
    guideRing.visible = true;
  }

  function resize() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height || renderer.xr.isPresenting) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  resize();

  const clock = new THREE.Clock();
  renderer.setAnimationLoop((time, frame) => {
    const delta = clock.getDelta();
    // The 90 ms seat is the only automatic motion; advance it here.
    const seating = manipulator.update(delta * 1000);
    if (seating) syncLeads(seating);
    else if (manipulator.held) syncLeads();
    if (guideRing.visible) guideRing.rotation.z += delta * 1.6;
    xr.update(delta, frame, (hand) => {
      const ray = hand.ray();
      raycaster.set(ray.origin, ray.direction);
      const hit = raycaster.intersectObjects(pickables, false)[0];
      return hit ? { distance: hit.distance } : null;
    });
    renderer.render(scene, camera);
  });

  refresh();

  return {
    state,
    dispose() {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      xr.dispose();
      leads.dispose();
      bench.dispose();
      instruments.dispose();
      room.dispose();
      parts.dispose();
      materials.dispose();
      ui.dispose();
      controls.dispose();
      renderer.dispose();
      host.classList.remove("l7-app");
      stage.remove();
    },
  };
}
