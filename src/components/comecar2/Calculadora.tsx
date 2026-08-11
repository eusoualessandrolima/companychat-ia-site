"use client";

import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/* Cenário possível conservador: melhora de agendamento e de comparecimento
   com resposta imediata + confirmação de véspera. São premissas da simulação,
   não promessa: o texto ao lado do resultado deixa isso explícito. */
const AGENDAMENTO_POSSIVEL = 45;
const COMPARECIMENTO_POSSIVEL = 85;

type CampoCalc = {
  chave: "contatos" | "agendamento" | "comparecimento" | "ticket";
  rotulo: string;
  sufixo?: string;
  max?: number;
};

const CAMPOS: CampoCalc[] = [
  { chave: "contatos", rotulo: "Contatos no WhatsApp por mês" },
  { chave: "agendamento", rotulo: "% que agenda", sufixo: "%", max: 100 },
  { chave: "comparecimento", rotulo: "% que comparece", sufixo: "%", max: 100 },
  { chave: "ticket", rotulo: "Ticket médio (R$)" },
];

export default function Calculadora() {
  const [valores, setValores] = useState({
    contatos: 200,
    agendamento: 30,
    comparecimento: 70,
    ticket: 250,
  });

  const resultado = useMemo(() => {
    const { contatos, agendamento, comparecimento, ticket } = valores;
    const atual = contatos * (agendamento / 100) * (comparecimento / 100) * ticket;
    const possivel =
      contatos *
      (Math.max(agendamento, AGENDAMENTO_POSSIVEL) / 100) *
      (Math.max(comparecimento, COMPARECIMENTO_POSSIVEL) / 100) *
      ticket;
    return { atual, ganho: Math.max(possivel - atual, 0) };
  }, [valores]);

  function alterar(chave: CampoCalc["chave"], bruto: string, max?: number) {
    const numero = Math.max(Number(bruto.replace(/\D/g, "")) || 0, 0);
    setValores((atuais) => ({
      ...atuais,
      [chave]: max ? Math.min(numero, max) : numero,
    }));
  }

  return (
    <div className="rounded-3xl bg-card p-6 shadow-2xl shadow-black/50 sm:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CAMPOS.map((campo) => (
          <label key={campo.chave} className="block">
            <span className="text-sm font-semibold text-foreground">
              {campo.rotulo}
            </span>
            <div className="relative mt-2">
              <input
                type="text"
                inputMode="numeric"
                value={valores[campo.chave]}
                onChange={(e) => alterar(campo.chave, e.target.value, campo.max)}
                className={`w-full rounded-2xl border border-card-border bg-card py-3 pl-4 text-foreground transition-colors focus:border-primary focus:outline-none ${
                  campo.sufixo ? "pr-10" : "pr-4"
                }`}
              />
              {campo.sufixo && (
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
                  {campo.sufixo}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>

      <div
        className="mt-6 rounded-2xl bg-section p-5 sm:p-6"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="text-sm font-semibold text-text-secondary">
          Receita estimada no cenário atual
        </p>
        <p className="mt-1 text-3xl font-bold text-foreground">
          {moeda.format(resultado.atual)}
          <span className="text-base font-medium text-text-secondary">/mês</span>
        </p>

        <div className="mt-5 border-t border-card-border pt-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <TrendingUp aria-hidden="true" className="h-4 w-4" />
            Ganho possível com {AGENDAMENTO_POSSIVEL}% de agendamento e{" "}
            {COMPARECIMENTO_POSSIVEL}% de comparecimento
          </p>
          <p className="mt-1 text-4xl font-bold text-primary">
            {moeda.format(resultado.ganho)}
            <span className="text-base font-medium text-text-secondary">/mês</span>
          </p>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-text-secondary">
          Estimativa baseada nos números informados e nas premissas acima. O
          resultado real depende do seu segmento e da sua operação.
        </p>
      </div>
    </div>
  );
}
