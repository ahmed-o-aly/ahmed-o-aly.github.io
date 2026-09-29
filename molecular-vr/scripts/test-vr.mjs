import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { setupVR } from '../src/vr.js';

// Exercise production interaction code with real Three transforms. Only browser
// and XR transport are faked; no headset, WebGL context, or generated poses are required.
class Events {
  constructor() { this.listeners = new Map(); }
  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }
  removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener); }
  async emit(type, event = {}) {
    for (const listener of [...(this.listeners.get(type) || [])]) await listener({ type, ...event });
  }
}
class Element extends Events {
  constructor() {
    super(); this.dataset = {}; this.attributes = {}; this.disabled = false;
    this.classList = { add() {}, remove() {}, toggle() {} };
  }
  setAttribute(name, value) { this.attributes[name] = value; }
  remove() { this.removed = true; }
}
const near = (actual, expected, message, tolerance = 1e-7) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} versus ${expected}`);
const sameVector = (actual, expected, message) => near(actual.distanceTo(expected), 0, message);
const worldPosition = object => object.getWorldPosition(new THREE.Vector3());
const worldMatrix = object => { object.updateWorldMatrix(true, false); return object.matrixWorld.clone(); };
const sameMatrix = (actual, expected, message) => {
  for (let i = 0; i < 16; i++) near(actual.elements[i], expected.elements[i], `${message} (element ${i})`);
};
const pad = () => ({ mapping: 'xr-standard', axes: [0, 0, 0, 0], buttons: Array.from({ length: 6 }, () => ({ pressed: false, value: 0 })) });

function makePanel() {
  const group = new THREE.Group(); group.visible = false;
  const calls = [], hits = new Map(), captures = new Set();
  return {
    group, calls, hits,
    get visible() { return group.visible; },
    get interacting() { return captures.size > 0; },
    show(camera) {
      group.visible = true;
      calls.push(['show', camera, { position: worldPosition(camera), direction: camera.getWorldDirection(new THREE.Vector3()) }]);
    },
    hide() { group.visible = false; captures.clear(); calls.push(['hide']); },
    toggle(camera) { calls.push(['toggle']); if (group.visible) this.hide(); else this.show(camera); },
    update() {},
    dispose() { this.hide(); },
    intersect(controller) { return this.visible ? hits.get(controller) || null : null; },
    pointerDown(id, hit) { captures.add(id); calls.push(['down', id, hit]); return true; },
    pointerMove(id, hit) { calls.push(['move', id, hit]); },
    pointerUp(id) { captures.delete(id); calls.push(['up', id]); },
    cancelPointer(id) { captures.delete(id); calls.push(['cancel', id]); },
  };
}
async function fixture(t, { withPanel = true } = {}) {
  const previous = new Map(['document', 'window', 'navigator'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const document = new Events(); document.visibilityState = 'visible'; document.body = new Element();
  document.createElement = () => new Element();
  const window = new Events(); window.isSecureContext = true;
  const xr = new THREE.EventDispatcher(); xr.isPresenting = false;
  const scene = new THREE.Scene();
  const cameraParent = new THREE.Group(); scene.add(cameraParent);
  const camera = new THREE.PerspectiveCamera(42, 1.5, 0.03, 200); camera.position.set(4, 2, 6); cameraParent.add(camera);
  const modelParent = new THREE.Group(); scene.add(modelParent);
  modelParent.position.set(0.1, 0.2, -0.3);
  const modelRoot = new THREE.Group(); modelRoot.position.set(1, 2, 3); modelRoot.rotation.set(0.2, -0.3, 0.1); modelRoot.scale.setScalar(0.8); modelParent.add(modelRoot);
  const controllers = [new THREE.Group(), new THREE.Group()];
  const grips = [new THREE.Group(), new THREE.Group()];
  const hands = [new THREE.Group(), new THREE.Group()];
  grips.forEach((grip, i) => grip.position.set(i ? 0.3 : -0.3, 1.1, -0.7));
  controllers.forEach((controller, i) => controller.position.copy(grips[i].position));
  hands.forEach(hand => { hand.visible = false; hand.joints = {}; });
  Object.assign(xr, {
    setReferenceSpaceType(type) { this.referenceSpaceType = type; },
    getController: index => controllers[index], getControllerGrip: index => grips[index], getHand: index => hands[index],
    getCamera: () => camera,
    updateCamera(value) { value.updateWorldMatrix(true, false); },
    async setSession(value) { this.session = value; this.isPresenting = Boolean(value); },
  });
  const session = new Events(); session.visibilityState = 'visible';
  session.requestReferenceSpace = async () => ({});
  session.end = async () => { xr.isPresenting = false; await session.emit('end'); xr.dispatchEvent({ type: 'sessionend' }); };
  const navigatorXR = new Events(); navigatorXR.isSessionSupported = async () => true; navigatorXR.requestSession = async () => session;
  for (const [key, value] of Object.entries({ document, window, navigator: { xr: navigatorXR } })) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const panel = withPanel ? makePanel() : undefined, actions = [], statuses = [];
  const renderer = { xr };
  const vr = setupVR({ renderer, scene, camera, modelRoot, panel, onAction: action => actions.push(action), onStatus: value => statuses.push(value) });
  const sources = ['left', 'right'].map(handedness => ({ handedness, targetRayMode: 'tracked-pointer', gamepad: pad() }));
  const saved = { model: worldMatrix(modelRoot), camera: worldMatrix(camera), cameraParent, fov: camera.fov, near: camera.near, far: camera.far, aspect: camera.aspect, zoom: camera.zoom };
  for (let i = 0; i < 2; i++) controllers[i].dispatchEvent({ type: 'connected', data: sources[i] });
  await vr.refreshSupport();
  await vr.button.emit('click');
  assert.equal(vr.active, true, 'fixture must enter an immersive session');
  // A headset frame supplies a head pose in the local reference space.
  camera.position.set(0, 1.6, 0); camera.quaternion.identity(); camera.updateMatrixWorld(true);
  vr.update(1 / 60);
  t.after(async () => {
    await vr.dispose();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key];
    }
  });
  const event = (index, type) => controllers[index].dispatchEvent({ type, data: sources[index] });
  const frame = (delta = 1 / 60) => { scene.updateMatrixWorld(true); vr.update(delta); scene.updateMatrixWorld(true); };
  const press = (index, button, value = true) => { sources[index].gamepad.buttons[button].pressed = value; frame(); };
  const hit = index => {
    const value = { distance: 1.2, point: new THREE.Vector3(0, 1, -1), uv: new THREE.Vector2(0.4, 0.5), control: { type: 'slider' } };
    panel.hits.set(controllers[index], value); return value;
  };
  return { scene, renderer, vr, camera, modelRoot, controllers, grips, hands, sources, panel, actions, statuses, session, document, window, saved, event, frame, press, hit };
}

test('left stick moves the viewer and tracked inputs together without scaling or moving the structure', async t => {
  const f = await fixture(t);
  const rig = f.camera.parent;
  assert.notEqual(rig, f.saved.cameraParent, 'VR uses a player rig independent of the desktop camera parent');
  for (const object of [...f.controllers, ...f.grips, ...f.hands]) assert.equal(object.parent, rig, 'head and all tracked inputs share the player rig');
  f.panel.hide();
  const model = worldMatrix(f.modelRoot), beforeHead = worldPosition(f.camera), beforeHand = worldPosition(f.grips[0]);
  f.sources[0].gamepad.axes[3] = -1;
  f.frame(0.05);
  const headDelta = worldPosition(f.camera).sub(beforeHead), handDelta = worldPosition(f.grips[0]).sub(beforeHand);
  assert.ok(headDelta.z < -1e-4, 'pushing forward walks in the head-forward direction');
  near(headDelta.y, 0, 'locomotion stays on the horizontal plane');
  sameVector(headDelta, handDelta, 'controller positions travel with the viewer');
  sameMatrix(worldMatrix(f.modelRoot), model, 'walking leaves the structure transform unchanged');
  f.sources[0].gamepad.axes[3] = 0;
  const stopped = worldPosition(f.camera);
  f.sources[1].gamepad.axes[2] = 1; f.sources[1].gamepad.axes[3] = -1;
  f.frame(0.05);
  sameVector(worldPosition(f.camera), stopped, 'right stick deflection does not move the viewer');
  sameMatrix(worldMatrix(f.modelRoot), model, 'right stick deflection never scales the structure');
});

test('locomotion follows head yaw, ignores small drift, caps frame time, and does not accelerate diagonally', async t => {
  const f = await fixture(t, { withPanel: false });
  const rig = f.camera.parent, start = rig.position.clone();
  f.sources[0].gamepad.axes[2] = 0.05; f.sources[0].gamepad.axes[3] = -0.05; f.frame(0.05);
  sameVector(rig.position, start, 'deadzone prevents stick drift');
  f.camera.rotation.set(-0.45, Math.PI / 2, 0, 'YXZ');
  f.sources[0].gamepad.axes[2] = 0; f.sources[0].gamepad.axes[3] = -1;
  f.frame(0.05); const headed = rig.position.clone().sub(start);
  assert.ok(headed.x < -1e-4, 'forward follows a leftward head yaw');
  near(headed.z, 0, 'yaw rotates the locomotion heading'); near(headed.y, 0, 'looking down never makes the viewer descend');
  rig.position.copy(start); f.camera.quaternion.identity();
  f.frame(100); const capped = rig.position.distanceTo(start);
  near(capped, headed.length(), 'long pauses cannot cause a large locomotion jump');
  rig.position.copy(start); f.sources[0].gamepad.axes[2] = 1; f.frame(0.05);
  near(rig.position.distanceTo(start), capped, 'diagonal motion has the same maximum walking speed');
  rig.position.copy(start); f.sources[0].gamepad.axes[2] = 0; f.frame(0);
  sameVector(rig.position, start, 'zero delta does not move the viewer');
});

test('two lower grips preserve the existing ball-like scale and rotation gesture', async t => {
  const f = await fixture(t); f.panel.hide();
  f.event(0, 'squeezestart'); f.event(1, 'squeezestart'); f.frame();
  const originalScale = f.modelRoot.scale.x, originalQuaternion = f.modelRoot.quaternion.clone();
  f.grips[0].position.x = -0.6; f.grips[1].position.x = 0.6; f.frame();
  near(f.modelRoot.scale.x, originalScale * 2, 'doubling controller distance doubles model size');
  f.grips[0].position.set(0, 0.5, -0.7); f.grips[1].position.set(0, 1.7, -0.7); f.frame();
  assert.ok(f.modelRoot.quaternion.angleTo(originalQuaternion) > 1.5, 'turning the two-hand axis rotates the model');
  f.grips[0].position.x = -100; f.grips[1].position.x = 100; f.frame();
  near(f.modelRoot.scale.x, originalScale * 4, 'two-hand scaling respects the upper limit');
  f.grips[0].position.set(-0.026, 1.1, -0.7); f.grips[1].position.set(0.026, 1.1, -0.7); f.frame();
  near(f.modelRoot.scale.x, originalScale * 0.15, 'two-hand scaling respects the lower limit');
  f.event(0, 'squeezeend'); f.event(1, 'squeezeend'); f.frame();
  const released = worldMatrix(f.modelRoot); f.grips[0].position.x -= 1; f.frame();
  sameMatrix(worldMatrix(f.modelRoot), released, 'released grips no longer transform the model');
});

test('panel trigger capture cannot fall through into grabbing or walking when the pointer leaves', async t => {
  const f = await fixture(t);
  assert.equal(f.panel.visible, true, 'the control panel is discoverable on entering VR');
  const hit = f.hit(1), model = worldMatrix(f.modelRoot), head = worldPosition(f.camera);
  f.event(1, 'selectstart'); f.frame();
  assert.ok(f.panel.calls.some(call => call[0] === 'down' && call[2] === hit), 'trigger presses the pointed-at panel control');
  f.panel.hits.delete(f.controllers[1]); f.grips[1].position.x += 1;
  f.sources[0].gamepad.axes[3] = -1; f.frame(0.05);
  sameMatrix(worldMatrix(f.modelRoot), model, 'dragging away from the panel never becomes a model grab');
  sameVector(worldPosition(f.camera), head, 'panel interactions suspend locomotion');
  assert.equal(f.panel.interacting, true, 'the panel retains ownership until trigger release');
  f.event(0, 'squeezestart'); f.grips[0].position.x -= 0.3; f.frame();
  sameMatrix(worldMatrix(f.modelRoot), model, 'the other hand cannot begin a model grab during a captured panel action');
  f.event(0, 'squeezeend');
  f.event(1, 'selectend'); f.frame();
  assert.ok(f.panel.calls.some(call => call[0] === 'up'), 'release is delivered even outside the panel');
  assert.equal(f.panel.interacting, false);
  const afterRelease = worldMatrix(f.modelRoot); f.grips[1].position.x += 1; f.frame();
  sameMatrix(worldMatrix(f.modelRoot), afterRelease, 'release cannot leave a latent model grab');
});

test('a trigger grab that starts outside the panel keeps ownership when its ray crosses the panel', async t => {
  const f = await fixture(t);
  f.event(1, 'selectstart'); f.frame();
  const before = worldPosition(f.modelRoot);
  f.hit(1); f.grips[1].position.x += 0.2; f.frame();
  near(worldPosition(f.modelRoot).x - before.x, 0.2, 'crossing the panel does not interrupt an existing model grab');
  assert.equal(f.panel.calls.filter(call => call[0] === 'down').length, 0, 'ray hover cannot synthesize a panel press');
  f.event(1, 'selectend'); f.frame();
  const released = worldMatrix(f.modelRoot); f.grips[1].position.x += 0.2; f.frame();
  sameMatrix(worldMatrix(f.modelRoot), released, 'release ends the model grab even over a panel control');
  f.event(1, 'selectstart'); f.frame();
  assert.equal(f.panel.calls.filter(call => call[0] === 'down').length, 1, 'a fresh trigger press may now belong to the panel');
  f.grips[1].position.x += 0.2; f.frame();
  sameMatrix(worldMatrix(f.modelRoot), released, 'the new panel-owned press cannot transform the model');
});

test('lower grip still grabs the model while aiming at the panel', async t => {
  const f = await fixture(t); f.hit(1);
  const before = worldPosition(f.modelRoot);
  f.event(1, 'squeezestart'); f.frame();
  f.grips[1].position.x += 0.25; f.frame();
  near(worldPosition(f.modelRoot).x - before.x, 0.25, 'lower grip controls the structure, independent of trigger UI targeting');
  assert.equal(f.panel.calls.filter(call => call[0] === 'down').length, 0, 'grip does not activate a panel control');
  f.sources[0].gamepad.axes[3] = -1;
  const head = worldPosition(f.camera), heldModel = worldPosition(f.modelRoot), heldScale = f.modelRoot.scale.clone();
  f.frame(0.05);
  const headDelta = worldPosition(f.camera).sub(head), modelDelta = worldPosition(f.modelRoot).sub(heldModel);
  assert.ok(headDelta.length() > 1e-4, 'the viewer can walk while carrying the structure');
  sameVector(modelDelta, headDelta, 'a held structure travels with the viewer and tracked grips');
  sameVector(f.modelRoot.scale, heldScale, 'walking while carrying never changes structure size');
});

test('disconnecting or losing pose cancels panel ownership and stale model gestures', async t => {
  const f = await fixture(t); f.hit(1); f.event(1, 'selectstart'); f.frame();
  f.event(1, 'disconnected'); f.frame();
  assert.equal(f.panel.interacting, false, 'controller disconnect cancels the captured panel action');
  assert.ok(f.panel.calls.some(call => call[0] === 'cancel'));
  f.event(1, 'connected'); f.panel.hide();
  f.event(1, 'squeezestart'); f.frame();
  f.grips[1].visible = false; f.controllers[1].visible = false; f.frame();
  const stopped = worldMatrix(f.modelRoot);
  f.grips[1].position.x += 1; f.grips[1].visible = true; f.controllers[1].visible = true; f.frame();
  sameMatrix(worldMatrix(f.modelRoot), stopped, 'tracking recovery must not resurrect an old grip');
  f.panel.show(f.camera); f.hit(1); f.event(1, 'selectstart'); f.frame();
  f.grips[1].visible = false; f.controllers[1].visible = false; f.frame();
  assert.equal(f.panel.interacting, false, 'tracking loss also cancels captured panel control');
});

test('buttons use rising edges and distinct left and right hand bindings', async t => {
  const f = await fixture(t);
  f.press(0, 4); f.frame();
  assert.deepEqual(f.actions, [], 'left X summons controls rather than toggling playback');
  assert.equal(f.panel.calls.filter(call => call[0] === 'toggle').length, 1, 'holding X does not repeatedly toggle the panel');
  f.press(0, 4, false);
  f.press(1, 3); f.frame();
  assert.equal(f.panel.calls.filter(call => call[0] === 'toggle').length, 2, 'right stick click summons or hides the panel once');
  f.press(1, 3, false);
  const beforeLeftClick = worldMatrix(f.modelRoot), panelCalls = f.panel.calls.length;
  f.press(0, 3); f.frame();
  sameMatrix(worldMatrix(f.modelRoot), beforeLeftClick, 'left stick click does not unexpectedly recenter');
  assert.equal(f.panel.calls.length, panelCalls, 'left stick click does not toggle the panel');
  f.press(0, 3, false);
  f.press(1, 4); f.frame(); f.press(1, 4, false); f.press(1, 5); f.frame();
  assert.deepEqual(f.actions, ['toggle-playback', 'next-state'], 'right A and B each emit one playback action per press');
  f.press(1, 5, false);
  f.modelRoot.position.x += 5; f.modelRoot.scale.multiplyScalar(2);
  f.press(0, 5); const centered = worldMatrix(f.modelRoot);
  near(f.modelRoot.scale.x, 0.8, 'left Y recenter restores the initial model scale');
  f.modelRoot.position.x += 0.3; const moved = worldMatrix(f.modelRoot); f.frame();
  assert.notDeepEqual(moved.elements, centered.elements);
  sameMatrix(worldMatrix(f.modelRoot), moved, 'holding recenter cannot repeatedly overwrite subsequent manipulation');
});

test('resummoning controls and recentering use the current world head pose after walking', async t => {
  const f = await fixture(t); f.panel.hide();
  f.sources[0].gamepad.axes[2] = 1; f.sources[0].gamepad.axes[3] = -1;
  for (let i = 0; i < 12; i++) f.frame(0.05);
  f.sources[0].gamepad.axes[2] = 0; f.sources[0].gamepad.axes[3] = 0;
  // Combine a translated player rig with a physical head offset and head yaw.
  f.camera.position.x += 0.15; f.camera.rotation.y = -0.65; f.frame();
  const head = worldPosition(f.camera), heading = f.camera.getWorldDirection(new THREE.Vector3());
  assert.ok(head.distanceTo(f.camera.position) > 0.1, 'fixture must distinguish world head pose from local headset coordinates');
  f.press(1, 3);
  const placement = f.panel.calls.filter(call => call[0] === 'show').at(-1)[2];
  sameVector(placement.position, head, 'summoned panel receives the current world head position');
  sameVector(placement.direction, heading, 'summoned panel receives the current viewing direction');
  f.press(1, 3, false);
  f.modelRoot.position.set(8, 7, 6);
  f.press(0, 5);
  const offset = worldPosition(f.modelRoot).sub(head);
  const horizontal = offset.clone().setY(0), forward = heading.clone().setY(0).normalize();
  assert.ok(horizontal.dot(forward) > 0.5, 'recenter places the model ahead of the current head position');
  near(horizontal.clone().cross(forward).length(), 0, 'recenter follows the current head yaw after locomotion');
  assert.ok(offset.y < 0 && offset.y > -0.5, 'recenter remains close to current eye level');
});

test('session visibility loss hides controls and clears interactions until a new press', async t => {
  const f = await fixture(t); f.hit(1); f.event(1, 'selectstart'); f.frame();
  f.sources[0].gamepad.axes[3] = -1;
  f.session.visibilityState = 'visible-blurred'; await f.session.emit('visibilitychange');
  const pausedHead = worldPosition(f.camera), pausedModel = worldMatrix(f.modelRoot);
  f.grips[1].position.x += 1; f.frame(0.05);
  sameVector(worldPosition(f.camera), pausedHead, 'a blurred XR session must not keep walking');
  sameMatrix(worldMatrix(f.modelRoot), pausedModel, 'a blurred XR session must not keep grabbing');
  assert.equal(f.panel.visible, false, 'system UI hides the app panel'); assert.equal(f.panel.interacting, false);
  f.session.visibilityState = 'visible'; await f.session.emit('visibilitychange'); f.frame();
  sameVector(worldPosition(f.camera), pausedHead, 'a stick held through a system interruption must return to neutral before walking resumes');
  f.sources[0].gamepad.axes[3] = 0; f.frame();
  f.sources[0].gamepad.axes[3] = -1; f.frame(0.05);
  assert.ok(worldPosition(f.camera).distanceTo(pausedHead) > 1e-4, 'a new movement after neutral may resume walking');
  f.sources[0].gamepad.axes[3] = 0;
  f.grips[1].position.x += 1; f.frame();
  sameMatrix(worldMatrix(f.modelRoot), pausedModel, 'returning focus cannot restore a stale grab');
  assert.equal(f.panel.visible, false, 'the panel is not forced open again after every focus change');
});

test('optional buttons held across lost XR focus cannot act again until released and pressed anew', async t => {
  const f = await fixture(t);
  const bindings = [[0, 4], [0, 5], [1, 3], [1, 4], [1, 5]];
  const setPressed = pressed => {
    for (const [index, button] of bindings) f.sources[index].gamepad.buttons[button].pressed = pressed;
  };
  setPressed(true); f.frame();
  assert.deepEqual(f.actions, ['toggle-playback', 'next-state'], 'initial A and B presses perform their actions');
  const toggles = f.panel.calls.filter(call => call[0] === 'toggle').length;
  assert.equal(toggles, 2, 'initial X and right-stick-click presses each toggle the panel');
  f.modelRoot.position.x += 1;
  const moved = worldMatrix(f.modelRoot);
  f.session.visibilityState = 'visible-blurred'; await f.session.emit('visibilitychange'); f.frame();
  f.session.visibilityState = 'visible'; await f.session.emit('visibilitychange'); f.frame(); f.frame();
  assert.deepEqual(f.actions, ['toggle-playback', 'next-state'], 'held A/B cannot resume playback or advance on returning focus');
  assert.equal(f.panel.calls.filter(call => call[0] === 'toggle').length, toggles, 'held X/right-stick click cannot reopen controls on returning focus');
  sameMatrix(worldMatrix(f.modelRoot), moved, 'held Y cannot recenter on returning focus');
  assert.equal(f.panel.visible, false, 'the panel stays hidden after the system interruption');
  setPressed(false); f.frame();
  setPressed(true); f.frame();
  assert.deepEqual(f.actions, ['toggle-playback', 'next-state', 'toggle-playback', 'next-state'], 'release and a new A/B press restore normal playback actions');
  assert.equal(f.panel.calls.filter(call => call[0] === 'toggle').length, toggles + 2, 'release and a new X/right-stick click restore panel toggling');
  assert.ok(worldMatrix(f.modelRoot).elements.some((value, i) => Math.abs(value - moved.elements[i]) > 1e-7), 'release and a new Y press recenter the model');
});

test('stale neutral button values during visibility events cannot rearm actions before a visible frame', async t => {
  const f = await fixture(t);
  f.press(1, 4);
  assert.deepEqual(f.actions, ['toggle-playback']);
  f.session.visibilityState = 'visible-blurred'; await f.session.emit('visibilitychange'); f.frame();
  // A runtime may briefly report zeroed gamepad values as system UI closes,
  // then restore the still-held physical button in the first resumed frame.
  f.sources[1].gamepad.buttons[4].pressed = false;
  f.session.visibilityState = 'visible'; await f.session.emit('visibilitychange');
  f.sources[1].gamepad.buttons[4].pressed = true; f.frame(); f.frame();
  assert.deepEqual(f.actions, ['toggle-playback'], 'an event-time neutral snapshot is insufficient to rearm a held button');
  f.press(1, 4, false);
  f.press(1, 4);
  assert.deepEqual(f.actions, ['toggle-playback', 'toggle-playback'], 'a neutral visible frame followed by a fresh press rearms the action');
});

test('leaving VR restores desktop transforms and projection settings', async t => {
  const f = await fixture(t);
  f.panel.hide(); f.sources[0].gamepad.axes[3] = -1; f.frame(0.05);
  f.modelRoot.position.set(9, 8, 7); f.modelRoot.scale.setScalar(3); f.modelRoot.rotation.set(1, 2, 3);
  f.camera.fov = 80; f.camera.near = 0.1; f.camera.far = 15; f.camera.aspect = 2; f.camera.zoom = 1.8;
  await f.session.end();
  assert.equal(f.vr.active, false);
  assert.equal(f.camera.parent, f.saved.cameraParent, 'desktop parent is restored');
  sameMatrix(worldMatrix(f.camera), f.saved.camera, 'desktop camera pose is restored');
  sameMatrix(worldMatrix(f.modelRoot), f.saved.model, 'desktop model pose and size are restored');
  for (const property of ['fov', 'near', 'far', 'aspect', 'zoom']) assert.equal(f.camera[property], f.saved[property]);
  assert.equal(f.panel.visible, false, 'immersive panel disappears on exit');
  const restored = worldMatrix(f.modelRoot); f.frame(100);
  sameMatrix(worldMatrix(f.modelRoot), restored, 'later animation frames cannot mutate the desktop model through old VR input');
});
