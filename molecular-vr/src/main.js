import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { setupVR } from './vr.js';
import { createMotionComparison } from './motion.js';
import './style.css';

const $ = (id) => document.getElementById(id);
const container = $('viewport');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#eaf0f5');
const camera = new THREE.PerspectiveCamera(36, 1, 0.01, 100);
camera.position.set(0, 0.1, 4.3);
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
} catch (error) {
  $('load-message').textContent = 'This browser could not start WebGL. Try an up-to-date browser with hardware acceleration enabled.';
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.localClippingEnabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
container.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.09;
controls.minDistance = 0.25;
controls.maxDistance = 12;
controls.autoRotateSpeed = 0.65;
scene.add(new THREE.HemisphereLight(0xffffff, 0x8b9fb3, 2.2));
const light = new THREE.DirectionalLight(0xffffff, 2.4);
light.position.set(3, 5, 5);
scene.add(light);
const fill = new THREE.DirectionalLight(0xd0e5ff, 1.3);
fill.position.set(-4, 0, -4);
scene.add(fill);

const modelRoot = new THREE.Group();
modelRoot.name = '7W38 structure and experimental density';
scene.add(modelRoot);
const contents = new THREE.Group();
modelRoot.add(contents);
const backboneRoot = new THREE.Group();
backboneRoot.name = 'Deposited C-alpha backbone';
contents.add(backboneRoot);
const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 1000);
const densityMaterial = new THREE.MeshBasicMaterial({
  color: '#174789', wireframe: true, transparent: true, opacity: 0.5,
  side: THREE.DoubleSide, forceSinglePass: true, depthWrite: false, clippingPlanes: [],
});
const surfaceMaterial = new THREE.MeshStandardMaterial({ color: '#174789', transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false, roughness: 0.65, metalness: 0, clippingPlanes: [] });
let densityMesh, manifest, structure, vr, motion, ready = false, densityMode = 'wireframe', loadVersion = 0;
let center, height, localMaxZ, localMinZ, selectedChain = 'all';
let frameCounter = 0, fpsTime = performance.now();
const meshCache = new Map();
const palette = ['#d2a570','#70a99c','#90a8c4','#bd8e95','#9c9f6c','#bf9374','#8e9cbc','#83b6b0','#c9b26e','#a498b4','#79a0a6','#c49686'];
const chainMeshes = [];
const dataUrl = (path) => `${import.meta.env.BASE_URL}data/${path}`;
async function get(path, type = 'json') {
  const response = await fetch(dataUrl(path));
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response[type]();
}

function resize() {
  if (renderer.xr.isPresenting) return;
  const width = container.clientWidth, height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  if (ready) fitView();
}
new ResizeObserver(resize).observe(container);
resize();

// Every chain and the density share this one coordinate transform. No fitted alignment.
function buildBackbone(data) {
  const min = new THREE.Vector3(...data.bounds.min);
  const max = new THREE.Vector3(...data.bounds.max);
  center = min.clone().add(max).multiplyScalar(0.5);
  height = Math.max(...max.clone().sub(min).toArray());
  contents.position.copy(center).multiplyScalar(-1);
  modelRoot.scale.setScalar(2 / height);
  localMinZ = min.z;
  localMaxZ = max.z;
  data.chains.forEach((chain, i) => {
    const color = palette[i % palette.length];
    const pieces = [];
    let segment = [];
    const flush = () => {
      if (segment.length > 1) {
        const curve = new THREE.CatmullRomCurve3(segment, false, 'centripetal');
        pieces.push(new THREE.TubeGeometry(curve, Math.max(4, (segment.length - 1) * 3), 0.48, 5, false));
      }
      segment = [];
    };
    const breaks = new Set((chain.segments || []).map((segment) => segment[0]));
    for (let pointIndex = 0; pointIndex < chain.points.length; pointIndex++) {
      if (breaks.has(pointIndex)) flush();
      const v = new THREE.Vector3(...chain.points[pointIndex]);
      if (segment.length && segment.at(-1).distanceToSquared(v) > 25) flush();
      segment.push(v);
    }
    flush();
    if (!pieces.length) return;
    const geometry = mergeGeometries(pieces);
    pieces.forEach((g) => g.dispose());
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.68, metalness: 0, clippingPlanes: [] });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `Chain ${chain.authId || chain.id} · ${chain.name}`;
    mesh.userData.chain = chain;
    mesh.userData.baseColor = color;
    backboneRoot.add(mesh);
    chainMeshes.push(mesh);
    const option = document.createElement('option');
    option.value = chain.id;
    option.textContent = `${chain.authId || chain.id} · ${chain.name}`;
    $('chain').appendChild(option);
  });
  $('chain-count').textContent = `${data.chains.length} chains`;
}

