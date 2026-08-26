import Revelar from "@/components/comum/Revelar";
import Rotulo from "@/components/comum/Rotulo";
import CtaAncora from "./CtaAncora";
import { entrega } from "./conteudo";

/* A entrega como linha do tempo.
 *
 * Isto é um processo, com ordem: diagnóstico antes de configurar, configuração
 * antes de acompanhar. Em grade de cartões virava uma segunda mesa de peças
 * soltas logo depois do bento; numerado e ligado por um trilho, conta a
 * sequência.
 *
 * O trilho (`.trilho-entrega`) progride conforme a página rola, em CSS puro —
 * `scaleY` a partir do topo, que é compositável e não repinta os passos ao
 * lado. Sem suporte a scroll-driven animations ele fica cheio, que é o estado
 * correto: a linha existe para ligar os passos, não para medir a rolagem.
 *
 * O número é `aria-hidden` porque a ordem é visual: para o leitor de tela a
 * própria `<ol>` já a comunica. */
export default function SecaoEntrega() {
  return (
    <section className="atmosfera-escura border-y border-dark-border py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-16 lg:self-start">
            <Revelar>
              <Rotulo>{entrega.rotulo}</Rotulo>
              <h2 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.02em]">
                {entrega.titulo}
              </h2>
              <p className="mt-5 text-[clamp(1rem,1.4vw,1.0625rem)] leading-relaxed text-dark-muted">
                {entrega.subtitulo}
              </p>
            </Revelar>

            <Revelar atraso={0.1} className="mt-8 hidden lg:block">
              <CtaAncora rotulo={entrega.cta} local="entrega" />
            </Revelar>
          </div>

          <ol className="trilho-entrega space-y-8 pl-8 sm:pl-10">
            {entrega.itens.map((item, i) => (
              <Revelar
                como="li"
                key={item.titulo}
                atraso={Math.min(i, 3) * 0.05}
                className="relative"
              >
                {/* Marcador sobre o trilho. `-left-8`/`-left-10` casam com o
                    padding da lista, então o centro do círculo cai exatamente
                    sobre a linha em qualquer largura. */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.3rem] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-dark-base font-display text-[11px] font-bold text-primary sm:-left-[2.8rem] sm:h-7 sm:w-7 sm:text-xs"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="flex items-center gap-2.5 text-[1.0625rem] font-bold leading-snug">
                  <item.icone
                    aria-hidden="true"
                    className="h-[18px] w-[18px] shrink-0 text-primary"
                  />
                  {item.titulo}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-dark-muted">
                  {item.descricao}
                </p>
              </Revelar>
            ))}
          </ol>
        </div>

        <Revelar atraso={0.1}>
          <p className="mt-12 border-t border-dark-border pt-6 text-[0.9375rem] leading-relaxed text-dark-muted">
            {entrega.nota}
          </p>
        </Revelar>

        <Revelar atraso={0.14} className="mt-10 flex justify-center lg:hidden">
          <CtaAncora rotulo={entrega.cta} local="entrega" />
        </Revelar>
      </div>
    </section>
  );
}
