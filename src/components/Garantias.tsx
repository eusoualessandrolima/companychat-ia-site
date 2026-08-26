"use client";

import { motion } from "framer-motion";
import {
  Headset,
  Handshake,
  Rocket,
  Unlock,
  PackageCheck,
  RefreshCw,
} from "lucide-react";

/* Cada card corresponde a um compromisso já assumido no FAQ. Nada aqui é
   promessa nova — a Jade responde por tudo isso no WhatsApp. */
const garantias = [
  {
    icon: PackageCheck,
    titulo: "Implantação inclusa",
    descricao:
      "Configuramos o assistente, o CRM e a integração com o seu WhatsApp. Sem taxa de setup.",
  },
  {
    icon: Handshake,
    titulo: "Feito a quatro mãos",
    descricao:
      "Call individual com um especialista e treinamento do seu time inclusos no plano.",
  },
  {
    icon: Rocket,
    titulo: "No ar em até 7 dias",
    descricao:
      "Do diagnóstico ao assistente atendendo clientes, em uma semana. Sem projeto arrastado.",
  },
  {
    icon: Unlock,
    titulo: "Sem fidelidade",
    descricao:
      "Nenhum contrato de permanência. Se não fizer sentido, você cancela quando quiser.",
  },
  {
    icon: Headset,
    titulo: "Suporte de gente de verdade",
    descricao:
      "Suporte exclusivo com quem conhece a sua operação, não um formulário genérico.",
  },
  {
    icon: RefreshCw,
    titulo: "Ajustes contínuos",
    descricao:
      "Manutenção, atualizações e melhorias no assistente inclusas na mensalidade.",
  },
];

export default function Garantias() {
  return (
    <section id="garantias" className="superficie-areia relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            O que você pode esperar da{" "}
            <span className="text-primary-text">CompanyChat</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {garantias.map((g, i) => (
            <motion.div
              key={g.titulo}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="rounded-2xl border border-card-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary-text">
                <g.icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{g.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {g.descricao}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
