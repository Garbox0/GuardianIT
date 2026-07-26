import assert from "node:assert/strict";
import test from "node:test";
import { buildLeadMessage, buildWhatsAppUrl } from "../lib/lead.ts";

test("prepara una consulta legible sin espacios accidentales", () => {
  const message = buildLeadMessage({
    name: " Ana ",
    business: " Estudio Norte ",
    devices: "5 a 10",
    problem: " No sabemos si el backup funciona. "
  });

  assert.equal(
    message,
    [
      "Hola, quiero consultar por Guardián PyME.",
      "",
      "Nombre: Ana",
      "Empresa o actividad: Estudio Norte",
      "Cantidad aproximada de equipos: 5 a 10",
      "Problema principal: No sabemos si el backup funciona."
    ].join("\n")
  );
});

test("crea un enlace seguro de WhatsApp", () => {
  assert.equal(
    buildWhatsAppUrl("+54 9 11 2163-2824", "Hola, necesito ayuda."),
    "https://wa.me/5491121632824?text=Hola%2C%20necesito%20ayuda."
  );
});
