// Local design review: captures the real lab layouts, plus the external Machine Lab prototype.
// Build Jekyll and serve _site first. Run: node scripts/preview-metahub-layouts.mjs
import { chromium } from "../power-systems-lab/node_modules/playwright/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

const base = process.env.METAHUB_QA_URL || "http://127.0.0.1:4001";
const directory = "output/metahub-layouts";
const labs = [
  {
    id: "machine-lab",
    title: "Machine Lab",
    subject: "Engineering",
    note: "Assembly navigation, inspection tools and a component reading panel.",
    prototype: true,
  },
  {
    id: "protein-structures",
    title: "Protein Structures",
    subject: "Biology",
    note: "A full-size model stage with density, chain and snapshot controls.",
  },
  { id: "circuits-lab", title: "Circuits Lab", subject: "Engineering", note: "An experiment shelf, physical workbench and measurements below." },
  { id: "bloch-lab", title: "Bloch Lab", subject: "Physics", note: "A sphere beside a guided lesson, with free exploration tucked beneath." },
  {
    id: "power-systems-lab",
    title: "Power Systems Lab",
    subject: "Engineering",
    note: "Equipment on the left, a field view in the centre and explanations on the right.",
  },
];
const url = (lab) => (lab.prototype ? "./machine-lab.html" : `${base}/${lab.id}/`);
const head = (title) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><link rel="stylesheet" href="${base}/assets/css/metahub-app-shell.css"><link rel="stylesheet" href="${base}/assets/css/metahub-lab-theme.css">`;
await mkdir(directory, { recursive: true });
await writeFile(
  `${directory}/machine-lab.html`,
  `${head("Machine Lab · Layout prototype")}
