"use client";

import { motion } from "framer-motion";
import { Target, Lightbulb, Users } from "lucide-react";
import CountUp from "./CountUp";

const valores = [
  {
    icon: Lightbulb,
    titulo: "Inovação",
    descricao: "Tecnologia de ponta aplicada de forma prática ao seu negócio.",
  },
  {
    icon: Target,
    titulo: "Personalização",
    descricao: "Cada solução é única, moldada às necessidades da sua empresa.",
  },
  {
    icon: Users,
    titulo: "Resultados",
    descricao: "Foco em métricas reais: mais vendas, menos custos, mais eficiência.",
  },
];

const numeros = [
  { value: 500, suffix: "+", label: "Empresas atendidas" },
  { value: 98,  suffix: "%", label: "Taxa de satisfação"  },
  { value: 7,   suffix: " dias", label: "Tempo médio de setup" },
];

export default function Sobre() {
  return (
    <section id="sobre" className="relative bg-section py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Números animados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 grid grid-cols-3 gap-2 rounded-2xl border border-card-border bg-card p-4 shadow-sm sm:gap-8 sm:p-8"
        >
          {numeros.map((n, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-foreground md:text-4xl">
                <CountUp to={n.value} suffix={n.suffix} duration={1200} />
              </div>
              <div className="mt-1 text-sm text-text-secondary">{n.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Sobre a <span className="text-primary">CompanyChat IA</span>
            </h2>
            <p className="mt-6 leading-relaxed text-text-secondary">
              A CompanyChat nasceu para impulsionar empresas a alcançarem seu potencial máximo,
              unindo gestão inteligente, inovação e conexões estratégicas que transformam planos em
              resultados.
            </p>
            <p className="mt-4 leading-relaxed text-text-secondary">
              Nosso objetivo é simplificar seus processos, melhorar o relacionamento com seus clientes
              e alavancar ainda mais suas vendas com soluções tecnológicas de alto impacto.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-4"
          >
            {valores.map((v, i) => (
              <div
                key={i}
                className="group flex gap-4 rounded-2xl border border-card-border bg-card p-6 shadow-sm transition-all hover:border-primary/25 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors group-hover:bg-primary/20">
                  <v.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{v.titulo}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{v.descricao}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
