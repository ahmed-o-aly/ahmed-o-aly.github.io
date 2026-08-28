import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const routes = {
  home: readRoute("/"),
  writing: readRoute("/blog/"),
  article: readRoute("/blog/2026/what-i-am-building-this-site-for/"),
  library: readRoute("/books/"),
  works: readRoute("/projects/"),
  records: readRoute("/cv/"),
  marginalia: readRoute("/marginalia/"),
  about: readRoute("/about/"),
};
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const sourceCss = readFileSync(new URL("../_sass/garden/_folio.scss", import.meta.url), "utf8");
const simulationCss = readFileSync(new URL("../_sass/garden/_simulation-v2.scss", import.meta.url), "utf8");
const script = readFileSync(new URL("../assets/js/garden.js", import.meta.url), "utf8");
const layout = readFileSync(new URL("../_layouts/garden.liquid", import.meta.url), "utf8");
const nav = readFileSync(new URL("../_includes/garden-nav.liquid", import.meta.url), "utf8");
const tokens = readFileSync(new URL("../_sass/garden/_tokens.scss", import.meta.url), "utf8");

for (const [name, html] of Object.entries(routes)) {
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${name} has exactly one h1`);
  assertContains(html, /href="#main-content"/, `${name} exposes the skip link`);
  assertContains(html, /id="main-content"/, `${name} exposes the skip target`);
  assertContains(html, /<nav\b[^>]*aria-label="Primary navigation"/, `${name} has a labeled primary nav`);
  assertContains(html, /<footer\b[^>]*class="[^"]*garden-footer/, `${name} uses the shared folio footer`);
  assert.doesNotMatch(html, /<x-dc\b|support\.js|data-portfolio-app/, `${name} does not ship prototype runtime code`);
  assert.doesNotMatch(html, /Â·|â€”|â€™|â†’/, `${name} has no mojibake`);
}

for (const href of ["/blog/", "/books/", "/projects/", "/cv/", "/marginalia/", "/#sec-about"]) {
  assertContains(nav, new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `nav includes ${href}`);
}
assertContains(routes.works, /href="\/projects\/"[^>]*aria-current="page"/, "Works is current on the projects route");
assertContains(routes.home, /class="garden-nav__monogram"[^>]*href="\/"/, "monogram links home");

const sectionIds = ["sec-writing", "sec-library", "sec-works", "sec-records", "sec-marginalia", "sec-about"];
let previousIndex = -1;
for (const id of sectionIds) {
  const index = routes.home.indexOf(`id="${id}"`);
  assert.ok(index > previousIndex, `${id} appears in the intended home-page order`);
  previousIndex = index;
  const openingTag = routes.home.slice(routes.home.lastIndexOf("<", index), routes.home.indexOf(">", index) + 1);
  assert.match(openingTag, /aria-labelledby="[^"]+"/, `${id} has an accessible name`);
}
assertContains(routes.home, /A study of decisions, books, and small obsessions\./, "home renders the reference headline");
assertContains(routes.home, /class="folio-library"/, "home renders the espresso library band");
assertContains(routes.home, /class="folio-work-grid"/, "home renders selected works");
assertContains(routes.home, /class="folio-records-grid"/, "home renders the records cabinet");
assertContains(routes.home, /mailto:ahmed\.oss\.aly@gmail\.com/, "home retains Ahmed's correspondence address");
assertContains(routes.home, /<aside id="contact"[^>]*>[\s\S]*mailto:ahmed\.oss\.aly@gmail\.com/, "legacy contact anchors land on correspondence");
assert.doesNotMatch(routes.home, /href="\/projects\/abu-dhabi-urban-dynamics\/"/, "home excludes redirect-only projects from selected work");
assertContains(routes.home, /og-folio\.png/, "home publishes the refreshed social card");

assertContains(routes.writing, /class="folio-page folio-archive"/, "writing uses the folio archive pattern");
assertContains(routes.writing, /<section class="folio-archive__year"[^>]*aria-labelledby=/, "writing groups posts into labeled years");
assertContains(routes.writing, /<time datetime="[^"]+">/, "writing rows publish semantic dates");
assertContains(routes.writing, /What I am building this site for/i, "writing includes the current post");
assertContains(routes.article, /class="folio-reader"/, "posts use the folio reader");
assertContains(routes.article, /class="folio-prose folio-essay-body"/, "posts retain server-rendered prose");

assertContains(routes.library, /class="folio-reading-feature"/, "library renders its featured reading panel");
assertContains(routes.library, /class="folio-shelf"/, "library renders the spine shelf");
assert.ok((routes.library.match(/data-book-trigger/g) || []).length >= 10, "library exposes a substantial clickable shelf");
assertContains(routes.library, /<button[\s\S]*?data-book-trigger/, "book notes are opened by semantic buttons");
assertContains(layout, /<dialog[^>]*id="folio-book-dialog"[^>]*aria-labelledby=/, "book notes use a labeled native dialog");
assertContains(layout, /<button[^>]*data-dialog-close/, "book dialog has a semantic close button");

for (const title of [
  "KU MetaHub AI/XR Lab",
  "ADSG Public Policy Simulations",
  "Energy System Optimization with DEWA",
  "Logistics Routing and Facility Optimization",
]) {
  assertContains(routes.works, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `works includes ${title}`);
}
assertContains(routes.works, /class="folio-work-grid folio-work-grid--all"/, "works renders the full editorial grid");

for (const text of [
  "Experience",
  "Education",
  "Certificates, framed",
  "Lab Specialist, MetaHub and Abu Dhabi School of Government",
  "Six Sigma Yellow Belt Specialization",
]) {
  assertContains(routes.records, new RegExp(text, "i"), `records renders ${text}`);
}
assertContains(routes.records, /href="\/assets\/pdf\/Ahmed(?:%20| )Aly(?:%20| )CV\.pdf"/, "records retains the CV download");
assertContains(routes.marginalia, /class="folio-marginalia-feed"/, "marginalia has a dedicated feed");
assert.ok((routes.marginalia.match(/<time>/g) || []).length >= 7, "marginalia renders all authored notes");

assertContains(tokens, /--garden-canvas:\s*#f6f0e3/i, "source keeps the parchment token");
assertContains(tokens, /--garden-ink:\s*#372b1f/i, "source keeps the ink token");
assertContains(tokens, /--garden-quiet:\s*#826644/i, "small sepia text uses an accessible tone");
assertContains(css, /\.garden-body :focus-visible\{[^}]*outline:/, "compiled styles keep a visible keyboard focus indicator");
assertContains(css, /\.garden-nav__links a\{(?=[^}]*min-width:44px)(?=[^}]*min-height:44px)[^}]*\}/, "nav links keep 44px targets");
assertContains(sourceCss, /@media \(prefers-reduced-motion: reduce\)/, "source respects reduced motion");
assertContains(
  simulationCss,
  /\.garden-body--simulation-v2 \.garden-nav \{[\s\S]*?min-height: 44px;[\s\S]*?padding: 0;/,
  "simulation keeps the redesigned nav inside its compact header"
);
assertContains(
  simulationCss,
  /\.garden-body--simulation-v2 \.garden-nav__monogram,[\s\S]*?\.garden-body--simulation-v2 \.garden-nav__links a \{[\s\S]*?min-height: 44px;/,
  "simulation keeps compact navigation targets accessible"
);
assertContains(script, /prefers-reduced-motion: reduce/, "behavior respects reduced motion");
assertContains(script, /IntersectionObserver/, "home reveals are progressively enhanced");
assertContains(script, /data-book-trigger/, "book interactions are data-driven");
assertContains(script, /sessionStorage\.setItem\("folioHomeScroll"/, "page navigation preserves home scroll");
assertContains(sourceCss, /animation:\s*folio-leaf-sweep 0\.85s/, "page turn uses the requested leaf timing");
assertContains(sourceCss, /\.folio-book-dialog::backdrop/, "book dialog provides a readable modal scrim");

console.log("folio contract passed");
