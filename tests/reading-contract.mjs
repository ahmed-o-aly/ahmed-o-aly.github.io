import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { assertContains, readRoute } from "./helpers/site.mjs";

const index = readRoute("/books/");
const review = readRoute("/books/the_godfather/");
const css = readFileSync(new URL("../_site/assets/css/garden.css", import.meta.url), "utf8");
const readBooksSource = readFileSync(new URL("../_data/read_books.yml", import.meta.url), "utf8");
const booksTemplate = readFileSync(new URL("../_pages/books.md", import.meta.url), "utf8");
const cardTemplate = readFileSync(new URL("../_includes/garden-book-card.liquid", import.meta.url), "utf8");
const baseCardTemplate = readFileSync(new URL("../_includes/garden-card.liquid", import.meta.url), "utf8");
const mediaTemplate = readFileSync(new URL("../_includes/garden-media.liquid", import.meta.url), "utf8");
const reviewTemplate = readFileSync(new URL("../_layouts/book-review.liquid", import.meta.url), "utf8");
const cardStyles = readFileSync(new URL("../_sass/garden/_cards.scss", import.meta.url), "utf8");
const contentStyles = readFileSync(new URL("../_sass/garden/_content.scss", import.meta.url), "utf8");
const bookSource = readFileSync(new URL("../_books/the_godfather.md", import.meta.url), "utf8");
const yearArchivePath = new URL("../_site/books/2024/index.html", import.meta.url);

function sourcePosition(source, fragment, label) {
  const position = source.indexOf(fragment);
  assert.notEqual(position, -1, `${label} is present in the source`);
  return position;
}

function assertFallbackOrder(source, subject, coverVariable, renderFragment, label) {
  const local = sourcePosition(source, `assign ${coverVariable} = ${subject}.cover`, `${label} local-cover branch`);
  const olid = sourcePosition(source, `${subject}.olid`, `${label} OLID branch`);
  const olidUrl = sourcePosition(source, "https://covers.openlibrary.org/b/olid/", `${label} uses HTTPS for OLID covers`);
  const isbn = sourcePosition(source, `${subject}.isbn`, `${label} ISBN branch`);
  const isbnUrl = sourcePosition(source, "https://covers.openlibrary.org/b/isbn/", `${label} uses HTTPS for ISBN covers`);
  const render = sourcePosition(source, renderFragment, `${label} passes the selected cover to garden media`);

  assert.deepEqual(
    [...[local, olid, olidUrl, isbn, isbnUrl, render]].sort((a, b) => a - b),
    [local, olid, olidUrl, isbn, isbnUrl, render],
    `${label} resolves local cover, HTTPS OLID, HTTPS ISBN, then media fallback in order`
  );
}

const yamlEntries = readBooksSource.split(/\r?\n(?=- title:)/).filter((entry) => /^- title:/m.test(entry));
const fallbackEntryCount = yamlEntries.filter((entry) => !/^\s+(?:cover|olid|isbn):\s*\S+/m.test(entry)).length;

assertContains(index, /class="[^"]*garden-reading-threads/, "reading threads are visible");
assertContains(index, /class="[^"]*garden-book-grid/, "reading index renders book cards");
assertContains(index, /Institutions, incentives, and power/, "reading index keeps authored thread content");
assertContains(index, />\s*3\/5\s*</, "YAML rating remains visible on its card");
assertContains(index, /Read Oct 1, 2025/, "YAML read date remains visible on its card");
assertContains(index, /A compact story about ambition meeting contingency/, "YAML review note remains visible on its card");
assert.equal((index.match(/<h1\b/g) || []).length, 1, "reading index has one h1");

assertContains(
  baseCardTemplate,
  /assign card_heading_tag = include\.heading_tag \| default: 'h2'/,
  "shared cards default their internal title to h2"
);
assertContains(
  baseCardTemplate,
  /unless card_heading_tag == 'h3'[\s\S]*assign card_heading_tag = 'h2'[\s\S]*endunless/,
  "shared cards allow only the internal h3 override"
);
assertContains(cardTemplate, /heading_tag=include\.heading_tag/, "book cards forward the internal heading level");
assert.equal((booksTemplate.match(/heading_tag='h3'/g) || []).length, 2, "both Reading shelves request h3 card titles");
const readingShelves = [...index.matchAll(/<section class="garden-reading-shelf"[\s\S]*?<\/section>/g)].map(([section]) => section);
assert.equal(readingShelves.length, 2, "reading index renders both semantic shelves");
for (const shelf of readingShelves) {
  const headingLevels = [...shelf.matchAll(/<h([1-6])\b/g)].map(([, level]) => Number(level));
  assert.equal(headingLevels[0], 2, "each Reading shelf starts with its h2 label");
  assert.ok(headingLevels.length > 1, "each Reading shelf contains card headings");
  assert.ok(
    headingLevels.slice(1).every((level) => level === 3),
    "Reading card titles descend from shelf h2 to h3"
  );
  assertContains(shelf, /<h3 class="garden-card__title">/, "Reading cards expose the stable title class on h3");
}

