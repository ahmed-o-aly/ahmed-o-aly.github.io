import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const focusedContracts = [
  "./shell-contract.mjs",
  "./home-contract.mjs",
  "./projects-contract.mjs",
  "./writing-contract.mjs",
  "./reading-contract.mjs",
  "./utility-contract.mjs",
  "./legacy-contract.mjs",
  "./garden-enhancement-contract.mjs",
];

for (const contract of focusedContracts) await import(contract);

const projectFile = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(projectFile("package.json"));
const deployWorkflow = projectFile(".github/workflows/deploy.yml");
const axeWorkflow = projectFile(".github/workflows/axe.yml");

const formatTargets = [
  "tests/**/*.mjs",
  "assets/js/garden.js",
  "assets/css/garden.scss",
  "_sass/garden/**/*.scss",
  "_includes/garden-*.liquid",
  "_layouts/{archive,bib,book-review,cv,default,garden,home,page,post}.liquid",
  "_pages/{404,about,blog,books,home,projects,publications,repositories}.md",
  "_includes/cv/{nested_list,time_table}.liquid",
  "package.json",
  ".github/workflows/{axe,deploy}.yml",
];
const expectedFormatCommand = `prettier --check ${formatTargets.map((target) => JSON.stringify(target)).join(" ")}`;

assert.equal((deployWorkflow.match(/^\s+- "tests\/\*\*"$/gm) || []).length, 2, "deploy watches tests for push and pull requests");
assert.equal((axeWorkflow.match(/^\s+- "tests\/\*\*"$/gm) || []).length, 1, "axe watches contract changes");
assert.match(
  deployWorkflow,
  /- name: Verify generated site\s+run: \|\s+test -f _site\/index\.html\s+node tests\/site-contract\.mjs/,
  "deploy verifies the generated site through the aggregate contract"
);

const expectedAxePaths = [
  "",
  "projects/",
  "projects/metahub-ai-xr-lab/",
  "blog/",
  "blog/2026/what-i-am-building-this-site-for/",
  "books/",
  "books/the_godfather/",
  "about/",
  "cv/",
  "publications/",
  "404.html",
];
const matrixBlock = axeWorkflow.match(/strategy:\s*\r?\n\s+fail-fast: false\s*\r?\n\s+matrix:\s*\r?\n\s+path:\s*\r?\n((?:\s+- .*\r?\n)+)/);
assert.ok(matrixBlock, "axe defines a non-fail-fast path matrix");
const matrixPaths = matrixBlock[1]
  .trim()
  .split(/\r?\n/)
  .map((line) => JSON.parse(line.replace(/^\s*-\s+/, "")));
assert.deepEqual(matrixPaths, expectedAxePaths, "axe covers the complete representative route matrix");

const axeCommands = (axeWorkflow.match(/^\s*node \.github\/scripts\/run-axe\.mjs .*$/gm) || []).map((command) => command.trim());
assert.deepEqual(
  axeCommands,
  ['node .github/scripts/run-axe.mjs "http://127.0.0.1:8080/${{ matrix.path }}" 1500'],
  "axe runs the matrix route with the approved load delay"
);

assert.equal(packageJson.scripts?.["format:check"], expectedFormatCommand, "format:check covers the redesigned source surface");
assert.equal(packageJson.scripts?.["test:site"], "node tests/site-contract.mjs", "test:site runs the aggregate contract");

console.log("all site contracts passed");
