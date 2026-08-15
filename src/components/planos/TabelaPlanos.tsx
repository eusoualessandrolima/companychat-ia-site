"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { whatsappLink } from "../WhatsAppButton";
import { planos } from "./planos-data";

export default function TabelaPlanos() {
  return (
    <section id="planos" className="relative overflow-hidden bg-dark-base pt-32 pb-24">
      {/* Aurora */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full opacity-[0.10]"
          style={{
            background: "radial-gradient(circle, #00ab7a 0%, #0092ff 50%, transparent 70%)",
            animation: "blob-float 16s ease-in-out infinite",
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

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mx-auto mb-7 flex w-fit items-center gap-2.5 rounded-full border border-dark-border bg-dark-surface px-4 py-2 text-sm font-medium text-dark-muted">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-primary" />
            Preço fechado, com implantação inclusa
          </div>

          <h1
            aria-label="Planos e preços"
            className="text-[clamp(38px,5.5vw,64px)] font-bold leading-[1.03] tracking-[-0.03em] text-dark-text"
          >
            Planos e <span className="text-gradient-primary">preços</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-dark-muted">
            Uma mensalidade que já vem com o assistente de IA, o CRM Kanban, a
            plataforma inteira e a implantação feita por nós. Você começa a atender em
            até 7 dias.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 items-start gap-7 lg:grid-cols-2">
          {planos.map((plano, i) => (
            <motion.div
              key={plano.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative flex flex-col rounded-3xl p-8 sm:p-10 ${
                plano.destaque
                  ? "glow-border h-full bg-dark-surface"
                  : "border border-dark-border bg-dark-surface/60"
              }`}
            >
              {plano.badge && (
                <span className="absolute -top-3 right-8 rounded-full bg-primary px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-on-primary shadow-lg shadow-primary/30">
                  {plano.badge}
                </span>
              )}

              <h2 className="text-xl font-bold text-dark-text">{plano.nome}</h2>
              <p className="mt-3 min-h-[48px] text-sm leading-relaxed text-dark-muted">{plano.chamada}</p>

              <div className="mt-7 border-y border-dark-border py-6">
                <p className="flex items-end gap-1.5">
                  <span
                    className={`font-bold leading-none tracking-tight text-dark-text ${
                      plano.periodo ? "text-[52px]" : "text-[38px]"
                    }`}
                  >
                    {plano.preco}
                  </span>
                  {plano.periodo && (
                    <span className="pb-1.5 text-lg font-medium text-dark-muted">{plano.periodo}</span>
                  )}
                </p>
                <p className="mt-3 text-sm text-dark-muted">{plano.precoNota}</p>
              </div>

              <div className="mt-7 flex-1 space-y-7">
                {plano.grupos.map((grupo) => (
                  <div key={grupo.titulo}>
                    <p className="flex items-center gap-2 text-sm font-semibold text-dark-text">
                      <grupo.icon aria-hidden="true" className="h-4 w-4 text-primary" />
                      {grupo.titulo}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {grupo.itens.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-dark-muted">
                          <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {plano.nota && (
                  <div className="rounded-2xl border border-dark-border bg-dark-elevated/60 p-5">
                    <p className="text-sm font-semibold text-dark-text">{plano.nota.titulo}</p>
                    <p className="mt-2 text-sm leading-relaxed text-dark-muted">{plano.nota.texto}</p>
                  </div>
                )}
              </div>

              <div className="mt-9">
                {plano.destaque ? (
                  <div className="cta-glow-wrap">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 font-semibold text-on-primary shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40"
                    >
                      {plano.cta}
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                ) : (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2.5 rounded-full border border-dark-border bg-dark-elevated px-8 py-4 font-semibold text-dark-text transition-all hover:border-primary/40 hover:text-primary"
                  >
                    {plano.cta}
                  </a>
                )}
                <p className="mt-4 text-center text-xs text-dark-muted">{plano.rodape}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
