---
layout: home
title: Ahmed Aly
permalink: /
description: Lab Specialist for MetaHub and the Abu Dhabi School of Government workstream at Khalifa University.
---

<section class="home-hero" aria-label="Introduction">
  <div class="home-frame hero-frame">
    <div class="hero-copy">
      <h1>Ahmed Aly</h1>
      <div class="role-stack" aria-label="Current role">
        <strong>Lab Specialist</strong>
        <span>MetaHub AI/XR lab operations</span>
        <span>Abu Dhabi School of Government public-policy simulations</span>
      </div>
      <p class="hero-lede">
        I run immersive research operations and build policy simulations that help institutions reason with evidence.
      </p>
      <div class="hero-actions" aria-label="Primary links">
        <a href="{{ '/projects/' | relative_url }}">Selected work</a>
        <a href="{{ '/blog/' | relative_url }}">Writing</a>
        <a href="{{ '/cv/' | relative_url }}">CV</a>
      </div>
    </div>

    <div class="system-map" aria-label="Current work split">
      <div class="map-node node-large">
        <span>70%</span>
        <strong>ADSG</strong>
        <small>Facilities, policy simulations, proposals</small>
      </div>
      <div class="map-line line-one"></div>
      <div class="map-node node-small">
        <span>30%</span>
        <strong>MetaHub</strong>
        <small>AI/XR lab operations</small>
      </div>
      <div class="map-line line-two"></div>
      <div class="map-node node-wide">
        <span>CORE</span>
        <strong>Decision support</strong>
        <small>Optimization, simulation, research software</small>
      </div>
    </div>
  </div>
</section>

<section class="home-band">
  <div class="home-frame split-ledger" aria-label="Current responsibilities">
    <div>
      <p class="quiet-line">Current mandate</p>
      <h2>Operational enough to run. Analytical enough to matter.</h2>
    </div>
    <dl>
      <div>
        <dt>MetaHub</dt>
        <dd>Facility readiness, immersive AI/XR workflows, projection, AR/VR, haptics, control-room operations, vendor coordination, and training adoption.</dd>
      </div>
      <div>
        <dt>ADSG</dt>
        <dd>Department facilities, public-policy simulation prototypes, structured scenarios, stakeholder-ready proposals, and research planning.</dd>
      </div>
      <div>
        <dt>Research foundation</dt>
        <dd>Energy-system optimization, logistics algorithms, stochastic VNS, Gurobi/Pyomo models, simulation pipelines, and reproducible Python tools.</dd>
      </div>
    </dl>
  </div>
</section>

<section class="home-frame home-section" aria-label="Selected work">
  <div class="section-heading">
    <p class="quiet-line">Selected work</p>
    <h2>Projects as operating systems, not thumbnails.</h2>
  </div>
  <div class="work-ledger">
    {% assign sorted_projects = site.projects | sort: "importance" %}
    {% for project in sorted_projects limit: 5 %}
      <a class="work-row" href="{{ project.url | relative_url }}">
        <span class="work-index">0{{ forloop.index }}</span>
        <span class="work-title">
          <strong>{{ project.title }}</strong>
          <em>{{ project.description }}</em>
        </span>
        <span class="work-domain">{{ project.role }}</span>
      </a>
    {% endfor %}
  </div>
</section>

<section class="home-band reading-band">
  <div class="home-frame reading-split">
    <div>
      <p class="quiet-line">Reading and writing</p>
      <h2>A living shelf for books, work notes, and the ideas that keep showing up.</h2>
      <p>
        This site is also a blog. I will use it for project notes, public-policy simulation ideas, optimization walkthroughs, and reading reviews.
      </p>
      <a class="text-link" href="{{ '/books/' | relative_url }}">Open the reading log</a>
    </div>
    <ol class="mini-shelf" aria-label="Recent read books">
      {% for book in site.data.read_books limit: 6 %}
        <li>
          <span>{{ book.rating }}/5</span>
          <strong>{{ book.title }}</strong>
          <em>{{ book.author }}</em>
        </li>
      {% endfor %}
    </ol>
  </div>
</section>

<section class="home-frame home-section closing-grid" aria-label="Connect">
  <div>
    <p class="quiet-line">What I am useful for</p>
    <h2>Simulation rooms, research proposals, optimization code, and the bridge between them.</h2>
  </div>
  <div class="closing-links">
    <a href="{{ '/cv/' | relative_url }}">Experience and CV</a>
    <a href="{{ '/publications/' | relative_url }}">Publications</a>
    <a href="{{ '/projects/' | relative_url }}">Case studies</a>
    <a href="{{ '/blog/' | relative_url }}">Blog</a>
  </div>
</section>
