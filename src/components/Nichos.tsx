"use client";

import { motion } from "framer-motion";
import { Scale, FlaskConical, Dumbbell, GraduationCap } from "lucide-react";

const nichos = [
  {
    icon: Scale,
    titulo: "Escritórios de Advocacia",
    descricao:
      "Qualificação automática de leads e agendamento de consultas. Seu escritório atende mais clientes sem aumentar a equipe.",
  },
  {
    icon: FlaskConical,
    titulo: "Laboratórios Clínicos",
    descricao:
      "Agendamento de exames e entrega de resultados automatizados. Alto volume gerenciado com eficiência.",
  },
  {
    icon: Dumbbell,
    titulo: "Academias",
    descricao:
      "Gestão de matrículas, renovações e atendimento de dúvidas frequentes, tudo automatizado via WhatsApp.",
  },
  {
    icon: GraduationCap,
    titulo: "Educação",
    descricao:
      "Matrículas, informações sobre cursos e suporte a alunos 24/7. Atendimento ágil que não sobrecarrega sua secretaria.",
  },
];

export default function Nichos() {
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
            Nichos de <span className="text-primary">Atuação</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            Soluções sob medida para seu negócio.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {nichos.map((n, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-2xl border border-card-border bg-card p-6 text-center shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary transition-colors group-hover:bg-primary/20">
                <n.icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{n.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {n.descricao}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
