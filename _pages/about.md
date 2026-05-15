---
layout: home
title: Ahmed Aly
permalink: /
description: Lab Specialist for MetaHub and the Abu Dhabi School of Government workstream at Khalifa University.
---

<div class="garden-home" aria-label="Homepage">
  <header class="garden-masthead" aria-label="Introduction">
    <img
      src="{{ '/assets/img/ahmed-emblem.svg' | relative_url }}"
      alt="Decision systems emblem"
      class="garden-mark"
      loading="eager"
    >
    <div class="garden-title-block">
      <h1>Ahmed Aly</h1>
      <p class="garden-line garden-line-primary">Systems &amp; simulations</p>
      <p class="garden-line">And other useful apparatus</p>
      <p class="garden-line garden-line-small">For decisions that should not be guessed</p>
      <p class="garden-byline">kept by: ahmed aly</p>
      <div class="garden-rating" aria-label="Site motto">
        <span aria-hidden="true">* * * * *</span>
        <p>"Making institutional decisions easier to inspect before they harden."</p>
      </div>
    </div>
  </header>

  <article class="garden-intro">
    <p>
      <span class="garden-dropcap" aria-hidden="true">I</span><span class="sr-only">I</span> build decision-support
      systems for labs, policy teams, and operations problems where the real work is hidden in assumptions. At Khalifa
      University, my current work lives between the MetaHub AI/XR lab and the Abu Dhabi School of Government workstream:
      facilities, simulation prototypes, proposals, vendor coordination, research software, and the routines that make
      expensive systems usable.
    </p>
    <p>
      This site is both a portfolio and a notebook. You can read the
      <a href="{{ '/projects/' | relative_url }}">selected work</a>, browse
      <a href="{{ '/blog/' | relative_url }}">field notes</a>, inspect the
      <a href="{{ '/cv/' | relative_url }}">CV</a>, or send a note through the links below.
    </p>
  </article>

  <section class="garden-section" aria-label="Selected projects">
    <h2>Selected schemes</h2>
    <div class="garden-link-list">
      {% assign sorted_projects = site.projects | sort: "importance" %}
      {% for project in sorted_projects limit: 5 %}
        <a href="{{ project.url | relative_url }}" class="garden-feature-link">
          <span>{{ project.title }}</span>
          <em>{{ project.description }}</em>
        </a>
      {% endfor %}
    </div>
  </section>

  <section class="garden-section" aria-label="Current practice">
    <h2>Current plots</h2>
    <dl class="garden-briefs">
      <div>
        <dt>MetaHub</dt>
        <dd>AI/XR lab readiness, immersive facility workflows, AR/VR, haptics, projection, control-room operations.</dd>
      </div>
      <div>
        <dt>ADSG</dt>
        <dd>Public-policy simulation prototypes, department facilities, proposal development, and stakeholder framing.</dd>
      </div>
      <div>
        <dt>Optimization</dt>
        <dd>Python models for logistics, energy systems, territory design, search heuristics, and scenario planning.</dd>
      </div>
    </dl>
  </section>

  <section class="garden-section" aria-label="Latest posts">
    <h2>Latest notebook entries</h2>
    <div class="garden-post-list">
      {% for post in site.posts limit: 5 %}
        <a href="{{ post.url | relative_url }}" class="garden-post-row">
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b" }}</time>
          <span>{{ post.title }}</span>
        </a>
      {% endfor %}
    </div>
    <p class="garden-note">
      More notes can be found in <a href="{{ '/blog/' | relative_url }}">the writing archive</a>.
    </p>
  </section>

  <section class="garden-section" aria-label="More links">
    <h2>More, other, and additional</h2>
    <div class="garden-link-list">
      <a href="{{ '/books/' | relative_url }}" class="garden-feature-link">
        <span>Books</span>
        <em>A reading shelf for institutions, incentives, systems, and useful trouble.</em>
      </a>
      <a href="{{ '/publications/' | relative_url }}" class="garden-feature-link">
        <span>Publications</span>
        <em>Research artifacts, papers, and the more formal side of the work.</em>
      </a>
      <a href="{{ '/cv/' | relative_url }}" class="garden-feature-link">
        <span>Curriculum vitae</span>
        <em>Experience, tools, roles, and the longer professional record.</em>
      </a>
    </div>
  </section>
</div>
