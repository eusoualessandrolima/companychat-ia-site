"use client";

import { motion } from "framer-motion";
import { Bot, Check, Mic, Play, type LucideIcon } from "lucide-react";

/** Tipos de balão suportados nas cenas do assistente. */
export type Bolha =
  | { t: "cliente"; texto: string }
  | { t: "ia"; texto: string }
  | { t: "audio"; de: "cliente" | "ia"; duracao: string; transcricao?: string }
  | { t: "sistema"; texto: string; icon?: LucideIcon }
  | { t: "card"; titulo: string; linhas: string[]; icon: LucideIcon };

type Props = {
  contato: string;
  canal: string;
  mensagens: Bolha[];
};

function Iniciais({ nome }: { nome: string }) {
  const letras = nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent-blue/30 text-xs font-semibold text-dark-text">
      {letras}
    </span>
  );
}

function Onda({ ativo }: { ativo: boolean }) {
  const alturas = [40, 70, 100, 55, 85, 35, 65, 95, 45, 75, 30, 60, 90, 50, 80];
  return (
    <span className="flex h-5 flex-1 items-center gap-[3px]">
      {alturas.map((h, i) => (
        <span
          key={i}
          className={`w-[2px] rounded-full ${ativo ? "bg-white/70" : "bg-dark-muted/60"}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </span>
  );
}

/** Janela de conversa reutilizável pelas cenas. Dados ilustrativos. */
export default function ChatMock({ contato, canal, mensagens }: Props) {
  return (
    <div className="relative mx-auto w-full max-w-[400px] lg:max-w-none">
      <div className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />

      <div className="overflow-hidden rounded-3xl border border-dark-border bg-dark-surface shadow-2xl shadow-black/50">
        {/* Cabeçalho da conversa */}
        <div className="flex items-center gap-3 border-b border-dark-border bg-dark-elevated px-4 py-3">
          <Iniciais nome={contato} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-dark-text">{contato}</p>
            <p className="truncate text-[11px] text-dark-muted">{canal}</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            <Bot aria-hidden="true" className="h-3 w-3" />
            IA
          </span>
        </div>

        {/* Mensagens */}
        <div className="flex min-h-[260px] flex-col gap-2.5 px-4 py-5">
          {mensagens.map((m, i) => {
            const delay = 0.12 + i * 0.14;

            if (m.t === "sistema") {
              const Icone = m.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay }}
                  className="flex justify-center"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-dark-border bg-dark-elevated px-3 py-1.5 text-[11px] text-dark-muted">
                    {Icone && <Icone aria-hidden="true" className="h-3 w-3 text-primary" />}
                    {m.texto}
                  </span>
                </motion.div>
              );
            }

            if (m.t === "card") {
              const Icone = m.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay }}
                  className="flex justify-end"
                >
                  <div className="w-[86%] rounded-2xl rounded-tr-sm border border-primary/20 bg-primary/10 p-3.5">
                    <p className="flex items-center gap-2 text-xs font-semibold text-primary">
                      <Icone aria-hidden="true" className="h-3.5 w-3.5" />
                      {m.titulo}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {m.linhas.map((linha) => (
                        <li key={linha} className="flex items-start gap-2 text-[12px] leading-snug text-dark-text">
                          <Check aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                          {linha}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            }

            if (m.t === "audio") {
              const daIa = m.de === "ia";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay }}
                  className={`flex ${daIa ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 ${
                      daIa
                        ? "rounded-tr-sm bg-primary text-white"
                        : "rounded-tl-sm bg-dark-elevated text-dark-text"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          daIa ? "bg-white/20 text-white" : "bg-primary/20 text-primary"
                        }`}
                      >
                        {daIa ? (
                          <Mic aria-hidden="true" className="h-3.5 w-3.5" />
                        ) : (
                          <Play aria-hidden="true" className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <Onda ativo={daIa} />
                      <span className={`text-[11px] tabular-nums ${daIa ? "text-white/80" : "text-dark-muted"}`}>
                        {m.duracao}
                      </span>
                    </div>
                    {m.transcricao && (
                      <p
                        className={`mt-2 border-t pt-2 text-[11px] italic leading-snug ${
                          daIa ? "border-white/20 text-white/80" : "border-white/10 text-dark-muted"
                        }`}
                      >
                        Transcrição: “{m.transcricao}”
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            }

            const doCliente = m.t === "cliente";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay }}
                className={`flex ${doCliente ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    doCliente
                      ? "rounded-tl-sm bg-dark-elevated text-dark-text"
                      : "rounded-tr-sm bg-primary text-white"
                  }`}
                >
                  {m.texto}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Barra inferior decorativa */}
        <div className="flex items-center gap-2 border-t border-dark-border bg-dark-elevated px-4 py-3">
          <div className="flex-1 rounded-full bg-dark-surface px-4 py-2 text-xs text-dark-muted">
            Digite uma mensagem…
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
            <Mic aria-hidden="true" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
