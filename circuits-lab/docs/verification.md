# Circuits Lab v0.5 verification

Updated 30 September 2026. This report describes the current local build. It does not establish classroom readiness or physical headset performance.

## What students can do

Students operate four Electrical Circuits I experiments: equivalent circuits and maximum power, superposition, amplifier gain and clipping, and RC/RL transients. Explore starts with connected examples. Build circuit keeps the selected values and opens separate empty connections. Written measurements, calculations and answers stay on paper.

The bench uses physical instruments and contacts: students drag probes, pull and replace plugs, turn dials and operate switches. The meter reads its V tip relative to its COM tip. Branch current remains a fixed sensor; the app does not pretend that voltage probes connected in parallel are an ammeter. Keyboard controls provide another way to operate the same equipment.

Load-power sweeps and source comparisons solve the current DC wiring. They are labelled as calculations. Invalid networks show missing readings and diagnostics. The amplifier scope acquires the chosen nodes and grounds; held traces retain their acquisition settings. RC/RL traces contain only acquired circuit time, with synchronized voltage, current and stored energy. Changing resistance or switching starts a fresh segment while preserving capacitor voltage or inductor current.

## Automated checks

The latest Node suite passes **122 of 122 tests**. Coverage includes:

- DC network solutions, signed currents, Kirchhoff balance and power; floating or inconsistent wiring; Thévenin/Norton equivalence and maximum load power; source deactivation and cancellation.
- Amplifier gain, adjustable rails and clipping; connected scope channels, ground validation, trigger crossings, scale limits, undersampling protection and held acquisitions.
- RC/RL continuity, time constants, stored energy, acquisition limits, graph cursors and the opposite effects of increased resistance on normalized response speed.
- Physical tip proximity, exclusive grabs, dial detents and wrist rotation; immediate disconnection during pickup; one Undo for a completed placement; overlapping two-hand changes and bounded history.
- Movement collision, escape when tracked position begins inside an obstacle, headset-relative movement, turning around the tracked head and input rearming after focus loss.
- Mocked WebXR session entry and exit, permission rejection, reference-space fallback, recentering and restoration of the desktop view, using real Three.js transforms.

Retained internal regression helpers are not additional student-facing features. Automated controller and session tests use simulated inputs; they do not constitute a physical headset test.

## Observed desktop interactions

The root agent operated the current local app through the Codex in-app browser using visible canvas controls. These were separate interaction checks:

| Action                                                        | Observed result                                                                  |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Drag the physical load dial from 500 Ω to 2000 Ω              | 4.8 V, 2.4 mA and 11.52 mW                                                       |
| Move the meter V tip to ground, then Undo once                | Reading changed to 0 V, then returned to 3 V                                     |
| Pull out the R₁ B plug, then Undo                             | Branch current became 0, then returned to 6 mA                                   |
| Turn the physical feedback-resistor dial from 20 kΩ to 30 kΩ  | Amplifier gain changed to −3                                                     |
| Drag the physical scope screen cursor                         | At 9.275 ms, CH1 showed approximately −0.44 V and CH2 +0.88 V                    |
| Run an RC trace to 500 ms, then drag its cursor to 235.915 ms | The acquired trace remained visible; capacitor voltage was approximately 4.527 V |

Further canvas checks confirmed:

- Switching the physical meter OFF blanked both its LCD and the page's voltmeter reading; ON restored 3 V.
- Turning the generator amplitude dial at gain −2 raised the output to 7 V, then produced clipping at 11 V. Both the status and graph indicated clipping.
- Turning Time/div changed the scope's displayed time span from 20 ms to 50 ms.
- Turning the source selector from Both to B alone produced −1 V and −1 mA.
- The physical RC Run control began acquisition at 11 ms and 0.521 V; a later reading was 306 ms and 4.766 V. Switching the board to Return started a new trace with continuous voltage at the transition; current was −4.279 mA at 11 ms into the return segment.
- At a 375 × 812 viewport, the document had no horizontal overflow; its scroll width was 360 pixels.

These observations establish desktop interactions for the tested cases. They do not establish physical controller tracking or headset rendering. Older screenshots and panel-preview checks should not be treated as verification of the v0.5 headset experience.

## VR implementation and remaining checks

VR entry requests a real `immersive-vr` session. The implementation supports nearby grip pickup, probe-tip contact placement, plug movement, dial rotation, switches, left-stick movement and right-stick turning. Recenter uses tracked position and heading; exit restores the desktop camera. Input suspension and rearming prevent a held control or stick from continuing automatically across an interruption.

Physical headset testing remains outstanding. Check permissions, tracking, reach, grip and release behavior, dial motion, movement, recentering, readable instruments, comfort and frame rate on the intended headset. Desktop canvas checks and mocked XR tests do not validate these hardware results.

The actual op-amp lab handout has not been provided, so the inverting and non-inverting configurations are provisional. The instructor should reconcile all example values and procedures with the course handouts. The models use ideal components; the amplifier reserves 1 V output headroom and does not simulate bandwidth, slew rate, common-mode limits or output-current limits.

The detailed task mapping and numerical checks are in [experiment-checklist.md](experiment-checklist.md). Publication remains a separate step handled through the website build and deployment workflow.
