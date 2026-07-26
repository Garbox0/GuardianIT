import { buildWhatsAppUrl } from "./lead";

const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
  "5491121632824";
const paymentLink = process.env.NEXT_PUBLIC_PAYMENT_LINK?.trim() || "";
const bookingLink = process.env.NEXT_PUBLIC_BOOKING_LINK?.trim() || "";
const whatsappUrl = buildWhatsAppUrl(
  whatsappNumber,
  "Hola, vi Guardián PyME y quiero consultar por el Diagnóstico Guardián."
);

export const site = {
  name: "Guardián PyME",
  url: "https://aerosftp.com",
  description:
    "Soporte informático, continuidad y automatización práctica para PyMEs.",
  area:
    process.env.NEXT_PUBLIC_SERVICE_AREA?.trim() ||
    "Zona Norte y CABA · atención remota en Argentina",
  availability:
    process.env.NEXT_PUBLIC_AVAILABILITY?.trim() ||
    "Horarios a coordinar",
  whatsappNumber,
  whatsappDisplay: "+54 9 11 2163-2824",
  whatsappUrl,
  paymentLink,
  bookingLink,
  purchaseUrl: paymentLink || whatsappUrl,
  purchaseLabel: paymentLink ? "Comprar diagnóstico" : "Consultar por WhatsApp"
};
