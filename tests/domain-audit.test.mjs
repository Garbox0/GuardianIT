import assert from "node:assert/strict";
import test from "node:test";
import {
  assessDomain,
  normalizeDomain,
  renderDomainReport
} from "../lib/domain-audit.mjs";

test("normaliza dominios y rechaza URLs", () => {
  assert.equal(normalizeDomain("Example.COM."), "example.com");
  assert.throws(() => normalizeDomain("https://example.com"), /inválido/);
});

test("marca SPF y DMARC ausentes cuando el dominio recibe correo", () => {
  const findings = assessDomain({
    mx: [{ exchange: "mail.example.com", priority: 10 }],
    rootTxt: [],
    dmarcTxt: [],
    caa: [],
    headers: {},
    httpStatus: 200,
    httpLocation: "",
    certificateDays: 60
  });

  assert.equal(findings.find((item) => item.Control === "SPF").Severity, "Alta");
  assert.equal(findings.find((item) => item.Control === "DMARC").Severity, "Alta");
  assert.equal(
    findings.find((item) => item.Control === "Redirección a HTTPS").Severity,
    "Media"
  );
});

test("reconoce redirección y protección contra marcos", () => {
  const findings = assessDomain({
    mx: [],
    rootTxt: [],
    dmarcTxt: [],
    caa: [],
    headers: {
      "content-security-policy": "default-src 'self'; frame-ancestors 'none'"
    },
    httpStatus: 308,
    httpLocation: "https://example.com/",
    certificateDays: 60
  });

  assert.equal(
    findings.find((item) => item.Control === "Redirección a HTTPS").Status,
    "Correcta"
  );
  assert.equal(
    findings.find((item) => item.Control === "Protección contra marcos").Status,
    "Presente"
  );
});

test("escapa el dominio al generar el HTML", () => {
  const html = renderDomainReport("<script>", [], new Date("2026-07-26"));
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script><\/script>/);
});
