---
layout: default
title: Projects
permalink: /projects/
description: Systems work across immersive labs, public policy, optimization, routing, and research software.
---

<article class="folio-page folio-works-page">
  <a class="folio-back-link" href="{{ '/' | relative_url }}" data-page-turn>&larr; Back to the folio</a>
  <header class="folio-page__header" data-reveal>
    <p class="folio-kicker">Selected Works</p>
    <h1><span data-drift="6">Things I&rsquo;ve convinced to work.</span></h1>
    <p>Decision systems, research software, and the operational structures around them.</p>
  </header>
  {% assign sorted_projects = site.projects | sort: 'importance' %}
  <div class="folio-work-grid folio-work-grid--all">
    {% assign visible_index = 0 %}
    {% for project in sorted_projects %}
      {% unless project.preview %}
        {% assign visible_index = visible_index | plus: 1 %}
        {% include folio-work-card.liquid project=project index=visible_index %}
      {% endunless %}
    {% endfor %}
  </div>
  <p class="folio-ornament" aria-hidden="true">❦</p>
</article>
