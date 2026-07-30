"use client";

import { motion } from "framer-motion";
import { MessagesSquare, PencilRuler, Hammer, Rocket } from "lucide-react";

const suave = [0.4, 0, 0.2, 1] as const;

const passos = [
  {
    icon: MessagesSquare,
    titulo: "Conversa",
    desc: "Você conta o que trava hoje, quem faz na mão e quanto tempo isso consome. Sem apresentação de slides.",
  },
  {
    icon: PencilRuler,
    titulo: "Desenho",
    desc: "A gente devolve o que vai ser construído, o que fica de fora e o que muda no dia a dia da sua equipe.",
  },
  {
    icon: Hammer,
    titulo: "Construção",
    desc: "A solução é desenvolvida e testada com o seu processo de verdade, não com dado de exemplo.",
  },
  {
    icon: Rocket,
    titulo: "Entrega e ajuste",
    desc: "Vai para o ar, sua equipe usa e a gente ajusta o que a rotina mostrar que precisa mudar.",
  },
];

export default function ComoTrabalhamos() {
  return (
    <section id="como-trabalhamos" className="relative bg-dark-base py-28 md:py-36">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: suave }}
          className="max-w-3xl"
        >
          <h2 className="text-[clamp(34px,4.4vw,56px)] font-semibold leading-[1.06] tracking-[-0.025em]">
            <span className="block text-dark-text">Quatro etapas.</span>
            <span className="block text-dark-muted">Você acompanha todas elas.</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {passos.map((p, i) => (
            <motion.div
              key={p.titulo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: suave }}
              className="group relative bg-dark-base p-8 transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/[0.02]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="text-[15px] font-medium tabular-nums text-dark-muted/40">
                  0{i + 1}
                </span>
              </div>

              <h3 className="mt-7 text-[20px] font-semibold leading-[1.15] tracking-[-0.02em] text-dark-text">
                {p.titulo}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6] tracking-[-0.011em] text-dark-muted">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
