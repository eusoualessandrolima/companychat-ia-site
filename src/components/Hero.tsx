"use client";

import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BatteryFull,
  CalendarCheck,
  Check,
  CheckCheck,
  MessageSquare,
  Mic,
  MoreVertical,
  Phone,
  Plus,
  Signal,
  Smile,
  Target,
  Wifi,
} from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useMovimentoReduzido } from "@/hooks/useMovimentoReduzido";
import { whatsappLink } from "./WhatsAppButton";

/* Layout effect roda antes da pintura no cliente e não existe no servidor.
   É o que permite entregar a conversa inteira no HTML (legível sem JS) e
   recolhê-la para o início da cena sem o usuário ver o quadro cheio. */
const useEfeitoDeLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ─── Roteiro da cena ────────────────────────────────
   Uma única linha do tempo comanda o chat e a trilha de
   fluxo, para os dois contarem a mesma história.        */
type Passo =
  | { tipo: "msg"; lado: "in" | "out"; texto: string; hora: string; dur: number; etapa?: number }
  | { tipo: "typing"; dur: number }
  | { tipo: "espera"; dur: number }
  | { tipo: "limpar"; dur: number };

const CENA: Passo[] = [
  {
    tipo: "msg",
    lado: "in",
    texto: "Olá, Pedro! 👋 Posso fazer 2 perguntas rápidas para entender sua operação?",
    hora: "09:41",
    dur: 900,
    etapa: 0,
  },
  { tipo: "msg", lado: "out", texto: "Claro!", hora: "09:41", dur: 550 },
  {
    tipo: "msg",
    lado: "in",
    texto: "Quantas pessoas atendem hoje pelo WhatsApp?",
    hora: "09:41",
    dur: 700,
  },
  { tipo: "msg", lado: "out", texto: "Somos 4 vendedores.", hora: "09:42", dur: 600, etapa: 1 },
  { tipo: "typing", dur: 1100 },
  {
    tipo: "msg",
    lado: "in",
    texto:
      "Perfeito. Dá para centralizar as conversas, qualificar cada lead e distribuir as oportunidades automaticamente. Quer ver na prática?",
    hora: "09:42",
    dur: 1000,
    etapa: 2,
  },
  { tipo: "espera", dur: 5500 },
  { tipo: "limpar", dur: 700 },
];

/** Último passo com conteúdo: é o que o servidor entrega e o que fica no ar
 *  quando a pessoa pediu menos movimento. */
const PASSO_FINAL = CENA.findIndex((p) => p.tipo === "espera") - 1;

const ETAPAS = [
  { icon: MessageSquare, label: "Mensagem recebida" },
  { icon: Target, label: "Lead qualificado" },
  { icon: CalendarCheck, label: "Reunião agendada" },
] as const;

/* Cores do WhatsApp em dark mode — fora dos tokens do site de propósito:
   o reconhecimento imediato depende de o app parecer o app. */
const WA = {
  tela: "#0b141a",
  barra: "#202c33",
  recebida: "#202c33",
  enviada: "#005c4b",
  composer: "#111b21",
  acao: "#00a884",
  check: "#53bdeb",
} as const;

/** `true` enquanto a aba está à vista. Segura o laço quando a pessoa troca
 *  de aba: nada de cena rodando sozinha em segundo plano. */
function useAbaVisivel() {
  return useSyncExternalStore(
    (avisar) => {
      document.addEventListener("visibilitychange", avisar);
      return () => document.removeEventListener("visibilitychange", avisar);
    },
    () => document.visibilityState === "visible",
    () => true
  );
}

/** Avança pela CENA em laço enquanto `ativo`. Pausar não perde o lugar:
 *  o índice vive numa ref e a cena retoma de onde parou. */
function useCena(ativo: boolean, reduzido: boolean) {
  const [passo, setPasso] = useState(PASSO_FINAL);
  const indice = useRef(PASSO_FINAL);

  useEfeitoDeLayout(() => {
    if (reduzido) return;
    indice.current = 0;
    setPasso(0);
  }, [reduzido]);

  useEffect(() => {
    if (reduzido || !ativo) return;

    let timer: ReturnType<typeof setTimeout>;
    const agendar = () => {
      timer = setTimeout(() => {
        indice.current = indice.current >= CENA.length - 1 ? 0 : indice.current + 1;
        setPasso(indice.current);
        agendar();
      }, CENA[indice.current].dur);
    };

    agendar();
    return () => clearTimeout(timer);
  }, [ativo, reduzido]);

  return reduzido ? PASSO_FINAL : passo;
}

