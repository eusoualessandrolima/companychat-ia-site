/** Valor da variável de ambiente, caindo no padrão quando ela não veio.
 *
 *  `process.env.X ?? padrao` não basta. O `??` só cai no padrão para `null` e
 *  `undefined`, mas no build do Docker toda variável declarada como `ARG`/`ENV`
 *  e não preenchida chega como **string vazia** — e `""` vence o `??`.
 *
 *  Foi assim que o botão "Fazer Login" foi para produção com `href=""` e o
 *  botão de suporte apontou para `wa.me/` sem número: as duas variáveis existem
 *  no Coolify, vazias. Localmente nunca aparecia, porque lá elas são
 *  `undefined` de verdade e o `??` funcionava.
 *
 *  Passe sempre `process.env.NEXT_PUBLIC_X` literal na chamada: o Next só
 *  substitui a variável no bundle do cliente quando enxerga o acesso estático.
 */
export function envOu(valor: string | undefined, padrao: string) {
  const limpo = valor?.trim();
  return limpo ? limpo : padrao;
}
