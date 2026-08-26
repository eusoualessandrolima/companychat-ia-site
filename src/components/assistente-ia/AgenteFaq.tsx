"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    pergunta: "O cliente vai perceber que está falando com um robô?",
    resposta:
      "Ele responde no ritmo de uma pessoa: espera você terminar de escrever, agrupa as mensagens, usa o vocabulário da sua marca e responde por texto ou por áudio. Quem conversa sente que está falando com alguém do seu time, e a gente sempre deixa claro quando um humano assume.",
  },
  {
    pergunta: "E se ele inventar uma informação ou prometer o que eu não faço?",
    resposta:
      "As respostas saem da base de conhecimento que montamos com o seu material: catálogo, tabela de preços e políticas. Você define os limites do que ele pode falar e, quando não tem certeza, ele confirma com uma pessoa do time em vez de arriscar uma resposta errada.",
  },
  {
    pergunta: "Preciso da API Oficial do WhatsApp para ter o assistente?",
    resposta:
      "Recomendamos sim. A API Oficial é o que garante número verificado, sem o risco de bloqueio das APIs não oficiais, e libera o volume de atendimento. Cuidamos de todo esse processo com a Meta por você. Na página da API Oficial você entende como funciona e simula o custo por mensagem.",
  },
  {
    pergunta: "Ele consegue passar o atendimento para a minha equipe?",
    resposta:
      "Consegue. O assistente transfere para a pessoa ou o time certo com um resumo do que aconteceu na conversa. Enquanto o humano atende, ele fica em silêncio, e depois a conversa volta para a IA sem perder nada do histórico.",
  },
  {
    pergunta: "Com o que ele se integra?",
    resposta:
      "Agenda, sistema de pagamento, CRM, ERP e ferramentas que você já usa. Ele agenda, gera link de cobrança, move o card no CRM Kanban e registra dados no seu sistema. As integrações são configuradas por nós durante o treinamento.",
  },
  {
    pergunta: "Quanto tempo até ele estar atendendo?",
    resposta:
      "Em média 7 dias: uma reunião para entender o negócio, o treinamento com o seu material, os testes junto com você e a ativação no seu número. Depois disso continuamos ajustando com base nas conversas reais.",
  },
  {
    pergunta: "As conversas e os dados dos meus clientes ficam seguros?",
    resposta:
      "Ficam. Os dados trafegam pela API Oficial da Meta, o acesso ao painel é controlado por usuário e o histórico fica registrado para auditoria. Nada do seu material de treinamento é usado para atender outra empresa.",
  },
];

function Item({ pergunta, resposta, idx }: { pergunta: string; resposta: string; idx: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `agentefaq-panel-${idx}`;
  const buttonId = `agentefaq-btn-${idx}`;

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

export default function AgenteFaq() {
  return (
    <section id="faq-assistente" className="relative bg-background py-24">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Dúvidas sobre o <span className="text-primary-text">assistente de IA</span>
          </h2>
          <p className="mt-4 text-text-secondary">As perguntas que mais recebemos de quem vai começar.</p>
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
