import * as THREE from "three";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import { BENCH } from "../scene/room.js";

/**
 * Room-scale WebXR for the amplifier bench.
 *
 * GRIP HOLDS, TRIGGER PRESSES — the split the design system specifies, and the
 * one a student already knows from every other headset app. Grip takes a plug,
 * a probe or a knob; trigger operates a key or a selector.
 *
 * Controllers do not get their own interaction model: a grip produces a world
 * point and hands it to the shared manipulator, so a lead behaves identically
 * under the mouse and in the headset.
 */

const TURN_STEP = Math.PI / 6;
const MOVE_SPEED = 1.4;
const DEAD_ZONE = 0.22;
/** How far in front of the plug the hand holds it, along the controller's ray. */
const HOLD_DISTANCE = 0.14;

export function createXR({ renderer, scene, camera, controls, host, onGrip, onRelease, onMove, onTrigger, onStatus = () => {} }) {
  renderer.xr.enabled = true;

  const rig = new THREE.Group();
  rig.name = "viewer";
  scene.add(rig);
  rig.add(camera);

  const factory = new XRControllerModelFactory();
  const hands = [];
  const scratch = new THREE.Ray();
  const disposables = [];

  const rayGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -1)]);
  disposables.push(rayGeometry);

  for (let index = 0; index < 2; index += 1) {
    const controller = renderer.xr.getController(index);
    controller.userData.index = index;
    rig.add(controller);

    const line = new THREE.Line(rayGeometry, new THREE.LineBasicMaterial({ color: 0x9fd4ef, transparent: true, opacity: 0.8, depthTest: false }));
    line.scale.z = 0.4;
    line.renderOrder = 10;
    controller.add(line);
    disposables.push(line.material);

    const grip = renderer.xr.getControllerGrip(index);
    grip.add(factory.createControllerModel(grip));
    rig.add(grip);

    const hand = { controller, grip, line, index, holding: false, pressing: false };
    hands.push(hand);

    /** The point the hand is holding at: a short way along the controller's ray. */
    const holdPoint = () => {
      controller.updateMatrixWorld();
      scratch.origin.setFromMatrixPosition(controller.matrixWorld);
      scratch.direction.set(0, 0, -1).transformDirection(controller.matrixWorld).normalize();
      return scratch.origin.clone().addScaledVector(scratch.direction, HOLD_DISTANCE);
    };
    hand.holdPoint = holdPoint;
    hand.ray = () => {
      controller.updateMatrixWorld();
      const ray = new THREE.Ray();
      ray.origin.setFromMatrixPosition(controller.matrixWorld);
      ray.direction.set(0, 0, -1).transformDirection(controller.matrixWorld).normalize();
      return ray;
    };
    hand.pulse = (intensity, ms) => {
      const actuator = controller.userData.gamepad?.hapticActuators?.[0];
      actuator?.pulse?.(intensity, ms);
    };

    // Grip: hold a physical object.
    controller.addEventListener("squeezestart", () => {
      hand.holding = true;
      onGrip(hand);
    });
    controller.addEventListener("squeezeend", () => {
      if (!hand.holding) return;
      hand.holding = false;
      onRelease(hand);
    });
    // Trigger: press a control.
    controller.addEventListener("selectstart", () => {
      hand.pressing = true;
      onTrigger(hand, true);
    });
    controller.addEventListener("selectend", () => {
      hand.pressing = false;
      onTrigger(hand, false);
    });
    controller.addEventListener("connected", (event) => {
      controller.userData.gamepad = event.data?.gamepad ?? null;
      controller.userData.handedness = event.data?.handedness ?? (index === 0 ? "left" : "right");
      controller.visible = true;
    });
    controller.addEventListener("disconnected", () => {
      controller.userData.gamepad = null;
      controller.visible = false;
      if (hand.holding) {
        hand.holding = false;
        onRelease(hand);
      }
    });
  }

  // ---- locomotion --------------------------------------------------------
  let turnReady = true;
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const heading = new THREE.Quaternion();

  const stick = (gamepad) => {
    const axes = gamepad?.axes ?? [];
    const x = Math.abs(axes[2] ?? 0) > Math.abs(axes[0] ?? 0) ? axes[2] : axes[0];
    const y = Math.abs(axes[3] ?? 0) > Math.abs(axes[1] ?? 0) ? axes[3] : axes[1];
    return [x ?? 0, y ?? 0];
  };

  function locomote(delta) {
    const xrCamera = renderer.xr.getCamera();
    xrCamera.getWorldQuaternion(heading);
    for (const { controller } of hands) {
      const gamepad = controller.userData.gamepad;
      if (!gamepad) continue;
      const [x, y] = stick(gamepad);
      if (controller.userData.handedness === "left") {
        if (Math.hypot(x, y) < DEAD_ZONE) continue;
        forward.set(0, 0, -1).applyQuaternion(heading).setY(0).normalize();
        right.set(1, 0, 0).applyQuaternion(heading).setY(0).normalize();
        rig.position.addScaledVector(forward, -y * MOVE_SPEED * delta);
        rig.position.addScaledVector(right, x * MOVE_SPEED * delta);
      } else {
        if (Math.abs(x) < 0.7) {
          if (Math.abs(x) < 0.35) turnReady = true;
          continue;
        }
        if (!turnReady) continue;
        turnReady = false;
        // Snap-turn about the viewer's own head, so the bench does not swing away
        // underneath them.
        const head = xrCamera.getWorldPosition(new THREE.Vector3());
        const angle = -Math.sign(x) * TURN_STEP;
        rig.position.sub(head).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle).add(head);
        rig.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), angle);
      }
    }
  }

  let placed = false;
  /** Stand the viewer at the bench the first time a tracked pose arrives. */
  function place(frame) {
    if (placed || !frame) return;
    const space = renderer.xr.getReferenceSpace();
    const pose = space && frame.getViewerPose(space);
    if (!pose) return;
    placed = true;
    const { position } = pose.transform;
    rig.position.set(-position.x, 0, BENCH.stand - position.z);
    rig.quaternion.identity();
  }

  function update(delta, frame, hover) {
    if (!renderer.xr.isPresenting) return;
    place(frame);
    locomote(Math.min(delta, 0.1));
    for (const hand of hands) {
      if (!hand.controller.visible) continue;
      if (hand.holding) onMove(hand);
      const reach = hover?.(hand) ?? null;
      hand.line.scale.z = reach?.distance ?? 0.4;
      hand.line.material.color.set(reach ? 0xffc766 : 0x9fd4ef);
    }
  }

  // ---- entry -------------------------------------------------------------
  let session = null;
  let supported = false;

  async function check() {
    supported = !!(await navigator.xr?.isSessionSupported?.("immersive-vr").catch(() => false));
    onStatus(
      supported
        ? { kind: "ready", message: "Enter VR" }
        : {
            kind: "unavailable",
            message: window.isSecureContext ? "No headset found here" : "VR needs HTTPS",
          }
    );
    return supported;
  }

  async function enter() {
    if (session) return true;
    if (!navigator.xr?.requestSession) return false;
    try {
      // No await before requestSession: entry must keep the button's activation.
      const requested = await navigator.xr.requestSession("immersive-vr", { optionalFeatures: ["local-floor", "bounded-floor"] });
      session = requested;
      let floor = false;
      try {
        await requested.requestReferenceSpace("local-floor");
        floor = true;
      } catch {
        /* 'local' is the baseline. */
      }
      renderer.xr.setReferenceSpaceType(floor ? "local-floor" : "local");
      controls.enabled = false;
      placed = false;
      await renderer.xr.setSession(requested);
      requested.addEventListener("end", () => {
        session = null;
        controls.enabled = true;
        rig.position.set(0, 0, 0);
        rig.quaternion.identity();
        onStatus({ kind: "ready", message: "Enter VR" });
      });
      onStatus({ kind: "active", message: "Grip to hold · sticks to move" });
      return true;
    } catch (error) {
      onStatus({ kind: "error", message: `VR could not start: ${error?.message ?? error?.name ?? "unknown"}` });
      return false;
    }
  }

  const exit = () => session?.end?.();

  void check();

  return {
    rig,
    hands,
    update,
    enter,
    exit,
    check,
    get presenting() {
      return renderer.xr.isPresenting;
    },
    get supported() {
      return supported;
    },
    dispose() {
      void exit();
      for (const { controller, grip } of hands) {
        controller.removeFromParent();
        grip.removeFromParent();
      }
      for (const value of disposables) value.dispose?.();
      rig.removeFromParent();
    },
  };
}
