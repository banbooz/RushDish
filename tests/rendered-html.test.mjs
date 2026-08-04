import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html", host: "localhost" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete RushDish landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>RushDish — QR ordering built for the rush<\/title>/i);
  assert.match(html, /Feed the crowd\./);
  assert.match(html, /Lose the queue\./);
  assert.match(html, /See the whole rush in one screen\./);
  assert.match(html, /Perrett&amp;Thompson/);
  assert.doesNotMatch(html, />FIREBIRD</);
  assert.match(html, /Clear costs\. No cut of your sales\./);
  assert.match(html, /Good questions\./);
  assert.match(html, /Scan once\./);
  assert.match(html, /£200/);
  assert.match(html, /£20/);
  assert.match(html, /£500 upfront build cost/);
  assert.match(html, /RECOMMENDED/);
  assert.match(html, /0% platform fee/);
  assert.match(html, /0% commission fee/);
  assert.doesNotMatch(html, /Download QR code|download-ready|What could a shorter queue be worth\?|Working product concept/i);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("ships project-specific metadata and removes starter assets", async () => {
  const [layout, page, packageJson, qrBytes] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../public/rushdish-order-qr.png", import.meta.url)),
  ]);

  assert.match(layout, /RushDish — QR ordering built for the rush/);
  assert.match(layout, /\/og\.png/);
  assert.match(page, /"use client"/);
  assert.match(page, /Send test order/);
  assert.doesNotMatch(page, /download=|Download QR code|calculator-section|MOST POPULAR/);
  assert.match(page, /Higher-quality menu and QR design/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.equal(
    createHash("sha256").update(qrBytes).digest("hex").toUpperCase(),
    "347D9E363AF68CC8533B4FDB5FCF60E5978994078B9D494030E42C632FCEDFC7",
  );
  await access(new URL("../public/og.png", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
