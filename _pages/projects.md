---
layout: default
title: Projects
permalink: /projects/
description: Products and research software I have built, from field-sales systems to simulation and optimization.
---

{% assign sorted_projects = site.projects | where_exp: 'project', 'project.work_number' | sort: 'work_number' %}
{% assign current_venture = site.projects | where: 'venture', true | first %}

<article class="folio-page folio-works-page">
  <a class="folio-back-link" href="{{ '/' | relative_url }}">&larr; Back to the folio</a>
  <header class="folio-page__header">
    <p class="folio-kicker">Selected Works</p>
    <h1>A few things I have built.</h1>
    <p>Software for field work, machine inspection, city simulation, energy systems, and delivery territories.</p>
  </header>

{% if current_venture %}

<section class="folio-venture-note" aria-labelledby="current-venture-title">
<a class="folio-venture-note__link" href="{{ current_venture.url | relative_url }}">
<p class="folio-kicker">Current venture</p>
<div>
<h2 id="current-venture-title">{{ current_venture.title }}</h2>
<p>{{ current_venture.description }}</p>
</div>
</a>
</section>
{% endif %}

  <ol class="folio-work-index folio-work-index--all" role="list">
    {% for project in sorted_projects %}
      {% include folio-work-card.liquid project=project index=project.work_number heading_level=2 %}
    {% endfor %}
  </ol>

  <img class="folio-ornament" src="{{ '/assets/img/folio/bunny-sepia-ornament.svg' | relative_url }}" alt="" width="17" height="27">
</article>
