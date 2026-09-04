import type { Metadata } from "next";
import PaginaLegal, {
  LinkExterno,
  LinkInterno,
  Secao,
  Termo,
} from "@/components/legal/PaginaLegal";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import {
  ATUALIZADO_EXCLUSAO,
  CNPJ,
  EMAIL_PRIVACIDADE,
  PRAZO_ATENDIMENTO,
  PRAZO_CONFIRMACAO,
  RAZAO_SOCIAL,
} from "@/lib/legal";

/* Página de exclusão de dados exigida pela revisão de apps da Meta: é a URL
   que vai no campo "Data Deletion Instructions URL" do aplicativo.

   Requisitos que ela precisa cumprir, e que não podem ser quebrados numa
   edição futura:
   - responder 200 direto, sem redirecionar para a home nem para login;
   - funcionar sem autenticação, sem conta e sem cookie obrigatório;
   - descrever o pedido, os dados de identificação, o canal, os prazos, o que
     é apagado, o que é retido por lei e como chega a confirmação;
   - **não** apontar facebook.com como canal de exclusão. O link para o
     Gerenciador de Negócios aparece só na seção de revogação da integração,
     que é assunto diferente de exclusão de dados.

   Sobre cores: a página é **clara**. Ver o comentário em
   `components/legal/PaginaLegal.tsx`. */
export const metadata: Metadata = {
  title: "Exclusão de Dados | CompanyChat IA Ltda",
  description:
    "Como solicitar a exclusão dos seus dados pessoais na CompanyChat IA Ltda: o que informar, para onde escrever, prazos, o que é apagado, o que a lei obriga a reter e como revogar a integração com a Meta e o WhatsApp.",
  alternates: { canonical: "/exclusao-de-dados" },
  robots: { index: true, follow: true },
};

function Passo({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light font-bold text-primary-text"
      >
        {numero}
      </span>
      <div>
        <h3 className="font-semibold text-foreground">{titulo}</h3>
        <div className="mt-1 space-y-2">{children}</div>
      </div>
    </li>
  );
}

