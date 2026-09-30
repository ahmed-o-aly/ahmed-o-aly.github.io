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

Email task: design an amplifier for a specified gain, then find how large the input can become before clipping. The bench needs adjustable resistors, signals, supply voltages and an oscilloscope.

The email refers to configurations in a lab handout that was not supplied. Inverting and non-inverting amplifiers are the current examples. These cover the requested activity, but their exact layout and values cannot be claimed to match that unseen handout.

The amplifier parts and lead routes are spaced apart. Separate physical GND sockets share one electrical ground, and the OUT sockets share one output node. This separates meter and scope tips without changing the circuit.

### Procedure

1. Start with an inverting amplifier and the assigned gain of −3. Choose input and feedback resistances and wire the circuit, including both supply rails.
2. Put scope CH1 at the input and CH2 at the output. Attach both ground clips to circuit GND. Set a useful timebase and voltage scale.
3. Apply a 100 Hz sine wave at 1 V peak using ±12 V supplies. Read the input and output traces and check the gain.
4. Increase input amplitude slowly. Find the last unclipped input and the first clipped input. Repeat at another supply voltage, then try the other amplifier configuration.

Using Rin = 10 kΩ and Rf = 30 kΩ gives ideal gain −3. This model has ±11 V output limits at ±12 V rails, so clipping starts above an input peak of 11/3 V, about 3.67 V. At 4 V peak input the ideal output would reach 12 V but the shown output is limited to 11 V in magnitude.

The scope traces follow their connected terminals. Moving a tip changes what is measured; disconnected or wrongly grounded channels report a problem. Dials adjust time/div and channel volts/div. Run/Hold keeps a capture, with a visible stale indication if the circuit changes while held. A graph cursor reads voltage at a chosen time. The meter's separate sample is explicitly taken at the input positive peak.

The amplifier model uses ideal gain with fixed 1 V output headroom. It does not model a particular chip, frequency response, slew rate, current limit, input common-mode limits or probe loading. Increasing frequency changes the period, not the ideal closed-loop gain.

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
