"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, LayoutGrid, MessagesSquare, Rocket, ArrowRight, type LucideIcon } from "lucide-react";

type Pilar = {
  nome: string;
  icon: LucideIcon;
  desc: string;
  href?: string;
  linkLabel?: string;
  cor: { text: string; bg: string; barra: string; borda: string };
};

const primary = { text: "text-primary-text", bg: "bg-primary/10", barra: "bg-primary", borda: "border-primary/20" };
const blue = { text: "text-accent-blue-dark", bg: "bg-accent-blue/10", barra: "bg-accent-blue", borda: "border-accent-blue/20" };
const purple = { text: "text-accent-purple", bg: "bg-accent-purple/10", barra: "bg-accent-purple", borda: "border-accent-purple/20" };
const amber = { text: "text-accent-amber", bg: "bg-accent-amber/10", barra: "bg-accent-amber", borda: "border-accent-amber/20" };

const pilares: Pilar[] = [
  {
    nome: "Assistente de IA",
    icon: Bot,
    desc: "Atende, qualifica, agenda e cobra sozinho, entendendo texto, áudio, imagem e arquivo.",
    href: "/assistente-ia",
    linkLabel: "Ver o assistente atendendo",
    cor: primary,
  },
  {
    nome: "CRM com visão Kanban",
    icon: LayoutGrid,
    desc: "Cada conversa vira um card no funil, do primeiro contato até a venda fechada.",
    href: "/#crm-kanban",
    linkLabel: "Conhecer o CRM",
    cor: blue,
  },
  {
    nome: "Plataforma de atendimento",
    icon: MessagesSquare,
    desc: "Atendentes ilimitados, chat interno, respostas rápidas, agendamento de mensagens e relatórios.",
    cor: purple,
  },
  {
    nome: "Implantação feita por nós",
    icon: Rocket,
    desc: "Diagnóstico, treinamento com o seu material, testes junto com você e ativação em até 7 dias.",
    cor: amber,
  },
];

export default function Incluso() {
  return (
    <section id="incluso" className="relative bg-section py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            O que já vem <span className="text-primary-text">na mensalidade</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Não é só um chatbot. É a operação de atendimento inteira, com a implantação
            no preço e sem módulo cobrado à parte.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pilares.map((p, i) => (
            <motion.div
              key={p.nome}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border ${p.cor.borda} bg-card p-7 shadow-sm transition-all duration-300 hover:shadow-lg`}
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${p.cor.barra} opacity-70 transition-opacity group-hover:opacity-100`} />

              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${p.cor.bg} ${p.cor.text} transition-transform duration-300 group-hover:scale-110`}>
                <p.icon aria-hidden="true" className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-foreground">{p.nome}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{p.desc}</p>

              {p.href && (
                <Link
                  href={p.href}
                  className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${p.cor.text}`}
                >
                  {p.linkLabel}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
