import * as THREE from 'three';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

/**
 * Install immersive VR. Append `button` yourself and call `update(deltaSeconds)`
 * from renderer.setAnimationLoop. Suspend desktop controls while `active`.
 * onStatus receives { kind, message }, where kind is checking, ready,
 * unavailable, entering, active, or error. No headset or permission is assumed.
 * Optional onAction receives 'toggle-playback' or 'next-state' for rising edges
 * of additional xr-standard buttons 4/5 (A/X and B/Y on Oculus Touch profiles).
 */
export function setupVR({ renderer, scene, camera, modelRoot, onStatus = () => {}, onAction = () => {} }) {
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local');

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'vr-button';
  button.textContent = 'Checking VR…';
  button.disabled = true;
  button.setAttribute('aria-label', 'Check immersive virtual reality availability');

  let supported = false;
  let session = null;
  let entering = false;
  let disposed = false;
  let floorSpace = false;
  let desktop = null;
  let gesture = null;
  let pendingRecenter = false;
  const baseScale = new THREE.Vector3(1, 1, 1);
  const baseQuaternion = new THREE.Quaternion();
  const matrix = new THREE.Matrix4();
  const parentInverse = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const midpoint = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const deltaRotation = new THREE.Quaternion();
  const listeners = [];
  const handFactory = new XRHandModelFactory();

  const environment = new THREE.Group();
  environment.name = 'VR floor';
  environment.visible = false;
  const grid = new THREE.GridHelper(12, 24, 0x344965, 0x253447);
  grid.material.transparent = true;
  grid.material.opacity = 0.25;
  grid.material.depthWrite = false;
  environment.add(grid);
  scene.add(environment);

  function listen(target, type, handler) {
    target.addEventListener(type, handler);
    listeners.push(() => target.removeEventListener(type, handler));
  }

  function status(kind, message) {
    button.dataset.state = kind;
    button.title = message;
    onStatus({ kind, message });
  }

  const inputs = [0, 1].map((index) => {
    const controller = renderer.xr.getController(index);
    const grip = renderer.xr.getControllerGrip(index);
    const hand = renderer.xr.getHand(index);
    const handModel = handFactory.createHandModel(hand, 'spheres');
    hand.add(handModel);
    scene.add(controller, grip, hand);

    const rayGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1),
    ]);
    const rayMaterial = new THREE.LineBasicMaterial({
      color: 0x91baf0, transparent: true, opacity: 0.5, depthWrite: false,
    });
    const ray = new THREE.Line(rayGeometry, rayMaterial);
    ray.scale.z = 2.3;
    controller.add(ray);
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.009, 10, 6),
      new THREE.MeshBasicMaterial({ color: 0xc5dcff }),
    );
    controller.add(marker);
    const input = {
      index, controller, grip, hand, handModel, ray, marker,
      source: null, select: false, squeeze: false, pinch: false,
      stickPressed: false, primaryPressed: false, secondaryPressed: false,
      pose: new THREE.Matrix4(),
      point: new THREE.Vector3(), tracked: false,
    };
    listen(controller, 'connected', (event) => {
      input.source = event.data;
      input.stickPressed = input.primaryPressed = input.secondaryPressed = false;
    });
    listen(controller, 'disconnected', () => {
      input.source = null;
      input.select = input.squeeze = input.pinch = false;
      input.stickPressed = input.primaryPressed = input.secondaryPressed = false;
      gesture = null;
    });
    listen(controller, 'selectstart', () => { input.select = true; });
    listen(controller, 'selectend', () => { input.select = false; });
    listen(controller, 'squeezestart', () => { input.squeeze = true; });
    listen(controller, 'squeezeend', () => { input.squeeze = false; });
    listen(hand, 'pinchstart', () => { input.pinch = true; });
    listen(hand, 'pinchend', () => { input.pinch = false; });
    return input;
  });

  function clearInteraction(resetSticks = true) {
    gesture = null;
    for (const input of inputs) {
      input.select = input.squeeze = input.pinch = false;
      if (resetSticks) input.stickPressed = input.primaryPressed = input.secondaryPressed = false;
    }
  }

  function applyWorldMatrix(worldMatrix) {
    if (modelRoot.parent) {
      modelRoot.parent.updateWorldMatrix(true, false);
      parentInverse.copy(modelRoot.parent.matrixWorld).invert();
      matrix.multiplyMatrices(parentInverse, worldMatrix);
    } else matrix.copy(worldMatrix);
    matrix.decompose(modelRoot.position, modelRoot.quaternion, modelRoot.scale);
    modelRoot.updateMatrix();
    modelRoot.updateWorldMatrix(false, true);
  }

  function placeModel(inFrontOfViewer = false) {
    position.set(0, floorSpace ? 1.4 : -0.15, -2.3);
    if (inFrontOfViewer) {
      const xrCamera = renderer.xr.getCamera();
      xrCamera.updateWorldMatrix(true, false);
      xrCamera.getWorldPosition(position);
      xrCamera.getWorldDirection(forward);
      forward.y = 0;
      if (forward.lengthSq() < 0.001) forward.set(0, 0, -1);
      position.addScaledVector(forward.normalize(), 2.3);
      position.y = xrCamera.getWorldPosition(forward).y - 0.2;
    }
    const worldMatrix = new THREE.Matrix4().compose(position, baseQuaternion, baseScale);
    applyWorldMatrix(worldMatrix);
    // Preserve button edge state: two held stick buttons must not recenter forever.
    clearInteraction(false);
  }

  function saveDesktop() {
    modelRoot.updateWorldMatrix(true, false);
    modelRoot.matrixWorld.decompose(position, baseQuaternion, baseScale);
    desktop = {
      modelPosition: modelRoot.position.clone(),
      modelQuaternion: modelRoot.quaternion.clone(),
      modelScale: modelRoot.scale.clone(),
      cameraPosition: camera.position.clone(),
      cameraQuaternion: camera.quaternion.clone(),
      cameraScale: camera.scale.clone(),
      near: camera.near, far: camera.far, fov: camera.fov, aspect: camera.aspect, zoom: camera.zoom,
    };
  }

  function restoreDesktop() {
    if (!desktop) return;
    modelRoot.position.copy(desktop.modelPosition);
    modelRoot.quaternion.copy(desktop.modelQuaternion);
    modelRoot.scale.copy(desktop.modelScale);
    modelRoot.updateMatrix();
    camera.position.copy(desktop.cameraPosition);
    camera.quaternion.copy(desktop.cameraQuaternion);
    camera.scale.copy(desktop.cameraScale);
    Object.assign(camera, { near: desktop.near, far: desktop.far, fov: desktop.fov, aspect: desktop.aspect, zoom: desktop.zoom });
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
    desktop = null;
  }

  function ended() {
    session = null;
    entering = false;
    pendingRecenter = false;
    environment.visible = false;
    clearInteraction();
    restoreDesktop();
    document.body.classList.remove('is-vr');
    button.textContent = 'Enter VR';
    button.disabled = !supported;
    button.setAttribute('aria-label', 'Enter immersive virtual reality');
    status('ready', 'VR ready. Open this page in a compatible headset browser and select Enter VR.');
  }

  // The renderer resets its own XR state before this callback restores the camera.
  listen(renderer.xr, 'sessionend', ended);

  async function checkSupport() {
    if (disposed || session || entering) return;
    supported = false;
    if (!window.isSecureContext) {
      button.textContent = 'VR requires HTTPS';
      button.disabled = true;
      status('unavailable', 'Open this viewer over HTTPS in the headset browser. A plain HTTP address on your local network cannot start WebXR.');
      return;
    }
    if (!navigator.xr) {
      button.textContent = 'Open in a VR headset';
      button.disabled = true;
      status('unavailable', 'This browser does not expose WebXR. Use a compatible headset browser or a desktop browser connected to a VR headset.');
      return;
    }
    try {
      supported = await navigator.xr.isSessionSupported('immersive-vr');
      if (disposed || session || entering) return;
      button.disabled = !supported;
      button.textContent = supported ? 'Enter VR' : 'Open in a VR headset';
      button.setAttribute('aria-label', supported ? 'Enter immersive virtual reality' : 'Virtual reality headset unavailable');
      status(supported ? 'ready' : 'unavailable', supported
        ? 'VR ready. Trigger or pinch to move; use both hands to rotate and resize.'
        : 'No immersive VR device is available in this browser. Open this same HTTPS page in a compatible headset browser.');
    } catch (error) {
      button.disabled = true;
      button.textContent = 'VR unavailable';
      status('unavailable', `VR availability could not be checked: ${error.message || error.name}.`);
    }
  }

  async function toggleSession() {
    if (session) {
      try { await session.end(); } catch (error) {
        status('error', `Could not exit VR: ${error.message || error.name}. Use the headset system menu to exit.`);
      }
      return;
    }
    if (!supported || entering || disposed) return;
    entering = true;
    button.disabled = true;
    button.textContent = 'Opening VR…';
    status('entering', 'Accept the headset’s VR request to begin.');
    let requestedSession;
    try {
      // Must run directly from this click handler to retain user activation.
      requestedSession = await navigator.xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'],
      });
      session = requestedSession;
      floorSpace = false;
      try {
        await requestedSession.requestReferenceSpace('local-floor');
        floorSpace = true;
      } catch { /* 'local' is the baseline reference space for immersive VR. */ }
      renderer.xr.setReferenceSpaceType(floorSpace ? 'local-floor' : 'local');
      saveDesktop();
      await renderer.xr.setSession(requestedSession);
      if (disposed || session !== requestedSession) {
        await requestedSession.end().catch(() => {});
        return;
      }
      entering = false;
      environment.visible = floorSpace;
      placeModel();
      pendingRecenter = true;
      document.body.classList.add('is-vr');
      button.textContent = 'Exit VR';
      button.disabled = false;
      button.setAttribute('aria-label', 'Exit immersive virtual reality');
      status('active', 'Trigger, grip, or pinch: grab. Both hands: rotate and resize. Thumbstick up/down: scale. Click a thumbstick: recenter.');
    } catch (error) {
      if (requestedSession) await requestedSession.end().catch(() => {});
      session = null;
      entering = false;
      restoreDesktop();
      button.disabled = !supported;
      button.textContent = 'Try VR again';
      status('error', `VR could not start: ${error.message || error.name}. Check headset connection and browser permissions, then try again.`);
    }
  }

  function readPose(input) {
    let trackedObject = input.grip.visible ? input.grip : input.controller;
    const wrist = input.hand.joints?.wrist;
    if (input.source?.hand && input.hand.visible && wrist?.visible) trackedObject = wrist;
    input.tracked = Boolean(input.source && trackedObject.visible);
    if (!input.tracked) {
      input.select = input.squeeze = input.pinch = false;
      return;
    }
    trackedObject.updateWorldMatrix(true, false);
    input.pose.copy(trackedObject.matrixWorld);
    input.point.setFromMatrixPosition(input.pose);
    input.ray.material.opacity = input.select || input.squeeze || input.pinch ? 0.9 : 0.35;
    input.ray.material.color.set(input.select || input.squeeze || input.pinch ? 0xc8dfff : 0x7098cc);
  }

  function captureGesture(activeInputs, key) {
    modelRoot.updateWorldMatrix(true, false);
    if (activeInputs.length === 1) {
      gesture = {
        key,
        offset: new THREE.Matrix4().copy(activeInputs[0].pose).invert().multiply(modelRoot.matrixWorld),
      };
      return;
    }
    const [a, b] = activeInputs;
    const startPosition = new THREE.Vector3();
    const startQuaternion = new THREE.Quaternion();
    const startScale = new THREE.Vector3();
    modelRoot.matrixWorld.decompose(startPosition, startQuaternion, startScale);
    gesture = {
      key, startPosition, startQuaternion, startScale,
      midpoint: a.point.clone().add(b.point).multiplyScalar(0.5),
      direction: b.point.clone().sub(a.point).normalize(),
      distance: Math.max(0.05, a.point.distanceTo(b.point)),
    };
  }

  function update(delta = 1 / 60) {
    if (!session || entering || !renderer.xr.isPresenting || disposed) return;
    if (pendingRecenter) {
      pendingRecenter = false;
      placeModel(true);
    }
    const dt = Math.min(Math.max(Number.isFinite(delta) ? delta : 1 / 60, 0), 0.05);
    for (const input of inputs) readPose(input);
    const activeInputs = inputs.filter((input) => input.tracked && (input.select || input.squeeze || input.pinch));
    // Closely overlapping hands should not generate unstable scale/rotation.
    if (activeInputs.length === 2 && activeInputs[0].point.distanceTo(activeInputs[1].point) < 0.05) activeInputs.pop();
    const key = activeInputs.map((input) => input.index).join(',');
    if (activeInputs.length) {
      if (!gesture || gesture.key !== key) captureGesture(activeInputs, key);
      if (activeInputs.length === 1) {
        const next = new THREE.Matrix4().multiplyMatrices(activeInputs[0].pose, gesture.offset);
        applyWorldMatrix(next);
      } else {
        const [a, b] = activeInputs;
        midpoint.copy(a.point).add(b.point).multiplyScalar(0.5);
        direction.copy(b.point).sub(a.point).normalize();
        deltaRotation.setFromUnitVectors(gesture.direction, direction);
        const startRelativeScale = gesture.startScale.x / baseScale.x;
        const relativeScale = THREE.MathUtils.clamp(startRelativeScale * a.point.distanceTo(b.point) / gesture.distance, 0.15, 4);
        const ratio = relativeScale / startRelativeScale;
        position.copy(gesture.startPosition).sub(gesture.midpoint).applyQuaternion(deltaRotation).multiplyScalar(ratio).add(midpoint);
        quaternion.copy(deltaRotation).multiply(gesture.startQuaternion);
        scale.copy(gesture.startScale).multiplyScalar(ratio);
        applyWorldMatrix(new THREE.Matrix4().compose(position, quaternion, scale));
      }
    } else gesture = null;

    for (const input of inputs) {
      const gamepad = input.source?.gamepad;
      if (!gamepad || gamepad.mapping !== 'xr-standard') {
        input.primaryPressed = input.secondaryPressed = false;
        continue;
      }
      // Only 0–3 are standardized. These optional extra-button bindings match
      // A/X and B/Y on Touch controllers; their labels vary on other hardware.
      const primaryPressed = Boolean(gamepad.buttons[4]?.pressed);
      const secondaryPressed = Boolean(gamepad.buttons[5]?.pressed);
      const primaryStarted = primaryPressed && !input.primaryPressed;
      const secondaryStarted = secondaryPressed && !input.secondaryPressed;
      input.primaryPressed = primaryPressed;
      input.secondaryPressed = secondaryPressed;
      if (input.tracked && primaryStarted) onAction('toggle-playback');
      if (input.tracked && secondaryStarted) onAction('next-state');
      const stickPressed = Boolean(gamepad.buttons[3]?.pressed);
      if (stickPressed && !input.stickPressed) placeModel(true);
      input.stickPressed = stickPressed;
      if (activeInputs.length || !input.tracked) continue;
      const axis = gamepad.axes.length >= 4 ? gamepad.axes[3] : gamepad.axes[1];
      if (!Number.isFinite(axis) || Math.abs(axis) < 0.15) continue;
      modelRoot.updateWorldMatrix(true, false);
      modelRoot.matrixWorld.decompose(position, quaternion, scale);
      const nextRelativeScale = THREE.MathUtils.clamp(scale.x / baseScale.x * Math.exp(-axis * dt * 1.3), 0.15, 4);
      scale.copy(baseScale).multiplyScalar(nextRelativeScale);
      applyWorldMatrix(new THREE.Matrix4().compose(position, quaternion, scale));
    }
  }

  listen(button, 'click', toggleSession);
  if (navigator.xr) listen(navigator.xr, 'devicechange', checkSupport);
  listen(document, 'visibilitychange', () => {
    if (document.visibilityState === 'visible') checkSupport();
  });
  checkSupport();

  return {
    button,
    update,
    reset() { if (session && !entering) placeModel(true); },
    refreshSupport: checkSupport,
    get active() { return Boolean(session); },
    get supported() { return supported; },
    async dispose() {
      disposed = true;
      if (session) await session.end().catch(() => {});
      restoreDesktop();
      for (const removeListener of listeners) removeListener();
      for (const input of inputs) {
        input.controller.remove(input.ray, input.marker);
        input.hand.remove(input.handModel);
        scene.remove(input.controller, input.grip, input.hand);
        for (const object of [input.ray, input.marker]) {
          object.geometry.dispose();
          object.material.dispose();
        }
        input.handModel.traverse((object) => {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material?.dispose();
        });
      }
      scene.remove(environment);
      grid.geometry.dispose();
      grid.material.dispose();
      button.remove();
      document.body.classList.remove('is-vr');
    },
  };
}
