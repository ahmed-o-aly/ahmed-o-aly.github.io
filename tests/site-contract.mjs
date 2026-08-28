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
  "./udes-contract.mjs",
  "./udes-v2-history.mjs",
  "./udes-v2-contract.mjs",
];

const projectFile = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(projectFile("package.json"));
const deployWorkflow = projectFile(".github/workflows/deploy.yml");
const axeWorkflow = projectFile(".github/workflows/axe.yml");

const formatTargets = [
  "tests/{projects-contract,reading-contract,site-contract,udes-contract,udes-v2-contract,udes-v2-engine,udes-v2-history,udes-v2-job-capacity,udes-v2-scenarios}.mjs",
  "assets/js/{udes-v2-app,udes-v2-worker}.js",
  "assets/data/cnc-machine-inspector/portfolio-evidence.json",
  "assets/data/udes-v2/README.md",
  "scripts/{build-project-previews,validate-udes-v2-full}.mjs",
  "_sass/garden/{_cards,_content,_simulation-v2}.scss",
  "_includes/{garden-card,garden-media,garden-project-card,garden-related,head}.liquid",
  "_layouts/page.liquid",
  "_pages/projects.md",
  "_projects/{abu-dhabi-urban-dynamics,abu-dhabi-urban-dynamics-v2,adsg-policy-simulations,cnc-machine-inspector}.md",
  "package.json",
  ".github/workflows/{axe,deploy}.yml",
];
const expectedFormatCommand = `prettier --check ${formatTargets.map((target) => JSON.stringify(target)).join(" ")}`;

function workflowEventBlock(workflow, eventName) {
  const match = workflow.match(new RegExp(`^  ${eventName}:\\s*\\r?\\n([\\s\\S]*?)(?=^  [A-Za-z_][\\w-]*:\\s*(?:\\r?\\n|$)|^\\S)`, "m"));
  assert.ok(match, `${eventName} event block is present`);
  return match[1];
}

function assertEventWatches(workflow, eventName, path, label) {
  const block = workflowEventBlock(workflow, eventName);
  const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.equal((block.match(new RegExp(`^\\s+- "${escapedPath}"$`, "gm")) || []).length, 1, label);
}

assertEventWatches(deployWorkflow, "push", "tests/**", "deploy push watches test changes");
assertEventWatches(deployWorkflow, "pull_request", "tests/**", "deploy pull requests watch test changes");
assertEventWatches(deployWorkflow, "push", "scripts/**", "deploy push watches validation scripts");
assertEventWatches(deployWorkflow, "pull_request", "scripts/**", "deploy pull requests watch validation scripts");
assertEventWatches(axeWorkflow, "pull_request", "tests/**", "axe pull requests watch contract changes");
assertEventWatches(axeWorkflow, "pull_request", "_bibliography/**", "axe pull requests watch bibliography changes");
assertEventWatches(axeWorkflow, "pull_request", ".github/scripts/run-axe.mjs", "axe pull requests watch their accessibility runner");
assert.match(axeWorkflow, /^  workflow_dispatch:\s*$/m, "axe retains manual dispatch without obsolete inputs");
assert.doesNotMatch(axeWorkflow, /^\s+inputs:\s*$/m, "axe manual dispatch has no unused input map");
assert.doesNotMatch(axeWorkflow, /^\s*URL:\s*/m, "axe has no unused global URL variable");
assert.match(
  deployWorkflow,
  /- name: Verify generated site\s+run: \|\s+test -f _site\/index\.html\s+node tests\/udes-v2-engine\.mjs\s+node tests\/udes-v2-job-capacity\.mjs\s+node tests\/udes-v2-scenarios\.mjs\s+node tests\/site-contract\.mjs/,
  "deploy verifies the simulation and generated site contracts"
);
assert.match(
  deployWorkflow,
  /npm ci\s+npm run validate:udes-v2-full\s+npm run build:project-previews/,
  "deploy regenerates full-scale model evidence before producing public previews"
);

const expectedAxePaths = [
  "",
  "projects/",
  "projects/metahub-ai-xr-lab/",
  "projects/cnc-machine-inspector/",
  "projects/abu-dhabi-urban-dynamics/",
  "projects/abu-dhabi-urban-dynamics-v2/",
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

for (const contract of focusedContracts) await import(contract);

console.log("all site contracts passed");
