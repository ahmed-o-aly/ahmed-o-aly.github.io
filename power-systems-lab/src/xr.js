import * as THREE from "three";
import { ViewGesture, ComfortNavigation } from "./navigation.js";
import { createVRPanel } from "./vr-panel.js";

/** Controller navigation, manipulation and panel input remain separate channels. */
export function createXR({ renderer, scene, camera, controls, getModel, getState, onChange, onAction, onStatus, onSession }) {
  const rig = new THREE.Group();
  rig.name = "Viewer navigation rig";
  scene.add(rig);
  rig.add(camera);
  const navigation = new ComfortNavigation(),
    raycaster = new THREE.Raycaster(),
    states = [],
    headPosition = new THREE.Vector3(),
    headDirection = new THREE.Vector3();
  const panel = createVRPanel({
    getState,
    onChange,
    onAction: (action) => {
      if (action !== "close-panel") onAction(action);
    },
  });
  scene.add(panel.group);
  const hintCanvas = document.createElement("canvas");
  hintCanvas.width = 900;
  hintCanvas.height = 170;
  const hintContext = hintCanvas.getContext("2d");
  hintContext.fillStyle = "#f7f4ed";
  hintContext.fillRect(0, 0, 900, 170);
  hintContext.fillStyle = "#282b27";
  hintContext.font = "32px Arial";
  hintContext.textAlign = "center";
  hintContext.fillText("Left stick: move · Right stick: turn", 450, 64);
  hintContext.fillText("Grips: hold / scale · X: panel · Y: reset", 450, 120);
  const hintTexture = new THREE.CanvasTexture(hintCanvas);
  hintTexture.colorSpace = THREE.SRGBColorSpace;
  const hint = new THREE.Mesh(
    new THREE.PlaneGeometry(0.85, 0.16),
    new THREE.MeshBasicMaterial({ map: hintTexture, depthTest: false, depthWrite: false, toneMapped: false })
  );
  hint.renderOrder = 99;
  hint.visible = false;
  scene.add(hint);
  let active = false,
    session = null,
    gesture = null,
    saved = null,
    recenterPending = false,
    qaRestore = null,
    introTime = 0;
  function stateFor(index) {
    const controller = renderer.xr.getController(index),
      grip = renderer.xr.getControllerGrip(index);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -1)]),
      new THREE.LineBasicMaterial({ color: 0x9b5036, transparent: true, opacity: 0.65 })
    );
    line.scale.z = 3;
    controller.add(line);
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.023, 0.09, 8),
      new THREE.MeshStandardMaterial({ color: 0x565a56, roughness: 0.55 })
    );
    body.rotation.x = Math.PI / 2;
    grip.add(body);
    rig.add(controller, grip);
    const state = { id: index, controller, grip, line, source: null, armed: false, last: [], tracked: false };
    controller.addEventListener("connected", (event) => {
      state.source = event.data;
      state.armed = false;
      state.last = [];
    });
    controller.addEventListener("disconnected", () => {
      cancel(state);
      state.source = null;
      navigation.reset();
    });
    controller.addEventListener("selectstart", () => {
      if (!active || !state.armed || !state.tracked || session?.visibilityState !== "visible") return;
      const hit = panel.intersect(controller);
      if (panel.pointerDown(index, hit)) return;
      const modelHit = pick(controller);
      if (modelHit) onChange("equipment", modelHit.group.id);
    });
    controller.addEventListener("selectend", () => panel.pointerUp(index));
    controller.addEventListener("squeezestart", () => {
      if (!active || !state.armed || !state.tracked || session?.visibilityState !== "visible") return;
      if (panel.intersect(controller)) return;
      if (!gesture.hands.size && !pick(controller)) return;
      grip.updateWorldMatrix(true, false);
      gesture.begin(index, grip.matrixWorld);
    });
    controller.addEventListener("squeezeend", () => gesture?.end(index));
    return state;
  }
  states.push(stateFor(0), stateFor(1));
  function cancel(state) {
    gesture?.end(state.id);
    panel.cancelPointer(state.id);
    state.armed = false;
    state.tracked = false;
    state.last = [];
  }
  function pick(controller) {
    const model = getModel();
    if (!model) return null;
    controller.updateWorldMatrix(true, false);
    raycaster.set(
      controller.getWorldPosition(new THREE.Vector3()),
      new THREE.Vector3(0, 0, -1).applyQuaternion(controller.getWorldQuaternion(new THREE.Quaternion()))
    );
    return model.pick(raycaster);
  }
  function trackedCamera() {
    // WebXR's unparented ArrayCamera stores a rig-composed matrixWorld, but
    // getWorldPosition/getWorldDirection overwrite it with its local pose.
    // The user camera is updated by Three.js and keeps the navigation parent.
    rig.updateMatrixWorld(true);
    renderer.xr.updateCamera(camera);
    return camera;
  }
  function resetView(mode = "tabletop") {
    const model = getModel();
    if (!active || !model) return;
    gesture?.clear();
    const head = trackedCamera();
    head.getWorldPosition(headPosition);
    head.getWorldDirection(headDirection);
    headDirection.y = 0;
    if (headDirection.lengthSq() < 0.001) headDirection.set(0, 0, -1);
    headDirection.normalize();
    model.root.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(-headDirection.x, -headDirection.z));
    model.root.scale.setScalar(model.id === "substation" ? (mode === "room" ? 1.3 : 0.35) : mode === "room" ? 1.5 : 0.8);
    model.root.position.copy(headPosition).addScaledVector(headDirection, mode === "room" ? 3 : 2.2);
    model.root.position.y = mode === "room" ? 0 : Math.max(0.7, headPosition.y - 0.55);
    model.root.updateMatrixWorld(true);
  }
  function focus() {
    const model = getModel();
    if (!active || !model) return;
    gesture?.clear();
    model.isolate(true);
    let box = model.getBounds();
    const size = box.getSize(new THREE.Vector3()).length();
    if (!Number.isFinite(size) || size <= 0) return;
    const ratio = THREE.MathUtils.clamp(1.15 / size, 0.05, 50);
    model.root.scale.multiplyScalar(ratio);
    model.root.updateMatrixWorld(true);
    box = model.getBounds();
    const center = box.getCenter(new THREE.Vector3());
    const head = trackedCamera();
    head.getWorldPosition(headPosition);
    head.getWorldDirection(headDirection);
    const target = headPosition.clone().addScaledVector(headDirection, 1.35);
    target.y = Math.max(0.8, headPosition.y - 0.2);
    model.root.position.add(target.sub(center));
    model.root.updateMatrixWorld(true);
  }
  function cleanup() {
    if (!saved && !active) return;
    active = false;
    session = null;
    gesture?.clear();
    navigation.reset();
    panel.hide();
    hint.visible = false;
    for (const state of states) cancel(state);
    rig.position.set(0, 0, 0);
    rig.quaternion.identity();
    rig.updateMatrixWorld(true);
    if (saved) {
      camera.near = saved.near;
      camera.far = saved.far;
      camera.fov = saved.fov;
      camera.zoom = saved.zoom;
      camera.updateProjectionMatrix();
      camera.position.copy(saved.cameraPosition);
      camera.quaternion.copy(saved.cameraQuaternion);
      controls.target.copy(saved.target);
      const model = getModel();
      if (model) {
        model.root.position.copy(saved.position);
        model.root.quaternion.copy(saved.quaternion);
        model.root.scale.copy(saved.scale);
      }
      saved = null;
    }
    controls.enabled = true;
    controls.update();
    onSession(false);
    onStatus("Desktop view restored.");
  }
  renderer.xr.addEventListener("sessionend", cleanup);
  async function enter() {
    if (active) return;
    const model = getModel();
    if (!model) return;
    if (!isSecureContext) {
      onStatus("VR requires HTTPS, or localhost during development.");
      return;
    }
    if (!navigator.xr) {
      onStatus("Open this page in Meta Quest Browser to enter VR. You can explore it here with touch or a mouse.");
      return;
    }
    try {
      session = await navigator.xr.requestSession("immersive-vr", { requiredFeatures: ["local-floor"] });
      saved = {
        cameraPosition: camera.position.clone(),
        near: camera.near,
        far: camera.far,
        fov: camera.fov,
        zoom: camera.zoom,
        cameraQuaternion: camera.quaternion.clone(),
        target: controls.target.clone(),
        position: model.root.position.clone(),
        quaternion: model.root.quaternion.clone(),
        scale: model.root.scale.clone(),
      };
      controls.enabled = false;
      camera.near = 0.02;
      camera.far = 120;
      camera.updateProjectionMatrix();
      camera.position.set(0, 0, 0);
      camera.quaternion.identity();
      rig.position.set(0, 0, 0);
      rig.quaternion.identity();
      gesture = new ViewGesture(model.root, 0.02, 40);
      navigation.reset();
      panel.hide();
      for (const state of states) cancel(state);
      session.addEventListener("visibilitychange", () => {
        if (session?.visibilityState !== "visible") {
          navigation.reset();
          gesture.clear();
          panel.hide();
          states.forEach(cancel);
        }
      });
      renderer.xr.setReferenceSpaceType("local-floor");
      await renderer.xr.setSession(session);
      active = true;
      recenterPending = true;
      onSession(true);
      onStatus("X opens the panel · Y resets · grips hold and scale.");
    } catch (error) {
      const failedSession = session;
      cleanup();
      if (failedSession) await failedSession.end().catch(() => {});
      onStatus(`VR could not start: ${error.message}`);
    }
  }
  function update(dt, frame) {
    if (!active || !frame) return;
    const reference = renderer.xr.getReferenceSpace();
    const visible = session?.visibilityState === "visible";
    for (const state of states) {
      const source = state.source;
      let tracked = false;
      try {
        tracked = visible && Boolean(source && frame.getPose(source.gripSpace || source.targetRaySpace, reference));
      } catch {
        tracked = false;
      }
      if (!tracked) {
        if (state.tracked) cancel(state);
        state.tracked = false;
        state.controller.visible = state.grip.visible = false;
        continue;
      }
      state.tracked = true;
      state.controller.visible = state.grip.visible = true;
      const buttons = source.gamepad?.buttons || [],
        axes = source.gamepad?.axes || [];
      if (!state.armed && buttons.every((b) => !b.pressed) && axes.every((a) => Math.abs(a) < 0.2)) state.armed = true;
    }
    const left = states.find((s) => s.source?.handedness === "left" && s.tracked),
      right = states.find((s) => s.source?.handedness === "right" && s.tracked);
    const leftAxes = left?.source.gamepad?.axes || [],
      rightAxes = right?.source.gamepad?.axes || [];
    navigation.update(
      rig,
      trackedCamera(),
      left?.armed ? [leftAxes[2] || 0, leftAxes[3] || 0] : [0, 0],
      right?.armed ? rightAxes[2] || 0 : 0,
      dt,
      visible
    );
    // Refresh headset/controller transforms after navigation, before grip poses.
    rig.updateMatrixWorld(true);
    renderer.xr.updateCamera(camera);
    if (recenterPending) {
      resetView();
      const head = trackedCamera();
      head.getWorldPosition(headPosition);
      head.getWorldDirection(headDirection);
      headDirection.y = 0;
      headDirection.normalize();
      hint.position.copy(headPosition).addScaledVector(headDirection, 1.35);
      hint.position.y -= 0.2;
      hint.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(-headDirection.x, -headDirection.z));
      hint.visible = true;
      introTime = 9;
      recenterPending = false;
    }
    introTime -= dt;
    if (introTime <= 0 || panel.visible) hint.visible = false;
    for (const state of states) {
      if (!state.tracked) continue;
      const buttons = state.source.gamepad?.buttons || [];
      const edge = (i) => state.armed && Boolean(buttons[i]?.pressed) && !state.last[i];
      if ((state.source.handedness === "left" && edge(4)) || (state.source.handedness === "right" && edge(3))) panel.toggle(trackedCamera());
      if (state.source.handedness === "left" && edge(5)) onAction("recenter");
      state.last = buttons.map((b) => b.pressed);
      panel.pointerMove(state.id, panel.intersect(state.controller));
    }
    gesture.update(
      new Map(
        states
          .filter((s) => s.tracked)
          .map((s) => {
            s.grip.updateWorldMatrix(true, false);
            return [s.id, s.grip.matrixWorld];
          })
      )
    );
    panel.update();
  }
  const qa = import.meta.env.DEV
    ? {
        async start() {
          const fake = new EventTarget();
          fake.visibilityState = "visible";
          fake.end = async () => renderer.xr.dispatchEvent({ type: "sessionend" });
          const originalXR = navigator.xr,
            methods = {
              getCamera: renderer.xr.getCamera,
              getReferenceSpace: renderer.xr.getReferenceSpace,
              updateCamera: renderer.xr.updateCamera,
              setSession: renderer.xr.setSession,
            };
          const head = new THREE.ArrayCamera();
          head.position.set(0, 1.65, 0);
          head.updateMatrix();
          Object.defineProperty(navigator, "xr", { configurable: true, value: { requestSession: async () => fake } });
          renderer.xr.getCamera = () => head;
          renderer.xr.getReferenceSpace = () => ({});
          renderer.xr.updateCamera = () => {
            rig.updateMatrixWorld(true);
            head.matrixWorld.multiplyMatrices(rig.matrixWorld, head.matrix);
            camera.position.copy(head.position);
            camera.quaternion.copy(head.quaternion);
            camera.fov = 95;
            camera.zoom = 1;
            camera.updateMatrixWorld(true);
          };
          renderer.xr.setSession = async () => {};
          qaRestore = () => {
            Object.defineProperty(navigator, "xr", { configurable: true, value: originalXR });
            Object.assign(renderer.xr, methods);
            head.removeFromParent();
            qaRestore = null;
          };
          for (const [i, state] of states.entries()) {
            const source = {
              handedness: i ? "right" : "left",
              targetRaySpace: { id: i },
              gripSpace: { id: i },
              gamepad: { axes: [0, 0, 0, 0], buttons: Array.from({ length: 6 }, () => ({ pressed: false, value: 0 })) },
            };
            state.controller.dispatchEvent({ type: "connected", data: source });
            state.grip.position.set(i ? 0.2 : -0.2, 1.25, 0);
            state.controller.position.copy(state.grip.position);
          }
          await enter();
          this.step({ dt: 0 });
          return this.state();
        },
        step({ left = [0, 0], right = 0, buttons = {}, poses = {}, tracked = [true, true], dt = 0.016 } = {}) {
          for (const state of states) {
            const pose = poses[state.id];
            if (pose) {
              state.grip.position.fromArray(pose.position);
              if (pose.quaternion) state.grip.quaternion.fromArray(pose.quaternion);
            }
            state.controller.position.copy(state.grip.position);
            state.controller.quaternion.copy(state.grip.quaternion);
            state.controller.updateMatrix();
            state.grip.updateMatrix();
            const axes = state.source.gamepad.axes;
            axes[2] = state.id ? right : left[0];
            axes[3] = state.id ? 0 : left[1];
            for (let i = 0; i < 6; i++) state.source.gamepad.buttons[i].pressed = Boolean(buttons[`${state.id}:${i}`]);
          }
          const frame = { getPose: (space) => (tracked[space.id] ? {} : null) };
          update(0, frame);
          for (const state of states) {
            for (const [i, type] of [
              [0, "select"],
              [1, "squeeze"],
            ]) {
              const pressed = state.source.gamepad.buttons[i].pressed;
              if (pressed !== Boolean(state.qaButtons?.[i])) state.controller.dispatchEvent({ type: type + (pressed ? "start" : "end") });
            }
            state.qaButtons = state.source.gamepad.buttons.map((b) => b.pressed);
          }
          update(dt, frame);
          return this.state();
        },
        aim() {
          const model = getModel();
          model.root.updateWorldMatrix(true, true);
          const center = model.getBounds().getCenter(new THREE.Vector3());
          if (model.id === "substation") {
            const mesh = model.root.children[0],
              geometry = mesh.geometry,
              ids = geometry.getAttribute("_source_piece"),
              position = geometry.getAttribute("position"),
              index = geometry.index;
            for (let i = 0; i < index.count; i += 3) {
              if (ids.getX(index.array[i]) !== 3773) continue;
              const a = new THREE.Vector3().fromBufferAttribute(position, index.array[i]),
                b = new THREE.Vector3().fromBufferAttribute(position, index.array[i + 1]),
                c = new THREE.Vector3().fromBufferAttribute(position, index.array[i + 2]);
              if (b.clone().sub(a).cross(c.clone().sub(a)).lengthSq() < 1e-8) continue;
              center
                .copy(a)
                .add(b)
                .add(c)
                .multiplyScalar(1 / 3)
                .applyMatrix4(mesh.matrixWorld);
              break;
            }
          }
          for (const state of states) {
            state.controller.updateWorldMatrix(true, false);
            const origin = state.controller.getWorldPosition(new THREE.Vector3());
            const world = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(origin, center, new THREE.Vector3(0, 1, 0)));
            const parent = rig.getWorldQuaternion(new THREE.Quaternion()).invert();
            state.controller.quaternion.copy(parent.multiply(world));
            state.grip.quaternion.copy(state.controller.quaternion);
            state.controller.updateMatrix();
            state.grip.updateMatrix();
          }
        },
        state() {
          return {
            active,
            held: gesture?.hands.size || 0,
            rig: rig.position.toArray(),
            yaw: rig.quaternion.toArray(),
            head: camera.getWorldPosition(new THREE.Vector3()).toArray(),
            headDirection: camera.getWorldDirection(new THREE.Vector3()).toArray(),
            panelPosition: panel.group.position.toArray(),
            cameraFov: camera.fov,
            cameraZoom: camera.zoom,
            position: getModel().root.position.toArray(),
            scale: getModel().root.scale.x,
            panel: panel.visible,
            pointer: panel.interacting,
            armed: states.map((s) => s.armed),
            tracked: states.map((s) => s.tracked),
            visibility: session?.visibilityState,
            hits: states.map((s) => pick(s.controller)?.group.id),
            controller: states.map((s) => ({ p: s.controller.position.toArray(), q: s.controller.quaternion.toArray() })),
          };
        },
        visibility(value) {
          session.visibilityState = value;
          session.dispatchEvent(new Event("visibilitychange"));
        },
        stop() {
          cleanup();
          qaRestore?.();
        },
      }
    : null;
  return {
    enter,
    update,
    resetView,
    focus,
    panel,
    qa,
    get active() {
      return active;
    },
    get gesture() {
      return gesture;
    },
    get rig() {
      return rig;
    },
    async exit() {
      await session?.end();
    },
    dispose() {
      cleanup();
      panel.dispose();
      hint.geometry.dispose();
      hint.material.dispose();
      hintTexture.dispose();
      hint.removeFromParent();
      rig.removeFromParent();
    },
  };
}
