"use client";

import { motion } from "framer-motion";
import { ClipboardList, GraduationCap, FlaskConical, Rocket, type LucideIcon } from "lucide-react";

type Etapa = {
  icon: LucideIcon;
  titulo: string;
  prazo: string;
  desc: string;
  cor: string;
  barra: string;
};

const etapas: Etapa[] = [
  {
    icon: ClipboardList,
    titulo: "Entendemos seu negócio",
    prazo: "1 reunião",
    desc: "Como você vende, o que mais te perguntam, o que o atendimento nunca pode prometer. Sai daqui o roteiro do seu agente de IA.",
    cor: "text-primary",
    barra: "bg-primary",
  },
  {
    icon: GraduationCap,
    titulo: "Treinamos o agente",
    prazo: "2 a 3 dias",
    desc: "Catálogo, tabela de preços, políticas e o tom de voz da sua marca viram a base de conhecimento. As integrações são conectadas.",
    cor: "text-accent-blue",
    barra: "bg-accent-blue",
  },
  {
    icon: FlaskConical,
    titulo: "Testamos junto com você",
    prazo: "1 a 2 dias",
    desc: "Você conversa com ele antes de qualquer cliente, aponta o que quer diferente e a gente ajusta até a resposta ficar do seu jeito.",
    cor: "text-accent-purple",
    barra: "bg-accent-purple",
  },
  {
    icon: Rocket,
    titulo: "Colocamos no ar",
    prazo: "no 7º dia",
    desc: "O agente entra no seu número oficial e começa a atender. A gente acompanha as primeiras conversas e segue ajustando.",
    cor: "text-accent-amber",
    barra: "bg-accent-amber",
  },
];

export default function Treinamento() {
  return (
    <section id="treinamento" className="relative bg-background py-24">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Do zero ao agente de IA atendendo em <span className="text-primary-text">7 dias</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Você não precisa saber de tecnologia nem escrever um prompt. Quem treina,
            testa e coloca no ar somos nós.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-14 rounded-3xl border border-dark-border bg-dark-base p-6 shadow-2xl shadow-black/20 sm:p-10"
        >
          <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {etapas.map((e, i) => (
              <li key={e.titulo} className="relative">
                {/* Conector entre as etapas no desktop */}
                {i < etapas.length - 1 && (
                  <span className="absolute left-12 right-0 top-6 hidden h-px bg-dark-border lg:block" />
                )}

                <div className="relative">
                  <span className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${e.barra} text-white shadow-lg`}>
                    <e.icon aria-hidden="true" className="h-5 w-5" />
                  </span>

                  <p className={`mt-5 font-mono text-xs ${e.cor}`}>
                    passo {i + 1} · {e.prazo}
                  </p>
                  <h3 className="mt-2 font-semibold text-dark-text">{e.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dark-muted">{e.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-10 border-t border-dark-border pt-6 text-center text-sm text-dark-muted">
            Depois de no ar, o agente continua evoluindo: novas perguntas viram base
            de conhecimento e você acompanha tudo pelo painel.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
