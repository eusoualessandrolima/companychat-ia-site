"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { whatsappLink, WhatsAppIcon } from "./WhatsAppButton";

export default function Contato() {
  return (
    <section id="contato" className="relative bg-section py-24">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Pronto para <span className="text-primary">transformar</span> seu
            atendimento?
          </h2>
          <p className="mt-4 text-text-secondary">
            Entre em contato e descubra como a IA pode revolucionar sua empresa.
          </p>
          <p className="mx-auto mt-3 max-w-md text-text-secondary">
            Fale diretamente com um especialista. Resposta rápida e sem compromisso.
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-breath-glow flex items-center gap-2.5 rounded-full bg-[#25D366] px-9 py-4 text-lg font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-[#20bd5a]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chamar no WhatsApp
            </a>
          </div>

          <p className="mt-6 text-sm text-text-secondary">
            Prefere ver os valores antes?{" "}
            <Link href="/planos" className="font-semibold text-primary hover:underline">
              Conheça os planos
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
