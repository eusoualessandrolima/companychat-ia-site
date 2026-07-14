import type { Metadata } from "next";
import { Outfit, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.companychatia.com.br"
  ),
  title: "CompanyChat IA: Automação Inteligente para sua Empresa",
  description:
    "Assistente IA personalizado, automação de atendimento e integração via API. Atendimento 24/7 no WhatsApp para clínicas, academias, imobiliárias, advocacia e e-commerce.",
  alternates: { canonical: "/" },
  keywords: [
    "automação",
    "inteligência artificial",
    "chatbot",
    "WhatsApp",
    "atendimento automatizado",
    "IA para empresas",
    "CompanyChat",
  ],
  authors: [{ name: "CompanyChat IA" }],
  openGraph: {
    title: "CompanyChat IA: Automação Inteligente para sua Empresa",
    description:
      "Não perca vendas por falta de resposta rápida! Assistente IA personalizado 24/7 para sua empresa.",
    type: "website",
    locale: "pt_BR",
    siteName: "CompanyChat IA",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${outfit.variable} ${bricolage.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
