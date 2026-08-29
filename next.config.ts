import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Empacota o servidor com só o necessário para rodar, o que permite uma
     imagem enxuta no Coolify (sem `node_modules` inteiro). */
  output: "standalone",

  /* Apex e www serviam o mesmo conteúdo, dividindo o SEO entre dois endereços.
     O canônico é o www (mesmo host usado em metadataBase, sitemap e robots),
     então o apex redireciona para ele. A regra só dispara no host sem www,
     o que descarta qualquer risco de loop. */
  /* Cabeçalhos de segurança. Não havia nenhum: a resposta de produção saía sem
     HSTS, sem `nosniff`, sem `Referrer-Policy` e — o que importa mais — sem
     nada que impedisse o painel de leads de ser carregado dentro de um iframe.
     Com o cookie de sessão ativo, isso é clickjacking sobre um botão de
     exclusão que não tem desfazer.

     A CSP do site público fica de fora por enquanto: o Pixel do Meta injeta
     script inline e exigiria nonce, o que torna dinâmica uma página hoje
     estática. O caminho é entrar depois em `Report-Only` e medir antes de
     bloquear. No painel, que não tem Pixel, a CSP entra completa. */
  async headers() {
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];

    return [
      { source: "/:path*", headers: base },
      {
        /* O painel e as APIs administrativas: nunca enquadrados, nunca
           cacheados por proxy intermediário. O CSV carrega até 5.000 linhas
           de dado pessoal e não pode ficar em cache de CDN. */
        source: "/:rota(leads|api/leads)/:path*",
        headers: [
          ...base,
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      {
        source: "/leads",
        headers: [
          ...base,
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },

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
      /* A página do produto nasceu como /assistente-ia e virou /agente-ia quando
         a marca passou a comunicar "agente de IA" — o produto executa ações
         (agenda, cobra, move o lead no CRM), não só responde. A URL antiga está
         indexada e já saiu em link e anúncio, então o 301 preserva o SEO. */
      {
        source: "/assistente-ia",
        destination: "/agente-ia",
        permanent: true,
      },
      /* A página de planos saiu do ar: o preço agora é definido no diagnóstico,
         caso a caso, e nenhum valor é publicado. Quem chegar por link antigo,
         anúncio ou resultado de busca cai no formulário de contato em vez de
         num 404. */
      {
        source: "/planos",
        destination: "/teste-gratis?origem=planos",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
