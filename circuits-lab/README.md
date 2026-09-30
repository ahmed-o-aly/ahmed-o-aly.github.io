# Electrical Circuits I — interactive 3D and VR lab

A teaching prototype covering all four requested experiments:

1. Thévenin, Norton and maximum power transfer.
2. Superposition.
3. Operational amplifiers.
4. RC and RL transient response.

The experience is built with Vite, Three.js and WebXR. Students work at a 3D bench, connect labelled terminals, change parameters and inspect live readings and graphs. They write measurements, calculations and answers on their paper worksheet. The same laboratory state supports the desktop and immersive interfaces.

The bench uses a procedural trainer board with green FR-4, resistors whose bands follow their selected values, a sleeved capacitor, a copper coil on a ferrite core, a generic DIP-8 op-amp, a metal toggle switch, source instrument cases and red/black leads. Parts are enlarged to make terminal selection easier. These are generic teaching packages, not a fabrication layout or a device-specific 741 model. No external models, textures or photographs are used in the scene.

## Website and headset access

[Works page](https://ahmed-o-aly.github.io/projects/circuits-lab/) · [Open Circuits Lab](https://ahmed-o-aly.github.io/circuits-lab/)

Open the direct lab link in a compatible headset browser and select **Enter VR**.
The Works page also has a full-screen launch link.

## Start locally

From this directory:

```sh
npm install
npm run dev
```

Open [the desktop lab](http://localhost:5186). The development server uses port 5186 and reports an error if it is occupied. For a production build and local preview:

```sh
npm run build
npm run preview
```

The preview is at [localhost:4186](http://localhost:4186). Run the automated checks with `npm test`.

## Use the laboratory

Choose a module and read its **Experiment** instructions; in VR these are under **Guide**. Use **Settings** to change values and **Help** for instructions. **Explore** starts with connected leads and instruments; **Build circuit** starts with empty connections so students can wire the circuit themselves. The app provides experiments and instrument controls. It has no student answer fields, answer submission, automatic grading or notebook/export interface.

Switching modes preserves the selected component values. Explore and Build circuit keep separate connections, and returning to Build circuit retains the student's work. **Clear circuit** removes its leads and instrument connections while keeping component values; Undo restores the cleared construction.

The **Schematic** tab shows the target circuit using standard electrical symbols for every variant. Its values follow the settings. It is a wiring reference, not a diagram generated from the student's actual leads. Use the bench, connection list and measurements to inspect the circuit actually built.

Select two terminals to add a patch lead. **Cancel** stops an unfinished connection; **Remove** selects a lead for removal; **Undo** restores the previous connection or probe placement. Choose the red or black probe tool, then select a terminal. Current readings come from a fixed branch/storage sensor; there is no separate ammeter to insert. Voltage probes give ideal instantaneous red-minus-black readings, not AC multimeter RMS or averaged measurements. In the op-amp module, **Voltage at cursor** samples one quarter-cycle, at t = 250/frequency ms (2.5 ms at 100 Hz); **Linear gain** is the nominal resistor-ratio gain, including when the output clips. Read the instruments and write the observations on paper.

| Module | Experiment and suggested paper work |
| --- | --- |
| Thévenin/Norton | Build the three representations, compare load voltage/current/power at 250, 500 and 1000 Ω, and calculate the maximum-power load. |
| Superposition | Operate each source case, compare the linked signed contributions, then adjust the sources to obtain branch-current cancellation. Add currents and explain the result on paper. |
| Op-amp | Build an amplifier, connect both scope channels, adjust the signal and rails, and observe gain and clipping. Calculate the input limit on paper. |
| RC/RL | Predict the effect of resistance on paper, then change it and compare synchronized voltage/current traces, time constants and stored energy. |

For superposition, use Short to deactivate an ideal voltage source and retain the displayed current sign. For RC/RL comparisons from zero energy, change resistance, select **New run**, then move or run the time cursor. **Go to 1 τ** provides a guided comparison; an instructor can ask students to calculate or read the time constant independently on paper. Wiring diagnostics describe circuit and instrument connections, not student grades.

The op-amp scope has separate CH1/CH2 signal and ground connections, V/div controls, time/div, CH1 trigger level/edge, Run/Hold and Autoscale. Connect CH1 to the input, CH2 to OUT and both grounds to GND. Autoscale fits two periods and voltage ranges; it preserves your trigger settings. Windows exceeding 20 periods are rejected to avoid misleading sampled traces. Hold preserves the displayed acquisition; changing the circuit while held marks that trace stale until Run resumes it.

## VR

Open the lab in a compatible headset's browser, choose a module and **Explore** or **Build circuit**, then select **Enter VR** and accept the browser's request. The application requests an immersive WebXR session so the headset presents the bench and its controls in 3D. Circuit connections and settings remain when you leave VR.

The visible headset status reports whether VR is available. The main button changes between **Enter VR**, **Opening VR…**, **Exit VR** and **Use a headset**, with an error/retry state if entry fails. **Open on a headset** opens setup instructions, **Check headset** checks availability again, and **Copy link** is offered when an HTTPS headset address is available. When the lab is embedded, **Open lab full screen** opens the lab directly in a separate tab.

The immersive interface uses controller rays and the trigger to select two bench terminals, remove leads, place voltage or scope probes and change settings. Controls are paginated in the VR panel, with a **Guide** for experiment instructions. The graph includes numerical axis ticks and a cursor marker. Numeric controls stop at their limits. Students complete the same experiments in VR and put their answers on paper.

The immersive scene places the trainer on a plain table with metal legs, a floor and a back wall. Select **Recenter** or click a standard controller thumbstick to bring the bench and side-by-side panels in front of your current position and heading. Floor tracking preserves your actual eye height; the fallback without floor tracking assumes 1.6 m. The panels stay in place until recentered. Exit restores the desktop camera and orbit controls.

WebXR requires a compatible browser and headset in a secure context. A desktop browser without immersive support can still run the 3D experience. See the [WebXR API requirements](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API).

The desktop's `http://localhost:5186` is suitable for local development. Visiting `http://<computer-LAN-address>:5186` from a headset may load the page, but network HTTP alone does not provide the secure origin required for immersive VR. For standalone headset use, use the published HTTPS link, or serve the built files in `../assets/apps/circuits-lab/` over trusted HTTPS. The published lab uses the website’s HTTPS address above.

When a public HTTPS deployment exists, set `VITE_HEADSET_URL` to its complete URL before starting Vite or building the app. The setup dialog will then display that address for copying. With no override, the dialog uses the current page URL if it is HTTPS. Setting this variable supplies a link; it does not publish the app or create a certificate.

If a Quest is already configured for USB debugging and Android platform tools are already available, an optional local route is `adb reverse tcp:5186 tcp:5186`, followed by opening `http://localhost:5186` in the headset browser while the development server runs. This requires an authorized device connection and has not been verified on a headset here. Without port forwarding, `localhost` on a headset refers to the headset itself, not the computer.

For interface QA only, append `?inspect-vr=1` to the desktop URL to reveal **Panel preview**. It operates the world-space controls on screen without starting a headset session and is hidden in the normal interface. There is no component grabbing, free placement, hand tracking or haptic instrument simulation. Actual controller behavior, headset performance and readability remain unverified until tested on the target hardware. A successful desktop build does not establish headset compatibility.

## Electrical model and scope

The component banks and learning circuits are intentionally bounded. The DC modules use modified nodal analysis to solve ideal independent sources and resistors connected by patch leads. The op-amp and transient modules validate prescribed topologies before accepting measurements from their teaching models. They do not implement arbitrary nonlinear or arbitrary transient networks.

Graphs distinguish reference analyses from valid-circuit responses. The DC power curve is a reference analysis; measurements and the load-power marker respond to actual wiring. Superposition calculates linked A-alone, B-alone and both-source views from the current leads and source values, while the selected case controls the bench readings. Opening an inactive voltage source displays the resulting values with a warning that they are not the correct superposition sum. Op-amp traces come from the selected scope terminals; invalid channels have no measured trace. RC/RL show synchronized voltage and current panels with one physical-time axis and an energy readout.

All supplied circuits and component values are proposed defaults pending the department's experiment handouts. The op-amp supports symmetric supply rails of ±5, ±9, ±12 or ±15 V and input frequencies of 10, 50, 100, 500 or 1000 Hz. Fixed 1 V headroom limits the output to ±(rail magnitude − 1) V. Its ideal gain is frequency-independent: device-specific bandwidth, slew rate, common-mode and loading behavior are omitted. The scope has ideal nonloading channels and common-ground validation; it does not simulate a physical oscilloscope's input loading, ADC or ground-short currents.

RC uses 100 μF, RL uses 100 mH, and both use a 5 V source. The transient model preserves stored state across switching and resistance changes; **New run** resets it to zero energy. Adjustable playback speed changes presentation time, not component values or the physical time constant. At 1×, two wall-clock seconds represent the baseline time constant (100 ms for RC; 1 ms for RL), independent of the currently selected resistance. Replay restarts the current switching segment, not an entire recorded session.

See [the complete module designs](docs/module-designs.md) for learning objectives, desktop and VR activities, suggested paper worksheets, numerical instructor answers and implementation boundaries.

## Visual references

The [De Lorenzo DC Fundamentals trainer](https://delorenzoglobal.com/wp-content/uploads/2024/04/DL-3155E01-DC-FUNDAMENTALS.pdf) and [PASCO AC/DC laboratory](https://www.pasco.com/products/lab-apparatus/electricity-and-magnetism/ac-dc-electronics-laboratory) informed the hardware direction. Their images and product designs are references, not imported assets or a claim of exact replication.

## Classroom readiness

This is a prototype, not an existing MetaHub resource or a validated replacement for the physical laboratory. The instructor should reconcile the activities with ELEN 221 materials, review the answer key and complete the tasks on the intended headset before classroom use. There is no LMS integration or automatic institutional grade submission.
