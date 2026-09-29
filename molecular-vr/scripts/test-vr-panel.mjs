import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { createVRPanel, createPanelLayout, panelHitTest, panelSliderValue, PANEL_SIZE } from '../src/vr-panel.js';

function fixture(overrides = {}) {
  const painted = [];
  let paints = 0;
  const context = {
    beginPath() {}, roundRect() {}, fill() {}, stroke() {}, fillRect() {}, arc() {},
    clearRect() { paints++; },
    fillText(value) { painted.push(value); },
    measureText(value) { return { width: value.length * 12 }; },
  };
  const oldDocument = globalThis.document;
  globalThis.document = { createElement(type) { assert.equal(type, 'canvas'); return { getContext: () => context, width: 0, height: 0 }; } };
  const state = {
    ready: true, mode: 'structure', contours: [0.3, 0.5, 0.8, 1, 1.5, 2, 3.2], contourIndex: 1,
    contourLoading: false, opacity: 0.5, cutaway: 0, densityMode: 'wireframe', modelVisible: true,
    chains: Array.from({ length: 12 }, (_, index) => ({ id: String.fromCharCode(65 + index), label: `${String.fromCharCode(65 + index)} · Protein subunit ${index + 1}` })),
    selectedChain: 'all', motionPlaying: false, motionLabel: 'ED4 · 7W3A · observed structure',
    motionFocus: 'motor', motionOverlay: false, motionHideRPT5: true,
    ...overrides,
  };
  const changes = [];
  const actions = [];
  const panel = createVRPanel({ getState: () => state, onChange(key, value) { changes.push([key, value]); state[key] = value; }, onAction(action) { actions.push(action); } });
  const camera = new THREE.PerspectiveCamera();
  camera.position.set(0, 1.6, 0);
  const scene = new THREE.Scene();
  scene.add(camera, panel.group);
  return {
    panel, camera, scene, state, changes, actions, painted,
    get paints() { return paints; },
    close() { panel.dispose(); globalThis.document = oldDocument; },
  };
}

function control(state, id, tab = 'display', page = 0) {
  const result = createPanelLayout(state, { tab, page }).controls.find((item) => item.id === id);
  assert.ok(result, `Missing control ${id}`);
  return result;
}

function hitAt(item, ratio = 0.5) {
  return { uv: new THREE.Vector2((item.x + item.width * ratio) / PANEL_SIZE.width, 1 - (item.y + item.height / 2) / PANEL_SIZE.height), distance: 1.1 };
}

function click(f, id, tab = 'display', page = 0) {
  assert.equal(f.panel.pointerDown('left', hitAt(control(f.state, id, tab, page))), true);
  f.panel.pointerUp('left');
}

test('panel is hidden until summoned; it stays at its placed world pose when the head moves', () => {
  const f = fixture();
  try {
    assert.equal(f.panel.visible, false);
    assert.equal(f.panel.intersect(new THREE.Object3D()), null);
    assert.equal(f.panel.pointerDown('left', hitAt(control(f.state, 'opacity'))), false);
    f.panel.show(f.camera);
    assert.equal(f.panel.visible, true);
    const placed = f.panel.group.getWorldPosition(new THREE.Vector3());
    assert.ok(placed.distanceTo(new THREE.Vector3(0.27, 1.44, -1.1)) < 1e-9);
    f.camera.position.add(new THREE.Vector3(3, 0.5, 2));
    f.camera.rotation.y = 1;
    f.panel.update();
    assert.ok(f.panel.group.getWorldPosition(new THREE.Vector3()).distanceTo(placed) < 1e-9, 'settings must not follow head movement');
    f.panel.toggle(f.camera);
    assert.equal(f.panel.visible, false);
  } finally { f.close(); }
});

test('real Three rays map plane hits to UV; misses and hidden panels do not intercept', () => {
  const f = fixture();
  try {
    f.panel.show(f.camera);
    const controller = new THREE.Object3D();
    controller.position.set(0.27, 1.44, 0);
    f.scene.add(controller);
    const hit = f.panel.intersect(controller);
    assert.ok(hit);
    assert.ok(Math.abs(hit.uv.x - 0.5) < 1e-6);
    assert.ok(Math.abs(hit.uv.y - 0.5) < 1e-6);
    assert.ok(Math.abs(hit.distance - 1.1) < 1e-6);
    controller.position.x = 3;
    assert.equal(f.panel.intersect(controller), null);
    f.panel.hide();
    controller.position.x = 0.27;
    assert.equal(f.panel.intersect(controller), null);
  } finally { f.close(); }
});

