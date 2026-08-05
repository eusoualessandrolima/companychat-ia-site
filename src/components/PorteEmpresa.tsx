"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building, Building2, Check, Store } from "lucide-react";
import { whatsappLink, WHATSAPP_NUMBER } from "./WhatsAppButton";

function linkComContexto(mensagem: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

/* Os itens de cada porte saem do que já está publicado em `planos-data.ts`:
   o Pro cobre o começo, o Sob medida cobre múltiplos números e integração. */
const portes = [
  {
    icone: Store,
    etiqueta: "Pequenas empresas",
    titulo: "Ideal para quem está começando a escalar",
    texto:
      "Organize o WhatsApp, automatize o que se repete e ganhe tempo para o que importa: vender. Com o controle que as empresas grandes têm, na agilidade que só você tem.",
    itens: [
      "Assistente de IA atendendo 24 horas por dia",
      "CRM Kanban com atendentes ilimitados",
      "Uma mensalidade, sem taxa de setup",
    ],
    cta: "Começar agora",
    href: linkComContexto(
      "Olá! Tenho uma empresa pequena e quero saber como a CompanyChat IA pode ajudar."
    ),
  },
  {
    icone: Building,
    etiqueta: "Médias empresas",
    titulo: "Controle total sobre uma operação em crescimento",
    texto:
      "Vários assistentes, cada um com a sua função, campanhas para toda a base e visão de ponta a ponta do funil. Seu time entra quando a conversa já está qualificada.",
    itens: [
      "Vários assistentes, cada um com sua função",
      "Disparo em massa pela API Oficial da Meta",
      "Funil visual do primeiro contato ao fechamento",
    ],
    cta: "Escalar meu time",
    href: linkComContexto(
      "Olá! Minha operação está crescendo e quero entender o plano sob medida da CompanyChat IA."
    ),
  },
  {
    icone: Building2,
    etiqueta: "Grandes empresas",
    titulo: "Soluções sob medida para operações complexas",
    texto:
      "Mais de um número, integração com o sistema que você já usa e fluxo desenhado para o seu processo. Nada de encaixar a sua operação num molde pronto.",
    itens: [
      "Mais de um número de WhatsApp conectado",
      "Integração com o seu ERP ou sistema interno",
      "Fluxo desenhado para o seu processo",
    ],
    cta: "Falar com especialista",
    href: whatsappLink,
  },
];

export default function PorteEmpresa() {
  return (
    <section id="porte" className="relative overflow-hidden bg-dark-base py-24">
      {/* Faixa escura: quebra a sequência de seções claras e dá respiro à página */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 75% 60% at 50% 40%, black 20%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 60% at 50% 40%, black 20%, transparent 78%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Para quem é a CompanyChat IA
          </span>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight text-dark-text md:text-4xl">
            A solução certa para qualquer tamanho de empresa
          </h2>
        </motion.div>

        <div className="mt-14 space-y-6">
          {portes.map((p, i) => {
            const imagemNaDireita = i % 2 === 1;

            return (
              <motion.article
                key={p.etiqueta}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="grid overflow-hidden rounded-3xl bg-card shadow-xl shadow-black/20 md:grid-cols-2"
              >
                {/* Painel visual — substitui a foto até termos imagens próprias */}
                <div
                  className={`relative flex min-h-[220px] items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-[#00d4a0] p-10 ${
                    imagemNaDireita ? "md:order-2" : ""
                  }`}
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
                      backgroundSize: "22px 22px",
                    }}
                  />
                  <p.icone
                    aria-hidden="true"
                    className="relative h-20 w-20 text-white/90"
                    strokeWidth={1.25}
                  />
                </div>

                <div className="p-8 md:p-10">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3.5 py-1.5 text-xs font-semibold text-primary-dark">
                    <p.icone aria-hidden="true" className="h-3.5 w-3.5" />
                    {p.etiqueta}
                  </span>

                  <h3 className="mt-4 text-xl font-bold leading-snug text-foreground md:text-2xl">
                    {p.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {p.texto}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {p.itens.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-foreground"
                      >
                        <Check
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                  >
                    {p.cta}
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
