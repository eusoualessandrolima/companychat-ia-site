"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Scale,
  FlaskConical,
  Dumbbell,
  GraduationCap,
  ShoppingBag,
  Stethoscope,
  Building2,
  Utensils,
} from "lucide-react";
import { WHATSAPP_NUMBER, WhatsAppIcon, whatsappLink } from "./WhatsAppButton";

const nichos = [
  {
    icon: Scale,
    titulo: "Advocacia",
    descricao:
      "Qualificação de leads e agendamento de consultas automatizados. Atenda mais clientes sem aumentar a equipe.",
  },
  {
    icon: FlaskConical,
    titulo: "Laboratórios",
    descricao:
      "Agendamento de exames, confirmações e entrega de resultados automatizados via WhatsApp.",
  },
  {
    icon: Dumbbell,
    titulo: "Academias",
    descricao:
      "Matrículas, renovações e dúvidas frequentes resolvidas automaticamente 24h.",
  },
  {
    icon: GraduationCap,
    titulo: "Educação",
    descricao:
      "Captação de alunos, informações sobre cursos e suporte sem sobrecarregar sua secretaria.",
  },
  {
    icon: ShoppingBag,
    titulo: "Comércio & E-commerce",
    descricao:
      "Status de pedidos, atendimento pós-venda e recuperação de carrinhos abandonados no piloto automático.",
  },
  {
    icon: Stethoscope,
    titulo: "Clínicas & Saúde",
    descricao:
      "Agendamentos, lembretes de consulta e triagem de pacientes. Tudo automatizado com segurança.",
  },
  {
    icon: Building2,
    titulo: "Imobiliárias",
    descricao:
      "Qualificação de compradores, agendamento de visitas e envio de portfólios de forma automática.",
  },
  {
    icon: Utensils,
    titulo: "Restaurantes & Food",
    descricao:
      "Pedidos, reservas e cardápios digitais integrados ao WhatsApp. Zero perda de cliente.",
  },
];

/** Abre o WhatsApp já dizendo de qual segmento o lead veio — poupa a primeira pergunta. */
function linkDoSegmento(titulo: string) {
  const texto = encodeURIComponent(
    `Olá! Atuo no segmento de ${titulo} e gostaria de saber como a CompanyChat IA pode ajudar.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;
}

export default function Nichos() {
  const trilhaRef = useRef<HTMLDivElement>(null);

  const deslizar = useCallback((direcao: 1 | -1) => {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    const cartao = trilha.firstElementChild as HTMLElement | null;
    // Um cartão + gap por clique: o próximo card sempre entra alinhado à esquerda.
    const passo = cartao ? cartao.offsetWidth + 24 : trilha.clientWidth * 0.8;
    trilha.scrollBy({ left: passo * direcao, behavior: "smooth" });
  }, []);

  return (
    <section id="nichos" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full bg-primary-light px-4 py-1.5 text-xs font-semibold tracking-[0.12em] text-primary-dark uppercase">
            Segmentos atendidos
          </span>
          <h2 className="mt-5 text-3xl font-bold md:text-4xl">
            Nichos de <span className="text-primary">Atuação</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Adaptamos o assistente para qualquer segmento. Se atende pelo WhatsApp, nós automatizamos.
          </p>
        </motion.div>
      </div>

      {/* O card seguinte fica cortado na borda do container: é o que sinaliza "arraste" */}
      <div className="mx-auto mt-14 max-w-6xl px-4">
        <div
          ref={trilhaRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {nichos.map((n, i) => (
            <motion.a
              key={n.titulo}
              href={linkDoSegmento(n.titulo)}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: Math.min(i, 3) * 0.08 }}
              className="group flex w-[78vw] shrink-0 snap-start flex-col rounded-2xl border border-card-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:w-[46%] lg:w-[30%]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#00d4a0] text-white shadow-md shadow-primary-glow transition-transform duration-300 group-hover:scale-105">
                <n.icon aria-hidden="true" className="h-7 w-7" />
              </div>

              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-foreground">{n.titulo}</h3>
                <ArrowRight
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 shrink-0 text-text-secondary transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>

              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {n.descricao}
              </p>

              {/* No desktop o CTA se revela no card sob o cursor; no toque fica sempre visível */}
              <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-primary transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                Falar sobre {n.titulo}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center gap-8 px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => deslizar(-1)}
            aria-label="Ver segmentos anteriores"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-card-border bg-card text-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary hover:shadow-md"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => deslizar(1)}
            aria-label="Ver próximos segmentos"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-card-border bg-card text-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary hover:shadow-md"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-glow transition-all hover:bg-primary-dark hover:shadow-xl"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Não achei meu segmento
          </a>
          <a
            href="#planos"
            className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary"
          >
            Ver planos
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
