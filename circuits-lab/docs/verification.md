# Circuits Lab v0.6 verification

Updated 30 September 2026. The user tested v0.5 in VR and reported that direct handling was much better, but the equipment displays, graph and right panel were difficult to read. Version 0.6 addresses that feedback. The assistant has not operated a physical headset.

## What students can do

Students operate four Electrical Circuits I experiments: equivalent circuits and maximum power, superposition, amplifier gain and clipping, and RC/RL transients. Explore starts with connected examples. Build circuit keeps the selected values and opens separate empty connections. Written measurements, calculations and answers stay on paper.

The bench uses physical instruments and contacts: students drag probes, pull and replace plugs, turn dials and operate switches. The meter reads its V tip relative to its COM tip. Branch current remains a fixed sensor; the app does not pretend that voltage probes connected in parallel are an ammeter. Keyboard controls provide another way to operate the same equipment.

Load-power sweeps and source comparisons solve the current DC wiring. They are labelled as calculations. Invalid networks show missing readings and diagnostics. The amplifier scope acquires the chosen nodes and grounds; held traces retain their acquisition settings. RC/RL traces contain only acquired circuit time, with synchronized voltage, current and stored energy. Changing resistance or switching starts a fresh segment while preserving capacitor voltage or inductor current.

## Version 0.6 readability changes

- Floating hover labels no longer cover the equipment. Contact highlights remain.
- The right panel shows three large, labelled readings, with a relevant connection warning, clipping warning or transient time.
- The main graph is closer and shows one full-width plot at a time. Tabs retain every supplied channel and quantity; trace inspection still uses the selected plot and shared transient time.
- Equipment lettering keeps its physical aspect ratio. LCD digits, labels and graph marks are larger and have stronger contrast.
- Panels face the recentered viewer. XR retains the native framebuffer scale and requests zero peripheral foveation.

Version 0.6 passed the desktop checks below. Revised headset readability and frame rate still need confirmation on the intended device.

## Automated checks

The full v0.6 Node suite passed **122 of 122 tests**. The production build and repository `format:check` also passed. Test coverage includes:

- DC network solutions, signed currents, Kirchhoff balance and power; floating or inconsistent wiring; Thévenin/Norton equivalence and maximum load power; source deactivation and cancellation.
- Amplifier gain, adjustable rails and clipping; connected scope channels, ground validation, trigger crossings, scale limits, undersampling protection and held acquisitions.
- RC/RL continuity, time constants, stored energy, acquisition limits, graph cursors and the opposite effects of increased resistance on normalized response speed.
- Physical tip proximity, exclusive grabs, dial detents and wrist rotation; immediate disconnection during pickup; one Undo for a completed placement; overlapping two-hand changes and bounded history.
- Movement collision, escape when tracked position begins inside an obstacle, headset-relative movement, turning around the tracked head and input rearming after focus loss.
- Mocked WebXR session entry and exit, permission rejection, reference-space fallback, recentering and restoration of the desktop view, using real Three.js transforms.

Retained internal regression helpers are not additional student-facing features. Automated controller and session tests use simulated inputs; they do not constitute a physical headset test.

## Version 0.6 desktop checks

The root agent operated the final production build served locally on port 5188 through visible browser controls:

| Action                                       | Observed result                                                                                                                                    |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Select 1000 Ω on the large Thévenin graph    | 4 V, 4 mA and 16 mW                                                                                                                                |
| Select CH2, then inspect 11.276 ms           | CH1 was 0.718 V and CH2 −1.437 V; the large graph readout matched CH2                                                                              |
| Run RC, select Energy and inspect 252.546 ms | Playback paused and retained the 383.5 ms acquired trace; synchronized readings were 4.6 V, 0.4 mA and 1.058 mJ; the large readout showed 1.058 mJ |
| Press the physical recorder's Current button | Both recorder and main graph selected Current, preserving the 252.546 ms cursor                                                                    |

Equipment values of 12 V, 5 V and 500 Ω were readable in the browser. Panel preview showed no floating hover labels. These are desktop observations, not confirmation of headset clarity or frame rate.

- On the final rebuilt bundle, leaving panel preview removed panel shadows from the table, and turning the physical load dial from 500 Ω to 2000 Ω still produced 4.8 V, 2.4 mA and 11.52 mW.

## Previous version: v0.5 desktop interactions

The root agent operated v0.5 through the Codex in-app browser using visible canvas controls. These were separate interaction checks, retained as the previous version's evidence:

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

These observations establish desktop interactions for those cases. They do not verify the revised v0.6 presentation or physical headset tracking and rendering.

## VR implementation and remaining checks

VR entry requests a real `immersive-vr` session. The implementation supports nearby grip pickup, probe-tip contact placement, plug movement, dial rotation, switches, left-stick movement and right-stick turning. Recenter uses tracked position and heading; exit restores the desktop camera. Input suspension and rearming prevent a held control or stick from continuing automatically across an interruption.

The user's v0.5 headset feedback is direct evidence of their experience. It does not yet confirm the v0.6 readability changes. Check the revised text, graph tabs, reach, comfort and frame rate on the intended headset. Desktop canvas checks and mocked XR tests do not establish those hardware results.

The actual op-amp lab handout has not been provided, so the inverting and non-inverting configurations are provisional. The instructor should reconcile all example values and procedures with the course handouts. The models use ideal components; the amplifier reserves 1 V output headroom and does not simulate bandwidth, slew rate, common-mode limits or output-current limits.

The detailed task mapping and numerical checks are in [experiment-checklist.md](experiment-checklist.md). Publication remains a separate step handled through the website build and deployment workflow.
