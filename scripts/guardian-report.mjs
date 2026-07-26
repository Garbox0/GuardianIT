import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  filterEndpointsByGroup,
  renderClientMessage,
  renderMonitoringReport,
  renderMonitoringReportHtml
} from "../lib/monitoring.mjs";

const baseUrl = process.argv[2] || process.env.GUARDIAN_GATUS_URL;
const clientName =
  process.argv[3] || process.env.GUARDIAN_CLIENT_NAME || "Cliente";
const clientGroup = process.argv[4] || process.env.GUARDIAN_GATUS_GROUP;
const options = process.argv.slice(5);
const exportIndex = options.indexOf("--export");
const exportDirectory =
  exportIndex >= 0 ? options[exportIndex + 1] : undefined;

if (!baseUrl || !clientGroup || (exportIndex >= 0 && !exportDirectory)) {
  console.error(
    "Uso: npm run report -- URL \"Nombre\" \"Grupo\" [--html|--message|--export \"carpeta\"]"
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

const generatedAt = new Date();
const htmlReport = renderMonitoringReportHtml(
  endpointsWithUptime,
  clientName,
  generatedAt
);
const clientMessage = renderClientMessage(
  endpointsWithUptime,
  clientName,
  generatedAt
);

if (exportDirectory) {
  const directory = resolve(exportDirectory);
  const stamp = generatedAt.toISOString().replaceAll(":", "-").replace(".", "-");
  const reportPath = resolve(directory, `informe-monitoreo-${stamp}.html`);
  const messagePath = resolve(directory, `mensaje-cliente-${stamp}.txt`);
  await mkdir(directory, { recursive: true });
  await Promise.all([
    writeFile(reportPath, htmlReport, { encoding: "utf8", flag: "wx" }),
    writeFile(messagePath, clientMessage, { encoding: "utf8", flag: "wx" })
  ]);
  console.log(`Exportación lista:
Informe completo: ${reportPath}
Mensaje para enviar: ${messagePath}`);
} else if (options.includes("--message")) {
  console.log(clientMessage);
} else if (options.includes("--html")) {
  console.log(htmlReport);
} else {
  console.log(
    renderMonitoringReport(endpointsWithUptime, clientName, generatedAt)
  );
}
