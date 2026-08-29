---
layout: page
title: Machine Lab
permalink: /projects/cnc-machine-inspector/
description: A browser tool for exploring eight workshop machines and seeing how their components fit together.
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

I built Machine Lab because complete machine models are difficult to learn from in their original form. Each one came with a different structure, naming system, scale, and level of detail, so I cleaned up the assemblies and prepared them for the browser.

The library now contains eight machines: the SA0231 wire EDM, DMU 50, a conventional lathe, a conventional vertical mill, VG600-II, VMC855, CMX 1100 V, and an abrasive-waterjet cell. You can search for a part, isolate or hide it, open an exploded view, cut a section, and measure between two points. The models can also be opened in WebXR.

Across the eight machines, I mapped 197 components. The validation reports cover about 4.9 million source triangles, with nothing left unassigned and no duplicate mappings. I left out one tiny reference volume in the CMX 1100 V because it marks the work envelope rather than a physical part.

This is an assembly viewer, not a machining simulator. The explode, section, and measurement tools are there to show how the parts fit together. They do not simulate motion, cutting, or CAD-level measurement.
