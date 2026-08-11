import Script from "next/script";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Pixel do Meta para otimização de campanha. Sem a variável de ambiente
 *  nada é injetado e a página continua idêntica. O evento `Lead` é
 *  disparado no envio do formulário, em `FormularioCaptura`.
 *
 *  `pixelId` permite um Pixel próprio por LP de nicho (as páginas passam a
 *  env específica, ex.: NEXT_PUBLIC_META_PIXEL_ID_SAUDE); sem ele, vale o
 *  Pixel global do site. */
export default function MetaPixel({ pixelId }: { pixelId?: string } = {}) {
  const id = pixelId || PIXEL_ID;
  if (!id) return null;

  return (
    <>
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
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
