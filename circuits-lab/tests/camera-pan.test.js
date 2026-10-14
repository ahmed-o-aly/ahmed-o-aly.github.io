import test from "node:test";
import assert from "node:assert/strict";
import { PerspectiveCamera, MOUSE } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Offscreen event surface: exercise the real dependency without a browser/GPU.
class Surface {
  style = {};
  clientWidth = 800;
  clientHeight = 500;
  listeners = new Map();
  addEventListener(name, listener) {
    (this.listeners.get(name) || this.listeners.set(name, new Set()).get(name)).add(listener);
  }
  removeEventListener(name, listener) {
    this.listeners.get(name)?.delete(listener);
  }
  getRootNode() {
    return this;
  }
  setPointerCapture() {}
  releasePointerCapture() {}
  dispatch(name, event) {
    for (const listener of this.listeners.get(name) || []) listener(event);
  }
}

test("right-button OrbitControls drag pans without rotating or zooming, and reset restores the view", () => {
  const surface = new Surface();
  const camera = new PerspectiveCamera(39, 800 / 500, 0.05, 35);
  camera.position.set(0, 3, 4);
  const controls = new OrbitControls(camera, surface);
  controls.enablePan = true;
  controls.update();
  controls.saveState();
  assert.equal(controls.mouseButtons.RIGHT, MOUSE.PAN);
  const initialPosition = camera.position.clone(),
    initialTarget = controls.target.clone(),
    initialRotation = camera.quaternion.clone();
  const distance = camera.position.distanceTo(controls.target);
  const event = (x, y) => ({
    pointerId: 1,
    pointerType: "mouse",
    button: 2,
    buttons: 2,
    clientX: x,
    clientY: y,
    pageX: x,
    pageY: y,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    preventDefault() {},
  });
  surface.dispatch("pointerdown", event(200, 150));
  surface.dispatch("pointermove", event(260, 180));
  surface.dispatch("pointerup", event(260, 180));
  controls.update();
  assert.ok(controls.target.distanceTo(initialTarget) > 0.1);
  assert.ok(camera.position.clone().sub(initialPosition).distanceTo(controls.target.clone().sub(initialTarget)) < 1e-10);
  assert.ok(Math.abs(camera.position.distanceTo(controls.target) - distance) < 1e-10);
  assert.ok(camera.quaternion.angleTo(initialRotation) < 1e-7);
  controls.reset();
  assert.ok(camera.position.distanceTo(initialPosition) < 1e-10);
  assert.ok(controls.target.distanceTo(initialTarget) < 1e-10);
  controls.dispose();
});
