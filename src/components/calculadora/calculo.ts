import { categorias } from "@/components/api-oficial/pricing";

/** Campanha ativa: a empresa dispara template para uma base.
 *  Atendimento receptivo: o cliente inicia a conversa. */
export type Modo = "ativa" | "receptiva";

/** Preço por mensagem enviada no modelo futuro da Meta, cobrado por mensagem
 *  em vez de por janela de 24h. Três casas de propósito: arredondar para
 *  R$ 0,04 infla a conta em 14% e quem confere na calculadora acha erro. */
export const PRECO_POR_MENSAGEM = 0.035;

/** No modelo híbrido a API entrega o template e mais duas mensagens de
 *  roteamento; daí em diante a conversa segue na plataforma, sem custo por
 *  mensagem. Esse 2 é o que separa o cenário híbrido do de API pura. */
const MENSAGENS_DE_ROTEAMENTO = 2;

export type EntradasAtiva = {
  precoTemplate: number;
  contatos: number;
  taxaResposta: number;
  campanhas: number;
  mensagensPorConversa: number;
};

export type EntradasReceptiva = {
  mensagensPorAtendimento: number;
  atendimentosPorMes: number;
};

/** O wizard guarda as respostas por chave, já que os passos são declarativos.
 *  A conversão para o formato tipado acontece na fronteira, em `calcular`. */
export type Valores = Record<string, number>;

export type ItemResumo = { rotulo: string; valor: string };

export type Resultado = {
  atual: number;
  futuro: number;
  hibrido: number;
  /** Quanto o modelo híbrido evita por mês em relação à API pura. */
  economiaMensal: number;
  prejuizoAnual: number;
  /** Fatia da conta da API pura que o híbrido evita. Não é "de quanto a conta
   *  aumenta": no modo receptivo o híbrido custa zero e a razão contra ele seria
   *  divisão por zero. */
  percentualEvitado: number;
  resumo: ItemResumo[];
  /** Volume de mensagens usado no eixo X do gráfico de evolução. */
  mensagensApi: number;
  /** Piso de custo que não depende do volume de mensagens. */
  custoFixo: number;
  /** Teto de mensagens cobradas no híbrido. */
  mensagensRoteamento: number;
  templates: number;
  conversas: number;
};

/* ── Formatadores ───────────────────────────────────────────────────────── */

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Para valores abaixo de um centavo cheio, como o preço por mensagem. */
const brlPreciso = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

export const moeda = (valor: number) => brl.format(valor);
export const numero = (valor: number) => inteiro.format(valor);
export const percentual = (valor: number) => `${decimal.format(valor)}%`;

/** Mostra três casas só quando o valor tem fração de centavo a preservar. */
export function moedaUnitaria(valor: number) {
  const temFracaoDeCentavo = Math.round(valor * 1000) % 10 !== 0;
  return temFracaoDeCentavo ? brlPreciso.format(valor) : brl.format(valor);
}

/** Abreviação usada nos eixos dos gráficos: R$ 15.344 vira "R$ 15k".
 *  Mantém uma casa quando o milhar é quebrado — arredondar 1.200 e 1.600 para
 *  "1k" e "2k" faria dois degraus vizinhos do eixo parecerem o mesmo salto. */
export function moedaCurta(valor: number) {
  if (valor < 1000) return `R$ ${Math.round(valor)}`;
  const milhares = valor / 1000;
  return `R$ ${decimal.format(milhares)}k`;
}

/* ── Preços de template ─────────────────────────────────────────────────── */

/** Os preços vêm de `api-oficial/pricing.ts`, que já é a fonte de verdade do
 *  site e da base de conhecimento da Jade. Divergir aqui criaria dois números
 *  oficiais para a mesma pergunta. */
export const opcoesDeTemplate = categorias.map((categoria) => ({
  id: categoria.id,
  nome: categoria.nome,
  preco: categoria.precoPadrao,
  descricao: `${moedaUnitaria(categoria.precoPadrao)} por template`,
  quandoUsa: categoria.quandoUsa,
}));

/* ── Cálculo ────────────────────────────────────────────────────────────── */

