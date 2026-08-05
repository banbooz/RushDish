import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("exports a self-contained RushDish site for the repository subpath", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

  assert.match(html, /<title>RushDish — QR ordering built for the rush<\/title>/i);
  assert.match(html, /https:\/\/banbooz\.github\.io\/RushDish\//);
  assert.match(html, /\/RushDish\/_next\/static\//);
  assert.match(html, /\/RushDish\/rushdish-logo-final\.png/);
  assert.match(html, /\/RushDish\/rushdish-order-qr\.png/);
  assert.doesNotMatch(html, /neotasticproductions|chatgpt\.site/i);

  await Promise.all([
    access(new URL("../out/404.html", import.meta.url)),
    access(new URL("../out/og-blue-carnival.png", import.meta.url)),
    access(new URL("../out/rushdish-logo-final.png", import.meta.url)),
    access(new URL("../out/rushdish-order-qr.png", import.meta.url)),
  ]);
});
