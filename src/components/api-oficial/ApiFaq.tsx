"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    pergunta: "O que é a API Oficial do WhatsApp?",
    resposta:
      "É a forma oficial da Meta para empresas atenderem no WhatsApp de forma automatizada e em escala, com número verificado, selo de empresa e sem risco de bloqueio. É o que permite conectar a IA, o CRM e disparar mensagens com segurança.",
  },
  {
    pergunta: "Quando eu pago e quando é gratuito?",
    resposta:
      "Se o cliente te chamou, você tem 24 horas para responder livremente sem custo (mensagens de serviço). Você só paga quando envia um template, geralmente para iniciar a conversa ou reengajar depois que a janela fechou.",
  },
  {
    pergunta: "Qual a diferença entre as categorias de mensagem?",
    resposta:
      "Utilidade é para avisos transacionais (pedido, recibo, lembrete) e é a mais barata. Autenticação é para códigos de verificação. Marketing é para promoções e ofertas, sendo a mais cara. Serviço é a resposta dentro da janela de 24h, que é gratuita.",
  },
  {
    pergunta: "Os valores da calculadora são exatos?",
    resposta:
      "São valores aproximados da Meta para o Brasil, ótimos para estimar. A Meta ajusta os preços periodicamente e pode haver variação por volume e negociação. Use a calculadora como referência e confirme os números atuais na documentação oficial.",
  },
  {
    pergunta: "Preciso da API Oficial para usar a IA da CompanyChat?",
    resposta:
      "Para um atendimento profissional, em escala e sem risco de bloqueio, sim, a API Oficial é o caminho recomendado. Nós cuidamos de toda a configuração: verificação do número, aprovação de templates e integração com a IA.",
  },
];

function Item({ pergunta, resposta, idx }: { pergunta: string; resposta: string; idx: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `apifaq-panel-${idx}`;
  const buttonId = `apifaq-btn-${idx}`;

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
          className={`h-5 w-5 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`}
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

export default function ApiFaq() {
  return (
    <section id="faq-api" className="relative bg-background py-24">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Dúvidas sobre a <span className="text-primary">API Oficial</span>
          </h2>
          <p className="mt-4 text-text-secondary">As perguntas que mais recebemos dos clientes.</p>
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
