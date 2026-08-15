import type { Metadata } from "next";
import ApiHeader from "@/components/api-oficial/ApiHeader";
import CompanyAiHero from "@/components/company-ai/CompanyAiHero";
import Origem from "@/components/company-ai/Origem";
import OqueConstruimos from "@/components/company-ai/OqueConstruimos";
import ComoTrabalhamos from "@/components/company-ai/ComoTrabalhamos";
import NossasSolucoes from "@/components/NossasSolucoes";
import CompanyAiCta from "@/components/company-ai/CompanyAiCta";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Company AI: soluções de IA sob medida | CompanyChat",
  description:
    "A frente de projetos sob medida da CompanyChat. Consultoria em IA, atendente no WhatsApp, sistema personalizado, CRM e automação construídos para o processo da sua empresa.",
  keywords: [
    "consultoria em inteligência artificial",
    "consultoria em IA para empresas",
    "desenvolvimento de soluções com IA",
    "automação sob medida para empresas",
    "sistema personalizado com inteligência artificial",
    "CRM sob medida",
    "consultoria em IA",
    "automação de processos empresariais",
    "agente de IA personalizado",
  ],
  alternates: { canonical: "/company-ai" },
  openGraph: {
    title: "Company AI: em vez de só ensinar, a gente constrói",
    description:
      "Você descreve o problema que se repete todo dia na sua empresa e a gente desenvolve a solução: atendente no WhatsApp, sistema, CRM ou automação.",
    type: "article",
    locale: "pt_BR",
    siteName: "CompanyChat",
  },
};

export default function CompanyAiPage() {
  return (
    <>
      <ApiHeader />
      <main>
        <CompanyAiHero />
        <Origem />
        <OqueConstruimos />
        <ComoTrabalhamos />
        <NossasSolucoes variant="dark" />
        <CompanyAiCta />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
