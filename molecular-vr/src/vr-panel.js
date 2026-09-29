import * as THREE from 'three';

export const PANEL_SIZE = Object.freeze({ width: 800, height: 920, metersWide: 0.68, metersHigh: 0.782 });
const CHAIN_PAGE_SIZE = 5;
const clamp = (value, min, max) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
const colors = { paper: '#f9fbfc', ink: '#263e52', muted: '#667d90', blue: '#174789', border: '#d5e0e9', soft: '#eaf0f5', selected: '#dce8f5' };

/** Logical pixels are also the pointer coordinate system, independent of headset resolution. */
export function createPanelLayout(state, { tab = 'display', page = 0 } = {}) {
  const controls = [];
  const texts = [];
  const ready = state.ready !== false;
  const structure = state.mode !== 'motion';
  const button = (id, label, x, y, width, height, properties = {}) => controls.push({ id, type: 'button', label, x, y, width, height, enabled: ready, ...properties });
  const text = (label, x, y, properties = {}) => texts.push({ label, x, y, size: 26, ...properties });
  const slider = (id, label, y, min, max, step, value, valueLabel, enabled = ready) => {
    text(label, 36, y - 18);
    text(valueLabel, 764, y - 18, { align: 'right', color: colors.blue });
    controls.push({ id, type: 'slider', x: 36, y, width: 728, height: 66, min, max, step, value: clamp(Number(value), min, max), enabled });
  };

  text('Protein structures', 36, 49, { size: 33, weight: 600 });
  text(state.message || (structure ? '7W38 · experimental density + model' : 'Experimental state comparison'), 36, 90, { size: 23, color: state.message ? '#916838' : colors.muted, width: 728 });
  button('close', '×', 692, 20, 72, 58, { enabled: true, action: 'close-panel', size: 38 });
  ['display', 'chains', 'view'].forEach((value, index) => {
    button(`tab-${value}`, value[0].toUpperCase() + value.slice(1), 36 + index * 248, 125, 232, 62, { tab: value, selected: tab === value, enabled: true });
  });

  if (tab === 'display') {
    text('Density', 36, 229, { weight: 600 });
    const densityEnabled = ready && structure;
    [['wireframe', 'Wireframe'], ['surface', 'Surface'], ['off', 'Off']].forEach(([value, label], index) => {
      button(`density-${value}`, label, 36 + index * 248, 248, 232, 62, { key: 'densityMode', value, enabled: densityEnabled, selected: state.densityMode === value });
    });
    const contours = state.contours || [];
    const index = clamp(Number(state.contourIndex), 0, Math.max(0, contours.length - 1));
    slider('contourIndex', 'Contour', 362, 0, Math.max(0, contours.length - 1), 1, index, contours.length ? `${contours[index]} σ${state.contourLoading ? ' · loading' : ''}` : 'Loading…', densityEnabled && contours.length > 0);
    slider('opacity', 'Opacity', 478, 0.05, 1, 0.05, state.opacity, `${Math.round(clamp(Number(state.opacity), 0.05, 1) * 100)}%`, densityEnabled);
    button('modelVisible', state.modelVisible ? '✓  Atomic model visible' : 'Atomic model hidden', 36, 562, 728, 62, { key: 'modelVisible', value: !state.modelVisible, selected: state.modelVisible, enabled: ready && structure });
    slider('cutaway', 'Cutaway', 682, 0, 100, 1, state.cutaway, Number(state.cutaway) > 0 ? `${Math.round(state.cutaway)}%` : 'Off');
    text('Whole structure', 36, 764, { size: 22, color: colors.muted });
    text('Inside', 764, 764, { size: 22, color: colors.muted, align: 'right' });
    text(structure ? 'Left stick moves you · grips hold / scale' : '7W38 density unavailable in state comparison.', 36, 810, { size: 22, color: colors.muted });
  } else if (tab === 'chains') {
    const chains = state.chains || [];
    const lastPage = Math.max(0, Math.ceil(chains.length / CHAIN_PAGE_SIZE) - 1);
    const currentPage = clamp(page, 0, lastPage);
    text(structure ? 'Isolate a deposited chain' : 'Return to 7W38 to isolate chains.', 36, 230, { size: 26, weight: 600 });
    button('chain-all', 'All chains', 36, 252, 728, 62, { key: 'selectedChain', value: 'all', selected: state.selectedChain === 'all', enabled: ready && structure });
    chains.slice(currentPage * CHAIN_PAGE_SIZE, (currentPage + 1) * CHAIN_PAGE_SIZE).forEach((chain, index) => {
      button(`chain-${chain.id}`, `Chain ${chain.label}`, 36, 330 + index * 78, 728, 70, { key: 'selectedChain', value: chain.id, selected: state.selectedChain === chain.id, enabled: ready && structure, size: 25, lines: 2 });
    });
    if (!chains.length) text('Loading chain names…', 36, 377, { color: colors.muted });
    button('chains-previous', '‹ Previous', 36, 737, 224, 62, { page: currentPage - 1, enabled: structure && currentPage > 0 });
    button('chains-next', 'Next ›', 540, 737, 224, 62, { page: currentPage + 1, enabled: structure && currentPage < lastPage });
    text(`${currentPage + 1} / ${lastPage + 1}`, 400, 775, { align: 'center', color: colors.muted });
    text('Author chain IDs · only the model is isolated.', 36, 827, { size: 21, color: colors.muted });
  } else {
    text('Explore', 36, 230, { weight: 600 });
    button('structure-mode', '7W38 + density', 36, 248, 352, 62, { action: 'structure-mode', selected: structure });
    button('motion-mode', 'State comparison', 412, 248, 352, 62, { action: 'motion-mode', selected: !structure });
    if (!structure) {
      const motionReady = ready && !state.motionLoading && state.motionAvailable !== false;
      text(state.motionLabel || 'Loading experimental structures…', 36, 349, { size: 26, weight: 600, width: 728, lines: 2 });
      button('previous-state', '‹ Previous', 36, 395, 208, 62, { action: 'previous-state', enabled: motionReady });
      button('toggle-playback', state.motionPlaying ? 'Pause' : 'Play states', 260, 395, 280, 62, { action: 'toggle-playback', selected: state.motionPlaying, enabled: motionReady });
      button('next-state', 'Next ›', 556, 395, 208, 62, { action: 'next-state', enabled: motionReady });
      text('Focus', 36, 502, { size: 25, weight: 600 });
      [['motor', 'ATPase motor + USP14 + substrate'], ['usp14', 'USP14 + RPT1 contact'], ['complex', 'Whole complex']].forEach(([value, label], index) => {
        button(`focus-${value}`, label, 36, 520 + index * 58, 728, 50, { key: 'motionFocus', value, selected: state.motionFocus === value, size: 25, enabled: motionReady });
      });
      button('motionOverlay', `${state.motionOverlay ? '✓  ' : ''}Overlay ED4 reference`, 36, 702, 728, 50, { key: 'motionOverlay', value: !state.motionOverlay, selected: state.motionOverlay, size: 25, enabled: motionReady });
      button('motionHideRPT5', `${state.motionHideRPT5 ? '✓  ' : ''}Hide RPT5 to expose channel`, 36, 762, 728, 50, { key: 'motionHideRPT5', value: !state.motionHideRPT5, selected: state.motionHideRPT5, size: 25, enabled: motionReady });
    } else {
      text('Compare six experimental structures', 36, 371, { size: 28, weight: 600 });
      text('State comparison steps through observed models.\nThe authors’ inferred order is not a measured\ncontinuous motion or biological timescale.', 36, 425, { size: 25, color: colors.muted, width: 728, lines: 5, lineHeight: 38 });
      text('The Display tab controls density and cutaway.\nThe Chains tab isolates individual subunits.', 36, 627, { size: 25, color: colors.muted, width: 728, lines: 3, lineHeight: 38 });
    }
  }
  button('recenter', 'Recenter model', 36, 850, 300, 50, { action: 'recenter', size: 24 });
  text('Trigger: adjust', 764, 870, { size: 21, align: 'right', color: colors.muted });
  text('X / right stick click: panel', 764, 898, { size: 21, align: 'right', color: colors.muted });
  return { controls, texts };
}

