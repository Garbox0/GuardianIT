import assert from "node:assert/strict";
import test from "node:test";
import {
  filterEndpointsByGroup,
  renderClientMessage,
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
      observation: "El control no respondió correctamente.",
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
  assert.match(html, /sólo ejecuta acciones previamente autorizadas/);
});

test("genera el mensaje exacto según el estado del cliente", () => {
  const failed = renderClientMessage(
    sample,
    "Estudio Norte",
    new Date("2026-07-25T12:00:00Z")
  );
  const healthy = renderClientMessage(
    [
      {
        name: "Web",
        group: "Cliente",
        uptimePercentage: 100,
        results: [{ success: true, timestamp: "2026-07-25T12:00:00Z" }]
      }
    ],
    "Estudio Norte",
    new Date("2026-07-25T12:00:00Z")
  );
  const recovered = renderClientMessage(
    [
      {
        name: "Web",
        group: "Cliente",
        uptimePercentage: 99.5,
        results: [
          { success: false, timestamp: "2026-07-25T11:00:00Z" },
          { success: true, timestamp: "2026-07-25T12:00:00Z" }
        ]
      }
    ],
    "Estudio Norte",
    new Date("2026-07-25T12:00:00Z")
  );

  assert.match(failed, /requieren atención/);
  assert.match(failed, /Web: El control no respondió correctamente/);
  assert.match(failed, /pediremos aprobación antes de ejecutarlo/);
  assert.match(healthy, /todos los servicios monitoreados están operativos/);
  assert.match(healthy, /No hay incidentes activos ni fallas recientes/);
  assert.match(recovered, /se observaron estos desvíos/);
  assert.match(recovered, /1 verificación reciente con falla/);
  assert.match(recovered, /No hay incidentes activos en este momento/);
});
