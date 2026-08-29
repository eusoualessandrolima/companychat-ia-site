import FundoAurora from "@/components/comum/FundoAurora";
import Revelar from "@/components/comum/Revelar";
import { Cabecalho, Rodape } from "./Moldura";
import Encerrada from "./Encerrada";
import FormularioCandidatura from "./FormularioCandidatura";
import Hero from "./Hero";
import MedidorDePagina from "./MedidorDePagina";
import SecaoCapacidades from "./SecaoCapacidades";
import SecaoEntrega from "./SecaoEntrega";
import SecaoJornada from "./SecaoJornada";
import SecaoPerfil from "./SecaoPerfil";
import SecaoProva from "./SecaoProva";
import SecaoSelecao from "./SecaoSelecao";
import SecaoValor from "./SecaoValor";
import { ANCORA_FORMULARIO, CAMPANHA_ENCERRADA } from "./conteudo";

/* Landing da campanha "10 Empresas, 10 Agentes de IA".
 *
 * Estrutura própria, e não a `Landing` das LPs de nicho: aquela é um funil
 * longo (calculadora, provas, marquee, antes/depois) e esta precisa ser curta,
 * com um objetivo só — a candidatura. O que se reaproveita agora é o sistema
 * visual de verdade, e não por cópia: `Revelar`, `Rotulo` e `FundoAurora`
 * moram em `components/comum/` e servem às duas.
 *
 * **Este arquivo é Server Component.** Até 26/08/2026 ele era um único
 * `"use client"` de 524 linhas englobando header, hero, quatro seções,
 * formulário, CTA e rodapé — o que arrastava toda a copy, os 17 ícones e
 * 140 KB de framer-motion para o bundle, e punha a página inteira num único
 * ponto de falha. Sobraram três ilhas de cliente: `MedidorDePagina`,
 * `CtaAncora`/`LinkWhatsApp` e o formulário.
 *
 * Ordem das seções, e o porquê de cada posição:
 *   hero → o que é e para quem
 *   valor → o que a empresa recebe (única seção clara: quebra a temperatura)
 *   jornada → como funciona, em 5 segundos
 *   capacidades → o que a IA faz
 *   entrega → o que será implantado, em ordem
 *   perfil → é para mim?
 *   prova → posso confiar?
 *   seleção → no que estou me metendo?  ← última objeção antes do formulário
 *   formulário → e a página acaba aqui, de propósito */
export default function Campanha() {
  return (
    <div
      /* Marca lida por `html:has(...)` em `globals.css`: esta landing tem
         cabeçalho estático, então não deve herdar o `scroll-padding-top` de
         5.5rem que existe para o header fixo do site. Sem isso, o salto para
         `#candidatura` parava com 112px de vazio acima do formulário. */
      data-landing-sem-header-fixo=""
      className="relative overflow-x-clip bg-dark-base text-dark-text"
    >
      <FundoAurora />
      <MedidorDePagina />

      <Cabecalho />

      <main id="conteudo" tabIndex={-1} className="relative">
        <Hero />
        <SecaoValor />
        <SecaoJornada />
        <SecaoCapacidades />
        <SecaoEntrega />
        <SecaoPerfil />
        <SecaoProva />
        <SecaoSelecao />

        <section
          id={ANCORA_FORMULARIO}
          className="scroll-mt-4 border-y border-dark-border bg-dark-base py-20 sm:py-24"
        >
          {/* Superfície `dark-base`, e não `dark-surface`: a seção anterior
              também era `dark-surface` com `border-y`, e as duas coladas
              formavam uma linha dupla no meio de um bloco contínuo — com o
              formulário, que é o elemento mais importante da página, sem
              contraste nenhum contra o que vinha antes. */}
          <div className="mx-auto max-w-2xl px-[clamp(1rem,4vw,2rem)]">
            {CAMPANHA_ENCERRADA ? (
              <Revelar>
                <Encerrada />
              </Revelar>
            ) : (
              /* O formulário **nunca** entra por `Revelar`. Ele é o objetivo
                 único da página: se a animação de entrada falhar, a campanha
                 inteira deixa de converter. */
              <FormularioCandidatura />
            )}
          </div>
        </section>

        {/* Sem FAQ e sem CTA final: a página termina no formulário.
            Decisão do dono, 26/08/2026 — a segunda vez que o FAQ sai daqui na
            mesma semana. Os textos das duas seções continuam em `conteudo.ts`
            porque alimentam a base da Jade, que responde no WhatsApp o que a
            página não explica mais. */}
      </main>

      <Rodape />
    </div>
  );
}
