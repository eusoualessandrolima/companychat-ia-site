import { ImageResponse } from "next/og";

export const alt =
  "CompanyChat IA: não somos apenas um CRM. Quem usa CompanyChat não acompanha o mercado, inova ele.";
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
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(0,171,122,0.25) 0%, transparent 50%), radial-gradient(circle at 90% 100%, rgba(59,130,246,0.15) 0%, transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#00ab7a",
            }}
          />
          <div style={{ fontSize: "36px", fontWeight: 700, color: "#fafafa" }}>
            CompanyChat IA
          </div>
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
            color: "#00ab7a",
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
