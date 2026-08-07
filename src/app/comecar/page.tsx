import type { Metadata } from "next";
import Quiz from "@/components/comecar/Quiz";
import MetaPixel from "@/components/comecar/MetaPixel";

/* Página de destino de anúncio: fora do menu, fora do sitemap e fora do
   índice do Google, para não competir com a home pelas mesmas palavras. */
export const metadata: Metadata = {
  title: "Teste o assistente de IA no seu WhatsApp | CompanyChat IA",
  description:
    "São 4 etapas rápidas. No fim, você conversa com a nossa IA no WhatsApp, e ela já chega sabendo como o seu atendimento funciona.",
  /* Keywords próprias, e não as herdadas do layout: o Pixel envia
     `pmd[keywords]` ao Meta junto de cada evento, e a lista global carrega
     termos de outras páginas ("disparo em massa") que nada têm a ver com
     esta landing. Sem valor de SEO a perder — a página é noindex. */
  keywords: [
    "assistente de IA no WhatsApp",
    "atendimento automatizado com IA",
    "IA para atendimento",
  ],
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
