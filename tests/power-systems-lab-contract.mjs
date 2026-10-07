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
  assert.doesNotMatch(file, /transformador|transformer|private/i, "no private mesh or derivative");
  if (/\.(js|json|html)$/.test(file))
    assert.doesNotMatch(
      readFileSync(resolve(app, file), "utf8"),
      /__private__|Patrick Kayter|source_file.*Users\/aly/,
      "private adapter and manifest are absent"
    );
}
const project = readFileSync(resolve(root, "_site/projects/power-systems-lab/index.html"), "utf8");
assert.match(project, /href="\/power-systems-lab\/"/);
assert.match(project, /One80 Solar/);
assert.match(project, /creativecommons.org\/licenses\/by\/4.0/);
assert.match(readFileSync(resolve(root, "_site/projects/index.html"), "utf8"), /href="\/projects\/power-systems-lab\/"/);
console.log("Power Systems Lab generated-site route, exact bundle, attribution and private-data exclusion passed");
