import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const html = readRoute("/projects/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const mainCss = readFileSync(new URL("../_site/assets/css/main.css", import.meta.url), "utf8");
const baseStyles = readFileSync(new URL("../_sass/_base.scss", import.meta.url), "utf8");
const shellStyles = readFileSync(new URL("../_sass/garden/_shell.scss", import.meta.url), "utf8");
const footerTemplate = readFileSync(new URL("../_includes/garden-footer.liquid", import.meta.url), "utf8");
assertContains(html, /class="[^"]*garden-body/, "projects uses the garden body");
assertContains(html, /class="[^"]*garden-nav/, "projects renders the shared navigation");
assertContains(html, /href="\/projects\/"[^>]*aria-current="page"/, "projects nav item is current");
assertContains(html, /id="main-content"/, "shell exposes the skip-link target");
assertContains(html, /class="[^"]*garden-footer/, "shell renders the shared footer");
assert.doesNotMatch(html, /data-portfolio-app/, "subpage shell no longer exposes the old app hook");
assert.doesNotMatch(baseStyles, /Small-press portfolio redesign/, "obsolete portfolio stylesheet marker is removed");
assert.doesNotMatch(baseStyles, /body::before\s*\{[\s\S]*?linear-gradient/, "legacy base styles no longer paint the body texture");
assert.doesNotMatch(
  baseStyles,
  /\.garden-intro\s*\{[\s\S]*?(?:max-width:\s*37rem|overflow:\s*hidden)/,
  "legacy base styles no longer cap or clip garden intros"
);
assert.doesNotMatch(
  baseStyles,
  /\.garden-section h2::(?:before|after)[\s\S]*?content:\s*"x"/,
  "legacy base styles no longer inject decorative heading content"
);
assert.doesNotMatch(baseStyles, /\.garden-[\w-]+/, "legacy base styles no longer target garden components");
assert.doesNotMatch(mainCss, /body:before\{[^}]*linear-gradient/, "compiled legacy CSS no longer paints the body texture");
assert.doesNotMatch(mainCss, /\.garden-intro\{[^}]*(?:max-width:37rem|overflow:hidden)/, "compiled legacy CSS no longer caps or clips garden intros");
assert.doesNotMatch(
  mainCss,
  /\.garden-section h2:(?:before|after)\{[^}]*content:"x"/,
  "compiled legacy CSS no longer injects decorative heading content"
);
assert.doesNotMatch(mainCss, /\.garden-[\w-]+/, "compiled legacy CSS no longer targets garden components");
assertContains(shellStyles, /\.garden-body\s*\{[^}]*padding:\s*0;/, "garden shell resets inherited body spacing");
assertContains(css, /\.garden-body\{(?=[^}]*padding:0)[^}]*\}/, "compiled garden shell resets inherited body spacing");
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
