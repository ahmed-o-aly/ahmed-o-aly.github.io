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
  <a class="folio-back-link" href="{{ '/' | relative_url }}">&larr; Back to the folio</a>
  <header class="folio-page__header">
    <p class="folio-kicker">Essays &amp; Writing</p>
    <h1>Working notes on decisions, systems, and the rooms they live in.</h1>
    <p>Longer arguments, technical walkthroughs, and notes from work in progress.</p>
  </header>

{% assign postlist = paginator.posts | default: site.posts %}
{% assign grouped_posts = postlist | group_by_exp: 'post', 'post.date | date: "%Y"' %}

  <div class="folio-archive__groups">
    {% for year in grouped_posts %}
      <section class="folio-archive__year" aria-labelledby="year-{{ year.name }}">
        <h2 id="year-{{ year.name }}">{{ year.name }}</h2>
        <ol class="folio-essay-ledger">
          {% for post in year.items %}
            {% assign word_count = post.content | number_of_words %}
            {% assign read_minutes = word_count | divided_by: 180 | plus: 1 %}
            <li>
              <span class="folio-ledger-number" aria-hidden="true">{{ forloop.index | prepend: '0' }}</span>
              <a class="folio-essay-ledger__copy" href="{{ post.url | relative_url }}">
                <span class="folio-essay-ledger__title">{{ post.title }}</span>
                <span class="folio-essay-ledger__excerpt">{{ post.description }}</span>
              </a>
              <span class="folio-essay-ledger__meta">
                <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%b %Y' }}</time>
                <span>{{ read_minutes }} min</span>
              </span>
            </li>
          {% endfor %}
        </ol>
      </section>
    {% endfor %}
  </div>

{% include pagination.liquid %}
<img class="folio-ornament" src="{{ '/assets/img/folio/bunny-sepia-ornament.svg' | relative_url }}" alt="" width="17" height="27">

</article>