async function setContour(index) {
  const version = ++loadVersion;
  const entry = manifest.levels[index];
  $('contour-value').textContent = `${Number(entry.sigma).toFixed(2)} σ`;
  $('scene-state').textContent = 'Loading contour';
  try {
    let geometry = meshCache.get(index);
    if (!geometry) {
      const [vertices, indices] = await Promise.all([get(entry.positions, 'arrayBuffer'), get(entry.indices, 'arrayBuffer')]);
      if (version !== loadVersion) return;
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      meshCache.set(index, geometry);
      // Keep just two density levels in memory for headset browsers.
      for (const [key, oldGeometry] of meshCache) {
        if (meshCache.size <= 2) break;
        if (key !== index && oldGeometry !== densityMesh?.geometry) {
          oldGeometry.dispose(); meshCache.delete(key);
        }
      }
    }
    if (version !== loadVersion) return;
    if (densityMesh) {
      densityMesh.geometry = geometry;
    } else {
      densityMesh = new THREE.Mesh(geometry, densityMaterial);
      densityMesh.name = 'EMD-32273 experimental density';
      densityMesh.renderOrder = 1;
      contents.add(densityMesh);
    }
    densityMesh.visible = densityMode !== 'off' && !motion?.active;
    densityMesh.material = densityMode === 'surface' ? surfaceMaterial : densityMaterial;
    $('density-note').textContent = 'Experimental map · 2.74 Å sampling. Contours in σ relative to the full deposited map.';
    if (!motion?.active) $('scene-state').textContent = `${Number(entry.sigma).toFixed(2)} σ · aligned map`;
    $('contour-value').title = `Absolute map value: ${entry.absolute}`;
  } catch (error) {
    if (version !== loadVersion) return;
    $('scene-state').textContent = 'Contour could not load';
    $('density-note').textContent = `Could not load density. Check the connection and try another contour. ${error.message}`;
    if (!ready) throw error;
  }
}

