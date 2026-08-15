"use client";

import { motion } from "framer-motion";
import {
  moeda,
  moedaCurta,
  numero,
  serieDeEvolucao,
  type Resultado,
} from "@/components/calculadora/calculo";

/* Paleta das séries. Fora dos tokens de propósito: são cores de dado, não de
   interface, e precisam ficar estáveis mesmo se a marca mudar de tom. */
const COR_ATUAL = "#a1a1aa";
const COR_FUTURO = "#f87171";
const COR_HIBRIDO = "#00ab7a";

const GRADE = "rgba(255,255,255,0.08)";
const EIXO = "#a1a1aa";

const LARGURA = 640;
const ALTURA = 300;
const M = { topo: 24, direita: 18, base: 52, esquerda: 76 };
const PLOT = {
  x0: M.esquerda,
  x1: LARGURA - M.direita,
  y0: M.topo,
  y1: ALTURA - M.base,
};
const PLOT_L = PLOT.x1 - PLOT.x0;
const PLOT_A = PLOT.y1 - PLOT.y0;

/** Teto e divisões "redondos" para o eixo de valores: sem isso os rótulos
 *  saem como R$ 15.344 e a leitura do gráfico fica pior que a da tabela. */
function escalaVertical(maiorValor: number) {
  if (maiorValor <= 0) return { teto: 1, marcas: [0, 1] };

  const alvoDoPasso = (maiorValor * 1.08) / 4;
  const expoente = Math.floor(Math.log10(alvoDoPasso));
  const base = 10 ** expoente;
  /* Escada fina de propósito: com poucos degraus a barra de R$ 19 mil cai num
     eixo de R$ 40 mil e o gráfico vira meia folha vazia. */
  const passo =
    [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]
      .map((c) => c * base)
      .find((p) => p >= alvoDoPasso) ?? 10 * base;

  return {
    teto: passo * 4,
    marcas: [0, 1, 2, 3, 4].map((i) => passo * i),
  };
}

function Moldura({
  marcas,
  teto,
  children,
}: {
  marcas: number[];
  teto: number;
  children: React.ReactNode;
}) {
  return (
    <>
      {marcas.map((marca) => {
        const y = PLOT.y1 - (marca / teto) * PLOT_A;
        return (
          <g key={marca}>
            <line
              x1={PLOT.x0}
              x2={PLOT.x1}
              y1={y}
              y2={y}
              stroke={GRADE}
              strokeDasharray="3 4"
            />
            <text
              x={PLOT.x0 - 12}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill={EIXO}
            >
              {moedaCurta(marca)}
            </text>
          </g>
        );
      })}
      {children}
    </>
  );
}

