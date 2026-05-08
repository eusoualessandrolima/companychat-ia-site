"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock, DollarSign, Zap, Shield, TrendingUp, UserX,
  Timer, XCircle, AlertTriangle, Ban,
} from "lucide-react";

const comparativo = [
  {
    humano: "Demora minutos ou horas para responder",
    ia:     "Resposta instantânea em segundos",
    iconH:  Timer,    iconIA: Zap,
    pcH: 18,  pcIA: 98,
  },
  {
    humano: "Apenas em horário comercial",
    ia:     "Atendimento 24/7 sem parar",
    iconH:  XCircle,       iconIA: Clock,
    pcH: 35,  pcIA: 100,
  },
  {
    humano: "Custo alto por atendente adicional",
    ia:     "Custo fixo e previsível",
    iconH:  AlertTriangle, iconIA: DollarSign,
    pcH: 25,  pcIA: 90,
  },
  {
    humano: "Perde leads fora do horário",
    ia:     "Captura todo lead automaticamente",
    iconH:  Ban,           iconIA: TrendingUp,
    pcH: 20,  pcIA: 95,
  },
  {
    humano: "Respostas sem padrão",
    ia:     "Respostas consistentes e personalizadas",
    iconH:  UserX,         iconIA: Shield,
    pcH: 30,  pcIA: 100,
  },
];

function Bar({
  pct,
  color,
  label,
  triggered,
}: {
  pct: number;
  color: string;
  label: string;
  triggered: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-dark-muted">{label}</span>
        <span style={{ color }} className="font-semibold">
          {pct}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-dark-elevated">
        <div
          className="h-full rounded-full transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: triggered ? `${pct}%` : "0%",
            background: color,
          }}
        />
      </div>
    </div>
  );
}

export default function Beneficios() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="beneficios" ref={ref} className="relative overflow-hidden bg-dark-base py-24">
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* aurora accent */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-dark-text md:text-4xl">
            Atendimento Humano{" "}
            <span className="text-dark-muted">vs</span>{" "}
            <span className="text-gradient-primary">Assistente IA</span>
          </h2>
          <p className="mt-4 text-dark-muted">
            Veja por que empresas estão migrando para atendimento inteligente.
          </p>
        </motion.div>

        {/* Column headers */}
        <div className="mt-14 hidden grid-cols-2 gap-6 px-2 md:grid">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-400">
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
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="grid grid-cols-1 gap-3 md:grid-cols-2"
            >
              {/* Humano */}
              <div className="group rounded-2xl border border-red-500/10 bg-red-500/5 p-5 transition-colors hover:bg-red-500/8">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                    <item.iconH className="h-4 w-4 text-red-400" />
                  </div>
                  <span className="text-sm text-red-300/80">{item.humano}</span>
                </div>
                <Bar pct={item.pcH} color="#f87171" label="Eficiência" triggered={triggered} />
              </div>

              {/* IA */}
              <div className="group rounded-2xl border border-primary/15 bg-primary/5 p-5 transition-colors hover:bg-primary/8">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                    <item.iconIA className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-dark-text">{item.ia}</span>
                </div>
                <Bar pct={item.pcIA} color="#00ab7a" label="Eficiência" triggered={triggered} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
