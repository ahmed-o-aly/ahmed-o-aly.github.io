import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { readRoute } from "./helpers/site.mjs";

const home = readRoute("/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const script = readFileSync(new URL("../assets/js/garden.js", import.meta.url), "utf8");
const cssRules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, declarations]) => ({
  selector,
  declarations,
}));

const legacyRoutes = [
  ["#/hello/", "/portfolio/"],
  ["#/hello", "/portfolio/"],
  ["#/about/", "/portfolio/about/"],
  ["#/about", "/portfolio/about/"],
  ["#/projects/", "/portfolio/projects/"],
  ["#/projects", "/portfolio/projects/"],
  ["#/achievements/", "/portfolio/about/#credentials"],
  ["#/achievements", "/portfolio/about/#credentials"],
  ["#/contact/", "/portfolio/#contact"],
  ["#/contact", "/portfolio/#contact"],
];

function redirectFor(hash) {
  let redirect = null;
  const window = {
    location: { hash, replace: (target) => (redirect = target) },
    matchMedia: () => ({ matches: true }),
  };
  const document = { body: { dataset: { baseurl: "/portfolio" } } };
  vm.runInNewContext(script, { document, window, Map });
  return redirect;
}

assert.equal(legacyRoutes.length, 10, "the contract covers all ten legacy hashes");
assert.equal(new Set(legacyRoutes.map(([hash]) => hash)).size, 10, "legacy hash keys are unique");
for (const [hash, target] of legacyRoutes) assert.equal(redirectFor(hash), target, `${hash} redirects exactly`);
for (const fragment of ["#credentials", "#section-two", "#/unknown/"]) {
  assert.equal(redirectFor(fragment), null, `${fragment} is not consumed by a fallback redirect`);
}

assert.doesNotMatch(home, /<html\b[^>]*garden-reveal-ready/, "server HTML does not opt into hidden reveal styles");
assert.match(script, /classList\.add\(["']garden-reveal-ready["']\)/, "JavaScript explicitly enables reveal readiness");
const hiddenRevealRules = cssRules.filter(
  ({ selector, declarations }) => selector.includes("[data-reveal]") && /(?:^|;)opacity:0(?:;|$)/.test(declarations)
);
assert.ok(hiddenRevealRules.length > 0, "compiled CSS contains an enhanced hidden reveal state");
for (const { selector } of hiddenRevealRules) {
  assert.match(selector, /\.garden-reveal-ready\s+\[data-reveal\]/, "hidden reveal styles require the readiness class");
}

const sharedSurfaceRule = cssRules.find(
  ({ selector, declarations }) =>
    selector.includes(".garden-card:hover") &&
    selector.includes(".garden-card:focus-within") &&
    declarations.includes("background:var(--garden-surface-hover)")
);
assert.ok(sharedSurfaceRule, "garden cards share the approved hover surface on keyboard focus");
assert.match(
  css,
  /\.garden-body :focus-visible\{(?=[^}]*outline:2px solid var\(--garden-focus\))[^}]*\}/,
  "the global focus-visible outline remains present"
);

console.log("garden enhancement contract passed");
