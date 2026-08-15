"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Pencil,
  Printer,
  RotateCcw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import {
  GraficoBarras,
  GraficoEvolucao,
} from "@/components/calculadora/Graficos";
import {
  moeda,
  percentual,
  type Modo,
  type Resultado as TipoResultado,
} from "@/components/calculadora/calculo";
import {
  linhasDaTabela,
  textosDoResultado,
} from "@/components/calculadora/perguntas";

export default function Resultado({
  modo,
  resultado,
  aoEditar,
  aoRestaurarExemplo,
  aoPedirContato,
}: {
  modo: Modo;
  resultado: TipoResultado;
  aoEditar: () => void;
  aoRestaurarExemplo: () => void;
  aoPedirContato: () => void;
}) {
  const textos = textosDoResultado(modo, resultado);
  const linhas = linhasDaTabela(modo, resultado);

  const cartoes = [
    {
      etiqueta: "Base de comparação",
      Icone: BarChart3,
      titulo: "Modelo atual",
      descricao: textos.atual.descricao,
      valor: resultado.atual,
      detalhe: textos.atual.detalhe,
      moldura: "border-dark-border bg-dark-elevated",
      selo: "bg-white/5 text-dark-muted",
      cor: "text-dark-text",
    },
    {
      etiqueta: "Risco de orçamento",
      Icone: TriangleAlert,
      titulo: "Modelo novo, API pura",
      descricao: textos.futuro.descricao,
      valor: resultado.futuro,
      detalhe: textos.futuro.detalhe,
      moldura: "border-red-500/40 bg-red-500/5",
      selo: "bg-red-500 text-white",
      cor: "text-red-400",
    },
    {
      etiqueta: "Escolha inteligente",
      Icone: ShieldCheck,
      titulo: "Modelo Híbrido CompanyChat",
      descricao: textos.hibrido.descricao,
      valor: resultado.hibrido,
      detalhe: textos.hibrido.detalhe,
      moldura: "border-primary bg-primary/10 shadow-lg shadow-primary/10",
      selo: "bg-primary text-on-primary",
      cor: "text-primary",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <section className="rounded-3xl border border-dark-border bg-dark-surface p-5 sm:p-6">
        <h2 className="text-sm font-bold text-dark-text">
          Resumo das informações
        </h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {resultado.resumo.map((item) => (
            <div
              key={item.rotulo}
              className="rounded-xl border border-dark-border bg-dark-elevated p-3"
            >
              <dt className="text-xs leading-snug text-dark-muted">
                {item.rotulo}
              </dt>
              <dd className="mt-1 text-sm font-bold text-dark-text">
                {item.valor}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-3xl border border-dark-border bg-dark-surface p-5 sm:p-7">
        <h2 className="text-2xl font-bold text-dark-text">
          Comparativo dos 3 cenários
        </h2>
        <p className="mt-1.5 max-w-3xl leading-relaxed text-dark-muted">
          {textos.introducao}
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5 print:hidden">
          <button
            type="button"
            onClick={aoEditar}
            className="inline-flex items-center gap-2 rounded-full border border-dark-border px-4 py-2.5 text-sm font-semibold text-dark-text transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
            Editar respostas
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {cartoes.map((cartao) => (
            <article
              key={cartao.titulo}
              className={`rounded-2xl border-2 p-5 ${cartao.moldura}`}
            >
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${cartao.selo}`}
              >
                <cartao.Icone aria-hidden="true" className="h-3.5 w-3.5" />
                {cartao.etiqueta}
              </span>
              <h3 className="mt-3 text-base font-bold text-dark-text">
                {cartao.titulo}
              </h3>
              <p className="mt-1 text-xs leading-snug text-dark-muted">
                {cartao.descricao}
              </p>
              <p className={`mt-4 text-3xl font-bold ${cartao.cor}`}>
                {moeda(cartao.valor)}
                <span className="ml-1 text-sm font-medium text-dark-muted">
                  /mês
                </span>
              </p>
              <p className="mt-1 text-xs text-dark-muted">{cartao.detalhe}</p>
            </article>
          ))}
        </div>

        {resultado.economiaMensal > 0 && (
          <div className="mt-5 rounded-2xl border-2 border-primary bg-gradient-to-r from-primary/15 to-transparent p-5 sm:p-6">
            <p className="text-sm font-semibold leading-relaxed text-dark-text sm:text-base">
              Mantendo esse volume, a API pura consome{" "}
              <strong className="font-bold text-red-400">
                {moeda(resultado.prejuizoAnual)} a mais em 12 meses
              </strong>{" "}
              do que o Modelo Híbrido CompanyChat, que evita{" "}
              <strong className="font-bold text-primary">
                {percentual(resultado.percentualEvitado)}
              </strong>{" "}
              dessa conta.
            </p>

            <button
              type="button"
              onClick={aoPedirContato}
              className="animate-cta-pulse mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-amber px-7 py-4 text-base font-bold text-dark-base transition-transform hover:scale-[1.02] sm:w-auto print:hidden"
            >
              Quero falar com um especialista
            </button>
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <GraficoBarras resultado={resultado} />
        <GraficoEvolucao resultado={resultado} />
      </div>

      <section className="overflow-hidden rounded-3xl border border-dark-border bg-dark-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">
              Comparativo de custo mensal entre os três cenários
            </caption>
            <thead>
              <tr>
                {[
                  "Cenário",
                  "O que entra no cálculo",
                  "Custo mensal estimado",
                  "Diferença vs. Modelo Híbrido",
                ].map((titulo) => (
                  <th
                    key={titulo}
                    scope="col"
                    className="border-b border-dark-border bg-dark-elevated px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-dark-text"
                  >
                    {titulo}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhas.map((linha) => (
                <tr
                  key={linha.nome}
                  className={
                    linha.tom === "risco"
                      ? "bg-red-500/5"
                      : linha.tom === "escolha"
                        ? "bg-primary/10"
                        : ""
                  }
                >
                  <th
                    scope="row"
                    className="border-b border-dark-border px-4 py-3.5 align-top text-[13px] font-bold text-dark-text"
                  >
                    {linha.nome}
                  </th>
                  <td className="border-b border-dark-border px-4 py-3.5 align-top text-[13px] text-dark-muted">
                    {linha.entra}
                  </td>
                  <td
                    className={`border-b border-dark-border px-4 py-3.5 align-top text-[13px] font-bold ${
                      linha.tom === "risco"
                        ? "text-red-400"
                        : linha.tom === "escolha"
                          ? "text-primary"
                          : "text-dark-text"
                    }`}
                  >
                    {moeda(linha.custo)}
                  </td>
                  <td className="border-b border-dark-border px-4 py-3.5 align-top text-[13px] text-dark-muted">
                    {linha.diferenca > 0 ? `+ ${moeda(linha.diferenca)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-wrap gap-2.5 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-dark"
        >
          <Printer aria-hidden="true" className="h-4 w-4" />
          Imprimir ou salvar em PDF
        </button>
        <button
          type="button"
          onClick={aoRestaurarExemplo}
          className="inline-flex items-center gap-2 rounded-full border border-dark-border px-5 py-3 text-sm font-bold text-dark-text transition-colors hover:border-primary/50 hover:text-primary"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Restaurar o exemplo
        </button>
      </div>

      <p className="pt-1 text-xs leading-relaxed text-dark-muted">
        Estimativa baseada nos números informados e nos preços praticados pela
        Meta no Brasil, sujeitos a alteração. O custo real depende do seu
        volume, da categoria dos templates e do comportamento das conversas.
      </p>
    </motion.div>
  );
}
