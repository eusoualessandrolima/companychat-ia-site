"use client";

import { motion } from "framer-motion";
import {
  Clock,
  DollarSign,
  Zap,
  Shield,
  TrendingUp,
  UserX,
  Timer,
  XCircle,
  AlertTriangle,
  Ban,
} from "lucide-react";

const comparativo = [
  {
    humano: "Demora minutos ou horas para responder",
    ia: "Resposta instantânea em segundos",
    iconH: Timer,
    iconIA: Zap,
  },
  {
    humano: "Apenas em horário comercial",
    ia: "Atendimento 24/7 sem parar",
    iconH: XCircle,
    iconIA: Clock,
  },
  {
    humano: "Custo alto por atendente adicional",
    ia: "Custo fixo e previsível",
    iconH: AlertTriangle,
    iconIA: DollarSign,
  },
  {
    humano: "Perde leads fora do horário",
    ia: "Captura todo lead automaticamente",
    iconH: Ban,
    iconIA: TrendingUp,
  },
  {
    humano: "Respostas sem padrão",
    ia: "Respostas consistentes e personalizadas",
    iconH: UserX,
    iconIA: Shield,
  },
];

export default function Beneficios() {
  return (
    <section id="beneficios" className="relative bg-section py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Atendimento Humano{" "}
            <span className="text-text-secondary">vs</span>{" "}
            <span className="text-primary">Assistente IA</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            Veja por que empresas estão migrando para atendimento inteligente.
          </p>
        </motion.div>

        {/* Header colunas */}
        <div className="mt-16 hidden grid-cols-2 gap-6 px-2 md:grid">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-500/90">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            Atendimento Tradicional
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            CompanyChat IA
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {comparativo.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="grid grid-cols-1 gap-3 md:grid-cols-2"
            >
              {/* Humano */}
              <div className="flex items-center gap-4 rounded-2xl border border-red-100 bg-red-50/60 px-5 py-4 transition-colors hover:bg-red-50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  <item.iconH className="h-4 w-4 text-red-400" />
                </div>
                <span className="text-sm text-red-600/80">{item.humano}</span>
              </div>
              {/* IA */}
              <div className="flex items-center gap-4 rounded-2xl border border-primary/15 bg-primary-light/70 px-5 py-4 transition-colors hover:bg-primary-light">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <item.iconIA className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.ia}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
