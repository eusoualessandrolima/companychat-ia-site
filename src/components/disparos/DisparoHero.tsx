"use client";

import { motion } from "framer-motion";
import { ArrowRight, Rocket, Send, ShieldCheck } from "lucide-react";
import { whatsappLink } from "../WhatsAppButton";

const metrics = [
  { label: "Enviadas hoje", valor: "12.480", cor: "text-primary" },
  { label: "Taxa entrega", valor: "98,7%", cor: "text-accent-blue" },
  { label: "Lidas", valor: "9.213", cor: "text-accent-purple" },
];

export default function DisparoHero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-dark-base pt-16">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full opacity-[0.10]"
          style={{
            background: "radial-gradient(circle, #00ab7a 0%, #0092ff 50%, transparent 70%)",
            animation: "blob-float 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-48 -right-32 h-[600px] w-[600px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, #00ab7a 60%, transparent 70%)",
            animation: "blob-float-slow 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-4 py-20 lg:grid-cols-2">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-8 flex w-fit items-center gap-2.5 rounded-full border border-dark-border bg-dark-surface px-4 py-2 text-sm font-medium text-dark-muted lg:mx-0"
          >
            <Rocket className="h-4 w-4 text-primary" />
            Novo · Ferramenta de disparo em massa
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(36px,5vw,60px)] font-bold leading-[1.03] tracking-[-0.03em] text-dark-text"
          >
            Disparos em massa no WhatsApp com a{" "}
            <span className="text-gradient-primary">API Oficial</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-dark-muted lg:mx-0"
          >
            Envie campanhas de marketing para milhares de contatos com templates
            aprovados, acompanhe entregas e leituras em tempo real e integre tudo ao
            seu CRM. Sem risco de bloqueio, no número oficial da sua empresa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <div className="cta-glow-wrap">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2.5 rounded-full bg-primary px-9 py-4 font-semibold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40"
              >
                <Send className="h-4 w-4" />
                Quero disparar em massa
              </a>
            </div>
            <a
              href="#recursos"
              className="flex items-center justify-center gap-2 rounded-full border border-dark-border bg-dark-surface px-9 py-4 font-semibold text-dark-text transition-all hover:border-primary/40 hover:text-primary"
            >
              Ver a ferramenta
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-2 text-xs text-dark-muted lg:justify-start"
          >
            <ShieldCheck className="h-4 w-4 text-primary" />
            100% via API Oficial da Meta · número verificado, sem risco de ban
          </motion.div>
        </div>

        {/* Painel mock */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="overflow-hidden rounded-3xl border border-dark-border bg-dark-surface shadow-2xl shadow-black/50">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-dark-border px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Send className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-none text-dark-text">Painel de Campanhas</p>
                  <p className="mt-1 text-[11px] text-dark-muted">WhatsApp · API Oficial</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                API online
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-px bg-dark-border">
              {metrics.map((m) => (
                <div key={m.label} className="bg-dark-surface px-4 py-4">
                  <p className={`text-lg font-bold leading-none ${m.cor}`}>{m.valor}</p>
                  <p className="mt-1.5 text-[11px] leading-tight text-dark-muted">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="px-5 py-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium text-dark-muted">Envios nas últimas 24h</p>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-primary">tempo real</span>
              </div>
              <div className="flex h-24 items-end gap-1.5">
                {[35, 52, 44, 68, 58, 82, 74, 95, 88, 100, 76, 90].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.6, delay: 0.6 + i * 0.05, ease: "easeOut" }}
                    className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Glow */}
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