const renderedBookCards = index.match(/class="[^"]*garden-card--book/g) || [];
assert.equal(renderedBookCards.length, yamlEntries.length + 1, "all real YAML and collection book records remain visible");
assert.equal((index.match(/href="\/books\/the_godfather\/"/g) || []).length, 1, "the collection review appears once on the shelf");
assert.equal((index.match(/garden-media--fallback/g) || []).length, fallbackEntryCount, "each coverless YAML record gets one typographic fallback");

assertFallbackOrder(cardTemplate, "book", "cover", "media=cover", "book card");
assertFallbackOrder(reviewTemplate, "page", "review_cover", "src=review_cover", "book review");
assert.doesNotMatch(`${cardTemplate}\n${reviewTemplate}`, /http:\/\/covers\.openlibrary\.org/, "cover fallbacks never use HTTP");
assertContains(booksTemplate, /collection_book_keys/, "reading shelf guards against collection/YAML duplicates");
assertContains(booksTemplate, /canonical_book_key/, "reading index compares canonical book keys");

assertContains(review, /class="[^"]*garden-book-review/, "review uses the book pattern");
assertContains(review, /the_godfather\.jpg/, "local cover remains natural color");
assert.doesNotMatch(review, /covers\.openlibrary\.org/, "local review cover wins over its OLID and ISBN fallbacks");
assertContains(review, /alt="The Godfather book cover"/, "cover media has informative alternative text");
assertContains(review, /class="[^"]*garden-media--contain/, "review cover uses contain sizing inside its matte well");
assertContains(
  review,
  /class="garden-book-review__cover"[\s\S]*?<img\b(?=[^>]*loading="eager")(?=[^>]*fetchpriority="high")[^>]*>/,
  "above-the-fold review cover requests eager high-priority loading"
);
const readingCardImages = [...index.matchAll(/<article class="[^"]*\bgarden-card\b[^"]*"[\s\S]*?<img\b[^>]*>/g)].map(([card]) => card);
assert.ok(readingCardImages.length > 0, "reading shelves render card images");
for (const card of readingCardImages) {
  assert.match(card, /<img\b(?=[^>]*loading="lazy")(?=[^>]*fetchpriority="auto")[^>]*>/, "card media retains lazy automatic-priority loading");
}
assert.equal((review.match(/<h1\b/g) || []).length, 1, "book review has one h1");
assertContains(review, /<article class="garden-book-review"/, "review is a semantic article");
assertContains(review, /<header class="garden-book-review__header"/, "review has a semantic header");
assertContains(review, /<time datetime="2024-08-23"/, "review publishes a semantic started date");
assertContains(review, /<time datetime="2024-09-07"/, "review publishes a semantic finished date");
assert.equal(existsSync(yearArchivePath), true, "the authored finished year generates its linked book archive");
const yearArchive = readFileSync(yearArchivePath, "utf8");
assertContains(yearArchive, /href="\/books\/the_godfather\/"/, "the linked 2024 archive contains the finished review");
assertContains(bookSource, /^date:\s*2024-09-07$/m, "book archive date derives from the authored finished date");

for (const [pattern, label] of [
  [/Mario Puzo/, "author"],
  [/Finished/, "status"],
  [/1969/, "release year"],
  [/>\s*5\/5\s*</, "star rating"],
  [/href="https:\/\/www\.goodreads\.com\/review\/show\/6318556633"/, "Goodreads review link"],
  [/href="https:\/\/www\.amazon\.com\/Godfather-Deluxe-Mario-Puzo\/dp\/0593542592"/, "purchase link"],
  [/href="\/books\/2024\/"/, "book year archive link"],
  [/href="\/books\/tag\/systems\/"/, "book tag archive link"],
  [/href="\/books\/category\/fiction\/"/, "book category archive link"],
]) {
  assertContains(review, pattern, `review retains ${label}`);
}

