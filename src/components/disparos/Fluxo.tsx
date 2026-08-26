"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileCheck2, Send, BarChart3 } from "lucide-react";

type Passo = {
  icon: React.ElementType;
  titulo: string;
  etapa: string;
  legenda: string;
  detalhe: string;
  cor: string;
  barra: string;
};

const passos: Passo[] = [
  {
    icon: Upload,
    titulo: "Importe os contatos",
    etapa: "passo 1",
    legenda: "Planilha ou CRM",
    detalhe:
      "Suba sua lista por planilha (CSV/Excel) ou traga direto do CRM. A ferramenta organiza tudo em contatos, com histórico de campanhas e status de cada número.",
    cor: "text-primary",
    barra: "bg-primary",
  },
  {
    icon: FileCheck2,
    titulo: "Monte a campanha",
    etapa: "passo 2",
    legenda: "Template aprovado",
    detalhe:
      "Escolha um template já aprovado pela Meta, personalize com variáveis (nome, pedido, data) e segmente quem vai receber. Tudo dentro das regras da categoria de marketing.",
    cor: "text-accent-blue",
    barra: "bg-accent-blue",
  },
  {
    icon: Send,
    titulo: "Dispare via API Oficial",
    etapa: "passo 3",
    legenda: "Em fila, sem bloqueio",
    detalhe:
      "A campanha entra na fila e sai pelo número oficial da sua empresa, no ritmo certo para não disparar alertas. Você acompanha os disparos ao vivo, um a um.",
    cor: "text-accent-purple",
    barra: "bg-accent-purple",
  },
  {
    icon: BarChart3,
    titulo: "Acompanhe os resultados",
    etapa: "passo 4",
    legenda: "Entregas e leituras",
    detalhe:
      "Veja em tempo real quantas foram entregues, lidas e respondidas. Relatórios completos por campanha e logs de cada envio para você medir e otimizar.",
    cor: "text-accent-amber",
    barra: "bg-accent-amber",
  },
];

export default function Fluxo() {
  const [ativo, setAtivo] = useState(0);
  const passo = passos[ativo];

  return (
    <section id="fluxo" className="relative bg-background py-24">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Da lista ao resultado em <span className="text-primary-text">4 passos</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Um fluxo simples: você importa, monta a campanha, dispara e acompanha.
            A parte técnica da API Oficial fica com a gente.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-14 overflow-hidden rounded-3xl border border-dark-border bg-dark-base p-6 shadow-2xl shadow-black/20 sm:p-10"
        >
          <div className="relative">
            <div className="absolute left-0 right-0 top-6 hidden h-1 rounded-full bg-dark-border sm:block" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 sm:gap-3">
              {passos.map((p, i) => {
                const isActive = i === ativo;
                return (
                  <button
                    key={i}
                    onClick={() => setAtivo(i)}
                    aria-pressed={isActive}
                    aria-label={`${p.titulo} (${p.etapa}): ${p.legenda}`}
                    className="group relative flex items-start gap-4 text-left sm:flex-col sm:items-center sm:text-center"
                  >
                    <span
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        isActive
                          ? `border-transparent ${p.barra} text-white shadow-lg`
                          : "border-dark-border bg-dark-surface text-dark-muted group-hover:border-white/20"
                      }`}
                    >
                      <p.icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="sm:mt-3">
                      <p
                        className={`text-sm font-semibold transition-colors ${
                          isActive ? "text-dark-text" : "text-dark-muted group-hover:text-dark-text"
                        }`}
                      >
                        {p.titulo}
                      </p>
                      <p className={`mt-0.5 text-xs font-mono ${isActive ? p.cor : "text-dark-muted"}`}>
                        {p.etapa}
                      </p>
                      <p className="mt-1 text-xs text-dark-muted">{p.legenda}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div aria-live="polite" className="mt-8 rounded-2xl border border-dark-border bg-dark-surface p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={ativo}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-4"
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 ${passo.cor}`}>
                  <passo.icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-dark-text">
                    {passo.titulo} <span className={`ml-1 font-mono text-xs ${passo.cor}`}>{passo.etapa}</span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-dark-muted">{passo.detalhe}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
