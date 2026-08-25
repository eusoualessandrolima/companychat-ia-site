/* Leitura da resposta do lead ao template: qual botão ele tocou ou, quando
   digitou, o que a frase quer dizer.

   Só três intenções importam aqui. Qualquer outra coisa é `conversa`, e quem
   decide o resto é a IA. */

export type Intencao = "continuar" | "depois" | "opt_out" | "conversa";

/* Os `payload` dos botões do template. Quem submete o template no WhatsApp
   Manager deve usar exatamente estes valores. */
export const BOTOES = {
  continuar: "teste_gratis_continuar",
  depois: "teste_gratis_agora_nao",
  optOut: "teste_gratis_sem_interesse",
} as const;

/* Rede de segurança para quando o payload não for o combinado.
 *
 * A interface do WhatsApp Manager nem sempre expõe o campo de payload em botão
 * de resposta rápida: em vários fluxos ela usa o próprio texto visível. Sem
 * isto, "Não tenho interesse" chegaria como payload desconhecido e cairia na
 * leitura de texto livre, que hoje acerta por coincidência das listas abaixo.
 * Coincidência não é garantia: uma edição futura em `RECUSA` ou `ADIAMENTO`
 * quebraria o opt-out por botão sem nenhum teste reclamar.
 *
 * As chaves são o texto dos botões já normalizado (sem acento, minúsculo). */
const TEXTO_DOS_BOTOES: Record<string, Intencao> = {
  "quero continuar": "continuar",
  "agora nao": "depois",
  "nao tenho interesse": "opt_out",
};

/* Frases de recusa. Comparadas sem acento e sem pontuação, contra o texto
   inteiro quando é curto: "não quero" numa frase longa costuma ser recusa de
   outra coisa ("não quero perder cliente"). */
const RECUSA = [
  "parar",
  "pare",
  "sair",
  "sai",
  "cancelar",
  "descadastrar",
  "remover",
  "remover meu numero",
  "remove meu numero",
  "tirar meu numero",
  "nao quero",
  "nao tenho interesse",
  "sem interesse",
  "nao me chame",
  "nao me chamem",
  "nao envie mais",
  "para de mandar",
  "stop",
];

const ADIAMENTO = ["agora nao", "depois", "mais tarde", "outra hora", "agora nao da"];

const ACEITE = ["quero continuar", "quero", "continuar", "sim", "pode ser", "bora", "vamos"];

export function normalizarTexto(bruto: string) {
  return bruto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** `payload` do botão tem prioridade sobre o texto: é escolha explícita. */
export function lerIntencao({
  payload,
  texto,
}: {
  payload?: string | null;
  texto?: string | null;
}): Intencao {
  if (payload) {
    if (payload === BOTOES.continuar) return "continuar";
    if (payload === BOTOES.depois) return "depois";
    if (payload === BOTOES.optOut) return "opt_out";

    // Payload fora do combinado: pode ser o texto visível do botão.
    const porTexto = TEXTO_DOS_BOTOES[normalizarTexto(payload)];
    if (porTexto) return porTexto;
  }

  if (!texto) return "conversa";
  const limpo = normalizarTexto(texto);
  if (!limpo) return "conversa";

  // O texto do botão vale como escolha explícita, antes da leitura livre.
  const comoBotao = TEXTO_DOS_BOTOES[limpo];
  if (comoBotao) return comoBotao;

  /* Uma resposta longa é conversa, mesmo contendo uma das frases. O corte em
     seis palavras separa "não quero" de "não quero perder mais nenhum lead". */
  const curta = limpo.split(" ").length <= 6;

  if (RECUSA.includes(limpo)) return "opt_out";
  if (curta && RECUSA.some((frase) => limpo.includes(frase))) return "opt_out";
  if (curta && ADIAMENTO.some((frase) => limpo.includes(frase))) return "depois";
  if (curta && ACEITE.includes(limpo)) return "continuar";

  return "conversa";
}
