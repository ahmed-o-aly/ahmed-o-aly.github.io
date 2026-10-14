# Electrical Circuits I: four lab experiments

The purpose of this lab is to let students carry out the experiments requested in the email. Students make connections, operate equipment and take readings. They use their own paper for predictions, calculations and answers.

The same circuit state drives desktop 3D and immersive VR. The app is at [Circuits Lab](https://ahmed-o-aly.github.io/circuits-lab/), linked from [Works](https://ahmed-o-aly.github.io/projects/circuits-lab/).

## How students work

**Explore** starts with the circuit connected. **Build circuit** starts with loose connections so students can build it. Switching between the two keeps separate wiring and preserves the chosen values. Clear removes leads and probe connections; Undo can restore them.

The bench is the working surface. Students use the actual instrument dials, switches, probe handles and cable plugs. The voltage meter has V and COM leads. Its reading is the difference between their contact voltages; the red and black insulation identifies the leads. These are objects to move, not required tool modes. The scope uses two signal tips and their ground clips.

Desktop: drag between terminals to wire, drag a probe to place it, and drag a dial to turn it. Drag empty space to change the view, and scroll to zoom. Keyboard controls are an optional way to operate the same equipment.

VR: grip a probe, move its tip to a contact, then release. Pickup starts tip-down; subsequent wrist turns aim the probe. Hold and turn a dial, and operate switches on the apparatus. Left stick moves and right stick turns. Physical movement within the play area remains tracked. Guide and lab selection are available in the room; students do not need a floating settings menu to do the experiment.

The experiment control box sits on the closer front-right ledge. Its larger buttons and setting labels keep the same circuit, source, amplifier and transient controls. Resistor names and values have larger displays.

The scope or recorder sits on the left ledge within reach, with the large graph above it. The right display shows three labelled readings. Graph tabs select one scope channel or transient quantity at a time. Point and hold the trigger to inspect a trace. Transient tabs retain the same acquired time and cursor; the small recorder has Voltage, Current and Energy buttons too. The Graph and Schematic buttons switch the left display, and floating labels do not cover the apparatus.

The reference schematic shows the assigned layout and selected values. It does not redraw itself from arbitrary student wires. The electrical solver and instrument readings use the actual connections.

## Experiment 5: Thévenin, Norton and maximum power transfer

Email task: create an equivalent circuit, verify it under several loads, and find the load that receives maximum power. Students must be able to switch among original, Thévenin and Norton circuits while watching load voltage, current and power.

### Equipment and example circuit

A 12 V source feeds a 1 kΩ series resistor. A second 1 kΩ resistor goes from the output node to common. The adjustable load connects across those output terminals.

The equivalent source values are 6 V with 500 Ω in series, or 12 mA with 500 Ω in parallel. These are instructor check values; students calculate them on paper and set the equipment themselves.

### Procedure

1. Wire the original circuit. Put the voltage probes across the load. Read voltage, branch current and load power at 250, 500 and 1000 Ω.
2. Change to the Thévenin circuit. Set its source and resistance, wire it, and repeat the same loads.
3. Repeat with the Norton circuit. Compare the three sets of readings on paper.
4. Turn the load dial and find the highest delivered power. Inspect the power graph and confirm the peak using the circuit readings.

| Load   | Voltage | Current | Power |
| ------ | ------- | ------- | ----- |
| 250 Ω  | 2 V     | 8 mA    | 16 mW |
| 500 Ω  | 3 V     | 6 mA    | 18 mW |
| 1000 Ω | 4 V     | 4 mA    | 16 mW |

The graph is labelled **Calculated sweep · current wiring**. Each point comes from solving that same wired circuit with a different load. It is not a stored correct-answer curve. The marker follows the current load, and dragging along the graph sets that load. Invalid wiring suppresses the sweep. Maximum power and maximum efficiency are different conditions.

## Experiment 6: Superposition

Email task: explain how two active sources can produce zero current in a particular branch. The module must show each independent source's contribution and the complete circuit, let students deactivate sources, and combine signed results.

### Equipment and example circuit

Sources A and B connect through separate 1 kΩ resistors to a common node. A third 1 kΩ load goes from that node to common. Start A at +6 V and B at −3 V. Positive branch current is defined from the common node down through the load.

### Procedure

1. Build the two-source circuit and measure the load branch current with both sources on.
2. Leave A on and deactivate B by shorting the ideal voltage source. Read A's signed contribution.
3. Leave B on and deactivate A with a short. Read B's signed contribution.
4. Add the two signed currents on paper and compare with both sources active. Then adjust B until the branch current is zero while both sources remain on.

At +6 V and −3 V, the contributions are +2 mA and −1 mA; together they give +1 mA. At +6 V and −6 V, they are +2 mA and −2 mA, giving zero in the load branch. Other branches still carry current.

The three linked views are solved from the student's wiring and source values. Selecting a view changes the active source case on the bench. An open-circuit replacement can also be tried, but is labelled as the wrong way to deactivate an ideal voltage source. Power contributions are not added.

## Experiment 7: Operational amplifiers

Nishar’s supplied design review calls for a realistic 3D laboratory with the sequence **Select → Build → Adjust → Measure → Understand**. The four visible control groups are **Power Supply**, **Operational Amplifier**, **Component Controls**, and **Input Signal**. The schematic stays a reference for the selected arrangement; readings follow the actual valid connections.

One dual supply exposes +V, GND and −V and selects ±8, ±12 or ±15 V. The labelled U1–741 component shows 2 (−IN), 3 (+IN), 4 (−V), 6 (Vout) and 7 (+V). Unused pins 1, 5 and 8 are excluded from the connection exercise. The device is a representative DIP-8 ideal teaching approximation. The 1 V output headroom is an educational limit, not a 741 datasheet specification. Bandwidth, slew rate, loading, offsets and input common-mode limits are omitted.

| Configuration | Resistor arrangement                                                                           | Linear relationship           |
| ------------- | ---------------------------------------------------------------------------------------------- | ----------------------------- |
| Inverting     | Rin from Vin to pin 2; Rf from pin 6 to pin 2; pin 3 grounded                                  | Vout = −(Rf/Rin) Vin          |
| Non-inverting | Rin serves as Rg from pin 2 to GND; Rf from pin 6 to pin 2; Vin to pin 3                       | Vout = (1 + Rf/Rg) Vin        |
| Adder         | R1 = R2 = Rin; each input feeds pin 2 through its own resistor; Rf is feedback; pin 3 grounded | Vout = −(Rf/Rin)(Vin1 + Vin2) |
| Subtractor    | R1 = R3 = Rin; R2 = R4 = Rf; Vin1 feeds pin 2, Vin2 feeds pin 3’s divider                      | Vout = (Rf/Rin)(Vin2 − Vin1)  |

Rin and Rf have linked numeric, slider and physical knob controls. All three/four resistors appear on two-input circuits; matched pairs change together. Vin2 is disclosed only in those modes. AC inputs share frequency and waveform; a signed Vin2 amplitude reverses polarity. This intentionally supports equal-input/matched-pair circuits rather than arbitrary independent ratios.

### Procedure

1. Select supply and configuration. Build starts a separate empty circuit for each configuration; Explore starts connected.
2. Follow the next highlighted connection. Guidance checks actual electrical nets, including power and feedback, rather than counting clicks. Wrong extra leads must be removed.
3. Review resistances and input settings, then confirm them. DC uses signed volts; sine, square and triangle use peak volts with zero offset. Frequency is disabled in DC.
4. Place the meter V tip at Vout, COM at GND, CH1 at Vin/Vin1, CH2 at Vout, and both scope ground clips at GND. Guidance can place one lead or probe at a time. Manual dragging and keyboard connections remain available.
5. Compare theoretical and measured gain. Increase amplitude until clipping; reduce it to recover. Keep calculations and observations on paper.

The meter’s physical AC display is labelled as a sample at the input’s positive peak. The adjacent measured-response panel separately reports DC mean, AC-component RMS, total RMS, absolute peak and Vpp from 2,048 midpoint samples across one period. DC has no AC component. Probe reversal changes the signed DC measurement. Scope channels keep their own selected terminals and grounds, timebase, vertical scale and Run/Hold state.

Single-input measured gain uses the grounded CH1/CH2 contacts. For adder/subtractor, the reference is the sum/difference of sampled input-node voltages; CH1 still shows Vin1 and CH2 shows Vout. AC gain magnitude is a Vpp ratio with covariance determining in-phase/inverted polarity. DC uses a signed ratio. Clipping, a stale held capture, invalid circuitry, disconnected/misplaced scope references or a zero/near-zero reference suppress measured linear gain. Theoretical gain remains available as a prediction.

Examples: Rin = 10 kΩ / Rf = 20 kΩ and 1 Vpp sine give −2 gain and 2 Vpp output (0.7071 Vrms); non-inverting gives +3 and 3 Vpp (1.0607 Vrms). DC adder inputs 0.2/0.3 V give −1 V. Matched subtractor inputs 0.2/0.7 V give +1 V. With Rin = 10 kΩ / Rf = 30 kΩ, ±12 V rails clip above 11/3 V peak input. The concept image’s trace heights and meter reading are not electrical acceptance values.

## Experiment 8: RC and RL transient response

Email task: predict how changing resistance changes response speed, then test that prediction in both circuits. The lab needs a timeline that pauses, slows and replays switching responses, with synchronized voltage/current graphs and stored-energy indicators.

### Equipment and procedure

Both circuits use a 5 V source and a switch that connects the source or a closed return loop. RC uses 100 µF; RL uses 100 mH.

1. On paper, predict the effect of increasing resistance in RC and in RL.
2. Build RC and start from zero stored energy. Operate the switch and run the response. Watch capacitor voltage, storage current and energy together.
3. Pause, slow or replay the run. Drag through the acquired trace to inspect all three quantities at the same instant. Change resistance, start from zero energy and compare at the same playback speed.
4. Repeat with RL. Switch both circuits to their return loops to inspect decay, then compare results with the predictions on paper.

For RC, τ = RC. At 1 kΩ, τ = 100 ms; capacitor voltage at τ is about 3.161 V. Increasing resistance makes RC slower.

For RL, τ = L/R. At 100 Ω, τ = 1 ms; inductor current at τ is about 31.606 mA. Increasing resistance makes RL faster but reduces its final current. Compare the same fraction of the final value, not the same absolute current threshold.

Traces grow only as circuit time advances. Voltage, current and energy share one time axis and cursor. Pausing freezes the run. Inspecting earlier acquired time preserves the trace already drawn. Replay repeats the current switching segment. Switching or changing resistance preserves the stored state; New run deliberately resets it.

Playback is slowed for inspection. At 1×, two real seconds represent the baseline time constant: 100 ms for RC and 1 ms for RL. That scale does not change when resistance changes. The time axis always shows circuit time.

## Verification and remaining limits

The DC solver uses the actual patch network. Amplifier and transient models support the shown layouts, rather than every possible circuit. Invalid wiring does not produce a valid measurement trace. Meters and components are ideal; no tolerance, parasitic effects or heat model is included.

Automated checks cover physics, signed contributions, changed wiring, probes, acquisition, cable moves, Undo and XR session handling. See the separate experiment checklist and verification record for completed checks. User headset feedback has guided the successive layout changes. Desktop inspection and mocked XR tests cannot confirm the revised headset reach, readability, comfort or performance; these still need confirmation on the target device.
