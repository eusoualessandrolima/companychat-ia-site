"use client";

import { useEffect } from "react";
import { descarregarPendentes } from "@/lib/analytics";

/* Entrega ao Pixel os eventos que foram guardados em páginas sem Pixel (o
   clique no CTA do cabeçalho da home, por exemplo). Ver o comentário de
   `src/lib/analytics.ts` para o porquê da fila.

   Não renderiza nada. Fica só em `/teste-gratis`, que é para onde todos os
   CTAs do funil apontam.

   A espera existe porque o `MetaPixel` injeta o script com
   `strategy="afterInteractive"`: numa navegação do lado do cliente o efeito
   pode rodar antes de o `fbq` existir. A tentativa é repetida por alguns
   segundos e desiste em silêncio. */

const INTERVALO_MS = 250;
const TENTATIVAS = 40;

export default function EventosPendentes() {
  useEffect(() => {
    if (descarregarPendentes() > 0) return;

    let restantes = TENTATIVAS;
    const tique = setInterval(() => {
      restantes -= 1;
      if (descarregarPendentes() > 0 || restantes <= 0) clearInterval(tique);
    }, INTERVALO_MS);

    return () => clearInterval(tique);
  }, []);

  return null;
}
