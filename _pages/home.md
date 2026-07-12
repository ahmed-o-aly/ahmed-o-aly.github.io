---
layout: home
title: Ahmed Aly
permalink: /
description: Decision-support systems for labs, public policy, and complex operations.
---

<section class="garden-home garden-container">
  <div class="garden-grid">
    <div class="garden-home__intro" data-reveal>
      <h1>
        Hey, I&rsquo;m <a href="{{ '/about/' | relative_url }}">Ahmed.</a> I build
        <strong>decision-support systems</strong> for labs, public policy, and complex operations.
        I also write about <a href="{{ '/blog/' | relative_url }}">simulation</a>,
        <a href="{{ '/books/' | relative_url }}">books</a>, and the practical details behind the work.
      </h1>
    </div>

    {% for card in site.data.home_garden %}
      {% case card.kind %}
        {% when 'project' %}
          {% assign item = site.projects | where: 'slug', card.ref | first %}
          {% if item %}{% include garden-project-card.liquid project=item size=card.size %}{% endif %}
        {% when 'post' %}
          {% assign item = site.posts | where: 'slug', card.ref | first %}
          {% if item %}{% include garden-post-card.liquid post=item size=card.size %}{% endif %}
        {% when 'book' %}
          {% assign item = site.books | where: 'slug', card.ref | first %}
          {% if item %}{% include garden-book-card.liquid book=item size=card.size %}{% endif %}
      {% endcase %}
    {% endfor %}

  </div>
</section>
