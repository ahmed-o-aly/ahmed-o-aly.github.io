# Chester-Inspired Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Ahmed Aly's full Jekyll site as a continuous, accessible Chester-style editorial garden using the approved warm-white palette and natural-color matte media treatment.

**Architecture:** Add a nested `garden` base layout, focused Liquid components, a separate garden Sass bundle, and a small progressive-enhancement script while preserving Jekyll collections and specialist al-folio content features. Migrate one page family at a time behind build-contract tests, then delete the obsolete hash-routed shell and its CSS/JavaScript only after every retained route uses the new system.

**Tech Stack:** Jekyll 4.4, Liquid, Markdown, Sass, vanilla JavaScript, Node.js standard-library contract tests, Prettier, axe-core/Chrome in CI.

## Global Constraints

- Keep Jekyll; do not introduce React, Vue, a CMS, a database, or a client-side router.
- Approved canvas is `#faf9f6`; card surface is `#f2f0eb`; hover/focus surface is `#ece9e3`; primary ink is `#171717`; secondary ink is `#6f6b63`; borders are `#dedad2`.
- Use Fraunces weight 300 for editorial display copy and Inter 400/500 for navigation, metadata, controls, and compact body copy.
- Keep book covers, photographs, charts, and screenshots in natural color inside consistent matte media wells; do not apply gradients, shine, glass, duotone, or saturation filters.
- The site must render complete navigation and content without JavaScript.
- Exact legacy hashes only may redirect; ordinary heading, tab, and bibliography fragments must remain untouched.
- Respect `prefers-reduced-motion`, visible keyboard focus, semantic headings, informative alt text, and touch-friendly controls.
- Preserve `/`, `/projects/`, all five project routes, `/blog/` and its archives/posts, `/books/`, `/books/the_godfather/`, `/cv/`, `/publications/`, and `/404.html`; add `/about/`; redirect `/repositories/` to `/projects/`.
- Do not edit generated `_site/`, caches, `vendor/`, `node_modules/`, or the user's `.codex-remote-attachments/` files.
- Use `apply_patch` for source edits and make the task-specific commits listed below.

---

## Planned file structure

### New source files

- `_layouts/garden.liquid`: one HTML document shell for every redesigned page.
- `_includes/garden-nav.liquid`: primary/utility navigation with server-rendered active state.
- `_includes/garden-footer.liquid`: contact, social, and secondary destinations.
- `_includes/garden-intro.liquid`: reusable page eyebrow/title/description block.
- `_includes/garden-card.liquid`: generic linked card contract.
- `_includes/garden-media.liquid`: natural-color media well and typographic fallback.
- `_includes/garden-project-card.liquid`: maps project documents to `garden-card`.
- `_includes/garden-post-card.liquid`: maps posts to `garden-card`.
- `_includes/garden-book-card.liquid`: maps YAML or collection books to `garden-card`.
- `_includes/garden-related.liquid`: related/next links.
- `_data/home_garden.yml`: deterministic homepage card order and spans using `kind + slug` references.
- `_pages/home.md`: root continuous garden.
- `assets/css/garden.scss`: separately compiled garden bundle.
- `_sass/garden/_tokens.scss`: palette, typography, focus, and sizing tokens.
- `_sass/garden/_shell.scss`: body, container, nav, footer, skip link, and page shell.
- `_sass/garden/_cards.scss`: grid, cards, media mounts, and typographic fallbacks.
- `_sass/garden/_content.scss`: project, writing, reading, About, CV, publication, and utility patterns.
- `_sass/garden/_motion.scss`: optional reveal and hover behavior with reduced-motion handling.
- `_sass/garden/_responsive.scss`: 390/768/1024/wide desktop behavior.
- `assets/js/garden.js`: exact legacy-hash mapping and optional reveal enhancement.
- `tests/helpers/site.mjs`: generated-route reader and assertion helpers.
- `tests/shell-contract.mjs`, `tests/home-contract.mjs`, `tests/projects-contract.mjs`, `tests/writing-contract.mjs`, `tests/reading-contract.mjs`, `tests/utility-contract.mjs`, `tests/legacy-contract.mjs`: focused build contracts.
- `tests/site-contract.mjs`: aggregate contract entry point.

### Existing files changed by responsibility

- `_layouts/home.liquid`, `_layouts/default.liquid`: become thin nested layouts.
- `_layouts/page.liquid`: generic page and project case-study pattern.
- `_layouts/post.liquid`, `_layouts/book-review.liquid`, `_layouts/cv.liquid`: page-family patterns.
- `_includes/head.liquid`: load `garden.css` and the approved font CSS.
- `_pages/about.md`: become canonical `/about/` instead of the root mini-SPA.
- `_pages/projects.md`, `_pages/blog.md`, `_pages/books.md`, `_pages/publications.md`, `_pages/repositories.md`, `_pages/404.md`: redesigned indexes and utility behavior.
- `_sass/_base.scss`: remove the obsolete portfolio block from its `Infinite-imaginations-inspired portfolio home` marker through EOF after migration.
- `assets/js/portfolio-home.js`: delete after all route hooks are removed.
- `package.json`: add deterministic formatting and built-site contract commands.
- `.github/workflows/axe.yml`: test representative route matrix.

---

### Task 1: Shared garden shell and build-test foundation

**Files:**
- Create: `_layouts/garden.liquid`
- Create: `_includes/garden-nav.liquid`
- Create: `_includes/garden-footer.liquid`
- Create: `assets/css/garden.scss`
- Create: `_sass/garden/_tokens.scss`
- Create: `_sass/garden/_shell.scss`
- Create: `assets/js/garden.js`
- Create: `tests/helpers/site.mjs`
- Create: `tests/shell-contract.mjs`
- Modify: `_layouts/default.liquid`
- Modify: `_includes/head.liquid`

**Interfaces:**
- Consumes: existing `page.url`, `page.title`, `page.description`, `site.baseurl`, `_includes/head.liquid`, and `_includes/scripts.liquid`.
- Produces: `.garden-body`, `.garden-site`, `.garden-nav`, `#main-content`, `.garden-footer`, CSS tokens, `readRoute(route)`, and `assertContains(html, pattern, label)` for later tasks.

- [ ] **Step 1: Add the failing shell contract**

```js
// tests/helpers/site.mjs
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = fileURLToPath(new URL("../../_site/", import.meta.url));

export function readRoute(route) {
  const trimmed = route.replace(/^\//, "").replace(/\/$/, "");
  const relative = route === "/" ? "index.html" : trimmed.endsWith(".html") ? trimmed : `${trimmed}/index.html`;
  const file = join(siteRoot, relative);
  assert.equal(existsSync(file), true, `Expected generated route ${route} at ${file}`);
  return readFileSync(file, "utf8");
}

export function assertContains(html, pattern, label) {
  assert.match(html, pattern, label);
}
```

```js
// tests/shell-contract.mjs
import assert from "node:assert/strict";
import { assertContains, readRoute } from "./helpers/site.mjs";

const html = readRoute("/projects/");
assertContains(html, /class="[^"]*garden-body/, "projects uses the garden body");
assertContains(html, /class="[^"]*garden-nav/, "projects renders the shared navigation");
assertContains(html, /href="\/projects\/"[^>]*aria-current="page"/, "projects nav item is current");
assertContains(html, /id="main-content"/, "shell exposes the skip-link target");
assertContains(html, /class="[^"]*garden-footer/, "shell renders the shared footer");
assert.doesNotMatch(html, /data-portfolio-app/, "subpage shell no longer exposes the old app hook");
console.log("shell contract passed");
```

