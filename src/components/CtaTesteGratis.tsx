"use client";

import Link from "next/link";
import { evento, urlInicial } from "@/lib/analytics";
import { linkTesteGratis } from "@/lib/cta";

/* Botão do caminho comercial principal. Existe para o destino do funil e o
   evento de clique ficarem em um lugar só: cada chamada traz apenas o seu
   estilo e o nome do lugar de onde saiu.

   O `local` viaja em dois canais de propósito. Como evento, alimenta o
   analytics; na query, chega ao formulário e entra na origem do lead mesmo
   quando o Pixel está bloqueado. */

export default function CtaTesteGratis({
  local,
  className,
  children,
  ariaLabel,
  onClick,
}: {
  local: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  /** Efeito colateral do lugar de onde o botão saiu, como fechar o menu. */
  onClick?: () => void;
}) {
  return (
    <Link
      href={linkTesteGratis(local)}
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        // Guarda a página de onde o funil começou antes de sair dela.
        urlInicial();
        evento("free_trial_cta_clicked", { local });
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}
