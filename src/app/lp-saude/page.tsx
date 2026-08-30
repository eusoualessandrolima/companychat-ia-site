import type { Metadata } from "next";
import MetaPixel from "@/components/comecar/MetaPixel";
import Landing from "@/components/lp/Landing";


/* LP de anúncio para saúde e bem-estar (ex-/comecar2, que redireciona para
   cá). Como as demais LPs: fora do menu, fora do sitemap e noindex. */
export const metadata: Metadata = {
  title: "IA que atende e agenda sua clínica no WhatsApp | CompanyChat",
  description:
    "Para clínicas e negócios de saúde: a IA responde em segundos, qualifica o paciente, agenda e confirma consultas no WhatsApp, 24 horas por dia.",
  keywords: [
    "IA para clínicas no WhatsApp",
    "agendamento automático de consultas",
    "atendimento automatizado para clínicas",
  ],
  openGraph: {
    title: "IA que atende e agenda sua clínica no WhatsApp | CompanyChat",
    description:
      "A IA responde em segundos, qualifica o paciente, agenda e confirma consultas no WhatsApp, 24 horas por dia.",
    type: "website",
    locale: "pt_BR",
    siteName: "CompanyChat",
    /* Sem isto o link colado no WhatsApp sai sem imagem: as LPs redefinem
       `openGraph` e não herdam o card gerado em `app/opengraph-image.tsx`. */
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
    title: "IA que atende e agenda sua clínica no WhatsApp | CompanyChat",
    description:
      "A IA responde em segundos, qualifica o paciente, agenda e confirma consultas no WhatsApp, 24 horas por dia.",
  },
  robots: { index: false, follow: false },
  alternates: { canonical: "/lp-saude" },
};

export default function LPSaude() {
  return (
    <>
      <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID_SAUDE} />
      <Landing nicho="saude" />
    </>
  );
}