- [ ] **Step 2: Verify the contract fails against the current build**

Run:

```powershell
bundle exec jekyll build --trace
node tests/shell-contract.mjs
```

Expected: Jekyll succeeds, then the contract fails because `/projects/` does not contain `garden-body` or `garden-nav`.

- [ ] **Step 3: Implement the nested shell and base tokens**

```liquid
---
# _layouts/garden.liquid
---
<!doctype html>
<html lang="{{ site.lang | default: 'en' }}">
  <head>
    {% include head.liquid %}
  </head>
  <body class="garden-body garden-body--{{ page.layout | default: 'page' }}" data-baseurl="{{ site.baseurl }}">
    <a class="garden-skip" href="#main-content">Skip to content</a>
    <div class="garden-site">
      {% include garden-nav.liquid %}
      {{ content }}
      {% include garden-footer.liquid %}
    </div>
    {% include scripts.liquid %}
    <script defer src="{{ '/assets/js/garden.js' | relative_url | bust_file_cache }}"></script>
  </body>
</html>
```

```liquid
---
layout: garden
---
<main id="main-content" class="garden-main garden-main--page">
  <div class="garden-container garden-page">
    {{ content }}
  </div>
</main>
```

Use the preceding content as the complete replacement for `_layouts/default.liquid`.

```liquid
{% assign active_path = page.url | default: '/' %}
<header class="garden-header">
  <nav class="garden-nav garden-container" aria-label="Primary navigation">
    <a class="garden-nav__name" href="{{ '/' | relative_url }}">Ahmed Aly</a>
    <div class="garden-nav__segments">
      {% assign items = 'Home|/;Projects|/projects/;Writing|/blog/;Reading|/books/;About|/about/' | split: ';' %}
      {% for item in items %}
        {% assign parts = item | split: '|' %}
        {% assign label = parts[0] %}
        {% assign destination = parts[1] %}
        {% assign current = false %}
        {% if destination == '/' and active_path == '/' %}{% assign current = true %}{% endif %}
        {% if destination != '/' and active_path contains destination %}{% assign current = true %}{% endif %}
        <a href="{{ destination | relative_url }}"{% if current %} aria-current="page"{% endif %}>{{ label }}</a>
      {% endfor %}
    </div>
    <div class="garden-nav__utility">
      <a href="https://github.com/ahmed-o-aly">GitHub</a>
      <a href="{{ '/cv/' | relative_url }}">CV</a>
    </div>
  </nav>
</header>
```

```liquid
<footer class="garden-footer" id="contact">
  <div class="garden-container garden-footer__inner">
    <p>Ahmed Aly · decision systems, research software, and working notes.</p>
    <nav aria-label="Contact and secondary links">
      <a href="mailto:ahmed.oss.aly@gmail.com">Email</a>
      <a href="https://www.linkedin.com/in/ahmed-aly-76a56b182/">LinkedIn</a>
      <a href="https://github.com/ahmed-o-aly">GitHub</a>
      <a href="{{ '/publications/' | relative_url }}">Publications</a>
    </nav>
  </div>
</footer>
```

```scss
---
---
@charset "utf-8";
@import "garden/tokens", "garden/shell", "garden/cards", "garden/content", "garden/motion", "garden/responsive";
```

```scss
// _sass/garden/_tokens.scss
:root {
  --garden-canvas: #faf9f6;
  --garden-surface: #f2f0eb;
  --garden-surface-hover: #ece9e3;
  --garden-ink: #171717;
  --garden-muted: #6f6b63;
  --garden-quiet: #8f8b83;
  --garden-line: #dedad2;
  --garden-accent: #8d8069;
  --garden-focus: #615846;
  --garden-max: 1120px;
  --garden-gap: 8px;
  --garden-radius: 8px;
  --garden-serif: "Fraunces", Georgia, serif;
  --garden-sans: "Inter", "Helvetica Neue", sans-serif;
}
```

```scss
// _sass/garden/_shell.scss
.garden-body {
  margin: 0;
  background: var(--garden-canvas);
  color: var(--garden-ink);
  font-family: var(--garden-sans);
}
.garden-body *, .garden-body *::before, .garden-body *::after { box-sizing: border-box; }
.garden-body a { color: inherit; }
.garden-body :focus-visible { outline: 2px solid var(--garden-focus); outline-offset: 3px; }
.garden-container { width: min(calc(100% - 32px), var(--garden-max)); margin-inline: auto; }
.garden-skip { position: fixed; left: 16px; top: -80px; z-index: 100; padding: 10px 14px; background: var(--garden-ink); color: var(--garden-canvas); }
.garden-skip:focus { top: 16px; }
.garden-header { position: sticky; top: 0; z-index: 40; padding: 16px 0 8px; pointer-events: none; }
.garden-nav { display: flex; align-items: center; justify-content: space-between; gap: 16px; font-size: 14px; pointer-events: auto; }
.garden-nav__segments { display: flex; overflow-x: auto; padding: 4px; border: 1px solid var(--garden-line); border-radius: var(--garden-radius); background: var(--garden-surface); }
.garden-nav__segments a, .garden-nav__name, .garden-nav__utility a { padding: 6px 9px; text-decoration: none; white-space: nowrap; }
.garden-nav__segments a[aria-current="page"] { border-radius: 5px; background: var(--garden-line); }
.garden-nav__utility { display: flex; color: var(--garden-muted); }
.garden-main { min-height: 70vh; padding: 24px 0 72px; }
.garden-footer { padding: 24px 0 36px; color: var(--garden-muted); font-size: 13px; }
.garden-footer__inner { display: flex; justify-content: space-between; gap: 24px; border-top: 1px solid var(--garden-line); padding-top: 20px; }
.garden-footer nav { display: flex; flex-wrap: wrap; gap: 14px; }
```

Add after the existing `main.css` link in `_includes/head.liquid`:

```liquid
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300&family=Inter:wght@400;500&display=swap">
<link rel="stylesheet" href="{{ '/assets/css/garden.css' | relative_url | bust_file_cache }}">
```

Create empty `_sass/garden/_cards.scss`, `_content.scss`, `_motion.scss`, and `_responsive.scss` files with a one-line responsibility comment so Sass compilation succeeds; later tasks replace those comments with focused rules.

Create the initially inert enhancement file so the shell never references a missing asset:

```js
// assets/js/garden.js
(() => {})();
```

- [ ] **Step 4: Build and verify the shared shell passes**

Run:

```powershell
bundle exec jekyll build --trace
node tests/shell-contract.mjs
```

Expected: Jekyll exits 0 and prints `shell contract passed`.

- [ ] **Step 5: Commit the shell**

```powershell
git add _layouts/garden.liquid _layouts/default.liquid _includes/garden-nav.liquid _includes/garden-footer.liquid _includes/head.liquid assets/css/garden.scss assets/js/garden.js _sass/garden tests/helpers/site.mjs tests/shell-contract.mjs
git commit -m "Build shared editorial garden shell"
```

---

