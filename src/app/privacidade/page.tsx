import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

/* Política de privacidade exigida pelas LPs de captura: elas coletam nome,
   telefone e segmento, e a revisão de anúncios da Meta checa a página de
   destino. O link vive no formulário e nos rodapés. */
export const metadata: Metadata = {
  title: "Política de Privacidade | CompanyChat",
  description:
    "Como a CompanyChat coleta, usa, compartilha e protege os dados pessoais informados no site, e como exercer os seus direitos previstos na LGPD.",
  alternates: { canonical: "/privacidade" },
  robots: { index: true, follow: true },
};

const ATUALIZADO_EM = "25 de agosto de 2026";
const EMAIL_CONTATO = "contato@companychatia.com.br";

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold tracking-[-0.01em] text-dark-text sm:text-2xl">
        {titulo}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed text-dark-muted">
        {children}
      </div>
    </section>
  );
}

export default function PrivacidadePage() {
  const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}`;
  const email = `mailto:${EMAIL_CONTATO}`;

  return (
    <>
      <header className="border-b border-dark-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-[clamp(1rem,4vw,2rem)] py-5">
          <Link href="/" aria-label="Ir para a página inicial">
            <Logo dark />
          </Link>
          <Link
            href="/"
            className="text-sm text-dark-muted transition-colors hover:text-primary"
          >
            Voltar ao site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-[clamp(1rem,4vw,2rem)] py-12 sm:py-16">
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-dark-text sm:text-4xl">
          Política de Privacidade
        </h1>
        <p className="mt-3 text-sm text-dark-muted">
          Última atualização: {ATUALIZADO_EM}
        </p>

        <p className="mt-8 leading-relaxed text-dark-muted">
          Esta política explica quais dados pessoais a CompanyChat coleta
          neste site, para que eles são usados, com quem são compartilhados e
          como você pode exercer os seus direitos. Ela segue a Lei Geral de
          Proteção de Dados Pessoais (Lei nº 13.709/2018).
        </p>

        <Secao titulo="1. Quem é o controlador dos dados">
          <p>
            <strong className="text-dark-text">CompanyChat IA Ltda</strong>,
            inscrita no CNPJ 36.076.441/0001-14, com sede em Goiânia, Goiás, é a
            responsável por decidir como e por que os seus dados pessoais são
            tratados.
          </p>
          <p>
            Para qualquer assunto relacionado a esta política, inclusive falar
            com o nosso encarregado pelo tratamento de dados pessoais, escreva
            para{" "}
            <a
              href={email}
              className="text-primary underline underline-offset-4"
            >
              {EMAIL_CONTATO}
            </a>{" "}
            ou fale conosco pelo WhatsApp{" "}
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              +55 64 9305-4630
            </a>
            .
          </p>
        </Secao>

        <Secao titulo="2. Quais dados coletamos">
          <p>
            <strong className="text-dark-text">
              Dados que você informa nos formulários:
            </strong>{" "}
            nome, e-mail, nome da empresa ou clínica, endereço do site, número de
            WhatsApp e o segmento de atuação escolhido. Em alguns formulários
            também perguntamos sobre o tamanho da equipe e o volume de mensagens
            recebidas.
          </p>
          <p>
            <strong className="text-dark-text">
              Registro do consentimento:
            </strong>{" "}
            quando você marca a autorização para receber o nosso contato pelo
            WhatsApp, guardamos a data, a hora e a versão do texto que você
            aceitou.
          </p>
          <p>
            <strong className="text-dark-text">
              Registro do atendimento pelo WhatsApp:
            </strong>{" "}
            as mensagens que enviamos e as suas respostas, além da confirmação de
            entrega e de leitura fornecida pelo WhatsApp.
          </p>
          <p>
            <strong className="text-dark-text">
              Dados coletados automaticamente:
            </strong>{" "}
            a página em que você estava, o site de origem e os parâmetros de
            campanha presentes no endereço (como <code>utm_source</code>,{" "}
            <code>utm_campaign</code>, <code>gclid</code>, <code>fbclid</code> e{" "}
            <code>msclkid</code>), que nos indicam por qual anúncio você chegou.
          </p>
          <p>
            <strong className="text-dark-text">Não solicitamos</strong> dados de
            saúde, dados de pacientes, documentos, dados bancários ou qualquer
            outra informação sensível pelos formulários deste site. Pedimos que
            você também não os envie.
          </p>
        </Secao>

        <Secao titulo="3. Para que usamos esses dados">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Entrar em contato por WhatsApp para apresentar a solução, liberar a
              demonstração da nossa assistente de IA e responder às suas
              dúvidas.
            </li>
            <li>
              Personalizar a demonstração de acordo com o segmento e o porte que
              você informou.
            </li>
            <li>
              Entender qual anúncio ou canal trouxe cada contato, para medir e
              melhorar as nossas campanhas.
            </li>
            <li>
              Enviar, quando você solicita um teste e autoriza o contato, a
              mensagem de WhatsApp sobre essa solicitação e conduzir o
              atendimento que vem depois dela.
            </li>
            <li>Cumprir obrigações legais ou regulatórias aplicáveis.</li>
          </ul>
          <p>
            A autorização dada nesse formulário vale para o contato sobre a sua
            solicitação de teste. Ela não é usada para incluir você em campanhas
            ou disparos genéricos.
          </p>
          <p>
            As bases legais são o seu{" "}
            <strong className="text-dark-text">consentimento</strong>, dado ao
            enviar o formulário, os{" "}
            <strong className="text-dark-text">
              procedimentos preliminares relacionados a um contrato
            </strong>{" "}
            que você demonstrou interesse em celebrar e o nosso{" "}
            <strong className="text-dark-text">legítimo interesse</strong> em
            medir e aprimorar a divulgação dos nossos serviços.
          </p>
        </Secao>

        <Secao titulo="4. Cookies e o Pixel da Meta">
          <p>
            Utilizamos o Meta Pixel, tecnologia da Meta Platforms, para saber
            quais anúncios geram visitas e cadastros e para exibir anúncios a
            pessoas com perfil semelhante ao dos nossos clientes. O Pixel pode
            registrar a sua visita e o envio do formulário, além de usar cookies
            no seu navegador.
          </p>
          <p>
            Você pode gerenciar isso nas{" "}
            <a
              href="https://www.facebook.com/adpreferences/ad_settings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              preferências de anúncios da Meta
            </a>{" "}
            ou bloquear cookies nas configurações do seu navegador. Bloquear
            cookies não impede o uso do site nem o envio do formulário.
          </p>
        </Secao>

        <Secao titulo="5. Com quem compartilhamos">
          <p>
            Não vendemos os seus dados. Eles são compartilhados apenas com quem
            é necessário para a operação:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-dark-text">Meta Platforms</strong> — para
              mensuração de campanhas e envio de mensagens pela API Oficial do
              WhatsApp.
            </li>
            <li>
              <strong className="text-dark-text">
                Provedores de infraestrutura
              </strong>{" "}
              — hospedagem do site, banco de dados e plataforma de atendimento,
              que armazenam os dados em nosso nome e sob nossas instruções.
            </li>
            <li>
              <strong className="text-dark-text">Autoridades públicas</strong> —
              quando houver obrigação legal ou ordem judicial.
            </li>
          </ul>
        </Secao>

        <Secao titulo="6. Por quanto tempo guardamos">
          <p>
            Mantemos os dados de contato enquanto durar o relacionamento
            comercial e por até 5 anos após o último contato, prazo que atende
            às finalidades acima e a eventuais obrigações legais. Você pode pedir
            a exclusão antes disso, conforme a seção seguinte.
          </p>
        </Secao>

        <Secao titulo="7. Os seus direitos">
          <p>
            A LGPD garante a você o direito de solicitar, a qualquer momento:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>confirmação de que tratamos os seus dados e acesso a eles;</li>
            <li>correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>
              anonimização, bloqueio ou eliminação de dados desnecessários ou
              tratados em desconformidade com a lei;
            </li>
            <li>portabilidade dos dados a outro fornecedor;</li>
            <li>
              eliminação dos dados tratados com base no seu consentimento;
            </li>
            <li>informação sobre com quem compartilhamos os seus dados;</li>
            <li>
              revogação do consentimento e oposição a tratamentos que você
              considere irregulares.
            </li>
          </ul>
          <p>
            Para exercer qualquer um deles, escreva para{" "}
            <a
              href={email}
              className="text-primary underline underline-offset-4"
            >
              {EMAIL_CONTATO}
            </a>{" "}
            ou nos chame no{" "}
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              WhatsApp +55 64 9305-4630
            </a>
            . Respondemos em até 15 dias.
          </p>
          <p>
            Para interromper o contato pelo WhatsApp, basta responder à conversa
            pedindo para parar, ou tocar em &quot;Não tenho interesse&quot; na
            mensagem que enviamos. O registro é imediato e nenhuma automação
            volta a procurar você.
          </p>
        </Secao>

        <Secao titulo="8. Segurança">
          <p>
            Adotamos medidas técnicas e administrativas para proteger os dados
            contra acessos não autorizados e situações acidentais ou ilícitas de
            destruição, perda, alteração ou divulgação. O acesso aos cadastros é
            restrito às pessoas envolvidas no atendimento comercial.
          </p>
        </Secao>

        <Secao titulo="9. Alterações desta política">
          <p>
            Podemos atualizar este documento para refletir mudanças na nossa
            operação ou na legislação. A data no topo da página sempre indica a
            versão vigente.
          </p>
        </Secao>

        <div className="mt-12 rounded-2xl border border-dark-border bg-dark-surface p-6">
          <p className="text-sm leading-relaxed text-dark-muted">
            Ficou com alguma dúvida sobre o uso dos seus dados?{" "}
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              Fale com a gente no WhatsApp
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
