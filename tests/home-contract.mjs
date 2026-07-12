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
assert.doesNotMatch(home, /&amp;nearr;/, "card direction glyph is not rendered as escaped source text");
assertContains(home, /aria-hidden="true">(?:&#8599;|↗)<\/span>/, "card direction glyph renders as an arrow");
assert.doesNotMatch(home, /data-route=|data-portfolio-app|portfolio-home\.js/, "home no longer ships the mini-SPA");
assertContains(about, /id="credentials"/, "about provides the achievements compatibility anchor");
assert.doesNotMatch(
  `${home}\n${about}`,
  /\u00c2\u00b7|\u00e2\u2020\u2014|\u00e2\u20ac\u2122/,
  "home and about do not render encoding-corrupted text"
);
console.log("home contract passed");
