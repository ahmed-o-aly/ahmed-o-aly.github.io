# Prototype verification

Updated 30 September 2026. This report covers the local prototype, not a classroom deployment.

## Current scope

The student interface is an experiment bench. Students use Explore or Build circuit, operate live instruments, and write measurements, calculations and answers on paper. The current desktop and VR interfaces do not expose answer fields, prediction locks, answer submission, grading, notebook recording or export. Wiring and instrument diagnostics remain part of the experiment.

Earlier automated and browser checks of saved answers, graded challenges and notebook exports are historical regression evidence. Any retained internal assessment APIs are not current student-facing features.

## Current build and browser verification

The experiment-only production build succeeds. The Codex in-app browser was used to operate the production preview after removing student forms:

- **Build circuit:** kept the selected 250 Ω load while opening an empty wiring context. A Thévenin circuit built with four leads and voltage probes reported 2 V, 8 mA and 16 mW. Clear circuit followed by Undo restored the readings and settings.
- **Superposition:** the linked source cases updated live to +2 mA, −1 mA and +1 mA at +6 V/−3 V, then +2 mA, −2 mA and 0 mA at +6 V/−6 V. No capture or submission was needed. Selecting Open produced the warning that these replacements do not give additive contributions.
- **Op-amp:** gain −3 with a 4 V peak input and Autoscale produced the expected clipped 11 V peak output. The only numeric entry in this flow was the real scope trigger-level control; no answer buttons or fields were present.
- **RC:** 2000 Ω with Go to 1 τ showed 200 ms, 3.161 V, approximately 0.92 mA and 0.4995 mJ. No prediction answer or lock was required.
- **Navigation:** the header had no Notebook control, and normal bench tabs were 3D bench and Schematic. The headset setup dialog and Check headset correctly reported that immersive hardware was unavailable in this browser. The desktop did not simulate successful headset entry.

Publication uses the website’s normal build and deployment workflow. The Works route is `/projects/circuits-lab/` and the direct HTTPS app route is `https://ahmed-o-aly.github.io/circuits-lab/`. The site contract checks that published app files match the tested bundle.

## Automated verification

The final suite passes **94 tests**: 15 electrical-model tests, 29 experiment-integration tests, 24 activity/scope protocol tests, six schematic tests, 13 VR lifecycle/placement tests and seven experiment-only interface/model tests. Internal legacy assessment tests remain regression coverage; they do not describe features exposed to students.

The seven new experiment-only tests verify that all module variants and modes omit answer, recording and grading actions; Build preserves component values with separate saved connection contexts; Clear and Undo restore leads and instruments; live superposition values need no records or probes; unsolved circuits leave readings missing; solvable wiring mismatches show actual values plus a warning; and open inactive sources show their real, nonadditive results.

The relevant electrical coverage includes modified nodal analysis, Kirchhoff current balance and signed power, invalid/floating circuits, original/Thévenin/Norton equivalence, source cancellation and deactivation, clipping and adjustable rails, transient continuity and energy, and synchronized voltage/current plots. Scope coverage includes connected-node acquisition, common grounding, trigger crossings, physical scale/time behavior, rejection of windows over 20 periods, and held traces becoming stale when settings change. Connection tests cover Cancel, Remove and Undo.

The 13 VR tests use mocked WebXR APIs and real Three.js camera/vector mathematics. They verify an `immersive-vr` request and renderer attachment; local-floor tracking with local-space fallback; declined permissions; duplicate pending entry protection; device-change support refresh; absent XR and insecure origins; session-end camera/orbit/rig restoration; failed renderer attachment cleanup; initial placement and repeated recentering; upright room orientation with head pitch retained; waiting for a valid viewer pose; and disposal cleanup.

## Earlier browser checks retained for context

The preceding circuit-task build succeeded and was operated through the Codex in-app browser at `localhost:4186`. These observations predate the final experiment-only interface and immersive-entry revision:

- The original and Thévenin circuits reported 2 V, 8 mA and 16 mW at 250 Ω. An empty Thévenin bench was wired and configured to 6 V/500 Ω, reporting 3 V, 6 mA and 18 mW at a 500 Ω load.
- Superposition gave +2 mA, −1 mA and +1 mA at +6 V/−3 V, then +2 mA, −2 mA and 0 mA at +6 V/−6 V.
- RC showed 3.161 V at one time constant and retained capacitor voltage through switching; RL showed 31.606 mA at one time constant. Baseline and half-time-constant configurations were exercised for both circuits.
- A ten-lead amplifier with CH1 at input, CH2 at output and both grounds at GND showed clean gain −3 at 1 V peak input and clipping at ±11 V with 4 V peak input. Changing supplies to ±5 V limited the output to ±4 V. Hold followed by a settings change marked the trace stale; Run recovered it. An incorrect CH1 ground produced a diagnostic and moving it to GND recovered the acquisition.
- Clicking the load body opened its controls. Removing a connection cleared “Circuit connected”; Undo restored it. Moving a voltage probe changed its reading, and shorting the load changed the calculated current and power.
- At a 375 × 812 phone viewport, CSS client and scroll widths were both 360 pixels, accounting for the scrollbar, and scope controls had no horizontal document overflow.
- The desktop world-space panel preview operated Settings, Graph and Schematic controls. Closing it restored the desktop layout. This was not a headset session.

The earlier grading interface completed its superposition, RC/RL and op-amp checks. That interface and its answer controls have since been removed. A notebook JSON download was parsed in an earlier revision; the final app does not offer notebook/export controls. These are historical checks only.

All four procedural boards and the original, Thévenin, Norton, inverting, non-inverting, RC and RL reference schematics were visually inspected in the earlier trainer revision. Source short/open selection and the closed return path were checked. The schematics show reference wiring, with values following settings; they do not redraw from arbitrary student leads.

Current screenshots show the experiment-only interface: [desktop preview](preview.png) and [VR-panel desktop preview](vr-preview.png). The VR-panel screenshot is a desktop inspection view, not a physical headset capture.

## Immersive implementation and hardware boundary

Normal VR entry requests a real `immersive-vr` session and attaches it to Three.js WebXR rendering. Controller rays and trigger presses operate circuit terminals, leads, instruments and settings. The app's animation loop drives transients during immersive rendering. A plain table, metal legs, floor and back wall are visible in the headset environment.

Initial tracked placement and Recenter use the viewer's horizontal position and heading. The Recenter button and standard thumbstick click place the bench and side-by-side panels in front again, preserving floor-relative eye height and keeping the room upright. When floor tracking is unavailable, the fallback assumes a 1.6 m eye height. Exit restores the desktop camera, projection, orbit target and control state. Support is checked again on headset-device changes and return to the browser. The QA-only desktop panel preview is hidden unless `?inspect-vr=1` is supplied.

Mocked checks establish application behavior under simulated headset responses. They do not validate the browser permission prompt, physical controller tracking, headset rendering, comfort, text readability or performance. No physical headset session has been verified. Publication and browser checks do not establish headset tracking, comfort or performance.

The circuits remain proposed defaults pending the actual ELEN 221 handouts. Reconcile the paper worksheet and numerical examples with the instructor, then complete the experiments on the intended headset before classroom use.
