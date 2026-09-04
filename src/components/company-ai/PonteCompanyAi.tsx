"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SITE_COMPANY_AI } from "@/lib/company-ai";

const suave = [0.4, 0, 0.2, 1] as const;

/* A Company AI tem site próprio desde 2026-09-04. Esta seção fecha a página
   apontando para lá: o visitante que quer projeto sob medida continua a
   jornada no endereço certo, com o CTA certo. */
export default function PonteCompanyAi() {
  return (
    <section className="relative overflow-hidden bg-dark-base py-28 md:py-36">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.10] blur-[150px]"
        style={{ background: "radial-gradient(ellipse, #00c896 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: suave }}
        className="relative mx-auto max-w-3xl px-4 text-center"
      >
        <h2 className="text-[clamp(34px,4.4vw,56px)] font-semibold leading-[1.06] tracking-[-0.025em]">
          <span className="block text-dark-text">A Company AI tem casa própria.</span>
          <span className="block text-dark-muted">Continue por lá.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-[19px] leading-[1.55] tracking-[-0.011em] text-dark-muted">
          Consultoria, capacidades de IA, o que entra em cada projeto, o método
          de trabalho e os treinamentos: está tudo reunido no site da Company AI.
        </p>

        <a
          href={SITE_COMPANY_AI}
          className="group mt-11 inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-primary px-9 py-3.5 font-semibold tracking-[-0.01em] text-on-primary transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-primary-dark"
        >
          Ir para o site da Company AI
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </motion.div>
    </section>
  );
}
