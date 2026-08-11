"use client";

import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import type { LPConteudo } from "@/components/lp/tipos";

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

type Config = LPConteudo["calculadora"];
type Chave = "contatos" | "conv1" | "conv2" | "ticket";

export default function Calculadora({ config }: { config: Config }) {
  const [valores, setValores] = useState(config.padrao);

  const campos: { chave: Chave; rotulo: string; sufixo?: string; max?: number }[] = [
    { chave: "contatos", rotulo: config.rotuloContatos },
    { chave: "conv1", rotulo: config.rotuloConv1, sufixo: "%", max: 100 },
    { chave: "conv2", rotulo: config.rotuloConv2, sufixo: "%", max: 100 },
    { chave: "ticket", rotulo: config.rotuloTicket },
  ];

  /* Cenário possível conservador definido no conteúdo da LP. São premissas da
     simulação, não promessa: o texto ao lado do resultado deixa isso explícito. */
  const resultado = useMemo(() => {
    const { contatos, conv1, conv2, ticket } = valores;
    const atual = contatos * (conv1 / 100) * (conv2 / 100) * ticket;
    const possivel =
      contatos *
      (Math.max(conv1, config.possivel.conv1) / 100) *
      (Math.max(conv2, config.possivel.conv2) / 100) *
      ticket;
    return { atual, ganho: Math.max(possivel - atual, 0) };
  }, [valores, config.possivel]);

  function alterar(chave: Chave, bruto: string, max?: number) {
    const numero = Math.max(Number(bruto.replace(/\D/g, "")) || 0, 0);
    setValores((atuais) => ({
      ...atuais,
      [chave]: max ? Math.min(numero, max) : numero,
    }));
  }

  return (
    <div className="rounded-3xl bg-card p-6 shadow-2xl shadow-black/50 sm:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {campos.map((campo) => (
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
            Ganho possível com {config.possivel.conv1}% de {config.nomeConv1} e{" "}
            {config.possivel.conv2}% de {config.nomeConv2}
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
