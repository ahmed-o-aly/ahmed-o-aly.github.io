---
layout: page
title: Abu Dhabi Urban Dynamics Lab
permalink: /projects/abu-dhabi-urban-dynamics/
description: A browser simulation for testing housing, jobs, and transport ideas across Greater Abu Dhabi City.
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

I built this model to experiment with housing, jobs, and transport in Greater Abu Dhabi City. It covers 18 districts. You can change bus fares and speeds, road capacity, housing, employment space, and public realm quality, then compare the result with a reference run that uses the same random seed.

The map uses AD-SDI community boundaries and bus stops. Population comes from SCAD's 2024 census tables, and the road network is assembled from OpenStreetMap and OSRM routes. Jobs, rents, capacities, and many of the behaviour settings are still assumptions. I label them as such because I do not want a synthetic input to look like an official statistic.

At full scale, the model runs 6,070 citizen agents and 600 enterprise agents. Commuting, road loading, job matching, and household and firm decisions happen daily. Accounts close monthly. Rent, wage, and demographic updates happen annually.

I also wrote checks for deterministic replay, population totals, network assignment, and long runs. Those checks tell me that the software is behaving consistently. They do not make it a forecast. It would need current travel, rent, employment, and business data before I would use it for policy work.

I kept the controls, map, charts, assumptions, and sources together so it is possible to see what changed and why.
