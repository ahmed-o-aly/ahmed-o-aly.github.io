# Lab 7 cable manipulation — separate local draft

Date: 2026-10-15. Base: `80c8edf8a245e0e25e3f123a28b63740747aa61e`. Branch: `codex/lab7-live-drag`. No push, publication, deployment or merge.

## Result and interaction

The prior scene showed wires and probes only after release and rebuilt their paths from presets. This revision keeps a visible plug/probe and tether under manipulation and preserves the cable curve shown at release.

- Draw from a terminal to another terminal to create a lead along the pointer's path.
- Grab a cable body to bend it locally. Both endpoints stay fixed, and electrical connections/readings remain unchanged.
- Grab a physical plug to reconnect that end, or drop away from sockets to unplug. Shift-drag an occupied socket to add another lead; named Connection tools remain available.
- Drag a probe by its handle. Its orientation and grip offset are retained; aim the actual tip at the highlighted socket. A loose probe stays where it is set down.
- Release saves the shown route. Settings, other cable edits, camera rotation and Home view do not reroute it. Another grab edits the existing shape.
- Undo restores one cable edit or circuit change. Geometry-only Undo also preserves scope Hold. Escape, lost pointer capture and window blur discard the uncommitted gesture.

## Approach

Explicit persistent control-point curves provide local bending without an always-running rope solver or drift. `amplifier-cables.js` contains the geometry helpers. `cableLayout` in the experiment state stores wire curves and probe curves/poses separately from electrical connectivity. Electrical acquisition signatures exclude geometry, so reshaping cannot open a contact or make a held capture stale. Undo snapshots include both the electrical state and layout.

Only intentional plug/probe pickup opens a contact temporarily. Body grabs leave acquisition live. Release commits once; cancellation discards the temporary view. Wrong electrical connections remain wrong. No auto-correction or autorouting runs after release. While drawing a fresh lead, points crossing an instrument face are lifted just above it; this preserves their x/y path and both endpoint contacts. Initial connections made by selecting named endpoints receive a starter route because no pointer path exists; those curves are directly editable thereafter. New manually drawn wires never fall back to that starter route.

This is geometric manipulation, not a full collision, gravity, inextensible rope or tangling simulation. Bodies of the instruments and electronic components remain fixed. The Lab 7 path still has no immersive entry or controller manipulation. Page refresh starts a new experiment; route persistence applies within the experiment and its Undo history. Selecting another configuration clears leads/layout as before; Undo restores the previous configuration and curves.

## Verification

| Check                                                             | Result                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node tests                                                        | 260 passed; 0 failed, skipped or cancelled. Includes 10 contact tests and 17 persistent-layout tests.                                                                                                                                  |
| Vite production build                                             | Passed.                                                                                                                                                                                                                                |
| Fresh wire during drag                                            | Native browser screenshot shows moving cable/plug; release retains the drawn direction.                                                                                                                                                |
| Cable-body bend after release                                     | Passed in native built-in browser; screenshot shows retained curve.                                                                                                                                                                    |
| Cable-body electrical continuity                                  | Passed in all four production configurations; lead counts, circuit-complete state, meter and scope readings unchanged by the bend.                                                                                                     |
| Repeated reshaping                                                | Passed; subsequent middle grab edits the stored shape.                                                                                                                                                                                 |
| Probe-cable body edit                                             | Passed; CH1, CH2 and meter readings remain unchanged.                                                                                                                                                                                  |
| Parameter / another lead / camera                                 | Passed; shape retained after Rf change, another lead, rotation and Home view.                                                                                                                                                          |
| Geometry-only Undo while scope held                               | Passed; route restored, scope remains held and readings unchanged.                                                                                                                                                                     |
| Endpoint replug / Undo                                            | Passed; wrong contact produces the existing diagnostic; Undo restores circuit, measurements and previous route.                                                                                                                        |
| Raised Vin2 socket exit                                           | Passed with native forward and reverse drags after fixing face occlusion; both screenshots independently reviewed.                                                                                                                     |
| Independent review                                                | 32 complementary persistence scenarios passed across all four modes, including 100 sequential reshapes per mode; 22 focused closure checks passed for probe no-op history and face clearance. No unresolved blocker from these checks. |
| Model invariants                                                  | Passed for all four modes: fixed sockets, other routes unchanged, parameter and configuration Undo preserve curves, invalid geometry rejected.                                                                                         |
| Browser errors/warnings                                           | None recorded in the production configuration checks.                                                                                                                                                                                  |
| Native interruption during moving drag                            | Unrun: the available atomic native drag cannot be reliably interrupted at a chosen point. Escape/blur/capture-loss handling is source-reviewed; temporary-state cancellation is model-verified, not counted as a native browser pass.  |
| Physical touch, headset, screen reader, new performance profiling | Unrun.                                                                                                                                                                                                                                 |
| Full Jekyll build / whole-site contracts                          | Unrun: this Mac's existing Ruby/Bundler setup is unavailable for the required site build; app build passed.                                                                                                                            |

At the defaults (±12 V, Vin1 1 Vpp, Vin2 0.6 Vpp where applicable): inverting −2 V/V, 2 Vpp, 0.707 Vrms; non-inverting +3 V/V, 3 Vpp, 1.061 Vrms; adder −2 Vin1 − 2 Vin2, 3.2 Vpp, 1.131 Vrms; difference −2 Vin1 + 2 Vin2, 0.8 Vpp, 0.283 Vrms. All four were built through the production UI and then reshaped with a native drag.

## Evidence and visual limits

Evidence is in the local task's `lab7-work/live-drag/` directory. Final configuration captures use the `persistent-` prefix; `persistent-four-configurations.png` and `persistent-figure2-comparison.png` are the current gallery/comparison. Earlier captures are retained as progress evidence. `cable-bend-retained.png`, `route-after-value-change.png`, `route-with-second-lead.png`, `route-camera-returned.png`, `probe-body-retained.png`, and `replug-undo-retained.png` document the persistence checks.

Figure 2 was viewed directly and compared beside the actual browser rendering. The white board, labeled 741 symbol/pins, ordered controls and integrated instruments remain represented. Visible dragging and persistent shaping are verified improvements; the overall material realism, case detailing and appearance are still below the supplied reference and remain open for Aly's review. Functional tests do not establish visual acceptance.

The original checkout and its preview at `http://127.0.0.1:4187/circuits-lab/?lab=7` remain at the base commit. The revised preview is `http://127.0.0.1:4197/circuits-lab/?lab=7`, built from the separate `codex/lab7-live-drag` worktree. No Organic, Lab 8 or legacy experiment source was edited. Shared generated chunk filenames change as a normal result of the app build.
