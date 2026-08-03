"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  MessageSquare,
  Target,
  BellRing,
  Check,
} from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { whatsappLink } from "./WhatsAppButton";

/* ─── Roteiro da cena ────────────────────────────────
   Uma única linha do tempo comanda o chat e a trilha de
   fluxo, para os dois contarem a mesma história.        */
type Passo =
  | { tipo: "msg"; lado: "user" | "ai"; texto: string; dur: number; fluxo?: number }
  | { tipo: "typing"; dur: number }
  | { tipo: "evento"; texto: string; dur: number; fluxo?: number }
  | { tipo: "pausa"; dur: number };

const CENA: Passo[] = [
  { tipo: "msg", lado: "user", texto: "Oi! Quanto custa?", dur: 1000, fluxo: 0 },
  { tipo: "typing", dur: 900 },
  { tipo: "msg", lado: "ai", texto: "Depende do tamanho do seu time 😊 Quantas pessoas atendem hoje?", dur: 1700 },
  { tipo: "msg", lado: "user", texto: "Somos 4 vendedores.", dur: 900, fluxo: 1 },
  { tipo: "typing", dur: 900 },
  { tipo: "msg", lado: "ai", texto: "Perfeito. Tenho um horário hoje às 15h, posso reservar?", dur: 1600 },
  { tipo: "msg", lado: "user", texto: "Pode sim", dur: 800 },
  { tipo: "typing", dur: 800 },
  { tipo: "msg", lado: "ai", texto: "Reunião confirmada para hoje às 15h ✅", dur: 1300, fluxo: 2 },
  { tipo: "evento", texto: "Lead criado no CRM Kanban", dur: 1200 },
  { tipo: "evento", texto: "Vendedor notificado no WhatsApp", dur: 2200, fluxo: 3 },
  { tipo: "pausa", dur: 1600 },
];

/* Conversa que já estava rolando quando a cena começa: evita o
   quadro vazio nos primeiros segundos. */
const HISTORICO = [
  { lado: "ai" as const,   texto: "Olá! 👋 Sou a IA da CompanyChat. Como posso ajudar?" },
  { lado: "user" as const, texto: "Vi o site de vocês" },
];

const ETAPAS = [
  { icon: MessageSquare, label: "Mensagem recebida" },
  { icon: Target,        label: "Lead qualificado" },
  { icon: CalendarCheck, label: "Reunião agendada" },
  { icon: BellRing,      label: "Time notificado" },
] as const;

const QUERY_MOVIMENTO = "(prefers-reduced-motion: reduce)";

function useMovimentoReduzido() {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(QUERY_MOVIMENTO);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(QUERY_MOVIMENTO).matches,
    () => false
  );
}

/** Avança pela CENA em laço. Com movimento reduzido, entrega o
 *  estado final de uma vez, sem timers. */
function useCena() {
  const reduzido = useMovimentoReduzido();
  const [passo, setPasso] = useState(0);

  useEffect(() => {
    if (reduzido) return;

    let atual = 0;
    let timer: ReturnType<typeof setTimeout>;

    const proximo = () => {
      timer = setTimeout(() => {
        atual = atual >= CENA.length - 1 ? 0 : atual + 1;
        setPasso(atual);
        proximo();
      }, CENA[atual].dur);
    };

    proximo();
    return () => clearTimeout(timer);
  }, [reduzido]);

  return reduzido ? CENA.length - 1 : passo;
}

/* ─── Indicador de digitação ─────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full bg-dark-muted ${
            i === 0 ? "animate-typing-1" : i === 1 ? "animate-typing-2" : "animate-typing-3"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Chat ao vivo ───────────────────────────────────── */
