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
    certificateDays: 60
  });

  assert.equal(findings.find((item) => item.Control === "SPF").Severity, "Alta");
  assert.equal(findings.find((item) => item.Control === "DMARC").Severity, "Alta");
});

test("escapa el dominio al generar el HTML", () => {
  const html = renderDomainReport("<script>", [], new Date("2026-07-26"));
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script><\/script>/);
});
