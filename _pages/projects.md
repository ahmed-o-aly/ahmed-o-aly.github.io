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
    The work sits between operations, simulation, optimization, and public-sector decision support. The useful details
    are not just role and methods; they are the assumptions exposed, the constraints respected, the artifacts produced,
    and the reason someone could trust the system after the work was done.
  </p>
</div>

<section class="project-index-hero" aria-label="Project portfolio overview">
  <div>
    <span>case-study index</span>
    <h2>Five systems, one working pattern</h2>
    <p>
      Each project is presented as a working system: what had to become usable, what constrained the work, what was
      produced, and what proof is available to inspect.
    </p>
  </div>
  <ul>
    <li>lab readiness</li>
    <li>policy simulation</li>
    <li>energy modeling</li>
    <li>routing services</li>
    <li>open research</li>
  </ul>
</section>

<div class="case-index">
  {% assign sorted_projects = site.projects | sort: "importance" %}
  {% for project in sorted_projects %}
      <article class="case-row">
        <div class="case-indexmark" aria-hidden="true">0{{ forloop.index }}</div>
        {% include project-visual.liquid project=project compact=true %}
        <div class="case-main">
          <a class="case-title" href="{{ project.url | relative_url }}">
            <strong>{{ project.title }}</strong>
          </a>
          <p>{{ project.description }}</p>
          {% if project.problem %}
            <p class="case-problem"><span>Problem</span>{{ project.problem }}</p>
          {% endif %}
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
        {% if project.proof %}
          <div class="case-proof-tags" aria-label="Available proof">
            {% for item in project.proof limit: 4 %}
              <span>{{ item.label }}</span>
            {% endfor %}
          </div>
        {% endif %}
      </div>
    </article>
  {% endfor %}
</div>
