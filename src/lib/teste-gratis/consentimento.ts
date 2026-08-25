/* Texto do consentimento e a sua versão.
 *
 * Módulo à parte de propósito: o formulário roda no navegador e não pode
 * arrastar para o pacote do cliente um arquivo que lê variáveis de ambiente.
 *
 * A versão é gravada junto do lead. Mudou uma vírgula do texto? Suba a versão.
 * Sem isto não há como provar depois o que a pessoa aceitou. */

export const CONSENTIMENTO_VERSAO = "teste-gratis-2026-08-v1";

/* Partido em dois para o link da política entrar no meio da frase sem o
   componente remontar a redação. O texto completo é a soma dos dois, e é ele
   que a versão acima identifica. */
export const CONSENTIMENTO_ANTES =
  "Concordo em receber pelo WhatsApp mensagens da CompanyChat relacionadas à " +
  "minha solicitação de teste, conforme a";

export const CONSENTIMENTO_DEPOIS =
  ". Posso solicitar a interrupção do contato a qualquer momento.";

export const CONSENTIMENTO_LINK = "Política de Privacidade";

export const CONSENTIMENTO_TEXTO = `${CONSENTIMENTO_ANTES} ${CONSENTIMENTO_LINK}${CONSENTIMENTO_DEPOIS}`;
