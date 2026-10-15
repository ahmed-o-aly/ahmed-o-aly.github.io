# Four experiment checks

The application provides the circuit work, instruments and graphs. Students put calculations, predictions, explanations and readings on paper. Explore opens connected examples; Build circuit preserves chosen values and starts a separate empty set of patch leads. Each circuit variant has its own saved leads.

These numerical checks use the ideal models and the shown circuit diagrams. They are reproducible electrical checks, not a claim that physical headset interaction has been validated. Confirm headset handling on the intended hardware. Lab 7 now follows Nishar’s supplied design review, using the explicitly documented ideal 741 approximation.

## 5 — Thévenin, Norton and maximum power transfer

**Email activity:** Create an equivalent circuit, verify it under several loads, and find the load receiving maximum power.

1. Connect the original 12 V divider with R₁ = R₂ = 1 kΩ. Place the meter V tip at the load top and COM at ground.
2. Compare 250, 500 and 1000 Ω loads. Read voltage, fixed branch current and power.
3. Select Thévenin: set Vth = 6 V and Rth = 500 Ω. Select Norton: set In = 12 mA upward and Rn = 500 Ω. In Build circuit, connect each version and repeat the same loads.
4. Turn the load control or drag the load-power graph. Check the greatest power against neighbouring loads.

| Load   | Voltage | Current | Power |
| ------ | ------- | ------- | ----- |
| 250 Ω  | 2 V     | 8 mA    | 16 mW |
| 500 Ω  | 3 V     | 6 mA    | 18 mW |
| 1000 Ω | 4 V     | 4 mA    | 16 mW |

All three correct representations give these readings. Maximum power occurs at 500 Ω. The curve is a **calculated sweep of the current wiring**, not a set of readings already taken. Incorrect equivalent values and solvable wiring changes must change the curve and readings. Unsolved wiring must not display the correct reference curve.

## 6 — Superposition

**Email activity:** Deactivate sources, combine signed contributions, and explain zero current in a branch with two active sources.

1. Connect the shown network: all three resistors are 1 kΩ; source A is +6 V and source B is −3 V relative to ground.
2. Select Both, A alone and B alone. Keep the inactive ideal voltage source set to Short.
3. Compare the linked signed-current views. Positive branch current flows from the central node through the vertical resistor to ground.
4. Activate both sources and increase B's magnitude to 6 V. Explain the cancellation on paper. Place the voltmeter across a side resistor and use its voltage drop to check that current still flows elsewhere.

| Source state | Branch voltage | Signed branch current | Branch power |
| ------------ | -------------- | --------------------- | ------------ |
| A alone      | +2 V           | +2 mA                 | 4 mW         |
| B alone      | −1 V           | −1 mA                 | 1 mW         |
| Both         | +1 V           | +1 mA                 | 1 mW         |

Currents add; powers do not. At +6 V / −6 V the contributions are +2 mA and −2 mA, giving zero branch current. Each side resistor still carries 6 mA toward the negative source. The linked views solve the current leads independently for each source state. Choosing Open deliberately changes those circuits and shows a warning; it is not correct voltage-source deactivation.

## 7 — Operational amplifiers

**Email activity:** Design a specified gain and determine the input limit before clipping, using adjustable resistors, signals, supply voltages and an oscilloscope.

1. For an inverting example, choose Rin = 10 kΩ and Rf = 30 kΩ for gain −3. Manually connect input, feedback, ground and both supply rails, then switch on ±12 V.
2. Set a 100 Hz sine at 2 Vpp. Place CH1 at Vin and CH2 at Vout, with both ground clips at the common rail. The shared grid should show 6 Vpp inverted output. Attach the meter across Vout/GND for 2.1213 Vrms.
3. Test scope Hold/Run. Changing Rf while held must mark the capture stale; the independently connected meter remains live. Remove one channel ground: that channel disappears while the other valid channel retains its trace and statistics.
4. Raise input amplitude: 7.2 Vpp gives 21.6 Vpp output; 7.4 Vpp demands 22.2 Vpp and clips at ±11 V. Change the supply rails and repeat. The linear input limit is 22/3 ≈ 7.333 Vpp at ±12 V, or 14/3 ≈ 4.667 Vpp at ±8 V.
5. Switch to non-inverting. The new arrangement must be empty with supply off; one Undo restores the previous experiment. Manually complete Rg = 10 kΩ and Rf = 20 kΩ. A 1 Vpp sine gives +3 gain, 3 Vpp output and 1.0607 Vrms.

