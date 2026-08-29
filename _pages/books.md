---
layout: default
title: Reading
permalink: /books/
description: Books I am reading and have finished, synced from Goodreads.
nav: true
nav_order: 2
---

{% assign current_books = site.data.currently_reading %}
{% assign current_book_count = current_books.size %}

<article class="folio-page folio-library-page">
  <a class="folio-back-link" href="{{ '/' | relative_url }}">&larr; Back to the folio</a>
  <header class="folio-page__header">
    <p class="folio-kicker">Bibliotheca</p>
    <h1>What I’m reading, and what I’ve finished.</h1>
    <p>Synced from Goodreads, with my ratings and reviews when I’ve written one.</p>
  </header>

{% if current_books != empty %}

  <section class="folio-current-reading" aria-labelledby="current-reading-title">
    <div class="folio-reading-banner" data-reading-carousel>
      <div class="folio-reading-banner__heading">
        <h2 class="folio-reading-banner__label" id="current-reading-title">Currently reading</h2>
        {% if current_book_count > 1 %}
          <div class="folio-reading-banner__controls" data-reading-controls hidden>
            <button
              type="button"
              data-reading-previous
              aria-label="Show previous current book"
              aria-controls="current-reading-list"
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <span class="folio-reading-banner__position" data-reading-position aria-live="polite" aria-atomic="true">
              1 of {{ current_book_count }}
            </span>
            <button
              type="button"
              data-reading-next
              aria-label="Show next current book"
              aria-controls="current-reading-list"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        {% endif %}
      </div>
      <ul class="folio-reading-banner__list" id="current-reading-list">
        {% for book in current_books %}
          {% assign display_title = book.title | split: ' (' | first %}
          <li
            class="folio-reading-banner__item"
            data-reading-slide
            role="listitem"
            aria-roledescription="slide"
            aria-label="{{ forloop.index }} of {{ current_book_count }}"
          >
            <button
              class="folio-reading-banner__book"
              type="button"
              data-book-trigger
              data-book-title="{{ book.title | escape }}"
              data-book-author="{{ book.author | escape }}"
              data-book-cover="{{ book.cover | escape }}"
              data-book-rating="{{ book.rating | escape }}"
              data-book-status="Currently reading"
              data-book-review="{{ book.review | default: '' | newline_to_br | strip_newlines | escape }}"
              data-book-url="{{ book.url | escape }}"
              data-book-progress="{{ book.progress_percent | escape }}"
              data-book-progress-label="{{ book.progress_label | escape }}"
              aria-label="Open details for {{ book.title | escape }} by {{ book.author | escape }}{% if book.progress_label != blank %}, {{ book.progress_label | escape }}{% endif %}"
            >
              <span class="folio-reading-banner__jacket">
                <span class="folio-reading-banner__fallback" aria-hidden="true">{{ display_title }}</span>
                <img
                  src="{{ book.cover | escape }}"
                  alt=""
                  width="88"
                  height="132"
                  decoding="async"
                  referrerpolicy="no-referrer"
                  data-book-cover-image
                >
              </span>
              <span class="folio-reading-banner__copy">
                <span class="folio-reading-banner__title">{{ display_title }}</span>
                <span class="folio-reading-banner__author">{{ book.author }}</span>
                {% if book.progress_percent != blank %}
                  <span class="folio-reading-banner__progress" aria-label="Reading progress: {{ book.progress_label | escape }}">
                    <span class="folio-reading-banner__progress-track" aria-hidden="true">
                      <span style="width: {{ book.progress_percent }}%"></span>
                    </span>
                    <span class="folio-reading-banner__progress-value">{{ book.progress_label }}</span>
                  </span>
                {% endif %}
              </span>
            </button>
          </li>
        {% endfor %}
      </ul>
    </div>
  </section>
{% endif %}

  <section class="folio-shelf-section" aria-labelledby="shelf-title">
    <div class="folio-section__heading">
      <h2 id="shelf-title">Read</h2>
      <p>open a cover</p>
    </div>
    <ul class="folio-cover-grid" aria-label="Books">
      {% for book in site.data.read_books %}
        {% assign display_title = book.title | split: ' (' | first %}
        {% assign book_status = book.status | default: 'Read' %}
        <li class="folio-cover-grid__item">
          <button
            class="folio-cover-card"
            type="button"
            data-book-trigger
            data-book-title="{{ book.title | escape }}"
            data-book-author="{{ book.author | escape }}"
            data-book-cover="{{ book.cover | escape }}"
            data-book-rating="{{ book.rating | escape }}"
            data-book-status="{{ book_status | escape }}{% if book.read_at != blank %} &middot; {{ book.read_at | date: '%Y' }}{% endif %}"
            data-book-review="{{ book.review | default: '' | newline_to_br | strip_newlines | escape }}"
            data-book-url="{{ book.url | escape }}"
            aria-label="Open details for {{ book.title | escape }} by {{ book.author | escape }}{% if book.rating != blank %}, rated {{ book.rating }} out of 5{% endif %}"
          >
            <span class="folio-cover-card__jacket">
              <span class="folio-cover-card__fallback" aria-hidden="true">{{ display_title }}</span>
              <img
                src="{{ book.cover | escape }}"
                alt=""
                width="320"
                height="480"
                loading="lazy"
                decoding="async"
                referrerpolicy="no-referrer"
                data-book-cover-image
              >
            </span>
            <span class="folio-cover-card__title">{{ display_title }}</span>
            <span class="folio-cover-card__author">{{ book.author }}</span>
            <span class="folio-cover-card__meta">
              {% if book.rating != blank %}
                <span class="folio-cover-card__rating">
                  <span class="sr-only">My rating: {{ book.rating }} out of 5.</span>
                  <span aria-hidden="true">&#9733; {{ book.rating }}/5</span>
                </span>
                <span class="folio-cover-card__separator" aria-hidden="true">&middot;</span>
              {% endif %}
              <span class="folio-cover-card__status">
                {{ book_status }}
                {% if book.read_at != blank %}
                  <time datetime="{{ book.read_at }}">{{ book.read_at | date: '%Y' }}</time>
                {% endif %}
              </span>
            </span>
          </button>
        </li>
      {% endfor %}
    </ul>
  </section>

  <img class="folio-ornament" src="{{ '/assets/img/folio/bunny-sepia-ornament.svg' | relative_url }}" alt="" width="17" height="27">
</article>