export function panelHitTest(layout, uv) {
  if (!uv || !Number.isFinite(uv.x) || !Number.isFinite(uv.y) || uv.x < 0 || uv.x > 1 || uv.y < 0 || uv.y > 1) return null;
  const x = uv.x * PANEL_SIZE.width;
  const y = (1 - uv.y) * PANEL_SIZE.height;
  return layout.controls.find((control) => x >= control.x && x <= control.x + control.width && y >= control.y && y <= control.y + control.height) || null;
}

export function panelSliderValue(control, uv) {
  const inset = 16;
  const ratio = clamp((uv.x * PANEL_SIZE.width - control.x - inset) / (control.width - 2 * inset), 0, 1);
  const stepped = control.min + Math.round((ratio * (control.max - control.min)) / control.step) * control.step;
  return Number(clamp(stepped, control.min, control.max).toFixed(4));
}

function roundedRect(context, x, y, width, height, radius = 10) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawText(context, label, x, y, options = {}) {
  const { size = 26, weight = 400, align = 'left', color = colors.ink, width, lines = 1, lineHeight = size * 1.25 } = options;
  context.font = `${weight} ${size}px "DM Sans", Arial, sans-serif`;
  context.textAlign = align;
  context.textBaseline = 'alphabetic';
  context.fillStyle = color;
  if (!width) { context.fillText(String(label), x, y); return; }
  const rows = [];
  for (const paragraph of String(label).split('\n')) {
    let row = '';
    for (const word of paragraph.split(' ')) {
      const candidate = row ? `${row} ${word}` : word;
      if (row && context.measureText(candidate).width > width) { rows.push(row); row = word; }
      else row = candidate;
    }
    rows.push(row);
  }
  rows.slice(0, lines).forEach((raw, index) => {
    let value = raw;
    const overflow = index === lines - 1 && rows.length > lines;
    if (overflow || context.measureText(value).width > width) {
      while (value && context.measureText(`${value}…`).width > width) value = value.slice(0, -1);
      value += '…';
    }
    context.fillText(value, x, y + index * lineHeight);
  });
}

