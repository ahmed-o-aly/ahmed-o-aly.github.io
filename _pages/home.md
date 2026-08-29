---
layout: home
title: Ahmed Aly
permalink: /
description: Decision-support systems for labs, public policy, and complex operations.
---

<section class="folio-hero garden-container">
  <p class="folio-hero__kicker">A study of decisions, books, and small obsessions.</p>
  <h1>Decision-support systems for labs, public policy &amp; complex operations.</h1>
  <div class="folio-hero__lower">
    <p class="folio-lede">
      Simulations, mathematics, and the occasional venture into virtual reality. I build systems that help people inspect what is happening, test what might happen, and decide what to do next. Away from the desk: piano, slow coffee, and the company of bunnies and cats.
    </p>
    <aside class="folio-currently" aria-label="Currently">
      <dl>
        <div><dt>Studying</dt><dd>Data Science at Leeds</dd></div>
        <div><dt>Building</dt><dd><a href="{{ '/projects/sila/' | relative_url }}">Sila</a></dd></div>
        <div><dt>Exploring</dt><dd>AI and XR laboratories</dd></div>
      </dl>
    </aside>
  </div>
</section>

{% assign latest_post = site.posts | first %}

<section class="folio-writing-ledger garden-container" aria-label="Latest writing">
  <span class="folio-mono-label">Essays &amp; Writing</span>
  {% if latest_post %}
    <div class="folio-writing-ledger__entry">
      <span>latest:</span>
      <a class="folio-writing-ledger__title" href="{{ latest_post.url | relative_url }}">{{ latest_post.title }}</a>
      <time datetime="{{ latest_post.date | date_to_xmlschema }}">{{ latest_post.date | date: '%b %Y' }}</time>
    </div>
  {% endif %}
  <a class="folio-ink-link" href="{{ '/blog/' | relative_url }}">the full archive &rarr;</a>
</section>

<section class="folio-selected-works garden-container" aria-labelledby="works-title">
  <div class="folio-section__heading">
    <h2 id="works-title">Selected Works</h2>
    <a class="folio-ink-link" href="{{ '/projects/' | relative_url }}">all works &rarr;</a>
  </div>
  {% assign selected_projects = site.projects | where_exp: 'project', 'project.work_number' | sort: 'work_number' %}
  <ol class="folio-work-index folio-work-index--home" role="list">
    {% for project in selected_projects limit: 2 %}{% include folio-work-card.liquid project=project index=project.work_number heading_level=3 %}{% endfor %}
  </ol>
</section>

{% assign current_book = site.data.currently_reading | first %}
{% if current_book %}
{% assign home_read_limit = 2 %}
{% else %}
{% assign home_read_limit = 3 %}
{% endif %}

<section class="folio-library" aria-labelledby="library-title">
  <div class="folio-library__watermark" data-parallax-y="-60" aria-hidden="true">Bibliotheca</div>
  <div class="garden-container folio-library__inner">
    <div class="folio-library__heading">
      <p class="folio-mono-label">The library</p>
      <h2 id="library-title">Books that keep returning to the desk.</h2>
      <a class="folio-ink-link folio-ink-link--cream" href="{{ '/books/' | relative_url }}">the whole library &rarr;</a>
    </div>
    <div class="folio-library__content{% unless current_book %} folio-library__content--covers-only{% endunless %}">
      <div class="folio-cover-row" aria-label="A few books from the library">
        {% if current_book %}
          <button
            class="folio-cover-wrap folio-cover-wrap--button"
            type="button"
            data-parallax-y="30"
            data-book-trigger
            data-book-title="{{ current_book.title | escape }}"
            data-book-author="{{ current_book.author | escape }}"
            data-book-cover="{{ current_book.cover | escape }}"
            data-book-rating="{{ current_book.rating | escape }}"
            data-book-status="Currently reading"
            data-book-review="{{ current_book.review | default: '' | newline_to_br | strip_newlines | escape }}"
            data-book-url="{{ current_book.url | escape }}"
            data-book-progress="{{ current_book.progress_percent | escape }}"
            data-book-progress-label="{{ current_book.progress_label | escape }}"
            aria-label="Open details for {{ current_book.title | escape }} by {{ current_book.author | escape }}{% if current_book.progress_label != blank %}, {{ current_book.progress_label | escape }}{% endif %}"
          >
            <img
              src="{{ current_book.cover | escape }}"
              alt=""
              width="132"
              height="196"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
            >
          </button>
        {% endif %}
        {% for book in site.data.read_books limit: home_read_limit %}
          {% if current_book %}
            {% case forloop.index %}
              {% when 1 %}
                {% assign travel = '55' %}
              {% else %}
                {% assign travel = '80' %}
            {% endcase %}
          {% else %}
            {% case forloop.index %}
              {% when 1 %}
                {% assign travel = '30' %}
              {% when 2 %}
                {% assign travel = '55' %}
              {% else %}
                {% assign travel = '80' %}
            {% endcase %}
          {% endif %}
          {% assign book_status = book.status | default: 'Read' %}
          <button
            class="folio-cover-wrap folio-cover-wrap--button"
            type="button"
            data-parallax-y="{{ travel }}"
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
            <img
              src="{{ book.cover | escape }}"
              alt=""
              width="132"
              height="196"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
            >
          </button>
        {% endfor %}
      </div>
      {% if current_book %}
        <div class="folio-library__current">
          <p class="folio-mono-label">Currently reading</p>
          <h3>{{ current_book.title }}</h3>
          <p>{{ current_book.author }}</p>
        </div>
      {% endif %}
    </div>
  </div>
</section>
