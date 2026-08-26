import type { Metadata, Viewport } from "next";
import { Outfit, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import Movimento from "@/components/Movimento";
import { envOu } from "@/lib/env";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

/* `viewportFit: cover` deixa o conteúdo alcançar a borda em telas com notch;
   os paddings de safe-area no Quiz cuidam para nada ficar sob o recorte.
   Zoom liberado de propósito: bloquear escala quebra acessibilidade. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  /* Mesma cor do `theme_color` do manifest e do fundo do favicon: sem isso o
     Chrome no Android pinta a barra de endereço de branco e o topo escuro do
     site aparece com uma faixa clara acima dele. */
  themeColor: "#071011",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    envOu(process.env.NEXT_PUBLIC_SITE_URL, "https://www.companychatia.com.br")
  ),
  title: "Automação de WhatsApp com IA em Goiânia | CompanyChat",
  description:
    "Automação de atendimento no WhatsApp com IA em Goiânia e todo o Brasil. Assistente 24/7, API Oficial, disparo em massa e CRM. Fale conosco pelo WhatsApp.",
  alternates: { canonical: "/" },
  keywords: [
    "automação Goiânia",
    "automação de WhatsApp Goiânia",
    "automação de atendimento",
    "automação de WhatsApp com IA",
    "plataforma de automação para WhatsApp",
    "chatbot Goiânia",
    "API oficial WhatsApp",
    "integração com API oficial",
    "disparo em massa WhatsApp",
    "inteligência artificial",
    "atendimento automatizado",
    "IA para empresas",
    "Goiânia",
    "Goiás",
    "CompanyChat",
  ],
  authors: [{ name: "CompanyChat" }],
  openGraph: {
    title: "Automação de WhatsApp com IA em Goiânia | CompanyChat",
    description:
      "Assistente IA 24/7, API Oficial, disparo em massa e CRM no WhatsApp. Atendemos Goiânia e todo o Brasil, 100% online.",
    type: "website",
    locale: "pt_BR",
    siteName: "CompanyChat",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "geo.region": "BR-GO",
    "geo.placename": "Goiânia",
    "geo.position": "-16.6869;-49.2648",
    ICBM: "-16.6869, -49.2648",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${outfit.variable} ${bricolage.variable} font-sans antialiased`}>
        {/* Primeiro item da tabulação, invisível até receber foco. Sem ele,
            chegar ao conteúdo exige passar pelo logo e pelos seis links do
            menu — em cada uma das dezesseis rotas. O alvo é o `id="conteudo"`
            que cada página põe no seu `<main>`. */}
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-on-primary"
        >
          Pular para o conteúdo
        </a>
        <StructuredData />
        <Movimento>{children}</Movimento>
      </body>
    </html>
  );
}
