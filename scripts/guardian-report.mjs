import {
  filterEndpointsByGroup,
  renderMonitoringReport,
  renderMonitoringReportHtml
} from "../lib/monitoring.mjs";

const baseUrl = process.argv[2] || process.env.GUARDIAN_GATUS_URL;
const clientName =
  process.argv[3] || process.env.GUARDIAN_CLIENT_NAME || "Cliente";
const clientGroup = process.argv[4] || process.env.GUARDIAN_GATUS_GROUP;
const html = process.argv[5] === "--html";

if (!baseUrl || !clientGroup) {
  console.error(
    "Uso: npm run report -- http://100.80.237.96:8080 \"Nombre del cliente\" \"Grupo exacto en Gatus\""
  );
  process.exit(1);
}

const endpoint = new URL(
  "api/v1/endpoints/statuses",
  `${baseUrl.replace(/\/+$/, "")}/`
);
const response = await fetch(endpoint, { signal: AbortSignal.timeout(10_000) });

if (!response.ok) {
  throw new Error(`Gatus respondió HTTP ${response.status}`);
}

const endpoints = filterEndpointsByGroup(await response.json(), clientGroup);
const endpointsWithUptime = await Promise.all(
  endpoints.map(async (monitoredEndpoint) => {
    const uptimeUrl = new URL(
      `api/v1/endpoints/${encodeURIComponent(monitoredEndpoint.key)}/uptimes/30d`,
      `${baseUrl.replace(/\/+$/, "")}/`
    );
    const uptimeResponse = await fetch(uptimeUrl, {
      signal: AbortSignal.timeout(10_000)
    });
    if (!uptimeResponse.ok) {
      throw new Error(
        `No se pudo obtener disponibilidad de ${monitoredEndpoint.name}`
      );
    }
    const uptime = Number(await uptimeResponse.text());
    if (!Number.isFinite(uptime) || uptime < 0 || uptime > 1) {
      throw new Error(`Disponibilidad inválida para ${monitoredEndpoint.name}`);
    }
    return { ...monitoredEndpoint, uptimePercentage: uptime * 100 };
  })
);

console.log(
  html
    ? renderMonitoringReportHtml(endpointsWithUptime, clientName, new Date())
    : renderMonitoringReport(endpointsWithUptime, clientName, new Date())
);
