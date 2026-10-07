import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, ".."),
  bundle = resolve(root, "assets/apps/power-systems-lab"),
  app = resolve(root, "_site/power-systems-lab");
function walk(dir, prefix = "") {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(resolve(dir, e.name), prefix + e.name + "/") : [prefix + e.name]))
    .sort();
}
assert.deepEqual(walk(app), walk(bundle), "public route contains precisely the committed app bundle");
for (const file of walk(bundle))
  assert.deepEqual(readFileSync(resolve(app, file)), readFileSync(resolve(bundle, file)), file + " retains exact bytes");
const index = readFileSync(resolve(app, "index.html"), "utf8");
assert.match(index, /<title>Power Systems Lab/);
assert.match(index, /src="\.\/assets\//);
assert.match(index, /Skip to equipment controls/);
assert.ok(!existsSync(resolve(root, "_site/assets/apps/power-systems-lab")), "no duplicate public bundle");
assert.ok(!existsSync(resolve(root, "_site/power-systems-lab/src")), "app source is excluded");
const provenance = JSON.parse(readFileSync(resolve(app, "data/substation/provenance.json"), "utf8"));
assert.equal(provenance.creator, "One80 Solar");
assert.equal(provenance.triangles, 665472);
assert.match(provenance.license, /CC BY 4.0/);
for (const file of walk(app)) {
  assert.doesNotMatch(file, /private|\.stp$|\.step$|\.pdf$/i, "original CAD, drawings and private files remain excluded");
  if (/\.(js|json|html)$/.test(file))
    assert.doesNotMatch(
      readFileSync(resolve(app, file), "utf8"),
      /__private__|\/Users\/aly|source_file|Private local inspection only/,
      "local file paths and private metadata are absent"
    );
}
const transformer = JSON.parse(readFileSync(resolve(app, "data/transformer/provenance.json"), "utf8"));
assert.equal(transformer.creator, "Patrick Kayter");
assert.equal(transformer.leaf_occurrences, 248);
assert.equal(transformer.placed_triangles, 838253);
assert.match(transformer.permission, /creator permission confirmed/);
assert.ok(existsSync(resolve(app, "data/transformer/transformer.glb")));
const project = readFileSync(resolve(root, "_site/projects/power-systems-lab/index.html"), "utf8");
assert.match(project, /href="\/power-systems-lab\/"/);
assert.match(project, /One80 Solar/);
assert.match(project, /creativecommons.org\/licenses\/by\/4.0/);
assert.match(project, /Patrick Kayter/);
assert.match(project, /href="\/power-systems-lab\/\?model=transformer"/);
assert.match(readFileSync(resolve(root, "_site/projects/index.html"), "utf8"), /href="\/projects\/power-systems-lab\/"/);
console.log("Power Systems Lab generated-site route, exact bundle, attribution and private-data exclusion passed");
