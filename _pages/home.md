---
layout: home
title: Ahmed Aly
permalink: /
description: Decision-support systems for labs, public policy, and complex operations.
---

<section class="folio-hero garden-container">
  <p class="folio-kicker" data-reveal>Ahmed &middot; Operations Research &amp; Decision Systems</p>
  <h1 data-reveal><span data-drift="8">A study of decisions, books, and small obsessions.</span></h1>
  <div class="folio-hero__lower" data-reveal>
    <p class="folio-lede">
      <span class="folio-dropcap" aria-hidden="true">I</span><span class="sr-only">I</span> build decision-support systems for laboratories, public policy, and complex operations &mdash; simulations, mathematics, and the occasional venture into virtual reality. Away from the desk: piano, slow coffee, and the company of bunnies and cats.
    </p>
    <aside class="folio-currently" aria-label="Currently">
      <p>Currently studying &mdash; <span>Data Science at Leeds</span></p>
      <p>Currently building &mdash; <span>public-policy simulations</span></p>
      <p>Currently exploring &mdash; <span>AI and XR laboratories</span></p>
    </aside>
  </div>
</section>

<section id="sec-writing" class="folio-section folio-writing garden-container" aria-labelledby="writing-title">
  <div class="folio-section__heading" data-reveal>
    <h2 id="writing-title">Essays &amp; Writing</h2>
    <a class="folio-ink-link" href="{{ '/blog/' | relative_url }}" data-page-turn>the full archive &rarr;</a>
  </div>
  <ol class="folio-essay-list">
    {% for post in site.posts limit: 3 %}
      {% assign word_count = post.content | number_of_words %}
      {% assign read_minutes = word_count | divided_by: 180 | plus: 1 %}
      <li data-reveal>
        <a href="{{ post.url | relative_url }}" data-page-turn>
          <span class="folio-essay-list__number" aria-hidden="true">{% case forloop.index %}{% when 1 %}I.{% when 2 %}II.{% when 3 %}III.{% endcase %}</span>
          <span class="folio-essay-list__title">{{ post.title }}</span>
          <span class="folio-essay-list__meta"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%b %Y' }}</time> &middot; {{ read_minutes }} min</span>
        </a>
      </li>
    {% endfor %}
  </ol>
</section>

<section id="sec-library" class="folio-library" aria-labelledby="library-title">
  <div class="folio-library__watermark" data-parallax="-0.06" aria-hidden="true">Bibliotheca</div>
  <div class="garden-container folio-library__inner">
    <div class="folio-section__heading" data-reveal>
      <h2 id="library-title">The Library</h2>
      <a class="folio-ink-link folio-ink-link--cream" href="{{ '/books/' | relative_url }}" data-page-turn>the whole library &rarr;</a>
    </div>
    <div class="folio-library__content">
      <div class="folio-cover-row">
        {% assign feature_book = site.books | first %}
        {% if feature_book %}
          <div class="folio-cover-wrap" data-parallax="0.03">
            <button
              class="folio-book-cover"
              type="button"
              style="--book-color: #41573f; --book-tilt: -1deg"
              data-reveal
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
              <span class="folio-book-cover__caption">{% for star in (1..5) %}{% if star <= feature_book.stars %}★{% else %}☆{% endif %}{% endfor %}</span>
            </button>
          </div>
        {% endif %}
        {% for book in site.data.read_books limit: 3 %}
          {% case forloop.index %}{% when 1 %}{% assign book_color = '#2f3546' %}{% assign tilt = '1deg' %}{% assign parallax = '0.055' %}{% when 2 %}{% assign book_color = '#7b3b2e' %}{% assign tilt = '-1deg' %}{% assign parallax = '0.08' %}{% else %}{% assign book_color = '#8a6d3b' %}{% assign tilt = '1deg' %}{% assign parallax = '0.105' %}{% endcase %}
          <div class="folio-cover-wrap" data-parallax="{{ parallax }}">
            <button
              class="folio-book-cover"
              type="button"
              style="--book-color: {{ book_color }}; --book-tilt: {{ tilt }}"
              data-reveal
              data-book-trigger
              data-book-title="{{ book.title | escape }}"
              data-book-author="{{ book.author | escape }}"
              data-book-color="{{ book_color }}"
              data-book-rating="{{ book.rating | default: 0 }}"
              data-book-status="{% if book.read_at %}Shelved &middot; {{ book.read_at | date: '%Y' }}{% else %}On the shelf{% endif %}"
              data-book-notes="{{ book.review | strip_newlines | escape }}"
              aria-label="Open notes for {{ book.title | escape }}"
            >
              <span class="folio-book-cover__face"><strong>{{ book.title }}</strong><small>{{ book.author }}</small></span>
              <span class="folio-book-cover__caption">{% for star in (1..5) %}{% if star <= book.rating %}★{% else %}☆{% endif %}{% endfor %}</span>
            </button>
          </div>
        {% endfor %}
      </div>
      <blockquote class="folio-library__quote" data-reveal data-drift="5">
        <p>&ldquo;People rarely act inside clean mathematical abstractions; systems are shaped by informal incentives as much as formal ones.&rdquo;</p>
        <cite>&mdash; margin note, <em>The Godfather</em></cite>
      </blockquote>
    </div>
  </div>