For the weighted adder, use Rin1 = 10 kΩ, Rin2 = 40 kΩ and Rf = 20 kΩ. Signed DC inputs 0.2 V and 0.4 V produce −0.6 V. Change only Rin1 to 20 kΩ: output becomes −0.4 V while Rin2 and Vin2 remain unchanged. For the general difference amplifier, use R1/R2/R3/R4 = 10/20/30/10 kΩ and DC Vin1/Vin2 = 0.2/0.8 V. Output and both input pins are +0.2 V. Explicit Match R4 sets R4 to 60 kΩ; Undo restores only that action. Two-input configurations display weighted transfer coefficients rather than a single Vout/Vin1 gain.

Each configuration requires manually placed leads and probes. Hints, Another hint and phone presentation changes must preserve electrical state and history. Verify wrong leads remain wrong, resistor ends can be reversed, disconnected probes remain missing, and reset/configuration changes undo atomically. At 1 Vpp, sine/square/triangle source RMS is 0.35355/0.5/0.28868 V. DC uses signed volts and frequency is inactive. Incorrect grounds suppress their scope channel. Conflicting ideal sources must not produce plausible samples at zero crossings. The ideal 741 model reserves 1 V rail headroom and omits bandwidth, slew rate and loading.

## 8 — RC and RL transient response

**Email activity:** Predict how changing R affects response speed, then test both circuits with pause, slow playback, replay, voltage/current graphs and stored energy.

1. On paper, predict the effect of increasing R. Connect RC with 5 V, R = 1 kΩ and C = 100 μF. Select New run, then Run.
2. Pause, change playback speed, replay, and drag through the acquired trace. Voltage, current and stored-energy readings must refer to the same physical time. The graph does not draw an unacquired future response.
3. Increase R to 2 kΩ, select New run, and compare at the same playback speed. Compare the time to reach the same fraction of the final value.
4. Repeat with RL using 5 V, R = 100 Ω and L = 100 mH, then R = 200 Ω. Switch each circuit to Return to observe decay through the closed loop.

| Check                              | RC, 1 kΩ / 100 μF   | RL, 100 Ω / 100 mH                                   |
| ---------------------------------- | ------------------- | ---------------------------------------------------- |
| Time constant                      | 100 ms              | 1 ms                                                 |
| At one time constant               | 3.1606 V, 1.8394 mA | 31.606 mA, 1.8394 V                                  |
| Stored energy at one time constant | 0.49947 mJ          | 0.049947 mJ                                          |
| Final stored energy                | 1.25 mJ             | 0.125 mJ                                             |
| Doubling R                         | τ = 200 ms: slower  | τ = 0.5 ms: faster relative to the new final current |

Increasing RL resistance also reduces final current from 50 mA to 25 mA; compare normalized progress, not equal absolute currents. On switching, capacitor voltage and inductor current remain continuous. RC return current and RL return voltage reverse sign. Changing R or switching starts a new trace segment from the preserved stored state. Replay restarts that segment; New run resets energy to zero.

## Interaction checks before class

- Drag a lead between contacts; move an existing end; drop it away to disconnect; use Undo to restore the previous connection.
- Place and swap the V and COM tips: only their circuit contacts determine voltage polarity. The branch current is a fixed sensor, not a multimeter connected in series.
- Turn equipment controls and check the same values through the keyboard controls. Test graph arrows and Home/End without a mouse.
- In the target headset, separately check gripping, contact placement, dial motion, locomotion, recentering and exit. Automated XR lifecycle tests do not establish those physical interaction results.
