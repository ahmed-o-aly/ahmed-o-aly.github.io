---
layout: page
title: Probabilistic VNS for Delivery Territory Design
description: Open-source algorithms and benchmark instances for designing delivery territories under uncertainty.
importance: 5
work_number: 4
category: research software
thread: optimization-software
artifacts:
  - label: Code and data
    url: https://github.com/ahmed-o-aly/TerritoryDesign
  - label: Published paper
    url: https://doi.org/10.1016/j.cor.2024.106756
---

<figure>
  <img src="{{ '/assets/img/output.png' | relative_url }}" alt="A graph divided into delivery territories by the probabilistic VNS algorithm" width="640" height="636" loading="eager">
  <figcaption>One of the benchmark graphs partitioned into delivery territories.</figcaption>
</figure>

This project contains the code and benchmark data behind our paper, _“An efficient probability-based VNS algorithm for delivery territory design”_ ([Computers & Operations Research, 2024](https://doi.org/10.1016/j.cor.2024.106756)). The problem comes from last-mile delivery: divide a network into territories that are connected and balanced while keeping the largest territory diameter as small as possible.

I open-sourced the implementation and the datasets at [github.com/ahmed-o-aly/TerritoryDesign](https://github.com/ahmed-o-aly/TerritoryDesign). The repository includes:

- A probabilistic BVNS implementation with tailored shaking, merit functions, and path relinking.
- 120 planar and grid-derived graph instances in GraphML, ranging from 500 to 726 nodes.
- Experiment logs for BVNS, path relinking, and MIP baselines.
- The notebook used to generate new instances and a `CITATION.cff` file for the released artifacts.

In the reported experiments, ProbVNS obtained lower infeasibility in 90% of the tested instances. For those instances, the objective value decreased by 8.3% on average, with a maximum decrease of 51%. Its average runtime was 2.7 times lower than the path-relinking baseline.

## Quick start

The code runs on Python 3.9+ with a small scientific-Python stack:

```bash
pip install networkx numpy scipy pandas matplotlib jupyter
```

Load an instance and run BVNS:

```python
import networkx as nx
from DTDPAlgorithms import TerritoryDesignProblem, BVNS

G = nx.read_graphml("TGraphInstances/planar500_G0.graphml")

tdp = TerritoryDesignProblem(
    graph_input=G,
    delta=0.05,
    llambda=0.4,
    rcl_parameter=0.2,
    nr_districts=10,
)

bvns = BVNS(
    tdp_instance=tdp,
    shaking_steps=5,
    fail_max=4,
    nrInitSolutions=10,
)

obj_hist, inf_hist, best_solution, timeline = bvns.performBVNS()
print("Best objective:", obj_hist[-1], "Infeasibility:", inf_hist[-1])
```

## Plotting a solution

```python
import matplotlib.cm as cm
import matplotlib.pyplot as plt

def plot_districts(G, districts):
    pos = {
        node: (float(G.nodes[node]["x"]), float(G.nodes[node]["y"]))
        for node in G.nodes
    }
    palette = cm.get_cmap("tab20")
    plt.figure(figsize=(8, 8))

    for district, nodes in districts.items():
        nx.draw_networkx_nodes(
            G,
            pos,
            nodelist=nodes,
            node_color=[palette(district % 20)],
            node_size=12,
        )

    nx.draw_networkx_edges(G, pos, width=0.3, alpha=0.4)
    plt.axis("off")
    plt.show()

districts = best_solution if isinstance(best_solution, dict) else best_solution["Districts"]
plot_districts(G, districts)
```

## What is in the repository

- `DTDPAlgorithms.py` contains the construction heuristics, local search, BVNS, and path relinking.
- `TGraphInstances/` and `GGraphInstances/newGeneratedInstances/` contain the benchmark graphs.
- `Results/` contains the JSON timelines from the VNS, path-relinking, and MIP experiments.
- `generateGraphs.ipynb` creates new planar or grid instances.

If you use the code or the benchmark instances, please cite the [paper](https://doi.org/10.1016/j.cor.2024.106756) and the repository’s `CITATION.cff`.
