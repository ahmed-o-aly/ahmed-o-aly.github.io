---
layout: page
title: Projects
permalink: /projects/
description: Systems work across immersive labs, public policy, optimization, routing, and research software.
eyebrow: Projects
display_title: Work that makes complicated systems easier to inspect and operate.
---

<section class="garden-project-grid garden-grid" aria-label="Project case studies">
  {% assign sorted_projects = site.projects | sort: 'importance' %}
  {% assign visible_index = 0 %}
  {% for project in sorted_projects %}
    {% unless project.preview %}
      {% assign visible_index = visible_index | plus: 1 %}
      {% assign size = project.card_size | default: 'standard' %}
      {% assign loading = 'lazy' %}
      {% assign fetchpriority = 'auto' %}
      {% if visible_index == 1 %}
        {% assign loading = 'eager' %}
        {% assign fetchpriority = 'high' %}
      {% endif %}
      {% include garden-project-card.liquid project=project size=size loading=loading fetchpriority=fetchpriority %}
    {% endunless %}
  {% endfor %}
</section>