<style>
*{box-sizing:border-box}body{margin:0}h1,h2,p{margin-top:0}.machine-workspace{display:grid;grid-template-columns:240px minmax(0,1fr) 310px;height:calc(100dvh - 120px)}.machine-nav,.machine-details{padding:28px 24px;background:var(--garden-surface);overflow:auto}.machine-nav{border-right:1px solid var(--garden-line)}.machine-details{border-left:1px solid var(--garden-line)}.machine-nav select{width:100%;margin:8px 0 28px}.machine-nav h2{font-size:26px;margin:8px 0 20px}.assembly{padding:0;list-style:none}.assembly li{padding:12px 8px;border-bottom:1px solid var(--garden-line-soft);font:400 19px/1.2 var(--garden-serif)}.assembly li:first-child{border-left:2px solid var(--garden-accent);background:var(--garden-surface-hover)}.assembly small{display:block;font:10px/1.5 var(--garden-mono);color:var(--garden-muted);margin-top:5px}.machine-stage{position:relative;min-width:0;overflow:hidden;background:var(--garden-canvas)}.machine-stage img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;padding:70px 16px 90px}.machine-stage .eyebrow{position:absolute;left:24px;top:28px}.machine-toolbar{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);display:flex;padding:5px;background:var(--garden-surface);border:1px solid var(--garden-line)}.machine-toolbar button{border:0;white-space:nowrap}.machine-details h2{font-size:34px;font-style:italic;line-height:1.1;margin:20px 0}.machine-details p{font:18px/1.55 var(--garden-serif)}.machine-details .actions{display:flex;gap:8px;margin-top:24px}.machine-details hr{border:0;border-top:1px solid var(--garden-line);margin:28px 0}.machine-footer{height:44px;padding:12px 24px;border-top:1px solid var(--garden-line);font:10px/1.5 var(--garden-mono);display:flex;justify-content:space-between;background:var(--garden-surface)}.machine-footer a{color:var(--garden-accent)}.prototype-label{color:var(--garden-muted);font:10px var(--garden-mono)}@media(max-width:760px){.machine-workspace{display:flex;flex-direction:column;height:auto}.machine-stage{height:52dvh;min-height:360px;order:-1}.machine-nav,.machine-details{border:0;border-top:1px solid var(--garden-line)}.machine-footer{height:auto;gap:14px;flex-wrap:wrap}.machine-toolbar{max-width:calc(100% - 24px)}.machine-toolbar button{font-size:9px;padding:8px}.machine-nav{padding:24px}.machine-nav .assembly{display:grid;grid-template-columns:1fr 1fr;gap:8px}.machine-nav select{margin-bottom:16px}}
</style></head><body class="metahub-folio" data-metahub-lab="machine-lab">
<header class="metahub-app-bar"><div class="metahub-app-trail"><a href="${base}/projects/metahub/">← MetaHub</a><h1 class="metahub-app-name">Machine Lab</h1></div><div class="metahub-app-actions"><span class="prototype-label">Layout prototype</span><a href="${base}/projects/cnc-machine-inspector/">Project notes</a><button disabled>Enter VR</button><a href="https://ahmed-o-aly.github.io/cnc-machine-inspector/?machine=vmc855" target="_blank" rel="noopener">Current viewer ↗</a></div></header>
<main class="machine-workspace"><aside class="machine-nav" aria-label="Assembly navigation"><p class="eyebrow">Workshop / 08 assemblies</p><h2>VMC855</h2><label class="eyebrow" for="machine">Choose a machine</label><select id="machine" disabled><option>VMC855 · Vertical machining centre</option></select><p class="eyebrow">Assembly</p><ul class="assembly"><li>Complete machine<small>All components in context</small></li><li>Enclosure<small>Access and containment</small></li><li>Spindle assembly<small>Tool and rotating spindle</small></li><li>Worktable<small>Workholding surface</small></li><li>Control station<small>Operator interface</small></li></ul></aside>
<section class="machine-stage" aria-label="Static VMC855 assembly capture"><p class="eyebrow">VMC855 / Assembly study</p><img src="${base}/assets/img/projects/selected-works/vmc855.webp" alt="VMC855 assembly with enclosure, worktable and spindle visible"><div class="machine-toolbar" aria-label="Inspection controls, visual prototype"><button disabled>Reset view</button><button disabled>Explode</button><button disabled>Section</button><button disabled>Measure</button></div></section>
<aside class="machine-details"><p class="eyebrow">Component / Construction</p><h2>The complete assembly.</h2><p>Read the machine as a collection of connected parts. Select a component to inspect its place in the assembly.</p><hr><p class="eyebrow">Inspection</p><p>Isolate a part, separate the assembly or cut a section to see how the components fit together.</p><div class="actions"><button disabled>Focus part</button><button disabled>Isolate part</button></div></aside></main>
<footer class="machine-footer"><span>Visual prototype · static model capture · controls are illustrative</span><a href="${base}/projects/cnc-machine-inspector/">Model sources & attribution ↗</a></footer></body></html>`
);

const browser = await chromium.launch({ headless: true, channel: process.env.METAHUB_QA_BROWSER_CHANNEL || "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  for (const lab of labs) {
    await page.goto(lab.prototype ? new URL(`../${directory}/machine-lab.html`, import.meta.url).href : url(lab));
    await page.locator(".metahub-folio .metahub-app-bar").waitFor();
    if (lab.id === "protein-structures") await page.locator("#loading").waitFor({ state: "hidden", timeout: 60000 });
    if (lab.id === "power-systems-lab")
      await page.waitForFunction(() => document.querySelector("#view").dataset.loaded === "true", null, { timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    assert.equal(await page.evaluate(() => getComputedStyle(document.body).color), "rgb(55, 43, 31)", `${lab.title} shares the site ink`);
    await page.screenshot({ path: `${directory}/${lab.id}.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${lab.title} fits a phone`);
    await page.screenshot({ path: `${directory}/${lab.id}-phone.png`, fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    // Exercise real controls after capture, including the themed dialogs and mobile drawers.
    if (lab.id === "protein-structures") {
      await page.locator('#density-style [data-mode="surface"]').click();
      assert.equal(await page.locator('#density-style [data-mode="surface"]').getAttribute("aria-pressed"), "true");
      await page.locator("#help-open").click();
      assert.ok(await page.locator("#help").isVisible());
      await page.keyboard.press("Escape");
    }
    if (lab.id === "circuits-lab") {
      await page.locator('[data-module="superposition"]').click();
      assert.match(await page.locator("#module-title").textContent(), /Superposition/);
      await page.locator("#guide-button").click();
      assert.ok(await page.locator("#guide-dialog").isVisible());
      await page.keyboard.press("Escape");
    }
    if (lab.id === "bloch-lab") {
      await page.locator("#lesson-explore").click();
      assert.ok(await page.locator("#exploration").evaluate((details) => details.open));
      await page.locator("#presets button").first().click();
    }
    if (lab.id === "power-systems-lab") {
      await page.locator("#equipment-list button").nth(1).click();
      assert.ok(await page.locator("#focus").isEnabled());
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator("#toggle-details").click();
      assert.ok(await page.locator("#details").isVisible());
      await page.setViewportSize({ width: 1440, height: 900 });
    }
    console.log(`Captured ${lab.title} at desktop and phone sizes`);
  }
  assert.deepEqual(errors, [], "review versions render without application errors");
} finally {
  await browser.close();
}

await writeFile(
  `${directory}/index.html`,
  `${head("MetaHub · Website identity preview")}