test('summoning uses camera world yaw and handles a transformed parent', () => {
  const f = fixture();
  try {
    const parent = new THREE.Group();
    parent.position.set(5, 2, 3);
    parent.rotation.y = 0.8;
    f.scene.add(parent);
    parent.add(f.panel.group);
    f.camera.position.set(2, 1.8, -3);
    f.camera.rotation.set(0.6, Math.PI / 2, 0, 'YXZ');
    f.panel.show(f.camera);
    const worldPosition = f.panel.group.getWorldPosition(new THREE.Vector3());
    assert.ok(worldPosition.distanceTo(new THREE.Vector3(0.9, 1.64, -3.27)) < 1e-6);
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(f.panel.group.getWorldQuaternion(new THREE.Quaternion()));
    assert.ok(normal.distanceTo(new THREE.Vector3(1, 0, 0)) < 1e-6, 'panel must stay upright, ignoring head pitch');
  } finally { f.close(); }
});

test('blank and disabled panel presses consume the gesture without changing the model', () => {
  const f = fixture({ mode: 'motion' });
  try {
    f.panel.show(f.camera);
    assert.equal(f.panel.pointerDown('left', { uv: new THREE.Vector2(0.02, 0.02) }), true);
    assert.equal(f.panel.interacting, true);
    f.panel.pointerUp('left');
    click(f, 'density-surface');
    click(f, 'opacity');
    click(f, 'contourIndex');
    click(f, 'modelVisible');
    assert.deepEqual(f.changes, []);
    assert.deepEqual(f.actions, []);
    assert.ok(f.painted.includes('7W38 density unavailable in state comparison.'));
    click(f, 'cutaway');
    assert.equal(f.changes.at(-1)[0], 'cutaway', 'cutaway remains usable in comparison mode');
  } finally { f.close(); }
});

test('one captured pointer owns a slider; release/loss cannot strand the interaction', () => {
  const f = fixture();
  try {
    f.panel.show(f.camera);
    const opacity = control(f.state, 'opacity');
    f.panel.pointerDown('left', hitAt(opacity, 0.25));
    assert.equal(f.panel.interacting, true);
    const count = f.changes.length;
    assert.equal(f.panel.pointerDown('right', hitAt(control(f.state, 'density-surface'))), true);
    f.panel.pointerMove('right', hitAt(opacity, 0.9));
    f.panel.pointerUp('right');
    assert.equal(f.changes.length, count);
    assert.equal(f.panel.interacting, true);
    f.panel.pointerMove('left', null);
    assert.equal(f.changes.length, count, 'brief ray loss must not reset a slider');
    f.panel.pointerMove('left', { uv: new THREE.Vector2(5, 0.4) });
    assert.deepEqual(f.changes.at(-1), ['opacity', 1]);
    f.panel.pointerMove('left', { uv: new THREE.Vector2(-5, 0.4) });
    assert.deepEqual(f.changes.at(-1), ['opacity', 0.05]);
    f.panel.cancelPointer('left');
    assert.equal(f.panel.interacting, false);
    click(f, 'density-surface');
    assert.equal(f.state.densityMode, 'surface');
    f.panel.pointerDown('left', hitAt(opacity));
    f.panel.hide();
    assert.equal(f.panel.interacting, false);
  } finally { f.close(); }
});

test('contour slider emits discrete preset changes only and clamps to the true end presets', () => {
  const f = fixture();
  try {
    f.panel.show(f.camera);
    const slider = control(f.state, 'contourIndex');
    const uvForIndex = (index) => ({ uv: new THREE.Vector2((slider.x + 16 + index / 6 * (slider.width - 32)) / PANEL_SIZE.width, 0.57) });
    f.panel.pointerDown('left', uvForIndex(1));
    assert.equal(f.changes.length, 0, 'pressing the active preset must not refetch it');
    f.panel.pointerMove('left', uvForIndex(2));
    f.panel.pointerMove('left', uvForIndex(2.2));
    f.panel.pointerMove('left', uvForIndex(2.4));
    assert.deepEqual(f.changes, [['contourIndex', 2]]);
    f.panel.pointerMove('left', uvForIndex(9));
    assert.deepEqual(f.changes.at(-1), ['contourIndex', 6]);
    f.panel.pointerMove('left', uvForIndex(-9));
    assert.deepEqual(f.changes.at(-1), ['contourIndex', 0]);
    assert.equal(panelSliderValue(slider, new THREE.Vector2(NaN, 0)), 0);
  } finally { f.close(); }
});

