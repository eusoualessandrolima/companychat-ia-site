import {
  AlarmClock,
  Bot,
  CalendarCheck,
  CalendarX2,
  ClipboardList,
  Headset,
  KanbanSquare,
  MessagesSquare,
  Moon,
  Repeat2,
  Scale,
  Sparkles,
  UserCheck,
} from "lucide-react";
import type { LPConteudo } from "@/components/lp/tipos";

/** LP ADV: advogados e escritórios de advocacia. A IA faz atendimento
 *  administrativo; a copy deixa explícito que ela não orienta juridicamente. */
export const advogados: LPConteudo = {
  slug: "/lp-adv",

  selo: {
    icone: Scale,
    texto: "Para advogados e escritórios de advocacia",
  },

  hero: {
    inicio: "Pare de perder clientes",
    destaque: "no WhatsApp",
    descricao:
      "A CompanyChat IA responde na hora, entende o caso, agenda a consulta e acompanha cada contato, 24 horas por dia, inclusive no fim de semana em que a urgência aparece.",
    cta: "Quero ver a IA atendendo",
  },

  problema: {
    rotulo: "O vazamento silencioso",
    titulo: "Quem procura advogado está com pressa.",
    tituloSuave: "E fecha com quem responde primeiro.",
    descricao:
      "Ninguém manda mensagem para um escritório por curiosidade: existe um problema urgente do outro lado. Cada hora sem resposta é um cliente fechando com outro escritório.",
    itens: [
      {
        icone: Moon,
        titulo: "O cliente chama às 22h",
        consequencia:
          "Urgência jurídica não escolhe horário. Sem resposta, ele aciona o próximo da lista.",
      },
      {
        icone: AlarmClock,
        titulo: "A resposta espera a audiência acabar",
        consequencia:
          "Quem precisa de advogado decide rápido, e o seu horário de responder é o horário de ele desistir.",
      },
      {
        icone: CalendarX2,
        titulo: "Consulta marcada, cliente que não aparece",
        consequencia:
          "Sem confirmação de véspera, o horário reservado do advogado vira tempo perdido.",
      },
      {
        icone: Repeat2,
        titulo: "Secretária repetindo o básico",
        consequencia:
          "Área de atuação, valor da consulta e endereço o dia inteiro, enquanto os prazos correm.",
      },
    ],
  },

  calculadora: {
    titulo: "Quanto a demora está custando por mês?",
    descricao:
      "Coloque os números do seu escritório e veja uma estimativa do que fica na mesa quando contatos não viram consulta e consultas não viram comparecimento.",
    rotuloContatos: "Contatos no WhatsApp por mês",
    rotuloConv1: "% que agenda consulta",
    rotuloConv2: "% que comparece",
    rotuloTicket: "Honorário médio (R$)",
    nomeConv1: "agendamento",
    nomeConv2: "comparecimento",
    padrao: { contatos: 100, conv1: 30, conv2: 70, ticket: 1500 },
    possivel: { conv1: 45, conv2: 85 },
  },

  mecanismo: {
    titulo:
      "Do “oi” à consulta confirmada, sem ninguém do seu escritório no teclado",
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
          "O cliente conta o problema do jeito dele; a IA pergunta só o que falta.",
      },
      {
        fase: "Qualificação",
        icone: UserCheck,
        titulo: "Qualifica a conversa",
        descricao:
          "Área do direito, urgência e cidade, sem dar orientação jurídica.",
      },
      {
        fase: "Agendamento",
        icone: CalendarCheck,
        titulo: "Agenda e confirma a consulta",
        descricao:
          "Marca o horário com o advogado certo e envia lembrete de véspera.",
      },
      {
        fase: "Registro",
        icone: KanbanSquare,
        titulo: "Registra tudo no CRM",
        descricao:
          "Cada contato vira um card no funil: nenhum caso se perde na conversa.",
      },
      {
        fase: "Transbordo",
        icone: Headset,
        titulo: "Chama um humano quando precisa",
        descricao:
          "Urgência e questão jurídica vão direto para o advogado responsável.",
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
          "Antes de ativar, mapeamos como o seu escritório atende hoje: canais, horários, perguntas repetidas e onde os clientes desistem.",
        artefato: "Diagnóstico do fluxo de atendimento",
      },
      {
        indice: "02",
        tipo: "Método",
        icone: Scale,
        titulo: "Funil de consultas",
        descricao:
          "Responder, qualificar, agendar, confirmar e acompanhar: cada etapa com dono e registrada no CRM, em vez de conversa solta no celular da secretária.",
        artefato: "Fluxo aplicado à sua área de atuação",
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
    rotulo: "Feita para a advocacia",
    titulo: "Para todas as áreas de atuação",
    itens: [
      "Trabalhista",
      "Previdenciário",
      "Família e sucessões",
      "Cível",
      "Criminal",
      "Tributário",
      "Empresarial",
      "Direito do consumidor",
      "Imobiliário",
      "Bancário",
      "Digital e LGPD",
      "Condominial",
    ],
  },

  comparacao: {
    titulo: "O mesmo WhatsApp, dois escritórios diferentes",
    tituloAntes: "Atendimento manual",
    antes: [
      "Resposta só em horário comercial",
      "Consultas perdidas por falta de confirmação",
      "Contatos anotados em papel e planilha",
      "Secretária presa em pergunta repetida",
    ],
    depois: [
      "Resposta em segundos, 24 horas por dia",
      "Consulta confirmada na véspera",
      "Todo contato registrado no CRM",
      "Equipe focada nos processos e nos prazos",
    ],
  },

  oferta: {
    badge: "Implantação e treinamento inclusos",
    titulo: "Veja a IA atendendo como se já fosse o seu escritório",
    descricao:
      "Preencha ao lado e fale com a nossa IA no WhatsApp. Ela já chega sabendo a sua área, e você sente na pele o que o seu cliente sentiria.",
    bullets: [
      "Demonstração ao vivo com a IA no seu WhatsApp",
      "Diagnóstico do seu atendimento atual",
      "Proposta com escopo e valor fechados",
      "Sem compromisso e sem taxa de setup",
    ],
  },

  form: {
    rotuloEmpresa: "Qual é o nome do escritório?",
    exemploEmpresa: "Ex.: Silva & Associados",
    rotuloSegmento: "Qual é a sua principal área?",
    outroSegmento: "Outra área do direito",
    waRotuloEmpresa: "Escritório",
    sucessoComo: "um cliente do seu escritório",
  },

  faq: {
    titulo: "O que todo escritório pergunta antes",
    itens: [
      {
        pergunta: "Serve para a minha área de atuação?",
        resposta:
          "A IA é treinada com as informações do seu escritório: áreas de atuação, forma de trabalhar, valores de consulta e regras de agendamento. Atende bem tanto o escritório de área única quanto o full service.",
      },
      {
        pergunta: "A IA dá orientação jurídica ao cliente?",
        resposta:
          "Não. A IA cuida do atendimento administrativo: recepção, qualificação, agendamento, confirmação e follow-up. Ela não analisa casos, não emite opinião jurídica e não substitui o advogado. Qualquer questão jurídica é encaminhada para a sua equipe.",
      },
      {
        pergunta: "E o sigilo das informações?",
        resposta:
          "As conversas ficam registradas no seu CRM, acessíveis apenas à sua equipe. A IA coleta somente o necessário para qualificar e agendar, e casos sensíveis vão direto para um humano.",
      },
      {
        pergunta: "A IA entende áudio e foto?",
        resposta:
          "Sim. O cliente pode mandar áudio ou foto de um documento, e a IA entende e responde de acordo. Quem está em uma situação difícil prefere falar a digitar.",
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
