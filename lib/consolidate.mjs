const severityRank = { Informativa: 0, Media: 1, Alta: 2 };

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function validateReport(report) {
  if (
    !report ||
    typeof report !== "object" ||
    !report.Computer?.Name ||
    !Array.isArray(report.Findings)
  ) {
    throw new TypeError("El JSON no es un diagnóstico Guardián válido");
  }
  return report;
}

export function consolidateReports(reports) {
  const validReports = reports.map(validateReport);
  const findings = validReports.flatMap((report) =>
    report.Findings.map((finding) => ({
      ...finding,
      Computer: report.Computer.Name
    }))
  );
  const grouped = new Map();

  for (const finding of findings.filter(
    (item) => severityRank[item.Severity] > 0
  )) {
    const key = `${finding.Control}\u0000${finding.Recommendation}`;
    const current = grouped.get(key) || {
      Control: finding.Control,
      Severity: finding.Severity,
      Recommendation: finding.Recommendation,
      Computers: new Set(),
      Evidence: []
    };
    if (severityRank[finding.Severity] > severityRank[current.Severity]) {
      current.Severity = finding.Severity;
    }
    current.Computers.add(finding.Computer);
    current.Evidence.push(`${finding.Computer}: ${finding.Evidence}`);
    grouped.set(key, current);
  }

  const priorities = [...grouped.values()]
    .sort(
      (left, right) =>
        severityRank[right.Severity] - severityRank[left.Severity] ||
        left.Control.localeCompare(right.Control, "es")
    )
    .slice(0, 5)
    .map((priority) => ({
      ...priority,
      Computers: [...priority.Computers],
      Evidence: [...new Set(priority.Evidence)]
    }));

  return {
    computers: validReports.map((report) => report.Computer.Name),
    findings,
    priorities
  };
}

export function renderConsolidatedReport(
  reports,
  clientName,
  generatedAt = new Date()
) {
  const result = consolidateReports(reports);
  const high = result.priorities.filter(
    (priority) => priority.Severity === "Alta"
  ).length;
  const medium = result.priorities.filter(
    (priority) => priority.Severity === "Media"
  ).length;
  const priorityCards = result.priorities
    .map(
      (priority, index) => `
        <article class="priority">
          <span class="badge ${priority.Severity === "Alta" ? "high" : "medium"}">${escapeHtml(priority.Severity)}</span>
          <div>
            <small>PRIORIDAD ${String(index + 1).padStart(2, "0")} · ${escapeHtml(priority.Computers.join(", "))}</small>
            <h3>${escapeHtml(priority.Control)}</h3>
            <p>${escapeHtml(priority.Evidence.join(" · "))}</p>
            <strong>Próximo paso: ${escapeHtml(priority.Recommendation)}</strong>
          </div>
        </article>`
    )
    .join("");
  const rows = result.findings
    .map(
      (finding) => `
        <tr>
          <td>${escapeHtml(finding.Computer)}</td>
          <td>${escapeHtml(finding.Control)}</td>
          <td>${escapeHtml(finding.Status)}</td>
          <td>${escapeHtml(finding.Severity)}</td>
          <td>${escapeHtml(finding.Evidence)}</td>
        </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Diagnóstico Guardián · ${escapeHtml(clientName)}</title>
<style>
:root{--ink:#10251f;--green:#174f3b;--lime:#c8ef62;--paper:#f5f3eb;--line:#d6ddd7;--muted:#61706b}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.55 Segoe UI,Arial,sans-serif}
main{max-width:1050px;margin:auto;padding:36px 28px 72px}.cover{padding:52px;border-radius:18px;background:var(--ink);color:#fff}
.brand{color:var(--lime);font:800 12px/1 monospace;letter-spacing:.08em}.cover h1,h2,h3{font-family:Georgia,serif;font-weight:500}
.cover h1{max-width:760px;margin:28px 0 12px;font-size:clamp(42px,7vw,72px);line-height:1}.cover p{color:#c4d0cc}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:34px}.stats div{padding:18px;border:1px solid #365148;border-radius:10px}
.stats strong{display:block;font:500 32px Georgia,serif}.stats span{color:#aabbb5;font-size:12px}
section{margin-top:48px}h2{font-size:38px}.priority{display:grid;grid-template-columns:100px 1fr;gap:18px;padding:25px 0;border-top:1px solid var(--line)}
.badge{width:max-content;height:max-content;padding:6px 9px;border-radius:4px;font-size:10px;font-weight:900}.high{color:#9a3128;background:#f7ddd8}.medium{color:#965313;background:#f6e6ce}
.priority small{color:var(--green);font:700 11px monospace}.priority h3{margin:8px 0;font-size:26px}.priority p{color:var(--muted)}
.priority strong{display:block;padding-left:14px;border-left:3px solid var(--lime);font-size:14px}
.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:12px}table{width:100%;border-collapse:collapse;background:#fff}
th,td{padding:13px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}th{color:#fff;background:var(--ink);font-size:11px}
.note{padding:22px;border-radius:10px;background:#e5ebe6;color:var(--muted)}footer{margin-top:34px;color:var(--muted);font-size:12px}
@media(max-width:650px){main{padding:18px}.cover{padding:30px}.stats{grid-template-columns:1fr}.priority{grid-template-columns:1fr}}
@media print{body{background:#fff}main{max-width:none;padding:0}.cover{border-radius:0}section{break-inside:avoid}}
</style>
</head>
<body><main>
  <header class="cover">
    <span class="brand">GUARDIÁN PYME · DIAGNÓSTICO OPERATIVO</span>
    <h1>${escapeHtml(clientName)}</h1>
    <p>Informe consolidado de revisión preventiva · ${escapeHtml(generatedAt.toLocaleDateString("es-AR"))}</p>
    <div class="stats">
      <div><strong>${result.computers.length}</strong><span>equipos relevados</span></div>
      <div><strong>${high}</strong><span>prioridades altas</span></div>
      <div><strong>${medium}</strong><span>prioridades medias</span></div>
    </div>
  </header>
  <section>
    <h2>Decisiones prioritarias</h2>
    ${priorityCards || "<p>No se detectaron prioridades altas o medias en los controles automatizados.</p>"}
  </section>
  <section>
    <h2>Evidencia técnica</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Equipo</th><th>Control</th><th>Estado</th><th>Prioridad</th><th>Evidencia</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </section>
  <section class="note"><strong>Alcance y límites.</strong> Revisión de solo lectura. No constituye una prueba de penetración ni garantiza la ausencia de fallas. Un backup sólo se considera verificable después de una restauración de prueba.</section>
  <footer>Generado por Guardián PyME · Revisado antes de su entrega al cliente.</footer>
</main></body></html>`;
}
