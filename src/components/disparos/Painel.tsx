"use client";

import { motion } from "framer-motion";
import { Send, Clock, Megaphone, XCircle, CheckCircle2, Eye, TrendingUp, Ban } from "lucide-react";

const topo = [
  { label: "Enviadas hoje", sub: "mensagens aceitas", valor: "12.480", icon: Send, cor: "text-primary", bg: "bg-primary/10" },
  { label: "Na fila", sub: "aguardando envio", valor: "340", icon: Clock, cor: "text-accent-blue", bg: "bg-accent-blue/10" },
  { label: "Campanhas", sub: "2 rodando", valor: "8", icon: Megaphone, cor: "text-accent-purple", bg: "bg-accent-purple/10" },
  { label: "Falhas", sub: "taxa 1,3%", valor: "162", icon: XCircle, cor: "text-accent-amber", bg: "bg-accent-amber/10" },
];

const entrega = [
  { label: "Entregues", valor: "12.318", icon: CheckCircle2, cor: "text-primary" },
  { label: "Lidas", valor: "9.213", icon: Eye, cor: "text-accent-blue" },
  { label: "Taxa entrega", valor: "98,7%", icon: TrendingUp, cor: "text-accent-purple" },
  { label: "Bloqueios", valor: "0", icon: Ban, cor: "text-accent-amber" },
];

export default function Painel() {
  return (
    <section id="painel" className="relative overflow-hidden bg-dark-base py-24">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #00ab7a 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex w-fit items-center gap-2.5 rounded-full border border-dark-border bg-dark-surface px-4 py-2 text-sm font-medium text-dark-muted">
            <span className="flex items-center gap-1.5 text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> API online
            </span>
            Painel em tempo real
          </div>
          <h2 className="text-3xl font-bold text-dark-text md:text-4xl">
            Você vê <span className="text-gradient-primary">tudo acontecendo</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-dark-muted">
            Cada mensagem enviada, entregue e lida aparece no painel na hora. Nada de
            planilha no escuro, é controle total da sua operação de disparo.
          </p>
        </motion.div>

        {/* Dashboard card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-14 overflow-hidden rounded-3xl border border-dark-border bg-dark-surface shadow-2xl shadow-black/40"
        >
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-dark-border px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-dark-text">Dashboard</p>
              <p className="text-xs text-dark-muted">Visão geral das suas campanhas de WhatsApp</p>
            </div>
            <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:inline">
              tempo real
            </span>
          </div>

          {/* Top metrics */}
          <div className="grid grid-cols-2 gap-px bg-dark-border lg:grid-cols-4">
            {topo.map((m) => (
              <div key={m.label} className="bg-dark-surface px-6 py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-dark-muted">{m.label}</p>
                    <p className="mt-2 text-3xl font-bold leading-none text-dark-text">{m.valor}</p>
                    <p className="mt-2 text-[11px] text-dark-muted">{m.sub}</p>
                  </div>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${m.bg} ${m.cor}`}>
                    <m.icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Entrega e leitura */}
          <div className="border-t border-dark-border px-6 py-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-dark-muted">
              Entrega e leitura
            </p>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {entrega.map((e) => (
                <div key={e.label} className="rounded-2xl border border-dark-border bg-dark-base px-5 py-4">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ${e.cor}`}>
                    <e.icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-2xl font-bold leading-none text-dark-text">{e.valor}</p>
                  <p className="mt-1.5 text-xs text-dark-muted">{e.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart + resumo */}
          <div className="grid grid-cols-1 gap-px border-t border-dark-border bg-dark-border lg:grid-cols-3">
            <div className="bg-dark-surface px-6 py-6 lg:col-span-2">
              <p className="mb-4 text-sm font-medium text-dark-text">Envios nas últimas 24h</p>
              <div className="flex h-32 items-end gap-1.5">
                {[28, 40, 34, 55, 48, 70, 62, 85, 78, 96, 88, 100, 82, 74, 90, 66].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.03, ease: "easeOut" }}
                    className="flex-1 rounded-t bg-gradient-to-t from-primary/30 to-primary"
                  />
                ))}
              </div>
            </div>
            <div className="bg-dark-surface px-6 py-6">
              <p className="mb-4 text-sm font-medium text-dark-text">Resumo</p>
              <ul className="space-y-3 text-sm">
                {[
                  ["Enviadas", "12.480"],
                  ["Entregues", "12.318"],
                  ["Falhas", "162"],
                  ["Rodando agora", "2"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between">
                    <span className="text-dark-muted">{k}</span>
                    <span className="font-mono text-dark-text">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
