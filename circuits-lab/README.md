# Circuits Lab

Two Electrical Circuits I experiments, each a standing lab bench with a breadboard trainer and its instruments, on desktop or in WebXR. Students wire the circuit hole to hole, power it and measure it. Readings and written answers stay on paper.

[Works page](https://ahmed-o-aly.github.io/projects/circuits-lab/) · [Open the lab](https://ahmed-o-aly.github.io/circuits-lab/)

| Page                        | Lab                                   | Source                              |
| --------------------------- | ------------------------------------- | ----------------------------------- |
| `/circuits-lab/`            | Front page listing both labs          | `index.html`, `home.js`, `home.css` |
| `/circuits-lab/lab7-bench/` | Lab 07 · operational amplifiers       | `lab7-bench/`                       |
| `/circuits-lab/lab8/`       | Lab 08 · RC and RL transient response | `lab8/`                             |

## Run and build

```sh
npm install
npm run dev
npm test
npm run build
```

The dev server uses port 5186 (the repository's `.claude/launch.json` runs it on 5196). The build writes to `../assets/apps/circuits-lab/`, and the site's Jekyll hook copies those files unchanged to `/circuits-lab/`. Headset access needs HTTPS.

`public/previews/` holds the front page's captures of each bench; retake them when a bench changes noticeably.

## Lab 07 · operational amplifiers

A portrait breadboard with a notch-up 741, +V/GND/−V rails on both sides and GND terminals beside VIN and VOUT. The circuit dial selects inverting, non-inverting, summing or difference amplifiers. As in the Circuits 1 course, every circuit is measured with the multimeter on DC inputs; the generator's VIN 1/VIN 2 selector sets each input's waveform, level and frequency, and the scope stays on the bench unused.

`lab7-bench/circuit.js` owns the nets, parts, configurations, guided steps and the ideal op-amp solver with rail clipping. `layout.js` places every contact, `routing.js` routes wires square around the chip and parts, `kit.js` holds the physical parts shared with Lab 08, and `main.js` builds the bench and its desktop and VR interaction.

## Lab 08 · RC and RL transient response

S1 charges and discharges the circuit from the DC supply (the manual's 1 kΩ with 100 µF, or 100 Ω with 100 mH), or the generator drives it with a square wave in the kHz range (τ ≈ 100 µs at 1 kHz). R, C and L are rotary dials with live values. The RL circuit has a fixed 1 Ω sense resistor Rs between L and ground, and VOUT is taken across it, so CH2 reads the inductor current at 1 V per ampere and τ = L / (R + Rs). The scope reads only once its ground lead is on ground: CH1 and CH2 are probes, CH3 is the math channel ((CH1 − CH2)/R in RC, CH2/Rs in RL), each channel has ON and POS controls, and CURSOR gives time and voltage cursors beside the automatic 63.2% marks.

`lab8/circuit.js` owns the nets, S1, the values, guided steps and an exact first-order solver: with the sources held still the wired network is linear, so the stored quantity follows dx/dt = a·x + b exactly. `main.js` was derived from Lab 07's and shares its wiring and VR design.

## Both benches

Click two holes to lay a wire; it routes itself and takes a colour for what it carries. Click a wire for its colour wheel, re-route or delete; drag its ends or bead. Leads go into a post or straight into a hole, and probes clip onto any contact. Every ground point on the trainer is connected internally. An unlabelled white button on the trainer's right-hand edge builds the selected circuit complete for the instructor.

In VR, a trigger tap selects and a press-and-drag lays a wire; the selected wire's palette opens above the other controller. The grip reaches from the pointer bead to catch knobs, plugs and wire ends, with a green halo on its target.

`tests/` checks both circuits against the lab manual's values, the guided steps and that every guided wire routes cleanly. Physical headset verification is pending.
