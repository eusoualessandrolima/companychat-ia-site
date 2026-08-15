"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Calculator } from "lucide-react";
import { whatsappLink } from "./WhatsAppButton";
import { planos } from "./planos/planos-data";

/** Resumo dos planos na home. O detalhamento completo vive em /planos. */
export default function PlanosHome() {
  return (
    <section id="planos" className="relative overflow-hidden bg-dark-base py-24">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.09]"
          style={{
            background: "radial-gradient(circle, #00ab7a 0%, #0092ff 50%, transparent 70%)",
            animation: "blob-float 16s ease-in-out infinite",
          }}
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
          <h2 className="text-3xl font-bold text-dark-text md:text-4xl">
            Planos e <span className="text-gradient-primary">preços</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-dark-muted">
            Uma mensalidade com o assistente de IA, o CRM e a implantação inclusa.
            Sem taxa de setup e sem contrato de fidelidade.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          {planos.map((plano, i) => (
            <motion.div
              key={plano.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative flex flex-col rounded-3xl p-8 ${
                plano.destaque ? "glow-border bg-dark-surface" : "border border-dark-border bg-dark-surface/60"
              }`}
            >
              {plano.badge && (
                <span className="absolute -top-3 right-8 rounded-full bg-primary px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-on-primary shadow-lg shadow-primary/30">
                  {plano.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-dark-text">{plano.nome}</h3>

              <p className="mt-5 flex items-end gap-1.5">
                <span
                  className={`font-bold leading-none tracking-tight text-dark-text ${
                    plano.periodo ? "text-[44px]" : "text-[32px]"
                  }`}
                >
                  {plano.preco}
                </span>
                {plano.periodo && (
                  <span className="pb-1 text-base font-medium text-dark-muted">{plano.periodo}</span>
                )}
              </p>

              <ul className="mt-7 flex-1 space-y-3">
                {plano.resumo.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-dark-muted">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {plano.destaque ? (
                  <div className="cta-glow-wrap w-full">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-6 py-3.5 font-semibold text-on-primary shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark"
                    >
                      {plano.cta}
                    </a>
                  </div>
                ) : (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-dark-border bg-dark-elevated px-6 py-3.5 font-semibold text-dark-text transition-all hover:border-primary/40 hover:text-primary"
                  >
                    {plano.cta}
                  </a>
                )}

                <Link
                  href="/planos"
                  className="group flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-dark-border px-6 py-3.5 font-semibold text-dark-muted transition-all hover:border-primary/40 hover:text-primary sm:w-auto sm:px-7"
                >
                  Ver tudo
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center gap-2 text-center text-sm text-dark-muted sm:flex-row"
        >
          <Calculator aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
          O custo das mensagens é cobrado pela Meta e vem à parte.
          <Link href="/api-oficial#calculadora" className="font-semibold text-primary hover:underline">
            Simular na calculadora
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
