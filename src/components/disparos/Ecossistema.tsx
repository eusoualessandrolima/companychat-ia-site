"use client";

import { motion } from "framer-motion";
import { Bot, LayoutGrid, Send, Plus } from "lucide-react";

const pilares = [
  {
    icon: Bot,
    nome: "Agente de IA",
    desc: "Atende, qualifica e responde seus clientes no WhatsApp 24h por dia, sem pausa.",
    cor: "text-primary",
    bg: "bg-primary/10",
    borda: "border-primary/20",
  },
  {
    icon: LayoutGrid,
    nome: "CRM",
    desc: "Organiza contatos, conversas e vendas em um funil claro, tudo em um só lugar.",
    cor: "text-accent-blue",
    bg: "bg-accent-blue/10",
    borda: "border-accent-blue/20",
  },
  {
    icon: Send,
    nome: "Disparo em massa",
    desc: "Alcança toda a sua base com campanhas via API Oficial e mede cada resultado.",
    cor: "text-accent-purple",
    bg: "bg-accent-purple/10",
    borda: "border-accent-purple/20",
    destaque: true,
  },
];

export default function Ecossistema() {
  return (
    <section id="ecossistema" className="relative bg-background py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Três ferramentas, um <span className="text-primary">ecossistema</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            O disparo em massa não vive sozinho. Ele conversa com o agente de IA e com
            o CRM: você capta, atende e reengaja o cliente sem trocar de sistema.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {pilares.map((p, i) => (
            <div key={p.nome} className="relative flex">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`flex w-full flex-col items-center rounded-2xl border ${p.borda} ${
                  p.destaque ? "bg-card shadow-lg ring-1 ring-primary/10" : "bg-card shadow-sm"
                } p-8 text-center`}
              >
                <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${p.bg} ${p.cor}`}>
                  <p.icon aria-hidden="true" className="h-8 w-8" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-foreground">{p.nome}</h3>
                {p.destaque && (
                  <span className="mt-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    Novo
                  </span>
                )}
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{p.desc}</p>
              </motion.div>

              {i < pilares.length - 1 && (
                <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:flex">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-card-border bg-card text-text-secondary shadow-sm">
                    <Plus aria-hidden="true" className="h-4 w-4" />
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-text-secondary">
          Junte os três e você tem uma máquina de relacionamento: a IA responde, o CRM
          organiza e o disparo traz a base de volta para conversar.
        </p>
      </div>
    </section>
  );
}
