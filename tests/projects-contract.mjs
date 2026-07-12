import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const index = readRoute("/projects/");
const project = readRoute("/projects/metahub-ai-xr-lab/");
const artifactProject = readRoute("/projects/territory-design-probvns/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");

assertContains(index, /class="[^"]*garden-project-grid/, "project index renders garden grid");
assertContains(index, /KU MetaHub AI\/XR Lab/, "project index includes MetaHub");

const sectionIds = ["problem", "constraints", "system", "proof", "decisions", "outcomes"];
for (const id of sectionIds) {
  assertContains(project, new RegExp(`id="${id}"`), `case study renders ${id}`);
}
assertContains(project, /class="[^"]*garden-case__meta/, "case study renders structured metadata");
assert.equal((project.match(/<h1\b/g) || []).length, 1, "case study has one h1");

const sectionPositions = sectionIds.map((id) => project.indexOf(`id="${id}"`));
assert.deepEqual(
  [...sectionPositions].sort((a, b) => a - b),
  sectionPositions,
  "case-study sections follow the expected semantic order"
);

assertContains(
  artifactProject,
  /<section id="proof"[\s\S]*?<a href="https:\/\/github\.com\/ahmed-o-aly\/TerritoryDesign"[^>]*>\s*Code and data\s*<\/a>/,
  "proof area preserves the external code artifact with accessible text"
);
assertContains(artifactProject, /class="[^"]*garden-related/, "case study renders related projects");
assertContains(
  css,
  /\.garden-related a\{(?=[^}]*min-height:44px)(?=[^}]*min-width:44px)(?=[^}]*display:inline-flex)[^}]*\}/,
  "related project links expose touch-friendly targets"
);

console.log("projects contract passed");
