import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
