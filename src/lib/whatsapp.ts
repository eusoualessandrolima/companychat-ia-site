/** Números e links de contato.
 *
 *  Vivem fora de `components/WhatsAppButton.tsx` porque aquele arquivo é
 *  `"use client"`: componentes de servidor (Footer, StructuredData, a página de
 *  privacidade) receberiam uma referência de cliente no lugar da string. */

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "556493054630";

/** Número do suporte. Sem variável definida, cai no mesmo número do comercial —
 *  o que muda é a mensagem, que já entrega o contexto para a Jade triar. */
const WHATSAPP_SUPORTE =
  process.env.NEXT_PUBLIC_WHATSAPP_SUPORTE ?? WHATSAPP_NUMBER;

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Gostaria de saber mais sobre os serviços da CompanyChat IA."
);

const MENSAGEM_SUPORTE = encodeURIComponent(
  "Olá! Já sou cliente da CompanyChat IA e preciso de suporte."
);

export const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export const suporteLink = `https://wa.me/${WHATSAPP_SUPORTE}?text=${MENSAGEM_SUPORTE}`;

/** URL de login do sistema (app). Configurável via NEXT_PUBLIC_LOGIN_URL. */
export const loginLink =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://app.companychatia.com.br/app/login";
