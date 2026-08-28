---
layout: default
permalink: /blog/
title: Writing
description: Notes on systems, simulations, labs, research software, and the work behind the work.
nav: true
nav_order: 1
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 10
  sort_field: date
  sort_reverse: true
---

<article class="folio-page folio-archive">
  <a class="folio-back-link" href="{{ '/' | relative_url }}" data-page-turn>&larr; Back to the folio</a>
  <header class="folio-page__header" data-reveal>
    <p class="folio-kicker">Essays &amp; Writing</p>
    <h1><span data-drift="6">The full archive.</span></h1>
    <p>It grows slowly, on purpose.</p>
  </header>

{% assign postlist = paginator.posts | default: site.posts %}
{% assign grouped_posts = postlist | group_by_exp: 'post', 'post.date | date: "%Y"' %}
{% for year in grouped_posts %}

<section class="folio-archive__year" aria-labelledby="year-{{ year.name }}">
<h2 id="year-{{ year.name }}">{{ year.name }}</h2>
<ol class="folio-essay-list folio-essay-list--archive">
{% for post in year.items %}
{% assign word_count = post.content | number_of_words %}
{% assign read_minutes = word_count | divided_by: 180 | plus: 1 %}
<li data-reveal>
<a href="{{ post.url | relative_url }}" data-page-turn>
<span class="folio-essay-list__number" aria-hidden="true">{% case forloop.index %}{% when 1 %}I.{% when 2 %}II.{% when 3 %}III.{% when 4 %}IV.{% when 5 %}V.{% else %}{{ forloop.index }}.{% endcase %}</span>
<span class="folio-essay-list__copy">
<span class="folio-essay-list__title">{{ post.title }}</span>
<span class="folio-essay-list__excerpt">{{ post.description }}</span>
</span>
<span class="folio-essay-list__meta"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%b %Y' }}</time> &middot; {{ read_minutes }} min</span>
</a>
</li>
{% endfor %}
</ol>
</section>
{% endfor %}
{% include pagination.liquid %}

  <p class="folio-ornament" aria-hidden="true">❦</p>
</article>
