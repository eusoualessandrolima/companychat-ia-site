"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown, MessageCircle, Sparkles, Clock } from "lucide-react";
import { whatsappLink } from "../WhatsAppButton";

const dePara = [
  {
    antes: "O cliente manda mensagem às 22h e fica sem resposta até de manhã",
    depois: "Respondido na hora, com a informação certa, sem ninguém acordado",
  },
  {
    antes: "Alguém atualiza a mesma planilha toda manhã, na mão",
    depois: "Ela chega pronta antes de você abrir o computador",
  },
  {
    antes: "O lead esfria parado no meio do funil e ninguém percebe",
    depois: "O follow-up sai no dia certo e o time é avisado",
  },
];

/** O palco fixo só faz sentido onde a dobra inteira cabe na tela.
    Devolve também a altura da janela, que define o curso da animação. */
function useTela() {
  const [tela, setTela] = useState({ grande: false, altura: 900 });
  useEffect(() => {
    const aplicar = () =>
      setTela({ grande: window.innerWidth >= 1024, altura: window.innerHeight });
    aplicar();
    window.addEventListener("resize", aplicar);
    return () => window.removeEventListener("resize", aplicar);
  }, []);
  return tela;
}

export default function CompanyAiHero() {
  const { grande, altura } = useTela();
  const reduzido = useReducedMotion();
  const palco = grande && !reduzido;

  /* O hero é a primeira coisa da página, então o scroll absoluto já é o
     progresso do palco. O trilho tem 140vh: 100vh presos + 40vh de saída. */
  const { scrollY } = useScroll();
  const saida = altura * 0.4;
  const opacity = useTransform(scrollY, [saida * 0.45, saida], [1, 0]);
  const scale = useTransform(scrollY, [0, saida], [1, 0.97]);

  return (
    <section className="relative bg-dark-base pt-16 lg:min-h-[140vh] lg:pt-0">
      <div className="relative flex min-h-[92vh] items-center overflow-hidden lg:sticky lg:top-0 lg:h-screen lg:min-h-0">
        {/* Um único brilho, imóvel. O silêncio é o que faz parecer caro. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.10] blur-[150px]"
          style={{ background: "radial-gradient(ellipse, #00ab7a 0%, transparent 70%)" }}
        />

        <motion.div
          style={palco ? { opacity, scale } : undefined}
          className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-4 py-20 lg:grid-cols-[1.32fr_1fr] lg:py-0"
        >
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto mb-9 flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] font-medium tracking-[-0.01em] text-dark-muted lg:mx-0"
            >
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
              Company AI, a frente de projetos sob medida
            </motion.div>

            <motion.h1
              initial={{ y: 28 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(36px,4.4vw,60px)] font-semibold leading-[1.06] tracking-[-0.025em]"
            >
              <span className="block text-dark-text">Você não precisa aprender IA.</span>
              <span className="block text-dark-muted">Precisa dela funcionando.</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-8 max-w-xl text-[19px] leading-[1.55] tracking-[-0.011em] text-dark-muted lg:mx-0"
            >
              Consultoria, atendente no WhatsApp, sistema, CRM ou automação: você descreve o
              problema que se repete todo dia na sua empresa e a gente resolve. Sem curso, sem
              prompt e sem noite em claro configurando ferramenta.
            </motion.p>

            <motion.div
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-primary px-8 py-3.5 font-semibold tracking-[-0.01em] text-white transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-primary-dark sm:w-auto"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Falar sobre o meu projeto
              </a>
              <a
                href="#o-que-construimos"
                className="group flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/10 px-8 py-3.5 font-semibold tracking-[-0.01em] text-dark-text transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-white/25 sm:w-auto"
              >
                Ver o que fazemos
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0.5"
                />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-9 flex items-center justify-center gap-2 text-[13px] tracking-[-0.01em] text-dark-muted lg:justify-start"
            >
              <Clock aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
              Se alguém da sua equipe faz na mão e repete toda semana, dá para automatizar
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-md space-y-3"
          >
            {dePara.map((par) => (
              <div
                key={par.antes}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
              >
                <p className="text-[15px] leading-relaxed tracking-[-0.011em] text-dark-muted line-through decoration-white/20">
                  {par.antes}
                </p>
                <ArrowDown aria-hidden="true" className="my-2.5 h-3.5 w-3.5 text-primary" />
                <p className="text-[15px] font-medium leading-relaxed tracking-[-0.011em] text-dark-text">
                  {par.depois}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
