import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const html = readRoute("/projects/abu-dhabi-urban-dynamics/");
const source = readFileSync(new URL("../_projects/abu-dhabi-urban-dynamics.md", import.meta.url), "utf8");

assertContains(html, /class="[^"]*garden-body/, "legacy URL uses the shared garden shell");
assertContains(
  html,
  /http-equiv="refresh" content="0; url=\/projects\/abu-dhabi-urban-dynamics-v2\/"/,
  "legacy URL immediately redirects to the current city model"
);
assertContains(
  html,
  /rel="canonical" href="https:\/\/ahmed-o-aly\.github\.io\/projects\/abu-dhabi-urban-dynamics-v2\/"/,
  "legacy URL canonicalizes to the current project"
);
assertContains(html, /Abu Dhabi Urban Dynamics Lab has moved/, "legacy fallback clearly explains the project move");
assertContains(
  html,
  /href="\/projects\/abu-dhabi-urban-dynamics-v2\/"[^>]*>Open the current Abu Dhabi Urban Dynamics Lab<\/a>/,
  "legacy fallback provides a direct link to the current project"
);
assert.doesNotMatch(html, /data-udes-root|Al Ain|Al Dhafra|Ruwais/, "legacy URL no longer exposes the conflicting emirate-wide prototype");
assert.match(source, /^sitemap: false$/m, "legacy redirect is excluded from the sitemap");

console.log("UDES legacy redirect contract passed");