### Task 2: Continuous homepage, card contracts, and canonical About page

**Files:**
- Create: `_pages/home.md`
- Create: `_data/home_garden.yml`
- Create: `_includes/garden-intro.liquid`
- Create: `_includes/garden-card.liquid`
- Create: `_includes/garden-media.liquid`
- Create: `_includes/garden-project-card.liquid`
- Create: `_includes/garden-post-card.liquid`
- Create: `_includes/garden-book-card.liquid`
- Modify: `assets/js/garden.js`
- Create: `tests/home-contract.mjs`
- Modify: `_layouts/home.liquid`
- Replace: `_pages/about.md`
- Modify: `_sass/garden/_cards.scss`
- Modify: `_sass/garden/_motion.scss`
- Modify: `_sass/garden/_responsive.scss`

**Interfaces:**
- Consumes: `site.data.home_garden[{kind, ref, size}]`, Jekyll document `slug`, project/post/book documents, and generic card parameters.
- Produces: `/`, `/about/`, `.garden-grid`, `.garden-card`, `.garden-media`, `.garden-intro`, exact legacy-hash behavior, and type-specific card mapping used by later indexes.

- [ ] **Step 1: Add the failing homepage contract**

```js
// tests/home-contract.mjs
import assert from "node:assert/strict";
import { assertContains, readRoute } from "./helpers/site.mjs";

const home = readRoute("/");
const about = readRoute("/about/");
assertContains(home, /class="[^"]*garden-home__intro/, "home renders editorial introduction");
assertContains(home, /class="[^"]*garden-grid/, "home renders the mixed garden grid");
assertContains(home, /class="[^"]*garden-card--project/, "home includes a project card");
assertContains(home, /class="[^"]*garden-card--post/, "home includes a writing card");
assertContains(home, /class="[^"]*garden-card--book/, "home includes a reading card");
assert.equal((home.match(/<h1\b/g) || []).length, 1, "home has one h1");
assert.doesNotMatch(home, /data-route=|data-portfolio-app|portfolio-home\.js/, "home no longer ships the mini-SPA");
assertContains(about, /id="credentials"/, "about provides the achievements compatibility anchor");
console.log("home contract passed");
```

- [ ] **Step 2: Run the contract and verify the missing `/about/` failure**

Run:

```powershell
bundle exec jekyll build --trace
node tests/home-contract.mjs
```

Expected: FAIL because `/about/` and the continuous garden markup do not exist.

- [ ] **Step 3: Implement the homepage manifest and component contracts**

```yaml
# _data/home_garden.yml
- kind: project
  ref: metahub-ai-xr-lab
  size: tall
- kind: project
  ref: territory-design-probvns
  size: wide
- kind: post
  ref: what-i-am-building-this-site-for
  size: standard
- kind: book
  ref: the_godfather
  size: standard
- kind: project
  ref: adsg-policy-simulations
  size: wide
- kind: project
  ref: dewa-energy-optimization
  size: standard
- kind: project
  ref: logistics-routing-optimization
  size: wide
```

```liquid
{% assign eyebrow = include.eyebrow %}
<header class="garden-intro">
  {% if eyebrow %}<p class="garden-intro__eyebrow">{{ eyebrow }}</p>{% endif %}
  <h1>{{ include.title }}</h1>
  {% if include.description %}<p class="garden-intro__description">{{ include.description }}</p>{% endif %}
</header>
```

```liquid
{% assign card_size = include.size | default: 'standard' %}
{% assign card_kind = include.kind | default: 'note' %}
{% assign card_url = include.url %}
{% unless card_url contains '://' %}{% assign card_url = card_url | relative_url %}{% endunless %}
<article class="garden-card garden-card--{{ card_kind }} garden-card--{{ card_size }}" data-reveal>
  <a class="garden-card__link" href="{{ card_url }}">
    <div class="garden-card__meta">
      <span>{{ include.label }}</span>
      <span aria-hidden="true">↗</span>
    </div>
    {% include garden-media.liquid src=include.media alt=include.alt fit=include.fit title=include.title %}
    <div class="garden-card__copy">
      <h2>{{ include.title }}</h2>
      {% if include.summary %}<p>{{ include.summary }}</p>{% endif %}
    </div>
  </a>
</article>
```

```liquid
{% if include.src %}
  {% assign media_url = include.src %}
  {% unless media_url contains '://' %}{% assign media_url = media_url | relative_url %}{% endunless %}
  <div class="garden-media garden-media--{{ include.fit | default: 'cover' }}">
    <img src="{{ media_url }}" alt="{{ include.alt | default: include.title }}" loading="lazy">
  </div>
{% else %}
  <div class="garden-media garden-media--fallback" aria-hidden="true">
    <span>{{ include.title | truncate: 48 }}</span>
  </div>
{% endif %}
```

```liquid
{% assign project = include.project %}
{% assign label = project.visual.label | default: project.category | prepend: 'Projects · ' %}
{% assign media = project.image %}
{% include garden-card.liquid kind='project' size=include.size url=project.url label=label title=project.title summary=project.description media=media alt=project.image_alt fit=project.image_fit %}
```

```liquid
{% assign post = include.post %}
{% assign label = post.date | date: '%B %Y' | prepend: 'Writing · ' %}
{% include garden-card.liquid kind='post' size=include.size url=post.url label=label title=post.title summary=post.description media=post.thumbnail alt=post.thumbnail_alt fit='cover' %}
```

```liquid
{% assign book = include.book %}
{% assign book_url = book.url | default: include.url %}
{% include garden-card.liquid kind='book' size=include.size url=book_url label='Reading · Books' title=book.title summary=book.author media=book.cover alt=book.cover_alt fit='contain' %}
```

- [ ] **Step 4: Replace the root mini-SPA and create canonical About**

```markdown
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
        Hey, I’m <a href="{{ '/about/' | relative_url }}">Ahmed.</a> I build
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
```

```liquid
---
layout: garden
---
<main id="main-content" class="garden-main garden-main--home">
  {{ content }}
</main>
```

```markdown
---
layout: page
title: About
permalink: /about/
description: The work, methods, and interests behind Ahmed Aly's decision systems practice.
eyebrow: About
display_title: Systems become useful when people can inspect and operate them.
---

<section class="garden-prose">
  <p>I work across lab operations, public-policy simulation, optimization, research software, and decision support.</p>
  <p>My current focus combines KU MetaHub AI/XR lab readiness with simulation work for public-sector teams.</p>
</section>

<section id="credentials" class="garden-section">
  <h2>Credentials and publications</h2>
  <p>Selected learning and formal research that supports the practical work.</p>
  <p><a href="{{ '/cv/' | relative_url }}">View the CV</a> · <a href="{{ '/publications/' | relative_url }}">View publications</a></p>
</section>
```

- [ ] **Step 5: Add exact hash compatibility and restrained reveal enhancement**

```js
// assets/js/garden.js
(() => {
  const routes = new Map([
    ["#/hello/", "/"], ["#/hello", "/"],
    ["#/about/", "/about/"], ["#/about", "/about/"],
    ["#/projects/", "/projects/"], ["#/projects", "/projects/"],
    ["#/achievements/", "/about/#credentials"], ["#/achievements", "/about/#credentials"],
    ["#/contact/", "/#contact"], ["#/contact", "/#contact"],
  ]);

  const base = document.body.dataset.baseurl || "";
  const target = routes.get(window.location.hash);
  if (target) {
    window.location.replace(`${base}${target}`);
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
  document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
})();
```

