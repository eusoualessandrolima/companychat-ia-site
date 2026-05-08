"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    pergunta: "Como funciona o Assistente IA da CompanyChat?",
    resposta:
      "Criamos um assistente personalizado para sua empresa usando inteligência artificial (GPT). Ele é treinado com informações do seu negócio e responde seus clientes via WhatsApp de forma natural e humanizada, 24 horas por dia.",
  },
  {
    pergunta: "Quanto tempo leva para implementar?",
    resposta:
      "O setup completo leva em média 5 a 7 dias úteis, incluindo personalização do prompt, integração com WhatsApp e testes. Você acompanha todo o processo em tempo real.",
  },
  {
    pergunta: "Preciso ter conhecimento técnico?",
    resposta:
      "Não! Nós cuidamos de toda a parte técnica. Você só precisa nos fornecer informações sobre seu negócio, serviços, preços, horários, dúvidas frequentes e nós fazemos todo o resto.",
  },
  {
    pergunta: "O que está incluso?",
    resposta:
      "Assistente IA 100% personalizado, GPT ilimitado, call individual com especialista, suporte exclusivo, manutenção, atualizações e ajustes contínuos.",
  },
  {
    pergunta: "Posso cancelar a qualquer momento?",
    resposta:
      "Sim! Não temos contrato de fidelidade. Você pode cancelar quando quiser. Mas garantimos que após ver os resultados, não vai querer parar.",
  },
  {
    pergunta: "Funciona para qualquer tipo de empresa?",
    resposta:
      "Funciona para qualquer empresa que atende clientes via WhatsApp ou chat. Temos expertise especial em escritórios de advocacia, laboratórios, academias e instituições de ensino, mas adaptamos para qualquer segmento.",
  },
  {
    pergunta: "E se eu precisar de ajustes no assistente?",
    resposta:
      "Ajustes e melhorias estão inclusos no plano mensal. Conforme seu negócio evolui, otimizamos o assistente para garantir o melhor desempenho sempre.",
  },
];

function FAQItem({
  pergunta,
  resposta,
  idx,
}: {
  pergunta: string;
  resposta: string;
  idx: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `faq-panel-${idx}`;
  const buttonId = `faq-btn-${idx}`;

  return (
    <div className="border-b border-black/5">
      <button
        id={buttonId}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 font-medium text-foreground">{pergunta}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-primary transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 leading-relaxed text-text-secondary">
              {resposta}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Perguntas <span className="text-primary">Frequentes</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            Tire suas dúvidas sobre nossos serviços e planos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          {faqs.map((faq, i) => (
            <FAQItem key={i} idx={i} {...faq} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
