import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, ".."),
  bundle = resolve(root, "assets/apps/bloch-lab"),
  app = resolve(root, "_site/bloch-lab");
const index = readFileSync(resolve(app, "index.html"), "utf8");
assert.match(index, /<title>Bloch Lab/);
assert.match(index, /type="module"[^>]+src="\.\/assets\//);
assert.match(index, /Skip to experiment controls/);
assert.deepEqual(readdirSync(app).sort(), ["assets", "index.html"]);
for (const file of ["index.html", ...readdirSync(resolve(bundle, "assets")).map((x) => "assets/" + x)]) {
  assert.deepEqual(readFileSync(resolve(app, file)), readFileSync(resolve(bundle, file)), file + " preserves built bytes");
}
assert.ok(!existsSync(resolve(app, "main.js")), "source is not exposed at the public app route");
assert.ok(!existsSync(resolve(root, "_site/assets/apps/bloch-lab")), "no duplicate public bundle");
const project = readFileSync(resolve(root, "_site/projects/bloch-lab/index.html"), "utf8");
assert.match(project, /href="\/bloch-lab\/"/, "project launches the app on the same origin");
assert.match(readFileSync(resolve(root, "_site/projects/index.html"), "utf8"), /href="\/projects\/bloch-lab\/"/);
console.log("Bloch Lab generated-site route and byte-preservation contract passed");
