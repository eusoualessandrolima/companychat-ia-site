import type { Metadata } from "next";
import ApiHeader from "@/components/api-oficial/ApiHeader";
import ApiHero from "@/components/api-oficial/ApiHero";
import Janela24h from "@/components/api-oficial/Janela24h";
import Categorias from "@/components/api-oficial/Categorias";
import Calculadora from "@/components/api-oficial/Calculadora";
import ApiFaq from "@/components/api-oficial/ApiFaq";
import NossasSolucoes from "@/components/NossasSolucoes";
import ApiCta from "@/components/api-oficial/ApiCta";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "API Oficial do WhatsApp: Como Funciona e Quanto Custa | CompanyChat IA",
  description:
    "Entenda a API Oficial do WhatsApp: a janela de 24 horas, as categorias de mensagem (utilidade, autenticação, marketing e serviço) e uma calculadora para estimar seu custo mensal.",
  keywords: [
    "API oficial WhatsApp",
    "WhatsApp Business API",
    "custo WhatsApp API",
    "calculadora WhatsApp API",
    "janela 24 horas WhatsApp",
    "template WhatsApp Meta",
    "preço mensagem WhatsApp",
  ],
  alternates: { canonical: "/api-oficial" },
  openGraph: {
    title: "API Oficial do WhatsApp: Como Funciona e Quanto Custa",
    description:
      "Guia simples sobre a janela de 24h, as categorias de mensagem e uma calculadora de custo mensal da API Oficial do WhatsApp.",
    type: "article",
    locale: "pt_BR",
    siteName: "CompanyChat IA",
  },
};

export default function ApiOficialPage() {
  return (
    <>
      <ApiHeader />
      <main>
        <ApiHero />
        <Janela24h />
        <Categorias />
        <Calculadora />
        <ApiFaq />
        <NossasSolucoes variant="dark" />
        <ApiCta />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
