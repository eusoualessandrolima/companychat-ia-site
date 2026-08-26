import { Check } from "lucide-react";
import Revelar from "@/components/comum/Revelar";
import { valor } from "./conteudo";

/* Percepção de valor — a única seção clara da página.
 *
 * Duas razões para ela ser clara, e as duas são do guia da marca:
 *
 * 1. A campanha passava seis seções escuras seguidas sem uma quebra de
 *    temperatura. A escala areia existe exatamente para isso ("reserve
 *    #E5E0D6 para páginas de entrada, comunicação e respiro", página 7).
 * 2. Contraste de superfície é hierarquia. O argumento desta seção é "isto
 *    normalmente seria um projeto caro" — e ele precisa parar o olho, não se
 *    diluir no mesmo fundo das outras.
 *
 * Sobre o preço: **não há âncora riscada**. O site parou de publicar valor em
 * 26/08/2026 (preço sai no diagnóstico, caso a caso), e um "de R$ X por R$ 0"
 * seria número sem lastro além de contrariar essa decisão. O que sustenta o
 * valor aqui é o tamanho da lista à esquerda. */
export default function SecaoValor() {
  return (
    <section className="superficie-areia border-y border-card-border py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <Revelar>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary-text">
                {valor.rotulo}
              </p>
              <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.02em] text-foreground">
                {valor.titulo}
              </h2>
              <p className="mt-5 max-w-xl text-[clamp(1rem,1.4vw,1.0625rem)] leading-relaxed text-text-secondary">
                {valor.texto}
              </p>
            </Revelar>

            <ul className="mt-9 grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {valor.itens.map((item, i) => (
                <Revelar
                  como="li"
                  key={item}
                  atraso={Math.min(i, 4) * 0.05}
                  className="flex items-center gap-3 text-[0.9375rem] font-medium text-foreground sm:text-base"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check
                      aria-hidden="true"
                      className="h-3.5 w-3.5 text-primary-text"
                    />
                  </span>
                  {item}
                </Revelar>
              ))}
            </ul>
          </div>

          <Revelar atraso={0.1} className="lg:sticky lg:top-8">
            <div className="rounded-3xl border border-card-border bg-card p-7 shadow-[0_18px_50px_-24px_rgba(7,16,17,0.35)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
                {valor.cartao.rotulo}
              </p>
              <p className="mt-5 font-display text-[clamp(3.25rem,7vw,4.5rem)] font-bold leading-none tracking-[-0.04em] text-primary-text">
                {valor.cartao.valor}
              </p>
              <p className="mt-3 text-[1.0625rem] font-semibold leading-snug text-foreground">
                {valor.cartao.linha}
              </p>
              <p className="mt-5 border-t border-card-border pt-5 text-sm leading-relaxed text-text-secondary">
                {valor.cartao.nota}
              </p>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