/* ─── Indicador de digitação ─────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full bg-white/45 ${
            i === 0 ? "animate-typing-1" : i === 1 ? "animate-typing-2" : "animate-typing-3"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Tela do WhatsApp ───────────────────────────────── */
function TelaWhatsApp({ passo, montado }: { passo: number; montado: boolean }) {
  const digitando = CENA[passo].tipo === "typing";
  // Antes de o laço assumir, o HTML entrega a conversa inteira: sem JS a
  // demonstração continua legível.
  const limpando = CENA[passo].tipo === "limpar";

  return (
    <div className="relative overflow-hidden rounded-[34px]" style={{ background: WA.tela }}>
      {/* Pílula de sensores */}
      <div className="absolute left-1/2 top-2.5 z-10 h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-[#020303]" />

      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pb-1.5 pt-3 text-[11px] font-semibold text-white/95">
        <span>9:41</span>
        <span className="flex items-center gap-1.5">
          <Signal aria-hidden="true" className="h-3 w-3" />
          <Wifi aria-hidden="true" className="h-3 w-3" />
          <BatteryFull aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Cabeçalho da conversa */}
      <div
        className="grid grid-cols-[34px_1fr_auto] items-center gap-2.5 px-3 py-2.5"
        style={{ background: WA.barra }}
      >
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#006f57] text-sm font-semibold text-white">
          C
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-semibold text-white">
            CompanyChat
          </span>
          <span className="block text-[11px] text-[#8696a0]">online agora</span>
        </span>
        <span className="flex items-center gap-3 text-[#aebac1]">
          <Phone aria-hidden="true" className="h-4 w-4" />
          <MoreVertical aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>

      {/* Conversa: altura fixa, o excedente desvanece no topo. Em telas
          baixas o quadro encolhe para o hero não empurrar a trilha até os
          botões flutuantes de WhatsApp. */}
      <div
        className={`flex h-[372px] flex-col justify-end gap-1.5 overflow-hidden px-2.5 py-3 transition-opacity duration-500 [mask-image:linear-gradient(to_bottom,transparent_0%,black_12%)] [@media(max-height:780px)]:h-[296px] ${
          limpando ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        <span className="mx-auto rounded-md bg-[#182229] px-2 py-1 text-[10px] font-medium tracking-wide text-[#8696a0]">
          HOJE
        </span>

        {CENA.map((p, i) => {
          if (p.tipo !== "msg") return null;
          if (montado && i > passo) return null;

          const enviada = p.lado === "out";
          return (
            <div
              key={i}
              className={`max-w-[84%] rounded-lg px-2.5 pb-1.5 pt-2 text-[13px] leading-[1.38] text-white/95 shadow-sm shadow-black/20 ${
                enviada ? "self-end" : "self-start"
              }`}
              style={{
                background: enviada ? WA.enviada : WA.recebida,
                animation: montado ? "message-in 0.4s cubic-bezier(0.16,1,0.3,1) both" : undefined,
              }}
            >
              {p.texto}
              {/* /70 e não /50 como no WhatsApp real: abaixo disso o horário
                  fica sob 4.5:1 e reprova em AA. */}
              <span className="float-right ml-2 mt-1 flex items-center gap-0.5 text-[10px] text-white/70">
                {p.hora}
                {enviada && (
                  <CheckCheck
                    aria-hidden="true"
                    className="h-3 w-3"
                    style={{ color: WA.check }}
                  />
                )}
              </span>
            </div>
          );
        })}

        {digitando && (
          <div className="self-start rounded-lg" style={{ background: WA.recebida }}>
            <TypingDots />
          </div>
        )}
      </div>

      {/* Composer (decorativo) */}
      <div
        className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-2.5 pb-3 pt-2"
        style={{ background: WA.composer }}
      >
        <Plus aria-hidden="true" className="h-5 w-5 text-[#8696a0]" />
        <span
          className="flex items-center justify-between rounded-full px-3 py-2 text-[12px] text-[#8696a0]"
          style={{ background: WA.barra }}
        >
          Mensagem
          <Smile aria-hidden="true" className="h-4 w-4" />
        </span>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: WA.acao }}
        >
          <Mic aria-hidden="true" className="h-4 w-4 text-white" />
        </span>
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
    if (p.tipo === "msg" && p.etapa !== undefined) ativa = p.etapa;
  }

  return (
    /* Os botões flutuantes de WhatsApp ocupam o canto inferior direito fixo:
       no celular a trilha some (a conversa já conta a história) e no desktop
       ela encosta à esquerda da coluna, longe deles. */
    <ol className="mt-5 hidden w-full flex-wrap justify-center gap-2 sm:flex lg:-translate-x-6 lg:justify-start">
      {ETAPAS.map((etapa, i) => {
        const concluida = i < ativa;
        const atual = i === ativa;
        const Icone = concluida ? Check : etapa.icon;

        return (
          <li
            key={etapa.label}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 transition-all duration-500 ${
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
                atual || concluida ? "text-primary" : "text-dark-muted/80"
              }`}
            />
            <span
              /* A etapa ainda não alcançada fica apagada, mas não abaixo de
                 4.5:1 — o estado é decoração, o rótulo é informação. */
              className={`whitespace-nowrap text-[11px] font-medium leading-tight transition-colors duration-500 ${
                atual ? "text-dark-text" : concluida ? "text-dark-muted" : "text-dark-muted/80"
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
function Smartphone() {
  const reduzido = useMovimentoReduzido();
  const abaVisivel = useAbaVisivel();
  const referencia = useRef<HTMLElement>(null);
  const emVista = useInView(referencia, { amount: 0.3 });

  const [montado, setMontado] = useState(false);
  useEfeitoDeLayout(() => setMontado(!reduzido), [reduzido]);

  const passo = useCena(emVista && abaVisivel, reduzido);

  return (
    <figure
      ref={referencia}
      className="relative m-0 flex w-full flex-col items-center"
      aria-label="Demonstração: a IA da CompanyChat atende, qualifica o lead e agenda a reunião pelo WhatsApp"
    >
      {/* Halo verde atrás do aparelho */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[480px] w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 blur-[10px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,220,163,0.22), rgba(0,220,163,0) 67%)",
        }}
      />

      <motion.div
        initial={reduzido ? false : { opacity: 0, y: 26, rotateY: -10, rotateZ: 1 }}
        animate={
          reduzido || emVista
            ? { opacity: 1, y: 0, rotateY: -5, rotateZ: 1 }
            : { opacity: 0, y: 26, rotateY: -10, rotateZ: 1 }
        }
        transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          transformPerspective: 950,
          background:
            "linear-gradient(110deg, #51605d 0%, #161b1c 12%, #050708 48%, #505b59 91%, #151919 100%)",
          boxShadow:
            "0 38px 80px rgba(0,0,0,0.5), -12px 8px 35px rgba(0,205,154,0.14), inset 0 0 0 1px rgba(255,255,255,0.34)",
        }}
        className="w-[min(322px,82vw)] rounded-[42px] p-[8px]"
      >
        <TelaWhatsApp passo={passo} montado={montado} />
      </motion.div>

      <figcaption className="sr-only">
        Simulação da conversa: a IA faz duas perguntas, o cliente responde que o time tem
        quatro vendedores e a plataforma qualifica o lead e distribui a oportunidade.
      </figcaption>

      <TrilhaFluxo passo={passo} />
    </figure>
  );
}

/* ─── Hero ───────────────────────────────────────────── */
export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-dark-base pt-16">
      {/* Fundo: aurora + pontos de profundidade */}
      <div className="pointer-events-none absolute inset-0">
        {/* Malha de pontos: textura de fundo que some nas bordas para não
            competir com o texto nem com o painel do chat. */}
        <div
          className="absolute inset-0 opacity-75"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 75%)",
          }}
        />
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

            <h1 className="text-[clamp(40px,4.4vw,56px)] font-bold leading-[1.03] tracking-[-0.03em] text-dark-text">
              Não somos apenas um CRM.
            </h1>

            <p className="mt-4 max-w-xl text-[clamp(19px,2vw,24px)] font-medium leading-snug text-dark-text/90">
              Somos a inteligência que transforma conversas em crescimento.
            </p>

            <p className="mt-3 text-[clamp(16px,1.7vw,19px)] leading-relaxed text-dark-muted">
              Quem usa a CompanyChat não acompanha o mercado.{" "}
              <span className="relative inline-block whitespace-nowrap font-bold text-transparent">
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #00ab7a 0%, #4ee0b5 55%, #00c896 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  Inova ele.
                </span>
                {/* Traço luminoso: desenha uma vez, quando a seção entra na tela */}
                <motion.span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-[2px] w-full origin-left rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #00dba6, transparent)",
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.8, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </span>
            </p>

            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-dark-muted/85">
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
                  className="group relative flex items-center justify-center gap-2.5 rounded-full bg-primary px-9 py-4 font-semibold text-on-primary shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40"
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
          {/* pb fora do desktop: numa coluna só o telefone termina no canto
              inferior, exatamente onde ficam os botões flutuantes de WhatsApp. */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center pb-20 lg:pb-0 lg:justify-end"
          >
            <Smartphone />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
