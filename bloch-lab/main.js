import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  presets,
  gates,
  rotate,
  angles,
  preparation,
  measure,
  progress,
} from "./state.js";
import { GateSequence, MAX_GATES } from "./sequence.js";
import { rotationPath } from "./trajectory.js";
import { bases, probability, sample, formatProbability } from "./learning.js";
import { GuidedLesson } from "./lesson.js";
import { blochCoordinates, formatState } from "./quantum-state.js";
import "./style.css";
const $ = (s) => document.querySelector(s),
  reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let v = [0, 0, 1],
  transition = null,
  trial = null,
  counts = [0, 0],
  touch = false,
  action = "Ready at |0⟩";
const sequence = new GateSequence();
const lesson = new GuidedLesson();
let basis = "Z",
  baseline = null;
let queueMode = true,
  history = [];
const worldVector = (a) => new THREE.Vector3(a[0], a[2], -a[1]);
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas: $("#scene"), antialias: true });
} catch (e) {
  $("#error").hidden = false;
  $("#error").textContent =
    "3D could not start. Enable hardware acceleration or try another WebGL browser.";
  $("#vr").textContent = "3D unavailable";
  document
    .querySelectorAll("aside button,aside input,#recenter")
    .forEach((b) => (b.disabled = true));
}
if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.xr.enabled = true;
  renderer.setClearColor(0xeef0f1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(42, 1, 0.05, 40),
    initialCamera = new THREE.Vector3(1.5, 2.3, 1.1),
    center = new THREE.Vector3(0, 1.65, -2),
    radius = 0.65;
  camera.position.copy(initialCamera);
  const controls = new OrbitControls(camera, $("#scene"));
  controls.target.copy(center);
  controls.enableDamping = true;
  controls.minDistance = 1.8;
  controls.maxDistance = 7;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x667788, 3));
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(2, 4, 2);
  scene.add(light);
  const sphereRoot = new THREE.Group();
  sphereRoot.position.copy(center);
  scene.add(sphereRoot);
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 64, 32),
    new THREE.MeshStandardMaterial({
      color: 0xc4d5e1,
      transparent: true,
      opacity: 0.16,
      roughness: 0.8,
      depthWrite: false,
    }),
  );
  sphereRoot.add(shell);
  const gridMaterial = new THREE.LineBasicMaterial({
    color: 0xa4b4bf,
    transparent: true,
    opacity: 0.48,
  });
  for (let k = 0; k < 3; k++) {
    const points = Array.from({ length: 129 }, (_, i) => {
      const t = (i / 128) * Math.PI * 2;
      return k === 0
        ? new THREE.Vector3(radius * Math.cos(t), 0, radius * Math.sin(t))
        : k === 1
          ? new THREE.Vector3(radius * Math.cos(t), radius * Math.sin(t), 0)
          : new THREE.Vector3(0, radius * Math.cos(t), radius * Math.sin(t));
    });
    sphereRoot.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        gridMaterial,
      ),
    );
  }
  function label(
    text,
    width = 0.55,
    height = 0.13,
    color = "#202428",
    wrap = 0,
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = Math.round((1024 * height) / width);
    const ctx = canvas.getContext("2d"),
      texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texture, depthTest: false }),
    );
    sprite.scale.set(width, height, 1);
    sprite.renderOrder = 5;
    let last;
    const set = (t) => {
      if (t === last) return;
      last = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      const lines = [];
      if (wrap) {
        let line = "";
        for (const word of t.split(" ")) {
          if ((line + " " + word).length > wrap && line) {
            lines.push(line);
            line = word;
          } else line += (line ? " " : "") + word;
        }
        if (line) lines.push(line);
      } else lines.push(t);
      ctx.font = `500 ${Math.floor(
        canvas.height * (wrap ? 0.7 / Math.max(2, lines.length) : 0.43),
      )}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      lines.forEach((line, i) =>
        ctx.fillText(
          line,
          512,
          (canvas.height * (i + 0.5)) / lines.length,
          990,
        ),
      );
      texture.needsUpdate = true;
    };
    set(text);
    sprite.userData.set = set;
    return sprite;
  }
  for (const [a, b, text] of [
    [[-0.83, 0, 0], [0.83, 0, 0], "+X / |+⟩"],
    [[0, -0.83, 0], [0, 0.83, 0], "+Z / |0⟩"],
    [[0, 0, 0.83], [0, 0, -0.83], "+Y / |+i⟩"],
  ]) {
    sphereRoot.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...a),
          new THREE.Vector3(...b),
        ]),
        new THREE.LineBasicMaterial({ color: 0x879aa7 }),
      ),
    );
    const l = label(text);
    l.position.set(...b).multiplyScalar(1.08);
    sphereRoot.add(l);
  }
  const south = label("−Z / |1⟩");
  south.position.set(-0.3, -0.88, 0);
  sphereRoot.add(south);
  const arrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(),
    radius,
    0x185b91,
    0.13,
    0.07,
  );
  sphereRoot.add(arrow);
  const endpoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.042, 20, 12),
    new THREE.MeshStandardMaterial({ color: 0x185b91 }),
  );
  sphereRoot.add(endpoint);
  const basisAxis = new THREE.ArrowHelper(
    worldVector(bases.Z),
    new THREE.Vector3(),
    radius * 1.15,
    0x795e95,
    0.065,
    0.035,
  );
  sphereRoot.add(basisAxis);
  const baselineArrow = new THREE.ArrowHelper(
    worldVector(bases.Z),
    new THREE.Vector3(),
    radius * 0.94,
    0xa8a0b1,
    0.065,
    0.035,
  );
  baselineArrow.visible = false;
  sphereRoot.add(baselineArrow);
  const angleArc = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0x9a7444 }),
  );
  sphereRoot.add(angleArc);
  const angleCaption = label("Tilt 0°", 0.4, 0.11, "#74552f");
  sphereRoot.add(angleCaption);
  // The selected axis projection maps linearly to its positive-outcome probability.
  const probabilityRail = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, radius * 2, 0.035),
    new THREE.MeshBasicMaterial({ color: 0xc9d2d9 }),
  );
  probabilityRail.position.x = -0.76;
  sphereRoot.add(probabilityRail);
  const probabilityFill = new THREE.Mesh(
    new THREE.BoxGeometry(0.047, 1, 0.038),
    new THREE.MeshBasicMaterial({ color: 0x185b91 }),
  );
  probabilityFill.position.x = -0.76;
  sphereRoot.add(probabilityFill);
  const probabilityLabel = label("0: 100%", 0.44, 0.14);
  probabilityLabel.position.set(-0.76, -0.82, 0.05);
  sphereRoot.add(probabilityLabel);
  const projection = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineDashedMaterial({
      color: 0x185b91,
      dashSize: 0.025,
      gapSize: 0.02,
      transparent: true,
      opacity: 0.7,
    }),
  );
  sphereRoot.add(projection);
  const trail = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0x185b91 }),
  );
  trail.visible = false;
  sphereRoot.add(trail);
  const completedTrails = new THREE.Group();
  sphereRoot.add(completedTrails);
  const completedTrailMaterial = new THREE.LineBasicMaterial({
    color: 0x6289a5,
    transparent: true,
    opacity: 0.9,
  });
  function clearTrails() {
    for (const segment of [...completedTrails.children]) {
      segment.geometry.dispose();
      completedTrails.remove(segment);
    }
    trail.visible = false;
    trail.geometry.dispose();
    trail.geometry = new THREE.BufferGeometry();
  }
  function retainGatePath(done) {
    const points = rotationPath(done.from, done.axis, done.angle);
    const segment = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        points.map((p) => worldVector(p).multiplyScalar(radius * 1.005)),
      ),
      completedTrailMaterial,
    );
    segment.userData = { gate: done.gate, points };
    completedTrails.add(segment);
    trail.visible = false;
  }
  const gateAxis = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineDashedMaterial({
      color: 0x8e633b,
      dashSize: 0.045,
      gapSize: 0.025,
    }),
  );
  sphereRoot.add(gateAxis);
  gateAxis.visible = false;
  const vrPanel = new THREE.Group();
  scene.add(vrPanel);
  vrPanel.position.set(0, 0.72, -1.48);
  vrPanel.visible = false;
  vrPanel.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(1.76, 1.12, 0.025),
      new THREE.MeshBasicMaterial({ color: 0xfafbfc }),
    ),
  );
  const vrButtons = [];
  function vrButton(text, id, x, y, width = 0.24) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.12, 0.025),
      new THREE.MeshBasicMaterial({ color: 0xe1e8ed }),
    );
    mesh.position.set(x, y, 0.025);
    mesh.userData.action = id;
    vrPanel.add(mesh);
    const caption = label(text, width - 0.01, 0.105);
    caption.position.set(x, y, 0.045);
    vrPanel.add(caption);
    vrButtons.push(mesh);
  }
  Object.keys(presets).forEach((s, i) =>
    vrButton("|" + s + "⟩", "preset:" + s, -0.67 + i * 0.268, 0.27),
  );
  Object.keys(gates).forEach((g, i) =>
    vrButton(g, "gate:" + g, -0.67 + i * 0.268, 0.11),
  );
  vrButton("Fresh ×100", "measure", -0.51, -0.065, 0.62);
  vrButton("Reset", "reset", -0.02, -0.065, 0.3);
  vrButton("Guide", "guide", 0.32, -0.065, 0.3);
  vrButton("Center", "recenter", 0.67, -0.065, 0.3);
  ["X", "Y", "Z"].forEach((b, i) =>
    vrButton(b + " basis", "basis:" + b, -0.55 + i * 0.55, -0.48, 0.48),
  );
  const activityPanel = new THREE.Group();
  activityPanel.position.set(-1.45, 1.85, -2);
  activityPanel.visible = false;
  scene.add(activityPanel);
  activityPanel.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 1.65, 0.025),
      new THREE.MeshBasicMaterial({ color: 0xfafbfc }),
    ),
  );
  function activityButton(text, id, x, y, width = 0.34) {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.12, 0.025),
      new THREE.MeshBasicMaterial({ color: 0xe1e8ed }),
    );
    b.position.set(x, y, 0.025);
    b.userData.action = id;
    activityPanel.add(b);
    const caption = label(text, width - 0.01, 0.105);
    caption.position.set(x, y, 0.045);
    activityPanel.add(caption);
    b.userData.caption = caption;
    vrButtons.push(b);
    return b;
  }
  const activityHeading = label(
    "One arrow. Two possible results.",
    1.06,
    0.16,
    "#202428",
    32,
  );
  activityHeading.position.set(0, 0.63, 0.04);
  activityPanel.add(activityHeading);
  const activityContext = label("", 1.06, 0.36, "#202428", 34);
  activityContext.position.set(0, 0.34, 0.04);
  activityPanel.add(activityContext);
  const lessonNextButton = activityButton(
    "Measure the upright preparation",
    "lesson-next",
    0,
    0.02,
    1.06,
  );
  const lessonHelperButton = activityButton(
    "Tilt to 60° for me",
    "lesson-helper",
    0,
    -0.16,
    1.06,
  );
  const activityObservation = label("", 1.06, 0.2, "#202428", 32);
  activityObservation.position.set(0, -0.36, 0.04);
  activityPanel.add(activityObservation);
  activityButton("Start over", "lesson-restart", -0.28, -0.64, 0.52);
  activityButton("Explore freely", "lesson-explore", 0.28, -0.64, 0.52);
  const sequencePanel = new THREE.Group();
  sequencePanel.position.set(1.45, 1.65, -2);
  sequencePanel.visible = false;
  scene.add(sequencePanel);
  const sequenceBacking = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 1.5, 0.025),
    new THREE.MeshBasicMaterial({ color: 0xfafbfc }),
  );
  sequenceBacking.position.y = -0.14;
  sequencePanel.add(sequenceBacking);
  const sequenceCaption = label("Your sequence", 1, 0.1);
  sequenceCaption.position.set(0, 0.36, 0.04);
  sequencePanel.add(sequenceCaption);
  const sequenceCells = [];
  function sequenceButton(text, id, x, y, width = 0.24) {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.12, 0.025),
      new THREE.MeshBasicMaterial({ color: 0xe1e8ed }),
    );
    b.position.set(x, y, 0.025);
    b.userData.action = id;
    sequencePanel.add(b);
    const caption = label(text, width - 0.01, 0.105);
    caption.position.set(x, y, 0.045);
    sequencePanel.add(caption);
    b.userData.caption = caption;
    vrButtons.push(b);
    return b;
  }
  for (let i = 0; i < MAX_GATES; i++) {
    sequenceCells.push(
      sequenceButton(
        "",
        "remove:" + i,
        -0.39 + (i % 4) * 0.26,
        0.2 - Math.floor(i / 4) * 0.15,
      ),
    );
  }
  sequenceButton("Run", "sequence-run", -0.39, -0.12);
  sequenceButton("Step", "sequence-step", -0.13, -0.12);
  sequenceButton("Replay", "sequence-replay", 0.13, -0.12);
  sequenceButton("Clear", "sequence-clear", 0.39, -0.12);
  const modeButton = sequenceButton("Queue on", "queue-mode", 0, -0.29, 1.02);
  const sequenceFeedback = label("", 1.02, 0.09);
  sequenceFeedback.position.set(0, -0.4, 0.045);
  sequencePanel.add(sequenceFeedback);
  sequenceButton("Keep baseline", "pin-baseline", 0, -0.55, 1.02);
  const baselineCaption = label("No baseline yet", 1.02, 0.16, "#202428", 32);
  baselineCaption.position.set(0, -0.74, 0.045);
  sequencePanel.add(baselineCaption);
  const vrReadout = label("", 1.62, 0.1);
  vrReadout.position.set(0, -0.235, 0.045);
  vrPanel.add(vrReadout);
  const vrCounts = label("", 1.62, 0.09);
  vrCounts.position.set(0, -0.335, 0.045);
  vrPanel.add(vrCounts);
  const vrPrompt = label("", 2.1, 0.13);
  vrPrompt.position.set(0, 2.95, -2);
  scene.add(vrPrompt);
  vrPrompt.visible = false;
  const stateCaption = label("", 1.65, 0.16);
  stateCaption.position.set(0, 2.75, -2);
  scene.add(stateCaption);
  // Each dot is an independent preparation, not repeated measurement of a collapsed qubit.
  const shots = new THREE.Group();
  shots.position.set(0, 0.55, -2);
  scene.add(shots);
  shots.visible = false;
  const dotGeometry = new THREE.SphereGeometry(0.012, 8, 6),
    dotMaterials = [
      new THREE.MeshBasicMaterial({ color: 0x185b91 }),
      new THREE.MeshBasicMaterial({ color: 0x8e633b }),
    ];
  const dots = Array.from({ length: 100 }, (_, i) => {
    const dot = new THREE.Mesh(dotGeometry, dotMaterials[0]);
    dot.visible = false;
    dot.position.set(((i % 20) - 9.5) * 0.036, Math.floor(i / 20) * 0.036, 0);
    shots.add(dot);
    return dot;
  });
  const shotTitle = label("Fresh qubits: blue 0 / brown 1", 0.9, 0.095);
  shotTitle.position.set(0, 0.25, 0);
  shots.add(shotTitle);
  const observedBackground = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.025, 0.02),
    new THREE.MeshBasicMaterial({ color: 0xc9d2d9 }),
  );
  observedBackground.position.y = -0.08;
  shots.add(observedBackground);
  const observedFill = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.027, 0.023),
    new THREE.MeshBasicMaterial({ color: 0x8e633b }),
  );
  observedFill.position.y = -0.08;
  shots.add(observedFill);
  const observedCaption = label("", 1.05, 0.13, "#74552f", 34);
  observedCaption.position.set(0, -0.2, 0);
  shots.add(observedCaption);
  const measurementArrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(),
    radius * 0.96,
    0x8e633b,
    0.12,
    0.055,
  );
  sphereRoot.add(measurementArrow);
  measurementArrow.visible = false;
  function setVector(next) {
    v = [...next];
    arrow.setDirection(worldVector(v).normalize());
    const tilt = preparation([0, 0, 1], v);
    angleArc.geometry.dispose();
    angleArc.geometry = new THREE.BufferGeometry().setFromPoints(
      rotationPath([0, 0, 1], tilt.axis, tilt.angle).map((p) =>
        worldVector(p).multiplyScalar(radius * 0.84),
      ),
    );
    angleCaption.userData.set(
      "Tilt " + Math.round((tilt.angle * 180) / Math.PI) + "°",
    );
    angleCaption.position
      .copy(
        worldVector(
          rotate([0, 0, 1], tilt.axis, tilt.angle / 2),
        ).multiplyScalar(radius * 0.73),
      )
      .add(new THREE.Vector3(0.12, 0.02, 0));
    angleArc.visible = lesson.active;
    angleCaption.visible = lesson.active;
    endpoint.position.copy(worldVector(v).multiplyScalar(radius));
    const p0 = probability(v, basis),
      height = Math.max(0.001, 2 * radius * p0);
    probabilityFill.scale.y = height;
    probabilityFill.position.y = -radius + height / 2;
    probabilityLabel.userData.set(
      "Chance " + formatProbability(p0) + " " + (basis === "Z" ? "0" : "+"),
    );
    projection.geometry.dispose();
    projection.geometry = new THREE.BufferGeometry().setFromPoints([
      endpoint.position.clone(),
      new THREE.Vector3(-0.76, (2 * p0 - 1) * radius, 0.02),
    ]);
    projection.computeLineDistances();
  }
  function clearTrials() {
    shots.visible = false;
    trial = null;
    counts = [0, 0];
    dots.forEach((d) => (d.visible = false));
    measurementArrow.visible = false;
  }
  function animateRotation(axis, angle, title) {
    clearTrials();
    transition = {
      from: [...v],
      axis,
      angle,
      start: performance.now(),
      duration: reduced ? 0 : 1100,
    };
    action = title;
    gateAxis.geometry.dispose();
    gateAxis.geometry = new THREE.BufferGeometry().setFromPoints([
      worldVector(axis).multiplyScalar(-0.85),
      worldVector(axis).multiplyScalar(0.85),
    ]);
    gateAxis.computeLineDistances();
    gateAxis.visible = true;
    sync();
  }
  function reset() {
    transition = null;
    lesson.reset();
    $("#exploration").open = false;
    basis = "Z";
    baseline = null;

    baselineArrow.visible = false;
    sequence.clear();
    sequence.capture(presets["0"]);
    history = [];
    queueMode = true;
    clearTrials();
    touch = false;
    $("#touch").setAttribute("aria-pressed", "false");
    $("#touch").textContent = "Touch sphere: off";
    endDrag();
    controllers.forEach((c) => (c.userData.preparing = false));

    setVector(presets["0"]);
    gateAxis.visible = false;
    clearTrails();
    action = "Ready at |0⟩";

    sync();
  }
  function startSequence(single = false, replay = false) {
    if (!sequence.queue.length || trial) return;
    if (replay || sequence.status === "complete") {
      transition = null;
      clearTrails();
      setVector(sequence.restart());
      history = [];
    }
    if (transition?.sequence) {
      if (transition.pausedAt !== undefined) {
        transition.start += performance.now() - transition.pausedAt;
        delete transition.pausedAt;
        sequence.begin(single);
        action = `${sequence.cursor + 1}/${sequence.queue.length} · ${
          transition.gate
        } gate`;
        sync();
      }
      return;
    }
    const g = sequence.begin(single);
    if (!g) return;

    animateRotation(
      gates[g].axis,
      gates[g].angle,
      `${sequence.cursor + 1}/${sequence.queue.length} · ${g} gate`,
    );
    transition.sequence = true;
    transition.gate = g;
    sync();
  }
  function pinBaseline(
    record = {
      vector: [...v],
      basis,
      p: probability(v, basis),
      counts: [...counts],
      program: [...history],
      input: [...sequence.base],
    },
  ) {
    baseline = record;
    baselineArrow.setDirection(worldVector(record.vector));
    baselineArrow.visible = true;
  }
  function act(id) {
    if (id === "lesson-restart") {
      reset();
      sync();
      return;
    }
    if (id === "lesson-explore") {
      transition = null;
      clearTrials();
      lesson.active = false;
      lesson.waiting = null;
      touch = false;
      $("#exploration").open = true;
      sync();
      return;
    }
    if (id === "lesson-helper" && lesson.active && !transition && !trial) {
      if (lesson.stage === "tilt") {
        const target = blochCoordinates(Math.PI / 3, 0),
          r = preparation(v, [target.x, target.y, target.z]);
        animateRotation(r.axis, r.angle, "Tilt toward 60°");
        transition.preparation = true;
      } else if (lesson.stage === "sampled") act("measure");
      return;
    }
    if (id === "lesson-next" && lesson.active && !transition && !trial) {
      const operation = lesson.begin(v);
      if (!operation) return;
      if (operation === "restart") {
        reset();
        return;
      }
      if (operation === "advance") {
        touch = false;
        lesson.finish();
        sync();
        return;
      }
      if (operation === "tilt") {
        pinBaseline();
        lesson.finish();
        touch = true;
        sync();
        return;
      }
      if (operation === "prepare") {
        clearTrails();
        clearTrials();
        history = [];
        sequence.clear();
        sequence.capture(presets["0"]);
        basis = "Z";
        setVector(presets["0"]);
        lesson.finish();
        sync();
        return;
      }
      if (operation.startsWith("sample")) {
        if (operation === "sample:X") {
          basis = "X";
          setVector(v);
        }
        if (operation === "sample:minus") {
          basis = "X";
          setVector(presets["−"]);
          sequence.capture(v);
        }
        act("measure");
        return;
      }
      if (operation.startsWith("program:")) {
        if (operation === "program:ZH") pinBaseline();
        clearTrails();
        clearTrials();
        history = [];
        sequence.clear();
        sequence.capture(presets["0"]);
        basis = "Z";
        setVector(presets["0"]);
        operation
          .slice(8)
          .split("")
          .forEach((g) => sequence.append(g, v));
        startSequence(false, true);
        transition.lesson = true;
        return;
      }
      let gate = operation.slice(5);
      if (operation === "prepare:H") {
        clearTrails();
        clearTrials();
        history = [];
        sequence.clear();
        basis = "Z";
        setVector(presets["0"]);
        sequence.capture(v);
        gate = "H";
      }
      if (operation === "gate:Z") pinBaseline();
      animateRotation(
        gates[gate].axis,
        gates[gate].angle,
        "Watch the " + gate + " rotation",
      );
      transition.gate = gate;
      transition.lesson = true;
      return;
    }
    if (id === "sequence-run") {
      if (transition?.sequence && transition.pausedAt === undefined) {
        transition.pausedAt = performance.now();
        sequence.pause();
        action = "Sequence paused";
        sync();
      } else startSequence(false);
      return;
    }
    if (id === "sequence-step") {
      startSequence(true);
      return;
    }
    if (id === "sequence-replay") {
      startSequence(false, true);
      return;
    }
    if (id === "sequence-clear") {
      if (sequence.queue.length) {
        transition = null;
        clearTrials();
        clearTrails();
        setVector(sequence.clear());
        history = [];
        gateAxis.visible = false;
        trail.visible = false;
        action = "Sequence cleared";
        sync();
      }
      return;
    }
    if (id === "queue-mode") {
      if (transition || trial || sequence.status === "paused") return;
      queueMode = !queueMode;
      sync();
      return;
    }
    if (id.startsWith("remove:")) {
      if (transition || trial) return;
      if (sequence.remove(Number(id.slice(7)))) {
        clearTrails();
        setVector(sequence.base);
        history = [];
        clearTrials();
        action = "Sequence edited";
        sync();
      }
      return;
    }

    if (
      (transition || trial || sequence.status === "paused") &&
      id !== "reset" &&
      id !== "guide" &&
      id !== "recenter"
    ) {
      return;
    }
    if (id === "recenter") {
      recenter();
      return;
    }
    if (id === "reset") {
      reset();
      return;
    }
    if (id === "guide") {
      reset();
      queueMode = false;
      sync();
      return;
    }
    if (id.startsWith("basis:")) {
      if (!bases[id.slice(6)]) return;
      basis = id.slice(6);
      clearTrials();
      setVector(v);
      sync();
      return;
    }
    if (id === "pin-baseline") {
      pinBaseline();
      sync();
      return;
    }
    if (id === "measure") {
      transition = null;
      clearTrials();
      gateAxis.visible = false;
      shots.visible = true;
      trial = {
        prepared: [...v],
        outcomes: Array.from({ length: 100 }, () => sample(v, basis)),
        basis,
        input: [...sequence.base],
        program: [...history],
        start: performance.now(),
        shown: 0,
      };
      action = "Measuring fresh preparations in " + basis;
      sync();
      return;
    }
    if (id.startsWith("preset:")) {
      clearTrails();
      const key = id.slice(7),
        r = preparation(v, presets[key]);
      animateRotation(r.axis, r.angle, "Prepare |" + key + "⟩");
      transition.preparation = true;
      history = [];

      sync();
      return;
    }
    if (id.startsWith("gate:")) {
      const g = id.slice(5);
      if (queueMode) {
        if (sequence.append(g, v)) {
          clearTrails();
          setVector(sequence.base);
          clearTrials();
          history = [];
          action = "Queued " + g;
        }
        sync();
        return;
      }
      sequence.capture(v);

      animateRotation(gates[g].axis, gates[g].angle, g + " gate · rotating");
      transition.gate = g;
      sync();
    }
  }
  function sync() {
    if (
      lesson.active &&
      ["order-check", "order-plus", "order-result"].includes(lesson.stage) &&
      basis !== "X"
    ) {
      basis = "X";
      setVector(v);
      if (baseline) {
        baseline.basis = "X";
        baseline.p = probability(baseline.vector, "X");
        baseline.counts = [0, 0];
      }
    }
    const busy = !!(transition || trial);
    const seqRunning =
      !!transition?.sequence && transition.pausedAt === undefined;
    const seqPaused = sequence.status === "paused";
    const hasQueue = sequence.queue.length > 0;
    $("#queue-mode").textContent = "Queue gates: " + (queueMode ? "on" : "off");
    $("#queue-mode").setAttribute("aria-pressed", queueMode);
    $("#queue-mode").disabled = busy || seqPaused;
    $("#sequence-run").textContent = seqRunning
      ? "Pause"
      : seqPaused
        ? "Resume"
        : "Run";
    $("#sequence-run").disabled =
      !hasQueue || !!trial || !!(transition && !transition.sequence);
    $("#sequence-step").disabled =
      !hasQueue ||
      seqRunning ||
      !!trial ||
      !!(transition && !transition.sequence);
    $("#sequence-replay").disabled =
      !hasQueue || !!trial || !!(transition && !transition.sequence);
    $("#sequence-clear").disabled = !hasQueue;
    const baseKey = Object.keys(presets).find((key) =>
      presets[key].every((x, i) => Math.abs(x - sequence.base[i]) < 1e-7),
    );
    const inputLabel =
      baseKey === undefined ? "saved state" : "|" + baseKey + "⟩";
    const sequenceText = hasQueue
      ? sequence.status === "complete"
        ? "Complete · measure the result"
        : `From ${inputLabel} · ${sequence.cursor}/${sequence.queue.length} complete · ${sequence.status}`
      : "Add gates, then run. Tap a gate to remove it.";
    $("#sequence-status").textContent = sequenceText;
    $("#gate-history").textContent =
      "Applied: " + (history.length ? history.join(" → ") : "none");
    const list = $("#sequence-list");
    const signature = JSON.stringify([
      sequence.queue,
      sequence.cursor,
      sequence.status,
      busy,
      !!transition?.sequence,
    ]);
    if (list.dataset.signature !== signature) {
      list.dataset.signature = signature;
      list.replaceChildren();
      sequence.queue.forEach((g, i) => {
        const li = document.createElement("li"),
          b = document.createElement("button");
        b.textContent = `${i + 1} · ${g}`;
        b.setAttribute("aria-label", `Remove gate ${i + 1} ${g}`);
        b.disabled = busy || seqPaused;
        b.className =
          i < sequence.cursor
            ? "completed"
            : i === sequence.cursor && !!transition?.sequence
              ? "current"
              : "";
        if (b.className === "current") b.setAttribute("aria-current", "step");
        b.onclick = () => act("remove:" + i);
        li.append(b);
        list.append(li);
      });
    }
    sequenceCells.forEach((b, i) => {
      b.visible = i < sequence.queue.length;
      b.userData.caption.visible = b.visible;
      b.userData.caption.userData.set(`${i + 1} · ${sequence.queue[i] || ""}`);
      b.userData.completed = i < sequence.cursor;
      b.userData.current = i === sequence.cursor && !!transition?.sequence;
    });
    modeButton.userData.caption.userData.set(
      queueMode ? "Queue on" : "Apply now",
    );
    sequenceFeedback.userData.set(
      hasQueue
        ? `${inputLabel} → ${sequence.cursor}/${sequence.queue.length} · ${sequence.status}`
        : "Add gates, then run",
    );
    const runButton = vrButtons.find(
      (b) => b.userData.action === "sequence-run",
    );
    runButton.userData.caption.userData.set(
      seqRunning ? "Pause" : seqPaused ? "Resume" : "Run",
    );
    vrButtons.forEach((b) => {
      const id = b.userData.action;
      if (id === "sequence-run")
        b.userData.disabled = $("#sequence-run").disabled;
      else if (id === "sequence-step")
        b.userData.disabled = $("#sequence-step").disabled;
      else if (id === "sequence-replay")
        b.userData.disabled = $("#sequence-replay").disabled;
      else if (id === "sequence-clear") b.userData.disabled = !hasQueue;
      else if (id === "queue-mode" || id.startsWith("remove:"))
        b.userData.disabled = busy || seqPaused;
      else
        b.userData.disabled =
          (busy || seqPaused) && !["reset", "guide", "recenter"].includes(id);
    });
    $("#theta").disabled = busy || seqPaused;
    $("#phi").disabled = busy || seqPaused;
    $("#touch").disabled = busy || seqPaused;
    $("#counts").setAttribute("aria-live", busy ? "off" : "polite");
    $("#scene").setAttribute(
      "aria-label",
      `Pure qubit Bloch sphere. ${basis} positive outcome ${formatProbability(
        probability(v, basis),
      )}. ${action}.`,
    );
    document
      .querySelectorAll("#gates button,#presets button,#measure")
      .forEach(
        (b) =>
          (b.disabled =
            busy ||
            seqPaused ||
            (b.parentElement.id === "gates" &&
              queueMode &&
              sequence.queue.length >= MAX_GATES)),
      );
    const a = angles(v),
      p = probability(v, basis);
    $("#p0").textContent = formatProbability(p);
    $("#p1").textContent = formatProbability(1 - p);
    $("#theta").value = (a.theta * 180) / Math.PI;
    $("#phi").value = (a.phi * 180) / Math.PI;
    $("#ket").textContent = formatState(a.theta, a.phi);
    $("#action").textContent = action;
    const positive = basis === "Z" ? "0" : "+",
      negative = basis === "Z" ? "1" : "−";
    shotTitle.userData.set(
      `Latest 100 copies: blue ${positive} / brown ${negative}`,
    );
    $("#positive-label").textContent = basis + ": " + positive;
    $("#negative-label").textContent = basis + ": " + negative;
    $("#counts").textContent =
      counts[0] + counts[1]
        ? `${basis}: ${counts[0]} ${positive} · ${counts[1]} ${negative} / ${
            counts[0] + counts[1]
          } fresh copies`
        : "No trials yet";
    const zp = probability(v, "Z");
    $("#amplitude-link").textContent = `Z: |α|² = ${formatProbability(
      zp,
    )} · |β|² = ${formatProbability(1 - zp)} (up to global phase)`;
    baselineCaption.userData.set(
      baseline
        ? `${baseline.basis} baseline: ${formatProbability(baseline.p)} +; ${
            baseline.counts[0] + baseline.counts[1]
              ? baseline.counts[0] +
                "/" +
                (baseline.counts[0] + baseline.counts[1]) +
                " copies"
              : "not sampled"
          }`
        : "Keep a baseline to compare a changed state",
    );
    $("#baseline-readout").textContent = baseline
      ? `Baseline ${baseline.basis}: ${formatProbability(
          baseline.p,
        )} positive; ${
          baseline.counts[0] + baseline.counts[1]
            ? baseline.counts[0] +
              "/" +
              (baseline.counts[0] + baseline.counts[1]) +
              " observed"
            : "not sampled"
        }. Input ${formatState(
          angles(baseline.input).theta,
          angles(baseline.input).phi,
        )}; ${baseline.program.join(" → ") || "no gates"}`
      : "Keep a baseline to compare a changed run.";
    basisAxis.setDirection(worldVector(bases[basis]));
    document.querySelectorAll("#bases button").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.basis === basis);
      b.disabled = busy || seqPaused;
    });
    $("#pin-baseline").disabled = busy || seqPaused;
    const current = lesson.step(),
      tilt = (Math.acos(Math.max(-1, Math.min(1, v[2]))) * 180) / Math.PI;
    const progress = lesson.stage.startsWith("order")
      ? "3 · Why order matters"
      : [
            "undo-first",
            "undo-second",
            "undo-result",
            "phase-middle",
            "phase-last",
            "phase-result",
            "phase-measured",
          ].includes(lesson.stage)
        ? "2 · How rotations combine"
        : "1 · From an arrow to measured copies";
    $("#lesson-progress").textContent = progress;
    $("#lesson-title").textContent = current.title;
    $("#lesson-context").textContent = current.context;
    $("#lesson-card").hidden = !lesson.active;
    $("#lesson-next").textContent = current.next;
    $("#lesson-next").disabled =
      busy ||
      seqPaused ||
      (lesson.stage === "tilt" && (tilt < 10 || Math.abs(v[2]) > 0.985));
    const live = lesson.active
      ? `Tilt ${Math.round(tilt)}° → chance ${formatProbability(
          probability(v, "Z"),
        )} of 0. ` +
        (["chance", "sampled"].includes(lesson.stage)
          ? `Expect about ${Math.round(
              probability(v, "Z") * 100,
            )} zeros per 100 copies.`
          : "")
      : "";
    $("#lesson-live").textContent = live;
    $("#lesson-helper").hidden = !["tilt", "sampled"].includes(lesson.stage);
    $("#lesson-helper").disabled = busy || seqPaused;
    $("#lesson-helper").textContent =
      lesson.stage === "sampled"
        ? "Sample 100 more copies"
        : "Tilt to 60° for me";
    const observation =
      lesson.prepared?.basis === basis &&
      lesson.prepared.vector.every((x, i) => Math.abs(x - v[i]) < 1e-7)
        ? lesson.observation()
        : "This preparation has not been measured yet.";
    $("#lesson-observation").textContent = observation;
    $(".hint").textContent = lesson.active
      ? lesson.stage === "tilt"
        ? "Drag the sphere to change the preparation · Hold the trigger in VR"
        : "Follow the next action · Drag to look around"
      : "Drag to look around · Select Touch sphere to prepare a state";
    $("#touch").textContent = "Touch sphere: " + (touch ? "on" : "off");
    $("#touch").setAttribute("aria-pressed", touch);
    activityHeading.userData.set(current.title);
    activityContext.userData.set(current.context);
    lessonNextButton.userData.caption.userData.set(current.next);
    lessonNextButton.userData.disabled = $("#lesson-next").disabled;
    lessonHelperButton.visible = !$("#lesson-helper").hidden;
    lessonHelperButton.userData.caption.visible = lessonHelperButton.visible;
    lessonHelperButton.userData.caption.userData.set(
      $("#lesson-helper").textContent,
    );
    lessonHelperButton.userData.disabled = busy || seqPaused;
    activityObservation.userData.set(
      ["tilt", "chance", "turn-phase", "phase-shown"].includes(lesson.stage)
        ? live
        : observation,
    );
    vrButtons.forEach((b) => {
      if (b.userData.action.startsWith("basis:")) {
        b.userData.current = b.userData.action.slice(6) === basis;
        b.userData.disabled = busy || seqPaused;
      }
    });
    if (activityPanel.visible || renderer.xr.isPresenting) {
      activityPanel.visible = lesson.active;
      vrPanel.visible = !lesson.active;
      sequencePanel.visible = !lesson.active || sequence.queue.length > 0;
    }
    angleArc.visible = lesson.active;
    angleCaption.visible = lesson.active;
    vrReadout.userData.set(
      `${basis} basis: ${positive} ${formatProbability(
        p,
      )} · ${negative} ${formatProbability(1 - p)}`,
    );
    vrCounts.userData.set(
      counts[0] + counts[1]
        ? `Fresh: ${counts[0]} ${positive} · ${counts[1]} ${negative}; blue stays prepared`
        : "Fresh copies; blue keeps the preparation",
    );
    vrPrompt.userData.set(
      lesson.active
        ? "Blue arrow: preparation · brown bar: observed copies"
        : "Prepare → rotate → measure fresh copies",
    );
    stateCaption.userData.set(
      lesson.active
        ? `Predicted chance: ${formatProbability(
            p,
          )} ${positive} · ${formatProbability(1 - p)} ${negative}`
        : action,
    );
  }
  for (const [target, items, prefix] of [
    ["#presets", presets, "preset:"],
    ["#gates", gates, "gate:"],
  ])
    for (const k of Object.keys(items)) {
      const b = document.createElement("button");
      b.textContent = prefix === "preset:" ? "|" + k + "⟩" : k;
      b.addEventListener("click", () => act(prefix + k));
      $(target).append(b);
    }
  for (const id of [
    "queue-mode",
    "sequence-run",
    "sequence-step",
    "sequence-replay",
    "sequence-clear",
  ])
    $("#" + id).onclick = () => act(id);
  for (const id of [
    "lesson-next",
    "lesson-helper",
    "lesson-restart",
    "lesson-explore",
  ])
    $("#" + id).onclick = () => act(id);
  document
    .querySelectorAll("#bases button")
    .forEach((b) => (b.onclick = () => act("basis:" + b.dataset.basis)));
  $("#pin-baseline").onclick = () => act("pin-baseline");
  $("#reset").onclick = () => act("reset");
  $("#measure").onclick = () => act("measure");
  $("#exploration").addEventListener("toggle", () => {
    if ($("#exploration").open && lesson.active) act("lesson-explore");
  });
  $("#touch").onclick = () => {
    touch = !touch;
    $("#touch").setAttribute("aria-pressed", touch);
    $("#touch").textContent = "Touch sphere: " + (touch ? "on" : "off");
  };
  for (const id of ["theta", "phi"])
    $("#" + id).oninput = () => {
      transition = null;
      clearTrials();
      gateAxis.visible = false;
      clearTrails();
      const a = blochCoordinates(
        (Number($("#theta").value) * Math.PI) / 180,
        (Number($("#phi").value) * Math.PI) / 180,
      );
      setVector([a.x, a.y, a.z]);
      sequence.capture(v);
      history = [];
      action = "Prepared with angles";

      sync();
    };
  const raycaster = new THREE.Raycaster(),
    pointer = new THREE.Vector2();
  function pointState() {
    if (lesson.active && lesson.stage !== "tilt") return false;
    const hit = raycaster.intersectObject(shell)[0];
    if (!hit) return false;
    transition = null;
    clearTrials();
    gateAxis.visible = false;
    clearTrails();
    const p = sphereRoot.worldToLocal(hit.point.clone()).normalize();
    setVector([p.x, -p.z, p.y]);
    sequence.capture(v);
    history = [];
    action = "Prepared on sphere";

    sync();
    return true;
  }
  function desktopRay(e) {
    const r = $("#scene").getBoundingClientRect();
    pointer.set(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      (-(e.clientY - r.top) / r.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
  }
  let dragging = false;
  $("#scene").addEventListener("pointerdown", (e) => {
    if (
      !touch ||
      transition ||
      trial ||
      sequence.status === "paused" ||
      renderer.xr.isPresenting
    )
      return;
    desktopRay(e);
    if (pointState()) {
      dragging = true;
      controls.enabled = false;
      $("#scene").setPointerCapture(e.pointerId);
    }
  });
  $("#scene").addEventListener("pointermove", (e) => {
    if (dragging) {
      desktopRay(e);
      pointState();
    }
  });
  function endDrag() {
    dragging = false;
    controls.enabled = !renderer.xr.isPresenting;
  }
  for (const name of ["pointerup", "pointercancel", "lostpointercapture"])
    $("#scene").addEventListener(name, endDrag);
  const controllers = [],
    rotation = new THREE.Matrix4();
  function controllerRay(c) {
    c.updateWorldMatrix(true, false);
    rotation.extractRotation(c.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(c.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(rotation).normalize();
  }
  for (let i = 0; i < 2; i++) {
    const c = renderer.xr.getController(i);
    c.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(),
          new THREE.Vector3(0, 0, -3),
        ]),
        new THREE.LineBasicMaterial({ color: 0x185b91 }),
      ),
    );
    scene.add(c);
    const grip = renderer.xr.getControllerGrip(i);
    grip.add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.025, 0.12, 12),
        new THREE.MeshStandardMaterial({ color: 0x667788 }),
      ),
    );
    scene.add(grip);
    c.addEventListener("selectstart", () => {
      controllerRay(c);
      const hit = raycaster.intersectObjects(
        vrButtons.filter((b) => b.visible && b.parent.visible),
      )[0];
      if (hit) {
        if (!hit.object.userData.disabled) act(hit.object.userData.action);
        return;
      }
      c.userData.preparing =
        !(transition || trial || sequence.status === "paused") && pointState();
    });
    c.addEventListener("selectend", () => {
      c.userData.preparing = false;
    });
    c.addEventListener("disconnected", () => {
      c.userData.preparing = false;
    });
    controllers.push(c);
  }
  function anchorExperience(pos, dir) {
    const yaw = Math.atan2(-dir.x, -dir.z);
    const rotation = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      yaw,
    );
    const origin = new THREE.Vector3(pos.x, pos.y - 1.65, pos.z);
    for (const [object, offset] of [
      [sphereRoot, [0, 1.65, -2]],
      [stateCaption, [0, 2.75, -2]],
      [vrPrompt, [0, 2.95, -2]],
      [vrPanel, [0, 0.72, -1.48]],
      [shots, [-1.45, 0.72, -2]],
      [activityPanel, [-1.45, 1.85, -2]],
      [sequencePanel, [1.45, 1.65, -2]],
    ]) {
      object.position.copy(
        new THREE.Vector3(...offset).applyQuaternion(rotation).add(origin),
      );
      object.quaternion.copy(rotation);
    }
  }
  function recenter() {
    if (renderer.xr.isPresenting) {
      const head = renderer.xr.getCamera(),
        pos = new THREE.Vector3(),
        dir = new THREE.Vector3();
      head.getWorldPosition(pos);
      head.getWorldDirection(dir);
      anchorExperience(pos, dir);
    } else {
      camera.position.copy(initialCamera);
      controls.target.copy(sphereRoot.position);
      controls.update();
    }
  }
  let needsXRRecenter = false;
  $("#recenter").onclick = recenter;
  $("#vr").onclick = async () => {
    try {
      if (renderer.xr.isPresenting) {
        await renderer.xr.getSession().end();
        return;
      }
      const session = await navigator.xr.requestSession("immersive-vr", {
        optionalFeatures: ["local-floor"],
      });
      try {
        await session.requestReferenceSpace("local-floor");
        renderer.xr.setReferenceSpaceType("local-floor");
      } catch {
        await session.end();
        throw new Error("This experience needs floor-level tracking.");
      }
      camera.position.set(0, 0, 0);
      camera.quaternion.identity();
      controls.enabled = false;
      await renderer.xr.setSession(session);
      vrPanel.visible = !lesson.active;
      vrPrompt.visible = true;
      sequencePanel.visible = !lesson.active || sequence.queue.length > 0;
      activityPanel.visible = lesson.active;
      needsXRRecenter = true;
      $("#vr").textContent = "Exit VR";
      session.addEventListener("visibilitychange", () =>
        controllers.forEach((c) => (c.userData.preparing = false)),
      );
    } catch (e) {
      controls.enabled = true;
      camera.position.copy(initialCamera);
      $("#status").textContent = "VR could not start: " + e.message;
    }
  };
  renderer.xr.addEventListener("sessionend", () => {
    needsXRRecenter = false;
    controllers.forEach((c) => (c.userData.preparing = false));
    vrPanel.visible = false;
    vrPrompt.visible = false;
    sequencePanel.visible = false;
    activityPanel.visible = false;
    activityPanel.position.set(-1.45, 1.85, -2);
    activityPanel.quaternion.identity();
    sequencePanel.position.set(1.45, 1.65, -2);
    sequencePanel.quaternion.identity();
    sphereRoot.position.copy(center);
    sphereRoot.quaternion.identity();
    stateCaption.position.set(0, 2.75, -2);
    stateCaption.quaternion.identity();
    vrPrompt.position.set(0, 2.95, -2);
    vrPrompt.quaternion.identity();
    vrPanel.position.set(0, 0.72, -1.48);
    vrPanel.quaternion.identity();
    shots.position.set(0, 0.55, -2);
    shots.quaternion.identity();
    camera.quaternion.identity();
    controls.enabled = true;
    camera.position.copy(initialCamera);
    controls.target.copy(sphereRoot.position);
    $("#vr").textContent = "Enter VR";
  });
  (async () => {
    const b = $("#vr");
    if (!isSecureContext) {
      b.textContent = "VR needs HTTPS";
      return;
    }
    if (!navigator.xr) {
      b.textContent = "VR unavailable here";
      return;
    }
    try {
      if (await navigator.xr.isSessionSupported("immersive-vr")) {
        b.disabled = false;
        b.textContent = "Enter VR";
      } else b.textContent = "No headset detected";
    } catch {
      b.textContent = "VR unavailable here";
    }
  })();
  let width = 0,
    height = 0,
    lastSync = 0;
  renderer.setAnimationLoop((now) => {
    vrButtons.forEach((b) =>
      b.material.color.setHex(
        b.userData.current
          ? 0x93b8d3
          : b.userData.completed
            ? 0xc3d8e8
            : b.userData.disabled
              ? 0xd2d5d7
              : 0xe1e8ed,
      ),
    );

    if (!renderer.xr.isPresenting) {
      const w = $("#scene").clientWidth,
        h = $("#scene").clientHeight;
      if (width !== w || height !== h) {
        width = w;
        height = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
        if (w < 760) shots.position.set(0, 0.6, -2);
        else shots.position.set(0, 0.55, -2);
      }
      controls.update();
    } else {
      if (needsXRRecenter) {
        renderer.xr.updateCamera(camera);
        recenter();
        needsXRRecenter = false;
      }
      for (const c of controllers) {
        controllerRay(c);
        const hit = raycaster.intersectObjects(
          vrButtons.filter((b) => b.visible && b.parent.visible),
        )[0];
        if (hit && !hit.object.userData.disabled)
          hit.object.material.color.setHex(0xb4cde0);
        if (c.userData.preparing) pointState();
      }
    }
    if (transition && transition.pausedAt === undefined) {
      const t = transition.duration
          ? Math.max(
              0,
              Math.min(1, (now - transition.start) / transition.duration),
            )
          : 1,
        eased = t * t * (3 - 2 * t);
      setVector(
        rotate(transition.from, transition.axis, transition.angle * eased),
      );
      const points = rotationPath(
        transition.from,
        transition.axis,
        transition.angle,
        eased,
      ).map((p) => worldVector(p).multiplyScalar(radius * 1.005));
      trail.geometry.dispose();
      trail.geometry = new THREE.BufferGeometry().setFromPoints(points);
      trail.visible = true;
      if (t === 1) {
        const done = transition;
        if (done.gate) {
          history.push(done.gate);
          retainGatePath(done);
        } else trail.visible = false;
        transition = null;
        if (done.preparation) sequence.capture(v);
        if (done.sequence) {
          sequence.finish(v);
          action =
            sequence.status === "complete"
              ? "Sequence complete"
              : `Step ${sequence.cursor} complete`;
          if (sequence.status === "running") startSequence(false);
          else if (
            sequence.status === "complete" &&
            lesson.active &&
            lesson.waiting
          ) {
            lesson.finish();
            sync();
          }
        } else {
          action = action.replace(" · rotating", " · complete");
          if (done.gate) sequence.capture(v);
          if (done.lesson) lesson.finish();
        }
        sync();
      }
    }
    if (trial) {
      const total = reduced
        ? 100
        : Math.floor(100 * progress(now, trial.start, 3000));
      for (let i = trial.shown; i < total; i++) {
        const result = trial.outcomes[i];
        counts[result]++;
        dots[i].material = dotMaterials[result];
        dots[i].visible = true;
        measurementArrow.visible = true;
        measurementArrow.setDirection(
          worldVector(bases[trial.basis]).multiplyScalar(result === 0 ? 1 : -1),
        );
      }
      trial.shown = total;
      const samePreparation =
        lesson.active &&
        lesson.prepared?.basis === basis &&
        lesson.prepared.vector.every((x, i) => Math.abs(x - v[i]) < 1e-7);
      const prior = samePreparation ? lesson.totals : [0, 0],
        allZero = prior[0] + counts[0],
        allTotal = prior[0] + prior[1] + total;
      const fraction = allTotal ? allZero / allTotal : 0;
      observedFill.scale.x = 0.72 * fraction;
      observedFill.position.x = -0.36 + 0.36 * fraction;
      observedCaption.userData.set(
        `Observed: ${allZero}/${allTotal} = ${formatProbability(fraction)} ` +
          (basis === "Z" ? "zeros" : "+"),
      );
      if (total === 100) {
        const record = {
          vector: [...trial.prepared],
          basis: trial.basis,
          p: probability(trial.prepared, trial.basis),
          counts: [...counts],
          input: [...trial.input],
          program: [...trial.program],
        };
        if (lesson.active) {
          lesson.record(record.vector, record.basis, record.counts);
          lesson.finish();
        }
        trial = null;
        measurementArrow.visible = false;
        action = "100 fresh qubits measured in " + record.basis;
        sync();
      }
    }
    if (now - lastSync > 100 && (transition || trial)) {
      sync();
      lastSync = now;
    }
    renderer.render(scene, camera);
  });
  setVector(v);
  sync();
  window.__BLOCH_API__ = {
    act,
    getState: () => ({
      vector: [...v],
      counts: [...counts],
      touch,
      cameraPosition: camera.position.toArray(),
      animating: !!transition,
      measuring: !!trial,
      queueMode,
      basis,
      baseline: baseline ? structuredClone(baseline) : null,
      lesson: {
        stage: lesson.stage,
        active: lesson.active,
        waiting: lesson.waiting,
        totals: [...lesson.totals],
        observation: lesson.observation(),
      },
      history: [...history],
      trails: completedTrails.children.map((segment) => ({
        gate: segment.userData.gate,
        points: segment.userData.points.map((p) => [...p]),
      })),
      activeTrail: trail.visible,
      sequence: {
        queue: [...sequence.queue],
        base: [...sequence.base],
        cursor: sequence.cursor,
        status: sequence.status,
        snapshots: sequence.snapshots.map((v) => [...v]),
      },
    }),
    vrControlLayout: () =>
      vrButtons.map((b) => ({
        id: b.userData.action,
        parent:
          b.parent === activityPanel
            ? "activity"
            : b.parent === sequencePanel
              ? "sequence"
              : "main",
        x: b.position.x,
        y: b.position.y,
        width: b.geometry.parameters.width,
        height: b.geometry.parameters.height,
      })),
    simulateControllerPrepare(vector, position = [0, 1.65, 0]) {
      const controller = controllers[0],
        target = sphereRoot.localToWorld(
          worldVector(vector).multiplyScalar(radius),
        );
      controller.position.set(...position);
      controller.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        target.sub(controller.position).normalize(),
      );
      controller.updateMatrix();
      controller.dispatchEvent({ type: "selectstart" });
      controller.dispatchEvent({ type: "selectend" });
      return [...v];
    },
    vrActions: vrButtons.map((b) => b.userData.action),
    anchorFromPose(position, direction) {
      anchorExperience(
        new THREE.Vector3(...position),
        new THREE.Vector3(...direction),
      );
      return sphereRoot.position.toArray();
    },
    simulateControllerSelect(id, position = [0, 1.65, 0]) {
      const target = vrButtons.find((b) => b.userData.action === id);
      if (!target) return false;
      const controller = controllers[0];
      const destination = new THREE.Vector3();
      target.getWorldPosition(destination);
      controller.position.set(...position);
      controller.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        destination.sub(controller.position).normalize(),
      );
      controller.updateMatrix();
      controller.dispatchEvent({ type: "selectstart" });
      controller.dispatchEvent({ type: "selectend" });
      return true;
    },
    previewVRLayout() {
      vrPanel.visible = !lesson.active;
      vrPrompt.visible = true;
      sequencePanel.visible = !lesson.active || sequence.queue.length > 0;
      activityPanel.visible = lesson.active;
      shots.position.set(-1.45, 0.72, -2);
      camera.fov = 100;
      camera.updateProjectionMatrix();
      controls.enableDamping = false;
      camera.position.set(0, 1.65, 0);
      controls.target.set(0, 1.5, -2);
      controls.update();
    },
  };
  window.addEventListener("beforeunload", () => {
    renderer.setAnimationLoop(null);
    controls.dispose();
    renderer.dispose();
  });
}