export default function ExclusaoDeDadosPage() {
  const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}`;
  const email = `mailto:${EMAIL_PRIVACIDADE}?subject=${encodeURIComponent(
    "Exclusão de dados"
  )}`;

  return (
    <PaginaLegal
      titulo="Exclusão de Dados"
      atualizadoEm={ATUALIZADO_EXCLUSAO}
      introducao={
        <>
          <p>
            Esta página explica como pedir a exclusão dos dados pessoais
            tratados pela <Termo>{RAZAO_SOCIAL}</Termo> (CNPJ {CNPJ}) — tanto os
            dados informados no site quanto os dados relacionados à plataforma
            CompanyChat e à integração com a WhatsApp Business Platform e demais
            produtos da Meta.
          </p>
          <p>
            <Termo>
              Você não precisa de conta, login, contrato ativo ou aplicativo
              instalado para fazer o pedido.
            </Termo>{" "}
            Basta enviar um e-mail. O procedimento é gratuito.
          </p>
        </>
      }
      rodape={
        <p className="text-sm leading-relaxed text-dark-muted">
          Pronto para pedir a exclusão? Escreva para{" "}
          <a
            href={email}
            className="text-dark-link underline underline-offset-4"
          >
            {EMAIL_PRIVACIDADE}
          </a>{" "}
          com o assunto <span className="text-dark-text">Exclusão de dados</span>
          , ou{" "}
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-link underline underline-offset-4"
          >
            fale com a gente no WhatsApp
          </a>
          .
        </p>
      }
    >
      <Secao id="como-solicitar" titulo="1. Como solicitar a exclusão">
        <p>
          Envie um e-mail para{" "}
          <a
            href={email}
            className="text-primary-text underline underline-offset-4"
          >
            {EMAIL_PRIVACIDADE}
          </a>{" "}
          com o assunto <Termo>Exclusão de dados</Termo>. Se preferir, faça o
          pedido pelo{" "}
          <LinkExterno href={whatsapp}>WhatsApp +55 64 9305-4630</LinkExterno> —
          nesse caso confirmamos o pedido por e-mail para deixar registro do
          atendimento.
        </p>
        <ol className="mt-4 space-y-5">
          <Passo numero={1} titulo="Escreva para o nosso canal de privacidade">
            <p>
              Use o e-mail {EMAIL_PRIVACIDADE} com o assunto{" "}
              <Termo>Exclusão de dados</Termo>.
            </p>
          </Passo>
          <Passo numero={2} titulo="Informe os dados de identificação">
            <p>
              São os dados da seção 2 abaixo. Sem eles não conseguimos localizar
              o seu registro com segurança.
            </p>
          </Passo>
          <Passo numero={3} titulo="Diga o que quer excluir">
            <p>
              Tudo, ou apenas uma parte (por exemplo: só o cadastro de contato,
              só o histórico de conversas, só a integração com a Meta).
            </p>
          </Passo>
          <Passo numero={4} titulo="Aguarde a confirmação de recebimento">
            <p>
              Respondemos em até {PRAZO_CONFIRMACAO} confirmando que recebemos e
              informando se precisamos de algum dado a mais para localizar o
              registro.
            </p>
          </Passo>
          <Passo numero={5} titulo="Receba o comprovante da exclusão">
            <p>
              Em até {PRAZO_ATENDIMENTO} enviamos, por escrito, a confirmação do
              que foi apagado ou anonimizado e do que precisou ser mantido por
              obrigação legal.
            </p>
          </Passo>
        </ol>
      </Secao>

      <Secao
        id="identificacao"
        titulo="2. Quais informações você precisa fornecer"
      >
        <p>
          Pedimos o mínimo necessário para localizar o seu registro e ter
          certeza de que o pedido é seu. Envie o que se aplicar ao seu caso:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Nome completo</Termo> ou razão social da empresa;
          </li>
          <li>
            <Termo>E-mail</Termo> usado no cadastro, no formulário ou no
            contrato;
          </li>
          <li>
            <Termo>Número de WhatsApp</Termo> no formato internacional
            (exemplo: +55 62 90000-0000);
          </li>
          <li>
            <Termo>Nome da empresa</Termo> que atendeu você pelo WhatsApp, se
            você recebeu mensagens de um cliente nosso e não sabe onde os seus
            dados estão;
          </li>
          <li>
            <Termo>Identificador da conta do WhatsApp Business (WABA)</Termo> ou
            o número conectado à plataforma, quando o pedido for de um cliente
            CompanyChat;
          </li>
          <li>
            <Termo>Descrição do que deseja excluir</Termo> e, se souber, o
            período a que os dados se referem.
          </li>
        </ul>
        <p>
          <Termo>Não envie</Termo> senhas, tokens de acesso, códigos de
          verificação, dados bancários, cartões ou documentos de saúde. Nunca
          pedimos essas informações para atender a um pedido de exclusão. Se
          houver dúvida razoável sobre a titularidade, podemos solicitar uma
          confirmação adicional pelo mesmo e-mail ou número já cadastrado — e
          explicamos por que ela é necessária.
        </p>
      </Secao>

      <Secao id="prazos" titulo="3. Prazos">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Confirmação de recebimento:</Termo> até{" "}
            {PRAZO_CONFIRMACAO} após o seu e-mail.
          </li>
          <li>
            <Termo>Conclusão do atendimento:</Termo> até {PRAZO_ATENDIMENTO}{" "}
            contados do recebimento do pedido completo. Se o caso exigir mais
            tempo, avisamos dentro desse prazo, explicando o motivo e a nova
            previsão.
          </li>
          <li>
            <Termo>Interrupção imediata:</Termo> se o pedido incluir parar o
            contato, o bloqueio é registrado no mesmo dia útil, antes mesmo de a
            exclusão ser concluída.
          </li>
          <li>
            <Termo>Backups:</Termo> as cópias de segurança seguem o ciclo de
            rotação e são sobrescritas em até 90 dias. Nesse intervalo os dados
            ficam bloqueados para uso e são eliminados quando a cópia expira.
          </li>
        </ul>
      </Secao>

      <Secao id="o-que-e-excluido" titulo="4. Quais dados são excluídos ou anonimizados">
        <p>
          Conforme o escopo do seu pedido, eliminamos ou anonimizamos de forma
          irreversível:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Cadastro e contato:</Termo> nome, e-mail, telefone, empresa,
            segmento e demais campos informados nos nossos formulários;
          </li>
          <li>
            <Termo>Registros de campanha:</Termo> origem do acesso e parâmetros
            de anúncio associados ao seu contato;
          </li>
          <li>
            <Termo>Mensagens, mídias e histórico de conversas</Termo> ligados ao
            seu número na plataforma, incluindo os arquivos, as imagens, os
            áudios e os documentos enviados;
          </li>
          <li>
            <Termo>Contatos importados</Termo> pelo fluxo de Coexistência, quando
            o pedido for do cliente responsável por eles;
          </li>
          <li>
            <Termo>Dados da integração com a Meta:</Termo> identificadores do
            portfólio empresarial, da conta do WhatsApp Business (WABA) e dos
            números, perfil comercial, templates armazenados por nós e
            configurações de webhook;
          </li>
          <li>
            <Termo>Tokens de acesso</Termo> emitidos pela Meta, que são
            revogados junto à Meta e eliminados dos nossos sistemas;
          </li>
          <li>
            <Termo>Dados básicos recebidos pelo Facebook Login for Business:</Termo>{" "}
            identificador do usuário, nome e foto do perfil público guardados
            para registrar quem autorizou a conexão.
          </li>
        </ul>
        <p>
          Quando a exclusão total inviabilizar registros estatísticos legítimos,
          os dados são <Termo>anonimizados</Termo>: perdem qualquer vínculo com
          você e não podem mais ser revertidos a uma pessoa identificável.
        </p>
        <p>
          Se você é <Termo>cliente contratante</Termo> e quer guardar o
          histórico antes de apagar, peça a exportação no mesmo e-mail —
          entregamos os dados em formato legível por máquina antes de executar a
          exclusão.
        </p>
      </Secao>

      <Secao id="retencao-legal" titulo="5. O que pode precisar ser retido">
        <p>
          A LGPD permite conservar alguns dados mesmo após um pedido de
          exclusão. Nesses casos eles ficam bloqueados para qualquer outra
          finalidade e são eliminados quando o prazo vence. São eles:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Registros de acesso a aplicação de internet:</Termo> 6 meses,
            por exigência do art. 15 do Marco Civil da Internet (Lei nº
            12.965/2014);
          </li>
          <li>
            <Termo>Documentos fiscais, contábeis e contratuais:</Termo> 5 anos,
            conforme a legislação tributária e a prescrição das obrigações
            civis;
          </li>
          <li>
            <Termo>Registro do pedido de exclusão e do opt-out:</Termo>{" "}
            mantemos o mínimo necessário (um identificador do contato e a data)
            para comprovar o atendimento e para impedir que uma nova importação
            volte a incluir você;
          </li>
          <li>
            <Termo>Dados necessários ao exercício regular de direitos</Termo> em
            processo judicial, administrativo ou arbitral em curso, até o
            encerramento do processo.
          </li>
        </ul>
        <p>
          Na confirmação da exclusão informamos exatamente qual desses casos se
          aplicou ao seu pedido, se algum se aplicou.
        </p>
      </Secao>

      <Secao id="dados-de-cliente" titulo="6. Se os seus dados estão com uma empresa cliente">
        <p>
          Quando você conversa pelo WhatsApp com uma empresa que usa a
          CompanyChat, quem decide o que é feito com aquelas mensagens é essa
          empresa — ela é a controladora, e nós somos operadores dela. Nesse
          cenário:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            você pode escrever direto para nós que{" "}
            <Termo>encaminhamos o pedido</Termo> à empresa responsável e
            acompanhamos o atendimento;
          </li>
          <li>
            se a empresa autorizar ou nos instruir, executamos a exclusão
            diretamente na plataforma;
          </li>
          <li>
            avisamos você por e-mail sobre para quem o pedido foi encaminhado e
            qual foi o desfecho.
          </li>
        </ul>
      </Secao>

      <Secao id="revogar" titulo="7. Como desconectar ou revogar a integração com a Meta">
        <p>
          Revogar a integração e excluir dados são coisas diferentes: a
          revogação interrompe o acesso daqui para a frente, e a exclusão apaga
          o que já foi armazenado. Você pode pedir as duas ao mesmo tempo.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Pela CompanyChat:</Termo> peça a desconexão pelo e-mail{" "}
            <a
              href={email}
              className="text-primary-text underline underline-offset-4"
            >
              {EMAIL_PRIVACIDADE}
            </a>{" "}
            ou pelo suporte. Revogamos o token de acesso junto à Meta,
            cancelamos a assinatura dos webhooks e desvinculamos o número da
            plataforma.
          </li>
          <li>
            <Termo>Pelo Gerenciador de Negócios da Meta:</Termo> acesse{" "}
            <LinkExterno href="https://business.facebook.com/settings">
              business.facebook.com/settings
            </LinkExterno>
            , abra <Termo>Contas → Contas do WhatsApp</Termo>, selecione a sua
            conta, vá em <Termo>Aplicativos</Termo> e remova o aplicativo da
            CompanyChat.
          </li>
          <li>
            <Termo>Pelas configurações da sua conta Meta:</Termo> em{" "}
            <Termo>Configurações → Aplicativos e sites</Termo>, remova a
            autorização concedida à CompanyChat pelo Facebook Login for
            Business.
          </li>
          <li>
            <Termo>Se você usa Coexistência:</Termo> desvincular o número
            encerra a sincronização com o aplicativo WhatsApp Business. O
            aplicativo no seu celular continua funcionando normalmente; o que
            para é a cópia das conversas para a plataforma.
          </li>
        </ul>
        <p>
          Depois de revogar, envie o pedido de exclusão para apagar o que já
          havia sido armazenado — a revogação sozinha não apaga o histórico.
        </p>
      </Secao>

      <Secao id="confirmacao" titulo="8. Como você recebe a confirmação">
        <p>
          A confirmação chega <Termo>por e-mail</Termo>, no mesmo endereço que
          você usou para pedir (ou no endereço que você indicar), e contém:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>a data em que a exclusão foi executada;</li>
          <li>
            as categorias de dados que foram eliminadas ou anonimizadas;
          </li>
          <li>
            o que foi retido, por qual base legal e até quando ficará retido;
          </li>
          <li>
            a informação sobre a revogação do token e a desconexão da integração
            com a Meta, quando o pedido incluir isso;
          </li>
          <li>
            um número de protocolo do atendimento, para você referenciar em
            qualquer contato futuro.
          </li>
        </ul>
        <p>
          Se você não receber a confirmação dentro do prazo, responda ao mesmo
          e-mail cobrando: reabrimos o protocolo e priorizamos o caso. Você
          também pode apresentar reclamação à{" "}
          <LinkExterno href="https://www.gov.br/anpd/pt-br">
            Autoridade Nacional de Proteção de Dados (ANPD)
          </LinkExterno>
          .
        </p>
      </Secao>

      <Secao id="mais" titulo="9. Documentos relacionados">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <LinkInterno href="/privacidade">
              Política de Privacidade
            </LinkInterno>{" "}
            — quais dados tratamos, por quê, com quem compartilhamos e por
            quanto tempo guardamos.
          </li>
          <li>
            <LinkInterno href="/termos">Termos de Serviço</LinkInterno> — regras
            de uso da plataforma e responsabilidades de cada parte.
          </li>
        </ul>
      </Secao>
    </PaginaLegal>
  );
}