function chooseChain(id, showLabel = false) {
  selectedChain = id;
  $('chain').value = id;
  for (const mesh of chainMeshes) mesh.visible = id === 'all' || mesh.userData.chain.id === id;
  const chain = structure?.chains.find((item) => item.id === id);
  $('selection').hidden = !chain || !showLabel;
  if (chain) $('selection').textContent = `Chain ${chain.authId || chain.id} · ${chain.name} · ${chain.points.length} residues`;
}
function fitView(direction = camera.position.clone().sub(controls.target).normalize()) {
  if (!height || renderer.xr.isPresenting) return;
  modelRoot.updateWorldMatrix(true, true);
  const box = motion?.active ? motion.getBounds().applyMatrix4(contents.matrixWorld) : new THREE.Box3().setFromObject(backboneRoot).union(densityMesh ? new THREE.Box3().setFromObject(densityMesh) : new THREE.Box3());
  const target = box.getCenter(new THREE.Vector3());
  const up = new THREE.Vector3(0, 1, 0);
  if (Math.abs(direction.dot(up)) > 0.999) direction.z += 0.001;
  direction.normalize();
  const right = new THREE.Vector3().crossVectors(up, direction).normalize();
  const vertical = new THREE.Vector3().crossVectors(direction, right).normalize();
  const tangentY = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const tangentX = tangentY * camera.aspect;
  let distance = 0;
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
    const point = new THREE.Vector3(x, y, z).sub(target);
    distance = Math.max(distance, point.dot(direction) + 1.3 * Math.max(Math.abs(point.dot(right)) / tangentX, Math.abs(point.dot(vertical)) / tangentY));
  }
  controls.target.copy(target);
  camera.position.copy(target).addScaledVector(direction, distance);
  controls.update();
}
function resetView() {
  if (vr?.active) { vr.reset(); return; }
  modelRoot.position.set(0, 0, 0);
  modelRoot.rotation.set(0, 0, 0);
  if (height) modelRoot.scale.setScalar(2 / height);
  controls.target.set(0, 0, 0);
  camera.position.set(0, 0.1, 4.3);
  controls.autoRotate = false;
  $('spin').setAttribute('aria-pressed', 'false');
  fitView(new THREE.Vector3(0, 0.035, 1).normalize());
}
motion = createMotionComparison({ parent: contents,
  onMode(active) {
    backboneRoot.visible = !active && $('model-visible').checked;
    if (densityMesh) densityMesh.visible = !active && densityMode !== 'off';
    document.body.classList.toggle('motion-active', active);
    $('mode-motion').setAttribute('aria-pressed', String(active));
    $('mode-structure').setAttribute('aria-pressed', String(!active));
    $('selection').hidden = true;
    controls.autoRotate = false; $('spin').setAttribute('aria-pressed', 'false');
    if (active) {
      const bounds = motion.getBounds(); localMinZ = bounds.min.z; localMaxZ = bounds.max.z;
    } else {
      $('stage-name').innerHTML = '7W38<span> / </span>';
      $('stage-name').classList.remove('interpolated-title');
      $('stage-subtitle').textContent = 'USP14-bound · EA2.0_UBL';
      $('header-pdb').textContent = '7W38'; $('header-resolution').textContent = '3.10 Å';
      if (manifest) $('scene-state').textContent = `${Number(manifest.levels[$('contour').value].sigma).toFixed(2)} σ · aligned map`;
      if (structure) { localMinZ = structure.bounds.min[2]; localMaxZ = structure.bounds.max[2]; }
      if (ready) fitView();
    }
  },
  onFocus(options = {}) {
    if (motion?.active) { const bounds = motion.getBounds(); localMinZ = bounds.min.z; localMaxZ = bounds.max.z; }
    if (ready && options.fit !== false) fitView();
  },
  onChange({ exact, state, stateName, evidence }) {
    $('stage-name').textContent = stateName;
    $('stage-name').classList.toggle('interpolated-title', !exact);
    $('stage-subtitle').textContent = exact ? `${state.pdbId} · Substrate-engaged proteasome` : 'Illustrative intermediate · matched residues only';
    $('header-pdb').textContent = exact ? state.pdbId : 'Between states';
    $('header-resolution').textContent = exact ? `${Number(state.resolution).toFixed(2)} Å` : 'Illustration';
    $('scene-state').textContent = evidence;
    $('selection').hidden = true;
  },
});
$('mode-motion').onclick = () => { if (ready) motion.activate(); };
$('mode-structure').onclick = () => motion.deactivate();
$('reset').onclick = resetView;
$('front').onclick = () => { resetView(); fitView(new THREE.Vector3(0, 0, 1)); };
$('side').onclick = () => { resetView(); fitView(new THREE.Vector3(1, 0, 0)); };
$('top').onclick = () => { resetView(); fitView(new THREE.Vector3(0, 1, 0.001).normalize()); };
$('spin').onclick = () => { controls.autoRotate = !controls.autoRotate; $('spin').setAttribute('aria-pressed', String(controls.autoRotate)); };
$('capture').onclick = () => {
  renderer.render(scene, camera);
  const anchor = document.createElement('a');
  anchor.download = `${motion.active ? $('stage-name').textContent.replaceAll(' ', '_') : '7W38-density-' + $('contour-value').textContent.replace(' σ','sigma')}.png`;
  anchor.href = renderer.domElement.toDataURL('image/png');
  anchor.click();
};
$('density-style').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  densityMode = button.dataset.mode;
  for (const item of $('density-style').children) item.setAttribute('aria-pressed', String(item === button));
  if (densityMesh) densityMesh.visible = densityMode !== 'off';
  if (densityMesh) densityMesh.material = densityMode === 'surface' ? surfaceMaterial : densityMaterial;
});
$('contour').addEventListener('input', () => { if (manifest) setContour(Number($('contour').value)); });
$('recommended').onclick = () => {
  if (!manifest) return;
  const index = manifest.levels.length - 1;
  $('contour').value = index;
  setContour(index);
};
$('opacity').addEventListener('input', () => {
  surfaceMaterial.opacity = densityMaterial.opacity = Number($('opacity').value);
  $('opacity-value').textContent = densityMaterial.opacity.toFixed(2);
});
$('density-color').addEventListener('input', () => {
  densityMaterial.color.set($('density-color').value);
  surfaceMaterial.color.copy(densityMaterial.color);
  $('color-hex').textContent = $('density-color').value.toUpperCase();
});
$('model-visible').onchange = () => { backboneRoot.visible = $('model-visible').checked; };
$('chain').onchange = () => chooseChain($('chain').value, true);
$('slice').addEventListener('input', () => {
  const amount = Number($('slice').value);
  $('slice-value').textContent = amount ? `${amount}%` : 'Off';
  const planes = amount ? [clipPlane] : [];
  for (const material of [densityMaterial, surfaceMaterial]) { material.clippingPlanes = planes; material.needsUpdate = true; }
  chainMeshes.forEach((mesh) => { mesh.material.clippingPlanes = planes; mesh.material.needsUpdate = true; });
  motion.setClipping(planes);
});
const dialog = $('help');
function showHelp() { dialog.showModal(); }
$('help-open').onclick = showHelp;
$('vr-help').onclick = showHelp;
$('header-vr').onclick = () => { if (vr?.supported) vr.button.click(); else showHelp(); };
$('help-close').onclick = () => dialog.close();
dialog.addEventListener('click', (event) => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'r' && !['INPUT','SELECT','TEXTAREA'].includes(event.target.tagName) && !dialog.open) resetView();
});
if (location.protocol === 'https:') {
  const link = document.createElement('a'); link.href = location.href; link.textContent = location.href;
  $('headset-link').append('Headset address: ', link);
} else {
  $('headset-link').textContent = 'This local preview is ready for desktop viewing. To use a standalone headset, serve the built viewer over HTTPS; setup instructions are included in README.md.';
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pressPosition;
renderer.domElement.addEventListener('pointerdown', (event) => { if (event.button === 0) pressPosition = [event.clientX, event.clientY]; });
renderer.domElement.addEventListener('pointerup', (event) => {
  if (!ready || !pressPosition || (!backboneRoot.visible && !motion.active) || Math.hypot(event.clientX - pressPosition[0], event.clientY - pressPosition[1]) > 4) return;
  pressPosition = null;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  if (motion.active) {
    const hit = motion.pick(raycaster);
    if (hit) { $('selection').textContent = `Chain ${hit.object.userData.chain.authId} · ${hit.object.userData.chain.name}`; $('selection').hidden = false; }
    else $('selection').hidden = true;
    return;
  }
  const hits = raycaster.intersectObjects(chainMeshes.filter((mesh) => mesh.visible));
  const hit = hits.find((item) => !$('slice').valueAsNumber || clipPlane.distanceToPoint(item.point) >= 0);
  if (hit) {
    const chain = hit.object.userData.chain;
    $('selection').textContent = `Chain ${chain.authId || chain.id} · ${chain.name} · ${chain.points.length} residues`;
    $('selection').hidden = false;
  } else $('selection').hidden = true;
});

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const delta = Math.min(clock.getDelta(), 0.05);
  if (vr?.active) vr.update(delta); else controls.update();
  motion?.update(delta, vr?.active ? renderer.xr.getCamera() : null);
  if (height && $('slice').valueAsNumber) {
    // Cut in model coordinates, so the section follows VR grabs and turns.
    const z = THREE.MathUtils.lerp(localMaxZ + 2, localMinZ - 2, $('slice').valueAsNumber / 100);
    clipPlane.set(new THREE.Vector3(0, 0, -1), z);
    contents.updateWorldMatrix(true, false);
    clipPlane.applyMatrix4(contents.matrixWorld);
  }
  renderer.render(scene, camera);
  frameCounter++;
  const now = performance.now();
  if (ready && now - fpsTime > 1800) {
    const fps = Math.round(frameCounter * 1000 / (now - fpsTime));
    $('render-stats').textContent = `${motion.active ? motion.chainCount : structure.chains.length} chains · ${fps} fps`;
    fpsTime = now; frameCounter = 0;
  }
});

