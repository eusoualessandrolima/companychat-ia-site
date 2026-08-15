import type { Metadata } from "next";
import ApiHeader from "@/components/api-oficial/ApiHeader";
import Calculadora from "@/components/calculadora/Calculadora";
import Footer from "@/components/Footer";
import MetaPixel from "@/components/comecar/MetaPixel";

const TITULO =
  "Calculadora de impacto da nova cobrança do WhatsApp | CompanyChat";
const DESCRICAO =
  "Simule em segundos quanto a sua operação vai custar com a cobrança por mensagem enviada da API Oficial do WhatsApp e compare com o Modelo Híbrido CompanyChat.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  keywords: [
    "calculadora API oficial WhatsApp",
    "novo modelo de cobrança WhatsApp",
    "custo por mensagem enviada WhatsApp",
    "preço template WhatsApp Meta",
    "reduzir custo da API do WhatsApp",
  ],
  openGraph: {
    title: TITULO,
    description: DESCRICAO,
    type: "website",
    locale: "pt_BR",
    siteName: "CompanyChat",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
  },
  alternates: { canonical: "/calculadora" },
};

export default function PaginaCalculadora() {
  return (
    <>
      <MetaPixel />
      <div className="min-h-screen bg-dark-base">
        <ApiHeader />
        <main>
          <Calculadora />
        </main>
        <Footer />
      </div>
    </>
  );
}
