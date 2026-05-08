"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const depoimentos = [
  {
    nome: "Dra. Camila Ferreira",
    cargo: "Advogada — Ferreira & Associados",
    texto:
      "Antes, perdíamos leads todo fim de semana por falta de atendimento. Hoje o assistente responde no sábado de madrugada com a mesma qualidade que nossa equipe. Em 30 dias já recuperamos o investimento.",
    estrelas: 5,
    iniciais: "CF",
    cor: "bg-[#0092ff]/10 text-[#0092ff]",
  },
  {
    nome: "Marcos Oliveira",
    cargo: "Diretor — Lab Análises Clínicas",
    texto:
      "O agendamento de exames virou automático. O assistente confirma, lembra o paciente e ainda envia o resultado pelo WhatsApp. Reduziu 60% do volume de ligações na recepção.",
    estrelas: 5,
    iniciais: "MO",
    cor: "bg-primary/10 text-primary",
  },
  {
    nome: "Rafael Costa",
    cargo: "Proprietário — Rede de Academias FitLife",
    texto:
      "Implantamos em 3 unidades ao mesmo tempo. O assistente qualifica o lead, apresenta os planos e já agenda a visita. Nossas matrículas aumentaram 40% sem contratar ninguém a mais.",
    estrelas: 5,
    iniciais: "RC",
    cor: "bg-[#a941f3]/10 text-[#a941f3]",
  },
  {
    nome: "Ana Paula Mendes",
    cargo: "Coordenadora — Instituto Educar",
    texto:
      "Recebemos centenas de mensagens na época de matrículas. O assistente filtra, responde e encaminha só os alunos prontos para assinar. Transformou nossa captação completamente.",
    estrelas: 5,
    iniciais: "AP",
    cor: "bg-[#0092ff]/10 text-[#0092ff]",
  },
];

function Estrelas({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Depoimentos() {
  return (
    <section className="relative bg-section py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            O que nossos <span className="text-primary">clientes dizem</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            Resultados reais de empresas que automatizaram com a CompanyChat IA.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {depoimentos.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col rounded-2xl border border-card-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              {/* Quote icon */}
              <Quote className="mb-4 h-6 w-6 text-primary/30" />

              <p className="flex-1 text-sm leading-relaxed text-text-secondary">
                &ldquo;{d.texto}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${d.cor}`}
                >
                  {d.iniciais}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {d.nome}
                  </p>
                  <p className="truncate text-xs text-text-secondary">
                    {d.cargo}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <Estrelas n={d.estrelas} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-text-secondary"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">500+</span>
            <span>empresas atendidas</span>
          </div>
          <div className="h-4 w-px bg-black/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">98%</span>
            <span>de satisfação</span>
          </div>
          <div className="h-4 w-px bg-black/10 hidden sm:block" />
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
