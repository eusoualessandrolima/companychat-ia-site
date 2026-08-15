"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const sem = [
  "WhatsApp desorganizado e mensagens perdidas",
  "Demora para responder e leads que esfriam",
  "Atendimento só no horário comercial",
  "Trabalho manual e repetitivo",
  "Sem acompanhamento das conversas",
  "Equipe sobrecarregada",
];

const com = [
  "Atendimento, vendas e suporte com IA",
  "Caixa de entrada centralizada e organizada",
  "Respostas automáticas 24 horas por dia, 7 dias por semana",
  "CRM Kanban e disparo em massa integrados",
  "Equipe focada em conversão",
  "Tudo em uma só plataforma",
];

export default function Solucao() {
  return (
    <section id="solucao" className="relative bg-section py-24">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            A solução que faz a <span className="text-primary">diferença</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Qualifique seus leads, atenda e venda todos os dias de forma inteligente
            e automática.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {/* Sem */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-card-border bg-card/60 p-8"
          >
            <h3 className="text-xl font-bold text-text-secondary">Sem a CompanyChat</h3>
            <ul className="mt-6 space-y-4">
              {sem.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-text-secondary">
                    <X aria-hidden="true" className="h-3 w-3" />
                  </span>
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Com */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-8 shadow-xl shadow-primary/10 ring-1 ring-primary/10"
          >
            {/* brand glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-accent-blue to-accent-purple" />

            <h3
              aria-label="Com a CompanyChat"
              className="flex items-center gap-2.5 text-xl font-bold text-foreground"
            >
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary"
              >
                C
              </span>
              Com a CompanyChat
            </h3>
            <ul className="mt-6 space-y-4">
              {com.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check aria-hidden="true" className="h-3 w-3" />
                  </span>
                  <span className="font-medium text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
