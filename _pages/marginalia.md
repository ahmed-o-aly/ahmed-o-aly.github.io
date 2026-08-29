---
layout: default
title: Marginalia
permalink: /marginalia/
description: Small observations about models, labs, research software, and the work around the work.
---

<article class="folio-page folio-marginalia-page">
  <a class="folio-back-link" href="{{ '/' | relative_url }}">&larr; Back to the folio</a>
  <header class="folio-page__header">
    <p class="folio-kicker">Marginalia</p>
    <h1>Notes in the margins.</h1>
    <p>Short observations, loosely ranked and deliberately unfinished.</p>
  </header>
  <div class="folio-marginalia-feed">
    {% for note in site.data.marginalia %}
      <article>
        <time>{{ note.date | upcase }}</time>
        <p>{{ note.text }}</p>
      </article>
    {% endfor %}
  </div>
  <img class="folio-ornament" src="{{ '/assets/img/folio/bunny-sepia-ornament.svg' | relative_url }}" alt="" width="17" height="27">
</article>
