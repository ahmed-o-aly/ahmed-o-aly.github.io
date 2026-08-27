---
layout: page
title: Machine Lab — Interactive CNC Assembly Explorer
permalink: /projects/cnc-machine-inspector/
description: A WebXR-enabled 3D learning tool for inspecting eight workshop machines through readable assemblies, exploded views, annotations, sectioning, and measurement.
importance: -1
category: interactive software
thread: immersive-tools
role: Interactive product design, 3D assembly preparation, learning-content architecture, and WebXR implementation
methods: React, Three.js, WebXR, GLB, STEP-derived geometry, semantic component mapping
status: Live interactive project
image: /assets/img/projects/cnc-machine-inspector/machine-lab-interface.png
image_alt: Machine Lab interface showing the DMU 50 assembly hierarchy, selected spindle learning card, and inspection tools
image_fit: cover
image_width: 1600
image_height: 900
image_aspect: widescreen
card_size: standard
og_image: https://ahmed-o-aly.github.io/assets/img/projects/cnc-machine-inspector/machine-lab-interface.png
gallery:
  - image: /assets/img/projects/cnc-machine-inspector/machine-lab-interface.png
    alt: Machine Lab product interface with a DMU 50 model, assembly tree, selected spindle notes, and inspection tools
    caption: Published interface preview — actual DMU 50 model, component hierarchy, learning content, validation status, and inspection controls composed from the live product.
    width: 1600
    height: 900
  - image: /assets/img/projects/cnc-machine-inspector/cmx1100v.jpg
    alt: Isometric render of the CMX 1100 V vertical machining center
    caption: CMX 1100 V — validated component mapping with one documented nonphysical work-envelope exclusion.
    width: 1280
    height: 720
    zoom: large
  - image: /assets/img/projects/cnc-machine-inspector/waterjet.jpg
    alt: Isometric render of a complete abrasive waterjet cutting cell
    caption: Waterjet cell — cutting tables, gantries, pumps, abrasive delivery, and access systems in one assembly.
    width: 1280
    height: 720
    zoom: large
visual:
  key: machine-lab
  icon: fa-solid fa-cubes
  label: 3D machine learning
  headline: Eight machines, inspectable from system to component
  summary: A browser-based assembly explorer connecting complete machine geometry to readable component relationships, learning notes, and immersive inspection.
  chips:
    - 3D assemblies
    - WebXR
    - exploded views
    - provenance
signals:
  - Eight complete CNC, conventional, EDM, and waterjet machine assemblies.
  - 197 named learning components connected to inspection notes and assembly relationships.
  - Every machine has a geometry/component report; five newer packages also check annotations, schemas, file hashes, and delivery limits.
problem: Complete machine assemblies are difficult to understand from a flat diagram or an undifferentiated CAD model. Learners need a way to move from the whole machine to major systems and individual components without losing the relationships that explain what each part does.
constraints:
  - Source assemblies vary substantially in hierarchy, naming quality, geometric scale, and level of detail.
  - The experience has to stay readable on a normal browser while preserving large machine models and nested component relationships.
  - Generated exploded views and point-to-point measurements are inspection aids; they must not be presented as authored motion or CAD-exact metrology.
  - Source and licensing notes need to remain attached to each model rather than being flattened into a generic asset claim.
system_map:
  title: From supplied machine geometry to an inspectable learning model
  steps:
    - title: Normalize the assembly
      detail: Convert and organize supplied STEP or GLB geometry into a browser-ready hierarchy while preserving model bounds and triangle coverage.
    - title: Map readable components
      detail: Connect source geometry to named systems and subcomponents, then attach concise explanations, relationships, and evidence notes.
    - title: Add inspection tools
      detail: Support search, nested navigation, hide/isolate, exploded views, section planes, measurement, and immersive WebXR inspection.
    - title: Validate the package
      detail: Check geometry assignments and component coverage for every machine, with annotation, schema, file-hash, unresolved-target, and delivery-limit checks on the five newer packages.
proof:
  - label: Live machine library
    detail: Eight complete machines spanning CNC machining centers, conventional equipment, wire EDM, and abrasive waterjet systems.
  - label: Semantic component layer
    detail: 197 named learning components with nested assembly relationships and readable inspection cards.
  - label: Geometry validation
    detail: Per-model reports cover about 4.9 million source triangles with zero unassigned or duplicate geometry assignments.
  - label: Immersive inspection
    detail: Desktop 3D workflows and WebXR support use the same model hierarchy, component selection, and learning content.
decisions:
  - Treat the product as an assembly-learning environment rather than an operational machining simulator.
  - Keep generated explode, section, and measurement tools explicitly separate from authored kinematics or CAD-exact analysis.
  - Preserve per-model provenance and validation evidence alongside the interactive experience.
  - Use complete machines as the navigation anchor, then reveal detail progressively through systems and components.
outcomes:
  - Eight machine packages and 197 named learning components are available in one browser-based library.
  - All eight reports pass their declared geometry and component checks; five newer reports also pass annotation, schema, file-hash, unresolved-target, and delivery-limit checks.
  - Learners can compare machine families while using a consistent interaction model across very different source assemblies.
artifacts:
  - label: Launch Machine Lab
    url: https://ahmed-o-aly.github.io/cnc-machine-inspector/
  - label: Open the featured VMC855
    url: https://ahmed-o-aly.github.io/cnc-machine-inspector/?machine=vmc855
  - label: Published app and model packages
    url: https://github.com/ahmed-o-aly/cnc-machine-inspector
---

Machine Lab turns full workshop-machine assemblies into something that can be read, questioned, and compared in a browser. The useful unit is not only the 3D mesh: it is the connection between geometry, a named component, its parent system, what it works with, and what a learner should inspect.

The library currently covers SA0231 wire EDM, DMU 50, a conventional lathe, a conventional vertical mill, VG600-II, VMC855, CMX 1100 V, and a complete abrasive-waterjet cell.

## Inspection, Not Simulation

The interaction tools are designed to make assemblies legible. Search and nested navigation locate parts; hide and isolate reduce visual noise; generated exploded views reveal relationships; section planes expose internal structure; and point-to-point measurement gives an inspection reference. These are learning aids rather than claims of authored machine motion, process physics, or CAD-exact metrology.

## Validation and Provenance

Each published model carries source notes and a machine-readable validation report. Together, the eight reports account for roughly 4.9 million source triangles and show complete geometry assignment without duplicates. The CMX 1100 V report documents one intentional exclusion: a 12-triangle work-envelope reference volume that is not physical machine hardware.

The conventional-lathe source is credited to Centurion University under CC BY 4.0. Other packages retain their own supplied-model and conversion notes so that origin, curation, and generated learning content are not conflated.
