import type { Metadata } from "next";
import MetaPixel from "@/components/comecar/MetaPixel";
import Landing from "@/components/lp/Landing";


/* LP de anúncio para advogados e escritórios de advocacia. Como as demais
   LPs: fora do menu, fora do sitemap e noindex. */
export const metadata: Metadata = {
  title: "IA que atende o WhatsApp do seu escritório | CompanyChat IA",
  description:
    "Para advogados e escritórios: a IA responde na hora, qualifica o caso, agenda a consulta e confirma na véspera, 24 horas por dia, sem dar orientação jurídica.",
  keywords: [
    "IA para escritório de advocacia",
    "atendimento automatizado para advogados",
    "agendamento de consultas jurídicas",
  ],
  openGraph: {
    title: "IA que atende o WhatsApp do seu escritório | CompanyChat IA",
    description:
      "A IA responde na hora, qualifica o caso, agenda a consulta e confirma na véspera, 24 horas por dia.",
    type: "website",
    locale: "pt_BR",
    siteName: "CompanyChat IA",
  },
  twitter: {
    card: "summary_large_image",
    title: "IA que atende o WhatsApp do seu escritório | CompanyChat IA",
    description:
      "A IA responde na hora, qualifica o caso, agenda a consulta e confirma na véspera, 24 horas por dia.",
  },
  robots: { index: false, follow: false },
  alternates: { canonical: "/lp-adv" },
};

export default function LPAdvogados() {
  return (
    <>
      <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID_ADV} />
      <Landing nicho="advogados" />
    </>
  );
}
