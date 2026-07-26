import assert from "node:assert/strict";
import { test } from "node:test";
import { resolve } from "node:path";
import {
  cacheControl,
  httpsLocation,
  resolveRequestPath
} from "../infra/raspberry/site-server.mjs";

test("site server confines requests to the public directory", () => {
  const root = resolve("public");
  assert.equal(resolveRequestPath(root, "/"), resolve(root, "index.html"));
  assert.equal(
    resolveRequestPath(root, "/_next/static/app.js"),
    resolve(root, "_next/static/app.js")
  );
  assert.equal(resolveRequestPath(root, "/../secret"), null);
  assert.equal(resolveRequestPath(root, "/%2e%2e/secret"), null);
  assert.equal(resolveRequestPath(root, "/%E0%A4%A"), null);
});

test("site server redirects only known public hosts to HTTPS", () => {
  assert.equal(
    httpsLocation({
      headers: { host: "aerosftp.com", "x-forwarded-proto": "http" },
      url: "/contacto?origen=web"
    }),
    "https://aerosftp.com/contacto?origen=web"
  );
  assert.equal(
    httpsLocation({
      headers: { host: "otro.example", "x-forwarded-proto": "http" },
      url: "/"
    }),
    null
  );
});

test("site server caches assets without making HTML stale", () => {
  assert.equal(cacheControl("/"), "no-cache");
  assert.equal(cacheControl("/centro-guardian.html"), "no-cache");
  assert.equal(
    cacheControl("/centro-guardian.css"),
    "public, max-age=3600, stale-while-revalidate=86400"
  );
  assert.equal(
    cacheControl("/_next/static/chunks/app-abc.js"),
    "public, max-age=31536000, immutable"
  );
});
