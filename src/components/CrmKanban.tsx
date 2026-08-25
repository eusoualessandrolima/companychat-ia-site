"use client";

import { motion } from "framer-motion";
import {
  KanbanSquare,
  Users,
  TrendingUp,
  Zap,
  Plus,
  Clock,
  Eye,
  Settings2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import CtaTesteGratis from "./CtaTesteGratis";

type Card = {
  nome: string;
  iniciais: string;
  grad: string;
  contexto: string;
  tempo: string;
  valor?: string;
};

type Coluna = {
  nome: string;
  header: string;
  accent: string;
  cards: Card[];
};

const colunas: Coluna[] = [
  {
    nome: "Novo Lead",
    header: "bg-zinc-600",
    accent: "border-l-zinc-500",
    cards: [
      { nome: "Conversa #412 · Ana S.", iniciais: "AS", grad: "from-primary to-accent-blue", contexto: "Quer orçamento do plano anual", tempo: "há 2h" },
      { nome: "Conversa #408 · Marcos R.", iniciais: "MR", grad: "from-accent-blue to-accent-purple", contexto: "Chegou pelo anúncio do Instagram", tempo: "há 5h" },
    ],
  },
  {
    nome: "Qualificando",
    header: "bg-accent-blue",
    accent: "border-l-accent-blue",
    cards: [
      { nome: "Conversa #395 · Lucas O.", iniciais: "LO", grad: "from-accent-blue to-primary", contexto: "Interessado, validando orçamento", tempo: "há 1d" },
    ],
  },
  {
    nome: "Proposta Enviada",
    header: "bg-accent-purple",
    accent: "border-l-accent-purple",
    cards: [
      { nome: "Conversa #317 · Danilo D.", iniciais: "DD", grad: "from-accent-purple to-primary", contexto: "Proposta enviada por WhatsApp", tempo: "há 1 mês", valor: "R$ 2.500" },
    ],
  },
  {
    nome: "Negociação",
    header: "bg-accent-amber",
    accent: "border-l-accent-amber",
    cards: [
      { nome: "Conversa #288 · Thiago R.", iniciais: "TR", grad: "from-accent-amber to-primary", contexto: "Ajustando condições de fechamento", tempo: "há 3d", valor: "R$ 4.000" },
    ],
  },
];

const slim = [
  { nome: "Oportunidade Ganha", cor: "bg-primary text-on-primary", count: 1 },
  { nome: "Oportunidade Perdida", cor: "bg-red-500 text-white", count: 0 },
];

const pilares: { icon: LucideIcon; titulo: string; desc: string }[] = [
  { icon: KanbanSquare, titulo: "Mantenha tudo organizado", desc: "Divida o atendimento em etapas e veja cada lead no lugar certo." },
  { icon: Users, titulo: "Colabore com a equipe", desc: "Atribua conversas, deixe anotações e avance os leads juntos." },
  { icon: TrendingUp, titulo: "Acompanhe o progresso", desc: "Veja na hora o que está em aberto, em andamento e fechado." },
  { icon: Zap, titulo: "Automatize o processo", desc: "Mova cards e dispare ações automáticas pelos seus fluxos." },
];

function Avatar({ iniciais, grad }: { iniciais: string; grad: string }) {
  return (
    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${grad} text-[10px] font-bold text-white`}>
      {iniciais}
    </span>
  );
}

function LeadCard({ card, accent }: { card: Card; accent: string }) {
  return (
    <div className={`rounded-lg border border-dark-border ${accent} border-l-2 bg-dark-elevated p-3 transition-colors hover:border-white/15`}>
      <div className="flex items-center gap-2">
        <Avatar iniciais={card.iniciais} grad={card.grad} />
        <span className="truncate text-[13px] font-medium text-dark-text">{card.nome}</span>
      </div>
      <p className="mt-2 text-xs leading-snug text-dark-muted">{card.contexto}</p>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-dark-muted">
        <Clock aria-hidden="true" className="h-3 w-3" />
        {card.tempo}
        {card.valor && (
          <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 font-semibold text-primary">
            {card.valor}
          </span>
        )}
      </div>
    </div>
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-14 overflow-hidden rounded-3xl border border-dark-border bg-dark-surface p-4 shadow-2xl shadow-black/40 sm:p-5"
        >
          {/* toolbar */}
          <div className="mb-4 flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-dark-text">Clientes &amp; Oportunidades</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-dark-muted">funil</span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-lg border border-dark-border px-3 py-1.5 text-xs text-dark-muted">Todos os agentes</span>
              <span className="rounded-lg border border-dark-border px-3 py-1.5 text-xs text-dark-muted">Todas as caixas</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-dark-border text-dark-muted">
                <Settings2 aria-hidden="true" className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* columns */}
          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]">
            {colunas.map((col, ci) => (
              <div key={col.nome} className="flex w-[250px] shrink-0 flex-col">
                <div className={`flex items-center gap-2 rounded-lg ${col.header} px-3 py-2 text-white`}>
                  <span className="text-sm font-semibold">{col.nome}</span>
                  <span className="rounded-full bg-white/25 px-1.5 text-xs font-semibold">{col.cards.length}</span>
                  <span className="ml-auto flex items-center gap-1.5 opacity-80">
                    <Settings2 aria-hidden="true" className="h-3.5 w-3.5" />
                    <Plus aria-hidden="true" className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-2 flex flex-1 flex-col gap-2 rounded-xl border border-dark-border bg-white/[0.02] p-2">
                  {col.cards.map((card) => (
                    <motion.div
                      key={card.nome}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: ci * 0.08 }}
                    >
                      <LeadCard card={card} accent={col.accent} />
                    </motion.div>
                  ))}
                  <button className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs text-dark-muted transition-colors hover:bg-white/5 hover:text-dark-text">
                    <Plus aria-hidden="true" className="h-3.5 w-3.5" /> Adicionar tarefa
                  </button>
                </div>
              </div>
            ))}

            {/* slim collapsed columns */}
            {slim.map((s) => (
              <div
                key={s.nome}
                className={`flex w-11 shrink-0 flex-col items-center justify-between rounded-lg ${s.cor} py-3`}
              >
                <span className="rounded-full bg-white/25 px-1.5 text-xs font-semibold">{s.count}</span>
                <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-semibold tracking-wide">
                  {s.nome}
                </span>
                <Eye aria-hidden="true" className="h-3.5 w-3.5 opacity-80" />
              </div>
            ))}

            {/* ghost add stage with animated glow border */}
            <div className="glow-border flex h-[52px] w-[160px] shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-dark-surface text-sm font-medium text-dark-muted">
              <Plus aria-hidden="true" className="h-4 w-4" /> Adicionar etapa
            </div>
          </div>
        </motion.div>

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
                <p.icon aria-hidden="true" className="h-6 w-6" />
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
            <CtaTesteGratis
              local="crm-kanban"
              className="group flex items-center justify-center gap-2.5 rounded-full bg-primary px-9 py-4 font-semibold text-on-primary shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40"
            >
              Quero o CRM Kanban
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </CtaTesteGratis>
          </div>
        </div>
      </div>
    </section>
  );
}
