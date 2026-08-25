"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CtaTesteGratis from "./CtaTesteGratis";
import { CTA_LABEL_LONGO } from "@/lib/cta";
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
            Deixe os seus dados e o nosso assistente chama você no WhatsApp em
            alguns minutos para entender a sua operação.
          </p>

          <div className="mt-10 flex justify-center">
            <div className="cta-glow-wrap">
              <CtaTesteGratis
                local="contato-home"
                className="group flex items-center gap-2.5 rounded-full bg-primary px-9 py-4 text-lg font-semibold text-on-primary shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark"
              >
                {CTA_LABEL_LONGO}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                />
              </CtaTesteGratis>
            </div>
          </div>

          {/* O caminho direto para gente continua aberto: quem já sabe o que
              quer não deveria passar por formulário para conversar. */}
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-text-secondary">
            Prefere falar agora?
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chamar no WhatsApp
            </a>
          </p>

          <p className="mt-3 text-sm text-text-secondary">
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
