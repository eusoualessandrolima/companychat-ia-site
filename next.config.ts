import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Empacota o servidor com só o necessário para rodar, o que permite uma
     imagem enxuta no Coolify (sem `node_modules` inteiro). */
  output: "standalone",

  /* Apex e www serviam o mesmo conteúdo, dividindo o SEO entre dois endereços.
     O canônico é o www (mesmo host usado em metadataBase, sitemap e robots),
     então o apex redireciona para ele. A regra só dispara no host sem www,
     o que descarta qualquer risco de loop. */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "companychatia.com.br" }],
        destination: "https://www.companychatia.com.br/:path*",
        permanent: true,
      },
      /* A LP de saúde nasceu como /comecar2 e foi renomeada quando o
         ecossistema de LPs por nicho ganhou slugs descritivos (lp-saude,
         lp-empresas, lp-adv, lp-seguros). O redirect preserva qualquer
         anúncio ou link antigo. */
      {
        source: "/comecar2",
        destination: "/lp-saude",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
