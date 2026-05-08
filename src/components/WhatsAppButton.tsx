"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER  = "5564993054630";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Gostaria de saber mais sobre os serviços da CompanyChat IA."
);

export const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="animate-breath-glow fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl shadow-black/30 transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7 text-white" fill="white" />
    </a>
  );
}
