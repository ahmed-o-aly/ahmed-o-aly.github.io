import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const home = readRoute("/");
const about = readRoute("/about/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const cardStyles = readFileSync(new URL("../_sass/garden/_cards.scss", import.meta.url), "utf8");
const responsiveStyles = readFileSync(new URL("../_sass/garden/_responsive.scss", import.meta.url), "utf8");

function readMinWidthMediaBlocks(styles, minWidth) {
  const mediaStart = new RegExp(String.raw`@media\s*\(\s*min-width\s*:\s*${minWidth}px\s*\)\s*\{`, "g");
  const blocks = [];

  for (const match of styles.matchAll(mediaStart)) {
    let depth = 1;
    let cursor = match.index + match[0].length;

    while (depth > 0 && cursor < styles.length) {
      if (styles[cursor] === "{") depth += 1;
      if (styles[cursor] === "}") depth -= 1;
      cursor += 1;
    }

    assert.equal(depth, 0, `${minWidth}px media block is balanced`);
    blocks.push(styles.slice(match.index, cursor));
  }

  assert.ok(blocks.length > 0, `${minWidth}px media block exists`);
  return blocks.join("\n");
}

const tabletSource = readMinWidthMediaBlocks(responsiveStyles, 640);
const desktopSource = readMinWidthMediaBlocks(responsiveStyles, 1024);
const tabletCss = readMinWidthMediaBlocks(css, 640);
const desktopCss = readMinWidthMediaBlocks(css, 1024);
const homeCardArticles = [...home.matchAll(/<article class="[^"]*\bgarden-card\b[^"]*"[^>]*>[\s\S]*?<\/article>/g)].map(([article]) => article);
assertContains(home, /class="[^"]*garden-home__intro/, "home renders editorial introduction");
assertContains(home, /class="[^"]*garden-grid/, "home renders the mixed garden grid");
assertContains(home, /class="[^"]*garden-card--project/, "home includes a project card");
assertContains(home, /class="[^"]*garden-card--post/, "home includes a writing card");
assertContains(home, /class="[^"]*garden-card--book/, "home includes a reading card");
assert.equal((home.match(/<h1\b/g) || []).length, 1, "home has one h1");
assert.ok(homeCardArticles.length > 0, "home renders linked garden cards");
for (const article of homeCardArticles) {
  assertContains(article, /<h2 class="garden-card__title">/, "homepage cards default to h2 titles");
  assert.doesNotMatch(article, /<h3\b/, "homepage cards do not opt into the Reading shelf level");
}
assert.doesNotMatch(home, /&amp;nearr;/, "card direction glyph is not rendered as escaped source text");
assertContains(home, /aria-hidden="true">(?:&#8599;|↗)<\/span>/, "card direction glyph renders as an arrow");
assertContains(
  cardStyles,
  /\.garden-home\.garden-container\s*\{[^}]*max-width:\s*var\(--garden-max\);/,
  "home source neutralizes the retained narrow container cap"
);
assertContains(
  cardStyles,
  /\.garden-grid\s*\{[^}]*grid-auto-flow:\s*row;/,
  "garden grids use sparse row auto-placement so visual order follows DOM order"
);
assert.doesNotMatch(cardStyles, /grid-auto-flow:\s*dense/, "garden grid source does not enable dense backfilling");
assertContains(css, /\.garden-grid\{[^}]*grid-auto-flow:row/, "compiled garden grids preserve DOM order");
assert.doesNotMatch(css, /grid-auto-flow:dense/, "compiled garden CSS does not enable dense backfilling");
assertContains(cardStyles, /\.garden-card__title\s*\{/, "card title styling uses a heading-level-independent class");
assert.doesNotMatch(cardStyles, /\.garden-card__copy\s+h[1-6]/, "card title styling is not coupled to a heading tag");
assertContains(css, /\.garden-card__title\{/, "compiled card title styling is heading-level independent");
assertContains(css, /\.garden-home\.garden-container\{[^}]*max-width:var\(--garden-max\)/, "compiled home grid can use the full garden container");
assertContains(
  tabletSource,
  /\.garden-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/,
  "tablet source uses two grid columns"
);
assertContains(tabletSource, /\.garden-home__intro[^{}]*\{[^}]*grid-column:\s*span 2;/, "tablet source keeps the intro full width");
assert.doesNotMatch(tabletSource, /\.garden-card--(?:wide|tall)\b/, "tablet source leaves card spans regular");
assertContains(
  desktopSource,
  /\.garden-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/,
  "desktop source uses three grid columns"
);
assertContains(desktopSource, /\.garden-card--wide\s*\{[^}]*grid-column:\s*span 2;/, "desktop source applies wide card spans");
assertContains(desktopSource, /\.garden-card--tall\s*\{[^}]*grid-row:\s*span 2;/, "desktop source applies tall card spans");
assertContains(tabletCss, /\.garden-grid\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/, "compiled tablet CSS uses two grid columns");
assertContains(tabletCss, /\.garden-home__intro[^{}]*\{[^}]*grid-column:span 2/, "compiled tablet CSS keeps the intro full width");
assert.doesNotMatch(tabletCss, /\.garden-card--(?:wide|tall)\b/, "compiled tablet CSS leaves card spans regular");
assertContains(desktopCss, /\.garden-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/, "compiled desktop CSS uses three grid columns");
assertContains(desktopCss, /\.garden-card--wide\{[^}]*grid-column:span 2/, "compiled desktop CSS applies wide card spans");
assertContains(desktopCss, /\.garden-card--tall\{[^}]*grid-row:span 2/, "compiled desktop CSS applies tall card spans");
assert.doesNotMatch(home, /data-route=|data-portfolio-app|portfolio-home\.js/, "home no longer ships the mini-SPA");
assertContains(about, /id="credentials"/, "about provides the achievements compatibility anchor");
assert.doesNotMatch(
  `${home}\n${about}`,
  /\u00c2\u00b7|\u00e2\u2020\u2014|\u00e2\u20ac\u2122/,
  "home and about do not render encoding-corrupted text"
);
console.log("home contract passed");
