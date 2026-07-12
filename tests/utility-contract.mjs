import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const about = readRoute("/about/");
const cv = readRoute("/cv/");
const publications = readRoute("/publications/");
const missing = readRoute("/404.html");
const repositories = readRoute("/repositories/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const cvTemplate = readFileSync(new URL("../_layouts/cv.liquid", import.meta.url), "utf8");
const gardenLayout = readFileSync(new URL("../_layouts/garden.liquid", import.meta.url), "utf8");
const contentStyles = readFileSync(new URL("../_sass/garden/_content.scss", import.meta.url), "utf8");
const utilitySources = ["about.md", "publications.md", "repositories.md", "404.md"].map((file) =>
  readFileSync(new URL(`../_pages/${file}`, import.meta.url), "utf8")
);

assertContains(about, /id="credentials"/, "about exposes credentials anchor");
assertContains(about, /aria-labelledby="credentials-title"/, "about credentials section has an accessible name");
assertContains(about, /href="\/assets\/pdf\/Coursera(?:%20| )OMF75NR8PBY4\.pdf"/, "about retains certificate access");
assertContains(cv, /class="[^"]*garden-cv/, "CV uses shared pattern");
assertContains(publications, /class="[^"]*garden-publications/, "publications use shared pattern");
assertContains(missing, /class="[^"]*garden-not-found/, "404 has useful empty state");

for (const [title, detail] of [
  ["General Information", "Abu Dhabi, UAE"],
  ["Education", "University of Leeds, UK"],
  ["Experience", "Lab Specialist, MetaHub and Abu Dhabi School of Government"],
  ["Certifications", "Six Sigma Yellow Belt Specialization"],
  ["Skills", "Methods: Optimization"],
]) {
  assertContains(cv, new RegExp(title, "i"), `CV renders the ${title} data section`);
  assertContains(cv, new RegExp(detail, "i"), `CV renders data-backed ${title} content`);
}
assertContains(cv, /href="mailto:ahmed\.oss\.aly@gmail\.com"/, "CV retains a data-backed email action");
assertContains(cv, /href="https:\/\/www\.linkedin\.com\/in\/ahmed-aly-76a56b182\/?"/, "CV retains a data-backed LinkedIn action");
assertContains(cv, /href="https:\/\/github\.com\/ahmed-o-aly\/?"/, "CV retains a data-backed GitHub action");
assertContains(cv, /href="\/assets\/pdf\/Ahmed(?:%20| )Aly(?:%20| )CV\.pdf"/, "CV retains its PDF action");
assert.equal((cv.match(/<h1\b/g) || []).length, 1, "CV has exactly one h1");

assertContains(cvTemplate, /for entry in site\.data\.cv/, "CV treats cv.yml as its section source");
for (const type of ["time_table", "list", "map", "nested_list", "list_groups"]) {
  assertContains(cvTemplate, new RegExp(`when ['"]${type}['"][\\s\\S]*include cv\\/${type}\\.liquid`), `CV preserves the ${type} include contract`);
}
for (const key of ["email", "linkedin_username", "github_username", "cv_pdf"]) {
  assertContains(cvTemplate, new RegExp(`site\\.data\\.socials\\.${key}`), `CV reads ${key} from socials.yml`);
}
assert.doesNotMatch(
  cvTemplate,
  /ahmed\.oss\.aly@gmail\.com|ahmed-aly-76a56b182|github\.com\/ahmed-o-aly|Lab Specialist, MetaHub/i,
  "CV template does not duplicate YAML-backed identity or role copy"
);

