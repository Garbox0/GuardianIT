import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDashboardModel } from "../infra/raspberry/monitor-dashboard/dashboard.js";
import {
  filesystemUsage,
  gatusProxyPath,
  monitorCacheControl
} from "../infra/raspberry/monitor-server.mjs";

const endpoint = (group, name, success, timestamp, duration = 20_000_000) => ({
  group,
  name,
  results: [{ success, timestamp, duration, hostname: "example.com" }]
});

test("separa clientes de infraestructura y resume fallas reales", () => {
  const model = buildDashboardModel([
    endpoint("Cliente Norte", "Sitio", true, "2026-07-26T12:00:00Z"),
    endpoint("Cliente Norte", "Backup", false, "2026-07-26T12:01:00Z"),
    endpoint("Infraestructura", "Motor", true, "2026-07-26T12:02:00Z")
  ]);

  assert.equal(model.clients.length, 1);
  assert.equal(model.clients[0].name, "Cliente Norte");
  assert.equal(model.clients[0].failures, 1);
  assert.equal(model.platform.services.length, 1);
  assert.equal(model.failures, 1);
  assert.equal(model.serviceCount, 3);
  assert.equal(model.lastTimestamp, "2026-07-26T12:02:00Z");
});

test("el proxy conserva sólo las rutas necesarias para informes", () => {
  assert.equal(gatusProxyPath("/api/v1/endpoints/statuses"), "/api/v1/endpoints/statuses");
  assert.equal(
    gatusProxyPath("/api/v1/endpoints/cliente_web/uptimes/30d"),
    "/api/v1/endpoints/cliente_web/uptimes/30d"
  );
  assert.equal(gatusProxyPath("/api/v1/config"), null);
  assert.equal(gatusProxyPath("/api/v1/endpoints/key/uptimes/7d"), null);
});

test("calcula uso de disco con los bloques disponibles del sistema", () => {
  assert.deepEqual(
    filesystemUsage({ blocks: 100, bfree: 25, bavail: 20, bsize: 1024 }),
    { total: 102400, used: 76800, free: 20480, usedPercent: 75 }
  );
});

test("no cachea assets que deban mantenerse sincronizados", () => {
  assert.match(monitorCacheControl(), /no-store/);
});
