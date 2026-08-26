import Revelar from "@/components/comum/Revelar";
import CtaAncora from "./CtaAncora";
import { ctaFinal } from "./conteudo";

/* Fechamento da narrativa.
 *
 * Fica depois do FAQ, e não logo abaixo do formulário, de propósito: um botão
 * que devolve a pessoa ao formulário que ela acabou de ignorar não converte
 * nada. Depois das perguntas respondidas, ele encontra outra pessoa — a que
 * tinha uma objeção e acabou de resolvê-la.
 *
 * O título fala do problema, não do produto, e é a última coisa que a página
 * diz: enquanto o time está offline, os clientes continuam chegando. */
export default function SecaoFechamento() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-[clamp(1rem,4vw,2rem)] text-center">
        <Revelar>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <ctaFinal.icone aria-hidden="true" className="h-6 w-6 text-primary" />
          </div>

          {/* Escala igual à dos outros `<h2>`: em `clamp(26px,3.8vw,42px)` o
              título de 97 caracteres virava cinco linhas de 42px e ficava
              maior, em área, que o próprio `<h1>` da página. */}
          <h2 className="mx-auto mt-6 max-w-2xl text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.02em]">
            {ctaFinal.titulo}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[clamp(1rem,1.4vw,1.0625rem)] leading-relaxed text-dark-muted">
            {ctaFinal.texto}
          </p>

          <div className="mt-9 flex flex-col items-center gap-4">
            <CtaAncora rotulo={ctaFinal.botao} local="fechamento" />
            <p className="text-sm text-dark-muted">{ctaFinal.microcopy}</p>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
