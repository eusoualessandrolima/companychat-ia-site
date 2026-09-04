import type { Metadata } from "next";
import PaginaLegal, {
  LinkExterno,
  LinkInterno,
  Secao,
  Termo,
} from "@/components/legal/PaginaLegal";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import {
  ATUALIZADO_PRIVACIDADE,
  CIDADE_SEDE,
  CNPJ,
  DPO_NOME,
  EMAIL_PRIVACIDADE,
  PRAZO_ATENDIMENTO,
  PRAZO_CONFIRMACAO,
  RAZAO_SOCIAL,
} from "@/lib/legal";

/* Política de privacidade. Ela atende a dois públicos ao mesmo tempo:
   - a revisão de anúncios da Meta, que confere a página de destino das LPs de
     captura (nome, telefone e segmento);
   - a revisão do aplicativo da Meta (WhatsApp Business Platform), que exige
     que a URL da política descreva o tratamento dos dados obtidos pelas
     permissões `whatsapp_business_management`, `whatsapp_business_messaging` e
     `public_profile`, e pelos produtos Facebook Login for Business, Embedded
     Signup e Coexistência.

   O envio anterior foi reprovado porque a URL cadastrada apontava para a
   página inicial. Esta rota responde 200 direto, sem autenticação, sem cookie
   obrigatório e sem redirecionamento — não mexa nisso.

   O texto separa os dois papéis da empresa (controladora dos dados da conta e
   do site; operadora dos dados que trafegam nas conversas do cliente). Essa
   distinção é o que sustenta as bases legais e os prazos descritos abaixo.

   Sobre cores: a página é **clara**. Ver o comentário em
   `components/legal/PaginaLegal.tsx`. */
