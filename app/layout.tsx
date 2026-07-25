import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Guardián PyME | Soporte informático para empresas",
    template: "%s | Guardián PyME"
  },
  description:
    "Soporte informático, backups, continuidad y automatización práctica para PyMEs sin personal de sistemas.",
  keywords: [
    "soporte informático para empresas",
    "soporte técnico PyME",
    "backup empresas",
    "mantenimiento informático",
    "automatización PyME"
  ],
  openGraph: {
    title: "Guardián PyME",
    description:
      "Ordenamos, protegemos y simplificamos la tecnología de tu negocio.",
    type: "website",
    locale: "es_AR"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
