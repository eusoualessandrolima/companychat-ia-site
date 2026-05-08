"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { whatsappLink } from "./WhatsAppButton";

const PASSOS = [
  {
    num: "01",
    titulo: "Diagnóstico",
    descricao:
      "Entendemos seu negócio em detalhe: produtos, serviços, preços e o perfil dos seus clientes.",
    destaque: "Reunião de onboarding inclusa",
  },
  {
    num: "02",
    titulo: "Criação do Assistente",
    descricao:
      "Desenvolvemos um assistente IA 100% personalizado com linguagem e tom da sua marca.",
    destaque: "IA treinada com dados do seu negócio",
  },
  {
    num: "03",
    titulo: "Integração",
    descricao:
      "Conectamos ao seu WhatsApp Business, CRM e demais ferramentas que você já usa.",
    destaque: "Setup completo em até 7 dias",
  },
  {
    num: "04",
    titulo: "Resultados",
    descricao:
      "Seu assistente opera 24h por dia. Acompanhe métricas e receba otimizações contínuas.",
    destaque: "Suporte e ajustes mensais inclusos",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="relative bg-background py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">

          {/* ── Left: Headline + CTA ── */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28"
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              Como funciona
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.6rem]">
              Do primeiro contato ao{" "}
              <span className="text-primary">assistente funcionando</span>,
              em 4 passos simples.
            </h2>
            <p className="mt-5 leading-relaxed text-text-secondary">
              Sem complexidade técnica. Nossa equipe cuida de todo o processo —
              da configuração à integração — e você começa a converter clientes
              ainda na primeira semana.
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/35"
            >
              Começar Agora
              <ArrowRight className="h-4 w-4" />
            </a>

            {/* Decorative stat chips */}
            <div className="mt-10 flex flex-wrap gap-3">
              {[
                "Setup em 7 dias",
                "Sem código",
                "Suporte incluso",
                "Resultado em semanas",
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-card-border bg-card px-4 py-1.5 text-xs font-medium text-text-secondary"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Numbered steps ── */}
          <div className="flex flex-col gap-0">
            {PASSOS.map((passo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative flex gap-6 border-b border-card-border py-8 last:border-b-0"
              >
                {/* Big number */}
                <div className="shrink-0 w-16">
                  <span className="font-display text-5xl font-bold leading-none text-primary/20 transition-colors group-hover:text-primary/40">
                    {passo.num}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-foreground">{passo.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {passo.descricao}
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                    {passo.destaque}
                  </span>
                </div>

                {/* Hover accent */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
