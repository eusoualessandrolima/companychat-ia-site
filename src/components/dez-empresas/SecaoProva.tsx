import { Simbolo } from "@/components/Logo";
import Revelar from "@/components/comum/Revelar";
import Rotulo from "@/components/comum/Rotulo";
import { provaEmpresa } from "./conteudo";

/* Confiança sem número inventado.
 *
 * Não há depoimento, logo de cliente nem métrica apurada neste projeto, e
 * fabricar qualquer um deles está fora de questão. A prova que sobra é melhor
 * do que um contador anônimo, porque o visitante pode conferir na hora: a IA
 * que a campanha oferece é a mesma que atende o WhatsApp comercial da
 * CompanyChat. O convite é "vá lá e converse com ela".
 *
 * `metricas` fica vazio de propósito — a faixa só renderiza quando houver dado
 * real. Estrutura pronta, sem estimativa no ar. */
export default function SecaoProva() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-[clamp(1rem,4vw,2rem)]">
        <Revelar>
          <div className="grid grid-cols-1 items-center gap-10 rounded-3xl border border-dark-border bg-dark-elevated p-8 sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-12">
            <Simbolo className="h-16 w-16 rounded-2xl sm:h-20 sm:w-20" />

            <div>
              <Rotulo>{provaEmpresa.rotulo}</Rotulo>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold leading-[1.15] tracking-[-0.02em]">
                {provaEmpresa.titulo}
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-dark-muted sm:text-base">
                {provaEmpresa.texto}
              </p>

              {/* Sem botão para o WhatsApp aqui, a pedido do dono: a página
                  tem um objetivo só, e um segundo caminho de saída ao lado do
                  argumento de confiança tirava gente do funil da candidatura
                  em vez de trazer. O WhatsApp continua no rodapé. */}
              <p className="mt-5 border-l-2 border-primary/40 pl-4 text-[0.9375rem] leading-relaxed text-dark-text/90 sm:text-base">
                {provaEmpresa.destaque}
              </p>
            </div>
          </div>
        </Revelar>

        {/* Só entra no ar quando houver número apurado. Hoje a lista é vazia e
            nada renderiza — que é o comportamento correto. */}
        {provaEmpresa.metricas.length > 0 && (
          <Revelar atraso={0.1}>
            <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {provaEmpresa.metricas.map((metrica) => (
                <li
                  key={metrica.rotulo}
                  className="rounded-2xl border border-dark-border bg-dark-surface/60 p-5 text-center"
                >
                  <p className="font-display text-[1.75rem] font-bold leading-none text-primary">
                    {metrica.numero}
                  </p>
                  <p className="mt-2 text-[0.8125rem] leading-snug text-dark-muted">
                    {metrica.rotulo}
                  </p>
                </li>
              ))}
            </ul>
          </Revelar>
        )}
      </div>
    </section>
  );
}
