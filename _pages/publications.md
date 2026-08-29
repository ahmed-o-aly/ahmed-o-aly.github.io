---
layout: page
permalink: /publications/
title: papers
description: Peer-reviewed work on delivery territory design, variable neighborhood search, and applied optimization.
eyebrow: Publications
display_title: Formal work and the artifacts around it.
nav: true
nav_order: 4
---

<!-- _pages/publications.md -->

<div class="publication-bridge">
  <p>
    The formal papers sit beside a
    <a href="{{ '/projects/territory-design-probvns/' | relative_url }}">practical project and code walkthrough</a>
    for the delivery territory design work.
  </p>
</div>

<section class="paper-impact-strip" aria-label="Publication impact trail">
  <article>
    <span>paper</span>
    <strong>Peer-reviewed method</strong>
    <p>Probability-based VNS for delivery territory design, published in Computers & Operations Research.</p>
  </article>
  <article>
    <span>code</span>
    <strong>Reusable artifact</strong>
    <p>Open repository with algorithms, benchmark instances, experiment logs, notebooks, and citation metadata.</p>
  </article>
  <article>
    <span>bridge</span>
    <strong>Readable walkthrough</strong>
    <p>The project page connects the formal result to the codebase, plotting workflow, and practical reuse path.</p>
  </article>
</section>

<section class="garden-publications">
  {% include bib_search.liquid %}
  <div class="publications">{% bibliography %}</div>
</section>
