/* Prova do consentimento (LGPD) dos formulários que gravam lead.
 *
 * A política publicada em `/privacidade` promete, textualmente, guardar "a
 * data, a hora e a versão do texto que você aceitou". Esta é a regra que
 * cumpre a promessa — e que decide de quem cobrá-la.
 *
 * A decisão mora aqui, e não dentro do Route Handler, porque `src/lib/` é o
 * que `npm run test:unidade` compila e carrega: regra que não pode ser testada
 * é regra que volta a se perder na próxima superfície nova. Foi exatamente o
 * que aconteceu com as LPs de anúncio, que ficaram um ano fora da guarda. */

/** Superfícies que não podem gravar lead sem prova de aceite.
 *
 *  `candidatura` — o formulário de `/10-empresas`, com checkbox explícito.
 *  `lp`          — as LPs de anúncio, onde o aceite é o próprio envio, como o
 *                  aviso embaixo do botão informa.
 *
 *  O quiz de `/comecar` está de fora de propósito: ele grava a cada etapa,
 *  desde antes de qualquer aviso, e exigir o aceite ali travaria a navegação
 *  no meio do funil. */
const COM_ACEITE = new Set(["candidatura", "lp"]);

export type Aceite = {
  consentimento: "true";
  consentimento_versao: string;
  consentimento_em: string;
};

export type Veredito =
  /** Superfície fora da regra: nada a exigir, nada a gravar. */
  | { situacao: "dispensado" }
  /** Aceite presente e válido: as chaves entram em `origem`. */
  | { situacao: "registrado"; campos: Aceite }
  /** Superfície sob a regra que não mandou o aceite. A rota recusa. */
  | { situacao: "ausente" };

type Corpo = {
  consentimento?: unknown;
  consentimentoVersao?: unknown;
  consentimentoEm?: unknown;
};

function texto(valor: unknown, limite: number) {
  return typeof valor === "string" ? valor.trim().slice(0, limite) : "";
}

/**
 * @param tipo               `origem.tipo` do lead — de qual formulário ele veio.
 * @param corpo              O corpo da requisição, ainda sem sanear.
 * @param soMarcandoWhatsApp Reenvio de um lead **já consentido** apenas para
 *   marcar o clique no WhatsApp (`sendBeacon`). Ele não carrega o aceite de
 *   novo; cobrá-lo aqui apagaria a medição sem proteger nada.
 * @param agora              Injetável para o teste não depender do relógio.
 */
export function avaliarAceite(
  tipo: string | undefined,
  corpo: Corpo,
  soMarcandoWhatsApp: boolean,
  agora: () => string = () => new Date().toISOString()
): Veredito {
  if (soMarcandoWhatsApp) return { situacao: "dispensado" };
  if (!tipo || !COM_ACEITE.has(tipo)) return { situacao: "dispensado" };
  if (corpo.consentimento !== true) return { situacao: "ausente" };

  return {
    situacao: "registrado",
    campos: {
      consentimento: "true",
      consentimento_versao: texto(corpo.consentimentoVersao, 40),
      /* Sem data enviada, vale a da gravação: perder a hora do aceite é pior
         que registrar uma aproximação de poucos milissegundos. */
      consentimento_em: texto(corpo.consentimentoEm, 40) || agora(),
    },
  };
}