function ChatVivo({ passo }: { passo: number }) {
  const digitando = CENA[passo].tipo === "typing";
  // Na pausa a conversa desvanece, para o laço recomeçar limpo em vez
  // de trocar onze mensagens por uma de um quadro para o outro.
  const encerrando = CENA[passo].tipo === "pausa";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-dark-border bg-dark-surface shadow-2xl shadow-black/60">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 border-b border-dark-border bg-dark-elevated px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <Bot aria-hidden="true" className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-dark-text">IA CompanyChat</p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-dot-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-xs text-dark-muted">online 24/7</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {["bg-red-500/60", "bg-amber-500/60", "bg-green-500/60"].map((c, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-full ${c}`} />
          ))}
        </div>
      </div>

      {/* Conversa: altura fixa, mensagens antigas saem por cima com fade */}
      <div
        className={`flex h-[300px] flex-col justify-end gap-2 overflow-hidden px-4 py-4 transition-opacity duration-700 [mask-image:linear-gradient(to_bottom,transparent_0%,black_14%)] ${
          encerrando ? "opacity-0" : "opacity-100"
        }`}
      >
        {HISTORICO.map((h, i) => (
          <div key={`h${i}`} className={`flex ${h.lado === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                h.lado === "user"
                  ? "rounded-tr-sm bg-primary text-white"
                  : "rounded-tl-sm bg-dark-elevated text-dark-text"
              }`}
            >
              {h.texto}
            </div>
          </div>
        ))}

        {CENA.slice(0, passo + 1).map((p, i) => {
          if (p.tipo === "evento") {
            return (
              <div key={i} className="flex justify-center" style={{ animation: "message-in 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
                <div className="flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5">
                  <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="text-xs font-medium text-dark-text">{p.texto}</span>
                </div>
              </div>
            );
          }

          if (p.tipo !== "msg") return null;

          const doCliente = p.lado === "user";
          return (
            <div
              key={i}
              className={`flex ${doCliente ? "justify-end" : "justify-start"}`}
              style={{ animation: "message-in 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  doCliente
                    ? "rounded-tr-sm bg-primary text-white"
                    : "rounded-tl-sm bg-dark-elevated text-dark-text"
                }`}
              >
                {p.texto}
              </div>
            </div>
          );
        })}

        {digitando && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm bg-dark-elevated">
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      {/* Campo de mensagem (decorativo) */}
      <div className="flex items-center gap-2 border-t border-dark-border bg-dark-elevated px-4 py-3">
        <div className="flex-1 rounded-full bg-dark-surface px-4 py-2 text-xs text-dark-muted">
          Digite uma mensagem…
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <ArrowRight aria-hidden="true" className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
}

/* ─── Trilha do fluxo ────────────────────────────────── */
function TrilhaFluxo({ passo }: { passo: number }) {
  // Última etapa marcada até o passo atual.
  let ativa = -1;
  for (let i = 0; i <= passo; i++) {
    const p = CENA[i];
    if ("fluxo" in p && p.fluxo !== undefined) ativa = p.fluxo;
  }

  return (
    <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {ETAPAS.map((etapa, i) => {
        const concluida = i < ativa;
        const atual = i === ativa;
        const Icone = concluida ? Check : etapa.icon;

        return (
          <li
            key={etapa.label}
            className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 transition-all duration-500 ${
              atual
                ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                : concluida
                ? "border-dark-border bg-dark-surface"
                : "border-dark-border/60 bg-dark-surface/40"
            }`}
          >
            <Icone
              aria-hidden="true"
              className={`h-3.5 w-3.5 shrink-0 transition-colors duration-500 ${
                atual || concluida ? "text-primary" : "text-dark-muted/50"
              }`}
            />
            <span
              className={`text-[11px] font-medium leading-tight transition-colors duration-500 ${
                atual ? "text-dark-text" : concluida ? "text-dark-muted" : "text-dark-muted/50"
              }`}
            >
              {etapa.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* Mantém o relógio da cena isolado aqui: o resto do hero não
   re-renderiza a cada passo. */
function PainelVivo() {
  const passo = useCena();

  return (
    <>
      <ChatVivo passo={passo} />
      <TrilhaFluxo passo={passo} />
    </>
  );
}

/* ─── Hero ───────────────────────────────────────────── */
export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-dark-base pt-16">
      {/* Fundo: aurora + pontos de profundidade */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full opacity-[0.10]"
          style={{
            background: "radial-gradient(circle, #00ab7a 0%, #0092ff 50%, transparent 70%)",
            animation: "blob-float 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-48 -right-32 h-[600px] w-[600px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, #00ab7a 60%, transparent 70%)",
            animation: "blob-float-slow 18s ease-in-out infinite",
          }}
        />
        {[
          { top: "18%", left: "8%",  anim: "animate-badge-float-1" },
          { top: "62%", left: "18%", anim: "animate-badge-float-3" },
          { top: "28%", left: "54%", anim: "animate-badge-float-2" },
          { top: "78%", left: "62%", anim: "animate-badge-float-5" },
        ].map((p, i) => (
          <span
            key={i}
            className={`absolute hidden h-1 w-1 rounded-full bg-primary/40 blur-[1px] lg:block ${p.anim}`}
            style={{ top: p.top, left: p.left }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 lg:py-14">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          {/* ── Esquerda: mensagem ── */}
          {/* LCP: opacity fica em 1 no SSR; anima só o deslize, para o
             título da dobra pintar sem esperar o JS. */}
          <motion.div
            initial={{ y: 32 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-5 flex w-fit items-center gap-2.5 rounded-full border border-dark-border bg-dark-surface px-4 py-2 text-sm font-medium text-dark-muted">
              <span className="relative flex h-2 w-2">
                <span className="animate-dot-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Plataforma com IA integrada
            </div>

            <h1
              aria-label="Não somos apenas um CRM."
              className="text-[clamp(40px,4.4vw,56px)] font-bold leading-[1.03] tracking-[-0.03em] text-dark-text"
            >
              Não somos apenas um CRM.
            </h1>

            <p className="mt-4 text-[clamp(18px,1.8vw,20px)] font-medium leading-snug text-dark-muted">
              Quem usa CompanyChat não acompanha o mercado.
            </p>
            <p className="mt-1.5 text-[clamp(30px,3.2vw,40px)] font-bold leading-[1.05] tracking-[-0.02em] text-gradient-primary">
              Inova ele.
            </p>

            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-dark-muted">
              IA, automações com regras de negócio inteligentes, BI interno, mensageria
              conectada e decisões em tempo real, tudo fluindo em um sistema criado para
              escalar com você.
            </p>

            <motion.div
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <div className="cta-glow-wrap">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-2.5 rounded-full bg-primary px-9 py-4 font-semibold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40"
                >
                  Fale com um Especialista
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <a
                href="#servicos"
                className="flex items-center justify-center rounded-full border border-dark-border bg-dark-surface px-9 py-4 font-semibold text-dark-text transition-all hover:border-primary/40 hover:text-primary"
              >
                Ver Serviços
              </a>
            </motion.div>
          </motion.div>

          {/* ── Direita: produto em funcionamento ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[380px] lg:max-w-[420px]">
              <div className="absolute inset-0 -z-10 scale-105 rounded-3xl bg-primary/10 blur-3xl" />
              <PainelVivo />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
