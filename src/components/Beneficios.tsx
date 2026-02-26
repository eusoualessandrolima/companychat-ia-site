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

        <div className="mt-16 space-y-4">
          {/* Header */}
          <div className="hidden grid-cols-2 gap-4 px-6 md:grid">
            <div className="text-center text-sm font-semibold text-red-500/80">
              Atendimento Tradicional
            </div>
            <div className="text-center text-sm font-semibold text-primary">
              CompanyChat IA
            </div>
          </div>

          {comparativo.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {/* Humano */}
              <div className="flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-5">
                <item.iconH className="h-5 w-5 shrink-0 text-red-400" />
                <span className="text-sm text-red-600/80">{item.humano}</span>
              </div>
              {/* IA */}
              <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary-light p-5">
                <item.iconIA className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{item.ia}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
