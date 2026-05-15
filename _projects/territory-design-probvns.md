---
layout: page
title: Probabilistic VNS for Delivery Territory Design
description: Open-source benchmark instances and algorithms for delivery territory design under uncertainty.
importance: 5
category: software
thread: optimization-software
image: /assets/img/projects/logistics-routing.svg
role: Researcher, algorithm designer, benchmark author
methods: Probabilistic VNS, path relinking, local search, benchmark generation, Python
status: Published research and open-source code
signals:
  - Probability-based VNS for delivery territory design under operational variability.
  - Benchmark instances, experiment tooling, and reproducible Python code.
  - Direct connection between a publication, source code, and explanatory writing.
artifacts:
  - label: Code and data
    url: https://github.com/ahmed-o-aly/TerritoryDesign
  - label: Blog walkthrough
    url: /blog/2025/territory-design-bvns/
  - label: Published paper
    url: https://doi.org/10.1016/j.cor.2024.106756
---

This project contains the code and benchmark data behind my work on the Delivery Territory Design Problem, a districting problem motivated by last-mile delivery operations.

The accompanying paper proposes a probability-based Variable Neighborhood Search algorithm that balances feasibility, objective quality, and runtime performance across benchmark graph instances.

## Links

- [Code and data](https://github.com/ahmed-o-aly/TerritoryDesign)
- [Blog walkthrough]({{ '/blog/2025/territory-design-bvns/' | relative_url }})
- [Computers & Operations Research paper](https://doi.org/10.1016/j.cor.2024.106756)

## What I Built

- Probabilistic variable neighborhood search.
- Path relinking and local-search design.
- Benchmark instance generation and experiment logging.
- Reproducible Python tooling for operations research experiments.

## Why It Matters

Territory design is a useful bridge between clean optimization models and messy delivery reality. The research asks how to create zones that remain useful when demand, travel, and operations refuse to behave deterministically.
