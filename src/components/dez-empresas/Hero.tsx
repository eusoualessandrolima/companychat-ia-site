import { Check } from "lucide-react";
import CtaAncora from "./CtaAncora";
import ConversaMock from "./ConversaMock";
import { hero } from "./conteudo";

/* Hero da campanha.
 *
 * Duas regras herdadas de um incidente e mantidas de propósito:
 *
 * 1. **Nada aqui entra por animação de entrada.** O `<h1>` é o elemento de
 *    LCP; renderizá-lo com `opacity: 0` até o JS hidratar custou 5,2 s no
 *    Lighthouse mobile (91% em render delay) e deixava o topo em branco para
 *    quem chega com conexão ruim — justamente o tráfego de anúncio.
 * 2. **O mock é DOM, não imagem.** Escala com a tipografia, funciona em leitor
 *    de tela e não borra em retina. Um print pesaria 100kb no pior lugar
 *    possível.
 *
 * O que mudou em 26/08/2026: a hierarquia. O `<h1>` era "Atenda seus clientes
 * com mais eficiência e agilidade" — a mesma frase da `/teste-gratis` — e a
 * campanha vivia num badge de 12px. Agora o título é a oportunidade, a oferta
 * ganhou faixa própria e a promessa genérica virou subtítulo. */
export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)] pb-20 pt-10 max-[380px]:pb-12 max-[380px]:pt-6 sm:pt-16">
      {/* A partir de `lg`: promessa à esquerda, produto à direita. Abaixo
          disso o mock desce — em coluna estreita ele viraria um cartão
          apertado competindo com o CTA. */}
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div>
          {/* Escassez declarada, sem contador: são 10 vagas fixas, e não
              existe fonte de dados de "restantes" para mostrar. */}
          <div className="flex w-fit items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-[0_0_24px_-6px_rgba(0,200,150,0.45)] backdrop-blur-sm sm:text-sm">
            <span
              aria-hidden="true"
              className="relative flex h-2 w-2 shrink-0 items-center justify-center"
            >
              <span className="animate-dot-ping absolute h-2 w-2 rounded-full bg-primary" />
              <span className="h-2 w-2 rounded-full bg-primary" />
            </span>
            {hero.badge}
          </div>

          {/* Um `<h1>` só, em caixa normal.
              A caixa alta anterior vinha com `tracking-[-0.03em]`: versal pede
              espaçamento positivo, e o negativo colava as letras. A mesma
              decisão já tinha sido revertida na `/teste-gratis`, para esta
              mesma frase, com a mesma justificativa. */}
          <h1 className="mt-8 text-[clamp(2.1rem,4.4vw,3.4rem)] font-bold leading-[1.06] tracking-[-0.03em] max-[380px]:mt-5">
            <span className="block">{hero.titulo.linha1}</span>
            <span className="headline-gradiente block">
              {hero.titulo.destaque}
            </span>
            <span className="block">{hero.titulo.linha3}</span>
          </h1>

          {/* A faixa da oferta saiu em 26/08/2026, a pedido do dono. A
              gratuidade continua dita no subtítulo e tem a seção de valor
              inteira logo abaixo do hero. */}
          <p className="mt-7 max-w-2xl text-[clamp(1rem,1.5vw,1.1875rem)] leading-relaxed text-dark-muted max-[380px]:mt-5 max-[380px]:text-[0.9375rem] max-[380px]:leading-[1.5]">
            {hero.subtitulo}
          </p>

          <div className="mt-9 flex flex-col items-start gap-4 max-[380px]:mt-6 max-[380px]:gap-3">
            <CtaAncora rotulo={hero.cta} local="hero" />
            {/* As duas linhas usam o mesmo recuo. Com o ícone só na segunda,
                elas começavam em colunas diferentes e o bloco ficava com um
                degrau logo abaixo do CTA. */}
            <ul className="flex flex-col gap-1.5">
              {[hero.microcopy, hero.confianca].map((linha) => (
                <li
                  key={linha}
                  className="flex items-start gap-2 text-sm text-dark-muted max-[380px]:text-xs"
                >
                  <Check
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  />
                  {linha}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative lg:pl-4">
          {/* Fio que liga os dois lados da composição, atrás do telefone.
              Puramente decorativo — a informação está na seção de jornada. */}
          <div
            aria-hidden="true"
            className="fio-conexao absolute left-0 right-0 top-1/2 hidden h-px lg:block"
          />
          {/* O aparelho traz as próprias etapas embaixo, como no mockup da
              marca. As etiquetas soltas ao redor dele saíram: ancoradas na
              coluna, acabavam por cima dos balões em telas largas e eram
              cortadas pelo `overflow-x-clip` do outro lado. */}
          <ConversaMock />
        </div>
      </div>
    </section>
  );
}
