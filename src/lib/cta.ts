/** Destino e rótulos do caminho comercial principal.
 *
 *  Vive num módulo neutro (sem `"use client"`) pelo mesmo motivo de
 *  `src/lib/whatsapp.ts`: Footer e outros componentes de servidor importam
 *  daqui, e um módulo de cliente entregaria referência no lugar da string.
 *
 *  Mudou a rota do funil? Muda aqui, em um lugar só. Antes disso o site tinha
 *  o link do WhatsApp repetido em 25 arquivos, cada um com a sua mensagem. */

export const CTA_TESTE_GRATIS = "/teste-gratis";

export const CTA_LABEL_CURTO = "Teste grátis";
export const CTA_LABEL_LONGO = "Quero testar grátis";

/** Onde o clique aconteceu. Vai junto do evento `free_trial_cta_clicked` e
 *  também como `utm_content` quando o CTA leva para a página, para a origem
 *  sobreviver mesmo sem JavaScript. */
export function linkTesteGratis(local: string) {
  return `${CTA_TESTE_GRATIS}?origem=${encodeURIComponent(local)}`;
}
