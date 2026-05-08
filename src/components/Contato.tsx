"use client";

import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import { whatsappLink } from "./WhatsAppButton";

export default function Contato() {
  return (
    <section id="contato" className="relative bg-section py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Pronto para <span className="text-primary">transformar</span> seu
            atendimento?
          </h2>
          <p className="mt-4 text-text-secondary">
            Entre em contato e descubra como a IA pode revolucionar sua empresa.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2"
        >
          {/* Form */}
          <form
            action="https://formspree.io/f/placeholder"
            method="POST"
            className="space-y-4 rounded-2xl border border-card-border bg-card p-8 shadow-sm"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm text-text-secondary"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded-xl border border-black/10 bg-section px-4 py-3 text-foreground outline-none transition-colors focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/40"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm text-text-secondary"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-xl border border-black/10 bg-section px-4 py-3 text-foreground outline-none transition-colors focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/40"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm text-text-secondary"
              >
                WhatsApp
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full rounded-xl border border-black/10 bg-section px-4 py-3 text-foreground outline-none transition-colors focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/40"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm text-text-secondary"
              >
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full resize-none rounded-xl border border-black/10 bg-section px-4 py-3 text-foreground outline-none transition-colors focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/40"
                placeholder="Conte um pouco sobre sua empresa..."
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <Send className="h-4 w-4" />
              Enviar Mensagem
            </button>
          </form>

          {/* WhatsApp CTA */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-primary-light p-8 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#25D366]/15">
              <MessageCircle className="h-10 w-10 text-[#25D366]" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Prefere pelo WhatsApp?</h3>
            <p className="mt-3 text-text-secondary">
              Fale diretamente com um especialista. Resposta rápida e sem
              compromisso.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white transition-all hover:bg-[#20bd5a] hover:shadow-md"
            >
              <MessageCircle className="h-5 w-5" />
              Chamar no WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
