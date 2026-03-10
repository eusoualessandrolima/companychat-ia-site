"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { whatsappLink } from "./WhatsAppButton";

const stats = [
  { num: "500+", label: "Empresas Atendidas" },
  { num: "70%", label: "Redução de Custo" },
  { num: "24/7", label: "Disponibilidade" },
];

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-blob-float absolute -top-32 -left-32 h-[700px] w-[700px] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle, #00ab7a 0%, #0092ff 50%, transparent 70%)",
          }}
        />
        <div
          className="animate-blob-float-slow absolute -bottom-48 -right-32 h-[600px] w-[600px] rounded-full opacity-[0.05]"
          style={{
            background:
              "radial-gradient(circle, #a941f3 0%, #00ab7a 60%, transparent 70%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Badge com pulse animado */}
          <div className="mx-auto mb-8 flex w-fit items-center gap-2.5 rounded-full border border-primary/20 bg-primary-light px-4 py-2 text-sm font-medium text-primary shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-dot-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Automação inteligente para sua empresa
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Não perca vendas por{" "}
            <br className="hidden sm:block" />
            falta de{" "}
            <span className="text-gradient-primary">resposta!</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-secondary md:text-xl">
            Aumente seu faturamento automatizando as suas conversas com{" "}
            <span className="font-semibold text-foreground">
              Inteligência Artificial
            </span>{" "}
            personalizada para o seu negócio.
          </p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-full bg-primary px-9 py-4 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40"
            >
              Fale com um Especialista
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#servicos"
              className="rounded-full border border-black/10 bg-white/60 px-9 py-4 font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:text-primary"
            >
              Ver Serviços
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mx-auto mt-16 flex max-w-sm items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white/70 px-8 py-5 shadow-sm backdrop-blur-sm sm:max-w-none sm:gap-0"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-foreground md:text-3xl">
                  {stat.num}
                </div>
                <div className="mt-0.5 text-xs text-text-secondary sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
