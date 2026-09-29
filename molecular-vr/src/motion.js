import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { SnapshotPlayback } from './motion-state.js';

const $ = (id) => document.getElementById(id);
const motorColors = ['#48899a', '#6487b1', '#9a799e', '#829a61', '#b48a61', '#769f99'];
const descriptions = {
  ED4: 'USP14 docks against the RPT1 ATPase domain. Compare its position with ED2.1.',
  ED5: 'Inspect neighboring pore loops disengaged from the substrate. USP14’s UBL domain is not modeled in this snapshot.',
  ED0: 'USP14 is raised away from the RPT1 ATPase domain. It remains associated with the proteasome.',
  ED1: 'Compare the motor’s pore-loop staircase with the preceding snapshot.',
  'ED2.0': 'Inspect the motor staircase and neighboring disengaged pore loops.',
  'ED2.1': 'Compare USP14 with ED4; the study reports an approximately 30° difference in orientation.',
};
const classify = (chain) => chain.authId === 'v' ? 'substrate' : chain.authId === 'x' ? 'usp14' : /^[A-F]$/.test(chain.authId) ? 'motor' : /^[G-Tg-t]$/.test(chain.authId) ? 'core' : 'regulatory';
const label = (state) => state.label.replaceAll('_USP14', '').replace(/^E_D/, 'ED');
const yieldFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

function makeGeometry(frame, radius = 0.55) {
  const pieces = [];
  for (const [start, end] of frame.segments) {
    if (end - start < 2) continue;
    const points = frame.points.slice(start, end).map((point) => new THREE.Vector3(...point));
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    pieces.push(new THREE.TubeGeometry(curve, Math.max(4, (points.length - 1) * 3), radius, 5, false));
  }
  if (!pieces.length) return null;
  const geometry = mergeGeometries(pieces);
  pieces.forEach((piece) => piece.dispose());
  return geometry;
}

