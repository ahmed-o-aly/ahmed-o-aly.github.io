# Electrical Circuits I: four lab experiments

The purpose of this lab is to let students carry out the experiments requested in the email. Students make connections, operate equipment and take readings. They use their own paper for predictions, calculations and answers.

The established Labs 5, 6 and 8 share circuit state between desktop 3D and immersive VR; the dedicated Lab 7 manual app supports desktop and phone presentation without an immersive entry. The app is at [Circuits Lab](https://ahmed-o-aly.github.io/circuits-lab/), linked from [Works](https://ahmed-o-aly.github.io/projects/circuits-lab/).

## How students work

In Labs 5, 6 and 8, **Explore** starts with the circuit connected. **Build circuit** starts with loose connections so students can build it. Switching between the two keeps separate wiring and preserves the chosen values. Clear removes leads and probe connections; Undo can restore them.

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

The Lab 7 rebuild has one live manual experiment. It follows the supplied report's four control groups: **Power Supply**, **Operational Amplifier**, **Component Controls**, and **Input Signal**. The inverting slice passed its internal visual gate; all four configurations are now exposed and undergoing final browser review.

Selecting an arrangement places the parts with the dual supply off and no electrical leads or probes attached. There are no separate Build and Explore circuits. Students choose the From and To terminals and press Connect, or drag directly between the labeled terminals. Incorrect leads remain connected and receive diagnostics; the app does not repair them. Selecting a lead highlights its endpoints and offers Remove. Undo restores electrical changes, including reset and configuration changes, as single actions.

Hints observe the actual netlist and measurement contacts. Another hint changes only the suggestion. Neither action changes wires, parameters, supply state or probes. Students can wire, adjust and connect instruments in any order. Completing the circuit does not connect the instruments automatically.

The white teaching breadboard carries physical knobs for each resistor role, an enlarged DIP-8 package with actual top-view pin order, and isolated labeled contacts. Pins 1 and 5 are offset-null terminals, and pin 8 is NC; these unused pins are excluded from the connection exercise. Mounting holes have no internal electrical connectivity. The visibly labeled GND common rail exposes several sockets for the same declared node, allowing short local return and probe connections.

The single dual supply selects ±8 V, ±12 V or ±15 V. The physical resistor knobs and precise numeric fields share the same independent values; the single-input layouts also provide sliders. Inverting theory is Vout = −(Rf/Rin) Vin; non-inverting theory is Vout = (1 + Rf/Rg) Vin. The weighted adder exposes Rin1, Rin2 and Rf. The difference amplifier exposes independent R1–R4, with Vout = −(R2/R1)Vin1 + (1 + R2/R1)R4/(R3 + R4)Vin2. An explicit Match R4 action changes only R4 to R3 × R2 / R1 and can be undone. Two-input configurations show both transfer coefficients rather than a generic Vout/Vin1 gain. Their amplitudes are independent while waveform, frequency and phase are shared. AC input amplitude is consistently peak-to-peak (Vpp); DC uses signed volts and disables frequency. The waveform model receives the corresponding peak amplitude internally.

The meter reads only its actual V and COM contacts. It reports total RMS for AC and signed voltage for DC. The oscilloscope's two traces, labeled by their actual probe targets, share one time grid and voltage scale, and require independently connected signal tips and ground clips. Missing or misplaced probes remain missing or misplaced. Scope Hold retains its samples, marks them stale after relevant circuit/settings changes, and never freezes the independent multimeter.

Sample statistics provide DC mean, AC-component RMS, total RMS, absolute peak and Vpp. Single-input measured gain uses the actual paired CH1/CH2 samples. AC gain magnitude is a Vpp ratio with covariance determining polarity; DC uses a signed ratio. Clipping, invalid circuits, missing scope references and zero input suppress measured linear gain. At Rin 10 kΩ, Rf 20 kΩ and 1 Vpp sine, the expected inverting result is −2 V/V, 2 Vpp and 0.7071 Vrms. The concept illustration's voltages and waveform heights are not electrical acceptance values.

The 741 remains an ideal teaching model with 1 V educational output headroom. Bandwidth, slew rate, loading, offsets and input common-mode limits are omitted. The dedicated app supports desktop and phone presentation, with a shared-time dual-channel plot in phone Measure. It does not implement an XR entry, session or controller path. Physical touch and headset hardware behavior remain untested. Ideal source terminals are measurable before amplifier completion; other incomplete networks are not solved, and conflicting source constraints invalidate the affected source component.

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
