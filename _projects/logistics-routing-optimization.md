---
layout: page
title: Logistics Routing and Facility Optimization
description: Optimization products for routing, clustering, and facility-location problems under real traffic and capacity constraints.
importance: 4
category: software
thread: optimization-software
role: Operations research scientist and product lead
methods: GRASP, Tabu Search, VNS, FastAPI, Node.js, Docker, Azure DevOps
status: Prior industry role
visual:
  key: routing
  icon: fa-solid fa-route
  label: routing service
  headline: Constraint-aware route engine
  summary: Metaheuristics, APIs, traffic and weather inputs, profiling, and delivery workflows for operational routing tools.
  chips:
    - GRASP
    - VNS
    - APIs
    - Docker
signals:
  - Routing and clustering heuristics exposed through internal services.
  - Real-time traffic and weather inputs for operational planning.
  - Product ownership across algorithm design, APIs, and delivery workflows.
problem: Logistics routing tools fail when algorithms ignore the operational rules that make plans usable. The challenge was to build optimization services that could absorb traffic, weather, capacity, safety, and policy constraints while still moving fast enough for product iteration.
constraints:
  - Real traffic and weather inputs make route quality time-dependent and operationally sensitive.
  - Routing, clustering, and facility-location problems have different objective structures but shared delivery workflows.
  - Internal users need services and APIs, not just standalone scripts.
system_map:
  title: From operational request to routing service
  steps:
    - title: Translate constraints
      detail: Convert capacity, time, safety, policy, and field requirements into algorithmic rules.
    - title: Build heuristics
      detail: Develop GRASP, Tabu Search, VNS, clustering, and facility-location approaches for fast iteration.
    - title: Ship services
      detail: Expose optimization logic through FastAPI, Node.js, Docker, Azure DevOps, and data pipelines.
proof:
  - label: Metaheuristics
    detail: Routing, clustering, and facility-location algorithms under real operational constraints.
  - label: API services
    detail: FastAPI and Node.js services that made optimization available to internal workflows.
  - label: Data pipelines
    detail: Asynchronous traffic and weather integrations feeding operational planning.
  - label: Product ownership
    detail: Cross-functional work across requirements, algorithm design, service delivery, and iteration.
decisions:
  - Prioritize fast, explainable heuristics where operational iteration mattered more than perfect optimality.
  - Expose algorithms as services so they could be used inside product workflows.
  - Profile bottlenecks instead of guessing where performance work would matter.
outcomes:
  - Internal optimization services for routing, clustering, and facility-location use cases.
  - Stronger connection between algorithm design and real delivery constraints.
  - Performance improvements through profiling and targeted optimization work.
---

At AHOY DMCC, I led optimization product work for routing, clustering, and facility-location problems. The work involved translating operational requirements into algorithmic services that could handle real traffic, capacity, safety, and policy constraints.

## Narrative

Routing systems fail when they ignore the operational details that make plans usable. This work was about building optimization services that could handle imperfect data, real constraints, and the need for fast iteration.

The product angle mattered as much as the algorithms. A routing model is only useful if it can be called by the right people, debugged under pressure, and adjusted when the business rule that looked minor yesterday becomes the constraint that breaks tomorrow's plan.

## What This Shows

- Product-minded operations research: algorithms exposed through services, not trapped in notebooks.
- Practical trade-offs between optimality, speed, explainability, and field constraints.
- Ownership across requirements, algorithm design, delivery, profiling, and iteration.
