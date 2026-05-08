"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { whatsappLink } from "./WhatsAppButton";

/* ─── Counter animation ─────────────────────────────── */
function CountUp({
  to,
  suffix = "",
  duration = 1400,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setCount(Math.round(eased * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ─── Typing indicator dots ─────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full bg-dark-muted ${
            i === 0
              ? "animate-typing-1"
              : i === 1
              ? "animate-typing-2"
              : "animate-typing-3"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Chat messages ─────────────────────────────────── */
type Msg =
  | { kind: "msg"; side: "user" | "ai"; text: string; showAt: number }
  | { kind: "typing"; showAt: number; hideAt: number };

const MESSAGES: Msg[] = [
  { kind: "msg",    side: "ai",   text: "Olá! 👋 Sou a IA da CompanyChat. Como posso ajudar?", showAt: 800  },
  { kind: "typing", showAt: 1700, hideAt: 2400 },
  { kind: "msg",    side: "user", text: "Qual o preço do plano?",                               showAt: 2400 },
  { kind: "typing", showAt: 3000, hideAt: 3700 },
  { kind: "msg",    side: "ai",   text: "Nosso plano Starter começa em R$347/mês com IA 24/7 e setup em 7 dias ✅", showAt: 3700 },
  { kind: "typing", showAt: 4400, hideAt: 5000 },
  { kind: "msg",    side: "ai",   text: "Quer que eu chame um especialista agora? 😊",           showAt: 5000 },
];

function ChatMockup() {
  const [visible, setVisible] = useState<number[]>([]);
  const [typingActive, setTypingActive] = useState<boolean[]>(
    MESSAGES.map(() => false)
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    MESSAGES.forEach((msg, i) => {
      timers.push(
        setTimeout(() => {
          if (msg.kind === "msg") {
            setVisible((v) => [...v, i]);
          } else {
            setTypingActive((t) => {
              const next = [...t];
              next[i] = true;
              return next;
            });
          }
        }, msg.showAt)
      );

      if (msg.kind === "typing") {
        timers.push(
          setTimeout(() => {
            setTypingActive((t) => {
              const next = [...t];
              next[i] = false;
              return next;
            });
          }, msg.hideAt)
        );
      }
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-3xl border border-dark-border bg-dark-surface shadow-2xl shadow-black/50 lg:max-w-none">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-dark-border bg-dark-elevated px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-dark-text">IA CompanyChat</p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs text-dark-muted">online 24/7</span>
          </div>
        </div>
        {/* Window dots (decorative) */}
        <div className="ml-auto flex items-center gap-1.5">
          {["bg-red-500/60","bg-amber-500/60","bg-green-500/60"].map((c,i)=>(
            <span key={i} className={`h-2.5 w-2.5 rounded-full ${c}`} />
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex min-h-[220px] flex-col gap-2 px-4 py-4">
        {MESSAGES.map((msg, i) => {
          if (msg.kind === "typing") {
            if (!typingActive[i]) return null;
            return (
              <div key={i} className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-dark-elevated">
                  <TypingDots />
                </div>
              </div>
            );
          }

          if (!visible.includes(i)) return null;

          const isUser = msg.side === "user";
          return (
            <div
              key={i}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              style={{ animation: "message-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both" }}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "rounded-tr-sm bg-primary text-white"
                    : "rounded-tl-sm bg-dark-elevated text-dark-text"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom bar (decorative) */}
      <div className="flex items-center gap-2 border-t border-dark-border bg-dark-elevated px-4 py-3">
        <div className="flex-1 rounded-full bg-dark-surface px-4 py-2 text-xs text-dark-muted">
          Digite uma mensagem...
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <ArrowRight className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
}

/* ─── Stats ─────────────────────────────────────────── */
const stats = [
  { num: 500,  suffix: "+", label: "Empresas Atendidas" },
  { num: 70,   suffix: "%", label: "Redução de Custo"   },
  { num: 98,   suffix: "%", label: "Satisfação"         },
  { num: 7,    suffix: " dias", label: "Até o Go-live"  },
];

/* ─── Hero ──────────────────────────────────────────── */
export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-dark-base pt-16">
      {/* Aurora gradient background */}
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
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
          {/* ── Left: Copy ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <div className="mb-8 flex w-fit items-center gap-2.5 rounded-full border border-dark-border bg-dark-surface px-4 py-2 text-sm font-medium text-dark-muted">
              <span className="relative flex h-2 w-2">
                <span className="animate-dot-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              IA que trabalha por você — sem salário, sem pausas
            </div>

            {/* Headline */}
            <h1
              className="text-[clamp(48px,6vw,88px)] font-bold leading-[0.95] tracking-[-0.03em] text-dark-text"
            >
              Seu assistente IA{" "}
              <br className="hidden sm:block" />
              vende enquanto{" "}
              <span className="text-gradient-primary">você dorme.</span>
            </h1>

            <p className="mt-7 max-w-lg text-[17px] leading-relaxed text-dark-muted">
              Crie um assistente personalizado que responde,{" "}
              <span className="font-semibold text-dark-text">qualifica leads</span> e agenda
              clientes no WhatsApp — 24 horas por dia, 7 dias por semana.
            </p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              {/* Primary CTA with glow */}
              <div className="cta-glow-wrap">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-2.5 rounded-full bg-primary px-9 py-4 font-semibold text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40"
                >
                  Fale com um Especialista
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <a
                href="#servicos"
                className="flex items-center justify-center rounded-full border border-dark-border bg-dark-surface px-9 py-4 font-semibold text-dark-text transition-all hover:border-primary/40 hover:text-primary"
              >
                Ver Serviços
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-dark-border bg-dark-surface px-4 py-3 text-center"
                >
                  <div className="text-2xl font-bold text-dark-text">
                    <CountUp to={s.num} suffix={s.suffix} />
                  </div>
                  <div className="mt-0.5 text-xs text-dark-muted">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Chat Mockup ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            {/* Glow behind mockup */}
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-primary/10 blur-3xl" />
              <ChatMockup />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
