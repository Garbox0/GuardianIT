"use client";

import { FormEvent, useState } from "react";
import { buildLeadMessage } from "@/lib/lead";

type Props = {
  whatsappNumber: string;
};

export default function LeadForm({ whatsappNumber }: Props) {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = buildLeadMessage({
      name: String(form.get("name") || ""),
      business: String(form.get("business") || ""),
      devices: String(form.get("devices") || ""),
      problem: String(form.get("problem") || "")
    });

    if (whatsappNumber) {
      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer"
      );
      setStatus("Abrimos WhatsApp con tu consulta preparada.");
      return;
    }

    navigator.clipboard
      .writeText(message)
      .then(() =>
        setStatus(
          "Solicitud copiada. El canal de WhatsApp se habilitará antes de publicar."
        )
      )
      .catch(() =>
        setStatus("No pudimos copiar el mensaje. Revisá los datos e intentá nuevamente.")
      );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <label>
        Tu nombre
        <input name="name" autoComplete="name" required />
      </label>
      <label>
        Empresa o actividad
        <input name="business" autoComplete="organization" required />
      </label>
      <label>
        Cantidad aproximada de equipos
        <select name="devices" defaultValue="" required>
          <option value="" disabled>Elegí una opción</option>
          <option>1 a 4</option>
          <option>5 a 10</option>
          <option>11 a 20</option>
          <option>Más de 20</option>
        </select>
      </label>
      <label>
        ¿Qué problema querés resolver?
        <textarea
          name="problem"
          rows={4}
          placeholder="Por ejemplo: no sabemos si el backup funciona..."
          required
        />
      </label>
      <button className="button form-button" type="submit">
        Preparar consulta
      </button>
      <p className="privacy-note">
        No guardamos estos datos en el sitio. Se usan solamente para preparar
        tu mensaje.
      </p>
      <p className="form-status" aria-live="polite">{status}</p>
    </form>
  );
}