for (const field of [
  "cover",
  "olid",
  "isbn",
  "author",
  "categories",
  "tags",
  "buy_link",
  "started",
  "finished",
  "released",
  "stars",
  "goodreads_review",
  "status",
]) {
  assertContains(reviewTemplate, new RegExp(`page\\.${field}`), `review template retains ${field} metadata`);
}
assertContains(reviewTemplate, /page\._styles/, "review retains page-local style support");
assertContains(reviewTemplate, /page\.giscus_comments[\s\S]*include giscus\.liquid/, "review retains Giscus support");
assertContains(
  reviewTemplate,
  /include garden-media\.liquid[\s\S]*?loading='eager'[\s\S]*?fetchpriority='high'/,
  "book-review hero explicitly requests eager high-priority media"
);
assertContains(mediaTemplate, /assign media_loading = include\.loading \| default: 'lazy'/, "shared media defaults to lazy loading");
assertContains(
  mediaTemplate,
  /unless media_loading == 'eager'[\s\S]*assign media_loading = 'lazy'/,
  "shared media only accepts the eager loading override"
);
assertContains(
  mediaTemplate,
  /assign media_fetchpriority = include\.fetchpriority \| default: 'auto'/,
  "shared media defaults to automatic fetch priority"
);
assertContains(
  mediaTemplate,
  /unless media_fetchpriority == 'high' or media_fetchpriority == 'low'[\s\S]*assign media_fetchpriority = 'auto'/,
  "shared media accepts only safe fetch-priority overrides"
);
assertContains(
  mediaTemplate,
  /unless media_url contains ':\/\/'[\s\S]*?if site\.imagemagick\.enabled[\s\S]*?<source/,
  "shared media never generates local WebP candidates for external raster URLs"
);
assertContains(
  mediaTemplate,
  /if include\.width and include\.height[\s\S]*?width="\{\{ include\.width \}\}"[\s\S]*?height="\{\{ include\.height \}\}"/,
  "shared media emits intrinsic dimensions only when both are supplied"
);
assert.doesNotMatch(
  mediaTemplate,
  /include\.width \| default: 1280|include\.height \| default: 720/,
  "shared media never fabricates 16:9 dimensions"
);
const reviewCoverImage = review.match(/class="garden-book-review__cover"[\s\S]*?(<img\b[^>]*>)/)?.[1] || "";
assert.doesNotMatch(reviewCoverImage, /\bwidth="1280"|\bheight="720"/, "portrait review cover has no fabricated 16:9 dimensions");

assertContains(
  css,
  /@media\s*\(min-width:\s*768px\)\{\s*\.garden-book-review__header\{[^}]*grid-template-columns:/,
  "review header becomes two columns from 768px"
);
const readingStyles = contentStyles.slice(sourcePosition(contentStyles, ".garden-reading-threads", "reading styles"));
assert.doesNotMatch(
  `${cardStyles}\n${readingStyles}`,
  /gradient|box-shadow:(?!\s*none\b)|backdrop-filter|filter\s*:|mix-blend-mode|saturate\s*\(/i,
  "book wells keep natural cover color on matte surfaces without optical effects"
);
assertContains(cardStyles, /\.garden-media--contain img\s*\{[\s\S]*?object-fit:\s*contain/, "cover art uses contain sizing");
assertContains(
  cardStyles,
  /\.garden-media img\s*\{[\s\S]*?min-width:\s*0;[\s\S]*?min-height:\s*0;/,
  "cover image boxes can shrink inside their matte wells"
);
assertContains(css, /\.garden-media img\{[^}]*min-width:0;[^}]*min-height:0;/, "compiled cover image boxes remain contained by their matte wells");

for (const [source, label] of [
  [index, "reading index"],
  [review, "book review"],
  [booksTemplate, "reading source"],
  [cardTemplate, "book-card source"],
  [reviewTemplate, "review source"],
]) {
  assert.doesNotMatch(
    source,
    /\u00c2\u00b7|\u00e2\u2020\u2014|\u00e2\u20ac\u2122|\u00e2\u20ac\u00a2/,
    `${label} does not contain encoding-corrupted text`
  );
}

console.log("reading contract passed");
