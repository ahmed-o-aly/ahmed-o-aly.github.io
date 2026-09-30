import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createVRSession, recenterRig, snapshotDesktopView, restoreDesktopView } from '../src/vr-session.js';

// These tests exercise application lifecycle and placement math with mocked XR
// objects. They do not represent a physical-headset or browser-permission run.
const flush = () => new Promise((resolve) => setImmediate(resolve));
const near = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
const vectorNear = (actual, expected) => ['x', 'y', 'z'].forEach((axis) => near(actual[axis], expected[axis]));
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

class MockSession extends THREE.EventDispatcher {
  constructor({ floor = true } = {}) {
    super(); this.floor = floor; this.referenceRequests = []; this.endCalls = 0; this.ended = false;
  }
  async requestReferenceSpace(type) {
    this.referenceRequests.push(type);
    if (type === 'local-floor' && !this.floor) throw Object.assign(new Error('Floor reference unavailable'), { name: 'NotSupportedError' });
    return { type };
  }
  async end() {
    this.endCalls++;
    if (this.ended) return;
    this.ended = true;
    this.dispatchEvent({ type: 'end' });
  }
}

class MockSystem extends THREE.EventDispatcher {
  constructor({ supported = true, session = new MockSession(), request } = {}) {
    super(); this.supported = supported; this.session = session; this.request = request;
    this.supportQueries = []; this.sessionRequests = [];
  }
  async isSessionSupported(mode) { this.supportQueries.push(mode); return this.supported; }
  async requestSession(mode, options) {
    this.sessionRequests.push({ mode, options });
    return this.request ? this.request() : this.session;
  }
}

class MockManager extends THREE.EventDispatcher {
  constructor({ attachError = null } = {}) {
    super(); this.attachError = attachError; this.session = null; this.isPresenting = false;
    this.referenceSpaceType = null; this.attachCalls = 0;
  }
  setReferenceSpaceType(type) { this.referenceSpaceType = type; }
  async setSession(session) {
    this.attachCalls++;
    if (this.attachError) throw this.attachError;
    this.session = session; this.isPresenting = true;
    session.addEventListener('end', () => {
      this.session = null; this.isPresenting = false;
      this.dispatchEvent({ type: 'sessionend' });
    });
    this.dispatchEvent({ type: 'sessionstart' });
  }
  getSession() { return this.session; }
}

async function harness({ xr = new MockSystem(), manager = new MockManager(), secure = true, hooks = {} } = {}) {
  const statuses = [], before = [], started = [], ended = [];
  const controller = createVRSession({
    navigatorXR: xr, xrManager: manager, isSecureContext: secure,
    onStatus: (status) => statuses.push({ ...status }),
    onBeforeSession: (event) => { before.push(event); hooks.before?.(event); },
    onSessionStarted: (event) => { started.push(event); hooks.started?.(event); },
    onSessionEnded: (event) => { ended.push(event); hooks.ended?.(event); },
  });
  await flush();
  return { controller, xr, manager, statuses, before, started, ended };
}

function desktop() {
  const rig = new THREE.Group(), camera = new THREE.PerspectiveCamera(47, 1.7, 0.04, 70);
  camera.position.set(2.4, 2.1, 3.8);
  camera.quaternion.setFromEuler(new THREE.Euler(-0.35, 0.45, 0.02, 'YXZ'));
  camera.scale.set(1.05, 1.05, 1.05);
  camera.zoom = 1.2;
  camera.updateProjectionMatrix();
  rig.add(camera);
  const controls = { enabled: true, target: new THREE.Vector3(0.1, 0.9, -1.1), updates: 0, update() { this.updates++; } };
  return { rig, camera, controls };
}

function viewerPose(position, { yaw = 0, pitch = 0, roll = 0 } = {}) {
  const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, roll, 'YXZ'));
  return { transform: { position: { ...position }, orientation: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w } } };
}

function worldEye(rig, pose) {
  return new THREE.Vector3(pose.transform.position.x, pose.transform.position.y, pose.transform.position.z).applyQuaternion(rig.quaternion).add(rig.position);
}

function worldForward(rig, pose) {
  const q = pose.transform.orientation;
  return new THREE.Vector3(0, 0, -1).applyQuaternion(new THREE.Quaternion(q.x, q.y, q.z, q.w)).applyQuaternion(rig.quaternion);
}

test('a supported immersive session requests real immersive-vr, attaches once, and chooses floor tracking', async () => {
  const h = await harness();
  assert.equal(h.controller.supported, true);
  assert.equal(h.controller.active, false);
  assert.equal(await h.controller.enter(), true);
  assert.equal(h.xr.sessionRequests.length, 1);
  assert.equal(h.xr.sessionRequests[0].mode, 'immersive-vr');
  assert.ok(h.xr.sessionRequests[0].options.optionalFeatures.includes('local-floor'));
  assert.ok(h.xr.session.referenceRequests.includes('local-floor'));
  assert.equal(h.manager.referenceSpaceType, 'local-floor');
  assert.equal(h.manager.attachCalls, 1);
  assert.equal(h.controller.active, true);
  assert.equal(h.controller.state.active, true);
  assert.equal(h.before.length, 1);
  assert.equal(h.started.length, 1);
  assert.equal(h.before[0].floorReference, true);
  await h.controller.exit();
  assert.equal(h.controller.active, false);
  assert.equal(h.ended.length, 1);
  assert.equal(h.xr.session.endCalls, 1);
  await h.controller.dispose();
});

