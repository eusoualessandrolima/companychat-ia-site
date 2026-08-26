"use client";

import { ArrowRight } from "lucide-react";
import { evento } from "@/lib/analytics";
import { ANCORA_FORMULARIO, CAMPANHA_ENCERRADA, encerramento } from "./conteudo";

/* A única parte interativa dos CTAs: o disparo do evento de analytics.
 *
 * Isolado num componente de cliente minúsculo para que as seções que o contêm
 * — hero, entrega, fechamento — continuem sendo Server Components. Antes, um
 * `onClick` no meio da página obrigava as 524 linhas inteiras (copy, ícones,
 * mock, tudo) a viajar como JavaScript.
 *
 * Todo CTA leva ao mesmo lugar: o formulário. O `scroll-behavior: smooth` do
 * documento cuida da rolagem e já respeita `prefers-reduced-motion`. */
export default function CtaAncora({
  rotulo,
  local,
  className = "",
  tamanho = "grande",
}: {
  rotulo: string;
  /** Segmenta o evento por posição na página (hero, entrega, fechamento…). */
  local: string;
  className?: string;
  tamanho?: "grande" | "medio";
}) {
  /* `min-h-12` = 48px, o piso da área de toque. Em ≤360px o rótulo só cabe
     numa linha com padding e corpo um pouco menores; sem isso o botão ia a
     80px de altura com o texto quebrado em duas linhas. */
  const medidas =
    tamanho === "grande"
      ? "min-h-12 px-7 py-4 text-base max-[380px]:px-5 max-[380px]:text-[0.9375rem] sm:px-8 sm:text-lg"
      : "min-h-11 px-6 py-3 text-[0.9375rem]";

  return (
    <a
      href={`#${ANCORA_FORMULARIO}`}
      onClick={() => evento("campanha10_cta_clicked", { local })}
      className={`botao-marca group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-on-primary max-[380px]:gap-2 ${medidas} ${className}`}
    >
      {CAMPANHA_ENCERRADA ? encerramento.cta : rotulo}
      <ArrowRight
        aria-hidden="true"
        className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5"
      />
    </a>
  );
}
