export const site = {
  name: "Guardián PyME",
  description:
    "Soporte informático, continuidad y automatización práctica para PyMEs.",
  area:
    process.env.NEXT_PUBLIC_SERVICE_AREA?.trim() ||
    "Atención remota en Argentina",
  availability:
    process.env.NEXT_PUBLIC_AVAILABILITY?.trim() ||
    "Horarios a coordinar",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || ""
};
