"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { suporteLink, whatsappLink } from "@/lib/whatsapp";

/* Reexporta para os componentes de cliente que já importavam daqui. Quem roda
   no servidor deve importar de `@/lib/whatsapp` — ver o comentário de lá. */
export { WHATSAPP_NUMBER, loginLink, suporteLink, whatsappLink } from "@/lib/whatsapp";

/** Ícone oficial do WhatsApp (glyph do telefone no balão) */
export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
    </svg>
  );
}

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
          {aberto ? (
            <X aria-hidden="true" className="h-6 w-6 text-white" />
          ) : (
            <WhatsAppIcon className="h-7 w-7 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
