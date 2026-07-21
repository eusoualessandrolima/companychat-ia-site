"use client";

import { motion } from "framer-motion";
import {
  Megaphone,
  FileText,
  Radio,
  ListChecks,
  Users,
  BarChart3,
  ScrollText,
  Blocks,
  type LucideIcon,
} from "lucide-react";

type Recurso = {
  nome: string;
  icon: LucideIcon;
  desc: string;
  cor: { text: string; bg: string; barra: string; borda: string };
};

const primary = { text: "text-primary", bg: "bg-primary/10", barra: "bg-primary", borda: "border-primary/20" };
const blue = { text: "text-accent-blue", bg: "bg-accent-blue/10", barra: "bg-accent-blue", borda: "border-accent-blue/20" };
const purple = { text: "text-accent-purple", bg: "bg-accent-purple/10", barra: "bg-accent-purple", borda: "border-accent-purple/20" };
const amber = { text: "text-accent-amber", bg: "bg-accent-amber/10", barra: "bg-accent-amber", borda: "border-accent-amber/20" };

const recursos: Recurso[] = [
  { nome: "Campanhas", icon: Megaphone, desc: "Crie, agende e dispare campanhas de marketing para milhares de contatos de uma vez.", cor: primary },
  { nome: "Templates", icon: FileText, desc: "Biblioteca de templates aprovados pela Meta, com variáveis personalizadas por contato.", cor: blue },
  { nome: "Disparos ao vivo", icon: Radio, desc: "Acompanhe cada envio saindo em tempo real, com status de aceito, entregue e lido.", cor: purple },
  { nome: "Filas", icon: ListChecks, desc: "Envio no ritmo certo, respeitando os limites da API para nunca arriscar bloqueio.", cor: amber },
  { nome: "Contatos e importações", icon: Users, desc: "Importe por planilha ou CRM e mantenha a base organizada com histórico de campanhas.", cor: primary },
  { nome: "Relatórios", icon: BarChart3, desc: "Taxa de entrega, leitura e falhas por campanha, prontas para você medir resultados.", cor: blue },
  { nome: "Histórico e logs", icon: ScrollText, desc: "Registro completo de cada disparo, com auditoria de tudo que saiu e quando.", cor: purple },
  { nome: "Integração com CRM", icon: Blocks, desc: "Conectada ao nosso CRM e ao agente de IA: um ecossistema único para atender e vender.", cor: amber },
];

export default function Recursos() {
  return (
    <section id="recursos" className="relative bg-section py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Uma ferramenta <span className="text-primary">completa</span> de disparo
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Tudo que você precisa para rodar campanhas de WhatsApp em escala, com
            controle total e relatórios de verdade.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recursos.map((r, i) => (
            <motion.div
              key={r.nome}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border ${r.cor.borda} bg-card p-7 shadow-sm transition-all duration-300 hover:shadow-lg`}
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${r.cor.barra} opacity-70 transition-opacity group-hover:opacity-100`} />

              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${r.cor.bg} ${r.cor.text} transition-transform duration-300 group-hover:scale-110`}>
                <r.icon className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-foreground">{r.nome}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
