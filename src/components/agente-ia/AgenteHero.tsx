"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, MessageCircle, ShieldCheck, CalendarCheck } from "lucide-react";
import CtaTesteGratis from "../CtaTesteGratis";
import ChatMock, { type Bolha } from "./ChatMock";

const conversa: Bolha[] = [
  { t: "cliente", texto: "oi, vocês atendem no sábado?" },
  { t: "audio", de: "cliente", duracao: "0:08", transcricao: "queria marcar uma avaliação, de manhã se der" },
  { t: "ia", texto: "Oi, Mariana! Atendemos sim, das 8h às 13h no sábado 😊" },
  {
    t: "card",
    titulo: "Avaliação agendada",
    icon: CalendarCheck,
    linhas: ["Sábado, 9h30", "Unidade Centro", "Lembrete na sexta às 18h"],
  },
  { t: "ia", texto: "Agendei para sábado às 9h30. Te mando um lembrete na véspera, combinado?" },
];

export default function AgenteHero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-dark-base pt-16">
      {/* Aurora */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full opacity-[0.10]"
          style={{
            background: "radial-gradient(circle, #00c896 0%, #0092ff 50%, transparent 70%)",
            animation: "blob-float 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-48 -right-32 h-[600px] w-[600px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #a78bfa 0%, #00c896 60%, transparent 70%)",
            animation: "blob-float-slow 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-4 py-20 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-8 flex w-fit items-center gap-2.5 rounded-full border border-dark-border bg-dark-surface px-4 py-2 text-sm font-medium text-dark-muted lg:mx-0"
          >
            <Bot aria-hidden="true" className="h-4 w-4 text-primary" />
            Agente de IA treinado no seu negócio
          </motion.div>

          <motion.h1
            aria-label="Um atendente de IA que resolve, não só responde"
            initial={{ y: 28 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(36px,5vw,60px)] font-bold leading-[1.03] tracking-[-0.03em] text-dark-text"
          >
            Um atendente de IA que{" "}
            <span className="text-gradient-primary">resolve</span>, não só responde
          </motion.h1>

          <motion.p
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-dark-muted lg:mx-0"
          >
            Ele ouve áudio, lê foto e documento, consulta o seu catálogo, agenda na
            agenda certa, move o lead no CRM e chama uma pessoa do time quando o caso
            pede. No seu WhatsApp, com a sua linguagem, 24 horas por dia.
          </motion.p>

          <motion.div
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:flex-col lg:items-start xl:flex-row lg:justify-start"
          >
            <div className="cta-glow-wrap w-full sm:w-auto">
              <CtaTesteGratis
                local="hero-assistente-ia"
                className="group flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-primary px-8 py-4 font-semibold text-on-primary shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40 sm:w-auto"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Quero meu agente de IA
              </CtaTesteGratis>
            </div>
            <a
              href="#cenas"
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-dark-border bg-dark-surface px-8 py-4 font-semibold text-dark-text transition-all hover:border-primary/40 hover:text-primary sm:w-auto"
            >
              Ver o agente atendendo
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-2 text-xs text-dark-muted lg:justify-start"
          >
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" />
            Configuração e treinamento por nossa conta, no ar em até 7 dias
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-md"
        >
          <ChatMock contato="Mariana Lopes" canal="WhatsApp · Clínica Centro" mensagens={conversa} />
        </motion.div>
      </div>
    </section>
  );
}
