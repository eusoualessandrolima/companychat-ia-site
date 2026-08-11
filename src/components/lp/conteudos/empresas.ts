import {
  AlarmClock,
  Bot,
  Briefcase,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileClock,
  Headset,
  KanbanSquare,
  MessagesSquare,
  Moon,
  Repeat2,
  Sparkles,
  UserCheck,
} from "lucide-react";
import type { LPConteudo } from "@/components/lp/tipos";

/** LP Empresas: a versão genérica, para pequenas e médias empresas de
 *  qualquer segmento. */
export const empresas: LPConteudo = {
  slug: "/lp-empresas",

  selo: {
    icone: Building2,
    texto: "Para pequenas e médias empresas",
  },

  hero: {
    inicio: "Pare de perder clientes",
    destaque: "no WhatsApp",
    descricao:
      "A CompanyChat IA responde em segundos, qualifica o cliente, agenda e acompanha cada conversa, 24 horas por dia, inclusive quando a sua empresa está fechada.",
    cta: "Quero ver a IA atendendo",
  },

  problema: {
    rotulo: "O vazamento silencioso",
    titulo: "Sua empresa não precisa de mais leads.",
    tituloSuave: "Precisa parar de perder os que já chamam.",
    descricao:
      "Quem chama uma empresa no WhatsApp está pronto para comprar. O que decide é a velocidade e a constância da resposta. É exatamente aí que o atendimento manual vaza.",
    itens: [
      {
        icone: Moon,
        titulo: "O cliente chama às 21h",
        consequencia:
          "Sem resposta na hora, ele compra de quem respondeu primeiro na manhã seguinte.",
      },
      {
        icone: AlarmClock,
        titulo: "A resposta demora horas",
        consequencia:
          "Cada hora no vácuo esfria o interesse, e o concorrente está a um clique de distância.",
      },
      {
        icone: FileClock,
        titulo: "Orçamento enviado, silêncio depois",
        consequencia:
          "Sem follow-up, a proposta morre na caixa de entrada e ninguém percebe.",
      },
      {
        icone: Repeat2,
        titulo: "Equipe repetindo o básico",
        consequencia:
          "Preço, prazo e endereço o dia inteiro, enquanto quem quer fechar espera atenção.",
      },
    ],
  },

  calculadora: {
    titulo: "Quanto a demora está custando por mês?",
    descricao:
      "Coloque os números da sua empresa e veja uma estimativa do que fica na mesa quando contatos não viram proposta e propostas não viram fechamento.",
    rotuloContatos: "Contatos no WhatsApp por mês",
    rotuloConv1: "% que recebe proposta",
    rotuloConv2: "% que fecha",
    rotuloTicket: "Ticket médio (R$)",
    nomeConv1: "proposta",
    nomeConv2: "fechamento",
    padrao: { contatos: 300, conv1: 40, conv2: 25, ticket: 400 },
    possivel: { conv1: 55, conv2: 35 },
  },

  mecanismo: {
    titulo: "Do “oi” ao negócio fechado, sem ninguém da sua equipe no teclado",
    etapas: [
      {
        fase: "Entrada",
        icone: MessagesSquare,
        titulo: "O cliente chama no WhatsApp",
        descricao:
          "A IA responde em segundos, de madrugada, no domingo e no feriado.",
      },
      {
        fase: "Entendimento",
        icone: Bot,
        titulo: "Entende texto, áudio e foto",
        descricao: "O cliente fala do jeito dele; a IA pergunta só o que falta.",
      },
      {
        fase: "Qualificação",
        icone: UserCheck,
        titulo: "Qualifica a conversa",
        descricao:
          "Produto, urgência e orçamento, antes de ocupar o seu time de vendas.",
      },
      {
        fase: "Agendamento",
        icone: CalendarCheck,
        titulo: "Agenda e faz o acompanhamento",
        descricao:
          "Marca a conversa com o vendedor certo e envia lembrete para ninguém esquecer.",
      },
      {
        fase: "Registro",
        icone: KanbanSquare,
        titulo: "Registra tudo no CRM",
        descricao:
          "Cada conversa vira um card no funil: ninguém some sem deixar rastro.",
      },
      {
        fase: "Transbordo",
        icone: Headset,
        titulo: "Chama um humano quando precisa",
        descricao:
          "Negociação e caso fora do escopo vão direto para a sua equipe.",
      },
    ],
  },

  provas: {
    titulo: "Autoridade se demonstra trabalhando, não prometendo",
    itens: [
      {
        indice: "01",
        tipo: "Diagnóstico",
        icone: ClipboardList,
        titulo: "Mapa do seu atendimento",
        descricao:
          "Antes de ativar, mapeamos como a sua empresa atende hoje: canais, horários, perguntas repetidas e onde os clientes desistem.",
        artefato: "Diagnóstico do fluxo de atendimento",
      },
      {
        indice: "02",
        tipo: "Método",
        icone: Briefcase,
        titulo: "Funil de vendas no WhatsApp",
        descricao:
          "Responder, qualificar, orçar, acompanhar e recuperar: cada etapa com dono e registrada no CRM, em vez de conversa solta no celular.",
        artefato: "Fluxo aplicado ao seu segmento",
      },
      {
        indice: "03",
        tipo: "Execução",
        icone: Sparkles,
        titulo: "A IA atendendo de verdade",
        descricao:
          "O WhatsApp oficial da CompanyChat IA é atendido pela mesma IA que você vai contratar. É a demonstração mais honesta que existe.",
        artefato: "Teste ao vivo no fim desta página",
      },
    ],
  },

  nichos: {
    rotulo: "Feita para o seu segmento",
    titulo: "Do balcão da loja ao carrinho do e-commerce",
    itens: [
      "Comércio e lojas",
      "E-commerce",
      "Restaurantes e delivery",
      "Imobiliárias",
      "Escolas e cursos",
      "Agências de marketing",
      "Contabilidade",
      "Oficinas mecânicas",
      "Salões de beleza e barbearias",
      "Energia solar",
      "Construção e reformas",
      "Turismo e viagens",
      "Pet shops",
      "Tecnologia e software",
      "Indústria",
      "Serviços em geral",
    ],
  },

  comparacao: {
    titulo: "O mesmo WhatsApp, duas operações diferentes",
    tituloAntes: "Atendimento manual",
    antes: [
      "Resposta só em horário comercial",
      "Orçamentos enviados e esquecidos",
      "Conversas perdidas no celular de cada um",
      "Equipe presa em pergunta repetida",
    ],
    depois: [
      "Resposta em segundos, 24 horas por dia",
      "Follow-up e lembrete automáticos",
      "Todo contato registrado no CRM",
      "Equipe focada em fechar negócio",
    ],
  },

  oferta: {
    badge: "Implantação e treinamento inclusos",
    titulo: "Veja a IA atendendo como se já fosse a sua empresa",
    descricao:
      "Preencha ao lado e fale com a nossa IA no WhatsApp. Ela já chega sabendo o seu segmento, e você sente na pele o que o seu cliente sentiria.",
    bullets: [
      "Demonstração ao vivo com a IA no seu WhatsApp",
      "Diagnóstico do seu atendimento atual",
      "Proposta com escopo e valor fechados",
      "Sem compromisso e sem taxa de setup",
    ],
  },

  form: {
    rotuloEmpresa: "Qual é o nome da sua empresa?",
    exemploEmpresa: "Ex.: Empresa Modelo",
    rotuloSegmento: "Qual é o seu segmento?",
    outroSegmento: "Outro segmento",
    waRotuloEmpresa: "Empresa",
    sucessoComo: "um cliente da sua empresa",
  },

  faq: {
    titulo: "O que toda empresa pergunta antes",
    itens: [
      {
        pergunta: "Serve para o meu segmento?",
        resposta:
          "A IA é treinada com as informações do seu negócio: produtos, serviços, preços, prazos e regras. Atendemos comércio, serviços, indústria, e-commerce, imobiliárias, escolas e praticamente qualquer empresa que venda pelo WhatsApp.",
      },
      {
        pergunta: "E se a IA não souber responder?",
        resposta:
          "Ela transfere a conversa para a sua equipe na hora, com todo o histórico. Casos delicados, reclamações e o que fugir do escopo nunca ficam presos na automação.",
      },
      {
        pergunta: "A IA entende áudio e foto?",
        resposta:
          "Sim. O cliente pode mandar áudio, foto ou documento, e a IA entende e responde de acordo. Muita gente prefere falar a digitar, e a venda não pode travar por isso.",
      },
      {
        pergunta: "A IA negocia preço sozinha?",
        resposta:
          "Não. Ela segue as regras que você definir: informa preços e condições de tabela, qualifica o cliente e agenda a conversa. Negociação e decisão comercial ficam sempre com o seu time.",
      },
      {
        pergunta: "Quanto custa?",
        resposta:
          "Os planos começam em R$ 497 por mês, com implantação e treinamento inclusos e sem taxa de setup. Projetos maiores têm proposta sob medida, com escopo e valor fechados antes de começar.",
      },
      {
        pergunta: "Como começo?",
        resposta:
          "Preencha o formulário desta página. Você conversa com a nossa IA no WhatsApp, vê como ela atende na prática e depois fazemos o diagnóstico do seu atendimento, sem compromisso.",
      },
    ],
  },

  ctaFinal: {
    titulo: "Enquanto você lê isto, tem cliente esperando resposta",
    descricao:
      "Leva menos de um minuto para preencher, e a demonstração acontece no seu próprio WhatsApp, sem compromisso.",
  },
};
