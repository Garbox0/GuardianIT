import assert from "node:assert/strict";
import test from "node:test";
import {
  renderMonitoringReport,
  summarizeEndpoints
} from "../lib/monitoring.mjs";

const sample = [
  {
    name: "Web",
    group: "Cliente",
    results: [
      { success: true, timestamp: "2026-07-25T10:00:00Z" },
      { success: false, timestamp: "2026-07-25T10:01:00Z" }
    ]
  }
];

test("resume disponibilidad y estado actual", () => {
  assert.deepEqual(summarizeEndpoints(sample), [
    {
      name: "Web",
      group: "Cliente",
      checks: 2,
      uptime: 50,
      current: false,
      lastChecked: "2026-07-25T10:01:00Z"
    }
  ]);
});

test("genera un informe accionable", () => {
  const report = renderMonitoringReport(
    sample,
    "Estudio Norte",
    new Date("2026-07-25T12:00:00Z")
  );

  assert.match(report, /Incidentes activos: 1/);
  assert.match(report, /Revisar Cliente \/ Web/);
});
