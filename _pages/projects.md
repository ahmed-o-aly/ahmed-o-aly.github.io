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
  {% for project in sorted_projects %}
    {% unless project.preview %}
      {% assign size = 'standard' %}
      {% if forloop.index == 1 or forloop.index == 3 %}{% assign size = 'wide' %}{% endif %}
      {% include garden-project-card.liquid project=project size=size %}
    {% endunless %}
  {% endfor %}
</section>
