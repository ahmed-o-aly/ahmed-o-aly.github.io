---
layout: page
metahub: circuits-lab
title: Circuits Lab
permalink: /projects/circuits-lab/
description: Two breadboard lab benches, in the browser and in VR, for the operational-amplifier and RC/RL transient experiments of Electrical Circuits I.
importance: 6
work_number: 7
category: interactive teaching
thread: immersive-tools
interactive:
  url: https://ahmed-o-aly.github.io/circuits-lab/
  embed_mobile: false
  title: Circuits Lab interactive breadboard benches
  heading: Use the lab benches
  description: Choose a lab, wire the circuit on the breadboard, and read the instruments.
  launch_label: Open Circuits Lab full screen
  note: For VR, open a lab full screen in a compatible headset browser and select Enter VR.
---

I built Circuits Lab with the course instructor for two Electrical Circuits I experiments: operational amplifiers, and RC/RL transient response. Each is a standing lab bench with a breadboard trainer leaning toward the student, and the supply, generator and instruments within reach.

Students wire the circuit themselves. A click on two breadboard holes lays a wire, which routes itself and takes a colour for what it carries; clicking a wire recolours, re-routes or deletes it. Instrument leads go into a post or straight into a hole, and probes clip onto any contact. A guide on the trainer's console follows the build step by step and compares the measurement with theory. Students write their readings, calculations, and answers on paper; the app is for doing the experiments.

In the operational amplifiers lab, a 741 is wired as an inverting, non-inverting, summing or difference amplifier and measured with the multimeter on DC inputs, as the course does. In the transient lab, S1 charges and discharges an RC or RL circuit from the supply, or the generator drives it with a kHz square wave; R, C and L are dials, the RL circuit's current is read across a 1 Ω sense resistor, and the oscilloscope has a ground lead, a math channel for the current, per-channel position controls and time and voltage cursors for measuring τ.

A class can share a lab across headsets: the instructor starts a class and students join with its code. In demo every student's bench shows the instructor's, with the instructor's hands on it; then each student works on their own bench, and the instructor can visit any of them and point at what they mean. It runs over a small real-time relay, so nothing needs installing.

In VR, a trigger tap selects a wire and a press-and-drag lays one, with the colour palette on the other controller; the grip reaches from the pointer to turn knobs and move leads and probes. The circuits use ideal models: an ideal op-amp with rail clipping, and an exact first-order solution for whatever is wired. Physical headset testing remains outstanding.
