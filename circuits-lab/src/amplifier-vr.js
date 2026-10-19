import * as THREE from "three";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";

/**
 * Room-scale WebXR for the amplifier bench.
 *
 * Controllers do not get their own interaction model. Each one produces a world
 * ray and feeds the scene's existing pointer handlers, so a terminal, plug, cable,
 * probe or dial behaves in the headset exactly as it does under the mouse, and
 * there is one set of rules to keep correct.
 */

const TURN_STEP = Math.PI / 6;
const MOVE_SPEED = 1.5;
const DEAD_ZONE = 0.22;
/** Synthetic pointer ids, kept clear of real browser pointer ids. */
const XR_POINTER_ID = [9001, 9002];

/** Scene-graph ray in world space, independent of the desktop camera. */
function controllerRay(controller, target) {
  controller.updateMatrixWorld();
  target.origin.setFromMatrixPosition(controller.matrixWorld);
  target.direction.set(0, 0, -1).transformDirection(controller.matrixWorld).normalize();
  return target;
}

export function createAmplifierVR({
  renderer,
  scene,
  camera,
  controls,
  viewerRig,
  benchHeight = 0.92,
  onPointer,
  onStatusText = () => {},
}) {
  renderer.xr.enabled = true;

  const raySpace = [];
  const pointerState = [];
  const modelFactory = new XRControllerModelFactory();
  const scratchRay = new THREE.Ray();
  const disposables = [];

  // Ray line and tip, so the learner can see what they are about to grab.
  const rayGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);
  disposables.push(rayGeometry);

  for (let index = 0; index < 2; index += 1) {
    const controller = renderer.xr.getController(index);
    controller.userData.index = index;
    viewerRig.add(controller);

    const line = new THREE.Line(
      rayGeometry,
      new THREE.LineBasicMaterial({ color: 0x9fd4ef, transparent: true, opacity: 0.85, depthTest: false })
    );
    line.name = "xr-ray";
    line.scale.z = 1.2;
    line.renderOrder = 10;
    controller.add(line);
    disposables.push(line.material);

    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(0.009, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffd98a, depthTest: false, transparent: true })
    );
    tip.name = "xr-tip";
    tip.renderOrder = 11;
    tip.visible = false;
    controller.add(tip);
    disposables.push(tip.geometry, tip.material);

    const grip = renderer.xr.getControllerGrip(index);
    grip.add(modelFactory.createControllerModel(grip));
    viewerRig.add(grip);

    raySpace.push({ controller, grip, line, tip });
    pointerState.push({ selecting: false, lastY: 0, startY: 0 });

    const emit = (phase) => {
      const ray = controllerRay(controller, scratchRay).clone();
      // A dial reads vertical pointer travel. In the headset that is the controller's
      // own height, converted to the same pixel-like units the mouse path uses.
      const y = ray.origin.y;
      const state = pointerState[index];
      if (phase === "down") {
        state.startY = y;
        state.lastY = y;
      }
      const pixelsPerMetre = 900;
      const event = {
        xrRay: ray,
        xrIndex: index,
        pointerId: XR_POINTER_ID[index],
        button: 0,
        shiftKey: false,
        clientX: 0,
        clientY: (state.startY - y) * pixelsPerMetre,
        startClientY: 0,
        preventDefault() {},
      };
      // down() stores startY from clientY, so keep the origin at zero and let
      // subsequent moves carry the travel.
      if (phase === "down") event.clientY = 0;
      state.lastY = y;
      onPointer(phase, event);
    };

    controller.addEventListener("selectstart", () => {
      pointerState[index].selecting = true;
      emit("down");
    });
    controller.addEventListener("selectend", () => {
      if (!pointerState[index].selecting) return;
      pointerState[index].selecting = false;
      emit("up");
    });
    controller.addEventListener("connected", (event) => {
      controller.userData.handedness = event.data?.handedness ?? (index === 0 ? "left" : "right");
      controller.userData.gamepad = event.data?.gamepad ?? null;
      controller.visible = true;
    });
    controller.addEventListener("disconnected", () => {
      controller.userData.gamepad = null;
      controller.visible = false;
      if (pointerState[index].selecting) {
        pointerState[index].selecting = false;
        onPointer("cancel", { pointerId: XR_POINTER_ID[index], xrIndex: index });
      }
    });

    controller.userData.emit = emit;
  }

  // ---- Locomotion --------------------------------------------------------
  let turnReady = true;
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const headQuaternion = new THREE.Quaternion();

  function axes(gamepad) {
    if (!gamepad?.axes) return [0, 0];
    // Touch-style controllers report the stick on axes 2/3; some report 0/1.
    const x = Math.abs(gamepad.axes[2] ?? 0) > Math.abs(gamepad.axes[0] ?? 0) ? gamepad.axes[2] : gamepad.axes[0];
    const y = Math.abs(gamepad.axes[3] ?? 0) > Math.abs(gamepad.axes[1] ?? 0) ? gamepad.axes[3] : gamepad.axes[1];
    return [x ?? 0, y ?? 0];
  }

  function locomote(delta) {
    const xrCamera = renderer.xr.getCamera();
    xrCamera.getWorldQuaternion(headQuaternion);
    for (const { controller } of raySpace) {
      const gamepad = controller.userData.gamepad;
      if (!gamepad) continue;
      const [x, y] = axes(gamepad);
      const handedness = controller.userData.handedness;
      if (handedness === "left") {
        if (Math.hypot(x, y) < DEAD_ZONE) continue;
        forward.set(0, 0, -1).applyQuaternion(headQuaternion);
        forward.y = 0;
        forward.normalize();
        right.set(1, 0, 0).applyQuaternion(headQuaternion);
        right.y = 0;
        right.normalize();
        viewerRig.position.addScaledVector(forward, -y * MOVE_SPEED * delta);
        viewerRig.position.addScaledVector(right, x * MOVE_SPEED * delta);
      } else if (handedness === "right") {
        if (Math.abs(x) < 0.7) {
          if (Math.abs(x) < 0.35) turnReady = true;
          continue;
        }
        if (!turnReady) continue;
        turnReady = false;
        // Snap turning around the viewer's own head, not the rig origin, so the
        // bench does not swing away underneath them.
        const head = xrCamera.getWorldPosition(new THREE.Vector3());
        const angle = -Math.sign(x) * TURN_STEP;
        viewerRig.position.sub(head);
        viewerRig.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        viewerRig.position.add(head);
        viewerRig.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), angle);
      }
    }
  }

  /** Per-frame: hover feedback, ray length and stick locomotion. */
  function update(delta, hoverTest) {
    if (!renderer.xr.isPresenting) return;
    locomote(Math.min(delta, 0.1));
    for (let index = 0; index < raySpace.length; index += 1) {
      const { controller, line, tip } = raySpace[index];
      if (!controller.visible) continue;
      const ray = controllerRay(controller, scratchRay);
      const hover = hoverTest?.(ray, index) ?? null;
      const distance = hover?.distance ?? 1.2;
      line.scale.z = Math.max(0.08, distance);
      line.material.color.set(hover ? 0xffc766 : 0x9fd4ef);
      tip.visible = !!hover;
      if (hover) tip.position.set(0, 0, -distance);
      if (pointerState[index].selecting) controller.userData.emit("move");
    }
  }

  let placed = false;
  function onSessionStarted() {
    controls.enabled = false;
    placed = false;
    onStatusText("VR active · trigger to grab · left stick moves · right stick turns");
  }

  function onSessionEnded() {
    controls.enabled = true;
    viewerRig.position.set(0, 0, 0);
    viewerRig.quaternion.identity();
    for (const { controller } of raySpace) {
      const index = controller.userData.index;
      if (pointerState[index].selecting) {
        pointerState[index].selecting = false;
        onPointer("cancel", { pointerId: XR_POINTER_ID[index], xrIndex: index });
      }
    }
    onStatusText("");
  }

  /**
   * Stand the viewer a comfortable arm's length from the front edge of the bench,
   * facing it, the first time a tracked pose arrives.
   */
  function placeViewer(frame, referenceSpace) {
    if (placed || !frame || !referenceSpace) return;
    const pose = frame.getViewerPose(referenceSpace);
    if (!pose) return;
    placed = true;
    const { position } = pose.transform;
    // Bench front edge sits near z = +0.48; stand 0.42 m clear of it.
    viewerRig.position.set(-position.x, 0, 0.9 - position.z);
    viewerRig.quaternion.identity();
  }

  function dispose() {
    for (const { controller, grip } of raySpace) {
      controller.removeFromParent();
      grip.removeFromParent();
    }
    for (const value of disposables) value.dispose?.();
  }

  return { update, onSessionStarted, onSessionEnded, placeViewer, dispose, controllers: raySpace, benchHeight };
}
