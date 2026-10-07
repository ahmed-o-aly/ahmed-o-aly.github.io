import * as THREE from "three";
import { PANEL_SIZE, PAGE_SIZE, colors, clamp, createPanelLayout, panelHitTest, panelSliderValue } from "./panel-layout.js";
function roundedRect(context, x, y, width, height, radius = 10) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawText(context, label, x, y, options = {}) {
  const { size = 26, weight = 400, align = "left", color = colors.ink, width, lines = 1, lineHeight = size * 1.25 } = options;
  context.font = `${weight} ${size}px Arial, sans-serif`;
  context.textAlign = align;
  context.textBaseline = "alphabetic";
  context.fillStyle = color;
  if (!width) {
    context.fillText(String(label), x, y);
    return;
  }
  const rows = [];
  for (const paragraph of String(label).split("\n")) {
    let row = "";
    for (const word of paragraph.split(" ")) {
      const candidate = row ? `${row} ${word}` : word;
      if (row && context.measureText(candidate).width > width) {
        rows.push(row);
        row = word;
      } else row = candidate;
    }
    rows.push(row);
  }
  rows.slice(0, lines).forEach((raw, index) => {
    let value = raw;
    const overflow = index === lines - 1 && rows.length > lines;
    if (overflow || context.measureText(value).width > width) {
      while (value && context.measureText(`${value}…`).width > width) value = value.slice(0, -1);
      value += "…";
    }
    context.fillText(value, x, y + index * lineHeight);
  });
}

/** One world-anchored settings panel. The caller owns controller button routing. */
export function createVRPanel({ getState, onChange = () => {}, onAction = () => {} }) {
  const canvas = document.createElement("canvas");
  canvas.width = PANEL_SIZE.width;
  canvas.height = PANEL_SIZE.height;
  const context = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const geometry = new THREE.PlaneGeometry(PANEL_SIZE.metersWide, PANEL_SIZE.metersHigh);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false, toneMapped: false });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 100;
  const group = new THREE.Group();
  group.name = "VR settings panel";
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
  let tab = "learn";
  let page = 0;
  let layout = { controls: [], texts: [] };
  let signature = "";
  let capture = null;
  let disposed = false;

  function update() {
    if (!group.visible || disposed) return;
    const state = getState();
    page = clamp(page, 0, Math.max(0, Math.ceil((state.groups || []).length / PAGE_SIZE) - 1));
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
      if (control.type === "slider") {
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
        context.strokeStyle = control.selected ? "#789abf" : colors.border;
        context.lineWidth = capture?.control?.id === control.id ? 3 : 1;
        context.stroke();
        const size = control.size || 27;
        const lines = control.lines || 1;
        drawText(
          context,
          control.label,
          lines > 1 ? control.x + 18 : control.x + control.width / 2,
          control.y + (lines > 1 ? 28 : control.height / 2 + size * 0.34),
          {
            size,
            weight: control.selected ? 600 : 400,
            color: control.selected ? colors.blue : colors.ink,
            align: lines > 1 ? "left" : "center",
            width: control.width - 36,
            lines,
            lineHeight: 28,
          }
        );
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
    signature = "";
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
    capture = { id, control, lastValue: control?.type === "slider" ? control.value : undefined };
    if (control?.enabled) {
      if (control.type === "slider") changeSlider(control, hit);
      else if (control.tab) {
        tab = control.tab;
      } else if (control.page !== undefined) {
        page = control.page;
      } else if (control.key) {
        onChange(control.key, control.value);
      } else if (control.action) {
        if (control.action === "close-panel") hide();
        onAction(control.action);
      }
    }
    update();
    return true;
  }

  function pointerMove(id, hit) {
    if (capture?.id !== id || !group.visible || !capture.control || !hit) return;
    if (capture.control.type === "slider") {
      update();
      changeSlider(capture.control, hit);
    }
  }

  function release(id) {
    if (capture?.id === id) {
      capture = null;
      update();
    }
  }

  return {
    group,
    show,
    hide,
    update,
    intersect,
    pointerDown,
    pointerMove,
    toggle(camera) {
      if (group.visible) hide();
      else show(camera);
    },
    pointerUp: release,
    cancelPointer: release,
    get visible() {
      return group.visible;
    },
    get interacting() {
      return capture !== null;
    },
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
