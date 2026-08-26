"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Calculator, ShieldCheck } from "lucide-react";

export default function ApiHero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-dark-base pt-16">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full opacity-[0.10]"
          style={{
            background: "radial-gradient(circle, #00c896 0%, #0092ff 50%, transparent 70%)",
            animation: "blob-float 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-48 -right-32 h-[600px] w-[600px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #a78bfa 0%, #00c896 60%, transparent 70%)",
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

      <div className="relative mx-auto w-full max-w-4xl px-4 py-20 text-center">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-8 flex w-fit items-center gap-2.5 rounded-full border border-dark-border bg-dark-surface px-4 py-2 text-sm font-medium text-dark-muted"
        >
          <BadgeCheck aria-hidden="true" className="h-4 w-4 text-primary" />
          Guia oficial · WhatsApp Business API
        </motion.div>

        <motion.h1
          aria-label="Entenda a API Oficial do WhatsApp sem complicação"
          initial={{ y: 28 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(38px,5.5vw,68px)] font-bold leading-[1.02] tracking-[-0.03em] text-dark-text"
        >
          Entenda a <span className="text-gradient-primary">API Oficial</span>
          <br className="hidden sm:block" /> do WhatsApp sem complicação
        </motion.h1>

        <motion.p
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-7 max-w-2xl text-[17px] leading-relaxed text-dark-muted"
        >
          Como funciona a janela de 24 horas, quais são as categorias de mensagem e
          quanto você realmente paga. E no final, uma calculadora pra você estimar
          o custo do seu negócio em segundos.
        </motion.p>

        <motion.div
          initial={{ y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <div className="cta-glow-wrap">
            <a
              href="#calculadora"
              className="group flex items-center justify-center gap-2.5 rounded-full bg-primary px-9 py-4 font-semibold text-on-primary shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40"
            >
              <Calculator aria-hidden="true" className="h-4 w-4" />
              Calcular meu custo
            </a>
          </div>
          <a
            href="#janela"
            className="flex items-center justify-center gap-2 rounded-full border border-dark-border bg-dark-surface px-9 py-4 font-semibold text-dark-text transition-all hover:border-primary/40 hover:text-primary"
          >
            Como funciona
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-2 text-xs text-dark-muted"
        >
          <ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" />
          Valores aproximados da Meta · sempre confirme na documentação oficial
        </motion.div>
      </div>
    </section>
  );
}
