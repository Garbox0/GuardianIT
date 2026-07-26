import { escapeHtml } from "./consolidate.mjs";

function describeCondition(condition) {
  if (condition.includes("RESPONSE_TIME")) {
    return "El tiempo de respuesta superó el límite acordado.";
  }
  if (condition.includes("CERTIFICATE_EXPIRATION")) {
    return "El certificado HTTPS requiere atención.";
  }
  if (condition.includes("DOMAIN_EXPIRATION")) {
    return "El vencimiento del dominio requiere atención.";
  }
  if (condition.includes("BODY")) {
    return "El servicio respondió, pero no entregó el contenido esperado.";
  }
  if (condition.includes("STATUS")) {
    return "El servicio no devolvió la respuesta esperada.";
  }
  return "Un control técnico no se cumplió.";
}

export function summarizeEndpoints(endpoints) {
  if (!Array.isArray(endpoints)) {
    throw new TypeError("La respuesta de Gatus debe ser una lista");
  }

  return endpoints.map((endpoint) => {
    const results = Array.isArray(endpoint.results) ? endpoint.results : [];
    const successful = results.filter((result) => result.success).length;
    const failed = results.length - successful;
    const latest = results.at(-1);
    const measuredUptime = Number(endpoint.uptimePercentage);
    const failedConditions = Array.isArray(latest?.conditionResults)
      ? latest.conditionResults
          .filter((condition) => !condition.success)
          .map((condition) => describeCondition(condition.condition || ""))
      : [];
    const current = latest ? Boolean(latest.success) : null;

    return {
      name: endpoint.name || "Sin nombre",
      group: endpoint.group || "General",
      checks: results.length,
      failedChecks: failed,
      uptime: Number.isFinite(measuredUptime)
        ? measuredUptime
        : results.length
          ? (successful / results.length) * 100
          : 0,
      current,
      observation:
        current === null
          ? "Sin datos recientes."
          : current === false
            ? [...new Set(failedConditions)].join(" ") ||
              "El control no respondió correctamente."
            : failed
              ? "Se observaron fallas recientes; actualmente está operativo."
              : "Sin observaciones activas.",
      lastChecked: latest?.timestamp || null
    };
  });
}

export function filterEndpointsByGroup(endpoints, group) {
  if (!Array.isArray(endpoints)) {
    throw new TypeError("La respuesta de Gatus debe ser una lista");
  }
  if (!group) {
    throw new TypeError("El grupo del cliente es obligatorio");
  }

  const filtered = endpoints.filter((endpoint) => endpoint.group === group);
  if (!filtered.length) {
    throw new Error(`No hay controles para el grupo "${group}"`);
  }
  return filtered;
}

export function renderMonitoringReport(
  endpoints,
  clientName,
  generatedAt,
  period = "últimos 30 días"
) {
  const rows = summarizeEndpoints(endpoints);
  const incidents = rows.filter((row) => row.current === false);
  const failedChecks = rows.reduce((total, row) => total + row.failedChecks, 0);
  const date = generatedAt.toISOString();
  const table = rows
    .map(
      (row) =>
        `| ${row.name} | ${row.current === null ? "Sin datos" : row.current ? "Operativo" : "Con falla"} | ${row.uptime.toFixed(2)}% | ${row.failedChecks} | ${row.observation} |`
    )
    .join("\n");

return `# Informe de monitoreo — ${clientName}

**Generado:** ${date}

**Período:** ${period}

## Resumen

- Servicios controlados: ${rows.length}
- Incidentes activos: ${incidents.length}
- Verificaciones recientes con falla: ${failedChecks}
- Estado general: ${incidents.length ? "Requiere atención" : "Operativo"}

## Disponibilidad observada

| Control | Estado actual | Disponibilidad del período | Fallas recientes | Observación |
|---|---:|---:|---:|---|
${table || "| Sin controles | Sin datos | 0.00% | 0 | Sin observaciones |"}

## Próximas acciones

${incidents.length ? incidents.map((row) => `- Revisar ${row.group} / ${row.name}.`).join("\n") : "- No hay incidentes activos. Mantener seguimiento preventivo."}

> La disponibilidad proviene del historial agregado de Gatus. Las fallas
> recientes son muestras técnicas y sólo se informan como incidente después de
> validarlas.
`;
}

