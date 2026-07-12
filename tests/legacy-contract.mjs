import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { assertContains, readRoute } from "./helpers/site.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const legacyHooks =
  /portfolio-home(?:\.js)?|\bii-|portfolio-body|data-route(?:-[A-Za-z0-9_-]+)?|data-portfolio-app|data-menu(?:-[A-Za-z0-9_-]+)?|data-scramble|data-flicker/;

for (const directory of ["docs", "tests"]) {
  assert.equal(existsSync(join(projectRoot, "_site", directory)), false, `internal ${directory}/ sources are not published`);
}

function walkFiles(directory, extensions) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walkFiles(path, extensions);
    return extensions.has(entry.name.slice(entry.name.lastIndexOf("."))) ? [path] : [];
  });
}

for (const route of ["/", "/projects/", "/blog/", "/books/", "/about/", "/cv/"]) {
  const html = readRoute(route);
  assert.equal(legacyHooks.test(html), false, `${route} has no legacy shell output`);
}
assert.match(readRoute("/blog/2025/territory-design-bvns/"), /id=["']quick-start["']/, "the untouched article fragment names a generated heading");

const script = readFileSync(new URL("../assets/js/garden.js", import.meta.url), "utf8");
for (const hash of ["#/hello/", "#/about/", "#/projects/", "#/achievements/", "#/contact/"]) {
  assertContains(script, new RegExp(hash.replaceAll("/", "\\/")), `${hash} is mapped`);
}

const legacyRoutes = [
  ["#/hello/", "/"],
  ["#/hello", "/"],
  ["#/about/", "/about/"],
  ["#/about", "/about/"],
  ["#/projects/", "/projects/"],
  ["#/projects", "/projects/"],
  ["#/achievements/", "/about/#credentials"],
  ["#/achievements", "/about/#credentials"],
  ["#/contact/", "/#contact"],
  ["#/contact", "/#contact"],
];

function executeGarden(hash) {
  let redirect = null;
  const location = {
    hash,
    replace: (target) => {
      redirect = target;
    },
  };
  const window = {
    location,
    matchMedia: () => ({ matches: true }),
  };
  const document = { body: { dataset: { baseurl: "" } } };
  vm.runInNewContext(script, { document, window, Map });
  return { hash: location.hash, redirect };
}

assert.equal(legacyRoutes.length, 10, "the contract covers all ten exact legacy hashes");
assert.equal(new Set(legacyRoutes.map(([hash]) => hash)).size, 10, "legacy hash keys are unique");
for (const [hash, target] of legacyRoutes) {
  assert.deepEqual(executeGarden(hash), { hash, redirect: target }, `${hash} redirects exactly`);
}
for (const [hash, label] of [
  ["#credentials", "ordinary fragment"],
  ["#some-fragment", "unknown publications fragment"],
  ["#quick-start", "article heading fragment"],
  ["#/unknown/", "unknown legacy-shaped fragment"],
]) {
  assert.deepEqual(executeGarden(hash), { hash, redirect: null }, `${label} remains untouched`);
}

const sourceFiles = [
  ...walkFiles(join(projectRoot, "_pages"), new Set([".md"])),
  ...walkFiles(join(projectRoot, "_layouts"), new Set([".liquid"])),
  ...walkFiles(join(projectRoot, "_includes"), new Set([".liquid"])),
  join(projectRoot, "_sass", "_base.scss"),
];
const generatedFiles = walkFiles(join(projectRoot, "_site"), new Set([".html", ".css", ".js"]));
const violations = [];

for (const file of sourceFiles) {
  if (legacyHooks.test(readFileSync(file, "utf8"))) violations.push(relative(projectRoot, file));
}
for (const file of generatedFiles) {
  if (legacyHooks.test(readFileSync(file, "utf8"))) violations.push(relative(projectRoot, file));
}
if (existsSync(new URL("../assets/js/portfolio-home.js", import.meta.url))) {
  violations.push("assets/js/portfolio-home.js");
}

assert.deepEqual(violations, [], "legacy shell source and generated artifacts are removed");
console.log("legacy contract passed");
