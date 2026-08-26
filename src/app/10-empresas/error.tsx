"use client";

import { useEffect } from "react";
/* Do módulo isolado, e não de `WhatsAppButton`: aquele é `"use client"` e
   carrega o widget flutuante com `AnimatePresence` junto, o que trazia os
   137 KB de framer-motion de volta para esta rota — pela porta do boundary
   de erro, que é a última que deveria pesar. */
import { WhatsAppIcon } from "@/components/icones/WhatsAppIcon";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

/* Boundary de rota da campanha.
 *
 * Antes deste arquivo, qualquer exceção em qualquer ponto da árvore de
 * `/10-empresas` caía no `_global-error` do Next e servia a tela branca de
 * "Application error" — numa página de tráfego pago cujo único objetivo é a
 * candidatura. O boundary troca isso por uma saída útil: a pessoa que já
 * clicou no anúncio continua tendo um caminho até a gente.
 *
 * `reset()` remonta o segmento sem recarregar a página inteira, que resolve o
 * caso comum (falha de hidratação, chunk que não chegou). Quando não resolve,
 * o WhatsApp é a rota de fuga — o mesmo número do resto da campanha. */
export default function ErroCampanha({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /* Sem serviço de observabilidade no projeto: o `digest` é o que o Next
       expõe para cruzar com o log do servidor, então ele precisa aparecer. */
    console.error("Falha na campanha /10-empresas:", error.digest ?? error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-dark-base px-[clamp(1rem,4vw,2rem)] py-16 text-dark-text">
      <div className="w-full max-w-lg rounded-3xl border border-dark-border bg-dark-elevated p-7 text-center sm:p-9">
        <h1 className="text-[clamp(24px,3.4vw,32px)] font-bold leading-[1.15] tracking-[-0.02em]">
          Não conseguimos carregar esta página agora
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-dark-muted">
          Foi uma falha nossa, não sua. Tente de novo em instantes — a seleção
          das 10 empresas continua aberta.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="botao-marca inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold text-on-primary"
          >
            Tentar de novo
          </button>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-dark-border px-6 py-3 text-sm font-semibold text-dark-text transition-colors hover:border-primary/40 hover:text-primary"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            Falar com a CompanyChat
          </a>
        </div>
      </div>
    </main>
  );
}