test('a local-only headset session falls back without requesting a second immersive session', async () => {
  const session = new MockSession({ floor: false });
  const h = await harness({ xr: new MockSystem({ session }) });
  assert.equal(await h.controller.enter(), true);
  assert.equal(h.manager.referenceSpaceType, 'local');
  assert.equal(h.before[0].floorReference, false);
  assert.equal(h.started[0].floorReference, false);
  assert.equal(h.xr.sessionRequests.length, 1);
  assert.equal(h.controller.active, true);
  await h.controller.dispose();
});

test('declined permission reports failure without applying immersive view changes', async () => {
  const error = Object.assign(new Error('User declined immersive permission'), { name: 'NotAllowedError' });
  const h = await harness({ xr: new MockSystem({ request: async () => { throw error; } }) });
  assert.equal(await h.controller.enter(), false);
  assert.equal(h.controller.active, false);
  assert.equal(h.controller.entering, false);
  assert.equal(h.manager.attachCalls, 0);
  assert.equal(h.before.length, 0);
  assert.equal(h.started.length, 0);
  assert.equal(h.ended.length, 0);
  assert.match(h.controller.state.message, /permission|declined|denied/i);
  await h.controller.dispose();
});

test('duplicate entry during a pending request does not create a second session', async () => {
  const pending = deferred(), session = new MockSession();
  const h = await harness({ xr: new MockSystem({ request: () => pending.promise }) });
  const first = h.controller.enter();
  assert.equal(h.controller.entering, true);
  assert.equal(await h.controller.enter(), false);
  assert.equal(h.xr.sessionRequests.length, 1);
  pending.resolve(session);
  assert.equal(await first, true);
  await h.controller.enter();
  assert.equal(h.xr.sessionRequests.length, 1);
  assert.equal(h.started.length, 1);
  assert.equal(h.controller.active, true);
  await h.controller.dispose();
});

test('headset devicechange rechecks support instead of leaving initial unavailable state stuck', async () => {
  const xr = new MockSystem({ supported: false });
  const h = await harness({ xr });
  assert.equal(h.controller.supported, false);
  const queries = xr.supportQueries.length;
  xr.supported = true;
  xr.dispatchEvent({ type: 'devicechange' });
  await flush();
  assert.ok(xr.supportQueries.length > queries);
  assert.equal(h.controller.supported, true);
  xr.supported = false;
  xr.dispatchEvent({ type: 'devicechange' });
  await flush();
  assert.equal(h.controller.supported, false);
  assert.equal(h.controller.active, false);
  await h.controller.dispose();
});

test('absent XR and insecure origins remain desktop-only and never request a headset session', async () => {
  const missing = await harness({ xr: null });
  assert.equal(missing.controller.supported, false);
  assert.equal(await missing.controller.enter(), false);
  assert.equal(missing.controller.active, false);
  assert.match(missing.controller.state.message, /headset|browser|WebXR/i);
  await missing.controller.dispose();
  const xr = new MockSystem(), insecure = await harness({ xr, secure: false });
  assert.equal(await insecure.controller.enter(), false);
  assert.equal(xr.sessionRequests.length, 0);
  assert.match(insecure.controller.state.message, /HTTPS|secure|localhost/i);
  await insecure.controller.dispose();
});

test('session exit restores the real desktop camera, orbit target and neutral viewer rig', async () => {
  const view = desktop(), initial = snapshotDesktopView(view.camera, view.controls);
  let saved;
  const h = await harness({ hooks: {
    before: () => {
      saved = snapshotDesktopView(view.camera, view.controls);
      view.camera.position.set(0, 0, 0); view.camera.quaternion.identity(); view.camera.scale.set(1, 1, 1);
      view.camera.fov = 70; view.camera.zoom = 1; view.controls.enabled = false;
      view.controls.target.set(9, 9, 9);
    },
    ended: () => restoreDesktopView(view.camera, view.controls, view.rig, saved),
  } });
  await h.controller.enter();
  recenterRig(view.rig, viewerPose({ x: 0.6, y: 1.7, z: -0.4 }, { yaw: Math.PI / 2 }));
  await h.xr.session.end(); // A headset/browser initiated exit, not just our button.
  assert.equal(h.ended.length, 1);
  assert.equal(h.controller.active, false);
  vectorNear(view.camera.position, initial.position);
  near(Math.abs(view.camera.quaternion.dot(initial.quaternion)), 1);
  vectorNear(view.camera.scale, initial.scale);
  vectorNear(view.controls.target, initial.target);
  for (const field of ['fov', 'aspect', 'near', 'far', 'zoom']) near(view.camera[field], initial[field]);
  assert.equal(view.controls.enabled, true);
  assert.ok(view.controls.updates > 0);
  vectorNear(view.rig.position, new THREE.Vector3());
  near(Math.abs(view.rig.quaternion.w), 1);
  await h.controller.dispose();
  assert.equal(h.ended.length, 1);
});