Add the approved grid/card/media rules to `_cards.scss`, motion to `_motion.scss`, and breakpoints to `_responsive.scss`:

```scss
.garden-grid { display: grid; grid-template-columns: 1fr; grid-auto-flow: dense; gap: var(--garden-gap); }
.garden-home__intro { padding: 28px 16px 40px; }
.garden-home__intro h1 { margin: 0; max-width: 19ch; color: var(--garden-muted); font: 300 clamp(24px, 4vw, 36px)/1.24 var(--garden-serif); letter-spacing: -0.03em; }
.garden-home__intro strong, .garden-home__intro a { color: var(--garden-ink); font-weight: 300; text-decoration-color: var(--garden-accent); text-decoration-style: dotted; text-underline-offset: 4px; }
.garden-card { min-height: 260px; overflow: hidden; border-radius: var(--garden-radius); background: var(--garden-surface); }
.garden-card__link { display: flex; height: 100%; flex-direction: column; padding: 16px; text-decoration: none; }
.garden-card__meta { display: flex; justify-content: space-between; gap: 12px; color: var(--garden-muted); font-size: 13px; }
.garden-card__copy { margin-top: auto; }
.garden-card__copy h2 { margin: 16px 0 6px; font: 300 28px/1.08 var(--garden-serif); }
.garden-card__copy p { margin: 0; color: var(--garden-muted); line-height: 1.5; }
.garden-media { display: grid; min-height: 150px; flex: 1; margin-top: 12px; place-items: center; overflow: hidden; background: var(--garden-canvas); }
.garden-media img { width: 100%; height: 100%; transition: transform 150ms ease; }
.garden-media--cover img { object-fit: cover; }
.garden-media--contain img { object-fit: contain; padding: 16px; }
.garden-media--fallback { padding: 24px; color: var(--garden-muted); font: 300 24px/1.1 var(--garden-serif); text-align: center; }
.garden-card:hover { background: var(--garden-surface-hover); }
.garden-card:hover .garden-media img { transform: scale(1.03); }
```

```scss
[data-reveal] { opacity: 0; transform: translateY(-10px); transition: opacity 300ms ease, transform 300ms ease; }
[data-reveal].is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1; transform: none; transition: none; }
  .garden-media img { transition: none; }
}
```

```scss
@media (min-width: 640px) {
  .garden-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .garden-home__intro, .garden-card--wide { grid-column: span 2; }
  .garden-home__intro { grid-row: span 2; min-height: 520px; }
  .garden-card--tall { grid-row: span 2; }
}
@media (min-width: 1024px) { .garden-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1280px) { :root { --garden-max: 1200px; } }
@media (max-width: 767px) {
  .garden-nav__name { display: none; }
  .garden-nav__segments { width: 100%; }
  .garden-nav__utility { display: none; }
  .garden-footer__inner { flex-direction: column; }
}
```

- [ ] **Step 6: Build and verify the homepage contract**

Run:

```powershell
bundle exec jekyll build --trace
node tests/shell-contract.mjs
node tests/home-contract.mjs
```

Expected: both scripts print `passed`; `_site/index.html` contains exactly one `<h1>` and no old app hooks.

- [ ] **Step 7: Commit the homepage and components**

```powershell
git add _pages/home.md _pages/about.md _layouts/home.liquid _data/home_garden.yml _includes/garden-*.liquid assets/js/garden.js _sass/garden tests/home-contract.mjs
git commit -m "Replace hash homepage with editorial garden"
```

---

### Task 3: Project index and project case-study pattern

**Files:**
- Create: `_includes/garden-related.liquid`
- Create: `tests/projects-contract.mjs`
- Modify: `_pages/projects.md`
- Modify: `_layouts/page.liquid`
- Modify: `_sass/garden/_content.scss`

**Interfaces:**
- Consumes: existing project front matter (`visual`, `signals`, `role`, `methods`, `status`, `problem`, `constraints`, `system_map`, `proof`, `decisions`, `outcomes`, optional `artifacts`).
- Produces: `.garden-project-grid`, `.garden-case`, named case-study sections, and `.garden-related`.

- [ ] **Step 1: Add the failing project contract**

```js
// tests/projects-contract.mjs
import { assertContains, readRoute } from "./helpers/site.mjs";

const index = readRoute("/projects/");
const project = readRoute("/projects/metahub-ai-xr-lab/");
assertContains(index, /class="[^"]*garden-project-grid/, "project index renders garden grid");
assertContains(index, /KU MetaHub AI\/XR Lab/, "project index includes MetaHub");
for (const id of ["problem", "constraints", "system", "decisions", "outcomes"]) {
  assertContains(project, new RegExp(`id="${id}"`), `case study renders ${id}`);
}
assertContains(project, /class="[^"]*garden-case__meta/, "case study renders structured metadata");
console.log("projects contract passed");
```

- [ ] **Step 2: Verify the project contract fails**

Run `bundle exec jekyll build --trace; node tests/projects-contract.mjs`.

Expected: FAIL because the current index and case study do not expose the garden contracts.

- [ ] **Step 3: Replace the project index with shared cards**

```markdown
---
layout: page
title: Projects
permalink: /projects/
description: Systems work across immersive labs, public policy, optimization, routing, and research software.
eyebrow: Projects
display_title: Work that makes complicated systems easier to inspect and operate.
---

<section class="garden-project-grid garden-grid" aria-label="Project case studies">
  {% assign sorted_projects = site.projects | sort: 'importance' %}
  {% for project in sorted_projects %}
    {% assign size = 'standard' %}
    {% if forloop.index == 1 or forloop.index == 3 %}{% assign size = 'wide' %}{% endif %}
    {% include garden-project-card.liquid project=project size=size %}
  {% endfor %}
</section>
```

- [ ] **Step 4: Implement the project branch in `_layouts/page.liquid`**

Retain the existing generic-page branch, but render this complete case-study structure when `page.collection == 'projects'`:

```liquid
---
layout: default
---
{% if page.collection == 'projects' %}
  <article class="garden-case">
    {% include garden-intro.liquid eyebrow=page.category title=page.title description=page.description %}
    <dl class="garden-case__meta">
      <div><dt>Role</dt><dd>{{ page.role }}</dd></div>
      <div><dt>Methods</dt><dd>{{ page.methods }}</dd></div>
      <div><dt>Status</dt><dd>{{ page.status }}</dd></div>
    </dl>
    <section id="problem"><h2>Problem</h2><p>{{ page.problem }}</p></section>
    <section id="constraints"><h2>Constraints</h2><ul>{% for item in page.constraints %}<li>{{ item }}</li>{% endfor %}</ul></section>
    <section id="system"><h2>{{ page.system_map.title | default: 'System' }}</h2><ol>{% for step in page.system_map.steps %}<li><strong>{{ step.title }}</strong><p>{{ step.detail }}</p></li>{% endfor %}</ol></section>
    <section id="proof"><h2>Proof and artifacts</h2><div class="garden-proof">{% for item in page.proof %}<article><h3>{{ item.label }}</h3><p>{{ item.detail }}</p></article>{% endfor %}</div></section>
    <section id="decisions"><h2>Decisions</h2><ul>{% for item in page.decisions %}<li>{{ item }}</li>{% endfor %}</ul></section>
    <section id="outcomes"><h2>Outcomes</h2><ul>{% for item in page.outcomes %}<li>{{ item }}</li>{% endfor %}</ul></section>
    <div class="garden-prose">{{ content }}</div>
    {% include garden-related.liquid collection=site.projects current=page label='More projects' %}
  </article>
{% else %}
  <article class="garden-page-content">
    {% assign display_title = page.display_title | default: page.title %}
    {% include garden-intro.liquid eyebrow=page.eyebrow title=display_title description=page.description %}
    <div class="garden-prose">{{ content }}</div>
  </article>
{% endif %}
```

