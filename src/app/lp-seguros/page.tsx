import type { Metadata } from "next";
import MetaPixel from "@/components/comecar/MetaPixel";
import Landing from "@/components/lp/Landing";


/* LP de anúncio para corretoras e corretores de seguros. Como as demais
   LPs: fora do menu, fora do sitemap e noindex. */
export const metadata: Metadata = {
  title: "IA que atende e cota no WhatsApp da sua corretora | CompanyChat IA",
  description:
    "Para corretoras de seguros: a IA responde em segundos, coleta os dados da cotação, acompanha renovações e atende o segurado 24 horas por dia.",
  keywords: [
    "IA para corretora de seguros",
    "atendimento automatizado para corretores",
    "cotação de seguros no WhatsApp",
  ],
  openGraph: {
    title: "IA que atende e cota no WhatsApp da sua corretora | CompanyChat IA",
    description:
      "A IA responde em segundos, coleta os dados da cotação, acompanha renovações e atende o segurado 24 horas por dia.",
    type: "website",
    locale: "pt_BR",
    siteName: "CompanyChat IA",
  },
  twitter: {
    card: "summary_large_image",
    title: "IA que atende e cota no WhatsApp da sua corretora | CompanyChat IA",
    description:
      "A IA responde em segundos, coleta os dados da cotação, acompanha renovações e atende o segurado 24 horas por dia.",
  },
  robots: { index: false, follow: false },
  alternates: { canonical: "/lp-seguros" },
};

export default function LPSeguros() {
  return (
    <>
      <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID_SEGUROS} />
      <Landing nicho="seguros" />
    </>
  );
}
