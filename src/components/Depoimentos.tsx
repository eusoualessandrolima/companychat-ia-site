"use client";

import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const depoimentos = [
  {
    nome: "Dra. Camila Ferreira",
    cargo: "Advogada — Ferreira & Associados",
    texto:
      "Antes, perdíamos leads todo fim de semana por falta de atendimento. Hoje o assistente responde no sábado de madrugada com a mesma qualidade que nossa equipe. Em 30 dias recuperamos o investimento.",
    estrelas: 5,
    iniciais: "CF",
    accentColor: "#3b82f6",
  },
  {
    nome: "Marcos Oliveira",
    cargo: "Diretor — Lab Análises Clínicas",
    texto:
      "O agendamento de exames virou automático. O assistente confirma, lembra o paciente e ainda envia o resultado pelo WhatsApp. Reduziu 60% do volume de ligações na recepção.",
    estrelas: 5,
    iniciais: "MO",
    accentColor: "#00ab7a",
  },
  {
    nome: "Rafael Costa",
    cargo: "Proprietário — Rede de Academias FitLife",
    texto:
      "Implantamos em 3 unidades ao mesmo tempo. O assistente qualifica o lead, apresenta os planos e já agenda a visita. Nossas matrículas aumentaram 40% sem contratar ninguém a mais.",
    estrelas: 5,
    iniciais: "RC",
    accentColor: "#8b5cf6",
  },
  {
    nome: "Ana Paula Mendes",
    cargo: "Coordenadora — Instituto Educar",
    texto:
      "Recebemos centenas de mensagens na época de matrículas. O assistente filtra, responde e encaminha só os alunos prontos para assinar. Transformou nossa captação completamente.",
    estrelas: 5,
    iniciais: "AP",
    accentColor: "#f59e0b",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Depoimentos() {
  const [active, setActive] = useState(0);
  const prev = () => setActive((a) => (a - 1 + depoimentos.length) % depoimentos.length);
  const next = () => setActive((a) => (a + 1) % depoimentos.length);

  return (
    <section className="relative overflow-hidden py-24">
      {/* Soft background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(0,171,122,0.05),transparent)]" />

      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            O que nossos{" "}
            <span className="text-primary">clientes dizem</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            Resultados reais de empresas que automatizaram com a CompanyChat IA.
          </p>
        </motion.div>

        {/* Desktop: 4 cards */}
        <div className="mt-16 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
          {depoimentos.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card group relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ "--accent": d.accentColor } as React.CSSProperties}
            >
              {/* Accent top bar */}
              <div
                className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl opacity-60 transition-opacity group-hover:opacity-100"
                style={{ background: d.accentColor }}
              />

              <Quote className="mb-4 h-5 w-5 opacity-20" style={{ color: d.accentColor }} />

              <p className="flex-1 text-sm leading-relaxed text-text-secondary">
                &ldquo;{d.texto}&rdquo;
              </p>

              <div className="mt-5 flex items-center gap-3 border-t border-black/5 pt-4">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: d.accentColor }}
                >
                  {d.iniciais}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{d.nome}</p>
                  <p className="truncate text-xs text-text-secondary">{d.cargo}</p>
                </div>
              </div>
              <div className="mt-3">
                <Stars n={d.estrelas} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="relative mt-12 md:hidden">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card mx-auto max-w-sm rounded-2xl p-6"
          >
            <Quote className="mb-4 h-5 w-5 opacity-20" style={{ color: depoimentos[active].accentColor }} />
            <p className="text-sm leading-relaxed text-text-secondary">
              &ldquo;{depoimentos[active].texto}&rdquo;
            </p>
            <div className="mt-5 flex items-center gap-3 border-t border-black/5 pt-4">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: depoimentos[active].accentColor }}
              >
                {depoimentos[active].iniciais}
              </div>
              <div>
                <p className="text-sm font-semibold">{depoimentos[active].nome}</p>
                <p className="text-xs text-text-secondary">{depoimentos[active].cargo}</p>
              </div>
            </div>
            <div className="mt-3"><Stars n={depoimentos[active].estrelas} /></div>
          </motion.div>

          {/* Carousel controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Depoimento anterior"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-card-border bg-card transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5" role="tablist" aria-label="Selecionar depoimento">
              {depoimentos.map((d, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Depoimento de ${d.nome}`}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${i === active ? "w-6 bg-primary" : "w-1.5 bg-black/15"}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Próximo depoimento"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-card-border bg-card transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-8 rounded-2xl border border-card-border bg-card px-8 py-6 shadow-sm text-sm text-text-secondary"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">500+</span>
            <span>empresas atendidas</span>
          </div>
          <div className="h-4 w-px bg-black/8 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">98%</span>
            <span>de satisfação</span>
          </div>
          <div className="h-4 w-px bg-black/8 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">4.9</span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              avaliação média
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
