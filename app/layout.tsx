import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aerosftp.com"),
  title: {
    default: "Guardián PyME | Soporte IT para oficinas",
    template: "%s | Guardián PyME"
  },
  description:
    "Revisión remota de equipos, Wi-Fi, backups y accesos para oficinas de Zona Norte y CABA. Hasta cinco equipos por ARS 90.000, pago único.",
  alternates: {
    canonical: "/"
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/icon.svg"
  },
  openGraph: {
    title: "Guardián PyME | Soporte IT para oficinas",
    description:
      "Revisamos equipos, Wi-Fi, backups y accesos. Hasta cinco equipos, pago único y sin abono obligatorio.",
    type: "website",
    locale: "es_AR",
    siteName: "Guardián PyME",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Guardián PyME, tecnología que no frena tu negocio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Guardián PyME | Soporte IT para oficinas",
    description:
      "Revisión remota de equipos, Wi-Fi, backups y accesos en Zona Norte y CABA.",
    images: ["/og-image.png"]
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
