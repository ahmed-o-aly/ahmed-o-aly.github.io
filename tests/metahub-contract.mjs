import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { readRoute } from "./helpers/site.mjs";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const ids = ["machine-lab", "protein-structures", "circuits-lab", "bloch-lab", "power-systems-lab"];
const projects = ["cnc-machine-inspector", ...ids.slice(1)];
const catalogue = readRoute("/projects/metahub/");
assert.equal((catalogue.match(/data-metahub-card/g) || []).length, 5);
assert.equal((catalogue.match(/<h1\b/g) || []).length, 1);
assert.doesNotMatch(catalogue, /<iframe\b|<canvas\b|three(?:\.min)?\.js|modulepreload/, "browsing does not start a viewer");
assert.match(catalogue, /role="search"/);
assert.match(catalogue, /<dialog[^>]*aria-labelledby="metahub-dialog-title"/);
const works = readRoute("/projects/");
for (const [index, id] of ids.entries()) {
  const cover = catalogue.match(new RegExp(`<a\\b[^>]*data-metahub-open="${id}"[^>]*>`))?.[0];
  assert.ok(cover, `${id} has a catalogue link`);
  assert.doesNotMatch(cover, /aria-label=/, "card links derive accessible names from their visible contents");
  const html = readRoute(`/projects/${projects[index]}/`);
  assert.match(html, /Back to MetaHub/);
  const frame = html.match(/<iframe\b[^>]*>/)?.[0];
  assert.ok(frame);
  assert.doesNotMatch(frame, /\ssrc=/, "legacy write-ups do not auto-start heavy viewers");
  assert.match(frame, /data-metahub-src=/);
  assert.match(frame, /\bhidden\b/);
  assert.doesNotMatch(works, new RegExp(`href="/projects/${projects[index]}/"`));
  const preview = catalogue.match(new RegExp(`data-metahub-detail="${id}"[\\s\\S]*?src="([^"]+)"`))[1];
  assert.ok(existsSync(new URL(`../_site${preview}`, import.meta.url)), `${id} has a published cover`);
}
// A page's entry script may share the shell with sibling pages through a chunk
// it imports statically, so the check follows those imports.
function bundleWithImports(dir, entry) {
  const seen = new Set();
  const visit = (file) => {
    if (seen.has(file)) return "";
    seen.add(file);
    const source = read(`${dir}/${file}`);
    const base = file.includes("/") ? file.slice(0, file.lastIndexOf("/") + 1) : "";
    const imports = [...source.matchAll(/(?:^|[;}\s])import\s*(?:[^"';]*?from\s*)?"(\.\/[^"]+\.js)"/g)].map((m) => base + m[1].slice(2));
    return source + imports.map(visit).join("");
  };
  return visit(entry);
}
for (const page of ["protein-structures", "circuits-lab", "circuits-lab/lab7", "circuits-lab/lab7-bench", "bloch-lab", "power-systems-lab"]) {
  const html = readRoute(`/${page}/`);
  const script = html.match(/<script\b[^>]*src="([^\"]+)"/)?.[1];
  assert.ok(script, `${page} loads a script`);
  const path = new URL(script, `https://site.test/${page}/`).pathname.slice(1);
  const dir = `_site/${path.slice(0, path.lastIndexOf("/"))}`;
  assert.match(bundleWithImports(dir, path.slice(path.lastIndexOf("/") + 1)), /metahub-app-bar/, `${page} uses the MetaHub shell`);
}
// Test the shared visibility boundary without mocking scientific models or XR input.
const { visibleFrame } = await import(`data:text/javascript;base64,${Buffer.from(read("assets/js/metahub-app-shell.js")).toString("base64")}`);
const renderer = { xr: { isPresenting: false } };
const visibility = { hidden: true };
const calls = [];
const frame = visibleFrame(renderer, (...args) => calls.push(args), visibility);
frame(1, "desktop");
assert.equal(calls.length, 0, "hidden desktop tabs skip frame work");
renderer.xr.isPresenting = true;
frame(2, "xr-frame");
assert.deepEqual(calls.pop(), [2, "xr-frame"], "immersive frame protocol is preserved");
renderer.xr.isPresenting = false;
visibility.hidden = false;
frame(3);
assert.deepEqual(calls.pop(), [3], "desktop work resumes when visible");
console.log("MetaHub catalogue, grouping, deferred viewers and shared runtime passed");
