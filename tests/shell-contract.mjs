import assert from "node:assert/strict";
import { assertContains, readRoute } from "./helpers/site.mjs";

const html = readRoute("/projects/");
assertContains(html, /class="[^"]*garden-body/, "projects uses the garden body");
assertContains(html, /class="[^"]*garden-nav/, "projects renders the shared navigation");
assertContains(html, /href="\/projects\/"[^>]*aria-current="page"/, "projects nav item is current");
assertContains(html, /id="main-content"/, "shell exposes the skip-link target");
assertContains(html, /class="[^"]*garden-footer/, "shell renders the shared footer");
assert.doesNotMatch(html, /data-portfolio-app/, "subpage shell no longer exposes the old app hook");
console.log("shell contract passed");
