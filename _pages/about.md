---
layout: home
title: Ahmed Aly
permalink: /
description: Lab Specialist for MetaHub and the Abu Dhabi School of Government workstream at Khalifa University.
---

{% assign sorted_projects = site.projects | sort: "importance" %}
{% assign experience_section = site.data.cv | where: "title", "Experience" | first %}

<div class="ii-site" data-portfolio-app>
  <header class="ii-header" aria-label="Site header">
    <a class="ii-logo" href="#/hello/" data-route-link aria-label="Ahmed Aly home">
      <span class="ii-logo-glyph" aria-hidden="true">
        <span></span><span></span><span></span>
      </span>
      <span class="ii-logo-text">
        <strong>Ahmed Aly</strong>
        <em>decision systems</em>
      </span>
    </a>

    <button class="ii-menu" type="button" data-menu-toggle aria-label="Open navigation" aria-expanded="false">
      <span></span><span></span><span></span><span></span>
    </button>
  </header>

  <nav class="ii-primary-nav" data-menu-panel aria-hidden="true" inert aria-label="Primary navigation">
    <button class="ii-nav-overlay" type="button" data-menu-close aria-label="Close navigation"></button>
    <ul>
      <li><a href="#/hello/" data-route-link data-route-name="hello"><span>He</span><em>hello</em></a></li>
      <li><a href="#/about/" data-route-link data-route-name="about"><span>Ab</span><em>about</em></a></li>
      <li><a href="#/work/" data-route-link data-route-name="work"><span>Wo</span><em>work</em></a></li>
      <li><a href="#/notebook/" data-route-link data-route-name="notebook"><span>No</span><em>notebook</em></a></li>
      <li><a href="#/books/" data-route-link data-route-name="books"><span>Bo</span><em>books</em></a></li>
      <li><a href="#/papers/" data-route-link data-route-name="papers"><span>Pa</span><em>papers</em></a></li>
      <li><a href="#/cv/" data-route-link data-route-name="cv"><span>Cv</span><em>cv</em></a></li>
      <li><a href="#/contact/" data-route-link data-route-name="contact"><span>Ct</span><em>contact</em></a></li>
    </ul>
  </nav>

  <main class="ii-main" id="portfolio-main">
    <section class="ii-section ii-hello is-active is-revealed" data-route="hello" aria-labelledby="hello-title">
      <div class="ii-container ii-narrow">
        <h1 class="ii-title-slab" id="hello-title">
          <span data-scramble="Decision systems">Decision systems</span>
        </h1>
        <div class="ii-prose">
          <p>
            I am <a href="#/about/" data-route-link>Ahmed Aly,</a> a lab specialist and research-software builder
            working across AI/XR facilities, public-policy simulations, optimization models, and the routines that make
            expensive systems usable.
          </p>
          <p>
            This is a portfolio and working notebook for decisions that should not be guessed. Start with
            <a href="#/work/" data-route-link>selected work</a>, read the
            <a href="#/notebook/" data-route-link>notebook</a>, inspect the <a href="#/cv/" data-route-link>CV</a>,
            or use the menu to jump around.
          </p>
        </div>

        <hr class="ii-rule">

        <nav class="ii-route-tiles" aria-label="Homepage sections">
          <a class="ii-route-tile" href="#/about/" data-route-link>
            <span>Ab</span>
            <em>about</em>
          </a>
          <a class="ii-route-tile" href="#/work/" data-route-link>
            <span>Wo</span>
            <em>work</em>
          </a>
          <a class="ii-route-tile" href="#/notebook/" data-route-link>
            <span>No</span>
            <em>notebook</em>
          </a>
          <a class="ii-route-tile" href="#/books/" data-route-link>
            <span>Bo</span>
            <em>books</em>
          </a>
          <a class="ii-route-tile" href="#/papers/" data-route-link>
            <span>Pa</span>
            <em>papers</em>
          </a>
          <a class="ii-route-tile" href="#/cv/" data-route-link>
            <span>Cv</span>
            <em>cv</em>
          </a>
          <a class="ii-route-tile" href="#/contact/" data-route-link>
            <span>Ct</span>
            <em>contact</em>
          </a>
        </nav>
      </div>
    </section>

    <section class="ii-section" data-route="about" aria-labelledby="about-title">
      <div class="ii-container">
        <h1 class="ii-title-slab" id="about-title">
          <span data-scramble="// about">// about</span>
          <i aria-hidden="true">i</i>
        </h1>
        <div class="ii-split">
          <div class="ii-prose">
            <p>
              I build decision-support systems for labs, policy teams, and operations problems where the real work is
              hidden in assumptions. At Khalifa University, my current work sits between the MetaHub AI/XR lab and the
              Abu Dhabi School of Government workstream.
            </p>
            <p>
              That means facility readiness, simulation prototypes, proposals, vendor coordination, research software,
              and the translation layer between technical systems and people who need to trust them.
            </p>
          </div>
          <div class="ii-skillset" aria-label="Work focus breakdown">
            <h2>Focus Breakdown</h2>
            <div class="ii-skill" style="--percent: 95%">
              <span>MetaHub AI/XR readiness</span><strong>95%</strong>
            </div>
            <div class="ii-skill" style="--percent: 88%">
              <span>Policy simulation framing</span><strong>88%</strong>
            </div>
            <div class="ii-skill" style="--percent: 84%">
              <span>Optimization software</span><strong>84%</strong>
            </div>
            <div class="ii-skill" style="--percent: 78%">
              <span>Research operations</span><strong>78%</strong>
            </div>
            <div class="ii-skill" style="--percent: 72%">
              <span>Stakeholder translation</span><strong>72%</strong>
            </div>
          </div>
        </div>
        <hr class="ii-rule">
        <p class="ii-center-note">Current home base: Khalifa University, Abu Dhabi.</p>
      </div>
    </section>

    <section class="ii-section" data-route="work" aria-labelledby="work-title">
      <div class="ii-container">
        <h1 class="ii-title-slab" id="work-title">
          <span data-scramble="// work">// work</span>
          <i aria-hidden="true">w</i>
        </h1>
        <div class="ii-case-grid" aria-label="Selected work">
          {% for project in sorted_projects %}
            <a class="ii-case-panel" href="{{ project.url | relative_url }}">
              <span class="ii-case-bg{% if project.slug == 'territory-design-probvns' %} ii-case-bg-image{% endif %}"{% if project.slug == 'territory-design-probvns' %} style="--case-image: url('{{ '/assets/img/output.png' | relative_url }}')"{% endif %} aria-hidden="true"></span>
              <span class="ii-case-copy">
                <strong>{{ project.title }}</strong>
                <em>{{ project.description }}</em>
                <span class="ii-case-meta">{{ project.role }}</span>
                <span class="ii-cta">See case study <b aria-hidden="true">&rsaquo;</b></span>
              </span>
            </a>
          {% endfor %}
        </div>
      </div>
    </section>

    <section class="ii-section" data-route="notebook" aria-labelledby="notebook-title">
      <div class="ii-container ii-narrow">
        <h1 class="ii-title-slab" id="notebook-title">
          <span data-scramble="// notebook">// notebook</span>
          <i aria-hidden="true">n</i>
        </h1>
        <div class="ii-prose">
          <p>Notes on public-policy simulation, lab operations, optimization, research software, books, and whatever else keeps the work alive.</p>
        </div>
        <ol class="ii-editorial-list">
          {% for post in site.posts limit: 5 %}
            {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
            <li>
              <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
              <p>{{ post.description }}</p>
              <span>{{ read_time }} min read / {{ post.date | date: "%B %d, %Y" }}</span>
            </li>
          {% endfor %}
        </ol>
        <a class="ii-inline-cta" href="{{ '/blog/' | relative_url }}">Open writing archive</a>
      </div>
    </section>

    <section class="ii-section" data-route="books" aria-labelledby="books-title">
      <div class="ii-container">
        <h1 class="ii-title-slab" id="books-title">
          <span data-scramble="// books">// books</span>
          <i aria-hidden="true">b</i>
        </h1>
        <div class="ii-split ii-split-tight">
          <div class="ii-prose">
            <p>A public shelf for stories, systems, institutions, and trade-offs that keep feeding the work from the side.</p>
            <div class="ii-stats">
              <div><strong>{{ site.data.read_books.size }}</strong><span>books logged</span></div>
              {% assign five_star_books = site.data.read_books | where: "rating", 5 %}
              <div><strong>{{ five_star_books.size }}</strong><span>five-star notes</span></div>
              <div><strong>{{ site.data.reading_threads.size }}</strong><span>threads</span></div>
            </div>
          </div>
          <ol class="ii-editorial-list ii-book-list">
            {% for book in site.data.read_books limit: 6 %}
              <li>
                <a href="{{ book.url }}">{{ book.title }}</a>
                <p>{{ book.review }}</p>
                <span>{{ book.author }} / {{ book.rating }}/5</span>
              </li>
            {% endfor %}
          </ol>
        </div>
        <a class="ii-inline-cta" href="{{ '/books/' | relative_url }}">Open reading shelf</a>
      </div>
    </section>

    <section class="ii-section" data-route="papers" aria-labelledby="papers-title">
      <div class="ii-container ii-narrow">
        <h1 class="ii-title-slab" id="papers-title">
          <span data-scramble="// papers">// papers</span>
          <i aria-hidden="true">p</i>
        </h1>
        <div class="ii-publications">
          <article>
            <span>2024</span>
            <h2>An efficient probability-based VNS algorithm for delivery territory design</h2>
            <p>Computers &amp; Operations Research. Delivery territory design, clustering, randomized VNS, and reproducible source artifacts.</p>
            <a href="https://doi.org/10.1016/j.cor.2024.106756">DOI</a>
            <a href="{{ '/blog/2025/territory-design-bvns/' | relative_url }}">Blog</a>
            <a href="https://github.com/ahmed-o-aly/TerritoryDesign">Code</a>
          </article>
          <article>
            <span>2023</span>
            <h2>An Effective VNS for Delivery Districting</h2>
            <p>Variable Neighborhood Search. Basic VNS and local-search procedures for delivery districting.</p>
            <a href="https://doi.org/10.1007/978-3-031-34500-5_6">DOI</a>
          </article>
        </div>
        <a class="ii-inline-cta" href="{{ '/publications/' | relative_url }}">Open formal publications</a>
      </div>
    </section>

    <section class="ii-section" data-route="cv" aria-labelledby="cv-title">
      <div class="ii-container">
        <h1 class="ii-title-slab" id="cv-title">
          <span data-scramble="// cv">// cv</span>
          <i aria-hidden="true">c</i>
        </h1>
        <div class="ii-timeline">
          {% for role in experience_section.contents limit: 4 %}
            <article>
              <span>{{ role.year }}</span>
              <h2>{{ role.title }}</h2>
              <p>{{ role.institution }}{% if role.location %} / {{ role.location }}{% endif %}</p>
              {% if role.description %}
                <ul>
                  {% for item in role.description limit: 2 %}
                    <li>{{ item }}</li>
                  {% endfor %}
                </ul>
              {% endif %}
            </article>
          {% endfor %}
        </div>
        <a class="ii-inline-cta" href="{{ '/cv/' | relative_url }}">Open full CV</a>
      </div>
    </section>

    <section class="ii-section" data-route="contact" aria-labelledby="contact-title">
      <div class="ii-container ii-narrow">
        <h1 class="ii-title-slab" id="contact-title">
          <span data-scramble="// contact">// contact</span>
          <i aria-hidden="true">@</i>
        </h1>
        <div class="ii-prose">
          <p>If you want to talk about simulation, optimization, AI/XR labs, public-sector decision support, or research software, send a note.</p>
        </div>
        <ul class="ii-contact-links">
          <li><a href="mailto:ahmed.oss.aly@gmail.com">email</a></li>
          <li><a href="https://www.linkedin.com/in/ahmed-aly-76a56b182/">linkedin</a></li>
          <li><a href="https://github.com/ahmed-o-aly">github</a></li>
          <li><a href="{{ '/assets/pdf/Ahmed Aly CV.pdf' | relative_url }}">cv pdf</a></li>
        </ul>
      </div>
    </section>
  </main>
</div>