export const metadata: Metadata = {
  title: "Política de Privacidade | CompanyChat IA Ltda",
  description:
    "Como a CompanyChat IA Ltda coleta, usa, compartilha, armazena e protege dados pessoais na plataforma CompanyChat e nas integrações com a WhatsApp Business Platform e demais produtos da Meta.",
  alternates: { canonical: "/privacidade" },
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}`;
  const email = `mailto:${EMAIL_PRIVACIDADE}`;

  return (
    <PaginaLegal
      titulo="Política de Privacidade"
      atualizadoEm={ATUALIZADO_PRIVACIDADE}
      introducao={
        <>
          <p>
            Esta política descreve como a <Termo>{RAZAO_SOCIAL}</Termo> trata
            dados pessoais no site{" "}
            <Termo>www.companychatia.com.br</Termo>, na plataforma{" "}
            <Termo>CompanyChat</Termo> e nas integrações com a{" "}
            <Termo>WhatsApp Business Platform</Termo> e demais produtos da Meta
            Platforms. Ela segue a Lei Geral de Proteção de Dados Pessoais (Lei
            nº 13.709/2018 — LGPD) e as políticas para desenvolvedores da Meta.
          </p>
          <p>
            Você também pode consultar os{" "}
            <LinkInterno href="/termos">Termos de Serviço</LinkInterno> e a
            página de{" "}
            <LinkInterno href="/exclusao-de-dados">
              Exclusão de Dados
            </LinkInterno>
            , que explica passo a passo como pedir a remoção das suas
            informações.
          </p>
        </>
      }
      rodape={
        <p className="text-sm leading-relaxed text-dark-muted">
          Ficou com alguma dúvida sobre o uso dos seus dados? Escreva para{" "}
          <a
            href={email}
            className="text-dark-link underline underline-offset-4"
          >
            {EMAIL_PRIVACIDADE}
          </a>{" "}
          ou{" "}
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            /* Este bloco é o único da página em superfície escura, então o
               verde aqui é o claro: o `primary-text` daria 2,35:1. */
            className="text-dark-link underline underline-offset-4"
          >
            fale com a gente no WhatsApp
          </a>
          .
        </p>
      }
    >
      <Secao id="controlador" titulo="1. Identificação do controlador">
        <p>
          <Termo>{RAZAO_SOCIAL}</Termo>, inscrita no CNPJ {CNPJ}, com sede em{" "}
          {CIDADE_SEDE}, é a responsável por decidir como e por que os dados
          pessoais descritos nesta política são tratados.
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
            <Termo>Site:</Termo> www.companychatia.com.br
          </li>
          <li>
            <Termo>Contato para privacidade:</Termo>{" "}
            <a
              href={email}
              className="text-primary-text underline underline-offset-4"
            >
              {EMAIL_PRIVACIDADE}
            </a>
          </li>
        </ul>
      </Secao>

      <Secao id="papeis" titulo="2. Em que papel atuamos">
        <p>
          A CompanyChat trata dados pessoais em duas posições diferentes, e os
          seus direitos são exercidos de forma distinta em cada uma delas.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Como controladora:</Termo> dos dados de quem visita o site,
            preenche os nossos formulários, fala com o nosso comercial e dos
            dados cadastrais e de configuração das contas dos nossos clientes —
            inclusive os identificadores obtidos da Meta para conectar a
            integração.
          </li>
          <li>
            <Termo>Como operadora:</Termo> dos dados que trafegam nas conversas
            que o nosso cliente mantém com os clientes dele pelo WhatsApp. Esses
            dados são tratados por nossa conta e ordem do cliente, que é o
            controlador deles e define finalidade, retenção e a resposta aos
            titulares. Nesse caso, encaminhamos a sua solicitação à empresa
            responsável e a apoiamos no atendimento.
          </li>
        </ul>
        <p>
          Se você recebeu uma mensagem de uma empresa que usa a CompanyChat e
          quer saber por que, fale primeiro com essa empresa. Se não souber
          quem é, escreva para nós que identificamos e encaminhamos.
        </p>
      </Secao>

      <Secao id="dados" titulo="3. Dados que coletamos">
        <p>
          <Termo>Dados que você informa nos formulários do site:</Termo> nome,
          e-mail, nome da empresa ou clínica, endereço do site, número de
          WhatsApp e o segmento de atuação escolhido. Em alguns formulários
          também perguntamos sobre o tamanho da equipe e o volume de mensagens
          recebidas.
        </p>
        <p>
          <Termo>Registro do consentimento:</Termo> quando você marca a
          autorização para receber o nosso contato pelo WhatsApp, guardamos a
          data, a hora e a versão do texto que você aceitou.
        </p>
        <p>
          <Termo>Dados de conta e cobrança do cliente:</Termo> dados de contato
          das pessoas autorizadas a usar a plataforma, dados cadastrais da
          empresa contratante e os dados necessários à emissão de nota fiscal e
          à cobrança.
        </p>
        <p>
          <Termo>Dados básicos do usuário fornecidos pela Meta:</Termo> ao
          conectar a integração usando o Facebook Login for Business, recebemos
          da Meta o identificador do usuário no aplicativo, o nome e a foto do
          perfil público (permissão <code>public_profile</code>), apenas para
          registrar quem autorizou a conexão. Não recebemos a sua senha do
          Facebook nem acesso ao seu perfil pessoal, à sua lista de amigos ou
          às suas publicações.
        </p>
        <p>
          <Termo>Identificadores do portfólio empresarial:</Termo> o
          identificador do portfólio empresarial (Business Portfolio / conta do
          Gerenciador de Negócios) e o nome do negócio, usados para vincular a
          integração à empresa correta.
        </p>
        <p>
          <Termo>
            Identificadores e informações da conta do WhatsApp Business (WABA):
          </Termo>{" "}
          o identificador da WABA, o nome da conta, o fuso horário, a moeda, o
          status de verificação do negócio, os limites de envio e as
          notificações de qualidade e de restrição enviadas pela Meta.
        </p>
        <p>
          <Termo>
            Identificadores e informações dos números de telefone:
          </Termo>{" "}
          o identificador do número na plataforma, o número no formato
          internacional, o nome de exibição verificado, a classificação de
          qualidade, o status de verificação e o limite de mensagens do número.
        </p>
        <p>
          <Termo>Perfil comercial do WhatsApp:</Termo> descrição da empresa,
          endereço, e-mail, endereço do site, categoria do negócio e imagem do
          perfil — o conteúdo que aparece para quem abre a conversa.
        </p>
        <p>
          <Termo>Modelos de mensagem e respectivos status:</Termo> o nome, o
          idioma, a categoria, o conteúdo e as variáveis dos templates, além do
          status de aprovação, rejeição, pausa ou desativação atribuído pela
          Meta e da classificação de qualidade de cada um.
        </p>
        <p>
          <Termo>Configurações e eventos de webhooks:</Termo> a URL de
          recebimento, os campos assinados, os eventos entregues pela Meta
          (status de envio, entrega, leitura e falha; mensagens recebidas;
          alterações de template, de qualidade e de conta) e os registros
          técnicos de recebimento e de reentrega desses eventos.
        </p>
        <p>
          <Termo>
            Mensagens, contatos, mídias e histórico de conversas:
          </Termo>{" "}
          o conteúdo das mensagens trocadas entre a empresa cliente e os
          clientes dela — texto, arquivos, imagens, áudios, vídeos e documentos
          —, o número e o nome de perfil de quem envia, os horários e os
          comprovantes de entrega e leitura. No fluxo de{" "}
          <Termo>Coexistência</Termo>, quando o cliente autoriza expressamente
          no momento da conexão, a Meta também sincroniza a lista de contatos e
          o histórico recente de conversas do aplicativo WhatsApp Business para
          que o atendimento continue de onde parou.
        </p>
        <p>
          <Termo>
            Dados técnicos necessários à autenticação e ao funcionamento da
            integração:
          </Termo>{" "}
          os tokens de acesso emitidos pela Meta, os identificadores do
          aplicativo e da assinatura do webhook, os registros de data e hora das
          chamadas às APIs, os códigos de erro devolvidos pela Meta e os
          registros de acesso à aplicação (endereço IP, data e hora), estes
          últimos por exigência do Marco Civil da Internet.
        </p>
        <p>
          <Termo>Dados coletados automaticamente no site:</Termo> a página em
          que você estava, o site de origem e os parâmetros de campanha
          presentes no endereço (como <code>utm_source</code>,{" "}
          <code>utm_campaign</code>, <code>gclid</code>, <code>fbclid</code> e{" "}
          <code>msclkid</code>), que nos indicam por qual anúncio você chegou.
        </p>
        <p>
          <Termo>Não solicitamos</Termo> dados de saúde, dados de pacientes,
          documentos de identidade, dados bancários ou qualquer outra
          informação sensível pelos formulários deste site, e pedimos que você
          também não os envie. Nas conversas conduzidas pelos nossos clientes,
          o conteúdo é definido por eles: cabe a cada cliente não solicitar
          dados sensíveis sem base legal própria.
        </p>
      </Secao>

      <Secao id="obtencao" titulo="4. Como os dados são obtidos">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Diretamente de você,</Termo> quando preenche um formulário do
            site, responde a uma mensagem nossa, contrata a plataforma ou fala
            com o nosso suporte.
          </li>
          <li>
            <Termo>Da Meta, com a sua autorização,</Termo> durante o{" "}
            <Termo>WhatsApp Embedded Signup</Termo>: o fluxo é aberto por você
            dentro da plataforma, exibe exatamente quais permissões estão sendo
            concedidas e só devolve dados à CompanyChat depois que você conclui
            a autorização.
          </li>
          <li>
            <Termo>Das APIs da Meta,</Termo> por consultas autorizadas pelo
            token concedido no passo anterior, para ler e manter o estado da
            integração (contas, números, perfil comercial e templates).
          </li>
          <li>
            <Termo>Dos webhooks da Meta,</Termo> que nos entregam em tempo real
            as mensagens recebidas, os status de envio e as alterações de conta,
            de número e de template.
          </li>
          <li>
            <Termo>
              Do aplicativo WhatsApp Business, no fluxo de Coexistência,
            </Termo>{" "}
            quando o cliente autoriza a sincronização de contatos e do histórico
            recente de conversas durante a conexão.
          </li>
          <li>
            <Termo>Automaticamente,</Termo> pelo uso do site e da plataforma
            (parâmetros de campanha, registros de acesso e registros técnicos de
            operação).
          </li>
        </ul>
      </Secao>

      <Secao id="finalidades" titulo="5. Finalidades do tratamento">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Entrar em contato por WhatsApp para apresentar a solução, liberar a
            demonstração do nosso agente de IA e responder às suas dúvidas.
          </li>
          <li>
            Personalizar a demonstração de acordo com o segmento e o porte que
            você informou.
          </li>
          <li>
            Conectar, configurar e manter a integração da empresa cliente com a
            WhatsApp Business Platform: vincular o portfólio empresarial e a
            WABA, registrar e verificar números, publicar o perfil comercial,
            criar e acompanhar templates e assinar os webhooks.
          </li>
          <li>
            Enviar, receber, encaminhar e armazenar as mensagens do atendimento
            do cliente, incluindo o funcionamento do agente de inteligência
            artificial, a distribuição das conversas entre atendentes e o
            histórico de cada conversa.
          </li>
          <li>
            Exibir, ao cliente, relatórios operacionais sobre o próprio
            atendimento — volume de mensagens, tempo de resposta, status de
            entrega e desempenho dos templates.
          </li>
          <li>
            Prestar suporte técnico, investigar falhas e restaurar o serviço
            depois de um incidente.
          </li>
          <li>
            Garantir a segurança da plataforma: prevenir fraude, abuso, spam e
            acesso não autorizado, e cumprir as políticas da Meta e do WhatsApp.
          </li>
          <li>
            Entender qual anúncio ou canal trouxe cada contato, para medir e
            melhorar as nossas campanhas.
          </li>
          <li>Faturar, cobrar e emitir documentos fiscais.</li>
          <li>Cumprir obrigações legais, regulatórias e ordens de autoridade.</li>
        </ul>
        <p>
          <Termo>O que não fazemos:</Termo> não vendemos dados pessoais, não
          alugamos nem cedemos bases de contatos, não usamos as mensagens dos
          clientes finais para publicidade própria e não usamos os dados obtidos
          pelas APIs da Meta para nenhuma finalidade além da operação do serviço
          contratado e das obrigações legais descritas aqui.
        </p>
      </Secao>

      <Secao id="bases-legais" titulo="6. Bases legais">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Consentimento</Termo> (art. 7º, I): contato comercial
            solicitado nos formulários do site, autorização da conexão com a
            Meta pelo Embedded Signup e sincronização do histórico no fluxo de
            Coexistência.
          </li>
          <li>
            <Termo>Execução de contrato e procedimentos preliminares</Termo>{" "}
            (art. 7º, V): fornecimento da plataforma, manutenção da integração,
            suporte, cobrança e atendimento de propostas que você pediu.
          </li>
          <li>
            <Termo>Cumprimento de obrigação legal ou regulatória</Termo>{" "}
            (art. 7º, II): guarda dos registros de acesso a aplicação de
            internet exigida pelo Marco Civil da Internet (Lei nº 12.965/2014) e
            guarda de documentos fiscais e contábeis.
          </li>
          <li>
            <Termo>Legítimo interesse</Termo> (art. 7º, IX): segurança da
            plataforma, prevenção a fraude e abuso, melhoria do serviço e
            mensuração das nossas próprias campanhas de divulgação, sempre
            avaliando o impacto sobre você e preservando os seus direitos.
          </li>
          <li>
            <Termo>Exercício regular de direitos</Termo> (art. 7º, VI): defesa
            em processo judicial, administrativo ou arbitral.
          </li>
        </ul>
        <p>
          Nas conversas que o nosso cliente conduz, a base legal é definida por
          ele, na condição de controlador. A CompanyChat trata esses dados
          apenas conforme as instruções recebidas e o contrato firmado.
        </p>
      </Secao>

      <Secao id="meta" titulo="7. Uso das APIs e dos produtos da Meta">
        <p>
          A CompanyChat é integrada à WhatsApp Business Platform. Os produtos e
          as permissões que usamos, e para que servem, são estes:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Facebook Login for Business:</Termo> autentica a pessoa que
            está autorizando a conexão e devolve o token de acesso do negócio.
            Da permissão <code>public_profile</code> recebemos apenas
            identificador, nome e foto do perfil público, usados para registrar
            quem autorizou.
          </li>
          <li>
            <Termo>WhatsApp Embedded Signup:</Termo> fluxo em que você cria ou
            seleciona o portfólio empresarial e a conta do WhatsApp Business,
            registra o número e concede as permissões, tudo dentro da própria
            interface da Meta. As credenciais que você digita ficam com a Meta —
            a CompanyChat não as recebe, não as vê e não as armazena.
          </li>
          <li>
            <Termo>WhatsApp Business App Coexistence (Coexistência):</Termo>{" "}
            permite manter o aplicativo WhatsApp Business no celular e, ao mesmo
            tempo, atender pela plataforma no mesmo número. Quando você autoriza
            expressamente, a Meta sincroniza a lista de contatos e o histórico
            recente de conversas para a plataforma, para que o atendimento não
            recomece do zero. Sem essa autorização, nenhum histórico é
            importado.
          </li>
          <li>
            <Termo>WhatsApp Cloud API:</Termo> canal pelo qual as mensagens são
            enviadas e recebidas e pelo qual consultamos e atualizamos contas,
            números, perfil comercial e templates.
          </li>
          <li>
            <Termo>
              Permissão <code>whatsapp_business_management</code>:
            </Termo>{" "}
            ler e gerenciar a configuração da conta do WhatsApp Business —
            números, perfil comercial, templates de mensagem e assinatura de
            webhooks.
          </li>
          <li>
            <Termo>
              Permissão <code>whatsapp_business_messaging</code>:
            </Termo>{" "}
            enviar e receber mensagens em nome da empresa cliente e consultar o
            status de entrega dessas mensagens.
          </li>
          <li>
            <Termo>Meta Pixel:</Termo> nas páginas de campanha do site, para
            medir quais anúncios geram visitas e cadastros. Ele não é usado
            dentro da plataforma de atendimento e não tem acesso a conversas.
          </li>
        </ul>
        <p>
          Usamos os dados obtidos pelas APIs da Meta exclusivamente para
          fornecer e manter o serviço contratado. Não os transferimos para
          terceiros com finalidade publicitária, não os agregamos a bases de
          dados vendidas ou licenciadas, não os usamos para determinar
          elegibilidade a crédito, seguro, emprego ou moradia e não os
          empregamos para vigilância ou para identificar pessoas em contextos
          alheios ao atendimento. Cumprimos as{" "}
          <LinkExterno href="https://developers.facebook.com/terms/">
            políticas para desenvolvedores da Meta
          </LinkExterno>{" "}
          e as políticas comerciais do WhatsApp.
        </p>
        <p>
          O conteúdo das mensagens do WhatsApp é criptografado em trânsito entre
          o WhatsApp e a Meta. A partir do momento em que a Cloud API entrega a
          mensagem à plataforma, o conteúdo fica acessível à empresa cliente e à
          CompanyChat na medida necessária para operar o atendimento —{" "}
          <Termo>
            conversas com empresas que usam a Cloud API não têm criptografia de
            ponta a ponta na mesma extensão de uma conversa entre duas pessoas
          </Termo>
          , e isso é informado por transparência.
        </p>
      </Secao>

      <Secao
        id="compartilhamento"
        titulo="8. Compartilhamento com operadores e provedores"
      >
        <p>
          Não vendemos os seus dados. Eles são compartilhados apenas com quem é
          necessário para a operação, sempre sob contrato, com finalidade
          limitada e dever de confidencialidade:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Meta Platforms</Termo> (WhatsApp Business Platform, Cloud
            API, Facebook Login for Business e Meta Pixel): trânsito das
            mensagens, gestão da conta do WhatsApp Business e mensuração das
            nossas campanhas.
          </li>
          <li>
            <Termo>Provedores de infraestrutura em nuvem</Termo>: hospedagem da
            aplicação, banco de dados, armazenamento de arquivos e mídias,
            backup e monitoramento. Armazenam os dados em nosso nome e sob as
            nossas instruções.
          </li>
          <li>
            <Termo>Provedores de e-mail e de comunicação</Termo>: envio de
            mensagens transacionais e atendimento de suporte.
          </li>
          <li>
            <Termo>Provedores de modelos de inteligência artificial</Termo>:
            geração das respostas do agente de IA a partir do conteúdo da
            conversa e da base de conhecimento do cliente, quando o cliente
            contrata esse recurso. O conteúdo enviado é limitado ao necessário
            para produzir a resposta.
          </li>
          <li>
            <Termo>Prestadores de serviços contábeis, fiscais e jurídicos</Termo>
            : emissão de notas fiscais, obrigações acessórias e defesa de
            direitos.
          </li>
          <li>
            <Termo>A própria empresa cliente</Termo>, quando os dados são de uma
            conversa conduzida por ela: o conteúdo fica disponível aos
            atendentes e administradores que ela autorizar.
          </li>
          <li>
            <Termo>Autoridades públicas</Termo>: quando houver obrigação legal,
            requisição regular ou ordem judicial.
          </li>
        </ul>
        <p>
          Você pode pedir a relação atualizada dos nossos operadores pelo e-mail
          de contato desta política.
        </p>
      </Secao>

      <Secao
        id="transferencia"
        titulo="9. Transferência e armazenamento internacional"
      >
        <p>
          A infraestrutura principal da plataforma fica hospedada em servidores
          contratados pela CompanyChat. Ainda assim, parte do tratamento ocorre
          fora do Brasil, porque a Meta Platforms opera a WhatsApp Business
          Platform em infraestrutura global: mensagens, identificadores de
          conta, números e templates transitam e são processados em servidores
          da Meta em outros países, entre eles os Estados Unidos e países da
          União Europeia.
        </p>
        <p>
          Provedores de nuvem, de e-mail e de modelos de inteligência artificial
          também podem processar dados fora do país. Nesses casos, a
          transferência internacional se apoia nas hipóteses do art. 33 da LGPD
          — em especial a necessidade para a execução do contrato e as cláusulas
          contratuais e garantias de proteção assumidas por esses fornecedores —
          e exigimos deles nível de proteção compatível com a lei brasileira.
        </p>
      </Secao>

      <Secao id="retencao" titulo="10. Prazo de retenção">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>Contatos e leads do site:</Termo> enquanto durar o
            relacionamento comercial e por até 5 anos após o último contato.
          </li>
          <li>
            <Termo>Dados cadastrais e contratuais do cliente:</Termo> durante a
            vigência do contrato e por até 5 anos após o encerramento, prazo da
            prescrição das pretensões cíveis e das obrigações fiscais.
          </li>
          <li>
            <Termo>
              Identificadores e configurações da integração com a Meta (WABA,
              números, perfil comercial, templates e webhooks):
            </Termo>{" "}
            enquanto a integração estiver ativa. Após a desconexão ou o fim do
            contrato, são excluídos ou anonimizados em até 90 dias.
          </li>
          <li>
            <Termo>
              Mensagens, mídias, contatos e histórico de conversas:
            </Termo>{" "}
            durante a vigência do contrato, conforme o período de retenção que o
            cliente definir, e por até 90 dias após o encerramento — janela
            destinada à exportação dos dados pelo cliente. Depois disso, são
            eliminados.
          </li>
          <li>
            <Termo>Tokens de acesso emitidos pela Meta:</Termo> revogados e
            eliminados imediatamente na desconexão da integração ou no
            encerramento do contrato.
          </li>
          <li>
            <Termo>Registros de acesso a aplicação de internet:</Termo> 6 meses,
            conforme o art. 15 do Marco Civil da Internet.
          </li>
          <li>
            <Termo>Documentos fiscais e contábeis:</Termo> 5 anos, conforme a
            legislação tributária.
          </li>
        </ul>
        <p>
          Encerrado o prazo, os dados são eliminados de forma segura ou
          anonimizados de modo irreversível. Dados necessários ao exercício
          regular de direitos em processo judicial, administrativo ou arbitral
          podem ser conservados até o fim do processo, ainda que os prazos acima
          tenham vencido.
        </p>
      </Secao>

      <Secao id="seguranca" titulo="11. Segurança">
        <p>
          Adotamos medidas técnicas e administrativas para proteger os dados
          contra acessos não autorizados e situações acidentais ou ilícitas de
          destruição, perda, alteração, comunicação ou difusão. Entre elas:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            tráfego cifrado com HTTPS/TLS em todas as páginas, APIs e webhooks;
          </li>
          <li>
            verificação da assinatura criptográfica de todo evento recebido da
            Meta, para que nenhum terceiro consiga injetar dados na plataforma;
          </li>
          <li>
            tokens de acesso e demais segredos guardados de forma cifrada, fora
            do código-fonte e nunca exibidos em telas, e-mails, relatórios ou
            registros de log;
          </li>
          <li>
            controle de acesso por perfil, com acesso a conversas restrito às
            pessoas autorizadas pela empresa cliente e acesso interno limitado
            ao pessoal que precisa dele para operar e dar suporte;
          </li>
          <li>
            limitação de taxa de requisições e proteções contra abuso nas rotas
            públicas;
          </li>
          <li>backups periódicos e monitoramento da disponibilidade.</li>
        </ul>
        <p>
          Nenhum sistema é infalível. Se ocorrer incidente de segurança com
          risco relevante aos titulares, comunicaremos os afetados e a
          Autoridade Nacional de Proteção de Dados (ANPD) nos prazos e na forma
          previstos na LGPD.
        </p>
      </Secao>

      <Secao id="direitos" titulo="12. Direitos dos titulares">
        <p>A LGPD garante a você o direito de solicitar, a qualquer momento:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>confirmação de que tratamos os seus dados e acesso a eles;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>
            anonimização, bloqueio ou eliminação de dados desnecessários,
            excessivos ou tratados em desconformidade com a lei;
          </li>
          <li>portabilidade dos dados a outro fornecedor;</li>
          <li>eliminação dos dados tratados com base no seu consentimento;</li>
          <li>
            informação sobre com quem compartilhamos os seus dados e sobre a
            possibilidade de não fornecer consentimento e as consequências disso;
          </li>
          <li>
            revogação do consentimento e oposição a tratamentos fundados em
            legítimo interesse que você considere irregulares;
          </li>
          <li>
            revisão de decisões tomadas unicamente de forma automatizada que
            afetem os seus interesses.
          </li>
        </ul>
        <p>
          Para exercer qualquer um deles, escreva para{" "}
          <a
            href={email}
            className="text-primary-text underline underline-offset-4"
          >
            {EMAIL_PRIVACIDADE}
          </a>{" "}
          ou nos chame no{" "}
          <LinkExterno href={whatsapp}>WhatsApp +55 64 9305-4630</LinkExterno>.
          Confirmamos o recebimento em até {PRAZO_CONFIRMACAO} e respondemos em
          até {PRAZO_ATENDIMENTO}. Se os dados estiverem sob a
          responsabilidade de uma empresa cliente, encaminhamos a solicitação a
          ela e informamos você.
        </p>
        <p>
          Para interromper o contato comercial pelo WhatsApp, basta responder à
          conversa pedindo para parar, ou tocar em &quot;Não tenho
          interesse&quot; na mensagem que enviamos. O registro é imediato e
          nenhuma automação volta a procurar você.
        </p>
        <p>
          Você também pode apresentar reclamação à{" "}
          <LinkExterno href="https://www.gov.br/anpd/pt-br">
            Autoridade Nacional de Proteção de Dados (ANPD)
          </LinkExterno>
          .
        </p>
      </Secao>

      <Secao id="revogacao" titulo="13. Revogação da integração com a Meta">
        <p>
          Você pode encerrar a integração a qualquer momento, sem custo e sem
          precisar justificar. Há três caminhos, e qualquer um deles interrompe
          o acesso da CompanyChat aos dados da sua conta do WhatsApp Business:
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
            ou pelo suporte. Revogamos o token de acesso, cancelamos a
            assinatura dos webhooks e desvinculamos o número da plataforma.
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
            <Termo>Pelas configurações do seu perfil:</Termo> em{" "}
            <Termo>Configurações → Aplicativos e sites</Termo> da sua conta
            Meta, remova a autorização concedida à CompanyChat pelo Facebook
            Login for Business.
          </li>
        </ul>
        <p>
          A revogação interrompe o envio e o recebimento de novas mensagens pela
          plataforma. Os dados já armazenados seguem os prazos da seção 10 —
          para apagá-los antes disso, use a página de{" "}
          <LinkInterno href="/exclusao-de-dados">Exclusão de Dados</LinkInterno>
          .
        </p>
      </Secao>

      <Secao id="exclusao" titulo="14. Exclusão dos dados">
        <p>
          Você pode pedir a exclusão dos seus dados a qualquer momento, sem
          precisar de conta, login ou contrato ativo. O procedimento completo —
          o que informar, para onde escrever, o que é apagado, o que a lei nos
          obriga a reter e como você recebe a confirmação — está descrito na
          página{" "}
          <LinkInterno href="/exclusao-de-dados">
            Exclusão de Dados
          </LinkInterno>
          .
        </p>
        <p>
          Em resumo: escreva para{" "}
          <a
            href={email}
            className="text-primary-text underline underline-offset-4"
          >
            {EMAIL_PRIVACIDADE}
          </a>{" "}
          com o assunto <Termo>Exclusão de dados</Termo>. Confirmamos o
          recebimento em até {PRAZO_CONFIRMACAO} e concluímos em até{" "}
          {PRAZO_ATENDIMENTO}, informando por escrito o que foi eliminado e o
          que precisou ser retido por obrigação legal.
        </p>
      </Secao>

      <Secao id="cookies" titulo="15. Cookies e o Pixel da Meta">
        <p>
          Utilizamos o Meta Pixel, tecnologia da Meta Platforms, nas páginas de
          campanha do site, para saber quais anúncios geram visitas e cadastros e
          para exibir anúncios a pessoas com perfil semelhante ao dos nossos
          clientes. O Pixel pode registrar a sua visita e o envio do formulário,
          além de usar cookies no seu navegador.
        </p>
        <p>
          Você pode gerenciar isso nas{" "}
          <LinkExterno href="https://www.facebook.com/adpreferences/ad_settings">
            preferências de anúncios da Meta
          </LinkExterno>{" "}
          ou bloquear cookies nas configurações do seu navegador. Bloquear
          cookies não impede o uso do site nem o envio do formulário, e as
          páginas de Política de Privacidade, Termos de Serviço e Exclusão de
          Dados funcionam sem nenhum cookie.
        </p>
      </Secao>

      <Secao id="menores" titulo="16. Crianças e adolescentes">
        <p>
          A plataforma CompanyChat é destinada a empresas e a pessoas maiores de
          18 anos. Não coletamos intencionalmente dados de crianças e de
          adolescentes. Se identificarmos esse tipo de dado sem base legal
          adequada, eliminamos o registro. Se você é responsável e acredita que
          um dado assim foi enviado, escreva para o e-mail desta política.
        </p>
      </Secao>

      <Secao id="contato" titulo="17. Contato do responsável pela privacidade">
        <p>
          O encarregado pelo tratamento de dados pessoais (DPO) da{" "}
          {RAZAO_SOCIAL} pode ser acionado pelos canais abaixo. É o mesmo canal
          para exercer direitos, tirar dúvidas sobre esta política e comunicar
          incidentes.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Termo>
              Encarregado pelo tratamento de dados pessoais (DPO):
            </Termo>{" "}
            {DPO_NOME}
          </li>
          <li>
            <Termo>E-mail:</Termo>{" "}
            <a
              href={email}
              className="text-primary-text underline underline-offset-4"
            >
              {EMAIL_PRIVACIDADE}
            </a>
          </li>
          <li>
            <Termo>WhatsApp:</Termo>{" "}
            <LinkExterno href={whatsapp}>+55 64 9305-4630</LinkExterno>
          </li>
          <li>
            <Termo>Endereço:</Termo> {CIDADE_SEDE}
          </li>
          <li>
            <Termo>Prazo de resposta:</Termo> confirmação em até{" "}
            {PRAZO_CONFIRMACAO} e resposta conclusiva em até{" "}
            {PRAZO_ATENDIMENTO}.
          </li>
        </ul>
      </Secao>

      <Secao id="alteracoes" titulo="18. Alterações desta política">
        <p>
          Podemos atualizar este documento para refletir mudanças na nossa
          operação, nos produtos da Meta que utilizamos ou na legislação. A data
          de última atualização no topo da página sempre indica a versão
          vigente. Quando a mudança for relevante, avisamos os clientes ativos
          pelos canais de contato cadastrados antes de ela passar a valer.
        </p>
        <p>
          <Termo>Última atualização:</Termo> {ATUALIZADO_PRIVACIDADE}.
        </p>
      </Secao>
    </PaginaLegal>
  );
}
