import { Headset, Send, type LucideIcon } from "lucide-react";
import {
  moedaUnitaria,
  numero,
  opcoesDeTemplate,
  PRECO_POR_MENSAGEM,
  type Modo,
  type Resultado,
} from "@/components/calculadora/calculo";

export type Opcao = {
  rotulo: string;
  descricao: string;
  valor: number;
};

export type Passo = {
  chave: string;
  pergunta: string;
  ajuda: string;
  tipo: "numero" | "escolha";
  exemplo?: string;
  sufixo?: string;
  opcoes?: Opcao[];
};

export const MODOS: {
  valor: Modo;
  rotulo: string;
  descricao: string;
  Icone: LucideIcon;
}[] = [
  {
    valor: "ativa",
    rotulo: "Campanha ativa",
    descricao: "Você envia templates para uma base de contatos",
    Icone: Send,
  },
  {
    valor: "receptiva",
    rotulo: "Atendimento receptivo",
    descricao: "O cliente inicia a conversa com a sua empresa",
    Icone: Headset,
  },
];

export const AJUDA_DO_MODO =
  "Campanha ativa: você dispara mensagens template para uma base de contatos. " +
  "Atendimento receptivo: o cliente é quem inicia a conversa. Escolha a que " +
  "representa o maior volume da sua operação hoje.";

export const PASSOS_ATIVA: Passo[] = [
  {
    chave: "precoTemplate",
    pergunta: "Que tipo de template você envia nas suas campanhas?",
    ajuda:
      "A categoria define o preço da mensagem que abre a conversa. São os " +
      "valores que a Meta cobra no Brasil, os mesmos que usamos na página da " +
      "API Oficial.",
    tipo: "escolha",
    opcoes: opcoesDeTemplate.map((opcao) => ({
      rotulo: opcao.nome,
      descricao: opcao.descricao,
      valor: opcao.preco,
    })),
  },
  {
    chave: "contatos",
    pergunta: "Para quantos contatos você dispara cada campanha?",
    ajuda:
      "Informe o número de contatos únicos que recebem a campanha. Ele é " +
      "multiplicado pelo número de campanhas do mês para chegar ao total de " +
      "templates enviados.",
    tipo: "numero",
    exemplo: "Ex.: 10.000",
    sufixo: "contatos",
  },
  {
    chave: "taxaResposta",
    pergunta: "Qual a taxa de resposta dessas campanhas?",
    ajuda:
      "É o percentual de contatos que respondem e abrem uma conversa. Quanto " +
      "maior a taxa, mais conversas — e é dentro delas que o modelo novo passa " +
      "a cobrar por mensagem enviada.",
    tipo: "numero",
    exemplo: "Ex.: 12",
    sufixo: "%",
  },
  {
    chave: "campanhas",
    pergunta: "Quantas campanhas você envia por mês?",
    ajuda:
      "Considere todos os disparos de template feitos no mês, somando " +
      "promoções, avisos e reengajamento.",
    tipo: "numero",
    exemplo: "Ex.: 4",
    sufixo: "campanhas por mês",
  },
  {
    chave: "mensagensPorConversa",
    pergunta: "Quantas mensagens a sua empresa envia por conversa?",
    ajuda:
      "Conte apenas as mensagens que partem da sua empresa, não as do cliente. " +
      "É esse número que o modelo novo multiplica para chegar ao custo.",
    tipo: "numero",
    exemplo: "Ex.: 8",
    sufixo: "mensagens por conversa",
  },
];

export const PASSOS_RECEPTIVA: Passo[] = [
  {
    chave: "mensagensPorAtendimento",
    pergunta: "Quantas mensagens você envia por atendimento?",
    ajuda:
      "Considere a média de mensagens que a sua equipe envia em cada " +
      "atendimento. No modelo novo, cada uma delas passa a ser cobrada.",
    tipo: "numero",
    exemplo: "Ex.: 8",
    sufixo: "mensagens por atendimento",
  },
  {
    chave: "atendimentosPorMes",
    pergunta: "Quantos atendimentos você recebe por mês?",
    ajuda:
      "É o volume mensal de conversas iniciadas pelo cliente — dúvidas, " +
      "pedidos, suporte e orçamento.",
    tipo: "numero",
    exemplo: "Ex.: 11.000",
    sufixo: "atendimentos por mês",
  },
];

