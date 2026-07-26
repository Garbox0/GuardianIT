import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aerosftp.com"),
  title: {
    default: "Guardián PyME | Soporte informático para empresas",
    template: "%s | Guardián PyME"
  },
  description:
    "Diagnóstico y soporte informático para PyMEs de Zona Norte y CABA. Revisamos equipos, backups, red y accesos con alcance y precio claros.",
  alternates: {
    canonical: "/"
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/icon.svg"
  },
  openGraph: {
    title: "Guardián PyME | Soporte informático para empresas",
    description:
      "Diagnóstico y soporte informático para PyMEs de Zona Norte y CABA.",
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
    title: "Guardián PyME | Soporte informático para empresas",
    description:
      "Diagnóstico y soporte informático para PyMEs de Zona Norte y CABA.",
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
