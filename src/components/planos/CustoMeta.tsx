"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, Receipt, BadgeCheck } from "lucide-react";

const linhas = [
  {
    icon: Receipt,
    titulo: "A mensalidade é nossa",
    desc: "R$ 497 por mês cobrem a plataforma, o assistente de IA, o CRM e a implantação. Esse valor não muda com o volume de conversas.",
  },
  {
    icon: BadgeCheck,
    titulo: "As mensagens são da Meta",
    desc: "Quem cobra por mensagem é a própria Meta, direto no seu WhatsApp Business. O valor depende do tipo de mensagem e de quantas conversas você inicia.",
  },
];

export default function CustoMeta() {
  return (
    <section id="custo-meta" className="relative bg-background py-24">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Transparência sobre o <span className="text-primary">custo das mensagens</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Preferimos que você saiba disso antes de fechar, e não na primeira fatura.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-14 overflow-hidden rounded-3xl border border-card-border bg-card shadow-sm"
        >
          <div className="grid grid-cols-1 gap-px bg-card-border md:grid-cols-2">
            {linhas.map((l) => (
              <div key={l.titulo} className="bg-card p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <l.icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{l.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{l.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-5 border-t border-card-border bg-section px-8 py-8 sm:flex-row sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calculator aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-foreground">Quer saber quanto daria no seu caso?</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Nossa calculadora simula o custo das mensagens pelo seu volume, com os
                  preços atuais da Meta no Brasil.
                </p>
              </div>
            </div>

            <Link
              href="/api-oficial#calculadora"
              className="group flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white sm:w-auto"
            >
              Abrir a calculadora
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
