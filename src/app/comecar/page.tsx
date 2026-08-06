import type { Metadata } from "next";
import Quiz from "@/components/comecar/Quiz";
import MetaPixel from "@/components/comecar/MetaPixel";

/* Página de destino de anúncio: fora do menu, fora do sitemap e fora do
   índice do Google, para não competir com a home pelas mesmas palavras. */
export const metadata: Metadata = {
  title: "Teste o assistente de IA no seu WhatsApp | CompanyChat IA",
  description:
    "Responda seis perguntas rápidas e veja o assistente de IA atendendo no seu WhatsApp.",
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
