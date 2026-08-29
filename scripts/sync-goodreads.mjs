import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { XMLParser } from "fast-xml-parser";
import { format as formatWithPrettier } from "prettier";

const DEFAULT_USER_ID = "155320656";
const DEFAULT_SHELF = "read";
const DEFAULT_OUTPUTS = Object.freeze({
  read: "_data/read_books.yml",
  "currently-reading": "_data/currently_reading.yml",
});
const PAGE_SIZE = 100;
const MAX_PAGES = 20;
const MAX_STATUS_PAGES = 10;

const xmlParser = new XMLParser({
  cdataPropName: "#cdata",
  ignoreAttributes: false,
  parseTagValue: false,
  processEntities: true,
  trimValues: false,
});

function textValue(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(textValue).join("");
  if (typeof value === "object") {
    if ("#cdata" in value) return textValue(value["#cdata"]);
    if ("#text" in value) return textValue(value["#text"]);
  }
  return "";
}

function decodeHtmlEntities(value) {
  const namedEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value.replace(/&(#(?:x[\da-f]+|\d+)|[a-z]+);/gi, (entity, name) => {
    if (name.startsWith("#x") || name.startsWith("#X")) {
      const codePoint = Number.parseInt(name.slice(2), 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity;
    }
    if (name.startsWith("#")) {
      const codePoint = Number.parseInt(name.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity;
    }
    return namedEntities[name.toLowerCase()] ?? entity;
  });
}

export function reviewHtmlToText(value) {
  const source = textValue(value).trim();
  if (!source) return "";

  return decodeHtmlEntities(
    source
      .replace(/\r\n?/g, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/\s*(?:blockquote|div|li|ol|p|pre|ul)\s*>/gi, "\n")
      .replace(/<li(?:\s[^>]*)?>/gi, "- ")
      .replace(/<[^>]*>/g, "")
  )
    .split("\n")
    .map((line) => line.replace(/[\t ]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function toIsoDate(value) {
  const source = textValue(value).trim();
  if (!source) return "";

  const parsed = new Date(source);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

function cleanReviewUrl(value) {
  const source = textValue(value).trim();
  if (!source) return "";
  try {
    const url = new URL(source);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}

export function statusForShelf(shelf) {
  if (shelf === "read") return "Read";
  if (shelf === "currently-reading") return "Currently reading";

  return String(shelf || "")
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(" ");
}

export function normalizeGoodreadsItem(item, { status = "Read" } = {}) {
  const sourceId = textValue(item?.book_id || item?.book?.["@_id"]).trim();
  if (!/^\d+$/.test(sourceId)) return null;

  const rawRating = Number.parseFloat(textValue(item?.user_rating).trim());
  const rating = Number.isFinite(rawRating) && rawRating > 0 ? rawRating : null;
  const cover = textValue(item?.book_large_image_url || item?.book_medium_image_url || item?.book_image_url).trim();
  const reviewUrl = cleanReviewUrl(item?.link || item?.guid);

  return {
    source: "goodreads",
    source_id: sourceId,
    title: decodeHtmlEntities(textValue(item?.title)).trim(),
    author: decodeHtmlEntities(textValue(item?.author_name)).trim(),
    cover,
    rating,
    read_at: toIsoDate(item?.user_read_at),
    status,
    url: `https://www.goodreads.com/book/show/${sourceId}`,
    review_url: reviewUrl,
    review: reviewHtmlToText(item?.user_review),
  };
}

export function parseGoodreadsFeed(xml, { expectedShelf } = {}) {
  const document = xmlParser.parse(xml);
  const channel = document?.rss?.channel;
  if (!channel) throw new Error("Goodreads response is not a valid RSS feed.");

  const channelTitle = decodeHtmlEntities(textValue(channel.title)).trim();
  if (expectedShelf && !channelTitle.toLowerCase().endsWith(`bookshelf: ${expectedShelf}`.toLowerCase())) {
    throw new Error(`Goodreads returned an unexpected shelf: ${channelTitle || "untitled feed"}`);
  }

  const rawItems = channel.item;
  const items = rawItems ? (Array.isArray(rawItems) ? rawItems : [rawItems]) : [];

  const status = statusForShelf(expectedShelf || DEFAULT_SHELF);
  return items.map((item) => normalizeGoodreadsItem(item, { status })).filter(Boolean);
}

function progressPercent(value) {
  if (!Number.isFinite(value)) return null;
  return Math.round(Math.max(0, Math.min(100, value)) * 10) / 10;
}

export function parseGoodreadsProgressPage(html) {
  const source = String(html || "");
  const starts = [...source.matchAll(/<div\b[^>]*\bid=["']user_status_(\d+)["'][^>]*>/gi)];
  const progressByBookId = new Map();

  for (let index = 0; index < starts.length; index += 1) {
    const start = starts[index];
    const end = starts[index + 1]?.index ?? source.length;
    const block = source.slice(start.index, end);
    const bookMatch = block.match(/href=["'][^"']*\/book\/show\/(\d+)(?:[._/?#&"']|$)/i);
    if (!bookMatch || progressByBookId.has(bookMatch[1])) continue;

    const text = decodeHtmlEntities(block.replace(/<[^>]*>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    const pageMatch = text.match(/\bis on page\s+([\d,]+)\s+of\s+([\d,]+)/i);
    const percentMatch = text.match(/\bis\s+(\d+(?:\.\d+)?)%\s+done\b/i);
    const statusId = start[1];

    if (pageMatch) {
      const page = Number(pageMatch[1].replaceAll(",", ""));
      const total = Number(pageMatch[2].replaceAll(",", ""));
      if (!Number.isFinite(page) || !Number.isFinite(total) || total <= 0) continue;
      progressByBookId.set(bookMatch[1], {
        progress_page: page,
        progress_total: total,
        progress_percent: progressPercent((page / total) * 100),
        progress_label: `${page} of ${total} pages`,
        progress_url: `https://www.goodreads.com/user_status/show/${statusId}`,
      });
      continue;
    }

    if (percentMatch) {
      const percent = progressPercent(Number(percentMatch[1]));
      if (percent === null) continue;
      progressByBookId.set(bookMatch[1], {
        progress_page: null,
        progress_total: null,
        progress_percent: percent,
        progress_label: `${percent}%`,
        progress_url: `https://www.goodreads.com/user_status/show/${statusId}`,
      });
    }
  }

  return progressByBookId;
}

export function mergeGoodreadsProgress(books, progressByBookId) {
  return books.map((book) => {
    const progress = progressByBookId.get(book.source_id);
    return {
      ...book,
      progress_page: progress?.progress_page ?? null,
      progress_total: progress?.progress_total ?? null,
      progress_percent: progress?.progress_percent ?? null,
      progress_label: progress?.progress_label ?? "",
      progress_url: progress?.progress_url ?? "",
    };
  });
}

function yamlString(value) {
  return JSON.stringify(value ?? "");
}

export function serializeBooksYaml(books) {
  const lines = ["# Generated from Goodreads. Run: npm run sync:reading", ""];

  if (books.length === 0) return `${lines.join("\n")}[]\n`;

  for (const book of books) {
    lines.push(`- source: ${yamlString(book.source)}`);
    lines.push(`  source_id: ${yamlString(book.source_id)}`);
    lines.push(`  title: ${yamlString(book.title)}`);
    lines.push(`  author: ${yamlString(book.author)}`);
    lines.push(`  cover: ${yamlString(book.cover)}`);
    lines.push(`  rating: ${book.rating ?? "null"}`);
    lines.push(`  read_at: ${yamlString(book.read_at)}`);
    lines.push(`  status: ${yamlString(book.status)}`);
    lines.push(`  url: ${yamlString(book.url)}`);
    lines.push(`  review_url: ${yamlString(book.review_url)}`);
    lines.push(`  review: ${yamlString(book.review)}`);
    if (Object.hasOwn(book, "progress_percent")) {
      lines.push(`  progress_page: ${book.progress_page ?? "null"}`);
      lines.push(`  progress_total: ${book.progress_total ?? "null"}`);
      lines.push(`  progress_percent: ${book.progress_percent ?? "null"}`);
      lines.push(`  progress_label: ${yamlString(book.progress_label)}`);
      lines.push(`  progress_url: ${yamlString(book.progress_url)}`);
    }
    lines.push("");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function feedUrl({ page, shelf, userId }) {
  const url = new URL(`https://www.goodreads.com/review/list_rss/${encodeURIComponent(userId)}`);
  url.searchParams.set("shelf", shelf);
  url.searchParams.set("per_page", String(PAGE_SIZE));
  url.searchParams.set("page", String(page));
  return url;
}

function statusPageUrl({ page, userId }) {
  const url = new URL(`https://www.goodreads.com/user_status/list/${encodeURIComponent(userId)}`);
  url.searchParams.set("page", String(page));
  return url;
}

async function fetchPage(url, fetchImpl) {
  const retryableStatuses = new Set([408, 425, 429, 500, 502, 503, 504]);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers: {
          accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8",
          "user-agent": "AhmedAlyPortfolioReadingSync/1.0",
        },
        signal: AbortSignal.timeout(20_000),
      });

      if (!response.ok) {
        const error = new Error(`Goodreads returned HTTP ${response.status} for ${url}`);
        if (!retryableStatuses.has(response.status)) throw error;
        if (attempt === 2) throw error;
      } else {
        const contentType = response.headers?.get?.("content-type") || "";
        if (contentType && !/\b(?:application|text)\/(?:[\w.+-]*\+)?xml\b/i.test(contentType)) {
          throw new Error(`Goodreads returned ${contentType} instead of RSS XML.`);
        }
        return response.text();
      }
    } catch (error) {
      if (attempt === 2 || !/fetch|network|timeout|aborted/i.test(String(error))) throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
  }

  throw new Error(`Goodreads feed could not be fetched from ${url}`);
}

async function fetchStatusPage(url, fetchImpl) {
  const retryableStatuses = new Set([408, 425, 429, 500, 502, 503, 504]);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers: {
          accept: "text/html,application/xhtml+xml;q=0.9",
          "user-agent": "AhmedAlyPortfolioReadingSync/1.0",
        },
        signal: AbortSignal.timeout(20_000),
      });

      if (!response.ok) {
        const error = new Error(`Goodreads returned HTTP ${response.status} for ${url}`);
        if (!retryableStatuses.has(response.status)) throw error;
        if (attempt === 2) throw error;
      } else {
        const contentType = response.headers?.get?.("content-type") || "";
        if (contentType && !/\b(?:text\/html|application\/xhtml\+xml)\b/i.test(contentType)) {
          throw new Error(`Goodreads returned ${contentType} instead of a status page.`);
        }
        return response.text();
      }
    } catch (error) {
      if (attempt === 2 || !/fetch|network|timeout|aborted/i.test(String(error))) throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
  }

  throw new Error(`Goodreads status page could not be fetched from ${url}`);
}

export async function fetchGoodreadsShelf({ fetchImpl = fetch, shelf = DEFAULT_SHELF, userId = DEFAULT_USER_ID } = {}) {
  if (!/^\d+$/.test(String(userId))) throw new Error("Goodreads user id must contain only digits.");
  if (!/^[a-z0-9_-]+$/i.test(shelf)) throw new Error("Goodreads shelf contains unsupported characters.");

  const books = [];
  const sourceIds = new Set();

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const url = feedUrl({ page, shelf, userId: String(userId) });
    const pageBooks = parseGoodreadsFeed(await fetchPage(url, fetchImpl), { expectedShelf: shelf });
    let newBooks = 0;

    for (const book of pageBooks) {
      if (sourceIds.has(book.source_id)) continue;
      sourceIds.add(book.source_id);
      books.push(book);
      newBooks += 1;
    }

    if (pageBooks.length < PAGE_SIZE || newBooks === 0) break;
    if (page === MAX_PAGES) throw new Error(`Goodreads feed exceeded the ${MAX_PAGES}-page safety limit.`);
  }

  if (books.length === 0 && shelf !== "currently-reading") {
    throw new Error(`Goodreads returned an empty ${shelf} shelf; existing data was not replaced.`);
  }

  return books;
}

export async function fetchGoodreadsProgress({ books, fetchImpl = fetch, userId = DEFAULT_USER_ID } = {}) {
  if (!/^\d+$/.test(String(userId))) throw new Error("Goodreads user id must contain only digits.");
  const targetIds = new Set((books || []).map((book) => book.source_id).filter(Boolean));
  const progressByBookId = new Map();
  if (targetIds.size === 0) return progressByBookId;

  for (let page = 1; page <= MAX_STATUS_PAGES; page += 1) {
    let html;
    try {
      html = await fetchStatusPage(statusPageUrl({ page, userId: String(userId) }), fetchImpl);
    } catch (error) {
      if (progressByBookId.size > 0) break;
      throw error;
    }

    const statusCount = (html.match(/\bid=["']user_status_\d+["']/gi) || []).length;
    const pageProgress = parseGoodreadsProgressPage(html);
    for (const [bookId, progress] of pageProgress) {
      if (targetIds.has(bookId) && !progressByBookId.has(bookId)) progressByBookId.set(bookId, progress);
    }

    if (statusCount === 0 || progressByBookId.size === targetIds.size) break;
  }

  return progressByBookId;
}

async function enrichCurrentBooksWithProgress(books, { fetchImpl, userId }) {
  let progressByBookId = new Map();
  try {
    progressByBookId = await fetchGoodreadsProgress({ books, fetchImpl, userId });
  } catch {
    // Goodreads' public status pages are a best-effort supplement to the
    // stable shelf RSS. A temporary status-page failure must not erase books.
  }
  return mergeGoodreadsProgress(books, progressByBookId);
}

function defaultOutputForShelf(shelf) {
  return DEFAULT_OUTPUTS[shelf] || `_data/${shelf.replace(/-/g, "_")}.yml`;
}

async function writeBooksYaml(books, output) {
  const outputPath = path.resolve(output);
  await mkdir(path.dirname(outputPath), { recursive: true });
  const yaml = await formatWithPrettier(serializeBooksYaml(books), { parser: "yaml" });
  await writeFile(outputPath, yaml, "utf8");
  return outputPath;
}

export async function syncGoodreads({ fetchImpl = fetch, output, shelf = DEFAULT_SHELF, userId = DEFAULT_USER_ID } = {}) {
  let books = await fetchGoodreadsShelf({ fetchImpl, shelf, userId });
  if (shelf === "currently-reading") books = await enrichCurrentBooksWithProgress(books, { fetchImpl, userId });
  const outputPath = await writeBooksYaml(books, output || defaultOutputForShelf(shelf));

  return { books, outputPath, shelf };
}

export async function syncReadingShelves({
  currentlyReadingOutput = DEFAULT_OUTPUTS["currently-reading"],
  fetchImpl = fetch,
  readOutput = DEFAULT_OUTPUTS.read,
  userId = DEFAULT_USER_ID,
} = {}) {
  // Fetch and validate both feeds before writing either file. This prevents a
  // transient or malformed response from leaving the two generated datasets
  // out of step with one another.
  const [readBooks, currentShelfBooks] = await Promise.all([
    fetchGoodreadsShelf({ fetchImpl, shelf: "read", userId }),
    fetchGoodreadsShelf({ fetchImpl, shelf: "currently-reading", userId }),
  ]);
  const currentlyReadingBooks = await enrichCurrentBooksWithProgress(currentShelfBooks, { fetchImpl, userId });

  const [readOutputPath, currentlyReadingOutputPath] = await Promise.all([
    writeBooksYaml(readBooks, readOutput),
    writeBooksYaml(currentlyReadingBooks, currentlyReadingOutput),
  ]);

  return {
    read: { books: readBooks, outputPath: readOutputPath, shelf: "read" },
    currentlyReading: {
      books: currentlyReadingBooks,
      outputPath: currentlyReadingOutputPath,
      shelf: "currently-reading",
    },
  };
}

function cliOptions(args) {
  const environmentShelf = process.env.GOODREADS_SHELF;
  const environmentOutput = process.env.GOODREADS_OUTPUT;
  const options = {
    mode: environmentShelf || environmentOutput ? "single" : "all",
    output: environmentOutput,
    shelf: environmentShelf || DEFAULT_SHELF,
    userId: process.env.GOODREADS_USER_ID || DEFAULT_USER_ID,
  };

  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (!["--user-id", "--shelf", "--output"].includes(flag) || !args[index + 1] || args[index + 1].startsWith("--")) {
      throw new Error(`Unknown or incomplete option: ${flag}`);
    }

    const value = args[++index];
    if (flag === "--user-id") options.userId = value;
    else if (flag === "--shelf") {
      options.mode = "single";
      options.shelf = value;
    } else {
      options.mode = "single";
      options.output = value;
    }
  }

  if (options.mode === "single" && !options.output) options.output = defaultOutputForShelf(options.shelf);
  return options;
}

async function main() {
  const options = cliOptions(process.argv.slice(2));

  if (options.mode === "all") {
    const result = await syncReadingShelves({ userId: options.userId });
    const reviewed = result.read.books.filter((book) => book.review).length;
    console.log(
      `Synced ${result.read.books.length} read books (${reviewed} with reviews) to ${result.read.outputPath}; ` +
        `${result.currentlyReading.books.length} currently reading to ${result.currentlyReading.outputPath}`
    );
    return;
  }

  const { books, outputPath, shelf } = await syncGoodreads(options);
  const reviewed = books.filter((book) => book.review).length;
  console.log(`Synced ${books.length} ${shelf} books (${reviewed} with reviews) to ${outputPath}`);
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
