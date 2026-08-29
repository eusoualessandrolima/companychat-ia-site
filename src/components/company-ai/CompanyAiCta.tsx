"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappLink } from "../WhatsAppButton";

const suave = [0.4, 0, 0.2, 1] as const;

export default function CompanyAiCta() {
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
          <span className="block text-dark-text">Tem algo que se repete todo dia?</span>
          <span className="block text-dark-muted">Então já dá para conversar.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-[19px] leading-[1.55] tracking-[-0.011em] text-dark-muted">
          Descreva o problema no WhatsApp e a gente diz, sem enrolação, se vale automatizar e
          como isso ficaria na prática.
        </p>

        <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-primary px-9 py-3.5 font-semibold tracking-[-0.01em] text-on-primary transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-primary-dark"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            Falar sobre o meu projeto
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0.5"
            />
          </a>
          <Link
            href="/agente-ia"
            className="flex items-center justify-center whitespace-nowrap rounded-full border border-white/10 px-9 py-3.5 font-semibold tracking-[-0.01em] text-dark-text transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-white/25"
          >
            Ver o agente de IA em ação
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
