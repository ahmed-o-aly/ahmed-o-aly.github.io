import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { assertContains, readRoute } from "./helpers/site.mjs";

const projectFile = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const routes = {
  home: readRoute("/"),
  writing: readRoute("/blog/"),
  article: readRoute("/blog/2026/what-i-am-building-this-site-for/"),
  library: readRoute("/books/"),
  works: readRoute("/projects/"),
  cnc: readRoute("/projects/cnc-machine-inspector/"),
  urban: readRoute("/projects/abu-dhabi-urban-dynamics/"),
  policySimulations: readRoute("/projects/adsg-policy-simulations/"),
  records: readRoute("/cv/"),
  marginalia: readRoute("/marginalia/"),
  about: readRoute("/about/"),
};
const css = projectFile("_site/assets/css/garden.css");
const folioCss = projectFile("_sass/garden/_folio-v2.scss");
const shellCss = projectFile("_sass/garden/_shell.scss");
const simulationCss = projectFile("_sass/garden/_simulation-v2.scss");
const tokens = projectFile("_sass/garden/_tokens.scss");
const script = projectFile("assets/js/garden.js");
const layout = projectFile("_layouts/garden.liquid");
const nav = projectFile("_includes/garden-nav.liquid");
const footer = projectFile("_includes/garden-footer.liquid");
const workCard = projectFile("_includes/folio-work-card.liquid");
const head = projectFile("_includes/head.liquid");
const config = projectFile("_config.yml");
const booksTemplate = projectFile("_pages/books.md");
const homeTemplate = projectFile("_pages/home.md");
const readBooksData = projectFile("_data/read_books.yml");
const currentlyReadingData = projectFile("_data/currently_reading.yml");

const yamlRecordCount = (source) => (source.match(/^- source:/gm) || []).length;
const readBookCount = yamlRecordCount(readBooksData);
const currentBookCount = yamlRecordCount(currentlyReadingData);
const ratedReadBookCount = (readBooksData.match(/^\s+rating:\s+(?!null\b).+/gm) || []).length;
const datedReadBookCount = (readBooksData.match(/^\s+read_at:\s+"\d{4}-\d{2}-\d{2}"/gm) || []).length;
const progressedCurrentBookCount = (currentlyReadingData.match(/^\s+progress_percent:\s+(?!null\b).+/gm) || []).length;

function block(html, className, tag = "section") {
  const match = html.match(new RegExp(`<${tag}[^>]*class="[^"]*${className}[^"]*"[\\s\\S]*?<\\/${tag}>`, "i"));
  assert.ok(match, `expected ${className} block`);
  return match[0];
}

