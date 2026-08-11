import type { Metadata } from "next";
import MetaPixel from "@/components/comecar/MetaPixel";
import Landing from "@/components/comecar2/Landing";

/* Segunda página de destino de anúncio, focada em saúde e bem-estar.
   Como a /comecar: fora do menu, fora do sitemap e noindex, para não
   competir com a home nem misturar métricas entre as duas landings. */
export const metadata: Metadata = {
  title: "IA que atende e agenda sua clínica no WhatsApp | CompanyChat IA",
  description:
    "Para clínicas e negócios de saúde: a IA responde em segundos, qualifica o paciente, agenda e confirma consultas no WhatsApp, 24 horas por dia.",
  keywords: [
    "IA para clínicas no WhatsApp",
    "agendamento automático de consultas",
    "atendimento automatizado para clínicas",
  ],
  openGraph: {
    title: "IA que atende e agenda sua clínica no WhatsApp | CompanyChat IA",
    description:
      "A IA responde em segundos, qualifica o paciente, agenda e confirma consultas no WhatsApp, 24 horas por dia.",
    type: "website",
    locale: "pt_BR",
    siteName: "CompanyChat IA",
  },
  twitter: {
    card: "summary_large_image",
    title: "IA que atende e agenda sua clínica no WhatsApp | CompanyChat IA",
    description:
      "A IA responde em segundos, qualifica o paciente, agenda e confirma consultas no WhatsApp, 24 horas por dia.",
  },
  robots: { index: false, follow: false },
  alternates: { canonical: "/comecar2" },
};

export default function Comecar2() {
  return (
    <>
      <MetaPixel />
      <Landing />
    </>
  );
}
