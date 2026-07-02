"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Clock, FileText, RefreshCw } from "lucide-react";

type Fase = {
  icon: React.ElementType;
  titulo: string;
  tempo: string;
  legenda: string;
  detalhe: string;
  cor: string;
  barra: string;
};

const fases: Fase[] = [
  {
    icon: MessageCircle,
    titulo: "Janela aberta",
    tempo: "t = 0",
    legenda: "Cliente manda mensagem",
    detalhe:
      "Assim que o cliente te chama, abre uma janela de 24 horas. Durante esse período você responde livremente, em qualquer formato e quantas vezes quiser, de graça.",
    cor: "text-primary",
    barra: "bg-primary",
  },
  {
    icon: Clock,
    titulo: "Janela fecha",
    tempo: "t = 24h",
    legenda: "Sem resposta do cliente",
    detalhe:
      "24 horas depois da última mensagem do cliente, a janela fecha. A partir daí, para iniciar uma nova conversa você precisa enviar um template previamente aprovado pela Meta.",
    cor: "text-accent-amber",
    barra: "bg-accent-amber",
  },
  {
    icon: FileText,
    titulo: "Template + resposta",
    tempo: "reabertura",
    legenda: "Você envia um template",
    detalhe:
      "Você envia um template aprovado (utilidade, marketing ou autenticação). Quando o cliente responde, uma nova janela de 24 horas é aberta e você volta a conversar livremente.",
    cor: "text-accent-blue",
    barra: "bg-accent-blue",
  },
  {
    icon: RefreshCw,
    titulo: "Ciclo recomeça",
    tempo: "+ 24h",
    legenda: "Nova janela aberta",
    detalhe:
      "Na prática, a janela é o que garante o atendimento gratuito. Toda vez que o cliente responde, o relógio reinicia e a conversa continua sem precisar de template.",
    cor: "text-accent-purple",
    barra: "bg-accent-purple",
  },
];

export default function Janela24h() {
  const [ativo, setAtivo] = useState(0);
  const fase = fases[ativo];

  return (
    <section id="janela" className="relative bg-background py-24">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            A janela de <span className="text-primary">24 horas</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            É a regra mais importante da API Oficial. Entender a janela é entender
            quando você paga e quando o atendimento é gratuito.
          </p>
        </motion.div>

        {/* Timeline card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-14 overflow-hidden rounded-3xl border border-dark-border bg-dark-base p-6 shadow-2xl shadow-black/20 sm:p-10"
        >
          {/* Progress rail */}
          <div className="relative">
            <div className="absolute left-0 right-0 top-6 hidden h-1 rounded-full bg-dark-border sm:block" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 sm:gap-3">
              {fases.map((f, i) => {
                const isActive = i === ativo;
                return (
                  <button
                    key={i}
                    onClick={() => setAtivo(i)}
                    aria-pressed={isActive}
                    aria-label={`${f.titulo} (${f.tempo}): ${f.legenda}`}
                    className="group relative flex items-start gap-4 text-left sm:flex-col sm:items-center sm:text-center"
                  >
                    <span
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        isActive
                          ? `border-transparent ${f.barra} text-white shadow-lg`
                          : "border-dark-border bg-dark-surface text-dark-muted group-hover:border-white/20"
                      }`}
                    >
                      <f.icon className="h-5 w-5" />
                    </span>
                    <div className="sm:mt-3">
                      <p
                        className={`text-sm font-semibold transition-colors ${
                          isActive ? "text-dark-text" : "text-dark-muted group-hover:text-dark-text"
                        }`}
                      >
                        {f.titulo}
                      </p>
                      <p className={`mt-0.5 text-xs font-mono ${isActive ? f.cor : "text-dark-muted"}`}>
                        {f.tempo}
                      </p>
                      <p className="mt-1 text-xs text-dark-muted">{f.legenda}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div aria-live="polite" className="mt-8 rounded-2xl border border-dark-border bg-dark-surface p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={ativo}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-4"
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 ${fase.cor}`}>
                  <fase.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-dark-text">
                    {fase.titulo} <span className={`ml-1 font-mono text-xs ${fase.cor}`}>{fase.tempo}</span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-dark-muted">{fase.detalhe}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-sm text-text-secondary">
          <span className="font-semibold text-foreground">Resumindo:</span> se o cliente te
          chamou nas últimas 24h, responder é grátis. Fora disso, você paga por um template.
        </p>
      </div>
    </section>
  );
}
