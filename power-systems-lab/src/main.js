import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { loadSubstation } from "./substation.js";
import { createXR } from "./xr.js";
import "./style.css";

const app = document.querySelector("#app");
app.innerHTML = `<div class="shell">
<header><div class="brand"><a href="/projects/">Ahmed Aly</a><span class="divider"></span><h1>Power Systems Lab</h1></div><div class="header-actions"><button class="quiet about-button" data-dialog="source">Source</button><button class="quiet" data-dialog="help">Help</button><button class="vr-button" id="enter-vr" disabled>Enter VR</button></div></header>
<main class="workspace">
<aside class="navigator" id="equipment" aria-label="Equipment navigator" tabindex="-1"><p class="eyebrow">ELEN424 · Field study</p><h2 class="model-name">Distribution<br>substation</h2><div id="model-picker" hidden></div><div class="nav-tabs" role="group" aria-label="Explore equipment or guided tour"><button class="active" data-tab="equipment" aria-pressed="true">Equipment</button><button data-tab="tour" aria-pressed="false">Guided tour</button></div><nav class="equipment-list" id="equipment-list" aria-label="Choose equipment"></nav><nav class="equipment-list tour-list" id="tour-list" aria-label="Guided chapters" hidden></nav></aside>
<section class="view" id="view" aria-label="Interactive 3D equipment view"><div class="scene-label"><p class="eyebrow" id="view-label">The equipment yard</p><span class="hint">Drag to orbit · scroll to zoom<br>Click a device to inspect</span></div><div class="mobile-tools"><button id="toggle-equipment" aria-expanded="false" aria-controls="equipment">Explore</button><button id="toggle-details" aria-expanded="false" aria-controls="details">Details</button></div><div class="loading" id="loading" role="status"><p>Preparing the field study</p><span id="load-message">Loading the complete source model and equipment guide.</span><div class="spinner"></div></div><div class="view-controls" role="group" aria-label="View controls"><button id="reset">Reset view</button><button id="side">Side view</button><label class="sr-only" for="appearance">Appearance</label><select id="appearance"><option value="presentation">Material finishes</option><option value="source">Source appearance</option></select></div></section>
<aside class="details" id="details" aria-label="Selected equipment"><p class="eyebrow" id="detail-eyebrow">Explore the arrangement</p><h2 id="detail-title">Equipment yard</h2><div class="confidence" id="confidence">Full source arrangement</div><p class="prompt" id="tour-prompt" hidden></p><p id="description"></p><p class="evidence"><span class="small-label">What the model establishes</span><span id="evidence"></span></p><div class="details-actions"><button id="focus">Focus device</button><button id="isolate" aria-pressed="false">Isolate device</button></div><a class="video-link" id="video-link" href="https://www.youtube.com/watch?v=QC0t_9Z_9hg" target="_blank" rel="noopener noreferrer">Compare with Tarek’s reference video ↗</a><div class="transformer-controls" id="transformer-controls" hidden><button id="open-enclosure" aria-pressed="false">Open enclosure</button><button id="core">Core and coils</button><label for="separation">Illustrative separation <output id="separation-value">0%</output></label><input id="separation" type="range" min="0" max="100" step="1" value="0"><p>Placement study; no verified maintenance sequence.</p></div></aside>
</main><footer><span id="status" role="status" aria-live="polite">Preparing the model…</span><a class="credit-inline" href="https://sketchfab.com/3d-models/substation-8f4e54879b664104bece03d8e7236c15" target="_blank" rel="noopener noreferrer">Substation · One80 Solar · CC BY 4.0</a></footer>
</div>
<dialog id="help-dialog" aria-labelledby="help-title"><button class="close-dialog" aria-label="Close help">×</button><p class="eyebrow">Controls</p><h2 id="help-title">Explore with your hands.</h2><p>On a computer, drag to orbit, scroll to zoom, and click a device. On a phone, use one finger to orbit and two fingers to zoom or pan. Choose a device to read its role, focus on it or isolate it.</p><p>In Meta Quest Browser, open this page over HTTPS and select <strong>Enter VR</strong>.</p><dl><dt>Left stick</dt><dd>Move in the direction you face.</dd><dt>Right stick</dt><dd>Turn smoothly.</dd><dt>Trigger</dt><dd>Select a device or a panel control.</dd><dt>One grip</dt><dd>Point at the model, then hold to move and rotate it.</dd><dt>Two grips</dt><dd>Rotate together; move your hands apart to scale. Navigation continues while gripping.</dd><dt>X / right stick click</dt><dd>Summon or dismiss the panel.</dd><dt>Y</dt><dd>Reset the view in front of you.</dd></dl><p>The panel stays where you placed it. Summon it again after moving. Use <strong>Bring closer</strong> for an isolated device, or <strong>Room size</strong> to walk around the arrangement.</p></dialog>
<dialog id="source-dialog" aria-labelledby="source-title"><button class="close-dialog" aria-label="Close source details">×</button><p class="eyebrow">Materials & provenance</p><h2 id="source-title">A source model, carefully read.</h2><p id="source-description"></p><p>The learning guide follows Dr Tarek El Fouly’s ELEN424 Substation Equipment notes and supplied videos. Device labels are based on the visible geometry; candidates remain provisional.</p><p id="appearance-description">Representative steel, painted metal and ceramic finishes aid inspection. Select <strong>Source appearance</strong> to compare the original diffuse atlas and authored normals. The archive supplies UVs and a diffuse image but no material binding file, so their pairing is an inspection inference.</p><p id="model-limits">No voltage, winding connection, fault-interruption medium or operating sequence is assigned where the source does not establish one. Inspection scale is a view setting; the substation OBJ declares no physical units.</p><p class="source-stat" id="source-stat"></p><p><a href="https://www.youtube.com/watch?v=QC0t_9Z_9hg" target="_blank" rel="noopener noreferrer">Substation reference video ↗</a> · <a href="https://www.youtube.com/watch?v=Vz5x6ZtHdgY" target="_blank" rel="noopener noreferrer">Transformer reference video ↗</a></p><p class="source-stat">Physical Quest headset verification remains pending.</p></dialog>`;
const $ = (id) => document.getElementById(id),
  host = $("view");
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
} catch (error) {
  $("loading").querySelector("p").textContent = "3D rendering is unavailable";
  $("load-message").textContent = "Enable WebGL or open this page in a current browser.";
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setClearColor(0xe9e8e3);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.78;
renderer.xr.enabled = true;
renderer.xr.setFramebufferScaleFactor(0.85);
renderer.domElement.setAttribute("aria-label", "3D view. Drag to orbit; choose named devices in the equipment navigator.");
host.prepend(renderer.domElement);
const scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(37, 1, 0.005, 150);
camera.position.set(6, 4, 6);
const pmrem = new THREE.PMREMGenerator(renderer),
  environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
scene.environment = environment.texture;
scene.environmentIntensity = 0.65;
pmrem.dispose();
scene.add(new THREE.HemisphereLight(0xffffff, 0x555450, 0.3));
const key = new THREE.DirectionalLight(0xfffaf1, 2.5);
key.position.set(-9, 13, 9);
scene.add(key);
const fill = new THREE.DirectionalLight(0xe8efff, 0.55);
fill.position.set(9, 5, -8);
scene.add(fill);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0xe9e8e3, roughness: 1 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.02;
scene.add(floor);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.09;
controls.minDistance = 0.04;
controls.maxDistance = 80;
controls.screenSpacePanning = true;
let model = null,
  appearance = "presentation",
  tourIndex = 0,
  activeTab = "equipment",
  guided = false,
  frameStart = 0,
  ready = false,
  loadGeneration = 0;
const cache = new Map();
function status(message) {
  $("status").textContent = message;
}
function panelState() {
  const g = model?.selected;
  return {
    ready,
    selected: g ? { id: g.id, title: g.title, status: g.status, copy: g.copy, evidence: g.evidence } : null,
    groups: model?.groups.map(({ id, title }) => ({ id, title })) || [],
    tourIndex,
    tourLength: model?.tour.length || 0,
    tourPrompt: guided ? model?.tour[tourIndex]?.prompt : "",
    appearance,
    isolated: model?.isolated,
    transformer: model?.id === "transformer",
    opened: model?.opened,
    explosion: model?.explosion || 0,
  };
}
const xr = createXR({
  renderer,
  scene,
  camera,
  controls,
  getModel: () => model,
  getState: panelState,
  onChange: change,
  onAction: action,
  onStatus: status,
  onSession: (active) => {
    document.body.classList.toggle("xr", active);
    resize();
  },
});
function resize() {
  if (xr.active) return;
  const rect = host.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height);
  camera.aspect = rect.width / Math.max(1, rect.height);
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(host);
function frame(box, side = false) {
  if (!model || box.isEmpty()) return;
  const center = box.getCenter(new THREE.Vector3()),
    size = box.getSize(new THREE.Vector3()),
    radius = size.length() / 2;
  const fov = Math.min(THREE.MathUtils.degToRad(camera.fov), 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect));
  const distance = Math.max(0.1, (radius / Math.sin(fov / 2)) * 1.12);
  const direction = side ? new THREE.Vector3(0, 0.14, 1) : new THREE.Vector3(1, 0.62, 1.05);
  camera.position.copy(center).add(direction.normalize().multiplyScalar(distance));
  controls.target.copy(center);
  camera.near = Math.max(0.0001, radius / 1000);
  camera.far = Math.max(150, distance * 20);
  controls.maxDistance = Math.max(10, distance * 8);
  camera.updateProjectionMatrix();
  controls.update();
}
function renderNavigation() {
  if (!model) return;
  const list = $("equipment-list");
  list.replaceChildren();
  for (const group of model.groups) {
    const button = document.createElement("button");
    button.dataset.equipment = group.id;
    button.classList.toggle("child", Boolean(group.parent));
    button.append(document.createTextNode(group.title));
    const caption = document.createElement("span");
    caption.textContent = group.status;
    button.append(caption);
    button.addEventListener("click", () => {
      change("equipment", group.id);
      closeDrawers();
    });
    list.append(button);
  }
  const tour = $("tour-list");
  tour.replaceChildren();
  model.tour.forEach((chapter, index) => {
    const button = document.createElement("button");
    button.textContent = chapter.title;
    button.dataset.tour = index;
    button.addEventListener("click", () => {
      chooseTour(index);
      closeDrawers();
    });
    tour.append(button);
  });
  $("transformer-controls").hidden = model.id !== "transformer";
  $("source-description").replaceChildren();
  if (model.id === "substation") {
    const paragraph = $("source-description");
    paragraph.append(document.createTextNode("“Substation” by One80 Solar, "));
    const source = document.createElement("a");
    source.href = model.provenance.source_url;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.textContent = "original Sketchfab model";
    paragraph.append(source, document.createTextNode(", licensed under "));
    const license = document.createElement("a");
    license.href = model.provenance.license_url;
    license.target = "_blank";
    license.rel = "noopener noreferrer";
    license.textContent = "Creative Commons Attribution 4.0";
    paragraph.append(
      license,
      document.createTextNode(
        ". Changes: OBJ triangulation, source-piece grouping, exact attribute packing, compressed transport, optional smoothed normals, material finishes and teaching annotations."
      )
    );
    $("source-stat").textContent =
      `${model.provenance.triangles.toLocaleString()} source triangles · ${model.provenance.geometric_pieces.toLocaleString()} connected source pieces. Triangle order and all packed corner attributes are preserved. No geometry decimation.`;
  } else if (__TRANSFORMER_AVAILABLE__) {
    const paragraph = $("source-description"),
      source = document.createElement("a");
    source.href = model.provenance.source_url;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.textContent = "original GrabCAD model";
    paragraph.append(
      document.createTextNode("Academic three-phase transformer by Patrick Kayter, 2013; drawings credited to Patrick Kayter and Jonathan Lucas. "),
      source,
      document.createTextNode(
        ". Published with creator permission. Changes: STEP conversion to GLB, source-part grouping, display normalization, representative finishes and illustrative inspection views. The source drawings establish the concentric coil and core placement."
      )
    );
    $("source-stat").textContent = `${
      model.provenance.leaf_occurrences
    } source occurrences · ${model.provenance.placed_triangles.toLocaleString()} placed triangles. Enclosure opening and separation are illustrative views.`;
  }
  $("model-picker").hidden = !__TRANSFORMER_AVAILABLE__;
  if (__TRANSFORMER_AVAILABLE__ && !$("model-picker").children.length) {
    const select = document.createElement("select");
    select.className = "local-model";
    select.setAttribute("aria-label", "Choose equipment experience");
    select.innerHTML = '<option value="substation">Substation</option><option value="transformer">Three-phase transformer</option>';
    select.onchange = () => load(select.value);
    $("model-picker").append(select);
  }
  if (__TRANSFORMER_AVAILABLE__) $("model-picker").querySelector("select").value = model.id;
  const credit = document.querySelector(".credit-inline");
  credit.href = model.provenance.source_url;
  credit.textContent = model.id === "substation" ? "Substation · One80 Solar · CC BY 4.0" : "Transformer · Patrick Kayter · Used with permission";
  $("appearance-description").textContent =
    model.id === "substation"
      ? "Representative steel, painted metal and ceramic finishes aid inspection. Source appearance compares the original diffuse atlas and authored normals. The archive has UVs and a diffuse image but no material binding file, so their pairing is an inspection inference."
      : "Representative steel, painted metal, copper and ceramic finishes aid inspection. Source appearance compares the original CAD colors. Axis and display-scale normalization preserve the assembly and all source occurrences.";
  $("model-limits").textContent =
    model.id === "substation"
      ? "Voltage, winding connection, fault-interruption medium and operating sequence are not assigned where the source does not establish them. Inspection scale is a view setting; the substation OBJ declares no physical units."
      : "The source drawings identify the concentric BT/AT coils and magnetic core. Winding turns, rated ratio and electrical connections are not supplied. Enclosure opening and separation illustrate placement rather than a verified maintenance sequence.";
  document.querySelector(".model-name").textContent = model.title;
}
function sync() {
  if (!model) return;
  const group = model.selected;
  $("detail-title").textContent = group.title;
  $("confidence").textContent = group.status;
  $("description").textContent = group.copy;
  $("evidence").textContent = group.evidence || "";
  $("detail-eyebrow").textContent = guided ? "Guided field study" : "Equipment & function";
  $("tour-prompt").hidden = !guided;
  $("tour-prompt").textContent = guided ? model.tour[tourIndex].prompt : "";
  $("view-label").textContent = group.title;
  document.querySelectorAll("[data-equipment]").forEach((button) => {
    const match = button.dataset.equipment === (group.base_id || group.id);
    button.classList.toggle("active", match);
    button.setAttribute("aria-pressed", String(match));
  });
  document.querySelectorAll("[data-tour]").forEach((button) => {
    const match = guided && Number(button.dataset.tour) === tourIndex;
    button.classList.toggle("active", match);
    button.setAttribute("aria-pressed", String(match));
  });
  const whole = ["yard", "assembly"].includes(group.id);
  $("focus").disabled = whole;
  $("isolate").disabled = whole;
  $("isolate").textContent = model.isolated ? "Show context" : "Isolate device";
  $("isolate").setAttribute("aria-pressed", String(model.isolated));
  $("appearance").value = appearance;
  const seconds = guided ? model.tour[tourIndex].seconds : group.video_seconds;
  $("video-link").href = model.video + (seconds !== undefined ? `&t=${seconds}s` : "");
  $("open-enclosure").setAttribute("aria-pressed", String(Boolean(model.opened)));
  $("open-enclosure").textContent = model.opened ? "Close enclosure" : "Open enclosure";
  $("separation").value = String(Math.round((model.explosion || 0) * 100));
  $("separation-value").textContent = `${$("separation").value}%`;
  host.dataset.loaded = String(ready);
  host.dataset.selected = group.id;
  host.dataset.isolated = String(model.isolated);
  host.dataset.appearance = appearance;
  host.dataset.sourceTriangles = String(model.provenance.triangles || model.provenance.placed_triangles);
  host.dataset.visibleTriangles = String(model.triangles);
  host.dataset.model = model.id;
  host.dataset.opened = String(Boolean(model.opened));
  xr.panel.update();
}
function change(key, value) {
  if (!model || !ready) return;
  if (key === "equipment") {
    guided = false;
    const isolated = model.isolated;
    model.select(value);
    if (isolated) model.isolate(true);
    if (!xr.active) frame(model.getBounds());
    status(`${model.selected.title} · ${model.selected.status}`);
  } else if (key === "appearance") {
    appearance = value;
    model.appearance(value);
    scene.environmentIntensity = value === "source" ? 0.45 : 0.65;
    status(
      value === "source"
        ? model.id === "transformer"
          ? "Original CAD colors."
          : "Original diffuse atlas and authored normals."
        : "Representative material finishes."
    );
  } else if (key === "explosion") {
    model.separate?.(value);
    if (!xr.active) frame(model.getBounds());
  }
  sync();
}
function chooseTour(index) {
  if (!model || !ready) return;
  tourIndex = (index + model.tour.length) % model.tour.length;
  guided = true;
  model.isolate(false);
  model.select(model.tour[tourIndex].id);
  if (!xr.active) frame(model.getBounds());
  else xr.focus();
  status(model.tour[tourIndex].title);
  sync();
}
function action(name) {
  if (!model || !ready) return;
  if (name === "next-tour" || name === "previous-tour") {
    chooseTour(guided ? tourIndex + (name === "next-tour" ? 1 : -1) : 0);
    return;
  }
  if (name === "focus") {
    if (xr.active) xr.focus();
    else frame(model.getBounds());
  }
  if (name === "isolate") {
    const value = !model.isolated;
    model.isolate(value);
    if (xr.active) {
      if (value) xr.focus();
      else xr.resetView();
    } else frame(value ? model.getBounds() : model.getBounds(model.groups[0]));
  }
  if (name === "recenter") {
    model.reset();
    guided = false;
    tourIndex = 0;
    if (xr.active) xr.resetView();
    else {
      model.root.position.set(0, 0, 0);
      model.root.quaternion.identity();
      model.root.scale.setScalar(1);
      frame(model.getBounds());
    }
    status("Complete arrangement restored.");
  }
  if (name === "tabletop" || name === "room") xr.resetView(name);
  if (name === "open") {
    model.open?.(!model.opened);
    if (!xr.active) frame(model.getBounds());
  }
  if (name === "core") {
    model.core?.();
    if (!xr.active) frame(model.getBounds());
  }
  sync();
}
async function load(id) {
  if (xr.active) return;
  const generation = ++loadGeneration;
  ready = false;
  $("enter-vr").disabled = true;
  $("loading").hidden = false;
  $("load-message").textContent = "Loading the complete source model and equipment guide.";
  status("Preparing the model…");
  try {
    let loaded = cache.get(id);
    if (!loaded) {
      if (id === "transformer" && __TRANSFORMER_AVAILABLE__) {
        const { loadTransformer } = await import("./transformer.js");
        loaded = await loadTransformer();
      } else loaded = await loadSubstation();
      cache.set(id, loaded);
    }
    if (generation !== loadGeneration) return;
    if (model) model.root.removeFromParent();
    model = loaded;
    model.reset();
    model.root.position.set(0, 0, 0);
    model.root.quaternion.identity();
    model.root.scale.setScalar(1);
    scene.add(model.root);
    model.appearance(appearance);
    guided = false;
    tourIndex = 0;
    ready = true;
    renderNavigation();
    resize();
    frame(model.getBounds());
    sync();
    $("loading").hidden = true;
    $("enter-vr").disabled = false;
    const modelURL = new URL(location.href);
    if (model.id === "transformer") modelURL.searchParams.set("model", "transformer");
    else modelURL.searchParams.delete("model");
    history.replaceState(history.state, "", modelURL);
    status("Choose a device, or follow the guided tour.");
  } catch (error) {
    if (generation !== loadGeneration) return;
    $("loading").querySelector("p").textContent = "The model could not load";
    $("load-message").textContent = error.message;
    status(error.message);
    console.error(error);
  }
}
function closeDrawers() {
  for (const [panel, button] of [
    ["equipment", "toggle-equipment"],
    ["details", "toggle-details"],
  ]) {
    $(panel).classList.remove("open");
    $(button).setAttribute("aria-expanded", "false");
  }
}
for (const [panel, button] of [
  ["equipment", "toggle-equipment"],
  ["details", "toggle-details"],
])
  $(button).onclick = () => {
    const open = !$(panel).classList.contains("open");
    closeDrawers();
    $(panel).classList.toggle("open", open);
    $(button).setAttribute("aria-expanded", String(open));
  };
