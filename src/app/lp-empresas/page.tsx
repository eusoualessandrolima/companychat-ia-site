import type { Metadata } from "next";
import MetaPixel from "@/components/comecar/MetaPixel";
import Landing from "@/components/lp/Landing";


/* LP de anúncio genérica para pequenas e médias empresas. Como as demais
   LPs: fora do menu, fora do sitemap e noindex. */
export const metadata: Metadata = {
  title: "IA que atende e vende no WhatsApp da sua empresa | CompanyChat",
  description:
    "Para pequenas e médias empresas: a IA responde em segundos, qualifica o cliente, agenda e acompanha cada conversa no WhatsApp, 24 horas por dia.",
  keywords: [
    "IA para atendimento no WhatsApp",
    "atendimento automatizado para empresas",
    "agente de IA para vendas",
  ],
  openGraph: {
    title: "IA que atende e vende no WhatsApp da sua empresa | CompanyChat",
    description:
      "A IA responde em segundos, qualifica o cliente, agenda e acompanha cada conversa no WhatsApp, 24 horas por dia.",
    type: "website",
    locale: "pt_BR",
    siteName: "CompanyChat",
  },
  twitter: {
    card: "summary_large_image",
    title: "IA que atende e vende no WhatsApp da sua empresa | CompanyChat",
    description:
      "A IA responde em segundos, qualifica o cliente, agenda e acompanha cada conversa no WhatsApp, 24 horas por dia.",
  },
  robots: { index: false, follow: false },
  alternates: { canonical: "/lp-empresas" },
};

export default function LPEmpresas() {
  return (
    <>
      <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID_EMPRESAS} />
      <Landing nicho="empresas" />
    </>
  );
}