/** Retângulo com os dois cantos de cima arredondados. */
function barra(x: number, y: number, largura: number, altura: number) {
  const r = Math.min(10, largura / 2, Math.max(altura, 0));
  return [
    `M ${x} ${y + altura}`,
    `L ${x} ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    `L ${x + largura - r} ${y}`,
    `Q ${x + largura} ${y} ${x + largura} ${y + r}`,
    `L ${x + largura} ${y + altura}`,
    "Z",
  ].join(" ");
}

export function GraficoBarras({ resultado }: { resultado: Resultado }) {
  const dados = [
    { nome: "Modelo atual", valor: resultado.atual, cor: COR_ATUAL },
    { nome: "API pura", valor: resultado.futuro, cor: COR_FUTURO },
    { nome: "Modelo Híbrido", valor: resultado.hibrido, cor: COR_HIBRIDO },
  ];

  const { teto, marcas } = escalaVertical(Math.max(...dados.map((d) => d.valor)));
  const faixa = PLOT_L / dados.length;
  const largura = Math.min(86, faixa * 0.5);

  return (
    <figure className="rounded-3xl border border-dark-border bg-dark-elevated p-5 sm:p-6">
      <figcaption className="text-base font-bold text-dark-text">
        Comparativo visual dos cenários
      </figcaption>
      <p className="mt-1 text-sm text-dark-muted">
        Custo mensal estimado em cada um dos três modelos.
      </p>

      <svg
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        className="mt-4 w-full"
        role="img"
        aria-label={dados
          .map((d) => `${d.nome}: ${moeda(d.valor)} por mês`)
          .join(". ")}
      >
        <Moldura marcas={marcas} teto={teto}>
          {dados.map((item, indice) => {
            const centro = PLOT.x0 + faixa * (indice + 0.5);
            const altura = (item.valor / teto) * PLOT_A;
            const y = PLOT.y1 - altura;

            return (
              <g key={item.nome}>
                <motion.path
                  d={barra(centro - largura / 2, y, largura, altura)}
                  fill={item.cor}
                  initial={{ scaleY: 0, opacity: 0.4 }}
                  whileInView={{ scaleY: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: indice * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
                />
                <text
                  x={centro}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill={item.cor}
                >
                  {moeda(item.valor)}
                </text>
                <text
                  x={centro}
                  y={PLOT.y1 + 24}
                  textAnchor="middle"
                  fontSize="12"
                  fill={EIXO}
                >
                  {item.nome}
                </text>
              </g>
            );
          })}
        </Moldura>
      </svg>
    </figure>
  );
}

export function GraficoEvolucao({ resultado }: { resultado: Resultado }) {
  const serie = serieDeEvolucao(resultado);
  const maiorMensagem = serie[serie.length - 1].mensagens || 1;
  const { teto, marcas } = escalaVertical(
    Math.max(...serie.map((p) => p.futuro))
  );

  const px = (mensagens: number) =>
    PLOT.x0 + (mensagens / maiorMensagem) * PLOT_L;
  const py = (valor: number) => PLOT.y1 - (valor / teto) * PLOT_A;

  const caminho = (chave: "atual" | "futuro" | "hibrido") =>
    serie.map((p) => `${px(p.mensagens)},${py(p[chave])}`).join(" ");

  const linhas = [
    { chave: "atual" as const, nome: "Modelo atual", cor: COR_ATUAL, espessura: 2 },
    { chave: "futuro" as const, nome: "API pura", cor: COR_FUTURO, espessura: 3 },
    {
      chave: "hibrido" as const,
      nome: "Modelo Híbrido CompanyChat",
      cor: COR_HIBRIDO,
      espessura: 3,
    },
  ];

  const marcasX = [0, 0.25, 0.5, 0.75, 1].map((f) =>
    Math.round(maiorMensagem * f)
  );

  return (
    <figure className="rounded-3xl border border-dark-border bg-dark-elevated p-5 sm:p-6">
      <figcaption className="text-base font-bold text-dark-text">
        O que as mensagens acrescentam à conta
      </figcaption>
      <p className="mt-1 text-sm text-dark-muted">
        Só o custo variável, sem o template. É onde os três cenários se separam.
      </p>

      <svg
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        className="mt-4 w-full"
        role="img"
        aria-label={`No volume de ${numero(
          maiorMensagem
        )} mensagens, as mensagens acrescentam ${moeda(
          resultado.futuro - resultado.custoFixo
        )} por mês na API pura e ${moeda(
          resultado.hibrido - resultado.custoFixo
        )} no Modelo Híbrido CompanyChat.`}
      >
        <Moldura marcas={marcas} teto={teto}>
          {marcasX.map((marca, indice) => (
            <text
              key={marca}
              x={px(marca)}
              y={PLOT.y1 + 24}
              /* Os rótulos das pontas ancoram para dentro; centralizados, o
                 primeiro e o último vazariam a área desenhável. */
              textAnchor={
                indice === 0
                  ? "start"
                  : indice === marcasX.length - 1
                    ? "end"
                    : "middle"
              }
              fontSize="12"
              fill={EIXO}
            >
              {numero(marca)}
            </text>
          ))}
          <text
            x={PLOT.x0 + PLOT_L / 2}
            y={ALTURA - 10}
            textAnchor="middle"
            fontSize="12"
            fill={EIXO}
          >
            Mensagens enviadas no mês
          </text>

          {linhas.map((linha, indice) => (
            <motion.polyline
              key={linha.chave}
              points={caminho(linha.chave)}
              fill="none"
              stroke={linha.cor}
              strokeWidth={linha.espessura}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15 * indice, ease: "easeOut" }}
            />
          ))}
        </Moldura>
      </svg>

      <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {linhas.map((linha) => (
          <li
            key={linha.chave}
            className="flex items-center gap-2 text-xs font-semibold text-dark-muted"
          >
            <span
              aria-hidden="true"
              className="h-0.5 w-5 rounded-full"
              style={{ backgroundColor: linha.cor }}
            />
            {linha.nome}
          </li>
        ))}
      </ul>
    </figure>
  );
}