assertContains(publications, /class="publication-bridge"[\s\S]*href="\/projects\/territory-design-probvns\/"/, "publications retain project context");
assertContains(
  publications,
  /class="publication-bridge"[\s\S]*href="\/blog\/2025\/territory-design-bvns\/"/,
  "publications retain authored walkthrough context"
);
assertContains(
  publications,
  /class="garden-publications"[\s\S]*id="bibsearch"[\s\S]*class="publications"[\s\S]*<ol class="bibliography">/,
  "publication search and bibliography live inside the shared wrapper"
);
assertContains(publications, /href="https:\/\/github\.com\/ahmed-o-aly\/TerritoryDesign"/, "bibliography retains the authored code link");
assertContains(publications, /<img[^>]*class="[^"]*preview[^"]*"[^>]*src="https:\/\//i, "remote publication previews remain visible");
assert.doesNotMatch(publications, /class="[^"]*\bpreview\b[^"]*\bz-depth-/i, "publication previews do not inherit glossy elevation effects");
assert.equal((publications.match(/<h1\b/g) || []).length, 1, "publications do not duplicate the page intro");

assert.equal((missing.match(/<h1\b/g) || []).length, 1, "404 has exactly one h1");
assertContains(missing, /Return home/, "404 offers a home route");
for (const route of ["projects", "blog", "books"]) {
  assertContains(missing, new RegExp(`href="\\/${route}\\/"`), `404 offers the ${route} route`);
}

const refreshPattern = /<meta http-equiv="refresh" content="0; url=\/projects\/">/gi;
assert.equal((repositories.match(refreshPattern) || []).length, 1, "repositories emits one exact projects redirect");
assertContains(
  repositories,
  /Repository work now lives[\s\S]*<a href="\/projects\/">Projects<\/a>/,
  "repositories retains a server-rendered fallback link"
);
for (const [html, label] of [
  [about, "about"],
  [cv, "CV"],
  [publications, "publications"],
  [missing, "404"],
]) {
  assert.doesNotMatch(html, /http-equiv="refresh"/i, `${label} does not force a redirect`);
}
assertContains(gardenLayout, /page\.redirect\s+and\s+page\.redirect\s*!=\s*true/, "garden redirect excludes boolean true");
assertContains(gardenLayout, /redirect_url\s*\|\s*escape/, "garden redirect URL is escaped in attribute context");

const cssRules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, declarations]) => ({
  selector,
  declarations,
}));
function assertTouchTarget(selectorFragment, label) {
  const rule = cssRules.find(
    ({ selector, declarations }) =>
      selector.includes(selectorFragment) &&
      declarations.includes("display:inline-flex") &&
      declarations.includes("min-width:44px") &&
      declarations.includes("min-height:44px")
  );
  assert.ok(rule, `${label} exposes touch-friendly targets`);
}
for (const [selector, label] of [
  [".garden-section a", "about links"],
  [".garden-cv a", "CV links"],
  [".publication-bridge a", "publication bridge links"],
  [".garden-publications a", "publication bibliography links"],
  [".garden-not-found a", "404 links"],
  [".garden-redirect a", "repository fallback links"],
]) {
  assertTouchTarget(selector, label);
}
assertContains(css, /\.garden-body :focus-visible\{[^}]*outline:/, "utility links inherit a visible keyboard focus state");

const publicationRules = cssRules
  .filter(({ selector }) => selector.includes(".garden-publications"))
  .map(({ declarations }) => declarations)
  .join("\n");
assert.match(publicationRules, /background:var\(--garden-(?:canvas|surface)\)/, "publication media uses a neutral matte background");
assert.doesNotMatch(publicationRules, /gradient|(?:backdrop-)?filter:/i, "publication treatment stays natural-color and matte");
assert.doesNotMatch(contentStyles, /gradient|(?:backdrop-)?filter\s*:/i, "utility source styles avoid gradients, glass, and filters");
for (const [styles, label] of [
  [publicationRules, "compiled publication treatment"],
  [contentStyles, "utility source styles"],
]) {
  for (const [, value] of styles.matchAll(/box-shadow:\s*([^;}]+)/gi)) {
    assert.match(value.trim(), /^none\b/i, `${label} only uses box-shadow to cancel inherited shine`);
  }
}

const mojibake = /\u00c2\u00b7|\u00e2\u2020\u2014|\u00e2\u20ac\u2122|\u00e2\u20ac\u00a2/;
for (const [source, label] of [
  [about, "about route"],
  [cv, "CV route"],
  [publications, "publications route"],
  [missing, "404 route"],
  [repositories, "repositories route"],
  [utilitySources.join("\n"), "utility sources"],
  [cvTemplate, "CV template"],
]) {
  assert.doesNotMatch(source, mojibake, `${label} does not contain encoding-corrupted text`);
}

console.log("utility contract passed");
