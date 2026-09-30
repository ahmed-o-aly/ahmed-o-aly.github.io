import * as THREE from "three";

/** DOM-free WebXR lifecycle, injectable for tests and reusable by the lab shell. */
export function createVRSession({
  xrManager,
  navigatorXR,
  isSecureContext = true,
  visibilityTarget = null,
  onStatus = () => {},
  onBeforeSession = () => {},
  onSessionStarted = () => {},
  onSessionEnded = () => {},
}) {
  let supported = false;
  let active = false;
  let entering = false;
  let disposed = false;
  let session = null;
  let prepared = false;
  let floorReference = false;
  let observedXR = null;
  let checkVersion = 0;
  let state = { kind: "checking", supported: false, active: false, message: "Checking headset…" };
  const getXR = () => (typeof navigatorXR === "function" ? navigatorXR() : navigatorXR);
  const isSecure = () => (typeof isSecureContext === "function" ? isSecureContext() : isSecureContext);
  function report(kind, message) {
    state = { kind, supported, active, message };
    if (!disposed) onStatus({ ...state });
  }
  function finishSession(reason = "ended") {
    if (!session && !prepared && !active) return;
    const previous = session;
    const needsRestore = prepared;
    session = null;
    prepared = false;
    active = false;
    entering = false;
    if (needsRestore) onSessionEnded({ session: previous, floorReference, reason });
    report(
      supported ? "ready" : "unavailable",
      supported ? "VR ready. Enter the lab to connect leads and take readings." : "Open the lab’s HTTPS link in your headset browser."
    );
  }
  const onManagerEnd = () => finishSession(disposed ? "disposed" : "ended");
  xrManager.addEventListener?.("sessionend", onManagerEnd);
  const onDeviceChange = () => {
    void refreshSupport();
  };
  const onVisibilityChange = () => {
    if (!visibilityTarget?.visibilityState || visibilityTarget.visibilityState === "visible") void refreshSupport();
  };
  visibilityTarget?.addEventListener?.("visibilitychange", onVisibilityChange);
  function observeXR(xr) {
    if (xr === observedXR) return;
    observedXR?.removeEventListener?.("devicechange", onDeviceChange);
    observedXR = xr;
    observedXR?.addEventListener?.("devicechange", onDeviceChange);
  }
  async function refreshSupport() {
    if (disposed || entering || active) return supported;
    const version = ++checkVersion;
    const xr = getXR();
    observeXR(xr);
    supported = false;
    if (!isSecure()) {
      report("unavailable", "VR needs HTTPS. Open the lab’s HTTPS link in your headset browser.");
      return false;
    }
    if (!xr?.isSessionSupported) {
      report("unavailable", "No headset found here. Open the lab’s HTTPS link in your headset browser.");
      return false;
    }
    report("checking", "Checking headset…");
    try {
      const result = await xr.isSessionSupported("immersive-vr");
      if (disposed || entering || active || version !== checkVersion) return supported;
      supported = !!result;
      report(
        supported ? "ready" : "unavailable",
        supported
          ? "VR ready. Enter the lab to connect leads and take readings."
          : "No headset found here. Open the lab’s HTTPS link in your headset browser."
      );
    } catch (error) {
      if (!disposed && !entering && !active && version === checkVersion)
        report("unavailable", `VR support could not be checked: ${error?.message || error?.name || "unknown error"}.`);
    }
    return supported;
  }
  async function enter() {
    if (disposed || entering) return false;
    if (active) return true;
    const xr = getXR();
    observeXR(xr);
    if (!isSecure() || !xr?.requestSession) {
      report(
        "unavailable",
        !isSecure()
          ? "VR needs HTTPS. Open the lab’s HTTPS link in your headset browser."
          : "No headset found here. Open the lab’s HTTPS link in your headset browser."
      );
      return false;
    }
    entering = true;
    checkVersion++;
    report("entering", "Accept the headset’s request to enter VR.");
    let requested;
    try {
      // Do not put an await before this call: entry must retain the button's user activation.
      requested = await xr.requestSession("immersive-vr", { optionalFeatures: ["local-floor", "bounded-floor"] });
      if (disposed) {
        await requested.end().catch(() => {});
        return false;
      }
      session = requested;
      floorReference = false;
      try {
        await requested.requestReferenceSpace("local-floor");
        floorReference = true;
      } catch {
        /* 'local' remains the baseline reference space. */
      }
      xrManager.setReferenceSpaceType(floorReference ? "local-floor" : "local");
      prepared = true;
      onBeforeSession({ session: requested, floorReference });
      await xrManager.setSession(requested);
      if (disposed || session !== requested) {
        await requested.end().catch(() => {});
        return false;
      }
      supported = true;
      active = true;
      entering = false;
      onSessionStarted({ session: requested, floorReference });
      report("active", "VR active. Grip probes and dials. Left stick moves; right stick turns. Click a stick to return to the bench.");
      return true;
    } catch (error) {
      if (requested) await requested.end().catch(() => {});
      finishSession("error");
      entering = false;
      report(
        "error",
        error?.name === "NotAllowedError"
          ? "The VR request was declined. Select Try VR again when you are ready."
          : `VR could not start: ${error?.message || error?.name || "headset unavailable"}. Check the headset and try again.`
      );
      return false;
    }
  }
  async function exit() {
    if (!session) return false;
    const previous = session;
    try {
      await previous.end();
      // Real Three.js emits sessionend first; fallback also supports minimal XR managers.
      if (session === previous) finishSession(disposed ? "disposed" : "ended");
      return true;
    } catch (error) {
      report("error", `VR could not exit: ${error?.message || error?.name || "unknown error"}. Use the headset system menu to exit.`);
      return false;
    }
  }
  async function dispose() {
    if (disposed) return;
    disposed = true;
    checkVersion++;
    if (session) await exit();
    if (prepared) finishSession("disposed");
    observedXR?.removeEventListener?.("devicechange", onDeviceChange);
    visibilityTarget?.removeEventListener?.("visibilitychange", onVisibilityChange);
    xrManager.removeEventListener?.("sessionend", onManagerEnd);
  }
  void refreshSupport();
  return {
    enter,
    exit,
    refreshSupport,
    dispose,
    toggle: () => (active ? exit() : enter()),
    get state() {
      return { ...state };
    },
    get active() {
      return active;
    },
    get entering() {
      return entering;
    },
    get supported() {
      return supported;
    },
  };
}