test('failed renderer attachment ends the session and restores the desktop exactly once', async () => {
  const view = desktop(), initial = snapshotDesktopView(view.camera, view.controls);
  const h = await harness({ manager: new MockManager({ attachError: new Error('Renderer attachment failed') }), hooks: {
    before: () => { view.camera.position.set(0, 0, 0); view.controls.enabled = false; },
    ended: () => restoreDesktopView(view.camera, view.controls, view.rig, initial),
  } });
  assert.equal(await h.controller.enter(), false);
  assert.equal(h.before.length, 1);
  assert.equal(h.started.length, 0);
  assert.equal(h.ended.length, 1);
  assert.equal(h.ended[0].reason, 'error');
  assert.equal(h.xr.session.endCalls, 1);
  assert.equal(h.controller.active, false);
  assert.equal(h.controller.entering, false);
  vectorNear(view.camera.position, initial.position);
  assert.equal(view.controls.enabled, true);
  await h.controller.dispose();
});

test('initial floor-relative placement cancels headset yaw and centers the viewer without changing eye height', () => {
  const rig = new THREE.Group(), pose = viewerPose({ x: 0.45, y: 1.72, z: -0.65 }, { yaw: Math.PI / 2 });
  assert.equal(recenterRig(rig, pose, { floorReference: true }), true);
  vectorNear(worldEye(rig, pose), new THREE.Vector3(0, 1.72, 0));
  vectorNear(worldForward(rig, pose), new THREE.Vector3(0, 0, -1));
  vectorNear(new THREE.Vector3(0, 1, 0).applyQuaternion(rig.quaternion), new THREE.Vector3(0, 1, 0));
});

test('local-reference placement supplies seated eye height without losing horizontal centering or heading', () => {
  const rig = new THREE.Group(), pose = viewerPose({ x: -0.6, y: 0.12, z: 0.35 }, { yaw: -0.9 });
  assert.equal(recenterRig(rig, pose, { floorReference: false, eyeHeight: 1.6 }), true);
  vectorNear(worldEye(rig, pose), new THREE.Vector3(0, 1.6, 0));
  vectorNear(worldForward(rig, pose), new THREE.Vector3(0, 0, -1));
});

test('recenter uses the new pose rather than accumulating offsets, and preserves head pitch instead of tilting the room', () => {
  const rig = new THREE.Group();
  recenterRig(rig, viewerPose({ x: 2, y: 1.8, z: -1 }, { yaw: 2.1 }));
  const next = viewerPose({ x: -0.35, y: 1.65, z: 0.8 }, { yaw: -1.2, pitch: -0.3, roll: 0.1 });
  assert.equal(recenterRig(rig, next), true);
  vectorNear(worldEye(rig, next), new THREE.Vector3(0, 1.65, 0));
  const forward = worldForward(rig, next);
  near(forward.x, 0);
  assert.ok(forward.z < 0);
  assert.ok(Math.abs(forward.y) > 0.1, 'Head pitch remains the user’s head movement.');
  vectorNear(new THREE.Vector3(0, 1, 0).applyQuaternion(rig.quaternion), new THREE.Vector3(0, 1, 0));
  const position = rig.position.clone(), orientation = rig.quaternion.clone();
  recenterRig(rig, next);
  vectorNear(rig.position, position);
  near(Math.abs(rig.quaternion.dot(orientation)), 1);
});

test('no viewer pose leaves the scene unchanged while waiting for headset tracking', () => {
  const rig = new THREE.Group();
  rig.position.set(1, 2, 3);
  rig.quaternion.setFromEuler(new THREE.Euler(0, 0.7, 0));
  const before = { position: rig.position.clone(), quaternion: rig.quaternion.clone() };
  assert.equal(recenterRig(rig, null), false);
  vectorNear(rig.position, before.position);
  near(Math.abs(rig.quaternion.dot(before.quaternion)), 1);
});

test('disposal ends the active session and removes devicechange support monitoring', async () => {
  const h = await harness();
  await h.controller.enter();
  await h.controller.dispose();
  await flush();
  assert.equal(h.controller.active, false);
  assert.equal(h.xr.session.ended, true);
  assert.equal(h.ended.length, 1);
  const queries = h.xr.supportQueries.length;
  h.xr.dispatchEvent({ type: 'devicechange' });
  await flush();
  assert.equal(h.xr.supportQueries.length, queries);
  assert.equal(await h.controller.enter(), false);
});