```liquid
{% assign items = include.collection | sort: 'importance' %}
<nav class="garden-related" aria-label="{{ include.label | default: 'Related content' }}">
  <h2>{{ include.label | default: 'Related content' }}</h2>
  <div>{% for item in items limit: 3 %}{% unless item.url == include.current.url %}<a href="{{ item.url | relative_url }}">{{ item.title }}</a>{% endunless %}{% endfor %}</div>
</nav>
```

Add `.garden-case`, `.garden-case__meta`, `.garden-proof`, `.garden-related`, and readable section spacing to `_content.scss`; keep the article column near 720px and allow proof/media grids to expand to the full container.

- [ ] **Step 5: Build and verify all five project routes**

Run:

```powershell
bundle exec jekyll build --trace
node tests/projects-contract.mjs
Get-ChildItem '_site/projects' -Directory | Select-Object -ExpandProperty Name
```

Expected: contract passes and the five project slug directories are present.

- [ ] **Step 6: Commit projects**

```powershell
git add _pages/projects.md _layouts/page.liquid _includes/garden-related.liquid _sass/garden/_content.scss tests/projects-contract.mjs
git commit -m "Redesign project index and case studies"
```

---

### Task 4: Writing index, archives, and article pattern

**Files:**
- Create: `tests/writing-contract.mjs`
- Modify: `_pages/blog.md`
- Modify: `_layouts/post.liquid`
- Modify: `_layouts/archive.liquid`
- Modify: `_sass/garden/_content.scss`

**Interfaces:**
- Consumes: paginator posts, post `title`, `date`, `description`, `tags`, `categories`, `thread`, optional `thumbnail`, `toc`, comments, citation, and related-publication settings.
- Produces: `.garden-writing-grid`, `.garden-article`, `.garden-article__meta`, and garden-styled archives without removing specialist post features.

- [ ] **Step 1: Add the failing writing contract**

```js
// tests/writing-contract.mjs
import { assertContains, readRoute } from "./helpers/site.mjs";

const index = readRoute("/blog/");
const article = readRoute("/blog/2026/what-i-am-building-this-site-for/");
assertContains(index, /class="[^"]*garden-writing-grid/, "writing index renders card grid");
assertContains(index, /What I Am Building This Site For/i, "writing index includes current post");
assertContains(article, /class="[^"]*garden-article/, "post uses article pattern");
assertContains(article, /<time\b/, "post publishes semantic date");
console.log("writing contract passed");
```

- [ ] **Step 2: Verify the writing contract fails**

Run `bundle exec jekyll build --trace; node tests/writing-contract.mjs`.

Expected: FAIL on the new garden classes.

- [ ] **Step 3: Replace the blog index while preserving pagination and archive links**

```liquid
---
layout: default
permalink: /blog/
title: Writing
description: Notes on systems, simulations, labs, research software, and the work behind the work.
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 5
  sort_field: date
  sort_reverse: true
---
{% include garden-intro.liquid eyebrow='Writing' title='Notes from systems in progress.' description=page.description %}
{% assign postlist = paginator.posts | default: site.posts %}
<section class="garden-writing-grid garden-grid">
  {% for post in postlist %}
    {% assign size = 'standard' %}{% if forloop.first %}{% assign size = 'wide' %}{% endif %}
    {% include garden-post-card.liquid post=post size=size %}
  {% endfor %}
</section>
{% include pagination.liquid %}
```

- [ ] **Step 4: Wrap the existing post capabilities in the garden article contract**

Keep the existing optional comments, citation, related posts, TOC, and specialist scripts, but replace the article's outer markup with:

```liquid
---
layout: default
---
<article class="garden-article">
  <header class="garden-article__header">
    <p class="garden-intro__eyebrow">Writing</p>
    <h1>{{ page.title }}</h1>
    <p>{{ page.description }}</p>
    <p class="garden-article__meta"><time datetime="{{ page.date | date_to_xmlschema }}">{{ page.date | date: '%B %-d, %Y' }}</time>{% if page.last_updated %} · Updated {{ page.last_updated | date: '%B %-d, %Y' }}{% endif %}</p>
  </header>
  <div class="garden-prose">{{ content }}</div>
  {% if page.related_publications %}{% include related_posts.liquid %}{% endif %}
  {% if site.giscus.repo and page.giscus_comments %}{% include giscus.liquid %}{% endif %}
</article>
```

Replace `_layouts/archive.liquid` with this explicit garden archive while preserving generated archive URLs:

```liquid
---
layout: default
---
{% capture archive_title %}
  {% if page.type == 'year' %}{{ page.date | date: '%Y' }}{% else %}{{ page.title }}{% endif %}
{% endcapture %}
<section class="garden-archive">
  {% include garden-intro.liquid eyebrow='Writing archive' title=archive_title description=page.collection_name %}
  <ol>
    {% for document in page.documents %}
      <li>
        <time datetime="{{ document.date | date_to_xmlschema }}">{{ document.date | date: '%b %-d, %Y' }}</time>
        {% if document.redirect == blank %}
          <a href="{{ document.url | relative_url }}">{{ document.title }}</a>
        {% elsif document.redirect contains '://' %}
          <a href="{{ document.redirect }}">{{ document.title }}</a>
        {% else %}
          <a href="{{ document.redirect | relative_url }}">{{ document.title }}</a>
        {% endif %}
      </li>
    {% endfor %}
  </ol>
</section>
```

- [ ] **Step 5: Build, test the index/article, and spot-check archives**

Run:

```powershell
bundle exec jekyll build --trace
node tests/writing-contract.mjs
Test-Path '_site/blog/2026/index.html'
Test-Path '_site/blog/tag/optimization/index.html'
```

Expected: contract passes and both path checks return `True`.

- [ ] **Step 6: Commit writing**

```powershell
git add _pages/blog.md _layouts/post.liquid _layouts/archive.liquid _sass/garden/_content.scss tests/writing-contract.mjs
git commit -m "Restyle writing index and articles"
```

---

### Task 5: Reading threads, cover fallbacks, and book reviews

**Files:**
- Create: `tests/reading-contract.mjs`
- Modify: `_pages/books.md`
- Modify: `_layouts/book-review.liquid`
- Modify: `_includes/garden-book-card.liquid`
- Modify: `_sass/garden/_content.scss`

**Interfaces:**
- Consumes: `_data/read_books.yml[{title,author,rating,read_at,url,review,cover?,cover_alt?}]`, `_data/reading_threads.yml`, and `_books` review front matter (`cover`, `olid`, `isbn`, dates, status, stars).
- Produces: `.garden-reading-threads`, `.garden-book-grid`, local-cover/Open-Library/typographic fallback order, and `.garden-book-review`.

