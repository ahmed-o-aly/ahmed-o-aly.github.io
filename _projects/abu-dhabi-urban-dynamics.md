---
layout: page
title: Abu Dhabi Urban Dynamics Lab
permalink: /projects/abu-dhabi-urban-dynamics/
description: A browser-based model for exploring how housing, jobs, and transport interact across Greater Abu Dhabi City.
importance: 0
work_number: 2
category: simulation
thread: policy-simulation
preview: false
image: /assets/img/projects/urban-dynamics-console.png
image_alt: Abu Dhabi Urban Dynamics analyst console with district geography, agent indicators, and scenario charts
image_fit: cover
image_width: 1600
image_height: 900
image_aspect: widescreen
card_size: wide
og_image: https://ahmed-o-aly.github.io/assets/img/projects/urban-dynamics-console.png
interactive:
  url: /projects/abu-dhabi-urban-dynamics-v2/
  title: Abu Dhabi Urban Dynamics simulation
  heading: Run the model
  description: Change a scenario, run it against the same-seed reference, and inspect what happens across the city.
  launch_label: Open the simulation
  note: The full console works best on a larger screen.
  embed: false
artifacts:
  - label: Open the full simulation
    url: /projects/abu-dhabi-urban-dynamics-v2/
  - label: Read the validation report
    url: /assets/data/udes-v2/validation-report.json
---

I built this as a browser-based sandbox for looking at how housing, jobs, and transport interact across Greater Abu Dhabi City. It covers 18 districts and lets me change public-transport costs and speeds, road capacity, housing, and employment-space capacity, then run the model against a reference with the same random seed.

The geography is not an invented grid. District boundaries and bus-stop locations come from AD-SDI, population totals are mapped from SCAD's 2024 census, and the road graph is built from OpenStreetMap and OSRM routes. I kept the source of each field visible because the inputs do not all have the same status. Population and geography have official sources; jobs, rents, capacities, and most behavioural parameters are still explicit assumptions.

The current model uses 6,070 citizen agents and 600 enterprise agents. Citizens respond to employment, housing costs, and commute pressure. Firms respond to demand, wages, rent, margins, and access to labour. The engine moves one calendar day at a time. Household and company accounts close monthly, while rents, wages, and demographic changes update annually.

This is an exploratory model, not a forecast. I have tested deterministic replay, population conservation, network assignment, and long-run stability, but the behavioural and economic assumptions still need current household travel, rent, employment, and firm data before the model could support real policy decisions.

The part I care about most is being able to inspect the model while it runs. The map, agents, scenario controls, charts, assumptions, and sources stay together, so a result is never separated from the choices that produced it.
