import type { Metadata, Viewport } from "next";
import { Outfit, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import { envOu } from "@/lib/env";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

/* `viewportFit: cover` deixa o conteúdo alcançar a borda em telas com notch;
   os paddings de safe-area no Quiz cuidam para nada ficar sob o recorte.
   Zoom liberado de propósito: bloquear escala quebra acessibilidade. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    envOu(process.env.NEXT_PUBLIC_SITE_URL, "https://www.companychatia.com.br")
  ),
  title: "Automação de WhatsApp com IA em Goiânia | CompanyChat",
  description:
    "Automação de atendimento no WhatsApp com IA em Goiânia e todo o Brasil. Assistente 24/7, API Oficial, disparo em massa e CRM. Fale conosco pelo WhatsApp.",
  alternates: { canonical: "/" },
  keywords: [
    "automação Goiânia",
    "automação de WhatsApp Goiânia",
    "automação de atendimento",
    "automação de WhatsApp com IA",
    "plataforma de automação para WhatsApp",
    "chatbot Goiânia",
    "API oficial WhatsApp",
    "integração com API oficial",
    "disparo em massa WhatsApp",
    "inteligência artificial",
    "atendimento automatizado",
    "IA para empresas",
    "Goiânia",
    "Goiás",
    "CompanyChat",
  ],
  authors: [{ name: "CompanyChat" }],
  openGraph: {
    title: "Automação de WhatsApp com IA em Goiânia | CompanyChat",
    description:
      "Assistente IA 24/7, API Oficial, disparo em massa e CRM no WhatsApp. Atendemos Goiânia e todo o Brasil, 100% online.",
    type: "website",
    locale: "pt_BR",
    siteName: "CompanyChat",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "geo.region": "BR-GO",
    "geo.placename": "Goiânia",
    "geo.position": "-16.6869;-49.2648",
    ICBM: "-16.6869, -49.2648",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${outfit.variable} ${bricolage.variable} font-sans antialiased`}>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