test('chain pagination reaches every chain, selection persists, and mode restrictions apply', () => {
  const f = fixture();
  try {
    const namedChain = createPanelLayout({ ...f.state, chains: [{ id: 'F', label: 'G · Regulatory subunit' }] }, { tab: 'chains' }).controls.find((item) => item.id === 'chain-F');
    assert.equal(namedChain.label, 'Chain G · Regulatory subunit', 'author-facing chain labels must not be confused with internal label_asym IDs');
    f.panel.show(f.camera);
    click(f, 'tab-chains');
    click(f, 'chains-previous', 'chains');
    click(f, 'chain-A', 'chains');
    assert.equal(f.state.selectedChain, 'A');
    click(f, 'chains-next', 'chains');
    click(f, 'chain-F', 'chains', 1);
    assert.equal(f.state.selectedChain, 'F');
    click(f, 'chains-next', 'chains', 1);
    click(f, 'chains-next', 'chains', 2);
    click(f, 'chain-L', 'chains', 2);
    assert.equal(f.state.selectedChain, 'L');
    click(f, 'chain-all', 'chains', 2);
    assert.equal(f.state.selectedChain, 'all');
    f.state.mode = 'motion';
    f.panel.update();
    const count = f.changes.length;
    click(f, 'chain-K', 'chains', 2);
    assert.equal(f.changes.length, count);
    f.state.chains = f.state.chains.slice(0, 3);
    f.state.mode = 'structure';
    f.panel.update();
    click(f, 'chain-C', 'chains');
    assert.equal(f.state.selectedChain, 'C', 'a shorter refreshed list must clamp the current page');
  } finally { f.close(); }
});

test('view controls expose observed playback/focus actions, disabling them while loading', () => {
  const f = fixture({ mode: 'motion', motionLoading: true, message: 'Loading structures…' });
  try {
    f.panel.show(f.camera);
    click(f, 'tab-view');
    click(f, 'toggle-playback', 'view');
    click(f, 'focus-usp14', 'view');
    assert.deepEqual(f.actions, []);
    assert.deepEqual(f.changes, []);
    f.state.motionLoading = false;
    f.state.motionAvailable = false;
    f.panel.update();
    click(f, 'toggle-playback', 'view');
    assert.deepEqual(f.actions, [], 'a failed structure load must not enable playback');
    f.state.motionAvailable = true;
    f.state.message = '';
    f.panel.update();
    click(f, 'toggle-playback', 'view');
    click(f, 'previous-state', 'view');
    click(f, 'next-state', 'view');
    assert.deepEqual(f.actions, ['toggle-playback', 'previous-state', 'next-state']);
    click(f, 'focus-usp14', 'view');
    click(f, 'motionOverlay', 'view');
    click(f, 'motionHideRPT5', 'view');
    assert.deepEqual(f.changes, [['motionFocus', 'usp14'], ['motionOverlay', true], ['motionHideRPT5', false]]);
    click(f, 'structure-mode', 'view');
    click(f, 'recenter', 'view');
    click(f, 'close', 'view');
    assert.deepEqual(f.actions.slice(-3), ['structure-mode', 'recenter', 'close-panel']);
    assert.equal(f.panel.visible, false);
    assert.equal(f.panel.interacting, false);
  } finally { f.close(); }
});

test('canvas redraws only on state or interaction changes and all targets lie within panel', () => {
  const f = fixture();
  try {
    f.panel.show(f.camera);
    const initial = f.paints;
    for (let i = 0; i < 60; i++) f.panel.update();
    assert.equal(f.paints, initial);
    f.state.opacity = 0.7;
    f.panel.update();
    assert.equal(f.paints, initial + 1);
    for (const mode of ['structure', 'motion']) for (const tab of ['display', 'chains', 'view']) {
      const layout = createPanelLayout({ ...f.state, mode }, { tab });
      for (const target of layout.controls) {
        assert.ok(target.x >= 0 && target.y >= 0 && target.x + target.width <= PANEL_SIZE.width && target.y + target.height <= PANEL_SIZE.height, `${mode}/${tab}/${target.id} outside panel`);
        assert.equal(panelHitTest(layout, hitAt(target).uv)?.id, target.id);
      }
      assert.equal(panelHitTest(layout, new THREE.Vector2(-1, 0)), null);
      assert.equal(panelHitTest(layout, new THREE.Vector2(0.5, NaN)), null);
    }
  } finally { f.close(); }
});
