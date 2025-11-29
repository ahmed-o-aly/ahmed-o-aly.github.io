---
layout: post
title: "TerritoryDesign: Probabilistic VNS for Delivery Territory Design"
date: 2025-11-29
description: A quick tour of the open-source BVNS + path-relinking toolkit released with our Computers & Operations Research paper on delivery territory design.
tags: [optimization, territory-design, vns, python]
categories: [blog]
toc: true
---

I open-sourced the code and datasets that accompany our paper *“An efficient probability-based VNS algorithm for delivery territory design”* (Computers & Operations Research, 2024). The repo lives at [github.com/ahmed-o-aly/TerritoryDesign](https://github.com/ahmed-o-aly/TerritoryDesign) and packages:

- A probabilistic BVNS implementation with tailored shaking, merit functions, and path relinking.
- 120 graph instances (planar and grid-derived) in GraphML, matching the benchmarks from the paper.
- Experiment logs (BVNS, PR, and MIP baselines) and the notebook used to generate new instances.
- Citation metadata (`CITATION.cff`) so you can cite the artifacts directly.

## Quick start
The code runs on Python 3.9+ with light dependencies:

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
    delta=0.05,          # balance tolerance
    llambda=0.4,         # objective vs. balance weight
    rcl_parameter=0.2,   # restricted candidate list threshold
    nr_districts=10
)

bvns = BVNS(tdp_instance=tdp, shaking_steps=5, fail_max=4, nrInitSolutions=10)
obj_hist, inf_hist, best_solution, timeline = bvns.performBVNS()
print("Best objective:", obj_hist[-1], "Infeasibility:", inf_hist[-1])
```

To visualize districts:

```python
import networkx as nx
import matplotlib.pyplot as plt
import matplotlib.cm as cm

def plot_districts(G, districts):
    pos = {
        n: (float(G.nodes[n]["x"]), float(G.nodes[n]["y"]))
        for n in G.nodes
    }
    palette = cm.get_cmap("tab20")
    plt.figure(figsize=(8, 8))

    for k, nodes in districts.items():
        nx.draw_networkx_nodes(
            G,
            pos,
            nodelist=nodes,
            node_color=[palette(k % 20)],
            node_size=12,
        )

    nx.draw_networkx_edges(G, pos, width=0.3, alpha=0.4)
    plt.axis("off")
    plt.show()

districts = best_solution if isinstance(best_solution, dict) else best_solution["Districts"]
plot_districts(G, districts)
```

![Plotted BVNS districts]( {{ "assets/img/output.png" | relative_url }} )

## What’s inside
- `DTDPAlgorithms.py`: construction heuristics, local search, BVNS, and path relinking.
- `TGraphInstances/` & `GGraphInstances/newGeneratedInstances/`: 120 benchmarks (500–726 nodes).
- `Results/`: JSON timelines for VNS/PR/MIP experiments.
- `generateGraphs.ipynb`: notebook to create new planar or grid instances.

If you use the code or instances, cite the paper ([doi:10.1016/j.cor.2024.106756](https://doi.org/10.1016/j.cor.2024.106756)) and the repository’s `CITATION.cff`. Feedback welcome!