for (const [name, html] of Object.entries(routes)) {
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${name} has exactly one h1`);
  assertContains(html, /href="#main-content"/, `${name} exposes the skip link`);
  assertContains(html, /id="main-content"/, `${name} exposes the skip target`);
  assertContains(html, /<nav\b[^>]*aria-label="Primary navigation"/, `${name} has a labeled primary nav`);
  assertContains(html, /<footer\b[^>]*class="[^"]*garden-footer[^>]*id="contact"/, `${name} uses the correspondence footer`);
  assert.doesNotMatch(html, /<x-dc\b|support\.js|data-portfolio-app/, `${name} does not ship prototype runtime code`);
  assert.doesNotMatch(html, /Â·|â€”|â€™|â†’/, `${name} has no mojibake`);
}

for (const href of ["/blog/", "/books/", "/projects/", "/cv/", "/marginalia/"]) {
  assertContains(nav, new RegExp(`href="{{ destination \\| relative_url }}"|${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), `nav includes ${href}`);
}
assertContains(nav, /bunny-ink-small\.svg/, "nav uses the simplified bunny asset");
assertContains(nav, /class="garden-nav__brand"/, "nav exposes Ahmed's wordmark");
assertContains(nav, /class="garden-nav__toggle"[^>]*aria-expanded="false"[^>]*aria-controls="garden-nav-links"/, "mobile menu is semantic");
assertContains(nav, /class="garden-nav__contact"[^>]*href="{{ '\/#contact' \| relative_url }}"/, "nav exposes a bordered correspondence action");
assert.doesNotMatch(nav, /About|data-scroll-target|#sec-(?:writing|library|works|records|marginalia)/, "nav uses pages rather than home anchors");
assertContains(routes.works, /href="\/projects\/"[^>]*aria-current="page"/, "Works is current on the projects route");

const homeOrder = ["folio-hero", "folio-writing-ledger", "folio-selected-works", "folio-library"];
let previousIndex = -1;
for (const className of homeOrder) {
  const index = routes.home.indexOf(className);
  assert.ok(index > previousIndex, `${className} appears in the required home order`);
  previousIndex = index;
}
assertContains(routes.home, /A study of decisions, books, and small obsessions\./, "home renders the handoff kicker");
assertContains(routes.home, /Decision-support systems for labs, public policy &amp; complex operations\./, "home renders the handoff claim");
assert.equal((routes.home.match(/class="folio-writing-ledger__entry"/g) || []).length, 1, "home renders one writing-ledger entry");
const homeWorks = block(routes.home, "folio-selected-works");
const homeWorksIndex = block(homeWorks, "folio-work-index", "ol");
assert.equal((homeWorksIndex.match(/class="folio-work-entry"/g) || []).length, 2, "home renders exactly two text-first works");
assert.equal((homeWorksIndex.match(/class="folio-work-entry__description"/g) || []).length, 2, "each selected work has one plain-language sentence");
assert.doesNotMatch(
  homeWorksIndex,
  /<img\b|<picture\b|<figure\b|folio-work-plate|machine-lab-interface\.png|urban-dynamics-console\.png|folio-tags|>\s*(?:Role|Status|Methods)\s*</i,
  "home works use no thumbnails or portfolio-template metadata"
);
for (const title of ["Machine Lab — Interactive CNC Assembly Explorer", "Abu Dhabi Urban Dynamics Lab"]) {
  assertContains(homeWorksIndex, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `home includes ${title}`);
}
assertContains(routes.home, /data-parallax-y="-60"/, "library watermark has calibrated travel");
assertContains(
  folioCss,
  /\.folio-library__heading h2 \{[\s\S]*?color:\s*var\(--garden-cream\);/,
  "Library heading explicitly uses high-contrast cream ink"
);
assertContains(
  folioCss,
  /\.folio-library \.folio-mono-label \{[\s\S]*?color:\s*var\(--garden-dark-secondary\);/,
  "Library label uses the readable light sepia token"
);
for (const travel of [30, 55, 80])
  assertContains(routes.home, new RegExp(`data-parallax-y="${travel}"`), `library includes ${travel}px cover travel`);
const homeLibrary = block(routes.home, "folio-library");
const homeCoverRow = block(homeLibrary, "folio-cover-row", "div");
const expectedHomeCoverCount = currentBookCount > 0 ? 1 + Math.min(2, readBookCount) : Math.min(3, readBookCount);
assert.equal(
  (homeCoverRow.match(/class="folio-cover-wrap(?:\s|"|--)/g) || []).length,
  expectedHomeCoverCount,
  "home shows the expected current and recent-read covers"
);
assert.equal((homeCoverRow.match(/<img\b/g) || []).length, expectedHomeCoverCount, "every home library cover is an image");
assert.equal((homeCoverRow.match(/data-book-trigger/g) || []).length, expectedHomeCoverCount, "every home library cover opens a local details card");
assert.doesNotMatch(homeCoverRow, /folio-book-cover__face|--book-color/, "home never substitutes typographic fake covers");
if (currentBookCount > 0) {
  assert.equal((homeLibrary.match(/class="folio-library__current"/g) || []).length, 1, "home names the current book once");
  assertContains(homeLibrary, />Currently reading</, "home gives the current book a plain status");
} else {
  assert.doesNotMatch(homeLibrary, /folio-library__current|Currently reading/, "home emits no empty current-reading copy");
}
assertContains(
  homeTemplate,
  /{% if current_book %}[\s\S]*?home_read_limit = 2[\s\S]*?{% else %}[\s\S]*?home_read_limit = 3/,
  "home falls back from one current plus two read covers to three read covers"
);
assert.doesNotMatch(
  routes.home,
  /folio-records-layout|folio-marginalia-feed|folio-about-page/,
  "Records, Marginalia, and About stay off the home page"
);
assertContains(routes.home, /og-folio-v2\.png/, "home publishes the v2 social card");
assertContains(routes.home, /<title>\s*Ahmed Aly\s*<\/title>/, "home title stays concise");
assertContains(routes.home, /property="og:title" content="Ahmed Aly"/, "home OG title does not duplicate the name");
assertContains(
  routes.home,
  /property="og:image" content="https:\/\/ahmed-o-aly\.github\.io\/assets\/img\/og-folio-v2\.png"/,
  "home OG image is absolute"
);

assertContains(routes.writing, /Working notes on decisions, systems, and the rooms they live in\./, "Writing uses the selected page claim");
assertContains(routes.writing, /<section class="folio-archive__year"[^>]*aria-labelledby=/, "Writing groups posts into labeled years");
assertContains(routes.writing, /<time datetime="[^"]+">/, "Writing publishes semantic dates");
assertContains(routes.writing, /folio-essay-ledger__excerpt/, "Writing rows retain excerpts");
assertContains(routes.writing, /bunny-sepia-ornament\.svg/, "Writing ends with the supplied ornament");
assertContains(routes.article, /class="folio-reader"/, "posts use the folio reader");
assertContains(routes.article, /class="folio-prose folio-essay-body"/, "posts retain server-rendered prose");

assertContains(routes.library, /What I’m reading, and what I’ve finished\./, "Library describes only the two synced shelves");
const currentReadingTemplate = block(booksTemplate, "folio-current-reading");
assertContains(currentReadingTemplate, /for book in current_books\s*%}/, "the current banner renders every current record through one uniform loop");
assertContains(currentReadingTemplate, /if current_book_count > 1/, "carousel controls are reserved for multiple current books");
assertContains(currentReadingTemplate, /data-book-trigger/, "current books open the site's book details card");
assertContains(
  currentReadingTemplate,
  /data-book-progress="{{ book\.progress_percent \| escape }}"/,
  "current book cards receive optional synced progress"
);
assert.doesNotMatch(
  booksTemplate,
  /assign current_book\s*=\s*current_books\s*\|\s*first|offset:\s*1/,
  "the current shelf has no featured and secondary split"
);
if (currentBookCount > 0) {
  const currentReading = block(routes.library, "folio-current-reading");
  assert.equal((currentReading.match(/class="folio-reading-banner"/g) || []).length, 1, "Library renders one current-reading banner");
  assert.equal((currentReading.match(/class="folio-reading-banner__list"/g) || []).length, 1, "the current shelf uses one shared list");
  assert.equal(
    (currentReading.match(/class="folio-reading-banner__item"/g) || []).length,
    currentBookCount,
    "every current record receives the same banner treatment"
  );
  assert.equal((currentReading.match(/data-book-trigger/g) || []).length, currentBookCount, "every current book opens a local detail card");
  assert.equal(
    (currentReading.match(/data-book-url=/g) || []).length,
    currentBookCount,
    "every current card retains Goodreads as a secondary source link"
  );
  assert.equal((currentReading.match(/>\s*Currently reading\s*<\/h2>/g) || []).length, 1, "the unified banner uses one shared current-reading label");
  assert.equal((currentReading.match(/<img\b/g) || []).length, currentBookCount, "every current record keeps its real cover");
  assert.equal(
    (currentReading.match(/class="folio-reading-banner__progress"/g) || []).length,
    progressedCurrentBookCount,
    "only current books with real Goodreads progress render a bar"
  );
  if (currentBookCount > 1) {
    assert.equal((currentReading.match(/data-reading-(?:previous|next)/g) || []).length, 2, "multiple books receive previous and next controls");
    assertContains(currentReading, /data-reading-position[^>]*aria-live="polite"/, "carousel position changes are announced politely");
  } else {
    assert.doesNotMatch(
      currentReading,
      /data-reading-previous|data-reading-next|data-reading-position/,
      "a single current book has no empty carousel controls"
    );
  }
  assert.doesNotMatch(
    currentReading,
    /folio-reading-feature|folio-cover-grid--current|class="folio-cover-card|class="folio-reading-banner__book"[^>]*href=|folio-book-dialog|★|\/5/,
    "current books have no featured split, direct external click, or fabricated rating UI"
  );
} else {
  assert.doesNotMatch(routes.library, /folio-current-reading|Currently reading/, "Library omits the current block when the feed is empty");
}

const readShelf = block(routes.library, "folio-shelf-section");
const coverGrid = block(readShelf, "folio-cover-grid", "ul");
assert.equal((coverGrid.match(/class="folio-cover-card"/g) || []).length, readBookCount, "Library renders every read entry as a cover");
assert.equal((coverGrid.match(/data-book-cover-image/g) || []).length, readBookCount, "Every read entry loads a real jacket image");
assert.equal((coverGrid.match(/src="https:\/\/[^\"]+"/g) || []).length, readBookCount, "Every read entry has a remote jacket URL");
assert.equal((coverGrid.match(/loading="lazy"/g) || []).length, readBookCount, "Read jackets defer off-screen loading");
assert.equal((coverGrid.match(/class="folio-cover-card__meta"/g) || []).length, readBookCount, "Every read entry exposes restrained metadata");
assert.equal(
  (coverGrid.match(/class="folio-cover-card__rating"/g) || []).length,
  ratedReadBookCount,
  "Every rated read entry shows its numeric rating"
);
assert.equal(
  (coverGrid.match(/<time datetime="\d{4}-\d{2}-\d{2}">\d{4}<\/time>/g) || []).length,
  datedReadBookCount,
  "Every known read date contributes a semantic year"
);
assertContains(routes.library, />open a cover<\//, "Shelf helper copy works with or without a review");
assertContains(
  booksTemplate,
  /data-book-review="{{ book\.review \| default: '' \| newline_to_br \| strip_newlines \| escape }}"/,
  "Goodreads review paragraphs survive transport through the book trigger"
);
assert.doesNotMatch(routes.library, /Shelved\s*&middot;\s*(?:<|&lt;)|Shelved\s*·\s*</, "Shelf never emits a dangling empty date");
assert.equal((coverGrid.match(/data-book-trigger/g) || []).length, readBookCount, "Every read cover opens its details dialog");
assert.doesNotMatch(routes.library, /folio-spine|folio-shelf__plank/, "Library no longer renders fake spines or a wooden plank");
assert.doesNotMatch(
  `${routes.home}\n${routes.library}\n${homeTemplate}\n${booksTemplate}`,
  /The Godfather|the_godfather|site\.books|margin notes?/i,
  "reading surfaces contain neither the legacy Godfather fixture nor invented margin-note language"
);
assertContains(layout, /<dialog[^>]*id="folio-book-dialog"[^>]*aria-labelledby=/, "book details use a labeled native dialog");
assertContains(layout, /<button[^>]*data-dialog-close/, "book dialog has a semantic close button");
assertContains(layout, /<img[^>]*data-dialog-cover/, "book dialog repeats the selected jacket");
assertContains(
  layout,
  /<div(?=[^>]*data-dialog-review)(?=[^>]*aria-label="My review")(?=[^>]*hidden)[^>]*>/,
  "book dialog keeps its unlabeled review prose accessible and absent by default"
);
assertContains(layout, /data-dialog-review-body/, "book dialog gives real review prose a dedicated body");
assertContains(layout, /data-dialog-progress-meter[^>]*role="progressbar"/, "book dialog provides an accessible optional progress meter");
assertContains(layout, /data-dialog-source[^>]*target="_blank"/, "book dialog keeps Goodreads as a secondary source link");
assertContains(
  script,
  /const formatRating = \(rating\) => Number\(rating\.toFixed\(2\)\)\.toString\(\);/,
  "book dialog preserves fractional rating precision"
);
assertContains(script, /slide\.hidden = slideIndex !== activeIndex;/, "the carousel exposes only its active book after enhancement");
assertContains(script, /position\.textContent = `\$\{activeIndex \+ 1\} of \$\{slides\.length\}`;/, "the carousel updates its position readout");
assertContains(
  script,
  /progressFill\.style\.width = progress === null \? "0" : `\$\{progress\}%`;/,
  "the dialog renders only validated progress values"
);
assert.doesNotMatch(
  script,
  /[\"']★[\"']\.repeat|Notes coming soon\./,
  "book dialog neither rounds ratings into repeated stars nor invents review prose"
);
assertContains(script, /if \(review\) review\.hidden = !bookReview;/, "book dialog hides the complete review section when a review is absent");
assert.doesNotMatch(
  `${booksTemplate}\n${homeTemplate}\n${layout}\n${script}\n${folioCss}`,
  /data-book-notes|data-dialog-notes|bookNotes|folio-book-dialog__notes/,
  "book review internals no longer call reviews notes"
);

assertContains(routes.works, /Systems built to be operated, not just demonstrated\./, "Works uses the selected page claim");
const worksIndex = block(routes.works, "folio-work-index", "ol");
assert.equal((worksIndex.match(/class="folio-work-entry"/g) || []).length, 7, "Works renders all seven projects as one text index");
assert.equal((worksIndex.match(/class="folio-work-entry__description"/g) || []).length, 7, "each Works entry has one plain-language sentence");
assert.doesNotMatch(
  worksIndex,
  /<img\b|<picture\b|<figure\b|folio-work-plate|machine-lab-interface\.png|urban-dynamics-console\.png|folio-tags|>\s*(?:Role|Status|Methods)\s*</i,
  "Works index uses no thumbnails or portfolio-template metadata"
);
for (const title of [
  "Machine Lab — Interactive CNC Assembly Explorer",
  "Abu Dhabi Urban Dynamics Lab",
  "KU MetaHub AI/XR Lab",
  "ADSG Public Policy Simulations",
  "Energy System Optimization with DEWA",
  "Logistics Routing and Facility Optimization",
  "Probabilistic VNS for Delivery Territory Design",
]) {
  assertContains(worksIndex, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `Works includes ${title}`);
}
assertContains(routes.works, /href="\/projects\/abu-dhabi-urban-dynamics\/"/, "Works opens the Urban Dynamics write-up");
assert.doesNotMatch(routes.works, /href="\/projects\/abu-dhabi-urban-dynamics-v2\/"/, "Works does not drop readers directly into the console");
assert.doesNotMatch(
  workCard,
  /work\.(?:role|status|methods|category|image|visual)/,
  "the shared work index entry consumes only title, description, URL, and number"
);

const cncInteractive = block(routes.cnc, "folio-case-interactive");
assert.equal((cncInteractive.match(/<iframe\b/g) || []).length, 1, "CNC case study embeds one live explorer");
assertContains(
  cncInteractive,
  /<iframe[\s\S]*?src="https:\/\/ahmed-o-aly\.github\.io\/cnc-machine-inspector\/"/,
  "CNC case study embeds the stable Machine Lab route"
);
assertContains(cncInteractive, /title="Machine Lab interactive CNC assembly explorer"/, "CNC explorer has a useful title");
assertContains(cncInteractive, /loading="lazy"/, "CNC explorer defers its large application payload");
assertContains(cncInteractive, /allow="fullscreen; xr-spatial-tracking"/, "CNC explorer permits only fullscreen and WebXR");
assertContains(cncInteractive, /allowfullscreen/, "CNC explorer supports a full-screen handoff");
assertContains(cncInteractive, /referrerpolicy="strict-origin-when-cross-origin"/, "CNC explorer uses a conservative referrer policy");
assertContains(
  cncInteractive,
  /<a[^>]*class="folio-case-interactive__launch"[^>]*href="https:\/\/ahmed-o-aly\.github\.io\/cnc-machine-inspector\/"[^>]*>[\s\S]*?Open Machine Lab full screen/,
  "CNC case study keeps a prominent non-iframe launch"
);
assert.doesNotMatch(routes.cnc, /<dt>\s*(?:Role|Methods|Status)\s*<\/dt>/i, "CNC page replaces template metadata with the live work");
assert.doesNotMatch(
  routes.cnc,
  /class="folio-case-gallery"|>\s*Inside the experience\s*</i,
  "CNC page does not follow the live explorer with a screenshot gallery"
);
const cncProse = block(routes.cnc, "folio-prose", "div");
assertContains(cncProse, /I built Machine Lab/, "CNC write-up starts in Ahmed's first-person voice");
assert.doesNotMatch(
  cncProse,
  /<h[2-6]\b|What had to change|The shape of the work|What remains inspectable|What This Shows/i,
  "CNC write-up uses plain paragraphs instead of case-study prompts"
);
assert.doesNotMatch(routes.cnc, /class="folio-case-sections"/, "CNC page does not render generated case-study modules");

const urbanInteractive = block(routes.urban, "folio-case-interactive");
assertContains(
  urbanInteractive,
  /href="\/projects\/abu-dhabi-urban-dynamics-v2\/"[^>]*>[\s\S]*?Open the simulation/,
  "Urban Dynamics write-up launches the full simulation"
);
assert.doesNotMatch(urbanInteractive, /<iframe\b/, "the full analyst console is not squeezed into the write-up");
const urbanProse = block(routes.urban, "folio-prose", "div");
assertContains(urbanProse, /I built this as a browser-based sandbox/, "Urban Dynamics has a first-person project note");
assertContains(urbanProse, /6,070 citizen agents and 600 enterprise agents/, "Urban Dynamics note states the model scale");
assertContains(urbanProse, /exploratory model, not a forecast/, "Urban Dynamics note states its limits plainly");
assert.doesNotMatch(urbanProse, /<h[2-6]\b|Narrative|What This Shows|What matters/i, "Urban Dynamics note avoids portfolio-template headings");
assert.doesNotMatch(
  routes.urban,
  /class="folio-case-sections"|<dt>\s*(?:Role|Methods|Status)\s*<\/dt>/i,
  "Urban Dynamics write-up has no generated case-study scaffolding"
);

const policySimulationProse = block(routes.policySimulations, "folio-prose", "div");
assertContains(
  policySimulationProse,
  /I support the Abu Dhabi School of Government department/,
  "ADSG simulations use a direct first-person account"
);
assert.doesNotMatch(policySimulationProse, /<h[2-6]\b|Narrative|What This Shows|What matters/i, "ADSG simulations avoid generated headings");
assert.doesNotMatch(
  routes.policySimulations,
  /class="folio-case-sections"|<dt>\s*(?:Role|Methods|Status)\s*<\/dt>/i,
  "ADSG simulations do not render generated case-study scaffolding"
);
assertContains(config, /\n\s*- tmp\//, "Jekyll excludes the ignored 150MB app clone from local builds");

for (const text of ["A working record, kept in order.", "Experience", "Education", "Credentials", "Six Sigma Yellow Belt Specialization"]) {
  assertContains(routes.records, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `Records renders ${text}`);
}
assert.doesNotMatch(routes.records, /folio-certificate|Certificates, framed/, "Records removes certificate cards");
assertContains(routes.records, /href="\/assets\/pdf\/Ahmed(?:%20| )Aly(?:%20| )CV\.pdf"/, "Records retains the CV download");
assertContains(routes.marginalia, /Notes in the margins\./, "Marginalia uses the selected page claim");
assert.ok((routes.marginalia.match(/<time>/g) || []).length >= 7, "Marginalia renders all authored notes");
assert.doesNotMatch(routes.marginalia, /folio-note-card/, "Marginalia keeps a uniform feed");

assertContains(tokens, /--garden-canvas:\s*#f6f0e3/i, "source keeps the parchment token");
assertContains(tokens, /--garden-ink:\s*#372b1f/i, "source keeps the ink token");
assertContains(tokens, /--garden-quiet:\s*#6f5233/i, "small sepia text uses the v2 tone");
assertContains(tokens, /--garden-accent-hover:\s*#5d2418/i, "source keeps the v2 hover accent");
assertContains(tokens, /--garden-mono:\s*"IBM Plex Mono"/i, "source defines the mono face");
assert.doesNotMatch(
  `${tokens}${projectFile("_sass/garden/_content.scss")}${projectFile("_sass/garden/_simulation.scss")}${simulationCss}`,
  /--garden-sans/,
  "legacy Garamond UI alias is retired"
);
assertContains(head, /IBM\+Plex\+Mono:wght@400;500/, "head loads IBM Plex Mono 400 and 500");
assertContains(shellCss, /\.garden-nav__links a \{[\s\S]*?min-height:\s*44px;/, "nav links retain 44px targets");
assertContains(shellCss, /\.garden-nav__contact \{[\s\S]*?min-height:\s*44px !important;/, "Contact retains a 44px target");
assertContains(shellCss, /\.garden-nav__toggle \{[\s\S]*?width:\s*44px;[\s\S]*?height:\s*44px;/, "mobile menu trigger retains a 44px target");
assertContains(css, /\.garden-body :focus-visible\{[^}]*outline:/, "compiled styles retain a visible focus indicator");
assertContains(folioCss, /animation:\s*folio-page-enter 0\.4s/, "page entry uses the 400ms handoff timing");
assertContains(folioCss, /@media \(prefers-reduced-motion: reduce\)/, "styles respect reduced motion");
assertContains(script, /prefers-reduced-motion: reduce/, "behavior respects reduced motion");
assertContains(script, /dataset\.parallaxY/, "library parallax uses explicit travel values");
assertContains(script, /data-book-trigger/, "book interactions remain data-driven");
assert.doesNotMatch(
  `${script}${layout}${projectFile("_layouts/page.liquid")}${projectFile("_pages/home.md")}`,
  /IntersectionObserver|data-reveal|data-drift|data-page-turn|folio-page-turn|folio-cursor-glow|folio-ink-dot/,
  "retired motion systems are absent"
);
assertContains(
  simulationCss,
  /\.garden-body--simulation-v2 \.garden-nav__brand,[\s\S]*?min-height: 44px;/,
  "simulation retains accessible compact branding"
);
assertContains(folioCss, /\.folio-book-dialog::backdrop/, "book dialog provides a readable modal scrim");
assertContains(footer, /bunny-ink\.svg/, "footer uses the plain bunny mark");
assert.doesNotMatch(footer, /seal\.svg/, "footer does not use the enclosed leaf seal");

for (const asset of ["bunny-ink.svg", "bunny-ink-small.svg", "bunny-cream.svg", "bunny-sepia-ornament.svg"]) {
  assert.equal(existsSync(new URL(`../assets/img/folio/${asset}`, import.meta.url)), true, `${asset} is present`);
}
assertContains(config, /icon:\s*folio\/bunny-ink-small\.svg/, "configuration uses the small bunny favicon");
assertContains(config, /og_image:\s*["']?\/assets\/img\/og-folio-v2\.png["']?/, "configuration uses the v2 social card");
const ogPath = new URL("../assets/img/og-folio-v2.png", import.meta.url);
const ogMetadata = await sharp(fileURLToPath(ogPath)).metadata();
assert.deepEqual([ogMetadata.width, ogMetadata.height], [1200, 630], "social card is 1200x630");
assert.ok(statSync(ogPath).size < 200_000, "social card stays below 200KB");

console.log("folio v2 contract passed");
