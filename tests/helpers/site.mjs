import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = fileURLToPath(new URL("../../_site/", import.meta.url));

export function readRoute(route) {
  const trimmed = route.replace(/^\//, "").replace(/\/$/, "");
  const relative = route === "/" ? "index.html" : trimmed.endsWith(".html") ? trimmed : `${trimmed}/index.html`;
  const file = join(siteRoot, relative);
  assert.equal(existsSync(file), true, `Expected generated route ${route} at ${file}`);
  return readFileSync(file, "utf8");
}

export function assertContains(html, pattern, label) {
  assert.match(html, pattern, label);
}
