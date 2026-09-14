---
layout: page
title: UAE Economy Lab
permalink: /projects/uae-economy-lab/
description: A browser model for exploring how changes in trade, productivity, and demand move through the UAE economy.
importance: -2
work_number: 1
home_feature:
  description: I built this model to explore how trade, productivity, and demand changes affect the UAE economy. Combine scenarios, follow connections between industries, and inspect the assumptions behind each result.
  image: /assets/img/projects/uae-economy-lab/uae-economy-lab.png
  image_alt: UAE Economy Lab showing scenario controls, national results, and changes across UAE industries.
  image_width: 1585
  image_height: 892
  url: /uae-economy-lab/
  label: Open UAE Economy Lab
category: economic simulation
thread: policy-simulation
interactive:
  url: /uae-economy-lab/
  embed_mobile: false
  title: UAE Economy Lab interactive economic scenario model
  heading: Explore the economy
  description: Combine changes, inspect an industry, and compare the result with the 2024 baseline.
  launch_label: Open UAE Economy Lab full screen
  note: Results describe scenarios under the selected assumptions. The full workspace is easier to use on a larger screen.
image: /assets/img/projects/uae-economy-lab/uae-economy-lab.png
image_alt: UAE Economy Lab showing scenario controls, national results, and changes across UAE industries.
image_fit: cover
image_width: 1585
image_height: 892
image_aspect: widescreen
og_image: https://ahmed-o-aly.github.io/assets/img/projects/uae-economy-lab/uae-economy-lab.png
---

I built UAE Economy Lab to make economic scenarios easier to explore. It uses the Asian Development Bank's UAE input-output accounts for 2024, covering 35 industries, with baseline trade exposure across 74 external partner records. Production, prices, wages, household demand, imports, and exports adjust together in a simplified computable general equilibrium (CGE) model.

You can combine changes to import costs, mining export demand, and industrial productivity, then fine-tune individual sectors. These changes are solved together. The sector workspace connects production and prices with suppliers, customers, and trading partners, so you can follow an industry through the economy and edit its scenario in one place. Partner views describe baseline trade exposure; they do not simulate policies in each partner economy.

The assumptions stay close to the results. You can change how easily buyers switch between domestic and imported products, how exports respond to prices, and whether employment or wages can adjust. Save scenarios in your browser, compare them against the same dataset, or export the inputs, assumptions, diagnostics, and sector results as CSV.

This is an independently implemented, simplified national CGE model. It does not replicate the standard GTAP model or include its proprietary database. Results are conditional scenarios, not forecasts. The public accounts support the baseline, while the response parameters are explicit modeling assumptions. Tariff cuts remain unavailable in the bundled dataset because it lacks observed sector tariff rates.
