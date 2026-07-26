import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

export function resolveRequestPath(root, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (decoded.includes("\0") || decoded.split("/").includes("..")) return null;

  const relative = decoded.replace(/^\/+/, "") || "index.html";
  const absolute = resolve(root, relative);
  const absoluteRoot = resolve(root);
  return absolute === absoluteRoot || absolute.startsWith(`${absoluteRoot}${sep}`)
    ? absolute
    : null;
}

export function httpsLocation({ headers, url }) {
  const host = String(headers.host || "").split(":")[0].toLowerCase();
  return headers["x-forwarded-proto"] === "http" &&
    ["aerosftp.com", "www.aerosftp.com"].includes(host)
    ? `https://${host}${url || "/"}`
    : null;
}

export function cacheControl(pathname) {
  if (pathname.startsWith("/_next/static/")) {
    return "public, max-age=31536000, immutable";
  }
  if (/\.(?:css|ico|js|png|svg|webp)$/.test(pathname)) {
    return "public, max-age=3600, stale-while-revalidate=86400";
  }
  return "no-cache";
}

export function startServer({
  root = process.env.SITE_ROOT || fileURLToPath(new URL("./public", import.meta.url)),
  host = process.env.HOST || "127.0.0.1",
  port = Number(process.env.PORT || 8090)
} = {}) {
  return createServer(async (request, response) => {
    response.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
    response.setHeader("Permissions-Policy", "camera=(), geolocation=(), microphone=()");
    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");

    const redirect = httpsLocation(request);
    if (redirect) {
      response.writeHead(308, { Location: redirect }).end();
      return;
    }

    if (request.method === "OPTIONS") {
      response.writeHead(204).end();
      return;
    }
    if (!["GET", "HEAD"].includes(request.method || "")) {
      response.writeHead(405, { Allow: "GET, HEAD, OPTIONS" }).end();
      return;
    }

    const pathname = new URL(request.url || "/", "http://localhost").pathname;
    const file = resolveRequestPath(root, pathname);
    if (!file) {
      response.writeHead(400).end("Bad request");
      return;
    }

    try {
      const info = await stat(file);
      if (!info.isFile()) throw new Error("Not a file");
      response.writeHead(200, {
        "Cache-Control": cacheControl(pathname),
        "Content-Length": info.size,
        "Content-Type": MIME[extname(file)] || "application/octet-stream"
      });
      if (request.method === "HEAD") response.end();
      else {
        const stream = createReadStream(file);
        stream.on("error", () => response.destroy());
        stream.pipe(response);
      }
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
    }
  }).listen(port, host);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startServer();
}
