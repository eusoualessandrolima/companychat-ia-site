import type { MetadataRoute } from "next";
import { envOu } from "@/lib/env";

const BASE_URL = envOu(process.env.NEXT_PUBLIC_SITE_URL, "https://www.companychatia.com.br");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/teste-gratis`,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/agente-ia`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/company-ai`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/api-oficial`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/disparos`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/calculadora`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    /* Os três documentos jurídicos ficam no sitemap e fora do `disallow` do
       robots: a revisão do aplicativo da Meta abre essas URLs direto, e uma
       delas (a política de privacidade) já foi reprovada por apontar para a
       home. Nenhuma pode ganhar `noindex`. */
    {
      url: `${BASE_URL}/privacidade`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/termos`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/exclusao-de-dados`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
