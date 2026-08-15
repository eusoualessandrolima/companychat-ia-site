import type { Metadata } from "next";
import ApiHeader from "@/components/api-oficial/ApiHeader";
import AgenteHero from "@/components/assistente-ia/AgenteHero";
import Cenas from "@/components/assistente-ia/Cenas";
import Capacidades from "@/components/assistente-ia/Capacidades";
import Treinamento from "@/components/assistente-ia/Treinamento";
import NossasSolucoes from "@/components/NossasSolucoes";
import AgenteFaq from "@/components/assistente-ia/AgenteFaq";
import AgenteCta from "@/components/assistente-ia/AgenteCta";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Assistente de IA para WhatsApp | CompanyChat",
  description:
    "Um atendente de IA treinado no seu negócio: ouve áudios, lê documentos, agenda, cobra, move o lead no CRM e chama seu time quando o caso pede. No ar em até 7 dias, no seu WhatsApp.",
  keywords: [
    "assistente de IA para WhatsApp",
    "agente de IA atendimento",
    "atendente virtual WhatsApp",
    "chatbot com inteligência artificial",
    "automação de atendimento WhatsApp",
    "IA que agenda e qualifica leads",
    "secretária virtual com IA",
  ],
  alternates: { canonical: "/assistente-ia" },
  openGraph: {
    title: "Assistente de IA para WhatsApp que resolve, não só responde",
    description:
      "Ouve áudio, lê documento, agenda, cobra e passa para o seu time quando precisa. Treinado com o material do seu negócio e no ar em até 7 dias.",
    type: "article",
    locale: "pt_BR",
    siteName: "CompanyChat",
  },
};

export default function AssistenteIaPage() {
  return (
    <>
      <ApiHeader />
      <main>
        <AgenteHero />
        <Cenas />
        <Capacidades />
        <Treinamento />
        <NossasSolucoes variant="dark" omit="/assistente-ia" />
        <AgenteFaq />
        <AgenteCta />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
