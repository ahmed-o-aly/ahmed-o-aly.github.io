import { chromium } from "../power-systems-lab/node_modules/playwright/index.mjs";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const base = process.env.METAHUB_QA_URL || "http://127.0.0.1:4001";
const browser = await chromium.launch({ headless: true, channel: process.env.METAHUB_QA_BROWSER_CHANNEL || undefined });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const requests = [];
page.on("request", (request) => requests.push(request.url()));
await mkdir("tmp/metahub", { recursive: true });
try {
  await page.goto(`${base}/projects/metahub/`);
  await page.locator(".metahub-filters:visible").waitFor();
  await page.locator(".metahub-card img").evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
  assert.equal(await page.locator("[data-metahub-card]:visible").count(), 5);
  assert.equal(await page.locator("iframe,canvas").count(), 0);
  assert.ok(
    !requests.some((url) => /\/(?:protein-structures|circuits-lab|bloch-lab|power-systems-lab)\/(?:assets|data)\//.test(url)),
    "catalogue browsing loads no app bundles/data"
  );
  await page.screenshot({ path: "tmp/metahub/catalogue-desktop.png", fullPage: true });
  await page.getByLabel("Search the collection").fill("protein");
  assert.equal(await page.locator("[data-metahub-card]:visible").count(), 1);
  assert.match(page.url(), /q=protein/);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByLabel("Subject", { exact: true }).selectOption("Engineering");
  assert.equal(await page.locator("[data-metahub-card]:visible").count(), 3);
  await page.getByLabel("Search the collection").fill("no matching experience");
  assert.equal(await page.locator("[data-metahub-card]:visible").count(), 0);
  assert.ok(await page.locator("[data-metahub-empty]").isVisible());
  await page.getByRole("button", { name: "Clear filters" }).click();
  assert.equal(await page.locator("[data-metahub-card]:visible").count(), 5);
  for (const id of ["machine-lab", "protein-structures", "circuits-lab", "bloch-lab", "power-systems-lab"]) {
    const cover = page.locator(`[data-metahub-open="${id}"]`);
    await cover.click();
    assert.ok(await page.locator(".metahub-dialog").isVisible());
    assert.equal(await page.locator("#metahub-dialog-title").count(), 1);
    assert.match(await page.locator(".metahub-launch").getAttribute("href"), id === "machine-lab" ? /cnc-machine-inspector/ : new RegExp(`/${id}/`));
    assert.equal(await page.locator("iframe,canvas").count(), 0);
    await page.keyboard.press("Escape");
    assert.ok(await cover.evaluate((element) => element === document.activeElement), "closing restores keyboard focus");
  }
  await page.goto(`${base}/projects/metahub/#bloch-lab`);
  await page.locator(".metahub-dialog:visible").waitFor();
  assert.equal(await page.locator("#metahub-dialog-title").textContent(), "Bloch Lab");
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "tmp/metahub/catalogue-phone.png", fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "phone catalogue fits the screen");
  await page.locator('[data-metahub-open="protein-structures"]').click();
  await page.screenshot({ path: "tmp/metahub/details-phone.png" });
  await page.keyboard.press("Escape");
  // No-JavaScript visitors can still browse real links to all five project notes.
  const fallback = await browser.newContext({ javaScriptEnabled: false });
  const plain = await fallback.newPage();
  await plain.goto(`${base}/projects/metahub/`);
  assert.equal(await plain.locator(".metahub-card a[href]").count(), 5);
  assert.equal(await plain.locator(".metahub-filters:visible").count(), 0);
  await fallback.close();
  // Verify the deferred-load boundary and the real published lab, not a mock frame.
  await page.setViewportSize({ width: 1440, height: 1000 });
  requests.length = 0;
  await page.goto(`${base}/projects/protein-structures/`);
  const embed = page.locator("#metahub-embed");
  assert.equal(await embed.getAttribute("src"), null);
  assert.ok(!requests.some((url) => /\/protein-structures\/(?:assets|data)\//.test(url)));
  await page.getByRole("button", { name: "Load Protein Structures here" }).click();
  await page.frameLocator("#metahub-embed").locator(".metahub-app-bar").waitFor();
  await page.frameLocator("#metahub-embed").locator("#loading").waitFor({ state: "hidden", timeout: 60000 });
  assert.equal(await page.frameLocator("#metahub-embed").locator("canvas").count(), 1);
  assert.ok(!(await page.locator("[data-metahub-preview]").isVisible()));
  for (const id of ["protein-structures", "circuits-lab", "bloch-lab", "power-systems-lab"]) {
    await page.goto(`${base}/${id}/`);
    await page.locator(".metahub-app-bar").waitFor();
    assert.equal(await page.locator(".metahub-app-trail a").getAttribute("href"), "/projects/metahub/");
    assert.equal(await page.locator("canvas").count(), 1, `${id} retains one renderer`);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${id} phone layout fits`);
    await page.screenshot({ path: `tmp/metahub/${id}-published-phone.png`, fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  assert.deepEqual(errors, []);
  console.log("MetaHub browser checks passed: filters, dialogs, focus, launch links, no-JS, deferred load and four responsive app shells");
} finally {
  await browser.close();
}
