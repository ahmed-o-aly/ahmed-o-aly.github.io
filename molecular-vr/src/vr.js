import * as THREE from 'three';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

/**
 * Install immersive VR. Append `button` yourself and call `update(deltaSeconds)`
 * from renderer.setAnimationLoop. Suspend desktop controls while `active`.
 * onStatus receives { kind, message }, where kind is checking, ready,
 * unavailable, entering, active, or error. No headset or permission is assumed.
 * Optional panel supplies a world-space settings surface. Grips always manipulate
 * the model; trigger presses belong to either the panel or model until release.
 * Left stick moves the viewer. Right stick click / X summons the panel.
 */
export function setupVR({ renderer, scene, camera, modelRoot, panel = null, onStatus = () => {}, onAction = () => {} }) {
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
  let pendingPanel = false;
  let movementArmed = false;
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
  const rig = new THREE.Group();
  rig.name = 'VR viewer locomotion';
  scene.add(rig);
  if (panel) scene.add(panel.group);
  const walkForward = new THREE.Vector3(0, 0, -1);
  const walkRight = new THREE.Vector3();

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
    rig.add(controller, grip, hand);

    const rayGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1),
    ]);
    const rayMaterial = new THREE.LineBasicMaterial({
      color: 0x91baf0, transparent: true, opacity: 0.5, depthWrite: false, depthTest: false,
    });
    const ray = new THREE.Line(rayGeometry, rayMaterial);
    ray.renderOrder = 110;
    ray.scale.z = 2.3;
    controller.add(ray);
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.009, 10, 6),
      new THREE.MeshBasicMaterial({ color: 0xc5dcff }),
    );
    controller.add(marker);
    const cursor = new THREE.Mesh(new THREE.SphereGeometry(0.005, 10, 6), new THREE.MeshBasicMaterial({ color: 0x174789, depthTest: false, depthWrite: false }));
    cursor.renderOrder = 111;
    cursor.visible = false;
    controller.add(cursor);
    const input = {
      index, controller, grip, hand, handModel, ray, marker, cursor,
      source: null, select: false, squeeze: false, pinch: false,
      selectOwner: null,
      stickPressed: false, primaryPressed: false, secondaryPressed: false,
      pose: new THREE.Matrix4(),
      point: new THREE.Vector3(), tracked: false,
    };
    listen(controller, 'connected', (event) => {
      input.source = event.data;
      input.stickPressed = input.primaryPressed = input.secondaryPressed = false;
    });
    listen(controller, 'disconnected', () => {
      panel?.cancelPointer(input.index);
      input.source = null;
      input.select = input.squeeze = input.pinch = false;
      input.selectOwner = null;
      input.cursor.visible = false;
      input.stickPressed = input.primaryPressed = input.secondaryPressed = false;
      gesture = null;
    });
    listen(controller, 'selectstart', () => beginSelect(input, 'select'));
    listen(controller, 'selectend', () => endSelect(input, 'select'));
    listen(controller, 'squeezestart', () => { if (canInteract()) input.squeeze = true; });
    listen(controller, 'squeezeend', () => { input.squeeze = false; });
    listen(hand, 'pinchstart', () => beginSelect(input, 'pinch'));
    listen(hand, 'pinchend', () => endSelect(input, 'pinch'));
    return input;
  });

  function canInteract() {
    return session && !entering && !disposed && (!session.visibilityState || session.visibilityState === 'visible');
  }

  function beginSelect(input, type) {
    if (!canInteract() || !input.source) return;
    input[type] = true;
    if (input.selectOwner) return;
    rig.updateMatrixWorld(true);
    const hit = !input.source.hand && input.controller.visible && panel?.visible ? panel.intersect(input.controller) : null;
    input.selectOwner = hit ? 'panel' : 'model';
    if (hit) {
      gesture = null;
      // Even a disabled row or a second pointer hitting the panel is consumed.
      panel.pointerDown(input.index, hit);
    }
  }

  function endSelect(input, type) {
    input[type] = false;
    if (input.select || input.pinch) return;
    if (input.selectOwner === 'panel') panel?.pointerUp(input.index);
    input.selectOwner = null;
  }

  function clearInteraction(resetSticks = true) {
    gesture = null;
    for (const input of inputs) {
      panel?.cancelPointer(input.index);
      input.select = input.squeeze = input.pinch = false;
      input.selectOwner = null;
      input.cursor.visible = false;
      if (resetSticks) {
        const buttons = resetSticks === 'held' ? input.source?.gamepad?.buttons : null;
        input.stickPressed = Boolean(buttons?.[3]?.pressed);
        input.primaryPressed = Boolean(buttons?.[4]?.pressed);
        input.secondaryPressed = Boolean(buttons?.[5]?.pressed);
      }
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
      camera.updateWorldMatrix(true, false);
      camera.getWorldPosition(position);
      camera.getWorldDirection(forward);
      forward.y = 0;
      if (forward.lengthSq() < 0.001) forward.set(0, 0, -1);
      position.addScaledVector(forward.normalize(), 2.3);
      position.y = camera.getWorldPosition(forward).y - 0.2;
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
      cameraParent: camera.parent,
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
    if (desktop.cameraParent) desktop.cameraParent.add(camera);
    else camera.removeFromParent();
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
    pendingPanel = false;
    movementArmed = false;
    panel?.hide();
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
        ? 'VR ready. Grips hold and scale the model. Left stick moves you; X or right-stick click opens controls.'
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
      rig.position.set(0, 0, 0);
      rig.quaternion.identity();
      rig.scale.setScalar(1);
      rig.add(camera);
      camera.position.set(0, 0, 0);
      camera.quaternion.identity();
      camera.scale.setScalar(1);
      rig.updateMatrixWorld(true);
      movementArmed = false;
      const visibilityChanged = () => {
        clearInteraction('held');
        movementArmed = false;
        if (requestedSession.visibilityState !== 'visible') {
          panel?.hide();
          pendingPanel = false;
        }
      };
      requestedSession.addEventListener('visibilitychange', visibilityChanged);
      requestedSession.addEventListener('end', () => requestedSession.removeEventListener('visibilitychange', visibilityChanged), { once: true });
      await renderer.xr.setSession(requestedSession);
      if (disposed || session !== requestedSession) {
        await requestedSession.end().catch(() => {});
        return;
      }
      entering = false;
      environment.visible = floorSpace;
      placeModel();
      pendingRecenter = true;
      pendingPanel = true;
      document.body.classList.add('is-vr');
      button.textContent = 'Exit VR';
      button.disabled = false;
      button.setAttribute('aria-label', 'Exit immersive virtual reality');
      status('active', 'Grips: hold, turn, and scale. Left stick: move yourself. X or right-stick click: controls. Point and trigger to adjust. A: play/pause; B: next; Y: recenter (Touch controllers).');
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
      panel?.cancelPointer(input.index);
      input.select = input.squeeze = input.pinch = false;
      input.selectOwner = null;
      input.cursor.visible = false;
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
    if (!canInteract()) {
      clearInteraction('held');
      movementArmed = false;
      panel?.hide();
      return;
    }
    rig.updateMatrixWorld(true);
    // WebXR poses are in reference-space coordinates; update their parent rig
    // before using the app camera for world-space panel placement and walking.
    renderer.xr.updateCamera(camera);
    if (pendingRecenter) {
      pendingRecenter = false;
      placeModel(true);
    }
    if (pendingPanel && inputs.some((input) => input.source?.gamepad && !input.source.hand)) {
      pendingPanel = false;
      panel?.show(camera);
    }
    const dt = Math.min(Math.max(Number.isFinite(delta) ? delta : 1 / 60, 0), 0.05);
    for (const input of inputs) readPose(input);
    for (const input of inputs) {
      const gamepad = input.source?.gamepad;
      if (!gamepad || gamepad.mapping !== 'xr-standard') {
        input.stickPressed = input.primaryPressed = input.secondaryPressed = false;
        continue;
      }
      const primaryPressed = Boolean(gamepad.buttons[4]?.pressed);
      const secondaryPressed = Boolean(gamepad.buttons[5]?.pressed);
      const stickPressed = Boolean(gamepad.buttons[3]?.pressed);
      const primaryStarted = primaryPressed && !input.primaryPressed;
      const secondaryStarted = secondaryPressed && !input.secondaryPressed;
      const stickStarted = stickPressed && !input.stickPressed;
      input.primaryPressed = primaryPressed;
      input.secondaryPressed = secondaryPressed;
      input.stickPressed = stickPressed;
      if (!input.tracked) continue;
      const handedness = input.source.handedness;
      // A/B/X/Y are optional Touch-style buttons, never assumed on all devices.
      if (handedness === 'left') {
        if (primaryStarted) panel?.toggle(camera);
        if (secondaryStarted) placeModel(true);
      } else if (handedness === 'right') {
        if (primaryStarted) onAction('toggle-playback');
        if (secondaryStarted) onAction('next-state');
      }
      if (stickStarted && handedness !== 'left') panel?.toggle(camera);
    }

    panel?.update();
    const uiActive = inputs.some((input) => input.selectOwner === 'panel' && (input.select || input.pinch));
    for (const input of inputs) {
      if (!input.tracked) continue;
      const hit = !input.source.hand && input.controller.visible && panel?.visible ? panel.intersect(input.controller) : null;
      if (input.selectOwner === 'panel') panel?.pointerMove(input.index, hit);
      input.ray.scale.z = hit ? hit.distance : 2.3;
      input.cursor.visible = Boolean(hit);
      if (hit) input.cursor.position.set(0, 0, -hit.distance);
      if (hit) input.ray.material.color.set(0x315f96);
    }

    const walker = inputs.find((input) => input.tracked && input.source?.handedness === 'left' && input.source.gamepad?.mapping === 'xr-standard');
    const axes = walker?.source.gamepad.axes;
    // xr-standard reserves axes 2/3 for a thumbstick; do not treat touchpad axes
    // or unknown mappings as movement. Neither stick ever changes model scale.
    if (axes?.length >= 4 && Number.isFinite(axes[2]) && Number.isFinite(axes[3])) {
      const x = THREE.MathUtils.clamp(axes[2], -1, 1);
      const y = THREE.MathUtils.clamp(axes[3], -1, 1);
      const magnitude = Math.hypot(x, y);
      if (magnitude < 0.18) movementArmed = true;
      if (movementArmed && !uiActive && !panel?.interacting && magnitude >= 0.18) {
        camera.getWorldDirection(forward);
        forward.y = 0;
        if (forward.lengthSq() > 0.001) walkForward.copy(forward).normalize();
        walkRight.set(-walkForward.z, 0, walkForward.x);
        const speed = 0.65 * (Math.min(magnitude, 1) - 0.18) / 0.82;
        rig.position.addScaledVector(walkRight, x / magnitude * speed * dt);
        rig.position.addScaledVector(walkForward, -y / magnitude * speed * dt);
        rig.updateMatrixWorld(true);
        renderer.xr.updateCamera(camera);
        for (const input of inputs) readPose(input);
      }
    } else movementArmed = false;

    const activeInputs = uiActive ? [] : inputs.filter((input) => input.tracked && (input.squeeze || input.selectOwner === 'model' && (input.select || input.pinch)));
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
        input.controller.remove(input.ray, input.marker, input.cursor);
        input.hand.remove(input.handModel);
        rig.remove(input.controller, input.grip, input.hand);
        for (const object of [input.ray, input.marker, input.cursor]) {
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
      scene.remove(rig);
      if (panel) { scene.remove(panel.group); panel.dispose(); }
      grid.geometry.dispose();
      grid.material.dispose();
      button.remove();
      document.body.classList.remove('is-vr');
    },
  };
}