- [ ] **Step 1: Add the failing reading contract**

```js
// tests/reading-contract.mjs
import { assertContains, readRoute } from "./helpers/site.mjs";

const index = readRoute("/books/");
const review = readRoute("/books/the_godfather/");
assertContains(index, /class="[^"]*garden-reading-threads/, "reading threads are visible");
assertContains(index, /class="[^"]*garden-book-grid/, "reading index renders book cards");
assertContains(index, /garden-media--fallback/, "books without covers get typographic media");
assertContains(review, /class="[^"]*garden-book-review/, "review uses the book pattern");
assertContains(review, /the_godfather\.jpg/, "local cover remains natural color");
console.log("reading contract passed");
```

- [ ] **Step 2: Verify the reading contract fails**

Run `bundle exec jekyll build --trace; node tests/reading-contract.mjs`.

Expected: FAIL on the garden reading contracts.

- [ ] **Step 3: Connect collection reviews and YAML shelf entries on the index**

```liquid
---
layout: page
title: Reading
permalink: /books/
description: Books and notes about institutions, competence, power, repair, and systems under stress.
eyebrow: Reading
display_title: A public shelf of ideas that keep feeding the work.
---

<section class="garden-reading-threads" aria-labelledby="reading-threads-title">
  <h2 id="reading-threads-title">Reading threads</h2>
  {% for thread in site.data.reading_threads %}<article><h3>{{ thread.title }}</h3><p>{{ thread.summary }}</p><p>{{ thread.examples | join: ' · ' }}</p></article>{% endfor %}
</section>

<section class="garden-book-grid garden-grid" aria-label="Full book reviews">
  {% for book in site.books %}{% include garden-book-card.liquid book=book size='standard' %}{% endfor %}
</section>

<section class="garden-book-grid garden-grid" aria-label="Reading log">
  {% for book in site.data.read_books %}{% include garden-book-card.liquid book=book size='standard' %}{% endfor %}
</section>
```

- [ ] **Step 4: Implement the guaranteed cover fallback order**

Replace `_includes/garden-book-card.liquid` with:

```liquid
{% assign book = include.book %}
{% assign cover = book.cover %}
{% if cover == blank and book.olid %}{% assign cover = 'https://covers.openlibrary.org/b/olid/' | append: book.olid | append: '-L.jpg' %}{% endif %}
{% if cover == blank and book.isbn %}{% assign cover = 'https://covers.openlibrary.org/b/isbn/' | append: book.isbn | append: '-L.jpg' %}{% endif %}
{% assign destination = book.url %}
{% if destination == blank %}{% assign destination = '/books/' | relative_url %}{% elsif destination contains '://' %}{% else %}{% assign destination = destination | relative_url %}{% endif %}
{% include garden-card.liquid kind='book' size=include.size url=destination label='Reading · Books' title=book.title summary=book.author media=cover alt=book.cover_alt fit='contain' %}
```

- [ ] **Step 5: Restyle the full review without altering metadata behavior**

```liquid
---
layout: default
---
<article class="garden-book-review">
  <header>
    <div class="garden-book-review__cover">
      {% assign review_cover = page.cover %}
      {% if review_cover == blank and page.olid %}{% assign review_cover = 'https://covers.openlibrary.org/b/olid/' | append: page.olid | append: '-L.jpg' %}{% endif %}
      {% if review_cover == blank and page.isbn %}{% assign review_cover = 'https://covers.openlibrary.org/b/isbn/' | append: page.isbn | append: '-L.jpg' %}{% endif %}
      {% include garden-media.liquid src=review_cover alt=page.cover_alt title=page.title fit='contain' %}
    </div>
    <div>
      <p class="garden-intro__eyebrow">Reading · {{ page.status }}</p>
      <h1>{{ page.title }}</h1>
      <p>{{ page.author }} · {{ page.released }} · {{ page.stars }}/5</p>
      {% if page.finished %}<p>Finished {{ page.finished | date: '%B %-d, %Y' }}</p>{% endif %}
    </div>
  </header>
  <div class="garden-prose">{{ content }}</div>
  {% include garden-related.liquid collection=site.books current=page label='More reading' %}
</article>
```

Ensure `_content.scss` uses the same matte media well for covers, `object-fit: contain`, and a two-column review header that collapses to one column below 768px.

- [ ] **Step 6: Build and verify reading fallbacks**

Run:

```powershell
bundle exec jekyll build --trace
node tests/reading-contract.mjs
```

Expected: `reading contract passed`; full-color Godfather cover is present and YAML books without covers render typographic wells.

- [ ] **Step 7: Commit reading**

```powershell
git add _pages/books.md _layouts/book-review.liquid _includes/garden-book-card.liquid _sass/garden/_content.scss tests/reading-contract.mjs
git commit -m "Build matte reading garden and review pages"
```

---

### Task 6: About, CV, publications, repositories, and 404

**Files:**
- Create: `tests/utility-contract.mjs`
- Modify: `_pages/about.md`
- Modify: `_layouts/cv.liquid`
- Modify: `_pages/publications.md`
- Modify: `_pages/repositories.md`
- Modify: `_pages/404.md`
- Modify: `_sass/garden/_content.scss`

**Interfaces:**
- Consumes: `_data/cv.yml`, `_data/socials.yml`, bibliography output, and `page.redirect` support in the garden shell.
- Produces: `#credentials`, `.garden-cv`, `.garden-publications`, a repositories redirect, and an informative `.garden-not-found` page.

- [ ] **Step 1: Add the failing utility contract**

```js
// tests/utility-contract.mjs
import assert from "node:assert/strict";
import { assertContains, readRoute } from "./helpers/site.mjs";

const about = readRoute("/about/");
const cv = readRoute("/cv/");
const publications = readRoute("/publications/");
const missing = readRoute("/404.html");
const repositories = readRoute("/repositories/");
assertContains(about, /id="credentials"/, "about exposes credentials anchor");
assertContains(cv, /class="[^"]*garden-cv/, "CV uses shared pattern");
assertContains(publications, /class="[^"]*garden-publications/, "publications use shared pattern");
assertContains(missing, /class="[^"]*garden-not-found/, "404 has useful empty state");
assert.doesNotMatch(missing, /http-equiv="refresh"/i, "404 does not force redirect");
assertContains(repositories, /url=\/projects\/|http-equiv="refresh"/i, "repositories route redirects to projects");
console.log("utility contract passed");
```

- [ ] **Step 2: Verify the utility contract fails**

Run `bundle exec jekyll build --trace; node tests/utility-contract.mjs`.

Expected: FAIL on CV/publication/404 garden markers.

- [ ] **Step 3: Expand About and render CV data through the shared shell**

Keep the canonical About front matter from Task 2 and replace its body with this complete structure:

