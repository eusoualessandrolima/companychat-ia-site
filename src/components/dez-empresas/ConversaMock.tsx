import { Simbolo } from "@/components/Logo";
import { conversa, etiquetasHero } from "./conteudo";

/* O aparelho do material da marca, reconstruído em DOM.
 *
 * Vem do mockup oficial (`Marketing/Logomarca/Modelo v2/01-MOCKUP`): moldura
 * metálica, Dynamic Island, barra de status e a interface do WhatsApp com as
 * cores reais do aplicativo — `#0b141a` na tela, `#202c33` no balão de quem
 * recebe, `#005c4b` no de quem envia. Antes daqui havia um cartão arredondado
 * genérico que não parecia telefone nenhum.
 *
 * As cores do WhatsApp são literais de propósito e **não** entram na paleta da
 * CompanyChat: elas representam um produto de terceiro, do mesmo jeito que o
 * verde `#25D366` do ícone. Trocá-las por tokens da marca desfaria justamente
 * o realismo que faz o mock funcionar.
 *
 * Quatro decisões mantidas do mock anterior:
 *
 * 1. **Sem `opacity: 0`.** Isto fica ao lado do `<h1>`, acima da dobra, e a
 *    região do LCP não pode depender de hidratação. Os balões chegam prontos
 *    no HTML do servidor; o que se move é só o indicador de digitação, que é
 *    CSS puro e não ocupa espaço de conteúdo.
 * 2. **DOM, não imagem.** Um print seria mais fácil e pesaria 100kb no pior
 *    lugar possível. Em texto, o mock escala com a tipografia e não borra em
 *    tela retina.
 * 3. **`aria-hidden` no telefone inteiro.** Para quem usa leitor de tela isto
 *    é decoração: a promessa real está no `<h1>` e no subtítulo ao lado.
 * 4. **O avatar é o símbolo oficial**, não uma letra desenhada em CSS — o
 *    manual da marca proíbe recriar a marca com texto.
 */
