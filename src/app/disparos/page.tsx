import type { Metadata } from "next";
import ApiHeader from "@/components/api-oficial/ApiHeader";
import DisparoHero from "@/components/disparos/DisparoHero";
import Fluxo from "@/components/disparos/Fluxo";
import Recursos from "@/components/disparos/Recursos";
import Painel from "@/components/disparos/Painel";
import Ecossistema from "@/components/disparos/Ecossistema";
import DisparoFaq from "@/components/disparos/DisparoFaq";
import DisparoCta from "@/components/disparos/DisparoCta";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Disparo em Massa no WhatsApp com API Oficial | CompanyChat IA",
  description:
    "Ferramenta de disparo em massa no WhatsApp via API Oficial: campanhas de marketing com templates aprovados, disparos ao vivo, relatórios de entrega e leitura e integração com CRM. Sem o risco de bloqueio das APIs não oficiais.",
  keywords: [
    "disparo em massa WhatsApp",
    "campanhas WhatsApp API oficial",
    "ferramenta disparo WhatsApp",
    "marketing WhatsApp em massa",
    "template WhatsApp marketing",
    "relatório de campanha WhatsApp",
    "disparador oficial WhatsApp",
  ],
  alternates: { canonical: "/disparos" },
  openGraph: {
    title: "Disparo em Massa no WhatsApp com API Oficial",
    description:
      "Campanhas de marketing em escala com templates aprovados, relatórios em tempo real e integração com CRM. Tudo via API Oficial da Meta.",
    type: "article",
    locale: "pt_BR",
    siteName: "CompanyChat IA",
  },
};

export default function DisparosPage() {
  return (
    <>
      <ApiHeader />
      <main>
        <DisparoHero />
        <Fluxo />
        <Recursos />
        <Painel />
        <Ecossistema />
        <DisparoFaq />
        <DisparoCta />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
