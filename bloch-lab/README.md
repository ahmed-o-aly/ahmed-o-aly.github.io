# Bloch Lab

A guided pure-qubit experiment for Ahmed Aly's personal website, listed as Works item 08. Bloch updates deploy through the personal website only.

## Run and build

Use the existing pinned Node dependencies: `npm test`, `npm run build`, `npm run dev`. Node >=20.19 is required. Vite outputs `../assets/apps/bloch-lab` in this website checkout. All bundle asset paths are relative. The website uses `_plugins/bloch-lab-bundle.rb` to copy the committed bundle to `/bloch-lab/` and `_projects/bloch-lab.md` for the project entry.

## Student path

The default guided path introduces preparation and Z outcomes before the first sample. Students tilt the arrow themselves, predict from its angle and chance, then compare predicted chance with actual fresh-copy frequencies. A quarter-turn shows phase at constant Z chance. HH and HZH motivate interference; HZ and ZH are distinguished by X measurements. Each action is preceded by its purpose and followed by an observation. No A/B loading, same/different quiz or queued intermediate measurement remains.

Blue shows the prepared pure state and predicted chance. Brown dots/bar show actual outcomes from fresh copies. Each batch prepares 100 independent qubits; the blue arrow does not collapse because it describes the repeated preparation. Repeated batches accumulate only for the same vector and measurement basis. Purple marks the measurement axis; grey saves a comparison. The gold arc/label shows tilt. Near-pole percentages retain precision and pole kets use a canonical global-phase convention.

Optional free exploration retains presets, all gates, X/Y/Z measurement, angle/ket details and editable sequences. Opening those controls leaves the guided path. Reset safely cancels activity and returns to the first step. Queue up to eight gates, Run/Pause/Resume/Step/Replay; each gate retains its own exact rotation path and chronological endpoint. Replay restores the saved input. Gate and queue edits are locked during execution. Free direct manipulation uses Touch sphere; desktop otherwise orbits by dragging. Reduced motion shows endpoints immediately.

Gate geometry: H rotates by π around (X+Z)/√2; X/Y/Z rotate by π around their axes; S and T rotate around Z by π/2 and π/4. The Three.js transform is (x,z,−y), preserving handedness. Born probability along n is (1+r·n)/2. Z outcomes are 0/1; X/Y are +/−.

VR requires HTTPS and immersive-vr with local-floor tracking. Both controller rays operate buttons. Trigger on the arrow or sphere prepares a state from any viewing side; dragging outside the guided tilt enters free exploration. Grip moves only the sphere/palette view. Recenter anchors the experience to current eye height and viewing direction, including seated use.

## Verification — 2026-10-06

`npm test` passes 29 tests, including independent complex-state unitaries, complex-amplitude measurement overlaps, poles, probabilities, sequence state machine and path geometry.

Browser suites: `node learning-qa.mjs`, `node qa.mjs`, `node sequence-qa.mjs`, `node trajectory-qa.mjs`. Set `BLOCH_QA_URL` to the preview URL. They check the full ordered lesson, direct controller-ray preparation, phase at fixed tilt, HH/HZH endpoints, HZ/ZH and X outcomes, accumulating fresh observations, interruption/reset, queue/pause/replay, cumulative trajectories, desktop/phone, keyboard, reduced motion and WebGL failure fallback. Screenshots are in ignored `verification/`. `integration-qa.mjs` checks the local generated website launch at port 5191. These are browser simulations, not physical headset validation.

Before classroom use, check headset panel/label legibility, ray aim/reach, preparation, floor height/recenter, session enter/exit, seated/standing positions and sustained frame rate. Physical headset operation remains untested. Vite warns about the approximately 556 kB raw Three.js bundle (144 kB gzip). Physical headset checks remain separate from website publication.

## Quest 3 interaction

This revision replaces camera-facing text sprites with two-sided, world-fixed text planes. Panels remain fixed unless explicitly gripped or recentered; sphere axes and labels turn together when the sphere is handled. There is no per-frame head-following text.

Adapted from the existing Protein Structures controller-relative one-grip transform and two-grip midpoint/rotation/scaling behavior. Grip the sphere (nearby or by pointing) to reposition and turn its view. Two grips resize it; releasing either grip rebases without a jump. Panels can also be gripped independently. Trigger holds the state arrow with a controller-relative offset, including from behind; analytic surface picking supports all viewing sides. VIEW transformations never write the quantum vector, counts or gate sequence.

Quest Touch controls use XR-standard axes 2/3. Holding the left stick continuously moves at up to 0.65 m/s; holding the right stick continuously turns at up to 60°/s around the viewer. Both are proportional, time-scaled, deadzone-filtered and diagonal-speed-limited. There is no stepped/snap movement option. Y or Center recenters; Smaller/Larger adjust only sphere size. Locomotion, sphere/palette grips, arrow preparation and face-button actions are independent input channels and can operate together. Tracking/session visibility loss, disconnect, reset and exit cancel holds and require neutral sticks/button release before rearming.

Quantum state has one writer. Only one controller prepares the arrow at a time, while the other can manipulate the view. Grabbing during a gate animation or measurement stops it at the currently visible state, clears stale paths/counts and rebases the retained gate queue to that preparation. Trigger dragging prepares a state; it does not apply a gate. Run/Step/Replay, a gate, preset or fresh-copy sample commits preparation and releases the arrow hold before taking ownership. Run restarts the retained queue from its first gate on the newly prepared input. Movement and view grips remain active during calculation. Replaying uses that saved input; reset returns to the initial guided state.

`vr-qa.mjs` adds simulated grip, two-grip scaling, release/reset, fixed label transforms during viewer navigation, rear arrow dragging and view controls during gate playback. `tests/vr-interaction.test.js` checks gesture offsets, bounds, overlapping hands, all-sided picking and comfort navigation. Physical Quest 3 testing remains pending.

### Distinct immersive layout

The actual VR scene defaults to the manipulable sphere and one short world-fixed cue, with measured-copy results shown only when present. All legacy desktop-derived panels are hidden in immersive mode. X (or right stick click) opens/closes a single world-anchored control palette with Learn/State/Gates/View tabs. It stays where it was opened and can be gripped; it never follows the head. A performs the next guided action or run/pause in exploration. B repeats a relevant guided sample/helper, or samples in exploration. Y recenters. Direct trigger editing outside the guided tilt step enters exploration instead of silently refusing the gesture.

The same mathematical state/gate/measurement engine powers desktop and this separate VR layout. The palette is closed by default and after recentering. No wrist-following or head-following panels are used. Simulated QA explicitly checks zero legacy panels and a closed palette in the default VR scene, plus opening/gripping/closing the palette. The actual Quest 3 still needs user review.

### Concurrent input and control introduction — 2026-10-06

A short world-fixed Quest controller map appears on the first immersive entry in each page visit. Trigger **Got it** dismisses it; **View → Controls help** reopens it. It explains sticks, trigger preparation, grips, A/B/X/Y and the gate-rebase behavior. It neither follows the headset nor opens the main control palette.

The VR browser suite checks actual frame input dispatch for held diagonal movement plus turning, left-hand view grip plus right-hand arrow preparation, Run pressed while locomoting and holding the arrow, interruption/rebase of an in-progress gate without an endpoint jump, retained H/Z correctness, sampling while moving, reset/rearming, help visibility and absence of the old movement toggle. Independent navigation unit tests compare 60/120 Hz travel and verify turning about the viewer. Actual Quest 3 checks remain pending.
