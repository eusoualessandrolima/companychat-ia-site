import type { CSSProperties, ElementType, ReactNode } from "react";

/* Entrada ao rolar, sem JavaScript e sem Framer Motion.
 *
 * Substitui o `Revelar`/`RevelarItem` que a campanha e as LPs de nicho tinham
 * copiado byte a byte uma da outra. A diferença não é o peso do bundle (ainda
 * que sejam 140 KB de framer-motion por grupo de rota) — é *quando o conteúdo
 * existe*. A versão de Framer emite `opacity: 0` no HTML do servidor; se o JS
 * não chegar, a página serve o hero e mais nada.
 *
 * Aqui o elemento nasce visível: a animação mora inteira dentro de um
 * `@supports (animation-timeline: view())` em `globals.css`. Sem suporte, o
 * bloco aparece — que é o comportamento certo para uma landing de anúncio.
 *
 * `como` existe porque um `<div>` entre `<ul>` e `<li>` é HTML inválido e
 * alguns leitores de tela param de anunciar a lista: nas listas, `como="li"`.
 * É Server Component de propósito — não há hook, evento nem estado aqui. */
export default function Revelar({
  children,
  atraso = 0,
  className = "",
  como: Tag = "div" as ElementType,
  ...resto
}: {
  children: ReactNode;
  /** Segundos de espera antes da entrada, para escalonar itens vizinhos. */
  atraso?: number;
  className?: string;
  como?: ElementType;
} & Record<string, unknown>) {
  return (
    <Tag
      className={`revelar ${className}`}
      style={{ "--atraso": `${atraso}s` } as CSSProperties}
      {...resto}
    >
      {children}
    </Tag>
  );
}
