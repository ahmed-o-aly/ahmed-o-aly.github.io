# Circuits Lab v0.8

Four Electrical Circuits I experiments share a desktop 3D bench and an immersive WebXR lab. Students wire circuits, use instruments, change values and inspect live traces. Readings and written answers stay on paper.

[Works page](https://ahmed-o-aly.github.io/projects/circuits-lab/) · [Open the lab](https://ahmed-o-aly.github.io/circuits-lab/)

## Run and build

```sh
npm install
npm run dev
npm test
npm run build
```

Vite prints the local URL. The normal dev port is 5186; pass `-- --port 5187` if another copy is running. The build writes to `../assets/apps/circuits-lab/`. The site's Jekyll hook copies these files unchanged to `/circuits-lab/`. The published app needs HTTPS for headset access.

## Use the bench

- **Explore** starts with a wired circuit. **Build circuit** starts with loose connections. Each keeps its own wiring.
- Drag between contacts to connect a lead. Move a plug to change its connection. Drop it away from a contact to disconnect it. **Undo** restores the last change.
- Move the meter's V and COM tips to the two points being measured. The display reads V minus COM. Swapping the tips reverses its sign.
- Use the dials and switches on the equipment. The experiment control box is on the closer front-right ledge, with larger buttons and setting labels. Optional **Keyboard controls** expose the same settings.
- Read **Your experiment** and **Experiment steps** above the bench. The schematic is the target circuit, not an automatically redrawn diagram of the student's wiring.

In VR, grip a probe to hold it and release its tip near a contact to connect. A picked-up probe starts with its tip down; turn your wrist to aim it. Hold and turn a dial. The left stick moves, the right stick turns, and room-scale tracking lets you walk within your play area. Use the headset system menu to exit.

The scope or recorder sits within reach on the left ledge, with the large graph above it. The right display gives three labelled readings. Use the graph tabs to select a channel or quantity, then point and hold the trigger to inspect the trace. RC/RL plots share the same time and cursor; the small recorder also has Voltage, Current and Energy buttons. Graph and Schematic buttons switch the left display. Floating labels do not cover the equipment.

The amplifier parts and lead routes have more space. Separate GND sockets share one ground connection, and the OUT sockets share the same output. Meter and scope tips can connect without stacking on one socket.

## The four experiments

| Experiment                         | Student task                                                                          | Measurement view                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Thévenin, Norton and maximum power | Build equivalents, compare several loads, find maximum load power                     | The power sweep solves the current wiring. Drag along it to set the load and compare the meter readings.                   |
| Superposition                      | Deactivate each source in turn, combine signed currents, make one branch current zero | Linked source views solve the current wiring for A alone, B alone and both.                                                |
| Operational amplifiers             | Select resistors for a specified gain, find the largest input before clipping         | Two scope channels follow their actual probe contacts. Time and voltage scales affect the view. A cursor reads the traces. |
| RC and RL transients               | Predict the effect of resistance on response speed, then test both circuits           | Voltage, current and energy traces grow with elapsed circuit time. Pause, slow, replay and inspect the acquired trace.     |

There are no answer fields, submissions, grades or export forms.

## Model limits

DC resistor networks use a nodal solver with the actual leads. Invalid or floating networks produce diagnostics. Amplifier and transient circuits support the shown layouts, and need valid connections before producing traces.

The amplifier uses ideal feedback gain and output limits 1 V inside each supply rail. It does not model a specific chip's bandwidth, slew rate, loading or input limits. Scope channels have ideal impedance and share ground. The meter's amplifier voltage sample is taken at the input's positive peak; it is not an AC RMS reading.

RC uses 100 µF and RL uses 100 mH, with a 5 V source. Switching and resistance changes preserve capacitor voltage or inductor current. **New run** resets stored energy. Playback speed changes display speed, not the circuit time constant. Replay repeats the current switching segment.

The email's four learning tasks are covered. The op-amp handout was not supplied; inverting and non-inverting circuits are the current examples. Exact handout circuits and component values still need confirmation.

User headset feedback has guided the layout changes. Version 0.8 brings the scope and graph to the left, spaces out the amplifier and wire routes, and starts probe pickup tip-down. Its headset reach, clarity and frame rate still need confirmation on the intended device; the assistant has not operated a physical headset.

See [module designs](docs/module-designs.md), [experiment checks](docs/experiment-checklist.md) and [verification](docs/verification.md).
