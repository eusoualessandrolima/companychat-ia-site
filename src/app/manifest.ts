import type { MetadataRoute } from "next";

/* Espelha o `site.webmanifest` entregue em Marketing/Logomarca/Modelo v3/05-FAVICON.
   Vive como rota e não como arquivo estático porque assim o Next injeta o
   `<link rel="manifest">` sozinho, em todas as páginas, sem repetir metatag.
   Os ícones não são declarados `maskable`: o balão chega perto da borda do
   quadrado e a máscara circular do Android cortaria a ponta da cauda. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CompanyChat",
    short_name: "CompanyChat",
    description:
      "Automação de atendimento no WhatsApp com IA: agente de IA 24/7, API Oficial, disparo em massa e CRM.",
    lang: "pt-BR",
    start_url: "/",
    display: "standalone",
    theme_color: "#071011",
    background_color: "#071011",
    icons: [
      { src: "/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
