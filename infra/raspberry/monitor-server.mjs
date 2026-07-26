import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cacheControl, resolveRequestPath } from "./site-server.mjs";

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Referrer-Policy": "no-referrer",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY"
};

export function gatusProxyPath(pathname) {
  return pathname === "/api/v1/endpoints/statuses" ||
    /^\/api\/v1\/endpoints\/[^/]+\/uptimes\/30d$/.test(pathname)
    ? pathname
    : null;
}

async function proxyGatus(response, upstream) {
  try {
    const result = await fetch(upstream, { signal: AbortSignal.timeout(5000) });
    const body = await result.text();
    response.writeHead(result.status, {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8"
    }).end(body);
  } catch {
    response.writeHead(502, { "Content-Type": "application/json; charset=utf-8" })
      .end('{"error":"monitor unavailable"}');
  }
}

export function createMonitorServer({
  root = fileURLToPath(new URL("./monitor-dashboard", import.meta.url)),
  gatusBase = "http://127.0.0.1:8080"
} = {}) {
  return createServer(async (request, response) => {
    Object.entries(securityHeaders).forEach(([name, value]) => response.setHeader(name, value));
    if (!["GET", "HEAD"].includes(request.method || "")) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }

    const pathname = new URL(request.url || "/", "http://localhost").pathname;
    if (pathname === "/api/statuses") {
      if (request.method === "HEAD") response.writeHead(200, { "Cache-Control": "no-store" }).end();
      else await proxyGatus(response, `${gatusBase}/api/v1/endpoints/statuses`);
      return;
    }
    const proxiedPath = gatusProxyPath(pathname);
    if (proxiedPath) {
      if (request.method === "HEAD") response.writeHead(200, { "Cache-Control": "no-store" }).end();
      else await proxyGatus(response, `${gatusBase}${proxiedPath}`);
      return;
    }

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
      else createReadStream(file).pipe(response);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
    }
  });
}

export function startMonitorServer({
  host = process.env.HOST || "127.0.0.1",
  port = Number(process.env.PORT || 8091),
  root = process.env.MONITOR_ROOT,
  gatusBase = process.env.GATUS_BASE_URL
} = {}) {
  return createMonitorServer({
    ...(root ? { root: resolve(root) } : {}),
    ...(gatusBase ? { gatusBase } : {})
  }).listen(port, host);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startMonitorServer();
}
