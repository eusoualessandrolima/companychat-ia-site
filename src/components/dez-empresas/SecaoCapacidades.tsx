import { Bot, User } from "lucide-react";
import Revelar from "@/components/comum/Revelar";
import Rotulo from "@/components/comum/Rotulo";
import { capacidades } from "./conteudo";

/* Bento grid: dois blocos largos e quatro normais, em quatro colunas.
 *
 * Antes eram nove cartões idênticos numa grade 3×3 mais uma lista de seis
 * embaixo — vinte e três bullets entre o hero e o formulário. Sem hierarquia,
 * o olho não sabia onde pousar, e ícone repetido entre as duas listas
 * denunciava catálogo em vez de intenção.
 *
 * O ritmo agora é 2-1-1 / 1-1-2: as duas linhas fecham em quatro colunas
 * exatas, e os dois blocos largos (o que abre e o que fecha) são os que
 * ganham representação visual em vez de só ícone e texto. */
export default function SecaoCapacidades() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-[clamp(1rem,4vw,2rem)]">
        <Revelar className="mx-auto max-w-2xl text-center">
          <Rotulo>{capacidades.rotulo}</Rotulo>
          <h2 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.02em]">
            {capacidades.titulo}
          </h2>
        </Revelar>

        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capacidades.itens.map((item, i) => (
            <Revelar
              como="li"
              key={item.titulo}
              atraso={Math.min(i, 3) * 0.06}
              className={`cartao-realce group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-dark-border bg-dark-elevated p-6 ${
                item.largo ? "sm:col-span-2" : ""
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <item.icone aria-hidden="true" className="h-6 w-6 text-primary" />
              </span>
              <div>
                <h3 className="text-[1.0625rem] font-bold leading-snug">
                  {item.titulo}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-dark-muted">
                  {item.texto}
                </p>
              </div>

              {/* Representação do que o bloco descreve, só nos dois largos:
                  é o espaço que eles têm de sobra, e é o que tira a seção da
                  estética de ícone-mais-texto repetido seis vezes. */}
              {i === 0 && <FaixaHorarios />}
              {i === capacidades.itens.length - 1 && <FaixaTransferencia />}
            </Revelar>
          ))}
        </ul>

        {/* Os dois itens que não viraram bloco. Eles existiam na lista antiga
            e continuam verdadeiros — só pararam de disputar atenção com os
            seis principais. */}
        <Revelar atraso={0.1} className="mt-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {capacidades.extras.map((extra) => (
              <li
                key={extra.texto}
                className="flex items-center gap-2.5 text-[0.9375rem] text-dark-text/90"
              >
                <extra.icone
                  aria-hidden="true"
                  className="h-[18px] w-[18px] shrink-0 text-primary/80"
                />
                {extra.texto}
              </li>
            ))}
          </ul>
        </Revelar>

        <Revelar atraso={0.14}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-[0.9375rem] leading-relaxed text-dark-muted">
            {capacidades.complemento}
          </p>
        </Revelar>
      </div>
    </section>
  );
}

/** Vinte e quatro traços, um por hora, com os do horário comercial cheios e o
 *  resto aceso no verde: o argumento do bloco ("mesmo quando sua equipe está
 *  offline") desenhado em vez de repetido por extenso. */
function FaixaHorarios() {
  return (
    <div aria-hidden="true" className="mt-auto pt-4">
      <div className="flex items-end gap-[3px]">
        {Array.from({ length: 24 }, (_, h) => {
          const comercial = h >= 8 && h < 18;
          return (
            <span
              key={h}
              className={`flex-1 rounded-full ${
                comercial ? "h-4 bg-dark-muted/30" : "h-7 bg-primary/70"
              }`}
            />
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-dark-muted">
        <span>00h</span>
        {/* A legenda estava centralizada, bem acima das barras cinzas — e por
            isso parecia nomear justamente o horário em que a IA *não* é o
            diferencial. O marcador verde amarra a frase à cor certa. */}
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary/70" />
          <span className="text-primary">fora do horário, a IA continua</span>
        </span>
        <span>23h</span>
      </div>
    </div>
  );
}

/** A passagem de bastão: a IA atende, reconhece o limite e entrega para uma
 *  pessoa. É a única promessa desta seção que fala do que a IA **não** faz. */
function FaixaTransferencia() {
  return (
    <div aria-hidden="true" className="mt-auto flex items-center gap-3 pt-4">
      <span className="flex items-center gap-2 rounded-xl border border-dark-border bg-dark-surface px-3 py-2 text-[13px] font-semibold">
        <Bot className="h-4 w-4 text-primary" />
        IA
      </span>
      <span className="fio-conexao h-px flex-1" />
      <span className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-[13px] font-semibold text-primary">
        <User className="h-4 w-4" />
        Seu time
      </span>
    </div>
  );
}
