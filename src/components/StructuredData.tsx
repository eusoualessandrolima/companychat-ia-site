import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.companychatia.com.br";

/**
 * Dados estruturados (JSON-LD) que dizem ao Google que negócio é este,
 * onde atende (Goiânia + Brasil) e como falar (WhatsApp). Como é empresa
 * de área de atendimento (home office), não expomos endereço de rua.
 */
export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: "CompanyChat",
    alternateName: "CompanyChat - Inteligência e performance de negócios",
    description:
      "Automação de atendimento no WhatsApp com IA em Goiânia e em todo o Brasil. Assistente 24/7, API Oficial, disparo em massa e CRM integrados ao WhatsApp.",
    url: SITE_URL,
    telephone: `+${WHATSAPP_NUMBER}`,
    image: `${SITE_URL}/opengraph-image`,
    logo: `${SITE_URL}/icon.svg`,
    priceRange: "$$",
    currenciesAccepted: "BRL",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Goiânia",
      addressRegion: "GO",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -16.6869,
      longitude: -49.2648,
    },
    areaServed: [
      { "@type": "City", name: "Goiânia" },
      { "@type": "State", name: "Goiás" },
      { "@type": "Country", name: "Brasil" },
    ],
    knowsAbout: [
      "Automação de atendimento",
      "Automação de WhatsApp com IA",
      "Chatbot",
      "Plataforma de automação para WhatsApp",
      "WhatsApp Business API",
      "API Oficial do WhatsApp",
      "Integração com API Oficial",
      "Disparo em massa no WhatsApp",
      "CRM",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${WHATSAPP_NUMBER}`,
      contactType: "sales",
      areaServed: "BR",
      availableLanguage: ["Portuguese"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
