"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Bot, MessageCircleOff } from "lucide-react";
import Logo from "@/components/Logo";
import { WHATSAPP_NUMBER, WhatsAppIcon } from "@/components/WhatsAppButton";
import Calculadora from "@/components/lp/Calculadora";
import FormularioLead from "@/components/lp/FormularioLead";
import { advogados } from "@/components/lp/conteudos/advogados";
import { empresas } from "@/components/lp/conteudos/empresas";
import { saude } from "@/components/lp/conteudos/saude";
import { seguros } from "@/components/lp/conteudos/seguros";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/* As páginas (Server Components) passam só o nome do nicho: os conteúdos
   carregam componentes de ícone, que não podem cruzar a fronteira
   servidor→cliente como prop. */
const CONTEUDOS = { saude, empresas, advogados, seguros } as const;

export type Nicho = keyof typeof CONTEUDOS;

/* Fundamentos reais da empresa, iguais em todas as LPs de nicho. Copy de
   nicho mora em `conteudos/`; isto aqui é institucional. */
const AUTORIDADE = [
  {
    marcador: "01",
    titulo: "IA no WhatsApp para atendimento",
    descricao: "É a nossa especialidade, não um recurso a mais",
  },
  {
    marcador: "02",
    titulo: "Implantação e treinamento inclusos",
    descricao: "Sem taxa de setup, com acompanhamento",
  },
  {
    marcador: "03",
    titulo: "CRM Kanban integrado",
    descricao: "Cada conversa vira um card no funil",
  },
  {
    marcador: "04",
    titulo: "Nosso WhatsApp é atendido pela mesma IA",
    descricao: "Você testa antes de contratar",
  },
];

function Revelar({
  children,
  atraso = 0,
  className,
}: {
  children: React.ReactNode;
  atraso?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: atraso, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
      {children}
    </p>
  );
}

function CTAPrincipal({
  rotulo,
  aoClicar,
}: {
  rotulo: string;
  aoClicar?: () => void;
}) {
  return (
    <a
      href="#oferta"
      onClick={aoClicar}
      className="animate-cta-pulse inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-on-primary transition-colors hover:bg-primary-dark"
    >
      {rotulo}
      <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0" />
    </a>
  );
}