export const PADROES_ATIVA = {
  precoTemplate: opcoesDeTemplate[0].preco,
  contatos: 10000,
  taxaResposta: 12,
  campanhas: 4,
  mensagensPorConversa: 8,
};

export const PADROES_RECEPTIVA = {
  mensagensPorAtendimento: 8,
  atendimentosPorMes: 11000,
};

export const VAZIO_ATIVA = {
  precoTemplate: opcoesDeTemplate[0].preco,
  contatos: 0,
  taxaResposta: 0,
  campanhas: 0,
  mensagensPorConversa: 0,
};

export const VAZIO_RECEPTIVA = {
  mensagensPorAtendimento: 0,
  atendimentosPorMes: 0,
};

/** Textos dos três cards de cenário, montados com os números já calculados. */
export function textosDoResultado(modo: Modo, resultado: Resultado) {
  if (modo === "ativa") {
    return {
      introducao:
        "Simulação de campanha ativa, comparando o custo do template no modelo " +
        "atual, na API pura do modelo novo e no Modelo Híbrido CompanyChat.",
      atual: {
        descricao:
          "Cobra o template que abre a campanha. As mensagens seguintes da " +
          "conversa não entram como custo variável.",
        detalhe: `${numero(resultado.templates)} templates por mês`,
      },
      futuro: {
        descricao:
          "Cobra o template e também cada mensagem que a sua empresa envia nas " +
          "conversas geradas pela campanha.",
        detalhe: `${numero(resultado.conversas)} conversas • ${numero(
          resultado.mensagensApi
        )} mensagens cobradas`,
      },
      hibrido: {
        descricao:
          "Template pela API Oficial e mais duas mensagens de roteamento. " +
          "Depois disso a conversa segue na plataforma, sem custo por mensagem.",
        detalhe: `${numero(
          resultado.mensagensRoteamento
        )} mensagens de roteamento • restante na plataforma`,
      },
    };
  }

  return {
    introducao:
      "Simulação de atendimento receptivo, comparando o custo de hoje, a API " +
      "pura do modelo novo e o Modelo Híbrido CompanyChat.",
    atual: {
      descricao:
        "Conversa iniciada pelo cliente abre a janela de 24 horas e hoje não " +
        "gera custo por mensagem enviada.",
      detalhe: "Custo variável zero no modelo atual",
    },
    futuro: {
      descricao:
        "Cada mensagem enviada pela sua equipe durante o atendimento passa a " +
        "ser cobrada, multiplicada pelo volume de conversas.",
      detalhe: `${numero(resultado.mensagensApi)} mensagens × ${moedaUnitaria(
        PRECO_POR_MENSAGEM
      )}`,
    },
    hibrido: {
      descricao:
        "O atendimento receptivo é conduzido na plataforma, sem custo variável " +
        "por mensagem enviada.",
      detalhe: "Atendimento na plataforma • sem custo por mensagem",
    },
  };
}

/** Linhas da tabela comparativa ao pé do resultado. */
export function linhasDaTabela(modo: Modo, resultado: Resultado) {
  const ativa = modo === "ativa";

  return [
    {
      nome: "Modelo atual",
      entra: ativa
        ? "Template que abre a campanha. As mensagens seguintes não entram como custo variável."
        : "Conversa iniciada pelo cliente, dentro da janela de 24 horas. Sem custo por mensagem.",
      custo: resultado.atual,
      diferenca: resultado.atual - resultado.hibrido,
      tom: "neutro" as const,
    },
    {
      nome: "Modelo novo, API pura",
      entra: ativa
        ? "Template mais cada mensagem enviada pela empresa nas conversas com resposta."
        : "Atendimentos × mensagens enviadas pela empresa × preço por mensagem.",
      custo: resultado.futuro,
      diferenca: resultado.futuro - resultado.hibrido,
      tom: "risco" as const,
    },
    {
      nome: "Modelo Híbrido CompanyChat",
      entra: ativa
        ? "Template pela API mais duas mensagens de roteamento. A conversa segue na plataforma."
        : "Atendimento conduzido na plataforma, sem custo variável por mensagem.",
      custo: resultado.hibrido,
      diferenca: 0,
      tom: "escolha" as const,
    },
  ];
}
