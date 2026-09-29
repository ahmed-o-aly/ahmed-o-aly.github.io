# VR integration and validation

`src/vr.js` exports `setupVR({ renderer, scene, camera, modelRoot, panel, onStatus, onAction })`.

- Append the returned `button` in the viewer UI. The CSS class is `vr-button`; `data-state` is `checking`, `ready`, `unavailable`, `entering`, `active`, or `error`.
- `onStatus({ kind, message })` provides a human-readable availability, controls, or error message. It can be called immediately during setup.
- Optional `onAction(action)` receives `'toggle-playback'` on a right-controller button 4 press (A), and `'next-state'` on right button 5 (B). Left button 4 (X) toggles the panel; left button 5 (Y) recenters. A right-thumbstick click also toggles the panel. Each action fires once on press. Only tracked `xr-standard` input sources with the relevant controls are used. The parent viewer owns playback and settings.
- Call `vr.update(deltaSeconds)` from `renderer.setAnimationLoop()`, before rendering. Suspend OrbitControls and desktop auto-rotation whenever `vr.active` is true.
- `vr.reset()` recenters the model in front of the headset at the size and orientation it had when VR started. `vr.refreshSupport()` checks for a newly connected headset. `await vr.dispose()` removes the module’s scene content and listeners.

The model must be centered inside `modelRoot`, preferably about two metres tall in scene units. Entering VR records and later restores the model and desktop camera transforms. With a floor reference space, the initial position is `(0, 1.4, -2.3)` metres. The first XR frame places it 2.3 metres in front of the actual viewer, with its centre 0.2 metres below eye height. When floor tracking is unavailable, the module uses the baseline `local` reference space and hides its floor grid.

Controls:

- Hold either lower grip to move and rotate the model with one controller. Triggers aimed away from the panel also grab.
- Hold both lower grips to move, rotate, and scale the model between the two hands. Hand tracking uses pinch gestures when the runtime supplies them.
- Move the left thumbstick to move the viewer forward/backward and sideways relative to the horizontal headset direction. This changes the camera rig position, not the model transform or size. Neither thumbstick resizes the model.
- Press X or click the right thumbstick to summon/hide the panel. It opens on VR entry, placed in front and to the right of the viewer, and stays anchored in the scene rather than following the head. Reopening places it by the current viewpoint. Aim a controller at its controls; press or hold the trigger to select or drag. Grips remain available to grab the model while the panel is open.
- The panel controls contour (seven discrete presets), opacity, density representation, model visibility, chain isolation, and cutaway. State comparison has mode-specific playback, previous/next, focus, ED4 overlay, and RPT5 controls. Cutaway works in both views. Contour loads show progress and errors; a failed request leaves the existing mesh and restores its preset. Settings share the desktop handlers.
- Y recenters; A toggles state playback and B advances one state. These labels match the Oculus Touch profile. Other controllers may label additional buttons differently or omit them; `xr-standard` itself defines only buttons 0–3, so these labels are not universal. Hand pinch remains dedicated to grabbing, and panel interaction currently requires controllers.
- Release to leave the model in place. Scaling is bounded to 0.15–4 times its initial size.

The module adds laser pointers, small controller markers, a subtle floor grid, and sphere-based hand visuals. It uses no remote controller or hand-model downloads. `src/vr-panel.js` owns the canvas-backed panel geometry and pointer hit targets; `main.js` supplies live settings through `getState`, `onChange`, and `onAction`. The panel belongs to the scene, independent of the model and camera rig, so scaling a protein never scales its controls. The application camera is parented to the locomotion rig while in VR and restored on exit; pass that camera to world-space captions after `vr.update()` has updated it.

## Opening in a headset

Use a WebXR-compatible headset browser and load the viewer from a trusted HTTPS origin. `http://localhost` is useful for same-device desktop development, but a plain `http://192.168…` LAN address is not a secure context in the headset. Options are an HTTPS deployment, an HTTPS development tunnel started by the user, or a local HTTPS server whose certificate is trusted by the headset. Desktop use with a connected headset depends on the browser and XR runtime. The module checks `isSessionSupported('immersive-vr')` rather than claiming support based on browser identity.

## Validation performed

`node --check src/vr.js` passed. A Node harness using real Three.js transforms and mocked XR/DOM objects verified supported/unsupported states, entry, floor placement, controller translation, two-hand scale, scale bounds, desktop restoration, and rejection of insecure contexts. This verifies logic; it is not a hardware test. Headset rendering, input tracking, hand pinch support, frame rate, and comfort still require an actual device.

Additional mocked checks cover playback button press/release edges, no repeat while held or recentering, callbacks during controller grabs, absent optional buttons, ignored non-XR-standard gamepads, tracking loss, and reconnect state.

The committed `scripts/test-vr.mjs` regression suite covers head-relative locomotion, shared head/controller movement, unchanged two-grip scaling, panel-versus-model pointer ownership, tracking loss, held-button focus recovery, current-view recentering, and desktop restoration. `scripts/test-vr-panel.mjs` checks panel placement, ray hit coordinates, slider ranges, chain pagination, disabled controls, and capture cancellation. Both run with the motion tests via `npm test`. Browser preview checks verify the actual panel texture and desktop integration; they do not emulate headset input.

References checked for this implementation:

- [Three.js WebXRManager](https://threejs.org/docs/pages/WebXRManager.html)
- [Three.js r180 controller implementation](https://github.com/mrdoob/three.js/blob/r180/src/renderers/webxr/WebXRController.js)
- [Three.js r180 hand model factory](https://github.com/mrdoob/three.js/blob/r180/examples/jsm/webxr/XRHandModelFactory.js)
- [MDN: requestSession and secure context](https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession)
- [MDN: WebXR permissions and security](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Permissions_and_security)
- [WebXR Gamepads Module: reserved indices and additional buttons](https://immersive-web.github.io/webxr-gamepads-module/#xr-standard-gamepad-mapping)
- [Official Oculus Touch v3 profile: A/X at index 4, B/Y at index 5](https://github.com/immersive-web/webxr-input-profiles/blob/main/packages/registry/profiles/oculus/oculus-touch-v3.json)
