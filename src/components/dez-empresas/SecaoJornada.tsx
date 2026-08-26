import { ArrowRight } from "lucide-react";
import Revelar from "@/components/comum/Revelar";
import Rotulo from "@/components/comum/Rotulo";
import { jornada } from "./conteudo";

/* A mecânica da coisa em quatro passos, para ser lida em cinco segundos.
 *
 * Horizontal no desktop, vertical no celular — com a seta girando 90° na
 * virada, porque uma seta apontando para a direita numa pilha vertical manda
 * o olho para o lugar errado. As setas são `aria-hidden`: a ordem já está na
 * lista ordenada, e um leitor de tela recitando "seta para a direita" três
 * vezes só atrapalha. */
export default function SecaoJornada() {
  return (
    <section className="atmosfera-escura-alt border-y border-dark-border py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)]">
        <Revelar className="mx-auto max-w-2xl text-center">
          <Rotulo>{jornada.rotulo}</Rotulo>
          <h2 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.02em]">
            {jornada.titulo}
          </h2>
        </Revelar>

        <ol className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-2">
          {jornada.passos.map((passo, i) => (
            <li key={passo.titulo} className="contents">
              <Revelar
                como="div"
                atraso={i * 0.08}
                className="cartao-realce flex h-full flex-col items-center gap-3 rounded-2xl border border-dark-border bg-dark-surface/70 p-6 text-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <passo.icone aria-hidden="true" className="h-6 w-6 text-primary" />
                </span>
                <h3 className="text-[1.0625rem] font-bold leading-snug">
                  {passo.titulo}
                </h3>
                <p className="text-[0.9375rem] leading-relaxed text-dark-muted">
                  {passo.texto}
                </p>
              </Revelar>

              {i < jornada.passos.length - 1 && (
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center py-1 md:py-0"
                >
                  <ArrowRight className="h-5 w-5 rotate-90 text-primary/45 md:rotate-0" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
