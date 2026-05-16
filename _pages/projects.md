---
layout: page
title: projects
permalink: /projects/
description: Case-study rows across MetaHub, ADSG policy simulations, energy optimization, logistics, and delivery-territory design.
nav: true
nav_order: 3
---

<div class="case-intro">
  <p>
    The work sits between operations, simulation, optimization, and public-sector decision support. The useful details are role, methods, status, and why each system matters.
  </p>
</div>

<div class="thread-list case-thread-list" aria-label="Project threads">
  {% for thread in site.data.work_threads %}
    {% if thread.key != "reading-systems" %}
      <article class="thread-row">
        <div class="thread-kicker">{{ thread.label }}</div>
        <div>
          <h2>{{ thread.title }}</h2>
          <p>{{ thread.summary }}</p>
        </div>
      </article>
    {% endif %}
  {% endfor %}
</div>

<div class="case-index">
  {% assign sorted_projects = site.projects | sort: "importance" %}
  {% for project in sorted_projects %}
    <article class="case-row">
      <div class="case-indexmark" aria-hidden="true">0{{ forloop.index }}</div>
      <div class="case-main">
        <a class="case-title" href="{{ project.url | relative_url }}">
          <strong>{{ project.title }}</strong>
        </a>
        <p>{{ project.description }}</p>
        <dl>
          <div>
            <dt>Role</dt>
            <dd>{{ project.role }}</dd>
          </div>
          <div>
            <dt>Methods</dt>
            <dd>{{ project.methods }}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{{ project.status }}</dd>
          </div>
        </dl>
        {% if project.signals %}
          <ul class="case-signals">
            {% for signal in project.signals limit: 2 %}
              <li>{{ signal }}</li>
            {% endfor %}
          </ul>
        {% endif %}
      </div>
    </article>
  {% endfor %}
</div>
