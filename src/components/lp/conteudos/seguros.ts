import {
  AlarmClock,
  Bot,
  CalendarX2,
  ClipboardList,
  FileCheck,
  Headset,
  KanbanSquare,
  MessagesSquare,
  Moon,
  Repeat2,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import type { LPConteudo } from "@/components/lp/tipos";

/** LP Seguros: corretoras e corretores de seguros. A IA coleta dados e
 *  organiza; cotação final e emissão continuam com o corretor. */
export const seguros: LPConteudo = {
  slug: "/lp-seguros",

  selo: {
    icone: ShieldCheck,
    texto: "Para corretoras e corretores de seguros",
  },

  hero: {
    inicio: "Pare de perder cotações",
    destaque: "no WhatsApp",
    descricao:
      "A CompanyChat IA responde em segundos, coleta os dados da cotação, acompanha renovações e atende o seu cliente 24 horas por dia, inclusive na hora em que ele mais precisa de você.",
    cta: "Quero ver a IA atendendo",
  },

  problema: {
    rotulo: "O vazamento silencioso",
    titulo: "Cotação que esfria não fecha.",
    tituloSuave: "E renovação esquecida é cliente perdido.",
    descricao:
      "Quem pede cotação no WhatsApp está falando com outros corretores ao mesmo tempo. Velocidade na resposta e constância no acompanhamento decidem quem fica com a apólice.",
    itens: [
      {
        icone: Moon,
        titulo: "O cliente chama fora do horário",
        consequencia:
          "Sinistro e dúvida urgente não escolhem hora. Sem resposta, ele se sente sozinho justamente quando mais precisa.",
      },
      {
        icone: AlarmClock,
        titulo: "A cotação demora a sair",
        consequencia:
          "Enquanto a sua proposta não chega, outro corretor já mandou a dele.",
      },
      {
        icone: CalendarX2,
        titulo: "Renovação passa em branco",
        consequencia:
          "Sem lembrete, a apólice vence e o cliente renova com quem apareceu primeiro.",
      },
      {
        icone: Repeat2,
        titulo: "Corretor preso na coleta de dados",
        consequencia:
          "Placa, CEP, modelo e CPF digitados um a um, o dia inteiro, em vez de vender.",
      },
    ],
  },

  calculadora: {
    titulo: "Quanto a demora está custando por mês?",
    descricao:
      "Coloque os números da sua corretora e veja uma estimativa do que fica na mesa quando pedidos de cotação não viram proposta e propostas não viram apólice.",
    rotuloContatos: "Pedidos de cotação por mês",
    rotuloConv1: "% que recebe proposta",
    rotuloConv2: "% que fecha",
    rotuloTicket: "Receita média por apólice (R$)",
    nomeConv1: "proposta",
    nomeConv2: "fechamento",
    padrao: { contatos: 150, conv1: 50, conv2: 30, ticket: 400 },
    possivel: { conv1: 65, conv2: 40 },
  },

  mecanismo: {
    titulo:
      "Do “oi” à proposta na mão do corretor, sem ninguém da equipe no teclado",
    etapas: [
      {
        fase: "Entrada",
        icone: MessagesSquare,
        titulo: "O cliente chama no WhatsApp",
        descricao:
          "A IA responde em segundos, de madrugada, no fim de semana e no feriado.",
      },
      {
        fase: "Entendimento",
        icone: Bot,
        titulo: "Entende texto, áudio e foto",
        descricao:
          "O cliente manda foto do documento e áudio explicando; a IA entende tudo.",
      },
      {
        fase: "Coleta",
        icone: FileCheck,
        titulo: "Coleta os dados da cotação",
        descricao:
          "Ramo, placa, CEP e o que mais a cotação pedir, sem ocupar o corretor.",
      },
      {
        fase: "Qualificação",
        icone: UserCheck,
        titulo: "Qualifica e direciona",
        descricao:
          "Cotação nova, renovação ou sinistro: cada conversa vai para o fluxo certo.",
      },
      {
        fase: "Registro",
        icone: KanbanSquare,
        titulo: "Registra tudo no CRM",
        descricao:
          "Cada cotação vira um card no funil, com data de renovação à vista.",
      },
      {
        fase: "Transbordo",
        icone: Headset,
        titulo: "Chama um humano quando precisa",
        descricao:
          "Sinistro e negociação vão direto para o corretor responsável.",
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
          "Antes de ativar, mapeamos como a sua corretora atende hoje: canais, horários, perguntas repetidas e onde as cotações esfriam.",
        artefato: "Diagnóstico do fluxo de atendimento",
      },
      {
        indice: "02",
        tipo: "Método",
        icone: ShieldCheck,
        titulo: "Funil de cotações e renovações",
        descricao:
          "Responder, coletar, cotar, acompanhar e renovar: cada etapa com dono e registrada no CRM, em vez de conversa solta no celular de cada corretor.",
        artefato: "Fluxo aplicado ao seu ramo",
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
    rotulo: "Feita para o mercado segurador",
    titulo: "Para todos os ramos da corretora",
    itens: [
      "Seguro auto",
      "Seguro de vida",
      "Saúde e odontológico",
      "Seguro empresarial",
      "Residencial",
      "Frotas",
      "Seguro viagem",
      "Consórcios",
      "Previdência privada",
      "Condomínio",
      "Equipamentos e agro",
      "RC profissional",
    ],
  },

  comparacao: {
    titulo: "O mesmo WhatsApp, duas corretoras diferentes",
    tituloAntes: "Atendimento manual",
    antes: [
      "Resposta só em horário comercial",
      "Renovações controladas em planilha",
      "Dados de cotação coletados no teclado",
      "Cotações esquecidas sem follow-up",
    ],
    depois: [
      "Resposta em segundos, 24 horas por dia",
      "Renovação com lembrete automático",
      "Dados coletados pela IA, prontos para cotar",
      "Todo pedido registrado e acompanhado no CRM",
    ],
  },

  oferta: {
    badge: "Implantação e treinamento inclusos",
    titulo: "Veja a IA atendendo como se já fosse a sua corretora",
    descricao:
      "Preencha ao lado e fale com a nossa IA no WhatsApp. Ela já chega sabendo o seu ramo, e você sente na pele o que o seu segurado sentiria.",
    bullets: [
      "Demonstração ao vivo com a IA no seu WhatsApp",
      "Diagnóstico do seu atendimento atual",
      "Proposta com escopo e valor fechados",
      "Sem compromisso e sem taxa de setup",
    ],
  },

  form: {
    rotuloEmpresa: "Qual é o nome da corretora?",
    exemploEmpresa: "Ex.: Corretora Modelo",
    rotuloSegmento: "Qual é o seu principal ramo?",
    outroSegmento: "Outro ramo de seguros",
    waRotuloEmpresa: "Corretora",
    sucessoComo: "um segurado da sua corretora",
  },

  faq: {
    titulo: "O que toda corretora pergunta antes",
    itens: [
      {
        pergunta: "Serve para o meu ramo?",
        resposta:
          "A IA é treinada com as informações da sua corretora: ramos que você trabalha, seguradoras parceiras, dados que cada cotação exige e regras de atendimento. Funciona do corretor solo à corretora com vários produtores.",
      },
      {
        pergunta: "A IA faz a cotação e emite a apólice?",
        resposta:
          "Não. A IA coleta e organiza os dados, qualifica o pedido e entrega tudo pronto para o corretor cotar nas seguradoras e emitir. A responsabilidade técnica da operação continua com a corretora.",
      },
      {
        pergunta: "E quando o cliente aciona um sinistro?",
        resposta:
          "A IA acolhe na hora, coleta as primeiras informações e transfere imediatamente para o corretor responsável, com todo o histórico. É o momento em que responder rápido mais fideliza.",
      },
      {
        pergunta: "A IA entende áudio e foto?",
        resposta:
          "Sim. O cliente pode mandar foto do documento, da CNH ou da apólice atual e áudio explicando o que precisa. A IA entende e aproveita esses dados na cotação.",
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
    titulo: "Enquanto você lê isto, tem cotação esfriando",
    descricao:
      "Leva menos de um minuto para preencher, e a demonstração acontece no seu próprio WhatsApp, sem compromisso.",
  },
};
