"use client";

import { motion } from "framer-motion";
import { Quote, Youtube, Wrench } from "lucide-react";
import { envOu } from "@/lib/env";

/** Canal onde o conteúdo é publicado. Configurável para não ficar preso no código. */
export const youtubeLink =
  envOu(process.env.NEXT_PUBLIC_YOUTUBE_URL, "https://www.youtube.com/@eusoualessandrolima1");

const suave = [0.4, 0, 0.2, 1] as const;

export default function Origem() {
  return (
    <section id="origem" className="relative bg-dark-base py-28 md:py-36">
      {/* Fio de separação, no lugar de trocar a cor de fundo */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: suave }}
          className="max-w-3xl"
        >
          <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-primary">
            Company AI
          </span>
          <h2 className="mt-4 text-[clamp(34px,4.4vw,56px)] font-semibold leading-[1.06] tracking-[-0.025em]">
            <span className="block text-dark-text">Muita gente assiste.</span>
            <span className="block text-dark-muted">Quase ninguém coloca em prática.</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: suave }}
          >
            <p className="text-[19px] leading-[1.6] tracking-[-0.011em] text-dark-muted">
              Desde que começamos a produzir conteúdo sobre inteligência artificial, uma coisa
              ficou clara: muita gente assiste, acha incrível o que a IA consegue fazer e mesmo
              assim nunca coloca em prática.
            </p>
            <p className="mt-5 text-[19px] leading-[1.6] tracking-[-0.011em] text-dark-muted">
              O motivo é fácil de entender. Alguns não têm tempo. Outros já têm uma empresa
              inteira para administrar. E tem quem simplesmente não queira passar horas
              aprendendo prompt, configurando ferramenta e montando automação.
            </p>
            <p className="mt-5 text-[19px] leading-[1.6] tracking-[-0.011em] text-dark-text">
              Foi por isso que criamos a Company AI. Em vez de só mostrar como se faz, agora a
              gente também desenvolve essas soluções para as empresas.
            </p>

            <figure className="mt-12 border-l-2 border-primary/40 pl-7">
              <Quote aria-hidden="true" className="h-5 w-5 text-primary" />
              <blockquote className="mt-5 text-[clamp(20px,2.2vw,26px)] font-medium leading-[1.4] tracking-[-0.018em] text-dark-text">
                Foi exatamente assim que eu trabalhei nas minhas empresas: sempre que existia um
                problema repetitivo, eu criava uma solução para resolvê-lo. Hoje faço a mesma
                coisa para outras empresas.
              </blockquote>
              <figcaption className="mt-6 text-[15px] tracking-[-0.011em] text-dark-muted">
                <span className="font-semibold text-dark-text">Alessandro Lima</span>
                <span className="mx-2 opacity-40">|</span>
                fundador da CompanyChat
              </figcaption>
            </figure>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12, ease: suave }}
            className="space-y-4"
          >
            <a
              href={youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-white/[0.16]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(255,0,0,0.12) 0%, transparent 65%)",
                }}
              />
              <div className="relative">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff0000]/10 text-[#ff0000]">
                  <Youtube aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-7 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-dark-text">
                  Você não precisa nos contratar para aprender
                </h3>
                <p className="mt-3 text-[17px] leading-[1.55] tracking-[-0.011em] text-dark-muted">
                  O conteúdo continua aberto no YouTube, de graça. Se você tem tempo e vontade de
                  montar por conta própria, o caminho está lá, passo a passo.
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold tracking-[-0.011em] text-primary">
                  Ver o canal
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0.5"
                  >
                    ›
                  </span>
                </span>
              </div>
            </a>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Wrench aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-7 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-dark-text">
                E se você quiser pular essa parte
              </h3>
              <p className="mt-3 text-[17px] leading-[1.55] tracking-[-0.011em] text-dark-muted">
                A Company AI entra aqui. Você conta o que trava a sua operação hoje e a gente
                constrói a solução, testa com o seu processo real e entrega funcionando.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
