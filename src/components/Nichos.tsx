"use client";

import { motion } from "framer-motion";
import {
  Scale,
  FlaskConical,
  Dumbbell,
  GraduationCap,
  ShoppingBag,
  Stethoscope,
  Building2,
  Utensils,
} from "lucide-react";

const nichos = [
  {
    icon: Scale,
    titulo: "Advocacia",
    descricao:
      "Qualificação de leads e agendamento de consultas automático. Atenda mais clientes sem aumentar a equipe.",
  },
  {
    icon: FlaskConical,
    titulo: "Laboratórios",
    descricao:
      "Agendamento de exames, confirmações e entrega de resultados automatizados via WhatsApp.",
  },
  {
    icon: Dumbbell,
    titulo: "Academias",
    descricao:
      "Matrículas, renovações e dúvidas frequentes resolvidas automaticamente 24h.",
  },
  {
    icon: GraduationCap,
    titulo: "Educação",
    descricao:
      "Captação de alunos, informações sobre cursos e suporte sem sobrecarregar sua secretaria.",
  },
  {
    icon: ShoppingBag,
    titulo: "Comércio & E-commerce",
    descricao:
      "Status de pedidos, atendimento pós-venda e recuperação de carrinhos abandonados no piloto automático.",
  },
  {
    icon: Stethoscope,
    titulo: "Clínicas & Saúde",
    descricao:
      "Agendamentos, lembretes de consulta e triagem de pacientes — tudo automatizado com segurança.",
  },
  {
    icon: Building2,
    titulo: "Imobiliárias",
    descricao:
      "Qualificação de compradores, agendamento de visitas e envio de portfólios de forma automática.",
  },
  {
    icon: Utensils,
    titulo: "Restaurantes & Food",
    descricao:
      "Pedidos, reservas e cardápios digitais integrados ao WhatsApp. Zero perda de cliente.",
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
            Adaptamos o assistente para qualquer segmento. Se atende pelo WhatsApp, nós automatizamos.
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
