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
  per_page: 5
  sort_field: date
  sort_reverse: true
  trail:
    before: 1
    after: 3
---

<div class="garden-writing">
  {% include garden-intro.liquid eyebrow='Writing' title='Notes from systems in progress.' description=page.description %}

  <nav class="garden-writing__archives" aria-label="Writing archives">
    <span>Browse the archive</span>
    <div>
      {% assign archive_years = site.posts | group_by_exp: 'post', 'post.date | date: "%Y"' %}
      {% for archive_year in archive_years %}
        {% assign year_path = archive_year.name | prepend: '/blog/' | append: '/' %}
        <a href="{{ year_path | relative_url }}" aria-label="Writing from {{ archive_year.name }}">{{ archive_year.name }}</a>
      {% endfor %}
      {% assign archive_tags = site.tags | sort %}
      {% for archive_tag in archive_tags %}
        {% assign tag_name = archive_tag[0] %}
        {% assign tag_path = tag_name | slugify | prepend: '/blog/tag/' | append: '/' %}
        <a href="{{ tag_path | relative_url }}">#{{ tag_name }}</a>
      {% endfor %}
      {% assign archive_categories = site.categories | sort %}
      {% for archive_category in archive_categories %}
        {% assign category_name = archive_category[0] %}
        {% assign category_path = category_name | slugify | prepend: '/blog/category/' | append: '/' %}
        <a href="{{ category_path | relative_url }}">{{ category_name }}</a>
      {% endfor %}
    </div>
  </nav>

{% assign postlist = paginator.posts | default: site.posts %}

  <section class="garden-writing-grid garden-grid" aria-label="Writing posts">
    {% for post in postlist %}
      {% assign size = 'standard' %}
      {% if forloop.first %}{% assign size = 'wide' %}{% endif %}
      {% include garden-post-card.liquid post=post size=size %}
    {% endfor %}
  </section>

{% include pagination.liquid %}

</div>
