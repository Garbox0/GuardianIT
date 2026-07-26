import assert from "node:assert/strict";
import test from "node:test";
import {
  filterEndpointsByGroup,
  renderMonitoringReport,
  renderMonitoringReportHtml,
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
      failedChecks: 1,
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

test("separa el informe por grupo de cliente", () => {
  const endpoints = [
    ...sample,
    { name: "Web ajena", group: "Otro cliente", results: [] }
  ];

  assert.deepEqual(filterEndpointsByGroup(endpoints, "Cliente"), sample);
  assert.throws(
    () => filterEndpointsByGroup(endpoints, "Inexistente"),
    /No hay controles/
  );
});

test("usa la disponibilidad agregada de treinta días", () => {
  const [summary] = summarizeEndpoints([
    { ...sample[0], uptimePercentage: 99.75 }
  ]);

  assert.equal(summary.uptime, 99.75);
});

test("genera un HTML portable sin inyectar datos del cliente", () => {
  const html = renderMonitoringReportHtml(
    sample,
    "<script>alert(1)</script>",
    new Date("2026-07-25T12:00:00Z")
  );

  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
});
