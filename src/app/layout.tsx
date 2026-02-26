import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CompanyChat IA — Automação Inteligente para sua Empresa",
  description:
    "Assistente IA personalizado, automação de atendimento e integração via API. Atendimento 24/7 para escritórios, laboratórios, academias e educação. Plano Premium a partir de R$347/mês.",
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
    title: "CompanyChat IA — Automação Inteligente para sua Empresa",
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
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
