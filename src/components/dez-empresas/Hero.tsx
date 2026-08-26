import { Check, Sparkles } from "lucide-react";
import CtaAncora from "./CtaAncora";
import ConversaMock from "./ConversaMock";
import { etiquetasHero, hero } from "./conteudo";

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

          {/* A oferta em superfície própria: é a informação que decide a
              candidatura, e diluída no meio do parágrafo ela sumia. */}
          <p className="borda-destaque mt-7 flex w-fit items-center gap-3 rounded-2xl bg-dark-elevated/80 px-5 py-3.5 max-[380px]:mt-5 max-[380px]:px-4">
            <Sparkles
              aria-hidden="true"
              className="h-5 w-5 shrink-0 text-primary"
            />
            <span className="text-[clamp(0.9375rem,1.5vw,1.0625rem)] leading-snug">
              <strong className="font-bold text-dark-text">
                {hero.oferta.principal}
              </strong>{" "}
              <span className="text-dark-muted">{hero.oferta.complemento}</span>
            </span>
          </p>

          <p className="mt-6 max-w-2xl text-[clamp(1rem,1.5vw,1.1875rem)] leading-relaxed text-dark-muted max-[380px]:mt-4 max-[380px]:text-[0.9375rem] max-[380px]:leading-[1.5]">
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
          {/* Wrapper na largura exata do mock.
              As etiquetas se posicionam por este contêiner, e não pela coluna
              inteira: ancoradas na coluna, elas ficavam a até 100px do telefone
              em telas largas e a etiqueta de 160px acabava por cima dos balões
              da conversa — cobrindo justamente o conteúdo que a composição
              existe para mostrar. */}
          {/* `lg:mr-20` desloca o telefone para dentro da coluna e abre a
              faixa que as etiquetas da direita ocupam. Sem ela, o mock encosta
              na margem do contêiner e as duas etiquetas daquele lado saíam da
              viewport — onde o `overflow-x-clip` do root as cortava pela
              metade ("Reunião agend…"). */}
          <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[21rem] lg:mr-20">
            <ConversaMock />

            {/* Etiquetas de resultado ao redor do mock.
                Quatro, não oito: o telefone precisa continuar sendo o objeto
                principal. Só aparecem de `sm` para cima — em coluna estreita
                elas cobririam a conversa, que é o conteúdo real. */}
            <ul
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden sm:block"
            >
              {etiquetasHero.map((etiqueta, i) => (
                <li
                  key={etiqueta.texto}
                  className={`cartao-flutuante animate-badge-float-${i + 1} absolute flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-[13px] font-semibold text-dark-text ${POSICOES[i]}`}
                >
                  <etiqueta.icone className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {etiqueta.texto}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Posições fixas, uma por etiqueta. Cada uma é ancorada numa borda do telefone
   e empurrada para **fora** dele com `translate`, de modo que só a ponta da
   etiqueta encoste no aparelho — nenhuma passa por cima dos balões.
   Fora do componente para não recriar o array a cada render. */
const POSICOES = [
  "left-0 top-[12%] -translate-x-[78%]",
  "right-0 top-[34%] translate-x-[62%]",
  "left-0 bottom-[28%] -translate-x-[92%]",
  "right-0 bottom-[8%] translate-x-[58%]",
] as const;
