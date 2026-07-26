import { resolveCaa, resolveMx, resolveTxt } from "node:dns/promises";
import { mkdir, writeFile } from "node:fs/promises";
import { connect } from "node:tls";
import { resolve } from "node:path";
import {
  assessDomain,
  normalizeDomain,
  renderDomainReport
} from "../lib/domain-audit.mjs";

const domain = normalizeDomain(process.argv[2]);
const outputDirectory = resolve(process.argv[3] || "guardian-domain-report");

async function optional(query) {
  try {
    return await query();
  } catch (error) {
    if (["ENODATA", "ENOTFOUND"].includes(error.code)) return [];
    throw error;
  }
}

async function certificateDays(host) {
  return new Promise((resolveCertificate) => {
    const socket = connect(
      { host, port: 443, servername: host, timeout: 10_000 },
      () => {
        const certificate = socket.getPeerCertificate();
        const validTo = Date.parse(certificate.valid_to);
        socket.end();
        resolveCertificate({
          days: Number.isFinite(validTo)
            ? Math.floor((validTo - Date.now()) / 86_400_000)
            : null,
          error: Number.isFinite(validTo) ? null : "El certificado no informó vencimiento."
        });
      }
    );
    socket.on("timeout", () => socket.destroy(new Error("Tiempo de espera TLS agotado.")));
    socket.on("error", (error) =>
      resolveCertificate({ days: null, error: error.message })
    );
  });
}

const [mx, rootTxtParts, dmarcTxtParts, caa, webResponse, httpResponse, certificate] =
  await Promise.all([
    optional(() => resolveMx(domain)),
    optional(() => resolveTxt(domain)),
    optional(() => resolveTxt(`_dmarc.${domain}`)),
    optional(() => resolveCaa(domain)),
    fetch(`https://${domain}`, {
      redirect: "follow",
      signal: AbortSignal.timeout(10_000)
    }).catch(() => null),
    fetch(`http://${domain}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(10_000)
    }).catch(() => null),
    certificateDays(domain)
  ]);

const input = {
  mx,
  rootTxt: rootTxtParts.map((parts) => parts.join("")),
  dmarcTxt: dmarcTxtParts.map((parts) => parts.join("")),
  caa,
  headers: webResponse ? Object.fromEntries(webResponse.headers) : {},
  httpStatus: httpResponse?.status ?? null,
  httpLocation: httpResponse?.headers.get("location") || "",
  certificateDays: certificate.days,
  certificateError: certificate.error
};
const findings = assessDomain(input);
const safeDomain = domain.replaceAll(".", "-");

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    resolve(outputDirectory, `${safeDomain}.json`),
    JSON.stringify({ Version: "1.1", Domain: domain, GeneratedAt: new Date().toISOString(), Findings: findings }, null, 2),
    "utf8"
  ),
  writeFile(
    resolve(outputDirectory, `${safeDomain}.html`),
    renderDomainReport(domain, findings),
    "utf8"
  )
]);

console.log(`Informe HTML: ${resolve(outputDirectory, `${safeDomain}.html`)}`);
console.log(`Evidencia JSON: ${resolve(outputDirectory, `${safeDomain}.json`)}`);
