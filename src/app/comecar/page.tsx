import type { Metadata } from "next";
import Quiz from "@/components/comecar/Quiz";
import MetaPixel from "@/components/comecar/MetaPixel";

/* Página de destino de anúncio: fora do menu, fora do sitemap e fora do
   índice do Google, para não competir com a home pelas mesmas palavras. */
export const metadata: Metadata = {
  title: "Teste o agente de IA no seu WhatsApp | CompanyChat",
  description:
    "São 4 etapas rápidas. No fim, você conversa com a nossa IA no WhatsApp, e ela já chega sabendo como o seu atendimento funciona.",
  /* Keywords próprias, e não as herdadas do layout: o Pixel envia
     `pmd[keywords]` ao Meta junto de cada evento, e a lista global carrega
     termos de outras páginas ("disparo em massa") que nada têm a ver com
     esta landing. Sem valor de SEO a perder — a página é noindex. */
  keywords: [
    "agente de IA no WhatsApp",
    "atendimento automatizado com IA",
    "IA para atendimento",
  ],
  /* openGraph próprio pelo mesmo motivo das keywords: o do layout fala do
     site inteiro ("disparo em massa e CRM"), termos que não descrevem esta
     landing e que apareceriam na revisão do anúncio e em qualquer
     compartilhamento do link. */
  openGraph: {
    title: "Veja a IA atendendo no seu WhatsApp | CompanyChat",
    description:
      "São 4 etapas rápidas. No fim, você conversa com a nossa IA no WhatsApp, e ela já chega sabendo como o seu atendimento funciona.",
    type: "website",
    locale: "pt_BR",
    siteName: "CompanyChat",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veja a IA atendendo no seu WhatsApp | CompanyChat",
    description:
      "São 4 etapas rápidas. No fim, você conversa com a nossa IA no WhatsApp, e ela já chega sabendo como o seu atendimento funciona.",
  },
  robots: { index: false, follow: false },
  alternates: { canonical: "/comecar" },
};

export default function Comecar() {
  return (
    <>
      <MetaPixel />
      <Quiz />
    </>
  );
}
