import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const focusedContracts = [
  "./folio-contract.mjs",
  "./goodreads-sync.mjs",
  "./legacy-contract.mjs",
  "./udes-contract.mjs",
  "./udes-v2-road-flow.mjs",
  "./udes-v2-analysis.mjs",
  "./udes-v2-history.mjs",
  "./udes-v2-contract.mjs",
];

const projectFile = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(projectFile("package.json"));
const deployWorkflow = projectFile(".github/workflows/deploy.yml");
const axeWorkflow = projectFile(".github/workflows/axe.yml");

const formatTargets = [
  "tests/{folio-contract,goodreads-sync,site-contract,udes-contract,udes-v2-contract,udes-v2-engine,udes-v2-history,udes-v2-job-capacity,udes-v2-scenarios,udes-v2-mechanics,udes-v2-network,udes-v2-turns,udes-v2-road-flow,udes-v2-analysis,udes-v2-comparison,udes-v2-evidence,udes-v2-presentation-provenance}.mjs",
  "assets/js/{garden,udes-v2-app,udes-v2-worker,udes-v2-road-flow,udes-v2-analysis}.js",
  "assets/css/garden.scss",
  "assets/data/cnc-machine-inspector/portfolio-evidence.json",
  "assets/data/udes-v2/README.md",
  "_data/{currently_reading,read_books}.yml",
  "scripts/{build-project-previews,sync-goodreads,validate-udes-v2-full,validate-udes-v2-uncertainty,udes-v2-experiment-statistics,udes-v2-evidence-summary,udes-v2-source-provenance,refresh-udes-v2-presentation-provenance}.mjs",
  "_sass/garden/{_cards,_content,_folio-v2,_shell,_simulation-v2,_tokens}.scss",
  "_includes/{folio-work-card,folio-work-feature,garden-card,garden-footer,garden-media,garden-nav,garden-project-card,garden-related,head,metadata}.liquid",
  "_layouts/{cv,garden,page,post}.liquid",
  "_pages/{about,blog,books,home,marginalia,projects}.md",
  "_projects/{abu-dhabi-urban-dynamics,abu-dhabi-urban-dynamics-v2,cnc-machine-inspector,dewa-energy-optimization,sila,territory-design-probvns}.md",
  "package.json",
  ".github/workflows/{axe,deploy}.yml",
  "scripts/lib/udes-v2-turn-restrictions.mjs",
  "scripts/data/udes-v2-transit-services.json",
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
  /- name: Verify generated site\s+run: \|\s+test -f _site\/index\.html\s+node tests\/udes-v2-engine\.mjs\s+node tests\/udes-v2-job-capacity\.mjs\s+node tests\/udes-v2-mechanics\.mjs\s+node tests\/udes-v2-network\.mjs\s+node tests\/udes-v2-turns\.mjs\s+node tests\/udes-v2-road-flow\.mjs\s+node tests\/udes-v2-analysis\.mjs\s+node tests\/udes-v2-comparison\.mjs\s+node tests\/udes-v2-history\.mjs\s+node tests\/udes-v2-evidence\.mjs\s+node tests\/udes-v2-presentation-provenance\.mjs\s+node scripts\/validate-udes-v2-full\.mjs --verify-concurrency\s+node tests\/udes-v2-contract\.mjs\s+node tests\/site-contract\.mjs/,
  "deploy verifies the simulation and generated site contracts"
);
assert.match(deployWorkflow, /- name: Install Node dependencies\s+run: npm ci/, "deploy installs the locked Node dependencies");
assert.match(
  deployWorkflow,
  /^  schedule:\s*\r?\n\s+- cron: "17 4 \* \* \*"$/m,
  "deploy refreshes the reading shelf daily at 08:17 Asia/Dubai (04:17 UTC)"
);
assert.doesNotMatch(deployWorkflow, /^\s+timezone:/m, "deploy uses GitHub Actions' UTC cron syntax");
assert.match(
  deployWorkflow,
  /- name: Sync Goodreads reading data\s+if: github\.event_name != 'pull_request'\s+run: npm run sync:reading/,
  "deploy syncs Goodreads for publishable builds without making pull requests depend on the live feed"
);
assert.ok(
  deployWorkflow.indexOf("run: npm run sync:reading") < deployWorkflow.indexOf("run: bundle exec jekyll build --trace"),
  "Goodreads data is refreshed before Jekyll builds the site"
);
assert.doesNotMatch(
  deployWorkflow,
  /npm run (?:validate:udes-v2-full|build:project-previews)/,
  "deploy uses committed validation evidence and previews instead of repeating long simulations"
);

const expectedAxePaths = [
  "",
  "projects/",
  "projects/cnc-machine-inspector/",
  "projects/abu-dhabi-urban-dynamics/",
  "projects/abu-dhabi-urban-dynamics-v2/",
  "projects/dewa-energy-optimization/",
  "projects/sila/",
  "projects/territory-design-probvns/",
  "blog/",
  "blog/2026/what-i-am-building-this-site-for/",
  "books/",
  "about/",
  "cv/",
  "marginalia/",
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
assert.equal(packageJson.scripts?.["sync:reading"], "node scripts/sync-goodreads.mjs", "sync:reading refreshes the Goodreads data source");
assert.equal(packageJson.scripts?.["test:goodreads"], "node tests/goodreads-sync.mjs", "test:goodreads runs the RSS fixture contract");
assert.equal(packageJson.scripts?.["test:site"], "node tests/site-contract.mjs", "test:site runs the aggregate contract");
assert.equal(
  packageJson.scripts?.["test:udes-v2-ui"],
  "node tests/udes-v2-road-flow.mjs && node tests/udes-v2-analysis.mjs && node tests/udes-v2-comparison.mjs && node tests/udes-v2-history.mjs",
  "the UI suite covers road motion, analysis charts, comparison exports and history"
);
assert.equal(
  packageJson.scripts?.["test:udes-v2-evidence"],
  "node tests/udes-v2-evidence.mjs && node tests/udes-v2-presentation-provenance.mjs && node scripts/validate-udes-v2-full.mjs --verify-concurrency",
  "the evidence suite checks statistics, presentation provenance and deterministic parallel validation"
);
assert.doesNotMatch(
  deployWorkflow,
  /node scripts\/refresh-udes-v2-presentation-provenance\.mjs/,
  "CI verifies committed evidence without rewriting presentation provenance"
);

for (const contract of focusedContracts) await import(contract);

if (process.exitCode) console.error("site contracts failed");
else console.log("all site contracts passed");