export function snapshotDesktopView(camera, controls) {
  return {
    position: camera.position.clone(),
    quaternion: camera.quaternion.clone(),
    scale: camera.scale.clone(),
    near: camera.near,
    far: camera.far,
    fov: camera.fov,
    aspect: camera.aspect,
    zoom: camera.zoom,
    target: controls.target.clone(),
    controlsEnabled: controls.enabled,
  };
}

export function restoreDesktopView(camera, controls, rig, snapshot) {
  if (!snapshot) return;
  rig.position.set(0, 0, 0);
  rig.quaternion.identity();
  rig.scale.set(1, 1, 1);
  camera.position.copy(snapshot.position);
  camera.quaternion.copy(snapshot.quaternion);
  camera.scale.copy(snapshot.scale);
  Object.assign(camera, { near: snapshot.near, far: snapshot.far, fov: snapshot.fov, aspect: snapshot.aspect, zoom: snapshot.zoom });
  camera.updateProjectionMatrix();
  controls.target.copy(snapshot.target);
  controls.enabled = snapshot.controlsEnabled;
  controls.update();
  camera.updateMatrixWorld(true);
}

/** Place the tracked viewer at the bench origin, facing world -Z, while preserving real floor height. */
export function recenterRig(rig, viewerPose, { floorReference = true, eyeHeight = 1.6 } = {}) {
  const position = viewerPose?.transform?.position;
  const orientation = viewerPose?.transform?.orientation;
  if (
    !position ||
    !orientation ||
    ![position.x, position.y, position.z, orientation.x, orientation.y, orientation.z, orientation.w].every(Number.isFinite)
  )
    return false;
  const quaternion = new THREE.Quaternion(orientation.x, orientation.y, orientation.z, orientation.w).normalize();
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion);
  const yaw =
    Math.hypot(forward.x, forward.z) > 0.001 ? Math.atan2(forward.x, -forward.z) : -new THREE.Euler().setFromQuaternion(quaternion, "YXZ").y;
  rig.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  const rotatedPosition = new THREE.Vector3(position.x, position.y, position.z).applyQuaternion(rig.quaternion);
  rig.position.set(-rotatedPosition.x, floorReference ? 0 : eyeHeight - position.y, -rotatedPosition.z);
  rig.updateMatrixWorld(true);
  return true;
}
