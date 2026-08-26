import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { conversa } from "./conteudo";

/* A conversa que a página inteira descreve, mostrada em vez de explicada.
 *
 * Três decisões que valem mais que o visual:
 *
 * 1. **Sem `opacity: 0`.** Isto fica ao lado do `<h1>`, acima da dobra, e a
 *    região do LCP não pode depender de hidratação. Os balões chegam prontos
 *    no HTML do servidor; o que se move é só o indicador de digitação, que é
 *    CSS puro e não ocupa espaço de conteúdo.
 *
 * 2. **DOM, não imagem.** Um print seria mais fácil e pesaria 100kb no pior
 *    lugar possível. Em texto, o mock escala com a tipografia, funciona em
 *    leitor de tela e não borra em tela retina.
 *
 * 3. **`aria-hidden` no telefone inteiro.** Para quem usa leitor de tela isto
 *    é decoração: o conteúdo real da promessa está no `<h1>` e no subtítulo
 *    ao lado. Fazer o leitor recitar uma conversa fictícia só atrapalharia.
 */
export default function ConversaMock() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-[19rem] rounded-[1.75rem] border border-dark-border bg-dark-elevated p-2.5 shadow-2xl shadow-black/50 sm:max-w-[21rem]"
    >
      {/* Barra do aplicativo */}
      <div className="flex items-center gap-3 rounded-t-[1.25rem] bg-dark-surface px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
          <WhatsAppIcon className="h-5 w-5 text-primary" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-dark-text">
            {conversa.contato}
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {conversa.estado}
          </p>
        </div>
      </div>

      <div className="space-y-2.5 bg-dark-base/60 px-3.5 py-4">
        {conversa.baloes.map((balao, i) => (
          <div
            key={i}
            className={`flex ${balao.de === "cliente" ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug ${
                balao.de === "cliente"
                  ? "rounded-br-md bg-primary/90 text-on-primary"
                  : "rounded-bl-md bg-dark-surface text-dark-text"
              }`}
            >
              {balao.texto}
            </p>
          </div>
        ))}

        {/* Digitando: os três pontos já existem no design system do site
            (`animate-typing-1/2/3`), e param sozinhos em prefers-reduced-motion
            pela regra global. Altura fixa, então nada reflui quando anima. */}
        <div className="flex justify-start">
          <span className="flex h-9 items-center gap-1 rounded-2xl rounded-bl-md bg-dark-surface px-3.5">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`animate-typing-${n} h-1.5 w-1.5 rounded-full bg-dark-muted`}
              />
            ))}
          </span>
        </div>
      </div>

      <p className="rounded-b-[1.25rem] bg-dark-surface px-4 py-2.5 text-center text-[11px] text-dark-muted">
        {conversa.rodape}
      </p>
    </div>
  );
}
