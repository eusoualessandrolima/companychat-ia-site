"use client";

import { motion } from "framer-motion";
import { XCircle, ChevronDown } from "lucide-react";

const DESAFIOS = [
  "Atendimento lento e ineficiente",
  "Perda de clientes por falta de resposta",
  "Custo elevado com atendentes",
  "Time comercial desmotivado",
  "Problemas para bater metas",
  "Confusão no time de vendas",
  "Clientes com péssimas experiências",
  "Dificuldade em escalar o atendimento",
  "Ausência fora do horário comercial",
  "Entre outros...",
];

export default function Problemas() {
  return (
    <section
      className="relative overflow-hidden pb-28 pt-24"
      style={{ backgroundColor: "#0b1e12" }}
    >
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Você tem algum desses{" "}
            <span className="text-primary">desafios</span>
            <br className="hidden sm:block" />
            na sua empresa?
          </h2>
          <p className="mt-4 text-white/55">
            Se você se identificou com algum desses pontos, a CompanyChat IA é para você.
          </p>
        </motion.div>

        {/* Challenges card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-12 overflow-hidden rounded-2xl border border-white/8 bg-black/25 p-8 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
            {DESAFIOS.map((desafio, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.055 }}
                className="flex items-center gap-3"
              >
                <XCircle className="h-5 w-5 shrink-0 text-red-400" />
                <span className="text-sm leading-relaxed text-white/72">{desafio}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Wave bottom divider — transitions to light section */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 leading-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="h-20 w-full"
        >
          <path
            d="M0,80 C360,10 1080,10 1440,80 L1440,80 L0,80 Z"
            fill="#fafafa"
          />
        </svg>
      </div>

      {/* Scroll-down button — sits at wave peak (center) */}
      <div className="absolute bottom-[68px] left-1/2 z-10 -translate-x-1/2">
        <a
          href="#como-funciona"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 transition-transform hover:scale-110"
        >
          <ChevronDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}
