"use client";

import { motion } from "framer-motion";

const passos = [
  {
    num: "01",
    titulo: "Diagnóstico",
    descricao:
      "Entendemos seu negócio em detalhe: produtos, serviços, preços, dúvidas frequentes e o perfil dos seus clientes.",
    destaque: "Reunião de onboarding inclusa",
  },
  {
    num: "02",
    titulo: "Criação do Assistente",
    descricao:
      "Desenvolvemos um assistente IA 100% personalizado para sua empresa, com linguagem, tom e respostas no padrão da sua marca.",
    destaque: "IA treinada com os dados do seu negócio",
  },
  {
    num: "03",
    titulo: "Integração",
    descricao:
      "Conectamos o assistente ao seu WhatsApp Business, CRM e demais ferramentas que você já usa, sem complicação.",
    destaque: "Setup completo em até 7 dias",
  },
  {
    num: "04",
    titulo: "Resultados",
    descricao:
      "Seu assistente entra em operação 24h por dia. Acompanhe as conversas, monitore os resultados e receba otimizações contínuas.",
    destaque: "Suporte e ajustes mensais inclusos",
  },
];

export default function ComoFunciona() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Como <span className="text-primary">funciona</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            Do primeiro contato ao assistente funcionando, em 4 passos simples.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connector line (desktop) */}
          <div className="absolute top-10 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent lg:block" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {passos.map((passo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number circle */}
                <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-white shadow-md">
                  <span className="text-2xl font-bold text-primary">
                    {passo.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground">
                  {passo.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {passo.descricao}
                </p>
                <span className="mt-4 inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
                  {passo.destaque}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