function calcularAtiva(entradas: EntradasAtiva): Resultado {
  const {
    precoTemplate,
    contatos,
    taxaResposta,
    campanhas,
    mensagensPorConversa,
  } = entradas;

  const templates = contatos * campanhas;
  const conversas = templates * (taxaResposta / 100);
  const mensagensApi = conversas * mensagensPorConversa;
  const mensagensRoteamento = conversas * MENSAGENS_DE_ROTEAMENTO;

  const atual = templates * precoTemplate;
  const futuro = atual + mensagensApi * PRECO_POR_MENSAGEM;
  const hibrido = atual + mensagensRoteamento * PRECO_POR_MENSAGEM;

  return {
    atual,
    futuro,
    hibrido,
    ...derivados(futuro, hibrido),
    mensagensApi,
    custoFixo: atual,
    mensagensRoteamento,
    templates,
    conversas,
    resumo: [
      { rotulo: "Contatos impactados", valor: numero(contatos) },
      { rotulo: "Campanhas por mês", valor: numero(campanhas) },
      { rotulo: "Templates enviados", valor: numero(templates) },
      { rotulo: "Preço do template", valor: moedaUnitaria(precoTemplate) },
      { rotulo: "Taxa de resposta", valor: percentual(taxaResposta) },
      { rotulo: "Conversas com resposta", valor: numero(conversas) },
      { rotulo: "Mensagens por conversa", valor: numero(mensagensPorConversa) },
      {
        rotulo: "Mensagens cobradas no modelo novo",
        valor: `${numero(mensagensApi)} × ${moedaUnitaria(PRECO_POR_MENSAGEM)}`,
      },
      {
        rotulo: "Preço por mensagem enviada",
        valor: moedaUnitaria(PRECO_POR_MENSAGEM),
      },
    ],
  };
}

function calcularReceptiva(entradas: EntradasReceptiva): Resultado {
  const { mensagensPorAtendimento, atendimentosPorMes } = entradas;

  const mensagensApi = atendimentosPorMes * mensagensPorAtendimento;

  /* Hoje a conversa iniciada pelo cliente abre a janela de 24h sem custo por
     mensagem, e no híbrido ela é atendida na plataforma — por isso os dois
     cenários ficam em zero e só a API pura acumula custo. */
  const atual = 0;
  const futuro = mensagensApi * PRECO_POR_MENSAGEM;
  const hibrido = 0;

  return {
    atual,
    futuro,
    hibrido,
    ...derivados(futuro, hibrido),
    mensagensApi,
    custoFixo: 0,
    mensagensRoteamento: 0,
    templates: 0,
    conversas: atendimentosPorMes,
    resumo: [
      { rotulo: "Atendimentos por mês", valor: numero(atendimentosPorMes) },
      {
        rotulo: "Mensagens por atendimento",
        valor: numero(mensagensPorAtendimento),
      },
      {
        rotulo: "Mensagens cobradas no modelo novo",
        valor: `${numero(mensagensApi)} × ${moedaUnitaria(PRECO_POR_MENSAGEM)}`,
      },
      {
        rotulo: "Preço por mensagem enviada",
        valor: moedaUnitaria(PRECO_POR_MENSAGEM),
      },
    ],
  };
}

function derivados(futuro: number, hibrido: number) {
  const economiaMensal = Math.max(0, futuro - hibrido);
  return {
    economiaMensal,
    prejuizoAnual: economiaMensal * 12,
    percentualEvitado: futuro > 0 ? (economiaMensal / futuro) * 100 : 0,
  };
}

export function calcular(modo: Modo, valores: Valores): Resultado {
  return modo === "ativa"
    ? calcularAtiva(valores as unknown as EntradasAtiva)
    : calcularReceptiva(valores as unknown as EntradasReceptiva);
}

/** Série do gráfico de evolução, contando apenas o custo que as mensagens
 *  acrescentam. O template é um piso igual nos três cenários: somá-lo achataria
 *  as três curvas numa faixa estreita no topo e esconderia justamente a
 *  divergência que o gráfico existe para mostrar. */
export function serieDeEvolucao(resultado: Resultado, pontos = 24) {
  const { mensagensApi, mensagensRoteamento } = resultado;
  const passo = Math.max(mensagensApi, 1) / pontos;

  return Array.from({ length: pontos + 1 }, (_, indice) => {
    const mensagens = Math.round(passo * indice);
    const cobradasNoHibrido = Math.min(mensagens, mensagensRoteamento);
    return {
      mensagens,
      atual: 0,
      futuro: mensagens * PRECO_POR_MENSAGEM,
      hibrido: cobradasNoHibrido * PRECO_POR_MENSAGEM,
    };
  });
}
