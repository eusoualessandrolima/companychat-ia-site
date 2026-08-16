import type { MetadataRoute } from "next";
import { envOu } from "@/lib/env";

const BASE_URL = envOu(process.env.NEXT_PUBLIC_SITE_URL, "https://www.companychatia.com.br");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // O painel de leads e as rotas de API não têm o que indexar.
      // `/comecar` fica de fora daqui de propósito: é `noindex` pela
      // metadata, e bloquear no robots impediria o rastreador do Meta
      // de ler a página do anúncio.
      disallow: ["/leads", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
