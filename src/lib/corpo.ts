/* Teto de tamanho do corpo das requisições.
 *
 * O App Router não impõe limite em Route Handler — `serverActions.bodySizeLimit`
 * só vale para Server Actions, e o projeto não usa nenhuma. Sem este guarda,
 * `await requisicao.json()` aloca o corpo inteiro em memória **antes** de
 * qualquer decisão: um POST de algumas centenas de megabytes derruba o
 * container, e o rate limit nem chega a ser consultado.
 *
 * O maior formulário legítimo do site (a candidatura de `/10-empresas`, com dez
 * campos e texto livre) não passa de poucos kilobytes. O webhook da Meta é o
 * caso de maior volume, e um lote de status fica na casa das dezenas de KB.
 *
 * `content-length` é declarado pelo cliente e portanto não é confiável sozinho:
 * quem mentir no cabeçalho passa por aqui. Ele barra o caso comum a custo zero;
 * o teto duro é do proxy (`buffering.maxRequestBodyBytes` no Traefik), que é
 * quem vê os bytes de verdade. */

const TETO_PADRAO = 64 * 1024;

export function corpoGrandeDemais(requisicao: Request, teto = TETO_PADRAO) {
  const declarado = requisicao.headers.get("content-length");
  if (!declarado) return false;

  const tamanho = Number(declarado);
  return Number.isFinite(tamanho) && tamanho > teto;
}

/** Resposta 413 padrão, para as rotas não divergirem no formato do erro. */
export function respostaCorpoGrande() {
  return Response.json(
    { ok: false, erro: "corpo grande demais" },
    { status: 413 }
  );
}