export function createMotionComparison({ parent, onChange = () => {}, onFocus = () => {}, onMode = () => {} }) {
  const root = new THREE.Group(); root.name = 'Experimental structural comparison'; root.visible = false; parent.add(root);
  const snapshotGroups = new Map();
  const materials = [];
  let data, playback, active = false, loading, morphRoot, morphLoading, visibleRoot, planes = [], activation = 0;
  let ghostRoot, lastPosition = NaN, lastHud = '', hud;
  let focus = 'motor';

  function materialFor(chain, ghost = false) {
    const group = classify(chain);
    const color = ghost ? '#526f8a' : group === 'motor' ? motorColors[chain.authId.charCodeAt(0) - 65] : group === 'usp14' ? '#c66e61' : group === 'substrate' ? '#c0942d' : '#adbcc8';
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.7, transparent: ghost, opacity: ghost ? 0.22 : 1, depthWrite: !ghost, clippingPlanes: planes });
    materials.push(material);
    return material;
  }
  function makeSnapshot(index, ghost = false) {
    const group = new THREE.Group();
    for (const chain of data.chains) {
      const frame = chain.observedFrames[index];
      if (!frame || frame.points.length < 2) continue;
      const geometry = makeGeometry(frame, classify(chain) === 'substrate' ? 0.95 : 0.55);
      if (!geometry) continue;
      const mesh = new THREE.Mesh(geometry, materialFor(chain, ghost));
      mesh.name = `${data.states[index].pdbId} · Chain ${chain.authId} · ${chain.name}`;
      mesh.userData.chain = chain;
      mesh.userData.frame = frame;
      if (ghost) mesh.renderOrder = 2;
      group.add(mesh);
    }
    group.visible = false; root.add(group); return group;
  }
  async function load() {
    if (loading) return loading;
    if (data) return;
    loading = (async () => {
      const response = await fetch(`${import.meta.env.BASE_URL}data/motion/motion.json`);
      if (!response.ok) throw new Error(`Motion data: HTTP ${response.status}`);
      data = await response.json();
      if (data.states.length !== 6 || data.chains.some((chain) => chain.observedFrames.length !== 6)) throw new Error('State coverage validation failed');
      playback = new SnapshotPlayback(data.states.length);
      for (let index = 0; index < data.states.length; index++) {
        $('motion-loading').textContent = `Preparing ${label(data.states[index])} · ${index + 1} of ${data.states.length}`;
        await yieldFrame();
        snapshotGroups.set(index, makeSnapshot(index));
      }
      for (let index = 0; index < data.states.length; index++) {
        const state = data.states[index];
        const button = document.createElement('button');
        button.textContent = label(state);
        const small = document.createElement('small'); small.textContent = state.pdbId; button.appendChild(small);
        button.dataset.index = index;
        button.setAttribute('aria-label', `Show ${label(state)} ${state.pdbId}`);
        button.setAttribute('aria-pressed', 'false');
        button.onclick = () => { playback.playing = false; playback.seek(index); display(); };
        $('state-grid').appendChild(button);
      }
      $('motion-position').max = data.states.length - 1;
      $('motion-loading').hidden = true; $('motion-ready').hidden = false;
      hud = makeHud(); root.add(hud);
    })().catch((error) => { data = null; loading = null; throw error; });
    return loading;
  }
  async function prepareMorphs() {
    if (morphRoot) return;
    if (morphLoading) return morphLoading;
    morphLoading = (async () => {
      const group = new THREE.Group(); group.visible = false;
      for (const chain of data.chains) {
        if (classify(chain) === 'substrate' || chain.interpolationAllowed === false || chain.frames[0].length < 2) continue;
        const edges = [];
        for (const [start, end] of chain.segments) for (let i = start; i < end - 1; i++) edges.push([i, i + 1]);
        if (!edges.length) continue;
        // Interpolate scientific coordinates, not tube surface vertices: independent
        // Frenet frames would twist or collapse the cross-section between snapshots.
        const geometry = new THREE.CylinderGeometry(0.55, 0.55, 1, 6, 1, false);
        const mesh = new THREE.InstancedMesh(geometry, materialFor(chain), edges.length);
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        mesh.userData.chain = chain; mesh.userData.edges = edges;
        mesh.name = `Illustrative matched C-alpha links · ${chain.authId}`;
        const bounds = new THREE.Box3();
        for (const frame of chain.frames) for (const point of frame) bounds.expandByPoint(new THREE.Vector3(...point));
        mesh.boundingSphere = bounds.expandByScalar(1).getBoundingSphere(new THREE.Sphere());
        group.add(mesh);
        if (group.children.length % 6 === 0) await yieldFrame();
      }
      morphRoot = group; root.add(morphRoot);
    })().finally(() => { morphLoading = null; });
    return morphLoading;
  }
  function allowed(chain) {
    const group = classify(chain);
    if ($('motion-open-channel').checked && chain.authId === 'F') return false;
    if (focus === 'usp14') return chain.authId === 'A' || group === 'usp14';
    return focus === 'complex' || ['motor', 'usp14', 'substrate'].includes(group);
  }
  function applyFocus() {
    for (const group of [...snapshotGroups.values(), morphRoot, ghostRoot].filter(Boolean)) {
      for (const mesh of group.children) mesh.visible = allowed(mesh.userData.chain);
    }
  }
  function uspShift(index) {
    const chain = data.chains.find((item) => classify(item) === 'usp14');
    if (!chain?.frames[0].length) return null;
    let sum = 0;
    chain.frames[index].forEach((point, j) => { for (let axis = 0; axis < 3; axis++) sum += (point[axis] - chain.frames[0][j][axis]) ** 2; });
    return Math.sqrt(sum / chain.frames[0].length);
  }
  function makeHud() {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 220;
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(200, 43), material);
    mesh.userData.canvas = canvas; mesh.userData.texture = texture; mesh.renderOrder = 10; mesh.visible = false;
    // Caption stays with the same model coordinate transform and can be read in VR.
    const bounds = getBounds(); const center = bounds.getCenter(new THREE.Vector3());
    mesh.position.set(center.x, bounds.max.y + 28, center.z);
    return mesh;
  }
  function updateHud(text, vrCamera) {
    if (!hud) return;
    hud.visible = Boolean(vrCamera) && active;
    if (text !== lastHud) {
      const context = hud.userData.canvas.getContext('2d');
      context.clearRect(0, 0, 1024, 220);
      context.fillStyle = '#edf3f8'; context.fillRect(0, 0, 1024, 220);
      context.fillStyle = '#294f7b'; context.font = '500 42px sans-serif'; context.fillText(text, 30, 64);
      context.fillStyle = '#5e788f'; context.font = '26px sans-serif';
      context.fillText('Experimental states · display timing only', 30, 116);
      context.fillText('A/X: play/pause   B/Y: next (where available)', 30, 164);
      hud.userData.texture.needsUpdate = true; lastHud = text;
    }
    if (vrCamera) {
      const target = vrCamera.getWorldPosition(new THREE.Vector3());
      hud.lookAt(target);
    }
  }
  function display() {
    if (!data || !playback) return;
    const position = playback.position;
    const rounded = Math.round(position);
    const exact = Math.abs(position - rounded) < 0.000001;
    const lower = Math.floor(position), upper = Math.min(lower + 1, data.states.length - 1), weight = position - lower;
    for (const group of snapshotGroups.values()) group.visible = false;
    if (morphRoot) morphRoot.visible = false;
    if (exact) {
      visibleRoot = snapshotGroups.get(rounded); visibleRoot.visible = true;
    } else if (morphRoot) {
      visibleRoot = morphRoot; morphRoot.visible = true;

    }
    if (ghostRoot) ghostRoot.visible = $('motion-ghost').checked && exact && (position !== 0);
    applyFocus();
    if (!exact && morphRoot) {
      const a = new THREE.Vector3(), b = new THREE.Vector3(), endpoint = new THREE.Vector3(), delta = new THREE.Vector3(), midpoint = new THREE.Vector3();
      const up = new THREE.Vector3(0, 1, 0), scale = new THREE.Vector3(), rotation = new THREE.Quaternion(), matrix = new THREE.Matrix4();
      for (const mesh of morphRoot.children) {
        if (!mesh.visible) continue;
        const from = mesh.userData.chain.frames[lower], to = mesh.userData.chain.frames[upper];
        for (let i = 0; i < mesh.userData.edges.length; i++) {
          const [start, end] = mesh.userData.edges[i];
          a.fromArray(from[start]).lerp(endpoint.fromArray(to[start]), weight);
          b.fromArray(from[end]).lerp(endpoint.fromArray(to[end]), weight);
          delta.copy(b).sub(a); const length = delta.length();
          rotation.setFromUnitVectors(up, delta.multiplyScalar(1 / Math.max(length, 1e-9)));
          midpoint.copy(a).add(b).multiplyScalar(0.5); scale.set(1, length, 1);
          matrix.compose(midpoint, rotation, scale); mesh.setMatrixAt(i, matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }
    }
    const state = data.states[exact ? rounded : lower];
    const stateName = exact ? label(state) : `${label(state)} → ${label(data.states[upper])}`;
    const evidence = exact ? 'Experimental snapshot' : `Illustrative interpolation · ${Math.round(weight * 100)}%`;
    $('motion-evidence').textContent = evidence; $('motion-evidence').classList.toggle('interpolated', !exact);
    $('motion-state-label').textContent = exact ? `${stateName} · ${state.pdbId}` : stateName;
    $('motion-description').textContent = exact ? descriptions[label(state)] : 'Matched Cα positions are linearly interpolated and shown as backbone links. These coordinates are illustrative; the unassigned substrate is hidden.';
    $('motion-source').textContent = exact ? `Source: ${state.pdbId} ↗` : `Starting endpoint: ${state.pdbId} ↗`;
    $('motion-source').href = `https://www.rcsb.org/structure/${state.pdbId}`;
    $('motion-fit').textContent = exact ? `${Number(state.coreRmsd).toFixed(2)} Å` : 'Endpoints only';
    $('motion-shift').textContent = exact ? `${uspShift(rounded)?.toFixed(2) ?? '—'} Å` : 'Endpoints only';
    $('motion-coverage').textContent = exact ? 'Full deposited Cα traces for this state. Shift uses common USP14 residues relative to ED4 after core alignment; it includes modeling uncertainty.' : 'Matched protein residues only. Substrate and unmatched residues hidden. This interpolated shape was not experimentally observed.';
    $('motion-position').value = position;
    $('motion-position').setAttribute('aria-valuetext', `${stateName}, ${evidence}`);
    for (const button of $('state-grid').children) button.setAttribute('aria-pressed', String(exact && Number(button.dataset.index) === rounded));
    $('motion-prev').disabled = position === 0;
    $('motion-next').disabled = position === data.states.length - 1;
    $('motion-play').textContent = playback.playing ? 'Pause' : position === data.states.length - 1 ? 'Replay snapshots' : playback.interpolate ? 'Play illustration' : 'Play snapshots';
    if (active) onChange({ exact, state, stateName, evidence, position, playing: playback.playing, chainCount: data.chains.filter(allowed).length });
    lastPosition = position;
  }

  $('motion-play').onclick = () => { if (playback) { playback.toggle(); display(); } };
  $('motion-prev').onclick = () => { playback?.step(-1); display(); };
  $('motion-next').onclick = () => { playback?.step(1); display(); };
  $('motion-position').oninput = () => { if (playback) { playback.playing = false; playback.seek(Number($('motion-position').value)); display(); } };
  $('motion-speed').onchange = () => { if (playback) playback.seconds = Number($('motion-speed').value); };
  $('motion-smooth').onchange = async () => {
    if (!playback) return;
    playback.playing = false;
    const enabled = $('motion-smooth').checked;
    if (enabled) {
      $('motion-smooth').disabled = true;
      $('interpolation-note').textContent = 'Preparing matched protein coordinates…';
      try { await prepareMorphs(); } catch (error) {
        $('motion-smooth').checked = false; $('motion-smooth').disabled = false;
        $('interpolation-note').textContent = `Could not prepare interpolation: ${error.message}`; return;
      }
      $('motion-smooth').disabled = false;
    }
    playback.setInterpolation(enabled);
    $('motion-position').step = enabled ? 0.01 : 1;
    $('interpolation-note').textContent = enabled ? 'On: illustrative geometry between observed states. Substrate and unmatched residues hidden between endpoints. No measured timing.' : 'Off: only deposited snapshots. Display timing is illustrative; this is not a measured trajectory.';
    display();
  };
  $('motion-focus').onchange = () => { focus = $('motion-focus').value; applyFocus(); display(); onFocus(); };
  $('motion-open-channel').onchange = () => { applyFocus(); display(); onFocus({ fit: false }); };
  $('motion-ghost').onchange = () => {
    if (!data) return;
    if ($('motion-ghost').checked && !ghostRoot) ghostRoot = makeSnapshot(0, true);
    display();
  };
  function getBounds() {
    const box = new THREE.Box3();
    if (!data) return box;
    // Across all observed states: no reframing/jump when the state changes.
    for (const chain of data.chains) {
      if (!allowed(chain)) continue;
      for (const frame of chain.observedFrames) for (const point of frame.points) box.expandByPoint(new THREE.Vector3(...point));
    }
    return box;
  }
  return {
    get active() { return active; },
    get chainCount() { return data?.chains.filter(allowed).length ?? 0; },
    get data() { return data; },
    getBounds,
    async activate() {
      const token = ++activation;
      $('motion-controls').hidden = false; $('structure-controls').hidden = true;
      try {
        await load();
        if (token !== activation) return;
        active = true; root.visible = true;
        onMode(true); display(); onFocus();
      } catch (error) {
        $('motion-loading').textContent = `Could not load the state comparison: ${error.message}. Return to 7W38 and retry.`;
        $('motion-loading').hidden = false;
      }
    },
    deactivate() {
      activation++; active = false; root.visible = false;
      if (playback) playback.playing = false;
      $('motion-controls').hidden = true; $('structure-controls').hidden = false;
      onMode(false);
    },
    update(delta, vrCamera) {
      if (!active || !playback) return;
      if (playback.update(delta) || lastPosition !== playback.position) display();
      const rounded = Math.round(playback.position);
      const exact = Math.abs(playback.position - rounded) < 0.000001;
      updateHud(exact ? `${label(data.states[rounded])} / ${data.states[rounded].pdbId} · observed` : 'ILLUSTRATIVE INTERPOLATION', vrCamera);
    },
    action(action) {
      if (!active || !playback) return;
      if (action === 'toggle-playback') playback.toggle();
      if (action === 'next-state') playback.step(1);
      display();
    },
    setClipping(nextPlanes) { planes = nextPlanes; for (const material of materials) { material.clippingPlanes = planes; material.needsUpdate = true; } },
    pick(raycaster) {
      if (!active || !visibleRoot) return null;
      return raycaster.intersectObjects(visibleRoot.children.filter((mesh) => mesh.visible)).find((hit) => !planes.length || planes.every((plane) => plane.distanceToPoint(hit.point) >= 0)) ?? null;
    },
  };
}
