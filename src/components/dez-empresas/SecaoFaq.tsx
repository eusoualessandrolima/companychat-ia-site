import { Plus } from "lucide-react";
import Revelar from "@/components/comum/Revelar";
import Rotulo from "@/components/comum/Rotulo";
import { faq } from "./conteudo";

/* FAQ em `<details>`/`<summary>` nativos.
 *
 * Zero JavaScript, e de graça vêm coisas que um acordeão feito à mão precisa
 * implementar: estado aberto/fechado acessível por teclado, anúncio correto em
 * leitor de tela, busca do navegador encontrando texto dentro do bloco
 * fechado (Ctrl+F abre o `<details>` sozinho) e funcionamento sem hidratação.
 *
 * O ícone gira via `group-open:`, que é seletor CSS puro sobre o estado do
 * próprio elemento — nada de classe controlada por estado de React.
 *
 * ⚠️ Duas perguntas do briefing ficaram de fora por falta de fonte: prazo de
 * implantação e troca de número. Ver o comentário em `conteudo.ts`. */
export default function SecaoFaq() {
  return (
    <section className="atmosfera-escura border-y border-dark-border py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-[clamp(1rem,4vw,2rem)]">
        <Revelar className="text-center">
          <Rotulo>{faq.rotulo}</Rotulo>
          <h2 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.02em]">
            {faq.titulo}
          </h2>
        </Revelar>

        <div className="mt-12 space-y-3">
          {faq.itens.map((item, i) => (
            <Revelar key={item.pergunta} atraso={Math.min(i, 4) * 0.04}>
              <details className="group rounded-2xl border border-dark-border bg-dark-surface/70 transition-colors open:border-primary/30 hover:border-dark-field-border">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[1.0625rem] font-semibold leading-snug [&::-webkit-details-marker]:hidden">
                  {item.pergunta}
                  <Plus
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-45"
                  />
                </summary>
                <p className="px-5 pb-5 text-[0.9375rem] leading-relaxed text-dark-muted sm:text-base">
                  {item.resposta}
                </p>
              </details>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