document.querySelectorAll("[data-tab]").forEach(
  (button) =>
    (button.onclick = () => {
      activeTab = button.dataset.tab;
      document.querySelectorAll("[data-tab]").forEach((b) => {
        const selected = b.dataset.tab === activeTab;
        b.classList.toggle("active", selected);
        b.setAttribute("aria-pressed", String(selected));
      });
      $("equipment-list").hidden = activeTab !== "equipment";
      $("tour-list").hidden = activeTab !== "tour";
    })
);
$("reset").onclick = () => action("recenter");
$("side").onclick = () => {
  if (model) frame(model.getBounds(), true);
};
$("focus").onclick = () => action("focus");
$("isolate").onclick = () => action("isolate");
$("appearance").onchange = (event) => change("appearance", event.target.value);
$("open-enclosure").onclick = () => action("open");
$("core").onclick = () => action("core");
$("separation").oninput = (event) => change("explosion", Number(event.target.value) / 100);
$("enter-vr").onclick = () => xr.enter();
document.querySelectorAll("[data-dialog]").forEach((button) => (button.onclick = () => $(button.dataset.dialog + "-dialog").showModal()));
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.querySelector(".close-dialog").onclick = () => dialog.close();
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
let pointer = null;
const raycaster = new THREE.Raycaster();
renderer.domElement.addEventListener("pointerdown", (event) => {
  pointer = { x: event.clientX, y: event.clientY, id: event.pointerId };
});
renderer.domElement.addEventListener("pointerup", (event) => {
  if (xr.active || !ready || !pointer || pointer.id !== event.pointerId || Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 6) {
    pointer = null;
    return;
  }
  pointer = null;
  const rect = renderer.domElement.getBoundingClientRect();
  raycaster.setFromCamera(
    new THREE.Vector2(((event.clientX - rect.left) / rect.width) * 2 - 1, 1 - ((event.clientY - rect.top) / rect.height) * 2),
    camera
  );
  const hit = model.pick(raycaster);
  if (hit) change("equipment", hit.group.id);
});
renderer.domElement.addEventListener("pointercancel", () => (pointer = null));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawers();
    xr.panel.hide();
  }
  if (event.key.toLowerCase() === "r" && !event.target.matches("input,select,textarea") && !document.querySelector("dialog[open]"))
    action("recenter");
});
renderer.setAnimationLoop((time, frame) => {
  const dt = frameStart ? Math.min(0.05, (time - frameStart) / 1000) : 0;
  frameStart = time;
  if (xr.active) xr.update(dt, frame);
  else controls.update();
  renderer.render(scene, camera);
});
if (import.meta.env.DEV && new URLSearchParams(location.search).has("qa")) {
  window.__POWER_LAB_QA__ = {
    state: () => ({
      ...panelState(),
      position: model?.root.position.toArray(),
      scale: model?.root.scale.x,
      triangles: model?.triangles,
      renderedTriangles: renderer.info.render.triangles,
      drawCalls: renderer.info.render.calls,
    }),
    choose: (id) => change("equipment", id),
    action,
    load,
    projectCenter() {
      const p = model.getBounds().getCenter(new THREE.Vector3()).project(camera),
        r = renderer.domElement.getBoundingClientRect();
      return { x: r.left + ((p.x + 1) * r.width) / 2, y: r.top + ((1 - p.y) * r.height) / 2 };
    },
    pickPiece(piece) {
      if (model.id !== "substation") return null;
      const attribute = model.root.children[0].geometry.getAttribute("_source_piece"),
        position = model.root.children[0].geometry.getAttribute("position");
      for (let i = 0; i < attribute.count; i++)
        if (attribute.getX(i) === piece) {
          const point = new THREE.Vector3().fromBufferAttribute(position, i).applyMatrix4(model.root.children[0].matrixWorld);
          const origin = point.clone().add(new THREE.Vector3(1, 0.4, 1));
          raycaster.set(origin, point.clone().sub(origin).normalize());
          const hit = model.pick(raycaster);
          return hit ? { id: hit.group.id, piece: hit.sourcePiece } : null;
        }
      return null;
    },
    model: () => model,
    xr,
  };
}
await load(new URLSearchParams(location.search).get("model") === "transformer" && __TRANSFORMER_AVAILABLE__ ? "transformer" : "substation");
