"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lightbulb, RotateCcw } from "lucide-react";
import {
  AJUDA_DO_MODO,
  MODOS,
  PASSOS_ATIVA,
  PASSOS_RECEPTIVA,
  type Passo,
} from "@/components/calculadora/perguntas";
import type { Modo } from "@/components/calculadora/calculo";

type Valores = Record<string, number>;

export default function Wizard({
  modo,
  valores,
  aoTrocarModo,
  aoAlterar,
  aoConcluir,
  aoReiniciar,
}: {
  modo: Modo;
  valores: Valores;
  aoTrocarModo: (modo: Modo) => void;
  aoAlterar: (chave: string, valor: number) => void;
  aoConcluir: () => void;
  aoReiniciar: () => void;
}) {
  const [indice, setIndice] = useState(0);
  const [direcao, setDirecao] = useState(1);
  /* O modo só é aplicado ao sair do passo 0: trocar de trilha no meio do
     preenchimento apagaria respostas que o visitante já deu. */
  const [modoEscolhido, setModoEscolhido] = useState<Modo>(modo);

  const passos = modoEscolhido === "ativa" ? PASSOS_ATIVA : PASSOS_RECEPTIVA;
  const total = passos.length + 1;
  const noInicio = indice === 0;
  const passo: Passo | null = noInicio ? null : passos[indice - 1];
  const ultimo = indice === total - 1;

  const valido = noInicio ? true : Number(valores[passo!.chave]) > 0;
  const rotuloDoModo =
    (noInicio ? modoEscolhido : modo) === "ativa"
      ? "Campanha ativa"
      : "Atendimento receptivo";

  function avancar() {
    if (!valido) return;
    if (noInicio) aoTrocarModo(modoEscolhido);
    if (ultimo) {
      aoConcluir();
      return;
    }
    setDirecao(1);
    setIndice((atual) => atual + 1);
  }

  function voltar() {
    if (noInicio) return;
    setDirecao(-1);
    setIndice((atual) => atual - 1);
  }

  function recomecar() {
    setDirecao(-1);
    setIndice(0);
    aoReiniciar();
  }

  return (
    <div className="overflow-hidden rounded-[26px] border border-dark-border bg-dark-surface shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between gap-4 bg-primary px-5 py-4">
        <button
          type="button"
          onClick={voltar}
          disabled={noInicio}
          aria-label="Voltar para o passo anterior"
          /* `-m-2 p-2` leva o alvo de toque de 16px para 32px sem deslocar o
             ícone: o padding cresce a área clicável e a margem negativa
             devolve o espaço ao layout. O mínimo do WCAG 2.5.8 é 24px. */
          className="-m-2 flex items-center p-2 text-on-primary/70 transition-colors hover:text-on-primary disabled:opacity-30"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        </button>

        <p className="text-center text-sm font-bold text-on-primary">
          Passo {indice + 1} de {total}
          {!noInicio && <span className="hidden sm:inline"> · {rotuloDoModo}</span>}
        </p>

        <button
          type="button"
          onClick={recomecar}
          aria-label="Recomeçar a simulação"
          className="-m-2 flex items-center p-2 text-on-primary/70 transition-colors hover:text-on-primary"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div
        className="h-1.5 bg-primary/20"
        role="progressbar"
        aria-valuenow={indice + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label="Progresso da simulação"
      >
        <div
          className="h-full bg-accent-amber transition-all duration-500 ease-out"
          style={{ width: `${((indice + 1) / total) * 100}%` }}
        />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr]">
        <div className="p-6 sm:p-8 lg:border-r lg:border-dark-border">
          <AnimatePresence mode="wait" custom={direcao}>
            <motion.div
              key={indice}
              initial={{ opacity: 0, x: direcao > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direcao > 0 ? -40 : 40 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {noInicio ? (
                <EscolhaDeModo
                  escolhido={modoEscolhido}
                  aoEscolher={setModoEscolhido}
                />
              ) : (
                <CampoDoPasso
                  passo={passo!}
                  valor={valores[passo!.chave]}
                  aoAlterar={(valor) => aoAlterar(passo!.chave, valor)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={avancar}
            disabled={!valido}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-amber px-7 py-3.5 text-sm font-bold text-dark-base transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {ultimo ? "Ver o resultado" : "Continuar"}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <aside className="border-t border-dark-border bg-dark-base/50 p-6 sm:p-8 lg:border-t-0">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light/10">
              <Lightbulb aria-hidden="true" className="h-4 w-4 text-primary" />
            </span>
            <div>
              <h2 className="mb-1.5 text-sm font-bold text-dark-text">
                Como responder
              </h2>
              <p className="text-sm leading-relaxed text-dark-muted">
                {noInicio ? AJUDA_DO_MODO : passo!.ajuda}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function EscolhaDeModo({
  escolhido,
  aoEscolher,
}: {
  escolhido: Modo;
  aoEscolher: (modo: Modo) => void;
}) {
  return (
    <fieldset>
      <legend className="text-2xl font-bold leading-tight text-dark-text sm:text-3xl">
        Que tipo de operação você quer simular?
      </legend>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {MODOS.map((item) => {
          const ativo = escolhido === item.valor;
          return (
            <button
              key={item.valor}
              type="button"
              onClick={() => aoEscolher(item.valor)}
              aria-pressed={ativo}
              className={`rounded-2xl border-2 p-5 text-left transition-all ${
                ativo
                  ? "border-primary bg-primary/10"
                  : "border-dark-border bg-dark-elevated hover:border-primary/50"
              }`}
            >
              <item.Icone
                aria-hidden="true"
                className={`mb-2 h-6 w-6 ${
                  ativo ? "text-primary" : "text-dark-muted"
                }`}
              />
              <span className="block text-lg font-bold text-dark-text">
                {item.rotulo}
              </span>
              <span className="mt-1 block text-sm text-dark-muted">
                {item.descricao}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function CampoDoPasso({
  passo,
  valor,
  aoAlterar,
}: {
  passo: Passo;
  valor: number;
  aoAlterar: (valor: number) => void;
}) {
  const maximo = passo.sufixo === "%" ? 100 : undefined;

  if (passo.tipo === "escolha") {
    return (
      <fieldset>
        <legend className="text-2xl font-bold leading-tight text-dark-text sm:text-3xl">
          {passo.pergunta}
        </legend>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {passo.opcoes?.map((opcao) => {
            const ativo = valor === opcao.valor;
            return (
              <button
                key={opcao.rotulo}
                type="button"
                onClick={() => aoAlterar(opcao.valor)}
                aria-pressed={ativo}
                className={`rounded-2xl border-2 p-4 text-left transition-all ${
                  ativo
                    ? "border-primary bg-primary/10"
                    : "border-dark-border bg-dark-elevated hover:border-primary/50"
                }`}
              >
                <span className="block font-bold text-dark-text">
                  {opcao.rotulo}
                </span>
                <span className="mt-1 block text-sm text-dark-muted">
                  {opcao.descricao}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <div>
      <label
        htmlFor={`passo-${passo.chave}`}
        className="block text-2xl font-bold leading-tight text-dark-text sm:text-3xl"
      >
        {passo.pergunta}
      </label>
      <input
        id={`passo-${passo.chave}`}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={passo.exemplo}
        value={valor > 0 ? valor : ""}
        onChange={(evento) => {
          const digitos = Number(evento.target.value.replace(/\D/g, "")) || 0;
          aoAlterar(maximo ? Math.min(digitos, maximo) : digitos);
        }}
        className="mt-6 w-full rounded-2xl border-2 border-dark-border bg-dark-elevated px-5 py-4 text-2xl font-bold text-dark-text outline-none transition-all placeholder:text-base placeholder:font-normal placeholder:text-dark-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
      {passo.sufixo && (
        <p className="mt-2 text-sm font-semibold text-dark-muted">
          {passo.sufixo}
        </p>
      )}
    </div>
  );
}
