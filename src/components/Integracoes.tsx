"use client";

import { motion } from "framer-motion";

const integracoes = [
  { nome: "WhatsApp Business", cor: "#25D366" },
  { nome: "OpenAI GPT", cor: "#10a37f" },
  { nome: "Instagram", cor: "#E1306C" },
  { nome: "n8n", cor: "#ea4b71" },
  { nome: "Chatwoot", cor: "#1f93ff" },
  { nome: "HubSpot CRM", cor: "#ff7a59" },
  { nome: "Google Agenda", cor: "#4285F4" },
  { nome: "Webhooks API", cor: "#6366f1" },
];

export default function Integracoes() {
  return (
    <section className="relative border-y border-black/5 bg-section py-14">
      <div className="mx-auto max-w-6xl px-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-text-secondary"
        >
          Integrações nativas
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {integracoes.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="flex items-center gap-2.5 rounded-full border border-card-border bg-card px-4 py-2.5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              {/* Color dot */}
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.cor }}
              />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {item.nome}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
