import { Check, X } from "lucide-react";
import Revelar from "@/components/comum/Revelar";
import Rotulo from "@/components/comum/Rotulo";
import { perfil } from "./conteudo";

/* Para quem é — e para quem não é.
 *
 * Era uma lista de seis com um aviso de exclusão no rodapé. Em duas colunas o
 * bloco passa a fazer o que a campanha precisa: dizer para quem **não** é é o
 * que faz a página ler como seleção, e não como cadastro. Quem se reconhece na
 * coluna da esquerda chega ao formulário com a sensação de já ter passado por
 * um filtro.
 *
 * A coluna da direita usa o cinza `dark-muted`, não vermelho: não são erros,
 * são casos que não se encaixam agora. */
export default function SecaoPerfil() {
  return (
    <section className="atmosfera-escura-alt border-y border-dark-border py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-[clamp(1rem,4vw,2rem)]">
        <Revelar className="mx-auto max-w-2xl text-center">
          <Rotulo>{perfil.rotulo}</Rotulo>
          <h2 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.02em]">
            {perfil.titulo}
          </h2>
        </Revelar>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Revelar className="rounded-3xl border border-primary/25 bg-primary/[0.06] p-7 sm:p-8">
            <h3 className="text-[1.0625rem] font-bold leading-snug text-dark-text">
              {perfil.positivos.titulo}
            </h3>
            <ul className="mt-6 space-y-3.5">
              {perfil.positivos.itens.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-snug">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Check aria-hidden="true" className="h-3 w-3 text-primary" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Revelar>

          <Revelar
            atraso={0.08}
            className="rounded-3xl border border-dark-border bg-dark-surface/60 p-7 sm:p-8"
          >
            <h3 className="text-[1.0625rem] font-bold leading-snug text-dark-muted">
              {perfil.negativos.titulo}
            </h3>
            <ul className="mt-6 space-y-3.5">
              {perfil.negativos.itens.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base leading-snug text-dark-muted"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-dark-border/70">
                    <X aria-hidden="true" className="h-3 w-3 text-dark-muted" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