export function renderMonitoringReportHtml(
  endpoints,
  clientName,
  generatedAt,
  period = "Últimos 30 días"
) {
  const rows = summarizeEndpoints(endpoints);
  const activeIncidents = rows.filter((row) => row.current === false).length;
  const rowsHtml = rows
    .map(
      (row) => `<tr>
        <td>${escapeHtml(row.name)}</td>
        <td><span class="state ${row.current === false ? "down" : "up"}">${row.current === null ? "Sin datos" : row.current ? "Operativo" : "Con falla"}</span></td>
        <td>${row.uptime.toFixed(2)}%</td>
        <td>${row.failedChecks}</td>
        <td>${escapeHtml(row.observation)}</td>
      </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Monitoreo Guardián · ${escapeHtml(clientName)}</title>
<style>
:root{--ink:#10251f;--green:#0d8765;--lime:#c8ef62;--paper:#f5f3eb;--line:#d6ddd7;--muted:#61706b;--red:#a33a31}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.55 Segoe UI,Arial,sans-serif}
main{max-width:960px;margin:auto;padding:32px 24px 64px}.cover{padding:44px;border-radius:18px;background:var(--ink);color:#fff}
.brand{color:var(--lime);font:800 12px monospace;letter-spacing:.08em}.cover h1,h2{font-family:Georgia,serif;font-weight:500}
.cover h1{margin:24px 0 8px;font-size:clamp(38px,7vw,64px);line-height:1}.cover p{color:#c4d0cc}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:28px}.stats div{padding:16px;border:1px solid #365148;border-radius:10px}
.stats strong{display:block;font:500 30px Georgia,serif}.stats span{color:#aabbb5;font-size:12px}
section{margin-top:42px}h2{font-size:34px}.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:12px}
table{width:100%;border-collapse:collapse;background:#fff}th,td{padding:14px;text-align:left;border-bottom:1px solid var(--line)}
th{color:#fff;background:var(--ink);font-size:11px}.state{font-weight:700}.up{color:var(--green)}.down{color:var(--red)}
.note{padding:20px;border-radius:10px;background:#e5ebe6;color:var(--muted)}footer{margin-top:30px;color:var(--muted);font-size:12px}
@media(max-width:650px){main{padding:16px}.cover{padding:28px}.stats{grid-template-columns:1fr}}
@media print{body{background:#fff}main{max-width:none;padding:0}.cover{border-radius:0}}
</style>
</head>
<body><main>
  <header class="cover">
    <span class="brand">GUARDIÁN PYME · CONTINUIDAD</span>
    <h1>${escapeHtml(clientName)}</h1>
    <p>${escapeHtml(period)} · Generado ${escapeHtml(generatedAt.toLocaleString("es-AR"))}</p>
    <div class="stats">
      <div><strong>${rows.length}</strong><span>servicios controlados</span></div>
      <div><strong>${activeIncidents}</strong><span>incidentes activos</span></div>
      <div><strong>${rows.length ? (rows.reduce((total, row) => total + row.uptime, 0) / rows.length).toFixed(2) : "0.00"}%</strong><span>disponibilidad promedio</span></div>
    </div>
  </header>
  <section>
    <h2>Disponibilidad observada</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Control</th><th>Estado actual</th><th>Disponibilidad</th><th>Fallas recientes</th><th>Observación</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table></div>
  </section>
  <section class="note"><strong>Lectura del informe.</strong> La disponibilidad proviene del historial agregado de Gatus. Una falla técnica se comunica como incidente sólo después de validarla. Este informe no garantiza disponibilidad permanente ni ausencia de incidentes.</section>
  <footer>Guardián PyME · Informe individual para ${escapeHtml(clientName)}</footer>
</main></body></html>`;
}

export function renderClientMessage(
  endpoints,
  clientName,
  generatedAt,
  period = "los últimos 30 días"
) {
  const rows = summarizeEndpoints(endpoints);
  const attention = rows.filter((row) => row.current !== true);
  const observations = rows.filter(
    (row) => row.current === true && (row.failedChecks > 0 || row.uptime < 100)
  );
  const average = rows.length
    ? rows.reduce((total, row) => total + row.uptime, 0) / rows.length
    : 0;
  const date = generatedAt.toLocaleDateString("es-AR");

  if (attention.length) {
    return `Hola. Detectamos controles que requieren atención en ${clientName}.

Estado al ${date}:
${attention.map((row) => `- ${row.name}: ${row.observation}`).join("\n")}

Estamos verificando el alcance y la causa. Te avisaremos cuando confirmemos la recuperación o tengamos una acción recomendada.

Adjuntamos el informe completo con la evidencia disponible.

Guardián PyME`;
  }

  if (observations.length) {
    return `Hola. Te compartimos el informe de continuidad de ${clientName}, correspondiente a ${period}.

Estado actual: todos los servicios monitoreados están operativos.
Disponibilidad promedio observada: ${average.toFixed(2)}%.

Durante el período se observaron estos desvíos:
${observations.map((row) => `- ${row.name}: ${row.uptime.toFixed(2)}% de disponibilidad${row.failedChecks ? ` y ${row.failedChecks} ${row.failedChecks === 1 ? "verificación reciente con falla" : "verificaciones recientes con falla"}` : ""}.`).join("\n")}

No hay incidentes activos en este momento. Adjuntamos el informe completo con el detalle y las próximas acciones, si correspondieran.

Guardián PyME`;
  }

  return `Hola. Te compartimos el informe de continuidad de ${clientName}, correspondiente a ${period}.

Estado actual: todos los servicios monitoreados están operativos.
Disponibilidad promedio observada: ${average.toFixed(2)}%.
No hay incidentes activos ni fallas recientes que requieran una acción.

Adjuntamos el informe completo para tu registro.

Guardián PyME`;
}
