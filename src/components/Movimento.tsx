"use client";

import { MotionConfig } from "framer-motion";

/* Ponte entre o layout (componente de servidor) e o `MotionConfig`, que é
   client-only.
 *
 * ─── Por que existe ───
 *
 * `globals.css` já zera `animation-duration` e `transition-duration` em
 * `@media (prefers-reduced-motion: reduce)`, e isso resolve toda animação
 * escrita em CSS — os blobs do fundo, o marquee, o brilho dos botões.
 *
 * O que aquela regra não alcança é o Framer Motion: ele não usa `animation`
 * nem `transition` do CSS, aplica transform e opacity quadro a quadro pela
 * Web Animations API. Com a preferência ligada, uma animação de 800 ms
 * continuava rodando na home. São 59 componentes animados; `reducedMotion`
 * resolve todos de uma vez, no lugar de repetir a mesma guarda em cada um.
 *
 * `"user"` e não `"always"`: quem não pediu para reduzir movimento continua
 * vendo o site como ele foi desenhado.
 *
 * `useMovimentoReduzido` continua necessário onde o laço é controlado em
 * JavaScript (o carrossel de Nichos, por exemplo) — isto cobre as transições,
 * não os temporizadores. */
export default function Movimento({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
