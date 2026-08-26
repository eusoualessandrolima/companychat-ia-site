"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Info, X } from "lucide-react";
import Logo from "@/components/Logo";
import { WHATSAPP_NUMBER, WhatsAppIcon } from "@/components/WhatsAppButton";
import { evento, urlInicial } from "@/lib/analytics";
import FormularioCandidatura from "./FormularioCandidatura";
import {
  ANCORA_FORMULARIO,
  CAMPANHA_ENCERRADA,
  capacidades,
  condicoes,
  ctaFinal,
  encerramento,
  entrega,
  hero,
  perfil,
} from "./conteudo";

/* Landing da campanha "10 Empresas, 10 Assistentes de IA".
 *
 * Estrutura própria, e não a `Landing` das LPs de nicho: aquela é um funil
 * longo (calculadora, provas, marquee, antes/depois) e esta precisa ser curta,
 * com um objetivo só — a candidatura. O que se reaproveita é o sistema visual:
 * tokens de cor, `glass-card-dark`, `glow-border`, os pulsos de CTA e o mesmo
 * padrão de revelação ao rolar. Nenhum arquivo das LPs é tocado. */

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

/** Mesma revelação, mas como `<li>`: um `<div>` entre `<ul>` e `<li>` é HTML
 *  inválido e alguns leitores de tela deixam de anunciar a lista. */
function RevelarItem({
  children,
  atraso = 0,
  className,
}: {
  children: React.ReactNode;
  atraso?: number;
  className?: string;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: atraso, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.li>
  );
}

function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
      {children}
    </p>
  );
}

/** Todo CTA da página leva ao mesmo lugar: o formulário. O `scroll-smooth` do
 *  documento cuida da rolagem, e ele já respeita `prefers-reduced-motion`. */
function CTA({
  rotulo,
  local,
  className = "",
}: {
  rotulo: string;
  local: string;
  className?: string;
}) {
  return (
    <a
      href={`#${ANCORA_FORMULARIO}`}
      onClick={() => evento("campanha10_cta_clicked", { local })}
      /* `min-h-12` = 48px, o piso da área de toque. Em ≤360px o rótulo só cabe
         numa linha com padding e corpo um pouco menores; o botão volta aos
         ~56px de altura em vez dos 80px que o texto em duas linhas exigia. */
      className={`botao-marca group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-4 text-base font-semibold text-on-primary max-[360px]:gap-2 max-[360px]:px-5 max-[360px]:text-[0.9375rem] sm:px-8 sm:text-lg ${className}`}
    >
      {CAMPANHA_ENCERRADA ? encerramento.cta : rotulo}
      <ArrowRight
        aria-hidden="true"
        className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5"
      />
    </a>
  );
}