<style>
*{box-sizing:border-box}body{margin:0;color:var(--garden-ink);background:var(--garden-canvas);font:18px/1.5 var(--garden-serif)}a{color:var(--garden-accent);text-underline-offset:4px}.review-nav{padding:22px max(24px,calc((100% - 1200px)/2));border-bottom:1px solid var(--garden-line);display:flex;justify-content:space-between;font:11px/1.5 var(--garden-mono)}main{max-width:1200px;margin:auto;padding:64px 24px 80px}.label{font:10px/1.6 var(--garden-mono);text-transform:uppercase;letter-spacing:.1em;color:var(--garden-quiet)}h1{font:400 clamp(44px,6vw,72px)/1.05 var(--garden-serif);letter-spacing:-.03em;margin:16px 0 24px}h1 em{font-weight:400}.lead{max-width:690px;font-size:23px;line-height:1.5}.swatches{display:flex;flex-wrap:wrap;gap:22px;margin:32px 0 42px;font:10px var(--garden-mono)}.swatches span{display:flex;align-items:center;gap:8px}.swatches i{display:block;width:18px;height:18px;border:1px solid var(--garden-line)}.review-tools{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:18px 0;border-top:1px solid var(--garden-line);border-bottom:1px solid var(--garden-line);margin-bottom:40px}.review-tools button{font:11px var(--garden-mono);min-height:44px;padding:10px 16px;border:1px solid var(--garden-line);background:transparent;color:var(--garden-ink);cursor:pointer}.review-tools button[aria-pressed=true]{color:var(--garden-surface);background:var(--garden-accent)}.review-tools p{margin:0 0 0 auto;font:10px var(--garden-mono);color:var(--garden-muted)}.gallery{display:grid;grid-template-columns:1fr 1fr;gap:44px 28px}.layout{min-width:0}.layout:first-child{grid-column:1/-1}.layout .caption{display:flex;justify-content:space-between;gap:12px;align-items:baseline;margin:0 0 12px}.layout h2{font:400 31px/1.2 var(--garden-serif);margin:0}.layout .type{font:10px var(--garden-mono);color:var(--garden-quiet)}.layout img{width:100%;height:auto;display:block;border:1px solid var(--garden-line);background:var(--garden-surface)}.layout a.capture{display:block}.layout p{margin:14px 0;font-size:19px}.layout .open{font:11px var(--garden-mono)}.gallery.phone{grid-template-columns:repeat(3,minmax(0,1fr));align-items:start}.gallery.phone .layout:first-child{grid-column:auto}.gallery.phone .capture{height:640px;overflow:auto;scrollbar-width:thin;border:1px solid var(--garden-line)}.gallery.phone img{border:0}.gallery.phone h2{font-size:26px}.note{margin-top:60px;border-top:1px solid var(--garden-line);padding-top:24px;max-width:730px;font-size:17px;color:var(--garden-muted)}:focus-visible{outline:2px solid var(--garden-focus);outline-offset:5px}@media(max-width:700px){main{padding-top:42px}.gallery,.gallery.phone{grid-template-columns:1fr}.layout:first-child{grid-column:auto}.review-tools p{width:100%;margin:0}.gallery.phone .layout{max-width:390px;margin:auto;width:100%}.layout .caption{flex-wrap:wrap;gap:5px}.lead{font-size:21px}}
</style></head><body>
<nav class="review-nav" aria-label="Preview navigation"><a href="${base}/projects/metahub/">← Back to MetaHub</a><span>Ahmed Aly / Local design review</span></nav>
<main><p class="label">MetaHub / Five laboratory layouts</p><h1>One identity.<br><em>Five ways to explore.</em></h1><p class="lead">The website’s parchment, ink and rust continue inside the labs. Serif titles, quiet mono labels, square controls and thin rules connect every workspace.</p><div class="swatches"><span><i style="background:#f6f0e3"></i>Parchment</span><span><i style="background:#372b1f"></i>Ink</span><span><i style="background:#8a3b2a"></i>Rust</span><span>EB Garamond / IBM Plex Mono</span></div>
<div class="review-tools" role="group" aria-label="Preview screen size"><button data-size="desktop" aria-pressed="true">Desktop layouts</button><button data-size="phone" aria-pressed="false">Phone layouts</button><p>Open any layout to inspect it at full size.</p></div>
<div class="gallery">${labs
    .map(
      (lab) =>
        `<article class="layout"><div class="caption"><h2>${lab.title}</h2><span class="type">${lab.subject} / ${
          lab.prototype ? "Visual prototype" : "Working preview"
        }</span></div><a class="capture" href="${url(lab)}" target="_blank" rel="noopener" aria-label="Open ${lab.title} layout"><img src="./${
          lab.id
        }.png" data-lab="${lab.id}" alt="${
          lab.title
        } with the website’s parchment surfaces, serif titles and rust controls" width="1440" height="900" loading="lazy"></a><p>${
          lab.note
        }</p><a class="open" href="${url(lab)}" target="_blank" rel="noopener">${
          lab.prototype ? "Open visual prototype" : "Try this layout"
        } ↗</a></article>`
    )
    .join("")}</div>
<p class="note">Four previews run the actual labs with their default website styling. Machine Lab is a visual prototype using a real assembly capture; its controls are illustrative because the application lives in a separate repository. Model colours retain their scientific meaning. This review is local and has not been published.</p></main>
<script>document.querySelectorAll('[data-size]').forEach(button=>button.addEventListener('click',()=>{const phone=button.dataset.size==='phone';document.querySelector('.gallery').classList.toggle('phone',phone);document.querySelectorAll('[data-size]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));document.querySelectorAll('[data-lab]').forEach(img=>{img.src='./'+img.dataset.lab+(phone?'-phone':'')+'.png';img.removeAttribute('width');img.removeAttribute('height');});}));</script></body></html>`
);
console.log(`Review ready: ${directory}/index.html`);
