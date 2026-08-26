"use client";

import type { ReactNode } from "react";
import { evento } from "@/lib/analytics";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

/* Link para o WhatsApp com o evento da campanha.
 *
 * Existe pelo mesmo motivo do `CtaAncora`: é só o `onClick` que precisa rodar
 * no cliente. `local` é obrigatório — os três pontos que abrem o WhatsApp
 * nesta página (rodapé, aviso de seleção encerrada e tela de sucesso) tinham
 * payloads diferentes entre si, e um deles saía sem `local` nenhum, o que
 * apagava esse clique da segmentação. */
export default function LinkWhatsApp({
  local,
  children,
  className = "",
  texto,
}: {
  local: string;
  children: ReactNode;
  className?: string;
  /** Mensagem que já vai escrita na conversa, quando houver contexto. */
  texto?: string;
}) {
  const href = texto
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => evento("campanha10_whatsapp_clicked", { local })}
      className={className}
    >
      {children}
    </a>
  );
}
