# Electrical Circuits I: four interactive laboratories

## Purpose and status

This design covers all four requested topics. Every module combines interactive desktop 3D exploration with a VR practical activity in which the student makes connections, changes settings, observes measurements and checks a result.

The circuits and numerical examples below are **proposed teaching defaults**. The department's experiment procedures, lecture materials, instrument models and grading rubric have not been supplied. These defaults should be reconciled with the ELEN 221 handouts before classroom deployment. They are original example designs, not a claim that MetaHub already owns corresponding modules.

This document distinguishes the full teaching design from the bounded prototype. The prototype uses a fixed component bank and selectable terminals; it is not a general electronic design package or an exact model of a particular commercial instrument. Desktop and VR share the same electrical state. The app is an experiment bench: students write predictions, calculations, measurements and answers on paper. It has no answer-entry forms, submissions, automatic grading or notebook/export interface. Sections headed **Paper worksheet** are suggested instructor tasks, not app checks. A headset acceptance test is still required.

## Shared student experience

1. **Predict on paper:** identify the measured quantity, its reference direction or polarity, and the expected result before running the experiment.
2. **Build:** connect the component terminals using patch leads. Keep a schematic available beside the 3D bench.
3. **Measure:** select an operating case, adjust values, place the voltage probes or connect the scope channels and inspect the graph or numerical readings. Branch/storage current comes from a fixed sensor; there is no separately inserted ammeter.
4. **Compare:** repeat with a changed load, source, gain or resistance. Write the measurements in a table on paper.
5. **Explain on paper:** account for signs, limiting values and the difference between the prediction and the observation. The instructor reviews the student's worksheet separately.

Desktop interaction supports orbiting and zooming the bench, selecting terminals, inspecting labels and operating the control panel. VR offers the corresponding laboratory actions through controller rays and paginated controls at a stationary bench. Select two terminals to patch a lead. Cancel clears an unfinished connection; Remove must be selected before disconnecting a lead; Undo restores the previous wiring or probe placement. The interaction is point-and-trigger; components cannot be grabbed or freely repositioned.

The VR **Guide** presents experiment instructions and read-only information. Controls operate the circuit and instruments, with numeric settings stopping at their minimum and maximum values. Normal VR entry starts an immersive WebXR session in a compatible headset. Open the HTTPS lab address in the headset browser, choose a module and mode, select **Enter VR** and accept the browser request. Leaving VR preserves the circuit and restores the desktop view. A visible availability message and **Open on a headset** setup dialog provide the current status, a repeat availability check and a copyable HTTPS link when one is configured or the page itself uses HTTPS.

Inside the headset, the circuit rests on a plain table with metal legs, a floor and a back wall. The bench and side-by-side instrument panels are positioned in front of the viewer on the first tracked frame. Select **Recenter** or click a standard controller thumbstick to place them in front again. Placement follows the viewer's horizontal position and heading, keeps the room upright and preserves floor-relative eye height. When floor tracking is unavailable, the local-space fallback assumes a 1.6 m eye height. Panels stay in place after recentering rather than following each head movement. Exit restores the desktop camera, orbit target and controls.

The desktop **Panel preview** is a QA tool exposed only by the `?inspect-vr=1` URL parameter. It uses the same world-space controls, graph and schematic for inspection without a headset session. The website route is `https://ahmed-o-aly.github.io/circuits-lab/`, with its Works page at `/projects/circuits-lab/`. The setup dialog uses that HTTPS page address. `VITE_HEADSET_URL` can supply the same address for a local preview, but does not deploy the app.

The desktop uses plain course titles and the labels **Settings**, **Experiment**, **Help** and **Schematic**; VR instructions are under **Guide**. The Schematic tab uses standard electrical symbols for all circuit variants and follows the selected parameter values. It depicts the target wiring, not the actual student netlist. An incorrect patch on the bench therefore does not redraw the reference schematic; the connection list, electrical readings and wiring diagnostics describe the constructed circuit.