```liquid
<section class="garden-prose">
  <p>I work across lab operations, public-policy simulation, optimization, research software, and decision support.</p>
  <p>My current focus combines KU MetaHub AI/XR lab readiness with simulation support for public-sector teams.</p>
</section>
<section class="garden-section" aria-labelledby="themes-title">
  <h2 id="themes-title">Recurring themes</h2>
  <ul>
    <li>Make assumptions visible before teams commit to a decision.</li>
    <li>Turn complex infrastructure into routines people can trust.</li>
    <li>Keep models, artifacts, and documentation inspectable.</li>
  </ul>
</section>
<section id="credentials" class="garden-section" aria-labelledby="credentials-title">
  <h2 id="credentials-title">Credentials and publications</h2>
  <p>Six Sigma Yellow Belt Specialization · University System of Georgia / Coursera, 2025.</p>
  <p><a href="{{ '/assets/pdf/Coursera OMF75NR8PBY4.pdf' | relative_url }}">Open certificate</a> · <a href="{{ '/publications/' | relative_url }}">View publications</a> · <a href="{{ '/cv/' | relative_url }}">View the full CV</a></p>
</section>
```

Replace the full-document `_layouts/cv.liquid` with a nested layout that continues using the existing type-specific CV includes:

```liquid
---
layout: default
---
<article class="garden-cv">
  {% include garden-intro.liquid eyebrow='Curriculum vitae' title=page.title description=page.description %}
  {% if page.cv_pdf %}<p><a class="garden-button" href="{{ page.cv_pdf | relative_url }}">Download PDF</a></p>{% endif %}
  {% for entry in site.data.cv %}
    <section class="garden-cv__section" id="{{ entry.title | slugify }}">
      <h2>{{ entry.title }}</h2>
      {% case entry.type %}
        {% when 'time_table' %}{% include cv/time_table.liquid %}
        {% when 'list' %}{% include cv/list.liquid %}
        {% when 'map' %}{% include cv/map.liquid %}
        {% when 'nested_list' %}{% include cv/nested_list.liquid %}
        {% when 'list_groups' %}{% include cv/list_groups.liquid %}
      {% endcase %}
    </section>
  {% endfor %}
</article>
```

Pass the current `entry` contract expected by each include exactly as the old layout does; do not duplicate YAML-backed role or education copy in Liquid.

- [ ] **Step 4: Apply the shell to publications and utility behavior**

Set `eyebrow: Publications` and `display_title: Formal work and the artifacts around it.` in `_pages/publications.md` front matter, then wrap its bibliography content in:

```liquid
<section class="garden-publications">
  {% include bib_search.liquid %}
  <div class="publications">{% bibliography %}</div>
</section>
```

Replace `_pages/repositories.md` with:

```markdown
---
layout: page
permalink: /repositories/
title: Repositories
redirect: /projects/
sitemap: false
---

Repository work now lives with the relevant project case studies. Continue to [Projects]({{ '/projects/' | relative_url }}).
```

Replace `_pages/404.md` with:

```markdown
---
layout: page
permalink: /404.html
title: Page not found
description: Nothing is planted at this address.
---

<section class="garden-not-found">
  <p>The page may have moved while the site was being reorganized.</p>
  <p><a href="{{ '/' | relative_url }}">Return home</a> or browse <a href="{{ '/projects/' | relative_url }}">projects</a>, <a href="{{ '/blog/' | relative_url }}">writing</a>, and <a href="{{ '/books/' | relative_url }}">reading</a>.</p>
</section>
```

Preserve redirect meta generation in `_layouts/garden.liquid` only when `page.redirect` is truthy and not `true`; add this inside `<head>` after `head.liquid`:

```liquid
{% if page.redirect and page.redirect != true %}
  {% if page.redirect contains '://' %}
    {% assign redirect_url = page.redirect %}
  {% else %}
    {% assign redirect_url = page.redirect | relative_url %}
  {% endif %}
  <meta http-equiv="refresh" content="0; url={{ redirect_url }}">
{% endif %}
```

- [ ] **Step 5: Build and verify utility routes**

Run:

```powershell
bundle exec jekyll build --trace
node tests/utility-contract.mjs
```

Expected: `utility contract passed`; `/404.html` has no refresh while `/repositories/` points to `/projects/`.

- [ ] **Step 6: Commit About, CV, and utilities**

```powershell
git add _pages/about.md _layouts/cv.liquid _pages/publications.md _pages/repositories.md _pages/404.md _sass/garden/_content.scss tests/utility-contract.mjs
git commit -m "Unify About CV and utility pages"
```

---

### Task 7: Legacy hash verification and obsolete portfolio cleanup

**Files:**
- Create: `tests/legacy-contract.mjs`
- Modify: `_sass/_base.scss`
- Modify: `_layouts/garden.liquid`
- Modify: `assets/js/garden.js`
- Delete: `assets/js/portfolio-home.js`
- Verify/modify: `_pages/*.md`, `_layouts/*.liquid`, `_includes/*.liquid`

**Interfaces:**
- Consumes: exact route map from Task 2 and complete migration from Tasks 1–6.
- Produces: no `ii-*`/`data-route-*` output, no `portfolio-home.js` reference, and exact legacy-hash redirects without disturbing normal fragments.

- [ ] **Step 1: Add the failing legacy-source and output contract**

```js
// tests/legacy-contract.mjs
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

for (const route of ["/", "/projects/", "/blog/", "/books/", "/about/", "/cv/"]) {
  const html = readRoute(route);
  assert.doesNotMatch(html, /\bii-|data-route(?:-link)?=|data-portfolio-app|portfolio-home\.js/, `${route} has no legacy shell output`);
}

const script = readFileSync(new URL("../assets/js/garden.js", import.meta.url), "utf8");
for (const hash of ["#/hello/", "#/about/", "#/projects/", "#/achievements/", "#/contact/"]) assertContains(script, new RegExp(hash.replaceAll("/", "\\/")), `${hash} is mapped`);
assert.equal(existsSync(new URL("../assets/js/portfolio-home.js", import.meta.url)), false, "legacy script is deleted");
console.log("legacy contract passed");
```

- [ ] **Step 2: Verify the contract fails before cleanup**

Run `bundle exec jekyll build --trace; node tests/legacy-contract.mjs`.

Expected: FAIL because `assets/js/portfolio-home.js` still exists and legacy selectors remain in migrated source or output.

- [ ] **Step 3: Remove the obsolete portfolio Sass block and hooks**

Use `apply_patch` to delete `_sass/_base.scss` from this exact marker through EOF:

```scss
/*******************************************************************************
 * Infinite-imaginations-inspired portfolio home.
 ******************************************************************************/
```

The preceding line 2903 is the last retained pre-portfolio rule in the audited source. Before applying the deletion, confirm the marker occurs once with:

```powershell
rg -n "Infinite-imaginations-inspired portfolio home" _sass/_base.scss
```

Then remove all remaining `ii-*`, `portfolio-body`, `data-route-*`, `data-portfolio-app`, `data-menu-*`, `data-scramble`, and `data-flicker` markup from retained layouts/includes, and delete `assets/js/portfolio-home.js` with `apply_patch`.

- [ ] **Step 4: Verify exact hash mapping in a real browser**

With `bundle exec jekyll serve --host 127.0.0.1 --port 4000` running, navigate to each exact legacy hash and verify the final URL:

```text
http://127.0.0.1:4000/#/hello/         -> http://127.0.0.1:4000/
http://127.0.0.1:4000/#/about/         -> http://127.0.0.1:4000/about/
http://127.0.0.1:4000/#/projects/      -> http://127.0.0.1:4000/projects/
http://127.0.0.1:4000/#/achievements/  -> http://127.0.0.1:4000/about/#credentials
http://127.0.0.1:4000/#/contact/       -> http://127.0.0.1:4000/#contact
```

