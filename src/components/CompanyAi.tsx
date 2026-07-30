"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { whatsappLink } from "./WhatsAppButton";
import { construcoes, consultoria } from "./company-ai/company-ai-data";

const suave = [0.4, 0, 0.2, 1] as const;

/** Resumo da Company AI na home. A história completa vive em /company-ai. */
export default function CompanyAi() {
  return (
    <section id="company-ai" className="relative overflow-hidden bg-dark-base py-28">
      {/* Brilho único e imóvel, no lugar dos blobs animados */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/4 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.09] blur-[150px]"
        style={{ background: "radial-gradient(ellipse, #00ab7a 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: suave }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] font-medium tracking-[-0.01em] text-dark-muted">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
              Company AI
            </span>

            <h2 className="mt-7 text-[clamp(32px,3.8vw,48px)] font-semibold leading-[1.06] tracking-[-0.025em] text-dark-text">
              O que não cabe no pronto,{" "}
              <span className="text-gradient-primary">a gente constrói</span>
            </h2>

            <p className="mt-7 text-[18px] leading-[1.6] tracking-[-0.011em] text-dark-muted">
              Muita gente vê o que a inteligência artificial faz, acha incrível e nunca sai do
              lugar. Não é falta de vontade: é falta de tempo, é ter uma empresa para tocar, é
              não querer passar noites aprendendo prompt e configurando ferramenta.
            </p>
            <p className="mt-4 text-[18px] leading-[1.6] tracking-[-0.011em] text-dark-muted">
              A Company AI existe para essa parte. Você descreve o problema repetitivo da sua
              empresa e a gente resolve, do jeito que o seu processo pede.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/company-ai"
                className="group flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-7 py-3.5 font-semibold tracking-[-0.01em] text-white transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-primary-dark"
              >
                Conhecer a Company AI
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/10 px-7 py-3.5 font-semibold tracking-[-0.01em] text-dark-text transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-white/25"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Contar o meu caso
              </a>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Consultoria: a frente que vem antes de construir qualquer coisa */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: suave }}
              className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-dark-surface p-6 sm:col-span-2"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(0,171,122,0.15) 0%, transparent 65%)",
                }}
              />
              <div className="relative flex gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <consultoria.icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                    Comece por aqui
                  </span>
                  <h3 className="mt-1.5 text-[19px] font-semibold leading-tight tracking-[-0.02em] text-dark-text">
                    {consultoria.nome}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed tracking-[-0.011em] text-dark-muted">
                    {consultoria.resumo}
                  </p>
                </div>
              </div>
            </motion.div>

            {construcoes.map((c, i) => (
              <motion.div
                key={c.nome}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.07, ease: suave }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-white/[0.16]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 0%, rgba(0,171,122,0.13) 0%, transparent 65%)",
                  }}
                />
                <div className="relative">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.text}`}
                  >
                    <c.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-dark-text">
                    {c.nome}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed tracking-[-0.011em] text-dark-muted">
                    {c.resumo}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
