"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const perguntas = [
  {
    texto: "Quantas horas por dia sua equipe gasta respondendo as mesmas perguntas?",
    destaque: "horas por dia",
  },
  {
    texto: "Vocês conseguem atender todos os clientes no mesmo dia?",
    destaque: "todos os clientes",
  },
  {
    texto: "O que acontece quando alguém entra em contato fora do horário comercial?",
    destaque: "fora do horário",
  },
  {
    texto: "Quanto custa para você cada atendente adicional?",
    destaque: "cada atendente",
  },
];

export default function Problemas() {
  return (
    <section className="relative bg-section py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Sua empresa enfrenta esses{" "}
            <span className="text-primary">desafios</span>?
          </h2>
          <p className="mt-4 text-text-secondary">
            Se você se identificou com alguma dessas perguntas, nós temos a
            solução.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {perguntas.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group flex gap-4 rounded-2xl border border-card-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors group-hover:bg-primary/20">
                <HelpCircle className="h-5 w-5" />
              </div>
              <p className="text-lg text-text-secondary">
                {p.texto.split(p.destaque).map((part, j, arr) =>
                  j < arr.length - 1 ? (
                    <span key={j}>
                      {part}
                      <span className="font-semibold text-foreground">
                        {p.destaque}
                      </span>
                    </span>
                  ) : (
                    part
                  )
                )}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
