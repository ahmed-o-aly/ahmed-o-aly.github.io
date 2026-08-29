---
layout: page
title: Energy System Optimization with DEWA
description: Optimization and simulation work on renewable generation, storage, demand, and power-system operations.
importance: 3
work_number: 3
category: research
thread: optimization-software
---

I worked on this project as a research assistant at Khalifa University in partnership with DEWA. My work covered optimization, simulation, and the software used to run and inspect the models.

I built large Python models in Gurobi and Pyomo with minute-level time steps over long planning horizons. The models included ramp rates, spinning reserves, and nonlinear efficiency curves. I also used pvlib, oemof, and EnergyPlus to produce renewable and chiller time series for the optimization work.

A lot of the job was software work around the models. I organized the code into modules, added tests with Pytest, wrote Sphinx documentation, and built Streamlit and Plotly interfaces for checking results. I also worked with domain experts on levelized cost and traceability measures.

The aim was to make it possible to follow a result back through the model and see how it was produced.
