import type { ReactNode } from "react";

/** Sobretítulo de seção: versalete verde acima do `<h2>`.
 *
 *  Estava duplicado em `dez-empresas/Campanha.tsx` e `lp/Landing.tsx`, com o
 *  mesmo corpo nos dois. Tracking positivo porque é caixa alta — em versal o
 *  espaçamento negativo cola as letras. */
export default function Rotulo({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
      {children}
    </p>
  );
}
