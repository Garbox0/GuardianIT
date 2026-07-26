import { buildWhatsAppUrl } from "./lead";

const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
  "5491121632824";
const paymentLink =
  process.env.NEXT_PUBLIC_PAYMENT_LINK?.trim() || "https://mpago.la/2MLSJyJ";
const whatsappUrl = buildWhatsAppUrl(
  whatsappNumber,
  "Hola, vi la página de Guardián PyME. Quiero consultar por la revisión de hasta cinco equipos."
);
const paymentConfirmationUrl = buildWhatsAppUrl(
  whatsappNumber,
  "Hola, ya pagué el Diagnóstico Guardián. Mi nombre es ___ y el número de operación de Mercado Pago es ___."
);

export const site = {
  name: "Guardián PyME",
  url: "https://aerosftp.com",
  description:
    "Revisión y soporte informático para oficinas sin un área de sistemas.",
  area:
    process.env.NEXT_PUBLIC_SERVICE_AREA?.trim() ||
    "Zona Norte y CABA · atención remota en Argentina",
  availability:
    process.env.NEXT_PUBLIC_AVAILABILITY?.trim() ||
    "Lunes a sábados, de 9:00 a 19:00",
  whatsappNumber,
  whatsappDisplay: "+54 9 11 2163-2824",
  whatsappUrl,
  paymentConfirmationUrl,
  paymentLink,
  purchaseUrl: paymentLink || whatsappUrl,
  purchaseLabel: paymentLink ? "Comprar diagnóstico" : "Consultar por WhatsApp"
};
