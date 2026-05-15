---
layout: page
title: books
permalink: /books/
description: A reading log imported from my Goodreads read shelf, with short notes on what each book left behind.
nav: true
nav_order: 2
---

<div class="books-intro">
  <p>
    This page is a public shelf: not a trophy case, more like a map of the stories, systems, institutions, and trade-offs that keep feeding the work.
  </p>
  <p>
    Source: <a href="https://www.goodreads.com/review/list/155320656?shelf=read">Goodreads read shelf</a>. The normal shelf page requires sign-in in some contexts, so the site uses the public Goodreads RSS feed for the same shelf.
  </p>
</div>

<div class="book-ledger">
  {% for book in site.data.read_books %}
    <article class="book-row">
      <div class="book-score">
        <span>{{ book.rating }}</span>
        <small>/5</small>
      </div>
      <div class="book-main">
        <h2><a href="{{ book.url }}">{{ book.title }}</a></h2>
        <p class="book-meta">{{ book.author }}{% if book.read_at %} / read {{ book.read_at }}{% endif %}</p>
        <p>{{ book.review }}</p>
      </div>
    </article>
  {% endfor %}
</div>
