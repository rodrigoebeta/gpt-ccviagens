import type { Metadata, Viewport } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Centro de Comando de Viagens",
  description: "Programação, reservas e documentos em cada dia da viagem.",
  robots: { index: false, follow: false },
  other: {
    "codex-preview": "development",
    "application-origin": "puko-central",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Viagens", statusBarStyle: "default" },
  icons: {
    icon: [{url:"/favicon.svg?v=12",type:"image/svg+xml"},{url:"/icon-32.png",sizes:"32x32",type:"image/png"}],
    shortcut: "/icon-32.png",
    apple: [{url:"/apple-touch-icon.png",sizes:"180x180",type:"image/png"}],
  },
};

export const viewport: Viewport = { themeColor: "#f3f3f1", width: "device-width", initialScale: 1 };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased puko-central" data-puko="central">{children}</body>
    </html>
  );
}
