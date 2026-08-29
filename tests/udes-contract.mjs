import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const html = readRoute("/projects/abu-dhabi-urban-dynamics/");
const consoleHtml = readRoute("/projects/abu-dhabi-urban-dynamics-v2/");
const source = readFileSync(new URL("../_projects/abu-dhabi-urban-dynamics.md", import.meta.url), "utf8");

assert.equal((html.match(/<h1\b/g) || []).length, 1, "Urban Dynamics write-up has one page heading");
assertContains(html, /class="folio-page folio-case-page"/, "Urban Dynamics uses the shared project-page shell");
assertContains(
  html,
  /class="folio-case-interactive__launch"[^>]*href="\/projects\/abu-dhabi-urban-dynamics-v2\/"/,
  "the write-up launches the full analyst console"
);
assert.doesNotMatch(html, /<iframe\b/, "the full desktop console is not embedded in the article");
assertContains(html, /I built this as a browser-based sandbox/, "the write-up is a direct first-person account");
assertContains(html, /18 districts/, "the write-up states the city-model scope");
assertContains(html, /6,070 citizen agents and 600 enterprise agents/, "the write-up states the agent scale");
assertContains(html, /exploratory model, not a forecast/, "the write-up states its evidentiary limit");
assert.doesNotMatch(
  html,
  /What had to change|The shape of the work|What remains inspectable|Choices that shaped the result|What the work made possible|Narrative|What This Shows/i,
  "the write-up avoids generated case-study headings"
);
assert.doesNotMatch(html, /data-udes-v2-root/, "the write-up and simulation remain separate pages");
assertContains(
  consoleHtml,
  /class="udes-v2-back" href="\/projects\/abu-dhabi-urban-dynamics\/" aria-label="Back to the project write-up"/,
  "the simulation returns to its write-up"
);
assert.match(source, /^layout: page$/m, "the old route is now the canonical project note");
assert.match(source, /^preview: false$/m, "the write-up is published in Works");
assert.doesNotMatch(source, /^redirect:|^sitemap: false$/m, "the write-up is no longer a hidden redirect");

console.log("UDES write-up contract passed");
