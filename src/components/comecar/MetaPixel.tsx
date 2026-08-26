"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { analyticsPermitido } from "@/lib/analytics";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/* O host não muda enquanto a página vive, então não há o que assinar: o
   cancelamento é uma função vazia. O snapshot do servidor é sempre `false`,
   que é o que mantém o HTML gerado no build livre de qualquer referência à
   Meta — inclusive num build de preview. */
const semAssinatura = () => () => {};
const noServidor = () => false;

/** Pixel do Meta para otimização de campanha. Sem a variável de ambiente
 *  nada é injetado e a página continua idêntica. O evento `Lead` é
 *  disparado no envio do formulário.
 *
 *  `pixelId` permite um Pixel próprio por página (ex.:
 *  NEXT_PUBLIC_META_PIXEL_ID_SAUDE); sem ele, vale o Pixel global do site.
 *
 *  ─── Por que isto roda no cliente ───
 *
 *  O Pixel só pode existir nos domínios de produção (`analyticsPermitido`).
 *  `NODE_ENV` não serve para decidir: `npm run start` roda em `production` no
 *  localhost, e foi assim que uma sessão de teste local chegou a registrar
 *  page views no Pixel real. O host só existe no navegador, e lê-lo no
 *  servidor tornaria dinâmica uma página que hoje é estática.
 *
 *  O efeito roda depois da montagem: até lá nada é renderizado, então em
 *  localhost, 127.0.0.1, IP de rede local ou domínio de preview **nenhuma
 *  requisição sai para a Meta** — nem o script, nem o preconnect, nem o pixel
 *  de `<noscript>`. O custo em produção é o Pixel subir junto com a
 *  hidratação, e não antes dela; ele já era `afterInteractive`. */
export default function MetaPixel({ pixelId }: { pixelId?: string } = {}) {
  const id = pixelId || PIXEL_ID;
  const autorizado = useSyncExternalStore(
    semAssinatura,
    analyticsPermitido,
    noServidor
  );

  if (!id || !autorizado) return null;

  return (
    <>
      {/* O handshake com a Meta custava ~360 ms no caminho crítico (medido no
          Lighthouse mobile de `/10-empresas`). O preconnect abre a conexão em
          paralelo, sem mudar nada do que é carregado. */}
      <link rel="preconnect" href="https://connect.facebook.net" />
      <link rel="preconnect" href="https://www.facebook.com" />

      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${id}');fbq('track','PageView');`}
      </Script>
    </>
  );
}

/* O pixel de `<noscript>` saiu junto com esta mudança.
 *
 * Ele existia para contar a visita de quem navega sem JavaScript, e é a única
 * parte do Pixel que não dá para condicionar ao domínio — sem JS não há como
 * ler o host, então em localhost ele dispararia um GET para a Meta de qualquer
 * jeito. Como o componente agora só monta depois da hidratação, aquele
 * `<noscript>` também nunca mais chegaria a um navegador sem JS: seria código
 * morto fingindo medir.
 *
 * O que se perde é a contagem de visitantes sem JavaScript — que, num site em
 * que todo formulário é React, não converteriam nem gerariam `Lead`. */