The procedural trainer board uses green FR-4, banded resistors whose colors follow the selected values, a capacitor sleeve, a copper winding on a ferrite core, a generic DIP-8 op-amp, a metal toggle switch, source instrument cases and red/black patch leads. Parts and terminal spacing are intentionally enlarged for selection in 3D and VR. The board is not a fabrication layout, the packages are not dimensionally exact, and the op-amp package does not imply a specific 741 electrical model. All scene geometry and markings are generated locally; no external models, textures or photographs are incorporated. Hardware references are the [De Lorenzo DC Fundamentals board](https://delorenzoglobal.com/wp-content/uploads/2024/04/DL-3155E01-DC-FUNDAMENTALS.pdf) and [PASCO AC/DC laboratory](https://www.pasco.com/products/lab-apparatus/electricity-and-magnetism/ac-dc-electronics-laboratory), without claiming exact replication.

**Explore** starts each circuit representation connected, with instruments already placed. **Build circuit** starts with empty leads and probes so students can make the connections themselves. Switching modes preserves component values; each mode retains separate connections, and revisiting Build circuit preserves its construction. **Clear circuit** removes its current leads, voltage probes and scope connections without resetting values, and Undo can restore them. Reference diagrams remain available as guidance. Students compare the live measurements and document their reasoning on paper; the app does not award completion marks.

Graphs include reference analyses as well as valid-circuit responses. The DC power curve describes the reference network; numerical readings and the load-power marker come from the actual patch network. Superposition displays linked live source contributions. Op-amp scope traces require a valid circuit and connected channel terminals. RC/RL display voltage and current in separate panels sharing circuit time. Reference previews must be distinguished from readings of a correctly connected circuit. Desktop and VR graphs include numerical axes and cursor markers where applicable.

Measurement conventions must stay visible. Conventional current arrows represent the chosen reference direction, including negative readings; they must not be presented as a literal simulation of electron speed. Field and energy graphics are explanatory visualizations, not electromagnetic field solutions.

The voltage probes report ideal instantaneous node-voltage differences. In DC modules this is the steady DC value, and in the transient module it is the value at the displayed simulation time. The op-amp's **Voltage at cursor** is the instantaneous sample at one quarter-cycle: t = 250/frequency ms, or 2.5 ms at the default 100 Hz. This is the positive peak of the input sine. It is not an AC multimeter or an RMS measurement. Its **Linear gain** readout reports the nominal resistor-ratio gain and remains distinct from the measured, possibly clipped output peak.

Suggested rubric for the instructor's paper worksheet: circuit and measurement setup 25%; prediction and calculation 25%; written observations and comparison 30%; explanation of the result 20%. This assessment takes place outside the app. Use a measurement tolerance appropriate to the selected model. For ideal examples, 5% is a reasonable initial student cursor-reading tolerance; solver verification should be much tighter.

## 1. Thévenin, Norton and maximum power transfer

### Learning outcomes

Students identify a two-terminal network, determine its Thévenin and Norton parameters, verify terminal equivalence over several loads, and distinguish maximum load power from maximum efficiency. The basis of the experiment is terminal equivalence and resistive load matching, as described in the [Analog Devices laboratory reference](https://www.analog.com/en/resources/analog-dialogue/studentzone/studentzone-march-2018.html).

### Proposed circuit and instructor answer

Use a 12 V ideal source feeding a 1 kΩ resistor into terminal A. A second 1 kΩ resistor joins A to the common reference terminal B. The adjustable load joins A to B.

- Open-circuit voltage: `V_Th = 6 V`.
- Resistance seen at A–B with the independent voltage source shorted: `R_Th = 1 kΩ ∥ 1 kΩ = 500 Ω`.
- Norton source: `I_N = V_Th / R_Th = 12 mA`, directed from B toward A, in parallel with 500 Ω.
- Load relations: `I_L = 6 / (500 + R_L)`, `V_L = I_L × R_L`, and `P_L = I_L² × R_L`, with resistance in ohms.

| Load         | Load voltage | Load current | Load power |
| ------------ | -----------: | -----------: | ---------: |
| 250 Ω        |          2 V |         8 mA |      16 mW |
| 500 Ω        |          3 V |         6 mA |      18 mW |
| 1 kΩ         |          4 V |         4 mA |      16 mW |
| Open circuit |          6 V |         0 mA |       0 mW |

Maximum load power is 18 mW at 500 Ω. Terminal equivalence does not preserve every internal current or internal loss. In particular, the familiar 50% efficiency at a matched load applies to the simple Thévenin source-plus-series-resistor model; it is not automatically the efficiency of the original divider.

### Interactive 3D exploration

Show the original network, a Thévenin source/resistor pair and a Norton source/resistor pair with consistent A–B terminal labels. Students vary the load, compare readings and see a load-power curve. Exploration can reveal the correct equivalents; the paper task should require the student's own calculations and observed comparisons.

### VR practical activity

“Construct equivalent circuits that behave like the original at A–B. Demonstrate agreement for three different loads, then find the load that receives maximum power.”

Students connect the original circuit and measure its open-circuit voltage, deactivate the independent source for a resistance calculation, configure the equivalent representations, connect the same loads, and write the three comparisons on paper. A virtual short-circuit current observation may be an optional ideal-model exercise; it must not teach students to short an arbitrary real power supply.

### Instructor assessment on paper

Check the defined A–B port, correct source polarity, the equivalent values, agreement under three distinct loads, and a peak at the expected resistance. A single matching load is insufficient evidence of equivalence. Ask the student to explain why raising the load resistance indefinitely does not maximize load power.

### Paper worksheet

Calculate the equivalent parameters on paper, then build the original, Thévenin and Norton representations and set the corresponding values. Write the voltage, current and power for each representation at 250, 500 and 1000 Ω in a nine-row table. For every reading, put the red voltage probe at the load's upper terminal and the black probe at common. Identify the maximum-power load, explain the match and distinguish terminal equivalence from equal internal losses. The expected peak is 18 mW at 500 Ω.

### Implementation boundary

The DC engine solves the student's actual patch-lead network and diagnoses inconsistent or singular ideal networks. The load bank contains finite positive resistances; there is no dedicated open-circuit setting, ohmmeter, or original-source deactivation control for deriving resistance. Open-circuit and source-deactivation procedures above form the fuller instructor-led design. The supported activity focuses on constructing the equivalents and comparing finite loads; derivation belongs on the paper worksheet.

## 2. Superposition

### Learning outcomes

Students deactivate independent sources correctly, use a fixed signed reference, add voltage or current contributions, and explain cancellation in a branch despite nonzero currents elsewhere. Superposition concerns linear responses; power cannot be superposed directly. See the [MIT circuit analysis lecture](https://circuits.mit.edu/_static/S26/handouts/lec01b/slides.pdf).

### Proposed circuit and instructor answer

Connect a +6 V source to node A through 1 kΩ. Connect a negative source to A through another 1 kΩ. Connect a third 1 kΩ resistor from A to ground. Define the measured branch current downward through that third resistor. The prototype begins with the second source at −3 V; its control displays the positive magnitude while the bench label supplies the minus sign. The cancellation experiment sets that source to −6 V.

The required +6 V/−3 V baseline gives +1 V and +1 mA with both sources, +2 V and +2 mA with A alone, and −1 V and −1 mA with B alone. Correct deactivation shorts the inactive ideal voltage source.

At the final +6 V/−6 V cancellation setting:

| Active source case                                   | Node A voltage | Measured branch current |
| ---------------------------------------------------- | -------------: | ----------------------: |
| +6 V source only; other ideal voltage source shorted |           +2 V |                   +2 mA |
| −6 V source only; other ideal voltage source shorted |           −2 V |                   −2 mA |
| Both sources                                         |            0 V |                    0 mA |

With both sources active, 6 mA flows from the +6 V source through the two outer resistors toward the −6 V source. Thus zero current in the middle branch does not mean the entire network has no current. Each separate-source case dissipates 4 mW in the measured branch; the combined case dissipates 0 mW. Adding those two powers would give the wrong answer.

### Interactive 3D exploration

Provide linked full-circuit and contribution views with one polarity convention. Let students choose both sources, source 1 only and source 2 only. Display the signed contributions, their sum and the independently solved complete-circuit result. An inactive ideal voltage source must visibly become a short; an inactive independent ideal current source, if introduced in an extension, becomes an open circuit. Dependent sources would remain active and are outside this default exercise.

### VR practical activity

“Adjust the second source until the measured branch carries zero current while both sources are active. Prove the cancellation with two correctly configured single-source experiments.”

Students build the network, write an initial prediction on paper, configure each source case, check the reference direction, copy the contributions onto paper and restore both sources. They then change one resistance or source value and repeat to show that cancellation is a condition of this network, not a general property of two sources.

### Instructor assessment on paper

Require all three source cases, correct signs, correct source deactivation and agreement between the signed sum and the direct measurement. Reject a zero-current result caused by a disconnected measured branch. The explanation must identify the remaining current path and explain why branch power is calculated after combining the currents.

### Implementation boundary

The DC solver evaluates each source case using the actual patch leads and current source values. The linked A-alone, B-alone and both-source displays update live; they need no stored records or voltage probes because they are calculated views of those three cases. The selected source case still determines the bench's current numerical measurements. Opening an inactive voltage source deliberately changes the circuit: the displayed open-circuit results are accompanied by a warning that they do not form the proper superposition sum. A wiring mismatch is flagged, while solvable actual-network values remain visible. Resistances are fixed at 1 kΩ; varying a resistor is an instructor extension.

### Paper worksheet

Operate both sources, A alone and B alone at the +6 V/−3 V baseline, using Short for each inactive source in the single-source cases. That selector has no effect when both sources are active. Write +2 mA and −1 mA, add them with their signs and compare the sum with the +1 mA both-source reading.

Then adjust the second source until the middle-branch current is zero with both sources active: +6 V/−6 V is the intended example. Write the +2 mA, −2 mA and 0 mA readings at those settings. Explain on paper why the contributions cancel, why the outer branches still carry current and why the two individual powers cannot be added. Keep red at the measured branch's upper terminal and black at ground. Check that an apparent zero is not caused by an open branch.

## 3. Operational amplifiers

### Learning outcomes

Students build negative-feedback amplifiers, relate resistor ratios to gain, interpret waveform polarity and identify output clipping. The output range must be defined because an amplifier does not necessarily reach its supply rails. The [Analog Devices clipping FAQ](https://www.analog.com/en/resources/faqs/faq_output_clipping.html) is a device-level reference; the prototype's numerical limits below are explicit teaching assumptions.

### Proposed circuit and instructor answer

The default example and suggested worksheet use a 100 Hz sine input with zero DC offset, supply rails of ±12 V and a deliberately simplified output range of −11 V to +11 V. The 1 V headroom is a model setting, not a claim about a particular physical op-amp. Exploration also supports symmetric rails of ±5, ±9 and ±15 V and frequencies of 10, 50, 500 and 1000 Hz. For rail magnitude `V_S`, the model's output limits are `±(V_S − 1)` V.

- Inverting configuration: non-inverting input grounded, 10 kΩ from the signal source to the inverting input, and 20 kΩ feedback from output to inverting input. Linear gain is `−R_f / R_in = −2`.
- Non-inverting configuration: signal on the non-inverting input, 10 kΩ from inverting input to ground, and 20 kΩ feedback from output to inverting input. Linear gain is `1 + R_f / R_g = 3`.

| Configuration          | Input amplitude (peak) | Expected output before clipping | Input peak at ideal clipping boundary |
| ---------------------- | ---------------------: | ------------------------------: | ------------------------------------: |
| Inverting, gain −2     |                    1 V |              2 V peak, inverted |                                 5.5 V |
| Non-inverting, gain +3 |                    1 V |         3 V peak, same polarity |                      11/3 V ≈ 3.667 V |

The suggested worksheet uses a third case: **inverting gain −3**, obtained with 10 kΩ input resistance and 30 kΩ feedback. Its input limit is also 11/3 V peak. A 1 V peak input gives a clean 3 V peak output; 4 V peak produces an output clipped at ±11 V. The initial inverting exploration example has gain −2, so its feedback resistance must change for this comparison.

At exactly the boundary the peak touches the model limit; increasing amplitude above it produces clipped intervals. Clearly distinguish peak amplitude from peak-to-peak voltage. A clipped waveform must not continue to display the nominal resistor-ratio gain as a measured small-signal gain without qualification.

### Interactive 3D exploration

Show the op-amp's supply, input and output terminals with a synchronized schematic. Students choose the configuration, adjust the resistors, input amplitude, supply rails and input frequency, and connect scope channels to compare input and output traces. Each channel has a signal connection, common-ground reference and V/div setting. The scope also provides time/div, CH1 trigger level and rising/falling edge, Run/Hold and Autoscale. Its horizontal window spans ten time divisions and each channel displays eight voltage divisions. Changing rail magnitude changes the clipping threshold through the fixed 1 V headroom. Frequency changes the period while the ideal resistor-ratio gain remains unchanged; bandwidth and slew rate are outside the model.

### VR practical activity

“Build the requested amplifier, demonstrate its gain with a small signal, and measure the largest input amplitude that stays within the output range.”

Students patch the signal, reference, supplies and feedback path, select resistor values, compare the two waveforms, and sweep the amplitude through the onset of clipping. An optional fault case removes negative feedback or puts the signal on the wrong input. Students must diagnose the setup before collecting valid results.

### Instructor assessment on paper

Check topology and negative feedback before evaluating gain. Require correct gain sign, a small-signal measurement, a threshold estimate and an explanation tied to the selected supply/output limits. The gain display is the nominal resistor-ratio gain and is accompanied by a clipping indicator; it is not the ratio of clipped peaks.

### Paper worksheet

Set the rails to ±12 V and frequency to 100 Hz. Build the inverting amplifier, including both supply connections, with 10 kΩ input and 30 kΩ feedback. Connect CH1 to the input and CH2 to OUT, with both scope ground leads at GND. Choose readable V/div and time/div settings and a trigger crossing within the CH1 range. Autoscale fits the time and voltage ranges but preserves trigger settings. Display at least one complete period without cropping.

Sketch or describe the clean 1 V peak input case and the clipped 4 V peak input case on paper, including both waveform peaks and the phase relationship. Calculate the gain and the maximum input amplitude from the resistor ratio and output limits. The ideal input limit is 11/3 V ≈ 3.667 V peak; an actual 3.7 V peak input is slightly above that limit. Then change the supply rails and explain how the observed clipping level changes.

Hold preserves its acquisition. If settings change while held, the trace is marked stale; Run resumes the current waveform. Incorrect ground connections, missing trigger crossings or unreadable ranges produce instrument diagnostics. The app does not evaluate the worksheet.

### Implementation boundary

The bounded prototype validates the prescribed inverting or non-inverting topology before accepting measurements from the gain and clipping model. Scope traces are calculated from the connected nodes, not fixed input/output artwork; invalid channels have no measured points. Scope grounds must connect to circuit common. An incorrect ground receives a diagnostic rather than simulating the short-circuit current that a grounded physical scope could create. Channels have ideal input impedance and no ADC, noise, probe compensation or bandwidth model. Sample density increases with displayed periods; windows exceeding 20 periods are rejected instead of presenting a misleading aliased trace. Autoscale returns to a two-period window.

The amplifier model does not promise a general nonlinear solver, device-accurate open-loop behavior, common-mode limits, finite bandwidth, slew rate, output loading or saturation recovery. Instructor extensions can introduce a named device model after the handout is available.

## 4. RC and RL transient response

### Learning outcomes

Students relate a switching event to initial and final conditions, measure a time constant, distinguish capacitor-voltage continuity from inductor-current continuity, and predict the different effects of series resistance. The standard relations are `τ_RC = R × C` and `τ_RL = L / R_total`. See the [RC reference](https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits) and [RL reference](https://openstax.org/books/university-physics-volume-2/pages/14-4-rl-circuits).

### Proposed circuits and instructor answers

**RC:** a changeover drive selects +5 V or ground at node S. Connect S through 1 kΩ to the capacitor's upper terminal; connect 100 μF from that terminal to ground. The ground position discharges the capacitor through the same resistor. Start the charging example at zero capacitor voltage.

**RL:** a changeover drive selects +5 V or ground at S. Connect S through 100 Ω to node A, then through 100 mH to ground. The ground position forms a closed resistor/inductor decay loop. Start the rising-current example at zero current. The default model has zero inductor winding resistance; any later nonzero winding resistance belongs in `R_total`.

| Quantity                                             | RC default                | RL default                     |
| ---------------------------------------------------- | ------------------------- | ------------------------------ |
| Time constant                                        | 0.1 s                     | 1 ms                           |
| Rising state                                         | `v_C = 5[1 − exp(−t / 0.1)]` V | `i_L = 0.05[1 − exp(−t / 0.001)]` A |
| State at one time constant                           | 3.1606 V                  | 31.606 mA                      |
| Initial charging/rising current                      | 5 mA                      | 0 mA                           |
| Final state                                          | 5 V                       | 50 mA                          |
| State after five time constants                      | 4.9663 V                  | 49.663 mA                      |
| Final stored energy                                  | `½CV² = 1.25` mJ  | `½LI² = 0.125` mJ      |
| State one time constant into decay from steady state | 1.8394 V                  | 18.394 mA                      |

On discharge, RC current reverses relative to its charging reference. In the RL decay loop, current initially keeps its direction while the inductor voltage reverses. After five time constants the state is approximately 99.33% of its step change, not mathematically equal to its final value.

### Interactive 3D exploration

Connect the schematic, component view, synchronized voltage/current panels, time cursor and energy readout. Both RC and RL display storage voltage in volts and storage current in milliamps on a shared physical-time axis. The user-placed voltmeter separately measures the selected terminal difference. Run/pause, adjustable playback speed, segment replay and one-τ/five-τ cursor actions control the presentation. A field-between-plates view and coil-field view are possible teaching extensions, not features of the present component models. Such animations should not suggest charge crossing the capacitor's dielectric.

Show both normalized responses and physical units when comparing resistance. Increasing series resistance slows the RC voltage response. It reduces the RL time constant and its final current. The initial RL slope `di/dt = V / L` is unchanged by resistance when starting from zero current, so “faster” means reaching a given fraction of the new final value sooner.

### VR practical activity

“Measure the initial time constant in each circuit. Change only the resistance so that each time constant is halved. Predict the new final state and verify both results.”

Students wire the selected circuit, place probes, choose the drive/decay state, capture a transient and measure the time to 63.2% of its step change or 36.8% of its decay. They then choose new resistances and repeat:

- RC: change 1 kΩ to 500 Ω; `τ = 50` ms, final voltage remains 5 V and final stored energy remains 1.25 mJ.
- RL: change 100 Ω to 200 Ω; `τ = 0.5` ms, final current becomes 25 mA and final stored energy becomes 0.03125 mJ.

In the prototype, place red at the storage element's upper terminal and black at ground. The voltmeter reads capacitor voltage in RC mode or inductor voltage in RL mode; current comes from a fixed sensor with a top-to-ground reference. For the proposed physical-lab extension using a grounded two-channel scope, both ground clips join circuit ground. In the RL layout, measuring S and A and subtracting gives the resistor voltage, so `i_L = (V_S − V_A) / R`. Do not imply that ordinary scope ground clips are isolated differential terminals. The prototype's voltage probes are an ideal nonloading voltmeter and do not reproduce oscilloscope ground connections.

### Instructor assessment on paper

Require a prediction before the change, measured original and revised time constants, the correct opposite resistance changes, and an explanation of the changed RL final current. Evaluate response relative to its own initial and final values, especially when a switch is operated before settling. Include one check of continuity across a switching event.

### Paper worksheet

Before testing, write what will happen to the time to approach the final value **when resistance increases**: RC becomes slower; RL becomes faster relative to its new final current. Explain the prediction using each time-constant formula, then compare it with the live traces. There is no prediction field or lock in the app.

Write four source-connected observations from zero initial stored energy at one τ: RC at 1 kΩ and 500 Ω, then RL at 100 Ω and 200 Ω. Halving τ requires decreasing RC resistance but increasing RL resistance. After changing resistance, use **New run**, followed by **Go to 1 τ**, and copy voltage, current, time and energy onto paper. The corresponding VR controls reset energy and position the cursor. For an independent graph-reading exercise, use the time cursor without the one-τ shortcut.

Finally operate the source/return switch during a response. Describe which state remains continuous, which measured quantity changes sign and why the RL final current changes when its resistance changes. The instructor assesses the paper work.

### Switching, replay and numerical requirements

- The RL drive control represents an ideal instantaneous changeover with a defined closed decay loop. It must never erase current when switched off. A real switching-device extension would need its freewheel/protection path and switching behavior modelled explicitly.
- Preserve capacitor voltage and inductor current at switching events. For each constant-topology segment use `x(t) = x_final + [x(t₀) − x_final] × exp[−(t − t₀) / τ]`.
- A resistance change may start a new segment with the prior state retained. Changing capacitance or inductance should start a clearly labelled new experiment unless an appropriate parameter-change model is implemented.
- Playback speed changes only the presentation clock. At 1×, two wall-clock seconds represent the baseline time constant: 100 ms in RC mode or 1 ms in RL mode. This mapping stays fixed when resistance changes, allowing response-speed comparisons. The plots and cursors report circuit time. Replay recomputes the current switching segment from its stored initial condition, not a complete history of all switches.
- The bounded prototype uses an analytical first-order model after validating the required topology. Unsupported wiring returns a diagnostic. A preview graph is explicitly labelled as a reference response until the required circuit is connected; it cannot count as a valid measurement.

## Prototype architecture and delivery boundaries

The implementation uses Vite, Three.js and WebXR. Its surfaces are module controls, terminal-to-terminal patch leads, live instruments, graphs, experiment instructions and wiring diagnostics. A DC modified-nodal-analysis engine handles resistive networks with ideal independent sources; op-amp and transient activities validate supported circuit topologies before using their teaching models. Parameter banks are bounded. Current readings use fixed ideal sensors; the movable voltage probes neither load the circuit nor insert a current meter. Answer writing and assessment take place on paper.

The following are outside this prototype's scope: LMS integration, an institution's authentication or gradebook, arbitrary component creation, a SPICE-level device library, haptic feedback, a physical breadboard's parasitic behavior, and certified replication of a specific oscilloscope or multimeter. Controller operation and text legibility require validation on the target headset. The browser preview cannot establish those results.

Before teaching use, reconcile the defaults with the handouts and confirm the topology, component values, op-amp configuration/model, source conventions and permitted instruments for each experiment. Have an instructor complete each experiment and decide how the visible reference diagrams, exploration examples and one-τ controls fit the paper worksheet. Verify that a learner can finish every required action in VR. Confirm how the paper observations, calculations and explanations will be assessed. Scheduling is intentionally outside this design.
