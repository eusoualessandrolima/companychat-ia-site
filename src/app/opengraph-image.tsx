import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/* O card social usava o nome em texto ao lado de um ponto verde — um logotipo
   recriado, o que o manual da marca proíbe. Aqui entra o vetor oficial: o
   Satori aceita SVG por data URI, e a imagem é gerada no build, então ler o
   arquivo do disco não custa nada em runtime. */
const LOGO = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), "public/brand/companychat-logo-balao-destaque-dark.svg")
).toString("base64")}`;

/* 386 e não os 340 de quando o card usava só o wordmark: o nome ocupa 500 das
   568 unidades da assinatura completa, e o card foi desenhado com o nome nesse
   tamanho. */
const LOGO_LARGURA = 386;
const LOGO_ALTURA = Math.round((LOGO_LARGURA * 72) / 568);

export const alt =
  "CompanyChat: não somos apenas um CRM. Quem usa CompanyChat não acompanha o mercado, inova ele.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#071011",
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(0, 200, 150,0.25) 0%, transparent 50%), radial-gradient(circle at 90% 100%, rgba(59,130,246,0.15) 0%, transparent 50%)",
        }}
      >
        <div style={{ display: "flex", marginBottom: "48px" }}>
          {/* Satori só renderiza imagem por <img>; next/image não vale aqui. */}
          <img
            src={LOGO}
            alt="CompanyChat"
            width={LOGO_LARGURA}
            height={LOGO_ALTURA}
          />
        </div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#fafafa",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            display: "flex",
          }}
        >
          Não somos apenas um CRM.
        </div>
        <div
          style={{
            marginTop: "32px",
            fontSize: "30px",
            fontWeight: 500,
            color: "#a1a1aa",
            display: "flex",
          }}
        >
          Quem usa CompanyChat não acompanha o mercado.
        </div>
        <div
          style={{
            marginTop: "6px",
            fontSize: "56px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#00c896",
            display: "flex",
          }}
        >
          Inova ele.
        </div>
        <div
          style={{
            marginTop: "36px",
            fontSize: "26px",
            color: "#a1a1aa",
            display: "flex",
          }}
        >
          IA, automações, BI interno e mensageria conectada em um só sistema.
        </div>
      </div>
    ),
    { ...size }
  );
}
