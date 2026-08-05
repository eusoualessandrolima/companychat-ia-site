"use client";

import { useSyncExternalStore } from "react";

const QUERY_MOVIMENTO = "(prefers-reduced-motion: reduce)";

/** `true` quando a pessoa pediu menos animação no sistema. Use para desligar
 *  laços automáticos (carrossel girando, cenas em loop) — não para remover
 *  transições curtas de hover. */
export function useMovimentoReduzido() {
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
