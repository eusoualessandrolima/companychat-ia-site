"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { suporteLink, whatsappLink } from "@/lib/whatsapp";

/* Reexporta para os componentes de cliente que já importavam daqui. Quem roda
   no servidor deve importar de `@/lib/whatsapp` — ver o comentário de lá. */
export { WHATSAPP_NUMBER, loginLink, suporteLink, whatsappLink } from "@/lib/whatsapp";

/* O SVG mudou para `@/components/icones/WhatsAppIcon`, que não é módulo de
   cliente e serve também a Server Components. O reexport fica porque dezenas
   de componentes já importavam daqui. */
export { WhatsAppIcon } from "@/components/icones/WhatsAppIcon";
import { WhatsAppIcon } from "@/components/icones/WhatsAppIcon";

const CANAIS = [
  {
    rotulo: "Comercial",
    href: whatsappLink,
    aria: "Falar com o comercial pelo WhatsApp",
    cor: "bg-[#25D366]",
    destaque: true,
  },
  {
    rotulo: "Suporte",
    href: suporteLink,
    aria: "Falar com o suporte pelo WhatsApp",
    cor: "bg-[#0092ff]",
    destaque: false,
  },
] as const;

type Canal = (typeof CANAIS)[number];

function BotaoCanal({ canal, comRotulo = false }: { canal: Canal; comRotulo?: boolean }) {
  return (
    <a
      href={canal.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={canal.aria}
      className="group flex items-center gap-2.5"
    >
      <span
        className={`rounded-full bg-dark-elevated/95 px-3 py-1.5 text-xs font-semibold text-dark-text shadow-lg shadow-black/25 backdrop-blur-sm ${
          comRotulo ? "inline-block" : "hidden sm:inline-block"
        }`}
      >
        {canal.rotulo}
      </span>
      <span
        className={`flex items-center justify-center rounded-full shadow-xl shadow-black/30 transition-transform group-hover:scale-110 ${canal.cor} ${
          canal.destaque
            ? "h-12 w-12 sm:h-14 sm:w-14 sm:animate-breath-glow"
            : "h-11 w-11 sm:h-12 sm:w-12"
        }`}
      >
        <WhatsAppIcon
          className={
            canal.destaque
              ? "h-7 w-7 text-white sm:h-8 sm:w-8"
              : "h-6 w-6 text-white sm:h-7 sm:w-7"
          }
        />
      </span>
    </a>
  );
}

export default function WhatsAppButton() {
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  /* Fechar ao tocar fora ou apertar Esc: aberto, o menu cobre o canto inferior
     direito da tela — o mesmo problema que ele existe para resolver. */
  useEffect(() => {
    if (!aberto) return;

    const foraDaCaixa = (e: PointerEvent) => {
      if (!caixa.current?.contains(e.target as Node)) setAberto(false);
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };

    document.addEventListener("pointerdown", foraDaCaixa);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("pointerdown", foraDaCaixa);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  return (
    /* O layout usa `viewportFit: cover`, então em iPhone com notch os 24px de
       `bottom` caem embaixo do indicador de home (34px) e o botão fica difícil
       de tocar. `env()` devolve 0 em telas sem recorte, onde o max vale 24px. */
    <div
      ref={caixa}
      style={{ bottom: "max(1.5rem, calc(env(safe-area-inset-bottom) + 0.5rem))" }}
      className="fixed right-4 z-50 flex flex-col items-end gap-3 sm:right-6"
    >
      {/* Desktop: os dois canais à vista, cada um com seu rótulo */}
      <div className="hidden flex-col items-end gap-3 sm:flex">
        {CANAIS.map((canal) => (
          <BotaoCanal key={canal.rotulo} canal={canal} />
        ))}
      </div>

      {/* Celular: um botão só. A pilha de dois círculos ocupava 104px de altura
          no canto — passava por cima do conteúdo — e sem rótulo ninguém sabia
          qual era comercial e qual era suporte. */}
      <div className="flex flex-col items-end gap-3 sm:hidden">
        <AnimatePresence>
          {aberto &&
            CANAIS.map((canal, i) => (
              <motion.div
                key={canal.rotulo}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.18, delay: i * 0.05 }}
              >
                <BotaoCanal canal={canal} comRotulo />
              </motion.div>
            ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-label={aberto ? "Fechar canais de atendimento" : "Falar pelo WhatsApp"}
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-xl shadow-black/30 transition-transform active:scale-95 ${
            aberto ? "" : "animate-breath-glow"
          }`}
        >
          {/* Ícone em `on-primary` e não em branco: o verde do WhatsApp é
              claro, e branco por cima dá 1,98:1 — o mínimo para componente de
              UI é 3:1. Este par dá 9,70:1. O verde da marca não muda: é
              reconhecimento, e a regra da página 4 do guia é exatamente esta —
              sobre verde vivo, texto escuro. */}
          {aberto ? (
            <X aria-hidden="true" className="h-6 w-6 text-on-primary" />
          ) : (
            <WhatsAppIcon className="h-7 w-7 text-on-primary" />
          )}
        </button>
      </div>
    </div>
  );
}
