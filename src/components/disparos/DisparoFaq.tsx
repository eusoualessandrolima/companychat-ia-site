"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    pergunta: "É seguro fazer disparo em massa? Meu número pode ser bloqueado?",
    resposta:
      "A ferramenta usa exclusivamente a API Oficial da Meta, com número verificado e selo de empresa. Os envios saem em fila, no ritmo permitido, usando templates aprovados. É justamente o caminho que evita o bloqueio que acontece com disparadores não oficiais.",
  },
  {
    pergunta: "Preciso de templates aprovados para disparar?",
    resposta:
      "Sim. Para iniciar conversas em massa (categoria marketing), a Meta exige templates aprovados. Nós ajudamos a criar e aprovar os templates da sua campanha, dentro das regras, para você começar a disparar sem dor de cabeça.",
  },
  {
    pergunta: "Consigo importar minha lista de contatos?",
    resposta:
      "Consegue. Você importa por planilha (CSV/Excel) ou traz os contatos direto do CRM. A ferramenta organiza a base, guarda o histórico de campanhas de cada contato e o último status de envio.",
  },
  {
    pergunta: "Que relatórios eu tenho depois do disparo?",
    resposta:
      "Você acompanha enviadas, entregues, lidas, falhas e taxa de entrega por campanha, além dos disparos ao vivo e logs de cada mensagem. Tudo em tempo real, para medir o retorno de cada campanha.",
  },
  {
    pergunta: "A ferramenta de disparo se integra com o CRM e o agente de IA?",
    resposta:
      "Sim, é o mesmo ecossistema. O disparo traz o cliente de volta, o agente de IA atende a resposta e o CRM organiza a venda. Você opera captação, atendimento e reengajamento sem trocar de sistema.",
  },
  {
    pergunta: "Quanto custa para enviar as mensagens?",
    resposta:
      "O envio de campanhas de marketing tem o custo por mensagem da própria Meta. Você pode estimar esse valor na nossa calculadora da API Oficial. A ferramenta de disparo entra por cima disso, cuidando de toda a operação e dos relatórios.",
  },
];

function Item({ pergunta, resposta, idx }: { pergunta: string; resposta: string; idx: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `disparofaq-panel-${idx}`;
  const buttonId = `disparofaq-btn-${idx}`;

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

export default function DisparoFaq() {
  return (
    <section id="faq-disparos" className="relative bg-section py-24">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Dúvidas sobre <span className="text-primary">disparo em massa</span>
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
