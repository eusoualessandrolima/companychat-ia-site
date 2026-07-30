"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { construcoes, consultoria } from "./company-ai-data";

const suave = [0.4, 0, 0.2, 1] as const;

export default function OqueConstruimos() {
  return (
    <section id="o-que-construimos" className="relative bg-dark-base py-28 md:py-36">
      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: suave }}
          className="max-w-3xl"
        >
          <h2 className="text-[clamp(34px,4.4vw,56px)] font-semibold leading-[1.06] tracking-[-0.025em]">
            <span className="block text-dark-text">Começa com uma conversa.</span>
            <span className="block text-dark-muted">Termina com algo funcionando.</span>
          </h2>
          <p className="mt-7 max-w-2xl text-[19px] leading-[1.55] tracking-[-0.011em] text-dark-muted">
            Nem todo problema pede software novo. Por isso a consultoria vem primeiro: ela diz o
            que vale construir. Se valer, a gente constrói.
          </p>
        </motion.div>

        {/* Frente em destaque: consultoria */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: suave }}
          className="group relative mt-16 overflow-hidden rounded-3xl border border-primary/20 bg-dark-surface p-8 md:p-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(0,171,122,0.16) 0%, transparent 62%)",
            }}
          />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <consultoria.icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <span className="mt-7 block text-[13px] font-medium uppercase tracking-[0.14em] text-primary">
                Comece por aqui
              </span>
              <h3 className="mt-3 text-[clamp(28px,3.2vw,40px)] font-semibold leading-[1.08] tracking-[-0.025em] text-dark-text">
                {consultoria.nome}
              </h3>
            </div>

            <div>
              <p className="text-[19px] leading-[1.55] tracking-[-0.011em] text-dark-muted">
                {consultoria.desc}
              </p>
              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {consultoria.exemplos.map((ex) => (
                  <li
                    key={ex}
                    className="flex items-start gap-2.5 text-[15px] leading-relaxed tracking-[-0.011em] text-dark-muted"
                  >
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {construcoes.map((c, i) => (
            <motion.div
              key={c.nome}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: suave }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-white/[0.16]"
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

                <h3 className="mt-7 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-dark-text">
                  {c.nome}
                </h3>
                <p className="mt-3 text-[17px] leading-[1.55] tracking-[-0.011em] text-dark-muted">
                  {c.desc}
                </p>

                <ul className="mt-7 space-y-2.5 border-t border-white/[0.07] pt-7">
                  {c.exemplos.map((ex) => (
                    <li
                      key={ex}
                      className="flex items-start gap-2.5 text-[15px] leading-relaxed tracking-[-0.011em] text-dark-muted"
                    >
                      <Check aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${c.text}`} />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
