import assert from "node:assert/strict";
import test from "node:test";
import {
  consolidateReports,
  renderConsolidatedReport
} from "../lib/consolidate.mjs";

const report = (computer, evidence) => ({
  Computer: { Name: computer },
  Findings: [
    {
      Control: "Backup",
      Status: "No verificable",
      Severity: "Alta",
      Evidence: evidence,
      Recommendation: "Probar una restauración."
    },
    {
      Control: "Firewall",
      Status: "Correcto",
      Severity: "Informativa",
      Evidence: "Activo",
      Recommendation: "Sin acción."
    }
  ]
});

test("agrupa prioridades repetidas y conserva los equipos afectados", () => {
  const result = consolidateReports([
    report("PC-01", "Sin prueba"),
    report("PC-02", "Copia antigua")
  ]);

  assert.equal(result.priorities.length, 1);
  assert.deepEqual(result.priorities[0].Computers, ["PC-01", "PC-02"]);
});

test("genera HTML portable y escapa datos del cliente", () => {
  const html = renderConsolidatedReport(
    [report("PC-01", "Sin prueba")],
    "<script>alert(1)</script>",
    new Date("2026-07-25T12:00:00Z")
  );

  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>alert/);
  assert.match(html, /Decisiones prioritarias/);
});
