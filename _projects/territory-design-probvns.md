---
layout: page
title: Probabilistic VNS for Delivery Territory Design
description: Open-source benchmark instances and algorithms for delivery territory design under uncertainty.
importance: 5
category: software
thread: optimization-software
role: Researcher, algorithm designer, benchmark author
methods: Probabilistic VNS, path relinking, local search, benchmark generation, Python
status: Published research and open-source code
visual:
  key: territory
  icon: fa-solid fa-draw-polygon
  label: territory design
  headline: Open research artifact trail
  summary: Paper, code, benchmark instances, result logs, plots, and a walkthrough for delivery territory design under uncertainty.
  chips:
    - paper
    - code
    - benchmarks
    - plots
signals:
  - Probability-based VNS for delivery territory design under operational variability.
  - Benchmark instances, experiment tooling, and reproducible Python code.
  - Direct connection between a publication, source code, and explanatory writing.
problem: Delivery territories need to be compact, balanced, connected, and robust to operational variability. The research problem was to search that solution space efficiently while producing benchmarkable, reproducible results.
constraints:
  - Territories must balance performance measures while minimizing maximum diameter.
  - Graph instances need enough structure to represent delivery-style districting problems.
  - Experiments must compare feasibility, objective quality, and runtime against published baselines.
system_map:
  title: From districting problem to reproducible research artifact
  steps:
    - title: Model the problem
      detail: Represent delivery territory design as graph districting with balance, connectivity, and diameter concerns.
    - title: Search intelligently
      detail: Use probabilistic VNS, tailored shaking, local search, penalty changes, and path relinking.
    - title: Publish the trail
      detail: Release code, benchmark instances, result logs, paper links, and a walkthrough for reuse.
proof:
  - label: Paper
    detail: Computers & Operations Research 2024 article with quantified comparisons against a path-relinking baseline.
  - label: Code and data
    detail: Public GitHub repository with algorithms, benchmark instances, logs, notebooks, and citation metadata.
  - label: Visual output
    detail: District plots showing how graph instances are partitioned into delivery territories.
  - label: Walkthrough
    detail: Blog post explaining the codebase, quick start, plotting, and repository structure.
decisions:
  - Use probability-based neighborhood search to balance feasibility recovery and diversification.
  - Publish benchmark instances and logs so the work is inspectable beyond the paper.
  - Connect the paper, code, blog, and citation metadata into one artifact trail.
outcomes:
  - ProbVNS obtained lower infeasibility in 90% of tested instances reported in the paper.
  - For those instances, objective value decreased by 8.3% on average, with a maximum decrease of 51%.
  - Reported runtimes were 2.7 times lower on average than the path-relinking baseline.
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

## Artifact Trail

- [Code and data](https://github.com/ahmed-o-aly/TerritoryDesign)
- [Blog walkthrough]({{ '/blog/2025/territory-design-bvns/' | relative_url }})
- [Computers & Operations Research paper](https://doi.org/10.1016/j.cor.2024.106756)

## Narrative

Territory design is a useful bridge between clean optimization models and messy delivery reality. The research asks how to create zones that remain useful when demand, travel, and operations refuse to behave deterministically.

This is the case study with the most public proof: the paper, the benchmark data, the repository, the plotting output, and a practical walkthrough all connect. That makes it a useful template for how the rest of the portfolio should mature.

## What This Shows

- A complete research trail: paper, code, benchmark data, results, plots, and explanation.
- Algorithm design connected to an operational districting problem.
- Reproducibility as part of the work, not an afterthought.
