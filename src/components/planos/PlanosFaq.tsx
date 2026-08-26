"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    pergunta: "O que exatamente está incluso nos R$ 497 por mês?",
    resposta:
      "O assistente de IA treinado no seu negócio, a plataforma de atendimento com atendentes ilimitados, o CRM com visão Kanban, o painel de relatórios, o chat interno, o agendamento de mensagens, as respostas rápidas e as integrações via Webhook e API. A implantação e o treinamento também estão no valor.",
  },
  {
    pergunta: "Tem taxa de setup ou de implantação?",
    resposta:
      "Não. O diagnóstico, o treinamento do assistente com o seu material, os testes e a ativação estão inclusos na mensalidade. Você não paga nada além do plano para começar.",
  },
  {
    pergunta: "O custo das mensagens do WhatsApp está incluso?",
    resposta:
      "Não. Quem cobra por mensagem é a Meta, direto na sua conta do WhatsApp Business, e o valor varia conforme o tipo de mensagem e o volume de conversas que você inicia. Na nossa calculadora da API Oficial você simula esse custo antes de decidir.",
  },
  {
    pergunta: "Tem contrato de fidelidade? Posso cancelar quando quiser?",
    resposta:
      "Não trabalhamos com fidelidade. Você pode cancelar quando quiser, sem multa. Preferimos que você continue porque o assistente está dando resultado, e não porque assinou um contrato longo.",
  },
  {
    pergunta: "Quantos atendentes posso colocar na plataforma?",
    resposta:
      "Quantos você precisar. O plano Pro tem atendentes ilimitados, então toda a sua equipe pode trabalhar no mesmo número, com o assistente de IA atendendo junto e passando a conversa quando o caso pede.",
  },
  {
    pergunta: "E se eu precisar de mais de um número de WhatsApp?",
    resposta:
      "O plano Pro conecta um número. Se a sua operação tem várias unidades, mais de um número ou precisa de integração com um sistema próprio, a gente monta um plano sob medida a partir do diagnóstico.",
  },
  {
    pergunta: "Quanto tempo até estar atendendo de verdade?",
    resposta:
      "Em média 7 dias: uma reunião para entender o seu atendimento, o treinamento do assistente com o seu material, os testes junto com você e a ativação no seu número. Depois disso continuamos ajustando com base nas conversas reais.",
  },
  {
    pergunta: "Preciso trocar o meu número de WhatsApp?",
    resposta:
      "Na maioria dos casos não. Cuidamos da habilitação do seu número na API Oficial da Meta, que é o caminho que dá número verificado e tira o risco de bloqueio. Se houver alguma restrição no seu caso, a gente avisa antes de qualquer contratação.",
  },
];

function Item({ pergunta, resposta, idx }: { pergunta: string; resposta: string; idx: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `planosfaq-panel-${idx}`;
  const buttonId = `planosfaq-btn-${idx}`;

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
          className={`h-5 w-5 shrink-0 text-primary-text transition-transform ${open ? "rotate-180" : ""}`}
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
            <p className="pb-5 leading-relaxed text-text-secondary">{resposta}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PlanosFaq() {
  return (
    <section id="faq-planos" className="relative bg-section py-24">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Dúvidas sobre <span className="text-primary-text">planos e valores</span>
          </h2>
          <p className="mt-4 text-text-secondary">O que mais perguntam antes de fechar.</p>
        </motion.div>

        <div className="mt-12">
          {faqs.map((faq, i) => (
            <Item key={i} idx={i} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
