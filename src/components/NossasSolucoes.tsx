"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutGrid, BadgeCheck, Send, ArrowRight, type LucideIcon } from "lucide-react";

type Variant = "light" | "dark";

type Solucao = {
  icon: LucideIcon;
  nome: string;
  href: string;
  desc: string;
  badge?: string;
  text: string;
  bg: string;
  bar: string;
};

const solucoes: Solucao[] = [
  {
    icon: LayoutGrid,
    nome: "CRM Kanban",
    href: "/#crm-kanban",
    desc: "Organize leads, conversas e vendas num funil visual, tudo integrado ao seu WhatsApp.",
    text: "text-accent-blue",
    bg: "bg-accent-blue/10",
    bar: "from-accent-blue to-[#00d4ff]",
  },
  {
    icon: BadgeCheck,
    nome: "API Oficial",
    href: "/api-oficial",
    desc: "WhatsApp verificado pela Meta, sem risco de bloqueio. Cuidamos de toda a implementação por você.",
    text: "text-primary",
    bg: "bg-primary/10",
    bar: "from-primary to-[#00d4a0]",
  },
  {
    icon: Send,
    nome: "Disparo em Massa",
    href: "/disparos",
    badge: "Novo",
    desc: "Campanhas para toda a sua base via API Oficial, com relatórios de entrega e leitura em tempo real.",
    text: "text-accent-purple",
    bg: "bg-accent-purple/10",
    bar: "from-accent-purple to-[#d480ff]",
  },
];

const theme: Record<Variant, { card: string; titulo: string; desc: string }> = {
  light: {
    card: "border-card-border bg-card hover:border-primary/25",
    titulo: "text-foreground",
    desc: "text-text-secondary",
  },
  dark: {
    card: "border-dark-border bg-dark-surface hover:border-primary/30",
    titulo: "text-dark-text",
    desc: "text-dark-muted",
  },
};

/** Grid dos 3 produtos com página própria, clicáveis. Reutilizável em qualquer seção. */
export function SolucaoGrid({ variant = "light" }: { variant?: Variant }) {
  const t = theme[variant];
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {solucoes.map((s, i) => (
        <motion.div
          key={s.nome}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.12 }}
        >
          <Link
            href={s.href}
            className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${t.card} p-7 shadow-sm transition-all duration-300 hover:shadow-lg`}
          >
            <div
              className={`absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r ${s.bar} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            <div className="mb-5 flex items-center justify-between">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.bg} ${s.text} transition-transform duration-300 group-hover:scale-110`}
              >
                <s.icon aria-hidden="true" className="h-7 w-7" />
              </span>
              {s.badge && (
                <span className={`rounded-full ${s.bg} ${s.text} px-3 py-1 text-xs font-semibold tracking-wide`}>
                  {s.badge}
                </span>
              )}
            </div>

            <h3 className={`text-xl font-bold ${t.titulo}`}>{s.nome}</h3>
            <p className={`mt-3 flex-1 text-sm leading-relaxed ${t.desc}`}>{s.desc}</p>

            <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${s.text}`}>
              Saiba mais
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

/** Seção completa "Um ecossistema completo", usada em páginas internas. */
export default function NossasSolucoes({ variant = "dark" }: { variant?: Variant }) {
  const t = theme[variant];
  return (
    <section id="solucoes" className={`relative py-24 ${variant === "dark" ? "bg-dark-base" : "bg-background"}`}>
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className={`text-3xl font-bold md:text-4xl ${t.titulo}`}>
            Um <span className="text-gradient-primary">ecossistema</span> completo
          </h2>
          <p className={`mx-auto mt-4 max-w-2xl ${t.desc}`}>
            Muito além da API: o agente de IA atende, o CRM organiza e o disparo reengaja.
            Conheça as soluções que trabalham juntas no seu WhatsApp.
          </p>
        </motion.div>

        <div className="mt-16">
          <SolucaoGrid variant={variant} />
        </div>
      </div>
    </section>
  );
}
