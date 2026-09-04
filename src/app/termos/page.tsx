import type { Metadata } from "next";
import PaginaLegal, {
  LinkExterno,
  LinkInterno,
  Secao,
  Termo,
} from "@/components/legal/PaginaLegal";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import {
  ATUALIZADO_TERMOS,
  CIDADE_SEDE,
  CNPJ,
  EMAIL_CONTATO,
  RAZAO_SOCIAL,
} from "@/lib/legal";

/* Termos de Serviço. É a URL cadastrada no campo "Terms of Service URL" do
   aplicativo da Meta, e precisa cobrir o que a revisão espera de um provedor
   integrado à WhatsApp Business Platform: consentimento do destinatário,
   proibição de spam, regras de template e janela de 24h, e o fato de que uma
   suspensão pela Meta pode interromper o serviço.

   Responde 200 direto, sem autenticação e sem redirecionamento — mesma
   exigência das outras duas páginas jurídicas.

   Sobre cores: a página é **clara**. Ver o comentário em
   `components/legal/PaginaLegal.tsx`. */
export const metadata: Metadata = {
  title: "Termos de Serviço | CompanyChat IA Ltda",
  description:
    "Condições de uso da plataforma CompanyChat: contratação, responsabilidades do cliente, regras da WhatsApp Business Platform e da Meta, templates e janela de 24 horas, suspensão por uso indevido, propriedade intelectual, limitação de responsabilidade e cancelamento.",
  alternates: { canonical: "/termos" },
  robots: { index: true, follow: true },
};

