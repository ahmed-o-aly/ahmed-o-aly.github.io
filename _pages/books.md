---
layout: default
title: Reading
permalink: /books/
description: Books and notes about institutions, competence, power, repair, and systems under stress.
nav: true
nav_order: 2
---

{% assign feature_book = site.books | first %}
{% assign volume_count = site.data.read_books.size | plus: site.books.size %}

<article class="folio-page folio-library-page">
  <a class="folio-back-link" href="{{ '/' | relative_url }}" data-page-turn>&larr; Back to the folio</a>
  <header class="folio-page__header" data-reveal>
    <p class="folio-kicker">The Library</p>
    <h1><span data-drift="6">{{ volume_count }} volumes, honestly rated.</span></h1>
    <p>{{ volume_count }} logged &middot; stories about institutions, competence, power, repair, and systems under stress.</p>
  </header>

{% if feature_book %}

<section class="folio-reading-feature" aria-labelledby="reading-feature-title" data-reveal>
<button
        class="folio-book-cover folio-book-cover--feature"
        type="button"
        style="--book-color: #41573f; --book-tilt: 1.2deg"
        data-book-trigger
        data-book-title="{{ feature_book.title | escape }}"
        data-book-author="{{ feature_book.author | escape }}"
        data-book-color="#41573f"
        data-book-rating="{{ feature_book.stars | default: 0 }}"
        data-book-status="{{ feature_book.status | default: 'On the shelf' | escape }}"
        data-book-notes="{{ feature_book.content | strip_html | strip_newlines | escape }}"
        aria-label="Open notes for {{ feature_book.title | escape }}"
      >
<span class="folio-book-cover__face"><strong>{{ feature_book.title }}</strong><small>{{ feature_book.author }}</small></span>
</button>
<div>
<p class="folio-kicker">From the shelf</p>
<h2 id="reading-feature-title">{{ feature_book.title }}</h2>
<p>{{ feature_book.content | strip_html | truncatewords: 55 }}</p>
<button class="folio-text-button" type="button" data-book-proxy>open the margin notes &rarr;</button>
</div>
</section>
{% endif %}

  <section class="folio-shelf-section" aria-labelledby="shelf-title">
    <div class="folio-section__heading">
      <h2 id="shelf-title">The shelf</h2>
      <p>click a spine for notes</p>
    </div>
    <div class="folio-shelf" role="group" aria-label="Books">
      {% for book in site.data.read_books %}
        {% assign variation = forloop.index0 | modulo: 9 %}
        {% case variation %}
          {% when 0 %}{% assign book_color = '#41573f' %}{% assign spine_width = 26 %}{% assign spine_height = 168 %}
          {% when 1 %}{% assign book_color = '#2f3546' %}{% assign spine_width = 32 %}{% assign spine_height = 184 %}
          {% when 2 %}{% assign book_color = '#7b3b2e' %}{% assign spine_width = 24 %}{% assign spine_height = 154 %}
          {% when 3 %}{% assign book_color = '#8a6d3b' %}{% assign spine_width = 29 %}{% assign spine_height = 176 %}
          {% when 4 %}{% assign book_color = '#5d4632' %}{% assign spine_width = 22 %}{% assign spine_height = 146 %}
          {% when 5 %}{% assign book_color = '#4a3b45' %}{% assign spine_width = 34 %}{% assign spine_height = 188 %}
          {% when 6 %}{% assign book_color = '#5a3226' %}{% assign spine_width = 27 %}{% assign spine_height = 162 %}
          {% when 7 %}{% assign book_color = '#6b4a2f' %}{% assign spine_width = 30 %}{% assign spine_height = 180 %}
          {% else %}{% assign book_color = '#3f4a3a' %}{% assign spine_width = 25 %}{% assign spine_height = 158 %}
        {% endcase %}
        <button
          class="folio-spine"
          type="button"
          style="--spine-color: {{ book_color }}; --spine-width: {{ spine_width }}px; --spine-height: {{ spine_height }}px"
          data-book-trigger
          data-book-title="{{ book.title | escape }}"
          data-book-author="{{ book.author | escape }}"
          data-book-color="{{ book_color }}"
          data-book-rating="{{ book.rating | default: 0 }}"
          data-book-status="{% if book.read_at %}Shelved &middot; {{ book.read_at | date: '%Y' }}{% else %}On the shelf{% endif %}"
          data-book-notes="{{ book.review | strip_newlines | escape }}"
          aria-label="Open notes for {{ book.title | escape }}"
        >
          <span>{{ book.title }}</span>
        </button>
      {% endfor %}
    </div>
    <div class="folio-shelf__plank" aria-hidden="true"></div>
  </section>
  <p class="folio-ornament" aria-hidden="true">❦</p>
</article>
