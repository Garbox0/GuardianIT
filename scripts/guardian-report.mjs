import { renderMonitoringReport } from "../lib/monitoring.mjs";

const baseUrl = process.argv[2] || process.env.GUARDIAN_GATUS_URL;
const clientName =
  process.argv[3] || process.env.GUARDIAN_CLIENT_NAME || "Cliente";

if (!baseUrl) {
  console.error(
    "Uso: npm run report -- http://100.80.237.96:8080 \"Nombre del cliente\""
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

console.log(
  renderMonitoringReport(await response.json(), clientName, new Date())
);
