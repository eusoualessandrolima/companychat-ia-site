"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ChevronDown, Gift, RotateCcw, Sparkles } from "lucide-react";
import { categorias, brl, type CategoriaId } from "./pricing";
import { whatsappLink } from "../WhatsAppButton";

type Registro = Record<CategoriaId, number>;

const precoPadrao: Registro = categorias.reduce(
  (acc, c) => ({ ...acc, [c.id]: c.precoPadrao }),
  {} as Registro
);

const presets: { nome: string; desc: string; volumes: Registro }[] = [
  {
    nome: "Pequeno",
    desc: "início / poucos disparos",
    volumes: { utilidade: 500, autenticacao: 100, marketing: 20 },
  },
  {
    nome: "Médio",
    desc: "operação em crescimento",
    volumes: { utilidade: 3000, autenticacao: 800, marketing: 1500 },
  },
  {
    nome: "Grande",
    desc: "alto volume",
    volumes: { utilidade: 15000, autenticacao: 4000, marketing: 8000 },
  },
];

const SLIDER_MAX = 20000;

export default function Calculadora() {
  const [volumes, setVolumes] = useState<Registro>(presets[1].volumes);
  const [precos, setPrecos] = useState<Registro>(precoPadrao);
  const [ajusteAberto, setAjusteAberto] = useState(false);
  const [presetAtivo, setPresetAtivo] = useState<string | null>("Médio");

  const setVolume = (id: CategoriaId, valor: number) => {
    setVolumes((v) => ({ ...v, [id]: Math.max(0, Math.round(valor) || 0) }));
    setPresetAtivo(null);
  };

  const aplicarPreset = (nome: string, v: Registro) => {
    setVolumes(v);
    setPresetAtivo(nome);
  };

  const custos = useMemo(() => {
    const porCategoria = categorias.map((c) => ({
      ...c,
      volume: volumes[c.id],
      preco: c.gratis ? 0 : precos[c.id],
      subtotal: c.gratis ? 0 : volumes[c.id] * precos[c.id],
    }));
    const totalMes = porCategoria.reduce((s, c) => s + c.subtotal, 0);
    const totalMsgs = porCategoria.reduce((s, c) => s + c.volume, 0);
    return { porCategoria, totalMes, totalAno: totalMes * 12, totalMsgs };
  }, [volumes, precos]);

  const resetPrecos = () => setPrecos(precoPadrao);

  return (
    <section id="calculadora" className="relative overflow-hidden bg-dark-base py-24">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #00ab7a 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex w-fit items-center gap-2.5 rounded-full border border-dark-border bg-dark-surface px-4 py-2 text-sm font-medium text-dark-muted">
            <Calculator aria-hidden="true" className="h-4 w-4 text-primary" />
            Calculadora de custo
          </div>
          <h2 className="text-3xl font-bold text-dark-text md:text-4xl">
            Quanto você vai <span className="text-gradient-primary">pagar por mês?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-dark-muted">
            Informe quantas mensagens você envia por categoria. O cálculo é instantâneo.
          </p>
        </motion.div>

        {/* Presets */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm text-dark-muted">Começar com um exemplo:</span>
          {presets.map((p) => (
            <button
              key={p.nome}
              onClick={() => aplicarPreset(p.nome, p.volumes)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                presetAtivo === p.nome
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-dark-border bg-dark-surface text-dark-muted hover:border-primary/40 hover:text-dark-text"
              }`}
            >
              {p.nome}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Inputs */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {custos.porCategoria.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-dark-border bg-dark-surface p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.cor.bg} ${c.cor.text}`}>
                        <c.icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="flex items-center gap-2 font-semibold text-dark-text">
                          {c.nome}
                          {c.gratis && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-accent-amber/15 px-2 py-0.5 text-[11px] font-semibold text-accent-amber">
                              <Gift aria-hidden="true" className="h-3 w-3" /> grátis
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-dark-muted">
                          {c.gratis ? "não entra no custo" : `${brl.format(c.preco)} / mensagem`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <input
                        type="number"
                        min={0}
                        value={c.volume === 0 ? "" : c.volume}
                        placeholder="0"
                        onChange={(e) => setVolume(c.id, Number(e.target.value))}
                        className="w-24 rounded-lg border border-dark-border bg-dark-base px-3 py-1.5 text-right font-mono text-dark-text outline-none transition-colors focus:border-primary"
                        aria-label={`Mensagens de ${c.nome} por mês`}
                      />
                      <p className="mt-1 text-xs text-dark-muted">msgs/mês</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={SLIDER_MAX}
                      step={100}
                      value={Math.min(c.volume, SLIDER_MAX)}
                      onChange={(e) => setVolume(c.id, Number(e.target.value))}
                      className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-dark-border accent-primary"
                      aria-label={`Ajustar mensagens de ${c.nome}`}
                    />
                    <span className={`w-24 shrink-0 text-right text-sm font-semibold ${c.gratis ? "text-accent-amber" : "text-dark-text"}`}>
                      {c.gratis ? "R$ 0,00" : brl.format(c.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ajuste de preços (avançado) */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-dark-border bg-dark-surface">
              <button
                onClick={() => setAjusteAberto((a) => !a)}
                aria-expanded={ajusteAberto}
                aria-controls="ajuste-precos"
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-dark-muted">
                  <Sparkles aria-hidden="true" className="h-4 w-4 text-primary" />
                  Ajustar preços por mensagem (avançado)
                </span>
                <ChevronDown aria-hidden="true" className={`h-4 w-4 text-dark-muted transition-transform ${ajusteAberto ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {ajusteAberto && (
                  <motion.div
                    id="ajuste-precos"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-dark-border px-5 py-5">
                      <p className="mb-4 text-xs text-dark-muted">
                        Os valores da Meta mudam com o tempo. Ajuste aqui se tiver um preço
                        diferente (ex.: tabela do seu provedor).
                      </p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {categorias
                          .filter((c) => !c.gratis)
                          .map((c) => (
                            <label key={c.id} className="block">
                              <span className={`text-xs font-medium ${c.cor.text}`}>{c.nome}</span>
                              <div className="mt-1 flex items-center rounded-lg border border-dark-border bg-dark-base px-3 py-1.5 transition-colors focus-within:border-primary">
                                <span className="text-xs text-dark-muted">R$</span>
                                <input
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  value={precos[c.id]}
                                  onChange={(e) =>
                                    setPrecos((p) => ({ ...p, [c.id]: Math.max(0, Number(e.target.value) || 0) }))
                                  }
                                  className="w-full bg-transparent pl-2 font-mono text-sm text-dark-text outline-none"
                                />
                              </div>
                            </label>
                          ))}
                      </div>
                      <button
                        onClick={resetPrecos}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs text-dark-muted transition-colors hover:text-primary"
                      >
                        <RotateCcw aria-hidden="true" className="h-3 w-3" /> Restaurar valores da Meta
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Resultado */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-3xl border border-primary/20 bg-dark-surface p-7 shadow-2xl shadow-black/40">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              <p className="text-sm text-dark-muted">Custo estimado por mês</p>
              <p className="mt-1 text-[clamp(36px,7vw,52px)] font-bold leading-none text-dark-text">
                {brl.format(custos.totalMes)}
              </p>
              <p className="mt-3 text-sm text-dark-muted">
                <span className="font-semibold text-primary">{brl.format(custos.totalAno)}</span> por ano
              </p>

              {/* Breakdown bar */}
              {custos.totalMes > 0 && (
                <div className="mt-6">
                  <div className="flex h-2.5 overflow-hidden rounded-full bg-dark-border">
                    {custos.porCategoria
                      .filter((c) => c.subtotal > 0)
                      .map((c) => (
                        <div
                          key={c.id}
                          className={c.cor.barra}
                          style={{ width: `${(c.subtotal / custos.totalMes) * 100}%` }}
                          title={`${c.nome}: ${brl.format(c.subtotal)}`}
                        />
                      ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    {custos.porCategoria
                      .filter((c) => !c.gratis)
                      .map((c) => (
                        <div key={c.id} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-dark-muted">
                            <span className={`h-2.5 w-2.5 rounded-full ${c.cor.barra}`} />
                            {c.nome}
                          </span>
                          <span className="font-mono text-dark-text">{brl.format(c.subtotal)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-2 border-t border-dark-border pt-5 text-sm">
                <div className="flex items-center justify-between text-dark-muted">
                  <span>Total de mensagens</span>
                  <span className="font-mono text-dark-text">
                    {custos.totalMsgs.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30"
              >
                Quero implementar com a CompanyChat
              </a>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-dark-muted">
                Estimativa baseada em valores aproximados da Meta. O custo real depende do
                volume e das categorias efetivamente enviadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