export default function TermosPage() {
  const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}`;
  const email = `mailto:${EMAIL_CONTATO}`;

  return (
    <PaginaLegal
      titulo="Termos de Serviço"
      atualizadoEm={ATUALIZADO_TERMOS}
      introducao={
        <>
          <p>
            Estes Termos regem o uso do site{" "}
            <Termo>www.companychatia.com.br</Termo> e da plataforma{" "}
            <Termo>CompanyChat</Termo>, fornecidos pela{" "}
            <Termo>{RAZAO_SOCIAL}</Termo>, inscrita no CNPJ {CNPJ}, com sede em{" "}
            {CIDADE_SEDE} (&quot;CompanyChat&quot;, &quot;nós&quot;).
          </p>
          <p>
            Ao contratar, acessar ou usar a plataforma, você (&quot;Cliente&quot;)
            declara que leu, entendeu e concorda com estes Termos e com a{" "}
            <LinkInterno href="/privacidade">
              Política de Privacidade
            </LinkInterno>
            . Se você aceita em nome de uma empresa, declara ter poderes para
            obrigá-la.
          </p>
        </>
      }
      rodape={
        <p className="text-sm leading-relaxed text-dark-muted">
          Dúvidas sobre estes Termos? Escreva para{" "}
          <a
            href={email}
            className="text-dark-link underline underline-offset-4"
          >
            {EMAIL_CONTATO}
          </a>{" "}
          ou{" "}
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
      <Secao id="objeto" titulo="1. O que a CompanyChat oferece">
        <p>
          A CompanyChat é uma plataforma de atendimento e automação de
          conversas no WhatsApp. Conforme o plano contratado, ela pode incluir:
          integração com a WhatsApp Business Platform (API Oficial), caixa de
          entrada compartilhada entre atendentes, agente de inteligência
          artificial, gestão de contatos e funil, envio de campanhas com
          templates aprovados e relatórios operacionais.
        </p>
        <p>
          O escopo, os limites de uso, os prazos e os valores de cada
          contratação são os definidos na proposta comercial ou no contrato
          firmado com o Cliente. Em caso de divergência, prevalece o contrato
          específico; estes Termos se aplicam de forma complementar.
        </p>
        <p>
          A CompanyChat é uma empresa independente. Não somos a Meta Platforms
          nem o WhatsApp, e não falamos por eles.
        </p>
      </Secao>

      <Secao id="conta" titulo="2. Cadastro, conta e proteção de credenciais">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            O Cliente é responsável pela veracidade dos dados cadastrais e por
            mantê-los atualizados.
          </li>
          <li>
            O acesso é pessoal e intransferível. O Cliente deve criar um usuário
            para cada pessoa da equipe e não compartilhar o mesmo login.
          </li>
          <li>
            <Termo>Guarde as suas credenciais.</Termo> Senhas, tokens de acesso,
            chaves de API e segredos de webhook não devem ser publicados em
            repositórios, planilhas compartilhadas, grupos de mensagem, prints
            ou chamados de suporte. Nós nunca pedimos a sua senha.
          </li>
          <li>
            Todas as ações realizadas com as credenciais do Cliente são
            atribuídas a ele. Suspeita de comprometimento deve ser comunicada
            imediatamente a{" "}
            <a
              href={email}
              className="text-primary-text underline underline-offset-4"
            >
              {EMAIL_CONTATO}
            </a>
            , e o acesso será bloqueado até a regularização.
          </li>
          <li>
            O Cliente deve revogar o acesso de pessoas que deixarem a equipe.
          </li>
        </ul>
      </Secao>

      <Secao id="meta" titulo="3. Integração com a WhatsApp Business Platform e a Meta">
        <p>
          Para usar a API Oficial, o Cliente conecta a sua conta pelo fluxo de
          <Termo> Embedded Signup</Termo>, autorizando a CompanyChat a gerenciar
          a conta do WhatsApp Business (WABA), os números, o perfil comercial,
          os templates e os webhooks, e a enviar e receber mensagens em nome
          dele. Quando o Cliente opta pela <Termo>Coexistência</Termo>, o
          aplicativo WhatsApp Business e a plataforma passam a operar no mesmo
          número, e a sincronização de contatos e histórico só ocorre com
          autorização expressa no momento da conexão.
        </p>
        <p>Ao usar a integração, o Cliente reconhece e aceita que:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            está sujeito, além destes Termos, aos{" "}
            <LinkExterno href="https://business.whatsapp.com/policy">
              Termos e Políticas Comerciais do WhatsApp
            </LinkExterno>{" "}
            e às{" "}
            <LinkExterno href="https://developers.facebook.com/terms/">
              políticas para desenvolvedores da Meta
            </LinkExterno>
            ;
          </li>
          <li>
            a aprovação da conta, a verificação do negócio, a aprovação de
            templates, os limites de envio, a classificação de qualidade e a
            manutenção do número são decisões da Meta, não nossas;
          </li>
          <li>
            a Meta pode restringir, rebaixar a qualidade, suspender ou banir uma
            conta ou um número por violação das políticas dela, e essa decisão
            interrompe o serviço enquanto durar;
          </li>
          <li>
            o custo por conversa ou por mensagem é definido e cobrado pela Meta
            conforme a tabela vigente dela, que pode mudar sem a nossa
            interferência;
          </li>
          <li>
            a CompanyChat não garante aprovação de conta, de número ou de
            template, nem reverte decisões da Meta.
          </li>
        </ul>
      </Secao>

      <Secao id="responsabilidades" titulo="4. Responsabilidades do Cliente">
        <p>
          O Cliente é o responsável pelo conteúdo que envia, pelas listas que
          utiliza e pelo relacionamento com os destinatários. Cabe a ele:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            usar a plataforma apenas para finalidades lícitas e compatíveis com
            a sua atividade;
          </li>
          <li>
            obter e conseguir comprovar o <Termo>consentimento</Termo> ou outra
            base legal válida de cada destinatário antes de enviar mensagens,
            especialmente as de marketing;
          </li>
          <li>
            identificar-se claramente como empresa na conversa e informar ao
            destinatário como parar de receber mensagens;
          </li>
          <li>
            atender aos pedidos de descadastramento (opt-out) imediatamente e
            não voltar a contatar quem pediu para parar;
          </li>
          <li>
            manter as suas próprias políticas de privacidade e termos, quando a
            legislação exigir, e atuar como controlador dos dados dos seus
            clientes finais;
          </li>
          <li>
            revisar as respostas do agente de inteligência artificial e a base
            de conhecimento que o alimenta — o Cliente é responsável pelo que a
            automação diz em nome dele;
          </li>
          <li>
            não enviar dados pessoais sensíveis, dados de crianças e
            adolescentes ou informações sigilosas sem base legal própria e sem
            as salvaguardas necessárias;
          </li>
          <li>
            pagar pontualmente os valores contratados e os custos de mensagem
            cobrados pela Meta.
          </li>
        </ul>
      </Secao>

      <Secao id="uso-proibido" titulo="5. Uso proibido: spam e violação das políticas da Meta">
        <p>É expressamente proibido usar a plataforma para:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            enviar <Termo>spam</Termo>, mensagens em massa não solicitadas,
            correntes ou disparos para listas compradas, alugadas, raspadas de
            sites ou obtidas sem consentimento;
          </li>
          <li>
            praticar phishing, golpe, fraude, engenharia social ou se passar por
            outra pessoa, empresa, órgão público ou pela própria CompanyChat;
          </li>
          <li>
            divulgar conteúdo ilegal, enganoso, difamatório, discriminatório, de
            ódio, violento ou que viole direitos de terceiros;
          </li>
          <li>
            comercializar produtos e serviços proibidos pelas{" "}
            <LinkExterno href="https://business.whatsapp.com/policy">
              Políticas Comerciais do WhatsApp
            </LinkExterno>{" "}
            — entre eles armas, drogas, produtos de tabaco, suplementos
            controlados, jogos de azar não autorizados e serviços financeiros
            irregulares;
          </li>
          <li>
            burlar limites de envio, criar contas em série, mascarar a
            identidade do remetente ou contornar bloqueios aplicados pela Meta
            ou por nós;
          </li>
          <li>
            realizar engenharia reversa, copiar, revender ou sublicenciar a
            plataforma sem autorização escrita;
          </li>
          <li>
            executar testes de intrusão, varreduras, sobrecarga intencional ou
            qualquer ação que comprometa a segurança e a disponibilidade do
            serviço para os demais clientes.
          </li>
        </ul>
        <p>
          Denúncias de uso indevido podem ser enviadas a{" "}
          <a
            href={email}
            className="text-primary-text underline underline-offset-4"
          >
            {EMAIL_CONTATO}
          </a>
          .
        </p>
      </Secao>

      <Secao id="templates" titulo="6. Templates e janela de atendimento">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Janela de 24 horas:</Termo> quando o cliente final envia uma
            mensagem, abre-se uma janela de 24 horas em que a empresa pode
            responder livremente, em qualquer formato. Fora dessa janela, só é
            possível iniciar a conversa com um <Termo>template aprovado</Termo>{" "}
            pela Meta.
          </li>
          <li>
            <Termo>Categorias:</Termo> cada template é classificado pela Meta
            como utilidade, autenticação ou marketing, e a categoria define o
            preço da conversa. A resposta dentro da janela é da categoria
            serviço.
          </li>
          <li>
            <Termo>Aprovação:</Termo> a análise e a aprovação de templates são
            feitas pela Meta, com prazo e critério dela. Templates podem ser
            rejeitados, pausados ou desativados a qualquer momento por baixa
            qualidade ou por reclamações dos destinatários.
          </li>
          <li>
            <Termo>Qualidade:</Termo> bloqueios e denúncias feitos pelos
            destinatários reduzem a classificação de qualidade do número e podem
            derrubar o limite de envio. O Cliente é responsável pela relevância
            do que envia.
          </li>
          <li>
            O Cliente não deve usar templates de utilidade ou de autenticação
            para conteúdo promocional. Além de violar as políticas da Meta, essa
            prática costuma resultar em recategorização ou rejeição.
          </li>
        </ul>
      </Secao>

      <Secao id="disponibilidade" titulo="7. Disponibilidade e serviços de terceiros">
        <p>
          Trabalhamos para manter a plataforma disponível e estável, mas o
          serviço depende de terceiros que não controlamos — a WhatsApp Business
          Platform e demais APIs da Meta, provedores de nuvem, provedores de
          modelos de inteligência artificial, operadoras e a própria conexão do
          Cliente.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Indisponibilidades, lentidão, alterações de API, mudanças de
            política, aumento de preço ou suspensão de conta por parte desses
            terceiros podem afetar o serviço, e não configuram descumprimento
            por parte da CompanyChat.
          </li>
          <li>
            Podemos realizar manutenções programadas, avisando com antecedência
            razoável sempre que possível, e manutenções emergenciais quando
            houver risco à segurança ou à integridade dos dados.
          </li>
          <li>
            Podemos evoluir, alterar ou descontinuar funcionalidades. Mudanças
            que reduzam de forma relevante o que foi contratado são comunicadas
            com antecedência ao Cliente.
          </li>
          <li>
            Salvo nível de serviço (SLA) expressamente pactuado em contrato, a
            plataforma é fornecida sem garantia de disponibilidade ininterrupta.
          </li>
          <li>
            Respostas geradas por inteligência artificial são probabilísticas e
            podem conter erro. Elas não substituem orientação profissional, e o
            Cliente deve supervisioná-las nos fluxos em que houver risco.
          </li>
        </ul>
      </Secao>

      <Secao id="dados" titulo="8. Dados pessoais">
        <p>
          Em relação aos dados dos clientes finais que trafegam nas conversas, o
          Cliente é o <Termo>controlador</Termo> e a CompanyChat é a{" "}
          <Termo>operadora</Termo>, tratando esses dados conforme as instruções
          do Cliente e o contrato. Em relação aos dados de cadastro, cobrança e
          configuração da conta, a CompanyChat é controladora.
        </p>
        <p>
          O detalhamento de quais dados são tratados, com quem são
          compartilhados, por quanto tempo são guardados e como exercer direitos
          está na{" "}
          <LinkInterno href="/privacidade">Política de Privacidade</LinkInterno>
          . Pedidos de exclusão seguem o procedimento da página de{" "}
          <LinkInterno href="/exclusao-de-dados">Exclusão de Dados</LinkInterno>
          .
        </p>
      </Secao>

      <Secao id="suspensao" titulo="9. Suspensão e rescisão por uso indevido">
        <p>
          Podemos suspender ou encerrar o acesso, no todo ou em parte, sem
          reembolso proporcional às sanções aplicadas, quando houver:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>violação destes Termos ou das políticas da Meta e do WhatsApp;</li>
          <li>
            indícios consistentes de spam, fraude, golpe ou uso ilícito da
            plataforma;
          </li>
          <li>
            volume anormal de bloqueios e denúncias que ameace a integridade da
            operação ou de outros clientes;
          </li>
          <li>
            risco à segurança da plataforma ou determinação de autoridade
            competente;
          </li>
          <li>inadimplência não regularizada após notificação.</li>
        </ul>
        <p>
          Sempre que a urgência permitir, notificamos antes e damos prazo para
          correção. Em risco iminente — segurança, fraude ou ordem da Meta ou de
          autoridade — a suspensão é imediata, e a comunicação vem em seguida.
          Regularizada a causa, o acesso é restabelecido.
        </p>
      </Secao>

      <Secao id="propriedade" titulo="10. Propriedade intelectual">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            A plataforma, o software, a interface, a documentação, a marca
            CompanyChat, os logotipos e os materiais do site são de titularidade
            da {RAZAO_SOCIAL} ou de seus licenciantes, e permanecem assim. O
            contrato concede ao Cliente uma licença de uso limitada, não
            exclusiva, intransferível e revogável durante a vigência.
          </li>
          <li>
            O conteúdo do Cliente — mensagens, contatos, arquivos, base de
            conhecimento e configurações — continua sendo dele. O Cliente nos
            concede apenas a licença necessária para hospedar, processar,
            transmitir e exibir esse conteúdo na operação do serviço e no
            suporte que ele solicitar.
          </li>
          <li>
            WhatsApp, Meta, Facebook e Instagram são marcas de titularidade da
            Meta Platforms, citadas aqui apenas para identificar as integrações.
          </li>
          <li>
            Sugestões e feedbacks enviados pelo Cliente podem ser usados para
            melhorar o produto, sem que isso gere obrigação de pagamento ou
            cessão de direitos sobre o conteúdo dele.
          </li>
        </ul>
      </Secao>

      <Secao id="limitacao" titulo="11. Limitação de responsabilidade">
        <p>
          Nos limites permitidos pela legislação aplicável, e ressalvados os
          direitos assegurados ao consumidor pelo Código de Defesa do
          Consumidor quando ele for aplicável:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            a CompanyChat não responde por lucros cessantes, perda de
            oportunidade, perda de dados causada por ato do Cliente ou de
            terceiros, nem por danos indiretos;
          </li>
          <li>
            a CompanyChat não responde por decisões, sanções, suspensões,
            bloqueios ou mudanças de preço aplicados pela Meta, pelo WhatsApp ou
            por outros provedores;
          </li>
          <li>
            a CompanyChat não responde pelo conteúdo enviado pelo Cliente, pelas
            listas que ele utiliza, pelo consentimento dos destinatários nem
            pelas consequências do uso indevido da plataforma;
          </li>
          <li>
            a responsabilidade total da CompanyChat, por qualquer causa, fica
            limitada ao valor efetivamente pago pelo Cliente nos 12 meses
            anteriores ao evento que originou a demanda.
          </li>
        </ul>
        <p>
          O Cliente concorda em manter a CompanyChat indene de reclamações de
          terceiros decorrentes do conteúdo que ele enviou ou do uso da
          plataforma em desacordo com estes Termos e com as políticas da Meta.
        </p>
      </Secao>

      <Secao id="cancelamento" titulo="12. Cancelamento">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            O Cliente pode cancelar a qualquer momento, comunicando por escrito
            a{" "}
            <a
              href={email}
              className="text-primary-text underline underline-offset-4"
            >
              {EMAIL_CONTATO}
            </a>{" "}
            ou pelo canal de suporte, respeitados o prazo de aviso prévio e as
            condições do contrato firmado.
          </li>
          <li>
            Valores já vencidos ou referentes a mensagens já enviadas permanecem
            devidos. Não há devolução de mensagens não utilizadas, salvo
            previsão em contrário no contrato.
          </li>
          <li>
            Antes do encerramento, o Cliente pode solicitar a{" "}
            <Termo>exportação</Termo> dos seus dados em formato legível por
            máquina. Mantemos os dados disponíveis para exportação por até 90
            dias após o encerramento; depois disso, são eliminados conforme a{" "}
            <LinkInterno href="/privacidade">
              Política de Privacidade
            </LinkInterno>
            .
          </li>
          <li>
            No encerramento, revogamos o token de acesso junto à Meta, cancelamos
            a assinatura dos webhooks e desvinculamos o número. A conta do
            WhatsApp Business e o número continuam sendo do Cliente, que pode
            conectá-los a outro provedor.
          </li>
        </ul>
      </Secao>

      <Secao id="alteracoes" titulo="13. Alterações destes Termos">
        <p>
          Podemos alterar estes Termos para refletir mudanças no produto, nas
          políticas da Meta ou na legislação. A data de última atualização no
          topo da página indica a versão vigente. Alterações relevantes são
          comunicadas aos clientes ativos com antecedência razoável, e o uso
          continuado da plataforma após a entrada em vigor significa
          concordância. Quem não concordar pode cancelar conforme a seção 12.
        </p>
      </Secao>

      <Secao id="legislacao" titulo="14. Legislação aplicável e contato">
        <p>
          Estes Termos são regidos pelas leis da República Federativa do Brasil,
          em especial o Código Civil, o Código de Defesa do Consumidor (quando
          aplicável), o Marco Civil da Internet (Lei nº 12.965/2014) e a Lei
          Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
        </p>
        <p>
          Fica eleito o foro da comarca de Goiânia, Estado de Goiás, para
          dirimir controvérsias, ressalvado o direito do consumidor de ajuizar a
          ação no foro do seu domicílio.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Razão social:</Termo> {RAZAO_SOCIAL}
          </li>
          <li>
            <Termo>CNPJ:</Termo> {CNPJ}
          </li>
          <li>
            <Termo>Sede:</Termo> {CIDADE_SEDE}
          </li>
          <li>
            <Termo>E-mail:</Termo>{" "}
            <a
              href={email}
              className="text-primary-text underline underline-offset-4"
            >
              {EMAIL_CONTATO}
            </a>
          </li>
          <li>
            <Termo>WhatsApp:</Termo>{" "}
            <LinkExterno href={whatsapp}>+55 64 9305-4630</LinkExterno>
          </li>
        </ul>
        <p>
          <Termo>Última atualização:</Termo> {ATUALIZADO_TERMOS}.
        </p>
      </Secao>
    </PaginaLegal>
  );
}
