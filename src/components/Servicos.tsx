"use client";

import { motion } from "framer-motion";
import { Bot, Plug, MessageSquareCode, Check } from "lucide-react";

const servicos = [
  {
    icon: MessageSquareCode,
    titulo: "Automação de Atendimento",
    badge: "Mais Popular",
    cor: {
      bg: "bg-[#0092ff]/10",
      border: "border-[#0092ff]/15",
      hoverBorder: "hover:border-[#0092ff]/30",
      text: "text-[#0092ff]",
      badgeBg: "bg-[#0092ff]/10",
      gradientBar: "bg-gradient-to-r from-[#0092ff] to-[#00d4ff]",
    },
    itens: [
      "Respostas automáticas inteligentes",
      "Atendimento 24/7 sem pausas",
      "Qualificação automática de leads",
      "Redução de até 70% nos custos",
      "Setup completo em até 7 dias",
    ],
  },
  {
    icon: Plug,
    titulo: "Integração via API",
    badge: "Conectividade",
    cor: {
      bg: "bg-primary/10",
      border: "border-primary/15",
      hoverBorder: "hover:border-primary/30",
      text: "text-primary",
      badgeBg: "bg-primary-light",
      gradientBar: "bg-gradient-to-r from-primary to-[#00d4a0]",
    },
    itens: [
      "Integração com CRMs e ERPs",
      "WhatsApp Business API",
      "Conexão com redes sociais",
      "Gestão centralizada",
      "Sincronização em tempo real",
    ],
  },
  {
    icon: Bot,
    titulo: "Assistente IA Personalizado",
    badge: "Inteligência",
    cor: {
      bg: "bg-[#a941f3]/10",
      border: "border-[#a941f3]/15",
      hoverBorder: "hover:border-[#a941f3]/30",
      text: "text-[#a941f3]",
      badgeBg: "bg-[#a941f3]/10",
      gradientBar: "bg-gradient-to-r from-[#a941f3] to-[#d480ff]",
    },
    itens: [
      "IA treinada para seu negócio",
      "Linguagem natural e humanizada",
      "Aprende com cada interação",
      "Prompt 100% personalizado",
      "GPT ilimitado incluso",
    ],
  },
];

export default function Servicos() {
  return (
    <section id="servicos" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Nossos <span className="text-primary">Serviços</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Soluções tecnológicas de alto impacto para simplificar seus
            processos e alavancar suas vendas.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {servicos.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`group relative overflow-hidden rounded-2xl border ${s.cor.border} bg-card p-8 shadow-sm transition-all duration-300 ${s.cor.hoverBorder} hover:shadow-lg`}
            >
              {/* Gradient top accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] ${s.cor.gradientBar} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div className="mb-5 flex items-center justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.cor.bg} ${s.cor.text} transition-transform duration-300 group-hover:scale-110`}
                >
                  <s.icon className="h-7 w-7" />
                </div>
                <span
                  className={`rounded-full ${s.cor.badgeBg} ${s.cor.text} px-3 py-1 text-xs font-semibold tracking-wide`}
                >
                  {s.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground">{s.titulo}</h3>

              <ul className="mt-5 space-y-3">
                {s.itens.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-sm text-text-secondary"
                  >
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${s.cor.text}`}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
