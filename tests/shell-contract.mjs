import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const html = readRoute("/projects/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const footerTemplate = readFileSync(new URL("../_includes/garden-footer.liquid", import.meta.url), "utf8");
assertContains(html, /class="[^"]*garden-body/, "projects uses the garden body");
assertContains(html, /class="[^"]*garden-nav/, "projects renders the shared navigation");
assertContains(html, /href="\/projects\/"[^>]*aria-current="page"/, "projects nav item is current");
assertContains(html, /id="main-content"/, "shell exposes the skip-link target");
assertContains(html, /class="[^"]*garden-footer/, "shell renders the shared footer");
assert.doesNotMatch(html, /data-portfolio-app/, "subpage shell no longer exposes the old app hook");
assertContains(
  css,
  /\.garden-nav__segments a,[^{]*\.garden-nav__name,[^{]*\.garden-nav__utility a\{(?=[^}]*min-height:44px)(?=[^}]*min-width:44px)(?=[^}]*display:inline-flex)(?=[^}]*align-items:center)[^}]*\}/,
  "primary and utility navigation links expose touch-friendly targets"
);
assertContains(
  css,
  /\.garden-footer nav a\{(?=[^}]*min-height:44px)(?=[^}]*min-width:44px)(?=[^}]*display:inline-flex)(?=[^}]*align-items:center)[^}]*\}/,
  "footer links expose touch-friendly targets"
);
assertContains(footerTemplate, /Ahmed Aly &middot; decision systems/, "footer separator is encoding stable at the source");
assertContains(html, /Ahmed Aly (?:&middot;|\u00b7) decision systems/, "footer renders the intended separator");
assert.doesNotMatch(html, /\u00c2\u00b7/, "footer does not render a mojibake separator");
console.log("shell contract passed");