/** One world-anchored settings panel. The caller owns controller button routing. */
export function createVRPanel({ getState, onChange = () => {}, onAction = () => {} }) {
  const canvas = document.createElement('canvas');
  canvas.width = PANEL_SIZE.width;
  canvas.height = PANEL_SIZE.height;
  const context = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const geometry = new THREE.PlaneGeometry(PANEL_SIZE.metersWide, PANEL_SIZE.metersHigh);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false, toneMapped: false });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 100;
  const group = new THREE.Group();
  group.name = 'VR settings panel';
  group.visible = false;
  group.add(mesh);
  const raycaster = new THREE.Raycaster();
  const origin = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const rotation = new THREE.Quaternion();
  const yaw = new THREE.Quaternion();
  const cameraPosition = new THREE.Vector3();
  const right = new THREE.Vector3();
  const worldMatrix = new THREE.Matrix4();
  const inverseParent = new THREE.Matrix4();
  const unitScale = new THREE.Vector3(1, 1, 1);
  let tab = 'display';
  let page = 0;
  let layout = { controls: [], texts: [] };
  let signature = '';
  let capture = null;
  let disposed = false;

  function update() {
    if (!group.visible || disposed) return;
    const state = getState();
    page = clamp(page, 0, Math.max(0, Math.ceil((state.chains || []).length / CHAIN_PAGE_SIZE) - 1));
    const nextSignature = JSON.stringify({ state, tab, page, active: capture?.control?.id });
    if (nextSignature === signature) return;
    signature = nextSignature;
    layout = createPanelLayout(state, { tab, page });
    context.clearRect(0, 0, canvas.width, canvas.height);
    roundedRect(context, 1, 1, canvas.width - 2, canvas.height - 2, 24);
    context.fillStyle = colors.paper;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = colors.border;
    context.stroke();
    context.fillStyle = colors.border;
    context.fillRect(36, 207, 728, 1);
    context.fillRect(36, 840, 728, 1);
    for (const control of layout.controls) {
      context.globalAlpha = control.enabled ? 1 : 0.38;
      if (control.type === 'slider') {
        const start = control.x + 16;
        const end = control.x + control.width - 16;
        const progress = control.max === control.min ? 0 : (control.value - control.min) / (control.max - control.min);
        const point = start + progress * (end - start);
        roundedRect(context, start, control.y + 28, end - start, 10, 5);
        context.fillStyle = colors.border;
        context.fill();
        if (point > start) {
          roundedRect(context, start, control.y + 28, point - start, 10, 5);
          context.fillStyle = colors.blue;
          context.fill();
        }
        context.beginPath();
        context.arc(point, control.y + 33, capture?.control?.id === control.id ? 19 : 16, 0, Math.PI * 2);
        context.fillStyle = colors.blue;
        context.fill();
      } else {
        roundedRect(context, control.x, control.y, control.width, control.height, 10);
        context.fillStyle = control.selected ? colors.selected : colors.soft;
        context.fill();
        context.strokeStyle = control.selected ? '#789abf' : colors.border;
        context.lineWidth = capture?.control?.id === control.id ? 3 : 1;
        context.stroke();
        const size = control.size || 27;
        const lines = control.lines || 1;
        drawText(context, control.label, lines > 1 ? control.x + 18 : control.x + control.width / 2,
          control.y + (lines > 1 ? 28 : control.height / 2 + size * 0.34),
          { size, weight: control.selected ? 600 : 400, color: control.selected ? colors.blue : colors.ink, align: lines > 1 ? 'left' : 'center', width: control.width - 36, lines, lineHeight: 28 });
      }
    }
    context.globalAlpha = 1;
    for (const item of layout.texts) drawText(context, item.label, item.x, item.y, item);
    texture.needsUpdate = true;
  }

  function hide() {
    capture = null;
    group.visible = false;
  }

  function show(camera) {
    if (disposed) return;
    camera.updateWorldMatrix(true, false);
    camera.getWorldPosition(cameraPosition);
    camera.getWorldDirection(direction);
    direction.y = 0;
    if (direction.lengthSq() < 0.0001) direction.set(0, 0, -1);
    direction.normalize();
    right.crossVectors(direction, THREE.Object3D.DEFAULT_UP).normalize();
    origin.copy(cameraPosition).addScaledVector(direction, 1.1).addScaledVector(right, 0.27);
    origin.y -= 0.16;
    // Mesh fronts point along +Z. Keep the panel upright with no camera pitch/roll.
    yaw.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, Math.atan2(-direction.x, -direction.z));
    worldMatrix.compose(origin, yaw, unitScale);
    if (group.parent) {
      group.parent.updateWorldMatrix(true, false);
      inverseParent.copy(group.parent.matrixWorld).invert();
      worldMatrix.premultiply(inverseParent);
    }
    worldMatrix.decompose(group.position, group.quaternion, group.scale);
    capture = null;
    signature = '';
    group.visible = true;
    group.updateWorldMatrix(false, true);
    update();
  }

  function intersect(controller) {
    if (!group.visible || disposed) return null;
    controller.updateWorldMatrix(true, false);
    group.updateWorldMatrix(true, true);
    controller.getWorldPosition(origin);
    controller.getWorldQuaternion(rotation);
    direction.set(0, 0, -1).applyQuaternion(rotation).normalize();
    raycaster.set(origin, direction);
    const hit = raycaster.intersectObject(mesh, false)[0];
    return hit ? { uv: hit.uv, distance: hit.distance } : null;
  }

  function changeSlider(control, hit) {
    if (!hit?.uv || !Number.isFinite(hit.uv.x) || !Number.isFinite(hit.uv.y)) return;
    const live = layout.controls.find((item) => item.id === control.id);
    if (!live?.enabled) return;
    const value = panelSliderValue(live, hit.uv);
    if (capture.lastValue === value) return;
    capture.lastValue = value;
    onChange(control.id, value);
    update();
  }

  function pointerDown(id, hit) {
    if (!group.visible || !hit || disposed) return false;
    // Any hit, including disabled controls and empty space, consumes the press.
    if (capture !== null) return true;
    update();
    const control = panelHitTest(layout, hit.uv);
    capture = { id, control, lastValue: control?.type === 'slider' ? control.value : undefined };
    if (control?.enabled) {
      if (control.type === 'slider') changeSlider(control, hit);
      else if (control.tab) { tab = control.tab; }
      else if (control.page !== undefined) { page = control.page; }
      else if (control.key) { onChange(control.key, control.value); }
      else if (control.action) {
        if (control.action === 'close-panel') hide();
        onAction(control.action);
      }
    }
    update();
    return true;
  }

  function pointerMove(id, hit) {
    if (capture?.id !== id || !group.visible || !capture.control || !hit) return;
    if (capture.control.type === 'slider') { update(); changeSlider(capture.control, hit); }
  }

  function release(id) {
    if (capture?.id === id) { capture = null; update(); }
  }

  return {
    group, show, hide, update, intersect, pointerDown, pointerMove,
    toggle(camera) { if (group.visible) hide(); else show(camera); },
    pointerUp: release,
    cancelPointer: release,
    get visible() { return group.visible; },
    get interacting() { return capture !== null; },
    dispose() {
      hide();
      disposed = true;
      group.removeFromParent();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    },
  };
}
