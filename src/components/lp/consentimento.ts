/** Versão do texto de consentimento das LPs de anúncio (`/lp-empresas`,
 *  `/lp-adv`, `/lp-saude`, `/lp-seguros`).
 *
 *  A política em `/privacidade` promete guardar "a data, a hora e a versão do
 *  texto que você aceitou". A versão é esta constante; a data e a hora saem do
 *  clique de envio. Trocar o aviso embaixo do botão no `FormularioLead` exige
 *  trocar esta data — sem isso o registro aponta para um texto que já não é o
 *  que a pessoa leu.
 *
 *  Cada superfície tem a sua: a candidatura de `/10-empresas` usa
 *  `CONSENTIMENTO_VERSAO` de `dez-empresas/conteudo.ts`, e o teste grátis usa a
 *  de `lib/teste-gratis/consentimento.ts`. */
export const CONSENTIMENTO_VERSAO = "lp-2026-08-27";