/** Toma o lugar do formulário quando `CAMPANHA_ENCERRADA` está ligada. */
function Encerrada() {
  return (
    <div className="rounded-3xl border border-dark-border bg-dark-elevated p-7 text-center sm:p-9">
      <span className="inline-block rounded-full border border-dark-border bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-dark-muted">
        {encerramento.badge}
      </span>
      <h2 className="mt-6 text-[clamp(24px,3.4vw,34px)] font-bold leading-[1.15] tracking-[-0.02em]">
        {encerramento.titulo}
      </h2>
      <p className="mx-auto mt-5 max-w-lg leading-relaxed text-dark-muted">
        {encerramento.texto}
      </p>
      <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-dark-muted/85">
        {encerramento.complemento}
      </p>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => evento("campanha10_whatsapp_clicked", { local: "encerrada" })}
        className="mt-8 inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-7 py-3.5 font-semibold text-on-primary transition-colors hover:bg-primary-dark"
      >
        <WhatsAppIcon className="h-5 w-5" />
        {encerramento.botao}
      </a>
    </div>
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
            "radial-gradient(circle, #00ab7a 0%, #0092ff 50%, transparent 70%)",
          animation: "blob-float 14s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export default function Campanha() {
  /* Visualização da página no mesmo canal dos demais eventos do funil. O
     `PageView` do Pixel já sai no script; este é o evento nomeado da campanha,
     que também alimenta o `dataLayer` quando houver contêiner de tags. */
  useEffect(() => {
    urlInicial();
    evento("campanha10_page_view");
  }, []);

  return (
    <div className="relative overflow-x-clip bg-dark-base text-dark-text">
      <Fundo />

      {/* Sem menu: a página tem um objetivo só. O cabeçalho carrega a marca e
          o mesmo CTA de todo o resto. */}
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between gap-4 px-[clamp(1rem,4vw,2rem)] py-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <Logo dark />
        <a
          href={`#${ANCORA_FORMULARIO}`}
          onClick={() => evento("campanha10_cta_clicked", { local: "cabecalho" })}
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-dark"
        >
          Candidatar
        </a>
      </header>

      <main id="conteudo" tabIndex={-1} className="relative">
        {/* ─── Hero ────────────────────────────────────── */}
        {/* `max-[360px]:` — só nas telas mais estreitas (iPhone SE e parentes),
            onde o hero inteiro precisa caber em 640px de altura para o CTA
            chegar à primeira dobra. Nada disso vale de 361px para cima. */}
        <section className="mx-auto max-w-5xl px-[clamp(1rem,4vw,2rem)] pb-16 pt-8 max-[360px]:pb-10 max-[360px]:pt-4 sm:pt-14">
          {/* Nada do hero entra por `Revelar`.
              O `Revelar` renderiza `opacity: 0` já no HTML do servidor e só
              acende quando o JS hidrata. Como o `<h1>` daqui é o elemento de
              LCP, isso empurrava a pintura para 5,2 s no Lighthouse mobile
              (91% em render delay) e deixava o topo da página em branco para
              quem chega com conexão ruim — justamente o tráfego de anúncio.
              A animação de entrada segue valendo da segunda dobra em diante. */}
          {/* 58rem = 928px. A medida sai da fonte, não do gosto: no teto de
              64px, "mais eficiência e agilidade" ocupa 868px. Um container de
              864px estouraria por 4px e quebraria a linha do degradê em duas,
              desfazendo a composição. */}
          <div className="max-w-[58rem]">
            {/* Escassez declarada, sem contador: são 10 vagas fixas, e não
                existe fonte de dados de "restantes" para mostrar. */}
            <div className="flex w-fit items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-[0_0_24px_-6px_rgba(0,171,122,0.45)] backdrop-blur-sm sm:text-sm">
              <span
                aria-hidden="true"
                className="relative flex h-2 w-2 shrink-0 items-center justify-center"
              >
                <span className="animate-dot-ping absolute h-2 w-2 rounded-full bg-primary" />
                <span className="h-2 w-2 rounded-full bg-primary" />
              </span>
              {hero.badge}
            </div>

            {/* Um H1 só, três linhas em bloco: as quebras do desktop são as do
                conteúdo, não do acaso da largura. `text-balance` fica de fora
                de propósito — ele reequilibraria as linhas e desfaria isso. */}
            {/* Teto de 4rem (64px) e não os 5.5rem sugeridos: a 88px a última
                linha pediria 1056px de largura e quebraria em duas, o que
                contraria as quebras definidas para o desktop. 64px é o maior
                tamanho em que as três frases cabem cada uma na sua linha. */}
            <h1 className="mt-8 text-[clamp(2.15rem,5.6vw,4rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.03em] max-[360px]:mt-5">
              <span className="block">{hero.titulo.linha1}</span>
              <span className="headline-gradiente block">{hero.titulo.destaque}</span>
            </h1>

            {/* Em ≤360px o texto encolhe meio ponto e fecha o entrelinhas —
                a frase continua inteira, só ocupa menos altura. */}
            <p className="mt-7 max-w-2xl text-[clamp(1rem,1.4vw,1.185rem)] leading-relaxed text-dark-muted max-[360px]:mt-4 max-[360px]:text-[0.9375rem] max-[360px]:leading-[1.45]">
              {hero.subtitulo}
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 max-[360px]:mt-6 max-[360px]:gap-2.5">
              <CTA rotulo={hero.cta} local="hero" />
              <p className="text-sm text-dark-muted max-[360px]:text-xs">
                {hero.microcopy}
              </p>
            </div>
          </div>
        </section>

        {/* ─── O que a IA poderá fazer ─────────────────── */}
        <section className="border-y border-dark-border bg-dark-surface py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-[clamp(1rem,4vw,2rem)]">
            <div className="mx-auto max-w-2xl text-center">
              <Revelar>
                <Rotulo>Possibilidades de automação</Rotulo>
                <h2 className="text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">
                  {capacidades.titulo}
                </h2>
              </Revelar>
            </div>

            <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capacidades.itens.map((item, i) => (
                <RevelarItem
                  key={item.texto}
                  atraso={Math.min(i, 5) * 0.05}
                  className="glass-card-dark flex h-full items-start gap-3.5 rounded-2xl p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <item.icone aria-hidden="true" className="h-5 w-5 text-primary" />
                  </span>
                  <span className="mt-1.5 text-[15px] font-medium leading-snug">
                    {item.texto}
                  </span>
                </RevelarItem>
              ))}
            </ul>

            <Revelar atraso={0.1}>
              <p className="mx-auto mt-8 max-w-2xl text-center text-[15px] leading-relaxed text-dark-muted">
                {capacidades.complemento}
              </p>
            </Revelar>
          </div>
        </section>

        {/* ─── O que será entregue ─────────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-[clamp(1rem,4vw,2rem)]">
            <div className="max-w-2xl">
              <Revelar>
                <Rotulo>A entrega</Rotulo>
                <h2 className="text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">
                  {entrega.titulo}
                </h2>
                <p className="mt-5 leading-relaxed text-dark-muted">
                  {entrega.subtitulo}
                </p>
              </Revelar>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {entrega.itens.map((item, i) => (
                <Revelar key={item.titulo} atraso={Math.min(i, 4) * 0.06}>
                  <div className="h-full rounded-2xl border border-dark-border bg-dark-surface p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <item.icone aria-hidden="true" className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mt-4 font-bold">{item.titulo}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-dark-muted">
                      {item.descricao}
                    </p>
                  </div>
                </Revelar>
              ))}
            </div>

            <Revelar atraso={0.1}>
              <p className="mt-8 text-[15px] leading-relaxed text-dark-muted">
                {entrega.nota}
              </p>
            </Revelar>

            <Revelar atraso={0.14} className="mt-10 flex justify-center">
              <CTA rotulo={entrega.cta} local="entrega" />
            </Revelar>
          </div>
        </section>

        {/* ─── Para quem é ─────────────────────────────── */}
        <section className="border-y border-dark-border bg-dark-surface py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-[clamp(1rem,4vw,2rem)]">
            <Revelar>
              <Rotulo>Perfil da seleção</Rotulo>
              <h2 className="text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]">
                {perfil.titulo}
              </h2>
            </Revelar>

            <ul className="mt-9 space-y-3.5">
              {perfil.itens.map((item, i) => (
                <RevelarItem
                  key={item}
                  atraso={Math.min(i, 5) * 0.05}
                  className="flex items-start gap-3 text-[15px] leading-snug sm:text-base"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check aria-hidden="true" className="h-3 w-3 text-primary" />
                  </span>
                  {item}
                </RevelarItem>
              ))}
            </ul>

            <Revelar atraso={0.1}>
              <div className="mt-8 flex items-start gap-3.5 rounded-2xl border border-dark-border bg-dark-surface p-5">
                <X aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-dark-muted" />
                <p className="text-[15px] leading-relaxed text-dark-muted">
                  {perfil.exclusao}
                </p>
              </div>
            </Revelar>
          </div>
        </section>

        {/* ─── Formulário ──────────────────────────────── */}
        <section
          id={ANCORA_FORMULARIO}
          className="scroll-mt-6 border-y border-dark-border bg-dark-surface py-16 sm:py-20"
        >
          <div className="mx-auto max-w-2xl px-[clamp(1rem,4vw,2rem)]">
            <Revelar>
              {CAMPANHA_ENCERRADA ? <Encerrada /> : <FormularioCandidatura />}
            </Revelar>

            {/* As condições ficam logo abaixo do formulário, e não numa seção
                própria: é aqui que a pessoa decide se preenche, e é aqui que
                ela precisa saber prazo, escopo e o que acontece depois. */}
            {!CAMPANHA_ENCERRADA && (
              <Revelar atraso={0.1}>
                <div className="mt-8 rounded-2xl border border-dark-border bg-dark-base/40 p-6 sm:p-7">
                  <h3 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    <Info aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {condicoes.titulo}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {condicoes.itens.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[15px] leading-relaxed text-dark-muted"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Revelar>
            )}
          </div>
        </section>

        {/* ─── CTA final ───────────────────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-[clamp(1rem,4vw,2rem)] text-center">
            <Revelar>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <ctaFinal.icone aria-hidden="true" className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mt-6 text-[clamp(26px,3.8vw,42px)] font-bold leading-[1.1] tracking-[-0.02em]">
                {ctaFinal.titulo}
              </h2>
              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-dark-muted">
                {ctaFinal.texto}
              </p>
              <div className="mt-9 flex flex-col items-center gap-4">
                <CTA rotulo={ctaFinal.botao} local="cta-final" />
                <p className="text-sm text-dark-muted">{ctaFinal.microcopy}</p>
              </div>
            </Revelar>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-dark-border pt-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-[clamp(1rem,4vw,2rem)] text-center">
          <Logo dark />
          <p className="text-sm text-dark-muted">
            © {new Date().getFullYear()} CompanyChat. Todos os direitos reservados.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => evento("campanha10_whatsapp_clicked", { local: "rodape" })}
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
