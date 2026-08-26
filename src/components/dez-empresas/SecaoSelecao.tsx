import { Info } from "lucide-react";
import Revelar from "@/components/comum/Revelar";
import Rotulo from "@/components/comum/Rotulo";
import { selecao } from "./conteudo";

/* "Como funciona a seleção" — três passos, para responder antes de o
 * formulário perguntar.
 *
 * Vem logo antes do formulário de propósito: a objeção que mata a candidatura
 * não é "isso é bom?", é "no que eu estou me metendo?". Os três passos e a
 * nota do rodapé respondem exatamente isso, e saem das condições da campanha
 * (a análise não é automática; todo mundo recebe retorno) — nenhuma regra
 * nova foi inventada aqui. */
export default function SecaoSelecao() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-[clamp(1rem,4vw,2rem)]">
        <Revelar className="mx-auto max-w-2xl text-center">
          <Rotulo>{selecao.rotulo}</Rotulo>
          <h2 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.02em]">
            {selecao.titulo}
          </h2>
        </Revelar>

        <ol className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {selecao.passos.map((passo, i) => (
            <Revelar
              como="li"
              key={passo.titulo}
              atraso={i * 0.08}
              className="cartao-realce flex h-full flex-col gap-3 rounded-2xl border border-dark-border bg-dark-surface/70 p-6"
            >
              <span
                aria-hidden="true"
                className="font-display text-[2rem] font-bold leading-none text-primary/30"
              >
                {i + 1}
              </span>
              <h3 className="text-[1.0625rem] font-bold leading-snug">
                {passo.titulo}
              </h3>
              <p className="text-[0.9375rem] leading-relaxed text-dark-muted">
                {passo.texto}
              </p>
            </Revelar>
          ))}
        </ol>

        <Revelar atraso={0.12}>
          <p className="mx-auto mt-8 flex w-fit items-center gap-2.5 rounded-2xl border border-dark-border bg-dark-surface px-5 py-3.5 text-[0.9375rem] leading-relaxed text-dark-muted">
            <Info aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-primary" />
            {selecao.nota}
          </p>
        </Revelar>
      </div>
    </section>
  );
}
