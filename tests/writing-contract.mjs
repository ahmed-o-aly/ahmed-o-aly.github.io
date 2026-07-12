import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const index = readRoute("/blog/");
const article = readRoute("/blog/2026/what-i-am-building-this-site-for/");
const postLayoutAnnouncement = readRoute("/news/announcement_1/");
const yearArchive = readRoute("/blog/2026/");
const tagArchive = readRoute("/blog/tag/optimization/");
const categoryArchive = readRoute("/blog/category/blog/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const blogTemplate = readFileSync(new URL("../_pages/blog.md", import.meta.url), "utf8");
const postTemplate = readFileSync(new URL("../_layouts/post.liquid", import.meta.url), "utf8");
const archiveTemplate = readFileSync(new URL("../_layouts/archive.liquid", import.meta.url), "utf8");
const postCardTemplate = readFileSync(new URL("../_includes/garden-post-card.liquid", import.meta.url), "utf8");
const gardenLayout = readFileSync(new URL("../_layouts/garden.liquid", import.meta.url), "utf8");
const headTemplate = readFileSync(new URL("../_includes/head.liquid", import.meta.url), "utf8");
const scriptsTemplate = readFileSync(new URL("../_includes/scripts.liquid", import.meta.url), "utf8");
const contentStyles = readFileSync(new URL("../_sass/garden/_content.scss", import.meta.url), "utf8");

assertContains(index, /class="[^"]*garden-writing-grid/, "writing index renders card grid");
assertContains(index, /What I Am Building This Site For/i, "writing index includes current post");
assertContains(index, /href="\/blog\/2026\/"/, "writing index retains year archive navigation");
assertContains(index, /href="\/blog\/tag\/optimization\/"/, "writing index retains tag archive navigation");
assertContains(article, /class="[^"]*garden-article/, "post uses article pattern");
assertContains(article, /<time\b[^>]*datetime=/, "post publishes a semantic date");
assert.equal((article.match(/<h1\b/g) || []).length, 1, "post has one h1");
assertContains(article, /href="\/blog\/tag\/optimization\/"/, "post exposes tag archives");
assertContains(article, /href="\/blog\/category\/blog\/"/, "post exposes category archives");
assertContains(article, /publishing-system/, "post exposes an unmatched thread key without inventing content");
assert.doesNotMatch(article, /<div class="garden-article__support">\s*<\/div>/, "post omits an empty optional-support wrapper");
assert.doesNotMatch(
  postLayoutAnnouncement,
  /<div class="garden-article__support">\s*<\/div>/,
  "shared post layout omits an empty optional-support wrapper"
);

for (const [html, label] of [
  [yearArchive, "year"],
  [tagArchive, "tag"],
  [categoryArchive, "category"],
]) {
  assertContains(html, /class="[^"]*garden-archive/, `${label} archive uses garden archive pattern`);
  assertContains(html, /<time\b[^>]*datetime=/, `${label} archive publishes semantic dates`);
  assertContains(html, /What I Am Building This Site For/i, `${label} archive links a current post`);
}

for (const [source, label] of [
  [index, "writing index"],
  [article, "article"],
  [yearArchive, "year archive"],
  [tagArchive, "tag archive"],
  [categoryArchive, "category archive"],
]) {
  assert.doesNotMatch(
    source,
    /\u00c2\u00b7|\u00e2\u2020\u2014|\u00e2\u20ac\u2122|\u00e2\u20ac\u00a2/,
    `${label} does not render encoding-corrupted text`
  );
}

assertContains(blogTemplate, /paginator\.posts\s*\|\s*default:\s*site\.posts/, "blog keeps paginator fallback");
assertContains(blogTemplate, /include pagination\.liquid/, "blog keeps pagination controls");
assertContains(postCardTemplate, /post\.thumbnail/, "post cards retain optional thumbnails");
assertContains(postCardTemplate, /post\.redirect/, "post cards retain redirect targets");
assertContains(postCardTemplate, /post\.external_source/, "post cards retain external-source metadata");
assertContains(archiveTemplate, /document\.redirect\s*==\s*blank/, "archives retain local post targets");
assertContains(archiveTemplate, /document\.redirect\s+contains\s+'?:\/\//, "archives retain external redirects");

const retainedPostHooks = [
  [/page\._styles/, "page-local styles"],
  [/page\.toc\s+and\s+page\.toc\.beginning/, "inline table of contents"],
  [/{%\s*toc\s*%}/, "TOC generator"],
  [/id=["']markdown-content["']/, "specialist markdown content hook"],
  [/page\.citation[\s\S]*include citation\.liquid/, "citation block"],
  [/page\.related_publications[\s\S]*bibliography/, "related-publication bibliography"],
  [/site\.related_blog_posts[\s\S]*page\.related_posts[\s\S]*include related_posts\.liquid/, "related posts"],
  [/site\.disqus_shortname\s+and\s+page\.disqus_comments[\s\S]*include disqus\.liquid/, "Disqus comments"],
  [/site\.giscus\s+and\s+page\.giscus_comments[\s\S]*include giscus\.liquid/, "Giscus comments"],
  [/page\.thread[\s\S]*site\.data\.work_threads/, "writing thread metadata"],
  [/for tag in page\.tags/, "tag metadata"],
  [/for category in page\.categories/, "category metadata"],
  [/page\.last_updated/, "last-updated metadata"],
  [/page\.author/, "author metadata"],
  [/page\.meta/, "custom post metadata"],
  [/page\.external_source/, "article external-source metadata"],
];
for (const [pattern, label] of retainedPostHooks) assertContains(postTemplate, pattern, `post retains ${label}`);

assertContains(postTemplate, /^layout:\s*default$/m, "posts retain the default layout chain");
assertContains(gardenLayout, /include scripts\.liquid/, "garden shell retains specialist script loading");
for (const hook of ["toc", "pseudocode", "map", "code_diff", "images", "tikzjax"]) {
  assertContains(headTemplate, new RegExp(`page\\.${hook}`), `head retains ${hook} support`);
}
for (const hook of ["mermaid", "chart", "toc", "pseudocode", "map", "code_diff", "images", "tikzjax", "typograms", "tabs"]) {
  assertContains(scriptsTemplate, new RegExp(`page\\.${hook}`), `scripts retain ${hook} support`);
}

const cssRules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, declarations]) => ({
  selector,
  declarations,
}));
function assertTouchTarget(selectorFragment, label) {
  const rule = cssRules.find(
    ({ selector, declarations }) =>
      selector.includes(selectorFragment) &&
      declarations.includes("display:inline-flex") &&
      declarations.includes("min-width:44px") &&
      declarations.includes("min-height:44px")
  );
  assert.ok(rule, `${label} exposes touch-friendly targets`);
}
assertTouchTarget(".garden-writing__archives a", "writing archive links");
assertTouchTarget(".garden-article__taxonomy a", "article taxonomy links");
assertTouchTarget(".garden-archive a", "archive post links");
assertTouchTarget(".garden-page .pagination .page-link", "pagination links");
assertContains(css, /\.garden-body :focus-visible\{[^}]*outline:/, "writing links inherit a visible keyboard focus state");
assert.doesNotMatch(contentStyles, /gradient|box-shadow/i, "writing surfaces remain matte and gradient-free");
assert.doesNotMatch(
  `${blogTemplate}\n${postTemplate}\n${archiveTemplate}\n${postCardTemplate}`,
  /\u00c2\u00b7/,
  "writing sources do not contain the mojibake separator"
);

console.log("writing contract passed");
