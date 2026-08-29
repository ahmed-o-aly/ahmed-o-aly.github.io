---
layout: page
title: Energy System Optimization with DEWA
description: Large-scale optimization and simulation for renewables, storage, demand, operations, and cost tracing.
importance: 3
work_number: 5
category: research
thread: optimization-software
role: Research software, optimization modeling, simulation support
methods: Gurobi, Pyomo, pvlib, oemof, EnergyPlus, Streamlit, Plotly
status: Prior research assistant work
visual:
  key: energy
  icon: fa-solid fa-bolt
  label: energy model
  headline: Simulation-to-cost trace
  summary: Time-series generation, operational constraints, optimization decisions, and review interfaces for energy-system planning.
  chips:
    - Gurobi
    - Pyomo
    - time series
    - dashboards
signals:
  - Minute-level optimization models across long planning horizons.
  - Simulation inputs for renewables, storage, demand, and asset operations.
  - Cost and traceability metrics designed for expert review.
problem: Energy-system planning needs models that are both technically detailed and explainable enough for expert review. The challenge is linking physical behavior, operational constraints, simulated time-series inputs, optimization decisions, and cost traceability.
constraints:
  - Long planning horizons and minute-level discretization create large model sizes.
  - Asset behavior includes ramping, reserve requirements, storage behavior, demand, and non-linear efficiency effects.
  - Stakeholders need traceable metrics, not only solver outputs.
system_map:
  title: From simulated inputs to inspectable decisions
  steps:
    - title: Generate inputs
      detail: Use pvlib, oemof, and EnergyPlus-style simulations to build realistic renewable, demand, and asset time series.
    - title: Optimize operations
      detail: Model generation, storage, reserves, ramping, and cost relationships with Gurobi and Pyomo.
    - title: Review and explain
      detail: Expose outputs through modular software, tests, documentation, and Streamlit/Plotly interfaces.
proof:
  - label: Optimization model
    detail: Large-scale Python models for renewables, storage, demand, and operational constraints.
  - label: Simulation pipeline
    detail: Time-series generation and preprocessing for realistic energy-system scenarios.
  - label: Review interface
    detail: Interactive dashboards and plots for inspecting model outputs and assumptions.
  - label: Validation trail
    detail: Cost and traceability metrics structured for domain-expert review.
decisions:
  - Keep model components modular so assumptions can be tested without rewriting the system.
  - Treat dashboards as review tools, not decorative wrappers around solver output.
  - Make traceability a first-class output alongside optimization quality.
outcomes:
  - More inspectable links between simulated inputs, model decisions, and cost metrics.
  - Research software that could be tested, documented, and extended.
  - A clearer technical bridge between optimization outputs and domain-expert validation.
---

At Khalifa University, I worked on optimization and simulation methods for large-scale energy systems in partnership with Dubai Electricity & Water Authority.

The work blended mathematical programming, realistic time-series simulation, and software engineering. Models considered renewable generation, storage, demand, asset operations, reserves, ramping, non-linear efficiency behavior, and cost allocation across supply and demand.

## Narrative

Energy-system decisions sit at the intersection of physics, economics, operations, and policy. The useful model is not just the one that solves; it is the one stakeholders can inspect, stress-test, and trust.

That shaped the implementation style: keep the model modular, keep the outputs explainable, and keep enough software discipline around the research code that experiments could be repeated instead of reconstructed from memory.

## What This Shows

- Large-model thinking across simulation inputs, solver decisions, and expert review.
- Research software discipline around modularity, repeatability, and traceability.
- A habit of treating dashboards as inspection tools rather than presentation decoration.
