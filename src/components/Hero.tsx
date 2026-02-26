"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { whatsappLink } from "./WhatsAppButton";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Background subtle pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[180px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-4 py-2 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            Automação inteligente para sua empresa
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Não perca vendas por falta de{" "}
            <span className="text-primary">resposta!</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary md:text-xl">
            Aumente seu faturamento automatizando as suas conversas
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-[0_0_30px_rgba(0,171,122,0.3)]"
            >
              Fale com um Especialista
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#servicos"
              className="rounded-full border border-black/10 px-8 py-4 font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              Conheça nossos serviços
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
