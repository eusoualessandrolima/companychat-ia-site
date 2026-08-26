"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import CtaTesteGratis from "../CtaTesteGratis";
import { CTA_LABEL_LONGO } from "@/lib/cta";

export default function DisparoCta() {
  return (
    <section className="relative overflow-hidden bg-dark-base py-24">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle, #00c896 0%, transparent 70%)" }}
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
          Pronto para disparar <span className="text-gradient-primary">com segurança?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-dark-muted">
          A gente configura a API Oficial, aprova seus templates e deixa a ferramenta
          rodando. Você só monta a campanha e acompanha os resultados.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="cta-glow-wrap">
            <CtaTesteGratis
              local="cta-disparos"
              className="group flex items-center justify-center gap-2.5 rounded-full bg-primary px-9 py-4 font-semibold text-on-primary shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40"
            >
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              {CTA_LABEL_LONGO}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </CtaTesteGratis>
          </div>
          <Link
            href="/api-oficial"
            className="flex items-center justify-center rounded-full border border-dark-border bg-dark-surface px-9 py-4 font-semibold text-dark-text transition-all hover:border-primary/40 hover:text-primary"
          >
            Entender a API Oficial
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
