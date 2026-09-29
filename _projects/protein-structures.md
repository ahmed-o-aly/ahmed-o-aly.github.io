---
layout: page
title: Protein Structures
permalink: /projects/protein-structures/
description: A browser and VR viewer for inspecting protein structures, experimental density, and observed changes between molecular states.
importance: 4
work_number: 6
category: molecular visualization
thread: immersive-tools
interactive:
  url: /protein-structures/
  embed_mobile: false
  title: Protein Structures interactive molecular and experimental density viewer
  heading: Explore the structure
  description: Inspect the proteasome and its density, or compare six experimental states one snapshot at a time.
  launch_label: Open Protein Structures full screen
  note: For VR, open the viewer full screen in a compatible headset browser and select View in VR.
artifacts:
  - label: Download the original 7W38 coordinates
    url: /protein-structures/data/7w38.cif
  - label: Inspect the state comparison data
    url: /protein-structures/data/motion/motion.json
  - label: Read the original study
    url: https://doi.org/10.1038/s41586-022-04671-8
---

I built Protein Structures to inspect molecular shapes in the browser and at a scale that can be explored in VR. The first structure is the USP14-bound human 26S proteasome, [PDB 7W38](https://www.rcsb.org/structure/7W38), with its experimental cryo-EM density, [EMD-32273](https://www.ebi.ac.uk/emdb/EMD-32273).

The viewer starts with a colored Cα backbone inside dark blue wireframe density at 0.5σ and 0.50 opacity. You can adjust the contour and opacity independently, isolate chains, cut through the complex, and switch between wireframe and surface views. The density is sampled from the experimental map for browser performance. The backbone and sampled map support structural overview; fine atomic interpretation requires the original coordinates and full-resolution map linked from the viewer.

State comparison brings together six deposited structures from [Zhang and colleagues' 2022 study](https://doi.org/10.1038/s41586-022-04671-8): 7W3A, 7W3B, 7W3C, 7W3F, 7W3G, and 7W3H. The structures are aligned on the shared 20S core so that changes around the ATPase motor and USP14 can be inspected without rotating the whole complex. Step through the snapshots, focus on the motor, or overlay the first state for comparison. The 7W38 density is hidden in this mode because it belongs to a different experimental state.

Playback shows experimental snapshots by default. Their order follows the authors' inferred sequence, with a missing state and no complete observed cycle. Optional interpolation is off by default and labeled as illustrative. Its intermediate shapes and playback speed are not experimentally measured motion or a molecular dynamics simulation. The substrate appears only at observed snapshots because its residue correspondence is unassigned.

In VR, hold either lower grip to move and turn the model, or hold both and move your hands apart or together to scale it like a ball. The left thumbstick moves you around the structure. Press X or click the right thumbstick to summon a controls panel, then point and use the trigger to adjust contour, opacity, chain isolation, density display, and cutaway. The same panel provides state comparison and playback controls. On Oculus Touch-style controllers, Y recenters the model; A plays or pauses the snapshots and B advances. Other controller layouts may differ. Physical headset testing remains outstanding.