</section>

<section id="sec-works" class="folio-section garden-container" aria-labelledby="works-title">
  <div class="folio-section__heading" data-reveal>
    <h2 id="works-title">Selected Works</h2>
    <a class="folio-ink-link" href="{{ '/projects/' | relative_url }}" data-page-turn>all works &rarr;</a>
  </div>
  {% assign selected_projects = site.projects | where_exp: 'project', 'project.preview != true' | sort: 'importance' %}
  <div class="folio-work-grid">
    {% for project in selected_projects limit: 2 %}{% include folio-work-card.liquid project=project index=forloop.index %}{% endfor %}
  </div>
</section>

{% assign experience = site.data.cv | where: 'title', 'Experience' | first %}
{% assign certifications = site.data.cv | where: 'title', 'Certifications' | first %}

<section id="sec-records" class="folio-section garden-container" aria-labelledby="records-title">
  <div class="folio-section__heading" data-reveal>
    <h2 id="records-title">Cabinet of Records</h2>
    <a class="folio-ink-link" href="{{ '/cv/' | relative_url }}" data-page-turn>the full record &rarr;</a>
  </div>
  <div class="folio-records-grid">
    <div data-reveal>
      <h3 class="folio-subtitle">Curriculum vitae</h3>
      <div class="folio-timeline">
        {% for role in experience.contents limit: 3 %}
          <article>
            <time>{{ role.year }}</time>
            <div><h4>{{ role.title }}</h4><p>{{ role.institution }}</p></div>
          </article>
        {% endfor %}
      </div>
      <a class="folio-button" href="{{ '/assets/pdf/Ahmed Aly CV.pdf' | relative_url }}">Download the full CV &darr;</a>
    </div>
    <div class="folio-certificate-stack" data-reveal>
      {% for certificate in certifications.contents limit: 2 %}
        <article class="folio-certificate">
          <span>Certificate</span>
          <h3>{{ certificate.title }}</h3>
          <p>{{ certificate.institution }} &middot; {{ certificate.year }}</p>
        </article>
      {% endfor %}
      <article class="folio-certificate">
        <span>Diploma</span>
        <h3>BSc. Applied Mathematics &amp; Statistics</h3>
        <p>Khalifa University &middot; 2021</p>
      </article>
    </div>
  </div>
</section>

<section id="sec-marginalia" class="folio-section folio-marginalia garden-container" aria-labelledby="marginalia-title">
  <div class="folio-marginalia__heading" data-reveal>
    <h2 id="marginalia-title">Marginalia</h2>
    <a class="folio-ink-link" href="{{ '/marginalia/' | relative_url }}" data-page-turn>everything &rarr;</a>
  </div>
  <div class="folio-marginalia__list">
    {% for note in site.data.marginalia limit: 3 %}
      <p data-reveal><time>{{ note.date | upcase }} &mdash;</time> {{ note.text }}</p>
    {% endfor %}
  </div>
</section>

<section id="sec-about" class="folio-about garden-container" aria-labelledby="about-title">
  <div data-reveal>
    <p class="folio-kicker">About</p>
    <h2 id="about-title">I work where models meet the rooms, teams, and institutions that must use them.</h2>
    <p>My practice spans lab operations, public-policy simulation, optimization, research software, and decision support. The recurring aim is simple: make complex systems inspectable enough to trust and practical enough to operate.</p>
  </div>
  <aside id="contact" data-reveal>
    <p class="folio-kicker">Correspondence</p>
    <a href="mailto:ahmed.oss.aly@gmail.com">ahmed.oss.aly@gmail.com</a>
    <p>Questions, collaborations, and thoughtful letters are welcome.</p>
  </aside>
</section>
