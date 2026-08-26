"use client";

import { motion } from "framer-motion";
import {
  Mic,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Users,
  Clock,
  ShieldCheck,
  Blocks,
  type LucideIcon,
} from "lucide-react";

type Capacidade = {
  nome: string;
  icon: LucideIcon;
  desc: string;
  cor: { text: string; bg: string; barra: string; borda: string };
};

const primary = { text: "text-primary-text", bg: "bg-primary/10", barra: "bg-primary", borda: "border-primary/20" };
const blue = { text: "text-accent-blue", bg: "bg-accent-blue/10", barra: "bg-accent-blue", borda: "border-accent-blue/20" };
const purple = { text: "text-accent-purple", bg: "bg-accent-purple/10", barra: "bg-accent-purple", borda: "border-accent-purple/20" };
const amber = { text: "text-accent-amber", bg: "bg-accent-amber/10", barra: "bg-accent-amber", borda: "border-accent-amber/20" };

const capacidades: Capacidade[] = [
  {
    nome: "Áudio, foto e documento",
    icon: Mic,
    desc: "Ouve o áudio do cliente, lê print, foto e PDF, e responde por texto ou por voz.",
    cor: primary,
  },
  {
    nome: "Base de conhecimento",
    icon: BookOpen,
    desc: "Catálogo, tabela de preços, políticas e perguntas frequentes do seu negócio, sempre à mão.",
    cor: blue,
  },
  {
    nome: "Agenda integrada",
    icon: CalendarCheck,
    desc: "Marca, remarca e cancela na sua agenda, com lembrete e confirmação de presença.",
    cor: purple,
  },
  {
    nome: "Orçamento e cobrança",
    icon: CreditCard,
    desc: "Monta o orçamento e envia o link de pagamento sem tirar o cliente da conversa.",
    cor: amber,
  },
  {
    nome: "Passa para o time",
    icon: Users,
    desc: "Transfere para a pessoa certa com um resumo do caso e fica em silêncio enquanto ela atende.",
    cor: primary,
  },
  {
    nome: "Horário de atendimento",
    icon: Clock,
    desc: "Conhece seus horários, feriados e a janela de 24h da Meta antes de falar com alguém.",
    cor: blue,
  },
  {
    nome: "Limites e segurança",
    icon: ShieldCheck,
    desc: "Você define o que ele pode prometer, o que precisa de aprovação e o que nunca deve responder.",
    cor: purple,
  },
  {
    nome: "Conectado ao ecossistema",
    icon: Blocks,
    desc: "Trabalha junto com o CRM Kanban, a API Oficial e o disparo em massa, tudo em uma operação só.",
    cor: amber,
  },
];

export default function Capacidades() {
  return (
    <section id="capacidades" className="relative bg-section py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            O que o assistente <span className="text-primary-text">faz por você</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Muito além de responder pergunta frequente. Ele opera o atendimento
            inteiro, do primeiro oi até a venda registrada no CRM.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capacidades.map((c, i) => (
            <motion.div
              key={c.nome}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border ${c.cor.borda} bg-card p-7 shadow-sm transition-all duration-300 hover:shadow-lg`}
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${c.cor.barra} opacity-70 transition-opacity group-hover:opacity-100`} />

              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.cor.bg} ${c.cor.text} transition-transform duration-300 group-hover:scale-110`}>
                <c.icon aria-hidden="true" className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-foreground">{c.nome}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
