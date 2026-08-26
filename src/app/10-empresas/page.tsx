import type { Metadata } from "next";
import MetaPixel from "@/components/comecar/MetaPixel";
import Campanha from "@/components/dez-empresas/Campanha";
import { SEO } from "@/components/dez-empresas/conteudo";

/* Campanha "10 Empresas, 10 Assistentes de IA".
 *
 * `noindex`, como as LPs de nicho: a campanha é temporária e uma página de
 * seleção encerrada indexada envelhece mal no resultado de busca. Por isso ela
 * também fica fora do `sitemap.ts` — sitemap listando URL bloqueada é
 * contradição que o Search Console reporta como erro. O endereço é divulgado
 * pelo anúncio e pelo link direto, que não dependem de indexação; os metadados
 * de OG continuam valendo no compartilhamento.
 *
 * A imagem social é a padrão do site, gerada por `src/app/opengraph-image.tsx`.
 * Ela não é herdada por rotas filhas (as LPs de nicho vão para o ar sem
 * `og:image`), então aqui ela é apontada explicitamente — é a mesma arte, sem
 * uma segunda geração no build. */
const IMAGEM_SOCIAL = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "CompanyChat: 10 empresas, 10 assistentes de IA no WhatsApp",
};
export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: [
    "assistente de IA no WhatsApp",
    "implantação gratuita de IA",
    "seleção de empresas IA",
    "atendimento com inteligência artificial",
  ],
  openGraph: {
    title: SEO.ogTitle,
    description: SEO.ogDescription,
    type: "website",
    locale: "pt_BR",
    siteName: "CompanyChat",
    images: [IMAGEM_SOCIAL],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.ogTitle,
    description: SEO.ogDescription,
    images: [IMAGEM_SOCIAL.url],
  },
  robots: { index: false, follow: false },
  alternates: { canonical: "/10-empresas" },
};

export default function DezEmpresas() {
  return (
    <>
      {/* Pixel global do site (`NEXT_PUBLIC_META_PIXEL_ID`), sem variável
          própria: a campanha é medida pelos eventos `campanha10_*`, que já
          identificam o funil dentro do mesmo Pixel. */}
      <MetaPixel />
      <Campanha />
    </>
  );
}
