# Circuits Lab v0.11

Four Electrical Circuits I experiments provide desktop 3D benches. Labs 5, 6 and 8 also retain their immersive WebXR lab; the dedicated Lab 7 rebuild supports desktop and phone presentation, with no immersive entry in that path. Students wire circuits, use instruments, change values and inspect live traces. Readings and written answers stay on paper.

[Works page](https://ahmed-o-aly.github.io/projects/circuits-lab/) · [Open the lab](https://ahmed-o-aly.github.io/circuits-lab/)

## Run and build

```sh
npm install
npm run dev
npm test
npm run build
```

Vite prints the local URL. The normal dev port is 5186; pass `-- --port 5187` if another copy is running. The build writes to `../assets/apps/circuits-lab/`. The site's Jekyll hook copies these files unchanged to `/circuits-lab/`. The published app needs HTTPS for headset access.

## Use the neighboring labs (5, 6 and 8)

- **Explore** starts with a wired circuit. **Build circuit** starts with loose connections. Each keeps its own wiring.
- **Reset experiment**, labelled **Reset lab** on the physical control box, restores this lab’s original Explore circuit, default values, probes and instrument settings. It clears the lab’s old traces and Undo history, including other saved variants. Other labs keep their settings.
- Drag between contacts to connect a lead. Move a plug to change its connection. Drop it away from a contact to disconnect it. **Undo** restores the last change.
- Move the meter's V and COM tips to the two points being measured. The display reads V minus COM. Swapping the tips reverses its sign.
- Use the dials and switches on the equipment. The experiment control box is on the closer front-right ledge, with larger buttons and setting labels. Optional **Keyboard controls** expose the same settings.
- Read **Your experiment** and **Experiment steps** above the bench. The schematic is the target circuit, not an automatically redrawn diagram of the student's wiring.

In VR, grip a probe to hold it and release its tip near a contact to connect. A picked-up probe starts with its tip down; turn your wrist to aim it. Hold and turn a dial. The left stick moves, the right stick turns, and room-scale tracking lets you walk within your play area. Use the headset system menu to exit.

The scope or recorder sits within reach on the left ledge and is the graph display in VR. Point at its screen and hold the trigger to inspect a trace. The RC/RL recorder has Voltage, Current and Energy buttons; the scope shows both channels and has scale, trigger and Run/Hold controls. The right panel gives three labelled readings. The smaller centre panel explains the current circuit or instrument issue and what to check; its Diagram tab shows the reference circuit. Floating labels do not cover the equipment.

Moving a lead keeps the other wires in place. The held cable bends with the moving end, then settles gently after release. Common sockets keep the fixed end where it was placed.

## Use Lab 7

Open `/circuits-lab/?lab=7` (or `?lab=opamp`). One live experiment starts with the supply off and no leads or probes. Choose a configuration to arrange its parts; switching clears connections, probes and power as one undoable action. There are no separate Build/Explore wiring states.

Drag between labeled terminals, or tap two terminals and press Connect. The default-closed **Connection tools** disclosure provides named endpoints and probe placement for keyboard use. Select a lead to highlight its endpoints and remove it. **Undo** restores the last electrical change; **Reset** clears wiring/probes and switches off the supply as one undoable action. Hints highlight suggested terminals without constructing any part of the circuit.

Each resistor and source amplitude has an independent numeric setting and physical knob. The adder exposes Rin1, Rin2 and Rf; the difference amplifier exposes R1–R4. Its explicit **Match R4** action sets only R4 = R3 × R2 / R1, with Undo. Two-input signals share waveform, frequency and phase, with independent amplitudes. AC amplitude is Vpp; DC is signed volts and disables frequency changes.

Attach both meter tips and each scope channel's tip and ground clip yourself. The meter reports true RMS for AC and signed volts for DC. Scope channels share one time/voltage grid and identify their actual probe targets. Hold freezes the scope capture while the meter remains live. Phone Controls, Bench and Measure change presentation only; Measure includes the same two-channel plot. Mounting holes are isolated, while the labeled GND sockets share the visible common rail.

## The four experiments

| Experiment                         | Student task                                                                          | Measurement view                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Thévenin, Norton and maximum power | Build equivalents, compare several loads, find maximum load power                     | The power sweep solves the current wiring. Drag along it to set the load and compare the meter readings.               |
| Superposition                      | Deactivate each source in turn, combine signed currents, make one branch current zero | Linked source views solve the current wiring for A alone, B alone and both.                                            |
| Operational amplifiers             | Select resistors for a specified gain, find the largest input before clipping         | Two manual scope channels share one time grid; meter, transfer relation and probe-dependent readings update together.  |
| RC and RL transients               | Predict the effect of resistance on response speed, then test both circuits           | Voltage, current and energy traces grow with elapsed circuit time. Pause, slow, replay and inspect the acquired trace. |

There are no answer fields, submissions, grades or export forms.

## Model limits

DC resistor networks use a nodal solver with the actual leads. Invalid or floating networks produce diagnostics. Amplifier and transient circuits support the shown layouts. Lab 7 can measure connected ideal source terminals before the amplifier is complete; other incomplete or incorrect amplifier networks have no simulated amplifier readings. Conflicting ideal-source voltages invalidate the affected source component across its whole waveform.

The amplifier uses ideal feedback gain and output limits 1 V inside each supply rail. It does not model a specific chip's bandwidth, slew rate, loading or input limits. Scope channels have ideal impedance and share ground. Lab 7 uses sampled waveform statistics, including true RMS and signed mean. Clipped input-pin voltages follow the actual resistor network rather than assuming a virtual short.

RC uses 100 µF and RL uses 100 mH, with a 5 V source. Switching and resistance changes preserve capacitor voltage or inductor current. **New run** resets stored energy. Playback speed changes display speed, not the circuit time constant. Replay repeats the current switching segment.

Lab 7 follows the operational-amplifier report's physical bench hierarchy: one dual supply (±8/±12/±15 V), four ordered control groups, an enlarged DIP-8 with correct pin relationships, and front-readable physical instruments. Inverting and non-inverting circuits report single-input gain only with valid paired probes and an unclipped nonzero reference. Adder and difference circuits display their two-input weighted transfer instead of a generic Vout/Vin1 ratio. The general difference relation is Vout = −(R2/R1)Vin1 + (1 + R2/R1)R4/(R3 + R4)Vin2; equal inputs cancel only when the two resistor ratios match.

The dedicated Lab 7 desktop/mobile rebuild does not implement an XR entry, session or controller path. Physical touch hardware and headset behavior have not been tested. Neighboring labs retain their existing immersive controls. See the current [Lab 7 review record](docs/lab7-visual-correction.md) for model checks, visual review status and limitations.

See [module designs](docs/module-designs.md), [experiment checks](docs/experiment-checklist.md) and [verification](docs/verification.md).
