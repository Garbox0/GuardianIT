export const site = {
  name: "Guardián PyME",
  description:
    "Soporte informático, continuidad y automatización práctica para PyMEs.",
  area:
    process.env.NEXT_PUBLIC_SERVICE_AREA?.trim() ||
    "Zona Norte y CABA · atención remota en Argentina",
  availability:
    process.env.NEXT_PUBLIC_AVAILABILITY?.trim() ||
    "Horarios a coordinar",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
    "5491121632824",
  whatsappDisplay: "+54 9 11 2163-2824"
};
