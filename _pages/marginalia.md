---
layout: default
title: Marginalia
permalink: /marginalia/
description: Small observations about models, labs, research software, and the work around the work.
---

<article class="folio-page folio-marginalia-page">
  <a class="folio-back-link" href="{{ '/' | relative_url }}" data-page-turn>&larr; Back to the folio</a>
  <header class="folio-page__header" data-reveal>
    <p class="folio-kicker">Marginalia</p>
    <h1><span data-drift="6">Little ramblings.</span></h1>
    <p>Short observations, loosely ranked and deliberately unfinished.</p>
  </header>
  <div class="folio-marginalia-feed">
    {% for note in site.data.marginalia %}
      <article class="{% if forloop.index == 3 or forloop.index == 6 %}folio-note-card{% endif %}" data-reveal>
        <time>{{ note.date | upcase }} &mdash;</time>
        <p>{{ note.text }}</p>
      </article>
    {% endfor %}
  </div>
  <p class="folio-ornament" aria-hidden="true">❦</p>
</article>
