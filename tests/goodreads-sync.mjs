import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  mergeGoodreadsProgress,
  parseGoodreadsFeed,
  parseGoodreadsProgressPage,
  serializeBooksYaml,
  statusForShelf,
  syncGoodreads,
  syncReadingShelves,
} from "../scripts/sync-goodreads.mjs";

const readFixture = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Aly's bookshelf: read</title>
    <item>
      <guid><![CDATA[https://www.goodreads.com/review/show/123?utm_medium=api&utm_source=rss]]></guid>
      <title><![CDATA[The &amp; Book]]></title>
      <link><![CDATA[https://www.goodreads.com/review/show/123?utm_medium=api&utm_source=rss]]></link>
      <book_id>7001</book_id>
      <book_large_image_url><![CDATA[https://images.example.test/the-book.jpg]]></book_large_image_url>
      <author_name><![CDATA[First Author]]></author_name>
      <user_rating>4</user_rating>
      <user_read_at><![CDATA[Wed, 01 Oct 2025 00:00:00 -0700]]></user_read_at>
      <user_review><![CDATA[First line &amp; more.<br /><br />Second &#39;line&#39; &nbsp; done.]]></user_review>
      <user_shelves>read</user_shelves>
    </item>
    <item>
      <guid><![CDATA[https://www.goodreads.com/review/show/456]]></guid>
      <title><![CDATA[An Unrated Book]]></title>
      <link><![CDATA[https://www.goodreads.com/review/show/456]]></link>
      <book_id>7002</book_id>
      <book_large_image_url><![CDATA[https://images.example.test/unrated-book.jpg]]></book_large_image_url>
      <author_name><![CDATA[Second Author]]></author_name>
      <user_rating>0</user_rating>
      <user_read_at></user_read_at>
      <user_review><![CDATA[]]></user_review>
      <user_shelves>read</user_shelves>
    </item>
  </channel>
</rss>`;

const currentlyReadingFixture = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Aly's bookshelf: currently-reading</title>
    <item>
      <guid><![CDATA[https://www.goodreads.com/review/show/8875527581?utm_medium=api&utm_source=rss]]></guid>
      <title><![CDATA[The Blade Itself (The First Law, #1)]]></title>
      <link><![CDATA[https://www.goodreads.com/review/show/8875527581?utm_medium=api&utm_source=rss]]></link>
      <book_id>944073</book_id>
      <book_large_image_url><![CDATA[https://images.example.test/the-blade-itself.jpg]]></book_large_image_url>
      <author_name><![CDATA[Joe Abercrombie]]></author_name>
      <user_rating>0</user_rating>
      <user_read_at></user_read_at>
      <user_review><![CDATA[]]></user_review>
      <user_shelves>currently-reading</user_shelves>
    </item>
  </channel>
</rss>`;

const emptyReadFixture = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Aly's bookshelf: read</title></channel></rss>`;
const emptyCurrentlyReadingFixture = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Aly's bookshelf: currently-reading</title></channel></rss>`;

const progressPageFixture = `<!doctype html>
<html>
  <body>
    <div class="userStatus" id="user_status_1321122832">
      <p>
        Aly is on page 75 of 515 of
        <a href="/book/show/944073.The_Blade_Itself">The Blade Itself</a>
      </p>
      <a href="https://www.goodreads.com/user_status/show/1321122832">Aug 19, 2026</a>
    </div>
    <div class="userStatus" id="user_status_907785241">
      <p>
        Aly is 20% done with
        <a href="/book/show/7144.Crime_and_Punishment">Crime and Punishment</a>
      </p>
    </div>
  </body>
</html>`;

const emptyProgressPageFixture = `<!doctype html><html><body><p>No more updates.</p></body></html>`;

function xmlResponse(xml, contentType = "application/rss+xml; charset=utf-8") {
  return new Response(xml, { headers: { "content-type": contentType }, status: 200 });
}

function htmlResponse(html) {
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" }, status: 200 });
}

const books = parseGoodreadsFeed(readFixture);
const currentlyReadingBooks = parseGoodreadsFeed(currentlyReadingFixture, { expectedShelf: "currently-reading" });

assert.equal(books.length, 2, "every RSS item becomes a book record");
assert.equal(parseGoodreadsFeed(readFixture, { expectedShelf: "read" }).length, 2, "the expected shelf identity is accepted");
assert.throws(
  () => parseGoodreadsFeed(readFixture, { expectedShelf: "currently-reading" }),
  /unexpected shelf/,
  "a response for the wrong shelf cannot replace the reading data"
);
assert.throws(
  () => parseGoodreadsFeed("<html><body>Temporary error</body></html>"),
  /not a valid RSS feed/,
  "an HTML error page cannot be mistaken for an empty shelf"
);
assert.equal(statusForShelf("read"), "Read");
assert.equal(statusForShelf("currently-reading"), "Currently reading");
assert.deepEqual(
  books[0],
  {
    source: "goodreads",
    source_id: "7001",
    title: "The & Book",
    author: "First Author",
    cover: "https://images.example.test/the-book.jpg",
    rating: 4,
    read_at: "2025-10-01",
    status: "Read",
    url: "https://www.goodreads.com/book/show/7001",
    review_url: "https://www.goodreads.com/review/show/123",
    review: "First line & more.\n\nSecond 'line' done.",
  },
  "ratings, dates, URLs, reviews, and read status are normalized"
);
assert.equal(books[1].rating, null, "Goodreads' zero sentinel is represented as no rating");
assert.equal(books[1].read_at, "", "a missing finish date stays empty");
assert.equal(books[1].review, "", "a missing review stays empty rather than gaining fallback copy");
assert.deepEqual(
  currentlyReadingBooks[0],
  {
    source: "goodreads",
    source_id: "944073",
    title: "The Blade Itself (The First Law, #1)",
    author: "Joe Abercrombie",
    cover: "https://images.example.test/the-blade-itself.jpg",
    rating: null,
    read_at: "",
    status: "Currently reading",
    url: "https://www.goodreads.com/book/show/944073",
    review_url: "https://www.goodreads.com/review/show/8875527581",
    review: "",
  },
  "the current shelf gets its own status without inventing a rating, finish date, or review"
);

const progressByBookId = parseGoodreadsProgressPage(progressPageFixture);
assert.deepEqual(
  progressByBookId.get("944073"),
  {
    progress_page: 75,
    progress_total: 515,
    progress_percent: 14.6,
    progress_label: "75 of 515 pages",
    progress_url: "https://www.goodreads.com/user_status/show/1321122832",
  },
  "page-based Goodreads statuses become precise progress metadata"
);
assert.deepEqual(
  progressByBookId.get("7144"),
  {
    progress_page: null,
    progress_total: null,
    progress_percent: 20,
    progress_label: "20%",
    progress_url: "https://www.goodreads.com/user_status/show/907785241",
  },
  "percentage-based Goodreads statuses retain their native percentage"
);
assert.equal(parseGoodreadsProgressPage(emptyProgressPageFixture).size, 0, "an empty status page yields no invented progress");

const enrichedCurrentBooks = mergeGoodreadsProgress(currentlyReadingBooks, progressByBookId);
assert.equal(enrichedCurrentBooks[0].progress_percent, 14.6, "current books receive matching progress by exact Goodreads book id");
assert.equal(
  mergeGoodreadsProgress([{ ...currentlyReadingBooks[0], source_id: "999" }], progressByBookId)[0].progress_percent,
  null,
  "a current book without a matching status keeps progress absent"
);

const expectedYaml = `# Generated from Goodreads. Run: npm run sync:reading

- source: "goodreads"
  source_id: "7001"
  title: "The & Book"
  author: "First Author"
  cover: "https://images.example.test/the-book.jpg"
  rating: 4
  read_at: "2025-10-01"
  status: "Read"
  url: "https://www.goodreads.com/book/show/7001"
  review_url: "https://www.goodreads.com/review/show/123"
  review: "First line & more.\\n\\nSecond 'line' done."

- source: "goodreads"
  source_id: "7002"
  title: "An Unrated Book"
  author: "Second Author"
  cover: "https://images.example.test/unrated-book.jpg"
  rating: null
  read_at: ""
  status: "Read"
  url: "https://www.goodreads.com/book/show/7002"
  review_url: "https://www.goodreads.com/review/show/456"
  review: ""
`;

assert.equal(serializeBooksYaml(books), expectedYaml, "YAML has a stable field order and JSON-safe scalar quoting");
assert.match(
  serializeBooksYaml(enrichedCurrentBooks),
  /progress_page: 75[\s\S]*progress_total: 515[\s\S]*progress_percent: 14\.6[\s\S]*progress_label: "75 of 515 pages"/,
  "current-book YAML preserves optional Goodreads progress fields"
);
assert.equal(serializeBooksYaml(books), serializeBooksYaml(books), "serializing the same records is deterministic");
assert.equal(
  serializeBooksYaml([]),
  "# Generated from Goodreads. Run: npm run sync:reading\n[]\n",
  "an empty current shelf still produces valid generated data"
);

const scratchDirectory = await mkdtemp(path.join(os.tmpdir(), "goodreads-sync-contract-"));

try {
  const readOutput = path.join(scratchDirectory, "read.yml");
  const currentOutput = path.join(scratchDirectory, "current.yml");
  const requestedShelves = [];
  const requestedStatusPages = [];
  const result = await syncReadingShelves({
    currentlyReadingOutput: currentOutput,
    fetchImpl: async (url) => {
      const requestUrl = new URL(url);
      if (requestUrl.pathname.includes("/user_status/list/")) {
        requestedStatusPages.push(requestUrl.searchParams.get("page"));
        return htmlResponse(progressPageFixture);
      }
      const shelf = requestUrl.searchParams.get("shelf");
      requestedShelves.push(shelf);
      return xmlResponse(shelf === "read" ? readFixture : currentlyReadingFixture);
    },
    readOutput,
  });

  assert.deepEqual(new Set(requestedShelves), new Set(["read", "currently-reading"]), "the default sync requests each shelf separately");
  assert.equal(requestedShelves.length, 2, "a combined or unfiltered shelf request is never used");
  assert.deepEqual(requestedStatusPages, ["1"], "the sync stops once every current book has a matching progress status");
  assert.equal(result.read.books.length, 2);
  assert.equal(result.currentlyReading.books.length, 1);
  assert.equal(result.currentlyReading.books[0].progress_percent, 14.6);
  assert.match(await readFile(readOutput, "utf8"), /status: "Read"/);
  assert.match(await readFile(currentOutput, "utf8"), /status: "Currently reading"/);
  assert.match(await readFile(currentOutput, "utf8"), /progress_label: "75 of 515 pages"/);

  const emptyCurrentOutput = path.join(scratchDirectory, "empty-current.yml");
  const emptyCurrentResult = await syncGoodreads({
    fetchImpl: async () => xmlResponse(emptyCurrentlyReadingFixture),
    output: emptyCurrentOutput,
    shelf: "currently-reading",
  });
  assert.equal(emptyCurrentResult.books.length, 0, "an empty current shelf is a legitimate state");
  assert.equal(
    await readFile(emptyCurrentOutput, "utf8"),
    "# Generated from Goodreads. Run: npm run sync:reading\n[]\n",
    "an empty current shelf clears stale current-book data"
  );

  const protectedReadOutput = path.join(scratchDirectory, "protected-read.yml");
  await writeFile(protectedReadOutput, "existing read data\n", "utf8");
  await assert.rejects(
    syncGoodreads({ fetchImpl: async () => xmlResponse(emptyReadFixture), output: protectedReadOutput, shelf: "read" }),
    /empty read shelf/,
    "an empty read shelf is treated as unsafe"
  );
  assert.equal(await readFile(protectedReadOutput, "utf8"), "existing read data\n", "empty read responses cannot overwrite good data");

  await assert.rejects(
    syncGoodreads({
      fetchImpl: async () => xmlResponse("<html><body>Temporary error</body></html>", "text/html"),
      output: protectedReadOutput,
      shelf: "read",
    }),
    /instead of RSS XML/,
    "a non-RSS response is rejected before writing"
  );
  assert.equal(await readFile(protectedReadOutput, "utf8"), "existing read data\n", "invalid responses cannot overwrite good data");
} finally {
  await rm(scratchDirectory, { force: true, recursive: true });
}

console.log("goodreads sync contract passed");
