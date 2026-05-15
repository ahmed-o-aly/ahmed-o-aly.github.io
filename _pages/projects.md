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

<div class="case-index">
  {% assign sorted_projects = site.projects | sort: "importance" %}
  {% for project in sorted_projects %}
    <article class="case-row">
      <a class="case-title" href="{{ project.url | relative_url }}">
        <span>0{{ forloop.index }}</span>
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
    </article>
  {% endfor %}
</div>
