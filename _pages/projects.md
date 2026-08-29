---
layout: default
title: Projects
permalink: /projects/
description: Systems work across immersive labs, public policy, optimization, routing, and research software.
---

{% assign sorted_projects = site.projects | where_exp: 'project', 'project.preview != true' | sort: 'importance' %}

<article class="folio-page folio-works-page">
  <a class="folio-back-link" href="{{ '/' | relative_url }}">&larr; Back to the folio</a>
  <header class="folio-page__header">
    <p class="folio-kicker">Selected Works</p>
    <h1>Systems built to be operated, not just demonstrated.</h1>
    <p>Decision systems, research software, and the operational structures around them.</p>
  </header>

  <ol class="folio-work-index folio-work-index--all" role="list">
    {% for project in sorted_projects %}
      {% include folio-work-card.liquid project=project index=forloop.index heading_level=2 %}
    {% endfor %}
  </ol>

  <img class="folio-ornament" src="{{ '/assets/img/folio/bunny-sepia-ornament.svg' | relative_url }}" alt="" width="17" height="27">
</article>
