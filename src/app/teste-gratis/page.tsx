import type { Metadata } from "next";
import { Check, Clock, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import ApiHeader from "@/components/api-oficial/ApiHeader";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MetaPixel from "@/components/comecar/MetaPixel";
import Formulario from "@/components/teste-gratis/Formulario";
import EventosPendentes from "@/components/teste-gratis/EventosPendentes";
import { copyDoFunil } from "@/components/teste-gratis/conteudo";
import { envioWhatsappLigado } from "@/lib/teste-gratis/config";

export const metadata: Metadata = {
  title: "Teste a CompanyChat gratuitamente | CompanyChat",
  /* Descrição neutra quanto a quem faz o contato: a página serve tanto no modo
     com assistente quanto no modo somente captação, e metadata não é
     recalculada por chave de ambiente sem custo. */
  description:
    "Preencha seus dados e entramos em contato pelo WhatsApp para entender sua operação e preparar o teste mais adequado.",
  alternates: { canonical: "/teste-gratis" },
  openGraph: {
    title: "Teste a CompanyChat gratuitamente",
    description:
      "Deixe os seus dados e o nosso assistente chama você no WhatsApp para entender a sua operação e preparar o teste certo.",
    type: "website",
    locale: "pt_BR",
    siteName: "CompanyChat",
  },
  robots: { index: true, follow: true },
};

/* O que acontece depois do envio, dito antes do envio. A promessa da página é
   contato pelo WhatsApp, não liberação automática de conta: prometer acesso
   imediato aqui viraria frustração no primeiro contato. */
function etapas(copy: ReturnType<typeof copyDoFunil>) {
  return [
    {
      icone: MessageSquare,
      titulo: "Você preenche o formulário",
      texto:
        "São cinco campos. A sua solicitação fica registrada com o segmento e o canal que você informou.",
    },
    {
      icone: Clock,
      titulo: copy.etapaContato.titulo,
      texto: copy.etapaContato.texto,
    },
    {
      icone: Sparkles,
      titulo: "A conversa monta o teste certo para a sua operação",
      texto:
        "Entendemos quantas pessoas atendem hoje, o volume de conversas e a sua principal dificuldade.",
    },
    {
      icone: ShieldCheck,
      titulo: "Quando fizer sentido, entra um especialista",
      texto:
        "Negociação, dúvida técnica ou pedido seu: a conversa passa para uma pessoa do time.",
    },
  ] as const;
}

export default function TesteGratis() {
  /* Componente de servidor: a chave é lida aqui, então a página publicada em
     modo somente captação já sai do servidor sem prometer prazo. */
  const copy = copyDoFunil(envioWhatsappLigado());
  const ETAPAS = etapas(copy);

  return (
    <>
      <MetaPixel />
      <EventosPendentes />
      <ApiHeader />

      {/* `overflow-x: clip` e não `hidden`: `hidden` viraria contêiner de
          rolagem e mataria o `sticky` do formulário. Mesmo motivo da regra de
          `section` em `globals.css`. */}
      <main id="conteudo" tabIndex={-1} className="relative overflow-x-clip bg-dark-base pt-24 pb-20 sm:pt-28">
        {/* Aurora e malha de pontos: mesma abertura do hero da home, para a
            página não parecer de outro site. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
              maskImage:
                "radial-gradient(ellipse 80% 55% at 50% 25%, black 20%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 55% at 50% 25%, black 20%, transparent 75%)",
            }}
          />
          <div
            className="absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full opacity-[0.10]"
            style={{
              background:
                "radial-gradient(circle, #00ab7a 0%, #0092ff 50%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-[clamp(1rem,4vw,2rem)]">
          {/* No celular o formulário vem logo depois da promessa: quem chegou
              pelo CTA não deveria rolar quatro blocos para achar o campo. No
              desktop ele volta para a coluna da direita, com as etapas embaixo
              do texto de abertura. */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-x-14 lg:gap-y-12">
            <div className="lg:col-start-1 lg:row-start-1">
              <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-dark-border bg-dark-surface px-4 py-2 text-sm font-medium text-dark-muted">
                <span className="relative flex h-2 w-2">
                  <span className="animate-dot-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Teste sem custo e sem compromisso
              </p>

              <h1 className="text-[clamp(34px,4.6vw,56px)] font-bold leading-[1.06] tracking-[-0.03em] text-dark-text">
                {/* Caixa normal, e não a caixa alta de antes: a frase tem 51
                    caracteres e, em versal, viraria um bloco pesado que rouba a
                    atenção do formulário ao lado. O degradê fica no benefício,
                    não no verbo. */}
                Atenda seus clientes com{" "}
                <span className="text-gradient-primary">
                  mais eficiência e agilidade
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-[clamp(16px,1.7vw,19px)] leading-relaxed text-dark-muted">
                {copy.subtitulo}
              </p>

              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5">
                {copy.garantias.map((garantia) => (
                  <li
                    key={garantia}
                    className="flex items-center gap-2 text-sm text-dark-muted"
                  >
                    <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                    {garantia}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-28">
              <Formulario copy={copy} />
            </div>

            <div className="lg:col-start-1 lg:row-start-2">
              <ol className="space-y-6">
                {ETAPAS.map((etapa, i) => (
                  <li key={etapa.titulo} className="flex gap-4">
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-dark-border bg-dark-surface">
                      <etapa.icone aria-hidden="true" className="h-5 w-5 text-primary" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-on-primary">
                        {i + 1}
                      </span>
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-dark-text">
                        {etapa.titulo}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-dark-muted">
                        {etapa.texto}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-10 rounded-2xl border border-dark-border bg-dark-surface/60 p-5 text-sm leading-relaxed text-dark-muted">
                O envio do formulário registra a sua solicitação de teste. Ele
                não cria nem libera uma conta automaticamente, porque o teste é
                montado de acordo com o seu atendimento de hoje.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
