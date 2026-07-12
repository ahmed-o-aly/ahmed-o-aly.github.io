---
layout: page
title: Reading
permalink: /books/
description: Books and notes about institutions, competence, power, repair, and systems under stress.
eyebrow: Reading
display_title: A public shelf of ideas that keep feeding the work.
nav: true
nav_order: 2
---

<section class="garden-reading-threads" aria-labelledby="reading-threads-title">
  <h2 id="reading-threads-title">Reading threads</h2>
  <div class="garden-reading-threads__grid">
    {% for thread in site.data.reading_threads %}
      <article>
        <h3>{{ thread.title }}</h3>
        <p>{{ thread.summary }}</p>
        <p class="garden-reading-threads__examples">
          {% for example in thread.examples %}
            <span>{{ example }}</span>{% unless forloop.last %}<span aria-hidden="true">&middot;</span>{% endunless %}
          {% endfor %}
        </p>
      </article>
    {% endfor %}
  </div>
</section>

{% assign collection_book_keys = '|' %}

<section class="garden-reading-shelf" aria-labelledby="full-reviews-title">
  <h2 id="full-reviews-title" class="garden-reading-shelf__title">Full reviews</h2>
  <div class="garden-book-grid garden-grid">
    {% for book in site.books %}
      {% assign canonical_book_title = book.title | slugify %}
      {% assign canonical_book_author = book.author | slugify %}
      {% assign canonical_book_key = canonical_book_title | append: '::' | append: canonical_book_author %}
      {% assign canonical_book_marker = '|' | append: canonical_book_key | append: '|' %}
      {% assign collection_book_keys = collection_book_keys | append: canonical_book_marker %}
      {% include garden-book-card.liquid book=book size='standard' %}
    {% endfor %}
  </div>
</section>

<section class="garden-reading-shelf" aria-labelledby="reading-log-title">
  <h2 id="reading-log-title" class="garden-reading-shelf__title">Reading log</h2>
  <div class="garden-book-grid garden-grid">
    {% for book in site.data.read_books %}
      {% assign canonical_book_title = book.title | slugify %}
      {% assign canonical_book_author = book.author | slugify %}
      {% assign canonical_book_key = canonical_book_title | append: '::' | append: canonical_book_author %}
      {% assign canonical_book_marker = '|' | append: canonical_book_key | append: '|' %}
      {% unless collection_book_keys contains canonical_book_marker %}
        {% include garden-book-card.liquid book=book size='standard' %}
      {% endunless %}
    {% endfor %}
  </div>
</section>