export default function ConversaMock() {
  return (
    <div aria-hidden="true" className="relative">
      {/* Aura do mockup: brilho verde atrás do aparelho.
          Medida em `rem` e limitada a `100%`, e não em `125%` da coluna: a
          125% ela dava 569px numa `<section>` de 1152px que já tinha o
          telefone encostado à direita, e os últimos 24px do brilho batiam no
          `overflow-x: clip` da seção. O corte aparecia como uma linha vertical
          reta ao lado do aparelho — brilho não tem borda reta, e era isso que
          denunciava o defeito. 27rem é a medida do mockup original (430px). */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[min(27rem,100%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,220,163,0.20),rgba(0,220,163,0)_67%)] blur-[10px]" />

      {/* Moldura. A perspectiva é a do mockup, com o ângulo reduzido de 5° para
          3°: a 5° a borda esquerda do aparelho passava do contêiner nas
          larguras intermediárias. */}
      <div className="relative mx-auto w-full max-w-[19rem] rounded-[2.75rem] bg-[linear-gradient(110deg,#51605d_0%,#161b1c_12%,#050708_48%,#505b59_91%,#151919_100%)] p-[9px] shadow-[0_38px_80px_rgba(0,0,0,0.5),-12px_8px_35px_rgba(0,205,154,0.14),inset_0_0_0_1px_rgba(255,255,255,0.34)] [transform:perspective(950px)_rotateY(-3deg)_rotateZ(1deg)] sm:max-w-[20rem]">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-[#0b141a]">
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-[11px] z-10 h-[22px] w-[82px] -translate-x-1/2 rounded-full bg-[#020303]" />

          <div className="flex items-center justify-between px-5 pb-[7px] pt-3 text-[0.72rem] text-[#f2f4f3]">
            <span>9:41</span>
            <span className="tracking-tight">▮▮▮ ᴡɪғɪ ◉</span>
          </div>

          {/* Cabeçalho do WhatsApp */}
          <div className="grid grid-cols-[34px_1fr_auto] items-center gap-[9px] bg-[#202c33] px-[13px] py-[11px]">
            {/* O símbolo é 440×460 — mais alto que largo. Forçado num quadrado
                de 34px com `rounded-full`, o balão ficava esticado e as pontas
                saíam pelo recorte do círculo. Agora o círculo é o contêiner e
                o símbolo entra dentro dele, inteiro, com folga. */}
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#0b141a]">
              <Simbolo className="h-[19px] w-auto" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.8125rem] font-semibold text-[#f2f4f3]">
                {conversa.contato}
              </p>
              <p className="text-[0.6875rem] text-[#9da9ad]">{conversa.estado}</p>
            </div>
            <div className="flex gap-3 text-[#aeb9bc]">
              <span>⌕</span>
              <span>⋮</span>
            </div>
          </div>

          {/* Conversa. O padrão de pontinhos é o do papel de parede do
              aplicativo, aplicado por baixo de uma camada quase opaca. */}
          <div className="flex min-h-[19rem] flex-col gap-[9px] bg-[linear-gradient(rgba(11,20,26,0.94),rgba(11,20,26,0.94)),radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:auto,18px_18px] px-3 pb-3.5 pt-4">
            <span className="self-center rounded-lg bg-[#182229] px-[9px] py-[5px] text-[0.65rem] text-[#aab5b8]">
              HOJE
            </span>

            {conversa.baloes.map((balao, i) => (
              <p
                key={i}
                className={`max-w-[82%] rounded-[9px] px-2.5 pb-1.5 pt-[9px] text-[0.8125rem] leading-[1.35] text-[#e9edef] shadow-[0_1px_1px_rgba(0,0,0,0.18)] ${
                  balao.de === "cliente"
                    ? "self-end bg-[#005c4b]"
                    : "self-start bg-[#202c33]"
                }`}
              >
                {balao.texto}
                <span
                  className={`float-right ml-[9px] mt-1 text-[0.625rem] ${
                    balao.de === "cliente" ? "text-[#8fc6bb]" : "text-[#91a09f]"
                  }`}
                >
                  09:4{i + 1}
                  {balao.de === "cliente" && (
                    <span className="ml-1 text-[#56b7e9]">✓✓</span>
                  )}
                </span>
              </p>
            ))}

            {/* Digitando: os três pontos já existem no design system
                (`animate-typing-1/2/3`) e param sozinhos em
                prefers-reduced-motion pela regra global. Altura fixa, então
                nada reflui quando anima. */}
            <span className="flex h-8 w-fit items-center gap-1 self-start rounded-[9px] bg-[#202c33] px-3">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`animate-typing-${n} h-1.5 w-1.5 rounded-full bg-[#91a09f]`}
                />
              ))}
            </span>
          </div>

          {/* Campo de mensagem */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 bg-[#111b21] px-2.5 pb-3 pt-2">
            <span className="text-[#879498]">＋</span>
            <span className="rounded-full bg-[#202c33] px-[13px] py-2.5 text-[0.8125rem] text-[#879498]">
              Mensagem
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00a884] text-[0.625rem] text-[#0b141a]">
              ●
            </span>
          </div>
        </div>
      </div>

      {/* As etapas da automação, como no mockup: chips embaixo do aparelho, o
          primeiro aceso. Substituíram as etiquetas soltas ao redor do
          telefone, que em telas largas acabavam por cima dos balões. */}
      {/* `mt-6`, e não margem negativa: puxados para cima eles montavam na base
          do aparelho. Três chips de uma linha só não cabem na largura do
          telefone em nenhuma tela, então a quebra é assumida e centralizada. */}
      <ul className="relative mt-6 flex flex-wrap justify-center gap-2">
        {etiquetasHero.slice(0, 3).map((etiqueta, i) => (
          <li
            key={etiqueta.texto}
            className={`cartao-flutuante flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-[0.6875rem] font-semibold ${
              i === 0
                ? "border-primary/50 text-primary shadow-[0_0_26px_rgba(0,213,162,0.13)]"
                : "text-dark-muted"
            }`}
          >
            <etiqueta.icone
              className={`h-3.5 w-3.5 shrink-0 ${i === 0 ? "text-primary" : "text-dark-muted"}`}
            />
            {etiqueta.texto}
          </li>
        ))}
      </ul>
    </div>
  );
}
