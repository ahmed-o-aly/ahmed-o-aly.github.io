---
layout: page
title: Machine Lab — Interactive CNC Assembly Explorer
permalink: /projects/cnc-machine-inspector/
description: A browser-based 3D viewer for studying eight workshop machines, from the complete assembly down to individual parts.
importance: -1
work_number: 1
category: interactive software
thread: immersive-tools
interactive:
  url: https://ahmed-o-aly.github.io/cnc-machine-inspector/
  title: Machine Lab interactive CNC assembly explorer
  heading: Try it here
  description: Choose a machine and explore the assembly directly in the browser.
  launch_label: Open Machine Lab full screen
  note: For the larger models or WebXR, open it full screen.
image: /assets/img/projects/cnc-machine-inspector/machine-lab-interface.png
image_alt: Machine Lab interface showing the DMU 50 assembly hierarchy, selected spindle learning card, and inspection tools
image_fit: cover
image_width: 1600
image_height: 900
image_aspect: widescreen
card_size: standard
og_image: https://ahmed-o-aly.github.io/assets/img/projects/cnc-machine-inspector/machine-lab-interface.png
artifacts:
  - label: Open the featured VMC855
    url: https://ahmed-o-aly.github.io/cnc-machine-inspector/?machine=vmc855
  - label: Published app and model packages
    url: https://github.com/ahmed-o-aly/cnc-machine-inspector
---

I built Machine Lab to make complete workshop machines easier to study in a browser. Instead of working through one dense CAD model, I can search the assembly, select a part, see where it sits in the larger system, isolate it, explode the model, cut a section through it, or take a point-to-point measurement. The same models can also be opened in WebXR.

The library currently includes eight machines: SA0231 wire EDM, DMU 50, a conventional lathe, a conventional vertical mill, VG600-II, VMC855, CMX 1100 V, and a complete abrasive-waterjet cell. Across them, I mapped 197 named components and added notes explaining what each part is and how it fits into the rest of the machine.

I worked from both STEP and GLB sources, and the naming, hierarchy, scale, and level of detail varied from one model to another. I cleaned up each assembly for the browser, mapped the geometry to readable component names, and checked that nothing was left unassigned or duplicated. The validation reports cover roughly 4.9 million source triangles. For the CMX 1100 V, I deliberately left out one 12-triangle work-envelope volume because it is a reference object, not physical hardware.

This is an assembly explorer, not a machining simulator. The exploded views, sections, and measurements are there to help inspect the models; they do not reproduce machine motion, process physics, or CAD-grade metrology.

I kept the source and licensing notes with each model. The conventional lathe is credited to Centurion University under CC BY 4.0, while the other packages retain the supplied-model and conversion notes that came with them.
