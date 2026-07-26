import { domainToASCII } from "node:url";

function finding(control, status, severity, evidence, recommendation) {
  return { Control: control, Status: status, Severity: severity, Evidence: evidence, Recommendation: recommendation };
}

export function normalizeDomain(value) {
  const domain = domainToASCII(String(value || "").trim().toLowerCase().replace(/\.$/, ""));
  if (
    !domain ||
    domain.length > 253 ||
    !domain.includes(".") ||
    domain.split(".").some((label) => !label || label.length > 63 || !/^[a-z0-9-]+$/.test(label) || label.startsWith("-") || label.endsWith("-"))
  ) {
    throw new TypeError("Dominio inválido");
  }
  return domain;
}

export function assessDomain(input) {
  const findings = [];
  const hasMail = input.mx.length > 0;
  const spf = input.rootTxt.find((record) => record.toLowerCase().startsWith("v=spf1"));
  const dmarc = input.dmarcTxt.find((record) => record.toLowerCase().startsWith("v=dmarc1"));
  const dmarcPolicy = dmarc?.match(/(?:^|;)\s*p=([^;\s]+)/i)?.[1]?.toLowerCase();

  findings.push(
    hasMail
      ? finding("Correo (MX)", "Detectado", "Informativa", input.mx.map((record) => `${record.exchange} (${record.priority})`).join(", "), "Confirmar que todos los proveedores sigan en uso.")
      : finding("Correo (MX)", "No detectado", "Informativa", "El dominio no publica servidores MX.", "Sin acción si el dominio no recibe correo.")
  );

  if (hasMail && !spf) {
    findings.push(finding("SPF", "Ausente", "Alta", "No se encontró un registro SPF.", "Publicar una política SPF que incluya únicamente los emisores autorizados."));
  } else if (spf) {
    findings.push(finding("SPF", "Detectado", "Informativa", spf, "Revisar que no autorice proveedores retirados."));
  }

  if (hasMail && !dmarc) {
    findings.push(finding("DMARC", "Ausente", "Alta", "No se encontró _dmarc.", "Publicar DMARC con reportes y avanzar gradualmente hacia quarantine o reject."));
  } else if (dmarcPolicy === "none") {
    findings.push(finding("DMARC", "Sólo monitoreo", "Media", dmarc, "Analizar reportes y planificar una política quarantine o reject."));
  } else if (dmarc) {
    findings.push(finding("DMARC", "Protección activa", "Informativa", dmarc, "Mantener reportes y revisar fuentes legítimas."));
  }

  const certificateDays = input.certificateDays;
  if (certificateDays === null) {
    findings.push(finding("Certificado HTTPS", "No verificable", "Alta", input.certificateError || "No se pudo negociar TLS.", "Revisar publicación HTTPS y cadena del certificado."));
  } else if (certificateDays < 14) {
    findings.push(finding("Certificado HTTPS", "Próximo a vencer", "Alta", `Vence en ${certificateDays} días.`, "Renovar y comprobar la cadena antes del vencimiento."));
  } else if (certificateDays < 30) {
    findings.push(finding("Certificado HTTPS", "Atención", "Media", `Vence en ${certificateDays} días.`, "Confirmar renovación automática."));
  } else {
    findings.push(finding("Certificado HTTPS", "Correcto", "Informativa", `Vence en ${certificateDays} días.`, "Mantener renovación automática."));
  }

  const headers = new Map(
    Object.entries(input.headers || {}).map(([name, value]) => [name.toLowerCase(), value])
  );
  for (const [name, label] of [
    ["strict-transport-security", "HSTS"],
    ["content-security-policy", "Content Security Policy"],
    ["x-content-type-options", "Protección MIME"],
    ["referrer-policy", "Política de referencia"]
  ]) {
    findings.push(
      headers.has(name)
        ? finding(label, "Presente", "Informativa", String(headers.get(name)), "Mantener y revisar al cambiar la aplicación.")
        : finding(label, "Ausente", "Media", `No se recibió la cabecera ${name}.`, "Agregarla después de validar compatibilidad.")
    );
  }

  findings.push(
    input.caa.length
      ? finding("CAA", "Detectado", "Informativa", input.caa.map((record) => `${record.tag} ${record.value}`).join(", "), "Confirmar que sólo autorice emisores utilizados.")
      : finding("CAA", "Ausente", "Informativa", "No se encontraron registros CAA.", "Evaluar restringir qué autoridades pueden emitir certificados.")
  );

  return findings;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderDomainReport(domain, findings, generatedAt = new Date()) {
  const high = findings.filter((item) => item.Severity === "Alta").length;
  const medium = findings.filter((item) => item.Severity === "Media").length;
  const rows = findings.map((item) => `<tr><td>${escapeHtml(item.Control)}</td><td>${escapeHtml(item.Status)}</td><td>${escapeHtml(item.Severity)}</td><td>${escapeHtml(item.Evidence)}</td><td>${escapeHtml(item.Recommendation)}</td></tr>`).join("");

  return `<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Postura externa · ${escapeHtml(domain)}</title><style>
body{max-width:1100px;margin:40px auto;padding:0 24px;color:#10251f;background:#f5f3eb;font:15px/1.5 Segoe UI,Arial,sans-serif}header{padding:42px;border-radius:16px;color:#fff;background:#10251f}h1,h2{font-family:Georgia,serif;font-weight:500}h1{margin:18px 0 8px;font-size:48px}.brand{color:#c8ef62;font:800 12px monospace}.stats{display:flex;gap:12px;margin-top:24px}.stats span{padding:10px 14px;border:1px solid #365148;border-radius:8px}section{margin-top:38px}.table{overflow:auto;border:1px solid #d6ddd7;border-radius:12px}table{width:100%;border-collapse:collapse;background:#fff}th,td{padding:13px;text-align:left;vertical-align:top;border-bottom:1px solid #d6ddd7}th{color:#fff;background:#174f3b;font-size:11px}.note{color:#61706b}@media(max-width:650px){body{margin:18px auto}header{padding:28px}.stats{flex-direction:column}h1{font-size:38px}}@media print{body{margin:0;background:#fff}header{border-radius:0}}
</style></head><body><header><span class="brand">GUARDIÁN PYME · POSTURA EXTERNA</span><h1>${escapeHtml(domain)}</h1><p>Revisión pública generada el ${escapeHtml(generatedAt.toLocaleDateString("es-AR"))}</p><div class="stats"><span>Prioridades altas: <strong>${high}</strong></span><span>Prioridades medias: <strong>${medium}</strong></span><span>Controles: <strong>${findings.length}</strong></span></div></header><section><h2>Controles observados</h2><div class="table"><table><thead><tr><th>Control</th><th>Estado</th><th>Prioridad</th><th>Evidencia</th><th>Próximo paso</th></tr></thead><tbody>${rows}</tbody></table></div></section><p class="note">Esta revisión usa información pública y no es un pentest. La presencia de registros o cabeceras no garantiza que su configuración sea completa.</p></body></html>`;
}
