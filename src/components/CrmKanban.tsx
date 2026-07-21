"use client";

import { motion } from "framer-motion";
import {
  KanbanSquare,
  Users,
  TrendingUp,
  Zap,
  Plus,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { whatsappLink } from "./WhatsAppButton";

type Estagio = { nome: string; cor: string; ponto: string };

const estagios: Record<string, Estagio> = {
  novo: { nome: "Novo lead", cor: "text-primary", ponto: "bg-primary" },
  conversa: { nome: "Em conversa", cor: "text-accent-blue", ponto: "bg-accent-blue" },
  proposta: { nome: "Proposta", cor: "text-accent-amber", ponto: "bg-accent-amber" },
  fechado: { nome: "Fechado", cor: "text-accent-purple", ponto: "bg-accent-purple" },
};

type Card = {
  nome: string;
  iniciais: string;
  gradiente: string;
  mensagem: string;
  estagio: keyof typeof estagios;
  progresso: number;
};

const cards: Card[] = [
  {
    nome: "Ana Souza",
    iniciais: "AS",
    gradiente: "from-primary to-accent-blue",
    mensagem: "Quer orçamento do plano anual. Pediu retorno ainda hoje.",
    estagio: "novo",
    progresso: 1,
  },
  {
    nome: "Lucas Oliveira",
    iniciais: "LO",
    gradiente: "from-accent-blue to-accent-purple",
    mensagem: "Respondeu à campanha de marketing e quer saber mais sobre a IA.",
    estagio: "conversa",
    progresso: 2,
  },
  {
    nome: "Gabriel Santos",
    iniciais: "GS",
    gradiente: "from-accent-purple to-primary",
    mensagem: "Agendar demonstração da plataforma para sexta-feira.",
    estagio: "conversa",
    progresso: 2,
  },
  {
    nome: "Pedro Almeida",
    iniciais: "PA",
    gradiente: "from-accent-amber to-primary",
    mensagem: "Proposta enviada por WhatsApp. Aguardando aprovação.",
    estagio: "proposta",
    progresso: 3,
  },
  {
    nome: "Thiago Rocha",
    iniciais: "TR",
    gradiente: "from-primary to-accent-purple",
    mensagem: "Pagamento confirmado. Onboarding iniciado com o time.",
    estagio: "fechado",
    progresso: 4,
  },
];

const pilares: { icon: LucideIcon; titulo: string; desc: string }[] = [
  {
    icon: KanbanSquare,
    titulo: "Mantenha tudo organizado",
    desc: "Divida o atendimento em etapas e veja cada lead no lugar certo.",
  },
  {
    icon: Users,
    titulo: "Colabore com a equipe",
    desc: "Atribua conversas, deixe anotações e avance os leads juntos.",
  },
  {
    icon: TrendingUp,
    titulo: "Acompanhe o progresso",
    desc: "Veja na hora o que está em aberto, em andamento e fechado.",
  },
  {
    icon: Zap,
    titulo: "Automatize o processo",
    desc: "Mova cards e dispare ações automáticas pelos seus fluxos.",
  },
];

function Avatar({ iniciais, gradiente, size = "h-9 w-9" }: { iniciais: string; gradiente: string; size?: string }) {
  return (
    <span className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradiente} text-xs font-bold text-white`}>
      {iniciais}
    </span>
  );
}

function LeadCard({ card, index }: { card: Card; index: number }) {
  const estagio = estagios[card.estagio];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="mb-5 break-inside-avoid rounded-2xl border border-dark-border bg-dark-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-xl hover:shadow-black/30"
    >
      <div className="flex items-center gap-3">
        <Avatar iniciais={card.iniciais} gradiente={card.gradiente} />
        <span className="font-semibold text-dark-text">{card.nome}</span>
        <span className={`ml-auto flex items-center gap-1.5 text-xs font-medium ${estagio.cor}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${estagio.ponto}`} />
          {estagio.nome}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-dark-muted">{card.mensagem}</p>

      <div className="mt-4 flex items-center gap-1.5">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`h-1.5 flex-1 rounded-full ${n <= card.progresso ? estagio.ponto : "bg-dark-border"}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function CrmKanban() {
  return (
    <section id="crm-kanban" className="relative overflow-hidden bg-dark-base py-24">
      {/* aurora accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-accent-blue/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-dark-text md:text-4xl">
            Apresentando <span className="text-gradient-primary">o CRM Kanban</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-dark-muted">
            Gerencie leads, conversas e o fluxo de atendimento da equipe com clareza
            e controle, tudo integrado ao seu WhatsApp.
          </p>
        </motion.div>

        {/* Board */}
        <div className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {cards.slice(0, 3).map((c, i) => (
            <LeadCard key={c.nome} card={c} index={i} />
          ))}

          {/* Add card com borda animada */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className="glow-border mb-5 flex break-inside-avoid items-center justify-center gap-2.5 rounded-2xl bg-dark-surface p-6 text-dark-muted"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dark-border">
              <Plus className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium">Novo card</span>
          </motion.div>

          {cards.slice(3).map((c, i) => (
            <LeadCard key={c.nome} card={c} index={i + 3} />
          ))}
        </div>

        {/* Pilares */}
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {pilares.map((p, i) => (
            <motion.div
              key={p.titulo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="text-center"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-semibold text-dark-text">{p.titulo}</h3>
              <p className="mx-auto mt-2 max-w-[15rem] text-sm leading-relaxed text-dark-muted">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <div className="cta-glow-wrap">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2.5 rounded-full bg-primary px-9 py-4 font-semibold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40"
            >
              Quero o CRM Kanban
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
