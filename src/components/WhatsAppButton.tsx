"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5562996320162";
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
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110"
      style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
    >
      <MessageCircle className="h-7 w-7 text-white" fill="white" />
    </a>
  );
}
