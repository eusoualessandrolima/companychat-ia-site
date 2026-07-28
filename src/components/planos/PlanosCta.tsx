"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { whatsappLink } from "../WhatsAppButton";

export default function PlanosCta() {
  return (
    <section className="relative overflow-hidden bg-dark-base py-24">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle, #00ab7a 0%, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl px-4 text-center"
      >
        <h2 className="text-3xl font-bold text-dark-text md:text-4xl">
          Ainda na dúvida sobre <span className="text-gradient-primary">qual plano</span> é o seu?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-dark-muted">
          Conte como funciona o seu atendimento hoje e a gente diz com franqueza se o
          Pro resolve ou se o seu caso pede um plano sob medida.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="cta-glow-wrap">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2.5 rounded-full bg-primary px-9 py-4 font-semibold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40"
            >
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              Falar com um especialista
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <Link
            href="/assistente-ia"
            className="flex items-center justify-center rounded-full border border-dark-border bg-dark-surface px-9 py-4 font-semibold text-dark-text transition-all hover:border-primary/40 hover:text-primary"
          >
            Ver o assistente atendendo
          </Link>
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-xs text-dark-muted">
          <ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" />
          Conversa sem compromisso, e a gente diz se não for para você
        </p>
      </motion.div>
    </section>
  );
}
