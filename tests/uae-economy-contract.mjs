import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const site = resolve(root, "_site");
const app = resolve(site, "uae-economy-lab");
const bundle = resolve(root, "assets/apps/uae-economy-lab");
const index = readFileSync(resolve(app, "index.html"), "utf8");
assert.match(index, /<title>UAE Economy Lab<\/title>/);
assert.match(index, /type="module"[^>]+src="\/uae-economy-lab\/assets\//);
assert.doesNotMatch(index, /["']\/(?:assets|src)\//, "the entry point must use the published subpath");

const assets = readdirSync(resolve(app, "assets"));
assert.ok(
  assets.some((file) => /^model\.worker-.+\.js$/.test(file)),
  "the equilibrium worker is deployed"
);
assert.ok(
  assets.some((file) => /^ExplainView-.+\.js$/.test(file)),
  "the lazy explanation view is deployed"
);
assert.ok(
  assets.some((file) => /\.woff2$/.test(file)),
  "fonts are hosted with the app"
);

for (const file of ["index.html", ...assets.filter((file) => /\.(?:js|css)$/.test(file)).map((file) => `assets/${file}`)]) {
  const source = readFileSync(resolve(app, file), "utf8");
  const refs = [...source.matchAll(/\/uae-economy-lab\/assets\/[^\s"'`()<>]+/g)].map(([ref]) => ref);
  for (const ref of refs) assert.ok(existsSync(resolve(site, ref.slice(1))), `${file} references a deployed asset: ${ref}`);
  assert.doesNotMatch(source, /(?:https?:\/\/)?(?:localhost|127\.0\.0\.1):\d{4}|\/Users\/aly\//, `${file} has no local-only URLs`);
}

assert.ok(!existsSync(resolve(site, "apps")), "app source and source workbooks are excluded from the website");
assert.ok(!existsSync(resolve(site, "assets/apps/uae-economy-lab")), "the bundle is only published at its canonical path");
assert.deepEqual(readdirSync(app).sort(), ["assets", "index.html"], "only the production bundle is published");
for (const file of ["index.html", ...assets.map((file) => `assets/${file}`)]) {
  assert.deepEqual(readFileSync(resolve(app, file)), readFileSync(resolve(bundle, file)), `${file} preserves its compiled bytes`);
}
console.log("UAE Economy Lab publication contract passed");
