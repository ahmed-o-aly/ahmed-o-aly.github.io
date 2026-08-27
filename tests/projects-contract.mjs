import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const index = readRoute("/projects/");
const project = readRoute("/projects/metahub-ai-xr-lab/");
const artifactProject = readRoute("/projects/territory-design-probvns/");
const cncProject = readRoute("/projects/cnc-machine-inspector/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const cncEvidence = JSON.parse(readFileSync(new URL("../assets/data/cnc-machine-inspector/portfolio-evidence.json", import.meta.url), "utf8"));
const cncPreviewSvg = readFileSync(new URL("../assets/img/projects/cnc-machine-inspector/machine-lab-interface.svg", import.meta.url), "utf8");
const projectArticles = index.match(/<article\b[^>]*garden-card--project[\s\S]*?<\/article>/g) || [];
const articleFor = (href) => projectArticles.find((article) => article.includes(`href="${href}"`)) || "";
const urbanArticle = articleFor("/projects/abu-dhabi-urban-dynamics-v2/");
const cncArticle = articleFor("/projects/cnc-machine-inspector/");

assertContains(index, /class="[^"]*garden-project-grid/, "project index renders garden grid");
assertContains(index, /KU MetaHub AI\/XR Lab/, "project index includes MetaHub");
assertContains(index, /href="\/projects\/cnc-machine-inspector\/"/, "project index includes Machine Lab");
assertContains(index, /href="\/projects\/abu-dhabi-urban-dynamics-v2\/"/, "project index includes the urban model");
assertContains(index, /<picture>[\s\S]*?srcset=/, "project cards provide responsive image candidates");
assertContains(
  urbanArticle,
  /<source[^>]*sizes="\(min-width: 1280px\) 790px, \(min-width: 1024px\) 66vw, \(min-width: 640px\) 50vw, 100vw"/,
  "wide urban-model media advertises its two-column rendered width"
);
assertContains(
  cncArticle,
  /<source[^>]*sizes="\(min-width: 1280px\) 390px, \(min-width: 1024px\) 33vw, \(min-width: 640px\) 50vw, 100vw"/,
  "standard Machine Lab media advertises its one-column rendered width"
);
assertContains(cncArticle, /<img[^>]*loading="eager"[^>]*fetchpriority="high"/, "the leading Machine Lab image is prioritized");
assertContains(cncArticle, /garden-card--media-widescreen/, "Machine Lab preserves the full interface aspect ratio");
assertContains(urbanArticle, /garden-card--media-widescreen/, "urban-model card preserves the full interface aspect ratio");
assertContains(
  css,
  /\.garden-card--project\.garden-card--media-widescreen \.garden-media\{aspect-ratio:16\/9\}/,
  "widescreen project media stays 16:9 at every viewport"
);

assert.equal((cncProject.match(/class="garden-case__gallery-grid"/g) || []).length, 1, "Machine Lab renders one project gallery");
assert.equal((cncProject.match(/<figcaption>/g) || []).length, 3, "Machine Lab gallery includes three captioned machine views");
const galleryMarkup = cncProject.match(/<div class="garden-case__gallery-grid">([\s\S]*?)<\/div>\s*<\/section>/)?.[1] || "";
const gallerySizes = [...galleryMarkup.matchAll(/<source[^>]*sizes="([^"]+)"/g)].map((match) => match[1]);
assert.equal(gallerySizes.length, 3, "every Machine Lab gallery item emits a responsive source");
assert.equal(
  gallerySizes[0],
  "(min-width: 1200px) 1120px, (min-width: 800px) calc(100vw - 80px), 100vw",
  "featured machine media advertises its full rendered width"
);
assert.ok(
  gallerySizes.slice(1).every((sizes) => sizes === "(min-width: 1200px) 552px, (min-width: 800px) calc(50vw - 48px), 100vw"),
  "supporting machine views advertise their half-width desktop size"
);
const galleryImages = [...galleryMarkup.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
assert.equal(galleryImages.length, 3, "Machine Lab gallery contains exactly three responsive images");
assert.match(galleryImages[0], /loading="eager"[^>]*fetchpriority="high"/, "featured gallery image is prioritized for LCP");
assert.ok(
  galleryImages.slice(1).every((image) => /loading="lazy"[^>]*fetchpriority="auto"/.test(image)),
  "supporting gallery images remain lazy and auto-priority"
);
assert.equal((galleryMarkup.match(/garden-media--zoom-large/g) || []).length, 2, "supporting machine renders are cropped closer in their frames");
assertContains(cncProject, /Eight machine packages and 197 named learning components/, "Machine Lab reports its validated scope");
const cncMachines = Object.values(cncEvidence.machines);
const computedCncPortfolio = {
  machines: cncMachines.length,
  components: cncMachines.reduce((total, machine) => total + machine.components.total, 0),
  sourceTriangles: cncMachines.reduce((total, machine) => total + machine.sourceTriangles, 0),
  unassignedGeometryNodes: cncMachines.reduce((total, machine) => total + machine.unassignedGeometryNodes, 0),
  duplicateAssignments: cncMachines.reduce((total, machine) => total + machine.duplicateAssignments, 0),
  intentionallyExcludedTriangles: cncMachines.reduce((total, machine) => total + machine.intentionallyExcludedTriangles, 0),
  expandedValidationReports: cncMachines.filter((machine) => machine.expandedValidation).length,
};
assert.deepEqual(computedCncPortfolio, cncEvidence.portfolio, "Machine Lab portfolio claims reconcile across all eight upstream reports");
assert.match(cncEvidence.sourceRevision, /^[a-f0-9]{40}$/, "CNC evidence identifies the reviewed upstream revision");
assert.ok(
  cncMachines.every(
    (machine) => /^models\/.+\/validation-report\.json$/.test(machine.validationReportPath) && /^[a-f0-9]{64}$/.test(machine.validationReportSha256)
  ),
  "every CNC machine records a report path and SHA-256 evidence hash"
);
assert.equal(
  Object.values(cncEvidence.machines.dmu50.components.byLevel).reduce((total, count) => total + count, 0),
  cncEvidence.machines.dmu50.components.total,
  "DMU 50 evidence reconciles component levels to the published total"
);
assertContains(
  cncPreviewSvg,
  new RegExp(`${cncEvidence.machines.dmu50.components.total} named components`),
  "Machine Lab preview uses the checked DMU 50 component count"
);
assertContains(
  cncProject,
  /href="https:\/\/ahmed-o-aly\.github\.io\/cnc-machine-inspector\/"[^>]*>Launch Machine Lab<\/a>/,
  "Machine Lab case study links to the live interactive experience"
);
assert.doesNotMatch(
  cncProject,
  /href="\/projects\/abu-dhabi-urban-dynamics\/"/,
  "related-project navigation excludes the retired urban-model preview"
);
const relatedMarkup = cncProject.match(/<nav class="garden-related"[\s\S]*?<\/nav>/)?.[0] || "";
assert.equal((relatedMarkup.match(/<a\b/g) || []).length, 3, "related navigation fills all three public-project slots");

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
