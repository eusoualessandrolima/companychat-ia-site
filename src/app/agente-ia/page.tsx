import type { Metadata } from "next";
import ApiHeader from "@/components/api-oficial/ApiHeader";
import AgenteHero from "@/components/agente-ia/AgenteHero";
import Cenas from "@/components/agente-ia/Cenas";
import Capacidades from "@/components/agente-ia/Capacidades";
import Treinamento from "@/components/agente-ia/Treinamento";
import NossasSolucoes from "@/components/NossasSolucoes";
import AgenteFaq from "@/components/agente-ia/AgenteFaq";
import AgenteCta from "@/components/agente-ia/AgenteCta";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Agente de IA para WhatsApp | CompanyChat",
  description:
    "Um agente de IA treinado no seu negócio: ouve áudios, lê documentos, agenda, cobra, move o lead no CRM e chama seu time quando o caso pede. No ar em até 7 dias, no seu WhatsApp.",
  /* A marca comunica "agente de IA", mas quem procura no Google ainda digita
     "assistente" e "chatbot". As duas famílias de termo ficam, com as novas
     na frente. */
  keywords: [
    "agente de IA para WhatsApp",
    "agente de IA atendimento",
    "assistente de IA para WhatsApp",
    "atendente virtual WhatsApp",
    "chatbot com inteligência artificial",
    "automação de atendimento WhatsApp",
    "IA que agenda e qualifica leads",
    "secretária virtual com IA",
  ],
  alternates: { canonical: "/agente-ia" },
  openGraph: {
    title: "Agente de IA para WhatsApp que resolve, não só responde",
    description:
      "Ouve áudio, lê documento, agenda, cobra e passa para o seu time quando precisa. Treinado com o material do seu negócio e no ar em até 7 dias.",
    type: "article",
    locale: "pt_BR",
    siteName: "CompanyChat",
  },
};

export default function AgenteIaPage() {
  return (
    <>
      <ApiHeader />
      <main id="conteudo" tabIndex={-1}>
        <AgenteHero />
        <Cenas />
        <Capacidades />
        <Treinamento />
        <NossasSolucoes variant="dark" omit="/agente-ia" />
        <AgenteFaq />
        <AgenteCta />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