async function init() {
  try {
    [structure, manifest] = await Promise.all([get('backbone.json'), get('density-manifest.json')]);
    $('load-message').textContent = 'Building the backbone and aligning the density…';
    buildBackbone(structure);
    $('contour').max = manifest.levels.length - 1;
    const index = manifest.levels.findIndex((level) => level.sigma === 0.5);
    $('contour').value = Math.max(0, index);
    $('contour-min').textContent = `${manifest.levels[0].sigma} σ`;
    $('contour-max').textContent = `${manifest.levels.at(-1).sigma} σ`;
    await setContour(Math.max(0, index));
    $('contour').disabled = false;
    $('density-note').textContent = 'Experimental map · 2.74 Å sampling. Contours in σ relative to the full deposited map.';
    $('map-detail').textContent = 'The deposited map has 0.685 Å voxels; this interactive overview uses 2.74 Å sampling. The deposited contour is 0.005 absolute (about 3.2 σ). The starting setting of 0.5 σ shows more weak density. The Cα trace omits side chains and ligands; download the original mmCIF for all atomic coordinates.';
    vr = setupVR({ renderer, scene, camera, modelRoot, onAction: (action) => motion.action(action), onStatus: ({ kind, message }) => {
      $('vr-status').textContent = message;
      controls.enabled = kind !== 'active' && kind !== 'entering';
      if (kind === 'active') {
        controls.autoRotate = false;
        $('spin').setAttribute('aria-pressed', 'false');
        $('selection').hidden = true;
      }
      if (kind === 'ready' && ready) { controls.update(); }
    }});
    $('vr-button').appendChild(vr.button);
    ready = true;
    $('loading').hidden = true;
    resetView();
  } catch (error) {
    console.error(error);
    $('load-message').textContent = `The structure could not load. Reload to retry. ${error.message}`;
    $('loading').querySelector('h2').textContent = 'Unable to open the structure';
    $('loading').querySelector('.loader').style.display = 'none';
    $('scene-state').textContent = 'Load failed';
  }
}
init();