function Fundo() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-clip">
      <div
        className="absolute inset-x-0 top-0 h-[900px] opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 75% 55% at 50% 30%, black 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 55% at 50% 30%, black 10%, transparent 75%)",
        }}
      />
      <div
        className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-[0.12]"
        style={{
          background:
            "radial-gradient(circle, #00c896 0%, #0092ff 50%, transparent 70%)",
          animation: "blob-float 14s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[30%] -right-32 h-[560px] w-[560px] rounded-full opacity-[0.08]"
        style={{
          background:
            "radial-gradient(circle, #a78bfa 0%, #00c896 60%, transparent 70%)",
          animation: "blob-float-slow 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export default function Landing({ nicho }: { nicho: Nicho }) {
  const conteudo = CONTEUDOS[nicho];
  const aoClicarCTA = () => window.fbq?.("track", "ViewContent");
  const metadeNichos = Math.ceil(conteudo.nichos.itens.length / 2);

  return (
    <div className="relative overflow-x-clip bg-dark-base text-dark-text">
      <Fundo />

      {/* ─── Cabeçalho ─────────────────────────────────── */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-[clamp(1rem,4vw,2rem)] py-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <Logo dark />
        <a
          href="#oferta"
          onClick={aoClicarCTA}
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-dark"
        >
          Testar a IA
        </a>
      </header>

      <main id="conteudo" tabIndex={-1} className="relative">
        {/* ─── Hero ────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)] pb-20 pt-10 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <Revelar className="flex justify-center">
              <div className="flex w-fit items-center gap-2.5 rounded-full border border-dark-border bg-white/[0.04] px-4 py-2 text-sm font-medium text-dark-muted">
                <conteudo.selo.icone
                  aria-hidden="true"
                  className="h-4 w-4 text-primary"
                />
                {conteudo.selo.texto}
              </div>
            </Revelar>

            <Revelar atraso={0.08}>
              <h1 className="mt-7 text-[clamp(34px,5.4vw,58px)] font-bold leading-[1.05] tracking-[-0.025em]">
                {conteudo.hero.inicio}
                <span className="text-gradient-primary"> {conteudo.hero.destaque}</span>
              </h1>
            </Revelar>

            <Revelar atraso={0.16}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-dark-muted">
                {conteudo.hero.descricao}
              </p>
            </Revelar>

            <Revelar atraso={0.24} className="mt-9 flex flex-col items-center gap-4">
              <CTAPrincipal rotulo={conteudo.hero.cta} aoClicar={aoClicarCTA} />
              <p className="flex items-center gap-2 text-sm text-dark-muted">
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                Você testa direto no WhatsApp, sem instalar nada
              </p>
            </Revelar>
          </div>

          {/* Barra de autoridade: fundamentos reais, sem selo inventado. */}
          <Revelar atraso={0.3}>
            <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-dark-border bg-dark-border sm:grid-cols-2 lg:grid-cols-4">
              {AUTORIDADE.map((item) => (
                <div key={item.marcador} className="bg-dark-surface p-6">
                  <span className="text-sm font-bold text-primary">
                    {item.marcador}
                  </span>
                  <h3 className="mt-3 text-[15px] font-bold leading-snug">
                    {item.titulo}
                  </h3>
                  <p className="mt-1.5 text-sm leading-snug text-dark-muted">
                    {item.descricao}
                  </p>
                </div>
              ))}
            </div>
          </Revelar>
        </section>

        {/* ─── Problema ────────────────────────────────── */}
        <section className="border-y border-dark-border bg-dark-surface py-20">
          <div className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)]">
            <div className="max-w-2xl">
              <Revelar>
                <Rotulo>{conteudo.problema.rotulo}</Rotulo>
                <h2 className="text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">
                  {conteudo.problema.titulo}
                  <span className="text-dark-muted"> {conteudo.problema.tituloSuave}</span>
                </h2>
                <p className="mt-5 leading-relaxed text-dark-muted">
                  {conteudo.problema.descricao}
                </p>
              </Revelar>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {conteudo.problema.itens.map((problema, i) => (
                <Revelar key={problema.titulo} atraso={i * 0.07}>
                  <div className="glass-card-dark h-full rounded-2xl p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                      <problema.icone
                        aria-hidden="true"
                        className="h-5 w-5 text-red-400"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{problema.titulo}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-dark-muted">
                      {problema.consequencia}
                    </p>
                  </div>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Calculadora ─────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)]">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <Revelar>
                <Rotulo>Calculadora de oportunidade</Rotulo>
                <h2 className="text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">
                  {conteudo.calculadora.titulo}
                </h2>
                <p className="mt-5 leading-relaxed text-dark-muted">
                  {conteudo.calculadora.descricao}
                </p>
                <div className="mt-8 hidden lg:block">
                  <CTAPrincipal
                    rotulo="Quero recuperar esse valor"
                    aoClicar={aoClicarCTA}
                  />
                </div>
              </Revelar>

              <Revelar atraso={0.1}>
                <Calculadora config={conteudo.calculadora} />
              </Revelar>

              <div className="lg:hidden">
                <CTAPrincipal
                  rotulo="Quero recuperar esse valor"
                  aoClicar={aoClicarCTA}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Como funciona ───────────────────────────── */}
        <section className="border-y border-dark-border bg-dark-surface py-20">
          <div className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)]">
            <div className="mx-auto max-w-2xl text-center">
              <Revelar>
                <Rotulo>Como funciona</Rotulo>
                <h2 className="text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">
                  {conteudo.mecanismo.titulo}
                </h2>
              </Revelar>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {conteudo.mecanismo.etapas.map((etapa, i) => (
                <Revelar key={etapa.titulo} atraso={i * 0.06}>
                  <div className="glass-card-dark h-full rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <etapa.icone
                          aria-hidden="true"
                          className="h-5 w-5 text-primary"
                        />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-dark-muted">
                        {etapa.fase}
                      </span>
                    </div>
                    <h3 className="mt-4 font-bold">{etapa.titulo}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-dark-muted">
                      {etapa.descricao}
                    </p>
                  </div>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Provas de competência ───────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)]">
            <div className="max-w-2xl">
              <Revelar>
                <Rotulo>Provas de competência</Rotulo>
                <h2 className="text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">
                  {conteudo.provas.titulo}
                </h2>
              </Revelar>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {conteudo.provas.itens.map((prova, i) => (
                <Revelar key={prova.indice} atraso={i * 0.08}>
                  <div className="flex h-full flex-col rounded-2xl border border-dark-border bg-dark-surface p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-white/10">
                        {prova.indice}
                      </span>
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {prova.tipo}
                      </span>
                    </div>
                    <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <prova.icone
                        aria-hidden="true"
                        className="h-5 w-5 text-primary"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{prova.titulo}</h3>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-dark-muted">
                      {prova.descricao}
                    </p>
                    <p className="mt-5 border-t border-dark-border pt-4 text-sm font-medium text-dark-text/80">
                      {prova.artefato}
                    </p>
                  </div>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Nichos ──────────────────────────────────── */}
        <section className="border-y border-dark-border bg-dark-surface py-16">
          <div className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)] text-center">
            <Revelar>
              <Rotulo>{conteudo.nichos.rotulo}</Rotulo>
              <h2 className="mx-auto max-w-2xl text-[clamp(24px,3.2vw,36px)] font-bold leading-[1.15] tracking-[-0.02em]">
                {conteudo.nichos.titulo}
              </h2>
            </Revelar>
          </div>

          {/* Duas fileiras em sentidos opostos; listas duplicadas para o
              loop do marquee não mostrar emenda. */}
          <div className="mt-10 space-y-4 overflow-hidden">
            {[
              {
                classe: "animate-marquee-left",
                itens: conteudo.nichos.itens.slice(0, metadeNichos),
              },
              {
                classe: "animate-marquee-right",
                itens: conteudo.nichos.itens.slice(metadeNichos),
              },
            ].map((fileira, f) => (
              <div key={f} className="flex overflow-hidden">
                <div className={`flex w-max gap-4 pr-4 ${fileira.classe}`}>
                  {[...fileira.itens, ...fileira.itens].map((segmento, i) => (
                    <span
                      key={`${segmento}-${i}`}
                      className="whitespace-nowrap rounded-full border border-dark-border bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-dark-text/90"
                    >
                      {segmento}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Antes e depois ──────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)]">
            <div className="mx-auto max-w-2xl text-center">
              <Revelar>
                <Rotulo>Antes e depois</Rotulo>
                <h2 className="text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">
                  {conteudo.comparacao.titulo}
                </h2>
              </Revelar>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Revelar>
                <div className="h-full rounded-2xl border border-dark-border bg-dark-surface p-7">
                  <h3 className="flex items-center gap-2.5 text-lg font-bold text-dark-muted">
                    <MessageCircleOff aria-hidden="true" className="h-5 w-5" />
                    {conteudo.comparacao.tituloAntes}
                  </h3>
                  <ul className="mt-5 space-y-3.5">
                    {conteudo.comparacao.antes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[15px] leading-snug text-dark-muted"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/70"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Revelar>

              <Revelar atraso={0.1}>
                <div className="glow-border h-full rounded-2xl bg-dark-elevated p-7">
                  <h3 className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-lg font-bold">
                    <Bot aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
                    <span className="min-w-0">Com a CompanyChat</span>
                    <span className="ml-auto rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
                      Recomendado
                    </span>
                  </h3>
                  <ul className="mt-5 space-y-3.5">
                    {conteudo.comparacao.depois.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[15px] leading-snug"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                          <ArrowRight
                            aria-hidden="true"
                            className="h-3 w-3 text-primary"
                          />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Revelar>
            </div>
          </div>
        </section>

        {/* ─── Oferta + formulário ─────────────────────── */}
        <section
          id="oferta"
          className="border-y border-dark-border bg-dark-surface py-20 scroll-mt-6"
        >
          <div className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)]">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <Revelar>
                  <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                    {conteudo.oferta.badge}
                  </span>
                  <h2 className="mt-6 text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">
                    {conteudo.oferta.titulo}
                  </h2>
                  <p className="mt-5 leading-relaxed text-dark-muted">
                    {conteudo.oferta.descricao}
                  </p>
                </Revelar>

                <Revelar atraso={0.1}>
                  <ul className="mt-8 space-y-3.5">
                    {conteudo.oferta.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[15px]">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                          <ArrowDown
                            aria-hidden="true"
                            className="h-3 w-3 rotate-[-135deg] text-primary"
                          />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Revelar>
              </div>

              <Revelar atraso={0.12}>
                <FormularioLead
                  config={conteudo.form}
                  segmentos={conteudo.nichos.itens}
                />
              </Revelar>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─────────────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-[clamp(1rem,4vw,2rem)]">
            <div className="text-center">
              <Revelar>
                <Rotulo>Perguntas frequentes</Rotulo>
                <h2 className="text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">
                  {conteudo.faq.titulo}
                </h2>
              </Revelar>
            </div>

            <div className="mt-10 space-y-3">
              {conteudo.faq.itens.map((item, i) => (
                <Revelar key={item.pergunta} atraso={i * 0.05}>
                  <details className="group rounded-2xl border border-dark-border bg-dark-surface open:border-primary/30">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold [&::-webkit-details-marker]:hidden">
                      {item.pergunta}
                      <ArrowDown
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <p className="px-5 pb-5 text-[15px] leading-relaxed text-dark-muted">
                      {item.resposta}
                    </p>
                  </details>
                </Revelar>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA final ───────────────────────────────── */}
        <section className="border-t border-dark-border bg-dark-surface py-20">
          <div className="mx-auto max-w-2xl px-[clamp(1rem,4vw,2rem)] text-center">
            <Revelar>
              <Rotulo>Próximo passo</Rotulo>
              <h2 className="text-[clamp(28px,4vw,44px)] font-bold leading-[1.1] tracking-[-0.02em]">
                {conteudo.ctaFinal.titulo}
              </h2>
              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-dark-muted">
                {conteudo.ctaFinal.descricao}
              </p>
              <div className="mt-9 flex justify-center">
                <CTAPrincipal rotulo="Testar a IA agora" aoClicar={aoClicarCTA} />
              </div>
            </Revelar>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-dark-border pt-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-[clamp(1rem,4vw,2rem)] text-center">
          <Logo dark />
          <p className="text-sm text-dark-muted">
            © {new Date().getFullYear()} CompanyChat. Todos os direitos
            reservados.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-dark-muted transition-colors hover:text-dark-text"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            Fale com a gente no WhatsApp
          </a>
          <a
            href="/privacidade"
            className="text-sm text-dark-muted underline underline-offset-4 transition-colors hover:text-dark-text"
          >
            Política de Privacidade
          </a>
        </div>
      </footer>
    </div>
  );
}
