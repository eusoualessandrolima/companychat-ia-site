import type { Metadata } from "next";
import ApiHeader from "@/components/api-oficial/ApiHeader";
import TabelaPlanos from "@/components/planos/TabelaPlanos";
import Incluso from "@/components/planos/Incluso";
import CustoMeta from "@/components/planos/CustoMeta";
import PlanosFaq from "@/components/planos/PlanosFaq";
import PlanosCta from "@/components/planos/PlanosCta";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Planos e Preços | CompanyChat",
  description:
    "CompanyChat Pro por R$ 497 por mês: assistente de IA, CRM Kanban, atendentes ilimitados e implantação inclusa, no ar em até 7 dias. Plano sob medida para operações com várias unidades.",
  keywords: [
    "planos CompanyChat",
    "preço assistente de IA WhatsApp",
    "quanto custa chatbot WhatsApp",
    "plataforma de atendimento WhatsApp preço",
    "CRM WhatsApp mensalidade",
    "automação de atendimento valor",
  ],
  alternates: { canonical: "/planos" },
  openGraph: {
    title: "Planos e preços da CompanyChat",
    description:
      "Uma mensalidade com assistente de IA, CRM Kanban, atendentes ilimitados e implantação inclusa. Comece a atender em até 7 dias.",
    type: "article",
    locale: "pt_BR",
    siteName: "CompanyChat",
  },
};

export default function PlanosPage() {
  return (
    <>
      <ApiHeader />
      <main id="conteudo" tabIndex={-1}>
        <TabelaPlanos />
        <Incluso />
        <CustoMeta />
        <PlanosFaq />
        <PlanosCta />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
