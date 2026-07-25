export function summarizeEndpoints(endpoints) {
  if (!Array.isArray(endpoints)) {
    throw new TypeError("La respuesta de Gatus debe ser una lista");
  }

  return endpoints.map((endpoint) => {
    const results = Array.isArray(endpoint.results) ? endpoint.results : [];
    const successful = results.filter((result) => result.success).length;
    const latest = results.at(-1);

    return {
      name: endpoint.name || "Sin nombre",
      group: endpoint.group || "General",
      checks: results.length,
      uptime: results.length ? (successful / results.length) * 100 : 0,
      current: latest ? Boolean(latest.success) : null,
      lastChecked: latest?.timestamp || null
    };
  });
}

export function renderMonitoringReport(endpoints, clientName, generatedAt) {
  const rows = summarizeEndpoints(endpoints);
  const incidents = rows.filter((row) => row.current === false);
  const date = generatedAt.toISOString();
  const table = rows
    .map(
      (row) =>
        `| ${row.group} | ${row.name} | ${row.current === null ? "Sin datos" : row.current ? "Operativo" : "Con falla"} | ${row.uptime.toFixed(2)}% | ${row.checks} |`
    )
    .join("\n");

  return `# Informe de monitoreo — ${clientName}

**Generado:** ${date}

## Resumen

- Servicios controlados: ${rows.length}
- Incidentes activos: ${incidents.length}
- Estado general: ${incidents.length ? "Requiere atención" : "Operativo"}

## Disponibilidad observada

| Grupo | Control | Estado actual | Disponibilidad | Muestras |
|---|---|---:|---:|---:|
${table || "| — | Sin controles | Sin datos | 0.00% | 0 |"}

## Próximas acciones

${incidents.length ? incidents.map((row) => `- Revisar ${row.group} / ${row.name}.`).join("\n") : "- No hay incidentes activos. Mantener seguimiento preventivo."}

> La disponibilidad se calcula sobre las muestras conservadas por el nodo y no reemplaza una auditoría técnica.
`;
}