Also navigate to `/publications/#some-fragment` and an article heading fragment; confirm unknown hashes remain unchanged.

- [ ] **Step 5: Build and verify cleanup**

Run:

```powershell
bundle exec jekyll build --trace
node tests/legacy-contract.mjs
rg -n "portfolio-home|data-portfolio-app|data-route|class=\"[^\"]*ii-" _site
```

Expected: contract passes and `rg` returns no matches.

- [ ] **Step 6: Commit cleanup**

```powershell
git add _sass/_base.scss _layouts _pages _includes assets/js/garden.js tests/legacy-contract.mjs
git add -u assets/js/portfolio-home.js
git commit -m "Remove obsolete hash portfolio shell"
```

---

### Task 8: Aggregate contracts, formatting commands, and route-matrix accessibility CI

**Files:**
- Create: `tests/site-contract.mjs`
- Modify: `package.json`
- Modify: `.github/workflows/deploy.yml`
- Modify: `.github/workflows/axe.yml`

**Interfaces:**
- Consumes: all focused contract scripts and existing `.github/scripts/run-axe.mjs`.
- Produces: `npm run format:check`, `npm run test:site`, and axe coverage for representative page families.

- [ ] **Step 1: Add the aggregate contract and package commands**

```js
// tests/site-contract.mjs
await import("./shell-contract.mjs");
await import("./home-contract.mjs");
await import("./projects-contract.mjs");
await import("./writing-contract.mjs");
await import("./reading-contract.mjs");
await import("./utility-contract.mjs");
await import("./legacy-contract.mjs");
console.log("all site contracts passed");
```

```json
{
  "scripts": {
    "format:check": "prettier --check .",
    "test:site": "node tests/site-contract.mjs"
  },
  "devDependencies": {
    "@shopify/prettier-plugin-liquid": "1.4.0",
    "prettier": "3.1.1"
  }
}
```

- [ ] **Step 2: Run formatting and contracts before CI changes**

Run:

```powershell
npm.cmd run format:check
bundle exec jekyll build --trace
npm.cmd run test:site
```

Expected: formatting reports no changed files, Jekyll exits 0, and all seven focused contracts plus the aggregate message pass.

- [ ] **Step 3: Convert axe workflow to a representative route matrix**

Add `"tests/**"` to the `paths` filters in both `.github/workflows/deploy.yml` and `.github/workflows/axe.yml`. In `deploy.yml`, replace the single generated-site check with:

```yaml
- name: Verify generated site
  run: |
    test -f _site/index.html
    node tests/site-contract.mjs
```

Then convert axe to a route matrix.

Add this strategy to the `check` job in `.github/workflows/axe.yml`:

```yaml
strategy:
  fail-fast: false
  matrix:
    path:
      - ""
      - "projects/"
      - "projects/metahub-ai-xr-lab/"
      - "blog/"
      - "blog/2026/what-i-am-building-this-site-for/"
      - "books/"
      - "books/the_godfather/"
      - "about/"
      - "cv/"
      - "publications/"
      - "404.html"
```

Replace the final axe command with:

```yaml
node .github/scripts/run-axe.mjs "http://127.0.0.1:8080/${{ matrix.path }}" 1500
```

- [ ] **Step 4: Run local axe when Chrome and temporary packages are available**

Run:

```powershell
npm.cmd install --no-save axe-core chrome-remote-interface http-server
$server = Start-Process -FilePath 'npx.cmd' -ArgumentList @('http-server','_site','-p','8080') -WindowStyle Hidden -PassThru
$env:CHROME_PATH = (Get-Command chrome.exe -ErrorAction SilentlyContinue).Source
node .github/scripts/run-axe.mjs 'http://127.0.0.1:8080/' 1500
Stop-Process -Id $server.Id
```

Expected when Chrome is discoverable: `axe found 0 violations`. If Chrome is not installed under `chrome.exe`, use the installed Chrome path from `Get-Command chrome` or rely on the workflow's `browser-actions/setup-chrome` step; do not weaken the CI assertion.

- [ ] **Step 5: Commit verification infrastructure**

```powershell
git add tests/site-contract.mjs package.json package-lock.json .github/workflows/deploy.yml .github/workflows/axe.yml
git commit -m "Test garden routes and accessibility matrix"
```

---

### Task 9: Full responsive and production verification

**Files:**
- Modify only files that fail the checks below.

**Interfaces:**
- Consumes: the complete redesigned site and all automated contracts.
- Produces: verified desktop/mobile behavior, clean production output, and a final green worktree.

- [ ] **Step 1: Run source hygiene and production build**

Run:

```powershell
git diff --check
npm.cmd run format:check
$env:JEKYLL_ENV = 'production'
bundle exec jekyll build --trace
npm.cmd run test:site
```

Expected: every command exits 0, `_site/index.html` exists, and all contracts pass.

- [ ] **Step 2: Verify representative pages in the in-app browser**

Start or reuse `bundle exec jekyll serve --host 127.0.0.1 --port 4000`, then inspect these routes:

```text
/
/projects/
/projects/metahub-ai-xr-lab/
/blog/
/blog/2026/what-i-am-building-this-site-for/
/books/
/books/the_godfather/
/about/
/cv/
/publications/
/404.html
```

At 390×844, 768×1024, 1024×768, and the normal desktop viewport verify:

- navigation remains usable and current state is correct;
- cards are one/two/three columns as designed;
- one clear `<h1>` exists per page;
- full-color covers sit inside matte wells without clipping;
- no horizontal overflow exists;
- keyboard focus is visible;
- reduced-motion mode removes reveal movement;
- no console errors or failed same-origin assets appear.

- [ ] **Step 3: Verify graceful degradation**

Disable JavaScript for one browser pass or block `garden.js`, then confirm server-rendered navigation, homepage cards, indexes, articles, reviews, CV, and footer still work. Temporarily change one card's media URL in browser developer tools and confirm its title/metadata remain usable; source files must not be changed for this check.

- [ ] **Step 4: Re-run axe on every route matrix entry**

Use the Task 8 server and loop locally when Chrome is available:

```powershell
$paths = @('', 'projects/', 'projects/metahub-ai-xr-lab/', 'blog/', 'blog/2026/what-i-am-building-this-site-for/', 'books/', 'books/the_godfather/', 'about/', 'cv/', 'publications/', '404.html')
foreach ($path in $paths) { node .github/scripts/run-axe.mjs ("http://127.0.0.1:8080/" + $path) 800; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }
```

Expected: every invocation prints `axe found 0 violations`.

- [ ] **Step 5: Commit only verification fixes, if any**

If verification required source changes, stage tracked fixes and commit them:

```powershell
if (-not [string]::IsNullOrWhiteSpace((git status --short))) {
  git add -u
  git diff --cached --check
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  git commit -m "Polish responsive garden verification issues"
}
```

If no source changes were required, do not create an empty commit. Finish with:

```powershell
git status --short
git log -8 --oneline
```

Expected: only the user's pre-existing `.codex-remote-attachments/` entry may remain untracked; the redesign commits are visible in task order.
