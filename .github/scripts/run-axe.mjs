import CDP from "chrome-remote-interface";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";

const require = createRequire(import.meta.url);

const url = process.argv[2] || "http://127.0.0.1:8080/";
const loadDelay = Number(process.argv[3] || 1500);
const port = Number(process.env.CHROME_REMOTE_PORT || 9222);
const chromePath = process.env.CHROME_PATH || process.env.CHROME_BIN || "google-chrome";
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForChrome() {
  const endpoint = `http://127.0.0.1:${port}/json/version`;

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) return;
    } catch (_error) {
      // Chrome is still starting.
    }

    await sleep(250);
  }

  throw new Error(`Chrome did not open a debugging port on ${port}`);
}

function formatViolations(violations) {
  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => {
          const target = node.target.join(", ");
          return `    - ${target}\n      ${node.failureSummary || "No failure summary provided."}`;
        })
        .join("\n");

      return `  ${violation.id} (${violation.impact})\n  ${violation.help}\n${nodes}`;
    })
    .join("\n\n");
}

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    `--remote-debugging-port=${port}`,
    "about:blank",
  ],
  { stdio: ["ignore", "pipe", "pipe"] },
);

let client;

try {
  await waitForChrome();
  client = await CDP({ port });

  const { Page, Runtime } = client;
  await Page.enable();
  await Runtime.enable();
  await Page.navigate({ url });
  await Page.loadEventFired();
  await sleep(loadDelay);
  await Runtime.evaluate({ expression: axeSource });

  const result = await Runtime.evaluate({
    awaitPromise: true,
    returnByValue: true,
    expression: `
      axe.run(document).then((results) => ({
        url: window.location.href,
        violations: results.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          help: violation.help,
          nodes: violation.nodes.map((node) => ({
            target: node.target,
            failureSummary: node.failureSummary
          }))
        }))
      }))
    `,
  });

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "axe evaluation failed");
  }

  const payload = result.result.value;
  const violations = payload.violations || [];

  if (violations.length > 0) {
    console.error(`axe found ${violations.length} violation(s) at ${payload.url}:\n`);
    console.error(formatViolations(violations));
    process.exitCode = 1;
  } else {
    console.log(`axe found 0 violations at ${payload.url}`);
  }
} finally {
  if (client) await client.close();
  chrome.kill();
}
